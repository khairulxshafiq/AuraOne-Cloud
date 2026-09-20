import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string; // Strictly required for accessibility
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center rounded-lg transition-all select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.96]';

    const sizeStyles = {
      sm: 'h-8 w-8 min-h-[36px] min-w-[36px]',
      md: 'h-10 w-10 min-h-[44px] min-w-[44px]', // WCAG 2.5.5 touch target compliant
      lg: 'h-12 w-12 min-h-[48px] min-w-[48px]',
    }[size];

    const variantStyles = {
      primary:
        'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-sm focus-visible:outline-[var(--accent-primary)]',
      secondary:
        'bg-[var(--bg-soft)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus-visible:outline-[var(--accent-primary)]',
      outline:
        'bg-transparent hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-strong)] focus-visible:outline-[var(--accent-primary)]',
      ghost:
        'bg-transparent hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-[var(--accent-primary)]',
      danger:
        'bg-transparent hover:bg-[var(--aura-danger-50)] text-[var(--aura-danger-500)] focus-visible:outline-[var(--aura-danger-500)]',
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
        ) : (
          <span className="inline-flex shrink-0 text-current" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
