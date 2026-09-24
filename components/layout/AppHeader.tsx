import React from 'react';

export interface AppHeaderProps {
  title?: React.ReactNode;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  className = '',
}) => {
  return (
    <header
      className={`sticky top-0 z-[var(--aura-z-header)] flex h-[var(--aura-header-height)] w-full items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-glass)] px-4 backdrop-blur-md transition-colors sm:px-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        {leftAction}
        {title && <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>}
      </div>

      {rightAction && <div className="flex items-center gap-2.5">{rightAction}</div>}
    </header>
  );
};
