'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { Retreat, RetreatDay } from '@/lib/retreats';

function ScheduleDayItem({ day, index }: { day: RetreatDay; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  const dayNumber = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <Accordion.Item
        value={`day-${index}`}
        className="border-t border-ink/10 last:border-b last:border-ink/10"
      >
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center gap-5 lg:gap-8 py-7 lg:py-8 text-left outline-none">
            <span className="font-display font-light text-burgundy text-4xl lg:text-5xl leading-none w-16 lg:w-20 shrink-0">
              {dayNumber}
            </span>
            <span className="font-display font-light text-ink text-lg lg:text-2xl leading-tight flex-1">
              {day.title}
            </span>
            <ChevronDown
              aria-hidden
              strokeWidth={1.25}
              className="h-5 w-5 shrink-0 text-ink/60 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180"
            />
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <ul className="pb-9 lg:pb-10 pl-[84px] lg:pl-28 space-y-4">
            {day.activities.map((activity) => (
              <li key={activity} className="flex items-start gap-4">
                <span aria-hidden className="font-body text-base text-ink select-none">
                  —
                </span>
                <span className="font-body text-sm text-ink leading-relaxed">{activity}</span>
              </li>
            ))}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
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
          className="mb-12 lg:mb-16"
        >
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
            {retreat.scheduleHeading}
          </h2>
        </motion.div>

        {/* Day blocks — each collapsible, first day open by default */}
        <Accordion.Root type="single" collapsible defaultValue="day-0">
          {retreat.scheduleDays.map((day, i) => (
            <ScheduleDayItem key={day.title} day={day} index={i} />
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
