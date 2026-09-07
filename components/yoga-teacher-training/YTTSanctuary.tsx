'use client';

import { SanctuarySection } from '@/components/shared/SanctuarySection';
import { useLanguage } from '@/contexts/language-context';
import { YTT_DICTIONARIES } from '@/lib/i18n-ytt';

// House of Shakti Yoga Sanctuary — a place-setting block between the pricing
// and what the reader has been reading about all the way down the page. The
// section itself is the shared SanctuarySection.
export function YTTSanctuary() {
  const { lang } = useLanguage();
  const t = YTT_DICTIONARIES[lang].sanctuary;
  return <SanctuarySection heading={t.heading} body={t.body} trackAria={t.trackAria} />;
}
