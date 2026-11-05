import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { WifiOff, RefreshCw, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const OfflineSyncHUD: React.FC = () => {
  const { offlineQueue, isOnline, syncOfflineQueue, toast } = useApp();
  const [showSyncedBanner, setShowSyncedBanner] = useState<boolean>(false);
  const [lastSyncedCount, setLastSyncedCount] = useState<number>(0);
  const [prevOnline, setPrevOnline] = useState<boolean>(isOnline);

  useEffect(() => {
    // When transitioning from offline to online with queued items
    if (!prevOnline && isOnline && offlineQueue.length > 0) {
      const count = offlineQueue.length;
      syncOfflineQueue();
      setLastSyncedCount(count);
      setShowSyncedBanner(true);
      const timer = setTimeout(() => setShowSyncedBanner(false), 8000);
      return () => clearTimeout(timer);
    }
    setPrevOnline(isOnline);
  }, [isOnline, offlineQueue.length, prevOnline, syncOfflineQueue]);

  if (!isOnline) {
    return (
      <div className="w-full bg-amber-500/15 border-b border-amber-500/30 text-amber-950 dark:text-amber-200 px-3.5 py-1.5 flex items-center justify-between gap-2 text-xs font-mono animate-fade-in z-40 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-2 min-w-0">
          <WifiOff size={13} className="text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
          <span className="truncate">
            <strong>OFFLINE FIELD MODE:</strong> Dispatches sealed locally in tamper-proof cache.
          </span>
        </div>
        {offlineQueue.length > 0 && (
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-[10px] font-bold shrink-0">
            {offlineQueue.length} Queued
          </span>
        )}
      </div>
    );
  }

  if (showSyncedBanner && lastSyncedCount > 0) {
    return (
      <div className="w-full bg-emerald-600 text-white px-3.5 py-2 flex items-center justify-between gap-2 text-xs font-mono animate-slide-down shadow-md z-40 sticky top-0">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 size={15} className="shrink-0" />
          <span className="truncate">
            <strong>OFFLINE SYNC COMPLETED:</strong> {lastSyncedCount} field dispatch{lastSyncedCount > 1 ? 'es' : ''} permanently inscribed &amp; sealed on the SHA-256 National Ledger!
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowSyncedBanner(false)}
          className="px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-[10px] font-bold uppercase transition cursor-pointer shrink-0"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return null;
};
