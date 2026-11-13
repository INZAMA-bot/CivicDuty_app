import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, RoleType, Invite, TeamMember, OfficialQuery } from '../types';
import { TERRITORY } from '../data/countries';
import { getRolloutNodesForCountry } from '../data/nationalRolloutNodes';
import { getCountryGovernanceSchema } from '../data/countryGovernance';
import { ExecutiveTierAnalytics } from './ExecutiveTierAnalytics';
import { OfficialQueryDispatchModal } from './OfficialQueryDispatchModal';
import { OfficialQueryDossierModal } from './OfficialQueryDossierModal';
import { ModalPortal } from './ModalPortal';
import {
  Building2,
  Users,
  Shield,
  Briefcase,
  Layers,
  PhoneCall,
  CheckCircle2,
  Copy,
  FileText,
  Search,
  UserPlus,
  XCircle,
  MessageCircle,
  Send,
  AlertTriangle,
  Award,
  Filter,
  X,
} from 'lucide-react';

interface DistrictSupervisionStructureProps {
  districtId: string;
  onPrefillManualForm?: (data: {
    name: string;
    title: string;
    role: RoleType;
    scope: string;
    isUtility: boolean;
    dept: string;
  }) => void;
}

interface ManualInviteModalState {
  open: boolean;
  stationId: string;
  stationName: string;
  defaultTitle: string;
  defaultRole: RoleType;
  isTechnicalDept?: boolean;
}

export const DistrictSupervisionStructure: React.FC<DistrictSupervisionStructureProps> = ({
  districtId,
}) => {
  const {
    user,
    toast,
    invites,
    teamMembers,
    addInvite,
    acceptInvite,
    revokeInvite,
    mintGovAccessCode,
    officialQueries,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'subcounties' | 'technical' | 'analytics' | 'sla'>('subcounties');
  const [subcountyStatusFilter, setSubcountyStatusFilter] = useState<'all' | 'operational' | 'pending' | 'vacant'>('all');
  const [techStatusFilter, setTechStatusFilter] = useState<'all' | 'operational' | 'pending' | 'vacant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Manual Invite Modal State (Strictly manual typing - NO prefilled dummy names)
  const [inviteModal, setInviteModal] = useState<ManualInviteModalState | null>(null);
  const [officerName, setOfficerName] = useState('');
  const [officerTitle, setOfficerTitle] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');
  const [officerRole, setOfficerRole] = useState<RoleType>('node_admin');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Official Query Modals
  const [dispatchModalTarget, setDispatchModalTarget] = useState<{
    unitName: string;
    unitOfficer: string;
    unitTitle: string;
    unitScope: string;
    slaScore?: string;
    backlog?: number;
    hours?: number;
  } | null>(null);
  const [selectedDossierQuery, setSelectedDossierQuery] = useState<OfficialQuery | null>(null);

  const country = (user?.country || 'UG') as CountryCode;
  const gov = useMemo(() => getCountryGovernanceSchema(country), [country]);
  const districts = TERRITORY[country] || [];
  const rolloutNodes = useMemo(() => getRolloutNodesForCountry(country), [country]);

  const currentDistrict =
    districts.find((d) => d.id.toLowerCase() === districtId.toLowerCase()) ||
    districts.find((d) => districtId.toLowerCase().includes(d.id.toLowerCase())) ||
    districts[0];

  const nationalDistrictData = rolloutNodes.find(
    (d) =>
      d.name.toLowerCase().includes((currentDistrict?.name || '').toLowerCase()) ||
      d.id.toLowerCase().includes(districtId.toLowerCase())
  );

  const subcounties = currentDistrict?.children || [];

  // District / Tier-3 Technical Departments Template
  const technicalDeptTemplates = useMemo(
    () => [
      {
        id: `${currentDistrict?.id || 'dist'}-eng`,
        roleTitle: `${gov.tier3Short} Engineer (Roads & Works)`,
        category: 'Public Works & Infrastructure',
        mandate: `Supervises roads, bridges, culverts, and public buildings across all ${gov.tier2Plural.toLowerCase()}.`,
        role: 'spokesperson' as RoleType,
        sla: '48h SLA',
        isUtility: false,
      },
      {
        id: `${currentDistrict?.id || 'dist'}-dho`,
        roleTitle: `${gov.tier3Short} Health Officer`,
        category: 'Health Services',
        mandate: `Supervises primary health centers, clinics, and public health grants across all ${gov.tier2Plural.toLowerCase()}.`,
        role: 'spokesperson' as RoleType,
        sla: '24h Emergency SLA',
        isUtility: false,
      },
      {
        id: `${currentDistrict?.id || 'dist'}-dwo`,
        roleTitle: `${gov.tier3Short} Water & Sanitation Officer`,
        category: 'Water & Sanitation',
        mandate: `Oversight of water coverage, borehole or pipe rehabilitations, and sanitation schemes across ${currentDistrict?.name || gov.tier3UnitLabel}.`,
        role: 'spokesperson' as RoleType,
        sla: '48h SLA',
        isUtility: true,
      },
      {
        id: `${currentDistrict?.id || 'dist'}-deo`,
        roleTitle: `${gov.tier3Short} Education Officer`,
        category: 'Education Services',
        mandate:
          country === 'UG'
            ? 'Supervision of UPE/USE schools, headteachers, and capitation grants.'
            : `Supervision of public primary/secondary schools, headteachers, and capitation grants in ${currentDistrict?.name || gov.tier3UnitLabel}.`,
        role: 'spokesperson' as RoleType,
        sla: '72h SLA',
        isUtility: false,
      },
      {
        id: `${currentDistrict?.id || 'dist'}-production`,
        roleTitle: `${gov.tier3Short} Production & Commerce Officer`,
        category: 'Agriculture & Production',
        mandate: `Agricultural extension lead, veterinary disease control, and ${gov.fiscalProgramName} enterprise hubs.`,
        role: 'spokesperson' as RoleType,
        sla: '48h SLA',
        isUtility: false,
      },
      {
        id: `${currentDistrict?.id || 'dist'}-dia`,
        roleTitle: `${gov.tier3Short} Internal Auditor`,
        category: 'Statutory Audit Oversight',
        mandate: `Independent statutory audit under ${gov.fiscalAct}; quarterly value-for-money inspection.`,
        role: 'read_only' as RoleType,
        sla: 'Continuous Audit',
        isUtility: false,
      },
    ],
    [currentDistrict?.id, currentDistrict?.name, country, gov]
  );

  // Map Sub-Counties to Telemetry Status (Operational, Pending, Vacant)
  const subcountyTelemetry = useMemo(() => {
    return subcounties.map((sub) => {
      const activeOfficer = teamMembers?.find(
        (m) =>
          m.active &&
          (m.scope === sub.id || m.scope?.toLowerCase() === sub.name.toLowerCase()) &&
          (!m.country || m.country === country)
      );

      const pendingInvite = invites?.find(
        (i) =>
          !i.used &&
          (i.scope === sub.id || i.duty_station?.toLowerCase().includes(sub.name.toLowerCase())) &&
          (!i.country || i.country === country)
      );

      const status: 'operational' | 'pending' | 'vacant' = activeOfficer
        ? 'operational'
        : pendingInvite
        ? 'pending'
        : 'vacant';

      return {
        subcounty: sub,
        activeOfficer,
        pendingInvite,
        status,
        parishCount: sub.children?.length || 0,
      };
    });
  }, [subcounties, teamMembers, invites, country]);

  // Map Technical Departments to Telemetry Status
  const technicalTelemetry = useMemo(() => {
    return technicalDeptTemplates.map((template) => {
      const activeOfficer = teamMembers?.find(
        (m) =>
          m.active &&
          (m.scope === template.id ||
            m.title.toLowerCase().includes(template.roleTitle.toLowerCase())) &&
          (!m.country || m.country === country)
      );

      const pendingInvite = invites?.find(
        (i) =>
          !i.used &&
          (i.scope === template.id ||
            i.title.toLowerCase().includes(template.roleTitle.toLowerCase())) &&
          (!i.country || i.country === country)
      );

      const status: 'operational' | 'pending' | 'vacant' = activeOfficer
        ? 'operational'
        : pendingInvite
        ? 'pending'
        : 'vacant';

      return {
        template,
        activeOfficer,
        pendingInvite,
        status,
      };
    });
  }, [technicalDeptTemplates, teamMembers, invites, country]);

  // Filtered Subcounties
  const filteredSubcounties = useMemo(() => {
    return subcountyTelemetry.filter((item) => {
      if (subcountyStatusFilter !== 'all' && item.status !== subcountyStatusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.subcounty.name.toLowerCase().includes(q) ||
        item.subcounty.id.toLowerCase().includes(q) ||
        (item.activeOfficer && item.activeOfficer.name.toLowerCase().includes(q)) ||
        (item.pendingInvite && item.pendingInvite.name.toLowerCase().includes(q))
      );
    });
  }, [subcountyTelemetry, subcountyStatusFilter, searchQuery]);

  // Filtered Technical Departments
  const filteredTechDepts = useMemo(() => {
    return technicalTelemetry.filter((item) => {
      if (techStatusFilter !== 'all' && item.status !== techStatusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.template.roleTitle.toLowerCase().includes(q) ||
        item.template.category.toLowerCase().includes(q) ||
        (item.activeOfficer && item.activeOfficer.name.toLowerCase().includes(q)) ||
        (item.pendingInvite && item.pendingInvite.name.toLowerCase().includes(q))
      );
    });
  }, [technicalTelemetry, techStatusFilter, searchQuery]);

  // Open Modal for Station-Specific Manual Invite
  const handleOpenInviteModal = (
    stationId: string,
    stationName: string,
    defaultTitle: string,
    defaultRole: RoleType = 'node_admin',
    isTechnicalDept: boolean = false
  ) => {
    setInviteModal({
      open: true,
      stationId,
      stationName,
      defaultTitle,
      defaultRole,
      isTechnicalDept,
    });
    // Strict manual typing - NO prefilled dummy names
    setOfficerName('');
    setOfficerTitle(defaultTitle);
    setOfficerPhone('');
    setOfficerRole(defaultRole);
  };

  // Submit Station-Specific Manual Invite
  const handleSendManualInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteModal) return;

    if (!officerName.trim()) {
      toast('Please manually enter the official appointee full name', 'red');
      return;
    }
    if (!officerTitle.trim()) {
      toast('Please specify the official designation / title', 'red');
      return;
    }

    const cleanDept = user?.dept || gov.superadminDeptId;
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const code = `${gov.codePrefix}-${cleanDept.toUpperCase()}-${randomHex}`;

    const newInvite: Invite = {
      code,
      name: officerName.trim(),
      title: officerTitle.trim(),
      role: officerRole,
      scope: inviteModal.stationId,
      dept: cleanDept,
      is_utility: officerTitle.toLowerCase().includes('water') || officerTitle.toLowerCase().includes('works'),
      used: false,
      country,
      duty_station: inviteModal.stationName,
      contact_phone: officerPhone.trim() || undefined,
      invited_by: user?.officer_name || user?.name || gov.tier3Label,
      invited_at: new Date().toISOString(),
      hierarchy_level: inviteModal.isTechnicalDept ? 'tier3_district_cao' : 'tier2_subcounty',
      escalation_rank: 2,
    };

    // 1. Dispatch statutory invite (station-specific)
    addInvite(newInvite);

    // 2. Mint access code on sovereign gateway
    mintGovAccessCode(code, {
      country,
      dept: cleanDept,
      scope: inviteModal.stationId,
      role: officerRole,
      is_utility: newInvite.is_utility,
      role_label: `${officerTitle.trim()} (${inviteModal.stationName})`,
      real_title_short: officerTitle.trim(),
      officer_name: officerName.trim(),
      hierarchy_level: inviteModal.isTechnicalDept ? 'tier3_district_cao' : 'tier2_subcounty',
      escalation_rank: 2,
    });

    // 3. Inviter only gets notification of active or pending
    toast(
      `Statutory invite sent immediately to ${officerName.trim()} for ${inviteModal.stationName}! Status: PENDING acceptance.`,
      'amber'
    );

    // Modal disappears once sent!
    setInviteModal(null);
  };

  const handleAcceptInvite = (inviteCode: string, officerNameStr: string, stationNameStr: string) => {
    const enlisted = acceptInvite(inviteCode);
    if (enlisted) {
      toast(`${officerNameStr} accepted statutory appointment for ${stationNameStr}! Enlisted into ACTIVE section.`, 'emerald');
    }
  };

  const handleRevokeInvite = (inviteCode: string, stationNameStr: string) => {
    revokeInvite(inviteCode);
    toast(`Invite revoked for ${stationNameStr}. Station returned to VACANT.`, 'amber');
  };

  const activeSubcountiesCount = subcountyTelemetry.filter((s) => s.status === 'operational').length;
  const pendingSubcountiesCount = subcountyTelemetry.filter((s) => s.status === 'pending').length;
  const vacantSubcountiesCount = subcountyTelemetry.filter((s) => s.status === 'vacant').length;

  const activeTechCount = technicalTelemetry.filter((t) => t.status === 'operational').length;
  const pendingTechCount = technicalTelemetry.filter((t) => t.status === 'pending').length;
  const vacantTechCount = technicalTelemetry.filter((t) => t.status === 'vacant').length;

  return (
    <div id="district-supervision-structure" className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700 shadow-2xs">
                Tier 3: {gov.tier3Short} &ldquo;{currentDistrict?.name || gov.tier3UnitLabel}&rdquo;
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Statutory Accounting Office
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Tier 3: {gov.tier3Short} &ldquo;{currentDistrict?.name}&rdquo; — Command &amp; Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Under {gov.localGovLawTier3}, the {gov.tier3Label} directly supervises {gov.tier2Plural} and Technical Department Heads across {currentDistrict?.name}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{gov.tier2Plural} Supervised</div>
            <div className="text-lg font-black text-teal-600 dark:text-teal-400">{subcounties.length} {gov.tier2Short} Stations</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('subcounties')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'subcounties'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Layers size={14} />
          <span>{gov.tier2Plural} ({subcounties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('technical')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'technical'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Briefcase size={14} />
          <span>{gov.tier3Short} Technical Heads ({technicalDeptTemplates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Award size={14} />
          <span>Executive Tier Analytics &amp; {gov.tier2Short} Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('sla')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'sla'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Shield size={14} />
          <span>{gov.tier3UnitLabel} SLA &amp; Audit Compliance</span>
        </button>
      </div>

      {/* TAB 1: SUB-COUNTIES (SAS) */}
      {activeTab === 'subcounties' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setSubcountyStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  subcountyStatusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({subcounties.length})
              </button>
              <button
                onClick={() => setSubcountyStatusFilter('operational')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  subcountyStatusFilter === 'operational'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Active ({activeSubcountiesCount})
              </button>
              <button
                onClick={() => setSubcountyStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  subcountyStatusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pending ({pendingSubcountiesCount})
              </button>
              <button
                onClick={() => setSubcountyStatusFilter('vacant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  subcountyStatusFilter === 'vacant'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Vacant ({vacantSubcountiesCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${gov.tier2Plural.toLowerCase()}, officers, or codes...`}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSubcounties.map(({ subcounty, activeOfficer, pendingInvite, status, parishCount }) => (
              <div
                key={subcounty.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  status === 'operational'
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : status === 'pending'
                    ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/40 border-dashed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {subcounty.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        status === 'operational'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {status === 'operational' ? 'Active Live' : status === 'pending' ? 'Invite Pending' : 'Vacant Desk'}
                    </span>
                  </div>

                  {/* Officer Info / Status Display */}
                  <div className="text-xs mb-2">
                    {status === 'operational' && activeOfficer ? (
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">{activeOfficer.name}</div>
                        <div className="text-teal-700 dark:text-teal-400 font-semibold">{activeOfficer.title}</div>
                        {activeOfficer.contact_phone && (
                          <div className="text-[11px] text-slate-500">{activeOfficer.contact_phone}</div>
                        )}
                      </div>
                    ) : status === 'pending' && pendingInvite ? (
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{pendingInvite.name}</div>
                        <div className="text-amber-700 dark:text-amber-400 font-medium">{pendingInvite.title}</div>
                        <div className="text-[10px] mono text-slate-500">
                          Code: <strong className="text-teal-700 dark:text-teal-300">{pendingInvite.code}</strong> (Awaiting Acceptance)
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-[11px]">
                        No Accounting Officer currently commissioned for this station.
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
                    <span>{parishCount} {gov.tier1Plural}</span>
                    <span>48h SLA Target</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                  {status === 'vacant' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenInviteModal(
                          subcounty.id,
                          subcounty.name,
                          `${gov.tier2Short}, ${subcounty.name}`,
                          'node_admin'
                        )
                      }
                      className="flex-1 py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <UserPlus size={13} />
                      <span>Invite Officer (Manual)</span>
                    </button>
                  )}

                  {status === 'pending' && pendingInvite && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAcceptInvite(pendingInvite.code, pendingInvite.name, subcounty.name)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                        title="Simulate or Confirm Official Acceptance"
                      >
                        <CheckCircle2 size={13} />
                        <span>Enlist into Active</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const memo = `STATUTORY ${gov.tier2UnitLabel.toUpperCase()} APPOINTMENT & TRANSMITTAL MEMO\nStation: ${subcounty.name}\nAppointee: ${pendingInvite.name}\nTitle: ${pendingInvite.title}\nSingle-Use Sovereign Key: ${pendingInvite.code}\nGateway: ${window.location.origin}${window.location.pathname}?gov_code=${pendingInvite.code}`;
                          navigator.clipboard.writeText(memo);
                          toast(`Copied dispatch memo for ${subcounty.name}!`, 'emerald');
                        }}
                        className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
                        title="Copy Transmittal Memo"
                      >
                        <FileText size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRevokeInvite(pendingInvite.code, subcounty.name)}
                        className="py-1.5 px-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold"
                        title="Revoke Invite"
                      >
                        <XCircle size={13} />
                      </button>
                    </>
                  )}

                  {status === 'operational' && activeOfficer && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setDispatchModalTarget({
                            unitName: subcounty.name,
                            unitOfficer: activeOfficer.name,
                            unitTitle: activeOfficer.title,
                            unitScope: subcounty.id,
                            slaScore: '94%',
                            backlog: 2,
                            hours: 32,
                          })
                        }
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1 transition-colors"
                      >
                        <AlertTriangle size={13} />
                        <span>Issue Official Query</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TECHNICAL DEPARTMENTS */}
      {activeTab === 'technical' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setTechStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  techStatusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({technicalDeptTemplates.length})
              </button>
              <button
                onClick={() => setTechStatusFilter('operational')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  techStatusFilter === 'operational'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Active ({activeTechCount})
              </button>
              <button
                onClick={() => setTechStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  techStatusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pending ({pendingTechCount})
              </button>
              <button
                onClick={() => setTechStatusFilter('vacant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  techStatusFilter === 'vacant'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Vacant ({vacantTechCount})
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct technical directorate heads answering to the {gov.tier3Label}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTechDepts.map(({ template, activeOfficer, pendingInvite, status }) => (
              <div
                key={template.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  status === 'operational'
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : status === 'pending'
                    ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/40 border-dashed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {template.roleTitle}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {template.sla}
                    </span>
                  </div>

                  <div className="text-xs mb-2">
                    {status === 'operational' && activeOfficer ? (
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">{activeOfficer.name}</div>
                        <div className="text-teal-700 dark:text-teal-400 font-semibold">{activeOfficer.title}</div>
                        {activeOfficer.contact_phone && (
                          <div className="text-[11px] text-slate-500">{activeOfficer.contact_phone}</div>
                        )}
                      </div>
                    ) : status === 'pending' && pendingInvite ? (
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{pendingInvite.name}</div>
                        <div className="text-amber-700 dark:text-amber-400 font-medium">{pendingInvite.title}</div>
                        <div className="text-[10px] mono text-slate-500">
                          Code: <strong className="text-teal-700 dark:text-teal-300">{pendingInvite.code}</strong> (Awaiting Acceptance)
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-[11px]">
                        Department Lead position currently unfilled.
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3">{template.mandate}</p>
                </div>

                <div className="flex items-center gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                  {status === 'vacant' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenInviteModal(
                          template.id,
                          template.roleTitle,
                          template.roleTitle,
                          template.role,
                          true
                        )
                      }
                      className="flex-1 py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <UserPlus size={13} />
                      <span>Invite Officer (Manual)</span>
                    </button>
                  )}

                  {status === 'pending' && pendingInvite && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAcceptInvite(pendingInvite.code, pendingInvite.name, template.roleTitle)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                      >
                        <CheckCircle2 size={13} />
                        <span>Enlist into Active</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRevokeInvite(pendingInvite.code, template.roleTitle)}
                        className="py-1.5 px-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold"
                        title="Revoke Invite"
                      >
                        <XCircle size={13} />
                      </button>
                    </>
                  )}

                  {status === 'operational' && activeOfficer && (
                    <button
                      type="button"
                      onClick={() =>
                        setDispatchModalTarget({
                          unitName: template.roleTitle,
                          unitOfficer: activeOfficer.name,
                          unitTitle: activeOfficer.title,
                          unitScope: template.id,
                          slaScore: '96%',
                          backlog: 1,
                          hours: 24,
                        })
                      }
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900 flex items-center justify-center gap-1 transition-colors"
                    >
                      <AlertTriangle size={13} />
                      <span>Issue Official Query</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTIVE TIER ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="pt-2">
          <ExecutiveTierAnalytics
            initialCountry={country}
            initialTier={3}
            initialScope={currentDistrict?.id}
            compact={true}
          />
        </div>
      )}

      {/* TAB 4: DISTRICT SLA & AUDIT */}
      {activeTab === 'sla' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-teal-100 dark:border-teal-900/40 bg-teal-50/50 dark:bg-teal-950/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {gov.tier3UnitLabel} SLA Resolution
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {nationalDistrictData?.sla || '92.4%'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Average {gov.tier2UnitLabel.toLowerCase()} ticket resolution time: {nationalDistrictData?.avgResponseHours || 36} hours.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {gov.fiscalProgramName} &amp; {gov.tier1UnitLabel} Coverage
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {(country === 'UG' ? nationalDistrictData?.pdmParishes : undefined) || subcounties.reduce((acc, s) => acc + (s.children?.length || 0), 0)} {gov.tier1Plural}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {gov.fiscalGrantName} compliance rating:{' '}
              <span className="font-bold text-emerald-600">
                {(country === 'UG' && nationalDistrictData?.ddegCompliance) || `Compliant (${gov.fiscalAct})`}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Supervisory Jurisdiction
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              {gov.tier3Label}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statutory jurisdiction strictly limited to {currentDistrict?.name} and its subordinate {gov.tier2Plural.toLowerCase()}.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STATION-SPECIFIC MANUAL INVITE MODAL (NO PREFILLS — STRICTLY MANUAL)       */}
      {/* ========================================================================= */}
      {inviteModal && inviteModal.open && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs -z-10"
            onClick={() => setInviteModal(null)}
          />
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 my-auto relative z-10 shrink-0">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Issue Statutory Invite (Manual Entry)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Station: {inviteModal.stationName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInviteModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendManualInvite} className="space-y-3.5">
              <div className="p-2.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 text-xs text-teal-800 dark:text-teal-300">
                <p>
                  <strong>Statutory Notice:</strong> Station-specific invites happen once and are dispatched immediately. The desk disappears from Vacant and enters Pending. Once accepted, the officer is enlisted in the Active section.
                </p>
              </div>

              {/* Station (Locked) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Assigned Station (Locked)
                </label>
                <input
                  type="text"
                  disabled
                  value={`${inviteModal.stationName} (${inviteModal.isTechnicalDept ? `${gov.tier3Short} Technical Directorate` : `${gov.tier2UnitLabel} Station`})`}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                />
              </div>

              {/* Appointee Full Name (MANUAL INPUT - NO PREFILL) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Appointee Officer Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder={`e.g. ${country === 'UG' ? 'John Mukasa' : `${gov.tier2Short} Lead`} (Type Officer's Real Substantive Name)`}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Manual input: enter the officer's substantive legal name.
                </span>
              </div>

              {/* 1-Click Direct Report Presets for Tier 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] mono text-slate-500 uppercase tracking-wider font-bold">
                    1-Click Direct Report Presets ({gov.tier3Short} {currentDistrict?.name})
                  </span>
                  <span className="text-[9px] mono text-teal-600 dark:text-teal-400 font-bold">Station Specific</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'sas', label: gov.tier2Short, title: `${gov.tier2Short}, ${inviteModal.stationName}`, role: 'node_admin' as RoleType },
                    { id: 'tc', label: `${gov.tier2UnitLabel} Clerk`, title: `${gov.tier2UnitLabel} Clerk, ${inviteModal.stationName}`, role: 'node_admin' as RoleType },
                    { id: 'eng', label: `${gov.tier3Short} Engineer (Roads & Works)`, title: `${gov.tier3Short} Engineer (Roads & Works)`, role: 'spokesperson' as RoleType },
                    { id: 'dho', label: `${gov.tier3Short} Health Officer`, title: `${gov.tier3Short} Health Officer`, role: 'spokesperson' as RoleType },
                    { id: 'dwo', label: `${gov.tier3Short} Water Officer`, title: `${gov.tier3Short} Water Officer`, role: 'spokesperson' as RoleType },
                    { id: 'deo', label: `${gov.tier3Short} Education Officer`, title: `${gov.tier3Short} Education Officer`, role: 'spokesperson' as RoleType },
                    { id: 'production', label: `${gov.tier3Short} Production Officer`, title: `${gov.tier3Short} Production & Commerce Officer`, role: 'spokesperson' as RoleType },
                    { id: 'dia', label: `${gov.tier3Short} Internal Auditor`, title: `${gov.tier3Short} Internal Auditor`, role: 'read_only' as RoleType },
                    { id: 'others', label: '+ Others (specify)', title: '', role: 'spokesperson' as RoleType },
                  ].map((preset) => {
                    const isSelected = preset.id === 'others'
                      ? officerTitle !== '' && ![gov.tier2Short, `${gov.tier2UnitLabel} Clerk`, `${gov.tier3Short} Engineer`, `${gov.tier3Short} Health Officer`, `${gov.tier3Short} Water Officer`, `${gov.tier3Short} Education Officer`, `${gov.tier3Short} Production`, `${gov.tier3Short} Internal Auditor`].some(x => officerTitle.includes(x))
                      : officerTitle === preset.title;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          if (preset.id === 'others') {
                            setOfficerTitle('');
                            setOfficerRole('spokesperson');
                            setTimeout(() => {
                              titleInputRef.current?.focus();
                            }, 50);
                            toast('Specify custom official designation below', 'teal');
                          } else {
                            setOfficerTitle(preset.title);
                            setOfficerRole(preset.role);
                            toast(`Selected post: ${preset.title}`, 'emerald');
                          }
                        }}
                        className={`p-2 rounded-xl text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 ring-1 ring-teal-500 text-teal-900 dark:text-teal-200 border'
                            : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-[11px] font-bold leading-tight">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Designation / Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="dist-modal-title-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Official Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
                    {gov.tier3UnitLabel} Statutory Desks
                  </span>
                </div>
                <input
                  ref={titleInputRef}
                  id="dist-modal-title-input"
                  type="text"
                  required
                  value={officerTitle}
                  onChange={(e) => setOfficerTitle(e.target.value)}
                  placeholder={`e.g. ${gov.tier2Short} / ${gov.tier3Short} Engineer`}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Real-time custom title input active. Click any preset or enter custom title directly.
                </span>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Official Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  placeholder={`e.g. ${gov.samplePhone}`}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setInviteModal(null)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Send size={13} />
                  <span>Send Statutory Invite Immediately</span>
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* Official Query Dispatch Modal */}
      {dispatchModalTarget && (
        <OfficialQueryDispatchModal
          initialTarget={dispatchModalTarget}
          onClose={() => setDispatchModalTarget(null)}
          onSuccess={(query) => {
            setDispatchModalTarget(null);
            setSelectedDossierQuery(query);
          }}
        />
      )}

      {/* Official Query Dossier Modal */}
      {selectedDossierQuery && (
        <OfficialQueryDossierModal
          query={selectedDossierQuery}
          onClose={() => setSelectedDossierQuery(null)}
        />
      )}
    </div>
  );
};
