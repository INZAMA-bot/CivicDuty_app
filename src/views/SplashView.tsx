import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  ShieldCheck,
  Landmark,
  Building2,
  Check,
  Layers,
  Lock,
  KeyRound,
  X,
  ShieldAlert,
} from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { TrafficLightLogo } from '../components/TrafficLightLogo';
import { HeaderSettingsMenu } from '../components/HeaderSettingsMenu';
import { InstallPwaBanner } from '../components/InstallPwaBanner';
import { Footer } from '../components/Footer';

// Official master code & private visitor demo codes (demo codes are shared in chat/direct outreach, never displayed on-screen)
const VALID_MASTER_CODES = [
  'CIVICDUTY-UG-2026', // Official Master Access Code
  'CIVIC-DEMO-2026',   // Visitor Demo Access Code
  'GUEST-UG-2026',     // Alternate Visitor Access Code
  'VISITOR-CIVIC-2026',
  'CIVICDUTY2026',
  'CIVIC2026',
  'UGANDA2026',
];

export const SplashView: React.FC = () => {
  const {
    go,
    posts,
    ensureCitizenSession,
    t,
  } = useApp();

  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [accessError, setAccessError] = useState<string | null>(null);
  const [pendingRoute, setPendingRoute] = useState<'ob1' | 'ob2' | 'entity' | null>(null);

  const total = posts.length;
  const resolved = posts.filter((p) => p.status === 'resolved').length;
  const corrupt = posts.filter((p) => p.category === 'corruption').length;
  const countriesCount = Object.keys(COUNTRIES).length;

  const isPlatformUnlocked = () => {
    try {
      return sessionStorage.getItem('civicduty_platform_unlocked') === 'true';
    } catch {
      return false;
    }
  };

  const handlePortalEntry = (target: 'ob1' | 'ob2' | 'entity') => {
    if (isPlatformUnlocked()) {
      if (target === 'ob1') ensureCitizenSession();
      go(target);
      return;
    }
    setPendingRoute(target);
    setAccessCodeInput('');
    setAccessError(null);
    setShowAccessModal(true);
  };

  const handleVerifyAccessCode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = accessCodeInput.trim().toUpperCase();
    if (VALID_MASTER_CODES.includes(clean)) {
      try {
        sessionStorage.setItem('civicduty_platform_unlocked', 'true');
      } catch (err) {
        console.error(err);
      }
      setShowAccessModal(false);
      const dest = pendingRoute || 'ob1';
      if (dest === 'ob1') ensureCitizenSession();
      go(dest);
    } else {
      setAccessError('Invalid Master Access Code. Please verify your credentials or contact administrator.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Simple Top Bar — No Header Logo, Only Status Label & Settings Dropdown */}
      <header className="w-full h-12 px-3.5 sm:px-6 border-b border-[#e3e6ea] dark:border-[#262b36] bg-white/95 dark:bg-[#161a22]/95 backdrop-blur-md flex items-center justify-between gap-2 sticky top-0 z-30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 truncate">
            Sovereign Civic Accountability
          </span>
        </div>

        {/* Right: Compiled Gear / 3-Dots Dropdown Menu (Country, Language, Theme, Docs) */}
        <div className="flex items-center gap-2 shrink-0">
          <HeaderSettingsMenu isSplash />
        </div>
      </header>

      {/* PWA Mobile Install Banner */}
      <InstallPwaBanner />

      {/* Main Mobile-First Homepage Body — Single Unified Hero Logo & Clean Thumb-Zone Layout */}
      <main className="flex-1 w-full max-w-xl lg:max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-7 pb-4 flex flex-col gap-4">
        {/* Single Hero Identity Card (Only ONE Logo on the Homepage) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col items-center text-center space-y-3">
          <div className="px-4 py-2 rounded-2xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] inline-flex items-center justify-center">
            <TrafficLightLogo size="md" />
          </div>

          <div className="space-y-1.5 w-full">
            <h1 className="newspaper-masthead text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-none">
              CIVICDUTY
            </h1>

            {/* Speak · Serve · Be Heard — Strictly on the SAME LINE */}
            <div className="text-[11px] sm:text-xs font-mono uppercase flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap pt-0.5">
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shrink-0" />
                <span>Speak</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0" />
                <span>Serve</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center shrink-0">
                  <Check size={8} strokeWidth={2.75} />
                </span>
                <span>Be Heard</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
            {t('charterText')}
          </p>
        </div>

        {/* Workspace Portal Selection Card — Mobile-First Uncrowded Layout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              SELECT WORKSPACE PORTAL
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              Restricted Preview
            </span>
          </div>

          {/* 1. CITIZEN PORTAL (Primary Full-Width Action) */}
          <button
            onClick={() => handlePortalEntry('ob1')}
            className="w-full min-h-[58px] group p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white border border-emerald-500/30 flex items-center justify-between gap-3 cursor-pointer transition-all text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-black/15 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} strokeWidth={1.75} className="text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-bold tracking-tight block text-white leading-tight">
                  {t('citizenPortal')}
                </span>
                <span className="text-[11px] text-emerald-50 block leading-snug mt-0.5">
                  Report issues, track SLAs &amp; verify public proof
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-black/15 group-hover:bg-black/25 px-3 py-2 rounded-lg text-white font-mono font-semibold text-xs transition-colors shrink-0">
              <span>{t('enter')}</span>
              <ArrowRight size={13} strokeWidth={1.75} />
            </div>
          </button>

          {/* 2 & 3. GOVERNMENT DESK & PROVIDER DESK */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handlePortalEntry('ob2')}
              className="min-h-[84px] p-3 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 dark:hover:border-slate-600 active:scale-[0.99] text-left flex flex-col justify-between gap-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Landmark size={15} strokeWidth={1.75} />
                </div>
                <ArrowRight size={13} strokeWidth={1.75} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                  {t('govDesk')}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Ministries &amp; Districts
                </div>
              </div>
            </button>

            <button
              onClick={() => handlePortalEntry('entity')}
              className="min-h-[84px] p-3 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 dark:hover:border-slate-600 active:scale-[0.99] text-left flex flex-col justify-between gap-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Building2 size={15} strokeWidth={1.75} />
                </div>
                <ArrowRight size={13} strokeWidth={1.75} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                  {t('entityHub')}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Utilities, Banks &amp; Care
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Live Telemetry & 5-Stage Pipeline Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
          {/* National Ledger Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3">
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100 leading-none">{total}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">{t('reports')}</div>
            </div>
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3">
              <div className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 leading-none">{resolved}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">{t('resolved')}</div>
            </div>
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3">
              <div className="text-lg font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400 leading-none">{corrupt}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">{t('corruption')}</div>
            </div>
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3">
              <div className="text-lg font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 leading-none">{countriesCount}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">{t('nations')}</div>
            </div>
          </div>

          {/* 5-Stage Sovereign Civic Loop Pipeline */}
          <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold">
                <Layers size={12} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                <span>5-Stage Statutory Pipeline</span>
              </span>
              <span>SHA-256 Ledger</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 pt-1">
              {[t('loopSpeaks'), t('loopServes'), t('loopProof'), t('loopHeard'), t('loopResolved')].map((s, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border text-[10px] font-mono leading-snug flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 ${
                    i === 4
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-[9px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Master Platform Access Code Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-4 sm:p-5 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Lock size={17} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Restricted Platform Access
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Master Authorization Required
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAccessModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleVerifyAccessCode} className="p-4 sm:p-5 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
                  <ShieldAlert size={13} className="text-amber-500 shrink-0" />
                  <span>Public Preview &amp; Pre-Launch Staging</span>
                </div>
                <p>
                  The public may freely view the Homepage and sovereign About CivicDuty charter below. Access into active Citizen workflows, Government Desks, and Provider Hubs requires the master platform code.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Access Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound size={15} />
                  </div>
                  <input
                    type="text"
                    value={accessCodeInput}
                    onChange={(e) => {
                      setAccessCodeInput(e.target.value.toUpperCase());
                      setAccessError(null);
                    }}
                    placeholder="ENTER ACCESS CODE"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-xs font-mono font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 uppercase tracking-wider"
                  />
                </div>
                {accessError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    {accessError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAccessModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Authorize</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clean Footer without Logo Icon */}
      <Footer isSplash />
    </div>
  );
};


