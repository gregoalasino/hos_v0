'use client';

import { DaySchedule } from '@/components/shared/DaySchedule';
import { useLanguage } from '@/contexts/language-context';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';

// ─── A day at House of Shakti ────────────────────────────────────────────────
// The day, told in the training landing's schedule section — simplified to
// its beats, with the practical notes folded into the same timeline rather
// than set as paragraphs beneath it. The frames walk the day in order —
// breakfast, the mat, the beach, the sauna and the plunge, the hammock —
// drawn from the experience's own photographs (2:3, so framed at 2:3). They
// come from the introduction's pool rather than from the activity cards
// above, so the same photograph never sits in two sections a scroll apart.
const FRAMES = [7, 9, 2, 11, 21, 15, 3, 18].map(
  (n) => `/images/shakti-experience/introduction/intro-slider-${n}.webp`,
);

export function ShaktiDay() {
  const { lang } = useLanguage();
  const t = SHAKTI_DICTIONARIES[lang].day;
  return (
    <DaySchedule
      heading={t.heading}
      eyebrow={t.eyebrow}
      blocks={t.blocks}
      footnote={t.footnote}
      trackAria={t.trackAria}
      frames={FRAMES}
    />
  );
}
