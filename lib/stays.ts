// ─── The dwellings ───────────────────────────────────────────────────────────
// The four places to sleep at House of Shakti, in the order Nancy presents
// them. /stay-with-us shows all four with the Cloudbeds door beside each;
// /host-your-retreat shows the three a group takes over, as a shop window
// with no door at all. One record per dwelling, here, so the two pages can
// never drift apart on a bed count or a capacity line.

export type StaySlug = 'main-house' | 'la-casita' | 'jungle-bungalow' | 'shakti-house';

export type StayData = {
  /** Fact line: capacity · layout. Rendered under the title, never above it. */
  meta: string;
  title: string;
  /** Card copy — short, one breath. */
  short: string;
  /** The full story, one string per paragraph. */
  long: string[];
  /** Optional bullet list (bed configurations). Rendered after `long`. */
  facts?: { label: string; items: string[] };
  /** Optional closing capacity line. */
  capacity?: string;
  images: string[];
};

export type Stay = StayData & { slug: StaySlug };

// The photographs are 3:4 portraits, shot and cropped for the cards, named
// after the dwelling's folder: /images/stay-with-us/<slug>/<slug>-<n>.webp.
const shots = (dir: StaySlug, n: number) =>
  Array.from({ length: n }, (_, i) => `/images/stay-with-us/${dir}/${dir}-${i + 1}.webp`);

export const STAYS: Stay[] = [
  {
    slug: 'main-house',
    meta: 'Up to 10 guests · Four suites, each with a private bathroom',
    title: 'Main House Suite',
    short:
      'Four spacious suites gathered around a shared heart, each with its own private bathroom — an elegant, serene base in a refined natural setting.',
    long: [
      'The Main House offers an elegant and serene experience, thoughtfully designed to provide both comfort and privacy within a refined natural setting. It features four spacious suites, each with its own private bathroom.',
      'Fully equipped with air conditioning in every suite and high-speed Wi-Fi throughout, the Main House blends modern comfort with a peaceful atmosphere — the right environment for rest and connection.',
    ],
    facts: {
      label: 'Room configurations may include',
      items: [
        'Triple rooms — 3 single beds',
        'Double rooms — 2 single beds',
        'Private rooms for single occupancy or couples — 1 queen-size bed each',
      ],
    },
    images: shots('main-house', 6),
  },
  {
    slug: 'la-casita',
    meta: 'Up to 3 guests · One bedroom, kitchen and terrace',
    title: 'La Casita',
    short:
      'A one-bedroom home nestled in the tropical greenery — queen bed, full kitchen, and a terrace that opens onto the jungle. Built for slow mornings and unhurried work.',
    long: [
      'A charming and intimate home nestled within lush tropical greenery, offering a peaceful and private escape immersed in nature. Thoughtfully designed for comfort and simplicity, it provides a warm, home-like atmosphere ideal for rest, creativity, and slow living.',
      'The space features one bedroom with a queen-size bed, equipped with air conditioning and ceiling fans for year-round comfort. An additional single bed can be arranged in the living area, allowing for flexible accommodation.',
      'La Casita includes a fully equipped kitchen, a cozy living and workspace, and a beautiful terrace overlooking the jungle — perfect for slow mornings, quiet reflection, or inspired moments of work and creativity.',
    ],
    capacity:
      'Capacity: up to 2 guests without bed sharing, or up to 3 guests with shared accommodation.',
    images: shots('la-casita', 8),
  },
  {
    slug: 'jungle-bungalow',
    meta: 'Up to 2 guests · One bedroom, private bathroom',
    title: 'Jungle Bungalow',
    short:
      'A single room in the heart of the jungle. Queen bed, private bathroom, and a ceiling fan turning through naturally cool air — secluded, simple, and quiet.',
    long: [
      'An intimate and secluded bungalow nestled in the heart of the jungle, offering a simple yet deeply grounding experience surrounded by nature.',
      'The bungalow features a queen-size bed, a ceiling fan for gentle natural airflow, and a private bathroom — a comfortable space that keeps a close connection with the surrounding landscape.',
    ],
    capacity:
      'Capacity: 1 guest without bed sharing, or up to 2 guests sharing a queen-size bed.',
    images: shots('jungle-bungalow', 8),
  },
  {
    slug: 'shakti-house',
    meta: 'Up to 4 guests · Two bedrooms, two bathrooms',
    title: 'Shakti House',
    short:
      'Two queen bedrooms, two full bathrooms, and a kitchen that makes it a real home. The expansive deck opens onto jungle and ocean views at once.',
    long: [
      'A beautifully designed private home that blends comfort, spaciousness, and breathtaking natural surroundings. Perfect for guests seeking a more independent stay while remaining fully connected to the retreat experience.',
      'The house features two peaceful bedrooms with queen-size beds, each equipped with air conditioning and ceiling fans. Two full bathrooms provide additional comfort and privacy.',
      'A fully equipped kitchen and welcoming living area create a true sense of home, while the expansive deck opens to stunning jungle and ocean views — an ideal setting for relaxation, connection, or simply enjoying the beauty of the landscape.',
    ],
    capacity:
      'Capacity: up to 2 guests without bed sharing, or up to 4 guests with shared accommodation.',
    images: shots('shakti-house', 10),
  },
];

/** The dwellings named, in the order named — for a page that shows a subset. */
export function pickStays(slugs: StaySlug[]): Stay[] {
  return slugs.map((slug) => {
    const stay = STAYS.find((s) => s.slug === slug);
    if (!stay) throw new Error(`Unknown stay: ${slug}`);
    return stay;
  });
}
