import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GOV_CODES } from '../data/tiers';
import { COUNTRIES } from '../data/countries';
import {
  getCountryDesksProfile,
  EscalationTierItem,
  AccountingDeskPreset,
} from '../data/countryDesks';
import { getPsMinistryInfo } from '../utils/helpers';
import {
  KeyRound,
  Building,
  ShieldCheck,
  ArrowRight,
  Lock,
  Landmark,
  Search,
  ChevronRight,
  ChevronDown,
  Layers,
  Handshake,
} from 'lucide-react';
import { UserSession } from '../types';

export const GovLoginView: React.FC = () => {
  const {
    user,
    setUser,
    go,
    toast,
    logAudit,
    teamMembers,
    invites,
    customGovCodes,
    setActiveDeptCountry,
    setSelectedMinistryId,
    showDemos,
    selectedCountry: ctxSelectedCountry,
    setSelectedCountry: setCtxSelectedCountry,
  } = useApp();

  const selectedCountry = ctxSelectedCountry || user?.country || 'UG';
  const setSelectedCountry = (code: string) => {
    setCtxSelectedCountry(code as any);
  };
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Track which escalation tier or specialized desk is currently selected
  const [selectedDeskKey, setSelectedDeskKey] = useState<string>('rank-2');
  // Per-desk access code state so multiple desks have their own independent input
  const [deskCodes, setDeskCodes] = useState<Record<string, string>>({});
  // Universal / Manual Access Code fallback
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'ministries' | 'manual'>('hierarchy');

  const profile = useMemo(() => getCountryDesksProfile(selectedCountry), [selectedCountry]);

  const countryList = useMemo(
    () =>
      Object.entries(COUNTRIES).map(([code, info]) => ({
        code,
        name: info?.name || code,
        flag: info?.flag || code,
      })),
    []
  );

  const filteredCountries = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    if (!q) return countryList;
    return countryList.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [countrySearch, countryList]);

  const authenticateWithCode = (rawCode: string, expectedCodeForDesk?: string, deskTitle?: string) => {
    const clean = (rawCode || '').trim().toUpperCase();
    if (!clean) {
      setError('Please enter the official access code for this desk.');
      return;
    }

    if (expectedCodeForDesk && clean !== expectedCodeForDesk.toUpperCase()) {
      setError(
        showDemos
          ? `Strict Warrant Lock: Access code "${clean}" does not match ${deskTitle || 'selected desk'}. Each account requires its own specific access code (${expectedCodeForDesk}).`
          : `Strict Warrant Lock: Invalid access code "${clean}" for ${deskTitle || 'selected desk'}. Enter the exact warrant key issued to this account.`
      );
      return;
    }

    // Ensure profile codes for selectedCountry are registered in GOV_CODES
    getCountryDesksProfile(selectedCountry);

    // 1. Check dynamic teamMembers
    const dynamicMember = teamMembers?.find((m) => m.code?.toUpperCase() === clean);
    if (dynamicMember) {
      const mCountry = (dynamicMember as any).country || selectedCountry;
      if (mCountry !== selectedCountry) {
        setError(
          `Strict Country Restriction: Warrant code "${clean}" is bound to ${COUNTRIES[mCountry as any]?.name || mCountry}. You cannot use another country's warrant in ${COUNTRIES[selectedCountry as any]?.name || selectedCountry}.`
        );
        return;
      }
      const newUser: UserSession = {
        id: 'gov_' + Date.now(),
        name: dynamicMember.name,
        country: mCountry,
        role: dynamicMember.role as any,
        role_label: dynamicMember.role_label,
        real_title_short: (dynamicMember as any).real_title_short || dynamicMember.role_label,
        dept: dynamicMember.dept,
        scope: dynamicMember.scope,
        scope_label: dynamicMember.scope,
        entity_type: 'government',
        hierarchy_level: (dynamicMember as any).hierarchy_level,
        is_admin: dynamicMember.role === 'node_admin' || dynamicMember.role === 'platform_admin',
      };
      setError('');
      setUser(newUser);
      setCtxSelectedCountry(mCountry as any);
      setActiveDeptCountry(mCountry);
      logAudit('gov_login', dynamicMember.dept, `${dynamicMember.name} signed in via code ${clean}`);
      toast(`Authenticated: ${dynamicMember.name}`, 'emerald');
      go('gov_inbox');
      return;
    }

    // 2. Check GOV_CODES or customGovCodes
    let match: any = GOV_CODES[clean] || (customGovCodes ? customGovCodes[clean] : undefined);
    if (!match) {
      for (const c of countryList) {
        getCountryDesksProfile(c.code);
        if (GOV_CODES[clean]) {
          match = GOV_CODES[clean];
          break;
        }
      }
    }

    if (match) {
      const targetCountry = match.country || selectedCountry;
      if (targetCountry !== selectedCountry) {
        setError(
          `Strict Country Restriction: Warrant code "${clean}" is bound to ${COUNTRIES[targetCountry as any]?.name || targetCountry}. Switch jurisdiction to ${COUNTRIES[targetCountry as any]?.name || targetCountry} or enter a valid ${COUNTRIES[selectedCountry as any]?.name || selectedCountry} warrant code.`
        );
        return;
      }
      const labelStr = match.role_label || match.label || deskTitle || 'Government Desk';
      const shortStr = match.real_title_short || match.label || 'GOV';
      const newUser: UserSession = {
        id: 'gov_' + Date.now(),
        name: `${labelStr} (${match.scope_label || match.scope || targetCountry})`,
        country: targetCountry,
        role: match.role || 'node_admin',
        role_label: labelStr,
        real_title_short: shortStr,
        dept: match.dept || 'molg',
        scope: match.scope || targetCountry,
        scope_label: match.scope_label || match.scope || targetCountry,
        entity_type: match.entity_type === 'non_government_entity' ? 'non_government_entity' : 'government',
        hierarchy_level: match.hierarchy_level,
        is_admin: match.role === 'platform_admin' || match.role === 'node_admin',
      };

      setError('');
      setUser(newUser);
      setCtxSelectedCountry(targetCountry as any);
      setActiveDeptCountry(targetCountry);
      logAudit('gov_login', newUser.dept || 'gov', `${labelStr} signed in via code ${clean}`);
      toast(`Authenticated: ${labelStr}`, 'emerald');

      // Check if this is a Read-Only External Auditor Subpoena Token (e.g. AUDIT-RO-UG-2026)
      if (clean.startsWith('AUDIT-RO-') || match.targetView === 'gov_audit') {
        go('gov_audit');
        return;
      }

      const psCheck = getPsMinistryInfo(newUser);
      if (psCheck.isMoLG) {
        go('ps_molg_rollout');
      } else if (
        (psCheck.isPs && psCheck.ministryId) ||
        clean.startsWith('MIN-') ||
        clean.startsWith('STM-') ||
        labelStr.toUpperCase().includes('MINISTER')
      ) {
        setSelectedMinistryId(psCheck.ministryId || 'PS-MOWT');
        go('ps_executive_desk');
      } else {
        go('gov_inbox');
      }
      return;
    }

    // 2B. Check commissioned invites & Cabinet Minister / State Minister Warrant Codes (MIN-* / STM-*)
    const matchedInvite = invites?.find((inv) => inv.code?.toUpperCase() === clean);
    if (matchedInvite || clean.startsWith('MIN-') || clean.startsWith('STM-')) {
      const codeParts = clean.split('-');
      const codeCountry = codeParts[1] && COUNTRIES[codeParts[1] as any] ? codeParts[1] : undefined;
      const targetCountry = (matchedInvite?.country || codeCountry || selectedCountry) as any;
      if (targetCountry !== selectedCountry) {
        setError(
          `Strict Country Restriction: Ministerial Warrant "${clean}" is bound to ${COUNTRIES[targetCountry]?.name || targetCountry}. You cannot access ${COUNTRIES[selectedCountry as any]?.name || selectedCountry} with a foreign warrant.`
        );
        return;
      }

      const isStateMin = clean.startsWith('STM-') || matchedInvite?.title?.toUpperCase().includes('STATE');
      const isMinister =
        clean.startsWith('MIN-') ||
        clean.startsWith('STM-') ||
        matchedInvite?.title?.toUpperCase().includes('MINISTER') ||
        matchedInvite?.role === 'read_only';

      // Extract ministry code if present in MIN-UG-MOWT-2026 -> PS-MOWT
      const minSegment = codeParts[2] && codeParts[2] !== '2026' ? `PS-${codeParts[2]}` : 'PS-MOWT';
      const boundMinistryId = matchedInvite?.scope?.startsWith('PS-') ? matchedInvite.scope : minSegment;
      const boundDept = matchedInvite?.dept || (codeParts[2] && codeParts[2] !== '2026' ? codeParts[2].toLowerCase() : 'mowt');

      const roleTitle =
        matchedInvite?.title ||
        (isStateMin
          ? `Minister of State — ${boundDept.toUpperCase()} (${COUNTRIES[targetCountry]?.name || targetCountry})`
          : `Cabinet Minister — ${boundDept.toUpperCase()} (${COUNTRIES[targetCountry]?.name || targetCountry})`);
      const officialName =
        matchedInvite?.name ||
        (isStateMin ? 'Hon. Minister of State' : 'Hon. Cabinet Minister');

      const ministerSession: UserSession = {
        id: 'gov_min_' + Date.now(),
        name: `${officialName} (${roleTitle})`,
        country: targetCountry,
        role: isMinister ? 'read_only' : (matchedInvite?.role as any) || 'node_admin',
        role_label: isMinister
          ? `${roleTitle} · Read-Only Executive Oversight (PFMA)`
          : roleTitle,
        real_title_short: isMinister
          ? isStateMin
            ? 'STATE MINISTER (RO)'
            : 'CABINET MINISTER (RO)'
          : 'OFFICIAL',
        dept: boundDept,
        scope: boundMinistryId,
        scope_label: `${matchedInvite?.duty_station || 'Ministry of Works & Transport'} (${
          isMinister ? 'Read-Only Executive Warrant' : 'Active Warrant'
        })`,
        entity_type: 'government',
        is_admin: !isMinister,
      };

      setError('');
      setUser(ministerSession);
      setCtxSelectedCountry(targetCountry);
      setActiveDeptCountry(targetCountry);
      setSelectedMinistryId(boundMinistryId);
      logAudit(
        'minister_ro_login',
        ministerSession.dept || 'mowt',
        `${officialName} signed in via warrant code ${clean} (${ministerSession.role === 'read_only' ? 'Read-Only Executive Oversight' : 'Active'})`
      );
      toast(
        isMinister
          ? `Authenticated: ${officialName} · Read-Only Executive Oversight (PFMA)`
          : `Authenticated: ${officialName}`,
        'emerald'
      );
      go(isMinister ? 'ps_executive_desk' : 'gov_inbox');
      return;
    }

    // 3. Support instant Read-Only External Auditor Passcode pattern (AUDIT-RO-<COUNTRY>-2026)
    if (clean.startsWith('AUDIT-RO-')) {
      const parts = clean.split('-');
      const tokenCountry = parts[2] && COUNTRIES[parts[2] as any] ? parts[2] : selectedCountry;
      if (tokenCountry !== selectedCountry) {
        setError(
          `Strict Country Restriction: Auditor Token "${clean}" is bound to ${COUNTRIES[tokenCountry as any]?.name || tokenCountry}.`
        );
        return;
      }
      const roUser: UserSession = {
        id: 'auditor_ro_' + Date.now(),
        name: `External Statutory Auditor (${tokenCountry} Read-Only Pass)`,
        country: tokenCountry as any,
        role: 'read_only',
        role_label: 'Auditor General / IGG Read-Only Inspector',
        real_title_short: 'EXT-AUDITOR (RO)',
        dept: 'igg',
        scope: tokenCountry,
        scope_label: `${COUNTRIES[tokenCountry as any]?.name || tokenCountry} Read-Only Audit Scope`,
        entity_type: 'government',
        is_admin: false,
      };
      setError('');
      setUser(roUser);
      setCtxSelectedCountry(tokenCountry as any);
      setActiveDeptCountry(tokenCountry as any);
      logAudit('external_auditor_ro_login', 'AUDIT-LEDGER', `Read-only external auditor authenticated via token ${clean}`);
      toast('Authenticated: Read-Only External Auditor Token · Opening 5-Page Audit Suite', 'emerald');
      go('gov_audit');
      return;
    }

    setError(
      expectedCodeForDesk && showDemos
        ? `Invalid access code "${clean}". Tap "Auto-fill: ${expectedCodeForDesk}" to test this desk.`
        : 'Invalid access code. Select your desk from the 5-Tier Escalation Hierarchy or check your issued code.'
    );
  };

  return (
    <div className="animate-fade-in px-3.5 sm:px-5 pt-4 pb-16 max-w-2xl mx-auto space-y-4 text-slate-900 dark:text-slate-100">
      {/* Main Studio Card */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
        {/* Top Studio Header Bar — Unobstructed Full-Width Title + Separated Partnership Hub Action Strip */}
        <div className="px-4 py-3.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                <Landmark size={16} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                  Government &amp; Statutory Desk Authentication
                </h1>
                <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                  Select country · Tap your statutory desk · Enter access code
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[9.5px] font-mono font-semibold shrink-0">
              <Lock size={10} />
              <span>SHA-256</span>
            </span>
          </div>

          {/* Separated Partnership Hub & Bilateral Gateway Strip */}
          <div className="pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10.5px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                Sovereign Bilateral &amp; Modification Desk
              </div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                Direct Gov ↔ CivicDuty accord &amp; 2-stage desk modifications
              </div>
            </div>

            <button
              type="button"
              onClick={() => go('gov_partnership')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-mono font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              title="Open Government Partnership & Bilateral Communication Hub"
            >
              <Handshake size={12} strokeWidth={1.75} />
              <span>Partnership Hub</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* STEP 1: Country / Sovereign Jurisdiction Selector */}
          <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Step 1 · Select Sovereign Jurisdiction
              </label>
              <button
                type="button"
                onClick={() => setShowCountryPicker(!showCountryPicker)}
                className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showCountryPicker ? 'Close List' : `All ${countryList.length} Countries`}</span>
                <ChevronDown
                  size={12}
                  className={showCountryPicker ? 'rotate-180 transition-transform' : 'transition-transform'}
                />
              </button>
            </div>

            {/* Active Country Summary Banner */}
            <div
              onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/50 flex items-center justify-between gap-2 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold shrink-0">
                  {profile.countryCode}
                </span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {profile.countryName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {profile.statutoryFramework}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                Change ▾
              </span>
            </div>

            {/* Quick Jurisdiction Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
              {['UG', 'NL', 'KE', 'TZ', 'RW', 'NG', 'ZA', 'GH', 'GB', 'US'].map((code) => {
                const c = COUNTRIES[code];
                if (!c) return null;
                const isSel = selectedCountry === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(code);
                      setError('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                      isSel
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
                    }`}
                  >
                    {code} · {c.name}
                  </button>
                );
              })}
            </div>

            {/* Expandable Full Country Search Picker */}
            {showCountryPicker && (
              <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                  <Search size={13} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search any country by name or ISO code..."
                    className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="max-h-44 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1.5 pr-1">
                  {filteredCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(c.code);
                        setShowCountryPicker(false);
                        setError('');
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-mono truncate border transition-colors cursor-pointer ${
                        selectedCountry === c.code
                          ? 'bg-emerald-600 text-white border-emerald-700 font-bold'
                          : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/50'
                      }`}
                    >
                      <span className="font-bold">{c.code}</span> · {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Mode Tabs (5-Tier Escalation Hierarchy vs Sectoral Ministry Desks vs Direct Code) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Step 2 · Tap Your Respective Desk &amp; Enter Access Code
              </label>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {profile.countryName} Hierarchy
              </span>
            </div>

            <div className="flex border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] rounded-t-xl overflow-x-auto scrollbar-none">
              {[
                { id: 'hierarchy', label: '5-Tier Escalation Hierarchy', icon: Layers },
                {
                  id: 'ministries',
                  label: `Accounting & Ministry Desks (${profile.accountingDesks.length})`,
                  icon: Building,
                },
                { id: 'manual', label: 'Direct Code Entry', icon: KeyRound },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(t.id as any);
                      setError('');
                    }}
                    className={`flex-1 py-2.5 px-3 text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                      active
                        ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 bg-white dark:bg-[#161a22]'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono">
                {error}
              </div>
            )}

            {/* TAB 1: Interactive 5-Tier Escalation Hierarchy (Tap Desk -> Enter Access Code -> Sign In) */}
            {activeTab === 'hierarchy' && (
              <div className="space-y-2.5">
                {profile.escalationLadder.map((tier: EscalationTierItem) => {
                  const itemKey = `rank-${tier.rank}`;
                  const isExpanded = selectedDeskKey === itemKey;
                  const codeVal = deskCodes[itemKey] ?? '';

                  return (
                    <div
                      key={itemKey}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isExpanded
                          ? 'bg-white dark:bg-[#161a22] border-emerald-500/60 shadow-xs'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      {/* Tappable Escalation Tier Header */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDeskKey(isExpanded ? '' : itemKey);
                          setError('');
                        }}
                        className="w-full p-3.5 text-left flex items-start justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                              isExpanded
                                ? 'bg-emerald-600 text-white border-emerald-700'
                                : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-200 border-[#e3e6ea] dark:border-[#262b36]'
                            }`}
                          >
                            {tier.rank}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {tier.title}
                              </span>
                              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                                {tier.badge}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                              {tier.roleLabel}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                              {tier.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 shrink-0 mt-1">
                          <span>{isExpanded ? 'Selected' : 'Tap Desk'}</span>
                          <ChevronRight
                            size={14}
                            className={isExpanded ? 'rotate-90 transition-transform' : 'transition-transform'}
                          />
                        </div>
                      </button>

                      {/* Inline Desk-Specific Access Code Entry Drawer */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 animate-fade-in">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                              <KeyRound size={12} className="text-emerald-600 dark:text-emerald-400" />
                              <span>Enter {tier.badge} Access Code</span>
                            </label>
                            {showDemos && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeskCodes((prev) => ({ ...prev, [itemKey]: tier.sampleCode }));
                                  setError('');
                                }}
                                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 cursor-pointer"
                              >
                                Auto-fill: {tier.sampleCode}
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={codeVal}
                              onChange={(e) => {
                                setDeskCodes((prev) => ({ ...prev, [itemKey]: e.target.value }));
                                setError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  authenticateWithCode(
                                    codeVal || (showDemos ? tier.sampleCode : ''),
                                    tier.sampleCode,
                                    tier.title
                                  );
                                }
                              }}
                              placeholder={showDemos ? `e.g. ${tier.sampleCode}` : 'Enter official desk access code...'}
                              className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                authenticateWithCode(codeVal, tier.sampleCode, tier.title)
                              }
                              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                            >
                              <span>Sign In to Desk</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Specialized Ministry & Sector Accounting Desks for Selected Country */}
            {activeTab === 'ministries' && (
              <div className="space-y-2.5">
                {/* Featured: Cabinet Minister & Minister of State (Read-Only Executive Oversight) */}
                {(() => {
                  const minSampleCode = `MIN-MOWT-${selectedCountry}-2026`;
                  const minKey = `min-cabinet-${selectedCountry}`;
                  const isMinExpanded = selectedDeskKey === minKey;
                  const minCodeVal = deskCodes[minKey] ?? '';
                  return (
                    <div
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isMinExpanded
                          ? 'bg-white dark:bg-[#161a22] border-amber-500/60'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDeskKey(isMinExpanded ? '' : minKey);
                          setError('');
                        }}
                        className="w-full p-3.5 text-left flex items-start justify-between gap-3 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              Cabinet Minister &amp; State Ministers (Executive Policy Oversight)
                            </span>
                            <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 font-semibold">
                              READ-ONLY EXECUTIVE (PFMA)
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                            Commissioned by Permanent Secretary · Inspects Apex Telemetry, League Tables &amp; Audit Ledgers in Read-Only Mode
                          </div>
                        </div>
                        <ChevronRight
                          size={15}
                          className={`text-slate-400 shrink-0 mt-1 transition-transform ${
                            isMinExpanded ? 'rotate-90 text-amber-500' : ''
                          }`}
                        />
                      </button>

                      {isMinExpanded && (
                        <div className="px-3.5 pb-3.5 pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 animate-fade-in">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[10px] font-mono uppercase font-bold text-slate-600 dark:text-slate-300">
                              Ministerial Warrant Code (Issued by Permanent Secretary)
                            </span>
                            {showDemos && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeskCodes((prev) => ({ ...prev, [minKey]: minSampleCode }));
                                  setError('');
                                }}
                                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 cursor-pointer"
                              >
                                Auto-fill: {minSampleCode}
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={minCodeVal}
                              onChange={(e) => {
                                setDeskCodes((prev) => ({ ...prev, [minKey]: e.target.value }));
                                setError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  authenticateWithCode(
                                    minCodeVal || (showDemos ? minSampleCode : ''),
                                    minSampleCode,
                                    'Cabinet Minister Desk'
                                  );
                                }
                              }}
                              placeholder={showDemos ? `Enter ${minSampleCode}` : 'Enter PS-issued Minister Warrant Code...'}
                              className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                authenticateWithCode(minCodeVal, minSampleCode, 'Cabinet Minister Desk')
                              }
                              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <span>Sign In as Minister (RO)</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {profile.accountingDesks.map((desk: AccountingDeskPreset) => {
                  const deskKey = `min-${desk.code}`;
                  const isExpanded = selectedDeskKey === deskKey;
                  const codeVal = deskCodes[deskKey] ?? '';

                  return (
                    <div
                      key={desk.code}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isExpanded
                          ? 'bg-white dark:bg-[#161a22] border-emerald-500/60'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDeskKey(isExpanded ? '' : deskKey);
                          setError('');
                        }}
                        className="w-full p-3.5 text-left flex items-start justify-between gap-3 cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {desk.title}
                            </span>
                            <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                              {desk.badge}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                            {desk.deptName} · {desk.role}
                          </div>
                        </div>
                        <ChevronRight
                          size={15}
                          className={`text-slate-400 shrink-0 mt-1 transition-transform ${
                            isExpanded ? 'rotate-90 text-emerald-600' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 animate-fade-in">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-[10px] font-mono uppercase font-bold text-slate-600 dark:text-slate-300">
                              Desk Access Code ({desk.badge})
                            </span>
                            {showDemos && (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeskCodes((prev) => ({ ...prev, [deskKey]: desk.code }));
                                  setError('');
                                }}
                                className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 cursor-pointer"
                              >
                                Auto-fill: {desk.code}
                              </button>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={codeVal}
                              onChange={(e) => {
                                setDeskCodes((prev) => ({ ...prev, [deskKey]: e.target.value }));
                                setError('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  authenticateWithCode(
                                    codeVal || (showDemos ? desk.code : ''),
                                    desk.code,
                                    desk.title
                                  );
                                }
                              }}
                              placeholder={showDemos ? `Enter ${desk.code}` : 'Enter official desk access code...'}
                              className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => authenticateWithCode(codeVal, desk.code, desk.title)}
                              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <span>Sign In to Desk</span>
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: Universal Direct Access Code Input */}
            {activeTab === 'manual' && (
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                <label className="block text-[10.5px] font-mono uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300">
                  Enter Any Issued Officer or Executive Access Code
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => {
                      setManualCode(e.target.value);
                      setError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        authenticateWithCode(manualCode);
                      }
                    }}
                    placeholder={profile.samplePlaceholder || 'e.g. UG-CAO-KAMPALA'}
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => authenticateWithCode(manualCode)}
                    className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Authenticate Desk</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Switchers: Sovereign Partnership Hub & Service Provider Gateway */}
        <div className="px-4 py-3 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5">
          {/* Immediate Government Representative -> CivicDuty Partnership Hub Banner */}
          <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Handshake size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>National Government Representative or Ministry Delegation?</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                Communicate directly with CivicDuty, review sovereign MOUs, or initiate national rollout onboarding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => go('gov_partnership')}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer transition-colors"
            >
              <Handshake size={13} />
              <span>Open Partnership Hub →</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Operating a Utility, Bank, Telecom, Hospital, or NGO Desk?
            </span>
            <button
              type="button"
              onClick={() => go('entity')}
              className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck size={13} />
              <span>Open Service Provider Gateway →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
