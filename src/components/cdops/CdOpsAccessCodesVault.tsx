import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  Building2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  FileText,
  Send,
  Lock,
  Landmark,
  Sparkles,
  Info,
  ChevronRight,
  Printer,
  Globe,
  Radio,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GOV_CODES } from '../../data/tiers';
import { COUNTRIES } from '../../data/countries';
import { GovCodeData, CountryCode } from '../../types';

export const CdOpsAccessCodesVault: React.FC = () => {
  const { customGovCodes, mintGovAccessCode, revokeGovAccessCode, directLoginWithGovCode, toast } = useApp();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedMemoCode, setSelectedMemoCode] = useState<string | null>('PS-MOLG-2026');
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('ALL');

  // Mint Form State
  const [mintCode, setMintCode] = useState('');
  const [mintCountry, setMintCountry] = useState<CountryCode>('UG');
  const [mintDept, setMintDept] = useState('molg');
  const [mintScope, setMintScope] = useState('UG');
  const [mintOfficerName, setMintOfficerName] = useState('');
  const [mintRoleLabel, setMintRoleLabel] = useState('');
  const [mintShortTitle, setMintShortTitle] = useState('');
  const [mintRole, setMintRole] = useState<'platform_admin' | 'node_admin' | 'spokesperson' | 'read_only'>('platform_admin');
  const [mintHierarchy, setMintHierarchy] = useState<'tier1_parish' | 'tier2_subcounty' | 'tier3_district_cao' | 'tier4_agency' | 'tier5_perm_sec'>('tier5_perm_sec');

  // Merge built-in GOV_CODES with custom codes
  const allCodesMap = { ...GOV_CODES, ...customGovCodes };
  const allCodeKeys = Object.keys(allCodesMap);

  // Filtered list
  const filteredKeys = allCodeKeys.filter((code) => {
    const data = allCodesMap[code];
    if (selectedCountryFilter !== 'ALL' && data.country !== selectedCountryFilter) {
      return false;
    }
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase();
    return (
      code.toLowerCase().includes(term) ||
      (data.officer_name && data.officer_name.toLowerCase().includes(term)) ||
      (data.role_label && data.role_label.toLowerCase().includes(term)) ||
      (data.dept && data.dept.toLowerCase().includes(term))
    );
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    toast(`✓ ${label} copied to clipboard!`, 'emerald');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDirectLogin = (code: string) => {
    directLoginWithGovCode(code);
  };

  const handleMintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mintCode.trim()) {
      toast('Access Code format is required (e.g. PS-MOLG-2026)', 'red');
      return;
    }
    const clean = mintCode.trim().toUpperCase();
    const newRecord: GovCodeData = {
      country: mintCountry,
      dept: mintDept.trim().toLowerCase(),
      scope: mintScope.trim() || mintCountry,
      role: mintRole,
      is_utility: false,
      role_label: mintRoleLabel.trim() || `${mintOfficerName || 'Accounting Officer'}, ${mintDept.toUpperCase()}`,
      real_title_short: mintShortTitle.trim() || mintRoleLabel.trim() || 'Accounting Officer',
      hierarchy_level: mintHierarchy,
      escalation_rank: mintHierarchy === 'tier5_perm_sec' ? 5 : mintHierarchy === 'tier3_district_cao' ? 3 : 2,
      officer_name: mintOfficerName.trim() || undefined,
    };

    mintGovAccessCode(clean, newRecord);
    setIsMintModalOpen(false);
    setMintCode('');
    setMintOfficerName('');
    setMintRoleLabel('');
  };

  // Target data for the Diplomatic Transmittal Memo
  const memoTargetCode = selectedMemoCode || 'PS-MOLG-2026';
  const memoTargetData = allCodesMap[memoTargetCode] || GOV_CODES['PS-MOLG-2026'];
  const memoTargetCountry = COUNTRIES[memoTargetData?.country as any] || { name: 'Uganda', flag: '🇺🇬' };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* Executive Header */}
      <div className="card p-5 bg-gradient-to-r from-teal-500/10 via-amber-500/5 to-transparent border-teal-500/30 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Key size={18} />
            </div>
            <div>
              <span className="text-[10px] mono font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
                Sovereign Accounting Officer Access Codes &amp; Credential Vault
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Technical Access Provisioning for National Officials
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMintModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus size={14} /> Mint Sovereign Code
            </button>
          </div>
        </div>

        <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          Under statutory public finance management accords (such as the Uganda PFMA 2015), national accounting officers and permanent secretaries require strictly partitioned, audit-logged administrative credentials. Here you can inspect credentials, generate diplomatic transmittal briefs for executive dispatch, and test consoles directly.
        </p>
      </div>

      {/* SPOTLIGHT: MoLG Permanent Secretary Credential Protocol */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-teal-500/40 shadow-lg space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-teal-400">
              🇺🇬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] mono uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-800 dark:text-teal-300 font-bold border border-teal-500/30">
                  APEX NATIONAL ACCOUNTING OFFICER · TIER 5
                </span>
                <span className="text-[9px] mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                  ACTIVE ON GATEWAY
                </span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                Permanent Secretary, Ministry of Local Government (MoLG)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Designated Officer: <strong>Ben Kumumanya</strong> · Workers House, Southern Wing, Kampala
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDirectLogin('PS-MOLG-2026')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserCheck size={14} />
              <span>Test Console as PS MoLG</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* 3 Technical Delivery Vectors for MoLG */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Vector 1: Code */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] mono font-bold uppercase text-slate-500 dark:text-slate-400">
                Vector 1 · Official Access Code
              </span>
              <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold">
                Apex Key
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <code className="text-xs font-black mono text-teal-700 dark:text-teal-300">
                PS-MOLG-2026
              </code>
              <button
                onClick={() => handleCopy('PS-MOLG-2026', 'PS MoLG Access Code')}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Copy Code"
              >
                {copiedCode === 'PS-MOLG-2026' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Enter directly into Government Desk login, or send via secure SMS/WhatsApp to the PS's private executive aide.
            </p>
          </div>

          {/* Vector 2: Pre-authenticated Link */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] mono font-bold uppercase text-slate-500 dark:text-slate-400">
                Vector 2 · Direct Pre-Auth Portal URL
              </span>
              <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                1-Click URL
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <code className="text-[10px] mono text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                {typeof window !== 'undefined' ? `${window.location.origin}/?gov_code=PS-MOLG-2026` : '?gov_code=PS-MOLG-2026'}
              </code>
              <button
                onClick={() =>
                  handleCopy(
                    typeof window !== 'undefined' ? `${window.location.origin}/?gov_code=PS-MOLG-2026` : '?gov_code=PS-MOLG-2026',
                    'Direct Portal URL'
                  )
                }
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Copy Link"
              >
                {copiedCode && copiedCode.includes('gov_code=PS-MOLG-2026') ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Bypasses credential typing. Automatically validates NITA-U sovereignty certificate and mounts rollout desk.
            </p>
          </div>

          {/* Vector 3: Diplomatic Memorandum */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] mono font-bold uppercase text-slate-500 dark:text-slate-400">
                Vector 3 · Diplomatic Brief Memo
              </span>
              <span className="text-[8px] mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold">
                Pouch / Letter
              </span>
            </div>
            <button
              onClick={() => setSelectedMemoCode('PS-MOLG-2026')}
              className="w-full py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <FileText size={13} />
              <span>Preview Transmittal Memorandum</span>
            </button>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Formally stamped letter ready to print or dispatch via courier to Workers House, Southern Wing.
            </p>
          </div>
        </div>
      </div>

      {/* Diplomatic Transmittal Memorandum Generator Box */}
      {selectedMemoCode && memoTargetData && (
        <div className="p-5 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl space-y-4 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <Landmark size={18} className="text-teal-400" />
              <div>
                <h4 className="text-xs font-bold uppercase mono text-teal-400 tracking-wider">
                  Diplomatic Memorandum of Technical Accession
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ready-to-dispatch transmittal brief for {memoTargetData.officer_name || memoTargetCode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const memoText = `MEMORANDUM OF TECHNICAL ACCESSION & SOVEREIGN DESK CREDENTIALS
DATE: ${new Date().toISOString().slice(0, 10)}
TO: The Permanent Secretary, ${memoTargetData.dept.toUpperCase()}
OFFICER: ${memoTargetData.officer_name || 'Designated Accounting Officer'}
JURISDICTION: ${memoTargetCountry.name}
------------------------------------------------------------
CIVICDUTY CD-OPS DISPATCH REF: CD-MOLG-${new Date().getFullYear()}-001
MASTER ACCESS CODE: ${memoTargetCode}
PLATFORM ROLE: ${memoTargetData.role.toUpperCase()} (${memoTargetData.hierarchy_level || 'Tier 5'})
USSD ZERO-RATED SHORTCODE: *3030*256# (MTN / Airtel Uganda)
DIRECT SECURE PORTAL URL: ${typeof window !== 'undefined' ? `${window.location.origin}/?gov_code=${memoTargetCode}` : `/?gov_code=${memoTargetCode}`}

SECURITY CLEARANCE:
Pursuant to statutory mandates under Section 45 of the Public Finance Management Act, this credential permits apex circular broadcasting to all 135 Districts & 10 Cities, PDM Parish Chief tablet telemetry synchronization, and statutory SLA recalibration.

SIGNED:
Eng. Ronald Ssematimba (Lead Sovereign Infrastructure Architect)
CivicDuty Platform Operations (CD-Ops)`;
                  handleCopy(memoText, 'Diplomatic Transmittal Memorandum');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Copy size={13} />
                <span>Copy Memorandum Text</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2 leading-relaxed">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-800/80 pb-2">
              <span>DISPATCH REF: CD-MOLG-{new Date().getFullYear()}-001</span>
              <span>SECURITY LEVEL: APEX STATUTORY RESTRICTED</span>
            </div>
            <p>
              <strong className="text-teal-400">TO:</strong> The Permanent Secretary, {memoTargetData.dept.toUpperCase()} ({memoTargetCountry.name})<br />
              <strong className="text-teal-400">ATTENTION:</strong> {memoTargetData.officer_name || 'Designated Accounting Officer'}<br />
              <strong className="text-teal-400">SUBJECT:</strong> PROVISIONING OF EXECUTIVE CD-OPS SOVEREIGN COMMAND DESK
            </p>
            <p className="text-slate-400">
              Sir / Madam,<br />
              Pursuant to the Bilateral Sovereign Accord on Digital Civic Infrastructure, CivicDuty Platform Operations hereby delivers your master credential token to access the national rollout desk:
            </p>
            <div className="p-2.5 rounded-xl bg-teal-950/50 border border-teal-500/40 text-teal-300 space-y-1">
              <div><strong>SOVEREIGN ACCESS CODE:</strong> <span className="text-amber-400 font-black">{memoTargetCode}</span></div>
              <div><strong>DESIGNATED ROLE:</strong> {memoTargetData.role.toUpperCase()} (Apex Accounting Officer / Tier 5)</div>
              <div><strong>USSD SHORTCODE:</strong> *3030*256# (Synchronized on MTN &amp; Airtel nodes)</div>
              <div><strong>DIRECT ACCESS URL:</strong> {typeof window !== 'undefined' ? `${window.location.origin}/?gov_code=${memoTargetCode}` : `/?gov_code=${memoTargetCode}`}</div>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              Actions conducted under this access code generate permanent SHA-256 dispatch receipts and are auditable by the Office of the Auditor General (OAG).
            </p>
          </div>
        </div>
      )}

      {/* Directory of Sovereign Access Codes */}
      <div className="card p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-teal-600" />
              <span>Sovereign Official Credential Directory</span>
              <span className="text-[10px] mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {filteredKeys.length} active codes
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permanent Secretaries, City Executive Directors, Chief Administrative Officers, and Regulators
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Country Filter */}
            <select
              value={selectedCountryFilter}
              onChange={(e) => setSelectedCountryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="ALL">🌐 All Countries</option>
              {Object.entries(COUNTRIES).map(([cCode, cInfo]) => (
                <option key={cCode} value={cCode}>
                  {cInfo.flag} {cInfo.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search code, name, ministry..."
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden w-48"
            />
          </div>
        </div>

        {/* Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredKeys.map((code, idx) => {
            const data = allCodesMap[code];
            const country = COUNTRIES[data.country as any];
            const isCustom = !!customGovCodes[code];
            const isMoLG = code === 'PS-MOLG-2026' || code === 'PS-MOLG-ROLLOUT';

            return (
              <div
                key={`${code}-${idx}`}
                className={`p-4 rounded-2xl border transition-all space-y-3 bg-white dark:bg-slate-900 ${
                  isMoLG
                    ? 'border-teal-500/60 ring-1 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{country?.flag || '🌐'}</span>
                      <code className="text-xs font-black mono text-teal-700 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-lg">
                        {code}
                      </code>
                      {isCustom && (
                        <span className="text-[8px] mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                          Custom Minted
                        </span>
                      )}
                      {isMoLG && (
                        <span className="text-[8px] mono uppercase px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-800 dark:text-teal-300 font-bold">
                          MoLG Desk
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5">
                      {data.officer_name || data.real_title_short || data.role_label}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {data.role_label}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(code, `Code ${code}`)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                      title="Copy Code"
                    >
                      {copiedCode === code ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                    {isCustom && (
                      <button
                        onClick={() => revokeGovAccessCode(code)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500 transition-colors"
                        title="Revoke Code"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] mono text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{data.role.replace('_', ' ')}</span>
                    <span>·</span>
                    <span className="uppercase">{data.dept}</span>
                    <span>·</span>
                    <span>Rank {data.escalation_rank || 5}/5</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedMemoCode(code)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors"
                    >
                      Memo
                    </button>
                    <button
                      onClick={() => handleDirectLogin(code)}
                      className="px-2 py-0.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Test</span>
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mint Sovereign Code Modal */}
      {isMintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600">
                  <Key size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Mint Sovereign Access Code
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Provision new credential key for incoming national accounting officer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMintModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleMintSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Access Code Key *
                </label>
                <input
                  type="text"
                  value={mintCode}
                  onChange={(e) => setMintCode(e.target.value.toUpperCase())}
                  placeholder="e.g. PS-MOLG-NEW-2026"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono uppercase focus:outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Sovereign Country
                  </label>
                  <select
                    value={mintCountry}
                    onChange={(e) => setMintCountry(e.target.value as CountryCode)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    {Object.entries(COUNTRIES).map(([cCode, cInfo]) => (
                      <option key={cCode} value={cCode}>
                        {cInfo.flag} {cInfo.name} ({cCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Hierarchy Level
                  </label>
                  <select
                    value={mintHierarchy}
                    onChange={(e) => setMintHierarchy(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="tier5_perm_sec">Tier 5 · Permanent Secretary (Apex)</option>
                    <option value="tier4_agency">Tier 4 · Agency / Authority Lead</option>
                    <option value="tier3_district_cao">Tier 3 · District CAO / Mayor</option>
                    <option value="tier2_subcounty">Tier 2 · Sub-County / Town Clerk</option>
                    <option value="tier1_parish">Tier 1 · Parish Chief</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Officer Full Name
                </label>
                <input
                  type="text"
                  value={mintOfficerName}
                  onChange={(e) => setMintOfficerName(e.target.value)}
                  placeholder="e.g. Ben Kumumanya"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                  Official Title &amp; Ministry
                </label>
                <input
                  type="text"
                  value={mintRoleLabel}
                  onChange={(e) => setMintRoleLabel(e.target.value)}
                  placeholder="e.g. Permanent Secretary, Ministry of Local Government"
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Dept Identifier
                  </label>
                  <input
                    type="text"
                    value={mintDept}
                    onChange={(e) => setMintDept(e.target.value)}
                    placeholder="e.g. molg, mofped, unra"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] mono font-bold uppercase text-slate-600 dark:text-slate-400">
                    Role Privilege
                  </label>
                  <select
                    value={mintRole}
                    onChange={(e) => setMintRole(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="platform_admin">Platform Admin (National Superadmin)</option>
                    <option value="node_admin">Node Admin (District / Regional)</option>
                    <option value="spokesperson">Spokesperson (Local Desk)</option>
                    <option value="read_only">Read-Only (Auditor General / Oversight)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMintModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Mint &amp; Activate Code</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
