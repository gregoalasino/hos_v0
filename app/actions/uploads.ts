'use server';

import { createServiceClient } from '@/lib/supabase/server';

// Public bucket that holds class images. Created in migration 006. Uploads go
// through the service role (bypasses RLS); reads are public via the URL.
const BUCKET = 'class-images';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

type UploadResult = { ok: true; url: string } | { ok: false; error: string };

// Uploads a class image and returns its public URL. Called from the admin
// class modals (recurring template + one-off calendar session).
export async function uploadClassImage(formData: FormData): Promise<UploadResult> {
  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'no_file' };
  if (file.size > MAX_BYTES) return { ok: false, error: 'too_large' };
  if (!ALLOWED.includes(file.type)) return { ok: false, error: 'bad_type' };

  const supabase = await createServiceClient();
  const ext = EXT[file.type] ?? 'jpg';
  const path = `classes/${crypto.randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
