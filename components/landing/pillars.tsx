"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    title: "Yoga Classes",
    subtitle: "Serenity & Practice",
    description:
      "From sunrise flows to restorative evening sessions, our expert instructors guide you through practices that honor tradition while embracing modern understanding of the body.",
    image: "/images/yoga/NE8A7854%201.webp",
    link: "/yoga",
  },
  {
    title: "Boutique Accommodation",
    subtitle: "Comfort & Design",
    description:
      "Each suite is thoughtfully designed to be your personal sanctuary—where minimalist aesthetics meet supreme comfort, and every detail invites rest and reflection.",
    image: "/images/sanctuary/271A0822_websize%201.webp",
    link: "/accommodations",
  },
  {
    title: "Transformational Retreats",
    subtitle: "Community & Experience",
    description:
      "Immersive multi-day journeys that weave together practice, community, and inner exploration. Leave transformed, carrying the essence of Shakti within you.",
    image: "/images/sanctuary/271A0851_websize%201.webp",
    link: "/retreats",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function Pillars() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pillars" ref={ref} className="py-32 lg:py-40 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">
            The Three Pillars
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-dark text-balance">
            The Core of Our Sanctuary
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {pillars.map((pillar, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link href={pillar.link} className="group block">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-md">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-300" />
                </div>

                <span className="text-xs tracking-[0.2em] uppercase text-burgundy mb-2 block">
                  {pillar.subtitle}
                </span>

                <h3 className="font-serif text-2xl md:text-3xl text-dark mb-4 flex items-center gap-2">
                  {pillar.title}
                  <ArrowUpRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>

                <p className="text-dark/70 leading-relaxed">
                  {pillar.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
