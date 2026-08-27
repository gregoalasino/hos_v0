'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-media-query';
import { usePageVisible } from '@/hooks/use-page-visible';

/**
 * A silent looping clip used as illustration.
 *
 * Loading is staged, because a `<video src>` costs bytes the moment it exists —
 * even `preload="metadata"` reaches for the file's header, and this page carries
 * fifteen megabytes of footage that most readers will never scroll to:
 *
 *   1. A poster frame renders immediately. It is the only thing fetched up
 *      front, at roughly 60 KB against the clip's several megabytes.
 *   2. `src` is withheld until the clip is within `APPROACH` of the viewport, so
 *      a reader who stops halfway down the page never pays for what is below.
 *   3. Playback starts only once the clip is actually on screen, and stops when
 *      it leaves or the tab goes to the background — a clip decoding out of
 *      sight costs exactly as much as one being watched.
 *
 * The clip carries no meaning of its own: muted, no controls, nothing for a
 * pointer to grab, out of the tab order and out of the accessibility tree.
 */

// Far enough ahead that the file has begun arriving by the time the clip is
// looked at, close enough that a reader who never gets there never pays.
const APPROACH = '600px';

export function LoopingClip({
  src,
  poster,
  className = '',
  posterPriority = false,
}: {
  src: string;
  poster: string;
  /** Aspect and any framing classes for the box the clip fills. */
  className?: string;
  /** Set on a clip that can be on screen at first paint. */
  posterPriority?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [approached, setApproached] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [ready, setReady] = useState(false);

  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  // Stage 2 — near the viewport: start fetching.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || approached) return;

    // Without an observer there is no way to tell when the clip is neared, and
    // staying deferred forever would mean the clip simply never appears. Give
    // up the saving rather than the content.
    if (typeof IntersectionObserver === 'undefined') {
      setApproached(true);
      setOnScreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setApproached(true);
          observer.disconnect();
        }
      },
      { rootMargin: APPROACH },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [approached]);

  // Stage 3 — on screen: play, and stop again on the way out.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (onScreen && pageVisible && reducedMotion === false) {
      // Autoplay can still be refused — a data saver, a battery-saver mode.
      // Swallow it: the poster is already showing and simply stays.
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [onScreen, pageVisible, reducedMotion, approached]);

  // Reduced motion means the clip is never asked to play, so there is no reason
  // to spend the download at all — the poster is the whole experience.
  const shouldLoad = approached && reducedMotion === false;

  return (
    <div ref={boxRef} className={`relative overflow-hidden bg-cream ${className}`}>
      <img
        src={poster}
        alt=""
        aria-hidden
        draggable={false}
        loading={posterPriority ? 'eager' : 'lazy'}
        fetchPriority={posterPriority ? 'high' : 'auto'}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover select-none"
      />

      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-opacity duration-700 ease-out ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
