"use client";

import { motion } from "framer-motion";

// Small decorative brand mark used as a delicate section seal / divider.
// Purely ornamental — hidden from assistive tech and non-interactive.
// Fades + rises on scroll into view, matching the site's 1.2s ease-out motion.
type OrnamentProps = {
  src: string;
  className?: string;
};

export function Ornament({ src, className = "" }: OrnamentProps) {
  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`block w-auto select-none pointer-events-none ${className}`}
    />
  );
}
