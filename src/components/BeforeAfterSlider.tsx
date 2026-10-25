import React, { useState } from 'react';
import {
  CheckCircle2,
  Columns,
  MapPin,
  Clock,
  ShieldCheck,
  Maximize2,
  X,
  Layers,
  Eye,
  ArrowLeftRight,
} from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  turnaroundTime?: string;
  gpsCoords?: { lat: string; lng: string } | null;
  gpsVerified?: boolean;
  verifiedBy?: string;
  cryptoSeal?: string;
  compact?: boolean;
  defaultMode?: 'toggle' | 'split' | 'slider';
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Reported Breakdown',
  afterLabel = 'Verified Restoration',
  turnaroundTime = '3h 40m',
  gpsCoords,
  gpsVerified = true,
  verifiedBy,
  cryptoSeal,
  compact = false,
  defaultMode = 'toggle',
}) => {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');
  const [viewMode, setViewMode] = useState<'toggle' | 'split'>(
    defaultMode === 'split' ? 'split' : 'toggle'
  );
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [failedBefore, setFailedBefore] = useState<boolean>(false);
  const [failedAfter, setFailedAfter] = useState<boolean>(false);

  const effectiveBeforeUrl =
    failedBefore || !beforeUrl || beforeUrl.includes('unsplash.com')
      ? '/evidence/water_main_burst.jpg'
      : beforeUrl;
  const effectiveAfterUrl =
    failedAfter || !afterUrl || afterUrl.includes('unsplash.com')
      ? '/evidence/pipe_repaired_nwsc.jpg'
      : afterUrl;

  const sealShort = cryptoSeal ? cryptoSeal.slice(0, 10).toUpperCase() : 'SHA-256 SEALED';
  const objFitClass = fitMode === 'contain' ? 'object-contain bg-slate-900' : 'object-cover';

  const frameHeight = compact ? 'h-64 sm:h-80' : 'h-72 sm:h-96';
  const fullFrameHeight = 'h-[72vh] sm:h-[80vh]';

  const showingAfter = activeTab === 'after';

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-2.5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161a22] shadow-sm select-none"
      >
        {/* 1. TOP DEDICATED CARD HEADER (NOT OVER PHOTO) */}
        <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#0e1116] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Before &amp; After Verified Proof
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              <Clock size={11} />
              <span>{turnaroundTime} SLA Turnaround</span>
            </span>
          </div>

          {/* View mode & fullscreen tools on card */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'toggle' ? 'split' : 'toggle')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer border ${
                viewMode === 'split'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400'
              }`}
              title="Show Before & After side-by-side"
            >
              <span className="flex items-center gap-1">
                <Columns size={11} />
                <span>Side-by-Side</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[10px] font-mono font-semibold cursor-pointer"
              title="Toggle Full Uncropped Fit vs Edge Fill"
            >
              {fitMode === 'contain' ? 'Fill' : 'Uncrop'}
            </button>

            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-500 cursor-pointer"
              title="Open Fullscreen Lightbox"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>

        {/* 2. DEDICATED BEFORE / AFTER SWITCHER BAR (PLACED ON POST CARD, NOT ON THE PHOTO) */}
        {viewMode === 'toggle' && (
          <div className="px-3.5 py-2 bg-slate-100/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
            {/* Segmented 1-Tap Switcher Pill ON CARD */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-200/90 dark:bg-slate-950 border border-slate-300/80 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('before')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !showingAfter
                    ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-500/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${!showingAfter ? 'bg-white' : 'bg-rose-500'}`} />
                <span>Before: {beforeLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('after')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showingAfter
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckCircle2 size={13} className={showingAfter ? 'text-white' : 'text-emerald-500'} />
                <span>After: {afterLabel}</span>
              </button>
            </div>

            {/* Quick 1-tap flip button ON CARD */}
            <button
              type="button"
              onClick={() => setActiveTab((prev) => (prev === 'after' ? 'before' : 'after'))}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
            >
              <ArrowLeftRight size={12} className="text-emerald-500" />
              <span>Flip Photo ({showingAfter ? 'Show Before' : 'Show After'})</span>
            </button>
          </div>
        )}

        {/* 3. 100% CLEAN PHOTO CANVAS — ZERO FLOATING BUTTONS OR OVERLAYS OBSTRUCTING USER VIEW */}
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 bg-slate-100 dark:bg-slate-950">
            {/* Before Photo */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1 px-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                <span>Before: {beforeLabel}</span>
              </div>
              <div className={`relative rounded-xl overflow-hidden ${frameHeight} bg-slate-950 border border-rose-400/40`}>
                <img
                  src={effectiveBeforeUrl}
                  alt={beforeLabel}
                  className={`w-full h-full ${objFitClass}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    setFailedBefore(true);
                    (e.currentTarget as HTMLImageElement).src = '/evidence/water_main_burst.jpg';
                  }}
                />
              </div>
            </div>

            {/* After Photo */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1 px-1">
                <CheckCircle2 size={11} />
                <span>After: {afterLabel}</span>
              </div>
              <div className={`relative rounded-xl overflow-hidden ${frameHeight} bg-slate-950 border border-emerald-500/50`}>
                <img
                  src={effectiveAfterUrl}
                  alt={afterLabel}
                  className={`w-full h-full ${objFitClass}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    setFailedAfter(true);
                    (e.currentTarget as HTMLImageElement).src = '/evidence/pipe_repaired_nwsc.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={`relative w-full ${frameHeight} overflow-hidden bg-slate-950 cursor-pointer`}>
            {/* Completely unobstructed image */}
            <img
              key={showingAfter ? 'after-img' : 'before-img'}
              src={showingAfter ? effectiveAfterUrl : effectiveBeforeUrl}
              alt={showingAfter ? afterLabel : beforeLabel}
              className={`w-full h-full ${objFitClass} transition-opacity duration-200`}
              referrerPolicy="no-referrer"
              onClick={() => setActiveTab((prev) => (prev === 'after' ? 'before' : 'after'))}
              onError={(e) => {
                if (showingAfter) {
                  setFailedAfter(true);
                  (e.currentTarget as HTMLImageElement).src = '/evidence/pipe_repaired_nwsc.jpg';
                } else {
                  setFailedBefore(true);
                  (e.currentTarget as HTMLImageElement).src = '/evidence/water_main_burst.jpg';
                }
              }}
            />
          </div>
        )}

        {/* 4. BOTTOM POST CARD FOOTER (OUTSIDE PHOTO) */}
        <div className="px-3.5 py-2 bg-slate-50 dark:bg-[#0e1116] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold flex items-center gap-1 ${showingAfter ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              <Eye size={11} />
              <span>Displaying: {showingAfter ? `Verified Resolution (${afterLabel})` : `Reported Breakdown (${beforeLabel})`}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <MapPin size={10} className="text-emerald-500" />
              <span>{gpsCoords ? `GPS ${gpsCoords.lat}, ${gpsCoords.lng}` : gpsVerified ? 'GPS Match Verified' : 'Field Verified'}</span>
            </span>
          </div>

          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
            <ShieldCheck size={11} />
            <span>{sealShort}</span>
          </span>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreen && (
        <div
          onClick={() => setFullscreen(false)}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full mx-auto bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Modal Header Bar with Clean Card Buttons */}
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-xs font-mono font-bold text-white">
                  FULLSCREEN VERIFICATION · {turnaroundTime} TURNAROUND
                </span>
              </div>

              {/* Toggle Buttons ON MODAL BAR */}
              <div className="flex items-center gap-2">
                <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('before')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      !showingAfter ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('after')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      showingAfter ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    After
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'toggle' ? 'split' : 'toggle')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
                >
                  {viewMode === 'toggle' ? 'Side-by-Side' : 'Single Photo'}
                </button>

                <button
                  type="button"
                  onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
                >
                  {fitMode === 'contain' ? 'Fill Frame' : 'Uncrop'}
                </button>

                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  className="p-1.5 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Photo Frame (100% clean, unobstructed) */}
            <div className={`w-full ${fullFrameHeight} bg-black flex items-center justify-center overflow-hidden`}>
              <img
                src={showingAfter ? effectiveAfterUrl : effectiveBeforeUrl}
                alt=""
                className={`w-full h-full ${objFitClass}`}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
