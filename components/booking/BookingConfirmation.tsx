'use client';

import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Upsell, ReferralCode } from '@/types';
import { paymentInstructions } from '@/lib/payment-methods';

// Word-by-word reveal — same easing as the home Introduction headline
const headlineContainer: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const HEADLINE = 'Your practice awaits.';

type Props = {
  bookingRef: string;
  onDownloadICS: () => void;
  // Receipt data
  className: string;
  instructor: string;
  classDate: Date;
  durationMinutes: number;
  location: string;
  priceUsd: number;
  isFree: boolean;
  selectedUpsells: Upsell[];
  appliedCode: ReferralCode | null;
  discountAmount: number;
  total: number;
  email?: string;
  // Set when the customer chose Cash/Venmo: the spot is held but payment is
  // still pending and collected in person. null for card/free bookings.
  pendingMethod?: 'cash' | 'venmo' | null;
};

/**
 * Confirmation screen — editorial receipt.
 * No imagery, no full-bleed; just a centered column with hairlines.
 */
export function BookingConfirmation({
  bookingRef, onDownloadICS,
  className, instructor, classDate, durationMinutes, location,
  priceUsd, isFree, selectedUpsells, appliedCode, discountAmount, total, email,
  pendingMethod = null,
}: Props) {
  const router = useRouter();

  const endTime = new Date(classDate.getTime() + durationMinutes * 60000);
  const dateStr =
    format(classDate, 'EEEE, MMMM d yyyy');
  const timeStr = `${format(classDate, 'HH:mm')} — ${format(endTime, 'HH:mm')}`;
  const isTotalFree = total === 0;
  const isPending = pendingMethod !== null;

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-16 lg:py-24">
      {/* Header */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
        >
          {isPending ? 'Reserved' : 'Confirmed'}
        </motion.p>

        <motion.h1
          variants={headlineContainer}
          initial="hidden"
          animate="visible"
          aria-label={HEADLINE}
          className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mt-6"
        >
          {HEADLINE.split(' ').map((word, i, arr) => (
            <span
              key={`${word}-${i}`}
              aria-hidden
              className="inline-block overflow-hidden align-baseline"
            >
              <motion.span variants={headlineWord} className="inline-block will-change-transform">
                {word}
                {i < arr.length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </motion.h1>
      </div>

      {/* Receipt body */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
      >
        {/* Reference */}
        <div className="mt-14 pt-10 border-t border-ink/15 text-center">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink">
            Booking reference
          </p>
          <p className="font-display font-light text-ink text-2xl md:text-3xl mt-3 tracking-[0.08em]">
            {bookingRef}
          </p>
        </div>

        {/* Class details */}
        <div className="mt-10 pt-10 border-t border-ink/15 space-y-3">
          <ReceiptRow label="Class" value={className} />
          <ReceiptRow label="Instructor" value={instructor} />
          <ReceiptRow label="Date" value={dateStr} />
          <ReceiptRow label="Time" value={timeStr} />
          <ReceiptRow
            label="Duration"
            value={`${durationMinutes} minutes`}
          />
          <ReceiptRow label="Location" value={location} />
        </div>

        {/* Price breakdown */}
        <div className="mt-10 pt-10 border-t border-ink/15 space-y-3">
          <ReceiptRow
            label="Class"
            value={isFree ? 'Free' : `$${priceUsd}`}
          />
          {selectedUpsells.map((u) => (
            <ReceiptRow
              key={u.id}
              label={u.name}
              value={u.priceUsd === 0 ? 'Included' : `+$${u.priceUsd}`}
            />
          ))}
          {appliedCode && discountAmount > 0 && (
            <ReceiptRow
              label={`Code ${appliedCode.code}`}
              value={`−$${discountAmount}`}
              tone="burgundy"
            />
          )}
        </div>

        {/* Total */}
        <div className="mt-8 pt-6 border-t border-ink/30 flex justify-between items-baseline">
          <span className="font-body text-sm tracking-[0.1em] uppercase text-ink">
            {isPending ? 'Amount due' : 'Total'}
          </span>
          <span className="font-display font-light text-ink text-2xl md:text-3xl">
            {isTotalFree ? 'Free' : `$${total}`}
          </span>
        </div>

        {/* Payment instructions — cash / Venmo */}
        {isPending && (
          <div className="mt-10 pt-8 border-t border-ink/15">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy">
              {pendingMethod === 'venmo' ? 'Pay with Venmo' : 'Pay in cash'}
            </p>
            <p className="font-body text-sm text-ink leading-relaxed mt-3">
              {paymentInstructions(pendingMethod)}
            </p>
          </div>
        )}
      </motion.div>

      {/* Email confirmation note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: 0.6 }}
        className="font-body text-sm text-ink text-center mt-16"
      >
        {email
          ? `We've sent the details to ${email}.`
          : "We've sent the details to your email."}
        {isPending && ' Keep your booking reference handy for payment.'}
      </motion.p>

      {/* Quicklinks */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: 'easeOut', delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-10"
      >
        <button
          type="button"
          onClick={onDownloadICS}
          className="inline-flex items-center gap-2 font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
        >
          <Calendar className="w-4 h-4" strokeWidth={1.5} />
          Add to calendar
        </button>

        <button
          type="button"
          onClick={() => router.push('/yoga')}
          className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
        >
          Back to classes
        </button>
      </motion.div>
    </div>
  );
}

function ReceiptRow({
  label, value, tone,
}: { label: string; value: string; tone?: 'burgundy' }) {
  const colorClass = tone === 'burgundy' ? 'text-burgundy' : 'text-ink';
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className={`font-body text-sm ${colorClass}`}>{label}</span>
      <span className={`font-body text-sm text-right ${colorClass}`}>{value}</span>
    </div>
  );
}
