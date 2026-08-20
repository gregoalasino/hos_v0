// ─── WhatsApp ────────────────────────────────────────────────────────────────
// Every WhatsApp entry point on the site opens the same conversation, and each
// one opens it with the message already written, in whichever language the
// visitor is reading. Two things follow from that:
//
//   · Nobody has to compose an opening line. The friction between deciding to
//     ask and actually asking is where enquiries are lost, and a blank message
//     box is most of that friction.
//   · The team sees which door the person came through — stays, wellbeing, or
//     hosting a retreat — before reading a word of their own.
//
// The number lives here once, so it can be changed in one place — /contact
// and the retreats data derive theirs from this export. It is the site's
// general contact number, NOT Nancy's YTT line (50684904626): that one
// belongs to the Yoga Teacher Training landing and its components, which
// keep it deliberately.
export const WHATSAPP_NUMBER = '50688365115';

/** The bare conversation link, for entry points that shouldn't pre-fill. */
export const WHATSAPP_URL_PLAIN = `https://wa.me/${WHATSAPP_NUMBER}`;

/**
 * A wa.me link that opens with `message` already typed.
 *
 * wa.me reads the draft from a `text` query parameter, which has to be
 * percent-encoded — the messages carry em dashes, inverted marks and accents,
 * all of which would otherwise break the URL rather than the text.
 */
export function whatsappUrl(message: string): string {
  return `${WHATSAPP_URL_PLAIN}?text=${encodeURIComponent(message)}`;
}
