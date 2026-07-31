'use client';

import type { ReactNode } from 'react';

// PageHeader — consistent header for every admin page.
// Layout:
//   Desktop (md+): heading left, actions right, bottom-aligned
//   Mobile (<md):  stack vertically, actions below the heading
type PageHeaderProps = {
  eyebrow?: string;
  heading: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, heading, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-6 mb-10 lg:mb-12">
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-ink/50">
            {eyebrow}
          </p>
        )}
        <h1 className="font-body text-2xl lg:text-3xl font-normal text-black leading-tight mt-2">
          {heading}
        </h1>
        {description && (
          <p className="font-body text-sm text-ink/60 leading-normal mt-2">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 md:flex-shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}
