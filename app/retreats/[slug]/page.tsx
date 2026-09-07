import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { RetreatJsonLd } from '@/components/seo/JsonLd';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { getRetreatBySlug, listRetreatSlugs } from '@/lib/retreats';
import { RetreatHero } from '@/components/retreats/landing/RetreatHero';
import { RetreatManifesto } from '@/components/retreats/landing/RetreatManifesto';
import { RetreatForYou } from '@/components/retreats/landing/RetreatForYou';
import { RetreatJourney } from '@/components/retreats/landing/RetreatJourney';
import { RetreatSchedule } from '@/components/retreats/landing/RetreatSchedule';
import { RetreatIncludes } from '@/components/retreats/landing/RetreatIncludes';
import { RetreatHosts } from '@/components/retreats/landing/RetreatHosts';
import { RetreatSpace } from '@/components/retreats/landing/RetreatSpace';
import { RetreatGallery } from '@/components/retreats/landing/RetreatGallery';
import { RetreatTestimonials } from '@/components/retreats/landing/RetreatTestimonials';
import { RetreatInvestment } from '@/components/retreats/landing/RetreatInvestment';
import { RetreatFinalCTA } from '@/components/retreats/landing/RetreatFinalCTA';

// SSG: pre-render one page per slug in the RETREATS array.
export function generateStaticParams() {
  return listRetreatSlugs().map((slug) => ({ slug }));
}

// Each retreat carries its own title, description and social card. The hero
// image doubles as the OG image — it is the one photograph chosen to stand for
// the retreat, so it is also the one a shared link should show.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const retreat = getRetreatBySlug(slug);
  if (!retreat) return {};

  return buildMetadata({
    path: `/retreats/${retreat.slug}`,
    title: `${retreat.heroTitle} — Retreat in Santa Teresa, Costa Rica`,
    // heroSubhead is one editorial line; the dates and length are the facts a
    // searcher scans for. Together they stay well inside 160 characters.
    description: `${retreat.heroSubhead} ${retreat.heroEyebrow} · ${retreat.heroDates} at House of Shakti, Santa Teresa.`,
    image: {
      url: retreat.heroImage,
      alt: `${retreat.heroTitle} at House of Shakti, Santa Teresa, Costa Rica`,
    },
  });
}

export default async function RetreatLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const retreat = getRetreatBySlug(slug);
  if (!retreat) notFound();

  return (
    <main id="main-content" className="bg-warm-white overflow-hidden">
      <RetreatJsonLd retreat={retreat} />
      {/* Same reason as /retreats: the hero is video only and the manifesto
          heading ("Return to what is essential.") never names the retreat.
          This is the one place the page says, in text, what it is. */}
      <h1 className="sr-only">
        {retreat.heroTitle} — Yoga Retreat in {retreat.heroLocation}
      </h1>
      <Navigation />
      <RetreatHero retreat={retreat} />
      <RetreatManifesto retreat={retreat} />
      <RetreatForYou retreat={retreat} />
      <RetreatJourney retreat={retreat} />
      <RetreatSchedule retreat={retreat} />
      <RetreatIncludes retreat={retreat} />
      <RetreatHosts retreat={retreat} />
      <RetreatSpace retreat={retreat} />
      <RetreatGallery retreat={retreat} />
      <RetreatTestimonials retreat={retreat} />
      <RetreatInvestment retreat={retreat} />
      <RetreatFinalCTA retreat={retreat} />
      <Footer />
    </main>
  );
}
