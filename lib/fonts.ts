import localFont from 'next/font/local';

// The two self-hosted faces, declared once. Three root layouts share them
// (the public site under app/[locale], the admin panel, the instructor
// portal), and next/font must see a single declaration per face or it emits
// the @font-face rules — and the preload — once per caller.
//
// Paths are relative to this file.

// Display face — Krylon. Applied to all headings via `font-display`.
export const krylon = localFont({
  src: '../public/fonts/krylon/Krylon-Regular.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '400',
});

// Body face — Chalet Paris Nineteen Sixty. Default for body, UI, microcopy.
export const chalet = localFont({
  src: '../public/fonts/chalet/Chalet-ParisNineteenSixty.woff2',
  variable: '--font-body',
  display: 'swap',
  weight: '400',
});

/** The `className` for `<html>`: both CSS variables, nothing else. */
export const FONT_VARIABLES = `${krylon.variable} ${chalet.variable}`;
