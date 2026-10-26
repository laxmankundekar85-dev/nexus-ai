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
        'bg-[#0e1529] border border-slate-800/80 rounded-xl p-5 transition-all duration-200 shadow-sm shadow-slate-950/40',
        hoverable && 'hover:border-slate-700 hover:bg-[#131e38] hover:shadow-md cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
