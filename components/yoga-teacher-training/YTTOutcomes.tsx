'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { LoopingClip } from '@/components/shared/LoopingClip';
import { useMessages } from 'next-intl';

// The outcomes live in the dictionary, in both languages.

const CLIP = '/videos/you-will/the-end-of-journey-c';

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function YTTOutcomes() {
  const t = useMessages().ytt;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      {/* Seven parts to five. The list is the substance here and needs the room
          to stay on one line per outcome; the clip is a companion to it, not a
          second column competing for the same weight. */}
      <div
        ref={ref}
        className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start"
      >
        {/* ── The outcomes ────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] max-w-2xl"
          >
            {t.outcomes.heading}
          </motion.h2>

          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-12 space-y-5"
          >
            {t.outcomes.items.map((outcome) => (
              <motion.li
                key={outcome}
                variants={listItem}
                className="flex gap-4 border-b border-ink/10 pb-5"
              >
                <span
                  aria-hidden
                  className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burgundy"
                />
                <span className="font-body text-sm text-ink leading-[1.7]">{outcome}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* ── Nancy, practising ───────────────────────────────────────── */}
        {/* Sticky on desktop only, and only within this grid row: the list runs
            long, and a clip that scrolled away after the second outcome would
            leave five columns of empty page beside the rest of them. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
          className="lg:col-span-5 mt-12 lg:mt-0 lg:sticky lg:top-28"
        >
          {/* Capped below desktop. Left to fill the container, a 3:4 clip on a
              tablet becomes an 800px slab that outweighs the nine outcomes it
              is meant to accompany. In its own column on desktop the width is
              already settled, so the cap comes off. */}
          <LoopingClip
            src={`${CLIP}.mp4`}
            poster={`${CLIP}-poster.jpg`}
            className="aspect-[3/4] max-w-sm mx-auto lg:max-w-none lg:mx-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
