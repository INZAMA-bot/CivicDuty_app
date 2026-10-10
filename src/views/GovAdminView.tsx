import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, allDepts } from '../data/countries';
import { getNationalRolloutArrangements, tiersFor } from '../data/tiers';
import { getRolloutNodesForCountry, getSisterMinistriesForCountry } from '../data/nationalRolloutNodes';
import { getMinistriesForCountry } from '../data/countryMinistries';
import { CountryCode } from '../types';
import { getPsMinistryInfo } from '../utils/helpers';
import {
  ChevronRight,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Layers,
  Send,
  Lock,
  UserPlus,
  Copy,
  Compass,
  Eye,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface CommissionedCabinetMember {
  id: string;
  roleTitle: string;
  officialName: string;
  contact: string;
  passcode: string;
  tierLabel: string;
  status: 'Active' | 'Invited · Pending First Mount';
  accessMode: 'read_only' | 'policy_advisory';
}

export const GovAdminView: React.FC = () => {
  const {
    user,
    setUser,
    posts,
    teamMembers,
    invites,
    addInvite,
    mintGovAccessCode,
    officialQueries,
    audit,
    logAudit,
    toast,
    go,
    setActiveDept,
    setActiveDeptCountry,
    setSelectedMinistryId,
    showDemos,
  } = useApp();

  // Strictly lock to the official's commissioned country
  const activeCountry = (user?.country || 'UG') as CountryCode;
  const countryMeta = COUNTRIES[activeCountry] || COUNTRIES.UG;

  const rolloutArrangement = useMemo(
    () => getNationalRolloutArrangements(activeCountry),
    [activeCountry]
  );
  const countryTiers = useMemo(() => tiersFor(activeCountry), [activeCountry]);
  const rolloutNodes = useMemo(
    () => getRolloutNodesForCountry(activeCountry),
    [activeCountry]
  );
  const countrySisterMinistries = useMemo(
    () => getSisterMinistriesForCountry(activeCountry),
    [activeCountry]
  );
  const countryMinistries = useMemo(
    () => getMinistriesForCountry(activeCountry),
    [activeCountry]
  );

  const superadminMinistryName =
    rolloutArrangement.superadminMinistry || `${countryMeta.name} Ministry of Local Government & Devolution`;
  const superadminOfficerTitle =
    rolloutArrangement.superadminTitle || `Permanent Secretary / National Territorial Superadmin (${countryMeta.name})`;
  const superadminOfficerName =
    rolloutArrangement.superadminSubtitle || user?.name || `National Accounting Officer (${countryMeta.name})`;

  const psInfo = useMemo(() => getPsMinistryInfo(user), [user]);
  const isLinePs = psInfo.isPs && !psInfo.isMoLG;

  // Match Line Ministry metadata for activeCountry
  const matchedMinistry = useMemo(() => {
    if (!isLinePs) return null;
    const byId = countryMinistries.find((m) => m.id === psInfo.ministryId);
    if (byId) return byId;
    const raw = (psInfo.ministryName || '').toLowerCase();
    return (
      countryMinistries.find(
        (m) =>
          (m.title || '').toLowerCase().includes(raw) ||
          (m.shortTitle || '').toLowerCase() === (psInfo.shortTitle || '').toLowerCase()
      ) || countryMinistries[0]
    );
  }, [isLinePs, countryMinistries, psInfo]);

  // Strictly scope departments & posts to activeCountry and (if Line PS) their Ministry
  const scopedDepts = useMemo(() => {
    const allCountryDepts = allDepts(activeCountry);
    if (!isLinePs) return allCountryDepts;
    const mName = (psInfo.ministryName || '').toLowerCase();
    const mShort = (psInfo.shortTitle || '').toLowerCase();
    const filtered = allCountryDepts.filter((d) => {
      const dMin = (d.ministry || '').toLowerCase();
      const dFull = (d.full || '').toLowerCase();
      const dId = d.id.toLowerCase();
      if (mShort === 'mowt' && (dId.includes('unra') || dId.includes('works') || dId.includes('kura') || dId.includes('ferma') || dMin.includes('works') || dMin.includes('transport'))) return true;
      if (mShort === 'moh' && (dId.includes('nms') || dId.includes('health') || dId.includes('moh') || dMin.includes('health'))) return true;
      if (mShort === 'mowe' && (dId.includes('nwsc') || dId.includes('water') || dId.includes('nema') || dMin.includes('water'))) return true;
      if (mShort === 'mofped' && (dId.includes('ura') || dId.includes('kra') || dId.includes('firs') || dMin.includes('finance') || dMin.includes('treasury'))) return true;
      if (mShort === 'moes' && (dId.includes('uneb') || dId.includes('educ') || dMin.includes('education'))) return true;
      return dMin.includes(mName) || dFull.includes(mName);
    });
    return filtered.length > 0 ? filtered : allCountryDepts.slice(0, 3);
  }, [activeCountry, isLinePs, psInfo]);

  // Role options strictly scoped to the official's jurisdiction
  const inviteRoleOptions = useMemo(() => {
    if (isLinePs) {
      return [
        psInfo.cabinetMinisterTitle || `Cabinet Minister — ${psInfo.ministryName}`,
        ...(psInfo.stateMinisterTitles || [
          `Minister of State / Deputy Minister — ${psInfo.ministryName}`,
        ]),
        `Director of Technical Operations — ${psInfo.shortTitle || psInfo.ministryName}`,
        `Commissioner of Planning & Quality Assurance — ${psInfo.shortTitle || psInfo.ministryName}`,
        `Chief Internal Auditor — ${psInfo.shortTitle || psInfo.ministryName}`,
        ...scopedDepts.slice(0, 4).map(
          (ag) => `Executive Director / MD — ${ag.name}`
        ),
      ];
    }
    return [
      `Cabinet Minister — ${superadminMinistryName}`,
      `Minister of State / Deputy Minister — ${superadminMinistryName}`,
      ...countryTiers.map(
        (t, idx) => `Tier ${idx + 1} · ${t.title} (${t.unit})`
      ),
    ];
  }, [isLinePs, psInfo, scopedDepts, superadminMinistryName, countryTiers]);

  const [inviteRole, setInviteRole] = useState<string>(inviteRoleOptions[0] || 'Cabinet Minister');
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteContact, setInviteContact] = useState<string>('');
  const [inviteAccessMode, setInviteAccessMode] = useState<'read_only' | 'policy_advisory'>('read_only');
  const [commissionedCabinet, setCommissionedCabinet] = useState<CommissionedCabinetMember[]>(() => [
    {
      id: 'cab-minister-1',
      roleTitle: isLinePs
        ? psInfo.cabinetMinisterTitle || `Cabinet Minister — ${psInfo.ministryName}`
        : `Cabinet Minister — ${superadminMinistryName}`,
      officialName: isLinePs
        ? `Hon. Cabinet Minister (${psInfo.shortTitle || 'Ministry'})`
        : `Hon. Cabinet Minister (${superadminMinistryName.split('(')[0].trim()})`,
      contact: `minister.${(psInfo.shortTitle || 'gov').toLowerCase()}@${activeCountry.toLowerCase()}.gov`,
      passcode: `MIN-${(psInfo.shortTitle || activeCountry).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)}-${activeCountry}-2026`,
      tierLabel: 'Cabinet Policy & Political Oversight',
      status: 'Active',
      accessMode: 'read_only',
    },
    ...(psInfo.stateMinisterTitles || []).slice(0, 2).map((stTitle, idx) => ({
      id: `state-min-${idx}`,
      roleTitle: stTitle,
      officialName: `Hon. Minister of State #${idx + 1}`,
      contact: `stateminister${idx + 1}@${activeCountry.toLowerCase()}.gov`,
      passcode: `STM-${idx + 1}-${activeCountry}-2026`,
      tierLabel: 'State Minister / Portfolio Desk',
      status: (idx === 0 ? 'Active' : 'Invited · Pending First Mount') as
        | 'Active'
        | 'Invited · Pending First Mount',
      accessMode: 'read_only' as const,
    })),
  ]);

  const handleToggleMinisterAccessMode = (cabId: string) => {
    setCommissionedCabinet((prev) =>
      prev.map((c) => {
        if (c.id !== cabId) return c;
        const nextMode = c.accessMode === 'read_only' ? 'policy_advisory' : 'read_only';
        logAudit(
          'PS_MINISTER_ACCESS_MODE_UPDATED',
          c.passcode,
          `Permanent Secretary updated ${c.officialName} (${c.roleTitle}) warrant privilege to [${
            nextMode === 'read_only'
              ? 'STRICT READ-ONLY EXECUTIVE OVERSIGHT'
              : 'READ-ONLY ACCOUNTING + POLICY ADVISORY DIRECTIVES'
          }].`,
          activeCountry
        );
        toast(
          `${c.officialName} privilege set to: ${
            nextMode === 'read_only' ? 'Strict Read-Only Oversight' : 'Read-Only + Policy Advisory'
          }`,
          'emerald'
        );
        return { ...c, accessMode: nextMode };
      })
    );
  };

  const handleExperienceAsMinister = (cab: CommissionedCabinetMember) => {
    navigator.clipboard?.writeText(cab.passcode);
    logAudit(
      'MINISTER_WARRANT_CODE_COPIED',
      cab.passcode,
      `Copied ${cab.officialName} (${cab.roleTitle}) warrant key [${cab.passcode}] for strict access-code authentication.`,
      activeCountry
    );
    toast(
      `Strict Warrant Lock: Copied ${cab.passcode}. Paste it at the Official Desk to sign in as ${cab.officialName}.`,
      'emerald'
    );
    setUser(null);
    go('ob2');
  };

  const handleCommissionMinisterOrOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = inviteName.trim() || `Hon. ${inviteRole.split('—')[0].trim()}`;
    const cleanContact =
      inviteContact.trim() || `official.${Date.now().toString().slice(-3)}@${activeCountry.toLowerCase()}.gov`;
    const rand = Math.floor(1000 + Math.random() * 9000);
    const isMinisterRole = inviteRole.toUpperCase().includes('MINISTER');
    const prefix = isMinisterRole
      ? 'MIN'
      : inviteRole.toUpperCase().includes('DIRECTOR')
      ? 'DIR'
      : 'OFF';
    const generatedCode = `${prefix}-${(psInfo.shortTitle || activeCountry)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4)}-${rand}`;

    const assignedRole = isMinisterRole ? 'read_only' : 'node_admin';

    const newCab: CommissionedCabinetMember = {
      id: `cab-${Date.now()}`,
      roleTitle: inviteRole,
      officialName: cleanName,
      contact: cleanContact,
      passcode: generatedCode,
      tierLabel: isMinisterRole
        ? 'Ministerial Cabinet Warrant (PFMA Read-Only Accounting)'
        : 'Directorate / Agency Warrant',
      status: 'Active',
      accessMode: inviteAccessMode,
    };

    setCommissionedCabinet((prev) => [newCab, ...prev]);

    addInvite({
      code: generatedCode,
      name: cleanName,
      title: inviteRole,
      role: assignedRole,
      scope: isLinePs ? psInfo.ministryId || 'MINISTRY' : activeCountry,
      dept: isLinePs ? psInfo.ministryId || 'ministry' : 'molg',
      is_utility: false,
      used: false,
      country: activeCountry,
      duty_station: isLinePs ? psInfo.ministryName || 'Line Ministry' : superadminMinistryName,
      invited_by: user?.name || psInfo.officerTitle || 'Permanent Secretary',
      invited_at: new Date().toISOString(),
    });

    mintGovAccessCode(generatedCode, {
      country: activeCountry,
      dept: isLinePs ? psInfo.ministryId?.toLowerCase() || 'mowt' : 'molg',
      scope: isLinePs ? psInfo.ministryId || activeCountry : activeCountry,
      scope_label: isLinePs ? psInfo.ministryName || 'Line Ministry' : superadminMinistryName,
      role: assignedRole,
      role_label: `${cleanName} — ${inviteRole} (${
        inviteAccessMode === 'read_only' ? 'Read-Only Executive Oversight' : 'Policy Advisory Mode'
      })`,
    });

    logAudit(
      'MINISTERIAL_OFFICIAL_COMMISSIONED',
      `${cleanName} (${inviteRole})`,
      `Commissioned ${inviteRole} (${cleanName}) with passcode [${generatedCode}] and mode [${inviteAccessMode.toUpperCase()}] strictly within ${
        isLinePs ? psInfo.ministryName : superadminMinistryName
      } (${countryMeta.name}).`
    );

    setInviteName('');
    setInviteContact('');
    toast(
      `Invited ${cleanName} (${inviteRole}) · Mode: ${
        inviteAccessMode === 'read_only' ? 'Read-Only Executive' : 'Policy Advisory'
      } · Key: ${generatedCode}`,
      'emerald'
    );
  };

  const scopedPosts = useMemo(() => {
    const countryPosts = posts.filter((p) => (p.country || 'UG') === activeCountry && (showDemos || !p.is_demo));
    if (!isLinePs) return countryPosts;
    const deptIds = new Set(scopedDepts.map((d) => d.id));
    const filtered = countryPosts.filter((p) => deptIds.has(p.dept));
    return filtered.length > 0 ? filtered : countryPosts.slice(0, 4);
  }, [posts, activeCountry, isLinePs, scopedDepts, showDemos]);

  const resolvedPosts = scopedPosts.filter(
    (p) => p.status === 'resolved' || p.status.toUpperCase().includes('RESOLVED')
  ).length;
  const resolutionRate = scopedPosts.length > 0 ? Math.round((resolvedPosts / scopedPosts.length) * 100) : 94;

  const countryTeam = useMemo(() => {
    const base = teamMembers.filter((m) => m.active && (!m.country || m.country === activeCountry));
    if (!isLinePs) return base;
    const mShort = (psInfo.shortTitle || '').toLowerCase();
    const mName = (psInfo.ministryName || '').toLowerCase();
    return base.filter(
      (m) =>
        m.title.toLowerCase().includes(mShort) ||
        m.title.toLowerCase().includes(mName) ||
        (m.duty_station || '').toLowerCase().includes(mShort)
    );
  }, [teamMembers, activeCountry, isLinePs, psInfo]);

  const countryInvites = invites.filter((i) => !i.used && (!i.country || i.country === activeCountry));
  const countryQueries = officialQueries.filter((q) => !q.country || q.country === activeCountry);
  const countryAudit = audit.filter((a) => !a.country || a.country === activeCountry);

  // Dynamic Regional / Provincial / State Breakdown for ALL 100+ Countries using rolloutNodes
  const regionalStats = useMemo(() => {
    const map: Record<
      string,
      { region: string; totalNodes: number; activeCount: number; pendingCount: number; vacantCount: number }
    > = {};

    rolloutNodes.forEach((node) => {
      const reg = node.region || 'National Capital Region';
      if (!map[reg]) {
        map[reg] = {
          region: reg,
          totalNodes: 0,
          activeCount: 0,
          pendingCount: 0,
          vacantCount: 0,
        };
      }
      map[reg].totalNodes += 1;
      const st = (node.status || '').toLowerCase();
      if (st.includes('active') || st.includes('live')) map[reg].activeCount += 1;
      else if (st.includes('phase') || st.includes('pending')) map[reg].pendingCount += 1;
      else map[reg].vacantCount += 1;
    });

    return Object.values(map);
  }, [rolloutNodes]);

  const isNationalSuperadmin =
    user?.role === 'platform_admin' ||
    psInfo.isMoLG ||
    user?.dept === 'molg';

  // If any non-Superadmin Accounting Officer (e.g. Line Ministry PS, CAO, Town Clerk, Subcounty Chief, Parish Chief)
  // navigates directly to gov_admin, enforce strict jurisdictional isolation and route them to their own jurisdiction desk.
  if (!isNationalSuperadmin) {
    return (
      <div className="px-3.5 sm:px-5 pt-6 pb-24 max-w-2xl mx-auto animate-fade-in text-slate-900 dark:text-slate-100">
        <div className="bg-white dark:bg-[#161a22] p-5 sm:p-6 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <Lock size={14} />
            <span>Strict Jurisdictional Isolation Enforced</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            National Superadmin Console Restricted
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The National Superadmin Console is reserved exclusively for the National Territorial Superadmin ({superadminOfficerTitle}). As <strong>{user?.real_title_short || user?.role_label || 'Accounting Officer'}</strong>, your warrant is strictly locked to <strong>{isLinePs ? psInfo.ministryName : user?.scope_label || user?.dept_label || activeCountry}</strong> with zero cross-jurisdiction access.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {isLinePs ? (
              <button
                type="button"
                onClick={() => {
                  if (psInfo.ministryId) setSelectedMinistryId(psInfo.ministryId);
                  go('ps_executive_desk');
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold cursor-pointer transition-colors"
              >
                Open My {psInfo.shortTitle} Executive Apex Desk →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => go('gov_inbox')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold cursor-pointer transition-colors"
              >
                Return to My Jurisdiction Inbox →
              </button>
            )}
            <button
              type="button"
              onClick={() => go('gov_team')}
              className="px-4 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold cursor-pointer transition-colors"
            >
              Open My Jurisdiction Team Roster →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3.5 sm:px-5 pt-4 pb-24 max-w-5xl mx-auto space-y-4 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* 1. Sovereign Jurisdiction Header Card (Strictly Scoped to Country & Official Mandate) */}
      <div className="bg-white dark:bg-[#161a22] p-4 sm:p-5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200">
                {activeCountry} · {countryMeta.name.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
                <Lock size={11} />
                <span>
                  {isLinePs
                    ? `Strict Sector Jurisdiction: ${psInfo.ministryName}`
                    : `Adaptive National Superadmin · ${superadminMinistryName}`}
                </span>
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isLinePs
                ? `${psInfo.ministryName} (${countryMeta.name}) — Ministerial Admin & Cabinet Console`
                : `${countryMeta.name} — Adaptive Administrative Engine & Superadmin Command`}
            </h1>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {isLinePs
                ? psInfo.mandateSummary ||
                  `Strictly scoped to ${psInfo.ministryName} in ${countryMeta.name}. Commission your Cabinet Minister, Ministers of State, Technical Directors, and affiliated statutory agencies without cross-ministerial clutter.`
                : `Auto-adapted to ${countryMeta.name}'s ${countryTiers.length}-Tier constitutional governance hierarchy under ${superadminOfficerTitle} (${superadminOfficerName}). Supervises all ${rolloutNodes.length} decentralized regional/district authorities and ${countrySisterMinistries.length} sister ministries.`}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] shrink-0 min-w-[230px] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500">
              <span>Accounting Officer Warrant</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">LOCKED ({activeCountry})</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {user?.name || (isLinePs ? psInfo.officerTitle : superadminOfficerName)}
            </div>
            <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 truncate">
              {isLinePs ? psInfo.officerTitle : superadminOfficerTitle}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
          <button
            onClick={() => go('gov_team')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Users size={13} />
            <span>
              {isLinePs
                ? `Manage ${psInfo.shortTitle} Ministry Team & Cabinet Roster →`
                : `Manage ${countryMeta.name} Territorial Roster & Invites →`}
            </span>
          </button>

          {isLinePs ? (
            <button
              onClick={() => {
                if (psInfo.ministryId) setSelectedMinistryId(psInfo.ministryId);
                go('ps_executive_desk');
              }}
              className="px-3.5 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Open {psInfo.shortTitle} Executive Apex Desk →</span>
            </button>
          ) : (
            <button
              onClick={() => go('ps_molg_rollout')}
              className="px-3.5 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Compass size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Open {countryMeta.name} National Rollout &amp; Passcodes →</span>
            </button>
          )}

          <button
            onClick={() => go('gov_audit')}
            className="px-3.5 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileText size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Statutory Audit Suite →</span>
          </button>
        </div>
      </div>

      {/* 2. Real-time Sovereign KPI Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">
              {isLinePs ? 'Ministry Desks' : 'Supervised Nodes'}
            </span>
            <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {isLinePs
              ? commissionedCabinet.length + 3 + scopedDepts.length
              : rolloutNodes.length + countrySisterMinistries.length}
          </div>
          <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
            {isLinePs
              ? `${commissionedCabinet.length} Cabinet · ${scopedDepts.length} Agencies`
              : `${rolloutNodes.length} Territorial · ${countrySisterMinistries.length} Ministries`}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">
              Commissioned Officers
            </span>
            <Users size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {countryTeam.length + commissionedCabinet.length} Active
          </div>
          <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
            {countryInvites.length} Pending Warrants
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">
              {isLinePs ? 'Sector SLA Rate' : 'National SLA Rate'}
            </span>
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {resolutionRate}%
          </div>
          <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
            {resolvedPosts} of {scopedPosts.length} resolved
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">
              Statutory Queries
            </span>
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {countryQueries.length}
          </div>
          <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
            {countryQueries.filter((q) => q.status !== 'pending_response').length} Determined Verdicts
          </div>
        </div>
      </div>

      {/* 3. Ministerial Cabinet & Leadership Commissioning Studio (Invite Minister, State Ministers, Directors) */}
      <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <UserPlus size={12} />
              <span>
                {isLinePs
                  ? `${psInfo.ministryName} — Cabinet & Directorate Commissioning`
                  : `${countryMeta.name} — Cabinet Minister & Territorial Commissioning`}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Invite Officials Strictly Within Your Jurisdiction (Cabinet Minister, State Ministers &amp; Directors)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              As Permanent Secretary (Accounting Officer), generate cryptographic desk passcodes to onboard your Cabinet Minister, Ministers of State, and Technical Directors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => go('gov_team')}
            className="px-3 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Users size={13} />
            <span>Full Team Page →</span>
          </button>
        </div>

        <form
          onSubmit={handleCommissionMinisterOrOfficial}
          className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                1. Select Official Portfolio in Your Ministry
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                {inviteRoleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                2. Official Full Name &amp; Title
              </label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder={
                  isLinePs
                    ? `e.g. Hon. Cabinet Minister (${psInfo.shortTitle || 'Sector'})`
                    : `e.g. Hon. Cabinet Minister (${countryMeta.name})`
                }
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                3. PS Statutory Warrant Mode &amp; Email Dispatch
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={inviteAccessMode}
                  onChange={(e) => setInviteAccessMode(e.target.value as 'read_only' | 'policy_advisory')}
                  className="px-2.5 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  title="Under the Public Finance Management Act (PFMA), the PS sets the Minister's operational warrant scope"
                >
                  <option value="read_only">Read-Only Executive Oversight (PFMA Default)</option>
                  <option value="policy_advisory">Read-Only Accounting + Policy Advisory</option>
                </select>
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={inviteContact}
                    onChange={(e) => setInviteContact(e.target.value)}
                    placeholder={`minister@${activeCountry.toLowerCase()}.gov`}
                    className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Invite</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {commissionedCabinet.map((cab) => (
            <div
              key={cab.id}
              className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col justify-between gap-2.5"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    {cab.tierLabel}
                  </span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                    {cab.status === 'Active' ? 'Active' : 'Invited'}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {cab.roleTitle}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  {cab.officialName} · <span className="font-mono">{cab.contact}</span>
                </div>

                {/* PS Warrant Privilege Badge & Toggle */}
                <div className="pt-1.5 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-700 dark:text-amber-400">
                    <Eye size={11} />
                    <span>
                      {cab.accessMode === 'read_only'
                        ? 'Read-Only Executive Oversight'
                        : 'Read-Only + Policy Advisory'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleMinisterAccessMode(cab.id)}
                    className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    title="Permanent Secretary tool: Toggle between Strict Read-Only Oversight and Policy Advisory mode"
                  >
                    PS Toggle Mode ↻
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-[10.5px] font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#161a22] px-2 py-0.5 rounded border border-[#e3e6ea] dark:border-[#262b36]">
                    {cab.passcode}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(cab.passcode);
                      toast(`Copied commissioning passcode ${cab.passcode}`, 'emerald');
                    }}
                    className="px-2 py-1 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={11} />
                    <span>Copy Key</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleExperienceAsMinister(cab)}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 text-[10.5px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                >
                  <Lock size={12} />
                  <span>Copy Warrant &amp; Sign In at Official Desk</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Adaptive Administrative Engine: Country 5-Tier Hierarchy (for Superadmin) OR Strict Ministry Architecture (for Line PS) */}
      {isLinePs ? (
        <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers size={15} className="text-emerald-600 dark:text-emerald-400" />
                <span>{psInfo.ministryName} — Technical Directorates &amp; Supervised Authorities</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Strictly isolated to {psInfo.ministryName} ({countryMeta.name}). No other ministry or territorial local government controls are exposed.
              </p>
            </div>
            <button
              onClick={() => {
                if (psInfo.ministryId) setSelectedMinistryId(psInfo.ministryId);
                go('ps_executive_desk');
              }}
              className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Apex Desk</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Internal Ministry Technical Directorates
              </div>
              <div className="space-y-1.5">
                {[
                  `Directorate of Policy, Planning & Quality Assurance (${psInfo.shortTitle || 'Ministry'})`,
                  `Directorate of Technical Operations & Engineering (${psInfo.shortTitle || 'Ministry'})`,
                  `Directorate of Finance, Procurement & Internal Audit (${psInfo.shortTitle || 'Ministry'})`,
                  matchedMinistry?.uniqueFeatureName
                    ? `Specialized Command: ${matchedMinistry.uniqueFeatureName}`
                    : `Directorate of Field Inspectorate & Statutory Compliance`,
                ].map((dir, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{dir}</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Supervised Statutory Agencies &amp; Public Walls
              </div>
              <div className="space-y-1.5">
                {scopedDepts.slice(0, 4).map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setActiveDept(d.id);
                      setActiveDeptCountry(activeCountry);
                      go('dept_wall');
                    }}
                    className="p-2.5 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/50 flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{d.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{d.full}</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Inspect Wall →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Layers size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>
                  {countryMeta.name} ({activeCountry}) — {countryTiers.length}-Tier Adaptive Governance Hierarchy
                </span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically adapted to {countryMeta.name}&apos;s constitutional administrative structure under {superadminOfficerTitle}.
              </p>
            </div>
            <button
              onClick={() => go('ps_molg_rollout')}
              className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open National Rollout &amp; Passcodes</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Adaptive Tier Ladder for Active Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {countryTiers.map((t, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      LEVEL {idx + 1} · {t.tier.toUpperCase()}
                    </span>
                    <span className="text-slate-500">{t.sla}h SLA</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {t.unit}
                  </div>
                  <div className="text-[10.5px] font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                    {t.title} ({t.short})
                  </div>
                </div>
                <div className="pt-1.5 border-t border-[#e3e6ea] dark:border-[#262b36] text-[9.5px] font-mono text-slate-500">
                  {idx === 0
                    ? 'Apex National Escalation Authority'
                    : `Escalates → ${countryTiers[idx - 1]?.short || 'National PS'}`}
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Regional / Provincial Decentralization Status for Active Country */}
          <div className="pt-2 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {countryMeta.name} Geopolitical Regions / Provinces ({rolloutNodes.length} Statutory Nodes)
              </span>
              <button
                onClick={() => go('gov_team')}
                className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Commission Regional &amp; District Desks</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {regionalStats.map((r) => (
                <div
                  key={r.region}
                  className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {r.region}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 shrink-0">
                      {r.totalNodes} Nodes
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono pt-1.5 border-t border-[#e3e6ea] dark:border-[#262b36]">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {r.activeCount} Active
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      {r.pendingCount} Rollout
                    </span>
                    <span className="text-slate-400">{r.vacantCount} Standby</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Real-time Governance Actions Audit Stream */}
      <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Recent Sovereign Governance Actions Stream ({countryMeta.name})
            </h4>
          </div>
          <button
            onClick={() => go('gov_audit')}
            className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Ledger</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-[#e3e6ea] dark:divide-[#262b36] text-xs">
          {countryAudit.slice(0, 5).map((entry, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {entry.detail || entry.action}
                </div>
                <div className="text-[10.5px] font-mono text-slate-500">
                  Ticket: {entry.ticket_id || 'Jurisdiction Gateway'} · Officer:{' '}
                  {entry.actor_name || (psInfo.isMoLG ? superadminOfficerTitle : psInfo.officerTitle || 'Permanent Secretary')}
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {entry.ts}
              </span>
            </div>
          ))}
          {countryAudit.length === 0 && (
            <div className="py-4 text-center text-slate-400 italic">
              No recent governance actions recorded. System ready for commissioning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

