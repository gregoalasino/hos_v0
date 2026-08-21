'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

// House of Shakti Yoga Sanctuary — a short place-setting block between the
// teachers and the pricing, linking through to the accommodations page.
export function YTTSanctuary() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div
        ref={ref}
        className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center"
      >
        {/* Text */}
        <div className="order-2 lg:order-none">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            House of Shakti Yoga Sanctuary
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-body text-sm text-ink leading-[1.8] mt-6 max-w-xl"
          >
            Where the jungle meets beach, and ancient wisdom meets modern comfort. We are located in
            Santiago, Costa Rica just 7 minutes from the beach in Playa Hermosa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
          >
            <Link
              href="/stay-with-us"
              className="inline-block bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300 mt-9"
            >
              View accommodations
            </Link>
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="relative aspect-[4/5] overflow-hidden order-1 lg:order-none mb-12 lg:mb-0"
        >
          <img
            src="/images/sanctuary/271A0759_websize%201.webp"
            alt="House of Shakti Yoga Sanctuary"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
