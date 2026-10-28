import { EnterpriseBranch, BranchTeam } from '../types';

export const SEED_ENTERPRISE_BRANCHES: EnterpriseBranch[] = [
  // --- KFC Uganda Nationwide Branches ---
  {
    id: 'kfc-main-hq',
    deptId: 'kfc_ug',
    brandName: 'KFC Uganda',
    name: 'Main Branch (Kampala National HQ)',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Central Division',
    parish: 'Nakasero Parish',
    landmark: 'Plot 12 Kampala Road, Corporate HQ Tower',
    accessCode: 'KFC-UG-MAIN',
    managerName: 'KFC Country Operations Superadmin',
    managerPhone: '+256 700 100 200',
    managerEmail: 'superadmin@kfcuganda.com',
    slaHours: 12,
    status: 'active',
    openTicketsCount: 4,
    resolvedTicketsCount: 180,
    ratingScore: 98,
    created_at: '2026-01-01T08:00:00Z',
    is_main_branch: true,
    teams: [
      { id: 't-kfc-hq-1', name: 'National Operations & Audit', lead: 'Arthur Sempebwa', category: 'management', memberCount: 12 },
      { id: 't-kfc-hq-2', name: 'Franchise Quality Assurance', lead: 'Dr. Grace Mukisa', category: 'technical', memberCount: 8 },
    ],
  },
  {
    id: 'kfc-mbarara',
    deptId: 'kfc_ug',
    brandName: 'KFC Uganda',
    name: 'KFC Mbarara Branch',
    country: 'UG',
    district: 'Mbarara',
    subcounty: 'Mbarara City South',
    parish: 'Kakoba Parish',
    landmark: 'Mbarara High Street, Opposite Stanbic Bank',
    accessCode: 'KFC-MBARARA-MGR',
    managerName: 'Duncan Mugume',
    managerPhone: '+256 779 812 400',
    managerEmail: 'duncan.m@kfcuganda.com',
    slaHours: 12,
    status: 'active',
    openTicketsCount: 2,
    resolvedTicketsCount: 24,
    ratingScore: 95,
    created_at: '2026-02-15T09:00:00Z',
    teams: [
      { id: 't-kfc-mb-1', name: 'Western Region Fryers Crew', lead: 'Evelyn Ainembabazi', category: 'operations', memberCount: 7 },
      { id: 't-kfc-mb-2', name: 'High Street Guest Service', lead: 'Moses Tumusiime', category: 'service', memberCount: 6 },
      { id: 't-kfc-mb-3', name: 'Mbarara Express Delivery Fleet', lead: 'Gerald Katushabe', category: 'logistics', memberCount: 5 },
    ],
  },
  {
    id: 'kfc-acacia',
    deptId: 'kfc_ug',
    brandName: 'KFC Uganda',
    name: 'Acacia Mall Branch',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Central Division',
    parish: 'Kamwokya II',
    landmark: 'Acacia Mall Food Court, Level 1',
    accessCode: 'KFC-ACACIA-MGR',
    managerName: 'Brian Mugabe',
    managerPhone: '+256 772 443 112',
    managerEmail: 'brian.m@kfcuganda.com',
    slaHours: 12,
    status: 'active',
    openTicketsCount: 3,
    resolvedTicketsCount: 48,
    ratingScore: 94,
    created_at: '2026-01-10T08:00:00Z',
    teams: [
      { id: 't-kfc-1', name: 'Kitchen & Fryers Crew', lead: 'Sarah Namagembe', category: 'operations', memberCount: 8 },
      { id: 't-kfc-2', name: 'Delivery Fleet & Takeaway', lead: 'Hassan Kasule', category: 'logistics', memberCount: 6 },
      { id: 't-kfc-3', name: 'Front Desk & Guest Care', lead: 'Joan Akello', category: 'service', memberCount: 5 },
    ],
  },
  {
    id: 'kfc-bugolobi',
    deptId: 'kfc_ug',
    brandName: 'KFC Uganda',
    name: 'Village Mall Bugolobi',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Nakawa Division',
    parish: 'Bugolobi',
    landmark: 'Village Mall, Spring Road',
    accessCode: 'KFC-BUGOLOBI-MGR',
    managerName: 'Daphne Kyomugisha',
    managerPhone: '+256 701 556 892',
    managerEmail: 'daphne.k@kfcuganda.com',
    slaHours: 12,
    status: 'active',
    openTicketsCount: 1,
    resolvedTicketsCount: 39,
    ratingScore: 97,
    created_at: '2026-01-15T09:30:00Z',
    teams: [
      { id: 't-kfc-4', name: 'Drive-Thru & Express Lane', lead: 'David Omondi', category: 'logistics', memberCount: 5 },
      { id: 't-kfc-5', name: 'Food Prep & Quality Control', lead: 'Agnes Nabirye', category: 'operations', memberCount: 7 },
    ],
  },
  {
    id: 'kfc-entebbe',
    deptId: 'kfc_ug',
    brandName: 'KFC Uganda',
    name: 'Victoria Mall Entebbe',
    country: 'UG',
    district: 'Wakiso',
    subcounty: 'Entebbe Municipality',
    parish: 'Kitooro Parish',
    landmark: 'Victoria Mall, Kampala Road',
    accessCode: 'KFC-ENTEBBE-MGR',
    managerName: 'Patrick Byaruhanga',
    managerPhone: '+256 782 990 411',
    managerEmail: 'patrick.b@kfcuganda.com',
    slaHours: 12,
    status: 'active',
    openTicketsCount: 2,
    resolvedTicketsCount: 29,
    ratingScore: 92,
    created_at: '2026-02-01T10:00:00Z',
    teams: [
      { id: 't-kfc-6', name: 'Airport Passenger Service Crew', lead: 'Mercy Atuhaire', category: 'service', memberCount: 6 },
      { id: 't-kfc-7', name: 'Cold-Chain & Store Logistics', lead: 'Moses Kibirige', category: 'operations', memberCount: 4 },
    ],
  },
  {
    id: 'kfc-oasis',
    deptId: 'kfc_ug',
    brandName: 'KFC Uganda',
    name: 'Oasis Mall Central',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Central Division',
    parish: 'Nakasero',
    landmark: 'Oasis Mall, Yusuf Lule Road',
    accessCode: 'KFC-OASIS-MGR',
    managerName: 'Gloria Chemutai',
    managerPhone: '+256 754 112 334',
    managerEmail: 'gloria.c@kfcuganda.com',
    slaHours: 12,
    status: 'active',
    openTicketsCount: 0,
    resolvedTicketsCount: 64,
    ratingScore: 96,
    created_at: '2026-01-05T08:00:00Z',
    teams: [
      { id: 't-kfc-8', name: 'Central Rush Crew', lead: 'Kenneth Musoke', category: 'operations', memberCount: 9 },
      { id: 't-kfc-9', name: 'Customer Care & Complaints', lead: 'Brenda Nalubega', category: 'service', memberCount: 4 },
    ],
  },

  // --- MTN Uganda Nationwide Branches ---
  {
    id: 'mtn-jinja',
    deptId: 'mtn_ug',
    brandName: 'MTN Uganda',
    name: 'Jinja Main Service Center',
    country: 'UG',
    district: 'Jinja',
    subcounty: 'Jinja Central',
    parish: 'Jinja Central Parish',
    landmark: 'Main Street, opposite Post Office',
    accessCode: 'MTN-JINJA-MGR',
    managerName: 'Emmanuel Waiswa',
    managerPhone: '+256 776 890 123',
    managerEmail: 'emmanuel.w@mtn.co.ug',
    slaHours: 24,
    status: 'active',
    openTicketsCount: 4,
    resolvedTicketsCount: 112,
    ratingScore: 91,
    created_at: '2026-01-12T07:30:00Z',
    teams: [
      { id: 't-mtn-1', name: 'SIM Swap & KYC Compliance', lead: 'Fatuma Naigaga', category: 'service', memberCount: 5 },
      { id: 't-mtn-2', name: 'Fiber & Mast Field Technicians', lead: 'Godfrey Isabirye', category: 'technical', memberCount: 8 },
      { id: 't-mtn-3', name: 'Mobile Money Audit & Fraud Desk', lead: 'Christine Namuli', category: 'operations', memberCount: 4 },
    ],
  },
  {
    id: 'mtn-lugogo',
    deptId: 'mtn_ug',
    brandName: 'MTN Uganda',
    name: 'Lugogo Forest Mall Center',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Nakawa Division',
    parish: 'Lugogo',
    landmark: 'Forest Mall Lugogo Bypass',
    accessCode: 'MTN-LUGOGO-MGR',
    managerName: 'Fiona Katushabe',
    managerPhone: '+256 772 300 450',
    managerEmail: 'fiona.k@mtn.co.ug',
    slaHours: 24,
    status: 'active',
    openTicketsCount: 2,
    resolvedTicketsCount: 95,
    ratingScore: 95,
    created_at: '2026-01-08T08:00:00Z',
    teams: [
      { id: 't-mtn-4', name: 'Corporate & VIP Desk', lead: 'Allan Ssenyonjo', category: 'service', memberCount: 4 },
      { id: 't-mtn-5', name: 'Broadband Engineers', lead: 'Derrick Mukasa', category: 'technical', memberCount: 6 },
    ],
  },
  {
    id: 'mtn-mbarara',
    deptId: 'mtn_ug',
    brandName: 'MTN Uganda',
    name: 'Mbarara High Street Hub',
    country: 'UG',
    district: 'Mbarara City',
    subcounty: 'Kakoba Division',
    parish: 'Katete',
    landmark: 'High Street, near Stanbic Bank',
    accessCode: 'MTN-MBARARA-MGR',
    managerName: 'Innocent Tumwesigye',
    managerPhone: '+256 779 123 777',
    managerEmail: 'innocent.t@mtn.co.ug',
    slaHours: 24,
    status: 'active',
    openTicketsCount: 3,
    resolvedTicketsCount: 84,
    ratingScore: 89,
    created_at: '2026-01-20T09:00:00Z',
    teams: [
      { id: 't-mtn-6', name: 'Western Region Field Crew', lead: 'Denis Mugisha', category: 'technical', memberCount: 7 },
      { id: 't-mtn-7', name: 'Customer Experience Leads', lead: 'Patience Kemigisha', category: 'service', memberCount: 5 },
    ],
  },

  // --- Aga Khan Hospital Medical Centers ---
  {
    id: 'agakhan-kla',
    deptId: 'agakhan_ug',
    brandName: 'Aga Khan Hospital',
    name: 'Kampala Main Medical Centre',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Central Division',
    parish: 'Nakasero',
    landmark: 'Colonel Senghi Road, Nakasero',
    accessCode: 'AGAKHAN-KLA-MGR',
    managerName: 'Dr. Amina Patel',
    managerPhone: '+256 788 123 456',
    managerEmail: 'amina.patel@akhuganda.org',
    slaHours: 6,
    status: 'active',
    openTicketsCount: 1,
    resolvedTicketsCount: 120,
    ratingScore: 98,
    created_at: '2026-01-01T06:00:00Z',
    teams: [
      { id: 't-akh-1', name: 'Emergency Triage & Paramedics', lead: 'Dr. Ronald Lumu', category: 'operations', memberCount: 10 },
      { id: 't-akh-2', name: 'Pharmacy & Drug Dispensary', lead: 'Pharm. Joy Nakalema', category: 'service', memberCount: 6 },
      { id: 't-akh-3', name: 'Clinical Laboratory & Radiology', lead: 'Robert Tumusiime', category: 'technical', memberCount: 8 },
      { id: 't-akh-4', name: 'Patient Relations & Billing Care', lead: 'Claire Nabunya', category: 'management', memberCount: 5 },
    ],
  },
  {
    id: 'agakhan-bug',
    deptId: 'agakhan_ug',
    brandName: 'Aga Khan Hospital',
    name: 'Bugolobi Family Health Centre',
    country: 'UG',
    district: 'Kampala',
    subcounty: 'Nakawa Division',
    parish: 'Bugolobi',
    landmark: 'Bandali Rise, Bugolobi',
    accessCode: 'AGAKHAN-BUG-MGR',
    managerName: 'Dr. Joseph Ssebunya',
    managerPhone: '+256 702 445 678',
    managerEmail: 'joseph.s@akhuganda.org',
    slaHours: 6,
    status: 'active',
    openTicketsCount: 0,
    resolvedTicketsCount: 78,
    ratingScore: 96,
    created_at: '2026-01-14T08:30:00Z',
    teams: [
      { id: 't-akh-5', name: 'Outpatient & Pediatrics Unit', lead: 'Dr. Harriet Namutebi', category: 'operations', memberCount: 7 },
      { id: 't-akh-6', name: 'Rapid Diagnostic Laboratory', lead: 'Samson Kiggundu', category: 'technical', memberCount: 4 },
    ],
  },

  // --- Gayaza High School Network ---
  {
    id: 'gayaza-main',
    deptId: 'gayaza_high',
    brandName: 'Gayaza High School',
    name: 'Main Campus Kasangati',
    country: 'UG',
    district: 'Wakiso',
    subcounty: 'Nansana Municipality',
    parish: 'Busukuma Parish',
    landmark: 'Gayaza Road, Kasangati Zone',
    accessCode: 'GAYAZA-MAIN-MGR',
    managerName: 'Mrs. Robinah Kizito Katongole',
    managerPhone: '+256 772 500 889',
    managerEmail: 'headteacher@gayazahs.sc.ug',
    slaHours: 24,
    status: 'active',
    openTicketsCount: 2,
    resolvedTicketsCount: 52,
    ratingScore: 96,
    created_at: '2026-01-01T07:00:00Z',
    teams: [
      { id: 't-ghs-1', name: 'Scholastic Welfare & Counseling', lead: 'Ms. Proscovia Nanteza', category: 'service', memberCount: 6 },
      { id: 't-ghs-2', name: 'Health Sanatorium & Nursing', lead: 'Sr. Beatrice Nalwoga', category: 'operations', memberCount: 4 },
      { id: 't-ghs-3', name: 'Estates, Water & Sanitation', lead: 'Eng. Isaac Balikuddembe', category: 'technical', memberCount: 8 },
      { id: 't-ghs-4', name: 'Parent-Teacher Communication Desk', lead: 'Mr. David Mukalazi', category: 'management', memberCount: 5 },
    ],
  },
];

const STORAGE_KEY = 'civicduty_enterprise_branches_v2';

export function loadAllBranches(): EnterpriseBranch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTERPRISE_BRANCHES));
      return SEED_ENTERPRISE_BRANCHES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_ENTERPRISE_BRANCHES));
      return SEED_ENTERPRISE_BRANCHES;
    }
    // Always merge in any seed branches not present in stored data
    const existingIds = new Set(parsed.map((b: any) => b.id));
    const missingSeeds = SEED_ENTERPRISE_BRANCHES.filter((sb) => !existingIds.has(sb.id));
    if (missingSeeds.length > 0) {
      const merged = [...parsed, ...missingSeeds];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading enterprise branches from storage:', err);
    return SEED_ENTERPRISE_BRANCHES;
  }
}

export function saveAllBranches(branches: EnterpriseBranch[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(branches));
  } catch (err) {
    console.error('Error saving enterprise branches to storage:', err);
  }
}

export function getBranchesForDept(deptId: string): EnterpriseBranch[] {
  const branches = loadAllBranches();
  const normalizedDept = deptId.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return branches.filter((b) => {
    const bDept = b.deptId.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return bDept === normalizedDept || b.deptId === deptId || bDept.includes(normalizedDept) || normalizedDept.includes(bDept);
  });
}

export function findBranchByCode(rawCode: string): EnterpriseBranch | null {
  const clean = rawCode.trim().toUpperCase();
  const branches = loadAllBranches();
  return branches.find((b) => b.accessCode.trim().toUpperCase() === clean) || null;
}

export function generateBranchAccessCode(brandName: string, branchName: string): string {
  const brandSlug = brandName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase() || 'ENT';
  const branchSlug = branchName.replace(/[^a-zA-Z]/g, '').slice(0, 6).toUpperCase() || 'BRANCH';
  return `${brandSlug}-${branchSlug}-MGR`;
}
