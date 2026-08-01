'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

export function ShaktiPricing() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="w-[90%] md:w-[80%] mx-auto"
      >
        <div className="border border-ink/15 px-8 py-14 md:px-16 md:py-20 text-center">
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]">
            Tailored to your group and dates.
          </h2>
          <p className="font-body text-sm text-ink leading-[1.7] mt-6 max-w-xl mx-auto">
            The price depends on the number of guests and the selected dates. Ask us about our
            special group rates, and check our calendar for current availability.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300 mt-10"
          >
            Request pricing & dates
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
