import React, { useState } from 'react';
import {
  X,
  Send,
  Building2,
  Globe2,
  AlertTriangle,
  Radio,
  FileSignature,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CountryCode } from '../../types';
import { COUNTRIES } from '../../data/countries';
import { GovFeedbackMessage } from '../../data/partnerships';

interface CdOpsNewDirectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CdOpsNewDirectiveModal: React.FC<CdOpsNewDirectiveModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    addGovFeedbackMessage,
    cdOpsStaffList,
    activeCdOpsOperator,
    toast,
  } = useApp();

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('UG');
  const [recipientMinistry, setRecipientMinistry] = useState('');
  const [recipientOfficer, setRecipientOfficer] = useState('');
  const [recipientTitle, setRecipientTitle] = useState('Permanent Secretary / Accounting Officer');
  const [subject, setSubject] = useState('');
  const [priority, setFPriority] = useState<'routine' | 'urgent' | 'statutory_directive'>('routine');
  const [messageBody, setMessageBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentCountryObj = COUNTRIES[selectedCountry];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !messageBody.trim() || !recipientMinistry.trim()) {
      toast('Please complete all required fields for the official dispatch.', 'red');
      return;
    }

    setIsSubmitting(true);
    const id = `DISPATCH-CD-${selectedCountry}-${Date.now().toString().slice(-4)}`;
    const newMsg: GovFeedbackMessage = {
      id,
      countryCode: selectedCountry,
      countryName: currentCountryObj.name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      senderMinistry: recipientMinistry.trim(),
      senderTitle: recipientTitle.trim() || 'Accounting Officer',
      senderOfficer: recipientOfficer.trim() || 'Hon. Accounting Officer',
      subject: subject.trim(),
      message: messageBody.trim(),
      priority,
      status: 'actioned',
      actionType: 'CD-Ops Sovereign Advisory Issued',
      cdOpsResponse: `Formal operational directive originated by CivicDuty Platform Operations (${activeCdOpsOperator.name}, ${activeCdOpsOperator.role}). Telemetry active on national gateway node ${selectedCountry}-01.`,
      respondedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      respondedBy: `${activeCdOpsOperator.name} (${activeCdOpsOperator.role})`,
      dispatchReceiptHash: '0x' + Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };

    setTimeout(() => {
      addGovFeedbackMessage(newMsg);
      setIsSubmitting(false);
      toast(`Official advisory dispatched to ${recipientMinistry.trim()} (${currentCountryObj.name}).`, 'emerald');
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-slate-900 text-slate-100 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <FileSignature size={18} />
            </div>
            <div>
              <span className="text-[9.5px] mono font-bold uppercase tracking-wider text-teal-400">
                CivicDuty Staff Dispatch Composer
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Initiate Sovereign Directive / Technical Advisory
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-slate-800 dark:text-slate-100">
          {/* Target Country & Ministry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                Target Sovereign Nation *
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
              >
                {Object.entries(COUNTRIES).map(([code, c]) => (
                  <option key={code} value={code}>
                    {c.flag} {c.name} ({code})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                Target Line Ministry / Department *
              </label>
              <input
                type="text"
                value={recipientMinistry}
                onChange={(e) => setRecipientMinistry(e.target.value)}
                placeholder="e.g. Ministry of Local Government, Council of Governors, etc."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                required
              />
            </div>
          </div>

          {/* Target Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                Designated Accounting Officer Name
              </label>
              <input
                type="text"
                value={recipientOfficer}
                onChange={(e) => setRecipientOfficer(e.target.value)}
                placeholder="e.g. Ben Kumumanya / Dr. Mary Chege"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                Official Title / Bureaucratic Role
              </label>
              <input
                type="text"
                value={recipientTitle}
                onChange={(e) => setRecipientTitle(e.target.value)}
                placeholder="e.g. Permanent Secretary, CEC Member Transport, etc."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Subject & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                Dispatch Subject / Scope *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Scheduled *3030# USSD Gateway Maintenance & Grassroots Node Audit"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
                Directive Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setFPriority(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="routine">Routine Advisory</option>
                <option value="urgent">Urgent Operational Notice</option>
                <option value="statutory_directive">Statutory Directive (PFMA)</option>
              </select>
            </div>
          </div>

          {/* Message Body */}
          <div>
            <label className="text-[9px] mono text-slate-500 uppercase block font-bold mb-1">
              Official Directive / Technical Advisory Body *
            </label>
            <textarea
              rows={4}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder="State the formal technical parameters, upcoming maintenance schedule, SLA audit reports, or inter-governmental coordination notice..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:border-teal-500 leading-relaxed"
              required
            />
          </div>

          {/* Operator Signature Preview */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">✍️</span>
              <div>
                <span className="text-[9px] mono text-slate-500 uppercase block">Dispatching Operator</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {activeCdOpsOperator.name} · {activeCdOpsOperator.role}
                </span>
              </div>
            </div>
            <span className="text-[9px] mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
              Verified CD-Ops Seal
            </span>
          </div>

          {/* Footer Buttons */}
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
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs mono font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Sovereign Directive'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
