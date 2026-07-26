import { getDashboardData } from '@/lib/queries/metrics';
import { ensureUpcomingWeeks } from '@/app/actions/classes';
import DashboardClient from './_components/DashboardClient';

export default async function AdminDashboard() {
  // Keep upcoming sessions materialized so "next 7 days" / occupancy are accurate.
  await ensureUpcomingWeeks();
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
