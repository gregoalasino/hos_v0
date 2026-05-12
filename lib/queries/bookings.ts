import { createClient } from '@/lib/supabase/server';
import type { Booking, BookingStatus } from '@/types';
import type { Database } from '@/types/supabase';

type BookingRow = Database['public']['Tables']['bookings']['Row'];

// Maps DB status to the legacy frontend paymentStatus
function dbStatusToFrontend(
  status: BookingRow['payment_status'],
): Booking['paymentStatus'] {
  if (status === 'confirmed') return 'paid';
  return status as Booking['paymentStatus'];
}

function rowToBooking(row: BookingRow & { classes?: { name: string } | null }): Booking {
  return {
    id: row.id,
    classId: row.class_id,
    className: (row.classes as { name: string } | null)?.name ?? '',
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone ?? undefined,
    persons: row.persons,
    upsells: row.upsell_ids ?? [],
    paymentStatus: dbStatusToFrontend(row.payment_status),
    bookingReference: row.booking_reference,
    referralCode: row.referral_code ?? undefined,
    createdAt: new Date(row.created_at),
  };
}

export async function getBookingByReference(ref: string): Promise<Booking | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('*, classes(name)')
      .eq('booking_reference', ref)
      .single();

    if (error) {
      console.error('[getBookingByReference]', error.message);
      return null;
    }
    return rowToBooking(data as unknown as BookingRow & { classes: { name: string } | null });
  } catch (err) {
    console.error('[getBookingByReference] unexpected:', err);
    return null;
  }
}

export async function getBookingsForClass(classId: string): Promise<Booking[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('*, classes(name)')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getBookingsForClass]', error.message);
      return [];
    }
    return (data as unknown as (BookingRow & { classes: { name: string } | null })[]).map(rowToBooking);
  } catch (err) {
    console.error('[getBookingsForClass] unexpected:', err);
    return [];
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('*, classes(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getAllBookings]', error.message);
      return [];
    }
    return (data as unknown as (BookingRow & { classes: { name: string } | null })[]).map(rowToBooking);
  } catch (err) {
    console.error('[getAllBookings] unexpected:', err);
    return [];
  }
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<boolean> {
  try {
    const supabase = await createClient();

    if (status === 'cancelled') {
      // Get class_id first to release the spot
      const { data: booking } = await supabase
        .from('bookings')
        .select('class_id')
        .eq('id', id)
        .single();

      if (booking?.class_id) {
        await supabase.rpc('increment_spots', { p_class_id: booking.class_id });
      }
    }

    const { error } = await supabase
      .from('bookings')
      .update({ payment_status: status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[updateBookingStatus]', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[updateBookingStatus] unexpected:', err);
    return false;
  }
}
