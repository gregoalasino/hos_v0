'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ornament } from '@/components/landing/ornament';
import { TrackArrows } from '@/components/landing/TrackArrows';
import { useCarousel } from '@/hooks/use-carousel';
import { useDragScroll } from '@/hooks/use-drag-scroll';

// ─── Special Activities ──────────────────────────────────────────────────────
// The layer around the practice on /yoga: the reader has just seen the class
// schedule, and this is what the house offers in the hours between mats. Same
// architecture as Enhance your experience on /stay-with-us — copy and controls
// in the first column, a horizontal track in the other two — so a guest moving
// between the two pages reads one language instead of learning a second.
//
// Every one of these happens at the house, so the cards carry no location mark
// and open on the title. The order is the owners': the bodily contrasts first,
// then the quieter energetic work, then the ceremonies.

type Activity = {
  title: string;
  description: string;
  image: string;
};

const img = (slug: string) => `/images/yoga/special-activities/${slug}.webp`;

const ACTIVITIES: Activity[] = [
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
    image: img('sacred-medicine-ceremony'),
  },
  {
    title: 'Cacao & Fire Ceremony',
    description:
      'A sacred ritual of cacao and fire, inviting connection, gratitude, and heart opening.',
    image: img('cacao-fire-ceremony'),
  },
  {
    title: 'Microdose & Sound Healing Ceremony',
    description:
      'A heart-opening microdosing ceremony with cacao, breathwork, sound healing, and live music. A gentle journey inward, closing with integration and fresh fruits.',
    image: img('microdose-sound-healing'),
  },
];

export function SpecialActivities() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { trackRef, atStart, atEnd, step, hasOverflow } = useCarousel<HTMLDivElement>();
  const { dragHandlers } = useDragScroll(trackRef);

  return (
    <section className="bg-warm-white py-20 lg:py-28">
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
              Special Activities
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="font-body text-sm text-ink leading-relaxed mt-6 lg:mt-10 max-w-full lg:max-w-xs"
          >
            The practice does not end on the mat. These are the rituals the
            house holds around it, for the hours between classes.
          </motion.p>

          {/* How they are booked. Sits with the invitation rather than under
              the track: the question — "and how do I actually get these?" —
              arrives while the reader is still looking at the first card, not
              after the seventh. It is practical information, in a quieter
              voice, and the step down in size and colour is what sets it apart. */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
            className="font-body text-xs text-ink/75 leading-[1.7] mt-8 lg:mt-10 max-w-full lg:max-w-xs"
          >
            All of them are arranged with our team at reception.
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
            aria-label="Special activities at House of Shakti"
            tabIndex={0}
            className="
              flex gap-5 lg:gap-6
              overflow-x-auto snap-x snap-proximity scroll-smooth
              cursor-grab select-none
              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              -mr-[5vw] md:-mr-[10vw] lg:mr-0
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40
            "
          >
            {ACTIVITIES.map((activity, i) => (
              <motion.article
                key={activity.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                // The stagger stops climbing after the sixth card: past that
                // they enter off-screen anyway, and a late card waiting most of
                // a second is a card that animates in after the reader has
                // already scrolled to it.
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
                    decoding="async"
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
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
