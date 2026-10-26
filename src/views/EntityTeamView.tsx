import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDept, copyToClipboard } from '../utils/helpers';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { EnterpriseBranch, BranchTeam, EntityCustomRole, EntityRolePermissions, RoleType, TeamMember } from '../types';
import {
  loadAllBranches,
  saveAllBranches,
  generateBranchAccessCode,
} from '../data/enterpriseBranches';
import {
  ROLE_COLORS,
  PERMISSION_DESCRIPTIONS,
  getColorDef,
  generateStaffDispatchText,
  getDefaultRolesForSector,
} from '../data/entityRoles';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Copy,
  Check,
  CheckCircle2,
  X,
  Share2,
  Plus,
  Edit2,
  Trash2,
  Receipt,
  MessageSquare,
  Megaphone,
  Phone,
  Briefcase,
  Layers,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Send,
  UserCheck,
  Store,
  Beer,
  Pill,
  Utensils,
  Wrench,
  GraduationCap,
  HeartPulse,
  Landmark,
  Bus,
  Zap,
} from 'lucide-react';

const SECTOR_ICONS: Record<string, any> = {
  retail_shops: Store,
  nightlife_bars: Beer,
  pharmacy_chemists: Pill,
  food_dining: Utensils,
  artisans_garages: Wrench,
  health: HeartPulse,
  education: GraduationCap,
  banking_finance: Landmark,
  transport_cooperative: Bus,
  private_utility_telecom: Zap,
  private_contractor: Building2,
  ngo_civil_society: Users,
  other: Layers,
};

export const EntityTeamView: React.FC = () => {
  const {
    user,
    teamMembers,
    invites,
    subscriptions,
    go,
    addInvite,
    standDownTeamMember,
    reinstateTeamMember,
    logAudit,
    toast,
    execGovLoginByData,
  } = useApp();

  // Active section tab in Entity Team view
  const [activeTab, setActiveTab] = useState<'staff' | 'branches' | 'invite' | 'roles' | 'pending' | 'audit'>('branches');

  // Enterprise Branch Network State
  const [branchesList, setBranchesList] = useState<EnterpriseBranch[]>(() => loadAllBranches());
  const [showCreateBranchModal, setShowCreateBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('kampala_c');
  const [selectedSubcountyId, setSelectedSubcountyId] = useState('nakawa');
  const [selectedParishName, setSelectedParishName] = useState('Bugolobi');
  const [newBranchLandmark, setNewBranchLandmark] = useState('');
  const [newBranchManagerName, setNewBranchManagerName] = useState('');
  const [newBranchManagerPhone, setNewBranchManagerPhone] = useState('');
  const [newBranchSlaHours, setNewBranchSlaHours] = useState(12);

  // Sub-team creation state inside branch
  const [activeBranchForTeam, setActiveBranchForTeam] = useState<string | null>(null);
  const [newSubTeamName, setNewSubTeamName] = useState('');
  const [newSubTeamLead, setNewSubTeamLead] = useState('');
  const [newSubTeamCategory, setNewSubTeamCategory] = useState<'operations' | 'service' | 'technical' | 'logistics' | 'management'>('operations');
  const [newSubTeamMembers, setNewSubTeamMembers] = useState(5);

  // Staff Invitation form state
  const [inviteStaffName, setInviteStaffName] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [inviteDutyStation, setInviteDutyStation] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [issuedCodeData, setIssuedCodeData] = useState<{
    code: string;
    staffName: string;
    roleTitle: string;
    dutyStation?: string;
    phone?: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Custom Role Creation Modal / State
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('purple');
  const [newRolePerms, setNewRolePerms] = useState<EntityRolePermissions>({
    can_reply: true,
    can_resolve: true,
    can_broadcast: false,
    can_view_billing: false,
    can_manage_staff: false,
  });

  // Local storage / memory for custom entity roles
  const deptId = user?.dept || 'ent-general';
  const sector = user?.entity_category || 'other';

  const [entityRoles, setEntityRoles] = useState<EntityCustomRole[]>(() => {
    try {
      const saved = localStorage.getItem(`cd_entity_roles_${deptId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return getDefaultRolesForSector(deptId, sector);
  });

  const saveRolesToStorage = (roles: EntityCustomRole[]) => {
    setEntityRoles(roles);
    try {
      localStorage.setItem(`cd_entity_roles_${deptId}`, JSON.stringify(roles));
    } catch {}
  };

  // Stand-down dialog
  const [standDownTarget, setStandDownTarget] = useState<{ id: string; name: string; reason: string; note: string } | null>(null);

  useEffect(() => {
    if (!user) {
      go('gov_inbox');
    }
  }, [user, go]);

  if (!user) {
    return null;
  }

  const orgName = user.organization_name || user.dept_label || 'Service Provider Desk';
  const profTitle = user.custom_title_specify || user.professional_identity || user.real_title_short || 'Entity Admin';
  const mySub = subscriptions.find((s) => s.dept === user.dept);
  const isPaidTier = user.scope !== 'parish' || Boolean(mySub && mySub.units > 1);
  const seatLimit = isPaidTier ? 9999 : 2;

  const myTeam = teamMembers.filter((m) => m.dept === user.dept);
  const myInvites = invites.filter((i) => !i.used && i.dept === user.dept);
  const totalOccupiedSeats = myTeam.length + myInvites.length;
  const availableSeats = isPaidTier ? 9999 : Math.max(0, seatLimit - totalOccupiedSeats);

  const SectorIcon = SECTOR_ICONS[user.entity_category || 'other'] || Building2;

  const normDept = (user.dept || 'kfc_ug').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const myBranches = branchesList.filter((b) => {
    const bNorm = b.deptId.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return (
      bNorm === normDept ||
      bNorm.includes(normDept) ||
      normDept.includes(bNorm) ||
      user.is_superadmin ||
      user.role === 'platform_admin' ||
      !user.dept
    );
  });

  const countryTerritories = (TERRITORY as any)[user.country || 'UG'] || [];
  const selectedDistrictNode = countryTerritories.find((d: any) => d.id === selectedDistrictId) || countryTerritories[0];
  const subcountyNodes = selectedDistrictNode?.children || [];
  const selectedSubcountyNode = subcountyNodes.find((s: any) => s.id === selectedSubcountyId) || subcountyNodes[0];
  const parishNodes = selectedSubcountyNode?.children || [];

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      toast('Please enter a branch name', 'amber');
      return;
    }
    const districtName = selectedDistrictNode?.name || 'Central District';
    const subcountyName = selectedSubcountyNode?.name || 'Urban Division';
    const parishName = selectedParishName || parishNodes[0]?.name || 'Central Parish';

    const cleanBrand = orgName.split('·')[0].split('(')[0].trim() || 'Enterprise';
    const accessCode = generateBranchAccessCode(cleanBrand, newBranchName);
    const branchId = `br-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const defaultTeams: BranchTeam[] = [
      { id: `t-${Date.now()}-1`, name: 'Front Desk & Guest Care', lead: newBranchManagerName || 'Branch Team Lead', category: 'service', memberCount: 6 },
      { id: `t-${Date.now()}-2`, name: 'Operations & Production Crew', lead: 'Operations Lead', category: 'operations', memberCount: 8 },
      { id: `t-${Date.now()}-3`, name: 'Logistics & Dispatch Fleet', lead: 'Fleet Dispatcher', category: 'logistics', memberCount: 5 },
    ];

    const newBranch: EnterpriseBranch = {
      id: branchId,
      deptId: user.dept || 'kfc_ug',
      brandName: cleanBrand,
      name: newBranchName.trim(),
      country: user.country || 'UG',
      district: districtName,
      subcounty: subcountyName,
      parish: parishName,
      landmark: newBranchLandmark.trim() || undefined,
      accessCode,
      managerName: newBranchManagerName.trim() || undefined,
      managerPhone: newBranchManagerPhone.trim() || undefined,
      slaHours: newBranchSlaHours,
      status: 'active',
      teams: defaultTeams,
      openTicketsCount: 0,
      resolvedTicketsCount: 0,
      ratingScore: 98,
      created_at: new Date().toISOString(),
    };

    const updated = [newBranch, ...branchesList];
    setBranchesList(updated);
    saveAllBranches(updated);

    logAudit(
      'provision_branch',
      '—',
      `Central Superadmin provisioned branch [${newBranchName.trim()}] in ${parishName}, ${subcountyName}, ${districtName} — Master Access Code [${accessCode}]`
    );

    toast(`Provisioned branch: ${newBranchName} (${parishName}) — Code: ${accessCode}`, 'emerald');
    setShowCreateBranchModal(false);
    setNewBranchName('');
    setNewBranchLandmark('');
    setNewBranchManagerName('');
    setNewBranchManagerPhone('');
  };

  const handleAddSubTeam = (branchId: string) => {
    if (!newSubTeamName.trim()) {
      toast('Enter a sub-team name', 'amber');
      return;
    }
    const updated = branchesList.map((b) => {
      if (b.id !== branchId) return b;
      const newTeam: BranchTeam = {
        id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: newSubTeamName.trim(),
        lead: newSubTeamLead.trim() || 'Team Lead',
        category: newSubTeamCategory,
        memberCount: newSubTeamMembers || 4,
      };
      return { ...b, teams: [...(b.teams || []), newTeam] };
    });
    setBranchesList(updated);
    saveAllBranches(updated);
    logAudit('add_branch_team', '—', `Added team [${newSubTeamName}] to branch ${branchId}`);
    toast(`Sub-team added: ${newSubTeamName}`, 'emerald');
    setActiveBranchForTeam(null);
    setNewSubTeamName('');
    setNewSubTeamLead('');
  };

  const handleRemoveSubTeam = (branchId: string, teamId: string) => {
    const updated = branchesList.map((b) => {
      if (b.id !== branchId) return b;
      return { ...b, teams: (b.teams || []).filter((t) => t.id !== teamId) };
    });
    setBranchesList(updated);
    saveAllBranches(updated);
    toast('Sub-team removed from branch', 'amber');
  };

  const handleMountBranch = (branch: EnterpriseBranch) => {
    const branchSession = {
      country: branch.country,
      dept: branch.deptId,
      scope: branch.accessCode.toLowerCase(),
      role: 'node_admin' as const,
      is_admin: true,
      is_superadmin: false,
      role_label: `Branch Manager · ${branch.name}`,
      organization_name: `${branch.brandName} (${branch.name})`,
      officer_name: branch.managerName || 'Branch Manager',
      branch_id: branch.id,
      branch_name: branch.name,
      branch_district: branch.district,
      branch_subcounty: branch.subcounty,
      branch_parish: branch.parish,
      entity_type: 'non_government_entity' as const,
      is_utility: true,
      duty_station: `${branch.parish}, ${branch.district}`,
      contact_phone: branch.managerPhone,
    };
    execGovLoginByData(branchSession);
    toast(`Mounted Branch Desk: ${branch.name} (${branch.parish})`, 'emerald');
    go('gov_inbox');
  };

  // Handle Save / Update Custom Role
  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) {
      toast('Please enter a role title', 'amber');
      return;
    }

    if (editingRoleId) {
      const updated = entityRoles.map((r) =>
        r.id === editingRoleId
          ? {
              ...r,
              title: newRoleTitle.trim(),
              description: newRoleDesc.trim() || 'Custom entity operational role',
              color: newRoleColor,
              permissions: newRolePerms,
            }
          : r
      );
      saveRolesToStorage(updated);
      toast(`Role "${newRoleTitle.trim()}" updated`, 'emerald');
      logAudit('update_entity_role', '—', `Updated role: ${newRoleTitle.trim()}`);
    } else {
      const newRole: EntityCustomRole = {
        id: `role-${deptId}-${Date.now().toString().slice(-4)}`,
        dept: deptId,
        title: newRoleTitle.trim(),
        description: newRoleDesc.trim() || 'Custom entity operational role',
        color: newRoleColor,
        permissions: newRolePerms,
        is_custom: true,
        created_at: new Date().toISOString(),
      };
      const updated = [...entityRoles, newRole];
      saveRolesToStorage(updated);
      setSelectedRoleId(newRole.id);
      toast(`Custom role "${newRoleTitle.trim()}" created`, 'emerald');
      logAudit('create_entity_role', '—', `Created custom role: ${newRoleTitle.trim()}`);
    }

    setShowCreateRoleModal(false);
    setEditingRoleId(null);
    setNewRoleTitle('');
    setNewRoleDesc('');
  };

  const handleOpenEditRole = (role: EntityCustomRole) => {
    setEditingRoleId(role.id);
    setNewRoleTitle(role.title);
    setNewRoleDesc(role.description);
    setNewRoleColor(role.color);
    setNewRolePerms(role.permissions);
    setShowCreateRoleModal(true);
  };

  const handleDeleteRole = (roleId: string, roleTitle: string) => {
    const assignedCount = myTeam.filter((m) => m.assigned_role_id === roleId).length;
    if (assignedCount > 0) {
      toast(`Cannot delete "${roleTitle}": ${assignedCount} staff member(s) currently assigned.`, 'amber');
      return;
    }
    const updated = entityRoles.filter((r) => r.id !== roleId);
    saveRolesToStorage(updated);
    if (selectedRoleId === roleId) setSelectedRoleId('');
    toast(`Role "${roleTitle}" deleted`, 'amber');
    logAudit('delete_entity_role', '—', `Deleted role: ${roleTitle}`);
  };

  const handleResetDefaultRoles = () => {
    const defaults = getDefaultRolesForSector(deptId, sector);
    saveRolesToStorage(defaults);
    toast('Restored sector recommended role presets', 'emerald');
  };

  // Handle Issuing Staff Invite
  const handleIssueStaffInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteStaffName.trim()) {
      toast('Please enter staff member’s full name', 'red');
      return;
    }
    if (!selectedRoleId) {
      toast('Please assign a specific role to the staff member', 'red');
      return;
    }
    if (totalOccupiedSeats >= seatLimit) {
      toast(`Seat limit reached (${seatLimit} seats). Please upgrade subscription to add more staff.`, 'amber');
      return;
    }

    const assignedRole = entityRoles.find((r) => r.id === selectedRoleId);
    const roleTitle = assignedRole?.title || 'Staff Officer';

    const cleanPrefix = orgName.replace(/\W/g, '').slice(0, 6).toUpperCase() || 'STF';
    const code = `STAFF-${cleanPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvite = {
      code,
      name: inviteStaffName.trim(),
      title: roleTitle,
      role: 'spokesperson' as RoleType,
      scope: user.scope || user.country,
      dept: user.dept || 'ent-general',
      is_utility: true,
      used: false,
      country: user.country,
      professional_identity: `${roleTitle} (${orgName})`,
      staff_role: roleTitle,
      custom_title_specify: roleTitle,
      assigned_role_id: assignedRole?.id,
      assigned_role_title: roleTitle,
      duty_station: inviteDutyStation.trim() || undefined,
      contact_phone: invitePhone.trim() || undefined,
      permissions: assignedRole?.permissions,
    };

    addInvite(newInvite);
    logAudit(
      'mint_staff_invite',
      '—',
      `Minted staff code [${code}] for ${inviteStaffName.trim()} — Assigned Role: ${roleTitle} (${inviteDutyStation || 'Main Desk'})`
    );

    setIssuedCodeData({
      code,
      staffName: inviteStaffName.trim(),
      roleTitle,
      dutyStation: inviteDutyStation.trim(),
      phone: invitePhone.trim(),
    });

    setInviteStaffName('');
    setInviteDutyStation('');
    setInvitePhone('');
    toast(`Staff access pass minted for ${inviteStaffName.trim()}`, 'emerald');
  };

  const handleCopyCode = (code: string) => {
    copyToClipboard(code);
    setCopiedCode(code);
    toast(`Copied staff access code: ${code}`, 'emerald');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyDispatch = (staffData: {
    code: string;
    staffName: string;
    roleTitle: string;
    dutyStation?: string;
  }) => {
    const text = generateStaffDispatchText({
      orgName,
      staffName: staffData.staffName,
      roleTitle: staffData.roleTitle,
      dutyStation: staffData.dutyStation,
      accessCode: staffData.code,
    });
    copyToClipboard(text);
    toast('Copied official onboarding message for SMS/WhatsApp', 'emerald');
  };

  const handleOpenWhatsApp = (staffData: {
    code: string;
    staffName: string;
    roleTitle: string;
    dutyStation?: string;
  }) => {
    const text = generateStaffDispatchText({
      orgName,
      staffName: staffData.staffName,
      roleTitle: staffData.roleTitle,
      dutyStation: staffData.dutyStation,
      accessCode: staffData.code,
    });
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleConfirmStandDown = () => {
    if (!standDownTarget) return;
    standDownTeamMember(standDownTarget.id, standDownTarget.reason, standDownTarget.note);
    setStandDownTarget(null);
    toast('Staff member stood down', 'amber');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 pt-6 animate-fade-in text-slate-800 dark:text-slate-100 max-w-6xl mx-auto pb-24">
      {/* 1. Header & Entity Master Desk Overview */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 flex items-center gap-1.5">
                <SectorIcon size={12} />
                {user.entity_category ? user.entity_category.replace(/_/g, ' ') : 'Service Provider Desk'}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600 dark:text-emerald-400" /> Master Entity Desk
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                ID: {user.dept} · Tier: {user.scope === 'national' ? 'National ($20/mo)' : user.scope === 'subcounty' ? 'Sub-County ($5/mo)' : user.scope === 'parish' ? 'Parish (Free)' : 'District ($10/mo)'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {orgName} · Team &amp; Staff Roster
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Registered Administrator: <strong>{profTitle}</strong> ({user.name || user.real_title_short || 'Primary Owner'}). Define custom roles, configure permission limits, invite duty staff, and manage Monthly Top-3 Perk Vault dispatches.
            </p>
          </div>

          {/* Seat Usage Widget */}
          <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] min-w-[250px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Users size={14} className="text-emerald-600 dark:text-emerald-400" />
                Staff Seat Allocation
              </span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {isPaidTier ? `${totalOccupiedSeats} Active · Unlimited (∞)` : `${totalOccupiedSeats} / ${seatLimit} Seats`}
              </span>
            </div>

            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all ${
                  !isPaidTier && totalOccupiedSeats >= seatLimit
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: isPaidTier ? '100%' : `${Math.min(100, (totalOccupiedSeats / seatLimit) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span>{isPaidTier ? 'Unlimited seats on paid desk' : `${availableSeats} free seats remaining`}</span>
              <button
                type="button"
                onClick={() => go('entity_register')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
              >
                Edit Profile &amp; Tier →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Desk Navigation Bar */}
        <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
            Pricing Tiers: Parish Free ($0) · Sub-County $5/mo · District $10/mo · National $20/mo
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => go('entity_register')}
              className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Edit Provider Desk Profile
            </button>
            <button
              type="button"
              onClick={() => go('perk_vault')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold cursor-pointer"
            >
              Open 5-Vault Monthly Perks →
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'staff'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <UserCheck size={15} />
          Active Team ({myTeam.length})
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'branches'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Store size={15} />
          Nationwide Branches ({myBranches.length})
        </button>

        <button
          onClick={() => setActiveTab('invite')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'invite'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <UserPlus size={15} />
          Invite Staff Member
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'roles'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Sliders size={15} />
          Role Definitions & Perms ({entityRoles.length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'pending'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <Clock size={15} />
          Pending Invites ({myInvites.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black mono uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
            activeTab === 'audit'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
        >
          <ShieldCheck size={15} />
          Duty Activity Log
        </button>
      </div>

      {/* 2.5 TAB CONTENT: NATIONWIDE BRANCHES & SUPERADMIN PROVISIONER */}
      {activeTab === 'branches' && (
        <div className="space-y-5">
          {/* Header & Metrics */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase mono text-purple-600 dark:text-purple-400">
                    Enterprise Hierarchy &amp; Grassroots Mapping
                  </span>
                  <span className="text-[9px] mono uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                    Superadmin Hub
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  Nationwide Branch Network ({myBranches.length} Branches)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Central Superadmin creates branches mapped to LC2 parishes, issues Branch Manager Access Codes, and empowers branch managers to lead internal teams.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateBranchModal(true)}
                className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs mono uppercase flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer self-start sm:self-auto"
              >
                <Plus size={15} />
                <span>Provision New Branch</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  Active Branches
                </span>
                <span className="text-lg font-black text-purple-900 dark:text-purple-200 font-mono">
                  {myBranches.length} Nodes
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  Parishes Covered
                </span>
                <span className="text-lg font-black text-emerald-900 dark:text-emerald-200 font-mono">
                  {new Set(myBranches.map((b) => b.parish)).size} LC2 Nodes
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  Internal Service Teams
                </span>
                <span className="text-lg font-black text-blue-900 dark:text-blue-200 font-mono">
                  {myBranches.reduce((acc, b) => acc + (b.teams?.length || 0), 0)} Teams
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase">
                  Avg SLA Performance
                </span>
                <span className="text-lg font-black text-amber-900 dark:text-amber-200 font-mono">
                  95.4% Ontime
                </span>
              </div>
            </div>
          </div>

          {/* Provision Modal / Drawer */}
          {showCreateBranchModal && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-500 shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase mono text-purple-600 dark:text-purple-400">
                    Central Admin Action
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    Provision Nationwide Branch to LC2 Parish
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateBranchModal(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateBranch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Branch Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      placeholder="e.g. Acacia Mall Branch, Jinja Central Center..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Physical Landmark / Building
                    </label>
                    <input
                      type="text"
                      value={newBranchLandmark}
                      onChange={(e) => setNewBranchLandmark(e.target.value)}
                      placeholder="e.g. Food Court Level 1, Main Street opposite Post Office"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                {/* Grassroots Hierarchy Cascading Dropdowns */}
                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 space-y-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                    <MapPin size={12} className="text-purple-600 dark:text-purple-400" />
                    <span>Grassroots Territory Mapping (Parish · Subcounty · District)</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        1. District / City
                      </label>
                      <select
                        value={selectedDistrictId}
                        onChange={(e) => {
                          setSelectedDistrictId(e.target.value);
                          const dist = countryTerritories.find((d: any) => d.id === e.target.value);
                          if (dist && dist.children && dist.children[0]) {
                            setSelectedSubcountyId(dist.children[0].id);
                            if (dist.children[0].children && dist.children[0].children[0]) {
                              setSelectedParishName(dist.children[0].children[0].name);
                            }
                          }
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        {countryTerritories.map((d: any) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        2. Subcounty / Division
                      </label>
                      <select
                        value={selectedSubcountyId}
                        onChange={(e) => {
                          setSelectedSubcountyId(e.target.value);
                          const sub = subcountyNodes.find((s: any) => s.id === e.target.value);
                          if (sub && sub.children && sub.children[0]) {
                            setSelectedParishName(sub.children[0].name);
                          }
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        {subcountyNodes.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        3. LC2 Parish (Local Desk)
                      </label>
                      <select
                        value={selectedParishName}
                        onChange={(e) => setSelectedParishName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        {parishNodes.map((p: any) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Branch Manager Name
                    </label>
                    <input
                      type="text"
                      value={newBranchManagerName}
                      onChange={(e) => setNewBranchManagerName(e.target.value)}
                      placeholder="e.g. Brian Mugabe"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Manager Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={newBranchManagerPhone}
                      onChange={(e) => setNewBranchManagerPhone(e.target.value)}
                      placeholder="e.g. +256 772 123 456"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      SLA Response Target (Hours)
                    </label>
                    <select
                      value={newBranchSlaHours}
                      onChange={(e) => setNewBranchSlaHours(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
                    >
                      <option value={4}>4 Hours (Emergency / High Priority)</option>
                      <option value={6}>6 Hours (Hospital / Clinical Care)</option>
                      <option value={12}>12 Hours (Dining / Retail)</option>
                      <option value={24}>24 Hours (Standard Utility / School)</option>
                      <option value={48}>48 Hours (General Institutional)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10.5px] font-mono text-purple-700 dark:text-purple-300 font-semibold">
                    Auto-generated Code: <strong className="font-mono">{generateBranchAccessCode(orgName, newBranchName || 'BRANCH')}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateBranchModal(false)}
                      className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-black text-xs uppercase transition-all shadow-md cursor-pointer"
                    >
                      Provision &amp; Issue Master Code
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Branch Cards List */}
          <div className="space-y-4">
            {myBranches.map((branch) => {
              const isSelectedForTeam = activeBranchForTeam === branch.id;

              return (
                <div
                  key={branch.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  {/* Top Branch Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          {branch.name}
                        </span>
                        <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                          Active Branch Node
                        </span>
                        <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {branch.brandName}
                        </span>
                      </div>

                      {/* Grassroots Location Dateline */}
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8.5px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <MapPin size={9} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <strong className="text-[9.5px] font-bold text-slate-900 dark:text-white">
                          {branch.parish}
                        </strong>
                        <span className="text-[7px] text-slate-400">·</span>
                        <span>{branch.subcounty}</span>
                        <span className="text-[7px] text-slate-400">·</span>
                        <span className="text-slate-500">{branch.district}</span>
                        {branch.landmark && (
                          <>
                            <span className="text-[7px] text-slate-400">·</span>
                            <span className="text-slate-400 italic truncate max-w-[150px]">
                              {branch.landmark}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Master Branch Access Code Pill & Mount Button */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center gap-2">
                        <div>
                          <span className="text-[8.5px] font-mono font-bold text-purple-700 dark:text-purple-300 block uppercase">
                            Branch Manager Code
                          </span>
                          <span className="text-xs font-mono font-black text-purple-950 dark:text-purple-100 tracking-wider">
                            {branch.accessCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(branch.accessCode)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 transition-colors cursor-pointer"
                          title="Copy Master Branch Code"
                        >
                          {copiedCode === branch.accessCode ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleMountBranch(branch)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-black uppercase flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <span>Mount Desk</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Manager & SLA Status Ribbon */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        {(branch.managerName || 'BM').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-xs">
                          {branch.managerName || 'Assigned Branch Lead'}
                        </span>
                        <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                          {branch.managerPhone || 'Direct Dispatch Hotline'} · {branch.slaHours}h SLA
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-600 dark:text-slate-300">
                        Open Tickets: <strong className="text-amber-600 dark:text-amber-400">{branch.openTicketsCount || 0}</strong>
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        Resolved: <strong className="text-emerald-600 dark:text-emerald-400">{branch.resolvedTicketsCount || 0}</strong>
                      </span>
                      <span className="text-slate-600 dark:text-slate-300">
                        CSAT: <strong className="text-purple-600 dark:text-purple-400">{branch.ratingScore || 96}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Internal Teams within Branch (Sub-Units) */}
                  <div className="space-y-2.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Users size={12} className="text-purple-600 dark:text-purple-400" />
                        <span>Internal Teams within Branch ({branch.teams?.length || 0})</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (isSelectedForTeam) {
                            setActiveBranchForTeam(null);
                          } else {
                            setActiveBranchForTeam(branch.id);
                          }
                        }}
                        className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={11} />
                        <span>{isSelectedForTeam ? 'Close Team Form' : 'Add Team to Branch'}</span>
                      </button>
                    </div>

                    {/* Inline Sub-Team Form */}
                    {isSelectedForTeam && (
                      <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 space-y-3 animate-fade-in">
                        <span className="text-[10px] font-mono font-black uppercase text-purple-900 dark:text-purple-200 block">
                          Add Internal Team to {branch.name}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          <input
                            type="text"
                            value={newSubTeamName}
                            onChange={(e) => setNewSubTeamName(e.target.value)}
                            placeholder="Team Name (e.g. Kitchen, Delivery Fleet, Front Desk)..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                          />
                          <input
                            type="text"
                            value={newSubTeamLead}
                            onChange={(e) => setNewSubTeamLead(e.target.value)}
                            placeholder="Team Lead Name..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                          />
                          <select
                            value={newSubTeamCategory}
                            onChange={(e) => setNewSubTeamCategory(e.target.value as any)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white"
                          >
                            <option value="operations">Operations Crew</option>
                            <option value="service">Customer Care</option>
                            <option value="technical">Technical / Fleet</option>
                            <option value="logistics">Logistics &amp; Delivery</option>
                            <option value="management">Discipline / Management</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAddSubTeam(branch.id)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase cursor-pointer"
                          >
                            Save Team
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Team Badges List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {(branch.teams || []).map((team) => (
                        <div
                          key={team.id}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                              {team.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate block">
                              Lead: {team.lead} · {team.memberCount} members
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveSubTeam(branch.id, team.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                            title="Remove Team"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: INVITE STAFF MEMBER */}
      {activeTab === 'invite' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-black uppercase mono text-purple-600 dark:text-purple-400">
                  Staff Onboarding Dispatch
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Issue Verified Staff Access Pass
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Generate a single-use staff code. Staff members will use this code to log into the Service Provider Desk with their assigned role and permission level.
                </p>
              </div>

              <form onSubmit={handleIssueStaffInvite} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Staff Member Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteStaffName}
                    onChange={(e) => setInviteStaffName(e.target.value)}
                    placeholder="e.g. Joan Namubiru or Alex Kibet"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Assign Entity Role *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoleId(null);
                        setNewRoleTitle('');
                        setNewRoleDesc('');
                        setShowCreateRoleModal(true);
                      }}
                      className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Create New Role
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {entityRoles.map((role) => {
                      const color = getColorDef(role.color);
                      const isSelected = selectedRoleId === role.id;
                      return (
                        <div
                          key={role.id}
                          onClick={() => setSelectedRoleId(role.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-purple-600 bg-purple-500/10 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-black ${color.text} flex items-center gap-1.5`}>
                              <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                              {role.title}
                            </span>
                            {isSelected && <Check size={14} className="text-purple-600 dark:text-purple-400" />}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {role.description}
                          </p>
                          <div className="flex items-center gap-1 mt-2 flex-wrap text-[9px] mono text-slate-400">
                            {role.permissions.can_reply && <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded">Replies</span>}
                            {role.permissions.can_resolve && <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">Resolve</span>}
                            {role.permissions.can_broadcast && <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.5 rounded">Notices</span>}
                            {role.permissions.can_view_billing && <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">Billing</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Duty Station / Shift / Branch
                    </label>
                    <input
                      type="text"
                      value={inviteDutyStation}
                      onChange={(e) => setInviteDutyStation(e.target.value)}
                      placeholder="e.g. VIP Counter, Night Shift, Bay 2"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Phone Number (Optional for WhatsApp dispatch)
                    </label>
                    <input
                      type="text"
                      value={invitePhone}
                      onChange={(e) => setInvitePhone(e.target.value)}
                      placeholder="e.g. +256 700 000 000"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={availableSeats <= 0}
                  className={`w-full py-3 rounded-xl font-black text-xs mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                    availableSeats <= 0
                      ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-purple-600/20'
                  }`}
                >
                  <UserPlus size={16} />
                  {availableSeats <= 0 ? 'Seat Limit Reached — Upgrade Required' : 'Generate Staff Access Code'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Issued Code Preview or Onboarding Instructions */}
          <div className="lg:col-span-5 space-y-4">
            {issuedCodeData ? (
              <div className="p-5 rounded-2xl bg-purple-500/10 border-2 border-purple-500/40 shadow-xl space-y-4 animate-scale-up">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase mono text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
                    Pass Generated
                  </span>
                  <button
                    onClick={() => setIssuedCodeData(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="text-center space-y-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Staff Access Code</span>
                  <div className="text-2xl font-black mono tracking-wider text-purple-900 dark:text-purple-200 bg-white/80 dark:bg-slate-900/90 p-3 rounded-xl border border-purple-300 dark:border-purple-700/60 shadow-inner">
                    {issuedCodeData.code}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Staff Member:</span>
                    <strong className="text-slate-900 dark:text-white">{issuedCodeData.staffName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Role:</span>
                    <strong className="text-purple-600 dark:text-purple-400">{issuedCodeData.roleTitle}</strong>
                  </div>
                  {issuedCodeData.dutyStation && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Duty Station:</span>
                      <strong className="text-slate-900 dark:text-white">{issuedCodeData.dutyStation}</strong>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleCopyCode(issuedCodeData.code)}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs mono uppercase flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    {copiedCode === issuedCodeData.code ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode === issuedCodeData.code ? 'Copied' : 'Copy Code'}
                  </button>

                  <button
                    onClick={() => handleOpenWhatsApp(issuedCodeData)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs mono uppercase flex items-center justify-center gap-1.5 transition-colors shadow-md"
                  >
                    <Send size={14} /> WhatsApp
                  </button>
                </div>

                <button
                  onClick={() => handleCopyDispatch(issuedCodeData)}
                  className="w-full py-2 rounded-xl border border-purple-400 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-[11px] font-bold mono flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy size={13} /> Copy Full SMS / WhatsApp Dispatch
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xs">
                  <ShieldCheck size={16} className="text-purple-600 dark:text-purple-400" />
                  Staff Account Verification Protocol
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  When you mint an access code, it is immediately registered under your entity account. Your staff member will enter the code on the Service Provider Desk and gain direct access to their assigned duty functions.
                </p>
                <div className="space-y-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                    <span>Staff member opens CivicDuty Provider Gateway</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                    <span>Enters their single-use Staff Access Code</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                    <span>Terminal mounts with strict role permission limits</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: ACTIVE TEAM ROSTER */}
      {activeTab === 'staff' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Active Staff Roster ({myTeam.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personnel authorized to access this entity desk and process citizen / customer tickets.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('invite')}
              className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <UserPlus size={14} /> Add Staff
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {myTeam.map((member, idx) => {
              const isOwner = member.staff_role === 'owner_admin' || member.is_admin;
              const assignedRole = entityRoles.find((r) => r.id === member.assigned_role_id) || {
                title: member.title || (isOwner ? profTitle : 'Staff Officer'),
                color: isOwner ? 'purple' : 'indigo',
                permissions: member.permissions || {
                  can_reply: true,
                  can_resolve: true,
                  can_broadcast: isOwner,
                  can_view_billing: isOwner,
                  can_manage_staff: isOwner,
                },
              };
              const color = getColorDef(assignedRole.color);

              return (
                <div
                  key={`${member.id}-${idx}`}
                  className={`p-4 rounded-2xl border transition-all ${
                    member.active
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                      : 'bg-slate-100/60 dark:bg-slate-950/60 border-slate-300 dark:border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        {member.name}
                        {isOwner && (
                          <span className="text-[9px] mono uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-300 dark:border-amber-700">
                            Owner / Admin
                          </span>
                        )}
                      </h4>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold mt-1 px-2 py-0.5 rounded-md ${color.bg} ${color.text} border ${color.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                        {assignedRole.title}
                      </span>
                    </div>

                    <span
                      className={`text-[9px] mono font-bold px-2 py-0.5 rounded-full ${
                        member.active
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {member.active ? 'Active' : 'Stood Down'}
                    </span>
                  </div>

                  {member.duty_station && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-2.5 flex items-center gap-1 font-mono">
                      <MapPin size={12} className="text-slate-400" />
                      Station: <strong className="text-slate-800 dark:text-slate-200">{member.duty_station}</strong>
                    </div>
                  )}

                  {/* Capabilities badges */}
                  <div className="flex items-center gap-1 flex-wrap mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[9px] mono">
                    {assignedRole.permissions?.can_reply && (
                      <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                        Replies
                      </span>
                    )}
                    {assignedRole.permissions?.can_resolve && (
                      <span className="bg-blue-500/10 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                        Resolutions
                      </span>
                    )}
                    {assignedRole.permissions?.can_broadcast && (
                      <span className="bg-purple-500/10 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded">
                        Bulletins
                      </span>
                    )}
                    {assignedRole.permissions?.can_view_billing && (
                      <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                        Billing
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  {!isOwner && (
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {member.active ? (
                        <button
                          onClick={() =>
                            setStandDownTarget({
                              id: member.id,
                              name: member.name,
                              reason: 'contract_ended',
                              note: '',
                            })
                          }
                          className="text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                        >
                          <ShieldAlert size={12} /> Stand Down
                        </button>
                      ) : (
                        <button
                          onClick={() => reinstateTeamMember(member.id)}
                          className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw size={12} /> Reinstate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: ROLE DEFINITIONS & PERMISSIONS */}
      {activeTab === 'roles' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Custom Entity Roles & Permission Matrices
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tailor exact operational job titles and limit what each staff member can do on this desk.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaultRoles}
                className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} /> Recommended Presets
              </button>
              <button
                onClick={() => {
                  setEditingRoleId(null);
                  setNewRoleTitle('');
                  setNewRoleDesc('');
                  setNewRoleColor('purple');
                  setShowCreateRoleModal(true);
                }}
                className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Plus size={14} /> Create Custom Role
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entityRoles.map((role) => {
              const color = getColorDef(role.color);
              const assignedCount = myTeam.filter((m) => m.assigned_role_id === role.id).length;

              return (
                <div
                  key={role.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border} flex items-center gap-1.5`}>
                          <span className={`w-2 h-2 rounded-full ${color.dot}`} />
                          {role.title}
                        </span>
                        {role.is_custom && (
                          <span className="text-[9px] mono uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditRole(role)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Role & Permissions"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id, role.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Role"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Permissions Checklist */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="text-[10px] font-black uppercase mono text-slate-400">
                      Granted Authority:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {PERMISSION_DESCRIPTIONS.map((p) => {
                        const isGranted = role.permissions[p.key];
                        return (
                          <div
                            key={p.key}
                            className={`flex items-center gap-1.5 text-[10.5px] p-1.5 rounded-lg ${
                              isGranted
                                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold'
                                : 'bg-slate-100 dark:bg-slate-950 text-slate-400 line-through opacity-60'
                            }`}
                          >
                            {isGranted ? <CheckCircle2 size={12} className="text-emerald-600 shrink-0" /> : <X size={12} className="text-slate-400 shrink-0" />}
                            <span className="truncate">{p.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>{assignedCount} active staff assigned</span>
                    <button
                      onClick={() => {
                        setSelectedRoleId(role.id);
                        setActiveTab('invite');
                      }}
                      className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
                    >
                      + Invite Staff into this Role →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: PENDING INVITES */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Pending Staff Invites ({myInvites.length})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff access codes awaiting redemption by invited personnel.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('invite')}
              className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <UserPlus size={14} /> Mint New Invite
            </button>
          </div>

          {myInvites.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <Clock size={32} className="mx-auto text-slate-400" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Pending Invites</h4>
              <p className="text-xs text-slate-500">All issued staff access passes have been redeemed or none have been minted yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myInvites.map((inv, idx) => {
                const assignedRole = entityRoles.find((r) => r.id === inv.assigned_role_id) || {
                  title: inv.assigned_role_title || inv.title || 'Staff Officer',
                  color: 'indigo',
                };
                const color = getColorDef(assignedRole.color);

                return (
                  <div
                    key={`${inv.code}-${idx}`}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] mono text-slate-400 font-bold block">RECIPIENT</span>
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {inv.name}
                        </h4>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold mt-1 px-2 py-0.5 rounded-md ${color.bg} ${color.text} border ${color.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                          {assignedRole.title}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] mono uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                          Unredeemed
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="mono font-black text-xs text-purple-700 dark:text-purple-300 tracking-wider">
                        {inv.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(inv.code)}
                        className="text-xs text-slate-600 dark:text-slate-300 hover:text-purple-600 font-mono font-bold flex items-center gap-1"
                      >
                        {copiedCode === inv.code ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        {copiedCode === inv.code ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    {inv.duty_station && (
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <MapPin size={12} /> Station: {inv.duty_station}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() =>
                          handleOpenWhatsApp({
                            code: inv.code,
                            staffName: inv.name,
                            roleTitle: assignedRole.title,
                            dutyStation: inv.duty_station,
                          })
                        }
                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Send size={12} /> Send via WhatsApp
                      </button>

                      <button
                        onClick={() =>
                          handleCopyDispatch({
                            code: inv.code,
                            staffName: inv.name,
                            roleTitle: assignedRole.title,
                            dutyStation: inv.duty_station,
                          })
                        }
                        className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <Copy size={12} /> Copy SMS
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. TAB CONTENT: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Institutional Duty & Shift Activity Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable audit ledger of staff invitations, role modifications, and ticket resolutions on this desk.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
              <div>
                <strong className="text-slate-900 dark:text-white block font-mono">
                  Master Desk Initialized
                </strong>
                <span className="text-slate-500">
                  {orgName} mounted by {profTitle} ({user.name || 'Owner'}). Staff allocation: {seatLimit} seats.
                </span>
              </div>
              <span className="text-[10px] mono text-slate-400 shrink-0">System Log</span>
            </div>

            {myInvites.map((inv, idx) => (
              <div
                key={`${inv.code}-${idx}`}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
              >
                <div>
                  <strong className="text-purple-600 dark:text-purple-400 block font-mono">
                    Staff Code Minted: [{inv.code}]
                  </strong>
                  <span className="text-slate-600 dark:text-slate-300">
                    Recipient: {inv.name} · Role: {inv.assigned_role_title || inv.title} · Station: {inv.duty_station || 'Main Desk'}
                  </span>
                </div>
                <span className="text-[10px] mono text-slate-400 shrink-0">Pass Issued</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT CUSTOM ROLE */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Sliders size={16} />
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {editingRoleId ? 'Edit Entity Role' : 'Create Custom Entity Role'}
                </h3>
              </div>
              <button
                onClick={() => setShowCreateRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  placeholder="e.g. VIP Floor Lead, Lead Pharmacist, Shift Cashier"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Duty Description
                </label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Brief summary of duties and accountability..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              {/* Color Tag Picker */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Badge Color Styling
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {ROLE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewRoleColor(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                        newRoleColor === c.id
                          ? `${c.bg} ${c.text} ${c.border} ring-2 ring-purple-500`
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permission Switches */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  Permissions & Duty Authority
                </label>
                <div className="space-y-2">
                  {PERMISSION_DESCRIPTIONS.map((perm) => {
                    const isChecked = newRolePerms[perm.key];
                    return (
                      <div
                        key={perm.key}
                        onClick={() =>
                          setNewRolePerms((prev) => ({
                            ...prev,
                            [perm.key]: !prev[perm.key],
                          }))
                        }
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'bg-purple-500/10 border-purple-500/40'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-70'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                        />
                        <div>
                          <strong className="text-xs text-slate-900 dark:text-white block">
                            {perm.label}
                          </strong>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {perm.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoleModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black mono uppercase tracking-wider shadow-md"
                >
                  {editingRoleId ? 'Update Role' : 'Save Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAND DOWN CONFIRMATION MODAL */}
      {standDownTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <span className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert size={20} />
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Stand Down Staff Member
                </h3>
                <span className="text-xs text-slate-500">{standDownTarget.name}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standing down this staff member will immediately revoke their access to this provider desk. Their previous activity will remain recorded in the immutable audit log.
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Reason for Standing Down
              </label>
              <select
                value={standDownTarget.reason}
                onChange={(e) =>
                  setStandDownTarget((prev) => (prev ? { ...prev, reason: e.target.value } : null))
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none"
              >
                <option value="contract_ended">Contract or Shift Ended</option>
                <option value="transferred">Transferred to Other Branch</option>
                <option value="disciplinary">Disciplinary Action / Suspended</option>
                <option value="resigned">Resigned / Left Employment</option>
                <option value="other">Other Administrative Reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStandDownTarget(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold mono uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStandDown}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black mono uppercase tracking-wider shadow-md"
              >
                Confirm Stand Down
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
