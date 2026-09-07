'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/use-media-query';
import { useLanguage } from '@/contexts/language-context';
import { YTT_DICTIONARIES } from '@/lib/i18n-ytt';
import { whatsappUrl } from '@/lib/whatsapp';

// Two cuts of the same sunset, framed for their own orientation: 1440×1080 for
// desktop, 810×1080 for portrait phones. Only one is ever fetched — see below.
const VIDEO_DESKTOP = '/videos/ytt-hero-desktop-c.mp4';
const VIDEO_MOBILE = '/videos/hero-mobile-c.mp4';

// First frame of each cut, so the hero is fully composed on first paint rather
// than opening on a black box while several megabytes of video arrive. These
// are the LCP element; the video fades over them once it can play.
const POSTER_DESKTOP = '/videos/ytt-hero-desktop-poster.jpg';
const POSTER_MOBILE = '/videos/hero-mobile-poster.jpg';

// Neutral, bottom-weighted scrim. Deliberately black rather than the brand
// burgundy: a warm tint over a sunset muddies it, while neutral black only
// lowers the luminance beneath the type.
//
// The stops are measured, not eyeballed. Sampling the desktop cut every two
// seconds across the band the copy occupies gives a relative luminance between
// 0.14 and 0.49 — bright frames are the norm here, not the exception. Against
// cream text, the worst of those needs roughly 0.42 of black to clear 4.5:1;
// anything lighter left the dateline at about 2.8:1, which is under the floor
// even for large type.
//
// So the gradient holds a near-plateau across the copy (0–56%) and then falls
// away fast: by 84% it is almost gone and the sky and sun — the part of the
// frame doing the emotional work — are untouched. What reads is a foreground in
// shadow at sunset, not a panel laid over a picture.
const SCRIM =
  'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.66) 22%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.42) 56%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.08) 84%, rgba(0,0,0,0) 96%)';

// Video is a moving background: a frame that reads well now can wash out a
// second later. A soft shadow on the type itself holds legibility through those
// bright frames without darkening the whole picture — it costs nothing visually
// and lets the scrim stay lighter than it would otherwise have to be.
// Inherited by every child, so it's set once on the copy wrapper.
const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_20px_rgba(0,0,0,0.35)]';

export function YTTHero() {
  const { lang } = useLanguage();
  const t = YTT_DICTIONARIES[lang];
  const [videoReady, setVideoReady] = useState(false);

  // `null` on the server and on the first client render. Holding the video back
  // until this resolves means a phone never starts fetching the 5.7 MB desktop
  // cut, and a desktop never settles for the portrait one.
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const reducedMotion = usePrefersReducedMotion();

  const playVideo = isDesktop !== null && reducedMotion === false;
  const videoSrc = isDesktop ? VIDEO_DESKTOP : VIDEO_MOBILE;

  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          {/* Poster layer — always present, so there is never an empty frame. */}
          <picture>
            <source media="(max-width: 767px)" srcSet={POSTER_MOBILE} />
            <img
              src={POSTER_DESKTOP}
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover select-none"
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          {/* Video layer — mounts only once the breakpoint is known, and only
              when the visitor hasn't asked for reduced motion. Fades in over the
              poster so the swap is a settle, not a cut. */}
          {playVideo && (
            <video
              key={videoSrc}
              src={videoSrc}
              poster={isDesktop ? POSTER_DESKTOP : POSTER_MOBILE}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              // The desktop cut still carries an audio track; `muted` keeps it
              // silent, and these keep the browser from offering playback chrome
              // for what is decoration, not content.
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden
              tabIndex={-1}
              onCanPlay={() => setVideoReady(true)}
              className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-1000 ease-out ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: SCRIM }} />

          <div className="absolute inset-0 flex items-end">
            <div className={`w-[85%] md:w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20 ${TEXT_SHADOW}`}>
              {/* Dateline — where and when, the two things a prospect checks
                  first. Set above the title as a masthead rather than buried in
                  the body copy, and split by a hairline so each fact reads on
                  its own. Stacks on narrow phones, where the rule would only
                  create a lonely orphan line. */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-0 mb-6 md:mb-7"
              >
                <span className="font-body text-[11px] md:text-xs tracking-[0.26em] uppercase text-cream">
                  {t.hero.location}
                </span>
                <span
                  aria-hidden
                  className="hidden sm:block h-3 w-px bg-cream/40 mx-4 lg:mx-5"
                />
                <span className="font-body text-[11px] md:text-xs tracking-[0.26em] uppercase text-cream">
                  {t.hero.dates}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.12 }}
                className="font-display font-light text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.0] tracking-[-0.01em] max-w-4xl"
              >
                {t.hero.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.24 }}
                className="font-body text-sm md:text-base text-cream/85 leading-[1.7] mt-6 max-w-xl"
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.36 }}
                className="mt-9 md:mt-10"
              >
                <a
                  href={whatsappUrl(t.whatsapp.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300 [text-shadow:none]"
                >
                  {t.hero.cta}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
