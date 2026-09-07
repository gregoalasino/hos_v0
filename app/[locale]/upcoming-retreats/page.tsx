import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { UpcomingHero } from '@/components/upcoming-retreats/UpcomingHero';
import { UpcomingGrid } from '@/components/upcoming-retreats/UpcomingGrid';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return buildMetadata({
    path: '/upcoming-retreats',
    title: 'Upcoming Retreats',
    description:
      'Retreats and trainings hosted at House of Shakti in Santa Teresa, Costa Rica, led by facilitators from around the world.',
    locale,
  });
}

export default async function UpcomingRetreatsPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  return (
    <main id="main-content" className="bg-warm-white overflow-hidden">
      <Navigation />
      <UpcomingHero />
      <UpcomingGrid />
      <Footer />
    </main>
  );
}
