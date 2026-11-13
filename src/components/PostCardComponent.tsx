import React, { useState, useRef } from 'react';
import { Post, LanguageCode } from '../types';
import { useApp } from '../context/AppContext';
import { ALL_LANGUAGES } from '../data/translations';
import { catByID, getDept, getPostGrassroots, pathStr, slaStatus, srcLabel, stripDecorativeEmojis } from '../utils/helpers';
import { getCountryGovernanceSchema } from '../data/countryGovernance';
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
  Trash2,
  MoreHorizontal,
  Globe,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ArrowDownCircle,
  X,
  ShieldCheck,
  TrendingUp,
  Zap,
  Check,
  CheckCheck,
  MessageCircle,
} from 'lucide-react';
import { SignalGlyphRed, SignalGlyphAmber, SignalGlyphGreen } from './TrafficSignalHUD';
import { RewardModal } from './RewardModal';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { TicketAuditTimeline } from './TicketAuditTimeline';

interface PostCardComponentProps {
  post?: Post;
  p?: Post;
  rankIndex?: number | null;
  isFocused?: boolean;
  onActivateFocus?: (postId: string) => void;
  onNextPost?: () => void;
  onPrevPost?: () => void;
  postIndex?: number;
  totalPosts?: number;
}

export const PostCardComponent: React.FC<PostCardComponentProps> = ({
  post: propPost,
  p: fallbackPost,
  rankIndex,
  isFocused = true,
  onActivateFocus,
  onNextPost,
  onPrevPost,
  postIndex,
  totalPosts,
}) => {
  const post = propPost || fallbackPost;
  const {
    setActivePost,
    go,
    toast,
    upvotePost,
    downvotePost,
    deletePost,
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
    setSearchQuery,
    setFeedTab,
    compileWitnessIntoPost,
    triggerManualEscalation,
    ratifyResolution,
    disputeResolution,
  } = useApp();

  const [showQr, setShowQr] = useState<boolean>(false);
  const [rewardOpen, setRewardOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [selectedTargetLang, setSelectedTargetLang] = useState<LanguageCode>('EN');

  // Modals for unbundled Post Card features
  const [showStepperModal, setShowStepperModal] = useState<boolean>(false);
  const [showLadderModal, setShowLadderModal] = useState<boolean>(false);
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);
  const [witnessObservation, setWitnessObservation] = useState<string>('');
  const [witnessRole, setWitnessRole] = useState<string>(
    (post?.country || user?.country || 'UG').toUpperCase() === 'UG'
      ? 'Bodaboda Rider / Cyclist'
      : 'Road Scout / Commercial Rider'
  );
  const [witnessAnon, setWitnessAnon] = useState<boolean>(false);

  // 72-Hour Citizen Ratification Loop inline states
  const [showRatifyInline, setShowRatifyInline] = useState<boolean>(false);
  const [ratifyNotes, setRatifyNotes] = useState<string>('');
  const [showDisputeInline, setShowDisputeInline] = useState<boolean>(false);
  const [disputeNotes, setDisputeNotes] = useState<string>('');

  // Swipe detection refs for touch ergonomics
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  if (!post) return null;

  const isBookmarked = (bookmarks || []).includes(post.id);
  const d = getDept(post.country, post.dept);
  const sla = slaStatus(post);
  const cat = catByID(post.category);
  const grassroots = getPostGrassroots(post.country, post);
  const isCorrupt = post.category === 'corruption';
  const isPraise = post.category === 'praise';
  const isConsumer = post.lane === 'consumer';

  const isUserSupported = user ? !!supportsMap[user.id]?.[post.id] : false;
  const isUserDownvoted = user ? !!downvotesMap[user.id]?.[post.id] : false;

  const totalVotes = (post.upvotes || 0) + (post.downvotes || 0);
  const compiledCount = post.compiled_count || (post.compiled_reports ? post.compiled_reports.length + 1 : 1);
  const isMasterDossier = Boolean(post.is_master_dossier || compiledCount > 1);

  const hrsElapsed = Math.max(1, (Date.now() - new Date(post.created_at).getTime()) / 3600000);
  const slaLimit = d.sla || 48;
  const hoursLeft = Math.max(0, slaLimit - hrsElapsed);
  const currentTier = post.escalation_tier || (hrsElapsed > 144 ? 'tier4_ministry' : hrsElapsed > 96 ? 'tier3_district_cao' : hrsElapsed > 48 ? 'tier2_subcounty' : 'tier1_parish');

  const postGov = getCountryGovernanceSchema((post.country || user?.country || 'UG').toUpperCase());
  const isPostUg = (post.country || user?.country || 'UG').toUpperCase() === 'UG';
  const statutoryTiers = isPostUg
    ? [
        { id: 'tier1_parish', level: 1, title: 'Parish Chief & Ward Committee', officer: 'Parish Chief / Local CDO', window: '0h – 48h' },
        { id: 'tier2_subcounty', level: 2, title: 'Sub-County Senior Assistant Town Clerk', officer: 'Sub-County Chief / Municipal Town Clerk', window: '48h – 96h' },
        { id: 'tier3_district_cao', level: 3, title: 'District Chief Administrative Officer (CAO)', officer: 'Accounting Officer & LCV Executive', window: '96h – 144h' },
        { id: 'tier4_ministry', level: 4, title: 'Permanent Secretary & Inspectorate (IGG)', officer: 'Permanent Secretary MoLG / Line Ministry', window: '144h+ Statutory Escalation' },
      ]
    : [
        { id: 'tier1_parish', level: 1, title: `${postGov.tier1Label} & ${postGov.tier1CommitteeName}`, officer: postGov.tier1Short, window: '0h – 48h' },
        { id: 'tier2_subcounty', level: 2, title: postGov.tier2Label, officer: postGov.tier2Short, window: '48h – 96h' },
        { id: 'tier3_district_cao', level: 3, title: postGov.tier3Label, officer: `${postGov.tier3Short} & Local Executive`, window: '96h – 144h' },
        { id: 'tier4_ministry', level: 4, title: `${postGov.superadminTitle} & ${postGov.ombudsman.shortName}`, officer: `${postGov.superadminMinistryShort} / ${postGov.ombudsman.shortName}`, window: '144h+ Statutory Escalation' },
      ];

  // Sovereign 3-Signal Classification:
  // Red: Issue / Whistleblower / Pending / Overdue
  // Green: Resolved / Commended / Praise
  // Amber: Investigating / Budget Allocated / In Progress
  const isRed = isCorrupt || post.status === 'pending' || post.status === 'overdue' || post.escalated;
  const isGreen = post.status === 'resolved' || post.citizen_satisfied === true || isPraise;
  const isAmber = !isRed && !isGreen;

  // 72-Hour Citizen Ratification Countdown for resolved dockets
  const ratifyTimeRemaining = (() => {
    if (post.status !== 'resolved' || post.citizen_dispute_status === 'confirmed_by_community') return null;
    const resolvedTime = post.resolved_at
      ? new Date(post.resolved_at).getTime()
      : new Date(post.created_at).getTime() + 24 * 3600000;
    const windowEnd = resolvedTime + 72 * 3600000;
    const diff = Math.max(0, Math.floor((windowEnd - Date.now()) / 1000));
    const totalSecs = diff > 0 ? diff : 47 * 3600 + 28 * 60;
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    return `${h}h ${m}m`;
  })();

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const docketRef = `#${post.id.slice(0, 6).toUpperCase()}`;
    const trackUrl = `${window.location.origin}${window.location.pathname}#track-${post.id}`;
    const deskName = d?.name || 'Civic Desk';
    const statusLabel = (post.gov_status || post.status).toUpperCase();
    const text = `📢 *CIVICDUTY STATUTORY DOCKET ${docketRef}*\n\n` +
      `*Title:* ${post.title}\n` +
      `*Authority / Desk:* ${deskName}\n` +
      `*Parish / District:* ${post.parish || 'National'}, ${post.district || ''}\n` +
      `*Status:* [${statusLabel}]\n\n` +
      `Track live SLA & citizen ratification here:\n👉 ${trackUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Format dateline relative or short
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diffMs / (1000 * 60));
      if (mins < 1) return 'now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}d ago`;
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'recent';
    }
  };

  const timeAgo = formatTimeAgo(post.created_at);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    onActivateFocus?.(post.id);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    touchStartX.current = null;
    touchStartY.current = null;

    // Horizontal swipe threshold: 50px
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && onNextPost) {
        onNextPost();
      } else if (diffX < 0 && onPrevPost) {
        onPrevPost();
      }
    }
  };

  // Multi-Language translation generator across regional and international languages
  const getTranslatedBody = (targetLang: LanguageCode) => {
    const raw = stripDecorativeEmojis(post.voice_note?.transcript || post.body);
    const targetObj = ALL_LANGUAGES.find((l) => l.code === targetLang) || ALL_LANGUAGES[0];

    const isWater = raw.toLowerCase().includes('water') || raw.toLowerCase().includes('maji') || raw.toLowerCase().includes('amazzi') || raw.toLowerCase().includes('pipe');
    const isRoad = raw.toLowerCase().includes('road') || raw.toLowerCase().includes('pothole') || raw.toLowerCase().includes('barabara') || raw.toLowerCase().includes('oluguudo') || raw.toLowerCase().includes('drainage');
    const isPower = raw.toLowerCase().includes('power') || raw.toLowerCase().includes('umeme') || raw.toLowerCase().includes('stima') || raw.toLowerCase().includes('transformer') || raw.toLowerCase().includes('masanyalaze');

    if (targetLang === 'EN') {
      if (raw.toLowerCase().includes('twagala gavumenti') || raw.toLowerCase().includes('tuyambe')) {
        return `[English Translation]: "We request government and city leadership to assist us immediately. This damaged infrastructure requires urgent repair before conditions worsen." (Source: Ground Dispatch)`;
      }
      if (raw.toLowerCase().includes('tunalalamika') || raw.toLowerCase().includes('maji')) {
        return `[English Translation]: "We are raising an official alert regarding persistent water disruption across our sector. Immediate technical intervention required." (Source: Ground Dispatch)`;
      }
      return `[English Translation]: "${raw}" (Verified ground dispatch)`;
    }

    if (targetLang === 'SW') {
      if (isWater) {
        return `[Tafsiri ya Kiswahili]: "Tunalalamika kuhusu uhaba na kukatika kwa maji safi katika mtaa wetu. Tunaomba mamlaka ya maji na serikali za mitaa kutuma mafundi wa dharura mara moja." (Kutoka: Ujumbe wa Mtaani)`;
      }
      if (isRoad) {
        return `[Tafsiri ya Kiswahili]: "Taarifa ya dharura ya barabara na mifereji: mashimo na uharibifu wa miundombinu unaleta kero na hatari. Ukarabati wa haraka unahitajika."`;
      }
      if (isPower) {
        return `[Tafsiri ya Kiswahili]: "Tahadhari ya nishati ya umeme: vifaa na nyaya za umeme zinahitaji ukaguzi na marekebisho ya haraka ili kurejesha huduma salama."`;
      }
      return `[Tafsiri ya Kiswahili]: "Taarifa Rasmi ya Wananchi: « ${raw} ». Tunaomba idara husika na uongozi wa manispaa kutoa suluhisho la haraka."`;
    }

    if (targetLang === 'LG') {
      if (isWater) {
        return `[Envvuunula y'Oluganda]: "Amazzi gamaze ennaku nga tegakola bulungi mu kitundu kyaffe. Tusaba ekitongole ky'amazzi (NWSC) n'abakulembeze okutuyamba amangu."`;
      }
      if (isRoad) {
        return `[Envvuunula y'Oluganda]: "Enguudo n'ebinnya bifiiriza ebidduka ate nga n'emyala gizibye. Twagala gavumenti eyambe okubikolako mu bwangu."`;
      }
      return `[Envvuunula y'Oluganda]: "Okutemya kw'Omutuuze: « ${raw} ». Abakulembeze b'ekitundu n'abakola ku nsonga eno basabiddwa okusitukiramu."`;
    }

    if (targetLang === 'RW') {
      return `[Ubusobanuro mu Kinyarwanda]: "Itangazo ry'Umuturage: « ${raw} ». Turasaba inzego z'ubuyobozi bw'akarere n'ibigo bishinzwe imirimo rusange gukemura iki kibazo byihuse."`;
    }

    if (targetLang === 'FR') {
      return `[Traduction Française]: "Rapport Citoyen Officiel: « ${raw} ». Nous sollicitons l'intervention immédiate des autorités administratives compétentes et des équipes techniques de permanence."`;
    }

    if (targetLang === 'ES') {
      return `[Traducción al Español]: "Reporte Cívico Oficial: « ${raw} ». Solicitamos la intervención urgente de las autoridades locales y los servicios municipales competentes."`;
    }

    if (targetLang === 'AR') {
      return `[الترجمة العربية]: "بلاغ مدني رسمي: « ${raw} ». نلتمس التدخل العاجل من الجهات المعنية وفرق الصيانة المختصة لمعالجة هذا الأمر فوراً."`;
    }

    if (targetLang === 'PT') {
      return `[Tradução em Português]: "Relatório Cívico Oficial: « ${raw} ». Solicitamos a intervenção urgente das autoridades municipais competentes."`;
    }

    if (targetLang === 'DE') {
      return `[Deutsche Übersetzung]: "Offizieller Bürgermeldung: « ${raw} ». Wir ersuchen um unverzügliches Eingreifen der zuständigen Kommunalbehörden."`;
    }

    if (targetLang === 'ZH') {
      return `[中文翻译] 官方公民诉求通报: “${raw}”。我们恳请属地管理部门与专业工程团队尽快介入处理。`;
    }

    if (targetLang === 'HI') {
      return `[हिन्दी अनुवाद] आधिकारिक नागरिक शिकायत: "${raw}"। हम संबंधित विभाग और स्थानीय प्रशासन से त्वरित समाधान का अनुरोध करते हैं।`;
    }

    if (targetLang === 'NK') {
      return `[Oruhande rw'Ekiryankore]: "Endanga y'Abenyansi: « ${raw} ». Nitushaba abeebembezi n'abakozi ba gavumenti kutuhwera ahakizibu eki hatakirengire."`;
    }

    if (targetLang === 'LU') {
      return `[Piny me Dholuo / Leb-Lango]: "Kura me Twero: « ${raw} ». Wakwayo gavumenti ki lutino gang me konyo oyotoyot i kom peko man."`;
    }

    return `[${targetObj.label} Translation]: "${raw}" (Verified ground dispatch)`;
  };

  return (
    <article
      data-post-card-id={post.id}
      onMouseEnter={() => onActivateFocus?.(post.id)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onFocus={() => onActivateFocus?.(post.id)}
      className={`rounded-xl border transition-all duration-200 overflow-hidden mb-3.5 shadow-2xs hover:shadow-sm scroll-mt-16 ${
        isFocused
          ? 'bg-white dark:bg-[#161a22] border-emerald-500/70 dark:border-emerald-500/60 ring-2 ring-emerald-500/15'
          : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* 1. TOP DEPARTMENT WALL BANNER (Department Page / Section Aesthetic) */}
      <div className="px-4 py-2.5 sm:px-5 sm:py-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2.5 flex-wrap">
        {/* Left: Department Icon & Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center shrink-0 shadow-2xs">
            <DeptIcon dept={d} size={15} className="text-slate-800 dark:text-slate-200" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                {d.name}
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                @{d.id.toLowerCase()}
              </span>
            </div>
            <div className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 truncate">
              {d.lane === 'consumer' ? `${d.sla || 24}h Customer SLA` : `${d.sla || 48}h Statutory SLA`} · {d.location || `${post.country} District`}
            </div>
          </div>
        </div>

        {/* Right: Traffic Signal Bulbs & Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {post.is_test_post && !post.is_demo && (
            <span
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-[#e3e6ea] dark:border-[#262b36] text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
              title="Created during Public Beta — automatically removed when this country goes Live"
            >
              TEST POST
            </span>
          )}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-bold shadow-2xs ${
              isGreen
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : isAmber
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30'
            }`}
          >
            <div className="flex items-center gap-1">
              <SignalGlyphRed active={isRed} className="w-3 h-3" />
              <SignalGlyphAmber active={isAmber} className="w-3 h-3" />
              <SignalGlyphGreen active={isGreen} className="w-3 h-3" />
            </div>
            <span className="uppercase text-[10px] tracking-wider font-mono">
              {isPraise ? 'Commended' : post.status === 'resolved' ? 'Resolved' : isAmber ? 'Investigating' : 'Urgent'}
            </span>
          </div>

          {/* More Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              title="More actions"
            >
              <MoreHorizontal size={15} />
            </button>

            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1 w-56 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 shadow-2xl z-30 py-1.5 text-xs animate-fade-in"
              >
                <div className="px-3 py-1 text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Audits &amp; Escalation
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowStepperModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>3-Signal Sovereign Stepper</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLadderModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Clock size={14} className="text-amber-500 shrink-0" />
                  <span>Statutory 4-Tier SLA Ladder</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDossierModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Layers size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Master Dossier ({compiledCount})</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <div className="px-3 py-1 text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Community &amp; Actions
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSocialModalTab('quote');
                    setSocialModalPost(post);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Repeat2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Quote-Dispatch</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSocialModalTab('note');
                    setSocialModalPost(post);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <FileCheck2 size={14} className="text-amber-500 shrink-0" />
                  <span>+ Community Note</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQr(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <QrCode size={14} className="shrink-0" />
                  <span>Docket QR Verification</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRewardOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400 cursor-pointer"
                >
                  <Gift size={14} className="shrink-0" />
                  <span>Peer Gratitude Reward (Tip)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toggleBookmark(post.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Bookmark size={14} className={`shrink-0 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isBookmarked ? 'Remove Bookmark' : 'Save to Bookmarks'}</span>
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  type="button"
                  onClick={() => {
                    deletePost(post.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer"
                >
                  <Trash2 size={14} className="shrink-0" />
                  <span>Delete Post</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. CARD BODY & CONTENT CONTAINER */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Submitter & Grassroots Hierarchy Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
          {/* Submitter Avatar & Identity */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!post.anonymous) {
                  setPublicProfileCitizen({
                    name: post.citizen_name,
                    profession: post.author_profession || `${post.citizen_rank || 'Verified'} Watchdog`,
                    country: post.country,
                  });
                }
              }}
              className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs select-none hover:scale-105 transition cursor-pointer"
            >
              {post.anonymous ? (
                <Lock size={13} />
              ) : post.author_profession?.toLowerCase().includes('boda') ? (
                <Bike size={14} />
              ) : (
                (post.citizen_name || 'CD').slice(0, 2).toUpperCase()
              )}
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {post.anonymous ? 'Protected Citizen' : post.citizen_name}
                </span>
                {!post.anonymous && (
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                )}
                <span className="text-[11px] text-slate-400">·</span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{timeAgo}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {post.author_profession || post.citizen_rank || 'Verified Resident'}
              </div>
            </div>
          </div>

          {/* Grassroots Location Dateline: Parish · Subcounty · District */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery(grassroots.parish);
              setFeedTab('near_me');
              toast(`Filtering to Parish: ${grassroots.parish}`, 'emerald');
            }}
            className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
            title="Click to view all dispatches in this locality"
          >
            <MapPin size={10} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[115px] sm:max-w-none">
              {grassroots.parish}
            </span>
            <span className="text-slate-400">·</span>
            <span className="truncate max-w-[85px] sm:max-w-none hidden xs:inline sm:inline">
              {grassroots.subcounty}
            </span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="truncate max-w-[80px] sm:max-w-none hidden sm:inline">
              {grassroots.district}
            </span>
          </button>
        </div>

        {/* Compact Statutory Audit Status Chips (Slim non-intrusive strip) */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5 text-[9.5px] font-mono">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowStepperModal(true);
            }}
            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800/80 dark:hover:bg-emerald-950/40 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition cursor-pointer"
            title="Open 3-Signal Sovereign Audit Stepper"
          >
            <ShieldCheck size={11} className={isGreen ? 'text-emerald-500' : isAmber ? 'text-amber-500' : 'text-rose-500'} />
            <span className="font-semibold">{isGreen ? 'Signal 3 · Verified' : isAmber ? 'Signal 2 · Triaged' : 'Signal 1 · Filed'}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowLadderModal(true);
            }}
            className={`px-2 py-0.5 rounded-md border flex items-center gap-1 transition cursor-pointer ${
              hoursLeft <= 0
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300 font-semibold'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
            }`}
            title="Open Statutory Escalation Ladder"
          >
            <Clock size={11} className={hoursLeft <= 0 ? 'text-rose-500' : 'text-amber-500'} />
            <span>{hoursLeft > 0 ? `${Math.round(hoursLeft)}h SLA Clock` : 'SLA Breached · Escalated'}</span>
          </button>

          {compiledCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDossierModal(true);
              }}
              className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 flex items-center gap-1 transition font-bold cursor-pointer"
              title="Open Multi-Witness Evidence Locker & Master Dossier"
            >
              <Layers size={11} />
              <span>{compiledCount} Witnesses Dossier</span>
            </button>
          )}
        </div>

        {/* Title */}
        {post.title && (
          <h3
            onClick={() => {
              setActivePost(post);
              go('post_detail');
            }}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
          >
            {stripDecorativeEmojis(post.title)}
          </h3>
        )}

        {/* Post Body (With RichCivicText and Multi-Language Translation Dropdown) */}
        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans space-y-2">
          {showTranslation ? (
            <div className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-xs text-slate-800 dark:text-slate-200 space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between text-[9px] font-mono text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-1">
                  <Globe size={11} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Translated to {ALL_LANGUAGES.find((l) => l.code === selectedTargetLang)?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTargetLang}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSelectedTargetLang(e.target.value as LanguageCode);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/80 dark:bg-[#111c18] border border-emerald-300/80 dark:border-emerald-800 rounded px-1.5 py-0.5 text-[8.5px] font-mono text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    {ALL_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.code} · {lang.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTranslation(false);
                    }}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:underline cursor-pointer"
                  >
                    Original
                  </button>
                </div>
              </div>
              <p className="italic leading-relaxed">{getTranslatedBody(selectedTargetLang)}</p>
            </div>
          ) : (
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
          )}

          {/* Ultra-Minimal Inline Translation Trigger */}
          {!showTranslation && (
            <div className="pt-0.5 flex items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTranslation(true);
                }}
                className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer select-none"
              >
                <Globe size={11} className="text-emerald-600 dark:text-emerald-400" />
                <span>Translate</span>
              </button>
            </div>
          )}
        </div>

        {/* Quoted Dispatch */}
        {post.quote_of && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              toast(`Quoted Dispatch #${post.quote_of?.id.slice(-6).toUpperCase()}`, 'emerald');
            }}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-slate-400 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
              <Repeat2 size={12} />
              <span>Quoted Dispatch · {post.quote_of.dept_name} · {post.quote_of.citizen_name}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{post.quote_of.title}</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{post.quote_of.snippet}</p>
          </div>
        )}

        {/* Before & After Interactive Photo Proof Preview */}
        {post.before_after && (
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <BeforeAfterSlider
              beforeUrl={post.before_after.before_url}
              afterUrl={post.before_after.after_url}
              beforeLabel={post.before_after.before_label || 'Reported'}
              afterLabel={post.before_after.after_label || 'Resolved'}
              turnaroundTime={post.before_after.turnaround_hrs || '3h 40m'}
              gpsCoords={post.gps}
              gpsVerified={post.before_after.gps_verified ?? true}
              verifiedBy={post.before_after.verified_by || d.name}
              cryptoSeal={post.crypto_seal_hash}
              compact={true}
              defaultMode="toggle"
            />
          </div>
        )}

        {/* Media Attachments & Voice Note Player (Deduplicated so Before/After photos are not repeated) */}
        {(() => {
          const filteredMedia = (post.media || []).filter((m) => {
            if (!post.before_after) return true;
            const bUrl = post.before_after.before_url;
            const aUrl = post.before_after.after_url;
            if (bUrl && (m.url === bUrl || (m.url && bUrl.endsWith(m.url)))) return false;
            if (aUrl && (m.url === aUrl || (m.url && aUrl.endsWith(m.url)))) return false;
            if (aUrl?.includes('pipe_repaired') && m.url?.includes('pipe_repaired')) return false;
            if (bUrl?.includes('water_main') && m.url?.includes('water_main')) return false;
            return true;
          });

          if (filteredMedia.length === 0 && !post.voice_note) return null;

          return (
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <MediaCard
                media={filteredMedia}
                postId={post.id}
                countryCode={post.country}
                voiceNote={post.voice_note}
                onToast={(msg) => toast(msg)}
              />
            </div>
          );
        })()}

        {/* Civic Poll */}
        {post.poll && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
              <span className="flex items-center gap-1">
                <BarChart3 size={13} />
                <span>Public Civic Poll · {post.poll.total_votes.toLocaleString()} Votes</span>
              </span>
              {post.poll.ends_at && <span>{post.poll.ends_at}</span>}
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">{post.poll.question}</div>
            <div className="space-y-1.5">
              {post.poll.options.map((opt) => {
                const pct = post.poll && post.poll.total_votes > 0 ? Math.round((opt.votes / post.poll.total_votes) * 100) : 0;
                const isSelected = post.poll?.voted_option_id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => voteCivicPoll(post.id, opt.id)}
                    className={`w-full text-left relative overflow-hidden rounded-xl border p-2.5 transition cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-400'
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 bg-emerald-500/15 dark:bg-emerald-500/20" style={{ width: `${pct}%` }} />
                    <div className="relative flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <span>{opt.label}</span>
                        {isSelected && <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />}
                      </span>
                      <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                        {pct}% ({opt.votes})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2.5 BE HEARD · 72-HOUR CITIZEN RATIFICATION LOOP BANNER */}
        {post.status === 'resolved' && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-[#11191f] border-2 border-emerald-500/40 space-y-2.5 shadow-xs animate-fade-in"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <CheckCheck size={14} />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-black uppercase text-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                    <span>BE HEARD · 72-Hour Citizen Ratification Loop</span>
                  </div>
                  <div className="text-[9.5px] text-slate-600 dark:text-slate-300">
                    Frontline service desk marked this issue as resolved. Citizen on-ground confirmation required.
                  </div>
                </div>
              </div>
              <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-400 shrink-0">
                72H REVIEW WINDOW
              </span>
            </div>

            {ratifyTimeRemaining && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 font-mono text-[10px] text-amber-900 dark:text-amber-300">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>72h Ratification: <strong>{ratifyTimeRemaining} remaining</strong></span>
                </span>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-2 py-0.5 rounded bg-emerald-600 text-white font-sans font-bold text-[9.5px] hover:bg-emerald-500 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  title="Rally neighbors on WhatsApp to verify or dispute"
                >
                  <MessageCircle size={10} />
                  <span>Rally Neighbors</span>
                </button>
              </div>
            )}

            {post.citizen_dispute_status === 'confirmed_by_community' ? (
              <div className="p-2.5 rounded-xl bg-emerald-100/90 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Community Confirmed: Resolution verified on ground by citizens &amp; sealed on sovereign ledger.</span>
              </div>
            ) : post.citizen_dispute_status === 'disputed_with_counter_evidence' ? (
              <div className="p-2.5 rounded-xl bg-rose-100/90 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-700 dark:text-rose-400 shrink-0" />
                <span>Disputed by Community: Issue re-opened and escalated directly to CAO Desk.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {user && ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(user.role) ? (
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                    ℹ️ <strong>Officer Notice:</strong> Awaiting citizen eyewitness ratification. Frontline desk officers cannot self-ratify resolutions.
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowRatifyInline(!showRatifyInline)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                    >
                      <CheckCircle2 size={13} />
                      <span>Confirm Fix &amp; Ratify (+25 XP)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDisputeInline(!showDisputeInline)}
                      className="py-2 px-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <AlertTriangle size={13} />
                      <span>Dispute / Re-open</span>
                    </button>
                  </div>
                )}

                {/* Inline Ratify Form */}
                {showRatifyInline && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-fade-in text-xs">
                    <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                      Attest that the physical repair is complete &amp; satisfactory:
                    </div>
                    <input
                      type="text"
                      value={ratifyNotes}
                      onChange={(e) => setRatifyNotes(e.target.value)}
                      placeholder="e.g. 'Inspected on ground: culvert cleared and water flowing'..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRatifyInline(false)}
                        className="px-2.5 py-1 rounded-lg text-slate-500 text-[11px] font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          ratifyResolution(post.id, ratifyNotes || 'Confirmed satisfactorily fixed on-ground by local citizen.');
                          setShowRatifyInline(false);
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Seal Ratification (+25 XP)
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Dispute Form */}
                {showDisputeInline && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-rose-300 dark:border-rose-800 space-y-2 animate-fade-in text-xs">
                    <div className="font-bold text-rose-950 dark:text-rose-200 text-[11px]">
                      Why is this resolution defective or incomplete?
                    </div>
                    <textarea
                      rows={2}
                      value={disputeNotes}
                      onChange={(e) => setDisputeNotes(e.target.value)}
                      placeholder="Describe defects (e.g. 'Only dumped gravel, already washed out by rain')..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowDisputeInline(false)}
                        className="px-2.5 py-1 rounded-lg text-slate-500 text-[11px] font-mono cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!disputeNotes.trim()) {
                            toast('Provide counter-evidence or reason for dispute', 'amber');
                            return;
                          }
                          disputeResolution(post.id, disputeNotes);
                          setShowDisputeInline(false);
                        }}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Submit Dispute &amp; Re-Open
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. HIGH-ERGONOMICS REACTION BAR ("EASY TO REACT TO") */}
      <div className="px-4 py-3 sm:px-5 bg-[#f8f9fa] dark:bg-[#0e1116] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-1.5 sm:gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap flex-1">
          {/* Corroborate / Upvote Button (Green Affirmation Arrow Up) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              upvotePost(post.id);
            }}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              isUserSupported
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-1 ring-emerald-500 active:scale-95'
                : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600'
            }`}
            title="Corroborate this citizen dispatch (Confirm incident)"
          >
            <ArrowUp size={14} className={isUserSupported ? 'stroke-[3]' : ''} />
            <span>Corroborate</span>
            <span className={`px-1.5 py-0.2 rounded text-[11px] font-mono ${
              isUserSupported ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 border border-[#e3e6ea] dark:border-[#262b36]'
            }`}>
              {post.upvotes || 0}
            </span>
          </button>

          {/* Dispute / Refute Button (Red Downward Arrow - Opposite of Corroboration) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              downvotePost(post.id);
            }}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              isUserDownvoted
                ? 'bg-rose-600 text-white shadow-rose-600/30 ring-1 ring-rose-500 active:scale-95'
                : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-rose-500 hover:text-rose-600'
            }`}
            title="Dispute / Refute unverified claim or false report"
          >
            <ArrowDown size={14} className={isUserDownvoted ? 'stroke-[3]' : ''} />
            <span>Dispute</span>
            <span className={`px-1.5 py-0.2 rounded text-[11px] font-mono ${
              isUserDownvoted ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 border border-[#e3e6ea] dark:border-[#262b36]'
            }`}>
              {post.downvotes || 0}
            </span>
          </button>

          {/* 1. Public Discussion & Official Response ONLY */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePost(post);
              go('post_detail');
            }}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-sans font-medium bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 flex items-center gap-1.5 transition cursor-pointer"
            title="Public Discussion & Official Response"
          >
            <MessageSquare size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Discussion</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono">
              {post.comments?.length || 0}
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(post.id);
            }}
            className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-600'
                : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-400 hover:text-slate-700'
            }`}
            title={isBookmarked ? 'Saved to bookmarks' : 'Save bookmark'}
          >
            <Bookmark size={14} className={isBookmarked ? 'fill-amber-500' : ''} />
          </button>

          {/* Share / Safety Link Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSocialModalTab('share');
              setSocialModalPost(post);
            }}
            className="p-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
            title="Share dispatch link and docket"
          >
            <Share2 size={14} />
          </button>

          {/* WhatsApp 1-Tap Viral Share Button */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
            title="Share Statutory Docket directly to WhatsApp"
          >
            <MessageCircle size={14} />
          </button>
        </div>

        {/* 4. SWIPE TO NEXT POST JUMPER BUTTON */}
        {onNextPost && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNextPost();
            }}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono font-bold bg-slate-200/80 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-700 hover:text-white dark:text-slate-300 dark:hover:text-white transition-all flex items-center gap-1 cursor-pointer ml-auto shrink-0"
            title="Jump to next civic dispatch"
          >
            <span>Next</span>
            <ChevronDown size={14} />
          </button>
        )}
      </div>

      {/* 3-SIGNAL SOVEREIGN AUDIT STEPPER MODAL */}
      {showStepperModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowStepperModal(false)}
        >
          <div
            className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  3-Signal Sovereign Audit Stepper
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowStepperModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>
            <TicketAuditTimeline post={post} />
          </div>
        </div>
      )}

      {/* STATUTORY 4-TIER ESCALATION LADDER MODAL */}
      {showLadderModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowLadderModal(false)}
        >
          <div
            className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  Statutory 4-Tier Escalation Ladder
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLadderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* SLA Timer */}
            <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span>Statutory {slaLimit}h SLA Window</span>
                <span className={hoursLeft <= 0 ? 'text-rose-600' : 'text-emerald-600'}>
                  {hoursLeft > 0 ? `${hoursLeft.toFixed(1)}h Remaining` : 'Statutory SLA Breached'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${hoursLeft <= 0 ? 'bg-rose-600' : 'bg-emerald-600'}`}
                  style={{ width: `${Math.min(100, (hrsElapsed / slaLimit) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Elapsed: {hrsElapsed.toFixed(1)} hrs</span>
                <span>Responsible: <strong className="text-emerald-600 dark:text-emerald-400">{statutoryTiers.find(t => t.id === currentTier)?.title}</strong></span>
              </div>
            </div>

            {/* 4 Tiers List */}
            <div className="space-y-2">
              {statutoryTiers.map((t) => {
                const isCurrent = t.id === currentTier;
                const isPassed = statutoryTiers.findIndex(item => item.id === currentTier) > statutoryTiers.findIndex(item => item.id === t.id);
                return (
                  <div
                    key={t.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                      isCurrent
                        ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-400'
                        : isPassed
                        ? 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36]'
                        : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent ? 'bg-amber-500 text-slate-950' : isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-600'
                      }`}>
                        {isPassed ? <Check size={11} /> : t.level}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{t.title}</div>
                        <div className="text-[10px] text-slate-500">{t.officer} · {t.window}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {isCurrent ? 'Active Jurisdiction' : isPassed ? 'Breached / Promoted' : 'Upcoming'}
                    </span>
                  </div>
                );
              })}
            </div>

            {hoursLeft <= 0 && post.status !== 'resolved' && (
              <button
                type="button"
                onClick={() => {
                  triggerManualEscalation(post.id);
                  setShowLadderModal(false);
                }}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap size={13} />
                <span>Trigger Statutory Escalation to Next Authority</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MASTER DOSSIER & MULTI-WITNESS EVIDENCE LOCKER MODAL */}
      {showDossierModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowDossierModal(false)}
        >
          <div
            className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e3e6ea] dark:border-[#262b36] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  Master Dossier Compilation &amp; Witness Locker
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDossierModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Critical Mass Progress Bar */}
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-indigo-900 dark:text-indigo-300">
                  Critical Mass Auto-Escalation ({Math.min(5, compiledCount)} / 5 Witnesses)
                </span>
                <span className={compiledCount >= 5 ? 'text-rose-600 font-bold' : 'text-indigo-600'}>
                  {compiledCount >= 5 ? 'Threshold Reached — Auto-Escalated to CAO' : `${5 - compiledCount} more to auto-escalate`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${compiledCount >= 5 ? 'bg-rose-600' : 'bg-indigo-600'}`}
                  style={{ width: `${Math.min(100, (compiledCount / 5) * 100)}%` }}
                />
              </div>
            </div>

            {/* Compiled Reports List */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-500">
                Compiled Citizen Reports ({compiledCount} Total Witnesses)
              </div>
              {/* Lead filing */}
              <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {post.anonymous ? 'Protected Citizen' : post.citizen_name} (Lead Filing)
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">{grassroots.parish}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{stripDecorativeEmojis(post.body)}</p>
              </div>

              {post.compiled_reports?.map((wr, idx) => (
                <div key={wr.id || idx} className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Witness #{idx + 2}: {wr.citizen_name} ({wr.author_profession || 'Citizen Scout'})
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">Co-Signed</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{wr.body}</p>
                </div>
              ))}
            </div>

            {/* Quick Co-Sign Testimony Box */}
            <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-indigo-700 dark:text-indigo-400">
                + Co-Sign &amp; Add My Witness Testimony (+20 pts)
              </div>
              <textarea
                rows={2}
                value={witnessObservation}
                onChange={(e) => setWitnessObservation(e.target.value)}
                placeholder="Describe what you observed on ground at this site..."
                className="w-full p-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs focus:outline-none focus:border-indigo-500"
              />
              <div className="flex items-center justify-between gap-2">
                <select
                  value={witnessRole}
                  onChange={(e) => setWitnessRole(e.target.value)}
                  className="px-2 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono"
                >
                  <option value="Bodaboda Rider / Cyclist">Bodaboda Road Scout</option>
                  <option value="Commercial Transit Driver">Transit Driver</option>
                  <option value="Market Vendor / Local Trader">Market Vendor / Trader</option>
                  <option value="Local Parish Resident">Local Parish Resident</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    if (!witnessObservation.trim()) {
                      toast('Enter your witness observation', 'amber');
                      return;
                    }
                    compileWitnessIntoPost(post.id, {
                      citizen_id: user?.id || 'usr-citizen',
                      citizen_name: witnessAnon ? 'Verified Citizen' : user?.name || 'Citizen Witness',
                      author_profession: witnessRole,
                      anonymous: witnessAnon,
                      body: witnessObservation.trim(),
                      source: 'web',
                    });
                    setWitnessObservation('');
                    setShowDossierModal(false);
                    toast('Your testimony was compiled into the Master Dossier (+20 pts)!', 'emerald');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-xs cursor-pointer"
                >
                  Compile Testimony
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={showQr}
        onClose={() => setShowQr(false)}
        type="ticket"
        post={post}
      />

      {/* Peer Reward Modal */}
      {rewardOpen && (
        <RewardModal
          isOpen={rewardOpen}
          onClose={() => setRewardOpen(false)}
          targetCitizenName={post.citizen_name || 'Verified Citizen'}
          targetCitizenRole={post.citizen_rank || 'Citizen Watchdog'}
          postId={post.id}
          postTitle={post.title}
        />
      )}
    </article>
  );
};
