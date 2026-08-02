'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, Variants, useInView } from 'framer-motion';
import { Plus } from 'lucide-react';

// FAQ content — placeholder copy approved by Santi. Final answers to be
// reviewed by Nancy before launch.
const faqs: { question: string; answer: string }[] = [
  {
    question: 'What time is check-in and check-out?',
    answer:
      "Check-in is from 3:00 PM and check-out is at 11:00 AM. If you need an earlier check-in or later check-out, let us know in advance — we'll do our best to accommodate.",
  },
  {
    question: "What's included in my stay?",
    answer:
      'Every stay includes daily housekeeping, fresh towels and premium bed linens, high-speed Wi-Fi, the swimming pool, access to the yoga shala, complimentary parking, and personalized support throughout your stay — from wellness services to tours and transportation. Our regular yoga classes and the sauna and ice bath wellness area are available by advance reservation, at an extra cost.',
  },
  {
    question: 'Do you accommodate dietary restrictions?',
    answer:
      'Yes. Our shared kitchen is fully equipped, and many guests prepare their own meals. For retreats and curated experiences, our team can plan menus around vegetarian, vegan, gluten-free, and other dietary needs — please share any restrictions when you book.',
  },
  {
    question: 'Is the sanctuary suitable for children?',
    answer:
      "House of Shakti is designed for adults seeking rest and quiet practice. We do not accommodate children under 12. If you're traveling with older children or teens, please reach out before booking so we can advise.",
  },
  {
    question: 'Are pets allowed?',
    answer:
      "We don't allow pets on the property. The jungle around us is home to wild animals, and we keep the sanctuary as undisturbed as possible. If you're traveling with a service animal, please contact us in advance.",
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'Reservations are fully refundable up to 30 days before arrival. Cancellations made between 30 and 14 days before arrival are refundable at 50%. Within 14 days of arrival, reservations are non-refundable. We recommend travel insurance for unexpected changes.',
  },
  {
    question: 'How do I get to House of Shakti from the airport?',
    answer:
      'Most guests fly into Liberia (LIR), about 4 hours by car from Santa Teresa, or San José (SJO), about 5 hours away. From either airport you can arrange a private transfer (we can recommend trusted drivers), rent a car, or take a shuttle. The property is 5 minutes from Playa Hermosa, in the Nicoya Peninsula.',
  },
  {
    question: 'What should I bring?',
    answer:
      'Light, breathable clothing for the tropical climate, swimwear, a light rain jacket (especially in green season), insect repellent, reef-safe sunscreen, sandals, and any personal yoga props you prefer (mats and basic props are provided at the shala). For evenings, a light layer is helpful.',
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
          Before you arrive
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
