'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { Field } from './Field';

// Editorial native <select> with a custom chevron. Used inside admin forms
// and as a lightweight filter dropdown in table toolbars.
type Option = { value: string; label: string };
type NativeSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  label?: string;
  helper?: string;
  error?: string;
  options: Option[];
  /** When true, render without the Field wrapper (used in toolbars). */
  bare?: boolean;
  /** When true, use the toolbar/filter visual treatment (more compact). */
  filter?: boolean;
};

const CHEVRON_BG =
  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23313131' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")";

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    { label, helper, error, options, bare = false, filter = false, className = '', ...props },
    ref,
  ) {
    const select = (
      <select
        ref={ref}
        {...props}
        className={`
          appearance-none bg-transparent bg-no-repeat
          ${filter ? 'pl-0 pr-6 py-2 text-sm' : 'w-full pb-2 pr-7 text-base'}
          border-b ${error ? 'border-burgundy' : 'border-ink/20 focus:border-ink'}
          font-body text-ink
          outline-none cursor-pointer transition-colors duration-200
          ${className}
        `}
        style={{
          backgroundImage: CHEVRON_BG,
          backgroundPosition: 'right 0 center',
          backgroundSize: '18px 18px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );

    if (bare || filter) return select;
    return (
      <Field label={label} helper={helper} error={error} htmlFor={props.id}>
        {select}
      </Field>
    );
  },
);
