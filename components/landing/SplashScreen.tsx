"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

// ─── Brand splash / preloader ────────────────────────────────────────────────
// Plays the House of Shakti celestial mark on the first load AND on every
// client-side route change (App Router), acting as a soft veil over each
// internal navigation. The mark breathes — a continuous pulse + slow rotation
// with an expanding ring — so the pause feels alive rather than static.
const HOLD_MS = 2200; // time the mark breathes before fading out

export function SplashScreen() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  // Replay on first mount and on every route change.
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="hos-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-warm-white"
          aria-hidden
        >
          {/* Celestial mark — appears and fades, no ring */}
          <motion.img
            src="/logos/crescent-sun-rays.png"
            alt=""
            draggable={false}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: [0, 1, 1], scale: [0.94, 1, 0.99] }}
            transition={{ duration: 1.6, ease: "easeOut", times: [0, 0.5, 1] }}
            className="h-20 w-auto select-none md:h-24"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
