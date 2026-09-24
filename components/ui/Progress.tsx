import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'primary' | 'gold' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  const barStyles = {
    primary: 'bg-[var(--accent-primary)]',
    gold: 'bg-[var(--accent-premium)]',
    success: 'bg-[var(--aura-success-500)]',
    danger: 'bg-[var(--aura-danger-500)]',
  }[variant];

  return (
    <div className={`w-full space-y-1.5 ${className}`} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-medium">
          {label && <span className="text-[var(--text-secondary)]">{label}</span>}
          {showValue && <span className="text-[var(--text-muted)]">{percentage}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Kemajuan tugas'}
        className={`w-full overflow-hidden rounded-full bg-[var(--bg-soft)] border border-[var(--border-subtle)] ${heightStyles}`}
      >
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${barStyles}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
