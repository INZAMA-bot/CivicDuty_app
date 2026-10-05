import { CountryCode } from '../types';
import { getNationalRolloutArrangements } from './tiers';
import { COUNTRIES } from './countries';

export interface RolloutNodeChief {
  name: string;
  ward: string;
  status: string;
  ussdActive?: boolean;
  phone?: string;
  staffCount?: number;
}

export interface RolloutNodeStaff {
  id: string;
  name: string;
  role: string;
  village: string;
  phone: string;
  status: 'Active' | 'On Duty' | 'Standby' | 'Alerted';
}

export interface RolloutDistrictNode {
  id: string;
  name: string;
  region: string;
  cao: string;
  activeNodes: string;
  status: string;
  rollDate: string;
  sla: string;
  pdmParishes: number;
  risk: 'Low' | 'Medium' | 'High';
  uptime: string;
  avgResponseHours: number;
  casesLogged: number;
  casesResolved: number;
  csatScore: number;
  ddegCompliance: string;
  pdmSaccoClearance: string;
  redSignals: number;
  amberSignals: number;
  greenSignals: number;
  subCounties: string[];
  chiefsRoster: RolloutNodeChief[];
  staffRoster?: RolloutNodeStaff[];
  isCity?: boolean;
  stationType?: 'city' | 'district';
}

import { UG_TIER3_ACCOUNTING_OFFICERS, UG_CITIES_LIST, UG_DISTRICTS_LIST } from './ugandaDistrictsAndCities';
export { UG_CITIES_LIST, UG_DISTRICTS_LIST };

export const UG_DISTRICTS: RolloutDistrictNode[] = UG_TIER3_ACCOUNTING_OFFICERS;

export const KE_DISTRICTS: RolloutDistrictNode[] = [
  {
    id: 'KE-CG-NBI',
    name: 'Nairobi City County Government',
    region: 'CENTRAL',
    cao: 'Patrick Analo (County Secretary & Head of Public Service)',
    activeNodes: '85/85 Wards',
    status: 'Active Live',
    rollDate: 'January 2026',
    sla: '92.4%',
    pdmParishes: 85,
    risk: 'Low',
    uptime: '99.8%',
    avgResponseHours: 20.2,
    casesLogged: 2150,
    casesResolved: 1986,
    csatScore: 4.7,
    ddegCompliance: '100% Devolved Compliant',
    pdmSaccoClearance: '96.8%',
    redSignals: 24,
    amberSignals: 140,
    greenSignals: 1986,
    subCounties: ['Westlands Sub-County', 'Starehe Sub-County', 'Dagoretti North', 'Langata Sub-County', 'Kasarani Sub-County'],
    chiefsRoster: [
      { name: 'Kamau Joseph', ward: 'Kilimani Ward Desk', status: 'Online · Live Sync', ussdActive: true, staffCount: 6 },
      { name: 'Otieno Mercy', ward: 'Parklands Ward Desk', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
      { name: 'Mwangi Kevin', ward: 'Roysambu Ward Desk', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ],
    staffRoster: [
      { id: 'st-ke-1', name: 'Wanjiku Mary', role: 'Ward Civic Field Officer', village: 'Kilimani North', phone: '+254 712 345678', status: 'Active' },
      { id: 'st-ke-2', name: 'Kiprono Eric', role: 'Agriculture & Extension Worker', village: 'Kasarani Zone 4', phone: '+254 723 456789', status: 'On Duty' },
      { id: 'st-ke-3', name: 'Adhiambo Cynthia', role: 'Community Health Promoter Lead', village: 'Langata Highrise', phone: '+254 734 567890', status: 'Active' },
    ]
  },
  {
    id: 'KE-CG-MSA',
    name: 'Mombasa County Government',
    region: 'COASTAL',
    cao: 'Jeizan Faruk (County Secretary)',
    activeNodes: '30/30 Wards',
    status: 'Active Live',
    rollDate: 'February 2026',
    sla: '90.8%',
    pdmParishes: 30,
    risk: 'Low',
    uptime: '99.5%',
    avgResponseHours: 22.1,
    casesLogged: 840,
    casesResolved: 763,
    csatScore: 4.6,
    ddegCompliance: '98.5% Compliant',
    pdmSaccoClearance: '95.1%',
    redSignals: 16,
    amberSignals: 61,
    greenSignals: 763,
    subCounties: ['Mvita Sub-County', 'Nyali Sub-County', 'Kisauni Sub-County', 'Likoni Sub-County'],
    chiefsRoster: [
      { name: 'Ali Hassan', ward: 'Old Town Mvita Ward', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
      { name: 'Mwanaidi Omar', ward: 'Kongowea Ward', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
    ]
  },
  {
    id: 'KE-CG-KSM',
    name: 'Kisumu County Government',
    region: 'WESTERN',
    cao: 'Hesbon Hongo (County Secretary)',
    activeNodes: '35/35 Wards',
    status: 'Active Live',
    rollDate: 'March 2026',
    sla: '91.5%',
    pdmParishes: 35,
    risk: 'Low',
    uptime: '99.6%',
    avgResponseHours: 21.0,
    casesLogged: 760,
    casesResolved: 695,
    csatScore: 4.8,
    ddegCompliance: '99.0% Compliant',
    pdmSaccoClearance: '94.5%',
    redSignals: 11,
    amberSignals: 54,
    greenSignals: 695,
    subCounties: ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Seme Sub-County'],
    chiefsRoster: [
      { name: 'Omondi George', ward: 'Kenyatta Sports Ward', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
      { name: 'Achieng Lilian', ward: 'Milimani Ward', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ]
  },
  {
    id: 'KE-CG-NKR',
    name: 'Nakuru County Government',
    region: 'RIFT VALLEY',
    cao: 'Samuel Mwaura (County Secretary)',
    activeNodes: '55/55 Wards',
    status: 'Active Live',
    rollDate: 'March 2026',
    sla: '89.2%',
    pdmParishes: 55,
    risk: 'Low',
    uptime: '99.2%',
    avgResponseHours: 24.5,
    casesLogged: 920,
    casesResolved: 821,
    csatScore: 4.5,
    ddegCompliance: '97.2% Compliant',
    pdmSaccoClearance: '93.2%',
    redSignals: 21,
    amberSignals: 78,
    greenSignals: 821,
    subCounties: ['Nakuru Town East', 'Nakuru Town West', 'Naivasha Sub-County', 'Molo Sub-County'],
    chiefsRoster: [
      { name: 'Chebet Faith', ward: 'Biashara Ward', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
      { name: 'Njoroge Daniel', ward: 'Kivumbini Ward', status: 'Online · Live Sync', ussdActive: true, staffCount: 3 },
    ]
  }
];

export const DE_DISTRICTS: RolloutDistrictNode[] = [
  {
    id: 'DE-BE-MIT',
    name: 'Bezirksamt Berlin Mitte (Land Berlin)',
    region: 'OST',
    cao: 'Stefanie Remlinger (Bezirksbürgermeisterin)',
    activeNodes: '10/10 Ortslagen',
    status: 'Active Live',
    rollDate: 'Januar 2026',
    sla: '96.4%',
    pdmParishes: 10,
    risk: 'Low',
    uptime: '99.9%',
    avgResponseHours: 14.2,
    casesLogged: 1840,
    casesResolved: 1774,
    csatScore: 4.9,
    ddegCompliance: '100% OZG-2.0 Konform',
    pdmSaccoClearance: '99.1%',
    redSignals: 8,
    amberSignals: 58,
    greenSignals: 1774,
    subCounties: ['Ortsteil Mitte', 'Ortsteil Moabit', 'Ortsteil Wedding', 'Ortsteil Gesundbrunnen', 'Ortsteil Tiergarten'],
    chiefsRoster: [
      { name: 'Klaus Lindemann', ward: 'Bürgeramt Mitte Rathaus', status: 'Online · Live Sync', ussdActive: true, staffCount: 7 },
      { name: 'Heike Schneider', ward: 'Bürgeramt Moabit West', status: 'Online · Live Sync', ussdActive: true, staffCount: 6 },
    ],
    staffRoster: [
      { id: 'st-de-1', name: 'Felix Weber', role: 'Bürgeramt Sachbearbeiter (OZG)', village: 'Bezirk Mitte I', phone: '+49 30 901820', status: 'Active' },
      { id: 'st-de-2', name: 'Julia Becker', role: 'Ordnungsamt Außendienst Leitung', village: 'Moabit Kiez', phone: '+49 30 901830', status: 'On Duty' },
      { id: 'st-de-3', name: 'Markus Braun', role: 'Sozialraum & Nachbarschaftskoordination', village: 'Gesundbrunnen Süd', phone: '+49 30 901840', status: 'Active' },
    ]
  },
  {
    id: 'DE-BY-MUC',
    name: 'Landratsamt München (Freistaat Bayern)',
    region: 'SÜD',
    cao: 'Christoph Göbel (Landrat)',
    activeNodes: '29/29 Gemeinden',
    status: 'Active Live',
    rollDate: 'Februar 2026',
    sla: '95.8%',
    pdmParishes: 29,
    risk: 'Low',
    uptime: '99.9%',
    avgResponseHours: 15.6,
    casesLogged: 1420,
    casesResolved: 1360,
    csatScore: 4.8,
    ddegCompliance: '100% BayDiG Konform',
    pdmSaccoClearance: '98.5%',
    redSignals: 12,
    amberSignals: 48,
    greenSignals: 1360,
    subCounties: ['Garching b. München', 'Haar', 'Unterhaching', 'Grünwald', 'Ismaning', 'Planegg'],
    chiefsRoster: [
      { name: 'Dr. Michael Huber', ward: 'Rathaus Garching', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
      { name: 'Monika Wagner', ward: 'Gemeindeamt Haar', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ]
  },
  {
    id: 'DE-NW-KOL',
    name: 'Stadtverwaltung Köln (Nordrhein-Westfalen)',
    region: 'WEST',
    cao: 'Henriette Reker (Oberbürgermeisterin)',
    activeNodes: '86/86 Stadtteile',
    status: 'Active Live',
    rollDate: 'März 2026',
    sla: '93.2%',
    pdmParishes: 86,
    risk: 'Low',
    uptime: '99.7%',
    avgResponseHours: 18.0,
    casesLogged: 2200,
    casesResolved: 2050,
    csatScore: 4.7,
    ddegCompliance: '99.4% Konform',
    pdmSaccoClearance: '97.0%',
    redSignals: 26,
    amberSignals: 124,
    greenSignals: 2050,
    subCounties: ['Innenstadt', 'Rodenkirchen', 'Lindenthal', 'Ehrenfeld', 'Nippes', 'Chorweiler'],
    chiefsRoster: [
      { name: 'Thomas Müller', ward: 'Bezirksrathaus Innenstadt', status: 'Online · Live Sync', ussdActive: true, staffCount: 6 },
      { name: 'Sabine Fischer', ward: 'Bürgeramt Ehrenfeld', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
    ]
  },
  {
    id: 'DE-BW-STU',
    name: 'Landeshauptstadt Stuttgart (Baden-Württemberg)',
    region: 'SÜDWEST',
    cao: 'Dr. Frank Nopper (Oberbürgermeister)',
    activeNodes: '23/23 Stadtbezirke',
    status: 'Active Live',
    rollDate: 'April 2026',
    sla: '94.5%',
    pdmParishes: 23,
    risk: 'Low',
    uptime: '99.8%',
    avgResponseHours: 16.5,
    casesLogged: 1310,
    casesResolved: 1238,
    csatScore: 4.8,
    ddegCompliance: '100% Konform',
    pdmSaccoClearance: '98.2%',
    redSignals: 14,
    amberSignals: 58,
    greenSignals: 1238,
    subCounties: ['Stuttgart-Mitte', 'Stuttgart-Nord', 'Bad Cannstatt', 'Degerloch', 'Vaihingen'],
    chiefsRoster: [
      { name: 'Martin Ziegler', ward: 'Bezirksamt Bad Cannstatt', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
      { name: 'Andrea Lehmann', ward: 'Bezirksamt Degerloch', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ]
  }
];

export function getRolloutNodesForCountry(countryCode: CountryCode): RolloutDistrictNode[] {
  const code = (countryCode || 'UG').toUpperCase();
  if (code === 'UG') return UG_DISTRICTS;
  if (code === 'KE') return KE_DISTRICTS;
  if (code === 'DE') return DE_DISTRICTS;

  const rollout = getNationalRolloutArrangements(countryCode);
  const countryObj = COUNTRIES[countryCode] || { name: 'Sovereign State', flag: '🏛️' };

  // Generate customized sovereign nodes matching the country's government structure
  const sampleRegions = ['CAPITAL', 'NORTHERN', 'SOUTHERN', 'EASTERN', 'WESTERN', 'COASTAL'];
  const generated: RolloutDistrictNode[] = [];

  const nodeCount = Math.min(6, Math.max(3, Math.round(rollout.targets.l2l3Target / 20)));

  for (let i = 0; i < nodeCount; i++) {
    const regionName = sampleRegions[i % sampleRegions.length];
    const unitName = `${countryObj.name} ${regionName} ${rollout.targets.l2l3Title.split('/')[0] || 'District'}`;
    const id = `${code}-NODE-${i + 1}`;
    const parishesTarget = Math.round(rollout.targets.l4Target / Math.max(1, nodeCount));
    const activeTarget = Math.round(parishesTarget * 0.88);

    generated.push({
      id,
      name: unitName,
      region: regionName,
      cao: `Director General & Head of Local Administration`,
      activeNodes: `${activeTarget}/${parishesTarget} ${rollout.primaryUnitName}`,
      status: i === 0 ? 'Active Live' : i === 1 ? 'Active Live' : 'Rollout Phase 2',
      rollDate: '2026 Deployment',
      sla: `${(91 + (i % 5) * 1.5).toFixed(1)}%`,
      pdmParishes: parishesTarget,
      risk: i === 3 ? 'Medium' : 'Low',
      uptime: '99.5%',
      avgResponseHours: 18 + i * 3,
      casesLogged: 450 + i * 180,
      casesResolved: Math.round((450 + i * 180) * 0.92),
      csatScore: 4.6,
      ddegCompliance: '100% Statutory Clearance',
      pdmSaccoClearance: '95.0%',
      redSignals: 10 + i * 2,
      amberSignals: 35 + i * 6,
      greenSignals: Math.round((450 + i * 180) * 0.92),
      subCounties: [
        `${regionName} Division 1`,
        `${regionName} Division 2`,
        `${regionName} Division 3`,
        `${regionName} Division 4`,
      ],
      chiefsRoster: [
        {
          name: `Chief Administrative Liaison (${rollout.lowestOfficerTitle})`,
          ward: `Sector 1 Central Node`,
          status: 'Online · Live Sync',
          ussdActive: true,
          staffCount: 4,
        },
        {
          name: `Senior Field Registrar`,
          ward: `Sector 2 East Node`,
          status: 'Online · Live Sync',
          ussdActive: true,
          staffCount: 3,
        },
      ],
      staffRoster: (rollout.lowestOfficerTeamRoles || []).map((tr, idx) => ({
        id: `gen-${i}-${idx}`,
        name: `Appointed Staff (${tr.role.split(' ')[0]})`,
        role: tr.role,
        village: `Zone ${idx + 1}, ${rollout.lowestOfficerUnit}`,
        phone: `+${(countryObj as any)?.phoneCode || '256'} 772 010${idx}`,
        status: 'Active',
      })),
    });
  }

  return generated;
}

export interface SisterMinistryNode {
  id: string;
  title: string;
  permSecretary: string;
  code: string;
  sector: 'GOVERNANCE' | 'INFRASTRUCTURE' | 'FISCAL' | 'SOCIAL' | 'SECURITY';
  mandate: string;
  slaScore: string;
  macroSpeedHours: number;
  cabinetDeliveryIndex: number;
  deptId: string;
}

export function getSisterMinistriesForCountry(countryCode: CountryCode): SisterMinistryNode[] {
  const code = (countryCode || 'UG').toUpperCase();

  if (code === 'UG') {
    return [
      {
        id: 'PS-MOFPED',
        title: 'PS Ministry of Finance, Planning & Econ Dev (MoFPED)',
        permSecretary: 'Ramathan Ggoobi',
        code: 'PS-MOFPED-2026',
        sector: 'FISCAL',
        mandate: 'DDEG Grant Releases, Local Revenue Automation, Treasury Single Account (TSA) Sync & PDM Sacco Revolving Fund',
        slaScore: '94.1%',
        macroSpeedHours: 19.5,
        cabinetDeliveryIndex: 96.5,
        deptId: 'mofped',
      },
      {
        id: 'PS-MOWT',
        title: 'PS Ministry of Works & Transport (MoWT)',
        permSecretary: 'Bageya Waiswa',
        code: 'PS-MOWT-2026',
        sector: 'INFRASTRUCTURE',
        mandate: 'District Road Unit Telemetry, National Highway Bridges, Verified Contractor Milestones & Pothole Clearance',
        slaScore: '88.0%',
        macroSpeedHours: 29.4,
        cabinetDeliveryIndex: 89.2,
        deptId: 'unra',
      },
      {
        id: 'PS-MOH',
        title: 'PS Ministry of Health (MoH)',
        permSecretary: 'Dr. Diana Atwine',
        code: 'PS-MOH-2026',
        sector: 'SOCIAL',
        mandate: 'Health Centre III/IV Medicine Stocks, Essential Drugs Delivery, Emergency Ambulance Network & Maternal Ward SLA',
        slaScore: '92.5%',
        macroSpeedHours: 21.0,
        cabinetDeliveryIndex: 95.0,
        deptId: 'moh_ug',
      },
      {
        id: 'PS-MOES',
        title: 'PS Ministry of Education & Sports (MoES)',
        permSecretary: 'Ketty Lamaro',
        code: 'PS-MOES-2026',
        sector: 'SOCIAL',
        mandate: 'Seed Secondary Schools, Capitation Grant Verification, Teacher Attendance Biometrics & Classroom Inspections',
        slaScore: '86.4%',
        macroSpeedHours: 32.1,
        cabinetDeliveryIndex: 88.0,
        deptId: 'moes',
      },
      {
        id: 'PS-MWE',
        title: 'PS Ministry of Water & Environment (MWE)',
        permSecretary: 'Alfred Okot Okidi',
        code: 'PS-MWE-2026',
        sector: 'INFRASTRUCTURE',
        mandate: 'Rural Borehole Restoration, Gravity Flow Systems, Wetland Encroachment Alerts & Solar Irrigation Schemes',
        slaScore: '90.2%',
        macroSpeedHours: 25.0,
        cabinetDeliveryIndex: 92.4,
        deptId: 'nwsc',
      },
      {
        id: 'PS-MEMD',
        title: 'PS Ministry of Energy & Mineral Dev (MEMD)',
        permSecretary: 'Irene Batebe',
        code: 'PS-MEMD-2026',
        sector: 'INFRASTRUCTURE',
        mandate: 'Rural Electrification Agency (REA) Lines, Transformer Outage Tickets, Mini-Grid Connections & Substation Relays',
        slaScore: '89.0%',
        macroSpeedHours: 27.5,
        cabinetDeliveryIndex: 90.1,
        deptId: 'umeme',
      },
      {
        id: 'PS-MAAIF',
        title: 'PS Ministry of Agriculture, Animal Industry & Fisheries',
        permSecretary: 'Maj. Gen. David Kasura-Kyomukama',
        code: 'PS-MAAIF-2026',
        sector: 'GOVERNANCE',
        mandate: 'Parish PDM Enterprise Input Delivery, Tractor Hire Tracking, Livestock Disease Quarantine & Extension Field Visits',
        slaScore: '87.8%',
        macroSpeedHours: 30.2,
        cabinetDeliveryIndex: 87.5,
        deptId: 'maaif',
      },
      {
        id: 'PS-MIA',
        title: 'PS Ministry of Internal Affairs (MIA)',
        permSecretary: 'Lt. Gen. Joseph Musanyufu',
        code: 'PS-MIA-2026',
        sector: 'SECURITY',
        mandate: 'NIRA National ID Civic Card Synchronization, Community Policing, Border Local Node Monitoring & Fire Emergency Units',
        slaScore: '93.0%',
        macroSpeedHours: 22.4,
        cabinetDeliveryIndex: 93.8,
        deptId: 'mia',
      },
      {
        id: 'PS-OPM',
        title: 'PS Office of the Prime Minister (OPM)',
        permSecretary: 'Dunstan Balaba',
        code: 'PS-OPM-2026',
        sector: 'GOVERNANCE',
        mandate: 'National Government Performance, Cabinet Delivery Monitoring, Disaster Relief & Cross-Ministry Coordination',
        slaScore: '89.4%',
        macroSpeedHours: 26.8,
        cabinetDeliveryIndex: 92.0,
        deptId: 'opm',
      },
    ];
  }

  if (code === 'KE') {
    return [
      {
        id: 'PS-TREASURY-KE',
        title: 'PS National Treasury & Economic Planning',
        permSecretary: 'Dr. Chris Kiptoo',
        code: 'PS-TREASURY-KE-2026',
        sector: 'FISCAL',
        mandate: 'Equitable Revenue Share Disbursement to Counties, Controller of Budget Releases, Integrated Financial Management (IFMIS)',
        slaScore: '93.5%',
        macroSpeedHours: 21.0,
        cabinetDeliveryIndex: 95.0,
        deptId: 'treasury_ke',
      },
      {
        id: 'PS-ROADS-KE',
        title: 'PS State Dept for Roads & Transport',
        permSecretary: 'Eng. Joseph Mbugua',
        code: 'PS-ROADS-KE-2026',
        sector: 'INFRASTRUCTURE',
        mandate: 'KeRRA County Feeder Roads, KeNHA Highways, Pothole Escalations & Bridge Restorations',
        slaScore: '89.0%',
        macroSpeedHours: 28.5,
        cabinetDeliveryIndex: 88.5,
        deptId: 'kenha',
      },
      {
        id: 'PS-HEALTH-KE',
        title: 'PS State Dept for Public Health & Sanitation',
        permSecretary: 'Mary Muthoni Muriuki',
        code: 'PS-HEALTH-KE-2026',
        sector: 'SOCIAL',
        mandate: 'KEMSA County Drug Deliveries, Universal Health Care (UHC) Primary Facilities, Community Health Promoters (CHP) Hub',
        slaScore: '91.8%',
        macroSpeedHours: 23.2,
        cabinetDeliveryIndex: 94.0,
        deptId: 'moh_ke',
      },
      {
        id: 'PS-WATER-KE',
        title: 'PS State Dept for Water & Sanitation',
        permSecretary: 'Julius Korir',
        code: 'PS-WATER-KE-2026',
        sector: 'INFRASTRUCTURE',
        mandate: 'Rural Water Service Boards, Last-Mile Piping, Dam Telemetry & Drought Mitigation',
        slaScore: '88.5%',
        macroSpeedHours: 27.0,
        cabinetDeliveryIndex: 90.0,
        deptId: 'water_ke',
      },
      {
        id: 'PS-INTERIOR-KE',
        title: 'PS State Dept for Interior & National Administration',
        permSecretary: 'Dr. Raymond Omollo',
        code: 'PS-INTERIOR-KE-2026',
        sector: 'SECURITY',
        mandate: 'National Government Administrative Officers (NGAO) Sync, Deputy County Commissioners, National Police Service Links',
        slaScore: '94.2%',
        macroSpeedHours: 19.8,
        cabinetDeliveryIndex: 96.0,
        deptId: 'interior_ke',
      },
      {
        id: 'PS-DEVOLUTION-KE',
        title: 'PS State Dept for Devolution',
        permSecretary: 'Teresia Mbaika',
        code: 'PS-DEVOLUTION-KE-2026',
        sector: 'GOVERNANCE',
        mandate: 'Intergovernmental Relations Technical Committee (IGRTC), Council of Governors (CoG) Joint Monitoring',
        slaScore: '92.0%',
        macroSpeedHours: 24.5,
        cabinetDeliveryIndex: 92.5,
        deptId: 'devolution_ke',
      },
    ];
  }

  // Generalized sovereign cabinet for other nations
  const countryObj = COUNTRIES[code] || { name: code };
  return [
    {
      id: `PS-TREASURY-${code}`,
      title: `${countryObj.name} Ministry of Finance & National Treasury`,
      permSecretary: 'Permanent Secretary / Director-General',
      code: `PS-FIN-${code}-2026`,
      sector: 'FISCAL',
      mandate: 'National Revenue Allocation, Sub-National Fiscal Transfers, Budget Clearance & Public Accounts',
      slaScore: '92.0%',
      macroSpeedHours: 22.0,
      cabinetDeliveryIndex: 94.0,
      deptId: 'treasury',
    },
    {
      id: `PS-WORKS-${code}`,
      title: `${countryObj.name} Ministry of Works, Transport & Infrastructure`,
      permSecretary: 'Chief Director & Engineering Lead',
      code: `PS-WORKS-${code}-2026`,
      sector: 'INFRASTRUCTURE',
      mandate: 'Road Network Maintenance, Public Works Oversight, Urban Transit & Feeder Corridors',
      slaScore: '88.5%',
      macroSpeedHours: 28.0,
      cabinetDeliveryIndex: 89.0,
      deptId: 'works',
    },
    {
      id: `PS-HEALTH-${code}`,
      title: `${countryObj.name} Ministry of Health & Medical Services`,
      permSecretary: 'Director of Health & Chief Medical Officer',
      code: `PS-HEALTH-${code}-2026`,
      sector: 'SOCIAL',
      mandate: 'Primary Healthcare Facilities, Essential Medical Supplies, Disease Surveillance & Clinic SLAs',
      slaScore: '91.0%',
      macroSpeedHours: 24.0,
      cabinetDeliveryIndex: 93.0,
      deptId: 'health',
    },
    {
      id: `PS-WATER-${code}`,
      title: `${countryObj.name} Ministry of Water, Sanitation & Energy`,
      permSecretary: 'Director-General of Utilities',
      code: `PS-UTIL-${code}-2026`,
      sector: 'INFRASTRUCTURE',
      mandate: 'Public Water Supply, Grid Reliability, Renewable Energy Distribution & Environmental Compliance',
      slaScore: '89.5%',
      macroSpeedHours: 26.5,
      cabinetDeliveryIndex: 91.0,
      deptId: 'utilities',
    },
    {
      id: `PS-INTERIOR-${code}`,
      title: `${countryObj.name} Ministry of Internal Affairs & Civic Administration`,
      permSecretary: 'Secretary-General for Civil Administration',
      code: `PS-CIVIC-${code}-2026`,
      sector: 'GOVERNANCE',
      mandate: 'National Civil Registry, Citizen Identification, Law Enforcement Coordination & Disaster Response',
      slaScore: '93.0%',
      macroSpeedHours: 20.0,
      cabinetDeliveryIndex: 95.0,
      deptId: 'interior',
    },
  ];
}
