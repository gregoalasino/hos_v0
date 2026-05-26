'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import type { Retreat } from '@/lib/retreats';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function RetreatHosts({ retreat }: { retreat: Retreat }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const count = retreat.hosts.length;
  // Grid columns adapt to host count for the right rhythm.
  const gridCols =
    count === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
    count === 2 ? 'grid grid-cols-1 md:grid-cols-2' :
    'grid grid-cols-1 md:grid-cols-3';

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mb-16 lg:mb-20"
        >
          {retreat.hostsHeading}
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className={`${gridCols} gap-8 lg:gap-12`}
        >
          {retreat.hosts.map((host) => (
            <motion.article key={host.name} variants={itemVariants}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={host.image} alt={host.name} className="w-full h-full object-cover" />
              </div>

              <div className="mt-6">
                <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-tight">
                  {host.name}
                </h3>
                {host.handle && (
                  <p className="font-body text-xs tracking-[0.1em] text-ink mt-1">
                    {host.handle}
                  </p>
                )}
                <p className="font-body text-sm text-ink leading-relaxed mt-3">
                  {host.role}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
