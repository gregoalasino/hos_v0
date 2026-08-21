'use client';

import { useState, useRef } from 'react';
import { motion, Variants, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { StayLightbox, type StayData } from '@/components/stay-with-us/StayLightbox';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { SeasonalExperiences } from '@/components/landing/seasonal-experiences';
import { AccommodationsFAQ } from '@/components/accommodations/AccommodationsFAQ';
import { CheckAvailabilityLink } from '@/components/accommodations/CheckAvailabilityLink';

// The Cloudbeds immersive loader is mounted once, site-wide, in app/layout.tsx;
// it exposes window.openImmersiveExperiencePopup, which CheckAvailabilityLink calls.

// ─── YouTube placeholder (same as home & yoga heroes) ────────────────────────
const VIDEO_ID_DESKTOP = '90FhvO1AvT8';
const VIDEO_ID_MOBILE = '90FhvO1AvT8'; // TODO: swap when accommodations-specific portrait video lands

const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}` +
  `?autoplay=1&mute=1&loop=1&playlist=${id}` +
  `&controls=0&showinfo=0&modestbranding=1&rel=0` +
  `&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`;

// ─── Word-by-word reveal variants (same easing as home Introduction) ─────────
const headlineContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Reusable word-reveal component ──────────────────────────────────────────
function WordRevealHeading({
  text,
  className,
  as: As = 'h2',
  inView,
}: {
  text: string;
  className: string;
  as?: 'h1' | 'h2' | 'h3';
  inView: boolean;
}) {
  const words = text.split(' ');
  return (
    <motion.div
      variants={headlineContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      <As className="font-display font-light leading-[1.1] tracking-[-0.01em]" aria-label={text}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            aria-hidden
            className="inline-block overflow-hidden align-baseline"
          >
            <motion.span
              variants={headlineWord}
              className="inline-block will-change-transform"
            >
              {word}
              {/* non-breaking space — regular ASCII space gets collapsed by inline-block */}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </As>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// HERO — editorial video, same pattern as home & yoga
// ═════════════════════════════════════════════════════════════════════════════
function AccommodationsHero() {
  return (
    <section className="bg-warm-white">
      {/*
        Hero + navbar together fill exactly 100vh.
        Mobile: full-bleed. Desktop: 80% container with margins.
        mt-* offsets the fixed navbar so the hero sits *below* it.
      */}
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          {/* Desktop / landscape */}
          <div className="absolute inset-0 hidden md:block">
            <iframe
              src={youtubeEmbedUrl(VIDEO_ID_DESKTOP)}
              title="Stay With Us at House of Shakti"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              tabIndex={-1}
              className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                w-[max(100%,177.78vh)] h-[max(100%,56.25vw)] aspect-video border-0
              "
            />
          </div>

          {/* Mobile / portrait — same placeholder until a 9:16 asset lands */}
          <div className="absolute inset-0 md:hidden">
            <iframe
              src={youtubeEmbedUrl(VIDEO_ID_MOBILE)}
              title="Stay With Us at House of Shakti"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              tabIndex={-1}
              className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                w-[max(100%,177.78vh)] h-[max(100%,56.25vw)] aspect-video border-0
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// INTRO — short, scannable orientation (no image)
// Sets the expectation that there are four distinct dwellings
// before the grid below.
// ═════════════════════════════════════════════════════════════════════════════
const INTRO_HEADLINE = 'Four ways to stay.';

function AccommodationsIntro() {
  const textRef = useRef<HTMLDivElement | null>(null);
  const textInView = useInView(textRef, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28 overflow-hidden">
      <div ref={textRef} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-3xl">
          <WordRevealHeading
            text={INTRO_HEADLINE}
            inView={textInView}
            className="text-ink text-4xl md:text-5xl lg:text-6xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={textInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 1.4 }}
            className="font-body text-ink max-w-2xl text-sm leading-[1.7] mt-12 lg:mt-16"
          >
            The Main House gathers four suites around a shared heart. La Casita and
            the Jungle Bungalow sit deeper in the greenery, each standing alone.
            Shakti House opens to jungle and ocean from a single wide deck.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// IMAGE CAROUSEL — Aman Amanjena style: arrows right-aligned, fade between
// images. No dots, no progress bar, no captions.
//
// The photographs are 3:4 portraits, shot and cropped for these cards, so the
// frame is 3:4 too — the guest sees the full picture, never a crop. Only the active image
// and its two neighbours are mounted: four dwellings now carry 32 photographs
// between them (~9MB), and mounting every one would make the page pay for the
// whole gallery on arrival.
// ═════════════════════════════════════════════════════════════════════════════
const ringDist = (a: number, b: number, total: number) =>
  Math.min(Math.abs(a - b), total - Math.abs(a - b));

function StayCarousel({
  images,
  alt,
  onExpand,
  aspect = 'aspect-[3/4]',
}: {
  images: string[];
  alt: string;
  /** Called with the index in view — the card opens its lightbox there. */
  onExpand: (index: number) => void;
  aspect?: string;
}) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);
  const goNext = () => setCurrent((c) => (c + 1) % total);

  return (
    <div>
      {/* Image stack with crossfade. The picture itself opens the expanded
          view — the biggest surface on the card should be the easiest way in.
          It stays out of the tab order: the labelled expand control beside it
          is the same door, so a second stop would just be noise. */}
      <div
        className={`relative ${aspect} overflow-hidden bg-ink/5 cursor-zoom-in`}
        onClick={() => onExpand(current)}
      >
        {images.map((src, i) => {
          if (ringDist(i, current, total) > 1) return null;
          return (
            <motion.img
              key={src}
              src={src}
              alt={`${alt} — view ${i + 1}`}
              loading="lazy"
              draggable={false}
              initial={false}
              animate={{ opacity: i === current ? 1 : 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          );
        })}

        {/* Expand — the re:center idea: one quiet control in the top corner,
            carrying the count so the guest knows there is more than what the
            card shows. Square, per the brand rule. */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onExpand(current);
          }}
          aria-label={`View all ${total} photographs of ${alt}`}
          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-black/45 text-cream backdrop-blur-[2px] pl-2.5 pr-3 h-9 hover:bg-black/70 transition-colors duration-300"
        >
          <Maximize2 className="h-[15px] w-[15px]" strokeWidth={1.5} aria-hidden />
          <span className="font-body text-[12px] leading-none">{total}</span>
        </button>
      </div>

      {/* Arrows aligned right (Amanjena-style) */}
      {total > 1 && (
        <div className="flex justify-end items-center gap-6 mt-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label={`Previous image of ${alt}`}
            className="text-ink hover:opacity-50 transition-opacity duration-300"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={`Next image of ${alt}`}
            className="text-ink hover:opacity-50 transition-opacity duration-300"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUITE CARD — compact card used inside the 2×2 grid. First-glance copy stays
// one breath long; the full story lives in the lightbox, one "Read more" away.
// ═════════════════════════════════════════════════════════════════════════════
function StayCard({
  stay,
  index,
  onExpand,
}: {
  stay: StayData;
  index: number;
  onExpand: (index: number) => void;
}) {
  // Below lg: the stacked card (photo over copy) that phones and tablets
  // already carry well. From lg up: an editorial row — the photograph on one
  // side, the dwelling's story beside it, sides alternating down the page.
  // Each dwelling gets its own moment at full attention instead of competing
  // in a grid, and the copy fills the air that a lone tall photograph used to
  // leave dead. The numeral is the thread that ties the four rows into one
  // sequence.
  return (
    <article className="flex h-full flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-14">
      {/* One column narrower from xl: the container keeps growing with the
          monitor, and at ~1700px a 5/12 photograph is back over 700px tall —
          the very thing this layout replaced. */}
      <div
        className={`lg:col-span-5 xl:col-span-4 ${
          index % 2 === 1 ? 'lg:col-start-8 xl:col-start-9 lg:row-start-1' : ''
        }`}
      >
        <StayCarousel images={stay.images} alt={stay.title} onExpand={onExpand} />
      </div>

      <div
        className={`flex flex-1 flex-col lg:col-span-6 lg:max-w-xl ${
          index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-7 xl:col-start-6'
        }`}
      >
        <p
          aria-hidden
          className="hidden lg:block font-body text-[11px] tracking-[0.3em] text-ink/70"
        >
          {String(index + 1).padStart(2, '0')}
        </p>

        <h3 className="font-display font-light text-ink text-lg lg:text-3xl leading-snug mt-5 lg:mt-4">
          {stay.title}
        </h3>
        <p className="font-body text-xs text-ink mt-2 lg:mt-3">{stay.meta}</p>
        <p className="font-body text-sm text-ink leading-relaxed lg:leading-[1.8] mt-3 lg:mt-6">
          {stay.short}{' '}
          <button
            type="button"
            onClick={() => onExpand(0)}
            className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-60 transition-opacity duration-300"
          >
            Read more
          </button>
        </p>

        <CheckAvailabilityLink className="mt-auto pt-4 lg:mt-0 lg:pt-8 self-start" />
      </div>
    </article>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAYS GRID — 2×2 desktop, single column mobile.
// The four dwellings, in the order Nancy presents them. Capacity + layout ride
// in the fact line under each title; the full description, bed configurations
// and capacity live in the lightbox.
// ═════════════════════════════════════════════════════════════════════════════
const shots = (dir: string, n: number) =>
  Array.from({ length: n }, (_, i) => `/images/stay-with-us/${dir}/${dir}-${i + 1}.webp`);

const STAYS: StayData[] = [
  {
    meta: 'Up to 10 guests · Four suites, each with a private bathroom',
    title: 'Main House Suite',
    short:
      'Four spacious suites gathered around a shared heart, each with its own private bathroom — an elegant, serene base in a refined natural setting.',
    long: [
      'The Main House offers an elegant and serene experience, thoughtfully designed to provide both comfort and privacy within a refined natural setting. It features four spacious suites, each with its own private bathroom.',
      'Fully equipped with air conditioning in every suite and high-speed Wi-Fi throughout, the Main House blends modern comfort with a peaceful atmosphere — the right environment for rest and connection.',
    ],
    facts: {
      label: 'Room configurations may include',
      items: [
        'Triple rooms — 3 single beds',
        'Double rooms — 2 single beds',
        'Private rooms for single occupancy or couples — 1 queen-size bed each',
      ],
    },
    images: shots('main-house', 6),
  },
  {
    meta: 'Up to 3 guests · One bedroom, kitchen and terrace',
    title: 'La Casita',
    short:
      'A one-bedroom home nestled in the tropical greenery — queen bed, full kitchen, and a terrace that opens onto the jungle. Built for slow mornings and unhurried work.',
    long: [
      'A charming and intimate home nestled within lush tropical greenery, offering a peaceful and private escape immersed in nature. Thoughtfully designed for comfort and simplicity, it provides a warm, home-like atmosphere ideal for rest, creativity, and slow living.',
      'The space features one bedroom with a queen-size bed, equipped with air conditioning and ceiling fans for year-round comfort. An additional single bed can be arranged in the living area, allowing for flexible accommodation.',
      'La Casita includes a fully equipped kitchen, a cozy living and workspace, and a beautiful terrace overlooking the jungle — perfect for slow mornings, quiet reflection, or inspired moments of work and creativity.',
    ],
    capacity:
      'Capacity: up to 2 guests without bed sharing, or up to 3 guests with shared accommodation.',
    images: shots('la-casita', 8),
  },
  {
    meta: 'Up to 2 guests · One bedroom, private bathroom',
    title: 'Jungle Bungalow',
    short:
      'A single room in the heart of the jungle. Queen bed, private bathroom, and a ceiling fan turning through naturally cool air. The most secluded of the four — and the quietest.',
    long: [
      'An intimate and secluded bungalow nestled in the heart of the jungle, offering a simple yet deeply grounding experience surrounded by nature.',
      'The bungalow features a queen-size bed, a ceiling fan for gentle natural airflow, and a private bathroom — a comfortable space that keeps a close connection with the surrounding landscape.',
    ],
    capacity:
      'Capacity: 1 guest without bed sharing, or up to 2 guests sharing a queen-size bed.',
    images: shots('jungle-bungalow', 8),
  },
  {
    meta: 'Up to 4 guests · Two bedrooms, two bathrooms',
    title: 'Shakti House',
    short:
      'Two queen bedrooms, two full bathrooms, and a kitchen that makes it a real home. The deck reaches toward jungle and ocean at once — the widest view on the property.',
    long: [
      'A beautifully designed private home that blends comfort, spaciousness, and breathtaking natural surroundings. Perfect for guests seeking a more independent stay while remaining fully connected to the retreat experience.',
      'The house features two peaceful bedrooms with queen-size beds, each equipped with air conditioning and ceiling fans. Two full bathrooms provide additional comfort and privacy.',
      'A fully equipped kitchen and welcoming living area create a true sense of home, while the expansive deck opens to stunning jungle and ocean views — an ideal setting for relaxation, connection, or simply enjoying the beauty of the landscape.',
    ],
    capacity:
      'Capacity: up to 2 guests without bed sharing, or up to 4 guests with shared accommodation.',
    images: shots('shakti-house', 10),
  },
];

function StaysGrid() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  // Which dwelling is expanded, and on which photograph it opened.
  const [expanded, setExpanded] = useState<{ stay: StayData; index: number } | null>(null);

  // No top padding — the intro above already closes with py-20/28. Doubling it
  // pushed the first row out of the fold on laptop viewports.
  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          /* Phones stack, tablets pair. From lg the grid dissolves into
             editorial rows (see StayCard): at two columns on a wide monitor
             each 3:4 photograph ran ~1000px tall with dead air beside it, and
             at four columns no dwelling had any presence at all. One dwelling
             per row, photo and story side by side, gives each its moment —
             and the lightbox still owns the full-size photograph. */
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-14 lg:gap-y-28"
        >
          {STAYS.map((stay, i) => (
            <StayCard
              key={stay.title}
              stay={stay}
              index={i}
              onExpand={(index) => setExpanded({ stay, index })}
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
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CLOSING NARRATIVE — REMOVED in favor of <SeasonalExperiences /> reused from
// the home. The "An ode to the jungle." text + image lived here previously;
// the assets remain in /public so we can revive the block on another page
// if needed.
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function AccommodationsPage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      {/* The Cloudbeds immersive booking widget is mounted site-wide in
          app/layout.tsx; every CheckAvailabilityLink calls the popup it exposes. */}
      <Navigation />
      <AccommodationsHero />
      <AccommodationsIntro />
      <StaysGrid />
      <SeasonalExperiences />
      <AccommodationsFAQ />
      <Footer />
    </main>
  );
}
