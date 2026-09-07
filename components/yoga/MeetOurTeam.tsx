'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Ornament } from '@/components/shared/ornament';

// ─── Meet our team ───────────────────────────────────────────────────────────
// The people layer of /yoga. The schedule above answers what is on and when;
// this answers who is holding it. Portraits first, then the practices each one
// brings, then a way to keep following them.
//
// The disciplines arrive from the owners as one "•"-separated string, but they
// are a list, not a sentence: kept as an array so each practice can be read on
// its own, and set inline with hairline separators so Eliana's ten items wrap
// as quiet running text instead of a ten-line ladder beside Gabriela's three.

type Member = {
  name: string;
  /** Secondary to the name — rendered as a small mark on the same line. */
  country: string;
  disciplines: string[];
  /** Handle only; the URL and the leading @ are composed at render. */
  instagram: string;
  image: string;
};

const MEMBERS: Member[] = [
  {
    name: 'Nancy Goodfellow',
    country: 'USA',
    disciplines: ['Tantra Yoga Master Teacher', 'Breathwork', 'Embodiment Coach'],
    instagram: 'wildheart.yogini',
    image: '/images/yoga/our-team/nancy-usa.jpg',
  },
  {
    name: 'Antonia Paz',
    country: 'Chile',
    disciplines: [
      'Yoga Teacher',
      'Holistic Therapist',
      'Thai Massage',
      'Reiki',
      'Sound Healing',
      'Yoga Therapy',
      'Psychedelic-Assisted Therapy',
    ],
    instagram: 'anto.yogini',
    image: '/images/yoga/our-team/antonia-chile.jpg',
  },
  {
    name: 'Gabriela',
    country: 'Sweden',
    disciplines: ['Health Coach & Nutrition', 'Yoga Teacher', 'Meditation'],
    instagram: 'flowwithgabriella',
    image: '/images/yoga/our-team/gabriela-suecia.jpg',
  },
  {
    name: 'Eliana Martínez',
    country: 'Argentina',
    disciplines: [
      'Ontological Coach',
      'Nervous System & Trauma Practitioner',
      'Somatic Therapist',
      'Psychedelic-Assisted Therapy',
      'Breathwork',
      'Yoga Teacher',
      'Meditation',
      'Cryotherapy',
      'Reiki',
      'Access Bars',
    ],
    instagram: 'eli.mar.lov',
    image: '/images/yoga/our-team/eliana-argentina.jpg',
  },
  {
    name: 'Miguel del Mar',
    country: 'Spain',
    disciplines: [
      'Breathwork',
      'Sound Healing',
      'Craniosacral',
      'Meditation',
      'Massage Therapist',
      'Thai Yoga Massage Teacher',
      'Healing Retreats',
      'Medicine Guide',
    ],
    instagram: 'miguel_mypath_school',
    image: '/images/yoga/our-team/miguel.jpg',
  },
];

// Five people into three columns leaves two hanging on the left of the second
// row, reading as a gap someone forgot to fill. Widening the last two to close
// the row would work, but it would also promote them: these five are peers, and
// the grid should not invent a hierarchy the content does not have. So the
// columns are halved — six on desktop, four on tablet — every card spans two,
// and the short row is nudged forward by one half-column. Cards keep one width
// throughout; the remainder centres under the row above and reads as a
// deliberate pair. Card four opens the desktop remainder, card five the tablet
// one, and it resets its own offset at lg where card four already carries it.
const OFFSETS = ['', '', '', 'lg:col-start-2', 'md:col-start-2 lg:col-start-auto'];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function MeetOurTeam() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="w-fit">
          <Ornament
            src="/logos/moon-phase.png"
            className="h-8 md:h-9 mx-auto mb-5 lg:mb-6"
          />
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
          >
            Meet Our Team
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
          className="font-body text-sm text-ink leading-relaxed mt-6 lg:mt-8 max-w-2xl"
        >
          Meet the people who hold the space at House of Shakti — teachers and
          facilitators bringing their knowledge, presence, and unique practices
          to our community.
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 lg:gap-x-10 lg:gap-y-16 mt-14 lg:mt-16"
        >
          {MEMBERS.map((member, i) => (
            <motion.article
              key={member.name}
              variants={item}
              className={`md:col-span-2 ${OFFSETS[i] ?? ''}`}
            >
              {/* The portraits arrive between 3:4 and 5:6. 4:5 sits between the
                  two, so every frame crops by a sliver rather than one of them
                  losing a head. */}
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* The country rides the name line: it places the person without
                  claiming a row of its own. */}
              <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-snug mt-5 lg:mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span>{member.name}</span>
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-ink/70">
                  {member.country}
                </span>
              </h3>

              {/* Inline list items, not flex children: a separator glued to the
                  word before it keeps a dot from opening a wrapped line. */}
              <ul className="font-body text-xs text-ink/75 leading-[1.9] mt-3">
                {member.disciplines.map((discipline, j) => (
                  <li key={discipline} className="inline">
                    {discipline}
                    {j < member.disciplines.length - 1 && (
                      <span aria-hidden className="text-ink/30 px-1.5">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <a
                href={`https://www.instagram.com/${member.instagram}/`}
                // Five links whose only text is a handle: without this a screen
                // reader announces five bare handles with no destination.
                aria-label={`${member.name} on Instagram`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-body text-[11px] tracking-[0.05em] text-ink/70 hover:text-burgundy transition-colors duration-300 mt-4"
              >
                <Instagram aria-hidden className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>@{member.instagram}</span>
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
