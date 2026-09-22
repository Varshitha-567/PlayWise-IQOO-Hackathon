import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { calculateSplit } from '@/ai/TeamSplitCalculator';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ArrowLeft, Plus, X } from 'lucide-react';
import type { SplitType } from '@/types';

interface CreateTeamExpenseScreenProps {
  onBack: () => void;
}

export function CreateTeamExpenseScreen({ onBack }: CreateTeamExpenseScreenProps) {
  const { addTeamExpense } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('Equal');
  const [members, setMembers] = useState<string[]>(['', '']);
  const [percentages, setPercentages] = useState<string[]>(['', '']);
  const [customAmounts, setCustomAmounts] = useState<string[]>(['', '']);
  const [error, setError] = useState('');

  const totalAmount = parseFloat(amount) || 0;

  const addMember = () => {
    setMembers([...members, '']);
    setPercentages([...percentages, '']);
    setCustomAmounts([...customAmounts, '']);
  };

  const removeMember = (index: number) => {
    if (members.length <= 1) return;
    setMembers(members.filter((_, i) => i !== index));
    setPercentages(percentages.filter((_, i) => i !== index));
    setCustomAmounts(customAmounts.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, value: string) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  const handleSubmit = () => {
    setError('');
    if (!title.trim()) { setError('Enter an expense title.'); return; }
    if (totalAmount <= 0) { setError('Total amount must be greater than zero.'); return; }

    const cleanMembers = members.map((m) => m.trim()).filter(Boolean);
    if (cleanMembers.length === 0) { setError('Add at least one team member.'); return; }

    const input: Parameters<typeof calculateSplit>[0] = {
      totalAmount,
      splitType,
      memberNames: cleanMembers,
    };

    if (splitType === 'Percentage') {
      const pcts = percentages.slice(0, members.length).map((p) => parseFloat(p) || 0);
      input.percentages = pcts;
    } else if (splitType === 'Custom') {
      const customs = customAmounts.slice(0, members.length).map((c) => parseFloat(c) || 0);
      input.customAmounts = customs;
    }

    const result = calculateSplit(input);
    if (!result.success) {
      setError(result.error ?? 'Validation failed.');
      return;
    }

    // Map expected amounts to cleaned member names
    const validIndices = members.map((m, i) => ({ m, i })).filter(({ m }) => m.trim());
    const expectedAmounts = validIndices.map(({ i }) => result.expectedAmounts[i]);

    addTeamExpense(title.trim(), description.trim(), totalAmount, splitType, cleanMembers, expectedAmounts);
    onBack();
  };

  const splitTypes: SplitType[] = ['Equal', 'Percentage', 'Custom'];

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
        <h1 className="text-xl font-bold font-display text-text-primary">Create Expense</h1>
      </div>

      <div className="card p-4 space-y-4 animate-slide-up animate-fill-both">
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Title</label>
          <input type="text" placeholder="e.g. Tournament Registration" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Description (optional)</label>
          <input type="text" placeholder="e.g. City-level tournament entry" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Total Amount (₹)</label>
          <input type="number" placeholder="e.g. 1500" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" />
        </div>

        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Split Type</label>
          <div className="flex gap-2">
            {splitTypes.map((st) => (
              <button
                key={st}
                onClick={() => setSplitType(st)}
                className={`chip ${splitType === st ? 'bg-primary-700 text-white' : 'bg-base-surfaceLight text-text-secondary border border-base-border'}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Members */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">Team Members</label>
          <div className="space-y-2">
            {members.map((member, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Member ${i + 1} name`}
                  value={member}
                  onChange={(e) => updateMember(i, e.target.value)}
                  className="input-field flex-1"
                />
                {splitType === 'Percentage' && (
                  <input
                    type="number"
                    placeholder="%"
                    value={percentages[i] ?? ''}
                    onChange={(e) => {
                      const updated = [...percentages];
                      updated[i] = e.target.value;
                      setPercentages(updated);
                    }}
                    className="input-field w-20"
                  />
                )}
                {splitType === 'Custom' && (
                  <input
                    type="number"
                    placeholder="₹"
                    value={customAmounts[i] ?? ''}
                    onChange={(e) => {
                      const updated = [...customAmounts];
                      updated[i] = e.target.value;
                      setCustomAmounts(updated);
                    }}
                    className="input-field w-24"
                  />
                )}
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(i)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-base-surfaceLight text-text-muted hover:text-danger transition-colors shrink-0"
                    aria-label="Remove member"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addMember}
            className="mt-2 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add another member
          </button>
        </div>

        {error && <p className="text-xs text-danger bg-danger/10 rounded-lg p-2">{error}</p>}

        <PrimaryButton fullWidth onClick={handleSubmit}>Create Expense</PrimaryButton>
      </div>
    </div>
  );
}
