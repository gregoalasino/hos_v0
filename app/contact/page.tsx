'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';

// /contact — information-only contact page modeled on aman.com/contact-us.
// No form, no newsletter, no social links (those live in the footer).
// Layout: centered page heading → asymmetric 30/70 two-column (info blocks
// + vertical image) → two full-width sections (Visit, Press & Media)
// separated by hairline borders.

// ─── Contact data ───────────────────────────────────────────────────────────
// All TODOs are awaiting Nancy's confirmation on the canonical addresses.

// TODO: confirm reservations email with Nancy
const EMAIL_RESERVATIONS = 'hello@houseofshaktiyoga.com';

// TODO: confirm retreats email with Nancy — may collapse into general email
const EMAIL_RETREATS = 'retreats@houseofshaktiyoga.com';

// TODO: confirm dedicated press email or use general email
const EMAIL_PRESS = 'press@houseofshaktiyoga.com';

const PHONE_E164 = '+50688365115';
const PHONE_DISPLAY = '+506 8836 5115';
const WHATSAPP_URL = 'https://wa.me/50688365115';

// TODO: confirm exact Google Maps link with Nancy
const MAPS_URL =
  'https://maps.google.com/?q=House+of+Shakti+Santa+Teresa+Costa+Rica';

// TODO: replace with curated pool + jungle vertical composition when available.
// Placeholder is the most vertical-leaning sanctuary frame not yet used in
// other parts of the site.
const COLUMN_IMAGE = '/images/sanctuary/271A0723_websize%201.webp';

// ─── Small primitives ───────────────────────────────────────────────────────

/** Email / WhatsApp / Phone link — shared anchor styling across the page. */
function ContactLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' as const }
    : {};
  return (
    <a
      href={href}
      {...externalProps}
      className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
    >
      {children}
    </a>
  );
}

/** Label : Value row used inside left-column info blocks. */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-body text-sm text-ink">{label}</span>
      {children}
    </div>
  );
}

// ─── Sections ───────────────────────────────────────────────────────────────

// 1) Page heading — centered, generous breathing room. Mount-animated
//    (not scroll-triggered) since it sits at the top of the page.
function PageHeading() {
  return (
    <section className="bg-warm-white pt-24 lg:pt-32 pb-10 lg:pb-12">
      <div className="w-[90%] md:w-[80%] mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
          className="font-display font-light text-ink text-4xl md:text-5xl lg:text-6xl leading-[1.1]"
        >
          Contact Us
        </motion.h1>
      </div>
    </section>
  );
}

// 2) Two-column section — asymmetric 30/70. Left: stacked info blocks
//    separated by hairline borders. Right: large vertical image.
function ContactColumns() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white pb-16 lg:pb-20">
      <div
        ref={sectionRef}
        className="w-[90%] md:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-start"
      >
        {/* LEFT — info blocks (col-span-3 = 30%) */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          {/* Block 1 — Reservations & Inquiries */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.0 }}
            className="border-t border-ink/10 py-10 lg:py-12"
          >
            <h2 className="font-display font-light text-ink text-lg lg:text-xl leading-snug">
              Reservations &amp; Inquiries
            </h2>
            <p className="font-body text-sm text-ink leading-relaxed mt-6">
              Our team is available to help you plan your stay, retreats, or
              private use of the sanctuary. We typically respond within 24 hours.
            </p>
            <div className="space-y-3 mt-6">
              <DetailRow label="Email:">
                <ContactLink href={`mailto:${EMAIL_RESERVATIONS}`}>
                  {EMAIL_RESERVATIONS}
                </ContactLink>
              </DetailRow>
              <DetailRow label="WhatsApp:">
                <ContactLink href={WHATSAPP_URL} external>
                  {PHONE_DISPLAY}
                </ContactLink>
              </DetailRow>
              <DetailRow label="Phone:">
                <ContactLink href={`tel:${PHONE_E164}`}>
                  {PHONE_DISPLAY}
                </ContactLink>
              </DetailRow>
            </div>
          </motion.div>

          {/* Block 2 — Host a Retreat */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.15 }}
            className="border-t border-ink/10 py-10 lg:py-12"
          >
            <h2 className="font-display font-light text-ink text-lg lg:text-xl leading-snug">
              Host a Retreat
            </h2>
            <p className="font-body text-sm text-ink leading-relaxed mt-6">
              For teachers, hosts, and brands seeking to use House of Shakti as
              a setting for retreats or curated gatherings.
            </p>
            <div className="space-y-3 mt-6">
              <DetailRow label="Email:">
                <ContactLink href={`mailto:${EMAIL_RETREATS}`}>
                  {EMAIL_RETREATS}
                </ContactLink>
              </DetailRow>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — large vertical image (col-span-7 = 70%) */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="lg:col-span-7 order-1 lg:order-2"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
            <Image
              src={COLUMN_IMAGE}
              alt="The saltwater pool framed by the jungle at House of Shakti"
              fill
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 3) Visit — full-width single-column. Hairline frame top + bottom.
function VisitSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-8 lg:py-10">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="border-t border-ink/10 py-10 lg:py-12"
        >
          <h2 className="font-display font-light text-ink text-lg lg:text-xl leading-snug">
            Visit
          </h2>
          <p className="font-body text-sm text-ink leading-relaxed max-w-2xl mt-6">
            House of Shakti is hidden in the canopy of the Nicoya Peninsula,
            five minutes from Playa Hermosa, Santa Teresa.
          </p>

          {/* Address block — TODO: confirm full street address with Nancy */}
          <address className="not-italic space-y-1 mt-6">
            <p className="font-body text-sm text-ink">House of Shakti</p>
            <p className="font-body text-sm text-ink">Santa Teresa</p>
            <p className="font-body text-sm text-ink">Puntarenas, Costa Rica</p>
          </address>

          <div className="mt-6">
            <ContactLink href={MAPS_URL} external>
              View on Google Maps
            </ContactLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// 4) Press & Media — full-width single-column. Hairline frame top + bottom.
//    The top border doubles as the visual separator from the Visit section
//    (single line between them, not two).
function PressSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white pb-12 lg:pb-16">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="border-t border-b border-ink/10 py-10 lg:py-12"
        >
          <h2 className="font-display font-light text-ink text-lg lg:text-xl leading-snug">
            Press &amp; Media Enquiries
          </h2>
          <p className="font-body text-sm text-ink leading-relaxed max-w-2xl mt-6">
            For press, media, and editorial enquiries.
          </p>
          <div className="mt-6">
            <DetailRow label="Email:">
              <ContactLink href={`mailto:${EMAIL_PRESS}`}>
                {EMAIL_PRESS}
              </ContactLink>
            </DetailRow>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <main className="bg-warm-white overflow-hidden">
      <Navigation />
      <PageHeading />
      <ContactColumns />
      <VisitSection />
      <PressSection />
      <Footer />
    </main>
  );
}
