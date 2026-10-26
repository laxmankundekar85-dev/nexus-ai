import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const effectiveLeftIcon = icon || leftIcon;
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-slate-900 dark:text-white tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {effectiveLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-zinc-400">
            {effectiveLeftIcon}
          </div>
        )}
        <input
          id={inputId}
          {...props}
          className={clsx(
            'w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150',
            // Light: non-glare slate, dark text, medium blue focus
            'bg-slate-200/90 border border-slate-300/90 text-slate-950 placeholder-slate-600 backdrop-blur-md',
            'focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600',
            // Dark: Pure Black & White
            'dark:bg-zinc-950 dark:border-white/20 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white dark:focus:ring-white/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
              : 'hover:border-blue-400 dark:hover:border-white/40',
            effectiveLeftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-zinc-400">
            {rightIcon}
          </div>
        )}
      </div>
      {hint && !error && (
        <p className="text-[11px] text-slate-700 dark:text-zinc-400 font-medium">{hint}</p>
      )}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{error}</p>}
    </div>
  );
};

export default Input;
