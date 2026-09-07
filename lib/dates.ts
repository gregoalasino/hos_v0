import { enUS, es } from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';
import type { AppLocale } from '@/i18n/routing';

// date-fns speaks each language through its own locale object. One mapping,
// here, so a component asks for `dateFnsLocale(locale)` and never chooses.
const DATE_FNS_LOCALES: Record<AppLocale, DateFnsLocale> = { en: enUS, es };

export function dateFnsLocale(locale: AppLocale): DateFnsLocale {
  return DATE_FNS_LOCALES[locale];
}

/** BCP 47 tag for `Intl` APIs — month names, list formatting. */
export function intlTag(locale: AppLocale): string {
  return locale === 'es' ? 'es' : 'en-US';
}
