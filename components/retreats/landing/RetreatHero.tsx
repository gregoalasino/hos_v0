'use client';

import type { Retreat } from '@/lib/retreats';
import { HeroVideo, heroCuts } from '@/components/shared/HeroVideo';

// Hero pattern matched 1:1 to the retreats hub: the same clip, edge-to-edge
// on mobile, 80% container on desktop, mt-* offset so hero + navbar fill 100vh.
// Pure video — no text, no scroll indicator. Title / dates / duration appear
// further down the page in other sections.
export function RetreatHero({ retreat: _retreat }: { retreat: Retreat }) {
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
