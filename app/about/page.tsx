import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { AboutOpening } from '@/components/about/AboutOpening';
import { AboutChapters } from '@/components/about/AboutChapters';
import { AboutSignature } from '@/components/about/AboutSignature';
import { AboutClosing } from '@/components/about/AboutClosing';

export const metadata: Metadata = buildMetadata({
  path: '/about',
  title: 'About',
  description:
    'How House of Shakti began, and the story of Nancy Goodfellow, who built it in Santa Teresa, Costa Rica.',
});

// ─── About ───────────────────────────────────────────────────────────────────
// Nancy's own words, in the third person, laid out to read as a letter: a
// dateline and a first line, two numbered chapters with a photograph and
// notes in the margin, the line each chapter arrives at written out word by
// word, and her signature at the end. No film, no galleries — the page that
// replaced them is meant to be read, and to be trusted for it.
export default function AboutPage() {
  return (
    <main id="main-content" className="bg-warm-white overflow-hidden">
      <Navigation />
      <AboutOpening />
      <AboutChapters />
      <AboutSignature />
      <AboutClosing />
      <Footer />
    </main>
  );
}
