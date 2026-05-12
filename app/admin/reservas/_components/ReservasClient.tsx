'use client';

import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Search, MapPin, User, Phone, CalendarDays, Tag, Check, X, DollarSign,
} from 'lucide-react';
import type { Booking } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';
import { confirmBooking, cancelBookingAdmin, markNoShow } from '@/app/actions/bookings';

const SAGE = '#4a7c59';

// Booking with createdAt as string (serialized)
type SerializedBooking = Omit<Booking, 'createdAt'> & { createdAt: string };

interface ClassInfo {
  id: string;
  name: string;
  startsAt: string;
  color?: string | null;
  priceUsd: number;
}

interface UpsellInfo {
  id: string;
  name: string;
  priceUsd: number;
}

function getStatusMeta(status: Booking['paymentStatus'], lang: 'es' | 'en') {
  const map = {
    paid:      { es: 'Pagado',    en: 'Paid',      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    free:      { es: 'Gratis',    en: 'Free',       cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    pending:   { es: 'Pendiente', en: 'Pending',    cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    cancelled: { es: 'Cancelado', en: 'Cancelled',  cls: 'bg-gray-100 text-gray-500 border-gray-200' },
    'no-show': { es: 'No-show',   en: 'No-show',    cls: 'bg-red-50 text-red-600 border-red-200' },
  } as const;
  const item = map[status] ?? map.pending;
  return { label: item[lang], cls: item.cls };
}

export default function ReservasClient({
  initialBookings,
  classMap,
  upsellMap,
}: {
  initialBookings: SerializedBooking[];
  classMap: Record<string, ClassInfo>;
  upsellMap: Record<string, UpsellInfo>;
}) {
  const { lang } = useLanguage();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('all');
  const [filtroClase, setFiltroClase] = useState('all');
  const [selected, setSelected] = useState<SerializedBooking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const bookings = initialBookings.map(b => ({
    ...b,
    createdAt: new Date(b.createdAt),
  }));

  const claseOptions = useMemo(
    () => [...new Set(bookings.map(b => b.className))].sort(),
    [bookings],
  );

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      if (filtroEstado !== 'all' && b.paymentStatus !== filtroEstado) return false;
      if (filtroClase !== 'all' && b.className !== filtroClase) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.firstName.toLowerCase().includes(q) &&
          !b.lastName.toLowerCase().includes(q) &&
          !b.email.toLowerCase().includes(q) &&
          !b.bookingReference.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [search, filtroEstado, filtroClase, bookings]);

  function openDetail(b: (typeof filtered)[0]) {
    setSelected(initialBookings.find(x => x.id === b.id) ?? null);
    setDrawerOpen(true);
  }

  const selectedClase = selected ? classMap[selected.classId] : null;
  const selectedUpsells = selected ? (selected.upsells ?? []).map(id => upsellMap[id]).filter(Boolean) : [];
  const selectedTotal = selected && selectedClase
    ? selectedClase.priceUsd * selected.persons + selectedUpsells.reduce((acc, u) => acc + u.priceUsd, 0)
    : 0;

  const dateStr = (d: Date | string) => {
    const date = typeof d === 'string' ? new Date(d) : d;
    return lang === 'es'
      ? format(date, "d 'de' MMMM yyyy · HH:mm", { locale: es })
      : format(date, 'MMM d, yyyy · h:mm a');
  };

  function handleConfirm(id: string) {
    startTransition(async () => {
      await confirmBooking(id);
      router.refresh();
      setDrawerOpen(false);
    });
  }

  function handleCancel(id: string) {
    startTransition(async () => {
      await cancelBookingAdmin(id);
      router.refresh();
      setDrawerOpen(false);
    });
  }

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{tr(lang, 'Reservas', 'Bookings')}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} {tr(lang, 'reservas', 'bookings')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder={tr(lang, 'Buscar nombre, email, código...', 'Search name, email, reference...')}
            className="pl-9 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={filtroClase} onValueChange={setFiltroClase}>
          <SelectTrigger className="w-44 text-sm">
            <SelectValue placeholder={tr(lang, 'Todas las clases', 'All classes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tr(lang, 'Todas las clases', 'All classes')}</SelectItem>
            {claseOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger className="w-40 text-sm">
            <SelectValue placeholder={tr(lang, 'Todos', 'All statuses')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tr(lang, 'Todos', 'All')}</SelectItem>
            <SelectItem value="paid">{tr(lang, 'Pagado', 'Paid')}</SelectItem>
            <SelectItem value="pending">{tr(lang, 'Pendiente', 'Pending')}</SelectItem>
            <SelectItem value="cancelled">{tr(lang, 'Cancelado', 'Cancelled')}</SelectItem>
            <SelectItem value="no-show">No-show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  tr(lang, 'Código',   'Ref'),
                  tr(lang, 'Alumno',   'Student'),
                  tr(lang, 'Clase',    'Class'),
                  tr(lang, 'Fecha',    'Date'),
                  tr(lang, 'Personas', 'Pax'),
                  tr(lang, 'Total',    'Total'),
                  tr(lang, 'Estado',   'Status'),
                  '',
                ].map((h, i) => (
                  <th
                    key={i}
                    className={`text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide ${
                      h === tr(lang, 'Fecha', 'Date') ? 'hidden md:table-cell' :
                      h === tr(lang, 'Personas', 'Pax') || h === tr(lang, 'Total', 'Total') ? 'hidden lg:table-cell' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const clase = classMap[b.classId];
                const upsellsForB = (b.upsells ?? []).map(id => upsellMap[id]).filter(Boolean);
                const total = clase
                  ? clase.priceUsd * b.persons + upsellsForB.reduce((s, u) => s + u.priceUsd, 0)
                  : 0;
                const status = getStatusMeta(b.paymentStatus, lang);
                return (
                  <tr
                    key={b.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 cursor-pointer transition-colors"
                    onClick={() => openDetail(b)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-[11px] text-slate-500 bg-gray-100 px-2 py-0.5 rounded">
                        {b.bookingReference}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{b.firstName} {b.lastName}</p>
                      <p className="text-xs text-slate-400">{b.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {clase?.color && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: clase.color }} />}
                        <span className="text-slate-700">{b.className}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                      {clase
                        ? (lang === 'es'
                            ? format(new Date(clase.startsAt), "d MMM · HH:mm", { locale: es })
                            : format(new Date(clase.startsAt), 'MMM d · h:mm a'))
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{b.persons}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-medium text-slate-700">${total}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${status.cls}`}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{tr(lang, 'Ver →', 'View →')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm">
              {tr(lang, 'Sin reservas con ese filtro', 'No bookings match this filter')}
            </div>
          )}
        </div>
      </div>

      {/* Detail drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] p-0 overflow-y-auto gap-0 border-l border-gray-100">
          {selected && (
            <div className="flex flex-col min-h-full">
              <div className="px-6 pt-10 pb-5 border-b border-gray-100 bg-gray-50/60">
                <p className="font-mono text-[11px] text-slate-400 mb-2">{selected.bookingReference}</p>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">
                  {selected.firstName} {selected.lastName}
                </h2>
                <Badge variant="outline" className={`text-xs ${getStatusMeta(selected.paymentStatus, lang).cls}`}>
                  {getStatusMeta(selected.paymentStatus, lang).label}
                </Badge>
              </div>

              <div className="px-6 py-4 flex gap-2 border-b border-gray-100">
                {selected.paymentStatus === 'pending' && (
                  <Button
                    size="sm"
                    className="text-xs text-white flex-1 gap-1.5 h-9"
                    style={{ backgroundColor: SAGE }}
                    onClick={() => handleConfirm(selected.id)}
                    disabled={isPending}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {tr(lang, 'Confirmar pago', 'Confirm payment')}
                  </Button>
                )}
                {selected.paymentStatus !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 px-3 text-xs text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => handleCancel(selected.id)}
                    disabled={isPending}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>

              <div className="px-6 py-5 border-b border-gray-100">
                <SectionTitle>{tr(lang, 'Alumno', 'Student')}</SectionTitle>
                <div className="space-y-3">
                  <DrawerRow icon={<User className="w-3.5 h-3.5" />} label="Email" value={selected.email} />
                  {selected.phone && (
                    <DrawerRow icon={<Phone className="w-3.5 h-3.5" />} label={tr(lang, 'Teléfono', 'Phone')} value={selected.phone} />
                  )}
                  {selected.referralCode && (
                    <DrawerRow icon={<Tag className="w-3.5 h-3.5" />} label={tr(lang, 'Código de referido', 'Referral code')} value={selected.referralCode} highlight />
                  )}
                  <DrawerRow icon={<CalendarDays className="w-3.5 h-3.5" />} label={tr(lang, 'Reservado el', 'Booked on')} value={dateStr(selected.createdAt)} />
                </div>
              </div>

              {selectedClase && (
                <div className="px-6 py-5 border-b border-gray-100">
                  <SectionTitle>{tr(lang, 'Clase', 'Class')}</SectionTitle>
                  <div className="flex items-center gap-2 mb-3">
                    {selectedClase.color && <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: selectedClase.color }} />}
                    <span className="text-sm font-semibold text-slate-800">{selectedClase.name}</span>
                  </div>
                  <div className="space-y-3">
                    <DrawerRow icon={<CalendarDays className="w-3.5 h-3.5" />} label={tr(lang, 'Fecha', 'Date')} value={dateStr(selectedClase.startsAt)} />
                    <DrawerRow icon={<MapPin className="w-3.5 h-3.5" />} label={tr(lang, 'Personas', 'Persons')} value={String(selected.persons)} />
                  </div>
                </div>
              )}

              {selectedUpsells.length > 0 && (
                <div className="px-6 py-5 border-b border-gray-100">
                  <SectionTitle>{tr(lang, 'Extras', 'Extras')}</SectionTitle>
                  <div className="space-y-2">
                    {selectedUpsells.map(u => (
                      <div key={u.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                          {u.name}
                        </div>
                        <span className="text-sm font-medium text-slate-800">${u.priceUsd}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="px-6 py-5 mt-auto">
                <div className="flex items-center justify-between rounded-xl bg-slate-900 px-5 py-4">
                  <span className="text-sm font-medium text-white/70">Total</span>
                  <span className="text-lg font-bold text-white">${selectedTotal} USD</span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">{children}</h3>
  );
}

function DrawerRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-slate-400 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm truncate" style={{ color: highlight ? '#c4a030' : '#1e293b', fontWeight: highlight ? 600 : 400 }}>
          {value}
        </p>
      </div>
    </div>
  );
}
