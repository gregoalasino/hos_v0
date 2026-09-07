import { hasLocale } from 'next-intl';
import { defineRouting } from 'next-intl/routing';

// ─── Locale routing ──────────────────────────────────────────────────────────
// English is the site; Spanish lives under `/es`. Four decisions here, each
// deliberate:
//
//   localePrefix 'as-needed' — English keeps its bare URLs (`/yoga`, never
//     `/en/yoga`): every inbound link, canonical and Search Console record
//     points at them. A stray `/en/yoga` is redirected to `/yoga` by the proxy.
//   localeDetection false — nobody is redirected by Accept-Language or by a
//     cookie. A crawler fetching `/yoga` from a Spanish-speaking network must
//     get English, and a reader who typed `/es/yoga` must get Spanish, every
//     time. The URL is the only signal.
//   localeCookie false — next-intl never reads or writes NEXT_LOCALE. The
//     language toggle stores the choice itself, as a convenience for the
//     client; the server does nothing with it (see contexts/language-context).
//   alternateLinks false — the hreflang alternates are already emitted per
//     page by lib/seo.ts with absolute canonical URLs. The Link header next-intl
//     would add builds URLs from the request host, which on a preview
//     deployment is not the canonical host, so the header stays off and the
//     metadata remains the single source.
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: false,
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];

/**
 * The `params` prop every layout and page under app/[locale] receives. Next
 * types the segment as a plain string; `localeFromParams` narrows it.
 */
export type LocaleParams = { params: Promise<{ locale: string }> };

/**
 * The `[locale]` segment as one of ours. The proxy only ever routes one of
 * `routing.locales` into the segment, and the layout 404s anything else before
 * a page renders — so the fallback here is for the type, not for a reader.
 */
export async function localeFromParams(params: LocaleParams['params']): Promise<AppLocale> {
  const { locale } = await params;
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
