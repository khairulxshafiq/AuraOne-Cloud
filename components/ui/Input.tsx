import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, id, className = '', disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium tracking-wide text-[var(--text-secondary)] uppercase"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className="pointer-events-none absolute left-3 flex items-center text-[var(--text-muted)]"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy || undefined}
            className={`w-full rounded-lg border bg-[var(--surface-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-[var(--aura-danger-500)] focus-visible:outline-[var(--aura-danger-500)]'
                : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus-visible:outline-[var(--accent-primary)]'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center text-[var(--text-muted)]">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-[var(--feedback-danger-text)]"
          >
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={hintId} className="text-xs text-[var(--text-muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
