'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { StayCard } from '@/components/stay-with-us/StayCard';
import { StayLightbox } from '@/components/stay-with-us/StayLightbox';
import { pickStays, type StayData } from '@/lib/stays';

// ─── Where the group stays ───────────────────────────────────────────────────
// The dwellings a group takes over, presented exactly as /stay-with-us
// presents them — the same cards, the same carousels, the same lightbox — with
// one thing removed: the Cloudbeds door. A retreat is not booked room by
// room; the whole conversation happens on WhatsApp, further down. This is the
// shop window.
//
// Three of the four, in the order the owners list them for hosts. Shakti House
// stays out of this window on their call.
const STAYS = pickStays(['main-house', 'jungle-bungalow', 'la-casita']);

export function HostStays() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  // Which dwelling is expanded, and on which photograph it opened.
  const [expanded, setExpanded] = useState<{ stay: StayData; index: number } | null>(null);

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="max-w-2xl mb-14 lg:mb-20"
        >
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]">
            Where your group stays
          </h2>
          <p className="font-body text-sm text-ink leading-[1.8] mt-6 max-w-xl">
            Our property features a variety of lodging options to suit your
            group&apos;s preferences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
          /* Phones stack, tablets pair. From lg the grid dissolves into the
             editorial rows StayCard draws — one dwelling per row, photograph
             and story side by side, sides alternating down the page. */
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-14 lg:gap-y-28"
        >
          {STAYS.map((stay, i) => (
            <StayCard
              key={stay.slug}
              stay={stay}
              index={i}
              onExpand={(index) => setExpanded({ stay, index })}
              booking={false}
              titleAs="h3"
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <StayLightbox
            stay={expanded.stay}
            initialIndex={expanded.index}
            onClose={() => setExpanded(null)}
            booking={false}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
