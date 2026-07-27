'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Smartphone, ExternalLink } from 'lucide-react';
import { VENMO_HANDLE, venmoProfileUrl } from '@/lib/payment-methods';

type Props = {
  open: boolean;
  amount: number;
  note: string; // shown as the note the customer should add (their name)
  isLoading: boolean;
  onPaid: () => void;
  onCancel: () => void;
};

/**
 * Venmo payment modal — shown when the customer chooses to pay by Venmo.
 * Displays the receiving account details, then asks the customer to confirm.
 *
 * IMPORTANT: "I've paid" does NOT mark the booking as paid. It only creates the
 * booking as *pending* and shows the confirmation. The admin validates the real
 * payment in /admin/reservas. "Cancel" creates nothing.
 */
export function VenmoModal({ open, amount, note, isLoading, onPaid, onCancel }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={isLoading ? undefined : onCancel}
            className="fixed inset-0 z-50 bg-ink/40"
          />

          {/* Card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Pay with Venmo"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto w-full max-w-md bg-warm-white border border-ink/10 shadow-xl"
            >
              {/* Top bar */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-ink/10">
                <span className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.25em] uppercase text-ink">
                  <Smartphone width={14} height={14} strokeWidth={1.5} />
                  Pay with Venmo
                </span>
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  aria-label="Close"
                  className="p-1.5 text-ink hover:opacity-70 transition-opacity duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <X width={18} height={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6">
                <p className="font-body text-sm text-ink leading-relaxed">
                  Send your payment on Venmo to the account below, then confirm. Your spot is
                  held as <span className="font-medium">pending</span> until we verify the payment.
                </p>

                {/* Account + amount */}
                <div className="mt-6 border-y border-ink/10 divide-y divide-ink/10">
                  <div className="flex items-center justify-between py-4">
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50">
                      Venmo account
                    </span>
                    <span className="font-body text-sm font-medium text-ink">{VENMO_HANDLE}</span>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50">
                      Amount
                    </span>
                    <span className="font-display font-light text-ink text-xl">${amount} USD</span>
                  </div>
                  <div className="flex items-center justify-between py-4 gap-4">
                    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-ink/50 flex-shrink-0">
                      Add to note
                    </span>
                    <span className="font-body text-sm text-ink text-right truncate">{note}</span>
                  </div>
                </div>

                {/* Open Venmo */}
                <a
                  href={venmoProfileUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 font-body text-xs tracking-[0.15em] uppercase text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-200 cursor-pointer"
                >
                  <ExternalLink width={14} height={14} strokeWidth={1.5} />
                  Open Venmo
                </a>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onPaid}
                    disabled={isLoading}
                    className="
                      bg-dark text-cream px-7 py-3
                      font-body text-sm font-medium
                      hover:bg-burgundy transition-colors duration-300
                      cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
                      inline-flex items-center gap-2
                    "
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                    ) : (
                      "I've paid"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
