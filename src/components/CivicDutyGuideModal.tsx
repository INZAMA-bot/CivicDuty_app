import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { primaryUnit, tiersFor } from '../data/tiers';
import { COUNTRIES } from '../data/countries';
import { CountryCode } from '../types';
import { getCountryBranding } from '../data/countryBranding';
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
  Sparkles,
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

const SUPPORTED_COUNTRY_CODES: CountryCode[] = ['UG', 'KE', 'TZ', 'RW', 'NG', 'GH', 'ZA'];

export const CivicDutyGuideModal: React.FC<CivicDutyGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'quickstart',
}) => {
  const { user, go } = useApp();
  const [activeTab, setActiveTab] = useState<GuideTabKey>(() => resolveTab(initialTab));
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const [guideCountry, setGuideCountry] = useState<CountryCode>(() => (user?.country as CountryCode) || 'UG');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(resolveTab(initialTab));
      if (user?.country && SUPPORTED_COUNTRY_CODES.includes(user.country as CountryCode)) {
        setGuideCountry(user.country as CountryCode);
      }
    }
  }, [isOpen, initialTab, user?.country]);

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
    { id: 'quickstart', label: '1. Quick Start', icon: <Sparkles size={14} /> },
    { id: 'hud', label: '2. 3-Signal HUD', icon: <Activity size={14} /> },
    { id: 'tiers', label: '3. 5-Tier Routing', icon: <Layers size={14} /> },
    { id: 'gov_vs_private', label: '4. Public vs Private', icon: <Landmark size={14} /> },
    { id: 'whistleblower', label: '5. Whistleblower Safety', icon: <Lock size={14} /> },
    { id: 'offline_ussd', label: '6. Offline & USSD', icon: <Smartphone size={14} /> },
    { id: 'scenarios', label: '7. Interactive Scenarios', icon: <Compass size={14} />, badge: 'Live' },
    { id: 'csr_perks', label: '8. Pre-Funded CSR Perks', icon: <Gift size={14} />, badge: 'Vault' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-auto text-slate-800 dark:text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-md shadow-teal-500/20 shrink-0 text-lg">
              {countryData.flag}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white tracking-tight">
                  CivicDuty Field Manual &amp; Operational Guide
                </h3>
                <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {countryData.name} Sovereign Node
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Adaptive legal frameworks, statutory decentralization tiers &amp; consumer protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Adaptive Country Switcher Ribbon */}
        <div className="px-4 py-2 bg-slate-100/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 shrink-0 text-[10px] font-mono uppercase font-black">
            <Globe size={13} className="text-emerald-600" />
            <span>Country Adaptation:</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {SUPPORTED_COUNTRY_CODES.map((code) => {
              const c = COUNTRIES[code];
              const isSelected = guideCountry === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setGuideCountry(code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                  }`}
                  title={`Switch guide to ${c.name}`}
                >
                  <span>{c.flag}</span>
                  <span className="hidden sm:inline text-[11px]">{c.name}</span>
                  <span className="sm:hidden text-[10px] mono">{code}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Selector Bar */}
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: QUICK START */}
          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2 font-serif">
                    <Sparkles size={16} className="text-emerald-600" />
                    How CivicDuty Delivers Real Results in {countryData.name}
                  </h4>
                  <span className="text-[10px] mono font-black uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {branding.currency} NODE
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  CivicDuty is not a social media rant wall. It is a cryptographic, statutory accountability engine bridging citizens directly to official accounting officers under <strong>{branding.fieldManual.constitutionalBasis}</strong> and the <strong>{branding.fieldManual.pfmaAct}</strong>.
                </p>
                <div className="pt-1 text-[11px] text-emerald-800 dark:text-emerald-300 italic font-mono">
                  &ldquo;{branding.culturalMotto}&rdquo;
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-black text-sm flex items-center justify-center border border-teal-300 dark:border-teal-700">
                    1
                  </div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">Speak Your Truth</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Select the responsible public agency or private provider, tag your grassroots {primary}, and upload voice recordings or photographic proof.
                  </p>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1 pt-1">
                    <ShieldCheck size={12} /> Masked by Sovereign Pseudonym
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-black text-sm flex items-center justify-center border border-amber-300 dark:border-amber-700">
                    2
                  </div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">Cryptographic Timestamp</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Your dispatch computes a SHA-256 mathematical hash stored on the public ledger. Corrupt officers cannot delete, conceal, or backdate incidents.
                  </p>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 pt-1">
                    <Hash size={12} /> Immutable Audit Trail
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-sm flex items-center justify-center border border-emerald-300 dark:border-emerald-700">
                    3
                  </div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">Turnaround or Escalation</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    A countdown starts against statutory SLAs. Unresolved tickets automatically escalate across {countryData.name}&rsquo;s 5 administrative tiers up to the {branding.fieldManual.accountingOfficerTitle} and {branding.fieldManual.antiCorruptionAgency.acronym}.
                  </p>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 pt-1">
                    <Clock size={12} /> Escalation to {branding.fieldManual.antiCorruptionAgency.acronym}
                  </div>
                </div>
              </div>

              {/* Statutory Framework Callout */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Scale size={14} className="text-emerald-600" />
                  <span>{countryData.name} Statutory Foundations:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Constitutional Basis:</span>
                    <span>{branding.fieldManual.constitutionalBasis}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Fiscal Accountability:</span>
                    <span>{branding.fieldManual.pfmaAct}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-xs">
                  <strong className="text-slate-900 dark:text-white">Ready to file a dispatch in {countryData.name}?</strong>
                  <span className="text-slate-500 block text-[11px]">Submit your report or browse the public registry.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      go('compose');
                    }}
                    className="btn btn-primary text-xs font-bold px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles size={13} /> Speak (File Report)
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      go('depts');
                    }}
                    className="btn btn-secondary text-xs font-bold px-3 py-2"
                  >
                    Directory
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE 3-SIGNAL HUD */}
          {activeTab === 'hud' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Activity size={16} className="text-emerald-600" />
                  The 3-Signal Sovereign HUD Decoded for {countryData.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  The traffic light at the center of your screen reflects real statutory governance status under {countryData.name} law:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider">
                        🔴 Red Signal: Critical Breach &amp; Anti-Corruption Alert
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      Assigned to reports alleging bribery, extortion, life-threatening utility failures, or complaints where statutory SLAs have lapsed. Automatically flags the accounting officer&rsquo;s audit and dispatches alerts directly to <strong>{branding.fieldManual.antiCorruptionAgency.name} ({branding.fieldManual.antiCorruptionAgency.acronym})</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                    <Clock size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                        🟡 Amber Signal: Active Investigation &amp; Field Review
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      The responsible department has officially acknowledged receipt, verified the grassroots location in the {primary}, and assigned an inspection crew with a public remediation deadline.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
                        🟢 Green Signal: Verified Public Resolution
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      Remediation is complete with photographic proof or repair telemetry uploaded. The ticket is only closed when local {countryData.name} citizens verify that the issue was actually solved on the ground.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block mb-0.5">💡 Interactive Tip:</strong>
                Clicking the 3 bulbs in the navigation header filters the live feed instantly to show only Red breaches, Amber investigations, or Green verified victories for {countryData.name}.
              </div>
            </div>
          )}

          {/* TAB 3: 5-TIER ROUTING */}
          {activeTab === 'tiers' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Layers size={16} className="text-emerald-600" />
                  {countryData.name}&rsquo;s 5 Statutory Administrative Tiers
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Governance model: <strong>{branding.fieldManual.decentralizationModel}</strong>. Why does CivicDuty ask for your {primary}? To route incidents straight to the correct statutory vote controller and prevent bureaucratic delays.
                </p>
              </div>

              <div className="relative border-l-2 border-emerald-500/40 ml-4 pl-4 space-y-4 text-xs">
                {branding.fieldManual.tiers.map((tier) => (
                  <div key={tier.tierNumber} className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center">
                      {tier.tierNumber}
                    </div>
                    <div className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{tier.levelName}</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                      Authority: {tier.authority}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {tier.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                <strong>No Administrative Silos:</strong> When you file a report in {countryData.name}, CivicDuty automatically links it across all 5 tiers. If a grassroots officer attempts to bury an incident, the {branding.fieldManual.accountingOfficerTitle} and {branding.fieldManual.antiCorruptionAgency.acronym} see the audit log immediately.
              </div>
            </div>
          )}

          {/* TAB 4: GOV VS PRIVATE */}
          {activeTab === 'gov_vs_private' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Landmark size={16} className="text-emerald-600" />
                  Sovereign Government Desks vs. Private Provider Desks ({countryData.name})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Understanding the crucial legal, financial, and operational distinction between public authorities and commercial enterprises:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Government Track */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                    <Landmark size={18} />
                    <h5 className="text-xs font-black uppercase tracking-wider">
                      🏛️ Sovereign Government Desks
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Centrally provisioned ministries, district administrations, state corporations, and regulatory agencies in {countryData.name}.
                  </p>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Citizen Cost:</span>
                      <strong className="text-emerald-600">100% Free Always</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Subscription Provision:</span>
                      <strong className="text-blue-700 dark:text-blue-400 text-right">Centrally by Appointed Gov Personnel</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Funding Mechanism:</span>
                      <strong className="text-slate-800 dark:text-slate-200">Parliament Vote / Treasury Budget</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Payment Rail:</span>
                      <strong className="text-slate-800 dark:text-slate-200">National Central Treasury TSA / IFMS</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Legal Mandate:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{branding.fieldManual.pfmaAct}</strong>
                    </div>
                  </div>
                </div>

                {/* Private Provider Track */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <Building2 size={18} />
                    <h5 className="text-xs font-black uppercase tracking-wider">
                      🏢 Private Commercial Providers
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {branding.advertisingCampaign.typicalBusinesses.join(', ')}.
                  </p>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Citizen Cost:</span>
                      <strong className="text-emerald-600">100% Free Always</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Subscription Provision:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 text-right">Claimed by Business Owner ({branding.currency})</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Funding Mechanism:</span>
                      <strong className="text-slate-800 dark:text-slate-200">Territory Commercial SaaS Subscription</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Payment Rails:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{branding.primaryTelecoms.join(', ')}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Retention Incentive:</span>
                      <strong className="text-slate-800 dark:text-slate-200">Prevent Customer Defection ({branding.advertisingCampaign.churnStatistic})</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Local Advertising Campaign Card in Field Manual */}
              <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30 border border-amber-300 dark:border-amber-800/80 rounded-2xl text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
                <TrendingDown size={18} className="shrink-0 mt-0.5 text-amber-600" />
                <div className="space-y-1">
                  <strong className="block text-slate-900 dark:text-white">
                    {branding.advertisingCampaign.headline}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {branding.advertisingCampaign.body}
                  </p>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold block">
                    ✨ {branding.advertisingCampaign.localLanguagePunchline}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WHISTLEBLOWER SAFETY */}
          {activeTab === 'whistleblower' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Lock size={16} className="text-emerald-600" />
                  Whistleblower Protection &amp; SHA-256 Ledger in {countryData.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Governed by <strong>{branding.fieldManual.whistleblowerLegislation}</strong>:
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Automatic Pseudonym Masking</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                      Your legal identity, contact phone number, and SIM credentials are never published or disclosed to audited officers. Reports are inscribed under sovereign pseudonyms.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    <Hash size={16} />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">Client-Side SHA-256 Cryptographic Hashing</strong>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed block mt-0.5">
                      Every grievance calculates a mathematical hash in your browser before transmission. Any retrospective alteration of reports is mathematically detectable.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
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
                  className="btn btn-secondary text-xs font-bold px-4 py-2 flex items-center gap-1.5"
                >
                  <Hash size={13} /> Open Hash Verifier Tool →
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: OFFLINE & USSD */}
          {activeTab === 'offline_ussd' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Smartphone size={16} className="text-emerald-600" />
                  Inclusive Universal Access in {countryData.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Built for rural and urban reality across {countryData.name} ({branding.primaryTelecoms.join(', ')}):
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                    <WifiOff size={18} />
                    <h5 className="text-xs font-black uppercase tracking-wider">Offline Progressive PWA</h5>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    When traveling through rural areas with no mobile data, CivicDuty caches your voice reports and photographs locally in encrypted storage. You can sync with a single tap once back in network range.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <Smartphone size={18} />
                    <h5 className="text-xs font-black uppercase tracking-wider">
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
                  className="btn btn-primary text-xs font-bold px-4 py-2 flex items-center gap-1.5 shadow-sm"
                >
                  <Smartphone size={13} /> Launch {branding.ussdShortcode} Simulator →
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: INTERACTIVE SCENARIOS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 font-serif">
                  <Compass size={16} className="text-emerald-600" />
                  Interactive Scenario Simulator ({countryData.name})
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Click any real-world incident in {countryData.name} to see the exact responding statutory authority, turnaround SLA, and tier escalation path:
                </p>
              </div>

              {/* Scenario selector pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedScenario(idx)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedScenario === idx
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {sc.category}
                    </div>
                    <div className="text-xs font-black mt-0.5">{sc.title}</div>
                  </button>
                ))}
              </div>

              {/* Selected Scenario Breakdown */}
              {(() => {
                const activeSc = scenarios[selectedScenario] || scenarios[0];
                return (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-500">Signal Classification:</span>
                      <span className="font-black">{activeSc.type}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-500">Responsible Authority:</span>
                      <span className="font-black text-slate-900 dark:text-white">{activeSc.targetAgency}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-500">Jurisdiction Level:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">{activeSc.jurisdiction}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="font-bold text-slate-500">Statutory Turnaround SLA:</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">{activeSc.sla}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 block">5-Tier Statutory Escalation Path:</span>
                      <p className="text-[11px] font-mono bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-emerald-800 dark:text-emerald-300">
                        {activeSc.escalationPath}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-slate-500 block">Expected Public Outcome:</span>
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
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-4 rounded-2xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2 font-serif">
                    <Gift size={16} className="text-amber-600 dark:text-amber-400" />
                    Pre-Funded Digital Utility Perks &amp; Sovereign Escrow Vault
                  </h4>
                  <span className="text-[10px] mono font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30">
                    Phase 6 Escrow Architecture
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  In many civic systems, citizen incentives fail because rewards are promises without pre-allocated funds. 
                  CivicDuty solves this through <strong>Pre-Funded Escrow</strong>: civil engineering contractors, government authorities, and utility corporations pre-deposit cryptographic vouchers before rewarding citizens.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      go('perk_vault');
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Database size={13} />
                    <span>Open Sovereign Perk Escrow Vault</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/40">
                    1
                  </div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">Batch CSV Deposit</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Contractors upload spreadsheets with MTN 2GB data bundles, NWSC water bill tokens, or Umeme Yaka electricity units earmarked from statutory CSR budgets.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center justify-center border border-emerald-500/40">
                    2
                  </div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">Escrow Locking</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Vouchers are cryptographically secured in the Escrow Ledger (`status: escrow_unassigned`), tracking face value liquidity and donor accountability.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-500/40">
                    3
                  </div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">Instant Citizen Dispatch</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    When public agency or contractor officers reward watchdog audits, vouchers are atomically drawn from escrow, sending live SMS codes and USSD strings to citizens.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <HelpCircle size={13} className="text-emerald-600" />
            <span>Field manual calibrated to <strong>{countryData.name} ({guideCountry})</strong> sovereign statutes.</span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary text-xs font-bold px-4 py-1.5 cursor-pointer"
          >
            Close Field Manual
          </button>
        </div>
      </div>
    </div>
  );
};
