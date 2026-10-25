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
        'bg-[#0f172a] border border-slate-800 rounded-xl p-5 transition-colors duration-150',
        hoverable && 'hover:border-slate-700 hover:bg-[#131c31] cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
