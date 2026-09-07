'use client';

import { WhoForSection } from '@/components/shared/WhoForSection';
import { useLanguage } from '@/contexts/language-context';
import { YTT_DICTIONARIES } from '@/lib/i18n-ytt';

// The audience entries live in the dictionary, in both languages; the section
// itself is the shared WhoForSection.
export function YTTWhoFor() {
  const { lang } = useLanguage();
  const t = YTT_DICTIONARIES[lang].whoFor;
  return (
    <WhoForSection heading={t.heading} intro={t.intro} audience={t.audience} closing={t.closing} />
  );
}
