'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type Props = {
  className: string;
  total: number;
  isFree: boolean;
  children: ReactNode; // the BookingSummary rendered inside, in `bare` mode
};

/**
 * Mobile-only collapsible summary that lives directly under the top bar.
 * Tapping the row expands/collapses the full summary content (passed as children).
 */
export function BookingMobileSummary({
  className, total, isFree, children,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden bg-cream border-b border-ink/10">
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full px-6 py-3 flex justify-between items-center cursor-pointer hover:bg-ink/[0.02] transition-colors duration-300"
        aria-expanded={isExpanded}
      >
        <span className="font-body text-sm text-ink truncate pr-3">
          {isFree ? 'Free' : `$${total}`} — {className}
        </span>
        <span className="flex items-center gap-2 flex-shrink-0">
          <span className="font-body text-xs text-ink">
            {isExpanded
              ? 'Hide'
              : 'View details'}
          </span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="inline-flex"
          >
            <ChevronDown className="w-4 h-4 text-ink" strokeWidth={1.5} />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
