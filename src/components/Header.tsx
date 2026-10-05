import React from 'react';
import { useApp } from '../context/AppContext';
import { getDept, getRank, getPsMinistryInfo } from '../utils/helpers';
import { ShieldCheck, Building, Wifi, WifiOff, CheckCircle2, Sun, Moon, HelpCircle, Cloud, Gift } from 'lucide-react';
import { TrafficSignalHUD } from './TrafficSignalHUD';
import { getCountryBranding } from '../data/countryBranding';
import { getNationalRolloutArrangements } from '../data/tiers';

export const Header: React.FC = () => {
  const {
    user,
    ensureCitizenSession,
    view,
    go,
    profiles,
    isOnline,
    offlineQueue,
    syncOfflineQueue,
    theme,
    toggleTheme,
    openGuide,
    t,
    setSelectedMinistryId,
  } = useApp();

  const isAuthView = ['splash', 'ob1', 'ob2', 'ob3', 'ob_home', 'entity', 'entity_done', 'ussd', 'docs', 'verify', 'transit_preview', 'livery'].includes(view);
  const activeUser = user || (!isAuthView ? ensureCitizenSession() : null);

  if (isAuthView || !activeUser) return null;

  const isGov = ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(activeUser.role);
  const profile = profiles[activeUser.id] || { civic_score: 50 };
  const currentCountry = activeUser.country || 'UG';
  const countryBranding = getCountryBranding(currentCountry);
  const rolloutData = getNationalRolloutArrangements(currentCountry);

  const psInfo = getPsMinistryInfo(activeUser);

  // Dynamic live calendar date constantly formatted to current real-world date (e.g. "18 SEP 2026")
  const formattedToday = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date()).toUpperCase();

  const roleColors: Record<string, string> = {
    platform_admin: 'ch-corrupt',
    node_admin: 'ch-budget',
    spokesperson: 'ch-budget',
    read_only: 'ch-ro',
  };

  const dept = activeUser.dept ? getDept(activeUser.country, activeUser.dept) : null;

  return (
    <header id="hdr" className="sticky top-0 z-30 backdrop-blur-xl border-b border-slate-300/80 dark:border-slate-800 bg-[#fbf9f5]/95 dark:bg-[#0a0e17]/95 shadow-xs transition-colors">
      {/* Newspaper Top Dateline Banner */}
      <div className="px-3.5 py-1 bg-slate-100/90 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-[7.5px] newspaper-dateline font-mono">
        <div className="flex items-center gap-2 truncate min-w-0">
          <span className="font-extrabold text-slate-800 dark:text-slate-200 tracking-wider truncate">
            {countryBranding.gazetteMasthead}
          </span>
          <span className="text-slate-400 shrink-0">·</span>
          <span className="hidden md:inline text-slate-500 shrink-0 font-medium">{countryBranding.culturalMotto}</span>
          <span className="hidden md:inline text-slate-400 shrink-0">·</span>
          <span className="hidden xs:inline text-slate-500 shrink-0">VOL. IV · NO. 88</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
            {countryBranding.flag} {countryBranding.countryCode} DISPATCH
          </span>
          <span className="text-slate-400">·</span>
          <span>{formattedToday}</span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="flex items-center justify-between px-3.5 py-2 gap-2">
        {/* Brand: CIVICDUTY with Mandatory Tagline "Speak · Serve · Be Heard" */}
        <div
          className="flex items-center gap-2 cursor-pointer group shrink-0 min-w-max"
          onClick={() => go(isGov ? 'gov_inbox' : 'feed')}
          title="CivicDuty — Speak · Serve · Be Heard"
        >
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse shrink-0" />
          <div className="flex flex-col">
            <div className="text-base sm:text-lg font-black font-serif newspaper-masthead uppercase text-slate-950 dark:text-white tracking-tight flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-none">
              <span>CIVICDUTY</span>
            </div>
            <div className="tagline text-[8px] sm:text-[8.5px] font-bold font-mono text-emerald-700 dark:text-emerald-400 tracking-[0.15em] uppercase flex items-center gap-1 pt-0.5 whitespace-nowrap">
              <span>Speak · Serve · Be Heard</span>
            </div>
          </div>
        </div>

        {/* Center: Desktop / Tablet Traffic Signal HUD */}
        <div className="hidden sm:flex items-center justify-center flex-1 max-w-xs px-2">
          <TrafficSignalHUD compact className="scale-95" />
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Offline / Cloud Sync Status Indicator */}
          {!isOnline ? (
            <div
              onClick={syncOfflineQueue}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-400 text-[8px] mono font-bold cursor-pointer animate-pulse"
              title="Offline Mode — Reports stored locally"
            >
              <WifiOff size={10} />
              <span className="hidden xs:inline">Offline</span>
            </div>
          ) : offlineQueue.length > 0 ? (
            <button
              onClick={syncOfflineQueue}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-[8px] mono font-bold hover:bg-emerald-500/30 transition-all cursor-pointer"
              title="Sync pending offline reports"
            >
              <CheckCircle2 size={10} />
              <span>Sync {offlineQueue.length}</span>
            </button>
          ) : (
            <div
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-[8px] mono font-bold"
              title="Phase 1: Cloud Firestore Persistent & Synced"
            >
              <Cloud size={10} className="text-sky-500" />
              <span>Cloud Sync</span>
            </div>
          )}

          {/* User Role Badge / Desk Switcher */}
          {isGov ? (
            <div className="flex items-center gap-1">
              {/* Only show Territorial Superadmin button if user is genuinely MoLG or view is ps_molg_rollout */}
              {(psInfo.isMoLG || (activeUser.role === 'platform_admin' && !psInfo.isPs && view !== 'ps_executive_desk')) && (
                <button
                  onClick={() => go('ps_molg_rollout')}
                  title={`Direct link: ${rolloutData.superadminTitle || 'National Superadmin Desk'}`}
                  className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[8px] mono font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
                >
                  <Building size={9} />
                  <span>{rolloutData.superadminShort || 'Superadmin'}</span>
                </button>
              )}

              {/* For other Line Ministry Permanent Secretaries, show their sector desk badge */}
              {psInfo.isPs && !psInfo.isMoLG && (
                <button
                  onClick={() => {
                    if (psInfo.ministryId) setSelectedMinistryId(psInfo.ministryId);
                    go('ps_executive_desk');
                  }}
                  title={`Direct link: ${psInfo.ministryName || 'Apex Executive Desk'}`}
                  className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 text-[8px] mono font-bold hover:opacity-90 transition-opacity shadow-2xs cursor-pointer"
                >
                  <Building size={9} />
                  <span>{psInfo.shortTitle || 'Executive Desk'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (psInfo.isPs && !psInfo.isMoLG && psInfo.ministryId) {
                    setSelectedMinistryId(psInfo.ministryId);
                    go('ps_executive_desk');
                  } else if (psInfo.isMoLG) {
                    go('ps_molg_rollout');
                  } else {
                    go(activeUser.role === 'platform_admin' ? 'gov_admin' : 'gov_team');
                  }
                }}
                title={psInfo.isPs ? 'Apex Executive Desk' : activeUser.role === 'platform_admin' ? 'Go to Admin Hub' : 'Go to Node Team'}
                className={`chip ${roleColors[activeUser.role] || 'ch-budget'} cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <Building size={10} />
                {activeUser.real_title_short || activeUser.role_label || 'GOV'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => go('profile')}
              title="View Watchdog Profile & Civic Reputation"
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-slate-900 border border-amber-500/30 text-amber-900 dark:text-amber-300 hover:border-amber-500/60 transition-all cursor-pointer font-bold"
            >
              {profile.avatar_url || activeUser.avatar_url ? (
                <img
                  src={profile.avatar_url || activeUser.avatar_url}
                  alt="avatar"
                  className="w-4 h-4 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ShieldCheck size={11} className="text-amber-600 dark:text-amber-400" />
              )}
              <span className="text-[9px] mono font-bold">{profile.civic_score || 0}pts</span>
            </button>
          )}

          {/* Digital Utility Perk Escrow Vault Button */}
          <button
            type="button"
            onClick={() => go('perk_vault')}
            aria-label="Open Digital Perk Escrow Vault"
            title="Pre-Funded Digital Utility Perk Escrow Vault"
            className="flex items-center gap-1 px-2 h-7 rounded-xl border border-amber-500/30 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:border-amber-500 transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            <Gift size={13} className="text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-wider hidden xs:inline">Perks</span>
          </button>

          {/* Field Manual / User Guidance Modal Button */}
          <button
            type="button"
            onClick={() => openGuide('quickstart')}
            aria-label="Open Field Manual & Guide"
            title="Field Manual & Guide: How CivicDuty Works"
            className="flex items-center gap-1 px-2 h-7 rounded-xl border border-teal-500/30 dark:border-teal-500/40 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 hover:border-teal-500 transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            <HelpCircle size={13} className="text-teal-600 dark:text-teal-400" />
            <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Guide</span>
          </button>

          {/* Universal Daylight / Darkness Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Daylight / Dark mode"
            title={`Switch to ${theme === 'dark' ? 'Daylight' : 'Darkness'} mode`}
            className="flex items-center justify-center w-7 h-7 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun size={13} className="text-amber-400" />
            ) : (
              <Moon size={13} className="text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sovereign Signal HUD Strip (clean dedicated row preventing header crowding) */}
      <div className="sm:hidden px-3.5 py-1 bg-slate-100/80 dark:bg-slate-900/70 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between">
        <span className="text-[8px] mono font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sovereign Signal Status</span>
        </span>
        <TrafficSignalHUD compact className="scale-90" />
      </div>

      {isGov && dept && (
        <div className="px-3.5 pb-2 pt-0.5 border-t border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="path-crumb text-slate-800 dark:text-slate-200 flex items-center gap-1 font-semibold text-[9.5px]">
            <span className="text-indigo-700 dark:text-indigo-300 font-black">{dept.name}</span>
            <span>·</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{activeUser.scope_label || activeUser.scope}</span>
          </div>
          <span className="text-[8px] mono text-slate-700 dark:text-slate-300 uppercase tracking-widest font-black">Sovereign Node</span>
        </div>
      )}
    </header>
  );
};
