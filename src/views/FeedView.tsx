import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Shield, Plus, Clock, AlertTriangle, Radio, TrendingUp, Users, MapPin, Sparkles } from 'lucide-react';
import { PostCardComponent } from '../components/PostCardComponent';
import { catByID, getDept, slaStatus } from '../utils/helpers';

export const FeedView: React.FC = () => {
  const {
    user,
    ensureCitizenSession,
    posts,
    feedTab,
    setFeedTab,
    searchQuery,
    setSearchQuery,
    go,
    setActiveDept,
    setActiveDeptCountry,
    setActivePost,
  } = useApp();

  const activeUser = user || ensureCitizenSession();

  const followed = activeUser.followed || [];
  const allC = posts.filter((p) => p.country === activeUser.country);
  const followPosts = allC.filter((p) => followed.includes(p.dept));
  const trendPosts = [...allC].sort((a, b) => b.upvotes - a.upvotes);

  const base = feedTab === 'following' ? followPosts : feedTab === 'trending' ? trendPosts : allC;

  const matchesQuery = (p: any, q: string) => {
    if (!q) return true;
    const t = q.toLowerCase();
    const d = getDept(p.country, p.dept);
    return [p.title, p.body, p.citizen_name, d.name, d.full, catByID(p.category).label]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(t));
  };

  const display = base.filter((p) => matchesQuery(p, searchQuery));

  const total = allC.length;
  const resolved = allC.filter((p) => p.status === 'resolved').length;
  const overdue = allC.filter((p) => p.escalated || p.status === 'overdue').length;
  const corruptCt = allC.filter((p) => p.category === 'corruption').length;

  return (
    <div className="animate-fade-in pb-20">
      {/* Feed Tabs Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/90 flex bg-white/90 dark:bg-slate-950/90 shadow-sm dark:shadow-md transition-colors">
        {[
          { id: 'following', label: 'Following', icon: Users },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'near_me', label: 'Near Me', icon: Radio },
        ].map((t) => {
          const Icon = t.icon;
          const isOn = feedTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setFeedTab(t.id as any)}
              className={`feed-tab flex-1 flex items-center justify-center gap-1.5 py-3 transition-all ${
                isOn ? 'on text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={13} className={isOn ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="sw shadow-sm">
          <Search size={14} className="text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports, departments, categories…"
            className="mono text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        </div>
        {searchQuery && (
          <p className="text-[9px] mono text-slate-500 dark:text-slate-400 mt-1.5 flex items-center justify-between">
            <span>{display.length} match{display.length === 1 ? '' : 'es'} for &ldquo;{searchQuery}&rdquo;</span>
            <button onClick={() => setSearchQuery('')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Clear Filter
            </button>
          </p>
        )}
      </div>

      {/* Followed Department Horizontal Chips */}
      <div className="overflow-x-auto border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 scrollbar-none transition-colors">
        <div className="flex gap-2 px-4 py-2.5 w-max">
          {followed.map((did) => {
            const d = getDept(activeUser.country, did);
            const cnt = posts.filter((p) => p.dept === did && p.country === activeUser.country).length;
            return (
              <button
                key={did}
                onClick={() => {
                  setActiveDept(did);
                  setActiveDeptCountry(activeUser.country);
                  go('dept_wall');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all whitespace-nowrap active:scale-95 shadow-sm group"
              >
                <span className="text-xs">{d.icon || '🏢'}</span>
                <span className="text-[9px] mono text-slate-700 dark:text-slate-300 font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">{d.name}</span>
                {cnt > 0 && (
                  <span className="text-[7.5px] mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                    {cnt}
                  </span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => go('depts')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-800 border-dashed hover:border-slate-400 dark:hover:border-slate-700 transition-all whitespace-nowrap text-[9px] mono text-slate-500 dark:text-slate-400"
          >
            + All Depts
          </button>
        </div>
      </div>

      {/* Metrics Counter HUD Bar */}
      <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-950/70 transition-colors">
        {[
          [total, 'Reports', 'slate'],
          [resolved, 'Resolved', 'emerald'],
          [overdue, 'Overdue', 'rose'],
          [corruptCt, 'Corruption', 'rose'],
        ].map(([v, l, c]) => (
          <div key={l as string} className="py-2 text-center border-r border-slate-200 dark:border-slate-800/60 last:border-0">
            <div
              className={`text-xs font-black mono ${
                c === 'emerald'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : c === 'rose' && (v as number) > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-800 dark:text-slate-300'
              }`}
            >
              {v}
            </div>
            <div className="text-[7px] mono text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      {/* Anti-Corruption Banner */}
      {corruptCt > 0 && feedTab === 'following' && (
        <div className="mx-4 mt-3 mb-1 corrupt-banner flex items-start gap-3">
          <div className="text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5">
            <AlertTriangle size={15} />
          </div>
          <div>
            <p className="text-[10px] mono text-rose-700 dark:text-rose-300 font-bold">
              {corruptCt} anti-corruption report{corruptCt > 1 ? 's' : ''} on your followed walls
            </p>
            <p className="text-[8.5px] mono text-slate-600 dark:text-slate-400 mt-0.5">
              Auto-referred to IGG · Sovereign Public Record · Immutable
            </p>
          </div>
        </div>
      )}

      {/* Feed Content */}
      {feedTab === 'near_me' ? (
        <div>
          {/* Map View */}
          <div className="map-bg mx-4 mt-3 mb-2" style={{ height: '220px' }}>
            <div className="map-grid"></div>
            {allC.map((p, i) => {
              const cat = catByID(p.category);
              const sla = slaStatus(p);
              const x = 12 + ((i * 41 + 17) % 76);
              const y = 12 + ((i * 31 + 11) % 76);
              return (
                <div
                  key={p.id}
                  className="map-pin group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => {
                    setActivePost(p);
                    go('post_detail');
                  }}
                  title={p.title}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 shadow-lg flex items-center justify-center ${sla.overdue ? 'a-dot' : ''}`}
                    style={{ background: `${cat.color}33`, borderColor: cat.color }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                  </div>
                </div>
              );
            })}
            <div className="absolute bottom-2.5 right-2.5 bg-white/95 dark:bg-slate-950/90 rounded-xl px-2.5 py-1 border border-slate-200 dark:border-slate-800 shadow-md">
              <span className="text-[8px] mono text-emerald-700 dark:text-emerald-400 font-bold">{allC.length} Geo-tagged Incidents</span>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-900/80">
            {allC.map((p) => (
              <PostCardComponent key={p.id} post={p} />
            ))}
          </div>
        </div>
      ) : (
        <div id="feed-list" className="divide-y divide-slate-100 dark:divide-slate-900/80">
          {display.length === 0 ? (
            <div className="text-center py-24 space-y-3 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-600 shadow-inner">
                <Shield size={24} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mono">No reports matching your filter criteria.</p>
              <button
                onClick={() => go('compose')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 rounded-xl text-xs font-black mono mt-2 active:scale-95 transition-all shadow-md"
              >
                <Plus size={14} /> File Sovereign Report
              </button>
            </div>
          ) : (
            display.map((p, i) => (
              <PostCardComponent key={p.id} post={p} rankIndex={feedTab === 'trending' ? i : null} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

