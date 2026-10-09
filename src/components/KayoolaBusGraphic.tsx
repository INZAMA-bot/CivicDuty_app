import React, { useState } from 'react';
import { Download, Copy, Check, Info, Bus, Train, Bike } from 'lucide-react';
import { getCountryTransitSpecs } from '../data/promotionalAds';

interface KayoolaBusGraphicProps {
  className?: string;
  showControls?: boolean;
  initialViewMode?: 'full' | 'beacon' | 'badge';
  interactive?: boolean;
  vehicleType?: 'bus' | 'train' | 'bodaboda';
  countryCode?: string;
}

export const KayoolaBusGraphic: React.FC<KayoolaBusGraphicProps> = ({
  className = '',
  showControls = true,
  initialViewMode = 'full',
  vehicleType: propVehicleType,
  countryCode = 'UG',
}) => {
  const [activeVehicle, setActiveVehicle] = useState<'bus' | 'train' | 'bodaboda'>(propVehicleType || 'bus');
  const [viewMode, setViewMode] = useState<'full' | 'beacon' | 'badge'>(initialViewMode);
  const [isCopied, setIsCopied] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);

  // Sync if propVehicleType changes from parent (e.g., PromotionalAdFeedCard pillar tabs)
  const effectiveVehicle = propVehicleType || activeVehicle;
  const transitSpec = getCountryTransitSpecs(countryCode);

  const viewBoxes = {
    full: '0 0 1200 600',
    beacon: '170 250 620 185',
    badge: '760 265 360 155',
  };

  const currentViewBox = viewBoxes[viewMode];

  const handleCopy = () => {
    const svgEl = document.getElementById(`civicduty-livery-svg-${effectiveVehicle}-${countryCode}`);
    const serialized = svgEl ? svgEl.outerHTML : `<svg viewBox="0 0 1200 600"></svg>`;
    navigator.clipboard?.writeText(serialized);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const svgEl = document.getElementById(`civicduty-livery-svg-${effectiveVehicle}-${countryCode}`);
    const serialized = svgEl ? svgEl.outerHTML : `<svg viewBox="0 0 1200 600"></svg>`;
    const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `civicduty-${effectiveVehicle}-${countryCode.toLowerCase()}-livery.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Official CivicDuty 3-Signal Logo reusable SVG group (exact match to TrafficLightLogo.tsx)
  const renderOfficialLogoSvg = (x: number, y: number, scale = 1) => (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Matte Studio Pill Housing */}
      <rect
        x="0"
        y="0"
        width="236"
        height="78"
        rx="16"
        fill="#0e1116"
        stroke="#262b36"
        strokeWidth="2.5"
      />
      {/* Signal 1: Red Ring + Soft Coral Center (Citizen Speaks) */}
      <circle cx="44" cy="39" r="23" fill="none" stroke="#EF4444" strokeWidth="5.5" />
      <circle cx="44" cy="39" r="7.5" fill="#F87171" />

      {/* Signal 2: Amber Ring + Soft Gold Center (Government Serves) */}
      <circle cx="118" cy="39" r="23" fill="none" stroke="#F59E0B" strokeWidth="5.5" />
      <circle cx="118" cy="39" r="7.5" fill="#FDE047" />

      {/* Signal 3: Emerald Ring + Deep Pine Fill + Bold White Checkmark (Citizen Heard & Resolved) */}
      <circle cx="192" cy="39" r="23" fill="#064E3B" stroke="#10B981" strokeWidth="5.5" />
      <path
        d="M 181 39.5 L 189 47.5 L 203 32.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );

  return (
    <div
      className={`w-full flex flex-col rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] ${className}`}
    >
      {/* Top Studio Graphic Toolbar — Google AI Studio Aesthetic */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              {effectiveVehicle === 'bus' ? (
                <Bus size={14} />
              ) : effectiveVehicle === 'train' ? (
                <Train size={14} />
              ) : (
                <Bike size={14} />
              )}
            </div>
            <div>
              <div className="font-mono font-bold text-[11px] text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>
                  {effectiveVehicle === 'bus'
                    ? `${transitSpec.busPartnerName} · Actual Coach Livery`
                    : effectiveVehicle === 'train'
                    ? `${transitSpec.trainOperatorName} · Moving Billboard Train`
                    : `${transitSpec.countryName} Bodaboda & Stage Scout Poster`}
                </span>
                <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400">
                  · [{transitSpec.countryCode}] Official Spec
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                1200×600 Architectural Vector · Current 3-Signal Checkmark Logo · aistudio.google Aesthetic
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Vehicle Switcher if not locked by parent */}
            {!propVehicleType && (
              <div className="inline-flex rounded-lg bg-white dark:bg-[#161a22] p-0.5 border border-[#e3e6ea] dark:border-[#262b36]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveVehicle('bus');
                    setViewMode('full');
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                    effectiveVehicle === 'bus'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Bus size={11} />
                  <span>Kayoola Bus</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveVehicle('train');
                    setViewMode('full');
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                    effectiveVehicle === 'train'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Train size={11} />
                  <span>Railway Train</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveVehicle('bodaboda');
                    setViewMode('full');
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                    effectiveVehicle === 'bodaboda'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Bike size={11} />
                  <span>Boda &amp; Stage</span>
                </button>
              </div>
            )}

            {/* Zoom / Focus Mode Buttons */}
            <div className="inline-flex rounded-lg bg-white dark:bg-[#161a22] p-0.5 border border-[#e3e6ea] dark:border-[#262b36]">
              <button
                type="button"
                onClick={() => setViewMode('full')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold cursor-pointer ${
                  viewMode === 'full'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Full View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('beacon')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold cursor-pointer ${
                  viewMode === 'beacon'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Logo Zoom
              </button>
              <button
                type="button"
                onClick={() => setViewMode('badge')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold cursor-pointer ${
                  viewMode === 'badge'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                USSD &amp; Partner
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSpecs(!showSpecs)}
              title="Design Specifications"
              className={`p-1.5 rounded-lg border cursor-pointer ${
                showSpecs
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-500'
              }`}
            >
              <Info size={13} />
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-emerald-500 text-[10px] font-mono font-semibold cursor-pointer"
            >
              {isCopied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
              <span>{isCopied ? 'Copied' : 'SVG'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
            >
              <Download size={11} />
              <span>Save SVG</span>
            </button>
          </div>
        </div>
      )}

      {/* SVG Canvas Display Container — Google AI Studio Dark Slate Canvas */}
      <div className="relative w-full aspect-[2/1] bg-[#0e1116] overflow-hidden flex items-center justify-center select-none">
        <svg
          id={`civicduty-livery-svg-${effectiveVehicle}-${countryCode}`}
          viewBox={currentViewBox}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain transition-all duration-500 ease-in-out"
        >
          <defs>
            {/* Subtle Technical Studio Grid */}
            <pattern id="studioGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e2430" strokeWidth="1" />
            </pattern>
            <linearGradient id="glassTint" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d14" />
            </linearGradient>
            <linearGradient id="emeraldStripe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* Studio Background & Architectural Grid */}
          <rect width="1200" height="600" fill="#0e1116" />
          <rect width="1200" height="600" fill="url(#studioGrid)" opacity="0.65" />

          {/* Top Studio Telemetry Header Strip Inside Poster */}
          <rect x="40" y="24" width="1120" height="38" rx="8" fill="#161a22" stroke="#262b36" strokeWidth="1.5" />
          <circle cx="62" cy="43" r="5" fill="#10b981" />
          <text x="76" y="47" fontFamily="monospace" fontWeight="700" fontSize="12" fill="#e2e8f0" letterSpacing="1">
            CIVICDUTY.SITE · {transitSpec.countryName.toUpperCase()} SOVEREIGN TRANSIT &amp; OUTDOOR MEDIA SPEC [{transitSpec.countryCode}]
          </text>
          <text x="1140" y="47" textAnchor="end" fontFamily="monospace" fontWeight="700" fontSize="12" fill="#10b981">
            FREE USSD: {transitSpec.ussdCode}
          </text>

          {/* ============================================================== */}
          {/* VEHICLE 1: ACTUAL KAYOOLA EVS LOW-FLOOR ELECTRIC BUS PROFILE   */}
          {/* ============================================================== */}
          {effectiveVehicle === 'bus' && (
            <g>
              {/* Asphalt Road Deck & Lane Markings */}
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#262b36" strokeWidth="2" />
              <line x1="40" y1="548" x2="1160" y2="548" stroke="#334155" strokeWidth="3" strokeDasharray="36 28" />

              {/* Ground Contact Shadow */}
              <ellipse cx="600" cy="508" rx="515" ry="12" fill="#000000" opacity="0.7" />

              {/* Roof-Mounted Electric Battery & HVAC Aerodynamic Pod (Signature Kayoola EVS Feature) */}
              <path
                d="M 210 132 L 950 132 C 975 132 990 144 998 158 L 185 158 C 192 144 198 132 210 132 Z"
                fill="#161a22"
                stroke="#334155"
                strokeWidth="2"
              />
              <rect x="260" y="139" width="140" height="12" rx="3" fill="#0e1116" stroke="#10b981" strokeWidth="1" />
              <text x="330" y="148" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="8.5" fill="#10b981">
                ZERO-EMISSION EVPACK
              </text>
              <rect x="430" y="141" width="90" height="8" rx="2" fill="#262b36" />
              <rect x="540" y="141" width="90" height="8" rx="2" fill="#262b36" />
              <rect x="780" y="138" width="150" height="13" rx="3" fill="#0e1116" stroke="#262b36" strokeWidth="1" />
              <text x="855" y="148" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="8.5" fill="#94a3b8">
                KIIRA MOTORS · KAYOOLA
              </text>

              {/* Main Low-Floor Coach Body Shell (Aerodynamic Sloped Front at Left, Boxy Rear at Right) */}
              <path
                d="M 108 265 C 112 205 124 166 152 158 L 1068 158 C 1088 158 1098 170 1098 190 L 1098 446 C 1098 458 1088 466 1072 466 L 116 466 C 104 466 96 456 98 440 Z"
                fill="#161a22"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* Upper Black-Framed Panoramic Glazing Belt (Continuous Flush Bus Windows) */}
              <path
                d="M 122 280 C 126 218 135 176 158 170 L 1075 170 C 1082 170 1086 175 1086 184 L 1086 286 L 122 286 Z"
                fill="url(#glassTint)"
                stroke="#262b36"
                strokeWidth="2"
              />

              {/* Front Destination LED Matrix Board (Above Driver Windshield) */}
              <rect x="148" y="175" width="165" height="24" rx="4" fill="#090c10" stroke="#262b36" strokeWidth="1.5" />
              <text x="230" y="191" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#fde047" letterSpacing="1">
                KAYOOLA EVS · {transitSpec.ussdCode}
              </text>

              {/* Panoramic Passenger Window Bays + Interior Seats Silhouette */}
              {[335, 465, 595, 795, 925].map((wx, idx) => (
                <g key={idx}>
                  <rect
                    x={wx}
                    y="176"
                    width="118"
                    height="102"
                    rx="5"
                    fill="#0b1320"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  {/* Upper Hopper Ventilation Transom Line */}
                  <line x1={wx} y1="202" x2={wx + 118} y2="202" stroke="#1e293b" strokeWidth="1.5" />
                  {/* Subtle Interior Passenger Headrests & Grab Rail */}
                  <line x1={wx + 8} y1="212" x2={wx + 110} y2="212" stroke="#f59e0b" strokeWidth="1" opacity="0.45" />
                  <rect x={wx + 22} y="242" width="22" height="32" rx="4" fill="#1e293b" />
                  <rect x={wx + 68} y="242" width="22" height="32" rx="4" fill="#1e293b" />
                </g>
              ))}

              {/* Front Double-Leaf Pneumatic Glass Boarding Door (Left/Front) */}
              <g>
                <rect x="225" y="204" width="94" height="252" rx="6" fill="#0b111a" stroke="#475569" strokeWidth="2" />
                <line x1="272" y1="204" x2="272" y2="456" stroke="#475569" strokeWidth="2" />
                <rect x="233" y="214" width="32" height="155" rx="3" fill="#111c2d" stroke="#334155" strokeWidth="1" />
                <rect x="279" y="214" width="32" height="155" rx="3" fill="#111c2d" stroke="#334155" strokeWidth="1" />
                {/* Yellow Low-Floor Boarding Grab Rails */}
                <line x1="238" y1="305" x2="265" y2="335" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="306" y1="305" x2="279" y2="335" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="225" y="450" width="94" height="6" fill="#f59e0b" />
              </g>

              {/* Mid-Coach Double-Leaf Pneumatic Alighting Door */}
              <g>
                <rect x="722" y="176" width="64" height="280" rx="5" fill="#0b111a" stroke="#475569" strokeWidth="2" />
                <line x1="754" y1="176" x2="754" y2="456" stroke="#475569" strokeWidth="2" />
                <rect x="728" y="186" width="21" height="175" rx="2" fill="#111c2d" stroke="#334155" strokeWidth="1" />
                <rect x="759" y="186" width="21" height="175" rx="2" fill="#111c2d" stroke="#334155" strokeWidth="1" />
                <rect x="722" y="450" width="64" height="6" fill="#10b981" />
              </g>

              {/* Cantilevered Front Transit Mirror (Left Front) */}
              <path d="M 134 210 L 82 210 L 82 248" fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
              <rect x="72" y="238" width="18" height="36" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />

              {/* Front LED Headlight Cluster & Amber Turn Indicator */}
              <rect x="100" y="395" width="18" height="26" rx="4" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="100" y="426" width="18" height="12" rx="3" fill="#f59e0b" />

              {/* Rear Tail Light Stack */}
              <rect x="1088" y="340" width="10" height="36" rx="2" fill="#ef4444" />
              <rect x="1088" y="380" width="10" height="22" rx="2" fill="#f59e0b" />

              {/* ============================================================ */}
              {/* CIVICDUTY AISTUDIO.GOOGLE FULL LIVERY WRAP ON COACH BODY     */}
              {/* ============================================================ */}
              {/* Emerald Precision Accent Line Under Windows */}
              <rect x="322" y="286" width="396" height="4" fill="url(#emeraldStripe)" />
              <rect x="790" y="286" width="306" height="4" fill="url(#emeraldStripe)" />

              {/* Official Current 3-Signal Checkmark Logo */}
              {renderOfficialLogoSvg(334, 304, 0.72)}

              {/* Brand Wordmark & Slogan */}
              <text
                x="518"
                y="338"
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight="900"
                fontSize="34"
                fill="#ffffff"
                letterSpacing="-0.5"
              >
                CivicDuty
              </text>
              <text
                x="520"
                y="357"
                fontFamily="monospace"
                fontWeight="700"
                fontSize="11.5"
                fill="#10b981"
                letterSpacing="1.8"
              >
                SPEAK · SERVE · BE HEARD
              </text>
              <text
                x="520"
                y="374"
                fontFamily="monospace"
                fontWeight="600"
                fontSize="10.5"
                fill="#94a3b8"
              >
                Report Potholes, Water Leaks &amp; Service Delays
              </text>

              {/* Proposal & Route Callout Strip Under Logo */}
              <rect x="334" y="390" width="372" height="32" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
              <text x="348" y="410" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#fde047">
                PROPOSED FLEET PAINTING · {transitSpec.busPartnerName.toUpperCase().slice(0, 24)}
              </text>

              {/* Rear Panel: Sovereign USSD & Co-Branding Box */}
              <rect x="796" y="302" width="284" height="120" rx="10" fill="#0e1116" stroke="#10b981" strokeWidth="1.75" />
              <text x="812" y="324" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#94a3b8" letterSpacing="1">
                ZERO-DATA PUBLIC ACCOUNTABILITY
              </text>
              <text x="812" y="356" fontFamily="monospace" fontWeight="900" fontSize="28" fill="#ffffff">
                DIAL {transitSpec.ussdCode}
              </text>
              <text x="812" y="376" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#10b981">
                OR VISIT CIVICDUTY.SITE (PWA)
              </text>
              <line x1="812" y1="388" x2="1064" y2="388" stroke="#262b36" strokeWidth="1" />
              <text x="812" y="406" fontFamily="monospace" fontWeight="600" fontSize="10" fill="#cbd5e1">
                Oversight: {transitSpec.municipalAuthority.slice(0, 30)}
              </text>

              {/* Side Amber Marker Reflectors Along Lower Skirt */}
              {[190, 440, 660, 1040].map((mx, i) => (
                <rect key={i} x={mx} y="444" width="14" height="5" rx="2" fill="#f59e0b" />
              ))}

              {/* Front & Rear Heavy-Duty Transit Wheel Arches & Multi-Lug Aluminum Hubs */}
              {[385, 925].map((cx, idx) => (
                <g key={idx}>
                  {/* Wheel Arch Cutout */}
                  <path
                    d={`M ${cx - 64} 466 A 64 64 0 0 1 ${cx + 64} 466 Z`}
                    fill="#090b0f"
                    stroke="#334155"
                    strokeWidth="2.5"
                  />
                  {/* Radial Bus Tire */}
                  <circle cx={cx} cy="466" r="52" fill="#111318" stroke="#262b36" strokeWidth="4" />
                  <circle cx={cx} cy="466" r="39" fill="#1e2430" stroke="#475569" strokeWidth="2" />
                  {/* Brushed Aluminum Rim & 10 Lug Bolts */}
                  <circle cx={cx} cy="466" r="27" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
                  <circle cx={cx} cy="466" r="12" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const bx = cx + Math.cos(rad) * 19.5;
                    const by = 466 + Math.sin(rad) * 19.5;
                    return <circle key={deg} cx={bx} cy={by} r="2.6" fill="#0f172a" />;
                  })}
                </g>
              ))}
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 2: ACTUAL COMMUTER TRAIN LOCOMOTIVE & PASSENGER COACH  */}
          {/* ============================================================== */}
          {effectiveVehicle === 'train' && (
            <g>
              {/* Railway Ballast Bed, Steel Tracks & Concrete Sleepers */}
              <rect x="0" y="488" width="1200" height="112" fill="#090b0f" />
              <rect x="0" y="486" width="1200" height="8" fill="#64748b" />
              <rect x="0" y="494" width="1200" height="6" fill="#334155" />
              {Array.from({ length: 28 }).map((_, idx) => (
                <rect key={idx} x={20 + idx * 42} y="496" width="22" height="10" rx="2" fill="#1e293b" />
              ))}

              {/* Overhead Catenary / Corridor Telemetry Line */}
              <line x1="0" y1="120" x2="1200" y2="120" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="8 8" />

              {/* 1. LEFT: DIESEL-ELECTRIC LOCOMOTIVE HEAD (URC / SGR Profile) */}
              <g>
                {/* Locomotive Main Chassis & Sloped Nose Hood */}
                <path
                  d="M 68 442 L 68 310 L 118 298 L 146 202 L 415 202 L 415 442 Z"
                  fill="#161a22"
                  stroke="#475569"
                  strokeWidth="3"
                />
                {/* High-Visibility Safety Chevron Pilot / Cowcatcher */}
                <polygon points="52,456 88,456 88,425 68,425" fill="#f59e0b" stroke="#0e1116" strokeWidth="2" />
                {/* Front Dual Halogen Beam Headlamps */}
                <rect x="64" y="330" width="12" height="24" rx="3" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
                {/* Locomotive Cab Windshield & Side Window */}
                <polygon points="124,292 148,215 178,215 178,292" fill="#0b1320" stroke="#475569" strokeWidth="2" />
                <rect x="188" y="216" width="54" height="58" rx="4" fill="#0b1320" stroke="#475569" strokeWidth="2" />
                {/* Locomotive Radiator Louver Grilles */}
                <rect x="262" y="224" width="132" height="66" rx="4" fill="#0e1116" stroke="#334155" strokeWidth="1.5" />
                {[274, 294, 314, 334, 354, 374].map((lx) => (
                  <line key={lx} x1={lx} y1="230" x2={lx} y2="284" stroke="#334155" strokeWidth="3" />
                ))}
                {/* Emerald & Gold Locomotive Hazard Stripe */}
                <rect x="68" y="362" width="347" height="14" fill="#10b981" />
                <rect x="68" y="376" width="347" height="6" fill="#f59e0b" />
                {/* Locomotive Unit Number & Operator */}
                <rect x="150" y="305" width="240" height="44" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="164" y="325" fontFamily="monospace" fontWeight="800" fontSize="12" fill="#ffffff">
                  {transitSpec.trainOperatorName.toUpperCase().slice(0, 26)}
                </text>
                <text x="164" y="341" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#10b981">
                  LOCO #904 · CIVICDUTY CORRIDOR PARTNER
                </text>

                {/* Locomotive Heavy Bogie & 2 Steel Wheelsets */}
                <rect x="105" y="442" width="275" height="22" rx="4" fill="#0e1116" stroke="#334155" strokeWidth="2" />
                {[155, 245, 335].map((wx) => (
                  <g key={wx}>
                    <circle cx={wx} cy="466" r="22" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
                    <circle cx={wx} cy="466" r="8" fill="#64748b" />
                  </g>
                ))}
              </g>

              {/* Heavy Steel Coupler & Accordion Gangway Between Loco and Coach */}
              <rect x="415" y="412" width="25" height="16" fill="#475569" />
              <rect x="420" y="218" width="16" height="218" fill="#090c10" stroke="#334155" strokeWidth="1.5" />

              {/* 2. RIGHT: FULL-LENGTH PASSENGER COMMUTER COACH (MOVING BILLBOARD) */}
              <g>
                {/* Corrugated Steel Roof Fairing */}
                <path
                  d="M 436 188 L 1126 188 C 1136 188 1142 194 1142 204 L 436 204 Z"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="2"
                />
                {/* Coach Main Body wrapped in CivicDuty Matte Studio Slate */}
                <rect
                  x="436"
                  y="204"
                  width="706"
                  height="238"
                  rx="6"
                  fill="#161a22"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Passenger Carriage Windows Row */}
                {[496, 578, 660, 742, 824, 906, 988].map((wx, idx) => (
                  <g key={idx}>
                    <rect
                      x={wx}
                      y="218"
                      width="66"
                      height="52"
                      rx="5"
                      fill="#0b1320"
                      stroke="#334155"
                      strokeWidth="2"
                    />
                    <line x1={wx} y1="234" x2={wx + 66} y2="234" stroke="#1e293b" strokeWidth="1.5" />
                  </g>
                ))}

                {/* Carriage End Boarding Doors */}
                <rect x="448" y="216" width="36" height="216" rx="4" fill="#0e1116" stroke="#475569" strokeWidth="1.5" />
                <rect x="454" y="226" width="24" height="70" rx="2" fill="#0b1320" />
                <rect x="1072" y="216" width="36" height="216" rx="4" fill="#0e1116" stroke="#475569" strokeWidth="1.5" />
                <rect x="1078" y="226" width="24" height="70" rx="2" fill="#0b1320" />

                {/* ========================================================== */}
                {/* MOVING BILLBOARD LIVERY BAND ACROSS PASSENGER CARRIAGE     */}
                {/* ========================================================== */}
                <rect x="494" y="282" width="564" height="4" fill="url(#emeraldStripe)" />

                {/* Official Current 3-Signal Checkmark Logo */}
                {renderOfficialLogoSvg(496, 298, 0.72)}

                {/* Moving Billboard Headline */}
                <text
                  x="680"
                  y="330"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontWeight="900"
                  fontSize="32"
                  fill="#ffffff"
                >
                  CivicDuty
                </text>
                <text
                  x="682"
                  y="350"
                  fontFamily="monospace"
                  fontWeight="700"
                  fontSize="11.5"
                  fill="#10b981"
                  letterSpacing="1.5"
                >
                  SPEAK · SERVE · BE HEARD
                </text>
                <text
                  x="682"
                  y="368"
                  fontFamily="monospace"
                  fontWeight="600"
                  fontSize="10.5"
                  fill="#cbd5e1"
                >
                  MOVING BILLBOARD · RAIL REFURBISHMENT PROPOSAL
                </text>

                {/* Right USSD Callout Pill on Train Carriage */}
                <rect x="865" y="298" width="192" height="76" rx="8" fill="#0e1116" stroke="#10b981" strokeWidth="1.75" />
                <text x="880" y="319" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill="#fde047">
                  REPORT SERVICE DEFECTS
                </text>
                <text x="880" y="346" fontFamily="monospace" fontWeight="900" fontSize="22" fill="#ffffff">
                  DIAL {transitSpec.ussdCode}
                </text>
                <text x="880" y="364" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#10b981">
                  CIVICDUTY.SITE · ZERO DATA
                </text>

                {/* Bottom Corridor Strip on Coach */}
                <rect x="496" y="388" width="562" height="34" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="512" y="409" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#94a3b8">
                  CORRIDOR: {transitSpec.trainCorridors.toUpperCase().slice(0, 62)}
                </text>

                {/* Coach Bogies & Dual Rail Wheelsets */}
                {[530, 1005].map((bx) => (
                  <g key={bx}>
                    <rect x={bx - 65} y="442" width="130" height="20" rx="4" fill="#0e1116" stroke="#334155" strokeWidth="2" />
                    <circle cx={bx - 36} cy="466" r="21" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
                    <circle cx={bx - 36} cy="466" r="7" fill="#64748b" />
                    <circle cx={bx + 36} cy="466" r="21" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
                    <circle cx={bx + 36} cy="466" r="7" fill="#64748b" />
                  </g>
                ))}
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 3: ACTUAL BODABODA MOTORCYCLE, RIDER & STAGE BILLBOARD */}
          {/* ============================================================== */}
          {effectiveVehicle === 'bodaboda' && (
            <g>
              {/* Ground Street Surface */}
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#262b36" strokeWidth="2" />

              {/* 1. LEFT SIDE: AUTHENTIC BOXER 150CC BODABODA MOTORCYCLE & RIDER IN REFLECTOR VEST */}
              <g transform="translate(30, 15)">
                {/* Ground Shadow Under Motorcycle */}
                <ellipse cx="305" cy="492" rx="185" ry="10" fill="#000000" opacity="0.7" />

                {/* Rear Spoked Motorcycle Wheel (Left) */}
                <circle cx="175" cy="425" r="62" fill="none" stroke="#111318" strokeWidth="16" />
                <circle cx="175" cy="425" r="52" fill="none" stroke="#94a3b8" strokeWidth="3" />
                {[0, 30, 60, 90, 120, 150].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <line
                      key={deg}
                      x1={175 - Math.cos(rad) * 50}
                      y1={425 - Math.sin(rad) * 50}
                      x2={175 + Math.cos(rad) * 50}
                      y2={425 + Math.sin(rad) * 50}
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                  );
                })}
                <circle cx="175" cy="425" r="14" fill="#334155" stroke="#94a3b8" strokeWidth="2" />

                {/* Front Spoked Motorcycle Wheel (Right) */}
                <circle cx="445" cy="425" r="62" fill="none" stroke="#111318" strokeWidth="15" />
                <circle cx="445" cy="425" r="52" fill="none" stroke="#94a3b8" strokeWidth="3" />
                {[0, 30, 60, 90, 120, 150].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <line
                      key={deg}
                      x1={445 - Math.cos(rad) * 50}
                      y1={425 - Math.sin(rad) * 50}
                      x2={445 + Math.cos(rad) * 50}
                      y2={425 + Math.sin(rad) * 50}
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                  );
                })}
                <circle cx="445" cy="425" r="14" fill="#334155" stroke="#94a3b8" strokeWidth="2" />

                {/* Front Mudguard / Fender */}
                <path
                  d="M 382 392 A 68 68 0 0 1 486 385"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="10"
                  strokeLinecap="round"
                />

                {/* Rear Swingarm, Dual Coil Shock Absorber & Chrome Exhaust Muffler */}
                <line x1="175" y1="425" x2="285" y2="412" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
                <line x1="182" y1="418" x2="215" y2="335" stroke="#f59e0b" strokeWidth="6" strokeDasharray="6 4" />
                {/* Chrome Exhaust Pipe */}
                <path
                  d="M 325 415 L 260 442 L 128 432 L 128 418 L 260 428 Z"
                  fill="#cbd5e1"
                  stroke="#475569"
                  strokeWidth="2"
                />

                {/* 150cc Finned Engine Block & Crankcase */}
                <rect x="275" y="355" width="72" height="68" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2.5" />
                {[366, 376, 386, 396].map((fy) => (
                  <line key={fy} x1="282" y1={fy} x2="340" y2={fy} stroke="#94a3b8" strokeWidth="2" />
                ))}
                <circle cx="305" cy="408" r="14" fill="#334155" stroke="#94a3b8" strokeWidth="2" />

                {/* Front Telescopic Forks & Handlebars */}
                <line x1="445" y1="425" x2="378" y2="245" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" />
                <line x1="378" y1="245" x2="348" y2="232" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

                {/* Boxer Rectangular Headlight Cowling & Amber Turn Signal */}
                <path
                  d="M 374 248 L 418 256 L 414 306 L 378 302 Z"
                  fill="#161a22"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <rect x="412" y="266" width="12" height="28" rx="2" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />

                {/* Sculpted Fuel Tank (CivicDuty Branded) */}
                <path
                  d="M 272 336 C 276 292 318 282 378 296 L 366 346 L 272 346 Z"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                <text x="292" y="325" fontFamily="monospace" fontWeight="900" fontSize="13" fill="#ffffff">
                  CIVICDUTY
                </text>
                <text x="292" y="338" fontFamily="monospace" fontWeight="700" fontSize="9" fill="#fde047">
                  STAGE SCOUT
                </text>

                {/* Stepped Long Dual Boda Seat & Heavy-Duty Rear Carrier Rack */}
                <path
                  d="M 145 322 L 274 334 L 274 354 L 140 344 C 134 342 134 324 145 322 Z"
                  fill="#0f172a"
                  stroke="#475569"
                  strokeWidth="2"
                />
                {/* Rear Steel Carrier Frame */}
                <path
                  d="M 140 334 L 96 334 L 96 314 L 135 322"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />

                {/* Rider Silhouette Wearing High-Vis CivicDuty Reflector Vest & Safety Helmet */}
                <g>
                  {/* Safety Helmet with Visor */}
                  <circle cx="295" cy="162" r="26" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <path d="M 302 152 L 322 156 L 318 172 L 300 170 Z" fill="#0f172a" />
                  {/* High-Vis Neon Reflector Vest Torso */}
                  <path
                    d="M 255 192 L 315 192 L 324 302 L 246 302 Z"
                    fill="#10b981"
                    stroke="#064e3b"
                    strokeWidth="2.5"
                  />
                  {/* Silver/Yellow High-Vis Reflective Tape Stripes on Vest */}
                  <rect x="250" y="248" width="71" height="10" fill="#fde047" />
                  <rect x="248" y="272" width="74" height="10" fill="#fde047" />
                  <text x="285" y="224" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="11" fill="#090d14">
                    CIVICDUTY
                  </text>
                  <text x="285" y="238" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="10" fill="#ffffff">
                    {transitSpec.ussdCode}
                  </text>
                  {/* Rider Arm Reaching to Handlebar */}
                  <line x1="308" y1="205" x2="352" y2="236" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
                  {/* Rider Leg on Footpeg */}
                  <path
                    d="M 275 302 L 305 362 L 292 418"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>

              {/* 2. RIGHT SIDE: BODABODA STAGE SHELTER & A1 WATERPROOF STAGE POSTER */}
              <g>
                {/* Steel Stage Shelter Columns & Corrugated Roof Canopy */}
                <rect x="595" y="135" width="10" height="370" fill="#334155" />
                <rect x="1125" y="135" width="10" height="370" fill="#334155" />
                <polygon points="565,138 1155,138 1135,112 585,112" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
                <text x="860" y="130" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="11" fill="#10b981" letterSpacing="1.5">
                  OFFICIAL {transitSpec.countryName.toUpperCase()} STAGE SCOUT SHELTER &amp; SIGNPOST
                </text>

                {/* Main Stage Poster Board (aistudio.google Matte Surface) */}
                <rect
                  x="620"
                  y="156"
                  width="490"
                  height="324"
                  rx="12"
                  fill="#161a22"
                  stroke="#262b36"
                  strokeWidth="2.5"
                />

                {/* Official Current 3-Signal Checkmark Logo Centered at Top of Poster */}
                {renderOfficialLogoSvg(644, 176, 0.8)}

                {/* Stage Code Badge */}
                <rect x="852" y="178" width="234" height="58" rx="8" fill="#0e1116" stroke="#10b981" strokeWidth="1.5" />
                <text x="868" y="199" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#94a3b8">
                  STAGE REGISTRATION &amp; PERKS
                </text>
                <text x="868" y="221" fontFamily="monospace" fontWeight="900" fontSize="15" fill="#10b981">
                  BODA BOUNTY POOL ACTIVE
                </text>

                {/* Poster Main Headline */}
                <text
                  x="644"
                  y="278"
                  fontFamily="Inter, system-ui, sans-serif"
                  fontWeight="900"
                  fontSize="30"
                  fill="#ffffff"
                >
                  {transitSpec.localSlogan}
                </text>
                <text
                  x="644"
                  y="302"
                  fontFamily="monospace"
                  fontWeight="700"
                  fontSize="12"
                  fill="#fde047"
                  letterSpacing="1.2"
                >
                  SEE A POTHOLE, BROKEN DRAIN OR UNCOLLECTED GARBAGE?
                </text>

                {/* 3-Step Rider Action Box */}
                <rect x="644" y="318" width="442" height="84" rx="8" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="660" y="340" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#e2e8f0">
                  1. SNAP PHOTO OR DIAL {transitSpec.ussdCode} (100% FREE · ZERO DATA)
                </text>
                <text x="660" y="362" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#10b981">
                  2. PUBLIC SLA CLOCK STARTS ON {transitSpec.municipalAuthority.toUpperCase().slice(0, 26)}
                </text>
                <text x="660" y="384" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#fde047">
                  3. EARN PRE-FUNDED FUEL, RIDE &amp; AIRTIME VOUCHERS!
                </text>

                {/* Bottom USSD Callout Bar on Stage Poster */}
                <rect x="644" y="414" width="442" height="46" rx="8" fill="#059669" />
                <text x="865" y="443" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="18" fill="#ffffff" letterSpacing="1">
                  DIAL {transitSpec.ussdCode} · OR INSTALL CIVICDUTY.SITE
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Design Specifications Sub-Panel */}
      {showSpecs && (
        <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono text-slate-600 dark:text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="space-y-0.5">
            <span className="text-slate-400 block font-bold text-[9px]">AESTHETIC SYSTEM</span>
            <div className="font-semibold text-slate-900 dark:text-white">aistudio.google Matte</div>
            <span className="text-slate-500 text-[9px]">#0e1116 / #161a22 / #262b36</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 block font-bold text-[9px]">OFFICIAL LOGO</span>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">Current 3-Signal Checkmark</div>
            <span className="text-slate-500 text-[9px]">Red · Amber · Emerald Check</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 block font-bold text-[9px]">FLEET &amp; CORRIDOR</span>
            <div className="font-semibold text-slate-900 dark:text-white truncate">{transitSpec.busPartnerName}</div>
            <span className="text-slate-500 text-[9px] truncate block">{transitSpec.trainOperatorName}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 block font-bold text-[9px]">OFFLINE GATEWAY</span>
            <div className="font-semibold text-amber-600 dark:text-amber-400">{transitSpec.ussdCode} Zero-Rated</div>
            <span className="text-slate-500 text-[9px]">{transitSpec.municipalAuthority}</span>
          </div>
        </div>
      )}
    </div>
  );
};
