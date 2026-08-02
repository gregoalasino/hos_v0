'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, Variants, useInView } from 'framer-motion';

// ─── Editions grid ───────────────────────────────────────────────────────────
// The RecenterLife "Upcoming" card format: a category badge overlaid on the
// image, a host line, a serif title, a dated row, a short description, and an
// Apply action. Data-driven so both the Shakti Experience and YTT landings can
// present their upcoming editions/cohorts the same way.
export type Edition = {
  badge: string;
  badgeColor?: 'burgundy' | 'ink' | 'green';
  host: string;
  title: string;
  dates: string;
  description: string;
  image: string;
  href: string;
  ctaLabel?: string;
};

const badgeBg: Record<NonNullable<Edition['badgeColor']>, string> = {
  burgundy: 'bg-burgundy',
  ink: 'bg-dark',
  green: 'bg-[#4b5d3a]',
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

function CalendarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="h-3.5 w-3.5 shrink-0 opacity-70"
    >
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

function EditionCard({ edition }: { edition: Edition }) {
  return (
    <motion.article variants={itemVariants} className="flex flex-col">
      {/* Image + badge */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={edition.image}
          alt={edition.title}
          className="w-full h-full object-cover transition-transform duration-[800ms] ease-out hover:scale-[1.02]"
        />
        <span
          className={`absolute left-4 top-4 rounded-full px-4 py-1.5 font-body text-[10px] tracking-[0.18em] uppercase text-cream ${
            badgeBg[edition.badgeColor ?? 'burgundy']
          }`}
        >
          {edition.badge}
        </span>
      </div>

      {/* Body */}
      <div className="mt-6 flex flex-1 flex-col">
        <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink/60">
          {edition.host}
        </p>
        <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-snug mt-3">
          {edition.title}
        </h3>

        <div className="flex items-center gap-2 text-ink/70 mt-4">
          <CalendarIcon />
          <span className="font-body text-sm">{edition.dates}</span>
        </div>

        <p className="font-body text-sm text-ink leading-relaxed mt-4">{edition.description}</p>

        <div className="mt-auto pt-8">
          <Link
            href={edition.href}
            className="inline-block bg-dark text-cream font-body text-xs tracking-[0.12em] uppercase px-7 py-3 hover:bg-burgundy transition-colors duration-300"
          >
            {edition.ctaLabel ?? 'Apply'}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function EditionsGrid({
  eyebrow,
  heading,
  intro,
  editions,
  className = 'bg-warm-white',
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  editions: Edition[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className={`py-20 lg:py-28 ${className}`}>
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="mb-14 lg:mb-20 max-w-2xl"
        >
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">{eyebrow}</p>
          <h2 className="font-display font-light text-ink text-3xl md:text-5xl leading-[1.1] mt-4">
            {heading}
          </h2>
          {intro && (
            <p className="font-body text-sm text-ink leading-relaxed mt-6">{intro}</p>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {editions.map((edition) => (
            <EditionCard key={edition.title} edition={edition} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
