import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, allDepts } from '../data/countries';
import { Department, EntityCategory } from '../types';
import {
  Search,
  ChevronRight,
  Building2,
  ShieldCheck,
  PhoneCall,
  Radio,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Award,
  GraduationCap,
  HeartPulse,
  Utensils,
  Landmark,
  Bus,
  Store,
  Zap,
  Plus,
  Star,
  Bookmark,
  ExternalLink,
  Check,
  X,
  TrendingDown,
  HelpCircle,
  QrCode,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DeptIcon } from '../components/DeptIcon';
import { ProviderClaimModal } from '../components/ProviderClaimModal';
import { QrCodeModal } from '../components/QrCodeModal';
import { CustomerDefectionNotice } from '../components/CustomerDefectionNotice';
import { CountrySelector } from '../components/CountrySelector';
import { getCountryBranding } from '../data/countryBranding';

const CATEGORY_TABS: { id: 'all' | EntityCategory | 'mystake'; label: string; icon: any; color: string }[] = [
  { id: 'all', label: 'All Providers', icon: Building2, color: 'text-slate-700 dark:text-slate-300' },
  { id: 'mystake', label: 'My Stakes', icon: Bookmark, color: 'text-amber-600 dark:text-amber-400' },
  { id: 'education', label: 'Schools & Unis', icon: GraduationCap, color: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'health', label: 'Hospitals & Clinics', icon: HeartPulse, color: 'text-rose-600 dark:text-rose-400' },
  { id: 'hospitality', label: 'Dining & Foods', icon: Utensils, color: 'text-orange-600 dark:text-orange-400' },
  { id: 'finance', label: 'Banks & SACCOs', icon: Landmark, color: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'transport', label: 'Transit & SACCOs', icon: Bus, color: 'text-cyan-600 dark:text-cyan-400' },
  { id: 'housing', label: 'Malls & Markets', icon: Store, color: 'text-purple-600 dark:text-purple-400' },
  { id: 'utility', label: 'Power & Water', icon: Zap, color: 'text-yellow-600 dark:text-yellow-400' },
  { id: 'government', label: 'Gov Desks', icon: Building2, color: 'text-blue-600 dark:text-blue-400' },
  { id: 'cso', label: 'CSOs & NGOs', icon: ShieldCheck, color: 'text-teal-600 dark:text-teal-400' },
];

export const DepartmentsView: React.FC = () => {
  const {
    user,
    ensureCitizenSession,
    posts,
    projects,
    go,
    setActiveDept,
    setActiveDeptCountry,
    setUser,
    toast,
    isEntityClaimed,
    getClaimedEntity,
    openGuide,
  } = useApp();
  const [search, setSearch] = useState('');
  const [selectedLane, setSelectedLane] = useState<'all' | 'civic' | 'consumer'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | EntityCategory | 'mystake'>('all');
  const [sortBy, setSortBy] = useState<'trust' | 'sla' | 'posts' | 'name'>('trust');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimModalDept, setClaimModalDept] = useState<Department | null>(null);
  const [placardDept, setPlacardDept] = useState<Department | null>(null);
  const [customDepts, setCustomDepts] = useState<Department[]>([]);
  const [showMarketAudit, setShowMarketAudit] = useState(false);

  // Registration form state
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptFull, setNewDeptFull] = useState('');
  const [newDeptCategory, setNewDeptCategory] = useState<EntityCategory>('education');
  const [newDeptLocation, setNewDeptLocation] = useState('');
  const [newDeptSla, setNewDeptSla] = useState(24);

  const activeUser = user || ensureCitizenSession();
  const country = activeUser.country || 'UG';
  const branding = getCountryBranding(country);
  const baseDepts = allDepts(country);
  const depts = useMemo(() => [...customDepts, ...baseDepts], [customDepts, baseDepts]);
  const followed = activeUser.followed || [];

  const getDeptMetrics = (d: Department) => {
    const dPosts = posts.filter((p) => p.dept === d.id && p.country === country);
    const resolved = dPosts.filter((p) => p.status === 'resolved').length;
    const overdue = dPosts.filter((p) => p.status === 'overdue' || p.gov_status === 'overdue').length;
    const postCount = dPosts.length;
    const liveReports = dPosts.filter((p) => p.status !== 'resolved').length;
    const baseSla = d.sla || 48;
    const trustScore = d.trustScore || 88;

    const rawRate = postCount > 0 ? (resolved / Math.max(1, postCount)) * 100 : trustScore;
    const complianceRate = Math.min(99.4, Math.max(45, Math.round(rawRate > 0 ? rawRate : 88.5)));
    const avgResponseHours = (baseSla * 0.42).toFixed(1);

    const isHighPerf = (trustScore >= 90 || complianceRate >= 85) && overdue === 0;
    const isUnderAudit = overdue > 2 || complianceRate < 60;

    const ussdCode = `*3030*${(d.id.charCodeAt(0) % 50) + 10}#`;
    const tollFree = d.lane === 'consumer' ? '0800 200 900' : '0800 100 066';

    let leadership = 'Designated Lead & Compliance Officer';
    if (d.category === 'education') {
      leadership = 'Headteacher / Academic Registrar Office';
    } else if (d.category === 'health') {
      leadership = 'Medical Director & Clinical Quality Unit';
    } else if (d.category === 'hospitality') {
      leadership = 'Operations Director & Food Safety Head';
    } else if (d.category === 'finance') {
      leadership = 'Branch Manager & Consumer Protection Desk';
    } else if (d.category === 'transport') {
      leadership = 'Stage Master & Route Inspector';
    } else if (d.category === 'housing') {
      leadership = 'Property Manager & Tenancy Liaison';
    } else if (d.id.includes('kcca')) {
      leadership = 'Eng. David Luyimbazi (Director Engineering)';
    } else if (d.id.includes('nwsc')) {
      leadership = 'Dr. Eng. Silver Mugisha (Managing Director)';
    } else if (d.id.includes('unra')) {
      leadership = 'Eng. Samuel Muhoozi (Director Roads)';
    }

    const activeTendersCount = projects.filter((p) => p.dept === d.id).length || (d.lane === 'civic' ? 2 : 0);

    return {
      postCount,
      resolved,
      overdue,
      liveReports,
      complianceRate,
      trustScore,
      avgResponseHours,
      isHighPerf,
      isUnderAudit,
      ussdCode,
      tollFree,
      leadership,
      activeTendersCount,
      baseSla,
    };
  };

  const toggleFollow = (id: string) => {
    let newFollowed = [...followed];
    if (newFollowed.includes(id)) {
      newFollowed = newFollowed.filter((item) => item !== id);
      toast('Removed from your monitored stake', 'amber');
    } else {
      newFollowed.push(id);
      toast('Pinned to your monitored stake watchlist', 'emerald');
    }
    setUser({ ...activeUser, followed: newFollowed });
  };

  const handleRegisterDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    const newId = `custom_${newDeptName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;

    const newEntity: Department = {
      id: newId,
      name: newDeptName.trim(),
      full: newDeptFull.trim() || newDeptName.trim(),
      category: newDeptCategory,
      country: country,
      icon: newDeptCategory,
      sla: newDeptSla,
      lane: newDeptCategory === 'government' ? 'civic' : 'consumer',
      trustScore: 85,
      verified: false,
      location: newDeptLocation.trim() || `${COUNTRIES[country]?.name || 'National'}`,
      qualityAudit: 'Citizen Registered Provider',
      sector: newDeptCategory.toUpperCase(),
    };

    setCustomDepts([newEntity, ...customDepts]);
    setShowRegisterModal(false);
    setNewDeptName('');
    setNewDeptFull('');
    setNewDeptLocation('');
    toast(`Registered "${newEntity.name}" to the service registry!`, 'emerald');

    toggleFollow(newEntity.id);
  };

  const filteredDepts = depts
    .filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.ministry && d.ministry.toLowerCase().includes(search.toLowerCase())) ||
        (d.full && d.full.toLowerCase().includes(search.toLowerCase())) ||
        (d.sector && d.sector.toLowerCase().includes(search.toLowerCase())) ||
        (d.location && d.location.toLowerCase().includes(search.toLowerCase()));

      const matchLane = selectedLane === 'all' || d.lane === selectedLane;

      let matchCategory = true;
      if (selectedCategory === 'mystake') {
        matchCategory = followed.includes(d.id);
      } else if (selectedCategory !== 'all') {
        matchCategory = d.category === selectedCategory;
      }

      return matchSearch && matchLane && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'trust') {
        return (b.trustScore || 85) - (a.trustScore || 85);
      }
      if (sortBy === 'sla') {
        return getDeptMetrics(b).complianceRate - getDeptMetrics(a).complianceRate;
      }
      if (sortBy === 'posts') {
        return getDeptMetrics(b).postCount - getDeptMetrics(a).postCount;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="px-3.5 sm:px-5 pt-4 pb-24 max-w-4xl mx-auto space-y-3 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Top Studio Header Card */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Sovereign &amp; Service Directory
              </span>
              <span>·</span>
              <span>{COUNTRIES[country]?.name || 'National'} Node</span>
              <span>·</span>
              <span>{depts.length} Monitored</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {COUNTRIES[country]?.name} Service Registry
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Statutory ministries, municipal utilities, schools, hospitals, transport SACCOs, and financial desks.
            </p>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
            <CountrySelector variant="compact" />
            <button
              type="button"
              onClick={() => {
                setClaimModalDept(null);
                setShowClaimModal(true);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck size={13} />
              <span>Claim Desk</span>
            </button>
            <button
              type="button"
              onClick={() => go('gov_partnership')}
              className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Landmark size={13} className="text-amber-600 dark:text-amber-400" />
              <span>Partnership Hub</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-800 dark:text-slate-200 font-mono font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Register</span>
            </button>
          </div>
        </div>

        {/* Collapsible Market Retention & Sovereign Accord Strip — Prevents Vertical Congestion */}
        <div className="pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36]">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowMarketAudit(!showMarketAudit)}
              className="flex items-center gap-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer min-w-0"
            >
              <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate font-semibold">{branding.advertisingCampaign.campaignTitle}</span>
              <span className="text-[10.5px] font-mono text-rose-600 dark:text-rose-400 hidden sm:inline">
                · {branding.advertisingCampaign.churnStatistic}
              </span>
              {showMarketAudit ? <ChevronUp size={13} className="shrink-0" /> : <ChevronDown size={13} className="shrink-0" />}
            </button>

            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {followed.length} Staked · {branding.currency}
            </span>
          </div>

          {showMarketAudit && (
            <div className="mt-3 p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5 text-xs animate-fade-in">
              <div className="font-semibold text-slate-900 dark:text-white">
                {branding.advertisingCampaign.headline}
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11.5px]">
                {branding.advertisingCampaign.body}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap pt-1 text-[10.5px] font-mono">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                    <TrendingDown size={12} /> {branding.advertisingCampaign.churnStatistic}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 size={12} /> {branding.advertisingCampaign.retentionBenefit}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setClaimModalDept(null);
                    setShowClaimModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                >
                  {branding.advertisingCampaign.callToAction}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search & Sector Filter Studio Bar */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3 space-y-2.5">
        {/* Search Input + Sort Control on Single Clean Row */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2">
            <Search size={14} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search school, hospital, bank, SACCO, utility, or ministry..."
              className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setSortBy(sortBy === 'trust' ? 'sla' : sortBy === 'sla' ? 'posts' : sortBy === 'posts' ? 'name' : 'trust')
            }
            className="px-2.5 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 rounded-lg text-[10.5px] font-mono font-semibold whitespace-nowrap hover:border-emerald-500 transition-colors cursor-pointer shrink-0"
            title="Cycle sort order"
          >
            Sort: {sortBy === 'trust' ? 'Trust' : sortBy === 'sla' ? 'SLA %' : sortBy === 'posts' ? 'Reports' : 'A–Z'}
          </button>
        </div>

        {/* Category Filter Tabs Scrollbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            const isStakeTab = tab.id === 'mystake';
            const count =
              tab.id === 'all'
                ? depts.length
                : tab.id === 'mystake'
                ? depts.filter((d) => followed.includes(d.id)).length
                : depts.filter((d) => d.category === tab.id).length;

            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-mono font-semibold text-[11px] whitespace-nowrap transition-colors border cursor-pointer ${
                  isSelected
                    ? isStakeTab
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                    : isStakeTab
                    ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:border-amber-500'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
                }`}
              >
                <Icon
                  size={12}
                  className={
                    isSelected
                      ? isStakeTab
                        ? 'text-slate-950 fill-current'
                        : 'text-emerald-400 dark:text-emerald-600'
                      : tab.color
                  }
                />
                <span>{tab.label}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Segmented Sector Filter Strip */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#e3e6ea] dark:border-[#262b36] flex-wrap">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All Sectors' },
              { id: 'civic', label: 'Statutory Desks' },
              { id: 'consumer', label: 'Consumer Providers' },
            ].map((lane) => (
              <button
                type="button"
                key={lane.id}
                onClick={() => setSelectedLane(lane.id as any)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-semibold transition-colors cursor-pointer ${
                  selectedLane === lane.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lane.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openGuide('gov_vs_private')}
            className="text-[10.5px] font-mono font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle size={11} />
            <span>Statutory vs Private Guide</span>
          </button>
        </div>
      </div>

      {/* Entity Cards List — Clean Uncrowded Studio Layout */}
      <div className="space-y-2.5">
        {filteredDepts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl space-y-3">
            <Building2 size={32} className="mx-auto text-slate-400" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">No service provider found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                {selectedCategory === 'mystake'
                  ? "You haven't pinned any schools, hospitals, or desks to your stake watchlist yet. Tap '+ Stake' on any provider card to monitor it."
                  : 'You can register this provider to immediately track service standards and file verified reports.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowRegisterModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Register New Entity
            </button>
          </div>
        ) : (
          filteredDepts.map((d) => {
            const isF = followed.includes(d.id);
            const m = getDeptMetrics(d);
            const isConsumer = d.lane === 'consumer';
            const isClaimed = isEntityClaimed(d.id);
            const claimRecord = getClaimedEntity(d.id);
            const isPrivateEntity = isConsumer;

            return (
              <div
                key={d.id}
                className={`p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#161a22] border space-y-2.5 hover:border-emerald-500/60 transition-colors group ${
                  isF
                    ? 'border-amber-500/60 dark:border-amber-500/50'
                    : 'border-[#e3e6ea] dark:border-[#262b36]'
                }`}
              >
                {/* Row 1: Unobstructed Entity Title + Compact Non-Blocking Stake Button */}
                <div className="flex items-start justify-between gap-2.5">
                  <div
                    onClick={() => {
                      setActiveDept(d.id);
                      setActiveDeptCountry(country);
                      go('dept_wall');
                    }}
                    className="flex items-start gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 group-hover:border-emerald-500/50 transition-colors mt-0.5">
                      <DeptIcon dept={d} size={18} />
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                        {d.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                        {d.full}
                      </p>

                      {/* Clean Unboxed Typographic Metadata Strip (Zero-Pill Discipline) */}
                      <div className="flex items-center gap-1.5 flex-wrap text-[10.5px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="uppercase font-semibold text-slate-700 dark:text-slate-300">
                          {d.category || (isConsumer ? 'Private' : 'Sovereign')}
                        </span>
                        <span>·</span>
                        {!isPrivateEntity ? (
                          <span className={isClaimed ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-amber-600 dark:text-amber-400'}>
                            {isClaimed ? 'Sovereign Subscribed' : 'Sovereign Desk'}
                          </span>
                        ) : isClaimed ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Verified ({claimRecord?.plan?.toUpperCase() || 'PRO'})
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-medium">
                            Unclaimed Desk
                          </span>
                        )}
                        {d.location && (
                          <>
                            <span>·</span>
                            <span className="inline-flex items-center gap-0.5">
                              <MapPin size={10} className="shrink-0" />
                              <span>{d.location}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compact Non-Congesting Stake Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(d.id);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold border transition-colors flex items-center gap-1 shrink-0 cursor-pointer ${
                      isF
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                        : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-500/50 hover:text-amber-700 dark:hover:text-amber-300'
                    }`}
                    title={isF ? 'Pinned to your monitored stake watchlist' : 'Pin to your monitored stake watchlist'}
                  >
                    <Bookmark size={11} className={isF ? 'fill-current text-amber-500' : 'text-slate-400'} />
                    <span>{isF ? 'Staked' : '+ Stake'}</span>
                  </button>
                </div>

                {/* Row 2: Compact Single-Row Telemetry & Desk Officer Bar */}
                <div className="px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3 flex-wrap text-[11px] font-mono">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200">
                      <Star size={11} className="text-amber-500 fill-current" />
                      <strong className="tabular-nums">{d.trustScore || 88}%</strong>
                      <span className="text-slate-400 text-[10px]">Trust</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className={m.complianceRate >= 80 ? 'text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums' : 'text-amber-600 dark:text-amber-400 font-semibold tabular-nums'}>
                      {m.complianceRate}% On-Time
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-slate-600 dark:text-slate-300 tabular-nums">
                      {m.baseSla}h SLA
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-full sm:max-w-[260px]">
                    <UserCheck size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{m.leadership}</span>
                  </div>
                </div>

                {/* Compact Customer Care Alert (Only when private entity has low compliance) */}
                {isPrivateEntity && (m.complianceRate < 80 || m.liveReports > 0) && (
                  <CustomerDefectionNotice
                    dept={d}
                    complianceRate={m.complianceRate}
                    unresolvedCount={m.liveReports}
                    variant="compact"
                    onClaimClick={() => {
                      setClaimModalDept(d);
                      setShowClaimModal(true);
                    }}
                  />
                )}

                {/* Row 3: Uncluttered Bottom Action Strip */}
                <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>USSD {m.ussdCode}</span>
                    <span>·</span>
                    <span>{m.tollFree}</span>
                  </div>

                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlacardDept(d);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] transition-colors cursor-pointer"
                      title="Counter QR Placard"
                    >
                      <QrCode size={13} />
                    </button>

                    {isPrivateEntity && !isClaimed && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setClaimModalDept(d);
                          setShowClaimModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-emerald-700 dark:text-emerald-400 border border-[#e3e6ea] dark:border-[#262b36] transition-colors cursor-pointer"
                      >
                        Claim Desk
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDept(d.id);
                        setActiveDeptCountry(country);
                        go('compose');
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                    >
                      + File Report
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveDept(d.id);
                        setActiveDeptCountry(country);
                        go('dept_wall');
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Wall ({m.postCount})</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Register Service Provider Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Register a Service Provider</h3>
                <p className="text-[11px] text-slate-500">Add any school, clinic, eatery, SACCO, or desk to monitor</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRegisterDept} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  Service Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'education', label: 'School / Uni' },
                    { id: 'health', label: 'Hospital / Clinic' },
                    { id: 'hospitality', label: 'Restaurant / Cafe' },
                    { id: 'finance', label: 'Bank / SACCO' },
                    { id: 'transport', label: 'Transit / Bus' },
                    { id: 'housing', label: 'Mall / Market' },
                    { id: 'utility', label: 'Utility / Power' },
                    { id: 'cso', label: 'CSO / Watchdog' },
                    { id: 'government', label: 'Gov Desk' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewDeptCategory(cat.id as any)}
                      className={`p-2 rounded-lg text-[11px] font-semibold text-left transition-colors border flex items-center gap-1.5 cursor-pointer ${
                        newDeptCategory === cat.id
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <DeptIcon category={cat.id} size={13} />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Provider / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Greenhill Academy, Case Clinic, Kayoola Bus Transit"
                  className="w-full p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Official Full Title / Branch
                </label>
                <input
                  type="text"
                  value={newDeptFull}
                  onChange={(e) => setNewDeptFull(e.target.value)}
                  placeholder="e.g. Greenhill Academy Primary & Nursery - Kibuli Campus"
                  className="w-full p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Location / Parish / Street
                  </label>
                  <input
                    type="text"
                    value={newDeptLocation}
                    onChange={(e) => setNewDeptLocation(e.target.value)}
                    placeholder="e.g. Kibuli Road, Makindye"
                    className="w-full p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Expected SLA (Hours)
                  </label>
                  <select
                    value={newDeptSla}
                    onChange={(e) => setNewDeptSla(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                  >
                    <option value={24}>24 Hours (Emergency / Health)</option>
                    <option value={48}>48 Hours (Standard SLA)</option>
                    <option value={72}>72 Hours (Administrative)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    go('entity_register');
                  }}
                  className="w-full sm:w-auto text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center sm:justify-start gap-1 cursor-pointer"
                >
                  <ExternalLink size={12} />
                  <span>Full Multi-Tier Registration Portal</span>
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-400 font-semibold hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={14} /> Register Entity
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provider Claim & Subscribe Modal */}
      <ProviderClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        targetDept={claimModalDept}
        targetCountry={country}
        onSuccessClaim={(dept) => {
          setActiveDept(dept.id);
          setActiveDeptCountry(country);
        }}
      />

      {/* Official Counter QR Placard Modal */}
      <QrCodeModal
        isOpen={!!placardDept}
        onClose={() => setPlacardDept(null)}
        type="desk"
        dept={placardDept}
      />
    </div>
  );
};
