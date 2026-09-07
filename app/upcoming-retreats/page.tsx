import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { UpcomingHero } from '@/components/upcoming-retreats/UpcomingHero';
import { UpcomingGrid } from '@/components/upcoming-retreats/UpcomingGrid';

export const metadata: Metadata = buildMetadata({
  path: '/upcoming-retreats',
  title: 'Upcoming Retreats',
  description:
    'Retreats and trainings hosted at House of Shakti in Santa Teresa, Costa Rica, led by facilitators from around the world.',
});

export default function UpcomingRetreatsPage() {
  return (
    <main id="main-content" className="bg-warm-white overflow-hidden">
      <Navigation />
      <UpcomingHero />
      <UpcomingGrid />
      <Footer />
    </main>
  );
}
