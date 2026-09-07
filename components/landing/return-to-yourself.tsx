'use client';

import { useMessages } from 'next-intl';
import { IntroArrangement } from '@/components/shared/IntroArrangement';

// ─── A Journey of Wisdom and Wellness ────────────────────────────────────────
// The home's opening statement, sitting directly under the hero video. The
// arrangement itself — the centred phrase, the four rotating frames, the drawn
// line — lives in IntroArrangement, shared with /host-your-retreat; this file
// holds only what is the home's own: its photographs. The words live in the
// catalogue under home.introduction.

// 19 frames of the house, all portrait.
const POOL = Array.from(
  { length: 19 },
  (_, i) => `/images/home/introduction/home-introduction-${String(i + 1).padStart(2, '0')}.webp`,
);

export function ReturnToYourself() {
  const copy = useMessages().home.introduction;
  return <IntroArrangement copy={copy} pool={POOL} />;
}
