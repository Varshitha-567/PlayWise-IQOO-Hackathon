import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PrimaryButton({
  children,
  variant = 'primary',
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}: PrimaryButtonProps) {
  const variants = {
    primary: 'bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800',
    secondary: 'bg-base-surfaceLight text-text-primary hover:bg-base-border border border-base-border',
    danger: 'bg-danger text-white hover:bg-danger-light',
    outline: 'border border-primary-600 text-primary-400 hover:bg-primary-700/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
