import { useState } from 'react';
import { CreditCard, Gamepad2, ShieldCheck, ChevronRight } from 'lucide-react';
import { PrimaryButton } from '@/components/PrimaryButton';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const PAGES = [
  {
    icon: CreditCard,
    title: 'Track Every Subscription',
    description: 'Never forget a renewal. See all your subscriptions in one place and find savings by cutting what you do not use.',
    color: '#6D28D9',
  },
  {
    icon: Gamepad2,
    title: 'Control Your Gaming Spend',
    description: 'Set a monthly gaming budget, evaluate purchases before you buy, and keep your in-game spending in check.',
    color: '#FFC107',
  },
  {
    icon: ShieldCheck,
    title: 'Stay Safe From Suspicious Offers',
    description: 'Get explainable risk scores for top-up offers and payment links so you can avoid scams before you pay.',
    color: '#22C55E',
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [page, setPage] = useState(0);
  const current = PAGES[page];
  const Icon = current.icon;
  const isLast = page === PAGES.length - 1;

  return (
    <div className="min-h-screen bg-base-bg flex flex-col">
      <div className="absolute inset-0 gradient-purple-glow" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-8 max-w-md mx-auto w-full">
        <div className="flex gap-2 mb-12">
          {PAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === page ? 'w-8 bg-primary-600' : 'w-4 bg-base-border'}`}
            />
          ))}
        </div>

        <div key={page} className="flex flex-col items-center text-center animate-slide-up">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-3xl mb-8"
            style={{ backgroundColor: `${current.color}20` }}
          >
            <Icon className="h-12 w-12" style={{ color: current.color }} aria-hidden="true" />
          </div>

          <h2 className="text-2xl font-bold font-display text-text-primary mb-3">{current.title}</h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xs">{current.description}</p>
        </div>
      </div>

      <div className="relative px-6 pb-8 max-w-md mx-auto w-full space-y-3">
        <PrimaryButton fullWidth size="lg" onClick={onComplete}>
          {isLast ? 'Start with Demo Data' : 'Continue'}
          <ChevronRight className="h-4 w-4" />
        </PrimaryButton>
        {!isLast && (
          <button
            onClick={onComplete}
            className="w-full text-center text-xs text-text-secondary hover:text-text-primary transition-colors py-2"
          >
            Skip introduction
          </button>
        )}
      </div>
    </div>
  );
}
