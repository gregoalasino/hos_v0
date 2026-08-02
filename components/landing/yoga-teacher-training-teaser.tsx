'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// Access point to the Yoga Teacher Training landing — rendered on the home page
// right after the Shakti Experience teaser. Full-bleed banner in the HOS palette;
// the whole card is a single link.
// TODO: swap for a signature YTT photo when available.
const IMAGE = '/images/yoga/IMG_7526%201.webp';

export function YogaTeacherTrainingTeaser() {
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
          <Link href="/yoga-teacher-training" className="group block">
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
                <h2 className="font-display font-light text-cream text-4xl md:text-6xl lg:text-7xl leading-[0.98] tracking-[-0.01em] max-w-3xl">
                  The Awakened Body
                </h2>
                <p className="font-body text-sm md:text-base text-cream/85 leading-[1.7] mt-6 max-w-xl">
                  A Tantric Yoga Intensive — a 100-hour immersion in Costa Rica, leading to a Yoga
                  Alliance Registered 200-Hour certification.
                </p>
                <span className="inline-block font-body text-sm text-cream underline underline-offset-4 decoration-[0.5px] transition-opacity duration-300 group-hover:opacity-70 mt-8">
                  Discover the training
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
