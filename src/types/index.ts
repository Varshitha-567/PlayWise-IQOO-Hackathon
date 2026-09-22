export type Category =
  | 'Music'
  | 'OTT'
  | 'Cloud Storage'
  | 'AI Tools'
  | 'Gaming Top-up'
  | 'Battle Pass'
  | 'In-App Purchase'
  | 'Tournament'
  | 'Gaming Accessory'
  | 'Game Subscription'
  | 'Food'
  | 'Transport'
  | 'Other';

export type PaymentType = 'UPI' | 'Card' | 'Wallet' | 'App Store' | 'Bank' | 'Cash';

export interface Transaction {
  id: number;
  merchant: string;
  description: string;
  amount: number;
  transactionDate: number; // epoch ms
  category: string;
  paymentType: PaymentType;
  isRecurring: boolean;
  isGaming: boolean;
  isSuspicious: boolean;
  createdAt: number;
}

export type SubscriptionCategory = 'Music' | 'OTT' | 'Cloud Storage' | 'AI Tools' | 'Gaming';
export type SubscriptionStatus = 'KEEP' | 'REVIEW' | 'CONSIDER PAUSING';
export type BillingCycle = 'Monthly' | 'Quarterly' | 'Yearly';

export interface Subscription {
  id: number;
  name: string;
  merchant: string;
  amount: number;
  billingCycle: BillingCycle;
  renewalDate: number;
  category: SubscriptionCategory;
  lastUsedDate: number | null;
  usageFrequency: number;
  isDuplicate: boolean;
  status: SubscriptionStatus;
  potentialAnnualSaving: number;
  createdAt: number;
}

export interface Budget {
  id: number;
  monthlyGamingBudget: number;
  monthlyDigitalBudget: number;
  alertAtPercentage: number;
}

export type SplitType = 'Equal' | 'Percentage' | 'Custom';
export type ExpenseStatus = 'PENDING' | 'PARTIALLY PAID' | 'SETTLED';

export interface TeamExpense {
  id: number;
  title: string;
  description: string;
  totalAmount: number;
  expenseDate: number;
  splitType: SplitType;
  status: ExpenseStatus;
  createdAt: number;
}

export type PaymentStatus = 'PENDING' | 'PAID';

export interface TeamMember {
  id: number;
  expenseId: number;
  name: string;
  expectedAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
}

export type RiskLevel = 'LOW RISK' | 'REVIEW' | 'HIGH RISK';

export interface RiskCheck {
  id: number;
  merchantName: string;
  offerTitle: string;
  discountPercent: number;
  paymentId: string;
  link: string;
  merchantVerified: boolean;
  paymentIdMatchesMerchant: boolean;
  linkLooksOfficial: boolean;
  riskScore: number;
  riskLevel: RiskLevel;
  explanation: string;
  checkedAt: number;
}

export type PurchaseRecommendation = 'WAIT' | 'REVIEW' | 'LOW VALUE' | 'GOOD TO BUY';

export interface PurchaseEvaluation {
  id: number;
  itemName: string;
  price: number;
  expectedUsageHours: number;
  enjoymentRating: number;
  longTermValue: number;
  affordabilityScore: number;
  valueScore: number;
  recommendation: PurchaseRecommendation;
  explanation: string;
  createdAt: number;
}

export interface AppSettings {
  userName: string;
  monthlyDigitalBudget: number;
  monthlyGamingBudget: number;
  alertAtPercentage: number;
  notificationsEnabled: boolean;
  hasOnboarded: boolean;
}

export interface DashboardSummary {
  userName: string;
  totalDigitalSpend: number;
  gamingSpend: number;
  subscriptionSpend: number;
  activeSubscriptionCount: number;
  potentialAnnualSavings: number;
  monthlyGamingBudget: number;
  remainingGamingBudget: number;
  budgetUsagePercentage: number;
  upcomingRenewals: Subscription[];
  insights: Insight[];
  recentTransactions: Transaction[];
  safetyAlert: RiskCheck | null;
}

export type InsightType = 'savings' | 'warning' | 'danger' | 'info' | 'success';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  explanation: string;
  value?: string;
  actionLabel?: string;
}

export interface SubscriptionInsight {
  subscriptionId: number;
  score: number;
  recommendation: SubscriptionStatus;
  estimatedAnnualSaving: number;
  explanation: string;
}

export interface PurchaseEvaluationResult {
  affordabilityScore: number;
  valueScore: number;
  budgetImpactPercentage: number;
  remainingBudgetAfterPurchase: number;
  recommendation: PurchaseRecommendation;
  explanation: string;
}

export interface RiskResult {
  score: number;
  riskLevel: RiskLevel;
  reasons: string[];
  explanation: string;
  recommendedAction: string;
}

export interface RecurringPayment {
  merchant: string;
  averageIntervalDays: number;
  confidence: number;
  transactions: Transaction[];
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}
