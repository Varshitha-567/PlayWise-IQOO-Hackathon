import { Shield, Cpu, Lock, Eye, Heart, ArrowLeft } from 'lucide-react';

interface PrivacyScreenProps {
  onBack: () => void;
}

const PRIVACY_POINTS = [
  {
    icon: Cpu,
    title: 'Local-First Intelligence',
    text: 'Financial insights run locally on this device. No cloud processing required.',
  },
  {
    icon: Lock,
    title: 'No Financial Credentials',
    text: 'This prototype does not collect OTP, UPI PIN, CVV, bank password, or card credentials.',
  },
  {
    icon: Eye,
    title: 'Demo Data Only',
    text: 'This prototype uses demo or user-entered data only. It does not connect to real banking, UPI, payment credentials, or subscription-provider accounts.',
  },
  {
    icon: Shield,
    title: 'Risk Scores Are Guidance',
    text: 'Risk scores are guidance, not financial advice. Always verify offers independently.',
  },
  {
    icon: Heart,
    title: 'You Decide Every Action',
    text: 'PlayWise never forces you to cancel a subscription, block a payment, or make a financial decision automatically.',
  },
];

export function PrivacyScreen({ onBack }: PrivacyScreenProps) {
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
        <h1 className="text-2xl font-bold font-display text-text-primary">Privacy First</h1>
      </div>

      <div className="flex flex-col items-center text-center py-6 animate-scale-in animate-fill-both">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-success/10 mb-4">
          <Shield className="h-10 w-10 text-success" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold font-display text-text-primary mb-1">Your Data Stays Yours</h2>
        <p className="text-sm text-text-secondary max-w-xs">
          PlayWise is built with a privacy-first philosophy. Everything runs on your device.
        </p>
      </div>

      <div className="space-y-3">
        {PRIVACY_POINTS.map((point, i) => {
          const Icon = point.icon;
          return (
            <div
              key={i}
              className="card p-4 animate-slide-up animate-fill-both"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/10">
                  <Icon className="h-4.5 w-4.5 text-success" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">{point.title}</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">{point.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-4 bg-primary-700/5 border-primary-600/20 animate-slide-up animate-fill-both">
        <p className="text-xs text-text-secondary leading-relaxed text-center">
          This prototype uses local sample data and does not connect to real banking, UPI, payment
          credentials, or subscription-provider accounts.
        </p>
      </div>
    </div>
  );
}
