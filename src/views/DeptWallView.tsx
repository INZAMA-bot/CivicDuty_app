import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDept } from '../utils/helpers';
import { ChevronLeft, User, Plus, Gift, Zap } from 'lucide-react';
import { AccountabilityDocket } from '../components/AccountabilityDocket';
import { PostCardComponent } from '../components/PostCardComponent';
import { RewardModal } from '../components/RewardModal';

export const DeptWallView: React.FC = () => {
  const {
    user,
    activeDept,
    activeDeptCountry,
    posts,
    projects,
    wallTab,
    setWallTab,
    go,
    setActiveProject,
  } = useApp();

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<{ name: string; postId?: string }>({
    name: 'Inzama Robin',
  });

  const country = activeDeptCountry || user?.country || 'UG';
  const did = activeDept || 'kcca';
  const d = getDept(country, did);

  const deptPosts = posts.filter((p) => p.dept === did && p.country === country);
  const resolved = deptPosts.filter((p) => p.status === 'resolved').length;
  const live = deptPosts.filter((p) => p.status !== 'resolved').length;
  const resPct = deptPosts.length > 0 ? Math.round((resolved / deptPosts.length) * 100) : 0;
  const isConsumer = d.lane === 'consumer';

  const deptProjects = projects.filter((p) => p.dept === did);

  return (
    <div className="animate-fade-in">
      <div className="px-4 pt-4 pb-0">
        <button
          onClick={() => go('feed')}
          className="flex items-center gap-1 text-[10px] mono text-slate-400 hover:text-teal-400 mb-3.5 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-2xl flex-shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
            {d.icon || '🏢'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-[19px] font-black text-slate-100">{d.name}</h2>
              {isConsumer ? <span className="chip ch-private">Verified Private</span> : <span className="chip ch-gov">Verified Gov</span>}
            </div>
            <p className="text-[11px] mono text-slate-400">{d.full}</p>
            {d.ministry && <p className="text-[9px] mono text-slate-500 mt-0.5">{d.ministry}</p>}
          </div>
        </div>

        {/* Accountability Docket */}
        <AccountabilityDocket
          leftLabel={`${deptPosts.length} total posts`}
          leftSubLabel={`${d.sla || 48}HR TARGET`}
          centerVal={live}
          centerLabel="LIVE"
          rightLabel={`${resPct}% resolved`}
          rightSubLabel={`${resolved} closed`}
          high={resPct >= 70}
        />
      </div>

      {/* Tabs */}
      <div className="border-t border-b border-slate-800/80 flex mt-4 bg-slate-950/80">
        {[
          { id: 'posts', label: 'Posts' },
          { id: 'announcements', label: 'Announcements' },
          { id: 'projects', label: 'Projects' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setWallTab(t.id as any)}
            className={`feed-tab flex-1 ${wallTab === t.id ? 'on' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {wallTab === 'posts' ? (
        <div>
          <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-950/40">
            <button
              onClick={() => go('compose')}
              className="w-full flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3.5 hover:border-teal-500/50 transition-all active:scale-[.99] shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
                <User size={15} />
              </div>
              <span className="text-[13px] text-slate-400 flex-1 text-left">Post to {d.name} wall...</span>
              <span className="text-[8px] mono text-teal-400 font-bold flex items-center gap-1 bg-teal-500/10 px-2 py-1 rounded-lg border border-teal-500/30">
                <Plus size={12} /> REPORT
              </span>
            </button>
          </div>

          <div className="px-4 py-3 border-b border-slate-800 bg-amber-500/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <Gift size={15} />
              </span>
              <span className="text-[11px] mono text-slate-300">
                Reward citizens who engage on <strong className="text-amber-200">{d.name}</strong> wall
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedCitizen({
                  name: deptPosts[0]?.citizen_name || 'Inzama Robin',
                  postId: deptPosts[0]?.id,
                });
                setRewardModalOpen(true);
              }}
              className="text-[9.5px] mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
            >
              <Zap size={11} /> Reward Citizen
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {deptPosts.length === 0 ? (
              <div className="text-center py-20 text-xs text-slate-500 mono">No posts on this wall yet.</div>
            ) : (
              deptPosts.map((p) => (
                <div key={p.id} className="relative group">
                  <PostCardComponent post={p} />
                  <div className="px-4 pb-3 -mt-1 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCitizen({
                          name: p.citizen_name || 'Verified Citizen',
                          postId: p.id,
                        });
                        setRewardModalOpen(true);
                      }}
                      className="text-[8.5px] mono font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all"
                    >
                      <Gift size={10} /> Reward {p.citizen_name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : wallTab === 'announcements' ? (
        <div className="p-4 space-y-3">
          <div className="card p-4 space-y-2.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="chip ch-budget">Official Announcement</span>
              <span className="text-[8px] mono text-zinc-600">3 days ago</span>
            </div>
            <p className="text-sm font-bold text-zinc-200">{d.name} — January Service Bulletin</p>
            <p className="text-[12px] text-zinc-500 leading-relaxed">
              Recent issue review complete. Active inspection crews dispatched. Infrastructure budget released for primary road repairs.
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-900 text-[8px] mono text-zinc-600">
              <span>Signed: {d.name} Spokesperson</span>
              <span className="chip ch-gov" style={{ fontSize: '7px' }}>
                ✓ Verified Official
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <p className="text-[9px] mono text-zinc-500 uppercase tracking-widest">Active Public Projects</p>
          {deptProjects.length === 0 ? (
            <div className="card p-4 text-center">
              <p className="text-xs mono text-zinc-600">No active public works listed for this entity.</p>
            </div>
          ) : (
            deptProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveProject(proj);
                  go('project');
                }}
                className="card p-4 space-y-2.5 cursor-pointer hover:border-amber-500/30 transition-colors"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[13px] font-bold text-zinc-200">{proj.title}</span>
                  <span className="chip ch-invest">{proj.status}</span>
                </div>
                <div className="flex justify-between text-[8px] mono text-zinc-600 mb-1">
                  <span>Contractor: {proj.contractor}</span>
                  <span>{proj.value}</span>
                </div>
                <div className="text-[8px] mono text-zinc-600 mt-1">Completion: {proj.completes}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reward Citizen Modal */}
      <RewardModal
        isOpen={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        targetCitizenName={selectedCitizen.name}
        postId={selectedCitizen.postId}
        entityName={user?.dept_label || d.name}
        contextTitle={`${d.name} Public Wall`}
      />
    </div>
  );
};
