// ─── WhatsApp — Yoga Teacher Training ────────────────────────────────────────
// The training has its own line. `lib/whatsapp.ts` carries the house's general
// number (50688365115) and is what every other page links to; enquiries about
// the training go straight to Nancy instead, so they are never routed through
// the front desk and back. That split is deliberate, and this module is what
// keeps it — the two numbers stay in two places precisely so that changing one
// can never silently move the other.
//
// As on the rest of the site, each link opens with the message already written,
// in whichever language the visitor is reading:
//
//   · Nobody has to compose an opening line. The friction between deciding to
//     ask and actually asking is where enquiries are lost, and a blank message
//     box is most of that friction.
//   · Nancy sees which question the person came from, before she has read a
//     word of their own.
const NUMBER = '50684904626';

/**
 * A wa.me link that opens with `message` already typed.
 *
 * wa.me reads the draft from a `text` query parameter, which has to be
 * percent-encoded — the messages carry em dashes, inverted marks and accents,
 * all of which would otherwise break the URL rather than the text.
 */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;
}
