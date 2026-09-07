'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

// ─── Who is this for ─────────────────────────────────────────────────────────
// Each entry is one sentence from the owners, split at its natural hinge: who
// they are, then what they are here for.
//
// The lead is emphasised without bold, which is not only a preference — both
// faces are loaded at weight 400 only, so `font-bold` would be synthesised by
// the browser and come out smeared. The weight axis simply isn't available.
// Two other axes are: the lead takes the display face at a larger size, and the
// qualifier drops to a lower tone in the body face. Set on separate lines, so
// a long lead doesn't have to compete with its own clause for the same line.
//
// Built for the training landing; the Shakti Experience asks the same
// question of its own audience, so the words arrive as props.

export type Audience = { lead: string; detail: string };

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function WhoForSection({
  heading,
  intro,
  audience,
  closing,
}: {
  heading: string;
  /** A line between the heading and the list ("This immersion is designed for:"). */
  intro?: string;
  audience: Audience[];
  /** A quiet last word after the list ("No previous experience is required."). */
  closing?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
        >
          {heading}
        </motion.h2>

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-body text-sm text-ink leading-[1.8] mt-6"
          >
            {intro}
          </motion.p>
        )}

        {/* One column, where a grid would suit one-word labels: these carry a
            clause each, and side by side they would set at half the measure
            and wrap three deep. */}
        <motion.ul
          variants={listContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-10 lg:mt-12 max-w-3xl space-y-7"
        >
          {audience.map((entry) => (
            <motion.li key={entry.lead} variants={listItem} className="flex gap-4">
              <span
                aria-hidden
                className="mt-[11px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burgundy"
              />
              <span>
                <span className="block font-display font-light text-ink text-lg lg:text-xl leading-snug">
                  {entry.lead}
                </span>
                <span className="block font-body text-sm text-ink/70 leading-[1.7] mt-1.5">
                  {entry.detail}
                </span>
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {closing && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="font-body text-sm text-ink leading-[1.8] mt-12"
          >
            {closing}
          </motion.p>
        )}
      </div>
    </section>
  );
}
