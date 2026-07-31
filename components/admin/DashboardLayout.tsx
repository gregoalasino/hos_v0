'use client';

import { Sidebar } from './Sidebar';

// ─── Legacy color exports ───────────────────────────────────────────────────
// `ADMIN_SAGE` and `ADMIN_TERRA` are referenced by RefersClient.tsx (and
// possibly other 9.x-pending page components). They will be migrated to the
// admin earth-tone palette in Prompt 9.4. Kept here as a no-op surface so
// nothing breaks during the transition.
// TODO: remove these exports once all page files have been migrated.
export const ADMIN_SAGE = '#6B7355'; // olive / sage
export const ADMIN_TERRA = '#8B6F47'; // terracotta

// ─── Admin shell ────────────────────────────────────────────────────────────
// Fixed sidebar on md+ (260px). On mobile the sidebar collapses to an
// off-canvas drawer; a hamburger button (rendered inside <Sidebar />) toggles
// it. `md:ml-[260px]` reserves space on md+ for the fixed sidebar.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-scope min-h-screen flex bg-neutral-50 text-ink">
      <Sidebar />
      <main className="flex-1 min-w-0 md:ml-[260px]">
        {children}
      </main>
    </div>
  );
}
