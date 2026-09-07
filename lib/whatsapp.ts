// ─── WhatsApp ────────────────────────────────────────────────────────────────
// Every WhatsApp entry point on the site opens the same conversation, and each
// one opens it with the message already written, in whichever language the
// visitor is reading. Two things follow from that:
//
//   · Nobody has to compose an opening line. The friction between deciding to
//     ask and actually asking is where enquiries are lost, and a blank message
//     box is most of that friction.
//   · The team sees which door the person came through — stays, wellbeing,
//     hosting a retreat, the training, the Shakti Experience — before reading
//     a word of their own. The message is the routing; the number is not.
//
// One number, in one place. The site used to carry three: this general line,
// Nancy's line for the Yoga Teacher Training, and a third for the Shakti
// Experience, each in its own module so that changing one could never silently
// move another. As of 2026-09-07 the owners route every enquiry to this single
// number, and with the digits identical the old split inverted its own
// purpose: three copies of one number is precisely how one of them ends up
// stale. `lib/whatsapp-ytt.ts` and `lib/whatsapp-shakti.ts` are gone, and
// every page imports from here. If a page ever needs its own line again, give
// it its own module then — the seam is one import wide.
//
// Changing this constant moves every WhatsApp link on the site, and the phone
// number shown on /contact with it.
export const WHATSAPP_NUMBER = '50685605115';

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
