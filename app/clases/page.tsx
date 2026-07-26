import { redirect } from 'next/navigation';

// The public class schedule now lives at /yoga, backed by the real database.
// This former mock-data page redirects there to keep old links working.
export default function ClasesPage() {
  redirect('/yoga');
}
