'use client';

import { useState, useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
              title="Suites & casita at House of Shakti"
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
              title="Suites & casita at House of Shakti"
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
// Sets the expectation that there are two distinct dwelling types
// before the two cards below.
// ═════════════════════════════════════════════════════════════════════════════
const INTRO_HEADLINE = 'Two ways to stay.';

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
            Four suites circle a saltwater pool at the heart of the property. La
            Casita rests alone in the jungle — a private one-bedroom retreat, a few
            steps further in. Five rooms in total.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// IMAGE CAROUSEL — Aman Amanjena style: arrows right-aligned, fade between
// images. No dots, no progress bar, no captions.
// `aspect` is overridable so the same component serves the compact grid
// cards (4/5) and the Casita feature row (3/4 or whatever fits).
// ═════════════════════════════════════════════════════════════════════════════
function SuiteCarousel({
  images,
  alt,
  aspect = 'aspect-[4/5]',
}: {
  images: string[];
  alt: string;
  aspect?: string;
}) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);
  const goNext = () => setCurrent((c) => (c + 1) % total);

  return (
    <div>
      {/* Image stack with crossfade */}
      <div className={`relative ${aspect} overflow-hidden bg-ink/5`}>
        {images.map((src, i) => (
          <motion.img
            key={src}
            src={src}
            alt={`${alt} — view ${i + 1}`}
            initial={false}
            animate={{ opacity: i === current ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}
      </div>

      {/* Arrows aligned right (Amanjena-style) */}
      {total > 1 && (
        <div className="flex justify-end items-center gap-6 mt-3">
          <button
            type="button"
            onClick={goPrev}
            aria-label={`Previous image of ${alt}`}
            className="text-ink hover:opacity-50 transition-opacity duration-300 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={`Next image of ${alt}`}
            className="text-ink hover:opacity-50 transition-opacity duration-300 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUITE CARD — compact card used inside the 2×2 grid
// ═════════════════════════════════════════════════════════════════════════════
type SuiteData = {
  eyebrow: string;
  title: string;
  description: string;
  images: string[];
};

function SuiteCard({ eyebrow, title, description, images }: SuiteData) {
  return (
    <article>
      <SuiteCarousel images={images} alt={title} aspect="aspect-[4/5]" />

      {/* Typography matched to home Pillars (compact card pattern) */}
      <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink mt-6">
        {eyebrow}
      </p>
      <h3 className="font-display font-light text-ink text-lg lg:text-xl leading-snug mt-3 lg:mt-4">
        {title}
      </h3>
      <p className="font-body text-sm text-ink leading-relaxed mt-3 lg:mt-4">
        {description}
      </p>

      <CheckAvailabilityLink className="mt-6 lg:mt-8" />
    </article>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUITES GRID — 2×2 desktop, single column mobile
// ═════════════════════════════════════════════════════════════════════════════
const SUITES: SuiteData[] = [
  {
    eyebrow: 'Suite',
    title: 'The Pool Suite',
    description:
      'A king bed and pool-facing windows. Mornings open to the saltwater pool and the slow rhythm of the gardens beyond.',
    // TODO: replace with curated photos of this specific suite
    images: [
      '/images/sanctuary/271A0822_websize%201.webp',
      '/images/sanctuary/271A0828_websize%201.webp',
      '/images/sanctuary/271A0829_websize%201.webp',
      '/images/sanctuary/271A0800_websize%201.webp',
    ],
  },
  {
    eyebrow: 'Suite',
    title: 'The Garden Suite',
    description:
      'Twin beds with garden views and dappled morning light. A few steps from the shared kitchen and the fire feature.',
    // TODO: replace with curated photos of this specific suite
    images: [
      '/images/sanctuary/271A0660_websize%201.webp',
      '/images/sanctuary/271A0668_websize%201.webp',
      '/images/sanctuary/271A0692_websize%201.webp',
      '/images/sanctuary/271A0676_websize%201.webp',
    ],
  },
  {
    eyebrow: 'Suite',
    title: 'The Canopy Suite',
    description:
      'King bed, bay window nook. Suspended at canopy level — the jungle wakes up just outside the glass.',
    // TODO: replace with curated photos of this specific suite
    images: [
      '/images/sanctuary/271A0698_websize%201.webp',
      '/images/sanctuary/271A0704_websize%201.webp',
      '/images/sanctuary/271A0719_websize%201.webp',
      '/images/sanctuary/271A0722_websize%201.webp',
    ],
  },
  {
    eyebrow: 'Suite',
    title: 'The Sunset Suite',
    description:
      'Twin beds with late light. Soft afternoon sun crosses the bay window, long shadows reach the deck.',
    // TODO: replace with curated photos of this specific suite
    images: [
      '/images/sanctuary/271A0766_websize%201.webp',
      '/images/sanctuary/271A0778_websize%201.webp',
      '/images/sanctuary/271A0785_websize%201.webp',
      '/images/sanctuary/271A0794_websize%201.webp',
    ],
  },
];

function SuitesGrid() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {SUITES.map((suite) => (
            <SuiteCard key={suite.title} {...suite} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CASITA FEATURE — full-width asymmetric row, distinct from the 4 suites
// Image LEFT (5/12), text RIGHT (7/12) on desktop. Stacked on mobile.
// ═════════════════════════════════════════════════════════════════════════════
const CASITA: SuiteData = {
  eyebrow: 'Casita',
  title: 'La Casita',
  description:
    "A standalone one-bedroom retreat tucked deeper into the jungle. Queen bed, full kitchen, and a private deck where monkeys and tropical birds keep their own schedule. La Casita asks for more solitude — and rewards it.",
  // TODO: replace with curated casita-specific photos when available
  images: [
    '/images/sanctuary/271A0840_websize%201.webp',
    '/images/sanctuary/271A0851_websize%201.webp',
    '/images/sanctuary/271A0870_websize%201.webp',
    '/images/sanctuary/271A0873_websize%201.webp',
    '/images/sanctuary/271A0883_websize%201.webp',
  ],
};

function CasitaFeature() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-center"
        >
          {/* Image — LEFT */}
          <div>
            <SuiteCarousel
              images={CASITA.images}
              alt={CASITA.title}
              aspect="aspect-[4/5]"
            />
          </div>

          {/* Text — RIGHT (typography matched to home HostYourRetreat) */}
          <div className="lg:pl-4">
            <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink">
              {CASITA.eyebrow}
            </p>
            <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-tight mt-3">
              {CASITA.title}
            </h3>
            <p className="font-body text-sm text-ink leading-relaxed mt-4 max-w-xl">
              {CASITA.description}
            </p>

            <CheckAvailabilityLink className="mt-6" />
          </div>
        </motion.article>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ALL STAYS INCLUDE
// ═════════════════════════════════════════════════════════════════════════════
const STAY_INCLUDES = [
  'Access to the saltwater pool',
  'Daily yoga at the shala',
  'Shared kitchen and dining',
  'Fire feature and chill area',
  'WiFi throughout the property',
  'Workspace in every room',
];

const STAY_EXTRAS = [
  '8-person sauna over the jungle',
  'Cold plunge',
  'Private yoga sessions',
];

function AllStaysInclude() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="w-[90%] md:w-[80%] max-w-5xl mx-auto"
      >
        <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mb-16 lg:mb-20">
          All stays include
        </h2>

        {/* Included list */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {STAY_INCLUDES.map((item) => (
            <li key={item} className="flex items-baseline gap-3">
              <span aria-hidden className="font-body text-sm text-ink select-none">—</span>
              <span className="font-body text-sm text-ink leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        {/* Extras */}
        <div className="mt-16">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink mb-6">
            Available at extra cost
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {STAY_EXTRAS.map((item) => (
              <li key={item} className="flex items-baseline gap-3">
                <span aria-hidden className="font-body text-sm text-ink select-none">—</span>
                <span className="font-body text-sm text-ink leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
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
// FINAL CTA
// ═════════════════════════════════════════════════════════════════════════════
function FinalCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="w-[90%] md:w-[80%] max-w-3xl mx-auto text-center"
      >
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">
          Reserve your stay
        </p>
        <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mt-6">
          When would you like to arrive?
        </h2>

        <CheckAvailabilityLink className="mt-10" />
      </motion.div>
    </section>
  );
}

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
      <SuitesGrid />
      <CasitaFeature />
      <AllStaysInclude />
      <SeasonalExperiences />
      <AccommodationsFAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
