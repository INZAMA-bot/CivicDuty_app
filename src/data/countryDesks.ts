import { CountryCode, GovCodeData } from '../types';
import { COUNTRIES, DEPARTMENTS } from './countries';
import { GOV_CODES } from './tiers';

export interface EscalationTierItem {
  rank: number;
  title: string;
  subtitle: string;
  badge: string;
  sampleCode: string;
  roleLabel: string;
  bg: string;
}

export interface AccountingDeskPreset {
  code: string;
  badge: string;
  title: string;
  deptName: string;
  role: string;
  borderColor?: string;
  textColor?: string;
}

export interface VerifiedProviderPreset {
  code: string;
  orgName: string;
  category: string;
  categoryLabel: string;
  officerName?: string;
  roleLabel: string;
  country: CountryCode;
  flag: string;
  slaHours: number;
  qualityAudit?: string;
}

export interface CountryDesksProfile {
  countryCode: CountryCode;
  countryName: string;
  flag: string;
  currency: string;
  statutoryFramework: string;
  statutoryNote: string;
  primaryUnitName: string;
  escalationLadder: EscalationTierItem[];
  accountingDesks: AccountingDeskPreset[];
  verifiedProviders: VerifiedProviderPreset[];
  samplePlaceholder: string;
  marketDynamicsNote: string;
  regulatorsList: string[];
}

// Concrete bespoke profiles for major countries
const BESPOKE_PROFILES: Record<string, CountryDesksProfile> = {
  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    flag: 'UG',
    currency: 'UGX',
    statutoryFramework: 'Public Finance Management Act (PFMA 2015) & Local Government Act (Cap 243)',
    statutoryNote: 'Under the Public Finance Management Act (PFMA) and Local Government Act, only designated statutory accounting officers may claim or operate official desks.',
    primaryUnitName: 'Parishes (10,595 Parish Chiefs & Town Agents)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Grassroots Liaison',
        subtitle: 'Parish Chiefs / Town Agents',
        badge: 'Lowest Officer',
        sampleCode: 'UG-PARISH-NAKASERO',
        roleLabel: 'Parish Chief (Nakasero)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: LLG Officer',
        subtitle: 'Sub-County SAS / Town Clerks',
        badge: 'Sub-County / Div',
        sampleCode: 'UG-SAS-KAMPALA-CENTRAL',
        roleLabel: 'SAS Central Division',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: HLG Accounting Officer',
        subtitle: 'District CAOs & City Clerks',
        badge: 'District / City CAO',
        sampleCode: 'UG-CAO-WAKISO',
        roleLabel: 'CAO Wakiso District',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Statutory Agency',
        subtitle: 'MDs & Executive Directors',
        badge: 'NWSC / UNRA / URA',
        sampleCode: 'UG-NWSC-ADMIN',
        roleLabel: 'MD NWSC',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Line Ministry / PS',
        subtitle: 'Permanent Secretaries (PS/ST)',
        badge: 'Apex Escalation',
        sampleCode: 'PS-MOLG-2026',
        roleLabel: 'PS MoLG (National)',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'PS-MOLG-2026', badge: 'SUPERADMIN', title: 'PS Local Gov (Rollout Desk)', deptName: 'MoLG', role: 'Local Government Rollout Head (Superadmin)', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'PS-FINANCE-2026', badge: 'PS/ST', title: 'PS Finance (Secretary to Treasury)', deptName: 'MoFPED', role: 'Apex Treasury Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'PS-WORKS-2026', badge: 'PS WORKS', title: 'PS Works & Transport', deptName: 'MoWT', role: 'Infrastructure Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'PS-HEALTH-2026', badge: 'PS HEALTH', title: 'PS Ministry of Health', deptName: 'MoH', role: 'Health Sector Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'PS-WATER-2026', badge: 'PS WATER', title: 'PS Water & Environment', deptName: 'MoWE', role: 'Water & Natural Resources Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'PS-ICT-2026', badge: 'PS ICT', title: 'PS ICT & National Guidance', deptName: 'MoICT', role: 'Digital Economy Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'PS-OPM-2026', badge: 'PS OPM', title: 'PS Office of the Prime Minister', deptName: 'OPM', role: 'Cabinet Delivery Coordinator', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'UG-CAO-WAKISO', badge: 'CAO', title: 'Chief Administrative Officer (Wakiso)', deptName: 'Wakiso District', role: 'HLG Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'UG-SAS-KAMPALA-CENTRAL', badge: 'SAS', title: 'Senior Assistant Sec (Central Div)', deptName: 'KCCA Central', role: 'LLG Accounting Liaison', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'UG-PARISH-NAKASERO', badge: 'PARISH', title: 'Parish Chief / Town Agent (Lowest)', deptName: 'Nakasero Parish', role: 'Grassroots Liaison Desk', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-GAYAZA-01', orgName: 'Gayaza High School', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Robinah Kizito', roleLabel: 'Head Teacher Desk', country: 'UG', flag: 'UG', slaHours: 48, qualityAudit: 'MoES Registered P.012' },
      { code: 'SCH-MAKERERE-01', orgName: 'Makerere University (Main Campus)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Prof. Barnabas Nawangwe', roleLabel: 'Vice Chancellor Desk', country: 'UG', flag: 'UG', slaHours: 48, qualityAudit: 'NCHE Accredited' },
      { code: 'HOSP-MULAGO-01', orgName: 'Mulago National Referral Hospital', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. Rosemary Byanyima', roleLabel: 'Executive Director Desk', country: 'UG', flag: 'UG', slaHours: 24, qualityAudit: 'MoH Tertiary Hospital Level' },
      { code: 'HOSP-NAKASERO-01', orgName: 'Nakasero Hospital Ltd', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. Joseph Ssenkungu', roleLabel: 'Medical Director Desk', country: 'UG', flag: 'UG', slaHours: 24, qualityAudit: 'Uganda Medical Council Certified' },
      { code: 'RES-JAVA-KLA', orgName: 'Café Javas (Mandela Group)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Faruq Mandela', roleLabel: 'Head of Customer Relations', country: 'UG', flag: 'UG', slaHours: 24, qualityAudit: 'UNBS Food Safety Grade A' },
      { code: 'RES-SERENA-KLA', orgName: 'Kampala Serena Hotel', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Anthony Chege', roleLabel: 'General Manager Desk', country: 'UG', flag: 'UG', slaHours: 24, qualityAudit: 'UTB 5-Star Hotel Certified' },
      { code: 'BNK-STANBIC-01', orgName: 'Stanbic Bank Uganda Ltd', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Anne Juuko', roleLabel: 'Managing Director & Customer Care', country: 'UG', flag: 'UG', slaHours: 48, qualityAudit: 'Bank of Uganda Licensed 001' },
      { code: 'BNK-CENTENARY-01', orgName: 'Centenary Rural Development Bank', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Fabian Kasi', roleLabel: 'Managing Director Desk', country: 'UG', flag: 'UG', slaHours: 48, qualityAudit: 'Bank of Uganda Licensed 004' },
      { code: 'TRN-KOTSA-01', orgName: 'Kampala Operational Taxi Stages (KOTSA)', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Mustafa Mayambala', roleLabel: 'SACCO Chairman Desk', country: 'UG', flag: 'UG', slaHours: 24, qualityAudit: 'KCCA Gazetted Stage Operator' },
      { code: 'TRN-SAFEBODA-01', orgName: 'SafeBoda Transporters Desk', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Ricky Rapa Thomson', roleLabel: 'Co-Founder & Safety Director', country: 'UG', flag: 'UG', slaHours: 24, qualityAudit: 'Driver Safety Academy Certified' },
      { code: 'TEL-MTN-UG', orgName: 'MTN Uganda Limited', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Sylvia Mulinge', roleLabel: 'CEO & Customer Care Desk', country: 'UG', flag: 'UG', slaHours: 48, qualityAudit: 'UCC Licensed National Operator' },
      { code: 'UG-UMEME-1104', orgName: 'Umeme Ltd (Power Grid & Metering)', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Selestino Babungi', roleLabel: 'Managing Director Desk', country: 'UG', flag: 'UG', slaHours: 24, qualityAudit: 'ERA Regulated Utility #01' },
      { code: 'CTR-ROKO-01', orgName: 'Roko Construction Ltd', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Mark Koehler', roleLabel: 'Managing Director Desk', country: 'UG', flag: 'UG', slaHours: 48, qualityAudit: 'UNABCEC Class A1 Contractor' },
      { code: 'NGO-TRANSPARENCY-UG', orgName: 'Transparency International Uganda', category: 'ngo_civil_society', categoryLabel: 'NGOs & Civil Society', officerName: 'Peter Wandera', roleLabel: 'Executive Director Desk', country: 'UG', flag: 'UG', slaHours: 48, qualityAudit: 'National NGO Bureau Registered' },
    ],
    samplePlaceholder: 'e.g. UG-CAO-WAKISO, SCH-GAYAZA-01, HOSP-MULAGO-01, TEL-MTN-UG...',
    marketDynamicsNote: 'In Uganda\'s competitive private marketplace, citizens choose between competing schools, hospitals, and clinics. A delayed response drives clients straight to rival institutions.',
    regulatorsList: ['UNBS (Standards)', 'NDA (Drug Authority)', 'MoES (Education)', 'MoH (Health)', 'UCC (Communications)', 'ERA (Electricity)'],
  },

  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    flag: 'KE',
    currency: 'KES',
    statutoryFramework: 'County Governments Act (2012) & Public Finance Management Act (PFM 2012)',
    statutoryNote: 'Under Kenya\'s County Governments Act and Public Finance Management Act, official desks are reserved for authorized County Accounting Officers, Chief Officers, and statutory executives.',
    primaryUnitName: 'Wards (1,450 Ward Administrators across 47 Counties)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Grassroots Ward Liaison',
        subtitle: 'Ward Administrators & Desk Officers',
        badge: 'Ward Desk',
        sampleCode: 'KE-WARD-KILIMANI',
        roleLabel: 'Ward Administrator (Kilimani)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: Sub-County Desk',
        subtitle: 'Sub-County Administrators & Officers',
        badge: 'Sub-County Admin',
        sampleCode: 'KE-SC-WESTLANDS',
        roleLabel: 'Sub-County Admin (Westlands)',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: County Executive (CECM)',
        subtitle: 'County Executive Committee Members & Chief Officers',
        badge: 'County Accounting Officer',
        sampleCode: 'KE-CECM-NAIROBI',
        roleLabel: 'CECM Finance / Transport (Nairobi)',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Statutory Parastatal',
        subtitle: 'KPLC / Nairobi Water / KeNHA / KRA',
        badge: 'Parastatal MD',
        sampleCode: 'KE-KPLC-ADMIN',
        roleLabel: 'Managing Director, Kenya Power (KPLC)',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: National Ministry / PS',
        subtitle: 'Principal Secretaries (Devolution & Treasury)',
        badge: 'Apex Escalation',
        sampleCode: 'PS-DEV-KE-2026',
        roleLabel: 'PS State Dept for Devolution',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'PS-DEV-KE-2026', badge: 'PS DEVOLUTION', title: 'PS State Dept for Devolution', deptName: 'Ministry of Devolution', role: 'National Devolution Head', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'KE-PS-TREASURY', badge: 'PS TREASURY', title: 'Principal Secretary (National Treasury)', deptName: 'The National Treasury', role: 'Apex Public Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'KE-CECM-NAIROBI', badge: 'CECM', title: 'CECM Finance & Economic Planning', deptName: 'Nairobi City County', role: 'County Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'KE-SC-WESTLANDS', badge: 'SUB-COUNTY', title: 'Sub-County Administrator (Westlands)', deptName: 'Westlands Sub-County', role: 'LLG Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'KE-KPLC-ADMIN', badge: 'KPLC MD', title: 'Managing Director (Kenya Power)', deptName: 'Kenya Power (KPLC)', role: 'National Utility Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'KE-WARD-KILIMANI', badge: 'WARD ADMIN', title: 'Ward Administrator (Kilimani Ward)', deptName: 'Kilimani Ward', role: 'Grassroots Ward Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-ALLIANCE-01', orgName: 'Alliance High School', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'David K. Maina', roleLabel: 'Principal Desk', country: 'KE', flag: 'KE', slaHours: 48, qualityAudit: 'Ministry of Education Reg' },
      { code: 'SCH-UON-01', orgName: 'University of Nairobi (Main Campus)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Prof. Stephen Kiama', roleLabel: 'Vice Chancellor Desk', country: 'KE', flag: 'KE', slaHours: 48, qualityAudit: 'CUE Accredited' },
      { code: 'HOSP-AGAKHAN-01', orgName: 'Aga Khan University Hospital Nairobi', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Rashid Khalani', roleLabel: 'CEO & Clinical Director', country: 'KE', flag: 'KE', slaHours: 24, qualityAudit: 'JCIA Accredited Hospital' },
      { code: 'HOSP-NAIROBI-01', orgName: 'The Nairobi Hospital', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'James Nyamongo', roleLabel: 'CEO Desk', country: 'KE', flag: 'KE', slaHours: 24, qualityAudit: 'KMPDC Licensed' },
      { code: 'RES-JAVA-NBO', orgName: 'Java House Kenya (Nairobi HQ)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Priscilla Gathoni', roleLabel: 'Quality Assurance Lead', country: 'KE', flag: 'KE', slaHours: 24, qualityAudit: 'KEBS Food Safety Standard' },
      { code: 'RES-CARNIVORE-01', orgName: 'The Carnivore Restaurant Nairobi', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Martin Dunford', roleLabel: 'Tamarind Group Director', country: 'KE', flag: 'KE', slaHours: 24, qualityAudit: 'Tourism Regulatory Authority Grade 1' },
      { code: 'BNK-EQUITY-01', orgName: 'Equity Bank Kenya Ltd', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Dr. James Mwangi', roleLabel: 'Group CEO Desk', country: 'KE', flag: 'KE', slaHours: 48, qualityAudit: 'Central Bank of Kenya Reg' },
      { code: 'BNK-KCB-01', orgName: 'KCB Bank Kenya PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Paul Russo', roleLabel: 'Managing Director Desk', country: 'KE', flag: 'KE', slaHours: 48, qualityAudit: 'CBK Licensed Commercial Bank' },
      { code: 'TRN-MATATU-MOA', orgName: 'Matatu Owners Association (MOA)', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Albert Karakacha', roleLabel: 'National Chairman Desk', country: 'KE', flag: 'KE', slaHours: 24, qualityAudit: 'NTSA Registered Transit Council' },
      { code: 'TRN-SUPERMETRO-01', orgName: 'Super Metro Transport SACCO', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Nelson Mwangi', roleLabel: 'Managing Director Desk', country: 'KE', flag: 'KE', slaHours: 24, qualityAudit: 'NTSA Exemplary Commuter SACCO' },
      { code: 'TEL-SAFARICOM-01', orgName: 'Safaricom PLC (M-Pesa & 5G)', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Peter Ndegwa', roleLabel: 'CEO Customer Experience', country: 'KE', flag: 'KE', slaHours: 48, qualityAudit: 'Communications Authority Licensed' },
      { code: 'CTR-EPCO-01', orgName: 'Epco Builders Ltd', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Ramji Varsani', roleLabel: 'Managing Director Desk', country: 'KE', flag: 'KE', slaHours: 48, qualityAudit: 'NCA 1 Civil Engineering' },
      { code: 'NGO-TRANSPARENCY-KE', orgName: 'Transparency International Kenya', category: 'ngo_civil_society', categoryLabel: 'NGOs & Civil Society', officerName: 'Sheila Masinde', roleLabel: 'Executive Director Desk', country: 'KE', flag: 'KE', slaHours: 48, qualityAudit: 'NGO Coordination Board Reg' },
    ],
    samplePlaceholder: 'e.g. KE-CECM-NAIROBI, SCH-ALLIANCE-01, HOSP-AGAKHAN-01, TEL-SAFARICOM-01...',
    marketDynamicsNote: 'In Kenya\'s vibrant consumer ecosystem, customer churn is immediate. If a matatu SACCO, bank branch, or hospital fails to attend to grievances, citizens take their business to peers.',
    regulatorsList: ['KEBS (Bureau of Standards)', 'KMPDC (Medical Council)', 'NTSA (Transport Authority)', 'CA (Communications Authority)', 'CBK (Central Bank)'],
  },

  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    flag: 'NG',
    currency: 'NGN',
    statutoryFramework: '1999 Constitution (as amended) & Fiscal Responsibility Act (2007)',
    statutoryNote: 'Official accounting officer desks are gazetted for Federal Ministries, State Commissioners, and LGA Chairmen in accordance with Nigerian fiscal regulations.',
    primaryUnitName: 'Wards (8,812 Wards across 774 Local Government Areas)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Grassroots Ward Liaison',
        subtitle: 'Ward Councillors & Community Officers',
        badge: 'Ward Desk',
        sampleCode: 'NG-WARD-IKEJA-01',
        roleLabel: 'Ward Desk Officer (Ikeja Ward 1)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: Local Government (LGA)',
        subtitle: 'LGA Chairmen & Council Secretaries',
        badge: 'LGA Accounting Officer',
        sampleCode: 'NG-LGA-IKEJA',
        roleLabel: 'Executive Chairman, Ikeja LGA',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: State Government',
        subtitle: 'State Commissioners & Permanent Secretaries',
        badge: 'State Executive',
        sampleCode: 'NG-STATE-LAGOS',
        roleLabel: 'Perm Sec Lagos State Local Govt',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Federal / State Agency',
        subtitle: 'DisCos / LAWMA / NAFDAC / FIRS',
        badge: 'Statutory Authority',
        sampleCode: 'NG-DISCO-EKEDC',
        roleLabel: 'MD, Eko Electricity Distribution Co',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Federal Ministry / Perm Sec',
        subtitle: 'Federal Permanent Secretaries (Finance / Works)',
        badge: 'Apex Escalation',
        sampleCode: 'PS-FED-NG-2026',
        roleLabel: 'Perm Sec Federal Ministry of Finance',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'PS-FED-NG-2026', badge: 'FED PERM SEC', title: 'Perm Sec Federal Ministry of Finance', deptName: 'Federal Min of Finance', role: 'Apex Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'NG-PS-WORKS', badge: 'PS WORKS', title: 'Perm Sec Federal Ministry of Works', deptName: 'Federal Min of Works', role: 'Highways & Infrastructure Head', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'NG-STATE-LAGOS', badge: 'STATE PERM SEC', title: 'Perm Sec Local Govt & Chieftaincy (Lagos)', deptName: 'Lagos State Gov', role: 'State Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'NG-LGA-IKEJA', badge: 'LGA CHAIRMAN', title: 'Executive Chairman (Ikeja LGA)', deptName: 'Ikeja Local Government', role: 'Local Government Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'NG-DISCO-EKEDC', badge: 'DISCO MD', title: 'Managing Director (Eko DisCo)', deptName: 'Eko Electricity Distribution', role: 'Utility Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'NG-WARD-IKEJA-01', badge: 'WARD LIAISON', title: 'Ward Administrative Officer (Ikeja Ward 1)', deptName: 'Ikeja Ward 1', role: 'Grassroots Accounting Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-KINGS-01', orgName: 'King\'s College Lagos', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Ali Andrew', roleLabel: 'Principal Desk', country: 'NG', flag: 'NG', slaHours: 48, qualityAudit: 'Federal Ministry of Education' },
      { code: 'SCH-UNILAG-01', orgName: 'University of Lagos (Akoka)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Prof. Folasade Ogunsola', roleLabel: 'Vice Chancellor Desk', country: 'NG', flag: 'NG', slaHours: 48, qualityAudit: 'NUC Accredited' },
      { code: 'HOSP-LUTH-01', orgName: 'Lagos University Teaching Hospital (LUTH)', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Prof. Wasiu Adeyemo', roleLabel: 'Chief Medical Director Desk', country: 'NG', flag: 'NG', slaHours: 24, qualityAudit: 'Federal Teaching Hospital Tier' },
      { code: 'HOSP-REDDINGTON-01', orgName: 'Reddington Multi-Specialist Hospital', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. Adeyemi Onabowale', roleLabel: 'Medical Director Desk', country: 'NG', flag: 'NG', slaHours: 24, qualityAudit: 'COHSASA Accredited' },
      { code: 'RES-TERRA-01', orgName: 'Terra Kulture Arts & Dining', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Bolanle Austen-Peters', roleLabel: 'Executive Director Desk', country: 'NG', flag: 'NG', slaHours: 24, qualityAudit: 'Lagos Safety Commission Certified' },
      { code: 'RES-MEGA-01', orgName: 'Mega Chicken Restaurants (Lekki / Ikeja)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Peter Adenuga', roleLabel: 'Quality Control Lead', country: 'NG', flag: 'NG', slaHours: 24, qualityAudit: 'NAFDAC Food Safety Passed' },
      { code: 'BNK-ACCESS-01', orgName: 'Access Bank PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Roosevelt Ogbonna', roleLabel: 'Managing Director Desk', country: 'NG', flag: 'NG', slaHours: 48, qualityAudit: 'CBN Regulated Commercial Bank' },
      { code: 'BNK-GTB-01', orgName: 'Guaranty Trust Bank (GTBank)', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Miriam Olusanya', roleLabel: 'Managing Director Desk', country: 'NG', flag: 'NG', slaHours: 48, qualityAudit: 'CBN Regulated Commercial Bank' },
      { code: 'TRN-NURTW-01', orgName: 'NURTW Public Transit Cooperative (Lagos)', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Musiliu Akinsanya', roleLabel: 'Union State Secretary Desk', country: 'NG', flag: 'NG', slaHours: 24, qualityAudit: 'Lagos State Ministry of Transport' },
      { code: 'TEL-MTN-NG', orgName: 'MTN Nigeria Communications PLC', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Karl Toriola', roleLabel: 'CEO Desk', country: 'NG', flag: 'NG', slaHours: 48, qualityAudit: 'NCC Licensed Unified Operator' },
      { code: 'CTR-JULIUS-01', orgName: 'Julius Berger Nigeria PLC', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Lars Richter', roleLabel: 'Managing Director Desk', country: 'NG', flag: 'NG', slaHours: 48, qualityAudit: 'COREN Certified Civil Contractor' },
      { code: 'NGO-SERAP-01', orgName: 'SERAP (Socio-Economic Rights & Accountability)', category: 'ngo_civil_society', categoryLabel: 'NGOs & Civil Society', officerName: 'Kolawole Oluwadare', roleLabel: 'Deputy Director Desk', country: 'NG', flag: 'NG', slaHours: 48, qualityAudit: 'CAC Incorporated Trustee' },
    ],
    samplePlaceholder: 'e.g. NG-LGA-IKEJA, SCH-KINGS-01, HOSP-LUTH-01, TEL-MTN-NG...',
    marketDynamicsNote: 'With over 200 million consumers, poor customer service triggers severe customer defection. Brands that proactively engage on live SLAs capture sustained market loyalty.',
    regulatorsList: ['NAFDAC (Food & Drugs)', 'SON (Standards Organisation)', 'NCC (Communications)', 'CBN (Central Bank)', 'FCCPC (Consumer Protection)'],
  },

  GH: {
    countryCode: 'GH',
    countryName: 'Ghana',
    flag: 'GH',
    currency: 'GHS',
    statutoryFramework: 'Local Governance Act (Act 936) & Public Financial Management Act (Act 921)',
    statutoryNote: 'Under Act 936, statutory desks are restricted to Regional Co-ordinating Directors, MMDCEs, and designated Assembly Heads.',
    primaryUnitName: 'Unit Committees (Assemblies across 16 Regions & 261 MMDAs)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Unit Committee Liaison',
        subtitle: 'Unit Committee Chairs & Assembly Members',
        badge: 'Unit Committee',
        sampleCode: 'GH-COMM-AIRPORT',
        roleLabel: 'Assembly Member (Airport Res.)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: Municipal / District (MMDA)',
        subtitle: 'Chief Executives (MCE/DCE) & Co-ordinating Directors',
        badge: 'Assembly MCD',
        sampleCode: 'GH-DCE-AYAWASO',
        roleLabel: 'MCE Ayawaso West Municipal',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: Regional Co-ordinating Council',
        subtitle: 'Regional Ministers & Co-ordinating Directors',
        badge: 'RCC Authority',
        sampleCode: 'GH-RCC-GREATER-ACCRA',
        roleLabel: 'RCD Greater Accra Region',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Statutory Corporation',
        subtitle: 'ECG / Ghana Water / GRA / Highways',
        badge: 'Parastatal MD',
        sampleCode: 'GH-ECG-ADMIN',
        roleLabel: 'MD Electricity Co of Ghana (ECG)',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Line Ministry / Chief Director',
        subtitle: 'Chief Directors & Sector Ministers',
        badge: 'Apex Escalation',
        sampleCode: 'CD-MLGRD-GH-2026',
        roleLabel: 'Chief Director, Min. Local Government',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'CD-MLGRD-GH-2026', badge: 'CHIEF DIRECTOR', title: 'Chief Director (Min. of Local Govt)', deptName: 'MLGRD Ghana', role: 'Apex Local Governance Head', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'GH-RCC-GREATER-ACCRA', badge: 'RCD ACCRA', title: 'Regional Co-ordinating Director (Greater Accra)', deptName: 'Greater Accra RCC', role: 'Regional Accounting Authority', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'GH-DCE-AYAWASO', badge: 'MCE AYAWASO', title: 'Municipal Chief Executive (Ayawaso West)', deptName: 'Ayawaso West Assembly', role: 'MMDA Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'GH-ECG-ADMIN', badge: 'ECG MD', title: 'Managing Director (Electricity Co of Ghana)', deptName: 'Electricity Co of Ghana', role: 'Utility Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'GH-GWCL-ADMIN', badge: 'GWCL MD', title: 'Managing Director (Ghana Water Co Ltd)', deptName: 'Ghana Water Co Ltd', role: 'Water Utility Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'GH-COMM-AIRPORT', badge: 'ASSEMBLY MBR', title: 'Assembly Member (Airport Residential)', deptName: 'Airport Unit Committee', role: 'Grassroots Community Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-ACHIMOTA-01', orgName: 'Achimota School', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Marjorie Affenyi', roleLabel: 'Headmistress Desk', country: 'GH', flag: 'GH', slaHours: 48, qualityAudit: 'GES Accredited Senior High' },
      { code: 'SCH-UGLEGON-01', orgName: 'University of Ghana (Legon)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Prof. Nana Aba Appiah Amfo', roleLabel: 'Vice Chancellor Desk', country: 'GH', flag: 'GH', slaHours: 48, qualityAudit: 'GTEC Accredited' },
      { code: 'HOSP-KORLEBU-01', orgName: 'Korle Bu Teaching Hospital (KBTH)', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. Opoku Ware Ampomah', roleLabel: 'Chief Executive Officer Desk', country: 'GH', flag: 'GH', slaHours: 24, qualityAudit: 'MDC Ghana Tertiary Level' },
      { code: 'HOSP-NYAHO-01', orgName: 'Nyaho Medical Centre (Airport)', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. Elikem Tamaklo', roleLabel: 'Managing Director Desk', country: 'GH', flag: 'GH', slaHours: 24, qualityAudit: 'HeFRA Licensed Class A' },
      { code: 'RES-BUKA-01', orgName: 'Buka Restaurant (Osu, Accra)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Audrey Quaye', roleLabel: 'General Manager Desk', country: 'GH', flag: 'GH', slaHours: 24, qualityAudit: 'FDA Ghana Certified Food Hygiene' },
      { code: 'RES-PAPAYE-01', orgName: 'Papaye Fast Foods Ltd', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Samir Kalmoni', roleLabel: 'Operations Director Desk', country: 'GH', flag: 'GH', slaHours: 24, qualityAudit: 'FDA Ghana Gold Standard' },
      { code: 'BNK-GCB-01', orgName: 'GCB Bank PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Kofi Adomakoh', roleLabel: 'Managing Director Desk', country: 'GH', flag: 'GH', slaHours: 48, qualityAudit: 'Bank of Ghana Licensed' },
      { code: 'BNK-ECOBANK-GH', orgName: 'Ecobank Ghana PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Dan Sackey', roleLabel: 'Managing Director Desk', country: 'GH', flag: 'GH', slaHours: 48, qualityAudit: 'Bank of Ghana Commercial Tier' },
      { code: 'TRN-GPRTU-01', orgName: 'Ghana Private Road Transport Union (GPRTU)', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Godfred Abulbire', roleLabel: 'General Secretary Desk', country: 'GH', flag: 'GH', slaHours: 24, qualityAudit: 'Registered Transport Union' },
      { code: 'TEL-MTN-GH', orgName: 'MTN Ghana Limited', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Stephen Blewett', roleLabel: 'CEO Desk', country: 'GH', flag: 'GH', slaHours: 48, qualityAudit: 'NCA Ghana Licensed' },
      { code: 'CTR-CONSAR-01', orgName: 'Consar Ltd (Civil Contractors)', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Stefano Consar', roleLabel: 'Managing Director Desk', country: 'GH', flag: 'GH', slaHours: 48, qualityAudit: 'Ministry of Works & Housing D1K1' },
      { code: 'NGO-CDD-GH', orgName: 'Ghana Center for Democratic Development', category: 'ngo_civil_society', categoryLabel: 'NGOs & Civil Society', officerName: 'Prof. H. Kwasi Prempeh', roleLabel: 'Executive Director Desk', country: 'GH', flag: 'GH', slaHours: 48, qualityAudit: 'Registered Civil Society Body' },
    ],
    samplePlaceholder: 'e.g. GH-DCE-AYAWASO, SCH-ACHIMOTA-01, HOSP-KORLEBU-01, TEL-MTN-GH...',
    marketDynamicsNote: 'Ghanaian consumers hold institutions to high standards. Failure to resolve complaints promptly triggers client migration to more attentive competitors in Accra, Kumasi and nationwide.',
    regulatorsList: ['FDA (Food and Drugs)', 'GSA (Standards Authority)', 'NCA (Communications)', 'HeFRA (Health Facilities)', 'Bank of Ghana'],
  },

  RW: {
    countryCode: 'RW',
    countryName: 'Rwanda',
    flag: 'RW',
    currency: 'RWF',
    statutoryFramework: 'Law on Decentralization & Organic Law on State Finance and Property',
    statutoryNote: 'Official accounting desks in Rwanda reflect the decentralized governance framework from Akagari (Cell) to Central Ministries (MINALOC/MINECOFIN).',
    primaryUnitName: 'Utugari (2,148 Cells across 416 Sectors and 30 Districts)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Akagari Desk (Cell)',
        subtitle: 'Cell Executive Secretaries (Umunyamabanga w\'Akagari)',
        badge: 'Akagari Desk',
        sampleCode: 'RW-CELL-KIMIHURURA',
        roleLabel: 'Cell Exec Sec (Kimihurura)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: Umurenge Desk (Sector)',
        subtitle: 'Sector Executive Secretaries (Umunyamabanga w\'Umurenge)',
        badge: 'Umurenge Admin',
        sampleCode: 'RW-SECTOR-GASABO',
        roleLabel: 'Sector Exec Sec (Remera)',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: Akarere Mayor (District)',
        subtitle: 'District Mayors & Corporate Executives (Umuyobozi w\'Akarere)',
        badge: 'Akarere Authority',
        sampleCode: 'RW-DISTRICT-GASABO',
        roleLabel: 'District Mayor (Gasabo)',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Statutory Agency',
        subtitle: 'Rwanda Energy Group (REG) / WASAC / RRA / RURA',
        badge: 'Statutory CEO',
        sampleCode: 'RW-REG-ADMIN',
        roleLabel: 'CEO Rwanda Energy Group (REG)',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Line Ministry / PS',
        subtitle: 'Permanent Secretaries (MINALOC / MINECOFIN)',
        badge: 'Apex Escalation',
        sampleCode: 'PS-MINALOC-RW-2026',
        roleLabel: 'Permanent Secretary MINALOC',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'PS-MINALOC-RW-2026', badge: 'PS MINALOC', title: 'Permanent Secretary (MINALOC)', deptName: 'MINALOC Rwanda', role: 'Apex Decentralization Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'RW-PS-MINECOFIN', badge: 'PS MINECOFIN', title: 'Permanent Secretary / Sec. to Treasury', deptName: 'MINECOFIN Rwanda', role: 'National Public Finance Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'RW-DISTRICT-GASABO', badge: 'DISTRICT MAYOR', title: 'Mayor / Chief Executive (Gasabo District)', deptName: 'Gasabo District', role: 'District Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'RW-SECTOR-GASABO', badge: 'SECTOR EXEC', title: 'Sector Executive Secretary (Remera Sector)', deptName: 'Remera Sector', role: 'Sector Accounting Liaison', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'RW-REG-ADMIN', badge: 'REG CEO', title: 'Chief Executive Officer (Rwanda Energy Group)', deptName: 'Rwanda Energy Group', role: 'National Energy Utility Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'RW-CELL-KIMIHURURA', badge: 'CELL EXEC', title: 'Cell Executive Secretary (Kimihurura Cell)', deptName: 'Kimihurura Cell', role: 'Grassroots Cell Accounting Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-GREENHILLS-01', orgName: 'Green Hills Academy Kigali', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Daniel Harmsworth', roleLabel: 'Head of School Desk', country: 'RW', flag: 'RW', slaHours: 48, qualityAudit: 'REB Accredited International' },
      { code: 'SCH-UR-01', orgName: 'University of Rwanda (Gikondo / Huye)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Dr. Didas Kayihura Muganga', roleLabel: 'Vice Chancellor Desk', country: 'RW', flag: 'RW', slaHours: 48, qualityAudit: 'HEC Rwanda Accredited' },
      { code: 'HOSP-FAISAL-01', orgName: 'King Faisal Hospital Rwanda', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. Zerihun Abebe', roleLabel: 'CEO & Medical Director', country: 'RW', flag: 'RW', slaHours: 24, qualityAudit: 'COHSASA Accredited Hospital' },
      { code: 'HOSP-CHUK-01', orgName: 'University Teaching Hospital of Kigali (CHUK)', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. Theobald Hategekimana', roleLabel: 'Director General Desk', country: 'RW', flag: 'RW', slaHours: 24, qualityAudit: 'MoH Tertiary Teaching Level' },
      { code: 'RES-BOURBON-01', orgName: 'Bourbon Coffee Rwanda (Kigali Heights)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Innocent Gasasira', roleLabel: 'Operations Manager Desk', country: 'RW', flag: 'RW', slaHours: 24, qualityAudit: 'RSB Food Hygiene Certified' },
      { code: 'RES-HEAVEN-01', orgName: 'Heaven Restaurant & Boutique Hotel', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Josh Ruxin', roleLabel: 'Managing Director Desk', country: 'RW', flag: 'RW', slaHours: 24, qualityAudit: 'RDB 4-Star Hospitality Standard' },
      { code: 'BNK-BK-01', orgName: 'Bank of Kigali PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Diane Karusisi', roleLabel: 'CEO Desk', country: 'RW', flag: 'RW', slaHours: 48, qualityAudit: 'National Bank of Rwanda (BNR)' },
      { code: 'BNK-IM-RW', orgName: 'I&M Bank Rwanda PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Robin Bairstow', roleLabel: 'Managing Director Desk', country: 'RW', flag: 'RW', slaHours: 48, qualityAudit: 'BNR Licensed Commercial Bank' },
      { code: 'TRN-KBS-01', orgName: 'Kigali Bus Services (KBS Transit)', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Charles Ngarambe', roleLabel: 'Managing Director Desk', country: 'RW', flag: 'RW', slaHours: 24, qualityAudit: 'RURA Licensed Urban Operator' },
      { code: 'TEL-MTN-RW', orgName: 'MTN Rwandacell PLC', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Mapula Bodibe', roleLabel: 'CEO Desk', country: 'RW', flag: 'RW', slaHours: 48, qualityAudit: 'RURA Telecommunications License' },
      { code: 'CTR-FAIR-01', orgName: 'Fair Construction Ltd Rwanda', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Joseph Mugisha', roleLabel: 'Managing Director Desk', country: 'RW', flag: 'RW', slaHours: 48, qualityAudit: 'RPPA Category 1 Contractor' },
      { code: 'NGO-TI-RW', orgName: 'Transparency International Rwanda', category: 'ngo_civil_society', categoryLabel: 'NGOs & Civil Society', officerName: 'Marie Immaculée Ingabire', roleLabel: 'Chairperson Desk', country: 'RW', flag: 'RW', slaHours: 48, qualityAudit: 'RGB Registered Civil Society' },
    ],
    samplePlaceholder: 'e.g. RW-DISTRICT-GASABO, SCH-GREENHILLS-01, HOSP-FAISAL-01, TEL-MTN-RW...',
    marketDynamicsNote: 'Service excellence and performance contracts (Imihigo) define customer relations in Rwanda. Responsive resolution guarantees public trust and continuous client retention.',
    regulatorsList: ['RSB (Standards Board)', 'RURA (Utilities Regulatory Authority)', 'FDA Rwanda (Food and Drugs)', 'BNR (National Bank)', 'RDB (Development Board)'],
  },

  TZ: {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    flag: 'TZ',
    currency: 'TZS',
    statutoryFramework: 'Local Government Authorities Act (1982) & Public Finance Act (2001)',
    statutoryNote: 'Statutory accounting authority resides with Regional Administrative Secretaries (RAS), District Executive Directors (DEDs), and Katibu Mkuu TAMISEMI.',
    primaryUnitName: 'Kata (3,956 Wards across 184 Local Government Authorities)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Afisa Mtendaji wa Kata (WEO)',
        subtitle: 'Ward Executive Officers (Afisa Mtendaji wa Kata)',
        badge: 'Kata Desk',
        sampleCode: 'TZ-WARD-KIVUKONI',
        roleLabel: 'WEO Kivukoni Ward',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: District Executive Director (DED)',
        subtitle: 'Halmashauri Executive Directors & Town Clerks',
        badge: 'Halmashauri DED',
        sampleCode: 'TZ-DED-ILALA',
        roleLabel: 'DED Ilala Municipal Council',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: Regional Commissioner / RAS',
        subtitle: 'Regional Administrative Secretaries & Commissioners (Mkoa)',
        badge: 'Mkoa RAS Authority',
        sampleCode: 'TZ-RC-DSM',
        roleLabel: 'RAS Dar es Salaam Region',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Statutory Parastatal',
        subtitle: 'TANESCO / DAWASA / TANROADS / TRA',
        badge: 'Shirika MD',
        sampleCode: 'TZ-TANESCO-ADMIN',
        roleLabel: 'Managing Director, TANESCO',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Katibu Mkuu / TAMISEMI',
        subtitle: 'Permanent Secretaries (TAMISEMI & Hazina)',
        badge: 'Apex Escalation',
        sampleCode: 'PS-TAMISEMI-TZ-2026',
        roleLabel: 'Katibu Mkuu TAMISEMI',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'PS-TAMISEMI-TZ-2026', badge: 'KATIBU MKUU', title: 'Katibu Mkuu TAMISEMI', deptName: 'TAMISEMI Tanzania', role: 'Apex Local Governance Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'TZ-PS-TREASURY', badge: 'PAYMASTER GEN', title: 'Katibu Mkuu Hazina (Paymaster General)', deptName: 'Ministry of Finance', role: 'National Public Accounts Head', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'TZ-RC-DSM', badge: 'RAS DAR', title: 'Regional Administrative Secretary (Dar es Salaam)', deptName: 'Mkoa wa Dar es Salaam', role: 'Regional Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'TZ-DED-ILALA', badge: 'DED ILALA', title: 'District Executive Director (Ilala Municipal)', deptName: 'Halmashauri ya Ilala', role: 'Council Statutory Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'TZ-TANESCO-ADMIN', badge: 'TANESCO MD', title: 'Managing Director (TANESCO)', deptName: 'TANESCO Electric Supply', role: 'National Electricity Grid Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'TZ-WARD-KIVUKONI', badge: 'WEO KIVUKONI', title: 'Ward Executive Officer (Kivukoni Ward)', deptName: 'Kivukoni Ward', role: 'Grassroots Kata Accounting Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-ILBORU-01', orgName: 'Ilboru Secondary School', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Mwl. Dennis Otieno', roleLabel: 'Headmaster Desk', country: 'TZ', flag: 'TZ', slaHours: 48, qualityAudit: 'Ministry of Education Registered' },
      { code: 'SCH-UDSM-01', orgName: 'University of Dar es Salaam (Mlimani)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Prof. William Anangisye', roleLabel: 'Vice Chancellor Desk', country: 'TZ', flag: 'TZ', slaHours: 48, qualityAudit: 'TCU Accredited' },
      { code: 'HOSP-MUHIMBILI-01', orgName: 'Muhimbili National Hospital (MNH)', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Prof. Mohamed Janabi', roleLabel: 'Executive Director Desk', country: 'TZ', flag: 'TZ', slaHours: 24, qualityAudit: 'National Tertiary Referral Level' },
      { code: 'HOSP-AGAKHAN-DAR', orgName: 'The Aga Khan Hospital Dar es Salaam', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Sisawo Konteh', roleLabel: 'Chief Executive Officer Desk', country: 'TZ', flag: 'TZ', slaHours: 24, qualityAudit: 'JCI Accredited Hospital' },
      { code: 'RES-AKEMI-DAR', orgName: 'Akemi Revolving Dining & Lounge', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Alkarim Lalji', roleLabel: 'General Manager Desk', country: 'TZ', flag: 'TZ', slaHours: 24, qualityAudit: 'TBS Food Standards Certified' },
      { code: 'RES-CAPETOWN-DAR', orgName: 'Cape Town Fish Market Dar', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'David Graham', roleLabel: 'Managing Director Desk', country: 'TZ', flag: 'TZ', slaHours: 24, qualityAudit: 'TMDA Food Hygiene Inspected' },
      { code: 'BNK-CRDB-01', orgName: 'CRDB Bank PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Abdulmajid Nsekela', roleLabel: 'Group CEO Desk', country: 'TZ', flag: 'TZ', slaHours: 48, qualityAudit: 'Bank of Tanzania Licensed' },
      { code: 'BNK-NMB-01', orgName: 'NMB Bank PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Ruth Zaipuna', roleLabel: 'Chief Executive Officer Desk', country: 'TZ', flag: 'TZ', slaHours: 48, qualityAudit: 'Bank of Tanzania Commercial' },
      { code: 'TRN-UDART-01', orgName: 'DART Mwendokasi Bus Rapid Transit', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Dr. Edwin Mhede', roleLabel: 'Chief Executive Desk', country: 'TZ', flag: 'TZ', slaHours: 24, qualityAudit: 'LATRA Regulated Urban Transit' },
      { code: 'TEL-VODACOM-TZ', orgName: 'Vodacom Tanzania PLC (M-Pesa)', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Philip Besiimire', roleLabel: 'Managing Director Desk', country: 'TZ', flag: 'TZ', slaHours: 48, qualityAudit: 'TCRA Licensed National Operator' },
      { code: 'CTR-NSSF-01', orgName: 'CRJE (East Africa) Construction', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Zhang Wei', roleLabel: 'Managing Director Desk', country: 'TZ', flag: 'TZ', slaHours: 48, qualityAudit: 'CRB Class One Civil Contractor' },
      { code: 'NGO-LHRC-TZ', orgName: 'Legal and Human Rights Centre (LHRC)', category: 'ngo_civil_society', categoryLabel: 'NGOs & Civil Society', officerName: 'Anna Henga', roleLabel: 'Executive Director Desk', country: 'TZ', flag: 'TZ', slaHours: 48, qualityAudit: 'Registered Legal NGO Bureau' },
    ],
    samplePlaceholder: 'e.g. TZ-DED-ILALA, SCH-ILBORU-01, HOSP-MUHIMBILI-01, TEL-VODACOM-TZ...',
    marketDynamicsNote: 'Customer loyalty in Tanzania hinges on swift resolution. In banking, hospitality, and healthcare, unattended grievances result in immediate customer defection.',
    regulatorsList: ['TBS (Tanzania Bureau of Standards)', 'TMDA (Medicines & Medical Devices)', 'TCRA (Communications)', 'LATRA (Land Transport)', 'BoT (Bank of Tanzania)'],
  },

  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    flag: 'ZA',
    currency: 'ZAR',
    statutoryFramework: 'Municipal Finance Management Act (MFMA) & Municipal Systems Act (Act 32 of 2000)',
    statutoryNote: 'Statutory authority is restricted to Municipal Managers, Provincial Accounting Officers, and Directors-General under the MFMA and PFMA.',
    primaryUnitName: 'Wards (4,468 Municipal Wards across 257 Municipalities)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Ward Committee Liaison',
        subtitle: 'Ward Councillors & Committee Chairs',
        badge: 'Ward Committee',
        sampleCode: 'ZA-WARD-JOBURG-01',
        roleLabel: 'Ward Councillor (Joburg Ward 01)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: Municipal Sub-Council / Region',
        subtitle: 'Regional Directors & Municipal Sub-Councils',
        badge: 'Municipal Region',
        sampleCode: 'ZA-MM-CITY-JOBURG',
        roleLabel: 'Municipal Manager, City of Joburg',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: Provincial Government (HoD)',
        subtitle: 'Provincial Heads of Department (HoD) & MECs',
        badge: 'Provincial HoD',
        sampleCode: 'ZA-HOD-GAUTENG',
        roleLabel: 'HoD Gauteng Dept of CoGTA',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: State-Owned Enterprise (SOE)',
        subtitle: 'Eskom / Rand Water / SANRAL / SARS',
        badge: 'SOE Executive',
        sampleCode: 'ZA-ESKOM-ADMIN',
        roleLabel: 'Group Chief Executive, Eskom SOC',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: National Department / DG',
        subtitle: 'Directors-General (COGTA & National Treasury)',
        badge: 'Apex Escalation',
        sampleCode: 'DG-COGTA-ZA-2026',
        roleLabel: 'Director-General COGTA',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'DG-COGTA-ZA-2026', badge: 'DIR-GENERAL', title: 'Director-General (COGTA)', deptName: 'Dept of CoGTA', role: 'Apex Local Government Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'ZA-DG-TREASURY', badge: 'DG TREASURY', title: 'Director-General (National Treasury)', deptName: 'National Treasury SA', role: 'National Public Finance Authority', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'ZA-HOD-GAUTENG', badge: 'PROV HOD', title: 'Head of Department (Gauteng CoGTA)', deptName: 'Gauteng Provincial Gov', role: 'Provincial Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'ZA-MM-CITY-JOBURG', badge: 'CITY MANAGER', title: 'Municipal Manager (City of Johannesburg)', deptName: 'City of Johannesburg', role: 'Municipal Statutory Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'ZA-ESKOM-ADMIN', badge: 'ESKOM CEO', title: 'Group Chief Executive (Eskom Holdings)', deptName: 'Eskom SOC Ltd', role: 'National Electricity Grid Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'ZA-WARD-JOBURG-01', badge: 'WARD COMM', title: 'Ward Councillor (Joburg Ward 01)', deptName: 'Joburg Ward 01', role: 'Grassroots Ward Accounting Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-STJOHNS-01', orgName: 'St John\'s College Johannesburg', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Stuart West', roleLabel: 'Executive Head Desk', country: 'ZA', flag: 'ZA', slaHours: 48, qualityAudit: 'ISASA Accredited Independent' },
      { code: 'SCH-WITS-01', orgName: 'University of the Witwatersrand (Wits)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Prof. Zeblon Vilakazi', roleLabel: 'Vice Chancellor Desk', country: 'ZA', flag: 'ZA', slaHours: 48, qualityAudit: 'CHE South Africa Accredited' },
      { code: 'HOSP-BARA-01', orgName: 'Chris Hani Baragwanath Academic Hospital', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. Nkele Lesia', roleLabel: 'Chief Executive Officer Desk', country: 'ZA', flag: 'ZA', slaHours: 24, qualityAudit: 'National Tertiary Academic Level' },
      { code: 'HOSP-NETCARE-01', orgName: 'Netcare Milpark Hospital', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Marc van Heerden', roleLabel: 'General Manager Desk', country: 'ZA', flag: 'ZA', slaHours: 24, qualityAudit: 'OHSC Certified Private Tertiary' },
      { code: 'RES-NANDOS-01', orgName: 'Nando\'s South Africa (Corporate HQ)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Geoff Whyte', roleLabel: 'Managing Director Desk', country: 'ZA', flag: 'ZA', slaHours: 24, qualityAudit: 'SABS Food Safety Standards' },
      { code: 'RES-TASHAS-01', orgName: 'Tashas Group (Sandton / Hyde Park)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Natasha Sideris', roleLabel: 'Founder & Managing Director', country: 'ZA', flag: 'ZA', slaHours: 24, qualityAudit: 'Municipal Health Inspection Passed' },
      { code: 'BNK-STANDARDBANK-01', orgName: 'Standard Bank South Africa', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Lungisa Fuzile', roleLabel: 'Chief Executive Desk', country: 'ZA', flag: 'ZA', slaHours: 48, qualityAudit: 'SARB Licensed Commercial Bank' },
      { code: 'BNK-CAPITEC-01', orgName: 'Capitec Bank Ltd', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Gerrie Fourie', roleLabel: 'CEO Desk', country: 'ZA', flag: 'ZA', slaHours: 48, qualityAudit: 'SARB Regulated Retail Bank' },
      { code: 'TRN-SANTACO-01', orgName: 'SA National Taxi Council (SANTACO)', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Abner Tsebe', roleLabel: 'President Desk', country: 'ZA', flag: 'ZA', slaHours: 24, qualityAudit: 'National Minibus Taxi Council' },
      { code: 'TEL-VODACOM-ZA', orgName: 'Vodacom Group Ltd', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Shameel Joosub', roleLabel: 'CEO Desk', country: 'ZA', flag: 'ZA', slaHours: 48, qualityAudit: 'ICASA Licensed National Operator' },
      { code: 'CTR-WBHO-01', orgName: 'WBHO Construction (Pty) Ltd', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Wolfgang Neff', roleLabel: 'CEO Desk', country: 'ZA', flag: 'ZA', slaHours: 48, qualityAudit: 'CIDB Grade 9GB / 9CE' },
      { code: 'NGO-OUTA-01', orgName: 'OUTA (Organisation Undoing Tax Abuse)', category: 'ngo_civil_society', categoryLabel: 'NGOs & Civil Society', officerName: 'Wayne Duvenage', roleLabel: 'CEO Desk', country: 'ZA', flag: 'ZA', slaHours: 48, qualityAudit: 'NPO Registered Watchdog' },
    ],
    samplePlaceholder: 'e.g. ZA-MM-CITY-JOBURG, SCH-STJOHNS-01, HOSP-NETCARE-01, TEL-VODACOM-ZA...',
    marketDynamicsNote: 'In South Africa, customer protection is backed by the Consumer Protection Act (CPA). Responsive customer service on transparent public desks protects market reputation.',
    regulatorsList: ['SABS (Bureau of Standards)', 'SAHPRA (Health Products)', 'ICASA (Communications)', 'SARB (Reserve Bank)', 'NCC (National Consumer Commission)'],
  },

  US: {
    countryCode: 'US',
    countryName: 'United States',
    flag: 'US',
    currency: 'USD',
    statutoryFramework: 'Municipal Code, County Charters & Title 2 CFR Public Accountability Standards',
    statutoryNote: 'Access is restricted to authorized municipal executives, county administrators, public utility commissioners, and federal agency directors.',
    primaryUnitName: 'Wards & Precincts (City Councils across 3,143 Counties)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Community Liaison / ANC',
        subtitle: 'Advisory Neighborhood Commissioners & Ward Aides',
        badge: 'Ward / Precinct',
        sampleCode: 'US-ANC-WARD-02',
        roleLabel: 'Ward Commissioner (Ward 2)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: City Administration',
        subtitle: 'City Managers & Public Works Directors',
        badge: 'City Hall',
        sampleCode: 'US-CITY-MGR-AUSTIN',
        roleLabel: 'City Manager, City of Austin',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: County Executive',
        subtitle: 'County Judges, Commissioners & Executives',
        badge: 'County Seat',
        sampleCode: 'US-COUNTY-TRAVIS',
        roleLabel: 'County Judge, Travis County',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Public Utility / Transit Authority',
        subtitle: 'Regional Transit Authorities & Municipal Power',
        badge: 'Public Authority',
        sampleCode: 'US-AUSTIN-ENERGY',
        roleLabel: 'General Manager, Austin Energy',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Federal / State Cabinet Secretary',
        subtitle: 'Cabinet Secretaries (DOT / HUD / EPA)',
        badge: 'Apex Escalation',
        sampleCode: 'SEC-TRANS-US-2026',
        roleLabel: 'Secretary of Transportation',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'SEC-TRANS-US-2026', badge: 'CABINET SEC', title: 'Secretary of Transportation', deptName: 'US Dept of Transportation', role: 'Federal Accounting Executive', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'US-COUNTY-TRAVIS', badge: 'COUNTY JUDGE', title: 'County Judge / Executive (Travis County)', deptName: 'Travis County Government', role: 'County Accounting Executive', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'US-CITY-MGR-AUSTIN', badge: 'CITY MGR', title: 'City Manager (City of Austin)', deptName: 'City of Austin', role: 'Municipal Statutory Executive', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'US-AUSTIN-ENERGY', badge: 'ENERGY GM', title: 'General Manager (Austin Energy)', deptName: 'Austin Energy Electric Co', role: 'Public Power Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'US-CAP-METRO', badge: 'TRANSIT CEO', title: 'President & CEO (Capital Metro Transit)', deptName: 'CapMetro Transit Authority', role: 'Public Transit Accounting Authority', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'US-ANC-WARD-02', badge: 'WARD COMM', title: 'Advisory Neighborhood Commissioner (Ward 2)', deptName: 'Ward 2 ANC', role: 'Grassroots Community Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-AUSTIN-HS', orgName: 'Austin High School', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Dr. Melvin Bedford', roleLabel: 'Principal Desk', country: 'US', flag: 'US', slaHours: 48, qualityAudit: 'TEA Accredited Public High' },
      { code: 'SCH-UT-AUSTIN', orgName: 'University of Texas at Austin', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Jay Hartzell', roleLabel: 'President Desk', country: 'US', flag: 'US', slaHours: 48, qualityAudit: 'SACSCOC Accredited' },
      { code: 'HOSP-STD-AUSTIN', orgName: 'St. David\'s Medical Center', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Todd Steward', roleLabel: 'Chief Executive Officer Desk', country: 'US', flag: 'US', slaHours: 24, qualityAudit: 'Joint Commission Accredited' },
      { code: 'RES-FRANKLIN-01', orgName: 'Franklin Barbecue Austin', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Aaron Franklin', roleLabel: 'General Manager Desk', country: 'US', flag: 'US', slaHours: 24, qualityAudit: 'Austin Public Health Grade A' },
      { code: 'BNK-CHASE-AUSTIN', orgName: 'JPMorgan Chase Bank Austin', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'David Miree', roleLabel: 'Regional Director Desk', country: 'US', flag: 'US', slaHours: 48, qualityAudit: 'FDIC Insured / OCC Regulated' },
      { code: 'TEL-ATT-US', orgName: 'AT&T Telecommunications Inc.', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'John Stankey', roleLabel: 'CEO Customer Support', country: 'US', flag: 'US', slaHours: 48, qualityAudit: 'FCC Licensed Carrier' },
      { code: 'CTR-BECHTEL-01', orgName: 'Bechtel Infrastructure Corp', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Brendan Bechtel', roleLabel: 'Chief Executive Desk', country: 'US', flag: 'US', slaHours: 48, qualityAudit: 'OSHA VPP Star Certified' },
    ],
    samplePlaceholder: 'e.g. US-CITY-MGR-AUSTIN, SCH-UT-AUSTIN, HOSP-STD-AUSTIN, TEL-ATT-US...',
    marketDynamicsNote: 'In the American market, consumer choice is fierce. Online reviews and published resolution SLAs dictate customer trust and commercial viability.',
    regulatorsList: ['FDA (Food and Drug Admin)', 'FCC (Communications)', 'EPA (Environmental Protection)', 'DOT (Transportation)', 'FTC (Federal Trade Commission)'],
  },

  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    flag: 'GB',
    currency: 'GBP',
    statutoryFramework: 'Local Government Act (1972/2000) & Public Sector Equality Duty',
    statutoryNote: 'Official statutory desks are granted to Council Chief Executives, Parish Clerks, and Permanent Secretaries across Whitehall.',
    primaryUnitName: 'Wards (9,500 Wards across 333 Local Authorities)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Ward Councillor / Parish Desk',
        subtitle: 'Ward Councillors & Parish Clerks',
        badge: 'Ward Office',
        sampleCode: 'GB-WARD-CAMDEN-01',
        roleLabel: 'Ward Councillor (Bloomsbury Ward)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: Borough / District Director',
        subtitle: 'Directors of Public Realm, Highways & Housing',
        badge: 'Borough Director',
        sampleCode: 'GB-DIR-CAMDEN',
        roleLabel: 'Director of Public Realm (Camden)',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: Council Chief Executive',
        subtitle: 'Council Chief Executives & Town Clerks',
        badge: 'Chief Executive',
        sampleCode: 'GB-CHIEF-EXEC-LONDON',
        roleLabel: 'Chief Executive, Camden Council',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Statutory Utility / Transport',
        subtitle: 'National Grid / Thames Water / Transport for London',
        badge: 'Statutory Body',
        sampleCode: 'GB-GRID-ADMIN',
        roleLabel: 'Chief Operations Officer, National Grid',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Permanent Secretary (Whitehall)',
        subtitle: 'Permanent Secretaries (DLUHC & Treasury)',
        badge: 'Apex Escalation',
        sampleCode: 'PS-DLUHC-GB-2026',
        roleLabel: 'Permanent Secretary, DLUHC',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'PS-DLUHC-GB-2026', badge: 'PERM SEC', title: 'Permanent Secretary (DLUHC)', deptName: 'Dept for Levelling Up (DLUHC)', role: 'Whitehall Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'GB-CHIEF-EXEC-LONDON', badge: 'CHIEF EXEC', title: 'Chief Executive (Camden Council)', deptName: 'London Borough of Camden', role: 'Council Statutory Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'GB-DIR-CAMDEN', badge: 'DIR HIGHWAYS', title: 'Director of Public Realm & Highways', deptName: 'Camden Council', role: 'Borough Highways Accounting Lead', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'GB-GRID-ADMIN', badge: 'GRID COO', title: 'Chief Operations Officer (National Grid)', deptName: 'National Grid UK', role: 'Utility Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'GB-TFL-ADMIN', badge: 'TFL COMM', title: 'Commissioner of Transport (TfL)', deptName: 'Transport for London', role: 'Metropolitan Transit Accounting Authority', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'GB-WARD-CAMDEN-01', badge: 'WARD COUNCILLOR', title: 'Ward Councillor (Bloomsbury Ward)', deptName: 'Bloomsbury Ward Office', role: 'Grassroots Ward Accounting Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-WESTMINSTER-01', orgName: 'Westminster School London', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Dr. Gary Savage', roleLabel: 'Head Master Desk', country: 'GB', flag: 'GB', slaHours: 48, qualityAudit: 'Ofsted Outstanding Rating' },
      { code: 'SCH-UCL-01', orgName: 'University College London (UCL)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Dr. Michael Spence', roleLabel: 'President & Provost Desk', country: 'GB', flag: 'GB', slaHours: 48, qualityAudit: 'Office for Students Registered' },
      { code: 'HOSP-THOMAS-01', orgName: 'St Thomas\' Hospital (Guy\'s & St Thomas\' NHS)', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Prof. Ian Abbs', roleLabel: 'Chief Executive Desk', country: 'GB', flag: 'GB', slaHours: 24, qualityAudit: 'Care Quality Commission (CQC) Approved' },
      { code: 'RES-DISHOOM-01', orgName: 'Dishoom Restaurants London (Covent Garden)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Shamil Thakrar', roleLabel: 'Co-Founder Desk', country: 'GB', flag: 'GB', slaHours: 24, qualityAudit: 'FSA 5-Star Food Hygiene Rating' },
      { code: 'BNK-BARCLAYS-01', orgName: 'Barclays Bank UK PLC', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Matt Hammerstein', roleLabel: 'Chief Executive Desk', country: 'GB', flag: 'GB', slaHours: 48, qualityAudit: 'Prudential Regulation Authority (PRA)' },
      { code: 'TEL-BT-UK', orgName: 'BT Group / EE Telecommunications', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Allison Kirkby', roleLabel: 'Chief Executive Desk', country: 'GB', flag: 'GB', slaHours: 48, qualityAudit: 'Ofcom Licensed Operator' },
      { code: 'CTR-BALFOUR-01', orgName: 'Balfour Beatty Civil Engineering', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Leo Quinn', roleLabel: 'Group Chief Executive Desk', country: 'GB', flag: 'GB', slaHours: 48, qualityAudit: 'Chas & Constructionline Gold' },
    ],
    samplePlaceholder: 'e.g. GB-CHIEF-EXEC-LONDON, SCH-UCL-01, HOSP-THOMAS-01, TEL-BT-UK...',
    marketDynamicsNote: 'In the UK, customer care standards are intensely benchmarked. Businesses that disregard consumer queries lose clientele to responsive alternatives.',
    regulatorsList: ['Ofcom (Communications)', 'Ofgem (Energy)', 'Ofwat (Water)', 'CQC (Care Quality Commission)', 'FSA (Food Standards Agency)'],
  },

  IN: {
    countryCode: 'IN',
    countryName: 'India',
    flag: 'IN',
    currency: 'INR',
    statutoryFramework: '73rd & 74th Constitutional Amendments (Panchayati Raj & Nagarpalika)',
    statutoryNote: 'Statutory authority is designated to District Magistrates (DM), Block Development Officers (BDO), and Gram Panchayat Secretaries.',
    primaryUnitName: 'Gram Panchayats (255,000 Panchayats across 750+ Districts)',
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Gram Panchayat / Ward Desk',
        subtitle: 'Gram Panchayat Secretaries & Sarpanches',
        badge: 'Panchayat Desk',
        sampleCode: 'IN-GP-GURUGRAM',
        roleLabel: 'Gram Panchayat Secretary (Badshahpur)',
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: Block Development Office (BDO)',
        subtitle: 'Block Development Officers & Municipal Executives',
        badge: 'Block Admin',
        sampleCode: 'IN-BDO-GURUGRAM',
        roleLabel: 'Block Development Officer (Gurugram)',
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: District Magistrate (DM / DC)',
        subtitle: 'District Collectors (DM) & Municipal Commissioners',
        badge: 'District Collectorate',
        sampleCode: 'IN-DM-GURUGRAM',
        roleLabel: 'District Magistrate / DC Gurugram',
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: State Discom / Jal Board',
        subtitle: 'State Power Distribution & Water Supply Boards',
        badge: 'Managing Director',
        sampleCode: 'IN-DHBVN-POWER',
        roleLabel: 'Managing Director, DHBVN Power',
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Ministry Secretary (Union / State)',
        subtitle: 'Secretaries to Government of India (MoPR / MoHUA)',
        badge: 'Apex Escalation',
        sampleCode: 'SEC-MOPR-IN-2026',
        roleLabel: 'Secretary Ministry of Panchayati Raj',
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: 'SEC-MOPR-IN-2026', badge: 'UNION SEC', title: 'Secretary (Ministry of Panchayati Raj)', deptName: 'Ministry of Panchayati Raj', role: 'Union Accounting Head', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: 'IN-DM-GURUGRAM', badge: 'DISTRICT MAGISTRATE', title: 'District Magistrate / Collector (Gurugram)', deptName: 'District Collectorate', role: 'District Statutory Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'IN-BDO-GURUGRAM', badge: 'BDO', title: 'Block Development Officer (Badshahpur)', deptName: 'Block Development Office', role: 'Block Level Accounting Liaison', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: 'IN-DHBVN-POWER', badge: 'DISCOM MD', title: 'Managing Director (DHBVN Electricity)', deptName: 'DHBVN Power Discom', role: 'State Electricity Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'IN-DJB-WATER', badge: 'JAL BOARD CEO', title: 'Chief Executive Officer (Delhi Jal Board)', deptName: 'Delhi Jal Board', role: 'Water Authority Accounting Desk', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: 'IN-GP-GURUGRAM', badge: 'GP SECRETARY', title: 'Gram Panchayat Secretary (Badshahpur)', deptName: 'Gram Panchayat Badshahpur', role: 'Grassroots Panchayat Accounting Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: 'SCH-DPS-01', orgName: 'Delhi Public School (R.K. Puram)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Padma Bandopadhyay', roleLabel: 'Principal Desk', country: 'IN', flag: 'IN', slaHours: 48, qualityAudit: 'CBSE Affiliated Grade A1' },
      { code: 'SCH-IIT-DELHI', orgName: 'Indian Institute of Technology Delhi (IITD)', category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Prof. Rangan Banerjee', roleLabel: 'Director Desk', country: 'IN', flag: 'IN', slaHours: 48, qualityAudit: 'Institute of National Importance' },
      { code: 'HOSP-AIIMS-01', orgName: 'All India Institute of Medical Sciences (AIIMS)', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Dr. M. Srinivas', roleLabel: 'Director Desk', country: 'IN', flag: 'IN', slaHours: 24, qualityAudit: 'NABH Accredited Apex Center' },
      { code: 'HOSP-APOLLO-DELHI', orgName: 'Indraprastha Apollo Hospitals Delhi', category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'P. Shivakumar', roleLabel: 'Managing Director Desk', country: 'IN', flag: 'IN', slaHours: 24, qualityAudit: 'JCI Accredited Hospital' },
      { code: 'RES-KARIMS-01', orgName: 'Karim\'s Historic Dining (Jama Masjid)', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Zaeemuddin Ahmad', roleLabel: 'Managing Partner Desk', country: 'IN', flag: 'IN', slaHours: 24, qualityAudit: 'FSSAI Certified Food Hygiene' },
      { code: 'RES-HALDIRAMS-01', orgName: 'Haldiram\'s Restaurants & Sweets', category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Manohar Lal Agarwal', roleLabel: 'Director Desk', country: 'IN', flag: 'IN', slaHours: 24, qualityAudit: 'FSSAI Grade A Standards' },
      { code: 'BNK-SBI-01', orgName: 'State Bank of India (SBI Main)', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Dinesh Kumar Khara', roleLabel: 'Chairman Desk', country: 'IN', flag: 'IN', slaHours: 48, qualityAudit: 'Reserve Bank of India (RBI)' },
      { code: 'BNK-HDFC-01', orgName: 'HDFC Bank Ltd', category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Sashidhar Jagdishan', roleLabel: 'Managing Director Desk', country: 'IN', flag: 'IN', slaHours: 48, qualityAudit: 'RBI Regulated Commercial Bank' },
      { code: 'TRN-DTC-01', orgName: 'Delhi Transport Corporation (DTC Bus)', category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Shilpa Shinde', roleLabel: 'Managing Director Desk', country: 'IN', flag: 'IN', slaHours: 24, qualityAudit: 'State Transport Authority' },
      { code: 'TEL-JIO-IN', orgName: 'Reliance Jio Infocomm Ltd', category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Akash Ambani', roleLabel: 'Chairman & Customer Care', country: 'IN', flag: 'IN', slaHours: 48, qualityAudit: 'TRAI Licensed Unified Operator' },
      { code: 'CTR-LT-01', orgName: 'Larsen & Toubro (L&T Infrastructure)', category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'S. N. Subrahmanyan', roleLabel: 'Chairman & MD Desk', country: 'IN', flag: 'IN', slaHours: 48, qualityAudit: 'ISO 9001 / Class Special Civil' },
    ],
    samplePlaceholder: 'e.g. IN-DM-GURUGRAM, SCH-IIT-DELHI, HOSP-AIIMS-01, TEL-JIO-IN...',
    marketDynamicsNote: 'In India\'s hyper-competitive consumer landscape, prompt redressal of grievances is vital. Consumers quickly switch providers when complaints go unresolved.',
    regulatorsList: ['FSSAI (Food Safety Standards)', 'TRAI (Telecom Regulatory)', 'RBI (Reserve Bank)', 'NABH (Hospitals Board)', 'BIS (Bureau of Indian Standards)'],
  },
};

// Automatic registry injector: registers all codes from profile into GOV_CODES
export function registerProfileInGovCodes(profile: CountryDesksProfile) {
  // Register 5-tier escalation codes
  profile.escalationLadder.forEach((t) => {
    if (!GOV_CODES[t.sampleCode]) {
      GOV_CODES[t.sampleCode] = {
        country: profile.countryCode,
        dept: t.rank === 4 ? 'utility' : 'civic',
        scope: profile.countryCode,
        role: t.rank === 5 ? 'platform_admin' : t.rank >= 2 ? 'node_admin' : 'spokesperson',
        is_utility: t.rank === 4,
        role_label: `${t.title} (${t.roleLabel})`,
        real_title_short: t.badge,
        hierarchy_level: `tier${t.rank}_rank` as any,
        escalation_rank: t.rank,
        officer_name: t.roleLabel,
      };
    }
  });

  // Register instant test accounting desks
  profile.accountingDesks.forEach((a) => {
    if (!GOV_CODES[a.code]) {
      GOV_CODES[a.code] = {
        country: profile.countryCode,
        dept: a.deptName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 10),
        scope: profile.countryCode,
        role: a.badge.includes('PS') || a.badge.includes('SEC') || a.badge.includes('DG') ? 'platform_admin' : 'node_admin',
        is_utility: a.deptName.toLowerCase().includes('water') || a.deptName.toLowerCase().includes('power') || a.deptName.toLowerCase().includes('energy'),
        role_label: `${a.title} · ${a.role}`,
        real_title_short: a.badge,
        hierarchy_level: 'tier3_district_cao',
        escalation_rank: 3,
        officer_name: a.title,
      };
    }
  });

  // Register verified private providers
  profile.verifiedProviders.forEach((p) => {
    if (!GOV_CODES[p.code]) {
      GOV_CODES[p.code] = {
        country: profile.countryCode,
        dept: p.category,
        scope: profile.countryCode,
        role: 'spokesperson',
        is_utility: p.category === 'private_utility_telecom',
        role_label: `${p.orgName} (${p.roleLabel})`,
        real_title_short: p.orgName.split(' ')[0],
        entity_type: 'non_government_entity',
        entity_category: p.category,
        organization_name: p.orgName,
        officer_name: p.officerName || 'Verified Desk Officer',
      };
    }
  });
}

// Dynamic fallback generator for any country in COUNTRIES
export function getCountryDesksProfile(countryCode: CountryCode): CountryDesksProfile {
  const norm = (countryCode || 'UG').toUpperCase();
  if (BESPOKE_PROFILES[norm]) {
    registerProfileInGovCodes(BESPOKE_PROFILES[norm]);
    return BESPOKE_PROFILES[norm];
  }

  const cInfo = COUNTRIES[norm] || {
    name: norm,
    flag: norm,
    currency: 'USD',
    id_label: 'National ID',
    node: `${norm}_NODE_01`,
  };

  const name = cInfo.name;
  const flag = cInfo.flag || norm;
  const curr = cInfo.currency || 'USD';

  // Synthesize realistic factual structures for this country
  const profile: CountryDesksProfile = {
    countryCode: norm,
    countryName: name,
    flag,
    currency: curr,
    statutoryFramework: `Public Finance Management Act & Decentralized Governance Laws of ${name}`,
    statutoryNote: `In ${name}, statutory access is restricted to official accounting officers, public administrators, and licensed institution leads under the national public governance framework.`,
    primaryUnitName: `Local Governance Units & Primary Wards in ${name}`,
    escalationLadder: [
      {
        rank: 1,
        title: 'Tier 1: Grassroots Community Liaison',
        subtitle: `Local Community Officers & Ward Desks in ${name}`,
        badge: 'Local Desk',
        sampleCode: `${norm}-WARD-DESK-01`,
        roleLabel: `Grassroots Desk Officer (${name})`,
        bg: 'from-amber-500/15 to-amber-600/5 border-amber-400/40 text-amber-900 dark:text-amber-300',
      },
      {
        rank: 2,
        title: 'Tier 2: Municipal / Sub-District Office',
        subtitle: `Town Clerks & Sub-District Administrators`,
        badge: 'Municipal Admin',
        sampleCode: `${norm}-MUNI-OFFICE-01`,
        roleLabel: `Municipal Administrator (${name})`,
        bg: 'from-blue-500/15 to-blue-600/5 border-blue-400/40 text-blue-900 dark:text-blue-300',
      },
      {
        rank: 3,
        title: 'Tier 3: Regional / District Accounting Officer',
        subtitle: `District Chief Executives & Regional Directors`,
        badge: 'District Executive',
        sampleCode: `${norm}-DIST-EXEC-01`,
        roleLabel: `District Chief Officer (${name})`,
        bg: 'from-purple-500/15 to-purple-600/5 border-purple-400/40 text-purple-900 dark:text-purple-300',
      },
      {
        rank: 4,
        title: 'Tier 4: Statutory Agency / Utility',
        subtitle: `National Water, Power & Public Utilities in ${name}`,
        badge: 'Utility MD',
        sampleCode: `${norm}-UTILITY-ADMIN`,
        roleLabel: `Director General Public Utilities (${name})`,
        bg: 'from-indigo-500/15 to-indigo-600/5 border-indigo-400/40 text-indigo-900 dark:text-indigo-300',
      },
      {
        rank: 5,
        title: 'Tier 5: Line Ministry / Permanent Secretary',
        subtitle: `Permanent Secretaries & National Treasury`,
        badge: 'Apex Escalation',
        sampleCode: `PS-MINISTRY-${norm}-2026`,
        roleLabel: `Permanent Secretary (${name} Ministry)`,
        bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-400/30',
      },
    ],
    accountingDesks: [
      { code: `PS-MINISTRY-${norm}-2026`, badge: 'PERM SEC', title: `Permanent Secretary (Local Government)`, deptName: `Ministry of Local Gov`, role: 'National Public Accounting Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: `${norm}-PS-TREASURY`, badge: 'TREASURY', title: `Permanent Secretary (National Treasury)`, deptName: `Ministry of Finance`, role: 'Apex Public Finance Officer', borderColor: 'border-emerald-300 dark:border-emerald-500/50', textColor: 'text-emerald-700 dark:text-emerald-300' },
      { code: `${norm}-DIST-EXEC-01`, badge: 'DISTRICT DIR', title: `District Chief Executive Officer`, deptName: `District Administration`, role: 'Statutory Local Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: `${norm}-MUNI-OFFICE-01`, badge: 'TOWN CLERK', title: `Municipal Town Clerk`, deptName: `Municipal Council`, role: 'Municipal Accounting Officer', borderColor: 'border-teal-200 dark:border-teal-500/40', textColor: 'text-teal-700 dark:text-teal-300' },
      { code: `${norm}-UTILITY-ADMIN`, badge: 'UTILITY MD', title: `Managing Director (National Utilities)`, deptName: `Public Utilities Corp`, role: 'National Utility Accounting Authority', borderColor: 'border-indigo-300 dark:border-indigo-500/40', textColor: 'text-indigo-700 dark:text-indigo-300' },
      { code: `${norm}-WARD-DESK-01`, badge: 'LOCAL LIAISON', title: `Local Ward / Community Desk Lead`, deptName: `Community Office`, role: 'Grassroots Community Accounting Liaison', borderColor: 'border-amber-200 dark:border-amber-500/40', textColor: 'text-amber-700 dark:text-amber-300' },
    ],
    verifiedProviders: [
      { code: `SCH-${norm}-NATIONAL-01`, orgName: `${name} National Academy`, category: 'education', categoryLabel: 'Schools & Universities', officerName: 'Academic Director', roleLabel: 'Principal Desk', country: norm, flag, slaHours: 48, qualityAudit: 'National Ministry of Education' },
      { code: `HOSP-${norm}-REFERRAL-01`, orgName: `${name} Central Referral Hospital`, category: 'health', categoryLabel: 'Hospitals & Clinics', officerName: 'Chief Medical Officer', roleLabel: 'Medical Director Desk', country: norm, flag, slaHours: 24, qualityAudit: 'Ministry of Health Certified' },
      { code: `RES-${norm}-HERITAGE-01`, orgName: `${name} Heritage Dining & Hospitality`, category: 'food_dining', categoryLabel: 'Food & Dining', officerName: 'Operations Lead', roleLabel: 'General Manager Desk', country: norm, flag, slaHours: 24, qualityAudit: 'Food Sanitation Passed' },
      { code: `BNK-${norm}-NATIONAL-01`, orgName: `${name} Commercial Bank Ltd`, category: 'banking_finance', categoryLabel: 'Banks & SACCOs', officerName: 'Managing Director', roleLabel: 'Managing Director Desk', country: norm, flag, slaHours: 48, qualityAudit: 'Central Bank Regulated' },
      { code: `TRN-${norm}-TRANSIT-01`, orgName: `${name} Express Transit Cooperative`, category: 'transport_cooperative', categoryLabel: 'Transit & Boda SACCOs', officerName: 'Transport Union Secretary', roleLabel: 'Union Chairman Desk', country: norm, flag, slaHours: 24, qualityAudit: 'Licensed Transport Operator' },
      { code: `TEL-${norm}-TELECOM-01`, orgName: `${name} Telecom & Data Network`, category: 'private_utility_telecom', categoryLabel: 'Utilities & Telecoms', officerName: 'Head of Customer Relations', roleLabel: 'CEO Desk', country: norm, flag, slaHours: 48, qualityAudit: 'National Telecom Authority' },
      { code: `CTR-${norm}-INFRA-01`, orgName: `${name} Civil Infrastructure Works`, category: 'private_contractor', categoryLabel: 'Civil Contractors', officerName: 'Chief Project Engineer', roleLabel: 'Managing Director Desk', country: norm, flag, slaHours: 48, qualityAudit: 'National Civil Engineering Reg' },
      { code: `NGO-${norm}-CIVIC-01`, orgName: `${name} Civic Transparency Coalition`, category: 'ngo_civil_society', categoryLabel: 'NGOs & Civil Society', officerName: 'Executive Director', roleLabel: 'Executive Director Desk', country: norm, flag, slaHours: 48, qualityAudit: 'Registered Non-Governmental Entity' },
    ],
    samplePlaceholder: `e.g. ${norm}-DIST-EXEC-01, SCH-${norm}-NATIONAL-01, HOSP-${norm}-REFERRAL-01...`,
    marketDynamicsNote: `In ${name}, customer care defines commercial viability. When providers neglect citizen tickets, clients defect to higher-rated competitors.`,
    regulatorsList: ['National Standards Body', 'Health Facilities Board', 'Communications Authority', 'Central Bank', 'Consumer Protection Council'],
  };

  registerProfileInGovCodes(profile);
  return profile;
}
