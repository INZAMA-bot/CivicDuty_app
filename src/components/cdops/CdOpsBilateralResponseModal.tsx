import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Clock,
  ShieldAlert,
  FileCheck,
  Building2,
  User,
  Mail,
  Phone,
  Hash,
  Radio,
  FileText,
  Copy,
  Check,
  Landmark,
} from 'lucide-react';
import {
  GovFeedbackMessage,
  CD_OPS_RESOLUTION_TEMPLATES,
  CdOpsResolutionTemplate,
  CdOpsStaffMember,
} from '../../data/partnerships';
import { useApp } from '../../context/AppContext';

interface CdOpsBilateralResponseModalProps {
  message: GovFeedbackMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CdOpsBilateralResponseModal: React.FC<CdOpsBilateralResponseModalProps> = ({
  message,
  isOpen,
  onClose,
}) => {
  const {
    respondToGovFeedback,
    cdOpsStaffList,
    activeCdOpsOperator,
    setActiveCdOpsOperator,
    toast,
  } = useApp();

  const [responseText, setResponseText] = useState('');
  const [responderTitle, setResponderTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'reviewed_by_cd_ops' | 'actioned'>('actioned');
  const [actionType, setActionType] = useState('SLA Window Calibrated');
  const [internalNotes, setInternalNotes] = useState('');
  const [notifySms, setNotifySms] = useState(true);
  const [notifyPortal, setNotifyPortal] = useState(true);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset form when modal opens with a message
  useEffect(() => {
    if (message) {
      if (message.cdOpsResponse) {
        setResponseText(message.cdOpsResponse);
        setResponderTitle(message.respondedBy || `${activeCdOpsOperator.name} (${activeCdOpsOperator.role})`);
        setSelectedStatus(message.status === 'actioned' ? 'actioned' : 'reviewed_by_cd_ops');
        setActionType(message.actionType || 'Statutory Action Taken');
        setInternalNotes(message.internalNotes || '');
      } else {
        // Pre-populate with formal official salutation
        const formalSalutation = `Attention: ${message.senderTitle} ${message.senderOfficer}, ${message.senderMinistry} (${message.countryName}).\n\nCivicDuty Platform Operations (CD-Ops) formal dispatch regarding "${message.subject}":\n\n`;
        setResponseText(formalSalutation);
        setResponderTitle(`${activeCdOpsOperator.name} (${activeCdOpsOperator.role})`);
        setSelectedStatus(message.priority === 'statutory_directive' ? 'actioned' : 'reviewed_by_cd_ops');
        setActionType(
          message.priority === 'statutory_directive'
            ? 'Statutory Directive Enacted'
            : message.subject.toLowerCase().includes('ussd')
            ? 'Telecom Gateway Scaled'
            : message.subject.toLowerCase().includes('sla')
            ? 'SLA Window Calibrated'
            : 'Operational Directives Deployed'
        );
        setInternalNotes('');
      }
      setActiveTemplateId(null);
    }
  }, [message, activeCdOpsOperator]);

  if (!isOpen || !message) return null;

  const handleApplyTemplate = (tmpl: CdOpsResolutionTemplate) => {
    setActiveTemplateId(tmpl.id);
    setActionType(tmpl.actionType);
    setSelectedStatus(tmpl.defaultStatus);

    const formalHeader = `Attention: ${message.senderTitle} ${message.senderOfficer}, ${message.senderMinistry} (Republic of ${message.countryName}).\nRef: Sovereign Directive Resolution #[${message.id}]\n\n`;
    const body = tmpl.textBuilder(message);
    const formalClosing = `\n\nCertified under the CivicDuty Sovereign Data & Infrastructure Accord. Dispatch hash will be recorded in the bilateral national ledger.`;

    setResponseText(formalHeader + body + formalClosing);
    toast(`Applied preset template: ${tmpl.title}`, 'emerald');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) {
      toast('Please provide a formal response message.', 'red');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      respondToGovFeedback(
        message.id,
        responseText,
        responderTitle.trim() || `${activeCdOpsOperator.name} (${activeCdOpsOperator.role})`,
        selectedStatus,
        actionType,
        internalNotes.trim()
      );
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(responseText);
    setCopiedPreview(true);
    toast('Copied official response dispatch to clipboard.', 'emerald');
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Ribbon */}
        <div className="bg-slate-900 text-slate-100 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">
                  CD-Ops Bilateral Response Engine
                </span>
                <span className="text-[9px] mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                  {message.id}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>Dispatch Resolution to {message.countryName} Officials</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-slate-800 dark:text-slate-100">
          {/* Target Official Credential Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Landmark size={16} className="text-amber-500 shrink-0" />
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-slate-100">
                    {message.senderMinistry}
                  </div>
                  <div className="text-[10px] mono text-slate-500">
                    Republic of {message.countryName} ({message.countryCode})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[8px] mono uppercase px-2 py-0.5 rounded font-bold ${
                    message.priority === 'statutory_directive'
                      ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                      : message.priority === 'urgent'
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-500/30'
                  }`}
                >
                  {message.priority.replace(/_/g, ' ')}
                </span>
                <span className="text-[8px] mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                  {message.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Officer details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10.5px]">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <User size={13} className="text-slate-400 shrink-0" />
                <span className="font-semibold">{message.senderOfficer}</span>
                <span className="text-[9px] mono text-slate-500">({message.senderTitle})</span>
              </div>
              {message.senderEmail && (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 truncate">
                  <Mail size={13} className="text-slate-400 shrink-0" />
                  <span className="font-mono text-[9.5px] truncate">{message.senderEmail}</span>
                </div>
              )}
              {message.senderPhone && (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Phone size={13} className="text-slate-400 shrink-0" />
                  <span className="font-mono text-[9.5px]">{message.senderPhone}</span>
                </div>
              )}
            </div>

            {/* Inbound Request Text Excerpt */}
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] leading-relaxed">
              <span className="text-[8.5px] mono font-bold uppercase text-slate-500 block mb-0.5">
                Official Inbound Directive: "{message.subject}"
              </span>
              <p className="text-slate-700 dark:text-slate-300">{message.message}</p>
            </div>
          </div>

          {/* Quick-Apply Bureaucratic Response Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] mono font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1">
                <FileText size={12} className="text-amber-500" />
                Respectful Bureaucratic Templates (One-Click Auto-Fill)
              </span>
              <span className="text-[8.5px] mono text-slate-500">
                Tailored for {message.countryName} Sovereign Desks
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CD_OPS_RESOLUTION_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] mono font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                    activeTemplateId === tmpl.id
                      ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-300 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{tmpl.title}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Resolution Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Formal Operational Dispatch Body *
                </label>
                <button
                  type="button"
                  onClick={handleCopyPreview}
                  className="text-[9px] mono text-slate-500 hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedPreview ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  <span>{copiedPreview ? 'Copied' : 'Copy Dispatch Text'}</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Draft respectful, official resolution with clear technical metrics, SLA confirmations, and jurisdictional references..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            {/* Action Type, Status & Sign-off Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                  Resolution Action Type
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="SLA Window Calibrated">SLA Window Calibrated</option>
                  <option value="Telecom Gateway Scaled">Telecom Gateway Scaled (*3030#)</option>
                  <option value="Grassroots Field Sync Enabled">Grassroots Field Sync Enabled</option>
                  <option value="Sovereign Audit Cert Minted">Sovereign Audit Cert Minted</option>
                  <option value="Technical Evaluation In Progress">Technical Evaluation In Progress</option>
                  <option value="Localization Engine Updated">Localization Engine Updated</option>
                  <option value="Security Whitelist Deployed">Security Whitelist Deployed</option>
                  <option value="Bilateral Working Group Convened">Bilateral Working Group Convened</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                  Ticket Status Progression
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="actioned">Actioned &amp; Certified in Sovereign Ledger</option>
                  <option value="reviewed_by_cd_ops">Under Technical Evaluation (In Progress)</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                  CD-Ops Dispatching Officer
                </label>
                <select
                  value={activeCdOpsOperator.id}
                  onChange={(e) => {
                    const found = cdOpsStaffList.find((s) => s.id === e.target.value);
                    if (found) {
                      setActiveCdOpsOperator(found);
                      setResponderTitle(`${found.name} (${found.role})`);
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {cdOpsStaffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.dutyStation.split('&')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Confidential Internal Engineering Notes */}
            <div>
              <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1 flex items-center justify-between">
                <span>Internal Engineering Notes (Confidential to CD-Ops Team)</span>
                <span className="text-[8px] lowercase font-normal">not visible to ministry officials</span>
              </label>
              <input
                type="text"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="e.g. Verified with Telco NOC at 14:20 UTC. Node UG-02 load 18%. Validated on staging environment."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Bilateral Delivery Channels */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={notifyPortal}
                    onChange={(e) => setNotifyPortal(e.target.checked)}
                    className="accent-amber-600 rounded cursor-pointer"
                  />
                  <span className="text-[10px] mono font-bold text-slate-700 dark:text-slate-300">
                    Publish to Sovereign Gov Portal Inbox
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={notifySms}
                    onChange={(e) => setNotifySms(e.target.checked)}
                    className="accent-amber-600 rounded cursor-pointer"
                  />
                  <span className="text-[10px] mono font-bold text-slate-700 dark:text-slate-300">
                    Dispatch SMS via *3030# Gateway
                  </span>
                </label>
              </div>
              <span className="text-[9px] mono text-slate-500 flex items-center gap-1">
                <Radio size={12} className="text-emerald-500" />
                Channel SLA: &lt; 30 sec delivery
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs mono font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs mono font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send size={14} />
                <span>
                  {isSubmitting
                    ? 'Dispatching Resolution...'
                    : `Dispatch Resolution to ${message.senderMinistry.slice(0, 24)}`}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
