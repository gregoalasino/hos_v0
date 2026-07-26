import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { confirmPackPayment } from '@/app/actions/packs';

// Tilopay redirects the customer here after the hosted payment completes.
// Documented result: code=1 means approved. Tilopay also returns the order
// number, transaction id and a hash we can use to verify authenticity.
//
// SECURITY TODO: once we capture a real callback (from the $1 production test),
// harden this by verifying the returned hash and/or re-querying Tilopay for the
// transaction status before confirming — so a forged code=1 can't mint a code.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const params = Object.fromEntries(searchParams.entries());
  console.log('[tilopay/callback] params:', params);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const code = searchParams.get('code');
  const order =
    searchParams.get('order') ??
    searchParams.get('orderNumber') ??
    searchParams.get('ordernumber');

  const resultUrl = (status: string) =>
    NextResponse.redirect(`${siteUrl}/paquetes/resultado?status=${status}`);

  if (!order) {
    console.error('[tilopay/callback] missing order');
    return resultUrl('error');
  }

  const supabase = await createServiceClient();
  const { data: purchase } = await supabase
    .from('pack_purchases')
    .select('id, status')
    .eq('id', order)
    .single();

  if (!purchase) {
    console.error('[tilopay/callback] purchase not found for order', order);
    return resultUrl('error');
  }

  // Approved.
  if (code === '1') {
    if (purchase.status !== 'paid') {
      const res = await confirmPackPayment(purchase.id);
      if (!res.ok) {
        console.error('[tilopay/callback] confirm failed', res.error);
        return resultUrl('error');
      }
    }
    return resultUrl('ok');
  }

  // Declined / cancelled — leave the purchase pending so it can be retried.
  return resultUrl('declined');
}
