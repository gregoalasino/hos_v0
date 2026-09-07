// ─── Retreat detail-page schema ───────────────────────────────────────────────
// One record per active retreat. Adding a new retreat is meant to be a single
// append to the RECORDS array — every section of /retreats/[slug] reads its
// content from here.
//
// A record is language-neutral data — dates, photographs, prices, links — plus
// its words in every language under `copy`. The page asks for a retreat in a
// locale and gets the flat `Retreat` every section renders; nothing downstream
// knows there are two versions. The structured data reads the English one in
// both languages, so the JSON-LD never differs between /retreats/x and
// /es/retreats/x.

import type { AppLocale } from '@/i18n/routing';
import { WHATSAPP_URL_PLAIN } from '@/lib/whatsapp';

export type RetreatHost = {
  image: string;
  name: string;
  handle: string;
  role: string;
};

export type RetreatDay = {
  title: string;
  activities: string[];
};

export type RetreatGalleryImage = {
  src: string;
  aspect: string; // tailwind aspect-ratio utility, e.g. 'aspect-[4/5]'
  alt: string;
};

export type RetreatTestimonial = {
  quote: string;
  author: string;
  location: string;
  image: string; // portrait of the person — square or 3/4 works best
};

export type RetreatEarlyBird = {
  enabled: boolean;
  expiresAt: string; // ISO date string
  amount: number;    // USD
  savingsLabel?: string;
};

export type RetreatPricing = {
  earlyBird?: RetreatEarlyBird;
  regular: { amount: number };
  paymentMethods: string[];
  paymentTerms: string[]; // each item renders as its own line, mirroring paymentMethods
};

/** A retreat as the page renders it: one language, every field flat. */
export type Retreat = {
  slug: string;

  // Machine-readable dates, for the Event structured data on the detail page.
  // `heroEyebrow` carries the same dates as display copy; these are the ones a
  // machine reads. Optional because a retreat can be listed before its dates
  // are fixed — `lib/schema.ts` emits no Event until both are present, since
  // `startDate` is the one field schema.org marks required.
  // Format: ISO 8601 date, e.g. '2026-07-18'.
  startDate?: string;
  endDate?: string;

  // Hero
  // The hero renders as a full-bleed video (same pattern as home/yoga/stay-with-us).
  heroImage: string;           // kept as legacy / fallback poster; not used by hero today
  heroEyebrow: string;
  heroTitle: string;
  heroSubhead: string;
  heroLocation: string;
  heroDates: string;
  heroCupos: string;

  // Manifesto
  manifestoHeading: string;
  manifestoBody: string;

  // ForYou
  forYouHeading: string;
  forYouItems: string[];
  forYouImage: string;

  // Journey (video moment)
  journeyHeading: string;
  journeyBody: string;
  videoPoster: string;
  videoDesktop?: string; // path or URL to .mp4 — when missing, the poster image is shown
  videoMobile?: string;

  // Schedule
  scheduleHeading: string;
  scheduleDays: RetreatDay[];

  // Includes
  includesHeading: string;
  includesItems: string[];
  notIncluded: string[]; // each item renders as its own paragraph

  // Hosts
  hostsHeading: string;
  hosts: RetreatHost[];

  // Space
  spaceHeading: string;
  spaceBody: string;
  spaceImages: string[]; // exactly 4 images expected

  // Gallery
  galleryImages: RetreatGalleryImage[];

  // Testimonials
  testimonials: RetreatTestimonial[];

  // Investment / pricing
  pricing: RetreatPricing;

  // Final CTA
  finalCTAHeading: string;
  finalCTAPrimaryLabel: string;
  finalCTAPrimaryHref: string;
  finalCTASecondaryLabel: string;
  finalCTASecondaryHref: string;
};

/**
 * The words of a retreat in one language. Lists that pair with neutral data
 * — a host's role with their portrait, a testimonial's quote with the
 * person's photograph, a gallery alt with its file — are kept in the same
 * order as that data; `toRetreat` zips them back together.
 */
type RetreatCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubhead: string;
  heroLocation: string;
  heroDates: string;
  heroCupos: string;
  manifestoHeading: string;
  manifestoBody: string;
  forYouHeading: string;
  forYouItems: string[];
  journeyHeading: string;
  journeyBody: string;
  scheduleHeading: string;
  scheduleDays: RetreatDay[];
  includesHeading: string;
  includesItems: string[];
  notIncluded: string[];
  hostsHeading: string;
  /** One per host, in order. */
  hostRoles: string[];
  spaceHeading: string;
  spaceBody: string;
  /** One per gallery image, in order. */
  galleryAlts: string[];
  /** One per testimonial, in order. */
  testimonials: { quote: string; location: string }[];
  pricing: { savingsLabel?: string; paymentMethods: string[]; paymentTerms: string[] };
  finalCTAHeading: string;
  finalCTAPrimaryLabel: string;
  finalCTASecondaryLabel: string;
};

type RetreatRecord = {
  slug: string;
  startDate?: string;
  endDate?: string;
  heroImage: string;
  forYouImage: string;
  videoPoster: string;
  videoDesktop?: string;
  videoMobile?: string;
  hosts: Omit<RetreatHost, 'role'>[];
  spaceImages: string[];
  galleryImages: Omit<RetreatGalleryImage, 'alt'>[];
  testimonials: Pick<RetreatTestimonial, 'author' | 'image'>[];
  pricing: {
    earlyBird?: Omit<RetreatEarlyBird, 'savingsLabel'>;
    regular: { amount: number };
  };
  finalCTAPrimaryHref: string;
  finalCTASecondaryHref: string;
  copy: Record<AppLocale, RetreatCopy>;
};

// ─── Shakti Sadhana — real data (provided by Nancy) ───────────────────────────
// Copy below comes from Nancy's source material. Photography and Nancy's
// portrait + Instagram handle are still pending — flagged with TODO so the
// swap is a one-line change when assets land.
const SHAKTI_SADHANA: RetreatRecord = {
  slug: 'shakti-sadhana',

  // Confirmed by the owners on 2026-09-07. Seven days, six nights, which is
  // what `heroDates` says in words.
  startDate: '2026-07-18',
  endDate: '2026-07-24',

  heroImage: '/images/yoga/IMG_8420%201.webp', // TODO: retreat-specific cover photo
  forYouImage: '/images/yoga/IMG_5608%201.webp', // TODO: retreat-specific photo
  videoPoster: '/images/sanctuary/271A0676_websize%201.webp', // TODO: retreat-specific poster frame
  // TODO: replace with House of Shakti's own video. Currently using Trama Viva's
  // "Within" video as a temporary placeholder so the moment can be imagined.
  videoDesktop: 'https://www.trama-viva.com/videos/within-video-desktop.mp4',

  // Hosts — Nancy only
  hosts: [
    {
      image: '/images/yoga/IMG_8693%201.webp', // TODO: Nancy's portrait
      name: 'Nancy Goodfellow',
      handle: '', // TODO: confirm Instagram handle
    },
  ],

  spaceImages: [
    '/images/sanctuary/271A0822_websize%201.webp',
    '/images/sanctuary/271A0759_websize%201.webp',
    '/images/sanctuary/271A0851_websize%201.webp',
    '/images/sanctuary/271A0790_websize%201.webp',
    '/images/sanctuary/271A0828_websize%201.webp',
    '/images/sanctuary/271A0856_websize%201.webp',
  ],

  galleryImages: [
    { src: '/images/sanctuary/271A0719_websize%201.webp', aspect: 'aspect-[3/4]' },
    { src: '/images/yoga/IMG_5615%201.webp',              aspect: 'aspect-square' },
    { src: '/images/sanctuary/271A0856_websize%201.webp', aspect: 'aspect-[3/4]' },
    { src: '/images/yoga/IMG_8693%201.webp',              aspect: 'aspect-[4/5]' },
    { src: '/images/contrast_therapy/IMG_7067%201.webp',  aspect: 'aspect-square' },
    { src: '/images/sanctuary/271A0698_websize%201.webp', aspect: 'aspect-[4/3]' },
    { src: '/images/yoga/IMG_7491%201.webp',              aspect: 'aspect-[3/4]' },
    { src: '/images/sanctuary/271A0883_websize%201.webp', aspect: 'aspect-[4/3]' },
  ],

  // Testimonials — placeholder until Nancy provides real ones
  // TODO: replace with real guest testimonials + real portraits
  testimonials: [
    { author: 'Maya Lindstrom', image: '/images/yoga/IMG_7538%201.webp' },
    { author: 'Sofía Morales', image: '/images/yoga/IMG_7539%201.webp' },
    { author: 'Camille Boucher', image: '/images/yoga/IMG_8683%201.webp' },
  ],

  // Investment — real pricing from Nancy
  // Note: original source used calendar-month tiered pricing (March / April).
  // Translated to a standard Early Bird vs Regular pattern with the EB
  // window closing one month before the retreat. There's also a special
  // 2-person rate of $1,305 per person — mentioned in the payment terms
  // since the layout supports only two pricing tiers in cards.
  pricing: {
    earlyBird: {
      enabled: true,
      expiresAt: '2026-06-18T23:59:59',
      amount: 1414,
    },
    regular: { amount: 1625 },
  },

  finalCTAPrimaryHref: '/contact?retreat=shakti-sadhana',
  finalCTASecondaryHref: WHATSAPP_URL_PLAIN,

  copy: {
    en: {
      heroEyebrow: 'July 18 – 24 · 2026',
      heroTitle: 'Shakti Sadhana',
      heroSubhead: 'An invitation to return to the source of your vital energy.',
      heroLocation: 'Santa Teresa, Costa Rica',
      heroDates: '7 days · 6 nights',
      heroCupos: 'Intimate group',

      manifestoHeading: 'Return to what is essential.',
      manifestoBody:
        'A space of pause, listening, and conscious practice — where we cultivate a relationship with the body as sacred territory and with Shakti as the creative, intuitive, transformative life force. Throughout the retreat we immerse ourselves in sadhana as a living path: yoga, breathwork, meditation, ritual, free movement, and moments of silence — all held by nature and the collective field. A time to soften, shed layers, reconnect with intuition, and remember the gentle, authentic power that lives within you.',

      forYouHeading: 'This retreat is for you if...',
      forYouItems: [
        'You feel the call to soften and shed layers.',
        'You want to reconnect with your intuition and the wisdom of the body.',
        'You are curious about Shakti as a living, creative force.',
        'You are ready to be held by nature and a small collective field.',
        'You arrive seeking practice, ritual, and a real return.',
      ],

      journeyHeading: 'This is how it feels.',
      journeyBody:
        'Mornings open with practice on the open-air shala. Afternoons soften into breathwork, ritual, or workshops. Evenings gather around food and dim light. Each practice is designed to awaken sensitivity, presence, and inner connection — while honoring personal rhythms and the innate wisdom of the body.',

      // Schedule — from Nancy's source material
      scheduleHeading: 'Day by day.',
      scheduleDays: [
        {
          title: 'Arrival',
          activities: [
            '3:00 PM — Check in at House of Shakti',
            '5:00 PM — Welcome circle',
            '7:30 PM — Dinner',
          ],
        },
        {
          title: 'Awakening',
          activities: [
            'Free morning',
            '10:00 AM — Yoga practice',
            '12:30 PM — Brunch',
            '4:00 PM — Shakti Tantra workshop',
            '6:00 PM — Sauna & ice bath',
            '7:30 PM — Dinner',
          ],
        },
        {
          title: 'Breath',
          activities: [
            'Free morning',
            '10:00 AM — Yoga practice',
            '12:30 PM — Brunch',
            '5:00 PM — Breathwork journey',
            '7:30 PM — Dinner',
          ],
        },
        {
          title: 'Ocean',
          activities: [
            '9:00 AM — Boat tour (lunch included)',
            '7:30 PM — Dinner',
          ],
        },
        {
          title: 'Listening',
          activities: [
            'Free morning',
            '10:00 AM — Yoga class',
            '12:30 PM — Brunch',
            'Free afternoon',
            '6:00 PM — Sauna & ice bath',
            '7:30 PM — Dinner',
          ],
        },
        {
          title: 'Sound',
          activities: [
            'Free morning',
            '10:00 AM — Yoga class',
            '12:30 PM — Brunch',
            'Free afternoon',
            '6:00 PM — Gentle breath & sound healing',
            '7:30 PM — Dinner',
          ],
        },
        {
          title: 'Closing',
          activities: [
            '8:00 AM — Closing circle',
            '10:00 AM — Breakfast',
            '11:00 AM — Check out',
          ],
        },
      ],

      // Includes — from Nancy's source material
      includesHeading: 'What’s included.',
      includesItems: [
        'Accommodation',
        'Daily yoga practice',
        'Brunch every day',
        'One Breathwork Journey',
        'Two sauna & ice bath sessions',
        'One boat tour with lunch',
        'One Gentle Breath & Sound Healing',
        'One Shakti Tantra Workshop',
      ],
      notIncluded: [
        'International flights, ground transfers, and travel insurance are not included — we’re happy to advise on the best options and share trusted local contacts.',
        'Dinner is also not included; guests can cook at the house or explore Santa Teresa’s culinary scene.',
        'Many nationalities receive a free 180-day visa on arrival — please confirm requirements for your nationality before traveling.',
      ],

      hostsHeading: 'Held by.',
      hostRoles: [
        'Yoga teacher, facilitator, and space holder. Nancy’s work weaves together yoga, breath, meditation, and somatic exploration — creating experiences that invite a deep return to the body as a source of wisdom and truth. Rooted in sensitivity, conscious practice, and the belief that true transformation unfolds through listening, safety, and embodied presence.',
      ],

      // Space — lightly edited from Nancy's source material
      spaceHeading: 'A sanctuary nestled in nature.',
      spaceBody:
        'House of Shakti is a tranquil sanctuary perched on a serene hilltop, with complete privacy and breathtaking jungle views. Five minutes from Playa Hermosa, Santa Teresa — one of Costa Rica’s most beautiful beaches and renowned surf spots. The property offers a main house, a jungle house, and La Casita — a one-bedroom bungalow with full kitchen and jungle-view deck.',

      galleryAlts: [
        'A quiet sanctuary corner',
        'Practice at sunset',
        'Garden space',
        'Group practice',
        'Cold plunge ritual',
        'Open-air shala',
        'Sunrise practice',
        'The jungle at golden hour',
      ],

      testimonials: [
        {
          quote:
            'I arrived tired and left changed. Not because of any one thing, but because of the way everything was held — the food, the space, the silence.',
          location: 'New York, USA',
        },
        {
          quote:
            'It is the rare place that lives up to its own quiet. I have started planning my year around returning.',
          location: 'Mexico City, Mexico',
        },
        {
          quote:
            'I came hoping to learn something new. I left having remembered what I already knew.',
          location: 'Paris, France',
        },
      ],

      pricing: {
        savingsLabel: 'Save $211 when booking early',
        paymentMethods: [
          'USD bank transfer (Wise / Zelle)',
          'Costa Rican colones in cash on arrival',
          'Credit or debit card (Stripe)',
          'PayPal (3% fee applies)',
        ],
        paymentTerms: [
          'Special couple rate — $1,305 USD per person when two reserve together.',
          'A 30% deposit secures your place. The remaining balance is due 30 days before arrival.',
          'Full refund available up to 60 days before arrival.',
          '50% refund available between 60 and 30 days before arrival.',
          'Non-refundable within 30 days of arrival.',
        ],
      },

      finalCTAHeading: 'There are only a few places.',
      finalCTAPrimaryLabel: 'Reserve your place',
      finalCTASecondaryLabel: 'Ask a question on WhatsApp',
    },
    es: {
      heroEyebrow: '18 – 24 de julio · 2026',
      heroTitle: 'Shakti Sadhana',
      heroSubhead: 'Una invitación a volver a la fuente de tu energía vital.',
      heroLocation: 'Santa Teresa, Costa Rica',
      heroDates: '7 días · 6 noches',
      heroCupos: 'Grupo íntimo',

      manifestoHeading: 'Volver a lo esencial.',
      manifestoBody:
        'Un espacio de pausa, escucha y práctica consciente, donde cultivamos una relación con el cuerpo como territorio sagrado y con Shakti como fuerza vital creativa, intuitiva y transformadora. A lo largo del retiro nos sumergimos en la sadhana como un camino vivo: yoga, respiración, meditación, ritual, movimiento libre y momentos de silencio, todo sostenido por la naturaleza y el campo colectivo. Un tiempo para suavizarse, soltar capas, reconectar con la intuición y recordar el poder suave y auténtico que vive en ti.',

      forYouHeading: 'Este retiro es para ti si...',
      forYouItems: [
        'Sientes el llamado a suavizarte y soltar capas.',
        'Quieres reconectar con tu intuición y la sabiduría del cuerpo.',
        'Te intriga Shakti como fuerza viva y creativa.',
        'Te sientes en disposición de dejarte sostener por la naturaleza y un pequeño campo colectivo.',
        'Llegas en busca de práctica, ritual y un regreso verdadero.',
      ],

      journeyHeading: 'Así se siente.',
      journeyBody:
        'Las mañanas abren con la práctica en la shala al aire libre. Las tardes se suavizan con respiración, ritual o talleres. Las noches se reúnen alrededor de la comida y la luz tenue. Cada práctica está diseñada para despertar la sensibilidad, la presencia y la conexión interior, honrando los ritmos personales y la sabiduría innata del cuerpo.',

      scheduleHeading: 'Día a día.',
      scheduleDays: [
        {
          title: 'Llegada',
          activities: [
            '3:00 p. m. — Check-in en House of Shakti',
            '5:00 p. m. — Círculo de bienvenida',
            '7:30 p. m. — Cena',
          ],
        },
        {
          title: 'Despertar',
          activities: [
            'Mañana libre',
            '10:00 a. m. — Práctica de yoga',
            '12:30 p. m. — Brunch',
            '4:00 p. m. — Taller de Shakti Tantra',
            '6:00 p. m. — Sauna y baño de hielo',
            '7:30 p. m. — Cena',
          ],
        },
        {
          title: 'Respiración',
          activities: [
            'Mañana libre',
            '10:00 a. m. — Práctica de yoga',
            '12:30 p. m. — Brunch',
            '5:00 p. m. — Viaje de respiración',
            '7:30 p. m. — Cena',
          ],
        },
        {
          title: 'Océano',
          activities: [
            '9:00 a. m. — Paseo en lancha (almuerzo incluido)',
            '7:30 p. m. — Cena',
          ],
        },
        {
          title: 'Escucha',
          activities: [
            'Mañana libre',
            '10:00 a. m. — Clase de yoga',
            '12:30 p. m. — Brunch',
            'Tarde libre',
            '6:00 p. m. — Sauna y baño de hielo',
            '7:30 p. m. — Cena',
          ],
        },
        {
          title: 'Sonido',
          activities: [
            'Mañana libre',
            '10:00 a. m. — Clase de yoga',
            '12:30 p. m. — Brunch',
            'Tarde libre',
            '6:00 p. m. — Respiración suave y sanación con sonido',
            '7:30 p. m. — Cena',
          ],
        },
        {
          title: 'Cierre',
          activities: [
            '8:00 a. m. — Círculo de cierre',
            '10:00 a. m. — Desayuno',
            '11:00 a. m. — Check-out',
          ],
        },
      ],

      includesHeading: 'Qué incluye.',
      includesItems: [
        'Alojamiento',
        'Práctica diaria de yoga',
        'Brunch todos los días',
        'Un viaje de respiración (Breathwork Journey)',
        'Dos sesiones de sauna y baño de hielo',
        'Un paseo en lancha con almuerzo',
        'Una sesión de respiración suave y sanación con sonido',
        'Un taller de Shakti Tantra',
      ],
      notIncluded: [
        'Los vuelos internacionales, los traslados terrestres y el seguro de viaje no están incluidos; con gusto te orientamos sobre las mejores opciones y compartimos contactos locales de confianza.',
        'La cena tampoco está incluida; puedes cocinar en la casa o explorar la escena gastronómica de Santa Teresa.',
        'Muchas nacionalidades reciben una visa gratuita de 180 días al llegar; confirma los requisitos para tu nacionalidad antes de viajar.',
      ],

      hostsHeading: 'Sostenido por.',
      hostRoles: [
        'Profesora de yoga, facilitadora y sostenedora de espacios. El trabajo de Nancy entrelaza yoga, respiración, meditación y exploración somática, creando experiencias que invitan a un regreso profundo al cuerpo como fuente de sabiduría y verdad. Arraigado en la sensibilidad, la práctica consciente y la convicción de que la verdadera transformación se despliega a través de la escucha, la seguridad y la presencia encarnada.',
      ],

      spaceHeading: 'Un santuario en medio de la naturaleza.',
      spaceBody:
        'House of Shakti es un santuario tranquilo en lo alto de una colina serena, con privacidad total y vistas impresionantes a la selva. A cinco minutos de Playa Hermosa, Santa Teresa, una de las playas más bellas de Costa Rica y un reconocido destino de surf. La propiedad ofrece una casa principal, una casa en la selva y La Casita: un bungalow de un dormitorio con cocina completa y terraza con vista a la selva.',

      galleryAlts: [
        'Un rincón tranquilo del santuario',
        'Práctica al atardecer',
        'Espacio de jardín',
        'Práctica en grupo',
        'Ritual de inmersión en frío',
        'Shala al aire libre',
        'Práctica al amanecer',
        'La selva a la hora dorada',
      ],

      testimonials: [
        {
          quote:
            'Llegué cansada y me fui distinta. No por una cosa en particular, sino por la manera en que todo estaba sostenido: la comida, el espacio, el silencio.',
          location: 'Nueva York, Estados Unidos',
        },
        {
          quote:
            'Es ese lugar raro que está a la altura de su propio silencio. He empezado a planear mi año alrededor de volver.',
          location: 'Ciudad de México, México',
        },
        {
          quote:
            'Vine con la esperanza de aprender algo nuevo. Me fui habiendo recordado lo que ya sabía.',
          location: 'París, Francia',
        },
      ],

      pricing: {
        savingsLabel: 'Ahorra $211 reservando con anticipación',
        paymentMethods: [
          'Transferencia bancaria en USD (Wise / Zelle)',
          'Colones costarricenses en efectivo al llegar',
          'Tarjeta de crédito o débito (Stripe)',
          'PayPal (aplica un 3 % de comisión)',
        ],
        paymentTerms: [
          'Tarifa especial para parejas: $1,305 USD por persona cuando dos reservan juntas.',
          'Un depósito del 30 % asegura tu lugar. El saldo restante se abona 30 días antes de la llegada.',
          'Reembolso total hasta 60 días antes de la llegada.',
          'Reembolso del 50 % entre 60 y 30 días antes de la llegada.',
          'No reembolsable dentro de los 30 días previos a la llegada.',
        ],
      },

      finalCTAHeading: 'Quedan solo unos pocos lugares.',
      finalCTAPrimaryLabel: 'Reserva tu lugar',
      finalCTASecondaryLabel: 'Haz una pregunta por WhatsApp',
    },
  },
};

const RECORDS: RetreatRecord[] = [SHAKTI_SADHANA];

/** Zips a record's neutral data with its words in one language. */
function toRetreat(record: RetreatRecord, locale: AppLocale): Retreat {
  const copy = record.copy[locale];
  const { copy: _copy, hosts, galleryImages, testimonials, pricing, ...neutral } = record;
  return {
    ...neutral,
    heroEyebrow: copy.heroEyebrow,
    heroTitle: copy.heroTitle,
    heroSubhead: copy.heroSubhead,
    heroLocation: copy.heroLocation,
    heroDates: copy.heroDates,
    heroCupos: copy.heroCupos,
    manifestoHeading: copy.manifestoHeading,
    manifestoBody: copy.manifestoBody,
    forYouHeading: copy.forYouHeading,
    forYouItems: copy.forYouItems,
    journeyHeading: copy.journeyHeading,
    journeyBody: copy.journeyBody,
    scheduleHeading: copy.scheduleHeading,
    scheduleDays: copy.scheduleDays,
    includesHeading: copy.includesHeading,
    includesItems: copy.includesItems,
    notIncluded: copy.notIncluded,
    hostsHeading: copy.hostsHeading,
    hosts: hosts.map((host, i) => ({ ...host, role: copy.hostRoles[i] ?? '' })),
    spaceHeading: copy.spaceHeading,
    spaceBody: copy.spaceBody,
    galleryImages: galleryImages.map((image, i) => ({ ...image, alt: copy.galleryAlts[i] ?? '' })),
    testimonials: testimonials.map((person, i) => ({
      ...person,
      quote: copy.testimonials[i]?.quote ?? '',
      location: copy.testimonials[i]?.location ?? '',
    })),
    pricing: {
      ...(pricing.earlyBird ? { earlyBird: { ...pricing.earlyBird, savingsLabel: copy.pricing.savingsLabel } } : {}),
      regular: pricing.regular,
      paymentMethods: copy.pricing.paymentMethods,
      paymentTerms: copy.pricing.paymentTerms,
    },
    finalCTAHeading: copy.finalCTAHeading,
    finalCTAPrimaryLabel: copy.finalCTAPrimaryLabel,
    finalCTASecondaryLabel: copy.finalCTASecondaryLabel,
  };
}

/** A retreat in one language, or `undefined` for a slug nobody has. */
export function getRetreatBySlug(slug: string, locale: AppLocale = 'en'): Retreat | undefined {
  const record = RECORDS.find((r) => r.slug === slug);
  return record ? toRetreat(record, locale) : undefined;
}

export function listRetreatSlugs(): string[] {
  return RECORDS.map((r) => r.slug);
}
