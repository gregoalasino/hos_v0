'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

// TODO: swap for the correct portraits of each teacher when available.
const teachers = [
  {
    name: 'Nancy Goodfellow',
    handle: '@wildheart.yogini',
    image: '/images/teachers/Dise%C3%B1o%20sin%20t%C3%ADtulo%20(8)%201.webp',
    bio: [
      'Nancy brings together years of experience in yoga, embodiment practices, nervous system regulation, conscious leadership, and transformational retreat facilitation.',
      'Her teaching style is compassionate, authentic, and deeply experiential, weaving the timeless wisdom of Tantra with modern somatic approaches. She believes yoga is not simply something we practice — it is a way of living.',
    ],
  },
  {
    name: 'Nayla Tawa',
    handle: '@naylatawa · @thatbreathchick',
    image: '/images/teachers/rayo_verde-249%201.webp',
    bio: [
      'Nayla is an internationally certified breath and mindfulness coach, Yoga Alliance–certified teacher, and motivational speaker with 2,500+ hours of training.',
      'She studied in India for many months among Himalayan masters and other world-renowned teachers. A survivor of a near-death experience, she now teaches on breath, mindfulness, and resilience.',
    ],
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
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
          >
            Meet Your Teachers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-6"
          >
            Guided with presence and heart.
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-10 lg:gap-16 mt-14 lg:mt-16"
        >
          {teachers.map((teacher) => (
            <motion.article key={teacher.name} variants={item}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display font-light text-ink text-2xl leading-snug mt-6">
                {teacher.name}
              </h3>
              <p className="font-body text-[11px] tracking-[0.15em] uppercase text-burgundy mt-2">
                {teacher.handle}
              </p>
              <div className="mt-5 space-y-4">
                {teacher.bio.map((para, i) => (
                  <p key={i} className="font-body text-sm text-ink leading-[1.8]">
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
