import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import {
  INITIAL_PARTNERSHIPS,
  INITIAL_APPLICATIONS,
  GovPartnershipRecord,
  GovFeedbackMessage,
  PartnershipApplication,
} from '../data/partnerships';
import {
  ChevronLeft,
  Handshake,
  Shield,
  Send,
  CheckCircle2,
  Clock,
  Radio,
  Landmark,
  ArrowRight,
  Server,
  Lock,
  MessageSquare,
  XCircle,
  Layers,
} from 'lucide-react';
import { CountryCode } from '../types';

export const GovPartnershipView: React.FC = () => {
  const {
    go,
    selectedCountry,
    setSelectedCountry,
    toast,
    govFeedbackMessages,
    addGovFeedbackMessage,
    endorseModificationForCdOps,
    rejectModificationBySuperadmin,
  } = useApp();

  const activeCountry = (selectedCountry || 'UG') as CountryCode;
  const countryObj = COUNTRIES[activeCountry];

  const [partnerships] = useState<GovPartnershipRecord[]>(() => {
    try {
      const saved = localStorage.getItem('civicduty_partnerships');
      return saved ? JSON.parse(saved) : INITIAL_PARTNERSHIPS;
    } catch {
      return INITIAL_PARTNERSHIPS;
    }
  });

  const feedbackList = govFeedbackMessages;

  const [applications, setApplications] = useState<PartnershipApplication[]>(() => {
    try {
      const saved = localStorage.getItem('civicduty_applications');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const currentPartnership = partnerships.find((p) => p.countryCode === activeCountry);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'modifications' | 'clearinghouse' | 'accord' | 'apply'>('modifications');

  // Sender tier in Modification / Directive form
  const [senderTier, setSenderTier] = useState<'accounting_officer' | 'national_superadmin'>('accounting_officer');
  const [fSubject, setFSubject] = useState('');
  const [fMinistry, setFMinistry] = useState('');
  const [fOfficer, setFOfficer] = useState('');
  const [fTitle, setFTitle] = useState('');
  const [fPriority, setFPriority] = useState<'routine' | 'urgent' | 'statutory_directive'>('routine');
  const [fMessage, setFMessage] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // New application form
  const [appMinistry, setAppMinistry] = useState('');
  const [appOfficer, setAppOfficer] = useState('');
  const [appTitle, setAppTitle] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appPhone, setAppPhone] = useState('');
  const [appScope, setAppScope] = useState('');
  const [appUnits, setAppUnits] = useState(50);
  const [submittingApp, setSubmittingApp] = useState(false);

  const nationalNodeHeadLabel =
    currentPartnership?.focalRole && currentPartnership?.focalOfficer
      ? `${currentPartnership.focalOfficer} (${currentPartnership.focalRole})`
      : activeCountry === 'UG'
      ? 'Permanent Secretary, Ministry of Local Government (PS MoLG)'
      : `${countryObj?.name || activeCountry} National Node Head (Permanent Secretary)`;

  // Filter feedback for currently selected country
  const countryFeedback = feedbackList.filter((f) => f.countryCode === activeCountry);
  const pendingNodeHeadVetting = countryFeedback.filter(
    (f) => f.clearanceStage === 'pending_national_superadmin'
  );
  const escalatedToCdOpsList = countryFeedback.filter(
    (f) => f.clearanceStage !== 'pending_national_superadmin'
  );

  const handleSendModificationOrDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fSubject.trim() || !fMessage.trim()) {
      toast('Please provide a subject and modification description.', 'red');
      return;
    }

    setSubmittingFeedback(true);
    const isSuperadmin = senderTier === 'national_superadmin';

    const newMsg: GovFeedbackMessage = {
      id: `${isSuperadmin ? 'DIR' : 'MOD'}-${activeCountry}-${Date.now().toString().slice(-4)}`,
      countryCode: activeCountry,
      countryName: countryObj?.name || activeCountry,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      senderMinistry:
        fMinistry.trim() ||
        (isSuperadmin
          ? currentPartnership?.leadMinistry || 'Ministry of Local Government'
          : 'District / Municipal Accounting Desk'),
      senderTitle:
        fTitle.trim() ||
        (isSuperadmin ? 'Permanent Secretary (National Node Head)' : 'Chief Administrative Officer (CAO)'),
      senderOfficer:
        fOfficer.trim() ||
        (isSuperadmin ? currentPartnership?.focalOfficer || 'National Superadmin' : 'Accounting Officer'),
      subject: fSubject.trim(),
      message: fMessage.trim(),
      priority: fPriority,
      status: 'sent',
      clearanceStage: isSuperadmin ? 'escalated_to_cd_ops' : 'pending_national_superadmin',
      nationalSuperadminTitle: nationalNodeHeadLabel,
      ...(isSuperadmin
        ? {
            endorsedBySuperadmin:
              fOfficer.trim() || currentPartnership?.focalOfficer || 'National Node Head (PS MoLG)',
            endorsedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            superadminNotes: 'Originated directly from National Superadmin / Node Head.',
          }
        : {}),
    };

    addGovFeedbackMessage(newMsg);
    setFSubject('');
    setFMessage('');
    setSubmittingFeedback(false);

    if (isSuperadmin) {
      toast('National Superadmin Directive transmitted directly to CivicDuty Operatives (CD-Ops).', 'emerald');
    } else {
      toast(
        `Modification request routed to ${countryObj?.name || activeCountry} National Node Head for vetting.`,
        'emerald'
      );
      setActiveTab('clearinghouse');
    }
  };

  const handleApplyPartnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appMinistry.trim() || !appOfficer.trim() || !appEmail.trim()) {
      toast('Please complete all required fields for the sovereign partnership request.', 'red');
      return;
    }

    setSubmittingApp(true);
    const newApp: PartnershipApplication = {
      id: `APP-${activeCountry}-${Date.now().toString().slice(-4)}`,
      countryCode: activeCountry,
      countryName: countryObj?.name || activeCountry,
      leadMinistry: appMinistry.trim(),
      applicantName: appOfficer.trim(),
      applicantTitle: appTitle.trim() || 'National Node Head / Permanent Secretary',
      officialEmail: appEmail.trim(),
      phone: appPhone.trim(),
      requestedScope: appScope.trim() || 'National and metropolitan citizen service monitoring rollout.',
      targetUnits: Number(appUnits) || 50,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'under_review',
      notes: 'Submitted via Government Partnership & Bilateral Hub.',
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    try {
      localStorage.setItem('civicduty_applications', JSON.stringify(updated));
    } catch {}

    setSubmittingApp(false);
    toast(
      `Partnership accord request logged for ${countryObj?.name || activeCountry}! Ref: ${newApp.id}`,
      'emerald'
    );
    setActiveTab('accord');
  };

  return (
    <div className="px-3.5 sm:px-5 pt-4 pb-20 max-w-3xl mx-auto space-y-4 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Main Studio Header Card */}
      <div className="rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => go('gov_login')}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold cursor-pointer"
          >
            <ChevronLeft size={14} /> Back to Government Auth Desk
          </button>

          <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            CivicDuty ↔ {countryObj?.name || activeCountry} Node Head
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="space-y-1">
            <div className="text-[10.5px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <Handshake size={13} />
              <span>Sovereign Partnership Hub &amp; 2-Stage Modification Protocol</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Government Bilateral Communication &amp; App Modification Clearinghouse
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Any Accounting Officer (CAO, Town Clerk, SAS, Sector Engineer) can request custom app modifications. Requests are routed to the country&apos;s <strong>National Node Head</strong> (e.g., Uganda PS MoLG), who either rejects them locally or endorses them to <strong>CivicDuty Operatives (CD-Ops)</strong>. CivicDuty interacts directly only with each country&apos;s National Superadmin.
            </p>
          </div>

          {/* Quick Jurisdiction Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {(['UG', 'KE', 'NG', 'RW', 'GH', 'TZ', 'ZA', 'NL', 'GB', 'US'] as CountryCode[]).map((code) => {
              const c = COUNTRIES[code];
              if (!c) return null;
              const isSel = activeCountry === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedCountry(code)}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                    isSel
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
                  }`}
                >
                  {code} · {c.name}
                </button>
              );
            })}
          </div>

          {/* 3-Step Visual Chain of Command Pipeline */}
          <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-0.5">
              <div className="text-[10px] font-mono text-slate-500 font-semibold">
                STAGE 1 · ACCOUNTING OFFICER
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-xs">
                Request App Modification
              </div>
              <p className="text-[10.5px] text-slate-500 leading-snug">
                CAOs, Town Clerks &amp; Sector Desks submit workflow/SLA modification needs.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-0.5">
              <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                STAGE 2 · NATIONAL NODE HEAD
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-xs">
                Vetting by PS MoLG / Superadmin
              </div>
              <p className="text-[10.5px] text-slate-500 leading-snug">
                Country Node Head rejects redundant requests or endorses valid ones.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-emerald-500/30 space-y-0.5">
              <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                STAGE 3 · CIVICDUTY CD-OPS
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-xs">
                Direct Bilateral Execution
              </div>
              <p className="text-[10.5px] text-slate-500 leading-snug">
                CD-Ops communicates strictly with the National Superadmin &amp; deploys updates.
              </p>
            </div>
          </div>

          {/* Active Partnership Summary Bar */}
          {currentPartnership ? (
            <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {currentPartnership.countryCode}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {currentPartnership.countryName} Sovereign Accord · Active Bilateral Pact
                    </div>
                    <div className="text-[10.5px] font-mono text-slate-500">
                      National Superadmin: {currentPartnership.focalOfficer} ({currentPartnership.focalRole})
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => go('gov_login')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Sign In to Desk</span>
                  <ArrowRight size={12} />
                </button>
              </div>
              <div className="text-[10.5px] font-mono text-slate-500 flex items-center gap-1.5 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
                <Server size={12} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{currentPartnership.sovereignDataSovereignty}</span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {countryObj?.name || activeCountry} · Sovereign Onboarding Candidate
                </div>
                <div className="text-[11px] text-slate-500">
                  Formalize a national MoU to designate your country&apos;s National Superadmin Node Head.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('apply')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold shrink-0 cursor-pointer"
              >
                Request Accord
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#e3e6ea] dark:border-[#262b36] overflow-x-auto scrollbar-none">
            {[
              { id: 'modifications', label: '1. Submit Modification', icon: MessageSquare },
              {
                id: 'clearinghouse',
                label: `2. Node Head Clearinghouse (${pendingNodeHeadVetting.length})`,
                icon: Layers,
              },
              { id: 'accord', label: '3. Sovereign Accord', icon: Shield },
              { id: 'apply', label: '4. Formal MoU Application', icon: Handshake },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2.5 px-3 text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SUBMIT MODIFICATION OR NATIONAL DIRECTIVE */}
          {activeTab === 'modifications' && (
            <div className="space-y-4">
              <form
                onSubmit={handleSendModificationOrDirective}
                className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#e3e6ea] dark:border-[#262b36]">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Send size={13} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Submit App Modification Request or National Directive</span>
                  </span>
                  <span className="text-[10.5px] font-mono text-slate-500">
                    Jurisdiction: {countryObj?.name || activeCountry}
                  </span>
                </div>

                {/* Role / Tier Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 block">
                    Select Your Official Role in the Escalation Chain
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSenderTier('accounting_officer')}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        senderTier === 'accounting_officer'
                          ? 'bg-white dark:bg-[#161a22] border-emerald-500'
                          : 'bg-white/60 dark:bg-[#161a22]/60 border-[#e3e6ea] dark:border-[#262b36]'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Accounting Officer (CAO, Town Clerk, SAS, Sector)
                      </div>
                      <div className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                        → Routed to {countryObj?.name || activeCountry} National Node Head (PS MoLG)
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSenderTier('national_superadmin')}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                        senderTier === 'national_superadmin'
                          ? 'bg-white dark:bg-[#161a22] border-emerald-500'
                          : 'bg-white/60 dark:bg-[#161a22]/60 border-[#e3e6ea] dark:border-[#262b36]'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        National Node Head / Superadmin (e.g. PS MoLG)
                      </div>
                      <div className="text-[10.5px] font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                        → Transmitted Directly to CivicDuty Operatives (CD-Ops)
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                      Ministry / Local Government Station
                    </label>
                    <input
                      type="text"
                      value={fMinistry}
                      onChange={(e) => setFMinistry(e.target.value)}
                      placeholder={
                        senderTier === 'national_superadmin'
                          ? currentPartnership?.leadMinistry || 'Ministry of Local Government'
                          : 'e.g. Gulu District Local Government / KCCA'
                      }
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                      Officer Name &amp; Statutory Title
                    </label>
                    <input
                      type="text"
                      value={fOfficer}
                      onChange={(e) => setFOfficer(e.target.value)}
                      placeholder={
                        senderTier === 'national_superadmin'
                          ? 'e.g. Ben Kumumanya (PS MoLG)'
                          : 'e.g. Innocent Asaba (Chief Administrative Officer)'
                      }
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                      Modification Subject / Feature Request *
                    </label>
                    <input
                      type="text"
                      value={fSubject}
                      onChange={(e) => setFSubject(e.target.value)}
                      placeholder="e.g. Add Borehole Serial Number & Culvert GPS Field on District Resolution Form"
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                      Priority Level
                    </label>
                    <select
                      value={fPriority}
                      onChange={(e) => setFPriority(e.target.value as any)}
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="routine">Routine Modification</option>
                      <option value="urgent">Urgent SLA Calibration</option>
                      <option value="statutory_directive">Statutory Mandate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                    Detailed App Modification Specification *
                  </label>
                  <textarea
                    rows={3}
                    value={fMessage}
                    onChange={(e) => setFMessage(e.target.value)}
                    placeholder="Describe the exact form field, SLA timer, escalation rule, or departmental modification needed for your accounting desk..."
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <span className="text-[10.5px] text-slate-500 font-mono flex items-center gap-1">
                    <Lock size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      {senderTier === 'accounting_officer'
                        ? `Destination: ${nationalNodeHeadLabel}`
                        : 'Destination: CivicDuty Operatives (CD-Ops)'}
                    </span>
                  </span>
                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={12} />
                    <span>
                      {senderTier === 'accounting_officer'
                        ? 'Submit to National Node Head (PS MoLG)'
                        : 'Transmit Directly to CivicDuty CD-Ops'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Vetted Bilateral Directives Stream (Stage 3: Escalated to CD-Ops) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-slate-700 dark:text-slate-300">
                    National Superadmin ↔ CD-Ops Bilateral Ledger ({escalatedToCdOpsList.length})
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    Endorsed by National Node Head
                  </span>
                </div>

                {escalatedToCdOpsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap text-[10.5px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{item.id}</span>
                        <span>·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {item.clearanceStage === 'rejected_by_superadmin'
                            ? 'Rejected by National Node Head'
                            : item.endorsedBySuperadmin
                            ? `Endorsed by ${item.endorsedBySuperadmin}`
                            : 'National Superadmin Directive'}
                        </span>
                      </div>
                      <span className="text-slate-500">{item.timestamp}</span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {item.subject}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Origin: <strong>{item.senderOfficer}</strong> ({item.senderTitle} · {item.senderMinistry})
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed bg-white dark:bg-[#161a22] p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                        {item.message}
                      </p>
                    </div>

                    {item.cdOpsResponse ? (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            <span>{item.respondedBy || 'CivicDuty Platform Operations (CD-Ops)'}</span>
                          </span>
                          <span>{item.respondedAt}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 leading-snug">{item.cdOpsResponse}</p>
                      </div>
                    ) : item.clearanceStage === 'rejected_by_superadmin' ? (
                      <div className="text-[10.5px] font-mono text-rose-600 dark:text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/25">
                        Closed at National Node Head level: {item.superadminNotes}
                      </div>
                    ) : (
                      <div className="text-[10.5px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1.5 bg-white dark:bg-[#161a22] p-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                        <Clock size={11} />
                        <span>Endorsed by National Node Head · In CivicDuty CD-Ops Engineering Queue</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: NATIONAL NODE HEAD CLEARINGHOUSE (PS MoLG Vetting Queue) */}
          {activeTab === 'clearinghouse' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Landmark size={13} />
                  <span>Stage 2 · National Node Head Clearinghouse ({countryObj?.name || activeCountry})</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Designated National Superadmin: <strong>{nationalNodeHeadLabel}</strong>. Accounting Officer modification requests arrive here first. Review each request below and either <strong>Reject</strong> it or <strong>Endorse &amp; Submit to CivicDuty Operatives (CD-Ops)</strong>.
                </p>
              </div>

              {pendingNodeHeadVetting.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-center space-y-2">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-500" />
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    All Accounting Officer Requests Vetted
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    There are no pending modification requests waiting for {countryObj?.name || activeCountry}&apos;s National Node Head. Submit a test request on Tab 1 as an Accounting Officer to see it appear here.
                  </p>
                </div>
              ) : (
                pendingNodeHeadVetting.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap text-[10.5px] font-mono">
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {req.id} · AWAITING NATIONAL NODE HEAD DECISION
                      </span>
                      <span className="text-slate-500">{req.timestamp}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {req.subject}
                      </h4>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Submitted by Accounting Officer: <strong>{req.senderOfficer}</strong> ({req.senderTitle} · {req.senderMinistry})
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] leading-relaxed">
                        {req.message}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
                      <span className="text-[10px] font-mono text-slate-500">
                        Action as {nationalNodeHeadLabel}:
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            rejectModificationBySuperadmin(
                              req.id,
                              nationalNodeHeadLabel,
                              'Rejected by National Node Head — existing statutory form fields cover this requirement.'
                            )
                          }
                          className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle size={13} />
                          <span>Reject Request</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            endorseModificationForCdOps(
                              req.id,
                              nationalNodeHeadLabel,
                              `Vetted and approved by ${nationalNodeHeadLabel} for CivicDuty CD-Ops implementation.`
                            );
                            setActiveTab('modifications');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 size={13} />
                          <span>Endorse &amp; Submit to CivicDuty CD-Ops →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SOVEREIGN ACCORD & DATA SOVEREIGNTY */}
          {activeTab === 'accord' && (
            <div className="space-y-3 text-xs">
              {[
                {
                  title: '1. Single National Superadmin Point of Contact',
                  body: 'To preserve constitutional order and prevent fragmented software changes across hundreds of districts, CivicDuty Operatives (CD-Ops) only execute platform modifications endorsed by each nation’s designated National Superadmin (e.g., Permanent Secretary, Ministry of Local Government).',
                },
                {
                  title: '2. National Data Sovereignty Guarantees',
                  body: 'All telemetry, audit logs, and citizen grievances are hosted in compliant national data centers (e.g., NITA-U in Uganda, Konza in Kenya, Galaxy Backbone in Nigeria, e-GA in Tanzania).',
                },
                {
                  title: '3. Zero-Cost USSD Citizen Channel (*3030#)',
                  body: 'Every sovereign partnership includes a zero-rated telecom bridge so citizens in rural and urban areas report water outages, impassable roads, and extortion without internet bundles.',
                },
                {
                  title: '4. Public Finance Management Act (PFMA) Automatic Escalation',
                  body: 'Reports automatically escalate across the 5 statutory tiers: from grassroots Parish Chiefs up to Sub-County SAS, District CAOs, Agency MDs, and Permanent Secretaries.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1"
                >
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CALL TO PARTNERSHIP & FORMAL APPLICATION */}
          {activeTab === 'apply' && (
            <form
              onSubmit={handleApplyPartnership}
              className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
                <span className="text-xs font-bold uppercase text-slate-900 dark:text-white font-mono">
                  Sovereign Partnership Application · {countryObj?.name || activeCountry}
                </span>
                <span className="text-[10px] font-mono text-slate-500">ISO: {activeCountry}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                    Lead Ministry (National Node Head) *
                  </label>
                  <input
                    type="text"
                    value={appMinistry}
                    onChange={(e) => setAppMinistry(e.target.value)}
                    placeholder="e.g. Ministry of Local Government & Decentralisation"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                    National Superadmin Officer Name *
                  </label>
                  <input
                    type="text"
                    value={appOfficer}
                    onChange={(e) => setAppOfficer(e.target.value)}
                    placeholder="e.g. Permanent Secretary / Director General"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                    Statutory Title
                  </label>
                  <input
                    type="text"
                    value={appTitle}
                    onChange={(e) => setAppTitle(e.target.value)}
                    placeholder="Permanent Secretary"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                    Official Government Email *
                  </label>
                  <input
                    type="email"
                    value={appEmail}
                    onChange={(e) => setAppEmail(e.target.value)}
                    placeholder="ps@molg.gov.xx"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                    Official Phone
                  </label>
                  <input
                    type="tel"
                    value={appPhone}
                    onChange={(e) => setAppPhone(e.target.value)}
                    placeholder="+256 414 123456"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                    Deployment Scope
                  </label>
                  <input
                    type="text"
                    value={appScope}
                    onChange={(e) => setAppScope(e.target.value)}
                    placeholder="e.g. Nationwide rollout across all districts and municipalities"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block font-semibold mb-1">
                    Initial Desks Target
                  </label>
                  <input
                    type="number"
                    value={appUnits}
                    onChange={(e) => setAppUnits(Number(e.target.value))}
                    min={1}
                    max={5000}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Handshake size={13} />
                  <span>{submittingApp ? 'Submitting...' : 'Submit Sovereign Accord Request'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
