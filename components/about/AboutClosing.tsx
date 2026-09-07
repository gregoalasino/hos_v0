'use client';

import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { motion, useInView } from 'framer-motion';
import { useMessages } from 'next-intl';

// Pre-footer moment, the treatment /retreats and /stay-with-us close with:
// warm-white, one centred line, two editorial underline links. No
// photograph, no dark overlay — the letter has been read; this is the way on.
export function AboutClosing() {
  const t = useMessages().about.closing;
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="bg-warm-white py-20 lg:py-28 border-t border-ink/10">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="w-[90%] md:w-[80%] max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display font-light text-ink text-3xl md:text-4xl leading-tight">
          {t.heading}
        </h2>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center justify-center mt-10">
          {t.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
