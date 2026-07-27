'use client';

import type { Retreat } from '@/lib/retreats';

// ─── Placeholder YouTube IDs (shared across home, yoga, accommodations,
// retreats hub, retreat detail). Each retreat can override via its data
// (heroVideoIdDesktop / heroVideoIdMobile) when a retreat-specific video
// is ready. ──────────────────────────────────────────────────────────────────
const PLACEHOLDER_VIDEO_ID = '90FhvO1AvT8';

const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}` +
  `?autoplay=1&mute=1&loop=1&playlist=${id}` +
  `&controls=0&showinfo=0&modestbranding=1&rel=0` +
  `&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`;

// Hero pattern matched 1:1 to the home hero: video iframe, edge-to-edge on
// mobile, 80% container on desktop, mt-* offset so hero + navbar fill 100vh.
// Pure video — no text, no scroll indicator. Title / dates / duration appear
// further down the page in other sections.
export function RetreatHero({ retreat }: { retreat: Retreat }) {
  const desktopId = retreat.heroVideoIdDesktop ?? PLACEHOLDER_VIDEO_ID;
  const mobileId = retreat.heroVideoIdMobile ?? PLACEHOLDER_VIDEO_ID;
  const videoTitle = `${retreat.heroTitle} at House of Shakti`;

  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          {/* Desktop / landscape */}
          <div className="absolute inset-0 hidden md:block">
            <iframe
              src={youtubeEmbedUrl(desktopId)}
              title={videoTitle}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              tabIndex={-1}
              className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                w-[max(100%,177.78vh)] h-[max(100%,56.25vw)] aspect-video border-0
              "
            />
          </div>

          {/* Mobile / portrait — same placeholder until a 9:16 asset lands */}
          <div className="absolute inset-0 md:hidden">
            <iframe
              src={youtubeEmbedUrl(mobileId)}
              title={videoTitle}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              tabIndex={-1}
              className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                w-[max(100%,177.78vh)] h-[max(100%,56.25vw)] aspect-video border-0
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
