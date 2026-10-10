import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuditEntry,
  CountryCode,
  GovCodeData,
  Invoice,
  Invite,
  Post,
  Project,
  Subscription,
  TeamMember,
  UserProfile,
  UserSession,
  ViewType,
  LanguageCode,
  OfflineQueueItem,
  ClaimedEntityRecord,
  OfficialQuery,
  OfficialQueryCategory,
  OfficialQueryStatus,
  OfficialQueryResponse,
  OfficialQueryDetermination,
  CdOpsPromotionalAd,
  CompiledWitnessReport,
  CivicNotification,
  CitizenDirectMessage,
  TownHallSession,
} from '../types';
import { INITIAL_PROMOTIONAL_ADS } from '../data/promotionalAds';
import { getDynamicCountryDemos } from '../data/countryDemos';
import {
  INITIAL_AUDIT,
  INITIAL_INVOICES,
  INITIAL_INVITES,
  INITIAL_POSTS,
  INITIAL_PROFILES,
  INITIAL_PROJECTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TEAM,
} from '../data/initialData';
import { INITIAL_OFFICIAL_QUERIES } from '../data/initialQueries';
import { GOV_CODES, resolveTitle, tiersFor, scopeName } from '../data/tiers';
import { allDepts, getDept, COUNTRIES, DEPARTMENTS } from '../data/countries';
import { addScoreToProfile } from '../utils/score';
import { makeCode, sanitizePostEmojis } from '../utils/helpers';
import { TRANSLATIONS, Translations } from '../data/translations';
import {
  savePostToCloud,
  updatePostUpvotesInCloud,
  updatePostDownvotesInCloud,
  updatePostResolutionInCloud,
  subscribeToPostsFromCloud,
  saveClaimToCloud,
  saveUserProfileToCloud,
  saveOfficialQueryToCloud,
  saveAuditEntryToCloud,
  updatePostCompilationInCloud,
  deletePostFromCloud,
  savePromotionalAdToCloud,
  deletePromotionalAdFromCloud,
  subscribeToPromotionalAdsFromCloud,
} from '../services/firestoreSync';
import {
  GovFeedbackMessage,
  INITIAL_FEEDBACK_MESSAGES,
  CD_OPS_STAFF_ROSTER,
  CdOpsStaffMember,
} from '../data/partnerships';

interface AppContextType {
  user: UserSession | null;
  setUser: (u: UserSession | null) => void;
  view: ViewType;
  prevView: ViewType;
  go: (v: ViewType) => void;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  profiles: Record<string, UserProfile>;
  setProfiles: React.Dispatch<React.SetStateAction<Record<string, UserProfile>>>;
  audit: AuditEntry[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  projects: Project[];
  invites: Invite[];
  teamMembers: TeamMember[];
  supportsMap: Record<string, Record<string, boolean>>; // userId -> { postId: true }
  downvotesMap: Record<string, Record<string, boolean>>; // userId -> { postId: true }
  nudgeCounts: Record<string, number>; // deptId -> count
  nudgeEntity: (deptId: string) => void;
  
  // Theme
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Language & Translations
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof Translations) => string;

  // Offline Sync State
  isOnline: boolean;
  offlineQueue: Post[];
  syncOfflineQueue: () => void;
  queueOfflinePost: (p: Post) => void;

  // Verification
  verifyTarget: string | null;
  setVerifyTarget: (code: string | null) => void;

  // UI Selection State
  activePost: Post | null;
  setActivePost: (p: Post | null) => void;
  activeDept: string | null;
  setActiveDept: (id: string | null) => void;
  activeDeptCountry: CountryCode | null;
  setActiveDeptCountry: (c: CountryCode | null) => void;
  selectedCountry: CountryCode;
  setSelectedCountry: (c: CountryCode) => void;
  selectedMinistryId: string | null;
  setSelectedMinistryId: (id: string | null) => void;
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  
  // Filters & Tabs
  trafficSignalFilter: 'all' | 'red' | 'amber' | 'green';
  setTrafficSignalFilter: (sig: 'all' | 'red' | 'amber' | 'green') => void;
  feedTab: 'following' | 'trending' | 'near_me';
  setFeedTab: (t: 'following' | 'trending' | 'near_me') => void;
  wallTab: 'posts' | 'announcements' | 'projects';
  setWallTab: (t: 'posts' | 'announcements' | 'projects') => void;
  govTab: 'all' | 'pending' | 'overdue' | 'investigating' | 'corruption' | 'resolved';
  setGovTab: (t: 'all' | 'pending' | 'overdue' | 'investigating' | 'corruption' | 'resolved') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Actions
  ratifyResolution: (postId: string, feedback: string) => void;
  disputeResolution: (postId: string, evidenceText: string, evidenceMedia?: any[]) => void;
  triggerManualEscalation: (postId: string) => void;
  toast: (msg: string, type?: 'emerald' | 'amber' | 'red') => void;
  logAudit: (action: string, ticketId: string, detail: string, country?: CountryCode, dept?: string) => void;
  addPost: (p: Post) => void;
  upvotePost: (postId: string) => void;
  downvotePost: (postId: string) => void;
  addCommentToPost: (postId: string, comment: any) => void;
  rateReply: (postId: string, commentIndex: number, helpful: boolean) => void;
  markPostSatisfied: (postId: string, satisfied: boolean) => void;
  updatePostStatus: (postId: string, status: any) => void;
  addTeamMember: (member: TeamMember) => void;
  standDownTeamMember: (id: string, reason: string, note: string) => void;
  reinstateTeamMember: (id: string) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  replaceTeamMember: (
    oldMemberId: string,
    successor: {
      name: string;
      title?: string;
      email?: string;
      phone?: string;
      reason?: string;
      note?: string;
    }
  ) => { code: string; newMember: TeamMember };
  addInvite: (invite: Invite) => void;
  acceptInvite: (code: string) => TeamMember | null;
  revokeInvite: (code: string) => void;
  addProject: (prj: Project) => void;
  addSubscription: (sub: Subscription) => void;
  addInvoice: (inv: Invoice) => void;
  recordPayment: (invoiceNo: string, amount: number, method: string, ref: string) => void;
  recordInvoicePayment: (invoiceIdOrNo: string, ref: string, method?: string) => void;
  registerNewEntity: (data: {
    name: string;
    reg: string;
    kind: 'utility' | 'consumer';
    country: CountryCode;
    scope: string;
    coveredUnits: number;
    interval: 'annual' | 'monthly';
  }) => { code: string; subId: string; invoiceNo?: string | null };
  execGovLoginByData: (data: GovCodeData) => void;
  ensureCitizenSession: () => UserSession;
  addPoints: (userId: string, pts: number, msg: string) => void;
  updateUserAvatar: (userId: string, avatarUrl: string) => void;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  // Field Manual & User Guidance Modal
  guideModalOpen: boolean;
  guideInitialTab: string;
  openGuide: (tab?: string) => void;
  closeGuide: () => void;
  // Legal, Privacy & About CivicDuty Trust Center Modal
  legalModalOpen: boolean;
  legalInitialTab: 'about' | 'privacy' | 'terms' | 'ethics';
  openLegalCenter: (tab?: 'about' | 'privacy' | 'terms' | 'ethics') => void;
  closeLegalCenter: () => void;
  // Private Provider Layer & Claiming
  claimedEntities: Record<string, ClaimedEntityRecord>;
  claimEntity: (data: Omit<ClaimedEntityRecord, 'claimedAt' | 'verified'>) => void;
  updateClaimedEntityDetails: (deptId: string, updates: Partial<ClaimedEntityRecord>) => void;
  isEntityClaimed: (deptId: string) => boolean;
  getClaimedEntity: (deptId: string) => ClaimedEntityRecord | undefined;
  // CD-Ops & Sovereign Bilateral Feedback Loop
  govFeedbackMessages: GovFeedbackMessage[];
  respondToGovFeedback: (
    id: string,
    response: string,
    responderTitle?: string,
    status?: 'reviewed_by_cd_ops' | 'actioned',
    actionType?: string,
    internalNotes?: string
  ) => void;
  addGovFeedbackMessage: (msg: GovFeedbackMessage) => void;
  updateGovFeedbackPriority: (id: string, priority: 'routine' | 'urgent' | 'statutory_directive') => void;
  endorseModificationForCdOps: (id: string, superadminName: string, notes?: string) => void;
  rejectModificationBySuperadmin: (id: string, superadminName: string, reason: string) => void;
  cdOpsStaffList: CdOpsStaffMember[];
  activeCdOpsOperator: CdOpsStaffMember;
  setActiveCdOpsOperator: (op: CdOpsStaffMember) => void;
  addCdOpsStaff: (staff: CdOpsStaffMember) => void;
  updateCdOpsStaff: (id: string, updates: Partial<CdOpsStaffMember>) => void;
  removeCdOpsStaff: (id: string) => void;
  reassignCdOpsRole: (id: string, newRole: string, dutyStation?: string, handlingRegions?: string[]) => void;
  assignStaffToFeedback: (feedbackId: string, staffName: string) => void;
  customGovCodes: Record<string, GovCodeData>;
  mintGovAccessCode: (code: string, data: GovCodeData) => void;
  revokeGovAccessCode: (code: string) => void;
  directLoginWithGovCode: (code: string) => boolean;
  // Official Supervisory Queries
  officialQueries: OfficialQuery[];
  issueOfficialQuery: (query: {
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
    deadlineHours?: number;
  }) => OfficialQuery;
  respondToOfficialQuery: (
    queryId: string,
    response: {
      officerName: string;
      officerTitle: string;
      justification: string;
      correctiveActionTaken: string;
      attachmentNote?: string;
    }
  ) => void;
  determineOfficialQuery: (
    queryId: string,
    determination: {
      verdict: 'resolved_exonerated' | 'remedial_directive' | 'escalated_igg';
      comments: string;
      disciplinaryPenalty?: string;
    }
  ) => void;
  deleteOfficialQuery: (queryId: string) => void;
  // CD-Ops Manufactured Promotional Ads & Campaigns
  promotionalAds: CdOpsPromotionalAd[];
  addPromotionalAd: (ad: CdOpsPromotionalAd) => void;
  togglePromotionalAdStatus: (id: string) => void;
  deletePromotionalAd: (id: string) => void;
  recordAdClick: (id: string) => void;
  // Multi-Report Issue Clustering & Master Dossier Compilation Engine
  compileWitnessIntoPost: (
    targetPostId: string,
    witnessReport: Omit<CompiledWitnessReport, 'id' | 'created_at'>
  ) => void;
  mergeDuplicatePostsIntoDossier: (masterPostId: string, duplicatePostIds: string[]) => void;
  // Illustrative Demo Showcase Mode ("Boutique Mannequins")
  showDemos: boolean;
  setShowDemos: (show: boolean) => void;
  // Global Social Media Platform Capabilities
  notifications: CivicNotification[];
  notifModalOpen: boolean;
  setNotifModalOpen: (v: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dmModalOpen: boolean;
  setDmModalOpen: (v: boolean) => void;
  dmThreads: CitizenDirectMessage[];
  activeDmThreadId: string | null;
  setActiveDmThreadId: (id: string | null) => void;
  sendDirectMessage: (
    threadId: string,
    body: string,
    attachments?: {
      media?: Array<{ name: string; type: string; size: string; dataUrl?: string }>;
      voice_note?: boolean;
      gps?: { lat: number; lng: number; label?: string };
    }
  ) => void;
  openDmWithCitizen: (name: string, role?: string, country?: CountryCode) => void;
  publicProfileCitizen: { name: string; profession?: string; country?: CountryCode; score?: number } | null;
  setPublicProfileCitizen: (c: { name: string; profession?: string; country?: CountryCode; score?: number } | null) => void;
  followingCitizens: string[];
  toggleFollowCitizen: (name: string) => void;
  socialModalPost: Post | null;
  setSocialModalPost: (p: Post | null) => void;
  socialModalTab: 'share' | 'quote' | 'community_note' | 'safety';
  setSocialModalTab: (t: 'share' | 'quote' | 'community_note' | 'safety') => void;
  createQuoteDispatch: (
    originalPost: Post,
    quoteTitle: string,
    quoteBody: string,
    attachments?: {
      media?: Array<{ name: string; type: string; size: string; dataUrl?: string }>;
      voice_note?: boolean;
      gps?: { lat: number; lng: number };
    }
  ) => void;
  repostDispatch: (postId: string) => void;
  addCommunityNote: (postId: string, body: string, sourceUrl?: string) => void;
  voteCivicPoll: (postId: string, optionId: string) => void;
  bookmarks: string[];
  toggleBookmark: (postId: string) => void;
  mutedAuthors: string[];
  toggleMuteAuthor: (name: string) => void;
  blockedAuthors: string[];
  toggleBlockAuthor: (name: string) => void;
  activeTownHall: TownHallSession | null;
  setActiveTownHall: (th: TownHallSession | null) => void;
  townHalls: TownHallSession[];
  hostBarazaModalOpen: boolean;
  setHostBarazaModalOpen: (open: boolean) => void;
  createTownHall: (params: {
    title: string;
    topic_tag: string;
    dept_name: string;
    co_host_name?: string;
    has_video?: boolean;
    broadcast_mode?: 'video_stage' | 'field_cam' | 'audio_low_data';
  }) => void;
  activeHashtagFilter: string | null;
  setActiveHashtagFilter: (tag: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const DEFAULT_CITIZEN_USER: UserSession = {
  id: 'usr-9028-UG',
  role: 'citizen',
  country: 'UG',
  nodeTag: 'NODE_01',
  followed: ['nwsc', 'umeme', 'kcca', 'unra', 'moh_ug'],
  name: 'Citizen Observer',
};

export const INITIAL_CLAIMED_ENTITIES: Record<string, ClaimedEntityRecord> = {
  nakasero_hosp: {
    deptId: 'nakasero_hosp',
    country: 'UG',
    businessName: 'Nakasero Hospital',
    representativeName: 'Dr. Joseph Ssenkungu',
    officialEmail: 'director@nakaserohospital.com',
    phone: '+256 312 531 400',
    role: 'Medical Director',
    plan: 'pro',
    claimedAt: '2026-08-10',
    verified: true,
    tinOrReg: 'TIN-8920192',
    monthlyFee: 149,
  },
  cafe_javas: {
    deptId: 'cafe_javas',
    country: 'UG',
    businessName: "Café Javas (CJ's)",
    representativeName: 'Sarah Katusiime',
    officialEmail: 'care@cafejavas.co.ug',
    phone: '+256 312 244 444',
    role: 'Customer Experience Lead',
    plan: 'pro',
    claimedAt: '2026-08-18',
    verified: true,
    tinOrReg: 'TIN-4019283',
    monthlyFee: 149,
  },
  mak_univ: {
    deptId: 'mak_univ',
    country: 'UG',
    businessName: 'Makerere University',
    representativeName: 'Prof. Barnabas Nawangwe',
    officialEmail: 'vc@mak.ac.ug',
    phone: '+256 414 542 803',
    role: 'Vice Chancellor / Registrar',
    plan: 'enterprise',
    claimedAt: '2026-07-25',
    verified: true,
    tinOrReg: 'TIN-1002938',
    monthlyFee: 499,
  },
};

export const DEFAULT_CITIZEN_PROFILE: UserProfile = {
  id: 'usr-9028-UG',
  country: 'UG',
  id_frag: '9028',
  display_name: 'Citizen Observer',
  civic_score: 50,
  rank: 'Observer',
  followed: ['ug-unra', 'ug-nwsc', 'ug-umeme', 'ug-kcca'],
  posts: 2,
  resolved: 1,
  corruption_reports: 0,
  upvotes_received: 14,
};

let auditSequence = 0;
const generateUniqueAuditId = (): string => {
  auditSequence += 1;
  return `a-${Date.now()}-${auditSequence}-${Math.random().toString(36).slice(2, 8)}`;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const savedCountry = localStorage.getItem('cd_selected_country') as CountryCode | null;
      const validSavedCountry = savedCountry && COUNTRIES[savedCountry] ? savedCountry : 'UG';
      const saved = localStorage.getItem('cd_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.dept === 'molg' && parsed.organization_name === 'Local Gov (LG) · District') {
            delete parsed.organization_name;
          }
          if (parsed.role === 'citizen' && savedCountry && COUNTRIES[savedCountry] && parsed.country !== savedCountry) {
            return {
              ...parsed,
              country: savedCountry,
              nodeTag: COUNTRIES[savedCountry]?.node || `${savedCountry}_NODE_01`,
            };
          }
          return parsed;
        }
      }
      return {
        ...DEFAULT_CITIZEN_USER,
        id: `usr-9028-${validSavedCountry}`,
        country: validSavedCountry,
        nodeTag: COUNTRIES[validSavedCountry]?.node || DEFAULT_CITIZEN_USER.nodeTag,
        followed: allDepts(validSavedCountry).slice(0, 4).map((d) => d.id),
      };
    } catch {
      return DEFAULT_CITIZEN_USER;
    }
  });

  const [view, setView] = useState<ViewType>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'advertising' || hash === 'branding' || hash === 'transit_preview' || hash === 'livery') return 'transit_preview';
      if (hash === 'feed') return 'feed';
      if (hash === 'docs') return 'docs';
    }
    return 'splash';
  });
  const [prevView, setPrevView] = useState<ViewType>('splash');

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('cd_posts');
      if (saved) {
        let parsed: Post[] = JSON.parse(saved);
        // Hydrate any Master Dossier & Demo Showcase seeds from INITIAL_POSTS
        const seedMap = new Map(INITIAL_POSTS.map((sp) => [sp.id, sp]));
        parsed = parsed.map((p) => {
          const seed = seedMap.get(p.id);
          const base = seed
            ? {
                ...p,
                title: seed.title || p.title,
                body: seed.body || p.body,
                is_demo: true,
                demo_highlight: seed.demo_highlight || p.demo_highlight,
                is_master_dossier: seed.is_master_dossier ?? p.is_master_dossier,
                compiled_count: seed.compiled_count ?? p.compiled_count,
                compiled_reports:
                  seed.compiled_reports && (!p.compiled_reports || p.compiled_reports.length === 0)
                    ? seed.compiled_reports
                    : p.compiled_reports,
                merged_from_ids: seed.merged_from_ids ?? p.merged_from_ids,
              }
            : p;
          return sanitizePostEmojis({
            ...base,
            comments: Array.isArray(base.comments) ? base.comments : seed?.comments || [],
            media: Array.isArray(base.media) ? base.media : seed?.media || [],
            territory: base.territory || seed?.territory || { district: '', subcounty: '', parish: '' },
            poll: base.poll || seed?.poll,
            community_notes: base.community_notes || seed?.community_notes,
            before_after: base.before_after || seed?.before_after,
            voice_note: base.voice_note || seed?.voice_note,
            hashtags: base.hashtags || seed?.hashtags,
            reposts: base.reposts ?? seed?.reposts ?? 0,
          });
        });
        // Merge any new country demos from INITIAL_POSTS that aren't in localStorage yet
        const existingIds = new Set(parsed.map((p) => p.id));
        const missingSeeds = INITIAL_POSTS.filter((sp) => !existingIds.has(sp.id)).map(sanitizePostEmojis);
        if (missingSeeds.length > 0) {
          parsed = [...parsed, ...missingSeeds];
        }
        try {
          localStorage.setItem('cd_posts', JSON.stringify(parsed));
        } catch {}
        return parsed;
      }
      return INITIAL_POSTS.map(sanitizePostEmojis);
    } catch {
      return INITIAL_POSTS.map(sanitizePostEmojis);
    }
  });

  const [showDemos, setShowDemosState] = useState<boolean>(() => {
    const envDefault = (import.meta as any).env?.VITE_SANDBOX_MODE !== 'false';
    try {
      const saved = localStorage.getItem('cd_show_demos_v1');
      return saved !== null ? JSON.parse(saved) : envDefault;
    } catch {
      return envDefault;
    }
  });

  const setShowDemos = (show: boolean) => {
    setShowDemosState(show);
    try {
      localStorage.setItem('cd_show_demos_v1', JSON.stringify(show));
    } catch {}
  };

  const [profiles, setProfiles] = useState<Record<string, UserProfile>>(() => {
    try {
      const saved = localStorage.getItem('cd_profiles');
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [audit, setAudit] = useState<AuditEntry[]>(() => {
    try {
      const saved = localStorage.getItem('cd_audit');
      if (saved) {
        const parsed: AuditEntry[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          const deduplicated: AuditEntry[] = [];
          for (let i = 0; i < parsed.length; i++) {
            const entry = parsed[i];
            let entryId = entry.id;
            if (!entryId || seen.has(entryId)) {
              entryId = generateUniqueAuditId();
            }
            seen.add(entryId);
            deduplicated.push({ ...entry, id: entryId });
          }
          return deduplicated;
        }
      }
      return INITIAL_AUDIT;
    } catch {
      return INITIAL_AUDIT;
    }
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    try {
      const saved = localStorage.getItem('cd_subscriptions');
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
    } catch {
      return INITIAL_SUBSCRIPTIONS;
    }
  });

  const [officialQueries, setOfficialQueries] = useState<OfficialQuery[]>(() => {
    try {
      const saved = localStorage.getItem('cd_official_queries');
      return saved ? JSON.parse(saved) : INITIAL_OFFICIAL_QUERIES;
    } catch {
      return INITIAL_OFFICIAL_QUERIES;
    }
  });

  const [promotionalAds, setPromotionalAds] = useState<CdOpsPromotionalAd[]>(() => {
    try {
      const saved = localStorage.getItem('civicduty_promotional_ads');
      if (saved) {
        const parsed: CdOpsPromotionalAd[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((a) => a.id));
        const missingSeeds = INITIAL_PROMOTIONAL_ADS.filter((a) => !existingIds.has(a.id));
        if (missingSeeds.length > 0) {
          const merged = [...parsed, ...missingSeeds];
          try {
            localStorage.setItem('civicduty_promotional_ads', JSON.stringify(merged));
          } catch {}
          return merged;
        }
        return parsed;
      }
    } catch {}
    return INITIAL_PROMOTIONAL_ADS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('cd_invoices');
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [claimedEntities, setClaimedEntities] = useState<Record<string, ClaimedEntityRecord>>(() => {
    try {
      const saved = localStorage.getItem('cd_claimed_entities');
      return saved ? JSON.parse(saved) : INITIAL_CLAIMED_ENTITIES;
    } catch {
      return INITIAL_CLAIMED_ENTITIES;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('cd_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [invites, setInvites] = useState<Invite[]>(() => {
    try {
      const saved = localStorage.getItem('cd_invites');
      if (saved) {
        const parsed: Invite[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.filter((inv) => {
          if (!inv.code || seen.has(inv.code)) return false;
          seen.add(inv.code);
          return true;
        });
      }
      return INITIAL_INVITES;
    } catch {
      return INITIAL_INVITES;
    }
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('cd_team');
      if (saved) {
        const parsed: TeamMember[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.filter((m) => {
          if (!m.id || seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
      }
      return INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  });

  // CD-Ops & Sovereign Bilateral Feedback State
  const [govFeedbackMessages, setGovFeedbackMessages] = useState<GovFeedbackMessage[]>(() => {
    try {
      const saved = localStorage.getItem('civicduty_feedback_messages');
      if (saved) {
        const parsed: GovFeedbackMessage[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((m) => m.id));
        const missingSeeds = INITIAL_FEEDBACK_MESSAGES.filter((m) => !existingIds.has(m.id));
        if (missingSeeds.length > 0) {
          const merged = [...parsed, ...missingSeeds];
          try {
            localStorage.setItem('civicduty_feedback_messages', JSON.stringify(merged));
          } catch {}
          return merged;
        }
        return parsed;
      }
      return INITIAL_FEEDBACK_MESSAGES;
    } catch {
      return INITIAL_FEEDBACK_MESSAGES;
    }
  });

  const [cdOpsStaffList, setCdOpsStaffList] = useState<CdOpsStaffMember[]>(() => {
    try {
      const saved = localStorage.getItem('cd_cdops_staff');
      return saved ? JSON.parse(saved) : CD_OPS_STAFF_ROSTER;
    } catch {
      return CD_OPS_STAFF_ROSTER;
    }
  });

  const [activeCdOpsOperator, setActiveCdOpsOperator] = useState<CdOpsStaffMember>(() => {
    try {
      const saved = localStorage.getItem('cd_cdops_staff');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0];
      }
    } catch {}
    return CD_OPS_STAFF_ROSTER[0];
  });

  const [customGovCodes, setCustomGovCodes] = useState<Record<string, GovCodeData>>(() => {
    try {
      const saved = localStorage.getItem('cd_custom_gov_codes');
      const parsed = saved ? JSON.parse(saved) : {};
      Object.entries(parsed).forEach(([k, v]) => {
        GOV_CODES[k] = v as GovCodeData;
      });
      return parsed;
    } catch {
      return {};
    }
  });

  const [supportsMap, setSupportsMap] = useState<Record<string, Record<string, boolean>>>(() => {
    try {
      const saved = localStorage.getItem('cd_supports');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [downvotesMap, setDownvotesMap] = useState<Record<string, Record<string, boolean>>>(() => {
    try {
      const saved = localStorage.getItem('cd_downvotes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [nudgeCounts, setNudgeCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('cd_nudge_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>('light');
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('cd_lang') as LanguageCode | null;
      return saved && TRANSLATIONS[saved] ? saved : 'EN';
    } catch {
      return 'EN';
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('cd_lang', lang);
    } catch {}
  };

  const t = (key: keyof Translations): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.EN[key] || '';
  };

  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineQueue, setOfflineQueue] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('cd_offline_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [verifyTarget, setVerifyTarget] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast('Network connected · Auto-syncing pending field reports...', 'emerald');
      syncOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast('Offline mode active · Reports will be stored locally for auto-sync', 'amber');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_offline_queue', JSON.stringify(offlineQueue));
    } catch {}
  }, [offlineQueue]);

  const queueOfflinePost = (post: Post) => {
    setOfflineQueue((prev) => [post, ...prev]);
    toast('Saved to Offline Field Queue · Will sync automatically when network returns', 'amber');
  };

  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    setPosts((prev) => [...offlineQueue, ...prev]);
    const count = offlineQueue.length;
    setOfflineQueue([]);
    try {
      localStorage.removeItem('cd_offline_queue');
    } catch {}
    toast(`Successfully synced ${count} pending report${count > 1 ? 's' : ''} to National Civic Ledger!`, 'emerald');
    logAudit('offline_sync', 'BATCH', `Synced ${count} offline reports to registry`);
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    try {
      localStorage.setItem('cd_theme', t);
    } catch {}
    if (t === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cd_theme') as 'dark' | 'light' | null;
      if (saved) {
        setTheme(saved);
      } else {
        setTheme('light');
      }
    } catch {
      setTheme('light');
    }
  }, []);

  const [activePost, setActivePost] = useState<Post | null>(null);
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeDeptCountry, setActiveDeptCountry] = useState<CountryCode | null>(null);
  const [guideModalOpen, setGuideModalOpen] = useState<boolean>(false);
  const [guideInitialTab, setGuideInitialTab] = useState<string>('quickstart');

  const openGuide = (tab: string = 'quickstart') => {
    setGuideInitialTab(tab);
    setGuideModalOpen(true);
  };

  const closeGuide = () => {
    setGuideModalOpen(false);
  };

  const [legalModalOpen, setLegalModalOpen] = useState<boolean>(false);
  const [legalInitialTab, setLegalInitialTab] = useState<'about' | 'privacy' | 'terms' | 'ethics'>('about');

  const openLegalCenter = (tab: 'about' | 'privacy' | 'terms' | 'ethics' = 'about') => {
    setLegalInitialTab(tab);
    setLegalModalOpen(true);
  };

  const closeLegalCenter = () => {
    setLegalModalOpen(false);
  };
  const [selectedCountry, setSelectedCountryState] = useState<CountryCode>(() => {
    try {
      const saved = localStorage.getItem('cd_selected_country') as CountryCode | null;
      if (saved && COUNTRIES[saved]) return saved;
      return user?.country || 'UG';
    } catch {
      return user?.country || 'UG';
    }
  });

  const setSelectedCountry = (c: CountryCode) => {
    setSelectedCountryState(c);
    setActiveDeptCountry(c);
    const defaultFollowed = allDepts(c).slice(0, 4).map((d) => d.id);
    if (defaultFollowed[0]) {
      setActiveDept(defaultFollowed[0]);
    }
    setUser((prev) => {
      if (!prev) {
        return {
          ...DEFAULT_CITIZEN_USER,
          id: `usr-9028-${c}`,
          country: c,
          nodeTag: COUNTRIES[c]?.node || `${c}_NODE_01`,
          followed: defaultFollowed,
        };
      }
      if (prev.role === 'citizen') {
        return {
          ...prev,
          country: c,
          nodeTag: COUNTRIES[c]?.node || `${c}_NODE_01`,
          followed: prev.country !== c ? defaultFollowed : prev.followed,
        };
      }
      return prev;
    });
    try {
      localStorage.setItem('cd_selected_country', c);
    } catch {}
  };
  const [selectedMinistryId, setSelectedMinistryId] = useState<string | null>('PS-MOFPED');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const [trafficSignalFilter, setTrafficSignalFilter] = useState<'all' | 'red' | 'amber' | 'green'>('all');
  const [feedTab, setFeedTab] = useState<'following' | 'trending' | 'near_me'>('following');
  const [wallTab, setWallTab] = useState<'posts' | 'announcements' | 'projects'>('posts');
  const [govTab, setGovTab] = useState<'all' | 'pending' | 'overdue' | 'investigating' | 'corruption' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('cd_user', JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_posts', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  // Real-time Cloud Firestore subscription for the active territory + Dynamic Country Demo seeding
  useEffect(() => {
    // Ensure any selected country has illustrative demo showcases if none exist yet
    const activeCountry = user?.country || selectedCountry;
    setPosts((prev) => {
      const hasCountryDemos = prev.some((p) => p.country === activeCountry);
      if (!hasCountryDemos) {
        const dynamicDemos = getDynamicCountryDemos(activeCountry);
        if (dynamicDemos.length > 0) {
          return [...prev, ...dynamicDemos];
        }
      }
      return prev;
    });

    const unsubscribe = subscribeToPostsFromCloud(selectedCountry, (cloudPosts) => {
      if (!cloudPosts || cloudPosts.length === 0) return;
      const seedMap = new Map(INITIAL_POSTS.map((sp) => [sp.id, sp]));
      setPosts((prev) => {
        const postMap = new Map<string, Post>();
        // Keep existing memory/local posts
        prev.forEach((p) => postMap.set(p.id, p));
        // Merge cloud posts while preserving demo flags on seed IDs
        cloudPosts.forEach((cp) => {
          if (cp.id) {
            const existing = postMap.get(cp.id);
            const seed = seedMap.get(cp.id);
            postMap.set(cp.id, sanitizePostEmojis({
              ...(existing || {}),
              ...(cp as Post),
              comments: Array.isArray(cp.comments)
                ? cp.comments
                : existing?.comments || seed?.comments || [],
              media: Array.isArray(cp.media)
                ? cp.media
                : existing?.media || seed?.media || [],
              territory:
                cp.territory ||
                existing?.territory ||
                seed?.territory || { district: '', subcounty: '', parish: '' },
              compiled_reports:
                Array.isArray(cp.compiled_reports) && cp.compiled_reports.length > 0
                  ? cp.compiled_reports
                  : existing?.compiled_reports || seed?.compiled_reports || [],
              merged_from_ids:
                Array.isArray(cp.merged_from_ids) && cp.merged_from_ids.length > 0
                  ? cp.merged_from_ids
                  : existing?.merged_from_ids || seed?.merged_from_ids || [],
              is_demo: seed ? true : (cp as Post).is_demo ?? existing?.is_demo ?? false,
              demo_highlight: seed?.demo_highlight || (cp as Post).demo_highlight || existing?.demo_highlight,
            }));
          }
        });
        return Array.from(postMap.values());
      });
    });

    return () => unsubscribe();
  }, [selectedCountry, user?.country]);

  // Real-time Cloud Firestore subscription for CD-Ops Promotional Ads
  useEffect(() => {
    const unsubscribe = subscribeToPromotionalAdsFromCloud((cloudAds) => {
      if (!cloudAds || cloudAds.length === 0) return;
      setPromotionalAds((prev) => {
        const adMap = new Map<string, CdOpsPromotionalAd>();
        prev.forEach((a) => adMap.set(a.id, a));
        cloudAds.forEach((ca) => {
          if (ca.id) {
            adMap.set(ca.id, { ...(adMap.get(ca.id) || {}), ...ca });
          }
        });
        const merged = Array.from(adMap.values());
        try {
          localStorage.setItem('civicduty_promotional_ads', JSON.stringify(merged));
        } catch {}
        return merged;
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cd_profiles', JSON.stringify(profiles));
    } catch {}
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_audit', JSON.stringify(audit));
    } catch {}
  }, [audit]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_official_queries', JSON.stringify(officialQueries));
    } catch {}
  }, [officialQueries]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_subscriptions', JSON.stringify(subscriptions));
    } catch {}
  }, [subscriptions]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_invoices', JSON.stringify(invoices));
    } catch {}
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_projects', JSON.stringify(projects));
    } catch {}
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_invites', JSON.stringify(invites));
    } catch {}
  }, [invites]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_team', JSON.stringify(teamMembers));
    } catch {}
  }, [teamMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_supports', JSON.stringify(supportsMap));
    } catch {}
  }, [supportsMap]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_downvotes', JSON.stringify(downvotesMap));
    } catch {}
  }, [downvotesMap]);

  useEffect(() => {
    try {
      localStorage.setItem('cd_nudge_counts', JSON.stringify(nudgeCounts));
    } catch {}
  }, [nudgeCounts]);

  const toast = (msg: string, type: 'emerald' | 'amber' | 'red' = 'emerald') => {
    const existing = document.getElementById('cd-toast');
    if (existing) existing.remove();

    const t = document.createElement('div');
    t.id = 'cd-toast';
    const bg = type === 'emerald' ? '#10b981' : type === 'amber' ? '#f59e0b' : '#ef4444';
    t.style.cssText = `position:fixed;bottom:74px;left:50%;transform:translateX(-50%);background:${bg};color:#000;padding:8px 18px;border-radius:24px;font-size:10px;font-family:'Courier New',monospace;font-weight:900;z-index:9999;white-space:nowrap;letter-spacing:.06em;animation:fade-in .3s ease;box-shadow:0 4px 20px #00000060`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2800);
  };

  const ensureCitizenSession = (): UserSession => {
    const targetCountry = selectedCountry || user?.country || DEFAULT_CITIZEN_USER.country;
    if (user) {
      if (user.role === 'citizen' && user.country !== targetCountry) {
        return {
          ...user,
          country: targetCountry,
          nodeTag: COUNTRIES[targetCountry]?.node || `${targetCountry}_NODE_01`,
        };
      }
      return user;
    }
    return {
      ...DEFAULT_CITIZEN_USER,
      id: `usr-9028-${targetCountry}`,
      country: targetCountry,
      nodeTag: COUNTRIES[targetCountry]?.node || DEFAULT_CITIZEN_USER.nodeTag,
      followed: allDepts(targetCountry).slice(0, 4).map((d) => d.id),
    };
  };

  const go = (v: ViewType) => {
    if (['feed', 'depts', 'compose', 'profile', 'post_detail', 'dept_wall', 'gov_projects'].includes(v)) {
      if (!user || (user.role === 'citizen' && user.country !== selectedCountry)) {
        setUser(ensureCitizenSession());
      }
    }
    setPrevView(view);
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logAudit = (action: string, ticketId: string, detail: string, country?: CountryCode, dept?: string) => {
    const actCountry = country || user?.country || 'UG';
    const defaultDept = actCountry === 'KE' ? 'kplc' : actCountry === 'RW' ? 'reg' : actCountry === 'GH' ? 'ecg' : actCountry === 'NG' ? 'lasg' : actCountry === 'TZ' ? 'tanesco' : actCountry === 'ZA' ? 'eskom' : 'kcca';
    const id = generateUniqueAuditId();
    const ts = new Date().toISOString();
    
    // Deterministic cryptographic hash stamp for non-repudiation
    let h = 0;
    const str = `${id}:${actCountry}:${ts}:${user?.real_title_short || user?.dept_label || 'System'}:${action}:${ticketId}:CIVICDUTY_SALT_2026`;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    const hex = Math.abs(h).toString(16).padStart(8, '0').toUpperCase();
    const hash = `SHA256-CD-${actCountry}-${hex}`;

    const entry: AuditEntry = {
      id,
      actor_id: user?.id || 'system',
      actor_name: user?.real_title_short || user?.dept_label || 'System',
      actor_role: user?.role || 'system',
      action,
      ticket_id: ticketId,
      detail,
      ts,
      country: actCountry,
      dept: dept || user?.dept || defaultDept,
      hash,
      tamper_seal: 'IMMUTABLE_CHAIN_VERIFIED',
      query_id: ticketId?.startsWith('QRY-') ? ticketId : undefined,
    };
    setAudit((prev) => {
      const filtered = prev.filter((existing) => existing.id !== entry.id);
      return [entry, ...filtered];
    });
    saveAuditEntryToCloud({
      id: entry.id,
      ticketId: entry.ticket_id || 'SYSTEM',
      hash: entry.hash || 'SHA256-CD',
      country: entry.country || 'UG',
      dept: entry.dept || 'civic_desk',
      timestamp: entry.ts,
    }).catch(() => {});
  };

  const issueOfficialQuery = (data: {
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
    deadlineHours?: number;
  }): OfficialQuery => {
    const actCountry = user?.country || 'UG';
    const hrs = data.deadlineHours || 48;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const queryRef = `QRY-${actCountry}-${new Date().getFullYear()}-${randomCode}`;
    const newQuery: OfficialQuery = {
      id: `oq-${Date.now()}-${randomCode}`,
      queryRef,
      country: actCountry,
      dept: user?.dept || 'kcca',
      issuerName: user?.officer_name || user?.name || user?.real_title_short || 'Supervising Accounting Officer',
      issuerTitle: user?.real_title_short || user?.title || 'Accounting Officer',
      issuerRole: user?.role || 'node_admin',
      issuerRank: user?.escalation_rank || 3,
      targetUnit: data.targetUnit,
      targetScope: data.targetScope,
      targetOfficer: data.targetOfficer,
      targetTitle: data.targetTitle,
      category: data.category,
      subject: data.subject,
      grounds: data.grounds,
      evidenceDetails: data.evidenceDetails,
      slaScore: data.slaScore,
      backlogCount: data.backlogCount,
      deadlineHours: hrs,
      deadlineTimestamp: new Date(Date.now() + hrs * 3600 * 1000).toISOString(),
      issuedAt: new Date().toISOString(),
      status: 'pending_response',
    };

    setOfficialQueries((prev) => [newQuery, ...prev]);

    saveOfficialQueryToCloud({
      id: newQuery.id,
      queryRef: newQuery.queryRef,
      country: newQuery.country,
      targetUnit: newQuery.targetUnit,
      targetOfficer: newQuery.targetOfficer,
      targetOfficerTitle: newQuery.targetTitle,
      issuerName: newQuery.issuerName,
      issuerTitle: newQuery.issuerTitle,
      category: newQuery.category,
      subject: newQuery.subject,
      grounds: newQuery.grounds,
      deadlineHours: newQuery.deadlineHours,
      issuedAt: newQuery.issuedAt,
      deadlineAt: newQuery.deadlineTimestamp,
      status: newQuery.status,
    }).catch(() => {});

    logAudit(
      'official_query_issued',
      queryRef,
      `Supervisory administrative query ${queryRef} issued to ${data.targetOfficer} (${data.targetUnit}). Category: ${data.category.replace(/_/g, ' ')}. Deadline: ${hrs}h. Grounds: ${data.grounds.slice(0, 100)}...`,
      actCountry,
      user?.dept
    );

    toast(`Official Query ${queryRef} dispatched to ${data.targetOfficer}. ${hrs}h response window active.`, 'amber');
    return newQuery;
  };

  const respondToOfficialQuery = (
    queryId: string,
    resp: {
      officerName: string;
      officerTitle: string;
      justification: string;
      correctiveActionTaken: string;
      attachmentNote?: string;
    }
  ) => {
    setOfficialQueries((prev) =>
      prev.map((q) => {
        if (q.id === queryId) {
          return {
            ...q,
            status: 'under_review',
            response: {
              ...resp,
              respondedAt: new Date().toISOString(),
            },
          };
        }
        return q;
      })
    );

    const targetQuery = officialQueries.find((q) => q.id === queryId);
    const ref = targetQuery?.queryRef || queryId;

    logAudit(
      'official_query_response_submitted',
      ref,
      `Official response tendered by ${resp.officerName} (${resp.officerTitle}) for query ${ref}. Action taken: ${resp.correctiveActionTaken.slice(0, 90)}...`,
      targetQuery?.country || user?.country || 'UG'
    );

    toast(`Official defense and corrective action submitted for ${ref}. Under supervisory review.`, 'emerald');
  };

  const determineOfficialQuery = (
    queryId: string,
    det: {
      verdict: 'resolved_exonerated' | 'remedial_directive' | 'escalated_igg';
      comments: string;
      disciplinaryPenalty?: string;
    }
  ) => {
    const determinedAt = new Date().toISOString();
    setOfficialQueries((prev) =>
      prev.map((q) => {
        if (q.id === queryId) {
          return {
            ...q,
            status: det.verdict,
            determination: {
              determinedBy: user?.officer_name || user?.name || user?.real_title_short || 'Supervising Accounting Officer',
              determinedByTitle: user?.real_title_short || user?.title || 'Supervising Authority',
              determinedAt,
              verdict: det.verdict,
              comments: det.comments,
              disciplinaryPenalty: det.disciplinaryPenalty,
            },
          };
        }
        return q;
      })
    );

    const targetQuery = officialQueries.find((q) => q.id === queryId);
    const ref = targetQuery?.queryRef || queryId;
    const verdictLabel =
      det.verdict === 'resolved_exonerated'
        ? 'Exonerated / Resolved'
        : det.verdict === 'remedial_directive'
        ? 'Remedial Directive Issued'
        : 'Escalated to Anti-Corruption Body (IGG/SHACU)';

    logAudit(
      'official_query_determined',
      ref,
      `Supervisory determination issued for ${ref}: [${verdictLabel}]. Comments: ${det.comments.slice(0, 100)}...`,
      targetQuery?.country || user?.country || 'UG'
    );

    toast(`Determination logged for ${ref}: ${verdictLabel}`, det.verdict === 'escalated_igg' ? 'red' : 'emerald');
  };

  const deleteOfficialQuery = (queryId: string) => {
    setOfficialQueries((prev) => prev.filter((q) => q.id !== queryId));
    toast('Query record deleted from registry', 'amber');
  };

  const addPoints = (userId: string, pts: number, msg: string) => {
    setProfiles((prev) => {
      const p = prev[userId] || {
        id: userId,
        country: user?.country || 'UG',
        id_frag: '0000',
        display_name: 'Citizen',
        civic_score: 0,
        rank: 'Observer',
        followed: [],
      };
      const updated = addScoreToProfile(p, pts);
      toast(msg);
      return { ...prev, [userId]: updated };
    });
  };

  const addPost = (newPost: Post) => {
    const livePost: Post = { ...newPost, is_demo: false };
    setPosts((prev) => [livePost, ...prev]);

    // Asynchronously synchronize to Cloud Firestore & ledger
    savePostToCloud(livePost).catch((err) => {
      console.warn('Cloud sync deferred (offline or pending):', err);
    });

    if (user && user.role === 'citizen') {
      const isCorrupt = newPost.category === 'corruption';
      setProfiles((prev) => {
        const p = prev[user.id] || {
          id: user.id,
          country: user.country,
          id_frag: '0000',
          display_name: user.name || 'Citizen',
          civic_score: 0,
          rank: 'Observer',
          followed: user.followed || [],
        };
        const updated = {
          ...p,
          posts: (p.posts || 0) + 1,
          corruption_reports: isCorrupt ? (p.corruption_reports || 0) + 1 : p.corruption_reports || 0,
        };
        const scoredProfile = addScoreToProfile(updated, isCorrupt ? 100 : 50);
        saveUserProfileToCloud(scoredProfile).catch(console.error);
        return {
          ...prev,
          [user.id]: scoredProfile,
        };
      });
      toast(isCorrupt ? '+100pts · Corruption Report Filed' : '+50pts · Report Filed');
    }
  };

  const upvotePost = (postId: string) => {
    if (!user || user.role !== 'citizen') {
      toast('Sign in as a citizen to support a report', 'amber');
      return;
    }
    const userId = user.id;
    const isSupported = supportsMap[userId]?.[postId];
    const currentPost = posts.find((p) => p.id === postId);
    const targetUpvotes = currentPost
      ? isSupported
        ? Math.max(0, currentPost.upvotes - 1)
        : currentPost.upvotes + 1
      : 1;

    if (!isSupported && targetUpvotes === 100) {
      toast('100 supporters — pinned to the top of the wall', 'emerald');
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newUpvotes = isSupported ? Math.max(0, p.upvotes - 1) : p.upvotes + 1;
          return { ...p, upvotes: newUpvotes };
        }
        return p;
      })
    );

    // Sync upvote counter to Cloud Firestore
    updatePostUpvotesInCloud(
      postId,
      targetUpvotes,
      currentPost ? { ...currentPost, upvotes: targetUpvotes } : undefined
    ).catch(console.error);

    setSupportsMap((prev) => {
      const userMap = { ...(prev[userId] || {}) };
      if (isSupported) {
        delete userMap[postId];
      } else {
        userMap[postId] = true;
      }
      return { ...prev, [userId]: userMap };
    });

    if (isSupported) {
      addPoints(userId, -5, '−5pts · Support withdrawn');
      toast('Support withdrawn', 'amber');
    } else {
      addPoints(userId, 5, '+5pts · Supported issue');
      toast('Support added', 'emerald');
    }
  };

  const downvotePost = (postId: string) => {
    if (!user || user.role !== 'citizen') {
      toast('Sign in as a citizen to rate community sentiment', 'amber');
      return;
    }
    const userId = user.id;
    const isDownvoted = downvotesMap[userId]?.[postId];
    const isSupported = supportsMap[userId]?.[postId];

    // If currently supporting, withdraw the support first
    if (isSupported) {
      upvotePost(postId);
    }

    const currentPost = posts.find((p) => p.id === postId);
    const currentDown = currentPost?.downvotes || 0;
    const targetDownvotes = isDownvoted ? Math.max(0, currentDown - 1) : currentDown + 1;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const cur = p.downvotes || 0;
          const newDown = isDownvoted ? Math.max(0, cur - 1) : cur + 1;
          return { ...p, downvotes: newDown };
        }
        return p;
      })
    );

    // Sync downvote counter to Cloud Firestore (SLA escalation priority is never affected)
    updatePostDownvotesInCloud(
      postId,
      targetDownvotes,
      currentPost ? { ...currentPost, downvotes: targetDownvotes } : undefined
    ).catch(console.error);

    setDownvotesMap((prev) => {
      const userMap = { ...(prev[userId] || {}) };
      if (isDownvoted) {
        delete userMap[postId];
      } else {
        userMap[postId] = true;
      }
      return { ...prev, [userId]: userMap };
    });

    if (isDownvoted) {
      toast('Community dispute vote removed', 'amber');
    } else {
      toast('Report disputed/unpopular · Statutory escalation remains protected', 'red');
    }
  };

  const addCommentToPost = (postId: string, commentObj: any) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const comments = [...(p.comments || []), commentObj];
          return { ...p, comments };
        }
        return p;
      })
    );
  };

  const rateReply = (postId: string, commentIndex: number, helpful: boolean) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.comments && p.comments[commentIndex]) {
          const comments = [...p.comments];
          const target = { ...comments[commentIndex] };
          if (helpful) target.helpful = (target.helpful || 0) + 1;
          else target.not_helpful = (target.not_helpful || 0) + 1;
          comments[commentIndex] = target;
          return { ...p, comments };
        }
        return p;
      })
    );
    if (user && user.role === 'citizen') {
      addPoints(user.id, 10, '+10pts · Response rated');
    }
  };

  const markPostSatisfied = (postId: string, satisfied: boolean) => {
    const currentPost = posts.find((p) => p.id === postId);
    const nextStatus = satisfied ? 'resolved' : 'pending';
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            citizen_satisfied: satisfied,
            status: nextStatus,
          };
        }
        return p;
      })
    );
    // Sync resolution status to Cloud Firestore
    updatePostResolutionInCloud(
      postId,
      nextStatus,
      satisfied,
      currentPost ? { ...currentPost, status: nextStatus, citizen_satisfied: satisfied } : undefined
    ).catch(console.error);

    if (!satisfied) {
      toast('Marked unsatisfied — issue stays open', 'amber');
    } else {
      toast('Confirmed resolved', 'emerald');
    }
  };

  const ratifyResolution = (postId: string, feedback: string) => {
    const seal = '0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const ratifyComment = {
            id: `ratify-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            sender: user?.name || 'Verified Citizen',
            role: 'citizen' as const,
            body: `[RATIFIED] CITIZEN RATIFICATION SEALED: "${feedback || 'I confirm on-ground that this issue is satisfactorily resolved.'}" · Sovereign Certificate Hash: ${seal.slice(0, 18)}...`,
            created_at: new Date().toISOString(),
            helpful: 3,
            not_helpful: 0,
          };
          return {
            ...p,
            status: 'resolved' as const,
            gov_status: 'resolved' as const,
            citizen_dispute_status: 'confirmed_by_community' as const,
            citizen_satisfied: true,
            crypto_seal_hash: seal,
            comments: [...(p.comments || []), ratifyComment],
          };
        }
        return p;
      })
    );
    if (user && user.role === 'citizen') {
      addPoints(user.id, 25, '+25pts · Civic Ratification Sealed');
    }
    logAudit('citizen_ratification', postId, `Citizen ratified fix. Sealed with hash ${seal.slice(0, 14)}...`);
    toast('Civic Ratification Recorded! +25 Civic XP awarded.', 'emerald');
  };

  const disputeResolution = (postId: string, evidenceText: string, evidenceMedia?: any[]) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const disputeComment = {
            id: `disp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            sender: user?.name || 'Verified Citizen Observer',
            role: 'citizen' as const,
            body: `[DISPUTE] CITIZEN RE-OPEN & DISPUTE: "${evidenceText}" · Counter-evidence submitted. Reverting status to Urgent / Overdue and auto-escalating directly to CAO Desk.`,
            media: evidenceMedia,
            created_at: new Date().toISOString(),
            helpful: 5,
            not_helpful: 0,
          };
          return {
            ...p,
            status: 'overdue' as const,
            gov_status: 'overdue' as const,
            escalated: true,
            escalation_tier: 'tier3_district_cao' as const,
            citizen_dispute_status: 'disputed_with_counter_evidence' as const,
            citizen_satisfied: false,
            dispute_evidence: evidenceText,
            comments: [...(p.comments || []), disputeComment],
          };
        }
        return p;
      })
    );
    logAudit('dispute_reopen', postId, `Citizen disputed resolution. Re-opened and escalated to Tier 3 CAO`);
    toast('Issue re-opened with counter-evidence! Escalated to CAO.', 'amber');
  };

  const triggerManualEscalation = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextTier = p.escalation_tier === 'tier1_parish' 
            ? 'tier2_subcounty' 
            : p.escalation_tier === 'tier2_subcounty' 
            ? 'tier3_district_cao' 
            : 'tier4_ministry';

          const escComment = {
            id: `esc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            sender: 'STATUTORY AUTOMATION ENGINE',
            role: 'gov' as const,
            body: `STATUTORY 48-HOUR SLA BREACH DETECTED: Report has exceeded response window. Promoted jurisdiction responsibility to ${nextTier.toUpperCase()}. Relevant Chief Accounting Officer notified.`,
            created_at: new Date().toISOString(),
            status_tag: 'overdue' as const,
          };

          return {
            ...p,
            escalated: true,
            status: 'overdue' as const,
            gov_status: 'overdue' as const,
            escalation_tier: nextTier,
            comments: [...(p.comments || []), escComment],
          };
        }
        return p;
      })
    );
    logAudit('sla_auto_escalation', postId, `Statutory SLA breached. Promoted to higher administrative tier.`);
    toast('Statutory Escalation Triggered! Promoted to next administrative tier.', 'amber');
  };

  const updatePostStatus = (postId: string, newStatus: any) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, gov_status: newStatus };
        }
        return p;
      })
    );
    logAudit('status_change', postId, `Status changed: → ${newStatus}`);
    toast(`Marked ${newStatus}`, 'amber');
  };

  const addTeamMember = (member: TeamMember) => {
    const m = { ...member, country: member.country || user?.country || 'UG' };
    setTeamMembers((prev) => {
      const filtered = prev.filter((existing) => existing.id !== m.id);
      const updated = [m, ...filtered];
      try {
        localStorage.setItem('cd_team', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const standDownTeamMember = (id: string, reason: string, note: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: false, reason, note } : m))
    );
    const target = teamMembers.find((m) => m.id === id);
    if (target && user) {
      const held = posts.filter((p) => p.dept === user.dept && p.status !== 'resolved').length;
      logAudit('deactivate', '—', `${target.name} (${target.role}) stood down. Reason: ${reason}.${note ? ` Note: ${note}.` : ''}${held ? ` ${held} open tickets held.` : ''}`, user.country, user.dept);
      toast(held ? `Stood down — you now hold ${held} open tickets` : 'Stood down', 'amber');
    }
  };

  const reinstateTeamMember = (id: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: true, reason: null, note: null } : m))
    );
    const target = teamMembers.find((m) => m.id === id);
    if (target) {
      logAudit('reactivate', '—', `${target.name} reinstated`, user?.country, user?.dept);
      toast(`${target.name} reinstated`, 'emerald');
    }
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
      try {
        localStorage.setItem('cd_team', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    const target = teamMembers.find((m) => m.id === id);
    logAudit('team_member_updated', id, `Updated officer record for ${target?.name || id}`);
    toast('Officer record updated successfully', 'emerald');
  };

  const replaceTeamMember = (
    oldMemberId: string,
    successor: {
      name: string;
      title?: string;
      email?: string;
      phone?: string;
      reason?: string;
      note?: string;
    }
  ): { code: string; newMember: TeamMember } => {
    const oldMember = teamMembers.find((m) => m.id === oldMemberId);
    if (!oldMember) throw new Error('Target officer not found');

    const countryCode = oldMember.country || user?.country || 'UG';
    const deptCode = oldMember.dept || user?.dept || 'molg';
    const codePrefix = `${countryCode.toUpperCase()}-${deptCode.replace(/\s+/g, '').toUpperCase().slice(0, 4)}`;
    const newCode = makeCode(codePrefix);

    const handoverReason = successor.reason || 'transferred';
    const handoverNote = `Handed over desk to ${successor.name}. ${successor.note || ''}`.trim();

    // 1. Stand down the previous officer
    standDownTeamMember(oldMemberId, handoverReason, handoverNote);

    // 2. Create the new team member
    const newMember: TeamMember = {
      id: `tm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: successor.name.trim(),
      title: successor.title?.trim() || oldMember.title,
      scope: oldMember.scope,
      email: successor.email?.trim() || `${successor.name.toLowerCase().replace(/\s+/g, '.')}@gov.ug`,
      role: oldMember.role,
      dept: oldMember.dept,
      is_utility: oldMember.is_utility,
      active: true,
      joined: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      country: countryCode,
      contact_phone: successor.phone?.trim(),
      hierarchy_level: oldMember.hierarchy_level,
      escalation_rank: oldMember.escalation_rank,
    };

    addTeamMember(newMember);

    // 3. Mint access code for immediate gateway login
    mintGovAccessCode(newCode, {
      country: newMember.country || 'UG',
      dept: newMember.dept,
      scope: newMember.scope,
      role: newMember.role,
      is_utility: newMember.is_utility,
      role_label: `${newMember.title} (${scopeName(newMember.country, newMember.scope)})`,
      real_title_short: newMember.title,
      officer_name: newMember.name,
      hierarchy_level: newMember.hierarchy_level,
      escalation_rank: newMember.escalation_rank,
    });

    logAudit(
      'officer_handover',
      oldMemberId,
      `Official desk handover: ${oldMember.name} replaced by ${successor.name} (${newMember.title}, ${scopeName(newMember.country, newMember.scope)})`
    );

    toast(`Desk transferred: ${oldMember.name} → ${successor.name}. Access code minted!`, 'emerald');

    return { code: newCode, newMember };
  };

  const addInvite = (invite: Invite) => {
    const inv = { ...invite, country: invite.country || user?.country || 'UG' };
    setInvites((prev) => {
      const filtered = prev.filter((i) => i.code !== inv.code);
      const updated = [...filtered, inv];
      try {
        localStorage.setItem('cd_invites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const acceptInvite = (code: string): TeamMember | null => {
    const cleanCode = code.trim().toUpperCase();
    const inv = invites.find((i) => i.code.toUpperCase() === cleanCode);
    if (!inv) {
      toast(`Invite code ${cleanCode} not found`, 'red');
      return null;
    }

    // Mark invite as used
    const updatedInvites = invites.map((i) =>
      i.code.toUpperCase() === cleanCode ? { ...i, used: true } : i
    );
    setInvites(updatedInvites);
    try {
      localStorage.setItem('cd_invites', JSON.stringify(updatedInvites));
    } catch {}

    // Check if team member already exists
    const existing = teamMembers.find(
      (m) => m.invite_code?.toUpperCase() === cleanCode || (m.scope === inv.scope && m.active && (!m.country || m.country === (inv.country || user?.country || 'UG')))
    );

    let member: TeamMember;
    if (existing) {
      member = { ...existing, active: true, name: inv.name || existing.name, title: inv.title || existing.title };
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === existing.id ? member : m))
      );
    } else {
      member = {
        id: 'tm-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        name: inv.name,
        title: inv.title,
        scope: inv.scope,
        email: inv.contact_phone ? `${inv.contact_phone}@civicduty.org` : `desk.${inv.scope}@civicduty.org`,
        phone: inv.contact_phone,
        contact_phone: inv.contact_phone,
        role: inv.role,
        dept: inv.dept,
        is_utility: inv.is_utility,
        active: true,
        joined: new Date().toISOString().slice(0, 10),
        country: inv.country || user?.country || 'UG',
        duty_station: inv.duty_station,
        invited_by: inv.invited_by || user?.name || 'Supervising Desk Head',
        invite_code: inv.code,
        hierarchy_level: inv.hierarchy_level,
        escalation_rank: inv.escalation_rank,
      };
      setTeamMembers((prev) => [member, ...prev]);
    }

    // Ensure access code is registered in gateway
    mintGovAccessCode(inv.code, {
      country: inv.country || user?.country || 'UG',
      dept: inv.dept,
      scope: inv.scope,
      role: inv.role,
      is_utility: inv.is_utility,
      role_label: `${inv.title} (${inv.duty_station || scopeName(inv.country, inv.scope)})`,
      real_title_short: inv.title,
      officer_name: inv.name,
      hierarchy_level: inv.hierarchy_level,
      escalation_rank: inv.escalation_rank,
    });

    logAudit(
      'invite_accepted',
      cleanCode,
      `Statutory invite accepted: ${inv.name} (${inv.title}) is now ACTIVE on station ${inv.scope}`
    );

    toast(`Invite accepted! ${inv.name} is now ACTIVE on ${scopeName(inv.country, inv.scope)} and enlisted for supervision.`, 'emerald');

    return member;
  };

  const revokeInvite = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const inv = invites.find((i) => i.code.toUpperCase() === cleanCode);
    const updatedInvites = invites.filter((i) => i.code.toUpperCase() !== cleanCode);
    setInvites(updatedInvites);
    try {
      localStorage.setItem('cd_invites', JSON.stringify(updatedInvites));
    } catch {}

    revokeGovAccessCode(cleanCode);

    logAudit(
      'invite_revoked',
      cleanCode,
      `Invite revoked for ${inv?.name || cleanCode} (${inv?.scope || 'station'}). Desk returned to Vacant.`
    );

    toast(`Invite ${cleanCode} revoked. Desk is now VACANT.`, 'amber');
  };

  const addProject = (prj: Project) => {
    const p = { ...prj, country: prj.country || user?.country || 'UG' };
    setProjects((prev) => [p, ...prev]);
  };

  const addSubscription = (sub: Subscription) => {
    const s = { ...sub, country: sub.country || user?.country || 'UG' };
    setSubscriptions((prev) => [...prev, s]);
  };

  const addInvoice = (inv: Invoice) => {
    setInvoices((prev) => [...prev, inv]);
  };

  const recordPayment = (invoiceNo: string, amount: number, method: string, ref: string) => {
    setInvoices((prev) =>
      prev.map((i) => {
        if (i.no === invoiceNo) {
          const payments = [...i.payments, { on: new Date().toISOString().slice(0, 10), method, amount, ref }];
          const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
          const status = totalPaid >= i.amount ? 'paid' : 'part_paid';
          return { ...i, payments, status };
        }
        return i;
      })
    );
    setSubscriptions((prev) =>
      prev.map((s) => {
        const matchingInvoice = invoices.find((inv) => inv.no === invoiceNo);
        if (matchingInvoice && matchingInvoice.sub === s.id) {
          return { ...s, status: 'active' };
        }
        return s;
      })
    );
    logAudit('record_payment', '—', `${invoiceNo}: ${amount.toLocaleString()} received by ${method}, ref ${ref}`);
    toast('Payment recorded', 'emerald');
  };

  const recordInvoicePayment = (invoiceIdOrNo: string, ref: string, method: string = 'momo') => {
    setInvoices((prev) =>
      prev.map((i) => {
        if (i.id === invoiceIdOrNo || i.no === invoiceIdOrNo) {
          const payments = [...(i.payments || []), { on: new Date().toISOString().slice(0, 10), method, amount: i.amount, ref }];
          return { ...i, payments, status: 'paid' as const };
        }
        return i;
      })
    );
    setSubscriptions((prev) =>
      prev.map((s) => {
        const matchingInvoice = invoices.find((inv) => inv.id === invoiceIdOrNo || inv.no === invoiceIdOrNo);
        if (matchingInvoice && matchingInvoice.sub === s.id) {
          return { ...s, status: 'active' as const };
        }
        return s;
      })
    );
    logAudit('record_payment', invoiceIdOrNo, `Payment ref ${ref} recorded for invoice ${invoiceIdOrNo} via ${method}`);
    toast('Payment recorded and subscription activated', 'emerald');
  };

  const execGovLoginByData = (data: GovCodeData) => {
    const d = getDept(data.country, data.dept);
    const titleObj = resolveTitle(data.scope, data.country, data.is_utility);
    const scopeMap: Record<string, string> = {
      UG: 'National — All Uganda',
      KE: 'National — All Kenya',
      GH: 'National — All Ghana',
      RW: 'National — All Rwanda',
      NG: 'National — All Nigeria',
    };
    const session: UserSession = {
      id: 'gov-' + data.dept + '-' + Date.now(),
      role: data.role,
      country: data.country,
      dept: data.dept,
      scope: data.scope,
      is_utility: data.is_utility,
      is_admin:
        data.is_admin ??
        (data.entity_type === 'non_government_entity'
          ? true
          : data.role === 'platform_admin' || data.dept === 'molg'),
      role_label: data.role_label || titleObj.role_label,
      real_title_short: data.real_title_short || data.professional_identity || titleObj.short,
      scope_label: scopeMap[data.scope] || titleObj.scope_label,
      dept_label: data.organization_name || d.name,
      nodeTag: COUNTRIES[data.country]?.node || 'NODE_01',
      entity_type: data.entity_type,
      entity_category: data.entity_category,
      custom_category_specify: data.custom_category_specify,
      organization_name: data.organization_name,
      professional_identity: data.professional_identity,
      business_typology: data.business_typology,
      custom_typology_specify: data.custom_typology_specify,
      custom_title_specify: data.custom_title_specify,
      staff_role: data.staff_role || 'owner_admin',
      seat_limit: data.seat_limit || 5,
      hierarchy_level: data.hierarchy_level,
      escalation_rank: data.escalation_rank,
      officer_name: data.officer_name,
    };
    setUser(session);
    toast(`Desk mounted — ${session.real_title_short || titleObj.short}`, 'emerald');
    go('gov_inbox');
  };

  const registerNewEntity = (data: {
    name: string;
    reg: string;
    kind: 'utility' | 'consumer';
    country: CountryCode;
    scope: string;
    coveredUnits: number;
    interval: 'annual' | 'monthly';
    entity_category?: string;
    custom_category_specify?: string;
    business_typology?: string;
    custom_typology_specify?: string;
    professional_identity?: string;
    custom_title_specify?: string;
    staff_seats?: number;
    officer_name?: string;
  }) => {
    const id = 'ent-' + data.reg.replace(/\W/g, '').slice(-6).toLowerCase();
    const lane = data.kind === 'consumer' ? 'consumer' : 'civic';

    if (!DEPARTMENTS[data.country]) {
      DEPARTMENTS[data.country] = { civic: [], consumer: [] };
    }
    if (!DEPARTMENTS[data.country][lane]) {
      DEPARTMENTS[data.country][lane] = [];
    }
    if (!DEPARTMENTS[data.country][lane].some((d) => d.id === id)) {
      DEPARTMENTS[data.country][lane].push({
        id,
        name: data.name,
        full: data.name,
        icon: 'building-2',
        ministry: data.coveredUnits <= 1 ? 'Registered local entity' : 'Registered entity',
        sla: 48,
        registered: true,
        reg: data.reg,
        category: (data.entity_category as any) || 'commercial_corporate',
      });
    }

    const code = 'ENT-' + data.country + '-' + id.slice(-4).toUpperCase();
    const activeProfTitle = data.custom_title_specify || data.professional_identity || 'Proprietor & Managing Director';
    const activeOrgName = data.name;
    const activeCategory = data.entity_category || 'retail_shops';

    GOV_CODES[code] = {
      country: data.country,
      dept: id,
      scope: data.scope,
      role: 'node_admin',
      is_utility: true,
      is_admin: true,
      role_label: `${activeProfTitle}, ${activeOrgName}`,
      real_title_short: activeProfTitle,
      entity_type: 'non_government_entity',
      entity_category: activeCategory as any,
      custom_category_specify: data.custom_category_specify,
      organization_name: activeOrgName,
      officer_name: data.officer_name || activeProfTitle,
      professional_identity: activeProfTitle,
      business_typology: data.business_typology,
      custom_typology_specify: data.custom_typology_specify,
      custom_title_specify: data.custom_title_specify,
      staff_role: 'owner_admin',
      seat_limit: data.staff_seats || 5,
    };

    setInvites((prev) => [
      ...prev,
      {
        code,
        name: activeOrgName,
        title: activeProfTitle,
        role: 'node_admin',
        scope: data.scope,
        dept: id,
        is_utility: true,
        is_admin: true,
        used: false,
        professional_identity: activeProfTitle,
      },
    ]);

    // Seed the registered owner into team members as the Entity Administrator
    setTeamMembers((prev) => [
      {
        id: 'tm-owner-' + Date.now(),
        name: data.officer_name || `${activeProfTitle} (Owner)`,
        title: activeProfTitle,
        scope: data.scope,
        email: `desk@${id}.civicduty.org`,
        role: 'node_admin',
        dept: id,
        is_utility: true,
        is_admin: true,
        active: true,
        joined: new Date().toISOString().slice(0, 10),
        country: data.country,
        professional_identity: activeProfTitle,
        staff_role: 'owner_admin',
      },
      ...prev,
    ]);

    const subId = 'sub-' + Date.now();
    const subPrice = data.coveredUnits <= 1 ? 0 : data.coveredUnits * 100;
    const subscription: Subscription = {
      id: subId,
      dept: id,
      units: data.coveredUnits,
      band: data.coveredUnits <= 1 ? 'Community · free' : 'Multi-parish',
      interval: data.interval,
      amount: subPrice,
      status: subPrice === 0 ? 'active' : 'trial',
      period_end: new Date(Date.now() + 31536000000).toISOString().slice(0, 10),
    };
    setSubscriptions((prev) => [...prev, subscription]);

    let invoiceNo: string | null = null;
    if (subPrice > 0) {
      invoiceNo = `INV-${data.country}-${String(Date.now()).slice(-6)}`;
      setInvoices((prev) => [
        ...prev,
        {
          no: invoiceNo!,
          sub: subId,
          amount: subPrice,
          interval: data.interval,
          status: 'issued',
          due: new Date(Date.now() + 2592000000).toISOString().slice(0, 10),
          payments: [],
        },
      ]);
    }

    return { code, subId, invoiceNo };
  };

  const updateUserAvatar = (userId: string, avatarUrl: string) => {
    setProfiles((prev) => {
      const existing = prev[userId] || {
        id: userId,
        country: user?.country || 'UG',
        id_frag: '9028',
        display_name: user?.name || 'Citizen',
        civic_score: 50,
        rank: 'Observer',
        followed: ['ug-unra', 'ug-nwsc', 'ug-umeme'],
      };
      const updated = {
        ...existing,
        avatar_url: avatarUrl,
      };
      const newProfiles = { ...prev, [userId]: updated };
      try {
        localStorage.setItem('cd_profiles', JSON.stringify(newProfiles));
      } catch {}
      return newProfiles;
    });

    if (user && user.id === userId) {
      const updatedUser = { ...user, avatar_url: avatarUrl };
      setUser(updatedUser);
      try {
        localStorage.setItem('cd_user', JSON.stringify(updatedUser));
      } catch {}
    }

    // Also update any posts created by this user
    setPosts((prev) => {
      const updated = prev.map((p) => (p.citizen_id === userId ? { ...p, citizen_avatar: avatarUrl } : p));
      try {
        localStorage.setItem('cd_posts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setProfiles((prev) => {
      const existing = prev[userId] || {
        id: userId,
        country: user?.country || 'UG',
        id_frag: '9028',
        display_name: user?.name || 'Citizen',
        civic_score: 50,
        rank: 'Observer',
        followed: ['ug-unra', 'ug-nwsc', 'ug-umeme'],
      };
      const updated = { ...existing, ...updates };
      const newProfiles = { ...prev, [userId]: updated };
      try {
        localStorage.setItem('cd_profiles', JSON.stringify(newProfiles));
      } catch {}
      return newProfiles;
    });

    if (user && user.id === userId) {
      const updatedUser = {
        ...user,
        ...(updates.display_name ? { name: updates.display_name } : {}),
        ...(updates.avatar_url !== undefined ? { avatar_url: updates.avatar_url } : {}),
      };
      setUser(updatedUser);
      try {
        localStorage.setItem('cd_user', JSON.stringify(updatedUser));
      } catch {}
    }
  };

  const claimEntity = (data: Omit<ClaimedEntityRecord, 'claimedAt' | 'verified'>) => {
    const record: ClaimedEntityRecord = {
      ...data,
      claimedAt: new Date().toISOString().slice(0, 10),
      verified: true,
    };

    // Asynchronously synchronize commercial desk claim to Cloud Firestore
    saveClaimToCloud(record).catch(console.error);

    setClaimedEntities((prev) => {
      const updated = { ...prev, [data.deptId]: record };
      try {
        localStorage.setItem('cd_claimed_entities', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Auto-create active subscription and paid invoice for the claimed private provider
    const isAnnual = data.billingInterval === 'annual';
    const subId = 'sub-prov-' + Date.now();
    const subscription: Subscription = {
      id: subId,
      dept: data.deptId,
      units: data.unitsCovered || (data.plan === 'national' ? 501 : data.plan === 'district' ? 150 : data.plan === 'cluster' ? 25 : 1),
      band: `${data.plan.toUpperCase()} · ${data.territoryScope || 'Territory Coverage'} (${isAnnual ? 'Annual' : 'Monthly'})`,
      interval: isAnnual ? 'annual' : 'monthly',
      amount: data.feeUsd ?? data.monthlyFee,
      status: 'active',
      period_end: new Date(Date.now() + (isAnnual ? 365 : 30) * 86400000).toISOString().slice(0, 10),
    };
    setSubscriptions((prev) => [subscription, ...prev]);

    const invoiceNo = `INV-PROV-${String(Date.now()).slice(-6)}`;
    setInvoices((prev) => [
      {
        no: invoiceNo,
        sub: subId,
        amount: data.feeUsd ?? data.monthlyFee,
        interval: isAnnual ? 'annual' : 'monthly',
        status: 'paid',
        due: new Date().toISOString().slice(0, 10),
        payments: [
          {
            on: new Date().toISOString().slice(0, 10),
            method: 'card_or_momo',
            amount: data.feeUsd ?? data.monthlyFee,
            ref: `PAY-REC-${Date.now()}`,
          },
        ],
      },
      ...prev,
    ]);

    // Generate Provider Desk access code
    const provCode = 'PROV-' + data.country + '-' + data.deptId.slice(-4).toUpperCase();
    GOV_CODES[provCode] = {
      country: data.country,
      dept: data.deptId,
      scope: 'national',
      role: 'node_admin',
      is_utility: true,
      is_admin: true,
      role_label: `${data.role}, ${data.businessName}`,
      real_title_short: data.role,
      entity_type: 'non_government_entity',
      organization_name: data.businessName,
      officer_name: data.representativeName,
      professional_identity: data.role,
      staff_role: 'owner_admin',
      seat_limit: data.plan === 'enterprise' ? 15 : 5,
    };

    logAudit(
      'provider_claim_subscribed',
      data.deptId,
      `${data.businessName} claimed & subscribed to ${data.plan.toUpperCase()} ($${data.monthlyFee}/mo) by ${data.representativeName}`
    );
    toast(`${data.businessName} claimed successfully! Verified Provider status active.`, 'emerald');
  };

  const isEntityClaimed = (deptId: string): boolean => {
    if (claimedEntities[deptId]) return true;
    const country = user?.country || 'UG';
    const found = allDepts(country).find((d) => d.id === deptId);
    return !!found?.isClaimed;
  };

  const nudgeEntity = (deptId: string) => {
    setNudgeCounts((prev) => {
      const updated = (prev[deptId] || 0) + 1;
      return { ...prev, [deptId]: updated };
    });
    const d = getDept(user?.country || 'UG', deptId);
    toast(`Public civic nudge logged for ${d.name}! Pressure index updated.`, 'amber');
  };

  const getClaimedEntity = (deptId: string): ClaimedEntityRecord | undefined => {
    return claimedEntities[deptId];
  };

  const updateClaimedEntityDetails = (deptId: string, updates: Partial<ClaimedEntityRecord>) => {
    const country = activeDeptCountry || user?.country || 'UG';
    const baseDept = getDept(country, deptId);
    const existing = claimedEntities[deptId] || {
      deptId,
      country,
      businessName: baseDept.name,
      representativeName: user?.name || 'Authorized Desk Officer',
      officialEmail: user?.email || `desk@${deptId}.org`,
      phone: '+256 700 000 000',
      role: 'Managing Director / Desk Administrator',
      plan: 'district',
      claimedAt: new Date().toISOString().slice(0, 10),
      verified: true,
      monthlyFee: 89,
    };

    const updatedRecord: ClaimedEntityRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Mutate in-memory DEPARTMENTS entry if present so getDept & allDepts reflect updates immediately
    const countryDepts = DEPARTMENTS[country] || [];
    const targetDeptObj = countryDepts.find((item) => item.id === deptId);
    if (targetDeptObj) {
      if (updates.businessName) targetDeptObj.name = updates.businessName;
      if (updates.customDescription) targetDeptObj.full = updates.customDescription;
      if (updates.customLocation) targetDeptObj.location = updates.customLocation;
      if (updates.customIcon) targetDeptObj.icon = updates.customIcon;
    }

    saveClaimToCloud(updatedRecord).catch(console.error);

    setClaimedEntities((prev) => {
      const next = { ...prev, [deptId]: updatedRecord };
      try {
        localStorage.setItem('cd_claimed_entities', JSON.stringify(next));
      } catch {}
      return next;
    });

    logAudit(
      'desk_wall_profile_updated',
      deptId,
      `Wall profile updated for ${updatedRecord.businessName} (Location: ${updatedRecord.customLocation || baseDept.location || 'Updated'})`
    );
    toast(`Desk wall details for "${updatedRecord.businessName}" saved and published!`, 'emerald');
  };

  // CD-Ops Bilateral Feedback Functions
  const respondToGovFeedback = (
    id: string,
    response: string,
    responderTitle: string = 'CivicDuty Platform Operations (CD-Ops)',
    status: 'reviewed_by_cd_ops' | 'actioned' = 'actioned',
    actionType?: string,
    internalNotes?: string
  ) => {
    const updated = govFeedbackMessages.map((m) => {
      if (m.id === id) {
        const receiptHash =
          m.dispatchReceiptHash ||
          '0x' + Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        return {
          ...m,
          status,
          cdOpsResponse: response.trim(),
          respondedBy: responderTitle.trim(),
          respondedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          actionType: actionType || m.actionType || 'Sovereign Action Deployed',
          internalNotes: internalNotes !== undefined ? internalNotes : m.internalNotes,
          dispatchReceiptHash: receiptHash,
        };
      }
      return m;
    });

    setGovFeedbackMessages(updated);
    try {
      localStorage.setItem('civicduty_feedback_messages', JSON.stringify(updated));
    } catch {}

    const targetMsg = govFeedbackMessages.find((m) => m.id === id);
    const officialDesc = targetMsg ? `${targetMsg.senderOfficer} (${targetMsg.countryName})` : id;
    logAudit(
      'cd_ops_official_response_dispatched',
      id,
      `CD-Ops response dispatched to ${officialDesc} [Status: ${status}] by ${responderTitle}`
    );
    toast(
      `Official response dispatched to ${officialDesc} (${status === 'actioned' ? 'Actioned & Certified' : 'Under Technical Review'}).`,
      'emerald'
    );
  };

  const addGovFeedbackMessage = (msg: GovFeedbackMessage) => {
    const updated = [msg, ...govFeedbackMessages];
    setGovFeedbackMessages(updated);
    try {
      localStorage.setItem('civicduty_feedback_messages', JSON.stringify(updated));
    } catch {}
    logAudit(
      'gov_directive_received',
      msg.id,
      `Statutory/Inquiry message received from ${msg.senderOfficer} (${msg.senderMinistry}, ${msg.countryName})`
    );
  };

  const updateGovFeedbackPriority = (id: string, priority: 'routine' | 'urgent' | 'statutory_directive') => {
    const updated = govFeedbackMessages.map((m) => (m.id === id ? { ...m, priority } : m));
    setGovFeedbackMessages(updated);
    try {
      localStorage.setItem('civicduty_feedback_messages', JSON.stringify(updated));
    } catch {}
    toast(`Priority updated for ${id} to ${priority.replace(/_/g, ' ')}.`, 'emerald');
  };

  const endorseModificationForCdOps = (id: string, superadminName: string, notes?: string) => {
    const updated = govFeedbackMessages.map((m) =>
      m.id === id
        ? {
            ...m,
            clearanceStage: 'escalated_to_cd_ops' as const,
            endorsedBySuperadmin: superadminName,
            endorsedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            superadminNotes: notes || 'Endorsed by National Superadmin for CivicDuty Operatives implementation.',
          }
        : m
    );
    setGovFeedbackMessages(updated);
    try {
      localStorage.setItem('civicduty_feedback_messages', JSON.stringify(updated));
    } catch {}
    logAudit(
      'superadmin_endorsed_modification',
      id,
      `National Superadmin (${superadminName}) approved & escalated modification ${id} to CivicDuty CD-Ops`
    );
    toast('Modification approved & escalated to CivicDuty Operatives (CD-Ops)!', 'emerald');
  };

  const rejectModificationBySuperadmin = (id: string, superadminName: string, reason: string) => {
    const updated = govFeedbackMessages.map((m) =>
      m.id === id
        ? {
            ...m,
            clearanceStage: 'rejected_by_superadmin' as const,
            endorsedBySuperadmin: superadminName,
            endorsedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            superadminNotes: reason || 'Returned by National Superadmin — does not align with national statutory template.',
          }
        : m
    );
    setGovFeedbackMessages(updated);
    try {
      localStorage.setItem('civicduty_feedback_messages', JSON.stringify(updated));
    } catch {}
    logAudit(
      'superadmin_rejected_modification',
      id,
      `National Superadmin (${superadminName}) rejected modification ${id}: ${reason}`
    );
    toast('Modification request rejected and returned to accounting officer.', 'amber');
  };

  const addCdOpsStaff = (staff: CdOpsStaffMember) => {
    const updated = [staff, ...cdOpsStaffList];
    setCdOpsStaffList(updated);
    try {
      localStorage.setItem('cd_cdops_staff', JSON.stringify(updated));
    } catch {}
    logAudit(
      'cd_ops_staff_added',
      staff.id,
      `Staff member added: ${staff.name} as ${staff.role} (${staff.dutyStation})`
    );
    toast(`Staff member ${staff.name} added to CD-Ops roster.`, 'emerald');
  };

  const updateCdOpsStaff = (id: string, updates: Partial<CdOpsStaffMember>) => {
    const updated = cdOpsStaffList.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setCdOpsStaffList(updated);
    try {
      localStorage.setItem('cd_cdops_staff', JSON.stringify(updated));
    } catch {}
    if (activeCdOpsOperator.id === id) {
      setActiveCdOpsOperator((prev) => ({ ...prev, ...updates }));
    }
    const target = cdOpsStaffList.find((s) => s.id === id);
    toast(`Staff credentials for ${target?.name || id} updated.`, 'emerald');
  };

  const removeCdOpsStaff = (id: string) => {
    const target = cdOpsStaffList.find((s) => s.id === id);
    const updated = cdOpsStaffList.filter((s) => s.id !== id);
    setCdOpsStaffList(updated);
    try {
      localStorage.setItem('cd_cdops_staff', JSON.stringify(updated));
    } catch {}
    if (activeCdOpsOperator.id === id && updated.length > 0) {
      setActiveCdOpsOperator(updated[0]);
    }
    logAudit('cd_ops_staff_removed', id, `Staff stood down/removed: ${target?.name || id}`);
    toast(`Staff member ${target?.name || id} stood down from active roster.`, 'amber');
  };

  const reassignCdOpsRole = (id: string, newRole: string, dutyStation?: string, handlingRegions?: string[]) => {
    const updated = cdOpsStaffList.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          role: newRole,
          ...(dutyStation ? { dutyStation } : {}),
          ...(handlingRegions ? { handlingRegions } : {}),
        };
      }
      return s;
    });
    setCdOpsStaffList(updated);
    try {
      localStorage.setItem('cd_cdops_staff', JSON.stringify(updated));
    } catch {}
    if (activeCdOpsOperator.id === id) {
      setActiveCdOpsOperator((prev) => ({
        ...prev,
        role: newRole,
        ...(dutyStation ? { dutyStation } : {}),
        ...(handlingRegions ? { handlingRegions } : {}),
      }));
    }
    const target = cdOpsStaffList.find((s) => s.id === id);
    logAudit('cd_ops_role_reassigned', id, `Staff ${target?.name} reassigned to ${newRole}`);
    toast(`${target?.name || id} role reassigned to "${newRole}".`, 'emerald');
  };

  const assignStaffToFeedback = (feedbackId: string, staffName: string) => {
    const updated = govFeedbackMessages.map((m) => (m.id === feedbackId ? { ...m, assignedStaff: staffName } : m));
    setGovFeedbackMessages(updated);
    try {
      localStorage.setItem('civicduty_feedback_messages', JSON.stringify(updated));
    } catch {}
    logAudit('cd_ops_task_dispatched', feedbackId, `Directive ${feedbackId} dispatched to ${staffName}`);
    toast(`Directive ${feedbackId} dispatched to ${staffName}.`, 'emerald');
  };

  const mintGovAccessCode = (code: string, data: GovCodeData) => {
    const cleanCode = code.trim().toUpperCase();
    GOV_CODES[cleanCode] = data;
    const updated = { ...customGovCodes, [cleanCode]: data };
    setCustomGovCodes(updated);
    try {
      localStorage.setItem('cd_custom_gov_codes', JSON.stringify(updated));
    } catch {}
    logAudit(
      'gov_access_code_minted',
      cleanCode,
      `Access code minted: ${cleanCode} for ${data.officer_name || data.role_label} (${data.country})`
    );
    toast(`Sovereign Access Code "${cleanCode}" successfully minted and active on gateway.`, 'emerald');
  };

  const revokeGovAccessCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    delete GOV_CODES[cleanCode];
    const updated = { ...customGovCodes };
    delete updated[cleanCode];
    setCustomGovCodes(updated);
    try {
      localStorage.setItem('cd_custom_gov_codes', JSON.stringify(updated));
    } catch {}
    logAudit('gov_access_code_revoked', cleanCode, `Access code revoked: ${cleanCode}`);
    toast(`Access code ${cleanCode} has been revoked from gateway.`, 'amber');
  };

  const directLoginWithGovCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const data = customGovCodes[cleanCode] || GOV_CODES[cleanCode];
    if (!data) {
      toast(`No credential record found for ${cleanCode}`, 'red');
      return false;
    }
    execGovLoginByData(data);
    if (cleanCode === 'CD-CORP-9999') {
      toast('Company & Tenant Management access granted.', 'amber');
      go('company_management');
      return true;
    }
    if (cleanCode === 'PS-MOLG-2026' || cleanCode === 'PS-MOLG-ROLLOUT') {
      toast(`PS MoLG National Superadmin Desk mounted (${data.officer_name || 'Ben Kumumanya'}).`, 'emerald');
      go('ps_molg_rollout');
      return true;
    }
    if (cleanCode === 'PS-OPM-2026') {
      toast('PS OPM Tier Analytics desk mounted.', 'emerald');
      go('ps_opm_analytics');
      return true;
    }
    toast(`Logged in as ${data.officer_name || data.role_label || cleanCode}`, 'emerald');
    if (data.role === 'platform_admin') {
      go('gov_admin');
    } else {
      go('gov_inbox');
    }
    return true;
  };

  const addPromotionalAd = (ad: CdOpsPromotionalAd) => {
    const updated = [ad, ...promotionalAds];
    setPromotionalAds(updated);
    try {
      localStorage.setItem('civicduty_promotional_ads', JSON.stringify(updated));
    } catch {}
    savePromotionalAdToCloud(ad).catch(() => {});
    logAudit('cd_ops_promotional_ad_published', ad.id, `Promotional Ad manufactured & published: ${ad.title}`);
    toast(`Promotional ad "${ad.title}" manufactured and posted to Civic Feed!`, 'emerald');
  };

  const togglePromotionalAdStatus = (id: string) => {
    const updated = promotionalAds.map((a) => (a.id === id ? { ...a, published: !a.published } : a));
    setPromotionalAds(updated);
    try {
      localStorage.setItem('civicduty_promotional_ads', JSON.stringify(updated));
    } catch {}
    const target = updated.find((a) => a.id === id);
    if (target) {
      savePromotionalAdToCloud(target).catch(() => {});
    }
    toast(target?.published ? `"${target.title}" is now LIVE on Civic Feed.` : `"${target?.title}" paused from Civic Feed.`, 'emerald');
  };

  const deletePromotionalAd = (id: string) => {
    const updated = promotionalAds.filter((a) => a.id !== id);
    setPromotionalAds(updated);
    try {
      localStorage.setItem('civicduty_promotional_ads', JSON.stringify(updated));
    } catch {}
    deletePromotionalAdFromCloud(id).catch(() => {});
    toast('Promotional ad removed from repository.', 'amber');
  };

  const recordAdClick = (id: string) => {
    setPromotionalAds((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, clicks: (a.clicks || 0) + 1 } : a));
      try {
        localStorage.setItem('civicduty_promotional_ads', JSON.stringify(updated));
      } catch {}
      const target = updated.find((a) => a.id === id);
      if (target) {
        savePromotionalAdToCloud(target).catch(() => {});
      }
      return updated;
    });
  };

  const compileWitnessIntoPost = (
    targetPostId: string,
    witnessReport: Omit<CompiledWitnessReport, 'id' | 'created_at'>
  ) => {
    const newWitness: CompiledWitnessReport = {
      ...witnessReport,
      id: `wr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    const targetBefore = posts.find((p) => p.id === targetPostId);
    let autoEscalatedNow = false;
    let updatedTargetPost: Post | null = null;

    if (targetBefore) {
      const existingReports = targetBefore.compiled_reports || [];
      const nextReports = [...existingReports, newWitness];
      const nextCount = Math.max(
        (targetBefore.compiled_count || existingReports.length + 1) + 1,
        nextReports.length + 1
      );
      const nextUpvotes = (targetBefore.upvotes || 0) + 5;
      const shouldEscalate =
        nextCount >= 5 &&
        !targetBefore.escalated &&
        targetBefore.status !== 'resolved' &&
        targetBefore.category !== 'praise';

      if (shouldEscalate) {
        autoEscalatedNow = true;
      }

      updatedTargetPost = {
        ...targetBefore,
        is_master_dossier: true,
        compiled_reports: nextReports,
        compiled_count: nextCount,
        upvotes: nextUpvotes,
        escalated: shouldEscalate ? true : targetBefore.escalated,
        escalation_tier: shouldEscalate ? 'tier3_district_cao' : targetBefore.escalation_tier,
      };
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== targetPostId) return p;
        const existingReports = p.compiled_reports || [];
        const nextReports = [...existingReports, newWitness];
        const nextCount = Math.max((p.compiled_count || existingReports.length + 1) + 1, nextReports.length + 1);
        const nextUpvotes = (p.upvotes || 0) + 5;
        const shouldEscalate = nextCount >= 5 && !p.escalated && p.status !== 'resolved' && p.category !== 'praise';

        const nextPost: Post = {
          ...p,
          is_master_dossier: true,
          compiled_reports: nextReports,
          compiled_count: nextCount,
          upvotes: nextUpvotes,
          escalated: shouldEscalate ? true : p.escalated,
          escalation_tier: shouldEscalate ? 'tier3_district_cao' : p.escalation_tier,
        };
        return nextPost;
      })
    );

    if (updatedTargetPost) {
      const postObj = updatedTargetPost as Post;
      if (activePost?.id === targetPostId) {
        setActivePost(postObj);
      }
      updatePostCompilationInCloud(
        postObj.id,
        postObj.compiled_reports || [],
        postObj.compiled_count || 2,
        postObj.upvotes,
        Boolean(postObj.escalated),
        postObj.merged_from_ids || [],
        postObj
      ).catch(() => {});

      const actorId = user?.id || 'usr-9028-UG';
      addPoints(
        actorId,
        20,
        autoEscalatedNow
          ? `+20 Civic Pts! Dossier reached ${postObj.compiled_count} witnesses & AUTO-ESCALATED to Accounting Officer!`
          : `+20 Civic Pts! Your testimony & evidence compiled into Master Dossier (${postObj.compiled_count} total reports).`
      );

      logAudit(
        autoEscalatedNow ? 'master_dossier_critical_mass_escalation' : 'master_dossier_witness_compiled',
        postObj.id,
        `Witness report compiled into Master Dossier #${postObj.id.slice(-6).toUpperCase()} (${postObj.compiled_count} total reports). ${
          autoEscalatedNow ? '5+ Witness Critical Mass reached — Auto-escalated to Tier 3 Accounting Officer.' : ''
        }`,
        postObj.country,
        postObj.dept
      );
    }
  };

  const mergeDuplicatePostsIntoDossier = (masterPostId: string, duplicatePostIds: string[]) => {
    const cleanDupIds = duplicatePostIds.filter((id) => id !== masterPostId);
    if (cleanDupIds.length === 0) return;

    const dupSet = new Set(cleanDupIds);
    const dupPosts = posts.filter((p) => dupSet.has(p.id));
    if (dupPosts.length === 0) return;

    const masterBefore = posts.find((p) => p.id === masterPostId);
    if (!masterBefore) return;

    const existingReports = [...(masterBefore.compiled_reports || [])];
    let addedUpvotes = 0;

    dupPosts.forEach((dp) => {
      addedUpvotes += (dp.upvotes || 0) + 5;
      existingReports.push({
        id: `wr-merged-${dp.id}`,
        citizen_id: dp.citizen_id,
        citizen_name: dp.anonymous ? 'Verified Citizen' : dp.citizen_name,
        author_profession: dp.author_profession,
        anonymous: dp.anonymous,
        body: `[Merged Ticket #${dp.id.slice(-6).toUpperCase()}: ${dp.title}] — ${dp.body}`,
        gps: dp.gps,
        media: dp.media,
        created_at: dp.created_at,
        source: dp.source,
      });
      if (dp.compiled_reports && dp.compiled_reports.length > 0) {
        existingReports.push(...dp.compiled_reports);
      }
    });

    const nextCount = existingReports.length + 1;
    const nextMergedIds = Array.from(new Set([...(masterBefore.merged_from_ids || []), ...cleanDupIds]));
    const shouldEscalate =
      nextCount >= 5 && !masterBefore.escalated && masterBefore.status !== 'resolved' && masterBefore.category !== 'praise';

    const updatedMaster: Post = {
      ...masterBefore,
      is_master_dossier: true,
      compiled_reports: existingReports,
      compiled_count: nextCount,
      upvotes: (masterBefore.upvotes || 0) + addedUpvotes,
      merged_from_ids: nextMergedIds,
      escalated: shouldEscalate ? true : masterBefore.escalated,
      escalation_tier: shouldEscalate ? 'tier3_district_cao' : masterBefore.escalation_tier,
    };

    setPosts((prev) =>
      prev
        .filter((p) => !dupSet.has(p.id))
        .map((p) => (p.id === masterPostId ? updatedMaster : p))
    );

    if (activePost?.id === masterPostId || dupSet.has(activePost?.id || '')) {
      setActivePost(updatedMaster);
    }

    updatePostCompilationInCloud(
      updatedMaster.id,
      updatedMaster.compiled_reports || [],
      updatedMaster.compiled_count || 2,
      updatedMaster.upvotes,
      Boolean(updatedMaster.escalated),
      updatedMaster.merged_from_ids || [],
      updatedMaster
    ).catch(() => {});

    cleanDupIds.forEach((dupId) => {
      deletePostFromCloud(dupId).catch(() => {});
    });

    logAudit(
      'master_dossier_tickets_merged',
      updatedMaster.id,
      `Consolidated ${cleanDupIds.length} duplicate ticket(s) (${cleanDupIds.join(', ')}) into Master Dossier #${updatedMaster.id.slice(-6).toUpperCase()} (${updatedMaster.compiled_count} total compiled reports).`,
      updatedMaster.country,
      updatedMaster.dept
    );

    toast(
      `Merged ${cleanDupIds.length} duplicate report(s) into Master Dossier #${updatedMaster.id.slice(-6).toUpperCase()} (${updatedMaster.compiled_count} total witnesses)!`,
      'emerald'
    );
  };

  // --- GLOBAL SOCIAL MEDIA PLATFORM CAPABILITIES ---
  const [notifications, setNotifications] = useState<CivicNotification[]>(() => {
    try {
      const saved = localStorage.getItem('cd_social_notifications');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'notif-1',
        type: 'sla_update',
        title: 'Official SLA Action: NWSC Dispatched Repair Crew',
        body: 'NWSC Kampala Branch Manager updated Master Dossier #P-101 (Water Main Burst — Bukoto) to Investigating.',
        post_id: 'p-101',
        actor_name: 'NWSC Kampala Desk',
        country: 'UG',
        created_at: '14m ago',
        read: false,
      },
      {
        id: 'notif-2',
        type: 'upvote',
        title: '5+ Witness Critical Mass Reached!',
        body: 'Ssemakula Ronald (Bukoto Stage Chairman) and 3 other watchdogs co-signed your parish infrastructure dossier.',
        post_id: 'p-101',
        actor_name: 'Bukoto Watchdog Network',
        country: 'UG',
        created_at: '1h ago',
        read: false,
      },
      {
        id: 'notif-3',
        type: 'reply',
        title: 'Treasury Circular Published on Your Petition',
        body: 'Permanent Secretary / Secretary to the Treasury (MoFPED) posted warrant verification on #P-UG-MOFPED-1.',
        post_id: 'p-ug-mofped-1',
        actor_name: 'PS/ST Ministry of Finance',
        country: 'UG',
        created_at: '3h ago',
        read: false,
      },
      {
        id: 'notif-4',
        type: 'perk',
        title: 'CivicScore XP Milestone Unlocked (+50 XP)',
        body: 'Your verified field reports earned 50 XP! Redeemable in the Sovereign Perk Escrow Vault for mobile data & utility tokens.',
        actor_name: 'CivicDuty Perk Escrow Vault',
        country: 'UG',
        created_at: 'Yesterday',
        read: true,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cd_social_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const [notifModalOpen, setNotifModalOpen] = useState(false);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast('All notifications marked as read', 'emerald');
  };

  const [dmModalOpen, setDmModalOpen] = useState(false);
  const [dmThreads, setDmThreads] = useState<CitizenDirectMessage[]>(() => {
    try {
      const saved = localStorage.getItem('cd_social_dm_threads');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'dm-1',
        thread_id: 'th-grace',
        participant_name: 'Grace Akello',
        participant_handle: '@grace_watchdog',
        participant_role: 'Nakawa Parish Watchdog · 980 XP',
        participant_verified: true,
        country: 'UG',
        unread: 1,
        messages: [
          {
            id: 'm-1',
            sender: 'them',
            sender_name: 'Grace Akello',
            body: 'Hello neighbor! Are you also seeing the low water pressure near Bukoto Market today? Let us co-sign Master Dossier #P-101 so it auto-escalates.',
            created_at: '10:15 AM',
          },
        ],
      },
      {
        id: 'dm-2',
        thread_id: 'th-nwsc-care',
        participant_name: 'NWSC Rapid Response Desk',
        participant_handle: '@nwsc_official',
        participant_role: 'Verified Public Utility Customer Care',
        participant_verified: true,
        country: 'UG',
        unread: 0,
        messages: [
          {
            id: 'm-2',
            sender: 'them',
            sender_name: 'NWSC Rapid Response Desk',
            body: 'Thank you for your geotagged report. Our Kawempe standby engineer (Eng. Opio) has isolated the sub-main valve and will restore supply by 14:00hrs.',
            created_at: 'Yesterday',
          },
        ],
      },
      {
        id: 'dm-3',
        thread_id: 'th-boda-scout',
        participant_name: 'Ssemakula Ronald',
        participant_handle: '@ronald_boda_scout',
        participant_role: 'Bodaboda Frontline Road Scout',
        participant_verified: true,
        country: 'UG',
        unread: 0,
        messages: [
          {
            id: 'm-3',
            sender: 'them',
            sender_name: 'Ssemakula Ronald',
            body: 'Just uploaded 2 photos of the open manhole on Kira Road. Watch out if driving through that junction this evening!',
            created_at: '2d ago',
          },
        ],
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cd_social_dm_threads', JSON.stringify(dmThreads));
    } catch {}
  }, [dmThreads]);

  const [activeDmThreadId, setActiveDmThreadId] = useState<string | null>('th-grace');

  const sendDirectMessage = (
    threadId: string,
    body: string,
    attachments?: {
      media?: Array<{ name: string; type: string; size: string; dataUrl?: string }>;
      voice_note?: boolean;
      gps?: { lat: number; lng: number; label?: string };
    }
  ) => {
    setDmThreads((prev) =>
      prev.map((th) => {
        if (th.thread_id !== threadId) return th;
        return {
          ...th,
          unread: 0,
          messages: [
            ...th.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'me',
              sender_name: user?.name || 'Citizen Watchdog',
              body: body || (attachments?.voice_note ? 'Voice Note Dispatch' : 'Media Attachment'),
              created_at: 'Just now',
              media: attachments?.media && attachments.media.length > 0 ? attachments.media : undefined,
              voice_note: attachments?.voice_note || undefined,
              gps: attachments?.gps || undefined,
            },
          ],
        };
      })
    );
    toast('Direct message & media dispatched over encrypted civic channel', 'emerald');
  };

  const openDmWithCitizen = (name: string, role: string = 'Community Watchdog', country?: CountryCode) => {
    const cleanHandle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const existing = dmThreads.find((t) => t.participant_name.toLowerCase() === name.toLowerCase());
    if (existing) {
      setActiveDmThreadId(existing.thread_id);
      setDmModalOpen(true);
      return;
    }
    const newThreadId = `th-${Date.now()}`;
    const newThread: CitizenDirectMessage = {
      id: `dm-${Date.now()}`,
      thread_id: newThreadId,
      participant_name: name,
      participant_handle: cleanHandle,
      participant_role: role,
      participant_verified: true,
      country: country || user?.country || 'UG',
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: 'them',
          sender_name: name,
          body: `Direct civic coordination channel opened with ${name}.`,
          created_at: 'Just now',
        },
      ],
    };
    setDmThreads((prev) => [newThread, ...prev]);
    setActiveDmThreadId(newThreadId);
    setDmModalOpen(true);
  };

  const [publicProfileCitizen, setPublicProfileCitizen] = useState<{
    name: string;
    profession?: string;
    country?: CountryCode;
    score?: number;
  } | null>(null);

  const [followingCitizens, setFollowingCitizens] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cd_following_citizens');
      return saved ? JSON.parse(saved) : ['Grace Nakimbugwe', 'David Musoke', 'CSO Budget Coalition'];
    } catch {
      return ['Grace Nakimbugwe', 'David Musoke', 'CSO Budget Coalition'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cd_following_citizens', JSON.stringify(followingCitizens));
    } catch {}
  }, [followingCitizens]);

  const toggleFollowCitizen = (name: string) => {
    setFollowingCitizens((prev) => {
      const exists = prev.includes(name);
      const next = exists ? prev.filter((n) => n !== name) : [...prev, name];
      toast(exists ? `Unfollowed ${name}` : `Following ${name} — their dispatches prioritized in your feed!`, 'emerald');
      return next;
    });
  };

  const [socialModalPost, setSocialModalPost] = useState<Post | null>(null);
  const [socialModalTab, setSocialModalTab] = useState<'share' | 'quote' | 'community_note' | 'safety'>('share');

  const repostDispatch = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, reposts: (p.reposts || 0) + 1 } : p))
    );
    if (activePost?.id === postId) {
      setActivePost({ ...activePost, reposts: (activePost.reposts || 0) + 1 });
    }
    addPoints(user?.id || 'usr-9028-UG', 10, '+10 Civic Pts · Dispatch Amplified & Reposted!');
  };

  const createQuoteDispatch = (
    originalPost: Post,
    quoteTitle: string,
    quoteBody: string,
    attachments?: {
      media?: Array<{ name: string; type: string; size: string; dataUrl?: string }>;
      voice_note?: boolean;
      gps?: { lat: number; lng: number };
    }
  ) => {
    const origDept = getDept(originalPost.country, originalPost.dept);
    const extractedTags = quoteBody.match(/#[a-zA-Z0-9_]+/g) || [];
    const newQuotePost: Post = {
      id: `p-quote-${Date.now()}`,
      country: originalPost.country,
      dept: originalPost.dept,
      lane: originalPost.lane,
      territory: originalPost.territory,
      citizen_id: user?.id || 'usr-9028-UG',
      citizen_name: user?.name || 'Citizen Watchdog',
      citizen_rank: 'Watchdog',
      anonymous: false,
      category: originalPost.category,
      title: quoteTitle,
      body: quoteBody,
      location: originalPost.location,
      gps: attachments?.gps || originalPost.gps,
      source: 'web',
      media: attachments?.media || [],
      voice_note: attachments?.voice_note || false,
      status: 'pending',
      gov_status: 'pending',
      created_at: new Date().toISOString(),
      comments: [],
      upvotes: 1,
      reposts: 0,
      hashtags: extractedTags.length > 0 ? extractedTags : ['#CivicWatchdog'],
      quote_of: {
        id: originalPost.id,
        title: originalPost.title,
        citizen_name: originalPost.citizen_name,
        dept_name: origDept.name,
        snippet: originalPost.body.slice(0, 160),
      },
      is_demo: false,
    };

    setPosts((prev) => [
      newQuotePost,
      ...prev.map((p) => (p.id === originalPost.id ? { ...p, reposts: (p.reposts || 0) + 1 } : p)),
    ]);
    addPoints(user?.id || 'usr-9028-UG', 25, '+25 Civic Pts · Quote-Dispatch Published to Live Feed!');
    go('feed');
  };

  const addCommunityNote = (postId: string, body: string, sourceUrl?: string) => {
    const newNote = {
      id: `cn-${Date.now()}`,
      author_name: user?.name || 'Verified Watchdog',
      author_rank: 'Watchdog',
      body,
      source_url: sourceUrl || undefined,
      helpful_votes: 1,
      created_at: 'Just now',
      verified_consensus: true,
    };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, community_notes: [...(p.community_notes || []), newNote] }
          : p
      )
    );
    if (activePost?.id === postId) {
      setActivePost({
        ...activePost,
        community_notes: [...(activePost.community_notes || []), newNote],
      });
    }
    addPoints(user?.id || 'usr-9028-UG', 15, '+15 Civic Pts · Verified Community Fact-Check Note Attached!');
  };

  const voteCivicPoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll || p.poll.voted_option_id) return p;
        const updatedOptions = p.poll.options.map((o) =>
          o.id === optionId ? { ...o, votes: o.votes + 1 } : o
        );
        return {
          ...p,
          poll: {
            ...p.poll,
            options: updatedOptions,
            total_votes: p.poll.total_votes + 1,
            voted_option_id: optionId,
          },
        };
      })
    );
    if (activePost?.id === postId && activePost.poll && !activePost.poll.voted_option_id) {
      setActivePost({
        ...activePost,
        poll: {
          ...activePost.poll,
          options: activePost.poll.options.map((o) =>
            o.id === optionId ? { ...o, votes: o.votes + 1 } : o
          ),
          total_votes: activePost.poll.total_votes + 1,
          voted_option_id: optionId,
        },
      });
    }
    addPoints(user?.id || 'usr-9028-UG', 10, '+10 Civic Pts · Vote Recorded in Public Referendum Poll!');
  };

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cd_bookmarks');
      return saved ? JSON.parse(saved) : ['p-ug-praise-1', 'p-ug-mofped-1'];
    } catch {
      return ['p-ug-praise-1', 'p-ug-mofped-1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cd_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  const toggleBookmark = (postId: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(postId);
      const next = exists ? prev.filter((id) => id !== postId) : [postId, ...prev];
      toast(exists ? 'Removed from Saved Bookmarks' : 'Saved to your Watchdog Bookmarks Vault!', 'emerald');
      return next;
    });
  };

  const [mutedAuthors, setMutedAuthors] = useState<string[]>([]);
  const toggleMuteAuthor = (name: string) => {
    setMutedAuthors((prev) => {
      const exists = prev.includes(name);
      const next = exists ? prev.filter((n) => n !== name) : [...prev, name];
      toast(exists ? `Unmuted ${name}` : `Muted dispatches from ${name}`, 'amber');
      return next;
    });
  };

  const [blockedAuthors, setBlockedAuthors] = useState<string[]>([]);
  const toggleBlockAuthor = (name: string) => {
    setBlockedAuthors((prev) => {
      const exists = prev.includes(name);
      const next = exists ? prev.filter((n) => n !== name) : [...prev, name];
      toast(exists ? `Unblocked ${name}` : `Blocked ${name}`, 'red');
      return next;
    });
  };

  const [activeTownHall, setActiveTownHall] = useState<TownHallSession | null>(null);
  const [hostBarazaModalOpen, setHostBarazaModalOpen] = useState<boolean>(false);
  const [customTownHalls, setCustomTownHalls] = useState<TownHallSession[]>([]);
  const [activeHashtagFilter, setActiveHashtagFilter] = useState<string | null>(null);

  const activeCountryCode = user?.country || selectedCountry || 'UG';
  const activeCountryObj = COUNTRIES[activeCountryCode] || COUNTRIES.UG;

  const defaultTownHalls: TownHallSession[] = [
    {
      id: `th-live-1-${activeCountryCode}`,
      title: `${activeCountryObj.name} National Service Delivery & Q3 Budget Accountability Baraza`,
      host_name: 'Permanent Secretary & Municipal Engineering Corps',
      host_title: 'Statutory Accounting Officers',
      dept_name: 'Ministry of Local Government & Public Works',
      country: activeCountryCode,
      listeners_count: 348,
      is_live: true,
      has_video: true,
      broadcast_mode: 'video_stage',
      video_stream_label: 'LIVE 1080p STUDIO & TREASURY SCREEN SHARE',
      topic_tag: '#QuarterlyAccountabilityBaraza',
      speakers: [
        { name: 'Permanent Secretary', role: 'Host · Accounting Officer', speaking: true, video_on: true, camera_label: 'Ministry Studio Cam 1' },
        { name: 'Chief Municipal Engineer', role: 'Co-Host · Roads & Water', speaking: false, video_on: true, camera_label: 'Field Inspection Feed' },
        { name: 'Grace Akello', role: 'Citizen Watchdog Lead', speaking: false, video_on: true, camera_label: 'Parish Watchdog Cam' },
      ],
    },
    {
      id: `th-live-2-${activeCountryCode}`,
      title: `Live Field Inspection: Urban Roads, Drainage & Kayoola Transit Corridor Audit`,
      host_name: 'Eng. Ronald Ssemakula & Works Inspectorate',
      host_title: 'Directorate of Engineering & Works',
      dept_name: 'Public Works & Urban Transit Authority',
      country: activeCountryCode,
      listeners_count: 214,
      is_live: true,
      has_video: true,
      broadcast_mode: 'field_cam',
      video_stream_label: 'ON-SITE FIELD CAMERA · GPS VERIFIED',
      topic_tag: '#LiveRoadAudit',
      speakers: [
        { name: 'Eng. Ronald Ssemakula', role: 'Host · Chief Road Inspector', speaking: true, video_on: true, camera_label: 'Drone & Culvert Cam' },
        { name: 'Boda Stage Chairman', role: 'Co-Host · Commuter Scout', speaking: false, video_on: true, camera_label: 'Stage Mobile Cam' },
        { name: 'District Auditor', role: 'Statutory Fiscal Observer', speaking: false, video_on: false },
      ],
    },
    {
      id: `th-live-3-${activeCountryCode}`,
      title: `Grassroots Parish Water, Power & Health Center III Drug Stock Watchdog Assembly`,
      host_name: 'Parish Development Committee & Utility Desks',
      host_title: 'Grassroots Citizen & Utility Liaison',
      dept_name: 'Water, Electricity & District Health Desk',
      country: activeCountryCode,
      listeners_count: 162,
      is_live: true,
      has_video: false,
      broadcast_mode: 'audio_low_data',
      video_stream_label: '2G/3G LOW-DATA AUDIO + TELEMETRY',
      topic_tag: '#ParishServiceWatch',
      speakers: [
        { name: 'Parish Chief Moderator', role: 'Host · Tier 1 Convenor', speaking: true, video_on: false },
        { name: 'Utility Rapid Response', role: 'Co-Host · Grid Engineer', speaking: false, video_on: false },
        { name: 'Health Center In-Charge', role: 'Medical Stores Liaison', speaking: false, video_on: false },
      ],
    },
  ];

  const townHalls: TownHallSession[] = [
    ...customTownHalls.filter((th) => th.country === activeCountryCode),
    ...defaultTownHalls,
  ];

  const createTownHall = ({
    title,
    topic_tag,
    dept_name,
    co_host_name,
    has_video = true,
    broadcast_mode = 'video_stage',
  }: {
    title: string;
    topic_tag: string;
    dept_name: string;
    co_host_name?: string;
    has_video?: boolean;
    broadcast_mode?: 'video_stage' | 'field_cam' | 'audio_low_data';
  }) => {
    const activeU = user || DEFAULT_CITIZEN_USER;
    const hostName =
      activeU.officer_name ||
      profiles[activeU.id]?.display_name ||
      activeU.name ||
      'Verified Civic Moderator';
    const hostTitle =
      activeU.real_title_short ||
      activeU.role_label ||
      (activeU.role === 'citizen' ? 'Parish Watchdog Convenor' : 'Statutory Accounting Officer');
    const cleanTag = topic_tag.startsWith('#') ? topic_tag : `#${topic_tag.replace(/\s+/g, '') || 'CivicBaraza'}`;

    const newSession: TownHallSession = {
      id: `th-custom-${Date.now()}`,
      title: title.trim(),
      host_name: hostName,
      host_title: hostTitle,
      dept_name: dept_name.trim() || 'Municipal Accountability Desk',
      country: activeCountryCode,
      listeners_count: 18,
      is_live: true,
      has_video,
      broadcast_mode,
      video_stream_label:
        broadcast_mode === 'field_cam'
          ? 'ON-SITE FIELD CAMERA · GPS VERIFIED'
          : broadcast_mode === 'video_stage'
          ? 'LIVE HD MULTI-SPEAKER VIDEO STAGE'
          : '2G/3G LOW-DATA VOICE ROOM',
      topic_tag: cleanTag,
      speakers: [
        { name: hostName, role: `Host · ${hostTitle}`, speaking: true, video_on: has_video, camera_label: 'Host Live Cam' },
        {
          name: co_host_name?.trim() || 'Duty Desk Engineer',
          role: 'Co-Host · Technical Liaison',
          speaking: false,
          video_on: has_video,
          camera_label: 'Desk Liaison Cam',
        },
        { name: 'Community Floor', role: 'Open Citizen Mic & Video', speaking: false, video_on: false },
      ],
    };

    setCustomTownHalls((prev) => [newSession, ...prev]);
    setHostBarazaModalOpen(false);
    setActiveTownHall(newSession);
    logAudit('HOST_BARAZA', newSession.id, `${hostName} launched Live Digital Baraza (${has_video ? 'Video + Audio' : 'Audio'}): "${newSession.title}" (${cleanTag})`);
    toast(`Live Digital Baraza (${has_video ? 'Video + Audio Stage' : 'Audio Stage'}) launched!`, 'emerald');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        view,
        prevView,
        go,
        posts,
        setPosts,
        profiles,
        setProfiles,
        audit,
        subscriptions,
        invoices,
        projects,
        invites,
        teamMembers,
        supportsMap,
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        t,
        isOnline,
        offlineQueue,
        syncOfflineQueue,
        queueOfflinePost,
        verifyTarget,
        setVerifyTarget,
        activePost,
        setActivePost,
        activeDept,
        setActiveDept,
        activeDeptCountry,
        setActiveDeptCountry,
        selectedCountry,
        setSelectedCountry,
        selectedMinistryId,
        setSelectedMinistryId,
        activeProject,
        setActiveProject,
        trafficSignalFilter,
        setTrafficSignalFilter,
        feedTab,
        setFeedTab,
        wallTab,
        setWallTab,
        govTab,
        setGovTab,
        searchQuery,
        setSearchQuery,
        ratifyResolution,
        disputeResolution,
        triggerManualEscalation,
        toast,
        logAudit,
        addPost,
        upvotePost,
        downvotePost,
        downvotesMap,
        nudgeCounts,
        nudgeEntity,
        addCommentToPost,
        rateReply,
        markPostSatisfied,
        updatePostStatus,
        addTeamMember,
        standDownTeamMember,
        reinstateTeamMember,
        updateTeamMember,
        replaceTeamMember,
        addInvite,
        acceptInvite,
        revokeInvite,
        addProject,
        addSubscription,
        addInvoice,
        recordPayment,
        recordInvoicePayment,
        registerNewEntity,
        execGovLoginByData,
        ensureCitizenSession,
        addPoints,
        updateUserAvatar,
        updateUserProfile,
        guideModalOpen,
        guideInitialTab,
        openGuide,
        closeGuide,
        legalModalOpen,
        legalInitialTab,
        openLegalCenter,
        closeLegalCenter,
        claimedEntities,
        claimEntity,
        updateClaimedEntityDetails,
        isEntityClaimed,
        getClaimedEntity,
        govFeedbackMessages,
        respondToGovFeedback,
        addGovFeedbackMessage,
        updateGovFeedbackPriority,
        endorseModificationForCdOps,
        rejectModificationBySuperadmin,
        cdOpsStaffList,
        activeCdOpsOperator,
        setActiveCdOpsOperator,
        addCdOpsStaff,
        updateCdOpsStaff,
        removeCdOpsStaff,
        reassignCdOpsRole,
        assignStaffToFeedback,
        customGovCodes,
        mintGovAccessCode,
        revokeGovAccessCode,
        directLoginWithGovCode,
        officialQueries,
        issueOfficialQuery,
        respondToOfficialQuery,
        determineOfficialQuery,
        deleteOfficialQuery,
        promotionalAds,
        addPromotionalAd,
        togglePromotionalAdStatus,
        deletePromotionalAd,
        recordAdClick,
        compileWitnessIntoPost,
        mergeDuplicatePostsIntoDossier,
        showDemos,
        setShowDemos,
        notifications,
        notifModalOpen,
        setNotifModalOpen,
        markNotificationRead,
        markAllNotificationsRead,
        dmModalOpen,
        setDmModalOpen,
        dmThreads,
        activeDmThreadId,
        setActiveDmThreadId,
        sendDirectMessage,
        openDmWithCitizen,
        publicProfileCitizen,
        setPublicProfileCitizen,
        followingCitizens,
        toggleFollowCitizen,
        socialModalPost,
        setSocialModalPost,
        socialModalTab,
        setSocialModalTab,
        createQuoteDispatch,
        repostDispatch,
        addCommunityNote,
        voteCivicPoll,
        bookmarks,
        toggleBookmark,
        mutedAuthors,
        toggleMuteAuthor,
        blockedAuthors,
        toggleBlockAuthor,
        activeTownHall,
        setActiveTownHall,
        townHalls,
        hostBarazaModalOpen,
        setHostBarazaModalOpen,
        createTownHall,
        activeHashtagFilter,
        setActiveHashtagFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
