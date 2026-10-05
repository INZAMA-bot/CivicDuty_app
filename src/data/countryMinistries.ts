import { CountryCode } from '../types';
import { COUNTRIES } from './countries';
import { getNationalRolloutArrangements } from './tiers';

export type MinistrySector =
  | 'GOVERNANCE'
  | 'FISCAL'
  | 'INFRASTRUCTURE'
  | 'HEALTH'
  | 'EDUCATION'
  | 'WATER_ENVIRONMENT'
  | 'ICT_DIGITAL'
  | 'CABINET_DELIVERY';

export interface GrantAllocationRecord {
  district: string;
  quarterAllocation: string;
  amountDisbursed: string;
  unspentBalance: string;
  unresolvedComplaints: number;
  auditFlag: 'NORMAL' | 'UNDER_REVIEW' | 'FROZEN';
  lastAuditDate: string;
}

export interface RoadEquipmentTelemetryRecord {
  unitId: string;
  district: string;
  model: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE' | 'GEOFENCE_ALERT';
  operatingHours: number;
  fuelUsedLiters: number;
  gradedKilometers: number;
  lastGpsLocation: string;
  assignedOperator: string;
}

export interface DrugStockVerificationRecord {
  facilityName: string;
  level: string;
  district: string;
  drugCategory: string;
  stockStatus: 'ADEQUATE' | 'CRITICAL_LOW' | 'STOCK_OUT';
  lastDeliveryBatch: string;
  citizenReportsCount: number;
  investigationStatus: 'VERIFIED_NMS_STOCK' | 'DISPATCH_IN_TRANSIT' | 'DIVERSION_FLAGGED';
}

export interface SchoolAuditRecord {
  schoolName: string;
  district: string;
  level: string;
  capitationGrantDisbursed: string;
  illegalFeesReported: boolean;
  hazardRisk: 'SAFE' | 'ROOF_CONDEMNED' | 'SANITATION_CRITICAL';
  teacherAttendanceRate: number;
}

export interface BoreholeTelemetryRecord {
  pointId: string;
  subCounty: string;
  district: string;
  waterType: string;
  status: 'FUNCTIONAL' | 'PUMP_BROKEN' | 'CONTAMINATED';
  daysDowntime: number;
  mechanicDispatched: boolean;
  beneficiaryHouseholds: number;
}

export interface UssdGatewayTelemetryRecord {
  carrier: string;
  gatewayCode: string;
  uptimePercent: number;
  avgLatencyMs: number;
  throughputPerMin: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'MAINTENANCE';
}

export interface CabinetDeliveryRecord {
  ministryName: string;
  psName: string;
  deliveryIndex: number;
  slaAdherence: number;
  interAgencySync: number;
  pendingInquiries: number;
  statutoryRank: number;
}

export interface MinistryProfile {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  permSecretary: string;
  roleTitle: string;
  sector: MinistrySector;
  country: CountryCode;
  statutoryAct: string;
  mandate: string;
  slaScore: string;
  macroSpeedHours: number;
  cabinetDeliveryIndex: number;
  activeCases: number;
  resolvedCases: number;
  interAgencyCollabScore: string;
  risk: 'Low' | 'Medium' | 'High';
  color: string;
  icon: string;
  isSuperadmin?: boolean;
  uniqueFeatureName: string;
  uniqueFeatureBadge: string;
  uniqueFeatureDesc: string;
  fiscalGrants?: GrantAllocationRecord[];
  roadEquipment?: RoadEquipmentTelemetryRecord[];
  drugAlerts?: DrugStockVerificationRecord[];
  schoolAudits?: SchoolAuditRecord[];
  boreholeTelemetry?: BoreholeTelemetryRecord[];
  ussdGateways?: UssdGatewayTelemetryRecord[];
  cabinetDelivery?: CabinetDeliveryRecord[];
}

export const BESPOKE_MINISTRIES: Record<string, MinistryProfile[]> = {
  UG: [
    {
      id: 'PS-MOLG',
      code: 'PS-MOLG-2026',
      title: 'Ministry of Local Government (MoLG)',
      shortTitle: 'MoLG',
      permSecretary: 'Ben Kumumanya',
      roleTitle: 'Permanent Secretary & National Superadmin',
      sector: 'GOVERNANCE',
      country: 'UG',
      statutoryAct: 'Local Government Act (Cap 243) & PDM Pillar VII Directive',
      mandate: 'Territorial Decentralization, 146 Districts, 10 Cities, 10,595 Parishes, Batch Statutory Minting & Administrative Cadres.',
      slaScore: '93.4%',
      macroSpeedHours: 24.2,
      cabinetDeliveryIndex: 94.2,
      activeCases: 1480,
      resolvedCases: 1350,
      interAgencyCollabScore: '98%',
      risk: 'Low',
      color: 'emerald',
      icon: 'Building2',
      isSuperadmin: true,
      uniqueFeatureName: 'National Territorial Hierarchy & Batch Minting',
      uniqueFeatureBadge: 'TERRITORIAL SUPERADMIN',
      uniqueFeatureDesc: 'Sovereign administrative backbone issuing accounting codes to CAOs, Town Clerks, SAS, and Parish Chiefs with national circular broadcasts.'
    },
    {
      id: 'PS-MOFPED',
      code: 'PS-MOFPED-2026',
      title: 'Ministry of Finance, Planning & Economic Development (MoFPED)',
      shortTitle: 'MoFPED',
      permSecretary: 'Ramathan Ggoobi',
      roleTitle: 'Permanent Secretary / Secretary to the Treasury (PS/ST)',
      sector: 'FISCAL',
      country: 'UG',
      statutoryAct: 'Public Finance Management Act (PFMA 2015, Sec. 15)',
      mandate: 'Discretionary Development Equalization Grants (DDEG), Treasury Single Account (TSA) releases, Local Revenue Automation & PDM Sacco Revolving Fund.',
      slaScore: '94.8%',
      macroSpeedHours: 19.5,
      cabinetDeliveryIndex: 96.5,
      activeCases: 620,
      resolvedCases: 583,
      interAgencyCollabScore: '99%',
      risk: 'Low',
      color: 'amber',
      icon: 'Landmark',
      uniqueFeatureName: 'DDEG Grant Correlation & Section 15 Statutory Budget Freeze',
      uniqueFeatureBadge: 'FISCAL ACCOUNTABILITY',
      uniqueFeatureDesc: 'Cross-reference district citizen complaint volumes with unspent bank balances, and execute Section 15 PFMA budget freeze sanctions on defaulting accounting officers.',
      fiscalGrants: [
        { district: 'Wakiso District', quarterAllocation: 'UGX 4.82B', amountDisbursed: 'UGX 4.82B', unspentBalance: 'UGX 1.15B', unresolvedComplaints: 24, auditFlag: 'NORMAL', lastAuditDate: '2026-09-24' },
        { district: 'Gulu City', quarterAllocation: 'UGX 2.45B', amountDisbursed: 'UGX 2.45B', unspentBalance: 'UGX 890M', unresolvedComplaints: 41, auditFlag: 'UNDER_REVIEW', lastAuditDate: '2026-09-26' },
        { district: 'Mbarara City', quarterAllocation: 'UGX 2.90B', amountDisbursed: 'UGX 2.90B', unspentBalance: 'UGX 420M', unresolvedComplaints: 12, auditFlag: 'NORMAL', lastAuditDate: '2026-09-27' },
        { district: 'Arua City', quarterAllocation: 'UGX 2.10B', amountDisbursed: 'UGX 2.10B', unspentBalance: 'UGX 980M', unresolvedComplaints: 56, auditFlag: 'FROZEN', lastAuditDate: '2026-09-29' },
        { district: 'Jinja City', quarterAllocation: 'UGX 3.15B', amountDisbursed: 'UGX 3.15B', unspentBalance: 'UGX 610M', unresolvedComplaints: 18, auditFlag: 'NORMAL', lastAuditDate: '2026-09-28' },
        { district: 'Kabale District', quarterAllocation: 'UGX 1.95B', amountDisbursed: 'UGX 1.95B', unspentBalance: 'UGX 310M', unresolvedComplaints: 9, auditFlag: 'NORMAL', lastAuditDate: '2026-09-25' }
      ]
    },
    {
      id: 'PS-MOWT',
      code: 'PS-MOWT-2026',
      title: 'Ministry of Works & Transport (MoWT)',
      shortTitle: 'MoWT',
      permSecretary: 'Bageya Waiswa',
      roleTitle: 'Permanent Secretary & Transport Accounting Officer',
      sector: 'INFRASTRUCTURE',
      country: 'UG',
      statutoryAct: 'Roads Act (2019) & Uganda National Roads Authority Act',
      mandate: '146 District Road Units Telemetry, National Highway Bridges, Verified Contractor Milestones & Rapid Pothole Clearance.',
      slaScore: '89.2%',
      macroSpeedHours: 28.4,
      cabinetDeliveryIndex: 89.8,
      activeCases: 1120,
      resolvedCases: 986,
      interAgencyCollabScore: '94%',
      risk: 'Low',
      color: 'rose',
      icon: 'Truck',
      uniqueFeatureName: 'District Road Unit Telemetry & Heavy Machinery Fuel Audit',
      uniqueFeatureBadge: 'INFRASTRUCTURE TELEMETRY',
      uniqueFeatureDesc: 'Live tracking of Komatsu/Sumitomo graders across 146 districts: operational hours, GPS geofencing against private misuse, and civil contractor blacklisting.',
      roadEquipment: [
        { unitId: 'KOM-UG-WAK-01', district: 'Wakiso District', model: 'Komatsu GD663A Motor Grader', status: 'ACTIVE', operatingHours: 1420, fuelUsedLiters: 840, gradedKilometers: 34.2, lastGpsLocation: 'Kira-Kasangati Road (0.392, 32.610)', assignedOperator: 'Eng. Kigozi Charles' },
        { unitId: 'KOM-UG-GUL-02', district: 'Gulu City', model: 'Sumitomo SH210 Hydraulic Excavator', status: 'ACTIVE', operatingHours: 1980, fuelUsedLiters: 1120, gradedKilometers: 28.5, lastGpsLocation: 'Pece-Layibi Division (2.775, 32.301)', assignedOperator: 'Eng. Okello Patrick' },
        { unitId: 'KOM-UG-MBR-03', district: 'Mbarara City', model: 'Komatsu GD663A Motor Grader', status: 'IDLE', operatingHours: 850, fuelUsedLiters: 420, gradedKilometers: 19.8, lastGpsLocation: 'Nyamitanga Works Depot (-0.613, 30.658)', assignedOperator: 'Eng. Tumusiime David' },
        { unitId: 'KOM-UG-ARU-04', district: 'Arua City', model: 'Komatsu PC200 Wheel Loader', status: 'GEOFENCE_ALERT', operatingHours: 2150, fuelUsedLiters: 1490, gradedKilometers: 12.1, lastGpsLocation: 'Outside Gazetted Zone (3.021, 30.912)', assignedOperator: 'Eng. Driwale Sam' },
        { unitId: 'KOM-UG-JIN-05', district: 'Jinja City', model: 'Sumitomo SH210 Hydraulic Excavator', status: 'ACTIVE', operatingHours: 1260, fuelUsedLiters: 710, gradedKilometers: 31.4, lastGpsLocation: 'Bugembe Access Ring (0.442, 33.241)', assignedOperator: 'Eng. Mwase Ronald' }
      ]
    },
    {
      id: 'PS-MOH',
      code: 'PS-MOH-2026',
      title: 'Ministry of Health (MoH)',
      shortTitle: 'MoH',
      permSecretary: 'Dr. Diana Atwine',
      roleTitle: 'Permanent Secretary & Health Accounting Officer',
      sector: 'HEALTH',
      country: 'UG',
      statutoryAct: 'National Health Service Delivery Act & Public Health Act (Cap 281)',
      mandate: 'National Medical Stores (NMS) Delivery Tracking, Essential Medicines Stock-Out Audit, HC III/IV Duty Rosters & Ambulance Telemetry.',
      slaScore: '93.1%',
      macroSpeedHours: 21.0,
      cabinetDeliveryIndex: 95.0,
      activeCases: 1740,
      resolvedCases: 1610,
      interAgencyCollabScore: '97%',
      risk: 'Low',
      color: 'emerald',
      icon: 'Activity',
      uniqueFeatureName: 'National Medical Stores (NMS) Stock-Out Verification & Duty Roster',
      uniqueFeatureBadge: 'MEDICINE AUDIT',
      uniqueFeatureDesc: 'Cross-verifies citizen "no medicines" complaints against official NMS delivery logs, exposing drug diversions and doctor absenteeism in real time.',
      drugAlerts: [
        { facilityName: 'Kira Health Centre IV', level: 'HC IV', district: 'Wakiso District', drugCategory: 'Artemether / Lumefantrine (Malaria)', stockStatus: 'CRITICAL_LOW', lastDeliveryBatch: 'NMS-BATCH-2026-08', citizenReportsCount: 19, investigationStatus: 'DISPATCH_IN_TRANSIT' },
        { facilityName: 'Awach Health Centre IV', level: 'HC IV', district: 'Gulu District', drugCategory: 'Mama Kits & Sterile Delivery Sets', stockStatus: 'STOCK_OUT', lastDeliveryBatch: 'NMS-BATCH-2026-07', citizenReportsCount: 28, investigationStatus: 'DIVERSION_FLAGGED' },
        { facilityName: 'Kakoba Health Centre III', level: 'HC III', district: 'Mbarara City', drugCategory: 'First-Line ARV Regimens', stockStatus: 'ADEQUATE', lastDeliveryBatch: 'NMS-BATCH-2026-09', citizenReportsCount: 3, investigationStatus: 'VERIFIED_NMS_STOCK' },
        { facilityName: 'Oli Health Centre IV', level: 'HC IV', district: 'Arua City', drugCategory: 'Broad-Spectrum Antibiotics (Amox/Clav)', stockStatus: 'CRITICAL_LOW', lastDeliveryBatch: 'NMS-BATCH-2026-08', citizenReportsCount: 14, investigationStatus: 'DISPATCH_IN_TRANSIT' },
        { facilityName: 'Budondo Health Centre IV', level: 'HC IV', district: 'Jinja District', drugCategory: 'Tetanus Toxoid & Infant Vaccines', stockStatus: 'ADEQUATE', lastDeliveryBatch: 'NMS-BATCH-2026-09', citizenReportsCount: 2, investigationStatus: 'VERIFIED_NMS_STOCK' }
      ]
    },
    {
      id: 'PS-MOES',
      code: 'PS-MOES-2026',
      title: 'Ministry of Education & Sports (MoES)',
      shortTitle: 'MoES',
      permSecretary: 'Ketty Lamaro',
      roleTitle: 'Permanent Secretary & Education Accounting Officer',
      sector: 'EDUCATION',
      country: 'UG',
      statutoryAct: 'Education (Pre-Primary, Primary and Post-Primary) Act 2008',
      mandate: 'Universal Primary & Secondary Capitation Grant Compliance, Illegal Fees Prohibitions, Dilapidated Roof Inspections & Teacher Payroll Attendance.',
      slaScore: '88.5%',
      macroSpeedHours: 31.2,
      cabinetDeliveryIndex: 88.5,
      activeCases: 940,
      resolvedCases: 821,
      interAgencyCollabScore: '92%',
      risk: 'Medium',
      color: 'indigo',
      icon: 'GraduationCap',
      uniqueFeatureName: 'Capitation Grant Verification & School Hazard Audit',
      uniqueFeatureBadge: 'EDUCATION INTEGRITY',
      uniqueFeatureDesc: 'Prevents extortion of illegal fees from UPE/USE students, tracks teacher absenteeism, and flags condemned pit latrines and structural risks.',
      schoolAudits: [
        { schoolName: 'Kasangati Muslim Primary School', district: 'Wakiso District', level: 'UPE Primary', capitationGrantDisbursed: 'UGX 18.5M', illegalFeesReported: false, hazardRisk: 'SAFE', teacherAttendanceRate: 94 },
        { schoolName: 'Pece Primary School', district: 'Gulu City', level: 'UPE Primary', capitationGrantDisbursed: 'UGX 22.1M', illegalFeesReported: true, hazardRisk: 'ROOF_CONDEMNED', teacherAttendanceRate: 72 },
        { schoolName: 'Mbarara Secondary School', district: 'Mbarara City', level: 'USE Secondary', capitationGrantDisbursed: 'UGX 44.0M', illegalFeesReported: false, hazardRisk: 'SAFE', teacherAttendanceRate: 98 },
        { schoolName: 'Arua Demonstration School', district: 'Arua City', level: 'UPE Primary', capitationGrantDisbursed: 'UGX 16.8M', illegalFeesReported: true, hazardRisk: 'SANITATION_CRITICAL', teacherAttendanceRate: 68 },
        { schoolName: 'Main Street Primary School', district: 'Jinja City', level: 'UPE Primary', capitationGrantDisbursed: 'UGX 26.4M', illegalFeesReported: false, hazardRisk: 'SAFE', teacherAttendanceRate: 91 }
      ]
    },
    {
      id: 'PS-MOWE',
      code: 'PS-MOWE-2026',
      title: 'Ministry of Water & Environment (MoWE)',
      shortTitle: 'MoWE',
      permSecretary: 'Alfred Okot Okidi',
      roleTitle: 'Permanent Secretary & Environment Accounting Officer',
      sector: 'WATER_ENVIRONMENT',
      country: 'UG',
      statutoryAct: 'National Water Act (Cap 152) & National Environment Act (2019)',
      mandate: 'Rural Borehole Repair Telemetry, Urban Water Supply Outages (NWSC), Wetland Encroachment Enforcement & Solar Irrigation Schemes.',
      slaScore: '86.4%',
      macroSpeedHours: 34.1,
      cabinetDeliveryIndex: 86.4,
      activeCases: 680,
      resolvedCases: 582,
      interAgencyCollabScore: '91%',
      risk: 'Medium',
      color: 'cyan',
      icon: 'Droplets',
      uniqueFeatureName: 'Rural Borehole Telemetry & Wetland Encroachment Radar',
      uniqueFeatureBadge: 'WATER COVERAGE',
      uniqueFeatureDesc: 'Tracks broken rural water points with live mechanic dispatches and triggers rapid Environmental Police interventions on illegal wetland backfilling.',
      boreholeTelemetry: [
        { pointId: 'BH-WAK-391', subCounty: 'Kasangati SC', district: 'Wakiso District', waterType: 'Deep Motorized Solar Borehole', status: 'FUNCTIONAL', daysDowntime: 0, mechanicDispatched: false, beneficiaryHouseholds: 420 },
        { pointId: 'BH-GUL-104', subCounty: 'Bungatira SC', district: 'Gulu District', waterType: 'India Mark II Handpump', status: 'PUMP_BROKEN', daysDowntime: 14, mechanicDispatched: true, beneficiaryHouseholds: 280 },
        { pointId: 'BH-MBR-882', subCounty: 'Kagongi SC', district: 'Mbarara District', waterType: 'Gravity Flow Scheme Tap', status: 'FUNCTIONAL', daysDowntime: 0, mechanicDispatched: false, beneficiaryHouseholds: 650 },
        { pointId: 'BH-ARU-402', subCounty: 'Dadamu SC', district: 'Arua District', waterType: 'U2 Handpump', status: 'PUMP_BROKEN', daysDowntime: 21, mechanicDispatched: true, beneficiaryHouseholds: 310 },
        { pointId: 'BH-JIN-519', subCounty: 'Busedde SC', district: 'Jinja District', waterType: 'Solar Powered Kiosk', status: 'FUNCTIONAL', daysDowntime: 0, mechanicDispatched: false, beneficiaryHouseholds: 590 }
      ]
    },
    {
      id: 'PS-MOICT',
      code: 'PS-MOICT-2026',
      title: 'Ministry of ICT & National Guidance',
      shortTitle: 'MoICT',
      permSecretary: 'Dr. Aminah Zawedde',
      roleTitle: 'Permanent Secretary & Digital Economy Accounting Officer',
      sector: 'ICT_DIGITAL',
      country: 'UG',
      statutoryAct: 'National Information Technology Authority Act (NITA-U) & UCC Act',
      mandate: 'National USSD Gateway (*3030#), Sovereign Broadband, Citizen Verification API (NIRA) & Data Protection Integrity.',
      slaScore: '97.8%',
      macroSpeedHours: 14.8,
      cabinetDeliveryIndex: 97.8,
      activeCases: 410,
      resolvedCases: 394,
      interAgencyCollabScore: '99%',
      risk: 'Low',
      color: 'teal',
      icon: 'Radio',
      uniqueFeatureName: 'National USSD (*3030#) & Digital Carrier Gateway Telemetry',
      uniqueFeatureBadge: 'DIGITAL SOVEREIGNTY',
      uniqueFeatureDesc: 'Monitors real-time carrier uptime, SMS delivery rates, and latency across telecom operators to ensure all non-smartphone citizens can report offline.',
      ussdGateways: [
        { carrier: 'MTN Uganda USSD Gateway', gatewayCode: '*3030# Line 1', uptimePercent: 99.98, avgLatencyMs: 42, throughputPerMin: 1840, status: 'OPTIMAL' },
        { carrier: 'Airtel Uganda USSD Gateway', gatewayCode: '*3030# Line 2', uptimePercent: 99.94, avgLatencyMs: 48, throughputPerMin: 1610, status: 'OPTIMAL' },
        { carrier: 'NITA-U Sovereign Backbone (NBI)', gatewayCode: 'e-Gov Fiber Trunk', uptimePercent: 99.99, avgLatencyMs: 12, throughputPerMin: 9800, status: 'OPTIMAL' },
        { carrier: 'SMS Aggregator Trunk Alpha', gatewayCode: 'Shortcode 6090', uptimePercent: 99.40, avgLatencyMs: 120, throughputPerMin: 850, status: 'OPTIMAL' }
      ]
    },
    {
      id: 'PS-OPM',
      code: 'PS-OPM-2026',
      title: 'Office of the Prime Minister (OPM)',
      shortTitle: 'OPM',
      permSecretary: 'Dunstan Balaba',
      roleTitle: 'Permanent Secretary & Cabinet Delivery Coordinator',
      sector: 'CABINET_DELIVERY',
      country: 'UG',
      statutoryAct: 'Article 108A Constitution of Uganda & Government Delivery Unit',
      mandate: 'National Government Performance, Cabinet Delivery Monitoring, 48-Hour Inter-Agency Deadlock Resolution & Disaster Relief Coordination.',
      slaScore: '92.4%',
      macroSpeedHours: 26.8,
      cabinetDeliveryIndex: 92.0,
      activeCases: 890,
      resolvedCases: 796,
      interAgencyCollabScore: '96%',
      risk: 'Low',
      color: 'slate',
      icon: 'ShieldCheck',
      uniqueFeatureName: 'Cabinet Delivery League Table & Cross-Ministry Query Desk',
      uniqueFeatureBadge: 'CABINET BENCHMARK',
      uniqueFeatureDesc: 'Aggregates national delivery metrics across all ministries for direct Cabinet reporting and breaks inter-agency gridlocks with statutory 48h directives.',
      cabinetDelivery: [
        { ministryName: 'Ministry of ICT & National Guidance', psName: 'Dr. Aminah Zawedde', deliveryIndex: 97.8, slaAdherence: 96.0, interAgencySync: 99, pendingInquiries: 2, statutoryRank: 1 },
        { ministryName: 'Ministry of Finance (MoFPED)', psName: 'Ramathan Ggoobi', deliveryIndex: 96.5, slaAdherence: 94.1, interAgencySync: 99, pendingInquiries: 3, statutoryRank: 2 },
        { ministryName: 'Ministry of Health (MoH)', psName: 'Dr. Diana Atwine', deliveryIndex: 95.0, slaAdherence: 92.5, interAgencySync: 97, pendingInquiries: 4, statutoryRank: 3 },
        { ministryName: 'Ministry of Local Government (MoLG)', psName: 'Ben Kumumanya', deliveryIndex: 94.2, slaAdherence: 91.2, interAgencySync: 98, pendingInquiries: 5, statutoryRank: 4 },
        { ministryName: 'Ministry of Works & Transport (MoWT)', psName: 'Bageya Waiswa', deliveryIndex: 89.2, slaAdherence: 88.0, interAgencySync: 94, pendingInquiries: 8, statutoryRank: 5 },
        { ministryName: 'Ministry of Education & Sports (MoES)', psName: 'Ketty Lamaro', deliveryIndex: 88.5, slaAdherence: 87.3, interAgencySync: 92, pendingInquiries: 9, statutoryRank: 6 },
        { ministryName: 'Ministry of Water & Environment (MoWE)', psName: 'Alfred Okot Okidi', deliveryIndex: 86.4, slaAdherence: 85.6, interAgencySync: 91, pendingInquiries: 11, statutoryRank: 7 }
      ]
    }
  ],

  KE: [
    {
      id: 'PS-KE-INTERIOR',
      code: 'PS-KE-INTERIOR-2026',
      title: 'State Dept for Internal Security & National Administration',
      shortTitle: 'Interior & Devolution',
      permSecretary: 'Dr. Raymond Omollo',
      roleTitle: 'Principal Secretary & Devolution Superadmin',
      sector: 'GOVERNANCE',
      country: 'KE',
      statutoryAct: 'County Governments Act (2012) & Intergovernmental Relations Act',
      mandate: 'Devolution Command, 47 County Governments, 290 Sub-Counties, 1,450 Wards & National Police Service Coordination.',
      slaScore: '92.6%',
      macroSpeedHours: 25.1,
      cabinetDeliveryIndex: 93.8,
      activeCases: 1980,
      resolvedCases: 1810,
      interAgencyCollabScore: '97%',
      risk: 'Low',
      color: 'emerald',
      icon: 'Building2',
      isSuperadmin: true,
      uniqueFeatureName: 'County Devolution Hierarchy & Ward Administrator Roster',
      uniqueFeatureBadge: 'DEVOLUTION SUPERADMIN',
      uniqueFeatureDesc: 'Coordinates 47 County Executive Committee Members (CECMs), Sub-County Admins and 1,450 Ward Administrators with statutory performance circulars.'
    },
    {
      id: 'PS-KE-TREASURY',
      code: 'PS-KE-TREASURY-2026',
      title: 'National Treasury & Economic Planning',
      shortTitle: 'National Treasury',
      permSecretary: 'Dr. Chris Kiptoo',
      roleTitle: 'Principal Secretary National Treasury',
      sector: 'FISCAL',
      country: 'KE',
      statutoryAct: 'Public Finance Management Act (PFM 2012) & County Allocation of Revenue Act (CARA)',
      mandate: 'County Equitable Revenue Share Releases, Own-Source Revenue (OSR) Automation, IFMIS Telemetry & Hustler Fund Sacco Monitoring.',
      slaScore: '94.0%',
      macroSpeedHours: 20.4,
      cabinetDeliveryIndex: 95.8,
      activeCases: 710,
      resolvedCases: 672,
      interAgencyCollabScore: '98%',
      risk: 'Low',
      color: 'amber',
      icon: 'Landmark',
      uniqueFeatureName: 'Equitable Share Disbursal & County IFMIS Spend Auditor',
      uniqueFeatureBadge: 'FISCAL ALLOCATION',
      uniqueFeatureDesc: 'Tracks monthly exchequer releases to the 47 County Revenue Funds (CRF) and enforces prompt payment of verified pending bills to local youth/women suppliers.'
    },
    {
      id: 'PS-KE-ROADS',
      code: 'PS-KE-ROADS-2026',
      title: 'State Dept for Roads & Transport',
      shortTitle: 'Roads & Transport',
      permSecretary: 'Eng. Joseph Mbugua',
      roleTitle: 'Principal Secretary Roads',
      sector: 'INFRASTRUCTURE',
      country: 'KE',
      statutoryAct: 'Kenya Roads Act (KeNHA, KeRRA, KURA Oversight)',
      mandate: 'KeRRA Rural Access Roads, KURA Urban Drainage, Highway Bridges & Verified Road Maintenance Contractor Registry.',
      slaScore: '87.9%',
      macroSpeedHours: 32.0,
      cabinetDeliveryIndex: 88.4,
      activeCases: 1420,
      resolvedCases: 1240,
      interAgencyCollabScore: '93%',
      risk: 'Medium',
      color: 'rose',
      icon: 'Truck',
      uniqueFeatureName: 'KeRRA & KURA Pothole Telemetry & Contractor Audit',
      uniqueFeatureBadge: 'ROAD NETWORK',
      uniqueFeatureDesc: 'Direct citizen linkage to the 290 Constituency Roads Committees with contractor performance bond penalties for delayed repairs.'
    },
    {
      id: 'PS-KE-HEALTH',
      code: 'PS-KE-HEALTH-2026',
      title: 'State Dept for Public Health & Professional Standards',
      shortTitle: 'Public Health',
      permSecretary: 'Mary Muthoni',
      roleTitle: 'Principal Secretary Public Health',
      sector: 'HEALTH',
      country: 'KE',
      statutoryAct: 'Social Health Insurance Act (SHIF/SHA) & KEMSA Oversight Act',
      mandate: 'Social Health Authority (SHA) Clinic Verification, KEMSA County Drug Supplies, Community Health Promoters (CHP) Kit Telemetry & Level 4/5 Referral Hospital Audits.',
      slaScore: '91.8%',
      macroSpeedHours: 23.5,
      cabinetDeliveryIndex: 93.2,
      activeCases: 1650,
      resolvedCases: 1520,
      interAgencyCollabScore: '96%',
      risk: 'Low',
      color: 'emerald',
      icon: 'Activity',
      uniqueFeatureName: 'KEMSA Drug Delivery Telemetry & CHP Smartphone Network',
      uniqueFeatureBadge: 'HEALTH LOGISTICS',
      uniqueFeatureDesc: 'Live tracking of medical supplies to 47 county depots and performance telemetry of 100,000 Community Health Promoters.'
    },
    {
      id: 'PS-KE-EDU',
      code: 'PS-KE-EDU-2026',
      title: 'State Dept for Basic Education',
      shortTitle: 'Basic Education',
      permSecretary: 'Dr. Belio Kipsang',
      roleTitle: 'Principal Secretary Basic Education',
      sector: 'EDUCATION',
      country: 'KE',
      statutoryAct: 'Basic Education Act (2013) & CBC Framework Directives',
      mandate: 'Competency-Based Curriculum (CBC) Junior Secondary Infrastructure, Free Day Secondary Education (FDSE) Capitation & TSC Teacher Attendance.',
      slaScore: '89.4%',
      macroSpeedHours: 29.8,
      cabinetDeliveryIndex: 90.1,
      activeCases: 880,
      resolvedCases: 789,
      interAgencyCollabScore: '93%',
      risk: 'Low',
      color: 'indigo',
      icon: 'GraduationCap',
      uniqueFeatureName: 'Junior Secondary CBC Infrastructure & Capitation Audit',
      uniqueFeatureBadge: 'CAPITATION DESK',
      uniqueFeatureDesc: 'Tracks student per-capita exchequer transfers and prevents unauthorized secondary school fee increments.'
    },
    {
      id: 'PS-KE-WATER',
      code: 'PS-KE-WATER-2026',
      title: 'State Dept for Water & Sanitation',
      shortTitle: 'Water & Sanitation',
      permSecretary: 'Dr. Julius Korir',
      roleTitle: 'Principal Secretary Water',
      sector: 'WATER_ENVIRONMENT',
      country: 'KE',
      statutoryAct: 'Water Act (2016) & WASREB Regulatory Directives',
      mandate: 'Last-Mile Water Connections, Rural Water Kiosks, Borehole Desalination Units & County Water Service Provider (WSP) Tariffs.',
      slaScore: '88.1%',
      macroSpeedHours: 33.2,
      cabinetDeliveryIndex: 87.9,
      activeCases: 930,
      resolvedCases: 819,
      interAgencyCollabScore: '92%',
      risk: 'Medium',
      color: 'cyan',
      icon: 'Droplets',
      uniqueFeatureName: 'Rural Water Kiosks & Borehole Desalination Telemetry',
      uniqueFeatureBadge: 'WATER GRIDS',
      uniqueFeatureDesc: 'Monitors uptime across County Water Services Providers and dispatches rapid technical teams for drought-zone borehole breakdowns.'
    },
    {
      id: 'PS-KE-ICT',
      code: 'PS-KE-ICT-2026',
      title: 'State Dept for ICT & Digital Economy',
      shortTitle: 'ICT & Digital Economy',
      permSecretary: 'Eng. John Tanui',
      roleTitle: 'Principal Secretary ICT',
      sector: 'ICT_DIGITAL',
      country: 'KE',
      statutoryAct: 'Kenya Information and Communications Act (KICA) & Data Protection Act 2019',
      mandate: 'e-Citizen Government Portal Uptime, National Fiber Optic Backbone (NOFBI), Digital Hubs in 1,450 Wards & USSD Citizen Access.',
      slaScore: '97.2%',
      macroSpeedHours: 15.2,
      cabinetDeliveryIndex: 96.9,
      activeCases: 520,
      resolvedCases: 508,
      interAgencyCollabScore: '99%',
      risk: 'Low',
      color: 'teal',
      icon: 'Radio',
      uniqueFeatureName: 'e-Citizen Gateway & Ward Digital Hub Performance',
      uniqueFeatureBadge: 'DIGITAL INFRASTRUCTURE',
      uniqueFeatureDesc: 'Continuous telemetry on e-Citizen transactional APIs, NOFBI county fiber uptime, and rural Ward digital innovation hubs.'
    },
    {
      id: 'PS-KE-OP',
      code: 'PS-KE-OP-2026',
      title: 'Executive Office of the President / Cabinet Delivery Unit',
      shortTitle: 'Cabinet Affairs & Head of Public Service',
      permSecretary: 'Felix Koskei',
      roleTitle: 'Chief of Staff & Head of the Public Service',
      sector: 'CABINET_DELIVERY',
      country: 'KE',
      statutoryAct: 'National Government Coordination Act (2013)',
      mandate: 'Presidential Delivery Unit (PDU) Oversight, Cross-Ministry Performance Contracts & Anti-Corruption Inquiries.',
      slaScore: '93.5%',
      macroSpeedHours: 24.0,
      cabinetDeliveryIndex: 94.6,
      activeCases: 760,
      resolvedCases: 712,
      interAgencyCollabScore: '97%',
      risk: 'Low',
      color: 'slate',
      icon: 'ShieldCheck',
      uniqueFeatureName: 'Presidential Delivery Unit (PDU) Performance Contracts',
      uniqueFeatureBadge: 'EXECUTIVE SCORECARD',
      uniqueFeatureDesc: 'Evaluates statutory performance contracts for all Cabinet Secretaries and Principal Secretaries with automatic public delivery rankings.'
    }
  ]
};

/**
 * Universal dynamic fallback generator for any of the 100+ countries.
 * Automatically synthesizes the 8 standard sovereign portfolios using that country's
 * national arrangements, legal framework, and governance vocabulary.
 */
export function getMinistriesForCountry(countryCode: string): MinistryProfile[] {
  const code = (countryCode || 'UG').toUpperCase();
  
  if (BESPOKE_MINISTRIES[code]) {
    return BESPOKE_MINISTRIES[code];
  }

  const countryInfo = COUNTRIES[code];
  const countryName = countryInfo?.name || code;
  const rollout = getNationalRolloutArrangements(code);

  const superadminTitle = rollout.superadminTitle || `${countryName} National Superadmin`;
  const superadminMinistry = rollout.superadminMinistry || `${countryName} Ministry of Local Governance & Territorial Administration`;
  const superadminCode = `PS-${code}-SUPERADMIN-2026`;

  return [
    {
      id: `PS-${code}-SUPERADMIN`,
      code: superadminCode,
      title: superadminMinistry,
      shortTitle: 'Local Governance',
      permSecretary: `Statutory Head of Local Government (${code})`,
      roleTitle: superadminTitle,
      sector: 'GOVERNANCE',
      country: code as CountryCode,
      statutoryAct: `${countryName} Local Government & Decentralized Administration Act`,
      mandate: `Territorial Rollout Command, ${rollout.tiersDescription}, Batch Minting of statutory accounting codes & Cadre Supervision.`,
      slaScore: '92.5%',
      macroSpeedHours: 25.0,
      cabinetDeliveryIndex: 93.0,
      activeCases: 850,
      resolvedCases: 780,
      interAgencyCollabScore: '97%',
      risk: 'Low',
      color: 'emerald',
      icon: 'Building2',
      isSuperadmin: true,
      uniqueFeatureName: 'Territorial Administrative Hierarchy & Batch Key Minting',
      uniqueFeatureBadge: 'TERRITORIAL SUPERADMIN',
      uniqueFeatureDesc: `Direct administrative authority across ${rollout.primaryUnitName} and regional governments with statutory circular broadcasts.`
    },
    {
      id: `PS-${code}-FINANCE`,
      code: `PS-${code}-FINANCE-2026`,
      title: `${countryName} Ministry of Finance & National Treasury`,
      shortTitle: 'Finance & Treasury',
      permSecretary: `Secretary to the Treasury (${code})`,
      roleTitle: 'Permanent Secretary / Director-General of Treasury',
      sector: 'FISCAL',
      country: code as CountryCode,
      statutoryAct: `${countryName} Public Finance & Fiscal Responsibility Act`,
      mandate: 'National Budget Disbursals, Local Revenue Mobilization, Equalization Grants & Capital Expenditure Verification.',
      slaScore: '94.2%',
      macroSpeedHours: 20.1,
      cabinetDeliveryIndex: 95.5,
      activeCases: 510,
      resolvedCases: 485,
      interAgencyCollabScore: '98%',
      risk: 'Low',
      color: 'amber',
      icon: 'Landmark',
      uniqueFeatureName: 'Fiscal Grant Release Telemetry & Budget Sanction Controls',
      uniqueFeatureBadge: 'FISCAL RELEASES',
      uniqueFeatureDesc: 'Correlates citizen service backlogs with unspent municipal treasury balances and executes statutory payment holds on non-performing accounts.'
    },
    {
      id: `PS-${code}-WORKS`,
      code: `PS-${code}-WORKS-2026`,
      title: `${countryName} Ministry of Public Works, Transport & Infrastructure`,
      shortTitle: 'Works & Infrastructure',
      permSecretary: `Director of Public Works (${code})`,
      roleTitle: 'Permanent Secretary Works & Transport',
      sector: 'INFRASTRUCTURE',
      country: code as CountryCode,
      statutoryAct: `${countryName} National Highways & Civil Infrastructure Code`,
      mandate: 'Public Road Network Telemetry, Heavy Maintenance Equipment Tracking, Bridge Safety & Contractor Milestone Verification.',
      slaScore: '87.5%',
      macroSpeedHours: 32.5,
      cabinetDeliveryIndex: 88.0,
      activeCases: 820,
      resolvedCases: 715,
      interAgencyCollabScore: '92%',
      risk: 'Medium',
      color: 'rose',
      icon: 'Truck',
      uniqueFeatureName: 'Civil Equipment Telemetry & Contractor Blacklist Registry',
      uniqueFeatureBadge: 'WORKS TELEMETRY',
      uniqueFeatureDesc: 'Monitors public heavy machinery operating hours, GPS geofencing, and grades road maintenance contractors by resolution turnaround.'
    },
    {
      id: `PS-${code}-HEALTH`,
      code: `PS-${code}-HEALTH-2026`,
      title: `${countryName} Ministry of Public Health & Sanitation`,
      shortTitle: 'Public Health',
      permSecretary: `Director-General of Health Services (${code})`,
      roleTitle: 'Permanent Secretary Health',
      sector: 'HEALTH',
      country: code as CountryCode,
      statutoryAct: `${countryName} Public Health Act & Medical Supplies Framework`,
      mandate: 'Hospital & Primary Clinic Network, Essential Medicines Delivery, Medical Staff Attendance & Emergency Ambulance Dispatch.',
      slaScore: '92.1%',
      macroSpeedHours: 22.0,
      cabinetDeliveryIndex: 94.0,
      activeCases: 990,
      resolvedCases: 915,
      interAgencyCollabScore: '96%',
      risk: 'Low',
      color: 'emerald',
      icon: 'Activity',
      uniqueFeatureName: 'Essential Medicines Stock-Out Audit & Facility Roster',
      uniqueFeatureBadge: 'HEALTHCARE AUDIT',
      uniqueFeatureDesc: 'Triages citizen drug stock-out alerts against central medical warehouse consignments and verifies health worker duty presence.'
    },
    {
      id: `PS-${code}-EDUCATION`,
      code: `PS-${code}-EDUCATION-2026`,
      title: `${countryName} Ministry of Education, Youth & Sports`,
      shortTitle: 'Education',
      permSecretary: `Secretary for Education (${code})`,
      roleTitle: 'Permanent Secretary Education',
      sector: 'EDUCATION',
      country: code as CountryCode,
      statutoryAct: `${countryName} National Education & School Standards Act`,
      mandate: 'Public Primary & Secondary Schools, Per-Pupil Capitation Verification, Teacher Attendance & Classroom Structural Safety.',
      slaScore: '89.0%',
      macroSpeedHours: 30.0,
      cabinetDeliveryIndex: 89.5,
      activeCases: 640,
      resolvedCases: 570,
      interAgencyCollabScore: '93%',
      risk: 'Low',
      color: 'indigo',
      icon: 'GraduationCap',
      uniqueFeatureName: 'School Capitation Verification & Structural Hazard Telemetry',
      uniqueFeatureBadge: 'SCHOOL SAFETY',
      uniqueFeatureDesc: 'Enforces free education guidelines against unauthorized parent levies and audits school building safety.'
    },
    {
      id: `PS-${code}-WATER`,
      code: `PS-${code}-WATER-2026`,
      title: `${countryName} Ministry of Water Resources, Environment & Sanitation`,
      shortTitle: 'Water & Environment',
      permSecretary: `Director of Water Resources (${code})`,
      roleTitle: 'Permanent Secretary Water & Natural Resources',
      sector: 'WATER_ENVIRONMENT',
      country: code as CountryCode,
      statutoryAct: `${countryName} Water Resources & Environmental Protection Act`,
      mandate: 'Safe Drinking Water Coverage, Rural Water Point Telemetry, Urban Utility Pipelines & Protected Basin Enforcement.',
      slaScore: '87.0%',
      macroSpeedHours: 34.0,
      cabinetDeliveryIndex: 87.2,
      activeCases: 580,
      resolvedCases: 505,
      interAgencyCollabScore: '91%',
      risk: 'Medium',
      color: 'cyan',
      icon: 'Droplets',
      uniqueFeatureName: 'Water Point Downtime Telemetry & Watershed Protection',
      uniqueFeatureBadge: 'WATER COVERAGE',
      uniqueFeatureDesc: 'Real-time telemetry on rural boreholes and urban pipe pressure with automatic alerts for ecological contamination.'
    },
    {
      id: `PS-${code}-ICT`,
      code: `PS-${code}-ICT-2026`,
      title: `${countryName} Ministry of Digital Economy, Communications & Technology`,
      shortTitle: 'Digital Communications',
      permSecretary: `Director of Telecommunications & Digital Services (${code})`,
      roleTitle: 'Permanent Secretary Digital Economy',
      sector: 'ICT_DIGITAL',
      country: code as CountryCode,
      statutoryAct: `${countryName} Electronic Communications & Sovereign Data Privacy Act`,
      mandate: 'National USSD / SMS Offline Gateway (*3030#), Citizen Digital Verification, Sovereign Cloud Infrastructure & Carrier Uptime.',
      slaScore: '96.5%',
      macroSpeedHours: 16.0,
      cabinetDeliveryIndex: 96.8,
      activeCases: 380,
      resolvedCases: 367,
      interAgencyCollabScore: '98%',
      risk: 'Low',
      color: 'teal',
      icon: 'Radio',
      uniqueFeatureName: 'Offline USSD Gateway & National Telecom Carrier Telemetry',
      uniqueFeatureBadge: 'DIGITAL CONNECTIVITY',
      uniqueFeatureDesc: 'Monitors telecom carrier SMS/USSD pipelines to guarantee instant mobile access for citizens in low-bandwidth regions.'
    },
    {
      id: `PS-${code}-CABINET`,
      code: `PS-${code}-CABINET-2026`,
      title: `${countryName} Cabinet Office / Prime Minister Delivery Unit`,
      shortTitle: 'Cabinet Coordination',
      permSecretary: `Secretary to the Cabinet (${code})`,
      roleTitle: 'Cabinet Secretary & Head of Public Service',
      sector: 'CABINET_DELIVERY',
      country: code as CountryCode,
      statutoryAct: `${countryName} Executive Government Coordination Act`,
      mandate: 'Inter-Ministerial Scorecard, Cabinet Delivery Benchmarking, Statutory Cross-Ministry Queries & National Emergency Response.',
      slaScore: '93.0%',
      macroSpeedHours: 25.5,
      cabinetDeliveryIndex: 93.5,
      activeCases: 610,
      resolvedCases: 570,
      interAgencyCollabScore: '96%',
      risk: 'Low',
      color: 'slate',
      icon: 'ShieldCheck',
      uniqueFeatureName: 'National Cabinet Delivery League Table & Cross-Agency Queries',
      uniqueFeatureBadge: 'CABINET LEAGUE TABLE',
      uniqueFeatureDesc: 'Statutory performance league table ranking all ministries on citizen issue resolution speed and Cabinet commitments.'
    }
  ];
}
