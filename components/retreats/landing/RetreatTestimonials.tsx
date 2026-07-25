'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Retreat } from '@/lib/retreats';

// One testimonial at a time. Editorial 2-column layout:
//   LEFT  — quote + author (text occupies the wider column)
//   RIGHT — portrait + prev/next chevron arrows (Amanjena-style, right-aligned
//           below the image), no border-radius.
// The "Voices" eyebrow has been removed for a cleaner framing.
export function RetreatTestimonials({ retreat }: { retreat: Retreat }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [current, setCurrent] = useState(0);
  const total = retreat.testimonials.length;
  const t = retreat.testimonials[current];

  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);
  const goNext = () => setCurrent((c) => (c + 1) % total);

  return (
    <section ref={sectionRef} className="bg-cream py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] max-w-6xl mx-auto">
        {/* Header — eyebrow intentionally omitted */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
            Voices from those who have arrived.
          </h2>
        </motion.div>

        {/* Body — text left, portrait + arrows right */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center"
        >
          {/* LEFT — quote + arrows (crossfades on testimonial change). Arrows live
              under the testimonial itself so navigation feels tied to the text. */}
          <div className="order-2 lg:order-1">
            <div className="relative min-h-[260px] lg:min-h-[340px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={`text-${current}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full"
                >
                  <span
                    aria-hidden
                    className="block font-display font-light text-burgundy text-6xl lg:text-7xl leading-none select-none"
                  >
                    {'“'}
                  </span>
                  <blockquote className="font-display font-light italic text-ink text-2xl lg:text-3xl leading-snug mt-6">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-10">
                    <p className="font-body text-sm text-ink tracking-[0.1em]">
                      — {t.author}
                    </p>
                    <p className="font-body text-xs text-ink mt-1">
                      {t.location}
                    </p>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* Arrows — sit under the testimonial so navigation feels interactive */}
            {total > 1 && (
              <div className="flex items-center gap-6 mt-8">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                  className="text-ink hover:opacity-50 transition-opacity duration-300 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={1} />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next testimonial"
                  className="text-ink hover:opacity-50 transition-opacity duration-300 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={1} />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT — portrait only (no controls). Image swaps with the testimonial. */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
              {retreat.testimonials.map((entry, i) => (
                <motion.img
                  key={entry.image}
                  src={entry.image}
                  alt={`Portrait of ${entry.author}`}
                  initial={false}
                  animate={{ opacity: i === current ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
