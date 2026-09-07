'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { useMessages } from 'next-intl';

// Names, handles and portraits are constants; the bios live in the dictionary
// (both languages), zipped by index at render.
const TEACHERS = [
  {
    name: 'Nancy Goodfellow',
    handle: '@wildheart.yogini',
    image: '/images/teachers/nancy.webp',
  },
  {
    name: 'Nayla Tawa',
    handle: '@naylatawa · @thatbreathchick',
    image: '/images/teachers/nayla-profile.webp',
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function YTTTeachers() {
  const t = useMessages().ytt;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            {t.teachers.heading}
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-10 lg:gap-16 mt-14 lg:mt-16"
        >
          {TEACHERS.map((teacher, i) => (
            <motion.article key={teacher.name} variants={item}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display font-light text-ink text-2xl leading-snug mt-6">
                {teacher.name}
              </h3>
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-burgundy mt-2">
                {teacher.handle}
              </p>
              <div className="mt-5 space-y-4">
                {t.teachers.bios[i].map((para, j) => (
                  <p key={j} className="font-body text-sm text-ink leading-[1.8]">
                    {para}
                  </p>
                ))}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
