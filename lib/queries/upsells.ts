import { createClient, createServiceClient } from '@/lib/supabase/server';
import type { Upsell } from '@/types';
import type { Database } from '@/types/supabase';

type UpsellRow = Database['public']['Tables']['upsells']['Row'];

function rowToUpsell(row: UpsellRow): Upsell {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    priceUsd: Number(row.price_usd),
    isActive: row.is_active,
  };
}

export async function getActiveUpsells(): Promise<Upsell[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('upsells')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[getActiveUpsells]', error.message);
      return [];
    }
    return data.map(rowToUpsell);
  } catch (err) {
    console.error('[getActiveUpsells] unexpected:', err);
    return [];
  }
}

export async function getAllUpsells(): Promise<Upsell[]> {
  try {
    // Usar serviceClient para saltear RLS y ver upsells inactivos en el admin
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('upsells')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[getAllUpsells]', error.message);
      return [];
    }
    return data.map(rowToUpsell);
  } catch (err) {
    console.error('[getAllUpsells] unexpected:', err);
    return [];
  }
}
