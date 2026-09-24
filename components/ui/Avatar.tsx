import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar pengguna',
  fallback = 'A',
  size = 'md',
  status,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
    xl: 'h-14 w-14 text-lg',
  }[size];

  const statusSize = {
    sm: 'h-2 w-2 ring-1',
    md: 'h-2.5 w-2.5 ring-2',
    lg: 'h-3 w-3 ring-2',
    xl: 'h-3.5 w-3.5 ring-2',
  }[size];

  const statusColor = {
    online: 'bg-[var(--aura-success-500)]',
    busy: 'bg-[var(--aura-danger-500)]',
    offline: 'bg-[var(--aura-neutral-500)]',
  };

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--bg-soft)] font-medium text-[var(--text-primary)] border border-[var(--border-subtle)] select-none overflow-hidden ${sizeStyles} ${className}`}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="uppercase">{fallback.slice(0, 2)}</span>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-[var(--bg-elevated)] ${statusSize} ${statusColor[status]}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
