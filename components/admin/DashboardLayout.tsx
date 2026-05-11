'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, BookOpen, Users, Tag, Menu, LogOut, Calendar, Ticket,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { tr } from '@/lib/i18n';

export const ADMIN_SAGE  = '#4a7c59';
export const ADMIN_TERRA = '#c4622d';

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { lang, toggleLang } = useLanguage();

  const navItems = [
    { href: '/admin',            label: tr(lang, 'Dashboard',   'Dashboard'),  icon: LayoutDashboard, exact: true  },
    { href: '/admin/calendario', label: tr(lang, 'Calendario',  'Calendar'),   icon: Calendar,        exact: false },
    { href: '/admin/clases',     label: tr(lang, 'Clases',      'Classes'),    icon: BookOpen,        exact: false },
    { href: '/admin/reservas',   label: tr(lang, 'Reservas',    'Bookings'),   icon: Users,           exact: false },
    { href: '/admin/upsells',    label: tr(lang, 'Upsells',     'Upsells'),    icon: Tag,             exact: false },
    { href: '/admin/refers',     label: tr(lang, 'Códigos',     'Refer Codes'), icon: Ticket,          exact: false },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo */}
      <div className="px-5 py-7 border-b border-white/10">
        <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-1">
          {tr(lang, 'Panel admin', 'Admin panel')}
        </p>
        <h1 className="text-base font-semibold text-white">House of Shakti</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150',
                isActive ? 'text-white font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
              style={isActive ? { backgroundColor: ADMIN_SAGE } : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 pt-4 border-t border-white/10 space-y-3">
        {/* User row */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold"
            style={{ backgroundColor: ADMIN_TERRA }}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white leading-none">Admin</p>
            <p className="text-xs text-white/40 mt-0.5 truncate">house of shakti</p>
          </div>
          <button className="text-white/30 hover:text-white/70 transition-colors" aria-label="Logout">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md border border-white/10 hover:border-white/25 transition-colors"
        >
          <span className={`text-[11px] font-medium transition-opacity ${lang === 'es' ? 'text-white' : 'text-white/35'}`}>ES</span>
          <span className="text-[11px] text-white/20">·</span>
          <span className={`text-[11px] font-medium transition-opacity ${lang === 'en' ? 'text-white' : 'text-white/35'}`}>EN</span>
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-56 flex-shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 h-13 bg-slate-900 border-b border-white/10 flex-shrink-0">
          <h1 className="text-sm font-semibold text-white">House of Shakti</h1>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0 border-none">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
