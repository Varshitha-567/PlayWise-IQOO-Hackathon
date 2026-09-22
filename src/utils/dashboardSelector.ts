import { isSameMonth } from '@/utils/format';
import { calculateAllInsights } from '@/ai/SubscriptionInsightEngine';
import type { AppState } from '@/store/AppContext';
import type { DashboardSummary, Insight, CategorySpending } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  'Gaming Top-up': '#6D28D9',
  'Battle Pass': '#8B5CF6',
  'In-App Purchase': '#A78BFA',
  Tournament: '#FFC107',
  'Gaming Accessory': '#22C55E',
  'Game Subscription': '#F59E0B',
  Music: '#EF4444',
  OTT: '#F87171',
  'Cloud Storage': '#3B82F6',
  'AI Tools': '#10B981',
  Other: '#6B7280',
  Food: '#EC4899',
  Transport: '#06B6D4',
};

export function computeDashboardSummary(state: AppState): DashboardSummary {
  const currentMonthTx = state.transactions.filter((t) => isSameMonth(t.transactionDate));
  const totalDigitalSpend = currentMonthTx.reduce((sum, t) => sum + t.amount, 0);
  const gamingSpend = currentMonthTx.filter((t) => t.isGaming).reduce((sum, t) => sum + t.amount, 0);
  const subscriptionSpend = currentMonthTx
    .filter((t) => t.isRecurring)
    .reduce((sum, t) => sum + t.amount, 0);

  const activeSubs = state.subscriptions;
  const insights = calculateAllInsights(activeSubs);
  const potentialAnnualSavings = insights.reduce((sum, i) => sum + i.estimatedAnnualSaving, 0);

  const monthlyGamingBudget = state.budget.monthlyGamingBudget;
  const remainingGamingBudget = Math.max(0, monthlyGamingBudget - gamingSpend);
  const budgetUsagePercentage = monthlyGamingBudget > 0 ? (gamingSpend / monthlyGamingBudget) * 100 : 0;

  const now = Date.now();
  const upcomingRenewals = activeSubs
    .filter((s) => s.renewalDate > now && s.renewalDate < now + 30 * 24 * 60 * 60 * 1000)
    .sort((a, b) => a.renewalDate - b.renewalDate);

  const recentTransactions = state.transactions.slice(0, 5);
  const safetyAlert = state.riskChecks.find((r) => r.riskLevel === 'HIGH RISK') ?? null;

  const dashboardInsights: Insight[] = [];

  if (potentialAnnualSavings > 0) {
    dashboardInsights.push({
      id: 'savings',
      type: 'savings',
      title: 'Potential annual savings detected',
      explanation: `You could save ₹${potentialAnnualSavings.toLocaleString('en-IN')}/year by reviewing unused or duplicate subscriptions.`,
      value: `₹${potentialAnnualSavings.toLocaleString('en-IN')}`,
    });
  }

  if (budgetUsagePercentage >= state.budget.alertAtPercentage) {
    dashboardInsights.push({
      id: 'budget-warning',
      type: budgetUsagePercentage >= 100 ? 'danger' : 'warning',
      title: budgetUsagePercentage >= 100 ? 'Gaming budget exceeded' : 'Gaming budget alert',
      explanation:
        budgetUsagePercentage >= 100
          ? `You have exceeded your monthly gaming budget by ${Math.round(budgetUsagePercentage - 100)}%.`
          : `You have used ${Math.round(budgetUsagePercentage)}% of your gaming budget.`,
      value: `${Math.round(budgetUsagePercentage)}%`,
    });
  }

  if (upcomingRenewals.length > 0) {
    const next = upcomingRenewals[0];
    const days = Math.ceil((next.renewalDate - now) / (1000 * 60 * 60 * 24));
    dashboardInsights.push({
      id: 'renewal',
      type: 'info',
      title: `${next.name} renews soon`,
      explanation: `${next.name} renews in ${days} days at ₹${next.amount}/month. ${next.status === 'REVIEW' ? 'Review it to avoid an unwanted renewal.' : ''}`,
    });
  }

  if (safetyAlert) {
    dashboardInsights.push({
      id: 'safety',
      type: 'danger',
      title: 'High-risk offer detected',
      explanation: `A recent risk check flagged "${safetyAlert.offerTitle}" as HIGH RISK. Avoid this offer.`,
      value: safetyAlert.riskScore.toString(),
    });
  }

  if (dashboardInsights.length === 0) {
    dashboardInsights.push({
      id: 'all-good',
      type: 'success',
      title: 'Your spending looks healthy',
      explanation: 'No urgent alerts. Keep tracking your subscriptions and gaming expenses.',
    });
  }

  return {
    userName: state.settings.userName,
    totalDigitalSpend,
    gamingSpend,
    subscriptionSpend,
    activeSubscriptionCount: activeSubs.length,
    potentialAnnualSavings,
    monthlyGamingBudget,
    remainingGamingBudget,
    budgetUsagePercentage,
    upcomingRenewals,
    insights: dashboardInsights,
    recentTransactions,
    safetyAlert,
  };
}

export function computeCategorySpending(transactions: { amount: number; category: string; isGaming: boolean; transactionDate: number }[]): CategorySpending[] {
  const currentMonth = transactions.filter((t) => t.isGaming && isSameMonth(t.transactionDate));
  const total = currentMonth.reduce((sum, t) => sum + t.amount, 0);
  if (total === 0) return [];

  const byCategory = new Map<string, number>();
  for (const t of currentMonth) {
    byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
  }

  const result: CategorySpending[] = [];
  for (const [category, amount] of byCategory) {
    result.push({
      category,
      amount,
      percentage: (amount / total) * 100,
      color: CATEGORY_COLORS[category] ?? '#6B7280',
    });
  }

  return result.sort((a, b) => b.amount - a.amount);
}
