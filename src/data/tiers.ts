import { CountryCode, GovernanceTier, GovCodeData } from '../types';
import { TERRITORY } from './countries';

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
  'PRJ-PERF-KPV89826': { country: 'UG', dept: 'kcca', scope: 'nakawa', role: 'spokesperson', is_utility: true },
  'UG-CAO-GULU': { country: 'UG', dept: 'molg', scope: 'gulu_d', role: 'node_admin', is_utility: false },
  'UG-CAO-0001': { country: 'UG', dept: 'molg', scope: 'gulu_d', role: 'node_admin', is_utility: false },
  'UG-CAO-WAKISO': { country: 'UG', dept: 'molg', scope: 'wjk', role: 'node_admin', is_utility: false },
  'CD-ADMIN-0001': { country: 'UG', dept: 'kcca', scope: 'UG', role: 'platform_admin', is_utility: false },
  'UG-KCCA-ADMIN': { country: 'UG', dept: 'kcca', scope: 'kla', role: 'node_admin', is_utility: false },
  'UG-NWSC-ADMIN': { country: 'UG', dept: 'nwsc', scope: 'UG', role: 'node_admin', is_utility: false },
  'UG-KCCA-2847': { country: 'UG', dept: 'kcca', scope: 'nakawa', role: 'spokesperson', is_utility: false },
  'UG-KCCA-3301': { country: 'UG', dept: 'kcca', scope: 'kawempe', role: 'spokesperson', is_utility: false },
  'UG-UMEME-1104': { country: 'UG', dept: 'umeme', scope: 'nakawa', role: 'spokesperson', is_utility: true },
  'UG-NWSC-3391': { country: 'UG', dept: 'nwsc', scope: 'wjk', role: 'spokesperson', is_utility: false },
  'UG-POLICE-0011': { country: 'UG', dept: 'upf', scope: 'UG', role: 'node_admin', is_utility: false },
  'UG-IGG-9999': { country: 'UG', dept: 'igg', scope: 'UG', role: 'node_admin', is_utility: false },
  'UG-RDC-READ': { country: 'UG', dept: 'kcca', scope: 'kla', role: 'read_only', is_utility: false },
  'KE-POWER-9912': { country: 'KE', dept: 'kplc', scope: 'kiti', role: 'spokesperson', is_utility: true },
  'KE-KPLC-ADMIN': { country: 'KE', dept: 'kplc', scope: 'KE', role: 'node_admin', is_utility: true },
  'KE-WARD-4410': { country: 'KE', dept: 'ncc', scope: 'kiti', role: 'spokesperson', is_utility: false },
  'KE-CECM-NBO': { country: 'KE', dept: 'ncc', scope: 'nbo', role: 'node_admin', is_utility: false },
  'KE-NWSC-2210': { country: 'KE', dept: 'nwco_ke', scope: 'wstl', role: 'spokesperson', is_utility: true },
  'KE-EACC-0011': { country: 'KE', dept: 'nps_ke', scope: 'KE', role: 'read_only', is_utility: false },
  'NG-WARD-2200': { country: 'NG', dept: 'lasg', scope: 'opebi', role: 'spokesperson', is_utility: false },
  'NG-CHAIRMAN-IKEJA': { country: 'NG', dept: 'lasg', scope: 'ikeja', role: 'node_admin', is_utility: false },
  'GH-ASSY-7712': { country: 'GH', dept: 'ecg', scope: 'osu_klottey', role: 'spokesperson', is_utility: false },
  'RW-CELL-3040': { country: 'RW', dept: 'reg', scope: 'rukiri_i', role: 'spokesperson', is_utility: false },
  'RW-SECTOR-KIMI': { country: 'RW', dept: 'mininfra', scope: 'kimironko', role: 'spokesperson', is_utility: false },
  'RW-MAYOR-GASABO': { country: 'RW', dept: 'mininfra', scope: 'gasabo', role: 'node_admin', is_utility: false },
  'GH-ECG-8801': { country: 'GH', dept: 'ecg', scope: 'GH', role: 'node_admin', is_utility: false },
  'RW-REG-6610': { country: 'RW', dept: 'reg', scope: 'RW', role: 'node_admin', is_utility: false },
  'TZ-WARD-1100': { country: 'TZ', dept: 'tanesco', scope: 'kivukoni', role: 'spokesperson', is_utility: false },
  'ZA-WARD-2200': { country: 'ZA', dept: 'joburg_water', scope: 'region_a', role: 'spokesperson', is_utility: false },
  'ET-KEBELE-3300': { country: 'ET', dept: 'eeu', scope: 'woreda_01', role: 'spokesperson', is_utility: false },
  'EG-WARD-4400': { country: 'EG', dept: 'eehc', scope: 'nasr_city', role: 'spokesperson', is_utility: false },
  'SN-COMM-5500': { country: 'SN', dept: 'senelec', scope: 'plateau', role: 'spokesperson', is_utility: false },
  'ZM-WARD-6600': { country: 'ZM', dept: 'zesco', scope: 'kabwata', role: 'spokesperson', is_utility: false },
  'ZW-WARD-7700': { country: 'ZW', dept: 'zetdc', scope: 'ward_1', role: 'spokesperson', is_utility: false },
  'US-DIST-8800': { country: 'US', dept: 'dot_us', scope: 'manhattan', role: 'spokesperson', is_utility: false },
  'GB-WARD-9900': { country: 'GB', dept: 'council_uk', scope: 'holborn', role: 'spokesperson', is_utility: false },
  'IN-PANCH-1010': { country: 'IN', dept: 'djb', scope: 'connaught_place', role: 'spokesperson', is_utility: false },
};

export function getCountryCapacityPresets(countryCode?: string): string[] {
  const code = (countryCode || 'UG').toUpperCase();
  switch (code) {
    case 'UG':
      return [
        '🏛️ Resident District Commissioner (RDC) / CAO',
        '🌍 World Bank / International Development Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Community Watchdog',
        '🔍 Inspectorate of Government (IGG) Auditor',
        '👷 Ministry / KCCA Supervising Engineer',
      ];
    case 'KE':
      return [
        '🏛️ County Executive (CECM) / SubCounty Admin',
        '🌍 World Bank / AfDB Development Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Ward Citizen',
        '🔍 Ethics & Anti-Corruption (EACC) Auditor',
        '👷 Ministry Supervising Engineer',
      ];
    case 'NG':
      return [
        '🏛️ LGA Chairman / State Commissioner',
        '🌍 World Bank / AfDB Development Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Community Watchdog',
        '🔍 ICPC / EFCC Anti-Corruption Auditor',
        '👷 Ministry Supervising Engineer',
      ];
    case 'GH':
      return [
        '🏛️ District Chief Executive (DCE) / Assembly Member',
        '🌍 World Bank / AfDB Development Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Community Watchdog',
        '🔍 CHRAJ Auditor / Public Inspector',
        '👷 Ministry Supervising Engineer',
      ];
    case 'RW':
      return [
        '🏛️ District Mayor / Sector Executive Secretary',
        '🌍 World Bank / AfDB Development Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Umuganda Representative',
        '🔍 Office of the Ombudsman Auditor',
        '👷 Ministry Supervising Engineer',
      ];
    case 'TZ':
      return [
        '🏛️ Regional Commissioner (RC) / District Director (DED)',
        '🌍 World Bank / AfDB Development Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Ward Representative',
        '🔍 TAKUKURU Anti-Corruption Auditor',
        '👷 Ministry Supervising Engineer',
      ];
    case 'ZA':
      return [
        '🏛️ Municipal Manager / Ward Officer',
        '🌍 World Bank / Development Bank Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Community Watchdog',
        '🔍 Special Investigating Unit (SIU) Auditor',
        '👷 Department Supervising Engineer',
      ];
    case 'SN':
      return [
        '🏛️ Préfet de Département / Maire',
        '🌍 Banque Mondiale / Inspecteur International',
        '📰 Journaliste / Presse',
        '🚜 Ingénieur de Chantier (Contractant)',
        '👥 Résident Local / Citoyen',
        '🔍 Inspecteur d\'État (OFNAC)',
        '👷 Ingénieur de Supervision Ministériel',
      ];
    case 'ZM':
      return [
        '🏛️ Provincial Govt Officer / Town Clerk',
        '🌍 World Bank / AfDB Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / WDC Chair',
        '🔍 ACC Anti-Corruption Auditor',
        '👷 Ministry Supervising Engineer',
      ];
    case 'ZW':
      return [
        '🏛️ Provincial Director / CEO Town Clerk',
        '🌍 World Bank / AfDB Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Ward Officer',
        '🔍 ZACC Anti-Corruption Auditor',
        '👷 Ministry Supervising Engineer',
      ];
    case 'US':
      return [
        '🏛️ County Executive / City Manager',
        '🌍 World Bank / Federal Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Community Advisory',
        '🔍 Office of Inspector General (OIG)',
        '👷 Department of Transportation Engineer',
      ];
    case 'GB':
      return [
        '🏛️ Council Chief Executive / Ward Officer',
        '🌍 World Bank / Infrastructure Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Community Watchdog',
        '🔍 National Audit Office (NAO) Auditor',
        '👷 Supervising Civil Engineer',
      ];
    case 'IN':
      return [
        '🏛️ District Collector (DM) / BDO / Sarpanch',
        '🌍 World Bank / ADB Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Gram Sabha Watchdog',
        '🔍 Lokayukta / Vigilance Auditor',
        '👷 PWD Supervising Engineer',
      ];
    default:
      return [
        '🏛️ District Procuring Entity Officer',
        '🌍 World Bank / International Development Inspector',
        '📰 Media Reporter / Press',
        '🚜 Contractor Site Engineer',
        '👥 Local Resident / Community Watchdog',
        '🔍 Public Procurement Auditor',
        '👷 Ministry Supervising Engineer',
      ];
  }
}

export const NATIONAL_ROLLOUTS: Record<string, import('../types').NationalRolloutArrangement> = {
  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    flag: '🇺🇬',
    totalTargetDesks: 14153,
    primaryUnitName: 'Parishes (LC II / Parish Chiefs)',
    tiersDescription: '1 OPM HQ → 146 CAO Districts → 1,438 SubCounties → 10,515 Parishes',
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
    flag: '🇰🇪',
    totalTargetDesks: 2458,
    primaryUnitName: 'Wards (Ward Administrators)',
    tiersDescription: '1 PS Office → 47 CECM County Executives → 290 SubCounty Admins → 1,450 Wards',
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
    flag: '🇳🇬',
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
    flag: '🇬🇭',
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
    flag: '🇷🇼',
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
    flag: '🇹🇿',
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
    flag: '🇿🇦',
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
    flag: '🇪🇹',
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
    flag: '🇪🇬',
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
    flag: '🇸🇳',
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
    flag: '🇿🇲',
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
    flag: '🇿🇼',
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
    flag: '🇺🇸',
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
    flag: '🇬🇧',
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
    flag: '🇮🇳',
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
};

export function getNationalRolloutArrangements(countryCode: string): import('../types').NationalRolloutArrangement {
  if (NATIONAL_ROLLOUTS[countryCode]) return NATIONAL_ROLLOUTS[countryCode];
  return {
    countryCode,
    countryName: countryCode,
    flag: '🌐',
    totalTargetDesks: 1000,
    primaryUnitName: 'Primary Local Desks',
    tiersDescription: '1 National Head → Regional Admins → Local Ward/Parish Officers',
    targets: {
      l1Title: 'L1 · Permanent Secretary / Ministry HQ',
      l1Target: 1,
      l2l3Title: 'L2–L3 · Regional & District Administrators',
      l2l3Target: 100,
      l4Title: 'L4 · Ward / Local Officers (Primary Desk)',
      l4Target: 750,
      l5Title: 'L5 · Utility & Branch Engineers',
      l5Target: 100,
      roTitle: 'Read-Only · Auditors & Observers',
      roTarget: 49,
    },
  };
}
