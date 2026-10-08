import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GOV_CODES } from '../data/tiers';
import { CountrySelector } from '../components/CountrySelector';
import { HeaderSettingsMenu } from '../components/HeaderSettingsMenu';
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
  HardHat,
  ShieldAlert,
  Search,
  ArrowRight,
  CheckCircle2,
  Layers,
  TrendingDown,
  Gift,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

export const EntityGatewayView: React.FC = () => {
  const { go, execGovLoginByData, toast, selectedCountry, openLegalCenter } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register_info'>('signin');
  const [code, setCode] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMarketBrief, setShowMarketBrief] = useState(false);

  const activeCountry = selectedCountry || 'UG';
  const profile = getCountryDesksProfile(activeCountry);

  const categories = [
    { id: 'all', label: 'All Providers', icon: Layers },
    { id: 'education', label: 'Schools & Unis', icon: GraduationCap },
    { id: 'health', label: 'Hospitals & Clinics', icon: HeartPulse },
    { id: 'food_dining', label: 'Dining & Food', icon: UtensilsCrossed },
    { id: 'banking_finance', label: 'Banks & SACCOs', icon: Landmark },
    { id: 'transport_cooperative', label: 'Transit & Boda', icon: Bus },
    { id: 'private_utility_telecom', label: 'Utilities & Telecom', icon: Zap },
    { id: 'private_contractor', label: 'Contractors', icon: HardHat },
    { id: 'ngo_civil_society', label: 'NGOs & CSOs', icon: ShieldAlert },
  ];

  const handleMountCode = (inputCode?: string) => {
    const targetCode = (inputCode || code).trim().toUpperCase();
    if (!targetCode) {
      toast('Please enter your Entity Access Code', 'amber');
      return;
    }

    const providerMatch = profile.verifiedProviders.find((p) => p.code === targetCode);

    const data =
      GOV_CODES[targetCode] ||
      (providerMatch
        ? {
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
          }
        : null);

    if (!data) {
      toast(`Code "${targetCode}" not recognized. Please check your provider desk invite or register.`, 'red');
      return;
    }

    execGovLoginByData(data);
    toast(`Provider Desk mounted: ${data.organization_name || targetCode}`, 'emerald');
    go('gov_inbox');
  };

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
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 pb-20 animate-fade-in">
      {/* Top Studio Navigation Bar */}
      <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#161a22]/95 backdrop-blur-md border-b border-[#e3e6ea] dark:border-[#262b36] px-3.5 sm:px-5 py-2.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => go('splash')}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ChevronLeft size={15} />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <CountrySelector variant="compact" />
          <HeaderSettingsMenu />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-3.5 sm:px-5 pt-4 space-y-4">
        {/* Studio Identity Header Card */}
        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Service Provider Infrastructure
                </span>
                <span>·</span>
                <span>{profile.countryName} Terminal</span>
                <span>·</span>
                <span>24h–48h SLA</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Service Provider Desk
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Public and private institutions in {profile.countryName} duty-bound to serve citizens. Manage customer reports, monitor published SLAs, and maintain verified public trust scores.
              </p>
            </div>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-[#e3e6ea] dark:border-[#262b36] shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <KeyRound size={13} className={activeTab === 'signin' ? 'text-emerald-600 dark:text-emerald-400' : ''} />
              <span>Provider Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register_info')}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'register_info'
                  ? 'bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-[#e3e6ea] dark:border-[#262b36] shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 size={13} className={activeTab === 'register_info' ? 'text-emerald-600 dark:text-emerald-400' : ''} />
              <span>30-Day Free Trial</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SIGN IN / MOUNT ACTIVE DESK */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            {/* Direct Code Input Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Enter Entity Access Code ({profile.countryName})
                </label>
                <span className="text-[10px] font-mono text-slate-400">
                  Direct Desk Mount
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`e.g. ${profile.samplePlaceholder}`}
                  className="flex-1 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2.5 text-xs font-mono font-semibold placeholder:text-slate-400 uppercase focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleMountCode();
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleMountCode()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>Mount Desk</span>
                  <ArrowRight size={13} />
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Assigned to entity heads, customer care leads, quality assurance officers, and ombudsmen in {profile.countryName}.
              </p>
            </div>

            {/* Verified Provider Presets Directory */}
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                  <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Verified Provider Desks ({profile.countryName})</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {combinedProviders.length} active desks · Tap to mount
                </span>
              </div>

              {/* Category Filter Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold whitespace-nowrap transition-colors border cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
                      }`}
                    >
                      <Icon size={11} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center">
                <Search size={13} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${profile.countryName} schools, hospitals, banks, transit SACCOs, utilities...`}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg pl-8 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Provider Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-0.5">
                {combinedProviders.map((item, idx) => (
                  <div
                    key={`${item.code}-${idx}`}
                    className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/60 transition-colors flex flex-col justify-between gap-2.5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {item.code}
                        </span>
                        <span>
                          {activeCountry} · {item.category.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-1">
                        {item.orgName}
                      </p>
                      {item.officerName && (
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {item.officerName} · {item.slaHours}h SLA
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMountCode(item.code)}
                      className="w-full py-1.5 px-2.5 rounded-md bg-white dark:bg-[#161a22] hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-600 text-[10.5px] font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Mount Provider Desk</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTER & ONBOARD NEW PROVIDER */}
        {activeTab === 'register_info' && (
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4 animate-fade-in">
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                Founding Partner Program · $0 Due Today
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Claim &amp; Register Your Provider Wall
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every verified school, healthcare center, restaurant, bank branch, transit cooperative, or utility receives a dedicated public wall to resolve citizen inquiries and maintain verified SLA compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Prevent Churn</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  82% of customers who experience unresolved service delays switch to higher-rated alternatives.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>1st Unit Free Forever</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Single-branch community clinics, primary schools, and neighborhood enterprises pay nothing.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Verified Trust Score</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Build public brand credibility through transparent response times and verified proof uploads.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => go('entity_register')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold rounded-lg py-2.5 px-4 text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Provider Registration</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Collapsible Market Competition & Customer Retention Architecture Accordion */}
        <div className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowMarketBrief(!showMarketBrief)}
            className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left hover:bg-[#f8f9fa] dark:hover:bg-[#1e232d] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Building2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Market Competition &amp; Customer Retention Architecture ({profile.countryName})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 shrink-0">
              <span>{showMarketBrief ? 'Hide' : 'Consumer Choice Brief'}</span>
              {showMarketBrief ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </div>
          </button>

          {showMarketBrief && (
            <div className="px-4 pb-4 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {profile.marketDynamicsNote}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10.5px]">
                <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">1. Customer Grievance</span>
                  <span className="text-slate-500 text-[10px]">Citizen logs verified service report</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20">
                  <span className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <TrendingDown size={11} /> 2. Delayed Service Risk
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">Unanswered claims drive customer churn</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={11} /> 3. Verified Care Desk
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">Captures market share &amp; loyalty</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Studio Cross-Links Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                <Landmark size={14} />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate">
                  Statutory Government Desk
                </span>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block truncate">
                  Ministries, Districts &amp; Regulators
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => go('ob2')}
              className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-[10.5px] font-mono font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Gov Desk →
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Gift size={14} />
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block truncate">
                  CSR Perk Escrow Vault
                </span>
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block truncate">
                  Sponsor watchdog airtime &amp; data
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => go('perk_vault')}
              className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-amber-500 border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-[10.5px] font-mono font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Escrow →
            </button>
          </div>
        </div>

        {/* Quiet Legal Charter Footer Strip */}
        <div className="flex items-center justify-between gap-2 px-1 pt-1 text-[10.5px] font-mono text-slate-500 dark:text-slate-400 flex-wrap">
          <span>30-Day Founding Partner Trial · $0 Due Today</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openLegalCenter('terms')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline cursor-pointer"
            >
              Provider Terms
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => openLegalCenter('privacy')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline cursor-pointer"
            >
              Privacy Charter
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => openLegalCenter('ethics')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline cursor-pointer"
            >
              Ethics Covenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
