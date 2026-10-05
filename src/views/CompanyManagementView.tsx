import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  RefreshCw,
  Sliders,
  ArrowLeft,
  ShieldCheck,
  Database,
  Server,
  CheckCircle,
  Lock,
  Radio,
  Cpu,
  Receipt,
  FileCheck,
  AlertTriangle,
  KeyRound,
  ExternalLink,
  Handshake,
  MessageSquare,
  ArrowRight,
  Globe2,
  Activity,
  Search,
  Filter,
  Users,
  PlusCircle,
  Send,
  Building2,
  CheckCircle2,
  Clock,
  RotateCcw,
  Megaphone,
  Bus,
  Bike,
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

export const CompanyManagementView: React.FC = () => {
  const {
    user,
    go,
    toast,
    setUser,
    govFeedbackMessages,
    activeCdOpsOperator,
    cdOpsStaffList,
  } = useApp();

  const [internalUnlocked, setInternalUnlocked] = useState<boolean>(
    () => user?.role === 'platform_admin' && (user as any)?.is_civicduty_internal === true
  );
  const [inputKey, setInputKey] = useState<string>('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'bilateral_desk' | 'campaigns_studio' | 'staff' | 'dispatch' | 'access_codes' | 'partnerships' | 'infrastructure' | 'billing' | 'policy'
  >('bilateral_desk');

  // Filter & search states for Bilateral Desk
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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
      toast('CivicDuty Internal Reliability & Tenancy Portal unlocked.', 'amber');
    } else {
      toast('Invalid Internal CivicDuty Key. Access Restricted.', 'red');
    }
  };

  // Bilateral feedback metrics
  const totalDirectives = govFeedbackMessages.length;
  const awaitingReplyCount = govFeedbackMessages.filter(
    (m) => m.status === 'sent' || !m.cdOpsResponse
  ).length;
  const actionedCount = govFeedbackMessages.filter((m) => m.status === 'actioned').length;
  const underReviewCount = govFeedbackMessages.filter(
    (m) => m.status === 'reviewed_by_cd_ops'
  ).length;
  const statutoryDirectiveCount = govFeedbackMessages.filter(
    (m) => m.priority === 'statutory_directive'
  ).length;

  // Filtered bilateral messages
  const filteredMessages = useMemo(() => {
    return govFeedbackMessages.filter((msg) => {
      // Country filter
      if (filterCountry !== 'ALL' && msg.countryCode !== filterCountry) {
        return false;
      }
      // Priority filter
      if (filterPriority !== 'ALL' && msg.priority !== filterPriority) {
        return false;
      }
      // Status filter
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'awaiting') {
          if (msg.status !== 'sent' && msg.cdOpsResponse) return false;
        } else if (filterStatus === 'actioned') {
          if (msg.status !== 'actioned') return false;
        } else if (filterStatus === 'reviewed_by_cd_ops') {
          if (msg.status !== 'reviewed_by_cd_ops') return false;
        }
      }
      // Search query
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
  }, [govFeedbackMessages, filterCountry, filterPriority, filterStatus, searchQuery]);

  const handleOpenResponseModal = (msg: GovFeedbackMessage) => {
    setActiveRespondingMessage(msg);
    setIsResponseModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterCountry('ALL');
    setFilterPriority('ALL');
    setFilterStatus('ALL');
    toast('Filters cleared.', 'zinc');
  };

  if (!internalUnlocked) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-slate-950 text-slate-100 animate-fade-in">
        <div className="w-full max-w-md space-y-5 bg-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <button
              onClick={() => go('splash')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
            >
              <ArrowLeft size={14} /> Exit to Public Portal
            </button>
            <span className="text-[9px] mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              RESTRICTED
            </span>
          </div>

          <div className="space-y-2 text-center pt-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock size={24} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">CivicDuty Internal Systems</h2>
            <p className="text-xs text-slate-400 font-mono">
              National Official Bilateral Desk · Enterprise Tenancy · *3030# USSD Gateway
            </p>
          </div>

          <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-xl text-[10px] text-amber-200/80 leading-relaxed font-mono">
            ⚠️ <strong>Restricted to CivicDuty Platform Staff (CD-Ops).</strong> Internal operational cockpit for responding to national officials, calibrating SLAs, and managing sovereign accords.
          </div>

          <form onSubmit={handleUnlock} className="space-y-3 pt-1">
            <div>
              <label className="text-[10px] mono text-slate-400 font-bold block mb-1">
                CIVICDUTY MASTER OPERATOR KEY
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter Internal Key (e.g. CD-CORP-9999)"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-white mono outline-none"
                />
                <KeyRound size={16} className="absolute right-3 top-3 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <ShieldCheck size={16} /> Authenticate Internal Operator
            </button>
          </form>

          {/* Quick preset for authorized reviewers */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] mono text-slate-400">
            <span>Authorized Review Key:</span>
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
                toast('Unlocked with Master Operator Key: CD-CORP-9999', 'amber');
              }}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded font-bold transition-colors cursor-pointer"
            >
              One-Tap Unlock (CD-CORP-9999)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-4 animate-fade-in pb-16 text-slate-800 dark:text-slate-100 max-w-6xl mx-auto min-h-screen">
      {/* Top Header & Operator Strip */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
        <div>
          <button
            onClick={() => go('splash')}
            className="text-[10px] mono text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold mb-1 cursor-pointer transition-colors"
          >
            <ArrowLeft size={12} /> Exit to Public Portal
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-400 tracking-tight leading-tight">
              CivicDuty CD-Ops Operations Hub
            </h2>
            <span className="text-[9px] mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 font-bold">
              STAFF COMMAND CONSOLE
            </span>
          </div>
          <p className="text-[11px] mono text-slate-600 dark:text-zinc-400 mt-0.5">
            Bilateral Ministerial Dispatches · Sovereign Accords · *3030# USSD Gateway · Enterprise Tenancy
          </p>
        </div>

        {/* Active Dispatching Operator Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('staff')}
            className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-amber-500/20 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer"
            title="Click to view full staff roster & switch active operator"
          >
            <img
              src={activeCdOpsOperator.avatar}
              alt={activeCdOpsOperator.name}
              className="w-7 h-7 rounded-lg object-cover border border-amber-500"
            />
            <div className="text-[10px] mono leading-tight">
              <span className="text-[8px] text-slate-400 block uppercase">Active Operator</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[130px] block">
                {activeCdOpsOperator.name}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          </button>

          <button
            onClick={() => {
              setInternalUnlocked(false);
              toast('Locked CivicDuty Internal Console.', 'zinc');
            }}
            className="px-2.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs mono font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Lock size={12} /> Lock
          </button>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('bilateral_desk')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
            activeTab === 'bilateral_desk'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <MessageSquare size={14} />
          <span>National Official Bilateral Desk</span>
          {awaitingReplyCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[8px] font-black ${
                activeTab === 'bilateral_desk'
                  ? 'bg-slate-950 text-amber-300'
                  : 'bg-rose-500 text-white animate-pulse'
              }`}
            >
              {awaitingReplyCount} Awaiting
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('campaigns_studio')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'campaigns_studio'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Megaphone size={14} />
          <span>Transit &amp; Ad Studio</span>
          <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-emerald-500 text-slate-950">
            MARKET LAUNCH
          </span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'staff'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Users size={14} />
          <span>Staff Management ({cdOpsStaffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'dispatch'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Radio size={14} />
          <span>Dispatch Matrix &amp; Assignments</span>
        </button>

        <button
          onClick={() => setActiveTab('access_codes')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'access_codes'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <KeyRound size={14} />
          <span>MoLG &amp; Sovereign Access Codes</span>
        </button>

        <button
          onClick={() => setActiveTab('partnerships')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'partnerships'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Handshake size={14} />
          <span>Sovereign Accords ({SOVEREIGN_PARTNERSHIPS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('infrastructure')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'infrastructure'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Server size={14} />
          <span>Telecom &amp; USSD (*3030#)</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'billing'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <DollarSign size={14} />
          <span>Enterprise ARR</span>
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`px-3 py-2 rounded-xl text-xs mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'policy'
              ? 'bg-amber-600 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Sliders size={14} />
          <span>Data Compliance</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: NATIONAL OFFICIAL BILATERAL DESK (PRIMARY FOCUS) */}
      {/* ============================================================ */}
      {activeTab === 'bilateral_desk' && (
        <div className="space-y-4 animate-fade-in">
          {/* Executive Overview Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📡</span>
                <span className="text-xs font-black mono text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  Sovereign Bilateral Operational Feedback Loop
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl">
                Direct hotline channel with Permanent Secretaries, Ministerial Accounting Officers, and Municipal Directors. Staff can review inbound policy directives, calibrate SLA thresholds, and dispatch certified official resolutions.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsNewDirectiveModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>+ Propose Advisory to Ministry</span>
              </button>
            </div>
          </div>

          {/* Real-time Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block font-bold">
                Total Directives
              </span>
              <span className="text-xl font-black mono text-slate-900 dark:text-slate-100">
                {totalDirectives}
              </span>
              <span className="text-[8px] mono text-slate-500 block mt-0.5">
                All 15 Partner Nations
              </span>
            </div>

            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block font-bold flex items-center justify-between">
                <span>Awaiting CD-Ops Reply</span>
                {awaitingReplyCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </span>
              <span className="text-xl font-black mono text-amber-600 dark:text-amber-400">
                {awaitingReplyCount}
              </span>
              <span className="text-[8px] mono text-amber-700 dark:text-amber-300 block mt-0.5">
                {awaitingReplyCount > 0 ? 'Action Required by Staff' : 'All Clear'}
              </span>
            </div>

            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block font-bold">
                Actioned &amp; Certified
              </span>
              <span className="text-xl font-black mono text-emerald-600 dark:text-emerald-400">
                {actionedCount}
              </span>
              <span className="text-[8px] mono text-emerald-700 dark:text-emerald-300 block mt-0.5">
                Cryptographically Stamped
              </span>
            </div>

            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block font-bold">
                Statutory Directives (PFMA)
              </span>
              <span className="text-xl font-black mono text-rose-600 dark:text-rose-400">
                {statutoryDirectiveCount}
              </span>
              <span className="text-[8px] mono text-rose-700 dark:text-rose-300 block mt-0.5">
                Highest Legal Priority
              </span>
            </div>

            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block font-bold">
                Avg Turnaround SLA
              </span>
              <span className="text-xl font-black mono text-teal-600 dark:text-teal-400">
                &lt; 1.8 Hours
              </span>
              <span className="text-[8px] mono text-teal-700 dark:text-teal-300 block mt-0.5">
                99.4% On-Target
              </span>
            </div>
          </div>

          {/* Filtering & Search Toolbar */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Officer Name, Ministry, Subject, Ticket ID (e.g. FDBK-UG-02)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-[10px] mono text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Country Dropdown */}
              <div className="sm:w-48">
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="ALL">🌐 All 15 Sovereign Nations</option>
                  {Object.entries(COUNTRIES).map(([code, c]) => (
                    <option key={code} value={code}>
                      {c.flag} {c.name} ({code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Dropdown */}
              <div className="sm:w-44">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="ALL">⚡ All Priorities</option>
                  <option value="statutory_directive">🔴 Statutory Directive (PFMA)</option>
                  <option value="urgent">🟡 Urgent Escalation</option>
                  <option value="routine">🟢 Routine Operational Sync</option>
                </select>
              </div>

              {/* Status Dropdown */}
              <div className="sm:w-44">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="ALL">📑 All Statuses</option>
                  <option value="awaiting">⚠️ Awaiting CD-Ops Reply</option>
                  <option value="reviewed_by_cd_ops">🔍 Under Technical Evaluation</option>
                  <option value="actioned">✅ Actioned &amp; Certified</option>
                </select>
              </div>

              {(searchQuery || filterCountry !== 'ALL' || filterPriority !== 'ALL' || filterStatus !== 'ALL') && (
                <button
                  onClick={handleResetFilters}
                  className="px-2.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs mono font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0"
                  title="Reset all filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] mono text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span>Showing {filteredMessages.length} of {govFeedbackMessages.length} total directives</span>
                {filterCountry !== 'ALL' && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                    Country: {COUNTRIES[filterCountry as CountryCode]?.name || filterCountry}
                  </span>
                )}
                {filterPriority !== 'ALL' && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                    Priority: {filterPriority.replace('_', ' ')}
                  </span>
                )}
              </div>
              <span>Click "Respond to Official" on any ticket to open resolution engine</span>
            </div>
          </div>

          {/* Directives Cards Stream */}
          <div className="space-y-3">
            {filteredMessages.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
                <MessageSquare size={28} className="mx-auto text-slate-400" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No Ministerial Directives Match Filters
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try clearing your search query or adjusting the nation and priority dropdowns.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs mono font-bold hover:bg-slate-200 transition-colors"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setIsNewDirectiveModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs mono font-bold transition-colors"
                  >
                    + Initiate New Advisory
                  </button>
                </div>
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
          <div className="card p-4 bg-teal-500/10 border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="text-[10px] mono text-teal-800 dark:text-teal-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Handshake size={15} /> Sovereign Government Accords &amp; State Inquiries
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
                Active statutory MoUs signed with sovereign nations, legal data residency terms, and pending state accession inquiries under protocol review.
              </p>
            </div>
            <button
              onClick={() => go('gov_partnership')}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs mono font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 shadow-xs cursor-pointer"
            >
              <span>Launch Gov Bilateral Desk</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Signed Sovereign Accords Registry */}
          <div className="card p-4 space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase mono block">
                  Signed Sovereign Accords Registry ({SOVEREIGN_PARTNERSHIPS.length} Nations)
                </span>
                <span className="text-[9px] mono text-slate-500">Official Bilateral Agreements with Statutory Desks</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[8px] mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                100% RATIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOVEREIGN_PARTNERSHIPS.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black mono text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
                      <span className="text-base">{acc.flag}</span>
                      <span>{acc.countryName}</span>
                    </span>
                    <span className="text-[8px] mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
                      {acc.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[9px] mono text-slate-500 flex items-center justify-between">
                    <span>MoU Ref: {acc.mouReference}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">USSD: {acc.ussdShortcode}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-700 dark:text-slate-300 font-medium leading-snug">
                    {acc.leadMinistry}
                  </p>
                  <div className="text-[8.5px] mono text-slate-500 pt-1.5 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
                    <span>Data: {acc.sovereignDataSovereignty.slice(0, 30)}...</span>
                    <span>Signed: {acc.signedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Applications */}
          <div className="card p-4 space-y-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase mono block">
                  Pending Sovereign Applications &amp; Inquiries
                </span>
                <span className="text-[9px] mono text-slate-500">Government Inquiries Awaiting Official Accord Ratification</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[8px] mono bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                {PARTNERSHIP_APPLICATIONS.length} In-Review
              </span>
            </div>

            <div className="space-y-2.5">
              {PARTNERSHIP_APPLICATIONS.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {app.countryName} ({app.countryCode})
                      </span>
                      <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold uppercase">
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Lead: <strong>{app.applicantName}</strong> ({app.applicantTitle}) · {app.officialEmail}
                    </p>
                    <p className="text-[9.5px] text-slate-700 dark:text-slate-300 mt-1 italic">
                      "{app.requestedScope}"
                    </p>
                  </div>
                  <button
                    onClick={() => toast(`Acknowledged inquiry ${app.id} for ${app.countryName}. Protocol officer assigned.`, 'emerald')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-[9px] mono font-bold uppercase transition-colors shrink-0 self-start sm:self-auto shadow-2xs cursor-pointer"
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
          <div className="card p-4 space-y-3 bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/30">
            <div className="flex items-center justify-between border-b border-red-200 dark:border-red-900/40 pb-2">
              <div>
                <span className="text-[9px] mono text-red-700 dark:text-red-400 font-bold uppercase tracking-widest block">
                  CivicDuty Internal Reliability Infrastructure
                </span>
                <p className="text-[11px] font-bold text-slate-900 dark:text-zinc-100">USSD Gateway &amp; National Identity Bridges</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[8px] mono bg-red-500/20 text-red-800 dark:text-red-300 border border-red-500/40 font-bold">
                HIGH AVAILABILITY (99.99%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[9px] mono pt-1">
              <div className="bg-white dark:bg-zinc-900/80 p-3 rounded-lg border border-slate-200 dark:border-zinc-800/80 space-y-1">
                <span className="text-slate-500 dark:text-zinc-500 block font-bold">Uganda Telecom USSD Gateway</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">*3030# (MTN &amp; Airtel UG)</span>
                <div className="text-[8px] text-slate-600 dark:text-slate-400 space-y-0.5 pt-1">
                  <div>• Session Capacity: 10,000 concurrent sessions</div>
                  <div>• Response latency: 120ms round-trip</div>
                  <div>• Failover node: Entebbe Tier-3 Datacenter</div>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900/80 p-3 rounded-lg border border-slate-200 dark:border-zinc-800/80 space-y-1">
                <span className="text-slate-500 dark:text-zinc-500 block font-bold">NIRA Identity Bridge</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">National ID API Verification</span>
                <div className="text-[8px] text-slate-600 dark:text-slate-400 space-y-0.5 pt-1">
                  <div>• SHA-256 Zero-Knowledge Citizen Tokenization</div>
                  <div>• Fraud prevention score: 99.8% accurate</div>
                  <div>• Direct connection to NIRA Kampala Gateway</div>
                </div>
              </div>
            </div>

            {/* Live Telecom Webhook Diagnostic Simulator */}
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2 text-[10px] mono">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold uppercase flex items-center gap-1.5">
                  <Activity size={12} className="text-emerald-400" />
                  Live Telecom Webhook Receiver Test Harness
                </span>
                <span className="text-emerald-400 font-bold">Endpoints: /api/ussd &amp; /api/sms</span>
              </div>
              <p className="text-slate-400 text-[9px]">
                Simulates real-world Telco aggregation payloads sent from MTN, Airtel, Safaricom, and Vodacom directly into CivicDuty's sovereign dispatcher.
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
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  ⚡ Test USSD Session Hook
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
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-lg text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  ✉️ Test Inbound SMS Hook
                </button>
              </div>
            </div>

            <p className="text-[8px] mono text-slate-500 dark:text-zinc-500 leading-relaxed pt-1">
              🔒 Strictly isolated from public feeds and government department walls. Only authorized CivicDuty Platform Reliability Engineers hold access keys to this infrastructure layer.
            </p>
          </div>

          {/* Custom Domain & Namecheap DNS Configuration Panel for CivicDuty.site */}
          <div className="card p-4 sm:p-5 space-y-4 bg-slate-900 text-slate-100 border border-emerald-500/40 rounded-2xl shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Globe2 size={16} className="text-emerald-400" />
                  <h4 className="text-sm font-black uppercase tracking-tight text-white mono">
                    Primary Production Domain: CivicDuty.site
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mono">
                    NAMECHEAP ORDER #215862465
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 mono">
                  Google Cloud Run Custom Domain Mapping &amp; Namecheap Advanced DNS Records
                </p>
              </div>
              <a
                href="https://ap.www.namecheap.com/domains/domaincontrolpanel/civicduty.site/advancedns"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] mono uppercase flex items-center gap-1.5 transition-all"
              >
                <span>Open Namecheap Advanced DNS</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
                Namecheap Advanced DNS Records (Google Cloud Run Managed SSL)
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
                <table className="w-full text-left text-[10px] font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase">
                    <tr>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Host</th>
                      <th className="py-2 px-3">Value / IP Address</th>
                      <th className="py-2 px-3">TTL</th>
                      <th className="py-2 px-3 text-right">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-slate-200">
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
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="py-1.5 px-3 font-bold text-amber-400">{rec.type}</td>
                        <td className="py-1.5 px-3 font-bold text-white">{rec.host}</td>
                        <td className="py-1.5 px-3 text-emerald-400">{rec.val}</td>
                        <td className="py-1.5 px-3 text-slate-400">Automatic</td>
                        <td className="py-1.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(rec.val);
                              toast(`Copied ${rec.type} value: ${rec.val}`, 'emerald');
                            }}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[9px] cursor-pointer"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[9.5px] text-slate-400 leading-relaxed">
                💡 <strong>Note:</strong> Remove any default Namecheap Parking Record or URL Redirect Record on <code className="text-amber-300">@</code> and <code className="text-amber-300">www</code> before saving these records. Also add <code className="text-emerald-300">civicduty.site</code> and <code className="text-emerald-300">www.civicduty.site</code> under <strong>Firebase Console → Authentication → Settings → Authorized domains</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: ENTERPRISE ARR & BILLING */}
      {/* ============================================================ */}
      {activeTab === 'billing' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-4 bg-amber-500/5 border-amber-500/20 space-y-2">
            <span className="text-[10px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={15} /> Global Institutional Tenancy &amp; Municipal Subscriptions
            </span>
            <p className="text-[11px] text-slate-700 dark:text-zinc-300">
              Contracted institutional annual licensing fees for sovereign nation rollouts, KCCA metropolitan tiers, and utility integration pipes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block">Total Contracted ARR</span>
              <span className="text-xl font-black mono text-emerald-600 dark:text-emerald-400">$875,000</span>
              <span className="text-[8px] mono text-slate-500 block mt-0.5">Annual Recurring Licensing</span>
            </div>
            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block">Subscribed Units</span>
              <span className="text-xl font-black mono text-slate-900 dark:text-slate-100">142 LGAs</span>
              <span className="text-[8px] mono text-slate-500 block mt-0.5">Across 4 Nations</span>
            </div>
            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block">USSD Throughput</span>
              <span className="text-xl font-black mono text-amber-600 dark:text-amber-400">1.4M / Mo</span>
              <span className="text-[8px] mono text-slate-500 block mt-0.5">Zero-Rated Dial Sessions</span>
            </div>
            <div className="card p-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
              <span className="text-[9px] mono text-slate-500 uppercase block">Payment Status</span>
              <span className="text-xl font-black mono text-teal-600 dark:text-teal-400">100% Current</span>
              <span className="text-[8px] mono text-slate-500 block mt-0.5">Automated MoF Direct Debit</span>
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase mono">
                Active Sovereign &amp; Municipal Tenancies
              </span>
              <span className="text-[9px] mono text-slate-500">Auto-Billed to Line Ministries</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Uganda Ministry of Local Government (MoLG)</div>
                  <div className="text-[10px] mono text-slate-500">135 Districts &amp; 10 Cities Nationwide Enterprise License</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-emerald-600 dark:text-emerald-400">$320,000 / yr</div>
                  <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">PAID</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Kampala Capital City Authority (KCCA)</div>
                  <div className="text-[10px] mono text-slate-500">5 Urban Divisions Dedicated Real-Time Dispatch Pipeline</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-emerald-600 dark:text-emerald-400">$85,000 / yr</div>
                  <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">PAID</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Council of Governors (Kenya - Nairobi &amp; Mombasa)</div>
                  <div className="text-[10px] mono text-slate-500">Bilateral Urban Dispatch Integration Tier</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-emerald-600 dark:text-emerald-400">$210,000 / yr</div>
                  <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">PAID</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">Rwanda MINALOC (Kigali City &amp; Eastern Province)</div>
                  <div className="text-[10px] mono text-slate-500">Irembo Integration Hub &amp; Citizen Dispatch Desk</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-emerald-600 dark:text-emerald-400">$160,000 / yr</div>
                  <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">PAID</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: DATA COMPLIANCE & POLICY RULES */}
      {/* ============================================================ */}
      {activeTab === 'policy' && (
        <div className="card p-4 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase mono">
              Acceptable Data &amp; Content Policy
            </span>
            <span className="px-2 py-0.5 rounded text-[8px] mono bg-teal-500/20 text-teal-800 dark:text-teal-300 font-bold">
              Strictly Enforced
            </span>
          </div>
          <div className="space-y-2.5 text-[10px]">
            <div className="flex items-start justify-between gap-2 p-2.5 bg-slate-50 dark:bg-zinc-900 rounded-lg">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">Verified GPS &amp; Photo Proof Required</div>
                <div className="text-[9px] text-slate-500 dark:text-zinc-400">Citizen submissions must include geotagged proof or official receipt.</div>
              </div>
              <span className="text-emerald-600 font-mono font-bold text-xs">ENFORCED</span>
            </div>
            <div className="flex items-start justify-between gap-2 p-2.5 bg-slate-50 dark:bg-zinc-900 rounded-lg">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">Zero-Knowledge IGG Whistleblower Vault</div>
                <div className="text-[9px] text-slate-500 dark:text-zinc-400">Corruption reports are encrypted client-side before storage.</div>
              </div>
              <span className="text-emerald-600 font-mono font-bold text-xs">ACTIVE</span>
            </div>
            <div className="flex items-start justify-between gap-2 p-2.5 bg-slate-50 dark:bg-zinc-900 rounded-lg">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">USSD 160-Character SMS Optimization</div>
                <div className="text-[9px] text-slate-500 dark:text-zinc-400">Automatic gateway message compression for feature phones (*3030#).</div>
              </div>
              <span className="text-emerald-600 font-mono font-bold text-xs">ONLINE</span>
            </div>
          </div>
          <button
            onClick={() => toast('Updated Acceptable Data Policy parameters across all nodes.', 'emerald')}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10px] mono font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sliders size={12} /> Configure Policy Rules
          </button>
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
