'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { BUSINESS } from '@/lib/business';

// ─── Static content ─────────────────────────────────────────────────────────
const sitemapLinks: { label: string; href: string }[] = [
  { label: 'Yoga & Wellbeing', href: '/yoga' },
  { label: 'Stay With Us', href: '/stay-with-us' },
  { label: 'Retreats', href: '/retreats' },
  { label: 'Host your retreat', href: '/host-your-retreat' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Address, map link and social handle all come from lib/business.ts — the same
// record the contact page, the calendar invitations and the structured data
// read. The street address is still a TODO_CONFIRM there; what renders here is
// exactly what rendered before.
const addressLines = BUSINESS.addressLines;
const MAPS_URL = BUSINESS.mapsUrl;
const INSTAGRAM_URL = BUSINESS.instagram;
const INSTAGRAM_HANDLE = BUSINESS.instagramHandle;

// ─── Stagger variants for the three right-zone columns ──────────────────────
const columnsContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};
const columnItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// ─── Footer ─────────────────────────────────────────────────────────────────
export function Footer() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <footer
      ref={ref}
      role="contentinfo"
      data-surface="dark"
      className="bg-dark text-cream pt-20 lg:pt-32 pb-8 lg:pb-16 px-6 lg:px-0"
    >
      <div className="w-[90%] md:w-[80%] mx-auto">
        {/* ─── TOP BAND ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12">
          {/* LEFT — brand block (logo + tagline) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <Link
              href="/"
              className="inline-flex items-center hover:opacity-80 transition-opacity duration-300"
            >
              {/* White logo for the dark footer */}
              <img
                src="/logos/logo-hos-blanco.webp"
                alt="House of Shakti"
                draggable={false}
                className="h-12 lg:h-14 w-auto select-none"
                loading="lazy"
                decoding="async"
              />
            </Link>

            <p className="font-body text-sm text-cream/60 leading-relaxed max-w-xs mt-6">
              A sanctuary in the canopy of Costa Rica.
            </p>
          </motion.div>

          {/* RIGHT — three columns (Sitemap, Visit, Follow) */}
          <motion.div
            variants={columnsContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8"
          >
            {/* Column 1 — Sitemap */}
            <motion.div variants={columnItem}>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/50 mb-6 lg:mb-8">
                Explore
              </p>
              <ul className="space-y-3">
                {sitemapLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-cream/80 hover:text-cream transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 2 — Visit */}
            <motion.div variants={columnItem}>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/50 mb-6 lg:mb-8">
                Visit
              </p>
              <address className="not-italic space-y-1">
                {addressLines.map((line) => (
                  <p
                    key={line}
                    className="font-body text-sm text-cream/80 leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </address>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-sm text-cream/80 hover:text-cream underline underline-offset-4 decoration-[0.5px] transition-colors duration-300 mt-4"
              >
                View on Google Maps
              </a>
            </motion.div>

            {/* Column 3 — Follow */}
            <motion.div variants={columnItem}>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/50 mb-6 lg:mb-8">
                Follow
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-body text-sm text-cream/80 hover:text-cream transition-colors duration-300"
              >
                <Instagram
                  aria-hidden
                  className="w-4 h-4 text-cream/80 group-hover:text-cream transition-colors duration-300"
                  strokeWidth={1.5}
                />
                <span>{INSTAGRAM_HANDLE}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── SEPARATOR ────────────────────────────────────────────────── */}
        <div className="mt-16 lg:mt-24 pt-6 lg:pt-10 border-t border-cream/15" />

        {/* ─── BOTTOM BAND ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        >
          {/* Copyright a la misma escala que los enlaces de las columnas. */}
          <p className="font-body text-sm text-cream/40">
            © {new Date().getFullYear()} House of Shakti. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
