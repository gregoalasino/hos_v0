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
import { EditionsGrid, type Edition } from '@/components/shared/EditionsGrid';
import { QuoteBreak } from '@/components/landing/QuoteBreak';

// Upcoming editions of the Shakti Experience — presented in the RecenterLife
// card format. TODO: confirm dates, hosts and photos with Nancy.
const SHAKTI_EDITIONS: Edition[] = [
  {
    badge: 'Signature',
    badgeColor: 'burgundy',
    host: 'Guided by Nancy Goodfellow',
    title: 'Shakti Experience',
    dates: 'Sep 18 – 22, 2026',
    description:
      'A four-day immersion in Santa Teresa — a return to the body through yoga, rest, nature, and deep reconnection.',
    image: '/images/yoga/NE8A7854%201.webp',
    href: '/contact',
  },
  {
    badge: 'Moon Cycle',
    badgeColor: 'ink',
    host: 'Guided by the House of Shakti team',
    title: 'New Moon Reset',
    dates: 'Oct 16 – 20, 2026',
    description:
      'A new-moon gathering marking the change of season — yoga, breathwork, ceremony, and shared meals from the land.',
    image: '/images/yoga/NE8A7702%201.webp',
    href: '/contact',
  },
  {
    badge: 'For Two',
    badgeColor: 'green',
    host: 'For couples & close friends',
    title: 'A Weekend of Return',
    dates: 'Nov 6 – 9, 2026',
    description:
      'A softer pace away from the noise. Private practice, slow mornings, and space held for two.',
    image: '/images/sanctuary/271A0759_websize%201.webp',
    href: '/contact',
  },
];

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
      <EditionsGrid
        eyebrow="Upcoming"
        heading="Choose your edition"
        intro="A small number of curated editions across the year — each a four-day return to yourself in Santa Teresa."
        editions={SHAKTI_EDITIONS}
        className="bg-cream"
      />
      <ShaktiIncluded />
      <ShaktiActivities />
      <QuoteBreak
        image="/images/yoga/IMG_8683%201.webp"
        quote="A return to the place that has always been yours: the body."
        author="House of Shakti"
        role="The Shakti Experience"
      />
      <ShaktiPlace />
      <ShaktiPricing />
      <ShaktiClosingCTA />
      <Footer />
    </main>
  );
}
