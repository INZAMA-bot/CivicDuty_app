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
  Store,
  Car,
  Stethoscope,
  GraduationCap,
  HardHat,
  Copy,
  Check,
  Printer,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface CampaignMediaItem {
  id: string;
  title: string;
  category: 'bodaboda' | 'bus' | 'train' | 'terminal' | 'billboard' | 'market' | 'taxi' | 'health' | 'teacher' | 'artisan';
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
        id: 'kayoola-kampala-street-poster',
        title: `${transitSpec.countryName} Kayoola Bus on Kampala Roads: Real-Life Street & Passenger Poster`,
        category: 'bus',
        categoryLabel: `Real-Life Street Poster (${transitSpec.countryName})`,
        imageSrc: '/campaign/kayoola_kampala_street_ad.jpg',
        summary: `${transitSpec.busProposalSummary} Real-life street experience poster displaying the Kayoola EVS bus painted in CivicDuty livery cruising Kampala Road with passengers and pedestrians.`,
        specs: `${transitSpec.busFleetType} · Real-Life Street Experience Poster + Full Exterior Paint Proposal · ${transitSpec.busRoutes}`,
        tagline: `KAYOOLA BUS IN KAMPALA STREETS · ${transitSpec.busPartnerName.toUpperCase()} · DIAL ${transitSpec.ussdCode}`,
        callToAction: `Dial ${transitSpec.ussdCode} or Partner for Fleet Painting`,
        highlights: [
          `Real-life street experience poster showing the Kayoola bus with CivicDuty branding on Kampala roads alongside passengers and pedestrians`,
          `Paired with our engineering CAD paint plan to fund and execute actual bus painting upon partnership agreement`,
          'Iconic 3-Signal Beacon: Red (Citizen Speaks), Amber (Gov Serves), Green Checkmark (Resolved)',
          `Direct USSD code (${transitSpec.ussdCode}) prominently painted for zero-data smartphone and feature phone riders`,
        ],
      },
      {
        id: 'commuter-train-kampala-poster',
        title: `${transitSpec.trainOperatorName} "Moving Billboard" Commuter Train in Kampala`,
        category: 'train',
        categoryLabel: `Railway Moving Billboard (${transitSpec.countryName})`,
        imageSrc: '/campaign/train_moving_billboard_kampala.jpg',
        summary: `${transitSpec.trainProposalSummary} Real-life experience poster showing the multi-car commuter train painted in CivicDuty livery passing passengers and level crossings in Kampala.`,
        specs: `${transitSpec.trainType} · Real-Life Railway Crossing Poster + Anti-Corrosion Polyurethane Livery · ${transitSpec.trainCorridors}`,
        tagline: `MOVING BILLBOARD PROPOSAL • ${transitSpec.trainOperatorName.toUpperCase()}`,
        callToAction: `Refurbish & Paint ${transitSpec.countryName} Commuter Trains in CivicDuty Livery`,
        highlights: [
          `CivicDuty is ready to paint existing ${transitSpec.countryName} railway carriages (${transitSpec.trainType}) as panoramic moving billboards`,
          `Real-life station & level-crossing visual impact across ${transitSpec.trainCorridors}`,
          `Revitalizes classic rail rolling stock aesthetics while sensitizing hundreds of thousands of daily commuters`,
          `Co-branded with ${transitSpec.trainOperatorName} and ${transitSpec.municipalAuthority}`,
        ],
      },
      {
        id: 'bodaboda-stage-billboard-ad',
        title: `${transitSpec.countryName} Bodaboda Stages & Frontline Scouts Billboard Campaign`,
        category: 'bodaboda',
        categoryLabel: `Bodaboda Stage Billboard`,
        imageSrc: '/campaign/boda_stage_billboard_ad.jpg',
        summary: `Large-format outdoor billboards at bustling Bodaboda stages paired with branded Frontline Scout reflector vests across ${transitSpec.stageLocations}.`,
        specs: '6m × 3m Outdoor Stage Billboard & Frontline Scout Safety Reflector Vests',
        tagline: `${transitSpec.localSlogan} • DIAL ${transitSpec.ussdCode}`,
        callToAction: `Dial ${transitSpec.ussdCode} FREE (Zero Data) or Scan QR at Any Stage`,
        highlights: [
          `Real-life Bodaboda stage scene with riders wearing CivicDuty Frontline Scout reflector vests beneath a stage billboard`,
          `Empowers riders and drivers as frontline street inspectors reporting directly to ${transitSpec.municipalAuthority}`,
          `Instant USSD ${transitSpec.ussdCode} works on simple feature phones without internet bundles`,
          'Geotagged corridor & stage pools auto-dispatch monthly fuel and airtime bounties to Top-3 ranked scouts',
        ],
      },
      {
        id: 'market-vendors-billboard-ad',
        title: `${transitSpec.countryName} Market Vendors & Urban Market Square Billboard Campaign`,
        category: 'market',
        categoryLabel: 'Market Vendors Billboard',
        imageSrc: '/campaign/market_vendors_billboard_ad.jpg',
        summary: 'High-impact overhead commercial billboards installed above vibrant Ugandan urban markets, empowering market vendors and shoppers to report sanitation, water, power, and municipal service issues.',
        specs: 'Large-Format Urban Market Square Overhead Billboard & Vendor Parasols',
        tagline: `MARKET VENDORS & CITIZENS: SPEAK. SERVE. BE HEARD. • DIAL ${transitSpec.ussdCode}`,
        callToAction: `Dial ${transitSpec.ussdCode} FREE from Any Market Stall`,
        highlights: [
          'Positioned directly above busy market stalls (fresh produce, textiles, and retail traders) for all-day visibility',
          'Gives market women and traders a direct voice to municipal health, water, and electricity authorities',
          'Drives grassroots participation in Parish Vault and Private Provider Vault monthly community rankings',
          'Zero-data USSD shortcode accessible on every basic phone used by market vendors',
        ],
      },
      {
        id: 'taxi-matatu-drivers-billboard',
        title: `${transitSpec.countryName} Taxi & Matatu Commuter Park Gantry Campaign`,
        category: 'taxi',
        categoryLabel: 'Matatu & Taxi Drivers Gantry Billboard',
        imageSrc: '/campaign/taxi_park_billboard_ad.jpg',
        summary: 'Large-scale terminal gantry billboards across Old Taxi Park, Nairobi Bus Station, and regional commuter hubs, mobilizing commercial drivers to report highway washouts, blackspots, and extortion.',
        specs: 'Main Terminal Overhead Gantry Billboard + Windshield Livery · CivicDuty 3-Signal Branding',
        tagline: `MATATU & TAXI DRIVERS: HIGHWAY CORRIDOR WATCHDOGS · DIAL ${transitSpec.ussdCode}`,
        callToAction: `Dial ${transitSpec.ussdCode} Highway Toll-Free`,
        highlights: [
          'Overhead billboard positioned above bustling commuter taxi and matatu queues in full view of drivers',
          'Commercial drivers earn pre-funded fuel vouchers for logging dangerous highway defects',
          `Instant zero-data USSD ${transitSpec.ussdCode} works anywhere without data bundles`,
          'Connects to UNRA, KeNHA, and national traffic police desks',
        ],
      },
      {
        id: 'health-center-accountability',
        title: `${transitSpec.countryName} Healthcare Workers & Community Clinic Accountability Board`,
        category: 'health',
        categoryLabel: 'Healthcare Monitor Board',
        imageSrc: '/campaign/health_clinic_billboard_ad.jpg',
        summary: 'Wall-mounted outdoor accountability boards at public health centers and clinic triage gates, empowering health workers and patients to report drug stockouts, oxygen delays, and broken maternity equipment.',
        specs: 'Primary Healthcare Center Entrance Billboard & Pharmacy Signage',
        tagline: `HEALTHCARE WORKERS & PATIENTS: DEFEND YOUR CLINIC · DIAL ${transitSpec.ussdCode}`,
        callToAction: 'Explore Clinic Quality Board',
        highlights: [
          'Installed at community health centers and referral hospital outpatient gates',
          'Direct reporting channel to Ministry of Health and District Health Officers (DHO)',
          'Healthcare monitors eligible for pre-funded clinical wellness and data allocations',
        ],
      },
      {
        id: 'teacher-youth-watch',
        title: `${transitSpec.countryName} Teachers, Students & Youth Leaders Education Watchdog Poster`,
        category: 'teacher',
        categoryLabel: 'School & Youth Watch Billboard',
        imageSrc: '/campaign/school_youth_billboard_ad.jpg',
        summary: 'High-visibility community billboards placed at public school gates and university student hubs, engaging teachers, student leaders, and youth councils to report dilapidated classrooms and safety hazards.',
        specs: 'School Gate Bulletin Billboard & Student Council Noticeboard Branding',
        tagline: `TEACHERS & YOUTH SCOUTS: SAFE SCHOOL ZONES · DIAL ${transitSpec.ussdCode}`,
        callToAction: 'View School Zone Poster',
        highlights: [
          'Sensitizes youth leaders, teachers, and PTAs across primary and secondary school zones',
          'Direct citizen audit line to Ministry of Education and municipal school inspectors',
          'Top youth reporters earn pre-funded educational data bundles and library vouchers',
        ],
      },
      {
        id: 'artisan-builders-inspector',
        title: `${transitSpec.countryName} Artisans, Builders & Public Works Infrastructure Inspector Billboard`,
        category: 'artisan',
        categoryLabel: 'Artisans & Quality Inspector Signboard',
        imageSrc: '/campaign/artisan_construction_billboard_ad.jpg',
        summary: 'Reflective roadside construction billboards installed along ongoing road, drainage, and bridge sites, enlisting local masons, plumbers, electricians, and civil artisans as third-party workmanship inspectors.',
        specs: 'Active Worksite Billboard & Reflective Safety Signage',
        tagline: `ARTISANS & BUILDERS: WATCHDOG PUBLIC WORKS · DIAL ${transitSpec.ussdCode}`,
        callToAction: 'Inspect Public Works Signboard',
        highlights: [
          'Installed along active UNRA, KeNHA, and municipal construction corridors',
          'Mobilizes technical artisans to document concrete mix quality, asphalt thickness, and delayed culverts',
          'Direct link to Contractor Watchdog Vault for verified civil inspection bounties',
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
    ],
    [transitSpec]
  );

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'bodaboda' | 'bus' | 'train' | 'terminal' | 'billboard' | 'market' | 'taxi' | 'health' | 'teacher' | 'artisan' | 'strategy'
  >('all');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<CampaignMediaItem | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [activeScriptTab, setActiveScriptTab] = useState<'poster' | 'radio' | 'sacco' | 'specs'>('poster');
  const [showCadBlueprint, setShowCadBlueprint] = useState(false);

  const filteredMedia = selectedCategory === 'all' || selectedCategory === 'strategy'
    ? CAMPAIGN_MEDIA
    : CAMPAIGN_MEDIA.filter(item => item.category === selectedCategory);

  const activeMedia = filteredMedia[activeMediaIndex] || filteredMedia[0] || CAMPAIGN_MEDIA[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 flex flex-col transition-colors pb-20">
      {/* Main Campaign Showcase Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Top Studio Navigation & Campaign Hero Briefing Card */}
        <div className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36] flex-wrap">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => go('splash')}
                className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Return to Core Civic Platform"
              >
                <ArrowLeft size={13} />
                <span>Home</span>
              </button>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                    {transitSpec.countryName} Transit &amp; Railway Branding Proposals
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 font-mono font-semibold">
                    AUTO-ADAPTED ({transitSpec.countryCode})
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  {transitSpec.busPartnerName} · {transitSpec.trainOperatorName} · {transitSpec.stageTransportName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => go('feed')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-semibold font-mono uppercase transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Citizen Feed</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Megaphone size={13} />
                </div>
                <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">
                  COMMUNITY SENSITIZATION STRATEGY
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Branding Public Transit to Drive Civic Engagement
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                By wrapping <strong>{transitSpec.busPartnerName}</strong> buses and <strong>{transitSpec.trainOperatorName}</strong> commuter trains with CivicDuty branding, we meet citizens during their daily commutes. This mobile visibility educates communities on reporting municipal infrastructure defects and exercising their civic voice through <strong>{transitSpec.ussdCode}</strong> and the mobile platform.
              </p>
            </div>

            {/* Quick Impact Stats */}
            <div className="grid grid-cols-2 gap-2 sm:shrink-0 text-center">
              <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                <div className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">250K+</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono font-semibold">Daily Impressions</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                <div className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 font-mono">{transitSpec.ussdCode}</div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-mono font-semibold">Offline Dial Code</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          {[
            { key: 'all', label: 'All Posters', icon: Layers },
            { key: 'bus', label: 'Kayoola Buses', icon: Bus },
            { key: 'train', label: 'Passenger Train', icon: Train },
            { key: 'bodaboda', label: 'Bodaboda Stages', icon: Bike },
            { key: 'market', label: 'Market Vendors', icon: Store },
            { key: 'taxi', label: 'Taxi & Matatu', icon: Car },
            { key: 'health', label: 'Health Clinics', icon: Stethoscope },
            { key: 'teacher', label: 'Schools & Youth', icon: GraduationCap },
            { key: 'artisan', label: 'Public Works Artisans', icon: HardHat },
            { key: 'terminal', label: 'Fleet Terminal', icon: ShieldCheck },
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                    : 'bg-white dark:bg-[#161a22] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-600 dark:text-slate-400 border border-[#e3e6ea] dark:border-[#262b36]'
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
            {/* Primary Featured Image Display - Clean Unobstructed High-Resolution View */}
            <div className="rounded-xl overflow-hidden bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] relative group">
              <div className="aspect-video w-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <img
                  src={activeMedia.imageSrc}
                  alt={activeMedia.title}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/campaign/boda_stage_billboard_ad.jpg';
                  }}
                />

                {/* Minimal Top Badges & Quick Action Controls */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[9.5px] font-semibold uppercase font-mono">
                      {activeMedia.categoryLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white text-[9.5px] font-mono hidden sm:inline">
                      {activeMedia.specs}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={activeMedia.imageSrc}
                      download={`civicduty-${activeMedia.category}-campaign-poster.jpg`}
                      className="px-2.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md hover:bg-black text-white border border-white/20 transition-colors flex items-center gap-1.5 text-[11px] font-mono font-semibold cursor-pointer shadow-sm"
                      title="Download Poster Image for Social Media"
                    >
                      <Download size={12} />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                    <button
                      onClick={() => setLightboxItem(activeMedia)}
                      className="px-2.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md hover:bg-black text-white border border-white/20 transition-colors flex items-center gap-1.5 text-[11px] font-mono font-semibold cursor-pointer shadow-sm"
                      title="Expand to Fullscreen Lightbox"
                    >
                      <Maximize2 size={12} />
                      <span className="hidden sm:inline">Inspect Full-Res</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Title, Tagline, Third-Party Platform Transparency Bar & Description */}
              <div className="p-4 sm:p-5 bg-white dark:bg-[#161a22] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                      {activeMedia.title}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold font-mono pt-0.5">
                      {activeMedia.tagline}
                    </p>
                  </div>
                  <button
                    onClick={() => setLightboxItem(activeMedia)}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold font-mono uppercase self-start sm:self-center transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Eye size={13} />
                    <span>View High-Res Lightbox</span>
                  </button>
                </div>

                {/* Third-Party Platform Notice */}
                <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[10.5px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  <span>
                    <strong>Third-Party Oversight Notice:</strong> CivicDuty is an independent civic platform empowering citizen scouts and frontline workers to verify public service standards. We are not an owner or operator of public markets, clinics, or schools.
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeMedia.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeMedia.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Thumbnail Carousel / Grid */}
            <div className="space-y-2">
              <div className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 font-mono tracking-wider flex items-center gap-1.5">
                <Layers size={12} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
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
                          ? 'border-emerald-500 ring-2 ring-emerald-500/25'
                          : 'border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-video w-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                        <img
                          src={item.imageSrc}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/campaign/boda_stage_billboard_ad.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute bottom-1.5 left-2 right-2 text-[9.5px] font-semibold text-white truncate font-mono">
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

        {/* Vector CAD / Livery Blueprint Section - Expandable Engineering Specification */}
        <div className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-slate-900 dark:text-white font-mono">
                <FileCode size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Technical Vector Livery &amp; Paint CAD Blueprints</span>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                Automotive signwriting specifications, paint codes &amp; 1200×600 SVG vector blueprints
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/kayoola-transit-livery.svg"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-semibold font-mono uppercase flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink size={12} />
                <span>Direct Vector SVG</span>
              </a>
              <button
                type="button"
                onClick={() => setShowCadBlueprint(!showCadBlueprint)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-semibold font-mono uppercase transition cursor-pointer shadow-xs"
              >
                {showCadBlueprint ? 'Hide CAD Blueprints' : 'Inspect CAD Blueprints'}
              </button>
            </div>
          </div>

          {showCadBlueprint && (
            <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36]">
              <KayoolaBusGraphic />
            </div>
          )}
        </div>

        {/* Bodaboda Community Stage Poster & Market Launch Creative Suite */}
        <div id="bodaboda-creative-suite" className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bike size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold uppercase text-slate-900 dark:text-white tracking-tight font-mono">
                    Bodaboda Community Stage Poster &amp; Ad Script
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 font-mono font-semibold uppercase">
                    MARKET LAUNCH
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Transitioning into market: Official campaign script tailored to 1.5M+ Boda riders, stage noticeboards, and SACCOs
                </p>
              </div>
            </div>

            {/* Script Category Switcher */}
            <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#0e1116] p-1 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] self-start sm:self-auto overflow-x-auto">
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
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold font-mono transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                      isCurrent
                        ? 'bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-[#e3e6ea] dark:border-[#262b36] shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
            <div className="space-y-4">
              {/* Poster Layout Header & Visual Mockup Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-black relative group">
                  <img
                    src="/campaign/boda_poster_ad_1790426299023.jpg"
                    alt="Bodaboda Community Poster Mockup"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[9px] font-semibold font-mono">
                    Official Stage Poster Preview
                  </div>
                  <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-600 dark:text-slate-300">Format: A1 / A2 Stage Display</span>
                    <button
                      onClick={() => setLightboxItem(CAMPAIGN_MEDIA[0])}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Enlarge Mockup</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-3">
                  {/* Master Copy Box */}
                  <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                      <span className="text-[10px] font-semibold uppercase text-emerald-600 dark:text-emerald-400 font-mono tracking-wider flex items-center gap-1.5">
                        <FileText size={12} strokeWidth={1.75} /> Master Poster Headline &amp; Tagline
                      </span>
                      <button
                        onClick={() => {
                          const posterText = `CIVICDUTY BODABODA STAGE POSTER SCRIPT
HEADLINE (Luganda): BODA MAN: GWE BOSS W’OLUGUUDO!
HEADLINE (English): YOUR STAGE. YOUR ROAD. YOUR POWER. SPEAK DIRECTLY TO GOVERNMENT WITH ZERO INTERNET.
SUB-HEADLINE: Tokyakaaba Potholes oba Bribes mu Kifuba. Speak · Serve · Be Heard.`;
                          navigator.clipboard.writeText(posterText);
                          setCopiedScript('poster');
                          setTimeout(() => setCopiedScript(null), 2500);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] text-[9.5px] font-semibold font-mono flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedScript === 'poster' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                        <span>{copiedScript === 'poster' ? 'Copied Script!' : 'Copy Poster Script'}</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold uppercase">Main Street Headline (Luganda):</div>
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                        &ldquo;BODA MAN: GWE BOSS W’OLUGUUDO!&rdquo;
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        EDDOBOOZI LYOPPA TIBAKYALINYIRIRA.
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold uppercase">English Sub-Headline:</div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        YOUR STAGE. YOUR ROAD. YOUR POWER. Speak directly to Government with ZERO data.
                      </p>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 italic">
                        Tokyakaaba Potholes oba Bribes mu Kifuba. Funa Proof ku Simu Yo.
                      </p>
                    </div>
                  </div>

                  {/* The 3-Signal Loop Explanation tailored for Boda Riders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[10px] font-semibold uppercase font-mono">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>1. Red: Oyogera</span>
                      </div>
                      <div className="text-[10.5px] text-slate-900 dark:text-white font-semibold">Oguze Pothole?</div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Log suspension-busting potholes, open manholes, dark streetlights, or corrupt shakedowns.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[10px] font-semibold uppercase font-mono">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>2. Amber: Gavumenti</span>
                      </div>
                      <div className="text-[10.5px] text-slate-900 dark:text-white font-semibold">SLA Timer Etandika</div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        KCCA, UNRA &amp; Police receive instant dispatch. The public clock starts counting down.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase font-mono">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check size={7} strokeWidth={3} />
                        </span>
                        <span>3. Green: Proof</span>
                      </div>
                      <div className="text-[10.5px] text-emerald-700 dark:text-emerald-300 font-semibold">Oluguudo Lusibwa!</div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Pothole patched, proof photo uploaded to ledger. Stage earns fuel &amp; airtime perks.
                      </p>
                    </div>
                  </div>

                  {/* Direct Call To Action Callout */}
                  <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{transitSpec.ussdCode}</span>
                        <span>DIAL FOR FREE · ZERO DATA NEEDED</span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 dark:text-slate-400">
                        Compatible with all Smartphones &amp; Feature Phones.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => go('ussd')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10.5px] font-semibold transition-colors cursor-pointer"
                      >
                        Try {transitSpec.ussdCode} Simulator →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEGAPHONE & RADIO BROADCAST SCRIPT */}
          {activeScriptTab === 'radio' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                  <div className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
                    <Radio size={14} /> 45-Second Stage Megaphone &amp; FM Radio Sensitization Script
                  </div>
                  <button
                    onClick={() => {
                      const radioText = `[SOUND EFFECT: Motorcycle engine revving - Bajaj Boxer - followed by sudden loud tire screech and clunk into a pothole]
VOICEOVER: "Koona *3030# kati. CIVICDUTY: Speak, Serve, Be Heard!"`;
                      navigator.clipboard.writeText(radioText);
                      setCopiedScript('radio');
                      setTimeout(() => setCopiedScript(null), 2500);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] text-[9.5px] font-semibold font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedScript === 'radio' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    <span>{copiedScript === 'radio' ? 'Copied Audio Script!' : 'Copy Audio Script'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-2 border border-[#e3e6ea] dark:border-[#262b36]">
                  <p className="text-emerald-600 dark:text-emerald-400 italic">
                    [SFX: Motorcycle engine revving - Bajaj Boxer - followed by sudden tire screech and loud clunk hitting a pothole]
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">STAGE ANNOUNCER (Passionate, authentic street tone):</strong><br />
                    &ldquo;Boda boda riders! Banange mu Wandegeya, Usafi, Nakawa, Ntinda, Bwaise, Nansana, ne Mukono! Buli lunaku mufiirwa emitwalo mu kumenya rims, sipulinji, ne bribes ez&apos;ekifuba ku makubo! Naye ani awulira okulaajana kwammwe?&rdquo;
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 italic">
                    [SFX: Clean digital sovereign beacon chime — Green signal illuminates with tick mark]
                  </p>
                  <p>
                    &ldquo;Kati Gavumenti etadde obuyinza mu ngalo zammwe! Koona ku simu yo <strong>*3030#</strong> — kya bwereere, tewetaaga data oba smartphone eya bbeeyi! Ripoota ekinnya, etala ey&apos;omukubo eyasebesebe, oba roadblock etali mu mateeka. CIVICDUTY: Speak, Serve, Be Heard!&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STAGE SACCO MOBILISATION PROTOCOL */}
          {activeScriptTab === 'sacco' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                <div className="text-xs font-bold uppercase text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Stage Chairman &amp; SACCO Mobilisation Protocol</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  How stage leadership deploys CivicDuty to protect their riders, fast-track road repairs with division town clerks, and unlock fuel voucher allocations:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[10.5px]">Step 1: Stage Onboarding &amp; Code</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Stage Chairman registers stage via *3030# or platform admin. The stage is assigned a unique verification code (e.g. <code>WAND-STAGE-04</code>).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <div className="text-amber-600 dark:text-amber-400 font-semibold font-mono text-[10.5px]">Step 2: Collective Hazard Verification</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      When multiple riders from the same stage upvote or confirm a road hazard, its priority score elevates to Grade 1 emergency dispatch for municipal engineers.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <div className="text-sky-600 dark:text-sky-400 font-semibold font-mono text-[10.5px]">Step 3: Anti-Extortion Shield</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Unlawful spot-fines or illegal bike confiscations reported on *3030# trigger instant alerts to Police Professional Standards Unit (PSU) and Division DPC.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[10.5px]">Step 4: Verified Fuel &amp; Airtime Perks</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Riders whose hazard reports lead to certified municipal repairs earn verified Civic Karma, redeemable at partner petrol stations for fuel and airtime bundles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRINT MEDIA SPECIFICATIONS */}
          {activeScriptTab === 'specs' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                <div className="text-xs font-bold uppercase text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                  <Printer size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Physical Print &amp; Mounting Specifications for Boda Stages</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                    <div className="text-[9px] text-slate-500 uppercase">Substrate</div>
                    <div className="text-slate-900 dark:text-white font-bold">Polypropylene Synthetic</div>
                    <p className="text-[10px] text-slate-500 normal-case">100% waterproof, tear-proof, UV-resistant outdoors</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                    <div className="text-[9px] text-slate-500 uppercase">Standard Sizes</div>
                    <div className="text-slate-900 dark:text-white font-bold">A1 (594×841mm) &amp; A2</div>
                    <p className="text-[10px] text-slate-500 normal-case">Optimized for stage umbrellas, timber boards, wall mounts</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                    <div className="text-[9px] text-slate-500 uppercase">Ink Technology</div>
                    <div className="text-slate-900 dark:text-white font-bold">Latex UV Curable</div>
                    <p className="text-[10px] text-slate-500 normal-case">Fade-resistant under harsh tropical equatorial sunlight</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                    <div className="text-[9px] text-slate-500 uppercase">QR Code Spec</div>
                    <div className="text-slate-900 dark:text-white font-bold">High Error Correction (H)</div>
                    <p className="text-[10px] text-slate-500 normal-case">Scannable even if dust or rain partially covers 30% of code</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Community Sensitization Strategy Blueprint */}
        <div className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-900 dark:text-white tracking-tight font-mono">
                Strategic Rationale: Why Transit Fleet Branding Drives Citizen Action
              </h3>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                The psychological and practical mechanics of community sensitization on public transport
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px] font-mono">
                1. High Dwell Time &amp; Repetition
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Daily commuters spend an average of <strong>45 to 80 minutes</strong> in transit. Constant exposure to the 3-Signal Beacon turns passive travel time into an education opportunity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px] font-mono">
                2. Dual Digital Gateway ({transitSpec.ussdCode} &amp; App)
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Every vehicle prominently highlights <strong>{transitSpec.ussdCode}</strong>. A commuter without mobile data or using a basic feature phone can dial the USSD code immediately while looking at the bus wrap.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="text-sky-600 dark:text-sky-400 font-bold uppercase text-[10px] font-mono">
                3. State &amp; Municipal Legitimacy
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Co-branding with <strong>{transitSpec.municipalAuthority}</strong> assures citizens that reports logged on CivicDuty are legally recognized and prioritized by municipal engineers.
              </p>
            </div>
          </div>

          {/* Rollout Corridors */}
          <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
            <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 font-mono">
              Target Phase 1 Transit Corridors ({transitSpec.countryName})
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Bus size={12} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                <span>Bus Corridors: {transitSpec.busRoutes}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Train size={12} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                <span>Commuter Rail: {transitSpec.trainCorridors}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Exit to Citizen Core */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">Ready to experience CivicDuty?</div>
            <div className="text-[10.5px] text-slate-500 dark:text-slate-400">Return to the sovereign citizen feed or report an infrastructure issue.</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => go('splash')}
              className="px-3.5 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 text-xs font-semibold font-mono transition-colors cursor-pointer"
            >
              ← Splash Portal
            </button>
            <button
              onClick={() => go('feed')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold font-mono uppercase transition-colors cursor-pointer"
            >
              Open Citizen Feed →
            </button>
          </div>
        </div>
      </main>

      {/* Fullscreen Lightbox Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-4xl w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">{lightboxItem.title}</span>
                <span className="ml-2 text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 font-mono font-semibold">
                  {lightboxItem.categoryLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxItem.imageSrc}
                  download={`civicduty-${lightboxItem.category}-campaign-poster.jpg`}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="p-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Modal Image */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden relative">
              <img
                src={lightboxItem.imageSrc}
                alt={lightboxItem.title}
                className="max-h-[60vh] w-auto object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/campaign/boda_stage_billboard_ad.jpg';
                }}
              />
            </div>

            {/* Modal Footer Specs */}
            <div className="p-4 bg-white dark:bg-[#161a22] border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  {lightboxItem.tagline}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Specs: {lightboxItem.specs}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {lightboxItem.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
