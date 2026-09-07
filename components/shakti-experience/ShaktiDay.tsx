'use client';

import { ActivitiesTrack } from '@/components/shared/ActivitiesTrack';
import { useMessages } from 'next-intl';

// ─── A day at House of Shakti ────────────────────────────────────────────────
// The day as a row of moments, in the same track "More than a stay" rides a
// few sections up: one card per moment, its hour as the mark above the title
// and a photograph of that very moment — breakfast at the table, the class in
// the shala, the beach, the breathwork, the sauna. A timeline told this way
// takes one screen instead of three, and on a phone it swipes.
//
// The practical notes — what is arranged, what is yours, how to get around —
// sit with the invitation in the first column, in the quieter voice every
// track keeps for that.
const IMAGES: Record<string, string> = {
  breakfast: '/images/shakti-experience/more-than-a-stay/nourishing-food.webp',
  yoga: '/images/shakti-experience/introduction/intro-slider-9.webp',
  'free-time': '/images/shakti-experience/introduction/intro-slider-2.webp',
  breathwork: '/images/shakti-experience/more-than-a-stay/breathwork.webp',
  sauna: '/images/shakti-experience/introduction/intro-slider-21.webp',
};

export function ShaktiDay() {
  const t = useMessages().shaktiExperience.day;

  return (
    <ActivitiesTrack
      heading={t.heading}
      intro={t.intro}
      note={t.note}
      ariaLabel={t.trackAria}
      ornament="/logos/moon-phase.png"
      items={t.moments.map((moment) => ({
        where: moment.time,
        title: moment.title,
        description: moment.detail,
        image: IMAGES[moment.slug],
      }))}
    />
  );
}
