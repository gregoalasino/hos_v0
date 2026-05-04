import DashboardLayout from '@/components/admin/DashboardLayout';

export const metadata = {
  title: 'Admin — House of Shakti',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
