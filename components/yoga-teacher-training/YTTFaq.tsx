'use client';

import { FaqSection } from '@/components/shared/FaqSection';
import { useLanguage } from '@/contexts/language-context';
import { YTT_DICTIONARIES } from '@/lib/i18n-ytt';

// The questions and answers live in the dictionary, in both languages; the
// accordion itself is the shared FaqSection.
export function YTTFaq() {
  const { lang } = useLanguage();
  const t = YTT_DICTIONARIES[lang].faq;
  return <FaqSection heading={t.heading} items={t.items} />;
}
