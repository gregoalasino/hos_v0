import type { MetadataRoute } from 'next';
import { canonicalUrl } from '@/lib/seo';
import { listRetreatSlugs } from '@/lib/retreats';

// ─── Sitemap ─────────────────────────────────────────────────────────────────
// The public site only. Everything behind auth, every API handler, the booking
// flow and the two 308 redirects configured in next.config.mjs are left out:
// a sitemap that lists a redirect asks a crawler to spend budget discovering
// it is a redirect.
//
// Deliberately excluded, and why:
//   /admin/*, /instructor/*  — private, and blocked in robots.ts
//   /api/*                   — not pages
//   /booking/*               — a transactional flow, no standalone value
//   /paquetes/resultado      — a post-payment receipt, per-visitor
//   /clases                  — redirect('/yoga')
//   /gallery, /accommodations — 308 redirects
//
// When the Spanish routes land, `ACTIVE_LOCALES` in lib/seo.ts grows an entry
// and this file gains a nested loop over it; the route list itself does not
// change.

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const ROUTES: Entry[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  // The class schedule is regenerated from the recurring templates every week.
  { path: '/yoga', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/stay-with-us', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/retreats', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/shakti-experience', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/host-your-retreat', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/yoga-teacher-training', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/upcoming-retreats', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/about', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/paquetes', changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The moment this build ran. On Vercel a git checkout resets every file's
  // mtime, so reading the source files would report the same thing less
  // honestly. What this actually claims — "the static HTML was regenerated
  // then" — is true.
  const lastModified = new Date();

  const pages = ROUTES.map((route) => ({
    url: canonicalUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const retreats = listRetreatSlugs().map((slug) => ({
    url: canonicalUrl(`/retreats/${slug}`),
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...pages, ...retreats];
}
