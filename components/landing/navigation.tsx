'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

// ─── Routes ─────────────────────────────────────────────────────────────────
// Single source of truth for the primary nav links. Rendered only inside
// the drawer (the closed navbar shows just hamburger + logo + lang/CTA,
// matching the Aman pattern).
const navItems: { label: string; href: string }[] = [
  { label: 'Yoga Classes', href: '/yoga' },
  { label: 'Accommodations', href: '/accommodations' },
  { label: 'Retreats', href: '/retreats' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

// ─── Active-route helper ────────────────────────────────────────────────────
// startsWith so /retreats/[slug] keeps the "Retreats" link marked active.
function useActiveRoute() {
  const pathname = usePathname();
  return (href: string): boolean => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };
}

// ─── Scroll-based compact state ─────────────────────────────────────────────
// 80px threshold. rAF-throttled. Also runs once on mount in case the user
// reloads while already scrolled.
function useIsCompact(threshold = 80) {
  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsCompact(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return isCompact;
}

// ─── Logo (image) ───────────────────────────────────────────────────────────
// Heights are explicitly +25% over the previous pass (Santi's spec).
//   Compact:  35px / 45px  (was 28 / 36)
//   Expanded: 45px / 60px  (was 36 / 48)
// `sizeOverride` lets the drawer use a fixed mid-size for its own header.
function HOSLogo({
  isCompact,
  sizeOverride,
}: {
  isCompact: boolean;
  sizeOverride?: string;
}) {
  const sizeClass =
    sizeOverride ??
    (isCompact ? 'h-[35px] lg:h-[45px]' : 'h-[45px] lg:h-[60px]');
  return (
    <img
      src="/logos/logo-hos-negro.webp"
      alt="House of Shakti"
      draggable={false}
      className={`${sizeClass} w-auto select-none transition-all duration-[400ms] ease-out`}
    />
  );
}

// ─── Language toggle (desktop dropdown) ─────────────────────────────────────
// UI-only — no functional language switching yet.
// TODO: implement i18n language switching when ES translations are ready.
function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1 text-ink hover:opacity-70 transition-opacity duration-300 cursor-pointer"
      >
        <span className="font-body text-sm tracking-[0.05em]">English</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
          strokeWidth={1.5}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 bg-warm-white border border-ink/10 py-2 px-1 min-w-[100px]"
          >
            <button
              role="menuitem"
              type="button"
              onClick={() => setOpen(false)}
              className="block w-full text-left font-body text-sm text-ink px-4 py-2 cursor-pointer hover:bg-cream"
            >
              English
            </button>
            <button
              role="menuitem"
              type="button"
              onClick={() => setOpen(false)}
              className="block w-full text-left font-body text-sm text-ink px-4 py-2 cursor-pointer hover:bg-cream"
            >
              Español
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Drawer ─────────────────────────────────────────────────────────────────
// Slides in from LEFT. On desktop: 420px wide panel + dimmed backdrop on the
// remaining area (Aman pattern — lang + Reserve in navbar remain visible to
// the right). On mobile: full-screen, and the drawer also holds lang + CTA
// since they're hidden from the mobile navbar bar.
function Drawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isActive = useActiveRoute();

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Body scroll lock while drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — dims the rest of the page on desktop. Click closes.
              Uses bg-ink (warm charcoal) instead of bg-dark (burgundy) so the
              overlay reads as a neutral, editorial fog rather than a colored
              tint on the warm-white page. */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/30"
          />

          {/* Drawer panel */}
          <motion.div
            id="primary-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full lg:w-[420px] bg-warm-white"
          >
            <div className="h-full flex flex-col p-6 sm:p-8">
              {/* Drawer top — X (left), logo (center) */}
              <div className="flex items-center justify-between border-b border-ink/10 pb-6">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="text-ink hover:opacity-70 transition-opacity duration-300 cursor-pointer"
                >
                  <X className="w-[22px] h-[22px]" strokeWidth={1.5} />
                </button>

                <Link
                  href="/"
                  onClick={onClose}
                  className="inline-flex items-center hover:opacity-80 transition-opacity duration-300"
                >
                  <HOSLogo isCompact={false} sizeOverride="h-9" />
                </Link>

                {/* Spacer to balance the X on the left so the logo sits centered */}
                <span aria-hidden className="w-[22px] h-[22px]" />
              </div>

              {/* Nav links */}
              <nav className="mt-12 space-y-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`block font-display font-light text-ink text-2xl ${
                      isActive(item.href)
                        ? 'underline underline-offset-4 decoration-[0.5px]'
                        : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Mobile-only: language toggle + Reserve CTA inside drawer.
                  Desktop has these in the navbar's right zone (visible above
                  the backdrop), so they don't repeat here. */}
              <div className="lg:hidden">
                {/* Language toggle.
                    TODO: implement i18n language switching when ES translations
                    are ready. Currently UI-only. */}
                <div className="border-t border-ink/10 pt-6 flex items-center gap-4">
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-ink">
                    Language
                  </span>
                  <button
                    type="button"
                    className="font-body text-sm text-ink underline underline-offset-4 decoration-[0.5px]"
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className="font-body text-sm text-ink/40"
                  >
                    Español
                  </button>
                </div>

                {/* Reserve — bottom of mobile drawer */}
                <Link
                  href="/accommodations"
                  onClick={onClose}
                  className="block w-full text-center bg-dark text-cream font-body text-sm py-4 hover:bg-burgundy transition-colors duration-300 mt-8"
                >
                  Reserve
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isCompact = useIsCompact(80);

  const heightClass = isCompact ? 'h-14 lg:h-20' : 'h-20 lg:h-28';

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          bg-warm-white
          transition-all duration-[400ms] ease-out
          ${heightClass}
        `}
      >
        <div className="h-full w-full px-4 sm:px-6 lg:px-12 grid grid-cols-3 items-center">
          {/* LEFT — hamburger (+ "Menu" text on desktop) */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-controls="primary-drawer"
            aria-expanded={drawerOpen}
            className="justify-self-start flex items-center gap-4 lg:gap-5 text-ink hover:opacity-70 transition-opacity duration-300 cursor-pointer"
          >
            <Menu className="w-[22px] h-[22px]" strokeWidth={1.5} />
            <span className="hidden lg:inline font-body text-sm tracking-[0.05em]">
              Menu
            </span>
          </button>

          {/* CENTER — Logo */}
          <Link
            href="/"
            className="justify-self-center inline-flex items-center hover:opacity-80 transition-opacity duration-300 leading-none"
          >
            <HOSLogo isCompact={isCompact} />
          </Link>

          {/* RIGHT — language toggle + Reserve (desktop only) */}
          <div className="hidden lg:flex items-center gap-6 justify-self-end">
            <LanguageToggle />
            <Link
              href="/accommodations"
              className="bg-dark text-cream font-body text-sm tracking-[0.05em] px-6 py-2.5 hover:bg-burgundy transition-colors duration-300"
            >
              Reserve
            </Link>
          </div>

          {/* Mobile spacer to keep the grid balanced (so the logo stays centered) */}
          <div className="lg:hidden justify-self-end" />
        </div>
      </motion.header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
