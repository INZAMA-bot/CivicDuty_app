import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Users,
  MousePointer,
  Smartphone,
  Monitor,
  Share2,
  RefreshCw,
  Clock,
  Globe,
  MessageSquarePlus,
  HeartHandshake,
  FlaskConical,
  Rocket,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  loadLocalAnalytics,
  subscribeAnalytics,
  subscribeCloudAnalyticsBundle,
  fetchCloudAnalyticsBundle,
  trackVisitorInteraction,
  resetLocalAnalytics,
  AnalyticsSummary,
  CloudAnalyticsBundle,
} from '../../services/analyticsService';
import { useApp } from '../../context/AppContext';
import { COUNTRIES } from '../../data/countries';
import { CountryAnalyticsMetrics, CountryCode, TesterFeedbackCategory } from '../../types';

const FEEDBACK_CATEGORIES: Array<'ALL' | TesterFeedbackCategory> = [
  'ALL',
  'Governance Hierarchy',
  'Local Brands / Utilities',
  'UI / UX Suggestion',
  'Bug Report',
  'Partnership Inquiry',
];

export const CdOpsVisitorAnalyticsPanel: React.FC = () => {
  const { toast, posts, getCountryStatus, setCountryGoLive, resetCountryToBeta } = useApp();
  const [localAnalytics, setLocalAnalytics] = useState<AnalyticsSummary>(loadLocalAnalytics);
  const [cloudBundle, setCloudBundle] = useState<CloudAnalyticsBundle | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [feedbackCountryFilter, setFeedbackCountryFilter] = useState<string>('ALL');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<'ALL' | TesterFeedbackCategory>('ALL');
  const [confirmPurgeCountry, setConfirmPurgeCountry] = useState<CountryCode | null>(null);
  const [purgingCode, setPurgingCode] = useState<CountryCode | null>(null);
  const [confirmResetLocal, setConfirmResetLocal] = useState(false);

  useEffect(() => {
    const unsubLocal = subscribeAnalytics((next) => {
      setLocalAnalytics(next);
    });
    const unsubCloud = subscribeCloudAnalyticsBundle((bundle) => {
      setCloudBundle(bundle);
    });
    return () => {
      unsubLocal();
      unsubCloud();
    };
  }, []);

  const mergedSummary = useMemo(() => {
    const cs = cloudBundle?.cloudSummary;
    return {
      totalPageViews: Math.max(Number(cs?.totalPageViews || 0), localAnalytics.totalPageViews),
      uniqueVisitors: Math.max(Number(cs?.uniqueVisitors || 0), localAnalytics.uniqueVisitors),
      citizenPortalClicks: Math.max(Number(cs?.citizenPortalClicks || 0), localAnalytics.citizenPortalClicks),
      govDeskClicks: Math.max(Number(cs?.govDeskClicks || 0), localAnalytics.govDeskClicks),
      providerDeskClicks: Math.max(Number(cs?.providerDeskClicks || 0), localAnalytics.providerDeskClicks),
      docsViews: Math.max(Number(cs?.docsViews || 0), localAnalytics.docsViews),
      pitchDeckViews: Math.max(Number(cs?.pitchDeckViews || 0), localAnalytics.pitchDeckViews),
      ussdSimulatorClicks: Math.max(Number(cs?.ussdSimulatorClicks || 0), localAnalytics.ussdSimulatorClicks),
      deviceMobile: Math.max(Number(cs?.deviceMobile || 0), localAnalytics.deviceMobile),
      deviceDesktop: Math.max(Number(cs?.deviceDesktop || 0), localAnalytics.deviceDesktop),
      referrers: cs?.referrers || localAnalytics.referrers || {},
      recentEvents:
        cloudBundle?.recentEvents && cloudBundle.recentEvents.length > 0
          ? cloudBundle.recentEvents
          : localAnalytics.recentEvents,
    };
  }, [localAnalytics, cloudBundle]);

  const mergedCountryMetrics = useMemo<Record<string, CountryAnalyticsMetrics>>(() => {
    const map: Record<string, CountryAnalyticsMetrics> = {};
    const apply = (src?: Record<string, CountryAnalyticsMetrics>) => {
      if (!src) return;
      (Object.entries(src) as Array<[string, CountryAnalyticsMetrics]>).forEach(([code, m]) => {
        const prev = map[code];
        if (!prev) {
          map[code] = { ...m };
        } else {
          map[code] = {
            countryCode: code as CountryCode,
            entries: Math.max(m.entries, prev.entries),
            uniqueVisitors: Math.max(m.uniqueVisitors, prev.uniqueVisitors),
            portalClicks: Math.max(m.portalClicks, prev.portalClicks),
            govClicks: Math.max(m.govClicks, prev.govClicks),
            providerClicks: Math.max(m.providerClicks, prev.providerClicks),
            onboardingCompletes: Math.max(m.onboardingCompletes, prev.onboardingCompletes),
            testPostsCreated: Math.max(m.testPostsCreated, prev.testPostsCreated),
            ussdLaunches: Math.max(m.ussdLaunches, prev.ussdLaunches),
            crowdfundClicks: Math.max(m.crowdfundClicks, prev.crowdfundClicks),
            partnerClicks: Math.max(m.partnerClicks, prev.partnerClicks),
            feedbackCount: Math.max(m.feedbackCount, prev.feedbackCount),
            lastActiveAt: m.lastActiveAt > prev.lastActiveAt ? m.lastActiveAt : prev.lastActiveAt,
          };
        }
      });
    };
    apply(localAnalytics.countryMetrics);
    apply(cloudBundle?.countryMetrics);
    return map;
  }, [localAnalytics.countryMetrics, cloudBundle]);

  const liveTestPostsByCountry = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      if (p.is_test_post && !p.is_demo) {
        counts[p.country] = (counts[p.country] || 0) + 1;
      }
    });
    return counts;
  }, [posts]);

  const totalLiveTestPosts = (Object.values(liveTestPostsByCountry) as number[]).reduce((a, b) => a + b, 0);
  const feedbackItems = cloudBundle?.feedbackItems || [];

  const countryRows = useMemo(() => {
    const q = countrySearch.trim().toLowerCase();
    const allCodes = Object.keys(COUNTRIES) as CountryCode[];
    const rows = allCodes
      .map((code) => {
        const info = COUNTRIES[code];
        const metric = mergedCountryMetrics[code];
        const liveTestCount = liveTestPostsByCountry[code] || 0;
        const launchStatus = getCountryStatus(code);
        const activityWeight =
          (metric?.entries || 0) +
          (metric?.portalClicks || 0) * 2 +
          (metric?.testPostsCreated || 0) * 3 +
          (metric?.feedbackCount || 0) * 3 +
          liveTestCount * 3 +
          (launchStatus === 'live' ? 10 : 0);

        return {
          code,
          name: info?.name || code,
          status: launchStatus,
          entries: metric?.entries || 0,
          uniqueVisitors: metric?.uniqueVisitors || 0,
          portalClicks: metric?.portalClicks || 0,
          govClicks: metric?.govClicks || 0,
          providerClicks: metric?.providerClicks || 0,
          onboardingCompletes: metric?.onboardingCompletes || 0,
          testPostsCount: Math.max(liveTestCount, metric?.testPostsCreated || 0),
          liveTestCount,
          ussdLaunches: metric?.ussdLaunches || 0,
          crowdfundClicks: metric?.crowdfundClicks || 0,
          partnerClicks: metric?.partnerClicks || 0,
          feedbackCount: metric?.feedbackCount || 0,
          lastActiveAt: metric?.lastActiveAt || '',
          activityWeight,
        };
      })
      .filter((row) => {
        if (q) {
          return row.code.toLowerCase().includes(q) || row.name.toLowerCase().includes(q);
        }
        return row.activityWeight > 0 || ['UG', 'RW', 'KE', 'NG', 'GH', 'US', 'GB'].includes(row.code);
      })
      .sort((a, b) => b.activityWeight - a.activityWeight || a.name.localeCompare(b.name));

    return rows;
  }, [countrySearch, mergedCountryMetrics, liveTestPostsByCountry, getCountryStatus]);

  const activeNationsCount = (Object.values(mergedCountryMetrics) as CountryAnalyticsMetrics[]).filter(
    (m) => m.entries > 0 || m.portalClicks > 0 || m.testPostsCreated > 0 || m.feedbackCount > 0
  ).length;

  const filteredFeedback = useMemo(() => {
    return feedbackItems.filter((item) => {
      if (feedbackCountryFilter !== 'ALL' && item.countryCode !== feedbackCountryFilter) return false;
      if (feedbackCategoryFilter !== 'ALL' && item.category !== feedbackCategoryFilter) return false;
      return true;
    });
  }, [feedbackItems, feedbackCountryFilter, feedbackCategoryFilter]);

  const totalCrowdfundSignals = (Object.values(mergedCountryMetrics) as CountryAnalyticsMetrics[]).reduce(
    (acc, m) => acc + (m.crowdfundClicks || 0) + (m.partnerClicks || 0),
    0
  );

  const totalDeviceCount = (mergedSummary.deviceMobile || 0) + (mergedSummary.deviceDesktop || 0);
  const mobilePct = totalDeviceCount > 0 ? Math.round((mergedSummary.deviceMobile / totalDeviceCount) * 100) : 0;
  const desktopPct = totalDeviceCount > 0 ? Math.round((mergedSummary.deviceDesktop / totalDeviceCount) * 100) : 0;

  const handleRefreshCloud = async () => {
    const bundle = await fetchCloudAnalyticsBundle();
    setCloudBundle(bundle);
    setLocalAnalytics(loadLocalAnalytics());
    toast('Live multi-nation telemetry synchronized from Firestore.', 'emerald');
  };

  const handleExecuteGoLive = async (code: CountryCode) => {
    setPurgingCode(code);
    try {
      await setCountryGoLive(code);
      setConfirmPurgeCountry(null);
      const bundle = await fetchCloudAnalyticsBundle();
      setCloudBundle(bundle);
    } finally {
      setPurgingCode(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* 1. Studio Header & Actions */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Cloud + Edge Synchronized · All Nations Beta Monitor
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Global Jurisdiction Usage &amp; Launch Telemetry
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monitors per-country entries, portal exploration, onboarding conversions, UX tester feedback, crowdfund/partner demand, and Test Post auto-purge upon official Go Live.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRefreshCloud}
              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Sync Cloud</span>
            </button>
            {confirmResetLocal ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    resetLocalAnalytics();
                    setConfirmResetLocal(false);
                    toast('Local browser cache cleared (cloud aggregates preserved).', 'amber');
                  }}
                  className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-mono font-semibold cursor-pointer"
                >
                  Confirm Clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmResetLocal(false)}
                  className="min-h-[38px] px-2.5 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmResetLocal(true)}
                className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Clear Local</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Simulator */}
        <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
            <strong>Live Probe:</strong> Simulate event for country telemetry verification:
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['US', 'KE', 'RW', 'NG'] as CountryCode[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  trackVisitorInteraction('country_enter', `Simulated ${c} Entry`, c, { countryCode: c });
                  toast(`Logged live cloud entry ping for ${c}`, 'emerald');
                }}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                + {c} Entry
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Global KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            Total Entries / Views
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {mergedSummary.totalPageViews}
            </span>
            <Activity size={16} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {mergedSummary.uniqueVisitors} unique visitor sessions
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            Nations Active
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {activeNationsCount}
            </span>
            <Globe size={16} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 tabular-nums">
            of {Object.keys(COUNTRIES).length} jurisdictions ready
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            Portal Exploration
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              {mergedSummary.citizenPortalClicks + mergedSummary.govDeskClicks + mergedSummary.providerDeskClicks}
            </span>
            <MousePointer size={16} className="text-indigo-500" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 tabular-nums">
            Citizen {mergedSummary.citizenPortalClicks} · Gov {mergedSummary.govDeskClicks} · Prov {mergedSummary.providerDeskClicks}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            UX &amp; Funding Signals
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {feedbackItems.length + totalCrowdfundSignals}
            </span>
            <HeartHandshake size={16} className="text-amber-500" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 tabular-nums">
            {feedbackItems.length} UX notes · {totalLiveTestPosts} live test posts
          </span>
        </div>
      </div>

      {/* 3. Per-Country Platform Usage & Official Go-Live Table */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe size={14} className="text-emerald-500" />
              <span>Per-Country Demand Matrix &amp; Test Post Purge Control</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Promoting a nation to <strong>LIVE</strong> immediately deletes all <code className="text-[10px]">TEST POST</code> dispatches in that jurisdiction across client and Firestore.
            </p>
          </div>
          <div className="relative w-full sm:w-56">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Filter country or ISO..."
              className="w-full min-h-[36px] pl-8 pr-3 py-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#e3e6ea] dark:border-[#262b36] text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-2 pr-3">Country</th>
                <th className="py-2 px-2">State</th>
                <th className="py-2 px-2 text-right">Entries</th>
                <th className="py-2 px-2 text-right">Onboarded</th>
                <th className="py-2 px-2 text-right">Test Posts</th>
                <th className="py-2 px-2 text-right">UX Notes</th>
                <th className="py-2 px-2 text-right">Fund / Partner</th>
                <th className="py-2 pl-3 text-right">Launch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e6ea]/70 dark:divide-[#262b36]">
              {countryRows.map((row) => (
                <tr key={row.code} className="hover:bg-[#f8f9fa] dark:hover:bg-[#0e1116]/60 transition-colors">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-bold text-slate-800 dark:text-slate-200">
                        {row.code}
                      </span>
                      <span className="font-sans font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {row.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    {row.status === 'live' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 size={10} />
                        <span>LIVE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        <FlaskConical size={10} />
                        <span>BETA</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums">
                    <span className="font-bold text-slate-900 dark:text-white">{row.entries}</span>
                    {row.uniqueVisitors > 0 && (
                      <span className="text-[10px] text-slate-400 ml-1">({row.uniqueVisitors}u)</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {row.onboardingCompletes}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums">
                    <span className={row.liveTestCount > 0 ? 'font-bold text-amber-600 dark:text-amber-400' : 'text-slate-500'}>
                      {row.testPostsCount}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-slate-700 dark:text-slate-300">
                    {row.feedbackCount}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                    {row.crowdfundClicks + row.partnerClicks}
                  </td>
                  <td className="py-2.5 pl-3 text-right whitespace-nowrap">
                    {row.status === 'public_beta' ? (
                      confirmPurgeCountry === row.code ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            disabled={purgingCode === row.code}
                            onClick={() => handleExecuteGoLive(row.code)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold cursor-pointer"
                          >
                            {purgingCode === row.code ? 'Purging...' : `Confirm (${row.liveTestCount} purge)`}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmPurgeCountry(null)}
                            className="px-2 py-1 rounded border border-[#e3e6ea] dark:border-[#262b36] text-[10px] text-slate-500 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmPurgeCountry(row.code)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-semibold transition-colors cursor-pointer"
                        >
                          <Rocket size={11} />
                          <span>Go Live &amp; Purge</span>
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => resetCountryToBeta(row.code)}
                        className="px-2.5 py-1 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-500/40 text-[10.5px] text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        Set Beta
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Tester UX Feedback Inbox (Cloud Synced) */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <MessageSquarePlus size={14} className="text-emerald-500" />
              <span>Public Beta UX Feedback &amp; Localization Inbox ({filteredFeedback.length})</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Captured directly from testers per country — governance corrections, local utilities, UI notes, and partnership leads.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={feedbackCountryFilter}
              onChange={(e) => setFeedbackCountryFilter(e.target.value)}
              className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Countries</option>
              {(Array.from(new Set(feedbackItems.map((i) => i.countryCode))) as string[]).map((code) => (
                <option key={code} value={code}>
                  {code} · {COUNTRIES[code]?.name || code}
                </option>
              ))}
            </select>
            <select
              value={feedbackCategoryFilter}
              onChange={(e) => setFeedbackCategoryFilter(e.target.value as any)}
              className="min-h-[34px] px-2.5 py-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-800 dark:text-slate-200"
            >
              {FEEDBACK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredFeedback.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-500">
            No tester UX feedback recorded yet. Notes submitted through the floating &quot;Feedback &amp; Fund&quot; widget appear here in real time.
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {item.countryCode} · {item.countryName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">view: {item.view}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed">{item.message}</p>
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
                  <span>
                    {item.device} · {item.referrer}
                  </span>
                  {item.contact && (
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      Contact: {item.contact}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Breakdown Row: Referrals & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Share2 size={14} className="text-emerald-500" />
              <span>Traffic Referral Sources</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Global</span>
          </div>

          <div className="space-y-2">
            {Object.keys(mergedSummary.referrers).length === 0 ? (
              <p className="text-xs font-mono text-slate-400 py-4 text-center">
                Share the public beta link on X/Twitter to track inbound channels here.
              </p>
            ) : (
              Object.entries(mergedSummary.referrers)
                .sort(([, a], [, b]) => (Number(b) || 0) - (Number(a) || 0))
                .map(([refName, count]) => {
                  const isTwitter = refName.includes('X') || refName.includes('Twitter');
                  return (
                    <div
                      key={refName}
                      className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isTwitter ? 'bg-black dark:bg-white' : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{refName}</span>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {count} hits
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Monitor size={14} className="text-indigo-500" />
              <span>Device Split (Mobile vs Desktop)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 tabular-nums">{totalDeviceCount} Total</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between tabular-nums">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Smartphone size={14} className="text-emerald-500" />
                  <span>Mobile Devices</span>
                </span>
                <span className="font-bold">
                  {mergedSummary.deviceMobile} ({mobilePct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${mobilePct}%` }} />
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between tabular-nums">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Monitor size={14} className="text-indigo-500" />
                  <span>Desktop / Laptop</span>
                </span>
                <span className="font-bold">
                  {mergedSummary.deviceDesktop} ({desktopPct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${desktopPct}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <AlertTriangle size={13} className="text-amber-500 shrink-0" />
              <span>
                Use the Per-Country Matrix above to spot where organic tester interest is highest before prioritizing incorporation.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Live Multi-Nation Interaction Stream */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-emerald-500" />
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Live Multi-Nation Activity Stream ({mergedSummary.recentEvents.length} Recent)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Cloud + Local</span>
        </div>

        {mergedSummary.recentEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            No visitor interactions recorded yet.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-80 overflow-y-auto font-mono text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
            {mergedSummary.recentEvents.slice(0, 60).map((evt) => {
              const dateStr = new Date(evt.timestamp).toLocaleTimeString();
              return (
                <div
                  key={evt.id}
                  className="py-2 px-2 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-[#e3e6ea] dark:border-[#262b36] text-[9.5px] font-bold text-slate-800 dark:text-slate-200">
                      {evt.countryCode || 'UG'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{evt.label}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[10.5px] text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
                    <span>{evt.device}</span>
                    <span>·</span>
                    <span>{evt.referrer}</span>
                    <span>·</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock size={11} />
                      <span>{dateStr}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
