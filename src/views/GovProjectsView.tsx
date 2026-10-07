import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  HardHat,
  Plus,
  Copy,
  Check,
  Calendar,
  DollarSign,
  Search,
  Trash2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Info,
  ListChecks,
  FileCheck2,
  Briefcase,
  Layers,
  Lock,
  BadgeCheck,
  Landmark,
} from 'lucide-react';
import { CountryCode, Project, ProjectMilestone } from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { primaryTier, tiersFor } from '../data/tiers';

const PROJECT_STATUS_LABELS: Record<string, string> = {
  active: 'Works in progress',
  completed: 'Handed over',
  defects: 'Defects window',
  closed: 'Closed',
  abandoned: 'Abandoned',
};

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function makeCode(prefix: string): string {
  const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  let s = '';
  for (let i = 0; i < 8; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${prefix}-${s}`;
}

function primaryNodes(country: CountryCode): { id: string; name: string; path: string }[] {
  const target = primaryTier(country)?.depth || 3;
  const out: { id: string; name: string; path: string }[] = [];
  const walk = (nodes: any[], d: number, trail: string[]) => {
    for (const n of nodes || []) {
      const path = [...trail, n.name];
      if (d === target) out.push({ id: n.id, name: n.name, path: path.join(' › ') });
      walk(n.children, d + 1, path);
    }
  };
  walk(TERRITORY[country] || [], 1, [COUNTRIES[country]?.name || country]);
  return out;
}

const DEFAULT_MILESTONES: ProjectMilestone[] = [
  {
    id: 'm1',
    title: 'Phase 1: Bush Clearing, Site Clearance & Setting Foundation',
    date: 'Stage 1',
    done: true,
    awarderVerified: true,
    awarderSignedBy: 'Supervising Officer (Gov)',
    contractorVerified: true,
    contractorSignedBy: 'Contractor Lead Engineer',
  },
  {
    id: 'm2',
    title: 'Phase 2: Substructure Trenching & Drainage Culvert Excavation',
    date: 'Stage 2',
    done: false,
    awarderVerified: true,
    awarderSignedBy: 'Area Resident Engineer',
    contractorVerified: false,
  },
  {
    id: 'm3',
    title: 'Phase 3: Concrete Box Culverts & Base Layer Compaction',
    date: 'Stage 3',
    done: false,
    awarderVerified: false,
    contractorVerified: false,
  },
  {
    id: 'm4',
    title: 'Phase 4: Road Surfacing Tarmacking & Solar Lighting Works',
    date: 'Stage 4',
    done: false,
    awarderVerified: false,
    contractorVerified: false,
  },
  {
    id: 'm5',
    title: 'Phase 5: Final Technical Audit & Handover Certificate',
    date: 'Stage 5',
    done: false,
    awarderVerified: false,
    contractorVerified: false,
  },
];

export const GovProjectsView: React.FC = () => {
  const { user, projects, posts, addProject, addInvite, logAudit, toast, setActiveProject, go } = useApp();

  const [creating, setCreating] = useState(false);
  const [contractor, setContractor] = useState('');
  const [title, setTitle] = useState('');
  const [tender, setTender] = useState('');
  const [value, setValue] = useState('');
  const [starts, setStarts] = useState('');
  const [completes, setCompletes] = useState('');
  const [selectedUnits, setSelectedUnits] = useState<{ id: string; name: string; path: string }[]>([]);
  const [searchAreaQuery, setSearchAreaQuery] = useState('');
  const [issued, setIssued] = useState<{ code: string; contractor: string; title: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Contract Milestones Builder State
  const [contractMilestones, setContractMilestones] = useState<ProjectMilestone[]>(DEFAULT_MILESTONES);
  const [signingRole, setSigningRole] = useState<'awarder' | 'contractor'>('awarder');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  const country = user?.country || 'UG';
  const canManageContracts = user && (['node_admin', 'spokesperson', 'platform_admin'].includes(user.role) || user.is_utility);
  const isEntityUser = user?.is_utility || (user?.dept && user.dept !== 'kcca' && user.dept !== 'kayunga');

  // Filter projects belonging to current user's country & department, or fall back to country-wide projects
  const filteredProjects = projects.filter(
    (p) => (!p.country || p.country === country) && (!user?.dept || p.dept === user.dept || user.role === 'platform_admin' || user.is_utility || user.role === 'spokesperson')
  );
  const myProjects = filteredProjects.length > 0 ? filteredProjects : projects.filter((p) => !p.country || p.country === country);

  const allAreas = primaryNodes(country);
  const searchAreaHits =
    searchAreaQuery.trim().length >= 2
      ? allAreas
          .filter(
            (n) =>
              n.name.toLowerCase().includes(searchAreaQuery.trim().toLowerCase()) &&
              !selectedUnits.some((u) => u.id === n.id)
          )
          .slice(0, 5)
      : [];

  const handleAddUnit = (unit: { id: string; name: string; path: string }) => {
    setSelectedUnits((prev) => [...prev, unit]);
    setSearchAreaQuery('');
  };

  const handleRemoveUnit = (id: string) => {
    setSelectedUnits((prev) => prev.filter((u) => u.id !== id));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    toast('Contractor access code copied', 'emerald');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) {
      toast('Enter milestone deliverable title', 'amber');
      return;
    }
    const item: ProjectMilestone = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: newMilestoneTitle.trim(),
      date: newMilestoneDate.trim() || 'Target Stage',
      done: false,
      awarderVerified: false,
      contractorVerified: false,
    };
    setContractMilestones((prev) => [...prev, item]);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
    toast('Custom milestone added to contract', 'emerald');
  };

  const handleRemoveMilestone = (id: string) => {
    setContractMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleAwarder = (id: string) => {
    if (signingRole !== 'awarder') {
      toast('ACCESS DENIED: Contractor Executives cannot sign the Procuring Entity slot!', 'amber');
      return;
    }
    setContractMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextAwarder = !m.awarderVerified;
        return {
          ...m,
          awarderVerified: nextAwarder,
          awarderSignedBy: nextAwarder ? (user?.name || 'Procuring Entity Officer') : undefined,
          done: nextAwarder && Boolean(m.contractorVerified),
        };
      })
    );
    toast('Procuring Entity signoff updated', 'emerald');
  };

  const handleToggleContractor = (id: string) => {
    if (signingRole !== 'contractor') {
      toast('ACCESS DENIED: Government Officials cannot sign the Contractor Executive slot!', 'amber');
      return;
    }
    setContractMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextContractor = !m.contractorVerified;
        return {
          ...m,
          contractorVerified: nextContractor,
          contractorSignedBy: nextContractor ? 'Contractor Lead' : undefined,
          done: Boolean(m.awarderVerified) && nextContractor,
        };
      })
    );
    toast('Contractor Executive signoff updated', 'amber');
  };

  const handleOpenWall = () => {
    if (!contractor.trim()) {
      toast('Name the contractor — the wall names them publicly', 'red');
      return;
    }
    if (!title.trim()) {
      toast('Describe the works', 'red');
      return;
    }
    if (selectedUnits.length === 0) {
      toast('Add at least one area the works cover', 'red');
      return;
    }
    if (!completes) {
      toast('A completion date sets the defects window', 'red');
      return;
    }

    // Calculate closes date (12 months past completion date)
    const closesDate = new Date(completes);
    closesDate.setMonth(closesDate.getMonth() + 12);
    const closesIso = closesDate.toISOString().slice(0, 10);

    const projId = 'prj-' + Date.now();
    const deptPrefix = (user?.dept_label || user?.dept || 'WRK').replace(/\s+/g, '').toUpperCase().slice(0, 4);
    const generatedCode = makeCode(`PRJ-${deptPrefix}`);

    const curr = COUNTRIES[country]?.currency || 'USD';
    const newProject: Project = {
      id: projId,
      dept: user?.dept || 'kcca',
      country,
      contractor: contractor.trim(),
      title: title.trim(),
      tender: tender.trim() || `TDR/${country}/${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      value: value.trim() || `${curr} 500m`,
      units: selectedUnits.map((u) => u.id),
      starts: starts || new Date().toISOString().slice(0, 10),
      completes,
      closes: closesIso,
      status: 'active',
      code: generatedCode,
      milestones: contractMilestones.length > 0 ? contractMilestones : DEFAULT_MILESTONES,
    };

    addProject(newProject);

    // Register contractor invite code
    addInvite({
      code: generatedCode,
      name: contractor.trim(),
      title: `${contractor.trim()} — ${title.trim()}`,
      role: 'spokesperson',
      scope: selectedUnits[0]?.id || country,
      dept: user?.dept || 'kcca',
      is_utility: true,
      used: false,
      country,
    });

    logAudit(
      'open_project_wall',
      '—',
      `${title.trim()} — ${contractor.trim()}${tender ? ` (${tender.trim()})` : ''}. ${contractMilestones.length} milestones set.`
    );

    setIssued({ code: generatedCode, contractor: contractor.trim(), title: title.trim() });
    toast('Wall opened — contractor code & milestones issued', 'emerald');

    // Reset form
    setContractor('');
    setTitle('');
    setTender('');
    setValue('');
    setStarts('');
    setCompletes('');
    setSelectedUnits([]);
    setContractMilestones(DEFAULT_MILESTONES);
    setNewMilestoneTitle('');
    setNewMilestoneDate('');
    setCreating(false);
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-16 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div>
        <div className="text-[10px] mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
          <Briefcase size={13} />
          <span>{isEntityUser ? 'Entity & Utility Contracts' : 'Public Sector Works'}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Project Walls & Contracts</h2>
        <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
          Public contract walls create transparent milestones, dual physical signoffs, and citizen feedback channels for public infrastructure.
        </p>
      </div>

      {/* Issued Access Code Banner */}
      {issued && (
        <div className="card p-4 space-y-2 border border-amber-600/30 dark:border-amber-500/30 bg-amber-600/10 dark:bg-amber-500/10 rounded-2xl animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-teal-700 dark:text-teal-400" size={18} />
            <p className="text-[13px] font-bold text-teal-800 dark:text-teal-300">Wall Opened & Access Code Issued</p>
          </div>
          <p className="text-[9.5px] mono text-slate-700 dark:text-slate-300 uppercase tracking-widest pt-1 font-bold">
            {issued.contractor} — {issued.title}
          </p>
          <button
            onClick={() => handleCopyCode(issued.code)}
            className="flex items-center justify-between w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <span className="text-sm mono font-bold text-amber-800 dark:text-amber-300 tracking-widest">{issued.code}</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 font-medium">
              {copied ? <Check size={14} className="text-teal-600 dark:text-teal-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </span>
          </button>
          <p className="text-[9.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Include this code in the tender award letter. The contractor logs in without subscription fees to post verified site progress.
          </p>
          <button
            onClick={() => setIssued(null)}
            className="text-[9.5px] mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 pt-1 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Button to toggle New Contract form */}
      {canManageContracts && !creating && (
        <button
          onClick={() => setCreating(true)}
          className="w-full bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold rounded-2xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Open a Wall for a New Contract
        </button>
      )}

      {/* New Contract Creation Form */}
      {creating && (
        <div className="card p-5 space-y-4 border border-amber-600/30 dark:border-amber-500/30 rounded-2xl bg-white dark:bg-slate-900/90 animate-fade-in shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <HardHat size={15} /> Add New Contract / Public Work
            </p>
            <button
              onClick={() => setCreating(false)}
              className="text-[10px] mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-bold"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Contractor Name</label>
            <input
              type="text"
              value={contractor}
              onChange={(e) => setContractor(e.target.value)}
              placeholder={country === 'RW' ? 'e.g. Horizon Construction SARL / Kigali Water SARL' : 'e.g. Seyani Brothers Construction Ltd'}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Project Title / Works Description</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={country === 'RW' ? 'e.g. Gasabo Drainage Channel & Road Resurfacing Phase 1' : 'e.g. Nakawa Drainage Channel & Road Resurfacing Phase 1'}
              className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Tender Reference</label>
              <input
                type="text"
                value={tender}
                onChange={(e) => setTender(e.target.value)}
                placeholder={`e.g. ${country}/WRKS/2026-032`}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Contract Value</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`e.g. ${COUNTRIES[country]?.currency || 'UGX'} 740m`}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[9px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Start Date</label>
              <input
                type="date"
                value={starts}
                onChange={(e) => setStarts(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Completion Date</label>
              <input
                type="date"
                value={completes}
                onChange={(e) => setCompletes(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* Area Selection */}
          <div className="space-y-2">
            <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Areas Covered (Parishes / Wards)</label>
            
            {selectedUnits.length > 0 && (
              <div className="space-y-1.5">
                {selectedUnits.map((u, uIdx) => (
                  <div key={`${u.id}-${uIdx}`} className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-950 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800">
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{u.name}</div>
                      <div className="text-[9px] mono text-slate-500">{u.path}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveUnit(u.id)}
                      className="text-[10px] mono text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bold"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={14} />
              <input
                type="text"
                value={searchAreaQuery}
                onChange={(e) => setSearchAreaQuery(e.target.value)}
                placeholder={`Search ${primaryTier(country)?.title || 'ward'} (e.g. ${allAreas[0]?.name || 'Central'}, ${allAreas[1]?.name || 'East'})...`}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>

            {searchAreaHits.length > 0 && (
              <div className="space-y-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 max-h-40 overflow-y-auto shadow-sm">
                {searchAreaHits.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleAddUnit(n)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{n.name}</div>
                      <div className="text-[9px] mono text-slate-500">{n.path}</div>
                    </div>
                    <span className="text-[9px] mono text-amber-700 dark:text-amber-400 font-bold">+ Add</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Milestones & Stage Deliverables Setup */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[10px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ListChecks size={14} /> Contract Milestones & Dual-Verification Execution Stages
              </label>
              <span className="text-[9px] mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-600/30 px-2 py-0.5 rounded font-bold">
                {contractMilestones.length} Phases Defined
              </span>
            </div>

            <p className="text-[9.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Every phase requires 2 independent physical verification signoffs (Procuring Entity + Contractor Executive) before financial disbursements or handovers occur.
            </p>

            {/* Active Signing Duty Role Selector */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mono">
                <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-amber-600 dark:text-amber-400" /> Active Verification Identity:</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">Select active authority</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mono">
                <button
                  type="button"
                  onClick={() => {
                    setSigningRole('awarder');
                    toast('Switched active signoff role to Procuring Entity (Gov Authority)', 'emerald');
                  }}
                  className={`p-2 rounded-lg border font-bold flex items-center justify-between text-[10px] transition-all ${
                    signingRole === 'awarder'
                      ? 'bg-teal-50 dark:bg-teal-500/20 border-teal-500 text-teal-800 dark:text-teal-200 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1"><Landmark size={11} /> Procuring Entity</span>
                  {signingRole === 'awarder' && <span className="text-[8px] bg-teal-600 text-white px-1 py-0.2 rounded font-black">ACTIVE</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSigningRole('contractor');
                    toast('Switched active signoff role to Contractor Executive', 'amber');
                  }}
                  className={`p-2 rounded-lg border font-bold flex items-center justify-between text-[10px] transition-all ${
                    signingRole === 'contractor'
                      ? 'bg-amber-600/15 border-amber-600/50 text-amber-900 dark:text-amber-200 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1"><HardHat size={11} /> Contractor Exec</span>
                  {signingRole === 'contractor' && <span className="text-[8px] bg-amber-700 text-white px-1 py-0.2 rounded font-black">ACTIVE</span>}
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {contractMilestones.map((m, idx) => {
                const awarderSigned = Boolean(m.awarderVerified);
                const contractorSigned = Boolean(m.contractorVerified);
                const fullyDone = m.done || (awarderSigned && contractorSigned);
                return (
                  <div key={`${m.id}-${idx}`} className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs mono shadow-sm">
                    {/* Header: Phase Pill Badge and Actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-600/10 text-amber-800 dark:text-amber-300 border border-amber-600/30">
                          PHASE {idx + 1}
                        </span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">Target: {m.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded border ${
                          fullyDone
                            ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                            : (awarderSigned || contractorSigned)
                            ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-600/30 text-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {fullyDone ? '2/2 DUAL VERIFIED' : (awarderSigned || contractorSigned) ? '1/2 PENDING' : '0/2 UNVERIFIED'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove milestone"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Prominent Phase Title */}
                    <div className="border-l-4 border-amber-600 pl-2.5 py-1 bg-slate-50 dark:bg-slate-900/80 rounded-r-lg">
                      <h3 className={`text-sm font-bold tracking-tight leading-snug ${
                        fullyDone ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-slate-900 dark:text-white'
                      }`}>
                        {m.title}
                      </h3>
                    </div>

                    {/* Dual Signoff Buttons */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-slate-800 text-[9.5px] flex-wrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleAwarder(m.id)}
                          className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 font-bold ${
                            signingRole === 'awarder'
                              ? awarderSigned
                                ? 'bg-teal-50 dark:bg-teal-500/20 border-teal-500 text-teal-800 dark:text-teal-300'
                                : 'bg-teal-700 text-white hover:bg-teal-600'
                              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {signingRole === 'awarder' ? (
                            <><Landmark size={10} /> Procuring Entity {awarderSigned ? 'Signed' : '+ Sign'}</>
                          ) : (
                            <><Lock size={10} /> Gov Slot Locked {awarderSigned ? '(Signed)' : ''}</>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleContractor(m.id)}
                          className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 font-bold ${
                            signingRole === 'contractor'
                              ? contractorSigned
                                ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-600 text-amber-800 dark:text-amber-300'
                                : 'bg-amber-700 text-white hover:bg-amber-600'
                              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                          }`}
                        >
                          {signingRole === 'contractor' ? (
                            <><HardHat size={10} /> Contractor Exec {contractorSigned ? 'Signed' : '+ Sign'}</>
                          ) : (
                            <><Lock size={10} /> Contractor Slot Locked {contractorSigned ? '(Signed)' : ''}</>
                          )}
                        </button>
                      </div>

                      {/* Signatures Audit */}
                      <div className="text-[8.5px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        {m.awarderSignedBy && (
                          <span className="text-teal-700 dark:text-teal-400 font-bold">Gov: {m.awarderSignedBy}</span>
                        )}
                        {m.contractorSignedBy && (
                          <span className="text-amber-700 dark:text-amber-400 font-bold">Exec: {m.contractorSignedBy}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Custom Milestone Inputs */}
            <div className="space-y-1 pt-1">
              <span className="text-[8.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-wider block font-bold">+ Add Custom Contract Milestone</span>
              <div className="grid grid-cols-3 gap-1.5">
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="e.g. Drainage Channel Laying"
                  className="col-span-2 text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2"
                />
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    placeholder="Stage / Date"
                    className="text-xs w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs px-3 rounded-xl flex items-center justify-center transition-colors shadow-xs"
                    title="Add milestone stage"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[9px] text-slate-500 leading-relaxed pt-1">
            The wall stays open twelve months past completion — the defects liability period. A contractor is paid and leaves; the road fails in the next rains. A wall that closed at handover would be shut at exactly the moment failure becomes visible.
          </p>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setCreating(false)}
              className="flex-1 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono hover:border-slate-400 dark:hover:border-slate-700 transition-all font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleOpenWall}
              className="flex-1 bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm"
            >
              Open Wall & Issue Code
            </button>
          </div>
        </div>
      )}

      {/* Contracts / Project Walls Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">Active Contracts & Project Walls</p>
          <span className="text-[9px] mono text-slate-500">{myProjects.length} listed</span>
        </div>

        {myProjects.length === 0 ? (
          <div className="card p-6 text-center space-y-2 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
            <p className="text-[13px] mono text-slate-600 dark:text-slate-400">No project walls listed yet.</p>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Open a wall when you award a contract, and include the access code in the award package.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myProjects.map((p) => {
              const daysLeft = daysUntil(p.closes);
              const projectReports = posts.filter(
                (post) => post.project === p.id || post.title.toLowerCase().includes(p.title.toLowerCase())
              );
              const unresolvedReports = projectReports.filter((post) => post.status !== 'resolved').length;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p);
                    go('project');
                  }}
                  className="card p-4 space-y-2.5 cursor-pointer hover:border-amber-600/40 transition-all active:scale-[.99] relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className={`chip ${
                            p.status === 'defects'
                              ? 'ch-overdue'
                              : p.status === 'active'
                              ? 'ch-invest'
                              : 'ch-resolved'
                          }`}
                        >
                          {PROJECT_STATUS_LABELS[p.status] || p.status}
                        </span>
                        {unresolvedReports > 0 && (
                          <span className="chip ch-overdue">
                            {unresolvedReports} pending report{unresolvedReports > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <h3 className="text-[15px] font-black text-slate-900 dark:text-slate-100 leading-snug">{p.title}</h3>
                      <p className="text-[10px] mono text-slate-500 dark:text-slate-400 mt-0.5">
                        {p.contractor} {p.tender ? `· ${p.tender}` : ''}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-[8.5px] mono text-slate-500 uppercase font-bold">Wall Closes</p>
                      <p
                        className={`text-[11px] mono font-bold ${
                          daysLeft < 90 && daysLeft > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Closed'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[9px] mono">
                    <div>
                      <span className="text-slate-500 block">Value</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">{p.value}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Completion</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{p.completes}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Reports</span>
                      <span className="text-teal-700 dark:text-teal-400 font-bold">{projectReports.length} filed</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[8.5px] mono text-slate-500">
                    <span>Code: {p.code}</span>
                    <span className="text-teal-700 dark:text-teal-400 font-bold flex items-center gap-0.5">
                      Inspect Wall <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Explainer note */}
      <div className="p-3.5 space-y-1 bg-teal-50/70 dark:bg-teal-500/10 rounded-2xl border border-teal-500/20 text-slate-600 dark:text-slate-400">
        <p className="text-[10px] mono text-teal-800 dark:text-teal-300 font-bold uppercase tracking-widest flex items-center gap-1">
          <Info size={13} /> Transparent Public Works
        </p>
        <p className="text-[11px] leading-relaxed">
          The contractor pays nothing and neither does your budget — project walls are covered by the civic open transparency standard.
        </p>
      </div>
    </div>
  );
};
