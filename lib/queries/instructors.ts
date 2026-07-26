import { createServiceClient } from '@/lib/supabase/server';
import type { Instructor } from '@/types';

export async function getInstructors(): Promise<Instructor[]> {
  try {
    // serviceClient para saltear RLS en el panel admin.
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('instructors')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('[getInstructors]', error.message);
      return [];
    }
    return data as Instructor[];
  } catch (err) {
    console.error('[getInstructors] unexpected:', err);
    return [];
  }
}
