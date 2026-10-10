import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  ShieldCheck,
} from 'lucide-react';

interface FooterProps {
  isSplash?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isSplash = false }) => {
  const { go, openLegalCenter, t } = useApp();

  return (
    <footer
      className={`w-full border-t border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-400 transition-colors ${
        isSplash ? 'mt-6 py-4 px-3.5 sm:px-6' : 'mt-auto pt-4 pb-24 md:pb-5 px-3.5 sm:px-6'
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-3">
        {/* Top Row: Clean Text-Only Brand Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100">
              CivicDuty
            </span>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            <span className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
              Speak · Serve · Be Heard
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t('mottoSub') || 'Sovereign Public Service Accountability & Statutory SLA Platform'}
          </p>
        </div>

        {/* Bottom Row: Legal & Governance Links + CD-Ops */}
        <div className="pt-4 border-t border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-x-2 gap-y-1.5 flex-wrap justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => openLegalCenter('about')}
              className="px-2 py-1 rounded-md hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-[#e3e6ea] dark:hover:border-[#262b36] transition-colors cursor-pointer font-medium"
            >
              About CivicDuty
            </button>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => openLegalCenter('privacy')}
              className="px-2 py-1 rounded-md hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-[#e3e6ea] dark:hover:border-[#262b36] transition-colors cursor-pointer font-medium"
            >
              Privacy Charter
            </button>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => openLegalCenter('terms')}
              className="px-2 py-1 rounded-md hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-[#e3e6ea] dark:hover:border-[#262b36] transition-colors cursor-pointer font-medium"
            >
              Terms of Use
            </button>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => openLegalCenter('ethics')}
              className="px-2 py-1 rounded-md hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-[#e3e6ea] dark:hover:border-[#262b36] transition-colors cursor-pointer font-medium"
            >
              Ethics Covenant
            </button>
          </div>

          <div className="flex items-center gap-3 text-[10.5px]">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <ShieldCheck size={12} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
              <span>SHA-256 Public Ledger</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => go('company_management')}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-1 cursor-pointer font-medium py-1"
              title="Open Launch Countdown & Restricted CivicDuty Internal Ops (CD-Ops)"
            >
              <Lock size={11} strokeWidth={1.75} />
              <span>CD-Ops &amp; Launch</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
