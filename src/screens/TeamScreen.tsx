import { useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import { calculateExpenseStatus } from '@/ai/TeamSplitCalculator';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionTitle } from '@/components/SectionTitle';
import { formatCurrency, formatDateShort, getInitials } from '@/utils/format';
import { Users, Plus, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import type { SplitType, ExpenseStatus } from '@/types';

interface TeamScreenProps {
  onNavigate: (route: string) => void;
}

const STATUS_COLORS: Record<ExpenseStatus, string> = {
  PENDING: '#F59E0B',
  'PARTIALLY PAID': '#FFC107',
  SETTLED: '#22C55E',
};

export function TeamScreen({ onNavigate }: TeamScreenProps) {
  const { state } = useApp();
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(null);

  const selectedExpense = state.teamExpenses.find((e) => e.id === selectedExpenseId);
  const selectedMembers = state.teamMembers.filter((m) => m.expenseId === selectedExpenseId);

  const totalCollected = selectedMembers.reduce((sum, m) => sum + m.paidAmount, 0);
  const totalPending = selectedExpense ? selectedExpense.totalAmount - totalCollected : 0;

  if (selectedExpense) {
    return (
      <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-5">
        <div className="flex items-center gap-3 animate-fade-in">
          <button
            onClick={() => setSelectedExpenseId(null)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-base-surface border border-base-border"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
          </button>
          <h1 className="text-xl font-bold font-display text-text-primary">Expense Details</h1>
        </div>

        <div className="card p-4 animate-slide-up animate-fill-both">
          <h2 className="text-base font-semibold text-text-primary mb-1">{selectedExpense.title}</h2>
          <p className="text-xs text-text-secondary mb-3">{selectedExpense.description}</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold font-display text-text-primary">{formatCurrency(selectedExpense.totalAmount)}</span>
            <span className="chip font-bold" style={{ color: STATUS_COLORS[selectedExpense.status], backgroundColor: `${STATUS_COLORS[selectedExpense.status]}20` }}>
              {selectedExpense.status}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-base-border">
            <div>
              <p className="text-[10px] uppercase text-text-muted">Collected</p>
              <p className="text-sm font-bold text-success">{formatCurrency(totalCollected)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-text-muted">Pending</p>
              <p className="text-sm font-bold text-warning">{formatCurrency(totalPending)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-text-muted">Split</p>
              <p className="text-sm font-bold text-text-primary">{selectedExpense.splitType}</p>
            </div>
          </div>
        </div>

        <SectionTitle title="Team Members" />
        <div className="space-y-2">
          {selectedMembers.map((m) => (
            <div key={m.id} className="card p-3 flex items-center justify-between animate-slide-up animate-fill-both">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-700/20 text-sm font-bold text-primary-400">
                  {getInitials(m.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{m.name}</p>
                  <p className="text-xs text-text-muted">
                    Expected: {formatCurrency(m.expectedAmount)} · Paid: {formatCurrency(m.paidAmount)}
                  </p>
                </div>
              </div>
              {m.paymentStatus === 'PAID' ? (
                <span className="chip bg-success/10 text-success border border-success/30">
                  <Check className="h-3 w-3" /> Paid
                </span>
              ) : (
                <MarkPaidButton memberId={m.id} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalCollectedAll = state.teamMembers.reduce((sum, m) => sum + m.paidAmount, 0);
  const totalPendingAll = state.teamExpenses.reduce((sum, e) => sum + e.totalAmount, 0) - totalCollectedAll;

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-5">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold font-display text-text-primary mb-1">Team Wallet</h1>
        <p className="text-sm text-text-secondary">Split and track shared expenses</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up animate-fill-both">
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1">Total Collected</p>
          <p className="text-xl font-bold font-display text-success">{formatCurrency(totalCollectedAll)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-1">Pending</p>
          <p className="text-xl font-bold font-display text-warning">{formatCurrency(Math.max(0, totalPendingAll))}</p>
        </div>
      </div>

      <PrimaryButton fullWidth onClick={() => onNavigate('create_team_expense')}>
        <Plus className="h-4 w-4" />
        Create Expense
      </PrimaryButton>

      {/* Expense list */}
      {state.teamExpenses.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team expenses yet"
          description="Create a shared expense to split it among your team members."
          actionLabel="Create Expense"
          onAction={() => onNavigate('create_team_expense')}
        />
      ) : (
        <div className="space-y-3">
          {state.teamExpenses.map((expense) => {
            const members = state.teamMembers.filter((m) => m.expenseId === expense.id);
            const collected = members.reduce((s, m) => s + m.paidAmount, 0);
            const paid = members.filter((m) => m.paymentStatus === 'PAID').length;
            return (
              <div
                key={expense.id}
                onClick={() => setSelectedExpenseId(expense.id)}
                className="card card-hover p-4 cursor-pointer animate-slide-up animate-fill-both"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-text-primary truncate flex-1 mr-2">{expense.title}</h4>
                  <span className="chip font-bold shrink-0" style={{ color: STATUS_COLORS[expense.status], backgroundColor: `${STATUS_COLORS[expense.status]}20` }}>
                    {expense.status}
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-3">{formatDateShort(expense.expenseDate)} · {expense.splitType} split</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold font-display text-text-primary">{formatCurrency(expense.totalAmount)}</span>
                  <span className="text-xs text-text-secondary">{paid}/{members.length} paid</span>
                </div>
                <div className="h-1.5 bg-base-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{ width: `${(collected / expense.totalAmount) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-muted">Tap for details</span>
                  <ChevronRight className="h-4 w-4 text-text-muted" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MarkPaidButton({ memberId }: { memberId: number }) {
  const { markMemberPaid } = useApp();
  return (
    <button
      onClick={() => markMemberPaid(memberId)}
      className="chip bg-primary-700/20 text-primary-400 border border-primary-600/30 hover:bg-primary-700/30 transition-colors cursor-pointer"
    >
      Mark Paid
    </button>
  );
}
