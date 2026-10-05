import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, RoleType, Invite, TeamMember, OfficialQuery } from '../types';
import { TERRITORY, COUNTRIES } from '../data/countries';
import { UG_DISTRICTS, getSisterMinistriesForCountry, SisterMinistryNode } from '../data/nationalRolloutNodes';
import { ExecutiveTierAnalytics } from './ExecutiveTierAnalytics';
import { OfficialQueryDispatchModal } from './OfficialQueryDispatchModal';
import { OfficialQueryDossierModal } from './OfficialQueryDossierModal';
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
  Sparkles,
  Zap,
  Download,
  ExternalLink,
  ChevronRight,
  CheckSquare,
  Square,
} from 'lucide-react';

interface RolloutSupervisionStructureProps {
  onPrefillManualForm?: (data: {
    name: string;
    title: string;
    role: RoleType;
    scope: string;
    isUtility: boolean;
    dept: string;
  }) => void;
  standaloneModal?: boolean;
}

interface ManualInviteModalState {
  open: boolean;
  stationId: string;
  stationName: string;
  defaultTitle: string;
  defaultRole: RoleType;
  isSisterMinistry?: boolean;
  deptId?: string;
  mandate?: string;
}

export const RolloutSupervisionStructure: React.FC<RolloutSupervisionStructureProps> = () => {
  const {
    user,
    toast,
    invites,
    teamMembers,
    addInvite,
    acceptInvite,
    revokeInvite,
    mintGovAccessCode,
    logAudit,
    go,
  } = useApp();

  const activeCountry: CountryCode = (user?.country || 'UG') as CountryCode;

  // Main Tabs: CAOs & Cities (All 135+ Local Governments), Sister PSs (11 Ministries), Analytics, SLA
  const [activeTab, setActiveTab] = useState<'caos' | 'sister_ps' | 'analytics' | 'sla'>('caos');
  
  // Status Filters: all | operational (Active) | pending | vacant
  const [caoStatusFilter, setCaoStatusFilter] = useState<'all' | 'operational' | 'pending' | 'vacant'>('all');
  const [psStatusFilter, setPsStatusFilter] = useState<'all' | 'operational' | 'pending' | 'vacant'>('all');
  
  // Provision for City Arrangements: All Tier 3 (157), District CAOs (146), Strategic Cities (11)
  const [cityArrangementFilter, setCityArrangementFilter] = useState<'all' | 'districts_only' | 'cities_only'>('all');
  
  // Region Filter for CAOs
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'NORTHERN' | 'CENTRAL' | 'EASTERN' | 'WESTERN'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Batch Dispatch Modal State
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchTargetType, setBatchTargetType] = useState<'caos' | 'sister_ps' | 'all'>('caos');
  const [selectedBatchStationIds, setSelectedBatchStationIds] = useState<string[]>([]);
  const [batchManifest, setBatchManifest] = useState<{
    timestamp: string;
    items: {
      type: 'CAO' | 'SISTER_PS';
      name: string;
      title: string;
      station: string;
      code: string;
      loginUrl: string;
    }[];
  } | null>(null);

  // Individual Manual Invite Modal State (Strictly manual typing - NO prefilled dummy names)
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

  // Sister Ministries List for Active Country
  const sisterMinistriesList = useMemo(() => {
    return getSisterMinistriesForCountry(activeCountry);
  }, [activeCountry]);

  // CAO District Nodes for Active Country
  const districtNodesList = useMemo(() => {
    return UG_DISTRICTS;
  }, []);

  // Map CAOs to Telemetry Status (Operational, Pending, Vacant)
  const caoTelemetry = useMemo(() => {
    return districtNodesList.map((d) => {
      const caoCode =
        d.id === 'UG-LG-GUL'
          ? 'UG-CAO-GULU'
          : d.id === 'UG-LG-WAK'
          ? 'UG-CAO-WAKISO'
          : d.id === 'UG-LG-KLA'
          ? 'UG-KCCA-ADMIN'
          : `UG-CAO-${d.name.replace(/\W/g, '').slice(0, 6).toUpperCase()}`;

      // Check if officer is active in teamMembers
      const activeOfficer = teamMembers?.find(
        (m) =>
          m.active &&
          (m.scope === d.id ||
            m.scope?.toLowerCase() === d.name.toLowerCase() ||
            m.title.toLowerCase().includes(d.name.toLowerCase())) &&
          (!m.country || m.country === activeCountry)
      );

      // Check if invite exists and is pending
      const pendingInvite = invites?.find(
        (i) =>
          !i.used &&
          (i.code === caoCode ||
            i.scope === d.id ||
            i.duty_station?.toLowerCase().includes(d.name.toLowerCase())) &&
          (!i.country || i.country === activeCountry)
      );

      const status: 'operational' | 'pending' | 'vacant' = activeOfficer
        ? 'operational'
        : pendingInvite
        ? 'pending'
        : 'vacant';

      return {
        district: d,
        defaultCode: caoCode,
        activeOfficer,
        pendingInvite,
        status,
      };
    });
  }, [districtNodesList, teamMembers, invites, activeCountry]);

  // Map Sister PSs to Telemetry Status (Operational, Pending, Vacant)
  const sisterPsTelemetry = useMemo(() => {
    return sisterMinistriesList.map((m) => {
      const activeOfficer = teamMembers?.find(
        (tm) =>
          tm.active &&
          (tm.scope === m.id ||
            tm.title.toLowerCase().includes(m.title.toLowerCase()) ||
            tm.dept === m.deptId) &&
          (!tm.country || tm.country === activeCountry)
      );

      const pendingInvite = invites?.find(
        (i) =>
          !i.used &&
          (i.code === m.code ||
            i.scope === m.id ||
            i.title.toLowerCase().includes(m.title.toLowerCase())) &&
          (!i.country || i.country === activeCountry)
      );

      const status: 'operational' | 'pending' | 'vacant' = activeOfficer
        ? 'operational'
        : pendingInvite
        ? 'pending'
        : 'vacant';

      return {
        ministry: m,
        activeOfficer,
        pendingInvite,
        status,
      };
    });
  }, [sisterMinistriesList, teamMembers, invites, activeCountry]);

  // Filtered CAOs
  const filteredCaos = useMemo(() => {
    return caoTelemetry.filter((item) => {
      if (caoStatusFilter !== 'all' && item.status !== caoStatusFilter) return false;
      if (cityArrangementFilter === 'districts_only' && item.district.isCity) return false;
      if (cityArrangementFilter === 'cities_only' && !item.district.isCity) return false;
      if (regionFilter !== 'ALL' && item.district.region !== regionFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.district.name.toLowerCase().includes(q) ||
        item.district.id.toLowerCase().includes(q) ||
        item.district.region.toLowerCase().includes(q) ||
        item.district.cao.toLowerCase().includes(q) ||
        (item.activeOfficer && item.activeOfficer.name.toLowerCase().includes(q)) ||
        (item.pendingInvite && item.pendingInvite.name.toLowerCase().includes(q))
      );
    });
  }, [caoTelemetry, caoStatusFilter, cityArrangementFilter, regionFilter, searchQuery]);

  // Filtered Sister PSs
  const filteredSisterPs = useMemo(() => {
    return sisterPsTelemetry.filter((item) => {
      if (psStatusFilter !== 'all' && item.status !== psStatusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.ministry.title.toLowerCase().includes(q) ||
        item.ministry.mandate.toLowerCase().includes(q) ||
        item.ministry.sector.toLowerCase().includes(q) ||
        (item.activeOfficer && item.activeOfficer.name.toLowerCase().includes(q)) ||
        (item.pendingInvite && item.pendingInvite.name.toLowerCase().includes(q))
      );
    });
  }, [sisterPsTelemetry, psStatusFilter, searchQuery]);

  // Live Counts for Countrywide Tier 3
  const totalTier3Count = districtNodesList.length; // 157
  const totalCitiesCount = districtNodesList.filter((d) => d.isCity).length; // 11
  const totalDistrictsCount = districtNodesList.filter((d) => !d.isCity).length; // 146

  const activeCaoCount = caoTelemetry.filter((c) => c.status === 'operational').length;
  const pendingCaoCount = caoTelemetry.filter((c) => c.status === 'pending').length;
  const vacantCaoCount = caoTelemetry.filter((c) => c.status === 'vacant').length;

  const vacantCitiesCount = caoTelemetry.filter((c) => c.status === 'vacant' && c.district.isCity).length;
  const vacantDistrictsCount = caoTelemetry.filter((c) => c.status === 'vacant' && !c.district.isCity).length;

  const activePsCount = sisterPsTelemetry.filter((p) => p.status === 'operational').length;
  const pendingPsCount = sisterPsTelemetry.filter((p) => p.status === 'pending').length;
  const vacantPsCount = sisterPsTelemetry.filter((p) => p.status === 'vacant').length;

  // Open Individual Manual Invite Modal
  const handleOpenIndividualInvite = (
    stationId: string,
    stationName: string,
    defaultTitle: string,
    defaultRole: RoleType = 'node_admin',
    isSisterMinistry: boolean = false,
    deptId?: string,
    mandate?: string
  ) => {
    setInviteModal({
      open: true,
      stationId,
      stationName,
      defaultTitle,
      defaultRole,
      isSisterMinistry,
      deptId,
      mandate,
    });
    // Strictly manual typing - NO prefilled dummy names
    setOfficerName('');
    setOfficerTitle(defaultTitle);
    setOfficerPhone('');
    setOfficerRole(defaultRole);
  };

  // Submit Individual Manual Invite
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

    const cleanDept = inviteModal.deptId || user?.dept || 'molg';
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const code = inviteModal.isSisterMinistry
      ? `PS-${cleanDept.toUpperCase()}-${randomHex}`
      : `UG-CAO-${inviteModal.stationName.replace(/\W/g, '').slice(0, 6).toUpperCase()}-${randomHex}`;

    const newInvite: Invite = {
      code,
      name: officerName.trim(),
      title: officerTitle.trim(),
      role: officerRole,
      scope: inviteModal.stationId,
      dept: cleanDept,
      is_utility: false,
      used: false,
      country: activeCountry,
      duty_station: inviteModal.stationName,
      contact_phone: officerPhone.trim() || undefined,
      invited_by: 'Permanent Secretary, Ministry of Local Government (PS MoLG)',
      invited_at: new Date().toISOString(),
      hierarchy_level: inviteModal.isSisterMinistry ? 'tier5_perm_sec' : 'tier3_district_cao',
      escalation_rank: inviteModal.isSisterMinistry ? 5 : 3,
    };

    // 1. Dispatch statutory invite (station-specific)
    addInvite(newInvite);

    // 2. Mint single-use access code on sovereign gateway
    mintGovAccessCode(code, {
      country: activeCountry,
      dept: cleanDept,
      scope: inviteModal.stationId,
      role: officerRole,
      is_utility: false,
      role_label: `${officerTitle.trim()} (${inviteModal.stationName})`,
      real_title_short: officerTitle.trim(),
      officer_name: officerName.trim(),
      hierarchy_level: inviteModal.isSisterMinistry ? 'tier5_perm_sec' : 'tier3_district_cao',
      escalation_rank: inviteModal.isSisterMinistry ? 5 : 3,
    });

    logAudit(
      'official_invite_issued',
      inviteModal.stationId,
      `PS MoLG issued statutory appointment key ${code} to ${officerName.trim()} as ${officerTitle.trim()}`,
      activeCountry
    );

    // 3. Inviter only gets notification of active or pending
    toast(
      `✓ Statutory invite sent immediately to ${officerName.trim()} for ${inviteModal.stationName}! Status: PENDING acceptance.`,
      'amber'
    );

    // Modal disappears once sent!
    setInviteModal(null);
  };

  // Enlist officer into active
  const handleAcceptInvite = (inviteCode: string, officerNameStr: string, stationNameStr: string) => {
    const enlisted = acceptInvite(inviteCode);
    if (enlisted) {
      logAudit(
        'invite_enlisted_active',
        inviteCode,
        `${officerNameStr} statutory appointment validated for ${stationNameStr}`,
        activeCountry
      );
      toast(`✓ ${officerNameStr} accepted statutory appointment for ${stationNameStr}! Enlisted into ACTIVE section.`, 'emerald');
    }
  };

  // Revoke invite
  const handleRevokeInvite = (inviteCode: string, stationNameStr: string) => {
    revokeInvite(inviteCode);
    logAudit(
      'invite_revoked',
      inviteCode,
      `PS MoLG revoked single-use credential for ${stationNameStr}`,
      activeCountry
    );
    toast(`Invite revoked for ${stationNameStr}. Station returned to VACANT.`, 'amber');
  };

  // Launch Batch Dispatch Modal
  const handleOpenBatchModal = (type: 'caos' | 'sister_ps' | 'all') => {
    setBatchTargetType(type);
    setBatchManifest(null);
    if (type === 'sister_ps') {
      setSelectedBatchStationIds(
        sisterPsTelemetry.filter((p) => p.status === 'vacant').map((p) => p.ministry.id)
      );
    } else if (type === 'caos') {
      setSelectedBatchStationIds(
        caoTelemetry
          .filter((c) => c.status === 'vacant' && (regionFilter === 'ALL' || c.district.region === regionFilter))
          .map((c) => c.district.id)
      );
    } else {
      const vacantCaos = caoTelemetry.filter((c) => c.status === 'vacant').map((c) => c.district.id);
      const vacantPs = sisterPsTelemetry.filter((p) => p.status === 'vacant').map((p) => p.ministry.id);
      setSelectedBatchStationIds([...vacantCaos, ...vacantPs]);
    }
    setBatchModalOpen(true);
  };

  // Execute Batch Dispatch
  const handleExecuteBatchDispatch = () => {
    if (selectedBatchStationIds.length === 0) {
      toast('Please select at least one station to dispatch credentials', 'amber');
      return;
    }

    const manifestItems: {
      type: 'CAO' | 'SISTER_PS';
      name: string;
      title: string;
      station: string;
      code: string;
      loginUrl: string;
    }[] = [];

    selectedBatchStationIds.forEach((stationId) => {
      // Check if it's a Sister Ministry
      const sisterNode = sisterMinistriesList.find((m) => m.id === stationId);
      if (sisterNode) {
        const randomHex = Math.floor(1000 + Math.random() * 9000);
        const code = `PS-${sisterNode.deptId.toUpperCase().slice(0, 6)}-${randomHex}`;
        
        addInvite({
          code,
          name: sisterNode.permSecretary || `${sisterNode.title} Desk`,
          title: sisterNode.title,
          role: 'node_admin',
          scope: sisterNode.id,
          dept: sisterNode.deptId,
          is_utility: false,
          used: false,
          country: activeCountry,
          duty_station: sisterNode.title,
          invited_by: 'Permanent Secretary, Ministry of Local Government (PS MoLG)',
          invited_at: new Date().toISOString(),
          hierarchy_level: 'tier5_perm_sec',
          escalation_rank: 5,
        });

        mintGovAccessCode(code, {
          country: activeCountry,
          dept: sisterNode.deptId,
          scope: sisterNode.id,
          role: 'node_admin',
          is_utility: false,
          role_label: sisterNode.title,
          real_title_short: sisterNode.title.split('(')[0].trim(),
          officer_name: sisterNode.permSecretary,
          hierarchy_level: 'tier5_perm_sec',
          escalation_rank: 5,
        });

        manifestItems.push({
          type: 'SISTER_PS',
          name: sisterNode.permSecretary,
          title: sisterNode.title,
          station: sisterNode.title,
          code,
          loginUrl: `${window.location.origin}${window.location.pathname}?gov_code=${code}`,
        });
      }

      // Check if it's a CAO or City Town Clerk
      const districtNode = districtNodesList.find((d) => d.id === stationId);
      if (districtNode) {
        const randomHex = Math.floor(1000 + Math.random() * 9000);
        const prefix = districtNode.isCity ? 'UG-CITY' : 'UG-CAO';
        const code = `${prefix}-${districtNode.name.replace(/\W/g, '').slice(0, 6).toUpperCase()}-${randomHex}`;
        const officerRaw = districtNode.cao.split('(')[0].trim() || (districtNode.isCity ? 'City Town Clerk' : 'Chief Administrative Officer');
        const officerTitleStr = districtNode.isCity
          ? `City Town Clerk, ${districtNode.name}`
          : `Chief Administrative Officer (CAO), ${districtNode.name}`;
        const dutyStationStr = districtNode.isCity
          ? `${districtNode.name} City Hall`
          : `${districtNode.name} District Headquarters`;

        addInvite({
          code,
          name: officerRaw,
          title: officerTitleStr,
          role: 'node_admin',
          scope: districtNode.id,
          dept: 'molg',
          is_utility: false,
          used: false,
          country: activeCountry,
          duty_station: dutyStationStr,
          invited_by: 'Permanent Secretary, Ministry of Local Government (PS MoLG)',
          invited_at: new Date().toISOString(),
          hierarchy_level: 'tier3_district_cao',
          escalation_rank: 3,
        });

        mintGovAccessCode(code, {
          country: activeCountry,
          dept: 'molg',
          scope: districtNode.id,
          role: 'node_admin',
          is_utility: false,
          role_label: officerTitleStr,
          real_title_short: districtNode.isCity ? 'City Town Clerk' : 'CAO',
          officer_name: officerRaw,
          hierarchy_level: 'tier3_district_cao',
          escalation_rank: 3,
        });

        manifestItems.push({
          type: 'CAO',
          name: officerRaw,
          title: officerTitleStr,
          station: districtNode.name,
          code,
          loginUrl: `${window.location.origin}${window.location.pathname}?gov_code=${code}`,
        });
      }
    });

    logAudit(
      'batch_dispatch_issued',
      'national_gateway',
      `PS MoLG executed sovereign batch dispatch for ${manifestItems.length} accounting officers`,
      activeCountry
    );

    setBatchManifest({
      timestamp: new Date().toISOString(),
      items: manifestItems,
    });

    toast(
      `✓ Batch dispatched ${manifestItems.length} statutory credentials immediately! Status: PENDING acceptance.`,
      'emerald'
    );
  };

  return (
    <div id="ps-supervision-structure" className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 rounded-3xl p-5 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-600/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <Building2 size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Tier 5 — Apex National Accounting Authority
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                PS MoLG National Command Desk
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Permanent Secretary (MoLG) Statutory Supervision &amp; Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
              Under Article 174 of the 1995 Constitution and Section 64 of the Local Governments Act (Cap. 243), the Permanent Secretary directly supervises all Sister Ministry Permanent Secretaries and all 135+ Chief Administrative Officers (CAOs) countrywide.
            </p>
          </div>
        </div>

        {/* Global Batch Dispatch Button & Counters */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => handleOpenBatchModal('all')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <Zap size={14} />
            <span>⚡ National Batch Dispatch</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('caos')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'caos'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building2 size={14} />
          <span>Chief Administrative Officers (CAOs) &amp; Cities ({districtNodesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sister_ps')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'sister_ps'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users size={14} />
          <span>Sister Permanent Secretaries ({sisterMinistriesList.length})</span>
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
          <span>Executive Tier Analytics &amp; Cross-Tier Telemetry</span>
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
          <span>National SLA &amp; Statutory Audit Compliance</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CHIEF ADMINISTRATIVE OFFICERS (CAOs) COUNTRYWIDE                   */}
      {/* ========================================================================= */}
      {activeTab === 'caos' && (
        <div className="space-y-4">
          {/* Top Filter and Provision for City Arrangements */}
          <div className="flex flex-col gap-3">
            {/* Row 1: City Arrangements Toggle & Summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-black px-1">
                  Jurisdiction Scope:
                </span>
                <button
                  type="button"
                  onClick={() => setCityArrangementFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    cityArrangementFilter === 'all'
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Accounting Officers ({totalTier3Count})
                </button>
                <button
                  type="button"
                  onClick={() => setCityArrangementFilter('districts_only')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    cityArrangementFilter === 'districts_only'
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  District CAOs ({totalDistrictsCount})
                </button>
                <button
                  type="button"
                  onClick={() => setCityArrangementFilter('cities_only')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                    cityArrangementFilter === 'cities_only'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>Strategic Cities ({totalCitiesCount})</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-950/40 text-emerald-200 rounded font-mono font-bold">10 Cities + KCCA</span>
                </button>
              </div>

              <div className="text-[10.5px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1">
                Showing <strong className="text-teal-700 dark:text-teal-400">{filteredCaos.length}</strong> of {totalTier3Count} stations countrywide
              </div>
            </div>

            {/* Row 2: Status Filter Tabs, Region Filter & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setCaoStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    caoStatusFilter === 'all'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({districtNodesList.length})
                </button>
                <button
                  onClick={() => setCaoStatusFilter('operational')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    caoStatusFilter === 'operational'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Active ({activeCaoCount})
                </button>
                <button
                  onClick={() => setCaoStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    caoStatusFilter === 'pending'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Pending ({pendingCaoCount})
                </button>
                <button
                  onClick={() => setCaoStatusFilter('vacant')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    caoStatusFilter === 'vacant'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Vacant ({vacantCaoCount})
                </button>
              </div>

              {/* Region Filter and Search Bar */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-1 max-w-2xl">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
                  <span className="text-slate-400 px-1">Region:</span>
                  {(['ALL', 'NORTHERN', 'CENTRAL', 'EASTERN', 'WESTERN'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRegionFilter(r)}
                      className={`px-2 py-1 rounded-lg transition-all ${
                        regionFilter === r
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter district, city or CAO name..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBatchModal('caos')}
                  className="px-2.5 py-1.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 flex items-center gap-1 shrink-0"
                >
                  <Zap size={13} />
                  <span>Batch Gateway ({totalTier3Count})</span>
                </button>
              </div>
            </div>
          </div>

          {/* CAO Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCaos.map(({ district, defaultCode, activeOfficer, pendingInvite, status }) => (
              <div
                key={district.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  status === 'operational'
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : status === 'pending'
                    ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/40 border-dashed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {district.name}
                      </span>
                      <span className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded font-black tracking-wider uppercase border ${
                        district.isCity
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}>
                        {district.isCity ? '🏙️ City' : 'District'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] mono font-bold bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded">
                        {district.region}
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
                  </div>

                  {/* Officer Info Display */}
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
                        {district.isCity ? `City Town Clerk / Accounting Officer (${district.name})` : `Chief Administrative Officer (CAO), ${district.name}`} unassigned.
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
                    <span>{district.isCity ? '🏙️' : '🏛️'} {district.pdmParishes} {district.isCity ? 'Wards' : 'Parishes'}</span>
                    <span>⏱️ {district.sla} Resolution</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                  {status === 'vacant' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenIndividualInvite(
                          district.id,
                          district.name,
                          district.isCity ? `City Town Clerk, ${district.name}` : `Chief Administrative Officer (CAO), ${district.name}`,
                          'node_admin',
                          false
                        )
                      }
                      className="flex-1 py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <UserPlus size={13} />
                      <span>{district.isCity ? 'Invite City Town Clerk' : 'Invite CAO'}</span>
                    </button>
                  )}

                  {status === 'pending' && pendingInvite && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAcceptInvite(pendingInvite.code, pendingInvite.name, district.name)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                        title="Confirm Statutory Acceptance"
                      >
                        <CheckCircle2 size={13} />
                        <span>Enlist Active</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const memo = `🏛️ STATUTORY CAO APPOINTMENT & TRANSMITTAL MEMO\nStation: ${district.name} District Local Government\nAppointee: ${pendingInvite.name}\nDesignation: ${pendingInvite.title}\nSingle-Use Sovereign Key: ${pendingInvite.code}\nAuthority: Section 64, Local Governments Act (Cap. 243)\nGateway: ${window.location.origin}${window.location.pathname}?gov_code=${pendingInvite.code}`;
                          navigator.clipboard.writeText(memo);
                          toast(`Copied dispatch memo for ${district.name}!`, 'emerald');
                        }}
                        className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
                        title="Copy Transmittal Memo"
                      >
                        <FileText size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRevokeInvite(pendingInvite.code, district.name)}
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
                          unitName: district.name,
                          unitOfficer: activeOfficer.name,
                          unitTitle: activeOfficer.title,
                          unitScope: district.id,
                          slaScore: district.sla,
                          backlog: 2,
                          hours: district.avgResponseHours,
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

      {/* ========================================================================= */}
      {/* TAB 2: SISTER PERMANENT SECRETARIES (INTER-MINISTERIAL COUNCIL)           */}
      {/* ========================================================================= */}
      {activeTab === 'sister_ps' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setPsStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  psStatusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({sisterMinistriesList.length})
              </button>
              <button
                onClick={() => setPsStatusFilter('operational')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  psStatusFilter === 'operational'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Active ({activePsCount})
              </button>
              <button
                onClick={() => setPsStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  psStatusFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pending ({pendingPsCount})
              </button>
              <button
                onClick={() => setPsStatusFilter('vacant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  psStatusFilter === 'vacant'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Vacant ({vacantPsCount})
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenBatchModal('sister_ps')}
              className="px-3 py-1.5 rounded-xl border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold hover:bg-teal-100 flex items-center gap-1 shrink-0"
            >
              <Zap size={13} />
              <span>Batch Mint Sister PSs</span>
            </button>
          </div>

          {/* Sister PS Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSisterPs.map(({ ministry, activeOfficer, pendingInvite, status }) => (
              <div
                key={ministry.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
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
                      {ministry.title}
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
                      {status === 'operational' ? 'Active Live' : status === 'pending' ? 'Pending Acceptance' : 'Vacant Desk'}
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
                        Sister Ministry desk not yet commissioned on gateway.
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 mb-3">{ministry.mandate}</p>
                </div>

                <div className="flex items-center gap-2 pt-2.5 border-t border-slate-200 dark:border-slate-800">
                  {status === 'vacant' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenIndividualInvite(
                          ministry.id,
                          ministry.title,
                          `Permanent Secretary, ${ministry.title}`,
                          'node_admin',
                          true,
                          ministry.deptId,
                          ministry.mandate
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
                        onClick={() => handleAcceptInvite(pendingInvite.code, pendingInvite.name, ministry.title)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                      >
                        <CheckCircle2 size={13} />
                        <span>Enlist Active</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const memo = `🏛️ STATUTORY CABINET TRANSMITTAL MEMO\nOffice: Permanent Secretary, Ministry of Local Government\nTo: ${pendingInvite.name} (${pendingInvite.title})\nSingle-Use Sovereign Key: ${pendingInvite.code}\nMandate: Inter-Agency Cabinet Delivery Coordination\nGateway: ${window.location.origin}${window.location.pathname}?gov_code=${pendingInvite.code}`;
                          navigator.clipboard.writeText(memo);
                          toast(`Copied dispatch memo for ${ministry.title}!`, 'emerald');
                        }}
                        className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100"
                        title="Copy Transmittal Memo"
                      >
                        <FileText size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRevokeInvite(pendingInvite.code, ministry.title)}
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
                          unitName: ministry.title,
                          unitOfficer: activeOfficer.name,
                          unitTitle: activeOfficer.title,
                          unitScope: ministry.id,
                          slaScore: ministry.slaScore,
                          backlog: 1,
                          hours: ministry.macroSpeedHours,
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

      {/* ========================================================================= */}
      {/* TAB 3: EXECUTIVE TIER ANALYTICS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="pt-2">
          <ExecutiveTierAnalytics
            initialCountry={activeCountry}
            initialTier={5}
            initialScope="UG"
            compact={true}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: NATIONAL SLA & AUDIT COMPLIANCE                                     */}
      {/* ========================================================================= */}
      {activeTab === 'sla' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-teal-100 dark:border-teal-900/40 bg-teal-50/50 dark:bg-teal-950/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              National Local Gov SLA Resolution
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              92.8%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Average across all 135+ Local Governments: 28.4 hours response time.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              DDEG Fiscal Compliance
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              98.2% Compliant
            </div>
            <p className="text-xs text-slate-500 mt-1">
              PFMA Section 45 Treasury Single Account reconciliation rating across all districts.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Auditor General Readiness
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Full SHA-256 Crypto Chain Active
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time audit logs ready for Supreme Audit Institution &amp; IGG subpoena stamping.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BATCH DISPATCH MODAL                                                      */}
      {/* ========================================================================= */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                  <Zap size={20} />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>National Sovereign Batch Dispatch Gateway</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono font-bold border border-teal-300 dark:border-teal-700">
                      {totalTier3Count} Accounting Officers Countrywide
                    </span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Article 174 &amp; 188 Constitutional Gateway · {totalDistrictsCount} District CAOs + {totalCitiesCount} Strategic Cities/Metropolitan Authorities
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBatchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {!batchManifest ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-900 dark:text-teal-300">
                  <p>
                    <strong>Batch Dispatch Protocol:</strong> Dispatches sovereign credentials in bulk to all selected vacant stations. Single-use keys are minted immediately on the gateway and stations enter <strong>PENDING</strong> status until accepted by each officer.
                  </p>
                </div>

                {/* Batch Preset Shortcuts */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchStationIds(
                        sisterPsTelemetry.filter((p) => p.status === 'vacant').map((p) => p.ministry.id)
                      );
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 text-slate-700 dark:text-slate-300"
                  >
                    Select All Vacant Sister PSs ({vacantPsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchStationIds(
                        caoTelemetry.filter((c) => c.status === 'vacant' && c.district.isCity).map((c) => c.district.id)
                      );
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                  >
                    Select All Vacant Cities ({vacantCitiesCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchStationIds(
                        caoTelemetry.filter((c) => c.status === 'vacant' && !c.district.isCity).map((c) => c.district.id)
                      );
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 text-slate-700 dark:text-slate-300"
                  >
                    Select All Vacant District CAOs ({vacantDistrictsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchStationIds(
                        caoTelemetry.filter((c) => c.status === 'vacant').map((c) => c.district.id)
                      );
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-teal-100 dark:bg-teal-900/60 hover:bg-teal-200 text-teal-900 dark:text-teal-200"
                  >
                    All Vacant Tier 3 ({vacantCaoCount} Stations)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchStationIds(
                        caoTelemetry.filter((c) => c.status === 'vacant' && c.district.region === 'NORTHERN').map((c) => c.district.id)
                      );
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 text-slate-700 dark:text-slate-300"
                  >
                    Northern CAOs &amp; Cities
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchStationIds(
                        caoTelemetry.filter((c) => c.status === 'vacant' && c.district.region === 'CENTRAL').map((c) => c.district.id)
                      );
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 text-slate-700 dark:text-slate-300"
                  >
                    Central CAOs &amp; Cities
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchStationIds(
                        caoTelemetry.filter((c) => c.status === 'vacant' && c.district.region === 'EASTERN').map((c) => c.district.id)
                      );
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 text-slate-700 dark:text-slate-300"
                  >
                    Eastern CAOs &amp; Cities
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBatchStationIds(
                        caoTelemetry.filter((c) => c.status === 'vacant' && c.district.region === 'WESTERN').map((c) => c.district.id)
                      );
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 text-slate-700 dark:text-slate-300"
                  >
                    Western CAOs &amp; Cities
                  </button>
                </div>

                {/* Stations Selection List */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 max-h-60 overflow-y-auto space-y-1.5">
                  <div className="text-[11px] font-bold uppercase text-slate-500 mb-1 flex items-center justify-between">
                    <span>Vacant Stations Selected ({selectedBatchStationIds.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        const allVacant = [
                          ...sisterPsTelemetry.filter((p) => p.status === 'vacant').map((p) => p.ministry.id),
                          ...caoTelemetry.filter((c) => c.status === 'vacant').map((c) => c.district.id),
                        ];
                        if (selectedBatchStationIds.length === allVacant.length) {
                          setSelectedBatchStationIds([]);
                        } else {
                          setSelectedBatchStationIds(allVacant);
                        }
                      }}
                      className="text-teal-600 dark:text-teal-400 lowercase font-mono"
                    >
                      toggle all
                    </button>
                  </div>

                  {/* Sister Ministries */}
                  {sisterPsTelemetry
                    .filter((p) => p.status === 'vacant')
                    .map(({ ministry }) => {
                      const isChecked = selectedBatchStationIds.includes(ministry.id);
                      return (
                        <label
                          key={ministry.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedBatchStationIds((prev) =>
                                isChecked ? prev.filter((id) => id !== ministry.id) : [...prev, ministry.id]
                              );
                            }}
                            className="rounded text-teal-600"
                          />
                          <span className="text-[8.5px] px-1.5 py-0.2 rounded font-black mono uppercase bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300">
                            MINISTRY
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {ministry.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">({ministry.sector})</span>
                        </label>
                      );
                    })}

                  {/* CAOs & Cities */}
                  {caoTelemetry
                    .filter((c) => c.status === 'vacant')
                    .map(({ district }) => {
                      const isChecked = selectedBatchStationIds.includes(district.id);
                      return (
                        <label
                          key={district.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedBatchStationIds((prev) =>
                                isChecked ? prev.filter((id) => id !== district.id) : [...prev, district.id]
                              );
                            }}
                            className="rounded text-teal-600"
                          />
                          <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-black mono uppercase ${
                            district.isCity
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200'
                          }`}>
                            {district.isCity ? 'CITY' : 'DISTRICT'}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {district.isCity ? `City Town Clerk, ${district.name}` : `Chief Administrative Officer (CAO), ${district.name}`}
                          </span>
                          <span className="text-[10px] text-teal-600 font-mono">({district.region})</span>
                        </label>
                      );
                    })}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBatchModalOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleExecuteBatchDispatch}
                    disabled={selectedBatchStationIds.length === 0}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send size={13} />
                    <span>Dispatch Sovereign Batch ({selectedBatchStationIds.length})</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Batch Manifest Output */
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Official Gazette Manifest Dispatched
                    </span>
                    <span className="text-[10px] mono">{batchManifest.items.length} Credentials Active</span>
                  </div>
                  <p>
                    All single-use keys have been activated on the sovereign gateway. Transmit the credentials below through official ministry dispatch.
                  </p>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-[10px] font-bold uppercase text-slate-500">
                      <tr>
                        <th className="p-2">Station</th>
                        <th className="p-2">Appointee Designation</th>
                        <th className="p-2">Single-Use Code</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                      {batchManifest.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-2 font-sans font-bold text-slate-900 dark:text-white">
                            {item.station}
                          </td>
                          <td className="p-2 font-sans text-slate-600 dark:text-slate-300">
                            {item.title}
                          </td>
                          <td className="p-2 font-bold text-teal-600 dark:text-teal-400">
                            {item.code}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const memo = `🏛️ REPUBLIC OF UGANDA — MINISTRY OF LOCAL GOVERNMENT\nOFFICIAL BATCH TRANSMITTAL GAZETTE MANIFEST\nDate: ${new Date().toLocaleDateString()}\nAuthority: Article 174, 1995 Constitution\n\n${batchManifest.items
                        .map(
                          (it, i) =>
                            `${i + 1}. ${it.station} | ${it.title}\n   Access Key: ${it.code}\n   Gateway: ${it.loginUrl}`
                        )
                        .join('\n\n')}`;
                      navigator.clipboard.writeText(memo);
                      toast('✓ Official Batch Transmittal Gazette copied to clipboard!', 'emerald');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Copy size={13} />
                    <span>Copy All Dispatch Links &amp; Keys</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBatchModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INDIVIDUAL MANUAL INVITE MODAL (STRICTLY MANUAL TYPING — NO PREFILLS)     */}
      {/* ========================================================================= */}
      {inviteModal && inviteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    Issue Statutory Appointment (Manual Entry)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Station: {inviteModal.stationName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInviteModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendManualInvite} className="space-y-3.5">
              <div className="p-2.5 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 text-xs text-teal-800 dark:text-teal-300">
                <p>
                  <strong>Statutory Notice:</strong> Station-specific appointment happens once and is dispatched immediately. The station leaves Vacant and enters Pending. The inviter only receives status notifications of active or pending.
                </p>
              </div>

              {/* Station (Locked) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Designated Statutory Station (Locked)
                </label>
                <input
                  type="text"
                  disabled
                  value={`${inviteModal.stationName} (${inviteModal.isSisterMinistry ? 'Sister Ministry Permanent Secretary Desk' : 'Local Government Accounting Office'})`}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
                />
              </div>

              {/* Appointee Full Name (MANUAL INPUT - NO PREFILL) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Appointee Legal Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Patrick Mugabi (Type Substantive Officer Name)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Strictly manual input: enter legal substantive name of accounting officer.
                </span>
              </div>

              {/* 1-Click Direct Report Presets for PS MoLG */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] mono text-slate-500 uppercase tracking-wider font-bold">
                    1-Click Direct Report Presets (PS MoLG Mandate)
                  </span>
                  <span className="text-[9px] mono text-teal-600 dark:text-teal-400 font-bold">Station Specific</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'cao', label: 'Chief Administrative Officer (CAO)', title: `Chief Administrative Officer (CAO), ${inviteModal.stationName}`, role: 'node_admin' as RoleType },
                    { id: 'city_tc', label: 'City Town Clerk', title: `City Town Clerk, ${inviteModal.stationName}`, role: 'node_admin' as RoleType },
                    { id: 'sister_ps', label: 'Sister Permanent Secretary', title: inviteModal.defaultTitle, role: 'node_admin' as RoleType },
                    { id: 'others', label: '+ Others (specify)', title: '', role: 'node_admin' as RoleType },
                  ].map((preset) => {
                    const isSelected = preset.id === 'others'
                      ? officerTitle !== '' && !['Chief Administrative Officer (CAO)', 'City Town Clerk', inviteModal.defaultTitle].includes(officerTitle)
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

              {/* Designation / Title Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="ps-modal-title-input" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Official Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
                    National Accounting Desks
                  </span>
                </div>
                <input
                  ref={titleInputRef}
                  id="ps-modal-title-input"
                  type="text"
                  required
                  value={officerTitle}
                  onChange={(e) => setOfficerTitle(e.target.value)}
                  placeholder="e.g. Chief Administrative Officer (CAO), Gulu District Local Government"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Real-time custom title input active. Click preset or enter custom title directly.
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
                  className="px-3 py-2 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
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
