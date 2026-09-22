import type { Subscription, SubscriptionInsight } from '@/types';

const DAY_MS = 24 * 60 * 60 * 1000;

export function calculateSubscriptionInsight(sub: Subscription): SubscriptionInsight {
  const now = Date.now();
  let score = 0;

  // Usage recency scoring
  if (sub.lastUsedDate !== null) {
    const daysSinceUse = Math.floor((now - sub.lastUsedDate) / DAY_MS);
    if (daysSinceUse > 45) score += 45;
    else if (daysSinceUse > 30) score += 30;
    else if (daysSinceUse > 15) score += 15;
  } else {
    score += 45; // never used
  }

  // Amount scoring
  if (sub.amount >= 500) score += 30;
  else if (sub.amount >= 200) score += 20;
  else score += 10;

  // Duplicate scoring
  if (sub.isDuplicate) score += 15;

  // Low usage frequency
  if (sub.usageFrequency <= 2) score += 10;

  score = Math.min(score, 100);

  let recommendation: Subscription['status'];
  let estimatedAnnualSaving = 0;

  if (score >= 60) {
    recommendation = 'REVIEW';
    estimatedAnnualSaving = sub.amount * 12;
  } else if (score >= 35) {
    recommendation = 'CONSIDER PAUSING';
  } else {
    recommendation = 'KEEP';
  }

  const explanation = buildExplanation(sub, score, recommendation, estimatedAnnualSaving);

  return {
    subscriptionId: sub.id,
    score,
    recommendation,
    estimatedAnnualSaving,
    explanation,
  };
}

function buildExplanation(
  sub: Subscription,
  score: number,
  recommendation: Subscription['status'],
  saving: number
): string {
  const now = Date.now();
  const daysSinceUse =
    sub.lastUsedDate !== null ? Math.floor((now - sub.lastUsedDate) / DAY_MS) : null;

  const parts: string[] = [];

  if (daysSinceUse !== null && daysSinceUse > 45) {
    parts.push(`You have not used ${sub.name} for ${daysSinceUse} days.`);
  } else if (daysSinceUse !== null && daysSinceUse > 15) {
    parts.push(`You last used ${sub.name} ${daysSinceUse} days ago.`);
  } else if (daysSinceUse === null) {
    parts.push(`No usage data found for ${sub.name}.`);
  } else {
    parts.push(`You used ${sub.name} recently.`);
  }

  parts.push(`It renews at ₹${sub.amount}/month.`);

  if (sub.isDuplicate) {
    parts.push('This appears to overlap with another similar service.');
  }

  if (recommendation === 'REVIEW') {
    parts.push(`Reviewing it could save approximately ₹${saving.toLocaleString('en-IN')} per year.`);
  } else if (recommendation === 'CONSIDER PAUSING') {
    parts.push('Consider pausing this subscription to save money.');
  } else {
    parts.push('This subscription seems worth keeping.');
  }

  return parts.join(' ');
}

export function calculateAllInsights(subs: Subscription[]): SubscriptionInsight[] {
  return subs.map(calculateSubscriptionInsight);
}
