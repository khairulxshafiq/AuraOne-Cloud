import React from 'react';

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = 'Langkau ke kandungan utama',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[var(--aura-z-toast)] focus:rounded-lg focus:border focus:border-[var(--accent-primary)] focus:bg-[var(--bg-elevated)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--accent-primary)] focus:shadow-[var(--aura-shadow-lg)] focus:outline-hidden"
    >
      {label}
    </a>
  );
};
