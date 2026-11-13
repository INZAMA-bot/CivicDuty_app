import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CdOpsPromotionalAd } from '../types';
import { getCountryPromotionalAds, getCountryTransitSpecs } from '../data/promotionalAds';
import { TrafficLightLogo } from './TrafficLightLogo';
import { KayoolaBusGraphic, GraphicVehicleType } from './KayoolaBusGraphic';
import { CampaignSharePanel } from './CampaignSharePanel';
import { buildUniversalShareMetadata, triggerUniversalWebShare } from '../utils/universalShare';
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
  const [sharedFeedback, setSharedFeedback] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState(false);

  const activeUser = user || ensureCitizenSession();
  const countryCode = selectedCountry || activeUser.country || 'UG';
  const countryAds = getCountryPromotionalAds(countryCode);
  const transitSpec = getCountryTransitSpecs(countryCode);

  // Determine which of the two distinct card modes this instance represents:
  // 1) 'transit_painting': Strictly Kayoola Bus & Train painting proposal (Uganda ONLY)
  // 2) 'frontline_scouts': Directed towards Frontline Scouts (Bodaboda, Market, Taxi, Health, Youth, Artisans)
  const isUganda = countryCode === 'UG';
  const resolvedMode: 'transit_painting' | 'frontline_scouts' =
    !isUganda
      ? 'frontline_scouts'
      : campaignMode ||
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

  useEffect(() => {
    setSelectedPillarIdx(initialIdx);
  }, [countryCode, resolvedMode, initialIdx]);

  const activeAd = countryAds[selectedPillarIdx] || countryAds[initialIdx] || ad;

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

  // Region-isolated fallback map to guarantee zero Uganda imagery outside UG
  const POSTER_IMAGE_MAP: Record<number, string> = {
    0: transitSpec.busPosterSrc,
    1: transitSpec.trainPosterSrc,
    2: transitSpec.scoutPosterSrc,
    3: transitSpec.marketPosterSrc,
    4: transitSpec.taxiPosterSrc,
    5: transitSpec.healthPosterSrc,
    6: transitSpec.teacherPosterSrc,
    7: transitSpec.artisanPosterSrc,
  };

  const effectiveImageSrc =
    activeAd.imageSrc || activeAd.realLifePosterSrc || POSTER_IMAGE_MAP[selectedPillarIdx] || transitSpec.scoutPosterSrc;

  const handlePrimaryAction = () => {
    recordAdClick(activeAd.id);
    if (resolvedMode === 'frontline_scouts') {
      go('perk_vault');
      toast('Opening Frontline Scout & Profession Bounty Vault...', 'emerald');
    } else {
      go('transit_preview');
    }
  };

  const handleOpenSocialAdsModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordAdClick(activeAd.id);
    setModalTab('social');
    setDetailsModalOpen(true);
  };

  const handleUniversalShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSharing) return;
    recordAdClick(activeAd.id);
    setIsSharing(true);

    try {
      const shareMetadata = buildUniversalShareMetadata({
        ad: activeAd,
        transitSpec,
        pillarKey: activeVehicleType,
        socialPostText: getSocialShareText(),
        imageSrc: effectiveImageSrc,
      });

      const outcome = await triggerUniversalWebShare(shareMetadata);
      if (outcome === 'shared' || outcome === 'shared_with_media') {
        setSharedFeedback(true);
        toast(
          outcome === 'shared_with_media'
            ? 'Campaign poster & link shared via native share sheet!'
            : 'Campaign shared via native share sheet!',
          'emerald'
        );
        setTimeout(() => setSharedFeedback(false), 2200);
      } else if (outcome === 'fallback') {
        toast('Campaign copy ready — choose Social Platform or Google Ads Pack.', 'emerald');
        setModalTab('social');
        setDetailsModalOpen(true);
      }
    } finally {
      setIsSharing(false);
    }
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
    const hashtags = `#CivicDuty #SpeakServeBeHeard #${country.replace(/\s+/g, '')} #PublicAccountability #FrontlineScouts`;

    switch (activeVehicleType) {
      case 'bus':
        return isUganda
          ? `🚨 TRANSIT PARTNERSHIP BLUEPRINT: CivicDuty × ${transitSpec.busPartnerName}!\n\nWe are funding & executing the official 3-Signal exterior painting of ${country}’s Kayoola electric bus fleet.\n\n🚌 Zero-data USSD ${ussd} empowers millions of daily commuters to report potholes, non-functional streetlights & municipal defects straight to authorities.\n\n👉 Inspect proposal: ${web}\n\n${hashtags} #KayoolaEVS #KiiraMotors`
          : `🚨 TRANSIT PARTNERSHIP BLUEPRINT: CivicDuty × ${transitSpec.busPartnerName}!\n\nCivicDuty proposes high-visibility 3-Signal civic fleet branding across ${country} (${transitSpec.busRoutes}).\n\n🚌 Access via ${ussd} or ${web} empowers daily commuters to report road hazards, outages & municipal defects directly to ${transitSpec.municipalAuthority}.\n\n👉 Inspect proposal: ${web}\n\n${hashtags} #SmartCities`;
      case 'train':
        return `🚂 MOVING BILLBOARD FOR CITIZEN EMPOWERMENT: CivicDuty × ${transitSpec.trainOperatorName}!\n\nCivicDuty proposes 3-Signal commuter rail carriage and station concourse displays across ${transitSpec.trainCorridors}.\n\nTurning everyday rail corridors into panoramic civic accountability displays visible at every station!\n\n📲 Access: ${ussd} · 👉 Visit: ${web}\n\n${hashtags} #RailTransit #MovingBillboard`;
      case 'bodaboda':
        return isUganda
          ? `🛵 BODA MAN: GWE BOSS W’OLUGUUDO! (Frontline Road Safety Scouts)\n\nBodaboda riders navigate every single corner of ${country}. Through CivicDuty, stages and riders report potholes, open manholes & road hazards.\n\n🎁 Top 3 Frontline Scouts in each stage receive monthly fuel & mobile data bounties!\n\n📲 DIAL ${ussd} (FREE · Works on any basic phone without bundles)\n👉 Join: ${web}\n\n${hashtags} #BodabodaScouts #RoadSafety`
          : `🚲🛵 ${transitSpec.localSlogan}\n\n${transitSpec.stageTransportName} navigate every street across ${country}. Through CivicDuty Frontline Scouts, riders, couriers, and neighbors log potholes, lighting failures, and service hazards in 30 seconds.\n\n🎁 Verified Frontline Scouts build civic standing & partner utility bounties!\n\n📲 Access via ${ussd} or ${web}\n\n${hashtags} #RoadSafety`;
      case 'market':
        return `🏪 ${transitSpec.marketTabLabel.toUpperCase()} & TRADERS: DEFEND YOUR MARKETPLACE!\n\nAcross ${transitSpec.marketHeadlinePlaces} in ${country}, vendors and citizens can now report blocked drains, uncollected waste, water outages & facility defects in 30 seconds.\n\n🏆 Verified market monitors strengthen public accountability!\n\n📲 Access: ${ussd} · 👉 ${web}\n\n${hashtags} #MarketVendors #CleanCities`;
      case 'taxi':
        return `🚕🚐 ${transitSpec.taxiHeadlineLabel.toUpperCase()} (${country.toUpperCase()})!\n\n${transitSpec.taxiTabLabel} drivers keep ${country} moving every day. Log road washouts, dangerous traffic blackspots & transit delays straight to ${transitSpec.municipalAuthority}.\n\n📲 Access: ${ussd} · 👉 ${web}\n\n${hashtags} #TransitSafety #HighwayWatch`;
      case 'health':
        return `🏥 HEALTHCARE MONITORS & PATIENTS: DEFEND YOUR CLINIC!\n\nCommunity clinics in ${country} deserve continuous accountability. Healthcare workers and patients can track supply shortages, triage equipment & power outages in real time.\n\n📲 Access: ${ussd} · 👉 ${web}\n\n${hashtags} #PublicHealth #HealthMonitors`;
      case 'teacher':
        return `🎓 TEACHERS, STUDENTS & YOUTH SCOUTS: SAFE SCHOOL ZONES!\n\nEducators, student leaders & parents across ${country} are guarding school neighborhoods. Report broken classrooms, crosswalk hazards & safety needs.\n\n📲 Access: ${ussd} · 👉 ${web}\n\n${hashtags} #EducationWatch #SafeSchools`;
      case 'artisan':
        return `🏗️ ARTISANS, ENGINEERS & BUILDERS: AUDIT PUBLIC WORKS!\n\nMasons, civil technicians, plumbers & electricians across ${country} can document substandard asphalt, delayed culverts & infrastructure quality on public contracts.\n\n📲 Access: ${ussd} · 👉 ${web}\n\n${hashtags} #InfrastructureWatch #PublicWorks`;
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
        {/* Header + CAD/Photo View Switcher */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <TrafficLightLogo size="sm" />
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 truncate">
                {resolvedMode === 'transit_painting'
                  ? '1. Transit Fleet Painting Proposal'
                  : '2. Frontline Scouts Campaign'}
              </span>
            </div>

            {/* View Mode Toggle: Live CAD Livery vs Street Billboard */}
            <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#0e1116] p-0.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardDisplayMode('cad');
                }}
                className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-semibold transition-colors cursor-pointer ${
                  cardDisplayMode === 'cad'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Livery CAD
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCardDisplayMode('poster');
                }}
                className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-semibold transition-colors cursor-pointer ${
                  cardDisplayMode === 'poster'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Street Photo
              </button>
            </div>
          </div>

          {/* Full-Width Unclipped Category Switcher Tabs */}
          <div className="w-full overflow-x-auto scrollbar-none bg-[#f8f9fa] dark:bg-[#0e1116] p-1 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-1">
            {resolvedMode === 'transit_painting' ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPillarIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
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
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
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
              [
                {
                  idx: 2,
                  label: transitSpec.scoutTabLabel,
                  icon: Bike,
                },
                {
                  idx: 3,
                  label: transitSpec.marketTabLabel,
                  icon: Store,
                },
                {
                  idx: 4,
                  label: transitSpec.taxiTabLabel,
                  icon: Car,
                },
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
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isItemActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <ItemIcon size={11} />
                    <span>{item.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Media Presentation: Either Live Vector CAD Livery OR Street Photo with Dual Logos */}
        {cardDisplayMode === 'cad' ? (
          <div className="rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-[#0e1116] shadow-sm">
            <KayoolaBusGraphic
              showControls={false}
              vehicleType={activeVehicleType}
              countryCode={countryCode}
            />
          </div>
        ) : (
          <div
            onClick={() => {
              setModalTab('poster');
              setDetailsModalOpen(true);
            }}
            className="rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-[#0e1116] cursor-pointer group"
          >
            {/* Dark Top Frame Bar with CivicDuty · CC Tab & Controls (Zero Overlap on Photo) */}
            <div className="px-2.5 py-2 bg-[#0e1116] border-b border-white/10 flex items-center justify-between gap-2">
              <div className="px-2.5 py-1 rounded-lg bg-[#161a22] border border-white/15 flex items-center gap-2 shadow-xs">
                <svg viewBox="0 0 90 30" className="w-10 h-3 shrink-0" aria-hidden="true">
                  <circle cx="15" cy="15" r="10" fill="none" stroke="#EF4444" strokeWidth="2.5" />
                  <circle cx="15" cy="15" r="3" fill="#F87171" />
                  <circle cx="45" cy="15" r="10" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
                  <circle cx="45" cy="15" r="3" fill="#FDE047" />
                  <circle cx="75" cy="15" r="10" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
                  <path d="M 70 15.2 L 73.8 18.8 L 80 12.2" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] font-black text-white tracking-tight">CivicDuty</span>
                <span className="text-white/30">·</span>
                <span className="text-[9.5px] font-mono font-bold text-emerald-400">
                  {transitSpec.countryCode}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownloadPoster}
                  className="p-1.5 rounded-lg bg-[#161a22] hover:bg-white/10 text-white border border-white/15 transition-colors cursor-pointer"
                  title="Download Poster Image for Social Media"
                >
                  <Download size={12} />
                </button>
                <button
                  type="button"
                  onClick={handleUniversalShare}
                  disabled={isSharing}
                  aria-label="Universal Share"
                  className="px-2 py-1.5 rounded-lg bg-[#161a22] hover:bg-white/10 text-emerald-400 border border-white/15 text-[10.5px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-60"
                  title="Universal Share (Native Web Share API for Social Media & Ad Networks)"
                >
                  {sharedFeedback ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
                  <span className="hidden sm:inline">{sharedFeedback ? 'Shared' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalTab('poster');
                    setDetailsModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#161a22] hover:bg-white/10 text-white text-[10.5px] font-mono font-semibold flex items-center gap-1 border border-white/15 transition-colors cursor-pointer"
                  title="View Full Resolution Poster"
                >
                  <Maximize2 size={12} />
                  <span className="hidden sm:inline">Enlarge</span>
                </button>
              </div>
            </div>

            {/* 100% Unobstructed Campaign Photo Viewport */}
            <div className="aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                key={effectiveImageSrc}
                src={effectiveImageSrc}
                alt={activeAd.title}
                className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-500 select-none"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = transitSpec.scoutPosterSrc;
                }}
              />
            </div>

            {/* Dark Bottom Frame Footer Strip (Zero Overlap on Photo) */}
            <div className="px-3 py-2.5 bg-[#0e1116] border-t border-white/10 flex items-center justify-between gap-2 text-white">
              <div className="min-w-0">
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Citizen-Government Interface
                </div>
                <div className="text-xs font-semibold truncate text-slate-200">
                  {activeAd.title}
                </div>
              </div>
              <span className="text-[10px] font-mono font-black px-2 py-1 rounded bg-emerald-600 text-white shadow-xs shrink-0">
                DIAL {transitSpec.ussdCode}
              </span>
            </div>
          </div>
        )}

        {/* Third-Party Platform Transparency Notice */}
        <div className="px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-2 text-[10.5px] font-mono text-slate-600 dark:text-slate-400">
          <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
          <span>
            <strong className="text-slate-800 dark:text-slate-200">Third-Party Civic Platform:</strong> Enabling frontline scouts to verify public service standards.
          </span>
        </div>

        {/* Title, Tagline & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-0.5">
          <div className="min-w-0 flex-1 space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
              {activeAd.title}
            </h4>
            <p className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold line-clamp-1">
              {activeAd.tagline}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
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
              onClick={handleUniversalShare}
              disabled={isSharing}
              data-testid="universal-share-button"
              className="px-2.5 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/35 hover:border-emerald-500 text-[10.5px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-60"
              title="Trigger Native Web Share API across Social Media & Ad Networks"
            >
              {sharedFeedback ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
              <span>{sharedFeedback ? 'Shared!' : 'Universal Share'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenSocialAdsModal}
              className="px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/50 text-[10.5px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Open Social Media & Google Ads Campaign Pack"
            >
              <span>Ads Pack</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDetailsModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
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
                <TrafficLightLogo size="sm" />
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
                  <span>Share &amp; Google Ads</span>
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
                    key={`modal-${effectiveImageSrc}`}
                    src={effectiveImageSrc}
                    alt={activeAd.title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = transitSpec.scoutPosterSrc;
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

                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setModalTab('social')}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 size={12} />
                      <span>Share &amp; Google Ads</span>
                    </button>
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

            {/* Tab 3: Cross-Platform Social Media & Google Ads Campaign Pack */}
            {modalTab === 'social' && (
              <CampaignSharePanel
                ad={activeAd}
                transitSpec={transitSpec}
                pillarKey={activeVehicleType}
                imageSrc={effectiveImageSrc}
                socialPostText={getSocialShareText()}
                onDownloadPoster={handleDownloadPoster}
                onNotify={toast}
              />
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
