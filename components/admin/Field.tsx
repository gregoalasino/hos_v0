'use client';

import type { ReactNode } from 'react';

// Editorial form field wrapper — label + input + helper/error text.
// Used by Input, Textarea, NativeSelect, and any custom input element.
type FieldProps = {
  label?: string;
  helper?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
};

export function Field({ label, helper, error, htmlFor, children, className = '' }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block font-body text-[10px] tracking-[0.3em] uppercase text-ink/60 mb-2"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="font-body text-xs italic text-burgundy mt-2">{error}</p>
      ) : helper ? (
        <p className="font-body text-xs text-ink/50 mt-2">{helper}</p>
      ) : null}
    </div>
  );
}
