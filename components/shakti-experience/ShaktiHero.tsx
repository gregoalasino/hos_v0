'use client';

import { motion } from 'framer-motion';
import { HeroVideo, heroCuts } from '@/components/shared/HeroVideo';
import { useLanguage } from '@/contexts/language-context';
import { SHAKTI_DICTIONARIES } from '@/lib/i18n-shakti';
import { whatsappUrl } from '@/lib/whatsapp';

// Full-bleed video hero in the training landing's framing — 80% container on
// desktop, edge-to-edge on mobile, the copy ranged along the bottom-left —
// with the Shakti Experience clip and no dateline: the experience has no
// fixed dates, so the title opens the frame on its own, the subtitle beneath
// it, and a single door to the house's WhatsApp.

// The neutral scrim the other text-bearing video heroes carry: black rather
// than the brand burgundy, holding a near-plateau across the copy and falling
// away fast so the sky and sea above are untouched.
const SCRIM =
  'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.66) 22%, rgba(0,0,0,0.52) 40%, rgba(0,0,0,0.42) 56%, rgba(0,0,0,0.24) 70%, rgba(0,0,0,0.08) 84%, rgba(0,0,0,0) 96%)';

// Video is a moving background: a frame that reads well now can wash out a
// second later. A soft shadow on the type holds legibility through the bright
// frames without darkening the whole picture.
const TEXT_SHADOW =
  '[text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_2px_20px_rgba(0,0,0,0.35)]';

export function ShaktiHero() {
  const { lang } = useLanguage();
  const t = SHAKTI_DICTIONARIES[lang];

  return (
    <section className="bg-warm-white">
      <div className="w-full md:w-[80%] mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-dark
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          <HeroVideo {...heroCuts('shakti-experience')} />

          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: SCRIM }} />

          <div className="absolute inset-0 flex items-end">
            <div className={`w-[85%] md:w-[88%] mx-auto pb-12 md:pb-16 lg:pb-20 ${TEXT_SHADOW}`}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut', delay: 0.12 }}
                className="font-display font-light text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.0] tracking-[-0.01em] max-w-4xl"
              >
                {t.hero.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.24 }}
                className="font-body text-sm md:text-base text-cream/85 leading-[1.7] mt-6 max-w-xl"
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.36 }}
                className="mt-9 md:mt-10"
              >
                <a
                  href={whatsappUrl(t.whatsapp.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-cream text-dark font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy hover:text-cream transition-colors duration-300 [text-shadow:none]"
                >
                  {t.hero.cta}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
