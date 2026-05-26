"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Yoga", href: "/yoga" },
  { label: "Stay", href: "/accommodations" },
  { label: "Retreats", href: "/retreats" },
  { label: "Gallery", href: "/gallery" },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-warm-white"
      >
        <div className="w-[90%] mx-auto">
          <nav className="grid grid-cols-3 items-center h-16 md:h-20">
            {/* Left — menu + search */}
            <div className="flex items-center gap-4 md:gap-6 justify-self-start">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="group flex items-center gap-3 text-ink"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
                <span className="hidden md:inline text-xs tracking-[0.25em] uppercase">
                  Menu
                </span>
              </button>
              <button
                className="hidden md:inline-flex text-ink"
                aria-label="Search"
              >
                <Search className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Center — logo */}
            <Link
              href="/"
              className="justify-self-center font-display font-light text-xl md:text-2xl tracking-[0.15em] text-ink"
            >
              HOS
            </Link>

            {/* Right — language + reserve */}
            <div className="flex items-center gap-4 md:gap-6 justify-self-end">
              <button
                className="hidden md:inline-flex text-xs tracking-[0.25em] uppercase text-ink hover:text-ink transition-colors duration-500"
                aria-label="Language"
              >
                English
              </button>
              <Link
                href="#reserve"
                className="bg-dark text-cream px-4 md:px-6 py-2.5 md:py-3 text-[10px] md:text-xs tracking-[0.25em] uppercase hover:bg-dark-light transition-colors duration-500"
              >
                Reserve
              </Link>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-0 top-0 bottom-0 w-full sm:w-96 bg-cream"
            >
              <div className="h-full flex flex-col p-8">
                <div className="flex justify-between items-center mb-16">
                  <span className="font-display font-light text-xl tracking-[0.15em] text-ink">
                    HOS
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-ink"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>
                <nav className="space-y-8">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.08, duration: 0.6 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block font-display font-light text-3xl text-ink hover:text-burgundy transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
