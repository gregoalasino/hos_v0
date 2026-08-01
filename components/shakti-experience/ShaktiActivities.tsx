'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

// TODO: swap placeholders for Shakti Experience photos of each activity.
const activities = [
  {
    title: 'Yoga',
    description:
      'Classes designed to create space in the body and support overall well-being, adapted to each participant’s level and intentions.',
    image: '/images/yoga/NE8A7702%201.webp',
  },
  {
    title: 'Massage therapy',
    description:
      'Restorative massages offered by specialized therapists for deep relaxation and renewal.',
    image: '/images/sanctuary/271A0759_websize%201.webp',
  },
  {
    title: 'Sauna & ice bath',
    description:
      'Detox and relax in our private sauna, followed by a cold plunge to stimulate circulation and revitalize the nervous system.',
    image: '/images/contrast_therapy/IMG_7067%201.webp',
  },
  {
    title: 'Nature experience',
    description:
      'Waterfall hikes, boat trips for dolphin and whale watching, snorkeling in crystal-clear waters, horseback riding, and surf lessons.',
    image: '/images/sanctuary/271A0766_websize%201.webp',
  },
  {
    title: 'Food & support',
    description:
      'Conscious, nourishing meals prepared with organic, local, and seafood ingredients — with continuous support from the House of Shakti team.',
    image: '/images/sanctuary/271A0769_websize%201.webp',
  },
];

const cardsContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function ShaktiActivities() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-warm-white py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        {/* Heading */}
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            Days shaped around you.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
            className="font-body text-sm text-ink leading-[1.7] mt-6"
          >
            Add or remove any activity or service you wish, creating a personalized experience
            tailored to your needs.
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          variants={cardsContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-16 lg:mt-20"
        >
          {activities.map((activity) => (
            <motion.article key={activity.title} variants={card}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={activity.image} alt="" aria-hidden className="w-full h-full object-cover" />
              </div>
              <h3 className="font-display font-light text-ink text-lg lg:text-xl leading-snug mt-6 mb-3">
                {activity.title}
              </h3>
              <p className="font-body text-sm text-ink leading-relaxed">{activity.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
