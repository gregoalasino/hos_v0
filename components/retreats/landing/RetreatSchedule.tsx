'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Retreat, RetreatDay } from '@/lib/retreats';

function ScheduleDayRow({ day, index, isFirst }: { day: RetreatDay; index: number; isFirst: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const dayNumber = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className={`py-10 lg:py-12 ${isFirst ? '' : 'border-t border-ink/10'}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* LEFT — day number + title */}
        <div className="lg:col-span-3">
          <p className="font-display font-light text-burgundy text-5xl lg:text-6xl leading-none">
            {dayNumber}
          </p>
          <p className="font-display font-light text-ink text-xl leading-tight mt-3">
            {day.title}
          </p>
        </div>

        {/* RIGHT — activities */}
        <ul className="lg:col-span-9 space-y-4 lg:pt-2">
          {day.activities.map((activity) => (
            <li key={activity} className="flex items-start gap-4">
              <span aria-hidden className="font-body text-base text-ink select-none">—</span>
              <span className="font-body text-sm text-ink leading-relaxed">{activity}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function RetreatSchedule({ retreat }: { retreat: Retreat }) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] max-w-5xl mx-auto">
        {/* Header — eyebrow intentionally omitted for cleaner framing */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="mb-16 lg:mb-20"
        >
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
            {retreat.scheduleHeading}
          </h2>
        </motion.div>

        {/* Day blocks */}
        <div>
          {retreat.scheduleDays.map((day, i) => (
            <ScheduleDayRow key={day.title} day={day} index={i} isFirst={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
