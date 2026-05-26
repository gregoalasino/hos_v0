'use client';

import { Loader2 } from 'lucide-react';

type Props = {
  step: number; // 1..4
  isLoading: boolean;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
};

/**
 * Bottom navigation row of every step's main content area.
 * - "Back" link on the left (hidden on step 1)
 * - "Continue" / "Confirm and pay" button on the right
 */
export function BookingNavigation({
  step, isLoading, canContinue, onBack, onContinue,
}: Props) {
  const isPay = step === 4;
  const showBack = step > 1;

  const continueLabel = isPay
    ? 'Confirm and pay'
    : 'Continue';

  return (
    <div className="mt-16 lg:mt-24 pt-8 border-t border-ink/10 flex justify-between items-center">
      <div>
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!canContinue || isLoading}
        className="
          bg-dark text-cream
          px-7 sm:px-10 py-3
          font-body text-sm font-medium
          hover:bg-burgundy transition-colors duration-300
          cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed
          inline-flex items-center gap-2
        "
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
        ) : (
          continueLabel
        )}
      </button>
    </div>
  );
}
