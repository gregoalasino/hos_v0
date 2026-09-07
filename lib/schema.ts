// ─── Structured data ─────────────────────────────────────────────────────────
// JSON-LD builders. Every fact comes from lib/business.ts, so the graph can
// never disagree with the page a person reads.
//
// Two rules hold throughout:
//
//   1. **Never guess.** A field whose value is a TODO_CONFIRM in business.ts is
//      omitted from the output entirely. Wrong coordinates or an invented
//      street send real people to the wrong place; an incomplete schema only
//      leaves a rich result slightly less rich.
//   2. **Never emit an invalid type.** Where schema.org marks a property as
//      required — `startDate` on an Event, `address` on a LodgingBusiness —
//      the builder returns `null` rather than a partial object, and the caller
//      renders nothing. A malformed Event is worse than no Event: Google
//      discards it and flags the page.

import { BUSINESS } from '@/lib/business';
import type { Retreat } from '@/lib/retreats';
import type { YogaClass } from '@/types';

export type JsonLd = Record<string, unknown>;

const BUSINESS_ID = `${BUSINESS.url}/#business`;
const WEBSITE_ID = `${BUSINESS.url}/#website`;

/** PostalAddress, with only the parts we actually know. */
function postalAddress(): JsonLd {
  return {
    '@type': 'PostalAddress',
    // Street and postal code are TODO_CONFIRM — omitted, not invented.
    ...(BUSINESS.address.street ? { streetAddress: BUSINESS.address.street } : {}),
    addressLocality: BUSINESS.address.locality,
    addressRegion: BUSINESS.address.region,
    ...(BUSINESS.address.postalCode ? { postalCode: BUSINESS.address.postalCode } : {}),
    addressCountry: BUSINESS.address.country,
  };
}

/** The place a class happens: the shala, at the house's address. */
function placeFor(locationName?: string): JsonLd {
  return {
    '@type': 'Place',
    name: locationName?.trim() ? `${BUSINESS.name} — ${locationName}` : BUSINESS.name,
    address: postalAddress(),
    ...(BUSINESS.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: BUSINESS.geo.latitude,
            longitude: BUSINESS.geo.longitude,
          },
        }
      : {}),
  };
}

/**
 * LodgingBusiness — the anchor of the whole graph. Everything else references
 * it by `@id`, so a search engine reads one business with several offerings
 * rather than several unrelated entities.
 */
export function lodgingBusinessSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': BUSINESS_ID,
    name: BUSINESS.name,
    ...(BUSINESS.legalName ? { legalName: BUSINESS.legalName } : {}),
    description: BUSINESS.description,
    url: BUSINESS.url,
    logo: `${BUSINESS.url}/favicon.png`,
    image: `${BUSINESS.url}/og-image.jpg`,
    telephone: BUSINESS.phone,
    // The three addresses on the contact page are still unconfirmed, so no
    // `email` here — see BUSINESS.email.confirmed.
    ...(BUSINESS.email.confirmed ? { email: BUSINESS.email.reservations } : {}),
    priceRange: BUSINESS.priceRange,
    address: postalAddress(),
    // Omitted deliberately: no coordinates exist anywhere in the repo, and a
    // fabricated pin is the single most damaging thing this file could emit.
    ...(BUSINESS.geo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: BUSINESS.geo.latitude,
            longitude: BUSINESS.geo.longitude,
          },
        }
      : {}),
    sameAs: [...BUSINESS.sameAs],
    amenityFeature: BUSINESS.amenities.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
  };
}

/** WebSite — lets the brand name resolve as a site rather than a stray page. */
export function webSiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: BUSINESS.url,
    name: BUSINESS.name,
    alternateName: 'House of Shakti Yoga Sanctuary',
    inLanguage: 'en',
    publisher: { '@id': BUSINESS_ID },
  };
}

/**
 * One Event per yoga class.
 *
 * This is the strongest signal the site can send for "yoga classes santa
 * teresa": a dated, priced, located, bookable occurrence, refreshed weekly
 * from the recurring templates. Past classes are dropped — an index full of
 * finished events is worse than none.
 */
export function yogaClassEventSchema(yogaClass: YogaClass): JsonLd | null {
  const start = yogaClass.startsAt;
  if (!(start instanceof Date) || Number.isNaN(start.getTime())) return null;
  if (!yogaClass.name) return null;

  const end = new Date(start.getTime() + yogaClass.durationMinutes * 60_000);

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: yogaClass.name,
    ...(yogaClass.description ? { description: yogaClass.description } : {}),
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: placeFor(yogaClass.location),
    organizer: {
      '@type': 'Organization',
      '@id': BUSINESS_ID,
      name: BUSINESS.name,
      url: BUSINESS.url,
    },
    ...(yogaClass.instructor
      ? { performer: { '@type': 'Person', name: yogaClass.instructor } }
      : {}),
    ...(yogaClass.capacity ? { maximumAttendeeCapacity: yogaClass.capacity } : {}),
    offers: {
      '@type': 'Offer',
      price: yogaClass.priceUsd.toFixed(2),
      priceCurrency: 'USD',
      availability:
        yogaClass.spotsRemaining > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/SoldOut',
      url: `${BUSINESS.url}/booking/${yogaClass.id}`,
      validFrom: new Date().toISOString(),
    },
  };
}

/** Only classes that haven't happened yet, as valid Events. */
export function yogaClassEventsSchema(classes: YogaClass[]): JsonLd[] {
  const now = Date.now();
  return classes
    .filter((c) => c.startsAt instanceof Date && c.startsAt.getTime() > now)
    .map(yogaClassEventSchema)
    .filter((s): s is JsonLd => s !== null);
}

/**
 * Event for a retreat.
 *
 * Returns `null` unless the retreat carries machine-readable `startDate` /
 * `endDate`. `lib/retreats.ts` currently expresses its dates only as display
 * copy ("July 18 – 24 · 2026"), and parsing that back into a timestamp would
 * be guessing at exactly the field schema.org marks required. Add the two ISO
 * fields to the retreat record and this starts emitting on its own.
 */
export function retreatEventSchema(retreat: Retreat): JsonLd | null {
  if (!retreat.startDate || !retreat.endDate) return null;

  const price = retreat.pricing?.regular?.amount;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: retreat.heroTitle,
    ...(retreat.heroSubhead ? { description: retreat.heroSubhead } : {}),
    startDate: retreat.startDate,
    endDate: retreat.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: placeFor(),
    organizer: {
      '@type': 'Organization',
      '@id': BUSINESS_ID,
      name: BUSINESS.name,
      url: BUSINESS.url,
    },
    ...(retreat.heroImage ? { image: `${BUSINESS.url}${retreat.heroImage}` } : {}),
    url: `${BUSINESS.url}/retreats/${retreat.slug}`,
    ...(typeof price === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            price: price.toFixed(2),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${BUSINESS.url}/retreats/${retreat.slug}`,
          },
        }
      : {}),
  };
}

/** BreadcrumbList for nested routes. */
export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${BUSINESS.url}${crumb.path}`,
    })),
  };
}

// FAQPage is deliberately absent. `components/accommodations/AccommodationsFAQ.tsx`
// says its answers are placeholder copy, and marking up placeholder content as
// a rich result is worse than not marking it up — it puts words in the
// business's mouth in Google's own interface. Add a `faqPageSchema` builder
// here the day the real answers land.
