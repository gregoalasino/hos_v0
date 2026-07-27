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
