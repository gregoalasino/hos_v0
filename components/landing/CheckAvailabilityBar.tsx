"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CLOUDBEDS_PROPERTY_CODE,
  cloudbedsReservationUrl,
} from "@/lib/cloudbeds";

// ─── Hero "Check availability" bar ───────────────────────────────────────────
// A compact booking pill overlaid on the hero (à la RecenterLife): a date-range
// field + a "Check availability" action. On submit we open the Cloudbeds
// reservation with the chosen dates; with no dates we fall back to the immersive
// popup exposed site-wide by the loader script (app/layout.tsx).
const iso = (d: Date) => format(d, "yyyy-MM-dd");
const pretty = (d: Date) => format(d, "MMM d");

export function CheckAvailabilityBar() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [open, setOpen] = useState(false);

  const from = range?.from;
  const to = range?.to;

  const handleCheck = () => {
    if (from && to) {
      window.open(cloudbedsReservationUrl(iso(from), iso(to)), "_blank", "noopener,noreferrer");
      return;
    }
    // No dates chosen — open the immersive overlay if available, else the plain page.
    const openPopup = window.openImmersiveExperiencePopup;
    if (typeof openPopup === "function") {
      openPopup({ propertyCode: CLOUDBEDS_PROPERTY_CODE });
    } else {
      window.open(cloudbedsReservationUrl(), "_blank", "noopener,noreferrer");
    }
  };

  const dateLabel =
    from && to
      ? `${pretty(from)} → ${pretty(to)}`
      : from
      ? `${pretty(from)} → End date`
      : "Start date → End date";

  // The pill reads as smoked glass over the footage. Neutral black rather than
  // `--dark` (#340000): a burgundy panel sitting on the video was part of the
  // same colour cast as the scrim behind it. Black is the darker ground, so a
  // lower alpha than the old /85 still leaves the cream type the contrast it had.
  return (
    <div className="inline-flex items-stretch overflow-hidden bg-black/75 backdrop-blur-sm shadow-lg">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 px-5 md:px-6 py-3.5 text-cream/90 hover:text-cream transition-colors duration-300"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              className="h-4 w-4 opacity-80"
            >
              <rect x="3" y="4.5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v3M16 3v3" />
            </svg>
            <span className="font-body text-xs md:text-sm tracking-[0.04em] whitespace-nowrap">
              {dateLabel}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0" sideOffset={12}>
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={range}
            onSelect={(r) => {
              setRange(r);
              if (r?.from && r?.to) setOpen(false);
            }}
            disabled={{ before: new Date() }}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <button
        type="button"
        onClick={handleCheck}
        className="bg-cream text-ink font-body text-xs md:text-sm tracking-[0.08em] uppercase px-5 md:px-7 hover:bg-ink hover:text-cream transition-colors duration-300"
      >
        Check availability
      </button>
    </div>
  );
}
