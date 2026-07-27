'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { Field } from './Field';

// Editorial input — bordered on the bottom only, no box, no radius.
// Wraps a Field by default so most call sites just pass label + register.
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
  bare?: boolean; // skip Field wrapper if true
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helper, error, bare = false, className = '', ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      {...props}
      className={`
        w-full pb-2 bg-transparent
        border-b ${error ? 'border-burgundy' : 'border-ink/20 focus:border-ink'}
        font-body text-base text-ink
        outline-none transition-colors duration-200
        placeholder:text-ink/30 placeholder:italic
        ${className}
      `}
    />
  );

  if (bare) return input;
  return (
    <Field label={label} helper={helper} error={error} htmlFor={props.id}>
      {input}
    </Field>
  );
});
