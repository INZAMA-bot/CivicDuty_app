import React, { useState } from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  MessageSquare,
  Send,
  Edit3,
  Copy,
  Check,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { GovFeedbackMessage } from '../../data/partnerships';
import { COUNTRIES } from '../../data/countries';
import { useApp } from '../../context/AppContext';

interface CdOpsOfficialDirectiveCardProps {
  message: GovFeedbackMessage;
  onOpenResponseModal: (msg: GovFeedbackMessage) => void;
}

export const CdOpsOfficialDirectiveCard: React.FC<CdOpsOfficialDirectiveCardProps> = ({
  message,
  onOpenResponseModal,
}) => {
  const { respondToGovFeedback, updateGovFeedbackPriority, toast, activeCdOpsOperator } = useApp();
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);

  const countryObj = COUNTRIES[message.countryCode];
  const isAwaiting = message.status === 'sent' || !message.cdOpsResponse;

  const handleCopyHash = () => {
    if (message.dispatchReceiptHash) {
      navigator.clipboard.writeText(message.dispatchReceiptHash);
      setCopiedHash(true);
      toast('Copied SHA-256 dispatch receipt hash.', 'emerald');
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleCopyCitation = () => {
    const citation = `[Official Dispatch] ${message.senderMinistry} (${message.countryName}) · Re: ${message.subject}\nRef: ${message.id} · Response by: ${message.respondedBy || 'CD-Ops'}\n"${message.cdOpsResponse || ''}"`;
    navigator.clipboard.writeText(citation);
    setCopiedText(true);
    toast('Copied official dispatch citation.', 'emerald');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleQuickAcknowledge = () => {
    const quickText = `CivicDuty Platform Operations (CD-Ops) formally acknowledges receipt of directive #[${message.id}] from ${message.senderOfficer} (${message.senderTitle}, ${message.senderMinistry}). Technical reliability team assigned for immediate bilateral evaluation. Formal telemetry dispatch pending within statutory SLA.`;
    respondToGovFeedback(
      message.id,
      quickText,
      `${activeCdOpsOperator.name} (${activeCdOpsOperator.role})`,
      'reviewed_by_cd_ops',
      'Technical Evaluation In Progress'
    );
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all space-y-3 bg-white dark:bg-slate-900 ${
        isAwaiting
          ? 'border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
          : 'border-slate-200 dark:border-slate-800 shadow-xs'
      }`}
    >
      {/* Top Row: Country, Ticket ID, Status, Priority */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl" title={countryObj?.name || message.countryName}>
            {countryObj?.flag || '🌐'}
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-amber-700 dark:text-amber-400">
                {message.id}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {message.countryName}
              </span>
            </div>
            <div className="text-[9.5px] mono text-slate-500 flex items-center gap-1">
              <Clock size={10} />
              <span>Received: {message.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className={`px-2 py-0.5 rounded-lg text-[8px] mono uppercase font-bold flex items-center gap-1 transition-all cursor-pointer ${
                message.priority === 'statutory_directive'
                  ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/40'
                  : message.priority === 'urgent'
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40'
                  : 'bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-500/40'
              }`}
            >
              <span>{message.priority.replace(/_/g, ' ')}</span>
              <ChevronDown size={10} />
            </button>

            {showPriorityMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 text-[9px] mono font-bold animate-fade-in">
                <div className="px-2 py-1 text-[8px] text-slate-400 uppercase">Set Statutory Priority</div>
                <button
                  onClick={() => {
                    updateGovFeedbackPriority(message.id, 'statutory_directive');
                    setShowPriorityMenu(false);
                  }}
                  className="w-full px-2 py-1.5 text-left text-rose-600 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5"
                >
                  🔴 Statutory Directive (PFMA)
                </button>
                <button
                  onClick={() => {
                    updateGovFeedbackPriority(message.id, 'urgent');
                    setShowPriorityMenu(false);
                  }}
                  className="w-full px-2 py-1.5 text-left text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5"
                >
                  🟡 Urgent Escalation
                </button>
                <button
                  onClick={() => {
                    updateGovFeedbackPriority(message.id, 'routine');
                    setShowPriorityMenu(false);
                  }}
                  className="w-full px-2 py-1.5 text-left text-teal-600 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5"
                >
                  🟢 Routine Operational Sync
                </button>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <span
            className={`px-2 py-0.5 rounded-lg text-[8px] mono font-bold uppercase flex items-center gap-1 ${
              message.status === 'actioned'
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                : message.status === 'reviewed_by_cd_ops'
                ? 'bg-sky-500/20 text-sky-700 dark:text-sky-400 border border-sky-500/30'
                : 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse'
            }`}
          >
            {message.status === 'actioned' ? (
              <CheckCircle2 size={10} />
            ) : message.status === 'reviewed_by_cd_ops' ? (
              <Clock size={10} />
            ) : (
              <AlertTriangle size={10} />
            )}
            <span>
              {message.status === 'sent' ? 'Awaiting CD-Ops Reply' : message.status.replace(/_/g, ' ')}
            </span>
          </span>
        </div>
      </div>

      {/* Ministry & Official Details Banner */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <Building2 size={14} className="text-amber-600 shrink-0" />
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
              {message.senderMinistry}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] mono text-slate-500">
            <User size={12} className="text-slate-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{message.senderOfficer}</span>
            <span>({message.senderTitle})</span>
          </div>
        </div>

        {/* Official Contacts */}
        {(message.senderEmail || message.senderPhone) && (
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 mono border-t border-slate-200 dark:border-slate-800/60">
            {message.senderEmail && (
              <span className="flex items-center gap-1">
                <Mail size={11} className="text-slate-400" />
                <span>{message.senderEmail}</span>
              </span>
            )}
            {message.senderPhone && (
              <span className="flex items-center gap-1">
                <Phone size={11} className="text-slate-400" />
                <span>{message.senderPhone}</span>
              </span>
            )}
            {message.assignedStaff && (
              <span className="ml-auto text-amber-700 dark:text-amber-400 font-bold">
                Assigned: {message.assignedStaff}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Directive Subject & Body */}
      <div className="space-y-1">
        <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
          {message.subject}
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {message.message}
        </p>
      </div>

      {/* Response Section */}
      {message.cdOpsResponse ? (
        <div className="p-3.5 rounded-xl bg-teal-500/5 dark:bg-teal-950/30 border border-teal-500/30 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-[9.5px] mono">
            <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
              <ShieldCheck size={14} className="text-teal-600 dark:text-teal-400" />
              <span>Official CD-Ops Operational Dispatch</span>
              {message.actionType && (
                <span className="px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-900 dark:text-teal-200 border border-teal-500/30 font-bold text-[8px]">
                  {message.actionType}
                </span>
              )}
            </div>
            <div className="text-[8.5px] text-slate-500 dark:text-slate-400">
              Dispatched: {message.respondedAt}
            </div>
          </div>

          <p className="text-xs text-teal-950 dark:text-teal-100 leading-relaxed font-sans whitespace-pre-line">
            {message.cdOpsResponse}
          </p>

          {/* Internal Notes (Confidential) */}
          {message.internalNotes && (
            <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-dashed border-amber-500/40 text-[9.5px] mono text-amber-800 dark:text-amber-300">
              <span className="font-bold block text-[8px] uppercase text-amber-600">
                🔒 CD-Ops Confidential Internal Log:
              </span>
              <span>{message.internalNotes}</span>
            </div>
          )}

          {/* Dispatch Receipt Hash & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-teal-500/20 text-[9px] mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Officer:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {message.respondedBy || 'CD-Ops Reliability Lead'}
              </span>
              {message.dispatchReceiptHash && (
                <button
                  onClick={handleCopyHash}
                  className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-slate-500 hover:text-teal-600 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Click to copy SHA-256 Receipt"
                >
                  <span className="truncate max-w-[110px]">{message.dispatchReceiptHash}</span>
                  {copiedHash ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={handleCopyCitation}
                className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 transition-colors cursor-pointer font-bold"
              >
                {copiedText ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                <span>{copiedText ? 'Copied' : 'Copy Citation'}</span>
              </button>
              <button
                onClick={() => onOpenResponseModal(message)}
                className="px-2.5 py-1 rounded-lg text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1 transition-colors cursor-pointer font-bold"
              >
                <Edit3 size={11} />
                <span>Edit / Calibrate</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Awaiting Response Action Bar */
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-600 animate-pulse text-sm">⚠️</span>
            <div>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                Official Response Required by CD-Ops Staff
              </span>
              <span className="text-[9px] mono text-slate-600 dark:text-slate-400">
                SLA Statutory Window: Standard &lt; 4.0 Hours
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleQuickAcknowledge}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs mono font-bold transition-colors cursor-pointer"
            >
              Quick Acknowledge
            </button>
            <button
              onClick={() => onOpenResponseModal(message)}
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs mono font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={12} />
              <span>Respond to Official</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
