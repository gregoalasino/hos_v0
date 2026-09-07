'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import Link from 'next/link';
import type { Retreat } from '@/lib/retreats';

// Section layout mirrors home Seasonal Experiences:
// LEFT — heading + body + nav link (sticky-ish, narrow column)
// RIGHT — horizontal scroll carousel of images only (no text, no CTA per card)
// Drag-to-scroll, native snap-proximity, Aman-style progress bar below.

const cardsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function RetreatSpace({ retreat }: { retreat: Retreat }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Aman-style progress thumb: fixed width = visible fraction of total content.
  const [thumbWidth, setThumbWidth] = useState(100);
  const [thumbLeft, setThumbLeft] = useState(0);

  // Drag-to-scroll refs (no re-renders).
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  const updateProgress = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth) {
      setThumbWidth(100);
      setThumbLeft(0);
      return;
    }
    const widthPct = (clientWidth / scrollWidth) * 100;
    const max = scrollWidth - clientWidth;
    const leftPct = (scrollLeft / max) * (100 - widthPct);
    setThumbWidth(widthPct);
    setThumbLeft(leftPct);
  };

  useEffect(() => {
    updateProgress();
    const onResize = () => updateProgress();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
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
    el.scrollLeft = dragStartScrollLeft.current - (e.pageX - dragStartX.current);
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-warm-white">
      <div className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-3 lg:gap-12">
        {/* LEFT — heading + body + nav link. Eyebrow intentionally omitted. */}
        <div className="lg:col-span-1 lg:pr-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            {retreat.spaceHeading}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="font-body text-sm text-ink leading-relaxed mt-6 lg:mt-10"
          >
            {retreat.spaceBody}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
          >
            <Link
              href="/stay-with-us"
              className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer mt-8"
            >
              Explore the sanctuary
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — horizontal scroll of square images + progress bar */}
        <div className="lg:col-span-2 mt-12 lg:mt-0">
          <motion.div
            variants={cardsContainerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            ref={scrollRef}
            onScroll={updateProgress}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            tabIndex={0}
            aria-label="The space"
            className="
              flex gap-6 lg:gap-8
              overflow-x-auto snap-x snap-proximity scroll-smooth
              cursor-grab select-none
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              focus:outline-none
            "
          >
            {retreat.spaceImages.map((src, i) => (
              <motion.div
                key={`${src}-${i}`}
                variants={cardVariants}
                className="
                  flex-shrink-0 snap-start
                  w-[80vw] max-w-[360px]
                  lg:w-[40vw] lg:max-w-[440px]
                "
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={src}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress bar — Aman style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.6 }}
            className="mt-12 lg:mt-16"
          >
            <div className="relative h-px w-full bg-ink/15">
              <div
                className="absolute top-0 h-px bg-ink transition-[left,width] duration-300 ease-out"
                style={{ width: `${thumbWidth}%`, left: `${thumbLeft}%` }}
                aria-hidden
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
