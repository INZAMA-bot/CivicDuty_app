import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  MousePointer,
  Smartphone,
  Monitor,
  Share2,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Download,
  Trash2,
} from 'lucide-react';
import {
  loadLocalAnalytics,
  subscribeAnalytics,
  trackVisitorInteraction,
  resetLocalAnalytics,
  AnalyticsSummary,
} from '../../services/analyticsService';
import { useApp } from '../../context/AppContext';

export const CdOpsVisitorAnalyticsPanel: React.FC = () => {
  const { toast } = useApp();
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(loadLocalAnalytics);

  useEffect(() => {
    const unsubscribe = subscribeAnalytics((next) => {
      setAnalytics(next);
    });
    return () => unsubscribe();
  }, []);

  const handleSimulateVisitor = (target: 'citizen' | 'gov' | 'provider' | 'docs') => {
    if (target === 'citizen') {
      trackVisitorInteraction('cta_click', 'Simulated Citizen Portal Click', 'citizen_portal');
    } else if (target === 'gov') {
      trackVisitorInteraction('cta_click', 'Simulated Government Desk Click', 'gov_desk');
    } else if (target === 'provider') {
      trackVisitorInteraction('cta_click', 'Simulated Provider Desk Click', 'provider_desk');
    } else {
      trackVisitorInteraction('docs_view', 'Simulated Public Docs View');
    }
    toast('Simulated visitor interaction logged in real-time!', 'emerald');
  };

  const handleReset = () => {
    if (window.confirm('Reset all visitor tracking telemetry? This will clear local logs.')) {
      resetLocalAnalytics();
      toast('Visitor interaction analytics reset to clean slate.', 'amber');
    }
  };

  const totalDeviceCount = (analytics.deviceMobile || 0) + (analytics.deviceDesktop || 0);
  const mobilePct = totalDeviceCount > 0 ? Math.round((analytics.deviceMobile / totalDeviceCount) * 100) : 0;
  const desktopPct = totalDeviceCount > 0 ? Math.round((analytics.deviceDesktop / totalDeviceCount) * 100) : 0;

  return (
    <div className="space-y-4 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e3e6ea] dark:border-[#262b36] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                Live Real-Time Telemetry · Public Launch Tracker
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
              Visitor Traffic &amp; Click Interaction Engine
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Tracks live visitor hits, CTA clicks on homepage, referral channels (X/Twitter, LinkedIn, Direct), and access code attempts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAnalytics(loadLocalAnalytics());
                toast('Telemetry synchronized.', 'emerald');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset counters"
            >
              <Trash2 size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Test Simulator Controls */}
        <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="text-xs font-mono text-slate-600 dark:text-slate-300">
            <strong>Founder Simulation:</strong> Test real-time telemetry trigger:
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleSimulateVisitor('citizen')}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            >
              + Citizen CTA
            </button>
            <button
              onClick={() => handleSimulateVisitor('gov')}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
            >
              + Gov Desk CTA
            </button>
            <button
              onClick={() => handleSimulateVisitor('provider')}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer"
            >
              + Provider CTA
            </button>
            <button
              onClick={() => handleSimulateVisitor('docs')}
              className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-slate-800 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              + Docs View
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            Total Page Views
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
              {analytics.totalPageViews}
            </span>
            <Activity size={16} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
            {analytics.uniqueVisitors} unique visitors
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            Citizen Portal Clicks
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {analytics.citizenPortalClicks}
            </span>
            <MousePointer size={16} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Primary public interest
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            Gov &amp; Provider Clicks
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {analytics.govDeskClicks + analytics.providerDeskClicks}
            </span>
            <Users size={16} className="text-indigo-500" />
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Gov: {analytics.govDeskClicks} · Provider: {analytics.providerDeskClicks}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block">
            Master Code Entries
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
              {analytics.accessAttempts}
            </span>
            <ShieldCheck size={16} className="text-amber-500" />
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
            {analytics.accessSuccesses} authorized
          </span>
        </div>
      </div>

      {/* Breakdown Row: Referrals & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Referral Breakdown */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Share2 size={14} className="text-emerald-500" />
              <span>Traffic Referral Sources (Where Clicks Came From)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">All Time</span>
          </div>

          <div className="space-y-2">
            {Object.keys(analytics.referrers).length === 0 ? (
              <p className="text-xs font-mono text-slate-400 py-4 text-center">
                No external referrers recorded yet. Once you post your link on X, traffic sources will populate here.
              </p>
            ) : (
              Object.entries(analytics.referrers)
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
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {refName}
                        </span>
                      </div>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {count} hits
                      </span>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
          <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Monitor size={14} className="text-indigo-500" />
              <span>Device Types (Mobile vs Desktop)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {totalDeviceCount} Total
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Smartphone size={14} className="text-emerald-500" />
                  <span>Mobile Devices (Smartphones)</span>
                </span>
                <span className="font-bold">{analytics.deviceMobile} ({mobilePct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${mobilePct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Monitor size={14} className="text-indigo-500" />
                  <span>Desktop / Laptop Computers</span>
                </span>
                <span className="font-bold">{analytics.deviceDesktop} ({desktopPct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${desktopPct}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono leading-relaxed mt-2">
              CivicDuty is fully responsive with PWA mobile offline support, adaptive broadsheet typography, and zero horizontal viewport scrolling.
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Live Activity Stream */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
        <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Live Visitor Interaction Stream ({analytics.recentEvents.length} Recent Events)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Auto-updating</span>
        </div>

        {analytics.recentEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            No visitor clicks recorded yet. Clicks on the homepage will immediately appear here in real-time.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-96 overflow-y-auto font-mono text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
            {analytics.recentEvents.slice(0, 50).map((evt) => {
              const dateStr = new Date(evt.timestamp).toLocaleTimeString();
              const isClick = evt.eventType === 'cta_click';
              const isAccess = evt.eventType === 'access_code_attempt';
              return (
                <div
                  key={evt.id}
                  className="py-2 px-2 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                        isClick
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          : isAccess
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                          : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      {evt.eventType.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {evt.label}
                    </span>
                    {evt.target && (
                      <span className="text-[10px] text-slate-500">
                        ({evt.target})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[10.5px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      {evt.device === 'mobile' ? (
                        <Smartphone size={12} className="text-emerald-500" />
                      ) : (
                        <Monitor size={12} className="text-indigo-500" />
                      )}
                      <span>{evt.device}</span>
                    </span>
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
