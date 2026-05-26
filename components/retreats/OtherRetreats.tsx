'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

type OtherRetreat = {
  eyebrow: string;
  title: string;
  hostedBy: string;     // host attribution shown under the title
  description: string;
  image: string;
  href: string;
};

// TODO: replace with host-specific photography when curated photos exist.
// TODO: confirm host names for "Within" and the VyB Yoga retreats.
const RETREATS: OtherRetreat[] = [
  {
    // en-dash between dates (U+2013) · middle dot (U+00B7) before HOSTED
    eyebrow: '14 – 20 June · Hosted',
    title: 'Reset. Reconnect. Radiate.',
    hostedBy: 'with Federica Donato & Valentina Angeli',
    description:
      'An immersive experience blending nervous system regulation, breathwork, somatic practices, and family constellations.',
    image: '/images/yoga/IMG_8664%201.webp',
    href: 'https://wa.link/d7znpx',
  },
  {
    eyebrow: '25 – 28 June · Hosted',
    title: 'Within',
    hostedBy: 'with Daniel Park', // TODO: confirm host name
    description:
      'An encounter with our human nature, guided by the medicine of mushrooms and practices that help us reconnect. A therapeutic and medicinal approach in a supported environment.',
    image: '/images/contrast_therapy/IMG_7340%201.webp',
    href: 'https://wa.link/jovqui',
  },
  {
    eyebrow: '14 – 15 July · Hosted',
    title: 'VyB yoga, meditation & pranayam',
    hostedBy: 'with the VyB Yoga collective', // TODO: confirm host name(s)
    description:
      'A two-day immersive program integrating VyByoga, pranayama and meditation — blending ancient yogic wisdom with modern insights into breath, nervous system, and embodied vibration.',
    image: '/images/yoga/IMG_7494%201.webp',
    href: 'https://wa.me/50688365115',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function OtherRetreats() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="mb-16 lg:mb-20"
        >
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">
            Hosted Experiences
          </p>
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mt-4">
            Other retreats in our home
          </h2>
          <p className="font-body text-sm text-ink leading-relaxed mt-6 max-w-md">
            Independent teachers bring their work to our space throughout the year.
            These are some of what&apos;s currently scheduled.
          </p>
        </motion.div>

        {/* Pillars-style grid — copy of home Pillars sizing */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8 lg:gap-10"
        >
          {RETREATS.map((retreat) => (
            <motion.article key={retreat.title} variants={itemVariants}>
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={retreat.image}
                  alt={retreat.title}
                  className="w-full h-full object-cover transition-transform duration-[800ms] ease-out hover:scale-[1.02]"
                />
              </div>

              {/* Text — typography matches home Pillars */}
              <div className="mt-6 lg:mt-8">
                <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink">
                  {retreat.eyebrow}
                </p>
                <h3 className="font-display font-light text-ink text-lg lg:text-xl leading-snug mt-3 lg:mt-4">
                  {retreat.title}
                </h3>
                {/* Host attribution — sits between title and description, italicized to read as a sub-line */}
                <p className="font-body text-xs italic text-ink mt-2">
                  {retreat.hostedBy}
                </p>
                <p className="font-body text-sm text-ink leading-relaxed mt-3 lg:mt-4">
                  {retreat.description}
                </p>
                <a
                  href={retreat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer mt-6 lg:mt-8"
                >
                  More info
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
