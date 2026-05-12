import { getAllClasses } from '@/lib/queries/classes';
import ClasesClient from './_components/ClasesClient';
import type { YogaClass } from '@/types';

export default async function AdminClasesPage() {
  const classes = await getAllClasses();

  const serialized = classes.map((c) => ({
    ...c,
    startsAt: c.startsAt.toISOString(),
  })) as (Omit<YogaClass, 'startsAt'> & { startsAt: string })[];

  return <ClasesClient initialClasses={serialized} />;
}
