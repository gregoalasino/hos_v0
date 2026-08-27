'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/use-media-query';

// The same two cuts the Yoga Teacher Training hero uses — 1440×1080 for
// desktop, 810×1080 for portrait phones — reused rather than duplicated. Only
// one is ever fetched; see the breakpoint gate below.
const VIDEO_DESKTOP = '/videos/ytt-hero-desktop-c.mp4';
const VIDEO_MOBILE = '/videos/hero-mobile-c.mp4';

// First frame of each cut, so the hero is composed on first paint rather than
// opening on a black box while several megabytes arrive. These are the LCP
// element; the video fades over them once it can play.
const POSTER_DESKTOP = '/videos/ytt-hero-desktop-poster.jpg';
const POSTER_MOBILE = '/videos/hero-mobile-poster.jpg';

// Neutral, bottom-weighted scrim, carried over from the training hero: black
// rather than the brand burgundy, because a warm tint over a sunset muddies it
// while neutral black only lowers the luminance beneath the type. It holds a
// near-plateau across the copy and then falls away fast, leaving the sky and
// sun — the part doing the emotional work — untouched.
const SCRIM =
  'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.66) 22%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.42) 56%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.08) 84%, rgba(0,0,0,0) 96%)';

// Video is a moving background: a frame that reads well now can wash out a
// second later. A soft shadow on the type holds legibility through the bright
// frames without darkening the whole picture.
const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_20px_rgba(0,0,0,0.35)]';

export function UpcomingHero() {
  const [videoReady, setVideoReady] = useState(false);

  // `null` on the server and on the first client render. Holding the video back
  // until this resolves means a phone never starts fetching the desktop cut,
  // and a desktop never settles for the portrait one.
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
                Upcoming Retreats Hosted at House of Shakti
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.24 }}
                className="font-body text-sm md:text-base text-cream/85 leading-[1.7] mt-6 max-w-xl"
              >
                Where nature, practice and connection meet.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
