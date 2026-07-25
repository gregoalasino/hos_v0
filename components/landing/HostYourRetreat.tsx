"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function HostYourRetreat() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="bg-warm-white py-20 lg:py-28"
    >
      <div className="w-[90%] md:w-[80%] mx-auto">
        {/*
          grid-cols-[3fr_2fr] (instead of grid-cols-5 + col-span-3/2) so the
          ratio is exactly 3:2 with a single gap. Combined with aspect-[3/2]
          on the left image and aspect-square on the right, both images
          render at identical height in desktop.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-10 space-y-16 lg:space-y-0">
          {/* LEFT — Host your retreat (primary, 3/5) */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          >
            <Link href="/contact" className="group block">
              {/* Image — landscape */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src="/images/yoga/NE8A7854%201.webp"
                  alt="Host your retreat at House of Shakti"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink mt-6">
                For Teachers & Hosts
              </p>

              <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-tight mt-3">
                Host your retreat
              </h3>

              <p className="font-body text-sm text-ink leading-relaxed mt-4 max-w-xl">
                Bring your group to House of Shakti. We provide the space, the
                rhythm, and the team — you bring the practice.
              </p>

              <span className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] transition-opacity duration-300 group-hover:opacity-70 mt-6">
                Discover more
              </span>
            </Link>
          </motion.article>

          {/* RIGHT — The sanctuary, in private (secondary, 2/5) */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
          >
            <Link href="/contact" className="group block">
              {/* Image — square (same visual height as the 3/2 landscape in the wider left column) */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src="/images/sanctuary/271A0759_websize%201.webp"
                  alt="The sanctuary at House of Shakti, in private"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink mt-6">
                Private Use
              </p>

              <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-tight mt-3">
                The sanctuary, in private
              </h3>

              <p className="font-body text-sm text-ink leading-relaxed mt-4">
                For families, creatives, brands, or gatherings that ask for
                stillness — the entire sanctuary, reserved for you.
              </p>

              <span className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] transition-opacity duration-300 group-hover:opacity-70 mt-6">
                Discover more
              </span>
            </Link>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
