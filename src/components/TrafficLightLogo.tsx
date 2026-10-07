import React, { useState } from 'react';

export interface TrafficLightLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'green-only' | 'emblem' | 'realistic' | 'beacon-hero' | 'vector-beacon' | 'livery';
  className?: string;
}

/**
 * Official CivicDuty 3-Signal Sovereign Logo
 * Adopted directly from the official SVG specifications:
 * - Red Signal (Left): Crisp red ring with soft coral center dot (Citizen Speaks)
 * - Amber Signal (Center): Crisp golden ring with soft gold center dot (Government Serves)
 * - Green Signal (Right): Crisp emerald ring with deep pine green fill & bold white checkmark (Citizen Heard & Proof Uploaded)
 */
export const TrafficLightLogo: React.FC<TrafficLightLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
}) => {
  const [hoveredSignal, setHoveredSignal] = useState<'red' | 'amber' | 'green' | null>(null);

  if (variant === 'green-only') {
    const greenSizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-7 h-7 sm:w-8 sm:h-8',
      lg: 'w-9 h-9 sm:w-10 sm:h-10',
      xl: 'w-11 h-11 sm:w-12 sm:h-12',
    };
    const greenSize = greenSizeClasses[size] || greenSizeClasses.sm;

    return (
      <div
        className={`inline-flex items-center justify-center select-none shrink-0 ${className}`}
        title="CivicDuty Sovereign Green Signal — Citizen Heard & Proof Uploaded"
      >
        <div className={`relative flex items-center justify-center ${greenSize}`}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-[0_0_6px_rgba(16,185,129,0.45)]"
            role="img"
            aria-label="CivicDuty Green Signal Logo"
          >
            <circle cx="50" cy="50" r="42" fill="#064E3B" stroke="#10B981" strokeWidth="8.5" />
            <path
              d="M 32 50.5 L 46 64.5 L 70 38.5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Sizing classes for the official 3-signal logo
  const sizeClasses = {
    sm: 'max-w-[130px] h-10',
    md: 'max-w-[190px] h-14',
    lg: 'max-w-[260px] h-18',
    xl: 'max-w-[320px] sm:max-w-[360px] h-24 sm:h-28',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.xl;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none bg-transparent w-full ${className}`}
      title="CivicDuty Sovereign 3-Signal Official Logo: Red (Citizen Speaks) · Amber (Government Serves) · Green (Citizen Heard & Proof Uploaded)"
    >
      <div className={`relative flex items-center justify-center w-full ${currentSizeClass} mx-auto bg-transparent`}>
        {/* Subtle atmospheric ambient glow behind the green resolution beacon */}
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 blur-xl pointer-events-none -z-10" />

        {/* Official Vector Logo SVG */}
        <svg
          viewBox="0 0 360 120"
          className="w-full h-full object-contain filter drop-shadow-md transition-all duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="CivicDuty Official Logo: Red Signal, Amber Signal, Green Signal with Checkmark"
        >
          {/* Signal 1: Red (Citizen Speaks) */}
          <g
            className={`transition-all duration-200 cursor-pointer origin-[70px_60px] ${
              hoveredSignal === 'red'
                ? 'scale-110 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.75)]'
                : hoveredSignal
                ? 'opacity-50 scale-95'
                : 'hover:scale-105'
            }`}
            onMouseEnter={() => setHoveredSignal('red')}
            onMouseLeave={() => setHoveredSignal(null)}
          >
            <title>Signal 1 · Red: Citizen Speaks (Report Hazard, Service Defect or Corruption)</title>
            <circle cx="70" cy="60" r="38" fill="none" stroke="#EF4444" strokeWidth="7" />
            <circle cx="70" cy="60" r="11.5" fill="#F87171" />
          </g>

          {/* Signal 2: Amber (Government Serves) */}
          <g
            className={`transition-all duration-200 cursor-pointer origin-[180px_60px] ${
              hoveredSignal === 'amber'
                ? 'scale-110 filter drop-shadow-[0_0_12px_rgba(245,158,11,0.75)]'
                : hoveredSignal
                ? 'opacity-50 scale-95'
                : 'hover:scale-105'
            }`}
            onMouseEnter={() => setHoveredSignal('amber')}
            onMouseLeave={() => setHoveredSignal(null)}
          >
            <title>Signal 2 · Amber: Government Serves (Public SLA Clock · Dispatch & Investigation)</title>
            <circle cx="180" cy="60" r="38" fill="none" stroke="#F59E0B" strokeWidth="7" />
            <circle cx="180" cy="60" r="11.5" fill="#FDE047" />
          </g>

          {/* Signal 3: Green (Citizen Heard & Proof Uploaded) */}
          <g
            className={`transition-all duration-200 cursor-pointer origin-[290px_60px] ${
              hoveredSignal === 'green'
                ? 'scale-110 filter drop-shadow-[0_0_14px_rgba(16,185,129,0.85)]'
                : hoveredSignal
                ? 'opacity-50 scale-95'
                : 'hover:scale-105'
            }`}
            onMouseEnter={() => setHoveredSignal('green')}
            onMouseLeave={() => setHoveredSignal(null)}
          >
            <title>Signal 3 · Green: Citizen Heard & Proof Uploaded (Verified Resolution & Public Proof)</title>
            <circle cx="290" cy="60" r="38" fill="#064E3B" stroke="#10B981" strokeWidth="7" />
            <path
              d="M 273 60.5 L 286 73.5 L 308 49.5"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {/* Dynamic Micro-Discovery Label on Hover */}
        {hoveredSignal && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] mono font-black px-2.5 py-0.5 rounded-full bg-slate-950/95 text-white border border-slate-700/80 shadow-lg animate-in fade-in zoom-in-95 duration-150 z-20 pointer-events-none">
            {hoveredSignal === 'red' && (
              <span className="text-rose-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Signal 1 · Red: Citizen Speaks</span>
              </span>
            )}
            {hoveredSignal === 'amber' && (
              <span className="text-amber-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Signal 2 · Amber: Government Serves</span>
              </span>
            )}
            {hoveredSignal === 'green' && (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Signal 3 · Green: Citizen Heard &amp; Proof Uploaded</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};



