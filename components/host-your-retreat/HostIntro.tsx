'use client';

import { IntroArrangement, type IntroCopy } from '@/components/shared/IntroArrangement';

// ─── Intro ───────────────────────────────────────────────────────────────────
// The page's opening statement, in the home's own arrangement — the centred
// phrase over four rotating frames. The words are the sanctuary's welcome from
// the owners' "Host your retreat in paradise" deck; the photographs are the
// thirteen frames they chose for it.

// 13 frames, all portrait: the beach, the pool, the rooms, the shala.
const POOL = Array.from(
  { length: 13 },
  (_, i) => `/images/host-your-retreat/slider/host-retreat-slider-${i + 1}.webp`,
);

const COPY: IntroCopy = {
  en: {
    headline: 'A sanctuary to hold your gathering',
    paragraphs: [
      'House of Shakti is a tranquil, luxurious haven nestled in the heart of nature — a place designed to inspire connection, transformation and rejuvenation.',
      'Tucked away on a serene hilltop, the sanctuary offers complete privacy and breathtaking jungle views, five minutes from Playa Hermosa in Santa Teresa — one of the best surf spots and most beautiful beaches in Costa Rica.',
      "Whether you're leading a wellness workshop, a creative getaway or a spiritual journey, our space and our team cater to your every need, creating an unforgettable experience for you and your guests.",
    ],
    trackAria: 'Photographs of House of Shakti',
  },
  es: {
    headline: 'Un santuario para sostener tu encuentro',
    paragraphs: [
      'House of Shakti es un refugio tranquilo y lujoso en el corazón de la naturaleza, un lugar pensado para inspirar conexión, transformación y renovación.',
      'Escondido en lo alto de una colina serena, el santuario ofrece privacidad total y vistas impresionantes a la selva, a cinco minutos de Playa Hermosa, en Santa Teresa: uno de los mejores spots de surf y una de las playas más bellas de Costa Rica.',
      'Ya sea que guíes un taller de bienestar, una escapada creativa o un viaje espiritual, nuestro espacio y nuestro equipo se ocupan de cada detalle para crear una experiencia inolvidable para vos y tus invitados.',
    ],
    trackAria: 'Fotografías de House of Shakti',
  },
};

export function HostIntro() {
  return <IntroArrangement copy={COPY} pool={POOL} />;
}
