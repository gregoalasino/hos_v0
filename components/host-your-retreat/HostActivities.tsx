'use client';

import { ActivitiesTrack, type TrackActivity } from '@/components/shared/ActivitiesTrack';

// ─── Enhance your retreat ────────────────────────────────────────────────────
// What a host can add to the programme, in the section /stay-with-us uses for
// the same offer to a guest. All of it rides one track, at the property first
// and then beyond it, with where each happens as a mark on the card.
//
// The words are the owners' own, from the "Host your retreat in paradise"
// deck, and so are the photographs — one per activity, in
// /images/host-your-retreat/activities.

const img = (slug: string) => `/images/host-your-retreat/activities/${slug}.webp`;

const ACTIVITIES: TrackActivity[] = [
  {
    where: 'On site',
    title: 'Sauna Sessions',
    description: 'Detox and relax in our serene, private sauna.',
    image: img('sauna'),
  },
  {
    where: 'On site',
    title: 'Cold Plunge Therapy',
    description: 'Revitalize with an invigorating cold plunge.',
    image: img('cold-plunge'),
  },
  {
    where: 'On site',
    title: 'Yoga Classes',
    description: "Tailored to your group's level and intentions.",
    image: img('yoga-classes'),
  },
  {
    where: 'On site',
    title: 'Breathwork Sessions',
    description: 'Explore the power of conscious breathing.',
    image: img('breathwork-sessions'),
  },
  {
    where: 'On site',
    title: 'Sound Healing',
    description: 'Immerse yourself in a soothing meditative journey.',
    image: img('sound-healing'),
  },
  {
    where: 'On site',
    title: 'Massage Therapy',
    description: 'Indulge in restorative massages by skilled therapists.',
    image: img('massage'),
  },
  {
    where: 'On site',
    title: 'Fire Ceremony',
    description: 'Connect deeply with nature through a sacred ritual.',
    image: img('fire-ceremony'),
  },
  {
    where: 'On site',
    title: 'Private Chef Services',
    description: 'Enjoy gourmet meals curated by our talented local chef.',
    note: "Choose 2–3 meals a day, with customizable pricing options to fit your group's needs.",
    image: img('private-chef-service'),
  },
  {
    where: 'Off site',
    title: 'Surf Lessons',
    description: "Learn from the best at one of the world's premier surf destinations.",
    image: img('surf-lessons'),
  },
  {
    where: 'Off site',
    title: 'Horseback Riding',
    description: 'Explore stunning beaches and trails on horseback.',
    image: img('horseback-riding'),
  },
  {
    where: 'Off site',
    title: 'Jungle Photoshoot',
    description: 'Capture unforgettable moments in the lush jungle.',
    image: img('jungle-photoshoot'),
  },
  // TODO: ATV Tours is in the owners' list but came without a photograph —
  // the only one of the fourteen that did. The card is ready; it joins the
  // track the moment `activities/atv-tours.webp` exists.
  // {
  //   where: 'Off site',
  //   title: 'ATV Tours',
  //   description: 'Embark on thrilling rides through scenic trails.',
  //   image: img('atv-tours'),
  // },
  {
    where: 'Off site',
    title: 'Waterfall Hikes',
    description: "Experience the magic of Costa Rica's breathtaking waterfalls.",
    image: img('waterfall-hikes'),
  },
  {
    where: 'Off site',
    title: 'Boat Trips',
    description: 'Enjoy dolphin and whale watching, or try your hand at fishing.',
    image: img('boat-trips'),
  },
];

export function HostActivities() {
  return (
    <ActivitiesTrack
      heading="Enhance your retreat"
      intro="Enhance your retreat experience with a range of rejuvenating and transformational on-site activities, and discover the beauty of the surrounding area with exciting off-site adventures."
      note="Our team will help coordinate and personalize these activities to make your retreat unforgettable."
      ariaLabel="Activities for your retreat, at House of Shakti and beyond"
      items={ACTIVITIES}
    />
  );
}
