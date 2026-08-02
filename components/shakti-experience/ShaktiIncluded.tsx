'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const included = [
  'Nights of accommodation at House of Shakti',
  'Yoga classes',
  'Nature experience (including transportation)',
  'Sauna & ice bath sessions',
  'Massage',
  'Daily breakfast',
  'Support from the House of Shakti team',
  'Welcome gift',
];

const notIncluded = [
  {
    title: 'Flights & transfers',
    body: 'Flights and ground transportation are not included. We are happy to advise you on the best options and provide trusted local contacts.',
  },
  {
    title: 'Visa',
    body: 'Many nationalities receive a free 180-day tourist visa upon arrival in Costa Rica. Regulations vary, so please check official requirements. An exit ticket is required upon entry.',
  },
  {
    title: 'Travel insurance',
    body: 'We strongly recommend having travel insurance to cover medical emergencies or unforeseen circumstances.',
  },
  {
    title: 'Dinner',
    body: 'Dinner is not included. Guests are welcome to cook at the house or explore the many restaurants in Santa Teresa, known for its diverse culinary scene.',
  },
];

const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

export function ShaktiIncluded() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-dark text-cream py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-2 lg:gap-20">
        {/* Included */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-cream text-3xl md:text-4xl leading-[1.15]"
          >
            Everything considered.
          </motion.h2>

          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-10 space-y-4"
          >
            {included.map((item) => (
              <motion.li
                key={item}
                variants={listItem}
                className="flex gap-4 border-b border-cream/15 pb-4"
              >
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cream/70" />
                <span className="font-body text-sm text-cream/90 leading-[1.6]">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Not included — carries its own heading, mirroring the left column.
            Without it the list of exclusions reads as if it were included. */}
        <div className="mt-16 lg:mt-0">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-cream text-3xl md:text-4xl leading-[1.15]"
          >
            Not included.
          </motion.h2>

          <motion.div
            variants={listContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="mt-10 space-y-8"
          >
            {notIncluded.map((item) => (
              <motion.div key={item.title} variants={listItem}>
                <h3 className="font-display font-light text-cream text-lg leading-snug">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-cream/70 leading-[1.7] mt-2">{item.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
