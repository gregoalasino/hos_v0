-- ─────────────────────────────────────────────────────────────────────────────
-- House of Shakti — Class packs & redemption codes
-- A client buys a pack (x5 / x10 / x20). Once paid, a personal code is generated
-- and emailed. The customer redeems it when booking future classes: each booking
-- with the code makes the class free (upsells still charged) and consumes one use.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Add the x20 pack (x5 / x10 already seeded in 001) ────────────────────────
INSERT INTO class_packs (name, classes_count, price_usd)
SELECT 'Pack x20', 20, 240.00
WHERE NOT EXISTS (SELECT 1 FROM class_packs WHERE classes_count = 20);

-- ── Table: pack_purchases ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pack_purchases (
  id            uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id       uuid          REFERENCES class_packs(id),
  first_name    text          NOT NULL,
  last_name     text          NOT NULL,
  email         text          NOT NULL,
  phone         text,
  code          text          UNIQUE,
  classes_total integer       NOT NULL,
  classes_used  integer       NOT NULL DEFAULT 0,
  status        text          NOT NULL DEFAULT 'pending'
                CONSTRAINT pack_status_check CHECK (status IN ('pending','paid','cancelled')),
  amount_usd    numeric(10,2),
  created_at    timestamptz   DEFAULT now(),
  paid_at       timestamptz,
  CONSTRAINT pack_used_non_negative CHECK (classes_used >= 0),
  CONSTRAINT pack_used_within_total CHECK (classes_used <= classes_total)
);

ALTER TABLE pack_purchases ENABLE ROW LEVEL SECURITY;

-- Anyone can start a purchase (status stays 'pending' until payment is confirmed).
CREATE POLICY "pack_purchases_insert_public"
  ON pack_purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "pack_purchases_select_admin"
  ON pack_purchases FOR SELECT USING (is_admin());
CREATE POLICY "pack_purchases_update_admin"
  ON pack_purchases FOR UPDATE USING (is_admin());
CREATE POLICY "pack_purchases_delete_admin"
  ON pack_purchases FOR DELETE USING (is_admin());

CREATE INDEX IF NOT EXISTS pack_purchases_code_idx ON pack_purchases (code);
CREATE INDEX IF NOT EXISTS pack_purchases_email_idx ON pack_purchases (email);

-- ── generate_pack_code ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION generate_pack_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_code   text;
  v_exists boolean;
BEGIN
  LOOP
    v_code := 'PACK-' || upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS (
      SELECT 1 FROM pack_purchases WHERE code = v_code
    ) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_code;
END;
$$;

-- ── redeem_pack_code ─────────────────────────────────────────────────────────
-- Atomically validates a paid pack with uses remaining and consumes one use.
CREATE OR REPLACE FUNCTION redeem_pack_code(p_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_row pack_purchases%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM pack_purchases
  WHERE code = upper(trim(p_code))
  FOR UPDATE;

  IF v_row.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'not_found');
  END IF;
  IF v_row.status <> 'paid' THEN
    RETURN json_build_object('success', false, 'error', 'not_paid');
  END IF;
  IF v_row.classes_used >= v_row.classes_total THEN
    RETURN json_build_object('success', false, 'error', 'exhausted');
  END IF;

  UPDATE pack_purchases
  SET classes_used = classes_used + 1
  WHERE id = v_row.id;

  RETURN json_build_object(
    'success', true,
    'remaining', v_row.classes_total - v_row.classes_used - 1
  );
END;
$$;
