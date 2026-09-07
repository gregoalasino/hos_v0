import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getClassesForWeek, ensureWeekMaterialized } from '@/lib/queries/classes';
import { addDays, startOfWeek } from 'date-fns';
import YogaPageClient from './YogaPageClient';
import { YogaClassesJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = buildMetadata({
  path: '/yoga',
  title: 'Yoga Classes in Santa Teresa — Daily Practice at House of Shakti',
  description:
    'Daily yoga classes in Santa Teresa, Costa Rica. Vinyasa, Tantra and meditation in an open-air shala, for every level. Book your mat at House of Shakti.',
  // Already names the business — the root template would repeat it.
  absoluteTitle: true,
});

// The current week must be materialized + read fresh on every visit.
export const dynamic = 'force-dynamic';

export default async function YogaPage() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  // Fill the current week from the recurring schedule before reading it.
  await ensureWeekMaterialized(weekStart);

  const classes = await getClassesForWeek(weekStart, weekEnd);

  // Serialize Date → string for client component props
  const initialClasses = classes.map((c) => ({
    ...c,
    startsAt: c.startsAt.toISOString(),
  }));

  return (
    <>
      {/* The week's real classes as Event structured data — dated, priced and
          bookable. Renders nothing when the week comes back empty. */}
      <YogaClassesJsonLd classes={classes} />
      <YogaPageClient initialClasses={initialClasses} />
    </>
  );
}
