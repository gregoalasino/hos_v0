'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const audience = [
  'Aspiring yoga teachers',
  'Dedicated yoga practitioners',
  'Retreat facilitators',
  'Coaches',
  'Therapists',
  'Wellness professionals',
  'Space holders',
  'Anyone seeking a more embodied, conscious, and connected way of living',
  'Yoga Teachers',
];

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function YTTWhoFor() {
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
          Who Is This Training For?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
          className="font-body text-sm text-ink leading-[1.8] mt-6"
        >
          This immersion welcomes:
        </motion.p>

        <motion.ul
          variants={listContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-10 grid sm:grid-cols-2 gap-x-12 gap-y-4"
        >
          {audience.map((who) => (
            <motion.li key={who} variants={listItem} className="flex gap-4">
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burgundy" />
              <span className="font-body text-sm text-ink leading-[1.7]">{who}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
          className="font-body text-sm text-ink leading-[1.8] mt-10 italic"
        >
          No previous teaching experience is required.
        </motion.p>
      </div>
    </section>
  );
}
