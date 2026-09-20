'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { SkipLink } from './SkipLink';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { MobileDrawer } from './MobileDrawer';
import { IconButton } from '@/components/ui/IconButton';
import { ThemeToggle } from './ThemeToggle';

export interface AppShellProps {
  brand: React.ReactNode;
  sidebarNav: React.ReactNode;
  headerTitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  brand,
  sidebarNav,
  headerTitle,
  headerActions,
  sidebarFooter,
  children,
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className={`flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] ${className}`}
    >
      <SkipLink targetId="main-content" />

      {/* Desktop Sidebar */}
      <AppSidebar brand={brand} footer={sidebarFooter}>
        {sidebarNav}
      </AppSidebar>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        brand={brand}
        footer={
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Tema Paparan</span>
              <ThemeToggle />
            </div>
            {sidebarFooter}
          </>
        }
      >
        {sidebarNav}
      </MobileDrawer>

      {/* Main App Content Column */}
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader
          title={headerTitle}
          leftAction={
            <IconButton
              icon={<Menu className="h-5 w-5" />}
              aria-label="Buka menu navigasi"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden"
            />
          }
          rightAction={
            <>
              <ThemeToggle className="hidden sm:inline-flex" />
              {headerActions}
            </>
          }
        />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 flex flex-col min-h-0 focus:outline-hidden"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
