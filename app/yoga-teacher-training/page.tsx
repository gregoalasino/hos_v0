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
import { EditionsGrid, type Edition } from '@/components/shared/EditionsGrid';
import { QuoteBreak } from '@/components/landing/QuoteBreak';

// Upcoming cohorts of the training — RecenterLife card format.
// TODO: confirm dates, hosts and photos with Nancy.
const YTT_EDITIONS: Edition[] = [
  {
    badge: 'In Person · 100h',
    badgeColor: 'burgundy',
    host: 'Guided by Nancy Goodfellow',
    title: 'The Awakened Body — Intensive',
    dates: 'Nov 21 – Dec 4, 2026',
    description:
      'A Tantric Yoga intensive in Santa Teresa: 100 hours on the mat, in ceremony, and in community, deep in the jungle.',
    image: '/images/yoga/NE8A7702%201.webp',
    href: '/contact',
  },
  {
    badge: 'Online · 100h',
    badgeColor: 'ink',
    host: 'Self-paced with live calls',
    title: 'Foundations & Philosophy',
    dates: 'Rolling enrollment',
    description:
      'The complementary 100-hour online program — anatomy, philosophy, and methodology you can begin before or after the intensive.',
    image: '/images/yoga/IMG_7494%201.webp',
    href: '/contact',
  },
  {
    badge: 'RYT 200',
    badgeColor: 'green',
    host: 'Yoga Alliance Registered',
    title: 'Full Certification Path',
    dates: 'Complete both · 200h',
    description:
      'Combine the in-person intensive and the online program to earn your Yoga Alliance Registered 200-Hour certification.',
    image: '/images/yoga/IMG_8693%201.webp',
    href: '/contact',
  },
];

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
      <EditionsGrid
        eyebrow="Upcoming"
        heading="Choose your pathway"
        intro="A 100-hour in-person intensive and an optional 100-hour online program — together, a Yoga Alliance Registered 200-hour certification."
        editions={YTT_EDITIONS}
        className="bg-cream"
      />
      <YTTPathway />
      <YTTCurriculum />
      <YTTIncluded />
      <YTTRhythm />
      <QuoteBreak
        image="/images/yoga/IMG_8669%201.webp"
        quote="Teach from the body you have come home to."
        author="House of Shakti"
        role="The Awakened Body"
      />
      <YTTTeachers />
      <YTTPricing />
      <YTTFaq />
      <YTTClosingCTA />
      <Footer />
    </main>
  );
}
