import React, { useState } from 'react';
import {
  MoveHorizontal,
  CheckCircle2,
  Columns,
  SlidersHorizontal,
  MapPin,
  Clock,
  ShieldCheck,
  Maximize2,
  Minimize2,
  X,
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
  defaultMode?: 'slider' | 'split';
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'BEFORE · Citizen Report',
  afterLabel = 'AFTER · Verified Fix',
  turnaroundTime = '3h 40m',
  gpsCoords,
  gpsVerified = true,
  verifiedBy,
  cryptoSeal,
  compact = false,
  defaultMode = 'slider',
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [viewMode, setViewMode] = useState<'slider' | 'split'>(defaultMode);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const sealShort = cryptoSeal ? cryptoSeal.slice(0, 10).toUpperCase() : 'SHA-256 SEALED';
  const objFitClass = fitMode === 'contain' ? 'object-contain bg-slate-950' : 'object-cover';

  const renderCanvas = (isFull: boolean) => {
    const sliderHeight = isFull
      ? 'h-[68vh] sm:h-[74vh]'
      : compact
      ? 'h-64 sm:h-80'
      : 'h-72 sm:h-96';
    const splitHeight = isFull
      ? 'h-[62vh] sm:h-[70vh]'
      : compact
      ? 'h-56 sm:h-72'
      : 'h-64 sm:h-80';

    if (viewMode === 'slider') {
      return (
        <div className={`relative w-full ${sliderHeight} overflow-hidden bg-slate-950`}>
          {/* After Image (Full width background) */}
          <img
            src={afterUrl}
            alt={afterLabel}
            className={`absolute inset-0 w-full h-full ${objFitClass}`}
            referrerPolicy="no-referrer"
          />

          {/* Before Image (Clipped by sliderPos) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden bg-slate-950"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={beforeUrl}
              alt={beforeLabel}
              className={`w-full h-full ${objFitClass} max-w-none`}
              style={{ width: '100%', minWidth: '320px' }}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Vertical Divider Line & Handle */}
          <div
            className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.9)] pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
              <MoveHorizontal size={14} />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-rose-950/90 border border-rose-500/60 text-rose-100 text-[9.5px] font-mono font-bold pointer-events-none shadow-md">
            BEFORE: {beforeLabel}
          </div>
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/60 text-emerald-100 text-[9.5px] font-mono font-bold pointer-events-none shadow-md">
            AFTER: {afterLabel}
          </div>

          {/* Interactive Range Input Overlay */}
          <input
            type="range"
            min={4}
            max={96}
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            aria-label="Before and after image comparison slider"
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
          />

          {/* Quick Jump Footer Bar */}
          <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 bg-slate-950/90 border border-slate-700 rounded-lg px-2 py-1 text-[9.5px] font-mono shadow-lg">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSliderPos(92);
              }}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sliderPos > 75 ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Before
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSliderPos(50);
              }}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sliderPos >= 40 && sliderPos <= 60 ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              50/50
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSliderPos(8);
              }}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                sliderPos < 25 ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              After
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-950">
        <div className={`relative rounded-xl overflow-hidden ${splitHeight} border border-rose-500/50 bg-slate-900`}>
          <img
            src={beforeUrl}
            alt={beforeLabel}
            className={`w-full h-full ${objFitClass}`}
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-rose-950/90 border border-rose-500/50 text-rose-100 text-[9px] font-mono font-bold shadow">
            BEFORE: {beforeLabel}
          </span>
        </div>
        <div className={`relative rounded-xl overflow-hidden ${splitHeight} border border-emerald-500/50 bg-slate-900`}>
          <img
            src={afterUrl}
            alt={afterLabel}
            className={`w-full h-full ${objFitClass}`}
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-emerald-100 text-[9px] font-mono font-bold shadow">
            AFTER: {afterLabel}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-3 rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-slate-950 shadow-md select-none"
      >
        {/* Top Verification & Mode Control Bar */}
        <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>BEFORE / AFTER PROOF RECORD</span>
          </div>

          {/* Mode & Fit Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('slider');
                }}
                className={`px-2 py-0.5 rounded-md text-[9.5px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <SlidersHorizontal size={10} />
                <span>Swipe</span>
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
              {fitMode === 'contain' ? 'Fill Frame' : 'Full Uncropped'}
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

        {/* Turnaround & GPS Match Stamp Strip */}
        <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-[9.5px] font-mono text-slate-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
              <Clock size={10} />
              <span>TURNAROUND: {turnaroundTime}</span>
            </span>
            <span className="text-slate-600">·</span>
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
                <span>FULLSCREEN BEFORE &amp; AFTER PROOF VIEWER · TURNAROUND: {turnaroundTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'slider' ? 'split' : 'slider')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
                >
                  {viewMode === 'slider' ? 'Switch to Side-by-Side' : 'Switch to Swipe Slider'}
                </button>
                <button
                  type="button"
                  onClick={() => setFitMode(fitMode === 'cover' ? 'contain' : 'cover')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
                >
                  {fitMode === 'contain' ? 'Fill Frame' : 'Full Uncropped Fit'}
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
