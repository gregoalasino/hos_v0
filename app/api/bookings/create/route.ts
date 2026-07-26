import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

interface CreateBookingBody {
  classId: string;
  upsellIds: string[];
  personalData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    referralCode?: string;
    isHotelGuest: boolean;
    cloudbedsRef?: string;
  };
  packType: 'dropin' | 'pack5' | 'pack10' | null;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateBookingBody = await req.json();
    const { classId, upsellIds, personalData, packType, notes } = body;

    // ── 1. Validate required fields ──────────────────────────────────────────
    if (!classId || !personalData?.firstName || !personalData?.lastName || !personalData?.email) {
      return NextResponse.json({ error: 'missing_required_fields' }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // ── 2. Fetch & validate class ─────────────────────────────────────────────
    const { data: clase, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (classError || !clase) {
      return NextResponse.json({ error: 'class_not_found' }, { status: 400 });
    }
    if (!clase.is_active) {
      return NextResponse.json({ error: 'class_not_found' }, { status: 400 });
    }

    const now = Date.now();
    const startsAt = new Date(clase.starts_at).getTime();
    if (startsAt <= now) {
      return NextResponse.json({ error: 'class_not_found' }, { status: 400 });
    }
    const hoursUntilClass = (startsAt - now) / (1000 * 60 * 60);
    if (hoursUntilClass < 1) {
      return NextResponse.json({ error: 'booking_too_late' }, { status: 400 });
    }

    // ── 3. Validate referral code (non-blocking) ──────────────────────────────
    type CodeRow = {
      id: string;
      benefit_type: 'percentage' | 'fixed' | 'free_upsell';
      discount_percent: number | null;
      discount_fixed: number | null;
      free_upsell_id: string | null;
      usage_count: number;
    };
    let validCode: CodeRow | null = null;
    // A valid class-pack code makes the class itself free (upsells still charged).
    let packCode: string | null = null;

    if (personalData.referralCode?.trim()) {
      const upper = personalData.referralCode.trim().toUpperCase();
      const { data: codeRow } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', upper)
        .eq('is_active', true)
        .single();

      if (codeRow) {
        const codeNow = Date.now();
        const validFrom = codeRow.valid_from ? new Date(codeRow.valid_from).getTime() : null;
        const validUntil = codeRow.valid_until ? new Date(codeRow.valid_until).getTime() : null;
        const withinDates =
          (validFrom == null || codeNow >= validFrom) &&
          (validUntil == null || codeNow <= validUntil);
        const withinLimit =
          codeRow.usage_limit == null || codeRow.usage_count < codeRow.usage_limit;

        if (withinDates && withinLimit) {
          validCode = codeRow as CodeRow;
        }
      } else {
        // Not a referral code — maybe a paid class-pack code with uses remaining.
        const { data: packRow } = await supabase
          .from('pack_purchases')
          .select('status, classes_total, classes_used')
          .eq('code', upper)
          .single();
        if (
          packRow &&
          packRow.status === 'paid' &&
          packRow.classes_used < packRow.classes_total
        ) {
          packCode = upper;
        }
      }
    }

    // ── 4. Calculate total ────────────────────────────────────────────────────
    const classPrice = Number(clase.price_dropin_usd);
    let upsellsTotal = 0;

    if (upsellIds.length > 0) {
      const { data: upsellRows } = await supabase
        .from('upsells')
        .select('price_usd')
        .in('id', upsellIds);
      if (upsellRows) {
        upsellsTotal = upsellRows.reduce((acc, u) => acc + Number(u.price_usd), 0);
      }
    }

    // A pack code waives the class fee entirely (upsells still charged).
    let total = packCode ? upsellsTotal : classPrice + upsellsTotal;

    if (!packCode && validCode) {
      if (validCode.benefit_type === 'percentage' && validCode.discount_percent != null) {
        total = total - total * (validCode.discount_percent / 100);
      } else if (validCode.benefit_type === 'fixed' && validCode.discount_fixed != null) {
        total = Math.max(0, total - validCode.discount_fixed);
      } else if (validCode.benefit_type === 'free_upsell' && validCode.free_upsell_id) {
        const { data: freeUpsell } = await supabase
          .from('upsells')
          .select('price_usd')
          .eq('id', validCode.free_upsell_id)
          .single();
        if (freeUpsell) {
          total = Math.max(0, total - Number(freeUpsell.price_usd));
        }
      }
    }
    total = Math.round(total * 100) / 100;

    // ── 5. Decrement spots (atomic) ───────────────────────────────────────────
    const { data: rpcResult } = await supabase.rpc('decrement_spots', {
      p_class_id: classId,
    });

    const result = rpcResult as { success: boolean; error?: string } | null;
    if (!result?.success) {
      return NextResponse.json({ error: 'no_spots_available' }, { status: 409 });
    }

    // ── 6. Generate booking reference ─────────────────────────────────────────
    const { data: refData } = await supabase.rpc('generate_booking_reference');
    const bookingReference = (refData as string | null) ?? `HOS-${Date.now()}-XXXX`;

    // ── 7. Insert booking ─────────────────────────────────────────────────────
    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert({
        class_id: classId,
        first_name: personalData.firstName,
        last_name: personalData.lastName,
        email: personalData.email,
        phone: personalData.phone ?? null,
        upsell_ids: upsellIds,
        payment_status: 'pending',
        pack_type: packType,
        booking_reference: bookingReference,
        referral_code: personalData.referralCode?.trim().toUpperCase() ?? null,
        is_hotel_guest: personalData.isHotelGuest,
        cloudbeds_ref: personalData.cloudbedsRef ?? null,
        total_usd: total,
        notes: notes ?? null,
      })
      .select('id, booking_reference, total_usd')
      .single();

    if (insertError || !booking) {
      // Roll back spot decrement
      await supabase.rpc('increment_spots', { p_class_id: classId });
      console.error('[create booking]', insertError?.message);
      return NextResponse.json({ error: 'database_error' }, { status: 500 });
    }

    // ── 8. Consume the code (referral usage or pack redemption) ────────────────
    if (validCode) {
      await supabase
        .from('referral_codes')
        .update({ usage_count: validCode.usage_count + 1 })
        .eq('id', validCode.id);
    } else if (packCode) {
      // Atomically consume one class from the pack. If it fails (e.g. a race
      // exhausted it), the booking still stands — surfaced in admin for review.
      const { data: redeemResult } = await supabase.rpc('redeem_pack_code', {
        p_code: packCode,
      });
      const redeem = redeemResult as { success: boolean; error?: string } | null;
      if (!redeem?.success) {
        console.error('[create booking] pack redeem failed:', redeem?.error, packCode);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      totalUsd: Number(booking.total_usd),
    });
  } catch (err) {
    console.error('[POST /api/bookings/create]', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
