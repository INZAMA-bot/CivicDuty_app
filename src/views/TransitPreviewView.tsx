import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { KayoolaBusGraphic } from '../components/KayoolaBusGraphic';
import { CampaignSharePanel } from '../components/CampaignSharePanel';
import { CountrySelector } from '../components/CountrySelector';
import { getCountryTransitSpecs, getCountryPromotionalAds } from '../data/promotionalAds';
import { buildUniversalShareMetadata, triggerUniversalWebShare } from '../utils/universalShare';
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
  Share2,
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
  const { go, selectedCountry, user, toast } = useApp();
  const activeCountry = selectedCountry || user?.country || 'UG';
  const isUganda = activeCountry === 'UG';
  const transitSpec = getCountryTransitSpecs(activeCountry);

  const CAMPAIGN_MEDIA: CampaignMediaItem[] = useMemo(() => {
    const localizedAds = getCountryPromotionalAds(activeCountry);
    const items: CampaignMediaItem[] = localizedAds.map((ad) => ({
      id: ad.id,
      title: ad.title,
      category: ad.category as CampaignMediaItem['category'],
      categoryLabel: ad.categoryLabel,
      imageSrc: ad.imageSrc,
      summary: ad.summary,
      specs: ad.specs,
      tagline: ad.tagline,
      callToAction: ad.callToAction,
      highlights: ad.highlights || [],
    }));

    items.push({
      id: `fleet-depot-charging-${activeCountry.toLowerCase()}`,
      title: `${transitSpec.countryName} Fleet Terminal & Transit Hub Branding`,
      category: 'terminal',
      categoryLabel: `Fleet Terminal & Hub (${transitSpec.countryCode})`,
      imageSrc: isUganda ? '/campaign/fleet_depot_branding_1788711242525.jpg?v=20261113' : transitSpec.busPosterSrc,
      summary: `Synchronized fleet branding across ${transitSpec.countryName} bus terminals, departure bays, and commuter concourses.`,
      specs: `Fleet-wide Exterior Livery & Overhead Terminal Pylon Signage · ${transitSpec.countryName}`,
      tagline: `${transitSpec.countryName} Sovereign Transit Fleet · ${transitSpec.ussdCode}`,
      callToAction: 'Community Sensitization at Scale: 250,000+ Daily Commuter Impressions',
      highlights: [
        'Synchronized multi-vehicle visual impact reinforcing official public-private accountability',
        `High-traffic commuter departure bays across ${transitSpec.busRoutes}`,
        `Co-branded with ${transitSpec.municipalAuthority}`,
        'Integrated terminal bay posters detailing how civic reports are resolved within 24–72 hours',
      ],
    });

    return items;
  }, [activeCountry, isUganda, transitSpec]);

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'bodaboda' | 'bus' | 'train' | 'terminal' | 'billboard' | 'market' | 'taxi' | 'health' | 'teacher' | 'artisan' | 'strategy'
  >('all');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<CampaignMediaItem | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [activeScriptTab, setActiveScriptTab] = useState<'poster' | 'radio' | 'sacco' | 'specs'>('poster');
  const [showCadBlueprint, setShowCadBlueprint] = useState(false);

  useEffect(() => {
    setActiveMediaIndex(0);
    setSelectedCategory('all');
  }, [activeCountry]);

  const filteredMedia = selectedCategory === 'all' || selectedCategory === 'strategy'
    ? CAMPAIGN_MEDIA
    : CAMPAIGN_MEDIA.filter(item => item.category === selectedCategory);

  const activeMedia = filteredMedia[activeMediaIndex] || filteredMedia[0] || CAMPAIGN_MEDIA[0];

  const handleHeroUniversalShare = async () => {
    const shareMeta = buildUniversalShareMetadata({
      ad: activeMedia,
      transitSpec,
      pillarKey: activeMedia.category,
      socialPostText: `${activeMedia.title} — ${activeMedia.tagline}\n\n${activeMedia.summary}\n\nAccess via ${transitSpec.ussdCode} · #CivicDuty #SpeakServeBeHeard #${transitSpec.countryName.replace(/\s+/g, '')} #FrontlineScouts`,
      imageSrc: activeMedia.imageSrc,
    });
    const outcome = await triggerUniversalWebShare(shareMeta);
    if (outcome === 'shared' || outcome === 'shared_with_media') {
      toast(
        outcome === 'shared_with_media'
          ? 'Campaign poster & link shared via native Web Share API!'
          : 'Campaign shared via native Web Share API!',
        'emerald'
      );
    } else if (outcome === 'fallback') {
      toast('Campaign copy copied — choose Social Platform or Google Ads Pack below.', 'emerald');
    }
  };

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
            { key: 'bus', label: isUganda ? 'Kayoola Buses' : 'Transit Buses', icon: Bus },
            { key: 'train', label: 'Commuter Rail', icon: Train },
            { key: 'bodaboda', label: transitSpec.scoutTabLabel, icon: Bike },
            { key: 'market', label: transitSpec.marketTabLabel, icon: Store },
            { key: 'taxi', label: transitSpec.taxiTabLabel, icon: Car },
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
            {/* Primary Featured Image Display - Top Frame Bar + 100% Unobstructed Image */}
            <div className="rounded-xl overflow-hidden bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] group">
              {/* Dark Top Frame Bar (Zero Overlap on Photo) */}
              <div className="px-3 py-2 bg-[#0e1116] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="px-2.5 py-1 rounded-lg bg-[#161a22] border border-white/15 flex items-center gap-2 shrink-0">
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
                  <span className="text-[10px] font-mono font-semibold text-slate-300 truncate hidden sm:inline">
                    {activeMedia.categoryLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleHeroUniversalShare}
                    className="px-2.5 py-1.5 rounded-lg bg-[#161a22] hover:bg-white/10 text-emerald-400 border border-white/15 transition-colors flex items-center gap-1.5 text-[11px] font-mono font-semibold cursor-pointer"
                    title="Trigger Native Web Share API across Social Media & Ad Networks"
                  >
                    <Share2 size={12} />
                    <span className="hidden sm:inline">Universal Share</span>
                  </button>
                  <a
                    href={activeMedia.imageSrc}
                    download={`civicduty-${activeMedia.category}-${transitSpec.countryCode.toLowerCase()}-campaign-poster.jpg`}
                    className="px-2.5 py-1.5 rounded-lg bg-[#161a22] hover:bg-white/10 text-white border border-white/15 transition-colors flex items-center gap-1.5 text-[11px] font-mono font-semibold cursor-pointer"
                    title="Download Poster Image for Social Media"
                  >
                    <Download size={12} />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <button
                    onClick={() => setLightboxItem(activeMedia)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#161a22] hover:bg-white/10 text-white border border-white/15 transition-colors flex items-center gap-1.5 text-[11px] font-mono font-semibold cursor-pointer"
                    title="Expand to Fullscreen Lightbox"
                  >
                    <Maximize2 size={12} />
                    <span className="hidden sm:inline">Enlarge</span>
                  </button>
                </div>
              </div>

              <div className="aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src={activeMedia.imageSrc}
                  alt={activeMedia.title}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = transitSpec.scoutPosterSrc;
                  }}
                />
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

                {/* All Social Platforms + Google Ads Sharing Hub for Active Ad */}
                <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36]">
                  <CampaignSharePanel
                    ad={{
                      id: activeMedia.id,
                      title: activeMedia.title,
                      category: activeMedia.category as any,
                      categoryLabel: activeMedia.categoryLabel,
                      imageSrc: activeMedia.imageSrc,
                      summary: activeMedia.summary,
                      specs: activeMedia.specs,
                      tagline: activeMedia.tagline,
                      callToAction: activeMedia.callToAction,
                      highlights: activeMedia.highlights,
                    }}
                    transitSpec={transitSpec}
                    pillarKey={activeMedia.category}
                    imageSrc={activeMedia.imageSrc}
                    socialPostText={`${activeMedia.title} — ${activeMedia.tagline}\n\n${activeMedia.summary}\n\nAccess via ${transitSpec.ussdCode} or ${typeof window !== 'undefined' ? window.location.origin : 'https://civicduty.site'}\n#CivicDuty #SpeakServeBeHeard #${transitSpec.countryName.replace(/\s+/g, '')} #FrontlineScouts`}
                    onDownloadPoster={() => {
                      const link = document.createElement('a');
                      link.href = activeMedia.imageSrc;
                      link.download = `civicduty-${activeMedia.category}-${transitSpec.countryCode.toLowerCase()}-campaign-poster.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast('Downloaded campaign poster image!', 'emerald');
                    }}
                    onNotify={toast}
                  />
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
                            (e.currentTarget as HTMLImageElement).src = transitSpec.scoutPosterSrc;
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
              <KayoolaBusGraphic countryCode={activeCountry} />
            </div>
          )}
        </div>

        {/* Country-Adapted Frontline Scouts Poster & Market Launch Creative Suite */}
        <div id="bodaboda-creative-suite" className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Bike size={20} strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold uppercase text-slate-900 dark:text-white tracking-tight font-mono">
                    {isUganda
                      ? 'Bodaboda Community Stage Poster & Ad Script'
                      : `${transitSpec.stageTransportName}: Frontline Scouts Poster & Ad Script`}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 font-mono font-semibold uppercase">
                    {transitSpec.countryCode} LAUNCH KIT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isUganda
                    ? 'Transitioning into market: Official campaign script tailored to 1.5M+ Boda riders, stage noticeboards, and SACCOs'
                    : `Official Frontline Scouts campaign kit tailored to ${transitSpec.countryName}’s ${transitSpec.stageTransportName.toLowerCase()}, union hubs, and urban transit corridors`}
                </p>
              </div>
            </div>

            {/* Script Category Switcher */}
            <div className="flex items-center gap-1 bg-[#f8f9fa] dark:bg-[#0e1116] p-1 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] self-start sm:self-auto overflow-x-auto">
              {[
                { id: 'poster', label: 'Poster Script', icon: FileText },
                { id: 'radio', label: 'Audio / Megaphone', icon: Megaphone },
                { id: 'sacco', label: isUganda ? 'Stage SACCO' : 'Hub Coordination', icon: ShieldCheck },
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
                <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#e3e6ea] dark:border-[#262b36] bg-[#0e1116] group">
                  <div className="px-2.5 py-1.5 bg-[#0e1116] border-b border-white/10 flex items-center justify-between gap-2">
                    <div className="px-2 py-0.5 rounded bg-[#161a22] border border-white/15 flex items-center gap-1.5">
                      <span className="text-[9.5px] font-black text-white">CivicDuty</span>
                      <span className="text-white/30">·</span>
                      <span className="text-[9px] font-mono font-bold text-emerald-400">{transitSpec.countryCode}</span>
                    </div>
                    <span className="text-[9px] font-semibold font-mono text-emerald-300 truncate">
                      {isUganda ? 'Official Stage Poster' : `${transitSpec.countryCode} Frontline Poster`}
                    </span>
                  </div>
                  <img
                    key={isUganda ? 'ug-boda-poster' : transitSpec.scoutPosterSrc}
                    src={isUganda ? '/campaign/boda_poster_ad_1790426299023.jpg?v=20261113' : transitSpec.scoutPosterSrc}
                    alt={`${transitSpec.countryName} ${transitSpec.stageTransportName} Poster Mockup`}
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = transitSpec.scoutPosterSrc;
                    }}
                  />
                  <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-600 dark:text-slate-300">
                      {isUganda ? 'Format: A1 / A2 Stage Display' : 'Format: Street Kiosk & Noticeboard'}
                    </span>
                    <button
                      onClick={() => setLightboxItem(CAMPAIGN_MEDIA[2] || CAMPAIGN_MEDIA[0])}
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
                          const posterText = isUganda
                            ? `CIVICDUTY BODABODA STAGE POSTER SCRIPT\nHEADLINE (Luganda): BODA MAN: GWE BOSS W’OLUGUUDO!\nHEADLINE (English): YOUR STAGE. YOUR ROAD. YOUR POWER. SPEAK DIRECTLY TO GOVERNMENT WITH ZERO INTERNET.\nSUB-HEADLINE: Tokyakaaba Potholes oba Bribes mu Kifuba. Speak · Serve · Be Heard.`
                            : `CIVICDUTY ${transitSpec.countryName.toUpperCase()} FRONTLINE SCOUTS POSTER SCRIPT\nHEADLINE: ${transitSpec.localSlogan}\nAUDIENCE: ${transitSpec.stageTransportName}\nSUB-HEADLINE: SPEAK. SERVE. BE HEARD. Report potholes, hazards & outages directly to ${transitSpec.municipalAuthority} (${transitSpec.ussdCode}).`;
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
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold uppercase">
                        {isUganda ? 'Main Street Headline (Luganda):' : `Primary Street Headline (${transitSpec.countryName}):`}
                      </div>
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                        &ldquo;{isUganda ? 'BODA MAN: GWE BOSS W’OLUGUUDO!' : transitSpec.localSlogan}&rdquo;
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        {isUganda ? 'EDDOBOOZI LYOPPA TIBAKYALINYIRIRA.' : 'SPEAK · SERVE · BE HEARD.'}
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold uppercase">
                        {isUganda ? 'English Sub-Headline:' : 'Operational Action Callout:'}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {isUganda
                          ? 'YOUR STAGE. YOUR ROAD. YOUR POWER. Speak directly to Government with ZERO data.'
                          : `YOUR ROUTE. YOUR STREET. YOUR VOICE. Report road, transit & utility issues directly to ${transitSpec.municipalAuthority}.`}
                      </p>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 italic">
                        {isUganda
                          ? 'Tokyakaaba Potholes oba Bribes mu Kifuba. Funa Proof ku Simu Yo.'
                          : `Tailored for ${transitSpec.stageTransportName} across ${transitSpec.stageLocations}.`}
                      </p>
                    </div>
                  </div>

                  {/* The 3-Signal Loop Explanation tailored per jurisdiction */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[10px] font-semibold uppercase font-mono">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>{isUganda ? '1. Red: Oyogera' : '1. Red: Speak'}</span>
                      </div>
                      <div className="text-[10.5px] text-slate-900 dark:text-white font-semibold">
                        {isUganda ? 'Oguze Pothole?' : 'Spot a Street Hazard?'}
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {isUganda
                          ? 'Log suspension-busting potholes, open manholes, dark streetlights, or corrupt shakedowns.'
                          : 'Log potholes, blocked bike/bus lanes, dark streetlights, or dangerous intersections in seconds.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-[10px] font-semibold uppercase font-mono">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>{isUganda ? '2. Amber: Gavumenti' : '2. Amber: Serve'}</span>
                      </div>
                      <div className="text-[10.5px] text-slate-900 dark:text-white font-semibold">
                        {isUganda ? 'SLA Timer Etandika' : 'Public SLA Timer Starts'}
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {transitSpec.municipalAuthority} receives instant dispatch. The public clock starts counting down.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/30 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold uppercase font-mono">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                          <Check size={7} strokeWidth={3} />
                        </span>
                        <span>{isUganda ? '3. Green: Proof' : '3. Green: Be Heard'}</span>
                      </div>
                      <div className="text-[10.5px] text-emerald-700 dark:text-emerald-300 font-semibold">
                        {isUganda ? 'Oluguudo Lusibwa!' : 'Verified Repair & Proof!'}
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isUganda
                          ? 'Pothole patched, proof photo uploaded to ledger. Stage earns fuel & airtime perks.'
                          : 'Issue repaired, verification photo logged on ledger. Top active scouts earn mobility & utility perks.'}
                      </p>
                    </div>
                  </div>

                  {/* Direct Call To Action Callout */}
                  <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{transitSpec.ussdCode}</span>
                        <span>{isUganda ? 'DIAL FOR FREE · ZERO DATA NEEDED' : 'INSTANT ACCESS · ZERO FRICTION'}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 dark:text-slate-400">
                        Compatible with all Smartphones, Web Browsers &amp; Basic Phones.
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
                    <Radio size={14} /> 45-Second Community Broadcast &amp; Radio Sensitization Script ({transitSpec.countryCode})
                  </div>
                  <button
                    onClick={() => {
                      const radioText = isUganda
                        ? `[SOUND EFFECT: Motorcycle engine revving - Bajaj Boxer - followed by sudden loud tire screech and clunk into a pothole]\nVOICEOVER: "Koona *3030# kati. CIVICDUTY: Speak, Serve, Be Heard!"`
                        : `[SOUND EFFECT: Crisp urban street traffic fading into the CivicDuty 3-Signal chime]\nVOICEOVER: "${transitSpec.localSlogan} Reach ${transitSpec.municipalAuthority} directly via ${transitSpec.ussdCode} or civicduty.site. CIVICDUTY: Speak, Serve, Be Heard!"`;
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

                {isUganda ? (
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
                ) : (
                  <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 space-y-2 border border-[#e3e6ea] dark:border-[#262b36]">
                    <p className="text-emerald-600 dark:text-emerald-400 italic">
                      [SFX: Morning commuter bustle across {transitSpec.stageLocations}, followed by a sharp brake alert near an unmarked road hazard]
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">HOST ({transitSpec.countryName} Urban Edition):</strong><br />
                      &ldquo;Attention {transitSpec.stageTransportName} and commuters across {transitSpec.stageLocations}! Every day, broken curbs, flooded storm drains, dark streetlights, and damaged lanes slow down your work and put citizens at risk.&rdquo;
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400 italic">
                      [SFX: Clean 3-Signal Beacon chime — Red, Amber, Pine-Green Checkmark illuminates]
                    </p>
                    <p>
                      &ldquo;Now every report goes straight on the public record with a live repair clock! Connect via <strong>{transitSpec.ussdCode}</strong> or open CivicDuty to log exact GPS hazards straight to <strong>{transitSpec.municipalAuthority}</strong>. CIVICDUTY: Speak, Serve, Be Heard!&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HUB / UNION MOBILISATION PROTOCOL */}
          {activeScriptTab === 'sacco' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                <div className="text-xs font-bold uppercase text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {isUganda
                      ? 'Stage Chairman & SACCO Mobilisation Protocol'
                      : `${transitSpec.countryName} Frontline Hub & Association Mobilisation Protocol`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  How local mobility associations, delivery fleets, and transit captains deploy CivicDuty to safeguard street workers, accelerate repairs with <strong>{transitSpec.municipalAuthority}</strong>, and unlock merit allocations:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[10.5px]">
                      Step 1: Hub Onboarding &amp; Verification Code
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Coordinator registers the workstation hub via <strong>{transitSpec.ussdCode}</strong> or platform admin. The cluster receives a unique verification ID (e.g. <code>{transitSpec.countryCode}-HUB-04</code>).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <div className="text-amber-600 dark:text-amber-400 font-semibold font-mono text-[10.5px]">
                      Step 2: Collective Hazard Verification
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      When multiple frontline scouts from the same corridor confirm a defect, its priority score elevates to Grade 1 emergency dispatch for municipal engineers.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <div className="text-sky-600 dark:text-sky-400 font-semibold font-mono text-[10.5px]">
                      Step 3: Municipal Accountability Shield
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Unresolved street hazards or regulatory abuse logged via <strong>{transitSpec.ussdCode}</strong> trigger instant escalation alerts to {transitSpec.municipalAuthority} oversight desks.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <div className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[10.5px]">
                      Step 4: Verified Mobility &amp; Data Perks
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      Scouts whose hazard reports lead to certified municipal repairs earn verified Civic Karma, redeemable for transit, charging, fuel, or telecom data bundles.
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
                  <span>
                    Physical Print &amp; Mounting Specifications ({transitSpec.countryName} · {transitSpec.scoutTabLabel})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                    <div className="text-[9px] text-slate-500 uppercase">Substrate</div>
                    <div className="text-slate-900 dark:text-white font-bold">Polypropylene Synthetic</div>
                    <p className="text-[10px] text-slate-500 normal-case">100% weatherproof, tear-proof, UV-resistant outdoors</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                    <div className="text-[9px] text-slate-500 uppercase">Standard Sizes</div>
                    <div className="text-slate-900 dark:text-white font-bold">A1 (594×841mm) &amp; Totem</div>
                    <p className="text-[10px] text-slate-500 normal-case">Optimized for transit shelters, kiosks, noticeboards &amp; gantries</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                    <div className="text-[9px] text-slate-500 uppercase">Ink Technology</div>
                    <div className="text-slate-900 dark:text-white font-bold">Latex UV Curable</div>
                    <p className="text-[10px] text-slate-500 normal-case">Fade-resistant across wet, snow, or high-sun climates</p>
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
                  (e.currentTarget as HTMLImageElement).src = transitSpec.scoutPosterSrc;
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
