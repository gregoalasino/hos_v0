'use client';

import { IntroArrangement, type IntroCopy } from '@/components/shared/IntroArrangement';

// ─── A Journey of Wisdom and Wellness ────────────────────────────────────────
// The home's opening statement, sitting directly under the hero video. The
// arrangement itself — the centred phrase, the four rotating frames, the drawn
// line — lives in IntroArrangement, shared with /host-your-retreat; this file
// holds only what is the home's own: its words and its photographs.

// 19 frames of the house, all portrait.
const POOL = Array.from(
  { length: 19 },
  (_, i) => `/images/home/introduction/home-introduction-${String(i + 1).padStart(2, '0')}.webp`,
);

const COPY: IntroCopy = {
  en: {
    headline: 'A Journey of Wisdom and Wellness',
    paragraphs: [
      "This isn't an escape. It's a return. A return to your body, your breath and what truly matters.",
      'A few days immersed in nature, movement, rest and connection—between the jungle and the sea of Santa Teresa.',
      'Join us for retreats, trainings and classes rooted in presence, connection and transformation.',
    ],
    trackAria: 'Photographs of House of Shakti',
  },
  es: {
    headline: 'Un viaje de sabiduría y bienestar',
    paragraphs: [
      'Esto no es un escape. Es un regreso. Un regreso a tu cuerpo, a tu respiración y a lo que de verdad importa.',
      'Unos días inmersos en naturaleza, movimiento, descanso y conexión—entre la selva y el mar de Santa Teresa.',
      'Te esperamos en retiros, formaciones y clases enraizados en presencia, conexión y transformación.',
    ],
    trackAria: 'Fotografías de House of Shakti',
  },
};

export function ReturnToYourself() {
  return <IntroArrangement copy={COPY} pool={POOL} />;
}
