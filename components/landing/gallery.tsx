"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const images = [
  {
    src: "/images/sanctuary/271A0689_websize%201.webp",
    alt: "House of Shakti sanctuary",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/images/yoga/IMG_8420%201.webp",
    alt: "Yoga class at House of Shakti",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/contrast_therapy/IMG_7340%201.webp",
    alt: "Contrast therapy experience",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/sanctuary/271A0856_websize%201.webp",
    alt: "Sanctuary outdoor space",
    span: "col-span-1 row-span-2",
  },
  {
    src: "/images/yoga/IMG_5608%201.webp",
    alt: "Morning yoga flow",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/contrast_therapy/IMG_7067%201.webp",
    alt: "Cold plunge therapy",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/yoga/IMG_8664%201.webp",
    alt: "Yoga practice session",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/images/sanctuary/271A0719_websize%201.webp",
    alt: "Sanctuary garden",
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
