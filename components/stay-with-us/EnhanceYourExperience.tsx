'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ornament } from '@/components/landing/ornament';
import { TrackArrows } from '@/components/landing/TrackArrows';
import { useCarousel } from '@/hooks/use-carousel';
import { useDragScroll } from '@/hooks/use-drag-scroll';

// ─── Enhance your experience ─────────────────────────────────────────────────
// The activities layer of /stay-with-us: the guest has just chosen where to
// sleep, and this is everything the house offers to fill the days — at the
// property and beyond it. Same architecture as Featured Experiences, the
// section that follows: copy and controls in the first column, a horizontal
// track in the other two. The page keeps one language instead of learning a
// new one.
//
// The eleven activities split into two real groups, and the guest's question
// splits the same way — "what can I do at the house?" and "what's out there?"
// — so the split is a toggle (the navbar's EN|ES register), not one endless
// ribbon: eleven cards in a single strip is a track nobody finishes, and the
// group boundary would drift past unseen mid-scroll.

type Activity = {
  title: string;
  description: string;
  /** Optional secondary line ("Optional: …"). */
  note?: string;
  image: string;
};

const img = (slug: string) => `/images/stay-with-us/activities/activity-${slug}.webp`;

const ON_SITE: Activity[] = [
  {
    title: 'Yoga Classes',
    description:
      'Move, breathe, and reconnect through mindful yoga practices designed to support balance, presence, and wellbeing.',
    image: img('yoga'),
  },
  {
    title: 'Sauna & Ice Bath',
    description:
      'A powerful contrast experience to relax, reset, and reconnect with your body through heat and cold.',
    image: img('sauna-ice-bath'),
  },
  {
    title: 'Massages',
    description:
      'Relax and reconnect with your body through therapeutic, relaxing, Thai, or deep tissue massage.',
    image: img('massage'),
  },
  {
    title: 'Sound Healing',
    description:
      'Relax and restore balance through the healing power of sound and vibration.',
    image: img('sound-healing'),
  },
  {
    title: 'Reiki & Access Bars',
    description:
      'A deeply relaxing experience designed to restore energetic balance and inner calm.',
    image: img('reiki-access-bars'),
  },
  {
    title: 'Sacred Medicine Ceremony',
    description:
      'A guided and intentional experience for self-exploration, connection, and personal growth.',
    image: img('sacred-medicine'),
  },
  {
    title: 'Cacao & Fire Ceremony',
    description:
      'A sacred ritual of cacao and fire, inviting connection, gratitude, and heart opening.',
    image: img('cacao-fire-ceremony'),
  },
];

const OFF_SITE: Activity[] = [
  {
    title: 'Boat Tour',
    description:
      "Explore the peninsula's beautiful beaches, snorkel in crystal-clear waters, and enjoy a day in nature.",
    note: 'Optional: bioluminescence experience.',
    image: img('boat-tour'),
  },
  {
    title: 'Jungle Hike',
    description:
      'A refreshing jungle adventure to a hidden freshwater waterfall, just 40 minutes away.',
    image: img('jungle-hike'),
  },
  {
    title: 'Surf Lessons',
    description:
      "Learn to surf or improve your skills in Santa Teresa's best spots. Shared and private lessons available.",
    image: img('surf'),
  },
  {
    title: 'Horseback Riding',
    description:
      'Discover beaches, jungle, and mountain trails on a beautiful sunset horseback ride. Shared or private options available.',
    image: img('horseback-riding'),
  },
];

const GROUPS = [
  { key: 'on' as const, label: 'On site', activities: ON_SITE },
  { key: 'off' as const, label: 'Off site', activities: OFF_SITE },
];

export function EnhanceYourExperience() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [group, setGroup] = useState<'on' | 'off'>('on');
  const { trackRef, atStart, atEnd, step, resetToStart, hasOverflow } =
    useCarousel<HTMLDivElement>();
  const { dragHandlers } = useDragScroll(trackRef);

  const activities = GROUPS.find((g) => g.key === group)!.activities;

  // Switching groups swaps the cards under the same track node, so the
  // listeners the carousel hook attached survive — but the node's scrollWidth
  // changes without its border-box moving, which no ResizeObserver reports.
  // resetToStart walks it back and re-measures, and also cancels any fallback
  // jump a just-pressed arrow left pending — a stale timer firing after the
  // swap would fling the fresh group a step in.
  useEffect(() => {
    resetToStart();
  }, [group, resetToStart]);

  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div
        ref={sectionRef}
        className="w-[90%] md:w-[80%] mx-auto lg:grid lg:grid-cols-3 lg:gap-12"
      >
        {/* ── Left — the invitation and the controls ─────────────────── */}
        <div className="lg:col-span-1 lg:pr-12">
          <div className="w-fit">
            <Ornament
              src="/logos/crescent-sun-rays.png"
              className="h-8 md:h-9 mx-auto mb-5 lg:mb-6"
            />
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
              className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]"
            >
              Enhance your experience
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="font-body text-sm text-ink leading-relaxed mt-6 lg:mt-10 max-w-full lg:max-w-xs"
          >
            Enhance your stay with meaningful experiences, both at House of
            Shakti and beyond.
          </motion.p>

          {/* Where — the navbar's EN | ES register: two marks and a hairline.
              The active group carries full ink; the other is an outline of
              itself until approached. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            role="group"
            aria-label="Choose activities on site or off site"
            className="flex items-center gap-3.5 mt-8 lg:mt-10"
          >
            {GROUPS.map((g, i) => (
              <span key={g.key} className="flex items-center gap-3.5">
                {i > 0 && <span aria-hidden className="h-3 w-px bg-ink/25" />}
                <button
                  type="button"
                  onClick={() => setGroup(g.key)}
                  aria-pressed={group === g.key}
                  className={`font-body text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 ${
                    group === g.key ? 'text-ink' : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  {g.label}
                </button>
              </span>
            ))}
          </motion.div>

          {/* Arrows sit with the copy, never over the photographs. Hidden
              outright when every card already fits. */}
          {hasOverflow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
              className="mt-8 lg:mt-10"
            >
              <TrackArrows
                atStart={atStart}
                atEnd={atEnd}
                onPrev={() => step(-1)}
                onNext={() => step(1)}
              />
            </motion.div>
          )}
        </div>

        {/* ── Right — the track ──────────────────────────────────────── */}
        <div className="lg:col-span-2 mt-12 lg:mt-0">
          {/* The track starts on the container's left edge and runs off the
              right one — a card cut by the screen edge says the row continues.
              The gutter cancelled is exactly 5vw of viewport, 10vw from md,
              since the container is 90%/80% and centred. */}
          {/* The cards are the track's DIRECT children, never wrapped: the
              carousel hook steps by measuring the track's first child plus
              its column-gap, and a wrapper would make one arrow press jump
              the entire strip. Keying each card by group remounts them on a
              switch, so the row replays its entrance — a turn of the page
              rather than a flicker. */}
          <div
            ref={trackRef}
            {...dragHandlers}
            role="region"
            aria-label={group === 'on' ? 'On-site activities' : 'Off-site activities'}
            tabIndex={0}
            className="
              flex gap-5 lg:gap-6
              overflow-x-auto snap-x snap-proximity scroll-smooth
              cursor-grab select-none
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              -mr-[5vw] md:-mr-[10vw] lg:mr-0
              focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40
            "
          >
            {activities.map((activity, i) => (
                <motion.article
                  key={`${group}-${activity.title}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: 0.08 * i }}
                  className="
                    flex-shrink-0 snap-start
                    w-[62vw] max-w-[290px]
                    md:w-[32vw] lg:w-[220px] xl:w-[270px]
                  "
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-ink/5">
                    <img
                      src={activity.image}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>

                  <h3 className="font-display font-light text-ink text-base lg:text-lg leading-snug mt-4">
                    {activity.title}
                  </h3>
                  <p className="font-body text-sm text-ink leading-relaxed mt-2">
                    {activity.description}
                  </p>
                  {activity.note && (
                    <p className="font-body text-xs text-ink/75 leading-relaxed mt-2">
                      {activity.note}
                    </p>
                  )}
                </motion.article>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
