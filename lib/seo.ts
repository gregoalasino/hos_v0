// ─── Metadata builder ────────────────────────────────────────────────────────
// One helper behind every page's `metadata`, so canonicals, Open Graph and
// language alternates can never drift page by page.
//
// ── Built for the Spanish phase that follows ─────────────────────────────────
// The site is English-only today, but the next phase adds routes under `/es`.
// Everything that will differ between the two lives in this file and nowhere
// else, so that phase is an edit here rather than a rewrite of twelve pages:
//
//   1. Add `'es'` to `ACTIVE_LOCALES`. Every page's `alternates.languages`
//      grows an `es-CR` entry and the sitemap picks it up, automatically.
//   2. Pass `locale: 'es'` from the Spanish pages. The helper already threads
//      it through `openGraph.locale`, the canonical and the alternates.
//
// No page component needs to know how a locale becomes a URL — `localizedPath`
// is the only place that decides.

import type { Metadata } from 'next';
import { BUSINESS, absoluteUrl } from '@/lib/business';

export type Locale = 'en' | 'es';

/**
 * Locales currently published. English only for now; adding `'es'` here is
 * what turns the alternates and the sitemap bilingual.
 */
export const ACTIVE_LOCALES: readonly Locale[] = ['en'] as const;

export const DEFAULT_LOCALE: Locale = 'en';

/** Open Graph and hreflang codes, per locale. */
const LOCALE_META: Record<Locale, { og: string; hreflang: string }> = {
  en: { og: 'en_US', hreflang: 'en' },
  // Costa Rican Spanish — the audience is here, and `es-CR` is a valid
  // hreflang that still matches generic `es` queries.
  es: { og: 'es_CR', hreflang: 'es-CR' },
};

/**
 * Where a given page lives for a given locale.
 *
 * English keeps the bare path (no `/en` prefix — it is the default and a
 * prefix would force a redirect on every existing inbound link). Spanish will
 * live under `/es`. This is the single place that mapping is expressed.
 */
export function localizedPath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  return locale === 'en' ? clean || '/' : `/es${clean}`;
}

/** Absolute canonical for a page in a locale. */
export function canonicalUrl(path: string, locale: Locale = DEFAULT_LOCALE): string {
  return absoluteUrl(localizedPath(path, locale));
}

/**
 * The `alternates.languages` map: one entry per published locale plus
 * `x-default`, which points at English as the version to serve when no
 * language matches.
 */
function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of ACTIVE_LOCALES) {
    languages[LOCALE_META[locale].hreflang] = canonicalUrl(path, locale);
  }
  languages['x-default'] = canonicalUrl(path, DEFAULT_LOCALE);
  return languages;
}

export type PageImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

/** The site-wide social card. 1200×630, tracked in git. */
export const DEFAULT_OG_IMAGE: PageImage = {
  url: '/og-image.jpg',
  alt: 'House of Shakti — a yoga sanctuary in the jungle above Playa Hermosa, Santa Teresa, Costa Rica',
  width: 1200,
  height: 630,
};

export type BuildMetadataInput = {
  /** Site-relative path, English form, e.g. `/stay-with-us`. */
  path: string;
  /** Page title, without the site suffix — the template in the root layout adds it. */
  title: string;
  /** Under 160 characters. */
  description: string;
  /** Defaults to the site card. */
  image?: PageImage;
  locale?: Locale;
  /**
   * Bypass the root layout's `%s | House of Shakti` template. Used by the home
   * page, whose title already names the business — templated it would read
   * "House of Shakti — … | House of Shakti".
   */
  absoluteTitle?: boolean;
};

export function buildMetadata({
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  locale = DEFAULT_LOCALE,
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const canonical = canonicalUrl(path, locale);

  // The root layout's `%s | House of Shakti` template applies to <title> only.
  // Open Graph and Twitter take whatever string they are given, so a page
  // titled "About" would share as a card reading "About" and nothing else.
  // Both get the title as it will actually render.
  const socialTitle = absoluteTitle ? title : `${title} | ${BUSINESS.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      siteName: BUSINESS.name,
      locale: LOCALE_META[locale].og,
      url: canonical,
      title: socialTitle,
      description,
      images: [
        {
          url: absoluteUrl(image.url),
          alt: image.alt,
          ...(image.width ? { width: image.width } : {}),
          ...(image.height ? { height: image.height } : {}),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [absoluteUrl(image.url)],
    },
  };
}
