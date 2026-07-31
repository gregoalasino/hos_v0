'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

// Full-bleed hero for the Yoga Teacher Training landing. Mirrors ShaktiHero
// framing (80% container on desktop, edge-to-edge on mobile, navbar offset) in
// the House of Shakti palette.
// TODO: swap the placeholder image for a hero-specific YTT photo when available.
const HERO_IMAGE = '/images/yoga/NE8A7702%201.webp';

const meta = ['House of Shakti · Costa Rica', 'Nov 21 – Dec 4, 2026', 'RYT 200 · Yoga Alliance'];

export function YTTHero() {
  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          <img
            src={HERO_IMAGE}
            alt="Yoga practice at House of Shakti"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/30 to-dark/10"
          />

          <div className="absolute inset-0 flex items-end">
            <div className="w-[85%] md:w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
                className="font-body text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-cream/80"
              >
                A Tantric Yoga Intensive
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.12 }}
                className="font-display font-light text-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.01em] mt-5 md:mt-6 max-w-4xl"
              >
                The Awakened Body
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.22 }}
                className="font-body text-sm md:text-base text-cream/85 leading-[1.7] mt-6 max-w-xl"
              >
                A 100-hour immersion, with an optional 100-hour online program, leading to a Yoga
                Alliance Registered 200-Hour Yoga Teacher Training — guided by Nancy Goodfellow.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.32 }}
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
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.44 }}
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
