import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CdOpsPromotionalAd } from '../../types';
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
    go,
    toast,
  } = useApp();

  // Manufacturing Form State
  const [title, setTitle] = useState('Bodaboda Stage Poster & Civic Alert');
  const [category, setCategory] = useState<'bodaboda' | 'bus' | 'train' | 'terminal' | 'radio' | 'noticeboard' | 'ussd'>('bodaboda');
  const [categoryLabel, setCategoryLabel] = useState('Bodaboda Stage Poster');
  const [tagline, setTagline] = useState('BODA MAN: GWE BOSS W’OLUGUUDO! • SPEAK. SERVE. BE HEARD.');
  const [summary, setSummary] = useState(
    'Empower stage riders as frontline municipal road defect inspectors. Report potholes, broken culverts, and extortion without internet bundles via zero-rated USSD.'
  );
  const [imageSrc, setImageSrc] = useState('/campaign/boda_poster_ad_1790426299023.jpg');
  const [callToAction, setCallToAction] = useState('Dial *3030# FREE (Zero Data)');
  const [ctaType, setCtaType] = useState<'ussd' | 'specs' | 'report' | 'perks' | 'custom'>('ussd');
  const [ctaValue, setCtaValue] = useState('*3030#');
  const [sponsorName, setSponsorName] = useState('CivicDuty CD-Ops · KCCA Transit Accord');
  const [targetAudience, setTargetAudience] = useState('Bodaboda Riders, Stage Chairmen & Commuters');
  const [specs, setSpecs] = useState('A1/A2 Waterproof Outdoor Polypropylene Poster · High-Tack Adhesive');
  const [highlight1, setHighlight1] = useState('Empowers riders as frontline street inspectors with direct council access');
  const [highlight2, setHighlight2] = useState('Works instantly on simple Kabiriti phones via *3030# without internet bundles');
  const [highlight3, setHighlight3] = useState('Verified riders earn fuel and telecom data perks upon defect validation');

  // Preset Template Loader
  const loadPreset = (presetKey: 'bodaboda' | 'bus' | 'ussd' | 'perks') => {
    if (presetKey === 'bodaboda') {
      setTitle('Bodaboda Community Stage Poster & Market Launch Campaign');
      setCategory('bodaboda');
      setCategoryLabel('Bodaboda Stage Poster');
      setTagline('BODA MAN: GWE BOSS W’OLUGUUDO! • SPEAK. SERVE. BE HEARD.');
      setSummary(
        'High-visibility weather-resistant advertising poster tailored directly to Uganda’s 1.5M+ Bodaboda riders, stage chairmen, and SACCO leadership across Kampala, Wakiso, and national transit hubs.'
      );
      setImageSrc('/campaign/boda_poster_ad_1790426299023.jpg');
      setCallToAction('Dial *3030# FREE (Zero Data)');
      setCtaType('ussd');
      setCtaValue('*3030#');
      setSpecs('A1/A2 Waterproof Outdoor Polypropylene Poster · High-Tack Adhesive & Stage Noticeboard Mount');
      setSponsorName('CivicDuty Transit Ops · KCCA & Works Accord');
      setTargetAudience('Bodaboda Riders, SACCO Chairmen & Commuters');
      setHighlight1('Empowers riders as frontline street inspectors with direct access to KCCA & Ministry of Works');
      setHighlight2('Instant USSD *3030# access works on simple feature phones (Kabiriti) without internet bundles');
      setHighlight3('Stage SACCO recognition and verified rider fuel perks for validated road reports');
      toast('Loaded Bodaboda Stage Poster creative template', 'emerald');
    } else if (presetKey === 'bus') {
      setTitle('Kayoola EVS Electric Bus Full Vehicle Wrap');
      setCategory('bus');
      setCategoryLabel('Kayoola Electric Bus');
      setTagline('SPEAK. SERVE. BE HEARD. • Connect. Resolve. Progress.');
      setSummary(
        'Full exterior commercial vehicle wrap for the 10.5m & 12m Kiira Motors Kayoola EVS transit bus, operating along high-density metropolitan routes.'
      );
      setImageSrc('/campaign/kayoola_bus_branding_1788711208719.jpg');
      setCallToAction('Inspect Vehicle Specs & Livery');
      setCtaType('specs');
      setCtaValue('transit_preview');
      setSpecs('3M IJ180mC-10 Vinyl with Cast Lamination · High-Contrast UV Resistant');
      setSponsorName('Kiira Motors & CivicDuty Sovereign Fleet');
      setTargetAudience('Metropolitan Commuters & Urban Residents');
      setHighlight1('Zero-emission sovereign public transit branding operating along Northern Bypass and Jinja Road');
      setHighlight2('Onboard QR code scans direct commuters to the municipal complaint tracker');
      setHighlight3('Integrated digital ticket telemetry tracking bus arrival and road quality feedback');
      toast('Loaded Kayoola EVS Bus Wrap creative template', 'emerald');
    } else if (presetKey === 'ussd') {
      setTitle('Kabiriti *3030# Zero-Data Citizen Hotline');
      setCategory('ussd');
      setCategoryLabel('USSD Kabiriti Hotline');
      setTagline('NO SMARTPHONE? NO INTERNET? DIAL *3030# FOR FREE!');
      setSummary(
        'Nationwide zero-rated sovereign telecom gateway allowing citizens with basic 2G feature phones (Kabiriti) to report burst water pipes, blackouts, and council clinic shortages.'
      );
      setImageSrc('/campaign/boda_poster_ad_1790426299023.jpg');
      setCallToAction('Test *3030# USSD Gateway');
      setCtaType('ussd');
      setCtaValue('*3030#');
      setSpecs('Zero-Rated SS7 / SIGTRAN USSD Protocol via MTN & Airtel Core Switches');
      setSponsorName('UCC, Ministry of ICT & CivicDuty CD-Ops');
      setTargetAudience('Grassroots Rural & Urban Citizens with 2G Handsets');
      setHighlight1('Works on any basic mobile phone without airtime or internet bundles');
      setHighlight2('Zero data charge approved under UCC Universal Service Access Fund');
      setHighlight3('Instant SMS confirmation with sovereign ticket serial number');
      toast('Loaded USSD *3030# Hotline creative template', 'emerald');
    } else if (presetKey === 'perks') {
      setTitle('CSR & Digital Utility Perk Escrow Vault');
      setCategory('noticeboard');
      setCategoryLabel('Watchdog Perk Fund');
      setTagline('SERVE YOUR COMMUNITY · EARN PRE-FUNDED AIRTIME & DATA');
      setSummary(
        'Batch deposit pre-funded airtime, data & utility vouchers for civic watchdogs. Open to individual citizens, diaspora patrons, and corporate CSR programs.'
      );
      setImageSrc('/campaign/boda_poster_ad_1790426299023.jpg');
      setCallToAction('Open Escrow Perk Vault');
      setCtaType('perks');
      setCtaValue('perk_vault');
      setSpecs('Smart Escrow Multi-Sig Vault · Mobile Money & Card Gateway Integration');
      setSponsorName('CivicDuty Perk Escrow Vault & Corporate CSR Patrons');
      setTargetAudience('Civic Watchdogs, Citizens & Corporate Donors');
      setHighlight1('Open to individual citizens, diaspora patrons, and corporate CSR programs');
      setHighlight2('Pre-funded telecom data bundles and water utility discounts dispatched upon verified ticket resolution');
      setHighlight3('Transparent public audit trail on Supreme SAI Chain');
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
      imageSrc: imageSrc.trim() || '/campaign/boda_poster_ad_1790426299023.jpg',
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
              Bodaboda Stage Posters &amp; Transit Promotional Ad Creator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Manufacture high-impact promotional advertisements between you and CD-Ops. Once created, publish them directly to the citizen Civic Feed as interactive promotional bulletins.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => go('transit_preview')}
              className="px-3.5 py-2 rounded-lg bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold mono uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
              title="Open full Kayoola bus engineering blueprints & high-res posters"
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
                <span>Bodaboda Stage Poster</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('bus')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Bus size={13} />
                <span>Kayoola Bus Wrap</span>
              </button>
              <button
                type="button"
                onClick={() => loadPreset('ussd')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-100 dark:bg-cyan-950/60 hover:bg-cyan-200 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Smartphone size={13} />
                <span>*3030# USSD Kabiriti</span>
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
                      bodaboda: 'Bodaboda Stage Poster',
                      bus: 'Kayoola Electric Bus',
                      train: 'Metropolitan Commuter Train',
                      terminal: 'Transit Terminal Billboard',
                      radio: 'FM Radio Jingle & Drop',
                      noticeboard: 'Community SACCO Board',
                      ussd: 'USSD Kabiriti Hotline',
                    };
                    setCategoryLabel(labels[cat] || 'Promotional Ad');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="bodaboda">Bodaboda Community Stage Poster</option>
                  <option value="bus">Kayoola Electric Bus Full Wrap</option>
                  <option value="train">Commuter Railway Livery</option>
                  <option value="terminal">Transit Terminal Digital Billboard</option>
                  <option value="radio">FM Radio Sensitization Jingle</option>
                  <option value="noticeboard">Community Noticeboard &amp; SACCO Poster</option>
                  <option value="ussd">*3030# Kabiriti Feature Phone Banner</option>
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
                placeholder="e.g. BODA MAN: GWE BOSS W'OLUGUUDO! • SPEAK. SERVE. BE HEARD."
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
                      const sample =
                        imageSrc === '/campaign/boda_poster_ad_1790426299023.jpg'
                          ? '/campaign/kayoola_bus_branding_1788711208719.jpg'
                          : '/campaign/boda_poster_ad_1790426299023.jpg';
                      setImageSrc(sample);
                    }}
                    className="px-2.5 py-1 text-[10px] mono rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                    title="Swap between Bodaboda Poster and Kayoola Bus Wrap image"
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
                    if (ct === 'ussd') setCallToAction('Dial *3030# FREE (Zero Data)');
                    if (ct === 'specs') setCallToAction('Inspect Vehicle Specs & Livery');
                    if (ct === 'report') setCallToAction('File Road Defect Report');
                    if (ct === 'perks') setCallToAction('Open Escrow Perk Vault');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="ussd">Zero-Data USSD (*3030#)</option>
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/campaign/boda_poster_ad_1790426299023.jpg';
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
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/campaign/boda_poster_ad_1790426299023.jpg';
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
