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
  ExternalLink,
  Gift,
  CheckCircle2,
  Maximize2,
  X,
  Share2,
  Check,
  ChevronRight,
  Megaphone,
  Paintbrush,
} from 'lucide-react';

interface PromotionalAdFeedCardProps {
  ad: CdOpsPromotionalAd;
  defaultIndex?: number;
}

export const PromotionalAdFeedCard: React.FC<PromotionalAdFeedCardProps> = ({ ad, defaultIndex }) => {
  const { user, ensureCitizenSession, selectedCountry, go, toast, recordAdClick } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeUser = user || ensureCitizenSession();
  const countryCode = selectedCountry || activeUser.country || 'UG';
  const countryAds = getCountryPromotionalAds(countryCode);
  const transitSpec = getCountryTransitSpecs(countryCode);

  const initialIdx =
    defaultIndex !== undefined
      ? defaultIndex
      : ad.category === 'train'
      ? 1
      : ad.category === 'bodaboda'
      ? 2
      : 0;

  const [selectedPillarIdx, setSelectedPillarIdx] = useState<number>(initialIdx);
  const activeAd = countryAds[selectedPillarIdx] || ad;
  const activeVehicleType: 'bus' | 'train' | 'boda' =
    selectedPillarIdx === 0 ? 'bus' : selectedPillarIdx === 1 ? 'train' : 'boda';

  const handleAction = () => {
    recordAdClick(activeAd.id);
    if (activeAd.ctaType === 'ussd') {
      go('ussd');
      toast(`Opening ${transitSpec.ussdCode} Sovereign USSD Gateway...`, 'emerald');
    } else if (activeAd.ctaType === 'specs') {
      go('transit_preview');
    } else if (activeAd.ctaType === 'report') {
      go('compose');
    } else if (activeAd.ctaType === 'perks') {
      go('perk_vault');
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
    toast('Copied campaign partnership proposal link to clipboard', 'emerald');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="p-3.5 sm:p-4 bg-white dark:bg-[#161a22] border-y sm:border sm:rounded-xl border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-slate-100 space-y-3 relative overflow-hidden transition-colors hover:border-emerald-500/60">
        {/* Top Studio Header Row with Current 3-Signal CivicDuty Logo */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <TrafficLightLogo size={18} />
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span>CivicDuty Transit &amp; Stage Livery</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-[10.5px] font-mono font-medium text-slate-600 dark:text-slate-300 truncate">
              {transitSpec.countryName} Node ({transitSpec.ussdCode})
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
              aistudio.google Livery Spec
            </span>
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] transition-colors cursor-pointer"
              title="Share campaign proposal"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
            </button>
          </div>
        </div>

        {/* 3-Pillar Country-Adaptive Poster Switcher (Kayoola Bus · Railway Train · Bodaboda Stage) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
          <button
            type="button"
            onClick={() => setSelectedPillarIdx(0)}
            className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[10.5px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              selectedPillarIdx === 0
                ? 'bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-[#e3e6ea] dark:border-[#262b36] shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bus size={12} className={selectedPillarIdx === 0 ? 'text-emerald-600 dark:text-emerald-400 shrink-0' : 'shrink-0'} />
            <span className="truncate">1. {countryCode === 'UG' ? 'Kayoola Bus' : 'Bus Fleet'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPillarIdx(1)}
            className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[10.5px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              selectedPillarIdx === 1
                ? 'bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-[#e3e6ea] dark:border-[#262b36] shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Train size={12} className={selectedPillarIdx === 1 ? 'text-emerald-600 dark:text-emerald-400 shrink-0' : 'shrink-0'} />
            <span className="truncate">2. Train Livery</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPillarIdx(2)}
            className={`py-1.5 px-2 rounded-lg text-[10px] sm:text-[10.5px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              selectedPillarIdx === 2
                ? 'bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-[#e3e6ea] dark:border-[#262b36] shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bike size={12} className={selectedPillarIdx === 2 ? 'text-emerald-600 dark:text-emerald-400 shrink-0' : 'shrink-0'} />
            <span className="truncate">3. Boda &amp; Stage</span>
          </button>
        </div>

        {/* Authentic Vehicle & Stage Livery CAD Showcase (Kayoola Bus / Railway Train / Bodaboda Motorcycle) */}
        <div
          onClick={() => setModalOpen(true)}
          className="w-full rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-[#0e1116] relative group cursor-pointer"
        >
          <div className="p-2 sm:p-3">
            <KayoolaBusGraphic
              showControls={false}
              vehicleType={activeVehicleType}
              countryCode={countryCode}
            />
          </div>

          {/* Studio Title & Expand Strip below CAD Livery */}
          <div className="px-3.5 py-2.5 bg-[#161a22] border-t border-[#262b36] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9.5px] font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Paintbrush size={10} />
                  <span>
                    {selectedPillarIdx === 0
                      ? 'AD PARTNERSHIP PROPOSAL · ACTUAL BUS PAINTING'
                      : selectedPillarIdx === 1
                      ? 'RAILWAY REFURBISHMENT · MOVING BILLBOARD PAINTING'
                      : `${transitSpec.countryName.toUpperCase()} BODA STAGE & REFLECTOR LIVERY`}
                  </span>
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-[9.5px] font-mono text-amber-400 font-semibold truncate">
                  {activeAd.tagline}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                {activeAd.title}
              </h4>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-[#0e1116] hover:bg-slate-800 text-slate-200 text-[10px] font-mono font-semibold flex items-center gap-1 border border-[#262b36] shrink-0">
              <Maximize2 size={11} strokeWidth={1.75} />
              <span>Inspect CAD</span>
            </span>
          </div>
        </div>

        {/* Proposal Summary & Country-Specific Fleet Details */}
        <div className="space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeAd.summary}
          </p>

          {/* Country-Specific Fleet / Corridor Metadata Strip */}
          <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5 text-[11px]">
            {activeAd.highlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{hl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Action Row */}
        <div className="pt-0.5 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleAction}
            className="flex-1 py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {activeAd.ctaType === 'ussd' && <PhoneCall size={13} />}
            {activeAd.ctaType === 'specs' && <Paintbrush size={13} />}
            {activeAd.ctaType === 'perks' && <Gift size={13} />}
            <span>{activeAd.callToAction}</span>
            <ChevronRight size={13} />
          </button>

          <button
            type="button"
            onClick={() => {
              recordAdClick(activeAd.id);
              go('transit_preview');
            }}
            className="py-2 px-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#e3e6ea] dark:border-[#262b36] cursor-pointer"
          >
            <span>All Country Liveries &amp; Specs</span>
            <ExternalLink size={12} />
          </button>
        </div>

        {/* Quiet Metadata Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono text-slate-500 dark:text-slate-400 flex-wrap gap-2">
          <span>Partner Target: {selectedPillarIdx === 0 ? transitSpec.busPartnerName : selectedPillarIdx === 1 ? transitSpec.trainOperatorName : transitSpec.stageTransportName}</span>
          <span>Oversight: {transitSpec.municipalAuthority}</span>
        </div>
      </div>

      {/* High-Resolution CAD Livery & Partnership Proposal Lightbox Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center gap-2.5">
                <TrafficLightLogo size={24} />
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-semibold">
                    {activeAd.categoryLabel} · {transitSpec.countryName}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{activeAd.title}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <KayoolaBusGraphic
              showControls={true}
              vehicleType={activeVehicleType}
              countryCode={countryCode}
            />

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold">{activeAd.tagline}</div>
              <p className="leading-relaxed">{activeAd.summary}</p>
              {activeAd.specs && (
                <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] font-mono text-[10.5px] text-slate-600 dark:text-slate-400">
                  Livery &amp; Paint Specification: {activeAd.specs}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3.5 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  handleAction();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold cursor-pointer"
              >
                {activeAd.callToAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
