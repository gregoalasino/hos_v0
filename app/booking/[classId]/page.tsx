import { getClassById } from '@/lib/queries/classes';
import { getActiveUpsells } from '@/lib/queries/upsells';
import { notFound } from 'next/navigation';
import BookingFlow from './BookingFlow';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const [clase, upsells] = await Promise.all([
    getClassById(classId),
    getActiveUpsells(),
  ]);

  if (!clase) notFound();

  return (
    <BookingFlow
      classId={classId}
      className={clase.name}
      instructor={clase.instructors?.name ?? ''}
      startsAt={clase.starts_at}
      durationMinutes={clase.duration_minutes}
      capacity={clase.capacity}
      spotsRemaining={clase.spots_remaining}
      priceUsd={Number(clase.price_dropin_usd)}
      location={clase.location}
      description={clase.description ?? ''}
      color={clase.color ?? undefined}
      upsells={upsells}
    />
  );
}
