import React, { useState } from 'react';
import {
  Users,
  Radio,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
  Globe,
  UserPlus,
  Edit3,
  Briefcase,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CdOpsStaffMember } from '../../data/partnerships';
import { COUNTRIES } from '../../data/countries';
import { CdOpsStaffManagerModal } from './CdOpsStaffManagerModal';

export const CdOpsRosterPanel: React.FC = () => {
  const { cdOpsStaffList, activeCdOpsOperator, setActiveCdOpsOperator, govFeedbackMessages, toast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaffToEdit, setSelectedStaffToEdit] = useState<CdOpsStaffMember | null>(null);

  const handleSwitchOperator = (staff: CdOpsStaffMember) => {
    setActiveCdOpsOperator(staff);
    toast(`Active CD-Ops Operator set to ${staff.name} (${staff.role}).`, 'emerald');
  };

  const handleOpenAddModal = () => {
    setSelectedStaffToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff: CdOpsStaffMember) => {
    setSelectedStaffToEdit(staff);
    setIsModalOpen(true);
  };

  // Count active tasks per staff
  const getActiveTasksCount = (staffName: string) => {
    return govFeedbackMessages.filter((m) => m.assignedStaff === staffName).length;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Roster Header */}
      <div className="card p-5 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Users size={18} />
            </div>
            <div>
              <span className="text-[10px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                CD-Ops Sovereign Reliability Roster &amp; Active Duty Stations
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Engineering Staff, Role Assignments &amp; Duty Roster
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
              <Radio size={10} className="animate-pulse" /> {cdOpsStaffList.length} Operational Staff
            </span>
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={14} /> Add Staff Member
            </button>
          </div>
        </div>

        <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          Internal operations engineers responsible for bilateral sovereign accord compliance, *3030# USSD gateway uptime, and ministerial dispatch sign-offs across Africa. You can assign roles, update duty stations, replace staff, or stand down personnel.
        </p>
      </div>

      {/* Active Operator Banner */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-amber-500/40 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3.5">
          <img
            src={activeCdOpsOperator.avatar}
            alt={activeCdOpsOperator.name}
            className="w-13 h-13 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                ACTIVE DISPATCHING OPERATOR
              </span>
              <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                ONLINE ON CONSOLE
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              {activeCdOpsOperator.name}
            </h4>
            <p className="text-xs mono text-slate-600 dark:text-slate-300">
              {activeCdOpsOperator.role} · {activeCdOpsOperator.dutyStation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEditModal(activeCdOpsOperator)}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center gap-1.5"
          >
            <Edit3 size={13} /> Edit My Role &amp; Station
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {cdOpsStaffList.map((staff, sIdx) => {
          const isActive = activeCdOpsOperator.id === staff.id;
          const assignedCount = getActiveTasksCount(staff.name);

          return (
            <div
              key={`${staff.id}-${sIdx}`}
              className={`p-4 rounded-3xl border transition-all space-y-3 bg-white dark:bg-slate-900 ${
                isActive
                  ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20'
                  : 'border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {staff.name}
                      </h4>
                      <span
                        className={`text-[7.5px] mono uppercase px-1.5 py-0.2 rounded font-bold ${
                          staff.status === 'online'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                            : staff.status === 'on_call'
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        {staff.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      {staff.role}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold">
                        {assignedCount} {assignedCount === 1 ? 'task' : 'tasks'} dispatched
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(staff)}
                    className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    title="Edit Role & Details"
                  >
                    <Edit3 size={14} />
                  </button>
                  {isActive ? (
                    <span className="text-[8.5px] mono px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/40">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSwitchOperator(staff)}
                      className="text-[8.5px] mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
                    >
                      Select
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-[10.5px] mono text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-amber-600 shrink-0" />
                  <span className="truncate">Duty Station: {staff.dutyStation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400 shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
                {staff.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-teal-600 shrink-0" />
                    <span>{staff.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Globe size={12} className="text-teal-600 shrink-0" />
                  <span>Jurisdiction: </span>
                  <div className="flex flex-wrap gap-1">
                    {staff.handlingRegions.map((code, rIdx) => {
                      const c = COUNTRIES[code as any];
                      return (
                        <span
                          key={`${code}-${rIdx}`}
                          className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[8.5px] font-bold font-mono"
                          title={c?.name || code}
                        >
                          {code === 'ALL' ? 'ALL' : code}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Edit / Create Modal */}
      <CdOpsStaffManagerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaffToEdit(null);
        }}
        staffToEdit={selectedStaffToEdit}
      />
    </div>
  );
};
