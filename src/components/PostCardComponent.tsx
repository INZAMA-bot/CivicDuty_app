import React, { useState } from 'react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';
import { catByID, getDept, pathStr, slaStatus, srcLabel } from '../utils/helpers';
import { MediaCard } from '../components/MediaCard';
import { QrCodeModal } from './QrCodeModal';
import {
  Shield,
  Clock,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  AlertTriangle,
  Lock,
  MapPin,
  CheckCircle2,
  Award,
  Sparkles,
  QrCode,
  Bike
} from 'lucide-react';
import { SignalGlyphRed, SignalGlyphAmber, SignalGlyphGreen } from './TrafficSignalHUD';

interface PostCardComponentProps {
  post: Post;
  rankIndex?: number | null;
}

export const PostCardComponent: React.FC<PostCardComponentProps> = ({ post, rankIndex }) => {
  const { setActivePost, go, toast, upvotePost, downvotePost, user, supportsMap, downvotesMap } = useApp();
  const [showQr, setShowQr] = useState<boolean>(false);

  const d = getDept(post.country, post.dept);
  const sla = slaStatus(post);
  const cat = catByID(post.category);
  const isCorrupt = post.category === 'corruption';
  const isPraise = post.category === 'praise';
  const isConsumer = post.lane === 'consumer';

  const isUserSupported = user ? !!supportsMap[user.id]?.[post.id] : false;
  const isUserDownvoted = user ? !!downvotesMap[user.id]?.[post.id] : false;

  const totalVotes = (post.upvotes || 0) + (post.downvotes || 0);
  const upRatio = totalVotes > 0 ? Math.round(((post.upvotes || 0) / totalVotes) * 100) : 100;

  const isRed = isCorrupt || post.status === 'pending' || post.status === 'overdue' || post.escalated;
  const isGreen = post.status === 'resolved' || post.citizen_satisfied === true || isPraise;
  const isAmber = !isRed && !isGreen;

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
    return (
      <div className="flex items-center gap-2">
        <div 
          className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs" 
          title={isGreen ? 'Signal 3: Green (Resolved & Verified / Commended)' : isAmber ? 'Signal 2: Amber (In Progress)' : 'Signal 1: Red (Citizen Speaks / Open)'}
        >
          <SignalGlyphRed active={isRed} className="w-3.5 h-3.5" />
          <SignalGlyphAmber active={isAmber} className="w-3.5 h-3.5" />
          <SignalGlyphGreen active={isGreen} className="w-3.5 h-3.5" />
        </div>
        <span className={`chip ${isPraise ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700' : (m[s] || 'ch-pending')} font-bold flex items-center gap-1`}>
          {isGreen ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shadow-[0_0_5px_#10b981]" />
          ) : isAmber ? (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shadow-[0_0_5px_#f59e0b]" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block shadow-[0_0_5px_#ef4444]" />
          )}
          <span>{isPraise ? 'Commended' : (l[s] || s)}</span>
        </span>
      </div>
    );
  };

  return (
    <article
      onClick={() => {
        setActivePost(post);
        go('post_detail');
      }}
      className={`post-row px-4 py-4 cursor-pointer bg-white dark:bg-[#0f141f] hover:bg-[#fcfaf6] dark:hover:bg-slate-900/80 transition-all border-b border-slate-200/90 dark:border-slate-800/80 relative group ${
        isPraise ? 'border-l-4 border-l-emerald-500' : ''
      }`}
    >
      {rankIndex !== null && rankIndex !== undefined && rankIndex < 3 && (
        <div className="float-right w-5 h-5 rounded-full bg-emerald-50 dark:bg-slate-950 border border-emerald-500/40 shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.25)] flex items-center justify-center -mt-1">
          <span className="text-[8px] mono font-black text-emerald-700 dark:text-emerald-400">{rankIndex + 1}</span>
        </div>
      )}

      {/* Header Pill Strip & Dominant Traffic Light */}
      <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {d.icon && <span className="text-xs p-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">{d.icon}</span>}
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{d.name}</span>
          {isPraise ? (
            <span className="chip flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 font-black">
              <Award size={9} className="text-emerald-600 dark:text-emerald-400" /> Praise & Commendation
            </span>
          ) : isCorrupt ? (
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

      {/* Dispatch Dateline */}
      <div className="text-[7.5px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
        <span className="text-emerald-700 dark:text-emerald-400">DISPATCH #{post.id.slice(-6).toUpperCase()}</span>
        <span>·</span>
        <span>{srcLabel(post.source)}</span>
        <span>·</span>
        <span>{post.country.toUpperCase()} RECORD</span>
      </div>

      {/* Praise Merited Ribbon Banner */}
      {isPraise && (
        <div className="flex items-center gap-1.5 mb-2 text-[8.5px] mono text-emerald-900 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 px-2.5 py-1 rounded-lg">
          <Sparkles size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold">Public Service Commendation · Merited Integrity Record</span>
        </div>
      )}

      {/* Broadsheet Headline & Body */}
      {post.author_profession && (
        <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
              post.author_profession.toLowerCase().includes('boda')
                ? 'bg-amber-100 text-amber-950 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80 shadow-2xs'
                : post.author_profession.toLowerCase().includes('taxi') || post.author_profession.toLowerCase().includes('driver')
                ? 'bg-blue-100 text-blue-950 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700/80'
                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {post.author_profession.toLowerCase().includes('boda') ? (
              <Bike size={11} className="text-amber-600 dark:text-amber-400" />
            ) : (
              <Sparkles size={10} className="text-slate-400" />
            )}
            <span>
              {post.author_profession.toLowerCase().includes('boda')
                ? '🛵 Bodaboda Frontline Scout'
                : post.author_profession}
            </span>
          </span>

          {totalVotes > 3 && (
            <span
              className={`text-[8.5px] px-1.5 py-0.5 rounded-full font-bold ${
                upRatio >= 75
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
              }`}
            >
              {upRatio}% Consensus
            </span>
          )}
        </div>
      )}

      <h4 className={`text-[14.5px] sm:text-base font-serif font-black ${
        isPraise ? 'text-emerald-950 dark:text-emerald-100' : isCorrupt ? 'text-rose-700 dark:text-rose-200' : 'text-slate-950 dark:text-slate-100'
      } leading-snug mb-1.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors`}>
        {post.title}
      </h4>
      <p className="text-[12px] text-slate-700 dark:text-slate-300 clamp2 leading-relaxed font-normal mb-2.5">{post.body}</p>

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
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {post.anonymous || isCorrupt ? '🔒 Protected Anonymous Citizen' : post.citizen_name}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className={`flex items-center gap-1 font-bold ${sla.overdue ? 'a-sla' : ''}`} style={{ color: isPraise ? '#10b981' : sla.color }}>
            <Clock size={11} /> {isPraise ? 'COMMENDED' : sla.overdue ? 'OVERDUE' : sla.label}
          </span>
          <span>·</span>

          {/* Upvote Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              upvotePost(post.id);
            }}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition ${
              isUserSupported
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black'
                : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold'
            }`}
            title="Support / Corroborate this report"
          >
            <ArrowUp size={11} /> {post.upvotes}
          </button>

          {/* Downvote Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              downvotePost(post.id);
            }}
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition ${
              isUserDownvoted
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black'
                : 'text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold'
            }`}
            title="Signal dispute / unpopluar (Statutory SLA escalation is never affected)"
          >
            <ArrowDown size={11} /> {post.downvotes || 0}
          </button>

          {/* QR Code Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQr(true);
            }}
            className="p-1 rounded text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
            title="Scan & Verify Official QR Docket"
          >
            <QrCode size={12} />
          </button>

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

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={showQr}
        onClose={() => setShowQr(false)}
        type="ticket"
        post={post}
      />
    </article>
  );
};

