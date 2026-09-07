'use client';

import { useTranslations } from 'next-intl';
import { ActivitiesTrack, type TrackActivity } from '@/components/shared/ActivitiesTrack';

// ─── Enhance your experience ─────────────────────────────────────────────────
// The activities layer of /stay-with-us: the guest has just chosen where to
// sleep, and this is everything the house offers to fill the days — at the
// property and beyond it. The section itself is the shared ActivitiesTrack;
// what is this page's own is below.
//
// All eleven ride one track, in the order the owners present them: everything
// at the property first, then everything beyond it. Where each happens is a
// mark on the card, so a guest planning their days can still tell a massage
// down the path from a morning out on a boat. The words live in the catalogue
// under stayWithUs.activities.items, keyed by `id`.

const img = (slug: string) => `/images/stay-with-us/activities/activity-${slug}.webp`;

const ACTIVITIES = [
  { id: 'yoga', onSite: true, image: img('yoga') },
  { id: 'saunaIceBath', onSite: true, image: img('sauna-ice-bath') },
  { id: 'massages', onSite: true, image: img('massage') },
  { id: 'soundHealing', onSite: true, image: img('sound-healing') },
  { id: 'reiki', onSite: true, image: img('reiki-access-bars') },
  { id: 'sacredMedicine', onSite: true, image: img('sacred-medicine') },
  { id: 'cacaoFire', onSite: true, image: img('cacao-fire-ceremony') },
  { id: 'boatTour', onSite: false, image: img('boat-tour'), note: true },
  { id: 'jungleHike', onSite: false, image: img('jungle-hike') },
  { id: 'surf', onSite: false, image: img('surf') },
  { id: 'horseback', onSite: false, image: img('horseback-riding') },
] as const;

export function EnhanceYourExperience() {
  const t = useTranslations('stayWithUs.activities');

  const items: TrackActivity[] = ACTIVITIES.map((a) => ({
    where: t(a.onSite ? 'onSite' : 'offSite'),
    title: t(`items.${a.id}.title`),
    description: t(`items.${a.id}.description`),
    ...('note' in a ? { note: t(`items.${a.id}.note`) } : {}),
    image: a.image,
  }));

  return (
    <ActivitiesTrack
      // No top padding — the stays grid above already closes with pb-20/28.
      spacing="pb-20 lg:pb-28"
      heading={t('heading')}
      intro={t('intro')}
      note={t('note')}
      ariaLabel={t('trackAria')}
      items={items}
    />
  );
}
