import type { Metadata } from 'next';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { YTTHero } from '@/components/yoga-teacher-training/YTTHero';
import { YTTIntro } from '@/components/yoga-teacher-training/YTTIntro';
import { YTTDifferent } from '@/components/yoga-teacher-training/YTTDifferent';
import { YTTPathway } from '@/components/yoga-teacher-training/YTTPathway';
import { YTTCurriculum } from '@/components/yoga-teacher-training/YTTCurriculum';
import { YTTIncluded } from '@/components/yoga-teacher-training/YTTIncluded';
import { YTTRhythm } from '@/components/yoga-teacher-training/YTTRhythm';
import { YTTTeachers } from '@/components/yoga-teacher-training/YTTTeachers';
import { YTTSanctuary } from '@/components/yoga-teacher-training/YTTSanctuary';
import { YTTWhoFor } from '@/components/yoga-teacher-training/YTTWhoFor';
import { YTTPricing } from '@/components/yoga-teacher-training/YTTPricing';
import { YTTOutcomes } from '@/components/yoga-teacher-training/YTTOutcomes';
import { YTTFaq } from '@/components/yoga-teacher-training/YTTFaq';
import { YTTClosingCTA } from '@/components/yoga-teacher-training/YTTClosingCTA';
import { QuoteBreak } from '@/components/landing/QuoteBreak';

export const metadata: Metadata = {
  title: 'The Awakened Body — Yoga Teacher Training · House of Shakti',
  description:
    'A Tantric Yoga Intensive in Costa Rica — a 100-hour immersion with an optional 100-hour online program, leading to a Yoga Alliance Registered 200-Hour Yoga Teacher Training (RYT 200).',
};

export default function YogaTeacherTrainingPage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <YTTHero />
      <YTTIntro />
      <YTTDifferent />
      {/* "Choose your pathway" editions grid removed for now (client request). */}
      <YTTPathway />
      <YTTCurriculum />
      <YTTIncluded />
      <YTTRhythm />
      <QuoteBreak
        image="/images/yoga/IMG_8669%201.webp"
        quote="Nancy is exceptional and by far one of the best yoga teacher we have gotten to experience globally. Whether it is her practice, her approach, the flow and diversity of the classes, or with how much details she was able to guide us in our practice, it was a truly profound experience to meet her and join her over her classes."
        author="Sacha Revillard"
      />
      <YTTTeachers />
      <YTTSanctuary />
      {/* Wide, low transition band with a guest testimonial (re:center-style strip) */}
      <QuoteBreak
        size="short"
        image="/images/sanctuary/271A0714_websize%201.webp"
        quote="My stay at House of Shakti can be best remembered by beautiful surroundings, the best Yoga and an impeccable accommodation. A place to slow down, breathe and fully reconnect."
        author="House of Shakti"
        role="Santa Teresa, Costa Rica"
      />
      <YTTWhoFor />
      <YTTPricing />
      <YTTOutcomes />
      {/* Full-bleed transition band sits between the outcomes and the FAQ. */}
      <YTTClosingCTA />
      <YTTFaq />
      <Footer />
    </main>
  );
}
