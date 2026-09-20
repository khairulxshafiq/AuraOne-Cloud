'use client';

import React from 'react';
import { Drawer } from '@/components/overlays/Drawer';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brand?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  brand,
  children,
  footer,
}) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="left">
      <div className="flex h-full flex-col">
        {brand && <div className="mb-4 pb-3 border-b border-[var(--border-subtle)]">{brand}</div>}

        <nav aria-label="Menu Mudah Alih" className="flex-1 space-y-1 overflow-y-auto">
          {children}
        </nav>

        {footer && (
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] space-y-3">
            {footer}
          </div>
        )}
      </div>
    </Drawer>
  );
};
