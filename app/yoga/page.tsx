import { getClassesForWeek } from '@/lib/queries/classes';
import { addDays, startOfWeek } from 'date-fns';
import YogaPageClient from './YogaPageClient';

export default async function YogaPage() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const classes = await getClassesForWeek(weekStart, weekEnd);

  // Serialize Date → string for client component props
  const initialClasses = classes.map((c) => ({
    ...c,
    startsAt: c.startsAt.toISOString(),
  }));

  return <YogaPageClient initialClasses={initialClasses} />;
}
