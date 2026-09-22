import { useEffect, useState } from 'react';
import { Gamepad2 } from 'lucide-react';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-bg transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="absolute inset-0 gradient-purple-glow" />

      <div className="relative flex flex-col items-center animate-scale-in">
        <div className="mb-6 relative">
          <div className="absolute inset-0 blur-3xl bg-primary-700/30 rounded-full" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl gradient-primary shadow-2xl shadow-primary-900/50">
            <Gamepad2 className="h-12 w-12 text-white" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-3xl font-bold font-display text-text-primary tracking-tight mb-1">
          iQOO <span className="text-gradient">PlayWise</span>
        </h1>
        <p className="text-sm text-text-secondary animate-fade-in animate-delay-300 animate-fill-both">
          Play More. Spend Smarter.
        </p>

        <div className="mt-8 h-1 w-32 bg-base-surface rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full animate-shimmer" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
}
