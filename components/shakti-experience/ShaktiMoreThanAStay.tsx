'use client';

import { ActivitiesTrack } from '@/components/shared/ActivitiesTrack';
import { useMessages } from 'next-intl';

// ─── More than a stay ────────────────────────────────────────────────────────
// Everything the experience holds, in the section /stay-with-us uses for the
// same offer to a guest. All of it happens at the house or from it, so the
// cards carry no location mark. Words in the dictionary, one photograph per
// item in /images/shakti-experience/more-than-a-stay.

const img = (slug: string) => `/images/shakti-experience/more-than-a-stay/${slug}.webp`;

export function ShaktiMoreThanAStay() {
  const t = useMessages().shaktiExperience.moreThanAStay;

  return (
    <ActivitiesTrack
      heading={t.heading}
      intro={t.intro}
      ariaLabel={t.trackAria}
      items={t.items.map((item) => ({
        title: item.title,
        description: item.description,
        image: img(item.slug),
      }))}
    />
  );
}
