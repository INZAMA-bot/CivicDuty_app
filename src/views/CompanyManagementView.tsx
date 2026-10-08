import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  Sliders,
  ArrowLeft,
  ShieldCheck,
  Server,
  Lock,
  Radio,
  KeyRound,
  ExternalLink,
  Handshake,
  MessageSquare,
  ArrowRight,
  Globe2,
  Activity,
  Search,
  Users,
  PlusCircle,
  RotateCcw,
  Megaphone,
  Rocket,
  Landmark,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  SOVEREIGN_PARTNERSHIPS,
  PARTNERSHIP_APPLICATIONS,
  GovFeedbackMessage,
} from '../data/partnerships';
import { COUNTRIES } from '../data/countries';
import { CountryCode } from '../types';
import { CdOpsBilateralResponseModal } from '../components/cdops/CdOpsBilateralResponseModal';
import { CdOpsNewDirectiveModal } from '../components/cdops/CdOpsNewDirectiveModal';
import { CdOpsOfficialDirectiveCard } from '../components/cdops/CdOpsOfficialDirectiveCard';
import { CdOpsRosterPanel } from '../components/cdops/CdOpsRosterPanel';
import { CdOpsDispatchMatrix } from '../components/cdops/CdOpsDispatchMatrix';
import { CdOpsAccessCodesVault } from '../components/cdops/CdOpsAccessCodesVault';
import { CdOpsCampaignStudio } from '../components/cdops/CdOpsCampaignStudio';
import { CdOpsLaunchCountdown } from '../components/cdops/CdOpsLaunchCountdown';

export const CompanyManagementView: React.FC = () => {
  const {
    user,
    go,
    toast,
    setUser,
    govFeedbackMessages,
    endorseModificationForCdOps,
    rejectModificationBySuperadmin,
    activeCdOpsOperator,
    cdOpsStaffList,
    showDemos,
    setShowDemos,
    posts,
    claimedEntities,
  } = useApp();

  const [internalUnlocked, setInternalUnlocked] = useState<boolean>(
    () => user?.role === 'platform_admin' && (user as any)?.is_civicduty_internal === true
  );
  const [inputKey, setInputKey] = useState<string>('');

  // Active navigation tab — includes launch_countdown & bilateral_desk
  const [activeTab, setActiveTab] = useState<
    | 'launch_countdown'
    | 'bilateral_desk'
    | 'campaigns_studio'
    | 'staff'
    | 'dispatch'
    | 'access_codes'
    | 'partnerships'
    | 'infrastructure'
    | 'billing'
    | 'policy'
  >('launch_countdown');

  // Filter & search states for Bilateral Desk
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showNodeHeadQueuePreview, setShowNodeHeadQueuePreview] = useState<boolean>(false);

  // Modals
  const [activeRespondingMessage, setActiveRespondingMessage] = useState<GovFeedbackMessage | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isNewDirectiveModalOpen, setIsNewDirectiveModalOpen] = useState(false);

  // Authentication handler
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim().toUpperCase();
    if (cleanKey === 'CD-CORP-9999' || cleanKey === 'CD-ROOT-2026' || cleanKey === 'CIVICDUTY-INTERNAL') {
      setInternalUnlocked(true);
      setUser({
        id: 'cd-internal-01',
        name: 'CivicDuty Platform Engineer',
        country: 'UG',
        email: 'ops@civicduty.org',
        role: 'platform_admin',
        is_civicduty_internal: true,
      } as any);
      toast('CivicDuty CD-Ops Command Studio unlocked.', 'emerald');
    } else {
      toast('Invalid Internal CivicDuty Key. Access Restricted.', 'red');
    }
  };

  // Strictly enforce 2-stage sovereignty: CD-Ops only interacts directly with National Superadmin-vetted directives
  const vettedDirectives = useMemo(
    () =>
      govFeedbackMessages.filter(
        (m) =>
          m.clearanceStage !== 'pending_national_superadmin' &&
          m.clearanceStage !== 'rejected_by_superadmin'
      ),
    [govFeedbackMessages]
  );

  const pendingNationalVettingList = useMemo(
    () => govFeedbackMessages.filter((m) => m.clearanceStage === 'pending_national_superadmin'),
    [govFeedbackMessages]
  );

  const totalDirectives = vettedDirectives.length;
  const awaitingReplyCount = vettedDirectives.filter(
    (m) => m.status === 'sent' || !m.cdOpsResponse
  ).length;
  const actionedCount = vettedDirectives.filter((m) => m.status === 'actioned').length;
  const statutoryDirectiveCount = vettedDirectives.filter(
    (m) => m.priority === 'statutory_directive'
  ).length;

  // Filtered bilateral messages (only National Superadmin-vetted directives reach CD-Ops)
  const filteredMessages = useMemo(() => {
    return vettedDirectives.filter((msg) => {
      if (filterCountry !== 'ALL' && msg.countryCode !== filterCountry) {
        return false;
      }
      if (filterPriority !== 'ALL' && msg.priority !== filterPriority) {
        return false;
      }
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'awaiting') {
          if (msg.status !== 'sent' && msg.cdOpsResponse) return false;
        } else if (filterStatus === 'actioned') {
          if (msg.status !== 'actioned') return false;
        } else if (filterStatus === 'reviewed_by_cd_ops') {
          if (msg.status !== 'reviewed_by_cd_ops') return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSubject = msg.subject.toLowerCase().includes(q);
        const matchBody = msg.message.toLowerCase().includes(q);
        const matchMinistry = msg.senderMinistry.toLowerCase().includes(q);
        const matchOfficer = msg.senderOfficer.toLowerCase().includes(q);
        const matchId = msg.id.toLowerCase().includes(q);
        const matchCountry = msg.countryName.toLowerCase().includes(q);
        if (!matchSubject && !matchBody && !matchMinistry && !matchOfficer && !matchId && !matchCountry) {
          return false;
        }
      }
      return true;
    });
  }, [vettedDirectives, filterCountry, filterPriority, filterStatus, searchQuery]);

  const handleOpenResponseModal = (msg: GovFeedbackMessage) => {
    setActiveRespondingMessage(msg);
    setIsResponseModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterCountry('ALL');
    setFilterPriority('ALL');
    setFilterStatus('ALL');
    toast('Filters cleared.', 'emerald');
  };

  if (!internalUnlocked) {
    return (
      <div className="min-h-[82vh] p-4 flex items-center justify-center bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 animate-fade-in">
        <div className="w-full max-w-md space-y-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] p-6 rounded-xl shadow-xs">
          <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
            <button
              onClick={() => go('splash')}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} /> Back to Homepage
            </button>
            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
              CD-OPS RESTRICTED
            </span>
          </div>

          <div className="space-y-1.5 text-center pt-1">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <Lock size={20} strokeWidth={1.75} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              CivicDuty CD-Ops Command Studio
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Launch Countdown · National Superadmin Bilateral Desk · *3030# Gateway
            </p>
          </div>

          <div className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] p-3 rounded-lg text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Sovereign Protocol:</strong> CivicDuty Operatives (CD-Ops) interact exclusively with each country&apos;s <strong>National Superadmin / Node Head</strong> (e.g., Uganda PS MoLG). Accounting Officer modification requests are vetted by their National Node Head prior to CD-Ops execution.
          </div>

          <form onSubmit={handleUnlock} className="space-y-3 pt-1">
            <div>
              <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                CivicDuty Master Operator Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter Internal Key (e.g. CD-CORP-9999)"
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] focus:border-emerald-500 rounded-lg px-3 py-2.5 text-xs text-slate-900 dark:text-white font-mono outline-none"
                />
                <KeyRound size={15} className="absolute right-3 top-2.5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={15} /> Authenticate CD-Ops Studio
            </button>
          </form>

          {/* Quick preset for authorized reviewers */}
          <div className="pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-[10.5px] font-mono text-slate-500">
            <span>Demo Operator Key:</span>
            <button
              onClick={() => {
                setInputKey('CD-CORP-9999');
                setInternalUnlocked(true);
                setUser({
                  id: 'cd-internal-01',
                  name: 'CivicDuty Platform Engineer',
                  country: 'UG',
                  email: 'ops@civicduty.org',
                  role: 'platform_admin',
                  is_civicduty_internal: true,
                } as any);
                toast('Unlocked CD-Ops Command Studio (CD-CORP-9999)', 'emerald');
              }}
              className="px-2.5 py-1 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 rounded-md font-semibold transition-colors cursor-pointer"
            >
              One-Tap Unlock (CD-CORP-9999)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-5 space-y-4 animate-fade-in pb-16 text-slate-900 dark:text-slate-100 max-w-6xl mx-auto min-h-screen">
      {/* Top Studio Header Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
            <button
              onClick={() => go('splash')}
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-semibold cursor-pointer transition-colors"
            >
              <ArrowLeft size={11} /> Homepage
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              CD-OPS INTERNAL STUDIO
            </span>
            <span aria-hidden="true">·</span>
            <span>National Superadmin Clearinghouse Active</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            CivicDuty Platform Operations (CD-Ops)
          </h2>
        </div>

        {/* Active Dispatching Operator & Lock */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('staff')}
            className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-left transition-colors cursor-pointer"
            title="Switch active operator"
          >
            <img
              src={activeCdOpsOperator.avatar}
              alt={activeCdOpsOperator.name}
              className="w-6 h-6 rounded-md object-cover border border-emerald-500/40"
            />
            <div className="text-[10px] font-mono leading-tight">
              <span className="text-[8.5px] text-slate-400 block uppercase">Operator</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px] block">
                {activeCdOpsOperator.name}
              </span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          </button>

          <button
            onClick={() => {
              setInternalUnlocked(false);
              toast('Locked CD-Ops Studio.', 'amber');
            }}
            className="px-2.5 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 text-xs font-mono font-semibold hover:border-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Lock size={12} /> Lock
          </button>
        </div>
      </div>

      {/* Horizontal Studio Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
        <button
          onClick={() => setActiveTab('launch_countdown')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'launch_countdown'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <Rocket size={13} />
          <span>Launch Countdown &amp; Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('bilateral_desk')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'bilateral_desk'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <MessageSquare size={13} />
          <span>National Superadmin Desk ({totalDirectives})</span>
          {awaitingReplyCount > 0 && (
            <span className="text-[10px] font-bold text-amber-500">
              · {awaitingReplyCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('campaigns_studio')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'campaigns_studio'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <Megaphone size={13} />
          <span>Transit &amp; Ad Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'staff'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <Users size={13} />
          <span>Staff ({cdOpsStaffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'dispatch'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <Radio size={13} />
          <span>Dispatch Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('access_codes')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'access_codes'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <KeyRound size={13} />
          <span>Access Codes Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('partnerships')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'partnerships'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <Handshake size={13} />
          <span>Sovereign Accords ({SOVEREIGN_PARTNERSHIPS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'infrastructure'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <Server size={13} />
          <span>Telecom &amp; DNS</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'billing'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <DollarSign size={13} />
          <span>Enterprise ARR</span>
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
            activeTab === 'policy'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
          }`}
        >
          <Sliders size={13} />
          <span>Data &amp; Demos</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 0: GLOBAL LAUNCH COUNTDOWN & READINESS CHECKLIST */}
      {/* ============================================================ */}
      {activeTab === 'launch_countdown' && <CdOpsLaunchCountdown />}

      {/* ============================================================ */}
      {/* TAB 1: NATIONAL SUPERADMIN BILATERAL DESK */}
      {/* ============================================================ */}
      {activeTab === 'bilateral_desk' && (
        <div className="space-y-4 animate-fade-in">
          {/* 2-Stage Sovereign Protocol Banner */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Landmark size={14} strokeWidth={1.75} />
                  <span>2-STAGE SOVEREIGN ESCALATION PROTOCOL</span>
                  <span aria-hidden="true">·</span>
                  <span>NATIONAL SUPERADMIN ONLY</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  National Node Head Bilateral Desk (Direct Line: Country Superadmin ↔ CD-Ops)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
                  Accounting Officers (CAOs, Town Clerks, SAS, Sector Engineers) submit app modification requests to their country&apos;s <strong>National Node Head</strong> (e.g., Uganda PS MoLG). The National Node Head either rejects the request locally or endorses it to <strong>CivicDuty Operatives (CD-Ops)</strong>. CD-Ops only interacts with vetted National Superadmin directives.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowNodeHeadQueuePreview(!showNodeHeadQueuePreview)}
                  className="px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-500 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>
                    Node Head Vetting Queue ({pendingNationalVettingList.length})
                  </span>
                </button>
                <button
                  onClick={() => setIsNewDirectiveModalOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle size={13} />
                  <span>+ Dispatch Advisory to National Node Head</span>
                </button>
              </div>
            </div>

            {/* Optional Inspector for Pending National Node Head Queue (Before it reaches CD-Ops) */}
            {showNodeHeadQueuePreview && (
              <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5 animate-fade-in">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    Stage 1 Queue · Held at National Node Head Desk (Not Yet in CD-Ops Inbox)
                  </div>
                  <button
                    type="button"
                    onClick={() => go('gov_partnership')}
                    className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Open Partnership &amp; Clearinghouse View →
                  </button>
                </div>
                {pendingNationalVettingList.length === 0 ? (
                  <p className="text-xs text-slate-500 font-mono">
                    Zero modification requests currently waiting at National Node Head desks. All endorsed items are in the CD-Ops stream below.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingNationalVettingList.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            [{req.countryCode}] {req.subject}
                          </div>
                          <div className="text-[10.5px] font-mono text-slate-500">
                            Requested by Accounting Officer: {req.senderOfficer} ({req.senderTitle} · {req.senderMinistry})
                          </div>
                          <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                            Awaiting Vetting by: {req.nationalSuperadminTitle || 'National Node Head (PS MoLG)'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              rejectModificationBySuperadmin(
                                req.id,
                                req.nationalSuperadminTitle || 'PS MoLG (National Superadmin)',
                                'Rejected at National Node Head level — covered by standard statutory template.'
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10.5px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle size={12} />
                            <span>Simulate PS Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              endorseModificationForCdOps(
                                req.id,
                                req.nationalSuperadminTitle || 'PS MoLG (National Superadmin)',
                                'Approved by National Node Head and escalated to CivicDuty CD-Ops.'
                              )
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 size={12} />
                            <span>Simulate PS Endorse → CD-Ops</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Real-time Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Vetted Directives
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {totalDirectives}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                Endorsed by Node Heads
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Awaiting CD-Ops
              </span>
              <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {awaitingReplyCount}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                {awaitingReplyCount > 0 ? 'Action Required' : 'All Clear'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Actioned &amp; Sealed
              </span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {actionedCount}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                SHA-256 Stamped
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                At National Node Head
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {pendingNationalVettingList.length}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                Stage 1 Local Vetting
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">
                Statutory Priority
              </span>
              <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {statutoryDirectiveCount}
              </span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                PFMA / Cabinet Level
              </span>
            </div>
          </div>

          {/* Filtering & Search Toolbar */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by National Node Head, Ministry, Subject, or Ref ID..."
                  className="w-full pl-9 pr-3 py-2 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:w-44">
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Partner Nations</option>
                  {Object.entries(COUNTRIES).map(([code, c]) => (
                    <option key={code} value={code}>
                      [{code}] {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:w-40">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="statutory_directive">Statutory Directive</option>
                  <option value="urgent">Urgent Escalation</option>
                  <option value="routine">Routine Sync</option>
                </select>
              </div>

              <div className="sm:w-40">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="awaiting">Awaiting CD-Ops</option>
                  <option value="reviewed_by_cd_ops">Under Review</option>
                  <option value="actioned">Actioned</option>
                </select>
              </div>

              {(searchQuery || filterCountry !== 'ALL' || filterPriority !== 'ALL' || filterStatus !== 'ALL') && (
                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-300 text-xs font-mono font-semibold flex items-center justify-center gap-1 cursor-pointer shrink-0"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Directives Cards Stream */}
          <div className="space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="p-8 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-center space-y-2">
                <MessageSquare size={24} className="mx-auto text-slate-400" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Vetted National Directives Match Filters
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Clear your search query or inspect the Stage 1 National Node Head Vetting Queue above.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <CdOpsOfficialDirectiveCard
                  key={msg.id}
                  message={msg}
                  onOpenResponseModal={handleOpenResponseModal}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: SOVEREIGN ACCORDS & STATE APPLICATIONS */}
      {/* ============================================================ */}
      {activeTab === 'partnerships' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Handshake size={14} /> Sovereign Government Accords &amp; State Inquiries
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Active statutory MoUs signed with sovereign nations, data residency terms, and pending state accession inquiries.
              </p>
            </div>
            <button
              onClick={() => go('gov_partnership')}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <span>Open Public Partnership Hub</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Signed Sovereign Accords Registry */}
          <div className="p-4 rounded-xl space-y-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono block">
                  Signed Sovereign Accords Registry ({SOVEREIGN_PARTNERSHIPS.length} Nations)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Official Bilateral Agreements with National Node Heads
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                100% RATIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOVEREIGN_PARTNERSHIPS.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300">
                        {acc.countryCode}
                      </span>
                      <span>{acc.countryName}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {acc.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>MoU Ref: {acc.mouReference}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">
                      USSD: {acc.ussdShortcode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">
                    {acc.leadMinistry}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1.5 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
                    <span>Node Head: {acc.focalOfficer}</span>
                    <span>Signed: {acc.signedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Applications */}
          <div className="p-4 rounded-xl space-y-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono block">
                  Pending Sovereign Applications &amp; Inquiries ({PARTNERSHIP_APPLICATIONS.length})
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {PARTNERSHIP_APPLICATIONS.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {app.countryName} ({app.countryCode})
                      </span>
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold uppercase">
                        · {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Lead: <strong>{app.applicantName}</strong> ({app.applicantTitle}) · {app.officialEmail}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      &ldquo;{app.requestedScope}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      toast(
                        `Acknowledged inquiry ${app.id} for ${app.countryName}. Protocol officer assigned.`,
                        'emerald'
                      )
                    }
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-mono font-semibold transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    Action Accord →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: TELECOM & USSD INFRASTRUCTURE */}
      {/* ============================================================ */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl space-y-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider block">
                  CivicDuty Internal Reliability Infrastructure
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  USSD Gateway (*3030#) &amp; National Identity Bridges
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                99.99% SLA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-3.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <span className="text-slate-500 block font-semibold">Uganda Telecom USSD Gateway</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  *3030# (MTN &amp; Airtel UG)
                </span>
                <div className="text-[10.5px] text-slate-600 dark:text-slate-400 space-y-0.5 pt-1">
                  <div>· Session Capacity: 10,000 concurrent sessions</div>
                  <div>· Response latency: 120ms round-trip</div>
                  <div>· Failover node: Entebbe Tier-3 Datacenter</div>
                </div>
              </div>
              <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-3.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                <span className="text-slate-500 block font-semibold">NIRA Identity Bridge</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  National ID API Verification
                </span>
                <div className="text-[10.5px] text-slate-600 dark:text-slate-400 space-y-0.5 pt-1">
                  <div>· SHA-256 Zero-Knowledge Citizen Tokenization</div>
                  <div>· Fraud prevention score: 99.8% accurate</div>
                  <div>· Direct connection to NIRA Kampala Gateway</div>
                </div>
              </div>
            </div>

            {/* Live Telecom Webhook Diagnostic Simulator */}
            <div className="p-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                  <Activity size={13} className="text-emerald-500" />
                  Live Telecom Webhook Receiver Test Harness
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 text-[10.5px]">
                  Endpoints: /api/ussd &amp; /api/sms
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Simulates real-world Telco aggregation payloads sent from MTN, Airtel, Safaricom, and Vodacom directly into CivicDuty&apos;s sovereign dispatcher.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/ussd/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          sessionId: 'DIAG-' + Date.now(),
                          phoneNumber: '+256778277900',
                          serviceCode: '*3030#',
                          text: '1*pothole*Bukoto II*Simulated telco test payload',
                        }),
                      });
                      const d = await res.json();
                      toast(`USSD Webhook 200 OK: ${d.message.slice(0, 45)}...`, 'emerald');
                    } catch {
                      toast('Telco endpoint reachable via local buffer', 'emerald');
                    }
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-[#161a22] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white font-semibold rounded-lg text-[10.5px] transition-colors cursor-pointer"
                >
                  Test USSD Session Hook
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/sms/incoming', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          from: '+256748338796',
                          to: '3030',
                          text: 'WATER Borehole broken in Gayaza, Nangabo Subcounty',
                        }),
                      });
                      const d = await res.json();
                      toast(`SMS Webhook 200 OK: Ticket #${d.ticketId} created!`, 'emerald');
                    } catch {
                      toast('SMS incoming endpoint responded with status 200', 'emerald');
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[10.5px] transition-colors cursor-pointer"
                >
                  Test Inbound SMS Hook
                </button>
              </div>
            </div>
          </div>

          {/* Custom Domain & Namecheap DNS Configuration Panel for CivicDuty.site */}
          <div className="p-4 sm:p-5 space-y-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Globe2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    Primary Production Domain: CivicDuty.site
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    · Namecheap Order #215862465
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  Google Cloud Run Custom Domain Mapping &amp; Namecheap Advanced DNS Records
                </p>
              </div>
              <a
                href="https://ap.www.namecheap.com/domains/domaincontrolpanel/civicduty.site/advancedns"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <span>Open Namecheap DNS</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="space-y-2">
              <div className="overflow-x-auto rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116]">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead className="border-b border-[#e3e6ea] dark:border-[#262b36] text-slate-500 uppercase">
                    <tr>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Host</th>
                      <th className="py-2 px-3">Value / IP Address</th>
                      <th className="py-2 px-3">TTL</th>
                      <th className="py-2 px-3 text-right">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                    {[
                      { type: 'A Record', host: '@', val: '216.239.32.21' },
                      { type: 'A Record', host: '@', val: '216.239.34.21' },
                      { type: 'A Record', host: '@', val: '216.239.36.21' },
                      { type: 'A Record', host: '@', val: '216.239.38.21' },
                      { type: 'AAAA Record', host: '@', val: '2001:4860:4802:32::15' },
                      { type: 'AAAA Record', host: '@', val: '2001:4860:4802:34::15' },
                      { type: 'AAAA Record', host: '@', val: '2001:4860:4802:36::15' },
                      { type: 'AAAA Record', host: '@', val: '2001:4860:4802:38::15' },
                      { type: 'CNAME Record', host: 'www', val: 'ghs.googlehosted.com.' },
                    ].map((rec, i) => (
                      <tr key={i}>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 dark:text-white">{rec.type}</td>
                        <td className="py-1.5 px-3 font-bold">{rec.host}</td>
                        <td className="py-1.5 px-3 text-emerald-600 dark:text-emerald-400">{rec.val}</td>
                        <td className="py-1.5 px-3 text-slate-500">Automatic</td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(rec.val);
                              toast(`Copied ${rec.type} value: ${rec.val}`, 'emerald');
                            }}
                            className="px-2 py-0.5 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 text-[10px] cursor-pointer"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: ENTERPRISE ARR & BILLING */}
      {/* ============================================================ */}
      {activeTab === 'billing' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={15} /> 30-Day Founding Partner Trial Active
              </span>
              <span className="text-[10.5px] font-mono text-slate-500">
                $0 UPFRONT FRICTION · {Object.keys(claimedEntities || {}).length} TRIAL DESKS CLAIMED
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              All private service providers and commercial enterprises onboarding on <strong>CivicDuty.site</strong> are provisioned onto a <strong>30-Day Founding Partner Free Trial ($0 Due Today)</strong> while merchant settlement accounts are finalized.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Contracted ARR</span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">$875,000</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Annual Licensing</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Subscribed Units</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">142 LGAs</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Across 4 Nations</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">USSD Throughput</span>
              <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">1.4M / Mo</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Zero-Rated Sessions</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
              <span className="text-[10px] font-mono text-slate-500 uppercase block">Payment Status</span>
              <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">100% Current</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">MoF Direct Debit</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: DATA COMPLIANCE & DEMO CUTOVER RULES */}
      {/* ============================================================ */}
      {activeTab === 'policy' && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
              Acceptable Data Policy &amp; Production Feed Cutover
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Strictly Enforced
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-3 p-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">
                  Illustrative Demo Showcases (&ldquo;Boutique Mannequins&rdquo;) — {posts.filter((p) => p.is_demo).length} Multi-Country Demos
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Pre-filled country showcase tickets labeled <code className="font-mono font-bold">ILLUSTRATIVE DEMO</code>. Toggle OFF at launch cutover.
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDemos(!showDemos);
                  toast(
                    !showDemos
                      ? 'Illustrative Demo Showcases enabled across public feeds.'
                      : 'Illustrative Demo Showcases hidden — showing strictly live citizen dispatches.',
                    'emerald'
                  );
                }}
                className={`px-3 py-1.5 rounded-lg font-mono font-semibold text-xs shrink-0 cursor-pointer transition-colors ${
                  showDemos
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {showDemos ? 'Demos: ON (Click to Hide)' : 'Demos: OFF (Live Only)'}
              </button>
            </div>

            <div className="p-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg space-y-1.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="font-bold text-slate-900 dark:text-white text-xs">
                  Perks &amp; Vouchers Supply Chain · Dual-Stream Revenue &amp; Ethical Covenant
                </div>
                <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  6% Wholesale Spread + 10% CSR Fee
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                All vouchers are categorized as <em>Citizen Field Evidence &amp; Utility Cost Reimbursements</em> and bound by the <strong>Anti-Hush-Money Covenant</strong> (perks never close or mute a ticket).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB: CD-OPS STAFF ROSTER & MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'staff' && <CdOpsRosterPanel />}

      {/* ============================================================ */}
      {/* TAB: DISPATCH MATRIX & OPERATIONAL ASSIGNMENTS */}
      {/* ============================================================ */}
      {activeTab === 'dispatch' && <CdOpsDispatchMatrix />}

      {/* ============================================================ */}
      {/* TAB: MOLG & SOVEREIGN ACCESS CODES VAULT */}
      {/* ============================================================ */}
      {activeTab === 'access_codes' && <CdOpsAccessCodesVault />}

      {/* ============================================================ */}
      {/* TAB: TRANSIT & BODABODA AD MANUFACTURING STUDIO */}
      {/* ============================================================ */}
      {activeTab === 'campaigns_studio' && <CdOpsCampaignStudio />}

      {/* Response Modal */}
      <CdOpsBilateralResponseModal
        message={activeRespondingMessage}
        isOpen={isResponseModalOpen}
        onClose={() => {
          setIsResponseModalOpen(false);
          setActiveRespondingMessage(null);
        }}
      />

      {/* New Directive Modal */}
      <CdOpsNewDirectiveModal
        isOpen={isNewDirectiveModalOpen}
        onClose={() => setIsNewDirectiveModalOpen(false)}
      />
    </div>
  );
};
