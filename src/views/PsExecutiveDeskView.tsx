import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import {
  getMinistriesForCountry,
  MinistryProfile,
  MinistrySector
} from '../data/countryMinistries';
import { CountryCode } from '../types';
import { getPsMinistryInfo } from '../utils/helpers';
import {
  Building2,
  Landmark,
  Truck,
  Activity,
  GraduationCap,
  Droplets,
  Radio,
  ShieldCheck,
  ArrowLeft,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Users,
  AlertCircle,
  FileText,
  Sliders,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Fuel,
  MapPin,
  Check,
  X,
  RefreshCw,
  Lock,
  UserPlus,
  HelpCircle,
  Compass,
  Eye,
} from 'lucide-react';
import { TrafficLightLogo } from '../components/TrafficLightLogo';

export const PsExecutiveDeskView: React.FC = () => {
  const {
    user,
    setUser,
    go,
    toast,
    logAudit,
    selectedCountry,
    setSelectedCountry,
    selectedMinistryId,
    setSelectedMinistryId
  } = useApp();

  // Strictly lock to the official's commissioned country
  const currentCountry = (user?.country || selectedCountry || 'UG') as CountryCode;
  const psInfo = useMemo(() => getPsMinistryInfo(user), [user]);
  const isMinisterReadOnly = Boolean(
    user?.role === 'read_only' ||
      user?.real_title_short?.toUpperCase().includes('MINISTER') ||
      user?.role_label?.toUpperCase().includes('MINISTER')
  );
  const isStrictLinePs = (psInfo.isPs && !psInfo.isMoLG && psInfo.ministryId !== 'PS-OPM') || isMinisterReadOnly;
  const [showApexExplainer, setShowApexExplainer] = useState<boolean>(true);
  const [sectorFilter, setSectorFilter] = useState<'ALL' | MinistrySector>('ALL');
  const [activeTab, setActiveTab] = useState<'desk_operations' | 'cabinet_league' | 'circulars' | 'inter_ps'>('desk_operations');
  const [searchQuery, setSearchQuery] = useState('');

  // Domain-specific state toggles
  const [frozenDistricts, setFrozenDistricts] = useState<Record<string, boolean>>({
    'Arua City': true,
  });
  const [dispatchedMechanics, setDispatchedMechanics] = useState<Record<string, boolean>>({});
  const [inspectedFacilities, setInspectedFacilities] = useState<Record<string, boolean>>({});
  const [sanctionModalOpen, setSanctionModalOpen] = useState(false);
  const [selectedDistrictForSanction, setSelectedDistrictForSanction] = useState<string | null>(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [referralTargetMinistry, setReferralTargetMinistry] = useState<string>('');
  const [referralSubject, setReferralSubject] = useState('');

  // Fetch line ministries for current country (strictly excluding Territorial Superadmin / MoLG)
  const lineMinistries = useMemo(() => {
    return getMinistriesForCountry(currentCountry).filter(
      (m) => !m.isSuperadmin && m.id !== 'PS-MOLG' && m.sector !== 'GOVERNANCE'
    );
  }, [currentCountry]);

  // Strictly lock every PS and Minister to their own authenticated Ministry warrant
  const activeMinistry: MinistryProfile = useMemo(() => {
    const userScope = (user?.scope || '').toUpperCase();
    const userDept = (user?.dept || '').toLowerCase();
    const targetId = psInfo.ministryId || (userScope.startsWith('PS-') ? userScope : selectedMinistryId);

    if (targetId && targetId !== 'PS-MOLG') {
      const own = lineMinistries.find(
        (m) =>
          m.id.toUpperCase() === targetId.toUpperCase() ||
          m.code.toUpperCase() === targetId.toUpperCase() ||
          m.shortTitle.toLowerCase() === (psInfo.shortTitle || userDept).toLowerCase()
      );
      if (own) return own;
    }
    if (userDept) {
      const byDept = lineMinistries.find((m) => m.shortTitle.toLowerCase() === userDept);
      if (byDept) return byDept;
    }
    return (
      lineMinistries[0] ||
      getMinistriesForCountry(currentCountry).find((m) => !m.isSuperadmin) ||
      getMinistriesForCountry(currentCountry)[0]
    );
  }, [lineMinistries, selectedMinistryId, currentCountry, psInfo, user]);

  const handleRequireAccessCodeForOtherAccount = (targetLabel?: string) => {
    toast(
      targetLabel
        ? `Strict Warrant Lock: Enter the official access code for ${targetLabel} to access that account.`
        : 'Strict Warrant Lock: Each account is restricted to its own access code.',
      'amber'
    );
    setUser(null);
    go('ob2');
  };

  const toggleBudgetFreeze = (district: string) => {
    if (isMinisterReadOnly) {
      logAudit(
        'minister_policy_advisory_flag',
        district,
        `Cabinet Minister flagged ${district} to Permanent Secretary (${activeMinistry.permSecretary}) for Section 15 PFMA review. Direct accounting execution reserved for PS.`,
        currentCountry
      );
      toast(
        `[READ-ONLY MINISTER WARRANT] Policy Advisory sent to PS (${activeMinistry.permSecretary}) to execute PFMA sanction on ${district}.`,
        'amber'
      );
      return;
    }
    const isNowFrozen = !frozenDistricts[district];
    setFrozenDistricts((prev) => ({
      ...prev,
      [district]: isNowFrozen,
    }));

    if (isNowFrozen) {
      logAudit(
        'ps_statutory_budget_freeze',
        district,
        `Section 15 PFMA Budget Freeze invoked on ${district} by ${activeMinistry.permSecretary} (${activeMinistry.shortTitle}) due to unresolved service backlog.`,
        currentCountry
      );
      toast(`[PFMA SANCTION ACTIVE] Q3 Disbursal for ${district} FROZEN until audit clearance.`, 'red');
    } else {
      logAudit(
        'ps_budget_freeze_lifted',
        district,
        `Section 15 PFMA Budget Freeze lifted on ${district} by ${activeMinistry.permSecretary} following compliance review.`,
        currentCountry
      );
      toast(`Sanctions lifted for ${district}. Normal exchequer releases restored.`, 'emerald');
    }
  };

  const handleDispatchMechanic = (pointId: string, subCounty: string) => {
    if (isMinisterReadOnly) {
      logAudit(
        'minister_policy_advisory_flag',
        pointId,
        `Cabinet Minister flagged borehole ${pointId} (${subCounty}) for priority PS operational dispatch.`,
        currentCountry
      );
      toast(
        `[READ-ONLY MINISTER WARRANT] Priority Policy Advisory logged for PS (${activeMinistry.permSecretary}) on ${pointId}.`,
        'amber'
      );
      return;
    }
    setDispatchedMechanics((prev) => ({ ...prev, [pointId]: true }));
    logAudit(
      'water_mechanic_dispatched',
      pointId,
      `Regional Handpump Mechanics & Spares Brigade dispatched to ${pointId} (${subCounty}) by ${activeMinistry.permSecretary}.`,
      currentCountry
    );
    toast(`Rapid Borehole Mechanics Brigade dispatched to ${pointId}!`, 'emerald');
  };

  const handleDispatchDrugSquad = (facility: string) => {
    if (isMinisterReadOnly) {
      logAudit(
        'minister_policy_advisory_flag',
        facility,
        `Cabinet Minister flagged ${facility} to Permanent Secretary (${activeMinistry.permSecretary}) for Drug Verification Squad dispatch.`,
        currentCountry
      );
      toast(
        `[READ-ONLY MINISTER WARRANT] Policy Advisory dispatched to PS (${activeMinistry.permSecretary}) to audit ${facility}.`,
        'amber'
      );
      return;
    }
    setInspectedFacilities((prev) => ({ ...prev, [facility]: true }));
    logAudit(
      'moh_flying_squad_dispatched',
      facility,
      `Special Drug Verification Flying Squad dispatched to ${facility} by ${activeMinistry.permSecretary}.`,
      currentCountry
    );
    toast(`Special Drug Verification Squad dispatched to ${facility}!`, 'emerald');
  };

  const handleInterMinisterialReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralTargetMinistry) {
      toast('Select the destination sister ministry', 'amber');
      return;
    }
    const target = lineMinistries.find((m) => m.id === referralTargetMinistry);
    logAudit(
      'inter_ps_referral',
      target?.shortTitle || 'Sister Ministry',
      `Inter-Ministerial Case Referral from ${activeMinistry.shortTitle} to ${target?.shortTitle}: ${referralSubject || 'Statutory Cross-Agency Resolution'}`,
      currentCountry
    );
    setReferralModalOpen(false);
    setReferralSubject('');
    toast(`Statutory 48h Referral dispatched to ${target?.title}!`, 'emerald');
  };

  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark':
        return <Landmark className="w-5 h-5" />;
      case 'Truck':
        return <Truck className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Radio':
        return <Radio className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 pb-20 animate-fade-in font-sans">
      {/* EXECUTIVE HEADER */}
      <div className="bg-white dark:bg-[#161a22] border-b border-[#e3e6ea] dark:border-[#262b36] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left Title & Back Nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => go('gov_inbox')}
              className="p-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Return to Government Workspace"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{currentCountry} · {COUNTRIES[currentCountry]?.name}</span>
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {isMinisterReadOnly
                    ? 'Cabinet Minister · Read-Only Executive Oversight'
                    : 'Tier 5 · Apex Line Ministry Command'}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                  {activeMinistry.code}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                {activeMinistry.title}
              </h1>
            </div>
          </div>

          {/* Right Controls: Strict Jurisdiction Actions (Warrant Lock Badge, Invite Minister, Ministry Admin, Inter-PS Query) */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[11px] font-mono font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border ${
                isMinisterReadOnly
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-400'
              }`}
              title="Strict Warrant Lock: Account is bound to its authenticated access code and jurisdiction"
            >
              <Lock className="w-3 h-3" />
              <span>
                {isMinisterReadOnly
                  ? `Warrant Locked: Minister (RO) · ${activeMinistry.shortTitle}`
                  : `Warrant Locked: PS Accounting Officer · ${activeMinistry.shortTitle}`}
              </span>
            </span>

            {!isMinisterReadOnly && (
              <button
                onClick={() => go('gov_team')}
                className="text-xs font-mono font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite Minister &amp; Team</span>
              </button>
            )}

            {!isMinisterReadOnly && (
              <button
                onClick={() => go('gov_admin')}
                className="text-xs font-mono font-semibold px-3 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-800 dark:text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors border border-[#e3e6ea] dark:border-[#262b36] cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Ministry Admin</span>
              </button>
            )}

            <button
              onClick={() => setReferralModalOpen(true)}
              className="text-xs font-mono font-semibold px-3 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-800 dark:text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors border border-[#e3e6ea] dark:border-[#262b36] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-amber-500" />
              <span>48h Inter-Ministry Referral</span>
            </button>

            <button
              onClick={() => setShowApexExplainer((prev) => !prev)}
              className="text-xs font-mono font-semibold px-2.5 py-1.5 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-emerald-700 dark:text-emerald-400 rounded-lg flex items-center gap-1 transition-colors border border-[#e3e6ea] dark:border-[#262b36] cursor-pointer"
              title="Toggle Apex Architecture Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>What is Apex?</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
        {/* CABINET MINISTER READ-ONLY EXECUTIVE OVERSIGHT BANNER (Visible when mounted as Minister) */}
        {isMinisterReadOnly && (
          <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-amber-500/40 space-y-2.5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Cabinet Minister Read-Only Executive Warrant · Public Finance Management Act (PFMA)</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Political Head &amp; Policy Oversight View ({user?.name || `Hon. Cabinet Minister — ${activeMinistry.shortTitle}`})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Under constitutional Public Finance Management rules, <strong>Cabinet Ministers &amp; Ministers of State</strong> hold <strong>Read-Only Executive Oversight</strong> over operational accounting ledgers. You are strictly locked to <strong>{activeMinistry.title} ({COUNTRIES[currentCountry]?.name})</strong> and can inspect live sector telemetry, SLA league tables, and SHA-256 audit logs, or flag <strong>Policy Advisories</strong> to the Permanent Secretary (<strong>{activeMinistry.permSecretary}</strong>).
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleRequireAccessCodeForOtherAccount(`Permanent Secretary (${activeMinistry.shortTitle})`)}
                  className="px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold cursor-pointer hover:border-slate-400 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Sign Out to Enter Another Access Code →</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APEX ARCHITECTURE EXPLAINER BANNER: WHO IT IS FOR & ITS 4 CORE FUNCTIONS */}
        {showApexExplainer && (
          <div className="p-4 sm:p-5 bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Constitutional Architecture Guide · Understanding the &ldquo;Apex&rdquo; Executive Desk</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Who the Apex Desk Is For &amp; How It Differs from the Superadmin (MoLG) Desk
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowApexExplainer(false)}
                className="text-xs font-mono text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                Hide
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In every country&apos;s government, authority is divided into two distinct constitutional pillars:
              <strong> (1) Horizontal Territorial Administration</strong> (governed by the country&apos;s <strong>National Superadmin</strong>, e.g., PS Ministry of Local Government / Devolution, who commissions Regional, District/County, and Parish/Ward desks), and
              <strong> (2) Vertical Sector Line Ministries</strong> (governed by each Ministry&apos;s <strong>Permanent Secretary &amp; Cabinet Minister</strong>).
              <strong> The &ldquo;Apex&rdquo; Desk is the specialized national command center exclusively for Sector Line Ministries ({activeMinistry.title}).</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  1 · Who It Is For
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Line Ministry PS &amp; Cabinet Minister
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Strictly locked to {activeMinistry.title} ({COUNTRIES[currentCountry]?.name}). Never exposes other countries or unrelated ministries.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  2 · Sector Asset Telemetry
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {activeMinistry.uniqueFeatureBadge}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Controls sector-specific national assets (e.g., Road Graders GPS, Treasury IFMS Freezes, NMS Drug Audits, Borehole Mechanics).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  3 · Cabinet &amp; Team Invites
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Commission Your Minister
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Via <strong>Ministry Admin</strong> &amp; <strong>Team</strong>, the PS invites the Cabinet Minister (Read-Only Executive), State Ministers, and Directors.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  4 · Circulars &amp; Referrals
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  48h Cross-Ministry Link
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  Broadcast binding Ministerial Circulars to field staff or issue 48-hour statutory referrals to Sister Ministries.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* EXECUTIVE PROFILE & STATUTORY MANDATE BANNER */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                  {activeMinistry.uniqueFeatureBadge}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-600 dark:text-slate-400">
                  Accounting Officer: <strong className="text-slate-900 dark:text-white">{activeMinistry.permSecretary}</strong> ({activeMinistry.roleTitle})
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {activeMinistry.uniqueFeatureName}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {activeMinistry.uniqueFeatureDesc}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
                <span>Statutory Authority: <strong className="text-slate-900 dark:text-slate-200">{activeMinistry.statutoryAct}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Inter-Agency Sync: <strong className="text-emerald-600 dark:text-emerald-400">{activeMinistry.interAgencyCollabScore}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Risk Index: <strong className="text-emerald-600 dark:text-emerald-400">{activeMinistry.risk}</strong></span>
              </div>
            </div>

            {/* Micro KPI Cluster */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0">
              <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] min-w-[120px]">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Cabinet Delivery</div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{activeMinistry.cabinetDeliveryIndex}%</div>
                <div className="text-[9.5px] font-mono text-slate-500">Benchmark Met</div>
              </div>

              <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] min-w-[120px]">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Statutory SLA</div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{activeMinistry.slaScore}</div>
                <div className="text-[9.5px] font-mono text-slate-500">Speed: {activeMinistry.macroSpeedHours}h</div>
              </div>

              <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] min-w-[120px]">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Active Cases</div>
                <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">{activeMinistry.activeCases}</div>
                <div className="text-[9.5px] font-mono text-slate-500">In Sector Queue</div>
              </div>

              <div className="p-3 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] min-w-[120px]">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Proof Verified</div>
                <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{activeMinistry.resolvedCases}</div>
                <div className="text-[9.5px] font-mono text-slate-500">Citizen Closed</div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS CONTROLLER */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('desk_operations')}
              className={`text-xs font-mono font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border ${
                activeTab === 'desk_operations'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Domain Operations &amp; Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('cabinet_league')}
              className={`text-xs font-mono font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border ${
                activeTab === 'cabinet_league'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cabinet Delivery League Table</span>
            </button>

            <button
              onClick={() => setActiveTab('circulars')}
              className={`text-xs font-mono font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border ${
                activeTab === 'circulars'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                {isMinisterReadOnly
                  ? 'Ministerial Policy Advisories'
                  : 'Ministerial Circulars & Directives'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toast(`Statutory Sector Dossier exported for Cabinet inspection.`, 'emerald')}
              className="text-xs font-mono font-semibold px-3 py-1.5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-800 dark:text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Cabinet Brief</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DOMAIN OPERATIONS & TELEMETRY */}
        {activeTab === 'desk_operations' && (
          <div className="space-y-4">
            {/* SECTOR 1: FISCAL / MOFPED (TREASURY) */}
            {activeMinistry.sector === 'FISCAL' && (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      Section 15 PFMA Statutory Budget Freeze &amp; Discretionary Equalization Grants (DDEG)
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      Correlate citizen unresolved service tickets with unspent district bank balances. The Permanent Secretary / Secretary to the Treasury is empowered to freeze quarterly development disbursals to defaulting accounting officers.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10.5px] font-mono font-semibold text-amber-600 dark:text-amber-400">
                      TSA Connected
                    </span>
                  </div>
                </div>

                {/* Grants Table */}
                <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden">
                  <div className="p-4 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      District Treasury Accounts vs. Citizen Complaint Correlation
                    </h3>
                    <span className="text-xs font-mono text-slate-500">Live TSA Data Sync</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8f9fa] dark:bg-[#0e1116] text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 border-b border-[#e3e6ea] dark:border-[#262b36]">
                        <tr>
                          <th className="py-3 px-4">Local Government Node</th>
                          <th className="py-3 px-4">Quarterly Allocation</th>
                          <th className="py-3 px-4">Disbursed (TSA)</th>
                          <th className="py-3 px-4">Unspent Balance</th>
                          <th className="py-3 px-4">Unresolved Complaints</th>
                          <th className="py-3 px-4">Statutory Status</th>
                          <th className="py-3 px-4 text-right">
                            {isMinisterReadOnly ? 'Ministerial Policy Flag (RO)' : 'PFMA Sanction Action'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                        {(activeMinistry.fiscalGrants || []).map((row) => {
                          const isFrozen = frozenDistricts[row.district];
                          return (
                            <tr key={row.district} className="hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] transition-colors">
                              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                                {row.district}
                              </td>
                              <td className="py-3 px-4 font-mono">{row.quarterAllocation}</td>
                              <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400">{row.amountDisbursed}</td>
                              <td className="py-3 px-4 font-mono text-amber-600 dark:text-amber-400">{row.unspentBalance}</td>
                              <td className="py-3 px-4 font-mono font-semibold">
                                <span className={row.unresolvedComplaints > 20 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}>
                                  {row.unresolvedComplaints} open
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono text-[10px] font-semibold">
                                {isFrozen ? (
                                  <span className="text-rose-600 dark:text-rose-400">
                                    FROZEN S.15
                                  </span>
                                ) : row.unresolvedComplaints > 30 ? (
                                  <span className="text-amber-600 dark:text-amber-400">
                                    UNDER REVIEW
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 dark:text-emerald-400">
                                    NORMAL
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => toggleBudgetFreeze(row.district)}
                                  className={`text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                    isMinisterReadOnly
                                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                      : isFrozen
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                                  }`}
                                >
                                  {isMinisterReadOnly
                                    ? 'RO · Flag PS to Review'
                                    : isFrozen
                                    ? 'Lift S.15 Freeze'
                                    : 'Freeze Disbursal'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SECTOR 2: INFRASTRUCTURE / MOWT (WORKS & TRANSPORT) */}
            {activeMinistry.sector === 'INFRASTRUCTURE' && (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      District Road Unit Heavy Equipment Telemetry &amp; Fuel Auditing
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      Live telemetry across public Komatsu/Sumitomo motor graders and excavators. Prevents private illegal hiring, tracks engine hours vs. graded kilometers, and logs fuel allocations.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      146 Units Tracked
                    </span>
                  </div>
                </div>

                {/* Road Equipment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(activeMinistry.roadEquipment || []).map((eq) => (
                    <div
                      key={eq.unitId}
                      className="p-4 bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
                            {eq.district}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {eq.model}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500">
                            {eq.unitId}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-semibold uppercase ${
                            eq.status === 'ACTIVE'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : eq.status === 'GEOFENCE_ALERT'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {eq.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-center text-xs">
                        <div>
                          <div className="text-[9.5px] font-mono text-slate-500">Engine Hrs</div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white">{eq.operatingHours}h</div>
                        </div>
                        <div>
                          <div className="text-[9.5px] font-mono text-slate-500">Fuel Used</div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white">{eq.fuelUsedLiters}L</div>
                        </div>
                        <div>
                          <div className="text-[9.5px] font-mono text-slate-500">Graded Km</div>
                          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{eq.gradedKilometers} km</div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{eq.lastGpsLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{eq.assignedOperator}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2">
                        <button
                          onClick={() => toast(`Audit ping sent to GPS tracker on ${eq.unitId}. Engine diagnostics normal.`, 'emerald')}
                          className="text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          Ping GPS Unit
                        </button>
                        <button
                          onClick={() => {
                            if (isMinisterReadOnly) {
                              toast(
                                `[READ-ONLY MINISTER WARRANT] Policy Advisory sent to PS (${activeMinistry.permSecretary}) for ${eq.district} Road Unit.`,
                                'amber'
                              );
                            } else {
                              toast(`Dispatch order issued for ${eq.district} Road Maintenance crew.`, 'emerald');
                            }
                          }}
                          className={`text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg cursor-pointer ${
                            isMinisterReadOnly
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isMinisterReadOnly ? 'RO · Flag PS' : 'Assign Stretch'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTOR 3: HEALTH / MOH */}
            {activeMinistry.sector === 'HEALTH' && (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      National Medical Stores (NMS) Stock-Out Verification &amp; Drug Diversion Audit
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      When citizens report &ldquo;no medicines&rdquo; at public health centers, cross-reference facility inventory with official NMS central delivery manifests to immediately identify drug theft or unauthorized charging.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      NMS Manifest Connected
                    </span>
                  </div>
                </div>

                {/* Health Units Table */}
                <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden">
                  <div className="p-4 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Frontline Medicine Availability &amp; Stock-Out Triage
                    </h3>
                    <span className="text-xs font-mono text-slate-500">Live Health Centre Audits</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8f9fa] dark:bg-[#0e1116] text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 border-b border-[#e3e6ea] dark:border-[#262b36]">
                        <tr>
                          <th className="py-3 px-4">Facility &amp; District</th>
                          <th className="py-3 px-4">Drug Category</th>
                          <th className="py-3 px-4">Stock Status</th>
                          <th className="py-3 px-4">Last NMS Delivery</th>
                          <th className="py-3 px-4">Citizen Reports</th>
                          <th className="py-3 px-4">Investigation Status</th>
                          <th className="py-3 px-4 text-right">Statutory Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                        {(activeMinistry.drugAlerts || []).map((d) => {
                          const isInspected = inspectedFacilities[d.facilityName];
                          return (
                            <tr key={d.facilityName} className="hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] transition-colors">
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-900 dark:text-white">{d.facilityName}</div>
                                <div className="text-[10px] font-mono text-slate-500">{d.level} · {d.district}</div>
                              </td>
                              <td className="py-3 px-4">{d.drugCategory}</td>
                              <td className="py-3 px-4 font-mono text-[10px] font-semibold">
                                <span
                                  className={
                                    d.stockStatus === 'ADEQUATE'
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : d.stockStatus === 'CRITICAL_LOW'
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-rose-600 dark:text-rose-400'
                                  }
                                >
                                  {d.stockStatus.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono">{d.lastDeliveryBatch}</td>
                              <td className="py-3 px-4 font-mono font-semibold text-rose-600 dark:text-rose-400">
                                {d.citizenReportsCount} alerts
                              </td>
                              <td className="py-3 px-4 font-mono text-[10px]">
                                {isInspected ? (
                                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    SQUAD EN ROUTE
                                  </span>
                                ) : (
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {d.investigationStatus.replace('_', ' ')}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleDispatchDrugSquad(d.facilityName)}
                                  className={`text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg cursor-pointer ${
                                    isMinisterReadOnly
                                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  }`}
                                >
                                  {isMinisterReadOnly
                                    ? 'RO · Flag PS'
                                    : isInspected
                                    ? 'Track Squad'
                                    : 'Dispatch Squad'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SECTOR 4: EDUCATION / MOES */}
            {activeMinistry.sector === 'EDUCATION' && (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      Universal Primary (UPE) &amp; Secondary (USE) Capitation &amp; Safety Hazard Radar
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      Enforce strict prohibition against unauthorized school fees, track teacher payroll attendance, and prioritize emergency renovations for condemned classroom roofs and pit latrines.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      Capitation Disbursed
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden">
                  <div className="p-4 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Public School Integrity &amp; Hazard Inspection Roster
                    </h3>
                    <span className="text-xs font-mono text-slate-500">Live School Census</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8f9fa] dark:bg-[#0e1116] text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 border-b border-[#e3e6ea] dark:border-[#262b36]">
                        <tr>
                          <th className="py-3 px-4">School &amp; District</th>
                          <th className="py-3 px-4">Level</th>
                          <th className="py-3 px-4">Capitation Disbursed</th>
                          <th className="py-3 px-4">Illegal Fees Flag</th>
                          <th className="py-3 px-4">Structural Hazard</th>
                          <th className="py-3 px-4">Teacher Attendance</th>
                          <th className="py-3 px-4 text-right">Inspector Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                        {(activeMinistry.schoolAudits || []).map((s) => (
                          <tr key={s.schoolName} className="hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                              <div>{s.schoolName}</div>
                              <div className="text-[10px] font-mono text-slate-500 font-normal">{s.district}</div>
                            </td>
                            <td className="py-3 px-4">{s.level}</td>
                            <td className="py-3 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">{s.capitationGrantDisbursed}</td>
                            <td className="py-3 px-4 font-mono text-[10px] font-semibold">
                              {s.illegalFeesReported ? (
                                <span className="text-rose-600 dark:text-rose-400">
                                  ILLEGAL FEES FLAGGED
                                </span>
                              ) : (
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  COMPLIANT
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-[10px]">
                              <span
                                className={
                                  s.hazardRisk === 'SAFE'
                                    ? 'text-slate-600 dark:text-slate-400'
                                    : 'text-rose-600 dark:text-rose-400 font-semibold'
                                }
                              >
                                {s.hazardRisk.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold">
                              <span className={s.teacherAttendanceRate < 80 ? 'text-rose-600' : 'text-emerald-600'}>
                                {s.teacherAttendanceRate}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() =>
                                  toast(
                                    isMinisterReadOnly
                                      ? `[READ-ONLY MINISTER WARRANT] Policy Advisory sent to PS for ${s.schoolName}.`
                                      : `Direct statutory notice sent to Head Teacher of ${s.schoolName}.`,
                                    isMinisterReadOnly ? 'amber' : 'emerald'
                                  )
                                }
                                className={`text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg cursor-pointer ${
                                  isMinisterReadOnly
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                              >
                                {isMinisterReadOnly ? 'RO · Flag PS' : 'Issue Query'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SECTOR 5: WATER & ENVIRONMENT / MOWE */}
            {activeMinistry.sector === 'WATER_ENVIRONMENT' && (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      Rural Borehole Telemetry &amp; Wetland Encroachment Rapid Referral Unit
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      Track rural water point downtime and dispatch area mechanics with replacement parts within 48 hours. Monitor illegal backfilling of gazetted ecological wetlands.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      Boreholes Live
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(activeMinistry.boreholeTelemetry || []).map((b) => {
                    const isDispatched = dispatchedMechanics[b.pointId];
                    return (
                      <div
                        key={b.pointId}
                        className="p-4 bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">
                              {b.subCounty} · {b.district}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {b.waterType}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-500">
                              {b.pointId}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono font-semibold uppercase ${
                              b.status === 'FUNCTIONAL'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {b.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-center text-xs">
                          <div>
                            <div className="text-[9.5px] font-mono text-slate-500">Days Offline</div>
                            <div className="font-mono font-bold text-rose-600 dark:text-rose-400">
                              {b.daysDowntime} days
                            </div>
                          </div>
                          <div>
                            <div className="text-[9.5px] font-mono text-slate-500">Households</div>
                            <div className="font-mono font-bold text-slate-900 dark:text-white">
                              {b.beneficiaryHouseholds}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-500">
                            {isDispatched ? 'Mechanic En Route' : 'Status: Ready'}
                          </span>
                          <button
                            onClick={() => handleDispatchMechanic(b.pointId, b.subCounty)}
                            className={`text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg cursor-pointer ${
                              isMinisterReadOnly
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {isMinisterReadOnly
                              ? 'RO · Flag PS'
                              : isDispatched
                              ? 'Track Mechanic'
                              : 'Dispatch Spares & Crew'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTOR 6: ICT & DIGITAL / MOICT */}
            {activeMinistry.sector === 'ICT_DIGITAL' && (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      National USSD Gateway (*3030#) &amp; Telecom Carrier Offline Telemetry
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      Live telemetry across telecommunications carriers ensuring citizens without internet can dial *3030# to log hazards and query their district accounting officers.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      99.98% Gateway Uptime
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(activeMinistry.ussdGateways || []).map((gw) => (
                    <div
                      key={gw.gatewayCode}
                      className="p-4 bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                            {gw.carrier}
                          </h4>
                          <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {gw.gatewayCode}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                          {gw.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-center text-xs">
                        <div>
                          <div className="text-[9.5px] font-mono text-slate-500">Uptime</div>
                          <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{gw.uptimePercent}%</div>
                        </div>
                        <div>
                          <div className="text-[9.5px] font-mono text-slate-500">Avg Latency</div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white">{gw.avgLatencyMs}ms</div>
                        </div>
                        <div>
                          <div className="text-[9.5px] font-mono text-slate-500">Rate / Min</div>
                          <div className="font-mono font-bold text-slate-900 dark:text-white">{gw.throughputPerMin} sms</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500">
                          Data Protection Compliance: 100%
                        </span>
                        <button
                          onClick={() => toast(`Simulated USSD test packet pinged to ${gw.carrier}. Latency: ${gw.avgLatencyMs}ms.`, 'emerald')}
                          className="text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                        >
                          Ping Gateway
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTOR 7: CABINET DELIVERY / OPM */}
            {activeMinistry.sector === 'CABINET_DELIVERY' && (
              <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                      Leader of Government Business &amp; Cabinet Delivery League Table
                    </strong>
                    <span className="text-slate-600 dark:text-slate-400">
                      The Office of the Prime Minister / Cabinet Secretariat monitors cross-ministerial performance contracts and resolves inter-agency deadlocks with statutory 48-hour directives.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      Cabinet Authority Active
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden">
                  <div className="p-4 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Statutory Cabinet Delivery League Table
                    </h3>
                    <span className="text-xs font-mono text-slate-500">Official Civil Service Rankings</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f8f9fa] dark:bg-[#0e1116] text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 border-b border-[#e3e6ea] dark:border-[#262b36]">
                        <tr>
                          <th className="py-3 px-4">Statutory Rank</th>
                          <th className="py-3 px-4">Ministry &amp; Accounting Officer</th>
                          <th className="py-3 px-4">Cabinet Delivery Index</th>
                          <th className="py-3 px-4">SLA Adherence</th>
                          <th className="py-3 px-4">Inter-Agency Collab</th>
                          <th className="py-3 px-4">Pending Inquiries</th>
                          <th className="py-3 px-4 text-right">Statutory Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                        {(activeMinistry.cabinetDelivery || []).map((c) => (
                          <tr key={c.ministryName} className="hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              #{c.statutoryRank}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                              <div>{c.ministryName}</div>
                              <div className="text-[10px] font-mono text-slate-500 font-normal">{c.psName}</div>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {c.deliveryIndex}%
                            </td>
                            <td className="py-3 px-4 font-mono">{c.slaAdherence}%</td>
                            <td className="py-3 px-4 font-mono">{c.interAgencySync}%</td>
                            <td className="py-3 px-4 font-mono font-semibold text-amber-600 dark:text-amber-400">
                              {c.pendingInquiries} open
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => toast(`Statutory Cabinet Performance Review summoned for ${c.ministryName}.`, 'emerald')}
                                className="text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 cursor-pointer"
                              >
                                Summon Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CABINET DELIVERY LEAGUE TABLE */}
        {activeTab === 'cabinet_league' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    National Inter-Ministerial League Table ({COUNTRIES[currentCountry]?.name || currentCountry})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Aggregated citizen incident resolution performance, turnaround SLA adherence, and inter-agency collaboration.
                  </p>
                </div>
                <button
                  onClick={() => toast(`Statutory League Table exported for Cabinet meeting.`, 'emerald')}
                  className="text-xs font-mono font-semibold px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export League Table</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lineMinistries.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border space-y-3 transition-all ${
                      m.id === activeMinistry.id
                        ? 'bg-white dark:bg-[#161a22] border-emerald-500/60'
                        : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          RANK #{idx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {m.shortTitle}
                        </h4>
                        <div className="text-[10px] font-mono text-slate-500 truncate">{m.permSecretary}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                          {m.cabinetDeliveryIndex}%
                        </div>
                        <div className="text-[9.5px] font-mono text-slate-500">Delivery Index</div>
                      </div>
                    </div>

                    <div className="p-2 bg-white dark:bg-[#161a22] rounded-lg border border-[#e3e6ea] dark:border-[#262b36] grid grid-cols-3 gap-1 text-center text-xs">
                      <div>
                        <div className="text-[9.5px] font-mono text-slate-500">SLA</div>
                        <div className="font-mono font-bold">{m.slaScore}</div>
                      </div>
                      <div>
                        <div className="text-[9.5px] font-mono text-slate-500">Speed</div>
                        <div className="font-mono font-bold">{m.macroSpeedHours}h</div>
                      </div>
                      <div>
                        <div className="text-[9.5px] font-mono text-slate-500">Sync</div>
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{m.interAgencyCollabScore}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-slate-500">{m.activeCases} active cases</span>
                      {m.id === activeMinistry.id ? (
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          Active Jurisdiction
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setReferralTargetMinistry(m.id);
                            setReferralModalOpen(true);
                          }}
                          className="text-[10.5px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-amber-500 cursor-pointer"
                          title="Cross-ministry access is restricted. Dispatch a 48h statutory referral instead."
                        >
                          48h Referral →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MINISTERIAL CIRCULARS / POLICY ADVISORIES */}
        {activeTab === 'circulars' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] p-4 sm:p-5 space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {isMinisterReadOnly
                    ? `Submit Ministerial Policy Advisory to Permanent Secretary — ${activeMinistry.title}`
                    : `Issue Statutory Ministerial Circular — ${activeMinistry.title}`}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {isMinisterReadOnly
                    ? `As Cabinet Minister / Political Head, issue a formal Policy Advisory Note to ${activeMinistry.permSecretary} (Accounting Officer) for statutory operational execution.`
                    : `Statutory policy directives issued by the Permanent Secretary are delivered directly to all line directors, district departmental heads, and field staff.`}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  logAudit(
                    isMinisterReadOnly ? 'minister_policy_advisory_issued' : 'ministerial_circular_issued',
                    activeMinistry.shortTitle,
                    isMinisterReadOnly
                      ? `Cabinet Minister Policy Advisory submitted to ${activeMinistry.permSecretary} (${activeMinistry.shortTitle})`
                      : `Ministerial circular broadcast to all ${activeMinistry.shortTitle} departmental heads by ${activeMinistry.permSecretary}`,
                    currentCountry
                  );
                  toast(
                    isMinisterReadOnly
                      ? `Ministerial Policy Advisory delivered to ${activeMinistry.permSecretary} (Accounting Officer)!`
                      : `Statutory Circular broadcast to all ${activeMinistry.shortTitle} line officers!`,
                    'emerald'
                  );
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-[10.5px] font-mono uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    {isMinisterReadOnly ? 'Policy Advisory Subject' : 'Circular Subject / Statutory Ref'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. STATUTORY CIRCULAR NO. 04 OF 2026 — MANDATORY 48H RESOLUTION ON ${activeMinistry.shortTitle.toUpperCase()} INFRASTRUCTURE`}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-mono uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Policy Directive Body
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter the policy instructions or statutory guidance..."
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg p-3.5 text-xs leading-relaxed text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    Signed &amp; Authorized by:{' '}
                    <strong className="text-slate-900 dark:text-white">
                      {isMinisterReadOnly ? user?.name || 'Hon. Cabinet Minister' : activeMinistry.permSecretary}
                    </strong>
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isMinisterReadOnly ? 'Send Policy Advisory to PS' : 'Broadcast Ministerial Directive'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* REFERRAL TO SISTER MINISTRY MODAL */}
      {referralModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] max-w-lg w-full p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Inter-Ministerial Link
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Statutory 48-Hour Cross-Agency Query
                </h3>
              </div>
              <button
                onClick={() => setReferralModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Dispatches a binding inter-ministerial inquiry from <strong>{activeMinistry.title}</strong> to a sister ministry with an automatic statutory 48-hour resolution clock.
            </p>

            <form onSubmit={handleInterMinisterialReferral} className="space-y-3.5">
              <div>
                <label className="text-[10.5px] font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Destination Ministry
                </label>
                <select
                  value={referralTargetMinistry}
                  onChange={(e) => setReferralTargetMinistry(e.target.value)}
                  required
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="">Select Sister Ministry...</option>
                  {lineMinistries
                    .filter((m) => m.id !== activeMinistry.id)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title} ({m.permSecretary})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-mono uppercase tracking-wider font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Subject &amp; Statutory Justification
                </label>
                <input
                  type="text"
                  value={referralSubject}
                  onChange={(e) => setReferralSubject(e.target.value)}
                  placeholder="e.g. Road drainage overflow contaminating borehole in Kasangati SC"
                  required
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReferralModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-xs rounded-lg cursor-pointer"
                >
                  Dispatch Statutory Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
