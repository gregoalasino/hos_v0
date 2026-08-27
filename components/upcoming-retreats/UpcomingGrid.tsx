'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

// ─── Upcoming retreats ───────────────────────────────────────────────────────
// Facilitators bring their own retreats to the house, so each card hands the
// reader straight over to whoever is running it. Only the training is ours, and
// it is the one entry that stays on this site.
type Retreat = {
  /** What kind of thing this is, set over the photograph. */
  label: string;
  instructor: string;
  title: string;
  /** Written out rather than derived: these are read, never sorted or compared. */
  dates: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  /** False only for the training, which lives on this site. */
  external: boolean;
};

const RETREATS: Retreat[] = [
  {
    label: 'Wellness Retreat',
    instructor: 'Elly Miles',
    title: 'Sol for Soul',
    dates: 'Sep 6–12, 2026',
    description:
      'A portal into yourself, held in a container that feels light, supportive and fun — built around the way Santa Teresa naturally invites you to open up and come alive.',
    image: '/images/upcoming/sol-for-soul.jpg',
    alt: 'A guest stepping out into the morning at House of Shakti',
    href: 'https://www.ellymiles.com/costaricaseptember',
    external: true,
  },
  {
    label: 'Yoga Teacher Training',
    instructor: 'Nancy Goodfellow',
    title: 'The Awakened Body: A Tantric Yoga Intensive',
    dates: 'Nov 21 – Dec 4, 2026',
    description:
      'A transformational immersion for those who wish to deepen their relationship with yoga beyond the physical practice. One hundred hours on the embodied path of Tantra — movement, breath, ritual and self-inquiry.',
    image: '/images/introduction/ytt-introduction-07.webp',
    alt: 'A group practising together in the open shala',
    href: '/yoga-teacher-training',
    external: false,
  },
  {
    label: 'Yoga Training',
    instructor: 'Sam Bianchini',
    title: 'NOURISH: 50hr Restorative + Yin Training',
    dates: 'Dec 5–12, 2026',
    description:
      'A week-long retreat paired with a rich, life-affirming study of Restorative and Yin Yoga — and how to hold healing space in your own original medicine.',
    image: '/images/upcoming/nourish.webp',
    alt: 'A group resting through a restorative practice in the shala',
    href: 'https://sambianchini.com/retreats',
    external: true,
  },
  {
    label: 'Transformational Retreat',
    instructor: 'Heather Nil',
    title: 'SALVAJE',
    dates: 'Jan 18–23, 2027',
    description:
      'More than a retreat — an awakening. For anyone seeking an experience to shake their world and bring their HELL YES energy back.',
    // Placeholder from our own bank: the facilitator's material lives in a Canva
    // presentation with no extractable still. Swap once she sends artwork.
    image: '/images/retreats/retreats-7.webp',
    alt: 'Bathing at the waterfall',
    href: 'https://www.canva.com/design/DAGlZEo1TOg/gc1GnLBciOIDxuLj6lhZVA/watch',
    external: true,
  },
];

function RetreatCard({ retreat, delay }: { retreat: Retreat; delay: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const ctaClass =
    'inline-block bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300';

  const cta = retreat.external ? (
    <a href={retreat.href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
      More info
    </a>
  ) : (
    <Link href={retreat.href} className={ctaClass}>
      More info
    </Link>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 1.0, ease: 'easeOut', delay }}
      className="flex flex-col h-full"
    >
      <div className="relative aspect-[16/15] overflow-hidden bg-dark">
        <img
          src={retreat.image}
          alt={retreat.alt}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        {/* Flush to the corner rather than inset — the photograph's own edge is
            the frame, and a floating chip would need a radius to look right. */}
        <span className="absolute left-0 top-0 bg-dark/85 font-body text-[10px] tracking-[0.22em] uppercase text-cream px-3.5 py-2">
          {retreat.label}
        </span>
      </div>

      <p className="font-body text-[11px] tracking-[0.22em] uppercase text-ink/60 mt-6">
        {retreat.instructor}
      </p>

      <h3 className="font-display font-light text-ink text-2xl lg:text-[1.75rem] leading-[1.15] mt-3">
        {retreat.title}
      </h3>

      <p className="flex items-center gap-2 font-body text-sm text-ink/70 mt-3">
        <CalendarDays aria-hidden className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
        <span>{retreat.dates}</span>
      </p>

      <p className="font-body text-sm text-ink leading-[1.8] mt-4">{retreat.description}</p>

      {/* Pushed to the bottom so the buttons line up across a row whose
          descriptions run to different lengths. */}
      <div className="mt-auto pt-7">{cta}</div>
    </motion.article>
  );
}

export function UpcomingGrid() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="font-display font-light text-ink text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.01em]"
        >
          Upcoming
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 lg:gap-y-20 mt-14 lg:mt-20">
          {RETREATS.map((retreat, i) => (
            <RetreatCard key={retreat.title} retreat={retreat} delay={(i % 3) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
