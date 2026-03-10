"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function Introduction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 lg:py-40 bg-warm-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-burgundy">
            Welcome
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-dark mb-10 leading-tight text-balance"
        >
          A sacred space for renewal and discovery
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mb-12"
        >
          {/* Signature Element */}
          <svg
            viewBox="0 0 200 40"
            className="w-32 h-8 mx-auto text-burgundy"
          >
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
          className="text-lg md:text-xl text-dark/70 leading-relaxed max-w-3xl mx-auto text-pretty"
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
          className="text-lg text-dark/60 mt-8 italic font-serif"
        >
          &ldquo;Where stillness speaks and transformation begins.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
