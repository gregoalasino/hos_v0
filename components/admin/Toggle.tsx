'use client';

// Editorial toggle switch — replaces shadcn <Switch> in admin forms.
// Earth-tone palette: olive/sage when on, ink/15 when off.
type ToggleProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export function Toggle({ checked, onChange, disabled, ariaLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex items-center w-9 h-5 flex-shrink-0
        transition-colors duration-200 ease-out cursor-pointer
        ${checked ? 'bg-[#6B7355]' : 'bg-ink/15'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
      `}
    >
      <span
        aria-hidden
        className={`
          inline-block w-4 h-4 bg-white shadow-sm
          transition-transform duration-200 ease-out
          ${checked ? 'translate-x-[18px]' : 'translate-x-[2px]'}
        `}
      />
    </button>
  );
}
