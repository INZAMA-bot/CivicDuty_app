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
  ChevronUp,
  Lock,
  Landmark,
  Terminal,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { GovFeedbackMessage } from '../../data/partnerships';
import { COUNTRIES } from '../../data/countries';
import { useApp } from '../../context/AppContext';

interface AiRecommendationOption {
  id: string;
  tierLabel: string;
  title: string;
  impactSummary: string;
  estimatedTurnaround: string;
  recommendedPrompt: string;
  officialReplyDraft: string;
}

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

  // AI Recommendation Engine States
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<string>('');
  const [aiModelUsed, setAiModelUsed] = useState<string>('');
  const [aiOptions, setAiOptions] = useState<AiRecommendationOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const countryObj = COUNTRIES[message.countryCode];
  const isAwaiting = message.status === 'sent' || !message.cdOpsResponse;

  const handleGenerateAiRecommendations = async () => {
    if (aiPanelOpen && aiOptions.length > 0) {
      setAiPanelOpen(false);
      return;
    }
    setAiPanelOpen(true);
    if (aiOptions.length > 0) return;

    setAiLoading(true);
    try {
      const res = await fetch('/api/cd-ops/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: message.id,
          countryCode: message.countryCode,
          countryName: message.countryName,
          senderMinistry: message.senderMinistry,
          senderOfficer: message.senderOfficer,
          senderTitle: message.senderTitle,
          subject: message.subject,
          message: message.message,
          priority: message.priority,
          superadminNotes: message.superadminNotes,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.recommendations)) {
        setAiDiagnosis(data.executiveDiagnosis || '');
        setAiModelUsed(data.modelUsed || 'gemini-3.8-flash');
        setAiOptions(data.recommendations);
        if (data.recommendations[1]) {
          setSelectedOptionId(data.recommendations[1].id);
        } else if (data.recommendations[0]) {
          setSelectedOptionId(data.recommendations[0].id);
        }
      } else {
        toast('Could not synthesize AI recommendations', 'amber');
      }
    } catch {
      toast('Error connecting to AI Recommendation Engine', 'rose');
    } finally {
      setAiLoading(false);
    }
  };

  const handleRefreshAiRecommendations = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/cd-ops/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: message.id,
          countryCode: message.countryCode,
          countryName: message.countryName,
          senderMinistry: message.senderMinistry,
          senderOfficer: message.senderOfficer,
          senderTitle: message.senderTitle,
          subject: message.subject,
          message: message.message,
          priority: message.priority,
          superadminNotes: message.superadminNotes,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.recommendations)) {
        setAiDiagnosis(data.executiveDiagnosis || '');
        setAiModelUsed(data.modelUsed || 'gemini-3.8-flash');
        setAiOptions(data.recommendations);
        toast('Refreshed AI engineering & prompt recommendations', 'emerald');
      }
    } catch {
      toast('Failed to refresh AI recommendations', 'rose');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyAiPrompt = (opt: AiRecommendationOption) => {
    navigator.clipboard.writeText(opt.recommendedPrompt);
    setCopiedPromptId(opt.id);
    toast(`Copied "${opt.tierLabel}" AI Studio prompt! Paste into AI Studio chat to execute.`, 'emerald');
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleDispatchSelectedReply = (opt: AiRecommendationOption) => {
    respondToGovFeedback(
      message.id,
      opt.officialReplyDraft,
      `${activeCdOpsOperator.name} (${activeCdOpsOperator.role})`,
      'actioned',
      opt.title,
      `Executed via AI Studio Prompt Recommendation (${opt.tierLabel})`
    );
    toast(`Official bilateral reply dispatched to ${message.senderOfficer}`, 'emerald');
  };

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

      {/* ==================================================================== */}
      {/* AI ENGINEERING & PROMPT RECOMMENDATION ENGINE (GEMINI POWERED)      */}
      {/* ==================================================================== */}
      <div className="rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] overflow-hidden">
        <div className="px-3 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Cpu size={13} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white">
                  AI Engineering &amp; Prompt Recommendation Engine
                </span>
                <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400">
                  · Superadmin Directive Solver
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                Generates 3 execution options &amp; copy-ready AI Studio prompts for your team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {aiOptions.length > 0 && (
              <button
                type="button"
                onClick={handleRefreshAiRecommendations}
                disabled={aiLoading}
                className="p-1.5 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Re-synthesize AI options"
              >
                <RefreshCw size={11} className={aiLoading ? 'animate-spin text-emerald-500' : ''} />
              </button>
            )}
            <button
              type="button"
              onClick={handleGenerateAiRecommendations}
              className="px-2.5 py-1.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10.5px] font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal size={11} />
              <span>
                {aiLoading
                  ? 'Synthesizing Options...'
                  : aiPanelOpen && aiOptions.length > 0
                  ? 'Hide AI Options'
                  : 'Generate AI Execution Prompts'}
              </span>
              {aiPanelOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          </div>
        </div>

        {aiPanelOpen && (
          <div className="p-3 border-t border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] space-y-3 animate-fade-in">
            {aiLoading ? (
              <div className="py-5 text-center space-y-1.5 font-mono">
                <RefreshCw size={16} className="animate-spin text-emerald-600 dark:text-emerald-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Analyzing National Superadmin Directive #[{message.id}]...
                </div>
                <div className="text-[10px] text-slate-500">
                  Synthesizing architectural options and optimal AI Studio prompts
                </div>
              </div>
            ) : (
              <>
                {aiDiagnosis && (
                  <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                        Executive Architectural Diagnosis
                      </span>
                      <span className="text-slate-400">{aiModelUsed}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {aiDiagnosis}
                    </p>
                  </div>
                )}

                {/* Option Selector Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {aiOptions.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer space-y-1 ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-slate-900 dark:text-white'
                            : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9.5px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase truncate">
                            {opt.tierLabel}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">
                            {opt.estimatedTurnaround}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {opt.title}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Option Detail & Copyable AI Studio Prompt */}
                {(() => {
                  const activeOpt =
                    aiOptions.find((o) => o.id === selectedOptionId) || aiOptions[0];
                  if (!activeOpt) return null;
                  const isPromptCopied = copiedPromptId === activeOpt.id;

                  return (
                    <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                            {activeOpt.tierLabel} · {activeOpt.estimatedTurnaround}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                            {activeOpt.title}
                          </h5>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyAiPrompt(activeOpt)}
                            className="px-2.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {isPromptCopied ? <Check size={11} /> : <Copy size={11} />}
                            <span>
                              {isPromptCopied
                                ? 'Prompt Copied to Clipboard!'
                                : 'Copy Prompt for AI Studio'}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDispatchSelectedReply(activeOpt)}
                            className="px-2.5 py-1.5 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-[10.5px] font-mono font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Send size={10} />
                            <span>Send Official Reply</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        {activeOpt.impactSummary}
                      </p>

                      {/* Copy-Ready Prompt Box */}
                      <div className="p-2.5 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                        <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400 uppercase">
                          <span>Recommended Prompt to Give AI Engineer (Click Copy Above)</span>
                          <span>AI Studio Build</span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-800 dark:text-slate-200 leading-relaxed select-all">
                          &ldquo;{activeOpt.recommendedPrompt}&rdquo;
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}
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
