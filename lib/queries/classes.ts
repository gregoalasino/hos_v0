import { createClient } from '@/lib/supabase/server';
import type { DbClass, YogaClass } from '@/types';
import { dbClassToYogaClass } from '@/types';

const CLASS_WITH_INSTRUCTOR = `
  *,
  instructors (
    id,
    name
  )
` as const;

export async function getActiveClasses(): Promise<YogaClass[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('classes')
      .select(CLASS_WITH_INSTRUCTOR)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true });

    if (error) {
      console.error('[getActiveClasses]', error.message);
      return [];
    }
    return (data as unknown as DbClass[]).map(dbClassToYogaClass);
  } catch (err) {
    console.error('[getActiveClasses] unexpected:', err);
    return [];
  }
}

export async function getClassById(id: string): Promise<DbClass | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('classes')
      .select(CLASS_WITH_INSTRUCTOR)
      .eq('id', id)
      .single();

    if (error) {
      console.error('[getClassById]', error.message);
      return null;
    }
    return data as unknown as DbClass;
  } catch (err) {
    console.error('[getClassById] unexpected:', err);
    return null;
  }
}

export async function getClassesForWeek(
  weekStart: Date,
  weekEnd: Date,
): Promise<YogaClass[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('classes')
      .select(CLASS_WITH_INSTRUCTOR)
      .eq('is_active', true)
      .gte('starts_at', weekStart.toISOString())
      .lte('starts_at', weekEnd.toISOString())
      .order('starts_at', { ascending: true });

    if (error) {
      console.error('[getClassesForWeek]', error.message);
      return [];
    }
    return (data as unknown as DbClass[]).map(dbClassToYogaClass);
  } catch (err) {
    console.error('[getClassesForWeek] unexpected:', err);
    return [];
  }
}

export async function getClassTemplates() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('class_templates')
      .select('*, instructors(id, name)')
      .order('day_of_week', { ascending: true });

    if (error) {
      console.error('[getClassTemplates]', error.message);
      return [];
    }
    return data;
  } catch (err) {
    console.error('[getClassTemplates] unexpected:', err);
    return [];
  }
}

export async function getAllClasses(): Promise<YogaClass[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('classes')
      .select(CLASS_WITH_INSTRUCTOR)
      .order('starts_at', { ascending: true });

    if (error) {
      console.error('[getAllClasses]', error.message);
      return [];
    }
    return (data as unknown as DbClass[]).map(dbClassToYogaClass);
  } catch (err) {
    console.error('[getAllClasses] unexpected:', err);
    return [];
  }
}
