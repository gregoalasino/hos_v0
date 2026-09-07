'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

// ─── Stay carousel ───────────────────────────────────────────────────────────
// Aman Amanjena style: arrows right-aligned, fade between images. No dots, no
// progress bar, no captions.
//
// The photographs are 3:4 portraits, shot and cropped for these cards, so the
// frame is 3:4 too — the guest sees the full picture, never a crop. Only the
// active image and its two neighbours are mounted: four dwellings carry 32
// photographs between them (~9MB), and mounting every one would make the page
// pay for the whole gallery on arrival.

// Wraparound distance between two indices on a ring of `total`.
const ringDist = (a: number, b: number, total: number) =>
  Math.min(Math.abs(a - b), total - Math.abs(a - b));

export function StayCarousel({
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
  const t = useTranslations('stayWithUs.carousel');
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
              alt={t('viewAlt', { alt, index: i + 1 })}
              aria-hidden={i !== current}
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
          aria-label={t('viewAll', { count: total, alt })}
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
            aria-label={t('previous', { alt })}
            className="p-3 -m-3 text-ink hover:opacity-50 transition-opacity duration-300"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label={t('next', { alt })}
            className="p-3 -m-3 text-ink hover:opacity-50 transition-opacity duration-300"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1} />
          </button>
        </div>
      )}
    </div>
  );
}
