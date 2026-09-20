import React, { forwardRef, useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', disabled, rows = 3, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-medium tracking-wide text-[var(--text-secondary)] uppercase"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={`w-full rounded-lg border bg-[var(--surface-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-all focus-visible:outline-2 focus-visible:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
            error
              ? 'border-[var(--aura-danger-500)] focus-visible:outline-[var(--aura-danger-500)]'
              : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus-visible:outline-[var(--accent-primary)]'
          } ${className}`}
          {...props}
        />

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

Textarea.displayName = 'Textarea';
