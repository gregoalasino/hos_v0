import type { Metadata } from 'next';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { UpcomingHero } from '@/components/upcoming-retreats/UpcomingHero';
import { UpcomingGrid } from '@/components/upcoming-retreats/UpcomingGrid';

export const metadata: Metadata = {
  title: 'Upcoming Retreats · House of Shakti',
  description:
    'Retreats and trainings hosted at House of Shakti in Santa Teresa, Costa Rica — led by facilitators from around the world. Where nature, practice and connection meet.',
};

export default function UpcomingRetreatsPage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <UpcomingHero />
      <UpcomingGrid />
      <Footer />
    </main>
  );
}
