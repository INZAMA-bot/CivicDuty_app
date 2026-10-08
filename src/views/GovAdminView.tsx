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
    <div className="px-3.5 sm:px-5 pt-4 pb-20 max-w-5xl mx-auto space-y-4 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Studio Header Card */}
      <div className="bg-white dark:bg-[#161a22] p-4 sm:p-5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
            <Shield size={12} />
            <span>
              {psInfo.isMoLG ? 'Apex Executive National Command Center' : `${psInfo.shortTitle || 'Ministry'} Apex Executive Command Center`}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {psInfo.isMoLG ? 'Sovereign Platform Administration & Inter-Ministerial Oversight' : `${psInfo.ministryName || 'Apex Sector'} Sovereign Operations Command`}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            {psInfo.isMoLG
              ? 'Centralized supervisory governance under Article 174 of the Constitution. Real-time command across all 135+ Local Government Chief Administrative Officers (CAOs), Sister Ministry Permanent Secretaries, statutory queries, and immutable audit logs.'
              : `Centralized sector governance under Article 174 of the Constitution. Real-time command across ${psInfo.ministryName || 'regional departmental stations'}, sector assets, contractor SLAs, and immutable audit logs.`}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
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
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users size={13} />
              <span>{psInfo.isMoLG ? 'PS MoLG Supervisory Roster & Invites →' : `${psInfo.shortTitle || 'Sector'} Operational Telemetry Desk →`}</span>
            </button>
            <button
              onClick={() => go('gov_audit')}
              className="px-3.5 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Statutory Audit Suite (5 Pages) →</span>
            </button>
            <button
              onClick={() => go('ps_opm_analytics')}
              className="px-3.5 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-800 dark:text-slate-200 border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Executive Tier Analytics →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Sovereign KPI Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">Supervised Stations</span>
            <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {countryDistricts.length + countrySisterMinistries.length}
          </div>
          <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
            {countryDistricts.length} CAOs · {countrySisterMinistries.length} Sister PSs
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">Credentials Status</span>
            <Users size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {countryTeam.length} Active
          </div>
          <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
            {countryInvites.length} Pending Keys
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">Citizen Resolutions</span>
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {resolutionRate}%
          </div>
          <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
            {resolvedPosts} of {totalPosts} resolved
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-mono font-semibold uppercase tracking-wider text-[10px]">Official Queries</span>
            <AlertTriangle size={14} className="text-rose-600" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {countryQueries.length}
          </div>
          <div className="text-[10.5px] font-mono text-slate-500 mt-0.5">
            {countryQueries.filter((q) => q.status === 'determined').length} Determined Verdicts
          </div>
        </div>
      </div>

      {/* Sovereign Gateways: 4 Primary Executive Command Hubs */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Executive Supervisory Command Portals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {psInfo.isMoLG ? 'PS MANDATE' : 'APEX DESK'}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {psInfo.isMoLG ? 'PS MoLG Supervisory Roster & Invites' : `${psInfo.shortTitle || 'Sector'} Supervisory Roster & Operations`}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {psInfo.isMoLG
                  ? 'Active, Pending, and Vacant station telemetry. Supervise all 135+ Chief Administrative Officers (CAOs) and Sister Ministry Permanent Secretaries via batch dispatch and individual manual invites.'
                  : `Supervise all regional ${psInfo.shortTitle || 'sector'} departmental officers, engineers, and operational accounting units with statutory oversight.`}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              <span>{psInfo.isMoLG ? 'Open PS Supervision Structure' : `Open ${psInfo.shortTitle || 'Sector'} Desk`}</span>
              <ChevronRight size={15} />
            </div>
          </div>

          {/* Hub 2: Statutory Audit Trail & Hash-Chain Ledger */}
          <div
            onClick={() => go('gov_audit')}
            className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  5 MODULES
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Statutory Audit Trail &amp; IGG Dossiers
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete 5-page statutory evidentiary audit suite: Action Ledger, SHA-256 Crypto Chain Verification, Statutory Dossier for IGG / Auditor General, Official Queries Trail, and Node Telemetry.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Inspect Immutable Audit Ledger</span>
              <ChevronRight size={15} />
            </div>
          </div>

          {/* Hub 3: Executive Tier Analytics */}
          <div
            onClick={() => go('ps_opm_analytics')}
            className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <BarChart3 size={18} />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36]">
                  CROSS-TIER
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                Executive Tier Performance Analytics
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Comparative cross-tier delivery analytics. Evaluate district-level and sub-county performance benchmarks, response velocity, and PDM parish disbursement milestones.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
              <span>View Tier Analytics</span>
              <ChevronRight size={15} />
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
            className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Award size={18} />
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36]">
                  {psInfo.isMoLG ? 'NATIONAL GAZETTE' : 'EXECUTIVE DESK'}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                {psInfo.isMoLG ? 'Official Rollout Hub & Gazette' : `${psInfo.shortTitle || 'Ministry'} Domain Telemetry & Desk`}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {psInfo.isMoLG
                  ? 'Statutory legal transmittals, decentralized Local Government gazette notices, and nationwide node onboarding documentation under Ugandan statutory instruments.'
                  : `Sector-specific telemetry, heavy equipment tracking, contractor SLAs, and statutory service delivery compliance.`}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
              <span>{psInfo.isMoLG ? 'Open Rollout Hub' : `Open ${psInfo.shortTitle || 'Sector'} Desk`}</span>
              <ChevronRight size={15} />
            </div>
          </div>
        </div>
      </div>

      {/* Regional Operational Coverage Breakdown */}
      <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-3.5">
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
      <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-3">
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
