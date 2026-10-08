import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import {
  Rocket,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Sparkles,
  Server,
  Layers,
  Lock,
  RotateCcw,
  Calendar,
} from 'lucide-react';

export interface LaunchChecklistItem {
  id: string;
  category: 'design_aistudio' | 'sovereign_hierarchy' | 'audit_security' | 'infra_cutover';
  title: string;
  description: string;
  statusNote: string;
  targetView?: ViewType;
  targetLabel?: string;
  defaultDone: boolean;
}

const INITIAL_LAUNCH_ITEMS: LaunchChecklistItem[] = [
  // Category 1: aistudio.google Design & Mobile-First Alignment
  {
    id: 'ui-splash',
    category: 'design_aistudio',
    title: '1. Homepage (SplashView) — Single Logo & Mobile-First Portal Layout',
    description:
      'Single hero TrafficLightLogo, zero header logo, compiled 3-dots/gear settings dropdown, clean footer without redundant links.',
    statusNote: 'Approved & Locked Foundation',
    targetView: 'splash',
    targetLabel: 'Inspect Homepage',
    defaultDone: true,
  },
  {
    id: 'ui-header-nav',
    category: 'design_aistudio',
    title: '2. Header & Mobile Bottom Navigation Isolation',
    description:
      'Green check mark logo on inner pages, 3-dots/gear dropdown for Country/Lang/Theme/Docs, and strict hiding of citizen nav on Gov/Entity login screens.',
    statusNote: 'Completed & Verified',
    targetView: 'feed',
    targetLabel: 'Inspect Header/Nav',
    defaultDone: true,
  },
  {
    id: 'ui-identity',
    category: 'design_aistudio',
    title: '3. Citizen Identity & Watchdog Dossier (ProfileView)',
    description:
      'Streamlined to aistudio.google aesthetic: photo-only avatar studio, single-row Honours Vault shortcut, and unified Civic Pass modal.',
    statusNote: 'Completed & Verified',
    targetView: 'profile',
    targetLabel: 'Inspect Identity Page',
    defaultDone: true,
  },
  {
    id: 'ui-gov-login',
    category: 'design_aistudio',
    title: '4. Government & Statutory Desk Auth + Separated Partnership Hub Gateway',
    description:
      'Unobstructed header wording, separated Partnership Hub action strip, 5-Tier Escalation Hierarchy inline access code entry, and External Auditor Read-Only Passcode support.',
    statusNote: 'Completed & Verified',
    targetView: 'gov_login',
    targetLabel: 'Inspect Gov Auth',
    defaultDone: true,
  },
  {
    id: 'ui-audit-suite',
    category: 'design_aistudio',
    title: '5. 5-Page National Governance Audit Suite (GovAuditView)',
    description:
      'Refined to aistudio.google studio aesthetic with Action Ledger, Merkle Chain Verifier, Read-Only Subpoena Token Generator, Official Queries, and Node Telemetry.',
    statusNote: 'Polished to AI Studio',
    targetView: 'gov_audit',
    targetLabel: 'Inspect Audit Suite',
    defaultDone: true,
  },
  {
    id: 'ui-partnership-hub',
    category: 'design_aistudio',
    title: '6. Sovereign Partnership Hub & 2-Stage Modification Clearinghouse',
    description:
      'Refined to aistudio.google aesthetic with Accounting Officer → National Node Head (PS MoLG) → CivicDuty CD-Ops two-stage modification workflow.',
    statusNote: 'Polished to AI Studio',
    targetView: 'gov_partnership',
    targetLabel: 'Inspect Partnership Hub',
    defaultDone: true,
  },
  {
    id: 'ui-citizen-onboarding',
    category: 'design_aistudio',
    title: '7. Citizen Onboarding & Jurisdiction Selection (OnboardingCitizenView)',
    description:
      'Streamlined 3-step citizen onboarding & 1-step returning login inside aistudio.google studio cards with 1-tap parish quick-select and wall auto-pick.',
    statusNote: 'Polished to AI Studio',
    targetView: 'ob1',
    targetLabel: 'Inspect Onboarding',
    defaultDone: true,
  },
  {
    id: 'ui-compose-dispatch',
    category: 'design_aistudio',
    title: '8. Citizen Speak / Report Dispatch Studio (ComposeView)',
    description:
      'Compact aistudio.google dispatch studio with 4-step status bar, cascading territory router, Master Dossier clustering radar, GPS pin, and evidence staging.',
    statusNote: 'Polished to AI Studio',
    targetView: 'compose',
    targetLabel: 'Inspect Speak Studio',
    defaultDone: true,
  },
  {
    id: 'ui-depts-wall',
    category: 'design_aistudio',
    title: '9. Service Provider Registry & Department Walls (DepartmentsView & DeptWallView)',
    description:
      'Aligned utility/ministry cards, rectangular category filters, Public Capital Grant Ledger, and SLA scoreboards with AI Studio hairline borders.',
    statusNote: 'Polished to AI Studio',
    targetView: 'depts',
    targetLabel: 'Inspect Registry',
    defaultDone: true,
  },
  {
    id: 'ui-gov-workspaces',
    category: 'design_aistudio',
    title: '10. Official Desk Workspaces (GovInboxView, GovAdminView, PsMolgRolloutView)',
    description:
      'Unified executive command banners, Perks Dispatch Console, Baraza host strip, and 2-Stage Modification clearinghouse under the aistudio.google visual system.',
    statusNote: 'Polished to AI Studio',
    targetView: 'gov_inbox',
    targetLabel: 'Inspect Gov Desk',
    defaultDone: true,
  },

  // Category 2: Sovereign Hierarchy & Bilateral Operations
  {
    id: 'gov-two-stage-mod',
    category: 'sovereign_hierarchy',
    title: '11. 2-Stage App Modification Protocol (Accounting Officer → Node Head → CD-Ops)',
    description:
      'Accounting Officers submit modification requests to their National Node Head (e.g. Uganda PS MoLG), who rejects or endorses them to CD-Ops.',
    statusNote: 'Live & Operational',
    targetView: 'gov_partnership',
    targetLabel: 'Test 2-Stage Flow',
    defaultDone: true,
  },
  {
    id: 'gov-5-tier-codes',
    category: 'sovereign_hierarchy',
    title: '12. Multi-Country 5-Tier Statutory Escalation & Access Code Matrix',
    description:
      'Per-country statutory desks (Tier 1 Grassroots → Tier 5 Ombudsman/PS) with individual access code verification.',
    statusNote: 'Live Across 100+ Nations',
    targetView: 'gov_login',
    targetLabel: 'Test Hierarchy Login',
    defaultDone: true,
  },
  {
    id: 'gov-baraza-audio',
    category: 'sovereign_hierarchy',
    title: '13. Live Digital Baraza Audio Town Halls (Citizen & Official Host Studio)',
    description:
      'Real-time Web Audio voice synthesis, raised-hand speaker queue, and SHA-256 transcript sealing.',
    statusNote: 'Live & Verified',
    targetView: 'feed',
    targetLabel: 'Inspect Baraza',
    defaultDone: true,
  },

  // Category 3: Audit, Security & Anti-Corruption Integrity
  {
    id: 'sec-sha256-ledger',
    category: 'audit_security',
    title: '14. SHA-256 Cryptographic Ledger & Public Seal Verifier',
    description:
      'Every citizen report, official response, and supervisory query is stamped with a verifiable SHA-256 non-repudiation hash.',
    statusNote: 'Verified',
    targetView: 'verify',
    targetLabel: 'Open Seal Verifier',
    defaultDone: true,
  },
  {
    id: 'sec-anti-hush-perks',
    category: 'audit_security',
    title: '15. Honours & Perk Escrow Vault (Anti-Hush-Money Covenant)',
    description:
      'Strict separation between citizen utility/data reimbursements and ticket resolution status.',
    statusNote: 'Verified',
    targetView: 'perk_vault',
    targetLabel: 'Inspect Perk Vault',
    defaultDone: true,
  },

  // Category 4: Production Infrastructure & Launch Cutover
  {
    id: 'infra-domain-dns',
    category: 'infra_cutover',
    title: '16. Custom Production Domain Cutover (CivicDuty.site SSL & DNS)',
    description:
      'Verify Namecheap A/AAAA/CNAME records pointing to Google Cloud Run and add civicduty.site to Firebase Authorized Domains.',
    statusNote: 'Pre-Launch Cutover Step',
    defaultDone: false,
  },
  {
    id: 'infra-telecom-ussd',
    category: 'infra_cutover',
    title: '17. *3030# Zero-Rated USSD & SMS Aggregator Live Bindings',
    description:
      'Connect production telecom aggregator webhooks (/api/ussd/session & /api/sms/incoming) for feature-phone citizens.',
    statusNote: 'Simulator Ready · Awaiting Live Telco',
    targetView: 'ussd',
    targetLabel: 'Test *3030# Simulator',
    defaultDone: false,
  },
  {
    id: 'infra-demo-toggle',
    category: 'infra_cutover',
    title: '18. Production Feed Cutover (Toggle Illustrative Demos OFF at Launch Hour)',
    description:
      'Switch off "Boutique Mannequin" demo tickets in CD-Ops Policy tab once initial live citizen reports populate each national node.',
    statusNote: 'Final Launch Switch',
    defaultDone: false,
  },
];

const CATEGORY_META: Record<
  LaunchChecklistItem['category'],
  { label: string; badge: string; icon: React.ComponentType<any> }
> = {
  design_aistudio: {
    label: '1. AI Studio Design & Mobile-First UI Audit',
    badge: 'aistudio.google',
    icon: Sparkles,
  },
  sovereign_hierarchy: {
    label: '2. Sovereign Hierarchy & Bilateral Governance',
    badge: 'PS MoLG ↔ CD-Ops',
    icon: Layers,
  },
  audit_security: {
    label: '3. Cryptographic Audit & Statutory Security',
    badge: 'SHA-256 Sealed',
    icon: ShieldCheck,
  },
  infra_cutover: {
    label: '4. Production Domain, Telecom & Go-Live Cutover',
    badge: 'CivicDuty.site',
    icon: Server,
  },
};

export const CdOpsLaunchCountdown: React.FC = () => {
  const { go, toast, showDemos, setShowDemos } = useApp();

  // Persist target launch timestamp (default: 14 days from Oct 7, 2026 -> Oct 21, 2026 09:00 UTC)
  const [targetDateStr, setTargetDateStr] = useState<string>(() => {
    try {
      return localStorage.getItem('civicduty_launch_target_date') || '2026-10-21T09:00:00Z';
    } catch {
      return '2026-10-21T09:00:00Z';
    }
  });

  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('civicduty_launch_checklist_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    const init: Record<string, boolean> = {};
    INITIAL_LAUNCH_ITEMS.forEach((item) => {
      init[item.id] = item.defaultDone;
    });
    return init;
  });

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const saveChecklist = (next: Record<string, boolean>) => {
    setCheckedMap(next);
    try {
      localStorage.setItem('civicduty_launch_checklist_v2', JSON.stringify(next));
    } catch {}
  };

  const toggleItem = (id: string, title: string) => {
    const nextVal = !checkedMap[id];
    const next = { ...checkedMap, [id]: nextVal };
    saveChecklist(next);
    toast(
      nextVal ? `Marked Ready: ${title}` : `Re-opened for review: ${title}`,
      nextVal ? 'emerald' : 'amber'
    );
  };

  const handleResetChecklist = () => {
    const init: Record<string, boolean> = {};
    INITIAL_LAUNCH_ITEMS.forEach((item) => {
      init[item.id] = item.defaultDone;
    });
    saveChecklist(init);
    toast('Launch checklist reset to current baseline.', 'emerald');
  };

  const handleSetDaysFromNow = (days: number) => {
    const nextDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    setTargetDateStr(nextDate);
    try {
      localStorage.setItem('civicduty_launch_target_date', nextDate);
    } catch {}
    toast(`Launch countdown calibrated to T-Minus ${days} days.`, 'emerald');
  };

  // Countdown math
  const countdown = useMemo(() => {
    const targetMs = new Date(targetDateStr).getTime();
    const diff = Math.max(0, targetMs - nowMs);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, isLaunched: diff === 0 };
  }, [targetDateStr, nowMs]);

  const completedCount = INITIAL_LAUNCH_ITEMS.filter((i) => checkedMap[i.id]).length;
  const totalCount = INITIAL_LAUNCH_ITEMS.length;
  const pct = Math.round((completedCount / totalCount) * 100);

  const visibleItems = useMemo(() => {
    if (activeCategory === 'ALL') return INITIAL_LAUNCH_ITEMS;
    return INITIAL_LAUNCH_ITEMS.filter((i) => i.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Studio Launch Countdown Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#e3e6ea] dark:border-[#262b36] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              <Rocket size={14} strokeWidth={1.75} />
              <span>GLOBAL PRODUCTION LAUNCH COUNTDOWN</span>
              <span aria-hidden="true">·</span>
              <span>CIVICDUTY.SITE</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Sovereign Launch Readiness &amp; Step-by-Step Verification Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Every screen, governance workflow, and infrastructure bridge required for global launch. Inspect each module directly, approve or request design refinements, and check off items one by one until 100% launch readiness.
            </p>
          </div>

          {/* Live T-Minus Digital Clock */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            {[
              { label: 'DAYS', val: String(countdown.days).padStart(2, '0') },
              { label: 'HRS', val: String(countdown.hours).padStart(2, '0') },
              { label: 'MIN', val: String(countdown.minutes).padStart(2, '0') },
              { label: 'SEC', val: String(countdown.seconds).padStart(2, '0') },
            ].map((unit, idx) => (
              <div
                key={unit.label}
                className="w-14 sm:w-16 py-2 px-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-center"
              >
                <div
                  className={`text-base sm:text-xl font-mono font-bold tabular-nums leading-none ${
                    idx === 3
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {unit.val}
                </div>
                <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Progress Bar & Calibration Controls */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-slate-900 dark:text-white">
                Launch Readiness: {completedCount} / {totalCount} Verified ({pct}%)
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {totalCount - completedCount} items remaining
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mr-1">
                <Calendar size={11} />
                <span>Sprint Window:</span>
              </span>
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleSetDaysFromNow(d)}
                  className="px-2 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  {d}d
                </button>
              ))}
              <button
                type="button"
                onClick={handleResetChecklist}
                className="px-2 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                title="Reset checklist to baseline"
              >
                <RotateCcw size={10} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-[#f1f3f4] dark:bg-[#1e232d] overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {[
            { id: 'ALL', label: `All Launch Items (${totalCount})` },
            { id: 'design_aistudio', label: '1. AI Studio Design Audit (10)' },
            { id: 'sovereign_hierarchy', label: '2. Sovereign Hierarchy & Node Head (3)' },
            { id: 'audit_security', label: '3. Audit & Security (2)' },
            { id: 'infra_cutover', label: '4. Domain & Cutover (3)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                  : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Items Grouped by Category */}
      {(['design_aistudio', 'sovereign_hierarchy', 'audit_security', 'infra_cutover'] as const)
        .filter((catKey) => activeCategory === 'ALL' || activeCategory === catKey)
        .map((catKey) => {
          const meta = CATEGORY_META[catKey];
          const Icon = meta.icon;
          const catItems = visibleItems.filter((i) => i.category === catKey);
          const catDone = catItems.filter((i) => checkedMap[i.id]).length;

          return (
            <div
              key={catKey}
              className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {meta.label}
                  </h4>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-[10.5px] font-mono">
                  <span className="text-slate-500 dark:text-slate-400">{meta.badge}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {catDone}/{catItems.length} Done
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                {catItems.map((item) => {
                  const isDone = Boolean(checkedMap[item.id]);
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f8f9fa]/60 dark:hover:bg-[#0e1116]/40 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id, item.title)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer shrink-0"
                          title={isDone ? 'Mark as pending review' : 'Mark as verified for launch'}
                        >
                          {isDone ? (
                            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Circle size={18} />
                          )}
                        </button>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs sm:text-sm font-semibold ${
                                isDone
                                  ? 'text-slate-900 dark:text-white'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {item.title}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                              · {item.statusNote}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {item.id === 'infra-demo-toggle' && (
                          <button
                            type="button"
                            onClick={() => {
                              setShowDemos(!showDemos);
                              toast(
                                !showDemos
                                  ? 'Illustrative Demos enabled.'
                                  : 'Illustrative Demos hidden — Live production feed mode.',
                                'emerald'
                              );
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-[10.5px] font-mono font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                          >
                            Demos: {showDemos ? 'ON' : 'OFF'}
                          </button>
                        )}
                        {item.targetView && (
                          <button
                            type="button"
                            onClick={() => go(item.targetView!)}
                            className="px-3 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>{item.targetLabel || 'Inspect'}</span>
                            <ArrowUpRight size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id, item.title)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                            isDone
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isDone ? 'Verified ✓' : 'Verify Item'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
};
