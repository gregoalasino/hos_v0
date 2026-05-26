import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import InstructorLayout from '@/components/instructor/InstructorLayout';

export const metadata = {
  title: 'Portal Instructor — House of Shakti',
};

// Tipo extendido hasta que la migración actualice los tipos generados
type InstructorRow = { id: string; name: string; email: string };

export default async function InstructorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar sesión activa
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si no hay sesión, redirigir al login
  if (!user) {
    redirect('/instructor/login');
  }

  // Verificar que el usuario tiene rol instructor
  const role = user.user_metadata?.role;
  if (role !== 'instructor') {
    redirect('/instructor/login');
  }

  // Buscar datos del instructor en la tabla instructors por email
  // Casting necesario hasta aplicar migración 002 que agrega la columna email
  const serviceClient = await createServiceClient();
  const { data: instructor } = await (serviceClient as unknown as {
    from: (t: string) => {
      select: (s: string) => {
        eq: (col: string, val: string) => {
          single: () => Promise<{ data: InstructorRow | null }>;
        };
      };
    };
  }).from('instructors').select('id, name, email').eq('email', user.email ?? '').single();

  return (
    <InstructorLayout
      instructorName={instructor?.name ?? user.user_metadata?.full_name ?? 'Instructor'}
      instructorEmail={instructor?.email ?? user.email ?? ''}
    >
      {children}
    </InstructorLayout>
  );
}
