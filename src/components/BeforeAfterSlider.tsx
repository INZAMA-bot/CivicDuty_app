import React, { useState } from 'react';
import { MoveHorizontal, CheckCircle2 } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'BEFORE · Citizen Report',
  afterLabel = 'AFTER · Verified Fix',
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="my-2.5 rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950 shadow-md select-none"
    >
      <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[10px] font-mono">
        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
          <CheckCircle2 size={12} />
          <span>BEFORE / AFTER PROOF COMPARISON</span>
        </span>
        <span className="text-slate-400">Drag slider to inspect repair</span>
      </div>

      <div className="relative w-full h-52 sm:h-64 overflow-hidden bg-slate-900">
        {/* After Image (Full width background) */}
        <img
          src={afterUrl}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Before Image (Clipped by sliderPos) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={beforeUrl}
            alt={beforeLabel}
            className="w-full h-full object-cover max-w-none"
            style={{ width: '100%', minWidth: '320px' }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Vertical Divider Line & Handle */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.9)] pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg">
            <MoveHorizontal size={13} />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-rose-950/85 border border-rose-500/50 text-rose-200 text-[9px] font-mono font-bold pointer-events-none">
          {beforeLabel}
        </div>
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-950/85 border border-emerald-500/50 text-emerald-200 text-[9px] font-mono font-bold pointer-events-none">
          {afterLabel}
        </div>

        {/* Interactive Range Input Overlay */}
        <input
          type="range"
          min={5}
          max={95}
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Before and after image comparison slider"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
        />
      </div>
    </div>
  );
};
