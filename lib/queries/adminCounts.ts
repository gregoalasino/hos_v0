import { createServiceClient } from '@/lib/supabase/server';

// Counts of items awaiting the admin's action, surfaced as badges in the
// sidebar. Keyed by the nav href so the Sidebar can map them directly.
export type AdminPendingCounts = {
  '/admin/reservas': number; // bookings pending payment/confirmation
  '/admin/paquetes': number; // pack purchases pending payment
};

export async function getAdminPendingCounts(): Promise<AdminPendingCounts> {
  const empty: AdminPendingCounts = {
    '/admin/reservas': 0,
    '/admin/paquetes': 0,
  };
  try {
    const supabase = await createServiceClient();
    const [bookings, packs] = await Promise.all([
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('payment_status', 'pending'),
      supabase
        .from('pack_purchases')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
    ]);
    return {
      '/admin/reservas': bookings.count ?? 0,
      '/admin/paquetes': packs.count ?? 0,
    };
  } catch (err) {
    console.error('[getAdminPendingCounts]', err);
    return empty;
  }
}
