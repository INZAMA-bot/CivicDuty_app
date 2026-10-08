import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, allDepts } from '../data/countries';
import { Department, EntityCategory } from '../types';
import { 
  Search, 
  ChevronRight, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  PhoneCall, 
  Radio, 
  Clock, 
  MapPin, 
  Coins, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Flame, 
  Award,
  SlidersHorizontal,
  GraduationCap,
  HeartPulse,
  Utensils,
  Landmark,
  Bus,
  Store,
  Zap,
  ShieldAlert,
  Plus,
  Star,
  Bookmark,
  ExternalLink,
  Check,
  X,
  Globe,
  TrendingDown,
  HelpCircle,
  QrCode
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
  const { user, ensureCitizenSession, posts, projects, go, setActiveDept, setActiveDeptCountry, setUser, toast, isEntityClaimed, getClaimedEntity, openGuide } = useApp();
  const [search, setSearch] = useState('');
  const [selectedLane, setSelectedLane] = useState<'all' | 'civic' | 'consumer'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | EntityCategory | 'mystake'>('all');
  const [sortBy, setSortBy] = useState<'trust' | 'sla' | 'posts' | 'name'>('trust');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimModalDept, setClaimModalDept] = useState<Department | null>(null);
  const [placardDept, setPlacardDept] = useState<Department | null>(null);
  const [customDepts, setCustomDepts] = useState<Department[]>([]);

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

  // Generate enhanced SLA Performance and Official metrics for each department
  const getDeptMetrics = (d: Department) => {
    const dPosts = posts.filter((p) => p.dept === d.id && p.country === country);
    const resolved = dPosts.filter((p) => p.status === 'resolved').length;
    const overdue = dPosts.filter((p) => p.status === 'overdue' || p.gov_status === 'overdue').length;
    const postCount = dPosts.length;
    const liveReports = dPosts.filter((p) => p.status !== 'resolved').length;
    const baseSla = d.sla || 48;
    const trustScore = d.trustScore || 88;

    // SLA Compliance formula
    const rawRate = postCount > 0 ? ((resolved) / Math.max(1, postCount)) * 100 : trustScore;
    const complianceRate = Math.min(99.4, Math.max(45, Math.round(rawRate > 0 ? rawRate : 88.5)));
    const avgResponseHours = (baseSla * 0.42).toFixed(1);
    
    // Performance Tier
    const isHighPerf = (trustScore >= 90 || complianceRate >= 85) && overdue === 0;
    const isUnderAudit = overdue > 2 || complianceRate < 60;

    // Official contacts & USSD shortcode
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

    const activeTendersCount = projects.filter(p => p.dept === d.id).length || (d.lane === 'civic' ? 2 : 0);

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
      toast('Removed from your monitored stake', 'slate');
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
    
    // Automatically follow it
    toggleFollow(newEntity.id);
  };

  const filteredDepts = depts.filter((d) => {
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
  }).sort((a, b) => {
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
    <div className="px-3.5 sm:px-5 pt-4 pb-24 max-w-4xl mx-auto space-y-3.5 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Top Studio Header Card */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5 flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">SOVEREIGN &amp; SERVICE DIRECTORY</span>
              <span>·</span>
              <span>{COUNTRIES[country]?.name || 'National'} Node</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>{COUNTRIES[country]?.name} Service Registry</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                {depts.length} MONITORED
              </span>
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
              Statutory ministries, municipal water, grid power, schools, hospitals, transport SACCOs, and financial institutions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto flex-wrap">
            <CountrySelector variant="compact" />
            <button
              onClick={() => {
                setClaimModalDept(null);
                setShowClaimModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Claim private business profile (schools, clinics, SACCOs, transport, telecoms)"
            >
              <ShieldCheck size={13} />
              <span>Claim Desk</span>
            </button>
            <button
              onClick={() => go('gov_partnership')}
              className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-mono font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Sovereign Bilateral Accord provisioned by State-appointed personnel on behalf of all government desks"
            >
              <Landmark size={13} className="text-amber-600 dark:text-amber-400" />
              <span>Partnership Hub</span>
            </button>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-800 dark:text-slate-200 font-mono font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Register</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Private-First Rollout & Customer Care Market Dynamics Banner — AI Studio Matte Panel */}
      <div className="p-4 sm:p-5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3.5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={14} strokeWidth={1.75} />
            </div>
            <div>
              <span className="text-[8px] mono font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">
                {branding.advertisingCampaign.badge}
              </span>
            </div>
          </div>
          <span className="text-[9px] mono text-slate-500 font-bold self-start sm:self-auto">
            {branding.countryName.toUpperCase()} MARKET AUDIT · {branding.currency}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            {branding.advertisingCampaign.campaignTitle}
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {branding.advertisingCampaign.headline}
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {branding.advertisingCampaign.body}
          </p>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2 flex-wrap text-[11px]">
            <span className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">Local Focus:</strong> {branding.advertisingCampaign.typicalBusinesses.slice(0, 4).join(', ')}
            </span>
            <span className="text-emerald-800 dark:text-emerald-300 font-mono font-bold italic">
              &ldquo;{branding.advertisingCampaign.localLanguagePunchline}&rdquo;
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-[10px] mono font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-1 rounded-md border border-rose-200 dark:border-rose-800/80">
              <TrendingDown size={12} /> {branding.advertisingCampaign.churnStatistic}
            </span>
            <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/80">
              <CheckCircle2 size={12} /> {branding.advertisingCampaign.retentionBenefit}
            </span>
          </div>

          <button
            onClick={() => {
              setClaimModalDept(null);
              setShowClaimModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs mono flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <ShieldCheck size={14} />
            <span>{branding.advertisingCampaign.callToAction}</span>
          </button>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
          Notice: Government ministries, statutory agencies, and regulatory desks in {branding.countryName} are centrally provisioned under the Sovereign Bilateral Accord subscribed for by Government-appointed personnel on behalf of all public desks.
        </p>
      </div>

      {/* Category Filter Tabs Scrollbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedCategory === tab.id;
          const isStakeTab = tab.id === 'mystake';
          const count = tab.id === 'all' 
            ? depts.length 
            : tab.id === 'mystake' 
            ? depts.filter(d => followed.includes(d.id)).length
            : depts.filter(d => d.category === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-semibold text-xs whitespace-nowrap transition-colors border cursor-pointer ${
                isSelected
                  ? isStakeTab
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                  : isStakeTab
                  ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:border-amber-500'
                  : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
              }`}
            >
              <Icon size={13} className={isSelected ? (isStakeTab ? 'text-slate-950 fill-current' : 'text-emerald-400 dark:text-emerald-600') : tab.color} />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isSelected 
                  ? 'bg-black/15 text-current' 
                  : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Dynamic Filter Controls */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search school, hospital, restaurant, bank, SACCO, plaza or ministry..."
            className="w-full text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 p-0.5">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1 p-1 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg">
            {[
              { id: 'all', label: 'All Sectors' },
              { id: 'civic', label: 'Statutory Desks' },
              { id: 'consumer', label: 'Consumer Providers' },
            ].map((lane) => (
              <button
                key={lane.id}
                onClick={() => setSelectedLane(lane.id as any)}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-semibold transition-colors cursor-pointer ${
                  selectedLane === lane.id
                    ? 'bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-[#e3e6ea] dark:border-[#262b36]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lane.label}
              </button>
            ))}
            <button
              onClick={() => openGuide('gov_vs_private')}
              title="Compare Statutory Desks vs Consumer Private Providers"
              className="px-2 py-1 rounded-md text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle size={11} />
              <span className="hidden sm:inline">Info</span>
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-600 dark:text-slate-400">
            <span>Sort:</span>
            <button
              onClick={() => setSortBy(sortBy === 'trust' ? 'sla' : sortBy === 'sla' ? 'posts' : sortBy === 'posts' ? 'name' : 'trust')}
              className="px-2.5 py-1 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white rounded-lg font-semibold uppercase hover:border-emerald-500 transition-colors cursor-pointer"
            >
              {sortBy === 'trust' ? 'Trust Score' : sortBy === 'sla' ? 'SLA Resolution' : sortBy === 'posts' ? 'Reports' : 'Name (A-Z)'}
            </button>
          </div>
        </div>
      </div>

      {/* Entity Cards Grid */}
      <div className="space-y-3">
        {filteredDepts.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl space-y-3 shadow-xs">
            <Building2 size={36} className="mx-auto text-slate-400" />
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-slate-100">No service provider found</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                {selectedCategory === 'mystake' 
                  ? "You haven't pinned any schools, hospitals, or businesses to your stake yet. Click '+ My Stake' on any provider below to monitor it directly."
                  : "You can register this provider to immediately track service standards and start reporting."}
              </p>
            </div>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs mono inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
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
                className={`p-4 rounded-lg bg-white dark:bg-[#161a22] border space-y-3 hover:border-emerald-500/60 transition-all group ${
                  isF 
                    ? 'border-amber-400/80 dark:border-amber-500/60 bg-amber-500/[0.03] dark:bg-amber-500/[0.04]' 
                    : 'border-[#e3e6ea] dark:border-[#262b36]'
                }`}
              >
                {/* Header Row: Left info container and dedicated right aligned My Stake button */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => {
                      setActiveDept(d.id);
                      setActiveDeptCountry(country);
                      go('dept_wall');
                    }}
                    className="flex items-start gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300 flex-shrink-0 group-hover:border-emerald-500/50 transition-colors">
                      <DeptIcon dept={d} size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-slate-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                          {d.name}
                        </h3>
                        
                        {/* Category Badge */}
                        <span className={`chip text-[8.5px] font-bold ${
                          d.category === 'education' ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300' :
                          d.category === 'health' ? 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-300' :
                          d.category === 'hospitality' ? 'bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-300' :
                          d.category === 'finance' ? 'bg-indigo-100 text-indigo-950 dark:bg-indigo-950 dark:text-indigo-300' :
                          d.category === 'transport' ? 'bg-cyan-100 text-cyan-950 dark:bg-cyan-950 dark:text-cyan-300' :
                          d.category === 'housing' ? 'bg-purple-100 text-purple-950 dark:bg-purple-950 dark:text-purple-300' :
                          d.category === 'utility' ? 'bg-yellow-100 text-yellow-950 dark:bg-yellow-950 dark:text-yellow-300' :
                          'chip-gov'
                        }`}>
                          {d.category ? d.category.toUpperCase() : (isConsumer ? 'PRIVATE' : 'SOVEREIGN')}
                        </span>

                        {/* Sovereign Desk Subscription & Private Claim Status */}
                        {!isPrivateEntity ? (
                          isClaimed ? (
                            <span className="chip ch-resolved text-[8.5px] flex items-center gap-1 font-black">
                              <Landmark size={10} /> Sovereign Desk · Subscribed
                            </span>
                          ) : (
                            <span className="chip text-[8.5px] flex items-center gap-1 font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                              <Landmark size={10} /> Sovereign Desk · Unsubscribed
                            </span>
                          )
                        ) : (
                          isClaimed ? (
                            <span className="chip ch-resolved text-[8.5px] flex items-center gap-1 font-black">
                              <CheckCircle2 size={10} /> Verified Subscriber · {claimRecord?.plan?.toUpperCase()}
                            </span>
                          ) : (
                            <span className="chip text-[8.5px] flex items-center gap-1 font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                              <AlertTriangle size={10} /> Unclaimed · Neglect Alert
                            </span>
                          )
                        )}

                        {d.qualityAudit && (
                          <span className="chip ch-resolved text-[8.5px] flex items-center gap-1 font-bold">
                            <ShieldCheck size={10} /> {d.qualityAudit}
                          </span>
                        )}

                        {m.isHighPerf && (
                          <span className="chip ch-resolved text-[8.5px] flex items-center gap-1 font-black">
                            <Award size={10} /> Top Rated
                          </span>
                        )}
                        {m.isUnderAudit && (
                          <span className="chip ch-overdue text-[8.5px] flex items-center gap-1 font-black">
                            <AlertTriangle size={10} /> Under Audit
                          </span>
                        )}
                      </div>
                      <p className="text-[11.5px] text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-1 font-medium">
                        {d.full}
                      </p>
                      {d.location && (
                        <p className="text-[10px] mono text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin size={10} className="text-slate-500 dark:text-slate-400" />
                          <span>{d.location}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dedicated Aligned Stake Button */}
                  <div className="shrink-0 flex items-start pt-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(d.id);
                      }}
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs mono font-black border transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap min-w-[110px] sm:min-w-[118px] cursor-pointer ${
                        isF
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-600 dark:border-amber-400 shadow-amber-500/25 ring-2 ring-amber-400/40'
                          : 'bg-amber-50/90 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-700/80 hover:border-amber-400'
                      }`}
                      title={isF ? 'Pinned to your monitored stake watchlist' : 'Pin to your monitored stake watchlist'}
                      aria-label={isF ? `Remove ${d.name} from My Stake` : `Add ${d.name} to My Stake`}
                    >
                      <Bookmark size={13} className={isF ? 'fill-current text-slate-950' : 'text-amber-700 dark:text-amber-400'} />
                      <span>{isF ? 'In My Stake' : '+ My Stake'}</span>
                    </button>
                  </div>
                </div>

                {/* Quality & SLA Scoreboard */}
                <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Public Trust</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-xs flex items-center justify-center gap-0.5 mt-0.5">
                      <Star size={11} className="fill-current" /> {d.trustScore || 88}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Resolution</span>
                    <span className={`font-bold text-xs mt-0.5 block ${m.complianceRate >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {m.complianceRate}% On-Time
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Service SLA</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs mt-0.5 block">{m.baseSla}h Target</span>
                  </div>
                </div>

                {/* Leadership / Inspection Contact */}
                <div className="flex items-center justify-between gap-2 text-[10px] mono text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <UserCheck size={12} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">Desk: <strong className="text-slate-900 dark:text-slate-100">{m.leadership}</strong></span>
                  </div>
                  {d.sector && (
                    <span className="text-slate-600 dark:text-slate-400 shrink-0 text-[9px] font-black uppercase">
                      Sector: {d.sector}
                    </span>
                  )}
                </div>

                {/* Customer Care Defection Notice for entities with complaints or low resolution rate */}
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

                {/* Quick Action Bottom Bar */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-lg text-[9px] mono font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 flex items-center gap-1">
                      <Radio size={9} />
                      <span>USSD: {m.ussdCode}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-[9px] mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1">
                      <PhoneCall size={9} />
                      <span>{m.tollFree}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    {isPrivateEntity && !isClaimed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setClaimModalDept(d);
                          setShowClaimModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-[10.5px] mono font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                        title="Claim this entity profile and activate verified provider desk"
                      >
                        <ShieldCheck size={12} />
                        <span>Claim & Subscribe</span>
                      </button>
                    )}
                    {isPrivateEntity && isClaimed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDept(d.id);
                          setActiveDeptCountry(country);
                          go('entity_gateway');
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-[10.5px] mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 flex items-center gap-1 transition-all cursor-pointer"
                        title="Open provider resolution desk"
                      >
                        <ShieldCheck size={12} strokeWidth={1.75} />
                        <span>Provider Desk</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlacardDept(d);
                      }}
                      className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                      title="Download or Print Official Counter QR Placard"
                    >
                      <QrCode size={13} />
                    </button>
                    <button
                      onClick={() => {
                        setActiveDept(d.id);
                        setActiveDeptCountry(country);
                        go('compose');
                      }}
                      className="px-3 py-1.5 rounded-xl text-[10.5px] mono font-black bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                    >
                      + File Incident
                    </button>
                    <button
                      onClick={() => {
                        setActiveDept(d.id);
                        setActiveDeptCountry(country);
                        go('dept_wall');
                      }}
                      className="flex items-center gap-1 text-[11px] mono font-black text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span>Public Wall ({m.postCount})</span>
                      <ChevronRight size={13} />
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
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black">
                  +
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950 dark:text-white">Register a Service Provider</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Add any school, clinic, eatery, or business to monitor</p>
                </div>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterDept} className="space-y-3 text-xs">
              <div>
                <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                  Service Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {[
                    { id: 'education', label: 'School / Uni' },
                    { id: 'health', label: 'Hospital / Clinic' },
                    { id: 'hospitality', label: 'Restaurant / Cafe' },
                    { id: 'finance', label: 'Bank / SACCO' },
                    { id: 'transport', label: 'Transit / Bus / Taxi' },
                    { id: 'housing', label: 'Mall / Market / Plaza' },
                    { id: 'utility', label: 'Utility / Power' },
                    { id: 'cso', label: 'CSO / Watchdog' },
                    { id: 'government', label: 'Gov / Municipal Desk' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setNewDeptCategory(cat.id as any)}
                      className={`p-2 rounded-lg text-[11px] font-bold text-left transition-all border flex items-center gap-1.5 ${
                        newDeptCategory === cat.id
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <DeptIcon category={cat.id} size={13} />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                  Provider / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Greenhill Academy, Case Clinic, CJ's Kololo"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                  Official Full Title / Campus / Branch
                </label>
                <input
                  type="text"
                  value={newDeptFull}
                  onChange={(e) => setNewDeptFull(e.target.value)}
                  placeholder="e.g. Greenhill Academy Primary & Nursery - Kibuli Branch"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                    Location / Parish / Street
                  </label>
                  <input
                    type="text"
                    value={newDeptLocation}
                    onChange={(e) => setNewDeptLocation(e.target.value)}
                    placeholder="e.g. Kibuli Road, Makindye"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                    Expected SLA (Hours)
                  </label>
                  <select
                    value={newDeptSla}
                    onChange={(e) => setNewDeptSla(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value={24}>24 Hours (Emergency/Hospital/Food)</option>
                    <option value={48}>48 Hours (Standard Service)</option>
                    <option value={72}>72 Hours (Administrative)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterModal(false);
                    go('entity_register');
                  }}
                  className="w-full sm:w-auto text-[11px] font-bold mono text-emerald-700 dark:text-emerald-400 hover:underline flex items-center justify-center sm:justify-start gap-1"
                >
                  <ExternalLink size={12} strokeWidth={1.75} />
                  <span>Open Full Multi-Tier Registration Portal</span>
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md flex items-center gap-1.5"
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
