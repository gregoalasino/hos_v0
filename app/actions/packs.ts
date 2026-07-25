'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import { sendPackCodeEmail } from '@/lib/email';

export type PackPurchaseInput = {
  packId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

// ── Step 1 — the customer starts a purchase (payment seam) ────────────────────
// Creates a 'pending' purchase. Payment is confirmed later (today by the admin;
// tomorrow by the Tilopay webhook). No code is generated until it is paid.
export async function createPackPurchase(
  input: PackPurchaseInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const supabase = await createServiceClient();

  const { data: pack, error: packError } = await supabase
    .from('class_packs')
    .select('id, name, classes_count, price_usd, is_active')
    .eq('id', input.packId)
    .single();

  if (packError || !pack || !pack.is_active) {
    return { ok: false, error: 'pack_not_found' };
  }

  const { data, error } = await supabase
    .from('pack_purchases')
    .insert({
      pack_id: pack.id,
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone ?? null,
      classes_total: pack.classes_count,
      amount_usd: pack.price_usd,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[createPackPurchase]', error?.message);
    return { ok: false, error: 'database_error' };
  }

  revalidatePath('/admin/paquetes');
  return { ok: true, id: data.id };
}

// ── Step 2 — payment confirmed → generate code + email it ─────────────────────
// This is the seam the Tilopay webhook will call instead of the admin action.
export async function confirmPackPayment(
  id: string,
): Promise<{ ok: boolean; code?: string; emailSent?: boolean; error?: string }> {
  const supabase = await createServiceClient();

  const { data: purchase, error: fetchError } = await supabase
    .from('pack_purchases')
    .select('*, class_packs(name)')
    .eq('id', id)
    .single();

  if (fetchError || !purchase) return { ok: false, error: 'not_found' };
  if (purchase.status === 'paid' && purchase.code) {
    return { ok: true, code: purchase.code };
  }

  // Generate a unique code.
  const { data: codeData, error: codeError } = await supabase.rpc('generate_pack_code');
  if (codeError || !codeData) {
    console.error('[confirmPackPayment] code gen', codeError?.message);
    return { ok: false, error: 'code_generation_failed' };
  }
  const code = codeData as string;

  const { error: updateError } = await supabase
    .from('pack_purchases')
    .update({ status: 'paid', code, paid_at: new Date().toISOString() })
    .eq('id', id);

  if (updateError) {
    console.error('[confirmPackPayment] update', updateError.message);
    return { ok: false, error: 'database_error' };
  }

  const packName =
    (purchase.class_packs as unknown as { name: string } | null)?.name ??
    `Pack x${purchase.classes_total}`;

  const emailResult = await sendPackCodeEmail({
    to: purchase.email,
    firstName: purchase.first_name,
    code,
    packName,
    classesTotal: purchase.classes_total,
  });

  revalidatePath('/admin/paquetes');
  return { ok: true, code, emailSent: emailResult.sent };
}

// ── Resend the code email (e.g. after the RESEND key is configured) ───────────
export async function resendPackCode(
  id: string,
): Promise<{ ok: boolean; emailSent?: boolean; error?: string }> {
  const supabase = await createServiceClient();
  const { data: purchase, error } = await supabase
    .from('pack_purchases')
    .select('*, class_packs(name)')
    .eq('id', id)
    .single();

  if (error || !purchase) return { ok: false, error: 'not_found' };
  if (purchase.status !== 'paid' || !purchase.code) {
    return { ok: false, error: 'not_paid' };
  }

  const packName =
    (purchase.class_packs as unknown as { name: string } | null)?.name ??
    `Pack x${purchase.classes_total}`;

  const emailResult = await sendPackCodeEmail({
    to: purchase.email,
    firstName: purchase.first_name,
    code: purchase.code,
    packName,
    classesTotal: purchase.classes_total,
  });

  return { ok: true, emailSent: emailResult.sent };
}

export async function cancelPackPurchase(id: string): Promise<{ ok: boolean }> {
  const supabase = await createServiceClient();
  const { error } = await supabase
    .from('pack_purchases')
    .update({ status: 'cancelled' })
    .eq('id', id);
  if (error) {
    console.error('[cancelPackPurchase]', error.message);
    return { ok: false };
  }
  revalidatePath('/admin/paquetes');
  return { ok: true };
}
