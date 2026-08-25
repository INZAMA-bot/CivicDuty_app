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
} from '../types';
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
import { GOV_CODES, resolveTitle, tiersFor } from '../data/tiers';
import { allDepts, getDept, COUNTRIES, DEPARTMENTS } from '../data/countries';
import { addScoreToProfile } from '../utils/score';
import { TRANSLATIONS, Translations } from '../data/translations';

interface AppContextType {
  user: UserSession | null;
  setUser: (u: UserSession | null) => void;
  view: ViewType;
  prevView: ViewType;
  go: (v: ViewType) => void;
  posts: Post[];
  profiles: Record<string, UserProfile>;
  setProfiles: React.Dispatch<React.SetStateAction<Record<string, UserProfile>>>;
  audit: AuditEntry[];
  subscriptions: Subscription[];
  invoices: Invoice[];
  projects: Project[];
  invites: Invite[];
  teamMembers: TeamMember[];
  supportsMap: Record<string, Record<string, boolean>>; // userId -> { postId: true }
  
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
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  
  // Filters & Tabs
  feedTab: 'following' | 'trending' | 'near_me';
  setFeedTab: (t: 'following' | 'trending' | 'near_me') => void;
  wallTab: 'posts' | 'announcements' | 'projects';
  setWallTab: (t: 'posts' | 'announcements' | 'projects') => void;
  govTab: 'all' | 'pending' | 'overdue' | 'investigating' | 'corruption' | 'resolved';
  setGovTab: (t: 'all' | 'pending' | 'overdue' | 'investigating' | 'corruption' | 'resolved') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Actions
  toast: (msg: string, type?: 'emerald' | 'amber' | 'red') => void;
  logAudit: (action: string, ticketId: string, detail: string, country?: CountryCode, dept?: string) => void;
  addPost: (p: Post) => void;
  upvotePost: (postId: string) => void;
  addCommentToPost: (postId: string, comment: any) => void;
  rateReply: (postId: string, commentIndex: number, helpful: boolean) => void;
  markPostSatisfied: (postId: string, satisfied: boolean) => void;
  updatePostStatus: (postId: string, status: any) => void;
  addTeamMember: (member: TeamMember) => void;
  standDownTeamMember: (id: string, reason: string, note: string) => void;
  reinstateTeamMember: (id: string) => void;
  addInvite: (invite: Invite) => void;
  addProject: (prj: Project) => void;
  addSubscription: (sub: Subscription) => void;
  addInvoice: (inv: Invoice) => void;
  recordPayment: (invoiceNo: string, amount: number, method: string, ref: string) => void;
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
}

const AppContext = createContext<AppContextType | null>(null);

export const DEFAULT_CITIZEN_USER: UserSession = {
  id: 'usr-9028-UG',
  role: 'citizen',
  country: 'UG',
  nodeTag: 'NODE_01',
  followed: ['ug-unra', 'ug-nwsc', 'ug-umeme', 'ug-kcca'],
  name: 'Citizen Observer',
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('cd_user');
      return saved ? JSON.parse(saved) : DEFAULT_CITIZEN_USER;
    } catch {
      return DEFAULT_CITIZEN_USER;
    }
  });

  const [view, setView] = useState<ViewType>('splash');
  const [prevView, setPrevView] = useState<ViewType>('splash');

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('cd_posts');
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

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
      return saved ? JSON.parse(saved) : INITIAL_AUDIT;
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

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('cd_invoices');
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
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
      return saved ? JSON.parse(saved) : INITIAL_INVITES;
    } catch {
      return INITIAL_INVITES;
    }
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem('cd_team');
      return saved ? JSON.parse(saved) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
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

  const [theme, setThemeState] = useState<'dark' | 'light'>('light');
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('cd_lang') as LanguageCode | null;
      return saved && ['EN', 'LG', 'SW', 'RW'].includes(saved) ? saved : 'EN';
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
    toast(`✓ Successfully synced ${count} pending report${count > 1 ? 's' : ''} to National Civic Ledger!`, 'emerald');
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
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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
    if (user) return user;
    return DEFAULT_CITIZEN_USER;
  };

  const go = (v: ViewType) => {
    if (['feed', 'depts', 'compose', 'profile', 'post_detail', 'dept_wall', 'gov_projects'].includes(v)) {
      if (!user) {
        ensureCitizenSession();
      }
    }
    setPrevView(view);
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logAudit = (action: string, ticketId: string, detail: string, country?: CountryCode, dept?: string) => {
    const actCountry = country || user?.country || 'UG';
    const defaultDept = actCountry === 'KE' ? 'kplc' : actCountry === 'RW' ? 'reg' : actCountry === 'GH' ? 'ecg' : actCountry === 'NG' ? 'lasg' : actCountry === 'TZ' ? 'tanesco' : actCountry === 'ZA' ? 'eskom' : 'kcca';
    const entry: AuditEntry = {
      id: 'a-' + Date.now(),
      actor_id: user?.id || 'system',
      actor_name: user?.real_title_short || user?.dept_label || 'System',
      actor_role: user?.role || 'system',
      action,
      ticket_id: ticketId,
      detail,
      ts: new Date().toISOString(),
      country: actCountry,
      dept: dept || user?.dept || defaultDept,
    };
    setAudit((prev) => [entry, ...prev]);
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
    setPosts((prev) => [newPost, ...prev]);
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
        return {
          ...prev,
          [user.id]: addScoreToProfile(updated, isCorrupt ? 100 : 50),
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

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newUpvotes = isSupported ? Math.max(0, p.upvotes - 1) : p.upvotes + 1;
          if (!isSupported && newUpvotes === 100) {
            toast('100 supporters — pinned to the top of the wall', 'emerald');
          }
          return { ...p, upvotes: newUpvotes };
        }
        return p;
      })
    );

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
        if (p.id === postId && p.comments[commentIndex]) {
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
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            citizen_satisfied: satisfied,
            status: satisfied ? 'resolved' : 'pending',
          };
        }
        return p;
      })
    );
    if (!satisfied) {
      toast('Marked unsatisfied — issue stays open', 'amber');
    } else {
      toast('✓ Confirmed resolved', 'emerald');
    }
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
    setTeamMembers((prev) => [m, ...prev]);
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

  const addInvite = (invite: Invite) => {
    const inv = { ...invite, country: invite.country || user?.country || 'UG' };
    setInvites((prev) => [...prev, inv]);
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
      role_label: titleObj.role_label,
      real_title_short: titleObj.short,
      scope_label: scopeMap[data.scope] || titleObj.scope_label,
      dept_label: d.name,
      nodeTag: COUNTRIES[data.country]?.node || 'NODE_01',
    };
    setUser(session);
    toast(`Desk mounted — ${titleObj.short}`, 'emerald');
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
        icon: '🏢',
        ministry: data.coveredUnits <= 1 ? 'Registered local entity' : 'Registered entity',
        sla: 48,
        registered: true,
        reg: data.reg,
      });
    }

    const code = 'ENT-' + data.country + '-' + id.slice(-4).toUpperCase();
    GOV_CODES[code] = {
      country: data.country,
      dept: id,
      scope: data.scope,
      role: 'spokesperson',
      is_utility: true,
    };

    setInvites((prev) => [
      ...prev,
      {
        code,
        name: data.name,
        title: 'Entity desk',
        role: 'spokesperson',
        scope: data.scope,
        dept: id,
        is_utility: true,
        used: false,
      },
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

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        view,
        prevView,
        go,
        posts,
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
        activeProject,
        setActiveProject,
        feedTab,
        setFeedTab,
        wallTab,
        setWallTab,
        govTab,
        setGovTab,
        searchQuery,
        setSearchQuery,
        toast,
        logAudit,
        addPost,
        upvotePost,
        addCommentToPost,
        rateReply,
        markPostSatisfied,
        updatePostStatus,
        addTeamMember,
        standDownTeamMember,
        reinstateTeamMember,
        addInvite,
        addProject,
        addSubscription,
        addInvoice,
        recordPayment,
        registerNewEntity,
        execGovLoginByData,
        ensureCitizenSession,
        addPoints,
        updateUserAvatar,
        updateUserProfile,
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
