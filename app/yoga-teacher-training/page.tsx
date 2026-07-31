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
import { YTTPricing } from '@/components/yoga-teacher-training/YTTPricing';
import { YTTFaq } from '@/components/yoga-teacher-training/YTTFaq';
import { YTTClosingCTA } from '@/components/yoga-teacher-training/YTTClosingCTA';

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
      <YTTPathway />
      <YTTCurriculum />
      <YTTIncluded />
      <YTTRhythm />
      <YTTTeachers />
      <YTTPricing />
      <YTTFaq />
      <YTTClosingCTA />
      <Footer />
    </main>
  );
}
