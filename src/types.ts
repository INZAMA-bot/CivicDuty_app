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
  | 'telecom' 
  | 'finance' 
  | 'praise' 
  | 'other';

export type LaneType = 'civic' | 'consumer';

export interface TerritoryNode {
  id: string;
  name: string;
  variant?: 'city' | 'municipal' | 'capital';
  children?: TerritoryNode[];
}

export interface Department {
  id: string;
  name: string;
  full: string;
  icon?: string;
  ministry?: string;
  sla: number; // in hours
  lane?: LaneType;
  registered?: boolean;
  reg?: string;
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
}

export interface PostTerritory {
  district: string;
  subcounty: string;
  parish: string;
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
  citizen_satisfied?: boolean | null;
  escalated?: boolean;
  project?: string;
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
}

export interface UserSession {
  id: string;
  role: RoleType;
  country: CountryCode;
  dept?: string;
  scope?: string;
  is_utility?: boolean;
  role_label?: string;
  real_title_short?: string;
  scope_label?: string;
  dept_label?: string;
  nodeTag?: string;
  followed?: string[];
  name?: string;
  avatar_url?: string;
}

export interface GovCodeData {
  country: CountryCode;
  dept: string;
  scope: string;
  role: RoleType;
  is_utility: boolean;
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

export type LanguageCode = 'EN' | 'LG' | 'SW' | 'RW';

export interface OfflineQueueItem {
  id: string;
  post: Post;
  timestamp: string;
  retries: number;
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
  | 'verify';
