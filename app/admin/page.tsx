'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  format,
  isThisWeek,
  isToday,
  isYesterday,
  subWeeks,
  startOfMonth,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  UserCheck,
  CalendarPlus,
  type LucideIcon,
} from 'lucide-react';
import {
  MOCK_CLASSES,
  MOCK_BOOKINGS,
  getDailyBookingsData,
  getWeeklyRevenueData,
  getClassDistributionData,
} from '@/lib/mock-data';
import { PageHeader } from '@/components/admin/PageHeader';
import { Card } from '@/components/admin/Card';
import { Badge } from '@/components/admin/Badge';
import { Button } from '@/components/admin/Button';
import { EmptyState } from '@/components/admin/EmptyState';

// ─── Earth-tone palette (mirrors DESIGN_SYSTEM.md §2 Accents) ───────────────
const COLORS = {
  sage: '#6B7355',
  terracotta: '#8B6F47',
  burgundy: '#8D0000',
  sand: '#A6896D',
  warmGray: '#7A6B5D',
} as const;

// Positional palette for the donut (6th category falls back to ink/60).
const DONUT_COLORS = [
  COLORS.sage,
  COLORS.terracotta,
  COLORS.burgundy,
  COLORS.sand,
  COLORS.warmGray,
  'rgba(49,49,49,0.6)', // ink/60 fallback
];

// Shared Recharts cosmetics.
const AXIS_TICK = { fontSize: 11, fill: 'rgba(49,49,49,0.5)' } as const;
const GRID_STROKE = 'rgba(49,49,49,0.08)';
const TOOLTIP_STYLE: React.CSSProperties = {
  fontSize: 12,
  border: '1px solid rgba(49,49,49,0.1)',
  borderRadius: 0,
  background: '#ffffff',
  padding: '12px',
};

// ─── Page ───────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const now = new Date();

  // Metrics — data fetching preserved verbatim from the existing implementation.
  const metrics = useMemo(() => {
    const reservasHoy = MOCK_BOOKINGS.filter((b) => {
      const clase = MOCK_CLASSES.find((c) => c.id === b.classId);
      return clase && isToday(clase.startsAt);
    }).length;

    const reservasAyer = MOCK_BOOKINGS.filter((b) => {
      const clase = MOCK_CLASSES.find((c) => c.id === b.classId);
      return clase && isYesterday(clase.startsAt);
    }).length;

    const reservasEstaSemana = MOCK_BOOKINGS.filter((b) => {
      const clase = MOCK_CLASSES.find((c) => c.id === b.classId);
      return clase && isThisWeek(clase.startsAt, { weekStartsOn: 1 });
    }).length;

    const reservasSemanaAnterior = MOCK_BOOKINGS.filter((b) => {
      const clase = MOCK_CLASSES.find((c) => c.id === b.classId);
      if (!clase) return false;
      const semAnt = subWeeks(now, 1);
      return (
        isThisWeek(clase.startsAt, { weekStartsOn: 1 }) === false &&
        clase.startsAt >= subWeeks(semAnt, 1)
      );
    }).length;

    const ingresosDelMes = MOCK_BOOKINGS.filter(
      (b) => b.paymentStatus === 'paid' && b.createdAt >= startOfMonth(now),
    ).reduce((acc, b) => {
      const clase = MOCK_CLASSES.find((c) => c.id === b.classId);
      return acc + (clase?.priceUsd ?? 0) * b.persons;
    }, 0);

    const clasesPrximos7 = MOCK_CLASSES.filter(
      (c) =>
        c.isActive &&
        c.startsAt >= now &&
        c.startsAt <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    ).length;

    const clasesConReservas = MOCK_CLASSES.filter(
      (c) => c.isActive && c.startsAt > now,
    );
    const tasaOcupacion =
      clasesConReservas.length > 0
        ? Math.round(
            (clasesConReservas.reduce(
              (acc, c) => acc + (c.capacity - c.spotsRemaining) / c.capacity,
              0,
            ) /
              clasesConReservas.length) *
              100,
          )
        : 0;

    const alumnosUnicos = new Set(MOCK_BOOKINGS.map((b) => b.email)).size;

    return {
      reservasHoy,
      reservasAyer,
      reservasEstaSemana,
      reservasSemanaAnterior,
      ingresosDelMes,
      clasesPrximos7,
      tasaOcupacion,
      alumnosUnicos,
    };
  }, []);

  const upcomingClasses = useMemo(
    () =>
      MOCK_CLASSES.filter((c) => c.isActive && c.startsAt >= now)
        .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
        .slice(0, 5),
    [],
  );

  const dailyData = useMemo(() => getDailyBookingsData(), []);
  const weeklyData = useMemo(() => getWeeklyRevenueData(), []);
  const pieData = useMemo(() => getClassDistributionData(), []);

  // Translate the "Otras" fallback category to English and remap colors to the
  // earth-tone palette positionally. The underlying mock data is left untouched.
  const pieDataView = useMemo(
    () =>
      pieData.map((slice, i) => ({
        ...slice,
        name: slice.name === 'Otras' ? 'Other' : slice.name,
        color: DONUT_COLORS[i] ?? DONUT_COLORS[DONUT_COLORS.length - 1],
      })),
    [pieData],
  );

  const todayEyebrow = format(now, 'EEEE, MMMM d, yyyy', { locale: enUS });

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-7xl mx-auto">
      <PageHeader eyebrow={todayEyebrow} heading="Dashboard" />

      {/* ─── Stats row ────────────────────────────────────────────────── */}
      <section
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10 lg:mb-12"
        aria-label="Key metrics"
      >
        <StatCard
          icon={Users}
          color={COLORS.sage}
          value={metrics.reservasHoy}
          label="Bookings today"
          delta={metrics.reservasHoy - metrics.reservasAyer}
          deltaLabel="vs yesterday"
        />
        <StatCard
          icon={CalendarDays}
          color={COLORS.sage}
          value={metrics.reservasEstaSemana}
          label="This week"
          delta={metrics.reservasEstaSemana - metrics.reservasSemanaAnterior}
          deltaLabel="vs last week"
        />
        <StatCard
          icon={DollarSign}
          color={COLORS.terracotta}
          value={`$${metrics.ingresosDelMes}`}
          label="Revenue this month"
        />
        <StatCard
          icon={Clock}
          color={COLORS.sand}
          value={metrics.clasesPrximos7}
          label="Classes (7 days)"
        />
        <StatCard
          icon={TrendingUp}
          color={COLORS.burgundy}
          value={`${metrics.tasaOcupacion}%`}
          label="Avg. occupancy"
        />
        <StatCard
          icon={UserCheck}
          color={COLORS.warmGray}
          value={metrics.alumnosUnicos}
          label="Unique students"
        />
      </section>

      {/* ─── Charts row — bar (2/3) + donut (1/3) ──────────────────────── */}
      <section
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 lg:mb-12"
        aria-label="Bookings and class distribution"
      >
        {/* Bookings per day */}
        <Card className="lg:col-span-2">
          <ChartHeading title="Bookings per day" subtitle="Last 30 days" />
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} barSize={6}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="date" tick={AXIS_TICK} interval={4} />
                <YAxis tick={AXIS_TICK} width={28} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ fill: 'rgba(49,49,49,0.04)' }}
                />
                <Bar dataKey="reservas" fill={COLORS.sage} radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Most popular classes */}
        <Card>
          <ChartHeading title="Most popular classes" />
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieDataView}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={72}
                  dataKey="value"
                  paddingAngle={2}
                  stroke="none"
                >
                  {pieDataView.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(val: number) => [`${val}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-6 space-y-3">
            {pieDataView.map((d) => (
              <li
                key={d.name}
                className="flex justify-between items-center gap-3"
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span
                    aria-hidden
                    className="w-2 h-2 flex-shrink-0"
                    style={{ background: d.color }}
                  />
                  <span className="font-body text-sm text-ink/80 truncate">
                    {d.name}
                  </span>
                </span>
                <span className="font-body text-sm font-medium text-ink">
                  {d.value}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ─── Revenue per week (full width) ──────────────────────────────── */}
      <section className="mb-10 lg:mb-12" aria-label="Revenue trend">
        <Card>
          <ChartHeading title="Revenue per week" subtitle="Last 8 weeks" />
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                <XAxis dataKey="semana" tick={AXIS_TICK} />
                <YAxis
                  tick={AXIS_TICK}
                  width={44}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(val: number) => [`$${val}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="ingresos"
                  stroke={COLORS.terracotta}
                  strokeWidth={2}
                  dot={{ r: 4, fill: COLORS.terracotta, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* ─── Upcoming classes ───────────────────────────────────────────── */}
      <section aria-label="Upcoming classes">
        <header className="flex justify-between items-end mb-6">
          <h2 className="font-body text-base font-medium text-ink">
            Upcoming classes
          </h2>
          <Link
            href="/admin/calendario"
            className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-200"
          >
            View calendar →
          </Link>
        </header>

        {upcomingClasses.length === 0 ? (
          <EmptyState
            icon={<CalendarPlus strokeWidth={1} />}
            heading="No upcoming classes"
            description="Classes appear automatically from the recurring weekly schedule. Manage the schedule or add a one-off class."
            action={
              <Link href="/admin/clases">
                <Button variant="primary">Manage classes</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {upcomingClasses.map((clase) => (
              <UpcomingClassRow key={clase.id} clase={clase} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Stat card ──────────────────────────────────────────────────────────────
type StatCardProps = {
  icon: LucideIcon;
  color: string;
  value: string | number;
  label: string;
  delta?: number;
  deltaLabel?: string;
};

function StatCard({
  icon: Icon,
  color,
  value,
  label,
  delta,
  deltaLabel,
}: StatCardProps) {
  const deltaSign = delta === undefined ? null : delta > 0 ? '+' : delta < 0 ? '' : '+';
  const deltaColorClass =
    delta === undefined
      ? ''
      : delta > 0
      ? 'text-[#6B7355]' // sage — positive
      : delta < 0
      ? 'text-[#8B6F47]' // terracotta — negative
      : 'text-ink/40'; // neutral

  return (
    <Card padding="tight" className="hover:border-ink/20 transition-colors duration-200">
      <div
        aria-hidden
        className="w-8 h-8 flex items-center justify-center"
        style={{ background: `${color}1A` /* hex + 1A ≈ 10% alpha */ }}
      >
        <Icon width={16} height={16} strokeWidth={1.5} style={{ color }} />
      </div>
      <p className="font-body text-3xl font-light text-ink leading-none mt-4">
        {value}
      </p>
      <p className="font-body text-xs text-ink/60 mt-1">{label}</p>
      {delta !== undefined && deltaLabel && (
        <p className={`font-body text-xs font-medium mt-2 ${deltaColorClass}`}>
          {deltaSign}
          {delta} {deltaLabel}
        </p>
      )}
    </Card>
  );
}

// ─── Chart heading ──────────────────────────────────────────────────────────
function ChartHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="font-body text-base font-medium text-ink leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-xs text-ink/50 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

// ─── Upcoming class row ─────────────────────────────────────────────────────
type ClaseLike = (typeof MOCK_CLASSES)[number];

function UpcomingClassRow({ clase }: { clase: ClaseLike }) {
  const booked = clase.capacity - clase.spotsRemaining;
  const remaining = clase.spotsRemaining;
  const remainingPct = clase.capacity > 0 ? remaining / clase.capacity : 0;

  // Status: destructive when full, warning when <50% remaining, otherwise active.
  const statusVariant: 'active' | 'warning' | 'destructive' =
    remaining === 0 ? 'destructive' : remainingPct < 0.5 ? 'warning' : 'active';
  const statusLabel =
    remaining === 0 ? 'Full' : remainingPct < 0.5 ? 'Low' : 'Open';

  return (
    <Card padding="tight" className="hover:border-ink/20 transition-colors duration-200">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Date */}
        <div className="col-span-3 md:col-span-1">
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-ink/50">
            {format(clase.startsAt, 'EEE', { locale: enUS })}
          </p>
          <p className="font-body text-xl font-light text-ink leading-none mt-0.5">
            {format(clase.startsAt, 'd', { locale: enUS })}
          </p>
        </div>

        {/* Time */}
        <div className="col-span-3 md:col-span-1">
          <p className="font-body text-sm text-ink">
            {format(clase.startsAt, 'HH:mm')}
          </p>
        </div>

        {/* Class name */}
        <div className="col-span-6 md:col-span-4 min-w-0">
          <p className="font-body text-sm font-medium text-ink truncate">
            {clase.name}
          </p>
        </div>

        {/* Instructor */}
        <div className="col-span-6 md:col-span-2 min-w-0">
          {clase.instructor ? (
            <p className="font-body text-sm text-ink/70 truncate">
              {clase.instructor}
            </p>
          ) : (
            <p className="font-body text-sm text-ink/30">—</p>
          )}
        </div>

        {/* Capacity */}
        <div className="col-span-3 md:col-span-2">
          <p className="font-body text-sm text-ink">
            {booked} / {clase.capacity}
          </p>
        </div>

        {/* Status */}
        <div className="col-span-3 md:col-span-2 flex md:justify-end">
          <Badge variant={statusVariant}>{statusLabel}</Badge>
        </div>
      </div>
    </Card>
  );
}
