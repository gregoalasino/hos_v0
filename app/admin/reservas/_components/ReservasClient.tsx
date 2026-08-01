'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Eye,
  Trash2,
  User as UserIcon,
  Phone,
  Tag,
  CalendarDays,
  MapPin,
  DollarSign,
  Users as UsersIcon,
  Check,
} from 'lucide-react';
import type { Booking } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/admin/Button';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { DeleteConfirmation } from '@/components/admin/DeleteConfirmation';
import { NativeSelect } from '@/components/admin/NativeSelect';
import { RowIconButton } from '@/app/admin/clases/_components/ClasesClient';
import { confirmBooking, cancelBookingAdmin } from '@/app/actions/bookings';
import { paymentMethodLabel } from '@/lib/payment-methods';

type SerializedBooking = Omit<Booking, 'createdAt'> & { createdAt: string };

type ClassInfo = {
  id: string;
  name: string;
  startsAt: string;
  color?: string | null;
  priceUsd: number;
};
type UpsellInfo = { id: string; name: string; priceUsd: number };

// Map paymentStatus → Badge variant + display label (matches Calendar mapping).
function paymentBadge(status: Booking['paymentStatus']): {
  variant: 'active' | 'warning' | 'inactive' | 'destructive' | 'neutral';
  label: string;
} {
  switch (status) {
    case 'paid':
      return { variant: 'active', label: 'Paid' };
    case 'free':
      return { variant: 'neutral', label: 'Free' };
    case 'pending':
      return { variant: 'warning', label: 'Pending' };
    case 'cancelled':
      return { variant: 'inactive', label: 'Cancelled' };
    case 'no-show':
      return { variant: 'destructive', label: 'No-show' };
    default:
      return { variant: 'neutral', label: status };
  }
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'free', label: 'Free' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no-show', label: 'No-show' },
];

// ═══════════════════════════════════════════════════════════════════════════
export default function ReservasClient({
  initialBookings,
  classMap,
  upsellMap,
}: {
  initialBookings: SerializedBooking[];
  classMap: Record<string, ClassInfo>;
  upsellMap: Record<string, UpsellInfo>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Filters — `?q=` pre-fills the search (e.g. deep-linked from Packs to
  // reconcile a customer's bookings against their pack).
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [fromDate, setFromDate] = useState(''); // YYYY-MM-DD, filters on booking date
  const [toDate, setToDate] = useState('');

  // Drawer + delete
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<SerializedBooking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Class filter options
  const classOptions = useMemo(() => {
    const present = Array.from(new Set(initialBookings.map((b) => b.className))).sort();
    return [
      { value: 'all', label: 'All classes' },
      ...present.map((name) => ({ value: name, label: name })),
    ];
  }, [initialBookings]);

  // Filter + sort
  const filtered = useMemo(() => {
    return initialBookings
      .filter((b) => {
        if (statusFilter !== 'all' && b.paymentStatus !== statusFilter) return false;
        if (classFilter !== 'all' && b.className !== classFilter) return false;
        if (fromDate && b.createdAt.slice(0, 10) < fromDate) return false;
        if (toDate && b.createdAt.slice(0, 10) > toDate) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !b.firstName.toLowerCase().includes(q) &&
            !b.lastName.toLowerCase().includes(q) &&
            !b.email.toLowerCase().includes(q) &&
            !b.bookingReference.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [initialBookings, search, statusFilter, classFilter, fromDate, toDate]);

  const filtersActive =
    search !== '' ||
    statusFilter !== 'all' ||
    classFilter !== 'all' ||
    fromDate !== '' ||
    toDate !== '';

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setClassFilter('all');
    setFromDate('');
    setToDate('');
  }

  const selectedBooking = useMemo(
    () => initialBookings.find((b) => b.id === selectedId) ?? null,
    [initialBookings, selectedId],
  );

  function openDetail(b: SerializedBooking) {
    setSelectedId(b.id);
    setDrawerOpen(true);
  }

  function handleConfirmPayment(id: string) {
    startTransition(async () => {
      await confirmBooking(id);
      router.refresh();
    });
  }

  async function handleConfirmCancel() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await cancelBookingAdmin(cancelTarget.id);
      setCancelTarget(null);
      setDrawerOpen(false);
      router.refresh();
    } finally {
      setIsCancelling(false);
    }
  }

  // Drawer math
  const selectedClass = selectedBooking ? classMap[selectedBooking.classId] : null;
  const selectedUpsells = selectedBooking
    ? (selectedBooking.upsells ?? []).map((id) => upsellMap[id]).filter(Boolean)
    : [];
  const selectedTotal =
    selectedBooking && selectedClass
      ? selectedClass.priceUsd * selectedBooking.persons +
        selectedUpsells.reduce((acc, u) => acc + u.priceUsd, 0)
      : 0;

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
      <PageHeader
        heading="Bookings"
        description={`${initialBookings.length} ${initialBookings.length === 1 ? 'booking' : 'bookings'}`}
      />

      {initialBookings.length === 0 ? (
        <EmptyState
          icon={<UsersIcon strokeWidth={1} />}
          heading="No bookings yet"
          description="Bookings made through the public site will appear here."
        />
      ) : (
        <>
          {/* Filters */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="relative md:w-72">
              <Search
                aria-hidden
                className="absolute left-0 top-1/2 -translate-y-1/2 text-ink/40"
                width={16}
                height={16}
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or code..."
                className="w-full pl-7 pb-2 border-b border-ink/20 bg-transparent font-body text-sm text-ink outline-none focus:border-ink transition-colors duration-200 placeholder:text-ink/30 placeholder:italic"
              />
            </div>
            <NativeSelect
              filter
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              options={classOptions}
              aria-label="Filter by class"
            />
            <NativeSelect
              filter
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={STATUS_OPTIONS}
              aria-label="Filter by status"
            />
            <div className="flex items-end gap-2">
              <label className="flex flex-col gap-1">
                <span className="font-body text-[10px] tracking-[0.15em] uppercase text-ink/50">From</span>
                <input
                  type="date"
                  value={fromDate}
                  max={toDate || undefined}
                  onChange={(e) => setFromDate(e.target.value)}
                  aria-label="From date"
                  className="pb-2 border-b border-ink/20 bg-transparent font-body text-sm text-ink outline-none focus:border-ink transition-colors duration-200"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-body text-[10px] tracking-[0.15em] uppercase text-ink/50">To</span>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate || undefined}
                  onChange={(e) => setToDate(e.target.value)}
                  aria-label="To date"
                  className="pb-2 border-b border-ink/20 bg-transparent font-body text-sm text-ink outline-none focus:border-ink transition-colors duration-200"
                />
              </label>
            </div>
            {filtersActive && (
              <Button variant="tertiary" onClick={clearFilters} className="md:ml-auto">
                Clear
              </Button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search strokeWidth={1} />}
              heading="No bookings match your filters"
              description="Try clearing the filters."
              action={
                filtersActive ? (
                  <Button variant="tertiary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <BookingsTable
              bookings={filtered}
              classMap={classMap}
              upsellMap={upsellMap}
              onView={openDetail}
              onCancel={(b) => setCancelTarget(b)}
            />
          )}
        </>
      )}

      {/* ─── Drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && selectedBooking && (
          <>
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-ink/30"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Booking details"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full md:w-[420px] lg:w-[480px] bg-white border-l border-ink/10 overflow-y-auto"
            >
              <BookingDrawerContent
                booking={selectedBooking}
                bookingClass={selectedClass}
                upsells={selectedUpsells}
                total={selectedTotal}
                isPending={isPending}
                onClose={() => setDrawerOpen(false)}
                onConfirmPayment={() => handleConfirmPayment(selectedBooking.id)}
                onCancel={() => setCancelTarget(selectedBooking)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <DeleteConfirmation
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel booking?"
        description="This will mark the booking as cancelled. The student will be notified."
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        loading={isCancelling}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Table
// ═══════════════════════════════════════════════════════════════════════════
function BookingsTable({
  bookings,
  classMap,
  upsellMap,
  onView,
  onCancel,
}: {
  bookings: SerializedBooking[];
  classMap: Record<string, ClassInfo>;
  upsellMap: Record<string, UpsellInfo>;
  onView: (b: SerializedBooking) => void;
  onCancel: (b: SerializedBooking) => void;
}) {
  const headers = [
    { label: 'Code', className: '' },
    { label: 'Student', className: '' },
    { label: 'Class', className: '' },
    { label: 'Date', className: 'hidden md:table-cell' },
    { label: 'People', className: 'hidden lg:table-cell' },
    { label: 'Total', className: 'hidden lg:table-cell' },
    { label: 'Status', className: '' },
    { label: '', className: '' },
  ];

  return (
    <div className="bg-white border border-ink/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 border-b border-ink/10">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className={`text-left px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase font-medium text-ink/50 ${h.className}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const clase = classMap[b.classId];
              const upsells = (b.upsells ?? []).map((id) => upsellMap[id]).filter(Boolean);
              const total = clase
                ? clase.priceUsd * b.persons + upsells.reduce((s, u) => s + u.priceUsd, 0)
                : 0;
              const badge = paymentBadge(b.paymentStatus);

              return (
                <tr
                  key={b.id}
                  onClick={() => onView(b)}
                  className="border-b border-ink/[0.08] last:border-0 hover:bg-neutral-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-ink/70 bg-neutral-50 px-2 py-0.5">
                      {b.bookingReference}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-body text-sm font-medium text-ink truncate">
                      {b.firstName} {b.lastName}
                    </p>
                    <p className="font-body text-xs text-ink/50 mt-0.5 truncate">
                      {b.email}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-body text-sm text-ink truncate">{b.className}</p>
                    {clase && (
                      <p className="font-body text-xs text-ink/50 mt-0.5">
                        {format(new Date(clase.startsAt), 'MMM d · HH:mm', { locale: enUS })}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="font-body text-sm text-ink/80">
                      {format(new Date(b.createdAt), 'MMM d, yyyy', { locale: enUS })}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="font-body text-sm text-ink">{b.persons}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="font-body text-sm font-medium text-ink">${total}</span>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <p className="font-body text-[10px] tracking-[0.15em] uppercase text-ink/40 mt-1.5">
                      {paymentMethodLabel(b.paymentMethod)}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <RowIconButton
                        ariaLabel="View booking"
                        onClick={() => onView(b)}
                      >
                        <Eye width={16} height={16} strokeWidth={1.5} />
                      </RowIconButton>
                      <RowIconButton
                        ariaLabel="Cancel booking"
                        onClick={() => onCancel(b)}
                        hoverDestructive
                        disabled={b.paymentStatus === 'cancelled'}
                      >
                        <Trash2 width={16} height={16} strokeWidth={1.5} />
                      </RowIconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Drawer
// ═══════════════════════════════════════════════════════════════════════════
function BookingDrawerContent({
  booking,
  bookingClass,
  upsells,
  total,
  isPending,
  onClose,
  onConfirmPayment,
  onCancel,
}: {
  booking: SerializedBooking;
  bookingClass: ClassInfo | null;
  upsells: UpsellInfo[];
  total: number;
  isPending: boolean;
  onClose: () => void;
  onConfirmPayment: () => void;
  onCancel: () => void;
}) {
  const badge = paymentBadge(booking.paymentStatus);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-ink/10">
        <span className="font-mono text-xs text-ink/70 bg-neutral-50 px-2 py-0.5">
          {booking.bookingReference}
        </span>
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
        <h2 className="font-body text-xl font-medium text-ink leading-tight">
          {booking.firstName} {booking.lastName}
        </h2>
        <div className="mt-3 flex items-center gap-3">
          <Badge variant={badge.variant}>{badge.label}</Badge>
          <span className="font-body text-[10px] tracking-[0.15em] uppercase text-ink/50">
            {paymentMethodLabel(booking.paymentMethod)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          {booking.paymentStatus === 'pending' && (
            <Button
              variant="primary"
              icon={<Check width={16} height={16} strokeWidth={1.5} />}
              onClick={onConfirmPayment}
              loading={isPending}
            >
              {booking.paymentMethod === 'card' ? 'Confirm payment' : 'Mark as paid'}
            </Button>
          )}
          {booking.paymentStatus !== 'cancelled' && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-3 py-2 font-body text-sm text-burgundy hover:opacity-70 transition-opacity duration-200 cursor-pointer"
            >
              <Trash2 width={16} height={16} strokeWidth={1.5} />
              <span>Cancel booking</span>
            </button>
          )}
        </div>

        {/* Student section */}
        <Section title="Student">
          <DrawerRow icon={<UserIcon width={14} height={14} strokeWidth={1.5} />} label="Email" value={booking.email} />
          {booking.phone && (
            <DrawerRow icon={<Phone width={14} height={14} strokeWidth={1.5} />} label="Phone" value={booking.phone} />
          )}
          {booking.referralCode && (
            <DrawerRow icon={<Tag width={14} height={14} strokeWidth={1.5} />} label="Promo code" value={booking.referralCode} />
          )}
          <DrawerRow
            icon={<CalendarDays width={14} height={14} strokeWidth={1.5} />}
            label="Booked on"
            value={format(new Date(booking.createdAt), 'MMM d, yyyy · HH:mm', { locale: enUS })}
          />
        </Section>

        {/* Class section */}
        {bookingClass && (
          <Section title="Class">
            <p className="font-body text-sm font-medium text-ink mb-3">{bookingClass.name}</p>
            <DrawerRow
              icon={<CalendarDays width={14} height={14} strokeWidth={1.5} />}
              label="Date"
              value={format(new Date(bookingClass.startsAt), 'MMM d, yyyy · HH:mm', { locale: enUS })}
            />
            <DrawerRow
              icon={<MapPin width={14} height={14} strokeWidth={1.5} />}
              label="People"
              value={String(booking.persons)}
            />
          </Section>
        )}

        {/* Upsells */}
        {upsells.length > 0 && (
          <Section title="Extras">
            <ul className="space-y-2">
              {upsells.map((u) => (
                <li key={u.id} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-body text-sm text-ink/70">
                    <DollarSign width={14} height={14} strokeWidth={1.5} className="text-ink/40" />
                    {u.name}
                  </span>
                  <span className="font-body text-sm font-medium text-ink">${u.priceUsd}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Total */}
        <div className="mt-10 flex justify-between items-center bg-burgundy text-cream px-5 py-4">
          <span className="font-body text-sm text-cream/70">Total</span>
          <span className="font-body text-lg font-medium text-cream">${total} USD</span>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 pt-6 border-t border-ink/10">
      <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50 mb-4">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DrawerRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-ink/40 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50">
          {label}
        </p>
        <p className="font-body text-sm text-ink mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}
