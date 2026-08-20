'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';

const STORAGE_KEY = 'hos_lang';

// English is the ground state. Every page of the public site is written in
// English, House of Shakti's guests arrive from abroad, and the YTT landing
// opens in English too — so a visitor who has never touched the toggle should
// see the language the copy is actually in. Spanish is the deliberate switch.
const DEFAULT_LANG: Lang = 'en';

interface LanguageContextValue {
  lang: Lang;
  /** Select a language directly — what the navbar's EN | ES pair calls. */
  setLang: (next: Lang) => void;
  /** Flip to the other language. Kept for callers that only offer one control. */
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always starts from the default so the server and the first client render
  // agree; the stored preference is applied just after mount, below. Reading
  // localStorage during the initial render instead would produce markup the
  // server could never have produced, and React would throw out the tree.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') setLangState(saved);
    } catch {
      // Private mode / storage disabled — the default stands.
    }
  }, []);

  // Keep the document in sync so screen readers switch voice and pronunciation
  // with the copy, and so the page reports its real language to crawlers. The
  // <html lang> in app/layout.tsx is the static, pre-hydration value; this is
  // what tracks the toggle afterwards.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference just won't survive the session.
    }
  }

  function toggleLang() {
    setLang(lang === 'es' ? 'en' : 'es');
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
