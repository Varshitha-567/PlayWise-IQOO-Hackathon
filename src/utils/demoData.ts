import type {
  Transaction,
  Subscription,
  Budget,
  TeamExpense,
  TeamMember,
  RiskCheck,
  AppSettings,
} from '@/types';
import { daysFromNow, daysAgo } from './format';
import { classifyTransaction, isGamingCategory } from '@/ai/TransactionClassifier';

export const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Aarav',
  monthlyDigitalBudget: 5000,
  monthlyGamingBudget: 2000,
  alertAtPercentage: 80,
  notificationsEnabled: true,
  hasOnboarded: false,
};

export function seedSubscriptions(): Subscription[] {
  return [
    {
      id: 1,
      name: 'Spotify Premium',
      merchant: 'Spotify',
      amount: 119,
      billingCycle: 'Monthly',
      renewalDate: daysFromNow(4),
      category: 'Music',
      lastUsedDate: daysAgo(3),
      usageFrequency: 15,
      isDuplicate: false,
      status: 'KEEP',
      potentialAnnualSaving: 0,
      createdAt: Date.now(),
    },
    {
      id: 2,
      name: 'Amazon Prime',
      merchant: 'Amazon Prime',
      amount: 299,
      billingCycle: 'Monthly',
      renewalDate: daysFromNow(9),
      category: 'OTT',
      lastUsedDate: daysAgo(5),
      usageFrequency: 8,
      isDuplicate: false,
      status: 'KEEP',
      potentialAnnualSaving: 0,
      createdAt: Date.now(),
    },
    {
      id: 3,
      name: 'Google One Storage',
      merchant: 'Google One',
      amount: 299,
      billingCycle: 'Monthly',
      renewalDate: daysFromNow(7),
      category: 'Cloud Storage',
      lastUsedDate: daysAgo(46),
      usageFrequency: 0,
      isDuplicate: true,
      status: 'REVIEW',
      potentialAnnualSaving: 3588,
      createdAt: Date.now(),
    },
    {
      id: 4,
      name: 'ChatGPT Plus',
      merchant: 'OpenAI',
      amount: 1999,
      billingCycle: 'Monthly',
      renewalDate: daysFromNow(14),
      category: 'AI Tools',
      lastUsedDate: daysAgo(2),
      usageFrequency: 20,
      isDuplicate: false,
      status: 'KEEP',
      potentialAnnualSaving: 0,
      createdAt: Date.now(),
    },
    {
      id: 5,
      name: 'Discord Nitro',
      merchant: 'Discord',
      amount: 99,
      billingCycle: 'Monthly',
      renewalDate: daysFromNow(12),
      category: 'Gaming',
      lastUsedDate: daysAgo(25),
      usageFrequency: 2,
      isDuplicate: false,
      status: 'CONSIDER PAUSING',
      potentialAnnualSaving: 0,
      createdAt: Date.now(),
    },
  ];
}

export function seedTransactions(): Transaction[] {
  const raw: { merchant: string; description: string; amount: number; daysAgo: number; paymentType: Transaction['paymentType']; isRecurring: boolean }[] = [
    { merchant: 'Spotify', description: 'Spotify Premium Autopay', amount: 119, daysAgo: 2, paymentType: 'UPI', isRecurring: true },
    { merchant: 'Amazon Prime', description: 'Amazon Prime Membership', amount: 299, daysAgo: 4, paymentType: 'UPI', isRecurring: true },
    { merchant: 'Google One', description: 'Google One Storage Renewal', amount: 299, daysAgo: 6, paymentType: 'Card', isRecurring: true },
    { merchant: 'OpenAI', description: 'ChatGPT Plus Subscription', amount: 1999, daysAgo: 1, paymentType: 'Card', isRecurring: true },
    { merchant: 'BGMI', description: 'BGMI UC Top-up', amount: 799, daysAgo: 3, paymentType: 'UPI', isRecurring: false },
    { merchant: 'BGMI', description: 'Battle Pass Purchase', amount: 399, daysAgo: 5, paymentType: 'UPI', isRecurring: false },
    { merchant: 'Esports Arena', description: 'College Esports Tournament', amount: 500, daysAgo: 7, paymentType: 'UPI', isRecurring: false },
    { merchant: 'Amazon', description: 'Gaming Headset Purchase', amount: 1499, daysAgo: 8, paymentType: 'Card', isRecurring: false },
    { merchant: 'CheapUC Store', description: 'Suspicious UC Deal', amount: 199, daysAgo: 1, paymentType: 'UPI', isRecurring: false },
    { merchant: 'Swiggy', description: 'Food Order', amount: 280, daysAgo: 2, paymentType: 'UPI', isRecurring: false },
    { merchant: 'Metro', description: 'Metro Travel', amount: 60, daysAgo: 1, paymentType: 'Wallet', isRecurring: false },
  ];

  return raw.map((r, i) => {
    const category = classifyTransaction(r.description, r.merchant);
    const isGaming = isGamingCategory(category) || r.description.toLowerCase().includes('gaming');
    const isSuspicious = r.merchant === 'CheapUC Store';
    return {
      id: i + 1,
      merchant: r.merchant,
      description: r.description,
      amount: r.amount,
      transactionDate: daysAgo(r.daysAgo),
      category,
      paymentType: r.paymentType,
      isRecurring: r.isRecurring,
      isGaming,
      isSuspicious,
      createdAt: Date.now(),
    };
  });
}

export function seedBudget(): Budget {
  return {
    id: 1,
    monthlyGamingBudget: 2000,
    monthlyDigitalBudget: 5000,
    alertAtPercentage: 80,
  };
}

export function seedTeamExpense(): { expense: TeamExpense; members: TeamMember[] } {
  const expense: TeamExpense = {
    id: 1,
    title: 'College Esports Tournament Registration',
    description: 'City-level college tournament team entry',
    totalAmount: 1500,
    expenseDate: daysAgo(7),
    splitType: 'Equal',
    status: 'PARTIALLY PAID',
    createdAt: Date.now(),
  };

  const members: TeamMember[] = [
    { id: 1, expenseId: 1, name: 'Aarav', expectedAmount: 500, paidAmount: 500, paymentStatus: 'PAID' },
    { id: 2, expenseId: 1, name: 'Meera', expectedAmount: 500, paidAmount: 500, paymentStatus: 'PAID' },
    { id: 3, expenseId: 1, name: 'Rohan', expectedAmount: 500, paidAmount: 0, paymentStatus: 'PENDING' },
  ];

  return { expense, members };
}

export function seedRiskCheck(): RiskCheck {
  return {
    id: 1,
    merchantName: 'CheapUC Store',
    offerTitle: '70% Discount BGMI UC Top-up',
    discountPercent: 70,
    paymentId: 'cheapuc@upi',
    link: 'cheapuc-store.xyz/buy-uc',
    merchantVerified: false,
    paymentIdMatchesMerchant: false,
    linkLooksOfficial: false,
    riskScore: 100,
    riskLevel: 'HIGH RISK',
    explanation:
      'High Risk: The offer has an unusually high discount, the merchant is unverified, and the payment ID does not match the merchant. Risk score: 100/100.',
    checkedAt: daysAgo(1),
  };
}
