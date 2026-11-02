import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, X, Check, ArrowRight, History, Home, Lock, Building, Navigation } from 'lucide-react';
import { UserSession, ParishRelocationRecord } from '../types';
import { TERRITORY } from '../data/countries';

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

  // National 3-layer territory coverage from national database
  const userCountry = (user?.country || 'UG').toUpperCase();
  const nationalDistricts = TERRITORY[userCountry] || TERRITORY.UG || [];

  // 1. District level
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(() => {
    // Attempt to locate district of current parish
    const foundDistrict = nationalDistricts.find((d) =>
      d.children?.some((s) =>
        s.children?.some((p) => p.name.toLowerCase() === currentParish.toLowerCase())
      )
    );
    return foundDistrict?.id || nationalDistricts[0]?.id || 'kla';
  });

  // 2. Sub-county level
  const availableSubcounties = useMemo(() => {
    const distObj = nationalDistricts.find((d) => d.id === selectedDistrictId);
    return distObj?.children || [];
  }, [nationalDistricts, selectedDistrictId]);

  const [selectedSubcountyId, setSelectedSubcountyId] = useState<string>(() => {
    return availableSubcounties[0]?.id || '';
  });

  useEffect(() => {
    if (availableSubcounties.length > 0 && !availableSubcounties.some((s) => s.id === selectedSubcountyId)) {
      setSelectedSubcountyId(availableSubcounties[0].id);
    }
  }, [availableSubcounties, selectedSubcountyId]);

  // 3. Parish level
  const availableParishes = useMemo(() => {
    const subObj = availableSubcounties.find((s) => s.id === selectedSubcountyId);
    return subObj?.children || [];
  }, [availableSubcounties, selectedSubcountyId]);

  const [selectedParishName, setSelectedParishName] = useState<string>(() => {
    return availableParishes[0]?.name || 'Nakasero I';
  });

  useEffect(() => {
    if (availableParishes.length > 0 && !availableParishes.some((p) => p.name === selectedParishName)) {
      setSelectedParishName(availableParishes[0]?.name || '');
    }
  }, [availableParishes, selectedParishName]);

  const [moveReason, setMoveReason] = useState('Shifted to a new rented residence in this neighborhood');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDistrictObj = nationalDistricts.find((d) => d.id === selectedDistrictId);
  const selectedSubcountyObj = availableSubcounties.find((s) => s.id === selectedSubcountyId);

  const handleConfirmRelocation = () => {
    if (isOnCooldown) {
      toast(`Neighborhood relocation locked. You can move again in ${daysRemaining} days.`, 'amber');
      return;
    }

    if (!selectedParishName) {
      toast('Please select target destination Parish', 'amber');
      return;
    }

    if (selectedParishName.toLowerCase() === currentParish.toLowerCase()) {
      toast('Selected Parish is identical to your current neighborhood.', 'amber');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateParish(selectedParishName, moveReason);
      toast(`Relocated to ${selectedParishName}! Near Me feed and local shop perks updated.`, 'emerald');
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-fade-in text-slate-900 dark:text-white"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#161a22] border-2 border-[#e3e6ea] dark:border-[#262b36] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Fixed Pinned Header */}
        <div className="p-4 sm:p-5 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Home size={18} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Grassroots Resident Neighborhood Registry
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

        {/* Scrollable Body Container */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-4 text-xs font-mono">
          {/* Current Parish Badge */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Current Registered Neighborhood:</span>
            <div className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 truncate">
              <MapPin size={16} className="shrink-0" />
              <span className="truncate">{currentParish}</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-0.5 leading-relaxed">
              Your &quot;Near Me&quot; civic feed and XP shop redemptions are locked to this registered parish.
            </p>
          </div>

          {/* 14-Day Cooldown Status Banner */}
          {isOnCooldown ? (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800 dark:text-amber-300">
                <Lock size={14} className="shrink-0" />
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
            <div className="space-y-3.5 pt-1">
              {/* Authentic 3-Layer Cascading Jurisdiction Dropdowns (Speak Page Model) */}
              <div className="space-y-2.5 p-3 rounded-2xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Navigation size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>3-Layer National Jurisdiction Selector</span>
                </div>

                {/* Layer 1: District */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    1. Select District / Local Government ({nationalDistricts.length} Nationwide)
                  </label>
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {nationalDistricts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Layer 2: Sub-County / Division */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    2. Select Sub-County / Municipal Division ({availableSubcounties.length} Available)
                  </label>
                  <select
                    value={selectedSubcountyId}
                    onChange={(e) => setSelectedSubcountyId(e.target.value)}
                    disabled={availableSubcounties.length === 0}
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  >
                    {availableSubcounties.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Layer 3: Parish / Ward */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    3. Select Destination Parish / Ward ({availableParishes.length} Grassroots Units)
                  </label>
                  <select
                    value={selectedParishName}
                    onChange={(e) => setSelectedParishName(e.target.value)}
                    disabled={availableParishes.length === 0}
                    className="w-full bg-white dark:bg-[#161a22] border-2 border-emerald-500/50 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  >
                    {availableParishes.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[10px] flex items-center justify-between">
                  <span className="font-bold">Target Location:</span>
                  <span className="font-mono">
                    {selectedParishName} · {selectedSubcountyObj?.name} · {selectedDistrictObj?.name}
                  </span>
                </div>
              </div>

              {/* Relocation Reason */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Reason for Moving Neighborhood
                </label>
                <textarea
                  rows={2}
                  value={moveReason}
                  onChange={(e) => setMoveReason(e.target.value)}
                  placeholder="e.g. Shifted to new apartment / rented house, job relocation..."
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 space-y-1">
                <div>• Relocating updates your <strong>Near Me</strong> civic feed to your new parish.</div>
                <div>• Local merchant XP redemptions will automatically switch to verified shops in {selectedParishName}.</div>
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

        {/* Fixed Pinned Footer Actions */}
        <div className="p-3 sm:p-4 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          {!isOnCooldown && (
            <button
              type="button"
              onClick={handleConfirmRelocation}
              disabled={isSubmitting}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
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
