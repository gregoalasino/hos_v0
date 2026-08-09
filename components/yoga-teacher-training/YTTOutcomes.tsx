'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const outcomes = [
  'Develop a deep understanding of Tantra as a living philosophy.',
  'Build a sustainable and meaningful personal practice.',
  'Learn to regulate your nervous system through embodied practices.',
  'Cultivate confidence in guiding yoga classes and transformational experiences.',
  'Deepen your relationship with breath, movement, and meditation.',
  'Strengthen your authentic voice and leadership.',
  'Experience greater presence, resilience, and self-awareness.',
  'Join a global community of practitioners and teachers.',
  'Receive your internationally recognized Yoga Alliance certification upon completion of both phases.',
];

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function YTTOutcomes() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] max-w-2xl"
        >
          By the End of This Journey You Will…
        </motion.h2>

        <motion.ul
          variants={listContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-5"
        >
          {outcomes.map((outcome) => (
            <motion.li
              key={outcome}
              variants={listItem}
              className="flex gap-4 border-b border-ink/10 pb-5"
            >
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burgundy" />
              <span className="font-body text-sm text-ink leading-[1.7]">{outcome}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
