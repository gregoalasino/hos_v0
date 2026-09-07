'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { getPathname, usePathname } from '@/i18n/navigation';
import type { Lang } from '@/lib/i18n';

// ─── useLanguage — compatibility shim over next-intl ─────────────────────────
// The language used to be a React context fed by localStorage: the same URL
// showed English or Spanish depending on a key in the visitor's browser, which
// no crawler could see and no link could share. It is now the URL. `/yoga` is
// English, `/es/yoga` is Spanish, and the locale reaches every component
// through next-intl's provider in app/[locale]/layout.tsx.
//
// This hook keeps the API its consumers already use — `lang`, `setLang`,
// `toggleLang` — while reading from that provider, so nothing else had to
// change for the site to become bilingual by URL. It is a shim: as each
// component moves to `useTranslations`, it stops needing this, and the file
// goes when the last one does.
//
//   lang       the `[locale]` segment of the current URL.
//   setLang    navigation to the same page in the other language — the path
//              and query string kept, only the prefix changing. The choice is
//              also written to a NEXT_LOCALE cookie as a convenience for the
//              client; the server never reads it and never redirects on it
//              (routing is decided by the URL alone, see i18n/routing.ts).
//   toggleLang flips to the other language. Kept for callers that only offer
//              one control.

const COOKIE_NAME = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface LanguageContextValue {
  lang: Lang;
  /** Select a language directly — what the navbar's EN | ES pair calls. */
  setLang: (next: Lang) => void;
  /** Flip to the other language. Kept for callers that only offer one control. */
  toggleLang: () => void;
}

export function useLanguage(): LanguageContextValue {
  const lang = useLocale();
  // Locale-less, so the same page can be named in the other language.
  const pathname = usePathname();
  const router = useRouter();

  function setLang(next: Lang) {
    if (next === lang) return;

    try {
      document.cookie = `${COOKIE_NAME}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    } catch {
      // Cookies disabled — the URL still carries the choice.
    }

    // Next's own router, not next-intl's: the latter would name the English
    // page `/en/yoga` when switching to it explicitly, and the proxy would
    // then redirect that to `/yoga` — one hop the reader never needs to make.
    // `getPathname` already knows that English carries no prefix.
    const target = getPathname({ href: pathname, locale: next });
    router.replace(`${target}${window.location.search}${window.location.hash}`, { scroll: false });
  }

  function toggleLang() {
    setLang(lang === 'es' ? 'en' : 'es');
  }

  return { lang, setLang, toggleLang };
}
