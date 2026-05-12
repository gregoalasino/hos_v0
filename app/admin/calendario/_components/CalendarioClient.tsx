'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ChevronLeft, ChevronRight, Plus, Users, Clock,
  CalendarDays, MapPin, DollarSign, X,
} from 'lucide-react';
import type { YogaClass, Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';
import { generateWeekClasses } from '@/app/actions/classes';
import { format as dateFnsFormat } from 'date-fns';

const GRID_START_HOUR = 6;
const GRID_END_HOUR   = 11;
const HOUR_PX         = 80;
const GRID_HEIGHT     = (GRID_END_HOUR - GRID_START_HOUR) * HOUR_PX;

const timeLabels = Array.from(
  { length: GRID_END_HOUR - GRID_START_HOUR + 1 },
  (_, i) => `${String(GRID_START_HOUR + i).padStart(2, '0')}:00`
);

type SerializedClass = Omit<YogaClass, 'startsAt'> & { startsAt: string };
type SerializedBooking = Omit<Booking, 'createdAt'> & { createdAt: string };

function classTopPx(startsAt: string): number {
  const d = new Date(startsAt);
  const minutes = d.getHours() * 60 + d.getMinutes() - GRID_START_HOUR * 60;
  return Math.max(0, (minutes / 60) * HOUR_PX);
}

function statusLabel(status: string, lang: 'es' | 'en') {
  const map: Record<string, { es: string; en: string; cls: string }> = {
    paid:      { es: 'Pagado',    en: 'Paid',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    pending:   { es: 'Pendiente', en: 'Pending',   cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    cancelled: { es: 'Cancelado', en: 'Cancelled', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
    'no-show': { es: 'No-show',   en: 'No-show',   cls: 'bg-red-50 text-red-600 border-red-200' },
  };
  return map[status] ?? map.pending;
}

export default function CalendarioClient({
  initialClasses,
  initialBookings,
}: {
  initialClasses: SerializedClass[];
  initialBookings: SerializedBooking[];
}) {
  const { lang } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedClass, setSelectedClass] = useState<SerializedClass | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const weekDays = useMemo(() => {
    const today = new Date();
    const reference = today.getDay() === 0 ? addDays(today, 1) : today;
    const monday = addDays(startOfWeek(reference, { weekStartsOn: 1 }), weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  }, [weekOffset]);

  const weekLabel = useMemo(() => {
    const start = weekDays[0];
    const end   = weekDays[6];
    if (lang === 'es') {
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'd')} – ${format(end, 'd')} de ${format(start, 'MMMM yyyy', { locale: es })}`;
      }
      return `${format(start, 'd MMM', { locale: es })} – ${format(end, 'd MMM yyyy', { locale: es })}`;
    }
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMM d')}–${format(end, 'd, yyyy')}`;
    }
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  }, [weekDays, lang]);

  const classMap = useMemo(() => {
    const map = new Map<number, SerializedClass[]>();
    weekDays.forEach((_, i) => map.set(i, []));
    initialClasses.filter(c => c.isActive).forEach(c => {
      const dayIdx = weekDays.findIndex(d => isSameDay(new Date(c.startsAt), d));
      if (dayIdx !== -1) map.get(dayIdx)!.push(c);
    });
    return map;
  }, [weekDays, initialClasses]);

  const classBookings = useMemo(
    () => selectedClass ? initialBookings.filter(b => b.classId === selectedClass.id) : [],
    [selectedClass, initialBookings],
  );

  const occupied = selectedClass ? selectedClass.capacity - selectedClass.spotsRemaining : 0;
  const occupancyPct = selectedClass ? Math.min(100, (occupied / selectedClass.capacity) * 100) : 0;

  function handleGenerateWeek() {
    const weekStart = dateFnsFormat(weekDays[0], 'yyyy-MM-dd');
    startTransition(async () => {
      await generateWeekClasses(weekStart);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            <button onClick={() => setWeekOffset(o => o - 1)} className="p-1.5 rounded-md hover:bg-gray-100 text-slate-500 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setWeekOffset(0)} className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-gray-100 text-slate-600 transition-colors">
              {tr(lang, 'Hoy', 'Today')}
            </button>
            <button onClick={() => setWeekOffset(o => o + 1)} className="p-1.5 rounded-md hover:bg-gray-100 text-slate-500 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-sm font-semibold text-slate-800 capitalize">{weekLabel}</h2>
        </div>
        <Button
          size="sm"
          className="gap-1.5 text-xs text-white"
          style={{ backgroundColor: '#c4622d' }}
          onClick={handleGenerateWeek}
          disabled={isPending}
        >
          <Plus className="w-3.5 h-3.5" />
          {tr(lang, 'Generar semana', 'Generate week')}
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-w-[700px]">
          <div className="w-14 flex-shrink-0 border-r border-gray-100 pt-10">
            {timeLabels.map(t => (
              <div key={t} className="flex items-start justify-end pr-2 text-[10px] text-slate-400" style={{ height: HOUR_PX }}>
                <span className="-mt-2">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-1 divide-x divide-gray-100">
            {weekDays.map((day, dayIdx) => {
              const isToday = isSameDay(day, new Date());
              const dayName = lang === 'es' ? format(day, 'EEE', { locale: es }) : format(day, 'EEE');
              return (
                <div key={day.toISOString()} className="flex-1 min-w-0">
                  <div className={`text-center py-2 border-b border-gray-100 ${isToday ? 'bg-slate-50' : 'bg-white'}`}>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">{dayName}</p>
                    <p
                      className={`text-sm font-semibold mt-0.5 ${isToday ? 'text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : 'text-slate-700'}`}
                      style={isToday ? { backgroundColor: '#4a7c59' } : undefined}
                    >
                      {format(day, 'd')}
                    </p>
                  </div>
                  <div className="relative" style={{ height: GRID_HEIGHT }}>
                    {Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, i) => (
                      <div key={i} className="absolute left-0 right-0 border-b border-gray-100" style={{ top: (i + 1) * HOUR_PX }} />
                    ))}
                    {(classMap.get(dayIdx) ?? []).map(clase => (
                      <ClassBlock key={clase.id} clase={clase} onClick={() => { setSelectedClass(clase); setDrawerOpen(true); }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0 overflow-y-auto gap-0 border-l border-gray-100">
          {selectedClass && (
            <div className="flex flex-col min-h-full">
              <div className="px-6 pt-10 pb-6" style={{ background: (selectedClass.color ?? '#4a7c59') + '18' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: selectedClass.color ?? '#4a7c59' }} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: selectedClass.color ?? '#4a7c59' }}>
                    {selectedClass.location}
                  </span>
                </div>
                <h2 className="font-serif text-[26px] font-light text-slate-900 leading-tight mb-5">
                  {selectedClass.name}
                </h2>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-500">{tr(lang, 'Ocupación', 'Occupancy')}</span>
                    <span className="text-[11px] font-semibold text-slate-700">{occupied}/{selectedClass.capacity} {tr(lang, 'reservas', 'bookings')}</span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-white/40">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${occupancyPct}%`, background: selectedClass.color ?? '#4a7c59' }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">{selectedClass.spotsRemaining} {tr(lang, 'lugares disponibles', 'spots remaining')}</p>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4 border-b border-gray-100">
                <InfoItem icon={<CalendarDays className="w-3.5 h-3.5" />} label={tr(lang, 'Fecha y hora', 'Date & time')} value={
                  lang === 'es'
                    ? format(new Date(selectedClass.startsAt), "EEEE d 'de' MMMM · HH:mm", { locale: es })
                    : format(new Date(selectedClass.startsAt), 'EEEE, MMMM d · h:mm a')
                } />
                <InfoItem icon={<Clock className="w-3.5 h-3.5" />} label={tr(lang, 'Duración', 'Duration')} value={`${selectedClass.durationMinutes} ${tr(lang, 'minutos', 'min')}`} />
                <InfoItem icon={<MapPin className="w-3.5 h-3.5" />} label={tr(lang, 'Ubicación', 'Location')} value={selectedClass.location} />
                <InfoItem icon={<DollarSign className="w-3.5 h-3.5" />} label={tr(lang, 'Precio', 'Price')} value={selectedClass.priceUsd === 0 ? tr(lang, 'Gratis', 'Free') : `$${selectedClass.priceUsd} USD`} />
              </div>

              <div className="px-6 py-4 flex gap-2 border-b border-gray-100">
                <Button variant="outline" size="sm" className="h-9 px-3 text-xs text-red-500 border-red-200 hover:bg-red-50" onClick={() => setDrawerOpen(false)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="flex-1 px-6 py-5">
                <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  {tr(lang, 'Reservas', 'Bookings')} ({classBookings.length})
                </h3>
                {classBookings.length === 0 ? (
                  <div className="flex items-center justify-center py-10 rounded-xl border-2 border-dashed border-gray-100">
                    <p className="text-sm text-slate-400 italic">{tr(lang, 'Sin reservas todavía', 'No bookings yet')}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {classBookings.map(b => {
                      const s = statusLabel(b.paymentStatus, lang);
                      const initials = `${b.firstName[0]}${b.lastName[0]}`.toUpperCase();
                      return (
                        <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold" style={{ backgroundColor: (selectedClass.color ?? '#4a7c59') + 'cc' }}>
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{b.firstName} {b.lastName}</p>
                            <p className="text-[11px] text-slate-400 truncate">{b.email}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <Badge variant="outline" className={`text-[10px] ${s.cls}`}>{s[lang]}</Badge>
                            {b.persons > 1 && (
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <Users className="w-2.5 h-2.5" /> {b.persons}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ClassBlock({ clase, onClick }: { clase: SerializedClass; onClick: () => void }) {
  const top    = classTopPx(clase.startsAt);
  const height = ((clase.durationMinutes ?? 90) / 60) * HOUR_PX;
  const filled = clase.capacity - clase.spotsRemaining;
  return (
    <button
      onClick={onClick}
      className="absolute left-0.5 right-0.5 rounded-lg px-2 py-1.5 text-left overflow-hidden hover:brightness-95 transition-all shadow-sm"
      style={{ top, height: Math.max(height, 36), backgroundColor: (clase.color ?? '#4a7c59') + 'dd' }}
    >
      <p className="text-[10px] font-semibold text-white leading-tight truncate">{clase.name}</p>
      <p className="text-[9px] text-white/80 truncate">{format(new Date(clase.startsAt), 'HH:mm')}</p>
      {height >= 52 && <p className="text-[9px] text-white/70 mt-0.5">{filled}/{clase.capacity}</p>}
    </button>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-slate-400 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-slate-800 capitalize">{value}</p>
      </div>
    </div>
  );
}
