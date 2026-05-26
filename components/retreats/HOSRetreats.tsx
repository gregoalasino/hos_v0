'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

type HOSRetreat = {
  eyebrow: string;
  title: string;
  description: string;
  details: string[];   // small list of what's included
  guidedBy: string;    // teacher / host name
  image: string;
  href: string;
};

// Hardcoded — two HOS-curated retreats.
// TODO: replace placeholder copy, details and teacher names with the
// final ones once Nancy confirms.
const RETREATS: HOSRetreat[] = [
  {
    eyebrow: 'Upcoming · July 18',
    title: 'Shakti Sadhana',
    description:
      'A space of pause, listening, and conscious practice. The body becomes sacred territory — Shakti the creative force that moves through it.',
    details: [
      '4 days · 3 nights',
      'Daily yoga and meditation',
      'All meals included',
      'Ice bath & sauna access',
      'One guided jungle excursion',
    ],
    guidedBy: 'Guided by Luna Hernández',
    image: '/images/yoga/IMG_8669%201.webp',
    href: '/contact',
  },
  {
    eyebrow: 'Signature',
    title: 'The Shakti Experience',
    description:
      'A return to the place that has always been yours: the body. Away from the noise — a landing, not toward a better self, but the most authentic one.',
    details: [
      '5 days · 4 nights',
      'Twice-daily practice',
      'All meals included',
      'Private accommodation',
      'Personal session with the guide',
    ],
    guidedBy: 'Guided by Ana Patricia Rivas',
    image: '/images/yoga/IMG_5608%201.webp',
    href: '/contact',
  },
];

function HOSRetreatCard({
  retreat,
  reverse,
  delay,
}: {
  retreat: HOSRetreat;
  reverse: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 1.0, ease: 'easeOut', delay }}
      className={`
        grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center
        ${reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}
      `}
    >
      {/* Image — fixed aspect so both cards render the same height */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={retreat.image}
          alt={retreat.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text — typography matches home HostYourRetreat (feature row) */}
      <div className={reverse ? 'lg:pr-4' : 'lg:pl-4'}>
        <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink">
          {retreat.eyebrow}
        </p>

        <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-tight mt-3">
          {retreat.title}
        </h3>

        <p className="font-body text-sm text-ink leading-relaxed mt-4 max-w-xl">
          {retreat.description}
        </p>

        {/* Details list — em-dash bullets, same pattern as accommodations "All stays include" */}
        <ul className="mt-6 space-y-2 max-w-md">
          {retreat.details.map((detail) => (
            <li key={detail} className="flex items-baseline gap-3">
              <span aria-hidden className="font-body text-sm text-ink select-none">
                —
              </span>
              <span className="font-body text-sm text-ink leading-relaxed">{detail}</span>
            </li>
          ))}
        </ul>

        {/* Subtle teacher attribution */}
        <p className="font-body text-xs italic text-ink mt-6">{retreat.guidedBy}</p>

        <Link
          href={retreat.href}
          className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer mt-6"
        >
          Inquire
        </Link>
      </div>
    </motion.article>
  );
}

export function HOSRetreats() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="mb-16 lg:mb-20"
        >
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">
            Our Offerings
          </p>
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mt-4">
            Retreats at House of Shakti
          </h2>
        </motion.div>

        {/* Cards stack — generous breathing between */}
        <div className="space-y-24 lg:space-y-32">
          {RETREATS.map((retreat, i) => (
            <HOSRetreatCard
              key={retreat.title}
              retreat={retreat}
              reverse={i % 2 === 1}
              delay={i * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
