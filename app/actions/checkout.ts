'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { createPayment } from '@/lib/tilopay';
import { confirmPackPayment } from '@/app/actions/packs';
import { tilopayReturnUrl } from '@/lib/tilopay-return';
import type { AppLocale } from '@/i18n/routing';

export type CheckoutPackType = 'dropin' | 'pack5' | 'pack10' | 'pack20';

// How the customer chose to pay. 'card' goes through Tilopay; 'cash'/'venmo' are
// paid in person and confirmed manually by the admin from /admin/reservas.
export type CheckoutPaymentMethod = 'card' | 'cash' | 'venmo';

type PersonalData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  referralCode?: string;
  isHotelGuest: boolean;
  cloudbedsRef?: string;
};

export type CheckoutInput = {
  classId: string;
  upsellIds: string[];
  personalData: PersonalData;
  packType: CheckoutPackType;
  paymentMethod: CheckoutPaymentMethod;
  /**
   * The language the booking was made in. Only used to build Tilopay's return
   * URL, so the receipt page and the pack-code email come back in the same
   * language; it is not stored.
   */
  locale?: AppLocale;
};

type CheckoutResult =
  // Fully covered by a pack/referral code — confirmed immediately, no payment.
  | { ok: true; status: 'free'; bookingReference: string }
  // Cash/Venmo — booking created as pending; admin collects payment in person.
  | { ok: true; status: 'offline'; bookingReference: string; paymentMethod: 'cash' | 'venmo' }
  // Card — hand off to Tilopay's hosted payment page.
  | { ok: true; status: 'redirect'; url: string }
  | { ok: false; error: string };

const PACK_COUNT: Record<Exclude<CheckoutPackType, 'dropin'>, number> = {
  pack5: 5,
  pack10: 10,
  pack20: 20,
};

// Starts checkout from the class booking flow.
//  - dropin: pay this class (+upsells) via Tilopay. A pack/referral code may make
//    the class free; if the total is 0 the booking is confirmed immediately.
//  - packN: buy an N-class pack via Tilopay; on payment one credit books THIS
//    class for free (upsells charged) and the pack code is emailed.
export async function startBookingCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const supabase = await createServiceClient();
  const { classId, upsellIds, personalData, packType, paymentMethod, locale = 'en' } = input;
  const isOffline = paymentMethod === 'cash' || paymentMethod === 'venmo';

  // ── Validate class ──────────────────────────────────────────────────────────
  const { data: clase, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('id', classId)
    .single();
  if (classError || !clase || !clase.is_active) return { ok: false, error: 'class_not_found' };

  const startsAt = new Date(clase.starts_at).getTime();
  const hoursUntil = (startsAt - Date.now()) / 3_600_000;
  if (hoursUntil < 1) return { ok: false, error: 'booking_too_late' };

  // ── Upsells total ───────────────────────────────────────────────────────────
  let upsellsTotal = 0;
  if (upsellIds.length > 0) {
    const { data: rows } = await supabase.from('upsells').select('price_usd').in('id', upsellIds);
    upsellsTotal = (rows ?? []).reduce((a, u) => a + Number(u.price_usd), 0);
  }

  const redirect = tilopayReturnUrl(locale);
  const classPrice = Number(clase.price_dropin_usd);

  // ── Reserve a spot (atomic) ─────────────────────────────────────────────────
  async function reserveSpot(): Promise<boolean> {
    const { data } = await supabase.rpc('decrement_spots', { p_class_id: classId });
    return !!(data as { success: boolean } | null)?.success;
  }
  async function newRef(): Promise<string> {
    const { data } = await supabase.rpc('generate_booking_reference');
    return (data as string | null) ?? `HOS-${Date.now()}-XXXX`;
  }

  // ══ PACK: buy a pack that also books this class ══════════════════════════════
  if (packType !== 'dropin') {
    const count = PACK_COUNT[packType];
    const { data: pack } = await supabase
      .from('class_packs')
      .select('id, name, classes_count, price_usd')
      .eq('classes_count', count)
      .eq('is_active', true)
      .single();
    if (!pack) return { ok: false, error: 'pack_not_found' };

    // Create the pending pack purchase.
    const { data: purchase, error: pErr } = await supabase
      .from('pack_purchases')
      .insert({
        pack_id: pack.id,
        first_name: personalData.firstName,
        last_name: personalData.lastName,
        email: personalData.email,
        phone: personalData.phone ?? null,
        classes_total: pack.classes_count,
        amount_usd: pack.price_usd,
        status: 'pending',
        payment_method: paymentMethod,
      })
      .select('id')
      .single();
    if (pErr || !purchase) return { ok: false, error: 'database_error' };

    if (!(await reserveSpot())) return { ok: false, error: 'no_spots_available' };

    const packBookingRef = await newRef();
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .insert({
        class_id: classId,
        first_name: personalData.firstName,
        last_name: personalData.lastName,
        email: personalData.email,
        phone: personalData.phone ?? null,
        upsell_ids: upsellIds,
        payment_status: 'pending',
        payment_method: paymentMethod,
        pack_type: packType,
        pack_purchase_id: purchase.id,
        booking_reference: packBookingRef,
        is_hotel_guest: personalData.isHotelGuest,
        cloudbeds_ref: personalData.cloudbedsRef ?? null,
        total_usd: upsellsTotal,
      })
      .select('id')
      .single();
    if (bErr || !booking) {
      await supabase.rpc('increment_spots', { p_class_id: classId });
      return { ok: false, error: 'database_error' };
    }

    // Cash/Venmo — leave the pack purchase + booking pending. The admin confirms
    // it from /admin/reservas, which generates the pack code and emails it.
    if (isOffline) {
      return {
        ok: true,
        status: 'offline',
        bookingReference: packBookingRef,
        paymentMethod,
      };
    }

    try {
      const url = await createPayment({
        amount: (Number(pack.price_usd) + upsellsTotal).toFixed(2),
        currency: 'USD',
        orderNumber: purchase.id, // callback maps pack purchases by id
        redirect,
        billToFirstName: personalData.firstName,
        billToLastName: personalData.lastName,
        billToEmail: personalData.email,
        billToTelephone: personalData.phone ?? '',
        billToCountry: 'CR',
        capture: '1',
      });
      return { ok: true, status: 'redirect', url };
    } catch {
      await supabase.rpc('increment_spots', { p_class_id: classId });
      return { ok: false, error: 'payment_init_failed' };
    }
  }

  // ══ DROP-IN: pay this class (+upsells); a code may make the class free ═══════
  let packFree = false;
  let referralDiscount = 0;
  const code = personalData.referralCode?.trim().toUpperCase();
  if (code) {
    const { data: ref } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();
    if (ref) {
      const now = Date.now();
      const okDates =
        (!ref.valid_from || now >= new Date(ref.valid_from).getTime()) &&
        (!ref.valid_until || now <= new Date(ref.valid_until).getTime());
      const okLimit = ref.usage_limit == null || ref.usage_count < ref.usage_limit;
      if (okDates && okLimit) {
        const base = classPrice + upsellsTotal;
        if (ref.benefit_type === 'percentage' && ref.discount_percent != null) {
          referralDiscount = base * (Number(ref.discount_percent) / 100);
        } else if (ref.benefit_type === 'fixed' && ref.discount_fixed != null) {
          referralDiscount = Math.min(Number(ref.discount_fixed), base);
        }
      }
    } else {
      const { data: packRow } = await supabase
        .from('pack_purchases')
        .select('status, classes_total, classes_used')
        .eq('code', code)
        .single();
      if (packRow && packRow.status === 'paid' && packRow.classes_used < packRow.classes_total) {
        packFree = true;
      }
    }
  }

  const total = Math.max(
    0,
    Math.round(((packFree ? 0 : classPrice) + upsellsTotal - referralDiscount) * 100) / 100,
  );

  if (!(await reserveSpot())) return { ok: false, error: 'no_spots_available' };

  const bookingReference = await newRef();
  const { data: booking, error: bErr } = await supabase
    .from('bookings')
    .insert({
      class_id: classId,
      first_name: personalData.firstName,
      last_name: personalData.lastName,
      email: personalData.email,
      phone: personalData.phone ?? null,
      upsell_ids: upsellIds,
      payment_status: total <= 0 ? 'confirmed' : 'pending',
      payment_method: paymentMethod,
      pack_type: 'dropin',
      booking_reference: bookingReference,
      referral_code: code ?? null,
      is_hotel_guest: personalData.isHotelGuest,
      cloudbeds_ref: personalData.cloudbedsRef ?? null,
      total_usd: total,
    })
    .select('id')
    .single();
  if (bErr || !booking) {
    await supabase.rpc('increment_spots', { p_class_id: classId });
    return { ok: false, error: 'database_error' };
  }

  // Free already (pack code / full discount) → consume code now, done.
  if (total <= 0) {
    if (packFree && code) await supabase.rpc('redeem_pack_code', { p_code: code });
    return { ok: true, status: 'free', bookingReference };
  }

  // Cash/Venmo — booking stays pending; admin collects payment in person and
  // confirms it from /admin/reservas (which also consumes any referral code).
  if (isOffline) {
    return { ok: true, status: 'offline', bookingReference, paymentMethod };
  }

  try {
    const url = await createPayment({
      amount: total.toFixed(2),
      currency: 'USD',
      orderNumber: booking.id, // callback maps bookings by id
      redirect,
      billToFirstName: personalData.firstName,
      billToLastName: personalData.lastName,
      billToEmail: personalData.email,
      billToTelephone: personalData.phone ?? '',
      billToCountry: 'CR',
      capture: '1',
    });
    return { ok: true, status: 'redirect', url };
  } catch {
    await supabase.rpc('increment_spots', { p_class_id: classId });
    return { ok: false, error: 'payment_init_failed' };
  }
}

// Called by the Tilopay callback when a booking-order payment is approved.
export async function confirmBookingPaid(bookingId: string, tx: string | null): Promise<void> {
  const supabase = await createServiceClient();
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, payment_status, referral_code')
    .eq('id', bookingId)
    .single();
  if (!booking || booking.payment_status === 'confirmed') return;

  await supabase
    .from('bookings')
    .update({
      payment_status: 'confirmed',
      tilopay_transaction: tx,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  // Consume a referral code used for a paid drop-in (pack codes zero the class,
  // which is handled in the free path, not here).
  if (booking.referral_code) {
    const { data: ref } = await supabase
      .from('referral_codes')
      .select('id, usage_count')
      .eq('code', booking.referral_code)
      .single();
    if (ref) {
      await supabase
        .from('referral_codes')
        .update({ usage_count: ref.usage_count + 1 })
        .eq('id', ref.id);
    }
  }
}

// Called by the callback when a pack-order payment is approved: generate the
// pack code + email, consume one credit, and confirm the linked booking.
// The locale is the one the pack was bought in — the code email goes out in it.
export async function confirmPackAndBooking(
  packPurchaseId: string,
  tx: string | null,
  locale: AppLocale = 'en',
): Promise<void> {
  const supabase = await createServiceClient();

  const res = await confirmPackPayment(packPurchaseId, locale);
  if (!res.ok || !res.code) return;

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, payment_status')
    .eq('pack_purchase_id', packPurchaseId)
    .single();
  if (!booking || booking.payment_status === 'confirmed') return;

  await supabase.rpc('redeem_pack_code', { p_code: res.code });
  await supabase
    .from('bookings')
    .update({
      payment_status: 'confirmed',
      tilopay_transaction: tx,
      updated_at: new Date().toISOString(),
    })
    .eq('id', booking.id);
}

// Called by the callback when a payment is declined/cancelled.
export async function releaseBookingOrder(
  kind: 'booking' | 'pack',
  id: string,
): Promise<void> {
  const supabase = await createServiceClient();

  if (kind === 'pack') {
    await supabase.from('pack_purchases').update({ status: 'cancelled' }).eq('id', id);
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, class_id, payment_status')
      .eq('pack_purchase_id', id)
      .single();
    if (booking && booking.payment_status !== 'cancelled') {
      await supabase.from('bookings').update({ payment_status: 'cancelled' }).eq('id', booking.id);
      await supabase.rpc('increment_spots', { p_class_id: booking.class_id });
    }
    return;
  }

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, class_id, payment_status')
    .eq('id', id)
    .single();
  if (booking && booking.payment_status !== 'cancelled') {
    await supabase.from('bookings').update({ payment_status: 'cancelled' }).eq('id', booking.id);
    await supabase.rpc('increment_spots', { p_class_id: booking.class_id });
  }
}
