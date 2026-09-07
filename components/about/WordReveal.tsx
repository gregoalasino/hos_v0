'use client';

import { motion, Variants } from 'framer-motion';

// ─── Word reveal ─────────────────────────────────────────────────────────────
// A line that arrives one word at a time — the site's opening-statement
// treatment (the home's intro, the Stay With Us headline), which on a page
// meant to read as written by hand is the closest thing to watching the pen
// move. The container drives the stagger; each word rises out of its own
// clipped box.

const container: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export function WordReveal({
  text,
  as: Tag = 'p',
  className,
  active,
}: {
  text: string;
  as?: 'h1' | 'h2' | 'p';
  className: string;
  /** Plays once this turns true — the caller decides when it is in view. */
  active: boolean;
}) {
  const words = text.split(' ');
  return (
    <motion.div variants={container} initial="hidden" animate={active ? 'visible' : 'hidden'}>
      <Tag className={className} aria-label={text}>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} aria-hidden>
            <span className="inline-block overflow-hidden align-baseline">
              <motion.span variants={word} className="inline-block will-change-transform">
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
