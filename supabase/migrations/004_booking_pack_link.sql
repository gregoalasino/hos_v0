-- ─────────────────────────────────────────────────────────────────────────────
-- Link a booking to the pack purchase that paid for it.
-- Used by the "buy a pack from the booking flow" path: the customer buys a pack
-- via Tilopay and, on payment confirmation, one credit is consumed to confirm
-- this specific booking (the class becomes free, upsells are charged separately).
-- Also stores the Tilopay transaction id on bookings for reconciliation.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS pack_purchase_id uuid REFERENCES pack_purchases(id),
  ADD COLUMN IF NOT EXISTS tilopay_transaction text;

CREATE INDEX IF NOT EXISTS bookings_pack_purchase_idx ON bookings (pack_purchase_id);
