import type { InsightType } from '@/types';
import { Sparkles, AlertTriangle, ShieldAlert, Info, TrendingUp, type LucideIcon } from 'lucide-react';

interface InsightCardProps {
  type: InsightType;
  title: string;
  explanation: string;
  value?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const TYPE_CONFIG: Record<InsightType, { icon: LucideIcon; color: string; bg: string }> = {
  savings: { icon: TrendingUp, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
  warning: { icon: AlertTriangle, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  danger: { icon: ShieldAlert, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
  info: { icon: Info, color: '#6D28D9', bg: 'rgba(109, 40, 217, 0.1)' },
  success: { icon: Sparkles, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)' },
};

export function InsightCard({ type, title, explanation, value, actionLabel, onAction }: InsightCardProps) {
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="card p-4 animate-slide-up animate-fill-both">
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: config.bg, color: config.color }}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
            {value && (
              <span className="text-xs font-bold whitespace-nowrap" style={{ color: config.color }}>
                {value}
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{explanation}</p>
          {actionLabel && (
            <button
              onClick={onAction}
              className="mt-3 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
            >
              {actionLabel} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
