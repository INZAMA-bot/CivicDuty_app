import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RoleType, TeamMember, Invite } from '../types';
import {
  Building2,
  Users,
  Shield,
  Droplet,
  Zap,
  HardHat,
  Search,
  CheckCircle2,
  AlertTriangle,
  Copy,
  UserPlus,
  Send,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Key,
} from 'lucide-react';

interface AgencySupervisionStructureProps {
  deptId?: string;
  onPrefillManualForm?: (data: {
    name: string;
    title: string;
    role: RoleType;
    scope: string;
    isUtility: boolean;
    dept: string;
  }) => void;
}

export const AgencySupervisionStructure: React.FC<AgencySupervisionStructureProps> = ({
  deptId = 'nwsc',
  onPrefillManualForm,
}) => {
  const { user, teamMembers, invites, addInvite, toast, mintGovAccessCode } = useApp();

  const isNwsc = deptId.toLowerCase().includes('nwsc') || deptId.toLowerCase().includes('water');
  const isUnra = deptId.toLowerCase().includes('unra') || deptId.toLowerCase().includes('road');
  const isUra = deptId.toLowerCase().includes('ura') || deptId.toLowerCase().includes('revenue');

  const agencyName = isNwsc
    ? 'National Water and Sewerage Corporation (NWSC)'
    : isUnra
    ? 'Uganda National Roads Authority (UNRA)'
    : isUra
    ? 'Uganda Revenue Authority (URA)'
    : 'National Statutory Agency & Public Utility';

  const mandateText = isNwsc
    ? 'National Water & Sewerage Corporation Act (Cap 317) — Autonomous statutory corporation providing water and sewerage services on a commercial basis.'
    : isUnra
    ? 'Uganda National Roads Authority Act 2006 — Autonomous management, operation, and maintenance of the national roads network.'
    : isUra
    ? 'Uganda Revenue Authority Act (Cap 196) — Central agency responsible for tax assessment, collection, and customs enforcement.'
    : 'Statutory Body Operating Under Parliamentary Charter & Commercial Self-Sustenance Mandate.';

  const [activeTab, setActiveTab] = useState<'executive' | 'regional' | 'emergency'>('regional');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('kla-metro');
  const [searchQuery, setSearchQuery] = useState('');

  // Corporate Executive Directorate Template
  const executiveRoster = useMemo(() => {
    if (isNwsc) {
      return [
        {
          id: 'exec-md',
          title: 'Managing Director (MD)',
          name: 'Dr. Eng. Silver Mugisha',
          role: 'node_admin' as RoleType,
          division: 'Executive Directorate & Board Secretariat',
          email: 'silver.mugisha@nwsc.co.ug',
          phone: '+256 414 315 100',
          status: 'confirmed',
        },
        {
          id: 'exec-dmd-tech',
          title: 'Deputy Managing Director (Technical Operations)',
          name: 'Eng. Johnson Amayo',
          role: 'node_admin' as RoleType,
          division: 'Engineering & Capital Works Directorate',
          email: 'johnson.amayo@nwsc.co.ug',
          phone: '+256 414 315 102',
          status: 'confirmed',
        },
        {
          id: 'exec-dmd-comm',
          title: 'Deputy Managing Director (Finance & Commercial)',
          name: 'Dr. George Okurut',
          role: 'node_admin' as RoleType,
          division: 'Commercial & Customer Experience',
          email: 'george.okurut@nwsc.co.ug',
          phone: '+256 414 315 105',
          status: 'confirmed',
        },
        {
          id: 'exec-sec',
          title: 'Corporation Secretary & Chief Legal Counsel',
          name: 'Counsel Edith Katebalirwe',
          role: 'spokesperson' as RoleType,
          division: 'Legal Advisory & Corporate Governance',
          email: 'edith.k@nwsc.co.ug',
          phone: '+256 414 315 110',
          status: 'confirmed',
        },
        {
          id: 'exec-audit',
          title: 'Chief Internal Auditor & Integrity Inspector',
          name: 'Mr. Patrick Byabakama',
          role: 'read_only' as RoleType,
          division: 'Internal Audit & Whistleblower Risk Unit',
          email: 'p.byabakama@nwsc.co.ug',
          phone: '+256 414 315 115',
          status: 'confirmed',
        },
      ];
    }
    // Generic Agency Exec
    return [
      {
        id: 'exec-ed',
        title: 'Executive Director / Managing Director',
        name: 'Executive Director (Agency Head)',
        role: 'node_admin' as RoleType,
        division: 'Executive Chambers',
        email: 'director@agency.go.ug',
        phone: '+256 414 000 100',
        status: 'confirmed',
      },
      {
        id: 'exec-ops',
        title: 'Director of Field Operations & Infrastructure',
        name: 'Director of Operations',
        role: 'node_admin' as RoleType,
        division: 'National Infrastructure Directorate',
        email: 'operations@agency.go.ug',
        phone: '+256 414 000 102',
        status: 'confirmed',
      },
      {
        id: 'exec-legal',
        title: 'Director Legal & Corporate Affairs',
        name: 'Chief Legal Counsel',
        role: 'spokesperson' as RoleType,
        division: 'Corporate Governance',
        email: 'legal@agency.go.ug',
        phone: '+256 414 000 105',
        status: 'confirmed',
      },
    ];
  }, [isNwsc]);

  // Regional Operational Areas
  const regionalNetworks = useMemo(() => {
    return [
      {
        id: 'kla-metro',
        name: 'Kampala Water Metro Directorate',
        head: 'Eng. Mahmood Lutaaya (Director KW)',
        coverage: 'Kampala Central, Nakawa, Kawempe, Makindye, Rubaga, Entebbe, Mukono',
        branches: [
          {
            id: 'br-nakasero',
            name: 'Nakasero / CBD Branch',
            manager: 'Eng. Paul Kibirige',
            phone: '+256 772 100 201',
            leakCrewLeader: 'Joseph Katamba (Crew Lead)',
            treatmentPlant: 'Ggaba I, II & III Water Works',
            activeTickets: 5,
            slaScore: '96%',
          },
          {
            id: 'br-nakawa',
            name: 'Nakawa & Bugolobi Branch',
            manager: 'Eng. Sarah Nanteza',
            phone: '+256 772 100 202',
            leakCrewLeader: 'David Okot (Crew Lead)',
            treatmentPlant: 'Bugolobi Wastewater Treatment Plant',
            activeTickets: 8,
            slaScore: '92%',
          },
          {
            id: 'br-bwaise',
            name: 'Kawempe & Bwaise Branch',
            manager: 'Eng. Moses Mugabi',
            phone: '+256 772 100 203',
            leakCrewLeader: 'Sulaiman Walusimbi (Crew Lead)',
            treatmentPlant: 'Bwaise Booster Pumping Station',
            activeTickets: 12,
            slaScore: '88%',
          },
        ],
      },
      {
        id: 'central-reg',
        name: 'Central & Lake Victoria Region',
        head: 'Eng. Ronald Kisakye (Regional Manager)',
        coverage: 'Wakiso, Luwero, Mpigi, Mubende, Mityana',
        branches: [
          {
            id: 'br-entebbe',
            name: 'Entebbe International Area Office',
            manager: 'Eng. Dennis Ouma',
            phone: '+256 772 100 204',
            leakCrewLeader: 'Sam Byaruhanga (Crew Lead)',
            treatmentPlant: 'Nakiwogo Intake Facility',
            activeTickets: 3,
            slaScore: '97%',
          },
          {
            id: 'br-mukono',
            name: 'Mukono Industrial Corridor Area',
            manager: 'Eng. Harriet Namugga',
            phone: '+256 772 100 205',
            leakCrewLeader: 'Francis Mwebaze (Crew Lead)',
            treatmentPlant: 'Katosi Water Treatment Complex',
            activeTickets: 6,
            slaScore: '94%',
          },
        ],
      },
      {
        id: 'eastern-reg',
        name: 'Eastern Industrial & Nile Region',
        head: 'Eng. Agnes Akello (Regional Manager)',
        coverage: 'Jinja, Iganga, Mbale, Tororo, Busia, Soroti',
        branches: [
          {
            id: 'br-jinja',
            name: 'Jinja Nile Source Area',
            manager: 'Eng. Andrew Nabeta',
            phone: '+256 772 100 206',
            leakCrewLeader: 'Isaac Wafula (Crew Lead)',
            treatmentPlant: 'Masese Water Works',
            activeTickets: 4,
            slaScore: '95%',
          },
          {
            id: 'br-mbale',
            name: 'Mbale Mount Elgon Area',
            manager: 'Eng. Timothy Masaba',
            phone: '+256 772 100 207',
            leakCrewLeader: 'Peter Wanyama (Crew Lead)',
            treatmentPlant: 'Manafwa Gravity Flow System',
            activeTickets: 7,
            slaScore: '91%',
          },
        ],
      },
      {
        id: 'western-reg',
        name: 'Western & Albertine Corridor',
        head: 'Eng. Herbert Tumusiime (Regional Manager)',
        coverage: 'Mbarara, Fort Portal, Kasese, Kabale, Masaka, Hoima',
        branches: [
          {
            id: 'br-mbarara',
            name: 'Mbarara Rwizi Area Office',
            manager: 'Eng. Joy Komugisha',
            phone: '+256 772 100 208',
            leakCrewLeader: 'Charles Asiimwe (Crew Lead)',
            treatmentPlant: 'Ruharo Treatment Plant (River Rwizi)',
            activeTickets: 5,
            slaScore: '93%',
          },
        ],
      },
      {
        id: 'northern-reg',
        name: 'Northern & West Nile Region',
        head: 'Eng. Geoffrey Odong (Regional Manager)',
        coverage: 'Gulu, Arua, Lira, Kitgum, Nebbi',
        branches: [
          {
            id: 'br-gulu',
            name: 'Gulu Municipal Area Office',
            manager: 'Eng. Christine Aryemo',
            phone: '+256 772 100 209',
            leakCrewLeader: 'Julius Ocitti (Crew Lead)',
            treatmentPlant: 'Oyitino Dam & Treatment Facility',
            activeTickets: 6,
            slaScore: '90%',
          },
        ],
      },
    ];
  }, []);

  const currentRegion = regionalNetworks.find((r) => r.id === selectedRegionId) || regionalNetworks[0];

  const handleIssueCredential = (branch: any, roleName: string) => {
    const code = `UG-NWSC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvite: Invite = {
      code,
      name: branch.manager,
      title: `${branch.name} — ${roleName}`,
      role: 'node_admin',
      scope: branch.id,
      dept: deptId || 'nwsc',
      is_utility: true,
      used: false,
      country: user?.country || 'UG',
      duty_station: branch.name,
      contact_phone: branch.phone,
    };
    addInvite(newInvite);

    mintGovAccessCode(code, {
      country: user?.country || 'UG',
      dept: deptId || 'nwsc',
      scope: branch.id,
      role: 'node_admin',
      is_utility: true,
      role_label: `${branch.name} — Area Lead`,
      real_title_short: roleName,
      officer_name: branch.manager,
      hierarchy_level: 'tier4_agency',
    });

    toast(`Station credential ${code} minted for ${branch.name}`, 'emerald');
  };

  return (
    <div className="space-y-6">
      {/* Statutory Mandate Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border border-cyan-800/50 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider flex items-center gap-1">
                <Droplet size={11} className="text-cyan-400" /> Tier 4 · Statutory Corporation
              </span>
              <span className="text-[10px] font-mono text-cyan-200/70">
                National Commercial Utility &amp; Public Asset Mandate
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="text-cyan-400 shrink-0" size={20} />
              <span>{agencyName}</span>
            </h2>
            <p className="text-xs text-cyan-100/80 leading-relaxed max-w-3xl">
              {mandateText}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-2.5 rounded-xl bg-cyan-900/30 border border-cyan-700/40 text-right">
              <div className="text-[10px] font-mono text-cyan-300 uppercase">National SLA Index</div>
              <div className="text-lg font-black text-cyan-100 font-mono">94.8%</div>
              <div className="text-[9.5px] text-cyan-300/70">Mean Repair: 4.2 Hours</div>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-cyan-800/40 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('regional')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'regional'
                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                : 'text-cyan-200 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/40'
            }`}
          >
            <MapPin size={13} />
            <span>Regional Operations &amp; Area Offices</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('executive')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'executive'
                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                : 'text-cyan-200 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/40'
            }`}
          >
            <Users size={13} />
            <span>Corporate Executive Directorate</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emergency')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'emergency'
                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                : 'text-cyan-200 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/40'
            }`}
          >
            <HardHat size={13} />
            <span>Rapid Leak &amp; Pipe Burst Crews</span>
          </button>
        </div>
      </div>

      {/* View: Regional Networks */}
      {activeTab === 'regional' && (
        <div className="space-y-4">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {regionalNetworks.map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedRegionId(reg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedRegionId === reg.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {reg.name.split('Directorate')[0].split('Region')[0].trim()}
              </button>
            ))}
          </div>

          {/* Selected Region Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161a22] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{currentRegion.name}</h3>
                <p className="text-xs text-slate-500">{currentRegion.coverage}</p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                Lead: {currentRegion.head}
              </span>
            </div>

            {/* Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {currentRegion.branches.map((br) => (
                <div
                  key={br.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{br.name}</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {br.slaScore} SLA
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{br.manager}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Phone size={10} /> {br.phone}
                      </div>
                      <div className="text-[10px] text-cyan-700 dark:text-cyan-300 flex items-center gap-1 font-mono">
                        <Droplet size={10} /> {br.treatmentPlant}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {br.activeTickets} Active Telemetry Tickets
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIssueCredential(br, 'Area Branch Manager')}
                      className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Key size={10} />
                      <span>Issue Code</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* View: Corporate Executive Suite */}
      {activeTab === 'executive' && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <span>
              <strong>Corporate Headquarters Suite:</strong> Statutory Directors holding national fiduciary, legal, and engineering authority under the Managing Director.
            </span>
            <span className="font-mono text-[10.5px] font-bold text-cyan-600 dark:text-cyan-400">
              {executiveRoster.length} Principal Officers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {executiveRoster.map((exec) => (
              <div
                key={exec.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161a22] flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-[10.5px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                    {exec.division}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{exec.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{exec.title}</p>
                  <div className="pt-1 flex items-center gap-3 text-[10.5px] text-slate-500 font-mono flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail size={11} /> {exec.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={11} /> {exec.phone}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 uppercase shrink-0">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Emergency Rapid Crews */}
      {activeTab === 'emergency' && (
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/70 bg-amber-50/20 dark:bg-amber-950/20 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase font-mono tracking-wider">
              <HardHat size={15} />
              <span>Rapid Leakage, Pipe Burst &amp; Valve Emergency Crews</span>
            </div>
            <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold">
              Guaranteed 4-Hour Emergency Intervention Protocol
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            Emergency crews operate in 8-hour shifts across all major metropolitan transmission mains. Whenever a citizen submits a geo-tagged water burst report with evidence, the system dispatches an alert to the nearest station crew truck.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={11} /> Crew Unit #01 · Nakasero CBD
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Joseph Katamba (Lead)</div>
              <div className="text-[10px] text-slate-500 font-mono">Truck Reg: UG-0412-W · 4 Technicians</div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={11} /> Crew Unit #02 · Nakawa Industrial
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">David Okot (Lead)</div>
              <div className="text-[10px] text-slate-500 font-mono">Truck Reg: UG-0819-W · 4 Technicians</div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={11} /> Crew Unit #03 · Kawempe Booster
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Sulaiman Walusimbi (Lead)</div>
              <div className="text-[10px] text-slate-500 font-mono">Truck Reg: UG-1120-W · 4 Technicians</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
