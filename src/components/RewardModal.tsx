import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Gift, 
  Zap, 
  Award, 
  CheckCircle2, 
  X, 
  Building2, 
  HardHat, 
  ShieldCheck, 
  Phone, 
  Globe, 
  Ticket, 
  Sparkles, 
  Send,
  QrCode,
  BadgeCheck,
  CheckCheck
} from 'lucide-react';
import { getCountryPerks } from '../data/countryPerks';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCitizenName?: string;
  targetCitizenPhone?: string;
  postId?: string;
  commentId?: string;
  contractorName?: string;
  entityName?: string;
  contextTitle?: string;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  targetCitizenName = 'Inzama Robin',
  targetCitizenPhone = '+256 778 277 900 / +256 748 338 796',
  postId,
  commentId,
  contractorName,
  entityName,
  contextTitle,
}) => {
  const { user, activeDeptCountry, logAudit, toast, setPosts } = useApp();

  const country = user?.country || activeDeptCountry || 'UG';
  const countryPerks = getCountryPerks(country);

  const [issuerType, setIssuerType] = useState<'entity' | 'contractor'>(contractorName ? 'contractor' : 'entity');
  const [customContractor, setCustomContractor] = useState(contractorName || 'Seyani Brothers Construction Ltd');
  const [customEntity, setCustomEntity] = useState(entityName || user?.dept_label || 'National Civic Authority');

  const [recipient, setRecipient] = useState(`${targetCitizenName} (${targetCitizenPhone})`);
  const [selectedPerkId, setSelectedPerkId] = useState(countryPerks.digitalPerks[0]?.id || 'data');
  const [note, setNote] = useState(
    contextTitle
      ? `Rewarding verified wall engagement on "${contextTitle}"`
      : 'Thank you for active citizen monitoring on our public contract wall.'
  );

  const [successData, setSuccessData] = useState<{
    code: string;
    perkName: string;
    issuer: string;
    recipient: string;
  } | null>(null);

  useEffect(() => {
    if (countryPerks.digitalPerks.length > 0) {
      setSelectedPerkId(countryPerks.digitalPerks[0].id);
    }
  }, [country]);

  useEffect(() => {
    if (targetCitizenName) {
      setRecipient(`${targetCitizenName} (${targetCitizenPhone || 'Verified Citizen'})`);
    }
  }, [targetCitizenName, targetCitizenPhone]);

  useEffect(() => {
    if (contractorName) {
      setIssuerType('contractor');
      setCustomContractor(contractorName);
    }
  }, [contractorName]);

  if (!isOpen) return null;

  const currentPerk = countryPerks.digitalPerks.find((p) => p.id === selectedPerkId) || countryPerks.digitalPerks[0];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();

    const issuerLabel =
      issuerType === 'contractor'
        ? `${customContractor.trim() || 'Project Contractor'} (Contractor)`
        : `${customEntity.trim() || 'Public Entity'} (Entity Authority)`;

    const perkCode = currentPerk.code || `PERK-${Math.floor(1000 + Math.random() * 9000)}`;

    const rewardData = {
      perkName: currentPerk.name,
      perkCode,
      brand: currentPerk.brand,
      rewardedBy: issuerLabel,
      rewardedAt: new Date().toISOString(),
      note: note.trim(),
    };

    // If attached to a specific post or comment, update post comments state
    if (postId) {
      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p.id === postId) {
            if (commentId) {
              const updatedComments = (p.comments || []).map((c) =>
                c.id === commentId ? { ...c, reward: rewardData } : c
              );
              return { ...p, comments: updatedComments };
            } else {
              return { ...p, reward: rewardData };
            }
          }
          return p;
        })
      );
    }

    logAudit(
      'PERK_DISPATCH',
      `${issuerLabel} awarded ${currentPerk.name} voucher (${perkCode}) to ${recipient} for wall engagement.`
    );

    toast(`🎁 ${currentPerk.name} awarded to ${targetCitizenName}!`, 'emerald');

    setSuccessData({
      code: perkCode,
      perkName: currentPerk.name,
      issuer: issuerLabel,
      recipient,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative space-y-4 my-8 text-slate-800 dark:text-slate-100">
        <button
          onClick={() => {
            setSuccessData(null);
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {!successData ? (
          <form onSubmit={handleDispatch} className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="p-2.5 rounded-xl bg-amber-600/10 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-600/20 dark:border-amber-500/20">
                  <Gift size={22} />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Reward Citizen Engagement
                    <span className="text-[10px] mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-normal">
                      {countryPerks.flag} {countryPerks.countryName}
                    </span>
                  </h3>
                  <p className="text-[11px] mono text-slate-500 dark:text-slate-400">
                    Entities & Contractors award instant digital perks to active citizen audit voices.
                  </p>
                </div>
              </div>
            </div>

            {/* Issuer Toggle: Entity vs Contractor */}
            <div className="space-y-1.5">
              <label className="text-[10px] mono text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block">
                Issuing Authority & Identity
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIssuerType('entity')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    issuerType === 'entity'
                      ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-500/10 text-teal-950 dark:text-teal-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Building2 size={16} className={issuerType === 'entity' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'} />
                  <div>
                    <div className="text-[11px]">Government Authority</div>
                    <div className="text-[8.5px] opacity-70">Official Dept or Council</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIssuerType('contractor')}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    issuerType === 'contractor'
                      ? 'border-amber-600/50 bg-amber-600/10 text-amber-950 dark:text-amber-200 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <HardHat size={16} className={issuerType === 'contractor' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'} />
                  <div>
                    <div className="text-[11px]">Works Contractor</div>
                    <div className="text-[8.5px] opacity-70">Project Field Exec</div>
                  </div>
                </button>
              </div>

              {issuerType === 'contractor' ? (
                <div>
                  <label className="text-[9px] mono text-slate-600 dark:text-slate-400 block mb-1 font-bold">Contractor Name / Firm</label>
                  <input
                    type="text"
                    value={customContractor}
                    onChange={(e) => setCustomContractor(e.target.value)}
                    placeholder="e.g. Seyani Brothers Construction Ltd"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-amber-600 font-medium"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[9px] mono text-slate-600 dark:text-slate-400 block mb-1 font-bold">Public Entity Name</label>
                  <input
                    type="text"
                    value={customEntity}
                    onChange={(e) => setCustomEntity(e.target.value)}
                    placeholder="e.g. KCCA Urban Council / NWSC"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-teal-500 font-medium"
                    required
                  />
                </div>
              )}
            </div>

            {/* Recipient Citizen */}
            <div className="space-y-1">
              <label className="text-[10px] mono text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block">
                Citizen Recipient
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-600"
                required
              />
            </div>

            {/* Perk Choice */}
            <div className="space-y-1.5">
              <label className="text-[10px] mono text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Select Digital Perk Voucher</span>
                <span className="text-[8.5px] text-amber-700 dark:text-amber-400 font-medium">CSR Sponsored</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {countryPerks.digitalPerks.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPerkId(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPerkId === p.id
                        ? 'border-amber-600/50 bg-amber-600/10 text-amber-950 dark:text-amber-200 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Ticket size={11} className="text-amber-600 dark:text-amber-400" />
                        {p.name}
                      </span>
                      <span className="text-[8px] bg-amber-600/15 text-amber-800 dark:text-amber-300 px-1 rounded font-bold">{p.badge}</span>
                    </div>
                    <div className="text-[8.5px] opacity-80 mt-0.5">{p.subtext}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note / Citation */}
            <div className="space-y-1">
              <label className="text-[10px] mono text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block">
                Recognition Note / Citation
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-slate-100 text-xs resize-none focus:outline-none focus:border-amber-600"
                placeholder="Reason for reward..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold py-3 rounded-xl text-xs uppercase tracking-widest mono transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send size={14} />
              <span>Dispatch Perk Voucher to Citizen</span>
            </button>
          </form>
        ) : (
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-emerald-500/40 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <span className="chip ch-resolved text-[9px]">Perk Dispatched</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">{successData.perkName}</h3>
              <p className="text-[11px] mono text-slate-500 dark:text-slate-400 mt-0.5">
                Rewarded to <strong className="text-slate-800 dark:text-slate-200">{successData.recipient}</strong>
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs mono">
              <div className="text-slate-500 text-[10px]">Voucher Authorization Code:</div>
              <div className="text-base font-black text-amber-700 dark:text-amber-400 tracking-wider">
                {successData.code}
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400">
                Issued By: {successData.issuer}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  toast(`Voucher code ${successData.code} copied!`, 'success');
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs mono font-bold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Ticket size={13} className="text-amber-600 dark:text-amber-400" />
                <span>Copy Code</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccessData(null);
                  onClose();
                }}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs mono transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
