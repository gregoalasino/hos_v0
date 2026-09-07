import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

// Per-request configuration: which locale is rendering and which messages it
// reads. `requestLocale` is the `[locale]` segment, made available to this
// file by `setRequestLocale` in the layout and pages (which is also what keeps
// those pages statically rendered). Anything that isn't one of ours — a page
// rendering outside the segment, an unknown value — falls back to English.
//
// Next ≥ 16.3 exposes root params directly (`next/root-params`), which
// next-intl prefers over `requestLocale`; on 16.1 that needs an experimental
// flag, so the segment value is read the established way until the upgrade.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
