import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Post } from '../types';
import { 
  MapPin, 
  Layers, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Crosshair, 
  ExternalLink, 
  Compass, 
  Eye, 
  ShieldAlert, 
  Maximize2, 
  Minimize2,
  Filter
} from 'lucide-react';
import { catByID, getDept, slaStatus } from '../utils/helpers';

interface GeospatialSignalMapProps {
  initialRegion?: 'ALL' | 'CENTRAL' | 'WESTERN' | 'EASTERN' | 'NORTHERN';
  customPosts?: Post[];
  compact?: boolean;
  onSelectPost?: (post: Post) => void;
}

// Pre-calibrated representative coordinates for Ugandan Districts & Municipalities on an SVG coordinate space (0..500 x, 0..500 y)
const DISTRICT_MAP_COORDS: Record<string, { x: number; y: number; region: string; label: string }> = {
  'KLA': { x: 265, y: 310, region: 'CENTRAL', label: 'Kampala' },
  'WAK': { x: 245, y: 300, region: 'CENTRAL', label: 'Wakiso' },
  'MUK': { x: 290, y: 300, region: 'CENTRAL', label: 'Mukono' },
  'JIN': { x: 325, y: 290, region: 'EASTERN', label: 'Jinja' },
  'MBL': { x: 385, y: 240, region: 'EASTERN', label: 'Mbale' },
  'SOR': { x: 360, y: 190, region: 'EASTERN', label: 'Soroti' },
  'GUL': { x: 250, y: 120, region: 'NORTHERN', label: 'Gulu' },
  'ARU': { x: 130, y: 90, region: 'NORTHERN', label: 'Arua' },
  'MRT': { x: 420, y: 140, region: 'NORTHERN', label: 'Moroto' },
  'MBR': { x: 170, y: 380, region: 'WESTERN', label: 'Mbarara' },
  'KAS': { x: 110, y: 320, region: 'WESTERN', label: 'Kasese' },
  'KAB': { x: 130, y: 440, region: 'WESTERN', label: 'Kabale' },
  'MAS': { x: 210, y: 350, region: 'CENTRAL', label: 'Masaka' },
  'FT_PORTAL': { x: 130, y: 280, region: 'WESTERN', label: 'Fort Portal' },
  'LIRA': { x: 290, y: 150, region: 'NORTHERN', label: 'Lira' },
  'HOIMA': { x: 180, y: 240, region: 'WESTERN', label: 'Hoima' },
  'TORORO': { x: 395, y: 270, region: 'EASTERN', label: 'Tororo' },
  'ENTEBBE': { x: 255, y: 335, region: 'CENTRAL', label: 'Entebbe' },
};

export const GeospatialSignalMap: React.FC<GeospatialSignalMapProps> = ({
  initialRegion = 'ALL',
  customPosts,
  compact = false,
  onSelectPost,
}) => {
  const { posts, setActivePost, go, theme } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'CENTRAL' | 'WESTERN' | 'EASTERN' | 'NORTHERN'>(initialRegion);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSignalFilter, setActiveSignalFilter] = useState<'ALL' | 'RED' | 'AMBER' | 'GREEN'>('ALL');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewMode, setViewMode] = useState<'PINS' | 'HEATMAP'>('PINS');
  const [radiusFilter, setRadiusFilter] = useState<'ALL' | '500M' | '2KM' | '10KM'>('ALL');

  const sourcePosts = customPosts || posts;

  // Filter posts based on controls
  const filteredPosts = useMemo(() => {
    return sourcePosts.filter((p) => {
      // Category filter
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;

      // Signal filter
      if (activeSignalFilter === 'RED' && (p.category !== 'corruption' && p.status !== 'overdue' && !p.escalated)) return false;
      if (activeSignalFilter === 'AMBER' && (p.status === 'resolved' || p.category === 'corruption' || p.status === 'overdue')) return false;
      if (activeSignalFilter === 'GREEN' && p.status !== 'resolved') return false;

      return true;
    });
  }, [sourcePosts, selectedCategory, activeSignalFilter]);

  // Compute map pins with SVG coordinates
  const pins = useMemo(() => {
    return filteredPosts.map((post, idx) => {
      const locationKey = (post.location || post.territory?.district || '').toUpperCase();
      let coords = { x: 250, y: 250, region: 'CENTRAL', label: post.location };

      if (locationKey.includes('KAMPALA') || locationKey.includes('KLA') || locationKey.includes('CENTRAL')) coords = DISTRICT_MAP_COORDS.KLA;
      else if (locationKey.includes('WAKISO') || locationKey.includes('NANSANA') || locationKey.includes('KIRA')) coords = DISTRICT_MAP_COORDS.WAK;
      else if (locationKey.includes('MUKONO')) coords = DISTRICT_MAP_COORDS.MUK;
      else if (locationKey.includes('JINJA')) coords = DISTRICT_MAP_COORDS.JIN;
      else if (locationKey.includes('MBALE')) coords = DISTRICT_MAP_COORDS.MBL;
      else if (locationKey.includes('SOROTI')) coords = DISTRICT_MAP_COORDS.SOR;
      else if (locationKey.includes('GULU')) coords = DISTRICT_MAP_COORDS.GUL;
      else if (locationKey.includes('ARUA') || locationKey.includes('WEST NILE')) coords = DISTRICT_MAP_COORDS.ARU;
      else if (locationKey.includes('MOROTO') || locationKey.includes('KARAMOJA')) coords = DISTRICT_MAP_COORDS.MRT;
      else if (locationKey.includes('MBARARA')) coords = DISTRICT_MAP_COORDS.MBR;
      else if (locationKey.includes('KASESE') || locationKey.includes('RWENZORI')) coords = DISTRICT_MAP_COORDS.KAS;
      else if (locationKey.includes('KABALE') || locationKey.includes('KIGEZI')) coords = DISTRICT_MAP_COORDS.KAB;
      else if (locationKey.includes('MASAKA')) coords = DISTRICT_MAP_COORDS.MAS;
      else if (locationKey.includes('HOIMA') || locationKey.includes('BUNYORO')) coords = DISTRICT_MAP_COORDS.HOIMA;
      else if (locationKey.includes('LIRA') || locationKey.includes('LANGO')) coords = DISTRICT_MAP_COORDS.LIRA;
      else if (locationKey.includes('TORORO')) coords = DISTRICT_MAP_COORDS.TORORO;
      else if (locationKey.includes('ENTEBBE')) coords = DISTRICT_MAP_COORDS.ENTEBBE;

      // Small jitter so overlapping reports within the same city don't stack directly on top
      const jitterX = ((idx * 17) % 24) - 12;
      const jitterY = ((idx * 23) % 24) - 12;

      let signalColor = 'amber';
      if (post.status === 'resolved') signalColor = 'green';
      else if (post.category === 'corruption' || post.status === 'overdue' || post.escalated) signalColor = 'red';

      return {
        post,
        x: Math.max(30, Math.min(470, coords.x + jitterX)),
        y: Math.max(30, Math.min(470, coords.y + jitterY)),
        region: coords.region,
        signalColor,
      };
    }).filter(pin => selectedRegion === 'ALL' || pin.region === selectedRegion);
  }, [filteredPosts, selectedRegion]);

  const redCount = pins.filter(p => p.signalColor === 'red').length;
  const amberCount = pins.filter(p => p.signalColor === 'amber').length;
  const greenCount = pins.filter(p => p.signalColor === 'green').length;

  const handlePinClick = (post: Post) => {
    setSelectedPost(post);
    if (onSelectPost) onSelectPost(post);
  };

  const handleOpenDetail = (post: Post) => {
    setActivePost(post);
    go('post_detail');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 overflow-hidden shadow-sm space-y-3 transition-colors text-slate-950 dark:text-white">
      {/* Top Header & GIS Telemetry Controls */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/70 dark:bg-slate-950/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center">
            <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '18s' }} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-950 dark:text-white flex items-center gap-1.5">
              <span>Geospatial Signal Density Layer</span>
              <span className="text-[9px] mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                LIVE GIS
              </span>
            </h3>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
              Real-time geocoded infrastructure signals across 146 local government jurisdictions.
            </p>
          </div>
        </div>

        {/* View Mode Toggle: Pins vs Density Heatmap */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('PINS')}
            className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'PINS' 
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-2xs' 
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            Signal Pins
          </button>
          <button
            onClick={() => setViewMode('HEATMAP')}
            className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${
              viewMode === 'HEATMAP' 
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-2xs' 
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            Density Heatmap
          </button>
        </div>
      </div>

      {/* Control Filters Bar */}
      <div className="px-3.5 sm:px-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Region Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 mr-1">Region:</span>
          {(['ALL', 'CENTRAL', 'WESTERN', 'EASTERN', 'NORTHERN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-lg transition-all ${
                selectedRegion === r
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* 3-Signal Filter Badges */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSignalFilter(activeSignalFilter === 'RED' ? 'ALL' : 'RED')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9.5px] font-black border transition-all ${
              activeSignalFilter === 'RED'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse" />
            <span>Red ({redCount})</span>
          </button>

          <button
            onClick={() => setActiveSignalFilter(activeSignalFilter === 'AMBER' ? 'ALL' : 'AMBER')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9.5px] font-black border transition-all ${
              activeSignalFilter === 'AMBER'
                ? 'bg-amber-600 text-white border-amber-700'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
            <span>Amber ({amberCount})</span>
          </button>

          <button
            onClick={() => setActiveSignalFilter(activeSignalFilter === 'GREEN' ? 'ALL' : 'GREEN')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9.5px] font-black border transition-all ${
              activeSignalFilter === 'GREEN'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Green ({greenCount})</span>
          </button>
        </div>
      </div>

      {/* Interactive Vector GIS Canvas */}
      <div className="relative mx-3.5 sm:mx-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner aspect-[4/3] sm:aspect-[16/10]">
        {/* SVG Topographic Grid & District Topology */}
        <svg viewBox="0 0 500 500" className="w-full h-full select-none">
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="gisGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.5" />
            </pattern>
            {/* Heatmap blur filter */}
            <filter id="heatBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>
          <rect width="500" height="500" fill="#020617" />
          <rect width="500" height="500" fill="url(#gisGrid)" />

          {/* Stylized Uganda Border Contour */}
          <path
            d="M 120 70 
               L 250 80 
               L 360 110 
               L 440 140 
               L 410 240 
               L 390 280 
               L 330 330 
               L 280 340 
               L 250 380 
               L 210 390 
               L 160 460 
               L 110 430 
               L 100 330 
               L 130 270 
               L 170 230 
               L 120 180 
               L 110 100 Z"
            fill="rgba(16, 185, 129, 0.04)"
            stroke="rgba(16, 185, 129, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Major Regional Zones */}
          <text x="250" y="95" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.2em">NORTHERN REGION</text>
          <text x="380" y="210" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.2em">EASTERN</text>
          <text x="140" y="360" fill="rgba(148, 163, 184, 0.4)" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.2em">WESTERN</text>
          <text x="260" y="270" fill="rgba(16, 185, 129, 0.5)" fontSize="10" fontWeight="900" textAnchor="middle" letterSpacing="0.2em">CENTRAL (KAMPALA)</text>

          {/* Lake Victoria Vector Waterbody */}
          <path
            d="M 280 340 Q 340 360 380 430 Q 330 460 250 420 Q 240 370 280 340 Z"
            fill="rgba(6, 182, 212, 0.12)"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="1"
          />
          <text x="320" y="400" fill="rgba(6, 182, 212, 0.6)" fontSize="7.5" fontWeight="bold" textAnchor="middle">LAKE VICTORIA</text>

          {/* District Center Anchor Dots */}
          {Object.entries(DISTRICT_MAP_COORDS).map(([key, d]) => (
            <g key={key}>
              <circle cx={d.x} cy={d.y} r="2.5" fill="#334155" />
              <text x={d.x} y={d.y + 11} fill="#64748b" fontSize="7" fontWeight="bold" textAnchor="middle">{d.label}</text>
            </g>
          ))}

          {/* HEATMAP DENSITY LAYER (When in Heatmap Mode) */}
          {viewMode === 'HEATMAP' && (
            <g filter="url(#heatBlur)">
              {pins.map((pin, idx) => {
                const heatColor = pin.signalColor === 'red' ? '#ef4444' : pin.signalColor === 'amber' ? '#f59e0b' : '#10b981';
                return (
                  <circle
                    key={`heat-${idx}`}
                    cx={pin.x}
                    cy={pin.y}
                    r={pin.signalColor === 'red' ? 32 : 24}
                    fill={heatColor}
                    opacity="0.45"
                  />
                );
              })}
            </g>
          )}

          {/* INTERACTIVE SIGNAL PINS LAYER */}
          {viewMode === 'PINS' && pins.map((pin, idx) => {
            const isSelected = selectedPost?.id === pin.post.id;
            const isRed = pin.signalColor === 'red';
            const isAmber = pin.signalColor === 'amber';
            const isGreen = pin.signalColor === 'green';

            const fillHex = isRed ? '#ef4444' : isAmber ? '#f59e0b' : '#10b981';
            const strokeHex = isRed ? '#fca5a5' : isAmber ? '#fde68a' : '#a7f3d0';

            return (
              <g
                key={`pin-${pin.post.id}-${idx}`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => handlePinClick(pin.post)}
              >
                {/* Pulse ring on active emergency or amber timer */}
                {(isRed || isAmber) && (
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r={isSelected ? 14 : 9}
                    fill="none"
                    stroke={fillHex}
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                    style={{ animationDuration: isRed ? '1.8s' : '3s' }}
                  />
                )}

                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={isSelected ? 8 : 5}
                  fill={fillHex}
                  stroke={isSelected ? '#ffffff' : strokeHex}
                  strokeWidth={isSelected ? 2.5 : 1}
                />

                {isSelected && (
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="12"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Live GPS Telemetry Overlay Chip */}
        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-xl text-[9px] mono text-slate-300 font-bold flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>UG-GRID: EPSG:4326 · {pins.length} Live Signals</span>
        </div>

        {/* Selected Post Popover Preview Card */}
        {selectedPost && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 dark:bg-slate-900/95 border border-slate-300 dark:border-slate-700 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 a-fade text-slate-950 dark:text-white">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-1.5">
                <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                  selectedPost.status === 'resolved' 
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : selectedPost.category === 'corruption' || selectedPost.status === 'overdue'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                }`}>
                  {selectedPost.status === 'resolved' ? 'Resolved' : selectedPost.category === 'corruption' ? 'Corruption' : 'Active 48h SLA'}
                </span>
                <span className="text-[9.5px] font-bold text-slate-700 dark:text-slate-300 truncate">
                  {selectedPost.location}
                </span>
              </div>

              <h4 className="text-xs font-black text-slate-950 dark:text-white line-clamp-1">
                {selectedPost.title}
              </h4>
              <p className="text-[10px] text-slate-700 dark:text-slate-300 line-clamp-1 font-medium">
                {selectedPost.body}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setSelectedPost(null)}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Dismiss
              </button>
              <button
                onClick={() => handleOpenDetail(selectedPost)}
                className="text-[10.5px] font-black px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Inspect Signal</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-bold text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-2">
          <span>Active Display: <strong className="text-slate-950 dark:text-white">{pins.length} Signals</strong> in {selectedRegion} Region</span>
        </div>
        <div className="text-[9.5px] mono text-slate-600 dark:text-slate-400">
          Click any signal node to inspect real-time SLA timer and citizen verification.
        </div>
      </div>
    </div>
  );
};
