import { CountryCode } from '../types';

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

export interface FrontlineStage {
  id: string;
  name: string; // e.g. "Equatorial Boda Stage"
  normalizedName: string;
  category: FrontlineScoutCategory;
  categoryLabel: string;
  categoryIcon: string;
  country: CountryCode;
  district: string;
  subcounty: string;
  parish: string; // Home Parish Lock
  centerGps: { lat: number; lng: number };
  scoutCount: number;
  thresholdRequired: number; // 15 scouts within 2km
  isCertified: boolean; // scoutCount >= 15
  officialLabel: string; // e.g. "Certified Equatorial Bodaboda Stage"
  certifiedAt?: string;
  patronSponsorPoolUgx: number; // Patron Sponsoring enabled
  patronCount: number;
  patrons: Array<{
    patronName: string;
    amountUgx: number;
    sponsoredAt: string;
    diasporaOrigin?: string;
  }>;
  topScouts: Array<{
    name: string;
    rank: number;
    points: number;
    badge: string;
    bountyShareUgx: number;
  }>;
  recentScouts: Array<{
    scoutName: string;
    reportedAt: string;
    lat: number;
    lng: number;
  }>;
}

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
    label: 'Bodaboda Stage (Road Safety & Transit Scout)',
    workstationPlaceholder: 'Name of Boda Stage (e.g. Equatorial Boda Stage, Bukoto Kisuule Stage)',
    example: 'Equatorial Boda Stage',
    iconName: 'Bike',
    roleDescription: 'Road hazard, open trench & streetlight reporting',
  },
  {
    id: 'market',
    label: 'Market Vendor Hub (Public Market & Sanitation Scout)',
    workstationPlaceholder: 'Name of Market / Stall Section (e.g. Nakasero Market Vegetable Row, Owino Block 4)',
    example: 'Nakasero Market Produce Section',
    iconName: 'Store',
    roleDescription: 'Drainage, garbage clearance & utility supply monitoring',
  },
  {
    id: 'taxi',
    label: 'Taxi / Matatu Stage (Highway & Transit Corridor Scout)',
    workstationPlaceholder: 'Name of Taxi Park / Route Stage (e.g. Old Taxi Park Bay 4, Kalerwe Stage)',
    example: 'Old Taxi Park Bay 4 (Entebbe Stage)',
    iconName: 'Car',
    roleDescription: 'Highway blackspots, road washouts & route extortion alerts',
  },
  {
    id: 'health',
    label: 'Healthcare Station (Clinic & Public Health Monitor)',
    workstationPlaceholder: 'Name of Clinic / Health Centre Station (e.g. Mulago Ward 4 Station, Kiswa HC III)',
    example: 'Mulago Outpatient Station',
    iconName: 'Stethoscope',
    roleDescription: 'Essential medicine stockouts, triage power & sanitation oversight',
  },
  {
    id: 'teacher',
    label: 'School Watch Station (Education & Youth Leader Scout)',
    workstationPlaceholder: 'Name of School / Youth Station (e.g. Kitante Primary Gate, Kololo SS Watch)',
    example: 'Kitante Primary Gate',
    iconName: 'GraduationCap',
    roleDescription: 'Dilapidated classrooms, crossing safety & learner welfare audits',
  },
  {
    id: 'artisan',
    label: 'Artisan Works Depot (Public Works & Infrastructure Inspector)',
    workstationPlaceholder: 'Name of Works Depot / Project Site (e.g. Clock Tower Culvert Site, Busega Depot)',
    example: 'Clock Tower Culvert Depot',
    iconName: 'HardHat',
    roleDescription: 'Substandard asphalt, unvibrated concrete & delayed culverts',
  },
];

export function calculateGpsDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
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

const STORAGE_KEY = 'civicduty_frontline_stages_v1';

export const SEED_FRONTLINE_STAGES: FrontlineStage[] = [
  {
    id: 'stage-ug-equatorial-boda',
    name: 'Equatorial Boda Stage',
    normalizedName: 'equatorial boda stage',
    category: 'bodaboda',
    categoryLabel: 'Bodaboda Stage',
    categoryIcon: 'Bike',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kampala Central',
    parish: 'Nakasero II',
    centerGps: { lat: 0.3162, lng: 32.5781 },
    scoutCount: 17,
    thresholdRequired: 15,
    isCertified: true,
    officialLabel: 'Certified Equatorial Bodaboda Stage Hub',
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
    recentScouts: [
      { scoutName: 'Kato Paul', reportedAt: '2 hours ago', lat: 0.3161, lng: 32.5782 },
      { scoutName: 'Ssemwogerere David', reportedAt: '6 hours ago', lat: 0.3163, lng: 32.5779 },
      { scoutName: 'Mugerwa Fred', reportedAt: 'Yesterday', lat: 0.316, lng: 32.5784 },
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
    scoutCount: 19,
    thresholdRequired: 15,
    isCertified: true,
    officialLabel: 'Certified Nakasero Market Vendor Hub',
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
    recentScouts: [
      { scoutName: 'Mama Betty Nakato', reportedAt: '1 hour ago', lat: 0.313, lng: 32.5795 },
      { scoutName: 'Kibirige Ronald', reportedAt: '4 hours ago', lat: 0.3128, lng: 32.5792 },
    ],
  },
  {
    id: 'stage-ug-bukoto-kisuule-boda',
    name: 'Bukoto Kisuule Boda Stage',
    normalizedName: 'bukoto kisuule boda stage',
    category: 'bodaboda',
    categoryLabel: 'Bodaboda Stage',
    categoryIcon: 'Bike',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kawempe',
    parish: 'Kisaasi',
    centerGps: { lat: 0.3541, lng: 32.5954 },
    scoutCount: 16,
    thresholdRequired: 15,
    isCertified: true,
    officialLabel: 'Certified Bukoto Kisuule Bodaboda Stage',
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
    recentScouts: [
      { scoutName: 'Ssemakula Ronald', reportedAt: '3 hours ago', lat: 0.3542, lng: 32.5953 },
    ],
  },
  {
    id: 'stage-ug-old-taxi-park-bay4',
    name: 'Old Taxi Park Stage Bay 4',
    normalizedName: 'old taxi park stage bay 4',
    category: 'taxi',
    categoryLabel: 'Taxi / Matatu Stage',
    categoryIcon: 'Car',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Kampala Central',
    parish: 'Civic Centre',
    centerGps: { lat: 0.3135, lng: 32.5758 },
    scoutCount: 15,
    thresholdRequired: 15,
    isCertified: true,
    officialLabel: 'Certified Old Taxi Park Highway Corridor Hub',
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
    recentScouts: [
      { scoutName: 'Mukiibi Alex', reportedAt: '5 hours ago', lat: 0.3134, lng: 32.5759 },
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
    scoutCount: 12, // Incubating!
    thresholdRequired: 15,
    isCertified: false,
    officialLabel: 'Mulago Ward 4 Health Monitor Station (Incubating)',
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
    recentScouts: [
      { scoutName: 'Nurse Annet Namubiru', reportedAt: 'Yesterday', lat: 0.3391, lng: 32.5762 },
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
    scoutCount: 11, // Incubating!
    thresholdRequired: 15,
    isCertified: false,
    officialLabel: 'Kitante Primary Gate School Watch (Incubating)',
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
    recentScouts: [
      { scoutName: 'Tr. Grace Akello', reportedAt: '2 days ago', lat: 0.3246, lng: 32.5851 },
    ],
  },
];

export function getStoredStages(): FrontlineStage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FRONTLINE_STAGES));
      return SEED_FRONTLINE_STAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_FRONTLINE_STAGES;
  } catch {
    return SEED_FRONTLINE_STAGES;
  }
}

export function saveStoredStages(stages: FrontlineStage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stages));
  } catch (err) {
    console.warn('Failed to save frontline stages to localStorage:', err);
  }
}

/**
 * Stage Establishment Consensus Algorithm:
 * - Checks if user provided GPS and workstation name.
 * - Finds existing stage cluster within 2km with matching/similar normalized name.
 * - If found:
 *   - Checks if this scout already recorded at this station; updates scout count.
 *   - If scoutCount >= 15 (more than 15, or threshold reached), auto-compiles and promotes stage to CERTIFIED.
 * - If not found:
 *   - Creates new incubator stage with 1 scout.
 * - Enforces Home Parish Lock.
 */
export function registerScoutWorkstationConsensus(params: {
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
  distanceKmToCenter: number;
  scoutCount: number;
  consensusProgressPct: number;
} {
  const stages = getStoredStages();
  const normalizedInput = normalizeWorkstationName(params.workstationName);

  // Find cluster within 2km and matching name
  let targetStageIndex = stages.findIndex((s) => {
    if (s.country !== params.country) return false;
    if (s.category !== params.category) return false;
    const dist = calculateGpsDistanceKm(s.centerGps.lat, s.centerGps.lng, params.lat, params.lng);
    const nameMatch =
      s.normalizedName === normalizedInput ||
      s.normalizedName.includes(normalizedInput) ||
      normalizedInput.includes(s.normalizedName);
    return dist <= 2.0 && nameMatch;
  });

  let newlyCertified = false;
  let distToCenter = 0;

  const categoryMeta =
    FRONTLINE_CATEGORIES.find((c) => c.id === params.category) || FRONTLINE_CATEGORIES[0];

  if (targetStageIndex >= 0) {
    const existing = stages[targetStageIndex];
    distToCenter = calculateGpsDistanceKm(
      existing.centerGps.lat,
      existing.centerGps.lng,
      params.lat,
      params.lng
    );

    // Add scout if not already recorded recently
    const alreadyLogged = existing.recentScouts.some(
      (r) => r.scoutName.toLowerCase() === params.scoutName.toLowerCase()
    );

    const updatedScoutCount = alreadyLogged ? existing.scoutCount : existing.scoutCount + 1;
    const shouldCertify = updatedScoutCount >= existing.thresholdRequired;
    if (!existing.isCertified && shouldCertify) {
      newlyCertified = true;
    }

    const updatedStage: FrontlineStage = {
      ...existing,
      scoutCount: updatedScoutCount,
      isCertified: existing.isCertified || shouldCertify,
      officialLabel:
        existing.isCertified || shouldCertify
          ? `Certified ${existing.name} Hub`
          : `${existing.name} (Incubating ${updatedScoutCount}/${existing.thresholdRequired})`,
      certifiedAt: existing.certifiedAt || (newlyCertified ? new Date().toISOString().split('T')[0] : undefined),
      recentScouts: [
        {
          scoutName: params.scoutName,
          reportedAt: 'Just now',
          lat: params.lat,
          lng: params.lng,
        },
        ...existing.recentScouts.slice(0, 7),
      ],
      // Re-center GPS slightly
      centerGps: {
        lat: Number(((existing.centerGps.lat * existing.scoutCount + params.lat) / (existing.scoutCount + 1)).toFixed(5)),
        lng: Number(((existing.centerGps.lng * existing.scoutCount + params.lng) / (existing.scoutCount + 1)).toFixed(5)),
      },
    };

    stages[targetStageIndex] = updatedStage;
    saveStoredStages(stages);

    return {
      stage: updatedStage,
      newlyCertified,
      distanceKmToCenter: distToCenter,
      scoutCount: updatedScoutCount,
      consensusProgressPct: Math.min(100, Math.round((updatedScoutCount / existing.thresholdRequired) * 100)),
    };
  } else {
    // Create new incubating stage
    const newStage: FrontlineStage = {
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
      thresholdRequired: 15,
      isCertified: false,
      officialLabel: `${params.workstationName.trim()} (Incubating 1/15 Scouts)`,
      patronSponsorPoolUgx: 50000, // Seed bootstrap sponsor pool
      patronCount: 1,
      patrons: [
        {
          patronName: 'CivicDuty Community Seed Vault',
          amountUgx: 50000,
          sponsoredAt: new Date().toISOString().split('T')[0],
        },
      ],
      topScouts: [
        {
          name: params.scoutName,
          rank: 1,
          points: 100,
          badge: 'Founding Stage Scout',
          bountyShareUgx: 50000,
        },
      ],
      recentScouts: [
        {
          scoutName: params.scoutName,
          reportedAt: 'Just now',
          lat: params.lat,
          lng: params.lng,
        },
      ],
    };

    stages.unshift(newStage);
    saveStoredStages(stages);

    return {
      stage: newStage,
      newlyCertified: false,
      distanceKmToCenter: 0,
      scoutCount: 1,
      consensusProgressPct: Math.round((1 / 15) * 100),
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

  // Re-calculate top-3 bounty shares based on 50% / 30% / 20% rule
  const updatedTopScouts = stage.topScouts.map((scout, idx) => {
    const shareRatio = idx === 0 ? 0.5 : idx === 1 ? 0.3 : 0.2;
    return {
      ...scout,
      bountyShareUgx: Math.round(updatedPool * shareRatio),
    };
  });

  const updatedStage: FrontlineStage = {
    ...stage,
    patronSponsorPoolUgx: updatedPool,
    patronCount: stage.patronCount + 1,
    patrons: updatedPatrons,
    topScouts: updatedTopScouts,
  };

  stages[index] = updatedStage;
  saveStoredStages(stages);
  return updatedStage;
}
