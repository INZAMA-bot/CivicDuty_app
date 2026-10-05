export interface OfficialDocSection {
  id: string;
  num?: string;
  title: string;
  content: string;
  highlights?: string[];
  callout?: {
    type: 'amber' | 'teal' | 'emerald' | 'indigo' | 'rose';
    title: string;
    text: string;
  };
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface OfficialDocument {
  id: string;
  title: string;
  subtitle: string;
  category: 'CORE SPEC' | 'CONCEPT NOTE' | 'FIELD DOSSIER' | 'REGULATORY' | 'OPERATIONS' | 'USSD PROTOCOL' | 'ECONOMIC MODEL';
  version: string;
  date: string;
  author: string;
  authorTitle: string;
  authorContact: string;
  readTime: string;
  color: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  };
  summary: string;
  sections: OfficialDocSection[];
}

export const OFFICIAL_DOCUMENTS: OfficialDocument[] = [
  {
    id: 'concept-note',
    title: 'National Concept Note & Ministerial Submission',
    subtitle: 'Strategic Rationale, Vision 2040 Alignment & Sovereign Nation Management Blueprint',
    category: 'CONCEPT NOTE',
    version: 'v2.4 Official Submission',
    date: '6th August 2026 / August 2026',
    author: 'Inzama Robin',
    authorTitle: 'Lead System Architect & Founder, CivicDuty',
    authorContact: '0778277900 / 0748338796 • inzamarobin279@gmail.com',
    readTime: '6 min read',
    color: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-900 dark:text-indigo-200',
      border: 'border-indigo-300 dark:border-indigo-800',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-950/80',
      badgeText: 'text-indigo-800 dark:text-indigo-300',
      accent: 'indigo',
    },
    summary: 'The formal concept note submitted to the Minister of ICT & National Guidance, Permanent Secretary, and Office of the Prime Minister (OPM). Explains how CivicDuty digitizes frontline public service delivery across 15 nations, eliminates bureaucratic ghosting, and establishes direct citizen-to-desk accountability.',
    sections: [
      {
        id: 'cn-letterhead',
        title: 'Formal Letter of Submission',
        content: `TO:
The Permanent Secretary & Honorable Minister,
Ministry of Information, Communications Technology & National Guidance,
Kingdom of Uganda / East African Community.

THROUGH:
The Office of the Prime Minister (OPM) — Directorate of Monitoring & Evaluation,
Ministry of Local Government, Republic of Uganda.

DATE: 6th August 2026
SUBJECT: CONCEPT PROPOSAL — DEPLOYMENT OF CIVICDUTY AS NATIONAL DIGITAL PUBLIC INFRASTRUCTURE (DPI) FOR SERVICE DELIVERY OVERSIGHT, CORRUPTION MITIGATION, AND CITIZEN EMPOWERMENT.

Dear Sir/Madam,

I have the honor to formally submit for your strategic consideration the architectural blueprint and operational model for CivicDuty ("Speak. Serve. Be Heard.") — an indigenous, sovereign citizen service delivery and governance oversight platform engineered to resolve the structural communication bottlenecks between citizens, frontline government desks, and commercial service providers.`,
        callout: {
          type: 'indigo',
          title: 'Mission Statement',
          text: 'To guarantee every citizen an immutable right to be heard, eliminate bureaucratic negligence through automated SLA timers, and provide national leadership with real-time, empirical telemetry on public works and service delivery.',
        },
      },
      {
        id: 'cn-executive-summary',
        num: '01',
        title: 'Executive Summary & National Strategic Rationale',
        content: `Across sub-Saharan Africa, vast investments in public infrastructure (rural health centers, seed schools, road network maintenance, and water boreholes) suffer from severe monitoring deficits at the final mile. When a water borehole breaks in a rural sub-county or essential antibiotics stock out at a Health Center IV, citizens currently possess no verifiable mechanism to log their grievances. Petitions are lost in paper registries, officials can easily claim "I was never informed," and municipal leadership remains blind to emerging local crises until public unrest occurs.

CivicDuty reverses this paradigm by providing a unified, multi-channel platform (Web, Smartphone App, and *3030# USSD for basic feature phones) that routes citizen grievances directly to the exact salaried government officer or commercial provider responsible for that specific geographic boundary.`,
        highlights: [
          '100% Free Public Utility: No cost or subscription fees are ever levied on citizens.',
          'Two-Way Closed Accountability Loop: A ticket cannot be closed by an official without attaching verifiable photographic proof of work, which the filing citizen must then confirm.',
          'Multi-Nation Ready: Fully parameterized for 15 sovereign countries with local administrative tiers pre-configured.',
        ],
      },
      {
        id: 'cn-problem-statement',
        num: '02',
        title: 'The Four Structural Bottlenecks in Traditional Governance',
        content: `CivicDuty addresses four fundamental points of failure that degrade citizen trust in public institutions:`,
        table: {
          headers: ['Traditional Bottleneck', 'Root Cause', 'CivicDuty Architectural Remedy'],
          rows: [
            ['1. The "Ghost File" Syndrome', 'Paper files and manual letters are routinely misplaced or ignored without consequence.', 'Cryptographic Ledger: Every report receives a tamper-proof timestamp and public tracking ID.'],
            ['2. Plausible Deniability', 'Officers can claim "I never received this report" or "It was not my jurisdiction".', 'Geographic Desk Binding: Auto-assigned to the exact Parish Chief / Sub-County Chief / Ward Admin.'],
            ['3. Unverified Resolution', 'Offices mark issues "resolved" on paper while the physical problem persists on the ground.', 'Mandatory Photo Proof-of-Work + Citizen Final Verification Gate.'],
            ['4. Anti-Graft Blind Spots', 'Whistleblowers fear retaliation when exposing extortion, ghost workers, or diversion of drugs.', 'Encrypted IGG / Anti-Corruption Whistleblower Pipeline with stripped origin telemetry.'],
          ],
        },
      },
      {
        id: 'cn-tripartite-model',
        num: '03',
        title: 'The Tripartite Governance Architecture',
        content: `CivicDuty rejects the adversarial "complaints forum" model. Instead, it operates on a constructive Tripartite Relationship where each stakeholder possesses distinct duties and tools:

1. SERVICE CONSUMERS (Citizens & Businesses): File geotagged reports, voice notes, and photos; upvote community priorities (reaching 100 upvotes pins the ticket to the top of the provider wall); verify completed work.
2. SERVICE PROVIDERS (Salaried Officers & Private Businesses): Receive auto-routed tickets on their dedicated officer terminal; initiate investigations; post official bulletins; upload proof-of-work upon resolution.
3. STATUTORY REGULATORS (UNBS, NDA, UCC, BoU, MoES): Supervise registered entities, review compliance audits, monitor systemic safety violations, and issue regulatory sanctions.`,
      },
      {
        id: 'cn-vision-alignment',
        num: '04',
        title: 'Alignment with Uganda Vision 2040 & Regional Digital Agendas',
        content: `CivicDuty directly advances key statutory and developmental frameworks:
• Digital Uganda Vision (DUV 2040): Pillar on Digital Services and e-Governance infrastructure.
• Parish Development Model (PDM): Direct digitization of Parish Chief oversight across all 10,594 parishes in Uganda.
• National Anti-Corruption Strategy (NACS): Empirical audit trails supporting the Inspectorate of Government (IGG) and State House Anti-Corruption Unit (SHACU).
• Sustainable Development Goals (SDG 16): Peace, Justice, and Strong Institutions through transparent public resource monitoring.`,
        callout: {
          type: 'emerald',
          title: '30-Day Sandbox Pilot Scope',
          text: 'CivicDuty is immediately available for a 30-day zero-cost sandbox deployment in up to 3 target districts (e.g. Kampala Central, Arua City, Wakiso) covering 50+ public desks and 25 commercial entities within 48 hours.',
        },
      },
      {
        id: 'cn-contact-signoff',
        num: '05',
        title: 'Signatory & Technical Authority',
        content: `Respectfully submitted by:

INZAMA ROBIN
Lead System Architect & Founder, CivicDuty
Developer & Sovereign Technology Researcher
Contacts: +256 778 277 900 / +256 748 338 796
Email: inzamarobin279@gmail.com
Kampala, Republic of Uganda`,
      },
    ],
  },
  {
    id: 'product-spec',
    title: 'Product Specifications & Technical Architecture',
    subtitle: '10-Section Comprehensive Specification, Ledger Schemas & System Design',
    category: 'CORE SPEC',
    version: 'v14.1 Updated',
    date: 'August 2026',
    author: 'Inzama Robin',
    authorTitle: 'System Architect',
    authorContact: '0778277900 • inzamarobin279@gmail.com',
    readTime: '8 min read',
    color: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-900 dark:text-amber-200',
      border: 'border-amber-300 dark:border-amber-800',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/80',
      badgeText: 'text-amber-800 dark:text-amber-300',
      accent: 'amber',
    },
    summary: 'The master engineering and functional specification defining the 10 core pillars of CivicDuty, including multi-tier administrative routing, 15 country definitions, SLA timers, role-based access control, USSD protocol, and foreign exchange revenue repatriation.',
    sections: [
      {
        id: 'ps-sec1',
        num: '01',
        title: 'Executive Summary & Core Delivery Model',
        content: `CivicDuty is a sovereign service delivery and nation oversight infrastructure that creates a transparent, documented, and accountable channel between citizens and service providers. 

Citizens and consumers are the service consumers who file reports, praise, and grievances. Government authorities and registered entities (schools, healthcare centers, restaurants, transport SACCOs, banks, and utilities) are the service providers duty-bound to serve citizens and resolve reports within their published SLA. Statutory government authorities supervise and regulate entities to enforce safety, compliance, and consumer protection.`,
        highlights: [
          'Dual Delivery Lanes: Public Government Infrastructure Lane vs Commercial Provider Services Lane.',
          '100-Upvote Community Prioritization: Democratically escalates grassroots community priorities without algorithmic manipulation.',
          'Immutable Audit Ledger: State changes, comments, and proof attachments are cryptographically logged.',
        ],
      },
      {
        id: 'ps-sec2',
        num: '02',
        title: 'Tripartite Relationship & Two-Lane System',
        content: `CivicDuty operates on two synchronized operational lanes:
1. THE GOVERNMENT LANE: Direct mapping to territorial administrative units (Ministries, Departments, Agencies, Districts, Sub-Counties, Parishes, Villages). Salaried public officials manage civic infrastructure tickets, road repairs, public health clinics, water points, and education standards.
2. THE COMMERCIAL ENTITY LANE: Dedicated service desks for private businesses across 12+ economic sectors (retail stores, nightlife & bars, private pharmacies, dining, artisan workshops/garages, private transport SACCOs, private utilities, telecommunications, and NGOs).`,
      },
      {
        id: 'ps-sec3',
        num: '03',
        title: 'The 5-Step Closed Accountability Loop',
        content: `Every issue on CivicDuty traverses a strict 5-stage state machine that guarantees resolution integrity:`,
        table: {
          headers: ['Step', 'Action', 'System Enforcement'],
          rows: [
            ['Step 1: Speak', 'Citizen files report with GPS, photo, and voice audio.', 'Report is stamped with unique ID and assigned to local desk.'],
            ['Step 2: Timer Starts', 'SLA countdown begins based on category (24h–72h).', 'Public timer is visible on citizen wall and officer dashboard.'],
            ['Step 3: Gov Serves', 'Officer reviews ticket and updates status to Investigating / Scheduled.', 'Public status update is sent to citizen via in-app & SMS.'],
            ['Step 4: Proof of Work', 'Officer completes work and attaches mandatory resolution photo.', 'Ticket cannot enter "Resolved" state without photographic evidence.'],
            ['Step 5: Citizen Heard', 'Citizen receives resolution notice and must confirm if fix is real.', 'If citizen selects "Not Fixed", the ticket re-opens with escalation.'],
          ],
        },
      },
      {
        id: 'ps-sec4',
        num: '04',
        title: 'Multi-Country Architecture (15 Sovereign Nations)',
        content: `No government structure is hardcoded. CivicDuty features a dynamic Territorial Governance Engine that adapts instantly to national administrative hierarchies across 15 countries:
• Uganda (UG): District › Sub-County / Division › Parish / Ward › Village (Desk: Parish Chief)
• Kenya (KE): County › Sub-County › Ward › Village (Desk: Ward Administrator)
• Nigeria (NG): State › Senatorial Zone › LGA › Ward (Desk: Ward Councillor / Admin)
• Ghana (GH): Region › District / Municipal › Electoral Area (Desk: Assembly Member)
• Rwanda (RW): Province › District › Sector › Cell › Village (Desk: Cell Executive Secretary)
• Tanzania (TZ): Region › District › Ward › Village / Mtaa (Desk: Ward Executive Officer)
• South Africa (ZA): Province › District / Metro › Municipality › Ward (Desk: Ward Councillor)
• Ethiopia (ET): Region › Zone › Woreda › Kebele (Desk: Kebele Manager)
• United States (US): State › County › Municipality › Precinct (Desk: Municipal Supervisor)
• United Kingdom (GB): Nation › County / Unitary › Borough › Ward (Desk: Ward Councillor)`,
      },
      {
        id: 'ps-sec5',
        num: '05',
        title: 'Commercial & Civic Service Provider Desks (12+ Sectors)',
        content: `Commercial entities manage customer issues through specialized desks featuring:
• Multi-Seat RBAC: Define custom titles (e.g. Lead Pharmacist, VIP Floor Manager) with granular permissions for replies, resolutions, bulletins, and billing.
• 1-Click Pass Dispatch: Generate single-use staff passes with direct WhatsApp / SMS onboarding links.
• Public Trust Rating: An empirical score calculated from verified resolutions, response speed, and customer satisfaction.`,
      },
      {
        id: 'ps-sec6',
        num: '06',
        title: 'Universal Access: *3030# USSD & Offline PWA Sync',
        content: `To prevent a digital divide, CivicDuty runs on GSM 2G feature phones using the *3030# USSD menu protocol with zero internet data charges. On smartphones, the Progressive Web App (PWA) operates offline with IndexedDB local caching and automatic background synchronization.`,
      },
      {
        id: 'ps-sec7',
        num: '07',
        title: 'Salaried Officer Metrics, SLAs & Merit Matrix',
        content: `Salaried officers are evaluated via automated Service Level Agreements (24h–72h standard response windows). Officer resolution velocity, citizen satisfaction verification rates, and evidence audit trails feed into an objective Merit Matrix accessible to Ministry leadership and the Office of the Prime Minister (OPM).`,
      },
      {
        id: 'ps-sec8',
        num: '08',
        title: 'Statutory Supervision & Whistleblower Pipeline',
        content: `Statutory regulatory bodies (UNBS for standards, NDA for drug safety, UCC for telecommunications, MoES for education) maintain dedicated supervisory visibility over sector entities. An end-to-end encrypted Whistleblower Pipeline routes sensitive graft, extortion, and procurement fraud directly to the Inspectorate of Government (IGG) or National Ombudsman without exposing source telemetry.`,
      },
      {
        id: 'ps-sec9',
        num: '09',
        title: 'Sovereign SaaS Model & Foreign Exchange Inflow',
        content: `CivicDuty operates as a 100% free utility for all citizens. Commercial revenue is generated through B2G national deployments ($50k–$150k/yr) and B2B enterprise tier subscriptions ($15k–$40k/yr). Exporting this sovereign digital infrastructure across regional governments repatriates hard foreign currency earnings and generates direct Corporate Income Tax (CIT) and PAYE revenues for the National Treasury.`,
      },
      {
        id: 'ps-sec10',
        num: '10',
        title: '30-Day Sandbox Pilot & Security Architecture',
        content: `Government partners can deploy CivicDuty in a zero-risk 30-day sandbox pilot across selected districts or municipal wards within 48 hours. The architecture enforces ISO 27001-aligned zero-trust access, TLS 1.3 encryption in transit, AES-256 ledger encryption at rest, and strict geographic data residency.`,
      },
    ],
  },
  {
    id: 'field-dossier',
    title: 'Master Field Dossier & Ground Case Studies',
    subtitle: 'Uganda Operational Audits, Seed School Tracking & Anti-Graft Investigation Procedures',
    category: 'FIELD DOSSIER',
    version: 'v6.1 Special Field Edition',
    date: '6th August 2026',
    author: 'Inzama Robin',
    authorTitle: 'System Architect & Chief Field Investigator',
    authorContact: '0778277900 / 0748338796 • inzamarobin279@gmail.com',
    readTime: '7 min read',
    color: {
      bg: 'bg-teal-500/10',
      text: 'text-teal-900 dark:text-teal-200',
      border: 'border-teal-300 dark:border-teal-800',
      badgeBg: 'bg-teal-100 dark:bg-teal-950/80',
      badgeText: 'text-teal-800 dark:text-teal-300',
      accent: 'teal',
    },
    summary: 'Detailed case studies from municipal audits in Uganda showing how CivicDuty uncovers contractor ghost works, resolves health center IV drug stockouts, tracks district road funds, and empowers grassroots Parish Chiefs to verify projects on the ground.',
    sections: [
      {
        id: 'fd-intro',
        title: 'Operational Context: The Last-Mile Audit Gap',
        content: `This field dossier documents empirical case studies conducted across Ugandan local governments, demonstrating how paper-based reporting fails and how CivicDuty's real-time verification ledger resolves chronic public service deficits.`,
      },
      {
        id: 'fd-case1',
        num: 'CASE 01',
        title: 'Seed School Construction: Contractor Ghost Works Audit',
        content: `LOCATION: Rural Sub-County, Uganda
PROBLEM: Under the UGIFT (Uganda Intergovernmental Fiscal Transfers) program, UGX 2.1 Billion was disbursed for a Seed Secondary School. A contractor submitted milestone billing claiming 80% completion of science laboratories. In reality, only foundation slab concrete had been cast before the site was abandoned for 7 months.
TRADITIONAL FAILURE: The Ministry of Education in Kampala had no photographic telemetry. Periodic inspection teams visited only once a year.
CIVICDUTY RESOLUTION:
1. Parents and the Parish Chief file a geotagged report with timestamped photographs of the abandoned slab.
2. The report triggers an automated 48-hour SLA notice on the District Engineer & Ministry Project Coordinator desks.
3. Upon reaching 100 community upvotes, the ticket is flagged to the Ministry Permanent Secretary and IGG portal.
4. Interim contractor payments are automatically paused pending physical re-verification.
5. Contractor returns to site and delivers science laboratory within 90 days with public photographic progress logs.`,
        callout: {
          type: 'teal',
          title: 'Direct Fiscal Impact',
          text: 'Prevented UGX 600 Million in fraudulent milestone disbursements and secured school completion for 450 rural students.',
        },
      },
      {
        id: 'fd-case2',
        num: 'CASE 02',
        title: 'Health Center IV: Antibiotic Stockouts & Cold Chain Failure',
        content: `LOCATION: Municipal Health Center IV
PROBLEM: Essential malaria artemisinin combination therapies (ACTs) and IV antibiotics were consistently marked "out of stock" at the public dispensary, while private pharmacies 50 meters away sold government-stamped batches.
CIVICDUTY RESOLUTION:
1. Patients use *3030# USSD and the mobile app to log specific stockout dates and batch numbers.
2. National Drug Authority (NDA) and District Health Officer (DHO) dashboards alert on a 300% stockout anomaly.
3. Whistleblower uploads photo of government-stamped medications being sold in private clinics.
4. Joint inspection team audits the health facility dispensary register and intercepts diverted supply boxes.
5. Stock levels are restored and transparent daily inventory counters are displayed on the public health desk wall.`,
      },
      {
        id: 'fd-case3',
        num: 'CASE 03',
        title: 'District Road Fund: Pothole & Culvert Maintenance Verification',
        content: `LOCATION: Peri-Urban Arterial Road (14 km)
PROBLEM: District road maintenance funds of UGX 85 Million were retired with receipts for "culvert installation and gravel regrading". The road remained impassable during rainy seasons due to blocked drainage.
CIVICDUTY RESOLUTION:
1. Boda-boda operators and local business owners file 18 geotagged photos showing washed-out culverts.
2. The District Road Committee receives the public ticket with exact GPS coordinates.
3. Before the District Engineer can mark the ticket "Resolved", the system enforces mandatory upload of completed culvert work and gravel grading photos.
4. Local road users receive verification prompts on their phones and confirm the road is properly graded.`,
      },
      {
        id: 'fd-case4',
        num: 'CASE 04',
        title: 'Commercial Sector: Pharmacy Counterfeit & Surcharge Redress',
        content: `LOCATION: Private Commercial Pharmacy Chain
PROBLEM: A customer purchased infant fever medication that lacked UNBS / NDA verification stamps and was charged a mandatory 5% card payment surcharge without receipt.
CIVICDUTY RESOLUTION:
1. Customer files report on the Pharmacy Desk selecting "Product Safety & Surcharge".
2. The Pharmacy Master Desk Admin receives the ticket; assigned Lead Pharmacist reviews batch records.
3. Within 12 hours, the pharmacy issues an official apology, refunds the surcharge, and recalls the suspect batch.
4. Customer verifies resolution and rates the response 5 stars, preserving the pharmacy Public Trust Index.`,
      },
    ],
  },
  {
    id: 'regulatory-charter',
    title: 'Statutory Regulatory Charter & Compliance Framework',
    subtitle: 'Supervisory Portals for UNBS, NDA, UCC, BoU, MoES & Anti-Corruption Oversight',
    category: 'REGULATORY',
    version: 'v3.0 Sovereign Standard',
    date: 'August 2026',
    author: 'Inzama Robin',
    authorTitle: 'System Architect & Regulatory Framework Lead',
    authorContact: '0778277900 • inzamarobin279@gmail.com',
    readTime: '6 min read',
    color: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-900 dark:text-emerald-200',
      border: 'border-emerald-300 dark:border-emerald-800',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
      accent: 'emerald',
    },
    summary: 'The operational charter detailing how statutory regulatory authorities (UNBS, NDA, UCC, BoU, MoES, KCCA) exercise legal oversight, inspect commercial entity desks, and investigate whistleblower corruption reports in real time.',
    sections: [
      {
        id: 'rc-mandate',
        title: 'Statutory Authority Integration Mandate',
        content: `Under national consumer protection acts and public sector oversight acts, statutory regulatory bodies possess the constitutional authority to supervise private and public sector providers. CivicDuty embeds these regulatory portals directly into the platform workflow.`,
      },
      {
        id: 'rc-bodies',
        num: '01',
        title: 'Statutory Regulatory Matrices',
        content: `Each regulatory body possesses a dedicated supervisory portal with sector-specific audit filters:`,
        table: {
          headers: ['Regulatory Body', 'Regulated Sectors', 'Supervisory Triggers & Escalations'],
          rows: [
            ['UNBS (Standards)', 'Retail, Manufacturing, Food/Dining, Garages', 'Counterfeit goods, substandard weights, expired inventory, missing quality marks.'],
            ['NDA (Drug Authority)', 'Pharmacies, Clinics, Drug Outlets, Herbalists', 'Unregistered drugs, expired medicines, unauthorized personnel, cold-chain failure.'],
            ['UCC (Telecom / Media)', 'Telecoms, ISPs, Private Radio/TV, Couriers', 'Network downtime, dropped calls, billing disputes, illegal broadcasting.'],
            ['BoU / Central Bank', 'Commercial Banks, Microfinance, SACCOs, Fintech', 'Hidden transaction fees, unauthorized account deductions, credit extortion.'],
            ['MoES (Education)', 'Private & Public Schools, Colleges, Universities', 'Illegal fee increments, teacher absenteeism, corporal punishment, sanitation codes.'],
            ['IGG / Anti-Corruption', 'All Government MDAs, Local Governments, Public Desks', 'Procurement kickbacks, diversion of public funds, ghost workers, extortion.'],
          ],
        },
      },
      {
        id: 'rc-whistleblower',
        num: '02',
        title: 'The Whistleblower Encryption Protocol',
        content: `To ensure whistleblowers can expose high-level corruption without fear of persecution:
• Anonymization Gateway: All IP addresses, IMEI identifiers, and phone telemetry are stripped at the ingress boundary.
• Zero-Knowledge Hashing: The identity token is encrypted using the public key of the Inspectorate of Government (IGG) or National Ombudsman.
• Direct Routing: Whistleblower files bypass local district desks and are delivered directly to the national anti-graft registry with end-to-end cryptographic integrity.`,
      },
    ],
  },
  {
    id: 'operations-manual',
    title: 'Commercial Provider Operations Manual & Multi-Seat RBAC',
    subtitle: '12+ Economic Sectors, Role Definitions, Single-Use Access Passes & WhatsApp Onboarding',
    category: 'OPERATIONS',
    version: 'v4.2 Operational Standard',
    date: 'August 2026',
    author: 'Inzama Robin',
    authorTitle: 'Platform Architecture Team',
    authorContact: '0778277900 • inzamarobin279@gmail.com',
    readTime: '5 min read',
    color: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-900 dark:text-purple-200',
      border: 'border-purple-300 dark:border-purple-800',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/80',
      badgeText: 'text-purple-800 dark:text-purple-300',
      accent: 'purple',
    },
    summary: 'The operational manual for businesses and private service providers explaining how to configure multi-seat teams, assign granular staff permissions, mint single-use access passes, and maintain high customer trust ratings.',
    sections: [
      {
        id: 'om-sectors',
        num: '01',
        title: 'Supported Economic Sectors',
        content: `CivicDuty supports 12+ economic sectors with tailored role presets:
1. Retail Shops & Supermarkets (Store Manager, Cashier Supervisor, Inventory Clerk)
2. Nightlife, Bars & Hospitality (Floor Manager, Shift Supervisor, Head of Security)
3. Pharmacy & Healthcare Outlets (Lead Pharmacist, Dispenser, Quality Inspector)
4. Food & Dining Establishments (Restaurant Manager, Head Chef, Hygiene Officer)
5. Artisans, Workshops & Garages (Lead Mechanic, Service Advisor, Workshop Foreman)
6. Private Healthcare Facilities (Clinical Director, Patient Relations Officer, Triage Nurse)
7. Private Education Institutions (Headteacher, Bursar, Student Affairs Officer)
8. Banking, SACCOs & Microfinance (Branch Manager, Customer Relations Officer, Compliance Lead)
9. Transport SACCOs & Operators (Fleet Controller, Route Supervisor, Safety Officer)
10. Private Utilities & Telecommunications (Network Operations Lead, Field Technician, Billing Officer)
11. Private Contractors & Construction (Site Engineer, Safety Inspector, Project Foreman)
12. NGOs & Civil Society Organizations (Program Officer, Field Coordinator, Community Lead)
13. Universal Custom "Other" (User-defined trade and custom operational titles)`,
      },
      {
        id: 'om-rbac',
        num: '02',
        title: 'Granular Role-Based Access Control (RBAC)',
        content: `Entity Administrators configure specific permission matrix toggles for each staff role:
• Can Reply to Citizens: Authorizes staff to respond to public customer feedback and inquiries.
• Can Resolve Tickets: Authorizes staff to update status to "Resolved" with mandatory photo evidence.
• Can Issue Public Bulletins: Authorizes staff to broadcast announcements to the community wall.
• Can View Billing & Quotas: Grants access to invoice downloads, seat upgrades, and subscription plans.
• Can Manage Staff & Roles: Authorizes minting and revoking staff access passes.`,
      },
      {
        id: 'om-dispatch',
        num: '03',
        title: 'Single-Use Access Pass Generation & 1-Click WhatsApp Dispatch',
        content: `Onboarding staff requires zero password memorization:
1. Admin enters staff member's full name, assigned role, and optional duty station / shift.
2. The system mints an encrypted, single-use access code (e.g. STAFF-HOTEL-4821).
3. Admin clicks "Send via WhatsApp" or copies the pre-formatted SMS dispatch message.
4. Staff member opens the Provider Gateway, enters their code, and immediately accesses their authorized desk terminal.`,
      },
    ],
  },
  {
    id: 'ussd-spec',
    title: 'Universal *3030# USSD & Low-Bandwidth Protocol Specification',
    subtitle: 'Zero-Data 2G GSM Menu Engine, 160-Character Paging & Offline PWA Sync',
    category: 'USSD PROTOCOL',
    version: 'v2.8 Network Standard',
    date: 'August 2026',
    author: 'Inzama Robin',
    authorTitle: 'Lead System Architect',
    authorContact: '0778277900 • inzamarobin279@gmail.com',
    readTime: '5 min read',
    color: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-900 dark:text-rose-200',
      border: 'border-rose-300 dark:border-rose-800',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/80',
      badgeText: 'text-rose-800 dark:text-rose-300',
      accent: 'rose',
    },
    summary: 'The technical protocol specification detailing how CivicDuty delivers zero-data governance across basic 2G feature phones using *3030# USSD, along with offline Progressive Web App background synchronization.',
    sections: [
      {
        id: 'us-architecture',
        num: '01',
        title: 'The *3030# USSD GSM Gateway Architecture',
        content: `To ensure 100% population inclusion across rural and low-income demographics without smartphone access:
• Protocol: GSM Phase 2+ USSD (Unstructured Supplementary Service Data).
• Shortcode: *3030# (Dedicated national zero-rated shortcode).
• Session Duration: 120 seconds standard session timeout with automatic state preservation.
• Telecom Gateways: Direct SMPP/HTTP integration with MTN, Airtel, Safaricom, Vodacom, and Ethio Telecom.`,
      },
      {
        id: 'us-menus',
        num: '02',
        title: 'USSD Menu Tree & State Machine',
        content: `*3030# Root Menu Structure:
1. Report Public Issue (Select District › Sub-County › Category: Roads, Health, Water, Schools)
2. Report Commercial Issue (Search Business ID / Phone Number › Category: Product, Price, Service)
3. Check Ticket Status (Enter 6-digit Ticket ID › Receive live status & SLA time)
4. Community Pinned Issues (View top 3 issues with 100+ community upvotes)
5. Official Bulletins (Listen to or read latest emergency announcements)
6. Emergency Whistleblower (Direct confidential report to IGG)`,
      },
      {
        id: 'us-pwa',
        num: '03',
        title: 'Progressive Web App (PWA) Offline Sync Engine',
        content: `For smartphone users operating in areas with intermittent 2G/3G connectivity:
• IndexedDB Local Storage: Full drafting of reports, photos, and voice notes while completely offline.
• ServiceWorker Background Sync: Automatically dispatches queued reports the instant cellular connection is re-established.
• Payload Optimization: Compressed JSON payloads and progressive WebP images keep payload size under 80 KB per transaction.`,
      },
    ],
  },
  {
    id: 'economic-model',
    title: 'Sovereign SaaS Economic Model & Treasury Revenue Projections',
    subtitle: 'B2G / B2B Pricing Matrices, Foreign Exchange Repatriation & 5-Year National Fiscal Impact',
    category: 'ECONOMIC MODEL',
    version: 'v5.1 Financial Architecture',
    date: 'August 2026',
    author: 'Inzama Robin',
    authorTitle: 'System Architect & Commercial Lead',
    authorContact: '0778277900 • inzamarobin279@gmail.com',
    readTime: '6 min read',
    color: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-900 dark:text-blue-200',
      border: 'border-blue-300 dark:border-blue-800',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/80',
      badgeText: 'text-blue-800 dark:text-blue-300',
      accent: 'blue',
    },
    summary: 'The commercial and national treasury economic blueprint showing how CivicDuty remains 100% free for all citizens while generating sustainable B2G and B2B revenues, repatriating foreign exchange earnings, and paying taxes to the national treasury.',
    sections: [
      {
        id: 'em-philosophy',
        num: '01',
        title: 'Universal Citizen Free Access Principle',
        content: `CivicDuty operates on a fundamental principle: Citizens and consumers will NEVER be charged a single cent to file reports, upvote community priorities, or verify public works. Universal access is an uncompromised public good.`,
      },
      {
        id: 'em-pricing',
        num: '02',
        title: 'Commercial SaaS Revenue Streams',
        content: `Revenue is generated through enterprise B2G and B2B subscriptions:`,
        table: {
          headers: ['Revenue Stream', 'Target Market', 'Annual Contract Value (USD)'],
          rows: [
            ['B2G National Deployment', 'National Ministries (ICT, Local Gov, Works, Health)', '$75,000 – $150,000 / year'],
            ['B2G Municipal / District Tier', 'City Authorities, Municipal Councils, District LGs', '$12,000 – $35,000 / year'],
            ['B2B Enterprise Utilities & Telecom', 'Electricity distributors, Water utilities, Telcos', '$25,000 – $60,000 / year'],
            ['B2B Commercial Provider Subscriptions', 'Private schools, hospitals, retail chains, banks', '$240 – $1,200 / year per desk'],
            ['Statutory Regulatory Audit Feeds', 'National regulatory agencies (UNBS, NDA, UCC)', '$18,000 – $45,000 / year'],
          ],
        },
      },
      {
        id: 'em-treasury',
        num: '03',
        title: 'National Treasury Tax Inflows & Foreign Exchange Repatriation',
        content: `As an indigenous technology export deployed across 15 nations:
• Foreign Currency Inflow: Subscription revenues from Kenya, Tanzania, Rwanda, Nigeria, Ghana, and South Africa are repatriated as hard currency (USD / EUR / GBP).
• Corporate Income Tax (CIT 30%): Direct tax remittances paid into the Consolidated Fund of Uganda.
• PAYE & Employment: Creation of high-value software engineering, cybersecurity, and data analysis jobs for Ugandan youth.
• Public Expenditure Savings: Eliminates an estimated 15–22% in ghost contractor works and procurement inflation across local governments.`,
      },
    ],
  },
];
