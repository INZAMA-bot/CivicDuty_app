import React, { useState } from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Edit3,
  Copy,
  Check,
  ShieldCheck,
  ChevronDown,
  Lock,
  Landmark,
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
    const quickText = `CivicDuty Platform Operations (CD-Ops) formally acknowledges receipt of National Superadmin-endorsed directive #[${message.id}] from ${message.senderOfficer} (${message.senderTitle}, ${message.senderMinistry}). Technical reliability team assigned for immediate bilateral execution.`;
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
      className={`p-4 rounded-xl border transition-all space-y-3 bg-white dark:bg-[#161a22] ${
        isAwaiting
          ? 'border-amber-500/50'
          : 'border-[#e3e6ea] dark:border-[#262b36]'
      }`}
    >
      {/* Top Row: Country, Ticket ID, National Superadmin Seal, Priority, Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span
            className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36]"
            title={countryObj?.name || message.countryName}
          >
            {message.countryCode}
          </span>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {message.id}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {message.countryName}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Landmark size={10} />
                <span>
                  {message.endorsedBySuperadmin
                    ? `Vetted by ${message.endorsedBySuperadmin}`
                    : 'National Superadmin Channel'}
                </span>
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock size={10} />
              <span>Received: {message.timestamp}</span>
              {message.endorsedAt && (
                <>
                  <span>·</span>
                  <span>Endorsed: {message.endorsedAt}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPriorityMenu(!showPriorityMenu)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
                message.priority === 'statutory_directive'
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
                  : message.priority === 'urgent'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                  : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
              }`}
            >
              <span>{message.priority.replace(/_/g, ' ')}</span>
              <ChevronDown size={10} />
            </button>

            {showPriorityMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl shadow-xl z-20 py-1 text-[10px] font-mono font-semibold animate-fade-in">
                <div className="px-2.5 py-1 text-[9px] text-slate-400 uppercase">Set Statutory Priority</div>
                <button
                  onClick={() => {
                    updateGovFeedbackPriority(message.id, 'statutory_directive');
                    setShowPriorityMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-rose-600 dark:text-rose-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Statutory Directive (PFMA)
                </button>
                <button
                  onClick={() => {
                    updateGovFeedbackPriority(message.id, 'urgent');
                    setShowPriorityMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-amber-600 dark:text-amber-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Urgent Escalation
                </button>
                <button
                  onClick={() => {
                    updateGovFeedbackPriority(message.id, 'routine');
                    setShowPriorityMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-emerald-600 dark:text-emerald-400 hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116] flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Routine Operational Sync
                </button>
              </div>
            )}
          </div>

          {/* Status Text */}
          <span
            className={`text-[10px] font-mono font-semibold uppercase flex items-center gap-1 ${
              message.status === 'actioned'
                ? 'text-emerald-600 dark:text-emerald-400'
                : message.status === 'reviewed_by_cd_ops'
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {message.status === 'actioned' ? (
              <CheckCircle2 size={11} />
            ) : message.status === 'reviewed_by_cd_ops' ? (
              <Clock size={11} />
            ) : (
              <AlertTriangle size={11} />
            )}
            <span>
              {message.status === 'sent' ? 'Awaiting CD-Ops' : message.status.replace(/_/g, ' ')}
            </span>
          </span>
        </div>
      </div>

      {/* Ministry & Official Details Banner */}
      <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-900 dark:text-white text-xs">
              {message.senderMinistry}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-500">
            <User size={11} className="text-slate-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{message.senderOfficer}</span>
            <span>({message.senderTitle})</span>
          </div>
        </div>

        {message.superadminNotes && (
          <div className="text-[10.5px] font-mono text-emerald-700 dark:text-emerald-400 pt-1 border-t border-[#e3e6ea] dark:border-[#262b36]">
            National Node Head Endorsement Note: &ldquo;{message.superadminNotes}&rdquo;
          </div>
        )}

        {/* Official Contacts */}
        {(message.senderEmail || message.senderPhone || message.assignedStaff) && (
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-500 font-mono border-t border-[#e3e6ea] dark:border-[#262b36]">
            {message.senderEmail && (
              <span className="flex items-center gap-1">
                <Mail size={10} className="text-slate-400" />
                <span>{message.senderEmail}</span>
              </span>
            )}
            {message.senderPhone && (
              <span className="flex items-center gap-1">
                <Phone size={10} className="text-slate-400" />
                <span>{message.senderPhone}</span>
              </span>
            )}
            {message.assignedStaff && (
              <span className="ml-auto text-emerald-600 dark:text-emerald-400 font-semibold">
                Assigned: {message.assignedStaff}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Directive Subject & Body */}
      <div className="space-y-1">
        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          {message.subject}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {message.message}
        </p>
      </div>

      {/* Response Section */}
      {message.cdOpsResponse ? (
        <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-emerald-500/30 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck size={13} />
              <span>Official CD-Ops Operational Dispatch</span>
              {message.actionType && (
                <>
                  <span>·</span>
                  <span>{message.actionType}</span>
                </>
              )}
            </div>
            <div className="text-slate-500">
              Dispatched: {message.respondedAt}
            </div>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {message.cdOpsResponse}
          </p>

          {/* Internal Notes (Confidential) */}
          {message.internalNotes && (
            <div className="p-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono text-slate-600 dark:text-slate-400">
              <span className="font-semibold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Lock size={10} /> CD-Ops Internal Log:
              </span>
              <span>{message.internalNotes}</span>
            </div>
          )}

          {/* Dispatch Receipt Hash & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Operator:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {message.respondedBy || 'CD-Ops Reliability Lead'}
              </span>
              {message.dispatchReceiptHash && (
                <button
                  onClick={handleCopyHash}
                  className="px-2 py-0.5 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors cursor-pointer"
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
                className="px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-1 transition-colors cursor-pointer font-semibold"
              >
                {copiedText ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                <span>{copiedText ? 'Copied' : 'Copy Citation'}</span>
              </button>
              <button
                onClick={() => onOpenResponseModal(message)}
                className="px-2.5 py-1 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/15 bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-1 transition-colors cursor-pointer font-semibold"
              >
                <Edit3 size={11} />
                <span>Edit / Calibrate</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Awaiting Response Action Bar */
        <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                Official Response Required by CD-Ops
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Vetted by National Superadmin · SLA Target &lt; 4.0 Hours
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleQuickAcknowledge}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              Quick Acknowledge
            </button>
            <button
              onClick={() => onOpenResponseModal(message)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={12} />
              <span>Respond to National Node</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
