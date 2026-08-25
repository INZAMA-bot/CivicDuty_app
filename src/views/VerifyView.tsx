import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CheckCircle2, ArrowLeft, Search, Award, Landmark, Building2, Calendar, FileText, QrCode, Printer, Lock, ExternalLink } from 'lucide-react';
import { COUNTRIES } from '../data/countries';

export const VerifyView: React.FC = () => {
  const { go, verifyTarget, setVerifyTarget, projects, posts, profiles, user } = useApp();
  const [searchCode, setSearchCode] = useState<string>(verifyTarget || 'UG-CERT-8841');
  const [activeTab, setActiveTab] = useState<'cert' | 'contract' | 'perk' | 'ticket'>('cert');

  useEffect(() => {
    if (verifyTarget) {
      setSearchCode(verifyTarget);
      if (verifyTarget.startsWith('PRJ-')) setActiveTab('contract');
      else if (verifyTarget.startsWith('CD-PERK-')) setActiveTab('perk');
      else if (verifyTarget.startsWith('UG-') || verifyTarget.startsWith('CERT-')) setActiveTab('cert');
    }
  }, [verifyTarget]);

  // Mock cryptographic validation resolution
  const getValidationData = () => {
    const code = searchCode.trim().toUpperCase();

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

    // Default: Citizen Merit & Verification Certificate
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
      hash: '0x19f8a27b4e90c812d45a99018e6cb18f9c2a71e4d3b6a05e219c77d4bf093e62',
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 px-4 py-5 transition-colors">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => go('feed')}
          className="flex items-center gap-1.5 text-xs mono font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] mono font-bold">
          <ShieldCheck size={13} />
          <span>Public Ledger Node</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center py-5 space-y-2">
        <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-1">
          <ShieldCheck size={28} className="stroke-[2.5]" />
        </div>
        <h1 className="text-xl font-black mono uppercase tracking-wider text-slate-900 dark:text-slate-100">
          Sovereign Verification Portal
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Public, transparent cryptographic verification of citizen certificates, public work tenders, and statutory tax vouchers.
        </p>
      </div>

      {/* Code Search Box */}
      <div className="card p-3.5 mb-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <label className="block text-[9.5px] mono font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5 tracking-wider">
          Enter Audit Hash, Cert ID or Work Code:
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="e.g. UG-CERT-8841 or PRJ-KCCA-2026"
              className="w-full pl-8 pr-3 py-2 text-xs mono font-bold uppercase rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs mono font-bold rounded-xl uppercase tracking-wider shadow-sm transition-all"
          >
            Verify
          </button>
        </div>

        {/* Quick Example Codes */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[8px] mono text-slate-500 uppercase tracking-wider">Quick Samples:</span>
          {['UG-CERT-8841', 'PRJ-KCCA-2026', 'CD-PERK-3982'].map((c) => (
            <button
              key={c}
              onClick={() => setSearchCode(c)}
              className="px-2 py-0.5 rounded-md text-[8.5px] mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Official Cryptographic Certificate Document Extract */}
      <div className="card p-5 border-2 border-emerald-500/40 dark:border-emerald-500/50 bg-white dark:bg-slate-900/90 shadow-lg relative overflow-hidden space-y-4">
        {/* Background Security Guilloche Watermark */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none flex items-center justify-center">
          <ShieldCheck size={280} />
        </div>

        {/* Header Ribbon */}
        <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{country.flag}</span>
            <div>
              <div className="text-[11px] font-black mono uppercase tracking-wider text-slate-900 dark:text-slate-100">
                {country.name} · SOVEREIGN CIVIC REGISTRY
              </div>
              <div className="text-[8px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                IMMUTABLE PUBLIC AUDIT RECORD
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] mono font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-400/40">
            <CheckCircle2 size={12} />
            <span>VERIFIED</span>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center py-1 space-y-1">
          <span className="text-[8px] mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
            Document Record
          </span>
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-snug">
            {validation.title}
          </h2>
          <div className="text-[9px] mono text-slate-500 dark:text-slate-400">
            Issued to: <strong className="text-slate-800 dark:text-slate-200">{validation.holder}</strong>
          </div>
        </div>

        {/* Status Banner */}
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 text-center space-y-0.5">
          <div className="text-[9.5px] font-black mono text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Lock size={11} />
            <span>{validation.status}</span>
          </div>
          <div className="text-[8px] mono text-slate-500 dark:text-slate-400 truncate">
            SHA-256: {validation.hash}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-left pt-1">
          {validation.details.map((d, i) => (
            <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[7.5px] mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                {d.label}
              </div>
              <div className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {d.val}
              </div>
            </div>
          ))}
        </div>

        {/* Block Height & Issuing Authority */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-[8px] mono text-slate-500 dark:text-slate-400">
          <div>
            <span>Ledger Block: </span>
            <strong className="text-slate-700 dark:text-slate-300">{validation.blockHeight}</strong>
          </div>
          <div>
            <span>Timestamp: </span>
            <strong className="text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString()}</strong>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] mono font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Printer size={13} />
            <span>Print Extract</span>
          </button>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              alert('Verification URL copied to clipboard!');
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] mono font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <ExternalLink size={13} />
            <span>Share Seal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
