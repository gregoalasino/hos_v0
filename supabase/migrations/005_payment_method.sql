-- ─────────────────────────────────────────────────────────────────────────────
-- Payment method on bookings and pack purchases.
-- Until now every checkout went through Tilopay (card). We now let the customer
-- pay a class or a pack in person via Cash or Venmo. Those orders skip the
-- gateway and are created as 'pending'; the admin later marks them collected
-- (payment_status = 'confirmed') from /admin/reservas.
--   card  → paid online via Tilopay (existing flow)
--   cash  → pay in person at reception
--   venmo → pay via Venmo, confirmed manually by the admin
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'card'
    CONSTRAINT booking_payment_method_check
    CHECK (payment_method IN ('card', 'cash', 'venmo'));

ALTER TABLE pack_purchases
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'card'
    CONSTRAINT pack_payment_method_check
    CHECK (payment_method IN ('card', 'cash', 'venmo'));
