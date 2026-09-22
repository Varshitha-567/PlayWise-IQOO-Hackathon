import type { PurchaseEvaluationResult, PurchaseRecommendation } from '@/types';

export interface PurchaseInput {
  itemName: string;
  price: number;
  remainingBudget: number;
  expectedUsageHours: number;
  enjoymentRating: number; // 1-5
  longTermValue: number; // 1-5
}

const VALUE_THRESHOLD = 0.15;

export function evaluatePurchase(input: PurchaseInput): PurchaseEvaluationResult {
  const {
    itemName,
    price,
    remainingBudget,
    expectedUsageHours,
    enjoymentRating,
    longTermValue,
  } = input;

  const affordabilityScore = remainingBudget > 0 ? remainingBudget / price : 0;
  const valueScore =
    price > 0
      ? (expectedUsageHours * enjoymentRating * longTermValue) / price
      : 0;
  const budgetImpactPercentage =
    remainingBudget > 0 ? (price / remainingBudget) * 100 : 100;
  const remainingBudgetAfterPurchase = remainingBudget - price;

  let recommendation: PurchaseRecommendation;
  const parts: string[] = [];

  if (price > remainingBudget) {
    recommendation = 'WAIT';
    parts.push(
      `This ₹${price.toLocaleString('en-IN')} ${itemName} exceeds your remaining gaming budget of ₹${remainingBudget.toLocaleString('en-IN')}.`
    );
    parts.push('Wait until your budget resets next month before purchasing.');
  } else if (affordabilityScore < 1.5) {
    recommendation = 'REVIEW';
    const impactPct = Math.round(budgetImpactPercentage);
    parts.push(
      `This ₹${price.toLocaleString('en-IN')} ${itemName} will consume ${impactPct}% of your remaining gaming budget.`
    );
    parts.push('Consider waiting 24 hours before purchasing.');
  } else if (valueScore < VALUE_THRESHOLD) {
    recommendation = 'LOW VALUE';
    parts.push(
      `The value score for this ${itemName} is low (${valueScore.toFixed(2)}).`
    );
    parts.push(
      'Based on expected usage, enjoyment, and long-term value, this purchase may not be worth the price.'
    );
  } else {
    recommendation = 'GOOD TO BUY';
    parts.push(
      `This ₹${price.toLocaleString('en-IN')} ${itemName} fits within your gaming budget.`
    );
    parts.push(
      `It has a good value score (${valueScore.toFixed(2)}) and leaves you with ₹${remainingBudgetAfterPurchase.toLocaleString('en-IN')} remaining.`
    );
    parts.push('This looks like a worthwhile purchase.');
  }

  return {
    affordabilityScore: Math.round(affordabilityScore * 100) / 100,
    valueScore: Math.round(valueScore * 100) / 100,
    budgetImpactPercentage: Math.round(budgetImpactPercentage * 10) / 10,
    remainingBudgetAfterPurchase: Math.round(remainingBudgetAfterPurchase * 100) / 100,
    recommendation,
    explanation: parts.join(' '),
  };
}
