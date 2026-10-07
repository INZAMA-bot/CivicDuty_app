import { CountryCode, GovernanceTier, GovCodeData } from '../types';
import { TERRITORY, COUNTRIES } from './countries';

export const TIERS: Record<string, GovernanceTier[]> = {
  UG: [
    { depth: 0, tier: 'Country', unit: 'Uganda', title: 'Permanent Secretary, OPM', short: 'PS OPM', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'District', unit: 'District', title: 'Chief Administrative Officer', short: 'CAO', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'SubCounty', unit: 'SubCounty', title: 'SubCounty Chief', short: 'SC Chief', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Parish', unit: 'Parish', title: 'Parish Chief / LC II Chair', short: 'Parish Chief', role: 'spokesperson', sla: 48, primary: true },
  ],
  UG_city: [
    { depth: 0, tier: 'Country', unit: 'Uganda', title: 'Permanent Secretary, OPM', short: 'PS OPM', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'City', unit: 'City', title: 'City Town Clerk', short: 'Town Clerk', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Division', unit: 'Division', title: 'Division Town Clerk', short: 'Division TC', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Administrator', short: 'Ward Admin', role: 'spokesperson', sla: 48, primary: true },
  ],
  UG_municipal: [
    { depth: 0, tier: 'Country', unit: 'Uganda', title: 'Permanent Secretary, OPM', short: 'PS OPM', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'District', unit: 'District', title: 'Chief Administrative Officer', short: 'CAO', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Municipality', unit: 'Municipality', title: 'Town Clerk', short: 'Town Clerk', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Administrator', short: 'Ward Admin', role: 'spokesperson', sla: 48, primary: true },
  ],
  UG_capital: [
    { depth: 0, tier: 'Country', unit: 'Uganda', title: 'Minister for Kampala', short: 'Minister', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Authority', unit: 'Authority', title: 'Executive Director, KCCA', short: 'ED KCCA', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Division', unit: 'Division', title: 'Division Town Clerk', short: 'Division TC', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Administrator', short: 'Ward Admin', role: 'spokesperson', sla: 48, primary: true },
  ],
  KE: [
    { depth: 0, tier: 'Country', unit: 'Kenya', title: 'Principal Secretary', short: 'PS', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'County', unit: 'County', title: 'County Executive Committee Member', short: 'CECM', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'SubCounty', unit: 'SubCounty', title: 'SubCounty Administrator', short: 'SC Admin', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Administrator', short: 'Ward Admin', role: 'spokesperson', sla: 48, primary: true },
  ],
  NG: [
    { depth: 0, tier: 'Country', unit: 'Nigeria', title: 'Permanent Secretary', short: 'PS', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'State', unit: 'State', title: 'Commissioner for Local Government', short: 'Commissioner', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'LGA', unit: 'LGA', title: 'Local Government Chairman', short: 'LG Chairman', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Councillor', short: 'Councillor', role: 'spokesperson', sla: 48, primary: true },
  ],
  GH: [
    { depth: 0, tier: 'Country', unit: 'Ghana', title: 'Chief Director', short: 'Chief Dir.', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Region', unit: 'Region', title: 'Regional Coordinating Director', short: 'RCD', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'District', unit: 'District', title: 'District Chief Executive', short: 'DCE', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Community', unit: 'Community', title: 'Assembly Member', short: 'Assembly Mbr', role: 'spokesperson', sla: 48, primary: true },
  ],
  RW: [
    { depth: 0, tier: 'Country', unit: 'Rwanda', title: 'Permanent Secretary', short: 'PS', role: 'platform_admin', sla: 144 },
    { depth: 1, tier: 'Province', unit: 'Province', title: 'Governor', short: 'Governor', role: 'node_admin', sla: 120 },
    { depth: 2, tier: 'District', unit: 'District', title: 'Mayor', short: 'Mayor', role: 'node_admin', sla: 96 },
    { depth: 3, tier: 'Sector', unit: 'Sector', title: 'Sector Executive Secretary', short: 'Sector ES', role: 'node_admin', sla: 72 },
    { depth: 4, tier: 'Cell', unit: 'Cell', title: 'Cell Executive Secretary', short: 'Cell ES', role: 'spokesperson', sla: 48, primary: true },
  ],
  TZ: [
    { depth: 0, tier: 'Country', unit: 'Tanzania', title: 'Permanent Secretary, TAMISEMI', short: 'PS TAMISEMI', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Region', unit: 'Region', title: 'Regional Commissioner (RC)', short: 'RC', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'District', unit: 'District Council', title: 'District Executive Director (DED)', short: 'DED', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Executive Officer (WEO)', short: 'WEO', role: 'spokesperson', sla: 48, primary: true },
  ],
  ZA: [
    { depth: 0, tier: 'Country', unit: 'South Africa', title: 'Director-General, COGTA', short: 'DG COGTA', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Province', unit: 'Province', title: 'Provincial Head of Department', short: 'HoD', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Municipality', unit: 'Municipality', title: 'Municipal Manager', short: 'MM', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Councillor / Officer', short: 'Ward Admin', role: 'spokesperson', sla: 48, primary: true },
  ],
  ET: [
    { depth: 0, tier: 'Country', unit: 'Ethiopia', title: 'State Minister, MoUDC', short: 'State Min.', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Region', unit: 'Region', title: 'Regional Bureau Head', short: 'Bureau Head', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Woreda', unit: 'Woreda', title: 'Woreda Administrator', short: 'Woreda Admin', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Kebele', unit: 'Kebele', title: 'Kebele Administrator', short: 'Kebele Admin', role: 'spokesperson', sla: 48, primary: true },
  ],
  EG: [
    { depth: 0, tier: 'Country', unit: 'Egypt', title: 'Deputy Minister, Local Dev.', short: 'Deputy Min.', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Governorate', unit: 'Governorate', title: 'Governor / Secretary-General', short: 'Governor', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Markaz', unit: 'Markaz / City', title: 'Markaz / District Chief', short: 'District Chief', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Local Unit', title: 'Local Unit Chief / Sheikha Officer', short: 'Local Officer', role: 'spokesperson', sla: 48, primary: true },
  ],
  SN: [
    { depth: 0, tier: 'Country', unit: 'Senegal', title: 'Directeur Général, CNDT', short: 'DG CNDT', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Region', unit: 'Région', title: 'Gouverneur de Région', short: 'Gouverneur', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Department', unit: 'Département', title: 'Préfet de Département', short: 'Préfet', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Commune', unit: 'Commune', title: 'Maire / Chef de Commune', short: 'Maire', role: 'spokesperson', sla: 48, primary: true },
  ],
  ZM: [
    { depth: 0, tier: 'Country', unit: 'Zambia', title: 'Permanent Secretary, Local Govt', short: 'PS MLGH', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Province', unit: 'Province', title: 'Provincial Local Govt Officer', short: 'PLGO', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'District', unit: 'District Council', title: 'Council Secretary / Town Clerk', short: 'Town Clerk', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Development Committee Chair', short: 'WDC Chair', role: 'spokesperson', sla: 48, primary: true },
  ],
  ZW: [
    { depth: 0, tier: 'Country', unit: 'Zimbabwe', title: 'Permanent Secretary, Local Govt', short: 'PS MLGP', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Province', unit: 'Province', title: 'Provincial Provincial Director', short: 'Prov Dir.', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Council', unit: 'District Council', title: 'CEO / Town Clerk', short: 'CEO', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Executive Officer', short: 'WEO', role: 'spokesperson', sla: 48, primary: true },
  ],
  US: [
    { depth: 0, tier: 'Country', unit: 'United States', title: 'Federal / State Secretary', short: 'Secretary', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'State', unit: 'State / County', title: 'County Executive / Mayor', short: 'County Exec', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'City', unit: 'City / Municipality', title: 'City Manager / Commissioner', short: 'City Mgr', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'District', unit: 'Neighborhood District', title: 'Advisory Neighborhood Commissioner', short: 'ANC Chair', role: 'spokesperson', sla: 48, primary: true },
  ],
  GB: [
    { depth: 0, tier: 'Country', unit: 'United Kingdom', title: 'Permanent Secretary, DLUHC', short: 'PS DLUHC', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'Council', unit: 'Borough / County', title: 'Chief Executive, Council', short: 'Chief Exec', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'District', unit: 'District / Parish', title: 'Parish / Town Clerk', short: 'Town Clerk', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward', unit: 'Ward', title: 'Ward Councillor / Officer', short: 'Ward Officer', role: 'spokesperson', sla: 48, primary: true },
  ],
  IN: [
    { depth: 0, tier: 'Country', unit: 'India', title: 'Ministry Secretary, MoPR', short: 'Secretary', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'State', unit: 'State / UT', title: 'District Collector / Magistrate (DM)', short: 'District Collector', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'Block', unit: 'Block Council', title: 'Block Development Officer (BDO)', short: 'BDO', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Panchayat', unit: 'Gram Panchayat', title: 'Gram Panchayat Secretary / Sarpanch', short: 'Panchayat Sec.', role: 'spokesperson', sla: 48, primary: true },
  ],
};

export const CAPITAL_ROOTS: Partial<Record<CountryCode, string>> = { UG: 'kla' };

export function depthOf(country: CountryCode, scope?: string): number {
  if (!scope || scope === country) return 0;
  const walk = (nodes: any[], d: number): number | null => {
    for (const n of nodes || []) {
      if (n.id === scope) return d;
      const found = walk(n.children, d + 1);
      if (found !== null) return found;
    }
    return null;
  };
  const d = walk(TERRITORY[country], 1);
  return d === null ? 0 : d;
}

export function variantRoot(country: CountryCode, scope?: string): string | null {
  if (!scope) return null;
  const cap = CAPITAL_ROOTS[country];
  if (scope === cap) return 'capital';
  let found: string | null = null;
  const walk = (nodes: any[], inherited: string | null): boolean => {
    for (const n of nodes || []) {
      const here = n.id === cap ? 'capital' : n.variant || inherited;
      if (n.id === scope) {
        found = here || null;
        return true;
      }
      if (walk(n.children, here)) return true;
    }
    return false;
  };
  walk(TERRITORY[country], null);
  return found;
}

export function tiersFor(country: CountryCode, scope?: string): GovernanceTier[] {
  const v = variantRoot(country, scope);
  if (v && TIERS[country + '_' + v]) return TIERS[country + '_' + v];
  if (TIERS[country]) return TIERS[country];

  // Sovereign country fallback structure
  return [
    { depth: 0, tier: 'Country', unit: 'National Ministry', title: 'National Platform Administrator', short: 'National Admin', role: 'platform_admin', sla: 120 },
    { depth: 1, tier: 'State / Province', unit: 'Province / State', title: 'Regional Operations Director', short: 'Regional Dir', role: 'node_admin', sla: 96 },
    { depth: 2, tier: 'District / Municipality', unit: 'District / Council', title: 'Municipal Administrator / Town Engineer', short: 'District Admin', role: 'node_admin', sla: 72 },
    { depth: 3, tier: 'Ward / Parish', unit: 'Ward / Parish', title: 'Ward / Parish Chief Officer', short: 'Local Chief', role: 'spokesperson', sla: 48, primary: true },
  ];
}

export function primaryTier(country: CountryCode, scope?: string): GovernanceTier | null {
  return tiersFor(country, scope).find((t) => t.primary) || null;
}

export function primaryUnit(country: CountryCode, scope?: string): string {
  return primaryTier(country, scope)?.unit || 'Node';
}

export function escalationFor(country: CountryCode, scope?: string): GovernanceTier[] {
  return tiersFor(country, scope)
    .filter((t) => t.depth > 0)
    .sort((a, b) => b.depth - a.depth);
}

export function primaryNodes(country: CountryCode, scope?: string) {
  const list: { id: string; name: string; path: string }[] = [];
  const dists = TERRITORY[country] || [];
  for (const d of dists) {
    if (scope && d.id !== scope) continue;
    for (const s of d.children || []) {
      for (const p of s.children || []) {
        list.push({ id: p.id, name: p.name, path: `${d.name} › ${s.name} › ${p.name}` });
      }
    }
  }
  return list;
}

export function scopeName(country: CountryCode, scope?: string): string {
  if (!scope) return 'National Scope';
  const walk = (nodes: any[]): string | null => {
    for (const n of nodes || []) {
      if (n.id === scope) return n.name;
      const sub = walk(n.children);
      if (sub) return `${sub} (${n.name})`;
    }
    return null;
  };
  return walk(TERRITORY[country]) || scope;
}

export function roleTreeFor(country: CountryCode, scope?: string) {
  const t = tiersFor(country, scope);
  const roleName: Record<string, string> = {
    platform_admin: 'Platform Admin',
    node_admin: 'Node Admin',
    spokesperson: 'Spokesperson',
    read_only: 'Read-Only',
  };
  return [
    ...t.map((x) => ({
      level: 'L' + (x.depth + 1),
      title: x.title,
      role: roleName[x.role] + (x.primary ? ' ← Primary' : ''),
      scope: x.tier,
    })),
    { level: 'RO', title: 'Oversight — RDC / Inspector / Council / Media', role: 'Read-Only', scope: 'Any node' },
  ];
}

export interface QuickTitlePreset {
  id: string;
  label: string;
  title: string;
  role: 'platform_admin' | 'node_admin' | 'spokesperson' | 'read_only';
  isUtility: boolean;
  desc?: string;
}

export function getQuickTitlePresets(country: CountryCode, scope?: string): QuickTitlePreset[] {
  const tiers = tiersFor(country, scope);
  const primary = primaryTier(country, scope);
  const l2Tier = tiers.find((t) => t.depth === 1) || tiers[0];
  const l3Tier = tiers.find((t) => t.depth === 2) || tiers[1] || l2Tier;

  switch (country) {
    case 'KE':
      return [
        { id: 'sc_admin', label: '+ SubCounty Admin', title: 'SubCounty Administrator', role: 'node_admin', isUtility: false, desc: 'Sub-County Desk' },
        { id: 'cecm', label: '+ County CECM', title: 'County Executive Committee Member (CECM)', role: 'node_admin', isUtility: false, desc: 'County HQ' },
        { id: 'ward_admin', label: '+ Ward Admin', title: 'Ward Administrator', role: 'spokesperson', isUtility: false, desc: 'Grassroots Ward Desk' },
        { id: 'works', label: '+ County Works Dir', title: 'County Director of Roads & Infrastructure', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'util', label: '+ KPLC / Water Mgr', title: 'Area Power / Water Manager (KPLC / Nairobi Water)', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ EACC / Auditor', title: 'County Auditor / EACC Oversight Officer', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'NG':
      return [
        { id: 'lga_chair', label: '+ LGA Chairman', title: 'Local Government Area Chairman', role: 'node_admin', isUtility: false, desc: 'LGA Desk' },
        { id: 'commissioner', label: '+ State Commissioner', title: 'Commissioner for Local Government', role: 'node_admin', isUtility: false, desc: 'State HQ' },
        { id: 'councillor', label: '+ Ward Councillor', title: 'Ward Councillor', role: 'spokesperson', isUtility: false, desc: 'Grassroots Ward Desk' },
        { id: 'works', label: '+ Works & LAWMA Dir', title: 'Director of Public Works & Infrastructure', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'disco', label: '+ DisCo / Water Mgr', title: 'DisCo Power / State Water Area Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'icpc', label: '+ ICPC / Auditor', title: 'State Auditor / ICPC Anti-Corruption Officer', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'GH':
      return [
        { id: 'dce', label: '+ DCE / MCE', title: 'District Chief Executive (DCE)', role: 'node_admin', isUtility: false, desc: 'MMDA Executive' },
        { id: 'rcd', label: '+ Regional Dir', title: 'Regional Coordinating Director', role: 'node_admin', isUtility: false, desc: 'Regional HQ' },
        { id: 'assembly', label: '+ Assembly Member', title: 'Assembly Member / Electoral Area Chair', role: 'spokesperson', isUtility: false, desc: 'Grassroots Desk' },
        { id: 'works', label: '+ Urban Roads Head', title: 'Head of Urban Roads & Public Works', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'ecg', label: '+ ECG / GWCL Mgr', title: 'ECG Power / Ghana Water District Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'osp', label: '+ OSP / Auditor', title: 'District Auditor / OSP Officer', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'RW':
      return [
        { id: 'sector_es', label: '+ Sector ES', title: 'Sector Executive Secretary (Umurenge)', role: 'node_admin', isUtility: false, desc: 'Sector Desk' },
        { id: 'mayor', label: '+ District Mayor', title: 'District Mayor (Akarere)', role: 'node_admin', isUtility: false, desc: 'District HQ' },
        { id: 'cell_es', label: '+ Cell ES', title: 'Cell Executive Secretary (Akagari)', role: 'spokesperson', isUtility: false, desc: 'Grassroots Cell Desk' },
        { id: 'infra', label: '+ Infrastructure Chief', title: 'District Infrastructure & Sanitation Lead', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'reg', label: '+ REG / WASAC Mgr', title: 'REG Power / WASAC Water Branch Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'ombuds', label: '+ Ombudsman / Audit', title: 'Ombudsman Officer / District Auditor', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'TZ':
      return [
        { id: 'ded', label: '+ District Director', title: 'District Executive Director (DED)', role: 'node_admin', isUtility: false, desc: 'Council Desk' },
        { id: 'rc', label: '+ Regional Comm.', title: 'Regional Commissioner (RC)', role: 'node_admin', isUtility: false, desc: 'Regional HQ' },
        { id: 'weo', label: '+ Ward Officer (WEO)', title: 'Ward Executive Officer (WEO)', role: 'spokesperson', isUtility: false, desc: 'Grassroots Ward Desk' },
        { id: 'tarura', label: '+ TARURA Engineer', title: 'TARURA Council Roads Engineer', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'tanesco', label: '+ TANESCO / Water Mgr', title: 'TANESCO Power / DAWASA Water Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'takukuru', label: '+ TAKUKURU Auditor', title: 'Council Auditor / TAKUKURU Inspector', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'ZA':
      return [
        { id: 'mm', label: '+ Municipal Manager', title: 'Municipal Manager', role: 'node_admin', isUtility: false, desc: 'Metro/District Desk' },
        { id: 'hod', label: '+ Provincial HoD', title: 'Provincial Head of Department', role: 'node_admin', isUtility: false, desc: 'Provincial HQ' },
        { id: 'ward_cllr', label: '+ Ward Councillor', title: 'Ward Councillor / Officer', role: 'spokesperson', isUtility: false, desc: 'Grassroots Ward Desk' },
        { id: 'depot', label: '+ Depot Chief', title: 'Municipal Depot Chief Engineer', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'eskom', label: '+ Eskom / Water Mgr', title: 'Eskom Power / Joburg Water Depot Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'siu', label: '+ SIU / Auditor', title: 'Municipal Auditor / SIU Officer', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'ET':
      return [
        { id: 'woreda', label: '+ Woreda Admin', title: 'Woreda Administrator', role: 'node_admin', isUtility: false, desc: 'Woreda Desk' },
        { id: 'bureau', label: '+ Regional Bureau Head', title: 'Regional Bureau Head', role: 'node_admin', isUtility: false, desc: 'Regional HQ' },
        { id: 'kebele', label: '+ Kebele Admin', title: 'Kebele Administrator', role: 'spokesperson', isUtility: false, desc: 'Grassroots Kebele Desk' },
        { id: 'works', label: '+ Infrastructure Dir', title: 'Director of Urban Infrastructure & Roads', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'util', label: '+ EEU / Water Mgr', title: 'Ethiopian Electric / Water Service Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ Ethics Auditor', title: 'Regional Auditor / Ethics Officer', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'EG':
      return [
        { id: 'markaz', label: '+ District Chief', title: 'Markaz / District Chief', role: 'node_admin', isUtility: false, desc: 'District Desk' },
        { id: 'gov', label: '+ Governorate Exec', title: 'Governorate Secretary-General', role: 'node_admin', isUtility: false, desc: 'Governorate HQ' },
        { id: 'local_unit', label: '+ Local Unit Chief', title: 'Local Unit Chief / Sheikha Officer', role: 'spokesperson', isUtility: false, desc: 'Grassroots Local Desk' },
        { id: 'eng', label: '+ Municipal Lead', title: 'Director of Housing & Public Works', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'eehc', label: '+ EEHC / Water Mgr', title: 'Electricity & Water Station Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ Govt Inspector', title: 'Local Government Inspector', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'SN':
      return [
        { id: 'prefet', label: '+ Préfet Admin', title: 'Préfet de Département', role: 'node_admin', isUtility: false, desc: 'Department Desk' },
        { id: 'gouverneur', label: '+ Gouverneur', title: 'Gouverneur de Région', role: 'node_admin', isUtility: false, desc: 'Regional HQ' },
        { id: 'maire', label: '+ Maire / Commune', title: 'Maire / Chef de Commune', role: 'spokesperson', isUtility: false, desc: 'Grassroots Commune Desk' },
        { id: 'works', label: '+ Chef de Travaux', title: 'Directeur des Services Techniques', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'senelec', label: '+ Senelec / SDE Mgr', title: 'Responsable Senelec / Eau du Sénégal', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ Auditeur Régional', title: 'Inspecteur Régional / Auditeur', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'ZM':
      return [
        { id: 'town_clerk', label: '+ Council Secretary', title: 'Council Secretary / Town Clerk', role: 'node_admin', isUtility: false, desc: 'Council Desk' },
        { id: 'plgo', label: '+ Provincial Officer', title: 'Provincial Local Government Officer', role: 'node_admin', isUtility: false, desc: 'Provincial HQ' },
        { id: 'wdc', label: '+ WDC Chair', title: 'Ward Development Committee Chair', role: 'spokesperson', isUtility: false, desc: 'Grassroots Ward Desk' },
        { id: 'engineer', label: '+ Director of Eng.', title: 'Director of Engineering Services', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'zesco', label: '+ ZESCO / Water Mgr', title: 'ZESCO Power / Water Utility Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ Council Auditor', title: 'District Auditor / ACC Officer', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'ZW':
      return [
        { id: 'ceo', label: '+ Council CEO', title: 'CEO / Town Clerk', role: 'node_admin', isUtility: false, desc: 'Council Desk' },
        { id: 'prov_dir', label: '+ Provincial Dir', title: 'Provincial Director', role: 'node_admin', isUtility: false, desc: 'Provincial HQ' },
        { id: 'weo', label: '+ Ward Exec Officer', title: 'Ward Executive Officer (WEO)', role: 'spokesperson', isUtility: false, desc: 'Grassroots Ward Desk' },
        { id: 'eng', label: '+ Town Engineer', title: 'Town & Infrastructure Engineer', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'zetdc', label: '+ ZETDC / Water Mgr', title: 'ZETDC Power / Zinwa Water Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ ZACC / Auditor', title: 'Council Auditor / ZACC Inspector', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'US':
      return [
        { id: 'city_mgr', label: '+ City Manager', title: 'City Manager / Commissioner', role: 'node_admin', isUtility: false, desc: 'City Desk' },
        { id: 'county_exec', label: '+ County Executive', title: 'County Executive / Mayor', role: 'node_admin', isUtility: false, desc: 'County HQ' },
        { id: 'anc_chair', label: '+ ANC Chair / Rep', title: 'Advisory Neighborhood Commissioner', role: 'spokesperson', isUtility: false, desc: 'Grassroots Desk' },
        { id: 'dpw', label: '+ Public Works Dir', title: 'Director of Public Works & Transportation', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'util', label: '+ Electric / Water Mgr', title: 'Utility Manager (Power & Water District)', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ Inspector General', title: 'City Auditor / Inspector General', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'GB':
      return [
        { id: 'chief_exec', label: '+ Council Chief Exec', title: 'Chief Executive, Council', role: 'node_admin', isUtility: false, desc: 'Council HQ' },
        { id: 'town_clerk', label: '+ Town / Parish Clerk', title: 'Parish / Town Clerk', role: 'node_admin', isUtility: false, desc: 'Town Desk' },
        { id: 'councillor', label: '+ Ward Officer', title: 'Ward Councillor / Officer', role: 'spokesperson', isUtility: false, desc: 'Grassroots Ward Desk' },
        { id: 'highways', label: '+ Highways Head', title: 'Head of Highways & Environment', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'util', label: '+ Grid / Water Mgr', title: 'National Grid / Water Board Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ Council Ombudsman', title: 'Local Government Ombudsman / Auditor', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'IN':
      return [
        { id: 'bdo', label: '+ Block Dev Officer', title: 'Block Development Officer (BDO)', role: 'node_admin', isUtility: false, desc: 'Block Desk' },
        { id: 'collector', label: '+ District Collector', title: 'District Collector / Magistrate (DM)', role: 'node_admin', isUtility: false, desc: 'District HQ' },
        { id: 'sarpanch', label: '+ Panchayat Sec.', title: 'Gram Panchayat Secretary / Sarpanch', role: 'spokesperson', isUtility: false, desc: 'Grassroots Panchayat Desk' },
        { id: 'pwd', label: '+ PWD Exec Engineer', title: 'PWD Executive Engineer (Roads & Water)', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'discom', label: '+ Discom / Jal Mgr', title: 'State Discom Power / Jal Board Manager', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ Lokayukta Auditor', title: 'District Auditor / Lokayukta Inspector', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];

    case 'UG':
    default:
      return [
        { id: 'sc_chief', label: '+ SubCounty Chief', title: l3Tier?.title || 'SubCounty Chief', role: 'node_admin', isUtility: false, desc: 'Sub-County Level Admin' },
        { id: 'town_clerk', label: '+ Town Clerk', title: 'Division Town Clerk', role: 'node_admin', isUtility: false, desc: 'Urban Division Admin' },
        { id: 'parish_chief', label: '+ Parish Chief', title: primary?.title || 'Parish Chief', role: 'spokesperson', isUtility: false, desc: 'Grassroots Local Desk' },
        { id: 'eng', label: '+ Head of Engineering', title: 'Head of Engineering & Public Works', role: 'spokesperson', isUtility: false, desc: 'Department Lead' },
        { id: 'util', label: '+ Utility Manager', title: 'Area Water/Power Engineer (Umeme / NWSC)', role: 'spokesperson', isUtility: true, desc: 'Utility Desk' },
        { id: 'audit', label: '+ Oversight / RDC', title: 'District Auditor / RDC Officer', role: 'read_only', isUtility: false, desc: 'Oversight' },
      ];
  }
}

export function resolveTitle(scope: string, country: CountryCode, is_util?: boolean) {
  const tiers = tiersFor(country, scope);
  if (!tiers.length) return { role_label: 'Gov Official', short: 'GOV', scope_label: scope };
  const d = depthOf(country, scope);
  const tier = tiers.find((t) => t.depth === d) || tiers[tiers.length - 1];
  if (is_util) {
    const utilTitles: Record<string, { role_label: string; short: string }> = {
      KE: { role_label: 'Kenya Power Area Lead / Station Engineer', short: 'Area Lead' },
      UG: { role_label: 'Area Engineer / Branch Manager', short: 'Area Eng.' },
      NG: { role_label: 'DisCo Area Operations Manager', short: 'Ops Mgr' },
      GH: { role_label: 'ECG / GWCL District Engineer', short: 'Dist Eng' },
      RW: { role_label: 'REG / WASAC Station Engineer', short: 'Station Eng' },
      TZ: { role_label: 'TANESCO / DAWASA Area Manager', short: 'Area Mgr' },
      ZA: { role_label: 'Eskom / Water Depot Manager', short: 'Depot Mgr' },
    };
    const ut = utilTitles[country] || { role_label: 'Area Engineer / Branch Manager', short: 'Area Eng.' };
    return { role_label: ut.role_label, short: ut.short, scope_label: `Entity — ${tier.unit} only` };
  }
  return { role_label: tier.title, short: tier.short, scope_label: tier.tier };
}

export const GOV_CODES: Record<string, GovCodeData> = {
  // =========================================================================
  // UGANDA (UG) ACCOUNTING OFFICERS ESCALATION CHAIN (PFMA / LOCAL GOV ACT)
  // =========================================================================

  // --- TIER 5: APEX LINE MINISTRY ACCOUNTING OFFICERS & PERMANENT SECRETARIES ---
  'PS-MOLG-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'platform_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Local Government (National Accounting Officer / Apex Escalation)',
    real_title_short: 'PS Local Government (MoLG)',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Ben Kumumanya (PS MoLG)',
  },
  'PS-MOLG-ROLLOUT': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'platform_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Local Government (Rollout Desk)',
    real_title_short: 'PS MoLG Rollout',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Permanent Secretary Desk (MoLG)',
  },
  'PS-MOFPED-2026': {
    country: 'UG',
    dept: 'mofped',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary / Secretary to the Treasury (PS/ST), MoFPED',
    real_title_short: 'PS Finance (PS/ST)',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Ramathan Ggoobi (PS/ST)',
  },
  'PS-FINANCE-2026': {
    country: 'UG',
    dept: 'mofped',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary / Secretary to the Treasury (PS/ST), MoFPED',
    real_title_short: 'PS Finance (PS/ST)',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Ramathan Ggoobi (PS/ST)',
  },
  'PS-MOWT-2026': {
    country: 'UG',
    dept: 'kcca',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Works & Transport (Statutory Accounting Officer)',
    real_title_short: 'PS Works & Transport',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Bageya Waiswa (PS MoWT)',
  },
  'PS-MOH-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Health (Statutory Accounting Officer)',
    real_title_short: 'PS Health',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Dr. Diana Atwine (PS MoH)',
  },
  'PS-MOES-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Education & Sports',
    real_title_short: 'PS Education & Sports',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Ketty Lamaro (PS MoES)',
  },
  'PS-MOWE-2026': {
    country: 'UG',
    dept: 'nwsc',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Water & Environment (Statutory Accounting Officer)',
    real_title_short: 'PS Water & Environment',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Alfred Okot Okidi (PS MoWE)',
  },
  'PS-MOICT-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of ICT & National Guidance',
    real_title_short: 'PS ICT & Guidance',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Dr. Aminah Zawedde (PS MoICT)',
  },
  'PS-ICT-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of ICT & National Guidance',
    real_title_short: 'PS ICT & Guidance',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Dr. Aminah Zawedde (PS MoICT)',
  },
  'UG-PS-FINANCE': {
    country: 'UG',
    dept: 'mofped',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary / Secretary to the Treasury (PS/ST), MoFPED',
    real_title_short: 'PS Finance (PS/ST)',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Secretary to the Treasury (MoFPED)',
  },
  'UG-MOFPED-ADMIN': {
    country: 'UG',
    dept: 'mofped',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary / Secretary to the Treasury (PS/ST), MoFPED',
    real_title_short: 'PS Finance (PS/ST)',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Director of Budget & Treasury (MoFPED)',
  },
  'PS-WORKS-2026': {
    country: 'UG',
    dept: 'kcca',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Works & Transport (Statutory Accounting Officer)',
    real_title_short: 'PS Works & Transport',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Bageya Waiswa (PS MoWT)',
  },
  'UG-PS-WORKS': {
    country: 'UG',
    dept: 'kcca',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Works & Transport',
    real_title_short: 'PS Works & Transport',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Accounting Officer (MoWT)',
  },
  'PS-HEALTH-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Health (Statutory Accounting Officer)',
    real_title_short: 'PS Health',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Dr. Diana Atwine (PS MoH)',
  },
  'UG-PS-HEALTH': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Health',
    real_title_short: 'PS Health',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Accounting Officer (MoH)',
  },
  'PS-WATER-2026': {
    country: 'UG',
    dept: 'nwsc',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Water & Environment (Statutory Accounting Officer)',
    real_title_short: 'PS Water & Environment',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Alfred Okot Okidi (PS MoWE)',
  },
  'UG-PS-WATER': {
    country: 'UG',
    dept: 'nwsc',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Water & Environment',
    real_title_short: 'PS Water & Environment',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Accounting Officer (MoWE)',
  },
  'PS-OPM-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'platform_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Office of the Prime Minister (National M&E Accounting Officer)',
    real_title_short: 'PS OPM Monitoring',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Dunstan Balaba (PS OPM)',
  },
  'PS-ENERGY-2026': {
    country: 'UG',
    dept: 'umeme',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Energy & Mineral Development',
    real_title_short: 'PS Energy & Minerals',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Irene Bateebe (PS MEMD)',
  },
  'PS-EDUCATION-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Education & Sports',
    real_title_short: 'PS Education & Sports',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Ketty Lamaro (PS MoES)',
  },
  'PS-PUBLICSERVICE-2026': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'platform_admin',
    is_utility: false,
    role_label: 'Permanent Secretary, Ministry of Public Service (Civil Service Accounting Officer)',
    real_title_short: 'PS Public Service',
    hierarchy_level: 'tier5_perm_sec',
    escalation_rank: 5,
    officer_name: 'Catherine Bitarakwate (PS MoPS)',
  },

  // --- TIER 4: SECTOR STATUTORY AGENCIES & UTILITY ACCOUNTING OFFICERS ---
  'UG-NWSC-ADMIN': {
    country: 'UG',
    dept: 'nwsc',
    scope: 'UG',
    role: 'node_admin',
    is_utility: true,
    role_label: 'Managing Director / Statutory Accounting Officer, NWSC',
    real_title_short: 'MD NWSC',
    hierarchy_level: 'tier4_agency',
    escalation_rank: 4,
    officer_name: 'Dr. Eng. Silver Mugisha (MD NWSC)',
  },
  'UG-UNRA-ADMIN': {
    country: 'UG',
    dept: 'kcca',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Executive Director / Statutory Accounting Officer, UNRA',
    real_title_short: 'ED UNRA',
    hierarchy_level: 'tier4_agency',
    escalation_rank: 4,
    officer_name: 'Allen Kagina (ED UNRA)',
  },
  'UG-URA-ADMIN': {
    country: 'UG',
    dept: 'mofped',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Commissioner General / Statutory Accounting Officer, URA',
    real_title_short: 'CG URA',
    hierarchy_level: 'tier4_agency',
    escalation_rank: 4,
    officer_name: 'John Rujoki Musinguzi (CG URA)',
  },
  'UG-POLICE-0011': {
    country: 'UG',
    dept: 'upf',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Inspector General of Police (IGP) / Force Accounting Officer, UPF',
    real_title_short: 'IGP UPF',
    hierarchy_level: 'tier4_agency',
    escalation_rank: 4,
    officer_name: 'Abbas Byakagaba (IGP UPF)',
  },
  'UG-IGG-9999': {
    country: 'UG',
    dept: 'igg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Inspector General of Government (IGG) / Ombudsman Accounting Officer',
    real_title_short: 'IGG Ombudsman',
    hierarchy_level: 'tier4_agency',
    escalation_rank: 4,
    officer_name: 'Beti Kamya Turwomwe (IGG)',
  },
  'UG-UMEME-1104': {
    country: 'UG',
    dept: 'umeme',
    scope: 'nakawa',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Executive Director of Network Operations, Power Utility',
    real_title_short: 'Ops Lead (Power)',
    hierarchy_level: 'tier4_agency',
    escalation_rank: 4,
    officer_name: 'Area Engineering Lead (Power Utility)',
  },

  // --- TIER 3: HIGHER LOCAL GOVERNMENT (HLG) & CITY STATUTORY ACCOUNTING OFFICERS ---
  'UG-CAO-WAKISO': {
    country: 'UG',
    dept: 'molg',
    scope: 'wjk',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Wakiso District',
    real_title_short: 'CAO Wakiso District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Alfred Malinga (CAO Wakiso)',
  },
  'UG-CAO-GULU': {
    country: 'UG',
    dept: 'molg',
    scope: 'gulu_d',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Gulu District',
    real_title_short: 'CAO Gulu District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Ismail Ochengel (CAO Gulu)',
  },
  'UG-CAO-0001': {
    country: 'UG',
    dept: 'molg',
    scope: 'gulu_d',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Gulu District',
    real_title_short: 'CAO Gulu District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'CAO Gulu District Desk',
  },
  'UG-CAO-MUKONO': {
    country: 'UG',
    dept: 'molg',
    scope: 'wjk',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Mukono District',
    real_title_short: 'CAO Mukono District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'James Nkata (CAO Mukono)',
  },
  'UG-CAO-JINJA': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Jinja District',
    real_title_short: 'CAO Jinja District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Lillian Nakamatte (CAO Jinja)',
  },
  'UG-CAO-MBARARA': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Mbarara District',
    real_title_short: 'CAO Mbarara District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Edward Kasagara (CAO Mbarara)',
  },
  'UG-CAO-ARUA': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Arua District',
    real_title_short: 'CAO Arua District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Jude Mark Bukenya (CAO Arua)',
  },
  'UG-CAO-KABALE': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Kabale District',
    real_title_short: 'CAO Kabale District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Fred Kalyesubula (CAO Kabale)',
  },
  'UG-CAO-SOROTI': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Soroti District',
    real_title_short: 'CAO Soroti District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Luke Lokuda (CAO Soroti)',
  },
  'UG-CAO-MOROTO': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Chief Administrative Officer (CAO) / Statutory Accounting Officer, Moroto District',
    real_title_short: 'CAO Moroto District',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Kosmas Ayepa (CAO Moroto)',
  },
  'UG-KCCA-ADMIN': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kla',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Executive Director / Capital City Accounting Officer, KCCA',
    real_title_short: 'ED KCCA (City Accounting Officer)',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Executive Director (KCCA)',
  },
  'CD-ADMIN-0001': {
    country: 'UG',
    dept: 'kcca',
    scope: 'UG',
    role: 'platform_admin',
    is_utility: false,
    role_label: 'Capital City Accounting Officer / Oversight Desk',
    real_title_short: 'City Lead (KCCA)',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Director of Engineering & Technical Services (KCCA)',
  },
  'UG-CITY-TC-GULU': {
    country: 'UG',
    dept: 'molg',
    scope: 'gulu_d',
    role: 'node_admin',
    is_utility: false,
    role_label: 'City Town Clerk / Statutory Accounting Officer, Gulu City Council',
    real_title_short: 'City Town Clerk (Gulu City)',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Isheka Mugabi (City Town Clerk Gulu)',
  },
  'UG-CITY-TC-JINJA': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'City Town Clerk / Statutory Accounting Officer, Jinja City Council',
    real_title_short: 'City Town Clerk (Jinja City)',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Edward Lwanga (City Town Clerk Jinja)',
  },
  'UG-CITY-TC-MBARARA': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'City Town Clerk / Statutory Accounting Officer, Mbarara City Council',
    real_title_short: 'City Town Clerk (Mbarara City)',
    hierarchy_level: 'tier3_district_cao',
    escalation_rank: 3,
    officer_name: 'Assy Abireebe (City Town Clerk Mbarara)',
  },

  // --- TIER 2: LOWER LOCAL GOVERNMENT (LLG) ACCOUNTING OFFICERS (SUB-COUNTY SAS & TOWN CLERKS) ---
  'UG-SAS-KAMPALA-CENTRAL': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kla',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Senior Assistant Secretary (SAS) / LLG Accounting Officer, Kampala Central Division',
    real_title_short: 'SAS Central Division',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Senior Assistant Secretary Desk (Central)',
  },
  'UG-SAS-GULU-WEST': {
    country: 'UG',
    dept: 'molg',
    scope: 'gulu_d',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Senior Assistant Secretary (SAS) / Sub-County Accounting Officer, Bardege-Layibi',
    real_title_short: 'SAS Bardege-Layibi',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Sub-County Chief / SAS Desk (Bardege)',
  },
  'UG-SAS-WAKISO': {
    country: 'UG',
    dept: 'molg',
    scope: 'wjk',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Senior Assistant Secretary (SAS) / Sub-County Chief, Wakiso Sub-County',
    real_title_short: 'SAS Wakiso Sub-County',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Sub-County Chief Desk (Wakiso)',
  },
  'UG-SAS-KIRA': {
    country: 'UG',
    dept: 'molg',
    scope: 'wjk',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Senior Assistant Secretary (SAS) / Division Clerk, Kira Municipality',
    real_title_short: 'SAS Kira Division',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Senior Assistant Secretary (Kira)',
  },
  'UG-SAS-MBALE': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Senior Assistant Secretary (SAS) / Sub-County Chief, Mbale Northern Division',
    real_title_short: 'SAS Mbale Northern',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Sub-County Chief Desk (Mbale)',
  },
  'UG-TC-NAKAWA': {
    country: 'UG',
    dept: 'kcca',
    scope: 'nakawa',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Town Clerk / LLG Accounting Officer, Nakawa Urban Division',
    real_title_short: 'Town Clerk (Nakawa)',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Division Town Clerk (Nakawa)',
  },
  'UG-TC-KAWEMPE': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kawempe',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Town Clerk / LLG Accounting Officer, Kawempe Urban Division',
    real_title_short: 'Town Clerk (Kawempe)',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Division Town Clerk (Kawempe)',
  },
  'UG-TC-MAKINDYE': {
    country: 'UG',
    dept: 'kcca',
    scope: 'makindye',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Town Clerk / LLG Accounting Officer, Makindye Urban Division',
    real_title_short: 'Town Clerk (Makindye)',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Division Town Clerk (Makindye)',
  },
  'UG-TC-RUBAGA': {
    country: 'UG',
    dept: 'kcca',
    scope: 'rubaga',
    role: 'node_admin',
    is_utility: false,
    role_label: 'Town Clerk / LLG Accounting Officer, Rubaga Urban Division',
    real_title_short: 'Town Clerk (Rubaga)',
    hierarchy_level: 'tier2_subcounty',
    escalation_rank: 2,
    officer_name: 'Division Town Clerk (Rubaga)',
  },

  // --- TIER 1: LOWEST ACCOUNTING LIAISON & FIELD OFFICERS (PARISH CHIEFS & TOWN AGENTS) ---
  'UG-PARISH-NAKASERO': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: false,
    role_label: 'Parish Chief / Town Agent (Lowest Grassroots Accounting Officer Liaison), Nakasero Parish',
    real_title_short: 'Parish Chief (Nakasero)',
    hierarchy_level: 'tier1_parish',
    escalation_rank: 1,
    officer_name: 'Town Agent Desk (Nakasero)',
  },
  'UG-PARISH-BUKOTO': {
    country: 'UG',
    dept: 'kcca',
    scope: 'nakawa',
    role: 'spokesperson',
    is_utility: false,
    role_label: 'Parish Chief / Town Agent (Lowest Grassroots Accounting Officer Liaison), Bukoto II Parish',
    real_title_short: 'Parish Chief (Bukoto II)',
    hierarchy_level: 'tier1_parish',
    escalation_rank: 1,
    officer_name: 'Town Agent Desk (Bukoto II)',
  },
  'UG-PARISH-GULU-BAR': {
    country: 'UG',
    dept: 'molg',
    scope: 'gulu_d',
    role: 'spokesperson',
    is_utility: false,
    role_label: 'Parish Chief (Lowest Grassroots Accounting Officer Liaison), Bardege Central Parish',
    real_title_short: 'Parish Chief (Bardege)',
    hierarchy_level: 'tier1_parish',
    escalation_rank: 1,
    officer_name: 'Parish Chief Desk (Bardege)',
  },
  'UG-PARISH-KIRA': {
    country: 'UG',
    dept: 'molg',
    scope: 'wjk',
    role: 'spokesperson',
    is_utility: false,
    role_label: 'Parish Chief / Town Agent, Kira Ward / Parish',
    real_title_short: 'Parish Chief (Kira)',
    hierarchy_level: 'tier1_parish',
    escalation_rank: 1,
    officer_name: 'Town Agent Desk (Kira)',
  },
  'UG-PARISH-ENTEBBE': {
    country: 'UG',
    dept: 'molg',
    scope: 'wjk',
    role: 'spokesperson',
    is_utility: false,
    role_label: 'Parish Chief / Town Agent, Kitoro Central Parish',
    real_title_short: 'Parish Agent (Kitoro Entebbe)',
    hierarchy_level: 'tier1_parish',
    escalation_rank: 1,
    officer_name: 'Town Agent Desk (Entebbe Kitoro)',
  },
  'UG-PARISH-JINJA': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: false,
    role_label: 'Parish Chief / Town Agent, Walukuba West Parish',
    real_title_short: 'Parish Agent (Walukuba Jinja)',
    hierarchy_level: 'tier1_parish',
    escalation_rank: 1,
    officer_name: 'Parish Chief Desk (Walukuba)',
  },
  'UG-PARISH-MBARARA': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: false,
    role_label: 'Parish Chief, Kamukuzi Ward / Parish',
    real_title_short: 'Parish Chief (Kamukuzi Mbarara)',
    hierarchy_level: 'tier1_parish',
    escalation_rank: 1,
    officer_name: 'Parish Chief Desk (Kamukuzi)',
  },
  'UG-PARISH-ARUA': {
    country: 'UG',
    dept: 'molg',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: false,
    role_label: 'Parish Chief, Arua Hill Central Parish',
    real_title_short: 'Parish Chief (Arua Hill)',
    hierarchy_level: 'tier1_parish',
    escalation_rank: 1,
    officer_name: 'Parish Chief Desk (Arua Hill)',
  },

  // Legacy & Specific Desks
  'CD-CORP-9999': { country: 'UG', dept: 'kcca', scope: 'UG', role: 'platform_admin', is_utility: false },
  'PRJ-PERF-KPV89826': { country: 'UG', dept: 'kcca', scope: 'nakawa', role: 'spokesperson', is_utility: true },
  'UG-KCCA-2847': { country: 'UG', dept: 'kcca', scope: 'nakawa', role: 'spokesperson', is_utility: false, role_label: 'Nakawa Works Liaison', real_title_short: 'Works Officer (Nakawa)' },
  'UG-KCCA-3301': { country: 'UG', dept: 'kcca', scope: 'kawempe', role: 'spokesperson', is_utility: false, role_label: 'Kawempe Public Health Lead', real_title_short: 'Health Lead (Kawempe)' },
  'UG-NWSC-3391': { country: 'UG', dept: 'nwsc', scope: 'wjk', role: 'spokesperson', is_utility: false, role_label: 'NWSC Area Branch Manager (Wakiso)', real_title_short: 'NWSC Wakiso Lead' },
  'UG-RDC-READ': { country: 'UG', dept: 'kcca', scope: 'kla', role: 'read_only', is_utility: false, role_label: 'Resident District Commissioner (RDC) Oversight Desk', real_title_short: 'RDC Office' },

  // =========================================================================
  // KENYA (KE) ACCOUNTING OFFICERS ESCALATION CHAIN
  // =========================================================================
  'KE-PS-TREASURY': { country: 'KE', dept: 'ncc', scope: 'KE', role: 'node_admin', is_utility: false, role_label: 'Principal Secretary, The National Treasury (Apex National Accounting Officer)', real_title_short: 'PS National Treasury', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'KE-PS-DEVOLUTION': { country: 'KE', dept: 'ncc', scope: 'KE', role: 'platform_admin', is_utility: false, role_label: 'Principal Secretary, State Department for Devolution', real_title_short: 'PS Devolution', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'KE-CECM-NBO': { country: 'KE', dept: 'ncc', scope: 'nbo', role: 'node_admin', is_utility: false, role_label: 'County Executive Committee Member (CECM) / County Accounting Officer, Nairobi', real_title_short: 'CECM Finance (Nairobi)', hierarchy_level: 'tier3_district_cao', escalation_rank: 3 },
  'KE-SUBCOUNTY-01': { country: 'KE', dept: 'ncc', scope: 'wstl', role: 'node_admin', is_utility: false, role_label: 'Sub-County Administrator (LLG Accounting Officer), Westlands', real_title_short: 'Sub-County Admin (Westlands)', hierarchy_level: 'tier2_subcounty', escalation_rank: 2 },
  'KE-WARD-4410': { country: 'KE', dept: 'ncc', scope: 'kiti', role: 'spokesperson', is_utility: false, role_label: 'Ward Administrator (Lowest Grassroots Accounting Officer Liaison), Kitengela', real_title_short: 'Ward Admin (Kitengela)', hierarchy_level: 'tier1_parish', escalation_rank: 1 },
  'KE-KPLC-ADMIN': { country: 'KE', dept: 'kplc', scope: 'KE', role: 'node_admin', is_utility: true, role_label: 'Managing Director & CEO, Kenya Power (KPLC)', real_title_short: 'MD Kenya Power', hierarchy_level: 'tier4_agency', escalation_rank: 4 },
  'KE-POWER-9912': { country: 'KE', dept: 'kplc', scope: 'kiti', role: 'spokesperson', is_utility: true },
  'KE-NWSC-2210': { country: 'KE', dept: 'nwco_ke', scope: 'wstl', role: 'spokesperson', is_utility: true },
  'KE-EACC-0011': { country: 'KE', dept: 'nps_ke', scope: 'KE', role: 'read_only', is_utility: false },

  // =========================================================================
  // RWANDA (RW) ACCOUNTING OFFICERS ESCALATION CHAIN
  // =========================================================================
  'RW-PS-MINALOC': { country: 'RW', dept: 'mininfra', scope: 'RW', role: 'platform_admin', is_utility: false, role_label: 'Permanent Secretary, Ministry of Local Government (MINALOC)', real_title_short: 'PS MINALOC', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'RW-PS-MINECOFIN': { country: 'RW', dept: 'mininfra', scope: 'RW', role: 'node_admin', is_utility: false, role_label: 'Permanent Secretary / Secretary to Treasury, MINECOFIN', real_title_short: 'PS MINECOFIN', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'RW-MAYOR-GASABO': { country: 'RW', dept: 'mininfra', scope: 'gasabo', role: 'node_admin', is_utility: false, role_label: 'District Executive Secretary / Mayor (District Accounting Officer), Gasabo', real_title_short: 'Mayor / Exec Sec (Gasabo)', hierarchy_level: 'tier3_district_cao', escalation_rank: 3 },
  'RW-SECTOR-KIMI': { country: 'RW', dept: 'mininfra', scope: 'kimironko', role: 'spokesperson', is_utility: false, role_label: 'Sector Executive Secretary (LLG Accounting Officer), Kimironko Sector', real_title_short: 'Sector Exec Sec (Kimironko)', hierarchy_level: 'tier2_subcounty', escalation_rank: 2 },
  'RW-CELL-3040': { country: 'RW', dept: 'reg', scope: 'rukiri_i', role: 'spokesperson', is_utility: false, role_label: 'Cell Executive Secretary (Lowest Grassroots Accounting Officer), Rukiri I', real_title_short: 'Cell Exec Sec (Rukiri I)', hierarchy_level: 'tier1_parish', escalation_rank: 1 },
  'RW-REG-6610': { country: 'RW', dept: 'reg', scope: 'RW', role: 'node_admin', is_utility: false, role_label: 'Chief Executive Officer, Rwanda Energy Group (REG)', real_title_short: 'CEO REG Rwanda', hierarchy_level: 'tier4_agency', escalation_rank: 4 },

  // =========================================================================
  // NIGERIA (NG) ACCOUNTING OFFICERS ESCALATION CHAIN
  // =========================================================================
  'NG-PS-WORKS': { country: 'NG', dept: 'lasg', scope: 'NG', role: 'platform_admin', is_utility: false, role_label: 'Permanent Secretary, Federal Ministry of Works', real_title_short: 'PS Works (Federal)', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'NG-PS-FINANCE': { country: 'NG', dept: 'lasg', scope: 'NG', role: 'node_admin', is_utility: false, role_label: 'Permanent Secretary, Federal Ministry of Finance', real_title_short: 'PS Finance (Federal)', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'NG-CHAIRMAN-IKEJA': { country: 'NG', dept: 'lasg', scope: 'ikeja', role: 'node_admin', is_utility: false, role_label: 'Executive Chairman / Accounting Officer, Ikeja Local Government Area (LGA)', real_title_short: 'LGA Chairman (Ikeja)', hierarchy_level: 'tier3_district_cao', escalation_rank: 3 },
  'NG-WARD-2200': { country: 'NG', dept: 'lasg', scope: 'opebi', role: 'spokesperson', is_utility: false, role_label: 'Ward Administrative Officer (Lowest Grassroots Accounting Liaison), Opebi Ward', real_title_short: 'Ward Admin (Opebi)', hierarchy_level: 'tier1_parish', escalation_rank: 1 },

  // =========================================================================
  // GHANA (GH) ACCOUNTING OFFICERS ESCALATION CHAIN
  // =========================================================================
  'GH-CD-LOCALGOV': { country: 'GH', dept: 'ecg', scope: 'GH', role: 'platform_admin', is_utility: false, role_label: 'Chief Director (Permanent Secretary), Ministry of Local Government & Rural Dev', real_title_short: 'Chief Director MLGRD', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'GH-CD-FINANCE': { country: 'GH', dept: 'ecg', scope: 'GH', role: 'node_admin', is_utility: false, role_label: 'Chief Director (Permanent Secretary), Ministry of Finance', real_title_short: 'Chief Director MoF', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'GH-MCE-ACCRA': { country: 'GH', dept: 'ecg', scope: 'GH', role: 'node_admin', is_utility: false, role_label: 'Municipal Coordinating Director (MCD) / Accounting Officer, Accra Metropolitan', real_title_short: 'MCD Accra Metro', hierarchy_level: 'tier3_district_cao', escalation_rank: 3 },
  'GH-ASSY-7712': { country: 'GH', dept: 'ecg', scope: 'osu_klottey', role: 'spokesperson', is_utility: false, role_label: 'Zonal Unit Committee Chairman (Lowest Grassroots Accounting Liaison), Osu Klottey', real_title_short: 'Unit Chair (Osu Klottey)', hierarchy_level: 'tier1_parish', escalation_rank: 1 },
  'GH-ECG-8801': { country: 'GH', dept: 'ecg', scope: 'GH', role: 'node_admin', is_utility: false },

  // =========================================================================
  // TANZANIA (TZ) ACCOUNTING OFFICERS ESCALATION CHAIN
  // =========================================================================
  'TZ-PS-TAMISEMI': { country: 'TZ', dept: 'tanesco', scope: 'TZ', role: 'platform_admin', is_utility: false, role_label: 'Permanent Secretary, President’s Office - Regional Administration (TAMISEMI)', real_title_short: 'Katibu Mkuu TAMISEMI', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'TZ-PS-TREASURY': { country: 'TZ', dept: 'tanesco', scope: 'TZ', role: 'node_admin', is_utility: false, role_label: 'Permanent Secretary / Paymaster General, Ministry of Finance', real_title_short: 'Katibu Mkuu Hazina', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'TZ-DED-ILALA': { country: 'TZ', dept: 'tanesco', scope: 'TZ', role: 'node_admin', is_utility: false, role_label: 'District Executive Director (DED) / Statutory Accounting Officer, Ilala Municipal', real_title_short: 'DED Ilala Municipal', hierarchy_level: 'tier3_district_cao', escalation_rank: 3 },
  'TZ-WARD-1100': { country: 'TZ', dept: 'tanesco', scope: 'kivukoni', role: 'spokesperson', is_utility: false, role_label: 'Ward Executive Officer (WEO) (Lowest Grassroots Accounting Liaison), Kivukoni', real_title_short: 'Afisa Mtendaji Kata (Kivukoni)', hierarchy_level: 'tier1_parish', escalation_rank: 1 },

  // =========================================================================
  // SOUTH AFRICA (ZA) ACCOUNTING OFFICERS ESCALATION CHAIN
  // =========================================================================
  'ZA-DG-COGTA': { country: 'ZA', dept: 'joburg_water', scope: 'ZA', role: 'platform_admin', is_utility: false, role_label: 'Director-General (Permanent Secretary), Cooperative Governance & Traditional Affairs', real_title_short: 'DG COGTA', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'ZA-DG-TREASURY': { country: 'ZA', dept: 'joburg_water', scope: 'ZA', role: 'node_admin', is_utility: false, role_label: 'Director-General / National Accounting Officer, National Treasury', real_title_short: 'DG National Treasury', hierarchy_level: 'tier5_perm_sec', escalation_rank: 5 },
  'ZA-MM-JOBURG': { country: 'ZA', dept: 'joburg_water', scope: 'region_a', role: 'node_admin', is_utility: false, role_label: 'City Manager / Statutory Accounting Officer, City of Johannesburg', real_title_short: 'City Manager (Joburg)', hierarchy_level: 'tier3_district_cao', escalation_rank: 3 },
  'ZA-WARD-2200': { country: 'ZA', dept: 'joburg_water', scope: 'region_a', role: 'spokesperson', is_utility: false, role_label: 'Ward Councillor / Community Officer (Lowest Local Liaison), Region A', real_title_short: 'Ward Officer (Region A)', hierarchy_level: 'tier1_parish', escalation_rank: 1 },

  // Other Global / International Desks
  'ET-KEBELE-3300': { country: 'ET', dept: 'eeu', scope: 'woreda_01', role: 'spokesperson', is_utility: false },
  'EG-WARD-4400': { country: 'EG', dept: 'eehc', scope: 'nasr_city', role: 'spokesperson', is_utility: false },
  'SN-COMM-5500': { country: 'SN', dept: 'senelec', scope: 'plateau', role: 'spokesperson', is_utility: false },
  'ZM-WARD-6600': { country: 'ZM', dept: 'zesco', scope: 'kabwata', role: 'spokesperson', is_utility: false },
  'ZW-WARD-7700': { country: 'ZW', dept: 'zetdc', scope: 'ward_1', role: 'spokesperson', is_utility: false },
  'US-DIST-8800': { country: 'US', dept: 'dot_us', scope: 'manhattan', role: 'spokesperson', is_utility: false },
  'GB-WARD-9900': { country: 'GB', dept: 'council_uk', scope: 'holborn', role: 'spokesperson', is_utility: false },
  'IN-PANCH-1010': { country: 'IN', dept: 'djb', scope: 'connaught_place', role: 'spokesperson', is_utility: false },

  // =========================================================================
  // NON-GOVERNMENT APPOINTED ENTITIES (CIVIL SOCIETY, PRIVATE SECTOR, NGOS, CONTRACTORS & UTILITIES)
  // =========================================================================

  // --- CATEGORY 1: CIVIL SOCIETY ORGANIZATIONS & NGOS (CSOs / WATCHDOGS) ---
  'NGO-TI-UG': {
    country: 'UG',
    dept: 'ti_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Civil Society Transparency Lead, Transparency International Uganda',
    real_title_short: 'CSO Lead (Transparency Int.)',
    entity_type: 'non_government_entity',
    entity_category: 'ngo_civil_society',
    organization_name: 'Transparency International Uganda (CSO / NGO)',
    officer_name: 'Peter Wandera (Executive Director, TI Uganda)',
  },
  'NGO-RED-CROSS-UG': {
    country: 'UG',
    dept: 'redcross_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Emergency Operations Director, Uganda Red Cross Society',
    real_title_short: 'Ops Director (Red Cross UG)',
    entity_type: 'non_government_entity',
    entity_category: 'ngo_civil_society',
    organization_name: 'Uganda Red Cross Society (Humanitarian NGO)',
    officer_name: 'Robert Kwesiga (Secretary General, Red Cross)',
  },
  'NGO-ACTIONAID-UG': {
    country: 'UG',
    dept: 'actionaid_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Civic Governance Coordinator, ActionAid Uganda',
    real_title_short: 'Civic Lead (ActionAid)',
    entity_type: 'non_government_entity',
    entity_category: 'ngo_civil_society',
    organization_name: 'ActionAid Uganda (Civic Rights & NGO Desk)',
    officer_name: 'Arthur Larok (Country Director, ActionAid)',
  },
  'NGO-WATERAID-EA': {
    country: 'UG',
    dept: 'wateraid_ea',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Public Sanitation Monitoring Director, WaterAid East Africa',
    real_title_short: 'Sanitation Lead (WaterAid)',
    entity_type: 'non_government_entity',
    entity_category: 'ngo_civil_society',
    organization_name: 'WaterAid East Africa (Civil Sanitation Oversight)',
    officer_name: 'Jane Nabakooza (Program Lead, WaterAid)',
  },
  'NGO-TI-KE': {
    country: 'KE',
    dept: 'ti_ke',
    scope: 'KE',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Civic Transparency Director, Transparency International Kenya',
    real_title_short: 'CSO Director (TI Kenya)',
    entity_type: 'non_government_entity',
    entity_category: 'ngo_civil_society',
    organization_name: 'Transparency International Kenya (CSO)',
    officer_name: 'Sheila Masinde (Executive Director, TI Kenya)',
  },
  'NGO-SERAP-NG': {
    country: 'NG',
    dept: 'serap_ng',
    scope: 'NG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Public Accountability Lead, SERAP Nigeria',
    real_title_short: 'Accountability Lead (SERAP)',
    entity_type: 'non_government_entity',
    entity_category: 'ngo_civil_society',
    organization_name: 'Socio-Economic Rights & Accountability Project (SERAP)',
    officer_name: 'Kolawole Oluwadare (Deputy Director, SERAP)',
  },
  'NGO-OUTA-ZA': {
    country: 'ZA',
    dept: 'outa_za',
    scope: 'ZA',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Civil Oversight & Anti-Corruption Officer, OUTA South Africa',
    real_title_short: 'Civil Lead (OUTA SA)',
    entity_type: 'non_government_entity',
    entity_category: 'ngo_civil_society',
    organization_name: 'Organisation Undoing Tax Abuse (OUTA)',
    officer_name: 'Wayne Duvenage (CEO, OUTA)',
  },

  // --- CATEGORY 2: PRIVATE INFRASTRUCTURE & CIVIL ENGINEERING CONTRACTORS ---
  'CTR-STERLING-CIVIL': {
    country: 'UG',
    dept: 'sterling_ctr',
    scope: 'nakawa',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Managing Director & Prime Contractor, Sterling Civil Works Ltd',
    real_title_short: 'Prime Contractor (Sterling)',
    entity_type: 'non_government_entity',
    entity_category: 'private_contractor',
    organization_name: 'Sterling Civil Works Ltd (Infrastructure Contractor)',
    officer_name: 'Eng. Patrick Batumbya (Sterling Civil)',
  },
  'CTR-ROKO-UG': {
    country: 'UG',
    dept: 'roko_ctr',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Chief Operations Officer, Roko Construction Ltd',
    real_title_short: 'COO (Roko Construction)',
    entity_type: 'non_government_entity',
    entity_category: 'private_contractor',
    organization_name: 'Roko Construction Ltd (Civil Engineering Contractor)',
    officer_name: 'Mark Koehler (Managing Director, Roko)',
  },
  'CTR-DOTT-SERVICES': {
    country: 'UG',
    dept: 'dott_ctr',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Chief Technical Director, Dott Services Ltd',
    real_title_short: 'Technical Director (Dott Services)',
    entity_type: 'non_government_entity',
    entity_category: 'private_contractor',
    organization_name: 'Dott Services Ltd (Highways Contractor)',
    officer_name: 'Eng. Maheswara Reddy (Dott Services)',
  },
  'CTR-BUILDTECH-EA': {
    country: 'UG',
    dept: 'buildtech_ea',
    scope: 'wjk',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Urban Works Project Lead, BuildTech Infrastructure Africa',
    real_title_short: 'Project Lead (BuildTech)',
    entity_type: 'non_government_entity',
    entity_category: 'private_contractor',
    organization_name: 'BuildTech Infrastructure Ltd (Contractor)',
    officer_name: 'Eng. Moses Mugisha (BuildTech Africa)',
  },
  'CTR-JULIUS-BERGER-NG': {
    country: 'NG',
    dept: 'julius_berger',
    scope: 'NG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Lead Civil Works Engineer, Julius Berger Nigeria PLC',
    real_title_short: 'Chief Engineer (Julius Berger)',
    entity_type: 'non_government_entity',
    entity_category: 'private_contractor',
    organization_name: 'Julius Berger Nigeria PLC (Contractor)',
    officer_name: 'Eng. Lars Richter (Julius Berger)',
  },
  'CTR-WBHO-ZA': {
    country: 'ZA',
    dept: 'wbho_ctr',
    scope: 'ZA',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Infrastructure Division Director, WBHO Construction Pty Ltd',
    real_title_short: 'Division Director (WBHO)',
    entity_type: 'non_government_entity',
    entity_category: 'private_contractor',
    organization_name: 'WBHO Construction Pty Ltd (Contractor)',
    officer_name: 'Wolfgang Neff (WBHO Projects)',
  },

  // --- CATEGORY 3: PRIVATE TELECOMS, ISPS & OFF-GRID CLEAN ENERGY ---
  'TEL-MTN-UG-CORP': {
    country: 'UG',
    dept: 'mtn_ug',
    scope: 'UG',
    role: 'node_admin',
    is_utility: true,
    role_label: 'Chief Enterprise & Infrastructure Officer, MTN Uganda Limited',
    real_title_short: 'Chief Enterprise (MTN UG)',
    entity_type: 'non_government_entity',
    entity_category: 'private_utility_telecom',
    organization_name: 'MTN Uganda Limited (Telecom & ISP)',
    officer_name: 'Sylvia Mulinge (CEO, MTN Uganda)',
  },
  'TEL-AIRTEL-UG-OPS': {
    country: 'UG',
    dept: 'airtel_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Director of Fiber & Public Utility Coordination, Airtel Uganda',
    real_title_short: 'Fiber Director (Airtel UG)',
    entity_type: 'non_government_entity',
    entity_category: 'private_utility_telecom',
    organization_name: 'Airtel Uganda Limited (Telecom & Fiber)',
    officer_name: 'Manoj Murali (Managing Director, Airtel UG)',
  },
  'TEL-SAFARICOM-KE-OPS': {
    country: 'KE',
    dept: 'safaricom',
    scope: 'KE',
    role: 'node_admin',
    is_utility: true,
    role_label: 'Director Sustainable Infrastructure & IoT, Safaricom PLC',
    real_title_short: 'Director IoT & Fiber (Safaricom)',
    entity_type: 'non_government_entity',
    entity_category: 'private_utility_telecom',
    organization_name: 'Safaricom PLC (Telecom & M-Pesa)',
    officer_name: 'Peter Ndegwa (CEO, Safaricom)',
  },
  'ISP-LIQUID-TECH-EA': {
    country: 'UG',
    dept: 'liquid_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Metropolitan Network Infrastructure Manager, Liquid Tech',
    real_title_short: 'Network Manager (Liquid Tech)',
    entity_type: 'non_government_entity',
    entity_category: 'private_utility_telecom',
    organization_name: 'Liquid Intelligent Technologies (Metro Fiber)',
    officer_name: 'Dennis Kahindi (Liquid Tech EA)',
  },
  'ENG-SOLARNOW-UG': {
    country: 'UG',
    dept: 'solarnow_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Director Rural Electrification & Solar Microgrids, SolarNow',
    real_title_short: 'Solar Director (SolarNow)',
    entity_type: 'non_government_entity',
    entity_category: 'private_utility_telecom',
    organization_name: 'SolarNow Uganda (Clean Power Mini-Grids)',
    officer_name: 'Willem Nolens (CEO, SolarNow)',
  },

  // --- CATEGORY 4: COMMERCIAL ENTERPRISES, CORPORATE CSR & BUSINESS CHAMBERS ---
  'CSR-STANBIC-UG': {
    country: 'UG',
    dept: 'stanbic',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Head of Sustainability & Community CSR, Stanbic Bank Uganda',
    real_title_short: 'Head CSR (Stanbic Bank)',
    entity_type: 'non_government_entity',
    entity_category: 'commercial_corporate',
    organization_name: 'Stanbic Bank Uganda Ltd (Corporate CSR)',
    officer_name: 'Cathy Adengo (Head Sustainability, Stanbic)',
  },
  'CSR-MUKWANO-GRP': {
    country: 'UG',
    dept: 'mukwano_csr',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Industrial Zone Environmental Officer, Mukwano Group',
    real_title_short: 'CSR Officer (Mukwano)',
    entity_type: 'non_government_entity',
    entity_category: 'commercial_corporate',
    organization_name: 'Mukwano Group Industries (Corporate CSR)',
    officer_name: 'Alykhan Karmali (Mukwano Group)',
  },
  'CSR-EQUITY-BANK-UG': {
    country: 'UG',
    dept: 'equity_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Community Development Director, Equity Bank Foundation',
    real_title_short: 'Director (Equity Foundation)',
    entity_type: 'non_government_entity',
    entity_category: 'commercial_corporate',
    organization_name: 'Equity Bank Foundation (Community SME & CSR)',
    officer_name: 'Anthony Kituuka (MD, Equity Uganda)',
  },
  'BUS-KACITA-TRADERS': {
    country: 'UG',
    dept: 'kacita_ug',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Secretary General, Kampala City Traders Association (KACITA)',
    real_title_short: 'Sec Gen (KACITA Traders)',
    entity_type: 'non_government_entity',
    entity_category: 'commercial_corporate',
    organization_name: 'Kampala City Traders Association (Business Hub)',
    officer_name: 'Thaddeus Musoke Nagenda (Chairman, KACITA)',
  },
  'BUS-PSFU-ADVOCACY': {
    country: 'UG',
    dept: 'psfu_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Chief Policy & Business Environment Officer, PSFU Uganda',
    real_title_short: 'Policy Officer (PSFU)',
    entity_type: 'non_government_entity',
    entity_category: 'commercial_corporate',
    organization_name: 'Private Sector Foundation Uganda',
    officer_name: 'Stephen Asiimwe (CEO, PSFU)',
  },
  'BUS-KNCCI-KE': {
    country: 'KE',
    dept: 'kncci_ke',
    scope: 'KE',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'President & Chief Liaison, Kenya Chamber of Commerce (KNCCI)',
    real_title_short: 'President (KNCCI Chamber)',
    entity_type: 'non_government_entity',
    entity_category: 'commercial_corporate',
    organization_name: 'Kenya National Chamber of Commerce & Industry',
    officer_name: 'Erick Rutto (President, KNCCI)',
  },

  // --- CATEGORY 5: COMMUNITY-BASED (CBOs) & FAITH-BASED ORGANIZATIONS (FBOs) ---
  'FBO-IRCU-UG': {
    country: 'UG',
    dept: 'ircu_fbo',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Secretary General, Inter-Religious Council of Uganda (IRCU)',
    real_title_short: 'Sec Gen (IRCU FBO)',
    entity_type: 'non_government_entity',
    entity_category: 'faith_cbo',
    organization_name: 'Inter-Religious Council of Uganda (FBO)',
    officer_name: 'Joshua Kitakule (Sec Gen, IRCU)',
  },
  'FBO-CARITAS-UG': {
    country: 'UG',
    dept: 'caritas_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'National Director, Caritas Uganda (Catholic Secretariat)',
    real_title_short: 'National Director (Caritas)',
    entity_type: 'non_government_entity',
    entity_category: 'faith_cbo',
    organization_name: 'Caritas Uganda (Faith-Based Aid & Development)',
    officer_name: 'Msgr. Francis Ndamira (Director, Caritas)',
  },
  'CBO-ROTARY-KAMPALA': {
    country: 'UG',
    dept: 'rotary_kla',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Civic Water & Community Projects Director, Rotary Club Kampala',
    real_title_short: 'Projects Lead (Rotary Club)',
    entity_type: 'non_government_entity',
    entity_category: 'faith_cbo',
    organization_name: 'Rotary Club of Kampala (Civic Service CBO)',
    officer_name: 'Rotary District 9213 / 9214 Project Secretariat',
  },

  // --- CATEGORY 6: ACADEMIC INSTITUTIONS, URBAN LABS & RESEARCH THINK TANKS ---
  'ACA-MAK-URBANLAB': {
    country: 'UG',
    dept: 'mak_urbanlab',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Lead Urban Action Research Fellow, Makerere University Urban Action Lab',
    real_title_short: 'Lead Researcher (Mak UrbanLab)',
    entity_type: 'non_government_entity',
    entity_category: 'academic_research',
    organization_name: 'Makerere University Urban Action Lab',
    officer_name: 'Prof. Shuaib Lwasa (Makerere Urban Action Lab)',
  },
  'ACA-EPRC-THINKTANK': {
    country: 'UG',
    dept: 'eprc_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Senior Policy Analyst, Economic Policy Research Centre (EPRC)',
    real_title_short: 'Senior Analyst (EPRC)',
    entity_type: 'non_government_entity',
    entity_category: 'academic_research',
    organization_name: 'Economic Policy Research Centre',
    officer_name: 'Dr. Sarah Ssewanyana (Executive Director, EPRC)',
  },

  // --- CATEGORY 7: TRANSPORT ASSOCIATIONS, STAGE SACCOS & COOPERATIVES ---
  'TRN-BODA-UNION-UG': {
    country: 'UG',
    dept: 'boda_union_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'National Chairman, National Boda Boda Transporters Union',
    real_title_short: 'National Chair (Boda Union)',
    entity_type: 'non_government_entity',
    entity_category: 'transport_cooperative',
    organization_name: 'National Boda Boda Transporters Union',
    officer_name: 'Charles Ndugwa (Chairman, Boda Union)',
  },
  'TRN-KOTSA-TAXI-UG': {
    country: 'UG',
    dept: 'kotsa_taxi',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Executive Operations Lead, Kampala Operational Taxi Stages (KOTSA)',
    real_title_short: 'Ops Lead (KOTSA Taxi SACCO)',
    entity_type: 'non_government_entity',
    entity_category: 'transport_cooperative',
    organization_name: 'Kampala Operational Taxi Stages Association',
    officer_name: 'Mustafa Mayambala (Chairman, KOTSA)',
  },
  'TRN-MATATU-MOA-KE': {
    country: 'KE',
    dept: 'matatu_moa',
    scope: 'KE',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Chairman & Public Transit Liaison, Matatu Owners Association',
    real_title_short: 'Chairman (Matatu MOA)',
    entity_type: 'non_government_entity',
    entity_category: 'transport_cooperative',
    organization_name: 'Matatu Owners Association (Public Transit SACCO)',
    officer_name: 'Albert Karakacha (Chairman, MOA Kenya)',
  },
  'TRN-SANTACO-TAXI-ZA': {
    country: 'ZA',
    dept: 'santaco_za',
    scope: 'ZA',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Chief Operations Officer, South African National Taxi Council',
    real_title_short: 'COO (SANTACO Taxi)',
    entity_type: 'non_government_entity',
    entity_category: 'transport_cooperative',
    organization_name: 'SA National Taxi Council (Transit SACCO)',
    officer_name: 'Phillip Taaibosch (President, SANTACO)',
  },

  // --- CATEGORY 8: EDUCATION & ACADEMIC PROVIDERS ---
  'SCH-GAYAZA-01': {
    country: 'UG',
    dept: 'moes_ug',
    scope: 'wakiso',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Headteacher & Academic Administrator, Gayaza High School',
    real_title_short: 'Headteacher (Gayaza High)',
    entity_type: 'non_government_entity',
    entity_category: 'education',
    organization_name: 'Gayaza High School (Secondary Education)',
    officer_name: 'Robinah Kizito (Headteacher, Gayaza High)',
  },
  'SCH-MAK-UNIV': {
    country: 'UG',
    dept: 'moes_ug',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Academic Registrar & Student Welfare Desk, Makerere University',
    real_title_short: 'Registrar (Makerere Univ)',
    entity_type: 'non_government_entity',
    entity_category: 'education',
    organization_name: 'Makerere University (Higher Education)',
    officer_name: 'Prof. Barnabas Nawangwe (Vice Chancellor, Makerere)',
  },

  // --- CATEGORY 9: HEALTHCARE FACILITIES & CLINICS ---
  'HOSP-MULAGO-01': {
    country: 'UG',
    dept: 'moh_ug',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Clinical Director & Patient Triage Lead, Mulago National Referral Hospital',
    real_title_short: 'Clinical Lead (Mulago Referral)',
    entity_type: 'non_government_entity',
    entity_category: 'health',
    organization_name: 'Mulago National Referral Hospital',
    officer_name: 'Dr. Rosemary Byanyima (Executive Director, Mulago)',
  },
  'HOSP-NAKASERO': {
    country: 'UG',
    dept: 'moh_ug',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Chief Medical Officer & Patient Ombudsman, Nakasero Hospital Ltd',
    real_title_short: 'CMO (Nakasero Hospital)',
    entity_type: 'non_government_entity',
    entity_category: 'health',
    organization_name: 'Nakasero Hospital (Private Healthcare)',
    officer_name: 'Dr. Edward Rukwaro (Medical Director, Nakasero)',
  },

  // --- CATEGORY 10: FOOD & DINING / HOSPITALITY ---
  'RES-JAVA-KLA': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Quality Assurance & Customer Relations Lead, Java House Kampala',
    real_title_short: 'QA Lead (Java House)',
    entity_type: 'non_government_entity',
    entity_category: 'food_dining',
    organization_name: 'Java House Uganda (Restaurant & Café)',
    officer_name: 'Brenda Nalubega (Country Operations Lead, Java House)',
  },
  'RES-CAFE-JAVAS': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Food Hygiene & Guest Satisfaction Lead, Café Javas (CJ\'s)',
    real_title_short: 'Guest Lead (Café Javas)',
    entity_type: 'non_government_entity',
    entity_category: 'food_dining',
    organization_name: 'Café Javas (Mandela Group Dining)',
    officer_name: 'Omar Mandela (Director, Mandela Group)',
  },

  // --- CATEGORY 11: BANKING, SACCOS & FINANCIAL SERVICES ---
  'BNK-STANBIC-01': {
    country: 'UG',
    dept: 'bou_ug',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    role_label: 'Consumer Protection & Dispute Resolution Officer, Stanbic Bank Uganda',
    real_title_short: 'Ombudsman (Stanbic Bank)',
    entity_type: 'non_government_entity',
    entity_category: 'banking_finance',
    organization_name: 'Stanbic Bank Uganda Ltd (Commercial Banking)',
    officer_name: 'Anne Juuko / Mumba Kalifungwa (Executive Leadership, Stanbic)',
  },
  'BNK-CENTENARY': {
    country: 'UG',
    dept: 'bou_ug',
    scope: 'UG',
    role: 'spokesperson',
    is_utility: true,
    is_admin: true,
    role_label: 'Rural Banking & Microfinance Customer Desk, Centenary Bank',
    real_title_short: 'Consumer Desk (Centenary)',
    entity_type: 'non_government_entity',
    entity_category: 'banking_finance',
    organization_name: 'Centenary Rural Development Bank Ltd',
    officer_name: 'Fabian Kasi (Managing Director, Centenary Bank)',
    professional_identity: 'Rural Banking & Microfinance Desk Director',
  },

  // --- CATEGORY 12: RETAIL SHOPS, SUPERMARKETS & WHOLESALE TRADERS ---
  'SHOP-KIKUBO-01': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    is_admin: true,
    role_label: 'Proprietor & General Merchant, Kikuubo Wholesale & Retail Traders Hub',
    real_title_short: 'Proprietor (Kikuubo Traders)',
    entity_type: 'non_government_entity',
    entity_category: 'retail_shops',
    organization_name: 'Kikuubo Wholesale & Retail Traders Hub',
    officer_name: 'Godfrey Kayongo (Proprietor & Trade Association Lead)',
    professional_identity: 'Wholesale & Retail Merchant / Proprietor',
    business_typology: 'Wholesale & Retail Commercial Trading Depot',
  },
  'SHOP-QUICKMART-01': {
    country: 'KE',
    dept: 'nairobi',
    scope: 'nairobi',
    role: 'spokesperson',
    is_utility: true,
    is_admin: true,
    role_label: 'Store Operations & Customer Experience Manager, Quickmart Supermarket',
    real_title_short: 'Store Manager (Quickmart)',
    entity_type: 'non_government_entity',
    entity_category: 'retail_shops',
    organization_name: 'Quickmart Supermarket (Nairobi CBD Branch)',
    officer_name: 'Faith Muthoni (Store General Manager)',
    professional_identity: 'Supermarket Store General Manager',
    business_typology: 'Supermarket & FMCG Retail Branch',
  },

  // --- CATEGORY 13: BARS, NIGHTCLUBS, LOUNGES & ENTERTAINMENT ---
  'BAR-HAVANA-KLA': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    is_admin: true,
    role_label: 'Managing Director & Venue Proprietor, Havana Bar & Lounge Kololo',
    real_title_short: 'Owner / MD (Havana Lounge)',
    entity_type: 'non_government_entity',
    entity_category: 'nightlife_bars',
    organization_name: 'Havana Bar, Restaurant & Sports Lounge',
    officer_name: 'Patrick Banya (Proprietor & Managing Director)',
    professional_identity: 'Bar & Hospitality Venue Owner / Proprietor',
    business_typology: 'Bar, Nightclub & Sports Lounge',
  },
  'BAR-ALCHEMIST-NRB': {
    country: 'KE',
    dept: 'nairobi',
    scope: 'nairobi',
    role: 'spokesperson',
    is_utility: true,
    is_admin: true,
    role_label: 'Venue General Manager & Community Relations, The Alchemist Bar',
    real_title_short: 'GM (The Alchemist)',
    entity_type: 'non_government_entity',
    entity_category: 'nightlife_bars',
    organization_name: 'The Alchemist Bar & Creative Hub (Westlands)',
    officer_name: 'Peng Chen / Michelle Slater (Venue Operations)',
    professional_identity: 'Entertainment Venue Director',
    business_typology: 'Cultural Lounge & Arts Bar',
  },

  // --- CATEGORY 14: PHARMACIES, DRUG SHOPS & CHEMISTS ---
  'PHARM-GOODLIFE-01': {
    country: 'UG',
    dept: 'nda_ug',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    is_admin: true,
    role_label: 'Supervising Pharmacist & Quality Dispenser, GoodLife Pharmacy',
    real_title_short: 'Lead Pharmacist (GoodLife)',
    entity_type: 'non_government_entity',
    entity_category: 'pharmacy_chemists',
    organization_name: 'GoodLife Pharmacy & Drug Dispensary',
    officer_name: 'Pharm. Derrick Tumwesigye (Head of Dispensing)',
    professional_identity: 'Supervising Pharmacist / Pharmacy Owner',
    business_typology: 'Community Pharmacy & Medical Drug Shop',
  },

  // --- CATEGORY 15: GARAGES, AUTO MECHANICS & ARTISANS ---
  'GAR-EXPRESS-01': {
    country: 'UG',
    dept: 'kcca',
    scope: 'kla',
    role: 'spokesperson',
    is_utility: true,
    is_admin: true,
    role_label: 'Chief Auto Electrician & Master Mechanic, Express Motor Works',
    real_title_short: 'Master Mechanic (Express Auto)',
    entity_type: 'non_government_entity',
    entity_category: 'artisans_garages',
    organization_name: 'Express Motor Works & Artisans Workshop Hub',
    officer_name: 'Eng. Isaac Katende (Chief Mechanic & Founder)',
    professional_identity: 'Auto Garage Proprietor / Master Craftsman',
    business_typology: 'Automotive Repair & Metal Fabrication Workshop',
  },
};

// Auto-populate sovereign credentials in GOV_CODES for every global country in COUNTRIES after module initialization
queueMicrotask(() => {
  if (!COUNTRIES) return;
  Object.entries(COUNTRIES).forEach(([code, info]) => {
    const hasCodes = Object.values(GOV_CODES).some((d) => d.country === code);
    if (!hasCodes) {
      const lc = code.toLowerCase();
      GOV_CODES[`${code}-PS-LOCAL-GOV`] = {
        country: code as CountryCode,
        dept: `${lc}_local_gov`,
        scope: code,
        role: 'platform_admin',
        is_utility: false,
        role_label: `Permanent Secretary / National Superadmin, Ministry of Local Government (${info.name})`,
        real_title_short: `Perm. Sec. Local Gov (${code})`,
        hierarchy_level: 'tier5_perm_sec',
        escalation_rank: 5,
      };
      GOV_CODES[`${code}-CITY-MAYOR`] = {
        country: code as CountryCode,
        dept: `${lc}_gov`,
        scope: `${lc}_capital_reg`,
        role: 'node_admin',
        is_utility: false,
        role_label: `Metropolitan Mayor / Chief Executive Officer, ${info.name} Capital Region`,
        real_title_short: `Metro Mayor (${code})`,
        hierarchy_level: 'tier3_district_cao',
        escalation_rank: 3,
      };
      GOV_CODES[`${code}-WATER-UTIL`] = {
        country: code as CountryCode,
        dept: `${lc}_water`,
        scope: code,
        role: 'spokesperson',
        is_utility: true,
        role_label: `Managing Director, ${info.name} National Water & Sewerage Utility`,
        real_title_short: `MD Water Utility (${code})`,
        hierarchy_level: 'tier4_agency',
        escalation_rank: 4,
      };
      GOV_CODES[`${code}-POWER-GRID`] = {
        country: code as CountryCode,
        dept: `${lc}_power`,
        scope: code,
        role: 'spokesperson',
        is_utility: true,
        role_label: `Chief Grid Operations Director, ${info.name} National Electric Utility`,
        real_title_short: `Grid Director (${code})`,
        hierarchy_level: 'tier4_agency',
        escalation_rank: 4,
      };
      GOV_CODES[`${code}-AUDITOR-GEN`] = {
        country: code as CountryCode,
        dept: `${lc}_ombudsman`,
        scope: code,
        role: 'read_only',
        is_utility: false,
        role_label: `Auditor General & Anti-Corruption Ombudsman (${info.name})`,
        real_title_short: `Auditor General (${code})`,
        hierarchy_level: 'tier5_perm_sec',
        escalation_rank: 5,
      };
    }
  });
});

export function getBusinessTitlePresets(category?: string): string[] {
  switch (category) {
    case 'retail_shops':
      return [
        'Proprietor & General Merchant',
        'Store General Manager',
        'Wholesale Operations Lead',
        'Floor Supervisor',
        'Inventory & Customer Relations Lead',
        'Cashier & Desk Clerk',
        'Other (Specify Exact Title)',
      ];
    case 'nightlife_bars':
      return [
        'Bar & Lounge Owner / Managing Director',
        'Venue General Manager',
        'Food & Beverage Lead',
        'Floor & Guest Experience Supervisor',
        'Head Mixologist & Bar Lead',
        'Security & Guest Safety Coordinator',
        'Other (Specify Exact Title)',
      ];
    case 'pharmacy_chemists':
      return [
        'Supervising Pharmacist & Director',
        'Licensed Dispenser / Drug Shop Owner',
        'Clinical Pharmacy Consultant',
        'Quality Assurance Officer',
        'Patient Triage & Prescription Clerk',
        'Other (Specify Exact Title)',
      ];
    case 'artisans_garages':
      return [
        'Chief Auto Mechanic & Workshop Master',
        'Garage Managing Partner',
        'Lead Diagnostics Technician',
        'Artisan & Metal Fabrication Lead',
        'Service Advisor & Client Desk Lead',
        'Other (Specify Exact Title)',
      ];
    case 'food_dining':
      return [
        'Restaurant Proprietor / General Manager',
        'Executive Chef & Kitchen Lead',
        'Customer Satisfaction & QA Lead',
        'Operations & Delivery Supervisor',
        'Other (Specify Exact Title)',
      ];
    case 'education':
      return [
        'Headteacher / School Principal',
        'Academic Registrar',
        'Director of Studies (DOS)',
        'School Administrator & Bursar',
        'Student Welfare & Complaints Officer',
        'Other (Specify Exact Title)',
      ];
    case 'health':
      return [
        'Medical Director / Lead Physician',
        'Clinical Officer / Matron',
        'Hospital Administrator',
        'Patient Ombudsman & Quality Lead',
        'Other (Specify Exact Title)',
      ];
    case 'banking_finance':
      return [
        'Branch Manager / Director',
        'SACCO Chairperson & Secretary',
        'Consumer Protection Ombudsman',
        'Credit & Loan Operations Officer',
        'Customer Service Lead',
        'Other (Specify Exact Title)',
      ];
    default:
      return [
        'Proprietor / Managing Director',
        'Chief Executive Officer (CEO)',
        'Operations Manager',
        'Customer Relations Desk Lead',
        'Quality Assurance Lead',
        'Duty Desk Officer',
        'Other (Specify Exact Title)',
      ];
  }
}

export function getCountryCapacityPresets(countryCode?: string): string[] {
  const code = (countryCode || 'UG').toUpperCase();
  switch (code) {
    case 'UG':
      return [
        'Resident District Commissioner (RDC) / CAO',
        'World Bank / International Development Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Community Watchdog',
        'Inspectorate of Government (IGG) Auditor',
        'Ministry / KCCA Supervising Engineer',
      ];
    case 'KE':
      return [
        'County Executive (CECM) / SubCounty Admin',
        'World Bank / AfDB Development Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Ward Citizen',
        'Ethics & Anti-Corruption (EACC) Auditor',
        'Ministry Supervising Engineer',
      ];
    case 'NG':
      return [
        'LGA Chairman / State Commissioner',
        'World Bank / AfDB Development Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Community Watchdog',
        'ICPC / EFCC Anti-Corruption Auditor',
        'Ministry Supervising Engineer',
      ];
    case 'GH':
      return [
        'District Chief Executive (DCE) / Assembly Member',
        'World Bank / AfDB Development Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Community Watchdog',
        'CHRAJ Auditor / Public Inspector',
        'Ministry Supervising Engineer',
      ];
    case 'RW':
      return [
        'District Mayor / Sector Executive Secretary',
        'World Bank / AfDB Development Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Umuganda Representative',
        'Office of the Ombudsman Auditor',
        'Ministry Supervising Engineer',
      ];
    case 'TZ':
      return [
        'Regional Commissioner (RC) / District Director (DED)',
        'World Bank / AfDB Development Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Ward Representative',
        'TAKUKURU Anti-Corruption Auditor',
        'Ministry Supervising Engineer',
      ];
    case 'ZA':
      return [
        'Municipal Manager / Ward Officer',
        'World Bank / Development Bank Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Community Watchdog',
        'Special Investigating Unit (SIU) Auditor',
        'Department Supervising Engineer',
      ];
    case 'SN':
      return [
        'Préfet de Département / Maire',
        'Banque Mondiale / Inspecteur International',
        'Journaliste / Presse',
        'Ingénieur de Chantier (Contractant)',
        'Résident Local / Citoyen',
        'Inspecteur d\'État (OFNAC)',
        'Ingénieur de Supervision Ministériel',
      ];
    case 'ZM':
      return [
        'Provincial Govt Officer / Town Clerk',
        'World Bank / AfDB Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / WDC Chair',
        'ACC Anti-Corruption Auditor',
        'Ministry Supervising Engineer',
      ];
    case 'ZW':
      return [
        'Provincial Director / CEO Town Clerk',
        'World Bank / AfDB Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Ward Officer',
        'ZACC Anti-Corruption Auditor',
        'Ministry Supervising Engineer',
      ];
    case 'US':
      return [
        'County Executive / City Manager',
        'World Bank / Federal Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Community Advisory',
        'Office of Inspector General (OIG)',
        'Department of Transportation Engineer',
      ];
    case 'GB':
      return [
        'Council Chief Executive / Ward Officer',
        'World Bank / Infrastructure Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Community Watchdog',
        'National Audit Office (NAO) Auditor',
        'Supervising Civil Engineer',
      ];
    case 'IN':
      return [
        'District Collector (DM) / BDO / Sarpanch',
        'World Bank / ADB Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Gram Sabha Watchdog',
        'Lokayukta / Vigilance Auditor',
        'PWD Supervising Engineer',
      ];
    default:
      return [
        'District Procuring Entity Officer',
        'World Bank / International Development Inspector',
        'Media Reporter / Press',
        'Contractor Site Engineer',
        'Local Resident / Community Watchdog',
        'Public Procurement Auditor',
        'Ministry Supervising Engineer',
      ];
  }
}

export const NATIONAL_ROLLOUTS: Record<string, import('../types').NationalRolloutArrangement> = {
  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    flag: 'UG',
    totalTargetDesks: 14153,
    primaryUnitName: 'Parishes (LC II / Parish Chiefs)',
    tiersDescription: '1 OPM HQ → 146 CAO Districts → 1,438 SubCounties → 10,515 Parishes',
    superadminMinistry: 'Ministry of Local Government (MoLG)',
    superadminTitle: 'PS MoLG Superadmin',
    superadminSubtitle: 'National Local Government Rollout & PDM Command Center',
    superadminShort: 'PS MoLG',
    superadminDescription: 'National Local Gov Rollout: Orchestrate 146 Districts, 10 Cities, 31 Municipalities, and 10,595 Parish PDM Desks.',
    superadminDeskButton: 'Open PS MoLG Desk',
    superadminRefCode: 'MOLG-STATUTORY-UG-2026',
    lowestOfficerTitle: 'Parish Chief',
    lowestOfficerUnit: 'Parish (PDM Node)',
    lowestOfficerTeamRoles: [
      { role: 'Community Development Officer (CDO)', description: 'Parish mobilization, household wealth assessments & enterprise registration', defaultName: 'Namukasa Florence' },
      { role: 'Agriculture & Extension Specialist', description: 'Agronomy advisory, climate-resilient inputs & post-harvest tracking', defaultName: 'Mwesigwa Emmanuel' },
      { role: 'Village Health Teams Lead (VHT)', description: 'Primary health, clinic referrals & sanitation compliance', defaultName: 'Akello Prossy' },
      { role: 'Parish SACCO Fund Auditor', description: 'Financial verification, loan disbursement oversight & treasury reporting', defaultName: 'Okello Denis' },
      { role: 'Local Council Liaison & Watchdog', description: 'LC I village elders coordination & civic dispute escalation', defaultName: 'Kigozi Ronald' },
    ],
    targets: {
      l1Title: 'L1 · Permanent Secretary / OPM HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · CAOs, SubCounty Chiefs, Town Clerks',
      l2l3Target: 2587,
      l4Title: 'L4 · Parish Chiefs (Primary Local Desk)',
      l4Target: 10515,
      l5Title: 'L5 · Area Engineers / Utility Branch Managers',
      l5Target: 550,
      roTitle: 'Read-Only · RDCs, MPs, District Auditors & Media',
      roTarget: 500,
    },
  },
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    flag: 'KE',
    totalTargetDesks: 2458,
    primaryUnitName: 'Wards (Ward Administrators)',
    tiersDescription: '1 PS Office → 47 CECM County Executives → 290 SubCounty Admins → 1,450 Wards',
    superadminMinistry: 'Ministry of Interior & National Administration (Devolution)',
    superadminTitle: 'PS Devolution Superadmin',
    superadminSubtitle: 'Intergovernmental Devolution & County Local Administration Command',
    superadminShort: 'PS Devolution',
    superadminDescription: 'Devolved County Governance Rollout: Orchestrate 47 Counties, 290 Sub-Counties, and 1,450 Devolved Wards.',
    superadminDeskButton: 'Open PS Devolution Desk',
    superadminRefCode: 'DEV-KE-2026',
    lowestOfficerTitle: 'Ward Administrator',
    lowestOfficerUnit: 'Ward Devolved Unit',
    lowestOfficerTeamRoles: [
      { role: 'Ward Development Officer', description: 'Community project coordination, ward bursaries & public participation', defaultName: 'Mwangi Kevin' },
      { role: 'Agricultural Field Officer', description: 'Farmers advisory, seed distribution & livestock vaccination', defaultName: 'Wanjiku Grace' },
      { role: 'Community Health Promoter Lead (CHP)', description: 'Maternal health, immunization monitoring & village sanitation', defaultName: 'Otieno Brian' },
      { role: 'Works & Infrastructure Overseer', description: 'Ward access roads, culverts & rural water kiosk monitoring', defaultName: 'Kipkorir Dennis' },
      { role: 'Ward SACCO & Enterprise Coordinator', description: 'Hustler Fund / SME cooperative monitoring & audit reporting', defaultName: 'Chebet Faith' },
    ],
    targets: {
      l1Title: 'L1 · Principal Secretary / National Treasury',
      l1Target: 1,
      l2l3Title: 'L2–L3 · County CECMs & SubCounty Administrators',
      l2l3Target: 337,
      l4Title: 'L4 · Ward Administrators (Primary Local Desk)',
      l4Target: 1450,
      l5Title: 'L5 · KPLC / Nairobi Water Branch Managers',
      l5Target: 320,
      roTitle: 'Read-Only · County Assembly, Senators & Oversight',
      roTarget: 350,
    },
  },
  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    flag: 'NG',
    totalTargetDesks: 10824,
    primaryUnitName: 'Wards (Ward Councillors & Desk Officers)',
    tiersDescription: '1 Federal PS → 36 State Commissioners → 774 LGA Chairmen → 8,812 Wards',
    targets: {
      l1Title: 'L1 · Permanent Secretary / Federal Govt',
      l1Target: 1,
      l2l3Title: 'L2–L3 · State Commissioners & LGA Chairmen',
      l2l3Target: 811,
      l4Title: 'L4 · Ward Councillors & Desk Officers (Primary Desk)',
      l4Target: 8812,
      l5Title: 'L5 · DisCo / Water Board District Engineers',
      l5Target: 1200,
      roTitle: 'Read-Only · Anti-Corruption, Lawmakers & Observers',
      roTarget: 1000,
    },
  },
  GH: {
    countryCode: 'GH',
    countryName: 'Ghana',
    flag: 'GH',
    totalTargetDesks: 7398,
    primaryUnitName: 'Communities (Assembly Members & Unit Committees)',
    tiersDescription: '1 Chief Director → 16 Regional Coordinating Directors → 261 DCEs → 6,270 Electoral Areas',
    targets: {
      l1Title: 'L1 · Chief Director / Local Govt Ministry',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Regional RCDs & District DCEs / MCEs',
      l2l3Target: 277,
      l4Title: 'L4 · Electoral Area Assembly Members (Primary Desk)',
      l4Target: 6270,
      l5Title: 'L5 · ECG / GWCL Regional Engineers',
      l5Target: 450,
      roTitle: 'Read-Only · MPs, Regional Auditors & Press',
      roTarget: 400,
    },
  },
  RW: {
    countryCode: 'RW',
    countryName: 'Rwanda',
    flag: 'RW',
    totalTargetDesks: 3025,
    primaryUnitName: 'Cells (Cell Executive Secretaries)',
    tiersDescription: '1 MINALOC PS → 5 Governors → 30 Mayors → 416 Sector ES → 2,148 Cell ES',
    targets: {
      l1Title: 'L1 · Permanent Secretary / MINALOC',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Governors, Mayors & Sector Exec. Secretaries',
      l2l3Target: 446,
      l4Title: 'L4 · Cell Executive Secretaries (Primary Local Desk)',
      l4Target: 2148,
      l5Title: 'L5 · REG / WASAC Branch Technicians',
      l5Target: 180,
      roTitle: 'Read-Only · Ombudsman, Advisory Council & Media',
      roTarget: 250,
    },
  },
  TZ: {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    flag: 'TZ',
    totalTargetDesks: 4867,
    primaryUnitName: 'Wards (Ward Executive Officers - WEO)',
    tiersDescription: '1 PS TAMISEMI → 31 Regional Commissioners → 184 DEDs → 3,956 Wards',
    targets: {
      l1Title: 'L1 · Permanent Secretary / TAMISEMI HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Regional RCs & District Executive Directors',
      l2l3Target: 215,
      l4Title: 'L4 · Ward Executive Officers (Primary Local Desk)',
      l4Target: 3956,
      l5Title: 'L5 · TANESCO / DAWASA District Managers',
      l5Target: 400,
      roTitle: 'Read-Only · TAKUKURU, MPs & Regional Auditors',
      roTarget: 300,
    },
  },
  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    flag: 'ZA',
    totalTargetDesks: 5885,
    primaryUnitName: 'Wards (Ward Councillors & Ward Committees)',
    tiersDescription: '1 DG COGTA → 9 Provincial HoDs → 257 Municipal Managers → 4,468 Wards',
    targets: {
      l1Title: 'L1 · Director-General / COGTA HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Provincial HoDs & Municipal Managers',
      l2l3Target: 266,
      l4Title: 'L4 · Ward Councillors & Committee Desks',
      l4Target: 4468,
      l5Title: 'L5 · Eskom / Water Metro Depot Engineers',
      l5Target: 650,
      roTitle: 'Read-Only · Public Protector, Council & Media',
      roTarget: 500,
    },
  },
  ET: {
    countryCode: 'ET',
    countryName: 'Ethiopia',
    flag: 'ET',
    totalTargetDesks: 20481,
    primaryUnitName: 'Kebeles (Kebele Administrators)',
    tiersDescription: '1 State Minister → 12 Regional Bureau Heads → 1,068 Woreda Admins → 18,000 Kebeles',
    targets: {
      l1Title: 'L1 · State Minister / MoUDC HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Regional Bureau Heads & Woreda Administrators',
      l2l3Target: 1080,
      l4Title: 'L4 · Kebele Administrators (Primary Local Desk)',
      l4Target: 18000,
      l5Title: 'L5 · EEU / Water Supply Branch Heads',
      l5Target: 800,
      roTitle: 'Read-Only · Federal Auditors & Observers',
      roTarget: 600,
    },
  },
  EG: {
    countryCode: 'EG',
    countryName: 'Egypt',
    flag: 'EG',
    totalTargetDesks: 6201,
    primaryUnitName: 'Local Units (Sheikha / Village Chiefs)',
    tiersDescription: '1 Ministry Deputy → 27 Governors → 300+ Markaz / City Chiefs → 4,600 Local Units',
    targets: {
      l1Title: 'L1 · Deputy Minister / Local Development',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Governors & Markaz / District Chiefs',
      l2l3Target: 350,
      l4Title: 'L4 · Local Unit Chiefs & Sheikha Officers',
      l4Target: 4600,
      l5Title: 'L5 · EEHC / Water Co Zone Engineers',
      l5Target: 750,
      roTitle: 'Read-Only · Parliamentary Committee & Oversight',
      roTarget: 500,
    },
  },
  SN: {
    countryCode: 'SN',
    countryName: 'Senegal',
    flag: 'SN',
    totalTargetDesks: 1018,
    primaryUnitName: 'Communes (Maires / Chefs de Commune)',
    tiersDescription: '1 DG CNDT → 14 Gouverneurs → 46 Préfets → 557 Communes',
    targets: {
      l1Title: 'L1 · Directeur Général / CNDT HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Gouverneurs de Région & Préfets',
      l2l3Target: 60,
      l4Title: 'L4 · Maires & Chefs de Commune (Bureau Principal)',
      l4Target: 557,
      l5Title: 'L5 · SENELEC / SEN’EAU Chefs d’Agence',
      l5Target: 200,
      roTitle: 'Read-Only · OFNAC, Députés & Médias',
      roTarget: 200,
    },
  },
  ZM: {
    countryCode: 'ZM',
    countryName: 'Zambia',
    flag: 'ZM',
    totalTargetDesks: 2435,
    primaryUnitName: 'Wards (WDC Committee Chairs)',
    tiersDescription: '1 PS MLGH → 10 Provincial Officers → 116 Town Clerks → 1,858 Wards',
    targets: {
      l1Title: 'L1 · Permanent Secretary / MLGH HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · PLGOs & Town Clerks / Council Secretaries',
      l2l3Target: 126,
      l4Title: 'L4 · Ward Development Committee Chairs',
      l4Target: 1858,
      l5Title: 'L5 · ZESCO / Utility District Engineers',
      l5Target: 250,
      roTitle: 'Read-Only · ACC, MPs & Local Government Auditors',
      roTarget: 200,
    },
  },
  ZW: {
    countryCode: 'ZW',
    countryName: 'Zimbabwe',
    flag: 'ZW',
    totalTargetDesks: 2461,
    primaryUnitName: 'Wards (Ward Executive Officers)',
    tiersDescription: '1 PS MLGP → 10 Provincial Directors → 92 Council CEOs → 1,958 Wards',
    targets: {
      l1Title: 'L1 · Permanent Secretary / MLGP HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Provincial Directors & Council CEOs / Town Clerks',
      l2l3Target: 102,
      l4Title: 'L4 · Ward Executive Officers (Primary Local Desk)',
      l4Target: 1958,
      l5Title: 'L5 · ZETDC / Municipal Water Zone Managers',
      l5Target: 220,
      roTitle: 'Read-Only · ZACC, MPs & Council Auditors',
      roTarget: 180,
    },
  },
  US: {
    countryCode: 'US',
    countryName: 'United States',
    flag: 'US',
    totalTargetDesks: 46144,
    primaryUnitName: 'Districts (Neighborhood Commissioners)',
    tiersDescription: '1 Cabinet Secretary → 50 State/County Executives → 3,142 City Managers → 35,000 District ANCs',
    targets: {
      l1Title: 'L1 · Cabinet Secretary / State Director',
      l1Target: 1,
      l2l3Title: 'L2–L3 · County Executives & City Managers',
      l2l3Target: 3143,
      l4Title: 'L4 · Advisory Neighborhood Commissioners (ANC)',
      l4Target: 35000,
      l5Title: 'L5 · Power / Transit District Engineers',
      l5Target: 5000,
      roTitle: 'Read-Only · Inspector General, Council & Press',
      roTarget: 3000,
    },
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    flag: 'GB',
    totalTargetDesks: 11234,
    primaryUnitName: 'Wards (Ward Councillors & Officers)',
    tiersDescription: '1 PS DLUHC → 333 Council Chief Execs → Parish Clerks → 9,500 Wards',
    targets: {
      l1Title: 'L1 · Permanent Secretary / DLUHC HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Council Chief Executives & Town Clerks',
      l2l3Target: 333,
      l4Title: 'L4 · Ward Councillors & Local Officers',
      l4Target: 9500,
      l5Title: 'L5 · Water & Energy Utility Area Managers',
      l5Target: 800,
      roTitle: 'Read-Only · Audit Commission, MPs & Ombudsmen',
      roTarget: 600,
    },
  },
  IN: {
    countryCode: 'IN',
    countryName: 'India',
    flag: 'IN',
    totalTargetDesks: 287501,
    primaryUnitName: 'Panchayats / Wards (Gram Panchayat Secretaries)',
    tiersDescription: '1 Ministry Secretary → 36 State DMs → 6,700 BDOs → 255,000 Gram Panchayats',
    targets: {
      l1Title: 'L1 · Secretary / Ministry of Panchayati Raj',
      l1Target: 1,
      l2l3Title: 'L2–L3 · District Collectors (DM) & BDOs',
      l2l3Target: 7500,
      l4Title: 'L4 · Gram Panchayat Secretaries & Ward Officers',
      l4Target: 255000,
      l5Title: 'L5 · State DISCOM / Jal Board Engineers',
      l5Target: 15000,
      roTitle: 'Read-Only · Lokayukta, State Vigilance & Media',
      roTarget: 10000,
    },
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    flag: 'DE',
    totalTargetDesks: 11210,
    primaryUnitName: 'Gemeinden & Ortsbezirke (Ortsvorsteher / Bezirksamtsleiter)',
    tiersDescription: '1 BMI Federal Minister/State Secretary → 16 Bundesländer Ministers → 401 Landräte/Oberbürgermeister → 10,753 Gemeinden',
    superadminMinistry: 'Bundesministerium des Innern und für Heimat (BMI)',
    superadminTitle: 'BMI Federal Superadmin',
    superadminSubtitle: 'Federal Administrative Modernization & Kommunale Rollout Command',
    superadminShort: 'BMI Federal',
    superadminDescription: 'Federal Local Governance Rollout: Orchestrate 16 Bundesländer, 401 Landkreise/Kreisfreie Städte, and 10,753 Gemeinden.',
    superadminDeskButton: 'Open BMI Federal Desk',
    superadminRefCode: 'BMI-DE-2026',
    lowestOfficerTitle: 'Ortsvorsteher / Bezirksamtsleiter',
    lowestOfficerUnit: 'Gemeinde / Ortsbezirk Node',
    lowestOfficerTeamRoles: [
      { role: 'Kommunaler Entwicklungsleiter (CDO)', description: 'Bürgerbeteiligung, Quartiersentwicklung & kommunale Förderung', defaultName: 'Schneider Thomas' },
      { role: 'Leiter Ordnungs- & Meldeamt', description: 'Öffentliche Sicherheit, Gewerbeaufsicht & Meldeangelegenheiten', defaultName: 'Weber Claudia' },
      { role: 'Tiefbau & Infrastruktur Inspektor', description: 'Strasseninstandhaltung, Kanalisation & Baustellenüberwachung', defaultName: 'Becker Stefan' },
      { role: 'Klimaanpassung & Umweltbeauftragter', description: 'Energieeffizienz, Hochwasserschutz & Grünflächen', defaultName: 'Hoffmann Laura' },
      { role: 'Gemeinde-Rechnungsprüfer', description: 'Kommunalhaushalt, Zweckverbandsprüfungen & Vergabekontrolle', defaultName: 'Wagner Martin' },
    ],
    targets: {
      l1Title: 'L1 · Federal State Secretary / BMI HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Landräte, Oberbürgermeister & Amtsdirektoren',
      l2l3Target: 417,
      l4Title: 'L4 · Ortsvorsteher & Bezirksamtsleiter (Primary Local Desk)',
      l4Target: 9800,
      l5Title: 'L5 · Stadtwerke / Netzbetreiber Technical Directors',
      l5Target: 650,
      roTitle: 'Read-Only · Bundesrechnungshof, MdBs & Landesrechnungshöfe',
      roTarget: 342,
    },
  },
};

export function getNationalRolloutArrangements(countryCode: string): import('../types').NationalRolloutArrangement {
  const code = (countryCode || 'UG').toUpperCase();
  const info = COUNTRIES[code];
  const countryName = info?.name || code;
  const flag = info?.flag || code;

  const base = NATIONAL_ROLLOUTS[code] || {
    countryCode: code,
    countryName,
    flag,
    totalTargetDesks: 1250,
    primaryUnitName: `${countryName} Grassroots Wards & Municipalities`,
    tiersDescription: `1 Central Executive Ministry → Regional / Provincial Governors → District Directors → Grassroots Local Units`,
    superadminMinistry: `${countryName} Ministry of Local Government & Internal Affairs`,
    superadminTitle: `${countryName} National Superadmin`,
    superadminSubtitle: 'National Administrative Modernization & Civic Command Center',
    superadminShort: `${code} Superadmin`,
    superadminDescription: `National Local Gov Rollout: Orchestrate executive departments, provincial jurisdictions, and grassroots community desks across ${countryName}.`,
    superadminDeskButton: `Open ${code} Desk`,
    superadminRefCode: `NAT-GOV-${code}-2026`,
    lowestOfficerTitle: 'Local Administrative Officer / Ward Lead',
    lowestOfficerUnit: 'Primary Local Node',
    lowestOfficerTeamRoles: [
      { role: 'Community Mobilization & Development Lead', description: 'Citizen engagement, grassroots registry and local project supervision', defaultName: 'Lead Officer' },
      { role: 'Public Works & Infrastructure Inspector', description: 'Feeder roads, water points and municipal asset maintenance', defaultName: 'Works Inspector' },
      { role: 'Health & Sanitation Coordinator', description: 'Primary clinic linkages, hygiene compliance and community wellness', defaultName: 'Health Link' },
      { role: 'Enterprise & Financial Auditor', description: 'Local micro-grant verification, SACCO compliance and audit log', defaultName: 'Compliance Auditor' },
      { role: 'Civic Watchdog & Community Elders Liaison', description: 'Local community mediation, conflict de-escalation and citizen alerts', defaultName: 'Civic Liaison' },
    ],
    targets: {
      l1Title: `L1 · Permanent Secretary / National Ministry HQ`,
      l1Target: 1,
      l2l3Title: `L2–L3 · Regional Governors & Municipal Mayors`,
      l2l3Target: 85,
      l4Title: `L4 · Local Administrative Officers & Ward Leads`,
      l4Target: 1050,
      l5Title: `L5 · Utility & Power Infrastructure Directors`,
      l5Target: 80,
      roTitle: `Read-Only · National Auditors, Parliamentarians & Watchdogs`,
      roTarget: 34,
    },
  };

  // Provide fallback default superadmin metadata if missing
  if (!base.superadminMinistry) base.superadminMinistry = `${countryName} Ministry of Local Governance`;
  if (!base.superadminTitle) base.superadminTitle = `${code} National Superadmin`;
  if (!base.superadminSubtitle) base.superadminSubtitle = 'National Decentralization & Local Governance Command';
  if (!base.superadminShort) base.superadminShort = `${code} Admin`;
  if (!base.superadminDescription) base.superadminDescription = `National Local Gov Rollout: Orchestrate ${base.tiersDescription}`;
  if (!base.superadminDeskButton) base.superadminDeskButton = `Open ${base.superadminShort} Desk`;
  if (!base.superadminRefCode) base.superadminRefCode = `GOV-${code}-2026`;
  if (!base.lowestOfficerTitle) base.lowestOfficerTitle = 'Local Accounting Officer';
  if (!base.lowestOfficerUnit) base.lowestOfficerUnit = base.primaryUnitName;

  return base;
}

export interface StatutoryDesignation {
  id: string;
  label: string;
  title: string;
  desc: string;
  role: 'platform_admin' | 'node_admin' | 'spokesperson' | 'read_only';
  isUtility?: boolean;
  category?: string;
}

export function getJurisdictionDesignations(
  country: CountryCode,
  tier: number,
  scope?: string
): StatutoryDesignation[] {
  const c = (country || 'UG').toUpperCase();

  if (c === 'UG') {
    if (tier === 5) {
      return [
        {
          id: 'cao_hire',
          label: '+ Chief Administrative Officer (CAO)',
          title: 'Chief Administrative Officer (CAO)',
          role: 'node_admin',
          desc: 'District Statutory Accounting Officer (Local Governments Act S.64)',
          isUtility: false,
          category: 'District Accounting Officers',
        },
        {
          id: 'tc_hire',
          label: '+ City Town Clerk',
          title: 'City Town Clerk',
          role: 'node_admin',
          desc: 'City Council Accounting Officer',
          isUtility: false,
          category: 'Urban Accounting Officers',
        },
        {
          id: 'muni_tc',
          label: '+ Municipal Town Clerk',
          title: 'Municipal Town Clerk',
          role: 'node_admin',
          desc: 'Municipal Council Accounting Officer',
          isUtility: false,
          category: 'Urban Accounting Officers',
        },
        {
          id: 'inspection_dir',
          label: '+ Commissioner Local Gov Inspection',
          title: 'Commissioner for Local Government Inspection',
          role: 'read_only',
          desc: 'National Quality Assurance & Inspection Directorate',
          isUtility: false,
          category: 'Oversight & Inspection',
        },
        {
          id: 'sister_agency',
          label: '+ Sister Ministry Liaison (UNRA / NWSC / UMEME)',
          title: 'Statutory Liaison Officer (UNRA / NWSC / UMEME)',
          role: 'spokesperson',
          desc: 'National Roads, Water & Power Infrastructure Desks',
          isUtility: true,
          category: 'Inter-Agency Utilities',
        },
        {
          id: 'auditor_gen',
          label: '+ Auditor General / Inspectorate Desk',
          title: 'National Value-for-Money Inspector',
          role: 'read_only',
          desc: 'Continuous Public Finance Audit (PFMA)',
          isUtility: false,
          category: 'Oversight & Inspection',
        },
        {
          id: 'others',
          label: '+ Others (specify)',
          title: '',
          role: 'spokesperson',
          desc: 'Custom National / Ministry Statutory Post with real-time title input',
          isUtility: false,
          category: 'Custom Statutory Post',
        },
      ];
    }
    if (tier === 3) {
      return [
        {
          id: 'sas_subcounty',
          label: '+ Sub-County Chief (SAS)',
          title: 'Senior Assistant Secretary (SAS) / Sub-County Chief',
          role: 'node_admin',
          desc: 'Sub-County Accounting Officer (Direct Report - Local Gov Act S.69)',
          isUtility: false,
          category: 'Lower Local Government Chiefs',
        },
        {
          id: 'div_tc',
          label: '+ Division Town Clerk',
          title: 'Division Town Clerk',
          role: 'node_admin',
          desc: 'Urban LLG Accounting Officer',
          isUtility: false,
          category: 'Lower Local Government Chiefs',
        },
        {
          id: 'dist_eng',
          label: '+ District Engineer (Roads & Public Works)',
          title: 'District Engineer (Roads & Public Works)',
          role: 'spokesperson',
          desc: 'District Technical Department Head',
          isUtility: false,
          category: 'Technical Directorate',
        },
        {
          id: 'dho',
          label: '+ District Health Officer (DHO)',
          title: 'District Health Officer (DHO)',
          role: 'spokesperson',
          desc: 'District Hospitals & Health Centers Lead',
          isUtility: false,
          category: 'Technical Directorate',
        },
        {
          id: 'dwo',
          label: '+ District Water Officer (DWO)',
          title: 'District Water Officer (DWO)',
          role: 'spokesperson',
          desc: 'Rural Boreholes & Water Supply Lead',
          isUtility: true,
          category: 'Technical Directorate',
        },
        {
          id: 'deo',
          label: '+ District Education Officer (DEO)',
          title: 'District Education Officer (DEO)',
          role: 'spokesperson',
          desc: 'Primary & Secondary Education Lead',
          isUtility: false,
          category: 'Technical Directorate',
        },
        {
          id: 'production',
          label: '+ District Production & Marketing Officer',
          title: 'District Production & Marketing Officer',
          role: 'spokesperson',
          desc: 'Agriculture, Veterinary, Fisheries & Commercial Lead',
          isUtility: false,
          category: 'Technical Directorate',
        },
        {
          id: 'natural_res',
          label: '+ District Natural Resources Officer',
          title: 'District Natural Resources Officer',
          role: 'spokesperson',
          desc: 'Environment, Forestry & Wetland Protection Lead',
          isUtility: false,
          category: 'Technical Directorate',
        },
        {
          id: 'dia',
          label: '+ District Internal Auditor (DIA)',
          title: 'District Internal Auditor (DIA)',
          role: 'read_only',
          desc: 'Statutory Audit Oversight (PFMA S.45)',
          isUtility: false,
          category: 'Statutory Oversight',
        },
        {
          id: 'commercial',
          label: '+ District Commercial Officer',
          title: 'District Commercial Officer',
          role: 'spokesperson',
          desc: 'SACCOs, Cooperatives & Trade Development Lead',
          isUtility: false,
          category: 'Economic Development',
        },
        {
          id: 'physical_planner',
          label: '+ District Physical Planner',
          title: 'District Physical Planner',
          role: 'spokesperson',
          desc: 'Land Use, Structural Planning & Zoning',
          isUtility: false,
          category: 'Technical Directorate',
        },
        {
          id: 'rdc_liaison',
          label: '+ Resident District Commissioner (RDC) Liaison',
          title: 'Resident District Commissioner (RDC) Liaison Desk',
          role: 'read_only',
          desc: 'Presidency & Central Security Oversight Liaison',
          isUtility: false,
          category: 'Statutory Oversight',
        },
        {
          id: 'others',
          label: '+ Others (specify)',
          title: '',
          role: 'spokesperson',
          desc: 'Custom District Statutory Desk with real-time title input',
          isUtility: false,
          category: 'Custom Statutory Post',
        },
      ];
    }
    if (tier === 2) {
      return [
        {
          id: 'parish_chief',
          label: '+ Parish Chief / Ward Agent (Direct Report)',
          title: 'Parish Chief / Ward Agent (Direct Report)',
          role: 'spokesperson',
          desc: 'Frontline Grassroots Unit Head (Direct Report)',
          isUtility: false,
          category: 'Grassroots Administration',
        },
        {
          id: 'cdo',
          label: '+ Community Development Officer (CDO)',
          title: 'Community Development Officer (CDO)',
          role: 'spokesperson',
          desc: 'Community & Dispute Mobilization Lead',
          isUtility: false,
          category: 'Community Services',
        },
        {
          id: 'agric',
          label: '+ Agric / Veterinary Extension Lead',
          title: 'Agric / Veterinary Extension Lead',
          role: 'spokesperson',
          desc: 'Enterprise & PDM Pillar 1 Lead',
          isUtility: false,
          category: 'Production & Enterprise',
        },
        {
          id: 'health_insp',
          label: '+ Sub-County Health Inspector',
          title: 'Sub-County Health Inspector',
          role: 'spokesperson',
          desc: 'Sanitation & Food Safety Inspector',
          isUtility: false,
          category: 'Health & Sanitation',
        },
        {
          id: 'pdm_clerk',
          label: '+ PDM SACCO Data Clerk',
          title: 'PDM SACCO Data Clerk',
          role: 'spokesperson',
          desc: 'Financial Inclusion & Fund Records',
          isUtility: false,
          category: 'PDM Finance & Records',
        },
        {
          id: 'sub_revenue',
          label: '+ Sub-County Revenue Collector',
          title: 'Sub-County Revenue Collector',
          role: 'read_only',
          desc: 'Local Revenue & Financial Monitoring',
          isUtility: false,
          category: 'Finance & Revenue',
        },
        {
          id: 'sub_eng',
          label: '+ Assistant Engineering Officer',
          title: 'Sub-County Assistant Engineering Officer',
          role: 'spokesperson',
          desc: 'Community Access Roads & Water Works Maintenance',
          isUtility: true,
          category: 'Public Works & Roads',
        },
        {
          id: 'pdc_sec',
          label: '+ PDC Secretary',
          title: 'Sub-County Parish Development Committee (PDC) Secretary',
          role: 'spokesperson',
          desc: 'PDM Planning & Monitoring Coordinator',
          isUtility: false,
          category: 'PDM Governance',
        },
        {
          id: 'others',
          label: '+ Others (specify)',
          title: '',
          role: 'spokesperson',
          desc: 'Custom Sub-County Technical or Statutory Desk with real-time title input',
          isUtility: false,
          category: 'Custom Statutory Post',
        },
      ];
    }
    // Tier 1 (Parish Level)
    return [
      {
        id: 'lc1_chair',
        label: '+ LC1 Village Chairperson Liaison',
        title: 'LC1 Village Chairperson Liaison',
        role: 'spokesperson',
        desc: 'Village Baraza & Frontline Notices',
        isUtility: false,
        category: 'Village Leadership',
      },
      {
        id: 'vht_coord',
        label: '+ Village Health Team (VHT) Coordinator',
        title: 'Village Health Team (VHT) Coordinator',
        role: 'spokesperson',
        desc: 'Household Health & Immunization Alerts',
        isUtility: false,
        category: 'Grassroots Health',
      },
      {
        id: 'pdm_mobilizer',
        label: '+ PDM SACCO Enterprise Mobilizer',
        title: 'PDM SACCO Enterprise Mobilizer',
        role: 'spokesperson',
        desc: 'Beneficiary Enterprise & Subsidy Verification',
        isUtility: false,
        category: 'PDM Mobilization',
      },
      {
        id: 'youth_women_rep',
        label: '+ Parish Youth & Women Representative',
        title: 'Parish Youth & Women Council Representative',
        role: 'spokesperson',
        desc: 'Affirmative Action Mobilization Lead',
        isUtility: false,
        category: 'Community Representation',
      },
      {
        id: 'water_caretaker',
        label: '+ Parish Water User Committee Secretary',
        title: 'Parish Water User Committee Secretary',
        role: 'spokesperson',
        desc: 'Community Borehole Maintenance & Sanitation',
        isUtility: true,
        category: 'Water & Sanitation',
      },
      {
        id: 'others',
        label: '+ Others (specify)',
        title: '',
        role: 'spokesperson',
        desc: 'Custom Parish Desk with real-time title input',
        isUtility: false,
        category: 'Custom Statutory Post',
      },
    ];
  }

  // Multi-country auto-adoption logic (KE, NG, GH, RW, TZ, ZA, ET, EG, SN, ZM, ZW, US, GB, IN, DE, etc.)
  const rollout = NATIONAL_ROLLOUTS[c];
  const presets = getQuickTitlePresets(c as CountryCode, scope);

  if (c === 'KE') {
    if (tier >= 4) {
      return [
        { id: 'sc_admin', label: '+ SubCounty Admin', title: 'SubCounty Administrator', role: 'node_admin', desc: 'Sub-County Desk Accounting Officer', isUtility: false, category: 'Sub-County Administration' },
        { id: 'cecm', label: '+ County CECM', title: 'County Executive Committee Member (CECM)', role: 'node_admin', desc: 'County Ministry HQ Lead', isUtility: false, category: 'County Executive' },
        { id: 'works', label: '+ County Works Dir', title: 'County Director of Roads & Infrastructure', role: 'spokesperson', desc: 'Infrastructure Department Head', isUtility: false, category: 'Infrastructure' },
        { id: 'health', label: '+ County Health Dir', title: 'County Director of Health Services', role: 'spokesperson', desc: 'Hospitals & Clinics Lead', isUtility: false, category: 'Health Services' },
        { id: 'audit', label: '+ County Auditor / EACC', title: 'County Internal Auditor / EACC Liaison', role: 'read_only', desc: 'Audit Oversight & Integrity', isUtility: false, category: 'Oversight' },
        { id: 'util', label: '+ KPLC / Water Mgr', title: 'Area Power / Water Manager (KPLC / Water Co.)', role: 'spokesperson', desc: 'Utility Services Desk', isUtility: true, category: 'Utilities' },
      ];
    }
    if (tier === 2) {
      return [
        { id: 'ward_admin', label: '+ Ward Admin', title: 'Ward Administrator', role: 'spokesperson', desc: 'Frontline Grassroots Ward Lead (Direct Report)', isUtility: false, category: 'Ward Administration' },
        { id: 'cdo', label: '+ Ward Development Officer', title: 'Ward Community Development Officer', role: 'spokesperson', desc: 'Community Mobilization & Dispute Lead', isUtility: false, category: 'Community Services' },
        { id: 'agric', label: '+ Sub-County Agric Officer', title: 'Sub-County Agricultural & Livestock Officer', role: 'spokesperson', desc: 'Farming & Extension Lead', isUtility: false, category: 'Agriculture & Extension' },
        { id: 'health_insp', label: '+ Public Health Officer', title: 'Ward Public Health Inspector', role: 'spokesperson', desc: 'Sanitation, Clinics & Food Safety', isUtility: false, category: 'Health & Sanitation' },
        { id: 'revenue', label: '+ Sub-County Revenue Collector', title: 'Sub-County Revenue Collector', role: 'read_only', desc: 'County Own-Source Revenue Desk', isUtility: false, category: 'Revenue & Finance' },
        { id: 'works_insp', label: '+ Sub-County Roads Inspector', title: 'Sub-County Roads & Infrastructure Inspector', role: 'spokesperson', desc: 'Feeder Roads & Drainage Works', isUtility: true, category: 'Works & Infrastructure' },
        { id: 'wdc_sec', label: '+ WDC Secretary', title: 'Ward Development Committee (WDC) Secretary', role: 'spokesperson', desc: 'Ward Projects & Public Baraza Coordinator', isUtility: false, category: 'Ward Governance' },
      ];
    }
    return [
      { id: 'village_elder', label: '+ Village Elder / Administrator', title: 'Village Administrator / Elder Liaison', role: 'spokesperson', desc: 'Village Baraza & Frontline Alerts', isUtility: false, category: 'Village Administration' },
      { id: 'chv_coord', label: '+ Community Health Volunteer (CHV)', title: 'CHV Health Promoter Coordinator', role: 'spokesperson', desc: 'Household Health & Immunization Link', isUtility: false, category: 'Community Health' },
      { id: 'project_rep', label: '+ Ward Project Committee Member', title: 'Ward Project Beneficiary Representative', role: 'spokesperson', desc: 'Community Monitoring & Verification', isUtility: false, category: 'Citizen Oversight' },
    ];
  }

  if (c === 'NG') {
    if (tier >= 4) {
      return [
        { id: 'lga_chair', label: '+ LGA Chairman', title: 'Local Government Area Chairman', role: 'node_admin', desc: 'LGA Executive Desk', isUtility: false, category: 'LGA Executive' },
        { id: 'commissioner', label: '+ State Commissioner', title: 'Commissioner for Local Government Affairs', role: 'node_admin', desc: 'State Executive HQ', isUtility: false, category: 'State Ministry' },
        { id: 'works', label: '+ HOD Works & Transport', title: 'Head of Department (HOD) Works & Transport', role: 'spokesperson', desc: 'Public Works Department Lead', isUtility: false, category: 'Public Works' },
        { id: 'health', label: '+ Primary Health Director', title: 'Director of Primary Healthcare', role: 'spokesperson', desc: 'LGA Health Services Lead', isUtility: false, category: 'Health Services' },
        { id: 'icpc', label: '+ State Auditor / ICPC', title: 'LGA Auditor / Anti-Corruption Officer', role: 'read_only', desc: 'Audit & Fiscal Oversight', isUtility: false, category: 'Oversight' },
        { id: 'disco', label: '+ DisCo / Water Lead', title: 'DisCo Power / State Water Area Manager', role: 'spokesperson', desc: 'Utility Desk', isUtility: true, category: 'Utilities' },
      ];
    }
    if (tier === 2) {
      return [
        { id: 'councillor', label: '+ Ward Councillor', title: 'Ward Councillor / Supervisory Lead', role: 'spokesperson', desc: 'Grassroots Ward Political & Executive Lead', isUtility: false, category: 'Ward Leadership' },
        { id: 'cdo', label: '+ Community Development Officer', title: 'Community Development Officer (CDO)', role: 'spokesperson', desc: 'Grassroots Mobilization & Welfare Lead', isUtility: false, category: 'Community Services' },
        { id: 'agric', label: '+ Agricultural Extension Officer', title: 'LGA Agricultural Extension Officer', role: 'spokesperson', desc: 'Crop, Livestock & Input Subsidies', isUtility: false, category: 'Agriculture' },
        { id: 'health_insp', label: '+ Environmental Health Officer', title: 'Environmental Health Officer (EHO)', role: 'spokesperson', desc: 'Sanitation, Waste & Market Inspection', isUtility: false, category: 'Sanitation' },
        { id: 'revenue', label: '+ LGA Revenue Collector', title: 'LGA Internal Revenue Collector', role: 'read_only', desc: 'Market & Local Tax Compliance', isUtility: false, category: 'Revenue & Finance' },
        { id: 'phc_lead', label: '+ PHC Facility Focal Person', title: 'Primary Healthcare Centre (PHC) Lead', role: 'spokesperson', desc: 'Clinic Operations & Maternal Care', isUtility: false, category: 'Primary Healthcare' },
      ];
    }
    return [
      { id: 'community_head', label: '+ Community Head / Baale Liaison', title: 'Community Leader / Youth Representative', role: 'spokesperson', desc: 'Town Baraza & Grievance Liaison', isUtility: false, category: 'Community Elders' },
      { id: 'chew_coord', label: '+ CHEW Health Worker', title: 'Community Health Extension Worker (CHEW)', role: 'spokesperson', desc: 'Household Health & Clinic Referral', isUtility: false, category: 'Community Health' },
    ];
  }

  if (c === 'RW') {
    if (tier >= 4) {
      return [
        { id: 'mayor', label: '+ District Mayor', title: 'District Mayor (Akarere)', role: 'node_admin', desc: 'District Executive Authority', isUtility: false, category: 'District Administration' },
        { id: 'sector_es', label: '+ Sector Executive Secretary', title: 'Sector Executive Secretary (Umurenge ES)', role: 'node_admin', desc: 'Sector Accounting Officer', isUtility: false, category: 'Sector Administration' },
        { id: 'infra', label: '+ District Infrastructure Chief', title: 'District Infrastructure & Sanitation Lead', role: 'spokesperson', desc: 'Engineering & Roads Lead', isUtility: false, category: 'Infrastructure' },
        { id: 'health', label: '+ District Health Officer', title: 'District Health Director', role: 'spokesperson', desc: 'District Hospitals & Clinics Lead', isUtility: false, category: 'Health Services' },
        { id: 'audit', label: '+ District Internal Auditor', title: 'District Internal Auditor (Akarere)', role: 'read_only', desc: 'Compliance & Audit Oversight', isUtility: false, category: 'Oversight' },
      ];
    }
    if (tier === 2) {
      return [
        { id: 'cell_es', label: '+ Cell Executive Secretary', title: 'Cell Executive Secretary (Akagari ES)', role: 'spokesperson', desc: 'Frontline Grassroots Cell Desk (Direct Report)', isUtility: false, category: 'Cell Administration' },
        { id: 'sedo', label: '+ Socio-Economic Officer (SEDO)', title: 'Socio-Economic Development Officer (SEDO)', role: 'spokesperson', desc: 'Community Welfare, VUP & Imihigo Lead', isUtility: false, category: 'Economic Development' },
        { id: 'agronomist', label: '+ Sector Agronomist', title: 'Sector Agronomist & Vet Extension Lead', role: 'spokesperson', desc: 'Agriculture, Livestock & Land Consolidation', isUtility: false, category: 'Agriculture & Livestock' },
        { id: 'health_insp', label: '+ Sector Health Officer', title: 'Sector Health & Sanitation Inspector', role: 'spokesperson', desc: 'Hygiene, Health Center Link & Nutrition', isUtility: false, category: 'Health & Sanitation' },
        { id: 'civil_status', label: '+ Civil Registration Officer', title: 'Sector Civil Status & Land Registrar', role: 'spokesperson', desc: 'Notary, Land Titles & Civil Records', isUtility: false, category: 'Civil Registration' },
        { id: 'revenue', label: '+ District Revenue Officer', title: 'RRA / Sector Revenue Agent', role: 'read_only', desc: 'Local Tax & Market Dues Monitoring', isUtility: false, category: 'Revenue' },
      ];
    }
    return [
      { id: 'village_lead', label: '+ Umudugudu Leader', title: 'Village Leader (Umudugudu)', role: 'spokesperson', desc: 'Grassroots Community Meeting & Inteko Lead', isUtility: false, category: 'Village Leadership' },
      { id: 'chw_coord', label: '+ Community Health Worker (CHW)', title: 'CHW Coordinator (Umujyanama w’ubuzima)', role: 'spokesperson', desc: 'Household Health, Nutrition & Vaccination', isUtility: false, category: 'Community Health' },
    ];
  }

  // Fallback for all other countries: map from rollout.lowestOfficerTeamRoles or presets
  const dynamicRoles: StatutoryDesignation[] = (rollout?.lowestOfficerTeamRoles || []).map((r, idx) => ({
    id: `role_${idx}`,
    label: `+ ${r.role}`,
    title: r.role,
    desc: r.description,
    role: 'spokesperson' as const,
    isUtility: r.role.toLowerCase().includes('water') || r.role.toLowerCase().includes('works') || r.role.toLowerCase().includes('infrastructure'),
    category: 'Field & Grassroots Operations',
  }));

  const standardPresets: StatutoryDesignation[] = presets.map((p) => ({
    id: p.id,
    label: p.label,
    title: p.title,
    desc: p.desc || p.title,
    role: p.role,
    isUtility: p.isUtility,
    category: 'Statutory Presets',
  }));

  const combined = [...standardPresets];
  for (const dr of dynamicRoles) {
    if (!combined.some((item) => item.title.toLowerCase() === dr.title.toLowerCase())) {
      combined.push(dr);
    }
  }

  return combined;
}

