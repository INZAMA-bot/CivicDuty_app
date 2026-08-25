import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { catByID, escalationFor, getDept, pathStr, slaStatus, srcLabel, timeAgo } from '../utils/helpers';
import {
  ChevronLeft,
  Lock,
  AlertTriangle,
  ArrowUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Upload,
  Mic,
  MapPin,
  EyeOff,
  Eye,
  X,
  FileText,
  CheckCircle2,
  Info,
  Gift,
  Zap,
} from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { MediaItem } from '../types';
import { RewardModal } from '../components/RewardModal';
import { TicketAuditTimeline } from '../components/TicketAuditTimeline';

export const PostDetailView: React.FC = () => {
  const {
    user,
    activePost,
    go,
    prevView,
    upvotePost,
    supportsMap,
    rateReply,
    markPostSatisfied,
    addCommentToPost,
    toast,
  } = useApp();

  const [citizenReplyText, setCitizenReplyText] = useState('');
  const [stagedMedia, setStagedMedia] = useState<MediaItem[]>([]);
  const [replyAnon, setReplyAnon] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [locationMode, setLocationMode] = useState<'parish' | 'gps' | 'none'>('parish');
  const [acquiredGps, setAcquiredGps] = useState<{ lat: string; lng: string } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('Not acquired');

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [selectedRewardTarget, setSelectedRewardTarget] = useState<{
    name: string;
    phone?: string;
    commentId?: string;
  }>({ name: '', phone: '' });

  if (!activePost) {
    go(prevView || 'feed');
    return null;
  }

  const p = activePost;
  const d = getDept(p.country, p.dept);
  const sla = slaStatus(p);
  const cat = catByID(p.category);
  const isConsumer = p.lane === 'consumer';
  const isCorrupt = p.category === 'corruption';
  const isGov = user && ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(user.role);
  const isReadOnly = user?.role === 'read_only';
  const isSupported = user ? !!supportsMap[user.id]?.[p.id] : false;

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

  const hrsElapsed = (Date.now() - new Date(p.created_at).getTime()) / 3600000;
  const chain = p.country === 'UG' ? escalationFor(p.country, p.territory?.parish || p.territory?.subcounty) : [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems: MediaItem[] = [];

    Array.from(files).forEach((f: File) => {
      let type: 'image' | 'video' | 'doc' = 'image';
      if (f.type.startsWith('video/')) type = 'video';
      else if (f.type.includes('pdf') || f.name.endsWith('.pdf') || f.name.endsWith('.doc')) type = 'doc';

      const sizeStr = (f.size / (1024 * 1024)).toFixed(1) + ' MB';
      const url = URL.createObjectURL(f);
      newItems.push({
        type,
        url,
        name: f.name,
        size: sizeStr,
      });
    });

    setStagedMedia((prev) => [...prev, ...newItems]);
    toast(`${newItems.length} evidence file(s) attached to reply`, 'emerald');
  };

  const handleSimulateVoiceNote = () => {
    setIsRecordingVoice(true);
    setTimeout(() => {
      setIsRecordingVoice(false);
      const voiceItem: MediaItem = {
        type: 'voice',
        url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
        duration: '0:24',
        name: 'Voice Note Reply (0:24)',
        waveform: [20, 45, 80, 60, 30, 90, 75, 40, 60, 85, 30, 50, 70, 90, 40, 20],
      };
      setStagedMedia((prev) => [...prev, voiceItem]);
      toast('Voice note recorded and attached to reply', 'emerald');
    }, 1500);
  };

  const handleAcquireGps = () => {
    setGpsStatus('Acquiring GPS...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setAcquiredGps({ lat, lng });
          setGpsStatus(`GPS Verified: ${lat}, ${lng}`);
          setLocationMode('gps');
          toast('Device GPS coordinates attached', 'emerald');
        },
        () => {
          const mockLat = (2.774 + Math.random() * 0.01).toFixed(4);
          const mockLng = (32.299 + Math.random() * 0.01).toFixed(4);
          setAcquiredGps({ lat: mockLat, lng: mockLng });
          setGpsStatus(`GPS Verified: ${mockLat}, ${mockLng}`);
          setLocationMode('gps');
          toast('GPS coordinates attached', 'emerald');
        }
      );
    } else {
      const mockLat = '2.7747';
      const mockLng = '32.2990';
      setAcquiredGps({ lat: mockLat, lng: mockLng });
      setGpsStatus(`GPS Verified: ${mockLat}, ${mockLng}`);
      setLocationMode('gps');
      toast('GPS coordinates attached', 'emerald');
    }
  };

  const handlePostCitizenComment = () => {
    if (!citizenReplyText.trim() && stagedMedia.length === 0) {
      toast('Provide a reply message or attach evidence', 'red');
      return;
    }
    if (!user || user.role !== 'citizen') {
      toast('Sign in as a citizen to reply', 'amber');
      return;
    }

    const senderName = replyAnon ? 'Verified Citizen (Anonymous)' : user.name || 'Citizen';

    let locTag = '';
    if (locationMode === 'parish') {
      locTag = p.location || pathStr(p.territory, p.country);
    } else if (locationMode === 'gps' && acquiredGps) {
      locTag = `GPS Pin (${acquiredGps.lat}, ${acquiredGps.lng})`;
    }

    const commentObj = {
      id: 'cc-' + Date.now(),
      sender: senderName,
      role: 'citizen' as const,
      body: citizenReplyText.trim() || '(Attached media evidence reply)',
      media: stagedMedia.length > 0 ? stagedMedia : undefined,
      created_at: new Date().toISOString(),
      helpful: 0,
      not_helpful: 0,
      anonymous: replyAnon,
      location_badge: locTag || undefined,
      gps: locationMode === 'gps' ? acquiredGps : null,
    };

    addCommentToPost(p.id, commentObj);
    setCitizenReplyText('');
    setStagedMedia([]);
    setReplyAnon(false);
    setLocationMode('parish');
    toast('Rich reply posted to public wall', 'emerald');
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Top Header */}
      <div className="px-4 pt-4 pb-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 transition-colors">
        <button
          onClick={() => go(prevView || 'feed')}
          className="flex items-center gap-1 text-[10px] mono text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-teal-400 mb-3.5 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {d.icon && <span className="text-base">{d.icon}</span>}
          <span className="text-[10px] mono font-bold text-slate-800 dark:text-slate-300">{d.name}</span>
          {isCorrupt ? (
            <span className="chip ch-corrupt flex items-center gap-0.5">
              <Lock size={10} /> Anti-Corruption
            </span>
          ) : isConsumer ? (
            <span className="chip ch-private">Verified Private</span>
          ) : (
            <span className="chip ch-gov">Verified Gov</span>
          )}
          {p.escalated && (
            <span className="chip ch-overdue a-sla flex items-center gap-0.5">
              <AlertTriangle size={10} /> Escalated
            </span>
          )}
        </div>
      </div>

      {/* Anti-Corruption Banner */}
      {isCorrupt && (
        <div className="mx-4 mt-3.5 corrupt-banner space-y-1">
          <div className="flex items-center gap-2">
            <div className="text-rose-600 dark:text-rose-400 flex-shrink-0">
              <Lock size={16} />
            </div>
            <p className="text-[10px] mono text-rose-700 dark:text-rose-300 font-bold">
              Anti-Corruption Report — Referred to Inspectorate of Government
            </p>
          </div>
          <p className="text-[9px] mono text-slate-600 dark:text-slate-400 leading-relaxed">
            Permanent public record. Anonymous identity protected — revealed only by court order.
          </p>
        </div>
      )}

      {/* Main Content Body */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800/80 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-[17px] font-black ${isCorrupt ? 'text-rose-700 dark:text-rose-200' : 'text-slate-900 dark:text-slate-100'} leading-snug flex-1`}>
            {p.title}
          </h3>
          {statusChip(p.gov_status || p.status)}
        </div>

        <p className="text-[14px] text-slate-700 dark:text-slate-200 leading-relaxed">{p.body}</p>

        {/* Media Player Grid / Video / Audio / Docs */}
        <MediaCard media={p.media} postId={p.id} onToast={(msg) => toast(msg)} />

        {/* Metadata Grid */}
        <div className="card p-3.5 grid grid-cols-2 gap-3 text-[9px] mono border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Category</span>
            <span style={{ color: cat.color }}>{cat.label}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Territory</span>
            <span className="text-slate-700 dark:text-slate-300">{pathStr(p.country, p.territory)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Source</span>
            <span className="text-slate-700 dark:text-slate-300">{srcLabel(p.source)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Filed</span>
            <span className="text-slate-700 dark:text-slate-300">{timeAgo(p.created_at)}</span>
          </div>
          {p.gps && (
            <div className="col-span-2">
              <span className="text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">GPS Coordinates</span>
              <span className="text-teal-600 dark:text-teal-400">
                {p.gps.lat}, {p.gps.lng}
              </span>
            </div>
          )}
        </div>

        {/* Response Timer Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] mono">
            <span className="text-slate-500 dark:text-slate-400">{d.sla || 48}h Response Target</span>
            <span className={sla.overdue ? 'a-sla' : ''} style={{ color: sla.color }}>
              {sla.label === 'Closed' ? '✓ Closed' : sla.overdue ? `⚠ OVERDUE · ${sla.fmt}` : sla.fmt}
            </span>
          </div>
          <div className="w-full h-1 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
            <div className="sla-fill" style={{ width: `${sla.pct}%`, background: sla.color }}></div>
          </div>
        </div>

        {/* 5-Stage Sovereign Audit Timeline */}
        <TicketAuditTimeline post={p} />

        {/* Escalation Chain Tree */}
        {p.country === 'UG' && chain.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <p className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 font-bold">Escalation Chain</p>
            {chain.map((step, i) => {
              const breached = hrsElapsed >= step.sla;
              const isActive = !breached && (i === 0 || hrsElapsed >= chain[i - 1].sla);
              const cls = p.status === 'resolved' ? 'esc-active' : breached ? 'esc-breached' : isActive ? 'esc-active' : 'esc-pending';
              const dot = p.status === 'resolved' ? '#059669' : breached ? '#f43f5e' : isActive ? '#059669' : '#94a3b8';
              return (
                <div key={i} className={`esc-step ${cls} a-esc`} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: dot }}></div>
                  <div className="flex-1">
                    <span
                      className={`text-[9.5px] mono font-bold ${
                        breached && p.status !== 'resolved'
                          ? 'text-rose-600 dark:text-rose-400'
                          : isActive
                          ? 'text-emerald-700 dark:text-teal-300'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="text-[8px] mono text-slate-500 ml-2">
                      L{step.depth} · {step.sla}hr
                    </span>
                  </div>
                  {breached && p.status !== 'resolved' ? (
                    <span className="chip ch-overdue">Breached</span>
                  ) : isActive ? (
                    <span className="chip ch-resolved">Active</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {/* Support Action Bar */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => upvotePost(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all mono active:scale-95 ${
                isSupported
                  ? 'bg-teal-500/20 border border-teal-500/50 text-teal-700 dark:text-teal-300 shadow-sm dark:shadow-[0_0_12px_rgba(20,184,166,0.3)]'
                  : 'bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400 hover:bg-teal-500/20'
              }`}
            >
              <ArrowUp size={14} /> {isSupported ? 'Supporting' : 'Support This Issue'} <span>{p.upvotes}</span>
            </button>

            <button
              onClick={() => {
                setSelectedRewardTarget({
                  name: p.citizen_name || 'Verified Citizen',
                });
                setRewardModalOpen(true);
              }}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-3 py-2.5 rounded-xl text-xs font-bold transition-all mono flex items-center gap-1.5 active:scale-95"
            >
              <Gift size={14} className="text-amber-600 dark:text-amber-400" />
              <span>Reward Citizen</span>
            </button>
          </div>

          <div className="text-[9px] mono text-slate-500 dark:text-slate-400">
            {p.anonymous ? '🔒 Anonymous' : p.citizen_name} · {p.citizen_rank}
          </div>
        </div>
      </div>

      {/* Official Response Thread & Citizen Comments */}
      <div className="px-4 py-4 space-y-3">
        <p className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Official Response Thread · Public Record</p>

        {p.comments.length === 0 ? (
          <div className="card p-7 text-center border-slate-200 dark:border-slate-800">
            <p className="text-[13px] text-slate-600 dark:text-slate-400">No official response yet.</p>
            <p className="text-[9px] mono text-slate-500 mt-1.5">
              {d.name} has {sla.label === 'Closed' ? 'responded.' : sla.fmt + ' to reply.'} Every day without response is visible.
            </p>
          </div>
        ) : (
          p.comments.map((c, i) =>
            c.role === 'citizen' ? (
              <div key={c.id || i} className="card p-4 space-y-2.5 border-slate-200 dark:border-slate-800" style={{ borderLeft: '3px solid #059669' }}>
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] mono font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest flex items-center gap-1">
                      {c.anonymous ? <EyeOff size={10} className="text-teal-600 dark:text-teal-400" /> : null}
                      {c.sender} · Citizen
                    </span>
                    {c.location_badge && (
                      <span className="text-[8px] mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <MapPin size={9} className="text-teal-600 dark:text-teal-400" />
                        {c.location_badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[8px] mono text-slate-500">{timeAgo(c.created_at)}</span>
                </div>

                <p className="text-[13.5px] text-slate-800 dark:text-slate-200 leading-relaxed">{c.body}</p>

                {c.media && c.media.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[8px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Reply Evidence</p>
                    <MediaCard media={c.media} postId={p.id + '-cc' + i} onToast={(msg) => toast(msg)} />
                  </div>
                )}

                {(c as any).reward ? (
                  <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-xl p-2.5 text-[9.5px] mono text-amber-800 dark:text-amber-300 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <Gift size={14} className="text-amber-600 dark:text-amber-400" />
                      <span>
                        <strong className="text-amber-900 dark:text-amber-200">{(c as any).reward.perkName}</strong> Awarded by{' '}
                        <span className="text-teal-700 dark:text-teal-300 font-semibold">{(c as any).reward.rewardedBy}</span>
                      </span>
                    </div>
                    <span className="bg-emerald-100 dark:bg-slate-950 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-300 dark:border-emerald-500/30">
                      {(c as any).reward.perkCode}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        setSelectedRewardTarget({
                          name: c.sender,
                          commentId: c.id,
                        });
                        setRewardModalOpen(true);
                      }}
                      className="text-[9px] mono font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Gift size={11} /> Reward {c.sender.split(' ')[0]} with Perk
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div key={c.id || i} className="card-gov p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-[8px] mono font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <Lock size={10} /> {c.sender}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {c.status_tag && statusChip(c.status_tag)}
                    <span className="text-[8px] mono text-slate-500">{timeAgo(c.created_at)}</span>
                  </div>
                </div>

                <p className="text-[13.5px] text-slate-800 dark:text-slate-200 leading-relaxed">{c.body}</p>

                {c.media && c.media.length > 0 && (
                  <div>
                    <p className="text-[8px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Proof Uploaded</p>
                    <MediaCard media={c.media} postId={p.id + '-c' + i} onToast={(msg) => toast(msg)} />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1 border-t border-slate-200 dark:border-slate-800/80 text-[9px] mono text-slate-500 dark:text-slate-400">
                  <span>Rate:</span>
                  <button
                    onClick={() => rateReply(p.id, i, true)}
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center gap-1"
                  >
                    <ThumbsUp size={11} /> Helpful {c.helpful || 0}
                  </button>
                  <button
                    onClick={() => rateReply(p.id, i, false)}
                    className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
                  >
                    <ThumbsDown size={11} /> Not helpful {c.not_helpful || 0}
                  </button>
                </div>
              </div>
            )
          )
        )}

        {/* Government Officer Response Trigger */}
        {isGov && user.dept === p.dept && p.status !== 'resolved' && !isReadOnly && (
          <button
            onClick={() => go('gov_reply')}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98]"
          >
            Post Official Response →
          </button>
        )}

        {isReadOnly && (
          <div className="card p-3.5 text-center border-slate-800">
            <p className="text-[10px] mono text-slate-400">Read-Only access — view and export only</p>
          </div>
        )}

        {/* Satisfaction Rating for Citizen Author */}
        {p.status === 'resolved' && user?.role === 'citizen' && p.citizen_id === user.id && p.citizen_satisfied === null && (
          <div className="card p-4 space-y-3 border-slate-800">
            <p className="text-[13px] font-bold text-slate-100">Is your issue resolved?</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => markPostSatisfied(p.id, true)}
                className="py-2.5 rounded-xl text-xs font-bold mono bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 transition-colors"
              >
                ✓ Yes, resolved
              </button>
              <button
                onClick={() => markPostSatisfied(p.id, false)}
                className="py-2.5 rounded-xl text-xs font-bold mono bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
              >
                ✗ Not satisfied
              </button>
            </div>
          </div>
        )}

        {p.citizen_satisfied === true && (
          <p className="text-center text-[9px] mono text-teal-400">✓ Citizen confirmed resolved</p>
        )}
        {p.citizen_satisfied === false && (
          <p className="text-center text-[9px] mono text-rose-400">Citizen not satisfied — issue stays open</p>
        )}

        {/* Upgraded Rich Citizen Reply Box */}
        {user && user.role === 'citizen' && (
          <div className="card p-4 space-y-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-[9px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest block font-bold">
                Add Citizen Reply
              </label>
              <span className="text-[8px] mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border border-teal-300 dark:border-teal-500/30 px-2 py-0.5 rounded font-bold">
                Full Ticket Features Enabled
              </span>
            </div>

            <textarea
              rows={3}
              value={citizenReplyText}
              onChange={(e) => setCitizenReplyText(e.target.value)}
              placeholder="What has changed? Provide field updates, progress photos, or additional details..."
              className="text-sm leading-relaxed resize-none"
            ></textarea>

            {/* Evidence & Voice Note Toolbar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800/80">
              {/* File Attachment Button */}
              <label className="cursor-pointer bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-teal-300 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl text-[10px] mono font-bold flex items-center gap-1.5 transition-colors">
                <input
                  type="file"
                  accept="image/*,video/*,.pdf,.doc"
                  className="hidden"
                  multiple
                  onChange={handleFileSelect}
                />
                <Upload size={13} className="text-teal-600 dark:text-teal-400" />
                <span>Attach Evidence</span>
              </label>

              {/* Voice Note Recording Button */}
              <button
                onClick={handleSimulateVoiceNote}
                disabled={isRecordingVoice}
                className={`px-3 py-1.5 rounded-xl text-[10px] mono font-bold flex items-center gap-1.5 transition-all border ${
                  isRecordingVoice
                    ? 'bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-300 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-teal-300'
                }`}
              >
                <Mic size={13} className={isRecordingVoice ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'} />
                <span>{isRecordingVoice ? 'Recording (0:03)...' : 'Voice Note'}</span>
              </button>

              {/* Anonymous Reply Toggle */}
              <button
                onClick={() => setReplyAnon(!replyAnon)}
                className={`px-3 py-1.5 rounded-xl text-[10px] mono font-bold flex items-center gap-1.5 transition-all border ml-auto ${
                  replyAnon
                    ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500/60 text-amber-800 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {replyAnon ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{replyAnon ? 'Anonymous' : 'Public Name'}</span>
              </button>
            </div>

            {/* Staged Media Preview Grid */}
            {stagedMedia.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[8px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">
                  Reply Attachments ({stagedMedia.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {stagedMedia.map((m, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 rounded-xl flex items-center gap-2 overflow-hidden">
                      {m.type === 'image' && (
                        <img src={m.url} alt="" className="w-8 h-8 object-cover rounded flex-shrink-0" />
                      )}
                      {m.type === 'voice' && (
                        <div className="p-1.5 bg-teal-500/20 text-teal-700 dark:text-teal-300 rounded flex-shrink-0">
                          <Mic size={14} />
                        </div>
                      )}
                      {(m.type === 'doc' || m.type === 'video') && (
                        <div className="p-1.5 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded flex-shrink-0">
                          <FileText size={14} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{m.name}</p>
                        <p className="text-[8px] mono text-slate-500">{m.type} · {m.size || m.duration}</p>
                      </div>
                      <button
                        onClick={() => setStagedMedia(stagedMedia.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 text-xs mono"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Location Policy Selector */}
            <div className="bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 p-3 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[9px] mono text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={11} className="text-teal-600 dark:text-teal-400" /> Reply Location Identification
                </label>
                <span className="text-[8px] mono text-slate-500">Optional</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-[9.5px] mono font-bold">
                <button
                  onClick={() => setLocationMode('parish')}
                  className={`p-2 rounded-lg border transition-all text-center ${
                    locationMode === 'parish'
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-800 dark:text-teal-300 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Area / Parish
                </button>
                <button
                  onClick={handleAcquireGps}
                  className={`p-2 rounded-lg border transition-all text-center ${
                    locationMode === 'gps'
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-800 dark:text-teal-300 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  Device GPS
                </button>
                <button
                  onClick={() => setLocationMode('none')}
                  className={`p-2 rounded-lg border transition-all text-center ${
                    locationMode === 'none'
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-800 dark:text-teal-300 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  None
                </button>
              </div>

              {locationMode === 'gps' && (
                <div className="text-[9px] mono text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/10 p-2 rounded-lg border border-teal-200 dark:border-teal-500/20 flex items-center justify-between">
                  <span>{gpsStatus}</span>
                  <CheckCircle2 size={12} className="text-teal-600 dark:text-teal-400" />
                </div>
              )}

              {locationMode === 'parish' && (
                <p className="text-[8.5px] mono text-slate-600 dark:text-slate-400 leading-tight">
                  Identified with: <span className="text-teal-700 dark:text-teal-300 font-bold">{p.location || pathStr(p.territory, p.country)}</span>
                </p>
              )}
            </div>

            <button
              onClick={handlePostCitizenComment}
              className="w-full bg-emerald-600 dark:bg-teal-500 hover:bg-emerald-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black rounded-xl py-3 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] shadow-md"
            >
              Post Citizen Reply
            </button>

            <p className="text-[8px] mono text-slate-500 dark:text-slate-400 leading-relaxed text-center">
              Your reply is public and permanent. Shown clearly as a citizen contribution on the public wall.
            </p>
          </div>
        )}
      </div>

      {/* Reward Citizen Modal */}
      <RewardModal
        isOpen={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        targetCitizenName={selectedRewardTarget.name || p.citizen_name}
        targetCitizenPhone={selectedRewardTarget.phone || '+256 778 277 900 / +256 748 338 796'}
        postId={p.id}
        commentId={selectedRewardTarget.commentId}
        entityName={user?.dept_label || d.name}
        contextTitle={p.title}
      />
    </div>
  );
};
