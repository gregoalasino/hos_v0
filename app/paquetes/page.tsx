import { getSellablePacks } from '@/lib/queries/packs';
import PaquetesClient from './PaquetesClient';

export const metadata = {
  title: 'Class Packs | House of Shakti',
  description: 'Buy a pack of yoga classes and book whenever you like.',
};

export default async function PaquetesPage() {
  const packs = await getSellablePacks();
  return <PaquetesClient packs={packs} />;
}
