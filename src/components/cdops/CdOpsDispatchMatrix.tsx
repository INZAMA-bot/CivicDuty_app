import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Radio,
  Clock,
  Handshake,
  CheckCircle2,
  AlertCircle,
  Users,
  Send,
  UserCheck,
  Briefcase,
  ChevronRight,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  CD_OPS_DISPATCH_TRACKS,
  CdOpsDispatchTrack,
  CdOpsStaffMember,
} from '../../data/partnerships';
import { COUNTRIES } from '../../data/countries';

export const CdOpsDispatchMatrix: React.FC = () => {
  const {
    cdOpsStaffList,
    govFeedbackMessages,
    assignStaffToFeedback,
    updateGovFeedbackPriority,
    toast,
  } = useApp();

  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('ALL');

  // Compute workload per staff
  const staffWorkloadMap: Record<string, number> = {};
  cdOpsStaffList.forEach((s) => {
    staffWorkloadMap[s.name] = 0;
  });
  govFeedbackMessages.forEach((msg) => {
    if (msg.assignedStaff && staffWorkloadMap[msg.assignedStaff] !== undefined) {
      staffWorkloadMap[msg.assignedStaff]++;
    }
  });

  const handleReassign = (feedbackId: string, staffName: string) => {
    assignStaffToFeedback(feedbackId, staffName);
  };

  const filteredMessages = govFeedbackMessages.filter((msg) => {
    if (selectedTrackFilter === 'ALL') return true;
    if (selectedTrackFilter === 'statutory_directives')
      return msg.priority === 'statutory_directive';
    if (selectedTrackFilter === 'telecom_ussd')
      return (
        msg.subject.toLowerCase().includes('ussd') ||
        msg.subject.toLowerCase().includes('shortcode') ||
        msg.message.toLowerCase().includes('*3030#')
      );
    if (selectedTrackFilter === 'sla_calibration')
      return (
        msg.subject.toLowerCase().includes('sla') ||
        msg.subject.toLowerCase().includes('threshold') ||
        msg.message.toLowerCase().includes('hours')
      );
    if (selectedTrackFilter === 'grassroots_sync')
      return (
        msg.subject.toLowerCase().includes('parish') ||
        msg.subject.toLowerCase().includes('pdm') ||
        msg.subject.toLowerCase().includes('district')
      );
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="card p-5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Layers size={18} />
            </div>
            <div>
              <span className="text-[10px] mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                Staff Dispatch Matrix &amp; Operational Assignments
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                5 Mission-Critical Assignments Necessary for CD-Ops Staff
              </h3>
            </div>
          </div>

          <span className="text-[10px] mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 size={12} /> {govFeedbackMessages.length} Directives Dispatched &amp; Tracked
          </span>
        </div>

        <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          To maintain sovereign reliability and statutory accord adherence, ministerial requests and operational tickets are categorized into 5 technical dispatch tracks. Each track requires specific engineering competencies and carries statutory SLAs.
        </p>
      </div>

      {/* The 5 Dispatch Tracks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {CD_OPS_DISPATCH_TRACKS.map((track) => {
          const isSelected = selectedTrackFilter === track.id;
          return (
            <div
              key={track.id}
              onClick={() => setSelectedTrackFilter(isSelected ? 'ALL' : track.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 bg-white dark:bg-slate-900 ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[8.5px] mono font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {track.badge}
                  </span>
                  <span
                    className={`text-[8.5px] mono font-bold uppercase px-1.5 py-0.2 rounded ${
                      track.priority === 'statutory_directive'
                        ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                        : track.priority === 'urgent'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : 'bg-teal-500/20 text-teal-700 dark:text-teal-300'
                    }`}
                  >
                    Target SLA: {track.slaTargetHours}h
                  </span>
                </div>

                <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                  {track.title}
                </h4>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {track.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Required Specialization:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {track.requiredRole.split(' ')[0]}...
                  </span>
                </div>
                <div className="text-[9px] mono text-amber-600 dark:text-amber-400 font-bold">
                  {isSelected ? 'Filter Active (Click to Clear)' : 'Click to filter directives'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Capacity & Workload Balance */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-amber-600" />
              <span>Active CD-Ops Staff Capacity &amp; Workload Distribution</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live queue balance across operational engineers on duty
            </p>
          </div>
          <span className="text-[10px] mono text-slate-500">
            {cdOpsStaffList.length} staff on roster
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {cdOpsStaffList.map((staff) => {
            const count = staffWorkloadMap[staff.name] || 0;
            return (
              <div
                key={staff.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3"
              >
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {staff.name}
                  </h5>
                  <p className="text-[9.5px] text-slate-500 dark:text-slate-400 truncate">
                    {staff.role}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                      {count} {count === 1 ? 'task' : 'tasks'} assigned
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Directives Dispatch Table */}
      <div className="card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Send size={16} className="text-teal-600" />
              <span>Directives &amp; Inquiries Awaiting Staff Dispatch</span>
              {selectedTrackFilter !== 'ALL' && (
                <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                  Filtered by {selectedTrackFilter.replace(/_/g, ' ')}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign or reassign any incoming statutory directive to qualified engineers on duty
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredMessages.map((msg) => {
            const country = COUNTRIES[msg.countryCode as any];
            return (
              <div
                key={msg.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {msg.countryCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {msg.senderOfficer}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({msg.senderMinistry}, {msg.countryName})
                      </span>
                    </div>
                    <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 mt-1">
                      {msg.subject}
                    </h5>
                  </div>

                  <span
                    className={`text-[8.5px] mono font-bold uppercase px-2 py-0.5 rounded-md ${
                      msg.priority === 'statutory_directive'
                        ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                        : msg.priority === 'urgent'
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {msg.priority.replace(/_/g, ' ')}
                  </span>
                </div>

                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {msg.message}
                </p>

                {/* Dispatch Selector Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10.5px] mono font-bold text-slate-500">
                      Dispatched Engineer:
                    </span>
                    <select
                      value={msg.assignedStaff || ''}
                      onChange={(e) => handleReassign(msg.id, e.target.value)}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-300 focus:outline-hidden"
                    >
                      <option value="" disabled>
                        Select Staff Member to Dispatch...
                      </option>
                      {cdOpsStaffList.map((st) => (
                        <option key={st.id} value={st.name}>
                          {st.name} ({st.role.split(' ')[0]}...) · {st.status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] mono text-slate-500">
                    <span>Receipt: {msg.dispatchReceiptHash ? msg.dispatchReceiptHash.slice(0, 10) + '...' : 'Pending'}</span>
                    <span>·</span>
                    <span className="capitalize">{msg.status.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
