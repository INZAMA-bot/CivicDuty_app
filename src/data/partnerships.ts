import { CountryCode } from '../types';

export interface GovPartnershipRecord {
  id: string;
  countryCode: CountryCode;
  countryName: string;
  flag: string;
  mouReference: string;
  status: 'secured_active' | 'in_ratification' | 'proposed';
  leadMinistry: string;
  focalOfficer: string;
  focalRole: string;
  signedDate: string;
  renewalDate: string;
  ussdShortcode: string;
  idBridgeStatus: 'connected' | 'testing' | 'pending';
  sovereignDataSovereignty: string;
  activeDesksCount: number;
  monthlyBilateralBriefUrl?: string;
  feedbackLoopEnabled: boolean;
  satisfactionScore: number;
  avgResolutionHours: number;
}

export interface GovFeedbackMessage {
  id: string;
  countryCode: CountryCode;
  countryName: string;
  timestamp: string;
  senderMinistry: string;
  senderTitle: string;
  senderOfficer: string;
  subject: string;
  message: string;
  priority: 'routine' | 'urgent' | 'statutory_directive';
  status: 'sent' | 'reviewed_by_cd_ops' | 'actioned';
  cdOpsResponse?: string;
  respondedAt?: string;
  respondedBy?: string;
  actionType?: string;
  assignedStaff?: string;
  internalNotes?: string;
  senderEmail?: string;
  senderPhone?: string;
  dispatchReceiptHash?: string;
}

export interface PartnershipApplication {
  id: string;
  countryCode: CountryCode;
  countryName: string;
  leadMinistry: string;
  applicantName: string;
  applicantTitle: string;
  officialEmail: string;
  phone: string;
  requestedScope: string;
  targetUnits: number;
  submittedAt: string;
  status: 'under_review' | 'bilateral_meeting_scheduled' | 'mou_drafted' | 'approved';
  notes?: string;
}

export const INITIAL_PARTNERSHIPS: GovPartnershipRecord[] = [
  {
    id: 'PART-UG-2026',
    countryCode: 'UG',
    countryName: 'Uganda',
    flag: '🇺🇬',
    mouReference: 'MOU-UG-MOLG-2026/044B',
    status: 'secured_active',
    leadMinistry: 'Ministry of Local Government & MoFPED',
    focalOfficer: 'Ben Kumumanya / Ramathan Ggoobi',
    focalRole: 'PS Local Government / PS Secretary to Treasury',
    signedDate: '2025-01-15',
    renewalDate: '2027-01-14',
    ussdShortcode: '*3030*256#',
    idBridgeStatus: 'connected',
    sovereignDataSovereignty: 'Host: NITA-U Tier-3 Data Center (National Data Sovereignty Act Compliant)',
    activeDesksCount: 146,
    feedbackLoopEnabled: true,
    satisfactionScore: 94,
    avgResolutionHours: 18.4,
  },
  {
    id: 'PART-KE-2026',
    countryCode: 'KE',
    countryName: 'Kenya',
    flag: '🇰🇪',
    mouReference: 'MOU-KE-DEV-2026/012',
    status: 'secured_active',
    leadMinistry: 'Council of Governors & State Dept for Devolution',
    focalOfficer: 'Teresia Mbaika Malokwe',
    focalRole: 'Principal Secretary Devolution',
    signedDate: '2025-03-10',
    renewalDate: '2027-03-09',
    ussdShortcode: '*3030*254#',
    idBridgeStatus: 'connected',
    sovereignDataSovereignty: 'Host: Konza Technopolis Cloud (Kenya Data Protection Act 2019)',
    activeDesksCount: 47,
    feedbackLoopEnabled: true,
    satisfactionScore: 91,
    avgResolutionHours: 21.2,
  },
  {
    id: 'PART-NG-2026',
    countryCode: 'NG',
    countryName: 'Nigeria',
    flag: '🇳🇬',
    mouReference: 'MOU-NG-FMI-2026/099',
    status: 'secured_active',
    leadMinistry: 'Federal Ministry of Special Duties & Inter-Gov Affairs',
    focalOfficer: 'Dr. Ibiene Roberts',
    focalRole: 'Permanent Secretary FMSDIGA',
    signedDate: '2025-06-01',
    renewalDate: '2027-05-31',
    ussdShortcode: '*3030*234#',
    idBridgeStatus: 'connected',
    sovereignDataSovereignty: 'Host: Galaxy Backbone Tier-4 Datacenter (NDPC Compliant)',
    activeDesksCount: 36,
    feedbackLoopEnabled: true,
    satisfactionScore: 88,
    avgResolutionHours: 26.5,
  },
  {
    id: 'PART-RW-2026',
    countryCode: 'RW',
    countryName: 'Rwanda',
    flag: '🇷🇼',
    mouReference: 'MOU-RW-MINALOC-2026/007',
    status: 'secured_active',
    leadMinistry: 'Ministry of Local Government (MINALOC)',
    focalOfficer: 'Samuel Dusengiyumva',
    focalRole: 'Permanent Secretary MINALOC',
    signedDate: '2025-02-20',
    renewalDate: '2027-02-19',
    ussdShortcode: '*3030*250#',
    idBridgeStatus: 'connected',
    sovereignDataSovereignty: 'Host: Kigali National Data Center (Irembo Integrated)',
    activeDesksCount: 30,
    feedbackLoopEnabled: true,
    satisfactionScore: 96,
    avgResolutionHours: 12.8,
  },
  {
    id: 'PART-GH-2026',
    countryCode: 'GH',
    countryName: 'Ghana',
    flag: '🇬🇭',
    mouReference: 'MOU-GH-MLGDRD-2026/033',
    status: 'secured_active',
    leadMinistry: 'Ministry of Local Gov, Decentralisation & Rural Dev',
    focalOfficer: 'Dr. Nana Ato Arthur',
    focalRole: 'Head of Local Government Service',
    signedDate: '2025-04-18',
    renewalDate: '2027-04-17',
    ussdShortcode: '*3030*233#',
    idBridgeStatus: 'connected',
    sovereignDataSovereignty: 'Host: National Information Technology Agency (NITA Ghana)',
    activeDesksCount: 261,
    feedbackLoopEnabled: true,
    satisfactionScore: 89,
    avgResolutionHours: 24.1,
  },
  {
    id: 'PART-TZ-2026',
    countryCode: 'TZ',
    countryName: 'Tanzania',
    flag: '🇹🇿',
    mouReference: 'MOU-TZ-TAMISEMI-2026/021',
    status: 'in_ratification',
    leadMinistry: 'President’s Office Regional Admin & Local Gov (PO-RALG/TAMISEMI)',
    focalOfficer: 'Prof. Riziki Shemdoe',
    focalRole: 'Permanent Secretary PO-RALG',
    signedDate: '2025-08-01',
    renewalDate: '2027-07-31',
    ussdShortcode: '*3030*255#',
    idBridgeStatus: 'testing',
    sovereignDataSovereignty: 'Host: e-Government Authority (e-GA) Datacenter Dodoma',
    activeDesksCount: 184,
    feedbackLoopEnabled: true,
    satisfactionScore: 87,
    avgResolutionHours: 28.0,
  },
  {
    id: 'PART-ZA-2026',
    countryCode: 'ZA',
    countryName: 'South Africa',
    flag: '🇿🇦',
    mouReference: 'MOU-ZA-COGTA-2026/088',
    status: 'in_ratification',
    leadMinistry: 'Department of Cooperative Governance and Traditional Affairs (CoGTA)',
    focalOfficer: 'Ms. Avril Williamson',
    focalRole: 'Director-General CoGTA',
    signedDate: '2025-09-15',
    renewalDate: '2027-09-14',
    ussdShortcode: '*3030*27#',
    idBridgeStatus: 'testing',
    sovereignDataSovereignty: 'Host: SITA Centurion High-Security Node (POPIA Compliant)',
    activeDesksCount: 52,
    feedbackLoopEnabled: true,
    satisfactionScore: 86,
    avgResolutionHours: 29.4,
  },
];

export const INITIAL_FEEDBACK_MESSAGES: GovFeedbackMessage[] = [
  {
    id: 'FDBK-UG-01',
    countryCode: 'UG',
    countryName: 'Uganda',
    timestamp: '2026-09-10 14:32',
    senderMinistry: 'Ministry of Local Government (MoLG)',
    senderTitle: 'Permanent Secretary',
    senderOfficer: 'Ben Kumumanya',
    senderEmail: 'ps@molg.go.ug',
    senderPhone: '+256 414 341 224',
    subject: 'Parish Development Model (PDM) Field Resolution Telemetry Sync',
    message: 'We request enabling the PDM Pillar 3 sub-category in Wakiso and Nakasero Parish terminals to cross-verify fertilizer and road culvert funds with CAO sign-offs.',
    priority: 'statutory_directive',
    status: 'actioned',
    actionType: 'Grassroots Field Sync Enabled',
    cdOpsResponse: 'Pillar 3 PDM telemetry field enabled on node UG-PARISH-NAKASERO and Wakiso CAO dashboard. Automatic PFMA hash seal validated and live.',
    respondedAt: '2026-09-11 09:15',
    respondedBy: 'CivicDuty Lead Platform Architect (CD-Ops)',
    dispatchReceiptHash: '0x8f2d4e81a3c790be42f1',
  },
  {
    id: 'FDBK-UG-02',
    countryCode: 'UG',
    countryName: 'Uganda',
    timestamp: '2026-09-17 16:45',
    senderMinistry: 'Ministry of Finance, Planning & Economic Development (MoFPED)',
    senderTitle: 'Permanent Secretary / Secretary to Treasury',
    senderOfficer: 'Ramathan Ggoobi',
    senderEmail: 'psst@finance.go.ug',
    senderPhone: '+256 414 707 000',
    subject: 'PFMA Section 45 Quarterly Public Expenditure Re-conciliation API Bridge',
    message: 'Under Public Finance Management Act 2015 regulations, our macroeconomic department requires a dedicated read-only telemetry JSON webhook streaming all citizen-verified road and medical deliveries directly into the Treasury Integrated Financial Management System (IFMS) before Q2 disbursement releases.',
    priority: 'statutory_directive',
    status: 'sent',
    assignedStaff: 'Eng. Ronald Ssematimba',
  },
  {
    id: 'FDBK-KE-01',
    countryCode: 'KE',
    countryName: 'Kenya',
    timestamp: '2026-09-11 11:20',
    senderMinistry: 'Council of Governors - Kenya',
    senderTitle: 'Devolution Liaison Director',
    senderOfficer: 'Eng. John Mwangi',
    senderEmail: 'devolution@cog.go.ke',
    senderPhone: '+254 20 240 3314',
    subject: 'County CEC Sanitation SLA Tuning for Nairobi & Kiambu',
    message: 'Nairobi Water and Sewerage Company (NWSC) requires urgent SLA threshold adjustment from 48h to 24h for sewer burst notifications in high-density informal settlements.',
    priority: 'urgent',
    status: 'reviewed_by_cd_ops',
    actionType: 'SLA Timer Calibrated',
    cdOpsResponse: 'SLA timer threshold reconfigured to 24.0h for Nairobi County sanitation lane. Telemetry feed streaming to CEC desk.',
    respondedAt: '2026-09-11 16:40',
    respondedBy: 'CivicDuty Systems Engineer (CD-Ops)',
    dispatchReceiptHash: '0x3a4b91ce871032fd9012',
  },
  {
    id: 'FDBK-KE-02',
    countryCode: 'KE',
    countryName: 'Kenya',
    timestamp: '2026-09-17 10:14',
    senderMinistry: 'Nairobi City County Government',
    senderTitle: 'County Executive Committee Member - Transport & Infrastructure',
    senderOfficer: 'Dr. Mary Chege',
    senderEmail: 'transport@nairobi.go.ke',
    senderPhone: '+254 711 000 300',
    subject: 'Safaricom USSD Emergency Routing for Monsoon Road Drainage Failures',
    message: 'During ongoing seasonal cloudbursts in Industrial Area and Eastleigh, emergency drainage complaints arriving through *3030*254# need instant SMS dispatch to the Quick Response Drainage Unit on-call hotline with zero gateway queuing.',
    priority: 'urgent',
    status: 'sent',
    assignedStaff: 'Kofi Mensah',
  },
  {
    id: 'FDBK-RW-01',
    countryCode: 'RW',
    countryName: 'Rwanda',
    timestamp: '2026-09-12 08:45',
    senderMinistry: 'MINALOC / City of Kigali',
    senderTitle: 'Executive Secretary Gasabo',
    senderOfficer: 'Diane Uwera',
    senderEmail: 'duwera@gasabo.gov.rw',
    senderPhone: '+250 788 123 456',
    subject: 'Irembo National API Bridge Latency Audit',
    message: 'Citizen NIDA verification on USSD *3030*250# completed with zero errors during morning peak. Telemetry confirms 99.98% uptime.',
    priority: 'routine',
    status: 'actioned',
    actionType: 'API Bridge Validated',
    cdOpsResponse: 'Acknowledged with thanks. Gasabo Sector dashboard updated with real-time biometric handshake confirmation.',
    respondedAt: '2026-09-12 09:30',
    respondedBy: 'CD-Ops Reliability Desk',
    dispatchReceiptHash: '0x17c09341ba66ee8921df',
  },
  {
    id: 'FDBK-NG-01',
    countryCode: 'NG',
    countryName: 'Nigeria',
    timestamp: '2026-09-16 14:05',
    senderMinistry: 'Federal Ministry of Special Duties & Intergovernmental Affairs',
    senderTitle: 'Permanent Secretary',
    senderOfficer: 'Dr. Shamsuna Ahmed',
    senderEmail: 'ps@specialduties.gov.ng',
    senderPhone: '+234 9 291 4321',
    subject: 'Decentralized Zonal Intervention Monitoring for 774 Local Government Areas',
    message: 'Under Presidential Directive on constituency project verification, we require CivicDuty Platform Operations to configure zonal coordinator role partitions across North-Central, North-East, and South-South clusters, verifying zero phantom schools before contractor milestone payments.',
    priority: 'statutory_directive',
    status: 'sent',
    assignedStaff: 'Amina Hassan',
  },
  {
    id: 'FDBK-GH-01',
    countryCode: 'GH',
    countryName: 'Ghana',
    timestamp: '2026-09-17 09:30',
    senderMinistry: 'Ministry of Local Government, Decentralisation & Rural Dev (MLGDRD)',
    senderTitle: 'Minister of State',
    senderOfficer: 'Hon. Osei Bonsu Amoah',
    senderEmail: 'minister@mlgrd.gov.gh',
    senderPhone: '+233 302 663 332',
    subject: 'Telecel & MTN Ghana USSD Shortcode Harmonization (*3030*233#)',
    message: 'Accra Metropolitan Assembly (AMA) sanitation taskforces require two-digit routing code (*3030*233*01#) dedicated to rapid municipal solid waste fly-tipping tracking across Greater Accra.',
    priority: 'urgent',
    status: 'sent',
    assignedStaff: 'Kofi Mensah',
  },
  {
    id: 'FDBK-TZ-01',
    countryCode: 'TZ',
    countryName: 'Tanzania',
    timestamp: '2026-09-15 11:50',
    senderMinistry: "President's Office Regional Administration & Local Gov (PO-RALG)",
    senderTitle: 'Permanent Secretary',
    senderOfficer: 'Eng. Joseph Nyamhanga',
    senderEmail: 'ps@tamisemi.go.tz',
    senderPhone: '+255 26 232 1607',
    subject: 'Swahili Natural Language USSD Interface for Ilala & Dodoma Jiji',
    message: 'We instruct CD-Ops to ensure Swahili prompts on *3030*255# adhere strictly to Baraza la Kiswahili la Taifa (BAKITA) standard terminology for public water taps and municipal dispensary grievances.',
    priority: 'routine',
    status: 'reviewed_by_cd_ops',
    actionType: 'Localization Engine Updated',
    cdOpsResponse: 'BAKITA-certified Swahili lexicon applied across all 26 Mainland Tanzania regions on USSD gateway node TZ-DAR-01.',
    respondedAt: '2026-09-16 12:20',
    respondedBy: 'CivicDuty Localization Desk (CD-Ops)',
    dispatchReceiptHash: '0x991823abf104889cba00',
  },
  {
    id: 'FDBK-ZA-01',
    countryCode: 'ZA',
    countryName: 'South Africa',
    timestamp: '2026-09-16 17:15',
    senderMinistry: 'Department of Cooperative Governance and Traditional Affairs (COGTA)',
    senderTitle: 'Deputy Director-General',
    senderOfficer: 'Dr. Nonhlanhla Sibiya',
    senderEmail: 'nsibiya@cogta.gov.za',
    senderPhone: '+27 12 334 0600',
    subject: 'POPIA Compliance Audit Certificate for Whistleblower Cryptographic Vault',
    message: 'Prior to national launch across eThekwini Metro and City of Ekurhuleni, COGTA legal team requires formal cryptographic certificate confirming citizen submissions are salted and hashed on SITA Centurion datacenters.',
    priority: 'statutory_directive',
    status: 'sent',
    assignedStaff: 'Chiamaka Eze',
  },
];

export interface CdOpsStaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  dutyStation: string;
  avatar: string;
  status: 'online' | 'on_call' | 'standby';
  handlingRegions: string[];
  specialization?: string;
  joinedDate?: string;
  activeAssignmentsCount?: number;
}

export interface CdOpsRoleDefinition {
  id: string;
  title: string;
  specialization: string;
  description: string;
  color: string;
  badge: string;
}

export const CD_OPS_ROLE_DEFINITIONS: CdOpsRoleDefinition[] = [
  {
    id: 'lead_infra',
    title: 'Lead Sovereign Infrastructure Architect',
    specialization: 'sovereign_infra',
    description: 'Calibrates national SLA escalation windows, server tier clustering, failover datacenters (NITA-U / Konza), and database resilience.',
    color: 'amber',
    badge: 'ARCHITECTURE',
  },
  {
    id: 'telecom_ussd',
    title: 'Principal Telecom & *3030# USSD Engineer',
    specialization: 'telecom_ussd',
    description: 'Manages telecom aggregation (MTN, Airtel, Safaricom, Vodacom), SMS failover gateways, USSD menu routing, and session concurrency.',
    color: 'emerald',
    badge: 'TELECOM',
  },
  {
    id: 'statutory_liaison',
    title: 'Gov Relations & Statutory Liaison Lead',
    specialization: 'bilateral_relations',
    description: 'Interfaces with Permanent Secretaries, Ministerial Accounting Officers, and bilateral technical working groups for sovereign accession.',
    color: 'teal',
    badge: 'DIPLOMACY',
  },
  {
    id: 'compliance_auditor',
    title: 'Platform Compliance & Anti-Tamper Auditor',
    specialization: 'statutory_compliance',
    description: 'Ensures PFMA 2015 adherence, SHA-256 dispatch hashing, whistleblower vault encryption, and national data sovereignty certifications.',
    color: 'rose',
    badge: 'SECURITY',
  },
  {
    id: 'grassroots_sync',
    title: 'Decentralized Field Operations Specialist',
    specialization: 'grassroots_sync',
    description: 'Orchestrates Parish Development Model (PDM) telemetry sync, CAO district dashboards, and parish chief verification terminals.',
    color: 'sky',
    badge: 'FIELD OPS',
  },
];

export interface CdOpsDispatchTrack {
  id: string;
  title: string;
  priority: 'statutory_directive' | 'urgent' | 'routine';
  slaTargetHours: number;
  requiredRole: string;
  description: string;
  badge: string;
  color: string;
}

export const CD_OPS_DISPATCH_TRACKS: CdOpsDispatchTrack[] = [
  {
    id: 'statutory_directives',
    title: 'Statutory Directives & PFMA Compliance',
    priority: 'statutory_directive',
    slaTargetHours: 2.0,
    requiredRole: 'Platform Compliance & Anti-Tamper Auditor',
    description: 'Directives issued under national finance acts, treasury audit reconciliations, and legislative mandates.',
    badge: 'PFMA LAW',
    color: 'rose',
  },
  {
    id: 'telecom_ussd',
    title: 'Telecom & *3030# USSD Gateway Scaling',
    priority: 'urgent',
    slaTargetHours: 1.0,
    requiredRole: 'Principal Telecom & *3030# USSD Engineer',
    description: 'Telco aggregator queue throttling, session concurrency scaling, and zero-rated shortcode routing.',
    badge: '*3030# TELCO',
    color: 'emerald',
  },
  {
    id: 'sla_calibration',
    title: 'SLA Escalation Window & Penalty Calibration',
    priority: 'urgent',
    slaTargetHours: 4.0,
    requiredRole: 'Lead Sovereign Infrastructure Architect',
    description: 'Tuning resolution countdown timers, automatic statutory breach alerts, and department lane speeds.',
    badge: 'SLA TUNING',
    color: 'amber',
  },
  {
    id: 'grassroots_sync',
    title: 'Grassroots & Sub-Tier Telemetry Sync (PDM / CAO)',
    priority: 'routine',
    slaTargetHours: 6.0,
    requiredRole: 'Decentralized Field Operations Specialist',
    description: 'Cross-verifying parish terminals, feeder road culverts, and local government accounting sign-offs.',
    badge: 'PDM FIELD',
    color: 'sky',
  },
  {
    id: 'bilateral_accords',
    title: 'Sovereign Accords & State Accession Inquiries',
    priority: 'routine',
    slaTargetHours: 8.0,
    requiredRole: 'Gov Relations & Statutory Liaison Lead',
    description: 'Drafting sovereign MoUs, diplomatic transmittal memoranda, and bilateral technical working group agendas.',
    badge: 'ACCORDS',
    color: 'teal',
  },
];

export const CD_OPS_STAFF_ROSTER: CdOpsStaffMember[] = [
  {
    id: 'cd-ops-01',
    name: 'Eng. Ronald Ssematimba',
    role: 'Lead Sovereign Infrastructure Architect',
    email: 'r.ssematimba@civicduty.org',
    phone: '+256 772 109 840',
    dutyStation: 'Kampala & Regional Hub',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    handlingRegions: ['UG', 'RW', 'TZ', 'KE'],
    specialization: 'sovereign_infra',
    joinedDate: '2024-01-10',
    activeAssignmentsCount: 3,
  },
  {
    id: 'cd-ops-02',
    name: 'Amina Hassan',
    role: 'Gov Relations & Statutory Liaison Lead',
    email: 'a.hassan@civicduty.org',
    phone: '+254 722 984 112',
    dutyStation: 'Nairobi Operations Center',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    handlingRegions: ['KE', 'NG', 'GH', 'ET'],
    specialization: 'bilateral_relations',
    joinedDate: '2024-03-15',
    activeAssignmentsCount: 2,
  },
  {
    id: 'cd-ops-03',
    name: 'Kofi Mensah',
    role: 'Principal Telecom & *3030# USSD Engineer',
    email: 'k.mensah@civicduty.org',
    phone: '+233 24 556 7810',
    dutyStation: 'Accra Telecom Cluster',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    handlingRegions: ['GH', 'NG', 'SN', 'ZA'],
    specialization: 'telecom_ussd',
    joinedDate: '2024-05-01',
    activeAssignmentsCount: 2,
  },
  {
    id: 'cd-ops-04',
    name: 'Chiamaka Eze',
    role: 'Platform Compliance & Anti-Tamper Auditor',
    email: 'c.eze@civicduty.org',
    phone: '+234 803 219 4432',
    dutyStation: 'Abuja & Johannesburg Node',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'on_call',
    handlingRegions: ['NG', 'ZA', 'UG', 'ALL'],
    specialization: 'statutory_compliance',
    joinedDate: '2024-06-20',
    activeAssignmentsCount: 1,
  },
];

export interface CdOpsResolutionTemplate {
  id: string;
  title: string;
  category: 'sla' | 'telecom' | 'grassroots' | 'identity' | 'audit' | 'consultation';
  actionType: string;
  defaultStatus: 'actioned' | 'reviewed_by_cd_ops';
  textBuilder: (msg: GovFeedbackMessage) => string;
}

export const CD_OPS_RESOLUTION_TEMPLATES: CdOpsResolutionTemplate[] = [
  {
    id: 'tmpl-sla-calibrated',
    title: '⚡ SLA Threshold Calibrated & Deployed',
    category: 'sla',
    actionType: 'SLA Window Calibrated',
    defaultStatus: 'actioned',
    textBuilder: (msg) =>
      `CivicDuty Platform Operations (CD-Ops) has calibrated the SLA escalation timer for ${msg.countryName} as mandated by ${msg.senderMinistry}. The active window is configured with real-time telemetry streaming to the Accounting Officer's operational desk. All breach countdowns now reflect statutory regulation.`,
  },
  {
    id: 'tmpl-telecom-ussd',
    title: '📡 USSD & Telecom Gateway Scaled',
    category: 'telecom',
    actionType: 'Telecom Gateway Scaled',
    defaultStatus: 'actioned',
    textBuilder: (msg) =>
      `CD-Ops Telecom Reliability Desk has reconfigured the *3030# gateway for ${msg.countryName}. Concurrency capacity has been scaled to 15,000 sessions with high-priority message queues routed directly to ${msg.senderMinistry}'s on-call operational center with zero network queue throttling.`,
  },
  {
    id: 'tmpl-grassroots-sync',
    title: '🛡️ Grassroots / PDM Sub-Tier Sync Enabled',
    category: 'grassroots',
    actionType: 'Grassroots Field Sync Enabled',
    defaultStatus: 'actioned',
    textBuilder: (msg) =>
      `Decentralized telemetry synchronization enabled across all local government sub-nodes for ${msg.countryName}. Local accounting officers, parish chiefs, and zonal inspectors now receive real-time verification handshakes with SHA-256 integrity stamps before fund disbursement milestones.`,
  },
  {
    id: 'tmpl-audit-cert',
    title: '📜 Sovereign Audit Seal & API Bridge Certified',
    category: 'audit',
    actionType: 'Sovereign Audit Cert Minted',
    defaultStatus: 'actioned',
    textBuilder: (msg) =>
      `In compliance with statutory public finance and anti-corruption mandates, CD-Ops has generated the Sovereign Audit Digest for ${msg.senderMinistry}. Cryptographic read-only webhook endpoint has been provisioned with zero-latency SLA and mutual TLS verification enabled.`,
  },
  {
    id: 'tmpl-bilateral-review',
    title: '🔍 Bilateral Technical Review In Progress',
    category: 'consultation',
    actionType: 'Technical Evaluation In Progress',
    defaultStatus: 'reviewed_by_cd_ops',
    textBuilder: (msg) =>
      `CivicDuty Platform Operations acknowledges receipt of directive #${msg.id} from ${msg.senderOfficer} (${msg.senderTitle}, ${msg.senderMinistry}). Our specialized sovereign reliability engineers are evaluating the technical specifications. A bilateral briefing is scheduled within the 4-hour SLA window.`,
  },
];

export const INITIAL_APPLICATIONS: PartnershipApplication[] = [
  {
    id: 'APP-ET-2026-01',
    countryCode: 'ET',
    countryName: 'Ethiopia',
    leadMinistry: 'Ministry of Innovation and Technology (MInT)',
    applicantName: 'Dr. Belete Molla',
    applicantTitle: 'Ministerial Technology Advisor',
    officialEmail: 'partnerships@mint.gov.et',
    phone: '+251 11 126 5737',
    requestedScope: 'National rollout for Addis Ababa City Administration and Oromia Region municipal desks.',
    targetUnits: 120,
    submittedAt: '2026-09-08 10:15',
    status: 'bilateral_meeting_scheduled',
    notes: 'Bilateral technical harmonization meeting scheduled with Ethio Telecom for USSD bridge.',
  },
  {
    id: 'APP-SN-2026-02',
    countryCode: 'SN',
    countryName: 'Senegal',
    leadMinistry: 'Ministère des Collectivités Territoriales',
    applicantName: 'Mamadou Diouf',
    applicantTitle: 'Directeur de la Décentralisation',
    officialEmail: 'decentralisation@collectivites.gouv.sn',
    phone: '+221 33 823 4567',
    requestedScope: 'Dakar Métropole municipal accountability desks and regional sanitation monitoring.',
    targetUnits: 85,
    submittedAt: '2026-09-09 15:30',
    status: 'under_review',
    notes: 'Draft MoU transmitted for French language legal review.',
  },
];

export const SOVEREIGN_PARTNERSHIPS = INITIAL_PARTNERSHIPS;
export const GOV_FEEDBACK_MESSAGES = INITIAL_FEEDBACK_MESSAGES;
export const PARTNERSHIP_APPLICATIONS = INITIAL_APPLICATIONS;
