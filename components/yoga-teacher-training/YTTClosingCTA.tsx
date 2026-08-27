'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { YTT_DICTIONARIES } from '@/lib/i18n-ytt';
import { whatsappUrl } from '@/lib/whatsapp-ytt';

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

const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.4),0_2px_18px_rgba(0,0,0,0.3)]';

// The closing band, between the outcomes and the FAQ.
export function YTTClosingCTA() {
  const { lang } = useLanguage();
  const t = YTT_DICTIONARIES[lang];
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white">
      <div className="w-full">
        {/* From md the band takes the photograph's own proportions rather than a
            viewport height, so the frame is shown as it was composed — a fixed
            vh would have cropped the raised arm off the top or the hands off the
            bottom, whichever way the crop fell. The cap only bites on unusually
            wide, short windows. The explicit w-full is load-bearing: without a
            width to work from, `aspect-ratio` reads the min-height instead and
            derives a width from it, which on a tablet blew the band out to
            924px inside a 768px viewport — clipped by main's overflow rather
            than scrolling, so it showed up only as a photograph mysteriously cut
            off on the right.

            Below md the height follows the copy, over a modest floor. The floor
            sits at 60vh rather than higher on purpose: every pixel of band
            beyond what the words need is a pixel the portrait crop pays for
            sideways. At 70vh the frame lost 15% of its width; matched to the
            copy it loses 2%, and the raised hand and the back foot both stay in
            shot.

            The photograph is the same shore and the same sunset as the hero
            film — the page closes where it opened. */}
        <div
          data-surface="dark"
          className="
            relative w-full overflow-hidden bg-dark flex items-center
            min-h-[60vh]
            md:min-h-[480px] md:aspect-[1920/1081] md:max-h-[92vh]
          "
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={IMAGE_MOBILE} />
            <img
              src={IMAGE_DESKTOP}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
          </picture>

          <div aria-hidden className="absolute inset-0" style={{ backgroundColor: SCRIM }} />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className={`relative w-[85%] max-w-3xl mx-auto text-center py-16 md:py-20 ${TEXT_SHADOW}`}
          >
            <h2 className="font-display font-light text-cream text-3xl md:text-5xl leading-[1.15] text-balance">
              {t.closing.heading}
            </h2>
            <p className="font-body text-sm md:text-base text-cream/85 leading-[1.8] mt-6 max-w-2xl mx-auto">
              {t.closing.body}
            </p>
            <a
              href={whatsappUrl(t.whatsapp.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300 mt-10 [text-shadow:none]"
            >
              {t.closing.cta}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
