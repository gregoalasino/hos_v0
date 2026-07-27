import { getAllClasses } from '@/lib/queries/classes';
import { getAllBookings } from '@/lib/queries/bookings';
import { ensureUpcomingWeeks } from '@/app/actions/classes';
import CalendarioClient from './_components/CalendarioClient';
import type { YogaClass, Booking } from '@/types';

export default async function AdminCalendarioPage() {
  // Keep this/next week's sessions materialized from the recurring schedule.
  await ensureUpcomingWeeks();

  const [classes, bookings] = await Promise.all([
    getAllClasses(),
    getAllBookings(),
  ]);

  const serializedClasses = classes.map(c => ({
    ...c,
    startsAt: c.startsAt.toISOString(),
  })) as (Omit<YogaClass, 'startsAt'> & { startsAt: string })[];

  const serializedBookings = bookings.map(b => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  })) as (Omit<Booking, 'createdAt'> & { createdAt: string })[];

  return (
    <CalendarioClient
      initialClasses={serializedClasses}
      initialBookings={serializedBookings}
    />
  );
}
