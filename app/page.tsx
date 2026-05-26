import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { Introduction } from "@/components/landing/introduction";
import { Pillars } from "@/components/landing/pillars";
import { SeasonalExperiences } from "@/components/landing/seasonal-experiences";
import { Gallery } from "@/components/landing/gallery";
// TODO: Testimonials section removed from home — file preserved
// import { Testimonials } from "@/components/landing/testimonials";
import { HostYourRetreat } from "@/components/landing/HostYourRetreat";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navigation />
      <Hero />
      <Introduction />
      <SeasonalExperiences />
      <Pillars />
      <HostYourRetreat />
      <Gallery />
      {/* <Testimonials /> — removed from render, kept in repo */}
      <Footer />
    </main>
  );
}
