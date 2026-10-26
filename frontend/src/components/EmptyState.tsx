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
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-300 dark:border-white/15 rounded-2xl bg-slate-100/90 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="p-4 rounded-2xl bg-blue-100 text-blue-700 dark:bg-zinc-900 dark:text-white mb-4 border border-blue-200 dark:border-white/15 shadow-xs">
        {icon}
      </div>
      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-xs text-slate-700 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed font-medium">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
