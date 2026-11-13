import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CdOpsPromotionalAd } from '../../types';
import { getCountryTransitSpecs } from '../../data/promotionalAds';
import {
  Megaphone,
  Bus,
  Bike,
  Smartphone,
  Eye,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  BarChart2,
  PhoneCall,
  Radio,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Gift
} from 'lucide-react';

export const CdOpsCampaignStudio: React.FC = () => {
  const {
    promotionalAds,
    addPromotionalAd,
    togglePromotionalAdStatus,
    deletePromotionalAd,
    selectedCountry,
    user,
    go,
    toast,
  } = useApp();

  const activeCountry = selectedCountry || user?.country || 'UG';
  const isUganda = activeCountry === 'UG';
  const transitSpec = getCountryTransitSpecs(activeCountry);

  // Manufacturing Form State (initialized cleanly per active jurisdiction)
  const [title, setTitle] = useState(
    isUganda
      ? 'Bodaboda Stage Poster & Civic Alert'
      : `${transitSpec.countryName} ${transitSpec.stageTransportName}: Frontline Scouts Poster`
  );
  const [category, setCategory] = useState<'bodaboda' | 'bus' | 'train' | 'terminal' | 'radio' | 'noticeboard' | 'ussd'>('bodaboda');
  const [categoryLabel, setCategoryLabel] = useState(transitSpec.scoutTabLabel);
  const [tagline, setTagline] = useState(`${transitSpec.localSlogan} • SPEAK. SERVE. BE HEARD.`);
  const [summary, setSummary] = useState(
    isUganda
      ? 'Empower stage riders as frontline municipal road defect inspectors. Report potholes, broken culverts, and extortion without internet bundles via zero-rated USSD.'
      : `Empower ${transitSpec.stageTransportName.toLowerCase()} in ${transitSpec.countryName} as frontline civic scouts reporting road hazards, damaged lanes, and public service outages directly to ${transitSpec.municipalAuthority}.`
  );
  const [imageSrc, setImageSrc] = useState(
    isUganda ? '/campaign/boda_poster_ad_1790426299023.jpg?v=20261113' : transitSpec.scoutPosterSrc
  );
  const [callToAction, setCallToAction] = useState(`Dial ${transitSpec.ussdCode} FREE (Zero Friction)`);
  const [ctaType, setCtaType] = useState<'ussd' | 'specs' | 'report' | 'perks' | 'custom'>('ussd');
  const [ctaValue, setCtaValue] = useState(transitSpec.ussdCode);
  const [sponsorName, setSponsorName] = useState(`CivicDuty CD-Ops · ${transitSpec.municipalAuthority}`);
  const [targetAudience, setTargetAudience] = useState(`${transitSpec.stageTransportName} & Daily Commuters`);
  const [specs, setSpecs] = useState(
    isUganda
      ? 'A1/A2 Waterproof Outdoor Polypropylene Poster · High-Tack Adhesive'
      : `Outdoor Street Kiosk & Hub Poster · CivicDuty 3-Signal System (${transitSpec.countryCode})`
  );
  const [highlight1, setHighlight1] = useState(
    `Empowers ${transitSpec.stageTransportName.toLowerCase()} as frontline inspectors with direct municipal desk access`
  );
  const [highlight2, setHighlight2] = useState(
    isUganda
      ? 'Works instantly on simple Kabiriti phones via *3030# without internet bundles'
      : `Instant citizen reporting via ${transitSpec.ussdCode} & civicduty.site without friction`
  );
  const [highlight3, setHighlight3] = useState(
    'Verified frontline scouts earn monthly mobility & telecom data perks upon ticket validation'
  );

  useEffect(() => {
    setTitle(
      isUganda
        ? 'Bodaboda Stage Poster & Civic Alert'
        : `${transitSpec.countryName} ${transitSpec.stageTransportName}: Frontline Scouts Poster`
    );
    setCategory('bodaboda');
    setCategoryLabel(transitSpec.scoutTabLabel);
    setTagline(`${transitSpec.localSlogan} • SPEAK. SERVE. BE HEARD.`);
    setSummary(
      isUganda
        ? 'Empower stage riders as frontline municipal road defect inspectors. Report potholes, broken culverts, and extortion without internet bundles via zero-rated USSD.'
        : `Empower ${transitSpec.stageTransportName.toLowerCase()} in ${transitSpec.countryName} as frontline civic scouts reporting road hazards, damaged lanes, and public service outages directly to ${transitSpec.municipalAuthority}.`
    );
    setImageSrc(isUganda ? '/campaign/boda_poster_ad_1790426299023.jpg?v=20261113' : transitSpec.scoutPosterSrc);
    setCallToAction(isUganda ? `Dial ${transitSpec.ussdCode} FREE (Zero Data)` : `Join via ${transitSpec.ussdCode}`);
    setCtaType('ussd');
    setCtaValue(transitSpec.ussdCode);
    setSponsorName(`CivicDuty CD-Ops · ${transitSpec.municipalAuthority}`);
    setTargetAudience(`${transitSpec.stageTransportName} & Daily Commuters`);
    setSpecs(
      isUganda
        ? 'A1/A2 Waterproof Outdoor Polypropylene Poster · High-Tack Adhesive'
        : `Outdoor Street Kiosk & Hub Poster · CivicDuty 3-Signal System (${transitSpec.countryCode})`
    );
    setHighlight1(
      `Empowers ${transitSpec.stageTransportName.toLowerCase()} as frontline inspectors with direct municipal desk access`
    );
    setHighlight2(
      isUganda
        ? 'Works instantly on simple Kabiriti phones via *3030# without internet bundles'
        : `Instant citizen reporting via ${transitSpec.ussdCode} & civicduty.site without friction`
    );
    setHighlight3('Verified frontline scouts earn monthly mobility & telecom data perks upon ticket validation');
  }, [activeCountry, isUganda, transitSpec]);

  // Preset Template Loader
  const loadPreset = (presetKey: 'bodaboda' | 'bus' | 'ussd' | 'perks') => {
    const scoutImg = isUganda ? '/campaign/boda_poster_ad_1790426299023.jpg?v=20261113' : transitSpec.scoutPosterSrc;
    const busImg = isUganda ? '/campaign/kayoola_bus_branding_1788711208719.jpg?v=20261113' : transitSpec.busPosterSrc;

    if (presetKey === 'bodaboda') {
      setTitle(
        isUganda
          ? 'Bodaboda Community Stage Poster & Market Launch Campaign'
          : `${transitSpec.countryName} ${transitSpec.stageTransportName} Frontline Scouts Campaign`
      );
      setCategory('bodaboda');
      setCategoryLabel(transitSpec.scoutTabLabel);
      setTagline(`${transitSpec.localSlogan} • SPEAK. SERVE. BE HEARD.`);
      setSummary(
        isUganda
          ? 'High-visibility weather-resistant advertising poster tailored directly to Uganda’s 1.5M+ Bodaboda riders, stage chairmen, and SACCO leadership across Kampala, Wakiso, and national transit hubs.'
          : `Weather-resistant street kiosk and hub campaign tailored to ${transitSpec.countryName}’s ${transitSpec.stageTransportName.toLowerCase()} across ${transitSpec.stageLocations}.`
      );
      setImageSrc(scoutImg);
      setCallToAction(isUganda ? `Dial ${transitSpec.ussdCode} FREE (Zero Data)` : `Join Frontline Scouts (${transitSpec.ussdCode})`);
      setCtaType('ussd');
      setCtaValue(transitSpec.ussdCode);
      setSpecs(`A1/A2 Outdoor Poster & Frontline Kiosk Display (${transitSpec.countryName})`);
      setSponsorName(`CivicDuty Transit Ops · ${transitSpec.municipalAuthority}`);
      setTargetAudience(`${transitSpec.stageTransportName} & Commuters`);
      setHighlight1(`Empowers street scouts with direct escalation access to ${transitSpec.municipalAuthority}`);
      setHighlight2(
        isUganda
          ? 'Instant USSD *3030# access works on simple feature phones (Kabiriti) without internet bundles'
          : `Zero-friction reporting via ${transitSpec.ussdCode} & civicduty.site with verified GPS proofs`
      );
      setHighlight3('Monthly merit recognition and verified mobility/data perks for validated hazard reports');
      toast(`Loaded ${transitSpec.countryName} Frontline Scouts creative template`, 'emerald');
    } else if (presetKey === 'bus') {
      setTitle(
        isUganda
          ? 'Kayoola EVS Electric Bus Full Vehicle Wrap'
          : `${transitSpec.busPartnerName} 3-Signal Transit Fleet Campaign`
      );
      setCategory('bus');
      setCategoryLabel(isUganda ? 'Kayoola Electric Bus' : `${transitSpec.busPartnerName} Fleet`);
      setTagline('SPEAK. SERVE. BE HEARD. • Connect. Resolve. Progress.');
      setSummary(transitSpec.busProposalSummary);
      setImageSrc(busImg);
      setCallToAction('Inspect Vehicle Specs & Livery');
      setCtaType('specs');
      setCtaValue('transit_preview');
      setSpecs(`${transitSpec.busFleetType} · ${transitSpec.busRoutes}`);
      setSponsorName(`${transitSpec.busPartnerName} & CivicDuty Sovereign Fleet`);
      setTargetAudience('Metropolitan Commuters & Urban Residents');
      setHighlight1(`High-visibility public transit branding operating across ${transitSpec.busRoutes}`);
      setHighlight2('Onboard QR & shortcode prompts direct commuters to the live municipal complaint tracker');
      setHighlight3('Integrated citizen telemetry tracking fleet corridors and road surface quality');
      toast(`Loaded ${transitSpec.countryName} Transit Fleet template`, 'emerald');
    } else if (presetKey === 'ussd') {
      setTitle(
        isUganda
          ? 'Kabiriti *3030# Zero-Data Citizen Hotline'
          : `${transitSpec.countryName} ${transitSpec.ussdCode} Direct Citizen Hotline`
      );
      setCategory('ussd');
      setCategoryLabel(isUganda ? 'USSD Kabiriti Hotline' : `${transitSpec.ussdCode} Citizen Hotline`);
      setTagline(`NO BARRIERS? NO PROBLEM. USE ${transitSpec.ussdCode} ANYWHERE!`);
      setSummary(
        isUganda
          ? 'Nationwide zero-rated sovereign telecom gateway allowing citizens with basic 2G feature phones (Kabiriti) to report burst water pipes, blackouts, and council clinic shortages.'
          : `Nationwide low-bandwidth and USSD/SMS reporting gateway allowing every resident in ${transitSpec.countryName} to report water leaks, power outages, and road hazards.`
      );
      setImageSrc(scoutImg);
      setCallToAction(`Test ${transitSpec.ussdCode} Citizen Gateway`);
      setCtaType('ussd');
      setCtaValue(transitSpec.ussdCode);
      setSpecs(`Direct Citizen Shortcode Protocol · ${transitSpec.countryName}`);
      setSponsorName(`${transitSpec.municipalAuthority} & CivicDuty CD-Ops`);
      setTargetAudience('Urban & Rural Residents on All Handsets');
      setHighlight1('Works seamlessly on both smartphones and offline feature phones');
      setHighlight2('Instant ticket routing straight to assigned district & municipal engineers');
      setHighlight3('Real-time status notification with public SLA accountability timer');
      toast(`Loaded ${transitSpec.ussdCode} Hotline creative template`, 'emerald');
    } else if (presetKey === 'perks') {
      setTitle(`CSR & Community Utility Perk Escrow Vault (${transitSpec.countryCode})`);
      setCategory('noticeboard');
      setCategoryLabel('Watchdog Perk Fund');
      setTagline('SERVE YOUR COMMUNITY · EARN VERIFIED MOBILITY & DATA PERKS');
      setSummary(
        'Batch deposit pre-funded airtime, data, transit & utility vouchers for verified civic watchdogs. Open to individual citizens, diaspora patrons, and corporate CSR programs.'
      );
      setImageSrc(scoutImg);
      setCallToAction('Open Escrow Perk Vault');
      setCtaType('perks');
      setCtaValue('perk_vault');
      setSpecs('Smart Escrow Multi-Sig Vault · Transparent Public Audit Trail');
      setSponsorName('CivicDuty Perk Escrow Vault & Corporate CSR Patrons');
      setTargetAudience('Civic Watchdogs, Citizens & Corporate Donors');
      setHighlight1('Open to individual citizens, diaspora patrons, and corporate CSR programs');
      setHighlight2('Pre-funded transit, data, and utility allocations dispatched upon verified ticket resolution');
      setHighlight3('Transparent public audit trail on CivicDuty Accountability Ledger');
      toast('Loaded CSR Perk Vault creative template', 'emerald');
    }
  };

  // Submit Manufacturing Form
  const handleManufactureAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim() || !summary.trim()) {
      toast('Please enter title, tagline, and summary for the ad.', 'red');
      return;
    }

    const highlights: string[] = [highlight1, highlight2, highlight3].filter((h) => h.trim().length > 0);

    const newAd: CdOpsPromotionalAd = {
      id: `ad-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      category,
      categoryLabel: categoryLabel.trim() || 'Promotional Ad',
      tagline: tagline.trim(),
      summary: summary.trim(),
      imageSrc: imageSrc.trim() || transitSpec.scoutPosterSrc,
      callToAction: callToAction.trim() || 'View Campaign',
      ctaType,
      ctaValue: ctaValue.trim(),
      specs: specs.trim(),
      sponsorName: sponsorName.trim() || 'CivicDuty CD-Ops',
      targetAudience: targetAudience.trim() || 'General Public',
      published: true,
      postedAt: new Date().toISOString().slice(0, 10),
      highlights,
      impressions: 1,
      clicks: 0,
    };

    addPromotionalAd(newAd);
  };

  const totalImpressions = promotionalAds.reduce((acc, ad) => acc + (ad.impressions || 0), 0);
  const totalClicks = promotionalAds.reduce((acc, ad) => acc + (ad.clicks || 0), 0);
  const liveCount = promotionalAds.filter((ad) => ad.published).length;

  return (
    <div className="space-y-6">
      {/* Studio Top Banner & Specs Deep-Link */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono">
                CD-OPS AD MANUFACTURING STUDIO
              </span>
              <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Megaphone size={11} /> Multi-Channel Campaign Injection &amp; Feed Broadcasting
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {transitSpec.countryName} {transitSpec.scoutTabLabel} &amp; Transit Promotional Ad Creator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Manufacture region-authentic 3-Signal promotional advertisements for {transitSpec.countryName}. Once created, publish them directly to the citizen Civic Feed as interactive promotional bulletins.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => go('transit_preview')}
              className="px-3.5 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              title={`Open full ${transitSpec.countryName} transit blueprints & high-res posters`}
            >
              <Bus size={14} />
              <span>Full Vehicle &amp; Poster Specs</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Studio Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center">
          <div className="bg-black/30 rounded-xl p-2 border border-white/5">
            <div className="text-base font-black mono text-emerald-400">{liveCount}</div>
            <div className="text-[8px] mono text-slate-400 uppercase tracking-wider font-bold">Active on Civic Feed</div>
          </div>
          <div className="bg-black/30 rounded-xl p-2 border border-white/5">
            <div className="text-base font-black mono text-amber-400">{promotionalAds.length}</div>
            <div className="text-[8px] mono text-slate-400 uppercase tracking-wider font-bold">Total Manufactured</div>
          </div>
          <div className="bg-black/30 rounded-xl p-2 border border-white/5">
            <div className="text-base font-black mono text-cyan-400">{totalImpressions.toLocaleString()}</div>
            <div className="text-[8px] mono text-slate-400 uppercase tracking-wider font-bold">Total Reach / Impressions</div>
          </div>
          <div className="bg-black/30 rounded-xl p-2 border border-white/5">
            <div className="text-base font-black mono text-pink-400">{totalClicks.toLocaleString()}</div>
            <div className="text-[8px] mono text-slate-400 uppercase tracking-wider font-bold">Citizen Clicks &amp; Dial-Ins</div>
          </div>
        </div>
      </div>

      {/* Two-Column Studio: Creator Workbench on Left, Live Feed Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Creator Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Megaphone size={18} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Manufacture New Promotional Ad
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  Input ad creative, upload imagery, and specify citizen call-to-action
                </span>
              </div>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              1. Load Strategic Template Preset:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => loadPreset('bodaboda')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Bike size={13} />
                <span>{transitSpec.scoutTabLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('bus')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Bus size={13} />
                <span>{isUganda ? 'Kayoola Bus Wrap' : 'Transit Fleet Wrap'}</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('ussd')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-100 dark:bg-cyan-950/60 hover:bg-cyan-200 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Smartphone size={13} />
                <span>{isUganda ? '*3030# USSD Kabiriti' : `${transitSpec.ussdCode} Hotline`}</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('perks')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-700/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Gift size={13} />
                <span>Watchdog Perk Bounty</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleManufactureAd} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                  Advertising Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    const cat = e.target.value as any;
                    setCategory(cat);
                    const labels: Record<string, string> = {
                      bodaboda: transitSpec.scoutTabLabel,
                      bus: isUganda ? 'Kayoola Electric Bus' : `${transitSpec.busPartnerName} Fleet`,
                      train: 'Metropolitan Commuter Rail',
                      terminal: 'Transit Terminal Billboard',
                      radio: 'Radio & Broadcast Spot',
                      noticeboard: 'Community Watchdog Board',
                      ussd: isUganda ? 'USSD Kabiriti Hotline' : `${transitSpec.ussdCode} Citizen Hotline`,
                    };
                    setCategoryLabel(labels[cat] || 'Promotional Ad');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="bodaboda">{transitSpec.scoutTabLabel} Poster</option>
                  <option value="bus">{isUganda ? 'Kayoola Electric Bus Full Wrap' : 'Transit Fleet Full Wrap'}</option>
                  <option value="train">Commuter Railway Livery</option>
                  <option value="terminal">Transit Terminal Digital Billboard</option>
                  <option value="radio">Radio Sensitization Jingle</option>
                  <option value="noticeboard">Community Noticeboard &amp; Association Poster</option>
                  <option value="ussd">{transitSpec.ussdCode} Citizen Hotline Banner</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                Bold Headline Tagline (Catchphrase)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder={`e.g. ${transitSpec.localSlogan} • SPEAK. SERVE. BE HEARD.`}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                Ad Description &amp; Campaign Copy
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                  Creative Image Asset URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageSrc}
                    onChange={(e) => setImageSrc(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const scoutAsset = isUganda ? '/campaign/boda_poster_ad_1790426299023.jpg?v=20261113' : transitSpec.scoutPosterSrc;
                      const busAsset = isUganda ? '/campaign/kayoola_bus_branding_1788711208719.jpg?v=20261113' : transitSpec.busPosterSrc;
                      const sample = imageSrc === scoutAsset ? busAsset : scoutAsset;
                      setImageSrc(sample);
                    }}
                    className="px-2.5 py-1 text-[10px] mono rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 cursor-pointer"
                    title={`Swap between ${transitSpec.scoutTabLabel} and Transit Fleet image`}
                  >
                    Swap
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                  CTA Action Type
                </label>
                <select
                  value={ctaType}
                  onChange={(e) => {
                    const ct = e.target.value as any;
                    setCtaType(ct);
                    if (ct === 'ussd') setCallToAction(`Dial ${transitSpec.ussdCode} FREE`);
                    if (ct === 'specs') setCallToAction('Inspect Vehicle Specs & Livery');
                    if (ct === 'report') setCallToAction('File Road Defect Report');
                    if (ct === 'perks') setCallToAction('Open Escrow Perk Vault');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="ussd">Citizen Shortcode ({transitSpec.ussdCode})</option>
                  <option value="specs">Inspect Transit Blueprints</option>
                  <option value="report">File Sovereign Report</option>
                  <option value="perks">Perk Escrow Vault</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                  Interactive Button Label (Call To Action)
                </label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] mono uppercase font-bold text-slate-500 block mb-1">
                Sponsoring Authority / Partner
              </label>
              <input
                type="text"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Highlights */}
            <div className="space-y-1.5">
              <label className="text-[10px] mono uppercase font-bold text-slate-500 block">
                Key Campaign Highlights (3 Bullets)
              </label>
              <input
                type="text"
                value={highlight1}
                onChange={(e) => setHighlight1(e.target.value)}
                placeholder="Bullet 1..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs"
              />
              <input
                type="text"
                value={highlight2}
                onChange={(e) => setHighlight2(e.target.value)}
                placeholder="Bullet 2..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs"
              />
              <input
                type="text"
                value={highlight3}
                onChange={(e) => setHighlight3(e.target.value)}
                placeholder="Bullet 3..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs uppercase tracking-wider mono rounded-lg shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Megaphone size={16} />
              <span>Manufacture &amp; Post to Civic Feed</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Right Column: Live Feed Simulation Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-[11px] mono uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <Eye size={14} className="text-amber-500" />
              <span>Live Civic Feed Card Preview</span>
            </span>
            <span className="text-[9px] mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30">
              Interactive Mobile Mockup
            </span>
          </div>

          {/* Render Preview of How it appears on Feed */}
          <div className="card-gov p-4 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#161a22] text-white shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono">
                  PROMOTIONAL CIVIC AD
                </span>
                <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase">
                  {categoryLabel}
                </span>
              </div>
              <span className="text-[8.5px] font-mono text-slate-400">CD-OPS VERIFIED</span>
            </div>

            {/* Poster / Bus Wrap Image Preview */}
            <div className="w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-black relative group shadow-inner">
              <img
                src={imageSrc}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = transitSpec.scoutPosterSrc;
                }}
              />
              <div className="absolute inset-0 bg-black/55 flex flex-col justify-end p-2.5">
                <span className="text-[10px] font-bold uppercase text-amber-400 mono tracking-tight line-clamp-1">
                  {tagline}
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-black text-white leading-tight">{title}</h5>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {summary}
              </p>
            </div>

            {/* Highlights preview */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-white/5 text-[10px] text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 size={12} />
                <span>{highlight1 || 'Zero-rated sovereign citizen engagement'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 size={12} />
                <span>{highlight2 || 'Frontline street inspection & municipal response'}</span>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  toast(`Simulating Action: ${callToAction}`, 'emerald');
                }}
                className="flex-1 py-2.5 px-3 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {ctaType === 'ussd' && <PhoneCall size={13} />}
                {ctaType === 'specs' && <Bus size={13} />}
                {ctaType === 'perks' && <Gift size={13} />}
                <span>{callToAction}</span>
              </button>

              <button
                type="button"
                onClick={() => go('transit_preview')}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Specs</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[8.5px] font-mono text-slate-400">
              <span>Sponsor: {sponsorName}</span>
              <span>Audience: {targetAudience}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Inventory & Feed Broadcasting Manager */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Layers size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Manufactured Campaigns &amp; Civic Feed Broadcasting Manager
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">
                Toggle live feed broadcasting, monitor click-through analytics, or edit promotional creatives
              </span>
            </div>
          </div>

          <button
            onClick={() => go('feed')}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Inspect Live Civic Feed</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Campaign List */}
        <div className="space-y-3">
          {promotionalAds.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs font-mono">
              No promotional ads currently manufactured. Use the workbench above to create one.
            </div>
          ) : (
            promotionalAds.map((ad) => (
              <div
                key={ad.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-amber-500/40"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shrink-0 bg-black relative">
                    <img
                      src={ad.imageSrc}
                      alt={ad.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = transitSpec.scoutPosterSrc;
                      }}
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                        {ad.categoryLabel}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono flex items-center gap-1 ${
                          ad.published
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ad.published ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        {ad.published ? 'LIVE ON FEED' : 'DRAFT / PAUSED'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Posted: {ad.postedAt}
                      </span>
                    </div>

                    <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                      {ad.title}
                    </h5>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                      {ad.tagline}
                    </p>

                    <div className="text-[9.5px] font-mono text-slate-500 flex items-center gap-3">
                      <span>Audience: <strong>{ad.targetAudience}</strong></span>
                      <span>•</span>
                      <span>Sponsor: <strong>{ad.sponsorName}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right Actions & Telemetry */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="text-right hidden sm:block font-mono text-xs">
                    <div className="text-slate-900 dark:text-white font-bold">
                      {(ad.impressions || 0).toLocaleString()} <span className="text-[9px] text-slate-400">views</span>
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                      {(ad.clicks || 0).toLocaleString()} <span className="text-[9px] text-slate-400">clicks</span>
                    </div>
                  </div>

                  {/* Broadcast Toggle */}
                  <button
                    type="button"
                    onClick={() => togglePromotionalAdStatus(ad.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      ad.published
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-600 hover:text-white'
                    }`}
                  >
                    <span>{ad.published ? 'Broadcast Active' : 'Broadcast to Feed'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => go('transit_preview')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
                    title="View Full Vehicle Livery Specs"
                  >
                    <Bus size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deletePromotionalAd(ad.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 transition-colors"
                    title="Delete Ad Creative"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
