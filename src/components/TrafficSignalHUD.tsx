import React from 'react';
import { useApp } from '../context/AppContext';
import { Post } from '../types';
import { HelpCircle } from 'lucide-react';

export const SignalGlyphRed: React.FC<{ active?: boolean; className?: string }> = ({
  active = true,
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} shrink-0 transition-all ${
      active ? 'filter drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]' : 'opacity-40'
    }`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="42" stroke="#EF4444" strokeWidth="8" />
    <circle cx="50" cy="50" r="13" fill="#F87171" />
  </svg>
);

export const SignalGlyphAmber: React.FC<{ active?: boolean; className?: string }> = ({
  active = true,
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} shrink-0 transition-all ${
      active ? 'filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : 'opacity-40'
    }`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="42" stroke="#F59E0B" strokeWidth="8" />
    <circle cx="50" cy="50" r="13" fill="#FDE047" />
  </svg>
);

export const SignalGlyphGreen: React.FC<{ active?: boolean; className?: string }> = ({
  active = true,
  className = 'w-4 h-4',
}) => (
  <svg
    viewBox="0 0 100 100"
    className={`${className} shrink-0 transition-all ${
      active ? 'filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]' : 'opacity-40'
    }`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="42" fill="#064E3B" stroke="#10B981" strokeWidth="8" />
    <path
      d="M 32 50.5 L 46 64.5 L 70 38.5"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="8.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface TrafficSignalHUDProps {
  posts?: Post[];
  compact?: boolean;
  className?: string;
  onSelectSignal?: (signal: 'all' | 'red' | 'amber' | 'green') => void;
}

export const TrafficSignalHUD: React.FC<TrafficSignalHUDProps> = ({
  posts: customPosts,
  compact = false,
  className = '',
  onSelectSignal,
}) => {
  const { posts: allPosts, user, trafficSignalFilter, setTrafficSignalFilter, openGuide } = useApp();

  const activeCountry = user?.country || 'UG';
  const postList = customPosts || allPosts.filter((p) => p.country === activeCountry);

  // Categorize counts according to the 3-Signal Sovereign Paradigm:
  // RED: Citizen Speaks / Open / Overdue / Anti-Corruption Whistleblower
  const redCount = postList.filter(
    (p) => p.category === 'corruption' || p.status === 'pending' || p.status === 'overdue' || p.escalated
  ).length;

  // AMBER: Government Serves / Investigation / Budget Allocated / Scheduled
  const amberCount = postList.filter(
    (p) => (p.status === 'investigating' || p.status === 'budget' || p.status === 'received') && p.category !== 'corruption'
  ).length;

  // GREEN: Citizen Heard / Proof Uploaded / Verified / Ratified
  const greenCount = postList.filter(
    (p) => p.status === 'resolved' || p.citizen_satisfied === true || p.citizen_dispute_status === 'confirmed_by_community'
  ).length;

  const currentFilter = trafficSignalFilter;

  const handleSignalClick = (signal: 'all' | 'red' | 'amber' | 'green') => {
    if (onSelectSignal) {
      onSelectSignal(signal);
    } else {
      setTrafficSignalFilter(signal);
    }
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 select-none px-2 py-1 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 ${className}`}>
        <button
          onClick={() => handleSignalClick(currentFilter === 'red' ? 'all' : 'red')}
          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg group cursor-pointer focus:outline-none transition-all ${
            currentFilter === 'red' ? 'bg-rose-500/20 ring-1 ring-rose-500/40' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
          title={`Red Signal: ${redCount} Open / Citizen Speaks`}
        >
          <SignalGlyphRed active={currentFilter === 'red' || currentFilter === 'all'} className="w-4 h-4" />
          <span className="text-[9.5px] mono font-black text-rose-600 dark:text-rose-400">{redCount}</span>
        </button>

        <button
          onClick={() => handleSignalClick(currentFilter === 'amber' ? 'all' : 'amber')}
          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg group cursor-pointer focus:outline-none transition-all ${
            currentFilter === 'amber' ? 'bg-amber-500/20 ring-1 ring-amber-500/40' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
          title={`Amber Signal: ${amberCount} In Progress / Government Serves`}
        >
          <SignalGlyphAmber active={currentFilter === 'amber' || currentFilter === 'all'} className="w-4 h-4" />
          <span className="text-[9.5px] mono font-black text-amber-600 dark:text-amber-400">{amberCount}</span>
        </button>

        <button
          onClick={() => handleSignalClick(currentFilter === 'green' ? 'all' : 'green')}
          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg group cursor-pointer focus:outline-none transition-all ${
            currentFilter === 'green' ? 'bg-emerald-500/20 ring-1 ring-emerald-500/40' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
          }`}
          title={`Green Signal: ${greenCount} Resolved / Citizen Heard`}
        >
          <SignalGlyphGreen active={currentFilter === 'green' || currentFilter === 'all'} className="w-4 h-4" />
          <span className="text-[9.5px] mono font-black text-emerald-600 dark:text-emerald-400">{greenCount}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#0e1420] border border-slate-300 dark:border-slate-800 text-slate-950 dark:text-white shadow-xs transition-colors ${className}`}>
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-2 mb-2.5">
        <div className="flex items-center gap-2.5">
          {/* Mini 3-Signal Vector Mark */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <SignalGlyphRed className="w-3.5 h-3.5" />
            <SignalGlyphAmber className="w-3.5 h-3.5" />
            <SignalGlyphGreen className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[12px] font-black font-serif text-slate-950 dark:text-slate-100 flex items-center gap-1.5 tracking-tight">
              <span>Traffic Light Sovereign Signal Board</span>
              <span className="text-[7.5px] font-mono px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-700 uppercase font-bold">
                Official Engine
              </span>
            </div>
            <p className="text-[8.5px] text-slate-600 dark:text-slate-400 font-mono font-medium">
              3-Signal Civic Accountability Standard · Live Interactive Filter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openGuide('signals')}
            className="text-[9px] mono font-bold text-teal-700 dark:text-teal-300 hover:text-teal-900 dark:hover:text-teal-200 px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/70 border border-teal-300 dark:border-teal-700/60 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
            title="Field Manual: 3-Signal Protocol Explained"
          >
            <HelpCircle size={10} />
            <span>Guide</span>
          </button>

          {currentFilter !== 'all' && (
            <button
              onClick={() => handleSignalClick('all')}
              className="text-[9px] mono font-black text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700/60 transition-colors shadow-2xs cursor-pointer"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* 3 Traffic Light Filter Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {/* RED SIGNAL BUTTON */}
        <button
          onClick={() => handleSignalClick(currentFilter === 'red' ? 'all' : 'red')}
          className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between cursor-pointer ${
            currentFilter === 'red'
              ? 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/40 shadow-xs'
              : 'bg-slate-50/80 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-rose-400 hover:bg-rose-50/40 dark:hover:bg-rose-950/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <SignalGlyphRed active={currentFilter === 'red' || currentFilter === 'all'} className="w-5 h-5" />
            <span className="text-sm font-black mono text-rose-700 dark:text-rose-400">{redCount}</span>
          </div>
          <div className="text-[11px] font-black font-serif text-rose-950 dark:text-rose-200 leading-tight">1. Citizen Speaks</div>
          <div className="text-[8px] mono text-slate-600 dark:text-slate-400 font-bold mt-0.5">Open / Overdue / Graft</div>
        </button>

        {/* AMBER SIGNAL BUTTON */}
        <button
          onClick={() => handleSignalClick(currentFilter === 'amber' ? 'all' : 'amber')}
          className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between cursor-pointer ${
            currentFilter === 'amber'
              ? 'bg-amber-50 dark:bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/40 shadow-xs'
              : 'bg-slate-50/80 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-amber-950/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <SignalGlyphAmber active={currentFilter === 'amber' || currentFilter === 'all'} className="w-5 h-5" />
            <span className="text-sm font-black mono text-amber-700 dark:text-amber-400">{amberCount}</span>
          </div>
          <div className="text-[11px] font-black font-serif text-amber-950 dark:text-amber-200 leading-tight">2. Gov Serves</div>
          <div className="text-[8px] mono text-slate-600 dark:text-slate-400 font-bold mt-0.5">Underway / Budgeted</div>
        </button>

        {/* GREEN SIGNAL BUTTON */}
        <button
          onClick={() => handleSignalClick(currentFilter === 'green' ? 'all' : 'green')}
          className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 flex flex-col justify-between cursor-pointer ${
            currentFilter === 'green'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xs'
              : 'bg-slate-50/80 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <SignalGlyphGreen active={currentFilter === 'green' || currentFilter === 'all'} className="w-5 h-5" />
            <span className="text-sm font-black mono text-emerald-700 dark:text-emerald-400">{greenCount}</span>
          </div>
          <div className="text-[11px] font-black font-serif text-emerald-950 dark:text-emerald-200 leading-tight">3. Citizen Heard</div>
          <div className="text-[8px] mono text-slate-600 dark:text-slate-400 font-bold mt-0.5">Proof Verified &amp; Sealed</div>
        </button>
      </div>
    </div>
  );
};
