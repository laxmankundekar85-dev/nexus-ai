import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border border-blue-500 shadow-md shadow-blue-600/25 dark:bg-white dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-black dark:border-white dark:shadow-white/10 font-bold transition-all',
  secondary:
    'bg-slate-200/90 hover:bg-slate-300 active:bg-slate-300 text-slate-900 font-semibold border border-slate-300/90 shadow-xs dark:bg-zinc-900/90 dark:hover:bg-zinc-800 dark:text-white dark:border-white/15',
  danger:
    'bg-rose-100 hover:bg-rose-200 active:bg-rose-300 text-rose-900 font-semibold border border-rose-300 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 dark:text-rose-200 dark:border-rose-800/60',
  ghost:
    'bg-transparent hover:bg-slate-200/80 text-slate-900 font-semibold hover:text-blue-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white border border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium',
  md: 'px-4 py-2 text-sm rounded-xl gap-2 font-medium',
  lg: 'px-5 py-2.5 text-sm rounded-xl gap-2 font-semibold',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};

export default Button;
