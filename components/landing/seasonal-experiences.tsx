"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Ornament } from "./ornament";

const experiences = [
  {
    eyebrow: "Signature",
    title: "The House of Shakti experience",
    description:
      "An all-inclusive immersion with accommodation, daily practice, and a curated itinerary — designed for guests who want everything considered.",
    image: "/images/sanctuary/271A0822_websize%201.webp",
    href: "/contact",
  },
  {
    eyebrow: "Seasonal",
    title: "Moon cycles in Santa Teresa",
    description:
      "A new moon gathering that marks the change of seasons — three nights of yoga, breathwork, and shared meals.",
    image: "/images/yoga/NE8A7702%201.webp",
    href: "/contact",
  },
  {
    eyebrow: "For Two",
    title: "A weekend of return",
    description:
      "Designed for couples or close friends seeking a softer pace away from the noise. Private practice, slow mornings.",
    image: "/images/sanctuary/271A0759_websize%201.webp",
    href: "/contact",
  },
];

const cardsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: "easeOut" },
  },
};

export function SeasonalExperiences() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Progress bar (Aman style): fixed-width thumb that translates left→right.
  const [thumbWidth, setThumbWidth] = useState(100); // % of track
  const [thumbLeft, setThumbLeft] = useState(0); // % of track

  // Drag-to-scroll state (mutable refs, no re-renders).
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
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
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Drag-to-scroll handlers ─────────────────────────────────────────────
  // While dragging we disable scroll-snap so the user gets a frictionless
  // pull; on release we restore proximity snap + smooth behavior so the
  // carousel glides softly to the nearest card instead of jerking.
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    dragMoved.current = false;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto"; // direct 1:1 follow while dragging
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
    el.style.cursor = "grab";
    el.style.scrollBehavior = "smooth";
    el.style.scrollSnapType = "x proximity";
  };

  // Suppress the click that would fire after a drag (prevents accidental nav).
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved.current = false;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-warm-white"
    >
      {/* Container global del proyecto: 90% mobile / 80% desktop */}
      <div className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-3 lg:gap-12">
        {/* LEFT — heading + intro */}
        <div className="lg:col-span-1 lg:pr-12">
          {/* Moon phases centered over the title — echoes the "Moon cycles" gathering */}
          <div className="w-fit">
            <Ornament src="/logos/moon-phase.png" className="h-8 md:h-9 mx-auto mb-5 lg:mb-6" />

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
            >
              Seasonal experiences
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
            className="font-body text-sm text-ink leading-relaxed mt-6 lg:mt-10 max-w-full lg:max-w-xs"
          >
            Across each season, House of Shakti hosts a small number of
            curated experiences — gatherings designed to deepen practice,
            slow the pace, and return guests to themselves.
          </motion.p>
        </div>

        {/* RIGHT — horizontal scroll + progress bar */}
        <div className="lg:col-span-2 mt-12 lg:mt-0">
          {/* Scroll container */}
          <motion.div
            variants={cardsContainerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            ref={scrollRef}
            onScroll={updateProgress}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onClickCapture={handleClickCapture}
            tabIndex={0}
            aria-label="Seasonal experiences"
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
            {experiences.map((exp) => (
              <motion.article
                key={exp.title}
                variants={cardVariants}
                className="
                  flex-shrink-0 snap-start
                  w-[80vw] max-w-[360px]
                  lg:w-[40vw] lg:max-w-[440px]
                "
              >
                <Link href={exp.href} className="group block" draggable={false}>
                  {/* Image — square */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>

                  <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink mt-6">
                    {exp.eyebrow}
                  </p>

                  <h3 className="font-display font-light text-ink text-lg lg:text-xl leading-tight mt-3">
                    {exp.title}
                  </h3>

                  <p className="font-body text-sm text-ink leading-relaxed mt-3 line-clamp-3">
                    {exp.description}
                  </p>

                  <span className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] transition-opacity duration-300 group-hover:opacity-70 mt-6">
                    Discover more
                  </span>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {/* Progress bar — Aman style: fixed-width thumb that travels along a full-width track */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.6 }}
            className="mt-12 lg:mt-16"
          >
            <div className="relative h-px w-full bg-ink/15">
              <div
                className="absolute top-0 h-px bg-ink transition-[left,width] duration-300 ease-out"
                style={{
                  width: `${thumbWidth}%`,
                  left: `${thumbLeft}%`,
                }}
                aria-hidden
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
