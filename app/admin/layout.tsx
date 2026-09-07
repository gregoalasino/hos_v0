import type { Metadata } from 'next';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { BackofficeDocument, BACKOFFICE_METADATA } from '@/components/backoffice/BackofficeDocument';
import { getAdminPendingCounts } from '@/lib/queries/adminCounts';

export const metadata: Metadata = {
  ...BACKOFFICE_METADATA,
  title: 'Admin — House of Shakti',
};

// Not cached: badge counts should reflect the latest pending items on each load.
export const dynamic = 'force-dynamic';

// A root layout (see BackofficeDocument): the admin lives outside the public
// site's locale segment.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pendingCounts = await getAdminPendingCounts();
  return (
    <BackofficeDocument>
      <DashboardLayout pendingCounts={pendingCounts}>{children}</DashboardLayout>
    </BackofficeDocument>
  );
}
