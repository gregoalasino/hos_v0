-- ─────────────────────────────────────────────────────────────────────────────
-- 003_templates_price_and_generation
-- El panel de Classes ahora administra el HORARIO SEMANAL RECURRENTE
-- (class_templates) en vez de instancias sueltas. Para que cada clase recurrente
-- tenga su propio precio, agregamos price_dropin_usd a class_templates y hacemos
-- que generate_week_classes lo propague a las instancias generadas.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Precio por plantilla ──────────────────────────────────────────────────
ALTER TABLE class_templates
  ADD COLUMN IF NOT EXISTS price_dropin_usd numeric(10,2) NOT NULL DEFAULT 20.00;

-- Backfill de las plantillas existentes (por si la default no las cubrió).
UPDATE class_templates
  SET price_dropin_usd = 20.00
  WHERE price_dropin_usd IS NULL;

-- ── 2. generate_week_classes usa el precio de la plantilla ───────────────────
-- (antes hardcodeaba 20.00). Sigue siendo idempotente: no duplica una instancia
-- que ya exista para el mismo template + starts_at.
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
        price_dropin_usd, location, color, is_active
      ) VALUES (
        v_template.id, v_template.instructor_id, v_template.name,
        v_template.slug, v_template.description, v_starts_at,
        v_template.duration_minutes, v_template.capacity,
        v_template.capacity, v_template.price_dropin_usd,
        v_template.location, v_template.color, true
      );
      v_count := v_count + 1;
    END IF;
  END LOOP;

  RETURN v_count;
END;
$$;
