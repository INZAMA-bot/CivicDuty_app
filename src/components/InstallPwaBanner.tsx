import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  X,
  Share,
  PlusSquare,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstallPwaBanner: React.FC = () => {
  const { toast } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    const inStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(inStandalone);

    const ua = window.navigator.userAgent;
    const isApple = /iPhone|iPad|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(isApple);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      toast('CivicDuty PWA installed to your Home Screen!', 'emerald');
    };

    const handleOpenModalEvent = () => {
      setDismissed(false);
      setShowInstallModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('open-pwa-install-modal', handleOpenModalEvent);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-pwa-install-modal', handleOpenModalEvent);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast('CivicDuty App Installed to Home Screen!', 'emerald');
        setDeferredPrompt(null);
        setShowInstallModal(false);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleCopyAppUrl = () => {
    const url = window.location.origin;
    navigator.clipboard?.writeText(url);
    setCopiedUrl(true);
    toast('App URL copied! Paste in Chrome or Safari to install to Home Screen.', 'emerald');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleDownloadIcon = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast(`Downloaded ${fileName}`, 'emerald');
  };

  if (isStandalone && !showInstallModal) return null;

  return (
    <>
      {!dismissed && !isStandalone && (
        <div className="bg-white dark:bg-[#161a22] border-b border-[#e3e6ea] dark:border-[#262b36] px-3.5 py-2.5 relative animate-fade-in text-slate-900 dark:text-slate-100">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/favicon.svg"
                alt="CivicDuty PWA Icon"
                className="w-8 h-8 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] shrink-0 bg-[#090d16]"
              />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-mono">
                  <span className="truncate">Install CivicDuty Sovereign PWA</span>
                  <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:inline">
                    · Offline Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {isIOS
                    ? 'Add to iPhone Home Screen · Crisp Green Checkmark Beacon icon'
                    : '1-click Home Screen app · Sovereign Green Checkmark Beacon icon'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold px-3 py-1.5 rounded-lg text-[10.5px] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={12} strokeWidth={2} />
                <span>{deferredPrompt ? 'Install Now' : 'Download PWA'}</span>
              </button>

              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 p-1 cursor-pointer"
                title="Dismiss banner"
              >
                <X size={15} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install & Official Icon Aesthetics Modal */}
      {showInstallModal && (
        <div
          onClick={() => setShowInstallModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] shadow-2xl p-4 sm:p-5 space-y-4 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center gap-3">
                <img
                  src="/favicon.svg"
                  alt="CivicDuty Home Screen Icon"
                  className="w-12 h-12 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#090d16] shadow-md shrink-0"
                />
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                    Progressive Web Application
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Install CivicDuty to Home Screen
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Standalone Native Experience · Offline Queue · 512px Vector Icon
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Official Home Screen Icon Preview & Design Rationale */}
            <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Official Home Screen Icon Architecture
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  192px · 512px · Maskable
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] shadow-md bg-[#090d16]">
                    <img src="/favicon.svg" alt="CivicDuty App Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-500 font-medium">CivicDuty</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Sovereign Green Checkmark Beacon + 3-Signal Crown
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Engineered specifically for 1:1 mobile app launchers: the bold Emerald Resolution Checkmark anchors the center while the subtle Red · Amber · Green micro-crown preserves the full 3-Signal identity without clipping on Android squircles or iOS rounded squares.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleDownloadIcon('/pwa-512x512.png', 'CivicDuty-PWA-Icon-512x512.png')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[10.5px] font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download size={11} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Save 512px PNG</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadIcon('/favicon.svg', 'CivicDuty-Official-Icon.svg')}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[10.5px] font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Download size={11} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Save Vector SVG</span>
                </button>
              </div>
            </div>

            {/* Direct Install Trigger or Step-by-Step Browser Guide */}
            {deferredPrompt ? (
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download size={14} />
                <span>Install CivicDuty PWA Now</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Smartphone size={13} className="text-emerald-600 dark:text-emerald-400" />
                    <span>How to Install on Your Phone or Desktop:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <li>
                      <strong>Android (Chrome):</strong> Open the direct app URL in Chrome, tap the browser menu{' '}
                      <span className="font-mono font-bold text-slate-900 dark:text-white">(⋮)</span> in the top-right corner, and tap{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400">&ldquo;Install app&rdquo;</strong> or{' '}
                      <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                    </li>
                    <li>
                      <strong>iPhone / iPad (Safari):</strong> Tap the{' '}
                      <span className="inline-flex items-center font-semibold text-slate-900 dark:text-white">
                        <Share size={11} className="mx-0.5" /> Share
                      </span>{' '}
                      button on the bottom bar and tap{' '}
                      <span className="inline-flex items-center font-semibold text-emerald-600 dark:text-emerald-400">
                        <PlusSquare size={11} className="mx-0.5" /> Add to Home Screen
                      </span>
                      .
                    </li>
                    <li>
                      <strong>Desktop (Chrome / Edge):</strong> Click the{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400">Install CivicDuty</strong> icon on the right side of the address bar.
                    </li>
                  </ol>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAppUrl}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedUrl ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedUrl ? 'App Link Copied!' : 'Copy Direct App URL to Install'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInstallModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
