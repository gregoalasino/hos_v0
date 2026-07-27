import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { HostYourRetreat } from '@/components/landing/HostYourRetreat';
import { RetreatsHero } from '@/components/retreats/RetreatsHero';
import { RetreatsIntroduction } from '@/components/retreats/RetreatsIntroduction';
import { HOSRetreats } from '@/components/retreats/HOSRetreats';
import { OtherRetreats } from '@/components/retreats/OtherRetreats';
import { RetreatsGallery } from '@/components/retreats/RetreatsGallery';
import { RetreatsFinalCTA } from '@/components/retreats/RetreatsFinalCTA';

// NOTE: `./data.ts` is no longer imported here. It remains in the repo
// because individual retreat landing pages (Phase 5.2) may want to reuse
// the structured data. Safe to remove once Phase 5.2 lands its own data.

export default function RetreatsPage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <RetreatsHero />
      <RetreatsIntroduction />
      <HOSRetreats />
      <OtherRetreats />
      <RetreatsGallery />
      <HostYourRetreat />
      <RetreatsFinalCTA />
      <Footer />
    </main>
  );
}
