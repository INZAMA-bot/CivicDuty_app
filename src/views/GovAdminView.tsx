import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, DEPARTMENTS, TERRITORY } from '../data/countries';
import { getNationalRolloutArrangements } from '../data/tiers';
import { NoteBox } from '../components/NoteBox';
import { ChevronRight, Globe, UserPlus } from 'lucide-react';
import { CountryCode } from '../types';

export const GovAdminView: React.FC = () => {
  const { user, posts, teamMembers, go } = useApp();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(user?.country || 'UG');

  if (!user || user.role !== 'platform_admin') {
    go('gov_inbox');
    return null;
  }

  const totalPosts = posts.length;
  const resolved = posts.filter((p) => p.status === 'resolved').length;
  const countriesCount = Object.keys(COUNTRIES).length;

  const deptCount = Object.keys(DEPARTMENTS).reduce(
    (a, c) => a + (DEPARTMENTS[c as any]?.civic?.length || 0) + (DEPARTMENTS[c as any]?.consumer?.length || 0),
    0
  );

  const activeTeam = teamMembers.filter((m) => m.active);
  const countryTeam = activeTeam.filter((m) => m.country === selectedCountry);

  const rolloutData = getNationalRolloutArrangements(selectedCountry);

  const rollout = [
    { label: rolloutData.targets.l1Title, target: rolloutData.targets.l1Target, active: countryTeam.filter((m) => m.role === 'platform_admin').length },
    { label: rolloutData.targets.l2l3Title, target: rolloutData.targets.l2l3Target, active: countryTeam.filter((m) => m.role === 'node_admin').length },
    { label: rolloutData.targets.l4Title, target: rolloutData.targets.l4Target, active: countryTeam.filter((m) => m.role === 'spokesperson' && !m.is_utility).length },
    { label: rolloutData.targets.l5Title, target: rolloutData.targets.l5Target, active: countryTeam.filter((m) => m.role === 'spokesperson' && m.is_utility).length },
    { label: rolloutData.targets.roTitle, target: rolloutData.targets.roTarget, active: countryTeam.filter((m) => m.role === 'read_only').length },
  ];

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      <div>
        <div className="tagline mb-1.5 font-bold" style={{ color: '#ef4444' }}>
          Platform Admin
        </div>
        <h2 className="text-[21px] font-black text-rose-700 dark:text-red-400 tracking-tight leading-tight">CivicDuty Control Panel</h2>
        <p className="text-[11px] mono text-slate-600 dark:text-zinc-400 mt-1.5">All 15 Countries · Global Node Architecture · Live Visibility</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          [countriesCount, 'Countries Active', 'emerald'],
          [deptCount, 'Dept Walls Built', 'emerald'],
          [rolloutData.totalTargetDesks, `${rolloutData.countryName} Target Desks`, 'zinc'],
          [activeTeam.length, 'Global Active Desks', 'zinc'],
          [totalPosts, 'Total Posts', 'zinc'],
          [resolved, 'Resolved', 'emerald'],
        ].map(([v, l, c]) => (
          <div key={l as string} className="admin-stat">
            <div className={`text-2xl font-black mono ${c === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-zinc-200'}`}>
              {(v as number).toLocaleString()}
            </div>
            <div className="text-[8px] mono text-slate-500 dark:text-zinc-500 uppercase mt-1 font-bold">{l}</div>
          </div>
        ))}
      </div>

      <div
        onClick={() => go('gov_billing')}
        className="card p-4 flex items-center justify-between cursor-pointer hover:border-rose-500/40 transition-colors"
      >
        <div>
          <p className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">Billing & Receivables</p>
          <p className="text-[9px] mono text-slate-500 dark:text-zinc-400 mt-0.5">Subscriptions, invoices and payments across national deployments</p>
        </div>
        <ChevronRight size={18} className="text-slate-400 dark:text-zinc-600" />
      </div>

      <div
        onClick={() => go('gov_team')}
        className="card p-4 flex items-center justify-between cursor-pointer hover:border-amber-500/40 transition-colors bg-amber-500/5 border-amber-500/20"
      >
        <div>
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider mono">
            <UserPlus size={15} />
            <span>Node Officer Onboarding & Access Codes</span>
          </div>
          <p className="text-[9px] mono text-slate-600 dark:text-zinc-400 mt-1">Issue single-use access codes to CAOs, Town Clerks, Sub-County Chiefs, and Parish Chiefs</p>
        </div>
        <ChevronRight size={18} className="text-amber-600 dark:text-amber-400" />
      </div>

      {/* Country Selector for Rollout Inspection */}
      <div className="card p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <Globe size={12} className="text-emerald-600 dark:text-emerald-400" /> Select National Rollout Arrangement
          </span>
          <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300">
            {COUNTRIES[selectedCountry]?.flag} {COUNTRIES[selectedCountry]?.name}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {Object.keys(COUNTRIES).map((code) => {
            const isSel = selectedCountry === code;
            return (
              <button
                key={code}
                onClick={() => setSelectedCountry(code as CountryCode)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all border ${
                  isSel
                    ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/40 font-bold'
                    : 'bg-slate-100 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                {COUNTRIES[code]?.flag} {code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic National Rollout Progress */}
      <div className="card p-4 space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] mono text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest">
              {rolloutData.flag} {rolloutData.countryName} National Rollout Arrangement
            </p>
            <span className="text-[9px] mono text-slate-500 dark:text-zinc-500 font-bold">
              Target: {rolloutData.totalTargetDesks.toLocaleString()} Desks
            </span>
          </div>
          <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 font-mono">{rolloutData.tiersDescription}</p>
        </div>

        {rollout.map((r, idx) => {
          const pct = Math.round((r.active / r.target) * 100);
          return (
            <div key={idx} className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[9px] mono gap-2">
                <span className="text-slate-700 dark:text-zinc-300 font-bold">{r.label}</span>
                <span className="text-slate-500 dark:text-zinc-500 flex-shrink-0">
                  {r.active.toLocaleString()} / {r.target.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${r.active > 0 ? Math.max(pct, 2) : 0}%` }}
                ></div>
              </div>
              <div className="text-[7px] mono text-slate-500 dark:text-zinc-500">
                {pct}% provisioned{r.active === 0 ? ' · awaiting deployment' : ''}
              </div>
            </div>
          );
        })}

        <p className="text-[8px] mono text-slate-500 dark:text-zinc-500 leading-relaxed pt-1">
          National target count based on official administrative hierarchy ({rolloutData.primaryUnitName}). Figures update dynamically as desks mount in {rolloutData.countryName}.
        </p>
      </div>

      <NoteBox
        tone="red"
        title="Multi-National Verification Engine"
        text="All 15 supported national rollout structures use verified administrative hierarchy levels (Parishes, Wards, Kebeles, Communes, Gram Panchayats). Every active desk is dynamically counted."
      />

      {/* CivicDuty Internal Staff Operations Console */}
      <div className="card p-4 space-y-3 bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/30">
        <div className="flex items-center justify-between border-b border-red-200 dark:border-red-900/40 pb-2">
          <div>
            <span className="text-[9px] mono text-red-700 dark:text-red-400 font-bold uppercase tracking-widest block">
              CivicDuty Internal Systems Operations
            </span>
            <p className="text-[11px] font-bold text-slate-900 dark:text-zinc-100">Super Admin / Infrastructure & Gateway Console</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[8px] mono bg-red-500/20 text-red-800 dark:text-red-300 border border-red-500/40 font-bold">
            INTERNAL STAFF ONLY
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[9px] mono pt-1">
          <div className="bg-white dark:bg-zinc-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800/80">
            <span className="text-slate-500 dark:text-zinc-500 block">Uganda Telecom USSD Gateway</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">*284# (MTN & Airtel UG)</span>
            <span className="text-[7px] text-slate-400 dark:text-zinc-600 block mt-0.5">Active · 99.98% Uptime</span>
          </div>
          <div className="bg-white dark:bg-zinc-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800/80">
            <span className="text-slate-500 dark:text-zinc-500 block">NIRA Identity Bridge</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">Uganda National ID API</span>
            <span className="text-[7px] text-slate-400 dark:text-zinc-600 block mt-0.5">Live Gateway Ready</span>
          </div>
          <div className="bg-white dark:bg-zinc-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800/80">
            <span className="text-slate-500 dark:text-zinc-500 block">Deadline Escalation Engine</span>
            <span className="text-teal-700 dark:text-teal-400 font-bold">48h Auto-Escalate</span>
            <span className="text-[7px] text-slate-400 dark:text-zinc-600 block mt-0.5">Parish → CAO → OPM</span>
          </div>
          <div className="bg-white dark:bg-zinc-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800/80">
            <span className="text-slate-500 dark:text-zinc-500 block">IGG Corruption Vault</span>
            <span className="text-amber-800 dark:text-amber-400 font-bold">Zero-Knowledge Encrypted</span>
            <span className="text-[7px] text-slate-400 dark:text-zinc-600 block mt-0.5">Whistleblower Protection</span>
          </div>
        </div>

        <p className="text-[8px] mono text-slate-500 dark:text-zinc-500 leading-relaxed pt-1">
          🔒 Strictly isolated from public feeds and government department walls. Only authorized CivicDuty Platform Reliability Engineers and Super Admins hold access keys to this infrastructure layer.
        </p>
      </div>
    </div>
  );
};
