'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Full-bleed image hero, matched to the HOS home/retreats framing (80% container
// on desktop, edge-to-edge on mobile, mt-* offset for the fixed navbar).
// Structure mirrors the Trama Viva "Within" hero — oversized display title,
// a meta row, and a single CTA — but in the House of Shakti palette.
// TODO: swap the placeholder image for a hero-specific Shakti Experience photo.
const HERO_IMAGE = '/images/sanctuary/271A0642_websize%201.webp';

const meta = ['Santa Teresa, Costa Rica', '4-day immersion', 'Limited spaces'];

export function ShaktiHero() {
  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          {/* Background image */}
          <img
            src={HERO_IMAGE}
            alt="House of Shakti sanctuary"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Legibility overlay — soft, from the bottom */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/25 to-dark/10"
          />

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-[85%] md:w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="font-display font-light text-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.01em]"
              >
                Shakti Experience
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.16 }}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-7 md:mt-8"
              >
                {meta.map((item, i) => (
                  <span key={item} className="flex items-center gap-4">
                    {i > 0 && (
                      <span aria-hidden className="hidden sm:inline-block h-3 w-px bg-cream/40" />
                    )}
                    <span className="font-body text-xs md:text-sm text-cream/85">{item}</span>
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.28 }}
                className="mt-9 md:mt-10"
              >
                <Link
                  href="/contact"
                  className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300"
                >
                  Reserve your place
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
