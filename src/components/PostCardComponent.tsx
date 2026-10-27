import React, { useState, useRef } from 'react';
import { Post, LanguageCode } from '../types';
import { useApp } from '../context/AppContext';
import { ALL_LANGUAGES } from '../data/translations';
import { catByID, getDept, getPostGrassroots, pathStr, slaStatus, srcLabel, stripDecorativeEmojis } from '../utils/helpers';
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
  Globe2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  ArrowDownCircle,
} from 'lucide-react';
import { SignalGlyphRed, SignalGlyphAmber, SignalGlyphGreen } from './TrafficSignalHUD';
import { RewardModal } from './RewardModal';
import { BeforeAfterSlider } from './BeforeAfterSlider';

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
  } = useApp();

  const [showQr, setShowQr] = useState<boolean>(false);
  const [rewardOpen, setRewardOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [selectedTargetLang, setSelectedTargetLang] = useState<LanguageCode>('EN');

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

  // Sovereign 3-Signal Classification:
  // Red: Issue / Whistleblower / Pending / Overdue
  // Green: Resolved / Commended / Praise
  // Amber: Investigating / Budget Allocated / In Progress
  const isRed = isCorrupt || post.status === 'pending' || post.status === 'overdue' || post.escalated;
  const isGreen = post.status === 'resolved' || post.citizen_satisfied === true || isPraise;
  const isAmber = !isRed && !isGreen;

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
                className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 shadow-xl z-30 py-1 text-xs animate-fade-in"
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowQr(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#1e232d] text-slate-700 dark:text-slate-300"
                >
                  <QrCode size={13} />
                  <span>Docket QR Verification</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRewardOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                >
                  <Gift size={13} />
                  <span>Peer Gratitude Reward</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deletePost(post.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600"
                >
                  <Trash2 size={13} />
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
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7.5px] font-mono bg-slate-100/60 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/50 dark:border-slate-800/80 hover:border-emerald-300 transition-colors cursor-pointer shrink-0"
            title="Click to view all dispatches in this locality"
          >
            <MapPin size={7.5} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[8.5px] sm:text-[9px] font-bold text-slate-900 dark:text-slate-100 truncate max-w-[105px] sm:max-w-none">
              {grassroots.parish}
            </span>
            <span className="text-[6.5px] text-slate-400">·</span>
            <span className="text-[7px] text-slate-500 dark:text-slate-400 truncate max-w-[80px] sm:max-w-none">
              {grassroots.subcounty}
            </span>
            <span className="text-[6.5px] text-slate-400">·</span>
            <span className="text-[6.5px] text-slate-400 dark:text-slate-500 truncate max-w-[70px] sm:max-w-none">
              {grassroots.district}
            </span>
          </button>
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
                  <Globe2 size={10} className="text-emerald-600 dark:text-emerald-400" />
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
                <Globe2 size={10} className="text-emerald-600 dark:text-emerald-400" />
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

          {/* Comment / Discussion Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePost(post);
              go('post_detail');
            }}
            className="px-3 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-sans font-medium bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-slate-400 flex items-center gap-1.5 transition cursor-pointer"
            title="Open dispatch discussion and official replies"
          >
            <MessageSquare size={14} />
            <span className="hidden sm:inline">Replies</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 border border-[#e3e6ea] dark:border-[#262b36] text-[11px] font-mono">
              {post.comments?.length || 0}
            </span>
          </button>

          {/* Co-Sign / Repost Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSocialModalTab('quote');
              setSocialModalPost(post);
            }}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-sans font-medium bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-slate-400 flex items-center gap-1.5 transition cursor-pointer"
            title="Quote or Co-sign dispatch"
          >
            <Repeat2 size={14} />
            <span className="hidden md:inline">Co-sign</span>
            <span className="text-[11px] font-mono">{post.reposts || compiledCount || 0}</span>
          </button>

          {/* Peer Gratitude Reward Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRewardOpen(true);
            }}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-sans font-medium bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition flex items-center gap-1 cursor-pointer"
            title="Send peer recognition reward / airtime voucher"
          >
            <Gift size={13} className="text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Tip</span>
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

          {/* Share / QR Docket */}
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
