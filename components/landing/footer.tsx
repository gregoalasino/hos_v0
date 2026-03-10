"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Instagram, Facebook, Mail } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Yoga Classes", href: "#yoga" },
  { label: "Accommodation", href: "#accommodation" },
  { label: "Retreats", href: "#retreats" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Mail, href: "mailto:hello@houseofshakti.com", label: "Email" },
];

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer ref={ref} className="py-20 lg:py-32 bg-dark text-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <h3 className="font-serif text-3xl md:text-4xl mb-6">
              House of Shakti
            </h3>
            <p className="text-cream/70 leading-relaxed max-w-md mb-8">
              A luxury wellness sanctuary where ancient wisdom meets modern comfort. 
              Join us on a journey of transformation and discover your inner radiance.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubmit} className="max-w-md">
              <label htmlFor="newsletter-email" className="text-sm tracking-wide uppercase text-cream/50 mb-3 block">
                Subscribe to Our Newsletter
              </label>
              <div className="flex gap-3">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent border border-cream/30 rounded-md px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-burgundy transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-burgundy text-cream px-5 py-3 rounded-md hover:bg-burgundy-light transition-colors flex items-center gap-2"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          >
            <h4 className="text-sm tracking-[0.2em] uppercase text-cream/50 mb-6">
              Explore
            </h4>
            <nav className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-cream/80 hover:text-burgundy transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <h4 className="text-sm tracking-[0.2em] uppercase text-cream/50 mb-6">
              Connect
            </h4>
            <address className="not-italic space-y-4 text-cream/80 mb-8">
              <p>Playa Hermosa</p>
              <p>Santa Teresa, Costa Rica</p>
              <p>hello@houseofshakti.com</p>
              <p>+62 812 345 6789</p>
            </address>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 border border-cream/30 rounded-full flex items-center justify-center text-cream/70 hover:border-burgundy hover:text-burgundy transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-cream/50">
            &copy; {new Date().getFullYear()} House of Shakti. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-cream/50">
            <Link href="#privacy" className="hover:text-cream transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-cream transition-colors">
              Terms of Service
            </Link>
          </div>
          <div>
            <a
              href="https://whitespacez.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/50 hover:text-primary-foreground text-xs transition-colors"
            >
              Diseñado por whitespacez
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
