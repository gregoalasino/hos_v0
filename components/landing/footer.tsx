"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const exploreLinks = [
  { label: "Yoga", href: "/yoga" },
  { label: "Stay", href: "/accommodations" },
  { label: "Retreats", href: "/retreats" },
  { label: "Gallery", href: "/gallery" },
];

const connectLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "hello@houseofshakti.com", href: "mailto:hello@houseofshakti.com" },
];

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer ref={ref} className="bg-dark text-cream">
      <div className="w-[90%] md:w-[80%] mx-auto py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24"
        >
          {/* Brand */}
          <div>
            <p className="text-base tracking-wide text-cream mb-6">
              House of Shakti
            </p>
            <address className="not-italic text-sm leading-relaxed text-cream/60 space-y-1">
              <p>Playa Hermosa</p>
              <p>Santa Teresa</p>
              <p>Costa Rica</p>
            </address>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-cream/50 mb-6">
              Explore
            </p>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/80 hover:text-cream transition-colors duration-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-cream/50 mb-6">
              Connect
            </p>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm text-cream/80 hover:text-cream transition-colors duration-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom strip */}
        <div className="mt-24 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[10px] tracking-[0.25em] uppercase text-cream/50">
            © {new Date().getFullYear()} House of Shakti
          </p>
          <a
            href="https://whitespacez.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.25em] uppercase text-cream/40 hover:text-cream/70 transition-colors duration-500"
          >
            Crafted by Whitespacez
          </a>
        </div>
      </div>
    </footer>
  );
}
