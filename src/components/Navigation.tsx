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
  const isAdmin =
    activeUser.role === 'platform_admin' ||
    activeUser.hierarchy_level === 'tier5_perm_sec' ||
    psInfo.isPs ||
    Boolean(activeUser.is_admin) ||
    (activeUser.role === 'node_admin' && (activeUser.scope === 'UG' || activeUser.scope === activeUser.country));
  const isNode = activeUser.role === 'node_admin' || activeUser.role === 'platform_admin' || activeUser.is_admin || psInfo.isPs;

  const handleApexClick = () => {
    if (psInfo.ministryId) {
      setSelectedMinistryId(psInfo.ministryId);
    }
    go('ps_executive_desk');
  };

  const citizenWorkspaceItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
    { id: 'feed', label: t('feed') || 'Public Feed', icon: Layers },
    { id: 'depts', label: t('depts') || 'Service Desks', icon: Building2 },
    { id: 'perk_vault', label: 'Honours & Perks', icon: Award },
    { id: 'profile', label: t('profile') || 'My Dossier', icon: User },
  ];

  const govWorkspaceItems: { id: ViewType; label: string; icon: React.ElementType; onClick?: () => void; active?: boolean }[] = [
    { id: 'gov_inbox', label: 'Official Inbox', icon: Inbox },
    { id: 'gov_projects', label: 'Public Works', icon: Building2 },
    ...(isNode
      ? [
          {
            id: 'gov_team' as ViewType,
            label: psInfo.isPs && !psInfo.isMoLG ? 'Ministry Team' : 'Team Roster',
            icon: Users,
          },
        ]
      : []),
    ...(isAdmin
      ? psInfo.isPs && !psInfo.isMoLG
        ? [
            {
              id: 'gov_admin' as ViewType,
              label: 'Ministry Admin',
              icon: SlidersHorizontal,
              onClick: () => go('gov_admin'),
              active: view === 'gov_admin',
            },
            {
              id: 'ps_executive_desk' as ViewType,
              label: 'Apex Executive',
              icon: Landmark,
              onClick: handleApexClick,
              active: view === 'ps_executive_desk',
            },
          ]
        : psInfo.isMoLG
          ? [
              {
                id: 'gov_admin' as ViewType,
                label: 'Superadmin',
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
          : [
              {
                id: 'gov_admin' as ViewType,
                label: 'Admin Console',
                icon: SlidersHorizontal,
                onClick: () => go('gov_admin'),
                active: view === 'gov_admin',
              },
            ]
      : []),
    { id: 'gov_audit', label: 'Audit Chain', icon: Scale },
    { id: 'feed', label: 'Public Feed', icon: Eye },
  ];

  const studioConsoles: { id: ViewType; label: string; icon: React.ElementType }[] = [
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
              onClick={() => go(isGov ? 'gov_inbox' : 'feed')}
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

          {/* Primary Studio Action Button (+ Create new dispatch) */}
          <div className="p-2.5 shrink-0">
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
          </div>

          {/* Primary Workspace Links */}
          <div className="px-2 py-1 space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isGov ? 'Official Desk' : 'Workspace'}
              </div>
            )}

            {isGov
              ? govWorkspaceItems.map((item) => {
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
                })
              : citizenWorkspaceItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    view === item.id ||
                    (item.id === 'depts' && view === 'dept_wall') ||
                    (item.id === 'feed' && view === 'post_detail');
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go(item.id)}
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

          {/* Studio Consoles & Tools */}
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

      {/* MOBILE: Ergonomic Thumb-Zone Bottom Tab Bar (< md) */}
      <nav
        id="nav"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#e3e6ea] dark:border-[#262b36] px-1.5 py-1 pb-safe bg-white/95 dark:bg-[#161a22]/95 backdrop-blur-xl transition-colors"
        style={{ minHeight: '60px' }}
      >
        <div className="flex justify-around items-center h-full gap-1">
          {isGov ? (
            <>
              <button
                onClick={() => go('gov_inbox')}
                className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                  view === 'gov_inbox'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Inbox size={18} strokeWidth={1.75} />
                <span className="text-[9.5px] font-mono">Inbox</span>
              </button>
              <button
                onClick={() => go('gov_projects')}
                className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                  view === 'gov_projects'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Building2 size={18} strokeWidth={1.75} />
                <span className="text-[9.5px] font-mono">Works</span>
              </button>
              {isNode && (
                <button
                  onClick={() => go('gov_team')}
                  className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                    view === 'gov_team'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Users size={18} strokeWidth={1.75} />
                  <span className="text-[9.5px] font-mono">Team</span>
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => go('gov_admin')}
                  className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                    view === 'gov_admin'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <SlidersHorizontal size={18} strokeWidth={1.75} />
                  <span className="text-[9.5px] font-mono">Admin</span>
                </button>
              )}
              {psInfo.isPs && !psInfo.isMoLG && (
                <button
                  onClick={handleApexClick}
                  className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                    view === 'ps_executive_desk'
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 font-semibold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Landmark size={18} strokeWidth={1.75} />
                  <span className="text-[9.5px] font-mono">Apex</span>
                </button>
              )}
              <button
                onClick={() => go('gov_audit')}
                className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                  view === 'gov_audit'
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Scale size={18} strokeWidth={1.75} />
                <span className="text-[9.5px] font-mono">Audit</span>
              </button>
              <button
                onClick={() => {
                  setUser(null);
                  go('splash');
                }}
                className="flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl text-rose-500 dark:text-rose-400 cursor-pointer"
              >
                <Power size={18} strokeWidth={1.75} />
                <span className="text-[9.5px] font-mono">Exit</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => go('feed')}
                className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                  view === 'feed' || view === 'post_detail'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Layers size={18} strokeWidth={1.75} />
                <span className="text-[9.5px] font-mono">{t('feed')}</span>
              </button>
              <button
                onClick={() => go('depts')}
                className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                  view === 'depts' || view === 'dept_wall'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Building2 size={18} strokeWidth={1.75} />
                <span className="text-[9.5px] font-mono">{t('depts')}</span>
              </button>
              <button
                onClick={() => go('compose')}
                className="flex-1 min-h-[46px] max-w-[76px] flex flex-col items-center justify-center gap-0.5 rounded-xl bg-emerald-600 active:scale-95 text-white font-semibold shadow-2xs transition-transform cursor-pointer"
              >
                <Plus size={18} strokeWidth={2.25} />
                <span className="text-[9.5px] font-mono">{t('compose')}</span>
              </button>
              <button
                onClick={() => go('perk_vault')}
                className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                  view === 'perk_vault'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Award size={18} strokeWidth={1.75} />
                <span className="text-[9.5px] font-mono">Perks</span>
              </button>
              <button
                onClick={() => go('profile')}
                className={`flex-1 min-h-[46px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors cursor-pointer ${
                  view === 'profile'
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <User size={18} strokeWidth={1.75} />
                <span className="text-[9.5px] font-mono">{t('profile')}</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};


