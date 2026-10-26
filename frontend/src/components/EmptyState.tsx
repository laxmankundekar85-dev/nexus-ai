import React from 'react';
import Button from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-sky-200 dark:border-sky-500/25 rounded-2xl bg-white/50 dark:bg-[#071324]/50 backdrop-blur-md">
      <div className="p-4 rounded-2xl bg-gradient-to-tr from-sky-500/15 to-blue-500/15 dark:from-sky-500/20 dark:to-blue-500/20 text-sky-600 dark:text-sky-300 mb-4 border border-sky-200/80 dark:border-sky-500/30 shadow-xs">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-sky-200/70 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
