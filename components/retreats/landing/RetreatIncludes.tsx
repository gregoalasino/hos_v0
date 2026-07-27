'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Retreat } from '@/lib/retreats';

export function RetreatIncludes({ retreat }: { retreat: Retreat }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="w-[90%] md:w-[80%] max-w-5xl mx-auto"
      >
        <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mb-16 lg:mb-20">
          {retreat.includesHeading}
        </h2>

        {/* Includes list */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {retreat.includesItems.map((item) => (
            <li key={item} className="flex items-baseline gap-3">
              <span aria-hidden className="font-body text-sm text-ink select-none">—</span>
              <span className="font-body text-sm text-ink leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        {/* Not included — each item renders as its own paragraph so the
            disclaimers read as distinct ideas, not a dense block. */}
        <div className="mt-12 max-w-2xl space-y-4">
          {retreat.notIncluded.map((paragraph, i) => (
            <p
              key={i}
              className="font-body text-sm italic text-ink leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
