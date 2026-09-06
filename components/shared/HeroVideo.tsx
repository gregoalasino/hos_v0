'use client';

import { useEffect, useRef, useState } from 'react';
import { useMediaQuery, usePrefersReducedMotion } from '@/hooks/use-media-query';
import { usePageVisible } from '@/hooks/use-page-visible';

// ─── Hero video ──────────────────────────────────────────────────────────────
// One background clip for every page hero, replacing six copies of a YouTube
// embed that each mounted BOTH orientations and hid one with CSS — so a phone
// downloaded a desktop embed it never showed, and every hero paid for YouTube's
// player script before a single frame arrived.
//
// The hero box is the viewport minus the navbar: wide on a desktop, tall on a
// phone, and tall again on a tablet held upright. The cut is therefore chosen
// by orientation rather than by width. A width gate at 768px would hand a
// portrait iPad the 16:9 footage and crop two thirds of it away; by
// orientation it gets the 9:16 cut, whose shape is the box's shape.
//
// What loads, and when:
//   1. The poster, immediately, as the LCP element. A JPEG of the clip's own
//      opening frame, so when the video starts there is no cut — the picture
//      simply begins to move.
//   2. Exactly one cut, once the orientation is known on the client. Never
//      both. Every file has its index (`moov`) ahead of its data, so playback
//      begins on the first few hundred kilobytes rather than after the whole
//      download.
//   3. Nothing at all under `prefers-reduced-motion` or a Save-Data request:
//      those visitors keep the poster and are never charged for the clip.
//
// Playback pauses when the tab is hidden. A clip decoding for nobody costs
// the same battery as one being watched.

type Cut = {
  src: string;
  poster: string;
};

export type HeroCutName = 'home' | 'accomodation' | 'yoga' | 'retreats' | 'shakti-experience';

// Both cuts of one page's clip, by the name they were exported under. The
// poster sits beside its video with a `-poster.jpg` suffix, so adding a page
// is a matter of dropping two files in and naming them.
//
// `start` is a media fragment (`#t=`), used where a clip opens on a fade from
// black: the poster is the first fully lit frame and playback begins on that
// same frame, so the first impression never dips to black. The loop still
// wraps through the fade, which is the seam the footage was cut to have.
export function heroCuts(
  name: HeroCutName,
  start?: { landscape?: number; portrait?: number },
): { landscape: Cut; portrait: Cut } {
  const at = (s?: number) => (s ? `#t=${s}` : '');
  return {
    landscape: {
      src: `/videos/hero/horizontal/${name}.mp4${at(start?.landscape)}`,
      poster: `/videos/hero/horizontal/${name}-poster.jpg`,
    },
    portrait: {
      src: `/videos/hero/vertical/${name}.mp4${at(start?.portrait)}`,
      poster: `/videos/hero/vertical/${name}-poster.jpg`,
    },
  };
}

export function HeroVideo({
  landscape,
  portrait,
}: {
  /** 16:9 cut, for boxes wider than they are tall. */
  landscape: Cut;
  /** 9:16 cut, for phones and upright tablets. */
  portrait: Cut;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);

  // `null` on the server and on the first client render, which is what keeps
  // the markup identical on both sides: the video mounts only after hydration,
  // when the orientation can actually be read.
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const reducedMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisible();

  // Network Information is Chromium-only, so this is a courtesy where it
  // exists rather than a guarantee. Where it does, a visitor who has asked
  // their browser to save data, or is on a 2G-class link, gets the poster and
  // nothing more.
  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (connection?.saveData || /2g/.test(connection?.effectiveType ?? '')) {
      setDataSaver(true);
    }
  }, []);

  const cut = isLandscape ? landscape : portrait;
  const playVideo = isLandscape !== null && reducedMotion === false && !dataSaver;

  // The element is server-rendered nowhere (see `playVideo`), but it can still
  // reach a playable state before this effect runs — React commits, the
  // browser fetches, and `canplay` fires between one render and the next.
  // Media events do not queue, so the state is seeded from readyState as well
  // as from the handler.
  useEffect(() => {
    const el = videoRef.current;
    if (el && el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) setReady(true);
  }, [playVideo, cut.src, pageVisible]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (pageVisible) {
      // Asserted, not assumed: a clip that reaches play() unmuted is refused
      // by the autoplay policy outright.
      el.muted = true;
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [pageVisible, playVideo, cut.src]);

  return (
    <>
      {/* Poster layer — always present, so there is never an empty frame, and
          the only thing a reduced-motion or data-saver visitor ever fetches.
          The same orientation query as the video, so the two always agree. */}
      <picture>
        <source media="(orientation: portrait)" srcSet={portrait.poster} />
        <img
          src={landscape.poster}
          alt=""
          aria-hidden
          draggable={false}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
      </picture>

      {/* Video layer — fades in over the poster once it can play, so the swap
          is a settle rather than a cut. Keyed on the source: rotating a tablet
          swaps the cut, and a video element does not take kindly to having its
          src changed mid-stream. */}
      {playVideo && (
        <video
          key={cut.src}
          ref={videoRef}
          src={cut.src}
          poster={cut.poster}
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
          // Three ways in rather than one: which of these fires first, and
          // whether it fires at all before hydration commits, varies by
          // browser and by how much of the file arrived in the meantime.
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          onPlaying={() => setReady(true)}
          className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-1000 ease-out ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </>
  );
}
