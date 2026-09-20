import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'gold' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full select-none';

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 leading-none',
    md: 'text-xs px-2.5 py-1 gap-1.5 leading-tight',
  }[size];

  const variantStyles = {
    default:
      'bg-[var(--bg-soft)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
    primary:
      'bg-[var(--aura-purple-100)] text-[var(--aura-purple-900)] dark:bg-[var(--aura-purple-950)] dark:text-[var(--aura-purple-300)] border border-[var(--border-accent)]',
    gold: 'bg-[var(--aura-gold-100)] text-[var(--aura-gold-900)] dark:bg-[var(--aura-gold-950)] dark:text-[var(--aura-gold-300)] border border-[var(--accent-premium)]/30',
    success:
      'bg-[var(--feedback-success-bg)] text-[var(--feedback-success-text)] border border-[var(--feedback-success-border)]',
    warning:
      'bg-[var(--feedback-warning-bg)] text-[var(--feedback-warning-text)] border border-[var(--feedback-warning-border)]',
    danger:
      'bg-[var(--feedback-danger-bg)] text-[var(--feedback-danger-text)] border border-[var(--feedback-danger-border)]',
    info: 'bg-[var(--feedback-info-bg)] text-[var(--feedback-info-text)] border border-[var(--feedback-info-border)]',
  }[variant];

  const dotStyles = {
    default: 'bg-[var(--text-muted)]',
    primary: 'bg-[var(--accent-primary)]',
    gold: 'bg-[var(--accent-premium)]',
    success: 'bg-[var(--aura-success-500)]',
    warning: 'bg-[var(--aura-warning-500)]',
    danger: 'bg-[var(--aura-danger-500)]',
    info: 'bg-[var(--aura-info-500)]',
  }[variant];

  return (
    <span className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`} {...props}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotStyles}`} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
};
