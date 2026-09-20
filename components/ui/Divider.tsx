import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  label,
  className = '',
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block h-full w-[1px] bg-[var(--border-subtle)] ${className}`}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`relative flex items-center justify-center my-4 ${className}`}
        {...props}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-subtle)]" />
        </div>
        <span className="relative bg-[var(--bg-primary)] px-3 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </span>
      </div>
    );
  }

  return (
    <hr
      className={`my-3 border-0 border-t border-[var(--border-subtle)] ${className}`}
      {...props}
    />
  );
};
