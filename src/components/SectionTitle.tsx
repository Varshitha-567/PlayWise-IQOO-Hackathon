interface SectionTitleProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, actionLabel, onAction }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">{title}</h3>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
        >
          {actionLabel} →
        </button>
      )}
    </div>
  );
}
