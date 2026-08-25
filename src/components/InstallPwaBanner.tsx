import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstallPwaBanner: React.FC = () => {
  const { toast } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    const inStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(inStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent;
    const isApple = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isApple);

    // Capture standard PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (isStandalone || dismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast('CivicDuty App Installed to Home Screen!', 'emerald');
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIosGuide(!showIosGuide);
    } else {
      toast('Tap your browser menu (⋮) and select "Add to Home Screen"', 'teal');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-teal-500/30 p-3 relative shadow-md dark:shadow-lg animate-fade-in text-slate-800 dark:text-slate-100">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-teal-500 p-0.5 flex-shrink-0 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Smartphone size={18} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mono">
              <span>Install CivicDuty App</span>
              <span className="text-[8px] bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                PWA
              </span>
            </div>
            <p className="text-[9.5px] mono text-slate-500 dark:text-slate-400 truncate">
              {isIOS ? 'Add to iPhone Home Screen for offline access' : 'Fast 1-click install · Works offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstallClick}
            className="bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider mono transition-all active:scale-[.98] flex items-center gap-1.5 shadow-sm dark:shadow-[0_0_12px_rgba(45,212,191,0.3)]"
          >
            <Download size={12} /> {isIOS ? 'How to Add' : 'Install'}
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 p-1"
            title="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* iOS Modal Guide */}
      {showIosGuide && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-teal-500/20 text-[10px] mono text-slate-700 dark:text-slate-300 space-y-2 max-w-xl mx-auto animate-fade-in bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-transparent p-3 rounded-xl">
          <div className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
            <CheckCircle2 size={13} /> Install on iPhone / iPad (Safari):
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
            <li>
              Tap the <span className="text-amber-700 dark:text-amber-300 font-bold flex-inline items-center"><Share size={11} className="inline mx-0.5" /> Share</span> button in bottom Safari bar.
            </li>
            <li>
              Scroll down and select <span className="text-amber-700 dark:text-amber-300 font-bold flex-inline items-center"><PlusSquare size={11} className="inline mx-0.5" /> Add to Home Screen</span>.
            </li>
            <li>Tap <span className="text-emerald-700 dark:text-emerald-400 font-bold">Add</span> in top right corner.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
