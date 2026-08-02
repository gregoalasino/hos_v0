'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// Pre-footer moment — same editorial treatment as /retreats and /accommodations:
// warm-white background, centered heading, two underline-link CTAs.
// No background image, no dark overlay.
export function GalleryFinalCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="w-[90%] md:w-[80%] max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
          Photographs only carry so much.
        </h2>

        {/* CTAs — both as editorial underline links, mirroring the retreats
            and accommodations final CTAs. */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-center mt-10">
          <Link
            href="/accommodations"
            className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
          >
            Reserve your stay
          </Link>

          <Link
            href="/retreats"
            className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
          >
            Explore retreats
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
