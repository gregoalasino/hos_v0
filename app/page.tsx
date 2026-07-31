import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { Introduction } from "@/components/landing/introduction";
import { Pillars } from "@/components/landing/pillars";
import { ShaktiExperienceTeaser } from "@/components/landing/shakti-experience-teaser";
import { YogaTeacherTrainingTeaser } from "@/components/landing/yoga-teacher-training-teaser";
import { SeasonalExperiences } from "@/components/landing/seasonal-experiences";
import { Gallery } from "@/components/landing/gallery";
// TODO: Testimonials section removed from home — file preserved
// import { Testimonials } from "@/components/landing/testimonials";
import { HostYourRetreat } from "@/components/landing/HostYourRetreat";
import { Ornament } from "@/components/landing/ornament";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navigation />
      <Hero />
      <Introduction />
      <SeasonalExperiences />
      <Pillars />
      <ShaktiExperienceTeaser />
      <YogaTeacherTrainingTeaser />
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
