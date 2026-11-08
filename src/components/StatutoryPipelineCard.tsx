import React from 'react';
import { Layers } from 'lucide-react';

interface StatutoryPipelineCardProps {
  activeStage?: 1 | 2 | 3 | 4 | 5;
  variant?: 'compact' | 'full';
  className?: string;
  isPrivateTrack?: boolean;
}

export const StatutoryPipelineCard: React.FC<StatutoryPipelineCardProps> = ({
  className = '',
}) => {
  const steps = [
    { num: 1, text: 'Citizen SPEAKS' },
    { num: 2, text: 'Government / Provider SERVES' },
    { num: 3, text: 'Uploads PROOF' },
    { num: 4, text: 'Citizen confirms HEARD' },
    { num: 5, text: 'Resolved' },
  ];

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3 shadow-2xs ${className}`}
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="text-emerald-600 dark:text-emerald-400" size={16} />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            5-Stage Statutory Pipeline
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          SHA-256 Ledger
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((s) => {
          const isResolved = s.num === 5;
          return (
            <div
              key={s.num}
              className={`px-3.5 py-2.5 rounded-xl border flex items-center gap-3 transition-colors ${
                isResolved
                  ? 'bg-[#eaf7ee] dark:bg-emerald-950/30 border-[#bbf0cb] dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'bg-white dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                  isResolved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {s.num}
              </div>
              <span className="text-xs sm:text-[13px] font-mono tracking-tight">
                {s.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

