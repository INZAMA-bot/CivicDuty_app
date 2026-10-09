import { CountryCode, Department, Post, TicketCategory } from '../types';
import { DEPARTMENTS, TERRITORY, COUNTRIES } from '../data/countries';
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

export function pathStr(country: CountryCode, t: { district?: string; subcounty?: string; parish?: string }) {
  if (!t || !TERRITORY[country]) return '';
  const parts: string[] = [];
  if (COUNTRIES[country]) parts.push(COUNTRIES[country].name);
  const dist = TERRITORY[country]?.find((x) => x.id === t.district);
  if (dist) parts.push(dist.name);
  const sc = dist?.children?.find((x) => x.id === t.subcounty);
  if (sc) parts.push(sc.name);
  const parish = sc?.children?.find((x) => x.id === t.parish);
  if (parish) parts.push(parish.name);
  return parts.join(' › ');
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

  const rawTitle = (user.real_title_short || user.role_label || user.title || user.scope || '').toUpperCase();
  const rawDept = (user.dept || '').toLowerCase();
  const rawName = (user.name || user.officer_name || '').toUpperCase();
  const rawCode = (user.code || user.id || '').toUpperCase();

  const isPs =
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
    rawCode.startsWith('PS-');

  if (!isPs) {
    return { isPs: false, isMoLG: false, ministryId: null, ministryName: null, shortTitle: null, officerTitle: null };
  }

  // 1. Check if this user is the National Territorial Superadmin (MoLG / Devolution / PO-RALG / COGTA / MINALOC / Intergovernmental)
  const isTerritorialSuperadmin =
    Boolean(user.is_superadmin) ||
    rawTitle.includes('MOLG') ||
    rawTitle.includes('LOCAL GOV') ||
    rawTitle.includes('DEVOLUTION') ||
    rawTitle.includes('PO-RALG') ||
    rawTitle.includes('TAMISEMI') ||
    rawTitle.includes('MINALOC') ||
    rawTitle.includes('COGTA') ||
    rawTitle.includes('COOPERATIVE GOVERNANCE') ||
    rawTitle.includes('INTERGOVERNMENTAL') ||
    rawTitle.includes('SPECIAL DUTIES') ||
    rawTitle.includes('PANCHAYATI') ||
    rawTitle.includes('TERRITORIAL') ||
    rawTitle.includes('DECENTRALIZATION') ||
    rawTitle.includes('SUPERADMIN') ||
    rawCode.includes('MOLG') ||
    rawCode.includes('PS-DEV-') ||
    rawCode.includes('RALG') ||
    rawCode.includes('COGTA') ||
    rawName.includes('KUMUMANYA');

  if (isTerritorialSuperadmin) {
    return {
      isPs: true,
      isMoLG: true,
      ministryId: 'PS-MOLG',
      ministryName: user.dept && user.dept.length > 4 ? user.dept : 'Ministry of Local Government & Territorial Administration',
      shortTitle: 'Territorial Superadmin',
      officerTitle: user.real_title_short || user.role_label || 'Permanent Secretary (National Superadmin)',
      cabinetMinisterTitle: 'Cabinet Minister for Local Government & Territorial Administration',
      stateMinisterTitles: ['Minister of State for Local Government', 'Minister of State for Urban Development'],
      mandateSummary: 'National Territorial Superadmin — Commissions all regional, district/county, municipal, and sub-county/ward administrative nodes and enforces national SLA compliance.',
    };
  }

  // 2. Detect specific sector Line Ministries
  if (rawTitle.includes('WORKS') || rawTitle.includes('TRANSPORT') || rawTitle.includes('ROADS') || rawTitle.includes('INFRASTRUCTURE') || rawDept === 'works' || rawDept === 'mowt') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOWT',
      ministryName: 'Ministry of Works & Transport',
      shortTitle: 'MoWT',
      officerTitle: user.real_title_short || 'PS Works & Transport',
      cabinetMinisterTitle: 'Cabinet Minister of Works & Transport',
      stateMinisterTitles: ['Minister of State for Works (National Roads & Bridges)', 'Minister of State for Transport (Rail, Aviation & Public Transit)'],
      mandateSummary: 'Accounting Officer & Administrative Head of the Ministry of Works & Transport. Supervises trunk roads, bridges, railway revitalization, public transit concessions, and engineering contractors.',
    };
  }

  if (rawTitle.includes('FINANCE') || rawTitle.includes('TREASURY') || rawTitle.includes('MOFPED') || rawTitle.includes('ECONOMIC') || rawDept === 'mofped' || rawDept === 'finance') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOFPED',
      ministryName: 'Ministry of Finance, Planning & Economic Development',
      shortTitle: 'MoFPED',
      officerTitle: user.real_title_short || 'PS Finance / Secretary to the Treasury',
      cabinetMinisterTitle: 'Cabinet Minister of Finance, Planning & Economic Development',
      stateMinisterTitles: ['Minister of State for Finance (General Duties)', 'Minister of State for Planning', 'Minister of State for Investment & Privatization'],
      mandateSummary: 'Chief Accounting Officer & Secretary to the Treasury. Controls quarterly budget releases, IFMS treasury warrants, capex milestone audits, and fiscal compliance.',
    };
  }

  if (rawTitle.includes('HEALTH') || rawTitle.includes('MEDICAL') || rawDept === 'health' || rawDept === 'moh') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOH',
      ministryName: 'Ministry of Health',
      shortTitle: 'MoH',
      officerTitle: user.real_title_short || 'PS Health',
      cabinetMinisterTitle: 'Cabinet Minister of Health',
      stateMinisterTitles: ['Minister of State for Health (General Duties)', 'Minister of State for Primary Health Care'],
      mandateSummary: 'Accounting Officer for the National Health System. Oversees national & regional referral hospitals, essential medicine supply chains (NMS), and public health emergency response.',
    };
  }

  if (rawTitle.includes('EDUCATION') || rawTitle.includes('SPORTS') || rawTitle.includes('SCHOOL') || rawDept === 'education' || rawDept === 'moes') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOES',
      ministryName: 'Ministry of Education & Sports',
      shortTitle: 'MoES',
      officerTitle: user.real_title_short || 'PS Education & Sports',
      cabinetMinisterTitle: 'Cabinet Minister of Education & Sports',
      stateMinisterTitles: ['Minister of State for Higher Education & TVET', 'Minister of State for Primary Education', 'Minister of State for Sports'],
      mandateSummary: 'Accounting Officer for National Education. Supervises primary, secondary, TVET, and university infrastructure, capitation grants, and teacher deployment.',
    };
  }

  if (rawTitle.includes('WATER') || rawTitle.includes('ENVIRONMENT') || rawTitle.includes('SANITATION') || rawDept === 'water' || rawDept === 'mowe' || rawDept === 'nwsc') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOWE',
      ministryName: 'Ministry of Water & Environment',
      shortTitle: 'MoWE',
      officerTitle: user.real_title_short || 'PS Water & Environment',
      cabinetMinisterTitle: 'Cabinet Minister of Water & Environment',
      stateMinisterTitles: ['Minister of State for Water', 'Minister of State for Environment & Forestry'],
      mandateSummary: 'Accounting Officer for Water & Environmental Resources. Supervises National Water utilities (NWSC), piped water schemes, wetlands protection, and sanitation SLAs.',
    };
  }

  if (rawTitle.includes('ICT') || rawTitle.includes('DIGITAL') || rawTitle.includes('COMMUNICATION') || rawDept === 'ict' || rawDept === 'moict') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOICT',
      ministryName: 'Ministry of ICT & National Guidance',
      shortTitle: 'MoICT',
      officerTitle: user.real_title_short || 'PS ICT & National Guidance',
      cabinetMinisterTitle: 'Cabinet Minister of ICT & National Guidance',
      stateMinisterTitles: ['Minister of State for ICT', 'Minister of State for National Guidance'],
      mandateSummary: 'Accounting Officer for Digital Infrastructure & e-Government. Oversees national backbone fiber (NITA), telecom compliance, and digital identity integration.',
    };
  }

  if (rawTitle.includes('ENERGY') || rawTitle.includes('MINERAL') || rawTitle.includes('POWER') || rawTitle.includes('ELECTRIC') || rawDept === 'energy' || rawDept === 'memd') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MEMD',
      ministryName: 'Ministry of Energy & Mineral Development',
      shortTitle: 'MEMD',
      officerTitle: user.real_title_short || 'PS Energy & Minerals',
      cabinetMinisterTitle: 'Cabinet Minister of Energy & Mineral Development',
      stateMinisterTitles: ['Minister of State for Energy (Grid & Rural Electrification)', 'Minister of State for Minerals'],
      mandateSummary: 'Accounting Officer for National Power Grid, Rural Electrification, Petroleum Supply, and Mineral Development.',
    };
  }

  if (rawTitle.includes('AGRICULTURE') || rawTitle.includes('FISHERIES') || rawTitle.includes('LIVESTOCK') || rawDept === 'agriculture' || rawDept === 'maif') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MAAIF',
      ministryName: 'Ministry of Agriculture, Animal Industry & Fisheries',
      shortTitle: 'MAAIF',
      officerTitle: user.real_title_short || 'PS Agriculture (MAAIF)',
      cabinetMinisterTitle: 'Cabinet Minister of Agriculture, Animal Industry & Fisheries',
      stateMinisterTitles: ['Minister of State for Agriculture', 'Minister of State for Animal Industry', 'Minister of State for Fisheries'],
      mandateSummary: 'Accounting Officer for Agricultural Extension, Parish Input Distribution, Irrigation Schemes, and Veterinary Quarantine.',
    };
  }

  if (rawTitle.includes('OPM') || rawTitle.includes('PRIME MINISTER') || rawTitle.includes('CABINET')) {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-OPM',
      ministryName: 'Office of the Prime Minister',
      shortTitle: 'OPM',
      officerTitle: user.real_title_short || 'PS Office of the Prime Minister',
      cabinetMinisterTitle: 'Prime Minister & Leader of Government Business',
      stateMinisterTitles: ['Minister for General Duties (OPM)', 'Minister for Relief, Disaster Preparedness & Refugees'],
      mandateSummary: 'Coordinates cross-ministerial service delivery, national disaster response, and cabinet policy execution.',
    };
  }

  // Fallback for any other Sector Line Ministry PS across 100+ countries
  const derivedMinistryName = user.dept && user.dept.length > 3 ? user.dept : (user.real_title_short || user.role_label || 'Sector Line Ministry');
  return {
    isPs: true,
    isMoLG: false,
    ministryId: 'PS-LINE-MINISTRY',
    ministryName: derivedMinistryName,
    shortTitle: user.real_title_short || 'Line PS',
    officerTitle: user.real_title_short || user.role_label || 'Permanent Secretary',
    cabinetMinisterTitle: `Cabinet Minister — ${derivedMinistryName}`,
    stateMinisterTitles: [`Deputy / State Minister — ${derivedMinistryName}`],
    mandateSummary: `Chief Accounting Officer & Administrative Head of ${derivedMinistryName}. Strictly scoped to this ministry's sector mandate, directorates, and ministerial cabinet.`,
  };
}

