import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { classifyTransaction, isGamingCategory } from '@/ai/TransactionClassifier';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ArrowLeft } from 'lucide-react';
import type { SubscriptionCategory, BillingCycle } from '@/types';

interface AddSubscriptionScreenProps {
  onBack: () => void;
}

export function AddSubscriptionScreen({ onBack }: AddSubscriptionScreenProps) {
  const { addSubscription } = useApp();
  const [name, setName] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory>('OTT');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('Monthly');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!name.trim()) { setError('Enter a subscription name.'); return; }
    if (!merchant.trim()) { setError('Enter a merchant name.'); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError('Amount must be greater than zero.'); return; }

    addSubscription({
      name: name.trim(),
      merchant: merchant.trim(),
      amount: amt,
      billingCycle,
      renewalDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      category,
      lastUsedDate: Date.now(),
      usageFrequency: 5,
      isDuplicate: false,
      status: 'KEEP',
      potentialAnnualSaving: 0,
    });
    onBack();
  };

  const categories: SubscriptionCategory[] = ['Music', 'OTT', 'Cloud Storage', 'AI Tools', 'Gaming'];
  const cycles: BillingCycle[] = ['Monthly', 'Quarterly', 'Yearly'];

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
        <h1 className="text-xl font-bold font-display text-text-primary">Add Subscription</h1>
      </div>

      <div className="card p-4 space-y-4 animate-slide-up animate-fill-both">
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Subscription Name</label>
          <input type="text" placeholder="e.g. Netflix" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Merchant</label>
          <input type="text" placeholder="e.g. Netflix" value={merchant} onChange={(e) => setMerchant(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Amount (₹)</label>
          <input type="number" placeholder="e.g. 199" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Category</label>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`chip ${category === cat ? 'bg-primary-700 text-white' : 'bg-base-surfaceLight text-text-secondary border border-base-border'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Billing Cycle</label>
          <div className="flex gap-2">
            {cycles.map((c) => (
              <button
                key={c}
                onClick={() => setBillingCycle(c)}
                className={`chip ${billingCycle === c ? 'bg-primary-700 text-white' : 'bg-base-surfaceLight text-text-secondary border border-base-border'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-xs text-danger bg-danger/10 rounded-lg p-2">{error}</p>}
        <PrimaryButton fullWidth onClick={handleSubmit}>Add Subscription</PrimaryButton>
      </div>
    </div>
  );
}
