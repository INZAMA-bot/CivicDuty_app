import React, { useState } from 'react';
import { HeartHandshake, X, Gift, ShieldCheck, Check, Sparkles, Building2, MapPin } from 'lucide-react';
import { Project, ContractorCsrDisbursement, UserSession } from '../types';

interface ContractorCsrModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  user: UserSession | null;
  onDisburseSuccess: (disbursement: ContractorCsrDisbursement) => void;
  toast: (msg: string, type?: 'emerald' | 'amber' | 'red') => void;
}

export const ContractorCsrModal: React.FC<ContractorCsrModalProps> = ({
  isOpen,
  onClose,
  project,
  user,
  onDisburseSuccess,
  toast,
}) => {
  if (!isOpen) return null;

  const corridorBeneficiaries = [
    {
      group: 'Bukoto Central Boda Boda Stage Vault',
      parish: 'Bukoto Parish',
      ridersCount: 28,
      recommended: 'DOT Safety Helmets & High-Vis Vests',
    },
    {
      group: 'Kisaasi Trading Hub Boda Stage Vault',
      parish: 'Kisaasi Parish',
      ridersCount: 34,
      recommended: 'Night Safety Reflective Overcoats & Fuel Vouchers',
    },
    {
      group: 'Nakawa Division Community Health Post',
      parish: 'Nakawa Parish',
      ridersCount: 15,
      recommended: 'Emergency Trauma First-Aid & Oxygen Packs',
    },
    {
      group: 'Kigoowa Road Market Vendors Mutual Fund',
      parish: 'Ntinda / Kigoowa',
      ridersCount: 42,
      recommended: 'Clean Water Storage Jerrycans & Solar Lamps',
    },
  ];

  const csrItemPresets = [
    {
      title: '25x Certified DOT Boda Safety Helmets',
      count: 25,
      valueUgx: 1500000,
      description: 'ECE/DOT-approved safety helmets for commercial riders along the construction corridor.',
    },
    {
      title: '50x High-Visibility Heavy-Duty Reflective Vests',
      count: 50,
      valueUgx: 600000,
      description: 'Fluorescent lime reflective safety vests for stage riders & pedestrian crossing guides.',
    },
    {
      title: '30x Trauma & Wound Care First-Aid Kits',
      count: 30,
      valueUgx: 900000,
      description: 'Sterile bandages, antiseptics, trauma splints, and burns dressings for stage first responders.',
    },
    {
      title: '100x Stage Member Fuel / Maintenance Vouchers',
      count: 100,
      valueUgx: 1000000,
      description: 'Redeemable electronic fuel vouchers via participating corridor petrol stations.',
    },
  ];

  const [selectedBeneficiary, setSelectedBeneficiary] = useState(corridorBeneficiaries[0]);
  const [selectedPreset, setSelectedPreset] = useState(csrItemPresets[0]);
  const [customStatement, setCustomStatement] = useState(
    `${project.contractor} is committed to the safety and welfare of local transport workers and residents along the ${project.title} corridor.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDisburse = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const disbursement: ContractorCsrDisbursement = {
        id: 'csr-' + Date.now(),
        projectId: project.id,
        contractor: project.contractor,
        targetGroup: selectedBeneficiary.group,
        parish: selectedBeneficiary.parish,
        itemTitle: selectedPreset.title,
        itemCount: selectedPreset.count,
        monetaryValueUgx: selectedPreset.valueUgx,
        disbursedAt: new Date().toISOString(),
        donorStatement: customStatement,
      };

      onDisburseSuccess(disbursement);
      toast(
        `CSR Disbursed: ${selectedPreset.title} (UGX ${selectedPreset.valueUgx.toLocaleString()}) funded to ${selectedBeneficiary.group}!`,
        'emerald'
      );
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#161a22] border border-amber-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto text-slate-900 dark:text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0">
              <HeartHandshake size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold block">
                Contractor Direct CSR · Corridor Grassroots Vaults
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Disburse Corporate Social Responsibility (CSR)
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono text-slate-700 dark:text-slate-300 space-y-1">
          <p>
            Under CivicDuty, contractor firms directly fund Grassroots Vaults (Boda Stages, Market Hubs, Clinics) located within the parishes touched by their project corridor. Rewards are automatically credited to the workstation members by rank!
          </p>
        </div>

        {/* Step 1: Target Corridor Beneficiary */}
        <div className="space-y-2">
          <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
            1. Select Corridor Workstation Vault
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {corridorBeneficiaries.map((b) => (
              <button
                key={b.group}
                type="button"
                onClick={() => setSelectedBeneficiary(b)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedBeneficiary.group === b.group
                    ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{b.group}</span>
                  {selectedBeneficiary.group === b.group && <Check size={14} className="text-amber-600 shrink-0" />}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin size={10} /> {b.parish} · {b.ridersCount} Active Members
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select CSR Perk Package */}
        <div className="space-y-2">
          <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
            2. Choose CSR Perk Package
          </label>
          <div className="space-y-2 text-xs font-mono">
            {csrItemPresets.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setSelectedPreset(item)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                  selectedPreset.title === item.title
                    ? 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-amber-700 dark:text-amber-400 block">
                    UGX {item.valueUgx.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-400">{item.count} items</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Contractor Statement */}
        <div className="space-y-1">
          <label className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
            3. Contractor Public CSR Dedication Message
          </label>
          <textarea
            rows={2}
            value={customStatement}
            onChange={(e) => setCustomStatement(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-[#12161f] border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Summary Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1.5">
          <div className="flex justify-between text-slate-500">
            <span>Sponsoring Firm:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{project.contractor}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Beneficiary Vault:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">{selectedBeneficiary.group}</span>
          </div>
          <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">
            <span>Total Grant Commitment:</span>
            <span className="text-emerald-700 dark:text-emerald-400">UGX {selectedPreset.valueUgx.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDisburse}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <HeartHandshake size={15} />
            <span>{isSubmitting ? 'Funding Corridor Vault...' : 'Disburse CSR Grant to Stage Vault →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
