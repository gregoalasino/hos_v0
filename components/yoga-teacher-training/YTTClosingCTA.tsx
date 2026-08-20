'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// TODO: swap for a full-bleed closing image when available.
const IMAGE = '/images/yoga/NE8A7854%201.webp';
const NANCY_WHATSAPP = 'https://wa.me/50684904626';

// Full-bleed, low-height transition band (à la the home QuoteBreak short size).
export function YTTClosingCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white">
      <div className="w-full">
        <div data-surface="dark" className="relative overflow-hidden bg-dark min-h-[42vh] md:min-h-[46vh] flex items-center justify-center">
          <img src={IMAGE} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-dark/60" />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="relative w-[85%] max-w-3xl mx-auto text-center py-16 md:py-20"
          >
            <h2 className="font-display font-light text-cream text-3xl md:text-5xl leading-[1.15]">
              Join Us in Costa Rica For An Unforgettable Experience
            </h2>
            <p className="font-body text-sm md:text-base text-cream/85 leading-[1.8] mt-6 max-w-2xl mx-auto">
              We invite you to push the boundaries of your capacities, summon the compassion, courage
              and confidence of your inner teacher and step wildly into the light-hearted expression
              of your own authentic voice – your most valuable gift to share with the world.
            </p>
            <a
              href={NANCY_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300 mt-10"
            >
              Begin your training
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
