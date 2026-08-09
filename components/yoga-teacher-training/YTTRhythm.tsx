'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const schedule = [
  {
    time: '8:00 AM – 11:30 AM',
    title: 'Morning Practice',
    detail: 'Breathwork · Tantra Vinyasa · Meditation',
  },
  { time: '11:30 AM', title: 'Brunch & noble silence', detail: '' },
  {
    time: '2:00 PM – 6:00 PM',
    title: 'Asana Lab & teaching methodology',
    detail: 'Lectures · Workshops · Embodiment practices',
  },
  { time: '6:00 PM', title: 'Dinner & Satsang', detail: '' },
  {
    time: '7:30 PM',
    title: 'Evening Integration',
    detail: 'Sauna & Ice Bath · Ritual · Group Reflection around fire pit',
  },
];

// TODO: swap for a YTT / property photo when available.
const IMAGE = '/images/sanctuary/271A0722_websize%201.webp';

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};

export function YTTRhythm() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-5 lg:gap-16 lg:items-start">
        {/* Text + timeline */}
        <div className="lg:col-span-3">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            Your Daily Schedule
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-body text-xs tracking-[0.2em] uppercase text-burgundy mt-4"
          >
            Monday to Saturday
          </motion.p>

          <motion.div
            variants={container}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-12 space-y-8"
          >
            {schedule.map((block) => (
              <motion.div
                key={block.title}
                variants={item}
                className="border-l border-ink/15 pl-6"
              >
                <p className="font-body text-xs tracking-[0.15em] uppercase text-burgundy">
                  {block.time}
                </p>
                <h3 className="font-display font-light text-ink text-lg leading-snug mt-2">
                  {block.title}
                </h3>
                {block.detail && (
                  <p className="font-body text-sm text-ink/80 leading-[1.7] mt-1">{block.detail}</p>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="font-body text-sm text-ink/70 italic mt-10"
          >
            *2nd &amp; 3rd Sundays — free day to play!
          </motion.p>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
          className="relative aspect-[4/5] overflow-hidden mt-12 lg:mt-0 lg:col-span-2 lg:sticky lg:top-24"
        >
          <img src={IMAGE} alt="" aria-hidden className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
