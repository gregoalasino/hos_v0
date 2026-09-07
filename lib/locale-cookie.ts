import type { AppLocale } from '@/i18n/routing';

// The reader's chosen language, remembered in a cookie — a convenience for the
// client only. The server never reads it and never redirects on it: routing is
// decided by the URL alone (see i18n/routing.ts), so the cookie can't send a
// crawler, or a reader who typed a URL, anywhere they didn't ask to go.
const NAME = 'NEXT_LOCALE';
const MAX_AGE = 60 * 60 * 24 * 365;

export function rememberLocale(locale: AppLocale): void {
  try {
    document.cookie = `${NAME}=${locale}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  } catch {
    // Cookies disabled — the URL still carries the choice.
  }
}
