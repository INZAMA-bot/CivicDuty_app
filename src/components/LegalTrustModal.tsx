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
  Fingerprint,
  Gift,
  Compass,
  HardHat,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrafficLightLogo } from './TrafficLightLogo';

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
    { id: 'about', label: 'About CivicDuty', shortLabel: 'About', icon: Globe2 },
    { id: 'privacy', label: 'Privacy Charter', shortLabel: 'Privacy', icon: Lock },
    { id: 'terms', label: 'Terms of Use', shortLabel: 'Terms', icon: FileText },
    { id: 'ethics', label: 'Ethics Covenant', shortLabel: 'Ethics', icon: Scale },
  ];

  const handleCopySummary = () => {
    const text = `CivicDuty Sovereign Trust & Legal Charter (${activeTab.toUpperCase()}) — Speak · Serve · Be Heard. 100+ Country Adaptive Administrative Engine · Zero-Knowledge NIN/Passport & Foreign Resident Permit Verification · 3-Signal Citizen Ratification · ISO 26000 Ethical Field Cost Reimbursement Standard.`;
    navigator.clipboard?.writeText(text);
    toast('Copied CivicDuty Legal & Trust Charter digest to clipboard', 'emerald');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Studio Header Bar */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center shrink-0 mt-0.5">
              <TrafficLightLogo size="sm" variant="green-only" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Sovereign Governance &amp; Legal Charter
                </span>
                <span aria-hidden="true">·</span>
                <span>100+ Sovereign Nations</span>
                <span aria-hidden="true">·</span>
                <span>SHA-256 Audited</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 leading-snug">
                About CivicDuty · Privacy Charter · Terms of Use · Ethics Covenant
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 dark:hover:border-slate-600 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close Legal Center"
          >
            <X size={15} strokeWidth={1.75} />
          </button>
        </div>

        {/* Clean Segmented Navigation Bar (aistudio.google style) */}
        <div className="px-4 py-2.5 bg-white dark:bg-[#161a22] border-b border-[#e3e6ea] dark:border-[#262b36] shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
            {tabs.map((tItem) => {
              const Icon = tItem.icon;
              const isActive = activeTab === tItem.id;
              return (
                <button
                  key={tItem.id}
                  type="button"
                  onClick={() => setActiveTab(tItem.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={13} strokeWidth={1.75} />
                  <span className="hidden sm:inline">{tItem.label}</span>
                  <span className="sm:hidden">{tItem.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs leading-relaxed flex-1 bg-white dark:bg-[#161a22]">
          {/* ============================================================ */}
          {/* TAB 1: ABOUT CIVICDUTY & FOUNDER'S MISSION */}
          {/* ============================================================ */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-semibold uppercase text-[10.5px]">
                  <ShieldCheck size={14} strokeWidth={1.75} />
                  <span>Sovereign Mission · Speak · Serve · Be Heard</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-[13px] leading-relaxed">
                  <strong>CivicDuty</strong> is a global Digital Public Infrastructure (DPI) and Consumer Accountability Utility supporting <strong>100+ sovereign nations</strong>. Powered by an <strong>Adaptive Administrative Engine</strong> that automatically configures to each country&apos;s constitutional hierarchy, CivicDuty eliminates bureaucratic ghosting, infrastructure neglect, and service delivery opacity.
                </p>
              </div>

              {/* 3-Signal Sovereign Accountability Loop */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                    <span>1. RED · Citizen Speaks</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Citizens &amp; verified residents file geotagged multimedia dispatches via Web or offline via <strong>*3030# USSD</strong>. When 5+ witnesses report the same hazard, CivicDuty auto-compiles a <strong>Master Dossier</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <div className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    <span>2. AMBER · Duty Bearers Serve</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Dispatches route directly to the statutory government desk (Parish/Ward, Sub-County/LGA, District/County, Ministry) or private provider with an immutable <strong>48h SLA Countdown</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>3. GREEN · Citizen Ratifies</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    No official can close a ticket unilaterally. A report only turns Green when the filing citizen or community witnesses inspect the physical fix and seal it with a <strong>SHA-256 Ratification Hash</strong>.
                  </p>
                </div>
              </div>

              {/* Adaptive Administrative Engine Card */}
              <div className="p-4 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass size={15} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Adaptive Administrative Engine (100+ Countries)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    Auto-Syncs Constitutional Tiers &amp; SLAs
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Whether operating in Uganda (OPM/MoLG → 146 District CAOs → Sub-Counties → 10,595 Parishes), Kenya (Devolution PS → 47 Counties → Sub-Counties → 1,450 Wards), Nigeria (Federal PS → 36 States → 774 LGAs → 8,812 Wards), Germany, the United Kingdom, India, or the United States, CivicDuty automatically adapts its administrative desks, statutory references, and currency.
                </p>
              </div>

              {/* Foundational Philosophy */}
              <div className="p-4 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award size={15} strokeWidth={1.75} className="text-amber-500" />
                  <span>Foundational Philosophy · Business Ethics &amp; Community Service</span>
                </h3>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Rooted in university training in <strong>Business Ethics and Community Service (USIU-Africa)</strong> and architected by Founder &amp; Lead System Architect <strong>Inzama Robin</strong>, CivicDuty bridges constitutional public accountability and ethical private-sector corporate social responsibility (CSR).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                  <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                    <strong className="text-emerald-700 dark:text-emerald-400 font-mono block mb-0.5">
                      100% Free for Citizens Forever
                    </strong>
                    Citizens never pay subscription fees to report broken boreholes, hospital drug stockouts, grid outages, or consumer service failures.
                  </div>
                  <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
                    <strong className="text-slate-900 dark:text-white font-mono block mb-0.5">
                      Praise &amp; Civic Honours Spotlight
                    </strong>
                    Citizens publicly commend heroic nurses, honest police officers, diligent teachers, and responsive utilities via verified commendations.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: PRIVACY POLICY & SOVEREIGN DATA PROTECTION CHARTER */}
          {/* ============================================================ */}
          {activeTab === 'privacy' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-semibold uppercase text-[10.5px]">
                  <Lock size={14} strokeWidth={1.75} />
                  <span>Sovereign Data Protection &amp; Citizen Privacy Charter</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Engineered in compliance with national data protection frameworks including the <strong>Uganda Data Protection and Privacy Act</strong>, <strong>Kenya Data Protection Act</strong>, <strong>Nigeria Data Protection Act (NDPA)</strong>, South Africa&apos;s <strong>POPIA</strong>, and the <strong>EU GDPR</strong>.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <Fingerprint size={14} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                    <span>1. Zero-Knowledge National ID &amp; Passport Verification</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    To prevent coordinated bot farms, defamation campaigns, or artificial vote manipulation, CivicDuty enforces the <strong>1 Verified ID = 1 Authentic Civic Voice</strong> standard. Your raw National ID Number (NIN) or ICAO Passport number is <strong>never stored in plain text on public feeds</strong>—only a salted SHA-256 cryptographic digest and a 4-character fragment (e.g. <code>#9028</code>) are bound to your civic dossier.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <Globe2 size={14} strokeWidth={1.75} className="text-amber-500" />
                    <span>2. Strict Country Access &amp; Foreign Resident Permit Protocol</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Sovereign civic participation is strictly bound to your verified jurisdiction. A citizen&apos;s National ID grants access solely to their home country. Non-citizens, expatriates, international students, diplomats, and travelers entering a foreign country&apos;s civic experience must authenticate via the <strong>Foreign Resident / Visitor Extension</strong> using a valid <strong>Work Permit, Resident Permit, Green Card, Alien Registration Card, Student Visa, or Entry Visa</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <ShieldCheck size={14} strokeWidth={1.75} className="text-rose-500" />
                    <span>3. Cryptographic Whistleblower Anonymity Shield (Anti-Graft)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    When a citizen files an <strong>Anti-Graft / Extortion Report</strong> or activates the <strong>Whistleblower Shield</strong>, CivicDuty masks the reporter&apos;s identity, strips EXIF device metadata from public view, and generates a zero-knowledge <strong>SHA-256 Evidence Seal</strong> for statutory oversight bodies (IGG, EACC, EFCC, Auditor General).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: TERMS OF USE & ACCEPTABLE CIVIC CONDUCT */}
          {/* ============================================================ */}
          {activeTab === 'terms' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-semibold uppercase text-[10.5px]">
                  <FileText size={14} strokeWidth={1.75} />
                  <span>Terms of Use &amp; Sovereign Civic Conduct Agreement</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  By accessing CivicDuty as a Citizen, Foreign Resident, Government Accounting Officer, Contractor, or Private Service Provider, you agree to these rules of evidence-based civic engagement.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    1. Evidence-Based Reporting &amp; Zero Defamation Rule
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    CivicDuty is an empirical public &amp; consumer service delivery ledger—not a rumor forum. Users must submit verifiable service defects, safety hazards, contract supervision memos, or authentic commendations. Uploading doctored media or partisan electioneering is prohibited.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <HardHat size={13} strokeWidth={1.75} className="text-amber-500" />
                    <span>2. Public Works Contracts, Dual Signoffs &amp; Citizen/Traveler Supervision</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Public infrastructure contracts require <strong>Dual Physical Signoff</strong> (1. Procuring Entity Supervising Engineer + 2. Awarded Contractor Executive) alongside open site inspection memos from local residents, community watchdogs, and highway travelers before treasury release warrants are minted.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    3. Claimed Service Provider Desks &amp; 30-Day Founding Partner Trial
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Private businesses, schools, hospitals, banks, utilities, and contractors receive a <strong>30-Day Founding Partner Free Trial ($0 Due Today · Code: FOUNDING-TRIAL-30D)</strong>. Once claimed, verified desk administrators may customize their official wall profile, physical branch location, brand logo, and customer care hotlines.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    4. Interactive Demo Showcases Across All Platform Activities
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Illustrative demo records badged <code>ILLUSTRATIVE DEMO</code> demonstrate 5-Witness Master Dossiers, SLA Escalations, Contractor Milestone Supervision, and SHA-256 Seals across all 100+ jurisdictions. Real citizen dispatches always rank #1 above demo showcases.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: ETHICAL PERKS & ANTI-BRIBERY COVENANT */}
          {/* ============================================================ */}
          {activeTab === 'ethics' && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-semibold uppercase text-[10.5px]">
                  <Scale size={14} strokeWidth={1.75} />
                  <span>Ethical Civic Stewardship &amp; Anti-Hush-Money Covenant (ISO 26000)</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  How CivicDuty reimburses citizens for community service without ever allowing rewards to become bribes or conflicts of interest:
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <Gift size={14} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Pillar 1 · Field Cost Reimbursement Framing (Not Bounties)</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    When a citizen uses mobile data to upload high-resolution video of a burst water main or rides a bodaboda to verify a road repair, they incur real out-of-pocket costs. Every voucher in the Sovereign Perk Escrow Vault is legally structured as a <strong>Field Evidence &amp; Utility Cost Reimbursement</strong> (Mobile Data, Water Credit, Prepaid Electricity, or Transit Pass).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <CheckCircle2 size={14} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Pillar 2 · The Anti-Hush-Money &amp; Non-Interference Rule</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    A contractor or authority <strong>cannot</strong> use a voucher to buy silence. Dispatching or accepting a perk voucher <strong>never</strong> closes, locks, hides, or mutes a ticket. A citizen who receives a Field Cost Reimbursement voucher retains <strong>100% of their constitutional right to click &ldquo;Dispute / Re-open&rdquo;</strong> if the physical repair on the ground is shoddy.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
                    <Building2 size={14} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Pillar 3 · Supply Chain &amp; Commission Transparency</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    Citizens always receive <strong>100% of the stated face value</strong> of every utility voucher. During the 30-Day Founding Trial, sponsors may upload pre-purchased utility PINs via CSV (<strong>BYOV Mode at 0% fee</strong>). On instant aggregator checkouts, CivicDuty earns a transparent <strong>6% B2B Wholesale Aggregator Spread</strong> plus a <strong>10% Corporate CSR Escrow &amp; Audit Fee</strong> while issuing a <strong>SHA-256 Verifiable CSR Impact Certificate</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Studio Footer Bar */}
        <div className="px-4 sm:px-5 py-3 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
            CivicDuty Sovereign Public Ledger · 100+ Jurisdictions · ISO 26000 &amp; SHA-256 Audited
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] hover:border-slate-400 dark:hover:border-slate-600 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy size={12} strokeWidth={1.75} />
              <span>Copy Digest</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] hover:border-slate-400 dark:hover:border-slate-600 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={12} strokeWidth={1.75} />
              <span>Print Charter</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

