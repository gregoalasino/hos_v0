'use client';

import { DaySchedule } from '@/components/shared/DaySchedule';
import { useLanguage } from '@/contexts/language-context';
import { YTT_DICTIONARIES } from '@/lib/i18n-ytt';

// Eleven frames following the day itself — practice, meals, study, the evening.
// Shot 2:3 (1000×1500), and framed at that ratio: forcing them into a 3:4 box
// would crop about a tenth of the height off every frame.
const FRAMES = Array.from(
  { length: 11 },
  (_, i) => `/images/schedule/schedule-${i + 1}.webp`,
);

// The schedule lives in the dictionary, in both languages; the section itself
// is the shared DaySchedule.
export function YTTRhythm() {
  const { lang } = useLanguage();
  const t = YTT_DICTIONARIES[lang].rhythm;
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
