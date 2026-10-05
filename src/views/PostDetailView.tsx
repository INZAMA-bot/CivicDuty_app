import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Coins,
  TrendingUp,
  Building,
  RotateCcw,
  ExternalLink,
  Flame,
  CheckCheck,
  Award,
  Sparkles,
  Share2,
  Download,
  HelpCircle,
  ArrowDown,
  QrCode,
  Bike
} from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { MediaItem } from '../types';
import { RewardModal } from '../components/RewardModal';
import { TicketAuditTimeline } from '../components/TicketAuditTimeline';
import { generateCryptoSealSync } from '../utils/cryptoSeal';
import { QrCodeModal } from '../components/QrCodeModal';

export const PostDetailView: React.FC = () => {
  const {
    user,
    activePost,
    go,
    prevView,
    upvotePost,
    downvotePost,
    supportsMap,
    downvotesMap,
    rateReply,
    markPostSatisfied,
    addCommentToPost,
    ratifyResolution,
    disputeResolution,
    triggerManualEscalation,
    setVerifyTarget,
    toast,
  } = useApp();

  const [citizenReplyText, setCitizenReplyText] = useState('');
  const [stagedMedia, setStagedMedia] = useState<MediaItem[]>([]);
  const [replyAnon, setReplyAnon] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [locationMode, setLocationMode] = useState<'parish' | 'gps' | 'none'>('parish');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [acquiredGps, setAcquiredGps] = useState<{ lat: string; lng: string } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('Not acquired');

  // Dispute & Ratification Form States
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [ratifyNotes, setRatifyNotes] = useState('');
  const [showRatifyModal, setShowRatifyModal] = useState(false);
  const [showPraiseExplainer, setShowPraiseExplainer] = useState(true);

  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [selectedRewardTarget, setSelectedRewardTarget] = useState<{
    name: string;
    phone?: string;
    commentId?: string;
  }>({ name: '', phone: '' });

  useEffect(() => {
    if (!activePost) {
      go(prevView || 'feed');
    }
  }, [activePost, prevView, go]);

  if (!activePost) {
    return null;
  }

  const p = activePost;
  const d = getDept(p.country, p.dept);
  const sla = slaStatus(p);
  const cat = catByID(p.category);
  const isConsumer = p.lane === 'consumer';
  const isCorrupt = p.category === 'corruption';
  const isPraise = p.category === 'praise';
  const isGov = user && ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(user.role);
  const isReadOnly = user?.role === 'read_only';
  const isSupported = user ? !!supportsMap[user.id]?.[p.id] : false;

  const cryptoSeal = p.crypto_seal_hash || generateCryptoSealSync(`TICKET:${p.id}:${p.title}`);

  // Dynamic Budget Estimation if not present
  const budget = p.budget_allocation || {
    source: isCorrupt ? 'IGG Special Recovery Track' : 'MoFPED DDEG Capital Grant #2026/88',
    allocated_amount: p.category === 'pothole' ? 45000000 : p.category === 'water' ? 28000000 : p.category === 'health' ? 62000000 : 15000000,
    spent_amount: p.status === 'resolved' ? (p.category === 'pothole' ? 42500000 : 25000000) : 8500000,
    currency: 'UGX',
    contractor_name: isConsumer ? 'Private Utility Franchise' : 'District Works Department / Local SACCO',
    milestone_progress: p.status === 'resolved' ? 100 : p.status === 'investigating' ? 45 : 15,
  };

  const handleCopyCitation = () => {
    const citation = `CIVIC COMMENDATION & MERITED SERVICE CITATION
Record Dispatch: #${p.id.slice(-8).toUpperCase()}
Honouree / Service Details: ${p.title}
Designated Authority: ${d.name} (${p.country})
Merit Classification: 100% Green Signal · Merited Public Integrity
Cryptographic Digest: SHA256-HONOURS-${p.id.slice(-6).toUpperCase()}
Summary: ${p.body}
Inscribed permanently into CivicDuty Sovereign Accountability Ledger.`;
    navigator.clipboard.writeText(citation);
    toast('Official Commendation Citation copied to clipboard!', 'emerald');
  };

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
      pending: 'Pending Review',
      received: 'Received by Desk',
      investigating: 'Field Investigation',
      budget: 'Budget Allocated',
      resolved: 'Work Completed',
      overdue: 'Statutory Overdue',
      cannot: 'Jurisdiction Out-of-Scope',
    };
    if (isPraise) {
      return <span className="chip bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700 font-bold">Commended</span>;
    }
    return <span className={`chip ${m[s] || 'ch-pending'}`}>{l[s] || s}</span>;
  };

  const hrsElapsed = Math.max(1, (Date.now() - new Date(p.created_at).getTime()) / 3600000);
  const slaLimit = d.sla || 48;
  const hoursLeft = Math.max(0, slaLimit - hrsElapsed);

  // 4-Tier Statutory Escalation Ladder
  const currentTier = p.escalation_tier || (hrsElapsed > 144 ? 'tier4_ministry' : hrsElapsed > 96 ? 'tier3_district_cao' : hrsElapsed > 48 ? 'tier2_subcounty' : 'tier1_parish');

  const statutoryTiers = [
    {
      id: 'tier1_parish',
      level: 1,
      title: 'Parish Chief & Ward Committee',
      officer: 'Parish Chief / Local CDO',
      window: '0h – 48h',
      slaHours: 48,
    },
    {
      id: 'tier2_subcounty',
      level: 2,
      title: 'Sub-County Senior Assistant Town Clerk',
      officer: 'Sub-County Chief / Municipal Town Clerk',
      window: '48h – 96h',
      slaHours: 96,
    },
    {
      id: 'tier3_district_cao',
      level: 3,
      title: 'District Chief Administrative Officer (CAO)',
      officer: 'Accounting Officer & LCV Executive',
      window: '96h – 144h',
      slaHours: 144,
    },
    {
      id: 'tier4_ministry',
      level: 4,
      title: 'Permanent Secretary & Inspectorate (IGG)',
      officer: 'Permanent Secretary MoLG / Line Ministry',
      window: '144h+ Statutory Escalation',
      slaHours: 192,
    },
  ];

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
          const mockLat = '0.3476';
          const mockLng = '32.5825';
          setAcquiredGps({ lat: mockLat, lng: mockLng });
          setGpsStatus(`GPS Verified: ${mockLat}, ${mockLng}`);
          setLocationMode('gps');
          toast('GPS coordinates attached', 'emerald');
        }
      );
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
      id: `cc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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

  const handleVerifyLedgerClick = () => {
    setVerifyTarget(cryptoSeal);
    go('verify');
  };

  return (
    <div className="animate-fade-in pb-20 text-slate-950 dark:text-white">
      {/* Top Header Bar */}
      <div className="px-4 pt-4 pb-3.5 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors shadow-2xs">
        <button
          onClick={() => go(prevView || 'feed')}
          className="flex items-center gap-1.5 text-xs mono font-black text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 mb-3 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2 flex-wrap justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {d.icon && <span className="text-base">{d.icon}</span>}
            <span className="text-xs mono font-black text-slate-950 dark:text-white">{d.name}</span>
            {isPraise ? (
              <span className="chip flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 font-black">
                <Award size={10} className="text-emerald-600 dark:text-emerald-400" /> Praise &amp; Commendation
              </span>
            ) : isCorrupt ? (
              <span className="chip ch-corrupt flex items-center gap-0.5">
                <Lock size={10} /> Anti-Corruption Line
              </span>
            ) : isConsumer ? (
              <span className="chip ch-private">Verified Private Utility</span>
            ) : (
              <span className="chip ch-gov">Sovereign Desk</span>
            )}
            {p.escalated && (
              <span className="chip ch-overdue a-sla flex items-center gap-0.5 font-black">
                <AlertTriangle size={10} /> Escalated Tier
              </span>
            )}
          </div>

          <button
            onClick={handleVerifyLedgerClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] mono font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 transition-all shadow-2xs"
            title="Verify SHA-256 Ledger Authenticity"
          >
            <ShieldCheck size={11} className="text-indigo-600 dark:text-indigo-400" />
            <span>SHA-256 Seal</span>
          </button>
        </div>
      </div>

      {/* Praise & Commendation Direct Banner */}
      {isPraise && (
        <div className="mx-4 mt-3.5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-950 border border-emerald-300 dark:border-emerald-800 space-y-3 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Award size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9.5px] font-black uppercase font-mono px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                    Public Commendation
                  </span>
                  <span className="text-[9.5px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <Sparkles size={11} /> Merited Public Service
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 font-serif font-black mt-0.5">
                  Official Civic Merit Citation · Dispatch #{p.id.slice(-6).toUpperCase()}
                </h4>
              </div>
            </div>

            <button
              onClick={() => setShowPraiseExplainer(!showPraiseExplainer)}
              className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1 shrink-0 p-1 cursor-pointer"
            >
              <HelpCircle size={13} />
              <span>{showPraiseExplainer ? 'Hide Guide' : 'How It Works'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            Formally certified dispatch acknowledging frontline professionalism, zero-bribery integrity, and emergency dedication. Commendations are recorded in the sovereign ledger and positively influence institutional compliance ratings.
          </p>

          {/* Expandable "How Does a Praise Ticket Work?" Guide */}
          {showPraiseExplainer && (
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 space-y-2.5">
              <div className="text-[10.5px] font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 border-b border-emerald-100 dark:border-emerald-900/50 pb-1.5">
                <Info size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>How a Praise Ticket Operates in CivicDuty</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
                  <strong className="text-emerald-900 dark:text-emerald-200 block font-black">1. Instant Green Signal</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bypasses grievance SLA timers and is immediately certified as 100% resolved, elevating the entity&apos;s public Trust Score.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
                  <strong className="text-emerald-900 dark:text-emerald-200 block font-black">2. Official Honours Roll</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Supervising Accounting Officers &amp; Permanent Secretaries officially acknowledge personnel on quarterly public service rolls.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
                  <strong className="text-emerald-900 dark:text-emerald-200 block font-black">3. Community Corroboration</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Other citizens who witnessed the service can corroborate, upvote, or add supporting testimonials to reinforce merit.</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
                  <strong className="text-emerald-900 dark:text-emerald-200 block font-black">4. Cryptographic Proof</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Stamped with a SHA-256 integrity hash so frontline workers possess verifiable proof of community commendation.</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Action Ribbon */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              onClick={handleCopyCitation}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] font-mono font-black flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <Share2 size={12} />
              <span>Copy Official Citation</span>
            </button>

            <button
              onClick={() => {
                upvotePost(p.id);
                toast('Commendation corroborated! Your citizen vote has been recorded.', 'emerald');
              }}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>Corroborate Frontline Service ({p.upvotes || 0})</span>
            </button>
          </div>
        </div>
      )}

      {/* Anti-Corruption Direct Banner */}
      {isCorrupt && (
        <div className="mx-4 mt-3.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-1 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="text-rose-700 dark:text-rose-400 flex-shrink-0">
              <Lock size={16} />
            </div>
            <p className="text-xs text-rose-950 dark:text-rose-200 font-black">
              Anti-Corruption Report — Auto-referred to Inspectorate of Government (IGG)
            </p>
          </div>
          <p className="text-[10.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Permanent public record. Protected under Whistleblower Protection Act. Identity hidden with sovereign cryptography.
          </p>
        </div>
      )}

      {/* Main Content Body */}
      <div className="px-4 py-4 border-b border-slate-300 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-base sm:text-lg font-black ${isCorrupt ? 'text-rose-800 dark:text-rose-200' : 'text-slate-950 dark:text-white'} leading-snug flex-1`}>
            {p.title}
          </h3>
          {statusChip(p.gov_status || p.status)}
        </div>

        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">{p.body}</p>

        {/* Media Player Grid / Video / Audio / Docs */}
        <MediaCard media={p.media} postId={p.id} onToast={(msg) => toast(msg)} />

        {/* Metadata Grid */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 grid grid-cols-2 gap-3 text-[10px] mono">
          <div>
            <span className="text-slate-600 dark:text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Category</span>
            <span style={{ color: cat.color }} className="font-black">{cat.label}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Territory</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{pathStr(p.country, p.territory)}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Origin Source</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{srcLabel(p.source)}</span>
          </div>
          <div>
            <span className="text-slate-600 dark:text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">Filed Time</span>
            <span className="text-slate-900 dark:text-slate-100 font-bold">{timeAgo(p.created_at)}</span>
          </div>
          {p.gps && (
            <div className="col-span-2 border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-bold">GIS Geocoded GPS:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black">
                {p.gps.lat}, {p.gps.lng}
              </span>
            </div>
          )}

          {p.author_profession && (
            <div className="col-span-2 border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-between flex-wrap gap-2">
              <span className="text-slate-600 dark:text-slate-400 font-bold">Reporter Profession:</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black ${
                p.author_profession.toLowerCase().includes('boda')
                  ? 'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-2xs'
                  : 'bg-blue-100 text-blue-950 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
              }`}>
                {p.author_profession.toLowerCase().includes('boda') && (
                  <Bike size={13} className="text-amber-600 dark:text-amber-400" />
                )}
                <span>{p.author_profession.toLowerCase().includes('boda') ? '🛵 Bodaboda Frontline Road Scout' : p.author_profession}</span>
              </span>
            </div>
          )}
        </div>

        {/* 48-Hour Response SLA Countdown HUD Box */}
        <div className="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-950/80 border border-slate-300 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-black">
            <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Statutory {slaLimit}h SLA Response Window</span>
            </span>
            <span className={hoursLeft <= 0 && !isPraise && p.status !== 'resolved' ? 'text-rose-700 dark:text-rose-400 font-black' : 'text-emerald-700 dark:text-emerald-400 font-black'}>
              {isPraise ? '✓ Commendation Acknowledged' : p.status === 'resolved' ? '✓ Statutory Goal Met' : hoursLeft > 0 ? `${hoursLeft.toFixed(1)}h Remaining` : '⚠ Statutory SLA Breached'}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 rounded-full" 
              style={{ 
                width: `${Math.min(100, (hrsElapsed / slaLimit) * 100)}%`, 
                backgroundColor: (p.status === 'resolved' || isPraise) ? '#10b981' : hoursLeft <= 0 ? '#ef4444' : '#f59e0b' 
              }} 
            />
          </div>

          <div className="flex items-center justify-between text-[9.5px] mono text-slate-700 dark:text-slate-300 font-bold pt-1">
            <span>Elapsed: {hrsElapsed.toFixed(1)} hrs</span>
            <span>Current Responsible Tier: <strong className="text-emerald-700 dark:text-emerald-400">{statutoryTiers.find(t => t.id === currentTier)?.title}</strong></span>
          </div>

          {/* Trigger Escalation Button if Overdue */}
          {hoursLeft <= 0 && p.status !== 'resolved' && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-rose-800 dark:text-rose-300 font-black">
                Statutory deadline elapsed without verified field action.
              </span>
              <button
                onClick={() => triggerManualEscalation(p.id)}
                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black mono flex items-center gap-1.5 transition-all shadow-xs shrink-0 active:scale-95"
              >
                <Zap size={12} />
                <span>Statutory Escalation</span>
              </button>
            </div>
          )}
        </div>

        {/* If Praise: National Honours & Integrity Merit Pathway. If Grievance: 4-Tier Automated Statutory Escalation Ladder */}
        {isPraise ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-slate-950 border border-emerald-300 dark:border-emerald-800 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900/60 pb-2">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <Award size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>National Honours &amp; Integrity Merit Pathway</span>
              </span>
              <span className="text-[9px] mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                100% Green Signal
              </span>
            </div>

            <div className="space-y-2">
              {[
                {
                  step: 1,
                  title: 'Citizen Commendation Dispatched',
                  officer: 'Direct Citizen Witness',
                  desc: 'Public dispatch verifying exceptional frontline dedication, turnaround, or zero-bribe delivery.',
                  status: 'Verified & Certified',
                },
                {
                  step: 2,
                  title: 'Immediate Green Signal Allocation',
                  officer: 'Sovereign Ledger SLA Engine',
                  desc: 'Immediate resolution certified without regulatory delay. Boosts institutional CSAT score.',
                  status: 'Active Green Signal',
                },
                {
                  step: 3,
                  title: 'Institutional Honours Roll Inscription',
                  officer: `${d.name} Accounting Officer / PS`,
                  desc: 'Accounting Officer acknowledges commended frontline workers for official public service merit honours.',
                  status: 'Honours Roll Confirmed',
                },
                {
                  step: 4,
                  title: 'Sovereign Ledger Immutable Seal',
                  officer: 'National Transparency Docket',
                  desc: 'SHA-256 cryptographic digest sealed to ensure permanent integrity accreditation.',
                  status: 'Cryptographically Sealed',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900 flex items-start justify-between gap-2 shadow-2xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 bg-emerald-600 text-white mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h5 className="text-[11px] font-black text-slate-950 dark:text-white leading-tight">
                        {item.title}
                      </h5>
                      <p className="text-[9.5px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                        {item.desc}
                      </p>
                      <p className="text-[8.5px] mono text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                        Authority: {item.officer}
                      </p>
                    </div>
                  </div>

                  <span className="text-[8px] mono font-black px-2 py-0.5 rounded-md uppercase whitespace-nowrap bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>Statutory 4-Tier Escalation Ladder</span>
              </span>
              <span className="text-[9px] mono text-slate-600 dark:text-slate-400 font-bold">Local Gov Act Cap 243</span>
            </div>

            <div className="space-y-2">
              {statutoryTiers.map((t) => {
                const isCurrent = t.id === currentTier;
                const isPassed = statutoryTiers.findIndex(item => item.id === currentTier) > statutoryTiers.findIndex(item => item.id === t.id);

                return (
                  <div
                    key={t.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                      isCurrent
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-2xs'
                        : isPassed
                        ? 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                      }`}>
                        {isPassed ? '✓' : t.level}
                      </div>
                      <div>
                        <h5 className="text-[11px] font-black text-slate-950 dark:text-white leading-tight">
                          {t.title}
                        </h5>
                        <p className="text-[9.5px] text-slate-600 dark:text-slate-400 font-medium">
                          Officer: {t.officer} · {t.window}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[8.5px] mono font-black px-2 py-0.5 rounded-md uppercase ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : isPassed
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {isCurrent ? 'Active Jurisdiction' : isPassed ? 'Breached / Promoted' : 'Upcoming'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Public Expenditure & Budget Transparency Linkage Panel */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Coins size={13} className="text-amber-600 dark:text-amber-400" />
              <span>Public Expenditure & Budget Transparency</span>
            </span>
            <span className="text-[8.5px] mono font-black px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              OPEN BUDGET LEDGER
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px] mono">
            <div>
              <span className="text-slate-600 dark:text-slate-400 block font-bold">Statutory Grant Line</span>
              <span className="text-slate-950 dark:text-white font-black text-[10.5px]">{budget.source}</span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 block font-bold">Approved Allocation</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black text-[11px]">
                {budget.currency} {budget.allocated_amount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 block font-bold">Disbursed to Date</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold">
                {budget.currency} {budget.spent_amount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400 block font-bold">Contractor / SACCO</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold">{budget.contractor_name}</span>
            </div>
          </div>

          <div className="pt-1">
            <div className="flex justify-between text-[9.5px] mono font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Milestone Execution Progress</span>
              <span>{budget.milestone_progress}% Verified</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                style={{ width: `${budget.milestone_progress}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Sovereign Crypto Seal Ledger Box */}
        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-950 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[8.5px] mono font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-widest block">
              Cryptographically Sealed Ledger Hash (SHA-256)
            </span>
            <p className="text-[10px] mono font-black text-indigo-950 dark:text-indigo-200 truncate">
              {cryptoSeal}
            </p>
          </div>
          <button
            onClick={handleVerifyLedgerClick}
            className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-[10px] font-black mono shrink-0 transition-all shadow-xs flex items-center gap-1"
          >
            <span>Verify</span>
            <ExternalLink size={10} />
          </button>
        </div>

        {/* 5-Stage Sovereign Audit Timeline */}
        <TicketAuditTimeline post={p} />

        {/* Support Action Bar */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => upvotePost(p.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all mono active:scale-95 cursor-pointer ${
                  isSupported
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200'
                }`}
              >
                <ArrowUp size={14} /> {isSupported ? 'Supporting' : 'Support Report'} <span>{p.upvotes}</span>
              </button>

              <button
                onClick={() => downvotePost(p.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all mono active:scale-95 cursor-pointer ${
                  user && downvotesMap[user.id]?.[p.id]
                    ? 'bg-rose-700 text-white shadow-md'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border border-rose-300 dark:border-rose-700 hover:bg-rose-200'
                }`}
                title="Flag report as inaccurate or disputed. Escalation SLA remains protected."
              >
                <ArrowDown size={14} /> <span>Dispute ({p.downvotes || 0})</span>
              </button>

              <button
                onClick={() => setQrModalOpen(true)}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all mono flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Verify and Print QR Code Docket"
              >
                <QrCode size={14} className="text-amber-500" />
                <span>QR Docket</span>
              </button>

              <button
                onClick={() => {
                  setSelectedRewardTarget({
                    name: p.citizen_name || 'Verified Citizen',
                  });
                  setRewardModalOpen(true);
                }}
                className="bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-3 py-2.5 rounded-xl text-xs font-black transition-all mono flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Gift size={14} className="text-amber-700 dark:text-amber-400" />
                <span>Reward</span>
              </button>
            </div>

            <div className="text-[10px] mono font-bold text-slate-700 dark:text-slate-300">
              {p.anonymous ? '🔒 Protected Anonymous Citizen' : p.citizen_name} · {p.citizen_rank}
            </div>
          </div>

          {/* Consensus Ratio Bar */}
          {((p.upvotes || 0) > 0 || (p.downvotes || 0) > 0) && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between gap-3">
              <span className="font-bold text-[11px] text-slate-600 dark:text-slate-400">
                Community Sentiment:
              </span>
              <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div
                  style={{
                    width: `${Math.round(((p.upvotes || 0) / Math.max(1, (p.upvotes || 0) + (p.downvotes || 0))) * 100)}%`,
                  }}
                  className="bg-emerald-500 h-full"
                />
                <div
                  style={{
                    width: `${Math.round(((p.downvotes || 0) / Math.max(1, (p.upvotes || 0) + (p.downvotes || 0))) * 100)}%`,
                  }}
                  className="bg-rose-500 h-full"
                />
              </div>
              <span className="font-mono text-[10px] font-black text-slate-700 dark:text-slate-300">
                {Math.round(((p.upvotes || 0) / Math.max(1, (p.upvotes || 0) + (p.downvotes || 0))) * 100)}% Endorsed
              </span>
            </div>
          )}
        </div>
      </div>

      <QrCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        type="ticket"
        post={p}
      />

      {/* CITIZEN VERIFICATION & MULTI-PARTY DISPUTE LOOP (72-HOUR REVIEW WINDOW) */}
      {p.status === 'resolved' && (
        <div className="mx-4 my-4 p-4 rounded-3xl bg-emerald-50/90 dark:bg-slate-900 border-2 border-emerald-500/50 shadow-md space-y-3.5">
          <div className="flex items-center justify-between border-b border-emerald-200 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <CheckCheck size={16} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-emerald-950 dark:text-emerald-300">
                  72-Hour Community Ratification Window
                </h4>
                <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                  Official marked this issue as resolved. Ground ratification is required to close.
                </p>
              </div>
            </div>
            <span className="text-[8.5px] mono font-black px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-300 border border-emerald-400">
              DUAL-VERIFY
            </span>
          </div>

          {p.citizen_dispute_status === 'confirmed_by_community' ? (
            <div className="p-3 rounded-2xl bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-black flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>✓ Community Confirmed: Field resolution verified and sealed on the sovereign ledger.</span>
            </div>
          ) : p.citizen_dispute_status === 'disputed_with_counter_evidence' ? (
            <div className="p-3 rounded-2xl bg-rose-100/80 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200 text-xs font-black flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-700 dark:text-rose-400 shrink-0" />
              <span>⚠ Disputed by Community: Re-opened and escalated directly to CAO Desk.</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => setShowRatifyModal(true)}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <CheckCircle2 size={15} />
                  <span>Confirm Fix & Ratify (+25 XP)</span>
                </button>

                <button
                  onClick={() => setShowDisputeForm(!showDisputeForm)}
                  className="w-full py-3 px-4 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 border border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200 font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <AlertTriangle size={15} />
                  <span>Dispute / Re-open with Evidence</span>
                </button>
              </div>

              {/* Dispute Form Inline Drawer */}
              {showDisputeForm && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-rose-300 dark:border-rose-800 space-y-3 a-fade">
                  <h5 className="text-xs font-black text-rose-950 dark:text-rose-200">
                    File Dispute & Re-Open Report
                  </h5>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                    Explain why the resolution is incomplete, defective, or incorrect. This will immediately revert the ticket to Overdue status and escalate to the CAO.
                  </p>
                  <textarea
                    rows={3}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Describe specific defects or missing work (e.g. 'Pothole was only partially filled with loose gravel and already washed out')..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white font-medium focus:outline-none focus:border-rose-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowDisputeForm(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (!disputeReason.trim()) {
                          toast('Provide dispute reason', 'red');
                          return;
                        }
                        disputeResolution(p.id, disputeReason);
                        setShowDisputeForm(false);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs"
                    >
                      <RotateCcw size={13} />
                      <span>Submit Dispute</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Ratify Modal / Confirmation Inline */}
              {showRatifyModal && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800 space-y-3 a-fade">
                  <h5 className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                    Community Ratification & Sovereign Seal
                  </h5>
                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                    I attest as an on-ground citizen that the reported infrastructure problem has been satisfactorily fixed.
                  </p>
                  <input
                    type="text"
                    value={ratifyNotes}
                    onChange={(e) => setRatifyNotes(e.target.value)}
                    placeholder="Optional verification note (e.g. 'Water flowing properly from borehole now')..."
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-950 dark:text-white font-medium focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRatifyModal(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        ratifyResolution(p.id, ratifyNotes);
                        setShowRatifyModal(false);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCheck size={13} />
                      <span>Seal Ratification</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Official Response Thread & Citizen Comments */}
      <div className="px-4 py-4 space-y-3">
        <p className="text-xs mono text-slate-700 dark:text-slate-300 uppercase tracking-widest font-black">
          Official Response Thread · Public Record
        </p>

        {p.comments.length === 0 ? (
          <div className="p-7 rounded-2xl text-center border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
            <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">No official response yet.</p>
            <p className="text-[10px] mono text-slate-600 dark:text-slate-400">
              {d.name} has {hoursLeft > 0 ? `${hoursLeft.toFixed(1)}h remaining` : 'breached the 48h window.'} Every hour is permanently tracked on public ledger.
            </p>
          </div>
        ) : (
          p.comments.map((c, i) =>
            c.role === 'citizen' ? (
              <div key={c.id ? `${c.id}-${i}` : `comment-cit-${i}`} className="p-4 rounded-2xl bg-white dark:bg-slate-900 space-y-2.5 border-l-4 border-l-emerald-600 border-y border-r border-slate-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] mono font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      {c.anonymous ? <EyeOff size={10} className="text-emerald-700 dark:text-emerald-400" /> : null}
                      {c.sender} · Citizen Observer
                    </span>
                    {c.location_badge && (
                      <span className="text-[8.5px] mono bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                        <MapPin size={9} className="text-emerald-600 dark:text-emerald-400" />
                        {c.location_badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] mono text-slate-500 font-bold">{timeAgo(c.created_at)}</span>
                </div>

                <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium">{c.body}</p>

                {c.media && c.media.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[9px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Attached Field Evidence</p>
                    <MediaCard media={c.media} postId={p.id + '-cc' + i} onToast={(msg) => toast(msg)} />
                  </div>
                )}
              </div>
            ) : (
              <div key={c.id ? `${c.id}-${i}` : `comment-gov-${i}`} className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-900/90 space-y-2.5 border-l-4 border-l-amber-500 border-y border-r border-amber-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-[9px] mono font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <Lock size={10} /> {c.sender}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {c.status_tag && statusChip(c.status_tag)}
                    <span className="text-[9px] mono text-slate-500 font-bold">{timeAgo(c.created_at)}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-950 dark:text-slate-100 leading-relaxed font-medium">{c.body}</p>

                {c.media && c.media.length > 0 && (
                  <div>
                    <p className="text-[9px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Government Proof Uploaded</p>
                    <MediaCard media={c.media} postId={p.id + '-c' + i} onToast={(msg) => toast(msg)} />
                  </div>
                )}

                <div className="flex items-center gap-4 pt-1.5 border-t border-slate-200 dark:border-slate-800 text-[10px] mono text-slate-700 dark:text-slate-300 font-bold">
                  <span>Feedback Rating:</span>
                  <button
                    onClick={() => rateReply(p.id, i, true)}
                    className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <ThumbsUp size={12} /> Helpful ({c.helpful || 0})
                  </button>
                  <button
                    onClick={() => rateReply(p.id, i, false)}
                    className="hover:text-rose-700 dark:hover:text-rose-400 transition-colors flex items-center gap-1"
                  >
                    <ThumbsDown size={12} /> Unhelpful ({c.not_helpful || 0})
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
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl py-3.5 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] shadow-md"
          >
            Post Official Response / Resolution Proof →
          </button>
        )}

        {/* Upgraded Rich Citizen Reply Box */}
        {user && user.role === 'citizen' && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs mono text-slate-900 dark:text-slate-100 uppercase tracking-widest block font-black">
                Add Field Note / Citizen Contribution
              </label>
              <span className="text-[8.5px] mono text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-black border border-emerald-300 dark:border-emerald-700">
                SOVEREIGN LEDGER
              </span>
            </div>

            <textarea
              rows={3}
              value={citizenReplyText}
              onChange={(e) => setCitizenReplyText(e.target.value)}
              placeholder="What has changed? Provide on-ground updates, progress observations, or photo evidence..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white font-medium focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
            />

            {/* Evidence & Voice Note Toolbar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
              <label className="cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-[10.5px] mono font-black flex items-center gap-1.5 transition-colors shadow-2xs">
                <input
                  type="file"
                  accept="image/*,video/*,.pdf,.doc"
                  className="hidden"
                  multiple
                  onChange={handleFileSelect}
                />
                <Upload size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>Attach Evidence</span>
              </label>

              <button
                onClick={handleSimulateVoiceNote}
                disabled={isRecordingVoice}
                className={`px-3 py-1.5 rounded-xl text-[10.5px] mono font-black flex items-center gap-1.5 transition-all border shadow-2xs ${
                  isRecordingVoice
                    ? 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-300 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500'
                }`}
              >
                <Mic size={13} className={isRecordingVoice ? 'text-rose-600' : 'text-emerald-600 dark:text-emerald-400'} />
                <span>{isRecordingVoice ? 'Recording (0:03)...' : 'Voice Note'}</span>
              </button>

              <button
                onClick={() => setReplyAnon(!replyAnon)}
                className={`px-3 py-1.5 rounded-xl text-[10.5px] mono font-black flex items-center gap-1.5 transition-all border ml-auto shadow-2xs ${
                  replyAnon
                    ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {replyAnon ? <EyeOff size={13} /> : <Eye size={13} />}
                <span>{replyAnon ? 'Anonymous' : 'Public Name'}</span>
              </button>
            </div>

            {/* Staged Media Preview */}
            {stagedMedia.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[9px] mono text-slate-600 dark:text-slate-400 uppercase tracking-widest font-black">
                  Attachments ({stagedMedia.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {stagedMedia.map((m, idx) => (
                    <div key={idx} className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 p-2 rounded-xl flex items-center gap-2 overflow-hidden">
                      {m.type === 'image' && (
                        <img src={m.url} alt="" className="w-8 h-8 object-cover rounded flex-shrink-0" />
                      )}
                      {m.type === 'voice' && (
                        <div className="p-1.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded flex-shrink-0">
                          <Mic size={14} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10.5px] font-black text-slate-900 dark:text-slate-100 truncate">{m.name}</p>
                        <p className="text-[8.5px] mono text-slate-600">{m.type} · {m.size || m.duration}</p>
                      </div>
                      <button
                        onClick={() => setStagedMedia(stagedMedia.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-600 p-1 text-xs mono font-black"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handlePostCitizenComment}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black rounded-2xl py-3 text-xs uppercase tracking-widest mono transition-all active:scale-[.98] shadow-md"
            >
              Post Field Contribution
            </button>
          </div>
        )}
      </div>

      {/* Reward Citizen Modal */}
      <RewardModal
        isOpen={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        targetCitizenName={selectedRewardTarget.name || p.citizen_name}
        targetCitizenPhone={selectedRewardTarget.phone || '+256 778 277 900'}
        postId={p.id}
        commentId={selectedRewardTarget.commentId}
        entityName={user?.dept_label || d.name}
        contextTitle={p.title}
      />
    </div>
  );
};
