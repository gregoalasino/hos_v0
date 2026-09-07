'use client';

import { ClosingBand } from '@/components/shared/ClosingBand';
import { useLanguage } from '@/contexts/language-context';
import { YTT_DICTIONARIES } from '@/lib/i18n-ytt';
import { whatsappUrl } from '@/lib/whatsapp';

const IMAGE_DESKTOP = '/images/pre-footer/pre-footer-desktop.webp';
const IMAGE_MOBILE = '/images/pre-footer/pre-footer-mobile.webp';

// Flat, like the testimonial's and for the same reason: the copy sits in the
// middle of the frame, and a gradient would run light under one line and heavy
// under the next.
//
// Measured per tile rather than as an average, which matters here more than
// anywhere: the frame averages a very dark 0.25 — it is a silhouette at dusk —
// but the sky beside the sun reaches 0.57, and the copy crosses it. That patch
// clears 4.5:1 against cream at 0.46 by three hundredths, which is no margin at
// all. At 0.50 both crops sit near 5:1 and the sunset is still a sunset.
const SCRIM = 'rgba(0,0,0,0.50)';

// The closing band, between the outcomes and the FAQ. The photograph is the
// same shore and the same sunset as the hero film — the page closes where it
// opened. The band itself is the shared ClosingBand.
export function YTTClosingCTA() {
  const { lang } = useLanguage();
  const t = YTT_DICTIONARIES[lang];
  return (
    <ClosingBand
      image={IMAGE_DESKTOP}
      imageMobile={IMAGE_MOBILE}
      aspect="md:aspect-[1920/1081]"
      scrim={SCRIM}
      heading={t.closing.heading}
      body={t.closing.body}
      cta={{ label: t.closing.cta, href: whatsappUrl(t.whatsapp.message) }}
    />
  );
}
