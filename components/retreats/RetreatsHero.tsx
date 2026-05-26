'use client';

// ─── YouTube placeholder (same as home, yoga and accommodations heroes) ──────
// Swap VIDEO_ID_DESKTOP/MOBILE with the final retreats-specific videos when ready.
const VIDEO_ID_DESKTOP = '90FhvO1AvT8';
const VIDEO_ID_MOBILE = '90FhvO1AvT8'; // TODO: swap when retreats-specific portrait video lands

const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}` +
  `?autoplay=1&mute=1&loop=1&playlist=${id}` +
  `&controls=0&showinfo=0&modestbranding=1&rel=0` +
  `&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`;

// Hero pattern matched 1:1 to the home hero (video, edge-to-edge mobile,
// 80% container desktop, mt-* offset for the fixed navbar so the hero +
// navbar fill exactly 100vh).
export function RetreatsHero() {
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
              src={youtubeEmbedUrl(VIDEO_ID_DESKTOP)}
              title="Retreats at House of Shakti"
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
              src={youtubeEmbedUrl(VIDEO_ID_MOBILE)}
              title="Retreats at House of Shakti"
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
