'use client';

import { HeroVideo, heroCuts } from '@/components/shared/HeroVideo';

// Hero pattern matched 1:1 to the home hero (video, edge-to-edge mobile,
// 80% container desktop, mt-* offset for the fixed navbar so the hero +
// navbar fill exactly 100vh).
export function RetreatsHero() {
  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          <HeroVideo {...heroCuts('retreats', { landscape: 0.5, portrait: 0.5 })} />
        </div>
      </div>
    </section>
  );
}
