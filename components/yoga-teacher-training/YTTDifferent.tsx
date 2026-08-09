'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const points = [
  'Move from presence rather than performance.',
  'Teach from lived experience rather than memorization.',
  'Cultivate a relationship with your body, breath, and nervous system that supports lasting transformation.',
  'Bridge the wisdom of Tantra with modern somatic practices and conscious leadership.',
];

// TODO: swap for a signature YTT photo when available.
const IMAGE = '/images/yoga/IMG_7491%201.webp';

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function YTTDifferent() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-5 lg:gap-16 lg:items-center">
        {/* Text */}
        <div className="order-2 lg:order-none lg:col-span-3">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            More than a traditional teacher training.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-body text-sm text-ink leading-[1.8] mt-6"
          >
            Rather than focusing solely on postures and sequencing, this immersion explores yoga as a
            complete path of embodied living. Here, you’ll learn to:
          </motion.p>

          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-10 space-y-6"
          >
            {points.map((point) => (
              <motion.li key={point} variants={listItem} className="flex gap-4">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burgundy" />
                <span className="font-body text-sm text-ink leading-[1.7]">{point}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="relative aspect-[4/5] overflow-hidden order-1 lg:order-none lg:col-span-2 mb-12 lg:mb-0"
        >
          <img src={IMAGE} alt="" aria-hidden className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
