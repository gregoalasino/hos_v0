import createNextIntlPlugin from 'next-intl/plugin';

// Wires i18n/request.ts into the build so every server render knows its
// locale and messages. The path is explicit rather than the plugin's default
// lookup, so a move of the folder fails loudly instead of silently rendering
// without messages.
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // "Accommodations" became "Stay With Us" before launch, so there is no
      // search equity behind the old path — but preview links have already been
      // shared, and the owners have sent the old URL by hand. A permanent
      // redirect costs nothing and saves every one of those.
      { source: '/accommodations', destination: '/stay-with-us', permanent: true },
      // The gallery became the About page: the photographs are on every other
      // page already, and what the site lacked was the words. The old path
      // stays reachable for the links that went out with it.
      { source: '/gallery', destination: '/about', permanent: true },
    ]
  },
  async headers() {
    // Static media is served with `public, max-age=0, must-revalidate` by
    // default, so every repeat visit revalidates every file. Vercel's edge
    // answers quickly, but that is still one round trip per asset, and a page
    // here carries a hero clip, its poster and a few dozen photographs.
    //
    // A day of freshness, then a month of serving the cached copy while a new
    // one is fetched behind it. Deliberately not `immutable`: assets here get
    // replaced under the same filename, and a year-long pin would strand
    // returning visitors on an old cut of a video with no way to recover.
    return [
      {
        source: '/:all*(mp4|webm|jpg|jpeg|png|webp|svg|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=2592000',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
