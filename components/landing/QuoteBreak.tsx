"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Quote break ─────────────────────────────────────────────────────────────
// A full-bleed image that fills most of the viewport with an overlaid editorial
// quote — a quiet, cinematic breath between sections (à la RecenterLife). Uses
// the site's standard framing: full-width on mobile, 80% container on desktop.
type QuoteBreakProps = {
  image: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  /** Vertical placement of the quote block. */
  align?: "bottom" | "center";
  /**
   * "tall" (default) — an 80% container, ~80vh cinematic break.
   * "short" — full-bleed, low-height band (à la re:center's testimonial strip).
   */
  size?: "tall" | "short";
  className?: string;
};

export function QuoteBreak({
  image,
  quote,
  author,
  role,
  avatar,
  align = "bottom",
  size = "tall",
  className = "",
}: QuoteBreakProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const justify = align === "center" ? "items-center" : "items-end";
  const short = size === "short";

  const containerWidth = short ? "w-full" : "w-full md:w-[80%] mx-auto";
  const bandHeight = short
    ? "min-h-[42vh] md:min-h-[46vh]"
    : "min-h-[70vh] lg:min-h-[80vh]";
  const quoteSize = short
    ? "text-2xl md:text-4xl lg:text-5xl"
    : "text-3xl md:text-5xl lg:text-6xl";

  return (
    <section className={`bg-warm-white ${className}`}>
      <div className={containerWidth}>
        <div className={`relative overflow-hidden bg-dark ${bandHeight}`}>
          {/* Background image with a slow settle-in */}
          <motion.img
            ref={ref}
            src={image}
            alt=""
            aria-hidden
            draggable={false}
            initial={{ scale: 1.06 }}
            animate={inView ? { scale: 1 } : { scale: 1.06 }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Legibility overlay — soft, weighted to the bottom */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/30 to-dark/10"
          />

          {/* Quote */}
          <div className={`absolute inset-0 flex ${justify}`}>
            <div className="w-[85%] md:w-[80%] mx-auto pb-14 md:pb-20">
              {avatar && (
                <motion.img
                  src={avatar}
                  alt={author}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="h-12 w-12 object-cover mb-6"
                />
              )}

              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
                className={`font-display font-light text-cream leading-[1.1] tracking-[-0.01em] max-w-4xl ${quoteSize}`}
              >
                &ldquo;{quote}&rdquo;
              </motion.blockquote>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 1.0, ease: "easeOut", delay: 0.3 }}
                className="mt-8"
              >
                <p className="font-body text-[11px] md:text-xs tracking-[0.25em] uppercase text-cream">
                  {author}
                </p>
                {role && (
                  <p className="font-body text-[11px] md:text-xs tracking-[0.15em] uppercase text-cream/70 mt-1">
                    {role}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
