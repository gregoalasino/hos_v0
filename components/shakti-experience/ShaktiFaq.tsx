'use client';

import { FaqSection } from '@/components/shared/FaqSection';
import { useMessages } from 'next-intl';

// The questions, in the training landing's accordion.
export function ShaktiFaq() {
  const t = useMessages().shaktiExperience.faq;
  return <FaqSection heading={t.heading} items={t.items} />;
}
