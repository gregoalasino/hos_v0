'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// TODO: swap for a full-bleed closing image when available.
const IMAGE = '/images/yoga/NE8A7854%201.webp';

export function YTTClosingCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto">
        <div className="relative overflow-hidden bg-dark min-h-[70vh] flex items-center justify-center">
          <img src={IMAGE} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-dark/60" />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="relative w-[85%] max-w-2xl mx-auto text-center py-24"
          >
            <h2 className="font-display font-light text-cream text-3xl md:text-5xl leading-[1.2]">
              Come home to your body. Awaken your practice. Live the teachings.
            </h2>
            <p className="font-body text-sm md:text-base text-cream/85 leading-[1.8] mt-6">
              To study deeply. To move with awareness. To breathe with intention. To embody the
              teachings rather than simply learn them.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300 mt-10"
            >
              Begin your training
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
