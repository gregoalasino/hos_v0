'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import { confirmBookingPaid, confirmPackAndBooking } from '@/app/actions/checkout';

// Marks a booking as collected (paid). This is the "Cobrada" action the admin
// uses for cash/Venmo bookings — but it also works for a stuck card booking.
//   - Pack booking → generate the pack code, email it, redeem one credit and
//     confirm the linked booking (reuses the Tilopay-callback path).
//   - Drop-in booking → confirm it and consume any referral code that was used.
export async function confirmBooking(id: string) {
  const supabase = await createServiceClient();
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('pack_purchase_id')
    .eq('id', id)
    .single();
  if (error || !booking) throw new Error(error?.message ?? 'booking_not_found');

  if (booking.pack_purchase_id) {
    await confirmPackAndBooking(booking.pack_purchase_id, null);
  } else {
    await confirmBookingPaid(id, null);
  }

  revalidatePath('/admin/reservas');
  revalidatePath('/admin/calendario');
}

// Admin manually registers a walk-in participant on a class from the calendar
// drawer — for students who show up in person and never booked through the web.
// Mirrors the public drop-in booking shape (same personal fields) but skips the
// upsell/pack flow: it's a quick express add. Reserves `persons` spots atomically
// and rolls them back if anything fails.
export type AdminBookingInput = {
  classId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  persons: number;
  upsellIds?: string[];
  paymentMethod: 'card' | 'cash' | 'venmo';
  /** true → booking is created already paid (confirmed); false → pending. */
  markPaid: boolean;
  isHotelGuest?: boolean;
  cloudbedsRef?: string;
};

export async function createAdminBooking(
  input: AdminBookingInput,
): Promise<{ ok: true; bookingReference: string } | { ok: false; error: string }> {
  const supabase = await createServiceClient();

  const persons = Math.max(1, Math.floor(input.persons || 1));
  const upsellIds = input.upsellIds ?? [];

  // ── Validate class ──────────────────────────────────────────────────────────
  const { data: clase, error: classError } = await supabase
    .from('classes')
    .select('id, price_dropin_usd, is_active')
    .eq('id', input.classId)
    .single();
  if (classError || !clase || !clase.is_active) return { ok: false, error: 'class_not_found' };

  // ── Upsells total (priced server-side; never trust a client amount) ─────────
  let upsellsTotal = 0;
  if (upsellIds.length > 0) {
    const { data: rows } = await supabase
      .from('upsells')
      .select('price_usd')
      .in('id', upsellIds);
    upsellsTotal = (rows ?? []).reduce((acc, u) => acc + Number(u.price_usd), 0);
  }

  // ── Reserve N spots atomically, rolling back on partial failure ─────────────
  let reserved = 0;
  for (let i = 0; i < persons; i++) {
    const { data } = await supabase.rpc('decrement_spots', { p_class_id: input.classId });
    if (!(data as { success: boolean } | null)?.success) break;
    reserved++;
  }
  if (reserved < persons) {
    for (let i = 0; i < reserved; i++) {
      await supabase.rpc('increment_spots', { p_class_id: input.classId });
    }
    return { ok: false, error: 'no_spots_available' };
  }

  const { data: refData } = await supabase.rpc('generate_booking_reference');
  const bookingReference = (refData as string | null) ?? `HOS-${Date.now()}-XXXX`;

  const total = Number(clase.price_dropin_usd) * persons + upsellsTotal;

  const { error: insertError } = await supabase.from('bookings').insert({
    class_id: input.classId,
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    phone: input.phone?.trim() ? input.phone.trim() : null,
    persons,
    upsell_ids: upsellIds,
    payment_status: input.markPaid ? 'confirmed' : 'pending',
    payment_method: input.paymentMethod,
    pack_type: 'dropin',
    booking_reference: bookingReference,
    is_hotel_guest: input.isHotelGuest ?? false,
    cloudbeds_ref: input.cloudbedsRef?.trim() ? input.cloudbedsRef.trim() : null,
    total_usd: total,
  });

  if (insertError) {
    for (let i = 0; i < reserved; i++) {
      await supabase.rpc('increment_spots', { p_class_id: input.classId });
    }
    return { ok: false, error: 'database_error' };
  }

  revalidatePath('/admin/reservas');
  revalidatePath('/admin/calendario');
  return { ok: true, bookingReference };
}

export async function markNoShow(id: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('bookings')
    .update({ payment_status: 'no-show', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/reservas');
}

export async function cancelBookingAdmin(id: string) {
  const supabase = await createServiceClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('class_id, payment_status, pack_purchase_id')
    .eq('id', id)
    .single();

  if (!booking) throw new Error('booking_not_found');
  if (booking.payment_status === 'cancelled') return;

  await supabase
    .from('bookings')
    .update({ payment_status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id);

  await supabase.rpc('increment_spots', { p_class_id: booking.class_id });

  // If this booking was paying for a still-pending pack purchase (cash/Venmo
  // that was never collected), cancel the purchase too so no code is generated.
  if (booking.pack_purchase_id) {
    await supabase
      .from('pack_purchases')
      .update({ status: 'cancelled' })
      .eq('id', booking.pack_purchase_id)
      .eq('status', 'pending');
  }

  revalidatePath('/admin/reservas');
  revalidatePath('/admin/calendario');
}
