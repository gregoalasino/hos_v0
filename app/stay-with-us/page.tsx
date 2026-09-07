import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import StayWithUsClient from './StayWithUsClient';

// Server shell for metadata only — see app/contact/page.tsx for the same
// pattern and the same reason. The client component below is unchanged.
export const metadata: Metadata = buildMetadata({
  path: '/stay-with-us',
  title: 'Where to Stay in Santa Teresa — Jungle Accommodation',
  description:
    'Four places to stay at House of Shakti in Santa Teresa: Main House suites, La Casita, the Jungle Bungalow and Shakti House, five minutes from the beach.',
});

export default function StayWithUsPage() {
  return <StayWithUsClient />;
}
