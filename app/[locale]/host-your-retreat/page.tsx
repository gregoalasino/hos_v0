import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { QuoteBreak } from '@/components/landing/QuoteBreak';
import { HostHero } from '@/components/host-your-retreat/HostHero';
import { HostIntro } from '@/components/host-your-retreat/HostIntro';
import { HostStays } from '@/components/host-your-retreat/HostStays';
import { HostActivities } from '@/components/host-your-retreat/HostActivities';
import { HostQuoteForm } from '@/components/host-your-retreat/HostQuoteForm';
import { HostClosing } from '@/components/host-your-retreat/HostClosing';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return buildMetadata({
    path: '/host-your-retreat',
    title: 'Host Your Retreat',
    description:
      'Host your retreat at House of Shakti, Santa Teresa. Private lodging, a yoga shala and a team that coordinates every detail in Costa Rica.',
    locale,
  });
}

// ─── Host your retreat ───────────────────────────────────────────────────────
// For teachers and hosts bringing a group. Every section is one the site
// already speaks — the home's hero and opening arrangement, Stay With Us's
// dwellings and activities, the training's testimonial and closing bands —
// with this page's own words and photographs, and one thing of its own: the
// quote form, which composes the WhatsApp message as the answers come in.
export default async function HostYourRetreatPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  return (
    <main id="main-content" className="bg-warm-white overflow-hidden">
      <Navigation />
      <HostHero />
      <HostIntro />
      <HostStays />
      {/* A host's voice — the full-height treatment built for the training
          landing: the photograph carries the section, the words sit centred
          in it. Scrim strength is measured against this photograph, per
          tile, under the quote's own box at each breakpoint: the brightest
          patch is the house's white wall, which on a phone sits squarely
          behind the middle lines. At the site's usual 0.55 that patch leaves
          the 20px quote at 4.26:1, just under the floor; 0.60 clears it on
          every cut (5.1:1 on a phone, 4.9:1 on a tablet, 5.1:1 at 1440) and
          the house is still a house. Re-measure if the photograph is swapped. */}
      <QuoteBreak
        variant="testimonial"
        image="/images/host-your-retreat/review-image.webp"
        quote="House of Shakti is a peaceful escape surrounded by nature, with a beautiful shala and a deeply grounding energy. It's the kind of place where you immediately feel a shift — a place to slow down, breathe and reconnect."
        author="Guest review"
        role="Santa Teresa, Costa Rica"
        scrim={0.6}
      />
      <HostActivities />
      <HostQuoteForm />
      <HostClosing />
      <Footer />
    </main>
  );
}
