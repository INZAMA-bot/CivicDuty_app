import React, { useState } from 'react';
import { Mail, CheckCircle2, FileText, Send, X, Download, ShieldCheck, BadgeCheck, FileCheck2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  senderName?: string;
  senderTitle?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = 'inzamarobin279@gmail.com',
  senderName = 'Inzama Robin',
  senderTitle = 'Lead Innovator & Founder, CivicDuty',
}) => {
  const { toast } = useApp();
  const [email, setEmail] = useState(defaultEmail);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [includeLetter, setIncludeLetter] = useState(true);
  const [includeDossier, setIncludeDossier] = useState(true);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast('Please enter a valid recipient email address', 'rose');
      return;
    }

    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast(`Official Dossier & Letter sent successfully to ${email}!`, 'emerald');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 text-slate-800 dark:text-slate-100 font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-amber-500/10 border border-amber-600/20 dark:border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
            <Mail size={22} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight font-mono">
              Email Official Submissions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct Ministerial Submission & Product Dossier Dispatch
            </p>
          </div>
        </div>

        {!sent ? (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Recipient Input */}
            <div>
              <label className="block text-xs font-mono font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                Recipient Email Address:
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white font-mono focus:border-amber-600 focus:outline-none transition-colors"
                  placeholder="inzamarobin279@gmail.com"
                  required
                />
              </div>
            </div>

            {/* Attachments Selection */}
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-bold">
                Attached Official Documents (.PDF):
              </span>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeLetter}
                    onChange={(e) => setIncludeLetter(e.target.checked)}
                    className="accent-amber-700 w-4 h-4 rounded"
                  />
                  <FileText size={16} className="text-amber-700 dark:text-amber-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Ministerial Submission Letter</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">CivicDuty_Submission_Letter_Inzama_Robin.pdf</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-amber-600/15 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-600/30 font-bold">
                  PDF
                </span>
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={includeDossier}
                    onChange={(e) => setIncludeDossier(e.target.checked)}
                    className="accent-teal-600 w-4 h-4 rounded"
                  />
                  <FileText size={16} className="text-teal-600 dark:text-teal-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Master Dossier v6.1</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">CivicDuty_Master_Dossier_v6.1_Uganda.pdf</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-teal-500/20 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-500/30 font-bold">
                  PDF
                </span>
              </label>
            </div>

            {/* Sender Metadata Box */}
            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-950/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 space-y-1">
              <div><span className="text-slate-500">Sender:</span> <strong className="text-slate-800 dark:text-slate-300">{senderName}</strong> ({senderTitle})</div>
              <div><span className="text-slate-500">Protocol:</span> CivicDuty Secure Ministerial Dispatch System</div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending || (!includeLetter && !includeDossier)}
                className="bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all active:scale-95"
              >
                {sending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Email...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Package to Email</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Sent Confirmation Screen */
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase font-mono tracking-tight">
                Package Transmitted!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Official Submission PDFs dispatched to <strong className="text-amber-700 dark:text-amber-400 font-mono">{email}</strong>
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl text-left font-mono text-xs space-y-1 text-slate-800 dark:text-slate-300">
              <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-bold border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-2">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> TRANSMISSION AUDIT RECEIPT</span>
                <span>STATUS: DELIVERED</span>
              </div>
              <div>• Submission Letter: CivicDuty_Submission_Letter_Inzama_Robin_6th_August_2026.pdf</div>
              <div>• Master Dossier: CivicDuty_Master_Dossier_v6.1_Uganda_6th_August_2026.pdf</div>
              <div className="text-[10px] text-slate-500 pt-1">Timestamp: {new Date().toLocaleString()}</div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="/CivicDuty_Submission_Letter_Inzama_Robin_6th_August_2026.pdf"
                download="CivicDuty_Submission_Letter_Inzama_Robin_6th_August_2026.pdf"
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-800 dark:text-amber-400 border border-slate-300 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <Download size={14} /> Letter PDF
              </a>
              <a
                href="/CivicDuty_Master_Dossier_v6.1_Uganda_6th_August_2026.pdf"
                download="CivicDuty_Master_Dossier_v6.1_Uganda_6th_August_2026.pdf"
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-400 border border-slate-300 dark:border-slate-700 px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <Download size={14} /> Dossier PDF
              </a>
              <button
                onClick={() => {
                  setSent(false);
                  onClose();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
