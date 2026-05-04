import { MOCK_CLASSES } from '@/lib/mock-data';
import BookingFlow from './BookingFlow';
import { notFound } from 'next/navigation';

export default async function BookingPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const clase = MOCK_CLASSES.find((c) => c.id === classId);

  if (!clase) notFound();

  return (
    <BookingFlow
      classId={classId}
      className={clase.name}
      instructor={clase.instructor}
      startsAt={clase.startsAt.toISOString()}
      durationMinutes={clase.durationMinutes}
      capacity={clase.capacity}
      spotsRemaining={clase.spotsRemaining}
      priceUsd={clase.priceUsd}
      location={clase.location}
      description={clase.description}
      color={clase.color}
    />
  );
}
