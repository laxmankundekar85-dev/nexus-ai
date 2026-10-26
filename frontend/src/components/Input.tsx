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
          className="text-xs font-semibold text-slate-300 tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {effectiveLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {effectiveLeftIcon}
          </div>
        )}
        <input
          id={inputId}
          {...props}
          className={clsx(
            'w-full bg-[#0e1529] border rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-all duration-150',
            'focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-slate-800 hover:border-slate-700',
            effectiveLeftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className
          )}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
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
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-300 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        {...props}
        className={clsx(
          'w-full bg-[#0e1529] border rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 transition-all duration-150 resize-none',
          'focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/30'
            : 'border-slate-800 hover:border-slate-700',
          className
        )}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
};

export default Input;
