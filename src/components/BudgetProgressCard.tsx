import { formatCurrency } from '@/utils/format';

interface BudgetProgressCardProps {
  budget: number;
  spend: number;
  remaining: number;
  percentage: number;
  alertAt: number;
  label?: string;
  delayClass?: string;
}

export function BudgetProgressCard({
  budget,
  spend,
  remaining,
  percentage,
  alertAt,
  label = 'Gaming Budget',
  delayClass = '',
}: BudgetProgressCardProps) {
  const isDanger = percentage >= 100;
  const isWarning = percentage >= alertAt && percentage < 100;
  const barColor = isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#6D28D9';
  const statusText = isDanger
    ? 'Budget exceeded'
    : isWarning
      ? 'Approaching limit'
      : 'On track';
  const statusColor = isDanger ? 'text-danger' : isWarning ? 'text-warning' : 'text-success';

  return (
    <div className={`card p-4 animate-slide-up animate-fill-both ${delayClass}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{label}</h3>
          <p className={`text-xs font-medium ${statusColor}`}>{statusText}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold font-display" style={{ color: barColor }}>
            {Math.round(percentage)}%
          </p>
          <p className="text-[10px] text-text-muted">used</p>
        </div>
      </div>

      <div className="h-3 bg-base-bg rounded-full overflow-hidden mb-3 relative">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            background: `linear-gradient(90deg, ${barColor}dd, ${barColor})`,
          }}
        />
        {alertAt < 100 && (
          <div
            className="absolute top-0 h-full w-0.5 bg-text-muted/40"
            style={{ left: `${alertAt}%` }}
            aria-label={`${alertAt}% alert threshold`}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text-muted">Budget</p>
          <p className="text-sm font-bold text-text-primary">{formatCurrency(budget)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text-muted">Spent</p>
          <p className="text-sm font-bold" style={{ color: barColor }}>{formatCurrency(spend)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text-muted">Left</p>
          <p className="text-sm font-bold text-text-primary">{formatCurrency(Math.max(0, remaining))}</p>
        </div>
      </div>
    </div>
  );
}
