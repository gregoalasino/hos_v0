'use client';

import { useTranslations } from 'next-intl';
import { ActivitiesTrack, type TrackActivity } from '@/components/shared/ActivitiesTrack';

// ─── Enhance your retreat ────────────────────────────────────────────────────
// What a host can add to the programme, in the section /stay-with-us uses for
// the same offer to a guest. All of it rides one track, at the property first
// and then beyond it, with where each happens as a mark on the card.
//
// The words are the owners' own, from the "Host your retreat in paradise"
// deck — in the catalogue under hostYourRetreat.activities.items, keyed by
// `id` — and so are the photographs: one per activity, in
// /images/host-your-retreat/activities.

const img = (slug: string) => `/images/host-your-retreat/activities/${slug}.webp`;

const ACTIVITIES = [
  { id: 'sauna', onSite: true, image: img('sauna') },
  { id: 'coldPlunge', onSite: true, image: img('cold-plunge') },
  { id: 'yogaClasses', onSite: true, image: img('yoga-classes') },
  { id: 'breathwork', onSite: true, image: img('breathwork-sessions') },
  { id: 'soundHealing', onSite: true, image: img('sound-healing') },
  { id: 'massage', onSite: true, image: img('massage') },
  { id: 'fireCeremony', onSite: true, image: img('fire-ceremony') },
  { id: 'privateChef', onSite: true, image: img('private-chef-service'), note: true },
  { id: 'surf', onSite: false, image: img('surf-lessons') },
  { id: 'horseback', onSite: false, image: img('horseback-riding') },
  { id: 'photoshoot', onSite: false, image: img('jungle-photoshoot') },
  // TODO: ATV Tours is in the owners' list but came without a photograph —
  // the only one of the fourteen that did. Its words are already in the
  // catalogue (items.atv); it joins the track the moment
  // `activities/atv-tours.webp` exists.
  // { id: 'atv', onSite: false, image: img('atv-tours') },
  { id: 'waterfalls', onSite: false, image: img('waterfall-hikes') },
  { id: 'boat', onSite: false, image: img('boat-trips') },
] as const;

export function HostActivities() {
  const t = useTranslations('hostYourRetreat.activities');

  const items: TrackActivity[] = ACTIVITIES.map((a) => ({
    where: t(a.onSite ? 'onSite' : 'offSite'),
    title: t(`items.${a.id}.title`),
    description: t(`items.${a.id}.description`),
    ...('note' in a ? { note: t(`items.${a.id}.note`) } : {}),
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
