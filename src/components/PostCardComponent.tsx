import React, { useState } from 'react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';
import { catByID, getDept, pathStr, slaStatus, srcLabel, stripDecorativeEmojis } from '../utils/helpers';
import { MediaCard } from '../components/MediaCard';
import { QrCodeModal } from './QrCodeModal';
import { RichCivicText } from './RichCivicText';
import { DeptIcon } from './DeptIcon';
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
  QrCode,
  Bike,
  Layers,
  Users,
  Repeat2,
  Bookmark,
  Share2,
  FileCheck2,
  Play,
  Pause,
  Volume2,
  BarChart3,
  Eye,
  UserCheck,
  Gift,
} from 'lucide-react';
import { SignalGlyphRed, SignalGlyphAmber, SignalGlyphGreen } from './TrafficSignalHUD';
import { RewardModal } from './RewardModal';

interface PostCardComponentProps {
  post?: Post;
  p?: Post;
  rankIndex?: number | null;
}

export const PostCardComponent: React.FC<PostCardComponentProps> = ({ post: propPost, p: fallbackPost, rankIndex }) => {
  const post = propPost || fallbackPost;
  const {
    setActivePost,
    go,
    toast,
    upvotePost,
    downvotePost,
    user,
    supportsMap,
    downvotesMap,
    setPublicProfileCitizen,
    setSocialModalPost,
    setSocialModalTab,
    voteCivicPoll,
    bookmarks,
    toggleBookmark,
    setActiveHashtagFilter,
  } = useApp();
  const [showQr, setShowQr] = useState<boolean>(false);
  const [rewardOpen, setRewardOpen] = useState<boolean>(false);
  const [playingVoice, setPlayingVoice] = useState<boolean>(false);

  if (!post) return null;

  const isBookmarked = (bookmarks || []).includes(post.id);

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
  const compiledCount = post.compiled_count || (post.compiled_reports ? post.compiled_reports.length + 1 : 1);
  const isMasterDossier = Boolean(post.is_master_dossier || compiledCount > 1);

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
      className={`post-row px-4 py-4 cursor-pointer bg-white dark:bg-[#0e1116] hover:bg-[#f3f4f6] dark:hover:bg-[#161a22] transition-colors border-b border-[#e3e6ea] dark:border-[#262b36] relative group ${
        isPraise ? 'border-l-4 border-l-emerald-500' : ''
      }`}
    >
      {rankIndex !== null && rankIndex !== undefined && rankIndex < 3 && (
        <div className="float-right w-5 h-5 rounded-md bg-emerald-50 dark:bg-slate-900 border border-emerald-500/40 flex items-center justify-center -mt-1">
          <span className="text-[8px] mono font-black text-emerald-700 dark:text-emerald-400">{rankIndex + 1}</span>
        </div>
      )}

      {/* Illustrative Demo Showcase vs Live Citizen Dispatch Strip */}
      {post.is_demo ? (
        <div className="mb-2.5 p-2 rounded-lg bg-[#f8f9fa] dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Eye size={11} strokeWidth={1.75} className="text-slate-500 dark:text-slate-400 shrink-0" />
              <span>ILLUSTRATIVE DEMO · CIVICDUTY IMPACT SHOWCASE</span>
            </span>
            <span className="text-[8px] font-mono font-medium text-slate-500 dark:text-slate-400">
              System Demonstration Ticket
            </span>
          </div>
          {post.demo_highlight && (
            <div className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 leading-snug pt-1 border-t border-[#e3e6ea] dark:border-[#262b36]">
              {stripDecorativeEmojis(post.demo_highlight)}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-2 flex items-center justify-between gap-2 px-2.5 py-1 rounded-md bg-[#f8f9fa] dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36]">
          <span className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>LIVE CITIZEN DISPATCH · VERIFIED REAL TICKET</span>
          </span>
          <span className="text-[8px] font-mono font-medium text-slate-500 dark:text-slate-400">
            Active Public Ledger
          </span>
        </div>
      )}

      {/* Header Pill Strip & Dominant Traffic Light */}
      <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="p-1 rounded bg-slate-100 dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-300 flex items-center justify-center">
            <DeptIcon dept={d} size={12} />
          </span>
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
      <div className="text-[7.5px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 flex-wrap">
        <span className="text-emerald-700 dark:text-emerald-400">DISPATCH #{post.id.slice(-6).toUpperCase()}</span>
        <span>·</span>
        <span>{srcLabel(post.source)}</span>
        <span>·</span>
        <span>{post.country.toUpperCase()} RECORD</span>
        {isMasterDossier && (
          <>
            <span>·</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-black">
              <Layers size={9} /> MASTER DOSSIER ({compiledCount} COMPILED REPORTS)
            </span>
          </>
        )}
      </div>

      {/* Master Dossier Multi-Witness Compilation Strip */}
      {isMasterDossier && (
        <div className="mb-2 p-2 rounded-lg bg-slate-50 dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center shrink-0 font-mono text-[10px] font-black">
              {compiledCount}x
            </div>
            <div className="min-w-0">
              <div className="text-[9.5px] font-mono font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5 flex-wrap">
                <span>Compiled Multi-Witness Dossier</span>
                {compiledCount >= 5 && (
                  <span className="text-[8px] px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold uppercase">
                    5+ Witness Auto-Escalated
                  </span>
                )}
              </div>
              <p className="text-[9px] text-slate-600 dark:text-slate-400 truncate">
                 Consolidates {compiledCount} separate citizen reports (Web, USSD *3030# &amp; SMS) on this same issue
              </p>
            </div>
          </div>
          <span className="text-[8.5px] font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-[#0e1116] px-2 py-1 rounded-md border border-[#e3e6ea] dark:border-[#262b36] shrink-0">
            + Co-Sign Dossier →
          </span>
        </div>
      )}

      {/* Praise Merited Ribbon Banner */}
      {isPraise && (
        <div className="flex items-center gap-1.5 mb-2 text-[8.5px] mono text-emerald-900 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300/70 dark:border-emerald-800/50 px-2.5 py-1 rounded-md">
          <Award size={11} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold">Public Service Commendation · Merited Integrity Record</span>
        </div>
      )}

      {/* Broadsheet Headline & Body */}
      {post.author_profession && (
        <div className="mb-1.5 flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${
              post.author_profession.toLowerCase().includes('boda')
                ? 'bg-amber-100 text-amber-950 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700/80'
                : post.author_profession.toLowerCase().includes('taxi') || post.author_profession.toLowerCase().includes('driver')
                ? 'bg-blue-100 text-blue-950 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700/80'
                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {post.author_profession.toLowerCase().includes('boda') ? (
              <Bike size={11} strokeWidth={1.75} className="text-amber-600 dark:text-amber-400" />
            ) : (
              <UserCheck size={10} strokeWidth={1.75} className="text-slate-500 dark:text-slate-400" />
            )}
            <span>
              {post.author_profession.toLowerCase().includes('boda')
                ? 'Bodaboda Frontline Scout'
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

      <h4 className={`text-[14.5px] sm:text-[15.5px] font-semibold tracking-tight ${
        isPraise ? 'text-emerald-950 dark:text-emerald-100' : isCorrupt ? 'text-rose-700 dark:text-rose-200' : 'text-slate-950 dark:text-slate-100'
      } leading-snug mb-1.5 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors`}>
        {stripDecorativeEmojis(post.title)}
      </h4>
      <p className="text-[12.5px] text-slate-700 dark:text-slate-300 clamp2 leading-relaxed font-normal mb-2.5">
        <RichCivicText
          text={stripDecorativeEmojis(post.body)}
          onHashtagClick={(tag) => {
            setActiveHashtagFilter(tag);
            toast(`Filtering dispatches by ${tag}`, 'emerald');
          }}
          onMentionClick={(mention) => {
            setPublicProfileCitizen({
              name: mention,
              profession: 'Mentioned Civic Actor / Desk',
              country: post.country,
            });
          }}
        />
      </p>

      {/* Embedded Quote-Dispatch Card (Twitter/Threads Quote-Post equivalent) */}
      {post.quote_of && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            toast(`Quoted Dispatch #${post.quote_of?.id.slice(-6).toUpperCase()}`, 'emerald');
          }}
          className="mb-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/90 border-l-4 border-l-emerald-500 border border-slate-200 dark:border-slate-800 space-y-1"
        >
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
            <Repeat2 size={11} />
            <span>QUOTED DISPATCH · {post.quote_of.dept_name} · {post.quote_of.citizen_name}</span>
          </div>
          <div className="text-xs font-black text-slate-900 dark:text-white">{post.quote_of.title}</div>
          <p className="text-[10.5px] text-slate-600 dark:text-slate-400 line-clamp-2">{post.quote_of.snippet}</p>
        </div>
      )}

      {/* Vernacular Field Voice Note & Transcript Card */}
      {post.voice_note && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mb-2.5 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/70 space-y-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                setPlayingVoice(!playingVoice);
                if (!playingVoice) {
                  toast('Playing citizen field voice note with civic transcript...', 'emerald');
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {playingVoice ? <Pause size={11} /> : <Play size={11} />}
              <span>{playingVoice ? 'Playing Audio...' : `Play Voice (${post.voice_note.duration})`}</span>
            </button>
            <span className="text-[9px] font-mono font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
              <Volume2 size={11} />
              <span>{post.voice_note.language || 'Vernacular Field Audio'}</span>
            </span>
          </div>
          {post.voice_note.transcript && (
            <p className="text-[10.5px] italic text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
              {post.voice_note.transcript}
            </p>
          )}
        </div>
      )}

      {/* Before & After Interactive Photo Proof Preview */}
      {post.before_after && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mb-2.5 grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/25 border border-emerald-300/70 dark:border-emerald-800/60"
        >
          <div className="relative rounded-lg overflow-hidden h-24 border border-rose-300 dark:border-rose-800">
            <img src={post.before_after.before_url} alt="Before" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-rose-600/90 text-white text-[8px] font-mono font-bold">
              BEFORE: {post.before_after.before_label || 'Reported'}
            </span>
          </div>
          <div className="relative rounded-lg overflow-hidden h-24 border border-emerald-400 dark:border-emerald-700">
            <img src={post.before_after.after_url} alt="After" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[8px] font-mono font-bold">
              AFTER: {post.before_after.after_label || 'Resolved'}
            </span>
          </div>
        </div>
      )}

      {/* Media Attachment */}
      <MediaCard media={post.media} postId={post.id} onToast={(msg) => toast(msg)} />

      {/* Interactive Civic Poll (Twitter/X Poll equivalent for local referendums) */}
      {post.poll && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2.5 mb-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9.5px] font-mono font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <BarChart3 size={11} />
              <span>Public Civic Poll · {post.poll.total_votes.toLocaleString()} Votes</span>
            </span>
            {post.poll.ends_at && (
              <span className="text-[9px] font-mono text-slate-500">{post.poll.ends_at}</span>
            )}
          </div>
          <div className="text-xs font-black text-slate-900 dark:text-white">{post.poll.question}</div>
          <div className="space-y-1.5">
            {post.poll.options.map((opt) => {
              const pct = post.poll && post.poll.total_votes > 0
                ? Math.round((opt.votes / post.poll.total_votes) * 100)
                : 0;
              const isSelected = post.poll?.voted_option_id === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => voteCivicPoll(post.id, opt.id)}
                  className={`w-full text-left relative overflow-hidden rounded-xl border p-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-400'
                  }`}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-emerald-500/15 dark:bg-emerald-500/20 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                  <div className="relative flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>{opt.label}</span>
                      {isSelected && <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-black">
                      {pct}% ({opt.votes})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Verified Citizen Community Notes (X Community Notes equivalent) */}
      {post.community_notes && post.community_notes.length > 0 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2.5 mb-2 p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 space-y-1"
        >
          <div className="flex items-center justify-between text-[9px] font-mono font-black text-amber-900 dark:text-amber-300 uppercase">
            <span className="flex items-center gap-1">
              <FileCheck2 size={11} className="text-amber-600 dark:text-amber-400" />
              <span>Readers Added Context · Verified Community Note</span>
            </span>
            <span>{post.community_notes[0].author_name}</span>
          </div>
          <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug">
            {post.community_notes[0].body}
          </p>
        </div>
      )}

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
      <div className="flex items-center justify-between text-[9px] mono text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-900/80 flex-wrap gap-y-1.5">
        <span className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">{srcLabel(post.source)}</span>
          <span>·</span>
          {post.anonymous || isCorrupt ? (
            <span className="text-slate-600 dark:text-slate-400 font-medium inline-flex items-center gap-1">
              <Lock size={9} strokeWidth={1.75} />
              <span>Protected Anonymous Citizen</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPublicProfileCitizen({
                  name: post.citizen_name,
                  profession: post.author_profession || `${post.citizen_rank || 'Verified'} Watchdog`,
                  country: post.country,
                });
              }}
              className="text-slate-800 dark:text-slate-200 font-bold hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline cursor-pointer"
              title="Inspect Watchdog Profile, Follow, or Send Direct Message"
            >
              {post.citizen_name}
            </button>
          )}
        </span>
        <span className="flex items-center gap-1.5 flex-wrap">
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
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition cursor-pointer ${
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
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded transition cursor-pointer ${
              isUserDownvoted
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black'
                : 'text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold'
            }`}
            title="Signal dispute / unpopular (Statutory SLA escalation is never affected)"
          >
            <ArrowDown size={11} /> {post.downvotes || 0}
          </button>

          {/* Quote-Dispatch / Repost Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSocialModalTab('quote');
              setSocialModalPost(post);
            }}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition font-bold cursor-pointer"
            title="Quote-Dispatch or Repost with Commentary"
          >
            <Repeat2 size={11} /> {post.reposts || 0}
          </button>

          {/* Add Community Note Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSocialModalTab('community_note');
              setSocialModalPost(post);
            }}
            className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
            title="Attach Citizen Fact-Check / Community Note (+15 XP)"
          >
            <FileCheck2 size={11} />
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(post.id);
            }}
            className={`p-1 rounded transition cursor-pointer ${
              isBookmarked
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                : 'text-slate-400 hover:text-amber-500'
            }`}
            title={isBookmarked ? 'Saved in Bookmarks' : 'Bookmark Dispatch'}
          >
            <Bookmark size={11} />
          </button>

          {/* Share & Safety Modal Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSocialModalTab('share');
              setSocialModalPost(post);
            }}
            className="p-1 rounded text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer"
            title="Share Permalink, Cross-Post to WhatsApp/X, or Mute/Report"
          >
            <Share2 size={11} />
          </button>

          {/* Direct Individual Vault Peer Reward Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRewardOpen(true);
            }}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/70 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition font-bold cursor-pointer"
            title="Reward Author from your Individual Citizen Vault"
          >
            <Gift size={10} />
            <span>Reward</span>
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

      {/* Individual Citizen Vault Peer Reward Modal */}
      {rewardOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <RewardModal
            isOpen={rewardOpen}
            onClose={() => setRewardOpen(false)}
            targetCitizenName={post.anonymous ? 'Verified Citizen' : post.citizen_name}
            postId={post.id}
            contextTitle={post.title}
          />
        </div>
      )}
    </article>
  );
};

