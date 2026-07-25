import { getAllTemplatesAdmin, getInstructors } from '@/lib/queries/classes';
import HorarioClient from './_components/HorarioClient';

export default async function AdminClasesPage() {
  const [templates, instructors] = await Promise.all([
    getAllTemplatesAdmin(),
    getInstructors(),
  ]);

  return <HorarioClient templates={templates} instructors={instructors} />;
}
