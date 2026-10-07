import React, { useState } from 'react';
import { Download, Copy, Check, Eye, ZoomIn, Info, ShieldCheck, Bus } from 'lucide-react';

interface KayoolaBusGraphicProps {
  className?: string;
  showControls?: boolean;
  initialViewMode?: 'full' | 'beacon' | 'badge';
  interactive?: boolean;
}

export const KayoolaBusGraphic: React.FC<KayoolaBusGraphicProps> = ({
  className = '',
  showControls = true,
  initialViewMode = 'full',
  interactive = true,
}) => {
  const [viewMode, setViewMode] = useState<'full' | 'beacon' | 'badge'>(initialViewMode);
  const [glowIntensity, setGlowIntensity] = useState<'normal' | 'high' | 'off'>('normal');
  const [isCopied, setIsCopied] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  // Dynamic viewBox depending on focus mode
  const viewBoxes = {
    full: '0 0 1200 600',
    beacon: '120 300 580 140',
    badge: '760 300 300 110',
  };

  const currentViewBox = viewBoxes[viewMode];

  const svgCode = `<svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    
    <!-- Red Lens Gradient -->
    <radialGradient id="redLens" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="50%" stop-color="#dc2626"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </radialGradient>

    <!-- Amber Lens Gradient -->
    <radialGradient id="amberLens" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="50%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#713f12"/>
    </radialGradient>

    <!-- Green Lens Gradient -->
    <radialGradient id="greenLens" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#86efac"/>
      <stop offset="40%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#14532d"/>
    </radialGradient>
    
    <!-- Glow Effect for Green Lens -->
    <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1200" height="600" fill="url(#bgGrad)"/>

  <!-- Kayoola Bus Frame Silhouette -->
  <rect x="100" y="200" width="1000" height="260" rx="35" fill="#182232" stroke="#334155" stroke-width="4"/>
  <!-- Bus Windows -->
  <rect x="150" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3"/>
  <rect x="330" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3"/>
  <rect x="510" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3"/>
  <rect x="690" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3"/>
  <rect x="870" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3"/>
  
  <!-- Wheels -->
  <circle cx="300" cy="460" r="45" fill="#0f172a" stroke="#475569" stroke-width="8"/>
  <circle cx="900" cy="460" r="45" fill="#0f172a" stroke="#475569" stroke-width="8"/>

  <!-- CivicDuty Co-Branded Side Wrap Accent -->
  <path d="M 100 380 Q 400 320 1100 380 L 1100 450 L 100 450 Z" fill="#047857" opacity="0.8"/>

  <!-- 3-Signal Beacon Logo -->
  <circle cx="200" cy="360" r="28" fill="url(#redLens)"/>
  <circle cx="265" cy="360" r="28" fill="url(#amberLens)"/>
  <circle cx="330" cy="360" r="28" fill="url(#greenLens)" filter="url(#greenGlow)"/>

  <!-- Brand Typography -->
  <text x="380" y="372" font-family="Arial, sans-serif" font-weight="900" font-size="38" fill="#ffffff" letter-spacing="2">CIVICDUTY</text>
  <text x="380" y="398" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#4ade80" letter-spacing="3">• SPEAK. SERVE. BE HEARD. •</text>

  <!-- Ministry of ICT Co-Branding Badge -->
  <rect x="800" y="335" width="230" height="50" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
  <text x="815" y="357" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="#94a3b8">IN PARTNERSHIP WITH</text>
  <text x="815" y="374" font-family="Arial, sans-serif" font-weight="800" font-size="13" fill="#ffffff">MINISTRY OF ICT &amp; NG</text>
</svg>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kayoola-civicduty-transit-livery.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-full flex flex-col rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-2xl ${className}`}>
      {/* Top Graphic Toolbar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <Bus size={15} />
            </div>
            <div>
              <div className="font-black text-[11px] text-white tracking-wide uppercase flex items-center gap-1.5">
                <span>Kayoola EVS Transit Livery</span>
                <span className="px-1.5 py-0.2 rounded text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-700 font-bold">
                  Official Design
                </span>
              </div>
              <div className="text-[9px] text-slate-400 mono">
                1200×600 SVG Vector · Ministry of ICT Co-Branded
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* View Mode Buttons */}
            <div className="inline-flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                onClick={() => setViewMode('full')}
                className={`px-2 py-1 rounded-md text-[9.5px] font-bold transition-all ${
                  viewMode === 'full'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Full Bus
              </button>
              <button
                onClick={() => setViewMode('beacon')}
                className={`px-2 py-1 rounded-md text-[9.5px] font-bold transition-all ${
                  viewMode === 'beacon'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Beacon Logo
              </button>
              <button
                onClick={() => setViewMode('badge')}
                className={`px-2 py-1 rounded-md text-[9.5px] font-bold transition-all ${
                  viewMode === 'badge'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gov Badge
              </button>
            </div>

            {/* Quick Action Buttons */}
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              title="Design Specifications"
              className={`p-1.5 rounded-lg border text-slate-300 hover:text-white transition-colors ${
                showSpecs ? 'bg-slate-800 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <Info size={13} />
            </button>

            <button
              onClick={handleCopy}
              title="Copy SVG code"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500 text-[9.5px] font-bold transition-all"
            >
              {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{isCopied ? 'Copied' : 'SVG'}</span>
            </button>

            <button
              onClick={handleDownload}
              title="Download SVG file"
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[9.5px] font-bold transition-all shadow-sm"
            >
              <Download size={12} />
              <span>Save</span>
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas Display Container */}
      <div className="relative w-full aspect-[2/1] bg-[#0f172a] overflow-hidden flex items-center justify-center select-none group">
        <svg
          viewBox={currentViewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain transition-all duration-500 ease-in-out"
        >
          <defs>
            {/* Background Gradient */}
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Red Lens Gradient */}
            <radialGradient id="redLens" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff6b6b" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>

            {/* Amber Lens Gradient */}
            <radialGradient id="amberLens" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#713f12" />
            </radialGradient>

            {/* Green Lens Gradient */}
            <radialGradient id="greenLens" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="40%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14532d" />
            </radialGradient>

            {/* Glow Effect for Green Lens */}
            <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={glowIntensity === 'high' ? '18' : glowIntensity === 'off' ? '0' : '12'} result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Canvas Background */}
          <rect width="1200" height="600" fill="url(#bgGrad)" />

          {/* Kayoola Bus Frame Silhouette */}
          <rect x="100" y="200" width="1000" height="260" rx="35" fill="#182232" stroke="#334155" strokeWidth="4" />

          {/* Bus Windows */}
          <rect x="150" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3" />
          <rect x="330" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3" />
          <rect x="510" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3" />
          <rect x="690" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3" />
          <rect x="870" y="220" width="160" height="80" rx="10" fill="#0284c7" opacity="0.3" />

          {/* Wheels */}
          <circle cx="300" cy="460" r="45" fill="#0f172a" stroke="#475569" strokeWidth="8" />
          <circle cx="900" cy="460" r="45" fill="#0f172a" stroke="#475569" strokeWidth="8" />

          {/* CivicDuty Co-Branded Side Wrap Accent */}
          <path d="M 100 380 Q 400 320 1100 380 L 1100 450 L 100 450 Z" fill="#047857" opacity="0.8" />

          {/* 3-Signal Beacon Logo */}
          <circle cx="200" cy="360" r="28" fill="url(#redLens)" />
          <circle cx="265" cy="360" r="28" fill="url(#amberLens)" />
          <circle cx="330" cy="360" r="28" fill="url(#greenLens)" filter="url(#greenGlow)" />

          {/* Brand Typography */}
          <text x="380" y="372" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="38" fill="#ffffff" letterSpacing="2">
            CIVICDUTY
          </text>
          <text x="380" y="398" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fill="#4ade80" letterSpacing="3">
            • SPEAK. SERVE. BE HEARD. •
          </text>

          {/* Ministry of ICT Co-Branding Badge */}
          <rect x="800" y="335" width="230" height="50" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
          <text x="815" y="357" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#94a3b8">
            IN PARTNERSHIP WITH
          </text>
          <text x="815" y="374" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="13" fill="#ffffff">
            MINISTRY OF ICT &amp; NG
          </text>
        </svg>

        {/* Focus indicator badge overlay */}
        {viewMode !== 'full' && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[9px] text-emerald-400 font-bold mono uppercase">
            Viewing: {viewMode === 'beacon' ? '3-Signal Beacon & Typography' : 'Ministry of ICT Badge'}
          </div>
        )}
      </div>

      {/* Design Specifications Sub-Panel */}
      {showSpecs && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 text-[10px] mono text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="space-y-1">
            <span className="text-slate-400 block font-bold text-[9px]">CANVAS & BACKGROUND</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700" />
              <span>#0f172a → #1e293b</span>
            </div>
            <span className="text-slate-500 text-[8.5px]">1200×600 (2:1 Ratio)</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-bold text-[9px]">3-SIGNAL LENSES</span>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" title="Red: #ff6b6b to #7f1d1d" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" title="Amber: #fde047 to #713f12" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e]" title="Green: #86efac to #14532d" />
              <span className="text-slate-400 text-[8.5px]">r=28, Glow blur 12</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-bold text-[9px]">TYPOGRAPHY</span>
            <div className="text-white font-black text-[10px]">Arial 900 · 38px</div>
            <span className="text-emerald-400 text-[8.5px]">Arial 700 · #4ade80 · 14px</span>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 block font-bold text-[9px]">PARTNERSHIP BADGE</span>
            <div className="text-slate-200 text-[9px]">Ministry of ICT & NG</div>
            <span className="text-slate-500 text-[8.5px]">#0f172a · Stroke #10b981</span>
          </div>
        </div>
      )}
    </div>
  );
};
