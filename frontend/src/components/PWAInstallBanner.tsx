import React, { useState } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('nexus_pwa_dismissed') === '1';
  });

  if (!isInstallable || isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('nexus_pwa_dismissed', '1');
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 animate-bounce-subtle">
      <div className="rounded-2xl p-4 bg-slate-900/95 dark:bg-zinc-900/95 text-white backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-900/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              Install Android App
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30">
                PWA
              </span>
            </h4>
            <p className="text-[11px] text-zinc-400 font-normal leading-tight mt-0.5">
              Instant fullscreen launch & offline intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={installApp}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss install banner"
            className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
