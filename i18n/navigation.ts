import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware drop-ins for Next's navigation APIs. `Link`, `redirect` and
// `useRouter` add the `/es` prefix when the reader is on the Spanish site and
// leave English URLs bare; `usePathname` returns the path without the prefix,
// so route comparisons (`/booking`, `/admin`) read the same in both languages.
// Every public component imports these instead of next/link and
// next/navigation; the admin and instructor areas, which live outside the
// locale segment, keep using Next's own.
export const { Link, redirect, permanentRedirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
