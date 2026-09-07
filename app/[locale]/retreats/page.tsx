import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { PageMessages } from '@/i18n/PageMessages';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { RetreatsHero } from '@/components/retreats/RetreatsHero';
import { RetreatsIntroduction } from '@/components/retreats/RetreatsIntroduction';
import { HOSRetreats } from '@/components/retreats/HOSRetreats';
import { RetreatsGallery } from '@/components/retreats/RetreatsGallery';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'retreats.meta' });
  return buildMetadata({
    path: '/retreats',
    title: t('title'),
    description: t('description'),
    // Already names the business — the root template would repeat it.
    absoluteTitle: true,
    locale,
  });
}

// NOTE: `./data.ts` is no longer imported here. It remains in the repo
// because individual retreat landing pages (Phase 5.2) may want to reuse
// the structured data. Safe to remove once Phase 5.2 lands its own data.

export default async function RetreatsPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);
  const t = await getTranslations('retreats');

  return (
    <PageMessages namespaces={['retreats']}>
    <main id="main-content" className="bg-warm-white overflow-hidden">
      {/* Both retreat routes open on a hero that is video and nothing else, so
          neither declared a subject to a crawler. The visible headings below
          are the brand's own statements — "Where Transformation Meets
          Paradise" — which read beautifully but do not say what the page is.
          Rather than rewrite editorial copy to please a robot, the subject is
          stated once, accurately, for anything that reads structure: screen
          readers and search engines alike. Nothing moves on screen. */}
      <h1 className="sr-only">{t('heading')}</h1>
      <Navigation />
      <RetreatsHero />
      <RetreatsIntroduction />
      <HOSRetreats />
      <RetreatsGallery />
      <Footer />
    </main>
    </PageMessages>
  );
}
