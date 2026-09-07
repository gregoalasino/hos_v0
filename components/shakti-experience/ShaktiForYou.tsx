'use client';

import { WhoForSection } from '@/components/shared/WhoForSection';
import { useLanguage } from '@/contexts/language-context';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';

// Who the experience is for — the training landing's own section, with the
// owners' five sentences split at their hinge.
export function ShaktiForYou() {
  const { lang } = useLanguage();
  const t = SHAKTI_DICTIONARIES[lang].whoFor;
  return <WhoForSection heading={t.heading} audience={t.audience} closing={t.closing} />;
}
