import type { LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface SummaryCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  accentColor?: string;
  onClick?: () => void;
  delayClass?: string;
}

export function SummaryCard({
  icon: Icon,
  title,
  value,
  subtitle,
  accentColor = '#6D28D9',
  onClick,
  delayClass = '',
}: SummaryCardProps) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      onClick={onClick}
      className={`card card-hover p-4 text-left animate-slide-up animate-fill-both ${delayClass} ${onClick ? 'w-full cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="text-xs font-medium text-text-secondary mb-1">{title}</p>
      <p className="text-2xl font-bold font-display text-text-primary tracking-tight">{value}</p>
      {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
    </Component>
  );
}
