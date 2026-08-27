'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// ─── Retreats offering ──────────────────────────────────────────────────────
// Feature blocks in a two-column body — title + description + dark CTA on the
// left, and a row of images on the right.
type RetreatCard = {
  title: string;
  description: string;
  images: string[];
  href: string;
  ctaLabel: string;
  external: boolean;
};

const CARDS: RetreatCard[] = [
  {
    title: 'Join a Retreat at House of Shakti',
    description:
      'House of Shakti welcomes a variety of retreats led by inspiring facilitators from around the world — offering yoga, breathwork journeys, wellness practices, nature adventures, surf and healing experiences.\n\nA sacred sanctuary in Santa Teresa where practitioners share their vision and guests gather to reconnect, transform and renew.',
    images: [
      '/images/upcoming_retreats/upcoming_retreats.webp',
      '/images/upcoming_retreats/upcoming_retreats_2.webp',
    ],
    href: '/upcoming-retreats',
    ctaLabel: 'See upcoming retreats',
    external: false,
  },
  {
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
            <div key={src} className="relative aspect-[4/5] overflow-hidden">
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
