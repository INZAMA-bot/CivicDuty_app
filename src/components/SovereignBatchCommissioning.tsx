import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, RoleType } from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { getNationalRolloutArrangements } from '../data/tiers';
import {
  getRolloutNodesForCountry,
  getSisterMinistriesForCountry,
  RolloutDistrictNode,
  SisterMinistryNode
} from '../data/nationalRolloutNodes';
import {
  Shield,
  Key,
  Users,
  Building2,
  CheckCircle2,
  Copy,
  Download,
  Send,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';

interface SovereignBatchCommissioningProps {
  country?: CountryCode;
  onClose?: () => void;
}

export const SovereignBatchCommissioning: React.FC<SovereignBatchCommissioningProps> = ({
  country,
  onClose
}) => {
  const { user, toast, mintGovAccessCode, addInvite, logAudit, directLoginWithGovCode } = useApp();

  const activeCountry: CountryCode = country || user?.country || 'UG';
  const countryObj = COUNTRIES[activeCountry] || { name: activeCountry, flag: activeCountry };
  const rollout = getNationalRolloutArrangements(activeCountry);

  const districtNodes = useMemo(() => getRolloutNodesForCountry(activeCountry), [activeCountry]);
  const sisterMinistries = useMemo(() => getSisterMinistriesForCountry(activeCountry), [activeCountry]);

  // Selections
  const [selectedDistrictIds, setSelectedDistrictIds] = useState<string[]>(() =>
    districtNodes.map(d => d.id)
  );
  const [selectedMinistryIds, setSelectedMinistryIds] = useState<string[]>(() =>
    sisterMinistries.map(m => m.id)
  );

  // Search & Filter
  const [districtSearch, setDistrictSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'both' | 'caos' | 'sister_ps'>('both');

  // Minted Results state
  const [mintedResults, setMintedResults] = useState<{
    timestamp: string;
    items: {
      type: 'CAO' | 'SISTER_PS';
      id: string;
      code: string;
      name: string;
      title: string;
      station: string;
      legalBasis: string;
    }[];
  } | null>(null);

  const [copiedMemo, setCopiedMemo] = useState(false);

  // Toggle selection helpers
  const toggleAllDistricts = () => {
    if (selectedDistrictIds.length === districtNodes.length) {
      setSelectedDistrictIds([]);
    } else {
      setSelectedDistrictIds(districtNodes.map(d => d.id));
    }
  };

  const toggleAllMinistries = () => {
    if (selectedMinistryIds.length === sisterMinistries.length) {
      setSelectedMinistryIds([]);
    } else {
      setSelectedMinistryIds(sisterMinistries.map(m => m.id));
    }
  };

  const filteredDistricts = districtNodes.filter(d =>
    !districtSearch ||
    d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.cao.toLowerCase().includes(districtSearch.toLowerCase()) ||
    d.id.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const handleExecuteBatchCommissioning = () => {
    const shouldMintDistricts = activeCategory === 'both' || activeCategory === 'caos';
    const shouldMintMinistries = activeCategory === 'both' || activeCategory === 'sister_ps';

    const targetDistricts = shouldMintDistricts
      ? districtNodes.filter(d => selectedDistrictIds.includes(d.id))
      : [];
    const targetMinistries = shouldMintMinistries
      ? sisterMinistries.filter(m => selectedMinistryIds.includes(m.id))
      : [];

    if (targetDistricts.length === 0 && targetMinistries.length === 0) {
      toast('Select at least one CAO or Sister Permanent Secretary to mint.', 'red');
      return;
    }

    const mintedList: {
      type: 'CAO' | 'SISTER_PS';
      id: string;
      code: string;
      name: string;
      title: string;
      station: string;
      legalBasis: string;
    }[] = [];

    // 1. Mint CAO Accounting Officers
    targetDistricts.forEach((d) => {
      const codeClean = d.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const code = `CAO-${codeClean}-2026`;
      const title = `${rollout.targets.l2l3Title.split('/')[0]} Accounting Officer / CAO`;
      const legalBasis = `Section 64, Local Governments Act (Cap. 243) & PFMA Section 45`;

      // Register in AppContext via mintGovAccessCode
      mintGovAccessCode(code, {
        country: activeCountry,
        dept: 'molg',
        scope: d.id,
        role: 'node_admin',
        is_utility: false,
        is_admin: true,
        role_label: `${title} (${d.name})`,
        real_title_short: title,
        hierarchy_level: 'tier3_district_cao',
        escalation_rank: 3,
        officer_name: d.cao,
        duty_station: d.name,
      });

      // Register invite record for team listing
      addInvite({
        code,
        name: d.cao,
        title,
        role: 'node_admin',
        scope: d.id,
        dept: 'molg',
        is_utility: false,
        used: false,
        country: activeCountry,
        hierarchy_level: 'tier3_district_cao',
        escalation_rank: 3,
      });

      mintedList.push({
        type: 'CAO',
        id: d.id,
        code,
        name: d.cao,
        title,
        station: d.name,
        legalBasis,
      });
    });

    // 2. Mint Sister Line Ministry Permanent Secretaries
    targetMinistries.forEach((m) => {
      const code = m.code;
      const title = m.title;
      const legalBasis = `Article 174 of the Constitution & National Public Finance Management Act`;

      mintGovAccessCode(code, {
        country: activeCountry,
        dept: m.deptId,
        scope: activeCountry,
        role: 'platform_admin',
        is_utility: true,
        is_admin: true,
        role_label: `${title} - National Desk`,
        real_title_short: title,
        hierarchy_level: 'tier5_perm_sec',
        escalation_rank: 5,
        officer_name: m.permSecretary,
        duty_station: 'National Cabinet Secretariat',
      });

      addInvite({
        code,
        name: m.permSecretary,
        title,
        role: 'platform_admin',
        scope: activeCountry,
        dept: m.deptId,
        is_utility: true,
        used: false,
        country: activeCountry,
        hierarchy_level: 'tier5_perm_sec',
        escalation_rank: 5,
      });

      mintedList.push({
        type: 'SISTER_PS',
        id: m.id,
        code,
        name: m.permSecretary,
        title,
        station: 'National Cabinet Secretariat',
        legalBasis,
      });
    });

    setMintedResults({
      timestamp: new Date().toLocaleTimeString(),
      items: mintedList,
    });

    logAudit(
      'sovereign_batch_minting_executed',
      activeCountry,
      `PS MoLG executed sovereign batch commissioning: Minted ${targetDistricts.length} CAOs and ${targetMinistries.length} Sister PS credentials.`
    );

    toast(
      `Sovereign Batch Commissioning executed: ${mintedList.length} statutory credentials minted & live on gateway.`,
      'emerald'
    );
  };

  const handleCopyCabinetGazette = () => {
    if (!mintedResults) return;

    const memoText = `REPUBLIC OF ${countryObj.name.toUpperCase()}
OFFICE OF THE PERMANENT SECRETARY
MINISTRY OF LOCAL GOVERNMENT / NATIONAL SUPERADMIN GATEWAY
OFFICIAL STATUTORY CABINET TRANSMITTAL GAZETTE

Date of Statutory Issuance: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
Issuing Authority: Ben Kumumanya, Permanent Secretary (PS MoLG)
Statutory Jurisdiction: National Local Government Cascade (${activeCountry})
Reference: Cap. 243 / Public Finance Management Mandate 2026

SUBJECT: NOTIFICATION OF SOVEREIGN CIVIC DUTY ACCESS CODES & DELEGATED STATUTORY ROLES

1. MANDATE & AUTHORITY:
Pursuant to Article 174 of the Constitution and Section 64 of the Local Governments Act, the designated Accounting Officers and Sister Ministry Permanent Secretaries are hereby issued unique sovereign cryptographic gateway credentials to authenticate and manage their respective supervisory desks on the Civic Duty National Resolution Gateway.

2. REGISTER OF COMMISSIONED SOVEREIGN OFFICERS:
${mintedResults.items
  .map(
    (item, index) =>
      `[${index + 1}] ${item.type === 'CAO' ? 'SUB-SOVEREIGN CAO' : 'SISTER PERMANENT SECRETARY'}
Officer: ${item.name}
Designation: ${item.title}
Duty Station: ${item.station}
Statutory Gateway Token: ${item.code}
Legal Mandate Basis: ${item.legalBasis}
Authentication URL: https://civicduty.gov.${activeCountry.toLowerCase()}/gov-login`
  )
  .join('\n\n')}

3. STATUTORY INSTRUCTIONS:
(a) Accounting Officers (CAOs) must immediately log in and activate subordinate Senior Assistant Secretaries (Sub-County Chiefs) within their statutory boundaries.
(b) Sister Ministries must harmonize sectoral field assets to satisfy the 48-hour SLA for citizen public works and medical escalations.
(c) This gazette is officially entered into the national immutable audit registry.

BY ORDER OF:
Permanent Secretary, Ministry of Local Government (National Superadmin)`;

    navigator.clipboard.writeText(memoText);
    setCopiedMemo(true);
    toast('Master Cabinet Transmittal Gazette copied to clipboard.', 'emerald');
    setTimeout(() => setCopiedMemo(false), 3000);
  };

  const handleDownloadCsv = () => {
    if (!mintedResults) return;

    const headers = 'Type,ID,OfficerName,Designation,DutyStation,AccessCode,LegalBasis\n';
    const rows = mintedResults.items
      .map(
        i =>
          `"${i.type}","${i.id}","${i.name}","${i.title}","${i.station}","${i.code}","${i.legalBasis}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sovereign_Commissioning_Gazette_${activeCountry}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Master Gazette CSV downloaded successfully.', 'emerald');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Sovereign Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-emerald-100 dark:border-emerald-900/60">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-700 text-white rounded-2xl shadow-md shrink-0">
            <Shield size={26} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] mono font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                Sovereign Batch Authority · PS MoLG Superadmin
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] mono font-bold bg-[#f1f3f4] dark:bg-[#1e232d] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36]">
                {activeCountry} · {countryObj.name}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">
              Sovereign Batch Commissioning Gateway
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              As Permanent Secretary / National Superadmin, your constitutional prerogative is batch minting credentials for all Sub-Sovereign District Accounting Officers (CAOs) and Sister Line Ministry Permanent Secretaries.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-start sm:self-auto p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Constitutional Notice Box */}
      <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl text-xs space-y-1 text-emerald-950 dark:text-emerald-100 leading-relaxed font-semibold">
        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-black text-sm">
          <Key size={16} className="text-emerald-700 dark:text-emerald-400" />
          Statutory Separation of Administrative Powers
        </div>
        <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 font-medium">
          Under Section 64 of the Local Governments Act and Article 174 of the Constitution, individual grassroots appointments (Sub-County Chiefs, Parish Chiefs, Village Staff) are statutorily reserved for their respective District Accounting Officers. The Superadmin executes horizontal cabinet sync and vertical district delegation.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveCategory('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeCategory === 'both'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Sovereign Nodes ({districtNodes.length + sisterMinistries.length})
          </button>
          <button
            onClick={() => setActiveCategory('caos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeCategory === 'caos'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            District CAOs Only ({districtNodes.length})
          </button>
          <button
            onClick={() => setActiveCategory('sister_ps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeCategory === 'sister_ps'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sister Permanent Secretaries ({sisterMinistries.length})
          </button>
        </div>

        {/* Execute Batch Action CTA */}
        <button
          onClick={handleExecuteBatchCommissioning}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs uppercase tracking-wider font-black transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Key size={16} />
          <span>Mint Selected Sovereign Desks</span>
        </button>
      </div>

      {/* SELECTION GRID */}
      <div className="space-y-4">
        {/* CAOs Section */}
        {(activeCategory === 'both' || activeCategory === 'caos') && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-emerald-700 dark:text-emerald-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Sub-Sovereign Accounting Officers (CAOs &amp; City Clerks) — {selectedDistrictIds.length}/{districtNodes.length} Selected
                </h4>
              </div>

              <button
                onClick={toggleAllDistricts}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                {selectedDistrictIds.length === districtNodes.length ? 'Deselect All' : 'Select All CAOs'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
              {filteredDistricts.map((d) => {
                const isSelected = selectedDistrictIds.includes(d.id);
                return (
                  <div
                    key={d.id}
                    onClick={() => {
                      setSelectedDistrictIds((prev) =>
                        isSelected ? prev.filter((id) => id !== d.id) : [...prev, d.id]
                      );
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                      {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {d.name}
                        </span>
                        <span className="text-[9px] mono text-slate-400 shrink-0">{d.region}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 truncate">
                        {d.cao}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {d.id} · {d.activeNodes}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sister Ministries Section */}
        {(activeCategory === 'both' || activeCategory === 'sister_ps') && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-teal-700 dark:text-teal-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Sister Line Ministry Permanent Secretaries (Cabinet Delivery Council) — {selectedMinistryIds.length}/{sisterMinistries.length} Selected
                </h4>
              </div>

              <button
                onClick={toggleAllMinistries}
                className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                {selectedMinistryIds.length === sisterMinistries.length ? 'Deselect All' : 'Select All Sister PSs'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
              {sisterMinistries.map((m) => {
                const isSelected = selectedMinistryIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMinistryIds((prev) =>
                        isSelected ? prev.filter((id) => id !== m.id) : [...prev, m.id]
                      );
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-teal-50/80 dark:bg-teal-950/40 border-teal-400 dark:border-teal-700'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 text-teal-700 dark:text-teal-400">
                      {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {m.title.replace('PS Ministry of ', '').replace('PS State Dept for ', '')}
                        </span>
                        <span className="text-[9px] mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold shrink-0">
                          {m.sector}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 truncate">
                        {m.permSecretary}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {m.code} · SLA: {m.slaScore}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MINTED RESULTS / MASTER CABINET DISPATCH NOTICE */}
      {mintedResults && (
        <div className="mt-4 bg-emerald-50/90 dark:bg-slate-850 border-2 border-emerald-500 rounded-3xl p-5 space-y-4 shadow-lg animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 dark:border-emerald-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-200">
                    Master Cabinet &amp; Sovereign Transmittal Gazette Ready
                  </h4>
                  <span className="text-[9.5px] mono font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                    {mintedResults.items.length} Desks Minted
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Statutory tokens are live on the government gateway. Distribute this gazette to the Cabinet Secretariat and CAOs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyCabinetGazette}
                className="py-2 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Copy size={14} />
                <span>{copiedMemo ? 'Copied Gazette!' : 'Copy Full Transmittal Memo'}</span>
              </button>

              <button
                onClick={handleDownloadCsv}
                className="py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Download size={14} />
                <span>Download Register (CSV)</span>
              </button>

              <button
                onClick={() => setMintedResults(null)}
                className="py-2 px-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
                title="Mark dispatched and keep workspace clean"
              >
                Mark Dispatched &amp; Clear
              </button>
            </div>
          </div>

          {/* Table of Commissioned Officers */}
          <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                <tr>
                  <th className="p-3">Rank / Node</th>
                  <th className="p-3">Officer Name</th>
                  <th className="p-3">Designated Title</th>
                  <th className="p-3">Gateway Access Code</th>
                  <th className="p-3 text-right">Quick Mount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mintedResults.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                        item.type === 'CAO' ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' : 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 truncate max-w-xs">
                      {item.title} ({item.station})
                    </td>
                    <td className="p-3 font-mono font-black text-emerald-700 dark:text-emerald-400">
                      {item.code}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          const success = directLoginWithGovCode(item.code);
                          if (success) {
                            toast(`Mounted desk for ${item.name} (${item.code})`, 'emerald');
                          }
                        }}
                        className="py-1 px-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] transition-all"
                      >
                        Mount Desk
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
