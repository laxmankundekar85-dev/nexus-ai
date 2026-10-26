import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-slate-100/98 dark:bg-[#0c0c0e]/98 backdrop-blur-2xl border border-slate-300 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 transition-all`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-300 dark:border-white/12 bg-slate-200/80 dark:bg-zinc-950/80">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">{title}</h3>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClose}
            aria-label="Close modal"
            icon={<X className="w-4 h-4 text-slate-700 dark:text-zinc-400" />}
          />
        </div>

        <div className="p-6 text-slate-900 dark:text-white">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
