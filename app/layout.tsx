import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
import { SplashScreen } from '@/components/landing/SplashScreen'
import { WhatsAppButton } from '@/components/landing/WhatsAppButton'
import { CLOUDBEDS_IMMERSIVE_SRC } from '@/lib/cloudbeds'
import { BUSINESS } from '@/lib/business'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'
import './globals.css'
import Script from 'next/script';

// Display face — Krylon. Applied to all headings via `font-display`.
const krylon = localFont({
  src: '../public/fonts/krylon/Krylon-Regular.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
})

// Body face — Chalet Paris Nineteen Sixty. Default for body, UI, microcopy.
const chalet = localFont({
  src: '../public/fonts/chalet/Chalet-ParisNineteenSixty.woff2',
  variable: '--font-body',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  // Every relative URL in metadata — canonicals, Open Graph images — resolves
  // against this. Without it Next emits relative OG URLs, which most scrapers
  // simply drop.
  metadataBase: new URL(BUSINESS.url),

  // `%s` is whatever a page passes as its title; the home page opts out with
  // `absolute`. Set here so no page has to repeat the brand.
  title: {
    template: '%s | House of Shakti',
    default: 'House of Shakti — Yoga Sanctuary in Santa Teresa, Costa Rica',
  },
  description: BUSINESS.description,

  // Defaults for any page that doesn't build its own through lib/seo.ts.
  openGraph: {
    type: 'website',
    siteName: BUSINESS.name,
    locale: 'en_US',
    url: BUSINESS.url,
    title: 'House of Shakti — Yoga Sanctuary in Santa Teresa, Costa Rica',
    description: BUSINESS.description,
    images: [
      {
        url: DEFAULT_OG_IMAGE.url,
        alt: DEFAULT_OG_IMAGE.alt,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Shakti — Yoga Sanctuary in Santa Teresa, Costa Rica',
    description: BUSINESS.description,
    images: [DEFAULT_OG_IMAGE.url],
  },

  // Explicit rather than implied. The `googleBot` block lifts the caps on
  // snippet length and image preview size, which is what lets a rich result
  // show a real photograph of the property instead of a thumbnail.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // Google Search Console's meta-tag verification. Rendered only when the
  // variable is set, so nothing appears in the markup until the property is
  // actually being claimed. Next drops the whole `verification` block when
  // `google` is undefined.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),

  icons: {
    // Modern browsers pick the SVG (scales perfectly at any size).
    // PNG is the fallback for older browsers and where SVG isn't supported.
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    // Apple touch icon — iOS ignores SVG, so we serve the PNG.
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${krylon.variable} ${chalet.variable}`}>
      <body className="font-body antialiased">
        {/* Pre-paint splash decision. An inline synchronous script blocks the
            parser for microseconds and runs BEFORE anything below it paints —
            the only place the sessionStorage + reduced-motion call can be made
            without flashing the SSR'd veil at returning visitors while the
            bundle hydrates. It stamps <html data-splash="play"> only when the
            splash should run; the CSS gate in globals.css keeps the overlay
            display:none otherwise, so no JS (or a failed bundle) degrades to
            no splash instead of a page covered forever. Writing the seen-key
            here — once per load, outside React — is also what lets the
            component's own effect stay a pure read, immune to StrictMode's
            double-invoke in dev. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var k='hos-splash-seen';if(sessionStorage.getItem(k)!=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.splash='play';sessionStorage.setItem(k,'1')}}catch(e){}",
          }}
        />
        {/* Skip to content — invisible until focused, which for a keyboard
            user is the first stop on every page. Without it, reaching the
            article means tabbing past the menu, the logo, the language pair
            and the booking CTA on every single navigation. `sr-only` plus
            `focus:not-sr-only` is the standard pair; the styling matches the
            site's own CTAs so it doesn't look like a browser artefact when it
            appears. Every page's <main> carries id="main-content". */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-dark focus:text-cream focus:font-body focus:text-sm focus:tracking-[0.05em] focus:px-6 focus:py-3"
        >
          Skip to content
        </a>
        <SplashScreen />
        <LanguageProvider>
          {children}
          {/* Floating WhatsApp entry point — every public page; the component
              itself stays out of /admin, /instructor, /login and /booking. */}
          <WhatsAppButton />
        </LanguageProvider>
        <Analytics />
        <Script
          src="https://static1.cloudbeds.com/booking-engine/latest/static/js/immersive-experience/cb-immersive-experience.js"
          strategy="afterInteractive"
        />
        {/* Per-property immersive loader — exposes window.openImmersiveExperiencePopup
            site-wide so the hero availability bar and every CheckAvailabilityLink
            can open the booking engine as an overlay from any page. */}
        <Script src={CLOUDBEDS_IMMERSIVE_SRC} strategy="afterInteractive" />
      </body>
    </html>
  )
}
