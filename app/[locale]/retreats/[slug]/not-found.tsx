'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';

// Minimal editorial 404 for an unknown retreat slug.
//
// A client component, like the site-wide not-found: rendered on the server,
// the locale-aware `Link` would read the request to learn its language, and
// that one read is enough to make Next render the whole /retreats/[slug]
// route on demand instead of at build time. On the client it takes the
// locale from the provider and the route prerenders as before.
export default function RetreatNotFound() {
  const t = useTranslations('common.notFound.retreat');
  return (
    <main id="main-content" className="bg-warm-white min-h-screen flex flex-col">
      <Navigation />

      <section className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="text-center max-w-xl">
          <h1 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
            {t('title')}
          </h1>
          <p className="font-body text-sm text-ink leading-relaxed mt-8">
            {t('body')}
          </p>
          <Link
            href="/retreats"
            className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer mt-10"
          >
            {t('back')}
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
