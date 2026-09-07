import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import StayWithUsClient from './StayWithUsClient';

// Server shell for metadata only — see app/contact/page.tsx for the same
// pattern and the same reason. The client component below is unchanged.
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return buildMetadata({
    path: '/stay-with-us',
    title: 'Where to Stay in Santa Teresa — Jungle Accommodation',
    description:
      'Four places to stay at House of Shakti in Santa Teresa: Main House suites, La Casita, the Jungle Bungalow and Shakti House, five minutes from the beach.',
    locale,
  });
}

export default async function StayWithUsPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  return <StayWithUsClient />;
}
