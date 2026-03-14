"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-yoga.jpg"
          alt="Peaceful yoga practice at House of Shakti"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/40 to-cream" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-sm tracking-[0.3em] uppercase text-dark/70 mb-6"
        >
          A Sanctuary for the Soul
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-dark leading-tight mb-8 text-balance"
        >
          House of Shakti
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-xl text-dark/80 max-w-2xl mx-auto mb-12 leading-relaxed text-pretty"
        >
          Where ancient wisdom meets modern luxury. Immerse yourself in 
          transformative yoga, serene accommodations, and soul-nourishing retreats.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="hidden md:block cloudbeds-btn-container">
              <cb-book-now-button 
                property-code='zE6Wy8' 
              ></cb-book-now-button>
          </div>
          <Link
            href="#pillars"
            className="group flex items-center gap-3 border border-dark/30 text-dark px-8 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-dark/5 transition-colors duration-300"
          >
            Explore Yoga
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-dark/50 to-transparent" />
      </motion.div>
    </section>
  );
}
