'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const included = [
  'Accommodation at House of Shakti',
  'Two nourishing meals daily (brunch & dinner)',
  'Full 100-Hour Yoga Teacher Training',
  'Daily yoga, meditation & embodiment practices',
  'Two breathwork journeys',
  'Sauna & ice bath experiences',
  'Boat tour',
  'Comprehensive training manual',
  'Certificate of Completion (100 hours)',
  'Connection with nature & conscious community',
];

const notIncluded = [
  'International airfare',
  'Airport transportation',
  'Travel insurance',
  'Additional beverages',
  'Personal expenses',
  'Optional excursions',
];

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function YTTIncluded() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-2 lg:gap-20">
        {/* Included */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
          >
            What’s Included
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-6"
          >
            The 100-hour Costa Rica immersion.
          </motion.h2>

          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-10 space-y-4"
          >
            {included.map((item) => (
              <motion.li
                key={item}
                variants={listItem}
                className="flex gap-4 border-b border-ink/10 pb-4"
              >
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-burgundy" />
                <span className="font-body text-sm text-ink leading-[1.6]">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Not included */}
        <div className="mt-16 lg:mt-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
            className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
          >
            Not Included
          </motion.p>

          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-10 space-y-4"
          >
            {notIncluded.map((item) => (
              <motion.li
                key={item}
                variants={listItem}
                className="flex gap-4 border-b border-ink/10 pb-4"
              >
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ink/40" />
                <span className="font-body text-sm text-ink leading-[1.6]">{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="font-body text-xs text-ink/60 leading-[1.7] mt-8 italic"
          >
            Vegetarian meals are included, and most dietary requirements can be accommodated with
            advance notice.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
