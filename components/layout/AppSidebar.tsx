import React from 'react';

export interface AppSidebarProps {
  brand?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  brand,
  children,
  footer,
  className = '',
}) => {
  return (
    <aside
      aria-label="Navigasi Sisi Utama"
      className={`hidden md:flex w-[var(--aura-sidebar-width)] shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)] transition-colors h-screen sticky top-0 ${className}`}
    >
      {brand && (
        <div className="flex h-[var(--aura-header-height)] items-center px-5 border-b border-[var(--border-subtle)]">
          {brand}
        </div>
      )}

      <nav aria-label="Menu Aplikasi" className="flex-1 overflow-y-auto p-4 space-y-1">
        {children}
      </nav>

      {footer && (
        <div className="border-t border-[var(--border-subtle)] p-4 bg-[var(--bg-soft)]/40">
          {footer}
        </div>
      )}
    </aside>
  );
};
