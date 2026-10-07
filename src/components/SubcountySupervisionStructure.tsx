import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, RoleType, Invite, TeamMember } from '../types';
import { TERRITORY, COUNTRIES } from '../data/countries';
import { ExecutiveTierAnalytics } from './ExecutiveTierAnalytics';
import {
  Building2,
  Users,
  Shield,
  Layers,
  PhoneCall,
  CheckCircle2,
  Copy,
  FileText,
  BarChart3,
  Search,
  MapPin,
  ArrowUpRight,
  Table,
  LayoutGrid,
  AlertCircle,
  Phone,
  Clock,
  Key,
  UserPlus,
  UserCheck,
  XCircle,
  RotateCcw,
  Send,
  X,
  UserX,
  ExternalLink,
} from 'lucide-react';

interface SubcountySupervisionStructureProps {
  districtId: string;
  subcountyId: string;
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
  isFieldDesk?: boolean;
}

export const SubcountySupervisionStructure: React.FC<SubcountySupervisionStructureProps> = ({
  districtId,
  subcountyId,
  onPrefillManualForm,
}) => {
  const {
    user,
    toast,
    teamMembers,
    invites,
    addInvite,
    acceptInvite,
    revokeInvite,
    mintGovAccessCode,
    standDownTeamMember,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'parishes' | 'field_team' | 'analytics' | 'reporting'>('parishes');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Section Navigation: 'all' | 'operational' (active) | 'pending' | 'vacant'
  const [statusFilter, setStatusFilter] = useState<'all' | 'operational' | 'pending' | 'vacant'>('all');
  const [fieldStatusFilter, setFieldStatusFilter] = useState<'all' | 'operational' | 'pending' | 'vacant'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Manual Invite Modal State (Strictly manual typing - NO prefilled dummy names)
  const [inviteModal, setInviteModal] = useState<ManualInviteModalState | null>(null);
  const [officerName, setOfficerName] = useState('');
  const [officerTitle, setOfficerTitle] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');
  const [officerRole, setOfficerRole] = useState<RoleType>('spokesperson');
  const titleInputRef = useRef<HTMLInputElement>(null);

  const country = user?.country || 'UG';
  const districts = TERRITORY[country] || [];

  // Locate current district & subcounty
  let currentDistrict = districts.find((d) => d.id.toLowerCase() === districtId.toLowerCase());
  let currentSubcounty = currentDistrict?.children?.find(
    (s) => s.id.toLowerCase() === subcountyId.toLowerCase()
  );

  // Fallback search across all districts if not directly found
  if (!currentSubcounty) {
    for (const d of districts) {
      const foundS = d.children?.find((s) => s.id.toLowerCase() === subcountyId.toLowerCase());
      if (foundS) {
        currentDistrict = d;
        currentSubcounty = foundS;
        break;
      }
    }
  }

  // Fallback if still not found
  if (!currentDistrict) currentDistrict = districts[0];
  if (!currentSubcounty) currentSubcounty = currentDistrict?.children?.[0];

  const parishes = currentSubcounty?.children || [];

  // Copy Transmittal Memo
  const handleCopyMemo = (parishName: string, inviteCode?: string, officerNameText?: string, titleText?: string) => {
    const memo = `OFFICIAL STATUTORY DISPATCH — SUB-COUNTY CHIEF (SAS)
Office: Senior Assistant Secretary (SAS), ${currentSubcounty?.name}
To: ${officerNameText || 'Designated Officer'} (${titleText || 'Parish Chief / Town Agent Desk'}), ${parishName}
Authority: Section 69, Local Governments Act (Cap. 243)
${inviteCode ? `Gateway Access Key: ${inviteCode}\n` : ''}
Mandate:
You are hereby deployed to command this frontline statutory desk. Maintain continuous vigilance, process community civic tickets, monitor PDM SACCO revolving fund ledgers, and uphold the statutory 24-hour SLA standard. Authenticate at the government portal using your sovereign access key.`;

    navigator.clipboard.writeText(memo);
    setCopiedId(parishName);
    toast(`Official Transmittal Memo copied for ${parishName}! Ready for dispatch.`, 'emerald');
    setTimeout(() => setCopiedId(null), 3000);
  };

  // 14 Statutory Desks / Field Technical Roster for Sub-County Operations
  const fieldStaffTemplates = [
    {
      id: `${currentSubcounty?.id || 'sub'}-cdo`,
      scopeKey: `${currentSubcounty?.id || 'sub'}-cdo`,
      roleTitle: 'Community Development Officer (CDO)',
      duty: 'Mobilizes women, youth, elderly and special interest groups; mediates community disputes and supervises PDM pillar 5.',
      role: 'spokesperson' as RoleType,
    },
    {
      id: `${currentSubcounty?.id || 'sub'}-agric`,
      scopeKey: `${currentSubcounty?.id || 'sub'}-agric`,
      roleTitle: 'Sub-County Agricultural & Vet Extension Officer',
      duty: 'Inspects farmer enterprises, veterinary disease control, and PDM Pillar 1 agricultural inputs.',
      role: 'spokesperson' as RoleType,
    },
    {
      id: `${currentSubcounty?.id || 'sub'}-health`,
      scopeKey: `${currentSubcounty?.id || 'sub'}-health`,
      roleTitle: 'Sub-County Health Inspector',
      duty: 'Conducts sanitation inspections, water source hygiene checks, and market food safety audits.',
      role: 'spokesperson' as RoleType,
    },
    {
      id: `${currentSubcounty?.id || 'sub'}-pdm`,
      scopeKey: `${currentSubcounty?.id || 'sub'}-pdm`,
      roleTitle: 'Parish Development Model (PDM) SACCO Clerk',
      duty: 'Captures and monitors revolving fund disbursements and citizen financial inclusion records.',
      role: 'spokesperson' as RoleType,
    },
    {
      id: `${currentSubcounty?.id || 'sub'}-rev`,
      scopeKey: `${currentSubcounty?.id || 'sub'}-rev`,
      roleTitle: 'Sub-County Revenue & Accounts Assistant',
      duty: 'Local revenue collection, trading license assessments, and sub-county petty cash records.',
      role: 'read_only' as RoleType,
    },
    {
      id: `${currentSubcounty?.id || 'sub'}-tech-custom`,
      scopeKey: `${currentSubcounty?.id || 'sub'}-tech-custom`,
      roleTitle: '+ Others (Specify Technical Desk)',
      duty: 'Appoint any other specialized sub-county post such as Physical Planner, Sub-County Engineer, or Commercial Assistant.',
      role: 'spokesperson' as RoleType,
    },
  ];

  // Derive Parish Desk Telemetry (Active vs. Pending vs. Vacant)
  const parishOfficers = useMemo(() => {
    return parishes.map((p) => {
      const activeOfficer = teamMembers?.find(
        (m) => m.scope === p.id && m.active && (!m.country || m.country === country)
      );
      const pendingInvite = invites?.find(
        (i) => i.scope === p.id && !i.used && (!i.country || i.country === country)
      );

      // Mutually exclusive statutory states
      const status: 'operational' | 'pending' | 'vacant' = activeOfficer
        ? 'operational'
        : pendingInvite
        ? 'pending'
        : 'vacant';

      return {
        parish: p,
        activeOfficer,
        pendingInvite,
        status,
      };
    });
  }, [parishes, teamMembers, invites, country]);

  // Derived counts for Parishes
  const operationalCount = parishOfficers.filter((po) => po.status === 'operational').length;
  const pendingCount = parishOfficers.filter((po) => po.status === 'pending').length;
  const vacantCount = parishOfficers.filter((po) => po.status === 'vacant').length;

  // Filtered Parish Officers based on current Section
  const filteredParishOfficers = useMemo(() => {
    return parishOfficers.filter((po) => {
      if (statusFilter !== 'all' && po.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        po.parish.name.toLowerCase().includes(q) ||
        po.parish.id.toLowerCase().includes(q) ||
        (po.activeOfficer && po.activeOfficer.name.toLowerCase().includes(q)) ||
        (po.pendingInvite && po.pendingInvite.name.toLowerCase().includes(q)) ||
        (po.pendingInvite && po.pendingInvite.code.toLowerCase().includes(q))
      );
    });
  }, [parishOfficers, statusFilter, searchQuery]);

  // Derive Field Staff Telemetry (Active vs. Pending vs. Vacant)
  const fieldStaffRoster = useMemo(() => {
    return fieldStaffTemplates.map((template) => {
      const activeOfficer = teamMembers?.find(
        (m) =>
          (m.scope === template.scopeKey || m.title.toLowerCase() === template.roleTitle.toLowerCase()) &&
          m.active &&
          (!m.country || m.country === country)
      );
      const pendingInvite = invites?.find(
        (i) =>
          (i.scope === template.scopeKey || i.title.toLowerCase() === template.roleTitle.toLowerCase()) &&
          !i.used &&
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
  }, [fieldStaffTemplates, teamMembers, invites, country]);

  const fieldActiveCount = fieldStaffRoster.filter((f) => f.status === 'operational').length;
  const fieldPendingCount = fieldStaffRoster.filter((f) => f.status === 'pending').length;
  const fieldVacantCount = fieldStaffRoster.filter((f) => f.status === 'vacant').length;

  const filteredFieldRoster = useMemo(() => {
    return fieldStaffRoster.filter((f) => {
      if (fieldStatusFilter !== 'all' && f.status !== fieldStatusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.template.roleTitle.toLowerCase().includes(q) ||
        (f.activeOfficer && f.activeOfficer.name.toLowerCase().includes(q)) ||
        (f.pendingInvite && f.pendingInvite.name.toLowerCase().includes(q)) ||
        (f.pendingInvite && f.pendingInvite.code.toLowerCase().includes(q))
      );
    });
  }, [fieldStaffRoster, fieldStatusFilter, searchQuery]);

  // Open Modal for Station-Specific Manual Invite
  const handleOpenInviteModal = (
    stationId: string,
    stationName: string,
    defaultTitle: string,
    defaultRole: RoleType = 'spokesperson',
    isFieldDesk: boolean = false
  ) => {
    setInviteModal({
      open: true,
      stationId,
      stationName,
      defaultTitle,
      defaultRole,
      isFieldDesk,
    });
    // NEVER PREFILL OFFICER NAME — Let everything be manual as required!
    setOfficerName('');
    setOfficerTitle(defaultTitle === '+ Others (Specify Technical Desk)' ? '' : defaultTitle);
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

    const cleanDept = user?.dept || 'kcca';
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const code = `UG-${cleanDept.toUpperCase()}-${randomHex}`;

    const newInvite: Invite = {
      code,
      name: officerName.trim(),
      title: officerTitle.trim(),
      role: officerRole,
      scope: inviteModal.stationId,
      dept: cleanDept,
      is_utility: false,
      used: false,
      country,
      duty_station: inviteModal.stationName,
      contact_phone: officerPhone.trim() || undefined,
      invited_by: user?.officer_name || user?.name || 'Senior Assistant Secretary (SAS)',
      invited_at: new Date().toISOString(),
      hierarchy_level: inviteModal.isFieldDesk ? 'tier2_subcounty' : 'tier1_parish',
      escalation_rank: inviteModal.isFieldDesk ? 2 : 1,
    };

    // 1. Dispatch statutory invite (station-specific)
    addInvite(newInvite);

    // 2. Mint the access key on sovereign gateway
    mintGovAccessCode(code, {
      country,
      dept: cleanDept,
      scope: inviteModal.stationId,
      role: officerRole,
      is_utility: false,
      role_label: `${officerTitle.trim()} (${inviteModal.stationName})`,
      real_title_short: officerTitle.trim(),
      officer_name: officerName.trim(),
      hierarchy_level: inviteModal.isFieldDesk ? 'tier2_subcounty' : 'tier1_parish',
      escalation_rank: inviteModal.isFieldDesk ? 2 : 1,
    });

    // 3. Inviter only gets notifications of active or pending
    toast(
      `Statutory invite sent immediately to ${officerName.trim()} for ${inviteModal.stationName}! Status: PENDING acceptance.`,
      'amber'
    );

    // Close modal. Station immediately disappears from Vacant and enters Pending!
    setInviteModal(null);
  };

  // Supervisor simulates or finalizes acceptance
  const handleAcceptInvite = (inviteCode: string, officerNameStr: string, stationNameStr: string) => {
    const enlisted = acceptInvite(inviteCode);
    if (enlisted) {
      toast(
        `${officerNameStr} accepted statutory invite for ${stationNameStr}! Enlisted into ACTIVE roster for direct supervision.`,
        'emerald'
      );
    }
  };

  // Supervisor revokes / recalls invite
  const handleRevokeInvite = (inviteCode: string, stationNameStr: string) => {
    revokeInvite(inviteCode);
    toast(`Invite revoked for ${stationNameStr}. Desk returned to VACANT.`, 'amber');
  };

  // Supervisor stands down an active officer
  const handleStandDown = (memberId: string, memberName: string, stationNameStr: string) => {
    standDownTeamMember(
      memberId,
      'Administrative Reorganization / Transfer',
      `Stood down by Sub-County Chief on ${new Date().toLocaleDateString('en-GB')}`
    );
    toast(`Official ${memberName} stood down. ${stationNameStr} desk is now VACANT for new appointment.`, 'amber');
  };

  return (
    <div id="subcounty-supervision-structure" className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 rounded-xl p-5 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Tier 2 — Sub-County Local Government
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {currentSubcounty?.name || 'Sub-County Headquarters'}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Production Parish Command &amp; Station Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Statutory invite-first supervision under Section 69, Local Governments Act (Cap. 243). A desk node head invites first; once accepted, the official enlists into the active section for continuous supervision. Vacant section strictly lists unfilled stations.
            </p>
          </div>
        </div>

        {/* Live Telemetry Counters */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <div
            onClick={() => setStatusFilter('all')}
            className="cursor-pointer bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center hover:border-slate-400 transition-all"
          >
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Stations</div>
            <div className="text-sm font-black text-slate-800 dark:text-white">{parishes.length}</div>
          </div>
          <div
            onClick={() => setStatusFilter('operational')}
            className="cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-center hover:border-emerald-500 transition-all"
          >
            <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active</div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">{operationalCount}</div>
          </div>
          <div
            onClick={() => setStatusFilter('pending')}
            className="cursor-pointer bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800/60 text-center hover:border-amber-500 transition-all"
          >
            <div className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending</div>
            <div className="text-sm font-black text-amber-600 dark:text-amber-400">{pendingCount}</div>
          </div>
          <div
            onClick={() => setStatusFilter('vacant')}
            className="cursor-pointer bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-xl border border-rose-200 dark:border-rose-800/60 text-center hover:border-rose-500 transition-all"
          >
            <div className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Vacant</div>
            <div className="text-sm font-black text-rose-600 dark:text-rose-400">{vacantCount}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('parishes')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'parishes'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <MapPin size={14} />
          Parish Command &amp; Stations ({parishes.length})
        </button>

        <button
          onClick={() => setActiveTab('field_team')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'field_team'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users size={14} />
          Sub-County Field Operations ({fieldStaffTemplates.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 size={14} />
          Executive Tier Analytics
        </button>

        <button
          onClick={() => setActiveTab('reporting')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
            activeTab === 'reporting'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Shield size={14} />
          Supervising CAO Chain of Command
        </button>
      </div>

      {/* TAB 1: PARISH COMMAND & STATIONS */}
      {activeTab === 'parishes' && (
        <div className="space-y-4">
          {/* Section Selector & Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter Parishes, Wards or Appointees..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Status Section Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  All Stations ({parishes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('operational')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                    statusFilter === 'operational'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active Section ({operationalCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                    statusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Pending Section ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('vacant')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
                    statusFilter === 'vacant'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Vacant Section ({vacantCount})
                </button>
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-end md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 font-bold ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid size={13} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 font-bold ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Tabular Register View"
              >
                <Table size={13} />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Section Explanatory Notice */}
          {statusFilter === 'vacant' && (
            <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-rose-600" />
                <span>
                  <strong>Vacant Section:</strong> Showing only positions not filled yet. Station-specific invites happen once and are dispatched immediately; once sent, the station disappears from this section and transitions to Pending.
                </span>
              </div>
            </div>
          )}

          {statusFilter === 'pending' && (
            <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={15} className="shrink-0 text-amber-600" />
                <span>
                  <strong>Pending Section:</strong> Dispatched statutory invites awaiting official acceptance. Once accepted by the appointee, the official is automatically enlisted in the Active Section for direct supervision.
                </span>
              </div>
            </div>
          )}

          {statusFilter === 'operational' && (
            <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck size={15} className="shrink-0 text-emerald-600" />
                <span>
                  <strong>Active Section:</strong> Officially accepted and sworn parish chiefs, easily supervisable by the Sub-County Accounting Officer (SAS) with real-time 24h SLA and PDM telemetry.
                </span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredParishOfficers.length === 0 && (
            <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
              <p className="text-xs text-slate-500 font-medium">
                No stations match the selected filter ({statusFilter.toUpperCase()}).
              </p>
            </div>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredParishOfficers.map(({ parish, activeOfficer, pendingInvite, status }) => (
                <div
                  key={parish.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    status === 'operational'
                      ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10 hover:border-emerald-400'
                      : status === 'pending'
                      ? 'border-amber-200 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10 hover:border-amber-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:border-teal-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          {parish.name}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Code: {parish.id}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          Tier 1 (Parish)
                        </span>
                        {status === 'operational' ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        ) : status === 'pending' ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                            <Clock size={10} /> Pending
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1">
                            <AlertCircle size={10} /> Vacant
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs mb-2">
                      <span className="font-semibold text-teal-700 dark:text-teal-400">
                        Parish Chief / Town Agent Desk
                      </span>
                    </div>

                    {/* Incumbent Officer Telemetry */}
                    <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 mb-2.5 space-y-1">
                      {status === 'operational' && activeOfficer ? (
                        <div className="text-[11px] space-y-1">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <UserCheck size={13} className="text-emerald-600" />
                              <span>{activeOfficer.name}</span>
                            </div>
                            <span className="text-[9px] mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                              Enlisted
                            </span>
                          </div>
                          <div className="text-slate-500 text-[10px] flex items-center gap-2 flex-wrap">
                            <span>Designation: <strong>{activeOfficer.title}</strong></span>
                            {activeOfficer.phone && <span>&bull; {activeOfficer.phone}</span>}
                          </div>
                          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 size={10} />
                            <span>Supervised: 24h SLA Active &bull; PDM SACCO Verified</span>
                          </div>
                        </div>
                      ) : status === 'pending' && pendingInvite ? (
                        <div className="text-[11px] space-y-1">
                          <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Clock size={13} />
                              <span>{pendingInvite.name}</span>
                            </div>
                            <span className="text-[9px] mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                              Awaiting Login
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Title: <strong>{pendingInvite.title}</strong>
                            {pendingInvite.contact_phone && <span> &bull; {pendingInvite.contact_phone}</span>}
                          </div>
                          <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded flex items-center justify-between">
                            <span>Key: <strong>{pendingInvite.code}</strong></span>
                            <span className="text-[9px] text-amber-600">Dispatched</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 italic flex items-center gap-1.5 py-1">
                          <AlertCircle size={13} className="text-rose-500 shrink-0" />
                          <span>Station unfilled. Ready for manual officer invite.</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
                      <span>PDM SACCO Unit</span>
                      <span>24h Community SLA</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    {status === 'vacant' && (
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenInviteModal(
                            parish.id,
                            `${parish.name} Parish`,
                            `Parish Chief, ${parish.name}`,
                            'spokesperson',
                            false
                          )
                        }
                        className="flex-1 py-1.5 px-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <UserPlus size={12} /> Invite Officer (Manual)
                      </button>
                    )}

                    {status === 'pending' && pendingInvite && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAcceptInvite(pendingInvite.code, pendingInvite.name, parish.name)}
                          className="flex-1 py-1.5 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                          title="Simulate or Confirm Official Acceptance"
                        >
                          <CheckCircle2 size={12} /> Accept &amp; Enlist
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRevokeInvite(pendingInvite.code, parish.name)}
                          className="py-1.5 px-2 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          title="Revoke / Recall Invite"
                        >
                          <XCircle size={12} /> Revoke
                        </button>
                      </>
                    )}

                    {status === 'operational' && activeOfficer && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStandDown(activeOfficer.id, activeOfficer.name, parish.name)}
                          className="flex-1 py-1.5 px-2 rounded bg-slate-100 hover:bg-rose-50 hover:text-rose-700 dark:bg-slate-800 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                          title="Stand Down / Reassign Desk"
                        >
                          <RotateCcw size={12} /> Transfer Desk
                        </button>
                      </>
                    )}

                    {/* Memo button available on all */}
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyMemo(
                          parish.name,
                          status === 'pending' ? pendingInvite?.code : undefined,
                          status === 'operational' ? activeOfficer?.name : pendingInvite?.name,
                          status === 'operational' ? activeOfficer?.title : pendingInvite?.title
                        )
                      }
                      className="py-1.5 px-2.5 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Copy Statutory Dispatch Notice"
                    >
                      {copiedId === parish.name ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      Memo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TABULAR REGISTER VIEW */}
          {viewMode === 'table' && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Parish / Ward</th>
                    <th className="py-2.5 px-3">Statutory Desk</th>
                    <th className="py-2.5 px-3">Official Appointee</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Supervision Telemetry</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredParishOfficers.map(({ parish, activeOfficer, pendingInvite, status }) => (
                    <tr
                      key={parish.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{parish.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{parish.id}</div>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                        Parish Chief / Town Agent
                      </td>
                      <td className="py-2.5 px-3">
                        {status === 'operational' && activeOfficer ? (
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                              <UserCheck size={12} className="text-emerald-600" />
                              <span>{activeOfficer.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{activeOfficer.title} {activeOfficer.phone && `• ${activeOfficer.phone}`}</div>
                          </div>
                        ) : status === 'pending' && pendingInvite ? (
                          <div>
                            <div className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                              <Clock size={12} />
                              <span>{pendingInvite.name}</span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">Key: {pendingInvite.code} (Awaiting Acceptance)</div>
                          </div>
                        ) : (
                          <span className="text-rose-500 italic text-[11px] font-medium flex items-center gap-1">
                            <AlertCircle size={11} /> Unfilled (Vacant)
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {status === 'operational' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={10} /> Active
                          </span>
                        ) : status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock size={10} /> Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <AlertCircle size={10} /> Vacant
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 dark:text-slate-300">
                        {status === 'operational' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 size={11} /> 24h SLA Active &bull; PDM Verified
                          </span>
                        ) : status === 'pending' ? (
                          <span className="text-amber-600 dark:text-amber-400 font-mono">
                            Dispatched by SAS &bull; Pending Gateway Login
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">No telemetry until appointed</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {status === 'vacant' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenInviteModal(
                                  parish.id,
                                  `${parish.name} Parish`,
                                  `Parish Chief, ${parish.name}`,
                                  'spokesperson',
                                  false
                                )
                              }
                              className="px-2 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                            >
                              <UserPlus size={11} /> Invite
                            </button>
                          )}

                          {status === 'pending' && pendingInvite && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleAcceptInvite(pendingInvite.code, pendingInvite.name, parish.name)}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
                              >
                                <CheckCircle2 size={11} /> Enlist
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRevokeInvite(pendingInvite.code, parish.name)}
                                className="px-1.5 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-[10px] transition-colors"
                                title="Revoke"
                              >
                                Revoke
                              </button>
                            </>
                          )}

                          {status === 'operational' && activeOfficer && (
                            <button
                              type="button"
                              onClick={() => handleStandDown(activeOfficer.id, activeOfficer.name, parish.name)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-[10px] flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw size={11} /> Transfer
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleCopyMemo(
                                parish.name,
                                status === 'pending' ? pendingInvite?.code : undefined,
                                status === 'operational' ? activeOfficer?.name : pendingInvite?.name,
                                status === 'operational' ? activeOfficer?.title : pendingInvite?.title
                              )
                            }
                            className="p-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                            title="Copy Official Memo"
                          >
                            {copiedId === parish.name ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUB-COUNTY FIELD OPERATIONS (ADOPTED ACROSS) */}
      {activeTab === 'field_team' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              Statutory direct-report technical officers. Field node heads invite first; once accepted, the official is enlisted into the active section. Vacant section lists unfilled posts.
            </p>

            {/* Field Status Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFieldStatusFilter('all')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  fieldStatusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                All ({fieldStaffTemplates.length})
              </button>
              <button
                type="button"
                onClick={() => setFieldStatusFilter('operational')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  fieldStatusFilter === 'operational'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700'
                }`}
              >
                Active ({fieldActiveCount})
              </button>
              <button
                type="button"
                onClick={() => setFieldStatusFilter('pending')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  fieldStatusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-amber-700'
                }`}
              >
                Pending ({fieldPendingCount})
              </button>
              <button
                type="button"
                onClick={() => setFieldStatusFilter('vacant')}
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  fieldStatusFilter === 'vacant'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-rose-600'
                }`}
              >
                Vacant ({fieldVacantCount})
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredFieldRoster.map(({ template, activeOfficer, pendingInvite, status }) => (
              <div key={template.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {template.roleTitle}
                    </span>
                    {status === 'operational' ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                        Active Enlisted
                      </span>
                    ) : status === 'pending' ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                        Pending Acceptance
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                        Vacant Desk
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xl">{template.duty}</p>

                  {/* Incumbent details */}
                  {status === 'operational' && activeOfficer && (
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
                      <span>Officer: {activeOfficer.name}</span>
                      {activeOfficer.phone && <span>&bull; {activeOfficer.phone}</span>}
                    </div>
                  )}

                  {status === 'pending' && pendingInvite && (
                    <div className="text-xs text-amber-700 dark:text-amber-400 font-mono flex items-center gap-2">
                      <span>Appointee: {pendingInvite.name}</span>
                      <span>&bull; Key: {pendingInvite.code}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {status === 'vacant' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenInviteModal(
                          template.scopeKey,
                          `${currentSubcounty?.name} Field Desk`,
                          template.roleTitle,
                          template.role,
                          true
                        )
                      }
                      className="py-1 px-3 rounded bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <UserPlus size={12} /> Appoint Field Officer
                    </button>
                  )}

                  {status === 'pending' && pendingInvite && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleAcceptInvite(pendingInvite.code, pendingInvite.name, template.roleTitle)
                        }
                        className="py-1 px-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 size={12} /> Accept &amp; Enlist
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevokeInvite(pendingInvite.code, template.roleTitle)}
                        className="py-1 px-2 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-[11px] font-bold transition-colors"
                      >
                        Revoke
                      </button>
                    </>
                  )}

                  {status === 'operational' && activeOfficer && (
                    <button
                      type="button"
                      onClick={() =>
                        handleStandDown(activeOfficer.id, activeOfficer.name, template.roleTitle)
                      }
                      className="py-1 px-2.5 rounded bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw size={12} /> Transfer Desk
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
            initialTier={2}
            initialScope={currentSubcounty?.id}
            compact={true}
          />
        </div>
      )}

      {/* TAB 4: REPORTING CHAIN */}
      {activeTab === 'reporting' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Supervising Authority</div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              Chief Administrative Officer (CAO)
            </div>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              {currentDistrict?.name} District Administration
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              As Sub-County Chief, you report directly to the Chief Administrative Officer (CAO) under Section 64 &amp; 69 of the Local Governments Act. Unresolved LLG tickets escalate automatically to the CAO.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-teal-100 dark:border-teal-900/40 bg-teal-50/50 dark:bg-teal-950/20 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Sub-County Operational Authority
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white">
              {currentSubcounty?.name}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your administrative mandate is strictly confined to {currentSubcounty?.name} and its {parishes.length} parishes. You cannot issue access codes for officers in other sub-counties or higher district headquarters.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MANUAL STATION-SPECIFIC APPOINTMENT MODAL (NO PREFILLED NAMES)             */}
      {/* ========================================================================= */}
      {inviteModal && inviteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-800">
                    Station-Specific Appointment
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {inviteModal.stationName}
                  </span>
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  Issue Statutory Invite (Manual Entry)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setInviteModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                  value={`${inviteModal.stationName} (${inviteModal.isFieldDesk ? 'Tier 2 Field Desk' : 'Tier 1 Parish Desk'})`}
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
                  placeholder="e.g. Wasswa Michael (Type Officer's Real Legal Name)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Manual input: enter the officer's real substantive name. No dummy prefilled placeholders.
                </span>
              </div>

              {/* 1-Click Direct Report Presets (SAS Central Division) Station Specific */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] mono text-slate-500 uppercase tracking-wider font-bold">
                    1-Click Direct Report Presets ({user?.real_title_short || 'SAS Central Division'})
                  </span>
                  <span className="text-[9px] mono text-teal-600 dark:text-teal-400 font-bold">Station Specific</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'parish_chief', label: 'Parish Chief / Ward Agent (Direct Report)', title: 'Parish Chief / Ward Agent (Direct Report)', role: 'spokesperson' as RoleType },
                    { id: 'cdo', label: 'Community Development Officer (CDO)', title: 'Community Development Officer (CDO)', role: 'spokesperson' as RoleType },
                    { id: 'agric', label: 'Agric / Veterinary Extension Lead', title: 'Agric / Veterinary Extension Lead', role: 'spokesperson' as RoleType },
                    { id: 'health_insp', label: 'Sub-County Health Inspector', title: 'Sub-County Health Inspector', role: 'spokesperson' as RoleType },
                    { id: 'pdm_clerk', label: 'PDM SACCO Data Clerk', title: 'PDM SACCO Data Clerk', role: 'spokesperson' as RoleType },
                    { id: 'sub_revenue', label: 'Sub-County Revenue Collector', title: 'Sub-County Revenue Collector', role: 'read_only' as RoleType },
                    { id: 'others', label: '+ Others (specify)', title: '', role: 'spokesperson' as RoleType },
                  ].map((preset) => {
                    const isSelected = preset.id === 'others'
                      ? officerTitle !== '' && !['Parish Chief / Ward Agent (Direct Report)', 'Community Development Officer (CDO)', 'Agric / Veterinary Extension Lead', 'Sub-County Health Inspector', 'PDM SACCO Data Clerk', 'Sub-County Revenue Collector'].includes(officerTitle)
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
                  <label htmlFor="modal-official-title-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Official Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
                    Sub-County LLG Desks
                  </span>
                </div>
                <input
                  ref={titleInputRef}
                  id="modal-official-title-input"
                  type="text"
                  required
                  value={officerTitle}
                  onChange={(e) => setOfficerTitle(e.target.value)}
                  placeholder="e.g. Parish Chief / Ward Agent / Community Development Officer"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Real-time custom title input active. Click any preset or enter custom title directly.
                </span>
              </div>

              {/* Contact Phone / WhatsApp */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Official Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={officerPhone}
                  onChange={(e) => setOfficerPhone(e.target.value)}
                  placeholder="e.g. +256 772 000 000"
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
        </div>
      )}
    </div>
  );
};
