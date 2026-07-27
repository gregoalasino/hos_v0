'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import type { Retreat } from '@/lib/retreats';

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export function RetreatForYou({ retreat }: { retreat: Retreat }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-center">
          {/* LEFT — heading + list */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mb-10 lg:mb-12"
            >
              {retreat.forYouHeading}
            </motion.h2>

            <motion.ul
              variants={listContainer}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="space-y-6"
            >
              {retreat.forYouItems.map((item) => (
                <motion.li
                  key={item}
                  variants={listItem}
                  className="flex items-start gap-4"
                >
                  <span aria-hidden className="font-body text-base text-ink select-none">—</span>
                  <span className="font-body text-sm text-ink leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* RIGHT — image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <img
              src={retreat.forYouImage}
              alt=""
              aria-hidden
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
