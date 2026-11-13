import React, { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  HeartHandshake,
  X,
  Send,
  Copy,
  Check,
  Mail,
  Building2,
  Smartphone,
  Globe,
  CheckCircle2,
  Sparkles,
  FlaskConical,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES } from '../data/countries';
import { TesterFeedbackCategory } from '../types';
import { submitTesterFeedback, trackVisitorInteraction } from '../services/analyticsService';

interface TesterFeedbackWidgetProps {
  isSplash?: boolean;
}

const FEEDBACK_CATEGORIES: TesterFeedbackCategory[] = [
  'Governance Hierarchy',
  'Local Brands / Utilities',
  'UI / UX Suggestion',
  'Bug Report',
  'Partnership Inquiry',
];

const DEEP_CURATED_COUNTRIES = new Set(['UG', 'RW', 'KE', 'NG', 'GH', 'TZ', 'ZA']);

export const TesterFeedbackWidget: React.FC<TesterFeedbackWidgetProps> = ({ isSplash = false }) => {
  const { selectedCountry, user, view, getCountryStatus, toast } = useApp();
  const activeCountry = (user?.country || selectedCountry || 'UG') as keyof typeof COUNTRIES;
  const countryInfo = COUNTRIES[activeCountry] || { name: String(activeCountry), code: activeCountry };
  const launchStatus = getCountryStatus(activeCountry);
  const isAdaptiveTemplate = !DEEP_CURATED_COUNTRIES.has(String(activeCountry));

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feedback' | 'fund'>('feedback');
  const [category, setCategory] = useState<TesterFeedbackCategory>('Governance Hierarchy');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOk, setSubmittedOk] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenFund = () => {
      setIsOpen(true);
      setActiveTab('fund');
      trackVisitorInteraction('crowdfund_view', `Opened Crowdfund CTA (${String(activeCountry)})`, String(activeCountry), {
        countryCode: activeCountry,
      });
    };
    window.addEventListener('civicduty_open_crowdfund', handleOpenFund);
    return () => window.removeEventListener('civicduty_open_crowdfund', handleOpenFund);
  }, [activeCountry]);

  const handleToggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      trackVisitorInteraction('feedback_open', `Opened Beta Chatbox (${String(activeCountry)})`, view, {
        countryCode: activeCountry,
      });
    }
  };

  const handleTabSwitch = (tab: 'feedback' | 'fund') => {
    setActiveTab(tab);
    if (tab === 'fund') {
      trackVisitorInteraction('crowdfund_view', `Viewed Fund & Partner (${String(activeCountry)})`, String(activeCountry), {
        countryCode: activeCountry,
      });
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast('Please share your UX note or local correction before sending.', 'amber');
      return;
    }
    setSubmitting(true);
    try {
      await submitTesterFeedback({
        countryCode: activeCountry,
        countryName: countryInfo.name,
        view,
        category,
        message: message.trim(),
        contact: contact.trim() || undefined,
      });
      setMessage('');
      setSubmittedOk(true);
      toast(`Feedback logged for ${countryInfo.name}. Thank you for building with us.`, 'emerald');
      setTimeout(() => setSubmittedOk(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRail = (id: string, value: string, label: string, isPartner = false) => {
    navigator.clipboard?.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
    trackVisitorInteraction(
      isPartner ? 'partner_click' : 'crowdfund_copy',
      `Copied ${label} (${String(activeCountry)})`,
      String(activeCountry),
      { countryCode: activeCountry, rail: id }
    );
    toast(`${label} copied: ${value}`, 'emerald');
  };

  // Position cleanly above the fixed 60px mobile bottom tab bar when inside workspace
  const positionClass = isSplash ? 'bottom-4 right-3.5 sm:bottom-5 sm:right-5' : 'bottom-20 md:bottom-5 right-3.5 sm:right-5';

  return (
    <div className={`fixed ${positionClass} z-40 flex flex-col items-end gap-2.5 font-sans`}>
      {isOpen && (
        <div
          role="dialog"
          aria-label="Public Beta UX Feedback and Crowdfunding"
          className="w-[calc(100vw-28px)] sm:w-[400px] max-h-[78vh] flex flex-col rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] shadow-2xl overflow-hidden animate-fade-in"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {String(activeCountry)}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {countryInfo.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  · {launchStatus === 'live' ? 'LIVE' : 'Public Beta'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Building in public · All nations invited
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback drawer"
              className="min-w-[40px] min-h-[40px] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* 2-Tab Segmented Switcher */}
          <div className="px-3 pt-3 pb-2 bg-white dark:bg-[#161a22] border-b border-[#e3e6ea] dark:border-[#262b36] shrink-0">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <button
                type="button"
                onClick={() => handleTabSwitch('feedback')}
                className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'feedback'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquarePlus size={13} />
                <span>UX Feedback</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('fund')}
                className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'fund'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HeartHandshake size={13} />
                <span>Fund &amp; Partner</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 overflow-y-auto space-y-3.5 text-slate-900 dark:text-slate-100">
            {activeTab === 'feedback' ? (
              <>
                {isAdaptiveTemplate ? (
                  <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                    <Globe size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900 dark:text-white">{countryInfo.name} Adaptive Template:</strong>{' '}
                      Spot any ministry titles, municipal tiers, or local utility names we should refine for your country? Tell us below.
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                    <FlaskConical size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      Dispatches submitted during <strong className="text-slate-900 dark:text-white">Public Beta</strong> are stamped{' '}
                      <code className="px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-[10px]">TEST POST</code>{' '}
                      and auto-deleted when {countryInfo.name} goes live.
                    </span>
                  </div>
                )}

                {submittedOk && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-semibold">Feedback captured for {countryInfo.name}.</div>
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('fund')}
                        className="text-[11px] font-mono font-bold underline text-emerald-700 dark:text-emerald-300 cursor-pointer"
                      >
                        Want to back official launch or partner? →
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitFeedback} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Feedback Topic ({countryInfo.name})
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {FEEDBACK_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                            category === cat
                              ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                              : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                      Your UX Note / Local Reality Check
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Share how CivicDuty feels in ${countryInfo.name} — navigation, civic hierarchy, utility providers, or bugs...`}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Optional @handle or email if you want a reply"
                      className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send size={13} />
                      <span>{submitting ? 'Submitting...' : 'Send UX Note'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('fund')}
                      className="min-h-[44px] px-3 py-2 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500/50 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <HeartHandshake size={13} />
                      <span>Back Launch</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* Dynamic Per-Country Crowdfund Goal Note (Zero country-specific incorporation disclosure) */}
                <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles size={12} />
                      <span>Launch Backing · {countryInfo.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      Transparent Goal
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Every contribution directly funds <strong className="text-slate-900 dark:text-white">finalizing local incorporation, statutory gateway &amp; telecom integrations</strong> (which require local corporate registration), and final product engineering for CivicDuty&apos;s official public launch in <strong className="text-slate-900 dark:text-white">{countryInfo.name}</strong>.
                  </p>
                </div>

                {/* Direct Crowdfund Payment Rails */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                    Direct Community Support Channels
                  </div>

                  {[
                    {
                      id: 'mtn',
                      label: 'MTN Mobile Money',
                      value: '0778277900',
                      sub: '+256 778 277 900 · Tap to copy number',
                      icon: <Smartphone size={14} className="text-amber-500" />,
                    },
                    {
                      id: 'airtel',
                      label: 'Airtel Money',
                      value: '0748423260',
                      sub: '+256 748 423 260 · Tap to copy number',
                      icon: <Smartphone size={14} className="text-rose-500" />,
                    },
                    {
                      id: 'equity',
                      label: 'Equity Bank Account',
                      value: '1013103748424',
                      sub: 'Direct Bank Transfer · Tap to copy account',
                      icon: <Building2 size={14} className="text-emerald-600 dark:text-emerald-400" />,
                    },
                  ].map((rail) => {
                    const isCopied = copiedId === rail.id;
                    return (
                      <button
                        key={rail.id}
                        type="button"
                        onClick={() => handleCopyRail(rail.id, rail.value, rail.label)}
                        className="w-full min-h-[52px] p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500/50 flex items-center justify-between gap-2.5 text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center shrink-0">
                            {rail.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-100">
                              {rail.label}
                            </div>
                            <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 truncate">
                              {rail.sub}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] font-mono text-xs font-bold text-slate-900 dark:text-white shrink-0 tabular-nums">
                          <span>{rail.value}</span>
                          {isCopied ? (
                            <Check size={12} className="text-emerald-500" />
                          ) : (
                            <Copy size={12} className="text-slate-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Strategic Partnerships & Capital Inquiry */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Mail size={13} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Co-Founders, Capital &amp; Institutional Partners</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    Interested in sponsoring incorporation in {countryInfo.name}, civic pilots, or seed partnership? Reach out directly:
                  </p>
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:inzamarobin279@gmail.com?subject=${encodeURIComponent(`CivicDuty Partnership / Launch Support (${countryInfo.name})`)}`}
                      onClick={() =>
                        trackVisitorInteraction(
                          'partner_click',
                          `Email Partnership Click (${String(activeCountry)})`,
                          String(activeCountry),
                          { countryCode: activeCountry }
                        )
                      }
                      className="flex-1 min-h-[40px] px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 truncate transition-colors"
                    >
                      <Mail size={12} className="shrink-0" />
                      <span className="truncate">inzamarobin279@gmail.com</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyRail('partner_email', 'inzamarobin279@gmail.com', 'Partnership Email', true)}
                      className="min-h-[40px] px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedId === 'partner_email' ? (
                        <Check size={12} className="text-emerald-500" />
                      ) : (
                        <Copy size={12} className="text-slate-400" />
                      )}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Compact Launcher Button — hidden while drawer is open to prevent UI congestion */}
      {!isOpen && (
        <button
          type="button"
          onClick={handleToggleOpen}
          aria-expanded={isOpen}
          className="min-h-[44px] px-3.5 py-2 rounded-full bg-white/95 dark:bg-[#161a22]/95 backdrop-blur-md hover:bg-[#f8f9fa] dark:hover:bg-[#1e232d] text-slate-900 dark:text-slate-100 border border-[#e3e6ea] dark:border-[#262b36] shadow-lg flex items-center gap-2 transition-all cursor-pointer group"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <MessageSquarePlus size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-semibold tracking-tight whitespace-nowrap">
            Feedback &amp; Fund
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
            {String(activeCountry)}
          </span>
        </button>
      )}
    </div>
  );
};
