import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { KayoolaBusGraphic } from '../components/KayoolaBusGraphic';
import { CountrySelector } from '../components/CountrySelector';
import { getCountryTransitSpecs } from '../data/promotionalAds';
import {
  ArrowLeft,
  Download,
  Eye,
  Bus,
  Train,
  ShieldCheck,
  Megaphone,
  Radio,
  Maximize2,
  X,
  Layers,
  FileCode,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Smartphone,
  CheckCircle2,
  Bike,
  Copy,
  Check,
  Printer,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface CampaignMediaItem {
  id: string;
  title: string;
  category: 'bodaboda' | 'bus' | 'train' | 'terminal' | 'billboard';
  categoryLabel: string;
  imageSrc: string;
  summary: string;
  specs: string;
  tagline: string;
  callToAction: string;
  highlights: string[];
}

export const TransitPreviewView: React.FC = () => {
  const { go, selectedCountry, user } = useApp();
  const activeCountry = selectedCountry || user?.country || 'UG';
  const transitSpec = getCountryTransitSpecs(activeCountry);

  const CAMPAIGN_MEDIA: CampaignMediaItem[] = useMemo(
    () => [
      {
        id: 'kayoola-bus-wrap',
        title: `${transitSpec.countryName} Organized Bus Fleet Painting & Ad Partnership Proposal`,
        category: 'bus',
        categoryLabel: `Bus Painting Proposal (${transitSpec.countryName})`,
        imageSrc: '/campaign/kayoola_bus_partnership.jpg',
        summary: transitSpec.busProposalSummary,
        specs: `${transitSpec.busFleetType} · Full Exterior Paint & 3M Cast Lamination Proposal · ${transitSpec.busRoutes}`,
        tagline: `PROPOSAL FOR ACTUAL FLEET PAINTING · ${transitSpec.busPartnerName.toUpperCase()}`,
        callToAction: `Dial ${transitSpec.ussdCode} or Partner for Fleet Painting`,
        highlights: [
          `Commercial & Sovereign Proposal: Once agreed upon with ${transitSpec.busPartnerName}, CivicDuty funds and executes actual bus painting with our 3-Signal brand design`,
          `High-contrast Emerald, Slate & White livery visible from 150+ meters along ${transitSpec.busRoutes}`,
          'Iconic 3-Signal Beacon: Red (Citizen Speaks), Amber (Gov Serves), Green Checkmark (Resolved)',
          `Direct USSD code (${transitSpec.ussdCode}) prominently painted for zero-data smartphone and feature phone riders`,
        ],
      },
      {
        id: 'commuter-train-wrap',
        title: `${transitSpec.trainOperatorName} "Moving Billboard" Train Painting Proposal`,
        category: 'train',
        categoryLabel: `Railway Moving Billboard (${transitSpec.countryName})`,
        imageSrc: '/campaign/train_moving_billboard.jpg',
        summary: transitSpec.trainProposalSummary,
        specs: `${transitSpec.trainType} · Industrial Anti-Corrosion Primer & Rail-Grade Polyurethane Livery · ${transitSpec.trainCorridors}`,
        tagline: `MOVING BILLBOARD PROPOSAL • ${transitSpec.trainOperatorName.toUpperCase()}`,
        callToAction: `Refurbish & Paint ${transitSpec.countryName} Commuter Trains in CivicDuty Livery`,
        highlights: [
          `CivicDuty is ready to paint existing ${transitSpec.countryName} railway carriages (${transitSpec.trainType}) as panoramic moving billboards`,
          `High-visibility 3-Signal brand livery seen at every railway crossing and station along ${transitSpec.trainCorridors}`,
          `Revitalizes classic rail rolling stock aesthetics while sensitizing ratusan of thousands of daily commuters`,
          `Co-branded with ${transitSpec.trainOperatorName} and ${transitSpec.municipalAuthority}`,
        ],
      },
      {
        id: 'bodaboda-stage-poster',
        title: `${transitSpec.countryName} ${transitSpec.stageTransportName} Poster Campaign`,
        category: 'bodaboda',
        categoryLabel: `${transitSpec.stageTransportName}`,
        imageSrc: '/campaign/bodaboda_matatu_poster.jpg',
        summary: `High-visibility weather-resistant stage shelter poster and rider reflector campaign tailored to ${transitSpec.stageLocations}.`,
        specs: 'A1/A2 Waterproof Outdoor Polypropylene Poster & Rider Safety Reflector Vests',
        tagline: `${transitSpec.localSlogan} • DIAL ${transitSpec.ussdCode}`,
        callToAction: `Dial ${transitSpec.ussdCode} FREE (Zero Data) or Scan QR at Any Stage`,
        highlights: [
          `Auto-adjusted for ${transitSpec.countryName}: ${transitSpec.stageLocations}`,
          `Empowers riders and drivers as frontline street inspectors reporting directly to ${transitSpec.municipalAuthority}`,
          `Instant USSD ${transitSpec.ussdCode} works on simple feature phones without internet bundles`,
          'Stage SACCO recognition and verified fuel/airtime perks for validated road reports',
        ],
      },
      {
        id: 'fleet-depot-charging',
        title: `${transitSpec.countryName} Fleet Terminal & Bus Park Branding`,
        category: 'terminal',
        categoryLabel: 'Fleet Terminal & Depot',
        imageSrc: '/campaign/fleet_depot_branding_1788711242525.jpg',
        summary: `Synchronized fleet branding across ${transitSpec.countryName} bus terminals, departure bays, and charging depots.`,
        specs: 'Fleet-wide Exterior Livery & Overhead Terminal Pylon Signage',
        tagline: `${transitSpec.countryName} Sovereign Transit Fleet · ${transitSpec.ussdCode}`,
        callToAction: 'Community Sensitization at Scale: 250,000+ Daily Commuter Impressions',
        highlights: [
          'Synchronized multi-vehicle visual impact reinforcing official public-private accountability',
          `High-traffic commuter departure bays across ${transitSpec.busRoutes}`,
          `Co-branded with ${transitSpec.municipalAuthority}`,
          'Integrated terminal bay posters detailing how civic reports are resolved within 24–72 hours',
        ],
      },
      {
        id: 'transit-shelter-billboard',
        title: 'Transit Station & Bus Shelter Backlit Advertising',
        category: 'billboard',
        categoryLabel: 'Station Shelter & Billboard',
        imageSrc: '/campaign/transit_station_billboard_1788711258042.jpg',
        summary: 'High-impact illuminated billboard at urban bus terminals and commuter waiting shelters, illustrating real-time citizen-government accountability.',
        specs: 'Backlit Translucent Polycarbonate 6-Sheet Poster & LED Lightbox Display',
        tagline: `HAVE A VOICE IN YOUR COMMUNITY • Download CivicDuty (${transitSpec.ussdCode})`,
        callToAction: `Scan the QR Code to Install CivicDuty PWA or Dial ${transitSpec.ussdCode}`,
        highlights: [
          'Captures commuters during dwell time (average 12–25 min platform wait time)',
          'Visual demonstration showing citizen phone report transforming from Amber to Green',
          'Encourages immediate PWA installs and offline USSD session initiates',
          'Deters public service apathy through verified case study resolution metrics',
        ],
      },
    ],
    [transitSpec]
  );

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bodaboda' | 'bus' | 'train' | 'terminal' | 'billboard' | 'strategy'>('all');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<CampaignMediaItem | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [activeScriptTab, setActiveScriptTab] = useState<'poster' | 'radio' | 'sacco' | 'specs'>('poster');

  const filteredMedia = selectedCategory === 'all' || selectedCategory === 'strategy'
    ? CAMPAIGN_MEDIA
    : CAMPAIGN_MEDIA.filter(item => item.category === selectedCategory);

  const activeMedia = filteredMedia[activeMediaIndex] || filteredMedia[0] || CAMPAIGN_MEDIA[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Sovereign Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => go('splash')}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
            title="Return to Core Civic Platform"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[12px] font-black uppercase mono tracking-wider text-white">
                {transitSpec.countryName} Transit &amp; Railway Branding Proposals
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[8px] bg-emerald-950 text-emerald-300 border border-emerald-700 mono font-bold">
                AUTO-ADAPTED ({transitSpec.countryCode})
              </span>
            </div>
            <p className="text-[9px] text-slate-400 mono">
              {transitSpec.busPartnerName} · {transitSpec.trainOperatorName} · {transitSpec.stageTransportName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CountrySelector variant="compact" />
          <button
            onClick={() => go('feed')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold mono uppercase transition-all shadow-md flex items-center gap-1 cursor-pointer"
          >
            <span>Citizen Feed</span>
            <ChevronRight size={12} />
          </button>
        </div>
      </header>

      {/* Main Campaign Showcase Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Campaign Hero Briefing Card */}
        <div className="rounded-2xl bg-slate-900 border border-[#262b36] p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Megaphone size={14} />
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-400 mono tracking-widest">
                  COMMUNITY SENSITIZATION STRATEGY
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Branding Public Transit to Drive Civic Engagement
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                By wrapping Uganda's new <strong>Kayoola EVS electric buses</strong> and <strong>passenger commuter trains</strong> with CivicDuty branding, we meet citizens during their daily commutes. This mobile visibility educates communities on reporting municipal infrastructure defects and exercising their civic voice through <strong>*3030#</strong> and the mobile platform.
              </p>
            </div>

            {/* Quick Impact Stats */}
            <div className="grid grid-cols-2 gap-2 sm:shrink-0 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-sm sm:text-base font-black text-emerald-400 mono">250K+</div>
                <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Daily Impressions</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-sm sm:text-base font-black text-amber-400 mono">*3030#</div>
                <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Offline Dial Code</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-850 pb-3">
          {[
            { key: 'all', label: 'All Images', icon: Layers },
            { key: 'bodaboda', label: 'Bodaboda Stages', icon: Bike },
            { key: 'bus', label: 'Kayoola Buses', icon: Bus },
            { key: 'train', label: 'Passenger Train', icon: Train },
            { key: 'terminal', label: 'Fleet Terminal', icon: ShieldCheck },
            { key: 'billboard', label: 'Shelter Billboards', icon: Megaphone },
            { key: 'strategy', label: 'Sensitization Strategy', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setSelectedCategory(tab.key as any);
                  setActiveMediaIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold mono transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Media Showcase (When not in pure strategy view) */}
        {selectedCategory !== 'strategy' && (
          <div className="space-y-4">
            {/* Primary Featured Image Display */}
            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl relative group">
              <div className="aspect-video w-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <img
                  src={activeMedia.imageSrc}
                  alt={activeMedia.title}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/35 pointer-events-none" />

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[9px] font-black uppercase mono">
                    {activeMedia.categoryLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold mono">
                    {activeMedia.specs}
                  </span>
                </div>

                {/* Expand Lightbox Button */}
                <button
                  onClick={() => setLightboxItem(activeMedia)}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/90 text-white border border-white/20 transition-all shadow-md z-10 active:scale-95"
                  title="Expand to Fullscreen Lightbox"
                >
                  <Maximize2 size={16} />
                </button>

                {/* Bottom Overlay Title & Tagline */}
                <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white tracking-wide">
                        {activeMedia.title}
                      </h3>
                      <p className="text-[10.5px] text-emerald-400 font-bold mono">
                        {activeMedia.tagline}
                      </p>
                    </div>
                    <button
                      onClick={() => setLightboxItem(activeMedia)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold mono uppercase self-start sm:self-center transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Eye size={12} />
                      <span>Inspect Details</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Description & Sensory Highlights */}
              <div className="p-4 sm:p-5 bg-slate-900 space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeMedia.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeMedia.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail Carousel / Grid */}
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400 mono tracking-wider flex items-center gap-1.5">
                <Layers size={12} strokeWidth={1.75} className="text-emerald-400" />
                <span>Select Campaign Mockup to Inspect ({filteredMedia.length} Available)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredMedia.map((item, index) => {
                  const isActive = activeMedia.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveMediaIndex(index)}
                      className={`rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        isActive
                          ? 'border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg scale-[1.02]'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-video w-full bg-slate-950 overflow-hidden relative">
                        <img
                          src={item.imageSrc}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="absolute bottom-1.5 left-2 right-2 text-[9.5px] font-bold text-white truncate mono">
                          {item.categoryLabel}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Vector CAD / Livery Blueprint Section */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-white mono">
                <FileCode size={14} className="text-emerald-400" />
                <span>Adopted Vector Livery Design Blueprint</span>
              </div>
              <p className="text-[10px] text-slate-400">
                1200×600 SVG vector blueprint provided for automotive signwriters &amp; vinyl printers
              </p>
            </div>
            <a
              href="/kayoola-transit-livery.svg"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-bold mono uppercase flex items-center gap-1 self-start sm:self-auto"
            >
              <ExternalLink size={12} />
              <span>Direct Vector SVG</span>
            </a>
          </div>

          <KayoolaBusGraphic className="shadow-lg ring-1 ring-white/5" />
        </div>

        {/* Bodaboda Community Stage Poster & Market Launch Creative Suite */}
        <div id="bodaboda-creative-suite" className="rounded-2xl bg-slate-900 border border-[#262b36] p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bike size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-wide mono">
                    Bodaboda Community Stage Poster &amp; Ad Script
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[8px] bg-emerald-950 text-emerald-300 border border-emerald-700 mono font-extrabold uppercase">
                    MARKET LAUNCH
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Transitioning into market: Official campaign script tailored to Uganda’s 1.5M+ Boda riders, stage noticeboards, and SACCOs
                </p>
              </div>
            </div>

            {/* Script Category Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
              {[
                { id: 'poster', label: 'Poster Script', icon: FileText },
                { id: 'radio', label: 'Audio / Megaphone', icon: Megaphone },
                { id: 'sacco', label: 'Stage SACCO', icon: ShieldCheck },
                { id: 'specs', label: 'Print Specs', icon: Printer },
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeScriptTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScriptTab(tab.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold mono transition-all flex items-center gap-1 whitespace-nowrap ${
                      isCurrent
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon size={11} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: POSTER COPY & VISUAL BREAKDOWN */}
          {activeScriptTab === 'poster' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Poster Layout Header & Visual Mockup Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-black relative group shadow-lg">
                  <img
                    src="/campaign/boda_poster_ad_1790426299023.jpg"
                    alt="Bodaboda Community Poster Mockup"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[8.5px] font-bold mono">
                    Official Stage Poster Preview
                  </div>
                  <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[10px] mono">
                    <span className="text-slate-300">Format: A1 / A2 Stage Display</span>
                    <button
                      onClick={() => setLightboxItem(CAMPAIGN_MEDIA[0])}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Eye size={12} />
                      <span>Enlarge Mockup</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  {/* Master Copy Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-[10px] font-black uppercase text-amber-400 mono tracking-wider flex items-center gap-1.5">
                        <FileText size={12} strokeWidth={1.75} /> Master Poster Headline &amp; Tagline
                      </span>
                      <button
                        onClick={() => {
                          const posterText = `CIVICDUTY BODABODA STAGE POSTER SCRIPT
HEADLINE (Luganda): BODA MAN: GWE BOSS W’OLUGUUDO!
HEADLINE (English): YOUR STAGE. YOUR ROAD. YOUR POWER. SPEAK DIRECTLY TO GOVERNMENT WITH ZERO INTERNET.
SUB-HEADLINE: Tokyakaaba Potholes oba Bribes mu Kifuba. Speak · Serve · Be Heard.

THE 3-SIGNAL SOVEREIGN LOOP:
[RED SIGNAL] (OYOGERA - CITIZEN SPEAKS):
"Oguze ekinnya ekyonoona sipulinji yo? Otegekeddwa omuserikale ayagala embuzi ku roadblock? Tegeeza gavumenti mubuziba."
Log the pothole, damaged culvert, dark streetlight, or police extortion point.

[AMBER SIGNAL] (GAVUMENTI EKOZI - GOVERNMENT SERVES):
"KCCA, UNRA n’abakulu b’amateeka bafuna alert ku sipiidi. Public SLA timer ebalira buli ddakiika paka bwe bakola ku nsonga yo."
Public countdown SLA clock starts ticking. Municipal engineers and supervisors are dispatched.

[GREEN SIGNAL WITH WHITE TICK] (PROOF ETEKEBWAWO - PROOF UPLOADED & CITIZEN HEARD):
"Oluguudo lusibwa, kabi kasalwako, era ebifaananyi by’obujulizi (Proof of Work) bitekebwa ku ledger! Stage yo efuna Civic Fuel Perks n’ekitiibwa!"
Repairs completed, hazard verified, timestamped photographic proof sealed on ledger. Stage earns fuel & airtime perks!

CALL TO ACTION:
- DIAL *3030# FOR FREE (No Data Needed / Kabiriti & Smartphone Compatible / MTN & Airtel)
- Scan QR Code to open CivicDuty Offline PWA
- Stage Chairmen: Register your Stage SACCO to receive instant emergency road fund dispatch alerts!`;
                          navigator.clipboard.writeText(posterText);
                          setCopiedScript('poster');
                          setTimeout(() => setCopiedScript(null), 2500);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-bold mono flex items-center gap-1 transition-all active:scale-95"
                      >
                        {copiedScript === 'poster' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                        <span>{copiedScript === 'poster' ? 'Copied Script!' : 'Copy Poster Script'}</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] text-slate-400 mono font-bold uppercase">Main Street Headline (Luganda):</div>
                      <div className="text-base sm:text-lg font-black text-white leading-tight font-serif tracking-tight">
                        &ldquo;BODA MAN: GWE BOSS W’OLUGUUDO!&rdquo;
                      </div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        EDDOBOOZI LYOPPA TIBAKYALINYIRIRA.
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-slate-900">
                      <div className="text-[10px] text-slate-400 mono font-bold uppercase">English Sub-Headline:</div>
                      <p className="text-xs font-bold text-slate-200">
                        YOUR STAGE. YOUR ROAD. YOUR POWER. Speak directly to Government with ZERO data.
                      </p>
                      <p className="text-[10.5px] text-slate-400 italic">
                        Tokyakaaba Potholes oba Bribes mu Kifuba. Funa Proof ku Simu Yo.
                      </p>
                    </div>
                  </div>

                  {/* The 3-Signal Loop Explanation tailored for Boda Riders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-slate-950 border border-red-500/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-black uppercase mono">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span>1. Red: Oyogera</span>
                      </div>
                      <div className="text-[10.5px] text-slate-200 font-bold">Oguze Pothole?</div>
                      <p className="text-[9.5px] text-slate-400 leading-relaxed">
                        Log suspension-busting potholes, open manholes, dark streetlights, or corrupt shakedowns.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase mono">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span>2. Amber: Gavumenti</span>
                      </div>
                      <div className="text-[10.5px] text-slate-200 font-bold">SLA Timer Etandika</div>
                      <p className="text-[9.5px] text-slate-400 leading-relaxed">
                        KCCA, UNRA &amp; Police receive instant dispatch. The public clock starts counting down.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1 bg-emerald-950/20">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase mono">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check size={7} strokeWidth={3} />
                        </span>
                        <span>3. Green: Proof</span>
                      </div>
                      <div className="text-[10.5px] text-emerald-300 font-bold">Oluguudo Lusibwa!</div>
                      <p className="text-[9.5px] text-slate-300 leading-relaxed">
                        Pothole patched, proof photo uploaded to ledger. Stage earns fuel &amp; airtime perks.
                      </p>
                    </div>
                  </div>

                  {/* Direct Call To Action Callout */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-white mono uppercase flex items-center gap-1.5">
                        <span className="text-amber-400 font-extrabold text-sm">*3030#</span>
                        <span>DIAL FOR FREE · ZERO DATA NEEDED</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        Compatible with all MTN &amp; Airtel phones (Smartphones &amp; Kabiriti Feature Phones).
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => go('ussd')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold transition-all shadow-sm"
                      >
                        Try *3030# Simulator →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEGAPHONE & RADIO BROADCAST SCRIPT */}
          {activeScriptTab === 'radio' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="text-xs font-black uppercase text-amber-400 mono flex items-center gap-1.5">
                    <Radio size={14} /> 45-Second Stage Megaphone &amp; FM Radio Sensitization Script
                  </div>
                  <button
                    onClick={() => {
                      const radioText = `[SOUND EFFECT: Motorcycle engine revving - Bajaj Boxer - followed by sudden loud tire screech and clunk into a pothole]
VOICEOVER (High energy, passionate Kampala street voice in Luganda & English):
"Boda boda riders! Banange mu Wandegeya, Usafi, Nakawa, Ntinda, Bwaise, Nansana, ne Mukono!
Buli lunaku mufiirwa emitwalo mu kumenya rims, sipulinji, ne bribes ez'ekifuba ku makubo! Naye ani awulira okulaajana kwammwe?

[SOUND EFFECT: Clean digital chime - 3 Signal Beacon turning green with tick]
VOICEOVER:
Kati Gavumenti etadde obuyinza mu ngalo zammwe!
Koona ku simu yo *3030# — kya bwereere, tewetaaga data oba smartphone eya bbeeyi!
Ripoota ekinnya, etala ey’omukubo eyasebesebe, oba roadblock etali mu mateeka.
Buli lw'obiripoota, etala ya CivicDuty ekyuka okuva ku Myufu, eyaka mu kyenvu, paka lwe bataddeko Akabonero k'Akateeko ku Kiragala (Green Tick) ng'oluguudo lunongoosebbwa!
Gwe Boss w'Oluguudo. Stage yo ebaakuwe n'ebirabo bya petulooli!
Koona *3030# kati. CIVICDUTY: Speak, Serve, Be Heard!"`;
                      navigator.clipboard.writeText(radioText);
                      setCopiedScript('radio');
                      setTimeout(() => setCopiedScript(null), 2500);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[9.5px] font-bold mono flex items-center gap-1 transition-all"
                  >
                    {copiedScript === 'radio' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    <span>{copiedScript === 'radio' ? 'Copied Audio Script!' : 'Copy Audio Script'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 font-mono text-[11px] leading-relaxed text-slate-300 space-y-2 border border-slate-800">
                  <p className="text-emerald-400 italic">
                    [SFX: Motorcycle engine revving - Bajaj Boxer - followed by sudden tire screech and loud clunk hitting a pothole]
                  </p>
                  <p>
                    <strong className="text-white">STAGE ANNOUNCER (Passionate, authentic Kampala street tone):</strong><br />
                    &ldquo;Boda boda riders! Banange mu Wandegeya, Usafi, Nakawa, Ntinda, Bwaise, Nansana, ne Mukono! Buli lunaku mufiirwa emitwalo mu kumenya rims, sipulinji, ne bribes ez&apos;ekifuba ku makubo! Naye ani awulira okulaajana kwammwe?&rdquo;
                  </p>
                  <p className="text-emerald-400 italic">
                    [SFX: Clean digital sovereign beacon chime — Green signal illuminates with tick mark]
                  </p>
                  <p>
                    &ldquo;Kati Gavumenti etadde obuyinza mu ngalo zammwe! Koona ku simu yo <strong>*3030#</strong> — kya bwereere, tewetaaga data oba smartphone eya bbeeyi! Ripoota ekinnya, etala ey&apos;omukubo eyasebesebe, oba roadblock etali mu mateeka. Buli lw&apos;obiripoota, etala ya CivicDuty ekyuka okuva ku Myufu, eyaka mu kyenvu, paka lwe bataddeko Akabonero k&apos;Akateeko ku Kiragala ng&apos;oluguudo lunongoosebbwa! Gwe Boss w&apos;Oluguudo. Stage yo ebaakuwe n&apos;ebirabo bya petulooli! Koona <strong>*3030#</strong> kati. CIVICDUTY: Speak, Serve, Be Heard!&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STAGE SACCO MOBILISATION PROTOCOL */}
          {activeScriptTab === 'sacco' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-black uppercase text-white mono flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Stage Chairman &amp; SACCO Mobilisation Protocol</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  How stage leadership deploys CivicDuty to protect their riders, fast-track road repairs with division town clerks, and unlock fuel voucher allocations:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-emerald-400 font-bold mono text-[10.5px]">Step 1: Stage Onboarding &amp; Code</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Stage Chairman registers stage via *3030# or platform admin. The stage is assigned a unique verification code (e.g. <code>WAND-STAGE-04</code>).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-amber-400 font-bold mono text-[10.5px]">Step 2: Collective Hazard Verification</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      When multiple riders from the same stage upvote or confirm a road hazard, its priority score elevates to Grade 1 emergency dispatch for KCCA engineers.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-indigo-400 font-bold mono text-[10.5px]">Step 3: Anti-Extortion Shield</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Unlawful spot-fines or illegal bike confiscations reported on *3030# trigger instant alerts to Police Professional Standards Unit (PSU) and Division DPC.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="text-emerald-400 font-bold mono text-[10.5px]">Step 4: Verified Fuel &amp; Airtime Perks</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Riders whose hazard reports lead to certified municipal repairs earn verified Civic Karma, redeemable at partner petrol stations for fuel and airtime bundles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRINT MEDIA SPECIFICATIONS */}
          {activeScriptTab === 'specs' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-black uppercase text-white mono flex items-center gap-1.5">
                  <Printer size={14} className="text-emerald-400" />
                  <span>Physical Print &amp; Mounting Specifications for Boda Stages</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[9px] text-slate-400 uppercase">Substrate</div>
                    <div className="text-white font-bold">Polypropylene Synthetic</div>
                    <p className="text-[10px] text-slate-400 normal-case">100% waterproof, tear-proof, UV-resistant outdoors</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[9px] text-slate-400 uppercase">Standard Sizes</div>
                    <div className="text-white font-bold">A1 (594×841mm) &amp; A2</div>
                    <p className="text-[10px] text-slate-400 normal-case">Optimized for stage umbrellas, timber boards, wall mounts</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[9px] text-slate-400 uppercase">Ink Technology</div>
                    <div className="text-white font-bold">Latex UV Curable</div>
                    <p className="text-[10px] text-slate-400 normal-case">Fade-resistant under harsh tropical equatorial sunlight</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[9px] text-slate-400 uppercase">QR Code Spec</div>
                    <div className="text-white font-bold">High Error Correction (H)</div>
                    <p className="text-[10px] text-slate-400 normal-case">Scannable even if dust or rain partially covers 30% of code</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Community Sensitization Strategy Blueprint */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-white tracking-wide mono">
                Strategic Rationale: Why Transit Fleet Branding Drives Citizen Action
              </h3>
              <p className="text-[10.5px] text-slate-400">
                The psychological and practical mechanics of community sensitization on public transport
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-black uppercase text-[10px] mono">
                1. High Dwell Time &amp; Repetition
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Daily commuters on Kira, Ntinda, Nakwero, and Jinja Road routes spend an average of <strong>45 to 80 minutes</strong> in transit. Constant exposure to the 3-Signal Beacon turns passive travel time into an education opportunity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-amber-400 font-black uppercase text-[10px] mono">
                2. Dual Digital Gateway (*3030# &amp; App)
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Every vehicle prominently highlights <strong>*3030#</strong>. A commuter without mobile data or using a basic feature phone can dial the USSD code immediately while looking at the bus wrap to submit a local service report.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="text-sky-400 font-black uppercase text-[10px] mono">
                3. State &amp; Municipal Legitimacy
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Co-branding with the <strong>Ministry of ICT &amp; National Guidance</strong> assures citizens that reports logged on CivicDuty are legally recognized and prioritized by municipal engineers, eliminating cynicism.
              </p>
            </div>
          </div>

          {/* Rollout Corridors */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="text-[10px] font-black uppercase text-slate-400 mono">
              Target Phase 1 Transit Corridors (Kampala Metropolitan Area)
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] mono">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1.5">
                <Bus size={12} strokeWidth={1.75} className="text-emerald-400" />
                <span>Route A: Ntinda ↔ Kiwatule ↔ Najjera ↔ Kira ↔ Nakwero</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1.5">
                <Bus size={12} strokeWidth={1.75} className="text-emerald-400" />
                <span>Route B: Jinja Road Express ↔ Bweyogerere ↔ Mukono</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex items-center gap-1.5">
                <Train size={12} strokeWidth={1.75} className="text-emerald-400" />
                <span>Commuter Rail: Namanve ↔ Kampala Central Station</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Exit to Citizen Core */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-left">
            <div className="text-xs font-black text-white uppercase mono">Ready to experience CivicDuty?</div>
            <div className="text-[10px] text-slate-400">Return to the sovereign citizen feed or report an infrastructure issue.</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => go('splash')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold mono transition-all"
            >
              ← Splash Portal
            </button>
            <button
              onClick={() => go('feed')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold mono uppercase transition-all shadow-md active:scale-95"
            >
              Open Citizen Feed →
            </button>
          </div>
        </div>
      </main>

      {/* Fullscreen Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-white uppercase mono">{lightboxItem.title}</span>
                <span className="ml-2 text-[9px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 mono font-bold">
                  {lightboxItem.categoryLabel}
                </span>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Image */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative">
              <img
                src={lightboxItem.imageSrc}
                alt={lightboxItem.title}
                className="max-h-[60vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Footer Specs */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs text-emerald-400 font-bold mono">
                  {lightboxItem.tagline}
                </div>
                <div className="text-[10px] text-slate-400 mono">
                  Specs: {lightboxItem.specs}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lightboxItem.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
