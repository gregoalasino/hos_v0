// ─────────────────────────────────────────────────────────────────────────────
// Tilopay (Costa Rica) — server-side helper for the class-pack checkout.
//
// Verified flow (hosted checkout):
//   1. POST /api/v1/login { apiuser, password, key } → { access_token } (JWT).
//   2. POST /api/v1/processPayment (Bearer) { redirect, key, amount, currency,
//      orderNumber, capture, billTo... } → { url } to a secure hosted page
//      (securepayment.tilopay.com). The customer enters their card THERE, so no
//      card data ever touches our site.
//   3. Tilopay redirects back to our `redirect` URL with the result params
//      (code=1 approved, order, transaction, hash…). Our callback confirms.
// ─────────────────────────────────────────────────────────────────────────────

import { createHmac } from 'crypto';

const BASE_URL = 'https://app.tilopay.com/api/v1';

// Recomputes the OrderHash Tilopay returns on the callback, per their official
// WooCommerce plugin: HMAC-SHA256(http_build_query(params), "{tpt}|{key}|{pass}").
// Used to verify a callback really came from Tilopay for the given amount.
export function computeOrderHash(p: {
  orderId: string; // tpt / tilopay-transaction
  externalOrderId: string; // our order number
  amount: string; // "1.00" (2 decimals)
  currency: string; // "USD"
  responseCode: string; // "1"
  auth: string;
  email: string;
}): string | null {
  const key = process.env.TILOPAY_API_KEY;
  const user = process.env.TILOPAY_API_USER;
  const pass = process.env.TILOPAY_API_PASSWORD;
  if (!key || !user || !pass) return null;

  const params = new URLSearchParams();
  params.append('api_Key', key);
  params.append('api_user', user);
  params.append('orderId', p.orderId);
  params.append('external_orden_id', p.externalOrderId);
  params.append('amount', p.amount);
  params.append('currency', p.currency);
  params.append('responseCode', p.responseCode);
  params.append('auth', p.auth);
  params.append('email', p.email);

  const hashKey = `${p.orderId}|${key}|${pass}`;
  return createHmac('sha256', hashKey).update(params.toString()).digest('hex');
}

function creds() {
  const apiuser = process.env.TILOPAY_API_USER;
  const password = process.env.TILOPAY_API_PASSWORD;
  const key = process.env.TILOPAY_API_KEY;
  if (!apiuser || !password || !key) {
    throw new Error('tilopay_not_configured');
  }
  return { apiuser, password, key };
}

// Step 1 — authenticate. Returns a short-lived Bearer access token.
export async function login(): Promise<string> {
  const { apiuser, password, key } = creds();
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiuser, password, key }),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`tilopay_login_failed_${res.status}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error('tilopay_login_no_token');
  return data.access_token as string;
}

export type CreatePaymentParams = {
  amount: string; // "12.00"
  currency: string; // "USD"
  orderNumber: string; // unique, non-repeating
  redirect: string; // absolute callback URL
  billToFirstName: string;
  billToLastName: string;
  billToEmail: string;
  billToTelephone?: string;
  billToCountry?: string; // ISO-2, e.g. "CR"
  billToAddress?: string;
  billToCity?: string;
  capture?: '0' | '1'; // 1 = capture (charge) now
};

// Step 2 — create a hosted payment session. Returns the URL to redirect to.
export async function createPayment(params: CreatePaymentParams): Promise<string> {
  const { key } = creds();
  const accessToken = await login();

  const res = await fetch(`${BASE_URL}/processPayment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      key,
      redirect: params.redirect,
      amount: params.amount,
      currency: params.currency,
      orderNumber: params.orderNumber,
      capture: params.capture ?? '1',
      subscription: '0',
      billToFirstName: params.billToFirstName,
      billToLastName: params.billToLastName,
      billToEmail: params.billToEmail,
      billToTelephone: params.billToTelephone ?? '',
      billToCountry: params.billToCountry ?? 'CR',
      billToAddress: params.billToAddress ?? '',
      billToCity: params.billToCity ?? '',
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`tilopay_process_failed_${res.status}`);
  }
  const data = await res.json();
  if (!data.url) throw new Error('tilopay_process_no_url');
  return data.url as string;
}
