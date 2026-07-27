'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const features = [
  '4 spacious suites with private bathrooms',
  'Air conditioning in all rooms',
  'High-speed Wi-Fi throughout the property',
];

// TODO: swap placeholders for Shakti Experience / property photos.
const IMAGE_MAIN = '/images/sanctuary/271A0778_websize%201.webp';
const IMAGE_SECONDARY = '/images/sanctuary/271A0722_websize%201.webp';

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function ShaktiPlace() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        {/* Heading + intro */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
            >
              The Place
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
              className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-6"
            >
              House of Shakti
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="font-body text-sm text-ink leading-[1.8] mt-8 lg:mt-0"
          >
            A tranquil and luxurious sanctuary nestled in nature, perched on a serene hilltop with
            complete privacy and breathtaking jungle views — just a five-minute drive from Playa
            Hermosa, Santa Teresa, one of Costa Rica’s most beautiful beaches and renowned surf
            spots.
          </motion.p>
        </div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-14 lg:mt-16"
        >
          <div className="relative aspect-[4/3] md:aspect-auto md:col-span-2 overflow-hidden">
            <img src={IMAGE_MAIN} alt="" aria-hidden className="w-full h-full object-cover" />
          </div>
          <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
            <img src={IMAGE_SECONDARY} alt="" aria-hidden className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Accommodation features */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 mt-16 lg:mt-20">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.35 }}
            className="font-display font-light text-ink text-2xl leading-snug"
          >
            The Main House — an elegant, serene living experience balancing privacy with warm shared
            spaces.
          </motion.h3>

          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-8 lg:mt-0 space-y-4"
          >
            {features.map((feature) => (
              <motion.li
                key={feature}
                variants={listItem}
                className="flex gap-4 border-b border-ink/10 pb-4"
              >
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burgundy" />
                <span className="font-body text-sm text-ink leading-[1.6]">{feature}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
