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
        // Light: Soothing off-white slate (no glare/pure white), high contrast dark text
        'bg-slate-100/90 backdrop-blur-xl border border-slate-300/80 shadow-md shadow-blue-900/5 text-slate-900',
        // Dark: Pure Black & White monochromatic contrast, zero purple
        'dark:bg-[#0c0c0e]/90 dark:backdrop-blur-xl dark:border-white/12 dark:shadow-2xl dark:shadow-black dark:text-white',
        hoverable &&
          'hover:bg-slate-200/90 dark:hover:bg-[#18181b]/95 hover:border-blue-500/80 dark:hover:border-white/30 hover:shadow-lg cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
