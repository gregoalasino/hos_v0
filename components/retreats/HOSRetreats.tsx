'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ─── Retreats offering ──────────────────────────────────────────────────────
// Feature blocks in the re:center layout: a full-width eyebrow bar on top,
// then a two-column body — title + description + dark CTA on the left, and a
// row of images on the right.
type RetreatCard = {
  eyebrow: string;
  title: string;
  description: string;
  images: string[];
  href: string;
  ctaLabel: string;
  external: boolean;
};

const CARDS: RetreatCard[] = [
  {
    eyebrow: 'Signature Retreats',
    title: 'Join a Retreat at House of Shakti',
    description:
      'House of Shakti welcomes a variety of retreats led by inspiring facilitators from around the world — offering yoga, breathwork journeys, wellness practices, nature adventures, surf and healing experiences.\n\nA sacred sanctuary in Santa Teresa where practitioners share their vision and guests gather to reconnect, transform and renew.',
    images: [
      '/images/upcoming_retreats/upcoming_retreats.webp',
      '/images/upcoming_retreats/upcoming_retreats_2.webp',
    ],
    // TODO: point at Santi's dedicated "Upcoming Retreats" landing once it ships.
    href: '/upcoming-retreats',
    ctaLabel: 'See upcoming retreats',
    external: false,
  },
  {
    eyebrow: 'Hosted Retreats',
    title: 'Host Your Retreat',
    description:
      'Bring your vision to life at House of Shakti. A private sanctuary in Santa Teresa designed for facilitators creating meaningful experiences. Surrounded by jungle and close to the ocean, our space offers everything needed to host transformational retreats — from yoga and wellness immersions to creative gatherings and conscious journeys.\n\nA place to gather, reconnect, and create experiences that leave a lasting impact.',
    images: [
      '/images/card_host_your_retreat.webp',
      '/images/sanctuary/271A0759_websize%201.webp',
    ],
    href: '/host-your-retreat',
    ctaLabel: 'See more',
    external: false,
  },
  {
    eyebrow: 'Yoga Training',
    title: 'Teacher Training Yoga',
    description:
      'A 100-hour in-person immersion with an optional 100-hour online program, leading to a Yoga Alliance Registered 200-Hour Yoga Teacher Training guided by Nancy Goodfellow. A journey of deep practice, self-discovery, and embodied learning.',
    images: [
      '/images/card_ytt.webp',
      '/images/yoga/IMG_8693%201.webp',
    ],
    href: '/yoga-teacher-training',
    ctaLabel: 'See more',
    external: false,
  },
];

// Small landscape/photo glyph shown inside the eyebrow bar.
function FrameIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="w-4 h-4 text-ink/50 flex-shrink-0"
    >
      <path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1.4 14h13.2l-4.1-5.4-3.1 4-2.2-2.6L5.4 18ZM9 10.2A1.6 1.6 0 1 0 9 7a1.6 1.6 0 0 0 0 3.2Z" />
    </svg>
  );
}

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
    'inline-block bg-dark text-cream font-body text-xs tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-burgundy transition-colors duration-300 mt-10';

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
      {/* Eyebrow bar — full width, subtle gradient, icon + label */}
      <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-ink/[0.05] to-transparent px-5 py-3.5">
        <FrameIcon />
        <span className="font-body text-xs tracking-[0.22em] uppercase text-ink/70">
          {card.eyebrow}
        </span>
      </div>

      {/* Body — text left, images right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14 mt-10 lg:mt-14 items-start">
        {/* Left — title, description, CTA */}
        <div>
          <h3 className="font-display font-light text-ink text-3xl lg:text-4xl leading-[1.05] uppercase">
            {card.title}
          </h3>

          {card.description.split('\n\n').map((para, i) => (
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
            <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <img src={src} alt={card.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function HOSRetreats() {
  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="space-y-20 lg:space-y-28">
          {CARDS.map((card, i) => (
            <RetreatFeatureCard key={card.title} card={card} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
