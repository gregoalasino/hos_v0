import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import {
  confirmBookingPaid,
  confirmPackAndBooking,
  releaseBookingOrder,
} from '@/app/actions/checkout';

// Tilopay redirects the customer here after the hosted payment completes.
// code=1 means approved. The `order` is either a pack_purchases id (pack bought
// from /paquetes or from the booking flow) or a bookings id (drop-in).
//
// SECURITY TODO: validate the returned OrderHash with the Tilopay panel hash
// secret (or re-query the transaction) before confirming, so a forged code=1
// can't confirm an order without a real payment.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log('[tilopay/callback] params:', Object.fromEntries(searchParams.entries()));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const code = searchParams.get('code');
  const tx = searchParams.get('tilopay-transaction') ?? searchParams.get('tpt');
  const order =
    searchParams.get('order') ??
    searchParams.get('orderNumber') ??
    searchParams.get('ordernumber');

  const result = (status: string, kind: 'pack' | 'booking' = 'pack') =>
    NextResponse.redirect(`${siteUrl}/paquetes/resultado?status=${status}&kind=${kind}`);

  if (!order) return result('error');

  const supabase = await createServiceClient();
  const approved = code === '1';

  // Is this order a pack purchase?
  const { data: pack } = await supabase
    .from('pack_purchases')
    .select('id')
    .eq('id', order)
    .single();

  if (pack) {
    if (approved) {
      await confirmPackAndBooking(order, tx);
      return result('ok');
    }
    await releaseBookingOrder('pack', order);
    return result('declined');
  }

  // Otherwise it should be a booking (drop-in).
  const { data: booking } = await supabase
    .from('bookings')
    .select('id')
    .eq('id', order)
    .single();

  if (booking) {
    if (approved) {
      await confirmBookingPaid(order, tx);
      return result('ok', 'booking');
    }
    await releaseBookingOrder('booking', order);
    return result('declined', 'booking');
  }

  console.error('[tilopay/callback] order not found:', order);
  return result('error');
}
