// ─── WhatsApp — Shakti Experience ────────────────────────────────────────────
// The experience has its own line, the one the owners gave for it: +506 8560
// 5115. `lib/whatsapp.ts` carries the house's general number and
// `lib/whatsapp-ytt.ts` Nancy's line for the training; this is the third, and
// like the other two it lives alone in its own module so that changing one
// can never silently move another. Every "Reserve your place" on the Shakti
// page opens this conversation with the message already written, in the
// visitor's language.
const NUMBER = '50685605115';

export function whatsappUrl(message: string): string {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;
}
