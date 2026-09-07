"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from '@/i18n/navigation';

// ─── Host your retreat ───────────────────────────────────────────────────────
// A single, focused feature block (RecenterLife-style) inviting teachers and
// hosts to bring their group to House of Shakti. Links to the dedicated
// /host-your-retreat landing built from the client's deck.
export function HostYourRetreat() {
  const t = useTranslations("home.host");
  const tButtons = useTranslations("common.buttons");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-warm-white py-20 lg:py-28">
      <div className="w-[90%] md:w-[80%] mx-auto">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 lg:gap-16 items-stretch"
        >
          {/* Image — landscape, leading */}
          <Link href="/host-your-retreat" className="group block">
            <div className="relative aspect-[3/2] overflow-hidden">
              <img
                src="/images/card_host_your_retreat.webp"
                alt={t("imageAlt")}
                className="w-full h-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Link>

          {/* Text — set as a column the full height of the photograph beside it,
              so the heading and its paragraph hang from the top edge and the
              button sits on the floor. Centring the block as a whole left the
              two ends floating at arbitrary heights against the image. */}
          <div className="flex flex-col">
            <p className="font-body font-normal text-[10px] tracking-[0.25em] uppercase text-burgundy">
              {t("eyebrow")}
            </p>

            <h2 className="font-display font-light text-ink text-3xl md:text-4xl lg:text-5xl leading-[1.1] mt-4">
              {t("heading")}
            </h2>

            <p className="font-body text-sm text-ink leading-[1.8] mt-6 max-w-xl">
              {t("body")}
            </p>

            <Link
              href="/host-your-retreat"
              className="self-start bg-dark text-cream font-body text-sm tracking-[0.05em] px-8 py-3.5 hover:bg-burgundy transition-colors duration-300 mt-9 lg:mt-auto"
            >
              {tButtons("discoverMore")}
            </Link>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
