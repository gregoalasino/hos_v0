'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const HEADLINE = 'Embody the wisdom of Tantra — yoga as a path of embodiment, healing, and conscious living.';

const headlineContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function YTTIntro() {
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
            className="font-display font-light text-ink text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.01em]"
          >
            {words.map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden>
                <span className="inline-block overflow-hidden align-baseline">
                  <motion.span variants={headlineWord} className="inline-block will-change-transform">
                    {word}
                  </motion.span>
                </span>
                {i < words.length - 1 ? ' ' : ''}
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
              This training goes far beyond the physical practice of yoga. Through movement,
              breathwork, meditation, Tantra philosophy, ritual, nervous system regulation, somatic
              awareness, and authentic connection, you’ll explore yoga as a living practice that
              transforms the way you relate to yourself and the world.
            </p>
            <p className="font-body text-sm text-ink leading-[1.8]">
              Held in the lush tropical beauty of Costa Rica, this immersive experience offers the
              perfect balance of disciplined study, embodied practice, community living, and deep
              restoration.
            </p>
            <p className="font-body text-sm text-ink leading-[1.8] italic">
              Whether your intention is to become a yoga teacher or simply to deepen your personal
              practice, this training offers a grounded, integrative, and heart-centered path into
              embodied living.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
