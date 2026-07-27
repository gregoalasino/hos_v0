import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/contexts/language-context'
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
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <Script
          src="https://static1.cloudbeds.com/booking-engine/latest/static/js/immersive-experience/cb-immersive-experience.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
