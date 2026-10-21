import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RoleType, TeamMember, Invite } from '../types';
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
  const { user, toast, mintGovAccessCode, addInvite, logAudit } = useApp();

  const [activeTab, setActiveTab] = useState<'directorates' | 'regional' | 'whistleblower' | 'freeze'>('directorates');
  const [selectedBureauId, setSelectedBureauId] = useState<string>('bur-kampala');
  const [searchQuery, setSearchQuery] = useState('');

  // Executive Chambers Roster
  const executiveChambers = useMemo(
    () => [
      {
        id: 'igg-apex',
        title: 'Inspector General of Government (IGG)',
        name: 'Hon. Beti Kamya Turwomwe',
        mandate: 'Constitutional Head of the Inspectorate of Government (Chapter 13 Ombudsman). Supreme investigatory and prosecutorial power.',
        email: 'igg@igg.go.ug',
        phone: '+256 414 344 219',
        division: 'Executive Chambers',
      },
      {
        id: 'digg-anti-corruption',
        title: 'Deputy Inspector General of Government (Anti-Corruption)',
        name: 'Anne Twinomugisha Muhairwe',
        mandate: 'Supervises Directorate of Anti-Corruption, Special Investigations, and Asset Recovery Unit.',
        email: 'digg.corruption@igg.go.ug',
        phone: '+256 414 344 220',
        division: 'Special Investigations Wing',
      },
      {
        id: 'digg-ombudsman',
        title: 'Deputy Inspector General of Government (Ombudsman Affairs)',
        name: 'Dr. Patricia Achan Okiria',
        mandate: 'Supervises Directorate of Ombudsman Affairs, Citizen Grievance Redress, and Administrative Justice.',
        email: 'digg.ombudsman@igg.go.ug',
        phone: '+256 414 344 221',
        division: 'Ombudsman & Grievance Wing',
      },
      {
        id: 'sec-inspectorate',
        title: 'Secretary to the Inspectorate of Government',
        name: 'Mrs. Rose Kafeero',
        mandate: 'Accounting Officer of the Inspectorate, responsible for national bureau logistics, warrants, and personnel.',
        email: 'secretary@igg.go.ug',
        phone: '+256 414 344 225',
        division: 'Administration & Finance Directorate',
      },
    ],
    []
  );

  // 3 Core Constitutional Directorates
  const directorates = useMemo(
    () => [
      {
        id: 'dir-ombudsman',
        name: 'Directorate of Ombudsman Affairs',
        lead: 'Director of Ombudsman Inquiries',
        focus: 'Administrative injustice, unfair dismissal, delayed pensions, abuse of office, and public service standing orders compliance.',
        activeInquiries: 247,
        resolvedThisMonth: 68,
        powers: [
          'Hear citizen petitions against public bodies',
          'Summon accounting officers for mediation',
          'Enforce remedy recommendations under Article 225',
        ],
      },
      {
        id: 'dir-corruption',
        name: 'Directorate of Anti-Corruption & Special Investigations',
        lead: 'Director of Forensic Audits & Special Investigations',
        focus: 'Public procurement fraud, ghost payrolls, capex embezzlement, syndicate kickbacks, and asset tracking & forfeiture.',
        activeInquiries: 184,
        resolvedThisMonth: 32,
        powers: [
          'Execute search warrants and seize financial records',
          'Order lifestyle audits on suspected public officers',
          'Refer for direct trial at the Anti-Corruption Court',
        ],
      },
      {
        id: 'dir-leadership',
        name: 'Directorate of Leadership Code Compliance',
        lead: 'Director of Leadership Code',
        focus: 'Annual declaration of income, assets and liabilities by all public leaders, conflict of interest, and illicit enrichment prosecution.',
        activeInquiries: 512,
        resolvedThisMonth: 114,
        powers: [
          'Verify bi-annual leader wealth declarations',
          'Investigate undeclared offshore or domestic properties',
          'Recommend dismissal of non-compliant public officers',
        ],
      },
    ],
    []
  );

  // 16 Regional Ombudsman Bureaus Across Uganda
  const regionalBureaus = useMemo(
    () => [
      {
        id: 'bur-kampala',
        name: 'Kampala Metropolitan Regional Bureau',
        location: 'Jubilee Insurance Centre, Parliament Avenue, Kampala',
        officer: 'Mr. David Makumbi (Senior Regional Inspector)',
        phone: '+256 414 259 788',
        districtsCovered: 'Kampala, Wakiso, Mukono, Mpigi',
        activeCases: 89,
        status: 'high_priority',
      },
      {
        id: 'bur-gulu',
        name: 'Gulu Regional Ombudsman Bureau',
        location: 'Plot 17, Airfield Road, Gulu City',
        officer: 'Ms. Grace Atim (Senior Regional Inspector)',
        phone: '+256 471 432 021',
        districtsCovered: 'Gulu, Kitgum, Pader, Omoro, Nwoya, Amuru',
        activeCases: 42,
        status: 'active',
      },
      {
        id: 'bur-arua',
        name: 'Arua Regional Ombudsman Bureau',
        location: 'Plot 3, Weatherhead Park Lane, Arua City',
        officer: 'Mr. Ronald Anguyo (Senior Regional Inspector)',
        phone: '+256 476 420 119',
        districtsCovered: 'Arua, Nebbi, Zombo, Maracha, Koboko, Yumbe, Moyo',
        activeCases: 38,
        status: 'active',
      },
      {
        id: 'bur-jinja',
        name: 'Jinja Regional Ombudsman Bureau',
        location: 'Plot 35, Bell Avenue West, Jinja City',
        officer: 'Mr. Isaac Baliddawa (Senior Regional Inspector)',
        phone: '+256 434 122 890',
        districtsCovered: 'Jinja, Iganga, Kamuli, Mayuge, Bugiri',
        activeCases: 35,
        status: 'active',
      },
      {
        id: 'bur-mbarara',
        name: 'Mbarara Regional Ombudsman Bureau',
        location: 'Plot 1, High Street, Mbarara City',
        officer: 'Mr. Hillary Katusiime (Senior Regional Inspector)',
        phone: '+256 485 421 002',
        districtsCovered: 'Mbarara, Ntungamo, Bushenyi, Sheema, Isingiro, Kiruhura',
        activeCases: 47,
        status: 'active',
      },
      {
        id: 'bur-mbale',
        name: 'Mbale Regional Ombudsman Bureau',
        location: 'Plot 19, Masaba Avenue, Mbale City',
        officer: 'Mr. Timothy Wanjusi (Senior Regional Inspector)',
        phone: '+256 454 433 210',
        districtsCovered: 'Mbale, Tororo, Sironko, Manafwa, Bududa, Kapchorwa',
        activeCases: 31,
        status: 'active',
      },
      {
        id: 'bur-fortportal',
        name: 'Fort Portal Regional Ombudsman Bureau',
        location: 'Plot 8, Ruhandika Street, Fort Portal City',
        officer: 'Ms. Brenda Kemigisa (Senior Regional Inspector)',
        phone: '+256 483 422 150',
        districtsCovered: 'Kabarole, Kasese, Bundibugyo, Kyenjojo, Bunyangabu',
        activeCases: 29,
        status: 'active',
      },
      {
        id: 'bur-soroti',
        name: 'Soroti Regional Ombudsman Bureau',
        location: 'Plot 14, Gweri Road, Soroti City',
        officer: 'Mr. Peter Echegu (Senior Regional Inspector)',
        phone: '+256 454 461 405',
        districtsCovered: 'Soroti, Kumi, Katakwi, Serere, Kaberamaido, Ngora',
        activeCases: 26,
        status: 'active',
      },
    ],
    []
  );

  const selectedBureau = regionalBureaus.find((b) => b.id === selectedBureauId) || regionalBureaus[0];

  const handleIssueOmbudsmanCode = (targetName: string, roleTitle: string, bureauName: string) => {
    const code = `UG-IGG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvite: Invite = {
      code,
      name: targetName,
      title: `${roleTitle} (${bureauName})`,
      role: 'node_admin',
      scope: bureauName,
      dept: 'igg',
      is_utility: false,
      used: false,
      country: user?.country || 'UG',
      duty_station: bureauName,
    };
    addInvite(newInvite);

    mintGovAccessCode(code, {
      country: user?.country || 'UG',
      dept: 'igg',
      scope: bureauName,
      role: 'node_admin',
      is_utility: false,
      role_label: `Ombudsman Investigator (${bureauName})`,
      real_title_short: roleTitle,
      officer_name: targetName,
      hierarchy_level: 'tier4_agency',
    });

    toast(`Ombudsman warrant & access code ${code} issued for ${targetName}`, 'emerald');
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
                Chapter 13 Ombudsman of the Republic of Uganda
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="text-emerald-400 shrink-0" size={22} />
              <span>Inspectorate of Government (IGG) — National Ombudsman Chambers</span>
            </h2>
            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-3xl">
              Under Articles 223–232 of the Constitution and the Inspectorate of Government Act, the IGG possesses independent jurisdiction to eliminate corruption, redress administrative injustice, and enforce the Leadership Code of Conduct across all Ministries, Departments, Agencies, and Local Governments.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-600/40 text-right">
              <div className="text-[10px] font-mono text-emerald-300 uppercase">Ombudsman Authority</div>
              <div className="text-base font-black text-white font-mono">SUPREME AUDIT</div>
              <div className="text-[9.5px] text-emerald-300/80">16 Regional Bureaus Active</div>
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
            <span>16 Regional Ombudsman Bureaus</span>
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

      {/* View: 16 Regional Bureaus */}
      {activeTab === 'regional' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <span>
              <strong>Decentralized Ombudsman Network:</strong> 16 Regional Inspectorates ensure citizens in all 146 districts can access the IGG without travelling to Kampala.
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
                      Districts: {bur.districtsCovered}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500">Chapter 13 Warrant</span>
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
              Whistleblowers Protection Act 2010
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Whistleblower disclosures filed via CivicDuty are automatically stripped of IP addresses, device identifiers, and geo-metadata before reaching this docket. Submissions are hashed with SHA-256 for evidentiary preservation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
            <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">WB-2026-0812 · High Confidence</span>
                <span className="text-slate-500">2h ago</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Ghost Teachers on Local Government Payroll (Tororo District)
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Evidence: Bank disbursement vouchers matching 14 deceased teachers still drawing monthly UPE salaries.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">WB-2026-0809 · Urgent Capex</span>
                <span className="text-slate-500">Yesterday</span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Culvert Substitution on Feeder Road Contract (Mbale Municipal)
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Evidence: Unreinforced corrugated pipe installed instead of approved 900mm reinforced concrete box culverts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View: Statutory Notice & Freeze Orders */}
      {activeTab === 'freeze' && (
        <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase font-mono tracking-wider">
              <AlertOctagon size={15} />
              <span>Section 12 Statutory Notice to Produce &amp; Project Interdiction</span>
            </div>
            <span className="text-[10px] font-mono text-rose-700 dark:text-rose-300 font-bold">
              Binding Article 230 Constitutional Powers
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            The IGG may issue a binding directive to any Accounting Officer, Bank, or Municipal Council to freeze disbursement on a flagged contract or interdict an officer under active criminal inquiry.
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
