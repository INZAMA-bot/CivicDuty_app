import { CountryCode } from '../types';
import { getNationalRolloutArrangements } from './tiers';
import { COUNTRIES } from './countries';
import { getCountryGovernanceSchema } from './countryGovernance';

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
    name: 'Nairobi City County',
    region: 'NAIROBI',
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
    ddegCompliance: '100% CRA Equitable Share',
    pdmSaccoClearance: '96.8%',
    redSignals: 24,
    amberSignals: 140,
    greenSignals: 1986,
    isCity: true,
    stationType: 'city',
    subCounties: ['Westlands Sub-County', 'Starehe Sub-County', 'Dagoretti North', 'Langata Sub-County', 'Kasarani Sub-County', 'Embakasi East'],
    chiefsRoster: [
      { name: 'Kamau Joseph', ward: 'Kilimani Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 6 },
      { name: 'Otieno Mercy', ward: 'Parklands/Highridge Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
      { name: 'Mwangi Kevin', ward: 'Roysambu Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ],
    staffRoster: [
      { id: 'st-ke-1', name: 'Wanjiku Mary', role: 'Ward Development Officer', village: 'Kilimani North', phone: '+254 712 345678', status: 'Active' },
      { id: 'st-ke-2', name: 'Kiprono Eric', role: 'Agricultural Field Officer', village: 'Kasarani Zone 4', phone: '+254 723 456789', status: 'On Duty' },
      { id: 'st-ke-3', name: 'Adhiambo Cynthia', role: 'Community Health Promoter Lead (CHP)', village: 'Langata Highrise', phone: '+254 734 567890', status: 'Active' },
    ],
  },
  {
    id: 'KE-CG-MSA',
    name: 'Mombasa County',
    region: 'COAST',
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
    ddegCompliance: '98.5% IFMIS Compliant',
    pdmSaccoClearance: '95.1%',
    redSignals: 16,
    amberSignals: 61,
    greenSignals: 763,
    isCity: true,
    stationType: 'city',
    subCounties: ['Mvita Sub-County', 'Nyali Sub-County', 'Kisauni Sub-County', 'Likoni Sub-County', 'Changamwe Sub-County', 'Jomvu Sub-County'],
    chiefsRoster: [
      { name: 'Ali Hassan', ward: 'Old Town Mvita Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
      { name: 'Mwanaidi Omar', ward: 'Kongowea Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
    ],
  },
  {
    id: 'KE-CG-KSM',
    name: 'Kisumu County',
    region: 'NYANZA',
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
    ddegCompliance: '99.0% IFMIS Compliant',
    pdmSaccoClearance: '94.5%',
    redSignals: 11,
    amberSignals: 54,
    greenSignals: 695,
    isCity: true,
    stationType: 'city',
    subCounties: ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Seme Sub-County', 'Nyando Sub-County', 'Muhoroni Sub-County'],
    chiefsRoster: [
      { name: 'Omondi George', ward: 'Milimani Market Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
      { name: 'Achieng Lilian', ward: 'Kondele Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ],
  },
  {
    id: 'KE-CG-NKR',
    name: 'Nakuru County',
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
    ddegCompliance: '97.2% IFMIS Compliant',
    pdmSaccoClearance: '93.2%',
    redSignals: 21,
    amberSignals: 78,
    greenSignals: 821,
    isCity: true,
    stationType: 'city',
    subCounties: ['Nakuru Town East', 'Nakuru Town West', 'Naivasha Sub-County', 'Molo Sub-County', 'Gilgil Sub-County'],
    chiefsRoster: [
      { name: 'Chebet Faith', ward: 'Biashara Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
      { name: 'Njoroge Daniel', ward: 'Kivumbini Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 3 },
    ],
  },
  {
    id: 'KE-CG-UGI',
    name: 'Uasin Gishu County (Eldoret City)',
    region: 'RIFT VALLEY',
    cao: 'Philip Meli (County Secretary)',
    activeNodes: '30/30 Wards',
    status: 'Active Live',
    rollDate: 'March 2026',
    sla: '91.1%',
    pdmParishes: 30,
    risk: 'Low',
    uptime: '99.4%',
    avgResponseHours: 20.5,
    casesLogged: 680,
    casesResolved: 619,
    csatScore: 4.6,
    ddegCompliance: '98.0% IFMIS Compliant',
    pdmSaccoClearance: '95.4%',
    redSignals: 12,
    amberSignals: 49,
    greenSignals: 619,
    isCity: true,
    stationType: 'city',
    subCounties: ['Ainabkoi Sub-County', 'Kapseret Sub-County', 'Kesses Sub-County', 'Moiben Sub-County', 'Soy Sub-County', 'Turbo Sub-County'],
    chiefsRoster: [
      { name: 'Kiprop Kenneth', ward: 'Huruma Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
      { name: 'Jepchirchir Alice', ward: 'Langas Ward Admin', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ],
  },
  ...[
    { id: 'KE-CG-KBU', name: 'Kiambu County', region: 'CENTRAL', wards: 60, sub: ['Thika Town', 'Ruiru', 'Juja', 'Kikuyu', 'Kiambu Town', 'Limuru'] },
    { id: 'KE-CG-NYR', name: 'Nyeri County', region: 'CENTRAL', wards: 30, sub: ['Nyeri Town', 'Mathira', 'Tetu', 'Othaya', 'Kieni'] },
    { id: 'KE-CG-MRU', name: 'Meru County', region: 'EASTERN', wards: 45, sub: ['Imenti North', 'Imenti South', 'Tigania West', 'Igembe South'] },
    { id: 'KE-CG-MCK', name: 'Machakos County', region: 'EASTERN', wards: 40, sub: ['Machakos Town', 'Mavoko', 'Kangundo', 'Kathiani', 'Mwala'] },
    { id: 'KE-CG-KLF', name: 'Kilifi County', region: 'COAST', wards: 35, sub: ['Kilifi North', 'Kilifi South', 'Malindi', 'Magarini', 'Kaloleni'] },
    { id: 'KE-CG-KAK', name: 'Kakamega County', region: 'WESTERN', wards: 60, sub: ['Lurambi', 'Shinyalu', 'Mumias West', 'Lugari', 'Butere'] },
    { id: 'KE-CG-BNG', name: 'Bungoma County', region: 'WESTERN', wards: 45, sub: ['Kanduyi', 'Webuye East', 'Kimilili', 'Bumula', 'Sirisia'] },
    { id: 'KE-CG-KIS', name: 'Kisii County', region: 'NYANZA', wards: 45, sub: ['Kitutu Chache South', 'Nyaribari Chache', 'Bobasi', 'Bomachoge'] },
    { id: 'KE-CG-GRR', name: 'Garissa County', region: 'NORTH EASTERN', wards: 30, sub: ['Garissa Township', 'Dadaab', 'Balambala', 'Lagdera'] },
    { id: 'KE-CG-TRK', name: 'Turkana County', region: 'RIFT VALLEY', wards: 30, sub: ['Turkana Central', 'Loima', 'Turkana West', 'Turkana South'] },
  ].map((c, idx) => ({
    id: c.id,
    name: c.name,
    region: c.region,
    cao: `County Secretary (${c.name})`,
    activeNodes: `${c.wards}/${c.wards} Wards`,
    status: 'Active Live',
    rollDate: '2026 Rollout',
    sla: `${(88.5 + (idx % 5) * 1.1).toFixed(1)}%`,
    pdmParishes: c.wards,
    risk: (idx % 4 === 3 ? 'Medium' : 'Low') as 'Low' | 'Medium',
    uptime: '99.1%',
    avgResponseHours: 23 + idx,
    casesLogged: 380 + idx * 45,
    casesResolved: Math.round((380 + idx * 45) * 0.9),
    csatScore: 4.5,
    ddegCompliance: '96.8% IFMIS Compliant',
    pdmSaccoClearance: '93.5%',
    redSignals: 9 + (idx % 6),
    amberSignals: 28 + idx * 3,
    greenSignals: Math.round((380 + idx * 45) * 0.9),
    stationType: 'district' as const,
    subCounties: c.sub,
    chiefsRoster: c.sub.slice(0, 2).map((sc) => ({
      name: `${sc} Ward Admin Desk`,
      ward: `${sc} Ward`,
      status: 'Online · Live Sync',
      ussdActive: true,
      staffCount: 4,
    })),
  })),
];

// Rwanda: City of Kigali + 30 Districts (Uturere) across all 5 territorial units (Kigali, Northern, Southern, Eastern, Western)
export const RW_DISTRICTS: RolloutDistrictNode[] = [
  // City of Kigali (3 Districts)
  {
    id: 'RW-DIST-GAS',
    name: 'Gasabo District (City of Kigali)',
    region: 'KIGALI',
    cao: 'District Executive Administrator (Gasabo · Kigali)',
    activeNodes: '15/15 Sectors · 73 Cells',
    status: 'Active Live',
    rollDate: 'January 2026',
    sla: '96.8%',
    pdmParishes: 73,
    risk: 'Low',
    uptime: '99.9%',
    avgResponseHours: 14.5,
    casesLogged: 1420,
    casesResolved: 1375,
    csatScore: 4.9,
    ddegCompliance: '100% Imihigo Rated',
    pdmSaccoClearance: '98.4%',
    redSignals: 7,
    amberSignals: 38,
    greenSignals: 1375,
    isCity: true,
    stationType: 'city',
    subCounties: ['Remera Sector', 'Kimironko Sector', 'Kacyiru Sector', 'Kimihurura Sector', 'Gisozi Sector', 'Kinyinya Sector', 'Bumbogo Sector'],
    chiefsRoster: [
      { name: 'Remera Sector ES', ward: 'Rukiri I & II Cells', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
      { name: 'Kimironko Sector ES', ward: 'Bibare & Kibagabaga Cells', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
      { name: 'Kacyiru Sector ES', ward: 'Kamatamu & Kamutwa Cells', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ],
    staffRoster: [
      { id: 'st-rw-1', name: 'Uwimana Claire', role: 'Socio-Economic Development Officer (SEDO)', village: 'Rukiri I Cell · Gasabo', phone: '+250 788 210 101', status: 'Active' },
      { id: 'st-rw-2', name: 'Ndayishimiye Eric', role: 'Community Health Worker Coordinator', village: 'Bibare Cell · Kimironko', phone: '+250 788 210 102', status: 'On Duty' },
      { id: 'st-rw-3', name: 'Iradukunda Diane', role: 'WASAC & Urban Infrastructure Cell Focal', village: 'Kibagabaga Cell', phone: '+250 788 210 103', status: 'Active' },
    ],
  },
  {
    id: 'RW-DIST-KIC',
    name: 'Kicukiro District (City of Kigali)',
    region: 'KIGALI',
    cao: 'District Executive Administrator (Kicukiro · Kigali)',
    activeNodes: '10/10 Sectors · 41 Cells',
    status: 'Active Live',
    rollDate: 'January 2026',
    sla: '96.1%',
    pdmParishes: 41,
    risk: 'Low',
    uptime: '99.9%',
    avgResponseHours: 15.2,
    casesLogged: 980,
    casesResolved: 942,
    csatScore: 4.8,
    ddegCompliance: '100% Imihigo Rated',
    pdmSaccoClearance: '97.9%',
    redSignals: 6,
    amberSignals: 32,
    greenSignals: 942,
    isCity: true,
    stationType: 'city',
    subCounties: ['Niboye Sector', 'Kanombe Sector', 'Nyarugunga Sector', 'Gikondo Sector', 'Kagarama Sector', 'Masaka Sector'],
    chiefsRoster: [
      { name: 'Niboye Sector ES', ward: 'Niboye & Gatare Cells', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
      { name: 'Kanombe Sector ES', ward: 'Busanza & Karama Cells', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ],
  },
  {
    id: 'RW-DIST-NYR',
    name: 'Nyarugenge District (City of Kigali CBD)',
    region: 'KIGALI',
    cao: 'District Executive Administrator (Nyarugenge · Kigali)',
    activeNodes: '10/10 Sectors · 47 Cells',
    status: 'Active Live',
    rollDate: 'January 2026',
    sla: '97.2%',
    pdmParishes: 47,
    risk: 'Low',
    uptime: '99.9%',
    avgResponseHours: 13.8,
    casesLogged: 1190,
    casesResolved: 1157,
    csatScore: 4.9,
    ddegCompliance: '100% Imihigo Rated',
    pdmSaccoClearance: '98.8%',
    redSignals: 5,
    amberSignals: 28,
    greenSignals: 1157,
    isCity: true,
    stationType: 'city',
    subCounties: ['Nyarugenge Sector', 'Muhima Sector', 'Gitega Sector', 'Kimisagara Sector', 'Nyamirambo Sector', 'Rwezamenyo Sector'],
    chiefsRoster: [
      { name: 'Nyarugenge Sector ES', ward: 'Kiyovu & Biryogo Cells', status: 'Online · Live Sync', ussdActive: true, staffCount: 5 },
      { name: 'Kimisagara Sector ES', ward: 'Katabaro & Kamuhoza Cells', status: 'Online · Live Sync', ussdActive: true, staffCount: 4 },
    ],
  },
  // Remaining 27 Districts across Northern (5), Southern (8), Eastern (7), Western (7)
  ...[
    // Northern Province (5)
    { id: 'RW-NOR-MUS', name: 'Musanze District', region: 'NORTHERN', sectors: 15, cells: 68, isCity: true, sub: ['Muhoza Sector', 'Cyuve Sector', 'Musanze Sector', 'Kinigi Sector', 'Busogo Sector'] },
    { id: 'RW-NOR-BUR', name: 'Burera District', region: 'NORTHERN', sectors: 17, cells: 69, isCity: false, sub: ['Cyanika Sector', 'Cyeru Sector', 'Rusarabuye Sector', 'Butaro Sector'] },
    { id: 'RW-NOR-GAK', name: 'Gakenke District', region: 'NORTHERN', sectors: 19, cells: 97, isCity: false, sub: ['Gakenke Sector', 'Nemba Sector', 'Ruli Sector', 'Rushashi Sector'] },
    { id: 'RW-NOR-GIC', name: 'Gicumbi District', region: 'NORTHERN', sectors: 21, cells: 109, isCity: false, sub: ['Byumba Sector', 'Kageyo Sector', 'Rukomo Sector', 'Mutete Sector'] },
    { id: 'RW-NOR-RUL', name: 'Rulindo District', region: 'NORTHERN', sectors: 17, cells: 71, isCity: false, sub: ['Base Sector', 'Bushoki Sector', 'Murambi Sector', 'Shyorongi Sector'] },
    // Southern Province (8)
    { id: 'RW-SOU-HUY', name: 'Huye District', region: 'SOUTHERN', sectors: 14, cells: 77, isCity: true, sub: ['Ngoma Sector', 'Tumba Sector', 'Mbazi Sector', 'Mukura Sector'] },
    { id: 'RW-SOU-MUH', name: 'Muhanga District', region: 'SOUTHERN', sectors: 12, cells: 63, isCity: true, sub: ['Nyamabuye Sector', 'Cyeza Sector', 'Shyogwe Sector', 'Mushishiro Sector'] },
    { id: 'RW-SOU-NYA', name: 'Nyanza District', region: 'SOUTHERN', sectors: 10, cells: 42, isCity: false, sub: ['Busasamana Sector', 'Rwabicuma Sector', 'Kigoma Sector', 'Muyira Sector'] },
    { id: 'RW-SOU-GIS', name: 'Gisagara District', region: 'SOUTHERN', sectors: 13, cells: 59, isCity: false, sub: ['Ndora Sector', 'Save Sector', 'Kigembe Sector', 'Muganza Sector'] },
    { id: 'RW-SOU-KAM', name: 'Kamonyi District', region: 'SOUTHERN', sectors: 12, cells: 59, isCity: false, sub: ['Runda Sector', 'Gacurabwenge Sector', 'Musambira Sector', 'Rukoma Sector'] },
    { id: 'RW-SOU-NYM', name: 'Nyamagabe District', region: 'SOUTHERN', sectors: 17, cells: 92, isCity: false, sub: ['Gasaka Sector', 'Cyanika Sector', 'Kaduha Sector', 'Kitabi Sector'] },
    { id: 'RW-SOU-NYG', name: 'Nyaruguru District', region: 'SOUTHERN', sectors: 14, cells: 72, isCity: false, sub: ['Kibeho Sector', 'Munini Sector', 'Ngoma Sector', 'Mata Sector'] },
    { id: 'RW-SOU-RUH', name: 'Ruhango District', region: 'SOUTHERN', sectors: 9, cells: 59, isCity: false, sub: ['Ruhango Sector', 'Byimana Sector', 'Bweramana Sector', 'Kinazi Sector'] },
    // Eastern Province (7)
    { id: 'RW-EST-RWA', name: 'Rwamagana District', region: 'EASTERN', sectors: 14, cells: 82, isCity: false, sub: ['Kigabiro Sector', 'Muhazi Sector', 'Mwulire Sector', 'Nzige Sector'] },
    { id: 'RW-EST-BUG', name: 'Bugesera District', region: 'EASTERN', sectors: 15, cells: 72, isCity: false, sub: ['Nyamata Sector', 'Ntarama Sector', 'Rilima Sector', 'Mayange Sector'] },
    { id: 'RW-EST-GAT', name: 'Gatsibo District', region: 'EASTERN', sectors: 14, cells: 69, isCity: false, sub: ['Kabarore Sector', 'Kiramuruzi Sector', 'Muhura Sector', 'Gitoki Sector'] },
    { id: 'RW-EST-KAY', name: 'Kayonza District', region: 'EASTERN', sectors: 12, cells: 50, isCity: false, sub: ['Mukarange Sector', 'Gahini Sector', 'Kabarondo Sector', 'Mwiri Sector'] },
    { id: 'RW-EST-KIR', name: 'Kirehe District', region: 'EASTERN', sectors: 12, cells: 60, isCity: false, sub: ['Kigarama Sector', 'Nyamugari Sector', 'Gahara Sector', 'Mahama Sector'] },
    { id: 'RW-EST-NGO', name: 'Ngoma District', region: 'EASTERN', sectors: 14, cells: 64, isCity: false, sub: ['Kibungo Sector', 'Mugesera Sector', 'Sake Sector', 'Rurenge Sector'] },
    { id: 'RW-EST-NYG', name: 'Nyagatare District', region: 'EASTERN', sectors: 14, cells: 106, isCity: true, sub: ['Nyagatare Sector', 'Karangazi Sector', 'Mimuri Sector', 'Rwimiyaga Sector'] },
    // Western Province (7)
    { id: 'RW-WES-RUB', name: 'Rubavu District', region: 'WESTERN', sectors: 12, cells: 80, isCity: true, sub: ['Gisenyi Sector', 'Rubavu Sector', 'Nyundo Sector', 'Rugerero Sector'] },
    { id: 'RW-WES-RUS', name: 'Rusizi District', region: 'WESTERN', sectors: 18, cells: 94, isCity: true, sub: ['Kamembe Sector', 'Gihundwe Sector', 'Bugarama Sector', 'Nkungu Sector'] },
    { id: 'RW-WES-KAR', name: 'Karongi District', region: 'WESTERN', sectors: 13, cells: 88, isCity: false, sub: ['Bwishyura Sector', 'Rubengera Sector', 'Mubuga Sector', 'Gitesi Sector'] },
    { id: 'RW-WES-NGO', name: 'Ngororero District', region: 'WESTERN', sectors: 13, cells: 73, isCity: false, sub: ['Ngororero Sector', 'Kabaya Sector', 'Muhanda Sector', 'Gatumba Sector'] },
    { id: 'RW-WES-NYB', name: 'Nyabihu District', region: 'WESTERN', sectors: 12, cells: 73, isCity: false, sub: ['Mukamira Sector', 'Jenda Sector', 'Bigogwe Sector', 'Rambura Sector'] },
    { id: 'RW-WES-NYM', name: 'Nyamasheke District', region: 'WESTERN', sectors: 15, cells: 68, isCity: false, sub: ['Kagano Sector', 'Kanjongo Sector', 'Shangi Sector', 'Bushenge Sector'] },
    { id: 'RW-WES-RUT', name: 'Rutsiro District', region: 'WESTERN', sectors: 13, cells: 62, isCity: false, sub: ['Gihango Sector', 'Kivumu Sector', 'Mushonyi Sector', 'Boneza Sector'] },
  ].map((d, idx) => ({
    id: d.id,
    name: d.name,
    region: d.region,
    cao: `Mayor / District Executive Secretary (${d.name})`,
    activeNodes: `${d.sectors}/${d.sectors} Sectors · ${d.cells} Cells`,
    status: 'Active Live',
    rollDate: '2026 Rollout',
    sla: `${(91.5 + (idx % 6) * 0.9).toFixed(1)}%`,
    pdmParishes: d.cells,
    risk: 'Low' as const,
    uptime: '99.6%',
    avgResponseHours: 16 + (idx % 8),
    casesLogged: 310 + idx * 18,
    casesResolved: Math.round((310 + idx * 18) * 0.94),
    csatScore: 4.7,
    ddegCompliance: '98.5% Imihigo Rated',
    pdmSaccoClearance: '96.2%',
    redSignals: 4 + (idx % 5),
    amberSignals: 14 + (idx % 9),
    greenSignals: Math.round((310 + idx * 18) * 0.94),
    isCity: d.isCity,
    stationType: (d.isCity ? 'city' : 'district') as 'city' | 'district',
    subCounties: d.sub,
    chiefsRoster: d.sub.slice(0, 2).map((sec) => ({
      name: `${sec} ES Desk`,
      ward: `${sec} Cells`,
      status: 'Online · Live Sync',
      ussdActive: true,
      staffCount: 4,
    })),
  })),
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
  if (code === 'RW') return RW_DISTRICTS;
  if (code === 'DE') return DE_DISTRICTS;

  const rollout = getNationalRolloutArrangements(countryCode);
  const gov = getCountryGovernanceSchema(countryCode);
  const countryObj = COUNTRIES[code] || { name: code, flag: code };

  // Use country-aware geographic regions (never generic COASTAL for landlocked countries)
  const sampleRegions = gov.regions && gov.regions.length > 0
    ? gov.regions
    : ['CAPITAL', 'NORTHERN', 'SOUTHERN', 'EASTERN', 'WESTERN'];
  const generated: RolloutDistrictNode[] = [];

  const nodeCount = Math.max(sampleRegions.length, Math.min(8, Math.max(4, sampleRegions.length)));

  for (let i = 0; i < nodeCount; i++) {
    const regionName = sampleRegions[i % sampleRegions.length];
    const isMetro = i === 0;
    const unitName = isMetro
      ? `${countryObj.name} Capital Metropolitan ${gov.tier3UnitLabel}`
      : `${regionName.charAt(0) + regionName.slice(1).toLowerCase()} Regional ${gov.tier3UnitLabel}`;
    const id = `${code}-NODE-${i + 1}`;
    const parishesTarget = Math.max(12, Math.round(rollout.targets.l4Target / Math.max(1, nodeCount)));
    const activeTarget = Math.round(parishesTarget * 0.9);

    generated.push({
      id,
      name: unitName,
      region: regionName,
      cao: `${gov.tier3Short} (${unitName})`,
      activeNodes: `${activeTarget}/${parishesTarget} ${gov.tier1UnitLabel}s`,
      status: i < 3 ? 'Active Live' : 'Rollout Phase 2',
      rollDate: '2026 Deployment',
      sla: `${(91.5 + (i % 5) * 1.2).toFixed(1)}%`,
      pdmParishes: parishesTarget,
      risk: i === 4 ? 'Medium' : 'Low',
      uptime: '99.5%',
      avgResponseHours: 17 + i * 2,
      casesLogged: 420 + i * 140,
      casesResolved: Math.round((420 + i * 140) * 0.92),
      csatScore: 4.6,
      ddegCompliance: `100% ${gov.fiscalGrantName.split('&')[0].trim()}`,
      pdmSaccoClearance: '95.4%',
      redSignals: 8 + i * 2,
      amberSignals: 28 + i * 5,
      greenSignals: Math.round((420 + i * 140) * 0.92),
      isCity: isMetro,
      stationType: isMetro ? 'city' : 'district',
      subCounties: [
        `${regionName} ${gov.tier2UnitLabel.split('/')[0].trim()} 1`,
        `${regionName} ${gov.tier2UnitLabel.split('/')[0].trim()} 2`,
        `${regionName} ${gov.tier2UnitLabel.split('/')[0].trim()} 3`,
        `${regionName} ${gov.tier2UnitLabel.split('/')[0].trim()} 4`,
      ],
      chiefsRoster: [
        {
          name: `${gov.tier1Short} Central`,
          ward: `${gov.tier1UnitLabel} 1 Desk`,
          status: 'Online · Live Sync',
          ussdActive: true,
          staffCount: 4,
        },
        {
          name: `${gov.tier1Short} East`,
          ward: `${gov.tier1UnitLabel} 2 Desk`,
          status: 'Online · Live Sync',
          ussdActive: true,
          staffCount: 3,
        },
      ],
      staffRoster: (rollout.lowestOfficerTeamRoles || []).map((tr, idx) => ({
        id: `gen-${code}-${i}-${idx}`,
        name: `Assigned Officer (${tr.role.split(' ')[0]})`,
        role: tr.role,
        village: `Zone ${idx + 1}, ${gov.tier1UnitLabel}`,
        phone: `${gov.phonePrefix} 700 010${idx}`,
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

  if (code === 'RW') {
    return [
      {
        id: 'PS-MINECOFIN-RW',
        title: 'PS Ministry of Finance & Economic Planning (MINECOFIN)',
        permSecretary: 'Permanent Secretary & Secretary to the Treasury (MINECOFIN)',
        code: 'PS-MINECOFIN-RW-2026',
        sector: 'FISCAL',
        mandate: 'District Imihigo Block Grants, IFMIS Public Accounts, Umurenge SACCO Oversight & National Treasury Releases',
        slaScore: '96.4%',
        macroSpeedHours: 16.5,
        cabinetDeliveryIndex: 97.2,
        deptId: 'minecofin',
      },
      {
        id: 'PS-MININFRA-RW',
        title: 'PS Ministry of Infrastructure (MININFRA)',
        permSecretary: 'Permanent Secretary (MININFRA)',
        code: 'PS-MININFRA-RW-2026',
        sector: 'INFRASTRUCTURE',
        mandate: 'RTDA National & Feeder Roads, REG Power Grid Reliability, WASAC Piped Water & Kigali Urban Mobility',
        slaScore: '94.8%',
        macroSpeedHours: 18.2,
        cabinetDeliveryIndex: 95.4,
        deptId: 'mininfra',
      },
      {
        id: 'PS-MOH-RW',
        title: 'PS Ministry of Health (MoH Rwanda)',
        permSecretary: 'Permanent Secretary (Ministry of Health Rwanda)',
        code: 'PS-MOH-RW-2026',
        sector: 'SOCIAL',
        mandate: 'Mutuelle de Santé Community Insurance, Health Posts, RMS Medical Supply Telemetry & CHW Networks',
        slaScore: '95.9%',
        macroSpeedHours: 17.0,
        cabinetDeliveryIndex: 96.8,
        deptId: 'moh_rw',
      },
      {
        id: 'PS-MINEDUC-RW',
        title: 'PS Ministry of Education (MINEDUC)',
        permSecretary: 'Permanent Secretary (MINEDUC)',
        code: 'PS-MINEDUC-RW-2026',
        sector: 'SOCIAL',
        mandate: '12-Year Basic Education Capitation, REB Classroom Infrastructure & School Feeding Audits',
        slaScore: '93.2%',
        macroSpeedHours: 20.5,
        cabinetDeliveryIndex: 94.1,
        deptId: 'mineduc',
      },
      {
        id: 'PS-MINICT-RW',
        title: 'PS Ministry of ICT & Innovation (MINICT)',
        permSecretary: 'Permanent Secretary (MINICT)',
        code: 'PS-MINICT-RW-2026',
        sector: 'GOVERNANCE',
        mandate: 'Irembo e-Government Services, RISA Smart Districts, Offline USSD Gateways & Digital Literacy Hubs',
        slaScore: '97.5%',
        macroSpeedHours: 14.0,
        cabinetDeliveryIndex: 98.0,
        deptId: 'minict',
      },
      {
        id: 'PS-MINAGRI-RW',
        title: 'PS Ministry of Agriculture & Animal Resources (MINAGRI)',
        permSecretary: 'Permanent Secretary (MINAGRI)',
        code: 'PS-MINAGRI-RW-2026',
        sector: 'GOVERNANCE',
        mandate: 'RAB Crop Intensification, Smart Nkunganire Inputs, Terracing Protection & Veterinary Services',
        slaScore: '92.8%',
        macroSpeedHours: 21.4,
        cabinetDeliveryIndex: 93.5,
        deptId: 'minagri',
      },
      {
        id: 'PS-PRIMATURE-RW',
        title: 'Office of the Prime Minister (Primature Delivery Unit)',
        permSecretary: 'Cabinet Secretary (Primature Rwanda)',
        code: 'PS-PRIMATURE-RW-2026',
        sector: 'GOVERNANCE',
        mandate: 'National Umushyikirano & Imihigo Performance Contracts, Cross-Ministerial Coordination & Citizen Escalations',
        slaScore: '96.0%',
        macroSpeedHours: 17.5,
        cabinetDeliveryIndex: 96.5,
        deptId: 'primature_rw',
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

export interface CountryRolloutConfig {
  countryCode: CountryCode;
  countryName: string;
  superadmin: {
    name: string;
    title: string;
    ministry: string;
    code: string;
  };
  nodes: RolloutDistrictNode[];
  sisterMinistries: SisterMinistryNode[];
}

export function getCountryRolloutConfig(countryCode: CountryCode): CountryRolloutConfig {
  const code = (countryCode || 'UG').toUpperCase();
  const arrangement = getNationalRolloutArrangements(code);
  const countryObj = COUNTRIES[code] || COUNTRIES.UG;
  const nodes = getRolloutNodesForCountry(code);
  const sisterMinistries = getSisterMinistriesForCountry(code);

  return {
    countryCode: code,
    countryName: countryObj.name,
    superadmin: {
      name: arrangement.superadminSubtitle || `${countryObj.name} National Accounting Officer`,
      title: arrangement.superadminTitle || `Permanent Secretary, Ministry of Local Government (${countryObj.name})`,
      ministry: arrangement.superadminMinistry || `${countryObj.name} Ministry of Local Government & Devolution`,
      code: arrangement.superadminRefCode || `PS-MOLG-${code}-2026`,
    },
    nodes,
    sisterMinistries,
  };
}
