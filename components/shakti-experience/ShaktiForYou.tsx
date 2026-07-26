'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const points = [
  'You feel disconnected from yourself and your bodily sensations.',
  'You’ve been living on autopilot and carrying high levels of stress.',
  'You long for a safe space to rest and reconnect.',
  'You want to inhabit your body with more tenderness and less judgment through yoga.',
];

// TODO: swap for a Shakti Experience photo (yoga / beach walk work well here).
const IMAGE = '/images/yoga/NE8A7854%201.webp';

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function ShaktiForYou() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="relative aspect-[4/5] overflow-hidden order-1 lg:order-none"
        >
          <img src={IMAGE} alt="" aria-hidden className="w-full h-full object-cover" />
        </motion.div>

        {/* Text */}
        <div className="mt-12 lg:mt-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
          >
            Is This For You
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-6"
          >
            This experience is for you if…
          </motion.h2>

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
      </div>
    </section>
  );
}
