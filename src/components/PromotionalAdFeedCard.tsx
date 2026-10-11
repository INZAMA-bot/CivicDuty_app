import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CdOpsPromotionalAd } from '../types';
import { getCountryPromotionalAds, getCountryTransitSpecs } from '../data/promotionalAds';
import { TrafficLightLogo } from './TrafficLightLogo';
import { KayoolaBusGraphic } from './KayoolaBusGraphic';
import {
  PhoneCall,
  Bus,
  Train,
  Bike,
  Store,
  ExternalLink,
  Gift,
  CheckCircle2,
  X,
  Share2,
  Check,
  ChevronRight,
  Paintbrush,
  Info,
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
  const [copied, setCopied] = useState(false);

  const activeUser = user || ensureCitizenSession();
  const countryCode = selectedCountry || activeUser.country || 'UG';
  const countryAds = getCountryPromotionalAds(countryCode);
  const transitSpec = getCountryTransitSpecs(countryCode);

  // Determine which of the two distinct card modes this instance represents:
  // 1) 'transit_painting': Strictly Kayoola Bus & Train painting proposal
  // 2) 'frontline_scouts': Directed towards Frontline Scouts (Bodaboda stages & Market vendors)
  const resolvedMode: 'transit_painting' | 'frontline_scouts' =
    campaignMode ||
    (defaultIndex !== undefined && defaultIndex >= 2
      ? 'frontline_scouts'
      : ad.category === 'bodaboda' || ad.category === 'market'
      ? 'frontline_scouts'
      : 'transit_painting');

  // Within Card 1 ('transit_painting'), indices are 0 (Kayoola Bus) or 1 (Commuter Train)
  // Within Card 2 ('frontline_scouts'), indices are 2 (Bodaboda Stage) or 3 (Market Vendors)
  const initialIdx =
    resolvedMode === 'transit_painting'
      ? defaultIndex === 1 || ad.category === 'train'
        ? 1
        : 0
      : defaultIndex === 3 || ad.category === 'market'
      ? 3
      : 2;

  const [selectedPillarIdx, setSelectedPillarIdx] = useState<number>(initialIdx);
  const activeAd = countryAds[selectedPillarIdx] || ad;

  const activeVehicleType: 'bus' | 'train' | 'bodaboda' | 'market' =
    selectedPillarIdx === 0
      ? 'bus'
      : selectedPillarIdx === 1
      ? 'train'
      : selectedPillarIdx === 2
      ? 'bodaboda'
      : 'market';

  const handlePrimaryAction = () => {
    recordAdClick(activeAd.id);
    if (resolvedMode === 'frontline_scouts') {
      go('perk_vault');
      toast('Opening Frontline Scout & Bodaboda Vault...', 'emerald');
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
        {/* Minimal Compact Header + 2-Option Switcher Strictly Scoped to Card Objective */}
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
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedPillarIdx === 0
                      ? 'bg-emerald-600 text-white'
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
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedPillarIdx === 1
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Train size={11} />
                  <span>Train</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPillarIdx(2);
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedPillarIdx === 2
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Bike size={11} />
                  <span>Bodaboda Scouts</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPillarIdx(3);
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    selectedPillarIdx === 3
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Store size={11} />
                  <span>Market Vendors</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Pure Pictorial Exhibition Using Exact CivicDuty Design Patterns & 3-Signal Checkmark Logo */}
        <div
          onClick={() => setDetailsModalOpen(true)}
          className="rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-[#0e1116] cursor-pointer group relative"
        >
          <KayoolaBusGraphic
            showControls={false}
            vehicleType={activeVehicleType}
            countryCode={countryCode}
          />
        </div>

        {/* Minimal Footer Row: Title + Click Button for More Details */}
        <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {activeAd.title}
            </h4>
            <p className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 truncate">
              {resolvedMode === 'transit_painting'
                ? `Official CivicDuty Livery & Paint Spec · ${
                    selectedPillarIdx === 0 ? transitSpec.busPartnerName : transitSpec.trainOperatorName
                  }`
                : `Frontline Scout Mobilization · Free USSD ${transitSpec.ussdCode} · Monthly Top-3 Bounties`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
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
                  ? 'Painting Proposal Details'
                  : 'Scout Campaign Details'}
              </span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* On-Demand Details Modal (Opened when clicking the button or pictorial canvas) */}
      {detailsModalOpen && (
        <div
          onClick={() => setDetailsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center gap-2.5">
                <TrafficLightLogo size={24} />
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
                    {resolvedMode === 'transit_painting'
                      ? 'Official Fleet Painting & Livery Proposal'
                      : 'Frontline Scouts Outdoor Billboard Campaign'}{' '}
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

            {/* Interactive SVG Pictorial Specification with Zoom & SVG Download */}
            <KayoolaBusGraphic
              showControls={true}
              vehicleType={activeVehicleType}
              countryCode={countryCode}
            />

            {/* Full Proposal / Campaign Objectives & Highlights */}
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

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500">
                Partner:{' '}
                {selectedPillarIdx === 0
                  ? transitSpec.busPartnerName
                  : selectedPillarIdx === 1
                  ? transitSpec.trainOperatorName
                  : selectedPillarIdx === 2
                  ? transitSpec.stageTransportName
                  : 'Urban Market Vendors & Traders Associations'}
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


