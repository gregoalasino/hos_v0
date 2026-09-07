// ─── Retreat detail-page schema ───────────────────────────────────────────────
// One object per active retreat. Adding a new retreat is meant to be a single
// append to the RETREATS array — every section of /retreats/[slug] reads its
// content from here.

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

export type Retreat = {
  slug: string;

  // Machine-readable dates, for the Event structured data on the detail page.
  // TODO_CONFIRM: the retreat's dates exist today only as display copy
  // (`heroEyebrow`, e.g. "July 18 – 24 · 2026"). Parsing that back into a
  // timestamp would be guessing at the one field schema.org marks required on
  // an Event, so `lib/schema.ts` emits no Event until these are filled in.
  // Format: ISO 8601, e.g. '2026-07-18' and '2026-07-24'.
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

// ─── Shakti Sadhana — real data (provided by Nancy) ───────────────────────────
// Copy below comes from Nancy's source material. Photography and Nancy's
// portrait + Instagram handle are still pending — flagged with TODO so the
// swap is a one-line change when assets land.
const SHAKTI_SADHANA: Retreat = {
  slug: 'shakti-sadhana',

  // Hero
  heroImage: '/images/yoga/IMG_8420%201.webp', // TODO: retreat-specific cover photo
  heroEyebrow: 'July 18 – 24 · 2026',
  heroTitle: 'Shakti Sadhana',
  heroSubhead: 'An invitation to return to the source of your vital energy.',
  heroLocation: 'Santa Teresa, Costa Rica',
  heroDates: '7 days · 6 nights',
  heroCupos: 'Intimate group',

  // Manifesto
  manifestoHeading: 'Return to what is essential.',
  manifestoBody:
    'A space of pause, listening, and conscious practice — where we cultivate a relationship with the body as sacred territory and with Shakti as the creative, intuitive, transformative life force. Throughout the retreat we immerse ourselves in sadhana as a living path: yoga, breathwork, meditation, ritual, free movement, and moments of silence — all held by nature and the collective field. A time to soften, shed layers, reconnect with intuition, and remember the gentle, authentic power that lives within you.',

  // ForYou
  forYouHeading: 'This retreat is for you if...',
  forYouItems: [
    'You feel the call to soften and shed layers.',
    'You want to reconnect with your intuition and the wisdom of the body.',
    'You are curious about Shakti as a living, creative force.',
    'You are ready to be held by nature and a small collective field.',
    'You arrive seeking practice, ritual, and a real return.',
  ],
  forYouImage: '/images/yoga/IMG_5608%201.webp', // TODO: retreat-specific photo

  // Journey (video moment)
  journeyHeading: 'This is how it feels.',
  journeyBody:
    'Mornings open with practice on the open-air shala. Afternoons soften into breathwork, ritual, or workshops. Evenings gather around food and dim light. Each practice is designed to awaken sensitivity, presence, and inner connection — while honoring personal rhythms and the innate wisdom of the body.',
  videoPoster: '/images/sanctuary/271A0676_websize%201.webp', // TODO: retreat-specific poster frame
  // TODO: replace with House of Shakti's own video. Currently using Trama Viva's
  // "Within" video as a temporary placeholder so the moment can be imagined.
  videoDesktop: 'https://www.trama-viva.com/videos/within-video-desktop.mp4',

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

  // Hosts — Nancy only
  hostsHeading: 'Held by.',
  hosts: [
    {
      image: '/images/yoga/IMG_8693%201.webp', // TODO: Nancy's portrait
      name: 'Nancy Goodfellow',
      handle: '', // TODO: confirm Instagram handle
      role:
        'Yoga teacher, facilitator, and space holder. Nancy’s work weaves together yoga, breath, meditation, and somatic exploration — creating experiences that invite a deep return to the body as a source of wisdom and truth. Rooted in sensitivity, conscious practice, and the belief that true transformation unfolds through listening, safety, and embodied presence.',
    },
  ],

  // Space — lightly edited from Nancy's source material
  spaceHeading: 'A sanctuary nestled in nature.',
  spaceBody:
    'House of Shakti is a tranquil sanctuary perched on a serene hilltop, with complete privacy and breathtaking jungle views. Five minutes from Playa Hermosa, Santa Teresa — one of Costa Rica’s most beautiful beaches and renowned surf spots. The property offers a main house, a jungle house, and La Casita — a one-bedroom bungalow with full kitchen and jungle-view deck.',
  spaceImages: [
    '/images/sanctuary/271A0822_websize%201.webp',
    '/images/sanctuary/271A0759_websize%201.webp',
    '/images/sanctuary/271A0851_websize%201.webp',
    '/images/sanctuary/271A0790_websize%201.webp',
    '/images/sanctuary/271A0828_websize%201.webp',
    '/images/sanctuary/271A0856_websize%201.webp',
  ],

  // Gallery
  galleryImages: [
    { src: '/images/sanctuary/271A0719_websize%201.webp', aspect: 'aspect-[3/4]', alt: 'A quiet sanctuary corner' },
    { src: '/images/yoga/IMG_5615%201.webp',              aspect: 'aspect-square', alt: 'Practice at sunset' },
    { src: '/images/sanctuary/271A0856_websize%201.webp', aspect: 'aspect-[3/4]', alt: 'Garden space' },
    { src: '/images/yoga/IMG_8693%201.webp',              aspect: 'aspect-[4/5]', alt: 'Group practice' },
    { src: '/images/contrast_therapy/IMG_7067%201.webp',  aspect: 'aspect-square', alt: 'Cold plunge ritual' },
    { src: '/images/sanctuary/271A0698_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'Open-air shala' },
    { src: '/images/yoga/IMG_7491%201.webp',              aspect: 'aspect-[3/4]', alt: 'Sunrise practice' },
    { src: '/images/sanctuary/271A0883_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'The jungle at golden hour' },
  ],

  // Testimonials — placeholder until Nancy provides real ones
  // TODO: replace with real guest testimonials + real portraits
  testimonials: [
    {
      quote:
        'I arrived tired and left changed. Not because of any one thing, but because of the way everything was held — the food, the space, the silence.',
      author: 'Maya Lindstrom',
      location: 'New York, USA',
      image: '/images/yoga/IMG_7538%201.webp',
    },
    {
      quote:
        'It is the rare place that lives up to its own quiet. I have started planning my year around returning.',
      author: 'Sofía Morales',
      location: 'Mexico City, Mexico',
      image: '/images/yoga/IMG_7539%201.webp',
    },
    {
      quote:
        'I came hoping to learn something new. I left having remembered what I already knew.',
      author: 'Camille Boucher',
      location: 'Paris, France',
      image: '/images/yoga/IMG_8683%201.webp',
    },
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
      savingsLabel: 'Save $211 when booking early',
    },
    regular: { amount: 1625 },
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

  // Final CTA
  finalCTAHeading: 'There are only a few places.',
  finalCTAPrimaryLabel: 'Reserve your place',
  finalCTAPrimaryHref: '/contact?retreat=shakti-sadhana',
  finalCTASecondaryLabel: 'Ask a question on WhatsApp',
  finalCTASecondaryHref: WHATSAPP_URL_PLAIN,
};

export const RETREATS: Retreat[] = [SHAKTI_SADHANA];

export function getRetreatBySlug(slug: string): Retreat | undefined {
  return RETREATS.find((r) => r.slug === slug);
}

export function listRetreatSlugs(): string[] {
  return RETREATS.map((r) => r.slug);
}
