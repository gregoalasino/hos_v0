'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type ClassInsert = Database['public']['Tables']['classes']['Insert'];
type ClassUpdate = Partial<Database['public']['Tables']['classes']['Update']>;

// ─── Recurring schedule (class_templates) ─────────────────────────────────────
// Templates are the source of truth for the weekly calendar. The public calendar
// materializes concrete `classes` rows from active templates on demand.
export type TemplateInput = {
  name: string;
  description?: string | null;
  instructorId?: string | null;
  dayOfWeek: number; // 0=Sun … 6=Sat
  timeStart: string; // "HH:MM"
  durationMinutes: number;
  capacity: number;
  location: string;
  isActive: boolean;
};

const DAY_SLUG = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function templateSlug(name: string, dayOfWeek: number): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return `${base}-${DAY_SLUG[dayOfWeek] ?? dayOfWeek}`;
}

function revalidateSchedule() {
  revalidatePath('/admin/clases');
  revalidatePath('/admin/calendario');
  revalidatePath('/yoga');
}

export async function createTemplate(data: TemplateInput) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('class_templates').insert({
    name: data.name,
    slug: templateSlug(data.name, data.dayOfWeek),
    description: data.description ?? null,
    instructor_id: data.instructorId || null,
    day_of_week: data.dayOfWeek,
    time_start: data.timeStart,
    duration_minutes: data.durationMinutes,
    capacity: data.capacity,
    location: data.location,
    is_active: data.isActive,
  });
  if (error) throw new Error(error.message);
  revalidateSchedule();
}

export async function updateTemplate(id: string, data: TemplateInput) {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('class_templates')
    .update({
      name: data.name,
      slug: templateSlug(data.name, data.dayOfWeek),
      description: data.description ?? null,
      instructor_id: data.instructorId || null,
      day_of_week: data.dayOfWeek,
      time_start: data.timeStart,
      duration_minutes: data.durationMinutes,
      capacity: data.capacity,
      location: data.location,
      is_active: data.isActive,
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidateSchedule();
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
  revalidateSchedule();
}

export async function deleteTemplate(id: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('class_templates').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateSchedule();
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
