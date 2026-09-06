'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroVideo, heroCuts } from '@/components/shared/HeroVideo';

// Full-bleed video hero, matched to the HOS home/retreats framing (80% container
// on desktop, edge-to-edge on mobile, mt-* offset for the fixed navbar).
// Structure mirrors the Trama Viva "Within" hero — oversized display title,
// a meta row, and a single CTA — but in the House of Shakti palette. The clip
// is the Shakti Experience one, and it also serves Sacred Union: the couples
// edition lives on this same page, under this same hero.

const meta = ['Santa Teresa, Costa Rica', '4-day immersion', 'Limited spaces'];

// The previous overlay was a burgundy gradient tuned to a dark photograph of
// the sanctuary. The footage is a beach at full sun, and over that the tint
// read as a colour cast while the type lost its edge against wet sand. This is
// the neutral scrim the other text-bearing video heroes carry: black rather
// than the brand burgundy, holding a near-plateau across the copy and falling
// away fast so the sky and sea above are untouched.
const SCRIM =
  'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.66) 22%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.42) 56%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.08) 84%, rgba(0,0,0,0) 96%)';

// Video is a moving background: a frame that reads well now can wash out a
// second later. A soft shadow on the type holds legibility through the bright
// frames without darkening the whole picture.
const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_20px_rgba(0,0,0,0.35)]';

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
          <HeroVideo {...heroCuts('shakti-experience')} />

          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: SCRIM }} />

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className={`w-[85%] md:w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20 ${TEXT_SHADOW}`}>
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
                  className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300 [text-shadow:none]"
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
