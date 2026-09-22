export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatCurrencyDecimal(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(epoch: number): string {
  return new Date(epoch).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(epoch: number): string {
  return new Date(epoch).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatRelativeDate(epoch: number): string {
  const now = Date.now();
  const diff = epoch - now;
  const days = Math.round(diff / (24 * 60 * 60 * 1000));

  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 0 && days <= 7) return `In ${days} days`;
  if (days < 0 && days >= -7) return `${Math.abs(days)} days ago`;
  if (days > 7) return `In ${Math.round(days / 7)} weeks`;
  return `${Math.abs(Math.round(days / 7))} weeks ago`;
}

export function daysFromNow(days: number): number {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

export function daysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

export function isSameMonth(epoch: number, ref: number = Date.now()): boolean {
  const d1 = new Date(epoch);
  const d2 = new Date(ref);
  return d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
}

export function getMonthName(epoch: number = Date.now()): string {
  return new Date(epoch).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function formatDateTime(epoch: number): string {
  return new Date(epoch).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
