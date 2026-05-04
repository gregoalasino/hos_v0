'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hos_lang') as Lang | null;
      if (saved === 'es' || saved === 'en') setLang(saved);
    } catch {
      // localStorage not available (SSR)
    }
  }, []);

  function toggleLang() {
    setLang(prev => {
      const next: Lang = prev === 'es' ? 'en' : 'es';
      try { localStorage.setItem('hos_lang', next); } catch {}
      return next;
    });
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
