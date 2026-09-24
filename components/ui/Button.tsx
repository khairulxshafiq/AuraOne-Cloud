import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium transition-all select-none rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const sizeStyles =
      size === 'sm'
        ? 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5'
        : size === 'lg'
          ? 'text-base px-5 py-2.5 min-h-[48px] gap-2.5'
          : 'text-sm px-4 py-2 min-h-[44px] gap-2';

    const variantStyles =
      variant === 'secondary'
        ? 'bg-[var(--bg-soft)] hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] focus-visible:outline-[var(--accent-primary)]'
        : variant === 'outline'
          ? 'bg-transparent hover:bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border-strong)] focus-visible:outline-[var(--accent-primary)]'
          : variant === 'ghost'
            ? 'bg-transparent hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:outline-[var(--accent-primary)]'
            : variant === 'danger'
              ? 'bg-[var(--aura-danger-600)] hover:bg-[var(--aura-danger-700)] text-white shadow-sm focus-visible:outline-[var(--aura-danger-500)]'
              : variant === 'gold'
                ? 'bg-[var(--accent-premium)] hover:bg-[var(--accent-premium-hover)] text-black font-semibold shadow-sm focus-visible:outline-[var(--accent-premium)]'
                : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-sm focus-visible:outline-[var(--accent-primary)]';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
