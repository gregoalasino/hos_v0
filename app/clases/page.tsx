'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Users, MapPin, ArrowLeft } from 'lucide-react';
import { MOCK_CLASSES, CLASS_COLORS } from '@/lib/mock-data';
import type { YogaClass } from '@/types';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';

const CATEGORIES_ES = [
  { id: 'all',       label: 'Todas' },
  { id: 'vinyasa',   label: 'Vinyasa' },
  { id: 'yin',       label: 'Yin & Restaurativo' },
  { id: 'meditacion',label: 'Meditación' },
  { id: 'flow',      label: 'Flow & Hatha' },
  { id: 'ashtanga',  label: 'Ashtanga' },
];
const CATEGORIES_EN = [
  { id: 'all',       label: 'All' },
  { id: 'vinyasa',   label: 'Vinyasa' },
  { id: 'yin',       label: 'Yin & Restorative' },
  { id: 'meditacion',label: 'Meditation' },
  { id: 'flow',      label: 'Flow & Hatha' },
  { id: 'ashtanga',  label: 'Ashtanga' },
];

const CLASS_CATEGORY: Record<string, string> = {
  'Sunrise Vinyasa':        'vinyasa',
  'Power Flow':             'vinyasa',
  'Yin Yoga':               'yin',
  'Restorative Yoga':       'yin',
  'Pranayama & Meditación': 'meditacion',
  'Breath & Movement':      'meditacion',
  'Gentle Flow':            'flow',
  'Hatha Foundations':      'flow',
  'Ashtanga Primary':       'ashtanga',
};

function getWeekDays(weekOffset: number): Date[] {
  const today = new Date();
  const reference = today.getDay() === 0 ? addDays(today, 1) : today;
  const monday = addDays(startOfWeek(reference, { weekStartsOn: 1 }), weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export default function ClasesPage() {
  const { lang, toggleLang } = useLanguage();
  const CATEGORIES = lang === 'es' ? CATEGORIES_ES : CATEGORIES_EN;
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);

  const weekLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'd')}–${format(end, 'd')} de ${format(start, 'MMMM yyyy', { locale: es })}`;
    }
    return `${format(start, 'd MMM', { locale: es })} – ${format(end, 'd MMM yyyy', { locale: es })}`;
  }, [weekDays]);

  // Clases activas de la semana, filtradas por categoría
  const classesPerDay = useMemo(() => {
    return weekDays.map((day) => {
      return MOCK_CLASSES
        .filter((c) => {
          if (!c.isActive) return false;
          if (!isSameDay(c.startsAt, day)) return false;
          if (activeCategory !== 'all' && CLASS_CATEGORY[c.name] !== activeCategory) return false;
          return true;
        })
        .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    });
  }, [weekDays, activeCategory]);

  const hasAnyClass = classesPerDay.some((d) => d.length > 0);

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-warm-white/95 backdrop-blur-sm border-b border-dark/5">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-dark/60 hover:text-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            House of Shakti
          </Link>
          <h1 className="font-display text-lg font-light text-dark">
            {tr(lang, 'Clases de Yoga', 'Yoga Classes')}
          </h1>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border border-dark/15 hover:border-dark/30 transition-colors text-dark/50"
          >
            <span style={{ opacity: lang === 'es' ? 1 : 0.4 }}>ES</span>
            <span className="opacity-30">·</span>
            <span style={{ opacity: lang === 'en' ? 1 : 0.4 }}>EN</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {/* Filtros por categoría */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-dark text-cream shadow-sm'
                  : 'bg-cream text-dark/60 hover:text-dark hover:bg-cream/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Navegación de semana */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-2 rounded-full hover:bg-cream transition-colors text-dark/50 hover:text-dark"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <p className="text-sm font-medium text-dark capitalize">{weekLabel}</p>
            {weekOffset !== 0 && (
              <button
                onClick={() => setWeekOffset(0)}
                className="text-xs text-burgundy hover:underline mt-0.5"
              >
                {tr(lang, 'volver a hoy', 'back to today')}
              </button>
            )}
          </div>

          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-2 rounded-full hover:bg-cream transition-colors text-dark/50 hover:text-dark"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Grid semanal */}
        {!hasAnyClass ? (
          <div className="text-center py-20 text-dark/40">
            <p className="font-display text-2xl mb-2">{tr(lang, 'Sin clases esta semana', 'No classes this week')}</p>
            <p className="text-sm">{tr(lang, 'Prueba con otra semana o categoría', 'Try a different week or category')}</p>
          </div>
        ) : (
          <>
            <div className="lg:hidden text-center text-xs tracking-wider uppercase text-dark/30 mb-4 animate-pulse">
              {tr(lang, '← Desliza para ver la semana →', '← Swipe to see the full week →')}
            </div>

            <div className="overflow-x-auto pb-4">
              <div className="grid grid-cols-7 gap-2 min-w-[700px]">
                {/* Cabeceras de día */}
                {weekDays.map((day) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <div key={day.toISOString()} className="text-center pb-3 border-b border-dark/8">
                      <p className={`text-xs uppercase tracking-wide ${isToday ? 'text-burgundy font-semibold' : 'text-dark/40'}`}>
                        {lang === 'es' ? format(day, 'EEE', { locale: es }) : format(day, 'EEE')}
                      </p>
                      <p className={`text-lg font-display mt-0.5 ${isToday ? 'text-burgundy' : 'text-dark'}`}>
                        {format(day, 'd')}
                      </p>
                    </div>
                  );
                })}

                {/* Cards de clases */}
                {classesPerDay.map((dayClases, dayIdx) => (
                  <div key={dayIdx} className="space-y-2 pt-3 min-h-[120px]">
                    {dayClases.length === 0 ? (
                      <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-dark/10">
                        <span className="text-xs text-dark/25">—</span>
                      </div>
                    ) : (
                      dayClases.map((clase) => (
                        <ClassCard key={clase.id} clase={clase} />
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Leyenda de colores */}
        <div className="mt-8 pt-6 border-t border-dark/5 flex flex-wrap gap-3 justify-center">
          {Object.entries(CLASS_COLORS).map(([name, color]) => (
            <div key={name} className="flex items-center gap-1.5 text-xs text-dark/50">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassCard({ clase }: { clase: YogaClass }) {
  const { lang } = useLanguage();
  const agotada = clase.spotsRemaining === 0;
  const porcentajeOcupado = ((clase.capacity - clase.spotsRemaining) / clase.capacity) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cream rounded-xl p-3 border border-dark/5 hover:shadow-md transition-all duration-200 group"
    >
      {/* Barra de color + nombre */}
      <div className="flex items-start gap-2 mb-2">
        <span
          className="w-1.5 flex-shrink-0 rounded-full mt-0.5"
          style={{ background: clase.color, height: '100%', minHeight: 36 }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-dark leading-tight group-hover:text-burgundy transition-colors truncate">
            {clase.name}
          </p>
          <p className="text-[10px] text-dark/50 mt-0.5">{clase.instructor}</p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1 text-[10px] text-dark/60">
          <Clock className="w-2.5 h-2.5" />
          {format(clase.startsAt, 'HH:mm')} · {clase.durationMinutes} min
        </div>
        <div className="flex items-center gap-1 text-[10px] text-dark/60">
          <Users className="w-2.5 h-2.5" />
          <span className={agotada ? 'text-red-500 font-medium' : ''}>
            {agotada
              ? tr(lang, 'Completa', 'Full')
              : `${clase.spotsRemaining} ${tr(lang, 'disponibles', 'available')}`}
          </span>
        </div>
      </div>

      {/* Barra de ocupación */}
      <div className="h-1 bg-dark/10 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${porcentajeOcupado}%`,
            background: agotada ? '#ef4444' : clase.color,
          }}
        />
      </div>

      {/* Precio + acción */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-dark">
          {clase.priceUsd === 0 ? (
            <span className="text-emerald-600">{tr(lang, 'Gratis', 'Free')}</span>
          ) : (
            `$${clase.priceUsd}`
          )}
        </span>

        {agotada ? (
          <span className="text-[10px] text-dark/30 bg-dark/5 px-2.5 py-1 rounded-full">
            {tr(lang, 'Completa', 'Full')}
          </span>
        ) : (
          <Link
            href={`/booking/${clase.id}`}
            className="text-[10px] font-medium text-cream bg-dark hover:bg-burgundy px-3 py-1.5 rounded-full transition-colors shadow-sm"
          >
            {tr(lang, 'Reservar', 'Book')}
          </Link>
        )}
      </div>
    </motion.div>
  );
}
