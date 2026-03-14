"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Yoga", href: "/yoga" },
  { label: "Stay", href: "/accommodations" },
  { label: "Retreats", href: "/retreats" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 50); };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-cream/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-between h-20">
            <Link href="/" className="font-serif text-2xl text-dark">HOS</Link>
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link key={item.label} href={item.href} className="text-sm tracking-wide text-dark/80 hover:text-dark transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
            {/* Cloudbeds Immersive Book Button */}
            {/*<div className="hidden md:block cloudbeds-btn-container">
              <cb-book-now-button 
                property-code='zE6Wy8' 
              ></cb-book-now-button>
            </div>*/}
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-dark" aria-label="Open menu">
              <Menu className="w-6 h-6" />
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-dark/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4, ease: "easeOut" }} className="absolute right-0 top-0 bottom-0 w-80 bg-cream shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-12">
                  <span className="font-serif text-2xl text-dark">HOS</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-dark" aria-label="Close menu">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-6">
                  {navItems.map((item, index) => (
                    <motion.div key={item.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
                      <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block font-serif text-2xl text-dark hover:text-burgundy transition-colors">
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12">
                  <Link href="#book" onClick={() => setIsMobileMenuOpen(false)} className="block text-center bg-dark text-cream py-4 rounded-md text-sm tracking-wide uppercase hover:bg-dark-light transition-colors">
                    Book Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
