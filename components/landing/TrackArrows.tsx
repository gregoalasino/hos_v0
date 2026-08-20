'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';

/**
 * The pair of controls that step a carousel track.
 *
 * Square and hairline, per the site's brand rule, and they dim out at each end
 * rather than sitting there live but inert. Meant to sit with the copy beside a
 * track, not floating over the images — the track keeps scrolling, dragging and
 * swiping on its own, so these are a second way in, never the only one.
 */
function TrackButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="
        h-11 w-11 flex items-center justify-center
        border border-ink/25 text-ink
        transition-all duration-300
        hover:border-ink hover:bg-ink hover:text-cream
        disabled:opacity-25 disabled:pointer-events-none
      "
    >
      {children}
    </button>
  );
}

export function TrackArrows({
  atStart,
  atEnd,
  onPrev,
  onNext,
  className = '',
}: {
  atStart: boolean;
  atEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  const { lang } = useLanguage();
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TrackButton
        label={tr(lang, 'Anterior', 'Previous')}
        onClick={onPrev}
        disabled={atStart}
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </TrackButton>
      <TrackButton
        label={tr(lang, 'Siguiente', 'Next')}
        onClick={onNext}
        disabled={atEnd}
      >
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      </TrackButton>
    </div>
  );
}
