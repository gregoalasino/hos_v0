'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { format, isThisWeek, isToday, isYesterday, subWeeks, startOfMonth } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  CalendarDays, Users, DollarSign, TrendingUp, Clock, UserCheck,
} from 'lucide-react';
import {
  MOCK_CLASSES,
  MOCK_BOOKINGS,
  getDailyBookingsData,
  getWeeklyRevenueData,
  getClassDistributionData,
} from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

// Importación del color desde DashboardLayout directamente en las constantes
const SAGE = '#4a7c59';
const TERRA = '#c4622d';

export default function AdminDashboard() {
  const { lang } = useLanguage();
  const dateFnsLocale = lang === 'es' ? es : enUS;
  const now = new Date();

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
      return isThisWeek(clase.startsAt, { weekStartsOn: 1 }) === false &&
        clase.startsAt >= subWeeks(semAnt, 1);
    }).length;

    const ingresosDelMes = MOCK_BOOKINGS
      .filter((b) => {
        return b.paymentStatus === 'paid' && b.createdAt >= startOfMonth(now);
      })
      .reduce((acc, b) => {
        const clase = MOCK_CLASSES.find((c) => c.id === b.classId);
        return acc + (clase?.priceUsd ?? 0) * b.persons;
      }, 0);

    const clasesPrximos7 = MOCK_CLASSES.filter(
      (c) => c.isActive && c.startsAt >= now &&
        c.startsAt <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    ).length;

    const clasesConReservas = MOCK_CLASSES.filter((c) => c.isActive && c.startsAt > now);
    const tasaOcupacion = clasesConReservas.length > 0
      ? Math.round(
          clasesConReservas.reduce(
            (acc, c) => acc + (c.capacity - c.spotsRemaining) / c.capacity,
            0
          ) / clasesConReservas.length * 100
        )
      : 0;

    const alumnosUnicos = new Set(MOCK_BOOKINGS.map((b) => b.email)).size;

    return {
      reservasHoy, reservasAyer,
      reservasEstaSemana, reservasSemanaAnterior,
      ingresosDelMes,
      clasesPrximos7,
      tasaOcupacion,
      alumnosUnicos,
    };
  }, []);

  const proximasClases = useMemo(
    () =>
      MOCK_CLASSES
        .filter((c) => c.isActive && c.startsAt >= now)
        .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
        .slice(0, 8),
    []
  );

  const dailyData = useMemo(() => getDailyBookingsData(), []);
  const weeklyData = useMemo(() => getWeeklyRevenueData(), []);
  const pieData = useMemo(() => getClassDistributionData(), []);

  return (
    <div className="p-5 lg:p-7 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5 capitalize">
          {lang === 'es'
            ? format(now, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
            : format(now, 'EEEE, MMMM d, yyyy', { locale: enUS })}
        </p>
      </div>

      {/* 6 Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <MetricCard
          icon={<Users className="w-4 h-4" />}
          label={tr(lang, 'Reservas hoy', 'Bookings today')}
          value={metrics.reservasHoy}
          delta={metrics.reservasHoy - metrics.reservasAyer}
          deltaLabel={tr(lang, 'vs ayer', 'vs yesterday')}
          color={SAGE}
        />
        <MetricCard
          icon={<CalendarDays className="w-4 h-4" />}
          label={tr(lang, 'Esta semana', 'This week')}
          value={metrics.reservasEstaSemana}
          delta={metrics.reservasEstaSemana - metrics.reservasSemanaAnterior}
          deltaLabel={tr(lang, 'vs sem. ant.', 'vs last week')}
          color={SAGE}
        />
        <MetricCard
          icon={<DollarSign className="w-4 h-4" />}
          label={tr(lang, 'Ingresos del mes', 'Monthly revenue')}
          value={`$${metrics.ingresosDelMes}`}
          color={TERRA}
        />
        <MetricCard
          icon={<Clock className="w-4 h-4" />}
          label={tr(lang, 'Clases (7 días)', 'Classes (7 days)')}
          value={metrics.clasesPrximos7}
          color={SAGE}
        />
        <MetricCard
          icon={<TrendingUp className="w-4 h-4" />}
          label={tr(lang, 'Ocupación prom.', 'Avg. occupancy')}
          value={`${metrics.tasaOcupacion}%`}
          color={TERRA}
        />
        <MetricCard
          icon={<UserCheck className="w-4 h-4" />}
          label={tr(lang, 'Alumnos únicos', 'Unique students')}
          value={metrics.alumnosUnicos}
          color={SAGE}
        />
      </div>

      {/* Gráficos */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Barras: reservas por día */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">{tr(lang, 'Reservas por día (últimos 30 días)', 'Bookings per day (last 30 days)')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} barSize={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} width={25} />
              <Tooltip
                contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="reservas" fill={SAGE} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut: distribución por clase */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">{tr(lang, 'Clases más populares', 'Most popular classes')}</h2>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                dataKey="value"
                paddingAngle={2}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
                formatter={(val) => [`${val}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-3 space-y-1.5">
            {pieData.map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="flex-1 truncate">{d.name}</span>
                <span className="font-medium text-slate-800">{d.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Line chart: ingresos por semana */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">{tr(lang, 'Ingresos por semana (últimas 8 semanas)', 'Revenue per week (last 8 weeks)')}</h2>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="semana" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} width={40} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
              formatter={(val) => [`$${val}`, tr(lang, 'Ingresos', 'Revenue')]}
            />
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke={TERRA}
              strokeWidth={2}
              dot={{ r: 3, fill: TERRA }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla próximas clases */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">{tr(lang, 'Próximas clases', 'Upcoming classes')}</h2>
          <Link href="/admin/calendario" className="text-xs hover:underline underline-offset-4" style={{ color: SAGE }}>
            {tr(lang, 'Ver calendario →', 'View calendar →')}
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{tr(lang, 'Hora', 'Time')}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{tr(lang, 'Clase', 'Class')}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">{tr(lang, 'Instructor', 'Instructor')}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:table-cell">{tr(lang, 'Reservas', 'Bookings')}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">{tr(lang, 'Estado', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {proximasClases.map((clase) => {
                const reservas = MOCK_BOOKINGS.filter((b) => b.classId === clase.id).length;
                const llena = clase.spotsRemaining === 0;
                return (
                  <tr key={clase.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700 text-xs capitalize">
                        {format(clase.startsAt, lang === 'es' ? "EEE d MMM" : "EEE MMM d", { locale: dateFnsLocale })}
                      </p>
                      <p className="text-slate-400 text-xs">{format(clase.startsAt, "HH:mm")}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: clase.color }} />
                        <span className="font-medium text-slate-800">{clase.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{clase.instructor}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-sm font-medium ${llena ? 'text-red-500' : 'text-slate-700'}`}>
                        {clase.capacity - clase.spotsRemaining}/{clase.capacity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          llena
                            ? 'bg-red-50 text-red-600 border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {llena ? tr(lang, 'Llena', 'Full') : tr(lang, 'Disponible', 'Available')}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon, label, value, delta, deltaLabel, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="w-7 h-7 rounded-md flex items-center justify-center mb-2 text-white" style={{ background: color }}>
        {icon}
      </div>
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      {delta !== undefined && deltaLabel && (
        <p className={`text-xs mt-1 font-medium ${delta >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {delta >= 0 ? '+' : ''}{delta} {deltaLabel}
        </p>
      )}
    </div>
  );
}
