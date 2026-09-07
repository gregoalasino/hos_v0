'use client';

import { FaqSection } from '@/components/shared/FaqSection';
import { useLanguage } from '@/contexts/language-context';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';

// The questions, in the training landing's accordion.
export function ShaktiFaq() {
  const { lang } = useLanguage();
  const t = SHAKTI_DICTIONARIES[lang].faq;
  return <FaqSection heading={t.heading} items={t.items} />;
}
