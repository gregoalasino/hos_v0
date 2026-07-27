'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  DollarSign,
  User,
  Pencil,
  Trash2,
  CalendarX,
} from 'lucide-react';
import type { YogaClass, Booking } from '@/types';
import { deleteClass } from '@/app/actions/classes';
import { Button } from '@/components/admin/Button';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation';

// ─── Category palette — mirrors /app/yoga/YogaPageClient.tsx exactly so the
// admin calendar reads the same color language students see on the public site.
type CategoryStyle = { stripe: string; label: string };

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'flow-vinyasa':     { stripe: '#8B6F47', label: 'Vinyasa' },           // terracotta
  'yin-restorative':  { stripe: '#6B7355', label: 'Yin & Restorative' }, // olive
  'hatha-gentle':     { stripe: '#A6896D', label: 'Hatha' },             // sand
  'ashtanga-intense': { stripe: '#5A3E2B', label: 'Ashtanga' },          // deep earth
  'meditation':       { stripe: '#7A6B5D', label: 'Meditation' },        // warm gray
};

function getCategoryKey(name: string): string {
  if (['Sunrise Vinyasa', 'Power Flow', 'Breath & Movement', 'Vinyasa Flow', 'Vinyasa Krama', 'Detox Yoga'].includes(name)) return 'flow-vinyasa';
  if (['Yin Yoga', 'Yin & Restore', 'Restorative Yoga', 'Deep Stretch & Breath'].includes(name)) return 'yin-restorative';
  if (['Gentle Flow', 'Hatha Foundations'].includes(name)) return 'hatha-gentle';
  if (['Ashtanga Primary'].includes(name)) return 'ashtanga-intense';
  if (['Pranayama & Meditación', 'Meditation', 'Tantra Vinyasa'].includes(name)) return 'meditation';
  return 'flow-vinyasa';
}

function categoryFor(name: string): CategoryStyle {
  return CATEGORY_STYLES[getCategoryKey(name)];
}

// ─── Grid constants ─────────────────────────────────────────────────────────
const GRID_START_HOUR = 6;
const GRID_END_HOUR = 22;
const HOUR_PX = 64;
const GRID_HEIGHT = (GRID_END_HOUR - GRID_START_HOUR) * HOUR_PX;

const timeLabels = Array.from(
  { length: GRID_END_HOUR - GRID_START_HOUR + 1 },
  (_, i) => `${String(GRID_START_HOUR + i).padStart(2, '0')}:00`,
);

type SerializedClass = Omit<YogaClass, 'startsAt'> & { startsAt: string };
type SerializedBooking = Omit<Booking, 'createdAt'> & { createdAt: string };

function classTopPx(startsAt: string): number {
  const d = new Date(startsAt);
  const minutes = d.getHours() * 60 + d.getMinutes() - GRID_START_HOUR * 60;
  return Math.max(0, (minutes / 60) * HOUR_PX);
}

// Map payment status → Badge variant + display label.
function paymentBadgeFor(status: string): {
  variant: 'active' | 'warning' | 'inactive' | 'destructive' | 'neutral';
  label: string;
} {
  switch (status) {
    case 'paid':
      return { variant: 'active', label: 'Paid' };
    case 'pending':
      return { variant: 'warning', label: 'Pending' };
    case 'cancelled':
      return { variant: 'inactive', label: 'Cancelled' };
    case 'no-show':
      return { variant: 'destructive', label: 'No-show' };
    case 'free':
      return { variant: 'neutral', label: 'Free' };
    default:
      return { variant: 'neutral', label: status };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════════════
export default function CalendarioClient({
  initialClasses,
  initialBookings,
}: {
  initialClasses: SerializedClass[];
  initialBookings: SerializedBooking[];
}) {
  const router = useRouter();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedClass, setSelectedClass] = useState<SerializedClass | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mobile: which day index (0–6) is currently visible. Defaults to today if
  // today is within the displayed week, otherwise 0 (Monday).
  const [mobileDayIdx, setMobileDayIdx] = useState(0);

  const weekDays = useMemo(() => {
    const today = new Date();
    const reference = today.getDay() === 0 ? addDays(today, 1) : today;
    const monday = addDays(startOfWeek(reference, { weekStartsOn: 1 }), weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  }, [weekOffset]);

  // Whenever the week changes, jump mobile selector to today if it's in view.
  useEffect(() => {
    const todayIdx = weekDays.findIndex((d) => isSameDay(d, new Date()));
    setMobileDayIdx(todayIdx >= 0 ? todayIdx : 0);
  }, [weekDays]);

  const weekLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[6];
    if (start.getMonth() === end.getMonth()) {
      return `${format(start, 'MMM d', { locale: enUS })} — ${format(end, 'd, yyyy', { locale: enUS })}`;
    }
    return `${format(start, 'MMM d', { locale: enUS })} — ${format(end, 'MMM d, yyyy', { locale: enUS })}`;
  }, [weekDays]);

  const classMap = useMemo(() => {
    const map = new Map<number, SerializedClass[]>();
    weekDays.forEach((_, i) => map.set(i, []));
    initialClasses
      .filter((c) => c.isActive)
      .forEach((c) => {
        const dayIdx = weekDays.findIndex((d) => isSameDay(new Date(c.startsAt), d));
        if (dayIdx !== -1) map.get(dayIdx)!.push(c);
      });
    return map;
  }, [weekDays, initialClasses]);

  const totalClassesInWeek = useMemo(
    () => Array.from(classMap.values()).reduce((acc, arr) => acc + arr.length, 0),
    [classMap],
  );

  const classBookings = useMemo(
    () => (selectedClass ? initialBookings.filter((b) => b.classId === selectedClass.id) : []),
    [selectedClass, initialBookings],
  );

  const occupied = selectedClass ? selectedClass.capacity - selectedClass.spotsRemaining : 0;
  const occupancyPct = selectedClass
    ? Math.min(100, (occupied / selectedClass.capacity) * 100)
    : 0;

  function openDrawer(c: SerializedClass) {
    setSelectedClass(c);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    // Keep selectedClass briefly so exit animation can read its content
    setTimeout(() => setSelectedClass((cur) => (drawerOpen ? cur : null)), 250);
  }

  async function handleConfirmDelete() {
    if (!selectedClass) return;
    setIsDeleting(true);
    try {
      await deleteClass(selectedClass.id);
      setDeleteOpen(false);
      setDrawerOpen(false);
      setSelectedClass(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10">
      {/* ─── Header row ─────────────────────────────────────────────────── */}
      <div className="mb-10 lg:mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-6">
        {/* Week navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o - 1)}
              aria-label="Previous week"
              className="p-2 text-ink hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              <ChevronLeft width={18} height={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset(0)}
              className="px-3 py-2 font-body text-sm text-ink hover:bg-cream/40 transition-colors duration-200 cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setWeekOffset((o) => o + 1)}
              aria-label="Next week"
              className="p-2 text-ink hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              <ChevronRight width={18} height={18} strokeWidth={1.5} />
            </button>
          </div>
          <h2 className="font-body text-base font-medium text-ink">{weekLabel}</h2>
        </div>

        {/* Manage the recurring schedule / add a one-off class */}
        <div>
          <Button
            variant="secondary"
            icon={<Plus width={16} height={16} strokeWidth={1.5} />}
            onClick={() => router.push('/admin/clases')}
          >
            Manage classes
          </Button>
        </div>
      </div>

      {/* ─── Grid OR empty state ────────────────────────────────────────── */}
      {totalClassesInWeek === 0 ? (
        <EmptyState
          icon={<CalendarX strokeWidth={1} />}
          heading="No classes this week"
          description="Classes appear automatically from the recurring weekly schedule. Manage the schedule or add a one-off class."
          action={
            <Button
              variant="primary"
              icon={<Plus width={16} height={16} strokeWidth={1.5} />}
              onClick={() => router.push('/admin/clases')}
            >
              Manage classes
            </Button>
          }
        />
      ) : (
        <>
          {/* Mobile: day selector + single-day list */}
          <div className="md:hidden">
            <MobileDaySelector
              days={weekDays}
              selected={mobileDayIdx}
              onSelect={setMobileDayIdx}
            />
            <MobileDayList
              classes={classMap.get(mobileDayIdx) ?? []}
              onSelect={openDrawer}
            />
          </div>

          {/* Desktop / tablet: full 7-day grid */}
          <div className="hidden md:block overflow-x-auto">
            <DesktopWeekGrid
              days={weekDays}
              classMap={classMap}
              onSelect={openDrawer}
            />
          </div>
        </>
      )}

      {/* ─── Drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && selectedClass && (
          <>
            {/* Backdrop */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-ink/30"
            />

            {/* Panel — full screen on mobile, side drawer on md+ */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Class details"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[420px] lg:w-[480px] bg-warm-white border-l border-ink/10 overflow-y-auto"
            >
              <DrawerContent
                clase={selectedClass}
                bookings={classBookings}
                occupied={occupied}
                occupancyPct={occupancyPct}
                onClose={() => setDrawerOpen(false)}
                onDelete={() => setDeleteOpen(true)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Delete confirmation ────────────────────────────────────────── */}
      <DeleteConfirmation
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete class?"
        description="This will permanently delete this class and all its bookings. This action cannot be undone."
        confirmLabel="Delete class"
        loading={isDeleting}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Desktop / tablet — 7-day grid
// ═══════════════════════════════════════════════════════════════════════════
function DesktopWeekGrid({
  days,
  classMap,
  onSelect,
}: {
  days: Date[];
  classMap: Map<number, SerializedClass[]>;
  onSelect: (c: SerializedClass) => void;
}) {
  return (
    <div className="grid grid-cols-[60px_repeat(7,minmax(120px,1fr))] gap-2 lg:gap-3 min-w-[800px]">
      {/* Top-left empty cell */}
      <div />
      {/* Day headers */}
      {days.map((day) => (
        <DayHeader key={day.toISOString()} day={day} />
      ))}

      {/* Time column */}
      <div className="relative" style={{ height: GRID_HEIGHT }}>
        {timeLabels.slice(0, -1).map((label, i) => (
          <div
            key={label}
            className="absolute right-2 font-body text-[10px] tracking-[0.1em] text-ink/40"
            style={{ top: i * HOUR_PX - 6 }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day columns */}
      {days.map((day, dayIdx) => (
        <div
          key={day.toISOString()}
          className="relative"
          style={{ height: GRID_HEIGHT }}
        >
          {/* Hourly horizontal lines */}
          {Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, i) => (
            <div
              key={i}
              aria-hidden
              className="absolute left-0 right-0 border-t border-ink/5"
              style={{ top: i * HOUR_PX }}
            />
          ))}
          {(classMap.get(dayIdx) ?? []).map((clase) => (
            <CalendarClassCard
              key={clase.id}
              clase={clase}
              onClick={() => onSelect(clase)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DayHeader({ day }: { day: Date }) {
  const today = isSameDay(day, new Date());
  return (
    <div className="text-center pb-4 mb-2 border-b border-ink/10">
      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50">
        {format(day, 'EEE', { locale: enUS })}
      </p>
      {today ? (
        <span className="mt-1 inline-flex items-center justify-center w-9 h-9 rounded-full bg-burgundy text-cream font-body text-base font-medium">
          {format(day, 'd', { locale: enUS })}
        </span>
      ) : (
        <p className="font-body text-xl font-light text-ink leading-none mt-1">
          {format(day, 'd', { locale: enUS })}
        </p>
      )}
    </div>
  );
}

function CalendarClassCard({
  clase,
  onClick,
}: {
  clase: SerializedClass;
  onClick: () => void;
}) {
  const top = classTopPx(clase.startsAt);
  const height = Math.max(((clase.durationMinutes ?? 60) / 60) * HOUR_PX, 48);
  const filled = clase.capacity - clase.spotsRemaining;
  const cat = categoryFor(clase.name);

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-0.5 right-0.5 p-3 text-left overflow-hidden border-l-[3px] transition-colors duration-200 cursor-pointer"
      style={{
        top,
        height,
        borderLeftColor: cat.stripe,
        // tint backgrounds: 8% on rest, 15% on hover. Hex + alpha-suffix.
        backgroundColor: `${cat.stripe}14`, // 0x14 ≈ 8%
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${cat.stripe}26`; // 0x26 ≈ 15%
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${cat.stripe}14`;
      }}
    >
      <p className="font-body text-sm font-medium text-ink leading-tight truncate">
        {clase.name}
      </p>
      <p className="font-body text-xs text-ink/60 mt-1">
        {format(new Date(clase.startsAt), 'HH:mm')}
      </p>
      {height >= 64 && (
        <p className="font-body text-xs text-ink/50 mt-2">
          {filled}/{clase.capacity}
        </p>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Mobile — day selector + vertical list
// ═══════════════════════════════════════════════════════════════════════════
function MobileDaySelector({
  days,
  selected,
  onSelect,
}: {
  days: Date[];
  selected: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="mb-6 -mx-6 px-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-2 min-w-max pb-1">
        {days.map((day, i) => {
          const today = isSameDay(day, new Date());
          const active = i === selected;
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(i)}
              className={`
                flex flex-col items-center w-14 py-3 border transition-colors duration-200 cursor-pointer
                ${
                  active
                    ? 'border-burgundy bg-burgundy text-cream'
                    : 'border-ink/10 text-ink hover:bg-cream/40'
                }
              `}
            >
              <span
                className={`font-body text-[10px] tracking-[0.2em] uppercase ${
                  active ? 'text-cream/80' : 'text-ink/50'
                }`}
              >
                {format(day, 'EEE', { locale: enUS })}
              </span>
              <span
                className={`font-body text-lg font-light leading-none mt-1 ${
                  today && !active ? 'text-burgundy' : ''
                }`}
              >
                {format(day, 'd', { locale: enUS })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileDayList({
  classes,
  onSelect,
}: {
  classes: SerializedClass[];
  onSelect: (c: SerializedClass) => void;
}) {
  if (classes.length === 0) {
    return (
      <p className="font-body text-sm text-ink/40 italic py-12 text-center">
        No classes scheduled for this day.
      </p>
    );
  }

  // Sort by time ascending for the mobile day view.
  const sorted = [...classes].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  return (
    <div className="space-y-3">
      {sorted.map((clase) => {
        const cat = categoryFor(clase.name);
        const filled = clase.capacity - clase.spotsRemaining;
        return (
          <button
            key={clase.id}
            type="button"
            onClick={() => onSelect(clase)}
            className="w-full text-left p-4 border-l-[3px] flex items-center gap-4 transition-colors duration-200 cursor-pointer"
            style={{ borderLeftColor: cat.stripe, backgroundColor: `${cat.stripe}14` }}
          >
            <div className="font-body text-sm text-ink font-medium w-12">
              {format(new Date(clase.startsAt), 'HH:mm')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium text-ink truncate">
                {clase.name}
              </p>
              <p className="font-body text-xs text-ink/60 mt-0.5">
                {filled}/{clase.capacity} · {cat.label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Drawer content
// ═══════════════════════════════════════════════════════════════════════════
function DrawerContent({
  clase,
  bookings,
  occupied,
  occupancyPct,
  onClose,
  onDelete,
}: {
  clase: SerializedClass;
  bookings: SerializedBooking[];
  occupied: number;
  occupancyPct: number;
  onClose: () => void;
  onDelete: () => void;
}) {
  const cat = categoryFor(clase.name);
  const remaining = clase.spotsRemaining;
  const remainingLabel =
    remaining === 0
      ? 'Fully booked'
      : remaining === 1
      ? '1 spot left'
      : `${remaining} spots available`;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar — category dot + close */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-ink/10">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: cat.stripe }}
          />
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/60 truncate">
            {cat.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close drawer"
          className="p-2 text-ink hover:opacity-70 transition-opacity duration-200 cursor-pointer"
        >
          <X width={20} height={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        {/* Class title */}
        <h2 className="font-body text-xl font-medium text-ink leading-tight">
          {clase.name}
        </h2>

        {/* Occupancy */}
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50">
              Occupancy
            </span>
            <span className="font-body text-sm text-ink">
              {occupied}/{clase.capacity} bookings
            </span>
          </div>
          <div className="h-1 bg-ink/10 mt-2 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full transition-all duration-500"
              style={{ width: `${occupancyPct}%`, background: cat.stripe }}
            />
          </div>
          <p className="font-body text-xs text-ink/50 mt-2">{remainingLabel}</p>
        </div>

        {/* Metadata */}
        <div className="mt-8">
          <MetaRow
            icon={<CalendarIcon width={16} height={16} strokeWidth={1.5} />}
            label="Date & time"
            value={format(new Date(clase.startsAt), 'EEEE, MMMM d · HH:mm', { locale: enUS })}
          />
          <MetaRow
            icon={<Clock width={16} height={16} strokeWidth={1.5} />}
            label="Duration"
            value={`${clase.durationMinutes} minutes`}
          />
          <MetaRow
            icon={<MapPin width={16} height={16} strokeWidth={1.5} />}
            label="Location"
            value={clase.location.toLowerCase() === 'open-air shala' ? 'Open-air shala' : clase.location}
          />
          <MetaRow
            icon={<DollarSign width={16} height={16} strokeWidth={1.5} />}
            label="Price"
            value={clase.priceUsd === 0 ? 'Free' : `$${clase.priceUsd} USD`}
          />
          {clase.instructor && (
            <MetaRow
              icon={<User width={16} height={16} strokeWidth={1.5} />}
              label="Instructor"
              value={clase.instructor}
              isLast
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          {/* TODO: wire to the existing class edit flow when 9.4 lands. For
              now this is a placeholder — Nancy can still edit via /admin/clases. */}
          <Button
            variant="secondary"
            icon={<Pencil width={16} height={16} strokeWidth={1.5} />}
          >
            Edit
          </Button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 px-3 py-2 font-body text-sm text-burgundy hover:opacity-70 transition-opacity duration-200 cursor-pointer"
          >
            <Trash2 width={16} height={16} strokeWidth={1.5} />
            <span>Delete</span>
          </button>
        </div>

        {/* Bookings */}
        <div className="mt-10">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50">
            Bookings ({bookings.length})
          </p>
          {bookings.length === 0 ? (
            <p className="font-body text-sm text-ink/40 italic py-8 text-center">
              No bookings yet
            </p>
          ) : (
            <ul className="mt-4">
              {bookings.map((b, i) => {
                const badge = paymentBadgeFor(b.paymentStatus);
                return (
                  <li
                    key={b.id}
                    className={`flex items-start justify-between gap-3 py-3 ${
                      i === bookings.length - 1 ? '' : 'border-b border-ink/10'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-body text-sm text-ink truncate">
                        {b.firstName} {b.lastName}
                      </p>
                      <p className="font-body text-xs text-ink/50 mt-0.5 truncate">
                        {b.email}
                      </p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 py-4 ${
        isLast ? '' : 'border-b border-ink/10'
      }`}
    >
      <span className="text-ink/40 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50">
          {label}
        </p>
        <p className="font-body text-sm text-ink mt-1">{value}</p>
      </div>
    </div>
  );
}
