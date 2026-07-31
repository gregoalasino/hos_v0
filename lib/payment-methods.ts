// Shared payment-method config used by the booking flow, the confirmation
// screen and the admin bookings view. Keeps labels + in-person instructions in
// one place so client and admin stay in sync.

export type PaymentMethod = 'card' | 'cash' | 'venmo';

// Venmo handle shown to the customer when they pay by Venmo. Public (it's just a
// username), so it lives in a NEXT_PUBLIC_ var with a safe placeholder fallback.
export const VENMO_HANDLE =
  process.env.NEXT_PUBLIC_VENMO_HANDLE ?? '@Nancy-Goodfellow';

// Handle without the leading @, used to build the Venmo profile URL.
export const VENMO_USERNAME = VENMO_HANDLE.replace(/^@/, '');

// Link to the receiving account's Venmo profile, where the customer taps Pay.
// Kept simple/robust (profile URL) rather than a brittle prefilled deep link.
export function venmoProfileUrl(): string {
  return `https://venmo.com/u/${VENMO_USERNAME}`;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: 'Card',
  cash: 'Cash',
  venmo: 'Venmo',
};

export function paymentMethodLabel(method: PaymentMethod | null | undefined): string {
  return method ? PAYMENT_METHOD_LABELS[method] : PAYMENT_METHOD_LABELS.card;
}

// Short instruction shown on the confirmation screen for in-person payments.
export function paymentInstructions(method: 'cash' | 'venmo'): string {
  if (method === 'venmo') {
    return `Send your payment on Venmo to ${VENMO_HANDLE} and include your booking reference in the note. Your spot is held — we'll confirm once the payment is received.`;
  }
  return "Pay in cash at the studio reception before your class. Your spot is held until then.";
}
