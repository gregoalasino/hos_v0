'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import type { Retreat } from '@/lib/retreats';

// Pre-footer moment — mirrors the accommodations FinalCTA exactly:
// warm-white background, centered heading, editorial underline CTAs.
// No background image, no dark overlay — clean editorial closing.
export function RetreatFinalCTA({ retreat }: { retreat: Retreat }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const isExternalSecondary = retreat.finalCTASecondaryHref.startsWith('http');

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
          {retreat.finalCTAHeading}
        </h2>

        {/* CTAs — both rendered as editorial underline links (same treatment as
            the accommodations CheckAvailabilityLink). Two links side-by-side
            stays clean and consistent with the rest of the site. */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-center mt-10">
          <Link
            href={retreat.finalCTAPrimaryHref}
            className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
          >
            {retreat.finalCTAPrimaryLabel}
          </Link>

          {isExternalSecondary ? (
            <a
              href={retreat.finalCTASecondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
            >
              {retreat.finalCTASecondaryLabel}
            </a>
          ) : (
            <Link
              href={retreat.finalCTASecondaryHref}
              className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
            >
              {retreat.finalCTASecondaryLabel}
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  );
}
