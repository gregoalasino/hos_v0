'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';

type CodeInput = {
  code: string;
  partnerName: string;
  description: string;
  benefitType: 'percentage' | 'fixed' | 'free_upsell';
  discountPercent?: number;
  discountFixed?: number;
  freeUpsellId?: string;
  isActive: boolean;
  usageLimit?: number;
  minPurchaseUsd: number;
  validFrom?: string;
  validUntil?: string;
};

export async function createReferralCode(data: CodeInput) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('referral_codes').insert({
    code: data.code.toUpperCase(),
    partner_name: data.partnerName,
    description: data.description,
    benefit_type: data.benefitType,
    discount_percent: data.discountPercent ?? null,
    discount_fixed: data.discountFixed ?? null,
    free_upsell_id: data.freeUpsellId ?? null,
    is_active: data.isActive,
    usage_limit: data.usageLimit ?? null,
    min_purchase_usd: data.minPurchaseUsd,
    valid_from: data.validFrom || null,
    valid_until: data.validUntil || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/refers');
}

export async function updateReferralCode(id: string, data: CodeInput) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('referral_codes').update({
    code: data.code.toUpperCase(),
    partner_name: data.partnerName,
    description: data.description,
    benefit_type: data.benefitType,
    discount_percent: data.discountPercent ?? null,
    discount_fixed: data.discountFixed ?? null,
    free_upsell_id: data.freeUpsellId ?? null,
    is_active: data.isActive,
    usage_limit: data.usageLimit ?? null,
    min_purchase_usd: data.minPurchaseUsd,
    valid_from: data.validFrom || null,
    valid_until: data.validUntil || null,
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/refers');
}

export async function toggleReferralCodeActive(id: string) {
  const supabase = await createServiceClient();
  const { data: current, error: fetchError } = await supabase
    .from('referral_codes').select('is_active').eq('id', id).single();
  if (fetchError) throw new Error(fetchError.message);
  const { error } = await supabase.from('referral_codes')
    .update({ is_active: !current.is_active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/refers');
}

export async function deleteReferralCode(id: string) {
  const supabase = await createServiceClient();
  const { error } = await supabase.from('referral_codes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/refers');
}
