import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getSellablePacks } from '@/lib/queries/packs';
import PaquetesClient from './PaquetesClient';

export const metadata: Metadata = buildMetadata({
  path: '/paquetes',
  title: 'Class Packs',
  description:
    'Buy a pack of yoga classes at House of Shakti in Santa Teresa, Costa Rica, and book whenever you like.',
});

export default async function PaquetesPage() {
  const packs = await getSellablePacks();
  return <PaquetesClient packs={packs} />;
}
