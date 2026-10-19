import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { catByID, getDept, pathStr, slaStatus, srcLabel, timeAgo } from '../utils/helpers';
import { AccountabilityDocket } from '../components/AccountabilityDocket';
import {
  AlertTriangle,
  Lock,
  Paperclip,
  UserPlus,
  Users,
  Gift,
  Zap,
  MapPin,
  QrCode,
  X,
  CheckCircle2,
  Send,
  Copy,
  Phone,
  Award,
  Globe,
  Layers,
  Radio,
  Plus,
  Store,
  Building2,
  Briefcase,
  Bell,
  Check,
  ShieldCheck,
  ChevronRight,
  FileText,
  Sparkles,
  SlidersHorizontal,
  MessageSquare,
  Search,
  Share2,
  Printer,
  ExternalLink,
  Edit3,
  Clock,
  ArrowUpRight,
  CheckCircle,
} from 'lucide-react';
import { tiersFor } from '../data/tiers';
import { getCountryPerks } from '../data/countryPerks';
import { MerchantLoyaltyStudio } from '../components/MerchantLoyaltyStudio';
import { DeptIcon } from '../components/DeptIcon';
import { COUNTRIES } from '../data/countries';

export const GovInboxView: React.FC = () => {
  const {
    user,
    posts,
    teamMembers,
    govTab,
    setGovTab,
    setActivePost,
    go,
    updatePostStatus,
    logAudit,
    toast,
    activeDeptCountry,
    mergeDuplicatePostsIntoDossier,
    townHalls,
    setActiveTownHall,
    setHostBarazaModalOpen,
    govFeedbackMessages,
    addGovFeedbackMessage,
    endorseModificationForCdOps,
    rejectModificationBySuperadmin,
    showDemos,
    projects,
  } = useApp();
  const [mergeTargetId, setMergeTargetId] = useState<string | null>(null);
  const [selectedDupToMerge, setSelectedDupToMerge] = useState<string>('');
  const [showModRequestForm, setShowModRequestForm] = useState(false);
  const [modSubject, setModSubject] = useState('');
  const [modBody, setModBody] = useState('');
  const [modPriority, setModPriority] = useState<'routine' | 'urgent' | 'statutory_directive'>('routine');

  // Dedicated Private Provider Desk State (for Schools, Restaurants, Hospitals, Commercial Desks)
  const [providerDeskTab, setProviderDeskTab] = useState<
    'tickets' | 'merchant_pos' | 'bulletins' | 'projects' | 'team' | 'perks' | 'profile'
  >('tickets');
  const [providerTicketSearch, setProviderTicketSearch] = useState('');
  const [replyTicket, setReplyTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<'investigating' | 'resolved'>('resolved');

  // Cashier POS Quick Terminal State
  const [posCodeInput, setPosCodeInput] = useState('');
  const [posValidationResult, setPosValidationResult] = useState<{
    success: boolean;
    code: string;
    description: string;
    discountValue: string;
    awardedPoints: number;
    timestamp: string;
  } | null>(null);

  // Official Institutional Circulars / Bulletins State
  const [bulletinTitle, setBulletinTitle] = useState('');
  const [bulletinBody, setBulletinBody] = useState('');
  const [bulletinCategory, setBulletinCategory] = useState<'academic' | 'notice' | 'calendar' | 'menu'>('notice');
  const [bulletins, setBulletins] = useState<
    { id: string; title: string; body: string; date: string; category: string; officer: string }[]
  >(() => {
    const isSchool =
      user?.dept === 'gayaza_hs' ||
      user?.dept === 'namagunga' ||
      user?.dept === 'mak_univ' ||
      user?.organization_name?.toLowerCase().includes('school') ||
      user?.organization_name?.toLowerCase().includes('college');
    const isRestaurant =
      user?.dept === 'cafe_javas' ||
      user?.dept === 'serena_hotel_kla' ||
      user?.organization_name?.toLowerCase().includes('javas') ||
      user?.organization_name?.toLowerCase().includes('hotel');
    if (isSchool) {
      return [
        {
          id: 'b-01',
          title: 'Term 1 2026 Academic Circular & Mandatory Student Reporting Protocol',
          body: 'All students and parents are reminded that reporting for Term 1 commences on Monday, 2nd February 2026. Boarding luggage inspection, science laboratory coats, and cleared school fee bank vouchers must be presented at the administrative checkpoint.',
          date: '2026-01-18',
          category: 'academic',
          officer: user?.name || 'Robinah Kizito (Head Teacher)',
        },
        {
          id: 'b-02',
          title: 'Senior One Admissions List & Merit Bursary Scholarship Orientation',
          body: 'The list of admitted Senior One students is now officially gazetted. Parents and guardians are invited for the orientation symposium scheduled for Saturday, 24th January 2026 in the school chapel hall.',
          date: '2026-01-15',
          category: 'calendar',
          officer: user?.name || 'Robinah Kizito (Head Teacher)',
        },
      ];
    }
    if (isRestaurant) {
      return [
        {
          id: 'b-01',
          title: 'Artisan Coffee Harvest & Seasonal Gourmet Bakery Menu Announcement',
          body: 'Our master baristas and pastry chefs have launched the 2026 Bugisu Arabica Single-Origin Brew and Warm Salted Caramel Brioche. Present your CivicDuty 10% voucher code at the cashier counter across all Kampala and Entebbe locations.',
          date: '2026-01-17',
          category: 'menu',
          officer: user?.name || 'Customer Experience Lead',
        },
      ];
    }
    return [
      {
        id: 'b-01',
        title: 'Official Customer Service Charter & 24hr Target Commitment',
        body: 'In accordance with our CivicDuty verified provider service tier, all citizen tickets submitted to this desk receive guaranteed review within 24–48 hours. Thank you for your continued partnership.',
        date: '2026-01-16',
        category: 'notice',
        officer: user?.name || 'Desk Administrator',
      },
    ];
  });

  const activeCountry = user?.country || activeDeptCountry || 'UG';
  const countryPerks = getCountryPerks(activeCountry);

  const [dispatchModal, setDispatchModal] = useState<'none' | 'digital' | 'physical'>('none');
  const [recipient, setRecipient] = useState(
    `${countryPerks.sampleCitizens[0]?.name} (${countryPerks.sampleCitizens[0]?.phone}) - ${countryPerks.sampleCitizens[0]?.location}`
  );
  const [perkType, setPerkType] = useState(countryPerks.digitalPerks[0]?.id || 'data');
  const [perkCode, setPerkCode] = useState(countryPerks.digitalPerks[0]?.code || 'CIVIC-VOUCHER-01');
  const [hqRoom, setHqRoom] = useState(countryPerks.hqRoom);
  const [officerName, setOfficerName] = useState('Parish Admin Desk Officer');
  const [prizeType, setPrizeType] = useState('Parish Watchdog Honor Plaque & Solar Lantern');
  const [dispatchSuccess, setDispatchSuccess] = useState<{
    type: 'digital' | 'physical';
    code: string;
    recipient: string;
    details: string;
  } | null>(null);

  // Update defaults if active country changes
  useEffect(() => {
    if (countryPerks) {
      setRecipient(
        `${countryPerks.sampleCitizens[0]?.name} (${countryPerks.sampleCitizens[0]?.phone}) - ${countryPerks.sampleCitizens[0]?.location}`
      );
      setPerkType(countryPerks.digitalPerks[0]?.id || 'data');
      setPerkCode(countryPerks.digitalPerks[0]?.code || 'CIVIC-VOUCHER-01');
      setHqRoom(countryPerks.hqRoom);
    }
  }, [activeCountry]);

  if (!user) return null;

  const d = getDept(user.country, user.dept || 'kcca');
  const isNationalScope =
    !user.scope ||
    user.scope.toUpperCase() === user.country.toUpperCase() ||
    user.scope.toUpperCase() === 'NATIONAL' ||
    user.scope.toUpperCase().startsWith('PS-') ||
    user.role === 'platform_admin';

  const queue = posts.filter((p) => {
    if (p.country !== user.country) return false;
    if (!showDemos && p.is_demo && p.dept !== user.dept) return false;

    // 1. Direct department or private provider desk match (Gayaza High, NWSC, Café Javas, St. Mary's Namagunga, etc.)
    if (user.dept && p.dept === user.dept) {
      return true;
    }

    // 2. MoFPED statutory treasury / revenue audit oversight
    if (user.dept === 'mofped' && (p.category === 'finance' || p.dept === 'ura' || p.is_corruption)) {
      return true;
    }

    // 3. Local Territorial scope matching for decentralized local government administrators (CAO, Town Clerk, Parish Chief)
    if (!isNationalScope && user.scope && !user.is_utility && user.entity_type !== 'non_government_entity') {
      const sc = user.scope.toLowerCase();
      const scLabelFirst = (user.scope_label || '').split(/[ ·,(]/)[0].trim().toLowerCase();
      const matchesTerritory =
        p.territory?.district?.toLowerCase() === sc ||
        p.territory?.subcounty?.toLowerCase() === sc ||
        p.territory?.parish?.toLowerCase() === sc ||
        (scLabelFirst.length >= 3 && (p.location || '').toLowerCase().includes(scLabelFirst));
      return matchesTerritory;
    }

    // 4. National scope fallback
    return isNationalScope && (p.dept === user.dept || user.role === 'platform_admin');
  });

  const isRO = user.role === 'read_only';
  const canInvite = ['node_admin', 'platform_admin'].includes(user.role) || user.is_admin;
  const myTeam = teamMembers ? teamMembers.filter((m) => m.dept === user.dept) : [];

  const filterQueue = (q: typeof posts, tab: string) => {
    switch (tab) {
      case 'all':
        return q;
      case 'pending':
        return q.filter((p) => p.status === 'pending' || p.gov_status === 'pending' || p.gov_status === 'received');
      case 'overdue':
        return q.filter((p) => p.escalated || p.status === 'overdue');
      case 'investigating':
        return q.filter((p) => p.gov_status === 'investigating');
      case 'corruption':
        return q.filter((p) => p.category === 'corruption');
      case 'resolved':
        return q.filter((p) => p.status === 'resolved');
      default:
        return q;
    }
  };

  const filtered = filterQueue(queue, govTab);

  const total = queue.length;
  const resolvedCount = queue.filter((p) => p.status === 'resolved').length;
  const pendingCount = queue.filter((p) => p.status !== 'resolved').length;
  const overdueCount = queue.filter((p) => p.escalated || p.status === 'overdue').length;
  const corruptionCount = queue.filter((p) => p.category === 'corruption').length;
  const resPct = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  const statusChip = (s: string) => {
    const m: Record<string, string> = {
      pending: 'ch-pending',
      received: 'ch-received',
      investigating: 'ch-invest',
      budget: 'ch-budget',
      resolved: 'ch-resolved',
      overdue: 'ch-overdue',
      cannot: 'ch-cannot',
    };
    const l: Record<string, string> = {
      pending: 'Pending',
      received: 'Received',
      investigating: 'Investigating',
      budget: 'Budget Alloc.',
      resolved: 'Resolved',
      overdue: 'Overdue',
      cannot: 'Cannot Fix',
    };
    return <span className={`chip ${m[s] || 'ch-pending'}`}>{l[s] || s}</span>;
  };

  const isPrivateProvider = Boolean(
    user.entity_type === 'non_government_entity' ||
      user.dept?.startsWith('ent-') ||
      user.entity_category ||
      d.lane === 'consumer' ||
      ['gayaza_hs', 'namagunga', 'cafe_javas', 'mak_univ', 'mulago_hosp', 'nakasero_hosp', 'serena_hotel_kla', 'stanbic', 'centenary_bank', 'kotsa_taxi', 'kigo_contractors'].includes(user.dept || '') ||
      (d.category &&
        [
          'private_utility',
          'telecom',
          'banking',
          'transport',
          'hospitality',
          'education_private',
          'education',
          'health_private',
          'health',
          'private_contractor',
          'ngo',
        ].includes(d.category))
  );

  const isMinister = Boolean(
    user.real_title_short?.includes('Minister') ||
      user.role_label?.includes('Minister') ||
      user.deskCode?.includes('-MIN') ||
      user.deskCode === 'UG-MOLG-CABINET-MIN' ||
      user.deskCode === 'UG-MOLG-STATE-MIN'
  );

  const isGrassrootsChief = Boolean(
    user.role === 'parish_chief' ||
      user.deskCode?.includes('PARISH') ||
      user.deskCode?.includes('WARD') ||
      user.hierarchy_level === 'tier1_lowest' ||
      user.real_title_short?.toLowerCase().includes('parish chief') ||
      user.real_title_short?.toLowerCase().includes('ward admin')
  );

  const isSuperAdmin = Boolean(
    !isMinister &&
    (user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec') &&
    (user.officer_name?.includes('Kumumanya') ||
      user.real_title_short?.includes('PS') ||
      user.role_label?.includes('Permanent Secretary') ||
      user.deskCode === 'UG-MOLG-PS-011' ||
      user.deskCode === 'PS-MOLG-2026' ||
      user.deskCode === 'PS-MOLG-ROLLOUT')
  );

  // =========================================================================
  // DEDICATED PRIVATE PROVIDER DESK VIEW (Gayaza High, Namagunga, Café Javas, etc.)
  // =========================================================================
  if (isPrivateProvider) {
    const deptProjects = (projects || []).filter(
      (p) => p.dept === user.dept || p.contractor?.toLowerCase().includes((user.organization_name || '').toLowerCase())
    );

    const filteredProviderQueue = queue.filter((p) => {
      if (providerTicketSearch.trim()) {
        const q = providerTicketSearch.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.body?.toLowerCase().includes(q) ||
          p.author?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
        );
      }
      return true;
    });

    const isSchool =
      user.dept === 'gayaza_hs' ||
      user.dept === 'namagunga' ||
      user.dept === 'mak_univ' ||
      user.organization_name?.toLowerCase().includes('school') ||
      user.organization_name?.toLowerCase().includes('college');
    const isRestaurant =
      user.dept === 'cafe_javas' ||
      user.dept === 'serena_hotel_kla' ||
      user.organization_name?.toLowerCase().includes('javas') ||
      user.organization_name?.toLowerCase().includes('hotel');

    const sampleFacilityProjects = deptProjects.length > 0 ? deptProjects : isSchool ? [
      {
        id: 'proj-sch-01',
        title: `${user.organization_name || 'School'} STEM Innovation Centre & Robotics Lab`,
        tender_ref: 'TND-2026-STEM-01',
        contractor: 'Seyani Brothers Civil Engineering Ltd',
        value_curr: 'UGX',
        value_amt: 450000000,
        status: 'active',
        progress: 75,
        location: `${d.location || 'Wakiso District'}`,
        start_date: '2025-09-01',
        end_date: '2026-04-30',
        dept: user.dept,
      },
      {
        id: 'proj-sch-02',
        title: 'Senior Boarding Dormitory Refurbishing & Fire Suppression System',
        tender_ref: 'TND-2026-DORM-02',
        contractor: 'Kigo Infrastructure Contractors',
        value_curr: 'UGX',
        value_amt: 180000000,
        status: 'active',
        progress: 90,
        location: `${d.location || 'Wakiso District'}`,
        start_date: '2025-11-15',
        end_date: '2026-02-28',
        dept: user.dept,
      },
      {
        id: 'proj-sch-03',
        title: 'Clean Solar Microgrid & Automated Borehole Water System',
        tender_ref: 'TND-2026-SOLAR-03',
        contractor: 'Equator Green Utilities Ltd',
        value_curr: 'UGX',
        value_amt: 120000000,
        status: 'completed',
        progress: 100,
        location: `${d.location || 'Wakiso District'}`,
        start_date: '2025-06-01',
        end_date: '2025-12-20',
        dept: user.dept,
      },
    ] : [
      {
        id: 'proj-cj-01',
        title: `${user.organization_name || 'Provider'} Customer Experience & Cold Storage Facility`,
        tender_ref: 'TND-2026-EXP-01',
        contractor: 'City Build Works Ltd',
        value_curr: 'UGX',
        value_amt: 320000000,
        status: 'active',
        progress: 85,
        location: `${d.location || 'Kampala Central'}`,
        start_date: '2025-08-01',
        end_date: '2026-03-31',
        dept: user.dept,
      },
    ];

    return (
      <div className="animate-fade-in pb-16 max-w-5xl mx-auto px-3 sm:px-4 text-slate-900 dark:text-slate-100 space-y-4 pt-3">
        {/* PROVIDER DESK HEADER BANNER */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <DeptIcon dept={d} size={30} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-black text-slate-950 dark:text-white tracking-tight">
                    {user.organization_name || d.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck size={11} />
                    <span>{d.qualityAudit || 'Verified Provider Desk'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {(d as any).categoryLabel || (d as any).sector || 'Commercial & Institutional'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {user.name || user.real_title_short || 'Verified Officer'}
                  </span>
                  <span>·</span>
                  <span>{user.role_label || 'Executive Desk'}</span>
                  <span>·</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                    {user.scope === 'national'
                      ? 'National Tier · Unlimited Seats'
                      : user.scope === 'subcounty'
                      ? 'Sub-County Tier · Unlimited Seats'
                      : 'Parish Tier · 2 Seats'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Official provider terminal for <strong>{user.organization_name || d.name}</strong>. Manage incoming customer tickets, validate cashier POS vouchers &amp; discounts, broadcast school/business bulletins, track facility works, and disburse monthly top-3 merit rewards.
                </p>
              </div>
            </div>

            {/* Quick Desk Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setProviderDeskTab('merchant_pos')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Store size={13} />
                <span>Cashier POS Desk</span>
              </button>
              <button
                type="button"
                onClick={() => go('entity_team')}
                className="px-3 py-1.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Users size={13} className="text-emerald-600" />
                <span>Team ({myTeam.length})</span>
              </button>
              <button
                type="button"
                onClick={() => go('perk_vault')}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Award size={13} />
                <span>5-Vault Perks</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Docket */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] text-xs">
            <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Active Inquiries</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">{pendingCount}</div>
              <div className="text-[9.5px] text-slate-400 font-mono">Awaiting resolution</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Target SLA</div>
              <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {d.sla || 48} Hours
              </div>
              <div className="text-[9.5px] text-slate-400 font-mono">Service guarantee</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Resolution Rate</div>
              <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">{resPct}%</div>
              <div className="text-[9.5px] text-slate-400 font-mono">Quality standard</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Staff Capacity</div>
              <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">Unlimited</div>
              <div className="text-[9.5px] text-slate-400 font-mono">National active tier</div>
            </div>
          </div>
        </div>

        {/* PROVIDER DESK INTERACTIVE TABS */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-[#e3e6ea] dark:border-[#262b36] scrollbar-thin">
          {[
            { id: 'tickets' as const, label: isSchool ? `Parent & Student Inquiries (${queue.length})` : `Inquiries & Tickets (${queue.length})`, icon: MessageSquare },
            { id: 'merchant_pos' as const, label: 'Merchant Studio & Cashier POS Desk', icon: Store, badge: 'Active' },
            { id: 'bulletins' as const, label: isSchool ? `School Circulars & Gazette (${bulletins.length})` : `Public Bulletins (${bulletins.length})`, icon: Bell },
            { id: 'projects' as const, label: isSchool ? `Campus Works & Upgrades (${sampleFacilityProjects.length})` : `Facility Projects (${sampleFacilityProjects.length})`, icon: Briefcase },
            { id: 'team' as const, label: isSchool ? `Academic Staff Roster (${myTeam.length})` : `Staff Roster (${myTeam.length})`, icon: Users },
            { id: 'perks' as const, label: 'Monthly Merit Vault Rewards', icon: Award },
            { id: 'profile' as const, label: 'Desk Settings & Tier', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = providerDeskTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProviderDeskTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isTabActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.badge && !isTabActive && (
                  <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* TAB 1: TICKETS & INQUIRIES QUEUE */}
        {/* ================================================================= */}
        {providerDeskTab === 'tickets' && (
          <div className="space-y-3">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white dark:bg-[#161a22] p-3 rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={providerTicketSearch}
                  onChange={(e) => setProviderTicketSearch(e.target.value)}
                  placeholder={isSchool ? 'Search parent complaints, admission inquiries, student requests...' : 'Search customer tickets, inquiries, order codes...'}
                  className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                {providerTicketSearch && (
                  <button
                    type="button"
                    onClick={() => setProviderTicketSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {['all', 'pending', 'investigating', 'resolved'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setGovTab(st as any)}
                    className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono uppercase font-bold transition-colors cursor-pointer ${
                      govTab === st
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Cards List */}
            {filteredProviderQueue.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#161a22] border border-dashed border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">All Tickets Resolved</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {user.organization_name || d.name} has no pending inquiries matching this filter. Good job maintaining a 100% customer response record!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredProviderQueue.map((t) => {
                  const cat = catByID(t.category);
                  const isResolved = t.status === 'resolved' || t.gov_status === 'resolved';
                  const isInvestigating = t.gov_status === 'investigating';
                  return (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/50 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                              style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                            >
                              {cat.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {t.created_at ? timeAgo(t.created_at) : 'Recent'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                isResolved
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                                  : isInvestigating
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-400'
                              }`}
                            >
                              {isResolved ? 'Resolved' : isInvestigating ? 'In Progress' : 'Pending Review'}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                            {t.title}
                          </h3>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {t.body}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 block">Filed by</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[130px]">
                            {t.author || 'Parent / Citizen'}
                          </span>
                          <span className="text-[9.5px] font-mono text-slate-500 block truncate max-w-[130px]">
                            {t.location || d.location || 'Local'}
                          </span>
                        </div>
                      </div>

                      {/* Official Institutional Reply Button */}
                      <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                          <Clock size={12} className="text-emerald-600" />
                          <span>Guaranteed {d.sla || 48}hr Response Target</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePost(t);
                              go('post_detail');
                            }}
                            className="px-2.5 py-1 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-mono"
                          >
                            View Thread
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReplyTicket(t);
                              setReplyText(`Thank you for bringing this matter to the attention of ${user.organization_name || d.name}. Our administration has inspected the issue and taken corrective measures.`);
                              setReplyStatus('resolved');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Send size={12} />
                            <span>Official Response &amp; Stamp</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Official Response Modal with Institutional Stamp */}
            {replyTicket && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
                <div className="w-full max-w-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col">
                  {/* Modal Header */}
                  <div className="px-5 py-4 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between bg-[#f8f9fa] dark:bg-[#0e1116]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <DeptIcon dept={d} size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                          Official Institutional Response &amp; Stamp
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {user.organization_name || d.name}
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyTicket(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block font-semibold">Inquiry Ticket Reference</span>
                      <div className="font-bold text-slate-900 dark:text-white">{replyTicket.title}</div>
                      <div className="text-slate-500 text-[11px]">{replyTicket.body}</div>
                    </div>

                    {/* Status Toggle */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block font-mono">
                        Select Ticket Resolution Status
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setReplyStatus('resolved')}
                          className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            replyStatus === 'resolved'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Fully Resolved</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyStatus('investigating')}
                          className={`p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                            replyStatus === 'investigating'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Clock size={14} />
                          <span>Active / In Progress</span>
                        </button>
                      </div>
                    </div>

                    {/* Response Textarea */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block font-mono">
                        Official Institutional Letterhead Response *
                      </label>
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your verified response on behalf of the administration..."
                        className="w-full p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                      />
                    </div>

                    {/* Digital Seal & Officer Signature */}
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {user.name || 'Verified Officer'}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {user.role_label || 'Executive Desk'} · {d.qualityAudit || 'Quality Certified'}
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[9px] bg-emerald-600 text-white">
                        DIGITAL STAMP READY
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
                      <button
                        type="button"
                        onClick={() => setReplyTicket(null)}
                        className="px-3.5 py-2 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!replyText.trim()) {
                            toast('Please enter a response body.', 'amber');
                            return;
                          }
                          updatePostStatus(replyTicket.id, replyStatus);
                          logAudit(
                            'provider_ticket_response',
                            replyTicket.id,
                            `${user.organization_name || d.name} responded to ticket #${replyTicket.id}: "${replyText.slice(0, 50)}..."`
                          );
                          toast(`Official response dispatched and signed with ${user.organization_name || d.name} seal!`, 'emerald');
                          setReplyTicket(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <CheckCircle2 size={13} />
                        <span>Affix Stamp &amp; Transmit Response</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MERCHANT STUDIO & CASHIER POS DESK */}
        {/* ================================================================= */}
        {providerDeskTab === 'merchant_pos' && (
          <div className="space-y-4 animate-fade-in">
            {/* Quick Cashier Redemption & POS Scanner Terminal */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-emerald-500/20 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Store size={18} className="text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm sm:text-base font-black text-slate-950 dark:text-white">
                      {user.organization_name || d.name} · Cashier POS &amp; Voucher Terminal
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Front-desk and cashier verification desk. Enter customer 8-digit voucher PINs, scan QR codes, validate tuition subsidies, and settle with guaranteed 98% escrow payout.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 self-start sm:self-auto">
                  POS Online
                </span>
              </div>

              {/* Cashier Voucher PIN Input & Fast Redemption Form */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-emerald-500/25 space-y-3">
                <label className="text-xs font-bold text-slate-900 dark:text-white font-mono block">
                  1. Enter Customer Voucher PIN or Scan Barcode
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <QrCode size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                    <input
                      type="text"
                      value={posCodeInput}
                      onChange={(e) => setPosCodeInput(e.target.value)}
                      placeholder="e.g. CJ-LUNCH-10K-9921, SCH-50K-UNIFORM-01..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] font-mono font-bold text-xs uppercase text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!posCodeInput.trim()) {
                        toast('Please enter a voucher PIN or barcode to redeem.', 'amber');
                        return;
                      }
                      const code = posCodeInput.trim().toUpperCase();
                      const isTuition = code.includes('SCH') || code.includes('TUITION');
                      const desc = isTuition
                        ? '10% School Uniform & Tuition Subsidy Credit'
                        : `${user.organization_name || d.name} 15% Customer Loyalty Perk`;
                      const discountVal = isTuition ? 'UGX 50,000' : 'UGX 15,000 (15% Off)';

                      setPosValidationResult({
                        success: true,
                        code,
                        description: desc,
                        discountValue: discountVal,
                        awardedPoints: 50,
                        timestamp: new Date().toLocaleTimeString(),
                      });
                      logAudit('cashier_voucher_redeemed', code, `Cashier validated voucher ${code} for ${desc}`);
                      toast(`Voucher ${code} successfully verified and redeemed at cashier!`, 'emerald');
                      setPosCodeInput('');
                    }}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                  >
                    <CheckCircle2 size={14} />
                    <span>Verify &amp; Redeem at Cashier</span>
                  </button>
                </div>

                {/* Quick Test Chips for Demonstration */}
                <div className="flex items-center gap-2 pt-1 flex-wrap text-[10px] font-mono text-slate-500">
                  <span>Quick Test Samples:</span>
                  {[
                    isSchool ? 'SCH-TUITION-50K-1092' : 'CJ-COFFEE-10K-8821',
                    isSchool ? 'SCH-UNIFORM-15K-2026' : 'RES-DINING-25K-9912',
                    'SHOP-1000KSH-2819-UG',
                  ].map((sampleCode) => (
                    <button
                      key={sampleCode}
                      type="button"
                      onClick={() => setPosCodeInput(sampleCode)}
                      className="px-2 py-0.5 rounded bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold cursor-pointer"
                    >
                      {sampleCode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cashier Redemption Receipt Card */}
              {posValidationResult && (
                <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-emerald-500/40 text-xs space-y-2 animate-fade-in shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span className="font-bold text-slate-900 dark:text-white">
                        Voucher Redemption Verified &amp; Settled
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">
                      {posValidationResult.timestamp}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div>
                      <span className="text-[9.5px] text-slate-400 block uppercase">Voucher Code</span>
                      <strong className="text-slate-900 dark:text-white">{posValidationResult.code}</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-400 block uppercase">Benefit Applied</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{posValidationResult.discountValue}</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-400 block uppercase">Escrow Settlement</span>
                      <strong className="text-slate-900 dark:text-white">98% Guaranteed</strong>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-slate-400 block uppercase">Reputation Award</span>
                      <strong className="text-amber-600">+{posValidationResult.awardedPoints} Merit XP</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Merchant Loyalty Studio Integration */}
            <MerchantLoyaltyStudio
              selectedCountry={activeCountry as any}
              activeMerchantDept={user.dept}
              currentVouchers={[]}
              onSelectForVaultDeposit={() => {
                go('perk_vault');
                toast('Navigating to Sovereign Escrow Vault to pre-fund vouchers!', 'emerald');
              }}
            />
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: OFFICIAL GAZETTE & BULLETINS */}
        {/* ================================================================= */}
        {providerDeskTab === 'bulletins' && (
          <div className="space-y-4 animate-fade-in">
            {/* Create Bulletin Form */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
              <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Publish Official {isSchool ? 'School Circular / Bulletin' : 'Public Announcement'}
                  </h3>
                </div>
                <span className="text-[9.5px] font-mono text-slate-400 uppercase">
                  Verified Seal Affixed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={bulletinTitle}
                  onChange={(e) => setBulletinTitle(e.target.value)}
                  placeholder={isSchool ? 'Circular title (e.g. S.1 Orientation & Fees Notice)...' : 'Bulletin title...'}
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={bulletinCategory}
                  onChange={(e) => setBulletinCategory(e.target.value as any)}
                  className="px-2.5 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="academic">Category: Academic</option>
                  <option value="notice">Category: Notice</option>
                  <option value="calendar">Category: Calendar</option>
                  <option value="menu">Category: Menu &amp; Specials</option>
                </select>
              </div>

              <textarea
                rows={3}
                value={bulletinBody}
                onChange={(e) => setBulletinBody(e.target.value)}
                placeholder="Write the full circular notice for parents, customers, and the public..."
                className="w-full p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!bulletinTitle.trim() || !bulletinBody.trim()) {
                      toast('Please provide a circular title and message.', 'amber');
                      return;
                    }
                    const newB = {
                      id: `b-${Date.now()}`,
                      title: bulletinTitle.trim(),
                      body: bulletinBody.trim(),
                      category: bulletinCategory,
                      date: new Date().toISOString().slice(0, 10),
                      officer: user.name || user.real_title_short || 'Desk Lead',
                    };
                    setBulletins([newB, ...bulletins]);
                    setBulletinTitle('');
                    setBulletinBody('');
                    logAudit('provider_bulletin_published', newB.id, `${user.organization_name} published "${newB.title}"`);
                    toast('Official circular published with verified institutional seal!', 'emerald');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send size={13} />
                  <span>Publish Circular with Verified Seal</span>
                </button>
              </div>
            </div>

            {/* Bulletins Feed */}
            <div className="space-y-3">
              {bulletins.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                        {b.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{b.date}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      Signatory: <strong className="text-slate-800 dark:text-slate-200">{b.officer}</strong>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{b.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: FACILITY PROJECTS & CAPITAL UPGRADES */}
        {/* ================================================================= */}
        {providerDeskTab === 'projects' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between bg-white dark:bg-[#161a22] p-3 rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {user.organization_name || d.name} · Capital Infrastructure &amp; Facility Projects
                </h3>
                <p className="text-[11px] text-slate-500">
                  Track ongoing laboratory construction, dormitory renovation, and green energy initiatives.
                </p>
              </div>
              <button
                type="button"
                onClick={() => go('gov_projects')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold cursor-pointer"
              >
                + Register New Works
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {sampleFacilityProjects.map((p: any) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                          {p.tender_ref || 'CIVIC-FACILITY-01'}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                          {p.value_curr || 'UGX'} {p.value_amt?.toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{p.title}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Contractor: <strong>{p.contractor}</strong> · Location: {p.location}
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-xs font-bold font-mono text-emerald-600">{p.progress || 75}% Complete</span>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        Target Handover: {p.end_date || '2026-04-30'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.progress || 75}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: STAFF & TEAM ROSTER */}
        {/* ================================================================= */}
        {providerDeskTab === 'team' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-emerald-600" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {user.organization_name || d.name} · Staff &amp; Faculty Roster
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  National Provider Tier unlocks <strong>Unlimited Staff Seats</strong>. Invite teachers, bursars, cashiers, and department heads.
                </p>
              </div>

              <button
                type="button"
                onClick={() => go('entity_team')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
              >
                <UserPlus size={14} />
                <span>+ Invite Staff Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: user.name || 'Robinah Kizito', role: user.role_label || 'Head Teacher & Administrator', badge: 'Owner Admin', email: 'headmistress@institution.ac.ug' },
                { name: 'Dr. Sarah Namutebi', role: 'Deputy Head & Academic Dean', badge: 'Academic Lead', email: 'academics@institution.ac.ug' },
                { name: 'Charles Mukasa', role: 'Bursar & Finance Lead', badge: 'Billing & POS Desk', email: 'bursar@institution.ac.ug' },
                { name: 'Florence Nansubuga', role: 'Head of Customer Relations & Admissions', badge: 'Desk Officer', email: 'admissions@institution.ac.ug' },
              ].map((member, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{member.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                        {member.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{member.role}</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">{member.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => go('entity_team')}
                    className="p-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-500 hover:text-emerald-600 cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: MONTHLY MERIT PERK DISPATCH */}
        {/* ================================================================= */}
        {providerDeskTab === 'perks' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-emerald-600" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {user.organization_name || d.name} · Monthly Top-3 Merit Vault Rewards
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Strictly locked against cherry-picking. Evaluates verified student, parent, or customer interactions and disburses an even 1/3 split across the Top 3.
                </p>
              </div>
              <button
                type="button"
                onClick={() => go('perk_vault')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Award size={13} />
                <span>Open 5-Vault Console &rarr;</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              {[
                { rank: 'Top 1 (33.3% Pool)', name: 'Esther Babirye', role: 'Lead Parent & Science Watchdog', reward: 'UGX 100,000 School Voucher' },
                { rank: 'Top 2 (33.3% Pool)', name: 'Brian Mugisha', role: 'Student Guild Technology Rep', reward: '10GB Telco Data Bundle' },
                { rank: 'Top 3 (33.3% Pool)', name: 'Patricia Nansubuga', role: 'PTA Campus Maintenance Rep', reward: 'UGX 100,000 School Voucher' },
              ].map((c, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-emerald-500/25 space-y-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    {c.rank}
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">{c.name}</div>
                  <div className="text-[10px] text-slate-500">{c.role}</div>
                  <div className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 pt-1 border-t border-[#e3e6ea] dark:border-[#262b36]">
                    {c.reward}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 7: DESK PROFILE & TIER SETTINGS */}
        {/* ================================================================= */}
        {providerDeskTab === 'profile' && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Desk Profile, Branding &amp; Subscription Tier
                </h3>
                <p className="text-xs text-slate-500">
                  Manage official institution motto, hotline, emergency contacts, and active subscription tier.
                </p>
              </div>
              <button
                type="button"
                onClick={() => go('entity_register')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit3 size={13} />
                <span>Edit Full Profile Studio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Organization Name</span>
                <div className="font-bold text-slate-900 dark:text-white">{user.organization_name || d.name}</div>
                <div className="text-slate-500">{d.location || 'Wakiso District, Uganda'}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase">Accreditation</span>
                <div className="font-bold text-emerald-600">{d.qualityAudit || 'MoES Registered P.012'}</div>
                <div className="text-slate-500">Status: Verified Official Provider</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // GOVERNMENT DESK VIEW (Ministers, Permanent Secretaries, CAOs, Parish Chiefs)
  // =========================================================================
  return (
    <div className="animate-fade-in pb-12 max-w-4xl mx-auto text-slate-900 dark:text-slate-100">
      {/* Header Docket */}
      <div className="px-3.5 sm:px-5 pt-4 pb-3.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116]">
        <AccountabilityDocket
          leftLabel={user.real_title_short || d.name}
          leftSubLabel={user.scope_label || ''}
          centerVal={pendingCount}
          centerLabel="PENDING"
          rightLabel={`${resPct}% resolved`}
          rightSubLabel={`${d.sla || 48}HR TARGET`}
          high={resPct >= 70}
        />

        {/* Desk Profile, Team Roster & 5-Vault Perks Quick Strip */}
        {(() => {
          const isPrivateProvider = Boolean(
            user.entity_type === 'non_government_entity' ||
              user.dept?.startsWith('ent-') ||
              d.lane === 'consumer' ||
              (d.category &&
                [
                  'private_utility',
                  'telecom',
                  'banking',
                  'transport',
                  'hospitality',
                  'education_private',
                  'health_private',
                  'private_contractor',
                  'ngo',
                ].includes(d.category))
          );

          return (
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#161a22] px-3.5 py-2.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-600 dark:text-slate-300 flex-wrap">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {user.organization_name || d.name}
                </span>
                <span>·</span>
                <span>{user.role_label || user.real_title_short || 'Executive Desk'}</span>
                <span>·</span>
                {isPrivateProvider ? (
                  <span className="text-slate-500">
                    Tier:{' '}
                    {user.scope === 'national'
                      ? 'National ($20/mo · Unlimited Seats)'
                      : user.scope === 'subcounty'
                      ? 'Sub-County ($5/mo · Unlimited Seats)'
                      : user.scope === 'parish'
                      ? 'Parish (Free · 2 Seats)'
                      : 'District ($10/mo · Unlimited Seats)'}
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    Sovereign Government Desk · State-Funded Allocation
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {isPrivateProvider && (
                  <>
                    <button
                      type="button"
                      onClick={() => go('entity_register')}
                      className="px-2.5 py-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Layers size={11} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Edit Desk Profile &amp; Tier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => go('entity_team')}
                      className="px-2.5 py-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Users size={11} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Team &amp; Staff Roster (Unlimited)</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => go('perk_vault')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Award size={11} />
                  <span>5-Vault Monthly Perks →</span>
                </button>
              </div>
            </div>
          );
        })()}

        {/* Entity Civic Perks & Rewards Dispatch Console (Updated with 5-Vault Monthly Top-3 Merit Architecture) */}
        <div className="mt-3 bg-white dark:bg-[#161a22] p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Gift size={14} strokeWidth={1.75} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono uppercase tracking-wide flex items-center gap-1.5 flex-wrap">
                  <span>Entity Civic Perks &amp; Monthly Top-3 Merit Vault Console</span>
                  <span className="text-[8.5px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase">
                    Monthly Top-3 Split (33.3% Each)
                  </span>
                </h5>
                <p className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                  Parish, Private Provider, Contractor &amp; Scout Vaults rank citizens monthly and award the Top 3 evenly; Individual Vault tips peers instantly
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono">
            {/* 1. Monthly Top-3 Jurisdiction Vault Dispatch */}
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-2.5 rounded-lg border border-emerald-500/30 space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <Award size={11} strokeWidth={1.75} />
                    <span>5-Vault Monthly Top-3</span>
                  </strong>
                  <span className="text-[8.5px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold">Locked Merit</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[9.5px] leading-snug">
                  Award the monthly Top 3 ranked citizens in your Parish, Shop, Contract, or Boda Stage (strictly locked against cherry-picking).
                </p>
              </div>
              <button
                type="button"
                onClick={() => go('perk_vault')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award size={12} />
                <span>Open Monthly Top-3 Vaults</span>
              </button>
            </div>

            {/* 2. Digital Item Dispatch */}
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
                    <Zap size={11} strokeWidth={1.75} />
                    <span>Digital Item Dispatch</span>
                    <span className="text-[9px] text-slate-700 dark:text-slate-300 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] px-1.5 py-0.2 rounded font-bold">[{countryPerks.countryCode}]</span>
                  </strong>
                  <span className="text-[8.5px] bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-semibold">Instant SMS</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[9.5px] leading-snug">
                  Send {countryPerks.digitalPerks[0]?.name || 'Data Bundles'}, airtime credit, or utility discount vouchers to verified {countryPerks.countryName} citizen phone numbers.
                </p>
              </div>
              <button
                onClick={() => {
                  setDispatchSuccess(null);
                  setDispatchModal('digital');
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap size={12} />
                <span>1-Click Dispatch Digital Perks</span>
              </button>
            </div>

            {/* 3. Physical Prize HQ Collection Pass */}
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <MapPin size={11} strokeWidth={1.75} />
                    <span>Allocated HQ Pickup Pass</span>
                  </strong>
                  <span className="text-[8.5px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold">HQ Desk Pass</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[9.5px] leading-snug">
                  Assign physical prize (Plaque / Solar Lantern) at <strong className="text-slate-800 dark:text-slate-200">{countryPerks.hqRoom}</strong>.
                </p>
              </div>
              <button
                onClick={() => {
                  setDispatchSuccess(null);
                  setDispatchModal('physical');
                }}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin size={12} />
                <span>Issue HQ Pickup Pass</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Digital Baraza — Official Audio Town Hall Studio */}
        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[8.5px] font-mono font-bold uppercase flex items-center gap-1 shrink-0">
                <Radio size={9} strokeWidth={2} />
                <span>DIGITAL BARAZA</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                {townHalls && townHalls.length > 0 ? `${townHalls[0].listeners_count} citizens tuned in` : 'Statutory Audio Town Hall'}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5">
              {townHalls && townHalls.length > 0 ? townHalls[0].title : 'Convene a Live Audio Hearing with Citizens'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setHostBarazaModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={11} strokeWidth={2} />
              <span>+ Host Baraza</span>
            </button>
            {townHalls && townHalls.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTownHall(townHalls[0])}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 cursor-pointer"
              >
                Join Room
              </button>
            )}
          </div>
        </div>

        {/* 2-Stage Sovereign App Modification Request & National Node Head Clearinghouse */}
        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[8.5px] font-mono font-bold uppercase">
                  {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                    ? 'NATIONAL NODE HEAD CLEARINGHOUSE'
                    : 'DESK MODIFICATION PROTOCOL'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                    ? `Direct Bilateral Line to CivicDuty CD-Ops (${countryPerks.countryName})`
                    : `Routed via ${countryPerks.countryName} National Node Head (e.g. PS MoLG) → CivicDuty CD-Ops`}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                  ? 'Review Accounting Officer Modification Requests & Submit Vetted Directives to CD-Ops'
                  : 'Request Custom Desk Modifications, SLA Adjustments, or Form Fields'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModRequestForm(!showModRequestForm)}
              className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus size={11} />
              <span>{showModRequestForm ? 'Close Form' : '+ Request App Modification'}</span>
            </button>
          </div>

          {showModRequestForm && (
            <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5 animate-fade-in">
              <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                  ? 'As National Superadmin, your modification directive is transmitted directly to CivicDuty Operatives (CD-Ops).'
                  : `Your request will be sent to the ${countryPerks.countryName} National Node Head (e.g. PS MoLG) for statutory review. Once approved by the National Superadmin, it is forwarded to CivicDuty Operatives (CD-Ops).`}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={modSubject}
                  onChange={(e) => setModSubject(e.target.value)}
                  placeholder="Modification title (e.g. Add Borehole Serial No. field)..."
                  className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={modPriority}
                  onChange={(e) => setModPriority(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="routine">Priority: Routine</option>
                  <option value="urgent">Priority: Urgent</option>
                  <option value="statutory_directive">Priority: Statutory</option>
                </select>
              </div>
              <textarea
                rows={2}
                value={modBody}
                onChange={(e) => setModBody(e.target.value)}
                placeholder="Describe the exact workflow, SLA, or form modification required for your accounting desk..."
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!modSubject.trim() || !modBody.trim()) {
                      toast('Please enter both a subject and modification description.', 'amber');
                      return;
                    }
                    const isNationalSuperadmin =
                      user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec';
                    addGovFeedbackMessage({
                      id: `MOD-${activeCountry}-${Date.now().toString().slice(-4)}`,
                      countryCode: activeCountry,
                      countryName: countryPerks.countryName,
                      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                      senderMinistry: d.full || d.name,
                      senderTitle: user.real_title_short || user.role_label || 'Accounting Officer',
                      senderOfficer: user.name || 'Official Desk Officer',
                      subject: modSubject.trim(),
                      message: modBody.trim(),
                      priority: modPriority,
                      status: 'sent',
                      clearanceStage: isNationalSuperadmin
                        ? 'escalated_to_cd_ops'
                        : 'pending_national_superadmin',
                      nationalSuperadminTitle: `National Superadmin (${countryPerks.countryName} Node Head)`,
                      ...(isNationalSuperadmin
                        ? {
                            endorsedBySuperadmin: user.name || 'National Superadmin',
                            endorsedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                          }
                        : {}),
                    });
                    setModSubject('');
                    setModBody('');
                    setShowModRequestForm(false);
                    toast(
                      isNationalSuperadmin
                        ? 'National Directive transmitted directly to CivicDuty Operatives (CD-Ops)!'
                        : `Modification request submitted to ${countryPerks.countryName} National Node Head for vetting!`,
                      'emerald'
                    );
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={12} />
                  <span>
                    {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                      ? 'Submit Directly to CivicDuty CD-Ops'
                      : 'Submit to National Node Head (PS MoLG)'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* National Superadmin Clearinghouse Queue (Visible to National Node Head / Superadmin) */}
          {(user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec') &&
            (govFeedbackMessages || []).filter(
              (m) => m.countryCode === activeCountry && m.clearanceStage === 'pending_national_superadmin'
            ).length > 0 && (
              <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                  Pending Accounting Officer Modification Requests Awaiting Your Endorsement
                </div>
                {(govFeedbackMessages || [])
                  .filter(
                    (m) => m.countryCode === activeCountry && m.clearanceStage === 'pending_national_superadmin'
                  )
                  .map((req) => (
                    <div
                      key={req.id}
                      className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {req.subject}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          From: {req.senderOfficer} ({req.senderTitle} · {req.senderMinistry})
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                          {req.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            rejectModificationBySuperadmin(
                              req.id,
                              user.name || 'National Superadmin',
                              'Rejected by National Node Head — covered by existing statutory template.'
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-semibold cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            endorseModificationForCdOps(
                              req.id,
                              user.name || 'PS MoLG (National Superadmin)',
                              'Vetted and endorsed by National Superadmin for CD-Ops deployment.'
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
                        >
                          Approve &amp; Send to CD-Ops →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
        </div>

        {canInvite && (
          <div className="mt-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-[11px] font-mono uppercase tracking-wider">
                <UserPlus size={14} />
                <span>
                  {user.role === 'platform_admin'
                    ? `${countryPerks.countryName} National Authority Desk`
                    : `${user.real_title_short || 'Node Executive'} (${countryPerks.countryName} Executive Desk)`}
                </span>
              </div>
              <span className="text-[9px] font-mono text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25 font-semibold">
                1-Click Approval Queue
              </span>
            </div>
            <p className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-snug">
              As <span className="text-slate-900 dark:text-white font-semibold">{user.real_title_short || 'Node Executive'}</span>, you hold official mandate to issue officer access codes and digitally sign monthly Citizen Champion Certificates of Civic Excellence.
            </p>

            {/* Auto-Certificate Engine Queue Card */}
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Award size={14} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono uppercase">Monthly Civic Awards Approval Queue</h5>
                    <p className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                      {countryPerks.countryName} Jurisdictions · {countryPerks.sampleCitizens.length} Citizen Champions Pending Certificate Signing
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-amber-700 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                  End of Month Cycle
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono bg-white dark:bg-[#161a22] p-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                <span className="text-slate-700 dark:text-slate-300">
                  Top Candidate: <strong>{countryPerks.sampleCitizens[0]?.name || 'Citizen Champion'}</strong> ({countryPerks.sampleCitizens[0]?.location || 'Ward'} - {countryPerks.sampleCitizens[0]?.points || 1240} pts)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Auto-Drafted PDF Ready</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    logAudit(
                      'champion_certificates_signed',
                      `CERT-${countryPerks.countryCode}`,
                      `All ${countryPerks.countryName} Champion Certificates digitally signed and dispatched via PWA & SMS.`
                    );
                    toast(`All ${countryPerks.countryName} Champion Certificates digitally signed & dispatched via PWA & SMS!`, 'emerald');
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg py-2 px-3 text-[10px] uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserPlus size={13} />
                  <span>1-Click Approve &amp; Digitally Sign All ({countryPerks.countryCode})</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => go('gov_team')}
                className="flex-1 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-semibold border border-[#e3e6ea] dark:border-[#262b36] rounded-lg py-2 px-3 text-[10px] uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus size={13} />
                <span>{user.entity_type === 'non_government_entity' ? 'Invite Duty Staff' : 'Issue Officer Access Code'}</span>
              </button>
              <button
                onClick={() => go('gov_team')}
                className="border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-800 dark:text-slate-200 font-semibold rounded-lg py-2 px-3 text-[10px] uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users size={13} />
                <span>{user.entity_type === 'non_government_entity' ? `Staff & Roles (${myTeam.length})` : `Manage Team (${myTeam.length})`}</span>
              </button>
            </div>
          </div>
        )}

        {isRO && (
          <div className="mt-2.5 card p-2.5 flex items-center gap-2 border-slate-200 dark:border-slate-800">
            <span className="chip ch-ro">Read-Only</span>
            <p className="text-[9px] mono text-slate-500 dark:text-slate-400">Oversight desk · View and Export only.</p>
          </div>
        )}

        {overdueCount > 0 && (
          <div className="flex items-center gap-2 mt-3 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5">
            <AlertTriangle className="text-rose-600 dark:text-rose-400 flex-shrink-0" size={18} />
            <div>
              <p className="text-[10px] mono text-rose-800 dark:text-rose-300 font-bold">
                {overdueCount} ticket{overdueCount > 1 ? 's' : ''} past response deadline — auto-escalated up chain
              </p>
              <p className="text-[9px] mono text-slate-600 dark:text-slate-400 mt-0.5">Each breach is logged. Respond immediately.</p>
            </div>
          </div>
        )}

        {corruptionCount > 0 && (
          <div className="flex items-center gap-2 mt-2 corrupt-banner">
            <Lock className="text-rose-600 dark:text-rose-400" size={14} />
            <p className="text-[10px] mono text-rose-800 dark:text-rose-300 ml-1">
              {corruptionCount} anti-corruption report{corruptionCount > 1 ? 's' : ''} — referred to IGG
            </p>
          </div>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto bg-slate-100 dark:bg-slate-950/80">
        {[
          ['all', 'All'],
          ['pending', 'Pending'],
          ['overdue', 'Overdue'],
          ['investigating', 'Active'],
          ['corruption', 'Corruption'],
          ['resolved', 'Resolved'],
        ].map(([t, l]) => {
          const active = govTab === t;
          const alarm = (t === 'overdue' && overdueCount > 0) || (t === 'corruption' && corruptionCount > 0);
          const cnt = t === 'overdue' ? overdueCount : t === 'corruption' ? corruptionCount : 0;
          return (
            <button
              key={t}
              onClick={() => setGovTab(t as any)}
              className={`flex-shrink-0 px-3.5 py-3 text-[9px] mono font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                active
                  ? alarm
                    ? 'text-rose-700 dark:text-rose-400 border-b-2 border-rose-500'
                    : 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 bg-white dark:bg-transparent'
                  : alarm
                  ? 'text-rose-600 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {l}
              {cnt > 0 ? ` (${cnt})` : ''}
            </button>
          );
        })}
      </div>

      {/* Inbox Ticket List */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-xs mono text-slate-400 dark:text-slate-500">No tickets in this view.</div>
        ) : (
          filtered.map((p) => {
            const sla = slaStatus(p);
            const cat = catByID(p.category);
            const isCorrupt = p.category === 'corruption';

            return (
              <div key={p.id} className={`px-4 py-4 ${isCorrupt ? 'bg-rose-50 dark:bg-rose-950/10' : ''} hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors`}>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap text-[8px] mono">
                      <span style={{ color: cat.color }}>{cat.label}</span>
                      {statusChip(p.gov_status || p.status)}
                      {isCorrupt && (
                        <span className="chip ch-corrupt flex items-center gap-0.5">
                          <Lock size={10} /> Corruption
                        </span>
                      )}
                      {p.escalated && (
                        <span className="chip ch-overdue flex items-center gap-0.5">
                          <AlertTriangle size={10} /> ESCALATED
                        </span>
                      )}
                      {(p.is_master_dossier || (p.compiled_count && p.compiled_count > 1)) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-black">
                          <Layers size={9} /> MASTER DOSSIER ({p.compiled_count || (p.compiled_reports ? p.compiled_reports.length + 1 : 2)} REPORTS)
                        </span>
                      )}
                    </div>
                    <h4 className={`text-[14px] font-bold ${isCorrupt ? 'text-rose-900 dark:text-rose-200' : 'text-slate-900 dark:text-slate-100'} leading-snug`}>
                      {p.title}
                    </h4>
                    <div className="text-[9px] mono text-slate-500 dark:text-slate-400 mt-1">
                      {p.citizen_name} · {srcLabel(p.source)} · {p.citizen_rank} · {timeAgo(p.created_at)}
                    </div>
                    <div className="path-crumb mt-0.5">{pathStr(p.country, p.territory)}</div>
                    {p.media && p.media.length > 0 && (
                      <div className="text-[8px] mono text-teal-700 dark:text-teal-400 mt-1 flex items-center gap-1">
                        <Paperclip size={10} /> {p.media.length} evidence file{p.media.length > 1 ? 's' : ''} attached
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0" style={{ minWidth: '58px' }}>
                    <div className={`text-[9.5px] mono font-bold ${sla.overdue ? 'a-sla' : ''}`} style={{ color: sla.color }}>
                      {sla.fmt}
                    </div>
                    <div className="text-[7px] mono text-slate-400 dark:text-slate-500 mt-0.5">{sla.overdue ? 'OVERDUE' : 'remaining'}</div>
                  </div>
                </div>

                <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden mb-3.5 border border-slate-300 dark:border-slate-800">
                  <div className="sla-fill" style={{ width: `${sla.pct}%`, background: sla.color }}></div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActivePost(p);
                      go('post_detail');
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-800"
                  >
                    Inspect
                  </button>

                  {!isRO && p.status !== 'resolved' ? (
                    <>
                      <button
                        onClick={() => updatePostStatus(p.id, 'investigating')}
                        className="px-3.5 py-2.5 rounded-xl text-xs mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-amber-500/40 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                      >
                        Active
                      </button>
                      {queue.filter((other) => other.id !== p.id && other.status !== 'resolved').length > 0 && (
                        <button
                          onClick={() => {
                            if (mergeTargetId === p.id) {
                              setMergeTargetId(null);
                            } else {
                              setMergeTargetId(p.id);
                              const firstOther = queue.find((other) => other.id !== p.id && other.status !== 'resolved');
                              if (firstOther) setSelectedDupToMerge(firstOther.id);
                            }
                          }}
                          className="px-3 py-2.5 rounded-xl text-xs mono font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 flex items-center gap-1 transition-colors"
                          title="Compile & merge duplicate citizen ticket into this Master Dossier"
                        >
                          <Layers size={12} />
                          <span className="hidden sm:inline">Compile</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActivePost(p);
                          go('gov_reply');
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-xs mono font-bold ${
                          isCorrupt
                            ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                        } transition-colors`}
                      >
                        Respond
                      </button>
                    </>
                  ) : (
                    <div className={`flex-1 text-center text-[9px] mono ${isRO ? 'text-slate-400 dark:text-slate-500' : 'text-teal-700 dark:text-teal-400 font-bold'} flex items-center justify-center`}>
                      {isRO ? 'View Only' : 'Closed'}
                    </div>
                  )}
                </div>

                {mergeTargetId === p.id && (
                  <div className="mt-3 p-3 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-800 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-[10px] font-mono font-black text-indigo-900 dark:text-indigo-200">
                      <span className="flex items-center gap-1.5">
                        <Layers size={11} strokeWidth={1.75} />
                        <span>Compile Duplicate Report Into Master Dossier #{p.id.slice(-6).toUpperCase()}</span>
                      </span>
                      <button onClick={() => setMergeTargetId(null)} className="text-slate-500 hover:text-slate-700">
                        <X size={13} />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={selectedDupToMerge}
                        onChange={(e) => setSelectedDupToMerge(e.target.value)}
                        className="flex-1 text-xs font-bold bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg p-2"
                      >
                        {queue
                          .filter((other) => other.id !== p.id && other.status !== 'resolved')
                          .map((other) => (
                            <option key={other.id} value={other.id}>
                              #{other.id.slice(-6).toUpperCase()} — {other.title} ({other.citizen_name})
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => {
                          if (!selectedDupToMerge) return;
                          mergeDuplicatePostsIntoDossier(p.id, [selectedDupToMerge]);
                          setMergeTargetId(null);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-black shrink-0"
                      >
                        Merge &amp; Compile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Entity Perks & Rewards Dispatch Modal */}
      {dispatchModal !== 'none' && (
        <div className="fixed inset-0 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-500/40 rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-2xl relative overflow-hidden text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                  {dispatchModal === 'digital' ? <Zap size={18} /> : <MapPin size={18} />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono uppercase tracking-wide">
                    {dispatchModal === 'digital'
                      ? 'Dispatch Digital Civic Perk'
                      : 'Issue Allocated HQ Collection Pass'}
                  </h3>
                  <p className="text-[10px] mono text-slate-500 dark:text-slate-400">
                    {dispatchModal === 'digital'
                      ? 'Instant SMS & PWA Inbox delivery for active parish citizens'
                      : 'Generate official Headquarter Desk collection pass for physical awards'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDispatchModal('none')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Success State Receipt */}
            {dispatchSuccess ? (
              <div className="space-y-4 py-2">
                <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono uppercase tracking-wider">
                    {dispatchSuccess.type === 'digital' ? 'Perk Dispatched Successfully!' : 'Collection Pass Issued!'}
                  </h4>
                  <p className="text-[11px] text-slate-800 dark:text-slate-200 font-mono">
                    Sent to: <strong>{dispatchSuccess.recipient}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-[10.5px]">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Official Pass / Code:</span>
                    <strong className="text-amber-700 dark:text-amber-300 font-mono font-bold text-xs">{dispatchSuccess.code}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Details:</span>
                    <span className="text-slate-800 dark:text-slate-200">{dispatchSuccess.details}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Delivery Channel:</span>
                    <span className="text-teal-700 dark:text-teal-400 font-bold">PWA Inbox + SMS Alert</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Issued By:</span>
                    <span className="text-slate-700 dark:text-slate-300">{user.real_title_short || 'Entity Admin Desk'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(dispatchSuccess.code);
                      toast(`Code ${dispatchSuccess.code} copied!`, 'emerald');
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-3 rounded-xl text-xs mono flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700"
                  >
                    <Copy size={14} />
                    <span>Copy Code</span>
                  </button>
                  <button
                    onClick={() => setDispatchModal('none')}
                    className="flex-1 bg-teal-600 dark:bg-teal-500 hover:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black py-2 px-3 rounded-xl text-xs mono uppercase tracking-wider"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Dispatch Form */
              <div className="space-y-3 font-mono text-[11px]">
                {/* Citizen Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <UserPlus size={12} className="text-teal-600 dark:text-teal-400" /> Target Citizen Champion
                  </label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-teal-500"
                  >
                    {countryPerks.sampleCitizens.map((c, idx) => (
                      <option key={idx} value={`${c.name} (${c.phone}) - ${c.location}`}>
                        {c.name} ({c.phone}) · {c.location} ({c.points} pts)
                      </option>
                    ))}
                  </select>
                </div>

                {dispatchModal === 'digital' ? (
                  /* Digital Perk Fields */
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Gift size={12} className="text-amber-600 dark:text-amber-400" /> [{countryPerks.countryCode}] {countryPerks.countryName} Partner Perk Vouchers
                        </span>
                        <span className="text-[8.5px] text-teal-800 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/30">
                          Model A CSR Pilot (0% Platform Fee)
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {countryPerks.digitalPerks.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setPerkType(p.id);
                              setPerkCode(p.code);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              perkType === p.id
                                ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="text-[11px] flex items-center justify-between">
                              <span>{p.name}</span>
                              <span className="text-[7.5px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1 rounded font-bold">{p.badge}</span>
                            </div>
                            <div className="text-[8.5px] opacity-80 mt-0.5">{p.subtext}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Voucher / Voucher Code
                      </label>
                      <input
                        type="text"
                        value={perkCode}
                        onChange={(e) => setPerkCode(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </>
                ) : (
                  /* Physical Prize HQ Pass Fields */
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Award size={12} className="text-teal-600 dark:text-teal-400" /> Award Item
                      </label>
                      <select
                        value={prizeType}
                        onChange={(e) => setPrizeType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-teal-500"
                      >
                        <option value="Parish Watchdog Honor Plaque & Solar Lantern">
                          Parish Watchdog Honor Plaque &amp; Solar Lantern
                        </option>
                        <option value="Executive Civic Excellence Duty Medal">
                          Executive Civic Excellence Duty Medal
                        </option>
                        <option value="Solar Home Emergency Lighting System">
                          Solar Home Emergency Lighting System
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Allocated HQ Collection Room
                      </label>
                      <input
                        type="text"
                        value={hqRoom}
                        onChange={(e) => setHqRoom(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Assigned Desk Officer
                      </label>
                      <input
                        type="text"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (dispatchModal === 'digital') {
                        const code = perkCode || 'NWSC-CIVIC-8841';
                        logAudit('DISPATCH_DIGITAL_PERK', 'ENTITY-DESK', `Dispatched ${perkType === 'data' ? '1GB Data Bundle' : '10% NWSC Discount Voucher'} (${code}) to ${recipient}`);
                        toast(`Digital Perk dispatched to ${recipient.split(' ')[0]}!`, 'emerald');
                        setDispatchSuccess({
                          type: 'digital',
                          code,
                          recipient,
                          details: perkType === 'data' ? '1GB Free Civic Data Bundle credited' : '10% NWSC Utility Water Voucher Code',
                        });
                      } else {
                        const passCode = `PASS-NKW-${Math.floor(1000 + Math.random() * 9000)}`;
                        logAudit('ISSUE_HQ_PASS', 'ENTITY-DESK', `Issued HQ Pickup Pass ${passCode} for ${prizeType} to ${recipient}`);
                        toast(`HQ Pickup Pass ${passCode} generated and issued!`, 'emerald');
                        setDispatchSuccess({
                          type: 'physical',
                          code: passCode,
                          recipient,
                          details: `${prizeType} · Location: ${hqRoom}`,
                        });
                      }
                    }}
                    className="w-full bg-teal-600 dark:bg-teal-500 hover:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black py-2.5 rounded-xl text-xs mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
                  >
                    <Send size={14} />
                    <span>
                      {dispatchModal === 'digital'
                        ? '1-Click Dispatch Perk to Citizen'
                        : 'Generate & Issue HQ Collection Pass'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
