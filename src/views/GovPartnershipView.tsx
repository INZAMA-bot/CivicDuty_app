import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountrySelector } from '../components/CountrySelector';
import { COUNTRIES } from '../data/countries';
import {
  INITIAL_PARTNERSHIPS,
  INITIAL_FEEDBACK_MESSAGES,
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
  Building2,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  Landmark,
  ArrowRight,
  Server,
  Lock,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Globe2,
} from 'lucide-react';

export const GovPartnershipView: React.FC = () => {
  const {
    go,
    selectedCountry,
    setSelectedCountry,
    toast,
    execGovLoginByData,
    govFeedbackMessages,
    addGovFeedbackMessage,
  } = useApp();

  const activeCountry = selectedCountry || 'UG';
  const countryObj = COUNTRIES[activeCountry];

  // Local state initialized from shared data stores
  const [partnerships, setPartnerships] = useState<GovPartnershipRecord[]>(() => {
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
  const [activeTab, setActiveTab] = useState<'feedback' | 'accord' | 'apply'>('feedback');

  // New feedback form
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

  // Filter feedback for currently selected country
  const countryFeedback = feedbackList.filter((f) => f.countryCode === activeCountry);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fSubject.trim() || !fMessage.trim()) {
      toast('Please provide a subject and message body for the bilateral feedback.', 'red');
      return;
    }

    setSubmittingFeedback(true);
    const newMsg: GovFeedbackMessage = {
      id: `FDBK-${activeCountry}-${Date.now().toString().slice(-4)}`,
      countryCode: activeCountry,
      countryName: countryObj?.name || activeCountry,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      senderMinistry: fMinistry.trim() || (currentPartnership?.leadMinistry || 'Ministry of Local Government'),
      senderTitle: fTitle.trim() || 'Accounting Officer Liaison',
      senderOfficer: fOfficer.trim() || 'Official Delegate',
      subject: fSubject.trim(),
      message: fMessage.trim(),
      priority: fPriority,
      status: 'sent',
    };

    addGovFeedbackMessage(newMsg);
    setFSubject('');
    setFMessage('');
    setSubmittingFeedback(false);
    toast('Bilateral feedback dispatched to CivicDuty Platform Operations (CD-Ops).', 'emerald');
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
      applicantTitle: appTitle.trim() || 'Focal Government Representative',
      officialEmail: appEmail.trim(),
      phone: appPhone.trim(),
      requestedScope: appScope.trim() || 'National and metropolitan citizen service monitoring rollout.',
      targetUnits: Number(appUnits) || 50,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'under_review',
      notes: 'Submitted via Government Desk Call to Partnership page.',
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    try {
      localStorage.setItem('civicduty_applications', JSON.stringify(updated));
    } catch {}

    setSubmittingApp(false);
    toast(`Partnership accord request logged for ${countryObj?.name || activeCountry}! Ref: ${newApp.id}`, 'emerald');
    setActiveTab('accord');
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 animate-fade-in text-slate-800 dark:text-slate-100 pb-20">
      {/* Top Navigation & Country Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => go('gov_login')}
            className="flex items-center gap-1.5 text-[10px] mono text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-bold"
          >
            <ChevronLeft size={14} /> Back to Government Desk
          </button>
          <CountrySelector variant="compact" />
        </div>

        <div className="flex items-center justify-between">
          <div className="tagline mb-1 font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
            <Handshake size={14} /> Sovereign Pacts &amp; Bilateral Operations
          </div>
          <span className="text-[8px] mono bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-300 dark:border-teal-700/60">
            CivicDuty ↔ {countryObj?.name || activeCountry}
          </span>
        </div>

        <h2 className="text-2xl font-black text-teal-800 dark:text-teal-300 tracking-tight leading-tight">
          Partner with CivicDuty
        </h2>
        <p className="text-[12.5px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          The official sovereign partnership gateway and live bilateral feedback loop between national ministries, accounting authorities, and CivicDuty Platform Operations (CD-Ops).
        </p>
      </div>

      {/* Global Country Jurisdiction Switcher Bar */}
      <CountrySelector variant="bar" />

      {/* ACTIVE PARTNERSHIP STATUS HERO BANNER */}
      {currentPartnership ? (
        <div className="p-4 rounded-3xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-500/40 space-y-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 text-xs font-mono font-black text-teal-800 dark:text-teal-300">{currentPartnership.countryCode}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 dark:text-white mono uppercase">
                    {currentPartnership.countryName} Sovereign Accord
                  </span>
                  <span className="text-[8px] mono px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                    ● ACTIVE BILATERAL PACT
                  </span>
                </div>
                <div className="text-[9px] mono text-slate-500 dark:text-slate-400 mt-0.5">
                  Ref: {currentPartnership.mouReference} · Signed: {currentPartnership.signedDate}
                </div>
              </div>
            </div>

            {/* Direct Entry into Gov Desk */}
            <button
              onClick={() => {
                toast(`Connecting to ${currentPartnership.countryName} Government Desk...`, 'teal');
                go('gov_login');
              }}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[10px] mono font-bold uppercase transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Enter National Desk</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[8.5px] mono pt-1">
            <div className="bg-white dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-slate-500 block text-[7.5px] uppercase">Lead Sovereign Ministry</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">
                {currentPartnership.leadMinistry}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-slate-500 block text-[7.5px] uppercase">Public Satisfaction</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs block mt-0.5">
                {currentPartnership.satisfactionScore}% SLA Index
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-slate-500 block text-[7.5px] uppercase">USSD National Gateway</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                {currentPartnership.ussdShortcode}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900/80 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-slate-500 block text-[7.5px] uppercase">Active Statutory Desks</span>
              <span className="font-black text-teal-600 dark:text-teal-400 text-xs block mt-0.5">
                {currentPartnership.activeDesksCount} Desks
              </span>
            </div>
          </div>

          <div className="text-[9px] mono text-slate-600 dark:text-slate-300 bg-black/5 dark:bg-white/5 p-2 rounded-xl flex items-center gap-1.5">
            <Server size={13} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">
              <strong>Data Sovereignty:</strong> {currentPartnership.sovereignDataSovereignty}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-xs font-mono font-black text-amber-800 dark:text-amber-300">{activeCountry}</span>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white mono uppercase">
                  {countryObj?.name || activeCountry} Partnership Status
                </span>
                <span className="text-[8px] mono block text-amber-700 dark:text-amber-400 font-bold">
                  ● EXPANSION &amp; ONBOARDING CANDIDATE
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('apply')}
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-[9px] mono font-bold uppercase transition-colors"
            >
              Request Accord
            </button>
          </div>
          <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {countryObj?.name || activeCountry} is currently in the CivicDuty national deployment queue. Line ministries, metropolitan city authorities, and statutory commissions can formalize an official bilateral accord to unlock full citizen accountability coverage, zero-cost USSD access, and automated PFMA escalations.
          </p>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`py-2 px-2 rounded-xl text-[10px] font-black mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'feedback'
              ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MessageSquare size={12} />
          <span>Feedback Loop</span>
        </button>
        <button
          onClick={() => setActiveTab('accord')}
          className={`py-2 px-2 rounded-xl text-[10px] font-black mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'accord'
              ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield size={12} />
          <span>Sovereign Accord</span>
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`py-2 px-2 rounded-xl text-[10px] font-black mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'apply'
              ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Handshake size={12} />
          <span>Call to Partner</span>
        </button>
      </div>

      {/* TAB 1: LIVE BILATERAL FEEDBACK LOOP */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] mono text-teal-800 dark:text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Radio size={13} className="text-teal-600 animate-pulse" /> Live Bilateral Telemetry &amp; Feedback Loop
            </span>
            <span className="text-[8px] mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-bold">
              Direct Channel to CD-Ops
            </span>
          </div>

          <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Authorized accounting officers, Permanent Secretaries, and ministry focal points can transmit operational directives, SLA calibrations, and policy notices directly to CivicDuty Platform Operations (CD-Ops). Every message is logged in the permanent audit trail.
          </p>

          {/* Feedback Transmission Form */}
          <form onSubmit={handleSendFeedback} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-[10px] mono font-black uppercase text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                <Send size={12} /> Transmit Sovereign Directive / Feedback
              </span>
              <span className="text-[7.5px] mono bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded font-bold border border-teal-200 dark:border-teal-800">
                {countryObj?.name || activeCountry} Desk
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Sender Ministry / Department
                </label>
                <input
                  type="text"
                  value={fMinistry}
                  onChange={(e) => setFMinistry(e.target.value)}
                  placeholder={currentPartnership?.leadMinistry || 'e.g. Ministry of Local Government'}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Accounting Officer / Designation
                </label>
                <input
                  type="text"
                  value={fOfficer}
                  onChange={(e) => setFOfficer(e.target.value)}
                  placeholder="e.g. Ben Kumumanya (Permanent Secretary)"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Subject / Directive Scope *
                </label>
                <input
                  type="text"
                  value={fSubject}
                  onChange={(e) => setFSubject(e.target.value)}
                  placeholder="e.g. Re-calibration of Sub-County Culvert SLA Threshold"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Directive Priority
                </label>
                <select
                  value={fPriority}
                  onChange={(e) => setFPriority(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="routine">Routine Operational Sync</option>
                  <option value="urgent">Urgent Escalation</option>
                  <option value="statutory_directive">Statutory Directive (PFMA)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                Detailed Directive / Feedback Body *
              </label>
              <textarea
                rows={3}
                value={fMessage}
                onChange={(e) => setFMessage(e.target.value)}
                placeholder="State your technical request, policy directive, SLA calibration mandate, or feedback for CivicDuty Platform Engineers..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[8.5px] text-slate-500 font-mono flex items-center gap-1">
                <Lock size={11} className="text-teal-600" /> Cryptographically stamped with National Accord key
              </span>
              <button
                type="submit"
                disabled={submittingFeedback}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs mono font-bold uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send size={12} />
                <span>{submittingFeedback ? 'Transmitting...' : 'Dispatch to CD-Ops'}</span>
              </button>
            </div>
          </form>

          {/* Feedback Thread History */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] mono font-bold uppercase text-slate-700 dark:text-slate-300">
                Bilateral Feedback Threads &amp; Directives ({countryFeedback.length})
              </span>
              <span className="text-[8px] mono text-slate-500">
                Synced with CivicDuty Tenancy Console
              </span>
            </div>

            {countryFeedback.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-1">
                <MessageSquare size={24} className="mx-auto text-slate-400" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Bilateral Messages Yet</p>
                <p className="text-[10px] text-slate-500 max-w-sm mx-auto">
                  Use the dispatch form above to initiate a direct feedback or policy communication loop with CivicDuty Platform Engineers.
                </p>
              </div>
            ) : (
              countryFeedback.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] mono font-black text-teal-700 dark:text-teal-400">
                        {item.id}
                      </span>
                      <span className="text-[7.5px] mono px-1.5 py-0.2 rounded font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.priority.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[8px] mono text-slate-500">{item.timestamp}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.subject}
                    </h4>
                    <p className="text-[8.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                      From: <strong>{item.senderOfficer}</strong> · {item.senderMinistry} ({item.senderTitle})
                    </p>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      {item.message}
                    </p>
                  </div>

                  {/* CD-Ops Response */}
                  {item.cdOpsResponse ? (
                    <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-[10.5px] text-teal-950 dark:text-teal-200 space-y-1.5">
                      <div className="flex items-center justify-between text-[8px] mono font-bold text-teal-800 dark:text-teal-300">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-500" />
                          <span>{item.respondedBy || 'CivicDuty Platform Operations (CD-Ops)'}</span>
                          {item.actionType && (
                            <span className="ml-1 px-1 py-0.2 rounded bg-teal-500/20 text-[7.5px] uppercase">
                              {item.actionType}
                            </span>
                          )}
                        </span>
                        <span>{item.respondedAt}</span>
                      </div>
                      <p className="leading-snug whitespace-pre-line">{item.cdOpsResponse}</p>
                      {item.dispatchReceiptHash && (
                        <div className="text-[7.5px] mono text-slate-500 flex items-center gap-1 pt-1 border-t border-teal-500/20">
                          <span>Receipt Hash:</span>
                          <span className="truncate">{item.dispatchReceiptHash}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[8.5px] mono text-amber-700 dark:text-amber-400 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-300/40">
                      <Clock size={11} className="animate-spin" />
                      <span>Received by CD-Ops · Under bilateral technical review (SLA: &lt;4 hours)</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SOVEREIGN ACCORD & DATA SOVEREIGNTY */}
      {activeTab === 'accord' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] mono text-teal-800 dark:text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={14} /> Sovereign Framework &amp; Legal Principles
            </span>
            <span className="text-[8px] mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
              Non-Partisan Public Infrastructure
            </span>
          </div>

          <div className="space-y-3 text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Lock size={13} className="text-teal-600" /> 1. National Data Sovereignty Guarantees
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                CivicDuty operations respect the data sovereignty acts of each sovereign nation. All telemetry, audit logs, and citizen grievances are hosted in tier-3 national data centers (e.g. NITA-U in Uganda, Konza in Kenya, Galaxy Backbone in Nigeria, e-GA in Tanzania).
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Radio size={13} className="text-teal-600" /> 2. Zero-Cost USSD Citizen Channel (*3030#)
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Every sovereign partnership includes a zero-rated telecom bridge. Citizens in rural and urban areas report water outages, impassable roads, and extortion without requiring internet bundles or airtime.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Landmark size={13} className="text-teal-600" /> 3. Public Finance Management Act (PFMA) Automatic Escalation
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Reports automatically escalate across the 5 statutory tiers: from grassroots Parish Chiefs up to Sub-County SAS, District CAOs, Agency MDs, and Permanent Secretaries. No complaint can be quietly deleted or ignored.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-2xs">
              <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-teal-600" /> 4. Cryptographic Anti-Corruption Audit Seal
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Road works, culvert tenders, and health clinic drug stocks are cryptographically stamped. When accounting officers verify completed works, the digital hash is published to the public ledger for citizen counter-verification.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200 block">
                Ready to mount your country's statutory desk?
              </span>
              <span className="text-[9.5px] text-teal-700 dark:text-teal-400">
                Accounting officers with verified statutory codes can access their live dashboard immediately.
              </span>
            </div>
            <button
              onClick={() => go('gov_login')}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-[10px] mono font-bold uppercase transition-all whitespace-nowrap shadow-xs"
            >
              Go to Gov Desk →
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CALL TO PARTNERSHIP & FORMAL APPLICATION */}
      {activeTab === 'apply' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] mono text-teal-800 dark:text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Handshake size={14} /> Formal Sovereign MoU Request
            </span>
            <span className="text-[8px] mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
              Bilateral Pipeline
            </span>
          </div>

          <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Sovereign ministries of local government, public works, health, metropolitan city halls, and national anti-corruption agencies can initiate an official bilateral pact with CivicDuty Platform Operations.
          </p>

          <form onSubmit={handleApplyPartnership} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-black uppercase text-teal-700 dark:text-teal-300 mono">
                Partnership Application: {countryObj?.name || activeCountry}
              </span>
              <span className="text-[8px] mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Country Code: {activeCountry}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Lead Ministry or Statutory Agency *
                </label>
                <input
                  type="text"
                  value={appMinistry}
                  onChange={(e) => setAppMinistry(e.target.value)}
                  placeholder="e.g. Ministry of Local Government & Decentralisation"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Focal Accounting Officer Name *
                </label>
                <input
                  type="text"
                  value={appOfficer}
                  onChange={(e) => setAppOfficer(e.target.value)}
                  placeholder="e.g. Permanent Secretary or Executive Director"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="e.g. Permanent Secretary / Director"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Official Government Email *
                </label>
                <input
                  type="email"
                  value={appEmail}
                  onChange={(e) => setAppEmail(e.target.value)}
                  placeholder="e.g. ps@molg.gov.xx"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Official Contact Phone
                </label>
                <input
                  type="tel"
                  value={appPhone}
                  onChange={(e) => setAppPhone(e.target.value)}
                  placeholder="e.g. +256 414 123456"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Deployment Scope &amp; Target Jurisdictions
                </label>
                <input
                  type="text"
                  value={appScope}
                  onChange={(e) => setAppScope(e.target.value)}
                  placeholder="e.g. Nationwide Local Gov rollout across 135 districts and 10 cities"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[8.5px] mono text-slate-500 uppercase block font-bold mb-1">
                  Initial Desks Target
                </label>
                <input
                  type="number"
                  value={appUnits}
                  onChange={(e) => setAppUnits(Number(e.target.value))}
                  min={1}
                  max={5000}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-mono font-bold focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[8.5px] text-slate-500 font-mono flex items-center gap-1">
                <Shield size={11} className="text-teal-600" /> Transmitted securely to CivicDuty Internal Operations
              </span>
              <button
                type="submit"
                disabled={submittingApp}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs mono font-bold uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Handshake size={13} />
                <span>{submittingApp ? 'Submitting...' : 'Submit Partnership Accord Request'}</span>
              </button>
            </div>
          </form>

          {/* Existing Applications for this country */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] mono font-bold uppercase text-slate-700 dark:text-slate-300 block">
              Active Partnership Inquiries &amp; Pipeline ({applications.length})
            </span>
            <div className="space-y-1.5">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] mono flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{app.countryName}</span>
                      <span className="text-teal-700 dark:text-teal-400 font-bold">{app.id}</span>
                      <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[8.5px] text-slate-500 mt-0.5">
                      {app.leadMinistry} · Focal: {app.applicantName} ({app.applicantTitle})
                    </div>
                  </div>
                  <span className="text-[8.5px] text-slate-400">{app.submittedAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
