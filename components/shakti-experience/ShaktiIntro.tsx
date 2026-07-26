'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const HEADLINE = 'A return to the place that has always been yours: the body.';

const headlineContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function ShaktiIntro() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const words = HEADLINE.split(' ');

  return (
    <section className="bg-warm-white py-20 lg:py-28 overflow-hidden">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy mb-8"
          >
            The Invitation
          </motion.p>

          <motion.h2
            variants={headlineContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            aria-label={HEADLINE}
            className="font-display font-light text-ink text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.01em]"
          >
            {words.map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden align-baseline">
                <motion.span variants={headlineWord} className="inline-block will-change-transform">
                  {word}
                  {i < words.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            className="mt-12 lg:mt-16 space-y-6 max-w-2xl"
          >
            <p className="font-body text-sm text-ink leading-[1.8]">
              Shakti is the force that gives life, movement, and transformation to everything. It
              represents the feminine principle — not in terms of gender, but as the innate capacity
              to create, nurture, feel, and change. Shakti lives in nature, in the body, in emotions,
              in intuition, and in creativity.
            </p>
            <p className="font-body text-sm text-ink leading-[1.8] italic">
              Without Shakti, nothing moves. Nothing unfolds.
            </p>
            <p className="font-body text-sm text-ink leading-[1.8]">
              For four days, we step away from noise, overstimulation, and the many subtle (and not
              so subtle) ways we disconnect. We leave behind urgency and external demands to inhabit
              the body with presence, listening, and kindness.
            </p>
            <p className="font-body text-sm text-ink leading-[1.8]">
              This is not an experience to fix anything. It is a space to feel without judgment, to
              gently awaken what has been asleep, and to reconnect with what may have been numbed in
              order to survive.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
