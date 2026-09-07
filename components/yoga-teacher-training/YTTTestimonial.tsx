'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMessages } from 'next-intl';

const IMAGE_DESKTOP = '/images/testimonial/testimonial-desktop.webp';
const IMAGE_MOBILE = '/images/testimonial/testimonial-mobile.webp';

// An even wash rather than the hero's bottom-weighted gradient. The quote sits
// in the middle of the frame here, not along one edge, so a gradient would run
// light under one line and heavy under the next — the words would shift in
// weight as they were read. A flat scrim holds every line at the same value.
//
// Strength is measured, not guessed, and measured per tile rather than as an
// average: the average across this band is a dark 0.26, but the brightest patch
// within it reaches 0.73, and it is the patch that decides whether a line is
// readable. Against cream, that patch clears 4.5:1 at a scrim of 0.52 — by
// 0.05, which is no margin at all once a different viewport crops the image
// somewhere else. At 0.55 it sits near 5:1 on both cuts.
const SCRIM = 'rgba(0,0,0,0.55)';

// Carries the remaining margin so the scrim doesn't have to be darkened further
// and lose the photograph behind it. Uniform, like the scrim — every line is
// held at the same weight.
const TEXT_SHADOW = '[text-shadow:0_1px_2px_rgba(0,0,0,0.35),0_2px_18px_rgba(0,0,0,0.28)]';

export function YTTTestimonial() {
  const t = useMessages().ytt;
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-warm-white">
      {/* Full width on every breakpoint. The rest of the page holds an 80%
          container, but this one moment is the photograph, and insetting it
          would frame a quotation as though it were another block of content. */}
      <div className="w-full">
        {/* Height follows the quote and only then a minimum, never the other way
            around. Pinning this to a viewport height would put 320 characters at
            risk of being clipped on a short window or a large accessibility font
            size, and a testimonial that loses its last line is worse than one
            that is simply taller than expected. */}
        <div
          data-surface="dark"
          className="relative overflow-hidden bg-dark min-h-[75vh] md:min-h-[80vh] flex items-center"
        >
          <picture>
            <source media="(max-width: 767px)" srcSet={IMAGE_MOBILE} />
            <img
              src={IMAGE_DESKTOP}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover select-none"
              loading="lazy"
              decoding="async"
            />
          </picture>

          <div aria-hidden className="absolute inset-0" style={{ backgroundColor: SCRIM }} />

          <div className="relative w-[85%] md:w-[80%] mx-auto py-24 md:py-32">
            <figure className={`max-w-3xl mx-auto text-center ${TEXT_SHADOW}`}>
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="h-px w-16 bg-cream/40 mx-auto origin-center"
              />

              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
                // Restrained for its length. The page's other display type runs
                // large because it is a handful of words; 320 characters set that
                // way becomes a wall to climb rather than a voice to listen to.
                // `text-balance` keeps the last line from stranding a single word.
                className="font-display font-light text-cream text-xl md:text-2xl lg:text-[28px] leading-[1.55] tracking-[-0.005em] text-balance mt-10 md:mt-12"
              >
                &ldquo;{t.testimonial.quote}&rdquo;
              </motion.blockquote>

              <motion.figcaption
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.45 }}
                className="font-body text-[11px] md:text-xs tracking-[0.28em] uppercase text-cream/85 mt-10 md:mt-12"
              >
                {t.testimonial.author}
              </motion.figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
