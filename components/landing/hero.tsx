"use client";

// Placeholder YouTube IDs — swap for self-hosted .mp4 when available.
// IMPORTANT: `loop=1` only works on YouTube embeds when `playlist=<same_id>` is set.
const VIDEO_ID_DESKTOP = "90FhvO1AvT8";
const VIDEO_ID_MOBILE = "90FhvO1AvT8"; // TODO: replace with a portrait/9:16 video ID

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

export function Hero() {
  return (
    <section className="bg-warm-white">
      {/*
        Hero + navbar together fill 100vh on any device.
        Navbar is h-16 (mobile) / h-20 (md+), so hero takes the remainder.
        Mobile: edge-to-edge.
        Desktop: container with side padding, matching Aman's framing.
      */}
      {/*
        Width rules: mobile = full-bleed (sección marcada como full-width),
                     desktop = 80% del viewport.
        `mt-*` desplaza el contenido por debajo del navbar fijo, para que hero + nav = 100vh.
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
              title="House of Shakti — sanctuary"
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
              title="House of Shakti — sanctuary"
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
