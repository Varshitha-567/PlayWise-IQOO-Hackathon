import { useState } from 'react';
import { AppProvider, useApp } from '@/store/AppContext';
import { SplashScreen } from '@/screens/SplashScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { SubscriptionsScreen } from '@/screens/SubscriptionsScreen';
import { WalletScreen } from '@/screens/WalletScreen';
import { PurchaseScreen } from '@/screens/PurchaseScreen';
import { TeamScreen } from '@/screens/TeamScreen';
import { SafetyScreen } from '@/screens/SafetyScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { PrivacyScreen } from '@/screens/PrivacyScreen';
import { AddSubscriptionScreen } from '@/screens/AddSubscriptionScreen';
import { AddTransactionScreen } from '@/screens/AddTransactionScreen';
import { CreateTeamExpenseScreen } from '@/screens/CreateTeamExpenseScreen';
import { Home, CreditCard, Gamepad2, Users, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Route =
  | 'splash'
  | 'onboarding'
  | 'dashboard'
  | 'subscriptions'
  | 'add_subscription'
  | 'wallet'
  | 'add_transaction'
  | 'purchase'
  | 'team_wallet'
  | 'create_team_expense'
  | 'safety'
  | 'settings'
  | 'privacy';

interface TabConfig {
  route: Route;
  label: string;
  icon: LucideIcon;
}

const TABS: TabConfig[] = [
  { route: 'dashboard', label: 'Home', icon: Home },
  { route: 'subscriptions', label: 'Subs', icon: CreditCard },
  { route: 'wallet', label: 'Wallet', icon: Gamepad2 },
  { route: 'team_wallet', label: 'Team', icon: Users },
  { route: 'safety', label: 'Safety', icon: ShieldCheck },
];

const TAB_ROUTES = new Set(TABS.map((t) => t.route));

function BottomNav({ current, onNavigate }: { current: Route; onNavigate: (r: Route) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-base-surface/95 backdrop-blur-md border-t border-base-border">
      <div className="flex items-center justify-around max-w-md mx-auto px-2 py-2 pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = current === tab.route;
          return (
            <button
              key={tab.route}
              onClick={() => onNavigate(tab.route)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
                active ? 'text-primary-400' : 'text-text-muted hover:text-text-secondary'
              }`}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={`h-5 w-5 transition-transform ${active ? 'scale-110' : ''}`} aria-hidden="true" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function AppContent() {
  const { state, completeOnboarding, seedDemoData } = useApp();
  const [route, setRoute] = useState<Route>('splash');

  const navigate = (r: string) => setRoute(r as Route);
  const goBack = () => {
    if (route === 'add_subscription') setRoute('subscriptions');
    else if (route === 'add_transaction') setRoute('wallet');
    else if (route === 'create_team_expense') setRoute('team_wallet');
    else if (route === 'purchase') setRoute('wallet');
    else if (route === 'safety') setRoute('safety');
    else if (route === 'privacy') setRoute('settings');
    else if (route === 'settings') setRoute('dashboard');
    else setRoute('dashboard');
  };

  // Splash
  if (route === 'splash') {
    return (
      <SplashScreen
        onDone={() => {
          if (state.settings.hasOnboarded && state.transactions.length > 0) {
            setRoute('dashboard');
          } else {
            setRoute('onboarding');
          }
        }}
      />
    );
  }

  // Onboarding
  if (route === 'onboarding' || !state.settings.hasOnboarded) {
    return (
      <OnboardingScreen
        onComplete={() => {
          seedDemoData();
          completeOnboarding();
          setRoute('dashboard');
        }}
      />
    );
  }

  const showBottomNav = TAB_ROUTES.has(route);

  return (
    <div className="min-h-screen bg-base-bg">
      {route === 'dashboard' && <DashboardScreen onNavigate={navigate} />}
      {route === 'subscriptions' && <SubscriptionsScreen onNavigate={navigate} />}
      {route === 'add_subscription' && <AddSubscriptionScreen onBack={goBack} />}
      {route === 'wallet' && <WalletScreen onNavigate={navigate} />}
      {route === 'add_transaction' && <AddTransactionScreen onBack={goBack} />}
      {route === 'purchase' && <PurchaseScreen onBack={goBack} />}
      {route === 'team_wallet' && <TeamScreen onNavigate={navigate} />}
      {route === 'create_team_expense' && <CreateTeamExpenseScreen onBack={goBack} />}
      {route === 'safety' && <SafetyScreen onBack={() => setRoute('dashboard')} />}
      {route === 'settings' && <SettingsScreen onNavigate={navigate} onBack={goBack} />}
      {route === 'privacy' && <PrivacyScreen onBack={goBack} />}

      {showBottomNav && <BottomNav current={route} onNavigate={setRoute} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
