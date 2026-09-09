-- ─────────────────────────────────────────────────────────────────────────────
-- 006 · Imagen por clase
--
-- Permite que el admin cargue una imagen propia para cada clase, que reemplaza
-- la foto por defecto (mapeada por nombre en el código) en la landing de reserva.
--
-- La imagen vive en la plantilla recurrente (class_templates) y se propaga a las
-- instancias (classes) al materializarlas; las clases puntuales del calendario
-- guardan la suya directamente en classes. Los archivos se suben a un bucket
-- público de Storage ('class-images') y acá sólo guardamos la URL pública.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Columnas image_url ────────────────────────────────────────────────────
ALTER TABLE class_templates ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE classes         ADD COLUMN IF NOT EXISTS image_url text;

-- ── 2. La materialización propaga la imagen de la plantilla a la instancia ────
CREATE OR REPLACE FUNCTION generate_week_classes(p_week_start date)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_template class_templates%ROWTYPE;
  v_class_date date;
  v_starts_at  timestamptz;
  v_count      integer := 0;
  v_exists     boolean;
BEGIN
  FOR v_template IN SELECT * FROM class_templates WHERE is_active = true LOOP
    -- Map day_of_week (0=Sun…6=Sat) to offset from Monday (p_week_start)
    v_class_date := p_week_start + (
      CASE v_template.day_of_week
        WHEN 0 THEN 6  -- Sunday is 6 days after Monday
        WHEN 1 THEN 0
        WHEN 2 THEN 1
        WHEN 3 THEN 2
        WHEN 4 THEN 3
        WHEN 5 THEN 4
        WHEN 6 THEN 5
      END
    );

    -- Build timestamptz in Costa Rica time (UTC-6)
    v_starts_at := (v_class_date::text || ' ' || v_template.time_start ||
                    ':00-06')::timestamptz;

    SELECT EXISTS (
      SELECT 1 FROM classes
      WHERE template_id = v_template.id
        AND starts_at = v_starts_at
    ) INTO v_exists;

    IF NOT v_exists THEN
      INSERT INTO classes (
        template_id, instructor_id, name, slug, description,
        starts_at, duration_minutes, capacity, spots_remaining,
        price_dropin_usd, location, color, image_url, is_active
      ) VALUES (
        v_template.id, v_template.instructor_id, v_template.name,
        v_template.slug, v_template.description, v_starts_at,
        v_template.duration_minutes, v_template.capacity,
        v_template.capacity, v_template.price_dropin_usd,
        v_template.location, v_template.color, v_template.image_url, true
      );
      v_count := v_count + 1;
    END IF;
  END LOOP;

  RETURN v_count;
END;
$$;

-- ── 3. Bucket público de Storage para las imágenes de clase ──────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('class-images', 'class-images', true)
ON CONFLICT (id) DO NOTHING;

-- Lectura pública de los objetos del bucket (las subidas se hacen server-side
-- con la service role, que saltea RLS, así que no hace falta política de write).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Public read class-images'
  ) THEN
    CREATE POLICY "Public read class-images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'class-images');
  END IF;
END $$;
