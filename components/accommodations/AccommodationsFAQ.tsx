'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, Variants, useInView } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useMessages, useTranslations } from 'next-intl';

// FAQ content — placeholder copy approved by Santi, in the catalogue under
// stayWithUs.faq.items. Final answers to be reviewed by Nancy before launch.

// Stagger variants for the list children
const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// ─── FAQ Item — controlled accordion row ────────────────────────────────────
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const buttonId = `faq-button-${index}`;
  const panelId = `faq-panel-${index}`;

  return (
    <motion.li
      variants={itemVariants}
      className={`border-b border-ink/10 ${index === 0 ? 'border-t' : ''}`}
    >
      <button
        type="button"
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex justify-between items-center gap-6 py-6 lg:py-8 cursor-pointer text-left group"
      >
        <span className="font-display font-light text-ink text-lg lg:text-xl leading-snug">
          {question}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-shrink-0 text-ink group-hover:opacity-70 transition-opacity duration-300"
        >
          <Plus className="w-4 h-4" strokeWidth={1} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: 'easeOut' },
              opacity: { duration: 0.3, ease: 'easeOut', delay: 0.1 },
            }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-ink leading-relaxed max-w-3xl pb-6 lg:pb-8">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FAQ SECTION — "Before you arrive"
// Accordion behavior: one item open at a time.
// ═════════════════════════════════════════════════════════════════════════════
export function AccommodationsFAQ() {
  const t = useTranslations('stayWithUs.faq');
  const faqs = useMessages().stayWithUs.faq.items;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });

  const toggle = (i: number) => setOpenIndex((current) => (current === i ? null : i));

  return (
    <section className="bg-warm-white py-20 lg:py-28">
      <div ref={sectionRef} className="w-[90%] md:w-[80%] max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="font-display font-light text-ink text-3xl md:text-4xl leading-tight mb-16 lg:mb-20"
        >
          {t('heading')}
        </motion.h2>

        <motion.ul
          variants={listContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              index={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
