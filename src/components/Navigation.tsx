import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';
import { getPsMinistryInfo } from '../utils/helpers';
import { Shield, Building2, Plus, User, Inbox, Users, Eye, Power, Sparkles } from 'lucide-react';

interface NavigationProps {
  isWide?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isWide }) => {
  const { user, ensureCitizenSession, view, go, setUser, t, setSelectedMinistryId } = useApp();

  const isAuthView = ['splash', 'ob1', 'ob2', 'ob3', 'ob_home', 'entity', 'entity_done', 'ussd', 'docs'].includes(view);
  const activeUser = user || (!isAuthView ? ensureCitizenSession() : null);

  if (isAuthView || !activeUser) return null;

  const psInfo = getPsMinistryInfo(activeUser);

  const isGov = ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(activeUser.role);
  const isAdmin =
    activeUser.role === 'platform_admin' ||
    activeUser.hierarchy_level === 'tier5_perm_sec' ||
    (activeUser.role === 'node_admin' && (activeUser.scope === 'UG' || activeUser.scope === activeUser.country));
  const isNode = activeUser.role === 'node_admin' || activeUser.role === 'platform_admin' || activeUser.is_admin;

  const navItem = (v: ViewType | '', icon: React.ReactNode, label: string, activeV: ViewType, customClick?: () => void, isSpecial?: boolean) => {
    const active = view === activeV;
    const activeClass = active ? (isGov ? 'nav-gov-active' : 'nav-active') : '';

    return (
      <button
        key={label}
        onClick={customClick || (() => v && go(v))}
        className={`nav-item relative group ${activeClass} ${isSpecial ? 'scale-105' : ''}`}
      >
        {active && (
          <div className="absolute inset-0 bg-emerald-500/10 rounded-xl blur-sm -z-10" />
        )}
        <div className={`p-1 rounded-lg transition-transform group-hover:scale-110 ${active ? (isGov ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400') : 'text-slate-500 dark:text-slate-400'}`}>
          {icon}
        </div>
        <span className="nav-label text-[8px] font-bold tracking-wider">{label}</span>
        <span className="nav-pip mt-1" />
      </button>
    );
  };

  const adminTargetView: ViewType = psInfo.isPs && !psInfo.isMoLG ? 'ps_executive_desk' : psInfo.isMoLG ? 'ps_molg_rollout' : 'gov_admin';
  const isAdminActive = view === 'gov_admin' || view === 'ps_executive_desk' || view === 'ps_molg_rollout';

  const handleAdminClick = () => {
    if (psInfo.isPs && !psInfo.isMoLG && psInfo.ministryId) {
      setSelectedMinistryId(psInfo.ministryId);
      go('ps_executive_desk');
    } else if (psInfo.isMoLG) {
      go('ps_molg_rollout');
    } else {
      go('gov_admin');
    }
  };

  return (
    <nav
      id="nav"
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full ${
        isWide ? 'max-w-5xl' : 'max-w-md'
      } z-30 border-t border-slate-200/90 dark:border-slate-800/90 px-3 py-1.5 pb-safe bg-white/95 dark:bg-slate-950/90 backdrop-blur-2xl shadow-[0_-4px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_-10px_35px_rgba(0,0,0,0.85)] ring-1 ring-black/5 dark:ring-white/5 transition-colors`}
      style={{ minHeight: '62px' }}
    >
      <div className="flex justify-around items-center h-full">
        {isGov ? (
          <>
            {navItem('gov_inbox', <Inbox size={19} className="stroke-[1.8]" />, 'Inbox', 'gov_inbox')}
            {navItem('gov_projects', <Building2 size={19} className="stroke-[1.8]" />, 'Works', 'gov_projects')}
            {isNode && navItem('gov_team', <Users size={19} className="stroke-[1.8]" />, 'Team', 'gov_team')}
            {isAdmin && navItem(adminTargetView, <Eye size={19} className="stroke-[1.8]" />, psInfo.isPs ? 'Apex' : 'Admin', isAdminActive ? view : adminTargetView, handleAdminClick)}
            {navItem('gov_audit', <Eye size={19} className="stroke-[1.8]" />, 'Audit', 'gov_audit')}
            {navItem(
              '',
              <Power size={18} className="stroke-[2] text-rose-500 dark:text-rose-400/90" />,
              'Exit',
              'splash',
              () => {
                setUser(null);
                go('splash');
              }
            )}
          </>
        ) : (
          <>
            {navItem('feed', <Shield size={19} className="stroke-[1.8]" />, t('feed'), 'feed')}
            {navItem('depts', <Building2 size={19} className="stroke-[1.8]" />, t('depts'), 'depts')}
            {navItem('compose', <Plus size={20} className="stroke-[2.5] text-emerald-600 dark:text-emerald-400" />, t('compose'), 'compose', undefined, true)}
            {navItem('profile', <User size={19} className="stroke-[1.8]" />, t('profile'), 'profile')}
          </>
        )}
      </div>
    </nav>
  );
};

