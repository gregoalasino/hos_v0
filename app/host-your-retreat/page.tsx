'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, Variants, useInView } from 'framer-motion';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { QuoteBreak } from '@/components/landing/QuoteBreak';

// ═════════════════════════════════════════════════════════════════════════════
// Host your retreat — landing built from the client's "Host your retreat in
// paradise" deck. Mirrors the editorial patterns already used across the site
// (ShaktiHero framing, accommodations cards, ShaktiIncluded lists, closing CTA).
// TODO: swap placeholder photography for host/retreat-specific images when ready.
// ═════════════════════════════════════════════════════════════════════════════

const CONTACT_EMAIL = 'houseofshaktiretreats@outlook.es';
const CONTACT_PHONE = '+506 8560 5115';
const CONTACT_PHONE_HREF = 'tel:+50685605115';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const HERO_IMAGE = '/images/sanctuary/271A0642_websize%201.webp';
const heroMeta = ['Santa Teresa, Costa Rica', 'The whole sanctuary', 'Tailored to your group'];

function HostHero() {
  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div className="relative overflow-hidden bg-dark h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]">
          <img
            src={HERO_IMAGE}
            alt="House of Shakti sanctuary in Santa Teresa"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/25 to-dark/10" />

          <div className="absolute inset-0 flex items-end">
            <div className="w-[85%] md:w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
                className="font-body text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-cream/80"
              >
                For Teachers &amp; Hosts
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.12 }}
                className="font-display font-light text-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.01em] mt-5 md:mt-6 max-w-4xl"
              >
                Host your retreat in paradise
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.28 }}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-7 md:mt-8"
              >
                {heroMeta.map((item, i) => (
                  <span key={item} className="flex items-center gap-4">
                    {i > 0 && <span aria-hidden className="hidden sm:inline-block h-3 w-px bg-cream/40" />}
                    <span className="font-body text-xs md:text-sm text-cream/85">{item}</span>
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
                className="mt-9 md:mt-10"
              >
                <Link
                  href="/contact"
                  className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300"
                >
                  Request a quote
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WELCOME / INTRO ───────────────────────────────────────────────────────────
function HostIntro() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28 overflow-hidden">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto max-w-4xl">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy mb-8"
        >
          Welcome
        </motion.p>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="font-display font-light text-ink text-3xl md:text-5xl leading-[1.1] tracking-[-0.01em]"
        >
          A sanctuary to hold your gathering.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          className="font-body text-sm text-ink leading-[1.9] mt-10 lg:mt-12 max-w-2xl"
        >
          Welcome to the Sanctuary House of Shakti — a tranquil and luxurious haven nestled
          in the heart of nature, designed to inspire connection, transformation, and
          rejuvenation. Tucked away on a serene hilltop, this intimate location offers complete
          privacy and breathtaking jungle views, just a five-minute drive from Playa Hermosa,
          Santa Teresa — one of the best surf spots and most beautiful beaches in Costa Rica.
          Whether you&apos;re leading a wellness workshop, a creative getaway, or a spiritual
          journey, our sanctuary caters to your every need, creating an unforgettable experience
          for you and your guests.
        </motion.p>
      </div>
    </section>
  );
}

// ─── ACCOMMODATIONS ────────────────────────────────────────────────────────────
type Stay = {
  eyebrow: string;
  title: string;
  description: string;
  capacity: string;
  image: string;
};

const STAYS: Stay[] = [
  {
    eyebrow: 'Main House',
    title: 'Four suites, one house',
    description:
      'An elegant, serene living experience with four spacious suites, each with a private bathroom, thoughtfully configurable for each retreat. Air conditioning in every suite and high-speed Wi-Fi throughout.',
    capacity: 'Up to 10 guests without bed sharing',
    image: '/images/sanctuary/271A0698_websize%201.webp',
  },
  {
    eyebrow: 'La Casita',
    title: 'A private jungle retreat',
    description:
      'A charming, intimate house nestled in lush greenery. One bedroom with a queen bed, air conditioning and fans, a fully equipped kitchen, a cozy living/workspace, and a terrace over the jungle — perfect for slow mornings and inspired work.',
    capacity: 'Up to 2 guests · 3 with shared accommodation',
    image: '/images/sanctuary/271A0840_websize%201.webp',
  },
  {
    eyebrow: 'Jungle Bungalow',
    title: 'Immersed in the green',
    description:
      'An intimate, secluded bungalow surrounded by jungle — a simple, deeply grounding stay. A queen bed with a fan, serene views of the surrounding greenery, and a private bathroom.',
    capacity: '1 guest · up to 2 sharing a bed',
    image: '/images/sanctuary/271A0722_websize%201.webp',
  },
  {
    eyebrow: 'Shakti House',
    title: 'An independent residence',
    description:
      'A beautifully designed private residence blending comfort and space. Two bedrooms with queen beds (AC and fans), two bathrooms, a full kitchen, and an expansive deck opening to jungle and ocean views.',
    capacity: 'Up to 2 guests · 4 with shared accommodation',
    image: '/images/sanctuary/271A0778_websize%201.webp',
  },
];

function StayCard({ stay }: { stay: Stay }) {
  return (
    <article>
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={stay.image} alt={stay.title} className="w-full h-full object-cover" />
      </div>
      <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-burgundy mt-6">
        {stay.eyebrow}
      </p>
      <h3 className="font-display font-light text-ink text-lg lg:text-xl leading-snug mt-3">
        {stay.title}
      </h3>
      <p className="font-body text-sm text-ink leading-relaxed mt-3">{stay.description}</p>
      <p className="font-body text-xs italic text-ink/80 mt-4">{stay.capacity}</p>
    </article>
  );
}

function HostAccommodations() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="mb-16 lg:mb-20 max-w-2xl"
        >
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">Accommodations</p>
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mt-4">
            A variety of ways to stay
          </h2>
          <p className="font-body text-sm text-ink leading-relaxed mt-6">
            Our property offers a range of lodging options to suit your group&apos;s size and
            preferences — from the four-suite Main House to private jungle dwellings.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {STAYS.map((stay) => (
            <StayCard key={stay.title} stay={stay} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── COMMON AREAS ──────────────────────────────────────────────────────────────
const COMMON_AREAS = ['Saltwater pool', 'Yoga shala', 'Sauna', 'Ice bath', 'Bonfire'];

function HostCommonAreas() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="relative aspect-[4/5] overflow-hidden order-1 lg:order-none"
          >
            <img
              src="/images/contrast_therapy/IMG_7067%201.webp"
              alt="Common areas at House of Shakti"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="mt-12 lg:mt-0">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">Common Areas</p>
            <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-4">
              Shared spaces for the group
            </h2>
            <ul className="mt-10 space-y-4">
              {COMMON_AREAS.map((area, i) => (
                <motion.li
                  key={area}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 + i * 0.08 }}
                  className="flex items-baseline gap-4 border-b border-ink/10 pb-4"
                >
                  <span aria-hidden className="font-body text-sm text-ink select-none">—</span>
                  <span className="font-body text-base text-ink leading-relaxed">{area}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ACTIVITIES (on-site + off-site) ────────────────────────────────────────────
const ON_SITE = [
  ['Sauna sessions', 'Detox and relax in our serene, private sauna.'],
  ['Cold plunge therapy', 'Revitalize with an invigorating cold plunge.'],
  ['Yoga classes', "Tailored to your group's level and intentions."],
  ['Breathwork', 'Explore the power of conscious breathing.'],
  ['Sound healing', 'A soothing, meditative journey.'],
  ['Massage therapy', 'Restorative massages by skilled therapists.'],
  ['Fire ceremony', 'Connect deeply with nature through a sacred ritual.'],
  ['Private chef', 'Gourmet meals by our local chef — 2–3 meals a day, customizable.'],
];

const OFF_SITE = [
  ['Surf lessons', "Learn at one of the world's premier surf destinations."],
  ['Horseback riding', 'Explore stunning beaches and trails on horseback.'],
  ['Jungle photoshoot', 'Capture unforgettable moments in the lush jungle.'],
  ['ATV tours', 'Thrilling rides through scenic trails.'],
  ['Waterfall hikes', "Experience Costa Rica's breathtaking waterfalls."],
  ['Boat trips', 'Dolphin and whale watching, or fishing.'],
];

function ActivityColumn({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: string[][];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="mb-10"
      >
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/60">{eyebrow}</p>
        <h3 className="font-display font-light text-cream text-2xl md:text-3xl leading-tight mt-4">
          {title}
        </h3>
        <p className="font-body text-sm text-cream/70 leading-relaxed mt-4 max-w-md">{intro}</p>
      </motion.div>

      <ul className="space-y-5">
        {items.map(([name, desc], i) => (
          <motion.li
            key={name}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 + i * 0.06 }}
            className="border-t border-cream/15 pt-4"
          >
            <p className="font-body text-sm text-cream">{name}</p>
            <p className="font-body text-xs text-cream/60 leading-relaxed mt-1">{desc}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function HostActivities() {
  return (
    <section data-surface="dark" className="bg-dark py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <ActivityColumn
          eyebrow="On-site"
          title="Rituals within the walls"
          intro="Enhance your retreat with rejuvenating and transformational on-site experiences."
          items={ON_SITE}
        />
        <ActivityColumn
          eyebrow="Off-site"
          title="Adventures beyond"
          intro="Discover the beauty of the surrounding area — our team helps coordinate and personalize each one."
          items={OFF_SITE}
        />
      </div>
    </section>
  );
}

// ─── WHY SANTA TERESA ───────────────────────────────────────────────────────────
function HostWhySantaTeresa() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">The Location</p>
            <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-4">
              Why Santa Teresa
            </h2>
            <p className="font-body text-sm text-ink leading-[1.9] mt-8 max-w-xl">
              Santa Teresa blends natural beauty with a thriving, conscious community. Known for its
              pristine beaches, world-class surf breaks, and lush jungle, it offers a unique escape for
              relaxation, adventure, and transformation. Beyond the scenery, the town is home to local
              artisans, wellness enthusiasts, and global travelers — yoga studios, organic eateries, live
              music, and markets. Whether you seek soulful connection, outdoor adventure, or quiet moments
              in nature, Santa Teresa is the ideal setting for your retreat.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="relative aspect-[4/5] overflow-hidden mt-12 lg:mt-0"
          >
            <img
              src="/images/yoga/NE8A7702%201.webp"
              alt="Santa Teresa, Costa Rica"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── WHO WE ARE ─────────────────────────────────────────────────────────────────
function HostWhoWeAre() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
        >
          Who We Are
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
          className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-6"
        >
          Guided by Nancy Goodfellow
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          className="font-body text-sm text-ink leading-[1.9] mt-8"
        >
          Nancy Goodfellow is the creator of House of Shakti — a teacher of Tantra Vinyasa Yoga
          known for her deep, intuitive, and transformative approach, and the guide of our 200-hour
          Yoga Teacher Training. At House of Shakti, we believe true wellness comes from the integration
          of mind, body, and spirit. Our purpose is to support growth and reconnection, creating spaces
          where practice becomes a path of self-discovery, presence, and transformation.
        </motion.p>
      </div>
    </section>
  );
}

// ─── CLOSING CTA / REQUEST A QUOTE ──────────────────────────────────────────────
function HostClosingCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto">
        <div data-surface="dark" className="relative overflow-hidden bg-dark min-h-[70vh] flex items-center justify-center">
          <img
            src="/images/sanctuary/271A0759_websize%201.webp"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-dark/60" />

          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="relative w-[85%] max-w-2xl mx-auto text-center py-24"
          >
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/70">
              Request a quote
            </p>
            <h2 className="font-display font-light text-cream text-3xl md:text-5xl leading-[1.2] mt-6">
              Elevate your retreat at the sanctuary.
            </h2>
            <p className="font-body text-sm md:text-base text-cream/85 leading-[1.8] mt-6">
              Prices depend on your dates, group size, and the services you choose. Tell us your
              vision and we&apos;ll help you create something truly special.
            </p>

            <div className="mt-10 flex flex-col items-center gap-5">
              <Link
                href="/contact"
                className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300"
              >
                Start the conversation
              </Link>
              <div className="font-body text-xs md:text-sm text-cream/75 space-y-1">
                <p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-cream underline underline-offset-4 decoration-[0.5px]">
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p>
                  <a href={CONTACT_PHONE_HREF} className="hover:text-cream">
                    {CONTACT_PHONE}
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function HostYourRetreatPage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <HostHero />
      <HostIntro />
      <HostAccommodations />
      <HostCommonAreas />
      <QuoteBreak
        image="/images/yoga/IMG_8669%201.webp"
        quote="We provide the space, the rhythm, and the team — you bring the practice."
        author="House of Shakti"
        role="Santa Teresa, Costa Rica"
      />
      <HostActivities />
      <HostWhySantaTeresa />
      <HostWhoWeAre />
      <HostClosingCTA />
      <Footer />
    </main>
  );
}
