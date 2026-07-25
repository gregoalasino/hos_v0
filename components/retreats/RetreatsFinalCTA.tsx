'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

export function RetreatsFinalCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="w-[90%] md:w-[80%] max-w-3xl mx-auto text-center"
      >
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">
          Join Us
        </p>
        <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mt-6">
          Find the retreat that&apos;s calling you.
        </h2>
        <Link
          href="/contact"
          className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer mt-10"
        >
          Get in touch
        </Link>
      </motion.div>
    </section>
  );
}
