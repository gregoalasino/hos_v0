'use client';

import { useRef } from 'react';
import { motion, Variants, useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/language-context';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';
import { whatsappUrl } from '@/lib/whatsapp-shakti';

// ─── Pricing ─────────────────────────────────────────────────────────────────
// Three ways to stay, in the training landing's pricing language: a dark band,
// three cards in a row, one of them lifted to cream. There the lifted card is
// the early-bird price; here it is Your Own Way — the owners want the custom
// experience to carry the emphasis, and it is also the one with its own door,
// since designing a stay is a different first question from reserving one.

// Which card is lifted is structural, not textual.
const TIER_FEATURED = [false, false, true];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: 'easeOut' } },
};

export function ShaktiPricing() {
  const { lang } = useLanguage();
  const t = SHAKTI_DICTIONARIES[lang];
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="pricing" data-surface="dark" className="bg-dark text-cream py-20 lg:py-28 scroll-mt-20 lg:scroll-mt-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            className="font-display font-light text-cream text-3xl md:text-4xl leading-[1.15]"
          >
            {t.pricing.heading}
          </motion.h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 mt-14 lg:mt-16"
        >
          {t.pricing.tiers.map((tier, i) => {
            const featured = TIER_FEATURED[i];
            const quiet = featured ? 'text-dark/70' : 'text-cream/70';
            return (
              <motion.article
                key={tier.title}
                variants={item}
                className={`p-8 md:p-10 flex flex-col ${
                  featured ? 'bg-cream text-dark' : 'border border-cream/20 text-cream'
                }`}
              >
                {/* The experience's name opens the card — a title, not an
                    eyebrow, and a clear step below the price so the two never
                    compete for the eye. */}
                <h3 className="font-display font-light text-xl md:text-2xl leading-snug">
                  {tier.title}
                </h3>
                <p className={`font-body text-sm mt-2 ${quiet}`}>{tier.duration}</p>
                <p className="font-display font-light text-3xl md:text-4xl leading-[1.1] mt-6">
                  {tier.price}
                </p>
                <p className={`font-body text-sm leading-[1.7] mt-5 ${quiet}`}>{tier.body}</p>

                {tier.includes.length > 0 && (
                  <div className="mt-8">
                    <p
                      className={`font-body text-[10px] tracking-[0.25em] uppercase ${
                        featured ? 'text-dark/60' : 'text-cream/60'
                      }`}
                    >
                      {t.pricing.includesLabel}
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {tier.includes.map((line) => (
                        <li key={line} className="flex gap-3">
                          <span
                            aria-hidden
                            className={`mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                              featured ? 'bg-burgundy' : 'bg-cream/70'
                            }`}
                          />
                          <span
                            className={`font-body text-sm leading-[1.6] ${
                              featured ? 'text-dark/85' : 'text-cream/85'
                            }`}
                          >
                            {line}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tier.extra && (
                  <p className={`font-body text-sm leading-[1.7] mt-6 ${quiet}`}>{tier.extra}</p>
                )}

                {tier.closing && (
                  <p className="font-display font-light text-lg leading-snug mt-6">{tier.closing}</p>
                )}

                {tier.cta && (
                  <div className="mt-auto pt-10">
                    <a
                      href={whatsappUrl(t.whatsapp.messageCustom)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300"
                    >
                      {tier.cta}
                    </a>
                  </div>
                )}
              </motion.article>
            );
          })}
        </motion.div>

        {/* The group rate applies to both priced stays, so it is said once,
            beside the door they share. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
        >
          <p className="font-body text-sm text-cream/70 leading-[1.7] max-w-md">
            {t.pricing.groupNote}
          </p>
          <a
            href={whatsappUrl(t.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block shrink-0 bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300"
          >
            {t.pricing.cta}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
