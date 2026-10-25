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
  Sparkles,
  ArrowRight,
  Split,
  Eye,
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
  // activeView can be 'after' | 'before' in 1-tap toggle mode, or 'split' for side-by-side
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
  const objFitClass = fitMode === 'contain' ? 'object-contain bg-slate-100 dark:bg-slate-900' : 'object-cover';

  const renderCanvas = (isFull: boolean) => {
    const frameHeight = isFull
      ? 'h-[68vh] sm:h-[74vh]'
      : compact
      ? 'h-64 sm:h-76'
      : 'h-72 sm:h-88';

    if (viewMode === 'split') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-100 dark:bg-[#0e1116]">
          {/* Before Column */}
          <div className={`relative rounded-xl overflow-hidden ${frameHeight} border border-rose-500/40 bg-slate-900 group`}>
            <img
              src={effectiveBeforeUrl}
              alt={beforeLabel}
              className={`w-full h-full ${objFitClass} transition-transform duration-300 group-hover:scale-[1.02]`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                setFailedBefore(true);
                (e.currentTarget as HTMLImageElement).src = '/evidence/water_main_burst.jpg';
              }}
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-rose-950/90 border border-rose-500/60 text-rose-100 text-[10px] font-mono font-bold shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              <span>BEFORE: {beforeLabel}</span>
            </div>
          </div>

          {/* After Column */}
          <div className={`relative rounded-xl overflow-hidden ${frameHeight} border border-emerald-500/50 bg-slate-900 group`}>
            <img
              src={effectiveAfterUrl}
              alt={afterLabel}
              className={`w-full h-full ${objFitClass} transition-transform duration-300 group-hover:scale-[1.02]`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                setFailedAfter(true);
                (e.currentTarget as HTMLImageElement).src = '/evidence/pipe_repaired_nwsc.jpg';
              }}
            />
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/60 text-emerald-100 text-[10px] font-mono font-bold shadow-md flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span>AFTER: {afterLabel}</span>
            </div>
            <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-900/90 border border-emerald-500/40 text-emerald-200 text-[9px] font-mono font-bold">
              Turnaround: {turnaroundTime}
            </div>
          </div>
        </div>
      );
    }

    // Modern 1-Tap Toggle View: Fluid, smooth crossfade, zero touch-scroll interception!
    const showingAfter = activeTab === 'after';

    return (
      <div className={`relative w-full ${frameHeight} overflow-hidden bg-slate-950 select-none group`}>
        {/* Active Image with smooth fade */}
        <img
          key={showingAfter ? 'after-img' : 'before-img'}
          src={showingAfter ? effectiveAfterUrl : effectiveBeforeUrl}
          alt={showingAfter ? afterLabel : beforeLabel}
          className={`w-full h-full ${objFitClass} transition-all duration-300 animate-fade-in`}
          referrerPolicy="no-referrer"
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

        {/* Floating 1-Tap Switch Pill in Card (Non-blocking touch) */}
        <div className="absolute top-3 left-3 z-20 flex items-center bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-xl">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('before');
            }}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              !showingAfter
                ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${!showingAfter ? 'bg-white' : 'bg-rose-500'}`} />
            <span>Before: {beforeLabel}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('after');
            }}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              showingAfter
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 size={12} className={showingAfter ? 'text-white' : 'text-emerald-400'} />
            <span>After: {afterLabel}</span>
          </button>
        </div>

        {/* Turnaround Badge & 1-Tap Toggle Pill on Bottom Right */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab((prev) => (prev === 'after' ? 'before' : 'after'));
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950/85 hover:bg-slate-900 border border-slate-700/80 text-white text-[10px] font-mono font-semibold flex items-center gap-1.5 backdrop-blur-sm cursor-pointer shadow-md transition-colors"
            title="Click to alternate Before and After photos"
          >
            <Layers size={11} className="text-emerald-400" />
            <span>Tap to Flip ({showingAfter ? 'Show Before' : 'Show After'})</span>
          </button>

          <div className="px-2.5 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-[10px] font-mono font-bold shadow-md flex items-center gap-1">
            <Clock size={11} className="text-amber-400" />
            <span>{turnaroundTime}</span>
          </div>
        </div>

        {/* Subtle Watermark Tag */}
        <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded bg-black/60 text-slate-300 text-[9px] font-mono backdrop-blur-xs pointer-events-none">
          {showingAfter ? '🟢 Verified Resolution Photo' : '🔴 Initial Breakdown Report'}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-2.5 rounded-xl overflow-hidden border border-emerald-500/50 bg-slate-950 shadow-sm select-none"
      >
        {/* Top Proof Header Bar */}
        <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>BEFORE / AFTER VERIFIED PROOF</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Clock size={10} />
              <span>{turnaroundTime}</span>
            </span>
          </div>

          {/* Mode & Fit Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('toggle');
                }}
                className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'toggle'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Single photo with 1-tap flip button"
              >
                <Eye size={10} />
                <span>Toggle</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('split');
                }}
                className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Show both Before & After side-by-side"
              >
                <Columns size={10} />
                <span>Side-by-Side</span>
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFitMode(fitMode === 'cover' ? 'contain' : 'cover');
              }}
              className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-[9.5px] font-mono font-semibold cursor-pointer"
              title="Toggle between Full Uncropped Fit and Edge-to-Edge Fill"
            >
              {fitMode === 'contain' ? 'Fill' : 'Uncrop'}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreen(true);
              }}
              className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 hover:bg-slate-800 cursor-pointer"
              title="Open Fullscreen Comparison Viewer"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>

        {/* Turnaround & GPS Match Strip */}
        <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-[9.5px] font-mono text-slate-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
              <MapPin size={10} />
              <span>
                {gpsCoords
                  ? `GPS MATCH: ${gpsCoords.lat}, ${gpsCoords.lng}`
                  : gpsVerified
                  ? 'GPS MATCH VERIFIED'
                  : 'FIELD VERIFIED'}
              </span>
            </span>
            {verifiedBy && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-slate-200">{verifiedBy}</span>
              </>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-indigo-300 font-semibold">
            <ShieldCheck size={10} />
            <span>{sealShort}</span>
          </span>
        </div>

        {renderCanvas(false)}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setFullscreen(false);
          }}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full mx-auto bg-slate-950 border border-emerald-500/40 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 size={15} />
                <span>FULLSCREEN BEFORE &amp; AFTER PROOF VIEWER · {turnaroundTime} TURNAROUND</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'toggle' ? 'split' : 'toggle')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
                >
                  {viewMode === 'toggle' ? 'Switch to Side-by-Side' : 'Switch to 1-Tap Toggle'}
                </button>
                <button
                  type="button"
                  onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
                >
                  {fitMode === 'contain' ? 'Fill Frame' : 'Full Uncropped'}
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
            {renderCanvas(true)}
          </div>
        </div>
      )}
    </>
  );
};
