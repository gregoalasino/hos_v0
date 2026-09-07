import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { getSellablePacks } from '@/lib/queries/packs';
import PaquetesClient from './PaquetesClient';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  return buildMetadata({
    path: '/paquetes',
    title: 'Class Packs',
    description:
      'Buy a pack of yoga classes at House of Shakti in Santa Teresa, Costa Rica, and book whenever you like.',
    locale,
  });
}

export default async function PaquetesPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  const packs = await getSellablePacks();
  return <PaquetesClient packs={packs} />;
}
