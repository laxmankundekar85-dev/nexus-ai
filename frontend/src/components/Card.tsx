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
        'rounded-2xl p-5 transition-all duration-300 ease-out',
        // Light: Luminous frosted glass with subtle specular border and soft shadow
        'bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] text-slate-900 ring-1 ring-black/[0.02]',
        // Dark: Pure Monochromatic dark glass
        'dark:bg-[#0c0c0e]/80 dark:backdrop-blur-2xl dark:border-white/10 dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] dark:text-white dark:ring-white/[0.04]',
        hoverable &&
          'hover:-translate-y-0.5 hover:bg-white/85 dark:hover:bg-[#141417]/90 hover:border-blue-500/40 dark:hover:border-white/25 hover:shadow-xl cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
