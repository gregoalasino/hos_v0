import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { PageMessages } from '@/i18n/PageMessages';
import { getSellablePacks } from '@/lib/queries/packs';
import PaquetesClient from './PaquetesClient';

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'packs.meta' });
  return buildMetadata({
    path: '/paquetes',
    title: t('title'),
    description: t('description'),
    locale,
  });
}

export default async function PaquetesPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  const packs = await getSellablePacks();
  return (
    <PageMessages namespaces={['packs']}>
      <PaquetesClient packs={packs} />
    </PageMessages>
  );
}
