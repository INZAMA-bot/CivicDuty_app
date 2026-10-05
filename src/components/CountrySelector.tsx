import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, Globe2, X, Sparkles } from 'lucide-react';
import { CountryCode } from '../types';
import { COUNTRIES } from '../data/countries';
import { useApp } from '../context/AppContext';

interface CountrySelectorProps {
  value?: CountryCode;
  onChange?: (country: CountryCode) => void;
  variant?: 'compact' | 'bar' | 'card' | 'inline_button';
  label?: string;
  className?: string;
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
    'RS', 'EE', 'LV', 'LT', 'SI', 'LU', 'IS', 'AL', 'MD', 'BA', 'ME', 'MK'
  ],
  AMERICAS: [
    'US', 'CA', 'MX', 'BR', 'AR', 'CO', 'CL', 'PE', 'VE', 'EC', 'GT', 'CU',
    'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'JM', 'TT', 'GY',
    'SR', 'BS', 'BB', 'BZ', 'HT'
  ],
  ASIA_PACIFIC: [
    'IN', 'CN', 'JP', 'KR', 'ID', 'PK', 'BD', 'PH', 'VN', 'TH', 'MY', 'SG',
    'AU', 'NZ', 'MM', 'LK', 'NP', 'KH', 'MN', 'TW', 'PG', 'FJ', 'UZ', 'KZ'
  ],
  MIDDLE_EAST: [
    'AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'IL', 'JO', 'LB', 'IQ', 'IR', 'YE', 'SY', 'TR'
  ]
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  variant = 'compact',
  label = 'Select Country Jurisdiction',
  className = '',
}) => {
  const { selectedCountry: ctxCountry, setSelectedCountry: setCtxCountry } = useApp();
  const currentCode = (value || ctxCountry || 'UG').toUpperCase();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('ALL');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (code: CountryCode) => {
    if (onChange) {
      onChange(code);
    } else {
      setCtxCountry(code);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  // Close on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const currentCountryInfo = COUNTRIES[currentCode] || {
    name: currentCode,
    flag: '🌐',
    currency: 'USD',
  };

  // Process and filter countries list
  const allEntries = useMemo(() => {
    return Object.entries(COUNTRIES).map(([code, data]) => ({
      code: code as CountryCode,
      name: data.name,
      flag: data.flag || '🌐',
      currency: data.currency || '',
    }));
  }, []);

  const filteredEntries = useMemo(() => {
    let list = allEntries;

    // Region filter
    if (selectedRegion !== 'ALL') {
      const allowedCodes = new Set(REGION_CODES[selectedRegion]);
      list = list.filter((item) => allowedCodes.has(item.code));
    }

    // Search query filter
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
          className="cursor-pointer p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-2xs border border-slate-200 dark:border-slate-700/60 shrink-0 group-hover:scale-105 transition-transform">
              {currentCountryInfo.flag}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span>{label}</span>
                <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black px-1.5 py-0.5 rounded">
                  {currentCode}
                </span>
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5 truncate">
                <span className="truncate">{currentCountryInfo.name}</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400 mono shrink-0">
                  ({currentCountryInfo.currency})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shrink-0 ml-2">
            <span className="text-[10.5px] mono font-bold hidden sm:inline">Switch</span>
            <ChevronDown size={16} />
          </div>
        </div>
      ) : variant === 'bar' ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
          <div className="flex items-center gap-3 text-emerald-950 dark:text-emerald-100">
            <span className="text-2xl shrink-0 drop-shadow-xs">{currentCountryInfo.flag}</span>
            <div>
              <span className="font-black text-xs block sm:inline mr-1.5">
                Active Sovereign Jurisdiction: <strong className="text-emerald-700 dark:text-emerald-300 font-black">{currentCountryInfo.name}</strong> ({currentCode})
              </span>
              <span className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80 block sm:inline">
                · Central Superadmin & Grassroots Desks active
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Globe2 size={13} />
            <span>Switch Country</span>
            <ChevronDown size={13} />
          </button>
        </div>
      ) : variant === 'inline_button' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs mono font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <span className="text-base">{currentCountryInfo.flag}</span>
          <span>{currentCountryInfo.name}</span>
          <ChevronDown size={14} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-800 dark:text-slate-200 shadow-2xs transition-all text-xs font-bold cursor-pointer group"
        >
          <span className="text-base group-hover:scale-110 transition-transform">{currentCountryInfo.flag}</span>
          <span className="truncate max-w-[130px] sm:max-w-[180px] text-[11px]">{currentCountryInfo.name}</span>
          <span className="text-[9px] mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            {currentCode}
          </span>
          <ChevronDown size={13} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
        </button>
      )}

      {/* Full Centered Modal Dialog for Flawless UX & Viewport Fitting */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          {/* Backdrop Click Dismiss */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-scale-in">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Globe2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Select Sovereign Jurisdiction</span>
                    <span className="text-[10px] mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {allEntries.length} Countries
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select country to load its national superadmin ministry and grassroots desk
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                title="Close dialog (Esc)"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search and Filters Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 shrink-0">
              {/* Search Field */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search countries, ISO codes or currencies (e.g. Uganda, Germany, US, EUR, KES)..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm mono placeholder:text-slate-400 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Region Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
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
                      className={`px-3 py-1.5 rounded-xl text-xs mono font-bold shrink-0 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="ml-1.5 text-[10px] opacity-70">({tab.count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Popular Hubs Row */}
              {!searchQuery && selectedRegion === 'ALL' && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  <span className="text-[9px] mono uppercase font-black tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-500" />
                    Quick Hubs:
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
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all border cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        <span className="text-sm">{info.flag}</span>
                        <span>{info.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Scrollable Country Grid */}
            <div className="p-4 overflow-y-auto flex-1 max-h-[50vh] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] mono uppercase font-bold text-slate-400 px-1 pb-1">
                <span>Displaying {filteredEntries.length} sovereign states</span>
                <span>Active: {currentCode} ({currentCountryInfo.name})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredEntries.map((item) => {
                  const isSelected = item.code === currentCode;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSelect(item.code)}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border-emerald-400 dark:border-emerald-600 ring-1 ring-emerald-400 dark:ring-emerald-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{item.flag}</span>
                        <div className="min-w-0">
                          <span className="font-bold block text-xs truncate leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] mono text-slate-500 dark:text-slate-400 block mt-0.5">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.code}</span>
                            {item.currency ? ` · ${item.currency}` : ''}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <span className="text-[10px] mono text-slate-400 font-bold opacity-0 group-hover:opacity-100">
                          Select
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {filteredEntries.length === 0 && (
                <div className="p-8 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    No sovereign jurisdiction found matching "{searchQuery}"
                  </p>
                  <p className="text-xs text-slate-400 mono">
                    Try searching by country name, ISO code (e.g. "DE", "UG"), or currency ("EUR").
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedRegion('ALL'); }}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Clear Search Filters
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] mono text-slate-500 dark:text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Multi-tier statutory hierarchy & SLAs auto-sync upon selection</span>
              </div>
              <span className="text-slate-400">Press Esc or click outside to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
