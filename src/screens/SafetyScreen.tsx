import { useState } from 'react';
import { assessRisk } from '@/ai/ScamRiskEngine';
import { useApp } from '@/store/AppContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RiskBadge } from '@/components/RiskBadge';
import { SectionTitle } from '@/components/SectionTitle';
import { formatDateTime } from '@/utils/format';
import { ShieldCheck, ShieldAlert, Save, AlertTriangle, ArrowLeft } from 'lucide-react';

interface SafetyScreenProps {
  onBack: () => void;
}

export function SafetyScreen({ onBack }: SafetyScreenProps) {
  const { state, addRiskCheck } = useApp();
  const [merchantName, setMerchantName] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [discount, setDiscount] = useState('0');
  const [paymentId, setPaymentId] = useState('');
  const [link, setLink] = useState('');
  const [merchantVerified, setMerchantVerified] = useState(false);
  const [paymentIdMatches, setPaymentIdMatches] = useState(false);
  const [linkOfficial, setLinkOfficial] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const discountNum = parseInt(discount) || 0;
  const result = merchantName.trim()
    ? assessRisk({
        merchantVerified,
        discountPercent: discountNum,
        paymentIdMatchesMerchant: paymentIdMatches,
        linkLooksOfficial: linkOfficial,
        offerTitle,
        link,
      })
    : null;

  const handleCheck = () => {
    setValidationError('');
    setSavedSuccess(false);
    if (!merchantName.trim()) {
      setValidationError('Merchant name cannot be blank.');
      return;
    }
    if (discountNum < 0 || discountNum > 100) {
      setValidationError('Discount must be between 0 and 100.');
      return;
    }
  };

  const handleSave = () => {
    if (!result) return;
    addRiskCheck({
      merchantName,
      offerTitle,
      discountPercent: discountNum,
      paymentId,
      link,
      merchantVerified,
      paymentIdMatchesMerchant: paymentIdMatches,
      linkLooksOfficial: linkOfficial,
      riskScore: result.score,
      riskLevel: result.riskLevel,
      explanation: result.explanation,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
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
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Safety Checker</h1>
          <p className="text-sm text-text-secondary">Check offers before you pay</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="card p-4 space-y-4 animate-slide-up animate-fill-both">
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Merchant Name</label>
          <input
            type="text"
            placeholder="e.g. CheapUC Store"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Offer Title</label>
          <input
            type="text"
            placeholder="e.g. 70% Discount BGMI UC Top-up"
            value={offerTitle}
            onChange={(e) => setOfferTitle(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Discount Percentage: {discountNum}%</label>
          <input
            type="range"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full accent-primary-600"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Payment ID (optional)</label>
          <input
            type="text"
            placeholder="e.g. merchant@upi"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Paste payment link or QR result text</label>
          <input
            type="text"
            placeholder="https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Toggle switches */}
        <div className="space-y-2 pt-2 border-t border-base-border">
          <ToggleRow
            label="Merchant is verified"
            value={merchantVerified}
            onChange={setMerchantVerified}
          />
          <ToggleRow
            label="Payment ID matches merchant"
            value={paymentIdMatches}
            onChange={setPaymentIdMatches}
          />
          <ToggleRow
            label="Link looks official"
            value={linkOfficial}
            onChange={setLinkOfficial}
          />
        </div>

        {validationError && (
          <p className="text-xs text-danger bg-danger/10 rounded-lg p-2">{validationError}</p>
        )}

        <PrimaryButton fullWidth onClick={handleCheck}>
          <ShieldCheck className="h-4 w-4" />
          Check Risk
        </PrimaryButton>
      </div>

      {/* Result */}
      {result && (
        <div className="card p-4 space-y-4 animate-scale-in animate-fill-both border-2" style={{ borderColor: result.riskLevel === 'HIGH RISK' ? 'rgba(239,68,68,0.3)' : result.riskLevel === 'REVIEW' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Risk Assessment</h3>
            <RiskBadge level={result.riskLevel} score={result.score} />
          </div>

          {/* Score gauge */}
          <div className="relative h-3 bg-base-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${result.score}%`,
                background: result.riskLevel === 'HIGH RISK' ? '#EF4444' : result.riskLevel === 'REVIEW' ? '#F59E0B' : '#22C55E',
              }}
            />
          </div>
          <p className="text-center text-xs text-text-muted">Risk Score: {result.score}/100</p>

          {/* Reasons */}
          {result.reasons.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-text-secondary">Detected Reasons:</p>
              {result.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-text-secondary bg-base-bg/50 rounded-lg p-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-text-secondary leading-relaxed bg-base-bg/50 rounded-lg p-3">
            {result.explanation}
          </p>

          <div className="flex items-start gap-2 bg-primary-700/10 border border-primary-600/20 rounded-lg p-3">
            <ShieldCheck className="h-4 w-4 text-primary-400 shrink-0 mt-0.5" />
            <p className="text-xs text-text-primary">{result.recommendedAction}</p>
          </div>

          {savedSuccess && (
            <p className="text-xs text-success bg-success/10 rounded-lg p-2 animate-fade-in">
              Risk check saved successfully.
            </p>
          )}

          <PrimaryButton variant="secondary" size="sm" fullWidth onClick={handleSave}>
            <Save className="h-3.5 w-3.5" /> Save Risk Check
          </PrimaryButton>
        </div>
      )}

      {/* History */}
      {state.riskChecks.length > 0 && (
        <div className="animate-slide-up animate-fill-both">
          <SectionTitle title="Previous Checks" />
          <div className="space-y-2">
            {state.riskChecks.map((check) => (
              <div key={check.id} className="card p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-text-primary truncate">{check.offerTitle || check.merchantName}</p>
                  <RiskBadge level={check.riskLevel} score={check.riskScore} size="sm" />
                </div>
                <p className="text-xs text-text-muted">{check.merchantName} · {formatDateTime(check.checkedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full py-2"
    >
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <div
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-success' : 'bg-base-border'}`}
        role="switch"
        aria-checked={value}
        aria-label={label}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`}
        />
      </div>
    </button>
  );
}
