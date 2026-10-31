import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Wrench,
  Camera,
  CheckCircle2,
  Landmark,
  HardHat,
  ChevronDown,
  ChevronUp,
  X,
  Upload,
  Sparkles,
  MapPin,
  Lock,
  Unlock,
  Eye,
  FileCheck2,
} from 'lucide-react';
import { Project, DefectItem, UserSession, Post } from '../types';

interface DefectsLiabilityPanelProps {
  project: Project;
  signingRole: 'awarder' | 'contractor';
  user: UserSession | null;
  posts: Post[];
  toast: (msg: string, type?: 'emerald' | 'amber' | 'red') => void;
  onOpenLightbox?: (url: string, caption: string) => void;
  onReleaseRetentionSuccess?: (warrant: any) => void;
}

export const DefectsLiabilityPanel: React.FC<DefectsLiabilityPanelProps> = ({
  project,
  signingRole,
  user,
  posts,
  toast,
  onOpenLightbox,
  onReleaseRetentionSuccess,
}) => {
  // Calculate 5% retention escrow fund
  const totalNumeric = parseInt(project.value.replace(/[^0-9]/g, '')) || 920000000;
  const retentionEscrowAmount = Math.round(totalNumeric * 0.05);
  const currency = project.country === 'KE' ? 'KES' : project.country === 'NG' ? 'NGN' : 'UGX';

  // Days left in 12-month defects liability window
  const dlpDaysRemaining = 284;

  const initialDefectItems: DefectItem[] = [
    {
      id: 'def-1',
      title: 'Bukoto Junction: Silted culvert outlet causing backflow after heavy rain',
      location: 'Chainage 1+800 (Bukoto Junction)',
      reportedBy: 'Kisaasi Local Watchdog Committee',
      reportedAt: '2026-08-14',
      severity: 'critical',
      description: 'Runoff and red soil silting up 600mm precast pipe outlet. Standing water pooling on fresh asphalt edge.',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      status: 'flagged',
    },
    {
      id: 'def-2',
      title: 'Longitudinal hairline asphalt edge crack along outer shoulder',
      location: 'Chainage 2+450 (Near Shell Bukoto)',
      reportedBy: 'Eng. Kasule Patrick (Corridor Watch)',
      reportedAt: '2026-08-20',
      severity: 'medium',
      description: 'Hairline settlement crack approximately 12m length along edge beam. Requires hot-pour bitumen sealant.',
      photoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
      status: 'flagged',
    },
    {
      id: 'def-3',
      title: 'Loose solar panel bracket on mast #14 near trading centre',
      location: 'Chainage 0+750 (Trading Centre)',
      reportedBy: 'Boda Stage Secretary (Bukoto Central)',
      reportedAt: '2026-08-22',
      severity: 'low',
      description: 'Vibrations loosened top mounting clamp. Light works at night but solar array is tilted away from true azimuth.',
      photoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      status: 'flagged',
    },
  ];

  const [defects, setDefects] = useState<DefectItem[]>(() => {
    return project.defects && project.defects.length > 0 ? project.defects : initialDefectItems;
  });

  const [isRetentionReleased, setIsRetentionReleased] = useState<boolean>(Boolean(project.retentionFundReleased));
  const [retentionWarrant, setRetentionWarrant] = useState<any | null>(null);
  const [isReleasingRetention, setIsReleasingRetention] = useState(false);

  // Rectification modal state
  const [selectedDefectForFix, setSelectedDefectForFix] = useState<DefectItem | null>(null);
  const [rectificationCrewLead, setRectificationCrewLead] = useState('Senior Road Maintenance Foreman');
  const [rectificationNotes, setRectificationNotes] = useState('');
  const [rectificationPhotoUrl, setRectificationPhotoUrl] = useState('');

  // Sample repair photos presets for 1-tap testing
  const REPAIR_PHOTO_PRESETS = [
    {
      title: 'Desilted Precast Culvert & Concrete Headwall Flushed',
      url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
      note: 'Desilted 600mm pipe culvert; washed headwall clean and cleared stone pitch discharge apron to stream.',
    },
    {
      title: 'Hot-Pour Elastomeric Bitumen Crack Sealant Applied',
      url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
      note: 'Crack grooved to 15mm, blown dry with compressed air, and hot polymer bitumen sealant injected flush to road.',
    },
    {
      title: 'Solar Mast Plinth Bracket Re-Torqued & Calibrated',
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      note: 'Replaced stainless U-bolts, calibrated tilt angle to 15° south, and verified night luminaire trigger.',
    },
  ];

  const handleOpenRectificationModal = (item: DefectItem) => {
    setSelectedDefectForFix(item);
    setRectificationCrewLead('Senior Maintenance Engineer · ' + project.contractor);
    setRectificationNotes(item.rectificationNotes || '');
    setRectificationPhotoUrl(item.rectificationPhotoUrl || REPAIR_PHOTO_PRESETS[0].url);
  };

  const handleSubmitRectification = () => {
    if (!selectedDefectForFix) return;
    if (!rectificationPhotoUrl.trim()) {
      toast('Mandatory photo proof required for defect rectification sign-off!', 'amber');
      return;
    }

    const updated = defects.map((d) => {
      if (d.id === selectedDefectForFix.id) {
        return {
          ...d,
          status: 'rectified' as const,
          rectifiedBy: rectificationCrewLead,
          rectifiedAt: new Date().toISOString().split('T')[0],
          rectificationNotes: rectificationNotes || 'Defect successfully repaired on site in accordance with technical specifications.',
          rectificationPhotoUrl: rectificationPhotoUrl,
        };
      }
      return d;
    });

    setDefects(updated);
    toast(`Rectification submitted for "${selectedDefectForFix.title}". Ready for Procuring Entity review.`, 'emerald');
    setSelectedDefectForFix(null);
  };

  const handleSupervisingEngineerVerifyDefect = (id: string) => {
    if (signingRole !== 'awarder') {
      toast('ACCESS DENIED: Only Procuring Entity (Gov Supervising Engineer) can verify cleared defects!', 'amber');
      return;
    }

    const target = defects.find((d) => d.id === id);
    if (!target) return;
    if (target.status !== 'rectified') {
      toast('Contractor must first submit physical rectification proof before technical clearance!', 'amber');
      return;
    }

    const updated = defects.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          status: 'verified_cleared' as const,
          supervisingVerifiedAt: new Date().toISOString().split('T')[0],
        };
      }
      return d;
    });

    setDefects(updated);
    toast(`Defect verified & cleared by Supervising Engineer!`, 'emerald');
  };

  const handleReleaseRetentionEscrow = async () => {
    if (signingRole !== 'awarder') {
      toast('ACCESS DENIED: Only the Procuring Entity (Accounting Officer / Supervising Engineer) can authorize Final Escrow Release!', 'amber');
      return;
    }

    const unresolved = defects.filter((d) => d.status !== 'verified_cleared');
    if (unresolved.length > 0) {
      toast(`BLOCKED: There are still ${unresolved.length} unresolved/uncleared defects on this corridor! All defects must be rectified and cleared first.`, 'amber');
      return;
    }

    setIsReleasingRetention(true);
    try {
      const res = await fetch('/api/disbursements/release-retention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          projectTitle: project.title,
          contractor: project.contractor,
          country: project.country || 'UG',
          retentionAmount: retentionEscrowAmount,
          currency,
          awarderSigner: user?.name || 'Supervising Engineer (Procuring Entity)',
        }),
      });
      const data = await res.json();
      if (data.success && data.warrant) {
        setIsRetentionReleased(true);
        setRetentionWarrant(data.warrant);
        if (onReleaseRetentionSuccess) {
          onReleaseRetentionSuccess(data.warrant);
        }
        toast(
          `Final Handover Certificate & 5% Retention Escrow of ${currency} ${retentionEscrowAmount.toLocaleString()} released to ${project.contractor}!`,
          'emerald'
        );
      }
    } catch {
      // Fallback in-client mock
      const warrant = {
        warrantNumber: 'RET-WNT-UG-' + Math.floor(100000 + Math.random() * 900000),
        retentionAmount: retentionEscrowAmount,
        currency,
        status: 'final_retention_disbursed',
        sha256Seal: 'FIDIC-CLEAR-UG-' + Date.now().toString(16).toUpperCase(),
      };
      setIsRetentionReleased(true);
      setRetentionWarrant(warrant);
      toast(
        `Final Handover Certificate & 5% Retention Escrow of ${currency} ${retentionEscrowAmount.toLocaleString()} released!`,
        'emerald'
      );
    } finally {
      setIsReleasingRetention(false);
    }
  };

  const clearedCount = defects.filter((d) => d.status === 'verified_cleared').length;
  const rectifiedPendingVerification = defects.filter((d) => d.status === 'rectified').length;
  const flaggedCount = defects.filter((d) => d.status === 'flagged').length;

  return (
    <div className="card p-5 border-2 border-amber-500/40 dark:border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 shadow-md rounded-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-amber-600" />
              12-Month Defects Liability Period (DLP)
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
              <Clock size={12} /> {dlpDaysRemaining} Days Remaining
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Citizen Warranty Watch &amp; 5% Retention Escrow Lock
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            During the 12-month post-completion warranty window, 5% of the total contract value remains locked in Bank of Uganda / Treasury Escrow until all citizen-reported defects along the corridor are rectified and cleared by the Supervising Engineer.
          </p>
        </div>

        {/* Escrow Status Pill */}
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/30 text-right shrink-0">
          <span className="text-[9.5px] uppercase font-bold text-slate-500 block">5% Retention Escrow Hold</span>
          <div className="text-base font-black text-amber-700 dark:text-amber-400">
            {currency} {retentionEscrowAmount.toLocaleString()}
          </div>
          <div className="text-[9.5px] font-bold mt-0.5 flex items-center justify-end gap-1">
            {isRetentionReleased ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Unlock size={11} /> Escrow Released &amp; Settled
              </span>
            ) : (
              <span className="text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Lock size={11} /> Locked in BoU Project Escrow
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress & Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[9.5px] text-slate-500 uppercase block font-bold">Corridor Defect Reports</span>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100">{defects.length} Total Flagged</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[9.5px] text-slate-500 uppercase block font-bold">Rectification State</span>
          <span className="text-base font-bold text-amber-700 dark:text-amber-400">
            {rectifiedPendingVerification} Pending Clearance · {flaggedCount} Open
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[9.5px] text-slate-500 uppercase block font-bold">Cleared by Supervising Eng</span>
          <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
            {clearedCount} / {defects.length} ({Math.round((clearedCount / (defects.length || 1)) * 100)}%)
          </span>
        </div>
      </div>

      {/* Live Defect Radar List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider flex items-center gap-1.5">
            <Wrench size={14} className="text-amber-600" />
            Live Citizen Defect Radar along Corridor
          </span>
          <span className="text-[9.5px] text-slate-500">FIDIC Red Book Clause 11 Compliant</span>
        </div>

        <div className="space-y-2.5">
          {defects.map((d) => {
            const isCleared = d.status === 'verified_cleared';
            const isRectified = d.status === 'rectified';

            return (
              <div
                key={d.id}
                className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                  isCleared
                    ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800/40'
                    : isRectified
                    ? 'bg-amber-50/60 border-amber-300 dark:bg-amber-950/20 dark:border-amber-700/40'
                    : 'bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded ${
                          d.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : d.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {d.severity} priority
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{d.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <MapPin size={10} /> {d.location}
                      </span>
                      <span>•</span>
                      <span>Flagged by: {d.reportedBy} ({d.reportedAt})</span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                      isCleared
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300'
                        : isRectified
                        ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-300'
                        : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {isCleared ? 'Defect Cleared ✓' : isRectified ? 'Rectification Awaiting Audit' : 'Open Defect'}
                  </span>
                </div>

                <p className="text-[10.5px] text-slate-700 dark:text-slate-300">{d.description}</p>

                {/* Evidence Photo & Rectification Comparison */}
                <div className="flex items-center gap-2 overflow-x-auto pt-1">
                  {d.photoUrl && (
                    <div
                      onClick={() => onOpenLightbox && onOpenLightbox(d.photoUrl!, `Citizen Defect Report: ${d.title}`)}
                      className="cursor-pointer group relative shrink-0 w-28 h-20 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-black"
                    >
                      <img src={d.photoUrl} alt="Defect" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/75 px-1 py-0.5 text-[8px] text-white text-center font-bold">
                        Citizen Photo (Flagged)
                      </div>
                    </div>
                  )}

                  {d.rectificationPhotoUrl && (
                    <div
                      onClick={() => onOpenLightbox && onOpenLightbox(d.rectificationPhotoUrl!, `Rectification Fix: ${d.title}`)}
                      className="cursor-pointer group relative shrink-0 w-28 h-20 rounded-lg overflow-hidden border-2 border-emerald-500 bg-black"
                    >
                      <img src={d.rectificationPhotoUrl} alt="Fix" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                      <div className="absolute inset-x-0 bottom-0 bg-emerald-900/90 px-1 py-0.5 text-[8px] text-white text-center font-bold">
                        Repaired Photo (Contractor)
                      </div>
                    </div>
                  )}

                  {d.rectificationNotes && (
                    <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-[9.5px] text-slate-600 dark:text-slate-300 max-w-sm">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block">
                        Rectification Action ({d.rectifiedBy}):
                      </span>
                      {d.rectificationNotes}
                    </div>
                  )}
                </div>

                {/* Action Buttons for this defect */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-[9.5px] text-slate-500">
                    {isCleared && d.supervisingVerifiedAt && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Cleared by Area Resident Engineer on {d.supervisingVerifiedAt}
                      </span>
                    )}
                    {isRectified && !isCleared && (
                      <span className="text-amber-800 dark:text-amber-400 font-semibold">
                        Contractor repair submitted. Pending Procuring Supervising Engineer audit.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Contractor Action: Dispatch Rectification */}
                    {!isCleared && (
                      <button
                        type="button"
                        onClick={() => handleOpenRectificationModal(d)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                      >
                        <Wrench size={12} />
                        <span>{isRectified ? 'Update Rectification Proof' : 'Dispatch Rectification Crew'}</span>
                      </button>
                    )}

                    {/* Procuring Entity Action: Verify & Clear Defect */}
                    {isRectified && !isCleared && (
                      <button
                        type="button"
                        onClick={() => handleSupervisingEngineerVerifyDefect(d.id)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                      >
                        <Landmark size={12} />
                        <span>Verify Fix &amp; Clear Defect (Gov)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Escrow Release Authorization Card */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-3">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Final Milestone: PPDA / FIDIC Technical Handover &amp; Retention Release
            </span>
            <div className="text-sm font-black text-slate-900 dark:text-white">
              Release 5% Retention Escrow ({currency} {retentionEscrowAmount.toLocaleString()})
            </div>
            <p className="text-[10.5px] text-slate-600 dark:text-slate-400 mt-0.5">
              Available when all {defects.length} corridor defects are 100% verified and cleared by the Procuring Entity Supervising Engineer.
            </p>
          </div>

          {!isRetentionReleased ? (
            <button
              type="button"
              onClick={handleReleaseRetentionEscrow}
              disabled={isReleasingRetention || clearedCount < defects.length}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Landmark size={15} />
              <span>
                {clearedCount < defects.length
                  ? `Clear All Defects to Release (${clearedCount}/${defects.length})`
                  : isReleasingRetention
                  ? 'Authorizing MoFPED Release...'
                  : 'Issue Final Handover & Release Escrow →'}
              </span>
            </button>
          ) : (
            <div className="text-right">
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 justify-end">
                <CheckCircle2 size={16} /> 5% Retention Escrow Released &amp; Paid
              </span>
              <span className="text-[9.5px] text-slate-500 font-mono">
                Warrant: {retentionWarrant?.warrantNumber || 'RET-WNT-UG-991204'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CONTRACTOR RECTIFICATION ATTACHMENT */}
      {selectedDefectForFix && (
        <div
          onClick={() => setSelectedDefectForFix(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#161a22] border border-amber-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto text-slate-900 dark:text-slate-100"
          >
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0">
                  <Wrench size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold block">
                    Defects Liability Period · Rectification Protocol
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Submit Defect Rectification Proof
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDefectForFix(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Defect Item</span>
              <div className="font-bold text-slate-900 dark:text-white">{selectedDefectForFix.title}</div>
              <div className="text-[10px] text-slate-500">{selectedDefectForFix.location}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
                Repair Crew Lead / Subcontractor
              </label>
              <input
                type="text"
                value={rectificationCrewLead}
                onChange={(e) => setRectificationCrewLead(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-slate-300 dark:border-slate-800 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
                Rectification Engineering Notes
              </label>
              <textarea
                rows={2}
                value={rectificationNotes}
                onChange={(e) => setRectificationNotes(e.target.value)}
                placeholder="Describe works carried out: hydraulic desilting, bitumen injection, compaction, fixture replacement..."
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-slate-300 dark:border-slate-800 rounded-xl"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" /> 1-Tap Sample Repair Proof Presets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {REPAIR_PHOTO_PRESETS.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => {
                      setRectificationPhotoUrl(p.url);
                      setRectificationNotes(p.note);
                    }}
                    className={`p-2 rounded-xl border text-left text-[10px] transition-all ${
                      rectificationPhotoUrl === p.url
                        ? 'border-amber-500 bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <img src={p.url} alt={p.title} className="w-full h-12 object-cover rounded mb-1" />
                    <span className="line-clamp-2">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
                Repair Photographic Proof URL
              </label>
              <input
                type="text"
                value={rectificationPhotoUrl}
                onChange={(e) => setRectificationPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-slate-300 dark:border-slate-800 rounded-xl"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedDefectForFix(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRectification}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
              >
                <Upload size={14} />
                <span>Submit Rectification Proof →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
