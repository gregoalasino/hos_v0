'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

// ─── Closing band ────────────────────────────────────────────────────────────
// The page's last word before the footer: full-bleed, the photograph shown as
// it was composed, a single statement centred in it. No call to action — the
// ask sits one section up, and a second door here would only point back at
// it. Same construction as the training landing's closing band, less the
// button.
const IMAGE = '/images/host-your-retreat/pre-footer.webp';

// Flat, like the testimonial's and for the same reason: the copy sits in the
// middle of the frame, and a gradient would run light under one line and heavy
// under the next. Measured per tile under the copy's own box at each
// breakpoint: the brightest patch the words cross is the light top of the
// woman at the centre of the toast, and at 0.50 the paragraph clears 4.5:1
// on a phone (4.9:1) with more to spare as the frame widens (6.5:1 at
// 1440). The heading, larger, sits between 6:1 and 8:1 everywhere.
const SCRIM = 'rgba(0,0,0,0.50)';

const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.4),0_2px_18px_rgba(0,0,0,0.3)]';

export function HostClosing() {
  const t = useTranslations('hostYourRetreat.closing');
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white">
      <div className="w-full">
        {/* From md the band takes the photograph's own 3:2 rather than a
            viewport height, so the frame is shown whole — the cap only bites
            on unusually wide, short windows. The explicit w-full is
            load-bearing: without a width to work from, `aspect-ratio` reads
            the min-height instead and derives a width from it. Below md the
            height follows the copy, over a modest floor. */}
        <div
          data-surface="dark"
          className="
            relative w-full overflow-hidden bg-dark flex items-center
            min-h-[60vh]
            md:min-h-[480px] md:aspect-[3/2] md:max-h-[92vh]
          "
        >
          <img
            src={IMAGE}
            alt=""
            aria-hidden
            draggable={false}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover select-none"
          />

          <div aria-hidden className="absolute inset-0" style={{ backgroundColor: SCRIM }} />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className={`relative w-[85%] max-w-3xl mx-auto text-center py-16 md:py-20 ${TEXT_SHADOW}`}
          >
            <h2 className="font-display font-light text-cream text-3xl md:text-5xl leading-[1.15] text-balance">
              {t('heading')}
            </h2>
            <p className="font-body text-sm md:text-base text-cream/85 leading-[1.8] mt-6 max-w-2xl mx-auto">
              {t('body')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
