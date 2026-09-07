'use client';

import { IntroArrangement, type IntroCopy } from '@/components/shared/IntroArrangement';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';

// ─── Intro ───────────────────────────────────────────────────────────────────
// The page's opening statement, in the home's own arrangement — the centred
// phrase over four rotating frames. The words are the owners' and live in
// the dictionary; the photographs are the twenty-one frames they chose.

// 21 frames of the experience, all shot 2:3 portrait.
const POOL = Array.from(
  { length: 21 },
  (_, i) => `/images/shakti-experience/introduction/intro-slider-${i + 1}.webp`,
);

const COPY: IntroCopy = {
  en: SHAKTI_DICTIONARIES.en.intro,
  es: SHAKTI_DICTIONARIES.es.intro,
};

export function ShaktiIntro() {
  return <IntroArrangement copy={COPY} pool={POOL} />;
}
