'use client';

import { motion } from 'framer-motion';

const NANCY_WHATSAPP = 'https://wa.me/50684904626';

// Full-bleed hero for the Yoga Teacher Training landing. Mirrors ShaktiHero
// framing (80% container on desktop, edge-to-edge on mobile, navbar offset) in
// the House of Shakti palette.
// TODO: swap the placeholder image for a hero-specific YTT photo when available.
const HERO_IMAGE = '/images/yoga/NE8A7702%201.webp';

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
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="font-display font-light text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.0] tracking-[-0.01em] max-w-4xl"
              >
                The Awakened Body: Embody Tantra Yoga Teacher Training
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.08 }}
                className="font-body text-sm md:text-base italic text-cream/90 tracking-[0.02em] mt-6"
              >
                Santa Teresa, Costa Rica — November 21 – December 4, 2026
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.16 }}
                className="font-body text-sm md:text-base text-cream/85 leading-[1.7] mt-4 max-w-xl"
              >
                A 100-hour immersion, with an optional 100-hour online program, leading to a Yoga
                Alliance Registered 200-Hour Yoga Teacher Training — guided by Nancy Goodfellow.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.32 }}
                className="mt-9 md:mt-10"
              >
                <a
                  href={NANCY_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300"
                >
                  Reserve your place
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
