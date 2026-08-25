import { COUNTRIES } from './countries';

export interface CountryPitchData {
  code: string;
  name: string;
  flag: string;
  idLabel: string;
  motto: string;
  leadMinistry: string;
  level1Title: string;
  level2Title: string;
  level3Title: string;
  level4Title: string;
  statUnits: string;
  statLabel: string;
  agenciesCivic: string[];
  agenciesUtility: string[];
  slides: {
    id: string;
    tag: string;
    title: string;
    subtitle: string;
    color: string;
    borderColor: string;
    points: { label: string; text: string }[];
  }[];
  hierarchy: {
    level: string;
    title: string;
    badge: string;
    desc: string;
    borderColor: string;
    textColor: string;
  }[];
  proposalText: string;
}

export const PITCH_PROFILES: Record<string, CountryPitchData> = {
  UG: {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    idLabel: 'NIN (National ID Number)',
    motto: 'Parish Development Model (PDM) Digital Accountability Canvas',
    leadMinistry: 'Office of the Prime Minister (OPM) & Ministry of Local Government',
    level1Title: 'Office of the Prime Minister (OPM) & Cabinet',
    level2Title: '146 Chief Administrative Officers (CAOs) & City Directors',
    level3Title: '1,438 Sub-County Chiefs & 10,515 Parish Chiefs',
    level4Title: 'Universal Access via Smartphone Web App & USSD *3030#',
    statUnits: '10,515',
    statLabel: 'UG Parishes',
    agenciesCivic: ['KCCA', 'UNRA', 'District LG', 'Uganda Police Force'],
    agenciesUtility: ['NWSC Water', 'Umeme Power', 'MTN', 'Airtel'],
    slides: [
      {
        id: 'problem',
        tag: '01 · THE CIVIC CHALLENGE IN UGANDA',
        title: 'Bridging Grassroots Service Gaps Across 10,515 Parishes',
        subtitle: 'Over 80% of parish issues go unresolved due to manual paperwork, unmonitored delays, and fragmented local tracking.',
        color: 'from-red-500/20 to-amber-500/10',
        borderColor: 'border-red-500/30',
        points: [
          { label: 'Untracked Field Deficits', text: 'Culvert collapses, dry water taps, and dark streets linger for months without clear officer ownership.' },
          { label: 'No CAO Visibility', text: 'Chief Administrative Officers lack real-time digital dashboards to inspect Parish Chief task queues.' },
          { label: 'Universal Inclusion Needed', text: 'Rural citizens require simple USSD *3030# access alongside modern web interfaces.' },
        ],
      },
      {
        id: 'solution',
        tag: '02 · THE CIVICDUTY SOLUTION FOR UGANDA',
        title: 'NIN-Verified Accountability Engine for PDM',
        subtitle: 'Linking every citizen report directly to their Sub-County Chief and District CAO desk with an immutable audit trail.',
        color: 'from-teal-500/20 to-emerald-500/10',
        borderColor: 'border-teal-500/30',
        points: [
          { label: 'NIN Authentication', text: 'Ensures genuine citizen reports while protecting confidential whistleblower identity when reporting corruption.' },
          { label: 'Parish Development Mapping', text: 'Geotagged reports automatically route to the responsible Parish Chief and Department Head.' },
          { label: 'Multi-Channel Dispatch', text: 'Seamless submission via Web App or USSD *3030# on basic feature phones.' },
        ],
      },
      {
        id: 'hierarchy',
        tag: '03 · NATIONAL ADMINISTRATIVE ROLLOUT',
        title: 'Mapped 1:1 to Uganda’s Local Government Hierarchy',
        subtitle: 'From the Office of the Prime Minister down to Sub-County Chiefs, Parish Chiefs, and field engineering crews.',
        color: 'from-amber-500/20 to-indigo-500/10',
        borderColor: 'border-amber-500/30',
        points: [
          { label: 'L1 Cabinet Oversight', text: 'OPM & MoLG monitor national compliance indexes and regional resolution times.' },
          { label: 'L2 CAO District Control', text: '146 Chief Administrative Officers assign budgets, issue officer access codes, and track departments.' },
          { label: 'L3 Grassroots Parish Chiefs', text: '10,515 Parish Chiefs act as local desk owners receiving and resolving geotagged field tickets.' },
        ],
      },
      {
        id: 'impact',
        tag: '04 · MEASURABLE PUBLIC SERVICE IMPACT',
        title: 'Enforceable 24h–72h Response Deadlines',
        subtitle: 'Transforming public trust through automated SLA timers, public verification, and IGG whistleblower pipelines.',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        points: [
          { label: '85%+ Target SLA Compliance', text: 'Strict timers automatically escalate unhandled tickets directly to District CAO.' },
          { label: 'IGG Whistleblower Pipeline', text: 'Secure anti-corruption logging with immutable photo evidence.' },
          { label: 'Citizen Rating Verification', text: 'Citizens confirm resolution quality before a field ticket can be closed.' },
        ],
      },
    ],
    hierarchy: [
      { level: 'LEVEL 1', title: 'Office of the Prime Minister (OPM) / MoLG', badge: 'National Oversight', desc: 'National policy, IGG whistleblower pipeline, cabinet performance ranking.', borderColor: 'border-teal-500/40', textColor: 'text-teal-300' },
      { level: 'LEVEL 2', title: '146 Chief Administrative Officers (CAOs) & Cities', badge: 'District Admin', desc: 'CAO desks manage local budgets, assign department heads, issue officer access codes.', borderColor: 'border-indigo-500/40', textColor: 'text-indigo-300' },
      { level: 'LEVEL 3', title: '1,438 Sub-Counties & 10,515 Parish Chiefs', badge: 'Grassroots Executive', desc: 'Sub-County & Parish Chiefs receive geotagged field tickets and manage resolution proof.', borderColor: 'border-amber-500/40', textColor: 'text-amber-300' },
      { level: 'LEVEL 4', title: 'Universal Citizens & USSD *3030# Users', badge: 'Public Access', desc: 'Verified citizens across all 10,515 parishes lodge geotagged reports or dial USSD.', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-300' },
    ],
    proposalText: `🏛️ CIVICDUTY GOVERNMENT PROPOSAL: REPUBLIC OF UGANDA
------------------------------------------------------------
Target Body: Ministry of ICT & National Guidance / Office of the Prime Minister
Core Objective: Parish Development Model (PDM) Digital Service & Sovereign Tech Export Engine
Access Layer: Web App + USSD *3030# / *284# + CAO Government Desks
Key Metric: Direct coverage for 10,515 Parishes & 146 CAO Districts across Uganda.

Key Capabilities & Economic Revenue Model:
1. NIN-verified citizen reporting with confidential IGG corruption reporting.
2. Automated 1-click access code minting for all Sub-County & Parish Chiefs.
3. Live SLA timers (24h-72h) with automated escalation to CAO & OPM.
4. Integrated public utilities: KCCA, UNRA, NWSC, Umeme, Uganda Police Force.
5. Sovereign B2G/B2B SaaS Export Model: 100% free for citizens with corporate CSR voucher perks (MTN Data, NWSC Tokens). Institutional enterprise subscriptions ($50k-$150k/yr per nation) scaled globally across 100+ countries generate foreign currency inflows, Corporate Income Tax (CIT), VAT, and high-tech PAYE remitted directly to the Uganda Revenue Authority (URA).`,
  },

  KE: {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    idLabel: 'National ID / Huduma Namba',
    motto: '47 Counties Devolved Governance & Citizen Service Engine',
    leadMinistry: 'Council of Governors & Ministry of Interior & National Administration',
    level1Title: 'Council of Governors & Executive Office of the President',
    level2Title: '47 County Governors & Executive Committee Members (CECMs)',
    level3Title: '290 Sub-County Administrators & 1,450 Ward Administrators',
    level4Title: 'Universal Access via Web App & Huduma USSD Integration',
    statUnits: '1,450',
    statLabel: 'County Wards',
    agenciesCivic: ['Nairobi County', 'KRA', 'National Police Service', 'KeNHA'],
    agenciesUtility: ['Nairobi Water', 'Kenya Power (KPLC)', 'Safaricom'],
    slides: [
      {
        id: 'problem',
        tag: '01 · THE CIVIC CHALLENGE IN KENYA',
        title: 'Devolution Accountability Across Kenya’s 47 Counties',
        subtitle: 'Citizens struggle to track ward-level infrastructure defects, garbage accumulation, and delayed water repairs.',
        color: 'from-red-500/20 to-amber-500/10',
        borderColor: 'border-red-500/30',
        points: [
          { label: 'County-Level Delays', text: 'Sub-County and Ward offices lack real-time digital ticket synchronization with County Headquarters.' },
          { label: 'Unmonitored Ward Projects', text: 'County Governors lack live operational heatmaps of open service tickets across wards.' },
          { label: 'Public Verification Gap', text: 'Citizens have no digital mechanism to verify completed ward works before funds are disbursed.' },
        ],
      },
      {
        id: 'solution',
        tag: '02 · THE CIVICDUTY SOLUTION FOR KENYA',
        title: 'Devolved Civic Engine Bound to Kenya National ID',
        subtitle: 'Automating issue dispatch from citizens directly to Sub-County & Ward Administrators across all 47 Counties.',
        color: 'from-teal-500/20 to-emerald-500/10',
        borderColor: 'border-teal-500/30',
        points: [
          { label: 'National ID & Huduma Sync', text: 'Authenticates Kenya ID holders while enabling secure whistleblower reports on misuse of public funds.' },
          { label: 'Ward Administrator Desks', text: 'Every Ward Administrator receives geotagged citizen tickets with direct photo proof.' },
          { label: 'Enterprise Utility Layer', text: 'Integrated with Kenya Power (KPLC), Nairobi Water, and County Enforcement.' },
        ],
      },
      {
        id: 'hierarchy',
        tag: '03 · KENYA DEVOLUTION ARCHITECTURE',
        title: 'Structured for County Executive Committees (CECMs)',
        subtitle: 'From the Council of Governors down to County Ministers, Sub-County Administrators, and Ward Desks.',
        color: 'from-amber-500/20 to-indigo-500/10',
        borderColor: 'border-amber-500/30',
        points: [
          { label: 'L1 Council of Governors', text: 'National benchmark comparison and inter-county service rating index.' },
          { label: 'L2 47 County Executive Desks', text: 'Governors and CECMs assign department budgets and monitor ward SLAs.' },
          { label: 'L3 1,450 Ward Administrators', text: 'Local ward officers manage field dispatch and upload photographic work proof.' },
        ],
      },
      {
        id: 'impact',
        tag: '04 · MEASURABLE COUNTY SERVICE IMPACT',
        title: 'Rapid Resolution & Ward Compliance Transparency',
        subtitle: 'Driving 24h–48h SLA response targets across water, roads, waste, and public safety.',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        points: [
          { label: 'Ward SLA Enforcement', text: 'Tickets automatically escalate to CECM level if unhandled after 48 hours.' },
          { label: 'EACC Whistleblower Link', text: 'Immutable digital logs assist anti-corruption auditing.' },
          { label: 'County Performance Index', text: 'Real-time public dashboard ranks ward efficiency and citizen satisfaction.' },
        ],
      },
    ],
    hierarchy: [
      { level: 'LEVEL 1', title: 'Council of Governors & Ministry of Interior', badge: 'National Oversight', desc: 'Inter-county benchmarks, EACC anti-corruption pipelines, executive monitoring.', borderColor: 'border-teal-500/40', textColor: 'text-teal-300' },
      { level: 'LEVEL 2', title: '47 County Governors & Executive Committees (CECMs)', badge: 'County Executive', desc: 'Governors & CECMs issue officer access codes, oversee county budgets and departments.', borderColor: 'border-indigo-500/40', textColor: 'text-indigo-300' },
      { level: 'LEVEL 3', title: '290 Sub-Counties & 1,450 Ward Administrators', badge: 'Ward Executive', desc: 'Ward Administrators receive geotagged reports, dispatch field crews, upload resolution photos.', borderColor: 'border-amber-500/40', textColor: 'text-amber-300' },
      { level: 'LEVEL 4', title: 'Verified Citizens & Huduma USSD Users', badge: 'Public Access', desc: 'Citizens across all 47 counties submit geotagged issues via Web App or feature phone USSD.', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-300' },
    ],
    proposalText: `🏛️ CIVICDUTY GOVERNMENT PROPOSAL: REPUBLIC OF KENYA
------------------------------------------------------------
Target Body: Council of Governors & County Executive Committee Members (CECMs)
Core Objective: 47 Counties Devolved Service & Ward Accountability Engine
Access Layer: Web App + USSD + County Government Desks
Key Metric: Full coverage for 47 Counties, 290 Sub-Counties & 1,450 Wards.

Key Capabilities:
1. Kenya ID / Huduma verified reporting with EACC anti-corruption channel.
2. Automated access code generation for all Ward Administrators & Department Heads.
3. Real-time SLA enforcement (24h-48h) with escalation to County Executive.
4. Integrated utilities: KPLC, Nairobi Water, KRA, and County Enforcement.`,
  },

  NG: {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    idLabel: 'NIN (National Identification Number)',
    motto: '774 LGAs Digital Governance & Public Service Engine',
    leadMinistry: 'Federal Ministry of Special Duties & Inter-Governmental Affairs / State Executive Councils',
    level1Title: 'Federal Inter-Governmental Affairs & State Cabinet',
    level2Title: '36 State Governors & FCT Minister Executive Desks',
    level3Title: '774 Local Government Area (LGA) Chairmen & Ward Executive Officers',
    level4Title: 'Universal Access via Web App & NIN USSD Channel',
    statUnits: '774',
    statLabel: 'LGAs',
    agenciesCivic: ['LASG (Lagos State)', 'LAWMA Waste', 'Nigeria Police Force', 'FERMA Roads'],
    agenciesUtility: ['DisCos (Power)', 'Water Boards', 'MTN Nigeria', 'Airtel'],
    slides: [
      {
        id: 'problem',
        tag: '01 · THE CIVIC CHALLENGE IN NIGERIA',
        title: 'Bridging Governance Across 774 Local Government Areas',
        subtitle: 'Breakdowns in power lines, refuse management, and road gully erosion suffer from slow dispatch and paper delays.',
        color: 'from-red-500/20 to-amber-500/10',
        borderColor: 'border-red-500/30',
        points: [
          { label: 'LGA Disconnect', text: 'Grassroots citizens in LGAs lack a direct, tracked digital line to LGA Chairmen and State Commissioners.' },
          { label: 'Infrastructure Backlog', text: 'Waste management (e.g. LAWMA) and DisCo power outages lack coordinated ticket tracking.' },
          { label: 'Need for NIN Integrity', text: 'An anti-bot, NIN-verified platform is essential to validate genuine community complaints.' },
        ],
      },
      {
        id: 'solution',
        tag: '02 · THE CIVICDUTY SOLUTION FOR NIGERIA',
        title: 'NIN-Authenticated Service Canvas for All 774 LGAs',
        subtitle: 'Connecting citizen grievances directly to LGA Chairmen, Ward Officers, and DisCos in real time.',
        color: 'from-teal-500/20 to-emerald-500/10',
        borderColor: 'border-teal-500/30',
        points: [
          { label: 'NIN Verification', text: 'Binds citizen accounts to valid 11-digit NIN while enabling encrypted anti-corruption reports.' },
          { label: 'LGA Command Desks', text: 'Every LGA Chairman receives a digital dashboard to assign field tasks and track progress.' },
          { label: 'DisCo & Municipal Integration', text: 'Direct integration with regional power distribution companies and state waste authorities.' },
        ],
      },
      {
        id: 'hierarchy',
        tag: '03 · NIGERIA ADMINISTRATIVE ARCHITECTURE',
        title: 'Federal, State & LGA Hierarchy Integration',
        subtitle: 'Structured across State Governors, 774 LGA Chairmen, and Ward Executive Officers.',
        color: 'from-amber-500/20 to-indigo-500/10',
        borderColor: 'border-amber-500/30',
        points: [
          { label: 'L1 State Executive Oversight', text: 'Governors and State Commissioners review cross-LGA resolution metrics.' },
          { label: 'L2 774 LGA Chairmen Desks', text: 'LGA Chairmen issue officer access codes to department heads and field engineers.' },
          { label: 'L3 Ward Officers & Contractors', text: 'Field teams upload photo proof before resolving geotagged resident complaints.' },
        ],
      },
      {
        id: 'impact',
        tag: '04 · MEASURABLE PUBLIC IMPACT IN NIGERIA',
        title: 'Rapid SLA Compliance & Fraud-Free Audit Trails',
        subtitle: 'Enforcing 24h–72h turnaround on municipal waste, drainage clearing, and police incident logging.',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        points: [
          { label: '24h–72h SLA Timers', text: 'Automatic escalation to State Ministry if LGA fails to address critical hazards.' },
          { label: 'ICPC Whistleblower Pipeline', text: 'Immutable digital logs for anti-corruption oversight.' },
          { label: 'Citizen Proof Sign-Off', text: 'Residents verify completed road and drainage repairs in app.' },
        ],
      },
    ],
    hierarchy: [
      { level: 'LEVEL 1', title: 'Federal Inter-Gov & State Executive Cabinets', badge: 'National Oversight', desc: 'Statewide benchmarks, ICPC anti-corruption monitoring, commissioner oversight.', borderColor: 'border-teal-500/40', textColor: 'text-teal-300' },
      { level: 'LEVEL 2', title: '36 State Governors & 774 LGA Chairmen', badge: 'LGA Executive', desc: 'LGA Chairmen manage local budgets, assign department heads, issue officer access codes.', borderColor: 'border-indigo-500/40', textColor: 'text-indigo-300' },
      { level: 'LEVEL 3', title: 'Ward Executive Officers & Municipal Field Chiefs', badge: 'Ward Executive', desc: 'Ward officers oversee localized field works, waste collection, road repairs.', borderColor: 'border-amber-500/40', textColor: 'text-amber-300' },
      { level: 'LEVEL 4', title: 'Verified Citizens & NIN USSD Users', badge: 'Public Access', desc: 'Citizens across all 774 LGAs lodge verified reports via Web App or USSD.', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-300' },
    ],
    proposalText: `🏛️ CIVICDUTY GOVERNMENT PROPOSAL: FEDERAL REPUBLIC OF NIGERIA
------------------------------------------------------------
Target Body: State Executive Councils & 774 Local Government Area (LGA) Chairmen
Core Objective: 774 LGAs Digital Service Delivery & Accountability Engine
Access Layer: Web App + USSD + LGA Government Desks
Key Metric: Full digital coverage for 36 States, FCT, and 774 LGAs.

Key Capabilities:
1. 11-Digit NIN authenticated citizen reporting with ICPC corruption whistleblowing.
2. 1-Click automated access code generation for all LGA Chairmen & Ward Officers.
3. Strict 24h-72h SLA timers with automatic escalation to State Commissioners.
4. Integrated state agencies: LAWMA, DisCos, Nigeria Police, State Water Boards.`,
  },

  GH: {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    idLabel: 'Ghana Card Number',
    motto: '261 MMDAs Digital Governance & Decentralization Engine',
    leadMinistry: 'Ministry of Local Government, Decentralisation and Rural Development (MLGDRD)',
    level1Title: 'Ministry of Local Government (MLGDRD) & Regional Co-ordinating Councils',
    level2Title: '261 Metropolitan, Municipal & District Chief Executives (MCEs/DCEs)',
    level3Title: 'Sub-Metropolitan, Zonal & Unit Committee Officers',
    level4Title: 'Universal Access via Web App & Ghana Card Integration',
    statUnits: '261',
    statLabel: 'MMDAs',
    agenciesCivic: ['Accra Metro (AMA)', 'Kumasi Metro', 'Ghana Police Service', 'Ministry of Roads'],
    agenciesUtility: ['Electricity Co of Ghana (ECG)', 'Ghana Water (GWCL)', 'MTN Ghana'],
    slides: [
      {
        id: 'problem',
        tag: '01 · THE CIVIC CHALLENGE IN GHANA',
        title: 'Strengthening Decentralization Across 261 MMDAs',
        subtitle: 'Unfixed streetlights, transformer outages, and blocked gutters create persistent friction between residents and MMDAs.',
        color: 'from-red-500/20 to-amber-500/10',
        borderColor: 'border-red-500/30',
        points: [
          { label: 'MMDA Field Tracking Deficit', text: 'Assemblymen and DCEs lack unified digital tools to manage localized citizen tickets.' },
          { label: 'Utility Escalation Gap', text: 'Potholes and ECG transformer faults are often misrouted or left unacknowledged for weeks.' },
          { label: 'Ghana Card Potential', text: 'Linking civic duty directly to the Ghana Card ensures high trust and zero bot spam.' },
        ],
      },
      {
        id: 'solution',
        tag: '02 · THE CIVICDUTY SOLUTION FOR GHANA',
        title: 'Ghana Card Authenticated Assembly Operations Desk',
        subtitle: 'Empowering MCEs, DCEs, and Assembly Members to receive, route, and resolve resident complaints in real time.',
        color: 'from-teal-500/20 to-emerald-500/10',
        borderColor: 'border-teal-500/30',
        points: [
          { label: 'Ghana Card Verification', text: 'Validates accounts via NIA numbers with confidential OSP anti-corruption reporting.' },
          { label: 'MMDA Local Desks', text: 'All 261 assemblies get structured officer dashboards with 1-click access code minting.' },
          { label: 'ECG & GWCL Integration', text: 'Direct dispatch pipeline to Electricity Company of Ghana and Ghana Water Company.' },
        ],
      },
      {
        id: 'hierarchy',
        tag: '03 · GHANA ADMINISTRATIVE ARCHITECTURE',
        title: 'Structured for MLGDRD & Regional Co-ordinating Councils',
        subtitle: 'Connecting Regional Ministers down to MCEs, DCEs, and Electoral Area Unit Committees.',
        color: 'from-amber-500/20 to-indigo-500/10',
        borderColor: 'border-amber-500/30',
        points: [
          { label: 'L1 National Ministry (MLGDRD)', text: 'National MMDA service index and performance benchmarks.' },
          { label: 'L2 261 MMDAs (e.g. Accra, Kumasi)', text: 'DCEs and MCEs oversee local budgets, department heads, and field dispatch.' },
          { label: 'L3 Unit Committees & Electoral Wards', text: 'Local officers manage physical repairs and upload photographic work proof.' },
        ],
      },
      {
        id: 'impact',
        tag: '04 · MEASURABLE PUBLIC SERVICE IMPACT',
        title: 'Fast SLA Compliance & Transparent District Benchmarks',
        subtitle: 'Driving 24h–48h SLA response targets across all 16 Regions of Ghana.',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        points: [
          { label: '48h MMDA SLA Timer', text: 'Unacknowledged tickets automatically escalate to Regional Co-ordinating Council.' },
          { label: 'Office of Special Prosecutor Link', text: 'Immutable digital logs assist corruption investigations.' },
          { label: 'District Performance Ranks', text: 'Public rating map highlights top-performing assemblies in Ghana.' },
        ],
      },
    ],
    hierarchy: [
      { level: 'LEVEL 1', title: 'Ministry of Local Govt (MLGDRD) & Regional Councils', badge: 'National Oversight', desc: 'National MMDA ranking, OSP corruption reporting, regional ministerial oversight.', borderColor: 'border-teal-500/40', textColor: 'text-teal-300' },
      { level: 'LEVEL 2', title: '261 MMDAs (MCEs / DCEs) & Assemblies', badge: 'District Executive', desc: 'MCEs and DCEs manage district budgets, assign department heads, issue officer codes.', borderColor: 'border-indigo-500/40', textColor: 'text-indigo-300' },
      { level: 'LEVEL 3', title: 'Sub-Metros, Zonal Councils & Electoral Area Units', badge: 'Unit Executive', desc: 'Unit Committees receive geotagged field issues and supervise repair completion.', borderColor: 'border-amber-500/40', textColor: 'text-amber-300' },
      { level: 'LEVEL 4', title: 'Verified Citizens & Ghana Card Holders', badge: 'Public Access', desc: 'Citizens across all 16 regions log geotagged reports via Web App or USSD.', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-300' },
    ],
    proposalText: `🏛️ CIVICDUTY GOVERNMENT PROPOSAL: REPUBLIC OF GHANA
------------------------------------------------------------
Target Body: Ministry of Local Government (MLGDRD) & 261 MMDAs
Core Objective: 261 MMDAs Digital Governance & Public Service Delivery Canvas
Access Layer: Web App + USSD + MMDA Government Desks
Key Metric: Full digital coverage for 16 Regions and 261 MMDAs.

Key Capabilities:
1. Ghana Card authenticated citizen reporting with OSP anti-corruption logging.
2. 1-Click access code minting for MCEs, DCEs, and Assembly Officers.
3. Live 24h-48h SLA timers with automatic escalation to Regional Ministers.
4. Integrated essential utilities: ECG, GWCL, Ghana Police, and Urban Roads.`,
  },

  RW: {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    idLabel: 'NIDA National ID',
    motto: 'Imihigo Digital Accountability & Citizen Satisfaction Engine',
    leadMinistry: 'Ministry of Local Government (MINALOC) & MINICT',
    level1Title: 'Ministry of Local Government (MINALOC) & MINICT',
    level2Title: '30 District Mayors (Akarere) & City of Kigali',
    level3Title: '416 Sectors (Umurenge), 2,148 Cells (Akagari), & 14,837 Villages',
    level4Title: 'Universal Access via Web App & Irembo USSD Layer',
    statUnits: '2,148',
    statLabel: 'Akagari Cells',
    agenciesCivic: ['City of Kigali', 'District Councils', 'Rwanda National Police', 'RDB'],
    agenciesUtility: ['REG Power', 'WASAC Water', 'MTN Rwanda'],
    slides: [
      {
        id: 'problem',
        tag: '01 · THE CIVIC CHALLENGE IN RWANDA',
        title: 'Digitalizing Imihigo Delivery Down to the Akagari Level',
        subtitle: 'Maintaining Rwanda’s world-class governance standards requires real-time citizen feedback on local infrastructure and water.',
        color: 'from-red-500/20 to-amber-500/10',
        borderColor: 'border-red-500/30',
        points: [
          { label: 'Granular Akagari Tracking', text: 'Executive Secretaries in Cells (Akagari) need live digital ticket management synchronized with District Mayors.' },
          { label: 'Imihigo Target Visibility', text: 'Mayors require instant visibility on sector-level service SLAs and citizen satisfaction scores.' },
          { label: 'Instant Utility Dispatch', text: 'Power outages (REG) and water pipe bursts (WASAC) require fast geotagged routing.' },
        ],
      },
      {
        id: 'solution',
        tag: '02 · THE CIVICDUTY SOLUTION FOR RWANDA',
        title: 'NIDA-Integrated Imihigo Operational Canvas',
        subtitle: 'Linking every citizen report directly to their Executive Secretary in Sector (Umurenge) and Cell (Akagari).',
        color: 'from-teal-500/20 to-emerald-500/10',
        borderColor: 'border-teal-500/30',
        points: [
          { label: 'NIDA & Irembo Alignment', text: 'Authenticates citizens via National ID with full privacy and confidential reporting.' },
          { label: 'Cell & Sector Desks', text: 'Cell Executive Secretaries receive geotagged issues on mobile and desktop.' },
          { label: 'REG & WASAC Direct Routing', text: 'Automatic dispatch to utility engineers with live repair timers.' },
        ],
      },
      {
        id: 'hierarchy',
        tag: '03 · RWANDA ADMINISTRATIVE ARCHITECTURE',
        title: 'Mapped 1:1 to Rwanda’s Administrative Hierarchy',
        subtitle: 'From MINALOC down to 30 District Mayors, 416 Sectors, 2,148 Cells, and 14,837 Villages.',
        color: 'from-amber-500/20 to-indigo-500/10',
        borderColor: 'border-amber-500/30',
        points: [
          { label: 'L1 MINALOC National Cabinet', text: 'National Imihigo scorecards and district ranking analytics.' },
          { label: 'L2 30 District Mayors (Akarere)', text: 'Mayors issue officer codes to Sector Executive Secretaries and Department Chiefs.' },
          { label: 'L3 2,148 Cells (Akagari)', text: 'Cell Executive Secretaries act as local desk owners supervising field execution.' },
        ],
      },
      {
        id: 'impact',
        tag: '04 · MEASURABLE PUBLIC SERVICE IMPACT',
        title: 'Excellence in SLA Turnaround & Citizen Trust',
        subtitle: 'Enforcing 24h SLA response windows across all 30 Districts of Rwanda.',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        points: [
          { label: '24h Target SLA', text: 'Strict timers drive rapid resolution across Sectors and Cells.' },
          { label: 'Ombudsman Anti-Corruption Link', text: 'Encrypted, immutable record keeping for governance audits.' },
          { label: 'Citizen Verification', text: 'Residents rate completed works before ticket sign-off.' },
        ],
      },
    ],
    hierarchy: [
      { level: 'LEVEL 1', title: 'Ministry of Local Government (MINALOC) & MINICT', badge: 'National Oversight', desc: 'National Imihigo benchmarks, Ombudsman whistleblower link, national analytics.', borderColor: 'border-teal-500/40', textColor: 'text-teal-300' },
      { level: 'LEVEL 2', title: '30 District Mayors (Akarere) & City of Kigali', badge: 'District Executive', desc: 'Mayors manage district budgets, assign Sector Executives, issue officer access codes.', borderColor: 'border-indigo-500/40', textColor: 'text-indigo-300' },
      { level: 'LEVEL 3', title: '416 Sectors (Umurenge) & 2,148 Cells (Akagari)', badge: 'Grassroots Executive', desc: 'Executive Secretaries receive geotagged reports and manage resolution proof.', borderColor: 'border-amber-500/40', textColor: 'text-amber-300' },
      { level: 'LEVEL 4', title: 'Verified Citizens & NIDA Card Holders', badge: 'Public Access', desc: 'Citizens across 14,837 villages submit geotagged issues via Web App or USSD.', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-300' },
    ],
    proposalText: `🏛️ CIVICDUTY GOVERNMENT PROPOSAL: REPUBLIC OF RWANDA
------------------------------------------------------------
Target Body: Ministry of Local Government (MINALOC) & 30 District Mayors
Core Objective: Digital Imihigo Service Delivery & Akagari Accountability Engine
Access Layer: Web App + USSD + District Government Desks
Key Metric: Full coverage for 30 Districts, 416 Sectors, and 2,148 Cells.

Key Capabilities:
1. NIDA National ID authenticated reporting with Ombudsman whistleblowing.
2. 1-Click access code minting for District Mayors, Sector & Cell Executive Secretaries.
3. Enforceable 24h SLA timers with automatic escalation to MINALOC.
4. Integrated public utilities: REG (Power), WASAC (Water), Rwanda Police.`,
  },

  TZ: {
    code: 'TZ',
    name: 'Tanzania',
    flag: '🇹🇿',
    idLabel: 'NIDA Card Number',
    motto: 'TAMISEMI Local Councils & Citizen Accountability Canvas',
    leadMinistry: "President's Office - Regional Administration and Local Government (PO-RALG / TAMISEMI)",
    level1Title: 'PO-RALG (TAMISEMI) & Regional Commissioners (RCs)',
    level2Title: '184 District Commissioners (DCs) & Executive Directors (DEDs)',
    level3Title: 'Ward Executive Officers (WEOs) & Mtaa / Village Chairpersons',
    level4Title: 'Universal Access via Web App & NIDA USSD Integration',
    statUnits: '184',
    statLabel: 'Districts',
    agenciesCivic: ['Dar es Salaam City', 'TANROADS', 'Tanzania Police', 'TARURA'],
    agenciesUtility: ['TANESCO Power', 'DAWASA Water', 'Vodacom TZ'],
    slides: [
      {
        id: 'problem',
        tag: '01 · THE CIVIC CHALLENGE IN TANZANIA',
        title: 'Connecting TAMISEMI to Grassroots Wards & Villages',
        subtitle: 'Water pipe leaks, road drainage washouts, and power cuts across Tanzania need real-time digital ticket visibility.',
        color: 'from-red-500/20 to-amber-500/10',
        borderColor: 'border-red-500/30',
        points: [
          { label: 'PO-RALG Visibility Gap', text: 'TAMISEMI officials need real-time data on open service complaints across 184 District Councils.' },
          { label: 'Ward Executive Dispatch', text: 'Ward Executive Officers (WEOs) require mobile-friendly digital ticket dashboards.' },
          { label: 'NIDA Authentication', text: 'Binds citizen inputs directly to NIDA identity records to eliminate fake complaints.' },
        ],
      },
      {
        id: 'solution',
        tag: '02 · THE CIVICDUTY SOLUTION FOR TANZANIA',
        title: 'NIDA-Verified Local Government Desk for TAMISEMI',
        subtitle: 'Direct digital link from citizens to Ward Executive Officers, District Directors, and TANESCO.',
        color: 'from-teal-500/20 to-emerald-500/10',
        borderColor: 'border-teal-500/30',
        points: [
          { label: 'NIDA Card Integration', text: 'Validates resident identity while preserving encrypted whistleblower confidentiality.' },
          { label: 'WEO & Council Desks', text: 'WEOs receive geotagged citizen tickets with instant photo upload capability.' },
          { label: 'Utility Integration', text: 'Direct dispatch to TANESCO (Power), DAWASA (Water), and TARURA (Rural Roads).' },
        ],
      },
      {
        id: 'hierarchy',
        tag: '03 · TANZANIA ADMINISTRATIVE ARCHITECTURE',
        title: 'Structured for TAMISEMI & 26 Regions',
        subtitle: 'From Regional Commissioners down to District Directors (DEDs), WEOs, and Mtaa Leaders.',
        color: 'from-amber-500/20 to-indigo-500/10',
        borderColor: 'border-amber-500/30',
        points: [
          { label: 'L1 PO-RALG (TAMISEMI) HQ', text: 'National council performance benchmarks and ministerial oversight.' },
          { label: 'L2 184 District Directors (DEDs)', text: 'DEDs manage local budgets, assign department heads, issue officer access codes.' },
          { label: 'L3 Ward Executive Officers (WEOs)', text: 'WEOs supervise field repairs and manage citizen resolution feedback.' },
        ],
      },
      {
        id: 'impact',
        tag: '04 · MEASURABLE SERVICE IMPACT IN TANZANIA',
        title: 'Fast SLA Compliance & Transparent District Benchmarks',
        subtitle: 'Driving 24h–48h response timers across all 26 Regions of Tanzania.',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        points: [
          { label: '48h SLA Timers', text: 'Unassigned tickets automatically escalate to Regional Commissioner level.' },
          { label: 'TAKUKURU Whistleblower Link', text: 'Immutable anti-corruption logs assist investigation.' },
          { label: 'Public Satisfaction Scores', text: 'Citizens verify completion before a ticket is closed.' },
        ],
      },
    ],
    hierarchy: [
      { level: 'LEVEL 1', title: 'PO-RALG (TAMISEMI) & Regional Commissioners (RCs)', badge: 'National Oversight', desc: 'National TAMISEMI scorecard, TAKUKURU corruption reporting, regional oversight.', borderColor: 'border-teal-500/40', textColor: 'text-teal-300' },
      { level: 'LEVEL 2', title: '184 District Commissioners & Executive Directors (DEDs)', badge: 'District Executive', desc: 'DEDs manage council budgets, assign department heads, issue officer codes.', borderColor: 'border-indigo-500/40', textColor: 'text-indigo-300' },
      { level: 'LEVEL 3', title: 'Ward Executive Officers (WEOs) & Mtaa Leaders', badge: 'Ward Executive', desc: 'WEOs receive geotagged field issues and supervise localized work execution.', borderColor: 'border-amber-500/40', textColor: 'text-amber-300' },
      { level: 'LEVEL 4', title: 'Verified Citizens & NIDA Card Holders', badge: 'Public Access', desc: 'Citizens across all 26 regions log geotagged reports via Web App or USSD.', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-300' },
    ],
    proposalText: `🏛️ CIVICDUTY GOVERNMENT PROPOSAL: UNITED REPUBLIC OF TANZANIA
------------------------------------------------------------
Target Body: PO-RALG (TAMISEMI) & 184 District Councils
Core Objective: TAMISEMI Digital Service & Ward Accountability Engine
Access Layer: Web App + USSD + Council Government Desks
Key Metric: Full digital coverage for 26 Regions, 184 Districts & Wards.

Key Capabilities:
1. NIDA Card authenticated citizen reporting with TAKUKURU anti-corruption pipeline.
2. 1-Click access code generation for DEDs, WEOs, and Department Chiefs.
3. Enforceable 24h-48h SLA timers with automatic escalation to Regional Commissioners.
4. Integrated utilities: TANESCO, DAWASA, TANROADS, and TARURA.`,
  },

  ZA: {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    idLabel: 'SA ID Number (13 digits)',
    motto: 'COGTA Municipal Service Delivery & Ward Councillor Engine',
    leadMinistry: 'Department of Cooperative Governance and Traditional Affairs (COGTA)',
    level1Title: 'COGTA National Department & Provincial Executive Councils',
    level2Title: '8 Metros & 44 District Municipalities (Municipal Managers)',
    level3Title: '4,392 Ward Councillors & Sub-Council Action Desks',
    level4Title: 'Universal Access via Web App & SA ID Verification',
    statUnits: '4,392',
    statLabel: 'Wards',
    agenciesCivic: ['City of Joburg', 'Ekurhuleni', 'Cape Town Metro', 'SAPS Police'],
    agenciesUtility: ['Eskom Holdings', 'Joburg Water', 'SANRAL Roads', 'Vodacom'],
    slides: [
      {
        id: 'problem',
        tag: '01 · THE CIVIC CHALLENGE IN SOUTH AFRICA',
        title: 'Transforming Municipal Service Delivery Across 4,392 Wards',
        subtitle: 'Load-shedding infrastructure damage, water leaks, and municipal backlogs require real-time ward accountability.',
        color: 'from-red-500/20 to-amber-500/10',
        borderColor: 'border-red-500/30',
        points: [
          { label: 'Ward Councillor Friction', text: 'Ward Councillors need live ticket visibility on sewage overflows, power trips, and pothole backlogs.' },
          { label: 'Municipal SLA Gaps', text: 'Municipal Managers lack real-time oversight of municipal depot repair times.' },
          { label: 'Eskom & Water Outage Sync', text: 'Unified tracking between local municipalities and national utility providers.' },
        ],
      },
      {
        id: 'solution',
        tag: '02 · THE CIVICDUTY SOLUTION FOR SOUTH AFRICA',
        title: 'SA ID Verified Municipal Service Operations Desk',
        subtitle: 'Automated ticket routing from residents directly to Ward Councillors, Municipal Managers, and Eskom.',
        color: 'from-teal-500/20 to-emerald-500/10',
        borderColor: 'border-teal-500/30',
        points: [
          { label: '13-Digit SA ID Sync', text: 'Validates resident identity while offering encrypted SIU anti-corruption reporting.' },
          { label: 'Ward Councillor Desks', text: 'Ward Councillors receive geotagged constituent issues with live status badges.' },
          { label: 'Eskom & Joburg Water Direct Link', text: 'Automatic dispatch to technical dispatch centers.' },
        ],
      },
      {
        id: 'hierarchy',
        tag: '03 · SOUTH AFRICA ADMINISTRATIVE ARCHITECTURE',
        title: 'Structured for COGTA & Municipal Metros',
        subtitle: 'From COGTA down to Municipal Managers, Ward Councillors, and Local Depots.',
        color: 'from-amber-500/20 to-indigo-500/10',
        borderColor: 'border-amber-500/30',
        points: [
          { label: 'L1 COGTA National HQ', text: 'National municipal audit scorecards and provincial delivery benchmarks.' },
          { label: 'L2 Metros & Municipal Managers', text: 'Managers assign departmental budgets, issue officer access codes, monitor SLAs.' },
          { label: 'L3 4,392 Ward Councillors', text: 'Ward Councillors oversee field execution and constituent sign-offs.' },
        ],
      },
      {
        id: 'impact',
        tag: '04 · MEASURABLE PUBLIC SERVICE IMPACT',
        title: 'Enforceable 24h–48h SLA Timers & SIU Audit Logs',
        subtitle: 'Driving transparent municipal accountability across all 9 Provinces of South Africa.',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        points: [
          { label: 'Strict 24h–48h SLA', text: 'Unhandled tickets escalate automatically to Executive Mayor level.' },
          { label: 'Special Investigating Unit (SIU) Link', text: 'Immutable digital audit logs assist corruption investigations.' },
          { label: 'Public Ward Ranking Index', text: 'Live public dashboard rates ward repair efficiency.' },
        ],
      },
    ],
    hierarchy: [
      { level: 'LEVEL 1', title: 'COGTA Department & Provincial Executives', badge: 'National Oversight', desc: 'National municipal index, SIU anti-corruption pipeline, provincial benchmarks.', borderColor: 'border-teal-500/40', textColor: 'text-teal-300' },
      { level: 'LEVEL 2', title: '8 Metros & 44 Municipal Managers (Joburg, eThekwini, CPT)', badge: 'Metro Executive', desc: 'Municipal Managers manage budgets, assign depot chiefs, issue officer access codes.', borderColor: 'border-indigo-500/40', textColor: 'text-indigo-300' },
      { level: 'LEVEL 3', title: '4,392 Ward Councillors & Sub-Council Desks', badge: 'Ward Executive', desc: 'Ward Councillors oversee constituent ticket dispatch and verify repair completion.', borderColor: 'border-amber-500/40', textColor: 'text-amber-300' },
      { level: 'LEVEL 4', title: 'Verified Citizens & 13-Digit SA ID Holders', badge: 'Public Access', desc: 'Residents across all 9 provinces submit geotagged issues via Web App or USSD.', borderColor: 'border-emerald-500/40', textColor: 'text-emerald-300' },
    ],
    proposalText: `🏛️ CIVICDUTY GOVERNMENT PROPOSAL: REPUBLIC OF SOUTH AFRICA
------------------------------------------------------------
Target Body: Department of Cooperative Governance (COGTA) & Municipalities
Core Objective: Municipal Service Delivery & 4,392 Ward Councillor Accountability Engine
Access Layer: Web App + USSD + Municipal Government Desks
Key Metric: Coverage across 8 Metros, 44 District Municipalities & 4,392 Wards.

Key Capabilities:
1. 13-Digit SA ID authenticated reporting with SIU anti-corruption pipeline.
2. 1-Click access code minting for Municipal Managers, Ward Councillors, and Depot Chiefs.
3. Enforceable 24h-48h SLA timers with escalation to Executive Mayors.
4. Integrated state entities: Eskom, Joburg Water, SAPS Police, SANRAL.`,
  },
};

// Fallback generator for other countries (ET, EG, SN, ZM, ZW, US, GB, IN)
export function getCountryPitch(code: string): CountryPitchData {
  if (PITCH_PROFILES[code]) {
    return PITCH_PROFILES[code];
  }

  const country = COUNTRIES[code] || { name: 'Government', flag: '🏛️', id_label: 'National Identity Card', node: 'NODE_01' };

  return {
    code,
    name: country.name,
    flag: country.flag,
    idLabel: country.id_label,
    motto: `${country.name} National Civic Accountability & Field Service Engine`,
    leadMinistry: `Ministry of Local Government & Internal Administration of ${country.name}`,
    level1Title: `National Executive Cabinet & Ministry HQ (${country.name})`,
    level2Title: `Regional Governors, Mayors & District Executives`,
    level3Title: `Local Ward Administrators, Municipal Chiefs & Field Desks`,
    level4Title: `Universal Access via Web App & USSD Channel`,
    statUnits: '100%',
    statLabel: 'Territories',
    agenciesCivic: ['Local Government', 'Infrastructure Dept', 'National Police'],
    agenciesUtility: ['Water Board', 'Power Distribution', 'Telecom Operator'],
    slides: [
      {
        id: 'problem',
        tag: `01 · THE CIVIC CHALLENGE IN ${country.name.toUpperCase()}`,
        title: `Transforming Public Service Delivery Across ${country.name}`,
        subtitle: `Paper bureaucracy, lost field reports, and unmonitored repair delays create persistent friction between citizens and public authorities.`,
        color: 'from-red-500/20 to-amber-500/10',
        borderColor: 'border-red-500/30',
        points: [
          { label: 'Opaque Response Timers', text: 'Citizens report broken water lines, road hazards, or outages without clear ETAs or feedback.' },
          { label: 'Lack of Executive Visibility', text: 'District and regional administrators lack real-time digital dashboards to inspect field ticket queues.' },
          { label: 'Multi-Channel Inclusion', text: 'All citizens need digital access regardless of device or connectivity constraints.' },
        ],
      },
      {
        id: 'solution',
        tag: `02 · THE CIVICDUTY SOLUTION FOR ${country.name.toUpperCase()}`,
        title: `Verified Identity & Accountability Engine for ${country.name}`,
        subtitle: `Connecting citizen complaints directly to local municipal desks and utility engineers with an immutable audit trail.`,
        color: 'from-teal-500/20 to-emerald-500/10',
        borderColor: 'border-teal-500/30',
        points: [
          { label: `${country.id_label} Sync`, text: 'Authenticates genuine residents while enabling encrypted whistleblower reporting.' },
          { label: 'Automated Officer Minting', text: 'Node admins issue single-use access codes to local officers in seconds.' },
          { label: 'Live SLA Escalations', text: 'Enforces strict 24h–72h timers before automatic escalation to senior executives.' },
        ],
      },
      {
        id: 'hierarchy',
        tag: `03 · ADMINISTRATIVE ROLLOUT IN ${country.name.toUpperCase()}`,
        title: `Mapped Directly to ${country.name} Governance Structure`,
        subtitle: 'From national ministry oversight down to regional directors, ward chiefs, and field crews.',
        color: 'from-amber-500/20 to-indigo-500/10',
        borderColor: 'border-amber-500/30',
        points: [
          { label: 'L1 Cabinet Oversight', text: 'National benchmark comparison and regional SLA compliance rankings.' },
          { label: 'L2 Regional / District Desks', text: 'Executives assign department budgets, issue access codes, and monitor resolution rates.' },
          { label: 'L3 Grassroots Field Desks', text: 'Local officers manage physical repairs and upload photographic work proof.' },
        ],
      },
      {
        id: 'impact',
        tag: `04 · MEASURABLE PUBLIC SERVICE IMPACT`,
        title: 'High SLA Compliance & Verified Public Trust',
        subtitle: 'Dramatically improving response times and citizen satisfaction ratings.',
        color: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        points: [
          { label: 'Enforceable SLA Deadlines', text: '24h–72h timers push prompt responses before automatic escalation.' },
          { label: 'Anti-Corruption Audit Trail', text: 'Immutable digital logs assist government integrity oversight.' },
          { label: 'Citizen Proof Verification', text: 'Residents verify completed work quality before ticket closure.' },
        ],
      },
    ],
    hierarchy: [
      { level: 'LEVEL 1', title: `National Ministry & Executive Cabinet (${country.name})`, badge: 'National Oversight', desc: 'National policy, anti-corruption pipelines, executive benchmarking.', borderColor: 'border-teal-500/40', textColor: 'text-teal-300' },
      { level: 'LEVEL 2', title: 'Regional Governors, Mayors & District Executives', badge: 'Regional Executive', desc: 'Executives manage local budgets, assign department heads, issue officer access codes.', borderColor: 'border-indigo-500/40', textColor: 'text-indigo-300' },
      { level: 'LEVEL 3', title: 'Local Ward Officers & Municipal Field Desks', badge: 'Field Executive', desc: 'Field officers receive geotagged reports, dispatch crews, and upload proof of work.', borderColor: 'border-amber-500/40', textColor: 'text-amber-300' },
      { level: 'LEVEL 4', title: `Verified Citizens & ${country.id_label} Holders`, badge: 'Public Access', desc: `Residents submit geotagged issues via Web App or USSD.`, borderColor: 'border-emerald-500/40', textColor: 'text-emerald-300' },
    ],
    proposalText: `🏛️ CIVICDUTY GOVERNMENT PROPOSAL: ${country.name.toUpperCase()}
------------------------------------------------------------
Target Body: Ministry of Local Government & Executive Authorities of ${country.name}
Core Objective: National Civic Accountability & Municipal Field Operations Engine
Access Layer: Web App + USSD + Government Desks
Identity Verification: ${country.id_label}

Key Capabilities:
1. ${country.id_label} authenticated citizen reporting with anti-corruption whistleblowing.
2. 1-Click access code generation for all regional directors and local ward chiefs.
3. Enforceable 24h-72h SLA timers with automatic escalation to senior ministry.
4. Integrated civil authorities and public utilities across ${country.name}.`,
  };
}
