import { CountryCode } from '../types';
import { COUNTRIES } from './countries';

export interface OmbudsmanBureauSpec {
  id: string;
  name: string;
  location: string;
  officer: string;
  phone: string;
  coverage: string;
  activeCases: number;
  status: 'high_priority' | 'active';
}

export interface OmbudsmanExecSpec {
  id: string;
  title: string;
  name: string;
  mandate: string;
  email: string;
  phone: string;
  division: string;
}

export interface CountryGovernanceSchema {
  countryCode: CountryCode;
  countryName: string;
  currency: string;
  phonePrefix: string;
  samplePhone: string;
  codePrefix: string;

  // Apex Territorial Ministry / Superadmin
  superadminMinistry: string;
  superadminMinistryShort: string;
  superadminDeptId: string;
  superadminTitle: string;
  superadminHolder: string;
  superadminVoteLabel: string;
  cabinetMinisterName: string;
  stateMinisterName: string;

  // Constitutional & Statutory Citations
  constitutionalAuthority: string;
  cabinetMandateCitation: string;
  localGovLawTier3: string;
  localGovLawTier2: string;
  localGovLawTier1: string;
  fiscalAct: string;
  fiscalGrantName: string;
  fiscalProgramName: string;

  // Tier Labels & Plurals
  tier3Label: string;
  tier3Short: string;
  tier3Plural: string;
  tier3UnitLabel: string;
  tier3MetroLabel: string;
  tier3MetroBadge: string;

  tier2Label: string;
  tier2Short: string;
  tier2Plural: string;
  tier2UnitLabel: string;

  tier1Label: string;
  tier1Short: string;
  tier1Plural: string;
  tier1UnitLabel: string;
  tier1CommitteeName: string;

  // Grassroots Labels (for getPostGrassroots)
  grassrootsUnits: {
    tier3Suffix: string;
    tier2Suffix: string;
    tier1Suffix: string;
    villageLabel: string;
  };

  // Geographic Regions (for filtering CAOs/Counties/Districts)
  regions: string[];

  // Sample Jurisdictions for Directives & Audit
  sampleJurisdictions: string[];
  auditExemplarDesks: {
    name: string;
    score: string;
    count: number;
    status: string;
  }[];

  // Ombudsman / Anti-Corruption Constitutional Body
  ombudsman: {
    name: string;
    shortName: string;
    headTitle: string;
    headName: string;
    constitutionalBasis: string;
    mandateSummary: string;
    whistleblowingAct: string;
    regionalNetworkLabel: string;
    regionalHubCountLabel: string;
    executives: OmbudsmanExecSpec[];
    bureaus: OmbudsmanBureauSpec[];
    whistleblowerSamples: {
      ref: string;
      tag: string;
      time: string;
      title: string;
      evidence: string;
    }[];
  };

  // Utility / Statutory Agency Profile (Tier 4)
  utilityAgency: {
    waterName: string;
    waterAct: string;
    powerName: string;
    roadsName: string;
    roadsAct: string;
    revenueName: string;
    revenueAct: string;
    execLeadName: string;
    execEmailDomain: string;
    vehiclePrefix: string;
    regions: {
      id: string;
      name: string;
      head: string;
      coverage: string;
      branches: {
        id: string;
        name: string;
        manager: string;
        phone: string;
        crewLead: string;
        facility: string;
        activeTickets: number;
        slaScore: string;
      }[];
    }[];
  };

  // Commercial & Civic Engagement Context (for Billing & Comms tabs)
  billingContext: {
    authorityCountDesc: string;
    annualFeeFormatted: string;
    annualArrTotalFormatted: string;
    mediaChannels: string;
    scoutNetworkLabel: string;
    scoutRewardSample: string;
    indexPressNames: string;
    corporateSponsors: string;
    mobilityPartners: string;
  };
}

const BESPOKE_GOVERNANCE: Record<string, CountryGovernanceSchema> = {
  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    currency: 'UGX',
    phonePrefix: '+256',
    samplePhone: '+256 772 000 000',
    codePrefix: 'UG',
    superadminMinistry: 'Ministry of Local Government (MoLG)',
    superadminMinistryShort: 'MoLG',
    superadminDeptId: 'molg',
    superadminTitle: 'Permanent Secretary, Ministry of Local Government (PS MoLG)',
    superadminHolder: 'Ben Kumumanya',
    superadminVoteLabel: 'Vote 011',
    cabinetMinisterName: 'Hon. Balaam Barugahara Ateenyi',
    stateMinisterName: 'Hon. Justine Nameere',
    constitutionalAuthority: 'Article 174 of the 1995 Constitution and Local Governments Act (Cap. 243)',
    cabinetMandateCitation: 'Constitution Articles 111 & 117 vs Article 174 & PFMA 2015 Section 45',
    localGovLawTier3: 'Section 64 of the Local Governments Act (Cap. 243)',
    localGovLawTier2: 'Section 69 of the Local Governments Act (Cap. 243)',
    localGovLawTier1: 'Section 45 of the Local Governments Act (Cap. 243) & PDM Operational Framework',
    fiscalAct: 'Public Finance Management Act (PFMA 2015, S.15 & S.45)',
    fiscalGrantName: 'DDEG Fiscal Compliance',
    fiscalProgramName: 'PDM SACCO',
    tier3Label: 'Chief Administrative Officer (CAO)',
    tier3Short: 'CAO',
    tier3Plural: 'Chief Administrative Officers (CAOs) & Cities',
    tier3UnitLabel: 'District Local Government',
    tier3MetroLabel: 'Strategic Cities',
    tier3MetroBadge: '10 Cities + KCCA',
    tier2Label: 'Senior Assistant Secretary (SAS) / Sub-County Chief',
    tier2Short: 'SAS / Sub-County Chief',
    tier2Plural: 'Sub-County Chiefs & SAS',
    tier2UnitLabel: 'Sub-County LLG Station',
    tier1Label: 'Parish Chief / Town Agent',
    tier1Short: 'Parish Chief',
    tier1Plural: 'Parish Chiefs & Town Agents',
    tier1UnitLabel: 'Parish Frontline Unit',
    tier1CommitteeName: 'Parish Development Committee (PDC)',
    grassrootsUnits: {
      tier3Suffix: 'District',
      tier2Suffix: 'Subcounty',
      tier1Suffix: 'Parish',
      villageLabel: 'LC1 Village',
    },
    regions: ['NORTHERN', 'CENTRAL', 'EASTERN', 'WESTERN'],
    sampleJurisdictions: [
      'Wakiso District (Kira, Nansana, Entebbe)',
      'Kampala Capital City Authority (KCCA)',
      'Arua District & City (West Nile)',
      'Mbale City & District (Bugisu)',
      'Mbarara City & District (Ankole)',
      'Gulu City & District (Acholi)',
      'Jinja City & District (Busoga)',
      'All 146 Districts & 11 Cities (National Circular)',
    ],
    auditExemplarDesks: [
      { name: 'KCCA Engineering & Roads Maintenance', score: '97.4%', count: 48, status: 'Exemplar' },
      { name: 'NWSC Rapid Leak Repair Dispatch', score: '96.1%', count: 62, status: 'Exemplar' },
      { name: 'Makindye Division Health Inspectorate', score: '92.3%', count: 31, status: 'Compliant' },
      { name: 'Nakawa Urban Agriculture & CDO Desk', score: '91.0%', count: 24, status: 'Compliant' },
    ],
    ombudsman: {
      name: 'Inspectorate of Government (IGG)',
      shortName: 'IGG',
      headTitle: 'Inspector General of Government (IGG)',
      headName: 'Hon. Beti Kamya Turwomwe',
      constitutionalBasis: 'Chapter 13 (Articles 223–232) of the 1995 Constitution & Inspectorate of Government Act',
      mandateSummary: 'Supreme constitutional mandate to eliminate corruption, redress administrative injustice, and enforce the Leadership Code of Conduct across all MDAs and Local Governments.',
      whistleblowingAct: 'Whistleblowers Protection Act 2010',
      regionalNetworkLabel: '16 Regional Ombudsman Bureaus ensure citizens in all 146 districts can access the IGG without travelling to Kampala.',
      regionalHubCountLabel: '16 Regional Bureaus Active',
      executives: [
        { id: 'igg-apex', title: 'Inspector General of Government (IGG)', name: 'Hon. Beti Kamya Turwomwe', mandate: 'Constitutional Head of the Inspectorate of Government (Chapter 13 Ombudsman).', email: 'igg@igg.go.ug', phone: '+256 414 344 219', division: 'Executive Chambers' },
        { id: 'digg-anti-corruption', title: 'Deputy IGG (Anti-Corruption)', name: 'Anne Twinomugisha Muhairwe', mandate: 'Supervises Directorate of Anti-Corruption, Special Investigations, and Asset Recovery.', email: 'digg.corruption@igg.go.ug', phone: '+256 414 344 220', division: 'Special Investigations Wing' },
        { id: 'digg-ombudsman', title: 'Deputy IGG (Ombudsman Affairs)', name: 'Dr. Patricia Achan Okiria', mandate: 'Supervises Directorate of Ombudsman Affairs and Administrative Justice.', email: 'digg.ombudsman@igg.go.ug', phone: '+256 414 344 221', division: 'Ombudsman & Grievance Wing' },
        { id: 'sec-inspectorate', title: 'Secretary to the Inspectorate', name: 'Mrs. Rose Kafeero', mandate: 'Accounting Officer responsible for national bureau warrants and personnel.', email: 'secretary@igg.go.ug', phone: '+256 414 344 225', division: 'Administration & Finance' },
      ],
      bureaus: [
        { id: 'bur-kla', name: 'Kampala Metropolitan Regional Bureau', location: 'Jubilee Insurance Centre, Parliament Ave, Kampala', officer: 'Mr. David Makumbi (Senior Regional Inspector)', phone: '+256 414 259 788', coverage: 'Kampala, Wakiso, Mukono, Mpigi', activeCases: 89, status: 'high_priority' },
        { id: 'bur-gul', name: 'Gulu Regional Ombudsman Bureau', location: 'Plot 17, Airfield Road, Gulu City', officer: 'Ms. Grace Atim (Senior Regional Inspector)', phone: '+256 471 432 021', coverage: 'Gulu, Kitgum, Pader, Omoro, Nwoya', activeCases: 42, status: 'active' },
        { id: 'bur-mbr', name: 'Mbarara Regional Ombudsman Bureau', location: 'Plot 1, High Street, Mbarara City', officer: 'Mr. Hillary Katusiime (Senior Regional Inspector)', phone: '+256 485 421 002', coverage: 'Mbarara, Ntungamo, Bushenyi, Isingiro', activeCases: 47, status: 'active' },
        { id: 'bur-jnj', name: 'Jinja Regional Ombudsman Bureau', location: 'Plot 35, Bell Avenue West, Jinja City', officer: 'Mr. Isaac Baliddawa (Senior Regional Inspector)', phone: '+256 434 122 890', coverage: 'Jinja, Iganga, Kamuli, Mayuge', activeCases: 35, status: 'active' },
      ],
      whistleblowerSamples: [
        { ref: 'WB-UG-2026-0812', tag: 'High Confidence', time: '2h ago', title: 'Payroll Anomaly Audit (Tororo District)', evidence: 'Bank disbursement vouchers flagged for verification against active Biometric Staff Register.' },
        { ref: 'WB-UG-2026-0809', tag: 'Urgent Capex', time: 'Yesterday', title: 'Culvert Substitution on Feeder Road (Mbale Municipal)', evidence: 'Inspection photos show unreinforced pipe installed against 900mm reinforced concrete bill of quantities.' },
      ],
    },
    utilityAgency: {
      waterName: 'National Water and Sewerage Corporation (NWSC)',
      waterAct: 'National Water & Sewerage Corporation Act (Cap 317)',
      powerName: 'UEDCL / Umeme Electricity Grid Authority',
      roadsName: 'Uganda National Roads Authority (UNRA)',
      roadsAct: 'Uganda National Roads Authority Act 2006',
      revenueName: 'Uganda Revenue Authority (URA)',
      revenueAct: 'Uganda Revenue Authority Act (Cap 196)',
      execLeadName: 'Dr. Eng. Silver Mugisha',
      execEmailDomain: 'nwsc.co.ug',
      vehiclePrefix: 'UG',
      regions: [
        {
          id: 'kla-metro',
          name: 'Kampala Water Metro Directorate',
          head: 'Eng. Mahmood Lutaaya (Director KW)',
          coverage: 'Kampala Central, Nakawa, Kawempe, Makindye, Rubaga, Mukono',
          branches: [
            { id: 'br-nakasero', name: 'Nakasero / CBD Branch', manager: 'Eng. Paul Kibirige', phone: '+256 772 100 201', crewLead: 'Joseph Katamba', facility: 'Ggaba I, II & III Water Works', activeTickets: 5, slaScore: '96%' },
            { id: 'br-nakawa', name: 'Nakawa & Bugolobi Branch', manager: 'Eng. Sarah Nanteza', phone: '+256 772 100 202', crewLead: 'David Okot', facility: 'Bugolobi Wastewater Plant', activeTickets: 8, slaScore: '92%' },
          ],
        },
        {
          id: 'eastern-reg',
          name: 'Eastern Industrial & Nile Region',
          head: 'Eng. Agnes Akello (Regional Manager)',
          coverage: 'Jinja, Iganga, Mbale, Tororo, Soroti',
          branches: [
            { id: 'br-jinja', name: 'Jinja Nile Source Area', manager: 'Eng. Andrew Nabeta', phone: '+256 772 100 206', crewLead: 'Isaac Wafula', facility: 'Masese Water Works', activeTickets: 4, slaScore: '95%' },
          ],
        },
      ],
    },
    billingContext: {
      authorityCountDesc: '146 districts, 10 city authorities, and 31 municipalities',
      annualFeeFormatted: 'UGX 30,000,000 (~$8,100)',
      annualArrTotalFormatted: 'UGX 4.38 Billion / Year ($1.18M USD)',
      mediaChannels: 'CBS, Capital FM, KFM, Radio Simba',
      scoutNetworkLabel: 'Bodaboda Scout Network across Kampala, Entebbe & Jinja',
      scoutRewardSample: 'UGX 1,000 airtime vouchers',
      indexPressNames: 'New Vision & Daily Monitor',
      corporateSponsors: 'MTN Uganda, Airtel Uganda, Stanbic, Nile Breweries, TotalEnergies',
      mobilityPartners: 'SafeBoda, Jumia, DHL Uganda',
    },
  },

  RW: {
    countryCode: 'RW',
    countryName: 'Rwanda',
    currency: 'RWF',
    phonePrefix: '+250',
    samplePhone: '+250 788 000 000',
    codePrefix: 'RW',
    superadminMinistry: 'Ministry of Local Government (MINALOC)',
    superadminMinistryShort: 'MINALOC',
    superadminDeptId: 'minaloc',
    superadminTitle: 'Permanent Secretary, Ministry of Local Government (PS MINALOC)',
    superadminHolder: 'Permanent Secretary MINALOC',
    superadminVoteLabel: 'MINALOC Budget Program',
    cabinetMinisterName: 'Minister of Local Government (MINALOC)',
    stateMinisterName: 'Minister of State for Socio-Economic Development',
    constitutionalAuthority: 'Law N° 05/2018 Governing Administrative Entities & National Decentralization Policy (Imihigo)',
    cabinetMandateCitation: 'Constitution of the Republic of Rwanda (Arts. 112 & 120) · MINALOC Administrative Accountability',
    localGovLawTier3: 'Law Governing Districts (Uturere) — District Executive Committee & Mayor / District ES Oversight',
    localGovLawTier2: 'MINALOC Sector Administration Charter — Umurenge Executive Secretary Mandate',
    localGovLawTier1: 'MINALOC Cell & Umudugudu Governance Standards (Akagari Executive Secretary)',
    fiscalAct: 'Organic Law on State Finances and Property & MINECOFIN Imihigo Contracts',
    fiscalGrantName: 'MINECOFIN Block Grant & Imihigo Compliance',
    fiscalProgramName: 'Umurenge SACCO / VUP',
    tier3Label: 'District Mayor / District Executive Secretary (Akarere)',
    tier3Short: 'Mayor / District ES',
    tier3Plural: 'District Mayors & City of Kigali (30 Districts)',
    tier3UnitLabel: 'Akarere (District) Administration',
    tier3MetroLabel: 'Kigali & Secondary Cities',
    tier3MetroBadge: 'Kigali + 6 Secondary Cities',
    tier2Label: 'Sector Executive Secretary (Umunyamabanga w’Umurenge)',
    tier2Short: 'Sector ES',
    tier2Plural: 'Sector Executive Secretaries (416 Imirenge)',
    tier2UnitLabel: 'Umurenge (Sector) Station',
    tier1Label: 'Cell Executive Secretary (Umunyamabanga w’Akagari)',
    tier1Short: 'Cell ES',
    tier1Plural: 'Cell Executive Secretaries (2,148 Utugari)',
    tier1UnitLabel: 'Akagari (Cell) Frontline Unit',
    tier1CommitteeName: 'Cell Council & Imihigo Monitoring Committee',
    grassrootsUnits: {
      tier3Suffix: 'District',
      tier2Suffix: 'Sector',
      tier1Suffix: 'Cell',
      villageLabel: 'Umudugudu (Village)',
    },
    regions: ['KIGALI', 'NORTHERN', 'SOUTHERN', 'EASTERN', 'WESTERN'],
    sampleJurisdictions: [
      'City of Kigali',
      'Gasabo District (Kigali)',
      'Kicukiro District (Kigali)',
      'Nyarugenge District (Kigali)',
      'Musanze District (Northern)',
      'Huye District (Southern)',
      'Rubavu District (Western)',
      'Rwamagana District (Eastern)',
      'All 30 Districts & 5 Provinces (National Circular)',
    ],
    auditExemplarDesks: [
      { name: 'City of Kigali Urban Infrastructure & Master Plan Desk', score: '98.1%', count: 64, status: 'Exemplar' },
      { name: 'WASAC Kigali Water Distribution Rapid Response', score: '96.7%', count: 52, status: 'Exemplar' },
      { name: 'Gasabo District Remera Sector Citizen Charter Desk', score: '95.2%', count: 38, status: 'Exemplar' },
      { name: 'REG EUCL National Grid Outage Restoration Unit', score: '94.6%', count: 41, status: 'Compliant' },
    ],
    ombudsman: {
      name: "Office of the Ombudsman (Urwego rw'Umuvunyi)",
      shortName: 'Ombudsman (RW)',
      headTitle: 'Chief Ombudsman of the Republic of Rwanda',
      headName: 'Chief Ombudsman Chambers',
      constitutionalBasis: 'Article 139 of the Constitution of Rwanda & Law N° 76/2013 Establishing the Office of the Ombudsman',
      mandateSummary: 'Constitutional mandate to act as a bridge between citizens and public institutions, prevent and fight injustice, corruption, and declare public leaders’ wealth.',
      whistleblowingAct: 'Law on Protection of Whistleblowers (Law N° 44bis/2017)',
      regionalNetworkLabel: 'Decentralized Anti-Injustice & Imihigo Integrity Desks serving all 5 Provinces and 30 Districts.',
      regionalHubCountLabel: '5 Provincial Desks Active',
      executives: [
        { id: 'rw-omb-chief', title: 'Chief Ombudsman (Umuvunyi Mukuru)', name: 'Chief Ombudsman Desk', mandate: 'Supreme oversight of injustice, corruption prevention, and asset declarations across all MDAs & Districts.', email: 'ombudsman@ombudsman.gov.rw', phone: '+250 788 183 000', division: 'Executive Chambers' },
        { id: 'rw-omb-dep-corr', title: 'Deputy Ombudsman (Preventing & Fighting Corruption)', name: 'Deputy Ombudsman (Anti-Corruption)', mandate: 'Special financial investigations, asset declaration audits, and public procurement verification.', email: 'anticorruption@ombudsman.gov.rw', phone: '+250 788 183 002', division: 'Anti-Corruption & Asset Recovery' },
        { id: 'rw-omb-dep-inj', title: 'Deputy Ombudsman (Preventing & Fighting Injustice)', name: 'Deputy Ombudsman (Administrative Justice)', mandate: 'Citizen petition resolution, court judgment review petitions, and local administration mediation.', email: 'injustice@ombudsman.gov.rw', phone: '+250 788 183 003', division: 'Injustice & Citizen Petitions' },
        { id: 'rw-omb-ps', title: 'Permanent Secretary (Urwego rw’Umuvunyi)', name: 'Permanent Secretary Desk', mandate: 'Accounting Officer managing decentralized anti-corruption outreach campaigns and Imihigo integrity audits.', email: 'ps@ombudsman.gov.rw', phone: '+250 788 183 005', division: 'Secretariat & Operations' },
      ],
      bureaus: [
        { id: 'bur-rw-kgl', name: 'Kigali City Central Integrity Desk', location: 'Kimihurura, Gasabo District, Kigali', officer: 'Senior Injustice & Integrity Inspector', phone: '+250 788 301 100', coverage: 'Gasabo, Kicukiro, Nyarugenge', activeCases: 34, status: 'high_priority' },
        { id: 'bur-rw-nor', name: 'Northern Province Liaison Bureau (Musanze)', location: 'Muhoza Sector, Musanze District', officer: 'Provincial Ombudsman Coordinator', phone: '+250 788 301 102', coverage: 'Musanze, Burera, Gakenke, Gicumbi, Rulindo', activeCases: 18, status: 'active' },
        { id: 'bur-rw-sou', name: 'Southern Province Liaison Bureau (Huye)', location: 'Ngoma Sector, Huye District', officer: 'Provincial Ombudsman Coordinator', phone: '+250 788 301 104', coverage: 'Huye, Gisagara, Kamonyi, Muhanga, Nyanza, Nyamagabe, Nyaruguru, Ruhango', activeCases: 22, status: 'active' },
        { id: 'bur-rw-est', name: 'Eastern Province Liaison Bureau (Rwamagana)', location: 'Kigabiro Sector, Rwamagana District', officer: 'Provincial Ombudsman Coordinator', phone: '+250 788 301 106', coverage: 'Rwamagana, Bugesera, Gatsibo, Kayonza, Kirehe, Ngoma, Nyagatare', activeCases: 21, status: 'active' },
        { id: 'bur-rw-wes', name: 'Western Province Liaison Bureau (Karongi)', location: 'Bwishyura Sector, Karongi District', officer: 'Provincial Ombudsman Coordinator', phone: '+250 788 301 108', coverage: 'Karongi, Ngororero, Nyabihu, Nyamasheke, Rubavu, Rusizi, Rutsiro', activeCases: 19, status: 'active' },
      ],
      whistleblowerSamples: [
        { ref: 'WB-RW-2026-0411', tag: 'Imihigo Review', time: '3h ago', title: 'Sub-Standard Rural Bridge Culvert Inspection (Rwamagana)', evidence: 'Geotagged site inspection photos compared against MININFRA/RTDA technical specifications.' },
        { ref: 'WB-RW-2026-0398', tag: 'Procurement Audit', time: 'Yesterday', title: 'Delayed VUP Direct Support Transfer Reconciliation (Gatsibo)', evidence: 'Cell committee ledger discrepancy flagged for RPPA & Ombudsman review.' },
      ],
    },
    utilityAgency: {
      waterName: 'Water and Sanitation Corporation (WASAC Group)',
      waterAct: 'Law Establishing WASAC & RURA Water Service Regulations',
      powerName: 'Rwanda Energy Group (REG / EUCL)',
      roadsName: 'Rwanda Transport Development Agency (RTDA)',
      roadsAct: 'Law Establishing Rwanda Transport Development Agency',
      revenueName: 'Rwanda Revenue Authority (RRA)',
      revenueAct: 'Law Establishing Rwanda Revenue Authority',
      execLeadName: 'Chief Executive Officer (WASAC / REG)',
      execEmailDomain: 'wasac.rw',
      vehiclePrefix: 'RGP',
      regions: [
        {
          id: 'rw-kigali-grid',
          name: 'City of Kigali Metropolitan Network',
          head: 'Director of Kigali Urban Operations',
          coverage: 'Gasabo, Kicukiro, Nyarugenge Sectors',
          branches: [
            { id: 'rw-br-remera', name: 'Remera & Kimironko Branch', manager: 'Branch Operations Manager', phone: '+250 788 400 101', crewLead: 'Kigali Rapid Response Team A', facility: 'Nzove & Kimisagara Water Treatment Plants', activeTickets: 4, slaScore: '97%' },
            { id: 'rw-br-nyarugenge', name: 'Nyarugenge CBD Branch', manager: 'CBD Network Manager', phone: '+250 788 400 102', crewLead: 'Kigali Rapid Response Team B', facility: 'Kigali Central Reservoir & Trunk Mains', activeTickets: 3, slaScore: '96%' },
          ],
        },
        {
          id: 'rw-provinces-grid',
          name: 'Secondary Cities & Provincial Networks',
          head: 'Regional Infrastructure Director',
          coverage: 'Musanze, Rubavu, Huye, Rwamagana, Rusizi, Nyagatare',
          branches: [
            { id: 'rw-br-musanze', name: 'Musanze & Rubavu Branch', manager: 'Northern/Western Area Manager', phone: '+250 788 400 201', crewLead: 'Volcanic Region Crew', facility: 'Mutobo Water Supply System', activeTickets: 2, slaScore: '95%' },
            { id: 'rw-br-huye', name: 'Huye & Southern Network Branch', manager: 'Southern Area Manager', phone: '+250 788 400 202', crewLead: 'Southern Corridor Crew', facility: 'Kadaho & Mpanda Treatment Works', activeTickets: 3, slaScore: '94%' },
          ],
        },
      ],
    },
    billingContext: {
      authorityCountDesc: '30 districts, City of Kigali, and 416 Sectors',
      annualFeeFormatted: 'RWF 10,000,000 (~$7,500)',
      annualArrTotalFormatted: 'RWF 310 Million / Year ($232K+ USD)',
      mediaChannels: 'Radio Rwanda, KT Radio, Flash FM, RBA Broadcast',
      scoutNetworkLabel: 'Moto-Taxi & Youth Digital Scouts across Kigali, Musanze & Huye',
      scoutRewardSample: 'RWF 1,000 airtime / MTN MoMo perks',
      indexPressNames: 'The New Times & IGIHE',
      corporateSponsors: 'MTN Rwanda, Airtel Rwanda, Bank of Kigali, Bralirwa',
      mobilityPartners: 'Yego Moto, Move, DHL Rwanda',
    },
  },

  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    currency: 'KES',
    phonePrefix: '+254',
    samplePhone: '+254 712 000 000',
    codePrefix: 'KE',
    superadminMinistry: 'State Department for Devolution (Ministry of Interior & National Administration)',
    superadminMinistryShort: 'Devolution',
    superadminDeptId: 'devolution_ke',
    superadminTitle: 'Principal Secretary, State Department for Devolution (PS Devolution)',
    superadminHolder: 'Teresia Mbaika (PS Devolution)',
    superadminVoteLabel: 'State Dept Vote 1024',
    cabinetMinisterName: 'Cabinet Secretary for Interior & Devolution',
    stateMinisterName: 'Principal Secretary (Intergovernmental Relations)',
    constitutionalAuthority: 'Constitution of Kenya 2010 (Chapter 11 & Fourth Schedule) & County Governments Act 2012',
    cabinetMandateCitation: 'Constitution of Kenya Arts. 152–155 vs Chapter 11 Devolved Governance & PFM Act 2012',
    localGovLawTier3: 'Sections 44–47 of the County Governments Act 2012 (County Secretary & CECMs)',
    localGovLawTier2: 'Section 50 of the County Governments Act 2012 (Sub-County Administrators)',
    localGovLawTier1: 'Section 51 of the County Governments Act 2012 (Ward Administrators & Village Councils)',
    fiscalAct: 'Public Finance Management Act (PFM 2012) & County Allocation of Revenue Act (CARA)',
    fiscalGrantName: 'Equitable Revenue Share & IFMIS Compliance',
    fiscalProgramName: 'Ward Development / Hustler Fund',
    tier3Label: 'County Secretary / CECM',
    tier3Short: 'County CECM / Sec',
    tier3Plural: 'County Governments & City Counties (47 Counties)',
    tier3UnitLabel: 'County Government Headquarters',
    tier3MetroLabel: 'Chartered City Counties',
    tier3MetroBadge: 'Nairobi, Mombasa, Kisumu, Nakuru, Eldoret',
    tier2Label: 'Sub-County Administrator',
    tier2Short: 'Sub-County Admin',
    tier2Plural: 'Sub-County Administrators (290 Constituencies)',
    tier2UnitLabel: 'Sub-County Administrative Unit',
    tier1Label: 'Ward Administrator',
    tier1Short: 'Ward Admin',
    tier1Plural: 'Ward Administrators (1,450 Wards)',
    tier1UnitLabel: 'Devolved Ward Command Unit',
    tier1CommitteeName: 'Ward Development & Public Participation Forum',
    grassrootsUnits: {
      tier3Suffix: 'County',
      tier2Suffix: 'Sub-County',
      tier1Suffix: 'Ward',
      villageLabel: 'Village Unit',
    },
    regions: ['NAIROBI', 'CENTRAL', 'COAST', 'EASTERN', 'NYANZA', 'RIFT VALLEY', 'WESTERN', 'NORTH EASTERN'],
    sampleJurisdictions: [
      'Nairobi City County',
      'Mombasa County (Coast)',
      'Kisumu County (Nyanza)',
      'Nakuru County (Rift Valley)',
      'Uasin Gishu County (Eldoret)',
      'Kiambu County (Central)',
      'Machakos County (Eastern)',
      'All 47 County Governments (Intergovernmental Circular)',
    ],
    auditExemplarDesks: [
      { name: 'Nairobi City County Roads & Stormwater Directorate', score: '96.2%', count: 84, status: 'Exemplar' },
      { name: 'KPLC Nairobi Rapid Transformer & Feeder Unit', score: '94.8%', count: 71, status: 'Exemplar' },
      { name: 'Mombasa County Public Health & Sanitation Desk', score: '92.4%', count: 43, status: 'Compliant' },
      { name: 'Kisumu County KIWASCO Last-Mile Water Desk', score: '91.5%', count: 36, status: 'Compliant' },
    ],
    ombudsman: {
      name: 'EACC & Office of the Ombudsman (CAJ)',
      shortName: 'EACC / CAJ',
      headTitle: 'Chairperson / Chief Executive Officer (EACC & CAJ)',
      headName: 'Commissioners & Accounting Officer',
      constitutionalBasis: 'Articles 59 & 79 of the Constitution of Kenya 2010 · EACC Act & CAJ Act 2011',
      mandateSummary: 'Combats economic crimes and county procurement malpractice (EACC) while resolving maladministration and citizen service delivery delays (Commission on Administrative Justice / Ombudsman).',
      whistleblowingAct: 'Bribery Act & Access to Information Act 2016',
      regionalNetworkLabel: 'Regional Ombudsman & EACC Ethics Bureaus spanning Nairobi, Mombasa, Kisumu, Eldoret, Nyeri, Garissa, Isiolo & Nakuru.',
      regionalHubCountLabel: '11 Regional Hubs Active',
      executives: [
        { id: 'ke-eacc-ceo', title: 'CEO / Secretary (Ethics & Anti-Corruption Commission)', name: 'EACC Executive Secretariat', mandate: 'Forensic anti-graft investigations, lifestyle audits, and county asset recovery.', email: 'integrity@integrity.go.ke', phone: '+254 20 271 7318', division: 'Anti-Corruption Directorate' },
        { id: 'ke-caj-chair', title: 'Chief Ombudsman (Commission on Administrative Justice)', name: 'Office of the Ombudsman (CAJ)', mandate: 'Administrative justice redress, maladministration inquiries, and Access to Information enforcement.', email: 'complain@ombudsman.go.ke', phone: '+254 20 227 0000', division: 'Administrative Justice Wing' },
      ],
      bureaus: [
        { id: 'bur-ke-nbo', name: 'Nairobi Integrity & Ombudsman HQ', location: 'Integrity Centre, Valley Road / Jakaya Kikwete Rd, Nairobi', officer: 'Senior Regional Investigator (Nairobi)', phone: '+254 20 499 7000', coverage: 'Nairobi, Kiambu, Kajiado, Machakos', activeCases: 112, status: 'high_priority' },
        { id: 'bur-ke-mba', name: 'Mombasa Coastal Regional Bureau', location: 'Treasury Square, Mombasa CBD', officer: 'Coastal Regional Ombudsman Officer', phone: '+254 41 231 9081', coverage: 'Mombasa, Kilifi, Kwale, Tana River, Lamu, Taita Taveta', activeCases: 54, status: 'active' },
        { id: 'bur-ke-ksm', name: 'Kisumu Lake Basin Regional Bureau', location: 'Jubilee Insurance House, Kisumu', officer: 'Western Regional Ombudsman Officer', phone: '+254 57 202 4120', coverage: 'Kisumu, Siaya, Homa Bay, Migori, Kisii, Nyamira', activeCases: 49, status: 'active' },
        { id: 'bur-ke-eld', name: 'Eldoret North Rift Bureau', location: 'Imperial Court, Uganda Road, Eldoret', officer: 'North Rift Regional Investigator', phone: '+254 53 203 3630', coverage: 'Uasin Gishu, Nandi, Trans Nzoia, Elgeyo Marakwet, Turkana', activeCases: 38, status: 'active' },
      ],
      whistleblowerSamples: [
        { ref: 'WB-KE-2026-0914', tag: 'County IFMIS Audit', time: '2h ago', title: 'Stalled County Hospital Wing Marked Certified (Eldoret)', evidence: 'Geotagged site audit shows structural roofing incomplete despite contractor milestone voucher.' },
        { ref: 'WB-KE-2026-0899', tag: 'Urgent Access', time: 'Yesterday', title: 'Pending Bills & Ward Bursary Verification Anomaly', evidence: 'Duplicate beneficiary IDs flagged prior to County Treasury disbursement.' },
      ],
    },
    utilityAgency: {
      waterName: 'Nairobi City Water & Sewerage Company (NCWSC)',
      waterAct: 'Water Act 2016 & WASREB Service Guidelines',
      powerName: 'Kenya Power (KPLC)',
      roadsName: 'Kenya National Highways Authority (KeNHA) / KeRRA',
      roadsAct: 'Kenya Roads Act 2007',
      revenueName: 'Kenya Revenue Authority (KRA)',
      revenueAct: 'Kenya Revenue Authority Act (Cap 469)',
      execLeadName: 'Managing Director (Utility Authority)',
      execEmailDomain: 'nairobiwater.co.ke',
      vehiclePrefix: 'GK',
      regions: [
        {
          id: 'ke-nbo-metro',
          name: 'Nairobi Metropolitan Utility Network',
          head: 'Regional Technical Director (Nairobi)',
          coverage: 'Westlands, Langata, Dagoretti, Embakasi, Kasarani, Starehe',
          branches: [
            { id: 'ke-br-westlands', name: 'Westlands & Parklands Area Office', manager: 'Eng. Area Coordinator', phone: '+254 703 080 101', crewLead: 'Nairobi Rapid Crew 01', facility: 'Kabete Treatment Works & Boosters', activeTickets: 7, slaScore: '93%' },
            { id: 'ke-br-karen', name: 'Karen & Langata Area Office', manager: 'Southern Corridor Manager', phone: '+254 703 080 102', crewLead: 'Langata Rapid Crew 02', facility: 'Ngethu Transmission Pipeline', activeTickets: 5, slaScore: '95%' },
          ],
        },
        {
          id: 'ke-coast-rift',
          name: 'Mombasa Coast & Rift Valley Corridor',
          head: 'Regional Operations Head',
          coverage: 'Mombasa, Nakuru, Eldoret, Kisumu',
          branches: [
            { id: 'ke-br-mombasa', name: 'Mombasa MOWASSCO Desk', manager: 'Coast Operations Lead', phone: '+254 703 080 201', crewLead: 'Coast Dispatch Team', facility: 'Mzima & Baricho Water Pipeline', activeTickets: 6, slaScore: '91%' },
          ],
        },
      ],
    },
    billingContext: {
      authorityCountDesc: '47 county governments and 290 sub-counties',
      annualFeeFormatted: 'KES 1,200,000 (~$9,200)',
      annualArrTotalFormatted: 'KES 56.4 Million / Year ($433K+ USD)',
      mediaChannels: 'Citizen TV/Radio, Classic 105, Radio Jambo, Kiss FM',
      scoutNetworkLabel: 'Boda-Boda & Matatu Stage Scouts across Nairobi, Mombasa & Kisumu',
      scoutRewardSample: 'KES 100 airtime / M-Pesa perks',
      indexPressNames: 'Daily Nation & The Standard',
      corporateSponsors: 'Safaricom, Equity Bank, KCB Group, East African Breweries',
      mobilityPartners: 'Little, SafeBoda, Jumia Kenya, DHL',
    },
  },
};

const REGIONAL_TEMPLATES = new Map<string, string[]>([
  ['TZ', ['DAR ES SALAAM', 'NORTHERN', 'SOUTHERN HIGHLANDS', 'LAKE ZONE', 'CENTRAL', 'COAST']],
  ['NG', ['NORTH CENTRAL', 'NORTH EAST', 'NORTH WEST', 'SOUTH EAST', 'SOUTH SOUTH', 'SOUTH WEST']],
  ['GH', ['GREATER ACCRA', 'ASHANTI', 'NORTHERN', 'EASTERN', 'WESTERN', 'VOLTA']],
  ['ZA', ['GAUTENG', 'WESTERN CAPE', 'KWAZULU-NATAL', 'EASTERN CAPE', 'LIMPOPO', 'FREE STATE']],
  ['US', ['NORTHEAST', 'MIDWEST', 'SOUTH', 'WEST']],
  ['GB', ['LONDON', 'SOUTH EAST', 'MIDLANDS', 'NORTH', 'SCOTLAND', 'WALES']],
  ['DE', ['NORD', 'WEST', 'SÜDWEST', 'BAYERN', 'OST']],
  ['IN', ['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL', 'NORTH EAST']],
  ['ET', ['ADDIS ABABA', 'OROMIA', 'AMHARA', 'TIGRAY', 'SIDAMA', 'SOMALI']],
  ['EG', ['CAIRO METRO', 'DELTA', 'ALEXANDRIA', 'UPPER EGYPT', 'SUEZ CANAL']],
  ['SN', ['DAKAR', 'THIÈS', 'SAINT-LOUIS', 'KAOLACK', 'ZIGUINCHOR']],
  ['ZM', ['LUSAKA', 'COPPERBELT', 'SOUTHERN', 'EASTERN', 'NORTHERN']],
  ['ZW', ['HARARE', 'BULAWAYO', 'MASHONALAND', 'MANICALAND', 'MIDLANDS']],
  ['CN', ['NORTH CHINA', 'EAST CHINA', 'SOUTH CHINA', 'SOUTHWEST', 'NORTHWEST']],
  ['JP', ['KANTO', 'KANSAI', 'CHUBU', 'KYUSHU', 'TOHOKU']],
  ['FR', ['ÎLE-DE-FRANCE', 'AUVERGNE-RHÔNE-ALPES', 'NOUVELLE-AQUITAINE', 'OCCITANIE', 'GRAND EST']],
]);

export function getCountryGovernanceSchema(countryCode?: CountryCode): CountryGovernanceSchema {
  const code = ((countryCode || 'UG') as string).toUpperCase();
  if (BESPOKE_GOVERNANCE[code]) {
    return BESPOKE_GOVERNANCE[code];
  }

  const cInfo = COUNTRIES[code] || {
    name: code,
    flag: code,
    currency: 'USD',
    id_label: 'National ID',
    node: `${code}_NODE_01`,
  };
  const countryName = cInfo.name;
  const currency = cInfo.currency || 'USD';
  const phonePrefix = (cInfo as any).phoneCode ? `+${(cInfo as any).phoneCode}` : '+00';
  const regions = REGIONAL_TEMPLATES.get(code) || ['CAPITAL', 'NORTHERN', 'SOUTHERN', 'EASTERN', 'WESTERN'];

  // Country-specific terminology overlays for major bespoke nations without full block overrides
  const presets: Record<string, Partial<CountryGovernanceSchema>> = {
    NG: {
      superadminMinistry: 'Federal Ministry of Special Duties & Intergovernmental Affairs',
      superadminMinistryShort: 'Intergovernmental',
      superadminTitle: 'Permanent Secretary (Intergovernmental & LGA Affairs)',
      constitutionalAuthority: '1999 Constitution of the Federal Republic of Nigeria (Section 7) & Local Government Laws',
      localGovLawTier3: 'State Ministry of Local Government & Chieftaincy Affairs Regulations',
      localGovLawTier2: 'Local Government Area (LGA) Administration Bye-Laws',
      localGovLawTier1: 'Ward Development & Community Council Mandate',
      fiscalAct: 'Fiscal Responsibility Act & FAAC Statutory Allocation Guidelines',
      fiscalGrantName: 'FAAC Allocation & Budget Transparency',
      fiscalProgramName: 'Ward Development Grant',
      tier3Label: 'State Commissioner / LGA Executive Chairman',
      tier3Short: 'LGA Chairman',
      tier3Plural: 'State Commissioners & LGA Chairmen (774 LGAs)',
      tier3UnitLabel: 'Local Government Area (LGA)',
      tier3MetroLabel: 'FCT & State Capitals',
      tier3MetroBadge: 'FCT Abuja + 36 States',
      tier2Label: 'Head of Local Government Administration (HLGA)',
      tier2Short: 'HLGA / Council Sec',
      tier2Plural: 'Council Secretaries & HLGAs',
      tier2UnitLabel: 'Council Secretariat',
      tier1Label: 'Ward Councillor / Community Desk Officer',
      tier1Short: 'Ward Officer',
      tier1Plural: 'Ward Councillors & Community Desks (8,812 Wards)',
      tier1UnitLabel: 'Ward Command Unit',
      tier1CommitteeName: 'Ward Development Committee (WDC)',
      grassrootsUnits: { tier3Suffix: 'LGA / State', tier2Suffix: 'Council Area', tier1Suffix: 'Ward', villageLabel: 'Community' },
      ombudsman: {
        name: 'Public Complaints Commission (PCC) & ICPC',
        shortName: 'PCC / ICPC',
        headTitle: 'Chief Commissioner (Public Complaints Commission)',
        headName: 'Chief Commissioner (PCC Nigeria)',
        constitutionalBasis: 'Public Complaints Commission Act (Cap P37) & ICPC Act',
        mandateSummary: 'Constitutional Ombudsman and anti-corruption commission handling administrative injustice and public fund accountability across Federal, State, and 774 LGAs.',
        whistleblowingAct: 'Federal Whistleblower Policy & EFCC/ICPC Directives',
        regionalNetworkLabel: '36 State Ombudsman Offices + FCT Abuja Bureau serving all 774 Local Government Areas.',
        regionalHubCountLabel: '37 State & FCT Bureaus Active',
        executives: [
          { id: 'ng-pcc-chief', title: 'Chief Commissioner (PCC)', name: 'Chief Commissioner Chambers', mandate: 'Federal & State administrative redress across all 36 States & FCT.', email: 'complaints@pcc.gov.ng', phone: '+234 9 290 0000', division: 'Federal Ombudsman HQ' },
          { id: 'ng-icpc-chair', title: 'Chairman (ICPC)', name: 'Independent Corrupt Practices Commission', mandate: 'Constitutional anti-corruption and constituency project tracking.', email: 'info@icpc.gov.ng', phone: '+234 9 290 1100', division: 'Corruption Investigation Wing' },
        ],
        bureaus: [
          { id: 'bur-ng-fct', name: 'FCT Abuja Central Bureau', location: 'Central Business District, Abuja', officer: 'FCT Federal Commissioner', phone: '+234 9 290 1200', coverage: 'FCT Municipal Area Councils', activeCases: 94, status: 'high_priority' },
          { id: 'bur-ng-lag', name: 'Lagos State Regional Office', location: 'Alausa Secretariat Zone, Ikeja, Lagos', officer: 'Lagos State Ombudsman Commissioner', phone: '+234 1 290 2200', coverage: 'Lagos Mainland, Ikeja, Surulere, Eti-Osa', activeCases: 128, status: 'high_priority' },
        ],
        whistleblowerSamples: [
          { ref: 'WB-NG-2026-0721', tag: 'Constituency Capex', time: '2h ago', title: 'Unfinished Solar Borehole Project (Ikeja LGA)', evidence: 'Geotagged site audit shows drilling incomplete against LGA capital release.' },
        ],
      },
    },
    GH: {
      superadminMinistry: 'Ministry of Local Government, Decentralisation and Rural Development (MLGDRD)',
      superadminMinistryShort: 'MLGDRD',
      superadminTitle: 'Chief Director, Ministry of Local Government (MLGDRD)',
      constitutionalAuthority: '1992 Constitution (Chapter 20) & Local Governance Act, 2016 (Act 936)',
      localGovLawTier3: 'Local Governance Act 2016 (Act 936) — Regional Co-ordinating Council & MMDCEs',
      localGovLawTier2: 'Act 936 — Metropolitan, Municipal & District Co-ordinating Directorates',
      localGovLawTier1: 'Act 936 — Sub-Metropolitan / Zonal Council & Unit Committees',
      fiscalAct: 'Public Financial Management Act, 2016 (Act 921) & DACF Guidelines',
      fiscalGrantName: 'District Assemblies Common Fund (DACF) Compliance',
      fiscalProgramName: 'Assembly Development Grant',
      tier3Label: 'Metropolitan / Municipal / District Chief Executive (MMDCE)',
      tier3Short: 'MMDCE / MCD',
      tier3Plural: 'MMDCEs & Metro Assemblies (261 MMDAs)',
      tier3UnitLabel: 'MMDA Assembly',
      tier3MetroLabel: 'Metropolitan Assemblies',
      tier3MetroBadge: 'Accra, Kumasi, Tamale, Sekondi-Takoradi',
      tier2Label: 'Sub-Metro / Zonal Council Director',
      tier2Short: 'Zonal Director',
      tier2Plural: 'Sub-Metro & Zonal Councils',
      tier2UnitLabel: 'Zonal Council Station',
      tier1Label: 'Electoral Area Assembly Member / Unit Committee Chair',
      tier1Short: 'Assembly Member',
      tier1Plural: 'Electoral Area Assembly Members (6,270 Areas)',
      tier1UnitLabel: 'Electoral Area Unit',
      tier1CommitteeName: 'Unit Committee & Zonal Assembly',
      grassrootsUnits: { tier3Suffix: 'Region / MMDA', tier2Suffix: 'Assembly', tier1Suffix: 'Electoral Area', villageLabel: 'Community' },
      ombudsman: {
        name: 'CHRAJ (Commission on Human Rights & Administrative Justice)',
        shortName: 'CHRAJ',
        headTitle: 'Commissioner (CHRAJ Ghana)',
        headName: 'CHRAJ Commissioner Chambers',
        constitutionalBasis: 'Chapter 18 (Articles 216–230) of the 1992 Constitution of Ghana & Act 456',
        mandateSummary: 'Constitutional Ombudsman, Anti-Corruption & Human Rights institution investigating maladministration and public accountability across all 261 MMDAs.',
        whistleblowingAct: 'Whistleblower Act, 2006 (Act 720)',
        regionalNetworkLabel: '16 Regional Offices & District Complaints Desks across all 261 Metropolitan, Municipal & District Assemblies.',
        regionalHubCountLabel: '16 Regional Bureaus Active',
        executives: [
          { id: 'gh-chraj-comm', title: 'Commissioner (CHRAJ)', name: 'CHRAJ Apex Chambers', mandate: 'National Ombudsman, Anti-Corruption & Administrative Justice enforcement.', email: 'info@chraj.gov.gh', phone: '+233 302 664 267', division: 'Headquarters Accra' },
        ],
        bureaus: [
          { id: 'bur-gh-acc', name: 'Greater Accra Regional Bureau', location: 'Old Parliament House, High Street, Accra', officer: 'Regional CHRAJ Director', phone: '+233 302 668 839', coverage: 'Accra Metro, Tema Metro, Ga East/West', activeCases: 62, status: 'high_priority' },
          { id: 'bur-gh-kum', name: 'Ashanti Regional Bureau (Kumasi)', location: 'Ministries Block, Adum, Kumasi', officer: 'Ashanti Regional CHRAJ Director', phone: '+233 322 022 612', coverage: 'Kumasi Metro, Oforikrom, Asokwa', activeCases: 41, status: 'active' },
        ],
        whistleblowerSamples: [
          { ref: 'WB-GH-2026-0302', tag: 'DACF Audit', time: '4h ago', title: 'Stalled Drainage Slab Reconstruction (Accra Metro)', evidence: 'Inspection proof submitted under Act 720 Whistleblower Protection.' },
        ],
      },
    },
    TZ: {
      superadminMinistry: 'President’s Office – Regional Administration & Local Government (PO-RALG / TAMISEMI)',
      superadminMinistryShort: 'TAMISEMI',
      superadminTitle: 'Katibu Mkuu (Permanent Secretary, PO-RALG TAMISEMI)',
      constitutionalAuthority: 'Local Government Authorities Act (1982) & Constitution Articles 145–146',
      localGovLawTier3: 'Local Government (District & Urban Authorities) Act — DED & RAS Oversight',
      localGovLawTier2: 'Divisional / Municipal Council Administration Standing Orders',
      localGovLawTier1: 'Ward Executive Officer (Afisa Mtendaji wa Kata) Mandate',
      fiscalAct: 'Public Finance Act & Local Government Finances Act (Cap 290)',
      fiscalGrantName: 'Council Own-Source & Exchequer Compliance',
      fiscalProgramName: 'TASAF / Municipal Development Fund',
      tier3Label: 'District Executive Director (DED) / City Director',
      tier3Short: 'DED / RAS',
      tier3Plural: 'District & Municipal Executive Directors (184 LGAs)',
      tier3UnitLabel: 'Halmashauri (Council)',
      tier3MetroLabel: 'City Councils',
      tier3MetroBadge: 'Dar, Arusha, Mwanza, Dodoma, Mbeya, Tanga',
      tier2Label: 'Divisional Secretary / Council Officer',
      tier2Short: 'Division Secretary',
      tier2Plural: 'Divisional Administrative Desks',
      tier2UnitLabel: 'Tarafa / Division Station',
      tier1Label: 'Ward Executive Officer (WEO / Mtendaji wa Kata)',
      tier1Short: 'WEO (Kata)',
      tier1Plural: 'Ward Executive Officers (3,956 Kata)',
      tier1UnitLabel: 'Kata (Ward) Frontline Unit',
      tier1CommitteeName: 'Ward Development Committee (WDC)',
      grassrootsUnits: { tier3Suffix: 'Region / Council', tier2Suffix: 'Division', tier1Suffix: 'Ward (Kata)', villageLabel: 'Mtaa / Kijiji' },
      ombudsman: {
        name: 'TAKUKURU (PCCB) & Tume ya Haki za Binadamu (CHRAGG)',
        shortName: 'TAKUKURU / CHRAGG',
        headTitle: 'Director General (PCCB) & Ombudsman Chairman',
        headName: 'Director General (TAKUKURU)',
        constitutionalBasis: 'Prevention and Combating of Corruption Act & Articles 129–130 of the Constitution',
        mandateSummary: 'Anti-corruption enforcement (TAKUKURU) and public administrative justice / Ombudsman supervision (CHRAGG) across 31 Regions and 184 Councils.',
        whistleblowingAct: 'Whistleblower and Witness Protection Act (2015)',
        regionalNetworkLabel: '31 Regional Ombudsman & TAKUKURU Offices across Tanzania Mainland.',
        regionalHubCountLabel: '31 Regional Offices Active',
        executives: [
          { id: 'tz-pccb-dg', title: 'Director General (TAKUKURU / PCCB)', name: 'TAKUKURU Executive Chambers', mandate: 'National anti-corruption oversight and public project forensics.', email: 'info@pccb.go.tz', phone: '+255 26 232 1000', division: 'Dodoma HQ' },
        ],
        bureaus: [
          { id: 'bur-tz-dsm', name: 'Dar es Salaam Regional Bureau', location: 'Upanga / Samora Ave, Dar es Salaam', officer: 'Dar Regional Chief Commander', phone: '+255 22 215 0044', coverage: 'Ilala, Kinondoni, Temeke, Ubungo, Kigamboni', activeCases: 71, status: 'high_priority' },
        ],
        whistleblowerSamples: [
          { ref: 'WB-TZ-2026-0519', tag: 'Council Capex', time: '2h ago', title: 'Road Grading Material Variance (Ilala Council)', evidence: 'Geotagged inspection dossier uploaded by certified citizen scouts.' },
        ],
      },
    },
    ZA: {
      superadminMinistry: 'Department of Cooperative Governance and Traditional Affairs (CoGTA)',
      superadminMinistryShort: 'CoGTA',
      superadminTitle: 'Director-General, Department of Cooperative Governance (DG CoGTA)',
      constitutionalAuthority: 'Constitution of South Africa (Chapter 7), Municipal Systems Act (32 of 2000) & MFMA',
      localGovLawTier3: 'Municipal Finance Management Act (MFMA Act 56 of 2003) — Municipal Managers',
      localGovLawTier2: 'Municipal Structures Act — Sub-Council & Regional Directorates',
      localGovLawTier1: 'Municipal Systems Act Part 4 — Ward Committees & Councillors',
      fiscalAct: 'Public Finance Management Act (PFMA) & Municipal Finance Management Act (MFMA)',
      fiscalGrantName: 'MIG / Municipal Audit Compliance (AGSA)',
      fiscalProgramName: 'IDP / Ward Infrastructure Programme',
      tier3Label: 'Municipal Manager / Provincial HoD',
      tier3Short: 'Municipal Manager',
      tier3Plural: 'Municipal Managers & Metros (257 Municipalities)',
      tier3UnitLabel: 'Metropolitan / District Municipality',
      tier3MetroLabel: 'Category A Metros',
      tier3MetroBadge: '8 Metropolitan Municipalities',
      tier2Label: 'Regional Director / Sub-Council Manager',
      tier2Short: 'Sub-Council Mgr',
      tier2Plural: 'Regional & Sub-Council Administrations',
      tier2UnitLabel: 'Sub-Council Station',
      tier1Label: 'Ward Councillor / Ward Committee Liaison',
      tier1Short: 'Ward Liaison',
      tier1Plural: 'Ward Committees (4,468 Wards)',
      tier1UnitLabel: 'Municipal Ward Unit',
      tier1CommitteeName: 'Municipal Ward Committee (Batho Pele)',
      grassrootsUnits: { tier3Suffix: 'Province / Metro', tier2Suffix: 'Municipality', tier1Suffix: 'Ward', villageLabel: 'Suburb / Section' },
      ombudsman: {
        name: 'Public Protector South Africa (PPSA)',
        shortName: 'Public Protector',
        headTitle: 'Public Protector of the Republic of South Africa',
        headName: 'Public Protector Chambers (Pretoria)',
        constitutionalBasis: 'Chapter 9 (Section 182) of the Constitution & Public Protector Act (23 of 1994)',
        mandateSummary: 'Independent Chapter 9 Constitutional institution investigating improper conduct in state affairs and strengthening Batho Pele municipal service delivery.',
        whistleblowingAct: 'Protected Disclosures Act (Act 26 of 2000)',
        regionalNetworkLabel: '9 Provincial Offices & Regional Walk-In Centres across all 257 Municipalities.',
        regionalHubCountLabel: '9 Provincial Offices Active',
        executives: [
          { id: 'za-pp-head', title: 'Public Protector South Africa', name: 'Office of the Public Protector', mandate: 'Chapter 9 constitutional remedial action and maladministration investigations.', email: 'customerservice@pprotect.org', phone: '+27 12 366 7000', division: 'Pretoria National HQ' },
        ],
        bureaus: [
          { id: 'bur-za-gp', name: 'Gauteng Provincial Office', location: 'Hillcrest Office Park, Hatfield, Pretoria / Johannesburg', officer: 'Gauteng Provincial Representative', phone: '+27 11 220 2900', coverage: 'City of Joburg, Tshwane, Ekurhuleni', activeCases: 82, status: 'high_priority' },
          { id: 'bur-za-wc', name: 'Western Cape Provincial Office', location: '51 Wale Street, Cape Town', officer: 'Western Cape Provincial Representative', phone: '+27 21 423 8644', coverage: 'City of Cape Town, Winelands, Garden Route', activeCases: 46, status: 'active' },
        ],
        whistleblowerSamples: [
          { ref: 'WB-ZA-2026-0610', tag: 'MFMA Irregularity', time: '1h ago', title: 'Sub-Station Repair Tender Over-Invoicing (Gauteng)', evidence: 'Geotagged transformer inspection and SLA elapsed log.' },
        ],
      },
    },
    US: {
      superadminMinistry: 'U.S. Department of Housing & Urban Development / State Municipal League',
      superadminMinistryShort: 'Municipal / State',
      superadminTitle: 'Cabinet / State Secretary for Intergovernmental & Municipal Affairs',
      constitutionalAuthority: 'Municipal Home Rule Charters, County Ordinances & Title 2 CFR Public Accountability Standards',
      localGovLawTier3: 'County Administrative Code & Charter Provisions',
      localGovLawTier2: 'City Charter & Public Works Municipal Code',
      localGovLawTier1: 'Advisory Neighborhood Commission / District Precinct Mandate',
      fiscalAct: 'Title 2 CFR Uniform Guidance & Municipal Appropriations Code',
      fiscalGrantName: 'Municipal Capital Grant & GAO Compliance',
      fiscalProgramName: 'Community Development Block Grant (CDBG)',
      tier3Label: 'County Executive / County Judge',
      tier3Short: 'County Exec',
      tier3Plural: 'County Executives & Commissioners (3,143 Counties)',
      tier3UnitLabel: 'County Government',
      tier3MetroLabel: 'Consolidated Cities',
      tier3MetroBadge: 'Major Metro Authorities',
      tier2Label: 'City Manager / Public Works Director',
      tier2Short: 'City Manager',
      tier2Plural: 'City Managers & Municipal Heads',
      tier2UnitLabel: 'City Hall / Department',
      tier1Label: 'Ward Councillor / Neighborhood Commissioner (ANC)',
      tier1Short: 'Ward / ANC Rep',
      tier1Plural: 'Ward & Neighborhood Commissioners',
      tier1UnitLabel: 'Neighborhood / Ward District',
      tier1CommitteeName: 'Neighborhood Advisory Commission',
      grassrootsUnits: { tier3Suffix: 'County', tier2Suffix: 'City', tier1Suffix: 'District / Ward', villageLabel: 'Precinct' },
      ombudsman: {
        name: 'Office of Inspector General (OIG) & Municipal Ombudsman',
        shortName: 'OIG / Ombudsman',
        headTitle: 'Inspector General / City Ombudsman',
        headName: 'Office of the Inspector General',
        constitutionalBasis: 'Inspector General Act & Municipal Ethics Charters',
        mandateSummary: 'Independent audit, procurement integrity, and constituent grievance redress across county and municipal agencies.',
        whistleblowingAct: 'Whistleblower Protection Enhancement Act',
        regionalNetworkLabel: 'Federal & Municipal Inspector General field offices across States and Counties.',
        regionalHubCountLabel: 'Regional OIG Offices Active',
        executives: [
          { id: 'us-oig-head', title: 'Inspector General / Chief Ethics Officer', name: 'Office of Inspector General', mandate: 'Oversight of public works contracts, transit grants, and municipal SLAs.', email: 'hotline@oig.gov', phone: '+1 800 424 9121', division: 'Inspector General HQ' },
        ],
        bureaus: [
          { id: 'bur-us-tx', name: 'Travis County / Austin Integrity Office', location: '301 W 2nd Street, Austin, TX', officer: 'Municipal Auditor & Ombudsman', phone: '+1 512 974 2000', coverage: 'City of Austin & Travis County', activeCases: 29, status: 'active' },
        ],
        whistleblowerSamples: [
          { ref: 'WB-US-2026-0144', tag: 'Contract SLA', time: '3h ago', title: 'Stormwater Culvert Delay Beyond Work Order Window', evidence: 'Geotagged site photo vs. city contractor milestone schedule.' },
        ],
      },
    },
    GB: {
      superadminMinistry: 'Ministry of Housing, Communities and Local Government (MHCLG)',
      superadminMinistryShort: 'MHCLG',
      superadminTitle: 'Permanent Secretary (MHCLG Whitehall)',
      constitutionalAuthority: 'Local Government Act (1972 / 2000) & Best Value Statutory Duty',
      localGovLawTier3: 'Local Government Act — Council Chief Executive & Section 151 Officer',
      localGovLawTier2: 'Borough / District Public Realm & Highways Directorate',
      localGovLawTier1: 'Ward Councillor & Parish Council Clerk Mandate',
      fiscalAct: 'Local Government Finance Act & National Audit Office Code',
      fiscalGrantName: 'Local Authority Settlement & S.151 Compliance',
      fiscalProgramName: 'UK Shared Prosperity & Community Fund',
      tier3Label: 'Council Chief Executive',
      tier3Short: 'Chief Exec',
      tier3Plural: 'Council Chief Executives (333 Authorities)',
      tier3UnitLabel: 'Local Authority Council',
      tier3MetroLabel: 'Combined Authorities & London Boroughs',
      tier3MetroBadge: 'GLA + Combined Authorities',
      tier2Label: 'Borough / District Director',
      tier2Short: 'Borough Director',
      tier2Plural: 'Borough & Highways Directors',
      tier2UnitLabel: 'Borough Directorate',
      tier1Label: 'Ward Councillor / Parish Clerk',
      tier1Short: 'Ward Officer',
      tier1Plural: 'Ward & Parish Desks (9,500 Wards)',
      tier1UnitLabel: 'Ward Office Unit',
      tier1CommitteeName: 'Ward Panel & Parish Council',
      grassrootsUnits: { tier3Suffix: 'Council / County', tier2Suffix: 'Borough / Parish', tier1Suffix: 'Ward', villageLabel: 'Neighbourhood' },
      ombudsman: {
        name: 'Local Government and Social Care Ombudsman (LGSCO)',
        shortName: 'LGSCO',
        headTitle: 'Local Government and Social Care Ombudsman',
        headName: 'LGSCO Commissioners',
        constitutionalBasis: 'Local Government Act 1974 (Part III) & Parliamentary Commissioner Act',
        mandateSummary: 'Final independent stage for complaints against councils, social care, highways, and local public bodies across the United Kingdom.',
        whistleblowingAct: 'Public Interest Disclosure Act 1998 (PIDA)',
        regionalNetworkLabel: 'National Ombudsman Investigation Centres covering England, Scotland, Wales & Northern Ireland.',
        regionalHubCountLabel: 'UK Ombudsman Centres Active',
        executives: [
          { id: 'gb-lgsco-head', title: 'Local Government & Social Care Ombudsman', name: 'Ombudsman Executive Team', mandate: 'Independent adjudication of council service delivery and statutory remedy orders.', email: 'advice@lgo.org.uk', phone: '+44 300 061 0614', division: 'National Adjudication HQ' },
        ],
        bureaus: [
          { id: 'bur-gb-lon', name: 'London & South East Assessment Centre', location: '10th Floor, Millbank Tower, London', officer: 'Senior Ombudsman Investigator', phone: '+44 300 061 0614', coverage: 'Greater London Boroughs & South East', activeCases: 51, status: 'active' },
        ],
        whistleblowerSamples: [
          { ref: 'WB-GB-2026-0218', tag: 'Highways S.41', time: '5h ago', title: 'Unresolved Carriageway Subsidence (Camden Ward)', evidence: 'Time-stamped hazard report and inspection elapsed telemetry.' },
        ],
      },
    },
    DE: {
      superadminMinistry: 'Bundesministerium des Innern und für Heimat (BMI)',
      superadminMinistryShort: 'BMI',
      superadminTitle: 'Beamteter Staatssekretär (BMI Federal Administration)',
      constitutionalAuthority: 'Grundgesetz Artikel 28 (Kommunale Selbstverwaltung) & Kommunalverfassung',
      localGovLawTier3: 'Landkreisordnung / Gemeindeordnung — Landrat & Oberbürgermeister',
      localGovLawTier2: 'Bezirksverwaltungsgesetz — Bezirksamtsleiter & Tiefbauamt',
      localGovLawTier1: 'Ortsbeirat & Bürgeramt Geschäftsordnung',
      fiscalAct: 'Bundeshaushaltsordnung (BHO) & Kommunales Haushaltsrecht',
      fiscalGrantName: 'Kommunaler Finanzausgleich & BHO Compliance',
      fiscalProgramName: 'Städtebauförderung & Kommunale Infrastruktur',
      tier3Label: 'Landrat / Oberbürgermeister',
      tier3Short: 'Landrat / OB',
      tier3Plural: 'Landräte & Kreisfreie Städte (401 Kreise)',
      tier3UnitLabel: 'Landkreis / Kreisfreie Stadt',
      tier3MetroLabel: 'Stadtstaaten & Großstädte',
      tier3MetroBadge: 'Berlin, Hamburg, München, Köln, Frankfurt',
      tier2Label: 'Bezirksamtsleiter / Amtsdirektor',
      tier2Short: 'Amtsleiter',
      tier2Plural: 'Bezirksämter & Stadtteile',
      tier2UnitLabel: 'Bezirksamt / Stadtverwaltung',
      tier1Label: 'Ortsvorsteher / Bürgeramtsleiter',
      tier1Short: 'Ortsvorsteher',
      tier1Plural: 'Gemeinden & Ortsbezirke (10,753 Einheiten)',
      tier1UnitLabel: 'Bürgeramt / Kiez-Büro',
      tier1CommitteeName: 'Ortsbeirat & Bürgerversammlung',
      grassrootsUnits: { tier3Suffix: 'Stadt / Landkreis', tier2Suffix: 'Bezirk', tier1Suffix: 'Ortsteil', villageLabel: 'Kiez' },
    },
    IN: {
      superadminMinistry: 'Ministry of Panchayati Raj & Ministry of Housing & Urban Affairs',
      superadminMinistryShort: 'MoPR / MoHUA',
      superadminTitle: 'Secretary to Government of India (MoPR)',
      constitutionalAuthority: '73rd & 74th Constitutional Amendments (Panchayati Raj & Nagarpalika)',
      localGovLawTier3: 'District Collectorate / Magistrate Standing Orders',
      localGovLawTier2: 'Block Development Office & Municipal Executive Code',
      localGovLawTier1: 'Gram Panchayat & Urban Ward Sabha Charter',
      fiscalAct: 'General Financial Rules (GFR 2017) & State Finance Commission Grants',
      fiscalGrantName: '15th Finance Commission Grant & PFMS Compliance',
      fiscalProgramName: 'Gram Panchayat Development Plan (GPDP)',
      tier3Label: 'District Magistrate / Collector (DM / DC)',
      tier3Short: 'District Magistrate',
      tier3Plural: 'District Magistrates & Municipal Commissioners',
      tier3UnitLabel: 'District Collectorate',
      tier3MetroLabel: 'Metropolitan Corporations',
      tier3MetroBadge: 'Delhi, Mumbai, Bengaluru, Chennai, Kolkata',
      tier2Label: 'Block Development Officer (BDO) / SDM',
      tier2Short: 'BDO / SDM',
      tier2Plural: 'Block Development & Municipal Offices',
      tier2UnitLabel: 'Block / Sub-Division Station',
      tier1Label: 'Gram Panchayat Secretary / Ward Officer',
      tier1Short: 'Panchayat Sec.',
      tier1Plural: 'Gram Panchayats & Wards (255,000+)',
      tier1UnitLabel: 'Gram Panchayat / Ward Unit',
      tier1CommitteeName: 'Gram Sabha / Ward Committee',
      grassrootsUnits: { tier3Suffix: 'District', tier2Suffix: 'Block', tier1Suffix: 'Panchayat / Ward', villageLabel: 'Gram' },
    },
  };

  const p = presets[code] || {};

  const tier3Short = p.tier3Short || 'District Executive';
  const tier2Short = p.tier2Short || 'Municipal Admin';
  const tier1Short = p.tier1Short || 'Ward Officer';
  const fiscalGrantName = p.fiscalGrantName || `${countryName} Treasury & Municipal Compliance`;
  const fiscalProgramName = p.fiscalProgramName || `${countryName} Local Development Fund`;

  const ombudsmanName = p.ombudsman?.name || `${countryName} Office of the Ombudsman & Anti-Corruption Commission`;
  const ombudsmanShort = p.ombudsman?.shortName || `Ombudsman (${code})`;

  return {
    countryCode: code,
    countryName,
    currency,
    phonePrefix,
    samplePhone: `${phonePrefix} 700 000 000`,
    codePrefix: code,

    superadminMinistry: p.superadminMinistry || `${countryName} Ministry of Local Governance & Territorial Administration`,
    superadminMinistryShort: p.superadminMinistryShort || 'Local Gov',
    superadminDeptId: p.superadminDeptId || 'local_gov',
    superadminTitle: p.superadminTitle || `Permanent Secretary / Director-General of Local Governance (${countryName})`,
    superadminHolder: p.superadminHolder || `National Accounting Officer (${code})`,
    superadminVoteLabel: p.superadminVoteLabel || `${code} National Vote`,
    cabinetMinisterName: p.cabinetMinisterName || `Cabinet Minister for Local Governance (${countryName})`,
    stateMinisterName: p.stateMinisterName || `Minister of State / Deputy Minister (${countryName})`,

    constitutionalAuthority: p.constitutionalAuthority || `Constitutional Local Governance Provisions & Public Finance Management Act of ${countryName}`,
    cabinetMandateCitation: p.cabinetMandateCitation || `${countryName} Cabinet Executive Responsibility & Public Finance Accountability Framework`,
    localGovLawTier3: p.localGovLawTier3 || `${countryName} Local Government & Regional Administration Act`,
    localGovLawTier2: p.localGovLawTier2 || `${countryName} Municipal & Sub-District Administration Regulations`,
    localGovLawTier1: p.localGovLawTier1 || `${countryName} Grassroots Ward & Community Council Standing Orders`,
    fiscalAct: p.fiscalAct || `${countryName} Public Finance & Audit Act`,
    fiscalGrantName,
    fiscalProgramName,

    tier3Label: p.tier3Label || `Regional / District Accounting Officer (${countryName})`,
    tier3Short,
    tier3Plural: p.tier3Plural || `Regional & District Accounting Officers (${countryName})`,
    tier3UnitLabel: p.tier3UnitLabel || 'District / Regional Authority',
    tier3MetroLabel: p.tier3MetroLabel || 'Capital & Metropolitan Authorities',
    tier3MetroBadge: p.tier3MetroBadge || `${countryName} Metro Councils`,

    tier2Label: p.tier2Label || `Municipal / Council Administrator (${countryName})`,
    tier2Short,
    tier2Plural: p.tier2Plural || `Municipal & Sub-District Administrators`,
    tier2UnitLabel: p.tier2UnitLabel || 'Municipal / Sub-District Station',

    tier1Label: p.tier1Label || `Ward / Community Desk Officer (${countryName})`,
    tier1Short,
    tier1Plural: p.tier1Plural || `Ward & Community Desk Officers`,
    tier1UnitLabel: p.tier1UnitLabel || 'Local Ward / Community Unit',
    tier1CommitteeName: p.tier1CommitteeName || 'Local Development & Citizen Committee',

    grassrootsUnits: p.grassrootsUnits || {
      tier3Suffix: 'Region / District',
      tier2Suffix: 'Municipality',
      tier1Suffix: 'Ward',
      villageLabel: 'Community Zone',
    },

    regions,
    sampleJurisdictions: p.sampleJurisdictions || [
      `${countryName} Capital Metropolitan Council`,
      `${regions[1] || 'Northern'} Regional Authority`,
      `${regions[2] || 'Southern'} Regional Authority`,
      `All Sub-National Authorities (${countryName} National Circular)`,
    ],
    auditExemplarDesks: p.auditExemplarDesks || [
      { name: `${countryName} Capital Works & Roads Directorate`, score: '96.2%', count: 44, status: 'Exemplar' },
      { name: `${countryName} Water & Sanitation Rapid Dispatch`, score: '94.8%', count: 51, status: 'Exemplar' },
      { name: `${countryName} Metro Public Health Inspectorate`, score: '92.1%', count: 29, status: 'Compliant' },
      { name: `${countryName} Local Community Development Desk`, score: '90.4%', count: 22, status: 'Compliant' },
    ],

    ombudsman: p.ombudsman || {
      name: ombudsmanName,
      shortName: ombudsmanShort,
      headTitle: `Chief Ombudsman / Anti-Corruption Commissioner (${countryName})`,
      headName: `${countryName} Ombudsman Chambers`,
      constitutionalBasis: `Constitutional Ombudsman & Public Integrity Charter of ${countryName}`,
      mandateSummary: `Independent constitutional oversight to combat corruption, protect whistleblowers, and resolve citizen administrative grievances across all ministries and local authorities in ${countryName}.`,
      whistleblowingAct: `${countryName} Public Interest & Whistleblower Protection Framework`,
      regionalNetworkLabel: `Decentralized regional Ombudsman desks serving citizens nationwide across ${countryName}.`,
      regionalHubCountLabel: `National & Regional Bureaus Active`,
      executives: [
        {
          id: `${code.toLowerCase()}-omb-chief`,
          title: `Chief Ombudsman / Integrity Commissioner`,
          name: `${countryName} Ombudsman Secretariat`,
          mandate: `Supreme oversight of public service ethics, anti-corruption inquiries, and citizen administrative justice in ${countryName}.`,
          email: `ombudsman@gov.${code.toLowerCase()}`,
          phone: `${phonePrefix} 100 200`,
          division: 'Executive Chambers',
        },
        {
          id: `${code.toLowerCase()}-omb-dep`,
          title: `Deputy Commissioner (Special Investigations & Audit)`,
          name: `Forensic Audit & Compliance Wing`,
          mandate: `Procurement fraud verification, capex inspection audits, and public asset recovery.`,
          email: `audit@gov.${code.toLowerCase()}`,
          phone: `${phonePrefix} 100 202`,
          division: 'Special Investigations Wing',
        },
      ],
      bureaus: [
        {
          id: `bur-${code.toLowerCase()}-cap`,
          name: `${countryName} Capital Central Ombudsman Bureau`,
          location: `Government Civic Quarter, ${countryName}`,
          officer: `Senior Regional Inspector (${code})`,
          phone: `${phonePrefix} 100 301`,
          coverage: `Capital Metropolitan & Central Local Authorities`,
          activeCases: 38,
          status: 'high_priority',
        },
        {
          id: `bur-${code.toLowerCase()}-reg`,
          name: `${countryName} Regional Integrity Outreach Bureau`,
          location: `Provincial Administrative Centre`,
          officer: `Regional Ombudsman Officer`,
          phone: `${phonePrefix} 100 302`,
          coverage: `Provincial & Municipal Councils`,
          activeCases: 24,
          status: 'active',
        },
      ],
      whistleblowerSamples: [
        {
          ref: `WB-${code}-2026-0108`,
          tag: 'Capex Audit',
          time: '3h ago',
          title: `Infrastructure Material Variance Report (${countryName})`,
          evidence: `Geotagged field inspection dossier submitted under stripped-metadata whistleblower protection.`,
        },
        {
          ref: `WB-${code}-2026-0094`,
          tag: 'SLA Escalation',
          time: 'Yesterday',
          title: `Public Clinic Supply Chain Delay Flag (${countryName})`,
          evidence: `Verified stockout voucher audit queued for constitutional compliance review.`,
        },
      ],
    },

    utilityAgency: p.utilityAgency || {
      waterName: `${countryName} National Water & Sanitation Authority`,
      waterAct: `${countryName} Water Services & Public Utilities Act`,
      powerName: `${countryName} National Power Grid Corporation`,
      roadsName: `${countryName} National Roads & Highways Authority`,
      roadsAct: `${countryName} Roads & Transport Infrastructure Act`,
      revenueName: `${countryName} Revenue Authority`,
      revenueAct: `${countryName} Public Revenue Administration Act`,
      execLeadName: `Managing Director (${code} Public Utilities)`,
      execEmailDomain: `utilities.gov.${code.toLowerCase()}`,
      vehiclePrefix: code,
      regions: [
        {
          id: `${code.toLowerCase()}-cap-metro`,
          name: `${countryName} Capital Utility Directorate`,
          head: `Director of Metropolitan Infrastructure`,
          coverage: `Capital CBD, Inner Districts & Industrial Zones`,
          branches: [
            {
              id: `${code.toLowerCase()}-br-cbd`,
              name: `${countryName} Central Metro Branch`,
              manager: `Area Engineering Manager`,
              phone: `${phonePrefix} 200 101`,
              crewLead: `Metro Rapid Crew #01`,
              facility: `Central Treatment & Grid Substation`,
              activeTickets: 5,
              slaScore: '94%',
            },
            {
              id: `${code.toLowerCase()}-br-ind`,
              name: `${countryName} Industrial Corridor Branch`,
              manager: `Corridor Operations Lead`,
              phone: `${phonePrefix} 200 102`,
              crewLead: `Corridor Rapid Crew #02`,
              facility: `East Booster & Transmission Main`,
              activeTickets: 4,
              slaScore: '92%',
            },
          ],
        },
        {
          id: `${code.toLowerCase()}-reg-net`,
          name: `${countryName} Regional Distribution Network`,
          head: `Regional Utility Director`,
          coverage: `Provincial Cities & Rural Water Schemes`,
          branches: [
            {
              id: `${code.toLowerCase()}-br-prov`,
              name: `Provincial Area Operations Office`,
              manager: `Provincial Branch Manager`,
              phone: `${phonePrefix} 200 201`,
              crewLead: `Regional Field Maintenance Crew`,
              facility: `Regional Reservoir & Substation`,
              activeTickets: 3,
              slaScore: '91%',
            },
          ],
        },
      ],
    },

    billingContext: p.billingContext || {
      authorityCountDesc: `sub-national municipalities, districts, and metropolitan authorities across ${countryName}`,
      annualFeeFormatted: `${currency} 8,500 (~$8,500 USD eq.)`,
      annualArrTotalFormatted: `Scalable B2G ARR in ${countryName}`,
      mediaChannels: `National Public Broadcasters & Talk Radio across ${countryName}`,
      scoutNetworkLabel: `Licensed Transit & Delivery Scouts across ${countryName} urban hubs`,
      scoutRewardSample: `localized mobile airtime & voucher perks (${currency})`,
      indexPressNames: `${countryName} National Press & Business Dailies`,
      corporateSponsors: `Leading Telecoms, Commercial Banks & Energy Operators in ${countryName}`,
      mobilityPartners: `Regional Couriers, Logistics Fleets & Municipal Insurers`,
    },
  };
}
