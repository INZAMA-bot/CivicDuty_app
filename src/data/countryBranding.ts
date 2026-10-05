import { CountryCode } from '../types';

export interface CountryBrandingProfile {
  countryCode: CountryCode;
  countryName: string;
  flag: string;
  currency: string;
  culturalMotto: string;
  gazetteMasthead: string;
  gazetteTagline: string;
  localPhoneSlang: string; // e.g. "Mulika Mwizi", "Kabiriti", "Kitochi", "Palasa"
  primaryTelecoms: string[];
  ussdShortcode: string;

  // Creative B2B Commercial Advertising Campaign
  advertisingCampaign: {
    badge: string;
    campaignTitle: string;
    headline: string;
    body: string;
    callToAction: string;
    localLanguagePunchline: string;
    marketInsight: string;
    regulatorsMentioned: string[];
    typicalBusinesses: string[];
    churnStatistic: string;
    retentionBenefit: string;
    pricingNote: string;
  };

  // Customer Defection Dynamics (Copy for CustomerDefectionNotice)
  defectionNotice: {
    warningTag: string;
    headline: string;
    explanation: string;
    regulatorContrast: string;
    alternativePitch: string;
  };

  // Field Manual & Operational Guide Legal Frameworks
  fieldManual: {
    constitutionalBasis: string;
    pfmaAct: string;
    antiCorruptionAgency: {
      name: string;
      acronym: string;
      role: string;
    };
    ombudsmanAgency: {
      name: string;
      acronym?: string;
      role: string;
    };
    whistleblowerLegislation: string;
    accountingOfficerTitle: string;
    decentralizationModel: string;
    grassrootsUnit: string;
    tiers: {
      tierNumber: number;
      levelName: string;
      authority: string;
      description: string;
    }[];
    scenarios: {
      title: string;
      category: string;
      type: string;
      targetAgency: string;
      jurisdiction: string;
      sla: string;
      outcome: string;
      escalationPath: string;
    }[];
  };
}

export const COUNTRY_BRANDING: Record<CountryCode, CountryBrandingProfile> = {
  KE: {
    countryCode: 'KE',
    countryName: 'Kenya',
    flag: '🇰🇪',
    currency: 'KES',
    culturalMotto: 'Uzalendo Halisi · Haki Yetu, Jukumu Letu · Paza Sauti',
    gazetteMasthead: 'THE KENYA CITIZEN GAZETTE & DEVOLUTION DISPATCH',
    gazetteTagline: '47 COUNTIES · ONE SOVEREIGN VOICE · ZERO CORRUPTION',
    localPhoneSlang: 'Mulika Mwizi / Feature Phone',
    primaryTelecoms: ['Safaricom M-Pesa', 'Airtel Money'],
    ussdShortcode: '*3030*254#',
    advertisingCampaign: {
      badge: 'KENYA B2B MARKET RETENTION · KES PRICING',
      campaignTitle: 'Operation Customer Shield: Protect Your Market Share',
      headline: 'CAK & KEBS Enforce Standards, but 5-Star Customer Care Keeps Your Business Alive',
      body: 'Kenyans have zero patience for neglected complaints—from Upper Hill private hospitals and Westlands bistros to Matatu SACCOs in Rongai and international academies in Karen. When customers hit a wall, they do not wait for regulators; they switch their M-Pesa spend to your responsive competitors in seconds.',
      callToAction: 'Claim Your Verified Desk & Seal Your 24h SLA',
      localLanguagePunchline: 'Huduma Bora, Wateja Milele · Usipoteze Wateja Kwa Wapinzani',
      marketInsight: '83% of urban Kenyan consumers switch private service providers after just one unanswered service complaint.',
      regulatorsMentioned: ['Competition Authority of Kenya (CAK)', 'KEBS', 'Central Bank of Kenya (CBK)'],
      typicalBusinesses: ['Matatu SACCOs', 'Private Hospitals & Clinics', 'International Academies', 'SACCOs & Microfinance', 'Hospitality & Lodges'],
      churnStatistic: '83% defect within 48h of unresolved complaint',
      retentionBenefit: '+38% repeat client loyalty with active SLA badge',
      pricingNote: 'Transparent pricing in KES billed monthly or annually (save 17%).',
    },
    defectionNotice: {
      warningTag: 'KENYA CONSUMER RETENTION DYNAMICS',
      headline: 'Disaffected Customers Port Their M-Pesa to Competitors',
      explanation: 'In Kenya’s fast-moving market, customers won’t write lengthy petitions to the Competition Authority of Kenya (CAK) or KEBS. When complaints go cold, they instantly move tuition, medical insurance, transport fares, or dining spend to rival providers.',
      regulatorContrast: 'State regulators audit compliance, but customer care determines whether your enterprise survives next quarter.',
      alternativePitch: 'See the top customer-rated providers capturing defecting clients in this category:',
    },
    fieldManual: {
      constitutionalBasis: 'Constitution of Kenya 2010 (Articles 35 on Access to Information, 38, and 201 on Public Finance)',
      pfmaAct: 'Public Finance Management Act (PFMA) 2012 & County Governments Act 2012',
      antiCorruptionAgency: {
        name: 'Ethics and Anti-Corruption Commission',
        acronym: 'EACC',
        role: 'Statutory commission for corruption investigation and integrity enforcement under Chapter 6',
      },
      ombudsmanAgency: {
        name: 'Commission on Administrative Justice (CAJ / Ombudsman)',
        role: 'Quasi-judicial oversight over maladministration, abuse of power, and access to information',
      },
      whistleblowerLegislation: 'Kenya Witness Protection Act & Access to Information Act 2016',
      accountingOfficerTitle: 'County Executive Committee (CEC) Member / Chief Officer / County Secretary',
      decentralizationModel: 'Devolved System: 47 County Governments with Sub-Counties and Wards',
      grassrootsUnit: 'Ward',
      tiers: [
        {
          tierNumber: 1,
          levelName: 'Grassroots Ward Level (Ward Administrator & MCA Desk)',
          authority: 'Ward Administrator, Member of County Assembly (MCA), Village Elders',
          description: 'Immediate neighborhood governance. Handles local dispensaries, village roads, market water points, and ECD centers.',
        },
        {
          tierNumber: 2,
          levelName: 'Sub-County Level (Sub-County Administrator & Field Engineers)',
          authority: 'Sub-County Administrator, Sub-County Public Health Officer, Sub-County Engineer',
          description: 'Coordinates technical dispatch, ambulance routing, public health inspections, and municipal waste clearance.',
        },
        {
          tierNumber: 3,
          levelName: 'County Government HQ (County Governor, CECs & County Secretary)',
          authority: 'County Executive Committee (CEC) Members, Chief Officers, County Secretary',
          description: 'County treasury vote holders. Authorizes capital works, medical supplies tenders, and county-wide infrastructure contracts.',
        },
        {
          tierNumber: 4,
          levelName: 'National Line Ministries & State Corporations',
          authority: 'State Dept for Devolution, Ministry of Transport, KeNHA, KURA, Kenya Power (KPLC), Athi Water',
          description: 'National highway corridors, high-voltage transmission, bulk water schemes, and national regulatory enforcement.',
        },
        {
          tierNumber: 5,
          levelName: 'Sovereign Integrity & Fiscal Oversight',
          authority: 'Ethics and Anti-Corruption Commission (EACC), Auditor-General, Controller of Budget & CAJ',
          description: 'Constitutional watchdogs. Unresolved breaches trigger formal audit queries, asset tracing, and Senate summons.',
        },
      ],
      scenarios: [
        {
          title: 'Burst Water Main & Dry Taps in Residential Ward',
          category: 'Public Utility',
          type: '🟡 Amber Service Issue',
          targetAgency: 'Nairobi City Water & Sewerage Company (NCWSC) / Athi Water',
          jurisdiction: 'Local Ward Reticulation Network',
          sla: '24 Hours Mandatory Turnaround',
          outcome: 'Emergency valve crew dispatched. Pipe repaired with pressure sensor telemetry proof uploaded before green sign-off.',
          escalationPath: 'Ward Water Inspector → Sub-County Engineer → County CEC Water & Sanitation → Athi Water Works Development Agency.',
        },
        {
          title: 'Traffic Police Roadblock or County Askaris Extorting Bribes',
          category: 'Anti-Corruption & Ethics',
          type: '🔴 Red Sovereign Alert',
          targetAgency: 'Independent Policing Oversight Authority (IPOA) & EACC',
          jurisdiction: 'Traffic Patrol & Sub-County Enforcement',
          sla: '12 Hours Immediate Acknowledgment',
          outcome: 'Cryptographically hashed dispatch sent to IPOA and EACC Rapid Response. Complainant masked; officer body-cam/badge logged.',
          escalationPath: 'Direct bypass: Goes straight to IPOA County Liaison, EACC Integrity Ledger, and County Police Commander.',
        },
        {
          title: 'Private Hospital Demanding Exorbitant Upfront Cash Despite NHIF/SHIF',
          category: 'Private Consumer Provider',
          type: '🏢 Commercial Provider Claim Desk',
          targetAgency: 'Private Medical Provider Customer Care Desk',
          jurisdiction: 'Private Healthcare Facility Cluster',
          sla: '24 Hours Commercial SLA',
          outcome: 'Hospital CEO and Patient Ombudsman respond on official verified desk. Unresolved reports prompt patient defection to rival clinics.',
          escalationPath: 'Private Hospital Board Desk → CivicDuty Arbitration Desk → Kenya Medical Practitioners and Dentists Council (KMPDC).',
        },
        {
          title: 'Impassable Rural Feeder Road & Broken Culvert',
          category: 'Infrastructure & Works',
          type: '🟡 Amber Inspection Issue',
          targetAgency: 'Kenya Rural Roads Authority (KeRRA) / County Works Dept',
          jurisdiction: 'Sub-County Road Maintenance Unit',
          sla: '72 Hours Milestone Inspection',
          outcome: 'KeRRA grading contract tagged with GPS coordinates. Heavy earthmover allocation verified on public capital ledger.',
          escalationPath: 'Ward Administrator → Sub-County Engineer → County CEC Roads & Public Works → KeRRA Regional Director.',
        },
      ],
    },
  },

  UG: {
    countryCode: 'UG',
    countryName: 'Uganda',
    flag: '🇺🇬',
    currency: 'UGX',
    culturalMotto: 'Obuvunaanyizibwa Bwo, Eddembe Lyo · For God and My Country',
    gazetteMasthead: 'THE UGANDA REPUBLICK GAZETTE & PARISH MONITOR',
    gazetteTagline: '146 DISTRICTS · 10,594 PARISHES · PUBLIC INTEGRITY RECORD',
    localPhoneSlang: 'Kabiriti / Button Phone',
    primaryTelecoms: ['MTN MoMo', 'Airtel Money'],
    ussdShortcode: '*3030*256#',
    advertisingCampaign: {
      badge: 'UGANDA ENTERPRISE RETENTION · UGX PRICING',
      campaignTitle: 'Customer Obwesimbu: Protect Your Private Market Share',
      headline: 'UCC, UNBS & NDA Inspect, but Customer Trust Decides Market Survival',
      body: 'In Uganda’s competitive private market—from Kampala private clinics, Nakawa schools, to Masaka Boda SACCOs—disappointed clients will not wait for bureaucratic tribunals. When their grievances are left unattended, they move their hard-earned shillings directly to competitors across the trading centre.',
      callToAction: 'Claim Your Verified Desk & Activate Your 24h SLA',
      localLanguagePunchline: 'Kyusa Embeera, Kuuma Bakasitoma · Obwesimbu Bwe Bulamu Bwa Bizinesi',
      marketInsight: '79% of Ugandan private service consumers switch suppliers when an official complaint receives no feedback within 48 hours.',
      regulatorsMentioned: ['Uganda Communications Commission (UCC)', 'UNBS', 'National Drug Authority (NDA)'],
      typicalBusinesses: ['Private Health Centres', 'Secondary & Primary Academies', 'Boda & Taxi SACCOs', 'Microfinance SACCOs', 'Hospitality & Tour Lodges'],
      churnStatistic: '79% defect after 48h of silence',
      retentionBenefit: '+41% customer retention via verified CivicDuty Trust Badge',
      pricingNote: 'Convenient billing in UGX via MTN / Airtel Mobile Money or Card.',
    },
    defectionNotice: {
      warningTag: 'UGANDA CONSUMER CHURN DYNAMICS',
      headline: 'Frustrated Consumers Move Their Shillings to Competitors',
      explanation: 'In Uganda, private enterprise survives on community trust. When a private clinic, school, or transport SACCO leaves complaints unanswered, citizens don’t wait for UNBS or NDA inspections—they simply cross over to the next provider.',
      regulatorContrast: 'Regulators enforce the law, but timely customer care determines your revenue and customer loyalty.',
      alternativePitch: 'Top-rated alternative providers with active customer care desks in this category:',
    },
    fieldManual: {
      constitutionalBasis: 'Constitution of the Republic of Uganda 1995 (Article 17 on Civic Duties & Article 41 on Access to Information)',
      pfmaAct: 'Public Finance Management Act (PFMA) 2015 & Local Governments Act Cap 243',
      antiCorruptionAgency: {
        name: 'Inspectorate of Government',
        acronym: 'IGG',
        role: 'Constitutional watchdog empowered to investigate corruption, abuse of authority, and breach of leadership code',
      },
      ombudsmanAgency: {
        name: 'Public Complaints Desk (OPM & Ministry of Local Government)',
        role: 'Central monitoring and civic feedback coordination under the Office of the Prime Minister',
      },
      whistleblowerLegislation: 'Whistleblowers Protection Act 2010',
      accountingOfficerTitle: 'Chief Administrative Officer (CAO) / Town Clerk / Permanent Secretary',
      decentralizationModel: '5-Tier Local Government System: Districts, Sub-Counties, and Parishes',
      grassrootsUnit: 'Parish / Ward',
      tiers: [
        {
          tierNumber: 1,
          levelName: 'Parish Level (Parish Chief & LC2 Chair)',
          authority: 'Parish Chief, LC2 Executive Committee, Community Development Officer (CDO)',
          description: 'The foundation of the Parish Development Model (PDM). Coordinates primary schools, boreholes, and SACCO enterprise pillars.',
        },
        {
          tierNumber: 2,
          levelName: 'Sub-County / Town Council (Senior Assistant Secretary)',
          authority: 'Senior Assistant Secretary (SAS), Sub-County Chief, Health Inspector',
          description: 'Oversees health centre III facilities, feeder roads maintenance, and local revenue administration.',
        },
        {
          tierNumber: 3,
          levelName: 'District Local Government / City Authority (CAO Desk)',
          authority: 'Chief Administrative Officer (CAO), City Clerk, Resident District Commissioner (RDC)',
          description: 'Statutory vote accounting officer. Manages district engineering tenders, conditional grants, and civil service postings.',
        },
        {
          tierNumber: 4,
          levelName: 'National Line Ministries & Utilities',
          authority: 'Ministry of Local Government (MoLG), Ministry of Health, UNRA, NWSC, UEDCL',
          description: 'Bulk national utilities, trunk highways, national referral hospitals, and ministerial policy frameworks.',
        },
        {
          tierNumber: 5,
          levelName: 'Sovereign Integrity & Parliament Oversight',
          authority: 'Inspectorate of Government (IGG), Auditor General, State House Anti-Corruption Unit (SHACU)',
          description: 'Independent constitutional audit. Unresolved cases lead to statutory interdiction, asset recovery, and PAC hearings.',
        },
      ],
      scenarios: [
        {
          title: 'Broken Borehole Handpump in Rural Parish',
          category: 'Public Utility',
          type: '🟡 Amber Service Issue',
          targetAgency: 'District Water Engineering Office / NWSC',
          jurisdiction: 'Grassroots Parish Water Point',
          sla: '24 Hours Dispatch Commitment',
          outcome: 'District water technician dispatched. New cylinder fitted; water flow video verified by Parish Chief on the ledger.',
          escalationPath: 'Parish Chief → Sub-County SAS → District Water Officer → Ministry of Water & Environment.',
        },
        {
          title: 'Health Centre III Staff Demanding Cash for Free Government Medicine',
          category: 'Anti-Corruption & Ethics',
          type: '🔴 Red Sovereign Alert',
          targetAgency: 'District Health Officer / Inspectorate of Government (IGG)',
          jurisdiction: 'Sub-County Health Facility',
          sla: '12 Hours Emergency Acknowledgment',
          outcome: 'Citizen masked. Evidence routed to District CAO and IGG National Whistleblower Ledger. Pharmacy stock reconciliation triggered.',
          escalationPath: 'Direct bypass: Goes straight to District CAO, RDC Office, and IGG Regional Inspectorate.',
        },
        {
          title: 'Private Secondary School Demanding Unapproved Building Fund Fees',
          category: 'Private Consumer Provider',
          type: '🏢 Commercial Provider Claim Desk',
          targetAgency: 'Private Secondary School Board Desk',
          jurisdiction: 'Private Education Cluster',
          sla: '48 Hours Commercial SLA',
          outcome: 'School Bursar and Headteacher respond on verified desk. Unresolved tickets lower school trust score and cause enrollment transfers.',
          escalationPath: 'School Governing Board Desk → CivicDuty Arbiter → District Education Officer (DEO).',
        },
        {
          title: 'Collapsed Swamp Culvert Cutting Off Trading Centre Road',
          category: 'Infrastructure & Works',
          type: '🟡 Amber Inspection Issue',
          targetAgency: 'Uganda National Roads Authority (UNRA) / District Works',
          jurisdiction: 'Feeder Road Corridor',
          sla: '72 Hours Milestone Inspection',
          outcome: 'Culvert replacement contractor mobilized. Stone-pitching and drainage opening confirmed via geotagged photo proof.',
          escalationPath: 'Parish Road Committee → Sub-County SAS → District CAO → UNRA Station Manager.',
        },
      ],
    },
  },

  TZ: {
    countryCode: 'TZ',
    countryName: 'Tanzania',
    flag: '🇹🇿',
    currency: 'TZS',
    culturalMotto: 'Uhuru na Umoja · Haki na Wajibu · Kazi Iendelee Bila Rushwa',
    gazetteMasthead: 'GAZETI LA MWANANCHI NA UTENDAJI WA SERIKALI YA MTAA',
    gazetteTagline: 'MIKOA 31 · HALMASHAURI 184 · UWAJIBIKAJI KWA WANANCHI',
    localPhoneSlang: 'Kitochi / Simu ya Kawaida',
    primaryTelecoms: ['M-Pesa Tanzania', 'Airtel Money', 'Tigo Pesa'],
    ussdShortcode: '*3030*255#',
    advertisingCampaign: {
      badge: 'TANZANIA HUDUMA KWA WATEJA · TZS PRICING',
      campaignTitle: 'Kinga ya Biashara Yako: Zuia Wateja Kukimbilia Washindani',
      headline: 'TCRA, TBS na BOT Zinakagua, Lakini Kuridhika kwa Mteja Ndio Uhai wa Biashara',
      body: 'Katika soko linalokua la Dar es Salaam, Arusha, Mwanza na Dodoma—kutoka hospitali binafsi, shule za kimataifa, hadi SACCOS na mabasi ya mikoani—mteja asiyeridhika hasubiri mahakama au mamlaka za serikali. Anahamisha pesa zake mara moja kwenda kwa mpinzani wako mwenye huduma ya haraka.',
      callToAction: 'Washa Dawati Lako Lililothibitishwa Kulinda Wateja',
      localLanguagePunchline: 'Huduma Bora Ni Ngao Ya Biashara Yako · Usipoteze Wateja',
      marketInsight: '81% ya wateja wa sekta binafsi Tanzania huacha kutumia huduma baada ya malalamiko yao kutojibiwa ndani ya saa 48.',
      regulatorsMentioned: ['Mamlaka ya Mawasiliano Tanzania (TCRA)', 'TBS', 'Benki Kuu ya Tanzania (BOT)'],
      typicalBusinesses: ['Hospitali Binafsi', 'Shule Binafsi za Msingi na Sekondari', 'SACCOS na VICOBA', 'Mabasi ya Mikoani', 'Mahoteli na Utalii'],
      churnStatistic: '81% huhama huduma ndani ya siku mbili bila jibu',
      retentionBenefit: '+44% ongezeko la wateja wa kudumu ukiwa na Nembo ya CivicDuty',
      pricingNote: 'Malipo rahisi kwa TZS kupitia M-Pesa, Tigo Pesa au Airtel Money.',
    },
    defectionNotice: {
      warningTag: 'TANZANIA TABIA YA WATEJA SOKONI',
      headline: 'Wateja Waliochukizwa Wanahamia Kwa Washindani Moja kwa Moja',
      explanation: 'Hapa Tanzania, mteja aliyekatishwa tamaa hasubiri ukaguzi wa TBS au TCRA. Iwapo shule, hospitali au SACCOS haijibu kero zake, mteja anachukua fedha zake na kwenda kwa mshindani mwingine aliyetayari kutoa huduma bora.',
      regulatorContrast: 'Serikali inakagua kanuni, lakini weledi wa huduma kwa mteja ndio unalinda mapato yako.',
      alternativePitch: 'Watoa huduma wanaoongoza kwa ubora katika eneo hili:',
    },
    fieldManual: {
      constitutionalBasis: 'Katiba ya Jamhuri ya Muungano wa Tanzania 1977 (Ibara ya 18 juu ya Uhuru wa Kupata Habari)',
      pfmaAct: 'Sheria ya Fedha za Umma (Public Finance Act) & Sheria ya Serikali za Mitaa 1982',
      antiCorruptionAgency: {
        name: 'Taasisi ya Kuzuia na Kupambana na Rushwa',
        acronym: 'TAKUKURU / PCCB',
        role: 'Taasisi ya kisheria ya kuchunguza na kushtaki makosa ya rushwa na ubadhirifu wa mali ya umma',
      },
      ombudsmanAgency: {
        name: 'Tume ya Haki za Binadamu na Utawala Bora (THBUB)',
        role: 'Kulinda haki za kiraia na kuwajibisha vyombo vya utawala dhidi ya uonevu',
      },
      whistleblowerLegislation: 'Sheria ya Kulinda Watoa Taarifa na Mashahidi (Whistleblower and Witness Protection Act 2015)',
      accountingOfficerTitle: 'Mkurugenzi Mtendaji wa Halmashauri (DED) / Katibu Mkuu Wizara',
      decentralizationModel: 'Mfumo wa Ugatuaji wa Madaraka (D by D): Mikoa, Halmashauri, na Kata',
      grassrootsUnit: 'Kata (Ward)',
      tiers: [
        {
          tierNumber: 1,
          levelName: 'Ngazi ya Kijiji / Mtaa / Kitongoji',
          authority: 'Mwenyekiti wa Mtaa / Kijiji, Afisa Mtendaji wa Kijiji (VEO/MEO)',
          description: 'Utawala wa msingi wa kijamii. Unasimamia usalama wa mtaa, zahanati ndogo, na miradi ya maji ya kijiji.',
        },
        {
          tierNumber: 2,
          levelName: 'Ngazi ya Kata (Afisa Mtendaji wa Kata - WEO)',
          authority: 'Afisa Mtendaji wa Kata (WEO), Diwani wa Kata, Mganga Mfawidhi wa Kituo cha Afya',
          description: 'Kituo kikuu cha utekelezaji wa huduma za afya ya kata, barabara za mitaa na shule za kata.',
        },
        {
          tierNumber: 3,
          levelName: 'Ngazi ya Halmashauri / Wilaya (Mkurugenzi DED)',
          authority: 'Mkurugenzi Mtendaji wa Halmashauri (DED), Mkuu wa Wilaya (DC), Wakuu wa Idara',
          description: 'Mwenye mamlaka ya bajeti na kura ya fedha za umma. Husimamia manunuzi, TARURA na ujenzi wa miundombinu.',
        },
        {
          tierNumber: 4,
          levelName: 'Wizara za Kisekta na Mashirika ya Umma',
          authority: 'Ofisi ya Rais TAMISEMI, TANROADS, DAWASA/RUWASA, TANESCO, Wizara ya Afya',
          description: 'Uratibu wa kitaifa wa sera, miradi mikubwa ya maji, umeme wa gridi ya taifa na barabara kuu.',
        },
        {
          tierNumber: 5,
          levelName: 'Usimamizi wa Kikatiba na Bunge',
          authority: 'TAKUKURU, Mdhibiti na Mkaguzi Mkuu wa Hesabu za Serikali (CAG), Kamati za Bunge (PAC/LAAC)',
          description: 'Uchunguzi wa kisheria na ukaguzi wa fedha. Kesi zisizotatuliwa hupelekwa moja kwa moja ripoti ya CAG.',
        },
      ],
      scenarios: [
        {
          title: 'Bomba la Maji Kupasuka na Kukosa Maji Mtaani',
          category: 'Huduma za Maji',
          type: '🟡 Amber Service Issue',
          targetAgency: 'Mamlaka ya Maji Safi na Usafi wa Mazingira (DAWASA / RUWASA)',
          jurisdiction: 'Mtandao wa Maji wa Kata',
          sla: 'Saa 24 za Utekelezaji',
          outcome: 'Mafundi wanafika eneo la tukio, wanarekebisha bomba na kupakia ushahidi wa video wa mtiririko wa maji safi.',
          escalationPath: 'Mtendaji wa Kata (WEO) → Mhandisi wa Maji Wilaya → Mkurugenzi DED → Mamlaka Kuu ya Maji (DAWASA/RUWASA).',
        },
        {
          title: 'Mtendaji Kudai Rushwa Ili Kutoa Huduma ya Zahanati ya Umma',
          category: 'Kupinga Rushwa na Maadili',
          type: '🔴 Red Sovereign Alert',
          targetAgency: 'TAKUKURU Mkoa & Mganga Mkuu wa Wilaya (DMO)',
          jurisdiction: 'Kituo cha Afya cha Umma',
          sla: 'Saa 12 za Uthibitisho wa Haraka',
          outcome: 'Utambulisho wa mwananchi unafichwa kwa kanuni ya kidijitali. Taarifa inafunguliwa jalada rasmi TAKUKURU mara moja.',
          escalationPath: 'Njia ya mkato: Moja kwa moja kwa Afisa Mfawidhi TAKUKURU, Mkuu wa Wilaya (DC), na DED.',
        },
        {
          title: 'Shule Binafsi Kudai Malipo ya Ziada Yasiyoidhinishwa na Wizara',
          category: 'Mtoa Huduma Binafsi',
          type: '🏢 Commercial Provider Claim Desk',
          targetAgency: 'Bodi ya Shule Binafsi ya Sekondari',
          jurisdiction: 'Kanda ya Shule Binafsi',
          sla: 'Saa 48 za SLA ya Kibiashara',
          outcome: 'Mkuu wa Shule anajibu kwenye dawati rasmi lililothibitishwa. Kukosa kutatua kunashusha hadhi ya shule na kusababisha wazazi kuhama.',
          escalationPath: 'Dawati la Uongozi wa Shule → Msuluhishi wa CivicDuty → Afisa Elimu Wilaya (DEO).',
        },
        {
          title: 'Daraja la Mto Kubomoka na Kukata Mawasiliano ya Vijiji',
          category: 'Miundombinu na Ujenzi',
          type: '🟡 Amber Inspection Issue',
          targetAgency: 'Wakala wa Barabara Mijini na Vijijini (TARURA)',
          jurisdiction: 'Mtandao wa Barabara za Wilaya',
          sla: 'Saa 72 za Tathmini ya Kitaalamu',
          outcome: 'Mhandisi wa TARURA anafanya ukaguzi wa GPS na kuweka ratiba ya ukarabati kwenye daftari la wazi la wananchi.',
          escalationPath: 'Mtendaji wa Kijiji → Mtendaji wa Kata (WEO) → Mhandisi wa TARURA Wilaya → Mkurugenzi DED.',
        },
      ],
    },
  },

  RW: {
    countryCode: 'RW',
    countryName: 'Rwanda',
    flag: '🇷🇼',
    currency: 'RWF',
    culturalMotto: 'Uruhare Rwawe, Uburenganzira Bwawe · Imihigo n\'Iterambere',
    gazetteMasthead: 'IKINYAMAKURU CY\'UMUTURAGE N\'IMIHIGO Y\'INZEGO Z\'IBANZE',
    gazetteTagline: 'UTURERE 30 · IMIDUGUDU 14,837 · SERIVISI NZIZA N\'UBUNYAMWUGA',
    localPhoneSlang: 'Agatoroshi / Feature Phone',
    primaryTelecoms: ['MTN Mobile Money Rwanda', 'Airtel Money Rwanda'],
    ussdShortcode: '*3030*250#',
    advertisingCampaign: {
      badge: 'RWANDA SERIVISI NZIZA · RWF PRICING',
      campaignTitle: 'Kunoza Serivisi: Rinda Abakiriya Bitaruye Guhunga',
      headline: 'RURA na RSB Zikora Ubugenzuzi, Ariko Serivisi Nziza Ni Yo Ituma Ubucuruzi Buramba',
      body: 'Mu Rwanda rurangwa n’Imihigo n’umuvuduko w’iterambere, abakiriya bishakira serivisi zihuse, zizewe kandi zinoze. Iyo ivuriro ryigenga, ikigo cy’amashuri, cyangwa sosiyete y’ubwikorezi itinze gukemura ikibazo, abaguzi bahita bajya ku wundi mucuruzi uzobereye mu kubakira neza.',
      callToAction: 'Fata Umwirondoro W’Ubucuruzi Bwawe Kuri CivicDuty',
      localLanguagePunchline: 'Kunoza Serivisi · Icyizere Cy\'Abaguzi Cyubaka Ubucuruzi',
      marketInsight: '87% by’abakiriya mu Rwanda banga serivisi idasubiza ibibazo byabo mu masaha 24.',
      regulatorsMentioned: ['Rwanda Utilities Regulatory Authority (RURA)', 'Rwanda Standards Board (RSB)'],
      typicalBusinesses: ['Amavuriro Yigenga', 'Amashuri Yigenga', 'Koperative za Bisi na Tagisi', 'Ibigo by’Imari Iciriritse', 'Amahoteli n’Amafunguro'],
      churnStatistic: '87% bahindura umucuruzi mu masaha 24',
      retentionBenefit: '+46% y’abakiriya bakomeza kwizera serivisi zifite ikirango cya CivicDuty',
      pricingNote: 'Kwishyura byoroshye mu RWF ukoresheje MTN MoMo, Airtel Money cyangwa Ikarita.',
    },
    defectionNotice: {
      warningTag: 'RWANDA IMYITWARIRE Y\'ABAKIRIYA',
      headline: 'Abakiriya Barambiwe Bahita Bajya ku Bakora Neza',
      explanation: 'Umuco w’Imihigo no guhesha agaciro serivisi ntutuma abaguzi bategereza igihe kirekire. Iyo ikigo cyigenga kidatanze igisubizo cyihuse, abakiriya bahita bimukira ku kindi kigo gihangana na cyo.',
      regulatorContrast: 'Inzego za leta zishyiraho amategeko, ariko kwita ku mukiriya ni byo biha ubucuruzi bwawe kubaho.',
      alternativePitch: 'Dore ibigo bihiga ibindi mu gutanga serivisi zihuse muri iki cyiciro:',
    },
    fieldManual: {
      constitutionalBasis: 'Itegeko Nshinga rya Repubulika y\'u Rwanda ryo muri 2003 ryavuguruwe muri 2015 (Ingingo ya 38 ku burenganzira bwo kumenya amakuru)',
      pfmaAct: 'Itegeko Ngenga Rigenga Imari ya Leta & Itegeko Rigenga Ubuyobozi bw\'Inzego z\'Ibanze',
      antiCorruptionAgency: {
        name: 'Urwego rw\'Umuvunyi (Office of the Ombudsman)',
        acronym: 'OMBUDSMAN',
        role: 'Urwego rushinzwe kurwanya akarengane na ruswa mu nzego zose',
      },
      ombudsmanAgency: {
        name: 'Urwego rw\'Umuvunyi & RGB (Rwanda Governance Board)',
        role: 'Gukurikirana imiyoborere myiza n\'itangwa rya serivisi zinoze',
      },
      whistleblowerLegislation: 'Itegeko Rirengera Abatanga Amakuru ku Byaha bya Ruswa n\'Akarengane',
      accountingOfficerTitle: 'Umunyamabanga Nshingwabikorwa w\'Akarere / Umuyobozi w\'Akarere (Mayor)',
      decentralizationModel: 'Inzego z\'Ibanze: Intara, Uturere, Imirenge, Utugari n\'Imidugudu',
      grassrootsUnit: 'Umudugudu / Akagari',
      tiers: [
        {
          tierNumber: 1,
          levelName: 'Urwego rw\'Umudugudu n\'Akagari',
          authority: 'Umutware w\'Umudugudu, Umunyamabanga Nshingwabikorwa w\'Akagari (SEDO)',
          description: 'Intandaro y\'imiyoborere n\'ubufatanye bw\'abaturage. Icyiciro cyo gukemura ibibazo mu nteko z\'abaturage.',
        },
        {
          tierNumber: 2,
          levelName: 'Urwego rw\'Umurenge (Executive Secretary)',
          authority: 'Umunyamabanga Nshingwabikorwa w\'Umurenge, Ushinzwe Imibereho Myiza, Agronome',
          description: 'Gukurikirana ibigo nderabuzima, amashuri y\'ibanze, n\'itangwa rya serivisi z\'ubutaka.',
        },
        {
          tierNumber: 3,
          levelName: 'Urwego rw\'Akarere (Mayor / Executive Secretary Desk)',
          authority: 'Umuyobozi w\'Akarere (Mayor), Umunyamabanga Nshingwabikorwa w\'Akarere, Inama Njyanama',
          description: 'Ubuyobozi bwisumbuye bufite ingengo y\'imari n\'Imihigo y\'Akarere. Gushyira mu bikorwa imishinga minini.',
        },
        {
          tierNumber: 4,
          levelName: 'Inzego z\'Ubuyobozi Bukuru na Minisiteri',
          authority: 'MINALOC, MINISANTE, RTDA, WASAC, REG/EUCL',
          description: 'Gahunda z\'igihugu z\'amazi, amashanyarazi, imihanda minini, n\'ubuvuzi buhanitse.',
        },
        {
          tierNumber: 5,
          levelName: 'Ubugenzuzi Bukuru n\'Urwego rw\'Umuvunyi',
          authority: 'Urwego rw\'Umuvunyi, Umugenzuzi Mukuru w\'Imari ya Leta (OAG), RGB',
          description: 'Gukurikirana uko umutungo w\'igihugu ukoreshwa no guhana abanyereza ibya rubanda.',
        },
      ],
      scenarios: [
        {
          title: 'Imiyoboro y\'Amazi Yangiritse mu Kagari',
          category: 'Amazi n\'Isukura',
          type: '🟡 Amber Service Issue',
          targetAgency: 'WASAC Group & Urwego rw\'Umurenge',
          jurisdiction: 'Umuyoboro w\'Amazi mu Kagari',
          sla: 'Amasaha 24 yo Gukemura Ikibazo',
          outcome: 'Abatekinisiye ba WASAC bahagera vuba, bakosora umuyoboro, bagashyiraho ifoto n\'icyemezo cy\'amazi meza.',
          escalationPath: 'Akagari → Umurenge → Ubuyobozi bw\'Akarere (Mayor) → WASAC HQ.',
        },
        {
          title: 'Umukozi w\'Ibitaro Usaba Ruswa ku Buvuzi Bwishingiwe na Mutuelle de Santé',
          category: 'Kurwanya Ruswa',
          type: '🔴 Red Sovereign Alert',
          targetAgency: 'Urwego rw\'Umuvunyi & RIB',
          jurisdiction: 'Ibitaro by\'Akarere',
          sla: 'Amasaha 12 yo Gutangira Iperereza',
          outcome: 'Umuturage acungirwa umutekano ku buryo bw\'ibanga rikomeye. Dosije yoherezwa mu mushyikirano wihariye wa RIB n\'Umuvunyi.',
          escalationPath: 'Inzira yihuse: Igihita kijya ku Biro by\'Akarere, Urwego rw\'Umuvunyi, na RIB.',
        },
        {
          title: 'Ikigo cy\'Amashuri cyigenga Gihanitse Amafaranga Yisumbuye Bitunguranye',
          category: 'Ubucuruzi Bwigenga',
          type: '🏢 Commercial Provider Claim Desk',
          targetAgency: 'Ubuyobozi bw\'Ikigo cy\'Amashuri cyigenga',
          jurisdiction: 'Amashuri Yigenga',
          sla: 'Amasaha 48 y\'Ubucuruzi',
          outcome: 'Umuyobozi w\'ikigo asubiza ku mwirondoro wemewe w\'ikigo. Kutabikemura bituma ababyeyi bimura abana.',
          escalationPath: 'Ubuyobozi bw\'Ikigo → Abahuje Ibitekerezo ba CivicDuty → Umukozi Ushinzwe Uburezi mu Karere (DEO).',
        },
        {
          title: 'Umuhanda w\'Igitaka Wangiritse Bitewe n\'Imvura Nyinshi',
          category: 'Ibikorwa Remezo',
          type: '🟡 Amber Inspection Issue',
          targetAgency: 'RTDA & Ishami ry\'Ibikorwa Remezo mu Karere',
          jurisdiction: 'Umuhanda w\'Igitaka w\'Umurenge',
          sla: 'Amasaha 72 yo Gusuzuma no Gutegura Umushinga',
          outcome: 'Imashini zisibura inzira y\'amazi zigatunganya umuhanda, ibipimo byo mu kirere byemeza ko unyurwamo neza.',
          escalationPath: 'Akagari → Umurenge → Umuyobozi w\'Akarere Ushinzwe Iterambere ry\'Ubukungu → RTDA.',
        },
      ],
    },
  },

  NG: {
    countryCode: 'NG',
    countryName: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    culturalMotto: 'Civic Vigilance, No Wahala · Shine Your Eye, Speak Your Truth',
    gazetteMasthead: 'THE NIGERIA CITIZEN OBSERVER & STATUTORY AUDIT DISPATCH',
    gazetteTagline: '36 STATES + FCT · 774 LOCAL GOVERNMENTS · ZERO TOLLERANCE FOR GRAFT',
    localPhoneSlang: 'Palasa / Torchlight Phone',
    primaryTelecoms: ['MTN MoMo PSB', 'Airtel Smartcash', 'OPay', 'PalmPay'],
    ussdShortcode: '*3030*234#',
    advertisingCampaign: {
      badge: 'NIGERIA ENTERPRISE RETENTION · NGN PRICING',
      campaignTitle: 'Shine Your Eye: Protect Your Customer Base from Rivals',
      headline: 'FCCPC, NAFDAC & CBN Regulate, but Sharp Customer Care Decides Business Survival',
      body: 'In Lagos, Abuja, Port Harcourt and Kano, Nigerian consumers have zero chill for poor customer service. When a private clinic, school, transport fleet, or FinTech ignores customer complaints, consumers don’t waste time arguing—they immediately take their business to a responsive competitor across the expressway.',
      callToAction: 'Claim Your Verified Desk & Secure Your 24h SLA',
      localLanguagePunchline: 'No Wahala, Keep Your Customers · Sharp Service Na Real Power',
      marketInsight: '85% of Nigerian urban consumers defect to competing services if a complaint is ignored for 24 hours.',
      regulatorsMentioned: ['Federal Competition & Consumer Protection Commission (FCCPC)', 'NAFDAC', 'Central Bank of Nigeria (CBN)'],
      typicalBusinesses: ['Private Hospitals & Diagnostic Labs', 'Private Secondary Schools', 'Interstate Transport Fleets', 'FinTech & Microfinance Banks', 'Hospitality & Event Centres'],
      churnStatistic: '85% switch to competitors within 24h of no response',
      retentionBenefit: '+40% repeat business with verified CivicDuty Trust Badge',
      pricingNote: 'Affordable billing in NGN via Bank Transfer, Card, or USSD.',
    },
    defectionNotice: {
      warningTag: 'NIGERIA CONSUMER CHURN REALITY',
      headline: 'Vexed Customers Move Their Naira to Competitors Instantly',
      explanation: 'Nigerian consumers do not take excuses. When private hospitals, transport operators, schools, or tech services fail to respond quickly, customers port straight to rival brands with better customer support.',
      regulatorContrast: 'FCCPC and regulators issue fines, but superior customer care is what keeps paying customers walking through your doors.',
      alternativePitch: 'Check out top-rated alternative providers capturing defecting clients in this category:',
    },
    fieldManual: {
      constitutionalBasis: 'Constitution of the Federal Republic of Nigeria 1999 (as amended) & Freedom of Information (FOI) Act 2011',
      pfmaAct: 'Fiscal Responsibility Act 2007 & Public Procurement Act 2007',
      antiCorruptionAgency: {
        name: 'Independent Corrupt Practices Commission & EFCC',
        acronym: 'ICPC / EFCC',
        role: 'Federal statutory agencies investigating financial crimes, bribery, and civil service corruption',
      },
      ombudsmanAgency: {
        name: 'Public Complaints Commission (PCC / Ombudsman) & SERVICOM',
        role: 'Promotes service excellence and investigates administrative injustice across public services',
      },
      whistleblowerLegislation: 'Federal Ministry of Finance Whistleblower Policy',
      accountingOfficerTitle: 'Permanent Secretary / Director-General / LGA Chairman',
      decentralizationModel: 'Three-Tier Federal Structure: Federal, 36 States (+FCT), and 774 LGAs',
      grassrootsUnit: 'Ward',
      tiers: [
        {
          tierNumber: 1,
          levelName: 'Ward Level (Ward Councillor & Community Chiefs)',
          authority: 'Ward Councillor, Community Development Association (CDA) Chairman',
          description: 'Immediate neighborhood governance. Handles Primary Health Centers (PHCs), local boreholes, and community sanitation.',
        },
        {
          tierNumber: 2,
          levelName: 'Local Government Area (LGA Chairman & Supervisory Councillors)',
          authority: 'Local Government Chairman, Head of Local Government Administration (HLGA)',
          description: 'Administers primary education, rural feeder roads, municipal markets, and environmental health.',
        },
        {
          tierNumber: 3,
          levelName: 'State Government (State Governor, Commissioners & MDAs)',
          authority: 'State Governor, Commissioners (Health, Works, Education), State Permanent Secretaries',
          description: 'State treasury vote controllers. Oversees general hospitals, state highways, and statutory regulatory bodies.',
        },
        {
          tierNumber: 4,
          levelName: 'Federal Ministries, Departments & Agencies (MDAs)',
          authority: 'Federal Ministry of Works, FERMA, Federal Ministry of Water Resources, TCN',
          description: 'Federal trunk highways, national transmission grid, river basin authorities, and tertiary federal medical centres.',
        },
        {
          tierNumber: 5,
          levelName: 'Sovereign Watchdogs & Federal Oversight',
          authority: 'ICPC, EFCC, Auditor-General for the Federation, Code of Conduct Bureau (CCB)',
          description: 'Constitutional investigative bodies. Unresolved breaches trigger formal public prosecution and asset forfeiture.',
        },
      ],
      scenarios: [
        {
          title: 'Dry Water Taps & Burst Distribution Pipe',
          category: 'Public Utility',
          type: '🟡 Amber Service Issue',
          targetAgency: 'State Water Corporation / FCT Water Board',
          jurisdiction: 'Local Ward Distribution Grid',
          sla: '24 Hours Mandatory Response',
          outcome: 'Repair team mobilized with geolocated photo evidence of repaired pipe joints and verified water pressure.',
          escalationPath: 'Ward Councillor → LGA Works Dept → State Water Corporation General Manager → State Commissioner for Water Resources.',
        },
        {
          title: 'Public Hospital Nurse Demanding Illegal Extortion for Blood Transfusion',
          category: 'Anti-Corruption & Ethics',
          type: '🔴 Red Sovereign Alert',
          targetAgency: 'ICPC & State Hospital Management Board',
          jurisdiction: 'General Hospital Emergency Ward',
          sla: '12 Hours Emergency Acknowledgment',
          outcome: 'Citizen masked. Telemetry hash dispatched to ICPC and SERVICOM. Hospital medical director orders immediate inquiry.',
          escalationPath: 'Direct bypass: Goes straight to State Hospital Management Board, SERVICOM Desk, and ICPC Zonal Office.',
        },
        {
          title: 'Private Hospital Charging Extravagant Unexplained Fees on Emergency Admission',
          category: 'Private Consumer Provider',
          type: '🏢 Commercial Provider Claim Desk',
          targetAgency: 'Private Medical Center Customer Care Desk',
          jurisdiction: 'Private Healthcare Provider Cluster',
          sla: '24 Hours Commercial SLA',
          outcome: 'Hospital management responds on verified desk. Unresolved reports trigger consumer defection to higher-rated diagnostic centres.',
          escalationPath: 'Hospital Board Desk → CivicDuty Dispute Arbiter → State Ministry of Health Licensing Board.',
        },
        {
          title: 'Hazardous Potholes and Collapsed Culvert on Major Road',
          category: 'Infrastructure & Works',
          type: '🟡 Amber Inspection Issue',
          targetAgency: 'Federal Road Maintenance Agency (FERMA) / State Ministry of Works',
          jurisdiction: 'LGA Feeder / Arterial Road',
          sla: '72 Hours Milestone Inspection',
          outcome: 'Asphalt patching crew dispatched with verified GPS telemetry coordinates and public procurement work order.',
          escalationPath: 'LGA Works Supervisor → State Ministry of Works Engineer → FERMA Field Engineer → Federal Ministry of Works.',
        },
      ],
    },
  },

  GH: {
    countryCode: 'GH',
    countryName: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    culturalMotto: 'Freedom and Justice · Citizen Action Yentua · Good Governance',
    gazetteMasthead: 'THE GHANA CITIZEN DISPATCH & DISTRICT ASSEMBLY RECORD',
    gazetteTagline: '16 REGIONS · 261 DISTRICTS · CITIZEN ACCOUNTABILITY FIRST',
    localPhoneSlang: 'Yam Phone / Button Phone',
    primaryTelecoms: ['MTN Mobile Money Ghana', 'Telecel Cash', 'AT Money'],
    ussdShortcode: '*3030*233#',
    advertisingCampaign: {
      badge: 'GHANA ENTERPRISE RETENTION · GHS PRICING',
      campaignTitle: 'Citizen Vigilance: Retain Your Customers with Responsive Service',
      headline: 'FDA, PURC & BoG Regulate, but Prompt Customer Care Decides Business Longevity',
      body: 'From Accra, Tema and Kumasi to Takoradi and Tamale, Ghanaian consumers demand accountability. When a private clinic, international school, or finance house delays answering client concerns, customers do not wait—they defect instantly to competitors with active service commitments.',
      callToAction: 'Claim Your Verified Desk & Maintain Your 24h SLA',
      localLanguagePunchline: 'Customer Vigilance & Service Excellence · Protect Your Enterprise',
      marketInsight: '80% of Ghanaian private sector customers switch service providers after a single unresolved complaint.',
      regulatorsMentioned: ['Public Utilities Regulatory Commission (PURC)', 'Food and Drugs Authority (FDA)', 'Bank of Ghana (BoG)'],
      typicalBusinesses: ['Private Clinics & Diagnostic Labs', 'International Academies', 'Trotro & Bus Transport Unions', 'Microfinance & Savings Houses', 'Hotels & Coastal Resorts'],
      churnStatistic: '80% switch providers after unresolved complaint',
      retentionBenefit: '+39% customer loyalty score with verified CivicDuty SLA badge',
      pricingNote: 'Flexible billing in GHS via MTN MoMo, Telecel Cash, or Card.',
    },
    defectionNotice: {
      warningTag: 'GHANA CONSUMER RETENTION DYNAMICS',
      headline: 'Disappointed Clients Move Their Cedis to Responsive Providers',
      explanation: 'In Ghana, consumers vote with their mobile wallets. When complaints are met with silence, customers do not wait for PURC or FDA intervention—they patronize rival businesses immediately.',
      regulatorContrast: 'Regulators ensure compliance, but proactive customer care secures your long-term business survival.',
      alternativePitch: 'Top alternative providers with verified customer care ratings in this category:',
    },
    fieldManual: {
      constitutionalBasis: '1992 Constitution of the Republic of Ghana (Article 21 on Fundamental Freedoms & Right to Information Act 2019)',
      pfmaAct: 'Public Financial Management Act 2016 (Act 921) & Local Governance Act 2016 (Act 936)',
      antiCorruptionAgency: {
        name: 'Office of the Special Prosecutor & EOCO',
        acronym: 'OSP / EOCO',
        role: 'Specialized state prosecutor for high-level corruption, financial crimes, and abuse of public office',
      },
      ombudsmanAgency: {
        name: 'Commission on Human Rights and Administrative Justice',
        acronym: 'CHRAJ',
        role: 'Constitutional ombudsman investigating human rights violations and administrative injustice',
      },
      whistleblowerLegislation: 'Whistleblower Act 2006 (Act 720)',
      accountingOfficerTitle: 'Metropolitan/Municipal/District Chief Executive (MCE/DCE) / Coordinating Director',
      decentralizationModel: 'Decentralized District Assembly System: 16 Regions and 261 MMDAs',
      grassrootsUnit: 'Electoral Area / Unit Committee',
      tiers: [
        {
          tierNumber: 1,
          levelName: 'Unit Committee / Electoral Area (Assembly Member Desk)',
          authority: 'Assembly Member, Unit Committee Chairman, Traditional Elders',
          description: 'Grassroots community administration. Oversees local sanitation, community boreholes, and basic school facilities.',
        },
        {
          tierNumber: 2,
          levelName: 'Zonal / Urban / Town Council Desk',
          authority: 'Zonal Council Chairman, Environmental Health Officer',
          description: 'Sub-district operational hub coordinating community health planning and local revenue collection.',
        },
        {
          tierNumber: 3,
          levelName: 'Metropolitan / Municipal / District Assembly (MMDA / DCE Desk)',
          authority: 'District Chief Executive (DCE/MCE), District Coordinating Director (DCD), District Engineer',
          description: 'Statutory vote controller. Manages District Assemblies Common Fund (DACF) allocations and feeder road contracts.',
        },
        {
          tierNumber: 4,
          levelName: 'Sector Ministries & Parastatals',
          authority: 'Ministry of Local Government, Ghana Water Ltd (GWL), ECG, Ghana Highway Authority (GHA)',
          description: 'National power distribution, bulk water networks, national trunk roads, and secondary referral hospitals.',
        },
        {
          tierNumber: 5,
          levelName: 'Constitutional Oversight & Anti-Corruption Watchdogs',
          authority: 'CHRAJ, Office of the Special Prosecutor (OSP), Auditor-General (PAC hearings)',
          description: 'Independent constitutional watchdogs. Unresolved breaches lead to public hearings before the Parliamentary Public Accounts Committee.',
        },
      ],
      scenarios: [
        {
          title: 'Damaged Water Distribution Pipe and Contaminated Supply',
          category: 'Public Utility',
          type: '🟡 Amber Service Issue',
          targetAgency: 'Ghana Water Limited (GWL)',
          jurisdiction: 'Local Electoral Area Network',
          sla: '24 Hours Technical Response',
          outcome: 'GWL district emergency crew replaces pipe. Water quality test report uploaded to public ledger for citizen sign-off.',
          escalationPath: 'Assembly Member → District Engineer → Municipal Coordinating Director → GWL Regional Director.',
        },
        {
          title: 'Revenue Collector Demanding Cash Bribe to Waive Market Stall Levies',
          category: 'Anti-Corruption & Ethics',
          type: '🔴 Red Sovereign Alert',
          targetAgency: 'CHRAJ & District Internal Audit Unit',
          jurisdiction: 'District Assembly Market Facility',
          sla: '12 Hours Immediate Acknowledgment',
          outcome: 'Citizen masked. Evidence routed directly to CHRAJ Regional Office and MMDA Internal Audit Directorate.',
          escalationPath: 'Direct bypass: Goes straight to District Coordinating Director, CHRAJ District Office, and OSP.',
        },
        {
          title: 'Private School Arbitrarily Increasing Term Fees Without Notice',
          category: 'Private Consumer Provider',
          type: '🏢 Commercial Provider Claim Desk',
          targetAgency: 'Private School Management Board',
          jurisdiction: 'Private Education Cluster',
          sla: '48 Hours Commercial SLA',
          outcome: 'Head of School responds on verified desk. Failure to resolve prompts parent defection to rival accredited academies.',
          escalationPath: 'School Proprietor Desk → CivicDuty Arbiter → Ghana Education Service (GES) District Directorate.',
        },
        {
          title: 'Severely Eroded Culvert & Impassable Community Road',
          category: 'Infrastructure & Works',
          type: '🟡 Amber Inspection Issue',
          targetAgency: 'Department of Feeder Roads / Urban Roads',
          jurisdiction: 'District Assembly Feeder Road',
          sla: '72 Hours Milestone Inspection',
          outcome: 'Feeder Roads engineer conducts on-site GPS inspection and publishes contractor mobilization date on the public ledger.',
          escalationPath: 'Unit Committee → Assembly Member → District Engineer (MMDA) → Department of Feeder Roads Regional Office.',
        },
      ],
    },
  },

  ZA: {
    countryCode: 'ZA',
    countryName: 'South Africa',
    flag: '🇿🇦',
    currency: 'ZAR',
    culturalMotto: 'Batho Pele (People First) · Asiphephe · Ke Nako, Citizen Oversight',
    gazetteMasthead: 'THE SOUTH AFRICA CITIZEN RECORD & MUNICIPAL DISPATCH',
    gazetteTagline: '9 PROVINCES · 257 MUNICIPALITIES · BATHO PELE PRINCIPLES IN ACTION',
    localPhoneSlang: 'Feature Phone / Kambashu',
    primaryTelecoms: ['Vodacom', 'MTN', 'Capitec Pay'],
    ussdShortcode: '*3030*27#',
    advertisingCampaign: {
      badge: 'SOUTH AFRICA BATHO PELE ENTERPRISE · ZAR PRICING',
      campaignTitle: 'Batho Pele in the Private Sector: Stop Client Churn',
      headline: 'CGSO, NCC & FSCA Enforce Codes, but Proactive Care Stops Customer Defection',
      body: 'From Sandton and Cape Town to Durban and Gqeberha, South African consumers exercise their Consumer Protection Act (CPA) muscle daily. When private medical practices, private colleges, transport associations, or financial institutions leave queries unanswered, customers defect to agile competitors who guarantee responsive SLAs.',
      callToAction: 'Claim Your Verified Profile & Uphold Your 24h SLA',
      localLanguagePunchline: 'Batho Pele in the Private Sector · Customer Loyalty Is Your Greatest Asset',
      marketInsight: '82% of South African consumers take their spending elsewhere after an unresolved customer care dispute.',
      regulatorsMentioned: ['Consumer Goods and Services Ombud (CGSO)', 'National Consumer Commission (NCC)', 'Financial Sector Conduct Authority (FSCA)'],
      typicalBusinesses: ['Private Medical Centres', 'Private Higher Education Colleges', 'Taxi Associations', 'Financial & Insurance Brokerages', 'Retail Chains & Hospitality'],
      churnStatistic: '82% defect following poor customer care response',
      retentionBenefit: '+41% customer retention index with active CivicDuty Verified Desk',
      pricingNote: 'Transparent billing in ZAR via Card, EFT, or Instant Pay.',
    },
    defectionNotice: {
      warningTag: 'SOUTH AFRICA CONSUMER CARE REALITY',
      headline: 'Dissatisfied Clients Exercise Consumer Rights and Switch Brands',
      explanation: 'Under South Africa’s Consumer Protection Act (CPA), consumers do not tolerate poor service delivery. When private businesses fail to communicate, customers switch to competing brands that respect Batho Pele principles.',
      regulatorContrast: 'Ombuds and tribunals adjudicate disputes, but rapid customer resolution preserves your reputation and revenues.',
      alternativePitch: 'Leading alternative providers upholding excellent customer satisfaction in this category:',
    },
    fieldManual: {
      constitutionalBasis: 'Constitution of the Republic of South Africa 1996 (Chapter 2 Bill of Rights & Section 195 on Public Administration)',
      pfmaAct: 'Municipal Finance Management Act (MFMA 2003) & Public Finance Management Act (PFMA 1999)',
      antiCorruptionAgency: {
        name: 'Special Investigating Unit & Directorate for Priority Crime Investigation (Hawks)',
        acronym: 'SIU / Hawks',
        role: 'Statutory forensic investigation of corruption, state capture, and maladministration',
      },
      ombudsmanAgency: {
        name: 'Office of the Public Protector & SAHRC',
        role: 'Constitutional body investigating improper prejudice, maladministration, and abuse of public power',
      },
      whistleblowerLegislation: 'Protected Disclosures Act 26 of 2000 (as amended)',
      accountingOfficerTitle: 'Municipal Manager / Director-General',
      decentralizationModel: 'Three Spheres of Government: National, Provincial, and 257 Municipalities',
      grassrootsUnit: 'Ward',
      tiers: [
        {
          tierNumber: 1,
          levelName: 'Ward Level (Ward Councillor & Ward Committee Desk)',
          authority: 'Ward Councillor, Ward Committee Members, Community Development Workers (CDWs)',
          description: 'Immediate local community sphere. Handles local municipal clinics, neighborhood water pressure, and local park maintenance.',
        },
        {
          tierNumber: 2,
          levelName: 'Sub-Council / Municipal Region (Regional Manager)',
          authority: 'Regional Director, Municipal Sub-Council Chairperson',
          description: 'Coordinates technical depots, regional water reservoirs, road patching teams, and local municipal bylaws.',
        },
        {
          tierNumber: 3,
          levelName: 'Local / Metropolitan Municipality (Municipal Manager)',
          authority: 'Municipal Manager, Executive Mayor, Mayoral Committee Members (MMCs)',
          description: 'Statutory vote accounting officer. Manages municipal infrastructure capital budgets, bulk electricity, and sanitation contracts.',
        },
        {
          tierNumber: 4,
          levelName: 'Provincial & National Departments',
          authority: 'CoGTA, Department of Water and Sanitation (DWS), Eskom, SANRAL, Dept of Health',
          description: 'National highway corridors (SANRAL), national electricity grid (Eskom), and bulk water transfer schemes.',
        },
        {
          tierNumber: 5,
          levelName: 'Constitutional Institutions (Chapter 9 Oversight)',
          authority: 'Public Protector, Auditor-General of South Africa (AGSA), SIU, Parliament SCOPA',
          description: 'Highest independent constitutional oversight. Unresolved audits result in formal adverse findings and SIU proclamation.',
        },
      ],
      scenarios: [
        {
          title: 'Burst Municipal Water Pipe & Pressure Loss',
          category: 'Public Utility',
          type: '🟡 Amber Service Issue',
          targetAgency: 'Municipal Water & Sanitation Department / Rand Water',
          jurisdiction: 'Local Ward Water Reticulation Grid',
          sla: '24 Hours Rapid Response',
          outcome: 'Depot emergency crew dispatched. Pressure valve restored and water quality test certified on the public ledger.',
          escalationPath: 'Ward Councillor → Regional Municipal Depot → Municipal Manager → Department of Water and Sanitation.',
        },
        {
          title: 'Municipal Official Demanding Kickback for Housing List Placement',
          category: 'Anti-Corruption & Ethics',
          type: '🔴 Red Sovereign Alert',
          targetAgency: 'Special Investigating Unit (SIU) & Public Protector',
          jurisdiction: 'Municipal Human Settlements Department',
          sla: '12 Hours Immediate Acknowledgment',
          outcome: 'Complainant identity cryptographically masked. Case forwarded to SIU Forensic Integrity Ledger and City Integrity Officer.',
          escalationPath: 'Direct bypass: Goes straight to City Integrity Directorate, Public Protector Regional Office, and SIU Hotline.',
        },
        {
          title: 'Private College Failing to Provide Contracted Tuition Modules',
          category: 'Private Consumer Provider',
          type: '🏢 Commercial Provider Claim Desk',
          targetAgency: 'Private College Management Board',
          jurisdiction: 'Private Higher Education Cluster',
          sla: '48 Hours Commercial SLA',
          outcome: 'Academic Registrar responds on verified desk. Unresolved complaints prompt student transfer and lower public trust rating.',
          escalationPath: 'College Board Desk → CivicDuty Arbitration Desk → Department of Higher Education and Training (DHET).',
        },
        {
          title: 'Critical Potholes Causing Vehicle Damage on Municipal Main Road',
          category: 'Infrastructure & Works',
          type: '🟡 Amber Inspection Issue',
          targetAgency: 'Municipal Roads Agency (JRA / Transport Dept)',
          jurisdiction: 'Municipal Arterial Corridor',
          sla: '72 Hours Milestone Inspection',
          outcome: 'Road maintenance unit mobilized. GPS coordinates verified with before-and-after photo proof recorded on the ledger.',
          escalationPath: 'Ward Councillor → Sub-Council Manager → Municipal Head of Transport → SANRAL Regional Office.',
        },
      ],
    },
  },
};

// Fallback generator for other countries
export const getCountryBranding = (countryCode: string): CountryBrandingProfile => {
  const code = countryCode?.toUpperCase() as CountryCode;
  if (COUNTRY_BRANDING[code]) {
    return COUNTRY_BRANDING[code];
  }

  // Sensible adaptive fallback for other countries
  return {
    countryCode: code,
    countryName: countryCode,
    flag: '🌍',
    currency: 'USD',
    culturalMotto: 'Public Integrity, Civic Dignity · Transparent Governance Everywhere',
    gazetteMasthead: `THE ${countryCode} CITIZEN GAZETTE & PUBLIC LEDGER`,
    gazetteTagline: 'SOVEREIGN TRANSPARENCY · STATUTORY CITIZEN ACCOUNTABILITY',
    localPhoneSlang: 'Feature Phone',
    primaryTelecoms: ['National Mobile Telecom Network'],
    ussdShortcode: '*3030#',
    advertisingCampaign: {
      badge: `${countryCode} ENTERPRISE RETENTION & TRUST`,
      campaignTitle: 'Customer Retention & Market Share Protection',
      headline: 'Regulators Audit, but Responsive Customer Care Decides Business Survival',
      body: 'Without government subsidies, private businesses rely on customer trust. Frustrated citizens whose complaints are ignored do not wait for regulators—they migrate their business, tuition, medical care, or dining spend directly to responsive competitors.',
      callToAction: 'Claim Your Verified Profile & Activate Your 24h SLA',
      localLanguagePunchline: 'Customer Loyalty Is Your Greatest Asset',
      marketInsight: 'Over 80% of private consumers switch to competitors after an unanswered service dispute.',
      regulatorsMentioned: ['National Consumer Authority', 'Bureau of Standards', 'Central Bank'],
      typicalBusinesses: ['Private Clinics', 'Private Academies', 'Transport Operators', 'Microfinance Institutions', 'Hospitality'],
      churnStatistic: '80% defect after an unanswered grievance',
      retentionBenefit: '+38% customer lifetime retention with active SLA badge',
      pricingNote: 'Simple monthly or annual subscription with 2 months free.',
    },
    defectionNotice: {
      warningTag: 'CUSTOMER CARE & DEFECTION REALITY',
      headline: 'Unanswered Complaints Drive Clients Directly to Rivals',
      explanation: 'When private providers ignore consumer complaints, customers don’t wait for regulatory action—they simply move their spending to higher-rated alternatives with responsive customer care.',
      regulatorContrast: 'State regulators audit compliance, but customer satisfaction determines business longevity.',
      alternativePitch: 'Check out the top-rated providers in this category:',
    },
    fieldManual: {
      constitutionalBasis: 'National Constitution on Access to Information & Fundamental Civic Rights',
      pfmaAct: 'Public Finance Management Act & Decentralization Statutes',
      antiCorruptionAgency: {
        name: 'National Anti-Corruption & Ethics Commission',
        acronym: 'EACC',
        role: 'Investigates corruption, bribery, and abuse of public authority',
      },
      ombudsmanAgency: {
        name: 'Office of the Public Ombudsman',
        role: 'Protects citizens from administrative injustice and maladministration',
      },
      whistleblowerLegislation: 'National Whistleblower Protection Act',
      accountingOfficerTitle: 'Accounting Officer / Principal Secretary / District Administrator',
      decentralizationModel: 'Decentralized Administrative System',
      grassrootsUnit: 'Local District / Ward',
      tiers: [
        {
          tierNumber: 1,
          levelName: 'Grassroots Community Level',
          authority: 'Local Village / Ward Leader',
          description: 'Immediate neighborhood governance for local utilities and basic public services.',
        },
        {
          tierNumber: 2,
          levelName: 'Municipal / Sub-District Level',
          authority: 'Sub-District Administrator, Local Health Officer',
          description: 'Coordinates technical dispatch, inspections, and local operational maintenance.',
        },
        {
          tierNumber: 3,
          levelName: 'District / Regional Government Level',
          authority: 'District Chief Executive / Regional Commissioner',
          description: 'Manages capital projects, regional public tenders, and civil service administration.',
        },
        {
          tierNumber: 4,
          levelName: 'National Line Ministries & Utilities',
          authority: 'Ministry of Works, Water Authority, Energy Ministry',
          description: 'National infrastructure, bulk utilities, and regulatory policy enforcement.',
        },
        {
          tierNumber: 5,
          levelName: 'Sovereign Watchdogs & Auditor General',
          authority: 'Auditor General, Anti-Corruption Commission, Parliament',
          description: 'Constitutional audit and prosecution of public finance breaches.',
        },
      ],
      scenarios: [
        {
          title: 'Water Supply Contamination or Burst Pipe',
          category: 'Public Utility',
          type: '🟡 Amber Service Issue',
          targetAgency: 'National Water & Sewerage Utility',
          jurisdiction: 'Local Distribution Network',
          sla: '24 Hours Response SLA',
          outcome: 'Emergency repair crew dispatched with photographic proof of resolved water flow.',
          escalationPath: 'Local Chief → District Engineer → National Water Utility HQ.',
        },
        {
          title: 'Public Officer Demanding Extortion Bribe',
          category: 'Anti-Corruption & Ethics',
          type: '🔴 Red Sovereign Alert',
          targetAgency: 'National Anti-Corruption Commission',
          jurisdiction: 'Public Service Desk',
          sla: '12 Hours Immediate Acknowledgment',
          outcome: 'Citizen masked. Evidence forwarded to Anti-Corruption Commission rapidly.',
          escalationPath: 'Direct bypass: Sent straight to central Anti-Corruption Registry.',
        },
        {
          title: 'Private Provider Overcharging or Refusing Refund',
          category: 'Private Consumer Provider',
          type: '🏢 Commercial Provider Claim Desk',
          targetAgency: 'Private Business Customer Care Desk',
          jurisdiction: 'Commercial Cluster',
          sla: '48 Hours Commercial SLA',
          outcome: 'Business lead responds on verified desk to resolve dispute and maintain trust rating.',
          escalationPath: 'Company Customer Desk → CivicDuty Arbiter → National Consumer Protection Authority.',
        },
        {
          title: 'Damaged Community Feeder Road & Broken Culvert',
          category: 'Infrastructure & Works',
          type: '🟡 Amber Inspection Issue',
          targetAgency: 'National Roads Authority',
          jurisdiction: 'Regional Road Corridor',
          sla: '72 Hours Milestone Inspection',
          outcome: 'Work order tagged with GPS coordinates and contractor timeline posted.',
          escalationPath: 'Local Council → District Works Dept → National Roads Authority.',
        },
      ],
    },
  };
};
