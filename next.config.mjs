/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      // "Accommodations" became "Stay With Us" before launch, so there is no
      // search equity behind the old path — but preview links have already been
      // shared, and the owners have sent the old URL by hand. A permanent
      // redirect costs nothing and saves every one of those.
      { source: '/accommodations', destination: '/stay-with-us', permanent: true },
    ]
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
