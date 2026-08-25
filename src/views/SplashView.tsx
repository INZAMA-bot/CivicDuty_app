import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Landmark, Building2, PhoneCall, Layers, Globe2, Sun, Moon, CheckCircle } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { LanguageCode } from '../types';

export const SplashView: React.FC = () => {
  const { go, posts, ensureCitizenSession, theme, toggleTheme, language, setLanguage, t } = useApp();

  const total = posts.length;
  const resolved = posts.filter((p) => p.status === 'resolved').length;
  const corrupt = posts.filter((p) => p.category === 'corruption').length;
  const countriesCount = Object.keys(COUNTRIES).length;

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'EN', label: 'EN' },
    { code: 'LG', label: 'LG' },
    { code: 'SW', label: 'SW' },
    { code: 'RW', label: 'RW' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-5 py-6 bg-slate-50 dark:bg-[#020617] relative overflow-hidden transition-colors">
      {/* Top Header Controls (Language switch & Theme switch) */}
      <div className="w-full flex justify-between items-center z-20">
        {/* Multilingual Selector */}
        <div className="flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/70 p-0.5 text-[9px] mono font-bold shadow-sm backdrop-blur-md">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === l.code
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] mono uppercase font-bold border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 shadow-sm hover:border-emerald-500 transition-all backdrop-blur-md"
        >
          {theme === 'dark' ? (
            <>
              <Sun size={12} className="text-amber-400" />
              <span>Daylight</span>
            </>
          ) : (
            <>
              <Moon size={12} className="text-indigo-600" />
              <span>Darkness</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3.5 w-full z-10 my-1">
        {/* EXACT SOVEREIGN 3-SIGNAL BEACON BULBS LOGO */}
        <div className="relative flex items-center justify-center w-full max-w-[260px] sm:max-w-[290px] mx-auto bg-transparent mb-1">
          <img
            src="/1787650937605.png"
            alt="CivicDuty Sovereign 3-Signal Beacon Logo"
            className="w-full h-auto object-contain bg-transparent select-none transition-transform hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* MASTER WORDMARK & NATION MOTTO */}
        <div>
          <div className="text-[34px] sm:text-[38px] font-black uppercase a-boot mono leading-none tracking-[0.22em] text-slate-900 dark:text-slate-100 drop-shadow-sm dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            CIVICDUTY
          </div>
          <div className="tagline text-[10.5px] text-emerald-700 dark:text-emerald-400 font-mono tracking-[0.22em] mt-2 uppercase flex items-center justify-center gap-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block a-dot" />
            <span>{t('motto')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block a-dot" />
          </div>
        </div>

        {/* SOVEREIGN CIVIC LOOP HUD */}
        <div className="w-full max-w-[300px] bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm dark:shadow-md space-y-1 transition-colors">
          {['Citizen SPEAKS', 'Government SERVES', 'Uploads PROOF', 'Citizen confirms HEARD', 'Resolved ✓'].map(
            (s, i) => (
              <div key={i} className="flex items-center justify-center a-fade" style={{ animationDelay: `${i * 0.08}s` }}>
                <span className={`text-[10.5px] mono font-bold ${i === 4 ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-slate-700 dark:text-slate-200'} tracking-wide flex items-center gap-1.5`}>
                  {i > 0 && <span className="text-slate-400 dark:text-slate-500 text-[8.5px]">↓</span>}
                  {s}
                </span>
              </div>
            )
          )}
        </div>

        {/* UNIVERSAL CIVIC CHARTER STATEMENT - HIGH CONTRAST & CLEARLY READABLE */}
        <div className="card px-4 py-2.5 max-w-[340px] mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-md transition-colors">
          <p className="text-[11.5px] sm:text-[12px] font-semibold text-slate-800 dark:text-slate-100 leading-relaxed text-center">
            As taxpayers, citizens have a sovereign civic duty to demand quality public service. CivicDuty is the lawful, documented operational channel.
          </p>
        </div>

        {/* NATIONAL LEDGER METRICS */}
        <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80 w-full max-w-[340px] justify-center">
          <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-lg font-black mono text-emerald-700 dark:text-emerald-400">{total}</div>
            <div className="text-[7.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-0.5 font-bold">{t('reports')}</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-lg font-black mono text-emerald-700 dark:text-emerald-400">{resolved}</div>
            <div className="text-[7.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-0.5 font-bold">{t('resolved')}</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-lg font-black mono text-rose-700 dark:text-rose-400">{corrupt}</div>
            <div className="text-[7.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-0.5 font-bold">{t('corruption')}</div>
          </div>
          <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-lg font-black mono text-amber-700 dark:text-amber-400">{countriesCount}</div>
            <div className="text-[7.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-0.5 font-bold">{t('nations')}</div>
          </div>
        </div>
      </div>

      {/* TACTICAL ENTRY PORTALS */}
      <div className="w-full max-w-[340px] space-y-2 pt-2 z-10">
        {/* 1. CITIZEN COMMAND BUTTON (Signal Green) */}
        <button
          onClick={() => {
            ensureCitizenSession();
            go('ob1');
          }}
          className="w-full group bg-emerald-600 hover:bg-emerald-500 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-emerald-400 dark:hover:from-emerald-400 dark:hover:to-emerald-300 text-white dark:text-slate-950 font-black rounded-2xl py-3.5 px-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] flex items-center justify-between shadow-md dark:shadow-[0_0_25px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-500 dark:border-emerald-300/40"
        >
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-black tracking-wider uppercase flex items-center gap-1.5">
              <ShieldCheck size={16} className="stroke-[2.5]" /> {t('citizenPortal')}
            </span>
            <span className="text-[9px] font-semibold text-emerald-100 dark:text-slate-900/80 tracking-tight normal-case">
              {t('citizenDesc')}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/10 dark:bg-slate-950/20 group-hover:bg-black/20 dark:group-hover:bg-slate-950/30 px-3 py-1.5 rounded-xl text-white dark:text-slate-950 font-black text-xs transition-colors">
            <span>Enter</span>
            <ArrowRight size={14} className="stroke-[2.5]" />
          </div>
        </button>

        {/* 2 & 3. GOVERNMENT DESK & REGISTER ENTITY */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => go('ob2')}
            className="border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold rounded-xl py-2.5 px-2 text-xs uppercase tracking-wider mono hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all text-center flex flex-col items-center justify-center gap-0.5 shadow-sm"
          >
            <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-300">
              <Landmark size={13} />
              <span className="font-bold">{t('govDesk')}</span>
            </div>
            <span className="text-[7.5px] text-indigo-600/80 dark:text-indigo-300/70 font-medium normal-case">{t('govDesc')}</span>
          </button>
          <button
            onClick={() => go('entity')}
            className="border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold rounded-xl py-2.5 px-2 text-xs uppercase tracking-wider mono hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all text-center flex flex-col items-center justify-center gap-0.5 shadow-sm"
          >
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
              <Building2 size={13} />
              <span className="font-bold">{t('entityHub')}</span>
            </div>
            <span className="text-[7.5px] text-emerald-600/80 dark:text-emerald-300/70 font-medium normal-case">{t('entityDesc')}</span>
          </button>
        </div>

        {/* 4 & 5: PUBLIC VERIFY & USSD */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            onClick={() => go('verify')}
            className="text-emerald-800 dark:text-emerald-300 font-bold rounded-xl py-2.5 px-2.5 text-[9px] uppercase tracking-wider mono transition-all border border-emerald-300/80 dark:border-emerald-500/40 bg-emerald-50/90 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Verify Seal / Code</span>
          </button>
          <button
            onClick={() => go('ussd')}
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl py-2.5 px-2.5 text-[9px] uppercase tracking-wider mono transition-all border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/90 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PhoneCall size={12} className="text-amber-600 dark:text-amber-400" />
            <span>*3030# (USSD)</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-center text-[7.5px] mono text-slate-500 uppercase tracking-widest pt-0.5">
          <Globe2 size={10} className="text-slate-400 dark:text-slate-600" />
          <span>{t('mottoSub')}</span>
        </div>
      </div>
    </div>
  );
};
