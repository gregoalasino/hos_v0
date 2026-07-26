'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// Access point to the Shakti Experience landing — rendered on the home page
// right after "The world of Shakti" (Pillars). Full-bleed banner in the HOS
// palette; the whole card is a single link.
// TODO: swap for a signature Shakti Experience photo when available.
const IMAGE = '/images/sanctuary/271A0698_websize%201.webp';

export function ShaktiExperienceTeaser() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          <Link href="/shakti-experience" className="group block">
            <div className="relative overflow-hidden bg-dark min-h-[65vh] md:min-h-[70vh] flex items-end">
              <img
                src={IMAGE}
                alt=""
                aria-hidden
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/25 to-dark/5"
              />

              <div className="relative w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20">
                <p className="font-body text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-cream/80">
                  The Signature Immersion
                </p>
                <h2 className="font-display font-light text-cream text-4xl md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.01em] mt-5 md:mt-6 max-w-3xl">
                  Shakti Experience
                </h2>
                <p className="font-body text-sm md:text-base text-cream/85 leading-[1.7] mt-6 max-w-xl">
                  A four-day return to the body — yoga, considered rest, nature, and deep
                  reconnection, held by the jungle above Playa Hermosa.
                </p>
                <span className="inline-block font-body text-sm text-cream underline underline-offset-4 decoration-[0.5px] transition-opacity duration-300 group-hover:opacity-70 mt-8">
                  Discover the experience
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
