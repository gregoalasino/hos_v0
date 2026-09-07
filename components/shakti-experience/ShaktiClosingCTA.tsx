'use client';

import { ClosingBand } from '@/components/shared/ClosingBand';
import { useLanguage } from '@/contexts/language-context';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';
import { whatsappUrl } from '@/lib/whatsapp-shakti';

const IMAGE = '/images/shakti-experience/pre-footer.webp';

// Flat, like the testimonial's and for the same reason: the copy sits in the
// middle of the frame, and a gradient would run light under one line and heavy
// under the next. Measured per tile under the copy's own box at each
// breakpoint: the frame is a woman on a hammock at midday, and the cushions
// and the sunlit skin the paragraph crosses are bright. At the training's
// 0.50 the paragraph sits at 4.1:1 on a desktop and 3.4:1 on a phone; 0.60 is
// the first step that clears 4.5:1 on every cut (4.9:1 on a phone, 5.8:1 at
// 1440) with the photograph still legible. Re-measure if it is swapped.
const SCRIM = 'rgba(0,0,0,0.60)';

// The page's last word before the questions, in the training landing's own
// closing band.
export function ShaktiClosingCTA() {
  const { lang } = useLanguage();
  const t = SHAKTI_DICTIONARIES[lang];
  return (
    <ClosingBand
      image={IMAGE}
      aspect="md:aspect-[1920/1083]"
      scrim={SCRIM}
      heading={t.closing.heading}
      body={t.closing.body}
      cta={{ label: t.closing.cta, href: whatsappUrl(t.whatsapp.message) }}
    />
  );
}
