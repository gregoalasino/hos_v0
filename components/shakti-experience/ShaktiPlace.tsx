'use client';

import { SanctuarySection } from '@/components/shared/SanctuarySection';
import { useMessages } from 'next-intl';

// The house, presented exactly as the training landing presents it — the
// same section, the same sixteen frames, the same words.
export function ShaktiPlace() {
  const t = useMessages().shaktiExperience.sanctuary;
  return <SanctuarySection heading={t.heading} body={t.body} trackAria={t.trackAria} />;
}
