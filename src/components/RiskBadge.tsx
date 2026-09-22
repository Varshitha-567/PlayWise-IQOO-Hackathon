import type { RiskLevel } from '@/types';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md';
}

const LEVEL_CONFIG: Record<RiskLevel, { color: string; bg: string; border: string; icon: typeof ShieldCheck }> = {
  'LOW RISK': { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', icon: ShieldCheck },
  REVIEW: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', icon: AlertTriangle },
  'HIGH RISK': { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', icon: ShieldAlert },
};

export function RiskBadge({ level, score, size = 'md' }: RiskBadgeProps) {
  const config = LEVEL_CONFIG[level];
  const Icon = config.icon;
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sizeClass}`}
      style={{ color: config.color, backgroundColor: config.bg, borderColor: config.border }}
      role="status"
      aria-label={`Risk level: ${level}${score !== undefined ? `, score ${score}` : ''}`}
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} aria-hidden="true" />
      {level}
      {score !== undefined && <span className="opacity-70">({score})</span>}
    </span>
  );
}
