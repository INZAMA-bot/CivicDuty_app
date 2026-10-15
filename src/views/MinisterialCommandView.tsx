import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ViewType, MinisterialDirective } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  FileText,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Zap,
  Radio,
  FileCheck2,
  Send,
  Eye,
  RefreshCw,
  ExternalLink,
  Info,
  Scale,
  Briefcase,
  Layers,
  MapPin,
  History,
  Download,
} from 'lucide-react';
import { downloadForensicAuditPdf } from '../services/forensicPdfService';

export const MinisterialCommandView: React.FC = () => {
  const {
    user,
    go,
    toast,
    logAudit,
    ministerialDirectives,
    issueMinisterialDirective,
    enrolledSectorMinisters,
    officialQueries,
    directLoginWithGovCode,
  } = useApp();

  // Active Minister Profile selection (defaulting to Hon. Balaam or active logged-in minister)
  const isNameere = user?.officer_name?.includes('Nameere') || user?.deskCode === 'UG-MOLG-STATE-MIN';
  const [selectedMinister, setSelectedMinister] = useState<'balaam' | 'nameere'>(isNameere ? 'nameere' : 'balaam');

  const [activeTab, setActiveTab] = useState<'taskforce' | 'directives' | 'cabinet_roster' | 'whistleblower' | 'constitution'>('taskforce');

  // Fast taskforce dispatch form
  const [targetDistrict, setTargetDistrict] = useState('Wakiso District');
  const [directiveCategory, setDirectiveCategory] = useState<MinisterialDirective['directiveType']>('anti_extortion_taskforce');
  const [directiveSubject, setDirectiveSubject] = useState('');
  const [instructions, setInstructions] = useState('');
  const [psRequirement, setPsRequirement] = useState('Freeze unauthorized municipal sub-account and demand financial books within 48 hours.');
  const [iggRequirement, setIggRequirement] = useState('Issue Section 19 statutory subpoena to ringleaders and interdict implicated Town Agents.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search and filter for directives
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Guardrail modal
  const [guardrailModalOpen, setGuardrailModalOpen] = useState(false);
  const [guardrailActionName, setGuardrailActionName] = useState('');

  const ministerInfo = useMemo(() => {
    if (selectedMinister === 'balaam') {
      return {
        name: 'Hon. Balaam Barugahara Ateenyi',
        title: 'Cabinet Minister of Local Government',
        code: 'UG-MOLG-CABINET-MIN',
        mandateType: 'cabinet_minister_policy' as const,
        term: '26 May 2026 – Present (Cabinet Reshuffle)',
        roleLabel: 'Apex Political Command & Anti-Corruption Oversight',
        mandateSummary:
          'Fearless eradication of extortion cartels across all 135+ Local Governments, illegal market stall fees, and unauthorized boda-boda levies. Direct coordination with Frontline Scouts and Cabinet.',
        badgeColor: 'bg-emerald-600 text-white',
        borderTheme: 'border-emerald-500/50',
      };
    } else {
      return {
        name: 'Hon. Justine Nameere',
        title: 'Minister of State for Local Government',
        code: 'UG-MOLG-STATE-MIN',
        mandateType: 'state_minister_grassroots' as const,
        term: '26 May 2026 – Present (Cabinet Reshuffle)',
        roleLabel: 'Grassroots Vigilance & PDM Integrity Ombudsman',
        mandateSummary:
          'Unannounced spot-checks on Sub-County Town Agents, Parish Chiefs, and PDM Sacco disbursement books to catch ghost beneficiaries, extortion rings, and stolen youth seed capital.',
        badgeColor: 'bg-purple-600 text-white',
        borderTheme: 'border-purple-500/50',
      };
    }
  }, [selectedMinister]);

  const handleDispatchDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveSubject.trim()) {
      toast('Please provide a subject for the Ministerial Directive', 'amber');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      issueMinisterialDirective({
        ministerName: ministerInfo.name,
        ministerTitle: ministerInfo.title,
        ministerDeskCode: ministerInfo.code,
        mandateType: ministerInfo.mandateType,
        subject: directiveSubject,
        directiveType: directiveCategory,
        targetScope: 'district',
        targetJurisdiction: targetDistrict,
        statutoryBasis:
          selectedMinister === 'balaam'
            ? 'Constitution of Uganda Arts 111 & 117 / Presidential Anti-Graft Directive 2026'
            : 'Constitution Art. 117 / Local Governments Act Statutory Oversight',
        executiveInstructions: instructions || `Immediate field inspection and political inquiry into reported irregularities in ${targetDistrict}.`,
        psActionRequired: psRequirement,
        iggActionRequired: iggRequirement,
      });

      setDirectiveSubject('');
      setInstructions('');
      setIsSubmitting(false);
      setActiveTab('directives');
    }, 400);
  };

  const filteredDirectives = useMemo(() => {
    return ministerialDirectives.filter((d) => {
      const matchSearch =
        d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.targetJurisdiction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.directiveRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ministerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === 'all' || d.directiveType === filterType;
      return matchSearch && matchType;
    });
  }, [ministerialDirectives, searchQuery, filterType]);

  const triggerConstitutionalGuardrail = (actionName: string) => {
    setGuardrailActionName(actionName);
    setGuardrailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 p-3 sm:p-6 space-y-6">
      {/* Top Ministerial Ribbon */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#12161f] text-white p-5 sm:p-7 rounded-3xl border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/40 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                Apex Political Command · Republic of Uganda
              </span>
              <span className="text-xs font-mono text-emerald-300/80 bg-slate-900/60 px-2.5 py-0.5 rounded-md border border-slate-700">
                Constitution Articles 111 &amp; 117
              </span>
              <span className="text-xs font-mono text-amber-300/90 bg-amber-950/40 px-2.5 py-0.5 rounded-md border border-amber-600/30">
                May 26, 2026 Cabinet Reshuffle Mandate
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Cabinet Ministerial Command &amp; Anti-Graft Oversight</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Executive political command of the Ministry of Local Government. Formulate policy, institute rapid anti-extortion taskforces, protect Parish Development Model (PDM) tranches, and escalate statutory queries directly to the Permanent Secretary (Accounting Officer) and Inspectorate of Government (IGG).
            </p>
          </div>

          {/* Quick Desk Navigation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => go('ps_molg_rollout')}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 transition-colors shadow-sm"
              title="View Permanent Secretary Accounting Officer Desk"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>PS MoLG Desk (Vote 011)</span>
            </button>
            <button
              onClick={() => go('gov_audit')}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-200 text-xs font-bold border border-rose-800/60 transition-colors shadow-sm"
              title="Open Inspector General of Government Portal"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>IGG Portal (Beti Kamya)</span>
            </button>
          </div>
        </div>

        {/* Active Minister Selection Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Minister:</span>
            <button
              onClick={() => {
                setSelectedMinister('balaam');
                directLoginWithGovCode('UG-MOLG-CABINET-MIN');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                selectedMinister === 'balaam'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Hon. Balaam Barugahara (Cabinet Minister)</span>
            </button>

            <button
              onClick={() => {
                setSelectedMinister('nameere');
                directLoginWithGovCode('UG-MOLG-STATE-MIN');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                selectedMinister === 'nameere'
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400/50'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-purple-300 animate-pulse" />
              <span>Hon. Justine Nameere (State Minister)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/90">
            <span>Credential Code:</span>
            <code className="bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
              {ministerInfo.code}
            </code>
          </div>
        </div>
      </div>

      {/* Constitutional Separation of Powers Guardrail Bar */}
      <div className="bg-amber-50 dark:bg-amber-950/25 border-l-4 border-amber-500 p-4 rounded-xl text-xs space-y-2 text-amber-900 dark:text-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300 text-sm">
            <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Constitutional Separation of Powers (Constitution Arts 111 &amp; 117 vs Art 174 &amp; PFMA 2015 Section 45)</span>
          </div>
          <button
            onClick={() => setActiveTab('constitution')}
            className="text-[11px] font-bold underline hover:text-amber-600 dark:hover:text-amber-100"
          >
            Review Legal Separation Matrix &rarr;
          </button>
        </div>
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">
          <strong>Ministers hold Political Command &amp; Policy Authority</strong>: Formulating legislation, defending budgets in Parliament, dispatching anti-extortion taskforces, and issuing formal statutory directives.
          <strong> Permanent Secretary (PS MoLG) holds Statutory Accounting Authority</strong>: Sole signatory for Vote 011 warrants, fund releases, contract approvals, and civil service disciplinary actions under PFMA 2015.
          Directives issued from this desk automatically register in the PS MoLG and IGG queues.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'taskforce', label: 'Anti-Extortion & Taskforces', icon: Zap, count: 0 },
          { id: 'directives', label: 'Ministerial Directives Ledger', icon: FileText, count: ministerialDirectives.length },
          { id: 'cabinet_roster', label: 'Cabinet Ministers Roster', icon: Users, count: enrolledSectorMinisters.length },
          { id: 'whistleblower', label: 'Grassroots Whistleblower Telemetry', icon: Radio, count: officialQueries.length },
          { id: 'constitution', label: 'Constitutional Matrix', icon: Scale, count: 0 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-[#161a22] text-emerald-600 dark:text-emerald-400 border-t-2 border-emerald-500 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANTI-EXTORTION & FIELD TASKFORCES DISPATCH */}
      {activeTab === 'taskforce' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispatch Form */}
          <div className="lg:col-span-2 bg-white dark:bg-[#161a22] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                Ministerial Executive Action
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Promulgate Statutory Ministerial Directive</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Promulgates an executive directive with cryptographic audit seal and auto-routes formal queries to PS MoLG (Administrative) and IGG (Constitutional).
              </p>
            </div>

            <form onSubmit={handleDispatchDirective} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Promulgating Minister
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-between">
                    <span>{ministerInfo.name}</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">{ministerInfo.code}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Local Government / Jurisdiction
                  </label>
                  <select
                    value={targetDistrict}
                    onChange={(e) => setTargetDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-slate-100"
                  >
                    <option value="Wakiso District">Wakiso District (Kira, Nansana, Entebbe)</option>
                    <option value="Arua District & City">Arua District &amp; City (West Nile)</option>
                    <option value="Mbale City & District">Mbale City &amp; District (Bugisu)</option>
                    <option value="Mbarara City & District">Mbarara City &amp; District (Ankole)</option>
                    <option value="Gulu City & District">Gulu City &amp; District (Acholi)</option>
                    <option value="Jinja City & District">Jinja City &amp; District (Busoga)</option>
                    <option value="Kasese District">Kasese District (Rwenzori)</option>
                    <option value="All 135+ Local Governments (National)">All 135+ Local Governments (National Circular)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Directive Type &amp; Priority
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'anti_extortion_taskforce', label: 'Anti-Extortion Taskforce' },
                    { id: 'surprise_field_audit', label: 'Surprise Field Inspection' },
                    { id: 'pdm_ringfence', label: 'PDM Fund Ringfencing' },
                    { id: 'policy_circular', label: 'Ministerial Policy Circular' },
                    { id: 'public_hearing', label: 'Boda / Market Hearing' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setDirectiveCategory(t.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all border ${
                        directiveCategory === t.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Directive Subject / Statutory Mandate
                </label>
                <input
                  type="text"
                  value={directiveSubject}
                  onChange={(e) => setDirectiveSubject(e.target.value)}
                  placeholder="e.g. Immediate Dismantling of Unofficial Boda-Boda Stage Taxing Syndicates"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Executive Instructions to Field Scouts &amp; Municipal Staff
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  placeholder="Provide precise terms of reference for taskforce officers or parish monitors..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Statutory Demand to PS MoLG (Vote 011)</span>
                  </div>
                  <input
                    type="text"
                    value={psRequirement}
                    onChange={(e) => setPsRequirement(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-[10px] text-slate-500">Auto-routes to Permanent Secretary Ben Kumumanya</span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>Statutory Demand to IGG (Ombudsman)</span>
                  </div>
                  <input
                    type="text"
                    value={iggRequirement}
                    onChange={(e) => setIggRequirement(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-[10px] text-slate-500">Auto-routes to Hon. Beti Kamya Turwomwe</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stamps SHA-256 Non-Repudiation Hash</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Promulgating...' : 'Dispatch Ministerial Directive'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Actions & Constitutional Boundary Testing */}
          <div className="space-y-4">
            {/* Minister Profile Card */}
            <div className={`p-5 rounded-2xl bg-white dark:bg-[#161a22] border-2 ${ministerInfo.borderTheme} shadow-sm space-y-3`}>
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${ministerInfo.badgeColor}`}>
                  {ministerInfo.title.includes('Cabinet') ? 'Cabinet Minister' : 'Minister of State'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Art. {selectedMinister === 'balaam' ? '111' : '117'}</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {ministerInfo.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {ministerInfo.mandateSummary}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Desk Code:</span>
                <span className="font-bold text-slate-900 dark:text-white">{ministerInfo.code}</span>
              </div>
            </div>

            {/* Test Constitutional Boundary Guardrails */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Scale className="w-4 h-4" />
                <span>Test Constitutional Separation Guardrails</span>
              </div>
              <p className="text-[11.5px] text-slate-300 leading-relaxed">
                Under the PFMA 2015, political ministers cannot sign financial warrants, disburse treasury tranches, or execute civil service appointments directly. Try clicking below to test the platform&apos;s constitutional guardrail:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => triggerConstitutionalGuardrail('Direct Vote 011 Treasury Disbursement')}
                  className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-between border border-slate-700 transition-colors"
                >
                  <span>Attempt Vote 011 Cash Release</span>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                </button>
                <button
                  type="button"
                  onClick={() => triggerConstitutionalGuardrail('Direct Appointment / Transfer of CAO')}
                  className="w-full text-left p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-between border border-slate-700 transition-colors"
                >
                  <span>Attempt Civil Service CAO Transfer</span>
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Pre-Launch Handover Note */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Institutional Continuity
              </span>
              <div className="font-bold text-slate-900 dark:text-white">
                Hon. Raphael Magyezi Handover
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Former Minister Raphael Magyezi served from Dec 2019 to May 2026. His directive that outgoing local council terms ended 12 May 2026 is preserved in the statutory archive. Hon. Balaam and Hon. Justine Nameere formally assumed full executive reins on 26 May 2026.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MINISTERIAL DIRECTIVES LEDGER */}
      {activeTab === 'directives' && (
        <div className="bg-white dark:bg-[#161a22] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                Promulgated Directives Ledger
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Active Ministerial Directives ({filteredDirectives.length})
              </h2>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter directives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
              >
                <option value="all">All Types</option>
                <option value="anti_extortion_taskforce">Anti-Extortion</option>
                <option value="surprise_field_audit">Field Audits</option>
                <option value="pdm_ringfence">PDM Ringfence</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredDirectives.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400">
                      {d.directiveRef}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {d.targetJurisdiction}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(d.issuedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        d.status === 'in_execution'
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                          : d.status === 'ps_acknowledged'
                          ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40'
                          : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {d.status.replace(/_/g, ' ')}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        downloadForensicAuditPdf({
                          district: 'UG',
                          auditorCode: d.ministerDeskCode,
                          targetScope: d.targetJurisdiction,
                        });
                        toast(`Forensic PDF Dossier generated for ${d.directiveRef}`, 'emerald');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>PDF Dossier</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {d.subject}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    <strong>Instructions:</strong> {d.executiveInstructions}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                      Statutory Demand to PS MoLG (Accounting Officer):
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">{d.psActionRequired}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40">
                    <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 block mb-0.5">
                      Constitutional Subpoena Demand to IGG:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">{d.iggActionRequired}</span>
                  </div>
                </div>

                {d.auditSealSha256 && (
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate flex items-center gap-1.5 pt-1">
                    <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Cryptographic Seal SHA-256: {d.auditSealSha256}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CABINET ROSTER & SISTER LINE MINISTRIES */}
      {activeTab === 'cabinet_roster' && (
        <div className="bg-white dark:bg-[#161a22] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                Inter-Ministerial Cabinet Liaison
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Government of Uganda Cabinet Roster ({enrolledSectorMinisters.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All ministers in sister ministries are enrolled via their respective Permanent Secretaries to maintain statutory accounting sovereignty.
              </p>
            </div>

            <button
              onClick={() => go('ps_molg_rollout')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Enroll New Minister via PS Console</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {enrolledSectorMinisters.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        m.rank === 'cabinet_minister'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      {m.rank === 'cabinet_minister' ? 'Cabinet Minister' : 'State Minister'}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {m.deskCode}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {m.ministerName}
                  </h4>
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {m.portfolio}
                  </div>
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400">
                    {m.ministryName}
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1 leading-relaxed">
                    <strong>Focus:</strong> {m.policyFocus}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Enrolled By:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{m.invitedBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">{m.status.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GRASSROOTS CITIZEN WHISTLEBLOWER TELEMETRY */}
      {activeTab === 'whistleblower' && (
        <div className="bg-white dark:bg-[#161a22] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
              Citizen Frontline Telemetry
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Official Supervisory Queries &amp; Citizen Dossiers ({officialQueries.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grassroots reports and statutory queries escalating from Parish Chiefs, Frontline Scouts, and CAOs across Uganda.
            </p>
          </div>

          <div className="space-y-3">
            {officialQueries.slice(0, 8).map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                      {q.queryRef}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      {q.targetUnit}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Issuer: {q.issuerName}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {q.subject}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                    {q.grounds}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setTargetDistrict(q.targetUnit);
                      setDirectiveSubject(`Intervention regarding ${q.subject}`);
                      setActiveTab('taskforce');
                      toast(`Prefilled taskforce dispatch for ${q.targetUnit}`, 'emerald');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                  >
                    Issue Directive
                  </button>
                  <button
                    onClick={() => go('gov_audit')}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    View in IGG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CONSTITUTIONAL SEPARATION MATRIX */}
      {activeTab === 'constitution' && (
        <div className="bg-white dark:bg-[#161a22] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
              Legal Architecture
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Statutory Division of Authority in the Republic of Uganda
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative analysis of power separation between Cabinet Ministers, Permanent Secretaries (Accounting Officers), and the Inspector General of Government.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2.5 px-3 font-bold">Dimension</th>
                  <th className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">Cabinet Ministers (Hon. Balaam &amp; Nameere)</th>
                  <th className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400">Permanent Secretary (PS MoLG – Ben Kumumanya)</th>
                  <th className="py-2.5 px-3 font-bold text-rose-600 dark:text-rose-400">IGG Ombudsman (Hon. Beti Kamya)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-bold">Constitutional Basis</td>
                  <td className="py-3 px-3"><strong>Articles 111 &amp; 117</strong> (Political &amp; Policy Direction, Collective Responsibility)</td>
                  <td className="py-3 px-3"><strong>Article 174</strong> &amp; <strong>PFMA 2015 Section 45</strong> (Statutory Accounting Officer Vote 011)</td>
                  <td className="py-3 px-3"><strong>Chapter 13 (Arts 223–232)</strong> &amp; <strong>IGG Act 2002</strong> (Independent Watchdog)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">Financial Authority</td>
                  <td className="py-3 px-3 text-rose-600 dark:text-rose-400 font-bold">NO direct warrant signing or cash release (Prohibited under PFMA)</td>
                  <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">SOLE legal signatory for Vote 011 warrants, PDM grants, and procurements</td>
                  <td className="py-3 px-3">Can order freezing of accounts under Section 19 IGG Act</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">Civil Service Hierarchy</td>
                  <td className="py-3 px-3">No direct hire/fire powers (Governed by Public Service Commission)</td>
                  <td className="py-3 px-3">Supervises CAOs, Town Clerks, Town Agents; initiates disciplinary actions</td>
                  <td className="py-3 px-3">Can recommend or order interdiction and prosecution of public officers</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold">CivicDuty Actions</td>
                  <td className="py-3 px-3">Promulgate Directives, Dispatch Political Taskforces, Review Whistleblower Dossiers</td>
                  <td className="py-3 px-3">Approve Milestone Disbursements, Monitor CAO SLAs, Provision Municipal Nodes</td>
                  <td className="py-3 px-3">Issue Subpoenas, Prosecute Extortion, Enforce Wealth Declarations</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONSTITUTIONAL GUARDRAIL INTERACTIVE MODAL */}
      {guardrailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#161a22] border-2 border-amber-500 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Constitutional Guardrail Enforced
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Action Restricted: {guardrailActionName}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Under <strong>Article 174 of the 1995 Constitution</strong> and <strong>Section 45 of the Public Finance Management Act (PFMA) 2015</strong>, direct execution of treasury warrants, Vote 011 releases, and civil service personnel appointments are strictly reserved for the <strong>Permanent Secretary / Accounting Officer</strong>.
            </p>

            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <span className="font-bold">Lawful Ministerial Recourse:</span>
              <p>
                As a Cabinet Minister, you may issue a <strong>Ministerial Directive</strong> commanding the Permanent Secretary to freeze tranches or institute an administrative inquiry.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setGuardrailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Acknowledge Guardrail
              </button>
              <button
                type="button"
                onClick={() => {
                  setGuardrailModalOpen(false);
                  setActiveTab('taskforce');
                  setDirectiveSubject(`Statutory Directive on ${guardrailActionName}`);
                  toast('Redirected to Lawful Ministerial Directive dispatch', 'emerald');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Issue Lawful Directive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
