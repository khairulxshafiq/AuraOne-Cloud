'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '@/lib/theme/useTheme';

interface ThemeToggleProps {
  className?: string;
  variant?: 'cycle' | 'segmented';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', variant = 'cycle' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div
        role="group"
        aria-label="Pilihan tema paparan"
        className={`inline-flex items-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-1 ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
          aria-label="Tema Cerah"
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            theme === 'light'
              ? 'bg-[var(--accent-primary)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sun className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Cerah</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
          aria-label="Tema Gelap"
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-[var(--accent-primary)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Moon className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Gelap</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          aria-pressed={theme === 'system'}
          aria-label="Tema Sistem"
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            theme === 'system'
              ? 'bg-[var(--accent-primary)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Laptop className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sistem</span>
        </button>
      </div>
    );
  }

  // Default cycle variant
  const handleCycle = () => {
    if (theme === 'system') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('system');
    }
  };

  const getLabel = () => {
    if (theme === 'system') return 'Tema Sistem (Klik untuk mod gelap)';
    if (theme === 'dark') return 'Tema Gelap (Klik untuk mod cerah)';
    return 'Tema Cerah (Klik untuk mod sistem)';
  };

  return (
    <button
      type="button"
      onClick={handleCycle}
      aria-label={getLabel()}
      title={getLabel()}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] ${className}`}
    >
      {theme === 'system' ? (
        <Laptop className="h-4 w-4" aria-hidden="true" />
      ) : resolvedTheme === 'dark' ? (
        <Moon className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4 text-[var(--accent-premium)]" aria-hidden="true" />
      )}
    </button>
  );
};
