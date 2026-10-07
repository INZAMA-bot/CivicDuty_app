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
      <div className={`inline-flex items-center gap-1.5 select-none px-2 py-1 rounded-lg bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] ${className}`}>
        <button
          onClick={() => handleSignalClick(currentFilter === 'red' ? 'all' : 'red')}
          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md group cursor-pointer focus:outline-none transition-all ${
            currentFilter === 'red' ? 'bg-rose-500/15 ring-1 ring-rose-500/40' : 'hover:bg-white dark:hover:bg-[#161a22]'
          }`}
          title={`Red Signal: ${redCount} Open / Citizen Speaks`}
        >
          <SignalGlyphRed active={currentFilter === 'red' || currentFilter === 'all'} className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">{redCount}</span>
        </button>

        <button
          onClick={() => handleSignalClick(currentFilter === 'amber' ? 'all' : 'amber')}
          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md group cursor-pointer focus:outline-none transition-all ${
            currentFilter === 'amber' ? 'bg-amber-500/15 ring-1 ring-amber-500/40' : 'hover:bg-white dark:hover:bg-[#161a22]'
          }`}
          title={`Amber Signal: ${amberCount} In Progress / Government Serves`}
        >
          <SignalGlyphAmber active={currentFilter === 'amber' || currentFilter === 'all'} className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">{amberCount}</span>
        </button>

        <button
          onClick={() => handleSignalClick(currentFilter === 'green' ? 'all' : 'green')}
          className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-md group cursor-pointer focus:outline-none transition-all ${
            currentFilter === 'green' ? 'bg-emerald-500/15 ring-1 ring-emerald-500/40' : 'hover:bg-white dark:hover:bg-[#161a22]'
          }`}
          title={`Green Signal: ${greenCount} Resolved / Citizen Heard`}
        >
          <SignalGlyphGreen active={currentFilter === 'green' || currentFilter === 'all'} className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{greenCount}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-slate-100 transition-colors ${className}`}>
      {/* Mobile-First Compact HUD Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <SignalGlyphGreen className="w-4 h-4 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
              Sovereign Signal Filter
            </div>
            <p className="text-[9.5px] text-slate-500 dark:text-slate-400 font-mono truncate">
              Tap a signal stage to filter live dispatches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {currentFilter !== 'all' && (
            <button
              onClick={() => handleSignalClick('all')}
              className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => openGuide('signals')}
            className="text-[10px] font-mono font-medium text-slate-700 dark:text-slate-300 hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] px-2 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] transition-colors flex items-center gap-1 cursor-pointer"
            title="Field Manual: 3-Signal Protocol Explained"
          >
            <HelpCircle size={11} strokeWidth={1.75} />
            <span>Guide</span>
          </button>
        </div>
      </div>

      {/* 3 Traffic Light Filter Buttons — Mobile-First Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {/* RED SIGNAL BUTTON */}
        <button
          onClick={() => handleSignalClick(currentFilter === 'red' ? 'all' : 'red')}
          className={`p-2 sm:p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
            currentFilter === 'red'
              ? 'bg-rose-500/10 border-rose-500/50 ring-1 ring-rose-500/30'
              : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <SignalGlyphRed active={currentFilter === 'red' || currentFilter === 'all'} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">{redCount}</span>
          </div>
          <div className="text-[10.5px] sm:text-[11.5px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
            1. Speak
          </div>
          <div className="text-[8.5px] sm:text-[9.5px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Open / Graft
          </div>
        </button>

        {/* AMBER SIGNAL BUTTON */}
        <button
          onClick={() => handleSignalClick(currentFilter === 'amber' ? 'all' : 'amber')}
          className={`p-2 sm:p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
            currentFilter === 'amber'
              ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/30'
              : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <SignalGlyphAmber active={currentFilter === 'amber' || currentFilter === 'all'} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">{amberCount}</span>
          </div>
          <div className="text-[10.5px] sm:text-[11.5px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
            2. Serve
          </div>
          <div className="text-[8.5px] sm:text-[9.5px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            In Progress
          </div>
        </button>

        {/* GREEN SIGNAL BUTTON */}
        <button
          onClick={() => handleSignalClick(currentFilter === 'green' ? 'all' : 'green')}
          className={`p-2 sm:p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
            currentFilter === 'green'
              ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30'
              : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <SignalGlyphGreen active={currentFilter === 'green' || currentFilter === 'all'} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{greenCount}</span>
          </div>
          <div className="text-[10.5px] sm:text-[11.5px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
            3. Be Heard
          </div>
          <div className="text-[8.5px] sm:text-[9.5px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            Proof Sealed
          </div>
        </button>
      </div>
    </div>
  );
};
