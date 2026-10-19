import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';
import { getPsMinistryInfo } from '../utils/helpers';
import {
  Shield,
  Building2,
  Plus,
  User,
  Inbox,
  Users,
  Eye,
  Power,
  Award,
  Scale,
  Layers,
  ShieldCheck,
  Landmark,
  Terminal,
  FileCheck2,
  BookOpen,
  HelpCircle,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Briefcase,
} from 'lucide-react';
import { TrafficLightLogo } from './TrafficLightLogo';

interface NavigationProps {
  isWide?: boolean;
}

export const Navigation: React.FC<NavigationProps> = () => {
  const { user, ensureCitizenSession, view, go, setUser, t, setSelectedMinistryId, openGuide, openLegalCenter } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const isPortalEntryView = [
    'splash',
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

  if (isPortalEntryView) return null;

  const activeUser = user || ensureCitizenSession();
  const psInfo = getPsMinistryInfo(activeUser);

  const isGov = ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(activeUser.role);

  const isPrivateProvider = Boolean(
    activeUser.entity_type === 'non_government_entity' ||
      activeUser.dept?.startsWith('ent-') ||
      activeUser.entity_category ||
      ['gayaza_hs', 'namagunga', 'cafe_javas', 'mak_univ', 'mulago_hosp', 'nakasero_hosp', 'serena_hotel_kla', 'stanbic', 'centenary_bank', 'kotsa_taxi', 'kigo_contractors'].includes(activeUser.dept || '')
  );

  // Check if political minister (Constitution Arts 111 & 117 - strategic policy oversight, apolitical head, no civil service team execution)
  const isMinister =
    activeUser.real_title_short?.includes('Minister') ||
    activeUser.role_label?.includes('Minister') ||
    activeUser.deskCode?.includes('-MIN') ||
    activeUser.deskCode === 'UG-MOLG-CABINET-MIN' ||
    activeUser.deskCode === 'UG-MOLG-STATE-MIN';

  // Check if grassroots lowest administrative officer (Parish Chief / Town Agent / Ward Officer)
  const isGrassrootsChief = Boolean(
    activeUser.role === 'parish_chief' ||
      activeUser.deskCode?.includes('PARISH') ||
      activeUser.deskCode?.includes('WARD') ||
      activeUser.hierarchy_level === 'tier1_lowest' ||
      activeUser.hierarchy_level === 'tier1_parish' ||
      activeUser.real_title_short?.toLowerCase().includes('parish chief') ||
      activeUser.real_title_short?.toLowerCase().includes('town agent') ||
      activeUser.real_title_short?.toLowerCase().includes('ward admin')
  );

  // Strictly restrict the Superadmin console to Permanent Secretaries (Vote 011 PS MoLG / statutory apex accounting officer)
  const isSuperAdmin =
    !isMinister &&
    (activeUser.role === 'platform_admin' || psInfo.isMoLG || activeUser.hierarchy_level === 'tier5_perm_sec') &&
    (activeUser.officer_name?.includes('Kumumanya') ||
      activeUser.real_title_short?.includes('PS') ||
      activeUser.role_label?.includes('Permanent Secretary') ||
      activeUser.deskCode === 'UG-MOLG-PS-011' ||
      activeUser.deskCode === 'PS-MOLG-2026' ||
      activeUser.deskCode === 'PS-MOLG-ROLLOUT');

  // Statutory Accounting Officers who manage institutional staff teams (PS, CAO, Town Clerk, Utility MD)
  const isAccountingOfficer = !isMinister && !isGrassrootsChief && (activeUser.role === 'node_admin' || activeUser.role === 'platform_admin' || activeUser.is_admin || psInfo.isPs);

  const handleApexClick = () => {
    if (psInfo.ministryId) {
      setSelectedMinistryId(psInfo.ministryId);
    }
    go('ps_executive_desk');
  };

  const citizenWorkspaceItems: { id: ViewType; label: string; icon: React.ElementType; onClick?: () => void; active?: boolean }[] = [
    { id: 'feed', label: t('feed') || 'Public Feed', icon: Layers },
    { id: 'depts', label: t('depts') || 'Service Desks', icon: Building2 },
    { id: 'perk_vault', label: 'Honours & Perks', icon: Award },
    { id: 'profile', label: t('profile') || 'My Dossier', icon: User },
  ];

  // Dedicated Workspace Navigation for Private Providers (Schools, Hospitals, Restaurants, Banks, SACCOs)
  const providerWorkspaceItems: { id: ViewType; label: string; icon: React.ElementType; onClick?: () => void; active?: boolean }[] = [
    {
      id: 'gov_inbox',
      label: activeUser.organization_name
        ? `${activeUser.organization_name.split('(')[0].trim().slice(0, 16)} Desk`
        : 'Provider Desk',
      icon: Building2,
    },
    { id: 'entity_team', label: 'Staff & Team Roster', icon: Users },
    { id: 'entity_register', label: 'Desk Profile & Tier', icon: Layers },
    { id: 'gov_projects', label: 'Facility Upgrades', icon: Briefcase },
    { id: 'perk_vault', label: '5-Vault Perks', icon: Award },
    { id: 'feed', label: 'Public Feed', icon: Eye },
  ];

  // Government Desk Workspace Navigation
  const govWorkspaceItems: { id: ViewType; label: string; icon: React.ElementType; onClick?: () => void; active?: boolean }[] = [
    { id: 'gov_inbox', label: isGrassrootsChief ? 'Grassroots Inbox' : isMinister ? 'Portfolio Inbox' : 'Official Inbox', icon: Inbox },
    { id: 'gov_projects', label: isMinister ? 'Portfolio Works (RO)' : 'Public Works', icon: Building2 },
    ...(isAccountingOfficer
      ? [
          {
            id: 'gov_team' as ViewType,
            label: psInfo.isPs && !psInfo.isMoLG ? 'Ministry Team' : 'Team Roster',
            icon: Users,
          },
        ]
      : []),
    ...(psInfo.isPs && !psInfo.isMoLG
      ? [
          {
            id: 'ps_executive_desk' as ViewType,
            label: 'Apex Executive',
            icon: Landmark,
            onClick: handleApexClick,
            active: view === 'ps_executive_desk',
          },
        ]
      : []),
    ...(isMinister
      ? [
          {
            id: 'ps_executive_desk' as ViewType,
            label: 'Ministerial Executive (RO)',
            icon: Scale,
            onClick: handleApexClick,
            active: view === 'ps_executive_desk',
          },
        ]
      : []),
    ...(isSuperAdmin
      ? [
          {
            id: 'gov_admin' as ViewType,
            label: 'Superadmin Console',
            icon: SlidersHorizontal,
            onClick: () => go('gov_admin'),
            active: view === 'gov_admin',
          },
          {
            id: 'ps_molg_rollout' as ViewType,
            label: 'Rollout Matrix',
            icon: Landmark,
            onClick: () => go('ps_molg_rollout'),
            active: view === 'ps_molg_rollout',
          },
        ]
      : []),
    { id: 'gov_audit', label: 'Audit Chain', icon: FileCheck2 },
    { id: 'feed', label: isGrassrootsChief ? 'Grassroots Feed' : 'Public Feed', icon: Eye },
  ];

  const studioConsoles: { id: ViewType; label: string; icon: React.ElementType }[] = [
    { id: 'ministerial_desk', label: 'Ministerial Desk', icon: Scale },
    { id: 'entity', label: 'Entity Gateway', icon: ShieldCheck },
    { id: 'ob2', label: 'Gov Desk Login', icon: Landmark },
    { id: 'ussd', label: 'USSD *3030#', icon: Terminal },
    { id: 'verify', label: 'Verify SHA-256', icon: FileCheck2 },
    { id: 'docs', label: 'Architecture', icon: BookOpen },
  ];

  return (
    <>
      {/* DESKTOP: Google AI Studio Left Persistent Collapsible Navigation Rail */}
      <aside
        id="studio-left-rail"
        className={`hidden md:flex flex-col justify-between border-r border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] shrink-0 select-none transition-all duration-200 sticky top-0 h-screen z-30 ${
          collapsed ? 'w-[64px]' : 'w-[236px]'
        }`}
      >
        <div className="flex flex-col min-h-0 flex-1 overflow-y-auto no-scrollbar">
          {/* Top Studio Brand Header */}
          <div className="h-13 px-3 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 shrink-0 bg-white dark:bg-[#161a22]">
            <div
              onClick={() => go(isGov || isPrivateProvider ? 'gov_inbox' : 'feed')}
              className="flex items-center gap-2 min-w-0 cursor-pointer group"
              title="CivicDuty Studio"
            >
              <TrafficLightLogo size="sm" variant="green-only" className="shrink-0" />
              {!collapsed && (
                <div className="min-w-0 flex flex-col leading-none">
                  <span className="text-[13px] font-black tracking-tight text-slate-900 dark:text-slate-100 truncate">
                    CIVICDUTY
                  </span>
                  <span className="text-[8.5px] font-mono font-bold uppercase tracking-tight text-emerald-700 dark:text-emerald-400 mt-0.5 truncate">
                    Speak · Serve · Be Heard
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-md hover:bg-[#e3e6ea]/60 dark:hover:bg-[#1e232d] text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <PanelLeftOpen size={15} strokeWidth={1.75} />
              ) : (
                <PanelLeftClose size={15} strokeWidth={1.75} />
              )}
            </button>
          </div>

          {/* Primary Action Button (Tailored to logged-in desk mode) */}
          <div className="p-2.5 shrink-0">
            {isGov ? (
              <button
                type="button"
                onClick={() => go(isMinister ? 'ps_executive_desk' : 'gov_inbox')}
                title={isGrassrootsChief ? 'Grassroots Inbox' : isMinister ? 'Ministerial Portfolio Desk' : 'Official Jurisdiction Inbox'}
                className={`w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center ${
                  collapsed ? 'justify-center px-0' : 'justify-start px-3 gap-2'
                } transition-colors cursor-pointer`}
              >
                <Inbox size={16} strokeWidth={2} className="shrink-0" />
                {!collapsed && (
                  <span className="truncate">
                    {isGrassrootsChief ? 'Grassroots Inbox' : isMinister ? 'Ministerial Desk' : 'Official Inbox'}
                  </span>
                )}
              </button>
            ) : isPrivateProvider ? (
              <button
                type="button"
                onClick={() => go('gov_inbox')}
                title="Provider Operations Desk"
                className={`w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center ${
                  collapsed ? 'justify-center px-0' : 'justify-start px-3 gap-2'
                } transition-colors cursor-pointer`}
              >
                <Building2 size={16} strokeWidth={2} className="shrink-0" />
                {!collapsed && (
                  <span className="truncate">
                    {activeUser.organization_name
                      ? `${activeUser.organization_name.split('(')[0].trim().slice(0, 16)} Desk`
                      : 'Provider Desk'}
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go('compose')}
                title="File New Civic Dispatch"
                className={`w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center ${
                  collapsed ? 'justify-center px-0' : 'justify-start px-3 gap-2'
                } transition-colors cursor-pointer`}
              >
                <Plus size={16} strokeWidth={2} className="shrink-0" />
                {!collapsed && <span className="truncate">+ New Civic Dispatch</span>}
              </button>
            )}
          </div>

          {/* Primary Workspace Links */}
          <div className="px-2 py-1 space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isPrivateProvider
                  ? 'Provider Desk'
                  : isGov
                  ? isGrassrootsChief
                    ? 'Grassroots Desk'
                    : isMinister
                    ? 'Ministerial Desk (RO)'
                    : 'Official Desk'
                  : 'Workspace'}
              </div>
            )}

            {(isPrivateProvider ? providerWorkspaceItems : isGov ? govWorkspaceItems : citizenWorkspaceItems).map((item) => {
              const Icon = item.icon;
              const isActive = item.active !== undefined ? item.active : view === item.id;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick || (() => go(item.id))}
                  title={item.label}
                  className={`w-full h-8.5 rounded-lg flex items-center ${
                    collapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
                  } text-[12.5px] transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-200/80 dark:bg-[#1e232d] text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-[#161a22] hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.75}
                    className={`shrink-0 ${
                      isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Studio Consoles & Tools - Exclusively for citizen/visitor portal exploration */}
          {!isGov && !isPrivateProvider && (
            <div className="px-2 py-2 mt-1 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-0.5">
              {!collapsed && (
                <div className="px-2.5 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Portals &amp; Consoles
                </div>
              )}
              {studioConsoles.map((tool) => {
                const Icon = tool.icon;
                const isActive = view === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => go(tool.id)}
                    title={tool.label}
                    className={`w-full h-8 rounded-lg flex items-center ${
                      collapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
                    } text-[12px] transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-200/80 dark:bg-[#1e232d] text-slate-900 dark:text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-[#161a22] hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                    }`}
                  >
                    <Icon
                      size={15}
                      strokeWidth={1.75}
                      className={`shrink-0 ${
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{tool.label}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Studio Footer */}
        <div className="p-2 border-t border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] space-y-0.5 shrink-0">
          <button
            type="button"
            onClick={() => openGuide('quickstart')}
            title="Field Manual & Quickstart"
            className={`w-full h-8 rounded-lg flex items-center ${
              collapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
            } text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer`}
          >
            <HelpCircle size={15} strokeWidth={1.75} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            {!collapsed && <span className="truncate">Field Manual</span>}
          </button>

          <button
            type="button"
            onClick={() => openLegalCenter('about')}
            title="Legal & Ethics Charter"
            className={`w-full h-8 rounded-lg flex items-center ${
              collapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
            } text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer`}
          >
            <FileText size={15} strokeWidth={1.75} className="shrink-0 text-slate-500 dark:text-slate-400" />
            {!collapsed && <span className="truncate">Legal Charter</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              if (isGov) setUser(null);
              go('splash');
            }}
            title={isGov ? 'Exit Official Desk' : 'Console Overview'}
            className={`w-full h-8 rounded-lg flex items-center ${
              collapsed ? 'justify-center px-0' : 'px-2.5 gap-2.5'
            } text-[12px] font-medium text-slate-600 dark:text-slate-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer`}
          >
            {isGov ? (
              <Power size={15} strokeWidth={1.75} className="shrink-0" />
            ) : (
              <Shield size={15} strokeWidth={1.75} className="shrink-0" />
            )}
            {!collapsed && <span className="truncate">{isGov ? 'Exit Official Desk' : 'Switch Portal'}</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE: Ergonomic Thumb-Zone Bottom Tab Bar (< md) - Exactly matches setup in screenshots */}
      <nav
        id="nav"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#1f242e] dark:border-[#1e232e] bg-[#0d1117]/95 dark:bg-[#0b0e14]/95 backdrop-blur-xl transition-colors pb-safe"
      >
        {/* Optional slim top strip when official/provider logged in to jump to institutional desk */}
        {(isGov || isPrivateProvider) && (
          <div className="flex items-center justify-between px-3.5 py-1 bg-emerald-950/80 border-b border-emerald-500/20 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="font-semibold text-emerald-300 truncate">
                {activeUser.organization_name || activeUser.real_title_short || 'Verified Institutional Desk'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => go('gov_inbox')}
              className="text-emerald-400 font-bold hover:underline shrink-0 ml-2"
            >
              Open Desk →
            </button>
          </div>
        )}

        <div className="flex justify-around items-center h-[58px] px-1.5 gap-1">
          {isGov ? (
            <>
              {/* 1. Official/Grassroots Inbox */}
              {(() => {
                const isActive = view === 'gov_inbox' || view === 'gov_reply';
                return (
                  <button
                    type="button"
                    onClick={() => go('gov_inbox')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Inbox size={19} strokeWidth={1.8} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight truncate max-w-[65px]">
                      {isGrassrootsChief ? 'Grassroots' : isMinister ? 'Portfolio' : 'Inbox'}
                    </span>
                  </button>
                );
              })()}

              {/* 2. Public Works / Portfolio Works */}
              {(() => {
                const isActive = view === 'gov_projects';
                return (
                  <button
                    type="button"
                    onClick={() => go('gov_projects')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 size={19} strokeWidth={1.8} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight truncate max-w-[65px]">
                      {isMinister ? 'Portfolio' : 'Works'}
                    </span>
                  </button>
                );
              })()}

              {/* 3. Center Highlight: Role specific action */}
              {(() => {
                if (isMinister) {
                  return (
                    <button
                      type="button"
                      onClick={handleApexClick}
                      className="flex-1 min-w-[70px] max-w-[80px] h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Scale size={20} strokeWidth={2.2} className="text-white shrink-0" />
                      <span className="text-[11px] font-mono font-bold text-white tracking-wide">Apex</span>
                    </button>
                  );
                }
                if (isSuperAdmin) {
                  return (
                    <button
                      type="button"
                      onClick={() => go('gov_admin')}
                      className="flex-1 min-w-[70px] max-w-[80px] h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold shadow-md transition-all cursor-pointer"
                    >
                      <SlidersHorizontal size={20} strokeWidth={2.2} className="text-white shrink-0" />
                      <span className="text-[11px] font-mono font-bold text-white tracking-wide">Admin</span>
                    </button>
                  );
                }
                if (isAccountingOfficer) {
                  return (
                    <button
                      type="button"
                      onClick={() => go('gov_team')}
                      className="flex-1 min-w-[70px] max-w-[80px] h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Users size={20} strokeWidth={2.2} className="text-white shrink-0" />
                      <span className="text-[11px] font-mono font-bold text-white tracking-wide">Team</span>
                    </button>
                  );
                }
                return (
                  <button
                    type="button"
                    onClick={() => go('gov_audit')}
                    className="flex-1 min-w-[70px] max-w-[80px] h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold shadow-md transition-all cursor-pointer"
                  >
                    <FileCheck2 size={20} strokeWidth={2.2} className="text-white shrink-0" />
                    <span className="text-[11px] font-mono font-bold text-white tracking-wide">Audit</span>
                  </button>
                );
              })()}

              {/* 4. Feed (Grassroots for Parish Chief, Feed for others) */}
              {(() => {
                const isFeedActive = view === 'feed' || view === 'post_detail';
                return (
                  <button
                    type="button"
                    onClick={() => go('feed')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isFeedActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye size={19} strokeWidth={1.8} className={isFeedActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight truncate max-w-[65px]">
                      {isGrassrootsChief ? 'Grassroots' : 'Feed'}
                    </span>
                  </button>
                );
              })()}

              {/* 5. Exit Official Desk */}
              <button
                type="button"
                onClick={() => {
                  setUser(null);
                  go('splash');
                }}
                className="flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Power size={19} strokeWidth={1.8} className="text-slate-400 hover:text-rose-400" />
                <span className="text-[10px] font-mono tracking-tight">Exit</span>
              </button>
            </>
          ) : isPrivateProvider ? (
            <>
              {/* 1. Provider Desk */}
              {(() => {
                const isActive = view === 'gov_inbox';
                return (
                  <button
                    type="button"
                    onClick={() => go('gov_inbox')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 size={19} strokeWidth={1.8} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight">Desk</span>
                  </button>
                );
              })()}

              {/* 2. Staff Roster */}
              {(() => {
                const isActive = view === 'entity_team';
                return (
                  <button
                    type="button"
                    onClick={() => go('entity_team')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Users size={19} strokeWidth={1.8} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight">Roster</span>
                  </button>
                );
              })()}

              {/* 3. Center Highlight: Upgrades */}
              <button
                type="button"
                onClick={() => go('gov_projects')}
                className="flex-1 min-w-[70px] max-w-[80px] h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold shadow-md transition-all cursor-pointer"
              >
                <Briefcase size={20} strokeWidth={2.2} className="text-white shrink-0" />
                <span className="text-[11px] font-mono font-bold text-white tracking-wide">Upgrades</span>
              </button>

              {/* 4. Perks Vault */}
              {(() => {
                const isActive = view === 'perk_vault';
                return (
                  <button
                    type="button"
                    onClick={() => go('perk_vault')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Award size={19} strokeWidth={1.8} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight">Perks</span>
                  </button>
                );
              })()}

              {/* 5. Public Feed */}
              {(() => {
                const isFeedActive = view === 'feed' || view === 'post_detail';
                return (
                  <button
                    type="button"
                    onClick={() => go('feed')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isFeedActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye size={19} strokeWidth={1.8} className={isFeedActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight">Feed</span>
                  </button>
                );
              })()}
            </>
          ) : (
            <>
              {/* CITIZEN LAYOUT (Unchanged) */}
              {/* 1. Civic Feed */}
              {(() => {
                const isFeedActive = view === 'feed' || view === 'post_detail';
                return (
                  <button
                    type="button"
                    onClick={() => go('feed')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isFeedActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers size={19} strokeWidth={1.8} className={isFeedActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight">Civic Feed</span>
                  </button>
                );
              })()}

              {/* 2. Departments */}
              {(() => {
                const isDeptsActive = view === 'depts' || view === 'dept_wall';
                return (
                  <button
                    type="button"
                    onClick={() => go('depts')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isDeptsActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 size={19} strokeWidth={1.8} className={isDeptsActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight">Departments</span>
                  </button>
                );
              })()}

              {/* 3. Center Highlight: Speak */}
              <button
                type="button"
                onClick={() => go('compose')}
                className="flex-1 min-w-[70px] max-w-[80px] h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus size={20} strokeWidth={2.5} className="text-white shrink-0" />
                <span className="text-[11px] font-mono font-bold text-white tracking-wide">Speak</span>
              </button>

              {/* 4. Perks */}
              {(() => {
                const isPerksActive = view === 'perk_vault';
                return (
                  <button
                    type="button"
                    onClick={() => go('perk_vault')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isPerksActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Award size={19} strokeWidth={1.8} className={isPerksActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight">Perks</span>
                  </button>
                );
              })()}

              {/* 5. Identity */}
              {(() => {
                const isIdentityActive = view === 'profile';
                return (
                  <button
                    type="button"
                    onClick={() => go('profile')}
                    className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors cursor-pointer ${
                      isIdentityActive
                        ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <User size={19} strokeWidth={1.8} className={isIdentityActive ? 'text-emerald-400' : 'text-slate-400'} />
                    <span className="text-[10px] font-mono tracking-tight">Identity</span>
                  </button>
                );
              })()}
            </>
          )}
        </div>
      </nav>
    </>
  );
};


