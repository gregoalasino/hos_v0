import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/business';
import { ACTIVE_LOCALES, localizedPath } from '@/lib/seo';

// ─── robots.txt ──────────────────────────────────────────────────────────────
// Two audiences, both wanted.
//
// Search crawlers get the whole public site and nothing else: the admin, the
// instructor portal, the API handlers, the booking flow and the per-visitor
// payment receipt are all off limits — not because they are secret (auth
// handles that) but because they are worthless in an index and would burn
// crawl budget.
//
// Answer engines are allowed on purpose. A guest planning a trip increasingly
// asks an assistant "where should I do yoga in Santa Teresa" rather than a
// search box, and for a house this small, being in that answer is worth more
// than a rank. GPTBot, ClaudeBot, PerplexityBot and Google-Extended are named
// explicitly so the permission survives any future default-deny.
const PRIVATE_PATHS = [
  '/admin',
  '/instructor',
  '/api',
  // Public-site paths exist in every language: `/booking` and `/es/booking`.
  ...['/booking', '/paquetes/resultado'].flatMap((path) =>
    ACTIVE_LOCALES.map((locale) => localizedPath(path, locale)),
  ),
];

const ANSWER_ENGINES = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      ...ANSWER_ENGINES.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
