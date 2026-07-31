'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const phases = [
  {
    tag: 'Phase One',
    title: '100-Hour Residential Immersion',
    place: 'House of Shakti · Costa Rica',
    body: 'Your journey begins with a 100-hour residential immersion — daily practice, philosophy, and embodiment held in the jungle above Playa Hermosa. On completion you receive a 100-Hour Certificate of Completion.',
  },
  {
    tag: 'Phase Two',
    title: '100-Hour Online Training',
    place: 'Optional · From anywhere in the world',
    body: 'For those who wish to continue, the experience extends through an in-depth online curriculum designed for integration and professional development — allowing you to study from anywhere in the world.',
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function YTTPathway() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
          >
            The Pathway
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-6"
          >
            Two pathways, one journey.
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-8 lg:gap-10 mt-14 lg:mt-16"
        >
          {phases.map((phase) => (
            <motion.article
              key={phase.tag}
              variants={item}
              className="border border-ink/15 p-8 md:p-10 flex flex-col"
            >
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-burgundy">
                {phase.tag}
              </p>
              <h3 className="font-display font-light text-ink text-2xl leading-snug mt-4">
                {phase.title}
              </h3>
              <p className="font-body text-xs tracking-[0.05em] uppercase text-ink/50 mt-3">
                {phase.place}
              </p>
              <p className="font-body text-sm text-ink leading-[1.8] mt-6">{phase.body}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
          className="mt-10 lg:mt-12 border-l-2 border-burgundy pl-6 md:pl-8 max-w-3xl"
        >
          <p className="font-body text-sm md:text-base text-ink leading-[1.8]">
            Complete both phases to receive your{' '}
            <span className="text-burgundy">Yoga Alliance Registered 200-Hour Yoga Teacher
            Training Certificate (RYT 200)</span>{' '}
            — one of the world’s most widely recognized yoga teaching credentials, recognized
            internationally.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
