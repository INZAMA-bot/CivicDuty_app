import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CdOpsPromotionalAd } from '../types';
import {
  Sparkles,
  PhoneCall,
  Bus,
  Bike,
  Smartphone,
  ExternalLink,
  Gift,
  CheckCircle2,
  Maximize2,
  X,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  Megaphone
} from 'lucide-react';

interface PromotionalAdFeedCardProps {
  ad: CdOpsPromotionalAd;
}

export const PromotionalAdFeedCard: React.FC<PromotionalAdFeedCardProps> = ({ ad }) => {
  const { go, toast, recordAdClick } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAction = () => {
    recordAdClick(ad.id);
    if (ad.ctaType === 'ussd') {
      go('ussd');
      toast('Opening *3030# Sovereign USSD Gateway...', 'emerald');
    } else if (ad.ctaType === 'specs') {
      go('transit_preview');
    } else if (ad.ctaType === 'report') {
      go('compose');
    } else if (ad.ctaType === 'perks') {
      go('perk_vault');
    } else {
      go('transit_preview');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(
      `${ad.title} — ${ad.tagline}. Dial *3030# or visit CivicDuty: https://civicduty.site`
    );
    setCopied(true);
    toast('Copied campaign bulletin link to clipboard', 'emerald');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="p-3.5 sm:p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-y sm:border sm:rounded-2xl border-emerald-500/40 text-slate-100 shadow-md space-y-3 relative overflow-hidden transition-all hover:border-emerald-500/70">
        {/* Top Header Label */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono flex items-center gap-1 shadow-2xs">
              <Megaphone size={10} />
              <span>MARKET PROMOTION</span>
            </span>
            <span className="text-[9.5px] font-mono font-bold text-emerald-300 uppercase tracking-tight">
              {ad.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8.5px] font-mono text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10">
              CD-OPS VERIFIED
            </span>
            <button
              onClick={handleShare}
              className="text-slate-400 hover:text-white transition-colors p-1"
              title="Share campaign bulletin"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
            </button>
          </div>
        </div>

        {/* Campaign Imagery with Lightbox Trigger */}
        <div
          onClick={() => setModalOpen(true)}
          className="w-full h-48 sm:h-64 rounded-xl overflow-hidden border border-white/10 bg-black relative group cursor-pointer shadow-inner"
        >
          <img
            src={ad.imageSrc}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/campaign/boda_poster_ad_1790426299023.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-3">
            <div className="flex justify-end">
              <span className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs text-[10px] mono flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={12} />
                <span>Full Poster</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-black uppercase text-amber-300 mono tracking-tight drop-shadow-md block">
                {ad.tagline}
              </span>
            </div>
          </div>
        </div>

        {/* Content & Description */}
        <div className="space-y-1.5">
          <h4 className="text-sm sm:text-base font-black text-white leading-tight">
            {ad.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {ad.summary}
          </p>
        </div>

        {/* Highlight Bullets */}
        {ad.highlights && ad.highlights.length > 0 && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-[10.5px] text-slate-300">
            {ad.highlights.slice(0, 3).map((hl, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{hl}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button Row */}
        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleAction}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
          >
            {ad.ctaType === 'ussd' && <PhoneCall size={14} className="text-amber-300" />}
            {ad.ctaType === 'specs' && <Bus size={14} className="text-white" />}
            {ad.ctaType === 'perks' && <Gift size={14} className="text-amber-300" />}
            <span>{ad.callToAction}</span>
            <ChevronRight size={14} />
          </button>

          <button
            type="button"
            onClick={() => {
              recordAdClick(ad.id);
              go('transit_preview');
            }}
            className="py-2.5 px-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <span>Specs &amp; Livery</span>
            <ExternalLink size={12} />
          </button>
        </div>

        {/* Metadata Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[8px] sm:text-[8.5px] font-mono text-slate-400">
          <span className="truncate max-w-[200px]">Audience: {ad.targetAudience}</span>
          <span className="truncate max-w-[200px] text-right">Sponsor: {ad.sponsorName}</span>
        </div>
      </div>

      {/* Lightbox Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  {ad.categoryLabel}
                </span>
                <h3 className="text-base font-black text-white">{ad.title}</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
              <img
                src={ad.imageSrc}
                alt={ad.title}
                className="w-full max-h-[60vh] object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/campaign/boda_poster_ad_1790426299023.jpg';
                }}
              />
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="font-mono text-amber-400 font-bold">{ad.tagline}</div>
              <p>{ad.summary}</p>
              {ad.specs && (
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 font-mono text-[10px] text-slate-400">
                  Engineering Specs: {ad.specs}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setModalOpen(false);
                  handleAction();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black mono uppercase tracking-wider"
              >
                {ad.callToAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
