'use client';

import { StayCarousel } from '@/components/stay-with-us/StayCarousel';
import { CheckAvailabilityLink } from '@/components/accommodations/CheckAvailabilityLink';
import type { StayData } from '@/lib/stays';

// ─── Stay card ───────────────────────────────────────────────────────────────
// One dwelling. First-glance copy stays one breath long; the full story lives
// in the lightbox, one "Read more" away.
//
// Below lg: the stacked card (photo over copy) that phones and tablets already
// carry well. From lg up: an editorial row — the photograph on one side, the
// dwelling's story beside it, sides alternating down the page. Each dwelling
// gets its own moment at full attention instead of competing in a grid, and
// the copy fills the air that a lone tall photograph used to leave dead. The
// numeral is the thread that ties the rows into one sequence.
export function StayCard({
  stay,
  index,
  onExpand,
  booking = true,
  titleAs: Title = 'h2',
}: {
  stay: StayData;
  index: number;
  onExpand: (index: number) => void;
  /**
   * Whether the Cloudbeds door sits under the copy. /stay-with-us books;
   * /host-your-retreat only shows, since a group takes the dwellings as a
   * whole and the conversation happens on WhatsApp instead.
   */
  booking?: boolean;
  /** The title's heading level — h2 where the cards are the page, h3 under a section heading. */
  titleAs?: 'h2' | 'h3';
}) {
  return (
    <article className="flex h-full flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-14">
      {/* One column narrower from xl: the container keeps growing with the
          monitor, and at ~1700px a 5/12 photograph is back over 700px tall —
          the very thing this layout replaced. */}
      <div
        className={`lg:col-span-5 xl:col-span-4 ${
          index % 2 === 1 ? 'lg:col-start-8 xl:col-start-9 lg:row-start-1' : ''
        }`}
      >
        <StayCarousel images={stay.images} alt={stay.title} onExpand={onExpand} />
      </div>

      <div
        className={`flex flex-1 flex-col lg:col-span-6 lg:max-w-xl ${
          index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-7 xl:col-start-6'
        }`}
      >
        <p
          aria-hidden
          className="hidden lg:block font-body text-[11px] tracking-[0.3em] text-ink/70"
        >
          {String(index + 1).padStart(2, '0')}
        </p>

        <Title className="font-display font-light text-ink text-lg lg:text-3xl leading-snug mt-5 lg:mt-4">
          {stay.title}
        </Title>
        <p className="font-body text-xs text-ink mt-2 lg:mt-3">{stay.meta}</p>
        <p className="font-body text-sm text-ink leading-relaxed lg:leading-[1.8] mt-3 lg:mt-6">
          {stay.short}{' '}
          <button
            type="button"
            onClick={() => onExpand(0)}
            className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-60 transition-opacity duration-300"
          >
            Read more
          </button>
        </p>

        {booking && <CheckAvailabilityLink className="mt-auto pt-4 lg:mt-0 lg:pt-8 self-start" />}
      </div>
    </article>
  );
}
