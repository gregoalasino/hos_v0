"use client";

import { motion, Variants, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote:
      "I came to House of Shakti looking for a break. I left having remembered something about myself I had been too busy to hear.",
    author: "Sarah Mitchell",
    role: "Wellness Entrepreneur",
  },
  {
    quote:
      "Every detail held a kind of attention I rarely encounter — the food, the light in the rooms, the way the day was paced. Nothing rushed, nothing performed.",
    author: "James Chen",
    role: "Creative Director",
  },
  {
    quote:
      "It is the rare place that lives up to its own quiet. I have started planning my year around returning.",
    author: "Elena Rodriguez",
    role: "Architect",
  },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

function Testimonial({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.figure
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="w-[90%] md:w-[80%] max-w-3xl mx-auto text-center"
    >
      <span
        aria-hidden
        className="block font-display font-light text-cream text-[80px] leading-none mb-2 select-none"
      >
        &ldquo;
      </span>
      <blockquote className="font-display font-light italic text-ink text-2xl md:text-3xl leading-[1.35] mb-10 text-balance">
        {quote}
      </blockquote>
      <figcaption className="text-xs tracking-[0.25em] uppercase text-ink">
        — {author} · {role}
      </figcaption>
    </motion.figure>
  );
}

export function Testimonials() {
  return (
    <section className="bg-warm-white py-32 lg:py-48">
      <div className="space-y-32 lg:space-y-40">
        {testimonials.map((t) => (
          <Testimonial
            key={t.author}
            quote={t.quote}
            author={t.author}
            role={t.role}
          />
        ))}
      </div>
    </section>
  );
}
