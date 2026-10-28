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
        className="fixed inset-0 bg-slate-950/45 dark:bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white/90 dark:bg-[#0c0c0e]/92 backdrop-blur-2xl border border-white/70 dark:border-white/12 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] ring-1 ring-black/5 dark:ring-white/10 overflow-hidden z-10 transition-all animate-modal-pop`}
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-white/95 via-slate-50/90 to-white/95 dark:from-zinc-900/90 dark:via-zinc-950/90 dark:to-zinc-900/90 backdrop-blur-md">
          <h3 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-wide">{title}</h3>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClose}
            aria-label="Close modal"
            icon={<X className="w-4 h-4 text-slate-600 dark:text-zinc-400" />}
            className="hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-xl"
          />
        </div>

        <div className="p-6 text-slate-900 dark:text-white">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
