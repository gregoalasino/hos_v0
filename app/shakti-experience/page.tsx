import type { Metadata } from 'next';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { ShaktiHero } from '@/components/shakti-experience/ShaktiHero';
import { ShaktiIntro } from '@/components/shakti-experience/ShaktiIntro';
import { ShaktiMoreThanAStay } from '@/components/shakti-experience/ShaktiMoreThanAStay';
import { ShaktiReview } from '@/components/shakti-experience/ShaktiReview';
import { ShaktiForYou } from '@/components/shakti-experience/ShaktiForYou';
import { ShaktiPricing } from '@/components/shakti-experience/ShaktiPricing';
import { ShaktiDay } from '@/components/shakti-experience/ShaktiDay';
import { ShaktiPlace } from '@/components/shakti-experience/ShaktiPlace';
import { ShaktiClosingCTA } from '@/components/shakti-experience/ShaktiClosingCTA';
import { ShaktiFaq } from '@/components/shakti-experience/ShaktiFaq';

export const metadata: Metadata = {
  title: 'Shakti Experience · House of Shakti',
  description:
    'An invitation to return to the body. Yoga, breathwork, sauna and ice bath, massage and time in nature at House of Shakti in Santa Teresa, Costa Rica — a full week, a few days, or a stay designed around you.',
};

// ─── Shakti Experience ───────────────────────────────────────────────────────
// A packaged stay — or one designed around the guest — rather than a guided
// retreat. Every section is one the site already speaks: the training
// landing's hero, testimonial, audience, day, sanctuary, closing band and
// questions; the home's opening arrangement; Stay With Us's activities
// track. The pricing is the one section of its own, in the training's
// pricing language.
export default function ShaktiExperiencePage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <ShaktiHero />
      <ShaktiIntro />
      <ShaktiMoreThanAStay />
      <ShaktiReview />
      <ShaktiForYou />
      <ShaktiPricing />
      <ShaktiDay />
      <ShaktiPlace />
      {/* Full-bleed transition band sits between the house and the questions,
          as on the training landing. */}
      <ShaktiClosingCTA />
      <ShaktiFaq />
      <Footer />
    </main>
  );
}
