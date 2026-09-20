import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  action?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  action,
  className = '',
  ...props
}) => {
  const variantStyles = {
    info: 'border-[var(--feedback-info-border)] bg-[var(--feedback-info-bg)] text-[var(--feedback-info-text)]',
    success:
      'border-[var(--feedback-success-border)] bg-[var(--feedback-success-bg)] text-[var(--feedback-success-text)]',
    warning:
      'border-[var(--feedback-warning-border)] bg-[var(--feedback-warning-bg)] text-[var(--feedback-warning-text)]',
    danger:
      'border-[var(--feedback-danger-border)] bg-[var(--feedback-danger-bg)] text-[var(--feedback-danger-text)]',
  }[variant];

  const IconComponent = {
    info: Info,
    success: CheckCircle2,
    warning: AlertTriangle,
    danger: AlertCircle,
  }[variant];

  return (
    <div
      role={variant === 'danger' ? 'alert' : 'region'}
      aria-label={title || 'Makluman sistem'}
      className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${variantStyles} ${className}`}
      {...props}
    >
      <IconComponent className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex-1 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-xs opacity-90 leading-relaxed">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
