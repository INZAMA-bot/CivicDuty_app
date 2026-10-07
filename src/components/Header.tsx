import React from 'react';
import { useApp } from '../context/AppContext';
import { getDept, getPsMinistryInfo } from '../utils/helpers';
import {
  ShieldCheck,
  Building,
  WifiOff,
  CheckCircle2,
  Cloud,
  Award,
  Bell,
  MessageSquare,
  SlidersHorizontal,
} from 'lucide-react';
import { TrafficSignalHUD } from './TrafficSignalHUD';
import { TrafficLightLogo } from './TrafficLightLogo';
import { HeaderSettingsMenu } from './HeaderSettingsMenu';
import { getNationalRolloutArrangements } from '../data/tiers';

const VIEW_LABELS: Record<string, { section: string; title: string }> = {
  feed: { section: 'Workspace', title: 'Public Accountability Feed' },
  depts: { section: 'Workspace', title: 'Sovereign Service Directory' },
  dept_wall: { section: 'Workspace', title: 'Entity Accountability Wall' },
  post_detail: { section: 'Workspace', title: 'Master Incident Dossier' },
  compose: { section: 'Workspace', title: 'New Civic Dispatch' },
  profile: { section: 'Workspace', title: 'Citizen Watchdog Dossier' },
  perk_vault: { section: 'Workspace', title: 'Honours & Perk Escrow Vault' },
  gov_inbox: { section: 'Official Desk', title: 'Statutory Resolution Inbox' },
  gov_reply: { section: 'Official Desk', title: 'Official Proof & Dispatch' },
  gov_audit: { section: 'Official Desk', title: 'SHA-256 Audit Ledger' },
  gov_team: { section: 'Official Desk', title: 'Personnel & Desk Roster' },
  gov_projects: { section: 'Official Desk', title: 'Public Works & Tenders' },
  gov_admin: { section: 'Official Desk', title: 'National Superadmin Console' },
  gov_billing: { section: 'Official Desk', title: 'Sovereign Treasury & Billing' },
  ps_executive_desk: { section: 'Apex Executive', title: 'Permanent Secretary Command' },
  ps_molg_rollout: { section: 'Apex Executive', title: 'National Rollout Matrix' },
  ps_opm_analytics: { section: 'Apex Executive', title: 'Cabinet Performance Analytics' },
  entity: { section: 'Portals', title: 'Verified Entity Gateway' },
  entity_gateway: { section: 'Portals', title: 'Verified Entity Gateway' },
  entity_register: { section: 'Portals', title: 'Register Service Provider' },
  ob1: { section: 'Onboarding', title: 'Citizen Jurisdiction Setup' },
  ob2: { section: 'Portals', title: 'Official Desk Authentication' },
  ussd: { section: 'Consoles', title: 'USSD *3030# Offline Gateway' },
  verify: { section: 'Consoles', title: 'SHA-256 Cryptographic Verifier' },
  docs: { section: 'Consoles', title: 'System Architecture & Specs' },
  company_management: { section: 'Internal Ops', title: 'CD-Ops Tenancy Console' },
};

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
    setSelectedMinistryId,
    notifications,
    setNotifModalOpen,
    dmThreads,
    setDmModalOpen,
  } = useApp();

  if (view === 'splash') return null;

  const activeUser = user || ensureCitizenSession();
  const unreadNotifCount = (notifications || []).filter((n) => !n.read).length;
  const unreadDmCount = (dmThreads || []).reduce((acc, th) => acc + (th.unread || 0), 0);

  const isPortalAuthView = [
    'gov_login',
    'ob2',
    'entity',
    'entity_gateway',
    'entity_portal',
    'entity_register',
    'ob1',
    'onboarding_citizen',
    'ob_home',
    'ob3',
  ].includes(view);

  const isGov = ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(activeUser.role);
  const profile = profiles[activeUser.id] || { civic_score: 50 };
  const currentCountry = activeUser.country || 'UG';
  const rolloutData = getNationalRolloutArrangements(currentCountry);
  const psInfo = getPsMinistryInfo(activeUser);

  const roleColors: Record<string, string> = {
    platform_admin: 'ch-corrupt',
    node_admin: 'ch-budget',
    spokesperson: 'ch-budget',
    read_only: 'ch-ro',
  };

  const dept = activeUser.dept ? getDept(activeUser.country, activeUser.dept) : null;
  const viewInfo = VIEW_LABELS[view] || { section: 'Workspace', title: 'CivicDuty Studio' };

  return (
    <header
      id="hdr"
      className="sticky top-0 z-30 backdrop-blur-md border-b border-[#e3e6ea] dark:border-[#262b36] bg-white/95 dark:bg-[#161a22]/95 transition-colors"
    >
      {/* Mobile-First Single-Row Top App Bar */}
      <div className="h-13 px-3 sm:px-5 flex items-center justify-between gap-2">
        {/* Left: Green Light Logo + Brand & Breadcrumb */}
        <div className="flex items-center gap-2 min-w-0">
          <div
            onClick={() => go(isPortalAuthView ? 'splash' : isGov ? 'gov_inbox' : 'feed')}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <TrafficLightLogo size="sm" variant="green-only" />
            <div className="flex flex-col leading-none">
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-slate-100">
                CIVICDUTY
              </span>
              <span className="text-[8px] font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-tight mt-0.5 whitespace-nowrap">
                Speak · Serve · Be Heard
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs min-w-0 ml-2 pl-2 border-l border-[#e3e6ea] dark:border-[#262b36]">
            <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal size={13} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
              <span>{viewInfo.section}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {viewInfo.title}
            </span>
          </div>

          {!isPortalAuthView && isGov && dept && (
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{dept.name}</span>
              <span>·</span>
              <span className="truncate">{activeUser.scope_label || activeUser.scope}</span>
            </span>
          )}
        </div>

        {/* Center: Compact 3-Signal Sovereign Filter Pill (Desktop Only, hidden on Auth gates) */}
        {!isPortalAuthView && (
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <TrafficSignalHUD compact />
          </div>
        )}

        {/* Right: Clean Mobile-First Action Strip + Gear / 3-Dots Dropdown */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {isPortalAuthView ? (
            <button
              type="button"
              onClick={() => go('splash')}
              className="px-2.5 h-[34px] rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 text-[11px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>← Home</span>
            </button>
          ) : (
            <>
              {/* Offline / Cloud Sync Status Indicator */}
              {!isOnline ? (
                <div
                  onClick={syncOfflineQueue}
                  className="flex items-center gap-1 min-h-[34px] px-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-mono font-semibold cursor-pointer"
                  title="Offline Mode — Reports stored locally"
                >
                  <WifiOff size={12} strokeWidth={1.75} />
                  <span className="hidden sm:inline">Offline</span>
                </div>
              ) : offlineQueue.length > 0 ? (
                <button
                  onClick={syncOfflineQueue}
                  className="flex items-center gap-1 min-h-[34px] px-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-semibold hover:bg-emerald-500/25 transition-all cursor-pointer"
                  title="Sync pending offline reports"
                >
                  <CheckCircle2 size={12} strokeWidth={1.75} />
                  <span>{offlineQueue.length}</span>
                </button>
              ) : (
                <div
                  className="hidden xl:flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-300 text-[10px] font-mono font-medium"
                  title="Cloud Firestore Persistent & Synced"
                >
                  <Cloud size={12} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Synced</span>
                </div>
              )}

              {/* User Role Badge / Desk Switcher */}
              {isGov ? (
                <div className="flex items-center gap-1">
                  {(psInfo.isMoLG || (activeUser.role === 'platform_admin' && !psInfo.isPs && view !== 'ps_executive_desk')) && (
                    <button
                      onClick={() => go('ps_molg_rollout')}
                      title={`Direct link: ${rolloutData.superadminTitle || 'National Superadmin Desk'}`}
                      className="hidden lg:inline-flex items-center gap-1 h-8 px-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold hover:bg-emerald-500/15 transition-colors cursor-pointer"
                    >
                      <Building size={11} strokeWidth={1.75} />
                      <span>{rolloutData.superadminShort || 'Superadmin'}</span>
                    </button>
                  )}

                  {psInfo.isPs && !psInfo.isMoLG && (
                    <button
                      onClick={() => {
                        if (psInfo.ministryId) setSelectedMinistryId(psInfo.ministryId);
                        go('ps_executive_desk');
                      }}
                      title={`Direct link: ${psInfo.ministryName || 'Apex Executive Desk'}`}
                      className="hidden lg:inline-flex items-center gap-1 h-8 px-2 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 text-[10px] font-mono font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Building size={11} strokeWidth={1.75} />
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
                    <Building size={11} strokeWidth={1.75} />
                    <span className="max-w-[72px] sm:max-w-none truncate">
                      {activeUser.real_title_short || activeUser.role_label || 'GOV'}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => go('profile')}
                  title="View Watchdog Profile & Civic Reputation"
                  className="flex items-center gap-1 px-2 min-h-[34px] rounded-lg bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer font-medium"
                >
                  {profile.avatar_url || activeUser.avatar_url ? (
                    <img
                      src={profile.avatar_url || activeUser.avatar_url}
                      alt="avatar"
                      className="w-4 h-4 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ShieldCheck size={12} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <span className="text-[10.5px] font-mono tabular-nums font-semibold">{profile.civic_score || 0}pts</span>
                </button>
              )}

              {/* Honours & Perks Vault Button (Desktop shortcut; on mobile it's in bottom tab bar) */}
              <button
                type="button"
                onClick={() => go('perk_vault')}
                aria-label="Open Digital Perk Escrow Vault"
                title="Pre-Funded Digital Utility Perk Escrow Vault"
                className="hidden md:flex items-center gap-1 px-2.5 h-8 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer"
              >
                <Award size={13} strokeWidth={1.75} className="text-amber-600 dark:text-amber-400" />
                <span className="text-[11px] font-medium hidden lg:inline">Perks</span>
              </button>

              {/* Sovereign Notification Bell Button */}
              <button
                type="button"
                onClick={() => setNotifModalOpen(true)}
                aria-label="Open Sovereign Notification Center"
                title="Sovereign Notification Center"
                className="relative flex items-center justify-center w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer"
              >
                <Bell size={14} strokeWidth={1.75} />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-rose-600 text-white text-[8px] font-mono font-bold flex items-center justify-center">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Direct Messages Inbox Button */}
              <button
                type="button"
                onClick={() => setDmModalOpen(true)}
                aria-label="Open Direct Messages Inbox"
                title="Citizen Direct Messages & Neighborhood Watch Inbox"
                className="relative flex items-center justify-center w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer"
              >
                <MessageSquare size={14} strokeWidth={1.75} />
                {unreadDmCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 rounded-full bg-indigo-600 text-white text-[8px] font-mono font-bold flex items-center justify-center">
                    {unreadDmCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Compiled Gear / 3-Dots Dropdown Menu (Country, Language, Theme, Docs, Field Guide) */}
          <HeaderSettingsMenu />
        </div>
      </div>
    </header>
  );
};


