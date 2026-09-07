'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { TrackArrows } from '@/components/shared/TrackArrows';
import { useCarousel } from '@/hooks/use-carousel';

// ─── A day, told and walked ──────────────────────────────────────────────────
// A timeline of the day in one column and a track of photographs beside it.
// Built for the training's daily schedule; the Shakti Experience tells its
// own day the same way, so the words and the frames arrive as props.

export type DayBlock = {
  /** The hour — or, for the parts of a day that have none, a label ("On request"). */
  time: string;
  title: string;
  detail?: string;
};

const timelineContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const timelineItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};
const trackV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};
const frameV: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function DaySchedule({
  heading,
  eyebrow,
  blocks,
  footnote,
  trackAria,
  frames,
  frameAspect = 'aspect-[2/3]',
}: {
  heading: string;
  /** When this day applies ("Monday to Saturday"). */
  eyebrow?: string;
  blocks: DayBlock[];
  /** An italic aside after the timeline. */
  footnote?: string;
  trackAria: string;
  /** The photographs, in the order of the day. */
  frames: string[];
  /** The frames' own ratio — forcing a 2:3 shot into a 3:4 box crops a tenth off every one. */
  frameAspect?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const { trackRef, atStart, atEnd, step, hasOverflow } = useCarousel();

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div
        ref={ref}
        className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-5 lg:gap-16 lg:items-start"
      >
        {/* ── The day, told ───────────────────────────────────────────── */}
        {/* Two columns to the timeline, three to the track. The timeline is
            narrow by nature — times and short titles — and giving it three
            left a field of dead space between the words and the photographs. */}
        <div className="lg:col-span-2">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            {heading}
          </motion.h2>

          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
              className="font-body text-xs tracking-[0.2em] uppercase text-burgundy mt-4"
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.div
            variants={timelineContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-12 space-y-8"
          >
            {blocks.map((block) => (
              <motion.div
                key={block.title}
                variants={timelineItem}
                className="border-l border-ink/15 pl-6"
              >
                <p className="font-body text-xs tracking-[0.15em] uppercase text-burgundy">
                  {block.time}
                </p>
                <h3 className="font-display font-light text-ink text-lg leading-snug mt-2">
                  {block.title}
                </h3>
                {block.detail && (
                  <p className="font-body text-sm text-ink/80 leading-[1.7] mt-1">{block.detail}</p>
                )}
              </motion.div>
            ))}
          </motion.div>

          {footnote && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
              className="font-body text-sm text-ink/70 italic mt-10"
            >
              {footnote}
            </motion.p>
          )}
        </div>

        {/* ── The day, walked ─────────────────────────────────────────── */}
        {/* Sticky within the row on desktop, as the single photograph it
            replaces was: the timeline runs long, and a carousel that scrolled
            away after the morning would leave two empty columns beside the
            evening. The arrows travel inside the sticky wrapper, so the control
            is always beside the thing it controls. */}
        <div className="mt-12 lg:mt-0 lg:col-span-3 lg:sticky lg:top-28">
          {/* Same gutter rule as every track on the page: starts on the
              container's left edge, runs off the right one. On desktop it lives
              inside its column, showing two frames with a sliver of the third —
              the sliver is the invitation to move. */}
          <motion.div
            ref={trackRef}
            role="group"
            aria-label={trackAria}
            variants={trackV}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="
              flex gap-5 lg:gap-6
              overflow-x-auto snap-x snap-proximity scroll-smooth
              select-none
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              -mr-[5vw] md:-mr-[10vw] lg:mr-0
            "
          >
            {frames.map((src, i) => (
              <motion.div
                key={src}
                variants={frameV}
                className="
                  flex-shrink-0 snap-start
                  w-[72vw] max-w-[340px]
                  lg:w-[44%] lg:max-w-none
                "
              >
                <div className={`relative ${frameAspect} overflow-hidden bg-cream`}>
                  <img
                    src={src}
                    alt=""
                    aria-hidden
                    draggable={false}
                    // Only what can be seen on arrival is fetched up front; the
                    // rest load as the day is walked.
                    loading={i < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {hasOverflow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
              className="mt-6 lg:mt-8"
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
      </div>
    </section>
  );
}
