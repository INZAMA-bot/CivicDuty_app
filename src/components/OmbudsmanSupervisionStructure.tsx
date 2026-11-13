import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RoleType, TeamMember, Invite } from '../types';
import { getCountryGovernanceSchema } from '../data/countryGovernance';
import {
  Shield,
  Scale,
  Building2,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Key,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Send,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Clock,
  Phone,
  Mail,
  FileCheck2,
  AlertOctagon,
  Award,
} from 'lucide-react';

interface OmbudsmanSupervisionStructureProps {
  onPrefillManualForm?: (data: {
    name: string;
    title: string;
    role: RoleType;
    scope: string;
    isUtility: boolean;
    dept: string;
  }) => void;
}

export const OmbudsmanSupervisionStructure: React.FC<OmbudsmanSupervisionStructureProps> = ({
  onPrefillManualForm,
}) => {
  const { user, toast, mintGovAccessCode, addInvite } = useApp();
  const activeCountry = (user?.country || 'UG').toUpperCase();
  const gov = useMemo(() => getCountryGovernanceSchema(activeCountry), [activeCountry]);

  const [activeTab, setActiveTab] = useState<'directorates' | 'regional' | 'whistleblower' | 'freeze'>('directorates');
  const [selectedBureauId, setSelectedBureauId] = useState<string>('');

  const executiveChambers = useMemo(() => gov.ombudsman.executives, [gov]);

  // 3 Core Constitutional Directorates tailored to the country's Ombudsman
  const directorates = useMemo(
    () => [
      {
        id: 'dir-ombudsman',
        name: 'Directorate of Ombudsman Affairs & Administrative Justice',
        lead: 'Director of Ombudsman Inquiries',
        focus: `Administrative injustice, service delivery delays, abuse of office, and statutory compliance across ${gov.countryName}.`,
        activeInquiries: activeCountry === 'UG' ? 247 : 128,
        resolvedThisMonth: activeCountry === 'UG' ? 68 : 49,
        powers: [
          'Hear citizen petitions against public bodies',
          `Summon ${gov.tier3Short}s & accounting officers for mediation`,
          `Enforce remedy orders under ${gov.ombudsman.shortName} mandate`,
        ],
      },
      {
        id: 'dir-corruption',
        name: 'Directorate of Anti-Corruption & Special Investigations',
        lead: 'Director of Forensic Audits & Special Investigations',
        focus: `Public procurement fraud, payroll anomalies, capex embezzlement, and public asset recovery (${gov.fiscalAct}).`,
        activeInquiries: activeCountry === 'UG' ? 184 : 96,
        resolvedThisMonth: activeCountry === 'UG' ? 32 : 24,
        powers: [
          'Execute audit warrants and inspect procurement records',
          'Order forensic audits on stalled capex disbursements',
          'Refer substantiated dockets to anti-corruption prosecution',
        ],
      },
      {
        id: 'dir-leadership',
        name: 'Directorate of Ethics, Wealth Declaration & Integrity Code',
        lead: 'Director of Leadership Code Compliance',
        focus: `Periodic declaration of income, assets and liabilities by public leaders and whistleblower protection (${gov.ombudsman.whistleblowingAct}).`,
        activeInquiries: activeCountry === 'UG' ? 512 : 210,
        resolvedThisMonth: activeCountry === 'UG' ? 114 : 64,
        powers: [
          'Verify mandatory public leader integrity declarations',
          'Audit conflict-of-interest disclosures in tenders',
          'Recommend statutory sanctions for non-compliant officials',
        ],
      },
    ],
    [gov, activeCountry]
  );

  const regionalBureaus = useMemo(
    () =>
      gov.ombudsman.bureaus.map((b) => ({
        ...b,
        districtsCovered: b.coverage,
      })),
    [gov]
  );

  const selectedBureau = regionalBureaus.find((b) => b.id === selectedBureauId) || regionalBureaus[0];

  const handleIssueOmbudsmanCode = (targetName: string, roleTitle: string, bureauName: string) => {
    const ombudsPrefix = gov.ombudsman.shortName.replace(/[^A-Z0-9]/gi, '').slice(0, 4).toUpperCase() || 'OMB';
    const code = `${gov.codePrefix}-${ombudsPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvite: Invite = {
      code,
      name: targetName,
      title: `${roleTitle} (${bureauName})`,
      role: 'node_admin',
      scope: bureauName,
      dept: ombudsPrefix.toLowerCase(),
      is_utility: false,
      used: false,
      country: activeCountry,
      duty_station: bureauName,
    };
    addInvite(newInvite);

    mintGovAccessCode(code, {
      country: activeCountry,
      dept: ombudsPrefix.toLowerCase(),
      scope: bureauName,
      role: 'node_admin',
      is_utility: false,
      role_label: `${gov.ombudsman.shortName} Investigator (${bureauName})`,
      real_title_short: roleTitle,
      officer_name: targetName,
      hierarchy_level: 'tier4_agency',
    });

    toast(`${gov.ombudsman.shortName} warrant & access code ${code} issued for ${targetName}`, 'emerald');
  };

  return (
    <div className="space-y-6">
      {/* Supreme Constitutional Mandate Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 shadow-lg text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                <Scale size={11} className="text-emerald-400" /> Tier 4 · Constitutional Oversight
              </span>
              <span className="text-[10px] font-mono text-emerald-300/80">
                {gov.ombudsman.constitutionalBasis}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="text-emerald-400 shrink-0" size={22} />
              <span>{gov.ombudsman.name} — Ombudsman Chambers ({gov.countryName})</span>
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-3xl">
              {gov.ombudsman.mandateSummary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-600/40 text-right">
              <div className="text-[10px] font-mono text-emerald-300 uppercase">Ombudsman Authority</div>
              <div className="text-base font-black text-white font-mono">SUPREME AUDIT</div>
              <div className="text-[9.5px] text-emerald-300/80">{gov.ombudsman.regionalHubCountLabel}</div>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-800/40 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('directorates')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'directorates'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-emerald-200 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/40'
            }`}
          >
            <Building2 size={13} />
            <span>Constitutional Directorates</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('regional')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'regional'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-emerald-200 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/40'
            }`}
          >
            <MapPin size={13} />
            <span>Regional Bureaus ({regionalBureaus.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('whistleblower')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'whistleblower'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-emerald-200 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/40'
            }`}
          >
            <Lock size={13} />
            <span>Shielded Whistleblower Vault</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('freeze')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'freeze'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'text-emerald-200 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/40'
            }`}
          >
            <AlertOctagon size={13} />
            <span>Statutory Notice &amp; Freeze Orders</span>
          </button>
        </div>
      </div>

      {/* View: Directorates */}
      {activeTab === 'directorates' && (
        <div className="space-y-4">
          {/* Executive Chambers Strip */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161a22] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500">
                Executive Chambers of the Inspectorate
              </span>
              <span className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                Statutory Appointments
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {executiveChambers.map((exec) => (
                <div
                  key={exec.id}
                  className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 space-y-1.5"
                >
                  <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    {exec.division}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{exec.name}</h4>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{exec.title}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{exec.mandate}</p>
                  <div className="pt-1 flex items-center gap-3 text-[10px] font-mono text-slate-500">
                    <span>{exec.email}</span>
                    <span>·</span>
                    <span>{exec.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Three Core Directorates Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {directorates.map((dir) => (
              <div
                key={dir.id}
                className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/10 dark:bg-emerald-950/20 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10.5px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                      Operational Directorate
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                      {dir.activeInquiries} Cases Active
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {dir.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dir.focus}
                  </p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                      Constitutional Powers:
                    </span>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      {dir.powers.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Lead: {dir.lead}</span>
                  <span className="text-emerald-600 font-bold">{dir.resolvedThisMonth} resolved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Regional Bureaus */}
      {activeTab === 'regional' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <span>
              <strong>Decentralized Ombudsman Network:</strong> {gov.ombudsman.regionalNetworkLabel}
            </span>
            <span className="font-mono text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
              {regionalBureaus.length} Regional Hubs Loaded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {regionalBureaus.map((bur) => (
              <div
                key={bur.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161a22] space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{bur.name}</span>
                    <span className="text-[9.5px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {bur.activeCases} Inquiries
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{bur.officer}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <MapPin size={10} /> {bur.location}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Phone size={10} /> {bur.phone}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                      Coverage: {bur.districtsCovered}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{gov.ombudsman.shortName} Warrant</span>
                  <button
                    type="button"
                    onClick={() => handleIssueOmbudsmanCode(bur.officer.split('(')[0].trim(), 'Regional Inspector', bur.name)}
                    className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Key size={10} />
                    <span>Issue Warrant</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Shielded Whistleblower Vault */}
      {activeTab === 'whistleblower' && (
        <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase font-mono tracking-wider">
              <Lock size={15} />
              <span>Cryptographically Shielded Whistleblower Protection Pipeline</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
              {gov.ombudsman.whistleblowingAct}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Whistleblower disclosures filed via CivicDuty in {gov.countryName} are automatically stripped of IP addresses, device identifiers, and geo-metadata before reaching {gov.ombudsman.shortName}. Submissions are hashed with SHA-256 for evidentiary preservation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
            {gov.ombudsman.whistleblowerSamples.map((wb) => (
              <div key={wb.ref} className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{wb.ref} · {wb.tag}</span>
                  <span className="text-slate-500">{wb.time}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {wb.title}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Evidence: {wb.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Statutory Notice & Freeze Orders */}
      {activeTab === 'freeze' && (
        <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase font-mono tracking-wider">
              <AlertOctagon size={15} />
              <span>Statutory Notice to Produce &amp; Project Interdiction</span>
            </div>
            <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300 font-bold">
              {gov.ombudsman.constitutionalBasis}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {gov.ombudsman.name} may issue a binding directive to any {gov.countryName} Accounting Officer, Bank, or {gov.tier3UnitLabel} to freeze disbursement on a flagged contract or interdict an officer under active inquiry.
          </p>

          <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Issue Form 4 Statutory Notice to Produce Documents
              </div>
              <div className="text-[11px] text-slate-500">
                Compels delivery of bank statements, procurement committee minutes, or contractor invoices within 48 hours.
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast('Statutory Notice Generator invoked for active docket', 'emerald')}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-rose-700 hover:bg-rose-800 text-white shrink-0 cursor-pointer"
            >
              Issue Notice Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
