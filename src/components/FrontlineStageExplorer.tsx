import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode } from '../types';
import { SearchableSelect } from './SearchableSelect';
import {
  getCountryPerkProfile,
  getCurrencyForCountry,
  getUsdRateForCurrency,
  roundFriendlyCurrencyAmount,
} from '../data/countryCurrency';
import {
  FrontlineStage,
  FrontlineScoutCategory,
  FRONTLINE_CATEGORIES,
  STAGES_UPDATED_EVENT,
  getStoredStages,
  getActiveStageMembers,
  isUserMemberOfStage,
  syncStagesFromCloudSnapshot,
  contributePatronSponsorship,
  exitStageGroup,
} from '../data/stageEstablishment';
import { subscribeToFrontlineStagesFromCloud } from '../services/firestoreSync';
import {
  Bike,
  Store,
  Car,
  Stethoscope,
  GraduationCap,
  HardHat,
  MapPin,
  Award,
  HeartHandshake,
  CheckCircle2,
  Users,
  Search,
  DollarSign,
  Lock,
  X,
  LogOut,
  Trophy,
  Eye,
  PlusCircle,
} from 'lucide-react';

interface FrontlineStageExplorerProps {
  country?: string;
  selectedParish?: string;
  onSelectStageForCompose?: (stage: FrontlineStage) => void;
  compact?: boolean;
}

function formatRecency(iso?: string): string {
  if (!iso) return 'Recently';
  const ms = Date.now() - Date.parse(iso);
  if (Number.isNaN(ms) || ms < 0) return 'Today';
  const hrs = Math.floor(ms / (1000 * 60 * 60));
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return '1 day ago';
  return `${days}d ago`;
}

export const FrontlineStageExplorer: React.FC<FrontlineStageExplorerProps> = ({
  country = 'UG',
  selectedParish,
  onSelectStageForCompose,
}) => {
  const { toast, user } = useApp();
  const [stages, setStages] = useState<FrontlineStage[]>(() => getStoredStages());
  const [selectedCategory, setSelectedCategory] = useState<FrontlineScoutCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [parishFilter, setParishFilter] = useState(selectedParish || 'all');
  const [sponsorModalStage, setSponsorModalStage] = useState<FrontlineStage | null>(null);
  const [rosterModalStage, setRosterModalStage] = useState<FrontlineStage | null>(null);
  const [highlightedStageId, setHighlightedStageId] = useState<string | null>(() => {
    try {
      const id = sessionStorage.getItem('cd_focus_stage_id');
      if (id) {
        sessionStorage.removeItem('cd_focus_stage_id');
        return id;
      }
      return null;
    } catch {
      return null;
    }
  });

  const cc = (country || 'UG').toUpperCase() as CountryCode;
  const activeCurrency = getCurrencyForCountry(cc);
  const currencyRate = getUsdRateForCurrency(activeCurrency);
  const perkProfile = useMemo(() => getCountryPerkProfile(cc), [cc]);

  const currentScoutId = user?.id || 'usr-9028-UG';
  const currentScoutName = user?.name || 'Citizen Observer';

  // Sync live updates across tabs, local consensus writes, and Firestore
  useEffect(() => {
    const refresh = () => setStages(getStoredStages());
    window.addEventListener(STAGES_UPDATED_EVENT, refresh);
    const unsubCloud = subscribeToFrontlineStagesFromCloud(cc, (cloudStages) => {
      if (cloudStages && cloudStages.length > 0) {
        setStages(syncStagesFromCloudSnapshot(cloudStages as FrontlineStage[]));
      }
    });
    return () => {
      window.removeEventListener(STAGES_UPDATED_EVENT, refresh);
      unsubCloud();
    };
  }, [cc]);

  // If user navigated from a PostCard workstation badge, auto-open that roster if requested
  useEffect(() => {
    if (!highlightedStageId) return;
    const match = stages.find((s) => s.id === highlightedStageId);
    if (match) {
      setParishFilter('all');
      setSelectedCategory('all');
      setRosterModalStage(match);
      setHighlightedStageId(null);
    }
  }, [highlightedStageId, stages]);

  const presetSponsorAmounts = useMemo(
    () => [7, 14, 28, 70].map((usd) => roundFriendlyCurrencyAmount(usd * currencyRate, activeCurrency)),
    [currencyRate, activeCurrency]
  );
  const minSponsorAmount = useMemo(
    () => roundFriendlyCurrencyAmount(2 * currencyRate, activeCurrency),
    [currencyRate, activeCurrency]
  );

  const [patronName, setPatronName] = useState('');
  const [diasporaCity, setDiasporaCity] = useState('');
  const [sponsorAmount, setSponsorAmount] = useState<number>(presetSponsorAmounts[1] || 50000);
  const [customAmount, setCustomAmount] = useState('');
  const [sponsorSuccessMessage, setSponsorSuccessMessage] = useState('');

  useEffect(() => {
    setSponsorAmount(presetSponsorAmounts[1] || 50000);
  }, [presetSponsorAmounts]);

  const handleExitWorkstationGroup = (stageId: string, stageName: string) => {
    const res = exitStageGroup(stageId, currentScoutId, currentScoutName);
    if (res.success) {
      setStages(getStoredStages());
      toast(res.message, 'emerald');
    } else {
      toast(res.message, 'amber');
    }
  };

  const getCategoryIcon = (cat: FrontlineScoutCategory, size = 14) => {
    switch (cat) {
      case 'bodaboda':
        return <Bike size={size} />;
      case 'market':
        return <Store size={size} />;
      case 'taxi':
        return <Car size={size} />;
      case 'health':
        return <Stethoscope size={size} />;
      case 'teacher':
        return <GraduationCap size={size} />;
      case 'artisan':
        return <HardHat size={size} />;
      default:
        return <Users size={size} />;
    }
  };

  const countryStages = useMemo(
    () => stages.filter((stage) => stage.country === cc),
    [stages, cc]
  );

  const filteredStages = useMemo(() => {
    return countryStages.filter((stage) => {
      if (selectedCategory !== 'all' && stage.category !== selectedCategory) return false;
      if (parishFilter !== 'all' && stage.parish.toLowerCase() !== parishFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const activeRoster = getActiveStageMembers(stage);
        const matchMember = activeRoster.some((m) => m.name.toLowerCase().includes(q));
        const matchName = stage.name.toLowerCase().includes(q);
        const matchParish = stage.parish.toLowerCase().includes(q);
        const matchSubcounty = stage.subcounty.toLowerCase().includes(q);
        if (!matchName && !matchParish && !matchSubcounty && !matchMember) return false;
      }
      return true;
    });
  }, [countryStages, selectedCategory, parishFilter, searchQuery]);

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorModalStage) return;

    const amount = customAmount ? parseInt(customAmount, 10) : sponsorAmount;
    if (isNaN(amount) || amount < minSponsorAmount) {
      toast(`Minimum sponsorship amount is ${minSponsorAmount.toLocaleString()} ${activeCurrency}`, 'amber');
      return;
    }

    const updated = contributePatronSponsorship(
      sponsorModalStage.id,
      amount,
      patronName.trim() || 'Anonymous Civic Patron',
      diasporaCity.trim() || undefined
    );

    if (updated) {
      setStages(getStoredStages());
      setSponsorSuccessMessage(
        `Sponsored ${amount.toLocaleString()} ${activeCurrency} to ${updated.name}. Top 3 active performers share 50% / 30% / 20%.`
      );
      toast(`Sponsored ${amount.toLocaleString()} ${activeCurrency} to ${updated.name}!`, 'emerald');
      setTimeout(() => {
        setSponsorModalStage(null);
        setSponsorSuccessMessage('');
        setPatronName('');
        setDiasporaCity('');
        setCustomAmount('');
      }, 1800);
    }
  };

  const uniqueParishes = Array.from(new Set(countryStages.map((s) => s.parish)));

  const rosterMembers = useMemo(() => {
    if (!rosterModalStage) return [];
    return getActiveStageMembers(rosterModalStage);
  }, [rosterModalStage]);

  return (
    <div className="space-y-4 text-slate-900 dark:text-slate-100">
      {/* Header & Governance Rules Summary */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Users size={19} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-950 dark:text-white">
                Public Frontline Workstations &amp; Certified Stages
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Public rosters are open to everyone. Tag your workstation when filing a report to join —{' '}
                <strong className="text-slate-900 dark:text-slate-200">15 active scouts</strong> on the same stage certify it as an official workstation. Exit anytime; Top 3 performers by score points earn all rewards.
              </p>
            </div>
          </div>

          {onSelectStageForCompose && (
            <button
              type="button"
              onClick={() => onSelectStageForCompose(countryStages[0])}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <PlusCircle size={14} />
              <span>Join / Report for a Stage</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] text-[11px] text-slate-500 dark:text-slate-400">
          <span>Top 3 Reward Split: <strong className="text-slate-800 dark:text-slate-200">50% · 30% · 20%</strong></span>
          <span aria-hidden="true">·</span>
          <span>15 Active Members to Certify</span>
          <span aria-hidden="true">·</span>
          <span>Dormant accounts (&gt;30d inactive) hidden automatically</span>
        </div>
      </div>

      {/* Category Filter Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>All Workstations ({countryStages.length})</span>
          </button>

          {FRONTLINE_CATEGORIES.map((cat) => {
            const count = countryStages.filter((s) => s.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.id, 13)}
                <span>
                  {cat.label.split('(')[0].trim()} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Parish Filter */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stage, parish, or member..."
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <SearchableSelect
            value={parishFilter}
            placeholder="All Parishes"
            searchPlaceholder="Search parish or ward..."
            options={[
              { value: 'all', label: 'All Parishes / Wards' },
              ...uniqueParishes.map((p) => ({
                value: p,
                label: p,
              })),
            ]}
            onChange={(val) => setParishFilter(val || 'all')}
            className="w-40 sm:w-48 shrink-0"
            triggerClassName="px-3 py-2 bg-white dark:bg-[#161a22] rounded-xl"
          />
        </div>
      </div>

      {/* Workstations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStages.map((stage) => {
          const activeMembers = getActiveStageMembers(stage);
          const activeCount = activeMembers.length;
          const isCertified = activeCount >= stage.thresholdRequired;
          const progressPct = Math.min(100, Math.round((activeCount / stage.thresholdRequired) * 100));
          const userIsMember = isUserMemberOfStage(stage, currentScoutId, currentScoutName);
          const myActiveRecord = userIsMember
            ? activeMembers.find(
                (m) =>
                  m.id.toLowerCase() === currentScoutId.toLowerCase() ||
                  m.name.toLowerCase() === currentScoutName.toLowerCase()
              )
            : undefined;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-2xl border bg-white dark:bg-[#161a22] transition-colors space-y-3.5 ${
                userIsMember
                  ? 'border-emerald-500 ring-1 ring-emerald-500/20'
                  : isCertified
                  ? 'border-emerald-500/35'
                  : 'border-[#e3e6ea] dark:border-[#262b36]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCertified
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                    }`}
                  >
                    {getCategoryIcon(stage.category, 17)}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white tracking-tight truncate">
                      {stage.name}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
                      <span className={isCertified ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-amber-700 dark:text-amber-400 font-semibold'}>
                        {isCertified ? 'Certified Stage' : `Incubating (${activeCount}/${stage.thresholdRequired})`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{stage.parish}, {stage.district}</span>
                      {myActiveRecord && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                            You: #{myActiveRecord.rank} ({myActiveRecord.points} pts)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Exit button shown ONLY when current user is a member of this workstation */}
                {userIsMember && (
                  <button
                    type="button"
                    onClick={() => handleExitWorkstationGroup(stage.id, stage.name)}
                    title="Voluntarily exit this workstation group anytime"
                    className="min-h-[36px] px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/25 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0 whitespace-nowrap"
                  >
                    <LogOut size={12} />
                    <span>Exit Group</span>
                  </button>
                )}
              </div>

              {/* Active Scouts Consensus Meter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Active Group Consensus
                  </span>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {activeCount} / {stage.thresholdRequired} Active Scouts ({progressPct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCertified ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                {!isCertified && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    {Math.max(0, stage.thresholdRequired - activeCount)} more active scout{stage.thresholdRequired - activeCount === 1 ? '' : 's'} needed within 2 km to certify this workstation.
                  </p>
                )}
              </div>

              {/* Station Vault Balance & Patron Funding */}
              <div className="pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <div className="text-[11px] text-slate-500">Station Reward Pool</div>
                  <div className="text-sm font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                    {stage.patronSponsorPoolUgx.toLocaleString()} {activeCurrency}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRosterModalStage(stage)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-slate-100 dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Eye size={13} className="text-emerald-600" />
                    <span>Members ({activeCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSponsorModalStage(stage)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <DollarSign size={13} />
                    <span>Sponsor Pool</span>
                  </button>
                </div>
              </div>

              {/* Top 3 Performers Ranked Strictly by Score Points (50% / 30% / 20%) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Trophy size={12} className="text-amber-500" />
                    <span>Top 3 Performers (Score Ranking)</span>
                  </span>
                  <span className="font-mono">50% · 30% · 20%</span>
                </div>

                {stage.topScouts && stage.topScouts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {stage.topScouts.slice(0, 3).map((scout, idx) => (
                      <div
                        key={scout.id || idx}
                        className="p-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-0.5"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            #{idx + 1}
                          </span>
                          <span className="tabular-nums text-slate-500">{scout.points} pts</span>
                        </div>
                        <div className="text-xs font-bold truncate text-slate-900 dark:text-slate-100" title={scout.name}>
                          {scout.name.split(' ')[0]}
                        </div>
                        <div className="text-[11px] font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400 truncate">
                          {scout.bountyShareUgx.toLocaleString()} {activeCurrency}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No active reporters recorded in the last 30 days.</p>
                )}
              </div>

              {/* Scarce Physical Perks (Top-3 Only) */}
              {stage.scarcePerks && stage.scarcePerks.length > 0 && (
                <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between gap-2 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-300">
                    <Award size={12} />
                    <span>Top-3 Physical Gear:</span>
                  </span>
                  <span className="truncate">
                    {stage.scarcePerks.map((p) => `${p.quantity}× ${p.title.split('(')[0].trim()}`).join(' · ')}
                  </span>
                </div>
              )}

              {/* Report / Join CTA */}
              {onSelectStageForCompose && (
                <button
                  type="button"
                  onClick={() => onSelectStageForCompose(stage)}
                  className={`w-full min-h-[44px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    userIsMember
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#f8f9fa] hover:bg-emerald-600 text-slate-900 hover:text-white dark:bg-[#0e1116] dark:hover:bg-emerald-600 dark:text-slate-100 border border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  <MapPin size={13} />
                  <span>
                    {userIsMember ? 'File Report for This Workstation' : 'Report & Join This Workstation'}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredStages.length === 0 && (
        <div className="p-8 text-center bg-white dark:bg-[#161a22] rounded-2xl border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
          <Bike size={28} className="mx-auto text-slate-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            No Workstations Match This Filter
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create a new public Frontline Scout workstation by adding your stage name and GPS when filing a report.
          </p>
        </div>
      )}

      {/* PUBLIC GROUP ROSTER MODAL (Dormant accounts automatically hidden) */}
      {rosterModalStage && (
        <div
          onClick={() => setRosterModalStage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl p-5 space-y-4 shadow-2xl text-slate-900 dark:text-slate-100 max-h-[85vh] flex flex-col"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36]">
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Public Workstation Roster · {rosterMembers.length}/{rosterModalStage.thresholdRequired} Active
                </div>
                <h3 className="text-base font-bold text-slate-950 dark:text-white truncate">
                  {rosterModalStage.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {rosterModalStage.parish}, {rosterModalStage.subcounty}, {rosterModalStage.district}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRosterModalStage(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                aria-label="Close public roster"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {rosterMembers.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">
                  No active members in the last 30 days. File a report to activate this workstation.
                </p>
              ) : (
                rosterMembers.map((member, idx) => {
                  const isTop3 = idx < 3;
                  const shareLabel = idx === 0 ? '50%' : idx === 1 ? '30%' : idx === 2 ? '20%' : null;
                  const isCurrentUser =
                    member.id.toLowerCase() === currentScoutId.toLowerCase() ||
                    member.name.toLowerCase() === currentScoutName.toLowerCase();

                  return (
                    <div
                      key={member.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isCurrentUser
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : isTop3
                          ? 'bg-[#f8f9fa] dark:bg-[#0e1116] border-amber-500/30'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold tabular-nums shrink-0 ${
                            idx === 0
                              ? 'bg-amber-500 text-white'
                              : idx === 1
                              ? 'bg-slate-600 text-white'
                              : idx === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-950 dark:text-white truncate">
                            {member.name} {isCurrentUser ? '(You)' : ''}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {member.monthlyReports} report{member.monthlyReports === 1 ? '' : 's'} · Active {formatRecency(member.lastActiveAt)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                          {member.points} pts
                        </div>
                        {shareLabel ? (
                          <div className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {shareLabel} · {member.bountyShareUgx.toLocaleString()} {activeCurrency}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500">Active Scout</div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 flex-wrap">
              <p className="text-[11px] text-slate-500">
                Ranked strictly by score points. Dormant accounts (&gt;30d inactive) are hidden until they report again.
              </p>
              {isUserMemberOfStage(rosterModalStage, currentScoutId, currentScoutName) ? (
                <button
                  type="button"
                  onClick={() => {
                    handleExitWorkstationGroup(rosterModalStage.id, rosterModalStage.name);
                    setRosterModalStage(null);
                  }}
                  className="min-h-[40px] px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Exit Group</span>
                </button>
              ) : (
                onSelectStageForCompose && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = rosterModalStage;
                      setRosterModalStage(null);
                      onSelectStageForCompose(target);
                    }}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle size={13} />
                    <span>Join via Report</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Patron Sponsoring Modal */}
      {sponsorModalStage && (
        <div
          onClick={() => setSponsorModalStage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl p-5 space-y-4 shadow-2xl text-slate-900 dark:text-slate-100"
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center">
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Patron / Community Sponsoring
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {sponsorModalStage.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSponsorModalStage(null)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {sponsorSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs space-y-2 text-center">
                <CheckCircle2 size={24} className="mx-auto text-emerald-600" />
                <p className="font-bold">{sponsorSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSponsorSubmit} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                    <Lock size={12} className="text-emerald-600" />
                    <span>Home Parish Lock: {sponsorModalStage.parish}</span>
                  </div>
                  <p>
                    100% of your sponsorship goes to this workstation's <strong>Top 3 active performers</strong> ranked by score points: <strong>#1 gets 50%</strong>, <strong>#2 gets 30%</strong>, and <strong>#3 gets 20%</strong>.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">
                    Sponsor Amount ({activeCurrency})
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {presetSponsorAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSponsorAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`min-h-[40px] py-2 px-1 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                          sponsorAmount === amt && !customAmount
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white dark:bg-[#12161f] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-amber-500'
                        }`}
                      >
                        {amt >= 10000 && amt % 1000 === 0 ? `${Math.round(amt / 1000)}k` : amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={`Or enter custom amount (${activeCurrency})`}
                    className="mt-2 w-full min-h-[40px] px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Patron / Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={patronName}
                      onChange={(e) => setPatronName(e.target.value)}
                      placeholder={`e.g. ${perkProfile.sampleSponsor}`}
                      className="w-full min-h-[40px] px-3 py-2 text-xs bg-white dark:bg-[#12161f] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Diaspora Origin or Community Base
                    </label>
                    <input
                      type="text"
                      value={diasporaCity}
                      onChange={(e) => setDiasporaCity(e.target.value)}
                      placeholder={`e.g. London UK / ${perkProfile.countryName} Local`}
                      className="w-full min-h-[40px] px-3 py-2 text-xs bg-white dark:bg-[#12161f] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <DollarSign size={14} />
                  <span>
                    Confirm {customAmount ? parseInt(customAmount, 10).toLocaleString() : sponsorAmount.toLocaleString()} {activeCurrency} Sponsorship
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
