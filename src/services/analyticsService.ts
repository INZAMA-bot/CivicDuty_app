import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface VisitorInteractionEvent {
  id: string;
  eventType:
    | 'page_view'
    | 'cta_click'
    | 'access_code_attempt'
    | 'docs_view'
    | 'pitch_view'
    | 'ussd_launch'
    | 'legal_charter_view';
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
  recentEvents: VisitorInteractionEvent[];
}

const LOCAL_STORAGE_KEY = 'civicduty_visitor_analytics_v1';
const VISITOR_SESSION_ID_KEY = 'civicduty_session_id';

function getOrSetSessionId(): { sessionId: string; isNew: boolean } {
  try {
    let sid = sessionStorage.getItem(VISITOR_SESSION_ID_KEY);
    if (!sid) {
      sid = 'ses_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      sessionStorage.setItem(VISITOR_SESSION_ID_KEY, sid);
      return { sessionId: sid, isNew: true };
    }
    return { sessionId: sid, isNew: false };
  } catch {
    return { sessionId: 'ses_anon_' + Date.now(), isNew: false };
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

function cleanReferrer(): string {
  if (typeof document === 'undefined' || !document.referrer) return 'Direct / Social Link';
  try {
    const url = new URL(document.referrer);
    const host = url.hostname.toLowerCase();
    if (host.includes('t.co') || host.includes('twitter') || host.includes('x.com')) return 'X (Twitter)';
    if (host.includes('linkedin')) return 'LinkedIn';
    if (host.includes('facebook') || host.includes('fb.me')) return 'Facebook';
    if (host.includes('google')) return 'Google Search';
    if (host.includes('whatsapp')) return 'WhatsApp';
    return host;
  } catch {
    return 'Referral';
  }
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
  recentEvents: [],
};

export function loadLocalAnalytics(): AnalyticsSummary {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return { ...initialSummary, ...JSON.parse(saved) };
    }
  } catch {}
  return initialSummary;
}

function saveLocalAnalytics(summary: AnalyticsSummary) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(summary));
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

// Track an interaction event
export async function trackVisitorInteraction(
  eventType: VisitorInteractionEvent['eventType'],
  label: string,
  target?: string,
  meta?: Record<string, any>
): Promise<void> {
  const device = detectDevice();
  const referrer = cleanReferrer();
  const { isNew } = getOrSetSessionId();
  const now = new Date().toISOString();

  const eventItem: VisitorInteractionEvent = {
    id: 'evt_' + Math.random().toString(36).substring(2, 8) + '_' + Date.now(),
    eventType,
    label,
    target,
    referrer,
    device,
    path: typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/',
    timestamp: now,
    meta,
  };

  // 1. Update Local Analytics
  const summary = loadLocalAnalytics();
  summary.totalPageViews += eventType === 'page_view' ? 1 : 0;
  if (isNew && eventType === 'page_view') {
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

  // Update referrer map
  summary.referrers[referrer] = (summary.referrers[referrer] || 0) + 1;

  // Keep last 150 events
  summary.recentEvents = [eventItem, ...summary.recentEvents.slice(0, 149)];

  saveLocalAnalytics(summary);
  notifyListeners(summary);

  // 2. Fire-and-forget sync to Cloud Firestore
  try {
    const aggregateDocRef = doc(db, 'visitor_analytics', 'summary');
    const updatePayload: Record<string, any> = {
      lastUpdated: now,
      totalInteractions: increment(1),
    };

    if (eventType === 'page_view') updatePayload.totalPageViews = increment(1);
    if (isNew && eventType === 'page_view') updatePayload.uniqueVisitors = increment(1);
    if (target === 'citizen_portal') updatePayload.citizenPortalClicks = increment(1);
    if (target === 'gov_desk') updatePayload.govDeskClicks = increment(1);
    if (target === 'provider_desk') updatePayload.providerDeskClicks = increment(1);
    if (eventType === 'docs_view') updatePayload.docsViews = increment(1);
    if (eventType === 'pitch_view') updatePayload.pitchDeckViews = increment(1);
    if (eventType === 'access_code_attempt') {
      updatePayload.accessAttempts = increment(1);
      if (meta?.success) updatePayload.accessSuccesses = increment(1);
    }

    // Upsert aggregate summary in Firestore
    setDoc(aggregateDocRef, updatePayload, { merge: true }).catch(() => {});

    // Save recent event in date-sharded event collection
    const dateKey = now.slice(0, 10);
    const eventDocRef = doc(db, 'visitor_analytics', `event_${dateKey}_${eventItem.id}`);
    setDoc(eventDocRef, eventItem).catch(() => {});
  } catch (err) {
    // Offline resilience: local analytics already preserved
  }
}

// Reset analytics for testing
export function resetLocalAnalytics() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  notifyListeners(initialSummary);
}
