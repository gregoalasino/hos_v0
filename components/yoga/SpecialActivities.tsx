'use client';

import { useTranslations } from 'next-intl';
import { ActivitiesTrack, type TrackActivity } from '@/components/shared/ActivitiesTrack';

// ─── Special Activities ──────────────────────────────────────────────────────
// The layer around the practice on /yoga: the reader has just seen the class
// schedule, and this is what the house offers in the hours between mats. The
// section itself is the shared ActivitiesTrack, the same one /stay-with-us
// carries, so a guest moving between the two pages reads one language instead
// of learning a second.
//
// Every one of these happens at the house, so the cards carry no location mark
// and open on the title. The order is the owners': the bodily contrasts first,
// then the quieter energetic work, then the ceremonies. The words live in the
// catalogue under yoga.special.items, keyed by `id`.

const img = (slug: string) => `/images/yoga/special-activities/${slug}.webp`;

const ACTIVITIES = [
  { id: 'saunaIceBath', image: img('sauna-ice-bath') },
  { id: 'massages', image: img('massage') },
  { id: 'soundHealing', image: img('sound-healing') },
  { id: 'reiki', image: img('reiki-access-bars') },
  { id: 'sacredMedicine', image: img('sacred-medicine-ceremony') },
  { id: 'cacaoFire', image: img('cacao-fire-ceremony') },
  { id: 'microdose', image: img('microdose-sound-healing') },
] as const;

export function SpecialActivities() {
  const t = useTranslations('yoga.special');

  const items: TrackActivity[] = ACTIVITIES.map((a) => ({
    title: t(`items.${a.id}.title`),
    description: t(`items.${a.id}.description`),
    image: a.image,
  }));

  return (
    <ActivitiesTrack
      heading={t('heading')}
      intro={t('intro')}
      note={t('note')}
      ariaLabel={t('trackAria')}
      items={items}
    />
  );
}
