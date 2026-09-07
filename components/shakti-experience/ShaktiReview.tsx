'use client';

import { QuoteBreak } from '@/components/landing/QuoteBreak';
import { useLanguage } from '@/contexts/language-context';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';

// ─── A guest's voice ─────────────────────────────────────────────────────────
// The full-height treatment built for the training landing: the photograph
// carries the section, the words sit centred in it. Scrim strength is
// measured against this photograph, per tile, under the quote's own box at
// each breakpoint — re-measure if it is swapped.
const IMAGE = '/images/shakti-experience/review.webp';

export function ShaktiReview() {
  const { lang } = useLanguage();
  const t = SHAKTI_DICTIONARIES[lang].testimonial;

  return (
    <QuoteBreak
      variant="testimonial"
      image={IMAGE}
      quote={t.quote}
      author={t.author}
      role={t.role}
      scrim={0.55}
    />
  );
}
