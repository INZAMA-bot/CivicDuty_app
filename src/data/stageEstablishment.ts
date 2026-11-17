import { CountryCode } from '../types';
import { saveFrontlineStageToCloud } from '../services/firestoreSync';

export type FrontlineScoutCategory =
  | 'bodaboda'
  | 'market'
  | 'taxi'
  | 'health'
  | 'teacher'
  | 'artisan';

export interface FrontlineScoutEntry {
  scoutId: string;
  scoutName: string;
  category: FrontlineScoutCategory;
  workstationName: string;
  lat: number;
  lng: number;
  parish: string;
  subcounty: string;
  district: string;
  reportedAt: string;
  reportSnippet?: string;
}

export interface StageMember {
  id: string;
  name: string;
  rank: number;
  points: number;
  monthlyReports: number;
  qualifiedForShare: boolean;
  joinedAt: string;
  lastActiveAt: string;
  isDormant?: boolean;
  lionSharePct: number;
  bountyShareUgx: number;
}

export interface ScarceWorkstationPerk {
  id: string;
  title: string;
  quantity: number;
  recipientEligibility: 'top_3_only';
  allocatedToRanks: number[];
  icon: string;
}

export interface FrontlineStage {
  id: string;
  name: string;
  normalizedName: string;
  category: FrontlineScoutCategory;
  categoryLabel: string;
  categoryIcon: string;
  country: CountryCode;
  district: string;
  subcounty: string;
  parish: string;
  centerGps: { lat: number; lng: number };
  scoutCount: number; // Strictly active (non-dormant) member count
  thresholdRequired: number; // 15 active scouts
  isCertified: boolean; // scoutCount >= 15
  officialLabel: string;
  certifiedAt?: string;
  updatedAt?: string;
  patronSponsorPoolUgx: number;
  patronCount: number;
  patrons: Array<{
    patronName: string;
    amountUgx: number;
    sponsoredAt: string;
    diasporaOrigin?: string;
  }>;
  topScouts: Array<{
    id?: string;
    name: string;
    rank: number;
    points: number;
    badge: string;
    bountyShareUgx: number;
  }>;
  members?: StageMember[];
  scarcePerks?: ScarceWorkstationPerk[];
  recentScouts: Array<{
    scoutId?: string;
    scoutName: string;
    reportedAt: string;
    lat: number;
    lng: number;
  }>;
}

export const STAGE_CERTIFICATION_THRESHOLD = 15;
export const DORMANCY_DAYS = 30;
export const STAGES_UPDATED_EVENT = 'civicduty:stages-updated';

export const FRONTLINE_CATEGORIES: Array<{
  id: FrontlineScoutCategory;
  label: string;
  workstationPlaceholder: string;
  example: string;
  iconName: string;
  roleDescription: string;
}> = [
  {
    id: 'bodaboda',
    label: 'Mobility Stage / Courier Stand (Road Safety & Transit Scout)',
    workstationPlaceholder: 'Name of Rider Stage / Courier Hub (e.g. Equatorial Boda Stage)',
    example: 'Equatorial Boda Stage',
    iconName: 'Bike',
    roleDescription: 'Road hazard, open trench, cycle lane & streetlight reporting',
  },
  {
    id: 'market',
    label: 'Market Vendor Hub (Public Market & Sanitation Scout)',
    workstationPlaceholder: 'Name of Market / Stall Hall (e.g. Nakasero Market Central Hub)',
    example: 'Nakasero Market Central Hub',
    iconName: 'Store',
    roleDescription: 'Drainage, garbage clearance & utility supply monitoring',
  },
  {
    id: 'taxi',
    label: 'Taxi / Commuter Rank (Highway & Transit Corridor Scout)',
    workstationPlaceholder: 'Name of Taxi Rank / Transit Bay (e.g. Old Taxi Park Stage Bay 4)',
    example: 'Old Taxi Park Stage Bay 4',
    iconName: 'Car',
    roleDescription: 'Highway blackspots, road washouts & route hazard alerts',
  },
  {
    id: 'health',
    label: 'Healthcare Station (Clinic & Public Health Monitor)',
    workstationPlaceholder: 'Name of Clinic / Health Centre Station (e.g. Mulago Ward 4 Station)',
    example: 'Mulago Ward 4 Health Monitor Station',
    iconName: 'Stethoscope',
    roleDescription: 'Essential medicine stockouts, triage power & sanitation oversight',
  },
  {
    id: 'teacher',
    label: 'School Watch Station (Education & Youth Leader Scout)',
    workstationPlaceholder: 'Name of School / Campus Watch (e.g. Kitante Primary Gate Watch)',
    example: 'Kitante Primary Gate School Watch',
    iconName: 'GraduationCap',
    roleDescription: 'Dilapidated classrooms, crossing safety & learner welfare audits',
  },
  {
    id: 'artisan',
    label: 'Artisan Works Depot (Public Works & Infrastructure Inspector)',
    workstationPlaceholder: 'Name of Works Depot / Project Site (e.g. Municipal Culvert Works Depot)',
    example: 'Municipal Culvert Works Depot',
    iconName: 'HardHat',
    roleDescription: 'Substandard asphalt, unvibrated concrete & delayed culverts',
  },
];

export function calculateGpsDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function normalizeWorkstationName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function daysAgoIso(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
}

function buildRoster(
  prefix: string,
  activeEntries: Array<[string, number, number, number]>, // [name, points, monthlyReports, lastActiveDaysAgo]
  dormantEntries: Array<[string, number, number]> = [] // [name, points, lastActiveDaysAgo]
): StageMember[] {
  const active: StageMember[] = activeEntries.map(([name, points, monthlyReports, daysAgo], idx) => ({
    id: `scout-${prefix}-${idx + 1}`,
    name,
    rank: idx + 1,
    points,
    monthlyReports,
    qualifiedForShare: monthlyReports >= 1,
    joinedAt: daysAgoIso(Math.max(daysAgo + 15, 25)),
    lastActiveAt: daysAgoIso(daysAgo),
    isDormant: false,
    lionSharePct: 0,
    bountyShareUgx: 0,
  }));

  const dormant: StageMember[] = dormantEntries.map(([name, points, daysAgo], idx) => ({
    id: `scout-${prefix}-dormant-${idx + 1}`,
    name,
    rank: 0,
    points,
    monthlyReports: 0,
    qualifiedForShare: false,
    joinedAt: daysAgoIso(daysAgo + 30),
    lastActiveAt: daysAgoIso(daysAgo),
    isDormant: true,
    lionSharePct: 0,
    bountyShareUgx: 0,
  }));

  return [...active, ...dormant];
}

/**
 * Activity & Dormancy Evaluator:
 * An account is ACTIVE if they have at least 1 report within the last 30 days.
 * Dormant accounts (0 activity for >30 days) are hidden from public rosters,
 * post cards, and Top-3 rewards until they submit a new report.
 */
export function isStageMemberActive(member: Partial<StageMember>, nowMs = Date.now()): boolean {
  if (!member) return false;
  if (member.lastActiveAt) {
    const parsed = Date.parse(member.lastActiveAt);
    if (!Number.isNaN(parsed)) {
      const ageDays = (nowMs - parsed) / (1000 * 60 * 60 * 24);
      if (ageDays > DORMANCY_DAYS) return false;
      return (member.monthlyReports ?? 1) >= 1;
    }
  }
  if (typeof member.isDormant === 'boolean') return !member.isDormant && (member.monthlyReports ?? 1) >= 1;
  return (member.monthlyReports ?? 0) >= 1;
}

export function getActiveStageMembers(stage: FrontlineStage, nowMs = Date.now()): StageMember[] {
  const members = Array.isArray(stage.members) ? stage.members : [];
  return members
    .filter((m) => isStageMemberActive(m, nowMs))
    .map((m) => ({ ...m, isDormant: false }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return (b.monthlyReports || 0) - (a.monthlyReports || 0);
    });
}

/**
 * Top-3 Performance Reward Formula (Strictly Top 3 by Score Points):
 * - Dormant accounts are excluded.
 * - Rank #1: 50% · Rank #2: 30% · Rank #3: 20%.
 * - If fewer than 3 active members exist, shares scale proportionally across active Top-3 slots.
 */
export function distributeStageLionShare(
  totalPoolUgx: number,
  existingMembers?: StageMember[],
  existingTopScouts?: Array<{ id?: string; name: string; rank: number; points: number; badge: string; bountyShareUgx: number }>
): {
  topScouts: Array<{ id?: string; name: string; rank: number; points: number; badge: string; bountyShareUgx: number }>;
  members: StageMember[];
} {
  const nowMs = Date.now();
  const cloned = (existingMembers || []).map((m) => ({ ...m }));

  const active = cloned
    .filter((m) => isStageMemberActive(m, nowMs))
    .sort((a, b) => (b.points !== a.points ? b.points - a.points : b.monthlyReports - a.monthlyReports));

  const dormant = cloned
    .filter((m) => !isStageMemberActive(m, nowMs))
    .map((m) => ({
      ...m,
      rank: 0,
      isDormant: true,
      qualifiedForShare: false,
      lionSharePct: 0,
      bountyShareUgx: 0,
    }));

  const rawWeights = active.length >= 3 ? [50, 30, 20] : active.length === 2 ? [62.5, 37.5] : active.length === 1 ? [100] : [];
  const rankedActive: StageMember[] = active.map((m, idx) => {
    const rank = idx + 1;
    const sharePct = idx < 3 ? rawWeights[idx] : 0;
    const bountyShareUgx = sharePct > 0 ? Math.round((totalPoolUgx * sharePct) / 100) : 0;
    return {
      ...m,
      rank,
      isDormant: false,
      qualifiedForShare: idx < 3,
      lionSharePct: sharePct,
      bountyShareUgx,
    };
  });

  const existingBadgeByName = new Map(
    (existingTopScouts || []).map((t) => [t.name.toLowerCase(), t.badge])
  );

  const defaultBadges = [
    'Top Stage Performer (50%)',
    '2nd Rank Scout (30%)',
    '3rd Rank Scout (20%)',
  ];

  const topScouts = rankedActive.slice(0, 3).map((m, idx) => ({
    id: m.id,
    name: m.name,
    rank: idx + 1,
    points: m.points,
    badge: existingBadgeByName.get(m.name.toLowerCase()) || defaultBadges[idx] || 'Active Workstation Scout',
    bountyShareUgx: m.bountyShareUgx,
  }));

  return {
    topScouts,
    members: [...rankedActive, ...dormant],
  };
}

export function recomputeStageStandings(stage: FrontlineStage): FrontlineStage {
  const threshold = STAGE_CERTIFICATION_THRESHOLD;
  const { topScouts, members } = distributeStageLionShare(
    stage.patronSponsorPoolUgx,
    stage.members,
    stage.topScouts
  );
  const activeCount = members.filter((m) => !m.isDormant).length;
  const isCertified = activeCount >= threshold;
  const baseName = stage.name.trim();

  return {
    ...stage,
    thresholdRequired: threshold,
    scoutCount: activeCount,
    isCertified,
    officialLabel: isCertified
      ? `Certified ${baseName} Hub`
      : `${baseName} (Incubating ${activeCount}/${threshold})`,
    certifiedAt: isCertified ? stage.certifiedAt || new Date().toISOString().split('T')[0] : undefined,
    topScouts,
    members,
    updatedAt: new Date().toISOString(),
  };
}

const RAW_SEED_STAGES: FrontlineStage[] = [
  {
    id: 'stage-ug-equatorial-boda',
    name: 'Equatorial Boda Stage',
    normalizedName: 'equatorial boda stage',
    category: 'bodaboda',
    categoryLabel: 'Mobility Stage',
    categoryIcon: 'Bike',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kampala Central',
    parish: 'Nakasero II',
    centerGps: { lat: 0.3162, lng: 32.5781 },
    scoutCount: 17,
    thresholdRequired: 15,
    isCertified: true,
    officialLabel: 'Certified Equatorial Boda Stage Hub',
    certifiedAt: '2026-09-18',
    patronSponsorPoolUgx: 550000,
    patronCount: 6,
    patrons: [
      { patronName: 'Dr. James Byamukama', amountUgx: 200000, sponsoredAt: '2026-10-01', diasporaOrigin: 'London, UK' },
      { patronName: 'Kampala Road Hardware Ltd', amountUgx: 150000, sponsoredAt: '2026-10-05' },
      { patronName: 'Sarah K. (Diaspora)', amountUgx: 200000, sponsoredAt: '2026-10-08', diasporaOrigin: 'Boston, USA' },
    ],
    topScouts: [
      { name: 'Kato Paul (Stage Secretary)', rank: 1, points: 420, badge: 'Road Safety Champion', bountyShareUgx: 275000 },
      { name: 'Ssemwogerere David', rank: 2, points: 340, badge: 'Pothole Watchdog', bountyShareUgx: 165000 },
      { name: 'Okello Denis', rank: 3, points: 295, badge: 'Night Rider Scout', bountyShareUgx: 110000 },
    ],
    members: buildRoster(
      'eq',
      [
        ['Kato Paul (Stage Secretary)', 420, 14, 1],
        ['Ssemwogerere David', 340, 11, 2],
        ['Okello Denis', 295, 9, 2],
        ['Mugerwa Fred', 250, 7, 3],
        ['Nabirye Grace', 225, 6, 4],
        ['Byaruhanga Sam', 200, 5, 5],
        ['Lubega Patrick', 185, 5, 6],
        ['Nsereko Shafik', 170, 4, 7],
        ['Kayongo Moses', 155, 4, 8],
        ['Opio Emmanuel', 145, 3, 9],
        ['Kasumba Martin', 130, 3, 10],
        ['Bbosa Richard', 120, 3, 12],
        ['Nsubuga Godfrey', 110, 2, 14],
        ['Muwonge Hassan', 95, 2, 15],
        ['Ssegawa Ivan', 85, 2, 18],
        ['Kawuki Bosco', 75, 1, 20],
        ['Kiggundu Umar', 65, 1, 22],
      ],
      [
        ['Tumusiime Ben', 70, 44],
        ['Kato Rogers', 45, 52],
      ]
    ),
    scarcePerks: [
      { id: 'sp-helmet-01', title: 'DOT-Certified Safety Helmet', quantity: 2, recipientEligibility: 'top_3_only', allocatedToRanks: [1, 2], icon: 'Bike' },
      { id: 'sp-jacket-02', title: 'High-Visibility Reflective Armor Jacket', quantity: 3, recipientEligibility: 'top_3_only', allocatedToRanks: [1, 2, 3], icon: 'ShieldCheck' },
      { id: 'sp-oil-03', title: 'TotalEnergies 4T Engine Oil Voucher', quantity: 3, recipientEligibility: 'top_3_only', allocatedToRanks: [1, 2, 3], icon: 'Award' },
    ],
    recentScouts: [
      { scoutId: 'scout-eq-1', scoutName: 'Kato Paul (Stage Secretary)', reportedAt: '2 hours ago', lat: 0.3161, lng: 32.5782 },
      { scoutId: 'scout-eq-2', scoutName: 'Ssemwogerere David', reportedAt: '6 hours ago', lat: 0.3163, lng: 32.5779 },
      { scoutId: 'scout-eq-4', scoutName: 'Mugerwa Fred', reportedAt: 'Yesterday', lat: 0.316, lng: 32.5784 },
    ],
  },
  {
    id: 'stage-ug-nakasero-market-hub',
    name: 'Nakasero Market Central Hub',
    normalizedName: 'nakasero market central hub',
    category: 'market',
    categoryLabel: 'Market Vendor Hub',
    categoryIcon: 'Store',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kampala Central',
    parish: 'Nakasero I',
    centerGps: { lat: 0.3129, lng: 32.5794 },
    scoutCount: 16,
    thresholdRequired: 15,
    isCertified: true,
    officialLabel: 'Certified Nakasero Market Central Hub Hub',
    certifiedAt: '2026-09-10',
    patronSponsorPoolUgx: 750000,
    patronCount: 8,
    patrons: [
      { patronName: 'Green Produce Exporters', amountUgx: 350000, sponsoredAt: '2026-10-02' },
      { patronName: 'Nakasero Traders SACCO', amountUgx: 400000, sponsoredAt: '2026-10-06' },
    ],
    topScouts: [
      { name: 'Mama Betty Nakato', rank: 1, points: 510, badge: 'Clean Drains Guardian', bountyShareUgx: 375000 },
      { name: 'Hajjat Fatuma N.', rank: 2, points: 410, badge: 'Waste Disposal Auditor', bountyShareUgx: 225000 },
      { name: 'Sula Kato', rank: 3, points: 360, badge: 'Cold Chain Watch', bountyShareUgx: 150000 },
    ],
    members: buildRoster(
      'nak',
      [
        ['Mama Betty Nakato', 510, 16, 1],
        ['Hajjat Fatuma N.', 410, 11, 2],
        ['Sula Kato', 360, 9, 2],
        ['Kibirige Ronald', 280, 7, 3],
        ['Namatovu Jane', 240, 6, 4],
        ['Nalubega Agnes', 210, 5, 5],
        ['Mutyaba Steven', 190, 5, 6],
        ['Nabwire Ruth', 175, 4, 8],
        ['Bukenya Yusuf', 160, 4, 9],
        ['Namaganda Sylvia', 145, 3, 10],
        ['Ssemakula Charles', 135, 3, 11],
        ['Nambi Justine', 120, 3, 13],
        ['Kaggwa Andrew', 105, 2, 15],
        ['Nakimuli Sarah', 95, 2, 17],
        ['Mukasa Edward', 80, 1, 19],
        ['Nakyanzi Irene', 70, 1, 21],
      ],
      [['Walusimbi Peter', 60, 42]]
    ),
    scarcePerks: [
      { id: 'sp-apron-01', title: 'Heavy-Duty Waterproof Vendor Aprons', quantity: 2, recipientEligibility: 'top_3_only', allocatedToRanks: [1, 2], icon: 'Store' },
      { id: 'sp-scale-02', title: 'Digital Solar Produce Scale', quantity: 3, recipientEligibility: 'top_3_only', allocatedToRanks: [1, 2, 3], icon: 'Award' },
      { id: 'sp-clean-03', title: 'Commercial Sanitation Disinfectant Pack', quantity: 3, recipientEligibility: 'top_3_only', allocatedToRanks: [1, 2, 3], icon: 'ShieldCheck' },
    ],
    recentScouts: [
      { scoutId: 'scout-nak-1', scoutName: 'Mama Betty Nakato', reportedAt: '1 hour ago', lat: 0.313, lng: 32.5795 },
      { scoutId: 'scout-nak-4', scoutName: 'Kibirige Ronald', reportedAt: '4 hours ago', lat: 0.3128, lng: 32.5792 },
    ],
  },
  {
    id: 'stage-ug-bukoto-kisuule-boda',
    name: 'Bukoto Kisuule Boda Stage',
    normalizedName: 'bukoto kisuule boda stage',
    category: 'bodaboda',
    categoryLabel: 'Mobility Stage',
    categoryIcon: 'Bike',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kawempe',
    parish: 'Kisaasi',
    centerGps: { lat: 0.3541, lng: 32.5954 },
    scoutCount: 15,
    thresholdRequired: 15,
    isCertified: true,
    officialLabel: 'Certified Bukoto Kisuule Boda Stage Hub',
    certifiedAt: '2026-09-22',
    patronSponsorPoolUgx: 420000,
    patronCount: 4,
    patrons: [
      { patronName: 'Bukoto Residents Association', amountUgx: 250000, sponsoredAt: '2026-10-04' },
      { patronName: 'Kisuule Auto Spares', amountUgx: 170000, sponsoredAt: '2026-10-07' },
    ],
    topScouts: [
      { name: 'Ssemakula Ronald (Stage Chair)', rank: 1, points: 480, badge: 'Corridor Captain', bountyShareUgx: 210000 },
      { name: 'Lule Gerald', rank: 2, points: 390, badge: 'Flash Flood Watch', bountyShareUgx: 126000 },
      { name: 'Kisekka Moses', rank: 3, points: 310, badge: 'Manhole Inspector', bountyShareUgx: 84000 },
    ],
    members: buildRoster('buk', [
      ['Ssemakula Ronald (Stage Chair)', 480, 12, 1],
      ['Lule Gerald', 390, 9, 2],
      ['Kisekka Moses', 310, 7, 3],
      ['Mpagi Vincent', 245, 6, 4],
      ['Turyahabwe Allan', 215, 5, 5],
      ['Sserunjogi Umar', 190, 4, 6],
      ['Matovu Joel', 175, 4, 7],
      ['Kato Bashir', 160, 3, 9],
      ['Nkwanga Robert', 145, 3, 11],
      ['Oketcho Julius', 130, 3, 12],
      ['Muyanja Dennis', 115, 2, 14],
      ['Ssenabulya Simon', 100, 2, 16],
      ['Kirunda Isaac', 90, 2, 18],
      ['Waiswa Hamza', 75, 1, 20],
      ['Baguma Francis', 60, 1, 23],
    ]),
    recentScouts: [
      { scoutId: 'scout-buk-1', scoutName: 'Ssemakula Ronald (Stage Chair)', reportedAt: '3 hours ago', lat: 0.3542, lng: 32.5953 },
    ],
  },
  {
    id: 'stage-ug-old-taxi-park-bay4',
    name: 'Old Taxi Park Stage Bay 4',
    normalizedName: 'old taxi park stage bay 4',
    category: 'taxi',
    categoryLabel: 'Taxi / Commuter Rank',
    categoryIcon: 'Car',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kampala Central',
    parish: 'Civic Centre',
    centerGps: { lat: 0.3135, lng: 32.5758 },
    scoutCount: 15,
    thresholdRequired: 15,
    isCertified: true,
    officialLabel: 'Certified Old Taxi Park Stage Bay 4 Hub',
    certifiedAt: '2026-09-29',
    patronSponsorPoolUgx: 380000,
    patronCount: 3,
    patrons: [
      { patronName: 'Entebbe Road Taxi SACCO', amountUgx: 380000, sponsoredAt: '2026-10-03' },
    ],
    topScouts: [
      { name: 'Mukiibi Alex', rank: 1, points: 390, badge: 'Highway Blackspot Scout', bountyShareUgx: 190000 },
      { name: 'Bwire Joseph', rank: 2, points: 330, badge: 'Extortion Alert Lead', bountyShareUgx: 114000 },
      { name: 'Wasswa Brian', rank: 3, points: 280, badge: 'Expressway Route Watch', bountyShareUgx: 76000 },
    ],
    members: buildRoster('otp', [
      ['Mukiibi Alex', 390, 11, 1],
      ['Bwire Joseph', 330, 8, 2],
      ['Wasswa Brian', 280, 6, 3],
      ['Ssebugwawo Dan', 230, 5, 4],
      ['Ochieng Samuel', 200, 4, 6],
      ['Kyeyune Badru', 180, 4, 7],
      ['Tamale Hassan', 165, 3, 9],
      ['Katamba Steven', 150, 3, 10],
      ['Baluku Nathan', 135, 3, 12],
      ['Kizza Ronald', 120, 2, 13],
      ['Semwogerere Paul', 105, 2, 15],
      ['Ndyanabo Herbert', 95, 2, 17],
      ['Mwesigwa Brian', 85, 1, 19],
      ['Byakika Ibrahim', 75, 1, 21],
      ['Lukwago Shafiq', 60, 1, 24],
    ]),
    recentScouts: [
      { scoutId: 'scout-otp-1', scoutName: 'Mukiibi Alex', reportedAt: '5 hours ago', lat: 0.3134, lng: 32.5759 },
    ],
  },
  {
    id: 'stage-ug-mulago-ward4-health',
    name: 'Mulago Ward 4 Health Monitor Station',
    normalizedName: 'mulago ward 4 health monitor station',
    category: 'health',
    categoryLabel: 'Healthcare Station',
    categoryIcon: 'Stethoscope',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kawempe',
    parish: 'Mulago II',
    centerGps: { lat: 0.3392, lng: 32.5761 },
    scoutCount: 12,
    thresholdRequired: 15,
    isCertified: false,
    officialLabel: 'Mulago Ward 4 Health Monitor Station (Incubating 12/15)',
    patronSponsorPoolUgx: 250000,
    patronCount: 2,
    patrons: [
      { patronName: 'Kampala Health Friends NGO', amountUgx: 250000, sponsoredAt: '2026-10-02' },
    ],
    topScouts: [
      { name: 'Nurse Annet Namubiru', rank: 1, points: 260, badge: 'Cold Chain Watch', bountyShareUgx: 125000 },
      { name: 'Dr. Mukasa Eric', rank: 2, points: 210, badge: 'Oxygen Supply Monitor', bountyShareUgx: 75000 },
      { name: 'Nabukeera Prossy', rank: 3, points: 180, badge: 'Triage Guardian', bountyShareUgx: 50000 },
    ],
    members: buildRoster(
      'mul',
      [
        ['Nurse Annet Namubiru', 260, 8, 1],
        ['Dr. Mukasa Eric', 210, 6, 3],
        ['Nabukeera Prossy', 180, 5, 4],
        ['Sr. Atim Christine', 155, 4, 5],
        ['Musoke Henry', 140, 3, 7],
        ['Nakanjako Winnie', 120, 3, 9],
        ['Kiconco Peace', 105, 2, 11],
        ['Wamala Geoffrey', 95, 2, 13],
        ['Namutebi Edith', 80, 2, 16],
        ['Okumu Kenneth', 70, 1, 18],
        ['Auma Beatrice', 60, 1, 21],
        ['Ssenfuka Peter', 50, 1, 24],
      ],
      [['Mugisha Raymond', 85, 39]]
    ),
    recentScouts: [
      { scoutId: 'scout-mul-1', scoutName: 'Nurse Annet Namubiru', reportedAt: 'Yesterday', lat: 0.3391, lng: 32.5762 },
    ],
  },
  {
    id: 'stage-ug-kitante-primary-gate',
    name: 'Kitante Primary Gate School Watch',
    normalizedName: 'kitante primary gate school watch',
    category: 'teacher',
    categoryLabel: 'School Watch Station',
    categoryIcon: 'GraduationCap',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kampala Central',
    parish: 'Nakasero II',
    centerGps: { lat: 0.3245, lng: 32.5852 },
    scoutCount: 11,
    thresholdRequired: 15,
    isCertified: false,
    officialLabel: 'Kitante Primary Gate School Watch (Incubating 11/15)',
    patronSponsorPoolUgx: 180000,
    patronCount: 2,
    patrons: [
      { patronName: 'Kitante Alumni Circle', amountUgx: 180000, sponsoredAt: '2026-10-07' },
    ],
    topScouts: [
      { name: 'Tr. Grace Akello', rank: 1, points: 240, badge: 'Pedestrian Zebra Warden', bountyShareUgx: 90000 },
      { name: 'Okia Samuel (PTA Rep)', rank: 2, points: 195, badge: 'Safe Crossing Scout', bountyShareUgx: 54000 },
      { name: 'Nalwadda Joan', rank: 3, points: 150, badge: 'Drainage Alert Scout', bountyShareUgx: 36000 },
    ],
    members: buildRoster('kit', [
      ['Tr. Grace Akello', 240, 7, 1],
      ['Okia Samuel (PTA Rep)', 195, 5, 3],
      ['Nalwadda Joan', 150, 4, 4],
      ['Opolot James', 130, 3, 6],
      ['Nankya Brenda', 115, 3, 8],
      ['Tusiime Juliet', 100, 2, 11],
      ['Kaggwa Lawrence', 85, 2, 13],
      ['Nantongo Rebecca', 75, 2, 15],
      ['Kasozi Emmanuel', 65, 1, 18],
      ['Babra Katushabe', 55, 1, 20],
      ['Mwebaze Godfrey', 45, 1, 23],
    ]),
    recentScouts: [
      { scoutId: 'scout-kit-1', scoutName: 'Tr. Grace Akello', reportedAt: '2 days ago', lat: 0.3246, lng: 32.5851 },
    ],
  },
];

export const SEED_FRONTLINE_STAGES: FrontlineStage[] = RAW_SEED_STAGES.map(recomputeStageStandings);

const STORAGE_KEY = 'civicduty_frontline_stages_v2';
const LEGACY_STORAGE_KEY = 'civicduty_frontline_stages_v1';

function notifyStagesUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STAGES_UPDATED_EVENT));
  }
}

export function getStoredStages(): FrontlineStage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(recomputeStageStandings);
      }
    }
    // Migrate custom user-created stages from legacy storage if present
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    const seedIds = new Set(SEED_FRONTLINE_STAGES.map((s) => s.id));
    let merged = [...SEED_FRONTLINE_STAGES];
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed)) {
        const customFromLegacy = legacyParsed
          .filter((s: FrontlineStage) => s?.id && !seedIds.has(s.id))
          .map((s: FrontlineStage) => recomputeStageStandings(s));
        merged = [...customFromLegacy, ...SEED_FRONTLINE_STAGES];
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return SEED_FRONTLINE_STAGES;
  }
}

export function saveStoredStages(stages: FrontlineStage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stages));
    notifyStagesUpdated();
  } catch (err) {
    console.warn('Failed to save frontline stages to localStorage:', err);
  }
}

export function syncStagesFromCloudSnapshot(cloudStages: FrontlineStage[]): FrontlineStage[] {
  if (!Array.isArray(cloudStages) || cloudStages.length === 0) {
    return getStoredStages();
  }
  const current = getStoredStages();
  const stageMap = new Map<string, FrontlineStage>();
  current.forEach((s) => stageMap.set(s.id, s));
  cloudStages.forEach((cs) => {
    if (!cs?.id) return;
    const local = stageMap.get(cs.id);
    // Prefer whichever has newer updatedAt or richer member roster
    const cloudTime = cs.updatedAt ? Date.parse(cs.updatedAt) : 0;
    const localTime = local?.updatedAt ? Date.parse(local.updatedAt) : 0;
    if (!local || cloudTime >= localTime) {
      stageMap.set(cs.id, recomputeStageStandings({ ...(local || {}), ...cs }));
    }
  });
  const merged = Array.from(stageMap.values());
  saveStoredStages(merged);
  return merged;
}

export function isUserMemberOfStage(stage: FrontlineStage, scoutId?: string, scoutName?: string): boolean {
  const idLower = (scoutId || '').toLowerCase().trim();
  const nameLower = (scoutName || '').toLowerCase().trim();
  const members = stage.members || [];
  return members.some((m) => {
    const idMatch = idLower && m.id.toLowerCase() === idLower;
    const nameMatch = nameLower && nameLower !== 'citizen observer' && m.name.toLowerCase() === nameLower;
    return Boolean(idMatch || nameMatch);
  });
}

export function getUserActiveStage(scoutId?: string, scoutName?: string): { stage: FrontlineStage; member: StageMember } | null {
  const stages = getStoredStages();
  const idLower = (scoutId || '').toLowerCase().trim();
  const nameLower = (scoutName || '').toLowerCase().trim();
  const nowMs = Date.now();
  for (const stage of stages) {
    const found = (stage.members || []).find((m) => {
      const idMatch = idLower && m.id.toLowerCase() === idLower;
      const nameMatch = nameLower && nameLower !== 'citizen observer' && m.name.toLowerCase() === nameLower;
      return Boolean(idMatch || nameMatch) && isStageMemberActive(m, nowMs);
    });
    if (found) {
      return { stage, member: found };
    }
  }
  return null;
}

/**
 * Checks whether a post author is CURRENTLY an active (non-dormant, non-exited)
 * member of the workstation attached to a post. Dormant/exited accounts lose the
 * active workstation badge on post cards, while the civic post itself stays visible.
 */
export function isAuthorActiveInWorkstation(params: {
  stageId?: string;
  workstationName?: string;
  scoutId?: string;
  scoutName?: string;
  stages?: FrontlineStage[];
}): { active: boolean; stage?: FrontlineStage; member?: StageMember } {
  const list = params.stages || getStoredStages();
  const normalizedName = params.workstationName ? normalizeWorkstationName(params.workstationName) : '';
  const stage = list.find(
    (s) =>
      (params.stageId && s.id === params.stageId) ||
      (normalizedName && s.normalizedName === normalizedName)
  );
  if (!stage) return { active: false };

  const idLower = (params.scoutId || '').toLowerCase().trim();
  const nameLower = (params.scoutName || '').toLowerCase().trim();
  const nowMs = Date.now();

  const member = (stage.members || []).find((m) => {
    const idMatch = idLower && m.id.toLowerCase() === idLower;
    const nameMatch =
      nameLower &&
      (m.name.toLowerCase() === nameLower ||
        m.name.toLowerCase().startsWith(`${nameLower} (`));
    return Boolean(idMatch || nameMatch);
  });

  if (!member) return { active: false, stage };
  if (!isStageMemberActive(member, nowMs)) return { active: false, stage, member };
  return { active: true, stage, member };
}

/**
 * Stage Establishment Consensus Algorithm:
 * - Joining happens when reporting under a Frontline Workstation identity.
 * - Matches existing stage by ID, or within 2km with similar name.
 * - Enforces one active workstation per scout (automatically transfers out of previous stage if switching).
 * - Deduplicates by unique scoutId (never double-counts multiple reports from the same scout).
 * - Reactivates dormant members upon new report.
 * - Certifies automatically at 15 active unique scouts.
 */
export function registerScoutWorkstationConsensus(params: {
  stageId?: string;
  category: FrontlineScoutCategory;
  workstationName: string;
  lat: number;
  lng: number;
  country: CountryCode;
  parish: string;
  subcounty: string;
  district: string;
  scoutId: string;
  scoutName: string;
  reportSnippet?: string;
}): {
  stage: FrontlineStage;
  newlyCertified: boolean;
  newlyEstablished: boolean;
  joinedNewMember: boolean;
  reactivatedMember: boolean;
  switchedFromStage?: string;
  pointsAwarded: number;
  distanceKmToCenter: number;
  scoutCount: number;
  consensusProgressPct: number;
} {
  let stages = getStoredStages();
  const normalizedInput = normalizeWorkstationName(params.workstationName);
  const nowIso = new Date().toISOString();
  const scoutIdLower = (params.scoutId || '').toLowerCase().trim();
  const scoutNameLower = (params.scoutName || '').toLowerCase().trim();

  // Locate target workstation (by explicit stageId first, otherwise GPS + name within 2km)
  let targetStageIndex = params.stageId
    ? stages.findIndex((s) => s.id === params.stageId)
    : -1;

  if (targetStageIndex < 0) {
    targetStageIndex = stages.findIndex((s) => {
      if (s.country !== params.country) return false;
      if (s.category !== params.category) return false;
      const dist = calculateGpsDistanceKm(s.centerGps.lat, s.centerGps.lng, params.lat, params.lng);
      const nameMatch =
        s.normalizedName === normalizedInput ||
        s.normalizedName.includes(normalizedInput) ||
        normalizedInput.includes(s.normalizedName);
      return dist <= 2.0 && nameMatch;
    });
  }

  const targetStageId = targetStageIndex >= 0 ? stages[targetStageIndex].id : null;
  let switchedFromStage: string | undefined;

  // One active workstation at a time: exit any OTHER workstation the scout belongs to
  stages = stages.map((st) => {
    if (st.id === targetStageId) return st;
    if (!isUserMemberOfStage(st, params.scoutId, params.scoutName)) return st;
    switchedFromStage = st.name;
    const filteredMembers = (st.members || []).filter((m) => {
      const idMatch = scoutIdLower && m.id.toLowerCase() === scoutIdLower;
      const nameMatch = scoutNameLower && scoutNameLower !== 'citizen observer' && m.name.toLowerCase() === scoutNameLower;
      return !(idMatch || nameMatch);
    });
    const updatedOther = recomputeStageStandings({
      ...st,
      members: filteredMembers,
      recentScouts: st.recentScouts.filter((r) => r.scoutId !== params.scoutId && r.scoutName !== params.scoutName),
    });
    saveFrontlineStageToCloud(updatedOther).catch(() => {});
    return updatedOther;
  });

  // Re-resolve target index after any transfer
  targetStageIndex = targetStageId ? stages.findIndex((s) => s.id === targetStageId) : -1;

  const categoryMeta =
    FRONTLINE_CATEGORIES.find((c) => c.id === params.category) || FRONTLINE_CATEGORIES[0];

  if (targetStageIndex >= 0) {
    const existing = stages[targetStageIndex];
    const distToCenter = calculateGpsDistanceKm(
      existing.centerGps.lat,
      existing.centerGps.lng,
      params.lat,
      params.lng
    );

    const existingMembers = [...(existing.members || [])];
    const memberIdx = existingMembers.findIndex((m) => {
      const idMatch = scoutIdLower && m.id.toLowerCase() === scoutIdLower;
      const nameMatch = scoutNameLower && scoutNameLower !== 'citizen observer' && m.name.toLowerCase() === scoutNameLower;
      return Boolean(idMatch || nameMatch);
    });

    let joinedNewMember = false;
    let reactivatedMember = false;
    let pointsAwarded = 35;

    if (memberIdx >= 0) {
      const prevMember = existingMembers[memberIdx];
      reactivatedMember = !isStageMemberActive(prevMember);
      pointsAwarded = reactivatedMember ? 40 : 35;
      existingMembers[memberIdx] = {
        ...prevMember,
        id: params.scoutId || prevMember.id,
        name: params.scoutName || prevMember.name,
        points: prevMember.points + pointsAwarded,
        monthlyReports: (prevMember.monthlyReports || 0) + 1,
        lastActiveAt: nowIso,
        isDormant: false,
        qualifiedForShare: true,
      };
    } else {
      joinedNewMember = true;
      pointsAwarded = 40;
      existingMembers.push({
        id: params.scoutId,
        name: params.scoutName,
        rank: existingMembers.length + 1,
        points: pointsAwarded,
        monthlyReports: 1,
        qualifiedForShare: true,
        joinedAt: nowIso,
        lastActiveAt: nowIso,
        isDormant: false,
        lionSharePct: 0,
        bountyShareUgx: 0,
      });
    }

    const updatedRecent = [
      {
        scoutId: params.scoutId,
        scoutName: params.scoutName,
        reportedAt: 'Just now',
        lat: params.lat,
        lng: params.lng,
      },
      ...existing.recentScouts.filter((r) => r.scoutId !== params.scoutId && r.scoutName !== params.scoutName),
    ].slice(0, 12);

    const countBase = Math.max(1, existing.scoutCount);
    const updatedStage = recomputeStageStandings({
      ...existing,
      members: existingMembers,
      recentScouts: updatedRecent,
      centerGps: {
        lat: Number(((existing.centerGps.lat * countBase + params.lat) / (countBase + 1)).toFixed(5)),
        lng: Number(((existing.centerGps.lng * countBase + params.lng) / (countBase + 1)).toFixed(5)),
      },
    });

    const newlyCertified = !existing.isCertified && updatedStage.isCertified;
    stages[targetStageIndex] = updatedStage;
    saveStoredStages(stages);
    saveFrontlineStageToCloud(updatedStage).catch(() => {});

    return {
      stage: updatedStage,
      newlyCertified,
      newlyEstablished: newlyCertified,
      joinedNewMember,
      reactivatedMember,
      switchedFromStage,
      pointsAwarded,
      distanceKmToCenter: distToCenter,
      scoutCount: updatedStage.scoutCount,
      consensusProgressPct: Math.min(100, Math.round((updatedStage.scoutCount / updatedStage.thresholdRequired) * 100)),
    };
  } else {
    // Create new incubating stage with 1 active founding scout
    const foundingPoints = 50;
    const rawNewStage: FrontlineStage = {
      id: `stage-${params.country.toLowerCase()}-${Date.now()}`,
      name: params.workstationName.trim(),
      normalizedName: normalizedInput,
      category: params.category,
      categoryLabel: categoryMeta.label.split('(')[0].trim(),
      categoryIcon: categoryMeta.iconName,
      country: params.country,
      district: params.district || 'Kampala',
      subcounty: params.subcounty || 'Central',
      parish: params.parish || 'Central Ward',
      centerGps: { lat: params.lat, lng: params.lng },
      scoutCount: 1,
      thresholdRequired: STAGE_CERTIFICATION_THRESHOLD,
      isCertified: false,
      officialLabel: `${params.workstationName.trim()} (Incubating 1/${STAGE_CERTIFICATION_THRESHOLD})`,
      patronSponsorPoolUgx: 50000,
      patronCount: 1,
      patrons: [
        {
          patronName: 'CivicDuty Community Seed Vault',
          amountUgx: 50000,
          sponsoredAt: nowIso.split('T')[0],
        },
      ],
      topScouts: [],
      members: [
        {
          id: params.scoutId,
          name: params.scoutName,
          rank: 1,
          points: foundingPoints,
          monthlyReports: 1,
          qualifiedForShare: true,
          joinedAt: nowIso,
          lastActiveAt: nowIso,
          isDormant: false,
          lionSharePct: 100,
          bountyShareUgx: 50000,
        },
      ],
      recentScouts: [
        {
          scoutId: params.scoutId,
          scoutName: params.scoutName,
          reportedAt: 'Just now',
          lat: params.lat,
          lng: params.lng,
        },
      ],
    };

    const newStage = recomputeStageStandings(rawNewStage);
    stages.unshift(newStage);
    saveStoredStages(stages);
    saveFrontlineStageToCloud(newStage).catch(() => {});

    return {
      stage: newStage,
      newlyCertified: false,
      newlyEstablished: false,
      joinedNewMember: true,
      reactivatedMember: false,
      switchedFromStage,
      pointsAwarded: foundingPoints,
      distanceKmToCenter: 0,
      scoutCount: 1,
      consensusProgressPct: Math.round((1 / STAGE_CERTIFICATION_THRESHOLD) * 100),
    };
  }
}

export function contributePatronSponsorship(
  stageId: string,
  amountUgx: number,
  patronName: string,
  diasporaOrigin?: string
): FrontlineStage | null {
  const stages = getStoredStages();
  const index = stages.findIndex((s) => s.id === stageId);
  if (index < 0) return null;

  const stage = stages[index];
  const updatedPool = stage.patronSponsorPoolUgx + amountUgx;
  const updatedPatrons = [
    {
      patronName: patronName || 'Anonymous Community Patron',
      amountUgx,
      sponsoredAt: new Date().toISOString().split('T')[0],
      diasporaOrigin,
    },
    ...stage.patrons,
  ];

  const updatedStage = recomputeStageStandings({
    ...stage,
    patronSponsorPoolUgx: updatedPool,
    patronCount: stage.patronCount + 1,
    patrons: updatedPatrons,
  });

  stages[index] = updatedStage;
  saveStoredStages(stages);
  saveFrontlineStageToCloud(updatedStage).catch(() => {});
  return updatedStage;
}

/**
 * Voluntary Exit from Workstation Group:
 * Only succeeds if the user is actually a member of this workstation.
 * Removes them from the active roster, recalculates Top-3 rewards, and
 * re-evaluates certification status if active scouts drop below 15.
 */
export function exitStageGroup(
  stageId: string,
  scoutId: string,
  scoutName?: string
): { success: boolean; stage?: FrontlineStage; message: string } {
  const stages = getStoredStages();
  const index = stages.findIndex((s) => s.id === stageId);
  if (index < 0) {
    return { success: false, message: 'Workstation stage not found.' };
  }

  const stage = stages[index];
  const currentMembers = stage.members || [];
  const idLower = (scoutId || '').toLowerCase().trim();
  const nameLower = (scoutName || '').toLowerCase().trim();

  const remainingMembers = currentMembers.filter((m) => {
    const idMatch = idLower && m.id.toLowerCase() === idLower;
    const nameMatch = nameLower && nameLower !== 'citizen observer' && m.name.toLowerCase() === nameLower;
    return !(idMatch || nameMatch);
  });

  if (remainingMembers.length === currentMembers.length) {
    return {
      success: false,
      message: `You are not currently a member of ${stage.name}.`,
    };
  }

  const updatedStage = recomputeStageStandings({
    ...stage,
    members: remainingMembers,
    recentScouts: stage.recentScouts.filter(
      (r) => r.scoutId !== scoutId && (!nameLower || r.scoutName.toLowerCase() !== nameLower)
    ),
  });

  stages[index] = updatedStage;
  saveStoredStages(stages);
  saveFrontlineStageToCloud(updatedStage).catch(() => {});

  const statusNote = updatedStage.isCertified
    ? `${updatedStage.scoutCount}/${updatedStage.thresholdRequired} active scouts remain.`
    : `Group is now Incubating (${updatedStage.scoutCount}/${updatedStage.thresholdRequired} active).`;

  return {
    success: true,
    stage: updatedStage,
    message: `Exited ${stage.name}. ${statusNote}`,
  };
}
