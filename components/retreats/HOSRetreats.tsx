'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMessages } from 'next-intl';
import { Link } from '@/i18n/navigation';

// ─── Retreats offering ──────────────────────────────────────────────────────
// Feature blocks in a two-column body — title + description + dark CTA on the
// left, and a row of images on the right. Titles, paragraphs and button
// labels live in the catalogue under retreats.cards, keyed by `id`.
type RetreatCard = {
  title: string;
  paragraphs: string[];
  images: string[];
  href: string;
  ctaLabel: string;
  external: boolean;
};

const CARDS = [
  {
    id: 'join',
    images: [
      '/images/upcoming_retreats/upcoming_retreats.webp',
      '/images/upcoming_retreats/upcoming_retreats_2.webp',
    ],
    href: '/upcoming-retreats',
    external: false,
  },
  {
    id: 'host',
    images: [
      '/images/card_host_your_retreat.webp',
      '/images/sanctuary/271A0759_websize%201.webp',
    ],
    href: '/host-your-retreat',
    external: false,
  },
  {
    id: 'ytt',
    images: [
      '/images/card_ytt.webp',
      '/images/yoga/IMG_8693%201.webp',
    ],
    href: '/yoga-teacher-training',
    external: false,
  },
] as const;

function RetreatFeatureCard({
  card,
  delay,
}: {
  card: RetreatCard;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const buttonClass =
    'inline-block bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300 mt-10';

  const cta = card.external ? (
    <a href={card.href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
      {card.ctaLabel}
    </a>
  ) : (
    <Link href={card.href} className={buttonClass}>
      {card.ctaLabel}
    </Link>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 1.0, ease: 'easeOut', delay }}
    >
      {/* Body — text left, images right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 items-start">
        {/* Left — title, description, CTA */}
        <div>
          <h3 className="font-display font-light text-ink text-3xl lg:text-4xl leading-[1.05] uppercase">
            {card.title}
          </h3>

          {card.paragraphs.map((para, i) => (
            <p key={i} className="font-body text-sm text-ink leading-[1.8] mt-6 max-w-md">
              {para}
            </p>
          ))}

          {cta}
        </div>

        {/* Right — images sized to a single column so a lone image matches the
            dimensions of each photo in the two-image cards (not stretched). */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          {card.images.map((src) => (
            <div key={src} className="relative aspect-[4/5] overflow-hidden">
              <img src={src} alt={card.title} className="w-full h-full object-cover"
  loading="lazy"
  decoding="async"
/>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function HOSRetreats() {
  const copy = useMessages().retreats.cards;
  const cards: RetreatCard[] = CARDS.map((card) => ({
    ...card,
    images: [...card.images],
    title: copy[card.id].title,
    paragraphs: copy[card.id].paragraphs,
    ctaLabel: copy[card.id].cta,
  }));

  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="space-y-20 lg:space-y-28">
          {cards.map((card, i) => (
            <RetreatFeatureCard key={card.href} card={card} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
