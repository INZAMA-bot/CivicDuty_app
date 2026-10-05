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
  return [
    { id: `${c.toLowerCase()}_gov`, name: `${name} Public Works`, full: `${name} Ministry of Infrastructure & Public Works`, sla: 48, lane: 'civic', icon: '🏛' },
    { id: `${c.toLowerCase()}_water`, name: `${name} Water Authority`, full: `${name} National Water & Sewerage Utility`, sla: 48, lane: 'civic', icon: '💧' },
    { id: `${c.toLowerCase()}_power`, name: `${name} Electric Utility`, full: `${name} National Power Grid & Distribution`, sla: 24, lane: 'civic', icon: '⚡' },
    { id: `${c.toLowerCase()}_police`, name: `${name} Police Command`, full: `${name} National Police & Public Security`, sla: 24, lane: 'civic', icon: '⚖' },
    { id: `${c.toLowerCase()}_health`, name: `${name} Health Services`, full: `${name} Ministry of Health & Hospital Board`, sla: 48, lane: 'civic', icon: '🏥' },
    { id: `${c.toLowerCase()}_telecom`, name: `${name} Telecom & Data`, full: `${name} National Communications Provider`, sla: 72, lane: 'consumer', icon: '📡' },
  ];
}

export function getDept(country: CountryCode, id: string): Department {
  const all = allDepts(country);
  return all.find((d) => d.id === id) || { id, name: id, full: id, sla: 48, lane: 'civic', icon: '🏛' };
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
}

/**
 * Determines whether a user session belongs to a Permanent Secretary / Line Ministry executive,
 * distinguishing PS MoLG (Territorial Superadmin) from Line Ministries (Works, Finance, Health, Water, etc.)
 */
export function getPsMinistryInfo(user: any): PsMinistryInfo {
  if (!user) {
    return { isPs: false, isMoLG: false, ministryId: null, ministryName: null, shortTitle: null, officerTitle: null };
  }

  const rawTitle = (user.real_title_short || user.role_label || user.title || user.scope || '').toUpperCase();
  const rawDept = (user.dept || '').toLowerCase();
  const rawName = (user.name || user.officer_name || '').toUpperCase();

  const isPs =
    user.hierarchy_level === 'tier5_perm_sec' ||
    user.escalation_rank === 5 ||
    rawTitle.includes('PS ') ||
    rawTitle.includes('PERMANENT SECRETARY') ||
    rawTitle.includes('PRINCIPAL SECRETARY') ||
    rawTitle.includes('SECRETARY TO THE TREASURY') ||
    rawTitle.includes('CHIEF DIRECTOR');

  if (!isPs) {
    return { isPs: false, isMoLG: false, ministryId: null, ministryName: null, shortTitle: null, officerTitle: null };
  }

  // Detect specific line ministry
  if (rawTitle.includes('WORKS') || rawTitle.includes('TRANSPORT') || rawTitle.includes('ROADS') || rawDept === 'works' || rawDept === 'mowt') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOWT',
      ministryName: 'Ministry of Works & Transport',
      shortTitle: 'MoWT',
      officerTitle: user.real_title_short || 'PS Works & Transport',
    };
  }

  if (rawTitle.includes('FINANCE') || rawTitle.includes('TREASURY') || rawTitle.includes('MOFPED') || rawDept === 'mofped') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOFPED',
      ministryName: 'Ministry of Finance, Planning & Economic Development',
      shortTitle: 'MoFPED',
      officerTitle: user.real_title_short || 'PS Finance (PS/ST)',
    };
  }

  if (rawTitle.includes('HEALTH') || rawDept === 'health') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOH',
      ministryName: 'Ministry of Health',
      shortTitle: 'MoH',
      officerTitle: user.real_title_short || 'PS Health',
    };
  }

  if (rawTitle.includes('EDUCATION') || rawTitle.includes('SPORTS') || rawDept === 'education' || rawDept === 'moes') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOES',
      ministryName: 'Ministry of Education & Sports',
      shortTitle: 'MoES',
      officerTitle: user.real_title_short || 'PS Education & Sports',
    };
  }

  if (rawTitle.includes('WATER') || rawTitle.includes('ENVIRONMENT') || rawDept === 'water' || rawDept === 'mowe' || rawDept === 'nwsc') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOWE',
      ministryName: 'Ministry of Water & Environment',
      shortTitle: 'MoWE',
      officerTitle: user.real_title_short || 'PS Water & Environment',
    };
  }

  if (rawTitle.includes('ICT') || rawTitle.includes('DIGITAL') || rawDept === 'ict' || rawDept === 'moict') {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-MOICT',
      ministryName: 'Ministry of ICT & National Guidance',
      shortTitle: 'MoICT',
      officerTitle: user.real_title_short || 'PS ICT & Guidance',
    };
  }

  if (rawTitle.includes('OPM') || rawTitle.includes('PRIME MINISTER') || rawTitle.includes('CABINET')) {
    return {
      isPs: true,
      isMoLG: false,
      ministryId: 'PS-OPM',
      ministryName: 'Office of the Prime Minister',
      shortTitle: 'OPM',
      officerTitle: user.real_title_short || 'PS OPM',
    };
  }

  const isMoLG =
    rawTitle.includes('MOLG') ||
    rawTitle.includes('LOCAL GOV') ||
    rawTitle.includes('SUPERADMIN') ||
    rawName.includes('KUMUMANYA');

  if (isMoLG) {
    return {
      isPs: true,
      isMoLG: true,
      ministryId: 'PS-MOLG',
      ministryName: 'Ministry of Local Government',
      shortTitle: 'MoLG',
      officerTitle: user.real_title_short || 'PS Local Government (MoLG)',
    };
  }

  // Fallback for custom or international Permanent Secretaries
  return {
    isPs: true,
    isMoLG: false,
    ministryId: 'PS-LINE-MINISTRY',
    ministryName: user.real_title_short || user.role_label || 'Apex Line Ministry',
    shortTitle: user.real_title_short || 'Line PS',
    officerTitle: user.real_title_short || user.role_label || 'Permanent Secretary',
  };
}

