'use client';

import { useMessages } from 'next-intl';
import { IntroArrangement } from '@/components/shared/IntroArrangement';

// ─── Intro ───────────────────────────────────────────────────────────────────
// The page's opening statement, in the home's own arrangement — the centred
// phrase over four rotating frames. The words are the sanctuary's welcome from
// the owners' "Host your retreat in paradise" deck, kept in the catalogue under
// hostYourRetreat.intro; the photographs are the thirteen frames they chose.

// 13 frames, all portrait: the beach, the pool, the rooms, the shala.
const POOL = Array.from(
  { length: 13 },
  (_, i) => `/images/host-your-retreat/slider/host-retreat-slider-${i + 1}.webp`,
);

export function HostIntro() {
  const copy = useMessages().hostYourRetreat.intro;
  return <IntroArrangement copy={copy} pool={POOL} />;
}
