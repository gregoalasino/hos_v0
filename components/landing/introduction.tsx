"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const sanctuaryPhotos = [
  {
    src: "/images/sanctuary/271A0642_websize%201.webp",
    alt: "House of Shakti sanctuary",
    className: "aspect-[4/3]",
  },
  {
    src: "/images/sanctuary/271A0800_websize%201.webp",
    alt: "Peaceful outdoor space",
    className: "aspect-[4/3]",
  },
];

export function Introduction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Text side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6"
            >
              <span className="text-sm tracking-[0.3em] uppercase text-burgundy">
                Welcome
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl font-light text-dark mb-8 leading-tight text-balance"
            >
              A sacred space for renewal and discovery
            </motion.h2>

            {/* Signature Element */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="mb-8"
            >
              <svg viewBox="0 0 200 40" className="w-28 h-7 text-burgundy">
                <path
                  d="M10 20 Q50 5, 100 20 T190 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="20" r="3" fill="currentColor" />
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-lg text-dark/70 leading-relaxed mb-6 text-pretty"
            >
              Nestled in nature&apos;s embrace, House of Shakti offers a sanctuary where
              the art of mindful living unfolds. Our philosophy weaves together the
              ancient traditions of yoga with contemporary wellness practices, creating
              a tapestry of experiences designed to awaken your inner wisdom and restore
              your natural balance.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="text-lg text-dark/60 italic font-serif"
            >
              &ldquo;Where stillness speaks and transformation begins.&rdquo;
            </motion.p>
          </div>

          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Large top photo */}
            <div className="relative overflow-hidden rounded-md aspect-[16/10]">
              <img
                src="/images/sanctuary/271A0642_websize%201.webp"
                alt="House of Shakti sanctuary"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Two smaller photos side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-md aspect-[4/3]">
                <img
                  src="/images/sanctuary/271A0800_websize%201.webp"
                  alt="Peaceful garden space"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-md aspect-[4/3]">
                <img
                  src="/images/sanctuary/271A0676_websize%201.webp"
                  alt="Sanctuary outdoor area"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
