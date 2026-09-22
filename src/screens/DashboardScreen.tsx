import { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { computeDashboardSummary } from '@/utils/dashboardSelector';
import { SummaryCard } from '@/components/SummaryCard';
import { InsightCard } from '@/components/InsightCard';
import { BudgetProgressCard } from '@/components/BudgetProgressCard';
import { TransactionRow } from '@/components/TransactionRow';
import { SectionTitle } from '@/components/SectionTitle';
import { RiskBadge } from '@/components/RiskBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { formatCurrency, formatDateShort, formatRelativeDate } from '@/utils/format';
import {
  Wallet,
  Gamepad2,
  CreditCard,
  PiggyBank,
  ShieldAlert,
  ShoppingBag,
  RefreshCw,
  Sparkles,
  Calendar,
  ChevronRight,
} from 'lucide-react';

interface DashboardScreenProps {
  onNavigate: (route: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const { state, resetDemoData } = useApp();
  const summary = useMemo(() => computeDashboardSummary(state), [state]);

  return (
    <div className="px-4 pt-6 pb-24 space-y-5 max-w-md mx-auto">
      {/* Greeting */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold font-display text-text-primary">
              Hello, {summary.userName} <span className="inline-block">👋</span>
            </h1>
            <p className="text-sm text-text-secondary">Your digital spending, simplified.</p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-base-surface border border-base-border hover:border-primary-600/50 transition-colors"
            aria-label="Settings"
          >
            <Sparkles className="h-5 w-5 text-primary-400" />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          icon={Wallet}
          title="Total Digital Spend"
          value={formatCurrency(summary.totalDigitalSpend)}
          subtitle="This month"
          accentColor="#6D28D9"
          delayClass="animate-delay-100"
        />
        <SummaryCard
          icon={Gamepad2}
          title="Gaming Spend"
          value={formatCurrency(summary.gamingSpend)}
          subtitle="This month"
          accentColor="#FFC107"
          delayClass="animate-delay-200"
        />
        <SummaryCard
          icon={CreditCard}
          title="Active Subscriptions"
          value={summary.activeSubscriptionCount.toString()}
          subtitle={`${formatCurrency(summary.subscriptionSpend)} recurring`}
          accentColor="#8B5CF6"
          delayClass="animate-delay-300"
        />
        <SummaryCard
          icon={PiggyBank}
          title="Potential Savings"
          value={formatCurrency(summary.potentialAnnualSavings)}
          subtitle="Per year"
          accentColor="#22C55E"
          delayClass="animate-delay-400"
        />
      </div>

      {/* Budget progress */}
      <BudgetProgressCard
        budget={summary.monthlyGamingBudget}
        spend={summary.gamingSpend}
        remaining={summary.remainingGamingBudget}
        percentage={summary.budgetUsagePercentage}
        alertAt={state.budget.alertAtPercentage}
        delayClass="animate-delay-500"
      />

      {/* Upcoming renewals */}
      {summary.upcomingRenewals.length > 0 && (
        <div className="animate-slide-up animate-fill-both animate-delay-500">
          <SectionTitle
            title="Upcoming Renewals"
            actionLabel="View All"
            onAction={() => onNavigate('subscriptions')}
          />
          <div className="card p-3 space-y-2">
            {summary.upcomingRenewals.slice(0, 3).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-surfaceLight">
                    <Calendar className="h-4 w-4 text-primary-400" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{sub.name}</p>
                    <p className="text-xs text-text-muted">{formatRelativeDate(sub.renewalDate)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-text-primary shrink-0">{formatCurrency(sub.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="animate-slide-up animate-fill-both animate-delay-500">
        <SectionTitle title="AI Insights" />
        <div className="space-y-3">
          {summary.insights.map((insight) => (
            <InsightCard
              key={insight.id}
              type={insight.type}
              title={insight.title}
              explanation={insight.explanation}
              value={insight.value}
              actionLabel={insight.actionLabel}
            />
          ))}
        </div>
      </div>

      {/* Safety alert */}
      {summary.safetyAlert && (
        <div className="card p-4 border-danger/30 animate-slide-up animate-fill-both">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-danger" aria-hidden="true" />
              <h4 className="text-sm font-semibold text-text-primary">Safety Alert</h4>
            </div>
            <RiskBadge level={summary.safetyAlert.riskLevel} score={summary.safetyAlert.riskScore} size="sm" />
          </div>
          <p className="text-xs text-text-secondary mb-2">{summary.safetyAlert.explanation}</p>
          <button
            onClick={() => onNavigate('safety')}
            className="text-xs font-medium text-danger hover:text-danger-light transition-colors"
          >
            View details →
          </button>
        </div>
      )}

      {/* Recent transactions */}
      <div className="animate-slide-up animate-fill-both">
        <SectionTitle
          title="Recent Transactions"
          actionLabel="View All"
          onAction={() => onNavigate('wallet')}
        />
        <div className="card p-3 divide-y divide-base-border">
          {summary.recentTransactions.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <PrimaryButton variant="primary" fullWidth onClick={() => onNavigate('purchase')}>
          <ShoppingBag className="h-4 w-4" />
          Check a Purchase
        </PrimaryButton>
        <PrimaryButton variant="secondary" fullWidth onClick={() => { resetDemoData(); }}>
          <RefreshCw className="h-4 w-4" />
          Reset Demo Data
        </PrimaryButton>
      </div>
    </div>
  );
}
