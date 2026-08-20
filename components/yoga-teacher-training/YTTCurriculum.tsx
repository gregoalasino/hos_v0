'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';

const modules = [
  {
    n: '01',
    title: 'The Tantric View',
    focus: 'Philosophy & Worldview',
    hours: '15 hrs',
    points: [
      'What Tantra is — dispelling myths, entering the real tradition',
      'Kashmir Shaivism & non-dual philosophy',
      'Spanda — the divine pulse; Shakti & Shiva, the cosmic polarity within the body',
      'The Tattvas — 36 elements of reality; karma, dharma & the awakened life',
    ],
  },
  {
    n: '02',
    title: 'The Living Body',
    focus: 'Embodied Anatomy & Tantric Physiology',
    hours: '20 hrs',
    points: [
      'The koshas through a Tantric lens',
      'Prana, nadis & the subtle body',
      'The chakra system — beyond the basics',
      'Kundalini — theory, signs of awakening, safe facilitation; somatic awareness',
    ],
  },
  {
    n: '03',
    title: 'Sacred Current Practices',
    focus: 'Advanced Asana & Movement',
    hours: '35 hrs',
    points: [
      'Asana as ritual — moving with intention',
      'Advanced sequencing through a Tantric arc',
      'Working with polarity in the body',
      'Adjustment & touch as sacred transmission',
    ],
  },
  {
    n: '04',
    title: 'Breath as Gateway',
    focus: 'Pranayama & Breathwork',
    hours: '15 hrs',
    points: [
      'Classical pranayama — nadi shodhana, kapalabhati, bhastrika',
      'Tantric breathwork — breath as Shakti activation',
      'Circular breathing & altered states',
      'Facilitating breathwork for groups — safety & holding space',
    ],
  },
  {
    n: '05',
    title: 'Sound, Mantra & Meditation',
    focus: 'Inner Technologies',
    hours: '5 hrs',
    points: [
      'Mantra as vibrational medicine — bija mantras, seed sounds',
      'Nada yoga — the yoga of sacred sound',
      'Tantric meditation — pratyahara, dharana, dhyana',
      'Guided visualization & inner journeying',
    ],
  },
  {
    n: '06',
    title: 'The Awakened Teacher',
    focus: 'Holding Sacred Space',
    hours: '10 hrs',
    points: [
      'Ethics of teaching advanced & devotional practices',
      'Trauma-informed facilitation in Tantric contexts',
      'Designing rituals & ceremonial openings/closings',
      'Building your offering — retreats, intensives, immersions',
    ],
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const card: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};

export function YTTCurriculum() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} data-surface="dark" className="bg-dark text-cream py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-cream text-3xl md:text-4xl leading-[1.15]"
          >
            Six modules. 100 hours of embodied study.
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-12 mt-16 lg:mt-20"
        >
          {modules.map((mod) => (
            <motion.article
              key={mod.n}
              variants={card}
              className="border-t border-cream/15 pt-8"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display font-light text-cream/40 text-2xl">{mod.n}</span>
                <div>
                  <h3 className="font-display font-light text-cream text-xl lg:text-2xl leading-snug">
                    {mod.title}
                  </h3>
                  <p className="font-body text-[11px] tracking-[0.15em] uppercase text-cream/55 mt-2">
                    {mod.focus} · {mod.hours}
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {mod.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-cream/50" />
                    <span className="font-body text-sm text-cream/80 leading-[1.6]">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
