'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, Variants, useInView } from 'framer-motion';

// The three sizes are presented as figures, not as price cards. Prices are
// deliberately absent: they are read from Supabase and rendered on /paquetes,
// so repeating them here would guarantee a stale number on the landing the
// first time the studio adjusts them.
type PackSize = { count: string; cadence: string; note: string };

const PACK_SIZES: PackSize[] = [
  {
    count: '5',
    cadence: 'About a class a week',
    note: 'A first rhythm. Enough to settle on a teacher and an hour that suit you.',
  },
  {
    count: '10',
    cadence: 'Two or three a week',
    note: 'A month of steady practice, without deciding anything in advance.',
  },
  {
    count: '20',
    cadence: 'A daily practice',
    note: 'For a long stay, and the lowest we go per class.',
  },
];

// The container itself never fades: only the children carry opacity, so the
// figures are not dimmed twice over by a parent that is still animating.
const figuresContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};

const figuresItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function ClassPacks() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        {/* Hairlines carry all the structure. The block sits on the page
            surface instead of inside a filled panel: a solid burgundy field is
            how the site signals a problem, which is why the previous version
            read as a system notice rather than an offer. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="border-t border-ink/15 pt-10 lg:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-16"
        >
          <div className="lg:col-span-7">
            <p className="font-body text-[11px] tracking-[0.28em] uppercase text-ink/70">
              Class packs
            </p>

            {/* The headline carries the mechanism, not the discount. The saving
                is stated once, in the paragraph, where it can be read plainly. */}
            <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mt-5">
              Buy once, come back one class at a time
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <p className="font-body text-sm text-ink leading-[1.7]">
              Five, ten or twenty classes bought together, each one costing less
              than booking it on its own. A pack is paid for once and spent
              slowly, whenever the week allows, with nothing to schedule ahead.
            </p>
          </div>
        </motion.div>

        {/* Figures strip. The three numerals share one size: the comparison
            only works if nothing is typographically pre-selected for the
            reader. Everything below them steps down two sizes at once so the
            hierarchy reads at a glance instead of as a flat paragraph. */}
        <motion.div
          variants={figuresContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="mt-14 lg:mt-20 border-t border-ink/15 grid grid-cols-1 md:grid-cols-3"
        >
          {PACK_SIZES.map((pack, i) => (
            <motion.div
              key={pack.count}
              variants={figuresItem}
              className={[
                'py-8 md:py-10 lg:py-12 border-b border-ink/15',
                i > 0 ? 'md:border-l md:border-ink/15 md:pl-8 lg:pl-12' : '',
                i < PACK_SIZES.length - 1 ? 'md:pr-8 lg:pr-12' : '',
              ].join(' ')}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display font-light text-ink text-5xl md:text-6xl leading-none tracking-[-0.02em]">
                  {pack.count}
                </span>
                <span className="font-body text-[10px] tracking-[0.24em] uppercase text-ink/70">
                  Classes
                </span>
              </div>

              {/* A real cadence rather than a rank: it tells the reader which
                  size fits the length of their stay. */}
              <p className="font-body text-sm text-ink leading-[1.7] mt-6">
                {pack.cadence}
              </p>

              <p className="font-body text-sm text-ink/70 leading-[1.7] mt-2 max-w-xs">
                {pack.note}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Operational detail is demoted below the rule: it matters at the
            moment of purchase, not while the reader is still deciding. The CTA
            comes first in the DOM so it precedes the small print on a phone. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.6 }}
          className="mt-10 lg:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-16"
        >
          <div className="lg:col-span-5">
            <Link
              href="/paquetes"
              className="inline-block bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300"
            >
              Buy a class pack
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
            <div>
              <p className="font-body text-[10px] tracking-[0.24em] uppercase text-ink/70">
                Your code
              </p>
              <p className="font-body text-xs text-ink/70 leading-[1.7] mt-3">
                We email you a personal code as soon as the payment clears. Use
                it to hold a place in any class on the schedule, with nothing
                more to pay when you book.
              </p>
            </div>

            <div>
              <p className="font-body text-[10px] tracking-[0.24em] uppercase text-ink/70">
                Payment
              </p>
              <p className="font-body text-xs text-ink/70 leading-[1.7] mt-3">
                Packs bought here are paid by card only, processed securely
                through Tilopay.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}