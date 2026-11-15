import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  HardHat,
  Plus,
  Copy,
  Check,
  Search,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Info,
  ListChecks,
  Briefcase,
  Lock,
  Landmark,
  MapPin,
  Navigation as NavPin,
  Layers,
  Eye,
  Compass,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CountryCode, Project, ProjectMilestone } from '../types';
import { COUNTRIES, TERRITORY } from '../data/countries';
import { SearchableSelect } from '../components/SearchableSelect';
import {
  filterProjectsForUser,
  getProjectCoverageSummary,
  resolveUserProjectPerspective,
} from '../utils/projectCoverage';

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

interface SelectedCoverageUnit {
  parishId: string;
  parishName: string;
  subcountyId: string;
  subcountyName: string;
  districtId: string;
  districtName: string;
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

const COUNTRY_DEFAULT_GPS: Record<string, { lat: number; lng: number }> = {
  UG: { lat: 0.3476, lng: 32.5825 },
  KE: { lat: -1.2864, lng: 36.8172 },
  RW: { lat: -1.9441, lng: 30.0619 },
  TZ: { lat: -6.7924, lng: 39.2083 },
  NG: { lat: 9.0765, lng: 7.3986 },
  GH: { lat: 5.6037, lng: -0.187 },
  ZA: { lat: -25.7479, lng: 28.2293 },
};

export const GovProjectsView: React.FC = () => {
  const { user, selectedCountry, projects, posts, addProject, addInvite, logAudit, toast, setActiveProject, go } = useApp();

  const perspective = useMemo(() => resolveUserProjectPerspective(user), [user]);
  const country = (user?.country || selectedCountry || 'UG') as CountryCode;
  const canManageContracts = perspective.canCreatePublicContract || perspective.canCreateFacilityContract;

  // Drill-down Location Filter State (for Citizen Near Me, Gov Leadership Supervision, and Search)
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterSubcounty, setFilterSubcounty] = useState<string>('');
  const [filterParish, setFilterParish] = useState<string>('');
  const [textFilter, setTextFilter] = useState<string>('');
  const [showPublicCorridorForPrivate, setShowPublicCorridorForPrivate] = useState<boolean>(false);

  // Seed citizen drilldown from onboarded district if available (optional quick preset)
  const [citizenFilterSeeded, setCitizenFilterSeeded] = useState(false);
  useEffect(() => {
    if (!citizenFilterSeeded && perspective.isCitizen && user?.district) {
      setCitizenFilterSeeded(true);
    }
  }, [citizenFilterSeeded, perspective.isCitizen, user?.district]);

  // Creation Form State
  const [creating, setCreating] = useState(false);
  const [visibilityScope, setVisibilityScope] = useState<'public_sovereign' | 'private_facility'>(
    perspective.isPrivateProvider ? 'private_facility' : 'public_sovereign'
  );
  const [corridorType, setCorridorType] = useState<'point_site' | 'multi_parish_corridor'>('multi_parish_corridor');
  const [contractor, setContractor] = useState('');
  const [title, setTitle] = useState('');
  const [tender, setTender] = useState('');
  const [value, setValue] = useState('');
  const [starts, setStarts] = useState('');
  const [completes, setCompletes] = useState('');

  // Structured Multi-Tier Geotagged Location Builder State
  const territoryTree = useMemo(() => TERRITORY[country] || [], [country]);
  const [pickDistrictId, setPickDistrictId] = useState<string>('');
  const [pickSubcountyId, setPickSubcountyId] = useState<string>('');
  const [pickParishId, setPickParishId] = useState<string>('');
  const [selectedUnits, setSelectedUnits] = useState<SelectedCoverageUnit[]>([]);
  const [villageDraft, setVillageDraft] = useState<string>('');
  const [villages, setVillages] = useState<string[]>([]);
  const [gpsLat, setGpsLat] = useState<string>('');
  const [gpsLng, setGpsLng] = useState<string>('');
  const [gpsLabel, setGpsLabel] = useState<string>('');
  const [endLat, setEndLat] = useState<string>('');
  const [endLng, setEndLng] = useState<string>('');
  const [endLabel, setEndLabel] = useState<string>('');
  const [locatingGps, setLocatingGps] = useState<boolean>(false);

  const [issued, setIssued] = useState<{ code: string; contractor: string; title: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Contract Milestones Builder State
  const [contractMilestones, setContractMilestones] = useState<ProjectMilestone[]>(DEFAULT_MILESTONES);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  useEffect(() => {
    setVisibilityScope(perspective.isPrivateProvider ? 'private_facility' : 'public_sovereign');
  }, [perspective.isPrivateProvider]);

  // Filter Bar Options
  const filterDistrictNode = useMemo(
    () => territoryTree.find((d) => d.id === filterDistrict || d.name === filterDistrict),
    [territoryTree, filterDistrict]
  );
  const filterSubcountyOptions = useMemo(
    () => (filterDistrictNode?.children || []).map((s) => ({ value: s.id, label: s.name })),
    [filterDistrictNode]
  );
  const filterSubcountyNode = useMemo(
    () => filterDistrictNode?.children?.find((s) => s.id === filterSubcounty || s.name === filterSubcounty),
    [filterDistrictNode, filterSubcounty]
  );
  const filterParishOptions = useMemo(
    () => (filterSubcountyNode?.children || []).map((p) => ({ value: p.id, label: p.name })),
    [filterSubcountyNode]
  );

  // Builder Cascade Options
  const builderDistrictNode = useMemo(
    () => territoryTree.find((d) => d.id === pickDistrictId || d.name === pickDistrictId),
    [territoryTree, pickDistrictId]
  );
  const builderSubcountyOptions = useMemo(
    () => (builderDistrictNode?.children || []).map((s) => ({ value: s.id, label: s.name })),
    [builderDistrictNode]
  );
  const builderSubcountyNode = useMemo(
    () => builderDistrictNode?.children?.find((s) => s.id === pickSubcountyId || s.name === pickSubcountyId),
    [builderDistrictNode, pickSubcountyId]
  );
  const builderParishOptions = useMemo(
    () =>
      (builderSubcountyNode?.children || [])
        .filter((p) => !selectedUnits.some((u) => u.parishId === p.id))
        .map((p) => ({ value: p.id, label: p.name })),
    [builderSubcountyNode, selectedUnits]
  );

  // Apply Multi-Tier Coverage + Role Isolation Filtering
  const visibleProjects = useMemo(() => {
    const base = filterProjectsForUser(projects, user, {
      countryOverride: country,
      districtFilter: filterDistrict,
      subcountyFilter: filterSubcounty,
      parishFilter: filterParish,
      showPublicCorridorForPrivate,
    });
    if (!textFilter.trim()) return base;
    const q = textFilter.trim().toLowerCase();
    return base.filter((p) => {
      const cov = getProjectCoverageSummary(p);
      return (
        p.title.toLowerCase().includes(q) ||
        p.contractor.toLowerCase().includes(q) ||
        (p.tender || '').toLowerCase().includes(q) ||
        (p.loc || '').toLowerCase().includes(q) ||
        cov.districtNames.some((d) => d.toLowerCase().includes(q)) ||
        cov.subcountyNames.some((s) => s.toLowerCase().includes(q)) ||
        cov.parishNames.some((pr) => pr.toLowerCase().includes(q)) ||
        cov.villages.some((v) => v.toLowerCase().includes(q))
      );
    });
  }, [projects, user, country, filterDistrict, filterSubcounty, filterParish, showPublicCorridorForPrivate, textFilter]);

  const handleAddParishCoverage = (parishIdOrCustom: string) => {
    if (!parishIdOrCustom.trim()) return;
    if (!builderDistrictNode || !builderSubcountyNode) {
      toast('Select a District and Sub-County first so government hierarchy coverage links cleanly.', 'amber');
      return;
    }
    const foundParish = builderSubcountyNode.children?.find(
      (p) => p.id === parishIdOrCustom || p.name.toLowerCase() === parishIdOrCustom.toLowerCase()
    );
    const unit: SelectedCoverageUnit = {
      parishId: foundParish?.id || `custom_${parishIdOrCustom.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
      parishName: foundParish?.name || parishIdOrCustom.trim(),
      subcountyId: builderSubcountyNode.id,
      subcountyName: builderSubcountyNode.name,
      districtId: builderDistrictNode.id,
      districtName: builderDistrictNode.name,
    };
    if (selectedUnits.some((u) => u.parishId === unit.parishId)) return;
    setSelectedUnits((prev) => [...prev, unit]);
    setPickParishId('');
  };

  const handleAddAllParishesInSubcounty = () => {
    if (!builderDistrictNode || !builderSubcountyNode) {
      toast('Select District and Sub-County first', 'amber');
      return;
    }
    const existingIds = new Set(selectedUnits.map((u) => u.parishId));
    const toAdd: SelectedCoverageUnit[] = (builderSubcountyNode.children || [])
      .filter((p) => !existingIds.has(p.id))
      .map((p) => ({
        parishId: p.id,
        parishName: p.name,
        subcountyId: builderSubcountyNode.id,
        subcountyName: builderSubcountyNode.name,
        districtId: builderDistrictNode.id,
        districtName: builderDistrictNode.name,
      }));
    if (toAdd.length === 0) {
      toast('All parishes in this Sub-County are already added.', 'amber');
      return;
    }
    setSelectedUnits((prev) => [...prev, ...toAdd]);
    toast(`Added ${toAdd.length} parishes from ${builderSubcountyNode.name}`, 'emerald');
  };

  const handleRemoveUnit = (parishId: string) => {
    setSelectedUnits((prev) => prev.filter((u) => u.parishId !== parishId));
  };

  const handleAddVillages = () => {
    const parts = villageDraft
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    setVillages((prev) => Array.from(new Set([...prev, ...parts])));
    setVillageDraft('');
  };

  const handlePinDeviceGps = () => {
    const fallback = COUNTRY_DEFAULT_GPS[country] || COUNTRY_DEFAULT_GPS.UG;
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setLocatingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocatingGps(false);
          setGpsLat(pos.coords.latitude.toFixed(5));
          setGpsLng(pos.coords.longitude.toFixed(5));
          if (!gpsLabel && selectedUnits[0]) {
            setGpsLabel(`${selectedUnits[0].parishName} Site Anchor`);
          }
          toast(`Live GPS locked (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`, 'emerald');
        },
        () => {
          setLocatingGps(false);
          // Graceful calibration fallback with small jitter for regional corridor
          const lat = (fallback.lat + (Math.random() - 0.5) * 0.02).toFixed(5);
          const lng = (fallback.lng + (Math.random() - 0.5) * 0.02).toFixed(5);
          setGpsLat(lat);
          setGpsLng(lng);
          if (!gpsLabel && selectedUnits[0]) {
            setGpsLabel(`${selectedUnits[0].parishName} Geotag`);
          }
          toast('Browser GPS unavailable — calibrated regional site coordinates (editable)', 'amber');
        },
        { timeout: 6000 }
      );
    } else {
      setGpsLat(fallback.lat.toFixed(5));
      setGpsLng(fallback.lng.toFixed(5));
      toast('Calibrated site coordinates — adjust lat/lng if needed', 'emerald');
    }
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

  const handleOpenWall = () => {
    if (!contractor.trim()) {
      toast('Name the contractor — the wall names them publicly', 'red');
      return;
    }
    if (!title.trim()) {
      toast('Describe the works', 'red');
      return;
    }
    if (selectedUnits.length === 0 && !builderDistrictNode) {
      toast('Select at least one District / Sub-County / Parish the works cover', 'red');
      return;
    }
    if (!completes) {
      toast('A completion date sets the defects window', 'red');
      return;
    }

    const parsedLat = parseFloat(gpsLat);
    const parsedLng = parseFloat(gpsLng);
    const hasValidGps = !Number.isNaN(parsedLat) && !Number.isNaN(parsedLng);

    if (!hasValidGps) {
      toast('Pin a GPS geotag (Lat/Lng) so leadership & citizens can verify the exact site on the map', 'red');
      return;
    }

    const parsedEndLat = parseFloat(endLat);
    const parsedEndLng = parseFloat(endLng);
    const hasEndGps = corridorType === 'multi_parish_corridor' && !Number.isNaN(parsedEndLat) && !Number.isNaN(parsedEndLng);

    const effectiveUnits =
      selectedUnits.length > 0
        ? selectedUnits
        : [
            {
              parishId: builderSubcountyNode?.id || builderDistrictNode!.id,
              parishName: builderSubcountyNode?.name || `${builderDistrictNode!.name} HQ`,
              subcountyId: builderSubcountyNode?.id || builderDistrictNode!.id,
              subcountyName: builderSubcountyNode?.name || 'District Wide',
              districtId: builderDistrictNode!.id,
              districtName: builderDistrictNode!.name,
            },
          ];

    const districtIds: string[] = Array.from(new Set<string>(effectiveUnits.map((u) => String(u.districtId))));
    const districtNames: string[] = Array.from(new Set<string>(effectiveUnits.map((u) => String(u.districtName))));
    const subcountyIds: string[] = Array.from(new Set<string>(effectiveUnits.map((u) => String(u.subcountyId))));
    const subcountyNames: string[] = Array.from(new Set<string>(effectiveUnits.map((u) => String(u.subcountyName))));
    const parishIds: string[] = Array.from(new Set<string>(effectiveUnits.map((u) => String(u.parishId))));
    const parishNames: string[] = Array.from(new Set<string>(effectiveUnits.map((u) => String(u.parishName))));

    const closesDate = new Date(completes);
    closesDate.setMonth(closesDate.getMonth() + 12);
    const closesIso = closesDate.toISOString().slice(0, 10);

    const projId = 'prj-' + Date.now();
    const deptPrefix = (user?.dept_label || user?.dept || 'WRK').replace(/\s+/g, '').toUpperCase().slice(0, 4);
    const generatedCode = makeCode(`PRJ-${deptPrefix}`);
    const curr = COUNTRIES[country]?.currency || 'USD';

    const locSummary = `${parishNames.slice(0, 3).join(', ')}${parishNames.length > 3 ? ` +${parishNames.length - 3} more` : ''} · ${districtNames.join(', ')}`;

    const newProject: Project = {
      id: projId,
      dept: user?.dept || 'kcca',
      country,
      loc: locSummary,
      visibilityScope,
      ownerOrgName: visibilityScope === 'private_facility' ? user?.organization_name || user?.dept_label : undefined,
      contractor: contractor.trim(),
      title: title.trim(),
      tender: tender.trim() || `TDR/${country}/${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      value: value.trim() || `${curr} 500m`,
      units: parishIds,
      starts: starts || new Date().toISOString().slice(0, 10),
      completes,
      closes: closesIso,
      status: 'active',
      code: generatedCode,
      geotag: {
        districtIds,
        districtNames,
        subcountyIds,
        subcountyNames,
        parishIds,
        parishNames,
        villages: villages.length > 0 ? villages : undefined,
        corridorType,
        gpsPoint: {
          lat: parsedLat,
          lng: parsedLng,
          label: gpsLabel.trim() || parishNames[0] || 'Project Site',
        },
        ...(hasEndGps
          ? {
              corridorEndGps: {
                lat: parsedEndLat,
                lng: parsedEndLng,
                label: endLabel.trim() || parishNames[parishNames.length - 1] || 'Corridor End',
              },
            }
          : {}),
      },
      milestones: contractMilestones.length > 0 ? contractMilestones : DEFAULT_MILESTONES,
    };

    addProject(newProject);

    addInvite({
      code: generatedCode,
      name: contractor.trim(),
      title: `${contractor.trim()} — ${title.trim()}`,
      role: 'spokesperson',
      scope: parishIds[0] || districtIds[0] || country,
      dept: user?.dept || 'kcca',
      is_utility: true,
      used: false,
      country,
    });

    logAudit(
      'open_project_wall',
      generatedCode,
      `Geotagged ${visibilityScope === 'public_sovereign' ? 'Public Contract' : 'Facility Upgrade'}: ${title.trim()} across ${parishNames.length} parish(es) in ${districtNames.join(', ')} (${parsedLat.toFixed(4)}, ${parsedLng.toFixed(4)}).`
    );

    setIssued({ code: generatedCode, contractor: contractor.trim(), title: title.trim() });
    toast(
      `Contract geotagged & broadcast to LC1 → Parish → Sub-County → ${districtNames[0]} CAO → PS ledger!`,
      'emerald'
    );

    // Reset form
    setContractor('');
    setTitle('');
    setTender('');
    setValue('');
    setStarts('');
    setCompletes('');
    setSelectedUnits([]);
    setVillages([]);
    setGpsLat('');
    setGpsLng('');
    setGpsLabel('');
    setEndLat('');
    setEndLng('');
    setEndLabel('');
    setContractMilestones(DEFAULT_MILESTONES);
    setCreating(false);
  };

  // Preview coverage stats during creation
  const previewDistrictCount = useMemo(
    () => new Set(selectedUnits.map((u) => u.districtId)).size || (builderDistrictNode ? 1 : 0),
    [selectedUnits, builderDistrictNode]
  );
  const previewSubcountyCount = useMemo(
    () => new Set(selectedUnits.map((u) => u.subcountyId)).size || (builderSubcountyNode ? 1 : 0),
    [selectedUnits, builderSubcountyNode]
  );

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-20 text-slate-800 dark:text-slate-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="text-[10px] mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5 flex-wrap">
            {perspective.isPrivateProvider ? <Briefcase size={13} /> : <Landmark size={13} />}
            <span>
              {perspective.isCitizen
                ? 'Citizen Works Radar · Geotagged Public Contracts'
                : perspective.isPrivateProvider
                ? 'Private Facility Upgrades & Vendor Ledger'
                : perspective.isContractor
                ? 'Contractor Execution & BoQ Ledger'
                : 'Geotagged Public Works · Multi-Tier Gov Coverage'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 text-[9.5px] font-bold">
              {perspective.tierLabel}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {perspective.isCitizen
              ? 'Public Works Near Me'
              : perspective.isPrivateProvider
              ? 'Facility Upgrades & Contracts'
              : 'Project Walls & Contracts'}
          </h2>
          <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {perspective.isPrivateProvider
              ? 'Track your organization’s construction, solar, water, and fit-out contracts privately without clutter from unrelated public tenders.'
              : perspective.isCitizen
              ? 'Filter taxpayer-funded roads, drainage, power, and water works by District, Sub-County, or Parish. Inspect verified site photos and flag premature defects.'
              : 'Every geotagged contract automatically cascades from LC1 Villages & Parish Chiefs up through Sub-County Chiefs, District CAOs, and the Permanent Secretary for zero blind-spot monitoring.'}
          </p>
        </div>

        {perspective.isCitizen && (
          <button
            type="button"
            onClick={() => go('depts')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-500 shrink-0 cursor-pointer"
          >
            ← Back to Service Desks
          </button>
        )}
      </div>

      {/* Geotagged Administrative Hierarchy Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Compass size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Filter by Geotagged Jurisdiction ({COUNTRIES[country]?.name || country})</span>
          </span>
          {(filterDistrict || filterSubcounty || filterParish || textFilter) && (
            <button
              type="button"
              onClick={() => {
                setFilterDistrict('');
                setFilterSubcounty('');
                setFilterParish('');
                setTextFilter('');
              }}
              className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <SearchableSelect
            value={filterDistrict}
            onChange={(val) => {
              setFilterDistrict(val);
              setFilterSubcounty('');
              setFilterParish('');
            }}
            emptyOptionLabel={`All Districts / Cities (${territoryTree.length})`}
            placeholder="All Districts / Cities"
            searchPlaceholder="Search District / City..."
            options={territoryTree.map((d) => ({
              value: d.id,
              label: d.name,
              sublabel: d.region || `${(d.children || []).length} sub-counties`,
            }))}
          />
          <SearchableSelect
            value={filterSubcounty}
            onChange={(val) => {
              setFilterSubcounty(val);
              setFilterParish('');
            }}
            disabled={!filterDistrict}
            emptyOptionLabel="All Sub-Counties / Divisions"
            placeholder="Sub-County / Division..."
            searchPlaceholder="Search Sub-County..."
            options={filterSubcountyOptions}
          />
          <SearchableSelect
            value={filterParish}
            onChange={(val) => setFilterParish(val)}
            disabled={!filterSubcounty}
            emptyOptionLabel="All Parishes / Wards"
            placeholder="Parish / Ward..."
            searchPlaceholder="Search Parish / Ward..."
            options={filterParishOptions}
          />
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={textFilter}
              onChange={(e) => setTextFilter(e.target.value)}
              placeholder="Title, contractor, LC1 village..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {perspective.isPrivateProvider && (
          <div className="pt-1 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
              Showing isolated contracts owned by <strong>{user?.organization_name || user?.dept_label || 'your organization'}</strong>.
            </span>
            <label className="flex items-center gap-1.5 text-[10.5px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showPublicCorridorForPrivate}
                onChange={(e) => setShowPublicCorridorForPrivate(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span>Also view nearby Public Roadworks affecting facility access</span>
            </label>
          </div>
        )}
      </div>

      {/* Issued Access Code Banner */}
      {issued && (
        <div className="card p-4 space-y-2 border border-amber-600/30 dark:border-amber-500/30 bg-amber-600/10 dark:bg-amber-500/10 rounded-2xl animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-teal-700 dark:text-teal-400" size={18} />
            <p className="text-[13px] font-bold text-teal-800 dark:text-teal-300">Geotagged Wall Opened &amp; Access Code Issued</p>
          </div>
          <p className="text-[9.5px] mono text-slate-700 dark:text-slate-300 uppercase tracking-widest pt-1 font-bold">
            {issued.contractor} — {issued.title}
          </p>
          <button
            onClick={() => handleCopyCode(issued.code)}
            className="flex items-center justify-between w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <span className="text-sm mono font-bold text-amber-800 dark:text-amber-300 tracking-widest">{issued.code}</span>
            <span className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 font-medium">
              {copied ? <Check size={14} className="text-teal-600 dark:text-teal-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </span>
          </button>
          <p className="text-[9.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Include this code in the tender award letter. The contractor logs in without subscription fees to post geotagged site progress.
          </p>
          <button
            onClick={() => setIssued(null)}
            className="text-[9.5px] mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 pt-1 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Button to toggle New Contract form */}
      {canManageContracts && !creating && (
        <button
          onClick={() => setCreating(true)}
          className="w-full bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold rounded-2xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          {perspective.isPrivateProvider
            ? 'Register New Geotagged Facility Upgrade'
            : 'Open Geotagged Wall for a New Public Contract'}
        </button>
      )}

      {/* New Geotagged Multi-Parish Contract Creation Form */}
      {creating && (
        <div className="card p-5 space-y-4 border border-amber-600/30 dark:border-amber-500/30 rounded-2xl bg-white dark:bg-slate-900/90 animate-fade-in shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-[11px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <HardHat size={15} /> Create Geotagged Contract Wall
            </p>
            <button
              onClick={() => setCreating(false)}
              className="text-[10px] mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Contract Scope & Corridor Geometry Switchers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[9.5px] font-mono font-bold uppercase text-slate-500 block">
                Visibility &amp; Governance Ledger
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-mono">
                <button
                  type="button"
                  onClick={() => setVisibilityScope('public_sovereign')}
                  className={`py-1.5 px-2 rounded-lg border font-bold cursor-pointer ${
                    visibilityScope === 'public_sovereign'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Public Works (All Gov Tiers)
                </button>
                <button
                  type="button"
                  onClick={() => setVisibilityScope('private_facility')}
                  className={`py-1.5 px-2 rounded-lg border font-bold cursor-pointer ${
                    visibilityScope === 'private_facility'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Private Facility Only
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-[9.5px] font-mono font-bold uppercase text-slate-500 block">
                Site Footprint Style
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-mono">
                <button
                  type="button"
                  onClick={() => setCorridorType('multi_parish_corridor')}
                  className={`py-1.5 px-2 rounded-lg border font-bold cursor-pointer ${
                    corridorType === 'multi_parish_corridor'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Multi-Parish Corridor
                </button>
                <button
                  type="button"
                  onClick={() => setCorridorType('point_site')}
                  className={`py-1.5 px-2 rounded-lg border font-bold cursor-pointer ${
                    corridorType === 'point_site'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Single Point Site
                </button>
              </div>
            </div>
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
              placeholder={country === 'RW' ? 'e.g. Gasabo Drainage Channel & Road Resurfacing Phase 1' : 'e.g. Nakawa–Bukoto Stormwater Culvert & Feeder Road Rehab'}
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
              <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Start Date</label>
              <input
                type="date"
                value={starts}
                onChange={(e) => setStarts(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9.5px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">Completion Date *</label>
              <input
                type="date"
                value={completes}
                onChange={(e) => setCompletes(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          {/* STRUCTURED MULTI-PARISH GEOTAGGING & GOVERNANCE CASCADE */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-[10px] mono text-emerald-800 dark:text-emerald-300 uppercase tracking-widest font-black flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Geotagged Multi-Parish &amp; Government Leadership Coverage *</span>
              </label>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold">
                LC1 → Parish → Sub-County → CAO → PS
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Pick the District, Sub-County, and add one or more Parishes (even across Sub-County or District borders for roads/pipelines). Pin GPS coordinates so every local leader up to the PS sees the live contract automatically.
            </p>

            {/* District -> Subcounty -> Multi-Parish Cascade */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <SearchableSelect
                value={pickDistrictId}
                onChange={(val) => {
                  setPickDistrictId(val);
                  setPickSubcountyId('');
                  setPickParishId('');
                }}
                placeholder="1. Search District / City..."
                searchPlaceholder={`Search all ${territoryTree.length} districts...`}
                options={territoryTree.map((d) => ({
                  value: d.id,
                  label: d.name,
                  sublabel: d.region || `${(d.children || []).length} divisions/sub-counties`,
                }))}
              />
              <SearchableSelect
                value={pickSubcountyId}
                onChange={(val) => {
                  setPickSubcountyId(val);
                  setPickParishId('');
                }}
                disabled={!pickDistrictId}
                placeholder="2. Sub-County / Division..."
                searchPlaceholder="Search Sub-County..."
                options={builderSubcountyOptions}
              />
              <SearchableSelect
                value={pickParishId}
                onChange={(val) => {
                  handleAddParishCoverage(val);
                }}
                disabled={!pickSubcountyId}
                allowCustom
                customLabelPrefix="+ Add Parish/Ward:"
                placeholder="3. + Add Parish / Ward..."
                searchPlaceholder="Search Parish to add..."
                options={builderParishOptions}
              />
            </div>

            {builderSubcountyNode && (builderSubcountyNode.children || []).length > 0 && (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-mono text-slate-500">
                  Selecting a Parish adds it to your multi-parish coverage list below.
                </span>
                <button
                  type="button"
                  onClick={handleAddAllParishesInSubcounty}
                  className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  + Add all parishes in {builderSubcountyNode.name}
                </button>
              </div>
            )}

            {/* Selected Multi-Parish Chips */}
            {selectedUnits.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[9.5px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase block">
                  Covered Parishes &amp; Ancestor Chains ({selectedUnits.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUnits.map((u) => (
                    <div
                      key={u.parishId}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-950 border border-emerald-500/40 text-[10.5px] font-mono"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">{u.parishName}</span>
                      <span className="text-slate-400">
                        ({u.subcountyName} › {u.districtName})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveUnit(u.parishId)}
                        className="text-rose-500 hover:text-rose-600 cursor-pointer"
                        title="Remove parish"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Villages / LC1 Cells Coverage */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9.5px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase block">
                Villages / LC1 Cells Covered (for LC1 Chairperson Visibility)
              </span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={villageDraft}
                  onChange={(e) => setVillageDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddVillages();
                    }
                  }}
                  placeholder="e.g. Bukoto Central Cell, Kisaasi Zone A (comma separated)"
                  className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddVillages}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-mono font-bold cursor-pointer"
                >
                  + Add LC1
                </button>
              </div>
              {villages.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {villages.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-semibold"
                    >
                      <span>{v}</span>
                      <button
                        type="button"
                        onClick={() => setVillages((prev) => prev.filter((x) => x !== v))}
                        className="hover:text-rose-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* GPS Geotag Coordinates */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <NavPin size={12} className="text-emerald-600" />
                  <span>{corridorType === 'multi_parish_corridor' ? 'Corridor Start GPS Pin *' : 'Exact Site GPS Pin *'}</span>
                </span>
                <button
                  type="button"
                  onClick={handlePinDeviceGps}
                  disabled={locatingGps}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <MapPin size={11} />
                  <span>{locatingGps ? 'Locating...' : 'Pin Device GPS'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={gpsLat}
                  onChange={(e) => setGpsLat(e.target.value)}
                  placeholder="Latitude (e.g. 0.3476)"
                  className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                />
                <input
                  type="text"
                  value={gpsLng}
                  onChange={(e) => setGpsLng(e.target.value)}
                  placeholder="Longitude (e.g. 32.5825)"
                  className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                />
                <input
                  type="text"
                  value={gpsLabel}
                  onChange={(e) => setGpsLabel(e.target.value)}
                  placeholder="Landmark (e.g. Junction 0+000)"
                  className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                />
              </div>

              {corridorType === 'multi_parish_corridor' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-[9.5px] font-mono font-bold uppercase text-slate-500 block">
                    Corridor End GPS Pin (Optional for Linear Roads / Pipelines)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={endLat}
                      onChange={(e) => setEndLat(e.target.value)}
                      placeholder="End Lat (e.g. 0.3620)"
                      className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={endLng}
                      onChange={(e) => setEndLng(e.target.value)}
                      placeholder="End Lng (e.g. 32.6010)"
                      className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={endLabel}
                      onChange={(e) => setEndLabel(e.target.value)}
                      placeholder="End Landmark (e.g. Outfall 4+200)"
                      className="bg-[#f8f9fa] dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Hierarchical Leadership Coverage Preview */}
            {visibilityScope === 'public_sovereign' && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-[10px] font-mono space-y-1">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase block">
                  Auto-Coverage Broadcast Preview:
                </span>
                <div className="flex items-center flex-wrap gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 font-bold">
                    LC1 ({villages.length || 'Host'} cell{villages.length === 1 ? '' : 's'})
                  </span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-bold">
                    Parish Chief ({selectedUnits.length} parish{selectedUnits.length === 1 ? '' : 'es'})
                  </span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold">
                    Sub-County ({previewSubcountyCount})
                  </span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 font-bold">
                    District CAO ({previewDistrictCount})
                  </span>
                  <span>→</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 font-bold">
                    PS / OPM Apex
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Milestones & Stage Deliverables Setup */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[10px] mono text-amber-800 dark:text-amber-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <ListChecks size={14} /> Contract Milestones &amp; Execution Stages
              </label>
              <span className="text-[9px] mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-600/30 px-2 py-0.5 rounded font-bold">
                {contractMilestones.length} Phases Defined
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {contractMilestones.map((m, idx) => (
                <div key={`${m.id}-${idx}`} className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-2 text-xs mono">
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-400 mr-2">
                      PHASE {idx + 1} · {m.date}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{m.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors shrink-0 cursor-pointer"
                    title="Remove milestone"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Custom Milestone Inputs */}
            <div className="grid grid-cols-3 gap-1.5">
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Add custom deliverable stage..."
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
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs px-3 rounded-xl flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Add milestone stage"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="flex-1 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono hover:border-slate-400 dark:hover:border-slate-700 transition-all font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleOpenWall}
              className="flex-1 bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold rounded-xl py-2.5 text-[10px] uppercase tracking-widest mono transition-all active:scale-[.98] shadow-sm cursor-pointer"
            >
              Publish Geotagged Wall &amp; Issue Code
            </button>
          </div>
        </div>
      )}

      {/* Contracts / Project Walls List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">
            {perspective.isPrivateProvider
              ? 'Registered Organization Upgrades'
              : perspective.isCitizen
              ? 'Geotagged Public Contracts & Tenders'
              : 'Monitored Geotagged Contracts & Project Walls'}
          </p>
          <span className="text-[10px] mono font-bold text-slate-500">{visibleProjects.length} visible in scope</span>
        </div>

        {visibleProjects.length === 0 ? (
          <div className="card p-6 text-center space-y-2 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
            <p className="text-[13px] mono font-bold text-slate-700 dark:text-slate-300">
              {perspective.isPrivateProvider
                ? 'No private facility upgrades registered yet for your organization.'
                : 'No geotagged contracts match this District / Sub-County / Parish filter.'}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {perspective.isPrivateProvider
                ? 'Click "Register New Geotagged Facility Upgrade" above to track vendor milestones privately, or enable nearby public roadworks above.'
                : 'Clear your location filter or create a new geotagged contract wall to assign coverage to local leadership.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleProjects.map((p) => {
              const daysLeft = daysUntil(p.closes);
              const cov = getProjectCoverageSummary(p);
              const projectReports = posts.filter(
                (post) => post.project === p.id || post.title.toLowerCase().includes(p.title.toLowerCase())
              );
              const unresolvedReports = projectReports.filter((post) => post.status !== 'resolved').length;
              const milestonesArr = p.milestones || [];
              const dualVerifiedCount = milestonesArr.filter(
                (m) => m.done || (m.awarderVerified && m.contractorVerified)
              ).length;
              const attestationsCount = (p.grassrootsAttestations || []).length;

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p);
                    go('project');
                  }}
                  className="card p-4 space-y-3 cursor-pointer hover:border-amber-600/50 transition-all active:scale-[.99] relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                        <span
                          className={`chip ${
                            cov.visibilityScope === 'private_facility'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-300 font-bold'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300 font-bold'
                          }`}
                        >
                          {cov.visibilityScope === 'private_facility' ? 'Private Facility Upgrade' : 'Public Sovereign Work'}
                        </span>
                        <span
                          className={`chip ${
                            p.status === 'defects'
                              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-300 font-bold'
                              : p.status === 'active'
                              ? 'ch-invest'
                              : 'ch-resolved'
                          }`}
                        >
                          {p.status === 'defects' ? '12-Mo Defects Liability (DLP)' : PROJECT_STATUS_LABELS[p.status] || p.status}
                        </span>
                        {cov.hasGps && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25">
                            <MapPin size={10} />
                            <span>{cov.gpsLabel}</span>
                          </span>
                        )}
                        {unresolvedReports > 0 && (
                          <span className="chip ch-overdue">
                            {unresolvedReports} pending report{unresolvedReports > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      <h3 className="text-[15px] font-black text-slate-900 dark:text-slate-100 leading-snug">{p.title}</h3>
                      <p className="text-[10.5px] mono text-slate-500 dark:text-slate-400 mt-0.5">
                        {p.contractor} {p.tender ? `· ${p.tender}` : ''}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-[8.5px] mono text-slate-500 uppercase font-bold">
                        {p.status === 'defects' ? 'Warranty Window' : 'Wall Closes'}
                      </p>
                      <p
                        className={`text-[11px] mono font-bold ${
                          daysLeft < 90 && daysLeft > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Closed'}
                      </p>
                    </div>
                  </div>

                  {/* Geotagged Administrative Hierarchy Coverage Pills */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-[10px] font-mono">
                    <div className="flex items-center justify-between flex-wrap gap-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap text-slate-700 dark:text-slate-300">
                        <Layers size={11} className="text-emerald-600 shrink-0" />
                        <span className="font-bold">
                          {cov.districtNames.length > 0 ? cov.districtNames.join(', ') : p.loc || 'National Scope'}
                        </span>
                        {cov.subcountyNames.length > 0 && (
                          <>
                            <span className="text-slate-400">›</span>
                            <span>{cov.subcountyNames.join(', ')}</span>
                          </>
                        )}
                        {cov.parishNames.length > 0 && (
                          <>
                            <span className="text-slate-400">›</span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-300">
                              {cov.parishNames.join(' · ')}
                            </span>
                          </>
                        )}
                      </div>
                      {cov.corridorType === 'multi_parish_corridor' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 font-bold">
                          Multi-Parish Corridor
                        </span>
                      )}
                    </div>

                    {cov.visibilityScope === 'public_sovereign' && (
                      <div className="flex items-center justify-between flex-wrap gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/80 text-[9px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Gov Coverage:</span>
                          <span>LC1 ({cov.villages.length || cov.parishNames.length || 1})</span>
                          <span>•</span>
                          <span>Parish Chief ({cov.parishNames.length || 1})</span>
                          <span>•</span>
                          <span>Sub-County ({cov.subcountyNames.length || 1})</span>
                          <span>•</span>
                          <span>CAO ({cov.districtNames.length || 1})</span>
                          <span>•</span>
                          <span>PS OPM ✓</span>
                        </div>
                        {attestationsCount > 0 && (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                            <CheckCircle2 size={10} /> {attestationsCount} Ground Check{attestationsCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[9.5px] mono">
                    <div>
                      <span className="text-slate-500 block">{p.status === 'defects' ? '5% Retention Escrow' : 'Value'}</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold">
                        {p.status === 'defects' ? '5% Held in Escrow' : p.value}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Milestones / Completion</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {milestonesArr.length > 0 ? `${dualVerifiedCount}/${milestonesArr.length} · ` : ''}
                        {p.completes}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{p.status === 'defects' ? 'Defects Radar' : 'Reports'}</span>
                      <span className="text-teal-700 dark:text-teal-400 font-bold">{projectReports.length} {p.status === 'defects' ? 'flagged' : 'filed'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/70 text-[8.5px] mono text-slate-500">
                    <span>Code: {p.code}</span>
                    <span className="text-teal-700 dark:text-teal-400 font-bold flex items-center gap-0.5">
                      Inspect Geotagged Wall <ChevronRight size={12} />
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
          <Info size={13} /> Transparent Public Works &amp; Geotagged Chain of Custody
        </p>
        <p className="text-[11px] leading-relaxed">
          The contractor pays nothing — geotagged contract walls sync automatically from LC1 Villages &amp; Parish Chiefs up to Sub-County Chiefs, District CAOs, and the Permanent Secretary.
        </p>
      </div>
    </div>
  );
};
