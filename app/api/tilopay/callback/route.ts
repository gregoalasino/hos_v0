import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { computeOrderHash } from '@/lib/tilopay';
import { localeFromCallback } from '@/lib/tilopay-return';
import { localizedPath } from '@/lib/seo';
import {
  confirmBookingPaid,
  confirmPackAndBooking,
  releaseBookingOrder,
} from '@/app/actions/checkout';

// Tilopay redirects the customer here after the hosted payment completes.
// code=1 means approved. The `order` is either a pack_purchases id (pack bought
// from /paquetes or from the booking flow) or a bookings id (drop-in).
//
// SECURITY: we recompute the OrderHash (Tilopay's official formula) to verify the
// callback is authentic. Enforcement is gated behind TILOPAY_VERIFY_HASH so we can
// first confirm computed==received on a live payment (logged) before rejecting.
function verifyHash(
  received: string | null,
  amount: number | null,
  email: string | null,
  order: string,
  tx: string | null,
  code: string | null,
  auth: string | null,
): boolean {
  if (!received || amount == null || !email || !tx) return false;
  const computed = computeOrderHash({
    orderId: tx,
    externalOrderId: order,
    amount: Number(amount).toFixed(2),
    currency: 'USD',
    responseCode: code ?? '',
    auth: auth ?? '',
    email,
  });
  const ok = !!computed && computed === received;
  console.log('[tilopay/callback] hash check:', { ok, computed, received });
  return ok;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  console.log('[tilopay/callback] params:', Object.fromEntries(searchParams.entries()));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const code = searchParams.get('code');
  const auth = searchParams.get('auth');
  const tx = searchParams.get('tilopay-transaction') ?? searchParams.get('tpt');
  const receivedHash = searchParams.get('OrderHash');
  const order =
    searchParams.get('order') ??
    searchParams.get('orderNumber') ??
    searchParams.get('ordernumber');

  // The language the customer paid in, carried on the return URL we gave
  // Tilopay (see lib/tilopay-return.ts). The receipt lives at
  // /paquetes/resultado in English and /es/paquetes/resultado in Spanish.
  const locale = localeFromCallback(searchParams);

  const enforce = process.env.TILOPAY_VERIFY_HASH === 'true';
  const result = (status: string, kind: 'pack' | 'booking' = 'pack') =>
    NextResponse.redirect(
      `${siteUrl}${localizedPath('/paquetes/resultado', locale)}?status=${status}&kind=${kind}`,
    );

  if (!order) return result('error');

  const supabase = await createServiceClient();
  const approved = code === '1';

  // Is this order a pack purchase?
  const { data: pack } = await supabase
    .from('pack_purchases')
    .select('id, amount_usd, email')
    .eq('id', order)
    .single();

  if (pack) {
    if (approved) {
      const valid = verifyHash(receivedHash, pack.amount_usd, pack.email, order, tx, code, auth);
      if (enforce && !valid) {
        console.error('[tilopay/callback] hash mismatch (pack), rejecting', order);
        return result('error');
      }
      await confirmPackAndBooking(order, tx, locale);
      return result('ok');
    }
    await releaseBookingOrder('pack', order);
    return result('declined');
  }

  // Otherwise it should be a booking (drop-in).
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, total_usd, email')
    .eq('id', order)
    .single();

  if (booking) {
    if (approved) {
      const valid = verifyHash(receivedHash, booking.total_usd, booking.email, order, tx, code, auth);
      if (enforce && !valid) {
        console.error('[tilopay/callback] hash mismatch (booking), rejecting', order);
        return result('error', 'booking');
      }
      await confirmBookingPaid(order, tx);
      return result('ok', 'booking');
    }
    await releaseBookingOrder('booking', order);
    return result('declined', 'booking');
  }

  console.error('[tilopay/callback] order not found:', order);
  return result('error');
}
