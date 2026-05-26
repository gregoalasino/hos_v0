import { notFound } from 'next/navigation';
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

export default async function RetreatLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const retreat = getRetreatBySlug(slug);
  if (!retreat) notFound();

  return (
    <main className="bg-warm-white overflow-hidden">
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
