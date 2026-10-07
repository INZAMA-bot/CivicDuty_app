import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  HardHat, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  Activity, 
  Edit3, 
  ShieldCheck, 
  Gift, 
  Zap, 
  Building2, 
  ListChecks, 
  BadgeCheck,
  Send,
  Ticket,
  Briefcase,
  Lock,
  Landmark,
  Check,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { PostCardComponent } from '../components/PostCardComponent';
import { RewardModal } from '../components/RewardModal';
import { ProjectMilestone, Post } from '../types';
import { saveFiscalVoucherToCloud } from '../services/firestoreSync';
import { getCountryCapacityPresets } from '../data/tiers';

export const ProjectView: React.FC = () => {
  const { activeProject, projects, posts, user, go, setActiveProject, toast, addPost } = useApp();

  const proj = activeProject || projects[0];
  const countryCode = proj?.country || user?.country || 'UG';
  const capacityPresets = getCountryCapacityPresets(countryCode);

  const [commentText, setCommentText] = useState('');
  const [inspectorCapacity, setInspectorCapacity] = useState(capacityPresets[4] || capacityPresets[0] || 'Local Resident / Community Watchdog');
  const [progressPct, setProgressPct] = useState(65);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [selectedCitizenForReward, setSelectedCitizenForReward] = useState<{ name: string; phone?: string; postId?: string }>({
    name: 'Inzama Robin',
    phone: '+256 778 277 900 / +256 748 338 796',
  });

  // Keep inspectorCapacity updated if country changes
  useEffect(() => {
    if (capacityPresets && capacityPresets.length > 0) {
      setInspectorCapacity(capacityPresets[4] || capacityPresets[0]);
    }
  }, [countryCode]);

  const defaultMilestones: ProjectMilestone[] = [
    {
      id: '1',
      title: 'Phase 1: Bush Clearing, Site Preparation & Setting Foundation',
      date: 'Jan 2026',
      done: true,
      awarderVerified: true,
      awarderSignedBy: 'Supervising Engineer (Gov)',
      awarderSignedAt: '2026-01-15',
      contractorVerified: true,
      contractorSignedBy: 'Lead Engineer (Contractor)',
      contractorSignedAt: '2026-01-18',
    },
    {
      id: '2',
      title: 'Phase 2: Contract Award & Site Handover Clearance',
      date: 'Feb 2026',
      done: true,
      awarderVerified: true,
      awarderSignedBy: 'Procurement Officer (Gov)',
      awarderSignedAt: '2026-02-01',
      contractorVerified: true,
      contractorSignedBy: 'Managing Director (Contractor)',
      contractorSignedAt: '2026-02-02',
    },
    {
      id: '3',
      title: 'Phase 3: Substructure Drainage Channel Heavy Excavation',
      date: 'May 2026',
      done: false,
      awarderVerified: true,
      awarderSignedBy: 'Resident Engineer (Gov)',
      awarderSignedAt: '2026-05-10',
      contractorVerified: false,
    },
    {
      id: '4',
      title: 'Phase 4: Concrete Box Culvert Installation & Subgrade Laying',
      date: 'In Progress',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
    },
    {
      id: '5',
      title: 'Phase 5: Road Surfacing Tarmacking & Solar Lighting Works',
      date: 'Est. Sep 2026',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
    },
    {
      id: '6',
      title: 'Phase 6: Final Technical Audit & Handover Certificate',
      date: 'Est. Nov 2026',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
    },
  ];

  const [milestones, setMilestones] = useState<ProjectMilestone[]>(() => {
    return proj?.milestones && proj.milestones.length > 0 ? proj.milestones : defaultMilestones;
  });

  const [signingRole, setSigningRole] = useState<'awarder' | 'contractor'>('awarder');
  const [newWallMilestoneTitle, setNewWallMilestoneTitle] = useState('');
  const [newWallMilestoneDate, setNewWallMilestoneDate] = useState('');

  useEffect(() => {
    if (proj?.milestones && proj.milestones.length > 0) {
      setMilestones(proj.milestones);
    } else {
      setMilestones(defaultMilestones);
    }
  }, [proj?.id]);

  const canUpdateProject = user && (user.role === 'node_admin' || user.role === 'spokesperson' || user.role === 'platform_admin' || user.is_utility);

  if (!proj) {
    return (
      <div className="p-4 space-y-4 animate-fade-in pb-12 text-center text-slate-800 dark:text-slate-100">
        <button
          onClick={() => go('feed')}
          className="flex items-center gap-1 text-[10px] mono text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 mb-3.5 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <p className="text-sm mono text-slate-600 dark:text-slate-400">No public projects available.</p>
      </div>
    );
  }
  const projectPosts = posts.filter((p) => p.title.toLowerCase().includes(proj.title.toLowerCase()) || p.dept === proj.dept);

  const handlePostProjectFeedback = () => {
    if (!commentText.trim()) {
      toast('Write inspection feedback or result first', 'amber');
      return;
    }

    const roleTitle = inspectorCapacity.trim() || 'Local Resident / Watchdog';
    const authorName = user?.name ? `${user.name} (${roleTitle})` : roleTitle;

    const memoPost: Post = {
      id: 'p-memo-' + Date.now(),
      country: user?.country || proj.country || 'UG',
      dept: proj.dept || 'kcca',
      lane: 'civic',
      territory: {
        district: proj.location || 'Central',
        subcounty: proj.location || 'Central',
        parish: proj.location || 'Central',
      },
      citizen_id: user?.id || 'usr-inspect',
      citizen_name: authorName,
      citizen_rank: roleTitle,
      anonymous: false,
      category: 'other',
      title: `[Inspection Memo: ${roleTitle}] ${proj.title}`,
      body: `Statement Capacity / Designation: ${roleTitle}\n\n${commentText.trim()}`,
      location: proj.location || 'Project Site',
      source: 'web',
      media: [],
      status: 'pending',
      gov_status: 'investigating',
      is_corruption: false,
      created_at: new Date().toISOString(),
      comments: [],
      upvotes: 1,
      citizen_satisfied: null,
      escalated: false,
    };

    addPost(memoPost);
    toast(`Site memo logged under capacity: ${roleTitle}`, 'emerald');
    setCommentText('');
  };

  const [activeVoucher, setActiveVoucher] = useState<any | null>(null);
  const [isMintingVoucher, setIsMintingVoucher] = useState(false);

  const handleGenerateDisbursementVoucher = async (milestone: ProjectMilestone) => {
    setIsMintingVoucher(true);
    try {
      // Calculate estimated milestone tranche from project total
      const totalNumeric = parseInt(proj.value.replace(/[^0-9]/g, '')) || 450000000;
      const trancheGross = Math.round(totalNumeric / (milestones.length || 1));

      const res = await fetch('/api/disbursements/generate-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: proj.id,
          projectTitle: proj.title,
          contractor: proj.contractor,
          country: proj.country || 'UG',
          milestoneId: milestone.id,
          milestoneTitle: milestone.title,
          grossAmount: trancheGross,
          currency: proj.country === 'KE' ? 'KES' : proj.country === 'NG' ? 'NGN' : 'UGX',
          awarderSigner: milestone.awarderSignedBy || user?.name || 'Supervising Engineer',
          contractorSigner: milestone.contractorSignedBy || `${proj.contractor} Executive`,
        }),
      });
      const data = await res.json();
      if (data.success && data.voucher) {
        setActiveVoucher(data.voucher);
        // Persist to Cloud Firestore
        saveFiscalVoucherToCloud(data.voucher).catch(() => {});
        toast(`Fiscal Release Warrant #${data.voucher.voucherNumber} minted! Ready for MoFPED release.`, 'emerald');
      }
    } catch {
      toast('Failed to reach automated treasury minting service.', 'amber');
    } finally {
      setIsMintingVoucher(false);
    }
  };

  const handleReleaseEscrowFunds = async (voucherId: string) => {
    try {
      const res = await fetch('/api/disbursements/release-escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId }),
      });
      const data = await res.json();
      if (data.success && data.voucher) {
        setActiveVoucher(data.voucher);
        // Update voucher status in Cloud Firestore
        saveFiscalVoucherToCloud(data.voucher).catch(() => {});
        toast(data.message, 'emerald');
      }
    } catch {
      toast('Error triggering automated escrow disbursement', 'amber');
    }
  };

  const handleToggleAwarder = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (signingRole !== 'awarder') {
      toast('ACCESS DENIED: Contractor Executives/Engineers CANNOT sign the Procuring Entity slot!', 'amber');
      return;
    }
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextAwarder = !m.awarderVerified;
        const isBoth = nextAwarder && Boolean(m.contractorVerified);
        if (isBoth) {
          toast('Dual Signoff Complete! Phase 100% verified by Procuring Entity & Contractor', 'emerald');
        } else if (nextAwarder) {
          toast('Procuring Entity (Gov Authority) signoff appended', 'emerald');
        } else {
          toast('Procuring Entity signoff removed', 'amber');
        }
        return {
          ...m,
          awarderVerified: nextAwarder,
          awarderSignedBy: nextAwarder ? (user?.name || 'Procuring Entity Supervising Engineer') : undefined,
          awarderSignedAt: nextAwarder ? new Date().toISOString().split('T')[0] : undefined,
          done: isBoth,
        };
      })
    );
  };

  const handleToggleContractor = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (signingRole !== 'contractor') {
      toast('ACCESS DENIED: Government Officials CANNOT sign the Contractor Executive slot!', 'amber');
      return;
    }
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextContractor = !m.contractorVerified;
        const isBoth = Boolean(m.awarderVerified) && nextContractor;
        if (isBoth) {
          toast('Dual Signoff Complete! Phase 100% verified by Government & Contractor', 'emerald');
        } else if (nextContractor) {
          toast('Contractor Executive signoff appended', 'emerald');
        } else {
          toast('Contractor Executive signoff removed', 'amber');
        }
        return {
          ...m,
          contractorVerified: nextContractor,
          contractorSignedBy: nextContractor ? `${proj.contractor} Executive` : undefined,
          contractorSignedAt: nextContractor ? new Date().toISOString().split('T')[0] : undefined,
          done: isBoth,
        };
      })
    );
  };

  const handleAddWallMilestone = () => {
    if (!newWallMilestoneTitle.trim()) {
      toast('Enter milestone deliverable title', 'amber');
      return;
    }
    const item: ProjectMilestone = {
      id: 'm-' + Date.now(),
      title: newWallMilestoneTitle.trim(),
      date: newWallMilestoneDate.trim() || 'Target Stage',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
    };
    setMilestones((prev) => [...prev, item]);
    setNewWallMilestoneTitle('');
    setNewWallMilestoneDate('');
    toast('Milestone added to contract wall!', 'emerald');
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-16 text-slate-800 dark:text-slate-100">
      <div>
        <button
          onClick={() => go('gov_projects')}
          className="flex items-center gap-1 text-[11px] mono text-slate-500 hover:text-amber-700 dark:text-slate-400 dark:hover:text-amber-400 mb-3.5 transition-colors font-bold"
        >
          <ChevronLeft size={14} /> Back to Works & Contracts
        </button>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="chip ch-invest flex items-center gap-1 text-[9.5px]">
            <HardHat size={12} /> {proj.status}
          </span>
          <span className="text-[9.5px] mono text-amber-800 dark:text-amber-300 font-bold bg-amber-600/10 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-600/20 dark:border-amber-500/20">
            Tender: {proj.tender || 'PUBLIC-WORKS-2026'}
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">{proj.title}</h2>
        <p className="text-[12px] mono text-slate-600 dark:text-slate-300 mt-1 font-semibold">{proj.contractor}</p>
      </div>

      {/* Progress Completion Indicator */}
      <div className="card p-4 space-y-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between text-[10px] mono">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-bold">
            <Activity size={13} className="text-amber-600 dark:text-amber-400" /> Physical Execution Completion
          </span>
          <span className="text-amber-800 dark:text-amber-300 font-bold text-xs">{progressPct}% Complete</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {canUpdateProject && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[9px] mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
              <ShieldCheck size={13} /> Area Engineer Verification Active
            </span>
            <button
              onClick={() => {
                const next = progressPct >= 100 ? 25 : progressPct + 15;
                setProgressPct(next);
                toast(`Updated contractor progress to ${next}%`, 'emerald');
              }}
              className="text-[9.5px] mono text-amber-800 dark:text-amber-300 hover:text-amber-900 bg-amber-600/10 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-600/30 dark:border-amber-500/30 font-bold flex items-center gap-1 transition-colors"
            >
              <Edit3 size={11} /> Advance Progress (+15%)
            </button>
          </div>
        )}
      </div>

      {/* Project Specs Grid */}
      <div className="card p-4 grid grid-cols-2 gap-3 text-[10px] mono border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl">
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1 font-bold">
            <HardHat size={12} /> Contractor
          </span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">{proj.contractor}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1 font-bold">
            <DollarSign size={12} /> Total Value
          </span>
          <span className="text-amber-700 dark:text-amber-400 font-bold">{proj.value}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5 flex items-center gap-1 font-bold">
            <Calendar size={12} /> Completion Date
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-semibold">{proj.completes}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Access Code</span>
          <span className="text-amber-800 dark:text-amber-300 font-bold">{proj.code}</span>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="card p-5 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-[11px] mono text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 font-black">
              <ListChecks size={15} className="text-amber-600 dark:text-amber-400" /> Dual-Verified Contract Milestones
            </p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
              Requires 2 independent signatures (Procuring Entity + Contractor Exec) to confirm phase completion.
            </p>
          </div>
          <span className="text-[9px] mono text-amber-800 dark:text-amber-300 bg-amber-600/10 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-600/30 dark:border-amber-500/30 font-bold">
            2-Party Cryptographic Lock
          </span>
        </div>

        {/* Signing Duty Authority Switcher */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mono">
              <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" /> Active Signing Duty Authority:
            </span>
            <span className="text-[9px] mono text-slate-500 dark:text-slate-400">
              Select official role to perform signoff
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mono">
            <button
              type="button"
              onClick={() => {
                setSigningRole('awarder');
                toast('Active Duty set: Procuring Entity (Gov Supervising Engineer)', 'emerald');
              }}
              className={`p-2.5 rounded-lg border font-bold flex items-center justify-between transition-all ${
                signingRole === 'awarder'
                  ? 'bg-teal-50 border-teal-500 text-teal-900 dark:bg-teal-500/20 dark:border-teal-400 dark:text-teal-200 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Landmark size={13} strokeWidth={1.75} />
                <span>Procuring Entity (Gov Authority)</span>
              </span>
              {signingRole === 'awarder' && <span className="text-[9px] bg-teal-600 text-white dark:bg-teal-400 dark:text-slate-950 px-1.5 py-0.5 rounded font-black">ACTIVE</span>}
            </button>

            <button
              type="button"
              onClick={() => {
                setSigningRole('contractor');
                toast('Active Duty set: Contractor Executive / Site Engineer', 'amber');
              }}
              className={`p-2.5 rounded-lg border font-bold flex items-center justify-between transition-all ${
                signingRole === 'contractor'
                  ? 'bg-amber-600/15 border-amber-600/50 text-amber-900 dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-200 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <HardHat size={13} strokeWidth={1.75} />
                <span>Contractor Executive (Site Engineer)</span>
              </span>
              {signingRole === 'contractor' && <span className="text-[9px] bg-amber-700 text-white dark:bg-amber-400 dark:text-slate-950 px-1.5 py-0.5 rounded font-black">ACTIVE</span>}
            </button>
          </div>

          {/* Strict Separation Notice */}
          <div className="text-[9.5px] mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start gap-2">
            <AlertTriangle size={14} strokeWidth={1.75} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">Strict Authority Isolation Enforced</span>
              {signingRole === 'awarder' ? (
                <span className="text-slate-600 dark:text-slate-300">
                  You are currently acting as <strong>Procuring Entity (Gov Authority)</strong>. You can <strong>ONLY</strong> sign the Procuring Entity slot. The Contractor slot is strictly locked for you.
                </span>
              ) : (
                <span className="text-slate-600 dark:text-slate-300">
                  You are currently acting as <strong>Contractor Executive / Site Engineer</strong>. You can <strong>ONLY</strong> sign the Contractor Exec slot. The Procuring Entity slot is strictly locked for you.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {milestones.map((m, idx) => {
            const awarderSigned = Boolean(m.awarderVerified);
            const contractorSigned = Boolean(m.contractorVerified);
            const dualVerified = m.done || (awarderSigned && contractorSigned);
            const countTicks = (awarderSigned ? 1 : 0) + (contractorSigned ? 1 : 0);

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all text-xs mono space-y-3 ${
                  dualVerified
                    ? 'bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/25 dark:border-emerald-500/50 shadow-sm'
                    : countTicks === 1
                    ? 'bg-amber-50/60 border-amber-600/30 dark:bg-amber-950/20 dark:border-amber-500/40'
                    : 'bg-white border-slate-200 dark:bg-slate-950 dark:border-slate-800 shadow-sm'
                }`}
              >
                {/* Phase Header Badges & Verification Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-600/10 text-amber-800 dark:text-amber-300 border border-amber-600/30">
                      PHASE {idx + 1}
                    </span>
                    <span className="text-[9.5px] text-slate-600 dark:text-slate-400 font-bold">Target Stage: {m.date}</span>
                  </div>

                  <span
                    className={`text-[8.5px] font-bold px-2.5 py-1 rounded-md border ${
                      dualVerified
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-500/20 dark:border-emerald-500/50 dark:text-emerald-300'
                        : countTicks === 1
                        ? 'bg-amber-50 border-amber-600/30 text-amber-900 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300'
                        : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {dualVerified ? '2/2 DUAL VERIFIED' : countTicks === 1 ? '1/2 PENDING COUNTERPART' : '0/2 UNVERIFIED'}
                  </span>
                </div>

                {/* Phase Title */}
                <div className="border-l-4 border-amber-600 pl-3 py-1.5 bg-slate-50 dark:bg-slate-900/80 rounded-r-lg">
                  <h3 className={`text-base font-bold tracking-tight leading-snug ${
                    dualVerified ? 'text-emerald-800 dark:text-emerald-200 line-through' : 'text-slate-900 dark:text-white'
                  }`}>
                    {m.title}
                  </h3>
                </div>

                {/* Interactive Dual Signoff Action Row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Tick 1: Procuring Entity / Supervising Officer */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleAwarder(m.id, e)}
                      className={`px-3 py-1.5 rounded-lg border font-bold transition-all flex items-center gap-1.5 text-[10px] ${
                        signingRole === 'awarder'
                          ? awarderSigned
                            ? 'bg-teal-100 border-teal-400 text-teal-900 dark:bg-teal-500/25 dark:border-teal-400 dark:text-teal-200'
                            : 'bg-teal-700 text-white hover:bg-teal-600'
                          : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {signingRole === 'awarder' ? (
                        <><Landmark size={11} strokeWidth={1.75} /> Procuring Entity {awarderSigned ? 'Signed' : '+ Sign'}</>
                      ) : (
                        <><Lock size={11} strokeWidth={1.75} /> Gov Slot Locked {awarderSigned ? '(Signed)' : ''}</>
                      )}
                    </button>

                    {/* Tick 2: Contractor Executive */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleContractor(m.id, e)}
                      className={`px-3 py-1.5 rounded-lg border font-bold transition-all flex items-center gap-1.5 text-[10px] ${
                        signingRole === 'contractor'
                          ? contractorSigned
                            ? 'bg-amber-50 border-amber-600/40 text-amber-900 dark:bg-amber-500/25 dark:border-amber-400 dark:text-amber-200'
                            : 'bg-amber-700 text-white hover:bg-amber-600'
                          : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {signingRole === 'contractor' ? (
                        <><HardHat size={11} strokeWidth={1.75} /> Contractor Exec {contractorSigned ? 'Signed' : '+ Sign'}</>
                      ) : (
                        <><Lock size={11} strokeWidth={1.75} /> Contractor Slot Locked {contractorSigned ? '(Signed)' : ''}</>
                      )}
                    </button>
                  </div>

                  {/* Audit Trail Signatures display */}
                  <div className="text-[9px] text-slate-600 dark:text-slate-400 flex items-center gap-2.5 ml-auto flex-wrap">
                    {m.awarderSignedBy ? (
                      <span className="text-teal-800 dark:text-teal-300 font-bold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800/60">
                        Gov: {m.awarderSignedBy} ({m.awarderSignedAt || 'Verified'})
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">Gov: Pending</span>
                    )}

                    {m.contractorSignedBy ? (
                      <span className="text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                        Exec: {m.contractorSignedBy} ({m.contractorSignedAt || 'Verified'})
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">Exec: Pending</span>
                    )}

                    {dualVerified && (
                      <button
                        type="button"
                        onClick={() => handleGenerateDisbursementVoucher(m)}
                        disabled={isMintingVoucher}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9.5px] transition-colors shadow-xs flex items-center gap-1"
                      >
                        <ShieldCheck size={11} />
                        <span>{isMintingVoucher ? 'Minting...' : 'Mint Fiscal Warrant'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {canUpdateProject && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[8.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-bold">+ Add New Contract Deliverable / Milestone</span>
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="text"
                value={newWallMilestoneTitle}
                onChange={(e) => setNewWallMilestoneTitle(e.target.value)}
                placeholder="Milestone title (e.g. Asphalting Complete)"
                className="col-span-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2"
              />
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newWallMilestoneDate}
                  onChange={(e) => setNewWallMilestoneDate(e.target.value)}
                  placeholder="Stage / Date"
                  className="text-xs w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-2"
                />
                <button
                  onClick={handleAddWallMilestone}
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs px-3 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                  title="Add milestone"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Community & Field Inspection Wall */}
      <div className="space-y-3">
        {/* Wall Reward Banner for Entities & Contractors */}
        <div className="card p-3.5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2 rounded-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-600/20 dark:border-amber-500/30">
                <Gift size={18} />
              </span>
              <div>
                <strong className="text-xs text-amber-900 dark:text-amber-200 block font-bold">
                  Reward Citizen Wall Engagement
                </strong>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  <span className="text-teal-700 dark:text-teal-300 font-semibold">{user?.dept_label || 'Entity Authority'}</span> & Contractor <span className="text-amber-800 dark:text-amber-300 font-semibold">{proj.contractor}</span> can dispatch digital perk vouchers to active citizens.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCitizenForReward({
                  name: projectPosts[0]?.citizen_name || 'Inzama Robin',
                  phone: '+256 778 277 900 / +256 748 338 796',
                  postId: projectPosts[0]?.id,
                });
                setRewardModalOpen(true);
              }}
              className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-3.5 py-2 rounded-xl text-[10px] uppercase tracking-wider mono flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Zap size={13} />
              <span>Reward Wall Watchdog</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">Public & Field Inspection Wall</p>
          <span className="text-[9px] mono text-slate-500">{projectPosts.length} reports</span>
        </div>

        <div className="card p-4 space-y-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <label className="text-[10px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest block flex items-center gap-1.5">
              <Edit3 size={14} /> Log On-Site Inspection Memo
            </label>
            <span className="text-[9px] mono text-slate-500 dark:text-slate-400 font-bold">
              Public Ledger Audit
            </span>
          </div>

          {/* Provision for Title / Official Capacity Selection */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-[9.5px] mono font-bold text-slate-800 dark:text-slate-300">
              <span className="uppercase tracking-wider">Identify Capacity / Title:</span>
              <span className="text-amber-800 dark:text-amber-300 font-semibold">Specify capacity of statement</span>
            </div>

            {/* Quick Capacity Preset Chips */}
            <div className="flex flex-wrap gap-1.5 text-[9.5px] mono">
              {capacityPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInspectorCapacity(preset)}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    inspectorCapacity === preset
                      ? 'bg-amber-600/15 border-amber-600/40 text-amber-900 dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-200 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Custom Capacity Designation Text Provision */}
            <div className="pt-1">
              <input
                type="text"
                value={inspectorCapacity}
                onChange={(e) => setInspectorCapacity(e.target.value)}
                placeholder="Or type custom capacity e.g. World Bank Auditor, RDC, Media Reporter, Site Engineer, Local Resident..."
                className="w-full text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          {/* Statement & Observations Textarea */}
          <div className="space-y-1">
            <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-bold">
              Log Findings & Inspection Observations:
            </label>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Log technical site findings, material quality audit, work progress observation, or local community feedback..."
              className="text-xs resize-none w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3"
            ></textarea>
          </div>

          <button
            onClick={handlePostProjectFeedback}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Log Site Inspection Memo ({inspectorCapacity || 'Unspecified Role'})</span>
          </button>
        </div>

        <div className="space-y-2">
          {projectPosts.length === 0 ? (
            <p className="text-center py-8 text-xs mono text-slate-500">No public reports logged on this project wall yet.</p>
          ) : (
            projectPosts.map((p) => (
              <div key={p.id} className="relative group">
                <PostCardComponent post={p} />
                <div className="px-4 pb-3 -mt-1 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCitizenForReward({
                        name: p.citizen_name || 'Verified Citizen',
                        phone: '+256 778 277 900 / +256 748 338 796',
                        postId: p.id,
                      });
                      setRewardModalOpen(true);
                    }}
                    className="text-[9.5px] mono font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-600/30 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  >
                    <Gift size={11} /> Reward {p.citizen_name.split(' ')[0]} with Perk
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reward Citizen Modal */}
      <RewardModal
        isOpen={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        targetCitizenName={selectedCitizenForReward.name}
        targetCitizenPhone={selectedCitizenForReward.phone}
        postId={selectedCitizenForReward.postId}
        contractorName={proj.contractor}
        entityName={user?.dept_label || proj.dept.toUpperCase()}
        contextTitle={proj.title}
      />

      {/* PHASE 3: FISCAL RELEASE WARRANT & DISBURSEMENT VOUCHER MODAL */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[9px] mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-black block">
                  MoFPED Public Works Electronic Warrant Authority
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">
                  Milestone Disbursement Warrant #{activeVoucher.voucherNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveVoucher(null)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Project / Asset:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{activeVoucher.projectTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contractor Recipient:</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{activeVoucher.contractor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Milestone Deliverable:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{activeVoucher.milestoneTitle}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Milestone Value:</span>
                  <span>{activeVoucher.currency} {activeVoucher.grossAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                  <span>6% Statutory WHT Deduction:</span>
                  <span>- {activeVoucher.currency} {activeVoucher.whtTaxDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-300 dark:border-slate-700">
                  <span>Net Escrow Release Amount:</span>
                  <span>{activeVoucher.currency} {activeVoucher.netPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="text-[10px] mono text-slate-500 dark:text-slate-400 space-y-1">
              <div>• Procuring Signoff: {activeVoucher.awarderSigner}</div>
              <div>• Contractor Signoff: {activeVoucher.contractorSigner}</div>
              <div>• Blockchain Audit Seal: <span className="text-teal-600 dark:text-teal-400 font-bold">{activeVoucher.blockchainSeal}</span></div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800">
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase ${
                activeVoucher.disbursementStatus === 'completed_bank_transfer'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {activeVoucher.disbursementStatus === 'completed_bank_transfer' ? 'Disbursed to Bank' : 'Certified: Pending Release'}
              </span>

              {activeVoucher.disbursementStatus !== 'completed_bank_transfer' ? (
                <button
                  onClick={() => handleReleaseEscrowFunds(activeVoucher.id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck size={14} />
                  <span>Authorize Bank Disbursement Release →</span>
                </button>
              ) : (
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  Warrant Settled via RTGS / Bank Escrow
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
