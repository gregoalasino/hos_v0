"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "House of Shakti transformed not just my practice, but my entire approach to life. The combination of expert guidance, stunning surroundings, and soulful community is truly unparalleled.",
    author: "Sarah Mitchell",
    role: "Wellness Entrepreneur",
    image: "/images/testimonial-1.jpg",
  },
  {
    quote:
      "Every detail speaks to a deep understanding of what the soul needs to heal. I arrived exhausted and left with a renewed sense of purpose and inner peace.",
    author: "James Chen",
    role: "Creative Director",
    image: "/images/testimonial-2.jpg",
  },
  {
    quote:
      "The retreat exceeded every expectation. The teachers, the food, the space—everything flows together in perfect harmony. I've found my annual sanctuary.",
    author: "Elena Rodriguez",
    role: "Architect",
    image: "/images/testimonial-3.jpg",
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

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 lg:py-40 bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-4 block">
            Testimonials
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-dark text-balance">
            Words from Our Guests
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-warm-white rounded-md p-8 lg:p-10"
            >
              <Quote className="w-10 h-10 text-burgundy/30 mb-6" />

              <p className="text-dark/80 leading-relaxed mb-8 text-lg">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-serif text-lg text-dark">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-dark/60">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
