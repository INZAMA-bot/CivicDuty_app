import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { NoteBox } from '../components/NoteBox';
import { ExecutiveTierAnalytics } from '../components/ExecutiveTierAnalytics';
import { BarChart3, Download, ArrowLeft } from 'lucide-react';
import { CountryCode } from '../types';

export const PsOpmAnalyticsView: React.FC = () => {
  const { user, go, toast } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(user?.country || 'UG');

  useEffect(() => {
    if (!user || (user.role !== 'platform_admin' && user.role !== 'node_admin')) {
      go('gov_inbox');
    }
  }, [user, go]);

  if (!user || (user.role !== 'platform_admin' && user.role !== 'node_admin')) {
    return null;
  }

  // Derive default supervisory tier from user's rank
  const userRank = user.escalation_rank || 1;
  const initialTier = userRank === 5 ? 5 : userRank === 3 ? 3 : userRank === 2 ? 2 : 1;

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-16 text-slate-800 dark:text-slate-100 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => go('gov_inbox')}
            className="text-[10px] mono text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold mb-1 cursor-pointer"
          >
            <ArrowLeft size={12} /> Back to Government Workspace
          </button>
          <h2 className="text-[22px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Executive Tier Analytics &amp; Performance Telemetry
          </h2>
          <p className="text-[11px] mono text-slate-600 dark:text-zinc-400 mt-0.5">
            Sovereign Administrative Supervision · Resolution Turnaround, Backlog &amp; Statutory SLA Compliance
          </p>
        </div>

        {/* Country Selector for Executive Scope */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
            className="bg-white dark:bg-zinc-900 text-xs font-mono font-bold py-1.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 focus:outline-none shadow-2xs"
          >
            {Object.entries(COUNTRIES).map(([code, c]) => (
              <option key={code} value={code}>
                [{code}] {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Embedded Comprehensive Executive Tier Analytics Engine */}
      <ExecutiveTierAnalytics
        initialCountry={selectedCountry}
        initialTier={initialTier}
        initialScope={user.scope}
      />

      <NoteBox
        tone="teal"
        title="Statutory Escalation & Administrative Query Rules"
        text="Administrative units exceeding the 48-hour statutory turnaround limit trigger automated alerts on executive dashboards. Supervisor node heads are empowered to issue formal statutory administrative queries or deploy rapid technical teams."
      />
    </div>
  );
};
