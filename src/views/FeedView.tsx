import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Shield, 
  Plus, 
  Clock, 
  AlertTriangle, 
  Radio, 
  TrendingUp, 
  Users, 
  MapPin, 
  Eye, 
  FileText, 
  Download, 
  BookOpen, 
  Compass, 
  PhoneCall, 
  CheckCircle2, 
  Layers,
  Award,
  Bookmark,
  Hash,
  Mic,
  X
} from 'lucide-react';
import { PostCardComponent } from '../components/PostCardComponent';
import { DeptIcon, CategoryIcon } from '../components/DeptIcon';
import { GeospatialSignalMap } from '../components/GeospatialSignalMap';
import { TrafficSignalHUD } from '../components/TrafficSignalHUD';
import { PromotionalAdFeedCard } from '../components/PromotionalAdFeedCard';
import { catByID, getDept, slaStatus } from '../utils/helpers';
import { TicketCategory } from '../types';

export const FeedView: React.FC = () => {
  const {
    user,
    ensureCitizenSession,
    posts,
    feedTab,
    setFeedTab,
    trafficSignalFilter,
    setTrafficSignalFilter,
    searchQuery,
    setSearchQuery,
    go,
    setActiveDept,
    setActiveDeptCountry,
    setActivePost,
    t,
    promotionalAds,
    showDemos,
    setShowDemos,
    townHalls,
    setActiveTownHall,
    setHostBarazaModalOpen,
    activeHashtagFilter,
    setActiveHashtagFilter,
    bookmarks,
    mutedAuthors,
    blockedAuthors,
  } = useApp();

  const [gisViewMode, setGisViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'all'>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  const activePromotionalAds = (promotionalAds || []).filter((a) => a.published);

  const activeUser = user || ensureCitizenSession();

  const followed = activeUser.followed || [];
  const normFollowed = followed.map((f) => f.replace(/^[a-z]{2}-/i, ''));
  const rawCountryPosts = posts.filter((p) => p.country === activeUser.country);
  const liveCount = rawCountryPosts.filter((p) => !p.is_demo).length;
  const demoCount = rawCountryPosts.filter((p) => p.is_demo).length;

  const allC = showDemos ? rawCountryPosts : rawCountryPosts.filter((p) => !p.is_demo);
  const matchedFollowPosts = allC.filter((p) =>
    followed.includes(p.dept) ||
    normFollowed.includes(p.dept) ||
    followed.includes(`${activeUser.country.toLowerCase()}-${p.dept}`)
  );
  // If user switched to a country where they haven't pinned specific desks yet, show all country dispatches
  const followPosts =
    matchedFollowPosts.length > 0
      ? allC.filter(
          (p) =>
            followed.includes(p.dept) ||
            normFollowed.includes(p.dept) ||
            followed.includes(`${activeUser.country.toLowerCase()}-${p.dept}`) ||
            p.category === 'praise' ||
            p.is_master_dossier
        )
      : allC;
  const trendPosts = [...allC].sort((a, b) => b.upvotes - a.upvotes);

  const base = selectedCategory === 'praise' 
    ? allC 
    : feedTab === 'following' 
      ? followPosts 
      : feedTab === 'trending' 
        ? trendPosts 
        : allC;

  const matchesQuery = (p: any, q: string) => {
    if (!q) return true;
    const term = q.toLowerCase();
    const d = getDept(p.country, p.dept);
    return [p.title, p.body, p.citizen_name, d.name, d.full, catByID(p.category).label]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(term));
  };

  const matchesTrafficSignal = (p: any, sig: 'all' | 'red' | 'amber' | 'green') => {
    if (sig === 'all') return true;
    const isRed = p.category === 'corruption' || p.status === 'pending' || p.status === 'overdue' || p.escalated;
    const isGreen = p.status === 'resolved' || p.citizen_satisfied === true || p.category === 'praise';
    const isAmber = !isRed && !isGreen;

    if (sig === 'red') return isRed;
    if (sig === 'amber') return isAmber;
    if (sig === 'green') return isGreen;
    return true;
  };

  const matchesCategory = (p: any) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  };

  // Always sort Live Citizen Dispatches (!is_demo) above Illustrative Demo Showcases (is_demo)
  const display = base
    .filter((p) => !(mutedAuthors || []).includes(p.citizen_name) && !(blockedAuthors || []).includes(p.citizen_name))
    .filter((p) => (showBookmarksOnly ? (bookmarks || []).includes(p.id) : true))
    .filter((p) =>
      activeHashtagFilter
        ? p.body.toLowerCase().includes(activeHashtagFilter.toLowerCase()) ||
          (p.hashtags || []).some((h) => h.toLowerCase() === activeHashtagFilter.toLowerCase())
        : true
    )
    .filter((p) => matchesQuery(p, searchQuery))
    .filter((p) => matchesTrafficSignal(p, trafficSignalFilter))
    .filter(matchesCategory)
    .sort((a, b) => {
      const aDemo = a.is_demo ? 1 : 0;
      const bDemo = b.is_demo ? 1 : 0;
      if (aDemo !== bDemo) return aDemo - bDemo;
      return 0;
    });

  const total = allC.length;
  const resolved = allC.filter((p) => p.status === 'resolved').length;
  const overdue = allC.filter((p) => p.escalated || p.status === 'overdue').length;
  const corruptCt = allC.filter((p) => p.category === 'corruption').length;
  const praiseCt = allC.filter((p) => p.category === 'praise').length;
  const topPraise = allC.find((p) => p.category === 'praise');

  return (
    <div className="animate-fade-in pb-16 text-slate-950 dark:text-white">
      {/* 1. Sticky Feed Tabs Header — Mobile-First Thumb Reach */}
      <div className="sticky top-0 z-10 border-b border-[#e3e6ea] dark:border-[#262b36] flex bg-white dark:bg-[#161a22] transition-colors">
        {[
          { id: 'following', label: t('following') || 'Monitored Desks', icon: Users },
          { id: 'trending', label: t('trending') || 'Top Dispatches', icon: TrendingUp },
          { id: 'near_me', label: t('nearMe') || 'GIS Radar', icon: Radio },
        ].map((tabItem) => {
          const Icon = tabItem.icon;
          const isOn = feedTab === tabItem.id;
          return (
            <button
              key={tabItem.id}
              onClick={() => setFeedTab(tabItem.id as any)}
              className={`feed-tab flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-colors font-semibold text-[11.5px] sm:text-xs cursor-pointer ${
                isOn
                  ? 'on text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 bg-[#f8f9fa] dark:bg-[#1e232d]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-[#f8f9fa]/60 dark:hover:bg-[#1e232d]/50'
              }`}
            >
              <Icon
                size={13}
                strokeWidth={1.75}
                className={isOn ? 'text-emerald-600 dark:text-emerald-400 shrink-0' : 'text-slate-500 dark:text-slate-400 shrink-0'}
              />
              <span className="truncate">{tabItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Search + Quick Filter Strip (Consolidated for Phone Viewports) */}
      <div className="px-3.5 sm:px-4 pt-3 pb-2 bg-white dark:bg-[#161a22] border-b border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 sw border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] rounded-xl px-3 py-2 flex items-center gap-2">
            <Search size={14} className="text-slate-500 dark:text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchReports') || 'Search dispatches, parishes, ministries...'}
              className="text-xs text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 w-full bg-transparent focus:outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            onClick={() => setGisViewMode(gisViewMode === 'LIST' ? 'MAP' : 'LIST')}
            className={`min-h-[36px] px-2.5 py-1.5 rounded-xl border text-[10.5px] font-mono font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              gisViewMode === 'MAP'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200'
            }`}
          >
            <Layers size={12} strokeWidth={1.75} className={gisViewMode === 'MAP' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
            <span>{gisViewMode === 'MAP' ? 'List' : 'GIS Map'}</span>
          </button>
        </div>

        {/* Category & Utility Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
            }`}
          >
            All ({total})
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'praise' ? 'all' : 'praise')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === 'praise'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-800'
            }`}
          >
            <Award size={11} className={selectedCategory === 'praise' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
            <span>Praise ({praiseCt})</span>
          </button>

          {[
            { id: 'health', label: 'Health' },
            { id: 'water', label: 'Water' },
            { id: 'power', label: 'Power' },
            { id: 'pothole', label: 'Roads' },
            { id: 'corruption', label: 'Anti-Graft' },
          ].map((c) => {
            const count = allC.filter((p) => p.category === c.id).length;
            const isSel = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(isSel ? 'all' : (c.id as any))}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSel
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
                }`}
              >
                <CategoryIcon category={c.id} size={11} />
                <span>{c.label}</span>
                {count > 0 && <span className="opacity-60 text-[9px]">({count})</span>}
              </button>
            );
          })}

          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
              showBookmarksOnly
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
            }`}
          >
            <Bookmark size={11} className={showBookmarksOnly ? 'text-white' : 'text-amber-600 dark:text-amber-400'} />
            <span>Saved ({(bookmarks || []).length})</span>
          </button>

          <button
            onClick={() => setShowDemos(!showDemos)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
              showDemos
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                : 'bg-emerald-600 text-white border-emerald-700'
            }`}
          >
            <Eye size={11} />
            <span>{showDemos ? `Demos: ON (${demoCount})` : `Live Only (${liveCount})`}</span>
          </button>
        </div>
      </div>

      {/* 3. Traffic Light Sovereign Signal Filter HUD */}
      <div className="px-3.5 sm:px-4 pt-3 pb-1">
        <TrafficSignalHUD posts={allC} />
      </div>

      {/* 4. Followed Department Horizontal Strip */}
      <div className="overflow-x-auto border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] scrollbar-none mt-2">
        <div className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 w-max">
          {followed.map((did, idx) => {
            const d = getDept(activeUser.country, did);
            const cnt = posts.filter((p) => p.dept === did && p.country === activeUser.country).length;
            return (
              <button
                key={`${did}-${idx}`}
                onClick={() => {
                  setActiveDept(did);
                  setActiveDeptCountry(activeUser.country);
                  go('dept_wall');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-600 transition-all whitespace-nowrap group cursor-pointer"
              >
                <DeptIcon dept={d} size={11} className="text-slate-500 dark:text-slate-400 group-hover:text-emerald-600" />
                <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">{d.name}</span>
                {cnt > 0 && (
                  <span className="text-[8.5px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded-full">
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => go('depts')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] border-dashed hover:border-slate-400 transition-all whitespace-nowrap text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            + All Desks
          </button>
        </div>
      </div>

      {/* 5. Compact Live Digital Baraza Banner — Google AI Studio Card */}
      {townHalls && townHalls.length > 0 && (
        <div className="mx-3.5 sm:mx-4 mt-2.5 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[8.5px] font-mono font-bold uppercase flex items-center gap-1 shrink-0">
                <Radio size={9} strokeWidth={2} />
                <span>LIVE BARAZA</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                {townHalls[0].listeners_count} tuned in · {townHalls[0].topic_tag}
              </span>
            </div>
            <div className="text-xs font-semibold truncate mt-0.5">{townHalls[0].title}</div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setHostBarazaModalOpen(true)}
              title="Start / Host a New Live Digital Baraza"
              className="px-2 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={11} strokeWidth={2} />
              <span>Host</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTownHall(townHalls[0])}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer"
            >
              <Mic size={11} strokeWidth={1.75} />
              <span>Join</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Hashtag Filter Indicator (Only shown when active) */}
      {activeHashtagFilter && (
        <div className="px-3.5 sm:px-4 pt-2 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
            Filtered by tag: <strong className="text-emerald-700 dark:text-emerald-400">{activeHashtagFilter}</strong>
          </span>
          <button
            type="button"
            onClick={() => setActiveHashtagFilter(null)}
            className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[9.5px] font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            <X size={10} />
            <span>Clear</span>
          </button>
        </div>
      )}

      {/* GIS Signal Density Map (Rendered when toggled or on near_me tab) */}
      {(feedTab === 'near_me' || gisViewMode === 'MAP') && (
        <div className="p-3.5 sm:p-4 space-y-3">
          <GeospatialSignalMap customPosts={display} />
        </div>
      )}

      {/* Feed List Items */}
      {gisViewMode === 'LIST' && (
        <div id="feed-list" className="divide-y divide-slate-200 dark:divide-slate-800/80">
          {display.length === 0 ? (
            <div className="space-y-4">
              {activePromotionalAds.length > 0 && (
                <div className="p-3">
                  <PromotionalAdFeedCard ad={activePromotionalAds[0]} />
                </div>
              )}
              <div className="text-center py-16 space-y-3 px-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400 shadow-inner">
                  <Shield size={26} />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">No reports matching your filter criteria.</p>
                <button
                  onClick={() => go('compose')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black mono mt-2 active:scale-95 transition-all shadow-md"
                >
                  <Plus size={14} /> File Sovereign Report
                </button>
              </div>
            </div>
          ) : (
            display.map((p, i) => (
              <React.Fragment key={p.id}>
                <PostCardComponent post={p} rankIndex={feedTab === 'trending' ? i : null} />
                {i === 1 && activePromotionalAds[0] && (
                  <div className="my-2 px-0 sm:px-3">
                    <PromotionalAdFeedCard ad={activePromotionalAds[0]} defaultIndex={0} />
                  </div>
                )}
                {i === 4 && activePromotionalAds[1] && (
                  <div className="my-2 px-0 sm:px-3">
                    <PromotionalAdFeedCard ad={activePromotionalAds[1]} defaultIndex={1} />
                  </div>
                )}
                {i === 7 && activePromotionalAds[2] && (
                  <div className="my-2 px-0 sm:px-3">
                    <PromotionalAdFeedCard ad={activePromotionalAds[2]} defaultIndex={2} />
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      )}
    </div>
  );
};
