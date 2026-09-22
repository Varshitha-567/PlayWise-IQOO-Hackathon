import type { Transaction, RecurringPayment } from '@/types';

const RECURRING_KEYWORDS = ['autopay', 'renewal', 'subscription', 'membership', 'recurring'];
const CYCLE_DAYS = [30, 90, 365];
const TOLERANCE = 5; // ±5 days tolerance

export function detectRecurringPayments(transactions: Transaction[]): RecurringPayment[] {
  const byMerchant = new Map<string, Transaction[]>();
  for (const t of transactions) {
    const key = t.merchant.toLowerCase().trim();
    const arr = byMerchant.get(key) ?? [];
    arr.push(t);
    byMerchant.set(key, arr);
  }

  const results: RecurringPayment[] = [];

  for (const [merchant, txs] of byMerchant) {
    if (txs.length < 2) continue;
    const sorted = [...txs].sort((a, b) => a.transactionDate - b.transactionDate);

    const intervals: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      intervals.push(
        Math.round((sorted[i].transactionDate - sorted[i - 1].transactionDate) / (1000 * 60 * 60 * 24))
      );
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const matchesCycle = CYCLE_DAYS.some(
      (cycle) => Math.abs(avgInterval - cycle) <= TOLERANCE
    );

    const hasRecurringKeyword = sorted.some((t) =>
      RECURRING_KEYWORDS.some((kw) => t.description.toLowerCase().includes(kw))
    );

    if (matchesCycle || hasRecurringKeyword) {
      let confidence = 50;
      if (matchesCycle) confidence += 30;
      if (hasRecurringKeyword) confidence += 20;
      confidence = Math.min(confidence, 100);

      results.push({
        merchant,
        averageIntervalDays: Math.round(avgInterval),
        confidence,
        transactions: sorted,
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}
