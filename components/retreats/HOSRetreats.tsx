'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ─── Confirmed 2026 schedule ────────────────────────────────────────────────
// Source: "SCHEDULE RETIROS CONFIRMADOS - 2026" (Nancy). Ordered by start
// date, nearest first — that ordering IS the content here, so keep it when
// adding or removing entries.
//
// `href` points at wherever a guest can actually hold their place: our own
// landing when we have one, the facilitator's page when they run their own
// booking, WhatsApp when neither exists yet.
type ScheduledRetreat = {
  // One fact line rendered UNDER the title: dates · format · facilitator.
  // Deliberately not an eyebrow above the heading — the reader should know
  // what the thing is called before being handed its details.
  meta: string;
  title: string;
  description: string;
  image: string;
  href: string;
  external: boolean;   // external hrefs open in a new tab
  ctaLabel: string;
};

const HOS_WHATSAPP = 'https://wa.me/50688365115';
const NANCY_WHATSAPP = 'https://wa.me/50684904626';

const SCHEDULE: ScheduledRetreat[] = [
  {
    title: 'Shakti Sadhana',
    meta: 'July 18 – 24 · Retreat · Guided by Nancy Goodfellow',
    description:
      'An invitation to return to the source of your vital energy. A space of pause, listening, and conscious practice — where the body becomes sacred territory, and Shakti the creative, intuitive, transformative force that moves through it.',
    // TODO: replace with retreat-specific photography
    image: '/images/yoga/IMG_8669%201.webp',
    href: '/retreats/shakti-sadhana',
    external: false,
    ctaLabel: 'View retreat',
  },
  {
    title: 'Consciencia Elemental',
    meta: 'August 16 – 22 · Retreat · Guided by Clara Abad',
    // Translated from the Spanish original in Nancy's schedule.
    description:
      'A seven-day immersion in the Costa Rican jungle to awaken awareness of the four elements and activate the creative body, in the Year of the Magician.',
    // TODO: replace with retreat-specific photography
    image: '/images/sanctuary/271A0870_websize%201.webp',
    href: 'https://landings.unpocomasclara.com/retiro-consciencia-elemental-9381',
    external: true,
    ctaLabel: 'Reserve your place',
  },
  {
    title: 'Sol for Soul',
    meta: 'September 6 – 12 · Retreat · Guided by Elly Miles',
    // Adapted from Elly's own copy (originally first-person, lowercase).
    description:
      'A portal into yourself, held in a container that feels light, supportive, and fun. Santa Teresa is home for Elly — the week is built around the way this place naturally invites you to open up and come alive.',
    // TODO: replace with retreat-specific photography
    image: '/images/yoga/IMG_7491%201.webp',
    href: 'https://www.ellymiles.com/costaricaseptember',
    external: true,
    ctaLabel: 'Reserve your place',
  },
  {
    title: 'The Awakened Body: A Tantric Yoga Intensive',
    meta: 'November 21 – December 4 · 100-hour training · Guided by Nancy Goodfellow',
    description:
      'A transformational immersion for those who wish to deepen their relationship with yoga beyond the physical practice. One hundred hours along the embodied path of Tantra — movement, breath, ritual, nervous system regulation, conscious connection, and self-inquiry.',
    // TODO: replace with training-specific photography
    image: '/images/yoga/NE8A7854%201.webp',
    href: NANCY_WHATSAPP,
    external: true,
    ctaLabel: 'Enquire on WhatsApp',
  },
  {
    title: '50h Restorative + Yin Training',
    meta: 'December 5 – 12 · 50-hour training · Guided by Sam Bianchini',
    // TODO: Nancy's schedule leaves this row's description, contact and
    // landing blank. Copy below is a placeholder written from the title —
    // replace once Sam sends the real description, and point `href` at the
    // proper booking link if one exists.
    description:
      'Fifty hours in the slower half of the practice — restorative shapes, long-held yin, and the craft of holding space for rest.',
    // TODO: replace with training-specific photography
    image: '/images/yoga/IMG_7538%201.webp',
    href: HOS_WHATSAPP,
    external: true,
    ctaLabel: 'Enquire on WhatsApp',
  },
];

function ScheduledRetreatCard({
  retreat,
  reverse,
  delay,
}: {
  retreat: ScheduledRetreat;
  reverse: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const ctaClass =
    'inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer mt-8';

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
      {/* Image — fixed aspect so every row renders the same height */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={retreat.image}
          alt={retreat.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text — typography matches home HostYourRetreat (feature row) */}
      <div className={reverse ? 'lg:pr-4' : 'lg:pl-4'}>
        <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-tight">
          {retreat.title}
        </h3>

        {/* Fact line under the title — dates, format, facilitator */}
        <p className="font-body text-xs text-ink mt-3">{retreat.meta}</p>

        <p className="font-body text-sm text-ink leading-relaxed mt-5 max-w-xl">
          {retreat.description}
        </p>

        {retreat.external ? (
          <a
            href={retreat.href}
            target="_blank"
            rel="noopener noreferrer"
            className={ctaClass}
          >
            {retreat.ctaLabel}
          </a>
        ) : (
          <Link href={retreat.href} className={ctaClass}>
            {retreat.ctaLabel}
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export function HOSRetreats() {
  // No section header and no top padding: <RetreatsIntroduction /> above
  // already frames this list, and doubling the heading + padding pushed the
  // first retreat well below the fold.
  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="space-y-20 lg:space-y-28">
          {SCHEDULE.map((retreat, i) => (
            <ScheduledRetreatCard
              key={retreat.title}
              retreat={retreat}
              reverse={i % 2 === 1}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
