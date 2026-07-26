import { getClassTemplates } from '@/lib/queries/classes';
import { getInstructors } from '@/lib/queries/instructors';
import { ensureUpcomingWeeks } from '@/app/actions/classes';
import ClasesClient from './_components/ClasesClient';
import type { ClassTemplate } from '@/types';

export default async function AdminClasesPage() {
  // Materialize this/next week's sessions from the recurring schedule so the
  // calendar and public booking always have upcoming classes — replaces the old
  // manual "Regenerate week" button.
  await ensureUpcomingWeeks();

  const [templates, instructors] = await Promise.all([
    getClassTemplates(),
    getInstructors(),
  ]);

  return (
    <ClasesClient
      initialTemplates={templates as unknown as ClassTemplate[]}
      instructors={instructors}
    />
  );
}
