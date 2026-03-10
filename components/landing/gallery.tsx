"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const images = [
  {
    src: "/images/gallery-meditation.png",
    alt: "Morning meditation session",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/images/gallery-garden.jpg",
    alt: "Peaceful garden walkway",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-dining.jpg",
    alt: "Mindful dining experience",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-pool.jpg",
    alt: "Infinity pool at sunset",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/images/gallery-spa.jpg",
    alt: "Spa treatment room",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-yoga-outdoor.jpg",
    alt: "Outdoor yoga platform",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/gallery-beach.jpg",
    alt: "Outdoor yoga platform",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/sauna.jpg",
    alt: "Outdoor yoga platform",
    span: "col-span-1 row-span-1",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 lg:py-40 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">
            Moments
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-dark text-balance">
            Life at House of Shakti
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]"
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-md ${image.span}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
