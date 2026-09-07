'use client';

import { SanctuarySection } from '@/components/shared/SanctuarySection';
import { useLanguage } from '@/contexts/language-context';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';

// The house, presented exactly as the training landing presents it — the
// same section, the same sixteen frames, the same words.
export function ShaktiPlace() {
  const { lang } = useLanguage();
  const t = SHAKTI_DICTIONARIES[lang].sanctuary;
  return <SanctuarySection heading={t.heading} body={t.body} trackAria={t.trackAria} />;
}
