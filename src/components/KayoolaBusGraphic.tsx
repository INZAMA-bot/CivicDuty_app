import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Info,
  Bus,
  Train,
  Bike,
  Store,
  Car,
  Stethoscope,
  GraduationCap,
  HardHat,
  Share2,
  ShieldCheck,
} from 'lucide-react';
import { getCountryTransitSpecs } from '../data/promotionalAds';

export type GraphicVehicleType =
  | 'bus'
  | 'train'
  | 'bodaboda'
  | 'market'
  | 'taxi'
  | 'health'
  | 'teacher'
  | 'artisan';

interface KayoolaBusGraphicProps {
  className?: string;
  showControls?: boolean;
  initialViewMode?: 'full' | 'beacon' | 'badge';
  interactive?: boolean;
  vehicleType?: GraphicVehicleType;
  countryCode?: string;
  onSelectVehicle?: (type: GraphicVehicleType) => void;
}

export const KayoolaBusGraphic: React.FC<KayoolaBusGraphicProps> = ({
  className = '',
  showControls = true,
  initialViewMode = 'full',
  vehicleType: propVehicleType,
  countryCode = 'UG',
  onSelectVehicle,
}) => {
  const [activeVehicle, setActiveVehicle] = useState<GraphicVehicleType>(propVehicleType || 'bus');
  const [viewMode, setViewMode] = useState<'full' | 'beacon' | 'badge'>(initialViewMode);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState<'x' | 'linkedin' | 'whatsapp' | 'facebook'>('x');

  // Sync if propVehicleType changes from parent (e.g. PromotionalAdFeedCard pillar tabs)
  const effectiveVehicle = propVehicleType || activeVehicle;
  const transitSpec = getCountryTransitSpecs(countryCode);

  const viewBoxes = {
    full: '0 0 1200 600',
    beacon: '170 250 620 185',
    badge: '760 265 360 155',
  };

  const currentViewBox = viewBoxes[viewMode];

  const handleCopySvg = () => {
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
    link.download = `civicduty-${effectiveVehicle}-${countryCode.toLowerCase()}-campaign-poster.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const VEHICLE_JPG_MAP: Record<GraphicVehicleType, string> = {
    bus: '/campaign/kayoola_kampala_street_ad.jpg',
    train: '/campaign/train_moving_billboard_kampala.jpg',
    bodaboda: '/campaign/boda_stage_billboard_ad.jpg',
    market: '/campaign/market_vendors_billboard_ad.jpg',
    taxi: '/campaign/taxi_park_billboard_ad.jpg',
    health: '/campaign/health_clinic_billboard_ad.jpg',
    teacher: '/campaign/school_youth_billboard_ad.jpg',
    artisan: '/campaign/artisan_construction_billboard_ad.jpg',
  };

  const handleDownloadJpg = () => {
    const src = VEHICLE_JPG_MAP[effectiveVehicle] || '/campaign/boda_stage_billboard_ad.jpg';
    const link = document.createElement('a');
    link.href = src;
    link.download = `civicduty-${effectiveVehicle}-${countryCode.toLowerCase()}-street-poster.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate ready-to-post copy for social media marketing
  const getSocialPostCopy = () => {
    const ussd = transitSpec.ussdCode;
    const country = transitSpec.countryName;
    const web = 'https://civicduty.site';

    const baseHashtags = `#CivicDuty #SpeakServeBeHeard #${country.replace(/\s+/g, '')} #PublicAccountability #ZeroData #SmartCities`;

    switch (effectiveVehicle) {
      case 'bus':
        return `🚨 TRANSIT PARTNERSHIP BLUEPRINT: CivicDuty × ${transitSpec.busPartnerName}!\n\nWe are proposing to fund and execute the official exterior painting of ${country}’s Kayoola electric bus fleet in the 3-Signal design.\n\n🚌 Zero-data USSD ${ussd} empowers millions of daily commuters to report potholes, non-functional streetlights & municipal defects straight to local authorities.\n\n👉 Inspect full blueprint or partner: ${web}\n\n${baseHashtags} #KayoolaEVS #KiiraMotors #GreenMobility`;

      case 'train':
        return `🚂 A MOVING BILLBOARD FOR CITIZEN EMPOWERMENT: CivicDuty × ${transitSpec.trainOperatorName}!\n\nCivicDuty proposes sandblasting and freshly painting commuter passenger trains across ${transitSpec.trainCorridors}.\n\nTurning everyday rail corridors into panoramic civic accountability billboards visible across every level crossing!\n\n📲 Dial ${ussd} (100% FREE on any phone)\n👉 Visit: ${web}\n\n${baseHashtags} #RailTransit #MovingBillboard #CommuterRail`;

      case 'bodaboda':
        return `🛵 BODA MAN: GWE BOSS W’OLUGUUDO! (Frontline Road Safety Scouts)\n\nBodaboda riders navigate every single corner of ${country}. Through CivicDuty, stages and riders report potholes, open manholes & road hazards.\n\n🎁 Top 3 Frontline Scouts in each stage receive monthly fuel & mobile data bounties!\n\n📲 DIAL ${ussd} (FREE · Works on any basic phone without bundles)\n👉 Join: ${web}\n\n${baseHashtags} #BodabodaScouts #RoadSafety #FrontlineScouts`;

      case 'market':
        return `🏪 MARKET VENDORS & TRADERS: DEFEND YOUR MARKET!\n\nFrom Nakasero to Owino, Kalerwe & city markets across ${country}, vendors can now report blocked drains, uncollected garbage, water outages & unfair market dues in 30 seconds.\n\n🏆 Top-ranked market traders receive monthly grocery & utility bounties!\n\n📲 Dial ${ussd} (100% FREE)\n👉 ${web}\n\n${baseHashtags} #MarketVendors #CleanCities #LocalTraders`;

      case 'taxi':
        return `🚐 TAXI & MATATU DRIVERS: HIGHWAY CORRIDOR WATCHDOGS!\n\nCommercial taxi drivers and matatu crews are the heartbeat of ${country}’s transport arteries. Log highway washouts, illegal extortion checkpoints & dangerous blackspots.\n\n⛽ Top-ranking drivers earn monthly highway transit fuel vouchers!\n\n📲 Dial ${ussd} FREE\n👉 ${web}\n\n${baseHashtags} #MatatuSacco #TaxiDrivers #HighwaySafety`;

      case 'health':
        return `🏥 HEALTHCARE MONITORS & PATIENTS: DEFEND YOUR CLINIC!\n\nCommunity health centers deserve continuous support. Healthcare workers and patients can now track essential medicine stockouts, triage equipment & maternity ward oxygen in real-time.\n\n💊 Health monitors receive clinical data & wellness vouchers!\n\n📲 Dial ${ussd} FREE\n👉 ${web}\n\n${baseHashtags} #PublicHealth #HealthMonitors #MinistryOfHealth`;

      case 'teacher':
        return `🎓 TEACHERS, STUDENTS & YOUTH SCOUTS: SAFE SCHOOL ZONES!\n\nYouth leaders and teachers are guarding our educational centers. Report dilapidated classrooms, missing desks, child crossing hazards & library needs.\n\n📚 Youth scouts receive monthly educational data bundles & stationery credits!\n\n📲 Dial ${ussd} FREE\n👉 ${web}\n\n${baseHashtags} #EducationWatch #YouthLeaders #SafeSchools`;

      case 'artisan':
        return `🏗️ ARTISANS, BUILDERS & TECHNICIANS: AUDIT PUBLIC WORKS!\n\nCalling all masons, civil technicians, plumbers & electricians! Audit substandard asphalt, unvibrated bridge concrete & delayed road culverts on public contracts.\n\n🛠️ Top workmanship inspectors earn contractor CSR tool bounties!\n\n📲 Dial ${ussd} FREE\n👉 ${web}\n\n${baseHashtags} #InfrastructureWatch #PublicWorks #CivilArtisans`;
    }
  };

  const handleCopySocial = () => {
    navigator.clipboard?.writeText(getSocialPostCopy());
    setCopiedSocial(true);
    setTimeout(() => setCopiedSocial(false), 2200);
  };

  // Reusable 3-Signal Checkmark Logo Group
  const renderOfficialLogoSvg = (x: number, y: number, scale = 1) => (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
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
      {/* Signal 1: Red (Citizen Speaks) */}
      <circle cx="44" cy="39" r="23" fill="none" stroke="#EF4444" strokeWidth="5.5" />
      <circle cx="44" cy="39" r="7.5" fill="#F87171" />

      {/* Signal 2: Amber (Government Serves) */}
      <circle cx="118" cy="39" r="23" fill="none" stroke="#F59E0B" strokeWidth="5.5" />
      <circle cx="118" cy="39" r="7.5" fill="#FDE047" />

      {/* Signal 3: Emerald Checkmark (Resolved & Heard) */}
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
      {/* Top Studio Graphic Toolbar — Google AI Studio Matte Aesthetic */}
      {showControls && (
        <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] space-y-2 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                {effectiveVehicle === 'bus' ? (
                  <Bus size={14} />
                ) : effectiveVehicle === 'train' ? (
                  <Train size={14} />
                ) : effectiveVehicle === 'bodaboda' ? (
                  <Bike size={14} />
                ) : effectiveVehicle === 'market' ? (
                  <Store size={14} />
                ) : effectiveVehicle === 'taxi' ? (
                  <Car size={14} />
                ) : effectiveVehicle === 'health' ? (
                  <Stethoscope size={14} />
                ) : effectiveVehicle === 'teacher' ? (
                  <GraduationCap size={14} />
                ) : (
                  <HardHat size={14} />
                )}
              </div>
              <div>
                <div className="font-mono font-bold text-[11px] text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 flex-wrap">
                  <span>
                    {effectiveVehicle === 'bus'
                      ? `${transitSpec.busPartnerName} · Kayoola EVS Street Appearance`
                      : effectiveVehicle === 'train'
                      ? `${transitSpec.trainOperatorName} · Moving Billboard Train Appearance`
                      : effectiveVehicle === 'bodaboda'
                      ? `${transitSpec.countryName} Bodaboda Stage & Rider Billboard`
                      : effectiveVehicle === 'market'
                      ? `${transitSpec.countryName} Market Vendors & Traders Billboard`
                      : effectiveVehicle === 'taxi'
                      ? `${transitSpec.countryName} Matatu & Taxi Drivers Gantry Billboard`
                      : effectiveVehicle === 'health'
                      ? `${transitSpec.countryName} Healthcare Center Accountability Board`
                      : effectiveVehicle === 'teacher'
                      ? `${transitSpec.countryName} School & Youth Leaders Watch Poster`
                      : `${transitSpec.countryName} Public Works Artisans Quality Signboard`}
                  </span>
                  <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    [{transitSpec.countryCode} Official Poster]
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  1200×600 Social Marketing Poster · Official 3-Signal Checkmark Logo · Ready for Social Media
                </div>
              </div>
            </div>

            {/* Quick Actions: Copy Social Copy + Download Vector Poster */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={handleCopySocial}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-mono font-bold transition cursor-pointer shadow-xs"
                title="Copy ready-to-publish social media caption"
              >
                {copiedSocial ? <Check size={12} /> : <Share2 size={12} />}
                <span>{copiedSocial ? 'Caption Copied!' : 'Copy Social Caption'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJpg}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10.5px] font-mono font-bold transition cursor-pointer shadow-xs"
                title="Download Photo Campaign Poster (.jpg) for social media"
              >
                <Download size={12} />
                <span>Photo JPG</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10.5px] font-mono font-bold transition cursor-pointer"
                title="Download 1200×600 SVG vector poster for social media"
              >
                <Download size={12} />
                <span>Vector SVG</span>
              </button>

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
                onClick={handleCopySvg}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-emerald-500 text-[10px] font-mono font-semibold cursor-pointer"
              >
                {isCopied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                <span>{isCopied ? 'Copied' : 'SVG'}</span>
              </button>
            </div>
          </div>

          {/* 8-Category Reporter Profession & Transit Selector Bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 pt-1">
            {[
              { id: 'bus' as GraphicVehicleType, label: 'Kayoola Bus', icon: Bus },
              { id: 'train' as GraphicVehicleType, label: 'Commuter Train', icon: Train },
              { id: 'bodaboda' as GraphicVehicleType, label: 'Bodaboda Stage', icon: Bike },
              { id: 'market' as GraphicVehicleType, label: 'Market Vendors', icon: Store },
              { id: 'taxi' as GraphicVehicleType, label: 'Matatu & Taxis', icon: Car },
              { id: 'health' as GraphicVehicleType, label: 'Health Monitors', icon: Stethoscope },
              { id: 'teacher' as GraphicVehicleType, label: 'Teachers & Youth', icon: GraduationCap },
              { id: 'artisan' as GraphicVehicleType, label: 'Artisans & Builders', icon: HardHat },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = effectiveVehicle === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveVehicle(cat.id);
                    setViewMode('full');
                    if (onSelectVehicle) onSelectVehicle(cat.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  <Icon size={11} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main SVG Vector Canvas: 1200x600 High-Fidelity Social Ad Poster */}
      <div className="relative w-full aspect-[2/1] bg-[#090b10] flex items-center justify-center overflow-hidden">
        <svg
          id={`civicduty-livery-svg-${effectiveVehicle}-${countryCode}`}
          viewBox={currentViewBox}
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Matte Backdrop Grid */}
            <pattern id="cdGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161c28" strokeWidth="0.75" />
            </pattern>
            {/* Linear Gradients */}
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#080c14" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="emeraldStripe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="goldStripe" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="busBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#121722" />
              <stop offset="50%" stopColor="#161d2a" />
              <stop offset="100%" stopColor="#121722" />
            </linearGradient>
          </defs>

          {/* Deep Navy/Black Studio Canvas & Engineering Grid */}
          <rect width="1200" height="600" fill="url(#skyGrad)" />
          <rect width="1200" height="600" fill="url(#cdGrid)" opacity="0.4" />

          {/* Top Brand Telemetry Header Strip */}
          <rect x="35" y="22" width="1130" height="36" rx="8" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
          <circle cx="56" cy="40" r="4.5" fill="#10b981" />
          <text x="70" y="44" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#e2e8f0" letterSpacing="0.8">
            CIVICDUTY.SITE · OFFICIAL [{transitSpec.countryCode}] SOVEREIGN OUTDOOR &amp; TRANSIT CAMPAIGN
          </text>
          <text x="1145" y="44" textAnchor="end" fontFamily="monospace" fontWeight="800" fontSize="11" fill="#10b981">
            FREE USSD: {transitSpec.ussdCode}
          </text>

          {/* ============================================================== */}
          {/* VEHICLE 1: KAYOOLA EVS BUS KAMPALA STREET SCENE               */}
          {/* ============================================================== */}
          {effectiveVehicle === 'bus' && (
            <g>
              {/* Distant Urban Skyline (Kampala / Nairobi High-Rises & Towers) */}
              <g opacity="0.4">
                <rect x="80" y="220" width="65" height="280" fill="#1e293b" />
                <rect x="160" y="180" width="85" height="320" fill="#0f172a" />
                <rect x="260" y="240" width="55" height="260" fill="#1e293b" />
                <rect x="330" y="160" width="95" height="340" fill="#0f172a" />
                {/* Telecom Spire Antenna */}
                <line x1="377" y1="100" x2="377" y2="160" stroke="#475569" strokeWidth="2" />
                <circle cx="377" cy="100" r="3" fill="#ef4444" />
                <rect x="840" y="190" width="80" height="310" fill="#0f172a" />
                <rect x="940" y="230" width="70" height="270" fill="#1e293b" />
                <rect x="1030" y="170" width="110" height="330" fill="#0f172a" />
              </g>

              {/* Street Lighting Poles & Warm Halogen Glow */}
              {[120, 1080].map((lx) => (
                <g key={lx} opacity="0.85">
                  <line x1={lx} y1="150" x2={lx} y2="505" stroke="#475569" strokeWidth="3" />
                  <path d={`M ${lx} 150 Q ${lx + 20} 130 ${lx + 35} 140`} fill="none" stroke="#475569" strokeWidth="3" />
                  <ellipse cx={lx + 35} cy="142" rx="7" ry="3" fill="#fde047" />
                  <polygon points={`${lx + 20},144 ${lx + 50},144 ${lx + 80},505 ${lx - 10},505`} fill="#fde047" opacity="0.08" />
                </g>
              ))}

              {/* Asphalt Road Deck, Curb & Zebra Crossing Stripes */}
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#334155" strokeWidth="2.5" />
              {/* White Road Lane & Crosswalk Markings */}
              {[80, 130, 180, 230, 280, 950, 1000, 1050, 1100].map((cx) => (
                <rect key={cx} x={cx} y="514" width="32" height="12" fill="#ffffff" opacity="0.5" />
              ))}
              <line x1="40" y1="558" x2="1160" y2="558" stroke="#ffffff" strokeWidth="3" strokeDasharray="40 30" opacity="0.4" />

              {/* Bus Ground Shadow */}
              <ellipse cx="600" cy="508" rx="515" ry="14" fill="#000000" opacity="0.8" />

              {/* Roof-Mounted Electric Battery & HVAC Aerodynamic Pod */}
              <path
                d="M 210 132 L 950 132 C 975 132 990 144 998 158 L 185 158 C 192 144 198 132 210 132 Z"
                fill="#161a22"
                stroke="#334155"
                strokeWidth="2"
              />
              <rect x="260" y="139" width="145" height="13" rx="3" fill="#0e1116" stroke="#10b981" strokeWidth="1" />
              <text x="332" y="149" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="8.5" fill="#10b981">
                KAYOOLA ZERO-EMISSION BATTERY
              </text>
              <rect x="780" y="138" width="150" height="13" rx="3" fill="#0e1116" stroke="#262b36" strokeWidth="1" />
              <text x="855" y="148" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="8.5" fill="#94a3b8">
                KIIRA MOTORS CORPORATION
              </text>

              {/* Main Coach Body Shell in Sleek Matte Dark Studio Livery */}
              <path
                d="M 108 265 C 112 205 124 166 152 158 L 1068 158 C 1088 158 1098 170 1098 190 L 1098 446 C 1098 458 1088 466 1072 466 L 116 466 C 104 466 96 456 98 440 Z"
                fill="url(#busBodyGrad)"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* Continuous Panoramic Glazed Window Belt */}
              <path
                d="M 122 280 C 126 218 135 176 158 170 L 1075 170 C 1082 170 1086 175 1086 184 L 1086 286 L 122 286 Z"
                fill="#0b1320"
                stroke="#262b36"
                strokeWidth="2"
              />

              {/* Front Destination LED Matrix Board */}
              <rect x="148" y="174" width="170" height="25" rx="4" fill="#090c10" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="233" y="191" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="11" fill="#fde047" letterSpacing="1">
                KAMPALA ROAD · {transitSpec.ussdCode}
              </text>

              {/* Passenger Windows & Interior Silhouette */}
              {[335, 465, 595, 795, 925].map((wx, idx) => (
                <g key={idx}>
                  <rect x={wx} y="176" width="118" height="102" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                  <line x1={wx} y1="202" x2={wx + 118} y2="202" stroke="#1e293b" strokeWidth="1.5" />
                  <circle cx={wx + 34} cy="235" r="11" fill="#334155" />
                  <circle cx={wx + 80} cy="235" r="11" fill="#334155" />
                </g>
              ))}

              {/* Front Boarding Doors (Open with Interior Warm Light & Boarding Commuters) */}
              <g>
                <rect x="225" y="204" width="94" height="252" rx="6" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <line x1="272" y1="204" x2="272" y2="456" stroke="#475569" strokeWidth="2" />
                <rect x="233" y="214" width="32" height="155" rx="3" fill="#1e293b" />
                <rect x="279" y="214" width="32" height="155" rx="3" fill="#1e293b" />
                <line x1="238" y1="305" x2="265" y2="335" stroke="#f59e0b" strokeWidth="2.5" />
                <rect x="225" y="450" width="94" height="6" fill="#f59e0b" />
              </g>

              {/* Pedestrians & Commuters on Sidewalk Boarding */}
              <g opacity="0.9">
                {/* Commuter 1 Entering Bus */}
                <circle cx="210" cy="410" r="11" fill="#e2e8f0" />
                <path d="M 198 424 L 222 424 L 225 470 L 195 470 Z" fill="#1e293b" />
                {/* Commuter 2 Waiting on Sidewalk Holding Phone */}
                <circle cx="160" cy="425" r="10" fill="#e2e8f0" />
                <path d="M 150 438 L 170 438 L 172 485 L 148 485 Z" fill="#047857" />
                <rect x="171" y="440" width="5" height="9" rx="1" fill="#38bdf8" />
              </g>

              {/* ============================================================ */}
              {/* OFFICIAL CIVICDUTY 3-SIGNAL LIVERY WRAP ON BUS SIDES        */}
              {/* ============================================================ */}
              <rect x="322" y="286" width="396" height="4.5" fill="url(#emeraldStripe)" />
              <rect x="790" y="286" width="306" height="4.5" fill="url(#emeraldStripe)" />

              {/* Official 3-Signal Checkmark Logo */}
              {renderOfficialLogoSvg(334, 304, 0.72)}

              {/* Brand Wordmark & Tagline */}
              <text x="518" y="338" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="34" fill="#ffffff">
                CivicDuty
              </text>
              <text x="520" y="357" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#10b981" letterSpacing="1.8">
                SPEAK · SERVE · BE HEARD
              </text>
              <text x="520" y="374" fontFamily="monospace" fontWeight="600" fontSize="10.5" fill="#94a3b8">
                Report Potholes, Water Outages &amp; Street Defects
              </text>

              {/* Route & Fleet Tag Strip */}
              <rect x="334" y="390" width="372" height="32" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
              <text x="348" y="410" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#fde047">
                FLEET PARTNERSHIP · {transitSpec.busPartnerName.toUpperCase().slice(0, 26)}
              </text>

              {/* Rear USSD Callout Badge on Bus */}
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

              {/* Radial Bus Wheels & Rim Detailing */}
              {[385, 925].map((cx, idx) => (
                <g key={idx}>
                  <path d={`M ${cx - 64} 466 A 64 64 0 0 1 ${cx + 64} 466 Z`} fill="#090b0f" stroke="#334155" strokeWidth="2.5" />
                  <circle cx={cx} cy="466" r="52" fill="#111318" stroke="#262b36" strokeWidth="4" />
                  <circle cx={cx} cy="466" r="39" fill="#1e2430" stroke="#475569" strokeWidth="2" />
                  <circle cx={cx} cy="466" r="27" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
                  <circle cx={cx} cy="466" r="12" fill="#1e293b" />
                </g>
              ))}
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 2: COMMUTER TRAIN MOVING BILLBOARD LEVEL CROSSING     */}
          {/* ============================================================== */}
          {effectiveVehicle === 'train' && (
            <g>
              {/* Level Crossing Station Platform & Skyline Background */}
              <g opacity="0.45">
                <rect x="60" y="220" width="80" height="280" fill="#0f172a" />
                <rect x="180" y="170" width="110" height="330" fill="#1e293b" />
                <rect x="750" y="190" width="90" height="310" fill="#0f172a" />
                <rect x="880" y="240" width="60" height="260" fill="#1e293b" />
                <rect x="980" y="160" width="120" height="340" fill="#0f172a" />
              </g>

              {/* Station Canopy & Platform Signboard */}
              <rect x="720" y="130" width="280" height="26" rx="4" fill="#161a22" stroke="#10b981" strokeWidth="1.5" />
              <text x="860" y="147" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="11" fill="#10b981" letterSpacing="1">
                KAMPALA–NAMANVE COMMUTER RAIL PLATFORM
              </text>

              {/* Railway Ballast Bed & Steel Tracks */}
              <rect x="0" y="488" width="1200" height="112" fill="#090b0f" />
              <rect x="0" y="486" width="1200" height="8" fill="#64748b" />
              <rect x="0" y="494" width="1200" height="6" fill="#334155" />
              {Array.from({ length: 28 }).map((_, idx) => (
                <rect key={idx} x={20 + idx * 42} y="496" width="22" height="10" rx="2" fill="#1e293b" />
              ))}

              {/* Level Crossing Warning Signal Mast & Flashing Red Beacons */}
              <g>
                <line x1="42" y1="210" x2="42" y2="488" stroke="#94a3b8" strokeWidth="5" />
                {/* Red/White Diagonal Crossbuck Sign */}
                <line x1="22" y1="230" x2="62" y2="250" stroke="#ef4444" strokeWidth="4" />
                <line x1="22" y1="250" x2="62" y2="230" stroke="#ef4444" strokeWidth="4" />
                {/* Dual Alternating Red Crossing Flashers */}
                <circle cx="28" cy="270" r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="56" cy="270" r="10" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                {/* Striped Level Crossing Barrier Gate Arm */}
                <line x1="42" y1="360" x2="380" y2="360" stroke="#fde047" strokeWidth="6" strokeDasharray="24 16" />
              </g>

              {/* 1. DIESEL-ELECTRIC LOCOMOTIVE HEAD */}
              <g>
                <path d="M 68 442 L 68 310 L 118 298 L 146 202 L 415 202 L 415 442 Z" fill="#161a22" stroke="#475569" strokeWidth="3" />
                <polygon points="52,456 88,456 88,425 68,425" fill="#f59e0b" stroke="#0e1116" strokeWidth="2" />
                <rect x="64" y="330" width="12" height="24" rx="3" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
                <polygon points="124,292 148,215 178,215 178,292" fill="#0b1320" stroke="#475569" strokeWidth="2" />
                <rect x="188" y="216" width="54" height="58" rx="4" fill="#0b1320" stroke="#475569" strokeWidth="2" />
                <rect x="262" y="224" width="132" height="66" rx="4" fill="#0e1116" stroke="#334155" strokeWidth="1.5" />
                <rect x="68" y="362" width="347" height="14" fill="#10b981" />
                <rect x="68" y="376" width="347" height="6" fill="#f59e0b" />
                <rect x="150" y="305" width="240" height="44" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="164" y="325" fontFamily="monospace" fontWeight="800" fontSize="12" fill="#ffffff">
                  {transitSpec.trainOperatorName.toUpperCase().slice(0, 24)}
                </text>
                <text x="164" y="341" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#10b981">
                  LOCO #904 · MOVING BILLBOARD
                </text>
                {/* Wheels */}
                {[155, 245, 335].map((wx) => (
                  <circle key={wx} cx={wx} cy="466" r="22" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
                ))}
              </g>

              {/* 2. PASSENGER CARRIAGE WRAPPED IN CIVICDUTY MOVING BILLBOARD LIVERY */}
              <g>
                <rect x="436" y="204" width="706" height="238" rx="6" fill="#161a22" stroke="#10b981" strokeWidth="2.5" />
                {/* Windows with Commuters */}
                {[496, 578, 660, 742, 824, 906, 988].map((wx, idx) => (
                  <g key={idx}>
                    <rect x={wx} y="218" width="66" height="52" rx="5" fill="#0b1320" stroke="#334155" strokeWidth="2" />
                    <circle cx={wx + 33} cy="245" r="9" fill="#334155" />
                  </g>
                ))}
                {/* Livery Stripe & Logo */}
                <rect x="494" y="282" width="564" height="4.5" fill="url(#emeraldStripe)" />
                {renderOfficialLogoSvg(496, 298, 0.72)}
                <text x="680" y="330" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="32" fill="#ffffff">
                  CivicDuty
                </text>
                <text x="682" y="350" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#10b981" letterSpacing="1.5">
                  SPEAK · SERVE · BE HEARD
                </text>
                <text x="682" y="368" fontFamily="monospace" fontWeight="600" fontSize="10.5" fill="#cbd5e1">
                  MOVING BILLBOARD · RAIL REFURBISHMENT PROPOSAL
                </text>
                {/* USSD Box */}
                <rect x="865" y="298" width="192" height="76" rx="8" fill="#0e1116" stroke="#10b981" strokeWidth="1.75" />
                <text x="880" y="319" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill="#fde047">
                  REPORT DEFECTS FREE
                </text>
                <text x="880" y="346" fontFamily="monospace" fontWeight="900" fontSize="22" fill="#ffffff">
                  DIAL {transitSpec.ussdCode}
                </text>
                <text x="880" y="364" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#10b981">
                  CIVICDUTY.SITE · PWA
                </text>
                {/* Corridor */}
                <rect x="496" y="388" width="562" height="34" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="512" y="409" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#94a3b8">
                  CORRIDOR: {transitSpec.trainCorridors.toUpperCase().slice(0, 60)}
                </text>
                {/* Wheels */}
                {[494, 566, 969, 1041].map((bx) => (
                  <circle key={bx} cx={bx} cy="466" r="21" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
                ))}
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 3: BODABODA STAGE SCOUT OUTDOOR BILLBOARD SCENE        */}
          {/* ============================================================== */}
          {effectiveVehicle === 'bodaboda' && (
            <g>
              {/* Ground Asphalt, Stage Earth & Curb */}
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#262b36" strokeWidth="2" />
              <line x1="30" y1="550" x2="550" y2="550" stroke="#f59e0b" strokeWidth="2" strokeDasharray="25 15" opacity="0.4" />

              {/* Distant Trees & Roadway Lighting */}
              <g opacity="0.35">
                <circle cx="110" cy="240" r="45" fill="#064e3b" />
                <circle cx="160" cy="225" r="55" fill="#065f46" />
                <circle cx="230" cy="245" r="40" fill="#064e3b" />
                <line x1="160" y1="280" x2="160" y2="505" stroke="#1e293b" strokeWidth="8" />
              </g>

              {/* 1. Bodaboda Stage Signpost & Stage Shelter */}
              <g>
                <line x1="58" y1="180" x2="58" y2="505" stroke="#475569" strokeWidth="4" />
                <rect x="30" y="160" width="210" height="48" rx="6" fill="#0e1116" stroke="#f59e0b" strokeWidth="2" />
                <text x="135" y="180" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="10.5" fill="#fde047" letterSpacing="0.8">
                  STAGE: NORTHERN BYPASS
                </text>
                <text x="135" y="196" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="9" fill="#10b981">
                  BWAISE RIDERS · SCOUT #049
                </text>
                {/* Stage Wooden Bench */}
                <rect x="35" y="445" width="115" height="10" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                <line x1="45" y1="455" x2="45" y2="505" stroke="#475569" strokeWidth="3" />
                <line x1="140" y1="455" x2="140" y2="505" stroke="#475569" strokeWidth="3" />
              </g>

              {/* 2. Secondary Parked Bodaboda in Distance */}
              <g transform="translate(65, 45)" opacity="0.65">
                <circle cx="115" cy="425" r="38" fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle cx="245" cy="425" r="38" fill="none" stroke="#1e293b" strokeWidth="8" />
                <path d="M 155 375 L 205 375 L 195 425 Z" fill="#1e293b" />
              </g>

              {/* 3. Primary Bodaman on Bajaj Boxer Motorcycle with Frontline Scout Vest */}
              <g transform="translate(35, 12)">
                <ellipse cx="330" cy="495" rx="200" ry="12" fill="#000000" opacity="0.75" />
                {/* Spoked Wheels & Heavy Rubber Tires */}
                <circle cx="185" cy="425" r="64" fill="none" stroke="#090c10" strokeWidth="18" />
                <circle cx="185" cy="425" r="54" fill="none" stroke="#64748b" strokeWidth="2.5" />
                <circle cx="185" cy="425" r="14" fill="#94a3b8" />
                {/* Spokes */}
                {[0, 45, 90, 135].map((deg) => (
                  <line
                    key={deg}
                    x1="185"
                    y1="425"
                    x2={185 + 50 * Math.cos((deg * Math.PI) / 180)}
                    y2={425 + 50 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                ))}

                <circle cx="475" cy="425" r="64" fill="none" stroke="#090c10" strokeWidth="18" />
                <circle cx="475" cy="425" r="54" fill="none" stroke="#64748b" strokeWidth="2.5" />
                <circle cx="475" cy="425" r="14" fill="#94a3b8" />
                {[0, 45, 90, 135].map((deg) => (
                  <line
                    key={deg}
                    x1="475"
                    y1="425"
                    x2={475 + 50 * Math.cos((deg * Math.PI) / 180)}
                    y2={425 + 50 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Chrome Exhaust & Engine Cooling Block */}
                <rect x="250" y="415" width="180" height="14" rx="7" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                <rect x="300" y="375" width="55" height="42" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <line x1="305" y1="385" x2="350" y2="385" stroke="#64748b" strokeWidth="1.5" />
                <line x1="305" y1="395" x2="350" y2="395" stroke="#64748b" strokeWidth="1.5" />
                <line x1="305" y1="405" x2="350" y2="405" stroke="#64748b" strokeWidth="1.5" />

                {/* Front Chrome Suspension Forks & Mudguard */}
                <path d="M 412 390 A 70 70 0 0 1 520 380" fill="none" stroke="#10b981" strokeWidth="9" />
                <line x1="475" y1="425" x2="410" y2="245" stroke="#e2e8f0" strokeWidth="10" />
                {/* Round Chrome Headlamp Glowing Forward */}
                <circle cx="488" cy="275" r="14" fill="#fef08a" stroke="#f59e0b" strokeWidth="3" />
                <polygon points="502,275 620,230 620,320" fill="#fef08a" opacity="0.12" />

                {/* Metallic Emerald Fuel Tank Branded with CivicDuty */}
                <path
                  d="M 292 334 C 298 288 344 278 408 292 L 396 346 L 292 346 Z"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                <text x="316" y="322" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="13" fill="#ffffff">
                  CivicDuty
                </text>
                <text x="316" y="337" fontFamily="monospace" fontWeight="800" fontSize="9.5" fill="#fde047">
                  FRONTLINE SCOUT
                </text>

                {/* Bodaboda Rider in Helmet & Neon Emerald Reflector Vest */}
                <circle cx="320" cy="155" r="28" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                {/* Helmet Visor Shield */}
                <path d="M 334 146 Q 348 156 338 168 Z" fill="#0b1320" />
                {/* Torso & High-Vis Vest */}
                <path d="M 275 186 L 345 186 L 354 300 L 268 300 Z" fill="#10b981" stroke="#064e3b" strokeWidth="2.5" />
                {/* Dual Silver Reflective Stripes */}
                <rect x="272" y="235" width="80" height="9" fill="#fde047" />
                <rect x="270" y="260" width="84" height="9" fill="#fde047" />
                {/* 3-Signal Checkmark Badge on Chest */}
                <circle cx="310" cy="208" r="14" fill="#0e1116" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="304" cy="208" r="2.5" fill="#ef4444" />
                <circle cx="310" cy="208" r="2.5" fill="#f59e0b" />
                <circle cx="316" cy="208" r="2.5" fill="#10b981" />
                <text x="310" y="228" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="9" fill="#ffffff">
                  {transitSpec.ussdCode}
                </text>

                {/* Rider Arms Holding Handlebar & Smartphone */}
                <line x1="335" y1="200" x2="390" y2="242" stroke="#1e293b" strokeWidth="14" />
                {/* Smartphone with Free USSD Glow */}
                <rect x="382" y="232" width="16" height="26" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <rect x="384" y="235" width="12" height="18" fill="#38bdf8" />
              </g>

              {/* 4. Massive Overhead Roadside Billboard in Background */}
              <g>
                {/* Heavy Steel Foundation Pillars & Lattice */}
                <rect x="585" y="115" width="14" height="390" fill="#334155" />
                <rect x="1135" y="115" width="14" height="390" fill="#334155" />
                {/* Structural Cross-Bracing */}
                <line x1="592" y1="200" x2="1142" y2="400" stroke="#1e293b" strokeWidth="3" opacity="0.4" />
                <line x1="592" y1="400" x2="1142" y2="200" stroke="#1e293b" strokeWidth="3" opacity="0.4" />

                {/* Overhead Floodlights Pointing at Billboard */}
                {[640, 860, 1080].map((fx) => (
                  <g key={fx}>
                    <line x1={fx} y1="92" x2={fx} y2="120" stroke="#64748b" strokeWidth="3" />
                    <rect x={fx - 12} y="82" width="24" height="12" rx="3" fill="#1e293b" stroke="#fde047" strokeWidth="1.5" />
                    <polygon points={`${fx - 12},94 ${fx + 12},94 ${fx + 60},160 ${fx - 60},160`} fill="#fde047" opacity="0.08" />
                  </g>
                ))}

                {/* Billboard Main Board Shell */}
                <polygon points="560,122 1160,122 1140,96 580,96" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
                <rect x="610" y="130" width="515" height="348" rx="14" fill="#161a22" stroke="#262b36" strokeWidth="3" />

                {/* Top Billboard Badge & Current 3-Signal Checkmark Logo */}
                <rect x="628" y="146" width="480" height="32" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="644" y="166" fontFamily="monospace" fontWeight="800" fontSize="10.5" fill="#fde047">
                  FRONTLINE ROAD SCOUT BILLBOARD · STAGE MOBILIZATION
                </text>
                {renderOfficialLogoSvg(632, 192, 0.82)}

                {/* Monthly Bounty Pool Indicator */}
                <rect x="850" y="194" width="258" height="64" rx="8" fill="#0e1116" stroke="#10b981" strokeWidth="1.75" />
                <text x="866" y="216" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#94a3b8">
                  STAGE BOUNTY ESCROW
                </text>
                <text x="866" y="240" fontFamily="monospace" fontWeight="900" fontSize="15" fill="#10b981">
                  TOP 3 RIDERS REWARDED
                </text>

                {/* Headline & Slogan */}
                <text x="632" y="296" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="28" fill="#ffffff">
                  {transitSpec.localSlogan.split('·')[0]}
                </text>
                <text x="632" y="320" fontFamily="monospace" fontWeight="700" fontSize="12" fill="#fde047">
                  SEE A POTHOLE OR DRAIN? REPORT IN 30 SECONDS!
                </text>

                {/* Actionable Steps Box */}
                <rect x="632" y="334" width="472" height="78" rx="8" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="648" y="355" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#e2e8f0">
                  1. DIAL {transitSpec.ussdCode} FREE (ZERO DATA · WORKS ON ALL PHONES)
                </text>
                <text x="648" y="375" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#10b981">
                  2. PUBLIC SLA CLOCK STARTS ON MUNICIPAL AUTHORITIES
                </text>
                <text x="648" y="395" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#fde047">
                  3. TOP 3 RIDERS IN EACH STAGE RECEIVE MONTHLY FUEL &amp; DATA
                </text>

                {/* Call-to-Action Bar */}
                <rect x="632" y="420" width="472" height="44" rx="8" fill="#059669" />
                <text x="868" y="448" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="17.5" fill="#ffffff">
                  DIAL {transitSpec.ussdCode} FREE · CIVICDUTY.SITE
                </text>
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 4: MARKET VENDORS & TRADERS OVERHEAD BILLBOARD         */}
          {/* ============================================================== */}
          {effectiveVehicle === 'market' && (
            <g>
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#262b36" strokeWidth="2" />

              {/* 1. Market Stall & Giant Colorful Umbrellas */}
              <g transform="translate(30, 8)">
                {/* Stall Signboard */}
                <rect x="60" y="165" width="220" height="42" rx="6" fill="#0e1116" stroke="#10b981" strokeWidth="2" />
                <text x="170" y="185" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="10.5" fill="#fde047">
                  NAKASERO &amp; OWINO MARKET
                </text>
                <text x="170" y="198" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="9" fill="#10b981">
                  STALL #14 · FRESH PRODUCE SCOUT
                </text>

                {/* Giant Striped Market Umbrellas with Scalloped Edges */}
                <path d="M 50 248 Q 185 142 320 248 Z" fill="#059669" stroke="#10b981" strokeWidth="3" />
                <path d="M 100 248 Q 185 160 270 248 Z" fill="#fde047" opacity="0.85" />
                <line x1="185" y1="248" x2="185" y2="400" stroke="#475569" strokeWidth="6" />

                <path d="M 310 255 Q 430 162 550 255 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
                <line x1="430" y1="255" x2="430" y2="400" stroke="#475569" strokeWidth="6" />

                {/* Hanging Mechanical Produce Scale */}
                <g transform="translate(285, 230)">
                  <line x1="0" y1="0" x2="0" y2="50" stroke="#cbd5e1" strokeWidth="2" />
                  <circle cx="0" cy="50" r="14" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                  <line x1="0" y1="50" x2="6" y2="45" stroke="#ef4444" strokeWidth="2" />
                  <path d="M -16 85 Q 0 95 16 85 Z" fill="#64748b" />
                  <line x1="-16" y1="85" x2="0" y2="64" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="16" y1="85" x2="0" y2="64" stroke="#cbd5e1" strokeWidth="1" />
                </g>

                {/* Market Vendor Woman in Apron holding phone */}
                <circle cx="185" cy="305" r="22" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                <path d="M 148 332 L 222 332 L 230 425 L 140 425 Z" fill="#064e3b" stroke="#10b981" strokeWidth="2.5" />
                {/* Yellow Market Scout Apron */}
                <rect x="162" y="342" width="46" height="64" rx="4" fill="#fde047" />
                <text x="185" y="375" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="9" fill="#090d14">
                  MARKET
                </text>
                <text x="185" y="388" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="8" fill="#064e3b">
                  SCOUT
                </text>
                {/* Phone in Hand */}
                <rect x="226" y="348" width="12" height="20" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <rect x="228" y="350" width="8" height="14" fill="#38bdf8" />

                {/* Wooden Display Table with Fresh Produce Baskets */}
                <rect x="42" y="415" width="490" height="85" rx="8" fill="#161a22" stroke="#475569" strokeWidth="2.5" />
                <line x1="42" y1="440" x2="532" y2="440" stroke="#334155" strokeWidth="1.5" />
                {/* Matooke Green Plantains Heap */}
                <rect x="58" y="385" width="105" height="28" rx="6" fill="#15803d" stroke="#166534" strokeWidth="2" />
                <text x="110" y="403" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="9" fill="#ffffff">
                  MATOOKE
                </text>
                {/* Red Tomatoes Crate */}
                <rect x="175" y="385" width="105" height="28" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
                <text x="227" y="403" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="9" fill="#ffffff">
                  TOMATOES
                </text>
                {/* Yellow Mangoes Crate */}
                <rect x="292" y="385" width="105" height="28" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                <text x="344" y="403" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="9" fill="#ffffff">
                  MANGOES
                </text>
                {/* Fresh Vegetables Crate */}
                <rect x="408" y="385" width="112" height="28" rx="6" fill="#059669" stroke="#047857" strokeWidth="2" />
                <text x="464" y="403" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="9" fill="#ffffff">
                  VEGETABLES
                </text>
              </g>

              {/* 2. Elevated Commercial Gantry Billboard Spanning Over Market */}
              <g>
                <rect x="635" y="455" width="18" height="50" fill="#475569" />
                <rect x="1075" y="455" width="18" height="50" fill="#475569" />
                <rect x="585" y="112" width="560" height="355" rx="14" fill="#161a22" stroke="#10b981" strokeWidth="3" />
                <rect x="605" y="130" width="520" height="32" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="622" y="150" fontFamily="monospace" fontWeight="800" fontSize="11" fill="#fde047">
                  MARKET SQUARE OVERHEAD BILLBOARD · URBAN COMMERCE
                </text>
                {renderOfficialLogoSvg(610, 175, 0.82)}

                <rect x="830" y="178" width="295" height="64" rx="8" fill="#0e1116" stroke="#f59e0b" strokeWidth="1.75" />
                <text x="846" y="200" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#fde047">
                  MARKET VENDOR BOUNTY VAULT
                </text>
                <text x="846" y="224" fontFamily="monospace" fontWeight="900" fontSize="15" fill="#ffffff">
                  TOP 3 VENDORS WIN BOUNTIES
                </text>

                <text x="610" y="278" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="27" fill="#ffffff">
                  Market Vendors: Protect Your Market!
                </text>
                <text x="610" y="302" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#10b981">
                  REPORT UNCOLLECTED GARBAGE, BLOCKED DRAINS &amp; WATER OUTAGES
                </text>

                <rect x="610" y="318" width="510" height="78" rx="8" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="626" y="339" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#e2e8f0">
                  ✓ REPORT MARKET SANITATION &amp; DRAINAGE DEFECTS IN 30 SECONDS
                </text>
                <text x="626" y="359" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#10b981">
                  ✓ EARN CITIZEN XP + MONTHLY GROCERY &amp; POWER PACK BOUNTIES
                </text>
                <text x="626" y="379" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#fde047">
                  ✓ ZERO DATA REQUIRED · 100% FREE USSD {transitSpec.ussdCode} ON ALL PHONES
                </text>

                <rect x="610" y="405" width="510" height="44" rx="8" fill="#059669" />
                <text x="865" y="433" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="17.5" fill="#ffffff">
                  FREE USSD: {transitSpec.ussdCode} · CIVICDUTY.SITE
                </text>
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 5: MATATU & TAXI PARK COMMUTER GANTRY BILLBOARD        */}
          {/* ============================================================== */}
          {effectiveVehicle === 'taxi' && (
            <g>
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#262b36" strokeWidth="2" />
              {/* 14-Seater Kamunye / Matatu Van Profile on Left */}
              <g transform="translate(40, 20)">
                <ellipse cx="260" cy="485" rx="210" ry="12" fill="#000000" opacity="0.75" />
                {/* White Van Body with Yellow Matatu Speed Stripe */}
                <path d="M 80 435 L 80 280 L 120 260 L 170 230 L 440 230 L 460 300 L 460 435 Z" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
                {/* Yellow Speed Stripe */}
                <rect x="80" y="375" width="380" height="22" fill="#f59e0b" />
                <text x="270" y="391" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="12" fill="#0f172a">
                  COMMUTER TRANSIT SCOUT · {transitSpec.ussdCode}
                </text>
                {/* Windows with Passengers */}
                {[135, 215, 295, 375].map((wx) => (
                  <rect key={wx} x={wx} y="255" width="65" height="75" rx="4" fill="#0b1320" stroke="#475569" strokeWidth="2" />
                ))}
                {/* Driver holding phone */}
                <circle cx="160" cy="285" r="14" fill="#1e293b" />
                <rect x="180" y="275" width="6" height="11" rx="1" fill="#38bdf8" />
                {/* Wheels */}
                {[165, 395].map((wx) => (
                  <g key={wx}>
                    <circle cx={wx} cy="435" r="44" fill="#111318" stroke="#334155" strokeWidth="5" />
                    <circle cx={wx} cy="435" r="22" fill="#94a3b8" />
                  </g>
                ))}
              </g>

              {/* Taxi Park Gantry Billboard on Right */}
              <g>
                <rect x="585" y="115" width="565" height="350" rx="14" fill="#161a22" stroke="#f59e0b" strokeWidth="3" />
                <rect x="605" y="132" width="525" height="32" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="620" y="153" fontFamily="monospace" fontWeight="800" fontSize="11" fill="#fde047">
                  TERMINAL GANTRY BILLBOARD · COMMERCIAL TRANSIT CAMPAIGN
                </text>
                {renderOfficialLogoSvg(608, 178, 0.82)}
                <rect x="825" y="180" width="295" height="64" rx="8" fill="#0e1116" stroke="#10b981" strokeWidth="1.75" />
                <text x="840" y="202" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#94a3b8">
                  HIGHWAY WATCHDOG VAULT
                </text>
                <text x="840" y="226" fontFamily="monospace" fontWeight="900" fontSize="15" fill="#10b981">
                  TOP-3 DRIVERS WIN FUEL
                </text>
                <text x="608" y="278" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="27" fill="#ffffff">
                  Matatu &amp; Taxi Drivers: Highway Watchdogs!
                </text>
                <text x="608" y="302" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#fde047">
                  REPORT HIGHWAY WASHOUTS, EXTORTION &amp; DEADLY ACCIDENT BLACKSPOTS
                </text>
                <rect x="608" y="318" width="520" height="74" rx="8" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="624" y="339" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#e2e8f0">
                  ✓ REPORT CORRIDOR HAZARDS IN 30 SECONDS · INSTANT GEOTAG
                </text>
                <text x="624" y="359" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#10b981">
                  ✓ AUTOMATIC MONTHLY FUEL &amp; AIRTIME BOUNTIES FOR TOP 3
                </text>
                <text x="624" y="379" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#fde047">
                  ✓ DIAL {transitSpec.ussdCode} TOLL-FREE ON ANY PHONE NETWORK
                </text>
                <rect x="608" y="404" width="520" height="42" rx="8" fill="#d97706" />
                <text x="868" y="430" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="17" fill="#ffffff">
                  TOLL-FREE USSD: {transitSpec.ussdCode} · CIVICDUTY.SITE
                </text>
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 6: HEALTHCARE WORKERS & COMMUNITY CLINIC BOARD         */}
          {/* ============================================================== */}
          {effectiveVehicle === 'health' && (
            <g>
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#262b36" strokeWidth="2" />
              {/* Community Health Clinic IV Entrance on Left */}
              <g transform="translate(45, 15)">
                <rect x="40" y="210" width="450" height="295" fill="#161f2e" stroke="#38bdf8" strokeWidth="2.5" rx="8" />
                <rect x="180" y="170" width="170" height="42" rx="6" fill="#0e1726" stroke="#38bdf8" strokeWidth="2" />
                <text x="265" y="196" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="12" fill="#38bdf8">
                  + HEALTH CENTRE IV +
                </text>
                {/* Clinic Glass Doors */}
                <rect x="185" y="325" width="160" height="180" fill="#0b1320" stroke="#64748b" strokeWidth="2" />
                {/* Clinical Officer in White Coat with Stethoscope */}
                <circle cx="120" cy="350" r="18" fill="#e2e8f0" />
                <path d="M 95 375 L 145 375 L 148 460 L 92 460 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                <path d="M 110 375 Q 120 410 130 375" fill="none" stroke="#ef4444" strokeWidth="3" />
                {/* Nurse in Medical Teal Scrub */}
                <circle cx="390" cy="355" r="17" fill="#e2e8f0" />
                <path d="M 368 380 L 412 380 L 415 460 L 365 460 Z" fill="#0d9488" />
              </g>

              {/* Clinic Accountability Billboard on Right */}
              <g>
                <rect x="585" y="115" width="565" height="350" rx="14" fill="#161a22" stroke="#38bdf8" strokeWidth="3" />
                <rect x="605" y="132" width="525" height="32" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="620" y="153" fontFamily="monospace" fontWeight="800" fontSize="11" fill="#38bdf8">
                  OUTPATIENT GATE ACCOUNTABILITY BOARD · PUBLIC HEALTH MONITORS
                </text>
                {renderOfficialLogoSvg(608, 178, 0.82)}
                <rect x="825" y="180" width="295" height="64" rx="8" fill="#0e1116" stroke="#10b981" strokeWidth="1.75" />
                <text x="840" y="202" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#94a3b8">
                  HEALTH MONITOR VAULT
                </text>
                <text x="840" y="226" fontFamily="monospace" fontWeight="900" fontSize="15" fill="#10b981">
                  TOP-3 MONITORS REWARDED
                </text>
                <text x="608" y="278" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="26" fill="#ffffff">
                  Healthcare Workers: Defend Your Clinic!
                </text>
                <text x="608" y="302" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#38bdf8">
                  TRACK ESSENTIAL DRUG STOCKOUTS, TRIAGE POWER &amp; MATERNITY OXYGEN
                </text>
                <rect x="608" y="318" width="520" height="74" rx="8" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="624" y="339" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#e2e8f0">
                  ✓ VERIFY VACCINE COLD-CHAIN &amp; DRUG SUPPLY IN 30 SECONDS
                </text>
                <text x="624" y="359" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#10b981">
                  ✓ TOP HEALTH MONITORS RECEIVE CLINICAL WELLNESS &amp; DATA BOUNTIES
                </text>
                <text x="624" y="379" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#38bdf8">
                  ✓ FREE TOLL-FREE USSD {transitSpec.ussdCode} OPERATIONAL ON ALL PHONES
                </text>
                <rect x="608" y="404" width="520" height="42" rx="8" fill="#0284c7" />
                <text x="868" y="430" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="17" fill="#ffffff">
                  HEALTH TOLL-FREE: {transitSpec.ussdCode} · CIVICDUTY.SITE
                </text>
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 7: TEACHERS & YOUTH LEADERS SAFE SCHOOL ZONE POSTER    */}
          {/* ============================================================== */}
          {effectiveVehicle === 'teacher' && (
            <g>
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#262b36" strokeWidth="2" />
              {/* School Gate & Youth Leaders on Left */}
              <g transform="translate(45, 15)">
                <rect x="30" y="210" width="460" height="295" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" rx="8" />
                <rect x="150" y="170" width="220" height="42" rx="6" fill="#0e1116" stroke="#818cf8" strokeWidth="2" />
                <text x="260" y="196" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="12" fill="#a5b4fc">
                  COMMUNITY SCHOOL GATE
                </text>
                {/* Yellow School Bus in Distance */}
                <rect x="60" y="380" width="180" height="110" rx="6" fill="#facc15" stroke="#713f12" strokeWidth="2" />
                <rect x="70" y="395" width="45" height="30" fill="#0b1320" />
                <rect x="125" y="395" width="45" height="30" fill="#0b1320" />
                {/* Teacher in Professional Attire holding Notebook */}
                <circle cx="340" cy="335" r="18" fill="#e2e8f0" />
                <path d="M 315 360 L 365 360 L 368 460 L 312 460 Z" fill="#4338ca" />
                <rect x="350" y="375" width="16" height="24" rx="2" fill="#ffffff" />
                {/* Youth Leader Rep */}
                <circle cx="410" cy="355" r="16" fill="#e2e8f0" />
                <path d="M 390 380 L 430 380 L 432 460 L 388 460 Z" fill="#059669" />
              </g>

              {/* Education Watch Billboard on Right */}
              <g>
                <rect x="585" y="115" width="565" height="350" rx="14" fill="#161a22" stroke="#818cf8" strokeWidth="3" />
                <rect x="605" y="132" width="525" height="32" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="620" y="153" fontFamily="monospace" fontWeight="800" fontSize="11" fill="#a5b4fc">
                  SCHOOL ZONE BULLETIN · TEACHER &amp; YOUTH SCOUT CAMPAIGN
                </text>
                {renderOfficialLogoSvg(608, 178, 0.82)}
                <rect x="825" y="180" width="295" height="64" rx="8" fill="#0e1116" stroke="#10b981" strokeWidth="1.75" />
                <text x="840" y="202" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#94a3b8">
                  YOUTH EDUCATION VAULT
                </text>
                <text x="840" y="226" fontFamily="monospace" fontWeight="900" fontSize="15" fill="#10b981">
                  TOP-3 SCOUTS WIN DATA
                </text>
                <text x="608" y="278" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="27" fill="#ffffff">
                  Teachers &amp; Youth: Safe School Zones!
                </text>
                <text x="608" y="302" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#a5b4fc">
                  REPORT BROKEN CLASSROOMS, CROSSING HAZARDS &amp; DANGEROUS DRAINAGE
                </text>
                <rect x="608" y="318" width="520" height="74" rx="8" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="624" y="339" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#e2e8f0">
                  ✓ DOCUMENT CRACKED WALLS &amp; ZEBRA CROSSING SAFETY DEFECTS
                </text>
                <text x="624" y="359" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#10b981">
                  ✓ TOP YOUTH SCOUTS EARN CONNECTIVITY BUNDLES &amp; BOOK VOUCHERS
                </text>
                <text x="624" y="379" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#a5b4fc">
                  ✓ ZERO-DATA ACCESS ON EVERY MOBILE NETWORK VIA {transitSpec.ussdCode}
                </text>
                <rect x="608" y="404" width="520" height="42" rx="8" fill="#4f46e5" />
                <text x="868" y="430" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="17" fill="#ffffff">
                  FREE EDUCATION USSD: {transitSpec.ussdCode} · CIVICDUTY.SITE
                </text>
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* VEHICLE 8: ARTISANS & BUILDERS PUBLIC WORKS SIGNBOARD          */}
          {/* ============================================================== */}
          {effectiveVehicle === 'artisan' && (
            <g>
              <rect x="0" y="505" width="1200" height="95" fill="#090b0f" />
              <line x1="0" y1="505" x2="1200" y2="505" stroke="#262b36" strokeWidth="2" />
              {/* Construction Site & Civil Artisan on Left */}
              <g transform="translate(45, 15)">
                {/* Heavy Concrete Culvert Pipes */}
                <ellipse cx="140" cy="420" rx="55" ry="55" fill="#64748b" stroke="#334155" strokeWidth="6" />
                <ellipse cx="140" cy="420" rx="35" ry="35" fill="#0f172a" />
                <ellipse cx="230" cy="420" rx="55" ry="55" fill="#475569" stroke="#334155" strokeWidth="6" />
                <ellipse cx="230" cy="420" rx="35" ry="35" fill="#0f172a" />
                {/* Gravel Mound */}
                <path d="M 280 475 Q 360 380 440 475 Z" fill="#334155" stroke="#475569" strokeWidth="2" />
                {/* Civil Artisan / Mason in Hard Hat & High-Vis Vest */}
                <circle cx="380" cy="325" r="18" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                <path d="M 355 350 L 405 350 L 408 450 L 352 450 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
                <rect x="350" y="380" width="55" height="12" fill="#fde047" />
                {/* Measuring Tape & Clipboard */}
                <rect x="390" y="375" width="18" height="24" rx="2" fill="#ffffff" />
              </g>

              {/* Public Works Watchdog Signboard on Right */}
              <g>
                <rect x="585" y="115" width="565" height="350" rx="14" fill="#161a22" stroke="#ea580c" strokeWidth="3" />
                <rect x="605" y="132" width="525" height="32" rx="6" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="620" y="153" fontFamily="monospace" fontWeight="800" fontSize="11" fill="#fdba74">
                  PUBLIC WORKS WORKSITE SIGNBOARD · THIRD-PARTY ARTISAN AUDIT
                </text>
                {renderOfficialLogoSvg(608, 178, 0.82)}
                <rect x="825" y="180" width="295" height="64" rx="8" fill="#0e1116" stroke="#10b981" strokeWidth="1.75" />
                <text x="840" y="202" fontFamily="monospace" fontWeight="700" fontSize="10" fill="#94a3b8">
                  CONTRACTOR WATCHDOG VAULT
                </text>
                <text x="840" y="226" fontFamily="monospace" fontWeight="900" fontSize="15" fill="#10b981">
                  TOP-3 ARTISANS WIN TOOLS
                </text>
                <text x="608" y="278" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="26" fill="#ffffff">
                  Artisans &amp; Builders: Watchdog Public Works!
                </text>
                <text x="608" y="302" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill="#fdba74">
                  AUDIT ASPHALT THICKNESS, CONCRETE MIX RATIOS &amp; DELAYED BRIDGES
                </text>
                <rect x="608" y="318" width="520" height="74" rx="8" fill="#0e1116" stroke="#262b36" strokeWidth="1.5" />
                <text x="624" y="339" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#e2e8f0">
                  ✓ GEOTAG STRUCTURAL CRACKS &amp; UNMIXED CEMENT IN 30 SECONDS
                </text>
                <text x="624" y="359" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#10b981">
                  ✓ EARN CONTRACTOR CSR HARDWARE VOUCHERS &amp; SAFETY GEAR
                </text>
                <text x="624" y="379" fontFamily="monospace" fontWeight="700" fontSize="11" fill="#fdba74">
                  ✓ ZERO DATA REQUIRED · INSTANT USSD {transitSpec.ussdCode}
                </text>
                <rect x="608" y="404" width="520" height="42" rx="8" fill="#c2410c" />
                <text x="868" y="430" textAnchor="middle" fontFamily="monospace" fontWeight="900" fontSize="17" fill="#ffffff">
                  WORKS TOLL-FREE: {transitSpec.ussdCode} · CIVICDUTY.SITE
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>

      {/* Social Media Share & Caption Studio Bar */}
      <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white">Social Media Marketing Pack: </strong>
            1200×600 Banner + 1-Click Caption for Social Promotion
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopySocial}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            {copiedSocial ? <Check size={12} /> : <Share2 size={12} />}
            <span>{copiedSocial ? 'Caption Copied!' : 'Copy Social Media Post'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[11px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download size={12} />
            <span>Download Poster (SVG)</span>
          </button>
        </div>
      </div>

      {/* Design Specifications Sub-Panel */}
      {showSpecs && (
        <div className="p-3.5 bg-white dark:bg-[#12161f] border-t border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono text-slate-600 dark:text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
