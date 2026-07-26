import type { Metadata } from 'next';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { ShaktiHero } from '@/components/shakti-experience/ShaktiHero';
import { ShaktiIntro } from '@/components/shakti-experience/ShaktiIntro';
import { ShaktiForYou } from '@/components/shakti-experience/ShaktiForYou';
import { ShaktiIncluded } from '@/components/shakti-experience/ShaktiIncluded';
import { ShaktiActivities } from '@/components/shakti-experience/ShaktiActivities';
import { ShaktiPlace } from '@/components/shakti-experience/ShaktiPlace';
import { ShaktiPricing } from '@/components/shakti-experience/ShaktiPricing';
import { ShaktiClosingCTA } from '@/components/shakti-experience/ShaktiClosingCTA';

export const metadata: Metadata = {
  title: 'Shakti Experience — House of Shakti',
  description:
    'A four-day immersion in Santa Teresa, Costa Rica — a return to the body through yoga, rest, nature, and deep reconnection.',
};

export default function ShaktiExperiencePage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <ShaktiHero />
      <ShaktiIntro />
      <ShaktiForYou />
      <ShaktiIncluded />
      <ShaktiActivities />
      <ShaktiPlace />
      <ShaktiPricing />
      <ShaktiClosingCTA />
      <Footer />
    </main>
  );
}
