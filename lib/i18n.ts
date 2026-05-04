export type Lang = 'es' | 'en';

/**
 * Inline bilingual helper.
 * Usage: tr(lang, 'texto en español', 'English text')
 */
export function tr(lang: Lang, es: string, en: string): string {
  return lang === 'es' ? es : en;
}
