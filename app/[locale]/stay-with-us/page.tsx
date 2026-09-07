import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { PageMessages } from '@/i18n/PageMessages';
import StayWithUsClient from './StayWithUsClient';

// Server shell for metadata only — see app/contact/page.tsx for the same
// pattern and the same reason. The client component below is unchanged.
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'stayWithUs.meta' });
  return buildMetadata({
    path: '/stay-with-us',
    title: t('title'),
    description: t('description'),
    locale,
  });
}

export default async function StayWithUsPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  // `home` too: the page closes on the home's Featured Experiences track.
  return (
    <PageMessages namespaces={['stayWithUs', 'home']}>
      <StayWithUsClient />
    </PageMessages>
  );
}
