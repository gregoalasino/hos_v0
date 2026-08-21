'use client';

import { useRef } from 'react';
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
// All eleven ride one track, in the order the owners present them: everything
// at the property first, then everything beyond it. Where each happens is a
// mark on the card, so a guest planning their days can still tell a massage
// down the path from a morning out on a boat.

type Activity = {
  /** Where it happens. Rendered as a small mark above the title. */
  where: 'On site' | 'Off site';
  title: string;
  description: string;
  /** Optional secondary line ("Optional: …"). */
  note?: string;
  image: string;
};

const img = (slug: string) => `/images/stay-with-us/activities/activity-${slug}.webp`;

const ACTIVITIES: Activity[] = [
  {
    where: 'On site',
    title: 'Yoga Classes',
    description:
      'Move, breathe, and reconnect through mindful yoga practices designed to support balance, presence, and wellbeing.',
    image: img('yoga'),
  },
  {
    where: 'On site',
    title: 'Sauna & Ice Bath',
    description:
      'A powerful contrast experience to relax, reset, and reconnect with your body through heat and cold.',
    image: img('sauna-ice-bath'),
  },
  {
    where: 'On site',
    title: 'Massages',
    description:
      'Relax and reconnect with your body through therapeutic, relaxing, Thai, or deep tissue massage.',
    image: img('massage'),
  },
  {
    where: 'On site',
    title: 'Sound Healing',
    description:
      'Relax and restore balance through the healing power of sound and vibration.',
    image: img('sound-healing'),
  },
  {
    where: 'On site',
    title: 'Reiki & Access Bars',
    description:
      'A deeply relaxing experience designed to restore energetic balance and inner calm.',
    image: img('reiki-access-bars'),
  },
  {
    where: 'On site',
    title: 'Sacred Medicine Ceremony',
    description:
      'A guided and intentional experience for self-exploration, connection, and personal growth.',
    image: img('sacred-medicine'),
  },
  {
    where: 'On site',
    title: 'Cacao & Fire Ceremony',
    description:
      'A sacred ritual of cacao and fire, inviting connection, gratitude, and heart opening.',
    image: img('cacao-fire-ceremony'),
  },
  {
    where: 'Off site',
    title: 'Boat Tour',
    description:
      "Explore the peninsula's beautiful beaches, snorkel in crystal-clear waters, and enjoy a day in nature.",
    note: 'Optional: bioluminescence experience.',
    image: img('boat-tour'),
  },
  {
    where: 'Off site',
    title: 'Jungle Hike',
    description:
      'A refreshing jungle adventure to a hidden freshwater waterfall, just 40 minutes away.',
    image: img('jungle-hike'),
  },
  {
    where: 'Off site',
    title: 'Surf Lessons',
    description:
      "Learn to surf or improve your skills in Santa Teresa's best spots. Shared and private lessons available.",
    image: img('surf'),
  },
  {
    where: 'Off site',
    title: 'Horseback Riding',
    description:
      'Discover beaches, jungle, and mountain trails on a beautiful sunset horseback ride. Shared or private options available.',
    image: img('horseback-riding'),
  },
];

export function EnhanceYourExperience() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { trackRef, atStart, atEnd, step, hasOverflow } = useCarousel<HTMLDivElement>();
  const { dragHandlers } = useDragScroll(trackRef);

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

          {/* How they are booked. Sits with the invitation rather than under
              the track: the question — "and how do I actually get these?" —
              arrives while the reader is still looking at the first card, not
              after the eleventh. A hairline separates it from the invitation
              above; it is practical information, in a quieter voice. */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="font-body text-xs text-ink/75 leading-[1.7] mt-8 lg:mt-10 pt-6 border-t border-ink/15 max-w-full lg:max-w-xs"
          >
            Add any of these while booking your stay, or arrange them later
            with our team at reception.
          </motion.p>

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
              the entire strip. */}
          <div
            ref={trackRef}
            {...dragHandlers}
            role="region"
            aria-label="Activities at House of Shakti and beyond"
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
            {ACTIVITIES.map((activity, i) => (
                <motion.article
                  key={activity.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  // The stagger stops climbing after the sixth card: past that
                  // they enter off-screen anyway, and an eleventh card waiting
                  // most of a second is a card that animates in after the
                  // reader has already scrolled to it.
                  transition={{
                    duration: 0.9,
                    ease: 'easeOut',
                    delay: 0.08 * Math.min(i, 5),
                  }}
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

                  {/* The toggle is gone, but where a thing happens is still
                      information a guest planning days wants: a massage is
                      down the path, a boat tour is a morning out. Kept as a
                      mark on the card rather than a control above the row. */}
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-ink/70 mt-4">
                    {activity.where}
                  </p>
                  <h3 className="font-display font-light text-ink text-base lg:text-lg leading-snug mt-2">
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
