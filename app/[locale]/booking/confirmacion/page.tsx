import { Check } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export default async function ConfirmacionPage({
  params,
}: LocaleParams & {
  searchParams: Promise<{ ref?: string }>;
}) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);
  const t = await getTranslations('booking.done');

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="font-display text-3xl font-light text-dark mb-3">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('body')}
        </p>

        <div className="bg-cream rounded-2xl p-6 mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
            {t('seeYou')}
          </p>
          <p className="font-display text-xl text-dark">
            {t('brand')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full h-12">
              {t('home')}
            </Button>
          </Link>
          <Link href="/yoga" className="flex-1">
            <Button className="w-full bg-dark hover:bg-burgundy text-cream h-12">
              {t('more')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
