"use client";

import { motion } from "framer-motion";
import { CheckAvailabilityBar } from "./CheckAvailabilityBar";
import { HeroVideo, heroCuts } from "@/components/shared/HeroVideo";

export function Hero() {
  return (
    <section className="bg-warm-white">
      {/*
        Hero + navbar together fill 100vh on any device.
        Navbar is h-16 (mobile) / h-20 (md+), so hero takes the remainder.
        Mobile: edge-to-edge.
        Desktop: container with side padding, matching Aman's framing.
      */}
      {/*
        Width rules: full-bleed edge-to-edge on every device — el video
                     del hero ocupa todo el ancho de la pantalla.
        `mt-*` desplaza el contenido por debajo del navbar fijo, para que hero + nav = 100vh.
      */}
      <div className="w-full mx-auto mt-16 md:mt-20">
        <div
          className="
            relative overflow-hidden bg-black
            h-[calc(100svh-4rem)] md:h-[calc(100svh-5rem)]
          "
        >
          <HeroVideo {...heroCuts('home')} />

          {/* Bottom overlay — tagline + Cloudbeds availability bar (à la RecenterLife).
              Neutral black, not `--dark`: that token is #340000, a burgundy, and
              tinting the whole lower half of the footage with it read as a colour
              cast over the photography rather than as shade. Same opacities, so
              the h1 keeps exactly the contrast it had. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
          />
          <div className="absolute inset-x-0 bottom-0">
            <div className="w-[85%] md:w-[88%] mx-auto pb-8 md:pb-12">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
                className="font-display font-light text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.02] tracking-[-0.01em] max-w-3xl"
              >
                Immersed in nature, awakened to essence.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: "easeOut", delay: 0.45 }}
                className="mt-7 md:mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
              >
                <CheckAvailabilityBar />
                <span className="font-body text-xs md:text-sm text-cream/80 tracking-[0.02em]">
                  Santa Teresa, Costa Rica
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
