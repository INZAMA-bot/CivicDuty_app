export type CountryCode =
  | 'UG'
  | 'KE'
  | 'NG'
  | 'GH'
  | 'RW'
  | 'TZ'
  | 'ZA'
  | 'ET'
  | 'EG'
  | 'SN'
  | 'ZM'
  | 'ZW'
  | 'US'
  | 'GB'
  | 'IN'
  | string;

export interface NationalRolloutArrangement {
  countryCode: string;
  countryName: string;
  flag: string;
  totalTargetDesks: number;
  primaryUnitName: string;
  tiersDescription: string;
  superadminMinistry?: string;
  superadminTitle?: string;
  superadminSubtitle?: string;
  superadminShort?: string;
  superadminDescription?: string;
  superadminDeskButton?: string;
  superadminRefCode?: string;
  lowestOfficerTitle?: string;
  lowestOfficerUnit?: string;
  lowestOfficerTeamRoles?: Array<{ role: string; description: string; defaultName: string }>;
  districts?: Array<{
    id: string;
    name: string;
    region: string;
    cao: string;
    activeNodes: string;
    status: string;
    rollDate: string;
    sla: string;
    pdmParishes?: number;
    risk: string;
    uptime: string;
    avgResponseHours: number;
    casesLogged: number;
    casesResolved: number;
    csatScore: number;
    ddegCompliance: string;
    subCounties: string[];
    chiefsRoster: Array<{ name: string; ward: string; status: string; ussdActive: boolean; teamSize?: number }>;
  }>;
  targets: {
    l1Title: string;
    l1Target: number;
    l2l3Title: string;
    l2l3Target: number;
    l4Title: string;
    l4Target: number;
    l5Title: string;
    l5Target: number;
    roTitle: string;
    roTarget: number;
  };
}

export type RoleType = 'citizen' | 'platform_admin' | 'node_admin' | 'spokesperson' | 'read_only';

export type TicketStatus = 'pending' | 'received' | 'investigating' | 'budget' | 'resolved' | 'overdue' | 'cannot';

export type TicketCategory = 
  | 'corruption' 
  | 'pothole' 
  | 'water' 
  | 'power' 
  | 'health' 
  | 'waste' 
  | 'police' 
  | 'education' 
  | 'hospitality'
  | 'transport'
  | 'housing'
  | 'telecom' 
  | 'finance' 
  | 'praise' 
  | 'other';

export type LaneType = 'civic' | 'consumer';

export type EntityCategory = 
  | 'government'
  | 'education'
  | 'health'
  | 'food_dining'
  | 'hospitality'
  | 'retail_shops'
  | 'nightlife_bars'
  | 'pharmacy_chemists'
  | 'artisans_garages'
  | 'finance'
  | 'banking_finance'
  | 'transport'
  | 'transport_cooperative'
  | 'housing'
  | 'utility'
  | 'telecom'
  | 'private_utility_telecom'
  | 'contractor'
  | 'private_contractor'
  | 'cso'
  | 'ngo_civil_society'
  | 'faith_cbo'
  | 'academic_research'
  | 'commercial_corporate'
  | 'other'
  | string;

export interface TerritoryNode {
  id: string;
  name: string;
  variant?: 'city' | 'municipal' | 'capital';
  children?: TerritoryNode[];
}

export interface ClaimedEntityRecord {
  deptId: string;
  country: CountryCode;
  businessName: string;
  representativeName: string;
  officialEmail: string;
  phone: string;
  role: string;
  plan: 'free' | 'community' | 'cluster' | 'district' | 'regional' | 'national' | 'starter' | 'pro' | 'enterprise' | string;
  claimedAt: string;
  verified: boolean;
  tinOrReg?: string;
  monthlyFee: number;
  billingInterval?: 'annual' | 'monthly';
  territoryScope?: string;
  unitsCovered?: number;
  feeUsd?: number;
  localCurrencyPrice?: string;
  trialStatus?: 'founding_partner_trial' | 'active_paid' | 'expired';
  trialEndsAt?: string;
  customLocation?: string;
  customDescription?: string;
  customAvatarUrl?: string;
  customIcon?: string;
  customHotline?: string;
  customWebsite?: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  full: string;
  icon?: string;
  ministry?: string;
  country?: CountryCode;
  sla: number; // in hours
  lane?: LaneType;
  category?: EntityCategory;
  sector?: string;
  trustScore?: number; // 0-100%
  verified?: boolean;
  stakeholdersCount?: number;
  location?: string;
  qualityAudit?: string;
  licenseNo?: string;
  registered?: boolean;
  reg?: string;
  isClaimed?: boolean;
  claimedPlan?: 'starter' | 'pro' | 'enterprise';
  claimedBy?: string;
  isEnterprise?: boolean;
  deskType?: 'enterprise_sovereign' | 'grassroots_parish';
  claimPrice?: number;
  qrPlacardUrl?: string;
  nudgeCount?: number;
  unclaimedReason?: string;
}

export interface CountryInfo {
  name: string;
  node: string;
  id_label: string;
  id_ph: string;
  flag: string;
  currency?: string;
}

export interface GovernanceTier {
  depth: number;
  tier: string;
  unit: string;
  title: string;
  short: string;
  role: RoleType;
  sla: number;
  primary?: boolean;
}

export interface MediaItem {
  type: 'image' | 'video' | 'voice' | 'doc';
  url?: string;
  caption?: string;
  thumb?: string;
  duration?: string;
  name?: string;
  size?: string;
  waveform?: number[];
}

export interface Comment {
  id: string;
  sender: string;
  sender_id?: string;
  role: 'citizen' | 'gov';
  body: string;
  status_tag?: TicketStatus;
  media?: MediaItem[];
  created_at: string;
  helpful?: number;
  not_helpful?: number;
  anonymous?: boolean;
  location_badge?: string;
  gps?: { lat: string; lng: string } | null;
  avatar_url?: string;
  parent_id?: string;
  reply_to_sender?: string;
  upvotes?: number;
}

export interface CivicPollOption {
  id: string;
  label: string;
  votes: number;
}

export interface CivicPoll {
  question: string;
  options: CivicPollOption[];
  total_votes: number;
  ends_at?: string;
  voted_option_id?: string;
}

export interface CommunityNote {
  id: string;
  author_name: string;
  author_rank: string;
  body: string;
  source_url?: string;
  helpful_votes: number;
  created_at: string;
  verified_consensus?: boolean;
}

export interface PostTerritory {
  district: string;
  subcounty: string;
  parish: string;
}

export interface EscalationRecord {
  tier: 'tier1_parish' | 'tier2_subcounty' | 'tier3_district_cao' | 'tier4_ministry';
  tierLabel: string;
  promoted_at: string;
  officer_responsible: string;
  reason: string;
}

export interface BudgetAllocation {
  source: string; // e.g. "MoFPED DDEG Capital Grant", "Road Maintenance Fund"
  allocated_amount: number;
  spent_amount: number;
  currency: string;
  contractor_name?: string;
  milestone_progress?: number; // 0 - 100
}

export interface CompiledWitnessReport {
  id: string;
  citizen_id: string;
  citizen_name: string;
  author_profession?: string;
  anonymous: boolean;
  body: string;
  gps?: { lat: string; lng: string } | null;
  media?: MediaItem[];
  created_at: string;
  source: 'web' | 'sms' | 'ussd';
}

export interface Post {
  id: string;
  country: CountryCode;
  dept: string;
  lane: LaneType;
  territory: PostTerritory;
  citizen_id: string;
  citizen_name: string;
  citizen_rank: string;
  citizen_avatar?: string;
  anonymous: boolean;
  category: TicketCategory;
  title: string;
  body: string;
  location: string;
  gps?: { lat: string; lng: string } | null;
  source: 'web' | 'sms' | 'ussd';
  media: MediaItem[];
  voice_url?: any;
  status: TicketStatus;
  gov_status?: TicketStatus;
  is_corruption?: boolean;
  created_at: string;
  comments: Comment[];
  upvotes: number;
  downvotes?: number;
  author_profession?: string;
  citizen_satisfied?: boolean | null;
  escalated?: boolean;
  escalation_tier?: 'tier1_parish' | 'tier2_subcounty' | 'tier3_district_cao' | 'tier4_ministry';
  escalation_history?: EscalationRecord[];
  citizen_dispute_status?: 'pending_citizen_confirmation' | 'confirmed_by_community' | 'disputed_with_counter_evidence';
  dispute_evidence?: string;
  budget_allocation?: BudgetAllocation;
  crypto_seal_hash?: string;
  project?: string;
  compiled_reports?: CompiledWitnessReport[];
  compiled_count?: number;
  is_master_dossier?: boolean;
  merged_from_ids?: string[];
  is_demo?: boolean;
  demo_highlight?: string;
  reposts?: number;
  quote_of?: {
    id: string;
    title: string;
    citizen_name: string;
    dept_name: string;
    snippet: string;
  };
  poll?: CivicPoll;
  community_notes?: CommunityNote[];
  before_after?: {
    before_url: string;
    after_url: string;
    before_label?: string;
    after_label?: string;
  };
  voice_note?: {
    duration: string;
    transcript?: string;
    language?: string;
    audio_url?: string;
  };
  hashtags?: string[];
}

export interface UserProfile {
  id: string;
  country: CountryCode;
  id_frag: string;
  display_name: string;
  phone?: string;
  civic_score: number;
  rank: string;
  followed: string[];
  posts?: number;
  resolved?: number;
  corruption_reports?: number;
  upvotes_received?: number;
  avatar_url?: string;
  bio?: string;
  residency_type?: 'citizen' | 'foreign_resident';
  home_country?: CountryCode;
  permit_type?: string;
  permit_label?: string;
  permit_number?: string;
  permit_expiry?: string;
}

export interface EntityRolePermissions {
  can_reply: boolean; // Respond to customer/patron reviews & complaints
  can_resolve: boolean; // Mark issues investigating / resolved with proof
  can_broadcast: boolean; // Broadcast public announcements & advisories
  can_view_billing: boolean; // View receipts, invoices & seat subscription
  can_manage_staff: boolean; // Issue staff invites & manage shifts
  is_readonly?: boolean; // Observer mode
}

export interface EntityCustomRole {
  id: string;
  dept: string;
  title: string;
  description: string;
  color: string;
  permissions: EntityRolePermissions;
  is_default?: boolean;
  is_custom?: boolean;
  created_at?: string;
}

export interface UserSession {
  id: string;
  role: RoleType;
  country: CountryCode;
  dept?: string;
  scope?: string;
  is_utility?: boolean;
  is_admin?: boolean;
  role_label?: string;
  real_title_short?: string;
  scope_label?: string;
  dept_label?: string;
  nodeTag?: string;
  followed?: string[];
  name?: string;
  avatar_url?: string;
  entity_type?: 'government' | 'non_government_entity';
  entity_category?: EntityCategory;
  custom_category_specify?: string;
  organization_name?: string;
  professional_identity?: string;
  business_typology?: string;
  custom_typology_specify?: string;
  custom_title_specify?: string;
  staff_role?: 'owner_admin' | 'duty_manager' | 'customer_rep' | 'field_technician' | 'auditor' | string;
  seat_limit?: number;
  assigned_role_id?: string;
  assigned_role_title?: string;
  duty_station?: string;
  contact_phone?: string;
  permissions?: EntityRolePermissions;
  hierarchy_level?: 'tier1_parish' | 'tier2_subcounty' | 'tier3_district_cao' | 'tier4_agency' | 'tier5_perm_sec';
  escalation_rank?: number;
  officer_name?: string;
  residency_type?: 'citizen' | 'foreign_resident';
  home_country?: CountryCode;
  permit_type?: string;
  permit_label?: string;
  permit_number?: string;
  permit_expiry?: string;
}

export interface GovCodeData {
  country: CountryCode;
  dept: string;
  scope: string;
  role: RoleType;
  is_utility: boolean;
  is_admin?: boolean;
  role_label?: string;
  real_title_short?: string;
  hierarchy_level?: 'tier1_parish' | 'tier2_subcounty' | 'tier3_district_cao' | 'tier4_agency' | 'tier5_perm_sec';
  escalation_rank?: number; // 1 (Lowest: Parish) -> 2 (Sub-County/Town Clerk) -> 3 (District CAO) -> 4 (Agency) -> 5 (Permanent Secretary)
  officer_name?: string;
  entity_type?: 'government' | 'non_government_entity';
  entity_category?: EntityCategory;
  custom_category_specify?: string;
  organization_name?: string;
  professional_identity?: string;
  business_typology?: string;
  custom_typology_specify?: string;
  custom_title_specify?: string;
  staff_role?: 'owner_admin' | 'duty_manager' | 'customer_rep' | 'field_technician' | 'auditor' | string;
  seat_limit?: number;
  assigned_role_id?: string;
  assigned_role_title?: string;
  duty_station?: string;
  contact_phone?: string;
  permissions?: EntityRolePermissions;
}

export interface Invite {
  code: string;
  name: string;
  title: string;
  role: RoleType;
  scope: string;
  dept: string;
  is_utility: boolean;
  used: boolean;
  country?: CountryCode;
  professional_identity?: string;
  staff_role?: string;
  custom_title_specify?: string;
  is_admin?: boolean;
  assigned_role_id?: string;
  assigned_role_title?: string;
  duty_station?: string;
  contact_phone?: string;
  permissions?: EntityRolePermissions;
  hierarchy_level?: 'tier1_parish' | 'tier2_subcounty' | 'tier3_district_cao' | 'tier4_agency' | 'tier5_perm_sec';
  escalation_rank?: number;
  invited_by?: string;
  invited_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  scope: string;
  email: string;
  role: RoleType;
  dept: string;
  is_utility: boolean;
  active: boolean;
  joined: string;
  reason?: string | null;
  note?: string | null;
  country?: CountryCode;
  professional_identity?: string;
  staff_role?: string;
  custom_title_specify?: string;
  is_admin?: boolean;
  assigned_role_id?: string;
  assigned_role_title?: string;
  duty_station?: string;
  contact_phone?: string;
  phone?: string;
  invited_by?: string;
  invite_code?: string;
  permissions?: EntityRolePermissions;
  deptName?: string;
  points?: number;
  badge?: string;
  joinedAt?: string;
  hierarchy_level?: 'tier1_parish' | 'tier2_subcounty' | 'tier3_district_cao' | 'tier4_agency' | 'tier5_perm_sec';
  escalation_rank?: number;
}

export interface AuditEntry {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  ticket_id: string;
  detail: string;
  ts: string;
  country?: CountryCode;
  dept?: string;
  hash?: string;
  query_id?: string;
  target_unit?: string;
  tamper_seal?: string;
}

export type OfficialQueryCategory =
  | 'sla_breach'
  | 'pdm_irregularity'
  | 'unattended_reports'
  | 'desk_abandonment'
  | 'procurement_audit'
  | 'general_supervisory';

export type OfficialQueryStatus =
  | 'pending_response'
  | 'under_review'
  | 'resolved_exonerated'
  | 'remedial_directive'
  | 'escalated_igg';

export interface OfficialQueryResponse {
  officerName: string;
  officerTitle: string;
  respondedAt: string;
  justification: string;
  correctiveActionTaken: string;
  attachmentNote?: string;
}

export interface OfficialQueryDetermination {
  determinedBy: string;
  determinedByTitle: string;
  determinedAt: string;
  verdict: 'resolved_exonerated' | 'remedial_directive' | 'escalated_igg';
  comments: string;
  disciplinaryPenalty?: string;
}

export interface OfficialQuery {
  id: string;
  queryRef: string;
  country: CountryCode;
  dept?: string;
  issuerName: string;
  issuerTitle: string;
  issuerRole: string;
  issuerRank?: number;
  targetUnit: string;
  targetScope: string;
  targetOfficer: string;
  targetTitle: string;
  category: OfficialQueryCategory;
  subject: string;
  grounds: string;
  evidenceDetails?: string;
  slaScore?: string;
  backlogCount?: number;
  deadlineHours: number;
  deadlineTimestamp: string;
  issuedAt: string;
  status: OfficialQueryStatus;
  response?: OfficialQueryResponse;
  determination?: OfficialQueryDetermination;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  date?: string;
  done: boolean;
  awarderVerified?: boolean;
  awarderSignedBy?: string;
  awarderSignedAt?: string;
  contractorVerified?: boolean;
  contractorSignedBy?: string;
  contractorSignedAt?: string;
}

export interface Project {
  id: string;
  dept?: string;
  contractor: string;
  title: string;
  tender?: string;
  value: string;
  units: string[];
  starts: string;
  completes: string;
  closes: string;
  status: 'active' | 'completed' | 'defects' | 'closed' | 'abandoned';
  code: string;
  country?: CountryCode;
  milestones?: ProjectMilestone[];
}

export interface Subscription {
  id: string;
  gov?: boolean;
  label?: string;
  dept?: string;
  units?: number;
  tier?: string;
  band?: string;
  status: 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled' | 'expired';
  interval: 'annual' | 'monthly';
  amount: number;
  ref?: string;
  period_end: string;
  grace?: number;
  country?: CountryCode;
}

export interface PaymentRecord {
  on: string;
  method: string;
  amount: number;
  ref: string;
}

export interface Invoice {
  no: string;
  sub: string;
  status: 'issued' | 'part_paid' | 'paid';
  amount: number;
  interval?: 'annual' | 'monthly';
  due: string;
  payments: PaymentRecord[];
  country?: CountryCode;
  dept?: string;
}

export type LanguageCode =
  | 'EN' // English
  | 'SW' // Kiswahili
  | 'LG' // Oluganda
  | 'RW' // Ikinyarwanda
  | 'FR' // Français
  | 'ES' // Español
  | 'AR' // العربية
  | 'PT' // Português
  | 'DE' // Deutsch
  | 'ZH' // 中文 (Simplified Chinese)
  | 'HI' // हिन्दी (Hindi)
  | 'RU' // Русский (Russian)
  | 'JA' // 日本語 (Japanese)
  | 'BN' // বাংলা (Bengali)
  | 'NK' // Runyankore-Rukiga
  | 'LU' // Dholuo / Leb-Lango
  | 'HA' // Harshen Hausa
  | 'YO' // Èdè Yorùbá
  | 'AM' // አማርኛ (Amharic)
  | 'ZU'; // isiZulu

export interface OfflineQueueItem {
  id: string;
  post: Post;
  timestamp: string;
  retries: number;
}

// --- PHASE 3: FISCAL VOUCHER & DISBURSEMENT ---
export interface FiscalVoucher {
  id: string;
  voucherNumber: string;
  projectId: string;
  projectTitle: string;
  contractor: string;
  dept?: string;
  country: CountryCode;
  milestoneId: string;
  milestoneTitle: string;
  grossAmount: number;
  currency: string;
  whtTaxRate: number; // e.g. 0.06 (6%)
  whtTaxDeduction: number;
  vatRate: number; // e.g. 0.18 (18%)
  vatAmount: number;
  netPayable: number;
  awarderSigner: string;
  contractorSigner: string;
  treasurySigner: string;
  issuedAt: string;
  disbursementStatus: 'certified_pending_release' | 'disbursed_to_escrow' | 'completed_bank_transfer';
  blockchainSeal: string;
}

// --- PHASE 4: CIRCULAR DISPATCH NOTIFICATION QUEUE ---
export interface ParishChiefNotification {
  id: string;
  circularRef: string;
  subject: string;
  body: string;
  channel: 'sms' | 'whatsapp' | 'ussd_push';
  targetDistrict: string;
  targetChiefName: string;
  targetChiefPhone: string;
  parishName: string;
  status: 'queued' | 'dispatched' | 'delivered' | 'read_receipt_confirmed';
  dispatchedAt: string;
  readAt?: string;
  deliveryLatencyMs?: number;
}

// --- PHASE 5: AFRICAN PAYMENT GATEWAY (MoMo & Cards) ---
export interface GatewayTransaction {
  id: string;
  provider: 'mtn_momo' | 'airtel_money' | 'paystack' | 'flutterwave';
  invoiceId?: string;
  amount: number;
  currency: string;
  payerPhoneOrEmail: string;
  reference: string;
  status: 'pending' | 'success' | 'failed';
  channel: 'mobile_money' | 'card' | 'bank_transfer';
  timestamp: string;
  receiptUrl?: string;
}

// --- PHASE 2: TELECOM SMS & USSD WEBHOOK INGESTION ---
export interface TelecomWebhookPayload {
  sessionId?: string;
  serviceCode?: string;
  phoneNumber: string;
  text: string;
  networkCode?: string; // MTN, AIRTEL, SAFARICOM
}

// --- PHASE 6: DIGITAL UTILITY PERK VOUCHERS & ESCROW VAULT ---
export interface EscrowPerkVoucher {
  id: string;
  voucherCode: string;
  pin?: string;
  category: 'telco_data' | 'water_utility' | 'electricity' | 'transit_credit' | 'supermarket' | 'other';
  brand: string;
  title: string;
  faceValue: number;
  currency: string;
  country: string;
  sponsoredBy: string;
  sponsorType: 'contractor' | 'authority' | 'corporate_csr' | 'citizen_patron';
  projectId?: string;
  projectName?: string;
  batchId: string;
  status: 'escrow_unassigned' | 'dispatched' | 'redeemed' | 'expired';
  createdAt: string;
  isDemo?: boolean;
  reimbursementFraming?: string;
  ethicalPledgeSealed?: boolean;
  selfRedeemedByCitizen?: boolean;
  xpSpent?: number;
  commissionBreakdown?: {
    faceValueTotal: number;
    wholesaleDiscountPct: number;
    wholesaleSpreadCommission: number;
    csrPlatformFeePct: number;
    csrPlatformFee: number;
    totalCivicDutyRevenue: number;
  };
  dispatchedTo?: {
    recipientName: string;
    recipientContact: string; // phone or email
    dispatchedAt: string;
    dispatchedBy: string;
    citationNote?: string;
    postOrProjectId?: string;
    smsDeliveryStatus?: 'sent' | 'delivered';
    ethicalNonInterferenceAck?: boolean;
  };
  redemptionUssdString?: string;
  expiryDate: string;
}

export type ViewType =
  | 'splash'
  | 'ob1'
  | 'ob_home'
  | 'ob3'
  | 'ob2'
  | 'feed'
  | 'depts'
  | 'dept_wall'
  | 'post_detail'
  | 'compose'
  | 'profile'
  | 'gov_inbox'
  | 'gov_reply'
  | 'gov_audit'
  | 'gov_team'
  | 'gov_bulk'
  | 'gov_admin'
  | 'gov_projects'
  | 'gov_billing'
  | 'entity'
  | 'entity_done'
  | 'project'
  | 'ussd'
  | 'docs'
  | 'verify'
  | 'ps_opm_analytics'
  | 'ps_molg_rollout'
  | 'ps_executive_desk'
  | 'company_management'
  | 'transit_preview'
  | 'livery'
  | 'gov_partnership'
  | 'perk_vault'
  | 'cd_ops';

export interface CdOpsPromotionalAd {
  id: string;
  title: string;
  category: 'bodaboda' | 'bus' | 'train' | 'terminal' | 'radio' | 'noticeboard' | 'ussd';
  categoryLabel: string;
  tagline: string;
  summary: string;
  imageSrc: string;
  callToAction: string;
  ctaType: 'ussd' | 'specs' | 'report' | 'perks' | 'custom';
  ctaValue?: string;
  specs?: string;
  sponsorName: string;
  targetAudience: string;
  published: boolean;
  postedAt: string;
  highlights?: string[];
  impressions?: number;
  clicks?: number;
}

export interface CivicNotification {
  id: string;
  type: 'sla_update' | 'upvote' | 'reply' | 'quote' | 'mention' | 'perk' | 'follow' | 'town_hall';
  title: string;
  body: string;
  post_id?: string;
  actor_name: string;
  country: CountryCode;
  created_at: string;
  read: boolean;
}

export interface CitizenDirectMessage {
  id: string;
  thread_id: string;
  participant_name: string;
  participant_handle: string;
  participant_role: string;
  participant_verified?: boolean;
  country: CountryCode;
  messages: Array<{
    id: string;
    sender: 'me' | 'them';
    sender_name: string;
    body: string;
    created_at: string;
    media?: Array<{
      name: string;
      type: string;
      size: string;
      dataUrl?: string;
    }>;
    voice_note?: boolean;
    gps?: { lat: number; lng: number; label?: string };
  }>;
  unread?: number;
}

export interface TownHallSession {
  id: string;
  title: string;
  host_name: string;
  host_title: string;
  dept_name: string;
  country: CountryCode;
  listeners_count: number;
  is_live: boolean;
  topic_tag: string;
  has_video?: boolean;
  broadcast_mode?: 'video_stage' | 'field_cam' | 'audio_low_data';
  video_stream_label?: string;
  speakers: Array<{
    name: string;
    role: string;
    speaking?: boolean;
    video_on?: boolean;
    camera_label?: string;
  }>;
}



