import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { Check, X, AlertCircle } from 'lucide-react';

type Copy = { icon: 'ok' | 'declined' | 'error'; title: string; body: string };

type Translate = Awaited<ReturnType<typeof getTranslations<'packs.result'>>>;

// The receipt's words, from the catalogue, for the outcome Tilopay reported.
function copyFor(t: Translate, status: string, kind: string): Copy {
  if (status === 'ok') {
    const which = kind === 'booking' ? 'booking' : 'pack';
    return { icon: 'ok', title: t(`ok.${which}.title`), body: t(`ok.${which}.body`) };
  }
  if (status === 'declined') {
    return { icon: 'declined', title: t('declined.title'), body: t('declined.body') };
  }
  return { icon: 'error', title: t('error.title'), body: t('error.body') };
}

export default async function ResultadoPage({
  params,
  searchParams,
}: LocaleParams & {
  searchParams: Promise<{ status?: string; kind?: string }>;
}) {
  const locale = await localeFromParams(params);
  setRequestLocale(locale);
  const t = await getTranslations('packs.result');
  const { status, kind } = await searchParams;
  const c = copyFor(t, status ?? 'error', kind ?? 'pack');

  return (
    <>
      <Navigation />
      <main id="main-content" className="bg-warm-white min-h-screen">
        <section className="w-[90%] md:w-[80%] max-w-2xl mx-auto pt-36 pb-28">
          <div className="border border-ink/15 bg-white p-10 md:p-14">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                c.icon === 'ok' ? 'bg-cream' : c.icon === 'declined' ? 'bg-cream' : 'bg-cream'
              }`}
            >
              {c.icon === 'ok' && <Check width={26} height={26} strokeWidth={1.5} className="text-ink" />}
              {c.icon === 'declined' && <X width={26} height={26} strokeWidth={1.5} className="text-ink" />}
              {c.icon === 'error' && (
                <AlertCircle width={26} height={26} strokeWidth={1.5} className="text-ink" />
              )}
            </div>
            <h1 className="font-display text-3xl font-light text-ink mt-7">{c.title}</h1>
            <p className="font-body text-sm text-ink/70 mt-4 leading-relaxed">{c.body}</p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/yoga"
                className="bg-ink text-warm-white font-body text-sm tracking-[0.1em] uppercase px-6 py-3 hover:bg-dark transition-colors duration-200"
              >
                {t('bookClass')}
              </Link>
              {status !== 'ok' && (
                <Link
                  href="/paquetes"
                  className="border border-ink/25 text-ink font-body text-sm tracking-[0.1em] uppercase px-6 py-3 hover:bg-cream/60 transition-colors duration-200"
                >
                  {t('tryAgain')}
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
