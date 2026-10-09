import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getDept, allDepts, makeCode, copyToClipboard, getPsMinistryInfo } from '../utils/helpers';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { getCountryRolloutConfig } from '../data/nationalRolloutNodes';
import {
  roleTreeFor,
  scopeName,
  getQuickTitlePresets,
  tiersFor,
  primaryTier,
  getNationalRolloutArrangements,
  GOV_CODES,
  getJurisdictionDesignations,
  StatutoryDesignation,
} from '../data/tiers';
import { CountryCode, RoleType, TeamMember } from '../types';
import { NoteBox } from '../components/NoteBox';
import {
  Copy,
  Upload,
  MessageCircle,
  Building2,
  Shield,
  Lock,
  CheckCircle2,
  MapPin,
  BarChart2,
  Zap,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Edit3,
  Key,
  Phone,
  Mail,
  UserPlus,
  UserMinus,
  Check,
  X,
  XCircle,
  ExternalLink,
  Send,
  FileText,
} from 'lucide-react';
import { EntityTeamView } from './EntityTeamView';
import { RolloutSupervisionStructure } from '../components/RolloutSupervisionStructure';
import { DistrictSupervisionStructure } from '../components/DistrictSupervisionStructure';
import { SubcountySupervisionStructure } from '../components/SubcountySupervisionStructure';
import { ParishSupervisionStructure } from '../components/ParishSupervisionStructure';
import { SovereignBatchCommissioning } from '../components/SovereignBatchCommissioning';
import { ExecutiveTierAnalytics } from '../components/ExecutiveTierAnalytics';

const STAND_DOWN_REASONS = [
  { id: 'transferred', label: 'Transferred' },
  { id: 'retired', label: 'Retired' },
  { id: 'promoted', label: 'Promoted' },
  { id: 'dismissed', label: 'Dismissed' },
  { id: 'contract_ended', label: 'Contract ended' },
  { id: 'resigned', label: 'Resigned' },
  { id: 'deceased', label: 'Deceased' },
  { id: 'other', label: 'Other' },
];

/**
 * Resolves the statutory tier, administrative unit objects, and supervisory scope
 */
function getSupervisoryJurisdiction(
  country: CountryCode,
  userScope?: string,
  userHierarchy?: string,
  userRole?: string,
  userTitle?: string
) {
  const dists = TERRITORY[country] || [];

  // Determine tier:
  let tier: 5 | 4 | 3 | 2 | 1 = 5;
  if (userHierarchy === 'tier1_parish') tier = 1;
  else if (userHierarchy === 'tier2_subcounty') tier = 2;
  else if (userHierarchy === 'tier3_district_cao') tier = 3;
  else if (userHierarchy === 'tier4_agency') tier = 4;
  else if (userHierarchy === 'tier5_perm_sec') tier = 5;
  else {
    const t = (userTitle || '').toLowerCase();
    if (t.includes('parish chief') || t.includes('town agent') || t.includes('ward admin') || t.includes('ward agent')) {
      tier = 1;
    } else if (
      t.includes('sub-county') ||
      t.includes('subcounty') ||
      t.includes('senior assistant secretary') ||
      t.includes('sas') ||
      t.includes('division tc') ||
      t.includes('division clerk')
    ) {
      tier = 2;
    } else if (
      t.includes('cao') ||
      t.includes('chief administrative officer') ||
      t.includes('city town clerk') ||
      t.includes('executive director')
    ) {
      tier = 3;
    } else if (userRole === 'platform_admin' || !userScope || userScope === country || userScope === 'UG') {
      tier = 5;
    } else {
      const d = dists.find((x) => x.id === userScope);
      if (d) {
        tier = 3;
      } else {
        let isSub = false;
        let isParish = false;
        for (const dist of dists) {
          if (dist.children?.some((s) => s.id === userScope)) isSub = true;
          for (const sub of dist.children || []) {
            if (sub.children?.some((p) => p.id === userScope)) isParish = true;
          }
        }
        if (isParish) tier = 1;
        else if (isSub) tier = 2;
        else tier = 3;
      }
    }
  }

  // Find exact territory objects
  let districtObj = dists[0];
  let subcountyObj: any = null;
  let parishObj: any = null;

  if (userScope && userScope !== country && userScope !== 'UG') {
    const directD = dists.find((d) => d.id.toLowerCase() === userScope.toLowerCase());
    if (directD) {
      districtObj = directD;
    } else {
      for (const d of dists) {
        const foundSub = d.children?.find((s) => s.id.toLowerCase() === userScope.toLowerCase());
        if (foundSub) {
          districtObj = d;
          subcountyObj = foundSub;
          break;
        }
        for (const s of d.children || []) {
          const foundP = s.children?.find((p) => p.id.toLowerCase() === userScope.toLowerCase());
          if (foundP) {
            districtObj = d;
            subcountyObj = s;
            parishObj = foundP;
            break;
          }
        }
        if (subcountyObj) break;
      }
    }
  }

  // Fallbacks if tier is 2 or 1
  if (tier <= 2 && !subcountyObj) {
    subcountyObj = districtObj?.children?.[0] || null;
  }
  if (tier === 1 && !parishObj) {
    parishObj = subcountyObj?.children?.[0] || null;
  }

  return {
    tier,
    districtObj,
    subcountyObj,
    parishObj,
  };
}

/**
 * Checks whether a candidate officer's geographic scope is within the supervisor's jurisdiction
 */
function isScopeUnderSupervisor(
  candidateScope: string,
  supervisorTier: number,
  supervisorDistrictId?: string,
  supervisorSubcountyId?: string,
  supervisorParishId?: string,
  country: CountryCode = 'UG'
): boolean {
  if (supervisorTier >= 4) return true; // Apex Ministry sees all in sovereign country
  const dists = TERRITORY[country] || [];

  if (supervisorTier === 3) {
    // CAO: Candidate must be in the CAO's district
    if (!supervisorDistrictId) return true;
    if (candidateScope === supervisorDistrictId) return true;
    const dist = dists.find((d) => d.id.toLowerCase() === supervisorDistrictId.toLowerCase());
    if (!dist) return true;
    if (dist.children?.some((s) => s.id.toLowerCase() === candidateScope.toLowerCase())) return true;
    for (const s of dist.children || []) {
      if (s.children?.some((p) => p.id.toLowerCase() === candidateScope.toLowerCase())) return true;
    }
    return false;
  }

  if (supervisorTier === 2) {
    // Sub-County Chief: Candidate must be in this Sub-County
    if (!supervisorSubcountyId) return true;
    if (candidateScope === supervisorSubcountyId) return true;
    for (const d of dists) {
      const sub = d.children?.find((s) => s.id.toLowerCase() === supervisorSubcountyId.toLowerCase());
      if (sub) {
        if (sub.children?.some((p) => p.id.toLowerCase() === candidateScope.toLowerCase())) return true;
      }
    }
    return false;
  }

  if (supervisorTier === 1) {
    // Parish Chief: Candidate must match this Parish
    return candidateScope.toLowerCase() === (supervisorParishId || '').toLowerCase();
  }

  return true;
}

export const GovTeamView: React.FC = () => {
  const {
    user,
    teamMembers,
    invites,
    go,
    addInvite,
    acceptInvite,
    revokeInvite,
    mintGovAccessCode,
    standDownTeamMember,
    reinstateTeamMember,
    updateTeamMember,
    replaceTeamMember,
    logAudit,
    toast,
    execGovLoginByData,
    directLoginWithGovCode,
  } = useApp();

  // If user is strictly a non-government private commercial entity, delegate to EntityTeamView
  const isPrivateEntity =
    user?.entity_type === 'non_government_entity' ||
    user?.dept?.startsWith('ent-') ||
    user?.dept?.startsWith('ctr-') ||
    user?.dept?.startsWith('ngo-');

  if (isPrivateEntity) {
    return <EntityTeamView />;
  }

  const country = user?.country || 'UG';
  const countryMeta = COUNTRIES[country] || COUNTRIES.UG;
  const rolloutConfig = useMemo(() => getCountryRolloutConfig(country), [country]);
  const psInfo = useMemo(() => getPsMinistryInfo(user), [user]);
  const isLinePs = psInfo.isPs && !psInfo.isMoLG;
  const dists = user ? TERRITORY[user.country] || [] : [];

  // Compute exact statutory supervisory context
  const jurisdiction = getSupervisoryJurisdiction(
    country,
    user?.scope,
    user?.hierarchy_level,
    user?.role,
    user?.real_title_short
  );

  const { tier, districtObj, subcountyObj, parishObj } = jurisdiction;

  // Geographic state locked to statutory station where appropriate
  const [district, setDistrict] = useState(() => {
    if (tier <= 3 && districtObj) return districtObj.id;
    if (user?.scope && dists.some((d) => d.id === user.scope)) {
      return user.scope;
    }
    return dists[0]?.id || '';
  });

  const [subcounty, setSubcounty] = useState(() => {
    if (tier <= 2 && subcountyObj) return subcountyObj.id;
    return '';
  });

  const [parish, setParish] = useState(() => {
    if (tier === 1 && parishObj) return parishObj.id;
    return '';
  });

  // Keep synced if user jurisdiction changes
  useEffect(() => {
    if (tier <= 3 && districtObj) setDistrict(districtObj.id);
    if (tier <= 2 && subcountyObj) setSubcounty(subcountyObj.id);
    if (tier === 1 && parishObj) setParish(parishObj.id);
  }, [tier, districtObj?.id, subcountyObj?.id, parishObj?.id]);

  // Invite Form State
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteTitle, setInviteTitle] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [selectedDesignationId, setSelectedDesignationId] = useState<string>('');
  const [customTitleText, setCustomTitleText] = useState<string>('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<RoleType>('spokesperson');
  const [isUtility, setIsUtility] = useState(false);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [issuedInviteData, setIssuedInviteData] = useState<{
    code: string;
    name: string;
    title: string;
    phone?: string;
    scope: string;
    scopeNameStr: string;
    legalBasis: string;
    dutyStation: string;
    mandate?: string;
    role: RoleType;
  } | null>(null);
  const [inviteMode, setInviteMode] = useState<'quick' | 'auto_mint'>('quick');

  // Search and Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'stood_down'>('all');
  const [govViewTab, setGovViewTab] = useState<'roster' | 'analytics'>('roster');

  // Automatically dismiss the dispatch memo once the credential is approved/claimed
  useEffect(() => {
    if (issuedCode) {
      const found = invites.find((i) => i.code === issuedCode);
      if (found && found.used) {
        setIssuedCode(null);
        setIssuedInviteData(null);
      }
    }
  }, [invites, issuedCode]);

  // Modals Management State
  const [standDownTarget, setStandDownTarget] = useState<{ id: string; name: string; reason: string; note: string } | null>(null);

  // Replace / Handover Modal State
  const [replaceTarget, setReplaceTarget] = useState<TeamMember | null>(null);
  const [successorName, setSuccessorName] = useState('');
  const [successorTitle, setSuccessorTitle] = useState('');
  const [successorPhone, setSuccessorPhone] = useState('');
  const [successorEmail, setSuccessorEmail] = useState('');
  const [handoverReason, setHandoverReason] = useState('transferred');
  const [handoverNote, setHandoverNote] = useState('');
  const [handoverSuccessResult, setHandoverSuccessResult] = useState<{ code: string; newMember: TeamMember; oldMemberName: string } | null>(null);

  // Edit Officer Modal State
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [editName, setEditName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Re-issue Code Result State
  const [reissueResult, setReissueResult] = useState<{ code: string; member: TeamMember } | null>(null);

  useEffect(() => {
    if (!user || (!['node_admin', 'platform_admin', 'spokesperson'].includes(user.role) && !user.is_admin)) {
      go('gov_inbox');
    }
  }, [user, go]);

  if (!user || (!['node_admin', 'platform_admin', 'spokesperson'].includes(user.role) && !user.is_admin)) {
    return null;
  }

  const d = getDept(user.country, user.dept || 'kcca');

  // Filter team members and invites strictly to officers under this user's supervisory mandate
  const allSupervisedTeam = teamMembers
    .filter((m) => m.dept === user.dept && (!m.country || m.country === user.country))
    .filter((m) =>
      isScopeUnderSupervisor(
        m.scope,
        tier,
        districtObj?.id,
        subcountyObj?.id,
        parishObj?.id,
        user.country
      )
    );

  // Search & Filter Active Roster
  const filteredTeam = allSupervisedTeam.filter((m) => {
    if (statusFilter === 'active' && !m.active) return false;
    if (statusFilter === 'stood_down' && m.active) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const station = scopeName(user.country, m.scope).toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      station.includes(q) ||
      (m.contact_phone && m.contact_phone.includes(q))
    );
  });

  const activeCount = allSupervisedTeam.filter((m) => m.active).length;
  const stoodDownCount = allSupervisedTeam.filter((m) => !m.active).length;

  const openInv = invites
    .filter((i) => !i.used && i.dept === user.dept && (!i.country || i.country === user.country))
    .filter((i) =>
      isScopeUnderSupervisor(
        i.scope,
        tier,
        districtObj?.id,
        subcountyObj?.id,
        parishObj?.id,
        user.country
      )
    );

  const activeDistrictObj = dists.find((x) => x.id === district) || districtObj || dists[0];
  const subs = activeDistrictObj?.children || [];
  const activeSubcountyObj = subs.find((x) => x.id === subcounty) || subcountyObj;
  const parishes = activeSubcountyObj?.children || [];

  // Assignable roles strictly bounded by the user's supervisory authority
  const assignableRoles: RoleType[] =
    tier === 5
      ? ['platform_admin', 'node_admin', 'spokesperson', 'read_only']
      : tier === 3
      ? ['node_admin', 'spokesperson', 'read_only']
      : ['spokesperson', 'read_only']; // Sub-county and parish chiefs cannot create node_admins!

  const roleLabels: Record<RoleType, string> = {
    platform_admin: 'Platform Admin (Apex)',
    node_admin: 'Node Admin (LLG Lead)',
    spokesperson: 'Spokesperson (Field / Desk)',
    read_only: 'Read-Only (Internal Audit)',
    citizen: 'Citizen',
  };

  const roleColors: Record<RoleType, string> = {
    platform_admin: '#f87171',
    node_admin: '#fbbf24',
    spokesperson: '#34d399',
    read_only: '#71717a',
    citizen: '#10b981',
  };

  // Tailored presets and statutory designations for the officer's exact supervisory mandate per jurisdiction
  const jurisdictionDesignations = useMemo(() => {
    if (isLinePs) {
      const mName = psInfo.ministryName || 'Line Ministry';
      const mShort = psInfo.shortTitle || 'Ministry';
      const stateMins = (psInfo.stateMinisterTitles || [`Minister of State — ${mName}`]).map(
        (stTitle, idx) => ({
          id: `line-statemin-${idx}`,
          label: stTitle.split('(')[0].trim(),
          title: stTitle,
          role: 'node_admin' as RoleType,
          desc: `Political portfolio oversight and parliamentary accountability for ${mName}.`,
          legalBasis: `Constitutional Ministerial Mandate (${countryMeta.name})`,
          defaultDutyStation: `${mName} Headquarters`,
          isUtility: false,
        })
      );
      return [
        {
          id: 'line-cabinet-minister',
          label: `Cabinet Minister (${mShort})`,
          title: psInfo.cabinetMinisterTitle || `Cabinet Minister — ${mName}`,
          role: 'platform_admin' as RoleType,
          desc: `Apex Political Head of ${mName}. Receives executive policy briefs, capex audits, and cabinet escalations.`,
          legalBasis: `Constitutional Cabinet Mandate (${countryMeta.name})`,
          defaultDutyStation: `${mName} Cabinet Office`,
          isUtility: false,
        },
        ...stateMins,
        {
          id: 'line-undersecretary',
          label: `Undersecretary (F&A — ${mShort})`,
          title: `Undersecretary (Finance & Administration) — ${mName}`,
          role: 'node_admin' as RoleType,
          desc: `Deputizes the Permanent Secretary on ministry administration, vote accounting, and human resource management.`,
          legalBasis: `Public Finance Management & Civil Service Act`,
          defaultDutyStation: `${mName} Headquarters`,
          isUtility: false,
        },
        {
          id: 'line-director-tech',
          label: `Director Technical Services (${mShort})`,
          title: `Director of Technical Operations & Engineering — ${mName}`,
          role: 'node_admin' as RoleType,
          desc: `Directs national sector engineering, field inspections, and statutory contractor supervision.`,
          legalBasis: `Sectoral Statutory Mandate (${mShort})`,
          defaultDutyStation: `${mName} Technical Directorate`,
          isUtility: false,
        },
        {
          id: 'line-commissioner-qa',
          label: `Commissioner Policy & QA (${mShort})`,
          title: `Commissioner of Policy, Planning & Quality Assurance — ${mName}`,
          role: 'spokesperson' as RoleType,
          desc: `Supervises departmental SLA compliance, citizen petition responses, and quarterly budget performance.`,
          legalBasis: `Public Service Standing Orders`,
          defaultDutyStation: `${mName} Planning Unit`,
          isUtility: false,
        },
        {
          id: 'line-internal-auditor',
          label: `Chief Internal Auditor (${mShort})`,
          title: `Chief Internal Auditor — ${mName}`,
          role: 'read_only' as RoleType,
          desc: `Audits capex contract disbursements, IFMS warrants, and whistle-blower integrity flags.`,
          legalBasis: `Public Finance Management Act (Internal Audit)`,
          defaultDutyStation: `${mName} Audit Chambers`,
          isUtility: false,
        },
      ];
    }
    return getJurisdictionDesignations(user.country as CountryCode, tier, user.scope);
  }, [user.country, tier, user.scope, isLinePs, psInfo, countryMeta.name]);

  const presetsToDisplay = jurisdictionDesignations;

  const selectedDesigObj =
    jurisdictionDesignations.find((d) => d.id === selectedPresetId) ||
    jurisdictionDesignations.find((d) => d.title.toLowerCase() === inviteTitle.toLowerCase().trim());

  const handleIssueInvite = () => {
    if (!inviteName.trim()) {
      toast("Enter the officer's full name", 'red');
      return;
    }
    if (!inviteTitle.trim()) {
      toast('Enter their official title', 'red');
      return;
    }
    const finalScope = isLinePs
      ? user.country
      : parish || subcounty || district || user.country;
    if (!finalScope) {
      toast('Select a jurisdiction station', 'red');
      return;
    }

    const codePrefix = `${user.country.toUpperCase()}-${d.name.replace(/\s+/g, '').toUpperCase().slice(0, 4)}`;
    const code = makeCode(codePrefix);

    const newInvite = {
      code,
      name: inviteName.trim(),
      title: inviteTitle.trim(),
      role: inviteRole,
      scope: finalScope,
      dept: user.dept || (allDepts(user.country)[0]?.id || 'molg'),
      is_utility: isUtility,
      used: false,
      country: user.country,
      contact_phone: invitePhone.trim() || undefined,
      hierarchy_level:
        tier === 3 && inviteRole === 'node_admin'
          ? ('tier2_subcounty' as const)
          : tier === 2
          ? ('tier1_parish' as const)
          : undefined,
      escalation_rank: tier === 3 && inviteRole === 'node_admin' ? 2 : tier === 2 ? 1 : undefined,
    };

    addInvite(newInvite);

    const govData = {
      country: user.country,
      dept: user.dept || (allDepts(user.country)[0]?.id || 'molg'),
      scope: finalScope,
      role: inviteRole,
      is_utility: isUtility,
      role_label: `${inviteTitle.trim()} (${scopeName(user.country, finalScope)})`,
      real_title_short: inviteTitle.trim(),
      officer_name: inviteName.trim(),
      hierarchy_level: newInvite.hierarchy_level,
      escalation_rank: newInvite.escalation_rank,
    };
    mintGovAccessCode(code, govData);

    logAudit(
      'invite_member',
      '—',
      `${inviteName.trim()} — ${inviteTitle.trim()} (${roleLabels[inviteRole]}, ${scopeName(user.country, finalScope)})`
    );

    const scopeLabel = scopeName(user.country, finalScope);
    const chosenDesig =
      jurisdictionDesignations.find((jd) => jd.id === selectedPresetId) ||
      jurisdictionDesignations.find((jd) => jd.title.toLowerCase() === inviteTitle.toLowerCase().trim());
    const dutyStationLabel = chosenDesig?.defaultDutyStation || scopeLabel;
    const legalBasisText =
      tier === 5
        ? 'Article 174 of the Constitution of the Republic of Uganda & Public Finance Management Act'
        : tier === 3
        ? 'Section 64 of the Local Governments Act (Cap. 243)'
        : tier === 2
        ? 'Section 69 of the Local Governments Act (Cap. 243)'
        : 'Section 45 of the Local Governments Act (Cap. 243) & PDM Operational Framework';

    setIssuedInviteData({
      code,
      name: inviteName.trim(),
      title: inviteTitle.trim(),
      phone: invitePhone.trim() || undefined,
      scope: finalScope,
      scopeNameStr: scopeLabel,
      legalBasis: legalBasisText,
      dutyStation: dutyStationLabel,
      mandate: chosenDesig?.desc || undefined,
      role: inviteRole,
    });
    setIssuedCode(code);
    setInviteName('');
    setInviteTitle('');
    setSelectedPresetId('');
    setSelectedDesignationId('');
    setCustomTitleText('');
    setInvitePhone('');
    toast('Official Statutory Credential minted! Transmittal memo ready.', 'emerald');
  };

  const handlePrefillManual = (data: {
    name: string;
    title: string;
    role: RoleType;
    scope: string;
    isUtility: boolean;
    dept: string;
  }) => {
    // Strictly manual name typing as demanded by production standard
    setInviteName('');
    setInviteTitle(data.title);
    setInviteRole(data.role);
    setIsUtility(data.isUtility);

    const matchingDesig = jurisdictionDesignations.find(
      (d) => d.title.toLowerCase() === data.title.toLowerCase()
    );
    if (matchingDesig) {
      setSelectedPresetId(matchingDesig.id);
    } else {
      setSelectedPresetId('others');
    }

    for (const dNode of dists) {
      if (dNode.id === data.scope) {
        if (tier >= 4) setDistrict(dNode.id);
        setSubcounty('');
        setParish('');
        return;
      }
      for (const sNode of dNode.children || []) {
        if (sNode.id === data.scope) {
          if (tier >= 4) setDistrict(dNode.id);
          if (tier >= 3) setSubcounty(sNode.id);
          setParish('');
          return;
        }
        for (const pNode of sNode.children || []) {
          if (pNode.id === data.scope) {
            if (tier >= 4) setDistrict(dNode.id);
            if (tier >= 3) setSubcounty(sNode.id);
            setParish(pNode.id);
            return;
          }
        }
      }
    }
  };

  // Stand-down Action
  const handleConfirmStandDown = () => {
    if (!standDownTarget) return;
    standDownTeamMember(standDownTarget.id, standDownTarget.reason, standDownTarget.note);
    setStandDownTarget(null);
  };

  // Replace / Handover Action
  const handleOpenReplaceModal = (m: TeamMember) => {
    setReplaceTarget(m);
    setSuccessorName('');
    setSuccessorTitle(m.title);
    setSuccessorPhone('');
    setSuccessorEmail('');
    setHandoverReason('transferred');
    setHandoverNote(`Handover of ${scopeName(user.country, m.scope)} desk`);
  };

  const handleConfirmReplace = () => {
    if (!replaceTarget) return;
    if (!successorName.trim()) {
      toast('Please enter the incoming successor full name', 'red');
      return;
    }

    try {
      const { code, newMember } = replaceTeamMember(replaceTarget.id, {
        name: successorName.trim(),
        title: successorTitle.trim() || replaceTarget.title,
        email: successorEmail.trim() || undefined,
        phone: successorPhone.trim() || undefined,
        reason: handoverReason,
        note: handoverNote.trim() || undefined,
      });

      setHandoverSuccessResult({
        code,
        newMember,
        oldMemberName: replaceTarget.name,
      });
      setReplaceTarget(null);
    } catch (err: any) {
      toast(err.message || 'Error executing desk handover', 'red');
    }
  };

  // Edit Officer Action
  const handleOpenEditModal = (m: TeamMember) => {
    setEditTarget(m);
    setEditName(m.name);
    setEditTitle(m.title);
    setEditPhone(m.contact_phone || '');
    setEditEmail(m.email || '');
  };

  const handleConfirmEdit = () => {
    if (!editTarget) return;
    if (!editName.trim() || !editTitle.trim()) {
      toast('Name and official title cannot be blank', 'red');
      return;
    }
    updateTeamMember(editTarget.id, {
      name: editName.trim(),
      title: editTitle.trim(),
      contact_phone: editPhone.trim() || undefined,
      email: editEmail.trim() || undefined,
    });
    setEditTarget(null);
  };

  // Re-issue Code Action
  const handleReissueCode = (m: TeamMember) => {
    const codePrefix = `${(m.country || user.country).toUpperCase()}-${d.name.replace(/\s+/g, '').toUpperCase().slice(0, 4)}`;
    const newCode = makeCode(codePrefix);

    mintGovAccessCode(newCode, {
      country: m.country || user.country,
      dept: m.dept,
      scope: m.scope,
      role: m.role,
      is_utility: m.is_utility,
      role_label: `${m.title} (${scopeName(user.country, m.scope)})`,
      real_title_short: m.title,
      officer_name: m.name,
      hierarchy_level: m.hierarchy_level,
      escalation_rank: m.escalation_rank,
    });

    logAudit('code_reissued', m.id, `Replacement code ${newCode} minted for ${m.name} (${m.title})`);
    setReissueResult({ code: newCode, member: m });
    toast(`Replacement access code minted for ${m.name}`, 'emerald');
  };

  return (
    <div id="gov-team-view-container" className="p-4 space-y-6 animate-fade-in pb-36 max-w-6xl mx-auto">
      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25">
              {isLinePs
                ? `Tier 5 · ${psInfo.ministryName} (${countryMeta.name}) · Strict Ministry Jurisdiction`
                : tier === 5
                ? `Tier 5 · ${rolloutConfig.superadmin.title} (${countryMeta.name})`
                : tier === 3
                ? `Tier 3: CAO "${districtObj?.name || countryMeta.name} District"`
                : tier === 2
                ? `Tier 2: SAS / Sub-County Accounting Officer "${subcountyObj?.name || 'Sub-County'}"`
                : `Tier 1: Parish Administrative Officer "${parishObj?.name || 'Parish'}"`}
            </span>
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Lock size={11} />
              <span>{countryMeta.name} ({user.country})</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {isLinePs
              ? `${psInfo.ministryName} — Ministerial Cabinet & Sector Team Roster`
              : tier === 5
              ? `${rolloutConfig.superadmin.ministry} (${countryMeta.name}) — National Supervisory Roster`
              : tier === 3
              ? `Tier 3: CAO "${districtObj?.name || 'District'}" — Administration Roster`
              : tier === 2
              ? `Tier 2: SAS "${subcountyObj?.name || 'Sub-County'}" — LLG Administration Roster`
              : `Tier 1: "${parishObj?.name || 'Parish'}" — Administrative Unit Roster`}
          </h1>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {isLinePs
              ? `Strictly scoped to ${psInfo.ministryName} (${countryMeta.name}). Invite and commission your Cabinet Minister, Ministers of State, Undersecretary, Technical Directors, and Internal Auditors.`
              : `Official civil service roster, desk delegation, successor handovers, and supervisory oversight for ${countryMeta.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900 dark:text-white">{user.real_title_short || roleLabels[user.role]}</div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">{user.officer_name || user.name || 'Supervisor'}</div>
          </div>
          <span className="text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white uppercase tracking-wider">
            {isLinePs ? `${psInfo.shortTitle} PS` : `TIER ${tier} NODE`}
          </span>
        </div>
      </div>

      {/* Official Mandate Banner */}
      <div className="p-4 bg-[#f8f9fa] dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2 rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs font-mono uppercase tracking-wider">
            <Shield size={15} />
            <span>Statutory Supervisory Mandate &amp; Strict Jurisdiction Lock</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25 font-semibold">
            {isLinePs
              ? `Ministry Mandate Only (${psInfo.shortTitle})`
              : tier === 5
              ? `National Territorial Oversight (${countryMeta.name})`
              : tier === 3
              ? `District Accounting Officer (${districtObj?.name || 'District'})`
              : tier === 2
              ? `Sub-County Accounting Officer (${subcountyObj?.name || 'Sub-County'})`
              : `Grassroots Node (${parishObj?.name || 'Parish'})`}
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {isLinePs && (
            <>
              As <strong>{psInfo.officerTitle}</strong> (Chief Accounting Officer of <strong>{psInfo.ministryName}</strong> in {countryMeta.name}), your team roster and commissioning authority are strictly isolated to your Ministry. Use the presets below to invite your <strong>Cabinet Minister ({psInfo.cabinetMinisterTitle})</strong>, <strong>Ministers of State</strong>, <strong>Undersecretary</strong>, and <strong>Technical Directors</strong>.
            </>
          )}
          {!isLinePs && tier === 5 && (
            <>
              As <strong>{rolloutConfig.superadmin.title} ({rolloutConfig.superadmin.name})</strong>, you oversee national territorial decentralization across <strong>{countryMeta.name}</strong> ({rolloutConfig.nodes.length} regional/district nodes), including commissioning of Regional/District Accounting Officers and coordination with {countryMeta.name}&apos;s Sister Ministries.
            </>
          )}
          {!isLinePs && tier === 3 && (
            <>
              Under the Local Governments Act, the <strong>Chief Administrative Officer (CAO)</strong> is the head of the civil service and accounting officer of <strong>{districtObj?.name}</strong>. Your dashboard and invitation authority are strictly restricted to officers you supervise directly.
            </>
          )}
          {!isLinePs && tier === 2 && (
            <>
              As <strong>Sub-County Accounting Officer</strong> of <strong>{subcountyObj?.name}</strong>, you directly supervise Parish/Ward Chiefs, Community Development Officers, and field extension personnel within your sub-county.
            </>
          )}
          {!isLinePs && tier === 1 && (
            <>
              As <strong>Parish Chief / Ward Administrator</strong> of <strong>{parishObj?.name}</strong>, you coordinate the grassroots committee, supervising village chairpersons and community monitors.
            </>
          )}
        </p>
      </div>

      {/* Workspace View Mode Selector */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGovViewTab('roster')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              govViewTab === 'roster'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <UserCheck size={14} />
            <span>Supervisory Roster &amp; Appointments</span>
          </button>
          <button
            type="button"
            onClick={() => setGovViewTab('analytics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              govViewTab === 'analytics'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <BarChart2 size={14} />
            <span>Executive Tier Analytics (Tier {tier})</span>
          </button>
        </div>
      </div>

      {govViewTab === 'analytics' ? (
        <div className="space-y-4 pt-2">
          <ExecutiveTierAnalytics
            initialCountry={user.country}
            initialTier={tier}
            initialScope={user.scope}
          />
        </div>
      ) : (
        <>
          {/* TIER-TAILORED SUPERVISION MATRIX */}
          {isLinePs ? null : tier === 5 ? (
            <RolloutSupervisionStructure onPrefillManualForm={handlePrefillManual} />
          ) : tier === 3 ? (
            <DistrictSupervisionStructure districtId={districtObj.id} onPrefillManualForm={handlePrefillManual} />
          ) : tier === 2 ? (
            <SubcountySupervisionStructure
              districtId={districtObj.id}
              subcountyId={subcountyObj?.id || ''}
              onPrefillManualForm={handlePrefillManual}
            />
          ) : (
            <ParishSupervisionStructure
              districtId={districtObj.id}
              subcountyId={subcountyObj?.id || ''}
              parishId={parishObj?.id || ''}
              onPrefillManualForm={handlePrefillManual}
            />
          )}

          {/* ========================================================================= */}
          {/* SECTION 1: APPOINTMENT / INVITATION SECTION                                */}
          {/* Tier 5 (MoLG Territorial Superadmin): Handled inside RolloutSupervision   */}
          {/* Line Ministry PS OR Tier 1-3: Direct-Report Statutory Appointment Form    */}
          {/* ========================================================================= */}
          {tier === 5 && !isLinePs ? null : (
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <UserPlus size={16} className="text-teal-600 dark:text-teal-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Appoint &amp; Onboard Team Member
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Issue an official government access code restricted strictly to your supervisory mandate.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setInviteMode('quick')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                inviteMode === 'quick'
                  ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Single Officer Invite
            </button>
            <button
              type="button"
              onClick={() => setInviteMode('auto_mint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                inviteMode === 'auto_mint'
                  ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Zap size={13} />
              1-Click Auto-Mint
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {inviteMode === 'quick' ? (
            <>
              {/* Quick Presets */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] mono text-slate-500 uppercase tracking-wider font-bold">
                    1-Click Direct Report Presets ({user.real_title_short || 'Supervisor'})
                  </span>
                  <span className="text-[9px] mono text-teal-600 font-bold">Station Specific</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {presetsToDisplay.filter((p) => p.id !== 'others').map((preset) => {
                    const isSelected = selectedPresetId === preset.id || (!selectedPresetId && inviteTitle.trim().toLowerCase() === preset.title.toLowerCase());
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(preset.id);
                          setInviteTitle(preset.title);
                          setInviteRole(preset.role);
                          setIsUtility(preset.isUtility || false);
                          setCustomTitleText('');
                          toast(`Selected post: ${preset.title}`, 'emerald');
                        }}
                        className={`p-2.5 border rounded-xl text-left transition-all group flex flex-col justify-between ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 ring-1 ring-teal-500 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-teal-500'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-teal-800 dark:text-teal-300 group-hover:text-teal-900">
                            {preset.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 leading-snug">
                          {preset.desc}
                        </span>
                      </button>
                    );
                  })}

                  {/* + Others (specify) Preset Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPresetId('others');
                      setInviteTitle('');
                      setCustomTitleText('');
                      setTimeout(() => {
                        titleInputRef.current?.focus();
                      }, 50);
                      toast('Specify custom official designation below', 'teal');
                    }}
                    className={`p-2.5 border rounded-xl text-left transition-all group flex flex-col justify-between ${
                      selectedPresetId === 'others'
                        ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 ring-1 ring-teal-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-teal-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-teal-800 dark:text-teal-300 group-hover:text-teal-900">
                        + Others (specify)
                      </span>
                      {selectedPresetId === 'others' && (
                        <CheckCircle2 size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 leading-snug">
                      Type any specific statutory or operational title directly
                    </span>
                  </button>
                </div>
              </div>

              {/* Form Fields in Clean 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Officer Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="e.g. Samuel Mukasa"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="official-title-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Official Designation / Title <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
                        {tier === 3
                          ? 'District Statutory Desks'
                          : tier === 2
                          ? 'Sub-County LLG Desks'
                          : tier === 1
                          ? 'Parish PDM Desks'
                          : 'Apex Statutory Desks'}
                      </span>
                    </div>

                    <input
                      ref={titleInputRef}
                      id="official-title-input"
                      type="text"
                      value={inviteTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInviteTitle(val);
                        const match = jurisdictionDesignations.find(
                          (d) => d.title.toLowerCase() === val.toLowerCase().trim()
                        );
                        if (match) {
                          setSelectedPresetId(match.id);
                        } else {
                          setSelectedPresetId('others');
                        }
                      }}
                      placeholder={
                        tier === 3
                          ? 'e.g. Senior Commercial Officer / Fisheries Officer'
                          : tier === 2
                          ? 'e.g. Parish Chief / Ward Agent / Community Development Officer'
                          : 'e.g. LC1 Chairperson / VHT Coordinator'
                      }
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none font-medium"
                    />

                    {/* Active Statutory Mandate Capsule */}
                    {selectedDesigObj && selectedPresetId !== 'others' && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2 text-left animate-fade-in">
                        <Shield size={14} className="text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight space-y-1">
                          <div>
                            <strong className="text-slate-900 dark:text-white font-semibold">{selectedDesigObj.title}</strong>
                            <span className="text-slate-500 dark:text-slate-400"> &bull; {selectedDesigObj.desc}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono pt-0.5">
                            <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-700 dark:text-slate-300">
                              Clearance: {roleLabels[selectedDesigObj.role] || selectedDesigObj.role}
                            </span>
                            {selectedDesigObj.category && (
                              <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                {selectedDesigObj.category}
                              </span>
                            )}
                            {selectedDesigObj.isUtility && (
                              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                Works / Utility Desk
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPresetId === 'others' && (
                      <p className="text-[10px] text-teal-600 dark:text-teal-400 mt-1 font-medium">
                        Custom Title Active &bull; Enter any statutory civil service designation above.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Official Phone / WhatsApp (For Dispatch)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Phone size={13} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="tel"
                          value={invitePhone}
                          onChange={(e) => setInvitePhone(e.target.value)}
                          placeholder="e.g. +256 772 123456"
                          className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Station &amp; Geographic Scope
                      </label>
                      {tier <= 3 && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                          <Lock size={10} /> Boundaries Enforced
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {/* District Selection */}
                      <select
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75"
                        disabled={tier <= 3}
                        value={district}
                        onChange={(e) => {
                          setDistrict(e.target.value);
                          setSubcounty('');
                          setParish('');
                        }}
                      >
                        <option value="">Select District…</option>
                        {dists.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.name} {tier <= 3 && x.id === districtObj.id ? '(Your District)' : ''}
                          </option>
                        ))}
                      </select>

                      {/* Sub-County Selection */}
                      <select
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75"
                        disabled={tier <= 2 || !district}
                        value={subcounty}
                        onChange={(e) => {
                          setSubcounty(e.target.value);
                          setParish('');
                        }}
                      >
                        <option value="">
                          {tier <= 2 ? subcountyObj?.name || 'Sub-County Jurisdiction' : 'Select Sub-County / Division…'}
                        </option>
                        {subs.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.name}
                          </option>
                        ))}
                      </select>

                      {/* Parish Selection */}
                      <select
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-75"
                        disabled={tier === 1 || !subcounty}
                        value={parish}
                        onChange={(e) => setParish(e.target.value)}
                      >
                        <option value="">
                          {tier === 1 ? parishObj?.name || 'Parish Field Desk' : 'Select Parish / Ward (Optional)…'}
                        </option>
                        {parishes.map((x) => (
                          <option key={x.id} value={x.id}>
                            {x.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Delegated Role */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Desk Role Delegation
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {assignableRoles.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setInviteRole(r)}
                          className={`py-1.5 px-2 rounded-lg text-xs mono font-bold border transition-all text-center ${
                            inviteRole === r
                              ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 ring-1 ring-teal-500/40'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {roleLabels[r]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUtility}
                    onChange={(e) => setIsUtility(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Infrastructure / Technical Branch Desk
                  </span>
                </label>

                <button
                  onClick={handleIssueInvite}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider mono transition-all shadow-sm flex items-center gap-2"
                >
                  <Send size={14} />
                  <span>Issue Statutory Credential &amp; Invite</span>
                </button>
              </div>

              {/* Statutory Credential & Transmittal Memo Dispatch CTA (Displayed strictly after an invitation is issued; disappears once dismissed or approved) */}
              {issuedCode && issuedInviteData && (
                <div className="mt-4 bg-teal-50/90 dark:bg-slate-800 border-2 border-teal-500/80 rounded-2xl p-5 space-y-4 shadow-md animate-fade-in">
                  <div className="flex items-start justify-between gap-3 border-b border-teal-200 dark:border-teal-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                        <Shield size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs mono font-black text-teal-950 dark:text-teal-200 uppercase tracking-wider">
                            Official Statutory Credential &amp; Transmittal Memo
                          </span>
                          <span className="text-[9px] mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                            Active on Gateway
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                          Issued pursuant to {issuedInviteData.legalBasis}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIssuedCode(null);
                        setIssuedInviteData(null);
                      }}
                      title="Dismiss notice"
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Designated Officer & Mandate Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-teal-100 dark:border-teal-900/60 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold mono block">Designated Officer</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{issuedInviteData.name}</span>
                      <div className="text-teal-700 dark:text-teal-300 font-semibold text-xs mt-0.5">
                        {issuedInviteData.title}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold mono block">Duty Station &amp; Clearance</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{issuedInviteData.dutyStation}</span>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {issuedInviteData.scopeNameStr} &bull; {roleLabels[issuedInviteData.role]}
                      </div>
                    </div>
                  </div>

                  {/* Single-Use Access Code Box */}
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-2 border-teal-400 dark:border-teal-600 rounded-xl p-3.5 shadow-2xs">
                    <div>
                      <div className="text-xl mono font-black text-teal-950 dark:text-teal-100 tracking-wider">
                        {issuedCode}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Single-use sovereign authentication key for civic governance gateway
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(issuedCode, 'Access code', (msg) => toast(msg))}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <Copy size={14} /> Copy Key
                    </button>
                  </div>

                  {/* Dispatch CTAs */}
                  <div className="space-y-2">
                    <span className="text-[10px] mono uppercase font-bold text-slate-500 tracking-wider block">
                      Immediate Dispatch Actions (Send to Officer)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/${(issuedInviteData.phone || invitePhone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `OFFICIAL STATUTORY APPOINTMENT & TRANSMITTAL MEMORANDUM\n` +
                          `--------------------------------------------------\n` +
                          `Designated Officer: ${issuedInviteData.name}\n` +
                          `Statutory Post: ${issuedInviteData.title}\n` +
                          `Duty Station: ${issuedInviteData.dutyStation}\n` +
                          `Legal Authority: ${issuedInviteData.legalBasis}\n\n` +
                          `Official Access Key: ${issuedCode}\n` +
                          `Direct Gateway Link: ${window.location.origin}${window.location.pathname}?gov_code=${issuedCode}\n\n` +
                          `You are formally authorized to mount your statutory desk. All municipal actions are digitally logged.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <MessageCircle size={15} />
                        <span>Dispatch via WhatsApp</span>
                      </a>

                      <button
                        onClick={() => {
                          const msg =
                            `OFFICIAL STATUTORY APPOINTMENT & TRANSMITTAL MEMORANDUM\n` +
                            `--------------------------------------------------\n` +
                            `Designated Officer: ${issuedInviteData.name}\n` +
                            `Statutory Post: ${issuedInviteData.title}\n` +
                            `Duty Station: ${issuedInviteData.dutyStation}\n` +
                            `Legal Authority: ${issuedInviteData.legalBasis}\n\n` +
                            `Official Access Key: ${issuedCode}\n` +
                            `Direct Gateway Link: ${window.location.origin}${window.location.pathname}?gov_code=${issuedCode}\n\n` +
                            `You are formally authorized to mount your statutory desk on the civic platform.`;
                          copyToClipboard(msg, 'Official Transmittal Memorandum', (m) => toast(m));
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <FileText size={15} />
                        <span>Copy Full Transmittal Memo</span>
                      </button>
                    </div>

                    {/* Primary Dismissal / Dispatched Action */}
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIssuedCode(null);
                          setIssuedInviteData(null);
                          toast('Invitation dispatched! Notice dismissed to keep workspace clean.', 'emerald');
                        }}
                        className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={14} className="text-emerald-400 dark:text-emerald-600" />
                        <span>Mark Dispatched &amp; Dismiss (Frees Space)</span>
                      </button>

                      <button
                        onClick={() => directLoginWithGovCode(issuedCode)}
                        title="Mount desk immediately"
                        className="py-2.5 px-3 bg-teal-100 dark:bg-teal-950/80 hover:bg-teal-200 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 text-xs font-bold rounded-xl transition-all border border-teal-300 dark:border-teal-700 flex items-center gap-1 shrink-0"
                      >
                        Mount
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Auto-Mint Mode */
            <div className="space-y-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/60 p-4 rounded-xl">
              <div>
                <span className="text-[9px] mono text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-300 font-bold uppercase">
                  Batch Delegation Engine
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-amber-200 mt-1">
                  {tier === 3
                    ? `1-Click Auto-Mint All Sub-Counties in ${districtObj.name}`
                    : tier === 2
                    ? `1-Click Auto-Mint All Parishes in ${subcountyObj?.name}`
                    : '1-Click National Node Auto-Mint'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Generates ready-to-dispatch sovereign keys for all subordinate accounting stations in one click.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const codePrefix = `${user.country.toUpperCase()}-${d.name.replace(/\s+/g, '').toUpperCase().slice(0, 4)}`;
                    let count = 0;

                    if (tier === 3) {
                      subs.forEach((sub) => {
                        const scCode = makeCode(codePrefix);
                        addInvite({
                          code: scCode,
                          name: `Sub-County Chief Desk (${sub.name})`,
                          title: `Senior Assistant Secretary (SAS), ${sub.name}`,
                          role: 'node_admin',
                          scope: sub.id,
                          dept: user.dept || 'molg',
                          is_utility: false,
                          used: false,
                          country: user.country,
                          hierarchy_level: 'tier2_subcounty',
                          escalation_rank: 2,
                        });
                        count++;
                      });
                      toast(`Minted ${count} codes for all sub-counties in ${districtObj.name}`, 'emerald');
                    } else if (tier === 2) {
                      parishes.forEach((p) => {
                        const pCode = makeCode(codePrefix);
                        addInvite({
                          code: pCode,
                          name: `Parish Chief Desk (${p.name})`,
                          title: `Parish Chief, ${p.name}`,
                          role: 'spokesperson',
                          scope: p.id,
                          dept: user.dept || 'molg',
                          is_utility: false,
                          used: false,
                          country: user.country,
                          hierarchy_level: 'tier1_parish',
                          escalation_rank: 1,
                        });
                        count++;
                      });
                      toast(`Minted ${count} codes for all parishes in ${subcountyObj?.name}`, 'emerald');
                    } else {
                      dists.slice(0, 10).forEach((dist) => {
                        const distCode = makeCode(codePrefix);
                        addInvite({
                          code: distCode,
                          name: `CAO Desk (${dist.name})`,
                          title: `Chief Administrative Officer, ${dist.name}`,
                          role: 'node_admin',
                          scope: dist.id,
                          dept: user.dept || 'molg',
                          is_utility: false,
                          used: false,
                          country: user.country,
                          hierarchy_level: 'tier3_district_cao',
                          escalation_rank: 3,
                        });
                        count++;
                      });
                      toast(`Minted ${count} district node codes`, 'emerald');
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider mono transition-all shadow-sm"
                >
                  Execute Batch Minting
                </button>
                <button
                  onClick={() => go('gov_bulk')}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Upload size={13} />
                  <span>Upload Staff CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: AWAITING REDEMPTION / UNCLAIMED CODES QUEUE                    */}
      {/* ========================================================================= */}
      {openInv.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key size={15} className="text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Awaiting First Login / Unclaimed Codes ({openInv.length})
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Codes stay active until officer mounts desk</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {openInv.map((c, idx) => (
              <div
                key={`${c.code}-${idx}`}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs mono font-black text-teal-800 dark:text-teal-300 tracking-wider">
                      {c.code}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                      Pending
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{c.title} &bull; {scopeName(user.country, c.scope)}</div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const enlisted = acceptInvite(c.code);
                      if (enlisted) {
                        toast(`${c.name} accepted statutory invite! Enlisted into ACTIVE section.`, 'emerald');
                      }
                    }}
                    className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-colors"
                    title="Simulate or Confirm Official Acceptance"
                  >
                    <CheckCircle2 size={12} />
                    <span className="hidden sm:inline">Enlist</span>
                  </button>

                  <button
                    onClick={() => {
                      setIssuedInviteData({
                        code: c.code,
                        name: c.name,
                        title: c.title,
                        phone: c.phone,
                        scope: c.scope,
                        scopeNameStr: scopeName(user.country, c.scope),
                        legalBasis:
                          tier === 5
                            ? 'Article 174 of the Constitution & Public Finance Management Act'
                            : tier === 3
                            ? 'Section 64 of the Local Governments Act (Cap. 243)'
                            : tier === 2
                            ? 'Section 69 of the Local Governments Act (Cap. 243)'
                            : 'Section 45 of the Local Governments Act (Cap. 243) & PDM Framework',
                        dutyStation: c.duty_station || scopeName(user.country, c.scope),
                        mandate: c.mandate,
                        role: c.role,
                      });
                      setIssuedCode(c.code);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 text-[10px] font-bold border border-slate-200 dark:border-slate-600 flex items-center gap-1 shadow-2xs"
                    title="Open Dispatch Notice CTA"
                  >
                    <FileText size={12} />
                    <span className="hidden sm:inline">Memo</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(c.code, 'Access code', (msg) => toast(msg))}
                    className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 shadow-2xs"
                    title="Copy code"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    onClick={() => {
                      revokeInvite(c.code);
                      toast(`Invite ${c.code} revoked. Position returned to Vacant.`, 'amber');
                    }}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 shadow-2xs"
                    title="Revoke / Recall Invite"
                  >
                    <XCircle size={13} />
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Official Access Code for ${c.name} (${c.title}): ${c.code}\nLink: ${window.location.origin}${window.location.pathname}?gov_code=${c.code}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-2xs"
                    title="WhatsApp dispatch"
                  >
                    <MessageCircle size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SUPERVISED ACTIVE TEAM ROSTER & MANAGEMENT                      */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck size={18} className="text-teal-600" />
              <span>Supervised Team Personnel</span>
              <span className="text-xs font-normal text-slate-500">({allSupervisedTeam.length} total)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Manage appointments, transfer desks, reassign stations, and stand down personnel.
            </p>
          </div>

          {/* Filter Pill Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({allSupervisedTeam.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('stood_down')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'stood_down'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Stood down ({stoodDownCount})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by officer name, title, telephone, or station..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none shadow-2xs"
          />
        </div>

        {/* Team Members List */}
        {filteredTeam.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-center space-y-2">
            <UserMinus size={28} className="mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No personnel found matching the filter criteria.
            </p>
            <p className="text-[11px] text-slate-500">
              Use the appointment panel above to onboard officers to your statutory station.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTeam.map((m, idx) => {
              const isDirectSubordinate =
                tier === 5 ||
                (tier === 3 && m.scope !== 'UG' && m.role !== 'platform_admin') ||
                (tier === 2 && m.role === 'spokesperson' && m.scope !== districtObj.id);

              return (
                <div
                  key={`${m.id}-${idx}`}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    {/* Left Column: Officer Identity & Station */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {m.name}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            m.active
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {m.active ? 'Active on Duty' : 'Stood Down / Inactive'}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {isDirectSubordinate ? 'Direct Report' : 'Jurisdiction Personnel'}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                        {m.title}
                      </div>

                      <div className="flex items-center gap-3 flex-wrap text-[11px] text-slate-500 pt-0.5">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span>Station: <strong>{scopeName(user.country, m.scope)}</strong></span>
                        </div>
                        {m.contact_phone && (
                          <div className="flex items-center gap-1 font-mono">
                            <Phone size={11} className="text-slate-400" />
                            <span>{m.contact_phone}</span>
                          </div>
                        )}
                        {m.email && (
                          <div className="flex items-center gap-1">
                            <Mail size={11} className="text-slate-400" />
                            <span>{m.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Stand Down Details if Stood Down */}
                      {!m.active && (
                        <div className="p-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-[11px] text-rose-900 dark:text-rose-300 mt-1">
                          <strong>Stood Down:</strong> Reason: {m.reason || 'Transferred'}. {m.note ? `Note: ${m.note}` : ''}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Platform Role & Fast Actions */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-[10px] mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800" style={{ color: roleColors[m.role] }}>
                        {roleLabels[m.role]}
                      </span>

                      {/* Direct WhatsApp Action if phone available */}
                      {m.contact_phone && (
                        <a
                          href={`https://wa.me/${m.contact_phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold"
                        >
                          <MessageCircle size={12} /> WhatsApp Official
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Supervisor Management Action Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] text-slate-400">
                      Joined {m.joined}
                    </span>

                    {isDirectSubordinate ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* 1. Replace Officer / Handover Desk */}
                        <button
                          onClick={() => handleOpenReplaceModal(m)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 flex items-center gap-1 shadow-2xs"
                        >
                          <RefreshCw size={12} />
                          <span>Replace Officer</span>
                        </button>

                        {/* 2. Re-issue / Rotate Access Code */}
                        <button
                          onClick={() => handleReissueCode(m)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1 shadow-2xs"
                          title="Generate a replacement access code if official lost their device"
                        >
                          <Key size={12} />
                          <span>Re-issue Code</span>
                        </button>

                        {/* 3. Edit Details */}
                        <button
                          onClick={() => handleOpenEditModal(m)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1 shadow-2xs"
                        >
                          <Edit3 size={12} />
                          <span>Edit</span>
                        </button>

                        {/* 4. Stand Down or Reinstate */}
                        {m.active ? (
                          <button
                            onClick={() =>
                              setStandDownTarget({ id: m.id, name: m.name, reason: 'transferred', note: '' })
                            }
                            className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 flex items-center gap-1 shadow-2xs"
                          >
                            <UserMinus size={12} />
                            <span>Stand down</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => reinstateTeamMember(m.id)}
                            className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1 shadow-2xs"
                          >
                            <UserCheck size={12} />
                            <span>Reinstate</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] mono text-slate-400">
                        Supervised directly by Line Ministry / PS
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: REPLACE OFFICER & HANDOVER DESK                                  */}
      {/* ========================================================================= */}
      {replaceTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RefreshCw size={18} className="text-teal-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Handover Desk &amp; Appoint Successor
                </h3>
              </div>
              <button
                onClick={() => setReplaceTarget(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Outgoing Officer Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
              <div className="text-[10px] mono uppercase text-slate-400 font-bold">Outgoing Desk Holder</div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">{replaceTarget.name}</div>
              <div className="text-slate-600 dark:text-slate-300">{replaceTarget.title} &bull; {scopeName(user.country, replaceTarget.scope)}</div>
            </div>

            {/* Handover Form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Incoming Successor Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={successorName}
                  onChange={(e) => setSuccessorName(e.target.value)}
                  placeholder="e.g. Grace Achan"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="successor-title-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Successor Title / Designation <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSuccessorTitle(replaceTarget.title)}
                      className="text-[10px] text-teal-600 hover:text-teal-700 font-bold"
                    >
                      Retain: {replaceTarget.title}
                    </button>
                  </div>
                  <input
                    id="successor-title-input"
                    type="text"
                    value={successorTitle}
                    onChange={(e) => setSuccessorTitle(e.target.value)}
                    placeholder={`e.g. ${replaceTarget.title}`}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Telephone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={successorPhone}
                    onChange={(e) => setSuccessorPhone(e.target.value)}
                    placeholder="+256 772 000000"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Reason for Outgoing Officer Handover
                </label>
                <select
                  value={handoverReason}
                  onChange={(e) => setHandoverReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="transferred">Transferred to another station</option>
                  <option value="promoted">Promoted to higher office</option>
                  <option value="retired">Retired from civil service</option>
                  <option value="contract_ended">Contract ended</option>
                  <option value="resigned">Resigned</option>
                  <option value="dismissed">Dismissed</option>
                  <option value="other">Other statutory adjustment</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Handover Notes / Memo (Optional)
                </label>
                <input
                  type="text"
                  value={handoverNote}
                  onChange={(e) => setHandoverNote(e.target.value)}
                  placeholder="e.g. Effective Oct 1st. Handed over 12 ongoing ward projects."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Upon confirmation, <strong>{replaceTarget.name}</strong> will be marked as stood down (transferred), <strong>{successorName || 'the successor'}</strong> will be added to the active roster, and a fresh single-use access code will be minted. All historical tickets remain intact.
            </p>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setReplaceTarget(null)}
                className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-2.5 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReplace}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl py-2.5 text-xs shadow-sm"
              >
                Confirm Desk Handover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HANDOVER SUCCESS & DISPATCH SCREEN */}
      {handoverSuccessResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-teal-500 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl animate-scale-up">
            <div className="flex items-center gap-2 text-teal-600">
              <CheckCircle2 size={22} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Desk Handover Completed!
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The desk for <strong>{scopeName(user.country, handoverSuccessResult.newMember.scope)}</strong> has been officially transferred from <strong>{handoverSuccessResult.oldMemberName}</strong> to <strong>{handoverSuccessResult.newMember.name}</strong>.
            </p>

            <div className="bg-teal-50 dark:bg-slate-800 p-4 rounded-xl border border-teal-200 dark:border-teal-700 space-y-2">
              <span className="text-[10px] mono uppercase text-teal-800 dark:text-teal-400 font-bold">
                Successor Gateway Access Code
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xl mono font-black text-teal-900 dark:text-teal-200 tracking-wider">
                  {handoverSuccessResult.code}
                </span>
                <button
                  onClick={() => copyToClipboard(handoverSuccessResult.code, 'Access code', (m) => toast(m))}
                  className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Copy size={13} /> Copy
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const memo = `CIVICDUTY SUCCESSOR APPOINTMENT\nStation: ${scopeName(user.country, handoverSuccessResult.newMember.scope)}\nNew Officer: ${handoverSuccessResult.newMember.name}\nAccess Code: ${handoverSuccessResult.code}\nLink: ${window.location.origin}${window.location.pathname}?gov_code=${handoverSuccessResult.code}\n\nPrevious desk holder (${handoverSuccessResult.oldMemberName}) stood down.`;
                  copyToClipboard(memo, 'Handover Dispatch Memo', (m) => toast(m));
                }}
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5"
              >
                <FileText size={14} />
                <span>Copy Dispatch Memo</span>
              </button>

              <a
                href={`https://wa.me/${(handoverSuccessResult.newMember.contact_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `CIVICDUTY SUCCESSOR APPOINTMENT\nStation: ${scopeName(user.country, handoverSuccessResult.newMember.scope)}\nOfficer: ${handoverSuccessResult.newMember.name}\nAccess Code: ${handoverSuccessResult.code}\nLink: ${window.location.origin}${window.location.pathname}?gov_code=${handoverSuccessResult.code}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Successor</span>
              </a>
            </div>

            <button
              onClick={() => setHandoverSuccessResult(null)}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2.5 rounded-xl text-xs"
            >
              Done &bull; Return to Roster
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT OFFICER RECORD                                              */}
      {/* ========================================================================= */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 size={16} className="text-teal-600" />
                <span>Edit Officer Record</span>
              </h3>
              <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Official Designation / Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Official Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditTarget(null)}
                className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-2 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEdit}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl py-2 text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RE-ISSUE CODE MODAL                                              */}
      {/* ========================================================================= */}
      {reissueResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-teal-500 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl animate-scale-up">
            <div className="flex items-center gap-2 text-teal-600">
              <Key size={20} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Replacement Access Code Minted
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              A fresh gateway access code has been minted for <strong>{reissueResult.member.name}</strong> ({reissueResult.member.title}).
            </p>

            <div className="bg-teal-50 dark:bg-slate-800 p-3.5 rounded-xl border border-teal-200 dark:border-teal-700 flex items-center justify-between">
              <span className="text-xl mono font-black text-teal-900 dark:text-teal-200 tracking-wider">
                {reissueResult.code}
              </span>
              <button
                onClick={() => copyToClipboard(reissueResult.code, 'Access code', (m) => toast(m))}
                className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Copy size={13} /> Copy
              </button>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://wa.me/${(reissueResult.member.contact_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `CIVICDUTY REPLACEMENT ACCESS CODE\nHello ${reissueResult.member.name}, your new official access code is: ${reissueResult.code}\nLink: ${window.location.origin}${window.location.pathname}?gov_code=${reissueResult.code}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5"
              >
                <MessageCircle size={14} />
                <span>WhatsApp to Officer</span>
              </a>
              <button
                onClick={() => setReissueResult(null)}
                className="border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: STAND-DOWN DESK CONFIRMATION                                     */}
      {/* ========================================================================= */}
      {standDownTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-rose-500 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl animate-scale-up">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle size={20} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Stand Down Official Desk
              </h3>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              Revoking active authority for <strong>{standDownTarget.name}</strong>. Access to the sovereign desk is frozen immediately.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] mono uppercase text-slate-500 font-bold block">
                Statutory Reason <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {STAND_DOWN_REASONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setStandDownTarget({ ...standDownTarget, reason: r.id })}
                    className={`py-2 px-2 rounded-lg text-xs mono font-bold border transition-all ${
                      standDownTarget.reason === r.id
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] mono uppercase text-slate-500 font-bold block mb-1">
                Handover Note (Optional)
              </label>
              <input
                type="text"
                value={standDownTarget.note}
                onChange={(e) => setStandDownTarget({ ...standDownTarget, note: e.target.value })}
                placeholder={`e.g. Transferred to ${districtObj.name} District HQ`}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              All historical resolutions, replies, and audit logs written by this officer remain permanently sealed for statutory accountability.
            </p>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setStandDownTarget(null)}
                className="flex-1 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl py-2 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStandDown}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl py-2 text-xs shadow-sm"
              >
                Confirm Stand Down
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guidance Note Box */}
      <NoteBox
        tone="emerald"
        title="Revoke, Never Delete"
        text="Under public finance and civil service regulations, personnel records are stood down rather than deleted. This preserves historical resolution signatures, audit trails, and citizen report milestones."
      />
    </div>
  );
};
