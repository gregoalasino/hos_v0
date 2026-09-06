'use client';

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
// then the quieter energetic work, then the ceremonies.

const img = (slug: string) => `/images/yoga/special-activities/${slug}.webp`;

const ACTIVITIES: TrackActivity[] = [
  {
    title: 'Sauna & Ice Bath',
    description:
      'A powerful contrast experience to relax, reset, and reconnect with your body through heat and cold.',
    image: img('sauna-ice-bath'),
  },
  {
    title: 'Massages',
    description:
      'Relax and reconnect with your body through therapeutic, relaxing, Thai, or deep tissue massage.',
    image: img('massage'),
  },
  {
    title: 'Sound Healing',
    description:
      'Relax and restore balance through the healing power of sound and vibration.',
    image: img('sound-healing'),
  },
  {
    title: 'Reiki & Access Bars',
    description:
      'A deeply relaxing experience designed to restore energetic balance and inner calm.',
    image: img('reiki-access-bars'),
  },
  {
    title: 'Sacred Medicine Ceremony',
    description:
      'A guided and intentional experience for self-exploration, connection, and personal growth.',
    image: img('sacred-medicine-ceremony'),
  },
  {
    title: 'Cacao & Fire Ceremony',
    description:
      'A sacred ritual of cacao and fire, inviting connection, gratitude, and heart opening.',
    image: img('cacao-fire-ceremony'),
  },
  {
    title: 'Microdose & Sound Healing Ceremony',
    description:
      'A heart-opening microdosing ceremony with cacao, breathwork, sound healing, and live music. A gentle journey inward, closing with integration and fresh fruits.',
    image: img('microdose-sound-healing'),
  },
];

export function SpecialActivities() {
  return (
    <ActivitiesTrack
      heading="Special Activities"
      intro="The practice does not end on the mat. These are the rituals the house holds around it, for the hours between classes."
      note="All of them are arranged with our team at reception."
      ariaLabel="Special activities at House of Shakti"
      items={ACTIVITIES}
    />
  );
}
