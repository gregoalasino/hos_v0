// /gallery — editorial visual essay. Six themed sections framed as the
// "rhythms" of the sanctuary, bookended by a cinematic hero and a dark closing
// CTA. No filters, no lightbox, no category tabs — by design.
//
// Content lives in this file (page-level data); reusable layout primitives
// live in components/gallery/*.
import type { Metadata } from 'next';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import { GalleryHero } from '@/components/gallery/GalleryHero';
import {
  GalleryThemedSection,
  type GalleryImage,
} from '@/components/gallery/GalleryThemedSection';
import { GalleryFinalCTA } from '@/components/gallery/GalleryFinalCTA';

export const metadata: Metadata = {
  title: 'The world of House of Shakti — Gallery',
  description:
    'A slow walk through the rhythms of the sanctuary — mornings, the shala, the jungle, the shore, gatherings, and quiet hours.',
};

// ─── Section content ────────────────────────────────────────────────────────
// Each entry maps 1:1 to a <GalleryThemedSection /> render below.
// `aspect` values follow the layout-variant suggestions documented in the
// component (Variant A: 1 lead aspect-[4/5] + 4 small alternating square/4-5;
// Variant B: varied for masonry; Variant C: 2 top + 3 bottom).

// TODO: replace with morning-themed photos (solo practice, early light, kitchen).
// Variant A uses 3 images: 1 lead + 2 side stack. Aspect-[4/5] across so the
// right column's stacked height matches the lead's height naturally.
const morningsImages: GalleryImage[] = [
  { src: '/images/yoga/IMG_7491%201.webp',              aspect: 'aspect-[4/5]', alt: 'Morning practice in soft light' },
  { src: '/images/sanctuary/271A0676_websize%201.webp', aspect: 'aspect-[4/5]', alt: 'The sanctuary in early light' },
  { src: '/images/yoga/NE8A7702%201.webp',              aspect: 'aspect-[4/5]', alt: 'A figure mid-practice' },
];

// TODO: replace with shala-specific photos (interior, practice, props, details).
const shalaImages: GalleryImage[] = [
  { src: '/images/yoga/IMG_8669%201.webp',              aspect: 'aspect-[3/4]', alt: 'A wider moment of practice' },
  { src: '/images/yoga/IMG_8420%201.webp',              aspect: 'aspect-[4/3]', alt: 'Inside the open-air shala' },
  { src: '/images/yoga/IMG_7526%201.webp',              aspect: 'aspect-[4/5]', alt: 'Practice in progress' },
  { src: '/images/yoga/NE8A7854%201.webp',              aspect: 'aspect-[3/4]', alt: 'A still pose held in light' },
  { src: '/images/yoga/IMG_8664%201.webp',              aspect: 'aspect-square', alt: 'Detail of the practice' },
];

// TODO: replace with jungle / nature-specific photos.
const jungleImages: GalleryImage[] = [
  { src: '/images/sanctuary/271A0870_websize%201.webp', aspect: 'aspect-[4/5]', alt: 'Organic texture of the canopy' },
  { src: '/images/sanctuary/271A0883_websize%201.webp', aspect: 'aspect-[4/5]', alt: 'The land at golden hour' },
  { src: '/images/sanctuary/271A0704_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'A wide reading of the grounds' },
  { src: '/images/sanctuary/271A0879_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'The jungle dissolving into evening' },
  { src: '/images/sanctuary/271A0840_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'Materials from where you stand' },
];

// TODO: replace with beach / shore-specific photos — CRITICAL section.
// Nancy specifically requested beach imagery and no dedicated shore photos
// exist in the pool yet. All five images below are fallbacks: the widest,
// most horizon-leaning sanctuary frames available. Replace as a priority
// when Pacific / Playa Hermosa photography is delivered.
const shoreImages: GalleryImage[] = [
  { src: '/images/sanctuary/271A0782_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'The horizon at the edge of the property (placeholder)' },
  { src: '/images/sanctuary/271A0788_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'A wide view toward the coast (placeholder)' },
  { src: '/images/sanctuary/271A0794_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'Light moving across an open frame (placeholder)' },
  { src: '/images/sanctuary/271A0803_websize%201.webp', aspect: 'aspect-square', alt: 'A quiet open moment (placeholder)' },
  { src: '/images/sanctuary/271A0845_websize%201.webp', aspect: 'aspect-[4/3]', alt: 'Toward the Pacific (placeholder)' },
];

// TODO: replace with gathering / community-themed photos (meals, fire, groups).
// Variant A uses 3 images: 1 lead + 2 side stack (see morningsImages comment).
const gatheringsImages: GalleryImage[] = [
  { src: '/images/yoga/IMG_8683%201.webp',              aspect: 'aspect-[4/5]', alt: 'A shared moment of practice' },
  { src: '/images/sanctuary/271A0759_websize%201.webp', aspect: 'aspect-[4/5]', alt: 'A communal corner of the sanctuary' },
  { src: '/images/yoga/IMG_7539%201.webp',              aspect: 'aspect-[4/5]', alt: 'Held together in stillness' },
];

// TODO: replace with quiet / restful-themed photos (decks, pool, hammock, ritual).
const quietHoursImages: GalleryImage[] = [
  { src: '/images/sanctuary/271A0719_websize%201.webp',         aspect: 'aspect-[3/4]', alt: 'A quiet corner of the sanctuary' },
  { src: '/images/contrast_therapy/IMG_7067%201.webp',          aspect: 'aspect-square', alt: 'The ritual of contrast' },
  { src: '/images/sanctuary/271A0800_websize%201.webp',         aspect: 'aspect-[4/5]', alt: 'An interior at rest' },
  { src: '/images/sanctuary/271A0828_websize%201.webp',         aspect: 'aspect-[4/3]', alt: 'A deck in the afternoon' },
  { src: '/images/contrast_therapy/IMG_7498%201.webp',          aspect: 'aspect-[3/4]', alt: 'The pause between practices' },
];

export default function GalleryPage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <GalleryHero />

      <GalleryThemedSection
        heading="The day opens slowly."
        body="Light filters through the canopy before anyone speaks. The shala is already warm. The kitchen is already moving. Mornings here begin before they begin."
        images={morningsImages}
        layoutVariant="A"
        background="warm-white"
      />

      <GalleryThemedSection
        heading="Where the practice lives."
        body="Wooden floors, open walls, jungle on three sides. The shala is built for breath — slow, full, present. It is the heart of the rhythm we hold."
        images={shalaImages}
        layoutVariant="B"
        background="cream"
      />

      <GalleryThemedSection
        heading="The jungle, the loudest voice in the room."
        body="The architecture steps back. The materials come from where you stand. What remains is the canopy, the wind, and a soundtrack that has been playing for thousands of years."
        images={jungleImages}
        layoutVariant="C"
        background="warm-white"
      />

      <GalleryThemedSection
        heading="Five minutes to the Pacific."
        body="Playa Hermosa lives a short walk away. Sunsets that color the whole sky. Waves that hold their own kind of practice. The shore is the sanctuary's other room."
        images={shoreImages}
        layoutVariant="C"
        background="cream"
      />

      <GalleryThemedSection
        heading="What happens around the fire."
        body="Shared meals, slow conversations, evenings that stretch longer than expected. Gatherings here are not events. They are what fills the space between practice and rest."
        images={gatheringsImages}
        layoutVariant="A"
        background="warm-white"
      />

      <GalleryThemedSection
        heading="The quiet hours in between."
        body="Afternoons that stretch. Reading on the deck. A nap in the hammock. The pool at three. These hours are not waiting for anything — they are the offering itself."
        images={quietHoursImages}
        layoutVariant="B"
        background="cream"
      />

      <GalleryFinalCTA />
      <Footer />
    </main>
  );
}
