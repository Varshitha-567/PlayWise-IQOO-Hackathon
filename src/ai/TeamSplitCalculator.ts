import type { SplitType, ExpenseStatus } from '@/types';

export interface SplitInput {
  totalAmount: number;
  splitType: SplitType;
  memberNames: string[];
  percentages?: number[];
  customAmounts?: number[];
}

export interface SplitResult {
  success: boolean;
  error?: string;
  expectedAmounts: number[];
  expenseStatus: ExpenseStatus;
}

const TOLERANCE = 1.0; // ₹1 tolerance for custom splits

export function calculateSplit(input: SplitInput): SplitResult {
  const { totalAmount, splitType, memberNames, percentages, customAmounts } = input;

  if (memberNames.length === 0) {
    return { success: false, error: 'Add at least one team member.', expectedAmounts: [], expenseStatus: 'PENDING' };
  }

  if (totalAmount <= 0) {
    return { success: false, error: 'Total amount must be greater than zero.', expectedAmounts: [], expenseStatus: 'PENDING' };
  }

  if (splitType === 'Equal') {
    const baseShare = Math.floor((totalAmount / memberNames.length) * 100) / 100;
    const expectedAmounts = new Array(memberNames.length).fill(baseShare);
    // Assign remaining paisa to last member
    const allocated = baseShare * memberNames.length;
    const remainder = Math.round((totalAmount - allocated) * 100) / 100;
    if (remainder > 0) {
      expectedAmounts[expectedAmounts.length - 1] = Math.round((baseShare + remainder) * 100) / 100;
    }
    return { success: true, expectedAmounts, expenseStatus: 'PENDING' };
  }

  if (splitType === 'Percentage') {
    if (!percentages || percentages.length !== memberNames.length) {
      return { success: false, error: 'Percentage must be provided for each member.', expectedAmounts: [], expenseStatus: 'PENDING' };
    }
    const totalPct = percentages.reduce((a, b) => a + b, 0);
    if (totalPct !== 100) {
      return { success: false, error: `Percentages must total 100%. Currently: ${totalPct}%.`, expectedAmounts: [], expenseStatus: 'PENDING' };
    }
    const expectedAmounts = percentages.map((p) => Math.round((totalAmount * p / 100) * 100) / 100);
    return { success: true, expectedAmounts, expenseStatus: 'PENDING' };
  }

  if (splitType === 'Custom') {
    if (!customAmounts || customAmounts.length !== memberNames.length) {
      return { success: false, error: 'Custom amount must be provided for each member.', expectedAmounts: [], expenseStatus: 'PENDING' };
    }
    const totalCustom = customAmounts.reduce((a, b) => a + b, 0);
    if (Math.abs(totalCustom - totalAmount) > TOLERANCE) {
      return {
        success: false,
        error: `Custom amounts (₹${totalCustom.toFixed(2)}) must equal the total (₹${totalAmount.toFixed(2)}).`,
        expectedAmounts: [],
        expenseStatus: 'PENDING',
      };
    }
    const expectedAmounts = customAmounts.map((a) => Math.round(a * 100) / 100);
    return { success: true, expectedAmounts, expenseStatus: 'PENDING' };
  }

  return { success: false, error: 'Unknown split type.', expectedAmounts: [], expenseStatus: 'PENDING' };
}

export function calculateExpenseStatus(
  totalAmount: number,
  paidTotal: number
): ExpenseStatus {
  if (paidTotal <= 0) return 'PENDING';
  if (paidTotal >= totalAmount - TOLERANCE) return 'SETTLED';
  return 'PARTIALLY PAID';
}
