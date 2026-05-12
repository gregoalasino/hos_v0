import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { bookingReference, email } = await req.json();

    if (!bookingReference || !email) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // ── 1. Fetch booking by reference ─────────────────────────────────────────
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('id, class_id, email, payment_status')
      .eq('booking_reference', bookingReference)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'booking_not_found' }, { status: 404 });
    }
    if (booking.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: 'booking_not_found' }, { status: 404 });
    }
    if (booking.payment_status === 'cancelled') {
      return NextResponse.json({ error: 'already_cancelled' }, { status: 400 });
    }

    // ── 2. Check cancellation policy — must be > 2 hours before class ────────
    const { data: clase } = await supabase
      .from('classes')
      .select('starts_at')
      .eq('id', booking.class_id)
      .single();

    if (clase) {
      const hoursUntil =
        (new Date(clase.starts_at).getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntil < 2) {
        return NextResponse.json({ error: 'cancellation_too_late' }, { status: 400 });
      }
    }

    // ── 3. Cancel booking & release spot ─────────────────────────────────────
    await supabase
      .from('bookings')
      .update({
        payment_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id);

    await supabase.rpc('increment_spots', { p_class_id: booking.class_id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/bookings/cancel]', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
