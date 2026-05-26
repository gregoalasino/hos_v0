"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const pillars = [
  {
    eyebrow: "Daily Practice",
    title: "Yoga classes",
    description:
      "Mornings open with breath and movement on the open-air shala. Afternoons close softer — restorative, slow.",
    image: "/images/yoga/NE8A7854%201.webp",
    link: "/yoga",
  },
  {
    eyebrow: "Considered Rest",
    title: "Boutique accommodation",
    description:
      "Six rooms shaped by the land they sit in. Hardwood, natural linen, light filtered through tropical canopy.",
    image: "/images/sanctuary/271A0822_websize%201.webp",
    link: "/accommodations",
  },
  {
    eyebrow: "Seasonal Gatherings",
    title: "Transformational retreats",
    description:
      "A handful of immersive programs each year, each tied to a season and a teacher.",
    image: "/images/sanctuary/271A0851_websize%201.webp",
    link: "/retreats",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.0,
      ease: "easeOut",
    },
  },
};

export function Pillars() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="pillars"
      ref={ref}
      className="bg-warm-white py-20 lg:py-28"
    >
      <div className="w-[90%] md:w-[80%] mx-auto">
        {/* Section heading — single line, restrained */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]">
            The world of Shakti
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 lg:gap-10"
        >
          {pillars.map((pillar) => (
            <motion.article key={pillar.title} variants={itemVariants}>
              {/* Entire card is one link — image, title, description, CTA all clickable */}
              <Link href={pillar.link} className="group block">
                {/* Image — static, no hover zoom */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={pillar.image}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text block */}
                <div className="mt-6 lg:mt-8">
                  <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink mb-3 lg:mb-4">
                    {pillar.eyebrow}
                  </p>

                  <h3 className="font-display font-light text-ink text-lg lg:text-xl leading-snug mb-3 lg:mb-4">
                    {pillar.title}
                  </h3>

                  <p className="font-body text-sm text-ink leading-relaxed mb-6 lg:mb-8">
                    {pillar.description}
                  </p>

                  <span className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] transition-opacity duration-300 group-hover:opacity-70">
                    Discover more
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
