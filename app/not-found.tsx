'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/landing/navigation';

// Global 404 — Next.js renders this when a route doesn't exist or when
// notFound() is called anywhere in the app.
//
// Note: app/layout.tsx does NOT wrap pages with <Navigation />; each page
// includes it individually, so this 404 mounts the nav explicitly to keep
// the top of the site recognizable when a guest lands here by mistake.
//
// No footer here on purpose — the page is a small, contained moment; one
// way back home, one way to ask a question.
export default function NotFound() {
  return (
    <>
      <Navigation />
      <main
        className="
          bg-warm-white
          mt-16 md:mt-20
          min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-5rem)]
          flex items-center justify-center
        "
      >
        <div className="max-w-md mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="font-body text-[10px] tracking-[0.3em] uppercase text-burgundy"
          >
            404
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
            className="font-display font-light text-ink text-3xl md:text-4xl lg:text-5xl leading-[1.1] mt-6"
          >
            This page doesn&apos;t live here.
          </motion.h1>

          {/* Body kept at full ink opacity to honor the project-wide rule
              (no opacity dimming on body text). */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
            className="font-body text-base text-ink leading-relaxed mt-8"
          >
            The page you&apos;re looking for may have moved, or perhaps never existed at all.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12"
          >
            {/* Plain <a> instead of next/link Link — in App Router
                not-found.tsx the client router can get into a state where
                Link's client-side navigation silently no-ops. Native anchors
                always navigate (full reload, which is fine for a 404 exit). */}
            <a
              href="/"
              className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
            >
              Return home
            </a>

            {/* TODO: /contact route does not exist yet — link is in place
                so it lights up automatically when the contact page lands. */}
            <a
              href="/contact"
              className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </main>
    </>
  );
}
