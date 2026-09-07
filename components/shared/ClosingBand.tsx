'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Closing band ────────────────────────────────────────────────────────────
// A page's last word before the footer: full-bleed, the photograph shown as it
// was composed, a statement centred in it and one door out. Built for the
// training landing; the Shakti Experience closes the same way with its own
// photograph, so the frame, the scrim and the words arrive as props.

const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.4),0_2px_18px_rgba(0,0,0,0.3)]';

export function ClosingBand({
  image,
  imageMobile,
  aspect,
  scrim,
  heading,
  body,
  cta,
}: {
  image: string;
  /** A portrait cut for phones, where one exists. */
  imageMobile?: string;
  /**
   * The photograph's own proportions from md, as a Tailwind class
   * (`md:aspect-[1920/1081]`), so the frame is shown whole rather than cropped
   * to a viewport height.
   */
  aspect: string;
  /** Flat black scrim, measured against the photograph — see the callers. */
  scrim: string;
  heading: string;
  body: string;
  cta: { label: string; href: string };
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white">
      <div className="w-full">
        {/* From md the band takes the photograph's own proportions rather than a
            viewport height, so the frame is shown as it was composed. The cap
            only bites on unusually wide, short windows. The explicit w-full is
            load-bearing: without a width to work from, `aspect-ratio` reads the
            min-height instead and derives a width from it, which on a tablet
            blew the band out past the viewport.

            Below md the height follows the copy, over a modest floor: every
            pixel of band beyond what the words need is a pixel the portrait
            crop pays for sideways. */}
        <div
          data-surface="dark"
          className={`relative w-full overflow-hidden bg-dark flex items-center min-h-[60vh] md:min-h-[480px] md:max-h-[92vh] ${aspect}`}
        >
          <picture>
            {imageMobile && <source media="(max-width: 767px)" srcSet={imageMobile} />}
            <img
              src={image}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
          </picture>

          <div aria-hidden className="absolute inset-0" style={{ backgroundColor: scrim }} />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className={`relative w-[85%] max-w-3xl mx-auto text-center py-16 md:py-20 ${TEXT_SHADOW}`}
          >
            <h2 className="font-display font-light text-cream text-3xl md:text-5xl leading-[1.15] text-balance">
              {heading}
            </h2>
            <p className="font-body text-sm md:text-base text-cream/85 leading-[1.8] mt-6 max-w-2xl mx-auto">
              {body}
            </p>
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300 mt-10 [text-shadow:none]"
            >
              {cta.label}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
