import React, { useState } from 'react';
import { MapPin, X, ShieldCheck, Clock, AlertTriangle, Check, ArrowRight, History, Home, Lock } from 'lucide-react';
import { UserSession, ParishRelocationRecord } from '../types';

interface ParishRelocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession | null;
  onUpdateParish: (newParish: string, reason: string) => void;
  toast: (msg: string, type?: 'emerald' | 'amber' | 'red') => void;
}

export const ParishRelocationModal: React.FC<ParishRelocationModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateParish,
  toast,
}) => {
  if (!isOpen) return null;

  const currentParish = user?.parish || user?.parish_ward || 'Bukoto Central Parish';
  const history: ParishRelocationRecord[] = user?.parish_relocation_history || [
    {
      id: 'move-init',
      fromParish: 'Nakasero Central Parish',
      toParish: currentParish,
      movedAt: user?.last_parish_change_iso || '2026-09-01',
      reason: 'Initial resident registration at onboarding',
    },
  ];

  const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
  const lastChangeTime = user?.last_parish_change_iso ? new Date(user.last_parish_change_iso).getTime() : 0;
  const elapsed = Date.now() - lastChangeTime;
  const isOnCooldown = lastChangeTime > 0 && elapsed < FOURTEEN_DAYS_MS;
  const daysRemaining = isOnCooldown ? Math.ceil((FOURTEEN_DAYS_MS - elapsed) / (24 * 60 * 60 * 1000)) : 0;

  // Local sample parishes list for the country/district
  const availableParishes = [
    'Bukoto I Parish',
    'Bukoto II Parish',
    'Nakasero Parish',
    'Kamwokya I Parish',
    'Kamwokya II Parish',
    'Kisaasi Parish',
    'Ntinda Parish',
    'Kigoowa Parish',
    'Naguru I Parish',
    'Naguru II Parish',
    'Kisugu Parish',
    'Muyenga Parish',
    'Kabalagala Parish',
    'Kansanga Parish',
    'Ggaba Parish',
  ].filter((p) => p.toLowerCase() !== currentParish.toLowerCase());

  const [selectedParish, setSelectedParish] = useState(availableParishes[0]);
  const [moveReason, setMoveReason] = useState('Shifted to a new rented residence in this neighborhood');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmRelocation = () => {
    if (isOnCooldown) {
      toast(`Neighborhood relocation locked. You can move again in ${daysRemaining} days.`, 'amber');
      return;
    }

    if (!selectedParish) {
      toast('Please select target destination Parish', 'amber');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateParish(selectedParish, moveReason);
      toast(`Relocated to ${selectedParish}! Near Me feed and local shop perks updated.`, 'emerald');
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in text-slate-900 dark:text-white"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#161a22] border-2 border-[#e3e6ea] dark:border-[#262b36] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Home size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Resident Neighborhood Registration
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Relocate Parish (Change Neighborhood)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Current Parish Badge */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Current Registered Parish:</span>
            <div className="text-base font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <MapPin size={16} />
              <span>{currentParish}</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Your &quot;Near Me&quot; civic feed and XP shop redemptions are locked to this registered neighborhood.
            </p>
          </div>

          {/* 14-Day Cooldown Status Banner */}
          {isOnCooldown ? (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800 dark:text-amber-300">
                <Lock size={14} />
                <span>14-Day Neighborhood Residence Cooldown Active</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                You recently changed your parish. In CivicDuty, changing a parish represents physically moving to a new home. To prevent jurisdictional manipulation and ensure authentic local representation, a 2-week cooldown is enforced.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] font-black border-t border-amber-500/20">
                <span>Next Relocation Window Opens In:</span>
                <span className="text-amber-700 dark:text-amber-400 font-mono text-xs">{daysRemaining} Day{daysRemaining > 1 ? 's' : ''}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Select New Destination Parish
                </label>
                <select
                  value={selectedParish}
                  onChange={(e) => setSelectedParish(e.target.value)}
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {availableParishes.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Reason for Moving Neighborhood
                </label>
                <textarea
                  rows={2}
                  value={moveReason}
                  onChange={(e) => setMoveReason(e.target.value)}
                  placeholder="e.g. Shifted to new apartment / rented house, job relocation..."
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 space-y-1">
                <div>• Relocating updates your <strong>Near Me</strong> civic feed to your new parish.</div>
                <div>• Local merchant XP redemptions will automatically switch to shops in {selectedParish}.</div>
                <div>• You will be locked from relocating again for <strong>14 days (2 weeks)</strong>.</div>
              </div>
            </div>
          )}

          {/* Parish Relocation History / Move Log */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <History size={13} />
              <span>Parish Relocation History &amp; Move Log</span>
            </span>

            <div className="space-y-1.5">
              {history.map((record, idx) => (
                <div
                  key={record.id || idx}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-0.5 text-[10.5px]"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                      <span>{record.fromParish}</span>
                      <ArrowRight size={10} />
                      <span>{record.toParish}</span>
                    </span>
                    <span className="text-[9px] text-slate-400 font-normal">{record.movedAt}</span>
                  </div>
                  <div className="text-[9.5px] text-slate-500 italic">
                    &quot;{record.reason}&quot;
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
          >
            Cancel
          </button>

          {!isOnCooldown && (
            <button
              type="button"
              onClick={handleConfirmRelocation}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Check size={14} />
              <span>{isSubmitting ? 'Updating Ledger...' : 'Confirm Neighborhood Relocation →'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
