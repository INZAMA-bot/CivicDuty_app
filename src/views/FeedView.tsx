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
  Sparkles, 
  FileText, 
  Download, 
  BookOpen, 
  Compass, 
  PhoneCall, 
  CheckCircle2, 
  Layers,
  Award 
} from 'lucide-react';
import { PostCardComponent } from '../components/PostCardComponent';
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
  } = useApp();

  const [gisViewMode, setGisViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'all'>('all');

  const activePromotionalAds = (promotionalAds || []).filter((a) => a.published);

  const activeUser = user || ensureCitizenSession();

  const followed = activeUser.followed || [];
  const normFollowed = followed.map((f) => f.replace(/^[a-z]{2}-/i, ''));
  const allC = posts.filter((p) => p.country === activeUser.country);
  const followPosts = allC.filter((p) => 
    followed.includes(p.dept) || 
    normFollowed.includes(p.dept) || 
    followed.includes(`${activeUser.country.toLowerCase()}-${p.dept}`) ||
    p.category === 'praise'
  );
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

  const display = base
    .filter((p) => matchesQuery(p, searchQuery))
    .filter((p) => matchesTrafficSignal(p, trafficSignalFilter))
    .filter(matchesCategory);

  const total = allC.length;
  const resolved = allC.filter((p) => p.status === 'resolved').length;
  const overdue = allC.filter((p) => p.escalated || p.status === 'overdue').length;
  const corruptCt = allC.filter((p) => p.category === 'corruption').length;
  const praiseCt = allC.filter((p) => p.category === 'praise').length;
  const topPraise = allC.find((p) => p.category === 'praise');

  return (
    <div className="animate-fade-in pb-24 text-slate-950 dark:text-white">
      {/* Feed Tabs Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-slate-300/80 dark:border-slate-800 flex bg-white/95 dark:bg-[#0a0e17]/95 shadow-xs transition-colors">
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
              className={`feed-tab flex-1 flex items-center justify-center gap-1.5 py-3 transition-all font-mono font-bold text-xs uppercase tracking-wider ${
                isOn 
                  ? 'on text-emerald-800 dark:text-emerald-300 border-b-2 border-emerald-600 bg-emerald-500/10' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Icon size={13} className={isOn ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'} />
              <span>{tabItem.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Action Navigation Chips */}
      <div className="px-4 py-2 bg-slate-100/90 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => go('ussd')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-[10px] font-mono font-bold hover:border-emerald-500 transition-all shadow-2xs shrink-0"
        >
          <PhoneCall size={12} className="text-emerald-600 dark:text-emerald-400" />
          <span>USSD *3030# Offline Simulator</span>
        </button>

        <button
          onClick={() => go('verify')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-[10px] font-mono font-bold hover:border-emerald-500 transition-all shadow-2xs shrink-0"
        >
          <CheckCircle2 size={12} className="text-indigo-600 dark:text-indigo-400" />
          <span>Verify SHA-256 Ledger</span>
        </button>

        <button
          onClick={() => setGisViewMode(gisViewMode === 'LIST' ? 'MAP' : 'LIST')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-mono font-bold transition-all shadow-2xs shrink-0 ${
            gisViewMode === 'MAP'
              ? 'bg-emerald-700 text-white border-emerald-800'
              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
          }`}
        >
          <Layers size={12} className={gisViewMode === 'MAP' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
          <span>{gisViewMode === 'MAP' ? 'Exit GIS Map' : 'GIS Signal Map'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="sw shadow-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl px-3 py-2 flex items-center gap-2">
          <Search size={14} className="text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchReports') || 'Search sovereign reports, parishes, ministries...'}
            className="text-xs text-slate-950 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 w-full bg-transparent focus:outline-none font-bold"
          />
        </div>
        {searchQuery && (
          <p className="text-[10px] mono text-slate-700 dark:text-slate-300 mt-1.5 flex items-center justify-between font-bold">
            <span>{display.length} match{display.length === 1 ? '' : 'es'} for &ldquo;{searchQuery}&rdquo;</span>
            <button onClick={() => setSearchQuery('')} className="text-emerald-700 dark:text-emerald-400 font-black hover:underline">
              Clear Filter
            </button>
          </p>
        )}
      </div>

      {/* Quick Category & Praise Filter Strip */}
      <div className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 rounded-lg text-[10px] mono font-bold whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-slate-400'
          }`}
        >
          All Topics ({total})
        </button>

        <button
          onClick={() => setSelectedCategory(selectedCategory === 'praise' ? 'all' : 'praise')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] mono font-black whitespace-nowrap transition-all border ${
            selectedCategory === 'praise'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-950'
          }`}
        >
          <Award size={12} className={selectedCategory === 'praise' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'} />
          <span>Praise & Commendation</span>
          {praiseCt > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
              selectedCategory === 'praise' ? 'bg-white/20 text-white' : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
            }`}>
              {praiseCt}
            </span>
          )}
        </button>

        {[
          { id: 'health', label: 'Health', icon: '🏥' },
          { id: 'water', label: 'Water', icon: '💧' },
          { id: 'power', label: 'Power', icon: '⚡' },
          { id: 'pothole', label: 'Roads', icon: '🚧' },
          { id: 'corruption', label: 'Anti-Graft', icon: '🛡️' },
        ].map((c) => {
          const count = allC.filter((p) => p.category === c.id).length;
          const isSel = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(isSel ? 'all' : (c.id as any))}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] mono font-bold whitespace-nowrap transition-all border ${
                isSel
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
              {count > 0 && <span className="opacity-60 text-[9px]">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Followed Department Horizontal Chips */}
      <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60 scrollbar-none transition-colors">
        <div className="flex gap-2 px-4 py-2.5 w-max">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-emerald-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all whitespace-nowrap active:scale-95 shadow-2xs group"
              >
                <span className="text-xs">{d.icon || '🏢'}</span>
                <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">{d.name}</span>
                {cnt > 0 && (
                  <span className="text-[8.5px] mono text-emerald-900 dark:text-emerald-300 font-black bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded-full border border-emerald-300 dark:border-emerald-700">
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => go('depts')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 border-dashed hover:border-slate-400 dark:hover:border-slate-600 transition-all whitespace-nowrap text-[10px] font-black text-slate-700 dark:text-slate-300"
          >
            + All Depts
          </button>
        </div>
      </div>

      {/* Metrics Counter HUD Bar - Broadsheet Ledger Strip */}
      <div className="grid grid-cols-4 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0c111c] transition-colors">
        {[
          [total, 'Dispatches', 'slate'],
          [resolved, 'Resolved', 'emerald'],
          [overdue, 'Overdue', 'rose'],
          [corruptCt, 'Graft Red', 'rose'],
        ].map(([v, l, c]) => (
          <div key={l as string} className="py-2.5 text-center border-r border-slate-200 dark:border-slate-800/80 last:border-0">
            <div
              className={`text-xs sm:text-sm font-black font-mono ${
                c === 'emerald'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : c === 'rose' && (v as number) > 0
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-slate-950 dark:text-white'
              }`}
            >
              {v}
            </div>
            <div className="text-[7.5px] font-mono text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      {/* Traffic Light Sovereign Signal Filter HUD */}
      <div className="px-4 pt-3 pb-1">
        <TrafficSignalHUD posts={allC} />
      </div>

      {/* Anti-Corruption Banner */}
      {corruptCt > 0 && feedTab === 'following' && (
        <div className="mx-4 mt-3 mb-1 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-3 shadow-2xs">
          <div className="text-rose-700 dark:text-rose-400 flex-shrink-0 mt-0.5">
            <AlertTriangle size={16} />
          </div>
          <div>
            <p className="text-[11px] text-rose-900 dark:text-rose-200 font-black">
              {corruptCt} anti-corruption report{corruptCt > 1 ? 's' : ''} on your followed jurisdiction walls
            </p>
            <p className="text-[9.5px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">
              Auto-referred to IGG · Sovereign Public Record · Cryptographically Sealed
            </p>
          </div>
        </div>
      )}

      {/* Civic Praise & Public Commendation Spotlight Banner */}
      {topPraise && selectedCategory !== 'corruption' && (
        <div className="mx-4 mt-3 mb-1 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-slate-900 border border-emerald-300 dark:border-emerald-700/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs mt-0.5">
              <Award size={18} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-mono">
                  Civic Honours Spotlight
                </span>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <Sparkles size={11} /> Merited Frontline Service
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-serif font-black text-slate-950 dark:text-white line-clamp-1">
                {topPraise.title}
              </h4>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                {topPraise.body}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'praise' ? 'all' : 'praise')}
              className="text-[10.5px] font-mono font-bold px-3 py-1.5 rounded-xl border border-emerald-400 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
            >
              {selectedCategory === 'praise' ? 'Show All Dispatches' : `All Praise (${praiseCt})`}
            </button>
            <button
              onClick={() => {
                setActivePost(topPraise);
                go('post_detail');
              }}
              className="text-[10.5px] font-mono font-black px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Inspect Ticket</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* GIS Signal Density Map (Rendered when toggled or on near_me tab) */}
      {(feedTab === 'near_me' || gisViewMode === 'MAP') && (
        <div className="p-4 space-y-3">
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
                    <PromotionalAdFeedCard ad={activePromotionalAds[0]} />
                  </div>
                )}
                {i === 4 && activePromotionalAds[1] && (
                  <div className="my-2 px-0 sm:px-3">
                    <PromotionalAdFeedCard ad={activePromotionalAds[1]} />
                  </div>
                )}
                {i === 7 && activePromotionalAds[2] && (
                  <div className="my-2 px-0 sm:px-3">
                    <PromotionalAdFeedCard ad={activePromotionalAds[2]} />
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
