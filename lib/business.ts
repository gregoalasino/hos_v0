// ─── House of Shakti — the business, in one place ────────────────────────────
// Every part of the site that states a fact about the business reads it from
// here: the footer, the contact page, the calendar invitations, the outgoing
// email, the sitemap, and — most consequentially — the structured data we
// hand to search engines.
//
// Before this existed the address was typed out three times by hand and the
// email domain disagreed with itself (`houseofshaktiyoga.com` on the contact
// page, `houseofshakti.com` in the ICS builder). Structured data makes that
// kind of drift expensive: a search engine that reads two different addresses
// for one business trusts neither.
//
// ── On TODO_CONFIRM ──────────────────────────────────────────────────────────
// Several values below have never been confirmed by the owners — they were
// placeholders in the components this file replaces, and inventing them would
// be worse than leaving them out. They are marked `TODO_CONFIRM` and, where a
// value is missing entirely, typed as `null` so that:
//
//   · `lib/schema.ts` omits the corresponding JSON-LD field rather than
//     emitting a guess, and
//   · TypeScript forces every consumer to handle the absence.
//
// A wrong street address or fabricated coordinates in structured data are far
// worse than an incomplete schema: they send real people to the wrong place.

import { WHATSAPP_NUMBER, WHATSAPP_URL_PLAIN } from '@/lib/whatsapp';

/** Geographic coordinates, once someone reads them off the actual property. */
export type Geo = { latitude: number; longitude: number };

export const BUSINESS = Object.freeze({
  name: 'House of Shakti',

  // TODO_CONFIRM: the registered legal entity, if it differs from the trading
  // name. Omitted from JSON-LD while null.
  legalName: null as string | null,

  /** Canonical production origin. No trailing slash, no `www`. */
  url: 'https://houseofshaktiyoga.com',

  description:
    'House of Shakti is a yoga sanctuary and boutique retreat house in Santa Teresa, Costa Rica, offering daily yoga classes, retreats, teacher trainings and jungle accommodation five minutes from Playa Hermosa.',

  address: Object.freeze({
    // TODO_CONFIRM: the street address. Santa Teresa addresses are commonly
    // given as landmarks rather than numbered streets, so this may end up as a
    // description ("300m north of …") rather than a street name.
    street: null as string | null,
    locality: 'Santa Teresa',
    region: 'Puntarenas',
    // TODO_CONFIRM: postal code.
    postalCode: null as string | null,
    /** ISO 3166-1 alpha-2. */
    country: 'CR',
    countryName: 'Costa Rica',
  }),

  // The single line the site has always shown, kept verbatim so the footer and
  // the contact page render exactly as before.
  addressLines: Object.freeze(['House of Shakti', 'Santa Teresa', 'Puntarenas, Costa Rica']),

  /** Derived from lib/whatsapp.ts — the one number the whole site dials. */
  phone: `+${WHATSAPP_NUMBER}`,
  phoneDisplay: '+506 8560 5115',
  whatsappUrl: WHATSAPP_URL_PLAIN,

  email: Object.freeze({
    // TODO_CONFIRM: all three were placeholders awaiting Nancy's word. They are
    // shown on the contact page today, so they stay — but they are not fed to
    // JSON-LD until confirmed.
    reservations: 'hello@houseofshaktiyoga.com',
    retreats: 'retreats@houseofshaktiyoga.com',
    press: 'press@houseofshaktiyoga.com',
    confirmed: false,
  }),

  instagram: 'https://www.instagram.com/house.of.shakti/',
  instagramHandle: '@house.of.shakti',

  // TODO_CONFIRM: a Google Maps *place* link. What the site has today is a
  // search query, which is fine for a human but is not a stable identifier and
  // must not go into `sameAs`.
  mapsUrl: 'https://maps.google.com/?q=House+of+Shakti+Santa+Teresa+Costa+Rica',
  mapsPlaceUrl: null as string | null,

  // TODO_CONFIRM: no coordinates exist anywhere in the repo. Until someone
  // reads them off the property, `geo` stays null and is omitted from the
  // LodgingBusiness schema entirely.
  geo: null as Geo | null,

  /** Price band for LodgingBusiness. Derived from the published retreat rates. */
  priceRange: '$$',

  /** What the house actually has. Feeds `amenityFeature`. */
  amenities: Object.freeze([
    'Yoga shala',
    'Ice bath',
    'Sauna',
    'Saltwater pool',
    'Jungle setting',
    'High-speed Wi-Fi',
    'Air conditioning',
  ]),

  /** Profiles we can prove are ours. Only add links that resolve. */
  sameAs: Object.freeze(['https://www.instagram.com/house.of.shakti/']),
});

/** Absolute URL for a site-relative path. Used by metadata, sitemap and schema. */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${BUSINESS.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/** The canonical mail host, for anything that has to build an address. */
export const EMAIL_DOMAIN = 'houseofshaktiyoga.com';
