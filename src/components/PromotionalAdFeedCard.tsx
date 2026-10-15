import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CdOpsPromotionalAd } from '../types';
import { getCountryPromotionalAds, getCountryTransitSpecs } from '../data/promotionalAds';
import { TrafficLightLogo } from './TrafficLightLogo';
import { KayoolaBusGraphic, GraphicVehicleType } from './KayoolaBusGraphic';
import {
  Bus,
  Train,
  Bike,
  Store,
  Car,
  Stethoscope,
  GraduationCap,
  HardHat,
  ExternalLink,
  Gift,
  CheckCircle2,
  X,
  Share2,
  Check,
  ChevronRight,
  Paintbrush,
  Info,
  Download,
  Image as ImageIcon,
  Sparkles,
  Copy,
  Maximize2,
  ShieldCheck,
} from 'lucide-react';

interface PromotionalAdFeedCardProps {
  ad: CdOpsPromotionalAd;
  defaultIndex?: number;
  campaignMode?: 'transit_painting' | 'frontline_scouts';
  isFocused?: boolean;
  onActivateFocus?: () => void;
}

export const PromotionalAdFeedCard: React.FC<PromotionalAdFeedCardProps> = ({
  ad,
  defaultIndex,
  campaignMode,
  isFocused = true,
  onActivateFocus,
}) => {
  const { user, ensureCitizenSession, selectedCountry, go, toast, recordAdClick } = useApp();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [cardDisplayMode, setCardDisplayMode] = useState<'poster' | 'cad'>('poster');
  const [modalTab, setModalTab] = useState<'poster' | 'cad' | 'social'>('poster');
  const [copied, setCopied] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);

  const activeUser = user || ensureCitizenSession();
  const countryCode = selectedCountry || activeUser.country || 'UG';
  const countryAds = getCountryPromotionalAds(countryCode);
  const transitSpec = getCountryTransitSpecs(countryCode);

  // Determine which of the two distinct card modes this instance represents:
  // 1) 'transit_painting': Strictly Kayoola Bus & Train painting proposal
  // 2) 'frontline_scouts': Directed towards Frontline Scouts (Bodaboda, Market, Taxi, Health, Youth, Artisans)
  const resolvedMode: 'transit_painting' | 'frontline_scouts' =
    campaignMode ||
    (defaultIndex !== undefined && defaultIndex >= 2
      ? 'frontline_scouts'
      : ad.category === 'bodaboda' ||
        ad.category === 'market' ||
        ad.category === 'taxi' ||
        ad.category === 'health' ||
        ad.category === 'teacher' ||
        ad.category === 'artisan'
      ? 'frontline_scouts'
      : 'transit_painting');

  // Within Card 1 ('transit_painting'), indices are 0 (Kayoola Bus) or 1 (Commuter Train)
  // Within Card 2 ('frontline_scouts'), indices are 2 (Bodaboda Stage) to 7 (Artisans)
  const initialIdx =
    resolvedMode === 'transit_painting'
      ? defaultIndex === 1 || ad.category === 'train'
        ? 1
        : 0
      : defaultIndex !== undefined && defaultIndex >= 2
      ? defaultIndex
      : ad.category === 'market'
      ? 3
      : ad.category === 'taxi'
      ? 4
      : ad.category === 'health'
      ? 5
      : ad.category === 'teacher'
      ? 6
      : ad.category === 'artisan'
      ? 7
      : 2;

  const [selectedPillarIdx, setSelectedPillarIdx] = useState<number>(initialIdx);
  const activeAd = countryAds[selectedPillarIdx] || ad;

  const activeVehicleType: GraphicVehicleType =
    selectedPillarIdx === 0
      ? 'bus'
      : selectedPillarIdx === 1
      ? 'train'
      : selectedPillarIdx === 2
      ? 'bodaboda'
      : selectedPillarIdx === 3
      ? 'market'
      : selectedPillarIdx === 4
      ? 'taxi'
      : selectedPillarIdx === 5
      ? 'health'
      : selectedPillarIdx === 6
      ? 'teacher'
      : 'artisan';

  // Fallback map to guarantee image availability
  const POSTER_IMAGE_MAP: Record<number, string> = {
    0: '/campaign/kayoola_kampala_street_ad.jpg',
    1: '/campaign/train_moving_billboard_kampala.jpg',
    2: '/campaign/boda_stage_billboard_ad.jpg',
    3: '/campaign/market_vendors_billboard_ad.jpg',
    4: '/campaign/taxi_park_billboard_ad.jpg',
    5: '/campaign/health_clinic_billboard_ad.jpg',
    6: '/campaign/school_youth_billboard_ad.jpg',
    7: '/campaign/artisan_construction_billboard_ad.jpg',
  };

  const effectiveImageSrc =
    activeAd.imageSrc || activeAd.realLifePosterSrc || POSTER_IMAGE_MAP[selectedPillarIdx] || '/campaign/boda_stage_billboard_ad.jpg';

  const handlePrimaryAction = () => {
    recordAdClick(activeAd.id);
    if (resolvedMode === 'frontline_scouts') {
      go('perk_vault');
      toast('Opening Frontline Scout & Profession Bounty Vault...', 'emerald');
    } else {
      go('transit_preview');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(
      `${activeAd.title} — ${activeAd.tagline}. Dial ${transitSpec.ussdCode} or visit CivicDuty: https://civicduty.site`
    );
    setCopied(true);
    toast('Copied campaign link to clipboard', 'emerald');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPoster = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const link = document.createElement('a');
    link.href = effectiveImageSrc;
    link.download = `civicduty-${activeVehicleType}-${transitSpec.countryCode.toLowerCase()}-campaign-poster.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Downloaded campaign poster image for social media!', 'emerald');
  };

  const getSocialShareText = () => {
    const ussd = transitSpec.ussdCode;
    const country = transitSpec.countryName;
    const web = 'https://civicduty.site';
    const hashtags = `#CivicDuty #SpeakServeBeHeard #${country.replace(/\s+/g, '')} #PublicAccountability #ZeroData`;

    switch (activeVehicleType) {
      case 'bus':
        return `🚨 TRANSIT PARTNERSHIP BLUEPRINT: CivicDuty × ${transitSpec.busPartnerName}!\n\nWe are funding & executing the official 3-Signal exterior painting of ${country}’s Kayoola electric bus fleet.\n\n🚌 Zero-data USSD ${ussd} empowers millions of daily commuters to report potholes, non-functional streetlights & municipal defects straight to authorities.\n\n👉 Inspect proposal: ${web}\n\n${hashtags} #KayoolaEVS #KiiraMotors`;
      case 'train':
        return `🚂 MOVING BILLBOARD FOR CITIZEN EMPOWERMENT: CivicDuty × ${transitSpec.trainOperatorName}!\n\nCivicDuty proposes sandblasting and freshly painting commuter passenger trains across ${transitSpec.trainCorridors}.\n\nTurning everyday rail corridors into panoramic civic accountability billboards visible at every level crossing!\n\n📲 Dial ${ussd} (100% FREE on any basic phone)\n👉 Visit: ${web}\n\n${hashtags} #RailTransit #MovingBillboard`;
      case 'bodaboda':
        return `🛵 BODA MAN: GWE BOSS W’OLUGUUDO! (Frontline Road Safety Scouts)\n\nBodaboda riders navigate every single corner of ${country}. Through CivicDuty, stages and riders report potholes, open manholes & road hazards.\n\n🎁 Top 3 Frontline Scouts in each stage receive monthly fuel & mobile data bounties!\n\n📲 DIAL ${ussd} (FREE · Works on any basic phone without bundles)\n👉 Join: ${web}\n\n${hashtags} #BodabodaScouts #RoadSafety`;
      case 'market':
        return `🏪 MARKET VENDORS & TRADERS: DEFEND YOUR MARKET!\n\nFrom Nakasero to Owino, Kalerwe & city markets across ${country}, vendors can now report blocked drains, uncollected garbage, water outages & unfair market dues in 30 seconds.\n\n🏆 Top-ranked market traders receive monthly grocery & utility bounties!\n\n📲 Dial ${ussd} (100% FREE)\n👉 ${web}\n\n${hashtags} #MarketVendors #CleanCities`;
      case 'taxi':
        return `🚐 TAXI & MATATU DRIVERS: HIGHWAY CORRIDOR WATCHDOGS!\n\nCommercial taxi drivers and matatu crews are the heartbeat of ${country}’s transport arteries. Log highway washouts, illegal extortion checkpoints & dangerous blackspots.\n\n⛽ Top-ranking drivers earn monthly highway transit fuel vouchers!\n\n📲 Dial ${ussd} FREE\n👉 ${web}\n\n${hashtags} #MatatuSacco #TaxiDrivers #HighwaySafety`;
      case 'health':
        return `🏥 HEALTHCARE MONITORS & PATIENTS: DEFEND YOUR CLINIC!\n\nCommunity health centers deserve continuous support. Healthcare workers and patients can now track essential medicine stockouts, triage equipment & maternity ward oxygen in real-time.\n\n💊 Health monitors receive clinical data & wellness vouchers!\n\n📲 Dial ${ussd} FREE\n👉 ${web}\n\n${hashtags} #PublicHealth #HealthMonitors #MinistryOfHealth`;
      case 'teacher':
        return `🎓 TEACHERS, STUDENTS & YOUTH SCOUTS: SAFE SCHOOL ZONES!\n\nYouth leaders and teachers are guarding our educational centers. Report dilapidated classrooms, missing desks, child crossing hazards & library needs.\n\n📚 Youth scouts receive monthly educational data bundles & stationery credits!\n\n📲 Dial ${ussd} FREE\n👉 ${web}\n\n${hashtags} #EducationWatch #YouthLeaders #SafeSchools`;
      case 'artisan':
        return `🏗️ ARTISANS, BUILDERS & TECHNICIANS: AUDIT PUBLIC WORKS!\n\nCalling all masons, civil technicians, plumbers & electricians! Audit substandard asphalt, unvibrated bridge concrete & delayed road culverts on public contracts.\n\n🛠️ Top workmanship inspectors earn contractor CSR tool bounties!\n\n📲 Dial ${ussd} FREE\n👉 ${web}\n\n${hashtags} #InfrastructureWatch #PublicWorks #CivilArtisans`;
    }
  };

  const handleCopySocial = () => {
    navigator.clipboard?.writeText(getSocialShareText());
    setCopiedSocial(true);
    toast('Copied ready-to-post social media copy!', 'emerald');
    setTimeout(() => setCopiedSocial(false), 2200);
  };

  return (
    <>
      <div
        onMouseEnter={onActivateFocus}
        onTouchStart={onActivateFocus}
        onClick={onActivateFocus}
        className={`p-3 sm:p-3.5 bg-white dark:bg-[#12161f] rounded-2xl border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-slate-100 space-y-2.5 transition-all duration-300 ${
          isFocused
            ? 'opacity-100 scale-100 shadow-md ring-1 ring-emerald-500/25'
            : 'opacity-40 saturate-50 scale-[0.99] hover:opacity-80'
        }`}
      >
        {/* Minimal Compact Header + Multi-Category Switcher Strictly Scoped to Card Objective */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <TrafficLightLogo size={16} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 truncate">
              {resolvedMode === 'transit_painting'
                ? '1. Transit Fleet Painting Proposal'
                : '2. Frontline Scouts Campaign'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#0e1116] p-0.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
            {resolvedMode === 'transit_painting' ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPillarIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedPillarIdx === 0
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bus size={11} />
                  <span>{countryCode === 'UG' ? 'Kayoola Bus' : 'Bus Fleet'}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPillarIdx(1);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedPillarIdx === 1
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Train size={11} />
                  <span>Commuter Train</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-[420px] scrollbar-none py-0.5">
                {[
                  { idx: 2, label: 'Bodaboda', icon: Bike },
                  { idx: 3, label: 'Market', icon: Store },
                  { idx: 4, label: 'Drivers', icon: Car },
                  { idx: 5, label: 'Health', icon: Stethoscope },
                  { idx: 6, label: 'Youth', icon: GraduationCap },
                  { idx: 7, label: 'Artisans', icon: HardHat },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  const isItemActive = selectedPillarIdx === item.idx;
                  return (
                    <button
                      key={item.idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPillarIdx(item.idx);
                      }}
                      className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 whitespace-nowrap transition-colors cursor-pointer ${
                        isItemActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <ItemIcon size={11} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Photographic Campaign Poster Presentation - Pure, Uncluttered, Pristine */}
        <div
          onClick={() => setDetailsModalOpen(true)}
          className="rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-[#0e1116] cursor-pointer group relative"
        >
          <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            <img
              src={effectiveImageSrc}
              alt={activeAd.title}
              className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 select-none"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/campaign/boda_stage_billboard_ad.jpg';
              }}
            />
            {/* Minimal Unobtrusive Zoom Hint on Hover */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleDownloadPoster}
                className="p-1.5 rounded-lg bg-black/75 hover:bg-black text-white border border-white/20 transition-colors shadow-sm"
                title="Download Poster Image for Social Media"
              >
                <Download size={12} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDetailsModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-[10.5px] font-mono font-semibold flex items-center gap-1 border border-white/20 transition-colors shadow-sm"
                title="View Full Resolution Poster"
              >
                <Maximize2 size={12} />
                <span className="hidden sm:inline">Inspect Poster</span>
              </button>
            </div>
          </div>
        </div>

        {/* Third-Party Platform Transparency Notice */}
        <div className="px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 min-w-0">
            <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
            <span className="truncate">
              <strong>Third-Party Civic Platform:</strong> Enabling frontline scouts to verify public service standards.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 font-bold shrink-0 border border-emerald-500/20">
            DIAL {transitSpec.ussdCode}
          </span>
        </div>

        {/* Title, Tagline & Action Row */}
        <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {activeAd.title}
            </h4>
            <p className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold truncate">
              {activeAd.tagline}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadPoster}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] transition-colors cursor-pointer"
              title="Download Poster for Social Media"
            >
              <Download size={12} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] transition-colors cursor-pointer"
              title="Share"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDetailsModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info size={12} />
              <span>
                {resolvedMode === 'transit_painting'
                  ? 'Fleet Painting Proposal'
                  : 'Campaign Poster & Stage Info'}
              </span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* On-Demand Details Modal */}
      {detailsModalOpen && (
        <div
          onClick={() => setDetailsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center gap-2.5">
                <TrafficLightLogo size={24} />
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
                    {resolvedMode === 'transit_painting'
                      ? 'Official Fleet Painting & Livery Proposal'
                      : 'Frontline Scouts Outdoor Campaign Posters'}{' '}
                    · {transitSpec.countryName}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {activeAd.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal View Tabs: Photo Poster vs CAD Blueprint vs Social Caption */}
            <div className="flex items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setModalTab('poster')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    modalTab === 'poster'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ImageIcon size={12} />
                  <span>Real Photographic Poster</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('cad')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    modalTab === 'cad'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {resolvedMode === 'transit_painting' ? (
                    <>
                      <Paintbrush size={12} />
                      <span>CAD Livery Schematic</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={12} />
                      <span>Stage Consensus &amp; Workstations</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('social')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    modalTab === 'social'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Share2 size={12} />
                  <span>Social Media Copy</span>
                </button>
              </div>

              {modalTab === 'poster' && (
                <button
                  type="button"
                  onClick={handleDownloadPoster}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold transition cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download Poster (.jpg)</span>
                </button>
              )}
            </div>

            {/* Tab 1: High-Resolution Photographic Campaign Poster - Zero Obstructing Overlays */}
            {modalTab === 'poster' && (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-slate-950 aspect-video flex items-center justify-center">
                  <img
                    src={effectiveImageSrc}
                    alt={activeAd.title}
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/campaign/boda_stage_billboard_ad.jpg';
                    }}
                  />
                </div>

                {/* Poster Caption and Details placed cleanly beneath the art */}
                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeAd.title}
                    </h4>
                    <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold pt-0.5">
                      {activeAd.tagline}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 pt-1">
                      Third-Party Civic Technology Platform · Toll-Free USSD {transitSpec.ussdCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={handleCopySocial}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-bold text-slate-700 dark:text-slate-300 hover:border-emerald-500 cursor-pointer"
                    >
                      {copiedSocial ? 'Copied!' : 'Copy Caption'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPoster}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download size={12} />
                      <span>Download Poster</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Interactive SVG Pictorial Specification OR Frontline Stage Consensus Hub */}
            {modalTab === 'cad' && (
              resolvedMode === 'transit_painting' ? (
                <KayoolaBusGraphic
                  showControls={true}
                  vehicleType={activeVehicleType}
                  countryCode={countryCode}
                />
              ) : (
                <div className="p-4 sm:p-5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Bike size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Frontline Scout Workstation Stage Establishment
                        </h4>
                        <p className="text-xs font-mono text-slate-500">
                          Civic consensus rule: &gt;15 self-identified scouts capturing GPS within 2km and matching name auto-certifies the stage hub.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400">1. Stage Consensus</div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        When 15+ frontline scouts submit verified GPS coordinates within 2km, the system auto-compiles and promotes it to a Certified Community Hub.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400">2. Home Parish Lock</div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Workstations are anchored to the local Parish / Ward jurisdiction, ensuring community ownership and legitimate grassroots audits.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                      <div className="font-bold text-emerald-700 dark:text-emerald-400">3. Patron Sponsoring</div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Diaspora and local patrons can sponsor a stage vault directly, rewarding the Top 3 frontline scouts each month.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
                    <button
                      type="button"
                      onClick={() => {
                        setDetailsModalOpen(false);
                        go('perk_vault');
                        toast('Opening Frontline Scout Workstation Stages Directory...', 'emerald');
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <ShieldCheck size={13} />
                      <span>Explore Certified Stages Directory in Vault</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDetailsModalOpen(false);
                        go('compose');
                        toast('Opening Frontline Scout Report Compose...', 'emerald');
                      }}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer"
                    >
                      <Bike size={13} className="text-emerald-600" />
                      <span>Report as Frontline Scout with GPS</span>
                    </button>
                  </div>
                </div>
              )
            )}

            {/* Tab 3: Social Media Copy Ready to Copy & Post */}
            {modalTab === 'social' && (
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    Ready-to-Post Social Media Caption (X, LinkedIn, WhatsApp &amp; Facebook)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySocial}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedSocial ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedSocial ? 'Copied to Clipboard!' : 'Copy Post Text'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] font-sans text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                  {getSocialShareText()}
                </pre>
                <div className="flex items-center justify-between gap-2 pt-2 text-[10.5px] font-mono text-slate-500">
                  <span>Includes live USSD code ({transitSpec.ussdCode}), verified link, and targeted hashtags.</span>
                  <button
                    type="button"
                    onClick={handleDownloadPoster}
                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    Download accompanying poster image
                  </button>
                </div>
              </div>
            )}

            {/* Proposal / Campaign Objectives & Highlights */}
            <div className="space-y-2.5 text-xs">
              <div className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                {activeAd.tagline}
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{activeAd.summary}</p>

              <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5 text-[11px]">
                {activeAd.highlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{hl}</span>
                  </div>
                ))}
              </div>

              {activeAd.specs && (
                <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] font-mono text-[10.5px] text-slate-600 dark:text-slate-400">
                  Technical Specification: {activeAd.specs}
                </div>
              )}
            </div>

            {/* Modal Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500">
                Partner / Target Audience:{' '}
                {selectedPillarIdx === 0
                  ? transitSpec.busPartnerName
                  : selectedPillarIdx === 1
                  ? transitSpec.trainOperatorName
                  : selectedPillarIdx === 2
                  ? transitSpec.stageTransportName
                  : selectedPillarIdx === 3
                  ? 'Urban Market Vendors & Traders Associations'
                  : selectedPillarIdx === 4
                  ? 'Commercial Taxi SACCOs & Highway Fleets'
                  : selectedPillarIdx === 5
                  ? 'Public Health Centers & Community Hospitals'
                  : selectedPillarIdx === 6
                  ? 'School Zones, Youth Councils & Teachers'
                  : 'Civil Infrastructure & Public Works Technicians'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetailsModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handlePrimaryAction();
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {resolvedMode === 'transit_painting' ? <Paintbrush size={13} /> : <Gift size={13} />}
                  <span>
                    {resolvedMode === 'transit_painting'
                      ? 'Open Full Fleet Livery Studio'
                      : 'Open Frontline Scout Bounty Vault'}
                  </span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
