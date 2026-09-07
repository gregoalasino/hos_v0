import { notFound } from 'next/navigation';

// Anything under the locale segment that no page claims is a 404. The proxy
// rewrites every public path under a locale — `/nowhere` becomes `/en/nowhere`
// — so this is where unknown URLs of the public site land, and `notFound()`
// hands them to app/[locale]/not-found.tsx: the site's own 404, inside the
// site's own layout, in the language of the URL.
export default function CatchAllPage() {
  notFound();
}
