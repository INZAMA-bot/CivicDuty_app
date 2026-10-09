import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronRight, Search, Check, Globe2, X, Compass, Lock, ShieldCheck, FileCheck2 } from 'lucide-react';
import { CountryCode, IdentityDocumentType } from '../types';
import { COUNTRIES } from '../data/countries';
import { useApp } from '../context/AppContext';

interface CountrySelectorProps {
  value?: CountryCode;
  onChange?: (country: CountryCode) => void;
  variant?: 'compact' | 'bar' | 'card' | 'inline_button' | 'menu_item';
  label?: string;
  className?: string;
  onModalClose?: () => void;
}

// Priority hubs displayed at top for 1-tap switching
const POPULAR_HUBS: CountryCode[] = [
  'UG', 'KE', 'NG', 'GH', 'RW', 'TZ', 'ZA', 'ET', 'EG', 'DE', 'US', 'GB', 'IN'
];

type Region = 'ALL' | 'AFRICA' | 'EUROPE' | 'AMERICAS' | 'ASIA_PACIFIC' | 'MIDDLE_EAST';

const REGION_CODES: Record<Region, string[]> = {
  ALL: [],
  AFRICA: [
    'UG', 'KE', 'NG', 'GH', 'RW', 'TZ', 'ZA', 'ET', 'EG', 'SN', 'ZM', 'ZW',
    'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG',
    'CD', 'CI', 'DJ', 'GQ', 'ER', 'SZ', 'GA', 'GM', 'GN', 'GW', 'LS', 'LR',
    'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'ST', 'SC',
    'SL', 'SO', 'SS', 'SD', 'TG', 'TN'
  ],
  EUROPE: [
    'DE', 'GB', 'FR', 'IT', 'ES', 'PT', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO',
    'DK', 'FI', 'IE', 'PL', 'CZ', 'GR', 'RO', 'HU', 'UA', 'HR', 'BG', 'SK',
    'RS', 'EE', 'LV', 'LT', 'SI', 'LU', 'IS', 'AL', 'MD', 'BA', 'ME', 'MK',
    'AD', 'AM', 'AZ', 'BY', 'CY', 'GE', 'XK', 'LI', 'MT', 'MC', 'SM', 'VA', 'RU'
  ],
  AMERICAS: [
    'US', 'CA', 'MX', 'BR', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU',
    'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'JM', 'TT', 'GY',
    'SR', 'BS', 'BB', 'BZ', 'HT', 'AG', 'DM', 'GD', 'KN', 'LC', 'VC'
  ],
  ASIA_PACIFIC: [
    'IN', 'CN', 'JP', 'KR', 'ID', 'PK', 'BD', 'PH', 'VN', 'TH', 'MY', 'SG',
    'AU', 'NZ', 'MM', 'LK', 'NP', 'KH', 'MN', 'TW', 'PG', 'FJ', 'UZ', 'KZ',
    'AF', 'BT', 'BN', 'KG', 'LA', 'MV', 'KP', 'TJ', 'TL', 'TM', 'HK', 'KI',
    'MH', 'FM', 'NR', 'PW', 'WS', 'SB', 'TO', 'TV', 'VU'
  ],
  MIDDLE_EAST: [
    'AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'IL', 'JO', 'LB', 'IQ', 'IR', 'YE',
    'SY', 'TR', 'PS'
  ]
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  variant = 'compact',
  label = 'Select Country Jurisdiction',
  className = '',
  onModalClose,
}) => {
  const { selectedCountry: ctxCountry, setSelectedCountry: setCtxCountry, user, setUser, toast, view } = useApp();
  const currentCode = (value || ctxCountry || 'UG').toUpperCase();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('ALL');
  const [pendingForeignCode, setPendingForeignCode] = useState<CountryCode | null>(null);
  const [foreignDocType, setForeignDocType] = useState<IdentityDocumentType>('work_permit');
  const [foreignPermitNo, setForeignPermitNo] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isGlobalSwitcher = !onChange && view !== 'splash' && view !== 'gov_login' && view !== 'ob1';
  const homeCountry = (user?.verifiedCountryCode || user?.country || currentCode).toUpperCase();
  const authorizedForeign = user?.authorizedForeignCountries || [];

  const completeCountrySwitch = (code: CountryCode) => {
    if (onChange) {
      onChange(code);
    } else {
      setCtxCountry(code);
    }
    setPendingForeignCode(null);
    setIsOpen(false);
    setSearchQuery('');
    onModalClose?.();
  };

  const handleSelect = (code: CountryCode) => {
    // 1. If in a local form/onboarding/login selector, allow freely
    if (!isGlobalSwitcher || !user) {
      completeCountrySwitch(code);
      return;
    }

    // 2. If logged in as a Statutory Government Official, enforce strict sovereign country lock
    if (user.role === 'gov' && code !== user.country) {
      toast(
        `Strict Sovereign Jurisdiction Lock: Statutory Government Desks are bound to ${COUNTRIES[user.country]?.name || user.country}. Sign out to Portal to access another country's government terminal.`,
        'amber'
      );
      return;
    }

    // 3. If logged in as Citizen and selecting a foreign country not yet authorized via Foreigner Permit
    if (
      user.role === 'citizen' &&
      code !== homeCountry &&
      !authorizedForeign.includes(code)
    ) {
      setPendingForeignCode(code);
      setForeignPermitNo('');
      return;
    }

    completeCountrySwitch(code);
  };

  const handleAuthorizeForeignEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingForeignCode || !user) return;
    const permit = foreignPermitNo.trim().toUpperCase();
    if (!permit) {
      toast('Please enter your Foreigner Permit / Visa number or click "Auto-Fill Demo Permit".', 'amber');
      return;
    }
    const nextAuth = Array.from(new Set([...(user.authorizedForeignCountries || []), pendingForeignCode]));
    setUser({
      ...user,
      country: pendingForeignCode,
      citizenshipStatus: 'foreign_resident',
      identityDocumentType: foreignDocType,
      permitNumber: permit,
      originCountryCode: homeCountry as CountryCode,
      authorizedForeignCountries: nextAuth,
    });
    toast(
      `Foreign Resident Extension (${foreignDocType.replace('_', ' ').toUpperCase()}: ${permit}) verified · Entered ${COUNTRIES[pendingForeignCode]?.name}`,
      'emerald'
    );
    completeCountrySwitch(pendingForeignCode);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const currentCountryInfo = COUNTRIES[currentCode] || {
    name: currentCode,
    currency: 'USD',
  };

  const allEntries = useMemo(() => {
    return Object.entries(COUNTRIES).map(([code, data]) => ({
      code: code as CountryCode,
      name: data.name,
      currency: data.currency || '',
    }));
  }, []);

  const filteredEntries = useMemo(() => {
    let list = allEntries;

    if (selectedRegion !== 'ALL') {
      const allowedCodes = new Set(REGION_CODES[selectedRegion]);
      list = list.filter((item) => allowedCodes.has(item.code));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.currency.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allEntries, selectedRegion, searchQuery]);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Buttons */}
      {variant === 'card' ? (
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 dark:hover:border-slate-600 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#f1f3f4] dark:bg-[#1e232d] flex items-center justify-center text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] shrink-0">
              {currentCode}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Globe2 size={11} strokeWidth={1.75} />
                <span>{label}</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5 truncate">
                <span className="truncate">{currentCountryInfo.name}</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-mono shrink-0">
                  ({currentCountryInfo.currency})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors shrink-0 ml-2">
            <span className="text-[11px] font-mono font-medium hidden sm:inline">Switch</span>
            <ChevronDown size={15} strokeWidth={1.75} />
          </div>
        </div>
      ) : variant === 'bar' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-slate-100">
            <div className="w-8 h-8 rounded-md bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
              {currentCode}
            </div>
            <div>
              <span className="font-semibold text-xs block sm:inline mr-1.5">
                Active Sovereign Jurisdiction: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{currentCountryInfo.name}</strong> ({currentCode})
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block sm:inline">
                · National Ministry &amp; Grassroots Desks active
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="self-start sm:self-auto px-3 py-1.5 rounded-md bg-[#f1f3f4] hover:bg-[#e3e6ea] dark:bg-[#1e232d] dark:hover:bg-[#262b36] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Globe2 size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
            <span>Switch Country</span>
            <ChevronDown size={13} strokeWidth={1.75} />
          </button>
        </div>
      ) : variant === 'inline_button' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer"
        >
          <Globe2 size={13} strokeWidth={1.75} />
          <span>{currentCountryInfo.name}</span>
          <span className="px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono">{currentCode}</span>
          <ChevronDown size={14} strokeWidth={1.75} />
        </button>
      ) : variant === 'menu_item' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center font-mono text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
              {currentCode}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Active Jurisdiction
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {currentCountryInfo.name} · {currentCode}
              </div>
            </div>
          </div>
          <ChevronRight size={14} strokeWidth={1.75} className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 h-8 px-2.5 rounded-md bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 transition-all text-xs font-medium cursor-pointer group"
        >
          <Globe2 size={13} strokeWidth={1.75} className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
          <span className="truncate max-w-[110px] sm:max-w-[150px] text-[11.5px] font-medium">{currentCountryInfo.name}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 font-semibold">
            {currentCode}
          </span>
          <ChevronDown size={12} strokeWidth={1.75} className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
        </button>
      )}

      {/* Full Centered Modal Dialog via Portal */}
      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-2xl max-h-[86vh] flex flex-col bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl shadow-2xl overflow-hidden z-10">
            {/* Header */}
            <div className="p-4 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-700 dark:text-slate-200 flex items-center justify-center border border-[#e3e6ea] dark:border-[#262b36]">
                  <Globe2 size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Select Sovereign Jurisdiction</span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      {allEntries.length} Countries
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Select country to mount its national statutory ministry and grassroots desks
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#f1f3f4] dark:bg-[#1e232d] hover:bg-[#e3e6ea] dark:hover:bg-[#262b36] text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                title="Close dialog (Esc)"
              >
                <X size={15} strokeWidth={1.75} />
              </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="p-3.5 border-b border-[#e3e6ea] dark:border-[#262b36] space-y-2.5 bg-white dark:bg-[#161a22] shrink-0">
              <div className="relative">
                <Search size={14} strokeWidth={1.75} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries, ISO codes or currencies (e.g. Uganda, Germany, US, EUR, KES)..."
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg pl-9 pr-8 py-2 text-xs font-mono placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={13} strokeWidth={1.75} />
                  </button>
                )}
              </div>

              {/* Region Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {[
                  { id: 'ALL' as Region, label: 'All Global', count: allEntries.length },
                  { id: 'AFRICA' as Region, label: 'Africa', count: REGION_CODES.AFRICA.length },
                  { id: 'EUROPE' as Region, label: 'Europe', count: REGION_CODES.EUROPE.length },
                  { id: 'AMERICAS' as Region, label: 'Americas', count: REGION_CODES.AMERICAS.length },
                  { id: 'ASIA_PACIFIC' as Region, label: 'Asia & Pacific', count: REGION_CODES.ASIA_PACIFIC.length },
                  { id: 'MIDDLE_EAST' as Region, label: 'Middle East', count: REGION_CODES.MIDDLE_EAST.length },
                ].map((tab) => {
                  const isActive = selectedRegion === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedRegion(tab.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium shrink-0 transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 border-slate-900 dark:border-slate-100'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="ml-1 text-[10px] opacity-70">({tab.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Popular Hubs Row */}
              {!searchQuery && selectedRegion === 'ALL' && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                  <span className="text-[10px] font-mono uppercase font-semibold tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
                    <Compass size={11} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Quick Hubs:</span>
                  </span>
                  {POPULAR_HUBS.map((code) => {
                    const info = COUNTRIES[code];
                    if (!info) return null;
                    const isCurrent = code === currentCode;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelect(code)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium shrink-0 transition-all border cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
                        }`}
                      >
                        <span className={`text-[9.5px] font-mono font-bold px-1 rounded ${isCurrent ? 'bg-black/20 text-white' : 'bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-600 dark:text-slate-400'}`}>
                          {code}
                        </span>
                        <span>{info.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Scrollable Country Grid OR Foreign Jurisdiction Entry Gate */}
            {pendingForeignCode ? (
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-[#f8f9fa] dark:bg-[#0e1116] space-y-4">
                <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-amber-500/40 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                        <Lock size={17} />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Strict Country Access Gate · Foreign Jurisdiction Extension
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Entering {COUNTRIES[pendingForeignCode]?.name} ({pendingForeignCode}) Civic Experience
                        </h4>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingForeignCode(null)}
                      className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      ← Back
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Your Citizen Identity is strictly bound to{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {COUNTRIES[homeCountry]?.name || homeCountry} ({homeCountry})
                    </strong>
                    . Under CivicDuty&apos;s Sovereign Jurisdiction Charter, non-citizens cannot enter another country&apos;s civic walls without a verified{' '}
                    <strong className="text-slate-900 dark:text-white">Foreigner Extension Document</strong> (Alien Card, Work Permit, Green Card, Resident Permit, Student Visa, or Entry Visa).
                  </p>

                  <form onSubmit={handleAuthorizeForeignEntry} className="space-y-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500">
                          1. Select Foreigner Immigration Document
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const prefixMap: Record<string, string> = {
                              work_permit: 'WP',
                              alien_card: 'ALN',
                              green_card: 'GC',
                              resident_permit: 'RP',
                              student_visa: 'STU',
                              visitor_visa: 'VISA',
                            };
                            const pref = prefixMap[foreignDocType] || 'WP';
                            setForeignPermitNo(`${pref}-${pendingForeignCode}-2026-8841`);
                          }}
                          className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 underline cursor-pointer"
                        >
                          Auto-Fill Demo Permit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {[
                          { id: 'work_permit', label: 'Work Permit', code: 'WP' },
                          { id: 'alien_card', label: 'Alien Card', code: 'ALN' },
                          { id: 'green_card', label: 'Green Card', code: 'GC' },
                          { id: 'resident_permit', label: 'Resident Permit', code: 'RP' },
                          { id: 'student_visa', label: 'Student Visa', code: 'STU' },
                          { id: 'visitor_visa', label: 'Entry / Tourist Visa', code: 'VISA' },
                        ].map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setForeignDocType(doc.id as IdentityDocumentType)}
                            className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                              foreignDocType === doc.id
                                ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                                : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {doc.code}
                            </div>
                            <div className="text-[11px] font-semibold truncate">{doc.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 block mb-1">
                        2. {COUNTRIES[pendingForeignCode]?.name} Permit / Visa Serial Number
                      </label>
                      <input
                        type="text"
                        value={foreignPermitNo}
                        onChange={(e) => setForeignPermitNo(e.target.value)}
                        placeholder={`e.g. WP-${pendingForeignCode}-2026-8841`}
                        className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-2 text-[10.5px] font-mono text-slate-600 dark:text-slate-400">
                      <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        Origin Passport: <strong>{homeCountry}</strong> · Host Jurisdiction:{' '}
                        <strong>{pendingForeignCode}</strong> · Zero-Knowledge SHA-256 Tokenized
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setPendingForeignCode(null)}
                        className="px-3.5 py-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FileCheck2 size={14} />
                        <span>Verify Permit &amp; Enter {COUNTRIES[pendingForeignCode]?.name} →</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
            <div className="p-3.5 overflow-y-auto flex-1 max-h-[50vh] space-y-1.5 bg-[#f8f9fa] dark:bg-[#0e1116]">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase font-medium text-slate-500 px-1 pb-1">
                <span>Displaying {filteredEntries.length} sovereign states</span>
                <span>
                  Home Lock: {homeCountry} · Active: {currentCode} ({currentCountryInfo.name})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredEntries.map((item) => {
                  const isSelected = item.code === currentCode;
                  const isHome = item.code === homeCountry;
                  const isAuthorizedForeign = authorizedForeign.includes(item.code);
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelect(item.code)}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/10 text-slate-900 dark:text-slate-100 border-emerald-500/50'
                          : 'bg-white dark:bg-[#161a22] hover:border-slate-400 dark:hover:border-slate-600 border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
                        }`}>
                          {item.code}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold block text-xs truncate leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                            {item.code}{item.currency ? ` · ${item.currency}` : ''}
                            {isGlobalSwitcher && user?.role === 'citizen'
                              ? isHome
                                ? ' · Home ID'
                                : isAuthorizedForeign
                                ? ' · Permit Active'
                                : ' · Permit Req.'
                              : ''}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={2} />
                        </div>
                      ) : (
                        isGlobalSwitcher &&
                        user?.role === 'citizen' &&
                        !isHome &&
                        !isAuthorizedForeign && (
                          <Lock size={12} className="text-slate-400 shrink-0" />
                        )
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredEntries.length === 0 && (
                <div className="p-8 text-center space-y-2">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    No sovereign jurisdiction found matching &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedRegion('ALL'); }}
                    className="mt-2 px-3 py-1.5 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    Clear Search Filters
                  </button>
                </div>
              )}
            </div>
            )}

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Multi-tier statutory hierarchy &amp; SLAs auto-sync upon selection</span>
              </div>
              <span className="text-slate-400">Press Esc or click outside to close</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

