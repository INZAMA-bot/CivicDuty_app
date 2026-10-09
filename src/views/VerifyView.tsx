import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Search, 
  Landmark, 
  Building2, 
  Calendar, 
  FileText, 
  Printer, 
  Lock, 
  ExternalLink,
  Layers,
  Cpu,
  Clock,
  Award
} from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { generateCryptoSealSync } from '../utils/cryptoSeal';

export const VerifyView: React.FC = () => {
  const { go, verifyTarget, setVerifyTarget, projects, posts, user, toast } = useApp();
  const [searchCode, setSearchCode] = useState<string>(verifyTarget || 'UG-CERT-8841');

  useEffect(() => {
    if (verifyTarget) {
      setSearchCode(verifyTarget);
    }
  }, [verifyTarget]);

  // Resolves validation data dynamically based on search string
  const getValidationData = () => {
    const raw = searchCode.trim();
    const code = raw.toUpperCase();

    // Check if matching a post ticket or hash
    const matchedPost = posts.find(p => 
      p.id.toUpperCase() === code || 
      p.crypto_seal_hash?.toUpperCase() === code ||
      raw.includes(p.id) ||
      (p.crypto_seal_hash && raw.includes(p.crypto_seal_hash.slice(0, 16)))
    );

    if (matchedPost) {
      const seal = matchedPost.crypto_seal_hash || generateCryptoSealSync(`TICKET:${matchedPost.id}:${matchedPost.title}`);
      return {
        type: 'ticket',
        valid: true,
        title: `Statutory Civic Resolution: ${matchedPost.title}`,
        holder: matchedPost.anonymous ? 'Protected Anonymous Citizen' : matchedPost.citizen_name,
        authority: 'Ministry of Local Government & Line Service Desks',
        country: matchedPost.country || 'UG',
        dateIssued: matchedPost.created_at.slice(0, 10),
        expiryDate: 'PERMANENT IMMUTABLE CIVIC RECORD',
        value: `Tier: ${matchedPost.escalation_tier || 'Parish Level'} · Status: ${matchedPost.status.toUpperCase()}`,
        hash: seal,
        blockHeight: '#9,484,200',
        status: matchedPost.status === 'resolved' ? 'VERIFIED SATISFACTORY & RATIFIED' : 'ACTIVE AUDIT DISPATCH',
        details: [
          { label: 'Ticket Reference', val: `#${matchedPost.id}` },
          { label: 'Assigned Department', val: matchedPost.dept.toUpperCase() },
          { label: 'Community Support', val: `${matchedPost.upvotes} Citizens Endorsed` },
          { label: 'Ratification State', val: matchedPost.citizen_dispute_status || 'Under SLA Oversight' },
        ],
      };
    }

    if (code.includes('PRJ-') || code.includes('KCCA') || code.includes('UNRA') || code.includes('CONTRACT')) {
      const prj = projects.find((p) => p.code === code || p.id.includes(code.toLowerCase())) || projects[0];
      return {
        type: 'contract',
        valid: true,
        title: prj?.title || 'Public Works Sovereign Contract',
        holder: prj?.contractor || 'Stirling Civil Engineering Ltd',
        authority: 'Public Procurement & Disposal of Public Assets Authority (PPDA)',
        country: prj?.country || 'UG',
        dateIssued: prj?.starts || '2026-02-01',
        expiryDate: prj?.completes || '2026-11-30',
        value: prj?.value || 'UGX 1,450,000,000',
        hash: '0x8f9c2a71e4d3b6a05e219c77d4bf093e6210f92b45a3c108e4d372fa018e6cb1',
        blockHeight: '#9,482,109',
        status: 'AUTHENTIC & ACTIVE ON SOVEREIGN REGISTRY',
        details: [
          { label: 'Tender Reference', val: prj?.tender || 'TND-KCCA-2026-042' },
          { label: 'Executing Contractor', val: prj?.contractor || 'Stirling Civil Eng' },
          { label: 'Supervising Ministry', val: 'Ministry of Works & Transport' },
          { label: 'Public Audit Status', val: 'Milestones Verified & Cryptographically Signed' },
        ],
      };
    }

    if (code.includes('PERK') || code.includes('VOUCHER') || code.includes('DISCOUNT')) {
      return {
        type: 'perk',
        valid: true,
        title: 'Sovereign Civic Duty Tax Perk / Utility Credit Voucher',
        holder: user?.name || 'Verified Citizen Holder',
        authority: 'Uganda Revenue Authority (URA) & National Water (NWSC)',
        country: 'UG',
        dateIssued: '2026-08-15',
        expiryDate: '2026-12-31',
        value: 'UGX 50,000 Utility Offset / 2% Tariff Reduction',
        hash: '0x3c71a9e4bf09210f92b45a3c108e4d372fa018e6cb18f9c2a71e4d3b6a05e219',
        blockHeight: '#9,481,772',
        status: 'VERIFIED REDEEMABLE VOUCHER',
        details: [
          { label: 'Citizen Rank', val: 'Parish Commander (500+ CivicScore)' },
          { label: 'Redemption Code', val: code },
          { label: 'Accepted Outlets', val: 'NWSC, Umeme, KCCA Property Rate Offset' },
          { label: 'Issuance Protocol', val: 'Section 42-A Sovereign Tax Incentive Code' },
        ],
      };
    }

    // Default: Citizen Merit Certificate
    return {
      type: 'cert',
      valid: true,
      title: 'National Sovereign Civic Integrity & Resolution Certificate',
      holder: user?.name || 'Citizen Robin Inzama',
      authority: 'National CivicDuty Oversight & Directorate of Public Ethics',
      country: 'UG',
      dateIssued: '2026-08-20',
      expiryDate: 'PERMANENT IMMUTABLE RECORD',
      value: 'Grade A Citizen Inspector Credential',
      hash: raw.startsWith('0x') ? raw : '0x19f8a27b4e90c812d45a99018e6cb18f9c2a71e4d3b6a05e219c77d4bf093e62',
      blockHeight: '#9,480,014',
      status: 'CRYPTOGRAPHICALLY SEALED & VERIFIED',
      details: [
        { label: 'Citizen NIN Hash', val: 'CM9201482910**** (Verified by NIRA)' },
        { label: 'Primary Node / Parish', val: 'Kampala Central / Nakasero Node 01' },
        { label: 'Resolution Rate', val: '100% Validated Community Actions' },
        { label: 'Signoff Authority', val: 'Government Spokesperson & Civil Audit Board' },
      ],
    };
  };

  const validation = getValidationData();
  const country = COUNTRIES[validation.country] || COUNTRIES['UG'];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 px-4 py-5 transition-colors pb-24 max-w-3xl mx-auto space-y-4">
      {/* Studio Top Bar & Hero Header Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e6ea] dark:border-[#262b36] flex-wrap gap-2">
          <button
            onClick={() => go('feed')}
            className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Feed</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-semibold">
            <ShieldCheck size={13} />
            <span>SHA-256 Cryptographic Engine</span>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div className="space-y-1">
            <h1 className="text-base sm:text-lg font-bold font-mono uppercase tracking-tight text-slate-900 dark:text-white">
              Sovereign Verification Portal
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Public, transparent cryptographic verification of citizen certificates, public work tenders, and statutory tax vouchers.
            </p>
          </div>
        </div>
      </div>

      {/* Code Search Box */}
      <div className="p-4 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl space-y-2.5">
        <label className="block text-[10px] font-mono font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
          Enter Audit Hash, Ticket ID or Work Code
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. KLA-102 or 0x8f9c... or UG-CERT-8841"
              className="w-full pl-8 pr-3 py-2 text-xs font-mono font-semibold rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => toast('Cryptographic proof verified on national ledger', 'emerald')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
          >
            Verify
          </button>
        </div>

        {/* Quick Example Codes */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
          <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Samples:</span>
          {['KLA-102', 'UG-CERT-8841', 'PRJ-KCCA-2026', 'CD-PERK-3982'].map((c) => (
            <button
              key={c}
              onClick={() => setSearchCode(c)}
              className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 transition-colors border border-[#e3e6ea] dark:border-[#262b36] cursor-pointer"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Official Cryptographic Certificate Document Extract */}
      <div className="p-4 sm:p-5 border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] rounded-xl relative overflow-hidden space-y-4">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
              {validation.country}
            </span>
            <div>
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
                {country.name} · SOVEREIGN CIVIC REGISTRY
              </div>
              <div className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                IMMUTABLE PUBLIC AUDIT RECORD
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/25">
            <CheckCircle2 size={12} />
            <span>VERIFIED</span>
          </div>
        </div>

        {/* Document Title */}
        <div className="py-1 space-y-1">
          <span className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
            Document Record
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
            {validation.title}
          </h2>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Holder: <strong className="text-slate-900 dark:text-slate-100 font-semibold">{validation.holder}</strong>
          </div>
        </div>

        {/* Status Banner */}
        <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <div className="text-[10.5px] font-semibold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lock size={12} />
            <span>{validation.status}</span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
            SHA-256: {validation.hash}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-1">
          {validation.details.map((d, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-[9px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                {d.label}
              </div>
              <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {d.val}
              </div>
            </div>
          ))}
        </div>

        {/* Block Height & Issuing Authority */}
        <div className="border-t border-[#e3e6ea] dark:border-[#262b36] pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <div>
            <span>Ledger Block: </span>
            <strong className="text-slate-900 dark:text-slate-100">{validation.blockHeight}</strong>
          </div>
          <div>
            <span>Timestamp: </span>
            <strong className="text-slate-900 dark:text-slate-100">{new Date().toLocaleDateString()}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-800 dark:text-slate-200 text-[10.5px] font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>Print Extract</span>
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              toast('Verification link copied to clipboard!', 'emerald');
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>Share Seal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
