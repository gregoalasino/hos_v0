'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useMessages, useTranslations } from 'next-intl';

// Same horizontal-slider gallery pattern as /yoga.
// Same-width slots, varied aspect ratios → different heights, vertically
// centered. Drag-to-scroll, scroll-driven opacity, Aman-style progress bar.
// Alt texts live in the catalogue under retreats.gallery.alts, in this order.

type GalleryImg = { src: string; aspect: string };

const IMAGES: GalleryImg[] = [
  { src: '/images/retreats/retreats-1.webp',  aspect: 'aspect-[2/3]' },
  { src: '/images/retreats/retreats-2.webp',  aspect: 'aspect-[3/2]' },
  { src: '/images/retreats/retreats-3.webp',  aspect: 'aspect-[3/2]' },
  { src: '/images/retreats/retreats-4.webp',  aspect: 'aspect-[2/3]' },
  { src: '/images/retreats/retreats-5.webp',  aspect: 'aspect-[3/4]' },
  { src: '/images/retreats/retreats-6.webp',  aspect: 'aspect-[2/3]' },
  { src: '/images/retreats/retreats-7.webp',  aspect: 'aspect-[2/3]' },
  { src: '/images/retreats/retreats-8.webp',  aspect: 'aspect-[3/4]' },
  { src: '/images/retreats/retreats-9.webp',  aspect: 'aspect-[3/4]' },
  { src: '/images/retreats/retreats-10.webp', aspect: 'aspect-[2/3]' },
  { src: '/images/retreats/retreats-11.webp', aspect: 'aspect-[2/3]' },
  { src: '/images/retreats/retreats-12.webp', aspect: 'aspect-[2/3]' },
];

export function RetreatsGallery() {
  const t = useTranslations('retreats.gallery');
  const alts = useMessages().retreats.gallery.alts;
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Aman-style thumb: fixed width = visible fraction of total content
  const [thumbWidth, setThumbWidth] = useState(100);
  const [thumbLeft, setThumbLeft] = useState(0);

  // Per-slot opacity by distance to viewport center
  const [opacities, setOpacities] = useState<number[]>(() => IMAGES.map(() => 1));

  // Drag-to-scroll refs
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    if (scrollWidth <= clientWidth) {
      setThumbWidth(100);
      setThumbLeft(0);
    } else {
      const widthPct = (clientWidth / scrollWidth) * 100;
      const max = scrollWidth - clientWidth;
      const leftPct = (scrollLeft / max) * (100 - widthPct);
      setThumbWidth(widthPct);
      setThumbLeft(leftPct);
    }

    const viewportCenter = scrollLeft + clientWidth / 2;
    const slots = el.querySelectorAll<HTMLElement>('[data-gallery-slot]');
    const next: number[] = [];
    slots.forEach((slot) => {
      const slotCenter = slot.offsetLeft + slot.offsetWidth / 2;
      const dist = Math.abs(slotCenter - viewportCenter);
      const ratio = Math.min(1, dist / (clientWidth * 0.6));
      next.push(1 - ratio * 0.7);
    });
    setOpacities(next);
  };

  useEffect(() => {
    update();
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    dragMoved.current = false;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = e.pageX - dragStartX.current;
    if (Math.abs(delta) > 5) dragMoved.current = true;
    el.scrollLeft = dragStartScrollLeft.current - delta;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const el = scrollRef.current;
    if (!el) return;
    el.style.cursor = 'grab';
    el.style.scrollBehavior = 'smooth';
    el.style.scrollSnapType = 'x proximity';
  };

  return (
    <section
      ref={sectionRef}
      aria-label={t('aria')}
      className="bg-warm-white py-20 lg:py-28"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        ref={scrollRef}
        onScroll={update}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        tabIndex={0}
        className="
          flex items-center gap-6 lg:gap-10
          h-[420px] sm:h-[500px] lg:h-[620px] xl:h-[680px]
          overflow-x-auto snap-x snap-proximity scroll-smooth
          px-6 lg:px-16 xl:px-24
          cursor-grab select-none
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          focus:outline-none
        "
      >
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            data-gallery-slot
            style={{
              opacity: opacities[i] ?? 1,
              transition: 'opacity 600ms ease-out',
            }}
            className="
              flex-shrink-0 snap-center
              w-[260px] sm:w-[320px] lg:w-[400px] xl:w-[440px]
            "
          >
            <div className={`w-full ${img.aspect} overflow-hidden`}>
              <img
                src={img.src}
                alt={alts[i] ?? ''}
                draggable={false}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Progress bar — Aman style, contained within the standard 80% */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: 0.6 }}
        className="w-[90%] md:w-[80%] mx-auto mt-16 lg:mt-20"
      >
        <div className="relative h-px w-full bg-ink/15">
          <div
            className="absolute top-0 h-px bg-ink transition-[left,width] duration-300 ease-out"
            style={{ width: `${thumbWidth}%`, left: `${thumbLeft}%` }}
            aria-hidden
          />
        </div>
      </motion.div>
    </section>
  );
}
