import DashboardLayout from '@/components/admin/DashboardLayout';
import { getAdminPendingCounts } from '@/lib/queries/adminCounts';

export const metadata = {
  title: 'Admin — House of Shakti',
};

// Not cached: badge counts should reflect the latest pending items on each load.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pendingCounts = await getAdminPendingCounts();
  return <DashboardLayout pendingCounts={pendingCounts}>{children}</DashboardLayout>;
}
