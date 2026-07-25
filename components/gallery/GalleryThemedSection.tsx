'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, Variants } from 'framer-motion';

// ─── Types ──────────────────────────────────────────────────────────────────
export type GalleryImage = {
  src: string;
  aspect: string; // tailwind aspect-ratio utility, e.g. 'aspect-[4/5]'
  alt: string;
};

export type GalleryThemedSectionProps = {
  heading: string;
  body: string;
  images: GalleryImage[];
  layoutVariant: 'A' | 'B' | 'C';
  background: 'warm-white' | 'cream';
};

// ─── Word-by-word heading reveal (same pattern as home Introduction) ────────
const headlineContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Single image tile — independent useInView, restrained hover scale ──────
function GalleryTile({ image, sizes }: { image: GalleryImage; sizes: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className={`relative w-full ${image.aspect} overflow-hidden`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}

// ─── Variant A — Lead image + 2 stacked side images.
// Proportions chosen so the right column's total height (2× aspect-[4/5] at
// ~33% width) naturally matches the lead (aspect-[4/5] at ~67% width).
// 3 images total, not 5 — fewer, bigger, more editorial.
function LayoutA({ images }: { images: GalleryImage[] }) {
  const [lead, ...rest] = images;
  const side = rest.slice(0, 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
      <div className="lg:col-span-8">
        <GalleryTile image={lead} sizes="(max-width: 1024px) 100vw, 66vw" />
      </div>
      <div className="lg:col-span-4 flex flex-col gap-4 lg:gap-6">
        {side.map((img, i) => (
          <GalleryTile
            key={`a-side-${i}`}
            image={img}
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ))}
      </div>
    </div>
  );
}

// ─── Variant B — Staggered CSS multi-column masonry ─────────────────────────
function LayoutB({ images }: { images: GalleryImage[] }) {
  return (
    <div className="columns-1 lg:columns-3 gap-4 lg:gap-6">
      {images.map((img, i) => (
        <div key={`b-${i}`} className="mb-4 lg:mb-6 break-inside-avoid">
          <GalleryTile image={img} sizes="(max-width: 1024px) 100vw, 33vw" />
        </div>
      ))}
    </div>
  );
}

// ─── Variant C — Editorial spread: 2 large on top, 3 smaller below ──────────
function LayoutC({ images }: { images: GalleryImage[] }) {
  const top = images.slice(0, 2);
  const bottom = images.slice(2, 5);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {top.map((img, i) => (
          <GalleryTile
            key={`c-top-${i}`}
            image={img}
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        ))}
      </div>
      {bottom.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-6">
          {bottom.map((img, i) => (
            <GalleryTile
              key={`c-bot-${i}`}
              image={img}
              sizes="(max-width: 1024px) 100vw, 30vw"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Themed section — reused 6× across the gallery page ─────────────────────
export function GalleryThemedSection({
  heading,
  body,
  images,
  layoutVariant,
  background,
}: GalleryThemedSectionProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });

  const bgClass = background === 'cream' ? 'bg-cream' : 'bg-warm-white';
  const words = heading.split(' ');

  return (
    <section className={`${bgClass} py-20 lg:py-28`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header — eyebrow intentionally removed for cleaner
            editorial framing. The body paragraph carries the theme. */}
        <div ref={headerRef} className="max-w-3xl">
          <motion.h2
            variants={headlineContainer}
            initial="hidden"
            animate={headerInView ? 'visible' : 'hidden'}
            aria-label={heading}
            className="font-display font-light text-ink text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-[-0.005em]"
          >
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
                  {i < words.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          {/* Body — standard project paragraph style: text-sm, no italic,
              full ink opacity. Matches retreat / accommodation sections. */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 1.0,
              ease: 'easeOut',
              delay: 0.1 + words.length * 0.16,
            }}
            className="font-body text-sm text-ink leading-relaxed max-w-2xl mt-6"
          >
            {body}
          </motion.p>
        </div>

        {/* Images — layout variant */}
        <div className="mt-16 lg:mt-20">
          {layoutVariant === 'A' && <LayoutA images={images} />}
          {layoutVariant === 'B' && <LayoutB images={images} />}
          {layoutVariant === 'C' && <LayoutC images={images} />}
        </div>
      </div>
    </section>
  );
}
