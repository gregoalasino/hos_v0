import { getAllClasses, getInstructors } from '@/lib/queries/classes';
import { getAllBookings } from '@/lib/queries/bookings';
import { ensureUpcomingWeeks } from '@/app/actions/classes';
import CalendarioClient from './_components/CalendarioClient';
import type { YogaClass, Booking } from '@/types';

export default async function AdminCalendarioPage() {
  // Materialize the recurring schedule for the next ~3 months.
  await ensureUpcomingWeeks();

  const [classes, bookings, instructors] = await Promise.all([
    getAllClasses(),
    getAllBookings(),
    getInstructors(),
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
      instructors={instructors}
    />
  );
}
