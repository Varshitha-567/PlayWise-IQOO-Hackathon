import { useState } from 'react';
import { evaluatePurchase } from '@/ai/PurchaseEvaluator';
import { useApp } from '@/store/AppContext';
import { isSameMonth } from '@/utils/format';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RiskBadge } from '@/components/RiskBadge';
import { Star, ShoppingBag, Clock, TrendingUp, Save, Bell } from 'lucide-react';
import type { PurchaseRecommendation } from '@/types';

const RECOMMENDATION_CONFIG: Record<PurchaseRecommendation, { color: string; bg: string; border: string }> = {
  'GOOD TO BUY': { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  REVIEW: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  'LOW VALUE': { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  WAIT: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

interface PurchaseScreenProps {
  onBack: () => void;
}

export function PurchaseScreen({ onBack }: PurchaseScreenProps) {
  const { state, addPurchaseEvaluation } = useApp();
  const [itemName, setItemName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [hoursText, setHoursText] = useState('');
  const [enjoyment, setEnjoyment] = useState(3);
  const [longTerm, setLongTerm] = useState(3);
  const [validationError, setValidationError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  const gamingSpend = state.transactions
    .filter((t) => t.isGaming && isSameMonth(t.transactionDate))
    .reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = Math.max(0, state.budget.monthlyGamingBudget - gamingSpend);

  const price = parseFloat(priceText) || 0;
  const hours = parseInt(hoursText) || 0;

  const result = itemName && price > 0
    ? evaluatePurchase({
        itemName,
        price,
        remainingBudget,
        expectedUsageHours: hours,
        enjoymentRating: enjoyment,
        longTermValue: longTerm,
      })
    : null;

  const handleEvaluate = () => {
    setValidationError('');
    setSavedSuccess(false);
    setReminderSet(false);

    if (!itemName.trim()) {
      setValidationError('Enter an item name.');
      return;
    }
    if (price <= 0) {
      setValidationError('Price must be greater than zero.');
      return;
    }
    if (hours < 0) {
      setValidationError('Expected usage hours cannot be negative.');
      return;
    }
    if (enjoyment < 1 || enjoyment > 5) {
      setValidationError('Enjoyment rating must be between 1 and 5.');
      return;
    }
    if (longTerm < 1 || longTerm > 5) {
      setValidationError('Long-term value must be between 1 and 5.');
      return;
    }
  };

  const handleSave = () => {
    if (!result) return;
    addPurchaseEvaluation({
      itemName,
      price,
      expectedUsageHours: hours,
      enjoymentRating: enjoyment,
      longTermValue: longTerm,
      affordabilityScore: result.affordabilityScore,
      valueScore: result.valueScore,
      recommendation: result.recommendation,
      explanation: result.explanation,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const recConfig = result ? RECOMMENDATION_CONFIG[result.recommendation] : null;

  return (
    <div className="px-4 pt-6 pb-24 max-w-md mx-auto space-y-5">
      <div className="flex items-center gap-3 animate-fade-in">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-base-surface border border-base-border"
          aria-label="Go back"
        >
          <span className="text-text-secondary">←</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Purchase Evaluator</h1>
          <p className="text-sm text-text-secondary">Is this purchase worth it?</p>
        </div>
      </div>

      {/* Budget context */}
      <div className="card p-4 animate-slide-up animate-fill-both">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-700/20">
              <TrendingUp className="h-4.5 w-4.5 text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-text-muted">Remaining gaming budget</p>
              <p className="text-lg font-bold font-display text-text-primary">₹{remainingBudget.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="card p-4 space-y-4 animate-slide-up animate-fill-both animate-delay-100">
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Item Name</label>
          <input
            type="text"
            placeholder="e.g. BGMI Battle Pass"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Price (₹)</label>
          <input
            type="number"
            placeholder="e.g. 799"
            value={priceText}
            onChange={(e) => setPriceText(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Expected Usage Hours
          </label>
          <input
            type="number"
            placeholder="e.g. 50"
            value={hoursText}
            onChange={(e) => setHoursText(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-accent" /> Enjoyment Rating: {enjoyment}/5
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setEnjoyment(n)}
                className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all ${
                  n <= enjoyment
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-base-surfaceLight text-text-muted border border-base-border'
                }`}
                aria-label={`${n} stars`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-primary-400" /> Long-term Value: {longTerm}/5
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setLongTerm(n)}
                className={`flex-1 h-10 rounded-lg text-sm font-bold transition-all ${
                  n <= longTerm
                    ? 'bg-primary-700/20 text-primary-400 border border-primary-600/30'
                    : 'bg-base-surfaceLight text-text-muted border border-base-border'
                }`}
                aria-label={`${n} rating`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {validationError && (
          <p className="text-xs text-danger bg-danger/10 rounded-lg p-2">{validationError}</p>
        )}

        <PrimaryButton fullWidth onClick={handleEvaluate}>
          <ShoppingBag className="h-4 w-4" />
          Evaluate Purchase
        </PrimaryButton>
      </div>

      {/* Result */}
      {result && recConfig && (
        <div className="card p-4 space-y-4 animate-scale-in animate-fill-both border-2" style={{ borderColor: recConfig.border }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Evaluation Result</h3>
            <span
              className="chip font-bold"
              style={{ color: recConfig.color, backgroundColor: recConfig.bg, border: `1px solid ${recConfig.border}` }}
            >
              {result.recommendation}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-base-bg/50 rounded-lg p-3">
              <p className="text-[10px] uppercase text-text-muted">Affordability Score</p>
              <p className="text-lg font-bold font-display text-text-primary">{result.affordabilityScore.toFixed(2)}</p>
            </div>
            <div className="bg-base-bg/50 rounded-lg p-3">
              <p className="text-[10px] uppercase text-text-muted">Value Score</p>
              <p className="text-lg font-bold font-display text-text-primary">{result.valueScore.toFixed(2)}</p>
            </div>
            <div className="bg-base-bg/50 rounded-lg p-3">
              <p className="text-[10px] uppercase text-text-muted">Budget Impact</p>
              <p className="text-lg font-bold font-display" style={{ color: recConfig.color }}>{result.budgetImpactPercentage.toFixed(1)}%</p>
            </div>
            <div className="bg-base-bg/50 rounded-lg p-3">
              <p className="text-[10px] uppercase text-text-muted">Remaining After</p>
              <p className="text-lg font-bold font-display text-text-primary">₹{Math.round(result.remainingBudgetAfterPurchase).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed bg-base-bg/50 rounded-lg p-3">
            {result.explanation}
          </p>

          {savedSuccess && (
            <p className="text-xs text-success bg-success/10 rounded-lg p-2 animate-fade-in">
              Evaluation saved successfully.
            </p>
          )}

          <div className="flex gap-2">
            <PrimaryButton variant="secondary" size="sm" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" /> Save
            </PrimaryButton>
            <PrimaryButton
              variant="outline"
              size="sm"
              onClick={() => { setReminderSet(true); setTimeout(() => setReminderSet(false), 3000); }}
            >
              <Bell className="h-3.5 w-3.5" /> {reminderSet ? 'Reminder Set!' : '24h Reminder'}
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* History */}
      {state.purchaseEvaluations.length > 0 && (
        <div className="animate-slide-up animate-fill-both">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">Saved Evaluations</h3>
          <div className="space-y-2">
            {state.purchaseEvaluations.slice(0, 5).map((ev) => (
              <div key={ev.id} className="card p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{ev.itemName}</p>
                  <p className="text-xs text-text-muted">₹{ev.price.toLocaleString('en-IN')}</p>
                </div>
                <span
                  className="chip text-[10px] font-bold shrink-0"
                  style={{
                    color: RECOMMENDATION_CONFIG[ev.recommendation].color,
                    backgroundColor: RECOMMENDATION_CONFIG[ev.recommendation].bg,
                  }}
                >
                  {ev.recommendation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
