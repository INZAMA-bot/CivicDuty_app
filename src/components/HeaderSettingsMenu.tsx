import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageCode } from '../types';
import { ALL_LANGUAGES } from '../data/translations';
import { CountrySelector } from './CountrySelector';
import {
  Settings,
  MoreVertical,
  Sun,
  Moon,
  BookOpen,
  HelpCircle,
  Globe2,
  Terminal,
  FileCheck2,
  Shield,
  Power,
  Check,
} from 'lucide-react';

interface HeaderSettingsMenuProps {
  isSplash?: boolean;
}

export const HeaderSettingsMenu: React.FC<HeaderSettingsMenuProps> = ({ isSplash = false }) => {
  const {
    user,
    ensureCitizenSession,
    selectedCountry,
    language,
    setLanguage,
    theme,
    toggleTheme,
    go,
    openGuide,
    setUser,
  } = useApp();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeUser = user || ensureCitizenSession();
  const currentCountry = (selectedCountry || activeUser?.country || 'UG').toUpperCase();
  const isGov = ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(activeUser?.role);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Compact Trigger: Country·Lang Summary + Gear / 3-Dots Icon */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open Jurisdiction, Language, Theme & Docs Menu"
        title="Settings: Country, Language, Theme & Docs"
        className={`min-h-[34px] sm:min-h-[36px] px-2 sm:px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer select-none ${
          open
            ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100'
            : 'bg-[#f1f3f4] dark:bg-[#1e232d] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <span className="text-[10px] font-mono font-semibold tracking-tight flex items-center gap-0.5">
          <span>{currentCountry}</span>
          <span className={`opacity-40 ${isSplash ? 'inline' : 'hidden sm:inline'}`}>·</span>
          <span className={isSplash ? 'inline' : 'hidden sm:inline'}>{language}</span>
        </span>
        <Settings size={13} strokeWidth={1.75} className="shrink-0" />
        <MoreVertical size={12} strokeWidth={1.75} className="-ml-1 opacity-75 shrink-0" />
      </button>

      {/* Dropdown Popover Card */}
      {open && (
        <div className="absolute right-0 mt-2 w-[288px] sm:w-[310px] rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] shadow-2xl z-50 p-3 space-y-3 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#e3e6ea] dark:border-[#262b36]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
              <Settings size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
              <span>Workspace Preferences</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {currentCountry} · {language}
            </span>
          </div>

          {/* 1. Country / Jurisdiction Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              1. Sovereign Jurisdiction
            </label>
            <CountrySelector
              variant="menu_item"
              onModalClose={() => setOpen(false)}
            />
          </div>

          {/* 2. Language Selector */}
          <div className="space-y-1">
            <label
              htmlFor="hp-lang-select"
              className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1"
            >
              <Globe2 size={11} strokeWidth={1.75} />
              <span>2. Interface Language</span>
            </label>
            <div className="relative">
              <select
                id="hp-lang-select"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value as LanguageCode);
                }}
                aria-label="Select Language"
                className="w-full min-h-[40px] bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 font-mono font-medium text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {ALL_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-white dark:bg-[#161a22] text-slate-800 dark:text-slate-200">
                    {l.code} · {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Appearance / Theme Mode */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              3. Appearance Mode
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <button
                id="hp-theme-toggle"
                type="button"
                onClick={() => {
                  if (theme === 'dark') toggleTheme();
                }}
                className={`min-h-[36px] px-2.5 py-1.5 rounded-md text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  theme !== 'dark'
                    ? 'bg-white dark:bg-[#161a22] text-slate-900 shadow-2xs border border-[#e3e6ea]'
                    : 'text-slate-500 hover:text-slate-200'
                }`}
              >
                <Sun size={13} strokeWidth={1.75} className="text-amber-500" />
                <span>Light</span>
                {theme !== 'dark' && <Check size={11} strokeWidth={2} className="text-emerald-600" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') toggleTheme();
                }}
                className={`min-h-[36px] px-2.5 py-1.5 rounded-md text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-[#161a22] text-white shadow-2xs border border-[#262b36]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Moon size={13} strokeWidth={1.75} className="text-indigo-400" />
                <span>Dark</span>
                {theme === 'dark' && <Check size={11} strokeWidth={2} className="text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* 4. Documentation & Quick Consoles */}
          <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block pb-0.5">
              Documentation &amp; Consoles
            </span>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  go('docs');
                }}
                className="min-h-[40px] px-2.5 py-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-xs font-mono font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <BookOpen size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">Docs</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openGuide('quickstart');
                }}
                className="min-h-[40px] px-2.5 py-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-xs font-mono font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <HelpCircle size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">Field Guide</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  go('ussd');
                }}
                className="min-h-[40px] px-2.5 py-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-xs font-mono font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Terminal size={13} strokeWidth={1.75} className="text-amber-500 shrink-0" />
                <span className="truncate">*3030# USSD</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  go('verify');
                }}
                className="min-h-[40px] px-2.5 py-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-xs font-mono font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileCheck2 size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">Verify Seal</span>
              </button>
            </div>
          </div>

          {/* 5. Switch Portal / Exit Desk (Only when inside workspace) */}
          {!isSplash && (
            <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (isGov) setUser(null);
                  go('splash');
                }}
                className="w-full min-h-[40px] px-3 py-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {isGov ? <Power size={13} strokeWidth={1.75} /> : <Shield size={13} strokeWidth={1.75} />}
                  <span>{isGov ? 'Exit Official Desk' : 'Switch Workspace Portal'}</span>
                </span>
                <span className="text-[10px] opacity-70">→</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
