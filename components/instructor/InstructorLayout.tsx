'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Users, LogOut, Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const SAGE  = '#4a7c59';
const TERRA = '#c4622d';

interface InstructorLayoutProps {
  children: React.ReactNode;
  instructorName?: string;
  instructorEmail?: string;
}

function SidebarContent({
  instructorName,
  instructorEmail,
  onClose,
}: {
  instructorName?: string;
  instructorEmail?: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/instructor',         label: 'Dashboard',   icon: LayoutDashboard, exact: true  },
    { href: '/instructor/clases',  label: 'Mis Clases',  icon: CalendarDays,    exact: false },
    { href: '/instructor/alumnos', label: 'Alumnos',     icon: Users,           exact: false },
  ];

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/instructor/login');
  }

  const initials = instructorName
    ? instructorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'IN';

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Logo */}
      <div className="px-5 py-7 border-b border-white/10">
        <p className="text-[10px] tracking-[0.35em] uppercase text-white/30 mb-1">
          Portal Instructor
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
                isActive
                  ? 'text-white font-medium'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
              style={isActive ? { backgroundColor: SAGE } : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold"
            style={{ backgroundColor: TERRA }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white leading-none truncate">{instructorName ?? 'Instructor'}</p>
            <p className="text-xs text-white/40 mt-0.5 truncate">{instructorEmail ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/30 hover:text-white/70 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InstructorLayout({
  children,
  instructorName,
  instructorEmail,
}: InstructorLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-56 flex-shrink-0">
        <SidebarContent instructorName={instructorName} instructorEmail={instructorEmail} />
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
              <SidebarContent
                instructorName={instructorName}
                instructorEmail={instructorEmail}
                onClose={() => setMobileOpen(false)}
              />
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
