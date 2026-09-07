import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { PageMessages } from '@/i18n/PageMessages';
import ContactPageClient from './ContactPageClient';

// The page itself is a client component — it animates on scroll and reads the
// catalogue. Metadata can only be exported from a server module, so the
// route is this thin server shell and the interface lives beside it. Nothing
// about the rendered page changes.
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const t = await getTranslations({ locale, namespace: 'contact.meta' });
  return buildMetadata({
    path: '/contact',
    title: t('title'),
    description: t('description'),
    // Already names the business — the root template would repeat it.
    absoluteTitle: true,
    locale,
  });
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);

  return (
    <PageMessages namespaces={['contact']}>
      <ContactPageClient />
    </PageMessages>
  );
}
