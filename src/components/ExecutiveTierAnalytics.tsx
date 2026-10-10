import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, RoleType, OfficialQuery } from '../types';
import { TERRITORY, COUNTRIES } from '../data/countries';
import { TIERS, getNationalRolloutArrangements, tiersFor } from '../data/tiers';
import { getRolloutNodesForCountry, getSisterMinistriesForCountry, RolloutDistrictNode } from '../data/nationalRolloutNodes';
import { OfficialQueryDispatchModal } from './OfficialQueryDispatchModal';
import { OfficialQueryDossierModal } from './OfficialQueryDossierModal';
import { UnitAuditTrailModal } from './UnitAuditTrailModal';
import {
  TrendingUp,
  BarChart3,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Users,
  Building2,
  MapPin,
  FileText,
  Send,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  Search,
  ChevronRight,
  Layers,
  Activity,
  X,
  Scale,
  Lock,
  Copy
} from 'lucide-react';

interface ExecutiveTierAnalyticsProps {
  initialCountry?: CountryCode;
  initialTier?: number;
  initialScope?: string;
  compact?: boolean;
  onClose?: () => void;
}

export const ExecutiveTierAnalytics: React.FC<ExecutiveTierAnalyticsProps> = ({
  initialCountry,
  initialTier,
  initialScope,
  compact = false,
  onClose,
}) => {
  const { user, toast, logAudit, officialQueries } = useApp();

  const activeCountry: CountryCode = initialCountry || user?.country || 'UG';
  const countryObj = COUNTRIES[activeCountry] || { name: activeCountry, flag: activeCountry };
  const rolloutArrangement = getNationalRolloutArrangements(activeCountry);
  const countryTiers = tiersFor(activeCountry);

  // Compute effective tier level
  const userRank = user?.escalation_rank || 1;
  const effectiveTier = initialTier !== undefined ? initialTier : (userRank === 5 ? 5 : userRank === 3 ? 3 : userRank === 2 ? 2 : 1);

  // Jurisdiction selection
  const districts = TERRITORY[activeCountry] || [];
  const nationalNodes = useMemo(() => getRolloutNodesForCountry(activeCountry), [activeCountry]);
  const sisterMinistries = useMemo(() => getSisterMinistriesForCountry(activeCountry), [activeCountry]);

  // Determine current district / subcounty based on user or selection
  const userDistrict = districts.find(d => 
    d.id.toLowerCase() === (user?.scope || '').toLowerCase() ||
    (user?.scope || '').toLowerCase().includes(d.id.toLowerCase())
  ) || districts[0];

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(
    initialScope && districts.some(d => d.id === initialScope) 
      ? initialScope 
      : userDistrict?.id || districts[0]?.id || ''
  );

  const currentDistrictObj = districts.find(d => d.id === selectedDistrictId) || districts[0];
  const subcounties = currentDistrictObj?.children || [];

  const [selectedSubcountyId, setSelectedSubcountyId] = useState<string>(
    subcounties[0]?.id || ''
  );

  const currentSubcountyObj = subcounties.find(s => s.id === selectedSubcountyId) || subcounties[0];
  const parishes = currentSubcountyObj?.children || [];

  // Filter & Search
  const [activeTab, setActiveTab] = useState<'child_units' | 'sister_ps' | 'performance_matrix' | 'queries'>('child_units');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'lagging' | 'exemplar'>('all');

  // Interactive Query Dispatch Modal & Dossier Modal Targets
  const [dispatchModalTarget, setDispatchModalTarget] = useState<{
    unitName: string;
    unitOfficer: string;
    unitTitle?: string;
    unitScope?: string;
    slaScore?: string;
    backlog?: number;
    hours?: number;
  } | null>(null);
  const [selectedDossierQuery, setSelectedDossierQuery] = useState<OfficialQuery | null>(null);
  const [selectedUnitAudit, setSelectedUnitAudit] = useState<{
    unitName: string;
    unitOfficer?: string;
    unitScope?: string;
  } | null>(null);
  const [queryFilterStatus, setQueryFilterStatus] = useState<'all' | 'pending' | 'review' | 'resolved' | 'escalated'>('all');

  // Country-specific official queries
  const countryQueries = useMemo(() => {
    return officialQueries.filter((q) => (q.country || 'UG') === activeCountry);
  }, [officialQueries, activeCountry]);

  const filteredQueries = useMemo(() => {
    return countryQueries.filter((q) => {
      if (queryFilterStatus === 'pending' && q.status !== 'pending_response') return false;
      if (queryFilterStatus === 'review' && q.status !== 'under_review') return false;
      if (queryFilterStatus === 'resolved' && q.status !== 'resolved_exonerated') return false;
      if (queryFilterStatus === 'escalated' && !['escalated_igg', 'remedial_directive'].includes(q.status)) return false;

      if (filterQuery.trim()) {
        const term = filterQuery.toLowerCase();
        return (
          q.queryRef.toLowerCase().includes(term) ||
          q.subject.toLowerCase().includes(term) ||
          q.targetOfficer.toLowerCase().includes(term) ||
          q.targetUnit.toLowerCase().includes(term) ||
          q.grounds.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [countryQueries, queryFilterStatus, filterQuery]);

  // Auto-generate child performance telemetry
  const childTelemetryData = useMemo(() => {
    if (effectiveTier >= 5) {
      // PS MoLG Level: Supervises All Districts
      return nationalNodes.map((d, idx) => ({
        id: d.id,
        name: d.name,
        officer: d.cao,
        officerTitle: rolloutArrangement.targets.l2l3Title.split('/')[0] || 'District CAO',
        slaRate: parseFloat(d.sla) || (88 + (idx % 7) * 1.5),
        avgHours: d.avgResponseHours || (18 + idx * 3),
        csat: d.csatScore || 4.7,
        backlog: d.casesLogged - d.casesResolved || (4 + idx * 2),
        totalCases: d.casesLogged || 400 + idx * 100,
        resolvedCases: d.casesResolved || 380 + idx * 95,
        subUnitCount: d.subCounties?.length || 4,
        status: (d.casesLogged - d.casesResolved) > 15 ? 'Escalated Watch' : (parseFloat(d.sla) > 92 ? 'Top Performer' : 'Stable Delivery'),
        type: 'District / Local Gov'
      }));
    } else if (effectiveTier === 3) {
      // CAO Level: Supervises Sub-Counties / Divisions
      return subcounties.map((s, idx) => {
        const slaVal = 94.5 - (idx * 2.8) + (idx % 2 === 0 ? 1.2 : -1.5);
        const hours = 14.5 + idx * 4.2;
        const backlog = 2 + (idx * 3);
        return {
          id: s.id,
          name: s.name,
          officer: `Senior Assistant Secretary (${s.name})`,
          officerTitle: 'Sub-County Accounting Officer / SAS',
          slaRate: parseFloat(slaVal.toFixed(1)),
          avgHours: parseFloat(hours.toFixed(1)),
          csat: parseFloat((4.9 - idx * 0.2).toFixed(1)),
          backlog,
          totalCases: 95 + idx * 25,
          resolvedCases: (95 + idx * 25) - backlog,
          subUnitCount: s.children?.length || 4,
          status: backlog > 8 ? 'Requires Query' : slaVal > 90 ? 'Exemplar LLG' : 'Standard Compliance',
          type: 'Sub-County / Town Council'
        };
      });
    } else {
      // Subcounty Chief Level (Tier 2): Supervises Parishes
      return parishes.map((p, idx) => {
        const slaVal = 96.0 - (idx * 3.5);
        const hours = 10.0 + idx * 5.0;
        const backlog = Math.max(0, idx * 2);
        return {
          id: p.id,
          name: p.name,
          officer: `Parish Chief (${p.name})`,
          officerTitle: rolloutArrangement.lowestOfficerTitle,
          slaRate: parseFloat(slaVal.toFixed(1)),
          avgHours: parseFloat(hours.toFixed(1)),
          csat: parseFloat((4.9 - idx * 0.25).toFixed(1)),
          backlog,
          totalCases: 40 + idx * 12,
          resolvedCases: (40 + idx * 12) - backlog,
          subUnitCount: 5, // Villages
          status: backlog > 4 ? 'Needs Field Inspection' : slaVal > 92 ? 'Pillar Model' : 'Active Duty',
          type: 'Parish / Ward Node'
        };
      });
    }
  }, [effectiveTier, nationalNodes, subcounties, parishes, rolloutArrangement]);

  const filteredTelemetry = childTelemetryData.filter(item => {
    const matchesSearch = !filterQuery.trim() || 
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.officer.toLowerCase().includes(filterQuery.toLowerCase());
    
    if (selectedMetric === 'lagging') return matchesSearch && (item.backlog > 6 || item.slaRate < 88);
    if (selectedMetric === 'exemplar') return matchesSearch && item.slaRate >= 92;
    return matchesSearch;
  });

  // Calculate aggregated jurisdiction health
  const totalCases = childTelemetryData.reduce((acc, c) => acc + c.totalCases, 0);
  const totalResolved = childTelemetryData.reduce((acc, c) => acc + c.resolvedCases, 0);
  const totalBacklog = childTelemetryData.reduce((acc, c) => acc + c.backlog, 0);
  const overallSla = totalCases > 0 ? ((totalResolved / totalCases) * 100).toFixed(1) : '94.2';
  const avgTurnaround = childTelemetryData.length > 0 
    ? (childTelemetryData.reduce((acc, c) => acc + c.avgHours, 0) / childTelemetryData.length).toFixed(1) 
    : '21.4';

  const handleExportBrief = () => {
    const brief = `STATUTORY EXECUTIVE PERFORMANCE BRIEF
Jurisdiction: ${effectiveTier >= 5 ? countryObj.name + ' National Local Government Cascade' : effectiveTier === 3 ? currentDistrictObj?.name + ' District Local Government' : currentSubcountyObj?.name + ' Sub-County / Division'}
Country: ${countryObj.name} (${activeCountry})
Supervisory Tier: Tier ${effectiveTier} (${effectiveTier >= 5 ? 'Permanent Secretary / Superadmin' : effectiveTier === 3 ? 'Chief Administrative Officer (CAO)' : 'Sub-County Chief / SAS'})
Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}

--- EXECUTIVE SUMMARY TELEMETRY ---
• Overall Jurisdiction SLA Resolution: ${overallSla}%
• Average Civic Turnaround Time: ${avgTurnaround} hours
• Total Grievances Processed: ${totalCases}
• Verified Resolved Dispatches: ${totalResolved}
• Active Escalation Backlog: ${totalBacklog} cases

--- SUBORDINATE UNITS PERFORMANCE RANKING ---
${childTelemetryData.map((u, i) => `${i + 1}. ${u.name} — SLA: ${u.slaRate}% | Backlog: ${u.backlog} | Turnaround: ${u.avgHours}h | Status: ${u.status}`).join('\n')}

Authority: Local Governments Act & Public Finance Management Mandate
Civic Duty Sovereign Digital Infrastructure`;

    navigator.clipboard.writeText(brief);
    toast('Statutory Performance Brief copied to clipboard. Ready for Council review.', 'emerald');
  };

  return (
    <div className={`space-y-4 text-slate-800 dark:text-slate-100 ${compact ? 'p-1' : 'p-4 max-w-6xl mx-auto'}`}>
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-300 dark:border-emerald-800">
                <BarChart3 size={18} />
              </span>
              <span className="text-[11px] mono font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Tier {effectiveTier} Executive Oversight Analytics
              </span>
              <span className="text-[10px] mono px-2 py-0.5 rounded-md bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-700 dark:text-slate-300 font-bold border border-[#e3e6ea] dark:border-[#262b36]">
                {activeCountry} · {countryObj.name}
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {effectiveTier >= 5 && `${rolloutArrangement.superadminMinistry} · Cabinet Command`}
              {effectiveTier === 3 && `${currentDistrictObj?.name} Executive District Scorecard`}
              {effectiveTier === 2 && `${currentSubcountyObj?.name} Frontline Parishes Scorecard`}
              {effectiveTier === 1 && `Grassroots Ward & Community Scorecard`}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {effectiveTier >= 5 && `Direct supervisory telemetry over all ${nationalNodes.length} Sub-Sovereign Accounting Officers (CAOs) and Sister Line Ministries.`}
              {effectiveTier === 3 && `Supervisory command over all ${subcounties.length} constituent Sub-Counties, Town Councils, and municipal divisions.`}
              {effectiveTier <= 2 && `Supervisory telemetry tracking frontline Parish Chiefs, village mobilization leads, and PDM enterprise verification.`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportBrief}
              className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer shadow-2xs"
            >
              <Download size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Export Council Brief</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Scope Selectors (Strict Jurisdiction Lock for Tier 3 & Tier 2) */}
        {effectiveTier >= 3 && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase mono">
              Supervised Jurisdiction:
            </span>

            {/* District Selector (Locked to own district for Tier 3 CAO; selectable only for Tier 4 National Superadmin) */}
            <div className="flex items-center gap-1.5">
              <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              {effectiveTier >= 4 ? (
                <select
                  value={selectedDistrictId}
                  onChange={(e) => {
                    setSelectedDistrictId(e.target.value);
                    const newD = districts.find(d => d.id === e.target.value);
                    setSelectedSubcountyId(newD?.children?.[0]?.id || '');
                  }}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                >
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">
                  {activeDistrict?.name || user?.scope_label || user?.scope} · Locked
                </span>
              )}
            </div>

            {/* Subcounty Selector (Within the CAO's own locked district) */}
            {subcounties.length > 0 && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-teal-600 dark:text-teal-400" />
                <select
                  value={selectedSubcountyId}
                  onChange={(e) => setSelectedSubcountyId(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                >
                  {subcounties.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] mono font-bold text-slate-500 dark:text-slate-400 uppercase">Supervised Nodes</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {childTelemetryData.length}
          </div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
            <CheckCircle2 size={11} /> 100% Active Gateway Desks
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] mono font-bold text-slate-500 dark:text-slate-400 uppercase">Statutory SLA Compliance</div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
            {overallSla}%
          </div>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
            Target: 90% Statutory Standard
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] mono font-bold text-slate-500 dark:text-slate-400 uppercase">Avg Turnaround</div>
          <div className="text-2xl font-black text-teal-700 dark:text-teal-400 mt-1">
            {avgTurnaround}h
          </div>
          <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-0.5">
            Turnaround Speed vs 48h Limit
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-[10px] mono font-bold text-slate-500 dark:text-slate-400 uppercase">Active Backlog</div>
          <div className={`text-2xl font-black mt-1 ${totalBacklog > 15 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
            {totalBacklog}
          </div>
          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
            {totalBacklog > 10 ? 'Requires Administrative Follow-up' : 'Optimal Capacity'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Executive View */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('child_units')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'child_units'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers size={13} />
            <span>
              {effectiveTier >= 5 && `All District & Municipal Accounting Officers (${childTelemetryData.length})`}
              {effectiveTier === 3 && `Constituent Sub-Counties & Divisions (${childTelemetryData.length})`}
              {effectiveTier <= 2 && `Constituent Parishes & Wards (${childTelemetryData.length})`}
            </span>
          </button>

          {effectiveTier >= 5 && (
            <button
              onClick={() => setActiveTab('sister_ps')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'sister_ps'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Users size={13} />
              <span>Inter-Ministerial Sister PS Council ({sisterMinistries.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('queries')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'queries'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShieldAlert size={13} />
            <span>Statutory Queries ({countryQueries.length})</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setDispatchModalTarget({
                unitName: currentDistrictObj?.name || 'Local Government Station',
                unitOfficer: 'Substantive Desk Officer',
                slaScore: '75.0%',
                backlog: 6,
                hours: 36,
              })
            }
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <ShieldAlert size={13} />
            <span>Dispatch Query</span>
          </button>

          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subordinate jurisdiction..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1">
            {(['all', 'exemplar', 'lagging'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMetric(m)}
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg capitalize transition-all ${
                  selectedMetric === m
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: CHILD JURISDICTIONS SUPERVISORY MATRIX */}
      {activeTab === 'child_units' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredTelemetry.map((unit) => (
              <div
                key={unit.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {unit.type}
                        </span>
                        <span className="text-[10px] mono text-slate-400">{unit.id}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-1 leading-snug">
                        {unit.name}
                      </h4>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                        {unit.officer}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] mono font-bold px-2 py-1 rounded-xl shrink-0 ${
                        unit.status.includes('Top') || unit.status.includes('Exemplar') || unit.status.includes('Model')
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : unit.status.includes('Query') || unit.status.includes('Escalated') || unit.status.includes('Inspection')
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {unit.status}
                    </span>
                  </div>

                  {/* Telemetry Metrics Grid */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 block">SLA Rate</span>
                      <strong className={`text-xs font-black ${unit.slaRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {unit.slaRate}%
                      </strong>
                    </div>

                    <div>
                      <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 block">Speed</span>
                      <strong className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {unit.avgHours}h
                      </strong>
                    </div>

                    <div>
                      <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 block">Trust (CSAT)</span>
                      <strong className="text-xs font-black text-teal-700 dark:text-teal-400">
                        {unit.csat}/5
                      </strong>
                    </div>

                    <div>
                      <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 block">Backlog</span>
                      <strong className={`text-xs font-black ${unit.backlog > 5 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {unit.backlog} cases
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Supervisory Intervention Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    Child Sub-Units: <strong className="text-slate-800 dark:text-slate-200">{unit.subUnitCount} Desks</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setDispatchModalTarget({
                          unitName: unit.name,
                          unitOfficer: unit.officer,
                          unitTitle: unit.officerTitle,
                          unitScope: unit.id,
                          slaScore: `${unit.slaRate}%`,
                          backlog: unit.backlog,
                          hours: unit.avgHours,
                        })
                      }
                      className="py-1 px-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-black transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <ShieldAlert size={12} />
                      <span>Issue Official Query</span>
                    </button>

                    <button
                      onClick={() =>
                        setSelectedUnitAudit({
                          unitName: unit.name,
                          unitOfficer: unit.officer,
                          unitScope: unit.id,
                        })
                      }
                      className="py-1 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold transition-all border border-slate-200 dark:border-slate-700"
                    >
                      Audit Trail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTER-MINISTERIAL SISTER PS COUNCIL (NATIONAL TIER 5 ONLY) */}
      {activeTab === 'sister_ps' && effectiveTier >= 5 && (
        <div className="space-y-3">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-950 dark:text-emerald-100 font-semibold leading-relaxed">
            <strong className="text-sm font-black text-emerald-950 dark:text-emerald-200 block mb-1">
              Horizontal Cabinet Harmonization (Sister Line Ministries)
            </strong>
            As Permanent Secretary / National Superadmin, you monitor and harmonize statutory delivery performance across sister cabinet portfolios to ensure local government dispatches are backed by sectoral line grants and emergency infrastructure.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {sisterMinistries.map((sm) => (
              <div
                key={sm.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {sm.sector}
                      </span>
                      <span className="text-[10px] mono font-bold text-emerald-700 dark:text-emerald-400">{sm.code}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      {sm.title}
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                      {sm.permSecretary}
                    </p>
                  </div>

                  <span className="text-xs font-black px-2 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    SLA: {sm.slaScore}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {sm.mandate}
                </p>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 block">Cabinet Index</span>
                    <strong className="text-xs font-black text-emerald-700 dark:text-emerald-400">{sm.cabinetDeliveryIndex}%</strong>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 block">Speed (Turnaround)</span>
                    <strong className="text-xs font-black text-slate-800 dark:text-slate-200">{sm.macroSpeedHours}h</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STATUTORY OFFICIAL QUERIES REGISTRY (FULL USER JOURNEY) */}
      {activeTab === 'queries' && (
        <div className="space-y-4">
          {/* Query Suite Header Banner */}
          <div className="p-4 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-sm">
                <Scale size={22} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Supervisory Administrative Inquiries &amp; Sanctions Registry
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] font-medium">
                  Enforcing administrative turnaround, PDM compliance, and grievance resolution under Civil Service Standing Orders.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setDispatchModalTarget({
                  unitName: currentDistrictObj?.name || 'Local Government Station',
                  unitOfficer: 'Substantive Desk Officer',
                  slaScore: '75.0%',
                  backlog: 6,
                  hours: 36,
                })
              }
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <ShieldAlert size={14} />
              <span>Issue New Statutory Query</span>
            </button>
          </div>

          {/* KPI Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-500 block uppercase">Total Dispatched</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">{countryQueries.length}</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-amber-600 block uppercase">Pending Defense</span>
              <span className="text-lg font-black text-amber-600">
                {countryQueries.filter((q) => q.status === 'pending_response').length}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-blue-600 block uppercase">Under Review</span>
              <span className="text-lg font-black text-blue-600">
                {countryQueries.filter((q) => q.status === 'under_review').length}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-emerald-600 block uppercase">Resolved / Exonerated</span>
              <span className="text-lg font-black text-emerald-600">
                {countryQueries.filter((q) => q.status === 'resolved_exonerated').length}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-rose-600 block uppercase">Sanctions / IGG</span>
              <span className="text-lg font-black text-rose-600">
                {countryQueries.filter((q) => ['escalated_igg', 'remedial_directive'].includes(q.status)).length}
              </span>
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Queries' },
              { id: 'pending', label: 'Pending Officer Response' },
              { id: 'review', label: 'Under Supervisory Review' },
              { id: 'resolved', label: 'Resolved & Closed' },
              { id: 'escalated', label: 'Sanctioned / IGG' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setQueryFilterStatus(f.id as any)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all whitespace-nowrap ${
                  queryFilterStatus === f.id
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Query Cards Grid */}
          {filteredQueries.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto" />
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
                No Queries Recorded for Active Filter
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All subordinate accounting desks are operating within statutory SLA parameters or have satisfied supervisory inquiries.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredQueries.map((q) => (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-4.5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-400 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mono text-[10px] font-black text-rose-700 dark:text-rose-400">
                            {q.queryRef}
                          </span>
                          <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {q.category.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1 leading-snug">
                          {q.subject}
                        </h4>
                      </div>

                      <span
                        className={`text-[9.5px] font-black px-2 py-1 rounded-xl border flex-shrink-0 ${
                          q.status === 'resolved_exonerated'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                            : q.status === 'under_review'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300'
                            : q.status === 'pending_response'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300'
                        }`}
                      >
                        {q.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Recipient Station:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{q.targetUnit}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Target Officer:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{q.targetOfficer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Response Window:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <Clock size={11} /> {q.deadlineHours}h SLA
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2">
                      {q.grounds}
                    </p>
                  </div>

                  {/* Card Action Triggers */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedDossierQuery(q)}
                      className="py-1 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <FileText size={12} />
                      <span>View Dossier &amp; Actions</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`Official Query Ref: ${q.queryRef} | Target: ${q.targetOfficer} (${q.targetUnit}) | Subject: ${q.subject}`);
                          toast(`Copied query ${q.queryRef} reference to clipboard`, 'teal');
                        }}
                        title="Copy Summary"
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs"
                      >
                        <Copy size={12} />
                      </button>

                      <button
                        onClick={() =>
                          setSelectedUnitAudit({
                            unitName: q.targetUnit,
                            unitOfficer: q.targetOfficer,
                            unitScope: q.queryRef,
                          })
                        }
                        title="View Audit Trail"
                        className="py-1 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700"
                      >
                        Audit Proof
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DISPATCH STATUTORY QUERY MODAL */}
      {dispatchModalTarget && (
        <OfficialQueryDispatchModal
          initialTarget={dispatchModalTarget}
          onClose={() => setDispatchModalTarget(null)}
          onSuccess={(newQ) => setSelectedDossierQuery(newQ)}
        />
      )}

      {/* FULL QUERY DOSSIER & LIFECYCLE ACTIONS MODAL */}
      {selectedDossierQuery && (
        <OfficialQueryDossierModal
          query={selectedDossierQuery}
          onClose={() => setSelectedDossierQuery(null)}
          onOpenAuditTrail={(ref) => {
            setSelectedDossierQuery(null);
            setSelectedUnitAudit({
              unitName: selectedDossierQuery.targetUnit,
              unitOfficer: selectedDossierQuery.targetOfficer,
              unitScope: ref,
            });
          }}
        />
      )}

      {/* UNIT AUDIT TRAIL MODAL */}
      {selectedUnitAudit && (
        <UnitAuditTrailModal
          unitName={selectedUnitAudit.unitName}
          unitOfficer={selectedUnitAudit.unitOfficer}
          unitScope={selectedUnitAudit.unitScope}
          onClose={() => setSelectedUnitAudit(null)}
        />
      )}
    </div>
  );
};
