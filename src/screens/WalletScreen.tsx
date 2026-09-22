import { useMemo, useState } from 'react';
import { useApp } from '@/store/AppContext';
import { computeCategorySpending } from '@/utils/dashboardSelector';
import { BudgetProgressCard } from '@/components/BudgetProgressCard';
import { TransactionRow } from '@/components/TransactionRow';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionTitle } from '@/components/SectionTitle';
import { formatCurrency, isSameMonth, getMonthName } from '@/utils/format';
import { Gamepad2, Plus, ShoppingBag, Pencil, Wallet as WalletIcon } from 'lucide-react';

interface WalletScreenProps {
  onNavigate: (route: string) => void;
}

export function WalletScreen({ onNavigate }: WalletScreenProps) {
  const { state } = useApp();
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  const gamingTx = useMemo(
    () => state.transactions.filter((t) => t.isGaming),
    [state.transactions]
  );

  const currentMonthGaming = gamingTx.filter((t) => isSameMonth(t.transactionDate));
  const gamingSpend = currentMonthGaming.reduce((sum, t) => sum + t.amount, 0);
  const budget = state.budget.monthlyGamingBudget;
  const remaining = Math.max(0, budget - gamingSpend);
  const percentage = budget > 0 ? (gamingSpend / budget) * 100 : 0;

  const categorySpending = useMemo(() => computeCategorySpending(state.transactions), [state.transactions]);

  const { updateBudget } = useApp();

  const handleSaveBudget = () => {
    const val = parseFloat(budgetInput);
    if (val > 0) {
      updateBudget({ monthlyGamingBudget: val });
      setEditingBudget(false);
      setBudgetInput('');
    }
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-5">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold font-display text-text-primary mb-1">GamerWallet</h1>
        <p className="text-sm text-text-secondary">{getMonthName()} spending</p>
      </div>

      {/* Budget progress */}
      <BudgetProgressCard
        budget={budget}
        spend={gamingSpend}
        remaining={remaining}
        percentage={percentage}
        alertAt={state.budget.alertAtPercentage}
        delayClass="animate-delay-100"
      />

      {/* Budget warning/danger banners */}
      {percentage >= 100 && (
        <div className="card border-danger/30 bg-danger/5 p-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-danger" />
            <p className="text-sm font-medium text-danger">
              You have exceeded your gaming budget by {Math.round(percentage - 100)}%.
            </p>
          </div>
        </div>
      )}
      {percentage >= state.budget.alertAtPercentage && percentage < 100 && (
        <div className="card border-warning/30 bg-warning/5 p-4 animate-slide-up">
          <div className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-warning" />
            <p className="text-sm font-medium text-warning">
              You have used {Math.round(percentage)}% of your gaming budget.
            </p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        {editingBudget ? (
          <div className="col-span-2 card p-3 space-y-2">
            <input
              type="number"
              placeholder="New monthly gaming budget"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="input-field"
            />
            <div className="flex gap-2">
              <PrimaryButton size="sm" onClick={handleSaveBudget}>Save</PrimaryButton>
              <PrimaryButton size="sm" variant="secondary" onClick={() => setEditingBudget(false)}>Cancel</PrimaryButton>
            </div>
          </div>
        ) : (
          <>
            <PrimaryButton variant="secondary" fullWidth onClick={() => { setBudgetInput(String(budget)); setEditingBudget(true); }}>
              <Pencil className="h-4 w-4" />
              Update Budget
            </PrimaryButton>
            <PrimaryButton variant="primary" fullWidth onClick={() => onNavigate('add_transaction')}>
              <Plus className="h-4 w-4" />
              Add Expense
            </PrimaryButton>
          </>
        )}
      </div>

      <PrimaryButton variant="outline" fullWidth onClick={() => onNavigate('purchase')}>
        <ShoppingBag className="h-4 w-4" />
        Check a Purchase
      </PrimaryButton>

      {/* Category spending */}
      {categorySpending.length > 0 && (
        <div className="animate-slide-up animate-fill-both">
          <SectionTitle title="Spending by Category" />
          <div className="card p-4 space-y-3">
            {categorySpending.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-text-primary">{cat.category}</span>
                  <span className="text-xs font-bold text-text-primary">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="h-2 bg-base-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent gaming transactions */}
      <div className="animate-slide-up animate-fill-both">
        <SectionTitle title="Gaming Transactions" />
        {currentMonthGaming.length === 0 ? (
          <EmptyState
            icon={Gamepad2}
            title="No gaming expenses yet"
            description="Add your first gaming expense to start tracking your spending."
            actionLabel="Add Expense"
            onAction={() => onNavigate('add_transaction')}
          />
        ) : (
          <div className="card p-3 divide-y divide-base-border">
            {currentMonthGaming.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
