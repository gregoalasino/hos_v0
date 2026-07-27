'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type ClassInsert = Database['public']['Tables']['classes']['Insert'];
type ClassUpdate = Partial<Database['public']['Tables']['classes']['Update']>;
type TemplateInsert = Database['public']['Tables']['class_templates']['Insert'];
type TemplateUpdate = Database['public']['Tables']['class_templates']['Update'];


// Monday (yyyy-MM-dd) of the week containing `date`.
function mondayOf(date: Date): string {
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const d = String(monday.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Ensures the recurring schedule is materialized into `classes` for this week
 * and the next one. Idempotent (the RPC skips instances that already exist), so
 * it's safe to call on every admin page load — this replaces the manual
 * "Regenerate week" button.
 */
export async function ensureUpcomingWeeks(): Promise<void> {
  const supabase = await createServiceClient();
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  const weeks = Array.from(new Set([mondayOf(now), mondayOf(nextWeek)]));
  for (const weekStart of weeks) {
    const { error } = await supabase.rpc('generate_week_classes', {
      p_week_start: weekStart,
    });
    if (error) {
      console.error('[ensureUpcomingWeeks]', weekStart, error.message);
    }
  }
}

// ─── Class templates (recurring weekly schedule) ────────────────────────────
export async function createTemplate(data: TemplateInsert) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('class_templates').insert(data);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
}

export async function updateTemplate(id: string, data: TemplateUpdate) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('class_templates').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
}

export async function toggleTemplateActive(id: string) {
  const supabase = await createServiceClient();
  const { data: current, error: fetchError } = await supabase
    .from('class_templates')
    .select('is_active')
    .eq('id', id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { error } = await supabase
    .from('class_templates')
    .update({ is_active: !current.is_active })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
}

/**
 * Deletes a recurring class. Future instances (not yet started) are removed too;
 * past instances are kept so bookings/metrics history stays intact. If a past
 * instance blocks the hard delete (FK), fall back to deactivating the template.
 */
export async function deleteTemplate(id: string) {
  const supabase = await createServiceClient();

  await supabase
    .from('classes')
    .delete()
    .eq('template_id', id)
    .gte('starts_at', new Date().toISOString());

  const { error } = await supabase.from('class_templates').delete().eq('id', id);
  if (error) {
    // Likely referenced by past classes — deactivate instead of hard-deleting.
    const { error: deactivateError } = await supabase
      .from('class_templates')
      .update({ is_active: false })
      .eq('id', id);
    if (deactivateError) throw new Error(deactivateError.message);
  }

  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
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
