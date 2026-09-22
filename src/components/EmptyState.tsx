import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-surfaceLight mb-4">
        <Icon className="h-8 w-8 text-text-muted" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary max-w-xs mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
