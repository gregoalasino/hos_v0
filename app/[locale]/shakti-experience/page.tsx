import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
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

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return buildMetadata({
    path: '/shakti-experience',
    title: 'Shakti Experience',
    description:
      'A packaged stay at House of Shakti, Santa Teresa: yoga, breathwork, sauna and ice bath, massage and time in nature. A week, a few days, or your own.',
    locale,
  });
}

// ─── Shakti Experience ───────────────────────────────────────────────────────
// A packaged stay — or one designed around the guest — rather than a guided
// retreat. Every section is one the site already speaks: the training
// landing's hero, testimonial, audience, day, sanctuary, closing band and
// questions; the home's opening arrangement; Stay With Us's activities
// track. The pricing is the one section of its own, in the training's
// pricing language.
export default async function ShaktiExperiencePage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  return (
    <main id="main-content" className="bg-warm-white overflow-hidden">
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
