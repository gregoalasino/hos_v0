'use client';

import type { ReactNode } from 'react';

// Admin badge — status indicator / category label.
// Earth-tone palette (see DESIGN_SYSTEM.md §2 — Accent palette).
// No border-radius. Border + text share the same accent hue; no fill.
type Variant = 'active' | 'inactive' | 'warning' | 'destructive' | 'neutral';

type BadgeProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

// Hardcoded earth-tone hex values via Tailwind arbitrary syntax. We avoid
// adding these to globals.css so they stay scoped to the admin.
const VARIANT_CLASSES: Record<Variant, string> = {
  active: 'border-[#6B7355] text-[#6B7355]', // olive / sage
  inactive: 'border-[#7A6B5D] text-[#7A6B5D]', // warm gray
  warning: 'border-[#8B6F47] text-[#8B6F47]', // terracotta
  destructive: 'border-burgundy text-burgundy', // #8D0000
  neutral: 'border-ink/40 text-ink/60',
};

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-1
        font-body text-[10px] tracking-[0.15em] uppercase font-medium
        border bg-transparent
        ${VARIANT_CLASSES[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
