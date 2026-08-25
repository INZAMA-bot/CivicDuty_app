import React from 'react';

export interface TrafficLightLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'green-only' | 'emblem' | 'realistic' | 'beacon-hero';
  className?: string;
  usePhotoAsset?: boolean;
}

export const TrafficLightLogo: React.FC<TrafficLightLogoProps> = ({
  size = 'md',
  variant = 'beacon-hero',
  className = '',
}) => {
  if (variant === 'green-only') {
    return (
      <div
        className={`inline-flex items-center justify-center select-none ${className}`}
        title="CivicDuty Sovereign Beacon — Active Service"
      >
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
          <div className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping opacity-60" />
          <img
            src="/bulb_green_exact.png"
            alt="CivicDuty Green Signal"
            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.7)] relative z-10"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to stylized circle if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  }

  // Sizing for exact photographic logo image
  const sizeClasses = {
    sm: 'max-w-[140px]',
    md: 'max-w-[200px]',
    lg: 'max-w-[280px]',
    xl: 'max-w-[320px] sm:max-w-[360px]',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.xl;

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none bg-transparent w-full ${className}`}
      title="CivicDuty Sovereign 3-Signal Engine: Red (Citizen Speaks), Amber (Government Serves), Green (Proof Uploaded / Citizen Heard)"
    >
      {/* Exact 1787650937605.png Logo Image */}
      <div className={`relative flex items-center justify-center w-full ${currentSizeClass} mx-auto bg-transparent`}>
        <img
          src="/1787650937605.png"
          alt="CivicDuty Sovereign 3-Signal Beacon Logo"
          className="w-full h-auto object-contain transition-transform hover:scale-[1.02] bg-transparent"
          referrerPolicy="no-referrer"
        />
      </div>

      {size === 'xl' && (
        <div className="flex items-center justify-between w-full max-w-[300px] sm:max-w-[330px] px-3 mt-1.5 text-[8.5px] mono font-black uppercase tracking-wider">
          <span className="text-rose-700 dark:text-rose-400">Citizen Speaks</span>
          <span className="text-amber-700 dark:text-amber-400">Government Serves</span>
          <span className="text-emerald-700 dark:text-emerald-400">Citizen Heard ✓</span>
        </div>
      )}
    </div>
  );
};

