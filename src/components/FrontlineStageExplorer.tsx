import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FrontlineStage,
  FrontlineScoutCategory,
  FRONTLINE_CATEGORIES,
  getStoredStages,
  contributePatronSponsorship,
} from '../data/stageEstablishment';
import {
  Bike,
  Store,
  Car,
  Stethoscope,
  GraduationCap,
  HardHat,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Users,
  Search,
  Filter,
  DollarSign,
  ChevronRight,
  Lock,
  Globe,
  Radio,
  X,
} from 'lucide-react';

interface FrontlineStageExplorerProps {
  country?: string;
  selectedParish?: string;
  onSelectStageForCompose?: (stage: FrontlineStage) => void;
  compact?: boolean;
}

export const FrontlineStageExplorer: React.FC<FrontlineStageExplorerProps> = ({
  country = 'UG',
  selectedParish,
  onSelectStageForCompose,
  compact = false,
}) => {
  const { toast, go } = useApp();
  const [stages, setStages] = useState<FrontlineStage[]>(() => getStoredStages());
  const [selectedCategory, setSelectedCategory] = useState<FrontlineScoutCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [parishFilter, setParishFilter] = useState(selectedParish || 'all');
  const [sponsorModalStage, setSponsorModalStage] = useState<FrontlineStage | null>(null);

  // Patron Sponsor Form State
  const [patronName, setPatronName] = useState('');
  const [diasporaCity, setDiasporaCity] = useState('');
  const [sponsorAmount, setSponsorAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState('');
  const [sponsorSuccessMessage, setSponsorSuccessMessage] = useState('');

  const refreshStages = () => {
    setStages(getStoredStages());
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

  const filteredStages = stages.filter((stage) => {
    if (stage.country !== country) return false;
    if (selectedCategory !== 'all' && stage.category !== selectedCategory) return false;
    if (parishFilter !== 'all' && stage.parish.toLowerCase() !== parishFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = stage.name.toLowerCase().includes(q);
      const matchParish = stage.parish.toLowerCase().includes(q);
      const matchSubcounty = stage.subcounty.toLowerCase().includes(q);
      if (!matchName && !matchParish && !matchSubcounty) return false;
    }
    return true;
  });

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorModalStage) return;

    const amount = customAmount ? parseInt(customAmount, 10) : sponsorAmount;
    if (isNaN(amount) || amount < 5000) {
      toast('Minimum sponsorship amount is 5,000 UGX', 'amber');
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
        `Successfully sponsored ${amount.toLocaleString()} UGX to ${updated.name}! Funds are locked to ${updated.parish} Top-3 scouts.`
      );
      toast(`Sponsored ${amount.toLocaleString()} UGX to ${updated.name}!`, 'emerald');
      setTimeout(() => {
        setSponsorModalStage(null);
        setSponsorSuccessMessage('');
        setPatronName('');
        setDiasporaCity('');
        setCustomAmount('');
      }, 1800);
    }
  };

  const uniqueParishes = Array.from(new Set(stages.filter((s) => s.country === country).map((s) => s.parish)));

  return (
    <div className="space-y-4 text-slate-900 dark:text-slate-100">
      {/* Header & Mission Banner: Independent Platform Notice */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 dark:from-[#0d1f18] dark:via-[#0e1f24] dark:to-[#1a1711] border border-emerald-500/20 text-slate-900 dark:text-slate-100 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Bike size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold tracking-tight">
                  Frontline Scout Workstations &amp; Certified Stages Hub
                </h3>
                <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 uppercase">
                  Consensus Establishment
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                Rule: &gt;15 scouts capturing matching workstation GPS within 2km auto-compiles &amp; certifies an official stage hub.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-black/40 border border-[#e3e6ea] dark:border-[#262b36] text-[10.5px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              <Lock size={11} />
              <span>Home Parish Lock Active</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[10.5px] font-mono font-semibold text-amber-800 dark:text-amber-300">
              <HeartHandshake size={11} />
              <span>Patron Sponsoring Enabled</span>
            </span>
          </div>
        </div>

        {/* Third-Party Platform Transparency Notice */}
        <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 pt-1.5 border-t border-emerald-500/15 flex items-start gap-1.5">
          <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase shrink-0">
            Platform Notice:
          </span>
          <span>
            CivicDuty is an independent third-party civic oversight platform. CivicDuty does not operate or own commercial boda stages, markets, or schools; we empower frontline community workers to verify public service standards.
          </span>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>All Stages ({stages.filter((s) => s.country === country).length})</span>
          </button>

          {FRONTLINE_CATEGORIES.map((cat) => {
            const count = stages.filter((s) => s.country === country && s.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {getCategoryIcon(cat.id, 12)}
                <span>
                  {cat.label.split('(')[0].trim()} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Parish Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stage or parish..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={parishFilter}
            onChange={(e) => setParishFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Parishes / Wards</option>
            {uniqueParishes.map((p) => (
              <option key={p} value={p}>
                Parish: {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredStages.map((stage) => {
          const isCertified = stage.isCertified || stage.scoutCount >= stage.thresholdRequired;
          const progressPct = Math.min(100, Math.round((stage.scoutCount / stage.thresholdRequired) * 100));

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border bg-white dark:bg-[#12161f] transition-all space-y-3 ${
                isCertified
                  ? 'border-emerald-500/40 hover:border-emerald-500 shadow-xs'
                  : 'border-[#e3e6ea] dark:border-[#262b36] border-dashed'
              }`}
            >
              {/* Card Header: Category, Status, Parish Lock */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCertified
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                    }`}
                  >
                    {getCategoryIcon(stage.category, 18)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        {stage.name}
                      </h4>
                      {isCertified ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-emerald-600" />
                          <span>Certified Stage</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                          Incubating ({stage.scoutCount}/{stage.thresholdRequired})
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-0.5">
                      <Lock size={10} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Home Parish:</span>{' '}
                      {stage.parish} · {stage.subcounty}, {stage.district}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono font-semibold text-slate-500">
                    GPS Cluster: {stage.centerGps.lat.toFixed(3)}, {stage.centerGps.lng.toFixed(3)}
                  </div>
                  <div className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    &lt; 2km radius
                  </div>
                </div>
              </div>

              {/* Consensus Meter */}
              <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Users size={12} className="text-emerald-600" />
                    <span>Scouts Consensus Count</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {stage.scoutCount} / {stage.thresholdRequired} Verified Scouts{' '}
                    <span className="text-emerald-600 font-normal">
                      ({progressPct}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCertified ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                {!isCertified && (
                  <p className="text-[9.5px] font-mono text-amber-700 dark:text-amber-400">
                    {stage.thresholdRequired - stage.scoutCount} more scout reports required within 2km to officially establish this stage.
                  </p>
                )}
              </div>

              {/* Patron Sponsoring Pool & Top 3 Scouts */}
              <div className="space-y-2 pt-1 border-t border-[#e3e6ea] dark:border-[#262b36]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <HeartHandshake size={13} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      Patron Sponsor Pool:
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {stage.patronSponsorPoolUgx.toLocaleString()} UGX
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSponsorModalStage(stage)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[10.5px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <DollarSign size={11} />
                    <span>Sponsor Stage</span>
                  </button>
                </div>

                {/* Top 3 Scouts Rewards Breakdown */}
                {stage.topScouts && stage.topScouts.length > 0 && (
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                    {stage.topScouts.slice(0, 3).map((scout, idx) => (
                      <div
                        key={idx}
                        className="p-1.5 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-0.5"
                      >
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="font-bold text-emerald-600">#{idx + 1}</span>
                          <span className="text-[9px] truncate max-w-[60px]">{scout.points} pts</span>
                        </div>
                        <div className="font-bold truncate text-slate-800 dark:text-slate-200" title={scout.name}>
                          {scout.name.split(' ')[0]}
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[9.5px]">
                          {scout.bountyShareUgx.toLocaleString()} U
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action for Compose: Select this stage */}
              {onSelectStageForCompose && (
                <button
                  type="button"
                  onClick={() => onSelectStageForCompose(stage)}
                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <MapPin size={12} />
                  <span>Report for this Workstation Stage</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredStages.length === 0 && (
        <div className="p-8 text-center bg-white dark:bg-[#12161f] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
          <Bike size={28} className="mx-auto text-slate-400" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            No Workstations Found for this filter
          </h4>
          <p className="text-xs text-slate-500 font-mono max-w-md mx-auto">
            You can establish a new Frontline Scout workstation by reporting with an exact GPS pin and workstation name.
          </p>
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
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center">
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold">
                    Patron / Diaspora Sponsoring
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {sponsorModalStage.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSponsorModalStage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {sponsorSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono space-y-2 text-center">
                <CheckCircle2 size={24} className="mx-auto text-emerald-600" />
                <p className="font-bold">{sponsorSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSponsorSubmit} className="space-y-3.5">
                <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                    <Lock size={12} className="text-emerald-600" />
                    <span>Home Parish Lock: {sponsorModalStage.parish}</span>
                  </div>
                  <p>
                    100% of your patronage is allocated to the Top 3 frontline scouts of this stage who enforce road safety, pothole reporting, and public hygiene.
                  </p>
                </div>

                {/* Preset Amount Chips */}
                <div>
                  <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
                    Sponsor Amount (UGX)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[25000, 50000, 100000, 250000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSponsorAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-2 px-1 rounded-lg text-xs font-mono font-bold border transition ${
                          sponsorAmount === amt && !customAmount
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white dark:bg-[#12161f] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-amber-500'
                        }`}
                      >
                        {(amt / 1000).toFixed(0)}k UGX
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Or enter custom amount (e.g. 150000)"
                    className="mt-2 w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Patron Identification & Diaspora Origin */}
                <div className="space-y-2">
                  <div>
                    <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                      Patron / Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={patronName}
                      onChange={(e) => setPatronName(e.target.value)}
                      placeholder="e.g. Dr. James Byamukama / Kampala Hardware SACCO"
                      className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                      Diaspora Origin or Community Base
                    </label>
                    <input
                      type="text"
                      value={diasporaCity}
                      onChange={(e) => setDiasporaCity(e.target.value)}
                      placeholder="e.g. London UK / Boston USA / Kampala Local"
                      className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                >
                  <DollarSign size={14} />
                  <span>
                    Confirm {customAmount ? parseInt(customAmount, 10).toLocaleString() : sponsorAmount.toLocaleString()} UGX Sponsorship
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
