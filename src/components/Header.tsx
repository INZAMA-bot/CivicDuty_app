import React from 'react';
import { useApp } from '../context/AppContext';
import { getDept, getRank } from '../utils/helpers';
import { ShieldCheck, Building, Sun, Moon, Wifi, WifiOff, Globe, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';

export const Header: React.FC = () => {
  const {
    user,
    ensureCitizenSession,
    view,
    go,
    profiles,
    theme,
    toggleTheme,
    language,
    setLanguage,
    isOnline,
    offlineQueue,
    syncOfflineQueue,
    t,
  } = useApp();

  const isAuthView = ['splash', 'ob1', 'ob2', 'ob3', 'ob_home', 'entity', 'entity_done', 'ussd', 'docs', 'verify'].includes(view);
  const activeUser = user || (!isAuthView ? ensureCitizenSession() : null);

  if (isAuthView || !activeUser) return null;

  const isGov = ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(activeUser.role);
  const profile = profiles[activeUser.id] || { civic_score: 50 };
  const rank = getRank(profile.civic_score || 0);

  const roleColors: Record<string, string> = {
    platform_admin: 'ch-corrupt',
    node_admin: 'ch-budget',
    spokesperson: 'ch-budget',
    read_only: 'ch-ro',
  };

  const dept = activeUser.dept ? getDept(activeUser.country, activeUser.dept) : null;

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'EN', label: 'EN' },
    { code: 'LG', label: 'LG' },
    { code: 'SW', label: 'SW' },
    { code: 'RW', label: 'RW' },
  ];

  return (
    <header id="hdr" className="sticky top-0 z-30 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-950/85 shadow-sm dark:shadow-lg transition-colors">
      <div className="flex items-center justify-between px-3.5 py-2">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => go(isGov ? 'gov_inbox' : 'feed')}>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
          <div>
            <div className="text-xs sm:text-sm font-black uppercase mono text-slate-900 dark:text-slate-100 tracking-[0.16em] flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              <span>CIVICDUTY</span>
              <span className="text-emerald-700 dark:text-emerald-400 text-[8.5px] lowercase font-normal px-1 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30">
                v14.1
              </span>
            </div>
            <div className="tagline text-[7px] text-slate-500 dark:text-slate-400 tracking-widest uppercase flex items-center gap-1">
              <span>{t('motto')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Offline Sync Status Indicator */}
          {!isOnline ? (
            <div
              onClick={syncOfflineQueue}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-400 text-[8px] mono font-bold cursor-pointer animate-pulse"
              title="Offline Mode — Reports stored locally"
            >
              <WifiOff size={10} />
              <span>Offline {offlineQueue.length > 0 ? `(${offlineQueue.length})` : ''}</span>
            </div>
          ) : offlineQueue.length > 0 ? (
            <button
              onClick={syncOfflineQueue}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-[8px] mono font-bold hover:bg-emerald-500/30 transition-all"
              title="Sync pending offline reports"
            >
              <CheckCircle2 size={10} />
              <span>Sync {offlineQueue.length}</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-slate-400 dark:text-slate-500 text-[8px] mono">
              <Wifi size={10} className="text-emerald-500" />
            </div>
          )}

          {/* Multilingual Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 p-0.5 text-[8px] mono font-bold">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-1.5 py-0.5 rounded ${
                  language === l.code
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* User Role Badge / Avatar */}
          {isGov ? (
            <span className={`chip ${roleColors[activeUser.role] || 'ch-budget'}`}>
              <Building size={10} />
              {activeUser.real_title_short || activeUser.role_label || 'GOV'}
            </span>
          ) : (
            <button
              onClick={() => go('profile')}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-slate-900 border border-amber-500/30 text-amber-800 dark:text-amber-300 hover:border-amber-500/60 transition-all cursor-pointer"
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

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {theme === 'dark' ? <Sun size={12} className="text-amber-400" /> : <Moon size={12} className="text-indigo-600" />}
          </button>
        </div>
      </div>

      {isGov && dept && (
        <div className="px-3.5 pb-2 pt-0.5 border-t border-slate-100 dark:border-slate-900/80 bg-slate-50/80 dark:bg-slate-950/50 flex items-center justify-between">
          <div className="path-crumb text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{dept.name}</span>
            <span>·</span>
            <span>{activeUser.scope_label || activeUser.scope}</span>
          </div>
          <span className="text-[7.5px] mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sovereign Node</span>
        </div>
      )}
    </header>
  );
};
