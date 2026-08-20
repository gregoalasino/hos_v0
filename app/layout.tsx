import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
import { SplashScreen } from '@/components/landing/SplashScreen'
import { WhatsAppButton } from '@/components/landing/WhatsAppButton'
import { CLOUDBEDS_IMMERSIVE_SRC } from '@/lib/cloudbeds'
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
  title: 'House of Shakti | Luxury Wellness Sanctuary',
  description: 'A serene haven for yoga, boutique accommodation, and transformational retreats. Discover the art of mindful living at House of Shakti.',
  generator: 'v0.app',
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
