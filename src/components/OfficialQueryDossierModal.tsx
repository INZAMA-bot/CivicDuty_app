import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OfficialQuery, OfficialQueryStatus } from '../types';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Scale,
  Send,
  X,
  Lock,
  ExternalLink,
  UserCheck,
  ChevronRight,
  Printer
} from 'lucide-react';
import { timeAgo } from '../utils/helpers';
import { COUNTRIES } from '../data/countries';
import { ModalPortal } from './ModalPortal';

interface OfficialQueryDossierModalProps {
  query: OfficialQuery;
  onClose: () => void;
  onOpenAuditTrail?: (queryRef: string) => void;
}

export const OfficialQueryDossierModal: React.FC<OfficialQueryDossierModalProps> = ({
  query,
  onClose,
  onOpenAuditTrail,
}) => {
  const { user, toast, respondToOfficialQuery, determineOfficialQuery } = useApp();
  const countryCode = query.country || user?.country || 'UG';
  const countryObj = COUNTRIES[countryCode] || { name: countryCode, flag: '🏛️' };

  // Response form state
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [respOfficerName, setRespOfficerName] = useState(query.targetOfficer);
  const [respOfficerTitle, setRespOfficerTitle] = useState(query.targetTitle);
  const [respJustification, setRespJustification] = useState('');
  const [respActionTaken, setRespActionTaken] = useState('');
  const [respAttachmentNote, setRespAttachmentNote] = useState('');

  // Determination form state
  const [showDeterminationForm, setShowDeterminationForm] = useState(false);
  const [detVerdict, setDetVerdict] = useState<'resolved_exonerated' | 'remedial_directive' | 'escalated_igg'>('resolved_exonerated');
  const [detComments, setDetComments] = useState('');
  const [detPenalty, setDetPenalty] = useState('');

  // Calculate deadline countdown
  const deadlineMs = new Date(query.deadlineTimestamp).getTime();
  const nowMs = Date.now();
  const remainingHours = Math.round((deadlineMs - nowMs) / (1000 * 3600));
  const isOverdue = remainingHours < 0;

  const handleCopyMemo = () => {
    const memo = `
================================================================================
REPUBLIC OF ${countryObj.name.toUpperCase()} · LOCAL GOVERNMENT SERVICE COMMISSION
OFFICIAL SUPERVISORY ADMINISTRATIVE QUERY
Ref: ${query.queryRef}
Date of Dispatch: ${new Date(query.issuedAt).toUTCString()}
================================================================================
FROM:     ${query.issuerTitle} (${query.issuerName})
TO:       ${query.targetTitle} (${query.targetOfficer})
STATION:  ${query.targetUnit} (Scope: ${query.targetScope})
SUBJECT:  ${query.subject.toUpperCase()}
CATEGORY: ${query.category.replace(/_/g, ' ').toUpperCase()}

STATUTORY GROUNDS:
${query.grounds}

TELEMETRY & EVIDENTIARY CITATION:
${query.evidenceDetails || 'Continuous automated audit telemetry recorded by CivicDuty platform.'}

STATUTORY DIRECTIVE:
Under the provisions of the Public Service Standing Orders and Local Governments Act, 
you are hereby required to tender a written explanation in defense within ${query.deadlineHours} HOURS 
of receipt of this notice, failing which administrative interdiction and referral to the 
Inspectorate of Government (IGG) / Ethics & Anti-Corruption Commission shall proceed without further notice.

ISSUED BY AUTHORITY:
${query.issuerName}
${query.issuerTitle}
Cryptographic Audit Hash: SHA256-CD-${countryCode}-${query.queryRef.slice(-6)}
================================================================================
    `.trim();

    navigator.clipboard.writeText(memo);
    toast(`Copied Statutory Query Memo ${query.queryRef} to clipboard!`, 'emerald');
  };

  const handleQuickPrefillDefense = () => {
    setRespOfficerName(query.targetOfficer);
    setRespOfficerTitle(query.targetTitle);
    setRespJustification(
      `Operational delays were caused by sudden severe localized drainage blockages and unverified National Identification Numbers (NIN) from 14 beneficiary files which required manual physical verification with the Parish Development Committee.`
    );
    setRespActionTaken(
      `Conducted field inspection at 08:30 AM. Rectified 12 out of 14 records, dispatched emergency maintenance team to clear primary culverts, and cleared 6 overdue citizen tickets on CivicDuty live ledger.`
    );
    setRespAttachmentNote(`Field Inspection Sheet Ref: FIS-${query.country}-2026-09 signed by LC1 Chairperson.`);
    toast('Pre-filled sample defense statement for testing', 'teal');
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respJustification.trim() || !respActionTaken.trim()) {
      toast('Please provide both justification and corrective action taken', 'amber');
      return;
    }

    respondToOfficialQuery(query.id, {
      officerName: respOfficerName,
      officerTitle: respOfficerTitle,
      justification: respJustification,
      correctiveActionTaken: respActionTaken,
      attachmentNote: respAttachmentNote,
    });
    setShowResponseForm(false);
  };

  const handleSubmitDetermination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detComments.trim()) {
      toast('Please enter supervisor directives and determination comments', 'amber');
      return;
    }

    determineOfficialQuery(query.id, {
      verdict: detVerdict,
      comments: detComments,
      disciplinaryPenalty: detVerdict !== 'resolved_exonerated' ? detPenalty : undefined,
    });
    setShowDeterminationForm(false);
  };

  const statusBadge = (s: OfficialQueryStatus) => {
    switch (s) {
      case 'pending_response':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-black uppercase flex items-center gap-1">
            <Clock size={12} /> Pending Officer Response ({isOverdue ? 'EXPIRED' : `${remainingHours}h remaining`})
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 text-[10px] font-black uppercase flex items-center gap-1">
            <FileText size={12} /> Defense Submitted · Under Review
          </span>
        );
      case 'resolved_exonerated':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[10px] font-black uppercase flex items-center gap-1">
            <CheckCircle2 size={12} /> Fully Resolved &amp; Exonerated
          </span>
        );
      case 'remedial_directive':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] font-black uppercase flex items-center gap-1">
            <AlertTriangle size={12} /> 14-Day Remedial Watch Directive
          </span>
        );
      case 'escalated_igg':
        return (
          <span className="px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 text-[10px] font-black uppercase flex items-center gap-1">
            <ShieldAlert size={12} /> Escalated to IGG / Interdicted
          </span>
        );
    }
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs -z-10" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 max-w-2xl w-full space-y-4 shadow-2xl my-auto relative z-10 shrink-0">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-sm">
              <ShieldAlert size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="mono text-xs font-black text-rose-700 dark:text-rose-400">
                  {query.queryRef}
                </span>
                {statusBadge(query.status)}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1 leading-snug">
                {query.subject}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* STATUTORY PROGRESSION STEPPER */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>Statutory Lifecycle Stage</span>
            <span className="mono">Issued: {timeAgo(query.issuedAt)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold">
              <span className="text-[10px] block opacity-75">Step 1</span>
              <span>1. Dispatched</span>
            </div>
            <div className={`p-2 rounded-xl border font-bold ${
              query.response
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 animate-pulse'
            }`}>
              <span className="text-[10px] block opacity-75">Step 2</span>
              <span>2. Officer Defense</span>
            </div>
            <div className={`p-2 rounded-xl border font-bold ${
              query.determination
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              <span className="text-[10px] block opacity-75">Step 3</span>
              <span>3. Supervisory Ruling</span>
            </div>
          </div>
        </div>

        {/* PARTICULARS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Supervisory Issuing Authority
            </span>
            <div className="font-black text-slate-900 dark:text-white">{query.issuerName}</div>
            <div className="text-slate-600 dark:text-slate-400">{query.issuerTitle}</div>
            <div className="text-[10px] mono text-slate-500">Rank: Tier {query.issuerRank || 3} Accounting Desk</div>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Target Subordinate Station &amp; Appointee
            </span>
            <div className="font-black text-slate-900 dark:text-white">{query.targetOfficer}</div>
            <div className="text-slate-600 dark:text-slate-400">{query.targetTitle}</div>
            <div className="text-[10px] mono text-slate-500">Station: {query.targetUnit}</div>
          </div>
        </div>

        {/* GROUNDS & EVIDENCE */}
        <div className="p-3.5 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-black text-rose-950 dark:text-rose-200 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Scale size={13} /> Official Grounds of Inquiry:
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
              {query.category.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {query.grounds}
          </p>
          {query.evidenceDetails && (
            <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/60 text-[11px] text-slate-700 dark:text-slate-300">
              <strong>Evidentiary Proof:</strong> {query.evidenceDetails}
            </div>
          )}
        </div>

        {/* STEP 2: OFFICER WRITTEN DEFENSE DISPLAY OR FORM */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <UserCheck size={14} className="text-blue-600" />
              <span>Officer Formal Defense &amp; Remedial Action</span>
            </h4>
            {!query.response && !showResponseForm && (
              <button
                onClick={() => setShowResponseForm(true)}
                className="py-1 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                <span>Submit Written Defense</span>
                <ChevronRight size={12} />
              </button>
            )}
          </div>

          {query.response ? (
            <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[10px] mono text-blue-900 dark:text-blue-300">
                <span className="font-bold">
                  Responded by: {query.response.officerName} ({query.response.officerTitle})
                </span>
                <span>{timeAgo(query.response.respondedAt)}</span>
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white mb-0.5">Formal Justification:</strong>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/70 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  {query.response.justification}
                </p>
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white mb-0.5">Corrective Action Taken:</strong>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/70 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                  {query.response.correctiveActionTaken}
                </p>
              </div>
              {query.response.attachmentNote && (
                <div className="text-[10.5px] text-blue-800 dark:text-blue-300 font-medium">
                  <strong>Attached Documentary Evidence:</strong> {query.response.attachmentNote}
                </div>
              )}
            </div>
          ) : showResponseForm ? (
            <form onSubmit={handleSubmitResponse} className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-300 dark:border-blue-800 space-y-3 text-xs animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900 dark:text-blue-200">
                  Tender Statutory Written Defense (Subordinate Desk)
                </span>
                <button
                  type="button"
                  onClick={handleQuickPrefillDefense}
                  className="text-[10px] font-bold text-teal-700 dark:text-teal-400 hover:underline"
                >
                  ⚡ Quick Pre-fill
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Substantive Justification / Explanation of Delay:
                </label>
                <textarea
                  required
                  rows={2}
                  value={respJustification}
                  onChange={(e) => setRespJustification(e.target.value)}
                  placeholder="Explain why the SLA or grievance remained unresolved..."
                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Immediate Corrective Action Implemented:
                </label>
                <textarea
                  required
                  rows={2}
                  value={respActionTaken}
                  onChange={(e) => setRespActionTaken(e.target.value)}
                  placeholder="Specify field inspections, ticket resolutions, or citizen engagements completed today..."
                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Supporting Document / Evidence Reference:
                </label>
                <input
                  type="text"
                  value={respAttachmentNote}
                  onChange={(e) => setRespAttachmentNote(e.target.value)}
                  placeholder="e.g. Minutes of Parish Committee, Works Order #8921"
                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResponseForm(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <Send size={12} />
                  <span>Submit Statutory Defense</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>Waiting for substantive officer to file formal defense within deadline.</span>
              <button
                onClick={() => setShowResponseForm(true)}
                className="py-1 px-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold"
              >
                File Defense Now
              </button>
            </div>
          )}
        </div>

        {/* STEP 3: SUPERVISORY STATUTORY DETERMINATION */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Scale size={14} className="text-emerald-600" />
              <span>Supervisory Determination &amp; Ruling</span>
            </h4>
            {!showDeterminationForm && (
              <button
                onClick={() => setShowDeterminationForm(true)}
                className="py-1 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
              >
                <span>{query.determination ? 'Amend Ruling' : 'Issue Statutory Ruling'}</span>
                <ChevronRight size={12} />
              </button>
            )}
          </div>

          {query.determination && !showDeterminationForm ? (
            <div className={`p-3.5 rounded-2xl border space-y-2 text-xs ${
              query.determination.verdict === 'resolved_exonerated'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : query.determination.verdict === 'remedial_directive'
                ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
                : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
            }`}>
              <div className="flex items-center justify-between text-[10px] mono">
                <span className="font-bold">
                  Determined by: {query.determination.determinedBy} ({query.determination.determinedByTitle})
                </span>
                <span>{timeAgo(query.determination.determinedAt)}</span>
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white mb-0.5">Statutory Verdict:</strong>
                <span className="font-bold capitalize text-slate-800 dark:text-slate-100">
                  {query.determination.verdict.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white mb-0.5">Supervisory Directives:</strong>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-900/70 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                  {query.determination.comments}
                </p>
              </div>
              {query.determination.disciplinaryPenalty && (
                <div className="text-[11px] text-rose-800 dark:text-rose-300 font-bold">
                  Sanction Imposed: {query.determination.disciplinaryPenalty}
                </div>
              )}
            </div>
          ) : showDeterminationForm ? (
            <form onSubmit={handleSubmitDetermination} className="p-3.5 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-300 dark:border-emerald-800 space-y-3 text-xs animate-fade-in">
              <div className="font-bold text-emerald-950 dark:text-emerald-200">
                Execute Final Supervisory Determination (Accounting Officer)
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Legal Determination Verdict:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'resolved_exonerated', label: '✓ Exonerate & Resolve', desc: 'Defense accepted; no negligence.' },
                    { id: 'remedial_directive', label: '⚠️ Remedial Directive', desc: '14-day close watch mandated.' },
                    { id: 'escalated_igg', label: '⚖️ Escalate to IGG', desc: 'Referral for interdiction.' },
                  ].map((v) => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setDetVerdict(v.id as any)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs ${
                        detVerdict === v.id
                          ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="font-bold">{v.label}</div>
                      <div className="text-[10px] opacity-80">{v.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Supervisory Directives / Formal Finding:
                </label>
                <textarea
                  required
                  rows={2}
                  value={detComments}
                  onChange={(e) => setDetComments(e.target.value)}
                  placeholder="Record formal reasons for accepting defense, or instructions for 14-day watch..."
                  className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              {detVerdict !== 'resolved_exonerated' && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Administrative Sanction / Penalty (if applicable):
                  </label>
                  <input
                    type="text"
                    value={detPenalty}
                    onChange={(e) => setDetPenalty(e.target.value)}
                    placeholder="e.g. Warning letter placed in personnel file; 14-day watch period."
                    className="w-full p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeterminationForm(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 size={12} />
                  <span>Affix Supervisory Seal</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              No supervisory ruling affixed yet. Click "Issue Statutory Ruling" to close out inquiry.
            </div>
          )}
        </div>

        {/* BOTTOM UTILITY ACTIONS */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyMemo}
              className="py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <Copy size={13} />
              <span>Copy Official Memo</span>
            </button>
            {onOpenAuditTrail && (
              <button
                onClick={() => onOpenAuditTrail(query.queryRef)}
                className="py-1.5 px-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-800 dark:text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-teal-300 dark:border-teal-800"
              >
                <Lock size={13} />
                <span>View Cryptographic Audit Trail</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </ModalPortal>
  );
};
