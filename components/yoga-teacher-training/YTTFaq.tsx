'use client';

import { FaqSection } from '@/components/shared/FaqSection';
import { useMessages } from 'next-intl';

// The questions and answers live in the dictionary, in both languages; the
// accordion itself is the shared FaqSection.
export function YTTFaq() {
  const t = useMessages().ytt.faq;
  return <FaqSection heading={t.heading} items={t.items} />;
}
