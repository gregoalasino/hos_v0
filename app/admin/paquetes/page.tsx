import { getAllPackPurchases } from '@/lib/queries/packs';
import PaquetesAdminClient from './_components/PaquetesAdminClient';

export default async function AdminPaquetesPage() {
  const purchases = await getAllPackPurchases();
  return <PaquetesAdminClient purchases={purchases} />;
}
