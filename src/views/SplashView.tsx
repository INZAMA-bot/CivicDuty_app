import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Landmark, Building2, PhoneCall, Globe2, Sun, Moon, CheckCircle, FileText, BookOpen } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { LanguageCode } from '../types';
import { TrafficLightLogo } from '../components/TrafficLightLogo';
import { ALL_LANGUAGES } from '../data/translations';
import { CountrySelector } from '../components/CountrySelector';

export const SplashView: React.FC = () => {
  const { go, posts, ensureCitizenSession, theme, toggleTheme, language, setLanguage, openGuide, t } = useApp();

  const total = posts.length;
  const resolved = posts.filter((p) => p.status === 'resolved').length;
  const corrupt = posts.filter((p) => p.category === 'corruption').length;
  const countriesCount = Object.keys(COUNTRIES).length;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between px-3.5 sm:px-4 py-3 sm:py-5 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-y-auto pb-16 transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Top Banner */}
      <div className="w-full max-w-[420px] bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full flex justify-between items-center text-[8px] mono text-slate-500 mb-1 z-20 select-none">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0 animate-pulse shadow-[0_0_6px_#f59e0b]" />
          <span className="font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">{t('walkthrough')}</span>
        </div>
        <button onClick={() => go('manifesto')} className="hover:text-emerald-500 text-slate-600 dark:text-slate-400 font-bold text-[8px] uppercase tracking-wider transition-colors">
          Docs →
        </button>
      </div>

      {/* Top Controls: Country Selector, Language Selector & Daylight/Darkness Mode Toggle */}
      <div className="w-full max-w-[420px] flex justify-between items-center z-20 mb-1 px-1 gap-1">
        <div className="flex items-center gap-1.5">
          {/* Country Selector */}
          <CountrySelector variant="compact" />

          {/* Multilingual Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              id="hp-lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              aria-label="Select Language"
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[7.5px] mono rounded-full py-0.5 pl-2 pr-4 shadow-xs focus:outline-none focus:border-emerald-500 cursor-pointer backdrop-blur-md transition-all hover:border-emerald-400"
            >
              {ALL_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {l.flag} {l.code} · {l.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-slate-400">
              <svg className="w-1.5 h-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Daylight / Darkness Toggle */}
        <button
          id="hp-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={`Switch to ${theme === 'dark' ? 'Daylight' : 'Darkness'} mode`}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[7.5px] mono uppercase font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-xs hover:border-emerald-500 transition-all active:scale-95"
        >
          {theme === 'dark' ? <Sun size={8.5} className="text-amber-400" /> : <Moon size={8.5} className="text-sky-500" />}
          <span>{theme === 'dark' ? 'DAY' : 'DARK'}</span>
        </button>
      </div>

      {/* Main Center Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2.5 w-full z-10 my-0.5 max-w-[420px]">
        {/* OFFICIAL CIVICDUTY 3-SIGNAL LOGO */}
        <div className="relative flex items-center justify-center w-full max-w-[280px] sm:max-w-[320px] mx-auto bg-transparent py-1 group">
          {/* Subtle ambient stage backlight */}
          <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent opacity-60 dark:opacity-80 blur-xl pointer-events-none" />
          <TrafficLightLogo size="xl" className="relative z-10" />
        </div>

        {/* MASTER WORDMARK & NATION MOTTO */}
        <div className="mt-0.5">
          <div className="text-[32px] sm:text-[36px] font-black uppercase mono leading-none tracking-[0.24em] text-slate-950 dark:text-white drop-shadow-xs">
            CIVICDUTY
          </div>
          <div className="tagline text-[10px] text-slate-700 dark:text-slate-300 font-mono tracking-[0.16em] mt-2 uppercase flex items-center justify-center gap-2.5 font-bold">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full border border-rose-500 bg-rose-400/40 inline-block shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
              <span>Speak</span>
            </span>
            <span className="text-slate-400 text-[8px]">·</span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full border border-amber-500 bg-amber-400/40 inline-block shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
              <span>Serve</span>
            </span>
            <span className="text-slate-400 text-[8px]">·</span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black">
              <span className="w-2.5 h-2.5 rounded-full border border-emerald-500 bg-emerald-900 inline-flex items-center justify-center text-[7px] text-white shadow-[0_0_8px_rgba(16,185,129,0.6)]">✓</span>
              <span>Be Heard</span>
            </span>
          </div>
        </div>

        {/* SOVEREIGN CIVIC LOOP HUD */}
        <div className="w-full bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-2 space-y-1 select-none backdrop-blur-xs">
          {[t('loopSpeaks'), t('loopServes'), t('loopProof'), t('loopHeard'), t('loopResolved')].map(
            (s, i) => (
              <div key={i} className="flex items-center justify-center a-fade" style={{ animationDelay: `${i * 0.06}s` }}>
                <span className={`text-[9.5px] mono font-bold ${i === 4 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'} tracking-wide flex items-center gap-1.5`}>
                  {i > 0 && <span className="text-slate-400 text-[8px]">↓</span>}
                  {s}
                </span>
              </div>
            )
          )}
        </div>

        {/* CHARTER CARD */}
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-xs w-full">
          <p className="text-[10.5px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed text-center px-1">
            {t('charterText')}
          </p>
        </div>

        {/* NATIONAL LEDGER METRICS */}
        <div className="grid grid-cols-4 gap-1.5 w-full justify-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-center shadow-xs">
            <div className="text-base font-black mono text-emerald-600 dark:text-emerald-400 leading-none">{total}</div>
            <div className="text-[7.5px] mono text-slate-500 uppercase tracking-wider mt-1 font-bold">{t('reports')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-center shadow-xs">
            <div className="text-base font-black mono text-emerald-600 dark:text-emerald-400 leading-none">{resolved}</div>
            <div className="text-[7.5px] mono text-slate-500 uppercase tracking-wider mt-1 font-bold">{t('resolved')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-center shadow-xs">
            <div className="text-base font-black mono text-rose-500 leading-none">{corrupt}</div>
            <div className="text-[7.5px] mono text-slate-500 uppercase tracking-wider mt-1 font-bold">{t('corruption')}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 text-center shadow-xs">
            <div className="text-base font-black mono text-amber-500 leading-none">{countriesCount}</div>
            <div className="text-[7.5px] mono text-slate-500 uppercase tracking-wider mt-1 font-bold">{t('nations')}</div>
          </div>
        </div>
      </div>

      {/* PORTALS & ENTRY BUTTONS */}
      <div className="w-full max-w-[420px] space-y-1.5 pt-2 z-10">
        {/* 1. CITIZEN COMMAND BUTTON */}
        <button
          onClick={() => {
            ensureCitizenSession();
            go('ob1');
          }}
          className="w-full group py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 text-xs uppercase tracking-widest mono flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase flex items-center gap-1.5 text-white drop-shadow-xs">
              <ShieldCheck size={16} className="stroke-[2.5]" /> {t('citizenPortal')}
            </span>
            <span className="text-[8.5px] font-medium text-emerald-100/90 tracking-tight normal-case">
              {t('citizenDesc')}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white/20 group-hover:bg-white/30 px-2.5 py-1.5 rounded-lg text-white font-black text-[10px] transition-colors">
            <span>{t('enter')}</span>
            <ArrowRight size={12} className="stroke-[2.5]" />
          </div>
        </button>

        {/* 2 & 3. GOVERNMENT DESK & REGISTER ENTITY */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => go('ob2')}
            className="py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mono transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <Landmark size={12} />
              <span className="font-bold text-[10px]">{t('govDesk')}</span>
            </div>
            <span className="text-[7.5px] text-slate-500 font-medium normal-case">{t('govDesc')}</span>
          </button>

          <button
            onClick={() => go('entity')}
            className="py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mono transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Building2 size={12} />
              <span className="font-bold text-[10px]">{t('entityHub')}</span>
            </div>
            <span className="text-[7.5px] text-slate-500 font-medium normal-case">{t('entityDesc')}</span>
          </button>
        </div>

        {/* FIELD MANUAL & USER GUIDE */}
        <button
          onClick={() => openGuide('quickstart')}
          className="w-full py-2.5 px-3 rounded-2xl border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-800 dark:text-teal-200 transition-all flex items-center justify-between cursor-pointer group shadow-xs"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen size={14} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-teal-900 dark:text-teal-100 flex items-center gap-1.5">
                <span>Field Manual & User Guide</span>
                <span className="text-[7.5px] px-1.5 py-0.2 rounded-full bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-200 font-black">START HERE</span>
              </div>
              <p className="text-[8.5px] text-teal-700 dark:text-teal-300 font-medium">
                How CivicDuty works · 3-Signal HUD · 5-Tier Routing · Whistleblower safety
              </p>
            </div>
          </div>
          <ArrowRight size={13} className="text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* USSD & PUBLICATIONS ROW */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => go('ussd')}
            className="py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 dark:hover:border-amber-500 text-slate-700 dark:text-slate-300 text-[8.5px] uppercase tracking-wider mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PhoneCall size={11} className="text-amber-500" />
            <span className="font-bold">{t('dialUssd')}</span>
          </button>

          <button
            onClick={() => go('docs')}
            className="py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400 dark:hover:border-amber-500 text-amber-600 dark:text-amber-400 text-[8.5px] uppercase tracking-wider mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileText size={11} />
            <span className="font-bold">{t('architecture')}</span>
          </button>
        </div>

        {/* PUBLIC VERIFY SEAL / CODE */}
        <div>
          <button
            onClick={() => go('verify')}
            className="w-full py-2 px-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9.5px] uppercase tracking-wider mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle size={12} />
            <span className="font-bold">{t('verifySeal')}</span>
          </button>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[7px] mono text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <Globe2 size={9} className="text-slate-400" />
            <span>{t('mottoSub')}</span>
          </div>
          <button
            onClick={() => go('company_management')}
            className="hover:text-amber-500 transition-colors flex items-center gap-1 cursor-pointer font-bold"
            title="Restricted CivicDuty Internal Ops & Tenancy"
          >
            <span>🔒 CD-Ops</span>
          </button>
        </div>
      </div>
    </div>
  );
};
