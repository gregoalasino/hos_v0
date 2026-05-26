'use client';

import { useState, useMemo, useRef, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants, useInView } from 'framer-motion';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import type { YogaClass } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';

// ─── Gallery images ───────────────────────────────────────────────────────────
const galleryImages = [
  { src: '/images/yoga/IMG_8420%201.webp',   alt: 'Yoga class at House of Shakti' },
  { src: '/images/yoga/IMG_7491%201.webp',   alt: 'Morning yoga flow' },
  { src: '/images/yoga/IMG_7526%201.webp',   alt: 'Group yoga session at sunset' },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// ─── Category color system ────────────────────────────────────────────────────
type CategoryStyle = { bg: string; text: string; accent: string; label: string; border: string };

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'flow-vinyasa':     { bg: '#e8f4ec', text: '#1a4a2a', accent: '#4a7c59', label: 'Flow / Vinyasa',    border: '#c2dbc8' },
  'yin-restorative':  { bg: '#ede8f5', text: '#3a2060', accent: '#8b6bb8', label: 'Yin / Restorative', border: '#cfc5e8' },
  'hatha-gentle':     { bg: '#dceef8', text: '#0a2a4a', accent: '#6baed6', label: 'Hatha / Gentle',    border: '#b5d6ec' },
  'ashtanga-intense': { bg: '#fde8d8', text: '#5a2010', accent: '#c4622d', label: 'Ashtanga / Intense',border: '#f0c4a8' },
  'meditation':       { bg: '#fdf5e8', text: '#4a3010', accent: '#c4a030', label: 'Meditation',        border: '#ecdaaa' },
};

function getCategoryKey(name: string): string {
  if (['Sunrise Vinyasa', 'Power Flow', 'Breath & Movement', 'Vinyasa Flow', 'Vinyasa Krama', 'Detox Yoga'].includes(name)) return 'flow-vinyasa';
  if (['Yin Yoga', 'Yin & Restore', 'Restorative Yoga', 'Deep Stretch & Breath'].includes(name)) return 'yin-restorative';
  if (['Gentle Flow', 'Hatha Foundations'].includes(name)) return 'hatha-gentle';
  if (['Ashtanga Primary'].includes(name)) return 'ashtanga-intense';
  if (['Pranayama & Meditación', 'Meditation', 'Tantra Vinyasa'].includes(name)) return 'meditation';
  return 'flow-vinyasa';
}

// ─── Serialized class from server (startsAt is ISO string) ───────────────────
type SerializedClass = Omit<YogaClass, 'startsAt'> & { startsAt: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getWeekDays(weekOffset: number): Date[] {
  const today = new Date();
  const reference = today.getDay() === 0 ? addDays(today, 1) : today;
  const monday = addDays(startOfWeek(reference, { weekStartsOn: 1 }), weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function formatTimeLabel(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h < 12 ? 'am' : 'pm';
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0 ? `${hour} ${ampm}` : `${hour}:${mStr} ${ampm}`;
}

// ─── ClassCard ────────────────────────────────────────────────────────────────
function ClassCard({ clase }: { clase: SerializedClass }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const catKey = getCategoryKey(clase.name);
  const cat = CATEGORY_STYLES[catKey];
  const sold = clase.spotsRemaining === 0;
  const booked = clase.capacity - clase.spotsRemaining;
  const fillPct = clase.capacity > 0 ? Math.min(100, (booked / clase.capacity) * 100) : 0;
  const isFree = clase.priceUsd === 0;

  const classDate = new Date(clase.startsAt);
  const h = classDate.getHours();
  const m = classDate.getMinutes();
  const ampm = h < 12 ? 'AM' : 'PM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const mStr = m === 0 ? '' : `:${String(m).padStart(2, '0')}`;
  const timeStr = `${hour12}${mStr} ${ampm}`;

  return (
    <div
      onClick={sold ? undefined : () => router.push(`/booking/${clase.id}`)}
      onMouseEnter={() => !sold && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 8,
        border: `1px solid ${hovered ? cat.accent + 'aa' : cat.border}`,
        background: cat.bg,
        padding: '8px 9px',
        cursor: sold ? 'default' : 'pointer',
        opacity: sold ? 0.45 : 1,
        transition: 'border-color 0.15s ease',
      }}
    >
      <p style={{ fontSize: 9, color: 'rgba(0,0,0,.45)', marginBottom: 3, fontFamily: 'var(--font-body)' }}>
        {timeStr} · {clase.durationMinutes} min
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, lineHeight: 1.25, color: cat.text, textDecoration: sold ? 'line-through' : 'none', marginBottom: 2 }}>
        {clase.name}
      </p>
      <p style={{ fontSize: 10, color: cat.text, opacity: 0.6, marginBottom: 8, fontFamily: 'var(--font-body)' }}>
        with {clase.instructor} · {clase.location}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          <div style={{ width: 28, height: 3, background: 'rgba(0,0,0,.12)', borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
            <div style={{ width: `${fillPct}%`, height: '100%', background: cat.accent, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 9, color: 'rgba(0,0,0,.4)', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)' }}>
            {booked}/{clase.capacity}
          </span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: isFree ? '#4a7c59' : cat.text, flexShrink: 0, fontFamily: 'var(--font-body)' }}>
          {isFree ? 'Free' : `$${clase.priceUsd}`}
        </span>
        <span style={{
          fontSize: 9,
          padding: sold ? '2px 7px' : '3px 8px',
          borderRadius: sold ? 6 : 10,
          background: sold ? '#d4c8e8' : cat.text,
          color: sold ? '#9a8ab0' : cat.bg,
          display: 'inline-block',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-body)',
        }}>
          {sold ? tr(lang, 'Completa', 'Full') : tr(lang, 'Reservar', 'Book')}
        </span>
      </div>
    </div>
  );
}

// ─── ColorLegend ──────────────────────────────────────────────────────────────
function ColorLegend() {
  const { lang } = useLanguage();
  const CAT_LABELS: Record<string, { es: string; en: string }> = {
    'Flow / Vinyasa':     { es: 'Flow / Vinyasa',     en: 'Flow / Vinyasa' },
    'Yin / Restorative':  { es: 'Yin / Restaurativo', en: 'Yin / Restorative' },
    'Hatha / Gentle':     { es: 'Hatha / Suave',      en: 'Hatha / Gentle' },
    'Ashtanga / Intense': { es: 'Ashtanga / Intenso', en: 'Ashtanga / Intense' },
    'Meditation':         { es: 'Meditación',          en: 'Meditation' },
  };
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {Object.values(CATEGORY_STYLES).map((cat) => {
        const labels = CAT_LABELS[cat.label];
        return (
          <div key={cat.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: cat.accent }} />
            <span className="text-[11px] font-body text-dark/50">
              {labels ? labels[lang] : cat.label}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm border border-dashed flex-shrink-0" style={{ borderColor: '#9a8ab0' }} />
        <span className="text-[11px] font-body text-dark/50">{tr(lang, 'Agotada', 'Sold out')}</span>
      </div>
    </div>
  );
}

// ─── WeeklyCalendar ───────────────────────────────────────────────────────────
function WeeklyCalendar({ initialClasses }: { initialClasses: SerializedClass[] }) {
  const { lang } = useLanguage();
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekClasses, setWeekClasses] = useState<SerializedClass[]>(initialClasses);
  const [loadingWeek, setLoadingWeek] = useState(false);

  const today = new Date();
  const DAY_NAMES_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const DAY_NAMES_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const DAY_NAMES = lang === 'es' ? DAY_NAMES_ES : DAY_NAMES_EN;

  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  const weekLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (!start || !end) return '';
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMM d')}–${format(end, 'd, yyyy')}`;
    }
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  }, [weekDays]);

  async function navigateWeek(offset: number) {
    const newOffset = offset;
    setWeekOffset(newOffset);
    setLoadingWeek(true);
    try {
      const days = getWeekDays(newOffset);
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
    () => weekClasses.filter(c => c.isActive && weekDays.some(d => isSameDay(new Date(c.startsAt), d))),
    [weekClasses, weekDays],
  );

  const timeSlots = useMemo(() => {
    const times = new Set(displayClasses.map(c => format(new Date(c.startsAt), 'HH:mm')));
    return Array.from(times).sort();
  }, [displayClasses]);

  return (
    <div>
      <div className="text-center mb-10">
        <span className="block font-body text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: '#8D0000' }}>
          {tr(lang, 'Horario Semanal', 'Weekly Schedule')}
        </span>
        <h2 className="font-display text-[38px] lg:text-[48px] font-light text-dark leading-none">
          {tr(lang, 'Clases Matutinas', 'Morning Classes')}
        </h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateWeek(weekOffset - 1)}
            className="w-7 h-7 rounded-full border flex items-center justify-center text-dark/50 hover:bg-[#F2EBDA] transition-colors"
            style={{ borderColor: '#d4c8b4' }}
            aria-label="Previous week"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigateWeek(weekOffset + 1)}
            className="w-7 h-7 rounded-full border flex items-center justify-center text-dark/50 hover:bg-[#F2EBDA] transition-colors"
            style={{ borderColor: '#d4c8b4' }}
            aria-label="Next week"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div>
            <p className="text-sm font-medium font-body text-dark">{weekLabel}</p>
            {weekOffset !== 0 && (
              <button
                onClick={() => navigateWeek(0)}
                className="text-[11px] font-body hover:underline underline-offset-2"
                style={{ color: '#8D0000' }}
              >
                {tr(lang, 'volver a esta semana', 'back to this week')}
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] italic font-body hidden md:block" style={{ color: 'rgba(52,0,0,.35)' }}>
          {loadingWeek ? '...' : tr(lang, 'clic para reservar', 'click to book')}
        </p>
      </div>

      <p className="lg:hidden text-center text-[11px] font-body text-dark/30 animate-pulse mb-3">
        {tr(lang, '← Desliza para ver la semana →', '← Swipe to see full week →')}
      </p>

      <div className="overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={weekOffset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="min-w-[680px]"
              style={{
                display: 'grid',
                gridTemplateColumns: '52px repeat(7, minmax(0, 1fr))',
                gap: 1,
                backgroundColor: '#e0d4c0',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {/* Header row */}
              <div style={{ backgroundColor: '#F2EBDA', padding: '10px 8px' }} />
              {weekDays.map((day, i) => {
                const isToday = isSameDay(day, today);
                return (
                  <div key={i} style={{ backgroundColor: '#F2EBDA', padding: '10px 6px', textAlign: 'center' }}>
                    <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: isToday ? '#8d0000' : 'rgba(52,0,0,0.4)', fontFamily: 'var(--font-body)' }}>
                      {DAY_NAMES[i]}
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: isToday ? '#8d0000' : '#340000', lineHeight: 1.1, marginTop: 2 }}>
                      {format(day, 'd')}
                    </p>
                  </div>
                );
              })}

              {/* Time slot rows */}
              {timeSlots.length === 0 ? (
                <>
                  <div style={{ backgroundColor: '#F2EBDA', paddingTop: 10, paddingRight: 8, textAlign: 'right' }}>
                    <span style={{ fontSize: 10, color: '#9a7a5a', fontFamily: 'var(--font-body)' }}>—</span>
                  </div>
                  {weekDays.map((_, i) => (
                    <div key={i} style={{ backgroundColor: '#fffdf7', minHeight: 100, padding: 6 }} />
                  ))}
                </>
              ) : (
                timeSlots.map((time) => (
                  <Fragment key={time}>
                    <div style={{ backgroundColor: '#F2EBDA', paddingTop: 10, paddingRight: 8, paddingLeft: 4, paddingBottom: 6, textAlign: 'right' }}>
                      <span style={{ fontSize: 10, color: '#9a7a5a', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                        {formatTimeLabel(time)}
                      </span>
                    </div>
                    {weekDays.map((day, dayIdx) => {
                      const cellClasses = displayClasses.filter(c =>
                        isSameDay(new Date(c.startsAt), day) && format(new Date(c.startsAt), 'HH:mm') === time
                      );
                      return (
                        <div key={dayIdx} style={{ backgroundColor: '#fffdf7', minHeight: 100, padding: 6 }}>
                          {cellClasses.map(c => <ClassCard key={c.id} clase={c} />)}
                        </div>
                      );
                    })}
                  </Fragment>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <ColorLegend />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function YogaPageClient({ initialClasses }: { initialClasses: SerializedClass[] }) {
  const { lang } = useLanguage();
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-warm-white"
    >
      <div className="fixed top-6 left-6 z-50">
        <Link href="/" className="flex items-center gap-2 text-sm text-dark/70 hover:text-dark transition-colors bg-cream/90 backdrop-blur-sm px-4 py-2 rounded-full">
          <ArrowLeft className="w-4 h-4" />
          {tr(lang, 'Volver al inicio', 'Back to home')}
        </Link>
      </div>

      <section ref={heroRef} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/yoga/IMG_8693%201.webp" alt="Yoga practice at House of Shakti" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-dark/40" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center px-6"
        >
          <span className="text-sm tracking-[0.3em] uppercase text-cream/80 mb-4 block">The Practice</span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light text-cream text-balance">Yoga Classes</h1>
        </motion.div>
      </section>

      <section className="py-20 lg:py-28 bg-[#fffdf7]">
        <div className="max-w-6xl mx-auto px-6">
          <WeeklyCalendar initialClasses={initialClasses} />
        </div>
      </section>

      <section ref={contentRef} className="py-24 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <span className="text-sm tracking-[0.3em] uppercase text-burgundy mb-6 block">Serenity &amp; Practice</span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-dark mb-8 leading-tight">
                Donde el aliento se convierte en movimiento, y el movimiento en meditación
              </h2>
              <div className="space-y-6 text-dark/70 leading-relaxed">
                <p>
                  En House of Shakti, el yoga no es solo ejercicio —es un diálogo sagrado entre cuerpo, mente y espíritu.
                  Nuestras clases íntimas, realizadas en nuestra shala al aire libre con vista al dosel de la selva,
                  crean un espacio donde la transformación se despliega naturalmente.
                </p>
                <p>
                  Cada sesión es cuidadosamente elaborada por nuestros maestros residentes,
                  quienes traen décadas de estudio y devoción a su práctica.
                </p>
                <p className="font-display text-lg text-dark/60 italic">
                  &ldquo;El cuerpo es tu templo. Mantenlo puro y limpio para que el alma pueda residir en él.&rdquo;
                </p>
              </div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate={contentInView ? 'visible' : 'hidden'} className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="col-span-2">
                <div className="aspect-[16/9] overflow-hidden rounded-md">
                  <img src={galleryImages[0].src} alt={galleryImages[0].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="aspect-square overflow-hidden rounded-md">
                  <img src={galleryImages[1].src} alt={galleryImages[1].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="aspect-square overflow-hidden rounded-md">
                  <img src={galleryImages[2].src} alt={galleryImages[2].alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-dark text-cream text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h3 className="font-display text-3xl md:text-4xl mb-6">
            {tr(lang, '¿Listo para comenzar tu práctica?', 'Ready to start your practice?')}
          </h3>
          <p className="text-cream/70 mb-8">
            {tr(lang,
              'Al reservar una noche puedes agregar clases de yoga con descuento.',
              'Book your stay and add yoga classes at a discounted rate.')}
          </p>
          <div className="hidden md:flex justify-center items-center cloudbeds-btn-container">
            <cb-book-now-button property-code="zE6Wy8" />
          </div>
        </div>
      </section>
    </motion.main>
  );
}
