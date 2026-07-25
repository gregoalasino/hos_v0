import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, error: 'not_found' });
    }

    const supabase = await createServiceClient();
    const normalized = code.trim().toUpperCase();

    // ── 1. Referral / promo code ─────────────────────────────────────────────
    const { data, error } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', normalized)
      .single();

    if (!error && data) {
      if (!data.is_active) {
        return NextResponse.json({ valid: false, error: 'inactive' });
      }
      const now = new Date();
      if (data.valid_from && now < new Date(data.valid_from)) {
        return NextResponse.json({ valid: false, error: 'not_started' });
      }
      if (data.valid_until && now > new Date(data.valid_until)) {
        return NextResponse.json({ valid: false, error: 'expired' });
      }
      if (data.usage_limit != null && data.usage_count >= data.usage_limit) {
        return NextResponse.json({ valid: false, error: 'limit_reached' });
      }
      if (typeof subtotal === 'number' && subtotal < Number(data.min_purchase_usd)) {
        return NextResponse.json({ valid: false, error: 'min_purchase' });
      }

      return NextResponse.json({
        valid: true,
        kind: 'referral',
        benefitType: data.benefit_type,
        discountPercent: data.discount_percent,
        discountFixed: data.discount_fixed,
        freeUpsellId: data.free_upsell_id,
        partnerName: data.partner_name,
        description: data.description,
      });
    }

    // ── 2. Class-pack code ───────────────────────────────────────────────────
    const { data: pack } = await supabase
      .from('pack_purchases')
      .select('status, classes_total, classes_used')
      .eq('code', normalized)
      .single();

    if (pack) {
      if (pack.status !== 'paid') {
        return NextResponse.json({ valid: false, error: 'not_found' });
      }
      const remaining = pack.classes_total - pack.classes_used;
      if (remaining <= 0) {
        return NextResponse.json({ valid: false, error: 'limit_reached' });
      }
      return NextResponse.json({
        valid: true,
        kind: 'pack',
        remaining,
        description: `Class pack — ${remaining} of ${pack.classes_total} classes remaining`,
      });
    }

    return NextResponse.json({ valid: false, error: 'not_found' });
  } catch (err) {
    console.error('[POST /api/referral-codes/validate]', err);
    return NextResponse.json({ valid: false, error: 'not_found' });
  }
}
