'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastVariant = 'success' | 'warning' | 'danger' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, message, variant = 'info', durationMs = 5000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, title, message, variant, durationMs };

      setToasts((prev) => [...prev, newToast]);

      if (durationMs > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, durationMs);
      }

      return id;
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Accessible Toast Live Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed bottom-4 right-4 z-[var(--aura-z-toast)] flex max-w-sm w-full flex-col gap-2 p-4 sm:p-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.variant === 'danger' ? 'alert' : 'status'}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-[var(--aura-shadow-lg)] transition-all animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="mt-0.5 shrink-0" aria-hidden="true">
              {toast.variant === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-[var(--feedback-success-text)]" />
              )}
              {toast.variant === 'warning' && (
                <AlertTriangle className="h-5 w-5 text-[var(--feedback-warning-text)]" />
              )}
              {toast.variant === 'danger' && (
                <AlertCircle className="h-5 w-5 text-[var(--feedback-danger-text)]" />
              )}
              {toast.variant === 'info' && (
                <Info className="h-5 w-5 text-[var(--feedback-info-text)]" />
              )}
            </div>

            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[var(--text-secondary)]">{toast.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Tutup pemberitahuan"
              className="rounded p-1 text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
