import type { Transaction } from '@/types';

const CATEGORY_RULES: { keywords: string[]; category: string }[] = [
  { keywords: ['spotify', 'youtube music', 'apple music', 'gaana', 'jiosaavn'], category: 'Music' },
  { keywords: ['netflix', 'prime', 'hotstar', 'jiocinema', 'sony liv', 'zee5', 'disney'], category: 'OTT' },
  { keywords: ['google one', 'icloud', 'dropbox', 'onedrive', 'mega', 'pcloud'], category: 'Cloud Storage' },
  { keywords: ['chatgpt', 'openai', 'canva', 'midjourney', 'claude', 'gemini advanced', 'copilot'], category: 'AI Tools' },
  { keywords: ['bgmi', 'uc', 'free fire', 'diamonds', 'topup', 'top-up', 'unknown cash', 'redeem code'], category: 'Gaming Top-up' },
  { keywords: ['battle pass', 'royale pass', 'season pass', 'bp'], category: 'Battle Pass' },
  { keywords: ['tournament', 'esports', 'entry fee', 'registration'], category: 'Tournament' },
  { keywords: ['headset', 'controller', 'gaming mouse', 'keyboard', 'trigger', 'gaming chair'], category: 'Gaming Accessory' },
  { keywords: ['skin', 'cosmetic', 'emote', 'bundle', 'crate', 'loot'], category: 'In-App Purchase' },
  { keywords: ['discord nitro', 'xbox game pass', 'playstation plus', 'nintendo online'], category: 'Game Subscription' },
  { keywords: ['food', 'swiggy', 'zomato', 'dominos', 'mcdonalds'], category: 'Food' },
  { keywords: ['metro', 'uber', 'ola', 'fuel', 'petrol', 'travel'], category: 'Transport' },
];

const GAMING_CATEGORIES = [
  'Gaming Top-up',
  'Battle Pass',
  'In-App Purchase',
  'Tournament',
  'Gaming Accessory',
  'Game Subscription',
];

export function classifyTransaction(description: string, merchant: string): string {
  const text = `${description} ${merchant}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      return rule.category;
    }
  }
  return 'Other';
}

export function isGamingCategory(category: string): boolean {
  return GAMING_CATEGORIES.includes(category);
}

export function classifyAll(transactions: Transaction[]): Transaction[] {
  return transactions.map((t) => ({
    ...t,
    category: t.category || classifyTransaction(t.description, t.merchant),
    isGaming: t.isGaming || isGamingCategory(t.category),
  }));
}
