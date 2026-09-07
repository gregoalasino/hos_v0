'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Retreat } from '@/lib/retreats';

// ─── Word-by-word reveal variants (matches home Introduction exactly) ────────
const headlineContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Metadata pair (label on top, value below) — same pattern as
// BookingSummary on the home. ────────────────────────────────────────────────
function MetadataPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-body text-[10px] tracking-[0.25em] uppercase text-ink">{label}</p>
      <p className="font-body text-sm text-ink mt-1">{value}</p>
    </div>
  );
}

// ─── Manifesto — typography matched 1:1 to the home Introduction ─────────────
// Section structure: headline (word-by-word) → body paragraph → metadata grid
// with the key retreat info (dates, duration, location, group).
export function RetreatManifesto({ retreat }: { retreat: Retreat }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const t = useTranslations('retreatLanding.manifesto');

  const words = retreat.manifestoHeading.split(' ');

  return (
    <section className="bg-warm-white py-20 lg:py-28 overflow-hidden">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        {/* Heading — word-by-word reveal, sizes match home Introduction */}
        <motion.h2
          variants={headlineContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          aria-label={retreat.manifestoHeading}
          className="font-display font-light text-ink max-w-4xl text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-[-0.01em]"
        >
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              aria-hidden
              className="inline-block overflow-hidden align-baseline"
            >
              <motion.span variants={headlineWord} className="inline-block will-change-transform">
                {word}
                {/* non-breaking space — regular spaces collapse inside inline-block */}
                {i < words.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Body — same size as home Introduction body */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 1.8 }}
          className="font-body text-ink max-w-2xl text-sm leading-[1.7] mt-12 lg:mt-16"
        >
          {retreat.manifestoBody}
        </motion.p>

        {/* Metadata grid — the key retreat info, surfaced after the body
            so the reader has practical context once the prose has landed.
            2 cols on mobile, 4 cols on desktop. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 2.2 }}
          className="mt-16 lg:mt-20 max-w-3xl"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
            <MetadataPair label={t('dates')} value={retreat.heroEyebrow} />
            <MetadataPair label={t('duration')} value={retreat.heroDates} />
            <MetadataPair label={t('location')} value={retreat.heroLocation} />
            <MetadataPair label={t('group')} value={retreat.heroCupos} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
