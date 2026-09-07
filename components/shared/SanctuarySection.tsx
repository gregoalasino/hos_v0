'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { TrackArrows } from '@/components/shared/TrackArrows';
import { useCarousel } from '@/hooks/use-carousel';

// ─── The sanctuary ───────────────────────────────────────────────────────────
// A place-setting block: the house named, and a walk through sixteen frames of
// it. Built for the training landing; the Shakti Experience introduces the
// same house with the same words, so only the copy arrives as props and the
// frames stay here.

// Sixteen frames of the property, all shot 3:2 landscape.
const FRAMES = Array.from(
  { length: 16 },
  (_, i) => `/images/sanctuary/hos-day-${String(i + 1).padStart(2, '0')}.webp`,
);

const track: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};
const frame: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function SanctuarySection({
  heading,
  body,
  trackAria,
}: {
  heading: string;
  body: string;
  trackAria: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const { trackRef, atStart, atEnd, step, hasOverflow } = useCarousel();

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-3 lg:gap-12">
        {/* ── Left — the place, named ─────────────────────────────────── */}
        {/* items-start is implicit here: the grid's default stretch is overridden
            by this column's own content flow, so the copy sits at the top of the
            row rather than floating against the middle of a tall carousel. */}
        <div className="lg:col-span-1 lg:pr-12 self-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            <img
              src="/logos/logo-hos-negro.webp"
              alt=""
              aria-hidden
              draggable={false}
              className="h-12 lg:h-14 w-auto select-none mb-6 lg:mb-8"
              loading="lazy"
              decoding="async"
            />

            <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]">
              {heading}
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-body text-sm text-ink leading-relaxed mt-6 lg:mt-10 max-w-full lg:max-w-xs"
          >
            {body}
          </motion.p>

          {hasOverflow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
              className="mt-8 lg:mt-10"
            >
              <TrackArrows
                atStart={atStart}
                atEnd={atEnd}
                onPrev={() => step(-1)}
                onNext={() => step(1)}
              />
            </motion.div>
          )}
        </div>

        {/* ── Right — the walk through ────────────────────────────────── */}
        <div className="lg:col-span-2 mt-12 lg:mt-0">
          {/* Same gutter rule as every other track on the page: begins on the
              container's left edge and runs off the right one, so a frame cut by
              the screen edge says the row continues. On desktop it stays inside
              its column, where the grid already cuts the frames visibly. */}
          <motion.div
            ref={trackRef}
            role="group"
            aria-label={trackAria}
            variants={track}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="
              flex gap-6 lg:gap-8
              overflow-x-auto snap-x snap-proximity scroll-smooth
              select-none
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              -mr-[5vw] md:-mr-[10vw] lg:mr-0
            "
          >
            {FRAMES.map((src, i) => (
              <motion.div
                key={src}
                variants={frame}
                className="
                  flex-shrink-0 snap-start
                  w-[82vw] max-w-[420px]
                  lg:w-[46vw] lg:max-w-[560px]
                "
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-cream">
                  <img
                    src={src}
                    alt=""
                    aria-hidden
                    draggable={false}
                    // Sixteen frames is roughly 3 MB. Only the two that can be
                    // on screen at once are worth fetching up front; the rest
                    // arrive as the track is walked.
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
