"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { Ornament } from "./ornament";

// ─── Return to yourself ──────────────────────────────────────────────────────
// A centered phrase over a scattered row of rounded photos, threaded by a thin
// hand-drawn line (RecenterLife's "reimagine" moment) — a brand statement that
// replaces the Seasonal Experiences carousel on the home.
// TODO: swap for signature lifestyle photography when curated shots exist.
type Photo = {
  src: string;
  alt: string;
  /** widths + vertical scatter, applied only from lg up */
  width: string;
  aspect: string;
  offset: string;
};

const photos: Photo[] = [
  {
    src: "/images/yoga/NE8A7702%201.webp",
    alt: "Morning practice at the shala",
    width: "w-44 lg:w-[16%]",
    aspect: "aspect-[3/4]",
    offset: "lg:mt-20",
  },
  {
    src: "/images/sanctuary/271A0759_websize%201.webp",
    alt: "The sanctuary and pool",
    width: "w-56 lg:w-[24%]",
    aspect: "aspect-[3/4]",
    offset: "lg:mt-0",
  },
  {
    src: "/images/contrast_therapy/IMG_7340%201.webp",
    alt: "Cold water, clear mind",
    width: "w-56 lg:w-[24%]",
    aspect: "aspect-[4/5]",
    offset: "lg:mt-28",
  },
  {
    src: "/images/yoga/IMG_8683%201.webp",
    alt: "Circle in the jungle",
    width: "w-44 lg:w-[16%]",
    aspect: "aspect-[3/4]",
    offset: "lg:mt-10",
  },
];

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const photoVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: "easeOut" } },
};

export function ReturnToYourself() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-warm-white py-20 lg:py-28 overflow-hidden">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        {/* Celestial submark — the crescent-sun mark carried over from the retired intro */}
        <Ornament src="/logos/crescent-sun-rays.png" className="h-14 md:h-16 mx-auto mb-8 lg:mb-10" />

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="font-display font-light text-ink text-center text-3xl md:text-5xl lg:text-6xl leading-[1.08] tracking-[-0.01em] max-w-4xl mx-auto"
        >
          You don&apos;t escape here. You return to yourself.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.25 }}
          className="font-body text-sm md:text-base text-ink leading-[1.8] text-center max-w-2xl mx-auto mt-8"
        >
          A few days of practice, rest, and presence — between the jungle and the sea
          of Santa Teresa — and a rhythm that stays with you long after you go home.
        </motion.p>

        {/* Scattered photo row with a threaded line */}
        <div className="relative mt-14 lg:mt-24">
          {/* Threaded line — drawn on scroll, sits behind the photos */}
          <svg
            aria-hidden
            className="hidden lg:block absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-40 z-0 pointer-events-none text-ink/20"
            viewBox="0 0 1000 160"
            fill="none"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0 120 C 160 40, 300 30, 430 90 S 720 170, 1000 60"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 2.0, ease: "easeInOut", delay: 0.4 }}
            />
          </svg>

          {/* Photos */}
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="
              relative z-10 flex items-center lg:items-start justify-start lg:justify-center
              gap-5 lg:gap-8
              overflow-x-auto lg:overflow-visible
              snap-x snap-mandatory lg:snap-none
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              -mx-[5%] px-[5%] lg:mx-0 lg:px-0
            "
          >
            {photos.map((photo) => (
              <motion.figure
                key={photo.src}
                variants={photoVariants}
                className={`relative flex-shrink-0 snap-center ${photo.width} ${photo.offset}`}
              >
                <div className={`relative ${photo.aspect} overflow-hidden shadow-sm`}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
