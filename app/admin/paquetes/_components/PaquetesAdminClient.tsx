'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Check, Mail, X, Copy, CalendarClock } from 'lucide-react';
import type { PackPurchase } from '@/lib/queries/packs';
import type { LinkedPendingBooking } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { Badge } from '@/components/admin/Badge';
import { EmptyState } from '@/components/admin/EmptyState';
import { Modal } from '@/components/admin/Modal';
import { Button } from '@/components/admin/Button';
import { confirmPackPayment, resendPackCode, cancelPackPurchase } from '@/app/actions/packs';
import { confirmBooking } from '@/app/actions/bookings';

export default function PaquetesAdminClient({ purchases }: { purchases: PackPurchase[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Reminder shown after confirming a pack that still has a pending class
  // booking (cash/Venmo) — prompts the admin to confirm that booking too.
  const [reminder, setReminder] = useState<LinkedPendingBooking | null>(null);
  const [confirmingBooking, setConfirmingBooking] = useState(false);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function handleConfirm(id: string) {
    setBusyId(id);
    startTransition(async () => {
      const res = await confirmPackPayment(id);
      setBusyId(null);
      if (res.ok) {
        flash(
          res.emailSent
            ? `Payment confirmed — code ${res.code} emailed.`
            : `Payment confirmed — code ${res.code}. Email not sent (configure RESEND_API_KEY, then resend).`,
        );
        router.refresh();
        // If this pack was bought together with a class booking that's still
        // pending, remind the admin to confirm it so a credit is redeemed.
        if (res.linkedBooking) setReminder(res.linkedBooking);
      } else {
        flash('Could not confirm payment.');
      }
    });
  }

  function handleConfirmLinkedBooking() {
    if (!reminder) return;
    setConfirmingBooking(true);
    startTransition(async () => {
      await confirmBooking(reminder.id);
      setConfirmingBooking(false);
      setReminder(null);
      flash('Class booking confirmed — pack credit redeemed.');
      router.refresh();
    });
  }

  function handleResend(id: string) {
    setBusyId(id);
    startTransition(async () => {
      const res = await resendPackCode(id);
      setBusyId(null);
      flash(res.ok && res.emailSent ? 'Code email resent.' : 'Email not sent (check RESEND_API_KEY).');
    });
  }

  function handleCancel(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await cancelPackPurchase(id);
      setBusyId(null);
      router.refresh();
    });
  }

  const pendingCount = purchases.filter((p) => p.status === 'pending').length;

  return (
    <div className="px-6 lg:px-10 py-8 lg:py-10 max-w-6xl mx-auto">
      <PageHeader
        heading="Class packs"
        description={`${purchases.length} purchases · ${pendingCount} awaiting payment`}
      />

      {toast && (
        <div className="mb-6 px-4 py-3 bg-neutral-50 border border-ink/15 font-body text-sm text-ink">
          {toast}
        </div>
      )}

      {purchases.length === 0 ? (
        <EmptyState
          icon={<Package strokeWidth={1} />}
          heading="No pack purchases yet"
          description="When a customer buys a class pack at /paquetes, it appears here for you to confirm payment and issue the code."
        />
      ) : (
        <div className="bg-white border border-ink/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-ink/10">
                  {['Customer', 'Pack', 'Code', 'Usage', 'Amount', 'Status', 'Actions'].map(
                    (h, i) => (
                      <th
                        key={i}
                        className="text-left px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase font-medium text-ink/50"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-ink/[0.08] last:border-0 hover:bg-neutral-50 transition-colors duration-200 align-middle"
                  >
                    <td className="px-4 py-4">
                      <p className="font-body text-sm font-medium text-ink">
                        {p.firstName} {p.lastName}
                      </p>
                      <p className="font-body text-xs text-ink/50 mt-0.5">{p.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-body text-sm text-ink">{p.packName}</span>
                    </td>
                    <td className="px-4 py-4">
                      {p.code ? (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(p.code!);
                            flash(`Copied ${p.code}`);
                          }}
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-ink bg-neutral-50 px-2 py-1 hover:bg-neutral-50 transition-colors cursor-pointer"
                          title="Copy code"
                        >
                          {p.code}
                          <Copy width={12} height={12} strokeWidth={1.5} className="text-ink/40" />
                        </button>
                      ) : (
                        <span className="font-body text-sm text-ink/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-body text-sm text-ink">
                        {p.classesUsed}
                        <span className="text-ink/50">/{p.classesTotal}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-body text-sm text-ink">
                        {p.amountUsd != null ? `$${p.amountUsd}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        variant={
                          p.status === 'paid'
                            ? 'active'
                            : p.status === 'pending'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {p.status === 'paid'
                          ? 'Paid'
                          : p.status === 'pending'
                          ? 'Pending payment'
                          : 'Cancelled'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {p.status === 'pending' && (
                          <>
                            <ActionButton
                              onClick={() => handleConfirm(p.id)}
                              disabled={isPending && busyId === p.id}
                              icon={<Check width={14} height={14} strokeWidth={1.5} />}
                              label="Confirm payment"
                            />
                            <IconButton
                              onClick={() => handleCancel(p.id)}
                              disabled={isPending && busyId === p.id}
                              ariaLabel="Cancel"
                              hoverDestructive
                            >
                              <X width={15} height={15} strokeWidth={1.5} />
                            </IconButton>
                          </>
                        )}
                        {p.status === 'paid' && (
                          <ActionButton
                            onClick={() => handleResend(p.id)}
                            disabled={isPending && busyId === p.id}
                            icon={<Mail width={14} height={14} strokeWidth={1.5} />}
                            label="Resend email"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Reminder: confirm the linked class booking ─────────────────────── */}
      <Modal
        isOpen={!!reminder}
        onClose={() => setReminder(null)}
        title="One more step — confirm the class booking"
        subtitle="This pack was bought together with a class reservation."
        footer={
          <>
            <Button variant="secondary" onClick={() => setReminder(null)} disabled={confirmingBooking}>
              I&apos;ll do it later
            </Button>
            <Button
              variant="primary"
              icon={<Check width={16} height={16} strokeWidth={1.5} />}
              onClick={handleConfirmLinkedBooking}
              loading={confirmingBooking}
            >
              Confirm booking now
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-neutral-50 border border-ink/10">
            <CalendarClock width={18} height={18} strokeWidth={1.5} className="text-ink/50 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="font-body text-sm font-medium text-ink">{reminder?.className}</p>
              <p className="font-mono text-xs text-ink/60 mt-1">{reminder?.reference}</p>
            </div>
          </div>
          <p className="font-body text-sm text-ink/70 leading-relaxed">
            The class reservation paid with this pack is still <strong>pending</strong>. Confirm it
            so the pack registers its first use (e.g. 1/5) and the student&apos;s spot is secured.
          </p>
          <p className="font-body text-xs text-ink/50 leading-relaxed">
            Card payments (Tilopay) confirm this automatically. Cash and Venmo need your confirmation
            — otherwise the pack keeps showing 0 uses and the booking stays pending in Bookings.
          </p>
        </div>
      </Modal>
    </div>
  );
}

function ActionButton({
  onClick,
  disabled,
  icon,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink/20 font-body text-xs text-ink hover:bg-neutral-50 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {icon}
      {label}
    </button>
  );
}

function IconButton({
  children,
  onClick,
  ariaLabel,
  disabled,
  hoverDestructive = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  disabled?: boolean;
  hoverDestructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`w-8 h-8 p-1.5 inline-flex items-center justify-center text-ink/60 hover:bg-neutral-50 ${
        hoverDestructive ? 'hover:text-burgundy' : 'hover:text-ink'
      } transition-colors duration-200 cursor-pointer disabled:opacity-40`}
    >
      {children}
    </button>
  );
}
