import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { primaryUnit, tiersFor } from '../data/tiers';
import { COUNTRIES } from '../data/countries';
import { CountryCode } from '../types';
import { getCountryBranding } from '../data/countryBranding';
import { InteractiveRoleSandboxGrid } from './InteractiveRoleSandboxGrid';
import {
  X,
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Landmark,
  Building2,
  Smartphone,
  WifiOff,
  ArrowRight,
  Lock,
  Scale,
  Activity,
  Hash,
  Layers,
  HelpCircle,
  TrendingDown,
  FileCheck,
  Globe,
  ChevronRight,
  Gift,
  Ticket,
  Database
} from 'lucide-react';

interface CivicDutyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

type GuideTabKey = 'quickstart' | 'hud' | 'tiers' | 'gov_vs_private' | 'whistleblower' | 'offline_ussd' | 'scenarios' | 'csr_perks';

const resolveTab = (tab?: string): GuideTabKey => {
  if (tab === 'signals' || tab === 'hud') return 'hud';
  if (tab === 'tiers' || tab === 'routing') return 'tiers';
  if (tab === 'gov_vs_private' || tab === 'private' || tab === 'gov') return 'gov_vs_private';
  if (tab === 'whistleblower' || tab === 'security') return 'whistleblower';
  if (tab === 'offline_ussd' || tab === 'ussd' || tab === 'offline') return 'offline_ussd';
  if (tab === 'scenarios') return 'scenarios';
  if (tab === 'csr' || tab === 'perks' || tab === 'perk_vault' || tab === 'csr_perks') return 'csr_perks';
  return 'quickstart';
};

const QUICK_GUIDE_COUNTRIES: CountryCode[] = ['UG', 'KE', 'TZ', 'RW', 'NG', 'GH', 'ZA', 'US', 'GB', 'DE', 'IN'];

export const CivicDutyGuideModal: React.FC<CivicDutyGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'quickstart',
}) => {
  const { user, selectedCountry, go } = useApp();
  const [activeTab, setActiveTab] = useState<GuideTabKey>(() => resolveTab(initialTab));
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const [guideCountry, setGuideCountry] = useState<CountryCode>(() => (user?.country as CountryCode) || selectedCountry || 'UG');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(resolveTab(initialTab));
      const activeC = (user?.country || selectedCountry) as CountryCode;
      if (activeC && COUNTRIES[activeC]) {
        setGuideCountry(activeC);
      }
    }
  }, [isOpen, initialTab, user?.country, selectedCountry]);

  // Reset selected scenario when switching country
  useEffect(() => {
    setSelectedScenario(0);
  }, [guideCountry]);

  if (!isOpen) return null;

  const countryData = COUNTRIES[guideCountry] || COUNTRIES.UG;
  const branding = getCountryBranding(guideCountry);
  const primary = primaryUnit(guideCountry) || branding.fieldManual.grassrootsUnit || 'Parish / Ward';
  const scenarios = branding.fieldManual.scenarios;

  const tabs: { id: GuideTabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'quickstart', label: '1. Quick Start', icon: <BookOpen size={14} strokeWidth={1.75} /> },
    { id: 'hud', label: '2. 3-Signal HUD', icon: <Activity size={14} strokeWidth={1.75} /> },
    { id: 'tiers', label: '3. 5-Tier Routing', icon: <Layers size={14} strokeWidth={1.75} /> },
    { id: 'gov_vs_private', label: '4. Public vs Private', icon: <Landmark size={14} strokeWidth={1.75} /> },
    { id: 'whistleblower', label: '5. Whistleblower Safety', icon: <Lock size={14} strokeWidth={1.75} /> },
    { id: 'offline_ussd', label: '6. Offline & USSD', icon: <Smartphone size={14} strokeWidth={1.75} /> },
    { id: 'scenarios', label: '7. Interactive Scenarios', icon: <Compass size={14} strokeWidth={1.75} />, badge: 'Live' },
    { id: 'csr_perks', label: '8. Pre-Funded CSR Perks', icon: <Gift size={14} strokeWidth={1.75} />, badge: 'Vault' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-4xl w-full shadow-xl overflow-hidden my-auto text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col">
        {/* Studio Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs font-mono font-bold">
              {guideCountry}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  CivicDuty Field Manual &amp; Operational Guide
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  · {countryData.name} Sovereign Node
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Adaptive legal frameworks, statutory decentralization tiers &amp; consumer protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Adaptive Global Country Switcher Ribbon */}
        <div className="px-4 sm:px-5 py-2.5 bg-white dark:bg-[#161a22] border-b border-[#e3e6ea] dark:border-[#262b36] flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 shrink-0 text-[10px] font-mono uppercase font-semibold">
              <Globe size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Jurisdiction ({Object.keys(COUNTRIES).length} Nations):</span>
            </div>
            <select
              value={guideCountry}
              onChange={(e) => setGuideCountry(e.target.value as CountryCode)}
              aria-label="Select Country for Field Manual"
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {Object.entries(COUNTRIES).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.name} ({code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {QUICK_GUIDE_COUNTRIES.map((code) => {
              const c = COUNTRIES[code];
              if (!c) return null;
              const isSelected = guideCountry === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setGuideCountry(code)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono font-semibold transition-colors flex items-center gap-1 cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                  title={`Switch guide to ${c.name}`}
                >
                  <span>{code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Segmented Tab Bar */}
        <div className="px-4 sm:px-5 py-2 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] overflow-x-auto flex items-center gap-1 shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-white dark:bg-[#161a22] text-emerald-600 dark:text-emerald-400 border-[#e3e6ea] dark:border-[#262b36]'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#161a22]/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5 bg-white dark:bg-[#161a22]">
          {/* TAB 1: QUICK START */}
          {activeTab === 'quickstart' && (
            <div className="space-y-4">
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-4 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck size={16} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                    How CivicDuty Delivers Real Results in {countryData.name}
                  </h4>
                  <span className="text-[10px] font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400">
                    {branding.currency} NODE
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  CivicDuty is not a social media rant wall. It is a cryptographic, statutory accountability engine bridging citizens directly to official accounting officers under <strong>{branding.fieldManual.constitutionalBasis}</strong> and the <strong>{branding.fieldManual.pfmaAct}</strong>.
                </p>
                <div className="pt-1 text-[11px] text-emerald-700 dark:text-emerald-400 italic font-mono">
                  &ldquo;{branding.culturalMotto}&rdquo;
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-[#e3e6ea] dark:border-[#262b36]">
                    01
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Speak Your Truth</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Select the responsible public agency or private provider, tag your grassroots {primary}, and upload voice recordings or photographic proof.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
                    <ShieldCheck size={12} /> Masked by Sovereign Pseudonym
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-[#e3e6ea] dark:border-[#262b36]">
                    02
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Cryptographic Timestamp</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Your dispatch computes a SHA-256 mathematical hash stored on the public ledger. Corrupt officers cannot delete, conceal, or backdate incidents.
                  </p>
                  <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 pt-0.5">
                    <Hash size={12} /> Immutable Audit Trail
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-[#e3e6ea] dark:border-[#262b36]">
                    03
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Turnaround or Escalation</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    A countdown starts against statutory SLAs. Unresolved tickets automatically escalate across {countryData.name}&rsquo;s 5 administrative tiers up to the {branding.fieldManual.accountingOfficerTitle} and {branding.fieldManual.antiCorruptionAgency.acronym}.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 pt-0.5">
                    <Clock size={12} /> Escalation to {branding.fieldManual.antiCorruptionAgency.acronym}
                  </div>
                </div>
              </div>

              {/* Embedded 6 Live Role Simulations inside Field Guide */}
              <InteractiveRoleSandboxGrid countryCode={guideCountry} onAfterSelect={onClose} />

              {/* Statutory Framework Callout */}
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Scale size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span>{countryData.name} Statutory Foundations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block">Constitutional Basis</span>
                    <span className="mt-0.5 block">{branding.fieldManual.constitutionalBasis}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                    <span className="font-semibold text-slate-900 dark:text-slate-200 block">Fiscal Accountability</span>
                    <span className="mt-0.5 block">{branding.fieldManual.pfmaAct}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white">Ready to file a dispatch in {countryData.name}?</strong>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Submit your report or browse the public registry.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      go('compose');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowRight size={13} strokeWidth={1.75} /> Speak (File Report)
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      go('depts');
                    }}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-[#161a22] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
                  >
                    Directory
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE 3-SIGNAL HUD */}
          {activeTab === 'hud' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity size={16} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                  The 3-Signal Sovereign HUD Decoded for {countryData.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  The traffic light at the center of your screen reflects real statutory governance status under {countryData.name} law:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-400 tracking-wider">
                      Signal 1 (Red) · Critical Breach &amp; Anti-Corruption Alert
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Assigned to reports alleging bribery, extortion, life-threatening utility failures, or complaints where statutory SLAs have lapsed. Automatically flags the accounting officer&rsquo;s audit and dispatches alerts directly to <strong>{branding.fieldManual.antiCorruptionAgency.name} ({branding.fieldManual.antiCorruptionAgency.acronym})</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Clock size={18} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                      Signal 2 (Amber) · Active Investigation &amp; Field Review
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      The responsible department has officially acknowledged receipt, verified the grassroots location in the {primary}, and assigned an inspection crew with a public remediation deadline.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                      Signal 3 (Green) · Verified Public Resolution
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Remediation is complete with photographic proof or repair telemetry uploaded. The ticket is only closed when local {countryData.name} citizens verify that the issue was actually solved on the ground.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block mb-0.5">Interactive Tip:</strong>
                Clicking the 3 bulbs in the navigation header filters the live feed instantly to show only Red breaches, Amber investigations, or Green verified victories for {countryData.name}.
              </div>
            </div>
          )}

          {/* TAB 3: 5-TIER ROUTING */}
          {activeTab === 'tiers' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={16} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                  {countryData.name}&rsquo;s 5 Statutory Administrative Tiers
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Governance model: <strong>{branding.fieldManual.decentralizationModel}</strong>. Why does CivicDuty ask for your {primary}? To route incidents straight to the correct statutory vote controller and prevent bureaucratic delays.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 text-xs">
                {branding.fieldManual.tiers.map((tier) => (
                  <div
                    key={tier.tierNumber}
                    className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      0{tier.tierNumber}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{tier.levelName}</span>
                        <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          Authority: {tier.authority}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">No Administrative Silos:</strong> When you file a report in {countryData.name}, CivicDuty automatically links it across all 5 tiers. If a grassroots officer attempts to bury an incident, the {branding.fieldManual.accountingOfficerTitle} and {branding.fieldManual.antiCorruptionAgency.acronym} see the audit log immediately.
              </div>
            </div>
          )}

          {/* TAB 4: GOV VS PRIVATE */}
          {activeTab === 'gov_vs_private' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Landmark size={16} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                  Sovereign Government Desks vs. Private Provider Desks ({countryData.name})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Understanding the crucial legal, financial, and operational distinction between public authorities and commercial enterprises:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Government Track */}
                <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Landmark size={16} strokeWidth={1.75} />
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider">
                      Sovereign Government Desks
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Centrally provisioned ministries, district administrations, state corporations, and regulatory agencies in {countryData.name}.
                  </p>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between py-1.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-slate-500">Citizen Cost:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">100% Free Always</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-slate-500">Subscription Provision:</span>
                      <strong className="text-slate-900 dark:text-slate-100 text-right">Centrally by Appointed Gov Personnel</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-slate-500">Funding Mechanism:</span>
                      <strong className="text-slate-900 dark:text-slate-100">Parliament Vote / Treasury Budget</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-slate-500">Payment Rail:</span>
                      <strong className="text-slate-900 dark:text-slate-100">National Central Treasury TSA / IFMS</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Legal Mandate:</span>
                      <strong className="text-slate-900 dark:text-slate-100">{branding.fieldManual.pfmaAct}</strong>
                    </div>
                  </div>
                </div>

                {/* Private Provider Track */}
                <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <Building2 size={16} strokeWidth={1.75} />
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider">
                      Private Commercial Providers
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {branding.advertisingCampaign.typicalBusinesses.join(', ')}.
                  </p>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between py-1.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-slate-500">Citizen Cost:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">100% Free Always</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-slate-500">Subscription Provision:</span>
                      <strong className="text-slate-900 dark:text-slate-100 text-right">Claimed by Business Owner ({branding.currency})</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-slate-500">Funding Mechanism:</span>
                      <strong className="text-slate-900 dark:text-slate-100">Territory Commercial SaaS Subscription</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-slate-500">Payment Rails:</span>
                      <strong className="text-slate-900 dark:text-slate-100">{branding.primaryTelecoms.join(', ')}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Retention Incentive:</span>
                      <strong className="text-slate-900 dark:text-slate-100">Prevent Customer Defection ({branding.advertisingCampaign.churnStatistic})</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Advertising Campaign Card in Field Manual */}
              <div className="p-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl text-xs text-slate-900 dark:text-slate-200 flex items-start gap-2.5">
                <TrendingDown size={16} strokeWidth={1.75} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <strong className="block text-slate-900 dark:text-white">
                    {branding.advertisingCampaign.headline}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {branding.advertisingCampaign.body}
                  </p>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                    {branding.advertisingCampaign.localLanguagePunchline}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WHISTLEBLOWER SAFETY */}
          {activeTab === 'whistleblower' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock size={16} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                  Whistleblower Protection &amp; SHA-256 Ledger in {countryData.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Governed by <strong>{branding.fieldManual.whistleblowerLegislation}</strong>:
                </p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Automatic Pseudonym Masking</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                      Your legal identity, contact phone number, and SIM credentials are never published or disclosed to audited officers. Reports are inscribed under sovereign pseudonyms.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Hash size={16} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Client-Side SHA-256 Cryptographic Hashing</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                      Every grievance calculates a mathematical hash in your browser before transmission. Any retrospective alteration of reports is mathematically detectable.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <FileCheck size={16} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Official Verification &amp; {branding.fieldManual.antiCorruptionAgency.acronym} Audit Trail</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                      Citizens and investigative journalists can input cryptographic receipt hashes into the Hash Verifier tool to confirm registration in {countryData.name}&rsquo;s sovereign ledger.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onClose();
                    go('verify');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Hash size={13} /> Open Hash Verifier Tool →
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: OFFLINE & USSD */}
          {activeTab === 'offline_ussd' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone size={16} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                  Inclusive Universal Access in {countryData.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Built for rural and urban reality across {countryData.name} ({branding.primaryTelecoms.join(', ')}):
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <WifiOff size={16} />
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider">Offline Progressive PWA</h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    When traveling through rural areas with no mobile data, CivicDuty caches your voice reports and photographs locally in encrypted storage. You can sync with a single tap once back in network range.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Smartphone size={16} />
                    <h5 className="text-xs font-mono font-bold uppercase tracking-wider">
                      Zero-Data {branding.ussdShortcode} USSD ({branding.localPhoneSlang})
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Citizens with simple feature phones (known locally as <strong>{branding.localPhoneSlang}</strong>) can dial <strong>{branding.ussdShortcode}</strong> on {branding.primaryTelecoms.join(' or ')} to file reports and receive SMS tracking codes without internet data.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onClose();
                    go('ussd');
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone size={13} /> Launch {branding.ussdShortcode} Simulator →
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: INTERACTIVE SCENARIOS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass size={16} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                  Interactive Scenario Simulator ({countryData.name})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Click any real-world incident in {countryData.name} to see the exact responding statutory authority, turnaround SLA, and tier escalation path:
                </p>
              </div>

              {/* Scenario selector buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {scenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedScenario(idx)}
                    className={`p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                      selectedScenario === idx
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-slate-900 dark:text-white'
                        : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {sc.category}
                    </div>
                    <div className="text-xs font-bold mt-0.5">{sc.title}</div>
                  </button>
                ))}
              </div>

              {/* Selected Scenario Breakdown */}
              {(() => {
                const activeSc = scenarios[selectedScenario] || scenarios[0];
                return (
                  <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                      <span className="font-mono text-slate-500">Signal Classification:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{activeSc.type}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                      <span className="font-mono text-slate-500">Responsible Authority:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{activeSc.targetAgency}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                      <span className="font-mono text-slate-500">Jurisdiction Level:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{activeSc.jurisdiction}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                      <span className="font-mono text-slate-500">Statutory Turnaround SLA:</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{activeSc.sla}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-slate-500 block">5-Tier Statutory Escalation Path:</span>
                      <p className="text-[11px] font-mono bg-white dark:bg-[#161a22] p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] text-emerald-700 dark:text-emerald-300">
                        {activeSc.escalationPath}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-mono text-slate-500 block">Expected Public Outcome:</span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                        {activeSc.outcome}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 8: PRE-FUNDED CSR PERKS & ESCROW VAULT */}
          {activeTab === 'csr_perks' && (
            <div className="space-y-4">
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-4 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <Gift size={16} strokeWidth={1.75} className="text-amber-600 dark:text-amber-400" />
                    Pre-Funded Digital Utility Perks &amp; Sovereign Escrow Vault
                  </h4>
                  <span className="text-[10px] font-mono font-semibold uppercase text-amber-600 dark:text-amber-400">
                    Phase 6 Escrow Architecture
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  In many civic systems, citizen incentives fail because rewards are promises without pre-allocated funds. 
                  CivicDuty solves this through <strong>Pre-Funded Escrow</strong>: civil engineering contractors, government authorities, and utility corporations pre-deposit cryptographic vouchers before rewarding citizens.
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      go('perk_vault');
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Database size={13} />
                    <span>Open Sovereign Perk Escrow Vault</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] text-amber-600 dark:text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-[#e3e6ea] dark:border-[#262b36]">
                    01
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Batch CSV Deposit</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Contractors upload spreadsheets with MTN 2GB data bundles, NWSC water bill tokens, or Umeme Yaka electricity units earmarked from statutory CSR budgets.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-[#e3e6ea] dark:border-[#262b36]">
                    02
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Escrow Locking</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Vouchers are cryptographically secured in the Escrow Ledger (`status: escrow_unassigned`), tracking face value liquidity and donor accountability.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-[#e3e6ea] dark:border-[#262b36]">
                    03
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">Instant Citizen Dispatch</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    When public agency or contractor officers reward watchdog audits, vouchers are atomically drawn from escrow, sending live SMS codes and USSD strings to citizens.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Studio Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
            <HelpCircle size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Field manual calibrated to <strong className="text-slate-900 dark:text-white">{countryData.name} ({guideCountry})</strong> sovereign statutes.</span>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#161a22] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Close Field Manual
          </button>
        </div>
      </div>
    </div>
  );
};
