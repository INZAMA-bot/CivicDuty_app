import React, { useState } from 'react';
import { HardHat, Copy, Check, ShieldCheck, Users, ChevronDown, ChevronUp, Layers, Key } from 'lucide-react';
import { Project } from '../types';

interface SiteDepotBranchesCardProps {
  project: Project;
  toast: (msg: string, type?: 'emerald' | 'amber' | 'red') => void;
}

export const SiteDepotBranchesCard: React.FC<SiteDepotBranchesCardProps> = ({ project, toast }) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const depots = [
    {
      name: 'Site Depot A: Earthworks & Foundation Subcontractor',
      code: 'CTR-DEPOT-EARTHWORKS',
      role: 'Heavy Plant Excavation & Subgrade Foreman',
      scope: 'Bush clearance, 1.8m drainage excavation, compaction tests',
      status: 'Active on Site',
      color: 'amber',
    },
    {
      name: 'Site Depot B: Bitumen & Asphalt Paving Crew',
      code: 'CTR-DEPOT-ASPHALT',
      role: 'Asphalt Paver Operator & Surfacing Lead',
      scope: '60mm AC20 binder course laying, bitumen tack coat, roller compaction',
      status: 'Active on Site',
      color: 'teal',
    },
    {
      name: 'Site Depot C: Precast Concrete & Culvert Depot',
      code: 'CTR-DEPOT-DRAINAGE',
      role: 'Masonry & Concrete Works Lead Foreman',
      scope: 'Precast box culverts (900mm), headwalls, stone pitch lining',
      status: 'Active on Site',
      color: 'sky',
    },
    {
      name: 'Site Depot D: Solar Streetlights & Traffic Signage Crew',
      code: 'CTR-DEPOT-ELECTRICAL',
      role: 'Electrical & Road Safety Specialist',
      scope: '8m streetlight plinths, solar armature brackets, thermo road markings',
      status: 'Staged for Phase 5',
      color: 'indigo',
    },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast(`Copied Subcontractor Access Code: ${code}`, 'emerald');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="card p-4 sm:p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0">
            <Layers size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Subcontractor &amp; Site Depot Child Branches
              </span>
              <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                $0 / Unlimited Free Branches
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              Empower site foremen to attach physical progress photos without disclosing executive treasury access.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>{expanded ? 'Hide Depots' : `View ${depots.length} Site Depots`}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {expanded && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {depots.map((d) => (
              <div
                key={d.code}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{d.name}</span>
                    <span className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">{d.role}</span>
                  </div>
                  <span className="text-[8.5px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                    {d.status}
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  <strong>Scope:</strong> {d.scope}
                </p>

                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <Key size={11} className="text-slate-400" />
                    <span className="font-bold text-slate-800 dark:text-slate-200 tracking-wider">{d.code}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(d.code)}
                    className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-[9.5px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition-all"
                  >
                    {copiedCode === d.code ? (
                      <>
                        <Check size={10} className="text-emerald-500" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={10} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[10px] text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <ShieldCheck size={14} className="shrink-0 text-amber-600" />
            <span>
              Subcontractors logging in with these codes enter in <strong>Field Foreman Mode</strong>: they can log daily work memos and upload pictorial evidence for their trade, but cannot sign fiscal treasury warrants.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
