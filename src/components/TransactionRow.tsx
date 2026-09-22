import type { Transaction } from '@/types';
import { formatCurrency, formatDateShort } from '@/utils/format';
import { Gamepad2, AlertTriangle, RefreshCw } from 'lucide-react';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionRow({ transaction, onClick }: TransactionRowProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 py-3 px-1 ${onClick ? 'cursor-pointer hover:bg-base-surfaceLight/50 rounded-lg transition-colors' : ''}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-base-surfaceLight">
        {transaction.isGaming ? (
          <Gamepad2 className="h-4.5 w-4.5 text-primary-400" aria-label="Gaming transaction" />
        ) : transaction.isSuspicious ? (
          <AlertTriangle className="h-4.5 w-4.5 text-danger" aria-label="Suspicious transaction" />
        ) : transaction.isRecurring ? (
          <RefreshCw className="h-4.5 w-4.5 text-text-secondary" aria-label="Recurring transaction" />
        ) : (
          <span className="text-xs font-bold text-text-secondary">
            {transaction.merchant.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{transaction.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-text-muted">{transaction.category}</span>
          <span className="text-text-muted">·</span>
          <span className="text-xs text-text-muted">{formatDateShort(transaction.transactionDate)}</span>
          {transaction.isSuspicious && (
            <span className="chip bg-danger/10 text-danger border border-danger/30 text-[10px]">
              <AlertTriangle className="h-3 w-3" /> Suspicious
            </span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold ${transaction.isSuspicious ? 'text-danger' : 'text-text-primary'}`}>
          −{formatCurrency(transaction.amount)}
        </p>
        <p className="text-[10px] text-text-muted">{transaction.paymentType}</p>
      </div>
    </div>
  );
}
