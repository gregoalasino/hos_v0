// ─── Cloudbeds booking integration ───────────────────────────────────────────
// Public property embed (same IDs used on the client's current WIX site).
// `zE6Wy8` is the public property/widget id — not a credential.
//
// Two ways to send a guest into the booking engine:
//  1. The immersive loader script (mounted once, site-wide, in app/layout.tsx)
//     exposes `window.openImmersiveExperiencePopup`, opening the engine as an
//     overlay on top of the current page.
//  2. A plain reservation URL — used as a graceful fallback, and the only way to
//     pre-fill specific check-in / check-out dates.
export const CLOUDBEDS_PROPERTY_CODE = 'zE6Wy8';
export const CLOUDBEDS_URL = `https://us2.cloudbeds.com/reservation/${CLOUDBEDS_PROPERTY_CODE}`;
export const CLOUDBEDS_IMMERSIVE_SRC = `https://us2.cloudbeds.com/widget/load/${CLOUDBEDS_PROPERTY_CODE}/immersive`;

/**
 * Build a reservation URL, optionally pre-filling a date range.
 * Dates must be `YYYY-MM-DD`. When both are omitted the plain reservation
 * landing page is returned.
 */
export function cloudbedsReservationUrl(checkin?: string, checkout?: string): string {
  if (!checkin || !checkout) return CLOUDBEDS_URL;
  const params = new URLSearchParams({ checkin, checkout });
  return `${CLOUDBEDS_URL}?${params.toString()}`;
}
