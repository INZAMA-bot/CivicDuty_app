import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Send, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Layers, 
  Landmark, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Download,
  Filter,
  Check,
  Search,
  Activity,
  Award,
  AlertCircle,
  X,
  FileCheck,
  ExternalLink,
  ShieldAlert,
  Server,
  Zap,
  PhoneCall,
  Sliders,
  Plus,
  UserPlus,
  Key,
  Phone
} from 'lucide-react';
import { TrafficLightLogo } from '../components/TrafficLightLogo';
import { saveCircularNotificationToCloud } from '../services/firestoreSync';
import { CountrySelector } from '../components/CountrySelector';
import { getNationalRolloutArrangements } from '../data/tiers';
import { getRolloutNodesForCountry, RolloutDistrictNode } from '../data/nationalRolloutNodes';
import { CountryCode, TeamMember } from '../types';
import { RolloutSupervisionStructure } from '../components/RolloutSupervisionStructure';
import { SovereignBatchCommissioning } from '../components/SovereignBatchCommissioning';
import { getMinistriesForCountry } from '../data/countryMinistries';

export const PsMolgRolloutView: React.FC = () => {
  const { go, toast, user, selectedCountry, setSelectedCountry, selectedMinistryId, setSelectedMinistryId, teamMembers, addTeamMember, addInvite, logAudit } = useApp();
  const [currentCountry, setCurrentCountry] = useState<CountryCode>(selectedCountry || user?.country || 'UG');
  const [activeTab, setActiveTab] = useState<'cascade' | 'batch_mint' | 'districts' | 'inter_ps' | 'circulars' | 'pdm'>('cascade');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [districtSearch, setDistrictSearch] = useState('');
  const [circularText, setCircularText] = useState('');
  const [circularSubject, setCircularSubject] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Modals / Interactive Panels
  const [inspectingDistrict, setInspectingDistrict] = useState<any | null>(null);
  const [auditingDistrict, setAuditingDistrict] = useState<any | null>(null);
  const [inspectingMinistry, setInspectingMinistry] = useState<any | null>(null);
  const [isTaskforceModalOpen, setIsTaskforceModalOpen] = useState(false);
  const [psSectorFilter, setPsSectorFilter] = useState<'ALL' | 'GOVERNANCE' | 'INFRASTRUCTURE' | 'FISCAL' | 'SOCIAL'>('ALL');

  // Grassroots Staff Appointment Modal
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffTargetDistrict, setStaffTargetDistrict] = useState<any | null>(null);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffUnit, setStaffUnit] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [issuedStaffCode, setIssuedStaffCode] = useState<string | null>(null);

  const rolloutArrangement = getNationalRolloutArrangements(currentCountry);

  const handleIssueStaffCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) {
      toast('Please enter the officer name', 'amber');
      return;
    }
    const roleName = staffRole || rolloutArrangement.lowestOfficerTeamRoles?.[0]?.role || 'Grassroots Field Staff';
    const unitName = staffUnit.trim() || `${staffTargetDistrict?.name || rolloutArrangement.lowestOfficerUnit}`;
    const code = `STAFF-${currentCountry}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStaff: TeamMember = {
      id: `field-${Date.now()}`,
      name: staffName.trim(),
      email: `${staffName.trim().toLowerCase().replace(/\s+/g, '.')}@gov.${currentCountry.toLowerCase()}`,
      role: 'spokesperson',
      title: `${roleName} (${unitName})`,
      dept: 'molg',
      deptName: `${rolloutArrangement.lowestOfficerTitle} Team`,
      scope: unitName,
      country: currentCountry,
      is_utility: false,
      active: true,
      joined: new Date().toISOString().slice(0, 10),
      points: 100,
      badge: `${rolloutArrangement.lowestOfficerTitle} Staff`,
      joinedAt: new Date().toISOString(),
    };

    addTeamMember(newStaff);
    addInvite({
      code,
      name: staffName.trim(),
      title: roleName,
      role: 'spokesperson',
      scope: unitName,
      dept: 'molg',
      is_utility: false,
      used: false,
      country: currentCountry,
    });

    logAudit(
      'invite_grassroots_staff',
      '—',
      `Appointed ${staffName.trim()} — ${roleName} under ${rolloutArrangement.lowestOfficerTitle} (${unitName})`,
      currentCountry
    );

    setIssuedStaffCode(code);
    toast(`Appointed ${staffName.trim()} under ${rolloutArrangement.lowestOfficerTitle}!`, 'emerald');
  };

  // Dynamic Sovereign Rollout Status Data
  const districtsData = getRolloutNodesForCountry(currentCountry);

  // Permanent Secretaries Inter-Ministerial Council Data (Dynamic for all 100+ countries, excluding MoLG itself)
  const ministriesData = getMinistriesForCountry(currentCountry).filter(m => !m.isSuperadmin && m.id !== 'PS-MOLG');

  const filteredDistricts = districtsData.filter(d => {
    const matchesRegion = selectedRegion === 'ALL' || d.region === selectedRegion;
    const matchesSearch = !districtSearch || 
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) || 
      d.cao.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.id.toLowerCase().includes(districtSearch.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const filteredMinistries = ministriesData.filter(m => {
    if (psSectorFilter === 'ALL') return true;
    return m.sector === psSectorFilter;
  });

  const [liveQueue, setLiveQueue] = useState<any[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['sms', 'whatsapp']);

  // Fetch initial queue
  useEffect(() => {
    fetch('/api/notifications/queue')
      .then((res) => res.json())
      .then((data) => {
        if (data.queue) setLiveQueue(data.queue);
      })
      .catch(() => {});
  }, []);

  const handleBroadcastCircular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circularSubject || !circularText) {
      toast('Please enter both circular subject and content.', 'amber');
      return;
    }
    setIsBroadcasting(true);

    try {
      const response = await fetch('/api/notifications/dispatch-circular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          circularRef: `MoLG/CIRC/${Date.now().toString().slice(-4)}/2026`,
          subject: circularSubject,
          body: circularText,
          channels: selectedChannels,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setIsBroadcasting(false);
        setBroadcastSuccess(true);
        if (data.records) {
          setLiveQueue((prev) => [...data.records, ...prev]);
          // Persist each notification receipt to Cloud Firestore
          data.records.forEach((rec: any) => {
            saveCircularNotificationToCloud(rec).catch(() => {});
          });
        }
        toast(`Ministerial Circular dispatched to ${data.dispatchedCount} Parish Chiefs & CAOs over ${selectedChannels.join(' & ')}.`, 'emerald');
        setTimeout(() => {
          setBroadcastSuccess(false);
          setCircularSubject('');
          setCircularText('');
        }, 3500);
      } else {
        throw new Error(data.error || 'Failed to dispatch');
      }
    } catch {
      setIsBroadcasting(false);
      toast('Broadcast recorded to sovereign emergency buffer.', 'emerald');
    }
  };

  const handleDispatchInspection = (district: any) => {
    toast(`MoLG Field Inspection Team dispatched to ${district.name}. Order Ref: MoLG/INSP/${district.id}/2026.`, 'emerald');
  };

  const handlePingNode = (district: any) => {
    toast(`Node ping successful! ${district.id} responding in 38ms with 100% telemetry integrity.`, 'teal');
  };

  const handleIssueSummons = (district: any) => {
    toast(`Statutory Summons issued to ${district.cao}. 24-Hour Appearance Mandate registered with MoLG Executive Registry.`, 'rose');
  };

  const handleIssueSanction = (district: any) => {
    toast(`Executive Sanction Warning logged for ${district.name}. MoFPED DDEG grant clearance flagged.`, 'amber');
  };

  const handleIssueCommendation = (district: any) => {
    toast(`Ministerial SLA Commendation Seal awarded to ${district.cao} (${district.sla} performance).`, 'emerald');
  };

  const handleExportDossier = (district: any) => {
    toast(`Official Audit Dossier & Compliance Seal exported for ${district.name}.`, 'teal');
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-5 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-950 dark:text-white">
      {/* Top Navigation & PS MoLG Identity */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-300 dark:border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => go('gov_admin')}
            className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Hub</span>
          </button>
          <button
            onClick={() => go('gov_inbox')}
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800/70 transition-colors"
          >
            <span>Gov Inbox</span>
          </button>
          <button
            onClick={() => go('ps_opm_analytics')}
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors"
          >
            <span>PS OPM Analytics</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <CountrySelector
            variant="compact"
            value={currentCountry}
            onChange={(newCode) => {
              setCurrentCountry(newCode);
              setSelectedCountry(newCode);
              toast(`Switched Superadmin Command to ${newCode}`, 'emerald');
            }}
          />
          <span className="inline-flex items-center gap-1.5 text-[10px] mono font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shadow-2xs">
            <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
            National Superadmin
          </span>
          <span className="text-[10.5px] mono text-slate-900 dark:text-slate-200 font-black">
            {rolloutArrangement.superadminRefCode}
          </span>
        </div>
      </div>

      {/* Sovereign Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-emerald-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wider uppercase">
              <Landmark className="w-4 h-4" />
              {rolloutArrangement.superadminMinistry}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {rolloutArrangement.superadminTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed font-medium">
              {rolloutArrangement.superadminDescription}
            </p>
          </div>

          <div className="hidden sm:block w-36 shrink-0">
            <TrafficLightLogo size="sm" />
          </div>
        </div>

        {/* Superadmin Macro KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-700/80">
          <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700">
            <div className="text-[11px] text-slate-300 font-bold">{rolloutArrangement.targets.l2l3Title.split('/')[0]} Nodes</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {districtsData.filter(d => d.status.includes('Active')).length} / {rolloutArrangement.targets.l2l3Target}
            </div>
            <div className="text-[10px] text-slate-300 font-semibold">Active Sovereign Tiers</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700">
            <div className="text-[11px] text-slate-300 font-bold">{rolloutArrangement.primaryUnitName}</div>
            <div className="text-xl font-black text-teal-400 mt-0.5">
              {Math.round(rolloutArrangement.targets.l4Target * 0.82).toLocaleString()} / {rolloutArrangement.targets.l4Target.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-300 font-semibold">Grassroots Field Terminals</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700">
            <div className="text-[11px] text-slate-300 font-bold">Avg SLA Response</div>
            <div className="text-xl font-black text-amber-300 mt-0.5">21.4 Hrs</div>
            <div className="text-[10px] text-slate-300 font-semibold">Target: &lt;48.0 Hrs</div>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700">
            <div className="text-[11px] text-slate-300 font-bold">Civic CSAT Score</div>
            <div className="text-xl font-black text-rose-300 mt-0.5">4.8 / 5.0</div>
            <div className="text-[10px] text-slate-300 font-semibold">Verified Citizen Rating</div>
          </div>
        </div>
      </div>

      {/* Superadmin Tab Controls */}
      <div className="flex border-b border-slate-300 dark:border-slate-800 gap-2 overflow-x-auto pb-1 text-xs font-black">
        <button
          onClick={() => setActiveTab('cascade')}
          className={`pb-2.5 px-3.5 font-black transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'cascade'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          Statutory Supervisory Cascade &amp; Invites
        </button>

        <button
          onClick={() => setActiveTab('batch_mint')}
          className={`pb-2.5 px-3.5 font-black transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'batch_mint'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Sovereign Batch Commissioning (CAOs &amp; Sister PSs)
        </button>

        <button
          onClick={() => setActiveTab('districts')}
          className={`pb-2.5 px-3.5 font-black transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'districts'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          {rolloutArrangement.targets.l2l3Title.split('/')[0]} Local Gov Rollout ({filteredDistricts.length})
        </button>

        <button
          onClick={() => setActiveTab('inter_ps')}
          className={`pb-2.5 px-3.5 font-black transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inter_ps'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Executive Leadership Matrix ({ministriesData.length})
        </button>

        <button
          onClick={() => setActiveTab('circulars')}
          className={`pb-2.5 px-3.5 font-black transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'circulars'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Statutory Circulars Broadcast
        </button>

        <button
          onClick={() => setActiveTab('pdm')}
          className={`pb-2.5 px-3.5 font-black transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pdm'
              ? 'border-emerald-600 text-emerald-800 dark:text-emerald-400'
              : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          {rolloutArrangement.lowestOfficerTitle} Staff Roster & Desks ({rolloutArrangement.targets.l4Target.toLocaleString()})
        </button>
      </div>

      {/* TAB 0: STATUTORY SUPERVISORY CASCADE */}
      {activeTab === 'cascade' && (
        <div className="space-y-4">
          <RolloutSupervisionStructure />
        </div>
      )}

      {/* TAB 0.5: SOVEREIGN BATCH COMMISSIONING */}
      {activeTab === 'batch_mint' && (
        <div className="space-y-4">
          <SovereignBatchCommissioning country={currentCountry} />
        </div>
      )}

      {/* TAB 1: DISTRICT ROLLOUT DIRECTORY */}
      {activeTab === 'districts' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search District, City, or CAO..."
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Region Filters */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 mr-1">Region:</span>
              {(['ALL', 'CENTRAL', 'WESTERN', 'EASTERN', 'NORTHERN'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`text-[10px] font-black px-3 py-1 rounded-xl transition-all ${
                    selectedRegion === r
                      ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-800 shadow-sm max-h-[500px] overflow-y-auto">
            {filteredDistricts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-bold text-xs">
                No local government nodes found matching your query.
              </div>
            ) : (
              filteredDistricts.map((d) => (
                <div key={d.id} className="p-4 sm:p-4.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black text-slate-950 dark:text-white">{d.name}</span>
                      <span className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-full ${
                        d.status === 'Active Live' 
                          ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' 
                          : d.status === 'Rollout Phase 2'
                          ? 'bg-teal-100 text-teal-950 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 dark:border-teal-700'
                          : 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      }`}>
                        {d.status}
                      </span>
                      <span className="text-[9.5px] mono font-bold text-slate-600 dark:text-slate-400">[{d.id}]</span>
                    </div>

                    <div className="text-xs text-slate-800 dark:text-slate-200 font-medium flex flex-wrap gap-x-3.5 gap-y-1">
                      <span><strong>Accounting Officer:</strong> <span className="font-bold text-slate-950 dark:text-white">{d.cao}</span></span>
                      <span>•</span>
                      <span><strong>Coverage:</strong> <span className="font-bold text-slate-950 dark:text-white">{d.activeNodes}</span></span>
                      <span>•</span>
                      <span><strong>48h SLA Adherence:</strong> <span className="font-black text-emerald-700 dark:text-emerald-400">{d.sla}</span></span>
                      <span>•</span>
                      <span><strong>CSAT:</strong> <span className="font-bold text-amber-700 dark:text-amber-300">{d.csatScore}/5.0</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => setInspectingDistrict(d)}
                      className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>Inspect Node</span>
                    </button>
                    <button
                      onClick={() => setAuditingDistrict(d)}
                      className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Audit CAO</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: INTER-MINISTERIAL PS COUNCIL & PERFORMANCE MATRIX */}
      {activeTab === 'inter_ps' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 dark:text-emerald-100 leading-relaxed font-semibold">
            <div className="space-y-0.5">
              <strong className="text-sm font-black text-emerald-950 dark:text-emerald-200 block">Permanent Secretaries Council & Cabinet Delivery Matrix</strong>
              <span>The Permanent Secretary of Local Government acts as National Superadmin, connecting all sister ministries into a single unified statutory resolution mechanism.</span>
            </div>
            <button
              onClick={() => setIsTaskforceModalOpen(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-xs"
            >
              <Users className="w-4 h-4" />
              <span>Convene Inter-PS Taskforce</span>
            </button>
          </div>

          {/* Sector Filters for PS Matrix */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-300 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 mr-1">Sector Filter:</span>
              {(['ALL', 'GOVERNANCE', 'INFRASTRUCTURE', 'FISCAL', 'SOCIAL'] as const).map((sec) => (
                <button
                  key={sec}
                  onClick={() => setPsSectorFilter(sec)}
                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all ${
                    psSectorFilter === sec
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            <button
              onClick={() => toast('Cabinet Delivery Briefing Matrix exported to PDF.', 'emerald')}
              className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Cabinet Matrix</span>
            </button>
          </div>

          {/* Ministries Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredMinistries.map((m) => (
              <div key={m.id} className="p-4.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 space-y-3 shadow-xs hover:border-emerald-500/60 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 uppercase">
                          {m.sector}
                        </span>
                        <span className="text-xs mono font-black text-emerald-800 dark:text-emerald-300">{m.code}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-950 dark:text-white leading-snug">{m.title}</h4>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      SLA: {m.slaScore}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {m.mandate}
                  </p>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400">Perm Secretary</div>
                      <div className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate">{m.permSecretary}</div>
                    </div>
                    <div>
                      <div className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400">Cabinet Index</div>
                      <div className="text-[11px] font-black text-emerald-700 dark:text-emerald-400">{m.cabinetDeliveryIndex}%</div>
                    </div>
                    <div>
                      <div className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400">Speed (Hours)</div>
                      <div className="text-[11px] font-black text-amber-700 dark:text-amber-300">{m.macroSpeedHours}h</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    Inter-Agency Sync: <strong className="text-emerald-700 dark:text-emerald-400">{m.interAgencyCollabScore}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setInspectingMinistry(m)}
                      className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors"
                    >
                      Inspect Desk
                    </button>
                    <button
                      onClick={() => toast(`Direct executive SLA communiqué dispatched to ${m.title}.`, 'emerald')}
                      className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                    >
                      Audit SLA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MINISTERIAL CIRCULARS BROADCAST */}
      {activeTab === 'circulars' && (
        <form onSubmit={handleBroadcastCircular} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-300 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              Direct Statutory Circular Broadcast
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Transmit legally binding executive directives to all 146 Chief Administrative Officers (CAOs), City Town Clerks, and Parish Chiefs with cryptographic read-receipt verification.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Circular Reference & Subject</label>
            <input
              type="text"
              value={circularSubject}
              onChange={(e) => setCircularSubject(e.target.value)}
              placeholder="e.g. MoLG/ADM/104/2026: Mandatory 48-Hour Citizen Service SLA Enforcement"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Statutory Directive Body</label>
            <textarea
              rows={4}
              value={circularText}
              onChange={(e) => setCircularText(e.target.value)}
              placeholder="Enter the official circular instructions, compliance deadlines, and sanctions for non-conforming local government accounting officers..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
            />
          </div>

          {/* Channel Selectors */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-900 dark:text-slate-100">Delivery Channels</label>
            <div className="flex gap-2">
              {[
                { id: 'sms', label: '📱 GSM SMS Gateway' },
                { id: 'whatsapp', label: '💬 Official WhatsApp Push' },
                { id: 'ussd_push', label: '⚡ USSD Flash Broadcast' },
              ].map((ch) => (
                <button
                  type="button"
                  key={ch.id}
                  onClick={() =>
                    setSelectedChannels((prev) =>
                      prev.includes(ch.id) ? prev.filter((c) => c !== ch.id) : [...prev, ch.id]
                    )
                  }
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                    selectedChannels.includes(ch.id)
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 gap-2">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Target Audience: <strong className="text-slate-950 dark:text-white">146 CAOs + 10 City Clerks + 10,595 Parish Chiefs</strong>
            </div>

            <button
              type="submit"
              disabled={isBroadcasting}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              {isBroadcasting ? (
                <>
                  <Radio className="w-4 h-4 animate-pulse" />
                  Broadcasting Nationwide...
                </>
              ) : broadcastSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Broadcast Delivered!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Broadcast Circular
                </>
              )}
            </button>
          </div>

          {/* Live Dispatched Notification Queue */}
          {liveQueue.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200">
                  Live Dispatch Ledger & Delivery Receipts ({liveQueue.length})
                </span>
                <span className="text-[10px] mono text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ High Delivery Rate (99.8%)
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {liveQueue.slice(0, 10).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-black text-slate-900 dark:text-slate-100">{item.targetChiefName}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-1.5">
                        ({item.parishName}, {item.targetDistrict})
                      </span>
                      <span className="text-[10px] mono text-slate-400 ml-2">[{item.channel.toUpperCase()}]</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] mono text-slate-500">{item.deliveryLatencyMs || 95}ms</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                        Delivered ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      )}

      {/* TAB 4: LOWEST ACCOUNTING OFFICER & STAFF COMMAND HUB */}
      {activeTab === 'pdm' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-300 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10.5px] font-black uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                Grassroots Accounting Officer Tier
              </div>
              <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                {rolloutArrangement.lowestOfficerTitle} Staff Roster & Operational Hub ({rolloutArrangement.lowestOfficerUnit})
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium max-w-3xl">
                Statutory grassroots management for {rolloutArrangement.superadminMinistry}: Authorizing, deploying, and tracking field staff reporting directly to the {rolloutArrangement.lowestOfficerTitle} across all {rolloutArrangement.lowestOfficerUnit}s.
              </p>
            </div>

            <button
              onClick={() => {
                setStaffTargetDistrict(districtsData[0] || null);
                setStaffUnit(districtsData[0]?.chiefsRoster[0]?.ward || rolloutArrangement.lowestOfficerUnit);
                setStaffRole(rolloutArrangement.lowestOfficerTeamRoles?.[0]?.role || 'Field Staff');
                setIsStaffModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Appoint Grassroots Staff</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700">
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">{rolloutArrangement.lowestOfficerUnit}s Active</div>
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                {Math.round(rolloutArrangement.targets.l4Target * 0.82).toLocaleString()} / {rolloutArrangement.targets.l4Target.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">82.0% Operational Grassroots Desks</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700">
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">Field Inquiries Handled</div>
              <div className="text-lg font-black text-teal-700 dark:text-teal-400">14,290 Cases</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">92.3% Resolved at Grassroots Level</div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700">
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-bold">Offline USSD / Telemetry Rate</div>
              <div className="text-lg font-black text-amber-700 dark:text-amber-400">81.4% Direct Uplink</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Real-time sync to Superadmin hub</div>
            </div>
          </div>

          {/* Statutory Grassroots Roles Grid */}
          {rolloutArrangement.lowestOfficerTeamRoles && rolloutArrangement.lowestOfficerTeamRoles.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Statutory Staff Roles Under {rolloutArrangement.lowestOfficerTitle}
                </h4>
                <span className="text-[11px] font-bold text-slate-500">
                  {rolloutArrangement.lowestOfficerTeamRoles.length} Role Profiles Defined
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {rolloutArrangement.lowestOfficerTeamRoles.map((roleObj, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        {roleObj.role}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        {roleObj.description}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setStaffTargetDistrict(districtsData[0] || null);
                        setStaffRole(roleObj.role);
                        setStaffUnit(districtsData[0]?.chiefsRoster[0]?.ward || rolloutArrangement.lowestOfficerUnit);
                        setIsStaffModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 text-[10.5px] font-black rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      + Appoint
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Field Personnel Ledger */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Live {rolloutArrangement.lowestOfficerTitle} Roster & Telemetry Nodes</span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 lowercase font-mono">
                sync active · 100% telemetry online
              </span>
            </h4>

            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
              {districtsData.flatMap((d) =>
                (d.chiefsRoster || []).map((chief, cIdx) => (
                  <div key={`${d.id}-${cIdx}`} className="p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-950 dark:text-white">{chief.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {rolloutArrangement.lowestOfficerTitle}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">· {chief.ward} ({d.name})</span>
                      </div>
                      <div className="text-[10.5px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <span>Status: <strong className="text-emerald-700 dark:text-emerald-400">{chief.status}</strong></span>
                        <span>•</span>
                        <span>Staff Deployed: <strong>{chief.staffCount || 4} Field Personnel</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toast(`Pinged telemetry uplink for ${chief.name} (${chief.ward})`, 'emerald')}
                        className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-[10.5px] font-black text-slate-800 dark:text-slate-200"
                      >
                        Ping Node
                      </button>
                      <button
                        onClick={() => {
                          setStaffTargetDistrict(d);
                          setStaffUnit(chief.ward);
                          setIsStaffModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-[10.5px] font-black text-white"
                      >
                        + Add Staff
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-black text-slate-950 dark:text-white">
                Download Sovereign {rolloutArrangement.lowestOfficerTitle} Deployment Ledger
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Comprehensive statutory export with officer names, operational node coordinates, and administrative signoffs.
              </div>
            </div>
            <button
              onClick={() => toast(`Sovereign ${rolloutArrangement.lowestOfficerTitle} Ledger exported successfully.`, 'emerald')}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-black rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. INSPECT NODE MODAL / FLYOUT */}
      {/* ========================================================================= */}
      {inspectingDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase">
                    {inspectingDistrict.region} REGION
                  </span>
                  <span className="text-xs mono font-black text-slate-600 dark:text-slate-400">Node ID: {inspectingDistrict.id}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">{inspectingDistrict.name}</h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Accounting Officer: <strong className="text-slate-950 dark:text-white">{inspectingDistrict.cao}</strong>
                </p>
              </div>

              <button
                onClick={() => setInspectingDistrict(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3-Signal Telemetry Bar */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center">
                <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">Resolved Green Signals</div>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{inspectingDistrict.greenSignals}</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400">Citizen Verified</div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-center">
                <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300">Active Amber (SLA)</div>
                <div className="text-lg font-black text-amber-700 dark:text-amber-400 mt-0.5">{inspectingDistrict.amberSignals}</div>
                <div className="text-[9px] text-amber-600 dark:text-amber-400">Within 48h Window</div>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-center">
                <div className="text-[10px] font-bold text-rose-800 dark:text-rose-300">Overdue Red Signals</div>
                <div className="text-lg font-black text-rose-700 dark:text-rose-400 mt-0.5">{inspectingDistrict.redSignals}</div>
                <div className="text-[9px] text-rose-600 dark:text-rose-400">Requires PS Directive</div>
              </div>
            </div>

            {/* Sub-Counties & Parishes Inspection */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Sub-County / Municipal Divisions ({inspectingDistrict.subCounties.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {inspectingDistrict.subCounties.map((sc: string, idx: number) => (
                  <span key={idx} className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    📍 {sc}
                  </span>
                ))}
              </div>
            </div>

            {/* Lowest Accounting Officer & Field Telemetry Roster */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {rolloutArrangement.lowestOfficerTitle} Telemetry & Field Staff Roster
                </h4>
                <button
                  onClick={() => {
                    setStaffTargetDistrict(inspectingDistrict);
                    setStaffUnit(inspectingDistrict.chiefsRoster[0]?.ward || rolloutArrangement.lowestOfficerUnit);
                    setIsStaffModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Appoint Staff</span>
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                {inspectingDistrict.chiefsRoster.map((c: any, idx: number) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-slate-950 dark:text-white">{c.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-1.5">({c.ward})</span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePingNode(inspectingDistrict)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <Server className="w-3.5 h-3.5 text-teal-600" />
                  <span>Ping Node</span>
                </button>
                <button
                  onClick={() => handleDispatchInspection(inspectingDistrict)}
                  className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-xs font-black text-white flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Inspection Team</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setAuditingDistrict(inspectingDistrict);
                  setInspectingDistrict(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-black text-white flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Open CAO Audit Dossier →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. AUDIT CAO COMPLIANCE SCORECARD MODAL */}
      {/* ========================================================================= */}
      {auditingDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4.5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase">
                    STATUTORY AUDIT DOSSIER
                  </span>
                  <span className="text-xs mono font-black text-slate-600 dark:text-slate-400">{auditingDistrict.id}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                  Accounting Officer Compliance Audit: {auditingDistrict.cao}
                </h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Jurisdiction: <strong className="text-slate-950 dark:text-white">{auditingDistrict.name}</strong>
                </p>
              </div>

              <button
                onClick={() => setAuditingDistrict(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Pillars Statutory Adherence Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400">48h SLA Benchmark</div>
                <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{auditingDistrict.sla}</div>
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400">Target &gt;90%</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400">PDM Clearance</div>
                <div className="text-lg font-black text-teal-700 dark:text-teal-400 mt-0.5">{auditingDistrict.pdmSaccoClearance}</div>
                <div className="text-[9px] text-teal-600 dark:text-teal-400">Parish SACCO SLA</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Citizen CSAT</div>
                <div className="text-lg font-black text-amber-700 dark:text-amber-300 mt-0.5">{auditingDistrict.csatScore}/5.0</div>
                <div className="text-[9px] text-amber-600 dark:text-amber-400">Audited Feedback</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400">DDEG Grant Audit</div>
                <div className="text-xs font-black text-slate-900 dark:text-slate-100 mt-1">{auditingDistrict.ddegCompliance}</div>
                <div className="text-[9px] text-slate-500">Treasury Verified</div>
              </div>
            </div>

            {/* Compliance Summary & Log */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="font-black text-slate-950 dark:text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Statutory Auditor Note to Permanent Secretary</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                The Accounting Officer for <strong>{auditingDistrict.name}</strong> maintains an operational resolution speed of <strong>{auditingDistrict.avgResponseHours} hours</strong>, successfully closing {auditingDistrict.casesResolved} out of {auditingDistrict.casesLogged} registered public issues. Total parish node coverage is verified at {auditingDistrict.activeNodes}.
              </p>
            </div>

            {/* Official PS Statutory Actions */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Execute Permanent Secretary Statutory Powers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleIssueSummons(auditingDistrict)}
                  className="p-2.5 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-900 dark:text-rose-200 text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>Issue Statutory Summons</span>
                </button>
                <button
                  onClick={() => handleIssueSanction(auditingDistrict)}
                  className="p-2.5 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Issue Sanction Warning</span>
                </button>
                <button
                  onClick={() => handleIssueCommendation(auditingDistrict)}
                  className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-200 text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Award SLA Commendation</span>
                </button>
              </div>
            </div>

            {/* Footer / Export */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] mono text-slate-500">Official MoLG Regulatory Desk</span>
              <button
                onClick={() => handleExportDossier(auditingDistrict)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-black rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit Dossier (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INSPECT MINISTERIAL DESK MODAL */}
      {/* ========================================================================= */}
      {inspectingMinistry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-300 border border-teal-300 dark:border-teal-700 uppercase">
                  {inspectingMinistry.sector} SECTOR
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">{inspectingMinistry.title}</h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Permanent Secretary: <strong className="text-slate-950 dark:text-white">{inspectingMinistry.permSecretary}</strong>
                </p>
              </div>

              <button
                onClick={() => setInspectingMinistry(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 font-bold">Cabinet Delivery</div>
                <div className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5">{inspectingMinistry.cabinetDeliveryIndex}%</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 font-bold">Macro SLA</div>
                <div className="text-base font-black text-teal-700 dark:text-teal-400 mt-0.5">{inspectingMinistry.slaScore}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] text-slate-500 font-bold">Resolution Speed</div>
                <div className="text-base font-black text-amber-700 dark:text-amber-300 mt-0.5">{inspectingMinistry.macroSpeedHours}h</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">Statutory Mandate Scope:</div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {inspectingMinistry.mandate}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedMinistryId(inspectingMinistry.id);
                  setInspectingMinistry(null);
                  toast(`Mounting ${inspectingMinistry.title} Executive Workspace...`, 'emerald');
                  go('ps_executive_desk');
                }}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Mount {inspectingMinistry.shortTitle || inspectingMinistry.title} Apex Desk →</span>
              </button>
              <button
                onClick={() => {
                  toast(`Synchronized inter-ministerial task with ${inspectingMinistry.permSecretary}.`, 'emerald');
                  setInspectingMinistry(null);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-xs cursor-pointer"
              >
                Dispatch Joint Resolution Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CONVENE INTER-MINISTERIAL TASKFORCE MODAL */}
      {/* ========================================================================= */}
      {isTaskforceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase">
                  SOVEREIGN CABINET LINK
                </span>
                <h3 className="text-lg font-black text-slate-950 dark:text-white">Convene Inter-Ministerial Taskforce</h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Emergency statutory alignment across all 8 Permanent Secretaries.
                </p>
              </div>

              <button
                onClick={() => setIsTaskforceModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-black text-slate-900 dark:text-white">Taskforce Priority Topic</label>
              <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                <option>Mandatory 48-Hour Cross-Ministry Red Signal Resolution</option>
                <option>Parish Development Model (PDM) Pillar VII Sacco Fund Clearance</option>
                <option>District Road Machinery Maintenance & Fuel Telemetry</option>
                <option>Health Centre IV Essential Drugs Stock-Out Emergency</option>
              </select>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 font-semibold">
              Broadcast will dispatch immediate executive calendar invites and real-time telemetry links to all 8 Permanent Secretaries with cryptographic confirmation.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsTaskforceModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast('Inter-Ministerial Taskforce convened. All 8 Permanent Secretaries notified.', 'emerald');
                  setIsTaskforceModalOpen(false);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-xs"
              >
                Dispatch Taskforce Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. APPOINT LOWEST ACCOUNTING OFFICER STAFF MODAL */}
      {/* ========================================================================= */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4.5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase">
                    Grassroots Staff Appointment
                  </span>
                  <span className="text-xs mono font-black text-slate-600 dark:text-slate-400">
                    {rolloutArrangement.lowestOfficerUnit}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                  Appoint Field Staff Under {rolloutArrangement.lowestOfficerTitle}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {staffTargetDistrict ? `${staffTargetDistrict.name}` : `National Sovereign Infrastructure`}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsStaffModalOpen(false);
                  setIssuedStaffCode(null);
                  setStaffName('');
                  setStaffPhone('');
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {issuedStaffCode ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-black text-sm">Credential Minted & Field Access Granted!</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Provide this one-time cryptographic enrollment code to the appointed officer for login or offline USSD synchronization:
                </p>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                  <span className="text-sm font-mono font-black text-emerald-700 dark:text-emerald-400 tracking-wider">
                    {issuedStaffCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(issuedStaffCode);
                      toast('Access code copied to clipboard', 'emerald');
                    }}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <button
                  onClick={() => {
                    setIsStaffModalOpen(false);
                    setIssuedStaffCode(null);
                    setStaffName('');
                    setStaffPhone('');
                  }}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleIssueStaffCredential} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Officer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="e.g. John Mukasa / Maria Rossi"
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Statutory Field Role *
                  </label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white"
                  >
                    {(rolloutArrangement.lowestOfficerTeamRoles || []).map((tr, idx) => (
                      <option key={idx} value={tr.role}>
                        {tr.role}
                      </option>
                    ))}
                    <option value="Grassroots Community Liaison">Grassroots Community Liaison</option>
                    <option value="Field Inspection Officer">Field Inspection Officer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Assigned {rolloutArrangement.lowestOfficerUnit} / Node Area
                  </label>
                  <input
                    type="text"
                    value={staffUnit}
                    onChange={(e) => setStaffUnit(e.target.value)}
                    placeholder={`e.g. Central Parish Hub / Ward 4 Desk`}
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Official Mobile / USSD Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    placeholder="+256 770 000000"
                    className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-950 dark:text-white focus:outline-emerald-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsStaffModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Mint Field Credential
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
