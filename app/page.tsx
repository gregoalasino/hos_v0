import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
// Introduction ("We are not in the business of more.") removed from home — file preserved
// import { Introduction } from "@/components/landing/introduction";
import { Pillars } from "@/components/landing/pillars";
import { ReturnToYourself } from "@/components/landing/return-to-yourself";
import { SeasonalExperiences } from "@/components/landing/seasonal-experiences";
import { Gallery } from "@/components/landing/gallery";
// TODO: Testimonials section removed from home — file preserved
// import { Testimonials } from "@/components/landing/testimonials";
import { HostYourRetreat } from "@/components/landing/HostYourRetreat";
import { QuoteBreak } from "@/components/landing/QuoteBreak";
import { Ornament } from "@/components/landing/ornament";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navigation />
      <Hero />
      {/* Brand statement + scattered photos, right below the hero video */}
      <ReturnToYourself />
      <Pillars />
      {/* Guest testimonial — the full-height treatment built for the YTT
          landing: the photograph carries the section, the words sit centred in
          it. Scrim strength is measured against this specific image (see
          QuoteBreak); re-measure if the photograph is swapped. */}
      <QuoteBreak
        variant="testimonial"
        image="/images/home/quote/quote-img.webp"
        quote="My stay at House of Shakti can be best remembered by beautiful surroundings, the best Yoga and an impeccable accommodation. A place to slow down, breathe and fully reconnect."
        author="House of Shakti"
        role="Santa Teresa, Costa Rica"
      />
      <SeasonalExperiences />
      <HostYourRetreat />
      {/* Rhythm mark — a quiet breath between sections */}
      <div className="bg-warm-white flex justify-center">
        <Ornament src="/logos/dots-rhythm.png" className="h-3 md:h-4 opacity-40" />
      </div>
      <Gallery />
      {/* <Testimonials /> — removed from render, kept in repo */}
      <Footer />
    </main>
  );
}
