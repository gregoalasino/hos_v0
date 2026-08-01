'use client';

import { useState, useRef } from 'react';
import Script from 'next/script';
import { motion, Variants, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { SeasonalExperiences } from '@/components/landing/seasonal-experiences';
import { AccommodationsFAQ } from '@/components/accommodations/AccommodationsFAQ';

// ─── Cloudbeds immersive widget ──────────────────────────────────────────────
// Public property embed (same IDs used on the client's current WIX site).
// `zE6Wy8` is the public property/widget id — not a credential. The immersive
// loader script binds a click handler to any element carrying `data-be-url`,
// opening the booking engine as an overlay instead of navigating away.
const CLOUDBEDS_PROPERTY_CODE = 'zE6Wy8';
const CLOUDBEDS_URL = `https://us2.cloudbeds.com/reservation/${CLOUDBEDS_PROPERTY_CODE}`;
const CLOUDBEDS_IMMERSIVE_SRC = `https://us2.cloudbeds.com/widget/load/${CLOUDBEDS_PROPERTY_CODE}/immersive`;

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
              title="Accommodations at House of Shakti"
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
              title="Accommodations at House of Shakti"
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
// Default crop is 4/3 (landscape) rather than a portrait ratio: at two columns
// the card has to fit image + copy inside one viewport, otherwise the guest
// sees a photo and has to scroll to learn which dwelling it belongs to.
// `aspect` stays overridable for layouts that can afford more height.
// ═════════════════════════════════════════════════════════════════════════════
function StayCarousel({
  images,
  alt,
  aspect = 'aspect-[4/3]',
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
// REUSABLE: shared Cloudbeds CTA — editorial underline-link style
// ═════════════════════════════════════════════════════════════════════════════
function CheckAvailabilityLink({ label = 'Check availability', className = 'mt-6' }: { label?: string; className?: string }) {
  // CLOUDBEDS_BOOK_NOW_TRIGGER — the immersive loader script (mounted once in
  // AccommodationsPage) exposes `window.openImmersiveExperiencePopup`, which
  // opens the booking engine as an overlay on top of the page. We keep the
  // anchor's `href` as a graceful fallback: if the widget script hasn't loaded
  // (blocked / offline), the click just follows the link to the reservation
  // page. Middle-click / cmd-click also still open the reservation in a new tab.
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle modified clicks (new tab, etc.) via the href.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const openPopup = window.openImmersiveExperiencePopup;
    if (typeof openPopup === 'function') {
      e.preventDefault();
      openPopup({ propertyCode: CLOUDBEDS_PROPERTY_CODE });
    }
    // else: fall through to the href (new-tab reservation page).
  };

  return (
    <a
      href={CLOUDBEDS_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer ${className}`}
    >
      {label}
    </a>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SUITE CARD — compact card used inside the 2×2 grid
// ═════════════════════════════════════════════════════════════════════════════
type StayData = {
  // Fact line rendered UNDER the title: capacity · layout. Not an eyebrow —
  // the guest should read the dwelling's name before its specs.
  meta: string;
  title: string;
  description: string;
  images: string[];
};

function StayCard({ meta, title, description, images }: StayData) {
  return (
    <article>
      <StayCarousel images={images} alt={title} />

      {/* Typography matched to home Pillars (compact card pattern).
          Vertical rhythm is tighter than the Pillars original: the card must
          read as one unit inside a single viewport, so the copy block stays
          close to the image it describes. */}
      <h3 className="font-display font-light text-ink text-lg lg:text-xl leading-snug mt-5">
        {title}
      </h3>
      <p className="font-body text-xs text-ink mt-2">{meta}</p>
      <p className="font-body text-sm text-ink leading-relaxed mt-3">
        {description}
      </p>

      <CheckAvailabilityLink className="mt-4 lg:mt-5" />
    </article>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAYS GRID — 2×2 desktop, single column mobile.
// The four dwellings, in the order Nancy presents them in the accommodations
// brief. Capacity + layout ride in the fact line under each title.
// ═════════════════════════════════════════════════════════════════════════════
const STAYS: StayData[] = [
  {
    meta: 'Up to 10 guests · Four suites, each with a private bathroom',
    title: 'Main House',
    description:
      'Four spacious suites, each with its own private bathroom, gathered around a shared heart. Room configurations shift to meet each group — triples, doubles, or private queens. Air conditioning in every suite, and Wi-Fi that reaches every corner.',
    // TODO: replace with curated Main House photos
    images: [
      '/images/sanctuary/271A0822_websize%201.webp',
      '/images/sanctuary/271A0828_websize%201.webp',
      '/images/sanctuary/271A0829_websize%201.webp',
      '/images/sanctuary/271A0800_websize%201.webp',
      '/images/sanctuary/271A0660_websize%201.webp',
      '/images/sanctuary/271A0692_websize%201.webp',
    ],
  },
  {
    meta: 'Up to 3 guests · One bedroom, kitchen and terrace',
    title: 'La Casita',
    description:
      'A one-bedroom home set inside the tropical greenery — queen bed, full kitchen, and a terrace that opens onto the jungle. A single bed can be added in the living area. Built for slow mornings and unhurried work.',
    // TODO: replace with curated La Casita photos
    images: [
      '/images/sanctuary/271A0840_websize%201.webp',
      '/images/sanctuary/271A0851_websize%201.webp',
      '/images/sanctuary/271A0870_websize%201.webp',
      '/images/sanctuary/271A0873_websize%201.webp',
      '/images/sanctuary/271A0883_websize%201.webp',
    ],
  },
  {
    meta: 'Up to 2 guests · One bedroom, private bathroom',
    title: 'Jungle Bungalow',
    description:
      'A single room in the heart of the jungle. Queen bed, private bathroom, and a ceiling fan turning through naturally cool air. The most secluded of the four — and the quietest.',
    // TODO: replace with curated Jungle Bungalow photos
    images: [
      '/images/sanctuary/271A0698_websize%201.webp',
      '/images/sanctuary/271A0704_websize%201.webp',
      '/images/sanctuary/271A0719_websize%201.webp',
      '/images/sanctuary/271A0722_websize%201.webp',
    ],
  },
  {
    meta: 'Up to 4 guests · Two bedrooms, two bathrooms',
    title: 'Shakti House',
    description:
      'Two queen bedrooms, two full bathrooms, and a kitchen that makes it a real home. The deck reaches out toward jungle and ocean at once — the widest view on the property.',
    // TODO: replace with curated Shakti House photos
    images: [
      '/images/sanctuary/271A0766_websize%201.webp',
      '/images/sanctuary/271A0778_websize%201.webp',
      '/images/sanctuary/271A0785_websize%201.webp',
      '/images/sanctuary/271A0794_websize%201.webp',
    ],
  },
];

function StaysGrid() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  // No top padding — the intro above already closes with py-20/28. Doubling it
  // pushed the first row out of the fold on laptop viewports.
  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          /* Asymmetric gaps: rows need more breathing room than columns so the
             eye groups each image with its own copy (proximity), not with the
             card sitting below it. */
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-10 gap-y-14 lg:gap-y-20"
        >
          {STAYS.map((stay) => (
            <StayCard key={stay.title} {...stay} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CASITA FEATURE — REMOVED. La Casita is now one of the four dwellings in
// <StaysGrid /> (position 2, per Nancy's accommodations brief), so the
// standalone asymmetric feature row would have duplicated it. The layout
// pattern lives on in the retreats hub if we ever need it back here.
// ═════════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════════
// EVERY STAY INCLUDES
// ═════════════════════════════════════════════════════════════════════════════
const STAY_INTRO =
  'Every accommodation at House of Shakti has been thoughtfully prepared to offer comfort, simplicity, and a deep connection with nature.';

const STAY_INCLUDES = [
  'Daily housekeeping',
  'Fresh towels and premium bed linens',
  'High-speed Wi-Fi',
  'Swimming pool',
  'Access to the yoga shala',
  'Complimentary parking',
  'Personalized support throughout your stay — wellness services, tours, transportation, and local experiences',
  'A serene environment designed for rest and renewal',
];

// Items that carry a fee. Both require booking ahead, which is why the
// reservation note lives in the section label rather than on each line.
const STAY_EXTRAS = [
  'Regular yoga classes, subject to schedule',
  'Sauna and ice bath wellness area',
];

// Surfaced as a closing note: the one exception across the four dwellings.
const STAY_NOTE =
  'Air conditioning is available in all accommodations except the Jungle Bungalow, which is naturally ventilated and equipped with a ceiling fan.';

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
        <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
          Every stay includes
        </h2>

        <p className="font-body text-sm text-ink leading-relaxed max-w-2xl mt-6 mb-16 lg:mb-20">
          {STAY_INTRO}
        </p>

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
            By advance reservation, at extra cost
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

        {/* Closing note */}
        <p className="font-body text-sm text-ink leading-relaxed max-w-2xl mt-16 pt-8 border-t border-ink/10">
          {STAY_NOTE}
        </p>
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
        <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
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
      {/* Cloudbeds immersive booking widget — loads once and exposes
          window.openImmersiveExperiencePopup, which every CheckAvailabilityLink
          calls on click to open the booking engine as an overlay. */}
      <Script src={CLOUDBEDS_IMMERSIVE_SRC} strategy="afterInteractive" />
      <Navigation />
      <AccommodationsHero />
      <AccommodationsIntro />
      <StaysGrid />
      <AllStaysInclude />
      <SeasonalExperiences />
      <AccommodationsFAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
