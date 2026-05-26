'use client';

// Gallery hero — identical pattern to the home hero. Pure video, no text.
// Santi will swap the video IDs for a gallery-specific cut when ready.
//
// IMPORTANT: `loop=1` only works on YouTube embeds when `playlist=<same_id>` is set.
const VIDEO_ID_DESKTOP = '90FhvO1AvT8'; // TODO: replace with gallery-specific video
const VIDEO_ID_MOBILE = '90FhvO1AvT8';  // TODO: replace with portrait / 9:16 cut

const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}` +
  `?autoplay=1` +
  `&mute=1` +
  `&loop=1` +
  `&playlist=${id}` +
  `&controls=0` +
  `&showinfo=0` +
  `&modestbranding=1` +
  `&rel=0` +
  `&playsinline=1` +
  `&disablekb=1` +
  `&iv_load_policy=3` +
  `&fs=0`;

export function GalleryHero() {
  return (
    <section className="bg-warm-white">
      {/*
        Hero + navbar together fill 100vh on any device.
        Navbar is h-16 (mobile) / h-20 (md+), so hero takes the remainder.
        Mobile: edge-to-edge. Desktop: 80% container — same as home hero.
      */}
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          {/* Desktop / landscape — 16:9 source */}
          <div className="absolute inset-0 hidden md:block">
            <iframe
              src={youtubeEmbedUrl(VIDEO_ID_DESKTOP)}
              title="House of Shakti — gallery"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              tabIndex={-1}
              className="
                absolute top-1/2 left-1/2
                -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                w-[max(100%,177.78vh)]
                h-[max(100%,56.25vw)]
                aspect-video
                border-0
              "
            />
          </div>

          {/* Mobile / portrait — placeholder uses same ID; swap when 9:16 asset exists */}
          <div className="absolute inset-0 md:hidden">
            <iframe
              src={youtubeEmbedUrl(VIDEO_ID_MOBILE)}
              title="House of Shakti — gallery"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              tabIndex={-1}
              className="
                absolute top-1/2 left-1/2
                -translate-x-1/2 -translate-y-1/2
                pointer-events-none
                w-[max(100%,177.78vh)]
                h-[max(100%,56.25vw)]
                aspect-video
                border-0
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
