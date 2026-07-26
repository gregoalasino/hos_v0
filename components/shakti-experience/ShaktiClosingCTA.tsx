'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// TODO: swap for a full-bleed Shakti Experience closing image (beach / horizon).
const IMAGE = '/images/sanctuary/271A0663_websize%201.webp';

export function ShaktiClosingCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto">
        <div className="relative overflow-hidden bg-dark min-h-[70vh] flex items-center justify-center">
          <img src={IMAGE} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-dark/55" />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="relative w-[85%] max-w-2xl mx-auto text-center py-24"
          >
            <h2 className="font-display font-light text-cream text-3xl md:text-5xl leading-[1.2]">
              This is a return. A landing.
            </h2>
            <p className="font-body text-sm md:text-base text-cream/85 leading-[1.8] mt-6">
              Not toward a better version of yourself, but toward the most authentic one.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300 mt-10"
            >
              Begin your experience
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
