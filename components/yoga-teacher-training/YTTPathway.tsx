'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';
import { useMessages } from 'next-intl';

type Phase = {
  tag: string;
  title: string;
  place: string;
  body: string;
  format: 'in-person' | 'online';
  formatLabel: string;
};

// Text lives in the dictionary; only the structural format keys live here,
// zipped with it by index at render.
const PHASE_FORMATS: Phase['format'][] = ['in-person', 'online'];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

function FormatPill({ phase }: { phase: Phase }) {
  const Icon = phase.format === 'in-person' ? MapPin : Globe;
  const classes =
    phase.format === 'in-person'
      ? 'bg-cream/15 text-cream'
      : 'bg-ink/5 text-ink/70 ring-1 ring-inset ring-ink/15';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-body text-[10px] tracking-[0.18em] uppercase ${classes}`}
    >
      <Icon aria-hidden strokeWidth={1.5} className="h-3.5 w-3.5" />
      {phase.formatLabel}
    </span>
  );
}

function PhaseCard({ phase }: { phase: Phase }) {
  const inPerson = phase.format === 'in-person';

  // In-person = solid, grounded, the anchor of the pathway.
  // Online = lighter, dashed border to read as the optional, remote companion.
  const cardClasses = inPerson
    ? 'bg-dark text-cream border border-dark'
    : 'bg-warm-white text-ink border border-dashed border-ink/30';

  return (
    <motion.article variants={item} className={`p-8 md:p-10 flex flex-col ${cardClasses}`}>
      <div className="flex items-center justify-between gap-4">
        <p
          className={`font-body text-[10px] tracking-[0.25em] uppercase ${
            inPerson ? 'text-cream/60' : 'text-burgundy'
          }`}
        >
          {phase.tag}
        </p>
        <FormatPill phase={phase} />
      </div>

      <h3
        className={`font-display font-light text-2xl leading-snug mt-5 ${
          inPerson ? 'text-cream' : 'text-ink'
        }`}
      >
        {phase.title}
      </h3>
      <p
        className={`font-body text-xs tracking-[0.05em] uppercase mt-3 ${
          inPerson ? 'text-cream/50' : 'text-ink/50'
        }`}
      >
        {phase.place}
      </p>
      <p
        className={`font-body text-sm leading-[1.8] mt-6 ${
          inPerson ? 'text-cream/75' : 'text-ink'
        }`}
      >
        {phase.body}
      </p>
    </motion.article>
  );
}

export function YTTPathway() {
  const t = useMessages().ytt;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const phases: Phase[] = t.pathway.phases.map((phase, i) => ({
    ...phase,
    format: PHASE_FORMATS[i],
  }));

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
            {t.pathway.heading}
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-8 lg:gap-10 mt-14 lg:mt-16 items-stretch"
        >
          {phases.map((phase) => (
            <PhaseCard key={phase.tag} phase={phase} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
          className="mt-10 lg:mt-12 border-l-2 border-burgundy pl-6 md:pl-8 max-w-3xl"
        >
          <p className="font-body text-sm md:text-base text-ink leading-[1.8]">
            {t.pathway.rytBefore}
            <span className="text-burgundy">{t.pathway.rytHighlight}</span>
            {t.pathway.rytAfter}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
