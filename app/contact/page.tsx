import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

// The page itself is a client component — it animates on scroll and reads the
// language context. Metadata can only be exported from a server module, so the
// route is this thin server shell and the interface lives beside it. Nothing
// about the rendered page changes.
export const metadata: Metadata = buildMetadata({
  path: '/contact',
  title: 'Contact House of Shakti — Santa Teresa, Costa Rica',
  description:
    'Reach House of Shakti in Santa Teresa, Costa Rica. WhatsApp, phone and email for stays, yoga classes, retreats and private bookings.',
  // Already names the business — the root template would repeat it.
  absoluteTitle: true,
});

export default function ContactPage() {
  return <ContactPageClient />;
}
