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
          className="text-xs font-semibold text-slate-700 dark:text-sky-200 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {effectiveLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500 dark:text-sky-400">
            {effectiveLeftIcon}
          </div>
        )}
        <input
          id={inputId}
          {...props}
          className={clsx(
            'w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150',
            // Glass Light & Dark
            'bg-white/80 border border-sky-200/90 text-slate-900 placeholder-slate-400 backdrop-blur-md',
            'focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-500',
            'dark:bg-[#071324]/80 dark:border-sky-500/30 dark:text-slate-100 dark:placeholder-sky-300/40 dark:focus:border-sky-400 dark:focus:ring-sky-400/40',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
              : 'hover:border-sky-300 dark:hover:border-sky-400/50',
            effectiveLeftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500 dark:text-sky-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-sky-300/60">{hint}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  className,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-sky-200 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        {...props}
        className={clsx(
          'w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 resize-none',
          'bg-white/80 border border-sky-200/90 text-slate-900 placeholder-slate-400 backdrop-blur-md',
          'focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-500',
          'dark:bg-[#071324]/80 dark:border-sky-500/30 dark:text-slate-100 dark:placeholder-sky-300/40 dark:focus:border-sky-400 dark:focus:ring-sky-400/40',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
            : 'hover:border-sky-300 dark:hover:border-sky-400/50',
          className
        )}
      />
      {error && <p className="text-xs text-rose-500 dark:text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500 dark:text-sky-300/60">{hint}</p>}
    </div>
  );
};

export default Input;
