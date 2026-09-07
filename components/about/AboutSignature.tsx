'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { ABOUT_DICTIONARIES } from '@/lib/i18n-about';

// ─── The signature ───────────────────────────────────────────────────────────
// A letter is signed. One drawn stroke — the same hand as the line that
// threads the home's photographs, a path that draws itself as it comes into
// view — then the name in the display face and, beneath it, who she is here.
export function AboutSignature() {
  const { lang } = useLanguage();
  const t = ABOUT_DICTIONARIES[lang].signature;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white pb-20 lg:pb-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        {/* Under the words, ranged left like everything else on the site: the
            house chapter closes on the left of the page, and the signature
            follows it as the last lines of a letter follow the text. */}
        <div className="max-w-2xl">
          <motion.svg
            aria-hidden
            viewBox="0 0 320 40"
            fill="none"
            className="h-8 w-56 md:w-64 text-ink/35"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M2 28 C 50 -4, 110 44, 160 14 S 250 34, 318 8"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              pathLength={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
            />
          </motion.svg>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.9 }}
            className="font-display font-light text-ink text-3xl md:text-4xl leading-none mt-4"
          >
            {t.name}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 1.1 }}
            className="font-body text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-burgundy mt-4"
          >
            {t.role}
          </motion.p>

          <motion.a
            href="https://www.instagram.com/wildheart.yogini/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 1.3 }}
            className="inline-block font-body text-sm text-ink/70 hover:text-ink transition-colors duration-300 mt-3"
          >
            {t.handle}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
