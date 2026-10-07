import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, RoleType, Invite, TeamMember, OfficialQuery } from '../types';
import { TERRITORY } from '../data/countries';
import { OfficialQueryDispatchModal } from './OfficialQueryDispatchModal';
import { OfficialQueryDossierModal } from './OfficialQueryDossierModal';
import {
  Building2,
  Users,
  Shield,
  Layers,
  MapPin,
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

interface ParishSupervisionStructureProps {
  districtId: string;
  subcountyId: string;
  parishId: string;
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
}

export const ParishSupervisionStructure: React.FC<ParishSupervisionStructureProps> = ({
  districtId,
  subcountyId,
  parishId,
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
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'operational' | 'pending' | 'vacant'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual Invite Modal State (Strictly manual typing - NO prefilled dummy names)
  const [inviteModal, setInviteModal] = useState<ManualInviteModalState | null>(null);
  const [officerName, setOfficerName] = useState('');
  const [officerTitle, setOfficerTitle] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');
  const [officerRole, setOfficerRole] = useState<RoleType>('spokesperson');
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

  const country = user?.country || 'UG';
  const districts = TERRITORY[country] || [];

  let currentDistrict = districts.find((d) => d.id.toLowerCase() === districtId.toLowerCase());
  let currentSubcounty = currentDistrict?.children?.find(
    (s) => s.id.toLowerCase() === subcountyId.toLowerCase()
  );
  let currentParish = currentSubcounty?.children?.find(
    (p) => p.id.toLowerCase() === parishId.toLowerCase()
  );

  // Search across all districts/subcounties if not directly resolved
  if (!currentParish) {
    for (const d of districts) {
      for (const s of d.children || []) {
        const foundP = s.children?.find((p) => p.id.toLowerCase() === parishId.toLowerCase());
        if (foundP) {
          currentDistrict = d;
          currentSubcounty = s;
          currentParish = foundP;
          break;
        }
      }
      if (currentParish) break;
    }
  }

  if (!currentDistrict) currentDistrict = districts[0];
  if (!currentSubcounty) currentSubcounty = currentDistrict?.children?.[0];
  if (!currentParish) currentParish = currentSubcounty?.children?.[0];

  const parishScopeId = currentParish?.id || 'parish';

  // Village & Grassroots Coordination Desks
  const villageDesksTemplate = useMemo(
    () => [
      {
        id: `${parishScopeId}-lc1`,
        roleTitle: 'LC1 Village Chairperson Liaison',
        mandate: 'Primary community mobilization, village baraza notices, and local dispute records.',
        role: 'spokesperson' as RoleType,
        isUtility: false,
      },
      {
        id: `${parishScopeId}-vht`,
        roleTitle: 'Village Health Team (VHT) Coordinator',
        mandate: 'Household sanitation tracking, immunization mobilizations, and village emergency alerts.',
        role: 'spokesperson' as RoleType,
        isUtility: false,
      },
      {
        id: `${parishScopeId}-pdm`,
        roleTitle: 'PDM SACCO Enterprise Mobilizer',
        mandate: 'Beneficiary enterprise group verification, revolving fund tracking, and community feedback.',
        role: 'spokesperson' as RoleType,
        isUtility: false,
      },
      {
        id: `${parishScopeId}-youth-women`,
        roleTitle: 'Parish Youth & Women Council Representative',
        mandate: 'Special interest group mobilization, affirmative action monitoring, and youth enterprise support.',
        role: 'spokesperson' as RoleType,
        isUtility: false,
      },
      {
        id: `${parishScopeId}-water`,
        roleTitle: 'Parish Water User Committee Secretary',
        mandate: 'Community borehole maintenance, water point sanitation, and pump mechanic coordination.',
        role: 'spokesperson' as RoleType,
        isUtility: true,
      },
    ],
    [parishScopeId]
  );

  // Map to Telemetry Status (Operational, Pending, Vacant)
  const villageTelemetry = useMemo(() => {
    return villageDesksTemplate.map((template) => {
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
  }, [villageDesksTemplate, teamMembers, invites, country]);

  // Filtered List
  const filteredDesks = useMemo(() => {
    return villageTelemetry.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.template.roleTitle.toLowerCase().includes(q) ||
        (item.activeOfficer && item.activeOfficer.name.toLowerCase().includes(q)) ||
        (item.pendingInvite && item.pendingInvite.name.toLowerCase().includes(q))
      );
    });
  }, [villageTelemetry, statusFilter, searchQuery]);

  // Open Modal
  const handleOpenInviteModal = (
    stationId: string,
    stationName: string,
    defaultTitle: string,
    defaultRole: RoleType = 'spokesperson'
  ) => {
    setInviteModal({
      open: true,
      stationId,
      stationName,
      defaultTitle,
      defaultRole,
    });
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

    const cleanDept = user?.dept || 'molg';
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const code = `UG-${cleanDept.toUpperCase()}-${randomHex}`;

    const newInvite: Invite = {
      code,
      name: officerName.trim(),
      title: officerTitle.trim(),
      role: officerRole,
      scope: inviteModal.stationId,
      dept: cleanDept,
      is_utility: officerTitle.toLowerCase().includes('water'),
      used: false,
      country,
      duty_station: inviteModal.stationName,
      contact_phone: officerPhone.trim() || undefined,
      invited_by: user?.officer_name || user?.name || 'Parish Chief / Town Agent',
      invited_at: new Date().toISOString(),
      hierarchy_level: 'tier1_parish',
      escalation_rank: 1,
    };

    addInvite(newInvite);

    mintGovAccessCode(code, {
      country,
      dept: cleanDept,
      scope: inviteModal.stationId,
      role: officerRole,
      is_utility: newInvite.is_utility,
      role_label: `${officerTitle.trim()} (${inviteModal.stationName})`,
      real_title_short: officerTitle.trim(),
      officer_name: officerName.trim(),
      hierarchy_level: 'tier1_parish',
      escalation_rank: 1,
    });

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
    toast(`Invite revoked for ${stationNameStr}. Desk returned to VACANT.`, 'amber');
  };

  const activeCount = villageTelemetry.filter((v) => v.status === 'operational').length;
  const pendingCount = villageTelemetry.filter((v) => v.status === 'pending').length;
  const vacantCount = villageTelemetry.filter((v) => v.status === 'vacant').length;

  return (
    <div id="parish-supervision-structure" className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Tier 1 — Parish Frontline Unit
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {currentParish?.name || 'Parish Command'}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Parish Frontline Command &amp; Village Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              As Parish Chief / Town Agent, you serve as administrative head of {currentParish?.name} and Secretary to the Parish Development Committee (PDC). You coordinate LC1 Village Chairpersons, VHTs, and PDM SACCO mobilizers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supervising LLG</div>
            <div className="text-sm font-bold text-teal-600 dark:text-teal-400">{currentSubcounty?.name}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Desks ({villageDesksTemplate.length})
          </button>
          <button
            onClick={() => setStatusFilter('operational')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'operational'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('vacant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'vacant'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Vacant ({vacantCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search village desks, coordinators, or codes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Village Desks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredDesks.map(({ template, activeOfficer, pendingInvite, status }) => (
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
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    status === 'operational'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : status === 'pending'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {status === 'operational' ? 'Active' : status === 'pending' ? 'Pending' : 'Vacant'}
                </span>
              </div>

              {/* Status & Officer Details */}
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
                    Village desk currently unassigned.
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-500 mb-3">{template.mandate}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800">
              {status === 'vacant' && (
                <button
                  type="button"
                  onClick={() =>
                    handleOpenInviteModal(
                      template.id,
                      currentParish?.name || 'Parish',
                      template.roleTitle,
                      template.role
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
                    onClick={() => {
                      const memo = `PARISH ADMINISTRATIVE NOTICE\nOffice: Parish Chief / Town Agent, ${currentParish?.name}\nTo: ${pendingInvite.name} (${pendingInvite.title})\nAccess Code: ${pendingInvite.code}\nGateway: ${window.location.origin}${window.location.pathname}?gov_code=${pendingInvite.code}`;
                      navigator.clipboard.writeText(memo);
                      toast(`Copied dispatch memo for ${pendingInvite.title}!`, 'emerald');
                    }}
                    className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
                    title="Copy Notice"
                  >
                    <FileText size={13} />
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
                      slaScore: '98%',
                      backlog: 0,
                      hours: 12,
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

      {/* Reporting Authority Chain */}
      <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Shield size={18} className="text-teal-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Reporting Chain: </span>
            <span className="text-slate-600 dark:text-slate-300">
              Senior Assistant Secretary ({currentSubcounty?.name}) &rarr; Chief Administrative Officer ({currentDistrict?.name}) &rarr; PS MoLG.
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 shrink-0">
          Frontline Grassroots Authority
        </span>
      </div>

      {/* ========================================================================= */}
      {/* STATION-SPECIFIC MANUAL INVITE MODAL                                      */}
      {/* ========================================================================= */}
      {inviteModal && inviteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Issue Grassroots Statutory Invite (Manual Entry)
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

              {/* Appointee Full Name (MANUAL INPUT - NO PREFILL) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Appointee Coordinator Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Sarah Namubiru (Type Legal Name)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* 1-Click Direct Report Presets for Parish */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] mono text-slate-500 uppercase tracking-wider font-bold">
                    1-Click Direct Report Presets (Parish Chief)
                  </span>
                  <span className="text-[9px] mono text-teal-600 dark:text-teal-400 font-bold">Station Specific</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'lc1', label: 'LC1 Village Chairperson', title: 'LC1 Village Chairperson Liaison', role: 'spokesperson' as RoleType },
                    { id: 'vht', label: 'Village Health Team (VHT)', title: 'Village Health Team (VHT) Coordinator', role: 'spokesperson' as RoleType },
                    { id: 'pdm', label: 'PDM SACCO Mobilizer', title: 'PDM SACCO Enterprise Mobilizer', role: 'spokesperson' as RoleType },
                    { id: 'youth', label: 'Youth & Women Rep', title: 'Parish Youth & Women Council Representative', role: 'spokesperson' as RoleType },
                    { id: 'water', label: 'Water Committee Sec', title: 'Parish Water User Committee Secretary', role: 'spokesperson' as RoleType },
                    { id: 'others', label: '+ Others (specify)', title: '', role: 'spokesperson' as RoleType },
                  ].map((preset) => {
                    const isSelected = preset.id === 'others'
                      ? officerTitle !== '' && !['LC1 Village Chairperson Liaison', 'Village Health Team (VHT) Coordinator', 'PDM SACCO Enterprise Mobilizer', 'Parish Youth & Women Council Representative', 'Parish Water User Committee Secretary'].includes(officerTitle)
                      : officerTitle === preset.title;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          if (preset.id === 'others') {
                            setOfficerTitle('');
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
                  <label htmlFor="parish-modal-title-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Official Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
                    Parish Grassroots Desks
                  </span>
                </div>
                <input
                  ref={titleInputRef}
                  id="parish-modal-title-input"
                  type="text"
                  required
                  value={officerTitle}
                  onChange={(e) => setOfficerTitle(e.target.value)}
                  placeholder="e.g. LC1 Village Chairperson Liaison / VHT Coordinator"
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

      {/* Official Query Dispatch Modal */}
      {dispatchModalTarget && (
        <OfficialQueryDispatchModal
          target={dispatchModalTarget}
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
