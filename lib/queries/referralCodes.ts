import { createClient } from '@/lib/supabase/server';
import type { ReferralCode } from '@/types';
import type { Database } from '@/types/supabase';

type ReferralRow = Database['public']['Tables']['referral_codes']['Row'];

function rowToReferralCode(row: ReferralRow): ReferralCode {
  return {
    id: row.id,
    code: row.code,
    partnerName: row.partner_name,
    description: row.description ?? '',
    benefitType: row.benefit_type,
    discountPercent: row.discount_percent ?? undefined,
    discountFixed: row.discount_fixed ?? undefined,
    freeUpsellId: row.free_upsell_id ?? undefined,
    isActive: row.is_active,
    usageLimit: row.usage_limit ?? undefined,
    usageCount: row.usage_count,
    minPurchaseUsd: Number(row.min_purchase_usd),
    validFrom: row.valid_from ? new Date(row.valid_from) : undefined,
    validUntil: row.valid_until ? new Date(row.valid_until) : undefined,
    createdAt: new Date(row.created_at),
  };
}

export async function getAllReferralCodes(): Promise<ReferralCode[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('referral_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getAllReferralCodes]', error.message);
      return [];
    }
    return data.map(rowToReferralCode);
  } catch (err) {
    console.error('[getAllReferralCodes] unexpected:', err);
    return [];
  }
}
