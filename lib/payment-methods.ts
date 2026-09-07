// Shared payment-method config used by the booking flow and the admin
// bookings view. The labels here are the admin's (English); the guest-facing
// names and hints come from the message catalogue.

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

// The in-person payment instructions the confirmation screen shows live in
// the message catalogue (booking.confirmation.venmoInstructions /
// cashInstructions), in the reader's language, with VENMO_HANDLE filled in.
