import { useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import { calculateSubscriptionInsight } from '@/ai/SubscriptionInsightEngine';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { EmptyState } from '@/components/EmptyState';
import { SectionTitle } from '@/components/SectionTitle';
import { PrimaryButton } from '@/components/PrimaryButton';
import { formatCurrency } from '@/utils/format';
import { CreditCard, Plus } from 'lucide-react';
import type { SubscriptionCategory, SubscriptionStatus } from '@/types';

type FilterChip = 'All' | 'Entertainment' | 'Gaming' | 'Cloud' | 'AI Tools' | 'Review Needed';

const FILTERS: FilterChip[] = ['All', 'Entertainment', 'Gaming', 'Cloud', 'AI Tools', 'Review Needed'];

const ENTERTAINMENT_CATS: SubscriptionCategory[] = ['Music', 'OTT'];
const GAMING_CATS: SubscriptionCategory[] = ['Gaming'];
const CLOUD_CATS: SubscriptionCategory[] = ['Cloud Storage'];
const AI_CATS: SubscriptionCategory[] = ['AI Tools'];

interface SubscriptionsScreenProps {
  onNavigate: (route: string) => void;
}

export function SubscriptionsScreen({ onNavigate }: SubscriptionsScreenProps) {
  const { state, updateSubscriptionStatus } = useApp();
  const [filter, setFilter] = useState<FilterChip>('All');

  const filtered = useMemo(() => {
    return state.subscriptions.filter((sub) => {
      switch (filter) {
        case 'Entertainment': return ENTERTAINMENT_CATS.includes(sub.category);
        case 'Gaming': return GAMING_CATS.includes(sub.category);
        case 'Cloud': return CLOUD_CATS.includes(sub.category);
        case 'AI Tools': return AI_CATS.includes(sub.category);
        case 'Review Needed': return sub.status === 'REVIEW' || sub.status === 'CONSIDER PAUSING';
        default: return true;
      }
    });
  }, [state.subscriptions, filter]);

  const totalSavings = useMemo(() => {
    return state.subscriptions.reduce((sum, s) => {
      const insight = calculateSubscriptionInsight(s);
      return sum + insight.estimatedAnnualSaving;
    }, 0);
  }, [state.subscriptions]);

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto">
      <div className="mb-4 animate-fade-in">
        <h1 className="text-2xl font-bold font-display text-text-primary mb-1">Subscriptions</h1>
        <p className="text-sm text-text-secondary">
          {state.subscriptions.length} active · {formatCurrency(totalSavings)} potential yearly savings
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-2 -mx-4 px-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`chip whitespace-nowrap ${
              filter === f
                ? 'bg-primary-700 text-white'
                : 'bg-base-surface text-text-secondary border border-base-border hover:border-primary-600/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No subscriptions found"
          description="Add a subscription to start tracking your recurring payments."
          actionLabel="Add Subscription"
          onAction={() => onNavigate('add_subscription')}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((sub, i) => {
            const insight = calculateSubscriptionInsight(sub);
            return (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                explanation={insight.explanation}
                annualSaving={insight.estimatedAnnualSaving}
                onStatusChange={(status) => updateSubscriptionStatus(sub.id, status)}
              />
            );
          })}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => onNavigate('add_subscription')}
        className="fixed bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-primary-900/40 hover:scale-105 active:scale-95 transition-transform z-10"
        aria-label="Add subscription"
      >
        <Plus className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}
