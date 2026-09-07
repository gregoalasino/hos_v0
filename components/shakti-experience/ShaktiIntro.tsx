'use client';

import { useMessages } from 'next-intl';
import { IntroArrangement } from '@/components/shared/IntroArrangement';

// ─── Intro ───────────────────────────────────────────────────────────────────
// The page's opening statement, in the home's own arrangement — the centred
// phrase over four rotating frames. The words are the owners' and live in
// the dictionary; the photographs are the twenty-one frames they chose.

// 21 frames of the experience, all shot 2:3 portrait.
const POOL = Array.from(
  { length: 21 },
  (_, i) => `/images/shakti-experience/introduction/intro-slider-${i + 1}.webp`,
);

export function ShaktiIntro() {
  const copy = useMessages().shaktiExperience.intro;
  return <IntroArrangement copy={copy} pool={POOL} />;
}
