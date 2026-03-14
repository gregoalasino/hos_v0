import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { Introduction } from "@/components/landing/introduction";
import { Pillars } from "@/components/landing/pillars";
import { Gallery } from "@/components/landing/gallery";
import { Testimonials } from "@/components/landing/testimonials";
import { Footer } from "@/components/landing/footer";
import { HostYourRetreat } from "@/components/landing/HostYourRetreat";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navigation />
      <Hero />
      <Introduction />
      <Pillars />
      <HostYourRetreat />
      <Gallery />
      <Testimonials />
      <Footer />
    </main>
  );
}
