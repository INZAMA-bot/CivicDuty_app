import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { catByID, getDept, pathStr, slaStatus, srcLabel, timeAgo } from '../utils/helpers';
import { AccountabilityDocket } from '../components/AccountabilityDocket';
import {
  AlertTriangle,
  Lock,
  Paperclip,
  UserPlus,
  Users,
  Gift,
  Zap,
  MapPin,
  QrCode,
  X,
  CheckCircle2,
  Send,
  Copy,
  Phone,
  Award,
  Globe,
  Layers,
  Radio,
  Plus,
} from 'lucide-react';
import { tiersFor } from '../data/tiers';
import { getCountryPerks } from '../data/countryPerks';

export const GovInboxView: React.FC = () => {
  const {
    user,
    posts,
    teamMembers,
    govTab,
    setGovTab,
    setActivePost,
    go,
    updatePostStatus,
    logAudit,
    toast,
    activeDeptCountry,
    mergeDuplicatePostsIntoDossier,
    townHalls,
    setActiveTownHall,
    setHostBarazaModalOpen,
    govFeedbackMessages,
    addGovFeedbackMessage,
    endorseModificationForCdOps,
    rejectModificationBySuperadmin,
    showDemos,
  } = useApp();
  const [mergeTargetId, setMergeTargetId] = useState<string | null>(null);
  const [selectedDupToMerge, setSelectedDupToMerge] = useState<string>('');
  const [showModRequestForm, setShowModRequestForm] = useState(false);
  const [modSubject, setModSubject] = useState('');
  const [modBody, setModBody] = useState('');
  const [modPriority, setModPriority] = useState<'routine' | 'urgent' | 'statutory_directive'>('routine');

  const activeCountry = user?.country || activeDeptCountry || 'UG';
  const countryPerks = getCountryPerks(activeCountry);

  const [dispatchModal, setDispatchModal] = useState<'none' | 'digital' | 'physical'>('none');
  const [recipient, setRecipient] = useState(
    `${countryPerks.sampleCitizens[0]?.name} (${countryPerks.sampleCitizens[0]?.phone}) - ${countryPerks.sampleCitizens[0]?.location}`
  );
  const [perkType, setPerkType] = useState(countryPerks.digitalPerks[0]?.id || 'data');
  const [perkCode, setPerkCode] = useState(countryPerks.digitalPerks[0]?.code || 'CIVIC-VOUCHER-01');
  const [hqRoom, setHqRoom] = useState(countryPerks.hqRoom);
  const [officerName, setOfficerName] = useState('Parish Admin Desk Officer');
  const [prizeType, setPrizeType] = useState('Parish Watchdog Honor Plaque & Solar Lantern');
  const [dispatchSuccess, setDispatchSuccess] = useState<{
    type: 'digital' | 'physical';
    code: string;
    recipient: string;
    details: string;
  } | null>(null);

  // Update defaults if active country changes
  useEffect(() => {
    if (countryPerks) {
      setRecipient(
        `${countryPerks.sampleCitizens[0]?.name} (${countryPerks.sampleCitizens[0]?.phone}) - ${countryPerks.sampleCitizens[0]?.location}`
      );
      setPerkType(countryPerks.digitalPerks[0]?.id || 'data');
      setPerkCode(countryPerks.digitalPerks[0]?.code || 'CIVIC-VOUCHER-01');
      setHqRoom(countryPerks.hqRoom);
    }
  }, [activeCountry]);

  if (!user) return null;

  const d = getDept(user.country, user.dept || 'kcca');
  const isNationalScope =
    !user.scope ||
    user.scope.toUpperCase() === user.country.toUpperCase() ||
    user.scope.toUpperCase() === 'NATIONAL' ||
    user.scope.toUpperCase().startsWith('PS-') ||
    user.role === 'platform_admin';

  const queue = posts.filter((p) => {
    if (p.country !== user.country) return false;
    if (!showDemos && p.is_demo) return false;

    if (!isNationalScope && user.scope) {
      const sc = user.scope.toLowerCase();
      const scLabelFirst = (user.scope_label || '').split(/[ ·,(]/)[0].trim().toLowerCase();
      const matchesTerritory =
        p.territory?.district?.toLowerCase() === sc ||
        p.territory?.subcounty?.toLowerCase() === sc ||
        p.territory?.parish?.toLowerCase() === sc ||
        (scLabelFirst.length >= 3 && (p.location || '').toLowerCase().includes(scLabelFirst));
      return matchesTerritory;
    }

    return (
      p.dept === user.dept ||
      (user.dept === 'mofped' && (p.category === 'finance' || p.dept === 'ura' || p.is_corruption))
    );
  });

  const isRO = user.role === 'read_only';
  const canInvite = ['node_admin', 'platform_admin'].includes(user.role) || user.is_admin;
  const myTeam = teamMembers ? teamMembers.filter((m) => m.dept === user.dept) : [];

  const filterQueue = (q: typeof posts, tab: string) => {
    switch (tab) {
      case 'all':
        return q;
      case 'pending':
        return q.filter((p) => p.status === 'pending' || p.gov_status === 'pending' || p.gov_status === 'received');
      case 'overdue':
        return q.filter((p) => p.escalated || p.status === 'overdue');
      case 'investigating':
        return q.filter((p) => p.gov_status === 'investigating');
      case 'corruption':
        return q.filter((p) => p.category === 'corruption');
      case 'resolved':
        return q.filter((p) => p.status === 'resolved');
      default:
        return q;
    }
  };

  const filtered = filterQueue(queue, govTab);

  const total = queue.length;
  const resolvedCount = queue.filter((p) => p.status === 'resolved').length;
  const pendingCount = queue.filter((p) => p.status !== 'resolved').length;
  const overdueCount = queue.filter((p) => p.escalated || p.status === 'overdue').length;
  const corruptionCount = queue.filter((p) => p.category === 'corruption').length;
  const resPct = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  const statusChip = (s: string) => {
    const m: Record<string, string> = {
      pending: 'ch-pending',
      received: 'ch-received',
      investigating: 'ch-invest',
      budget: 'ch-budget',
      resolved: 'ch-resolved',
      overdue: 'ch-overdue',
      cannot: 'ch-cannot',
    };
    const l: Record<string, string> = {
      pending: 'Pending',
      received: 'Received',
      investigating: 'Investigating',
      budget: 'Budget Alloc.',
      resolved: 'Resolved',
      overdue: 'Overdue',
      cannot: 'Cannot Fix',
    };
    return <span className={`chip ${m[s] || 'ch-pending'}`}>{l[s] || s}</span>;
  };

  return (
    <div className="animate-fade-in pb-12 max-w-4xl mx-auto text-slate-900 dark:text-slate-100">
      {/* Header Docket */}
      <div className="px-3.5 sm:px-5 pt-4 pb-3.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116]">
        <AccountabilityDocket
          leftLabel={user.real_title_short || d.name}
          leftSubLabel={user.scope_label || ''}
          centerVal={pendingCount}
          centerLabel="PENDING"
          rightLabel={`${resPct}% resolved`}
          rightSubLabel={`${d.sla || 48}HR TARGET`}
          high={resPct >= 70}
        />

        {/* Entity Civic Perks & Rewards Dispatch Console (Always visible to all Entity Desk users) */}
        <div className="mt-3 bg-white dark:bg-[#161a22] p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Gift size={14} strokeWidth={1.75} />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono uppercase tracking-wide flex items-center gap-1.5">
                  <span>Entity Civic Perks &amp; Rewards Dispatch Console</span>
                  <span className="text-[8.5px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase">
                    Active Desk
                  </span>
                </h5>
                <p className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                  Dispatch digital items or issue allocated Headquarter physical prize collection passes
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
            {/* Digital Item Dispatch */}
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
              <div className="flex items-center justify-between">
                <strong className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Zap size={11} strokeWidth={1.75} />
                  <span>Digital Item Dispatch</span>
                  <span className="text-[9px] text-slate-700 dark:text-slate-300 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] px-1.5 py-0.2 rounded font-bold">[{countryPerks.countryCode}]</span>
                </strong>
                <span className="text-[8.5px] bg-amber-500/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-semibold">Instant PWA / SMS</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[9.5px] leading-snug">
                Send {countryPerks.digitalPerks[0]?.name || 'Data Bundles'}, airtime credit, or utility discount vouchers to verified {countryPerks.countryName} citizen phone numbers.
              </p>
              <button
                onClick={() => {
                  setDispatchSuccess(null);
                  setDispatchModal('digital');
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap size={12} />
                <span>1-Click Dispatch Digital Perks ({countryPerks.countryCode})</span>
              </button>
            </div>

            {/* Physical Prize HQ Collection Pass */}
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-2.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
              <div className="flex items-center justify-between">
                <strong className="text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1">
                  <MapPin size={11} strokeWidth={1.75} />
                  <span>Allocated HQ Pickup Pass</span>
                </strong>
                <span className="text-[8.5px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold">HQ Desk Pass</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[9.5px] leading-snug">
                Assign physical prize (Plaque / Solar Lantern) at <strong className="text-slate-800 dark:text-slate-200">{countryPerks.hqRoom}</strong>.
              </p>
              <button
                onClick={() => {
                  setDispatchSuccess(null);
                  setDispatchModal('physical');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MapPin size={12} />
                <span>Issue Allocated HQ Pickup Pass</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Digital Baraza — Official Audio Town Hall Studio */}
        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[8.5px] font-mono font-bold uppercase flex items-center gap-1 shrink-0">
                <Radio size={9} strokeWidth={2} />
                <span>DIGITAL BARAZA</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                {townHalls && townHalls.length > 0 ? `${townHalls[0].listeners_count} citizens tuned in` : 'Statutory Audio Town Hall'}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5">
              {townHalls && townHalls.length > 0 ? townHalls[0].title : 'Convene a Live Audio Hearing with Citizens'}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setHostBarazaModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={11} strokeWidth={2} />
              <span>+ Host Baraza</span>
            </button>
            {townHalls && townHalls.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTownHall(townHalls[0])}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 cursor-pointer"
              >
                Join Room
              </button>
            )}
          </div>
        </div>

        {/* 2-Stage Sovereign App Modification Request & National Node Head Clearinghouse */}
        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[8.5px] font-mono font-bold uppercase">
                  {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                    ? 'NATIONAL NODE HEAD CLEARINGHOUSE'
                    : 'DESK MODIFICATION PROTOCOL'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                    ? `Direct Bilateral Line to CivicDuty CD-Ops (${countryPerks.countryName})`
                    : `Routed via ${countryPerks.countryName} National Node Head (e.g. PS MoLG) → CivicDuty CD-Ops`}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                  ? 'Review Accounting Officer Modification Requests & Submit Vetted Directives to CD-Ops'
                  : 'Request Custom Desk Modifications, SLA Adjustments, or Form Fields'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModRequestForm(!showModRequestForm)}
              className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Plus size={11} />
              <span>{showModRequestForm ? 'Close Form' : '+ Request App Modification'}</span>
            </button>
          </div>

          {showModRequestForm && (
            <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5 animate-fade-in">
              <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                  ? 'As National Superadmin, your modification directive is transmitted directly to CivicDuty Operatives (CD-Ops).'
                  : `Your request will be sent to the ${countryPerks.countryName} National Node Head (e.g. PS MoLG) for statutory review. Once approved by the National Superadmin, it is forwarded to CivicDuty Operatives (CD-Ops).`}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={modSubject}
                  onChange={(e) => setModSubject(e.target.value)}
                  placeholder="Modification title (e.g. Add Borehole Serial No. field)..."
                  className="sm:col-span-2 px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={modPriority}
                  onChange={(e) => setModPriority(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="routine">Priority: Routine</option>
                  <option value="urgent">Priority: Urgent</option>
                  <option value="statutory_directive">Priority: Statutory</option>
                </select>
              </div>
              <textarea
                rows={2}
                value={modBody}
                onChange={(e) => setModBody(e.target.value)}
                placeholder="Describe the exact workflow, SLA, or form modification required for your accounting desk..."
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!modSubject.trim() || !modBody.trim()) {
                      toast('Please enter both a subject and modification description.', 'amber');
                      return;
                    }
                    const isNationalSuperadmin =
                      user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec';
                    addGovFeedbackMessage({
                      id: `MOD-${activeCountry}-${Date.now().toString().slice(-4)}`,
                      countryCode: activeCountry,
                      countryName: countryPerks.countryName,
                      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                      senderMinistry: d.full || d.name,
                      senderTitle: user.real_title_short || user.role_label || 'Accounting Officer',
                      senderOfficer: user.name || 'Official Desk Officer',
                      subject: modSubject.trim(),
                      message: modBody.trim(),
                      priority: modPriority,
                      status: 'sent',
                      clearanceStage: isNationalSuperadmin
                        ? 'escalated_to_cd_ops'
                        : 'pending_national_superadmin',
                      nationalSuperadminTitle: `National Superadmin (${countryPerks.countryName} Node Head)`,
                      ...(isNationalSuperadmin
                        ? {
                            endorsedBySuperadmin: user.name || 'National Superadmin',
                            endorsedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                          }
                        : {}),
                    });
                    setModSubject('');
                    setModBody('');
                    setShowModRequestForm(false);
                    toast(
                      isNationalSuperadmin
                        ? 'National Directive transmitted directly to CivicDuty Operatives (CD-Ops)!'
                        : `Modification request submitted to ${countryPerks.countryName} National Node Head for vetting!`,
                      'emerald'
                    );
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send size={12} />
                  <span>
                    {user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec'
                      ? 'Submit Directly to CivicDuty CD-Ops'
                      : 'Submit to National Node Head (PS MoLG)'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* National Superadmin Clearinghouse Queue (Visible to National Node Head / Superadmin) */}
          {(user.role === 'platform_admin' || user.hierarchy_level === 'tier5_perm_sec') &&
            (govFeedbackMessages || []).filter(
              (m) => m.countryCode === activeCountry && m.clearanceStage === 'pending_national_superadmin'
            ).length > 0 && (
              <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400">
                  Pending Accounting Officer Modification Requests Awaiting Your Endorsement
                </div>
                {(govFeedbackMessages || [])
                  .filter(
                    (m) => m.countryCode === activeCountry && m.clearanceStage === 'pending_national_superadmin'
                  )
                  .map((req) => (
                    <div
                      key={req.id}
                      className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {req.subject}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          From: {req.senderOfficer} ({req.senderTitle} · {req.senderMinistry})
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                          {req.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            rejectModificationBySuperadmin(
                              req.id,
                              user.name || 'National Superadmin',
                              'Rejected by National Node Head — covered by existing statutory template.'
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-semibold cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            endorseModificationForCdOps(
                              req.id,
                              user.name || 'PS MoLG (National Superadmin)',
                              'Vetted and endorsed by National Superadmin for CD-Ops deployment.'
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-semibold cursor-pointer"
                        >
                          Approve &amp; Send to CD-Ops →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
        </div>

        {canInvite && (
          <div className="mt-3 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-[11px] font-mono uppercase tracking-wider">
                <UserPlus size={14} />
                <span>
                  {user.role === 'platform_admin'
                    ? `${countryPerks.countryName} National Authority Desk`
                    : `${user.real_title_short || 'Node Executive'} (${countryPerks.countryName} Executive Desk)`}
                </span>
              </div>
              <span className="text-[9px] font-mono text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25 font-semibold">
                1-Click Approval Queue
              </span>
            </div>
            <p className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-snug">
              As <span className="text-slate-900 dark:text-white font-semibold">{user.real_title_short || 'Node Executive'}</span>, you hold official mandate to issue officer access codes and digitally sign monthly Citizen Champion Certificates of Civic Excellence.
            </p>

            {/* Auto-Certificate Engine Queue Card */}
            <div className="bg-[#f8f9fa] dark:bg-[#0e1116] p-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Award size={14} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono uppercase">Monthly Civic Awards Approval Queue</h5>
                    <p className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                      {countryPerks.countryName} Jurisdictions · {countryPerks.sampleCitizens.length} Citizen Champions Pending Certificate Signing
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-amber-700 dark:text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                  End of Month Cycle
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono bg-white dark:bg-[#161a22] p-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36]">
                <span className="text-slate-700 dark:text-slate-300">
                  Top Candidate: <strong>{countryPerks.sampleCitizens[0]?.name || 'Citizen Champion'}</strong> ({countryPerks.sampleCitizens[0]?.location || 'Ward'} - {countryPerks.sampleCitizens[0]?.points || 1240} pts)
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Auto-Drafted PDF Ready</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    logAudit(
                      'champion_certificates_signed',
                      `CERT-${countryPerks.countryCode}`,
                      `All ${countryPerks.countryName} Champion Certificates digitally signed and dispatched via PWA & SMS.`
                    );
                    toast(`All ${countryPerks.countryName} Champion Certificates digitally signed & dispatched via PWA & SMS!`, 'emerald');
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg py-2 px-3 text-[10px] uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserPlus size={13} />
                  <span>1-Click Approve &amp; Digitally Sign All ({countryPerks.countryCode})</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => go('gov_team')}
                className="flex-1 bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-semibold border border-[#e3e6ea] dark:border-[#262b36] rounded-lg py-2 px-3 text-[10px] uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus size={13} />
                <span>{user.entity_type === 'non_government_entity' ? 'Invite Duty Staff' : 'Issue Officer Access Code'}</span>
              </button>
              <button
                onClick={() => go('gov_team')}
                className="border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-slate-800 dark:text-slate-200 font-semibold rounded-lg py-2 px-3 text-[10px] uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users size={13} />
                <span>{user.entity_type === 'non_government_entity' ? `Staff & Roles (${myTeam.length})` : `Manage Team (${myTeam.length})`}</span>
              </button>
            </div>
          </div>
        )}

        {isRO && (
          <div className="mt-2.5 card p-2.5 flex items-center gap-2 border-slate-200 dark:border-slate-800">
            <span className="chip ch-ro">Read-Only</span>
            <p className="text-[9px] mono text-slate-500 dark:text-slate-400">Oversight desk · View and Export only.</p>
          </div>
        )}

        {overdueCount > 0 && (
          <div className="flex items-center gap-2 mt-3 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5">
            <AlertTriangle className="text-rose-600 dark:text-rose-400 flex-shrink-0" size={18} />
            <div>
              <p className="text-[10px] mono text-rose-800 dark:text-rose-300 font-bold">
                {overdueCount} ticket{overdueCount > 1 ? 's' : ''} past response deadline — auto-escalated up chain
              </p>
              <p className="text-[9px] mono text-slate-600 dark:text-slate-400 mt-0.5">Each breach is logged. Respond immediately.</p>
            </div>
          </div>
        )}

        {corruptionCount > 0 && (
          <div className="flex items-center gap-2 mt-2 corrupt-banner">
            <Lock className="text-rose-600 dark:text-rose-400" size={14} />
            <p className="text-[10px] mono text-rose-800 dark:text-rose-300 ml-1">
              {corruptionCount} anti-corruption report{corruptionCount > 1 ? 's' : ''} — referred to IGG
            </p>
          </div>
        )}
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto bg-slate-100 dark:bg-slate-950/80">
        {[
          ['all', 'All'],
          ['pending', 'Pending'],
          ['overdue', 'Overdue'],
          ['investigating', 'Active'],
          ['corruption', 'Corruption'],
          ['resolved', 'Resolved'],
        ].map(([t, l]) => {
          const active = govTab === t;
          const alarm = (t === 'overdue' && overdueCount > 0) || (t === 'corruption' && corruptionCount > 0);
          const cnt = t === 'overdue' ? overdueCount : t === 'corruption' ? corruptionCount : 0;
          return (
            <button
              key={t}
              onClick={() => setGovTab(t as any)}
              className={`flex-shrink-0 px-3.5 py-3 text-[9px] mono font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${
                active
                  ? alarm
                    ? 'text-rose-700 dark:text-rose-400 border-b-2 border-rose-500'
                    : 'text-teal-700 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 bg-white dark:bg-transparent'
                  : alarm
                  ? 'text-rose-600 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {l}
              {cnt > 0 ? ` (${cnt})` : ''}
            </button>
          );
        })}
      </div>

      {/* Inbox Ticket List */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800/80">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-xs mono text-slate-400 dark:text-slate-500">No tickets in this view.</div>
        ) : (
          filtered.map((p) => {
            const sla = slaStatus(p);
            const cat = catByID(p.category);
            const isCorrupt = p.category === 'corruption';

            return (
              <div key={p.id} className={`px-4 py-4 ${isCorrupt ? 'bg-rose-50 dark:bg-rose-950/10' : ''} hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors`}>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap text-[8px] mono">
                      <span style={{ color: cat.color }}>{cat.label}</span>
                      {statusChip(p.gov_status || p.status)}
                      {isCorrupt && (
                        <span className="chip ch-corrupt flex items-center gap-0.5">
                          <Lock size={10} /> Corruption
                        </span>
                      )}
                      {p.escalated && (
                        <span className="chip ch-overdue flex items-center gap-0.5">
                          <AlertTriangle size={10} /> ESCALATED
                        </span>
                      )}
                      {(p.is_master_dossier || (p.compiled_count && p.compiled_count > 1)) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-black">
                          <Layers size={9} /> MASTER DOSSIER ({p.compiled_count || (p.compiled_reports ? p.compiled_reports.length + 1 : 2)} REPORTS)
                        </span>
                      )}
                    </div>
                    <h4 className={`text-[14px] font-bold ${isCorrupt ? 'text-rose-900 dark:text-rose-200' : 'text-slate-900 dark:text-slate-100'} leading-snug`}>
                      {p.title}
                    </h4>
                    <div className="text-[9px] mono text-slate-500 dark:text-slate-400 mt-1">
                      {p.citizen_name} · {srcLabel(p.source)} · {p.citizen_rank} · {timeAgo(p.created_at)}
                    </div>
                    <div className="path-crumb mt-0.5">{pathStr(p.country, p.territory)}</div>
                    {p.media && p.media.length > 0 && (
                      <div className="text-[8px] mono text-teal-700 dark:text-teal-400 mt-1 flex items-center gap-1">
                        <Paperclip size={10} /> {p.media.length} evidence file{p.media.length > 1 ? 's' : ''} attached
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0" style={{ minWidth: '58px' }}>
                    <div className={`text-[9.5px] mono font-bold ${sla.overdue ? 'a-sla' : ''}`} style={{ color: sla.color }}>
                      {sla.fmt}
                    </div>
                    <div className="text-[7px] mono text-slate-400 dark:text-slate-500 mt-0.5">{sla.overdue ? 'OVERDUE' : 'remaining'}</div>
                  </div>
                </div>

                <div className="w-full h-0.5 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden mb-3.5 border border-slate-300 dark:border-slate-800">
                  <div className="sla-fill" style={{ width: `${sla.pct}%`, background: sla.color }}></div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActivePost(p);
                      go('post_detail');
                    }}
                    className="flex-1 py-2.5 rounded-xl text-xs mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-800"
                  >
                    Inspect
                  </button>

                  {!isRO && p.status !== 'resolved' ? (
                    <>
                      <button
                        onClick={() => updatePostStatus(p.id, 'investigating')}
                        className="px-3.5 py-2.5 rounded-xl text-xs mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-amber-500/40 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                      >
                        Active
                      </button>
                      {queue.filter((other) => other.id !== p.id && other.status !== 'resolved').length > 0 && (
                        <button
                          onClick={() => {
                            if (mergeTargetId === p.id) {
                              setMergeTargetId(null);
                            } else {
                              setMergeTargetId(p.id);
                              const firstOther = queue.find((other) => other.id !== p.id && other.status !== 'resolved');
                              if (firstOther) setSelectedDupToMerge(firstOther.id);
                            }
                          }}
                          className="px-3 py-2.5 rounded-xl text-xs mono font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 flex items-center gap-1 transition-colors"
                          title="Compile & merge duplicate citizen ticket into this Master Dossier"
                        >
                          <Layers size={12} />
                          <span className="hidden sm:inline">Compile</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActivePost(p);
                          go('gov_reply');
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-xs mono font-bold ${
                          isCorrupt
                            ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                            : 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-500/40 hover:bg-teal-500/30'
                        } transition-colors`}
                      >
                        Respond
                      </button>
                    </>
                  ) : (
                    <div className={`flex-1 text-center text-[9px] mono ${isRO ? 'text-slate-400 dark:text-slate-500' : 'text-teal-700 dark:text-teal-400 font-bold'} flex items-center justify-center`}>
                      {isRO ? 'View Only' : 'Closed'}
                    </div>
                  )}
                </div>

                {mergeTargetId === p.id && (
                  <div className="mt-3 p-3 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-300 dark:border-indigo-800 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between text-[10px] font-mono font-black text-indigo-900 dark:text-indigo-200">
                      <span className="flex items-center gap-1.5">
                        <Layers size={11} strokeWidth={1.75} />
                        <span>Compile Duplicate Report Into Master Dossier #{p.id.slice(-6).toUpperCase()}</span>
                      </span>
                      <button onClick={() => setMergeTargetId(null)} className="text-slate-500 hover:text-slate-700">
                        <X size={13} />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={selectedDupToMerge}
                        onChange={(e) => setSelectedDupToMerge(e.target.value)}
                        className="flex-1 text-xs font-bold bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg p-2"
                      >
                        {queue
                          .filter((other) => other.id !== p.id && other.status !== 'resolved')
                          .map((other) => (
                            <option key={other.id} value={other.id}>
                              #{other.id.slice(-6).toUpperCase()} — {other.title} ({other.citizen_name})
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => {
                          if (!selectedDupToMerge) return;
                          mergeDuplicatePostsIntoDossier(p.id, [selectedDupToMerge]);
                          setMergeTargetId(null);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-black shrink-0"
                      >
                        Merge &amp; Compile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Entity Perks & Rewards Dispatch Modal */}
      {dispatchModal !== 'none' && (
        <div className="fixed inset-0 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-500/40 rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-2xl relative overflow-hidden text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                  {dispatchModal === 'digital' ? <Zap size={18} /> : <MapPin size={18} />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono uppercase tracking-wide">
                    {dispatchModal === 'digital'
                      ? 'Dispatch Digital Civic Perk'
                      : 'Issue Allocated HQ Collection Pass'}
                  </h3>
                  <p className="text-[10px] mono text-slate-500 dark:text-slate-400">
                    {dispatchModal === 'digital'
                      ? 'Instant SMS & PWA Inbox delivery for active parish citizens'
                      : 'Generate official Headquarter Desk collection pass for physical awards'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDispatchModal('none')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Success State Receipt */}
            {dispatchSuccess ? (
              <div className="space-y-4 py-2">
                <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono uppercase tracking-wider">
                    {dispatchSuccess.type === 'digital' ? 'Perk Dispatched Successfully!' : 'Collection Pass Issued!'}
                  </h4>
                  <p className="text-[11px] text-slate-800 dark:text-slate-200 font-mono">
                    Sent to: <strong>{dispatchSuccess.recipient}</strong>
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 font-mono text-[10.5px]">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-slate-500">Official Pass / Code:</span>
                    <strong className="text-amber-700 dark:text-amber-300 font-mono font-bold text-xs">{dispatchSuccess.code}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Details:</span>
                    <span className="text-slate-800 dark:text-slate-200">{dispatchSuccess.details}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Delivery Channel:</span>
                    <span className="text-teal-700 dark:text-teal-400 font-bold">PWA Inbox + SMS Alert</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Issued By:</span>
                    <span className="text-slate-700 dark:text-slate-300">{user.real_title_short || 'Entity Admin Desk'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(dispatchSuccess.code);
                      toast(`Code ${dispatchSuccess.code} copied!`, 'emerald');
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-3 rounded-xl text-xs mono flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700"
                  >
                    <Copy size={14} />
                    <span>Copy Code</span>
                  </button>
                  <button
                    onClick={() => setDispatchModal('none')}
                    className="flex-1 bg-teal-600 dark:bg-teal-500 hover:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black py-2 px-3 rounded-xl text-xs mono uppercase tracking-wider"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              /* Interactive Dispatch Form */
              <div className="space-y-3 font-mono text-[11px]">
                {/* Citizen Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <UserPlus size={12} className="text-teal-600 dark:text-teal-400" /> Target Citizen Champion
                  </label>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-teal-500"
                  >
                    {countryPerks.sampleCitizens.map((c, idx) => (
                      <option key={idx} value={`${c.name} (${c.phone}) - ${c.location}`}>
                        {c.name} ({c.phone}) · {c.location} ({c.points} pts)
                      </option>
                    ))}
                  </select>
                </div>

                {dispatchModal === 'digital' ? (
                  /* Digital Perk Fields */
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Gift size={12} className="text-amber-600 dark:text-amber-400" /> [{countryPerks.countryCode}] {countryPerks.countryName} Partner Perk Vouchers
                        </span>
                        <span className="text-[8.5px] text-teal-800 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/30">
                          Model A CSR Pilot (0% Platform Fee)
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {countryPerks.digitalPerks.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setPerkType(p.id);
                              setPerkCode(p.code);
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              perkType === p.id
                                ? 'border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="text-[11px] flex items-center justify-between">
                              <span>{p.name}</span>
                              <span className="text-[7.5px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-1 rounded font-bold">{p.badge}</span>
                            </div>
                            <div className="text-[8.5px] opacity-80 mt-0.5">{p.subtext}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Voucher / Voucher Code
                      </label>
                      <input
                        type="text"
                        value={perkCode}
                        onChange={(e) => setPerkCode(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </>
                ) : (
                  /* Physical Prize HQ Pass Fields */
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Award size={12} className="text-teal-600 dark:text-teal-400" /> Award Item
                      </label>
                      <select
                        value={prizeType}
                        onChange={(e) => setPrizeType(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-teal-500"
                      >
                        <option value="Parish Watchdog Honor Plaque & Solar Lantern">
                          Parish Watchdog Honor Plaque &amp; Solar Lantern
                        </option>
                        <option value="Executive Civic Excellence Duty Medal">
                          Executive Civic Excellence Duty Medal
                        </option>
                        <option value="Solar Home Emergency Lighting System">
                          Solar Home Emergency Lighting System
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Allocated HQ Collection Room
                      </label>
                      <input
                        type="text"
                        value={hqRoom}
                        onChange={(e) => setHqRoom(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Assigned Desk Officer
                      </label>
                      <input
                        type="text"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-[11px] focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (dispatchModal === 'digital') {
                        const code = perkCode || 'NWSC-CIVIC-8841';
                        logAudit('DISPATCH_DIGITAL_PERK', 'ENTITY-DESK', `Dispatched ${perkType === 'data' ? '1GB Data Bundle' : '10% NWSC Discount Voucher'} (${code}) to ${recipient}`);
                        toast(`Digital Perk dispatched to ${recipient.split(' ')[0]}!`, 'emerald');
                        setDispatchSuccess({
                          type: 'digital',
                          code,
                          recipient,
                          details: perkType === 'data' ? '1GB Free Civic Data Bundle credited' : '10% NWSC Utility Water Voucher Code',
                        });
                      } else {
                        const passCode = `PASS-NKW-${Math.floor(1000 + Math.random() * 9000)}`;
                        logAudit('ISSUE_HQ_PASS', 'ENTITY-DESK', `Issued HQ Pickup Pass ${passCode} for ${prizeType} to ${recipient}`);
                        toast(`HQ Pickup Pass ${passCode} generated and issued!`, 'emerald');
                        setDispatchSuccess({
                          type: 'physical',
                          code: passCode,
                          recipient,
                          details: `${prizeType} · Location: ${hqRoom}`,
                        });
                      }
                    }}
                    className="w-full bg-teal-600 dark:bg-teal-500 hover:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black py-2.5 rounded-xl text-xs mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
                  >
                    <Send size={14} />
                    <span>
                      {dispatchModal === 'digital'
                        ? '1-Click Dispatch Perk to Citizen'
                        : 'Generate & Issue HQ Collection Pass'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
