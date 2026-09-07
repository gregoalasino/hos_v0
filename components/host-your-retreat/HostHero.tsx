'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// ─── Hero ────────────────────────────────────────────────────────────────────
// The home's framing — full-bleed edge to edge on every device, the copy
// ranged along the bottom-left — but a still photograph rather than a clip,
// and no availability bar: nothing on this page is booked, it is asked for.
//
// Two cuts of the same coastline, chosen by orientation for the same reason
// HeroVideo chooses its clip that way: the hero box is the viewport minus the
// navbar, tall on a phone and on an upright tablet, wide everywhere else. A
// width gate would hand a portrait iPad the 3:2 frame and crop two thirds of
// it away.
const IMAGE_LANDSCAPE = '/images/host-your-retreat/hero-desktop.webp';
const IMAGE_PORTRAIT = '/images/host-your-retreat/hero-mobile.webp';

// Costa Rica, as a silhouette — the eyebrow's mark. White on transparent,
// so it sits on the scrim as the type does, with nothing to tint.
const MAP = '/images/host-your-retreat/mapa-costa-rica-hero.webp';

// Neutral, bottom-weighted scrim, the one every text-bearing hero on the site
// carries: black rather than the brand burgundy, because a warm tint over a
// beach muddies it while neutral black only lowers the luminance beneath the
// type. Both cuts run to sand and breaking foam along their bottom edge —
// the brightest part of either frame is exactly where the copy sits — so
// the plateau across the copy is what earns the contrast, and the fast
// fall-off above it leaves the jungle and the sea untouched.
const SCRIM =
  'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.66) 22%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.42) 56%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.08) 84%, rgba(0,0,0,0) 96%)';

const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_20px_rgba(0,0,0,0.35)]';

export function HostHero() {
  const t = useTranslations('hostYourRetreat.hero');
  return (
    <section className="bg-warm-white">
      {/* Hero + navbar together fill 100vh on any device. Navbar is h-16
          (mobile) / h-20 (md+), so the hero takes the remainder; `mt-*`
          clears the fixed bar. */}
      <div className="w-full mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-black
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          <picture>
            <source media="(orientation: portrait)" srcSet={IMAGE_PORTRAIT} />
            <img
              src={IMAGE_LANDSCAPE}
              alt=""
              aria-hidden
              draggable={false}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
          </picture>

          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: SCRIM }} />

          <div className="absolute inset-0 flex items-end">
            <div className={`w-[85%] md:w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20 ${TEXT_SHADOW}`}>
              {/* Eyebrow — where, with the country drawn beside it. The map is
                  the one mark on the page that is not type, and it is sized to
                  read as a drawing rather than as an icon: three times the
                  eyebrow's cap height, the words centred against it. */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.05 }}
                className="flex items-center gap-4 md:gap-5 mb-6 md:mb-7"
              >
                <img
                  src={MAP}
                  alt=""
                  aria-hidden
                  draggable={false}
                  className="h-[60px] md:h-[72px] w-auto select-none"
                  decoding="async"
                />
                <span className="font-body text-[11px] md:text-xs tracking-[0.26em] uppercase text-cream">
                  {t('location')}
                </span>
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.12 }}
                className="font-display font-light text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.01em] max-w-3xl"
              >
                {t('headline')}
              </motion.h1>

              {/* The second beat of the same phrase, not a competing line:
                  same display face, a step down in size and weight of colour,
                  so the couplet reads as one breath — the treatment the
                  Stay With Us intro gives its own pair. */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.24 }}
                className="font-display font-light text-cream/80 text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-[-0.01em] mt-4 md:mt-5"
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
