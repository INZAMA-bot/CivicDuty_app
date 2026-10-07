import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, GovCodeData } from '../types';
import { GOV_CODES } from '../data/tiers';
import { COUNTRIES } from '../data/countries';
import { CountrySelector } from '../components/CountrySelector';
import { getCountryDesksProfile } from '../data/countryDesks';
import {
  ChevronLeft,
  Building2,
  KeyRound,
  GraduationCap,
  HeartPulse,
  UtensilsCrossed,
  Landmark,
  Bus,
  Zap,
  Radio,
  HardHat,
  ShieldAlert,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  TrendingDown,
  UserCheck,
  Globe2,
  Gift
} from 'lucide-react';

export const EntityGatewayView: React.FC = () => {
  const { go, execGovLoginByData, toast, selectedCountry, setSelectedCountry, openLegalCenter } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register_info'>('signin');
  const [code, setCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCountry = selectedCountry || 'UG';
  const profile = getCountryDesksProfile(activeCountry);

  const categories = [
    { id: 'all', label: 'All Providers', icon: Layers },
    { id: 'education', label: 'Schools & Universities', icon: GraduationCap },
    { id: 'health', label: 'Hospitals & Clinics', icon: HeartPulse },
    { id: 'food_dining', label: 'Restaurants & Dining', icon: UtensilsCrossed },
    { id: 'banking_finance', label: 'Banks & SACCOs', icon: Landmark },
    { id: 'transport_cooperative', label: 'Transit & Boda SACCOs', icon: Bus },
    { id: 'private_utility_telecom', label: 'Utilities & Telecoms', icon: Zap },
    { id: 'private_contractor', label: 'Civil Contractors', icon: HardHat },
    { id: 'ngo_civil_society', label: 'NGOs & Civil Society', icon: ShieldAlert },
  ];

  const handleMountCode = (inputCode?: string) => {
    const targetCode = (inputCode || code).trim().toUpperCase();
    if (!targetCode) {
      toast('Please enter your Entity Access Code', 'amber');
      return;
    }

    const providerMatch = profile.verifiedProviders.find((p) => p.code === targetCode);

    const data = GOV_CODES[targetCode] || (providerMatch ? {
      country: activeCountry,
      dept: providerMatch.category,
      scope: providerMatch.code.toLowerCase(),
      role: 'spokesperson',
      role_label: providerMatch.roleLabel,
      organization_name: providerMatch.orgName,
      officer_name: providerMatch.officerName,
      entity_type: 'non_government_entity',
      entity_category: providerMatch.category,
      is_utility: true,
    } : null);

    if (!data) {
      toast(`Code "${targetCode}" not recognized. Please check your provider desk invite or register.`, 'red');
      return;
    }

    execGovLoginByData(data);
    toast(`Provider Desk mounted: ${data.organization_name || targetCode}`, 'emerald');
    go('gov_inbox');
  };

  // Combine profile.verifiedProviders with any additional GOV_CODES for activeCountry
  const combinedProviders = [
    ...profile.verifiedProviders,
    ...Object.entries(GOV_CODES)
      .filter(([cCode, data]) => {
        if (data.country !== activeCountry) return false;
        if (data.entity_type !== 'non_government_entity' && !data.entity_category && !data.is_utility) return false;
        if (profile.verifiedProviders.some((p) => p.code === cCode)) return false;
        return true;
      })
      .map(([cCode, data]) => ({
        code: cCode,
        orgName: data.organization_name || data.role_label || cCode,
        category: data.entity_category || 'private_utility_telecom',
        roleLabel: data.role_label || 'Customer Care Desk',
        officerName: data.officer_name,
        slaHours: 24,
      })),
  ].filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = item.code.toLowerCase().includes(q);
      const matchOrg = (item.orgName || '').toLowerCase().includes(q);
      const matchRole = (item.roleLabel || '').toLowerCase().includes(q);
      const matchOfficer = (item.officerName || '').toLowerCase().includes(q);
      return matchCode || matchOrg || matchRole || matchOfficer;
    }
    return true;
  });

  return (
    <div className="p-5 space-y-5 pt-6 animate-fade-in text-slate-800 dark:text-slate-100 pb-16">
      {/* Top Bar with Country Switcher */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => go('splash')}
            className="flex items-center gap-1 text-[10px] mono text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-bold"
          >
            <ChevronLeft size={14} /> Back to Home
          </button>
          <CountrySelector variant="compact" />
        </div>

        <div className="flex items-center justify-between">
          <div className="tagline mb-1 font-bold text-emerald-700 dark:text-emerald-400">
            SERVICE PROVIDER INFRASTRUCTURE
          </div>
          <span className="text-[8.5px] mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/60">
            {profile.countryName} Terminal
          </span>
        </div>

        <h2 className="text-[24px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Service Provider Desk
        </h2>
        <p className="text-[12.5px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          Public & private institutions in {profile.countryName} duty-bound to serve citizens. Manage customer reports, monitor published SLAs, and maintain verified public trust scores.
        </p>
      </div>

      {/* Global Country Bar Dropdown */}
      <CountrySelector variant="bar" />

      {/* Customer Service & Market Competition Dynamics Banner */}
      <div className="p-4 rounded-3xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-500/30 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase mono text-amber-900 dark:text-amber-300">
          <span className="flex items-center gap-1.5">
            <Building2 size={14} className="text-emerald-600" /> Market Competition & Customer Retention Architecture ({profile.countryName})
          </span>
          <span className="text-[8px] bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded font-bold border border-amber-300 dark:border-amber-700">
            Consumer Choice Over Regulation
          </span>
        </div>
        
        <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
          {profile.marketDynamicsNote}
        </p>

        <div className="grid grid-cols-3 gap-2 text-center text-[8.5px] mono pt-1">
          <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-slate-100 block">1. Customer Grievance</span>
            <span className="text-slate-500 dark:text-slate-400 text-[7.5px]">Citizen files live report</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60">
            <span className="font-black text-rose-800 dark:text-rose-300 block flex items-center justify-center gap-1">
              <TrendingDown size={10} /> 2. Delayed Service
            </span>
            <span className="text-rose-700 dark:text-rose-400 text-[7.5px]">Customers defect to rivals</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40">
            <span className="font-black text-emerald-800 dark:text-emerald-300 block flex items-center justify-center gap-1">
              <CheckCircle2 size={10} /> 3. Verified Care Desk
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 text-[7.5px]">Captures market share</span>
          </div>
        </div>
      </div>

      {/* Main Dual-Action Toggle Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('signin')}
          className={`py-2.5 px-3 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'signin'
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <KeyRound size={14} />
          <span>Provider Login (Desk Code)</span>
        </button>
        <button
          onClick={() => setActiveTab('register_info')}
          className={`py-2.5 px-3 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'register_info'
              ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 size={14} />
          <span>New Sign Up (30d Free Trial)</span>
        </button>
      </div>

      {/* Quick Trust & Legal Charter Strip */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400 flex-wrap">
        <span>30-Day Founding Partner Trial ($0 Due Today)</span>
        <div className="flex items-center gap-2 font-bold">
          <button
            type="button"
            onClick={() => openLegalCenter('terms')}
            className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Provider Terms
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => openLegalCenter('privacy')}
            className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Privacy Charter
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => openLegalCenter('ethics')}
            className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Ethics Covenant
          </button>
        </div>
      </div>

      {/* TAB 1: SIGN IN / MOUNT ACTIVE DESK */}
      {activeTab === 'signin' && (
        <div className="space-y-4">
          {/* Direct Code Input Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="text-[9.5px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-black">
              Enter Entity Access Code ({profile.countryName})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`e.g. ${profile.samplePlaceholder}`}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs mono font-bold placeholder:text-slate-400 uppercase focus:outline-none focus:border-emerald-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleMountCode();
                }}
              />
              <button
                onClick={() => handleMountCode()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all"
              >
                <span>Mount</span>
                <ArrowRight size={13} />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-400">
              Assigned to official entity heads, customer care leads, quality assurance officers & ombudsmen in {profile.countryName}.
            </p>
          </div>

          {/* Preset Sector Filter & Search */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] mono font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 size={12} className="text-emerald-600" /> Quick-Mount Verified Providers ({profile.countryName})
              </span>
              <span className="text-[8px] mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-300 dark:border-emerald-700/60">
                {profile.countryCode} 1-Tap Presets
              </span>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8.5px] mono font-bold whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600 dark:border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <Icon size={11} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${profile.countryName} schools, hospitals, restaurants, banks, transit SACCOs, utilities...`}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3 py-2 text-[9.5px] mono placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Entity Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {combinedProviders.map((item, idx) => {
                return (
                  <div
                    key={`${item.code}-${idx}`}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between space-y-2 shadow-2xs group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] mono font-black text-emerald-700 dark:text-emerald-400 tracking-wide">
                          {item.code}
                        </span>
                        <span className="text-[7px] mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60">
                          [{activeCountry}] {item.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10.5px] font-bold text-slate-900 dark:text-slate-100 mt-1 leading-snug line-clamp-1">
                        {item.orgName}
                      </p>
                      {item.officerName && (
                        <p className="text-[8px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          Officer: {item.officerName} · SLA: {item.slaHours}h
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleMountCode(item.code)}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 py-1.5 px-2 rounded-lg text-[8.5px] mono font-bold flex items-center justify-between transition-colors"
                    >
                      <span>Mount Provider Desk</span>
                      <span className="text-[7.5px]">→</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTER & ONBOARD NEW PROVIDER */}
      {activeTab === 'register_info' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight flex items-center gap-2">
              <Building2 size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Claim & Register Your Provider Wall</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every verified school, healthcare center, restaurant, bank branch, transit cooperative, or utility gets a dedicated public wall to receive citizen inquiries, publish official circulars, and resolve grievances within published SLAs.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Prevent Customer Churn & Defection:</strong>
                  <span className="text-slate-600 dark:text-slate-400 block text-[11px]">82% of citizens who experience delays or bad care switch to higher-rated alternatives. Active SLA desks stem the loss.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">1st Parish/Unit is 100% Free Forever:</strong>
                  <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Local community clinics, primary schools, and neighborhood businesses pay nothing.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Market-Driven Trust Score:</strong>
                  <span className="text-slate-600 dark:text-slate-400 block text-[11px]">Build public brand credibility based on prompt response times, customer satisfaction, and on-time resolution.</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => go('entity_register')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl py-3 px-4 text-xs uppercase tracking-wider mono flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
              >
                <span>Proceed to Provider Registration</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cross-Link to Gov Desk */}
      <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/70 dark:bg-indigo-950/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
          <Landmark size={15} className="text-indigo-600 dark:text-indigo-400" />
          <div>
            <span className="font-bold block text-[11px]">Are you a Statutory Government Official?</span>
            <span className="text-[9px] text-indigo-700/80 dark:text-indigo-300/80">Ministries, CAO Districts, Municipalities & Regulators</span>
          </div>
        </div>
        <button
          onClick={() => go('ob2')}
          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[9.5px] mono font-bold uppercase transition-colors"
        >
          Gov Desk →
        </button>
      </div>

      {/* Cross-Link to CSR Perk Escrow Vault */}
      <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <Gift size={15} className="text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-bold block text-[11px]">CSR &amp; Digital Utility Perk Escrow Vault</span>
            <span className="text-[9px] text-amber-700/80 dark:text-amber-300/80">Batch deposit pre-funded airtime, data &amp; utility vouchers for civic watchdogs</span>
          </div>
        </div>
        <button
          onClick={() => go('perk_vault')}
          className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[9.5px] mono font-bold uppercase transition-colors shrink-0"
        >
          Escrow Vault →
        </button>
      </div>
    </div>
  );
};
