import React, { useState } from 'react';
import { Department, CountryCode } from '../types';
import { allDepts } from '../data/countries';
import { useApp } from '../context/AppContext';
import { getCountryBranding } from '../data/countryBranding';
import {
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Star,
  ExternalLink
} from 'lucide-react';
import { DeptIcon } from './DeptIcon';

interface CustomerDefectionNoticeProps {
  dept: Department;
  complianceRate?: number;
  unresolvedCount?: number;
  onClaimClick?: () => void;
  variant?: 'banner' | 'card' | 'compact';
}

export const CustomerDefectionNotice: React.FC<CustomerDefectionNoticeProps> = ({
  dept,
  complianceRate = 72,
  unresolvedCount = 4,
  onClaimClick,
  variant = 'banner',
}) => {
  const { go, setActiveDept, setActiveDeptCountry, isEntityClaimed } = useApp();
  const [showAlternatives, setShowAlternatives] = useState(false);

  const country: CountryCode = (dept.id.split('-')[0]?.toUpperCase() as CountryCode) || 'UG';
  const branding = getCountryBranding(country);
  const categoryDepts = allDepts(country).filter(
    (d) => d.category === dept.category && d.id !== dept.id
  );

  // Find top-performing alternatives in the same industry/category
  const competitors = categoryDepts
    .sort((a, b) => (b.trustScore || 80) - (a.trustScore || 80))
    .slice(0, 3);

  // Only private commercial entities face consumer defection risk; government and statutory utilities are under sovereign rollout
  if (dept.lane !== 'consumer') {
    return null;
  }

  const isClaimed = isEntityClaimed(dept.id);
  const isConsumerOrPrivate = dept.lane === 'consumer';

  // Customer care risk level
  const isHighRisk = complianceRate < 75 || unresolvedCount >= 3;

  if (variant === 'compact') {
    return (
      <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <TrendingDown size={14} strokeWidth={1.75} className="text-rose-600 shrink-0" />
          <p className="text-[11px] text-slate-800 dark:text-slate-200 truncate">
            <span className="font-bold text-rose-800 dark:text-rose-300">Customer Care Alert:</span> Unresolved reports lead {dept.name} customers to switch to higher-rated providers ({competitors[0]?.name || 'competitors'}).
          </p>
        </div>
        {competitors.length > 0 && (
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="text-[10px] mono font-bold text-slate-900 dark:text-white underline shrink-0 hover:text-emerald-600"
          >
            {showAlternatives ? 'Hide' : 'Compare'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] p-4 space-y-3">
      {/* Title & Customer Behavior Hook */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
            <TrendingDown size={16} strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9.5px] mono font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700">
                {branding.defectionNotice.warningTag}
              </span>
              <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100">
                {branding.defectionNotice.headline}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              {branding.defectionNotice.explanation} When {dept.name} leaves reports unanswered, {branding.defectionNotice.regulatorContrast}
            </p>
          </div>
        </div>

        {isConsumerOrPrivate && !isClaimed && (
          <button
            onClick={onClaimClick}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs mono shrink-0 shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <ShieldCheck size={13} />
            <span>Protect Profile</span>
          </button>
        )}
      </div>

      {/* Customer Switch Metric Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10.5px] mono pt-1">
        <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/40 space-y-0.5">
          <span className="text-slate-500 text-[9px] uppercase font-bold block">Defection Risk</span>
          <span className="font-black text-rose-700 dark:text-rose-400 text-xs">
            {unresolvedCount > 0 ? `${unresolvedCount} Unresolved Reports` : branding.advertisingCampaign.churnStatistic}
          </span>
          <p className="text-[8.5px] text-slate-600 dark:text-slate-400">
            {branding.advertisingCampaign.marketInsight}
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/40 space-y-0.5">
          <span className="text-slate-500 text-[9px] uppercase font-bold block">Direct Rival Benefit</span>
          <span className="font-black text-emerald-700 dark:text-emerald-400 text-xs">
            {branding.advertisingCampaign.retentionBenefit}
          </span>
          <p className="text-[8.5px] text-slate-600 dark:text-slate-400">Verified desks capture defecting clients</p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/40 space-y-0.5">
          <span className="text-slate-500 text-[9px] uppercase font-bold block">Local Motto &amp; Fix</span>
          <span className="font-black text-slate-900 dark:text-white text-xs">
            {dept.sla || 24}h SLA Commitment
          </span>
          <p className="text-[8.5px] text-emerald-700 dark:text-emerald-400 font-bold truncate">
            {branding.advertisingCampaign.localLanguagePunchline}
          </p>
        </div>
      </div>

      {/* Alternatives Comparison List (Shows where customers defect to) */}
      {competitors.length > 0 && (
        <div className="pt-1">
          <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-emerald-600" />
              <span>Where Disappointed Clients Switch In This Category:</span>
            </span>
            <button
              onClick={() => setShowAlternatives(!showAlternatives)}
              className="text-emerald-700 dark:text-emerald-400 font-black hover:underline cursor-pointer"
            >
              {showAlternatives ? 'Hide Alternatives' : 'View Top Care Desks'}
            </button>
          </div>

          {showAlternatives && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 a-fade">
              {competitors.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => {
                    setActiveDept(alt.id);
                    setActiveDeptCountry(country);
                    go('dept_wall');
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer flex flex-col justify-between space-y-1 shadow-2xs group"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="w-6 h-6 rounded bg-[#f1f3f4] dark:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <DeptIcon dept={alt} size={12} />
                    </span>
                    <span className="text-[9px] mono font-bold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                      <Star size={10} className="fill-current" /> {alt.trustScore || 90}%
                    </span>
                  </div>
                  <div>
                    <h5 className="text-[11.5px] font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                      {alt.name}
                    </h5>
                    <p className="text-[9px] text-slate-500 truncate">{alt.location || alt.category?.toUpperCase()}</p>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[9px] mono text-emerald-700 dark:text-emerald-400 font-black">
                    <span>{alt.sla || 24}h SLA</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">Inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
