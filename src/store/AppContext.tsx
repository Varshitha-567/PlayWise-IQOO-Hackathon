import { createContext, useContext, useEffect, useReducer, useCallback, type ReactNode } from 'react';
import type {
  Transaction,
  Subscription,
  Budget,
  TeamExpense,
  TeamMember,
  RiskCheck,
  PurchaseEvaluation,
  AppSettings,
  SubscriptionStatus,
} from '@/types';
import {
  DEFAULT_SETTINGS,
  seedSubscriptions,
  seedTransactions,
  seedBudget,
  seedTeamExpense,
  seedRiskCheck,
} from '@/utils/demoData';
import { calculateSubscriptionInsight } from '@/ai/SubscriptionInsightEngine';
import { calculateExpenseStatus } from '@/ai/TeamSplitCalculator';

export interface AppState {
  settings: AppSettings;
  budget: Budget;
  subscriptions: Subscription[];
  transactions: Transaction[];
  teamExpenses: TeamExpense[];
  teamMembers: TeamMember[];
  riskChecks: RiskCheck[];
  purchaseEvaluations: PurchaseEvaluation[];
  nextId: number;
}

type Action =
  | { type: 'SEED_DEMO_DATA' }
  | { type: 'RESET' }
  | { type: 'SET_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_BUDGET'; payload: Partial<Budget> }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'UPDATE_SUBSCRIPTION_STATUS'; payload: { id: number; status: SubscriptionStatus } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_TEAM_EXPENSE'; payload: { expense: TeamExpense; members: TeamMember[] } }
  | { type: 'UPDATE_TEAM_MEMBER'; payload: TeamMember }
  | { type: 'ADD_RISK_CHECK'; payload: RiskCheck }
  | { type: 'ADD_PURCHASE_EVALUATION'; payload: PurchaseEvaluation }
  | { type: 'LOAD'; payload: AppState };

const STORAGE_KEY = 'iqoo_playwise_state_v1';

function getInitialState(): AppState {
  return {
    settings: { ...DEFAULT_SETTINGS },
    budget: seedBudget(),
    subscriptions: [],
    transactions: [],
    teamExpenses: [],
    teamMembers: [],
    riskChecks: [],
    purchaseEvaluations: [],
    nextId: 100,
  };
}

function seededState(): AppState {
  const { expense, members } = seedTeamExpense();
  return {
    settings: { ...DEFAULT_SETTINGS, hasOnboarded: true },
    budget: seedBudget(),
    subscriptions: seedSubscriptions(),
    transactions: seedTransactions(),
    teamExpenses: [expense],
    teamMembers: members,
    riskChecks: [seedRiskCheck()],
    purchaseEvaluations: [],
    nextId: 100,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SEED_DEMO_DATA':
      return seededState();

    case 'RESET':
      return seededState();

    case 'LOAD':
      return action.payload;

    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'SET_BUDGET': {
      const newBudget = { ...state.budget, ...action.payload };
      return {
        ...state,
        budget: newBudget,
        settings: {
          ...state.settings,
          monthlyGamingBudget: newBudget.monthlyGamingBudget,
          monthlyDigitalBudget: newBudget.monthlyDigitalBudget,
          alertAtPercentage: newBudget.alertAtPercentage,
        },
      };
    }

    case 'ADD_SUBSCRIPTION':
      return { ...state, subscriptions: [...state.subscriptions, action.payload] };

    case 'UPDATE_SUBSCRIPTION_STATUS': {
      const subs = state.subscriptions.map((s) => {
        if (s.id !== action.payload.id) return s;
        const updated = { ...s, status: action.payload.status };
        const insight = calculateSubscriptionInsight(updated);
        updated.potentialAnnualSaving = insight.estimatedAnnualSaving;
        return updated;
      });
      return { ...state, subscriptions: subs };
    }

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case 'ADD_TEAM_EXPENSE':
      return {
        ...state,
        teamExpenses: [...state.teamExpenses, action.payload.expense],
        teamMembers: [...state.teamMembers, ...action.payload.members],
      };

    case 'UPDATE_TEAM_MEMBER': {
      const members = state.teamMembers.map((m) =>
        m.id === action.payload.id ? action.payload : m
      );
      // Recalculate expense status
      const expenseId = action.payload.expenseId;
      const expenseMembers = members.filter((m) => m.expenseId === expenseId);
      const expense = state.teamExpenses.find((e) => e.id === expenseId);
      let expenses = state.teamExpenses;
      if (expense) {
        const paidTotal = expenseMembers.reduce((sum, m) => sum + m.paidAmount, 0);
        const status = calculateExpenseStatus(expense.totalAmount, paidTotal);
        expenses = state.teamExpenses.map((e) =>
          e.id === expenseId ? { ...e, status } : e
        );
      }
      return { ...state, teamMembers: members, teamExpenses: expenses };
    }

    case 'ADD_RISK_CHECK':
      return { ...state, riskChecks: [action.payload, ...state.riskChecks] };

    case 'ADD_PURCHASE_EVALUATION':
      return { ...state, purchaseEvaluations: [action.payload, ...state.purchaseEvaluations] };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  seedDemoData: () => void;
  resetDemoData: () => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  updateBudget: (b: Partial<Budget>) => void;
  addSubscription: (s: Omit<Subscription, 'id' | 'createdAt'>) => void;
  updateSubscriptionStatus: (id: number, status: SubscriptionStatus) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  addTeamExpense: (title: string, description: string, totalAmount: number, splitType: 'Equal' | 'Percentage' | 'Custom', memberNames: string[], expectedAmounts: number[]) => void;
  markMemberPaid: (memberId: number) => void;
  addRiskCheck: (r: Omit<RiskCheck, 'id' | 'checkedAt'>) => void;
  addPurchaseEvaluation: (e: Omit<PurchaseEvaluation, 'id' | 'createdAt'>) => void;
  completeOnboarding: () => void;
  getNextId: () => number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        dispatch({ type: 'LOAD', payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const seedDemoData = useCallback(() => dispatch({ type: 'SEED_DEMO_DATA' }), []);
  const resetDemoData = useCallback(() => dispatch({ type: 'RESET' }), []);
  const updateSettings = useCallback((s: Partial<AppSettings>) => dispatch({ type: 'SET_SETTINGS', payload: s }), []);
  const updateBudget = useCallback((b: Partial<Budget>) => dispatch({ type: 'SET_BUDGET', payload: b }), []);

  const addSubscription = useCallback((s: Omit<Subscription, 'id' | 'createdAt'>) => {
    dispatch({
      type: 'ADD_SUBSCRIPTION',
      payload: { ...s, id: state.nextId, createdAt: Date.now() },
    });
  }, [state.nextId]);

  const updateSubscriptionStatus = useCallback(
    (id: number, status: SubscriptionStatus) => dispatch({ type: 'UPDATE_SUBSCRIPTION_STATUS', payload: { id, status } }),
    []
  );

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: { ...t, id: state.nextId, createdAt: Date.now() } });
  }, [state.nextId]);

  const addTeamExpense = useCallback(
    (title: string, description: string, totalAmount: number, splitType: 'Equal' | 'Percentage' | 'Custom', memberNames: string[], expectedAmounts: number[]) => {
      const expenseId = state.nextId;
      const expense: TeamExpense = {
        id: expenseId,
        title,
        description,
        totalAmount,
        expenseDate: Date.now(),
        splitType,
        status: 'PENDING',
        createdAt: Date.now(),
      };
      const members: TeamMember[] = memberNames.map((name, i) => ({
        id: state.nextId + 1 + i,
        expenseId,
        name,
        expectedAmount: expectedAmounts[i],
        paidAmount: 0,
        paymentStatus: 'PENDING' as const,
      }));
      dispatch({ type: 'ADD_TEAM_EXPENSE', payload: { expense, members } });
    },
    [state.nextId]
  );

  const markMemberPaid = useCallback(
    (memberId: number) => {
      const member = state.teamMembers.find((m) => m.id === memberId);
      if (!member) return;
      dispatch({
        type: 'UPDATE_TEAM_MEMBER',
        payload: { ...member, paidAmount: member.expectedAmount, paymentStatus: 'PAID' },
      });
    },
    [state.teamMembers]
  );

  const addRiskCheck = useCallback((r: Omit<RiskCheck, 'id' | 'checkedAt'>) => {
    dispatch({ type: 'ADD_RISK_CHECK', payload: { ...r, id: state.nextId, checkedAt: Date.now() } });
  }, [state.nextId]);

  const addPurchaseEvaluation = useCallback((e: Omit<PurchaseEvaluation, 'id' | 'createdAt'>) => {
    dispatch({ type: 'ADD_PURCHASE_EVALUATION', payload: { ...e, id: state.nextId, createdAt: Date.now() } });
  }, [state.nextId]);

  const completeOnboarding = useCallback(() => {
    dispatch({ type: 'SET_SETTINGS', payload: { hasOnboarded: true } });
  }, []);

  const getNextId = useCallback(() => state.nextId, [state.nextId]);

  return (
    <AppContext.Provider
      value={{
        state,
        seedDemoData,
        resetDemoData,
        updateSettings,
        updateBudget,
        addSubscription,
        updateSubscriptionStatus,
        addTransaction,
        addTeamExpense,
        markMemberPaid,
        addRiskCheck,
        addPurchaseEvaluation,
        completeOnboarding,
        getNextId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
