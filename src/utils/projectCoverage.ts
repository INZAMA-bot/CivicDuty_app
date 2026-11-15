import { CountryCode, Project, TerritoryNode, UserSession } from '../types';
import { TERRITORY } from '../data/countries';

export type ProjectPerspective =
  | 'citizen'
  | 'contractor'
  | 'private_provider'
  | 'gov_lc1'
  | 'gov_parish'
  | 'gov_subcounty'
  | 'gov_district'
  | 'gov_agency'
  | 'gov_apex';

export interface ResolvedUserPerspective {
  perspective: ProjectPerspective;
  isGov: boolean;
  isPrivateProvider: boolean;
  isContractor: boolean;
  isCitizen: boolean;
  canCreatePublicContract: boolean;
  canCreateFacilityContract: boolean;
  canSignAwarder: boolean;
  canSignContractor: boolean;
  canAttestGrassroots: boolean;
  tierLabel: string;
  tierRank: number; // 0 = Citizen/LC1, 1 = Parish, 2 = Subcounty, 3 = District CAO, 4 = Agency, 5 = PS/Minister
  country: CountryCode;
  districtKeys: string[];
  subcountyKeys: string[];
  parishKeys: string[];
  villageKeys: string[];
}

export interface NormalizedProjectCoverage {
  visibilityScope: 'public_sovereign' | 'private_facility';
  country: CountryCode;
  districtIds: string[];
  districtNames: string[];
  subcountyIds: string[];
  subcountyNames: string[];
  parishIds: string[];
  parishNames: string[];
  villages: string[];
  corridorType: 'point_site' | 'multi_parish_corridor';
  hasGps: boolean;
  gpsLabel: string;
  corridorEndLabel?: string;
  gpsPoint?: { lat: number; lng: number; accuracyMeters?: number; label?: string };
  corridorEndGps?: { lat: number; lng: number; label?: string };
  allSearchableTokens: string[];
}

const norm = (val?: string | null): string =>
  (val || '')
    .toLowerCase()
    .replace(/\b(district|city|municipality|sub-?county|division|town council|parish|ward|cell|village)\b/gi, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const PRIVATE_ENTITY_DEPTS = new Set([
  'gayaza_hs',
  'namagunga',
  'cafe_javas',
  'makerere',
  'kampala_parents',
  'kampala_hosp',
  'stanbic',
  'centenary',
  'mtn_ug',
  'airtel_ug',
]);

export function inferProjectVisibilityScope(p: Project): 'public_sovereign' | 'private_facility' {
  if (p.visibilityScope) return p.visibilityScope;
  if (p.dept && PRIVATE_ENTITY_DEPTS.has(p.dept.toLowerCase())) {
    return 'private_facility';
  }
  return 'public_sovereign';
}

interface TerritoryLookup {
  district?: TerritoryNode;
  subcounty?: TerritoryNode;
  parish?: TerritoryNode;
}

export function lookupTerritoryAncestors(country: CountryCode, token: string): TerritoryLookup {
  const clean = norm(token);
  if (!token || !clean) return {};
  const tree = TERRITORY[country] || [];
  for (const dist of tree) {
    if (dist.id === token || norm(dist.name) === clean) {
      return { district: dist };
    }
    for (const sc of dist.children || []) {
      if (sc.id === token || norm(sc.name) === clean) {
        return { district: dist, subcounty: sc };
      }
      for (const par of sc.children || []) {
        if (par.id === token || norm(par.name) === clean) {
          return { district: dist, subcounty: sc, parish: par };
        }
      }
    }
  }
  return {};
}

export function getProjectCoverageSummary(project: Project): NormalizedProjectCoverage {
  const country = (project.country || 'UG') as CountryCode;
  const g = project.geotag || {};

  const districtIds = new Set<string>(g.districtIds || []);
  const districtNames = new Set<string>(g.districtNames || []);
  const subcountyIds = new Set<string>(g.subcountyIds || []);
  const subcountyNames = new Set<string>(g.subcountyNames || []);
  const parishIds = new Set<string>(g.parishIds || []);
  const parishNames = new Set<string>(g.parishNames || []);
  const villages = new Set<string>(g.villages || []);

  // Backfill missing ancestry from legacy units[] and loc
  for (const unit of project.units || []) {
    const match = lookupTerritoryAncestors(country, unit);
    if (match.district) {
      districtIds.add(match.district.id);
      districtNames.add(match.district.name);
    }
    if (match.subcounty) {
      subcountyIds.add(match.subcounty.id);
      subcountyNames.add(match.subcounty.name);
    }
    if (match.parish) {
      parishIds.add(match.parish.id);
      parishNames.add(match.parish.name);
    } else if (!match.subcounty && !match.district && unit) {
      parishIds.add(unit);
      parishNames.add(unit);
    }
  }

  // Fallback inference from kcca dept when units had Nakawa/Bukoto/Ntinda without districtIds
  if (districtIds.size === 0 && project.dept === 'kcca') {
    const kla = lookupTerritoryAncestors(country, 'kla');
    if (kla.district) {
      districtIds.add(kla.district.id);
      districtNames.add(kla.district.name);
    }
  }

  const gpsPoint = g.gpsPoint;
  const corridorEndGps = g.corridorEndGps;
  const hasGps = Boolean(gpsPoint && typeof gpsPoint.lat === 'number' && typeof gpsPoint.lng === 'number');
  const formatCoord = (pt: { lat: number; lng: number }) =>
    `${Math.abs(pt.lat).toFixed(4)}° ${pt.lat >= 0 ? 'N' : 'S'}, ${Math.abs(pt.lng).toFixed(4)}° ${pt.lng >= 0 ? 'E' : 'W'}`;

  const gpsLabel = hasGps
    ? gpsPoint?.label
      ? `${gpsPoint.label} (${formatCoord(gpsPoint!)})`
      : formatCoord(gpsPoint!)
    : 'Pending Field GPS Pin';

  const corridorEndLabel =
    corridorEndGps && typeof corridorEndGps.lat === 'number' && typeof corridorEndGps.lng === 'number'
      ? corridorEndGps.label
        ? `${corridorEndGps.label} (${formatCoord(corridorEndGps)})`
        : formatCoord(corridorEndGps)
      : undefined;

  const corridorType =
    g.corridorType ||
    (parishIds.size > 1 || parishNames.size > 1 || Boolean(corridorEndGps)
      ? 'multi_parish_corridor'
      : 'point_site');

  const allSearchableTokens = Array.from(
    new Set([
      ...districtIds,
      ...Array.from(districtNames).map(norm),
      ...subcountyIds,
      ...Array.from(subcountyNames).map(norm),
      ...parishIds,
      ...Array.from(parishNames).map(norm),
      ...Array.from(villages).map(norm),
      ...(project.units || []).map((u) => norm(u)),
      norm(project.loc),
    ].filter(Boolean))
  );

  return {
    visibilityScope: inferProjectVisibilityScope(project),
    country,
    districtIds: Array.from(districtIds),
    districtNames: Array.from(districtNames),
    subcountyIds: Array.from(subcountyIds),
    subcountyNames: Array.from(subcountyNames),
    parishIds: Array.from(parishIds),
    parishNames: Array.from(parishNames),
    villages: Array.from(villages),
    corridorType,
    hasGps,
    gpsLabel,
    corridorEndLabel,
    gpsPoint,
    corridorEndGps,
    allSearchableTokens,
  };
}

export function resolveUserProjectPerspective(user: UserSession | null): ResolvedUserPerspective {
  const country = (user?.country || 'UG') as CountryCode;

  if (!user || user.role === 'citizen') {
    const uDist = user?.district ? [user.district, norm(user.district)] : [];
    const uSub = user?.subcounty ? [user.subcounty, norm(user.subcounty)] : [];
    const uPar = [user?.parish, user?.parish_ward, user?.ward].filter(Boolean) as string[];
    const uVil = [user?.village, user?.grassroot].filter(Boolean) as string[];
    return {
      perspective: 'citizen',
      isGov: false,
      isPrivateProvider: false,
      isContractor: false,
      isCitizen: true,
      canCreatePublicContract: false,
      canCreateFacilityContract: false,
      canSignAwarder: false,
      canSignContractor: false,
      canAttestGrassroots: false,
      tierLabel: 'Citizen Watchdog',
      tierRank: 0,
      country,
      districtKeys: uDist,
      subcountyKeys: uSub,
      parishKeys: uPar.flatMap((x) => [x, norm(x)]),
      villageKeys: uVil.flatMap((x) => [x, norm(x)]),
    };
  }

  const isContractor = Boolean(
    user.entity_category === 'private_contractor' ||
      user.deskCode?.startsWith('PRJ-') ||
      user.deskCode?.startsWith('CTR-DEPOT') ||
      user.professional_identity?.toLowerCase().includes('contractor')
  );

  const isPrivateProvider = Boolean(
    !isContractor &&
      (user.entity_type === 'non_government_entity' ||
        (user.entity_category && !['government', 'private_contractor'].includes(user.entity_category)))
  );

  if (isContractor) {
    return {
      perspective: 'contractor',
      isGov: false,
      isPrivateProvider: false,
      isContractor: true,
      isCitizen: false,
      canCreatePublicContract: false,
      canCreateFacilityContract: false,
      canSignAwarder: false,
      canSignContractor: true,
      canAttestGrassroots: false,
      tierLabel: 'Appointed Contractor',
      tierRank: 0,
      country,
      districtKeys: [],
      subcountyKeys: [],
      parishKeys: [],
      villageKeys: [],
    };
  }

  if (isPrivateProvider) {
    return {
      perspective: 'private_provider',
      isGov: false,
      isPrivateProvider: true,
      isContractor: false,
      isCitizen: false,
      canCreatePublicContract: false,
      canCreateFacilityContract: true,
      canSignAwarder: true, // Owns their private facility procurement
      canSignContractor: false,
      canAttestGrassroots: false,
      tierLabel: user.organization_name || 'Private Provider',
      tierRank: 0,
      country,
      districtKeys: [user.branch_district || user.district || ''].filter(Boolean),
      subcountyKeys: [user.branch_subcounty || user.subcounty || ''].filter(Boolean),
      parishKeys: [user.branch_parish || user.parish || ''].filter(Boolean),
      villageKeys: [],
    };
  }

  // Government official — resolve tier & jurisdiction keys
  const titleStr = `${user.real_title_short || ''} ${user.role_label || ''} ${user.deskCode || ''} ${user.scope || ''}`.toLowerCase();

  const isMinister = Boolean(
    titleStr.includes('minister') || user.deskCode?.includes('-MIN')
  );
  const isApex = Boolean(
    isMinister ||
      user.role === 'platform_admin' ||
      user.hierarchy_level === 'tier5_perm_sec' ||
      user.is_superadmin ||
      titleStr.includes('permanent secretary') ||
      user.deskCode?.includes('PS-MOLG')
  );
  const isLc1 = Boolean(
    titleStr.includes('lc1') ||
      titleStr.includes('lc 1') ||
      titleStr.includes('village chair') ||
      titleStr.includes('vht')
  );
  const isParish = Boolean(
    !isLc1 &&
      (user.hierarchy_level === 'tier1_parish' ||
        user.escalation_rank === 1 ||
        titleStr.includes('parish chief') ||
        titleStr.includes('town agent') ||
        titleStr.includes('ward admin') ||
        titleStr.includes('parish'))
  );
  const isSubcounty = Boolean(
    user.hierarchy_level === 'tier2_subcounty' ||
      user.escalation_rank === 2 ||
      titleStr.includes('sub-county') ||
      titleStr.includes('subcounty') ||
      titleStr.includes('sas ') ||
      titleStr.includes('division town clerk') ||
      titleStr.includes('lc3')
  );
  const isDistrict = Boolean(
    user.hierarchy_level === 'tier3_district_cao' ||
      user.escalation_rank === 3 ||
      titleStr.includes('cao') ||
      titleStr.includes('town clerk') ||
      titleStr.includes('executive director') ||
      titleStr.includes('kcca') ||
      titleStr.includes('lc5') ||
      titleStr.includes('rdc')
  );
  const isAgency = Boolean(
    !isApex &&
      !isDistrict &&
      !isSubcounty &&
      !isParish &&
      !isLc1 &&
      (user.hierarchy_level === 'tier4_agency' || user.escalation_rank === 4 || user.is_utility)
  );

  // Extract explicit + scope-derived keys
  const districtKeys = new Set<string>();
  const subcountyKeys = new Set<string>();
  const parishKeys = new Set<string>();
  const villageKeys = new Set<string>();

  const addIf = (set: Set<string>, v?: string) => {
    if (v && v.trim() && v.toUpperCase() !== country) {
      set.add(v.trim());
      set.add(norm(v));
    }
  };

  addIf(districtKeys, user.district);
  addIf(subcountyKeys, user.subcounty);
  addIf(parishKeys, user.parish);
  addIf(parishKeys, user.parish_ward);
  addIf(villageKeys, user.village);
  addIf(villageKeys, user.grassroot);

  if (user.scope && user.scope !== country) {
    const anc = lookupTerritoryAncestors(country, user.scope);
    if (anc.district) {
      addIf(districtKeys, anc.district.id);
      addIf(districtKeys, anc.district.name);
    }
    if (anc.subcounty) {
      addIf(subcountyKeys, anc.subcounty.id);
      addIf(subcountyKeys, anc.subcounty.name);
    }
    if (anc.parish) {
      addIf(parishKeys, anc.parish.id);
      addIf(parishKeys, anc.parish.name);
    }
    if (!anc.district && !anc.subcounty && !anc.parish) {
      addIf(districtKeys, user.scope);
      addIf(parishKeys, user.scope);
    }
  }

  // Fallback well-known starter gov demo codes if district wasn't on user session
  if (districtKeys.size === 0 && (user.dept === 'kcca' || titleStr.includes('kampala') || titleStr.includes('nakasero'))) {
    addIf(districtKeys, 'kla');
    addIf(districtKeys, 'Kampala District');
  }
  if (districtKeys.size === 0 && titleStr.includes('wakiso')) {
    addIf(districtKeys, 'wjk');
    addIf(districtKeys, 'Wakiso District');
  }
  if (districtKeys.size === 0 && titleStr.includes('gulu')) {
    addIf(districtKeys, 'gulu_d');
    addIf(districtKeys, 'Gulu District');
  }
  if (districtKeys.size === 0 && titleStr.includes('mbarara')) {
    addIf(districtKeys, 'mbarara_c');
    addIf(districtKeys, 'Mbarara City');
  }
  if (districtKeys.size === 0 && titleStr.includes('jinja')) {
    addIf(districtKeys, 'ug_city_jinja_city');
    addIf(districtKeys, 'Jinja City');
  }
  if (districtKeys.size === 0 && titleStr.includes('mbale')) {
    addIf(districtKeys, 'ug_dist_mbale_district');
    addIf(districtKeys, 'Mbale District');
  }
  if (subcountyKeys.size === 0 && titleStr.includes('bardege')) {
    addIf(subcountyKeys, 'bardege');
    addIf(subcountyKeys, 'Bardege-Layibi Division');
  }
  if (subcountyKeys.size === 0 && titleStr.includes('central division')) {
    addIf(subcountyKeys, 'central');
    addIf(subcountyKeys, 'Central Division');
  }
  if (parishKeys.size === 0 && titleStr.includes('nakasero')) {
    addIf(parishKeys, 'nakasero');
    addIf(parishKeys, 'Nakasero Parish');
  }
  if (parishKeys.size === 0 && titleStr.includes('banda')) {
    addIf(parishKeys, 'banda');
    addIf(parishKeys, 'Banda Parish');
  }
  if (villageKeys.size === 0 && titleStr.includes('nakasero village')) {
    addIf(villageKeys, 'Nakasero Cell');
    addIf(villageKeys, 'Nakasero Village');
  }

  let perspective: ProjectPerspective = 'gov_district';
  let tierRank = 3;
  let tierLabel = user.real_title_short || 'District Oversight';

  if (isApex) {
    perspective = 'gov_apex';
    tierRank = 5;
    tierLabel = isMinister ? 'Tier 5 · Ministerial Oversight (Read-Only)' : 'Tier 5 · Permanent Secretary / National Rollup';
  } else if (isAgency) {
    perspective = 'gov_agency';
    tierRank = 4;
    tierLabel = `Tier 4 · Sector Agency (${(user.dept_label || user.dept || 'National').toUpperCase()})`;
  } else if (isDistrict) {
    perspective = 'gov_district';
    tierRank = 3;
    tierLabel = 'Tier 3 · District CAO / City Executive Coverage';
  } else if (isSubcounty) {
    perspective = 'gov_subcounty';
    tierRank = 2;
    tierLabel = 'Tier 2 · Sub-County / Division Supervision';
  } else if (isParish) {
    perspective = 'gov_parish';
    tierRank = 1;
    tierLabel = 'Tier 1 · Parish Chief / Ward Coverage';
  } else if (isLc1) {
    perspective = 'gov_lc1';
    tierRank = 0;
    tierLabel = 'LC1 / Village Ground Coverage';
  }

  const isReadOnly = user.role === 'read_only' || isMinister;

  return {
    perspective,
    isGov: true,
    isPrivateProvider: false,
    isContractor: false,
    isCitizen: false,
    canCreatePublicContract: !isReadOnly && (tierRank >= 2 || user.role === 'platform_admin'),
    canCreateFacilityContract: false,
    canSignAwarder: !isReadOnly && tierRank >= 2,
    canSignContractor: false,
    canAttestGrassroots: !isReadOnly && (isLc1 || isParish || isSubcounty),
    tierLabel,
    tierRank,
    country,
    districtKeys: Array.from(districtKeys),
    subcountyKeys: Array.from(subcountyKeys),
    parishKeys: Array.from(parishKeys),
    villageKeys: Array.from(villageKeys),
  };
}

function anyKeyMatches(projectTokens: string[], filterKeys: string[]): boolean {
  if (filterKeys.length === 0) return true;
  const cleanProject = new Set(projectTokens.map(norm).filter(Boolean));
  const rawProject = new Set(projectTokens.map((t) => t.toLowerCase()));
  return filterKeys.some((k) => {
    const ck = norm(k);
    const rk = k.toLowerCase();
    return rawProject.has(rk) || (ck && cleanProject.has(ck));
  });
}

export function doesProjectMatchFilters(
  project: Project,
  filters: {
    country?: CountryCode;
    district?: string;
    subcounty?: string;
    parish?: string;
    village?: string;
  }
): boolean {
  const cov = getProjectCoverageSummary(project);
  if (filters.country && project.country && project.country !== filters.country) {
    return false;
  }
  if (filters.district) {
    const dTokens = [...cov.districtIds, ...cov.districtNames];
    if (!anyKeyMatches(dTokens, [filters.district])) return false;
  }
  if (filters.subcounty) {
    const sTokens = [...cov.subcountyIds, ...cov.subcountyNames];
    if (!anyKeyMatches(sTokens, [filters.subcounty])) return false;
  }
  if (filters.parish) {
    const pTokens = [...cov.parishIds, ...cov.parishNames, ...(project.units || [])];
    if (!anyKeyMatches(pTokens, [filters.parish])) return false;
  }
  if (filters.village) {
    const vTokens = [...cov.villages, ...cov.parishNames, ...(project.units || [])];
    if (!anyKeyMatches(vTokens, [filters.village])) return false;
  }
  return true;
}

export function filterProjectsForUser(
  projects: Project[],
  user: UserSession | null,
  options?: {
    countryOverride?: CountryCode;
    districtFilter?: string;
    subcountyFilter?: string;
    parishFilter?: string;
    showPublicCorridorForPrivate?: boolean;
  }
): Project[] {
  const resolved = resolveUserProjectPerspective(user);
  const country = options?.countryOverride || resolved.country;

  const countryFiltered = projects.filter((p) => !p.country || p.country === country);

  let baseList: Project[];

  if (resolved.isPrivateProvider) {
    const ownOrg = (user?.organization_name || '').toLowerCase();
    const ownDept = (user?.dept || '').toLowerCase();
    baseList = countryFiltered.filter((p) => {
      const scope = inferProjectVisibilityScope(p);
      const isOwn =
        (ownDept && p.dept?.toLowerCase() === ownDept) ||
        (ownOrg && p.ownerOrgName?.toLowerCase() === ownOrg);
      if (isOwn) return true;
      if (options?.showPublicCorridorForPrivate && scope === 'public_sovereign') {
        if (resolved.parishKeys.length > 0) {
          const cov = getProjectCoverageSummary(p);
          return anyKeyMatches([...cov.parishIds, ...cov.parishNames, ...cov.districtNames], resolved.parishKeys);
        }
        return true;
      }
      return false;
    });
  } else if (resolved.isContractor) {
    const deskCode = (user?.deskCode || '').toUpperCase();
    const orgName = (user?.organization_name || user?.name || '').toLowerCase();
    baseList = countryFiltered.filter((p) => {
      if (deskCode && p.code?.toUpperCase() === deskCode) return true;
      if (orgName && p.contractor.toLowerCase().includes(orgName)) return true;
      if (user?.dept && p.dept === user.dept) return true;
      return inferProjectVisibilityScope(p) === 'public_sovereign';
    });
  } else if (resolved.isCitizen) {
    baseList = countryFiltered.filter((p) => inferProjectVisibilityScope(p) === 'public_sovereign');
  } else {
    // Government Hierarchy (LC1 -> Parish -> Sub-County -> District CAO -> Agency -> PS)
    const publicOnly = countryFiltered.filter((p) => inferProjectVisibilityScope(p) === 'public_sovereign');

    baseList = publicOnly.filter((p) => {
      const cov = getProjectCoverageSummary(p);
      if (resolved.perspective === 'gov_apex') return true;
      if (resolved.perspective === 'gov_agency') {
        // Agencies monitor their sector dept or same-territory sovereign projects
        if (user?.dept && p.dept === user.dept) return true;
        return resolved.districtKeys.length === 0 || anyKeyMatches([...cov.districtIds, ...cov.districtNames], resolved.districtKeys);
      }
      if (resolved.perspective === 'gov_district') {
        if (resolved.districtKeys.length === 0) return true;
        return anyKeyMatches([...cov.districtIds, ...cov.districtNames], resolved.districtKeys);
      }
      if (resolved.perspective === 'gov_subcounty') {
        if (resolved.subcountyKeys.length > 0) {
          return anyKeyMatches([...cov.subcountyIds, ...cov.subcountyNames], resolved.subcountyKeys);
        }
        if (resolved.districtKeys.length > 0) {
          return anyKeyMatches([...cov.districtIds, ...cov.districtNames], resolved.districtKeys);
        }
        return true;
      }
      if (resolved.perspective === 'gov_parish') {
        if (resolved.parishKeys.length > 0) {
          const pMatch = anyKeyMatches([...cov.parishIds, ...cov.parishNames, ...(p.units || [])], resolved.parishKeys);
          if (pMatch) return true;
        }
        // If demo parish chief is inspecting district without narrow parish match, fallback only if no parishKeys were set
        return resolved.parishKeys.length === 0;
      }
      if (resolved.perspective === 'gov_lc1') {
        if (resolved.villageKeys.length > 0 || resolved.parishKeys.length > 0) {
          return anyKeyMatches(
            [...cov.villages, ...cov.parishIds, ...cov.parishNames, ...(p.units || [])],
            [...resolved.villageKeys, ...resolved.parishKeys]
          );
        }
        return true;
      }
      return true;
    });
  }

  // Apply explicit UI drill-down filters (District / Sub-County / Parish)
  if (options?.districtFilter || options?.subcountyFilter || options?.parishFilter) {
    baseList = baseList.filter((p) =>
      doesProjectMatchFilters(p, {
        district: options.districtFilter || undefined,
        subcounty: options.subcountyFilter || undefined,
        parish: options.parishFilter || undefined,
      })
    );
  }

  return baseList;
}
