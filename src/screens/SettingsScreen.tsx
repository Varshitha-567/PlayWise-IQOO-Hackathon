import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { formatCurrency } from '@/utils/format';
import { User, Wallet, Gamepad2, Bell, RefreshCw, Shield, ArrowLeft } from 'lucide-react';

interface SettingsScreenProps {
  onNavigate: (route: string) => void;
  onBack: () => void;
}

export function SettingsScreen({ onNavigate, onBack }: SettingsScreenProps) {
  const { state, updateSettings, updateBudget, resetDemoData } = useApp();
  const [nameInput, setNameInput] = useState(state.settings.userName);
  const [digitalBudget, setDigitalBudget] = useState(String(state.budget.monthlyDigitalBudget));
  const [gamingBudget, setGamingBudget] = useState(String(state.budget.monthlyGamingBudget));
  const [alertPct, setAlertPct] = useState(String(state.budget.alertAtPercentage));
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    updateSettings({ userName: nameInput.trim() || 'Aarav' });
    updateBudget({
      monthlyDigitalBudget: parseFloat(digitalBudget) || 5000,
      monthlyGamingBudget: parseFloat(gamingBudget) || 2000,
      alertAtPercentage: Math.min(100, Math.max(1, parseInt(alertPct) || 80)),
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleReset = () => {
    resetDemoData();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
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
        <h1 className="text-2xl font-bold font-display text-text-primary">Settings</h1>
      </div>

      {/* Profile */}
      <div className="card p-4 space-y-3 animate-slide-up animate-fill-both">
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-primary-400" />
          <h3 className="text-sm font-semibold text-text-primary">Profile</h3>
        </div>
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Your Name</label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      {/* Budgets */}
      <div className="card p-4 space-y-3 animate-slide-up animate-fill-both animate-delay-100">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-primary-400" />
          <h3 className="text-sm font-semibold text-text-primary">Budgets</h3>
        </div>
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Monthly Digital Budget (₹)</label>
          <input
            type="number"
            value={digitalBudget}
            onChange={(e) => setDigitalBudget(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Monthly Gaming Budget (₹)</label>
          <input
            type="number"
            value={gamingBudget}
            onChange={(e) => setGamingBudget(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="text-xs text-text-secondary mb-1.5 block">Budget Alert at {alertPct}%</label>
          <input
            type="range"
            min="50"
            max="100"
            value={alertPct}
            onChange={(e) => setAlertPct(e.target.value)}
            className="w-full accent-primary-600"
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-4 animate-slide-up animate-fill-both animate-delay-200">
        <button
          onClick={() => updateSettings({ notificationsEnabled: !state.settings.notificationsEnabled })}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary-400" />
            <span className="text-sm font-medium text-text-primary">Notifications</span>
          </div>
          <div
            className={`relative h-6 w-11 rounded-full transition-colors ${state.settings.notificationsEnabled ? 'bg-success' : 'bg-base-border'}`}
            role="switch"
            aria-checked={state.settings.notificationsEnabled}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${state.settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </div>
        </button>
      </div>

      {/* Privacy */}
      <button
        onClick={() => onNavigate('privacy')}
        className="card card-hover p-4 flex items-center justify-between w-full text-left animate-slide-up animate-fill-both animate-delay-300"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-success" />
          <span className="text-sm font-medium text-text-primary">Privacy First</span>
        </div>
        <span className="text-text-muted">→</span>
      </button>

      {/* Reset */}
      <div className="card p-4 animate-slide-up animate-fill-both animate-delay-400">
        <div className="flex items-center gap-2 mb-3">
          <RefreshCw className="h-4 w-4 text-warning" />
          <h3 className="text-sm font-semibold text-text-primary">Data Management</h3>
        </div>
        <p className="text-xs text-text-secondary mb-3">
          Reset all data back to the original demo dataset. This cannot be undone.
        </p>
        <PrimaryButton variant="secondary" fullWidth onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
          Reset Demo Data
        </PrimaryButton>
      </div>

      {savedMsg && (
        <p className="text-xs text-success bg-success/10 rounded-lg p-2 text-center animate-fade-in">
          Settings saved successfully.
        </p>
      )}

      <p className="text-center text-xs text-text-muted pt-2">
        iQOO PlayWise · On-device intelligence: Active
      </p>
    </div>
  );
}
