import type { Metadata } from 'next';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { YTTHero } from '@/components/yoga-teacher-training/YTTHero';
import { YTTIntro } from '@/components/yoga-teacher-training/YTTIntro';
import { YTTDifferent } from '@/components/yoga-teacher-training/YTTDifferent';
import { YTTPathway } from '@/components/yoga-teacher-training/YTTPathway';
import { YTTCurriculum } from '@/components/yoga-teacher-training/YTTCurriculum';
import { YTTTestimonial } from '@/components/yoga-teacher-training/YTTTestimonial';
import { YTTIncluded } from '@/components/yoga-teacher-training/YTTIncluded';
import { YTTRhythm } from '@/components/yoga-teacher-training/YTTRhythm';
import { YTTTeachers } from '@/components/yoga-teacher-training/YTTTeachers';
import { YTTSanctuary } from '@/components/yoga-teacher-training/YTTSanctuary';
import { YTTWhoFor } from '@/components/yoga-teacher-training/YTTWhoFor';
import { YTTPricing } from '@/components/yoga-teacher-training/YTTPricing';
import { YTTOutcomes } from '@/components/yoga-teacher-training/YTTOutcomes';
import { YTTFaq } from '@/components/yoga-teacher-training/YTTFaq';
import { YTTClosingCTA } from '@/components/yoga-teacher-training/YTTClosingCTA';

export const metadata: Metadata = {
  title: 'The Awakened Body — Yoga Teacher Training · House of Shakti',
  description:
    'A Tantric Yoga Intensive in Santa Teresa, Costa Rica — a 100-hour immersion with an optional 100-hour online program, leading to a Yoga Alliance Registered 200-Hour Yoga Teacher Training (RYT 200). November 21 – December 4, 2026.',
};

// Anchor targets, kept so the links already circulating — /yoga-teacher-training
// #curriculum and the rest — still land on the right section. The offset clears
// the fixed navbar so a jumped-to heading is never tucked underneath it.
const ANCHOR = 'scroll-mt-20 lg:scroll-mt-28';

export default function YogaTeacherTrainingPage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <YTTHero />

      <div id="the-training" className={ANCHOR}>
        <YTTIntro />
      </div>

      <YTTDifferent />
      <YTTPathway />

      <div id="curriculum" className={ANCHOR}>
        <YTTCurriculum />
      </div>

      <YTTTestimonial />

      <YTTIncluded />
      <YTTRhythm />

      <div id="teachers" className={ANCHOR}>
        <YTTTeachers />
      </div>

      <YTTSanctuary />
      <YTTWhoFor />

      <div id="investment" className={ANCHOR}>
        <YTTPricing />
      </div>

      <YTTOutcomes />

      {/* Full-bleed transition band sits between the outcomes and the FAQ. */}
      <YTTClosingCTA />

      <div id="faq" className={ANCHOR}>
        <YTTFaq />
      </div>

      <Footer />
    </main>
  );
}
