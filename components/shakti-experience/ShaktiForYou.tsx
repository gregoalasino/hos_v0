'use client';

import { WhoForSection } from '@/components/shared/WhoForSection';
import { useMessages } from 'next-intl';

// Who the experience is for — the training landing's own section, with the
// owners' five sentences split at their hinge.
export function ShaktiForYou() {
  const t = useMessages().shaktiExperience.whoFor;
  return <WhoForSection heading={t.heading} audience={t.audience} closing={t.closing} />;
}
