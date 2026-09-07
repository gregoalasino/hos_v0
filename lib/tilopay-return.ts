import { hasLocale } from 'next-intl';
import { routing, type AppLocale } from '@/i18n/routing';

// ─── Where Tilopay sends the customer back ───────────────────────────────────
// The hosted payment page returns to one URL, our callback, with the result in
// the query string. The callback then redirects the customer to the receipt —
// and the receipt must be in the language they paid in, which Tilopay knows
// nothing about. So the language rides the return URL itself, as `locale`:
// Tilopay appends its own parameters to whatever URL it was given (its
// WooCommerce plugin returns to `?wc-api=…` the same way), and the callback
// reads ours back out. Nothing is stored for this.

const PARAM = 'locale';

export function tilopayReturnUrl(locale: AppLocale): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const url = new URL('/api/tilopay/callback', siteUrl);
  // English is the default and needs no marker — the URL stays exactly what
  // it was before the site had a second language.
  if (locale !== routing.defaultLocale) url.searchParams.set(PARAM, locale);
  return url.toString();
}

/** The locale a callback request carries, or the default when it carries none. */
export function localeFromCallback(searchParams: URLSearchParams): AppLocale {
  const value = searchParams.get(PARAM);
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
