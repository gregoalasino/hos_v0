'use client';

import { WhoForSection } from '@/components/shared/WhoForSection';
import { useMessages } from 'next-intl';

// The audience entries live in the dictionary, in both languages; the section
// itself is the shared WhoForSection.
export function YTTWhoFor() {
  const t = useMessages().ytt.whoFor;
  return (
    <WhoForSection heading={t.heading} intro={t.intro} audience={t.audience} closing={t.closing} />
  );
}
