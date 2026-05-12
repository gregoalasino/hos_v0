'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';

export async function confirmBooking(id: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('bookings')
    .update({ payment_status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/reservas');
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
    .select('class_id, payment_status')
    .eq('id', id)
    .single();

  if (!booking) throw new Error('booking_not_found');
  if (booking.payment_status === 'cancelled') return;

  await supabase
    .from('bookings')
    .update({ payment_status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id);

  await supabase.rpc('increment_spots', { p_class_id: booking.class_id });

  revalidatePath('/admin/reservas');
  revalidatePath('/admin/calendario');
}
