"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─── Quote break ─────────────────────────────────────────────────────────────
// A full-bleed image with overlaid words. Two registers, because the page asks
// two different things of it:
//
//   "statement"   — a house line, a handful of words, set large and ranged along
//                   the bottom edge. A cinematic breath between sections.
//   "testimonial" — someone else's voice, at paragraph length, centred in the
//                   frame and set restrained. This is the treatment built for
//                   the Yoga Teacher Training landing (theawakenedbody).
type QuoteBreakProps = {
  image: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  /** Vertical placement of the quote block. Ignored by the testimonial variant. */
  align?: "bottom" | "center";
  /**
   * "tall" (default) — an 80% container, ~80vh cinematic break.
   * "short" — full-bleed, low-height band.
   * Ignored by the testimonial variant, which sets its own height.
   */
  size?: "tall" | "short";
  variant?: "statement" | "testimonial";
  /**
   * Black scrim opacity for the testimonial variant.
   *
   * Measured against the image, never guessed, and measured per tile rather
   * than as an average: it's the brightest patch that decides whether a line is
   * readable, not the mean. For the current photograph the brightest tile sits
   * at a relative luminance of 0.66 — the sky, top right — which against cream
   * clears 4.5:1 from a scrim of 0.50, by a margin of 0.09. Too thin: a
   * different viewport crops the image somewhere else. 0.55 holds every cut
   * from a 375px phone to an ultrawide between 5.4:1 and 5.5:1.
   *
   * Re-measure when the photograph changes.
   */
  scrim?: number;
  className?: string;
};

// Carries the remaining margin so the scrim doesn't have to be darkened further
// and lose the photograph behind it. Uniform, like the scrim — every line is
// held at the same weight.
const TEXT_SHADOW =
  "[text-shadow:0_1px_2px_rgba(0,0,0,0.35),0_2px_18px_rgba(0,0,0,0.28)]";

export function QuoteBreak({
  image,
  quote,
  author,
  role,
  avatar,
  align = "bottom",
  size = "tall",
  variant = "statement",
  scrim = 0.55,
  className = "",
}: QuoteBreakProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  if (variant === "testimonial") {
    return (
      <section ref={ref} className={`bg-warm-white ${className}`}>
        {/* Full width on every breakpoint. The rest of the page holds an 80%
            container, but this one moment is the photograph, and insetting it
            would frame a quotation as though it were another block of content. */}
        <div className="w-full">
          {/* Height follows the quote and only then a minimum, never the other
              way around. Pinning this to a viewport height would put a long
              testimonial at risk of being clipped on a short window or a large
              accessibility font size, and one that loses its last line is worse
              than one that is simply taller than expected. */}
          <div
            data-surface="dark"
            className="relative overflow-hidden bg-black min-h-[75vh] md:min-h-[80vh] flex items-center"
          >
            <motion.img
              src={image}
              alt=""
              aria-hidden
              draggable={false}
              initial={{ scale: 1.06 }}
              animate={inView ? { scale: 1 } : { scale: 1.06 }}
              transition={{ duration: 2.4, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />

            {/* An even wash rather than a bottom-weighted gradient. The quote
                sits in the middle of the frame here, not along one edge, so a
                gradient would run light under one line and heavy under the next
                — the words would shift in weight as they were read. A flat
                scrim holds every line at the same value. Neutral black, never
                `--dark` (#340000), which is a burgundy and casts the colour
                over the whole photograph. */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${scrim})` }}
            />

            <div className="relative w-[85%] md:w-[80%] mx-auto py-24 md:py-32">
              <figure className={`max-w-3xl mx-auto text-center ${TEXT_SHADOW}`}>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="h-px w-16 bg-cream/40 mx-auto origin-center"
                />

                {avatar && (
                  <motion.img
                    src={avatar}
                    alt={author}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
                    className="h-14 w-14 object-cover mx-auto mt-10"
                  />
                )}

                <motion.blockquote
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                  // Restrained for its length. The page's other display type
                  // runs large because it is a handful of words; a few hundred
                  // characters set that way becomes a wall to climb rather than
                  // a voice to listen to. `text-balance` keeps the last line
                  // from stranding a single word.
                  className="font-display font-light text-cream text-xl md:text-2xl lg:text-[28px] leading-[1.55] tracking-[-0.005em] text-balance mt-10 md:mt-12"
                >
                  &ldquo;{quote}&rdquo;
                </motion.blockquote>

                <motion.figcaption
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 1.0, ease: "easeOut", delay: 0.45 }}
                  className="mt-10 md:mt-12"
                >
                  <span className="block font-body text-[11px] md:text-xs tracking-[0.28em] uppercase text-cream/85">
                    {author}
                  </span>
                  {role && (
                    <span className="block font-body text-[11px] md:text-xs tracking-[0.18em] uppercase text-cream/60 mt-2">
                      {role}
                    </span>
                  )}
                </motion.figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Statement ───────────────────────────────────────────────────────────
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
        <div ref={ref} className={`relative overflow-hidden bg-dark ${bandHeight}`}>
          {/* Background image with a slow settle-in */}
          <motion.img
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
