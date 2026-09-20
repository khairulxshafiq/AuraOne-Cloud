'use client';

import React, { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  side = 'left',
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      if (drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          drawerRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sideStyles =
    side === 'left'
      ? 'left-0 animate-in slide-in-from-left'
      : 'right-0 animate-in slide-in-from-right';

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[var(--aura-z-drawer)] flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`fixed inset-y-0 ${sideStyles} flex w-full max-w-xs flex-col border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-[var(--aura-shadow-lg)] focus:outline-hidden ${
          side === 'left' ? 'border-r' : 'border-l'
        } ${className}`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          {title ? (
            <h2 id={titleId} className="text-base font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
          ) : (
            <span />
          )}

          <IconButton
            icon={<X className="h-4 w-4" />}
            aria-label="Tutup menu navigasi"
            onClick={onClose}
            size="sm"
            variant="ghost"
          />
        </div>

        <div className="flex-1 overflow-y-auto pt-4">{children}</div>
      </div>
    </div>
  );
};
