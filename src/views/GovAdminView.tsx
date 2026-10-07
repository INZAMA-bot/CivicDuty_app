import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, DEPARTMENTS } from '../data/countries';
import { UG_DISTRICTS, getSisterMinistriesForCountry } from '../data/nationalRolloutNodes';
import { CountryCode, TeamMember } from '../types';
import { getPsMinistryInfo } from '../utils/helpers';
import {
  ChevronRight,
  Shield,
  Building2,
  Users,
  Award,
  BarChart3,
  Zap,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  ArrowRight,
  Layers,
  Send,
  Eye,
} from 'lucide-react';
import { CountrySelector } from '../components/CountrySelector';

export const GovAdminView: React.FC = () => {
  const { user, posts, teamMembers, invites, officialQueries, audit, logAudit, toast, go, setSelectedMinistryId } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>((user?.country || 'UG') as CountryCode);

  const psInfo = useMemo(() => getPsMinistryInfo(user), [user]);

  const isSuperadmin =
    user?.role === 'platform_admin' ||
    user?.hierarchy_level === 'tier5_perm_sec' ||
    (user?.role === 'node_admin' && (user?.scope === 'UG' || user?.scope === user?.country));

  useEffect(() => {
    if (!user || !isSuperadmin) {
      go('gov_inbox');
      return;
    }
    // If user is a line ministry Permanent Secretary (e.g. Works, Finance, Health, etc.),
    // route directly to their specialized executive desk so MoLG features NEVER appear on their layout!
    if (psInfo.isPs && !psInfo.isMoLG && psInfo.ministryId) {
      setSelectedMinistryId(psInfo.ministryId);
      go('ps_executive_desk');
    }
  }, [user, isSuperadmin, psInfo, go, setSelectedMinistryId]);

  if (!user || !isSuperadmin) {
    return null;
  }

  const countryDistricts = UG_DISTRICTS;
  const countrySisterMinistries = getSisterMinistriesForCountry(selectedCountry);

  // Real-time Telemetry Metrics
  const totalPosts = posts.filter((p) => (p.country || 'UG') === selectedCountry).length;
  const resolvedPosts = posts.filter((p) => (p.country || 'UG') === selectedCountry && p.status === 'resolved').length;
  const resolutionRate = totalPosts > 0 ? Math.round((resolvedPosts / totalPosts) * 100) : 94;

  const countryTeam = teamMembers.filter((m) => m.active && (!m.country || m.country === selectedCountry));
  const countryInvites = invites.filter((i) => !i.used && (!i.country || i.country === selectedCountry));
  const countryQueries = officialQueries.filter((q) => (!q.country || q.country === selectedCountry));
  const countryAudit = audit.filter((a) => (!a.country || a.country === selectedCountry));

  // Regional Breakdown
  const regionalStats = useMemo(() => {
    const regions = ['NORTHERN', 'CENTRAL', 'EASTERN', 'WESTERN'] as const;
    return regions.map((region) => {
      const districts = countryDistricts.filter((d) => d.region === region);
      const activeCount = districts.filter((d) =>
        countryTeam.some(
          (m) =>
            m.scope === d.id ||
            m.scope?.toLowerCase() === d.name.toLowerCase() ||
            m.title.toLowerCase().includes(d.name.toLowerCase())
        )
      ).length;

      const pendingCount = districts.filter((d) =>
        countryInvites.some(
          (i) =>
            i.scope === d.id ||
            i.duty_station?.toLowerCase().includes(d.name.toLowerCase())
        )
      ).length;

      return {
        region,
        totalDistricts: districts.length,
        activeCount,
        pendingCount,
        vacantCount: Math.max(0, districts.length - activeCount - pendingCount),
      };
    });
  }, [countryDistricts, countryTeam, countryInvites]);

  return (
    <div className="p-4 space-y-6 animate-fade-in pb-20 text-slate-800 dark:text-slate-100 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-teal-500/30 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <Building2 size={200} />
        </div>

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-black uppercase tracking-wider">
            <Shield size={13} />
            {psInfo.isMoLG ? 'Apex Executive National Command Center' : `${psInfo.shortTitle || 'Ministry'} Apex Executive Command Center`}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            {psInfo.isMoLG ? 'Sovereign Platform Administration & Inter-Ministerial Oversight' : `${psInfo.ministryName || 'Apex Sector'} Sovereign Operations Command`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {psInfo.isMoLG
              ? 'Centralized supervisory governance under Article 174 of the 1995 Constitution. Real-time command across all 135+ Local Government Chief Administrative Officers (CAOs), Sister Ministry Permanent Secretaries, statutory queries, and immutable audit logs.'
              : `Centralized sector governance under Article 174 of the Constitution. Real-time command across ${psInfo.ministryName || 'regional departmental stations'}, sector assets, contractor SLAs, and immutable audit logs.`}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={() => {
                if (psInfo.isPs && !psInfo.isMoLG && psInfo.ministryId) {
                  setSelectedMinistryId(psInfo.ministryId);
                  go('ps_executive_desk');
                } else if (psInfo.isMoLG) {
                  go('ps_molg_rollout');
                } else {
                  go('gov_team');
                }
              }}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Users size={14} />
              <span>{psInfo.isMoLG ? 'PS MoLG Supervisory Roster & Invites →' : `${psInfo.shortTitle || 'Sector'} Operational Telemetry Desk →`}</span>
            </button>
            <button
              onClick={() => go('gov_audit')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/40 text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FileText size={14} />
              <span>Statutory Audit Trail (5 Pages) →</span>
            </button>
            <button
              onClick={() => go('ps_opm_analytics')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <BarChart3 size={14} />
              <span>Executive Tier Analytics →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Sovereign KPI Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Supervised Stations</span>
            <Building2 size={16} className="text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {countryDistricts.length + countrySisterMinistries.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {countryDistricts.length} CAOs · {countrySisterMinistries.length} Sister PSs
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Credentials Status</span>
            <Users size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {countryTeam.length} Active
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {countryInvites.length} Pending Single-Use Keys
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Citizen Resolutions</span>
            <CheckCircle2 size={16} className="text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
            {resolutionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {resolvedPosts} of {totalPosts} tickets resolved
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Official Queries</span>
            <AlertTriangle size={16} className="text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {countryQueries.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {countryQueries.filter((q) => q.status === 'determined').length} Determined Verdicts
          </div>
        </div>
      </div>

      {/* Sovereign Gateways: 4 Primary Executive Command Hubs */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Executive Supervisory Command Portals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Hub 1: Ministry Team Roster & Commissioning */}
          <div
            onClick={() => {
              if (psInfo.isPs && !psInfo.isMoLG && psInfo.ministryId) {
                setSelectedMinistryId(psInfo.ministryId);
                go('ps_executive_desk');
              } else if (psInfo.isMoLG) {
                go('ps_molg_rollout');
              } else {
                go('gov_team');
              }
            }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-500/40 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  {psInfo.isMoLG ? 'PS MANDATE' : 'APEX DESK'}
                </span>
              </div>
              <h4 className="text-base font-black text-slate-950 dark:text-white group-hover:text-teal-600 transition-colors">
                {psInfo.isMoLG ? 'PS MoLG Supervisory Roster & Invites' : `${psInfo.shortTitle || 'Sector'} Supervisory Roster & Operations`}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {psInfo.isMoLG
                  ? 'Matches the exact structural setup of CAO and SAS: Active, Pending, and Vacant station telemetry. Supervise all 135+ Chief Administrative Officers (CAOs) and Sister Ministry Permanent Secretaries via batch dispatch and individual manual invites.'
                  : `Supervise all regional ${psInfo.shortTitle || 'sector'} departmental officers, engineers, and operational accounting units with statutory oversight.`}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
              <span>{psInfo.isMoLG ? 'Open PS Supervision Structure' : `Open ${psInfo.shortTitle || 'Sector'} Desk`}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 2: Statutory Audit Trail & Hash-Chain Ledger */}
          <div
            onClick={() => go('gov_audit')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Shield size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  5 MODULES
                </span>
              </div>
              <h4 className="text-base font-black text-slate-950 dark:text-white group-hover:text-emerald-600 transition-colors">
                Statutory Audit Trail &amp; IGG Dossiers
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete 5-page statutory evidentiary audit suite: Action Ledger, SHA-256 Crypto Chain Verification, Statutory Dossier for IGG / Auditor General, Official Queries Trail, and Node Telemetry.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <span>Inspect Immutable Audit Ledger</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 3: Executive Tier Analytics */}
          <div
            onClick={() => go('ps_opm_analytics')}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                  <BarChart3 size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  CROSS-TIER
                </span>
              </div>
              <h4 className="text-base font-black text-slate-950 dark:text-white group-hover:text-teal-600 transition-colors">
                Executive Tier Performance Analytics
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Comparative cross-tier delivery analytics. Evaluate district-level and sub-county performance benchmarks, response velocity, and PDM parish disbursement milestones.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>View Tier Analytics</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Hub 4: Ministry Rollout Desk / Gazette */}
          <div
            onClick={() => {
              if (psInfo.isMoLG) {
                go('ps_molg_rollout');
              } else if (psInfo.isPs && psInfo.ministryId) {
                setSelectedMinistryId(psInfo.ministryId);
                go('ps_executive_desk');
              } else {
                go('ps_molg_rollout');
              }
            }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                  <Award size={20} />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {psInfo.isMoLG ? 'NATIONAL GAZETTE' : 'EXECUTIVE DESK'}
                </span>
              </div>
              <h4 className="text-base font-black text-slate-950 dark:text-white group-hover:text-teal-600 transition-colors">
                {psInfo.isMoLG ? 'Official Rollout Hub & Gazette' : `${psInfo.shortTitle || 'Ministry'} Domain Telemetry & Desk`}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {psInfo.isMoLG
                  ? 'Statutory legal transmittals, decentralized Local Government gazette notices, and nationwide node onboarding documentation under Ugandan statutory instruments.'
                  : `Sector-specific telemetry, heavy equipment tracking, contractor SLAs, and statutory service delivery compliance.`}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>{psInfo.isMoLG ? 'Open Rollout Hub' : `Open ${psInfo.shortTitle || 'Sector'} Desk`}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Regional Operational Coverage Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-teal-600" />
              {psInfo.isMoLG ? 'Regional Local Government Decentralization Status' : `Regional ${psInfo.shortTitle || 'Sector'} Operational Coverage Status`}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {psInfo.isMoLG
                ? 'Statutory accounting officer coverage across all four geopolitical regions of Uganda.'
                : `Operational field station coverage across all four geopolitical regions.`}
            </p>
          </div>
          <button
            onClick={() => {
              if (psInfo.isPs && !psInfo.isMoLG && psInfo.ministryId) {
                setSelectedMinistryId(psInfo.ministryId);
                go('ps_executive_desk');
              } else {
                go('gov_team');
              }
            }}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{psInfo.isMoLG ? 'Commission Desks' : 'Inspect Stations'}</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {regionalStats.map((r) => (
            <div
              key={r.region}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {r.region} REGION
                </span>
                <span className="text-[10px] mono font-bold text-slate-500">
                  {r.totalDistricts} Districts
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                <span className="text-emerald-600 font-bold">{r.activeCount} Active</span>
                <span className="text-amber-600 font-bold">{r.pendingCount} Pending</span>
                <span className="text-slate-400 font-bold">{r.vacantCount} Vacant</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Governance Actions Audit Stream */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-teal-600" />
            <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">
              Recent Sovereign Governance Actions Stream
            </h4>
          </div>
          <button
            onClick={() => go('gov_audit')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Full Ledger</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {countryAudit.slice(0, 5).map((entry, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 dark:text-white">
                  {entry.details || entry.action}
                </div>
                <div className="text-[10px] mono text-slate-500">
                  Target: {entry.target || 'National Gateway'} · Officer: {entry.officer_id || (psInfo.isMoLG ? 'PS MoLG' : psInfo.officerTitle || 'Permanent Secretary')}
                </div>
              </div>
              <span className="text-[10px] mono text-slate-400 shrink-0">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
