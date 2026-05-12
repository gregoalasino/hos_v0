'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type ClassInsert = Database['public']['Tables']['classes']['Insert'];
type ClassUpdate = Partial<Database['public']['Tables']['classes']['Update']>;

export async function generateWeekClasses(weekStartDate: string) {
  const supabase = await createServiceClient();
  const { data, error } = await supabase.rpc('generate_week_classes', {
    p_week_start: weekStartDate,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/calendario');
  revalidatePath('/admin/clases');
  return data as number;
}

export async function toggleClassActive(id: string) {
  const supabase = await createServiceClient();
  const { data: current, error: fetchError } = await supabase
    .from('classes')
    .select('is_active')
    .eq('id', id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase
    .from('classes')
    .update({ is_active: !current.is_active })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
}

export async function updateClassDetails(id: string, data: ClassUpdate) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('classes')
    .update(data)
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
}

export async function deleteClass(id: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('classes')
    .update({ is_active: false })
    .eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
}

export async function createManualClass(data: ClassInsert) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('classes').insert(data);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
}
