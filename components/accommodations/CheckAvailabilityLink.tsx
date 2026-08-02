'use client';

import { CLOUDBEDS_PROPERTY_CODE, CLOUDBEDS_URL } from '@/lib/cloudbeds';

// ─── Editorial "Check availability" link ─────────────────────────────────────
// The immersive loader script (mounted once in app/layout.tsx) exposes
// `window.openImmersiveExperiencePopup`, which opens the booking engine as an
// overlay on top of the page. We keep the anchor's `href` as a graceful
// fallback: if the widget script hasn't loaded (blocked / offline), the click
// just follows the link to the reservation page. Middle-click / cmd-click also
// still open the reservation in a new tab.
export function CheckAvailabilityLink({
  label = 'Check availability',
  className = 'mt-6',
}: {
  label?: string;
  className?: string;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle modified clicks (new tab, etc.) via the href.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const openPopup = window.openImmersiveExperiencePopup;
    if (typeof openPopup === 'function') {
      e.preventDefault();
      openPopup({ propertyCode: CLOUDBEDS_PROPERTY_CODE });
    }
    // else: fall through to the href (new-tab reservation page).
  };

  return (
    <a
      href={CLOUDBEDS_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer ${className}`}
    >
      {label}
    </a>
  );
}
