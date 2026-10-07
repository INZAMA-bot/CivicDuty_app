import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Scale,
  Lock,
  FileText,
  CheckCircle2,
  Globe2,
  Award,
  Printer,
  Copy,
  Building2,
  Users,
  Fingerprint,
  Gift,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type LegalTabType = 'about' | 'privacy' | 'terms' | 'ethics';

interface LegalTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTabType;
}

export const LegalTrustModal: React.FC<LegalTrustModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'about',
}) => {
  const { toast } = useApp();
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const tabs: { id: LegalTabType; label: string; shortLabel: string; icon: React.FC<any> }[] = [
    { id: 'about', label: 'About CivicDuty & Mission', shortLabel: 'About Us', icon: Globe2 },
    { id: 'privacy', label: 'Privacy & Data Charter', shortLabel: 'Privacy Charter', icon: Lock },
    { id: 'terms', label: 'Terms of Use & Conduct', shortLabel: 'Terms of Use', icon: FileText },
    { id: 'ethics', label: 'Ethical Perks Covenant', shortLabel: 'Ethics Covenant', icon: Scale },
  ];

  const handleCopySummary = () => {
    const text = `CivicDuty Sovereign Trust & Legal Charter (${activeTab.toUpperCase()}) — Speak · Serve · Be Heard. 100% Free Citizen Utility · Zero-Knowledge NIN Hashing · 3-Signal Citizen Ratification · ISO 26000 Ethical Field Cost Reimbursement Standard.`;
    navigator.clipboard?.writeText(text);
    toast('Copied CivicDuty Legal & Trust Charter digest to clipboard!', 'emerald');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-800 dark:text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Sovereign Governance, Trust &amp; Legal Center
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold mono">
                  v2.6 Public Charter
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white tracking-tight mt-0.5">
                About CivicDuty · Privacy Charter · Terms of Use · Ethical Covenant
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
            aria-label="Close Legal Center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 pt-3 pb-2 bg-slate-100/80 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map((tItem) => {
            const Icon = tItem.icon;
            const isActive = activeTab === tItem.id;
            return (
              <button
                key={tItem.id}
                type="button"
                onClick={() => setActiveTab(tItem.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-black shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tItem.label}</span>
                <span className="sm:hidden">{tItem.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs leading-relaxed flex-1">
          {/* ============================================================ */}
          {/* TAB 1: ABOUT CIVICDUTY & FOUNDER'S MISSION */}
          {/* ============================================================ */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold uppercase mono text-[11px]">
                  <ShieldCheck size={15} strokeWidth={1.75} />
                  <span>Our Sovereign Mission · Speak · Serve · Be Heard</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-[13px] font-medium leading-relaxed">
                  <strong>CivicDuty</strong> is a multi-nation Digital Public Infrastructure (DPI) and Consumer Accountability Utility engineered to eliminate bureaucratic ghosting, infrastructure neglect, and service delivery opacity across Africa and the global commonwealth.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-1.5">
                  <div className="font-black text-rose-700 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span>1. RED · Citizen Speaks</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Citizens file geotagged photo/video reports via the Web App or offline via <strong>*3030# USSD</strong>. When 5+ witnesses report the same hazard, CivicDuty auto-compiles a <strong>Master Dossier</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                  <div className="font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>2. AMBER · Duty Bearers Serve</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Reports route directly to the salaried government desk (Parish, Sub-County, District, Ministry) or private provider with an immutable <strong>SLA Countdown Timer</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                  <div className="font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>3. GREEN · Citizen Ratifies</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    No official can close a ticket alone. A report only turns Green when the filing citizen inspects the physical repair and seals it with a <strong>SHA-256 Ratification Hash</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2.5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Award size={16} className="text-amber-500" />
                  <span>Foundational Philosophy: Business Ethics &amp; Community Service</span>
                </h3>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Rooted in rigorous university training in <strong>Business Ethics and Community Service (USIU-Africa)</strong> and architected by Founder &amp; Lead System Architect <strong>Inzama Robin</strong>, CivicDuty bridges two worlds that rarely meet: <strong>constitutional public accountability</strong> and <strong>ethical private-sector corporate social responsibility (CSR)</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong className="text-emerald-700 dark:text-emerald-400 block mb-0.5">100% Free for Citizens Forever</strong>
                    Citizens never pay subscription fees to report broken boreholes, hospital drug stockouts, grid outages, or consumer service failures.
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong className="text-indigo-700 dark:text-indigo-400 block mb-0.5">Praise &amp; Positive Recognition</strong>
                    CivicDuty is not just for complaints—citizens publicly commend heroic nurses, honest police officers, and responsive utilities via the <strong>Civic Honours Spotlight</strong>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PRIVACY POLICY & SOVEREIGN DATA PROTECTION CHARTER */}
          {/* ============================================================ */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-black uppercase mono text-[11px]">
                  <Lock size={15} />
                  <span>Sovereign Data Protection &amp; Citizen Privacy Charter</span>
                </div>
                <p className="text-[11.5px] text-slate-700 dark:text-slate-300">
                  Engineered in strict compliance with the <strong>Uganda Data Protection and Privacy Act (2019)</strong>, the <strong>Kenya Data Protection Act</strong>, the <strong>Nigeria Data Protection Act (NDPA)</strong>, South Africa&apos;s <strong>POPIA</strong>, and the <strong>EU GDPR</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <Fingerprint size={15} className="text-amber-500" />
                    <span>1. Why We Verify National ID / Passport (Zero-Knowledge Hashing)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    To prevent coordinated bot farms, fake defamation campaigns, or artificial upvote manipulation, CivicDuty enforces the <strong>1 Verified ID = 1 Authentic Civic Voice</strong> standard. However, your raw National ID Number (NIN) or Passport number is <strong>never stored in plain text on public feeds</strong>. Only a truncated 4-character cryptographic fragment (e.g., <code>#9028</code>) is bound to your public civic profile.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <ShieldCheck size={15} className="text-rose-500" />
                    <span>2. Cryptographic Whistleblower Anonymity Shield (Anti-Graft Reports)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    When a citizen files an <strong>Anti-Graft / Extortion Report</strong> or enables the <strong>Whistleblower Shield</strong>, CivicDuty automatically masks the reporter&apos;s display name, strips identifying device metadata from public view, and generates a zero-knowledge <strong>SHA-256 Evidence Seal</strong> for statutory oversight bodies (IGG, EACC, EFCC, Auditor General).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <Globe2 size={15} className="text-emerald-500" />
                    <span>3. Geotag (GPS) &amp; Photographic Evidence Policy</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Location coordinates are captured strictly at the moment you file or ratify a report so engineering crews can locate the physical pothole, burst water main, or power outage. CivicDuty <strong>never</strong> tracks background citizen movement or sells personal data to third-party advertisers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: TERMS OF USE & ACCEPTABLE CIVIC CONDUCT */}
          {/* ============================================================ */}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black uppercase mono text-[11px]">
                  <FileText size={15} />
                  <span>Terms of Use &amp; Sovereign Civic Conduct Agreement</span>
                </div>
                <p className="text-[11.5px] text-slate-700 dark:text-slate-300">
                  By accessing CivicDuty as a Citizen, Government Officer, or Private Service Provider, you agree to abide by the following rules of evidence-based civic engagement.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs">
                    1. Evidence-Based Reporting &amp; Zero Defamation Rule
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    CivicDuty is an empirical public &amp; consumer service delivery ledger—not a gossip forum. Users must report verifiable service defects, safety hazards, or authentic commendations. Uploading doctored photographs, fabricating malicious accusations, or using walls for partisan electioneering is strictly prohibited.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs">
                    2. The 3-Signal Resolution Rule (No Unilateral Ticket Closure)
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Government agencies and private entities acknowledge that posting an official reply moves a ticket to <strong>AMBER (In Progress / Awaiting Ratification)</strong>, but cannot turn a ticket <strong>GREEN (Resolved)</strong> until the filing citizen or community witnesses confirm the physical fix on the ground.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs">
                    3. 30-Day Founding Partner Free Trial (Private Service Providers)
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    During CivicDuty&apos;s public launch rollout, all private businesses, schools, hospitals, banks, utilities, and contractors receive a <strong>30-Day Founding Partner Free Trial ($0 Due Today · Code: FOUNDING-TRIAL-30D)</strong> with full access to Official Desk Verification, SLA Analytics, and Team Seats prior to paid subscription billing.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-slate-900 dark:text-white text-xs">
                    4. Illustrative Demo Showcases (&ldquo;Boutique Mannequins&rdquo;)
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Pre-populated showcase tickets badged <code>ILLUSTRATIVE DEMO</code> are provided strictly to demonstrate platform capabilities (5-Witness Master Dossiers, SLA Escalations, and SHA-256 Seals) across jurisdictions. Real citizen dispatches always rank #1 above demo showcases, and demos can be toggled off at any time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: ETHICAL PERKS & ANTI-BRIBERY COVENANT */}
          {/* ============================================================ */}
          {activeTab === 'ethics' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black uppercase mono text-[11px]">
                  <Scale size={15} />
                  <span>Ethical Civic Stewardship &amp; Anti-Hush-Money Covenant (ISO 26000)</span>
                </div>
                <p className="text-[11.5px] text-slate-700 dark:text-slate-300">
                  How CivicDuty reimburses citizens for community service without ever allowing rewards to become bribes or conflicts of interest:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-xs">
                    <Gift size={15} />
                    <span>Pillar 1: Field Cost Reimbursement Framing (Not Bounties)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    When a citizen uses their own mobile data bundle to upload high-resolution video of a burst water main or rides a bodaboda to verify a road repair, they incur real out-of-pocket costs. Every voucher in the Sovereign Perk Escrow Vault is legally framed as a <strong>Field Evidence &amp; Utility Cost Reimbursement</strong> (Mobile Data, Water Credit, Prepaid Electricity, or Transit Pass).
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-xs">
                    <CheckCircle2 size={15} />
                    <span>Pillar 2: The Anti-Hush-Money &amp; Non-Interference Rule</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    A contractor or authority <strong>cannot</strong> use a voucher to buy silence. Dispatching or accepting a perk voucher <strong>never</strong> closes, locks, hides, or mutes a ticket. A citizen who receives a Field Cost Reimbursement voucher retains <strong>100% of their constitutional right to click &ldquo;Dispute / Re-open&rdquo;</strong> if the physical repair on the ground is shoddy.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-1.5">
                  <h4 className="font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2 text-xs">
                    <Building2 size={15} />
                    <span>Pillar 3: Supply Chain &amp; Commission Transparency</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Citizens always receive <strong>100% of the stated face value</strong> of every utility voucher. During the 30-Day Founding Trial, sponsors may upload pre-purchased utility PINs via CSV (<strong>BYOV Mode at 0% fee</strong>). On instant aggregator checkouts, CivicDuty earns a transparent <strong>6% B2B Wholesale Aggregator Spread</strong> plus a <strong>10% Corporate CSR Escrow &amp; Audit Fee</strong> while issuing a <strong>SHA-256 Verifiable CSR Impact Certificate</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
            CivicDuty Sovereign Public Ledger · 15 Jurisdictions · SHA-256 Audited
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Copy size={13} />
              <span>Copy Digest</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Printer size={13} />
              <span>Print Charter</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
