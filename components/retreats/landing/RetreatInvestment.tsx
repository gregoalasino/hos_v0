'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { intlTag } from '@/lib/dates';
import type { Retreat } from '@/lib/retreats';

function formatPrice(amount: number): string {
  // "$1,100 USD" — the same figure in both languages; prices are quoted in USD.
  return `$${amount.toLocaleString('en-US')} USD`;
}

function formatExpiresAt(iso: string, tag: string): string {
  // "June 1, 2026" / "1 de junio de 2026"
  const d = new Date(iso);
  return d.toLocaleDateString(tag, { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Computes whole days remaining between `now` and `expiresAt`.
 * Returns a value <= 0 once the deadline has passed.
 */
function daysUntil(expiresAtISO: string): number {
  const expires = new Date(expiresAtISO).getTime();
  const now = Date.now();
  const ms = expires - now;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function RetreatInvestment({ retreat }: { retreat: Retreat }) {
  const t = useTranslations('retreatLanding.investment');
  const tag = intlTag(useLocale());
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const { pricing } = retreat;
  const eb = pricing.earlyBird;

  // Compute remaining days on client-only so static export stays stable.
  // Once mounted, the value is accurate to the day.
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (eb?.enabled) setRemaining(daysUntil(eb.expiresAt));
  }, [eb?.enabled, eb?.expiresAt]);

  // Early Bird visible only while enabled AND not expired (days remaining > 0,
  // or === 0 → still show with "Last day").
  const showEarlyBird = !!eb?.enabled && (remaining === null || remaining >= 0);

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] max-w-5xl mx-auto">
        {/* Header — eyebrow intentionally omitted for cleaner framing */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="mb-16 lg:mb-20"
        >
          <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
            {t('heading')}
          </h2>
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
          className={`grid ${showEarlyBird ? 'md:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'} gap-8 lg:gap-12`}
        >
          {/* Early Bird — burgundy stamp. Stands out tonally without breaking
              the editorial palette: same typography, inverted color values. */}
          {showEarlyBird && eb && (
            <article data-surface="dark" className="bg-burgundy text-cream p-8 lg:p-10">
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream">
                {t('earlyBird')}
              </p>
              <p className="font-body text-xs text-cream mt-3">
                {t('availableUntil', { date: formatExpiresAt(eb.expiresAt, tag) })}
              </p>

              {/* Subtle countdown */}
              {remaining !== null && (
                <p className="font-display text-sm italic text-cream mt-3">
                  {remaining === 0 ? t('lastDay') : t('daysRemaining', { count: remaining })}
                </p>
              )}

              <p className="font-display font-light text-cream text-5xl lg:text-6xl mt-8">
                {formatPrice(eb.amount)}
              </p>

              {eb.savingsLabel && (
                <p className="font-body text-sm text-cream mt-3">{eb.savingsLabel}</p>
              )}

              <Link
                href={retreat.finalCTAPrimaryHref}
                className="
                  inline-block mt-10
                  border-[0.5px] border-cream
                  px-8 py-3
                  font-body text-sm text-cream
                  hover:bg-cream hover:text-burgundy
                  transition-colors duration-300 cursor-pointer
                "
              >
                {t('reserveAtThisPrice')}
              </Link>
            </article>
          )}

          {/* Regular */}
          <article className="border-[0.5px] border-ink/20 p-8 lg:p-10">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink">
              {t('regularPrice')}
            </p>
            <p className="font-display font-light text-ink text-5xl lg:text-6xl mt-8">
              {formatPrice(pricing.regular.amount)}
            </p>
            <Link
              href={retreat.finalCTAPrimaryHref}
              className="
                inline-block mt-10
                border-[0.5px] border-ink
                px-8 py-3
                font-body text-sm text-ink
                hover:bg-ink hover:text-cream
                transition-colors duration-300 cursor-pointer
              "
            >
              {t('reserveAtRegularPrice')}
            </Link>
          </article>
        </motion.div>

        {/* Payment methods + terms */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
          className="grid md:grid-cols-2 gap-x-16 gap-y-12 mt-20 lg:mt-24"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink">
              {t('paymentMethods')}
            </p>
            <ul className="space-y-3 mt-4">
              {pricing.paymentMethods.map((method) => (
                <li key={method} className="flex items-baseline gap-3">
                  <span aria-hidden className="font-body text-sm text-ink select-none">—</span>
                  <span className="font-body text-sm text-ink leading-relaxed">{method}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink">
              {t('paymentTerms')}
            </p>
            <ul className="space-y-3 mt-4">
              {pricing.paymentTerms.map((term) => (
                <li key={term} className="flex items-baseline gap-3">
                  <span aria-hidden className="font-body text-sm text-ink select-none">—</span>
                  <span className="font-body text-sm text-ink leading-relaxed">{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
