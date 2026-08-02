'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const HEADLINE = 'The year ahead.';

const headlineContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function RetreatsIntroduction() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const words = HEADLINE.split(' ');

  return (
    <section className="bg-warm-white py-20 lg:py-28 overflow-hidden">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-3xl">
          <motion.h2
            variants={headlineContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            aria-label={HEADLINE}
            className="font-display font-light text-ink text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.01em]"
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                aria-hidden
                className="inline-block overflow-hidden align-baseline"
              >
                <motion.span variants={headlineWord} className="inline-block will-change-transform">
                  {word}
                  {/* non-breaking space — regular spaces collapse inside inline-block */}
                  {i < words.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 1.4 }}
            className="font-body text-sm text-ink leading-[1.7] mt-12 lg:mt-16 max-w-2xl"
          >
            Retreats and teacher trainings confirmed for 2026, listed by date.
            Some we curate ourselves; others are led by teachers whose practice
            meets ours. Each one links through to where you can hold your place.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
