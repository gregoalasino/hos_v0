-- ─────────────────────────────────────────────────────────────────────────────
-- House of Shakti — Initial Schema
-- Costa Rica timezone: UTC-6 (no DST). All timestamps stored in UTC.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Helper: is_admin ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
    false
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ── Table: instructors ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instructors (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  bio        text,
  photo_url  text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "instructors_select_public"
  ON instructors FOR SELECT USING (true);
CREATE POLICY "instructors_insert_admin"
  ON instructors FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "instructors_update_admin"
  ON instructors FOR UPDATE USING (is_admin());
CREATE POLICY "instructors_delete_admin"
  ON instructors FOR DELETE USING (is_admin());

-- Seed instructors
INSERT INTO instructors (name) VALUES
  ('Nancy Goodfellow'),
  ('Antonia Paz'),
  ('Gabriella');

-- ── Table: class_templates ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS class_templates (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text        NOT NULL,
  slug             text        UNIQUE NOT NULL,
  description      text,
  instructor_id    uuid        REFERENCES instructors(id),
  day_of_week      integer     NOT NULL, -- 0=Sun … 6=Sat
  time_start       text        NOT NULL, -- "HH:MM" local CR time (UTC-6)
  duration_minutes integer     NOT NULL DEFAULT 90,
  capacity         integer     NOT NULL DEFAULT 20,
  location         text        NOT NULL DEFAULT 'Open-Air Shala',
  color            text,
  is_active        boolean     DEFAULT true,
  created_at       timestamptz DEFAULT now()
);

ALTER TABLE class_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "class_templates_select_public"
  ON class_templates FOR SELECT USING (true);
CREATE POLICY "class_templates_insert_admin"
  ON class_templates FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "class_templates_update_admin"
  ON class_templates FOR UPDATE USING (is_admin());
CREATE POLICY "class_templates_delete_admin"
  ON class_templates FOR DELETE USING (is_admin());

-- Seed class_templates
INSERT INTO class_templates (name, slug, instructor_id, day_of_week, time_start, color, description)
SELECT
  'Detox Yoga',
  'detox-yoga',
  id,
  1, -- Monday
  '10:00',
  '#4a7c59',
  'A detoxifying yoga practice to cleanse body and mind.'
FROM instructors WHERE name = 'Nancy Goodfellow';

INSERT INTO class_templates (name, slug, instructor_id, day_of_week, time_start, color, description)
SELECT
  'Vinyasa Krama',
  'vinyasa-krama-tue',
  id,
  2, -- Tuesday
  '10:00',
  '#6baed6',
  'A progressive Vinyasa practice linking breath and movement.'
FROM instructors WHERE name = 'Antonia Paz';

INSERT INTO class_templates (name, slug, instructor_id, day_of_week, time_start, color, description)
SELECT
  'Vinyasa Krama',
  'vinyasa-krama-thu',
  id,
  4, -- Thursday
  '10:00',
  '#6baed6',
  'A progressive Vinyasa practice linking breath and movement.'
FROM instructors WHERE name = 'Antonia Paz';

INSERT INTO class_templates (name, slug, instructor_id, day_of_week, time_start, color, description)
SELECT
  'Tantra Vinyasa',
  'tantra-vinyasa-wed',
  id,
  3, -- Wednesday
  '10:00',
  '#8b6bb8',
  'A sacred Tantra Vinyasa flow awakening deeper energies.'
FROM instructors WHERE name = 'Nancy Goodfellow';

INSERT INTO class_templates (name, slug, instructor_id, day_of_week, time_start, color, description)
SELECT
  'Tantra Vinyasa',
  'tantra-vinyasa-fri',
  id,
  5, -- Friday
  '10:00',
  '#8b6bb8',
  'A sacred Tantra Vinyasa flow awakening deeper energies.'
FROM instructors WHERE name = 'Nancy Goodfellow';

INSERT INTO class_templates (name, slug, instructor_id, day_of_week, time_start, color, description)
SELECT
  'Deep Stretch & Breath',
  'deep-stretch-breath',
  id,
  6, -- Saturday
  '10:00',
  '#c4622d',
  'Deep stretching combined with conscious breathwork.'
FROM instructors WHERE name = 'Nancy Goodfellow';

INSERT INTO class_templates (name, slug, instructor_id, day_of_week, time_start, color, description)
SELECT
  'Vinyasa Flow',
  'vinyasa-flow',
  id,
  0, -- Sunday
  '10:00',
  '#e07b39',
  'A dynamic Vinyasa flow class for all levels.'
FROM instructors WHERE name = 'Gabriella';

-- ── Table: classes ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id               uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id      uuid          REFERENCES class_templates(id),
  instructor_id    uuid          REFERENCES instructors(id),
  name             text          NOT NULL,
  slug             text          NOT NULL,
  description      text,
  starts_at        timestamptz   NOT NULL,
  duration_minutes integer       NOT NULL DEFAULT 90,
  capacity         integer       NOT NULL DEFAULT 20,
  spots_remaining  integer       NOT NULL DEFAULT 20,
  price_dropin_usd numeric(10,2) NOT NULL DEFAULT 20.00,
  location         text          NOT NULL DEFAULT 'Open-Air Shala',
  color            text,
  is_active        boolean       DEFAULT true,
  created_at       timestamptz   DEFAULT now(),
  CONSTRAINT spots_non_negative CHECK (spots_remaining >= 0),
  CONSTRAINT spots_within_capacity CHECK (spots_remaining <= capacity)
);

ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "classes_select_public"
  ON classes FOR SELECT
  USING (is_active = true OR is_admin());
CREATE POLICY "classes_insert_admin"
  ON classes FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "classes_update_admin"
  ON classes FOR UPDATE USING (is_admin());
CREATE POLICY "classes_delete_admin"
  ON classes FOR DELETE USING (is_admin());

-- ── Table: class_packs ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS class_packs (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text          NOT NULL,
  classes_count integer       NOT NULL,
  price_usd     numeric(10,2) NOT NULL,
  is_active     boolean       DEFAULT true,
  created_at    timestamptz   DEFAULT now()
);

ALTER TABLE class_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "class_packs_select_public"
  ON class_packs FOR SELECT USING (true);
CREATE POLICY "class_packs_insert_admin"
  ON class_packs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "class_packs_update_admin"
  ON class_packs FOR UPDATE USING (is_admin());
CREATE POLICY "class_packs_delete_admin"
  ON class_packs FOR DELETE USING (is_admin());

INSERT INTO class_packs (name, classes_count, price_usd) VALUES
  ('Drop-in',  1,  20.00),
  ('Pack x5',  5,  75.00),
  ('Pack x10', 10, 130.00);

-- ── Table: upsells ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS upsells (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text          NOT NULL,
  description text,
  price_usd   numeric(10,2) NOT NULL DEFAULT 0,
  is_active   boolean       DEFAULT true,
  created_at  timestamptz   DEFAULT now()
);

ALTER TABLE upsells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "upsells_select_public"
  ON upsells FOR SELECT
  USING (is_active = true OR is_admin());
CREATE POLICY "upsells_insert_admin"
  ON upsells FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "upsells_update_admin"
  ON upsells FOR UPDATE USING (is_admin());
CREATE POLICY "upsells_delete_admin"
  ON upsells FOR DELETE USING (is_admin());

INSERT INTO upsells (name, description, price_usd, is_active) VALUES
  (
    'Ice Bath & Sauna',
    'Contrast therapy session — ice bath and sauna access',
    0.00,
    true
  );

-- ── Table: bookings ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id          uuid          REFERENCES classes(id) NOT NULL,
  first_name        text          NOT NULL,
  last_name         text          NOT NULL,
  email             text          NOT NULL,
  phone             text,
  persons           integer       NOT NULL DEFAULT 1,
  upsell_ids        uuid[]        DEFAULT '{}',
  payment_status    text          NOT NULL DEFAULT 'pending'
                    CONSTRAINT booking_status_check CHECK (
                      payment_status IN ('pending','confirmed','cancelled','no-show')
                    ),
  pack_type         text,         -- 'dropin' | 'pack5' | 'pack10' | null
  booking_reference text          UNIQUE NOT NULL,
  referral_code     text,
  is_hotel_guest    boolean       DEFAULT false,
  cloudbeds_ref     text,
  total_usd         numeric(10,2),
  notes             text,
  created_at        timestamptz   DEFAULT now(),
  updated_at        timestamptz   DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select_admin"
  ON bookings FOR SELECT USING (is_admin());
CREATE POLICY "bookings_insert_public"
  ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_update_admin"
  ON bookings FOR UPDATE USING (is_admin());
CREATE POLICY "bookings_delete_admin"
  ON bookings FOR DELETE USING (is_admin());

-- ── Table: referral_codes ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referral_codes (
  id               uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text          UNIQUE NOT NULL,
  partner_name     text          NOT NULL,
  description      text,
  benefit_type     text          NOT NULL
                   CONSTRAINT benefit_type_check CHECK (
                     benefit_type IN ('percentage','fixed','free_upsell')
                   ),
  discount_percent numeric(5,2),
  discount_fixed   numeric(10,2),
  free_upsell_id   uuid          REFERENCES upsells(id),
  is_active        boolean       DEFAULT true,
  usage_limit      integer,      -- null = unlimited
  usage_count      integer       DEFAULT 0,
  valid_from       timestamptz,
  valid_until      timestamptz,
  min_purchase_usd numeric(10,2) DEFAULT 0,
  created_at       timestamptz   DEFAULT now()
);

ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "referral_codes_select_public"
  ON referral_codes FOR SELECT USING (true);
CREATE POLICY "referral_codes_insert_admin"
  ON referral_codes FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "referral_codes_update_admin"
  ON referral_codes FOR UPDATE USING (is_admin());
CREATE POLICY "referral_codes_delete_admin"
  ON referral_codes FOR DELETE USING (is_admin());

-- ── Table: retreat_submissions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS retreat_submissions (
  id            uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  retreat_name  text    NOT NULL,
  retreat_slug  text,
  first_name    text    NOT NULL,
  last_name     text    NOT NULL,
  email         text    NOT NULL,
  phone         text,
  selected_date text,
  participants  integer DEFAULT 1,
  message       text,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE retreat_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "retreat_submissions_select_admin"
  ON retreat_submissions FOR SELECT USING (is_admin());
CREATE POLICY "retreat_submissions_insert_public"
  ON retreat_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "retreat_submissions_update_admin"
  ON retreat_submissions FOR UPDATE USING (is_admin());
CREATE POLICY "retreat_submissions_delete_admin"
  ON retreat_submissions FOR DELETE USING (is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- RPC Functions
-- ─────────────────────────────────────────────────────────────────────────────

-- ── decrement_spots ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION decrement_spots(p_class_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_spots integer;
BEGIN
  SELECT spots_remaining INTO v_spots
  FROM classes
  WHERE id = p_class_id
  FOR UPDATE;

  IF v_spots IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'class_not_found');
  END IF;

  IF v_spots <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'no_spots_available');
  END IF;

  UPDATE classes
  SET spots_remaining = spots_remaining - 1
  WHERE id = p_class_id;

  RETURN json_build_object('success', true, 'spots_remaining', v_spots - 1);
END;
$$;

-- ── increment_spots ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_spots(p_class_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_row classes%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM classes WHERE id = p_class_id FOR UPDATE;

  IF v_row.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'class_not_found');
  END IF;

  IF v_row.spots_remaining >= v_row.capacity THEN
    RETURN json_build_object('success', true,
      'spots_remaining', v_row.spots_remaining);
  END IF;

  UPDATE classes
  SET spots_remaining = spots_remaining + 1
  WHERE id = p_class_id;

  RETURN json_build_object('success', true,
    'spots_remaining', v_row.spots_remaining + 1);
END;
$$;

-- ── generate_booking_reference ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_date text;
  v_ref  text;
  v_exists boolean;
BEGIN
  v_date := to_char(now(), 'YYYYMMDD');
  LOOP
    v_ref := 'HOS-' || v_date || '-' ||
      upper(substring(md5(random()::text) from 1 for 4));
    SELECT EXISTS (
      SELECT 1 FROM bookings WHERE booking_reference = v_ref
    ) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_ref;
END;
$$;

-- ── generate_week_classes ─────────────────────────────────────────────────────
-- p_week_start must be the Monday of the target week
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
        v_template.capacity, 20.00,
        v_template.location, v_template.color, true
      );
      v_count := v_count + 1;
    END IF;
  END LOOP;

  RETURN v_count;
END;
$$;
