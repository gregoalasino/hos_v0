'use client';

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
// down the path from a morning out on a boat.

const img = (slug: string) => `/images/stay-with-us/activities/activity-${slug}.webp`;

const ACTIVITIES: TrackActivity[] = [
  {
    where: 'On site',
    title: 'Yoga Classes',
    description:
      'Move, breathe, and reconnect through mindful yoga practices designed to support balance, presence, and wellbeing.',
    image: img('yoga'),
  },
  {
    where: 'On site',
    title: 'Sauna & Ice Bath',
    description:
      'A powerful contrast experience to relax, reset, and reconnect with your body through heat and cold.',
    image: img('sauna-ice-bath'),
  },
  {
    where: 'On site',
    title: 'Massages',
    description:
      'Relax and reconnect with your body through therapeutic, relaxing, Thai, or deep tissue massage.',
    image: img('massage'),
  },
  {
    where: 'On site',
    title: 'Sound Healing',
    description:
      'Relax and restore balance through the healing power of sound and vibration.',
    image: img('sound-healing'),
  },
  {
    where: 'On site',
    title: 'Reiki & Access Bars',
    description:
      'A deeply relaxing experience designed to restore energetic balance and inner calm.',
    image: img('reiki-access-bars'),
  },
  {
    where: 'On site',
    title: 'Sacred Medicine Ceremony',
    description:
      'A guided and intentional experience for self-exploration, connection, and personal growth.',
    image: img('sacred-medicine'),
  },
  {
    where: 'On site',
    title: 'Cacao & Fire Ceremony',
    description:
      'A sacred ritual of cacao and fire, inviting connection, gratitude, and heart opening.',
    image: img('cacao-fire-ceremony'),
  },
  {
    where: 'Off site',
    title: 'Boat Tour',
    description:
      "Explore the peninsula's beautiful beaches, snorkel in crystal-clear waters, and enjoy a day in nature.",
    note: 'Optional: bioluminescence experience.',
    image: img('boat-tour'),
  },
  {
    where: 'Off site',
    title: 'Jungle Hike',
    description:
      'A refreshing jungle adventure to a hidden freshwater waterfall, just 40 minutes away.',
    image: img('jungle-hike'),
  },
  {
    where: 'Off site',
    title: 'Surf Lessons',
    description:
      "Learn to surf or improve your skills in Santa Teresa's best spots. Shared and private lessons available.",
    image: img('surf'),
  },
  {
    where: 'Off site',
    title: 'Horseback Riding',
    description:
      'Discover beaches, jungle, and mountain trails on a beautiful sunset horseback ride. Shared or private options available.',
    image: img('horseback-riding'),
  },
];

export function EnhanceYourExperience() {
  return (
    <ActivitiesTrack
      // No top padding — the stays grid above already closes with pb-20/28.
      spacing="pb-20 lg:pb-28"
      heading="Enhance your experience"
      intro="Enhance your stay with meaningful experiences, both at House of Shakti and beyond."
      note="Add any of these while booking your stay, or arrange them later with our team at reception."
      ariaLabel="Activities at House of Shakti and beyond"
      items={ACTIVITIES}
    />
  );
}
