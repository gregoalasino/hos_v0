import { createClient, createServiceClient } from '@/lib/supabase/server';

export type ClassPack = {
  id: string;
  name: string;
  classesCount: number;
  priceUsd: number;
};

export type PackPurchase = {
  id: string;
  packId: string | null;
  packName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  code: string | null;
  classesTotal: number;
  classesUsed: number;
  status: 'pending' | 'paid' | 'cancelled';
  amountUsd: number | null;
  createdAt: string;
  paidAt: string | null;
};

// Public: the multi-class packs offered for sale (excludes the single drop-in).
export async function getSellablePacks(): Promise<ClassPack[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('class_packs')
      .select('id, name, classes_count, price_usd')
      .eq('is_active', true)
      .gt('classes_count', 1)
      .order('classes_count', { ascending: true });
    if (error) {
      console.error('[getSellablePacks]', error.message);
      return [];
    }
    return (data ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      classesCount: p.classes_count,
      priceUsd: Number(p.price_usd),
    }));
  } catch (err) {
    console.error('[getSellablePacks] unexpected:', err);
    return [];
  }
}

type PurchaseRow = {
  id: string;
  pack_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  code: string | null;
  classes_total: number;
  classes_used: number;
  status: string;
  amount_usd: number | null;
  created_at: string;
  paid_at: string | null;
  class_packs: { name: string } | null;
};

export async function getAllPackPurchases(): Promise<PackPurchase[]> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('pack_purchases')
      .select('*, class_packs(name)')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[getAllPackPurchases]', error.message);
      return [];
    }
    return (data as unknown as PurchaseRow[]).map((p) => ({
      id: p.id,
      packId: p.pack_id,
      packName: p.class_packs?.name ?? `Pack x${p.classes_total}`,
      firstName: p.first_name,
      lastName: p.last_name,
      email: p.email,
      phone: p.phone,
      code: p.code,
      classesTotal: p.classes_total,
      classesUsed: p.classes_used,
      status: p.status as PackPurchase['status'],
      amountUsd: p.amount_usd != null ? Number(p.amount_usd) : null,
      createdAt: p.created_at,
      paidAt: p.paid_at,
    }));
  } catch (err) {
    console.error('[getAllPackPurchases] unexpected:', err);
    return [];
  }
}
