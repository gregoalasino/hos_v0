'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CheckAvailabilityLink } from '@/components/accommodations/CheckAvailabilityLink';

// ─── Stay lightbox ───────────────────────────────────────────────────────────
// One expanded surface per dwelling, opened from the card's expand control,
// its photo, or its "Read more". The idea is borrowed from re:center's suite
// gallery — big photo, arrows, counter, thumbnails — but where theirs is a
// dark full-screen photo viewer, this one is a warm-white sheet that pairs the
// gallery with the dwelling's full story. The guest deciding where to sleep
// wants both at once: the photographs, and what the room actually holds.
// Splitting them into two different modals from the same card would mean two
// doors to the same decision.

export type StayData = {
  /** Fact line: capacity · layout. Rendered under the title, never above it. */
  meta: string;
  title: string;
  /** Card copy — short, one breath. */
  short: string;
  /** The full story, one string per paragraph. */
  long: string[];
  /** Optional bullet list (bed configurations). Rendered after `long`. */
  facts?: { label: string; items: string[] };
  /** Optional closing capacity line. */
  capacity?: string;
  images: string[];
};

// Wraparound distance between two indices on a ring of `total`.
const ringDist = (a: number, b: number, total: number) =>
  Math.min(Math.abs(a - b), total - Math.abs(a - b));

export function StayLightbox({
  stay,
  initialIndex = 0,
  onClose,
}: {
  stay: StayData;
  initialIndex?: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const touchX = useRef<number | null>(null);
  const total = stay.images.length;

  const goPrev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const goNext = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  // ── Keyboard: Esc closes, arrows walk the gallery ──────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goPrev, goNext]);

  // ── Body scroll lock while open (same contract as the nav drawer) ──────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ── Focus: land on the close button, return to the opener on close ─────
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  // ── Focus trap: Tab cycles inside the sheet ────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Preload: the neighbours now, the rest once the browser is idle ─────
  useEffect(() => {
    [(current + 1) % total, (current - 1 + total) % total].forEach((i) => {
      const img = new Image();
      img.src = stay.images[i];
    });
  }, [current, stay.images, total]);

  useEffect(() => {
    const idle =
      window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 800));
    const id = idle(() => {
      stay.images.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    });
    return () => {
      (window.cancelIdleCallback ?? window.clearTimeout)(id as number);
    };
  }, [stay.images]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-[80]"
    >
      {/* Backdrop — the site's neutral fog, a shade deeper than the drawer's
          so the sheet reads as the only thing awake. Click closes. */}
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-ink/60" />

      {/* The sheet */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={stay.title}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.45, ease }}
        className="
          absolute inset-0 md:inset-6 lg:inset-10
          md:max-w-[1360px] md:mx-auto
          bg-warm-white shadow-2xl shadow-ink/30
          flex flex-col lg:flex-row
          overflow-y-auto lg:overflow-hidden
        "
      >
        {/* ── Gallery ──────────────────────────────────────────────────── */}
        <div className="lg:w-[58%] lg:h-full flex flex-col bg-cream shrink-0">
          {/* Stage. The photographs are 3:4 portraits and the point of this
              surface is seeing them whole, so they letterbox (contain) rather
              than crop — on the same cream as the sheet, the margins read as
              air, not as bars. */}
          <div
            className="relative flex-1 min-h-0 select-none"
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) < 40) return;
              if (dx < 0) goNext();
              else goPrev();
            }}
          >
            {/* Mobile gets a bounded stage so the story below stays in reach;
                desktop lets the column height rule. */}
            <div className="relative h-[62svh] lg:h-full">
              {stay.images.map((src, i) => {
                if (ringDist(i, current, total) > 1) return null;
                return (
                  <motion.img
                    key={src}
                    src={src}
                    alt={`${stay.title} — photograph ${i + 1} of ${total}`}
                    draggable={false}
                    initial={false}
                    animate={{ opacity: i === current ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 w-full h-full object-contain lg:object-left"
                  />
                );
              })}

              {/* Overlaid arrows — phones and tablets only, where the photo
                  is the whole stage and the thumb rides over it anyway. On
                  desktop they'd sit on top of the photograph; there the
                  controls live in the strip below, and the picture stays
                  clean. */}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label={`Previous photograph of ${stay.title}`}
                    className="lg:hidden absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center bg-black/35 text-cream hover:bg-black/60 transition-colors duration-300 backdrop-blur-[2px]"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.2} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label={`Next photograph of ${stay.title}`}
                    className="lg:hidden absolute right-3 md:right-4 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center bg-black/35 text-cream hover:bg-black/60 transition-colors duration-300 backdrop-blur-[2px]"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.2} />
                  </button>
                </>
              )}

              {/* Counter — below lg it rides the stage; on desktop it moves
                  down beside the arrows. */}
              <p
                aria-live="polite"
                className="lg:hidden absolute bottom-3 right-4 font-body text-[11px] tracking-[0.12em] text-ink/60"
              >
                {current + 1} / {total}
              </p>
            </div>
          </div>

          {/* Control strip — desktop only; on a phone the swipe and the
              overlaid counter carry the same information without spending
              vertical space. Thumbnails keep the left edge, the counter and
              the stepping arrows hold the right — so the photograph above
              stays untouched by controls. */}
          <div className="hidden lg:flex items-center gap-6 px-6 py-4">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {stay.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Photograph ${i + 1} of ${stay.title}`}
                  aria-current={i === current}
                  className={`relative shrink-0 w-12 aspect-[3/4] overflow-hidden transition-opacity duration-300 ${
                    i === current ? 'opacity-100 ring-1 ring-ink' : 'opacity-45 hover:opacity-80'
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <p aria-live="polite" className="font-body text-[11px] tracking-[0.12em] text-ink/60">
                {current + 1} / {total}
              </p>
              {total > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label={`Previous photograph of ${stay.title}`}
                    className="h-10 w-10 grid place-items-center border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream transition-all duration-300"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.2} />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label={`Next photograph of ${stay.title}`}
                    className="h-10 w-10 grid place-items-center border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-cream transition-all duration-300"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.2} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── The story ────────────────────────────────────────────────── */}
        <div className="lg:flex-1 lg:overflow-y-auto">
          <div className="px-6 py-10 md:px-10 lg:px-12 lg:py-14 max-w-xl">
            <h2 className="font-display font-light text-ink text-2xl md:text-3xl leading-snug pr-10">
              {stay.title}
            </h2>
            <p className="font-body text-xs text-ink/80 mt-3">{stay.meta}</p>

            <div className="mt-8 space-y-5">
              {stay.long.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="font-body text-sm text-ink leading-[1.8]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {stay.facts && (
              <div className="mt-8">
                <p className="font-body text-[10px] tracking-[0.25em] uppercase text-ink/70">
                  {stay.facts.label}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {stay.facts.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-3">
                      <span aria-hidden className="font-body text-sm text-ink select-none">
                        —
                      </span>
                      <span className="font-body text-sm text-ink leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stay.capacity && (
              <p className="font-body text-sm text-ink leading-relaxed mt-8 pt-6 border-t border-ink/10">
                {stay.capacity}
              </p>
            )}

            <CheckAvailabilityLink className="mt-10" />
          </div>
        </div>

        {/* Close — pinned to the sheet's corner, above both columns. */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={`Close ${stay.title}`}
          className="absolute top-3 right-3 md:top-4 md:right-4 h-11 w-11 grid place-items-center bg-warm-white/80 backdrop-blur-[2px] text-ink hover:opacity-60 transition-opacity duration-300"
        >
          <X className="h-[22px] w-[22px]" strokeWidth={1.5} />
        </button>
      </motion.div>
    </motion.div>
  );
}
