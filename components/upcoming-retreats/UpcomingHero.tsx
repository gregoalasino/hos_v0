'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { HeroVideo, heroCuts } from '@/components/shared/HeroVideo';

// The retreats clip, shared with the hub and every retreat page: this is one of
// their subpages, and it should open on the same footage rather than borrow
// the training's sunset as it did while that was the only self-hosted cut.

// Neutral, bottom-weighted scrim, carried over from the training hero: black
// rather than the brand burgundy, because a warm tint over footage muddies it
// while neutral black only lowers the luminance beneath the type. It holds a
// near-plateau across the copy and then falls away fast, leaving the top of
// the frame — the part doing the emotional work — untouched.
const SCRIM =
  'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.66) 22%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.42) 56%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.08) 84%, rgba(0,0,0,0) 96%)';

// Video is a moving background: a frame that reads well now can wash out a
// second later. A soft shadow on the type holds legibility through the bright
// frames without darkening the whole picture.
const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_20px_rgba(0,0,0,0.35)]';

export function UpcomingHero() {
  const t = useTranslations('upcomingRetreats.hero');
  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          <HeroVideo {...heroCuts('retreats', { landscape: 0.5, portrait: 0.5 })} />

          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: SCRIM }} />

          {/* Copy — title and subtitle only. This page's job is to hand the
              reader on to four separate retreats, each with its own call to
              action further down; a fifth one up here would only compete with
              them and point nowhere in particular. */}
          <div className="absolute inset-0 flex items-end">
            <div className={`w-[85%] md:w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20 ${TEXT_SHADOW}`}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.12 }}
                className="font-display font-light text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.0] tracking-[-0.01em] max-w-4xl"
              >
                {t('headline')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.24 }}
                className="font-body text-sm md:text-base text-cream/85 leading-[1.7] mt-6 max-w-xl"
              >
                {t('subline')}
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
