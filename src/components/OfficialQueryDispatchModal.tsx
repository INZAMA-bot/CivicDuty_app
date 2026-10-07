import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OfficialQueryCategory, OfficialQuery } from '../types';
import { ShieldAlert, Send, X, Clock, AlertTriangle, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { ModalPortal } from './ModalPortal';

interface OfficialQueryDispatchModalProps {
  initialTarget?: {
    unitName: string;
    unitOfficer: string;
    unitTitle?: string;
    unitScope?: string;
    slaScore?: string;
    backlog?: number;
    hours?: number;
  };
  onClose: () => void;
  onSuccess?: (query: OfficialQuery) => void;
}

const CATEGORY_PRESETS: Record<OfficialQueryCategory, { label: string; defaultSubject: string; defaultGrounds: string }> = {
  sla_breach: {
    label: 'Statutory SLA Breach (>48h Turnaround)',
    defaultSubject: 'Failure to Comply with Statutory 48-Hour Grievance Resolution Window',
    defaultGrounds: 'Official supervisory telemetry indicates critical citizen reports have remained unresolved beyond the statutory service level threshold without administrative justification or formal extension request.',
  },
  pdm_irregularity: {
    label: 'PDM SACCO Ledger & Beneficiary Irregularity',
    defaultSubject: 'Irregularity in Parish Development Model Revolving Fund Vetting & Disbursement',
    defaultGrounds: 'Discrepancies reported in household verification rosters or delayed clearance of SACCO beneficiary disbursements contrary to national PDM financial operating guidelines.',
  },
  unattended_reports: {
    label: 'Unattended High-Severity Civic Petitions',
    defaultSubject: 'Persistent Unaddressed Public Health and Infrastructure Dispatches',
    defaultGrounds: 'Repeated citizen notifications regarding urgent municipal/sub-county infrastructure disruptions remain unacknowledged, resulting in avoidable community hardship.',
  },
  desk_abandonment: {
    label: 'Officer Absenteeism & Desk Abandonment',
    defaultSubject: 'Inquiry into Prolonged Officer Unavailability and Supervisory Inaccessibility',
    defaultGrounds: 'Duty station observed unmanned during statutory working hours with multiple citizen escalations bounced without relief officer assignment.',
  },
  procurement_audit: {
    label: 'Contractor Delay & Force Account Audit',
    defaultSubject: 'Query on Public Works Milestone Stoppage and Variance',
    defaultGrounds: 'Public contract wall records indicate capital works have stalled beyond agreed contractor timelines without force account explanation or milestone certification.',
  },
  general_supervisory: {
    label: 'General Administrative Performance Query',
    defaultSubject: 'Official Administrative Inquiry on Field Operational Non-Compliance',
    defaultGrounds: 'Formal inquiry into overall supervisory lagging, incomplete field inspection logs, and non-submission of periodic local governance returns.',
  },
};

export const OfficialQueryDispatchModal: React.FC<OfficialQueryDispatchModalProps> = ({
  initialTarget,
  onClose,
  onSuccess,
}) => {
  const { user, issueOfficialQuery } = useApp();
  const countryCode = user?.country || 'UG';
  const countryObj = COUNTRIES[countryCode] || { name: countryCode, flag: countryCode };

  const [category, setCategory] = useState<OfficialQueryCategory>('sla_breach');
  const [targetUnit, setTargetUnit] = useState(initialTarget?.unitName || '');
  const [targetOfficer, setTargetOfficer] = useState(initialTarget?.unitOfficer || '');
  const [targetTitle, setTargetTitle] = useState(initialTarget?.unitTitle || 'Responsible Substantive Officer');
  const [targetScope, setTargetScope] = useState(initialTarget?.unitScope || countryCode);
  
  const [subject, setSubject] = useState(CATEGORY_PRESETS.sla_breach.defaultSubject);
  const [grounds, setGrounds] = useState(CATEGORY_PRESETS.sla_breach.defaultGrounds);
  const [evidenceDetails, setEvidenceDetails] = useState(
    initialTarget 
      ? `Recorded Backlog: ${initialTarget.backlog ?? 6} cases. Current Turnaround: ${initialTarget.hours ?? 36}h. SLA Rate: ${initialTarget.slaScore ?? '72.0%'}.`
      : 'Identified via continuous CivicDuty national telemetry stream.'
  );
  const [deadlineHours, setDeadlineHours] = useState<number>(48);

  const handleCategoryChange = (newCat: OfficialQueryCategory) => {
    setCategory(newCat);
    const preset = CATEGORY_PRESETS[newCat];
    setSubject(preset.defaultSubject);
    setGrounds(preset.defaultGrounds);
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUnit.trim() || !targetOfficer.trim() || !grounds.trim()) {
      return;
    }

    const query = issueOfficialQuery({
      targetUnit,
      targetScope,
      targetOfficer,
      targetTitle,
      category,
      subject,
      grounds,
      evidenceDetails,
      slaScore: initialTarget?.slaScore,
      backlogCount: initialTarget?.backlog,
      deadlineHours,
    });

    if (onSuccess) {
      onSuccess(query);
    }
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs -z-10" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl p-5 sm:p-6 max-w-xl w-full space-y-4 shadow-2xl my-auto relative z-10 shrink-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-rose-200 dark:border-rose-900/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-sm">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  Statutory Administrative Query
                </span>
                <span className="text-[10px] mono text-slate-500">{countryCode}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Issue Official Supervisory Query
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Legal Advisory Banner */}
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-start gap-2.5 text-xs text-rose-950 dark:text-rose-200">
          <Scale size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Public Service Legal Mandate:</strong> This is a formal administrative sanction under Civil Service Standing Orders and Local Government Regulations. It compels the recipient officer to submit a formal signed defense and corrective action within the specified statutory countdown.
          </div>
        </div>

        <form onSubmit={handleDispatch} className="space-y-3.5 text-xs">
          {/* Category Selector */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Query Classification / Breach Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(Object.keys(CATEGORY_PRESETS) as OfficialQueryCategory[]).map((catKey) => (
                <button
                  type="button"
                  key={catKey}
                  onClick={() => handleCategoryChange(catKey)}
                  className={`p-2 rounded-xl text-left border transition-all text-[11px] font-semibold flex flex-col justify-between ${
                    category === catKey
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                  }`}
                >
                  <span className="truncate">{CATEGORY_PRESETS[catKey].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Station and Officer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Administrative Station / Unit:
              </label>
              <input
                type="text"
                required
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                placeholder="e.g. Makindye Division - Kibuye II Parish"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Substantive Officer / Appointee Name:
              </label>
              <input
                type="text"
                required
                value={targetOfficer}
                onChange={(e) => setTargetOfficer(e.target.value)}
                placeholder="e.g. Parish Chief / SAS John Kato"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Official Inquiry Subject:
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Grounds for Query */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Specific Grounds &amp; Observed Non-Compliance:
            </label>
            <textarea
              required
              rows={3}
              value={grounds}
              onChange={(e) => setGrounds(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Evidence Citations */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Telemetry Proof &amp; Evidentiary Reference:
            </label>
            <input
              type="text"
              value={evidenceDetails}
              onChange={(e) => setEvidenceDetails(e.target.value)}
              placeholder="e.g. Tickets #8821, #8845 outstanding. Turnaround 42h."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Statutory Response Deadline */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Statutory Response Window:
              </span>
              <span className="text-[10px] text-slate-500">
                Failure to respond triggers automatic escalation to Anti-Corruption Body (IGG/SHACU)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[24, 48, 72].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDeadlineHours(hrs)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    deadlineHours === hrs
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2"
            >
              <Send size={14} />
              <span>Dispatch Statutory Query ({deadlineHours}h SLA)</span>
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
};
