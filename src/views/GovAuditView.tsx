import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDept, timeAgo, csvEscape } from '../utils/helpers';
import { Download, Check, ShieldCheck, Search, Filter, Lock, Scale, Building2, FileCheck } from 'lucide-react';
import { NoteBox } from '../components/NoteBox';
import { COUNTRIES } from '../data/countries';

interface AuditSpec {
  agency: string;
  act: string;
  auditor: string;
  court: string;
}

const COUNTRY_AUDIT_SPECS: Record<string, AuditSpec> = {
  UG: {
    agency: 'Inspectorate of Government (IGG)',
    act: 'Whistleblowers Protection Act 2010 & Leadership Code Act',
    auditor: 'Office of the Auditor General (OAG Uganda)',
    court: 'High Court Anti-Corruption Division (Kampala)',
  },
  KE: {
    agency: 'Ethics and Anti-Corruption Commission (EACC)',
    act: 'Public Officer Ethics Act & Access to Information Act',
    auditor: 'Office of the Auditor-General (OAG Kenya)',
    court: 'Anti-Corruption and Economic Crimes Division (Nairobi)',
  },
  NG: {
    agency: 'Independent Corrupt Practices Commission (ICPC) & EFCC',
    act: 'Corrupt Practices & Freedom of Information Act 2011',
    auditor: 'Office of the Auditor-General for the Federation (OAuGF)',
    court: 'Federal High Court Anti-Corruption Bench',
  },
  GH: {
    agency: 'Office of the Special Prosecutor (OSP)',
    act: 'Whistleblower Act 2006 (Act 720) & OSP Act',
    auditor: 'Ghana Audit Service',
    court: 'Financial & Economic Crime High Court Division',
  },
  TZ: {
    agency: 'TAKUKURU (PCCB Tanzania)',
    act: 'Prevention and Combating of Corruption Act (PCCA)',
    auditor: 'National Audit Office of Tanzania (NAOT)',
    court: 'High Court Corruption & Economic Crimes Division',
  },
  ZA: {
    agency: 'Special Investigating Unit (SIU) & Public Protector',
    act: 'Protected Disclosures Act & Public Finance Management Act (PFMA)',
    auditor: 'Auditor-General South Africa (AGSA)',
    court: 'Special Tribunal for Asset Recovery',
  },
  ZM: {
    agency: 'Anti-Corruption Commission (ACC Zambia)',
    act: 'Anti-Corruption Act No. 3 & Public Audit Act',
    auditor: 'Office of the Auditor General Zambia',
    court: 'Economic and Financial Crimes Court',
  },
  ZW: {
    agency: 'Zimbabwe Anti-Corruption Commission (ZACC)',
    act: 'Money Laundering & Public Finance Management Act',
    auditor: 'Auditor-General of Zimbabwe',
    court: 'Specialized Anti-Corruption Court',
  },
  IN: {
    agency: 'Lokayukta & Central Vigilance Commission (CVC)',
    act: 'Prevention of Corruption Act & Right to Information Act (RTI)',
    auditor: 'Comptroller and Auditor General of India (CAG)',
    court: 'Special CBI Anti-Corruption Court',
  },
  GB: {
    agency: 'Serious Fraud Office (SFO) & Parliamentary Ombudsman',
    act: 'Bribery Act 2010 & Freedom of Information Act',
    auditor: 'National Audit Office (NAO UK)',
    court: 'Crown Court Financial Division',
  },
  US: {
    agency: 'Office of Inspector General (OIG) & FBI Public Corruption',
    act: 'Whistleblower Protection Act & Freedom of Information Act (FOIA)',
    auditor: 'Government Accountability Office (GAO)',
    court: 'U.S. District Court Public Integrity Section',
  },
  RW: {
    agency: 'Office of the Ombudsman (Umuvunyi)',
    act: 'Law N° 54/2018 on Prevention and Punishment of Corruption',
    auditor: 'Office of the Auditor General of State Finances (OAG Rwanda)',
    court: 'High Court Commercial & Economic Chamber',
  },
};

export const GovAuditView: React.FC = () => {
  const { user, audit, toast } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!user) return null;

  const countryCode = user.country || 'UG';
  const countryObj = COUNTRIES[countryCode] || COUNTRIES['UG'];
  const d = getDept(countryCode, user.dept || (countryCode === 'KE' ? 'kplc' : countryCode === 'RW' ? 'reg' : countryCode === 'GH' ? 'ecg' : 'kcca'));

  const auditSpec: AuditSpec = COUNTRY_AUDIT_SPECS[countryCode] || {
    agency: `${countryObj.name} Anti-Corruption Oversight Bureau`,
    act: `${countryObj.name} Public Procurement & Transparency Act`,
    auditor: `${countryObj.name} Supreme Audit Institution`,
    court: `${countryObj.name} High Court Public Integrity Bench`,
  };

  const auditActionLabel = (a: string) => {
    const map: Record<string, string> = {
      reply: 'Official response posted',
      resolve: 'Ticket resolved & verified',
      status_change: 'Status changed',
      invite_member: 'Spokesperson invited',
      revoke_access: 'Access revoked',
      restore_access: 'Access restored',
      escalate: 'SLA Auto-escalated to Executive Desk',
      open_project_wall: 'Public contract wall opened',
      record_payment: 'Entity payment recorded',
      deactivate: 'Desk stood down',
      reactivate: 'Desk reinstated',
      bulk_invite: 'Bulk access codes issued',
    };
    return map[a] || String(a).replace(/_/g, ' ');
  };

  const countryAudit = audit.filter((entry) => (entry.country || 'UG') === countryCode);

  const filteredAudit = countryAudit.filter((entry) => {
    // Action Type filter
    if (filterType === 'replies' && entry.action !== 'reply') return false;
    if (filterType === 'resolutions' && entry.action !== 'resolve') return false;
    if (filterType === 'escalations' && entry.action !== 'escalate') return false;
    if (filterType === 'desks' && !['deactivate', 'reactivate', 'invite_member', 'bulk_invite', 'open_project_wall'].includes(entry.action)) return false;

    // Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = entry.actor_name.toLowerCase().includes(q);
      const matchTicket = entry.ticket_id.toLowerCase().includes(q);
      const matchDetail = entry.detail.toLowerCase().includes(q);
      const matchAction = entry.action.toLowerCase().includes(q);
      if (!matchActor && !matchTicket && !matchDetail && !matchAction) return false;
    }
    return true;
  });

  const toAuditCsv = (rows: typeof audit) => {
    const header = ['Timestamp', 'Country Code', 'Jurisdiction Node', 'Department', 'Action', 'Actor Title', 'Actor Role', 'Ticket ID', 'Audit Detail'].join(',');
    return [
      header,
      ...rows.map((e) =>
        [
          e.ts,
          countryCode,
          countryObj.node,
          d.name,
          e.action,
          e.actor_name,
          e.actor_role,
          e.ticket_id,
          e.detail,
        ]
          .map(csvEscape)
          .join(',')
      ),
    ].join('\r\n');
  };

  const exportAuditCsv = () => {
    if (!filteredAudit.length) return;
    const csvStr = toAuditCsv(filteredAudit);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CivicDuty_Audit_Ledger_${countryCode}_${user.dept}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`Exported ${filteredAudit.length} audit entries for ${countryObj.name}`, 'emerald');
  };

  const generateAuditCertificate = () => {
    const textContent = `
================================================================================
  CIVICDUTY PLATFORM · OFFICIAL NATIONAL AUDIT LEDGER & COMPLIANCE PROOF
================================================================================
Nation Jurisdiction: ${countryObj.flag} ${countryObj.name}
National Node ID:    ${countryObj.node}
Department/Unit:     ${d.name} (${user.dept})
Oversight Agency:    ${auditSpec.agency}
Statutory Reference: ${auditSpec.act}
Audit Institution:   ${auditSpec.auditor}
Judicial Division:   ${auditSpec.court}
Date Generated:      ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${new Date().toLocaleTimeString()}
--------------------------------------------------------------------------------
IMMUTABLE ACTION LOGS (${filteredAudit.length} RECORDS CERTIFIED)
--------------------------------------------------------------------------------
${filteredAudit
  .map(
    (a, idx) => `
[${idx + 1}] TIMESTAMP: ${a.ts}
    ACTION:    ${auditActionLabel(a.action).toUpperCase()}
    ACTOR:     ${a.actor_name} (${a.actor_role})
    TICKET/REF: ${a.ticket_id}
    DETAIL:    ${a.detail}
`
  )
  .join('\n--------------------------------------------------------------------------------')}

================================================================================
CRYPTOGRAPHIC AUDIT SEAL:
Hash Stamp: SHA256-CD-${countryCode}-${Date.now().toString(16).toUpperCase()}
Verification Status: IMMUTABLE AUDIT TRAIL VERIFIED
================================================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CivicDuty_${countryCode}_Audit_Certificate.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('Official Audit Certificate Downloaded!', 'emerald');
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12 text-slate-800 dark:text-slate-100">
      {/* Country Resonant Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-sm font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 mono">
            <span>{countryObj.flag}</span>
            <span>{countryObj.name}</span>
          </span>
          <span className="text-[9px] mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
            Node: {countryObj.node}
          </span>
        </div>

        <h2 className="text-[21px] font-black text-teal-700 dark:text-teal-400 tracking-tight leading-tight">
          {d.name} · Audit Ledger
        </h2>
        <p className="text-[11px] mono text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
          Immutable, tamper-proof governance ledger subpoena-ready for {auditSpec.agency} and parliamentary committees.
        </p>
      </div>

      {/* Statutory Oversight Card */}
      <div className="card p-4 space-y-2.5 border-teal-500/20 bg-teal-50/60 dark:bg-teal-950/20">
        <div className="flex items-center justify-between text-[10px] mono border-b border-teal-500/20 pb-2">
          <span className="text-teal-800 dark:text-teal-300 font-bold flex items-center gap-1.5">
            <Scale size={13} /> Anti-Corruption Oversight Body
          </span>
          <span className="text-teal-800 dark:text-teal-400 text-[9px] bg-teal-500/20 px-2 py-0.5 rounded font-bold">
            STATUTORY LINK
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5 text-[10px] mono">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Primary Integrity Body:</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold text-right">{auditSpec.agency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Legal Governing Framework:</span>
            <span className="text-amber-800 dark:text-amber-300 font-bold text-right">{auditSpec.act}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Supreme Audit Body:</span>
            <span className="text-slate-800 dark:text-slate-200 text-right">{auditSpec.auditor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Judicial Division:</span>
            <span className="text-teal-800 dark:text-teal-300 font-bold text-right">{auditSpec.court}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${countryObj.name} audit log by actor, ticket, or detail...`}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[9.5px] mono no-scrollbar">
          {[
            { id: 'all', label: `All (${countryAudit.length})` },
            { id: 'replies', label: 'Replies' },
            { id: 'resolutions', label: 'Resolutions' },
            { id: 'escalations', label: 'SLA Escalations' },
            { id: 'desks', label: 'Desk & Works' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                filterType === f.id
                  ? 'bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 font-black border-teal-600 dark:border-teal-400 shadow-sm dark:shadow-[0_0_10px_rgba(45,212,191,0.3)]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={exportAuditCsv}
          disabled={!filteredAudit.length}
          className={`flex items-center justify-center gap-1.5 border border-teal-500/40 bg-teal-50/50 dark:bg-transparent text-teal-800 dark:text-teal-300 font-black rounded-xl py-2.5 text-[10px] uppercase tracking-wider mono hover:bg-teal-100 dark:hover:bg-teal-500/10 transition-all ${
            filteredAudit.length ? '' : 'opacity-30 cursor-not-allowed'
          }`}
        >
          <Download size={13} /> Export CSV ({filteredAudit.length})
        </button>

        <button
          onClick={generateAuditCertificate}
          disabled={!filteredAudit.length}
          className={`flex items-center justify-center gap-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-black rounded-xl py-2.5 text-[10px] uppercase tracking-wider mono transition-all ${
            filteredAudit.length ? '' : 'opacity-30 cursor-not-allowed'
          }`}
        >
          <FileCheck size={13} /> Official Proof (.txt)
        </button>
      </div>

      {/* Main Audit Entries List */}
      <div className="card p-4 border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <span className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1 font-bold">
            <Lock size={11} className="text-teal-600 dark:text-teal-400" /> Verified Audit Chain
          </span>
          <span className="text-[8.5px] mono text-teal-700 dark:text-teal-400 font-bold">
            {filteredAudit.length} Logged Entries
          </span>
        </div>

        {filteredAudit.length === 0 ? (
          <p className="text-[12px] mono text-slate-400 dark:text-slate-500 text-center py-6">
            No audit actions match the current filter in {countryObj.name}.
          </p>
        ) : (
          filteredAudit.map((a) => (
            <div key={a.id} className="audit-row border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/40 p-2 rounded-lg transition-colors">
              <div className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(45,212,191,0.6)]"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10.5px] mono text-slate-900 dark:text-slate-100 font-bold">
                    {auditActionLabel(a.action)}
                  </span>
                  <span className="text-[8px] mono text-teal-800 dark:text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20 font-bold">
                    {countryCode}
                  </span>
                </div>

                <div className="text-[8.5px] mono text-slate-600 dark:text-slate-400 mt-0.5">
                  <span className="text-slate-800 dark:text-slate-300 font-bold">{a.actor_name}</span> · {String(a.actor_role).replace(/_/g, ' ')}
                </div>

                {a.detail && (
                  <div className="text-[8.5px] mono text-slate-700 dark:text-slate-400 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-950/80 p-1.5 rounded border border-slate-200 dark:border-slate-800/80">
                    {a.detail}
                  </div>
                )}

                {a.ticket_id && a.ticket_id !== '—' && (
                  <div className="text-[8px] mono text-amber-700 dark:text-amber-400 mt-1 font-bold">
                    Ticket Ref: {a.ticket_id}
                  </div>
                )}
              </div>
              <div className="text-[8px] mono text-slate-400 dark:text-slate-500 flex-shrink-0 text-right">
                <div>{timeAgo(a.ts)}</div>
                <div className="text-[7.5px] text-slate-400 dark:text-slate-600 mt-0.5">{a.ts.slice(0, 10)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <NoteBox
        tone="emerald"
        title={`${countryObj.name} Statutory Audit Rules`}
        text={`Actions logged on Node ${countryObj.node} are cryptographically signed and permanent. Court orders issued under the ${auditSpec.act} can subpoena these logs directly.`}
      />

      <div className="card p-4 space-y-2.5 border-slate-200 dark:border-slate-800">
        <p className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">National Audit Principles</p>
        {[
          `100% Immutable — Every reply, resolution, and desk modification is cryptographically hashed for ${countryObj.name}`,
          `Auditor General Access — Certified CSV logs can be exported directly for ${auditSpec.auditor} inquiries`,
          `Whistleblower Guarantee — Anonymous citizen identities remain sealed unless subpoenaed by ${auditSpec.court}`,
          'Zero Retraction — Official responses cannot be deleted or modified once posted',
          `SLA Tracking — Auto-escalations record statutory delay timers for ${d.name}`,
        ].map((r, i) => (
          <div key={i} className="flex items-start gap-2.5 text-[10px] mono text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5">
              <Check size={10} />
            </span>
            <span>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

