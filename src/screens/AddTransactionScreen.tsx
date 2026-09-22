import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { classifyTransaction, isGamingCategory } from '@/ai/TransactionClassifier';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ArrowLeft } from 'lucide-react';
import type { PaymentType } from '@/types';

interface AddTransactionScreenProps {
  onBack: () => void;
}

const PAYMENT_TYPES: PaymentType[] = ['UPI', 'Card', 'Wallet', 'App Store', 'Bank', 'Cash'];

export function AddTransactionScreen({ onBack }: AddTransactionScreenProps) {
  const { addTransaction } = useApp();
  const [merchant, setMerchant] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('UPI');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!merchant.trim()) { setError('Enter a merchant name.'); return; }
    if (!description.trim()) { setError('Enter a description.'); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Amount must be greater than zero.'); return; }

    const category = classifyTransaction(description, merchant);
    addTransaction({
      merchant: merchant.trim(),
      description: description.trim(),
      amount: amt,
      transactionDate: Date.now(),
      category,
      paymentType,
      isRecurring: false,
      isGaming: isGamingCategory(category),
      isSuspicious: false,
    });
    onBack();
  };

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-5">
      <div className="flex items-center gap-3 animate-fade-in">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-base-surface border border-base-border"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-text-secondary" />
        </button>
        <h1 className="text-xl font-bold font-display text-text-primary">Add Gaming Expense</h1>
      </div>

      <div className="card p-4 space-y-4 animate-slide-up animate-fill-both">
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Merchant</label>
          <input type="text" placeholder="e.g. BGMI" value={merchant} onChange={(e) => setMerchant(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Description</label>
          <input type="text" placeholder="e.g. UC Top-up 660" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Amount (₹)</label>
          <input type="number" placeholder="e.g. 799" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Payment Type</label>
          <div className="flex gap-2 flex-wrap">
            {PAYMENT_TYPES.map((pt) => (
              <button
                key={pt}
                onClick={() => setPaymentType(pt)}
                className={`chip ${paymentType === pt ? 'bg-primary-700 text-white' : 'bg-base-surfaceLight text-text-secondary border border-base-border'}`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-danger bg-danger/10 rounded-lg p-2">{error}</p>}
        <PrimaryButton fullWidth onClick={handleSubmit}>Add Expense</PrimaryButton>
      </div>
    </div>
  );
}
