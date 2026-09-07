import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { PageMessages } from '@/i18n/PageMessages';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { UpcomingHero } from '@/components/upcoming-retreats/UpcomingHero';
import { UpcomingGrid } from '@/components/upcoming-retreats/UpcomingGrid';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'upcomingRetreats.meta' });
  return buildMetadata({
    path: '/upcoming-retreats',
    title: t('title'),
    description: t('description'),
    locale,
  });
}

export default async function UpcomingRetreatsPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  return (
    <PageMessages namespaces={['upcomingRetreats']}>
      <main id="main-content" className="bg-warm-white overflow-hidden">
        <Navigation />
        <UpcomingHero />
        <UpcomingGrid />
        <Footer />
      </main>
    </PageMessages>
  );
}
