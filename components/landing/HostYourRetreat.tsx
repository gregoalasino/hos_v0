"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// ─── Host your retreat ───────────────────────────────────────────────────────
// A single, focused feature block (RecenterLife-style) inviting teachers and
// hosts to bring their group to House of Shakti. Links to the dedicated
// /host-your-retreat landing built from the client's deck.
export function HostYourRetreat() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-warm-white py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 lg:gap-16 items-center"
        >
          {/* Image — landscape, leading */}
          <Link href="/host-your-retreat" className="group block">
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src="/images/yoga/NE8A7854%201.webp"
                alt="Host your retreat at House of Shakti"
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
              />
            </div>
          </Link>

          {/* Text */}
          <div>
            <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-burgundy">
              For Teachers &amp; Hosts
            </p>

            <h2 className="font-display font-light text-ink text-3xl md:text-4xl lg:text-5xl leading-[1.1] mt-4">
              Host your retreat in paradise
            </h2>

            <p className="font-body text-sm text-ink leading-[1.8] mt-6 max-w-xl">
              Bring your group to House of Shakti — a private sanctuary on a hilltop
              in Santa Teresa, five minutes from Playa Hermosa. We provide the space,
              the rhythm, and the team; you bring the practice. Accommodation for up
              to your whole group, a yoga shala, pool, sauna and cold plunge, and a
              menu of on- and off-site experiences.
            </p>

            <Link
              href="/host-your-retreat"
              className="inline-block bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300 mt-9"
            >
              Discover more
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
