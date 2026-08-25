import React from 'react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Clock, MapPin, Wrench, ShieldCheck, Award, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { timeAgo } from '../utils/helpers';

interface TicketAuditTimelineProps {
  post: Post;
}

export const TicketAuditTimeline: React.FC<TicketAuditTimelineProps> = ({ post }) => {
  const { user, markPostSatisfied, addPoints, toast, go, setVerifyTarget } = useApp();

  const isResolved = post.status === 'resolved';
  const isInvestigating = ['investigating', 'budget', 'resolved'].includes(post.status);
  const isGovResponded = post.comments.some((c) => c.role === 'gov') || isResolved;
  const isCitizenConfirmed = post.citizen_satisfied === true;

  const handleConfirmResolution = () => {
    markPostSatisfied(post.id, true);
    if (user && user.role === 'citizen') {
      addPoints(user.id, 250, '+250 CivicScore · Proof of Resolution Confirmed');
    }
  };

  const steps = [
    {
      step: 1,
      title: 'Citizen SPEAKS (Filed)',
      desc: `Registered on ${post.territory.parish || 'Parish Node'} · ${timeAgo(post.created_at)}`,
      completed: true,
      icon: MapPin,
      badge: 'Step 1 Complete',
    },
    {
      step: 2,
      title: 'Department Assigned & Triaged',
      desc: `Routed to ${post.dept.toUpperCase()} with statutory SLA`,
      completed: true,
      icon: Clock,
      badge: 'Triaged',
    },
    {
      step: 3,
      title: 'Government SERVES (Work Dispatched)',
      desc: isGovResponded
        ? 'Official Response & Field Crew Dispatched'
        : 'Awaiting Official Acknowledgment & Crew Schedule',
      completed: isGovResponded,
      icon: Wrench,
      badge: isGovResponded ? 'Dispatched' : 'Pending Response',
    },
    {
      step: 4,
      title: 'Proof of Resolution Uploaded',
      desc: isResolved
        ? 'Field verification photos & contractor signoff recorded'
        : 'Field crew resolving issue on ground',
      completed: isResolved,
      icon: CheckCircle2,
      badge: isResolved ? 'Proof Verified' : 'In Progress',
    },
    {
      step: 5,
      title: 'Citizen Confirms HEARD (Resolution Signoff)',
      desc: isCitizenConfirmed
        ? 'Citizen verified and sealed with +250 CivicScore'
        : isResolved
        ? 'Awaiting citizen inspection & satisfaction signoff'
        : 'Pending physical completion',
      completed: isCitizenConfirmed,
      icon: Award,
      badge: isCitizenConfirmed ? 'Sealed ✓' : 'Awaiting Signoff',
    },
  ];

  return (
    <div className="card p-4 space-y-3.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm transition-colors">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
          <span className="text-[11px] font-black mono uppercase tracking-wider text-slate-900 dark:text-slate-100">
            5-Stage Sovereign Audit Stepper
          </span>
        </div>
        <button
          onClick={() => {
            setVerifyTarget('UG-CERT-8841');
            go('verify');
          }}
          className="text-[8.5px] mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Ledger Seal</span>
          <ExternalLink size={10} />
        </button>
      </div>

      {/* Stepper Chain */}
      <div className="space-y-3 relative pl-2">
        {/* Continuous Connecting Line */}
        <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-800 pointer-events-none" />

        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = s.completed;
          return (
            <div key={idx} className="relative flex items-start gap-3 text-left">
              {/* Step Pip */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-[10px] mono font-black transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                }`}
              >
                {isDone ? <CheckCircle2 size={12} className="stroke-[3]" /> : s.step}
              </div>

              {/* Step Info */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span
                    className={`text-[10px] font-black mono uppercase tracking-wide ${
                      isDone ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {s.title}
                  </span>
                  <span
                    className={`text-[7.5px] mono font-bold px-1.5 py-0.2 rounded-md ${
                      isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {s.badge}
                  </span>
                </div>
                <p className="text-[9px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Before vs After Resolution Showcase (if resolved) */}
      {isResolved && (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[9px] mono font-bold uppercase text-slate-700 dark:text-slate-300">
            <span>Proof of Resolution (Before vs After)</span>
            <span className="text-emerald-600 dark:text-emerald-400">Verified by Field Inspection</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-black relative">
              <img
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80"
                alt="Before Incident"
                className="w-full h-20 object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 left-1 bg-rose-950/90 text-rose-200 text-[7.5px] mono font-bold px-1.5 py-0.2 rounded border border-rose-500/40">
                BEFORE (Citizen Filed)
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-emerald-500/40 bg-black relative">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80"
                alt="After Resolution"
                className="w-full h-20 object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-1 left-1 bg-emerald-950/90 text-emerald-200 text-[7.5px] mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/40">
                AFTER (Fixed & Sealed)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Citizen 1-Click Confirmation & Satisfaction Reward Trigger */}
      {isResolved && !isCitizenConfirmed && (
        <div className="p-3 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 space-y-2 text-center">
          <div className="text-[10px] mono font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wide">
            Citizen Quality Verification Required
          </div>
          <p className="text-[9px] text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
            Has this work been fully delivered to satisfaction on ground? Confirm to release statutory signoff and claim{' '}
            <strong>+250 CivicScore</strong>.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleConfirmResolution}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] mono font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={13} />
              <span>Confirm & +250pts</span>
            </button>
            <button
              onClick={() => {
                markPostSatisfied(post.id, false);
                toast('Disputed resolution — escalated to Regional Commissioner', 'amber');
              }}
              className="w-full py-2 px-3 bg-rose-100 dark:bg-rose-950/50 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 rounded-xl text-[10px] mono font-bold uppercase tracking-wider transition-all"
            >
              <span>Dispute / Escalate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
