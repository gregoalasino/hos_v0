'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

const faqs = [
  {
    q: 'Do I need to be an experienced yogi?',
    a: 'No. This training is open to anyone with a sincere interest in deepening their practice. A consistent personal practice and an open mind are all that’s required — no previous teaching experience is needed.',
  },
  {
    q: 'Is this training only for future teachers?',
    a: 'Not at all. Many participants join to deepen their personal practice, cultivate self-awareness, and integrate yoga more fully into their lives. It welcomes aspiring teachers, dedicated practitioners, retreat facilitators, coaches, therapists, and anyone seeking a more embodied, conscious way of living.',
  },
  {
    q: 'Will I receive a certificate?',
    a: 'Yes. After completing the Costa Rica immersion you receive a 100-Hour Certificate of Completion. Students who complete the additional 100-hour online program receive a Yoga Alliance Registered 200-Hour Yoga Teacher Training Certificate (RYT 200).',
  },
  {
    q: 'Is the certification recognized internationally?',
    a: 'Yes. Upon successful completion of both phases, graduates are eligible to register with Yoga Alliance as RYT 200 — one of the world’s most widely recognized yoga teaching credentials.',
  },
  {
    q: 'What airport should I fly into?',
    a: 'Juan Santamaría International Airport (SJO), Costa Rica. Detailed travel information will be provided after registration.',
  },
  {
    q: 'Can dietary requirements be accommodated?',
    a: 'Yes. Vegetarian meals are included, and most dietary requirements can be accommodated with advance notice.',
  },
];

export function YTTFaq() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={ref} className="w-[90%] md:w-[80%] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="font-display font-light text-ink text-3xl md:text-4xl leading-[1.15] max-w-2xl"
        >
          Everything you might be wondering.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
          className="mt-12 lg:mt-16 max-w-3xl border-t border-ink/15"
        >
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q} className="border-b border-ink/15">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                >
                  <span className="font-display font-light text-ink text-lg md:text-xl leading-snug">
                    {faq.q}
                  </span>
                  <span
                    aria-hidden
                    className={`mt-1 flex-shrink-0 text-burgundy text-xl leading-none transition-transform duration-300 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="font-body text-sm text-ink/80 leading-[1.8] pb-6 max-w-2xl">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
