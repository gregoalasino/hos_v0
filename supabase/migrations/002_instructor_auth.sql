-- ─────────────────────────────────────────────────────────────────────────────
-- 002_instructor_auth — Portal de instructores
-- Agrega email a la tabla instructors para vincular con Supabase Auth.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Agregar email a instructors ───────────────────────────────────────────
ALTER TABLE instructors ADD COLUMN IF NOT EXISTS email text UNIQUE;

-- ── 2. Función helper: is_instructor() ───────────────────────────────────────
-- Devuelve true si el JWT del usuario tiene role='instructor'.
CREATE OR REPLACE FUNCTION is_instructor()
RETURNS boolean AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'instructor',
    false
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ── 3. Función helper: instructor_id_for_current_user() ──────────────────────
-- Devuelve el UUID del instructor que coincide con el email del usuario logueado.
CREATE OR REPLACE FUNCTION instructor_id_for_current_user()
RETURNS uuid AS $$
  SELECT id FROM instructors
  WHERE email = auth.jwt() ->> 'email'
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- ── 4. RLS: instructores pueden ver sus propias clases ────────────────────────
-- (La política pública existente ya cubre clases activas; esta es adicional)
DROP POLICY IF EXISTS "classes_select_instructor" ON classes;
CREATE POLICY "classes_select_instructor"
  ON classes FOR SELECT
  USING (
    is_instructor()
    AND instructor_id = instructor_id_for_current_user()
  );

-- ── 5. RLS: instructores pueden ver bookings de sus propias clases ────────────
DROP POLICY IF EXISTS "bookings_select_instructor" ON bookings;
CREATE POLICY "bookings_select_instructor"
  ON bookings FOR SELECT
  USING (
    is_instructor()
    AND class_id IN (
      SELECT id FROM classes
      WHERE instructor_id = instructor_id_for_current_user()
    )
  );

-- ── 6. Seed emails para instructores existentes (ajustar según necesidad) ─────
-- IMPORTANT: Actualizar con los emails reales de cada instructor.
-- Ejemplo:
-- UPDATE instructors SET email = 'nancy@houseofshakti.com' WHERE name = 'Nancy Goodfellow';
-- UPDATE instructors SET email = 'antonia@houseofshakti.com' WHERE name = 'Antonia Paz';
-- UPDATE instructors SET email = 'gabriella@houseofshakti.com' WHERE name = 'Gabriella';
