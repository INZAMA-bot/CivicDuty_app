import React from 'react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';
import { catByID, getDept, pathStr, slaStatus, srcLabel } from '../utils/helpers';
import { MediaCard } from '../components/MediaCard';
import { Shield, Clock, ArrowUp, MessageSquare, AlertTriangle, Lock, MapPin, CheckCircle2 } from 'lucide-react';

interface PostCardComponentProps {
  post: Post;
  rankIndex?: number | null;
}

export const PostCardComponent: React.FC<PostCardComponentProps> = ({ post, rankIndex }) => {
  const { setActivePost, go, toast } = useApp();

  const d = getDept(post.country, post.dept);
  const sla = slaStatus(post);
  const cat = catByID(post.category);
  const isCorrupt = post.category === 'corruption';
  const isConsumer = post.lane === 'consumer';

  const statusChip = (s: string) => {
    const m: Record<string, string> = {
      pending: 'ch-pending',
      received: 'ch-received',
      investigating: 'ch-invest',
      budget: 'ch-budget',
      resolved: 'ch-resolved',
      overdue: 'ch-overdue',
      cannot: 'ch-cannot',
    };
    const l: Record<string, string> = {
      pending: 'Pending',
      received: 'Received',
      investigating: 'Investigating',
      budget: 'Budget Alloc.',
      resolved: 'Resolved',
      overdue: 'Overdue',
      cannot: 'Cannot Fix',
    };
    return <span className={`chip ${m[s] || 'ch-pending'}`}>{l[s] || s}</span>;
  };

  return (
    <div
      onClick={() => {
        setActivePost(post);
        go('post_detail');
      }}
      className="post-row px-4 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all border-b border-slate-200 dark:border-slate-800/70 relative group"
    >
      {rankIndex !== null && rankIndex !== undefined && rankIndex < 3 && (
        <div className="float-right w-5 h-5 rounded-full bg-emerald-50 dark:bg-slate-950 border border-emerald-500/40 shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.25)] flex items-center justify-center -mt-1">
          <span className="text-[8px] mono font-black text-emerald-700 dark:text-emerald-400">{rankIndex + 1}</span>
        </div>
      )}

      {/* Header Pill Strip */}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {d.icon && <span className="text-sm p-1 rounded-md bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">{d.icon}</span>}
          <span className="text-[10.5px] mono font-bold text-slate-800 dark:text-slate-200">{d.name}</span>
          {isCorrupt ? (
            <span className="chip ch-corrupt flex items-center gap-1">
              <Lock size={9} /> Anti-Corruption
            </span>
          ) : isConsumer ? (
            <span className="chip ch-private">Verified Private</span>
          ) : (
            <span className="chip ch-gov">Verified Gov</span>
          )}
        </div>
        {statusChip(post.gov_status || post.status)}
      </div>

      {/* Ticket Title & Body */}
      <h4 className={`text-[13.5px] font-bold ${isCorrupt ? 'text-rose-700 dark:text-rose-200' : 'text-slate-900 dark:text-slate-100'} leading-snug mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors`}>
        {post.title}
      </h4>
      <p className="text-[11.5px] text-slate-600 dark:text-slate-400 clamp2 leading-relaxed font-normal mb-2">{post.body}</p>

      {/* Media Attachment */}
      <MediaCard media={post.media} postId={post.id} onToast={(msg) => toast(msg)} />

      {/* Geo Territory Breadcrumb */}
      <div className="path-crumb mt-2.5 mb-2 text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <MapPin size={10} className="text-slate-400 dark:text-slate-600 flex-shrink-0" />
        <span className="truncate">{pathStr(post.country, post.territory)}</span>
      </div>

      {isCorrupt && (
        <div className="flex items-center gap-1.5 mb-2 text-[8.5px] mono text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/30 px-2 py-1 rounded-lg">
          <AlertTriangle size={11} className="flex-shrink-0" />
          <span>Auto-referred to Inspectorate of Government (IGG)</span>
        </div>
      )}

      {/* Ticket Footer HUD */}
      <div className="flex items-center justify-between text-[9px] mono text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-900/80">
        <span className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">{srcLabel(post.source)}</span>
          <span>·</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium">{post.citizen_name}</span>
        </span>
        <span className="flex items-center gap-2.5">
          <span className={`flex items-center gap-1 font-bold ${sla.overdue ? 'a-sla' : ''}`} style={{ color: sla.color }}>
            <Clock size={11} /> {sla.overdue ? 'OVERDUE' : sla.label}
          </span>
          <span>·</span>
          <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <ArrowUp size={11} /> {post.upvotes}
          </span>
          {post.comments && post.comments.length > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-bold">
                <MessageSquare size={11} /> {post.comments.length}
              </span>
            </>
          )}
        </span>
      </div>

      {post.escalated && (
        <div className="mt-2 flex items-center gap-1 text-[8px] mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-500/20">
          <AlertTriangle size={10} /> Auto-escalated up sovereign chain
        </div>
      )}

      {post.upvotes >= 100 && (
        <div className="mt-1.5 text-[8px] mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
          <CheckCircle2 size={10} /> Sovereign Citizen Pinned — {post.upvotes} verified supporters
        </div>
      )}
    </div>
  );
};

