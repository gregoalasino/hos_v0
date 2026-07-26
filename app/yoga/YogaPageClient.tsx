'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, Variants, useInView } from 'framer-motion';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { YogaClass } from '@/types';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';

// ─── YouTube placeholder (same as home hero) ─────────────────────────────────
const VIDEO_ID_DESKTOP = '90FhvO1AvT8';
const VIDEO_ID_MOBILE = '90FhvO1AvT8'; // TODO: swap when yoga-specific portrait video lands

const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}` +
  `?autoplay=1&mute=1&loop=1&playlist=${id}` +
  `&controls=0&showinfo=0&modestbranding=1&rel=0` +
  `&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`;

// ─── Refined earth-tone category palette ─────────────────────────────────────
// Only the top stripe carries the category color. Card surface stays cream/
// transparent so the schedule reads as one quiet object, not a rainbow grid.
type CategoryStyle = { stripe: string; label: string };

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'flow-vinyasa':     { stripe: '#8B6F47', label: 'Vinyasa' },          // warm terracotta-brown
  'yin-restorative':  { stripe: '#6B7355', label: 'Yin & Restorative' }, // muted olive
  'hatha-gentle':     { stripe: '#A6896D', label: 'Hatha' },             // sand
  'ashtanga-intense': { stripe: '#5A3E2B', label: 'Ashtanga' },          // deep earth — for intensity
  'meditation':       { stripe: '#7A6B5D', label: 'Meditation' },        // warm gray
};

// Untouched — maps existing class names to category keys. DO NOT remove entries.
function getCategoryKey(name: string): string {
  if (['Sunrise Vinyasa', 'Power Flow', 'Breath & Movement', 'Vinyasa Flow', 'Vinyasa Krama', 'Detox Yoga'].includes(name)) return 'flow-vinyasa';
  if (['Yin Yoga', 'Yin & Restore', 'Restorative Yoga', 'Deep Stretch & Breath'].includes(name)) return 'yin-restorative';
  if (['Gentle Flow', 'Hatha Foundations'].includes(name)) return 'hatha-gentle';
  if (['Ashtanga Primary'].includes(name)) return 'ashtanga-intense';
  if (['Pranayama & Meditación', 'Meditation', 'Tantra Vinyasa'].includes(name)) return 'meditation';
  return 'flow-vinyasa';
}

// ─── Types & helpers ─────────────────────────────────────────────────────────
type SerializedClass = Omit<YogaClass, 'startsAt'> & { startsAt: string };

function getWeekDays(weekOffset: number): Date[] {
  const today = new Date();
  const reference = today.getDay() === 0 ? addDays(today, 1) : today;
  const monday = addDays(startOfWeek(reference, { weekStartsOn: 1 }), weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function formatTime(iso: string): string {
  return format(new Date(iso), 'HH:mm');
}

// ─── Headline word-by-word reveal variants ───────────────────────────────────
const headlineContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

// ═════════════════════════════════════════════════════════════════════════════
// HERO — editorial video, same pattern as home (full-bleed mobile, 80% desktop)
// ═════════════════════════════════════════════════════════════════════════════
function YogaHero() {
  return (
    <section className="bg-warm-white">
      {/*
        Hero + navbar together fill exactly 100vh.
        Mobile: full-bleed. Desktop: 80% container with margins.
        mt-* offsets the fixed navbar so the hero sits *below* it.
      */}
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          {/* Desktop / landscape */}
          <div className="absolute inset-0 hidden md:block">
            <iframe
              src={youtubeEmbedUrl(VIDEO_ID_DESKTOP)}
              title="Yoga at House of Shakti"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              tabIndex={-1}
              className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                w-[max(100%,177.78vh)] h-[max(100%,56.25vw)] aspect-video border-0
              "
            />
          </div>

          {/* Mobile / portrait — same placeholder until a 9:16 asset lands */}
          <div className="absolute inset-0 md:hidden">
            <iframe
              src={youtubeEmbedUrl(VIDEO_ID_MOBILE)}
              title="Yoga at House of Shakti"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              tabIndex={-1}
              className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                w-[max(100%,177.78vh)] h-[max(100%,56.25vw)] aspect-video border-0
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// NARRATIVE — adapted for the Yoga page (no trailing image)
// ═════════════════════════════════════════════════════════════════════════════
const NARRATIVE_HEADLINE = 'Yoga at House of Shakti.';

function YogaNarrative() {
  const textRef = useRef<HTMLDivElement | null>(null);
  const textInView = useInView(textRef, { once: true, margin: '-100px' });

  const words = NARRATIVE_HEADLINE.split(' ');

  return (
    <section className="bg-warm-white py-20 lg:py-28 overflow-hidden">
      <div ref={textRef} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-3xl">
          <motion.h2
            variants={headlineContainer}
            initial="hidden"
            animate={textInView ? 'visible' : 'hidden'}
            aria-label={NARRATIVE_HEADLINE}
            className="font-display font-light text-ink text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-[-0.01em]"
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                aria-hidden
                className="inline-block overflow-hidden align-baseline"
              >
                <motion.span
                  variants={headlineWord}
                  className="inline-block will-change-transform"
                >
                  {word}
                  {/* non-breaking space — a regular ASCII space gets collapsed when each word is wrapped in inline-block */}
                  {i < words.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={textInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 1.8 }}
            className="font-body text-ink max-w-2xl text-sm leading-[1.7] mt-12 lg:mt-16"
          >
            Mornings begin with breath. Afternoons soften into restoration. Our
            shala opens to the trees, our teachers move at the pace of the body
            — not the schedule. Whether you are new to practice or have spent
            years on the mat, you are welcome here.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CLASS CARD
// ═════════════════════════════════════════════════════════════════════════════
function ClassCard({ clase }: { clase: SerializedClass }) {
  const router = useRouter();
  const catKey = getCategoryKey(clase.name);
  const cat = CATEGORY_STYLES[catKey];
  const past = new Date(clase.startsAt).getTime() <= Date.now();
  const sold = clase.spotsRemaining === 0;
  const disabled = sold || past;
  const fewLeft = !disabled && clase.spotsRemaining > 0 && clase.spotsRemaining < clase.capacity * 0.5;

  return (
    <article
      onClick={disabled ? undefined : () => router.push(`/booking/${clase.id}`)}
      className={`
        group relative border border-ink/10 bg-warm-white
        transition-[transform,border-color,box-shadow] duration-300 ease-out
        ${disabled
          ? 'opacity-40 pointer-events-none'
          : 'cursor-pointer hover:-translate-y-[2px] hover:border-ink/30 hover:shadow-[0_6px_16px_-4px_rgba(49,49,49,0.08)]'}
      `}
    >
      {/* Top stripe — the only place the category color appears */}
      <div className="h-[3px] w-full" style={{ background: cat.stripe }} aria-hidden />

      <div className="p-3 lg:p-4">
        <p className="font-display font-light text-ink text-base lg:text-lg leading-none">
          {formatTime(clase.startsAt)}
        </p>

        <p className="font-body text-[10px] tracking-[0.1em] uppercase text-ink mt-2">
          {clase.instructor}
        </p>

        <p className="font-body text-sm text-ink font-medium mt-1 leading-snug">
          {clase.name}
        </p>

        <div className="flex items-baseline justify-between mt-3">
          <span className="font-body text-[10px] text-ink">
            {clase.durationMinutes} min
          </span>
          {past ? (
            <span className="font-body text-[10px] text-ink/50">
              Past
            </span>
          ) : sold ? (
            <span className="font-body text-[10px] text-ink">
              Fully booked
            </span>
          ) : fewLeft ? (
            <span className="font-body text-[10px] text-burgundy">
              {clase.spotsRemaining === 1 ? '1 spot left' : `${clase.spotsRemaining} spots left`}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// WEEKLY CALENDAR
// ═════════════════════════════════════════════════════════════════════════════
function WeeklyCalendar({ initialClasses }: { initialClasses: SerializedClass[] }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekClasses, setWeekClasses] = useState<SerializedClass[]>(initialClasses);
  const [loadingWeek, setLoadingWeek] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const today = new Date();
  const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  const weekLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (!start || !end) return '';
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMMM d')} – ${format(end, 'd')}`;
    }
    return `${format(start, 'MMMM d')} – ${format(end, 'MMMM d')}`;
  }, [weekDays]);

  async function navigateWeek(offset: number) {
    setWeekOffset(offset);
    setLoadingWeek(true);
    try {
      const days = getWeekDays(offset);
      const start = format(days[0], 'yyyy-MM-dd');
      const end = format(days[6], 'yyyy-MM-dd');
      const res = await fetch(`/api/classes/week?start=${start}&end=${end}`);
      const data = await res.json();
      setWeekClasses(data.classes ?? []);
    } catch {
      setWeekClasses([]);
    } finally {
      setLoadingWeek(false);
    }
  }

  const displayClasses = useMemo(
    () => weekClasses.filter((c) => c.isActive && weekDays.some((d) => isSameDay(new Date(c.startsAt), d))),
    [weekClasses, weekDays],
  );

  // Group classes by day, sorted by start time
  const classesByDay = useMemo(() => {
    return weekDays.map((day) =>
      displayClasses
        .filter((c) => isSameDay(new Date(c.startsAt), day))
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()),
    );
  }, [displayClasses, weekDays]);

  return (
    <section ref={sectionRef} className="bg-warm-white py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15]">
            This week at the shala
          </h2>

          {/* Week navigation row */}
          <div className="flex items-center justify-between mt-8 lg:mt-10">
            <div className="flex items-center gap-4 lg:gap-6">
              <button
                onClick={() => navigateWeek(weekOffset - 1)}
                aria-label="Previous week"
                className="text-ink hover:opacity-70 transition-opacity duration-300"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1} />
              </button>
              <p className="font-body text-sm text-ink tracking-[0.05em] min-w-[12rem] text-center lg:text-left">
                {weekLabel}
              </p>
              <button
                onClick={() => navigateWeek(weekOffset + 1)}
                aria-label="Next week"
                className="text-ink hover:opacity-70 transition-opacity duration-300"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1} />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {weekOffset !== 0 && (
                <button
                  onClick={() => navigateWeek(0)}
                  className="font-body text-xs italic text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300"
                >
                  back to this week
                </button>
              )}
              <span className="font-body text-xs italic text-ink">
                {loadingWeek
                  ? 'loading…'
                  : weekOffset === 0
                    ? 'this week'
                    : weekOffset > 0
                      ? 'upcoming'
                      : 'past'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* DESKTOP — 7 column day grid */}
        <div className="hidden lg:grid grid-cols-7 gap-x-2 lg:gap-x-4 mt-12 lg:mt-16">
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, today);
            const dayClasses = classesByDay[i];
            return (
              <div key={i}>
                <div
                  className={`pb-4 border-b ${isToday ? 'border-burgundy' : 'border-ink/10'}`}
                >
                  <p
                    className={`font-display text-base lg:text-lg leading-none ${isToday ? 'text-burgundy' : 'text-ink'}`}
                  >
                    {DAY_NAMES[i]} {format(day, 'd')}
                  </p>
                </div>
                <div className="flex flex-col gap-y-3 lg:gap-y-4 mt-4">
                  {dayClasses.length === 0 ? (
                    <p className="font-body text-xs italic text-ink/30 text-center mt-6">
                      No classes
                    </p>
                  ) : (
                    dayClasses.map((c) => <ClassCard key={c.id} clase={c} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE — stacked day-by-day */}
        <div className="lg:hidden mt-12 space-y-12">
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, today);
            const dayClasses = classesByDay[i];
            if (dayClasses.length === 0) return null;
            return (
              <div key={i}>
                <h3
                  className={`font-display font-light text-lg pb-3 border-b ${isToday ? 'text-burgundy border-burgundy' : 'text-ink border-ink/10'}`}
                >
                  {DAY_NAMES[i]} {format(day, 'd')}
                </h3>
                <div className="flex flex-col gap-y-3 mt-4">
                  {dayClasses.map((c) => <ClassCard key={c.id} clase={c} />)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Class packs entry point — practice often, save with a pack */}
        <Link
          href="/paquetes"
          className="group mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-ink/15 bg-cream/30 px-6 py-5 hover:border-ink/40 transition-colors duration-200"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50">
              Practice often?
            </p>
            <p className="font-body text-sm text-ink mt-1">
              Save with a class pack of 5, 10 or 20 — book any class for free with your code.
            </p>
          </div>
          <span className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] whitespace-nowrap group-hover:opacity-70 transition-opacity">
            View class packs →
          </span>
        </Link>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// INSTRUCTORS
// ═════════════════════════════════════════════════════════════════════════════
// NOTE: placeholder names and bios — replace with real teacher data when ready.
// Images are non-portrait yoga shots; swap for actual headshots in the same pass.
const instructors = [
  {
    name: 'Luna Hernández',
    discipline: 'Vinyasa & Hatha',
    bio: 'Trained between Mysore and Bali, Luna brings a quiet attention to alignment and breath. Her practice favors patience over performance.',
    image: '/images/yoga/IMG_8693%201.webp', // TODO: replace with actual instructor portrait
  },
  {
    name: 'Daniel Park',
    discipline: 'Yin & Restorative',
    bio: 'Daniel teaches from stillness. His sessions favor long holds, slow breath, and the kind of rest the body takes time to find.',
    image: '/images/yoga/IMG_7526%201.webp', // TODO: replace with actual instructor portrait
  },
  {
    name: 'Ana Patricia Rivas',
    discipline: 'Meditation & Breathwork',
    bio: 'A student of Iyengar and pranayama traditions, Ana works between Costa Rica and Mexico. Her teaching is small, daily, and built to last.',
    image: '/images/yoga/IMG_7491%201.webp', // TODO: replace with actual instructor portrait
  },
];

const instructorsContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const instructorsItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

function YogaInstructors() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] mb-16 lg:mb-20"
        >
          Our teachers
        </motion.h2>

        <motion.div
          variants={instructorsContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-8 lg:gap-10"
        >
          {instructors.map((instructor) => (
            <motion.article key={instructor.name} variants={instructorsItem}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={instructor.image}
                  alt={instructor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-ink mt-6">
                {instructor.discipline}
              </p>
              <h3 className="font-display font-light text-ink text-xl lg:text-2xl leading-tight mt-3">
                {instructor.name}
              </h3>
              <p className="font-body text-sm text-ink leading-relaxed mt-3">
                {instructor.bio}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// CONTACT PROMPT
// ═════════════════════════════════════════════════════════════════════════════
function YogaContact() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-16 lg:py-20">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="w-[90%] md:w-[80%] max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display font-light text-ink text-2xl md:text-3xl leading-[1.15]">
          Questions before you book?
        </h2>
        <p className="font-body text-sm text-ink max-w-md mx-auto mt-4 leading-relaxed">
          Reach out — we&apos;ll help you find the right class or arrange a
          private session.
        </p>
        <Link
          href="/contact"
          className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 mt-8"
        >
          Get in touch
        </Link>
      </motion.div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// YOGA GALLERY — Aman-style horizontal slider (Amanera reference)
//
// Distinct from the home Gallery (masonry).
// - Each slot has the SAME WIDTH; images keep their own aspect ratio so each
//   one renders at a DIFFERENT HEIGHT. The flex container vertically centers
//   them, giving the "uneven" editorial rhythm.
// - As the user scrolls, the image closest to the viewport center is shown
//   at full opacity; images further away fade progressively. Opacity is
//   recomputed on every scroll/resize.
// - Drag-to-scroll, native snap-proximity, scroll-smooth on release.
// - Progress bar lives inside the standard 80% container.
// ═════════════════════════════════════════════════════════════════════════════
type GalleryImg = { src: string; aspect: string; alt: string };

const yogaGalleryImages: GalleryImg[] = [
  { src: '/images/yoga/IMG_5608%201.webp',  aspect: 'aspect-[3/4]', alt: 'A solitary yoga practice' },
  { src: '/images/yoga/IMG_8420%201.webp',  aspect: 'aspect-[4/3]', alt: 'Group practice in the shala' },
  { src: '/images/yoga/IMG_7494%201.webp',  aspect: 'aspect-[3/4]', alt: 'Detail of practice' },
  { src: '/images/yoga/IMG_8669%201.webp',  aspect: 'aspect-[5/4]', alt: 'Open-air shala wide view' },
  { src: '/images/yoga/IMG_5615%201.webp',  aspect: 'aspect-[4/3]', alt: 'Practice at sunset' },
  { src: '/images/yoga/IMG_7538%201.webp',  aspect: 'aspect-[1/1]', alt: 'Movement in soft light' },
  { src: '/images/yoga/IMG_7491%201.webp',  aspect: 'aspect-[3/4]', alt: 'Quiet morning ritual' },
];

function YogaGallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Aman-style thumb: fixed width = visible fraction of total content, slides left→right
  const [thumbWidth, setThumbWidth] = useState(100);
  const [thumbLeft, setThumbLeft] = useState(0);

  // Per-slot opacity, driven by distance from the visible viewport center
  const [opacities, setOpacities] = useState<number[]>(() =>
    yogaGalleryImages.map(() => 1),
  );

  // Drag-to-scroll refs (no re-renders)
  const isDragging = useRef(false);
  const dragMoved = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    // Progress bar
    if (scrollWidth <= clientWidth) {
      setThumbWidth(100);
      setThumbLeft(0);
    } else {
      const widthPct = (clientWidth / scrollWidth) * 100;
      const max = scrollWidth - clientWidth;
      const leftPct = (scrollLeft / max) * (100 - widthPct);
      setThumbWidth(widthPct);
      setThumbLeft(leftPct);
    }

    // Per-slot opacity by distance to the visible center
    const viewportCenter = scrollLeft + clientWidth / 2;
    const slots = el.querySelectorAll<HTMLElement>('[data-gallery-slot]');
    const next: number[] = [];
    slots.forEach((slot) => {
      const slotCenter = slot.offsetLeft + slot.offsetWidth / 2;
      const dist = Math.abs(slotCenter - viewportCenter);
      // Within a 60% half-viewport window: opacity ≈ 1. Beyond: fade to ~0.3.
      const ratio = Math.min(1, dist / (clientWidth * 0.6));
      next.push(1 - ratio * 0.7);
    });
    setOpacities(next);
  };

  useEffect(() => {
    update();
    const onResize = () => update();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    dragMoved.current = false;
    dragStartX.current = e.pageX;
    dragStartScrollLeft.current = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = e.pageX - dragStartX.current;
    if (Math.abs(delta) > 5) dragMoved.current = true;
    el.scrollLeft = dragStartScrollLeft.current - delta;
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const el = scrollRef.current;
    if (!el) return;
    el.style.cursor = 'grab';
    el.style.scrollBehavior = 'smooth';
    el.style.scrollSnapType = 'x proximity';
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Yoga gallery"
      className="bg-warm-white py-20 lg:py-28"
    >
      {/*
        Full-bleed scroll. The container has a fixed height tall enough to
        accommodate the tallest aspect (3/4 portrait at the chosen slot width);
        flex items-center vertically centers shorter ones, producing the
        "uneven" rhythm.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        ref={scrollRef}
        onScroll={update}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        tabIndex={0}
        className="
          flex items-center gap-6 lg:gap-10
          h-[420px] sm:h-[480px] lg:h-[600px] xl:h-[640px]
          overflow-x-auto snap-x snap-proximity scroll-smooth
          px-6 lg:px-16 xl:px-24
          cursor-grab select-none
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          focus:outline-none
        "
      >
        {yogaGalleryImages.map((img, i) => (
          <div
            key={img.src}
            data-gallery-slot
            style={{
              opacity: opacities[i] ?? 1,
              transition: 'opacity 600ms ease-out',
            }}
            className="
              flex-shrink-0 snap-center
              w-[260px] sm:w-[320px] lg:w-[400px] xl:w-[440px]
            "
          >
            <div className={`w-full ${img.aspect} overflow-hidden`}>
              <img
                src={img.src}
                alt={img.alt}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Progress bar — Aman style, contained within the standard 80% */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: 0.6 }}
        className="w-[90%] md:w-[80%] mx-auto mt-16 lg:mt-20"
      >
        <div className="relative h-px w-full bg-ink/15">
          <div
            className="absolute top-0 h-px bg-ink transition-[left,width] duration-300 ease-out"
            style={{ width: `${thumbWidth}%`, left: `${thumbLeft}%` }}
            aria-hidden
          />
        </div>
      </motion.div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═════════════════════════════════════════════════════════════════════════════
export default function YogaPageClient({ initialClasses }: { initialClasses: SerializedClass[] }) {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <YogaHero />
      <YogaNarrative />
      <WeeklyCalendar initialClasses={initialClasses} />
      <YogaInstructors />
      <YogaContact />
      <YogaGallery />
      <Footer />
    </main>
  );
}
