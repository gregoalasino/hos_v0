'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { X } from 'lucide-react';

type Props = {
  step: number; // 1–5 (5 = confirmation)
  totalSteps: number; // 4 actionable steps
  isConfirmation: boolean;
};

/**
 * Sticky top bar across the booking flow.
 * Left: close button (→ /yoga). Center: HOS logo (→ /). Right: step indicator
 * (number + segmented dashes). On the confirmation screen the indicator is
 * replaced by a subtle "Booked" label.
 */
export function BookingHeader({ step, totalSteps, isConfirmation }: Props) {
  const t = useTranslations('booking.header');
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-warm-white border-b border-ink/10">
      <div className="h-14 lg:h-16 px-6 lg:px-12 flex items-center justify-between">
        {/* LEFT — close */}
        <button
          onClick={() => router.push('/yoga')}
          className="p-2 -ml-2 text-ink hover:opacity-70 transition-opacity duration-300 cursor-pointer"
          aria-label={t('close')}
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* CENTER — logo */}
        <button
          onClick={() => router.push('/')}
          className="font-display font-light text-ink text-lg lg:text-xl hover:opacity-80 transition-opacity duration-300 cursor-pointer"
        >
          <span className="hidden sm:inline">House of Shakti</span>
          <span className="sm:hidden">HOS</span>
        </button>

        {/* RIGHT — step indicator (or Booked label on confirmation) */}
        {isConfirmation ? (
          <span className="font-body text-xs tracking-[0.25em] uppercase text-ink">
            {t('booked')}
          </span>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-body text-xs tracking-[0.1em] text-ink">
              {t('stepOf', { step, total: totalSteps })}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => {
                const n = i + 1;
                const state =
                  n === step ? 'bg-ink' :
                  n < step ? 'bg-ink/40' : 'bg-ink/15';
                return <span key={i} className={`w-6 h-[1px] ${state}`} aria-hidden />;
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
