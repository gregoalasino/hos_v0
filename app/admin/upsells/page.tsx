import { getAllUpsells } from '@/lib/queries/upsells';
import UpsellsClient from './_components/UpsellsClient';

export default async function AdminUpsellsPage() {
  const upsells = await getAllUpsells();
  return <UpsellsClient initialUpsells={upsells} />;
}
