import { CountryCode, Department, Post, TicketCategory } from '../types';
import { DEPARTMENTS, TERRITORY, COUNTRIES } from '../data/countries';
import { getCountryGovernanceSchema } from '../data/countryGovernance';
import { getMinistriesForCountry } from '../data/countryMinistries';
export { escalationFor } from '../data/tiers';

export const CATEGORIES: { id: TicketCategory; label: string; color: string; special?: boolean }[] = [
  { id: 'corruption', label: 'Corruption / Misuse of Public Funds', color: '#ef4444', special: true },
  { id: 'pothole', label: 'Road / Pothole', color: '#f59e0b' },
  { id: 'water', label: 'Water / Sewage', color: '#60a5fa' },
  { id: 'power', label: 'Power / Electric', color: '#fbbf24' },
  { id: 'health', label: 'Health / Clinic / Hospital', color: '#34d399' },
  { id: 'education', label: 'Education / School / University', color: '#10b981' },
  { id: 'hospitality', label: 'Hospitality / Restaurant / Food Safety', color: '#f97316' },
  { id: 'finance', label: 'Finance / Bank / SACCO', color: '#fda4af' },
  { id: 'transport', label: 'Transport / Bus / Taxi / Boda', color: '#06b6d4' },
  { id: 'housing', label: 'Housing / Plaza / Market / Landlord', color: '#8b5cf6' },
  { id: 'telecom', label: 'Telecom / Data / Fiber', color: '#67e8f9' },
  { id: 'waste', label: 'Waste / Sanitation', color: '#a78bfa' },
  { id: 'police', label: 'Police / Security', color: '#f87171' },
  { id: 'praise', label: 'Praise & Commendation', color: '#6ee7b7' },
  { id: 'other', label: 'Other Service Provider', color: '#71717a' },
];

export const CIVIC_RANKS = [
  { name: 'Observer', min: 0, next: 200, desc: 'New to the platform' },
  { name: 'Reporter', min: 200, next: 800, desc: 'Filing consistent reports' },
  { name: 'Advocate', min: 800, next: 2000, desc: 'Driving real responses' },
  { name: 'Watchdog', min: 2000, next: 5000, desc: 'Holding institutions accountable' },
  { name: 'Sentinel', min: 5000, next: null, desc: 'Pillar of civic accountability' },
];

export function getRank(xp: number) {
  return [...CIVIC_RANKS].reverse().find((r) => xp >= r.min) || CIVIC_RANKS[0];
}

export function getRankPct(xp: number) {
  const r = getRank(xp);
  if (!r.next) return 100;
  return Math.round(((xp - r.min) / (r.next - r.min)) * 100);
}

export function catByID(id: TicketCategory) {
  return CATEGORIES.find((c) => c.id === id) || { label: 'Other', color: '#71717a' };
}

export function allDepts(c: CountryCode): Department[] {
  if (DEPARTMENTS[c]) {
    return [
      ...(DEPARTMENTS[c].civic || []).map((d) => ({ ...d, lane: 'civic' as const })),
      ...(DEPARTMENTS[c].consumer || []).map((d) => ({ ...d, lane: 'consumer' as const })),
    ];
  }
  const info = COUNTRIES[c];
  const name = info?.name || c;
  const lc = c.toLowerCase();
  return [
    { id: `${lc}_gov`, name: `${name} Public Works`, full: `${name} Ministry of Infrastructure & Public Works`, sla: 48, lane: 'civic', icon: 'Landmark', category: 'government', ministry: 'Ministry of Works & Transport', sector: 'Highways & Municipal Infrastructure', trustScore: 88, verified: true, qualityAudit: 'National Audit Verified', location: `${name} Capital Hub` },
    { id: `${lc}_local_gov`, name: `${name} Local Gov`, full: `${name} Ministry of Local Government & Municipalities`, sla: 48, lane: 'civic', icon: 'Landmark', category: 'government', ministry: 'Ministry of Local Government', sector: 'Decentralized Municipal Councils', trustScore: 91, verified: true, qualityAudit: 'Statutory Decentralization Desk', location: `${name} National Secretariat` },
    { id: `${lc}_water`, name: `${name} Water Authority`, full: `${name} National Water & Sewerage Utility`, sla: 48, lane: 'civic', icon: 'Droplets', category: 'utility', ministry: 'Ministry of Water & Environment', sector: 'Piped Water & Sanitation', trustScore: 89, verified: true, qualityAudit: 'ISO 9001 Utility Standard', location: `${name} Metropolitan Grid` },
    { id: `${lc}_power`, name: `${name} Electric Utility`, full: `${name} National Power Grid & Distribution`, sla: 24, lane: 'civic', icon: 'Zap', category: 'utility', ministry: 'Ministry of Energy', sector: 'National Electricity Grid', trustScore: 85, verified: true, qualityAudit: 'National Energy Regulator', location: `${name} Grid Control` },
    { id: `${lc}_police`, name: `${name} Police Command`, full: `${name} National Police & Public Security`, sla: 24, lane: 'civic', icon: 'Scale', category: 'government', ministry: 'Ministry of Interior', sector: 'Law Enforcement & Public Safety', trustScore: 82, verified: true, qualityAudit: 'Internal Affairs Audited', location: `${name} Command HQ` },
    { id: `${lc}_ombudsman`, name: `${name} Anti-Corruption`, full: `${name} Office of the Ombudsman & Inspector General`, sla: 72, lane: 'civic', icon: 'ShieldCheck', category: 'government', ministry: 'Supreme Audit & Integrity', sector: 'Whistleblower & Anti-Corruption', trustScore: 95, verified: true, qualityAudit: 'Statutory Whistleblower Desk', location: `${name} Integrity House` },
    { id: `${lc}_health`, name: `${name} National Hospital`, full: `${name} National Referral & Teaching Hospital`, sla: 24, lane: 'consumer', icon: 'Hospital', category: 'health', sector: 'Tertiary Emergency & Clinical Care', trustScore: 90, verified: true, qualityAudit: 'Medical Council Accredited', location: `${name} Central Medical District` },
    { id: `${lc}_univ`, name: `Univ. of ${name}`, full: `National University of ${name} (Campuses & Student Welfare)`, sla: 48, lane: 'consumer', icon: 'GraduationCap', category: 'education', sector: 'Higher Education & Research', trustScore: 93, verified: true, qualityAudit: 'Higher Education Council', location: `${name} University Precinct` },
    { id: `${lc}_telecom`, name: `${name} Telecom & Fiber`, full: `${name} National Broadband & Mobile Communications`, sla: 48, lane: 'consumer', icon: 'Radio', category: 'telecom', sector: '5G Mobile, Fiber & Digital Payments', trustScore: 91, verified: true, qualityAudit: 'Communications Commission Licensed', location: `Nationwide Coverage` },
    { id: `${lc}_bank`, name: `${name} Commercial Bank`, full: `National Commercial Bank of ${name} (Retail & Digital)`, sla: 48, lane: 'consumer', icon: 'Landmark', category: 'finance', sector: 'Commercial & Retail Banking', trustScore: 94, verified: true, qualityAudit: 'Central Bank Regulated', location: `${name} Financial District` },
    { id: `${lc}_transit`, name: `${name} Metro Transit`, full: `${name} Metropolitan Bus & Commuter Rail Authority`, sla: 24, lane: 'consumer', icon: 'Bus', category: 'transport', sector: 'Public Commuter Transit', trustScore: 86, verified: true, qualityAudit: 'Transport Safety Board', location: `${name} Central Terminal` },
    { id: `${lc}_cso`, name: `Transparency ${name}`, full: `${name} Civic Watchdog & Consumer Protection Alliance`, sla: 48, lane: 'consumer', icon: 'Users', category: 'cso', sector: 'Civil Society & Rights Watchdog', trustScore: 96, verified: true, qualityAudit: 'Registered NGO / CSO', location: `${name} Civic Center` },
  ];
}

export function getDept(country: CountryCode, id: string): Department {
  const all = allDepts(country);
  return all.find((d) => d.id === id) || { id, name: id, full: id, sla: 48, lane: 'civic', icon: 'Landmark' };
}

export function srcLabel(s: string) {
  return s === 'sms' ? 'SMS' : s === 'ussd' ? 'USSD' : 'Web';
}

export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (isNaN(s) || s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

export function fmtSLA(hrs: number) {
  if (hrs <= 0) return '0m';
  const h = Math.floor(Math.abs(hrs));
  const m = Math.round((Math.abs(hrs) - h) * 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function slaStatus(post: Post) {
  const d = getDept(post.country, post.dept);
  const hrs = (Date.now() - new Date(post.created_at).getTime()) / 3600000;
  const rem = d.sla - hrs;
  if (post.status === 'resolved') return { label: 'Closed', color: '#10b981', pct: 100, overdue: false, fmt: 'Closed' };
  if (rem <= 0 || post.escalated || post.status === 'overdue')
    return { label: 'Overdue', color: '#ef4444', pct: 100, overdue: true, fmt: `${fmtSLA(Math.abs(rem))} past deadline` };
  if (rem <= 6)
    return {
      label: `${fmtSLA(rem)}`,
      color: '#ef4444',
      pct: Math.min(99, Math.round((hrs / d.sla) * 100)),
      overdue: false,
      urgent: true,
      fmt: `${fmtSLA(rem)} left`,
    };
  return { label: `${fmtSLA(rem)}`, color: '#f59e0b', pct: Math.round((hrs / d.sla) * 100), overdue: false, fmt: `${fmtSLA(rem)} left` };
}

export function pathStr(country: CountryCode, t: { district?: string; subcounty?: string; parish?: string; ward?: string; village?: string }) {
  if (!t || !TERRITORY[country]) return '';
  const parts: string[] = [];
  if (COUNTRIES[country]) parts.push(COUNTRIES[country].name);
  const dist = TERRITORY[country]?.find((x) => x.id === t.district || x.name === t.district);
  if (dist) parts.push(dist.name);
  const sc = dist?.children?.find((x) => x.id === (t.ward || t.subcounty) || x.name === (t.ward || t.subcounty));
  if (sc) parts.push(sc.name);
  const parish = sc?.children?.find((x) => x.id === t.parish || x.name === t.parish);
  if (parish) parts.push(parish.name);
  if (t.village) parts.push(t.village);
  return parts.join(' › ');
}

function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getPostGrassroots(country: CountryCode, p: Post) {
  const gov = getCountryGovernanceSchema(country);
  const t = p.territory;
  const dist = TERRITORY[country]?.find((x) => x.id === t?.district || x.name === t?.district);
  const rawDistrict = dist?.name || t?.district || (country === 'UG' ? 'Kampala' : gov.sampleJurisdictions[0] || gov.countryName);
  const cleanDistrict = toTitleCase(rawDistrict.replace(/district$/i, '').trim());
  const districtName = country === 'UG'
    ? (cleanDistrict ? `${cleanDistrict} District` : 'National District')
    : (rawDistrict.toLowerCase().includes(gov.grassrootsUnits.tier3Suffix.toLowerCase())
        ? toTitleCase(rawDistrict)
        : cleanDistrict ? `${cleanDistrict} (${gov.grassrootsUnits.tier3Suffix})` : `${gov.countryName}`);

  const sc = dist?.children?.find((x) => x.id === (t?.ward || t?.subcounty) || x.name === (t?.ward || t?.subcounty));
  const rawWard = p.ward || t?.ward || sc?.name || t?.subcounty || '';

  let subcountyName: string;
  if (country === 'UG') {
    const cleanSubcounty = toTitleCase(
      rawWard
        .replace(/Division$/i, 'Subcounty')
        .replace(/Sub-County$/i, 'Subcounty')
        .replace(/Ward$/i, 'Subcounty')
        .trim()
    );
    subcountyName = cleanSubcounty
      ? (cleanSubcounty.toLowerCase().includes('subcounty') ? cleanSubcounty : `${cleanSubcounty} Subcounty`)
      : 'Local Subcounty';
  } else {
    const cleaned = toTitleCase(rawWard.trim());
    subcountyName = cleaned || `Local ${gov.grassrootsUnits.tier2Suffix}`;
  }

  const parishNode = sc?.children?.find((x) => x.id === t?.parish || x.name === t?.parish);
  const rawParish = p.parish || parishNode?.name || t?.parish || '';
  let parishName: string;
  if (country === 'UG') {
    const cleanParish = toTitleCase(rawParish.replace(/parish$/i, '').trim());
    parishName = cleanParish ? `${cleanParish} Parish` : 'Local Parish';
  } else {
    const cleaned = toTitleCase(rawParish.trim());
    parishName = cleaned
      ? (cleaned.toLowerCase().includes(gov.grassrootsUnits.tier1Suffix.toLowerCase()) ? cleaned : `${cleaned} ${gov.grassrootsUnits.tier1Suffix}`)
      : `Local ${gov.grassrootsUnits.tier1Suffix}`;
  }

  const rawGrassroot = p.grassroot || p.village || p.cell || t?.village || t?.cell || t?.grassroot || '';
  const grassrootName = toTitleCase(rawGrassroot || `${gov.grassrootsUnits.villageLabel}`);

  const dateline = `${parishName} · ${subcountyName} · ${districtName}`;

  return {
    district: districtName,
    subcounty: subcountyName,
    ward: subcountyName, // backward compat
    parish: parishName,
    grassroot: grassrootName,
    dateline,
  };
}

const CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function makeCode(prefix: string): string {
  const b = new Uint8Array(8);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(b);
  } else {
    for (let i = 0; i < 8; i++) b[i] = Math.floor(Math.random() * 256);
  }
  let s = '';
  for (const x of b) s += CODE_ALPHABET[x % CODE_ALPHABET.length];
  return `${prefix}-${s}`;
}

/**
 * Strips decorative Unicode emojis while preserving standard text.
 * Ensures cached localStorage / Firestore records conform to the Google AI Studio monochrome vector icon standard.
 */
export function stripDecorativeEmojis(str?: string): string {
  if (!str) return '';
  return str
    .replace(
      /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]\s*/gu,
      ''
    )
    .trim();
}

export function sanitizePostEmojis(p: Post): Post {
  return {
    ...p,
    demo_highlight: p.demo_highlight ? stripDecorativeEmojis(p.demo_highlight) : p.demo_highlight,
  };
}

export function csvEscape(v: any): string {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function copyToClipboard(text: string, label?: string, callback?: (msg: string) => void) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => callback?.(`${label || 'Code'} copied`))
      .catch(() => callback?.(text));
  } else {
    callback?.(`${label || 'Code'} copied`);
  }
}

export interface PsMinistryInfo {
  isPs: boolean;
  isMoLG: boolean;
  ministryId: string | null;
  ministryName: string | null;
  shortTitle: string | null;
  officerTitle: string | null;
  cabinetMinisterTitle?: string;
  stateMinisterTitles?: string[];
  mandateSummary?: string;
}

/**
 * Determines whether a user session belongs to a Permanent Secretary / Line Ministry executive,
 * distinguishing the National Territorial Superadmin (MoLG / Devolution / PO-RALG / COGTA / Intergovernmental)
 * from Sector Line Ministries (Works, Finance, Health, Water, Education, ICT, Energy, Agriculture, etc.)
 * across all 100+ countries.
 */
export function getPsMinistryInfo(user: any): PsMinistryInfo {
  if (!user) {
    return { isPs: false, isMoLG: false, ministryId: null, ministryName: null, shortTitle: null, officerTitle: null };
  }

  const countryCode = ((user.country || 'UG') as string).toUpperCase() as CountryCode;
  const isUganda = countryCode === 'UG';
  const gov = getCountryGovernanceSchema(countryCode);
  const countryMinistries = getMinistriesForCountry(countryCode);

  const rawTitle = (user.real_title_short || user.role_label || user.title || user.scope || '').toUpperCase();
  const rawDept = (user.dept || '').toLowerCase();
  const rawName = (user.name || user.officer_name || '').toUpperCase();
  const rawCode = (user.code || user.id || '').toUpperCase();

  const isMinister =
    rawTitle.includes('MINISTER') ||
    rawCode.startsWith('MIN-') ||
    rawCode.startsWith('STM-') ||
    rawCode.endsWith('-CABINET-MIN') ||
    rawCode.endsWith('-STATE-MIN');

  const isPs =
    isMinister ||
    user.hierarchy_level === 'tier5_perm_sec' ||
    user.escalation_rank === 5 ||
    rawTitle.includes('PS ') ||
    rawTitle.includes('PERMANENT SECRETARY') ||
    rawTitle.includes('PRINCIPAL SECRETARY') ||
    rawTitle.includes('SECRETARY TO THE TREASURY') ||
    rawTitle.includes('DIRECTOR-GENERAL') ||
    rawTitle.includes('SECRETARY —') ||
    rawTitle.includes('CHIEF DIRECTOR') ||
    rawTitle.includes('UNDERSECRETARY') ||
    rawTitle.includes('CABINET SECRETARY') ||
    rawCode.startsWith('PS-');

  if (!isPs) {
    return { isPs: false, isMoLG: false, ministryId: null, ministryName: null, shortTitle: null, officerTitle: null };
  }

  // Helper to match a sector ministry in the user's own country first
  const findCountryMinistry = (keywords: string[], sectorMatch?: string) =>
    countryMinistries.find((m) =>
      (sectorMatch && m.sector === sectorMatch) ||
      keywords.some((k) => m.title.toUpperCase().includes(k) || m.shortTitle.toUpperCase().includes(k) || m.id.toUpperCase().includes(k))
    );

  // 1. Strict Jurisdictional Isolation: Ministers (Cabinet & State) are political executives, NOT Superadmin.
  if (isMinister) {
    const isTerritorialMinister =
      rawTitle.includes('LOCAL GOV') ||
      rawTitle.includes('DEVOLUTION') ||
      rawTitle.includes('MINALOC') ||
      rawTitle.includes('TAMISEMI') ||
      rawTitle.includes('COGTA') ||
      rawDept === 'molg' ||
      rawDept === gov.superadminDeptId ||
      rawCode.includes('MOLG') ||
      rawCode.includes('MINALOC');
    const isWorksMinister = rawTitle.includes('WORKS') || rawTitle.includes('TRANSPORT') || rawTitle.includes('ROADS') || rawTitle.includes('INFRASTRUCTURE') || rawDept === 'mowt' || rawDept === 'works' || rawDept === 'mininfra' || rawCode.includes('MOWT');
    const isFinanceMinister = rawTitle.includes('FINANCE') || rawTitle.includes('TREASURY') || rawDept === 'mofped' || rawDept === 'minecofin' || rawCode.includes('MOFPED');
    const isHealthMinister = rawTitle.includes('HEALTH') || rawDept === 'moh' || rawDept === 'moh_ug' || rawDept === 'moh_rw' || rawCode.includes('MOH');

    const matchedProfile = isTerritorialMinister
      ? findCountryMinistry(['LOCAL GOV', 'MINALOC', 'DEVOLUTION', 'TAMISEMI', 'COGTA', 'SUPERADMIN'], 'GOVERNANCE')
      : isWorksMinister
      ? findCountryMinistry(['WORKS', 'INFRASTRUCTURE', 'ROADS', 'TRANSPORT'], 'INFRASTRUCTURE')
      : isFinanceMinister
      ? findCountryMinistry(['FINANCE', 'TREASURY', 'MINECOFIN'], 'FISCAL')
      : isHealthMinister
      ? findCountryMinistry(['HEALTH'], 'HEALTH')
      : countryMinistries[0];

    const minId = matchedProfile?.id || (isTerritorialMinister ? `PS-${gov.superadminMinistryShort.toUpperCase()}` : `PS-${countryCode}-SECTOR`);
    const minName = matchedProfile?.title || (isTerritorialMinister ? gov.superadminMinistry : `${gov.countryName} Line Ministry Portfolio`);
    const shortTitle = matchedProfile?.shortTitle || (isTerritorialMinister ? gov.superadminMinistryShort : 'Ministry');

    return {
      isPs: true,
      isMoLG: false,
      ministryId: minId,
      ministryName: minName,
      shortTitle,
      officerTitle: user.real_title_short || user.role_label || `Cabinet Minister (${gov.countryName})`,
      cabinetMinisterTitle: user.officer_name || (isTerritorialMinister ? gov.cabinetMinisterName : `Cabinet Minister — ${minName}`),
      stateMinisterTitles: isTerritorialMinister
        ? (isUganda ? ['Hon. Justine Nameere (Minister of State for Local Government)'] : [gov.stateMinisterName])
        : [],
      mandateSummary: `Apex Ministerial Political Leadership & Strategic Policy Oversight pursuant to ${gov.cabinetMandateCitation}.`,
    };
  }

  // 2. National Territorial Superadmin (Accounting Officer of territorial ministry)
  const isTerritorialSuperadmin =
    Boolean(user.is_superadmin) ||
    rawCode === 'UG-MOLG-PS-011' ||
    rawCode === 'PS-MOLG-2026' ||
    rawCode === 'PS-MOLG-ROLLOUT' ||
    rawCode.includes('MINALOC') ||
    rawCode.includes('DEVOLUTION') ||
    rawCode.includes('SUPERADMIN') ||
    rawName.includes('KUMUMANYA') ||
    (rawCode.startsWith('PS-MOLG') && !isMinister);

  if (isTerritorialSuperadmin) {
    return {
      isPs: true,
      isMoLG: true,
      ministryId: isUganda ? 'PS-MOLG' : `PS-${countryCode}-${gov.superadminMinistryShort.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
      ministryName: user.dept && user.dept.length > 4 && (isUganda || !user.dept.includes('MoLG')) ? user.dept : gov.superadminMinistry,
      shortTitle: isUganda ? 'Territorial Superadmin' : gov.superadminMinistryShort,
      officerTitle: user.real_title_short || user.role_label || gov.superadminTitle,
      cabinetMinisterTitle: gov.cabinetMinisterName,
      stateMinisterTitles: isUganda
        ? ['Hon. Justine Nameere (Minister of State for Local Government)', 'Hon. Victoria Rusoke Businge (State Minister)']
        : [gov.stateMinisterName],
      mandateSummary: `National Territorial Superadmin & Statutory Accounting Officer (${gov.fiscalAct}) — Sole administrative authority over nationwide ${gov.tier3UnitLabel}s, ${gov.fiscalProgramName}, and ${gov.tier1Plural}.`,
    };
  }

  // 3. Sector Line Ministries matched against active country
  const sectorChecks: Array<{ match: boolean; sector: string; keywords: string[]; fallbackId: string; fallbackShort: string; fallbackName: string }> = [
    {
      match: rawTitle.includes('WORKS') || rawTitle.includes('TRANSPORT') || rawTitle.includes('ROADS') || rawTitle.includes('INFRASTRUCTURE') || rawDept === 'works' || rawDept === 'mowt' || rawDept === 'mininfra',
      sector: 'INFRASTRUCTURE',
      keywords: ['WORKS', 'INFRASTRUCTURE', 'ROADS', 'TRANSPORT'],
      fallbackId: isUganda ? 'PS-MOWT' : `PS-${countryCode}-WORKS`,
      fallbackShort: isUganda ? 'MoWT' : 'Infrastructure',
      fallbackName: `${gov.countryName} Ministry of Works & Infrastructure`,
    },
    {
      match: rawTitle.includes('FINANCE') || rawTitle.includes('TREASURY') || rawTitle.includes('MOFPED') || rawTitle.includes('MINECOFIN') || rawTitle.includes('ECONOMIC') || rawDept === 'mofped' || rawDept === 'finance' || rawDept === 'minecofin',
      sector: 'FISCAL',
      keywords: ['FINANCE', 'TREASURY', 'MINECOFIN', 'MOFPED'],
      fallbackId: isUganda ? 'PS-MOFPED' : `PS-${countryCode}-FINANCE`,
      fallbackShort: isUganda ? 'MoFPED' : 'Finance & Treasury',
      fallbackName: `${gov.countryName} Ministry of Finance & National Treasury`,
    },
    {
      match: rawTitle.includes('HEALTH') || rawTitle.includes('MEDICAL') || rawDept === 'health' || rawDept === 'moh',
      sector: 'HEALTH',
      keywords: ['HEALTH'],
      fallbackId: isUganda ? 'PS-MOH' : `PS-${countryCode}-HEALTH`,
      fallbackShort: isUganda ? 'MoH' : 'Health',
      fallbackName: `${gov.countryName} Ministry of Health`,
    },
    {
      match: rawTitle.includes('EDUCATION') || rawTitle.includes('SPORTS') || rawTitle.includes('SCHOOL') || rawDept === 'education' || rawDept === 'moes' || rawDept === 'mineduc',
      sector: 'EDUCATION',
      keywords: ['EDUCATION'],
      fallbackId: isUganda ? 'PS-MOES' : `PS-${countryCode}-EDUCATION`,
      fallbackShort: isUganda ? 'MoES' : 'Education',
      fallbackName: `${gov.countryName} Ministry of Education`,
    },
    {
      match: rawTitle.includes('WATER') || rawTitle.includes('ENVIRONMENT') || rawTitle.includes('SANITATION') || rawDept === 'water' || rawDept === 'mowe' || rawDept === 'nwsc',
      sector: 'WATER_ENVIRONMENT',
      keywords: ['WATER', 'ENVIRONMENT'],
      fallbackId: isUganda ? 'PS-MOWE' : `PS-${countryCode}-WATER`,
      fallbackShort: isUganda ? 'MoWE' : 'Water & Environment',
      fallbackName: `${gov.countryName} Ministry of Water & Environment`,
    },
    {
      match: rawTitle.includes('ICT') || rawTitle.includes('DIGITAL') || rawTitle.includes('COMMUNICATION') || rawDept === 'ict' || rawDept === 'moict' || rawDept === 'minict',
      sector: 'ICT_DIGITAL',
      keywords: ['ICT', 'DIGITAL', 'MINICT'],
      fallbackId: isUganda ? 'PS-MOICT' : `PS-${countryCode}-ICT`,
      fallbackShort: isUganda ? 'MoICT' : 'Digital / ICT',
      fallbackName: `${gov.countryName} Ministry of ICT & Digital Economy`,
    },
    {
      match: rawTitle.includes('ENERGY') || rawTitle.includes('MINERAL') || rawTitle.includes('POWER') || rawTitle.includes('ELECTRIC') || rawDept === 'energy' || rawDept === 'memd',
      sector: 'ENERGY',
      keywords: ['ENERGY', 'POWER'],
      fallbackId: isUganda ? 'PS-MEMD' : `PS-${countryCode}-ENERGY`,
      fallbackShort: isUganda ? 'MEMD' : 'Energy',
      fallbackName: `${gov.countryName} Ministry of Energy & Power`,
    },
    {
      match: rawTitle.includes('AGRICULTURE') || rawTitle.includes('FISHERIES') || rawTitle.includes('LIVESTOCK') || rawDept === 'agriculture' || rawDept === 'maif' || rawDept === 'minagri',
      sector: 'AGRICULTURE',
      keywords: ['AGRICULTURE', 'MINAGRI', 'MAAIF'],
      fallbackId: isUganda ? 'PS-MAAIF' : `PS-${countryCode}-AGRI`,
      fallbackShort: isUganda ? 'MAAIF' : 'Agriculture',
      fallbackName: `${gov.countryName} Ministry of Agriculture & Rural Development`,
    },
    {
      match: rawTitle.includes('OPM') || rawTitle.includes('PRIME MINISTER') || rawTitle.includes('CABINET') || rawTitle.includes('PRIMATURE'),
      sector: 'CABINET_DELIVERY',
      keywords: ['PRIME MINISTER', 'CABINET', 'PRIMATURE', 'OPM'],
      fallbackId: isUganda ? 'PS-OPM' : `PS-${countryCode}-CABINET`,
      fallbackShort: isUganda ? 'OPM' : 'Cabinet Delivery',
      fallbackName: `${gov.countryName} Cabinet Office / Delivery Unit`,
    },
  ];

  for (const sc of sectorChecks) {
    if (sc.match) {
      const profile = findCountryMinistry(sc.keywords, sc.sector);
      const minName = profile?.title || sc.fallbackName;
      return {
        isPs: true,
        isMoLG: false,
        ministryId: profile?.id || sc.fallbackId,
        ministryName: minName,
        shortTitle: profile?.shortTitle || sc.fallbackShort,
        officerTitle: user.real_title_short || profile?.roleTitle || `PS ${sc.fallbackShort}`,
        cabinetMinisterTitle: `Cabinet Minister — ${minName}`,
        stateMinisterTitles: [`Deputy / State Minister — ${profile?.shortTitle || sc.fallbackShort}`],
        mandateSummary: profile?.mandate || `Chief Accounting Officer & Administrative Head of ${minName} (${gov.fiscalAct}).`,
      };
    }
  }

  // Fallback for any other Sector Line Ministry PS across 100+ countries
  const derivedMinistryName = user.dept && user.dept.length > 3 ? user.dept : (user.real_title_short || user.role_label || `${gov.countryName} Sector Line Ministry`);
  return {
    isPs: true,
    isMoLG: false,
    ministryId: `PS-${countryCode}-LINE-MINISTRY`,
    ministryName: derivedMinistryName,
    shortTitle: user.real_title_short || `${countryCode} Line PS`,
    officerTitle: user.real_title_short || user.role_label || 'Permanent Secretary',
    cabinetMinisterTitle: `Cabinet Minister — ${derivedMinistryName}`,
    stateMinisterTitles: [`Deputy / State Minister — ${derivedMinistryName}`],
    mandateSummary: `Chief Accounting Officer & Administrative Head of ${derivedMinistryName}. Strictly scoped to ${gov.countryName}'s sector mandate and ${gov.fiscalAct}.`,
  };
}
