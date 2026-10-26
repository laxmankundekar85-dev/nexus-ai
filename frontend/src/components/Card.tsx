import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      {...props}
      className={clsx(
        'rounded-2xl p-5 transition-all duration-200',
        // Glassmorphism Light & Dark styles
        'bg-white/75 backdrop-blur-xl border border-white/80 shadow-md shadow-sky-500/5 text-slate-800',
        'dark:bg-[#0c182b]/75 dark:backdrop-blur-xl dark:border-sky-400/20 dark:shadow-xl dark:shadow-black/30 dark:text-slate-100',
        hoverable &&
          'hover:bg-white/90 dark:hover:bg-[#11233f]/85 hover:border-sky-300 dark:hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-500/10 dark:hover:shadow-sky-500/10 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
