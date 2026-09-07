import { redirect } from '@/i18n/navigation';
import { localeFromParams, type LocaleParams } from '@/i18n/routing';

// The public class schedule now lives at /yoga, backed by the real database.
// This former mock-data page redirects there to keep old links working —
// `/clases` to `/yoga`, `/es/clases` to `/es/yoga`.
export default async function ClasesPage({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  redirect({ href: '/yoga', locale });
}
