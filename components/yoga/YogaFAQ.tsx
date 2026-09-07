'use client';

import { useState, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { motion, AnimatePresence, Variants, useInView } from 'framer-motion';
import { Plus } from 'lucide-react';

// FAQ content — copy provided by the client for the yoga and wellness page.
const faqs: { question: string; answer: string }[] = [
  {
    question: 'Can I book a private yoga session?',
    answer:
      'Yes. Private yoga sessions can be arranged according to your needs and availability.',
  },
  {
    question: "Can I join a yoga class if I'm a beginner?",
    answer:
      'Absolutely. Our classes welcome different levels. We recommend letting the teacher know about any injuries or physical limitations before class.',
  },
  {
    question: 'Can I book the Yoga Shala for a private event or retreat?',
    answer:
      'Yes. The Yoga Shala can be booked for retreats, trainings, workshops, and private group experiences.',
  },
  {
    question: 'Do you offer wellness experiences for non-guests?',
    answer:
      'Yes, some of our wellness offerings are available to visitors. Availability may vary depending on the experience and schedule.',
  },
  {
    question: 'Do I need to book wellness experiences in advance?',
    answer:
      'We recommend booking in advance to ensure availability, especially for private sessions and group experiences.',
  },
  {
    question: 'What should I bring to a yoga class?',
    answer:
      'We provide yoga mats and basic props. We recommend bringing comfortable clothing, water, and an open mind.',
  },
  {
    question: 'Can wellness experiences be customized for my group?',
    answer:
      "Yes. We can help create a personalized wellness experience based on your group's needs, intentions, and schedule.",
  },
  {
    question: 'How do I book an experience?',
    answer:
      "Simply reach out to us with the experience you're interested in, your preferred date, and number of people, and our team will help you organize it.",
  },
];

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
  // Namespaced against the accommodations FAQ ids in case both accordions
  // ever share a page.
  const buttonId = `yoga-faq-button-${index}`;
  const panelId = `yoga-faq-panel-${index}`;

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
// YOGA FAQ — "Questions before you book?"
// Accordion behavior: one item open at a time. Replaces the earlier centered
// contact block; the contact invitation survives below the list, so a reader
// whose question is not answered here still has a way out.
// ═════════════════════════════════════════════════════════════════════════════
export function YogaFAQ() {
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
          Questions before you book?
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

        {/* Escape hatch for questions the list does not cover. Delayed past the
            staggered list so it reads as a closing note, not a tenth row. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.4 }}
          className="mt-12 lg:mt-16"
        >
          <p className="font-body text-sm text-ink max-w-md leading-relaxed">
            Reach out — we&apos;ll help you find the right class or arrange a
            private session.
          </p>
          <Link
            href="/contact"
            className="inline-block font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px] hover:opacity-70 transition-opacity duration-300 mt-6"
          >
            Get in touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
