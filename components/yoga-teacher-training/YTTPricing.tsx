'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import Link from 'next/link';

const tiers = [
  {
    tag: 'Early Bird · August',
    price: 'USD $4,015',
    detail: 'Private room · 100-Hour Costa Rica immersion',
    featured: true,
  },
  {
    tag: 'Regular',
    price: 'USD $4,340',
    detail: 'Private room · 100-Hour Costa Rica immersion',
    featured: false,
  },
  {
    tag: 'Training Only',
    price: 'USD $2,620',
    detail: 'Training + 1 meal · without accommodation',
    featured: false,
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function YTTPricing() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-dark text-cream py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-cream text-3xl md:text-4xl leading-[1.15]"
          >
            Costa Rica Immersion — 100 hours.
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-14 lg:mt-16"
        >
          {tiers.map((tier) => (
            <motion.article
              key={tier.tag}
              variants={item}
              className={`p-8 md:p-10 flex flex-col ${
                tier.featured
                  ? 'bg-cream text-dark'
                  : 'border border-cream/20 text-cream'
              }`}
            >
              <p
                className={`font-body text-[10px] tracking-[0.25em] uppercase ${
                  tier.featured ? 'text-burgundy' : 'text-cream/60'
                }`}
              >
                {tier.tag}
              </p>
              <p className="font-display font-light text-3xl md:text-4xl mt-5">{tier.price}</p>
              <p
                className={`font-body text-sm leading-[1.7] mt-4 ${
                  tier.featured ? 'text-dark/70' : 'text-cream/70'
                }`}
              >
                {tier.detail}
              </p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
        >
          <p className="font-body text-sm text-cream/70 leading-[1.7] max-w-md">
            Optional 100-Hour online program — pricing and schedule available upon request. Please
            contact us for available payment options.
          </p>
          <Link
            href="/contact"
            className="inline-block shrink-0 bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300"
          >
            Request pricing & dates
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
