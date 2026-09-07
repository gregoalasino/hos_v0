'use client';

import { SanctuarySection } from '@/components/shared/SanctuarySection';
import { useMessages } from 'next-intl';

// House of Shakti Yoga Sanctuary — a place-setting block between the pricing
// and what the reader has been reading about all the way down the page. The
// section itself is the shared SanctuarySection.
export function YTTSanctuary() {
  const t = useMessages().ytt.sanctuary;
  return <SanctuarySection heading={t.heading} body={t.body} trackAria={t.trackAria} />;
}
