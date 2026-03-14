"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { retreats } from "./data";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function RetreatsPage() {
  const heroRef = useRef(null);
  const retreatsRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const retreatsInView = useInView(retreatsRef, { once: true, margin: "-100px" });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-warm-white"
    >
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2 text-sm text-cream/90 hover:text-cream transition-colors bg-dark/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <section ref={heroRef} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/retreat-hero.jpg" alt="Group meditation at sunrise" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark/40" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-6"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-cream/80 mb-4 block">Transform & Evolve</span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-cream text-balance">
            Transformational Retreats
          </h1>
        </motion.div>
      </section>

      <section ref={retreatsRef} className="py-24 lg:py-32 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={retreatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">Our Journeys</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-dark">Choose Your Path</h2>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={retreatsInView ? "visible" : "hidden"}
            className="space-y-16 lg:space-y-24"
          >
            {retreats.map((retreat, index) => (
              <motion.div
                key={retreat.id}
                variants={itemVariants}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <Link href={`/retreats/${retreat.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                      <img
                        src={retreat.image}
                        alt={retreat.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-dark/80 text-cream px-4 py-2 rounded-full text-sm">
                        {retreat.duration}
                      </div>
                    </div>
                  </Link>
                </div>
                <div className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-dark mb-2">{retreat.name}</h3>
                  <p className="text-sm tracking-[0.2em] uppercase text-burgundy mb-4">{retreat.tagline}</p>
                  <p className="text-dark/70 leading-relaxed mb-6">{retreat.description}</p>
                  <div className="mb-8">
                    <span className="text-sm tracking-[0.2em] uppercase text-burgundy mb-3 block">Highlights</span>
                    <ul className="space-y-2">
                      {retreat.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-2 text-dark/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-burgundy mt-2 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div>
                      <span className="text-sm text-dark/50 block">Starting at</span>
                      <span className="font-serif text-3xl text-dark">${retreat.price.toLocaleString()}</span>
                    </div>
                    <Link
                      href={`/retreats/${retreat.id}`}
                      className="group flex items-center gap-2 bg-dark text-cream px-6 py-3 rounded-md hover:bg-dark-light transition-colors"
                    >
                      + Info
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="mt-6 pt-6 border-t border-dark/10">
                    <span className="text-sm text-dark/50 mr-3">Upcoming:</span>
                    {retreat.dates.map((date, i) => (
                      <span key={i} className="inline-block text-sm text-dark/70 mr-3 last:mr-0">
                        {date}{i < retreat.dates.length - 1 && <span className="ml-3 text-dark/30">|</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-dark text-cream text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-serif text-3xl md:text-4xl mb-6">Ready to transform?</h3>
          <p className="text-cream/70 mb-8">Begin your journey of self-discovery and renewal with us.</p>
          <Link
            href="/#book"
            className="inline-block bg-burgundy text-cream px-8 py-4 rounded-md text-sm tracking-wide uppercase hover:bg-burgundy-light transition-colors"
          >
            Reserve Your Spot
          </Link>
        </div>
      </section>
    </motion.main>
  );
}
