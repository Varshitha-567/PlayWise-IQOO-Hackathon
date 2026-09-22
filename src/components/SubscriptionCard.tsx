import type { Subscription, SubscriptionStatus } from '@/types';
import { formatCurrency, formatDateShort, formatRelativeDate } from '@/utils/format';

interface SubscriptionCardProps {
  subscription: Subscription;
  explanation?: string;
  annualSaving?: number;
  onStatusChange?: (status: SubscriptionStatus) => void;
}

const STATUS_STYLES: Record<SubscriptionStatus, { bg: string; text: string; border: string }> = {
  KEEP: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/30' },
  REVIEW: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  'CONSIDER PAUSING': { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
};

const CATEGORY_ICONS: Record<string, string> = {
  Music: '🎵',
  OTT: '🎬',
  'Cloud Storage': '☁️',
  'AI Tools': '🤖',
  Gaming: '🎮',
};

export function SubscriptionCard({ subscription, explanation, annualSaving, onStatusChange }: SubscriptionCardProps) {
  const style = STATUS_STYLES[subscription.status];
  const icon = CATEGORY_ICONS[subscription.category] ?? '📦';
  const daysToRenewal = Math.ceil((subscription.renewalDate - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="card card-hover p-4 animate-slide-up animate-fill-both">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-base-surfaceLight text-xl shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-text-primary truncate">{subscription.name}</h4>
            <p className="text-xs text-text-muted">{subscription.merchant}</p>
          </div>
        </div>
        <span className={`chip ${style.bg} ${style.text} border ${style.border} shrink-0`}>
          {subscription.status}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-xl font-bold font-display text-text-primary">
          {formatCurrency(subscription.amount)}
        </span>
        <span className="text-xs text-text-muted">/{subscription.billingCycle.toLowerCase()}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text-muted">Renews</p>
          <p className={`text-xs font-medium ${daysToRenewal <= 7 ? 'text-warning' : 'text-text-secondary'}`}>
            {formatRelativeDate(subscription.renewalDate)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-text-muted">Last used</p>
          <p className="text-xs font-medium text-text-secondary">
            {subscription.lastUsedDate ? formatRelativeDate(subscription.lastUsedDate) : 'Never'}
          </p>
        </div>
      </div>

      {explanation && (
        <p className="text-xs text-text-secondary leading-relaxed mb-3 bg-base-bg/50 rounded-lg p-2.5">
          {explanation}
        </p>
      )}

      {(annualSaving && annualSaving > 0) && (
        <div className="flex items-center justify-between bg-success/5 border border-success/20 rounded-lg px-3 py-2 mb-3">
          <span className="text-xs text-success font-medium">Potential annual saving</span>
          <span className="text-sm font-bold text-success">{formatCurrency(annualSaving)}</span>
        </div>
      )}

      {onStatusChange && (
        <div className="flex gap-2">
          {(['KEEP', 'REVIEW', 'CONSIDER PAUSING'] as SubscriptionStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`flex-1 rounded-lg py-1.5 text-[10px] font-medium transition-all ${
                subscription.status === s
                  ? 'bg-primary-700 text-white'
                  : 'bg-base-surfaceLight text-text-secondary hover:bg-base-border'
              }`}
            >
              {s === 'KEEP' ? 'Keep' : s === 'REVIEW' ? 'Review' : 'Pause'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
