import { collection, doc, increment, onSnapshot, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  CountryAnalyticsMetrics,
  CountryCode,
  CountryLaunchStatus,
  TesterFeedbackCategory,
  TesterFeedbackItem,
} from '../types';
import { COUNTRIES } from '../data/countries';

export interface VisitorInteractionEvent {
  id: string;
  docType?: 'visitor_event';
  countryCode: CountryCode;
  eventType:
    | 'page_view'
    | 'cta_click'
    | 'access_code_attempt'
    | 'docs_view'
    | 'pitch_view'
    | 'ussd_launch'
    | 'legal_charter_view'
    | 'country_enter'
    | 'country_switch'
    | 'onboarding_complete'
    | 'test_post_created'
    | 'feedback_open'
    | 'feedback_submit'
    | 'crowdfund_view'
    | 'crowdfund_copy'
    | 'partner_click';
  label: string;
  target?: string;
  referrer: string;
  device: 'mobile' | 'desktop' | 'tablet';
  path: string;
  timestamp: string;
  meta?: Record<string, any>;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  citizenPortalClicks: number;
  govDeskClicks: number;
  providerDeskClicks: number;
  docsViews: number;
  pitchDeckViews: number;
  ussdSimulatorClicks: number;
  accessAttempts: number;
  accessSuccesses: number;
  deviceMobile: number;
  deviceDesktop: number;
  referrers: Record<string, number>;
  countryMetrics: Record<string, CountryAnalyticsMetrics>;
  recentEvents: VisitorInteractionEvent[];
}

const LOCAL_STORAGE_KEY = 'civicduty_visitor_analytics_v2';
const FEEDBACK_STORAGE_KEY = 'civicduty_tester_feedback_v1';
const VISITOR_SESSION_ID_KEY = 'civicduty_session_id';
const VISITOR_COUNTRIES_KEY = 'civicduty_visited_countries_session';

function getActiveCountryFallback(): CountryCode {
  try {
    const saved = localStorage.getItem('cd_selected_country') as CountryCode | null;
    if (saved && COUNTRIES[saved]) return saved;
  } catch {}
  return 'UG';
}

function getOrSetSessionId(countryCode: CountryCode): {
  sessionId: string;
  isNewSession: boolean;
  isNewCountryForSession: boolean;
} {
  try {
    let sid = sessionStorage.getItem(VISITOR_SESSION_ID_KEY);
    let isNewSession = false;
    if (!sid) {
      sid = 'ses_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      sessionStorage.setItem(VISITOR_SESSION_ID_KEY, sid);
      isNewSession = true;
    }

    const rawCountries = sessionStorage.getItem(VISITOR_COUNTRIES_KEY);
    const visitedCountries: string[] = rawCountries ? JSON.parse(rawCountries) : [];
    const isNewCountryForSession = !visitedCountries.includes(countryCode);
    if (isNewCountryForSession) {
      sessionStorage.setItem(VISITOR_COUNTRIES_KEY, JSON.stringify([...visitedCountries, countryCode]));
    }
    return { sessionId: sid, isNewSession, isNewCountryForSession };
  } catch {
    return { sessionId: 'ses_anon_' + Date.now(), isNewSession: false, isNewCountryForSession: false };
  }
}

function detectDevice(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  if (/ipad|tablet/i.test(ua) || (width >= 768 && width <= 1024)) return 'tablet';
  if (/mobile|android|iphone|ipod/i.test(ua) || width < 768) return 'mobile';
  return 'desktop';
}

const CAMPAIGN_SESSION_KEY = 'civicduty_utm_attribution_v1';

export interface CampaignAttribution {
  sourceLabel: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
}

export function getSessionCampaignAttribution(): CampaignAttribution | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source')?.trim().toLowerCase() || '';
    const utmMedium = params.get('utm_medium')?.trim().toLowerCase() || '';
    const utmCampaign = params.get('utm_campaign')?.trim() || '';
    const gclid = params.get('gclid')?.trim() || '';

    if (utmSource || gclid) {
      let sourceLabel = 'Campaign Link';
      if (utmSource.includes('google') || gclid) {
        if (utmMedium.includes('discover') || utmMedium.includes('demand')) {
          sourceLabel = 'Google Ads (Discover)';
        } else if (utmMedium.includes('display')) {
          sourceLabel = 'Google Ads (Display)';
        } else {
          sourceLabel = 'Google Ads (Search)';
        }
      } else if (utmSource.includes('x') || utmSource.includes('twitter')) {
        sourceLabel = 'X (Twitter)';
      } else if (utmSource.includes('linkedin')) {
        sourceLabel = 'LinkedIn';
      } else if (utmSource.includes('whatsapp')) {
        sourceLabel = 'WhatsApp';
      } else if (utmSource.includes('telegram')) {
        sourceLabel = 'Telegram';
      } else if (utmSource.includes('meta') || utmSource.includes('facebook') || utmSource.includes('ig')) {
        sourceLabel = 'Meta / Facebook';
      } else {
        sourceLabel = `UTM: ${utmSource}`;
      }
      const attr: CampaignAttribution = {
        sourceLabel,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        gclid: gclid || undefined,
      };
      sessionStorage.setItem(CAMPAIGN_SESSION_KEY, JSON.stringify(attr));
      return attr;
    }

    const stored = sessionStorage.getItem(CAMPAIGN_SESSION_KEY);
    return stored ? (JSON.parse(stored) as CampaignAttribution) : null;
  } catch {
    return null;
  }
}

function cleanReferrer(): string {
  const utm = getSessionCampaignAttribution();
  if (utm?.sourceLabel) return utm.sourceLabel;

  if (typeof document === 'undefined' || !document.referrer) return 'Direct / Social Link';
  try {
    const url = new URL(document.referrer);
    const host = url.hostname.toLowerCase();
    if (host.includes('t.co') || host.includes('twitter') || host.includes('x.com')) return 'X (Twitter)';
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('facebook') || host.includes('fb.me')) return 'Facebook';
    if (host.includes('googleadservices') || host.includes('doubleclick')) return 'Google Ads';
    if (host.includes('google')) return 'Google Search / Discover';
    if (host.includes('whatsapp')) return 'WhatsApp';
    return host;
  } catch {
    return 'Referral';
  }
}

function createEmptyCountryMetric(countryCode: CountryCode, now: string): CountryAnalyticsMetrics {
  return {
    countryCode,
    entries: 0,
    uniqueVisitors: 0,
    portalClicks: 0,
    govClicks: 0,
    providerClicks: 0,
    onboardingCompletes: 0,
    testPostsCreated: 0,
    ussdLaunches: 0,
    crowdfundClicks: 0,
    partnerClicks: 0,
    feedbackCount: 0,
    lastActiveAt: now,
  };
}

const initialSummary: AnalyticsSummary = {
  totalPageViews: 0,
  uniqueVisitors: 0,
  citizenPortalClicks: 0,
  govDeskClicks: 0,
  providerDeskClicks: 0,
  docsViews: 0,
  pitchDeckViews: 0,
  ussdSimulatorClicks: 0,
  accessAttempts: 0,
  accessSuccesses: 0,
  deviceMobile: 0,
  deviceDesktop: 0,
  referrers: {},
  countryMetrics: {},
  recentEvents: [],
};

export function loadLocalAnalytics(): AnalyticsSummary {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('civicduty_visitor_analytics_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialSummary,
        ...parsed,
        referrers: parsed.referrers || {},
        countryMetrics: parsed.countryMetrics || {},
        recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [],
      };
    }
  } catch {}
  return { ...initialSummary, referrers: {}, countryMetrics: {}, recentEvents: [] };
}

function saveLocalAnalytics(summary: AnalyticsSummary) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(summary));
  } catch {}
}

export function loadLocalTesterFeedback(): TesterFeedbackItem[] {
  try {
    const saved = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveLocalTesterFeedback(items: TesterFeedbackItem[]) {
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(items.slice(0, 200)));
  } catch {}
}

const listeners: Array<(summary: AnalyticsSummary) => void> = [];

export function subscribeAnalytics(callback: (summary: AnalyticsSummary) => void) {
  listeners.push(callback);
  callback(loadLocalAnalytics());
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

function notifyListeners(summary: AnalyticsSummary) {
  listeners.forEach((cb) => cb(summary));
}

export async function trackVisitorInteraction(
  eventType: VisitorInteractionEvent['eventType'],
  label: string,
  target?: string,
  meta?: Record<string, any>
): Promise<void> {
  const device = detectDevice();
  const utmAttribution = getSessionCampaignAttribution();
  const referrer = cleanReferrer();
  const countryCode = ((meta?.countryCode as CountryCode) || getActiveCountryFallback()) as CountryCode;
  const { isNewSession, isNewCountryForSession } = getOrSetSessionId(countryCode);
  const now = new Date().toISOString();

  const mergedMeta = utmAttribution?.utmCampaign
    ? { ...(meta || {}), utmCampaign: utmAttribution.utmCampaign, utmMedium: utmAttribution.utmMedium }
    : meta;

  const eventItem: VisitorInteractionEvent = {
    id: 'evt_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now(),
    docType: 'visitor_event',
    countryCode,
    eventType,
    label,
    target,
    referrer,
    device,
    path: typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/',
    timestamp: now,
    meta: mergedMeta,
  };

  // 1. Update Local Analytics
  const summary = loadLocalAnalytics();
  summary.totalPageViews += eventType === 'page_view' ? 1 : 0;
  if (isNewSession && eventType === 'page_view') {
    summary.uniqueVisitors += 1;
  }
  if (device === 'mobile') summary.deviceMobile += 1;
  else summary.deviceDesktop += 1;

  if (eventType === 'cta_click') {
    if (target === 'citizen_portal' || label.toLowerCase().includes('citizen')) {
      summary.citizenPortalClicks += 1;
    } else if (target === 'gov_desk' || label.toLowerCase().includes('gov')) {
      summary.govDeskClicks += 1;
    } else if (target === 'provider_desk' || label.toLowerCase().includes('provider')) {
      summary.providerDeskClicks += 1;
    }
  } else if (eventType === 'docs_view') {
    summary.docsViews += 1;
  } else if (eventType === 'pitch_view') {
    summary.pitchDeckViews += 1;
  } else if (eventType === 'ussd_launch') {
    summary.ussdSimulatorClicks += 1;
  } else if (eventType === 'access_code_attempt') {
    summary.accessAttempts += 1;
    if (meta?.success) {
      summary.accessSuccesses += 1;
    }
  }

  // Per-Country Usage Accumulation
  const prevCountry = summary.countryMetrics[countryCode] || createEmptyCountryMetric(countryCode, now);
  const nextCountry: CountryAnalyticsMetrics = {
    ...prevCountry,
    lastActiveAt: now,
  };

  if (eventType === 'page_view' || eventType === 'country_enter' || eventType === 'country_switch') {
    nextCountry.entries += 1;
  }
  if (isNewCountryForSession || (isNewSession && eventType === 'page_view')) {
    nextCountry.uniqueVisitors += 1;
  }
  if (eventType === 'cta_click') {
    if (target === 'citizen_portal') nextCountry.portalClicks += 1;
    else if (target === 'gov_desk') nextCountry.govClicks += 1;
    else if (target === 'provider_desk') nextCountry.providerClicks += 1;
  }
  if (eventType === 'onboarding_complete') nextCountry.onboardingCompletes += 1;
  if (eventType === 'test_post_created') nextCountry.testPostsCreated += 1;
  if (eventType === 'ussd_launch') nextCountry.ussdLaunches += 1;
  if (eventType === 'crowdfund_view' || eventType === 'crowdfund_copy') nextCountry.crowdfundClicks += 1;
  if (eventType === 'partner_click') nextCountry.partnerClicks += 1;
  if (eventType === 'feedback_submit') nextCountry.feedbackCount += 1;

  summary.countryMetrics[countryCode] = nextCountry;
  summary.referrers[referrer] = (summary.referrers[referrer] || 0) + 1;
  summary.recentEvents = [eventItem, ...summary.recentEvents.slice(0, 149)];

  saveLocalAnalytics(summary);
  notifyListeners(summary);

  // 2. Fire-and-forget sync to Cloud Firestore (strictly obeys visitor_analytics/{docId} regex rules)
  try {
    const aggregateDocRef = doc(db, 'visitor_analytics', 'summary');
    const updatePayload: Record<string, any> = {
      docType: 'global_summary',
      lastUpdated: now,
      totalInteractions: increment(1),
      [`referrers.${referrer.replace(/[^a-zA-Z0-9_]/g, '_')}`]: increment(1),
    };

    if (eventType === 'page_view') updatePayload.totalPageViews = increment(1);
    if (isNewSession && eventType === 'page_view') updatePayload.uniqueVisitors = increment(1);
    if (device === 'mobile') updatePayload.deviceMobile = increment(1);
    else updatePayload.deviceDesktop = increment(1);
    if (target === 'citizen_portal') updatePayload.citizenPortalClicks = increment(1);
    if (target === 'gov_desk') updatePayload.govDeskClicks = increment(1);
    if (target === 'provider_desk') updatePayload.providerDeskClicks = increment(1);
    if (eventType === 'docs_view') updatePayload.docsViews = increment(1);
    if (eventType === 'pitch_view') updatePayload.pitchDeckViews = increment(1);
    if (eventType === 'ussd_launch') updatePayload.ussdSimulatorClicks = increment(1);
    if (eventType === 'access_code_attempt') {
      updatePayload.accessAttempts = increment(1);
      if (meta?.success) updatePayload.accessSuccesses = increment(1);
    }

    setDoc(aggregateDocRef, updatePayload, { merge: true }).catch(() => {});

    // Per-country Firestore aggregate doc
    const safeCountryId = `country_${String(countryCode).replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const countryDocRef = doc(db, 'visitor_analytics', safeCountryId);
    const countryPayload: Record<string, any> = {
      docType: 'country_metrics',
      countryCode,
      lastActiveAt: now,
    };
    if (eventType === 'page_view' || eventType === 'country_enter' || eventType === 'country_switch') {
      countryPayload.entries = increment(1);
    }
    if (isNewCountryForSession || (isNewSession && eventType === 'page_view')) {
      countryPayload.uniqueVisitors = increment(1);
    }
    if (target === 'citizen_portal') countryPayload.portalClicks = increment(1);
    if (target === 'gov_desk') countryPayload.govClicks = increment(1);
    if (target === 'provider_desk') countryPayload.providerClicks = increment(1);
    if (eventType === 'onboarding_complete') countryPayload.onboardingCompletes = increment(1);
    if (eventType === 'test_post_created') countryPayload.testPostsCreated = increment(1);
    if (eventType === 'ussd_launch') countryPayload.ussdLaunches = increment(1);
    if (eventType === 'crowdfund_view' || eventType === 'crowdfund_copy') countryPayload.crowdfundClicks = increment(1);
    if (eventType === 'partner_click') countryPayload.partnerClicks = increment(1);
    if (eventType === 'feedback_submit') countryPayload.feedbackCount = increment(1);

    setDoc(countryDocRef, countryPayload, { merge: true }).catch(() => {});

    // Save event entry
    const dateKey = now.slice(0, 10);
    const eventDocRef = doc(db, 'visitor_analytics', `event_${dateKey}_${eventItem.id}`);
    setDoc(eventDocRef, eventItem).catch(() => {});
  } catch {
    // Resilient local fallback already preserved
  }
}

export async function submitTesterFeedback(input: {
  countryCode: CountryCode;
  countryName: string;
  view: string;
  category: TesterFeedbackCategory;
  message: string;
  contact?: string;
}): Promise<TesterFeedbackItem> {
  const now = new Date().toISOString();
  const device = detectDevice();
  const referrer = cleanReferrer();
  const id = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const item: TesterFeedbackItem = {
    id,
    docType: 'tester_feedback',
    countryCode: input.countryCode,
    countryName: input.countryName,
    view: input.view || 'splash',
    category: input.category,
    message: input.message.trim().slice(0, 1500),
    contact: input.contact?.trim().slice(0, 120) || undefined,
    device,
    referrer,
    createdAt: now,
  };

  const existing = loadLocalTesterFeedback();
  saveLocalTesterFeedback([item, ...existing]);

  await trackVisitorInteraction('feedback_submit', `UX Feedback (${input.category})`, input.countryCode, {
    countryCode: input.countryCode,
    category: input.category,
    view: input.view,
  });

  try {
    await setDoc(doc(db, 'visitor_analytics', id), {
      ...item,
      contact: item.contact || '',
    });
  } catch {
    // Local cache retains submission
  }

  return item;
}

export async function saveCloudCountryLaunchStatus(
  countryCode: CountryCode,
  status: CountryLaunchStatus
): Promise<void> {
  try {
    await setDoc(
      doc(db, 'visitor_analytics', 'country_launch_registry'),
      {
        docType: 'launch_registry',
        updatedAt: new Date().toISOString(),
        [countryCode]: status,
      },
      { merge: true }
    );
  } catch {
    // Offline fallback stays intact in localStorage
  }
}

export interface CloudAnalyticsBundle {
  cloudSummary: Partial<AnalyticsSummary>;
  countryMetrics: Record<string, CountryAnalyticsMetrics>;
  recentEvents: VisitorInteractionEvent[];
  feedbackItems: TesterFeedbackItem[];
  launchStatuses: Record<string, CountryLaunchStatus>;
}

function parseCloudSnapshotDocs(docs: Array<{ id: string; data: () => Record<string, any> }>): CloudAnalyticsBundle {
  const local = loadLocalAnalytics();
  const cloudSummary: Partial<AnalyticsSummary> = { ...local };
  const countryMetrics: Record<string, CountryAnalyticsMetrics> = { ...(local.countryMetrics || {}) };
  const eventMap = new Map<string, VisitorInteractionEvent>();
  local.recentEvents.forEach((evt) => eventMap.set(evt.id, evt));

  const feedbackMap = new Map<string, TesterFeedbackItem>();
  loadLocalTesterFeedback().forEach((fb) => feedbackMap.set(fb.id, fb));

  const launchStatuses: Record<string, CountryLaunchStatus> = {};

  docs.forEach((docSnap) => {
    const id = docSnap.id;
    const data = docSnap.data();

    if (id === 'summary') {
      cloudSummary.totalPageViews = Math.max(Number(data.totalPageViews || 0), local.totalPageViews);
      cloudSummary.uniqueVisitors = Math.max(Number(data.uniqueVisitors || 0), local.uniqueVisitors);
      cloudSummary.citizenPortalClicks = Math.max(Number(data.citizenPortalClicks || 0), local.citizenPortalClicks);
      cloudSummary.govDeskClicks = Math.max(Number(data.govDeskClicks || 0), local.govDeskClicks);
      cloudSummary.providerDeskClicks = Math.max(Number(data.providerDeskClicks || 0), local.providerDeskClicks);
      cloudSummary.docsViews = Math.max(Number(data.docsViews || 0), local.docsViews);
      cloudSummary.pitchDeckViews = Math.max(Number(data.pitchDeckViews || 0), local.pitchDeckViews);
      cloudSummary.ussdSimulatorClicks = Math.max(Number(data.ussdSimulatorClicks || 0), local.ussdSimulatorClicks);
      cloudSummary.accessAttempts = Math.max(Number(data.accessAttempts || 0), local.accessAttempts);
      cloudSummary.accessSuccesses = Math.max(Number(data.accessSuccesses || 0), local.accessSuccesses);
      cloudSummary.deviceMobile = Math.max(Number(data.deviceMobile || 0), local.deviceMobile);
      cloudSummary.deviceDesktop = Math.max(Number(data.deviceDesktop || 0), local.deviceDesktop);
      if (data.referrers && typeof data.referrers === 'object') {
        const mergedRefs: Record<string, number> = { ...local.referrers };
        Object.entries(data.referrers).forEach(([k, v]) => {
          const cleanKey = k.replace(/_/g, ' ');
          mergedRefs[cleanKey] = Math.max(Number(v || 0), mergedRefs[cleanKey] || 0);
        });
        cloudSummary.referrers = mergedRefs;
      }
    } else if (id.startsWith('country_') && id !== 'country_launch_registry' && data.countryCode) {
      const code = data.countryCode as CountryCode;
      const prev = countryMetrics[code] || createEmptyCountryMetric(code, data.lastActiveAt || new Date().toISOString());
      countryMetrics[code] = {
        countryCode: code,
        entries: Math.max(Number(data.entries || 0), prev.entries),
        uniqueVisitors: Math.max(Number(data.uniqueVisitors || 0), prev.uniqueVisitors),
        portalClicks: Math.max(Number(data.portalClicks || 0), prev.portalClicks),
        govClicks: Math.max(Number(data.govClicks || 0), prev.govClicks),
        providerClicks: Math.max(Number(data.providerClicks || 0), prev.providerClicks),
        onboardingCompletes: Math.max(Number(data.onboardingCompletes || 0), prev.onboardingCompletes),
        testPostsCreated: Math.max(Number(data.testPostsCreated || 0), prev.testPostsCreated),
        ussdLaunches: Math.max(Number(data.ussdLaunches || 0), prev.ussdLaunches),
        crowdfundClicks: Math.max(Number(data.crowdfundClicks || 0), prev.crowdfundClicks),
        partnerClicks: Math.max(Number(data.partnerClicks || 0), prev.partnerClicks),
        feedbackCount: Math.max(Number(data.feedbackCount || 0), prev.feedbackCount),
        lastActiveAt: data.lastActiveAt && data.lastActiveAt > prev.lastActiveAt ? data.lastActiveAt : prev.lastActiveAt,
      };
    } else if (id === 'country_launch_registry') {
      Object.entries(data).forEach(([k, v]) => {
        if (k !== 'docType' && k !== 'updatedAt' && (v === 'public_beta' || v === 'live')) {
          launchStatuses[k] = v;
        }
      });
    } else if (data.docType === 'tester_feedback' || id.startsWith('fb_')) {
      const fb = data as TesterFeedbackItem;
      if (fb.message) {
        feedbackMap.set(fb.id || id, {
          ...fb,
          id: fb.id || id,
          docType: 'tester_feedback',
        });
      }
    } else if (data.docType === 'visitor_event' || id.startsWith('event_')) {
      const evt = data as VisitorInteractionEvent;
      if (evt.eventType && evt.timestamp) {
        eventMap.set(evt.id || id, {
          ...evt,
          id: evt.id || id,
          countryCode: evt.countryCode || 'UG',
        });
      }
    }
  });

  const recentEvents = Array.from(eventMap.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 150);

  const feedbackItems = Array.from(feedbackMap.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    cloudSummary,
    countryMetrics,
    recentEvents,
    feedbackItems,
    launchStatuses,
  };
}

export async function fetchCloudAnalyticsBundle(): Promise<CloudAnalyticsBundle> {
  try {
    const snap = await getDocs(collection(db, 'visitor_analytics'));
    return parseCloudSnapshotDocs(snap.docs);
  } catch {
    const local = loadLocalAnalytics();
    return {
      cloudSummary: local,
      countryMetrics: local.countryMetrics || {},
      recentEvents: local.recentEvents || [],
      feedbackItems: loadLocalTesterFeedback(),
      launchStatuses: {},
    };
  }
}

export function subscribeCloudAnalyticsBundle(
  onUpdate: (bundle: CloudAnalyticsBundle) => void
): () => void {
  try {
    return onSnapshot(
      collection(db, 'visitor_analytics'),
      (snap) => {
        onUpdate(parseCloudSnapshotDocs(snap.docs));
      },
      () => {
        onUpdate({
          cloudSummary: loadLocalAnalytics(),
          countryMetrics: loadLocalAnalytics().countryMetrics || {},
          recentEvents: loadLocalAnalytics().recentEvents || [],
          feedbackItems: loadLocalTesterFeedback(),
          launchStatuses: {},
        });
      }
    );
  } catch {
    return () => {};
  }
}

export function resetLocalAnalytics() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem('civicduty_visitor_analytics_v1');
  notifyListeners({ ...initialSummary, referrers: {}, countryMetrics: {}, recentEvents: [] });
}
