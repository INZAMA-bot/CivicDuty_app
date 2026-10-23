import React, { useState, useEffect, useCallback } from 'react';
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
  Eye, 
  FileText, 
  Download, 
  BookOpen, 
  Compass, 
  PhoneCall, 
  CheckCircle2, 
  Layers,
  Award,
  Bookmark,
  Hash,
  Mic,
  Video,
  Camera,
  X,
  Scale,
  Calendar,
  Bell,
  BellRing,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PostCardComponent } from '../components/PostCardComponent';
import { CivicFeedDispatcher } from '../components/CivicFeedDispatcher';
import { AccountabilityDocket } from '../components/AccountabilityDocket';
import { COUNTRIES } from '../data/countries';
import { DeptIcon, CategoryIcon } from '../components/DeptIcon';
import { GeospatialSignalMap } from '../components/GeospatialSignalMap';
import { TrafficSignalHUD, SignalGlyphRed, SignalGlyphAmber, SignalGlyphGreen } from '../components/TrafficSignalHUD';
import { PromotionalAdFeedCard } from '../components/PromotionalAdFeedCard';
import { catByID, getDept, getPostGrassroots, slaStatus } from '../utils/helpers';
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
    showDemos,
    setShowDemos,
    townHalls,
    setActiveTownHall,
    setHostBarazaModalOpen,
    activeHashtagFilter,
    setActiveHashtagFilter,
    bookmarks,
    mutedAuthors,
    blockedAuthors,
    setUser,
    toast,
  } = useApp();

  const [gisViewMode, setGisViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'all'>('all');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [showBarazaDeck, setShowBarazaDeck] = useState<boolean>(false);
  const [barazaDeckTab, setBarazaDeckTab] = useState<'live' | 'upcoming'>('live');

  // Grassroots Hierarchy filter state for "Near Me"
  const [nearMeLevel, setNearMeLevel] = useState<'all' | 'parish' | 'ward' | 'grassroot'>('all');
  const [activeParish, setActiveParish] = useState<string>(() => user?.parish || user?.parish_ward || 'Nakasero Parish');
  const [activeWard, setActiveWard] = useState<string>(() => user?.ward || 'Central Ward');
  const [activeGrassroot, setActiveGrassroot] = useState<string>(() => user?.grassroot || user?.village || 'Lumumba Cell');
  const [showGrassrootsModal, setShowGrassrootsModal] = useState<boolean>(false);
  const [remindedBarazas, setRemindedBarazas] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('civicduty_baraza_reminders');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const toggleBarazaReminder = (id: string, _title: string) => {
    setRemindedBarazas((prev) => {
      const nextVal = !prev[id];
      const next = { ...prev, [id]: nextVal };
      try {
        localStorage.setItem('civicduty_baraza_reminders', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Preserve & Restore Feed Scroll Position
  useEffect(() => {
    const saved = sessionStorage.getItem('civic_feed_scroll');
    if (saved) {
      const y = parseInt(saved, 10);
      if (!isNaN(y) && y > 0) {
        setTimeout(() => {
          window.scrollTo({ top: y, behavior: 'instant' });
        }, 30);
      }
    }
    const handleScroll = () => {
      sessionStorage.setItem('civic_feed_scroll', String(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activePromotionalAds = (promotionalAds || []).filter((a) => a.published);

  const activeUser = user || ensureCitizenSession();

  const isGrassrootsChief = Boolean(
    activeUser.role === 'parish_chief' ||
      activeUser.deskCode?.includes('PARISH') ||
      activeUser.deskCode?.includes('WARD') ||
      activeUser.hierarchy_level === 'tier1_lowest' ||
      activeUser.hierarchy_level === 'tier1_parish' ||
      activeUser.real_title_short?.toLowerCase().includes('parish chief') ||
      activeUser.real_title_short?.toLowerCase().includes('town agent') ||
      activeUser.real_title_short?.toLowerCase().includes('ward admin')
  );

  const isMinister = Boolean(
    activeUser.real_title_short?.includes('Minister') ||
      activeUser.role_label?.includes('Minister') ||
      activeUser.deskCode?.includes('-MIN') ||
      activeUser.deskCode === 'UG-MOLG-CABINET-MIN' ||
      activeUser.deskCode === 'UG-MOLG-STATE-MIN'
  );

  const followed = activeUser.followed || [];
  const normFollowed = followed.map((f) => f.replace(/^[a-z]{2}-/i, ''));
  const rawCountryPosts = posts.filter((p) => p.country === activeUser.country);
  const liveCount = rawCountryPosts.filter((p) => !p.is_demo).length;
  const demoCount = rawCountryPosts.filter((p) => p.is_demo).length;

  const allC = showDemos ? rawCountryPosts : rawCountryPosts.filter((p) => !p.is_demo);
  const matchedFollowPosts = allC.filter((p) =>
    followed.includes(p.dept) ||
    normFollowed.includes(p.dept) ||
    followed.includes(`${activeUser.country.toLowerCase()}-${p.dept}`)
  );
  
  const followPosts =
    matchedFollowPosts.length > 0
      ? allC.filter(
          (p) =>
            followed.includes(p.dept) ||
            normFollowed.includes(p.dept) ||
            followed.includes(`${activeUser.country.toLowerCase()}-${p.dept}`) ||
            p.category === 'praise' ||
            p.is_master_dossier
        )
      : allC;
  const toggleFollowDept = (deptId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const current = prev.followed || [];
      const isF = current.includes(deptId);
      const updated = isF ? current.filter((x) => x !== deptId) : [...current, deptId];
      toast(isF ? `Unfollowed @${deptId}` : `Following @${deptId} dispatches!`, 'emerald');
      return { ...prev, followed: updated };
    });
  };

  // Trending ranked by citizen corroborations, reposts & comments
  const trendPosts = [...allC].sort((a, b) => {
    const scoreA = (a.upvotes || 0) * 2 + (a.reposts || 0) * 3 + (a.comments?.length || 0) * 2;
    const scoreB = (b.upvotes || 0) * 2 + (b.reposts || 0) * 3 + (b.comments?.length || 0) * 2;
    return scoreB - scoreA;
  });

  // Near Me grassroots hierarchy filtering (Parish, Ward, Grassroot)
  const nearMePosts = allC.filter((p) => {
    const g = getPostGrassroots(p.country, p);
    const parishClean = activeParish.replace(/ Parish/i, '').toLowerCase();
    const wardClean = activeWard.replace(/ Ward/i, '').toLowerCase();
    const grassrootClean = activeGrassroot.toLowerCase();

    if (nearMeLevel === 'parish') {
      return (
        g.parish.toLowerCase().includes(parishClean) ||
        p.body.toLowerCase().includes(parishClean) ||
        p.location.toLowerCase().includes(parishClean)
      );
    }
    if (nearMeLevel === 'ward') {
      return (
        g.ward.toLowerCase().includes(wardClean) ||
        p.body.toLowerCase().includes(wardClean) ||
        p.location.toLowerCase().includes(wardClean)
      );
    }
    if (nearMeLevel === 'grassroot') {
      return (
        g.grassroot.toLowerCase().includes(grassrootClean) ||
        p.body.toLowerCase().includes(grassrootClean) ||
        p.location.toLowerCase().includes(grassrootClean)
      );
    }
    // 'all' level: matches parish, ward, subcounty or district
    return (
      g.parish.toLowerCase().includes(parishClean) ||
      g.ward.toLowerCase().includes(wardClean) ||
      p.location.toLowerCase().includes(parishClean) ||
      p.location.toLowerCase().includes(wardClean) ||
      (activeUser.district && p.territory?.district?.toLowerCase().includes(activeUser.district.toLowerCase()))
    );
  });

  const base = selectedCategory === 'praise' 
    ? allC 
    : feedTab === 'following' 
      ? followPosts 
      : feedTab === 'trending' 
        ? trendPosts 
        : (nearMePosts.length > 0 ? nearMePosts : allC);

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
    .filter((p) => !(mutedAuthors || []).includes(p.citizen_name) && !(blockedAuthors || []).includes(p.citizen_name))
    .filter((p) => (showBookmarksOnly ? (bookmarks || []).includes(p.id) : true))
    .filter((p) =>
      activeHashtagFilter
        ? p.body.toLowerCase().includes(activeHashtagFilter.toLowerCase()) ||
          (p.hashtags || []).some((h) => h.toLowerCase() === activeHashtagFilter.toLowerCase())
        : true
    )
    .filter((p) => matchesQuery(p, searchQuery))
    .filter((p) => matchesTrafficSignal(p, trafficSignalFilter))
    .filter(matchesCategory)
    .sort((a, b) => {
      const aDemo = a.is_demo ? 1 : 0;
      const bDemo = b.is_demo ? 1 : 0;
      if (aDemo !== bDemo) return aDemo - bDemo;
      return 0;
    });

  const total = allC.length;
  const redCount = allC.filter(
    (p) => p.category === 'corruption' || p.status === 'pending' || p.status === 'overdue' || p.escalated
  ).length;
  const amberCount = allC.filter(
    (p) => (p.status === 'investigating' || p.status === 'budget' || p.status === 'received') && p.category !== 'corruption'
  ).length;
  const greenCount = allC.filter(
    (p) => p.status === 'resolved' || p.citizen_satisfied === true || p.category === 'praise'
  ).length;

  const liveBarazaRooms = (townHalls || []).filter((th) => {
    if (!th.scheduled_at) return true;
    const t = new Date(th.scheduled_at).getTime();
    return isNaN(t) || t <= Date.now();
  });

  const upcomingBarazaRooms = (townHalls || []).filter((th) => {
    if (!th.scheduled_at) return false;
    const t = new Date(th.scheduled_at).getTime();
    return !isNaN(t) && t > Date.now();
  });

  const activeTopBaraza = liveBarazaRooms[0] || null;

  const [currentPostIndex, setCurrentPostIndex] = useState<number>(0);

  // Sync index when focusedCardId changes
  useEffect(() => {
    if (focusedCardId) {
      const idx = display.findIndex((p) => p.id === focusedCardId);
      if (idx !== -1) setCurrentPostIndex(idx);
    }
  }, [focusedCardId, display]);

  const goToNextPost = useCallback(() => {
    if (display.length === 0) return;
    const nextIdx = Math.min(display.length - 1, currentPostIndex + 1);
    setCurrentPostIndex(nextIdx);
    const target = display[nextIdx];
    if (target) {
      setFocusedCardId(target.id);
      const el = document.querySelector(`[data-post-card-id="${target.id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPostIndex, display]);

  const goToPrevPost = useCallback(() => {
    if (display.length === 0) return;
    const prevIdx = Math.max(0, currentPostIndex - 1);
    setCurrentPostIndex(prevIdx);
    const target = display[prevIdx];
    if (target) {
      setFocusedCardId(target.id);
      const el = document.querySelector(`[data-post-card-id="${target.id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPostIndex, display]);

  // Keyboard navigation shortcuts (J / ArrowDown = Next, K / ArrowUp = Prev)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNextPost();
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevPost();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPost, goToPrevPost]);

  return (
    <div className="min-h-screen text-slate-950 dark:text-white bg-white dark:bg-[#0e1116] border-x border-slate-200 dark:border-[#262b36] pb-24">
      {/* 1. TWITTER / X STICKY TOP TAB HEADER */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0e1116]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#262b36] transition-colors">
        <div className="flex items-center justify-around">
          {/* Tab 1: Following (Monitored Desks & Grassroots) */}
          <button
            type="button"
            onClick={() => setFeedTab('following')}
            className="flex-1 py-3.5 text-center relative font-bold text-sm transition-colors cursor-pointer"
          >
            <span className={feedTab === 'following' ? 'text-slate-950 dark:text-white font-black' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}>
              Following {followed.length > 0 && `(${followed.length})`}
            </span>
            {feedTab === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>

          {/* Tab 2: Trending (Ranked by Engagement & Corroborations) */}
          <button
            type="button"
            onClick={() => setFeedTab('trending')}
            className="flex-1 py-3.5 text-center relative font-bold text-sm transition-colors cursor-pointer"
          >
            <span className={feedTab === 'trending' ? 'text-slate-950 dark:text-white font-black' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}>
              Trending
            </span>
            {feedTab === 'trending' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>

          {/* Tab 3: Near Me (Grassroots Hierarchy: Parish · Ward · Grassroot Cell) */}
          <button
            type="button"
            onClick={() => setFeedTab('near_me')}
            className="flex-1 py-3.5 text-center relative font-bold text-sm transition-colors cursor-pointer"
          >
            <span className={`inline-flex items-center gap-1 ${feedTab === 'near_me' ? 'text-slate-950 dark:text-white font-black' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}>
              <span>Near Me</span>
            </span>
            {feedTab === 'near_me' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>
        </div>

        {/* 2. MAINTAINING THE SIGNAL BULBS: Twitter-Style Clean Traffic Signal Filters */}
        <div className="px-3.5 sm:px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            {/* Filter All */}
            <button
              type="button"
              onClick={() => setTrafficSignalFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                trafficSignalFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-[#161a22] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              All Signals ({total})
            </button>

            {/* Filter Red Bulb */}
            <button
              type="button"
              onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'red' ? 'all' : 'red')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                trafficSignalFilter === 'red'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/60'
              }`}
              title="Signal 1: Red Bulb (Citizen Speaks / Urgent Issue / Open)"
            >
              <SignalGlyphRed active={true} className="w-3.5 h-3.5" />
              <span>Urgent ({redCount})</span>
            </button>

            {/* Filter Amber Bulb */}
            <button
              type="button"
              onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'amber' ? 'all' : 'amber')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                trafficSignalFilter === 'amber'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-900/60'
              }`}
              title="Signal 2: Amber Bulb (Government Serves / Investigating / Budgeted)"
            >
              <SignalGlyphAmber active={true} className="w-3.5 h-3.5" />
              <span>Alert ({amberCount})</span>
            </button>

            {/* Filter Green Bulb */}
            <button
              type="button"
              onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'green' ? 'all' : 'green')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                trafficSignalFilter === 'green'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-900/60'
              }`}
              title="Signal 3: Green Bulb (Citizen Verified / Commended / Resolved)"
            >
              <SignalGlyphGreen active={true} className="w-3.5 h-3.5" />
              <span>Resolved ({greenCount})</span>
            </button>

            {/* Saved Bookmarks */}
            <button
              type="button"
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition cursor-pointer ${
                showBookmarksOnly
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-[#161a22] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Bookmark size={11} className={showBookmarksOnly ? 'text-white' : 'text-slate-500'} />
              <span>Saved ({(bookmarks || []).length})</span>
            </button>
          </div>

          {/* Demos Toggle */}
          <button
            type="button"
            onClick={() => setShowDemos(!showDemos)}
            className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md shrink-0 transition cursor-pointer ${
              showDemos ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Toggle showcase demonstration tickets"
          >
            {showDemos ? 'Demos: On' : 'Live Only'}
          </button>
        </div>
      </header>

      {/* 2b. CRITICAL: NEAR ME GRASSROOTS HIERARCHY CONTROLS (PARISH · WARD · GRASSROOT) */}
      {feedTab === 'near_me' && (
        <div className="bg-slate-50 dark:bg-[#161a22] border-b border-slate-200 dark:border-[#262b36] p-3 sm:p-3.5 space-y-2.5">
          {/* Header Row: Current Grassroots Scope & View Mode Toggle */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 flex-wrap">
              <MapPin size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">Grassroots:</span>
              <span className="font-bold text-slate-950 dark:text-white">
                {activeUser.district || 'Kampala'} › {activeWard} › {activeParish}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">({activeGrassroot})</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Change Location Button */}
              <button
                type="button"
                onClick={() => setShowGrassrootsModal(true)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#0e1116] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Change active grassroots parish or ward"
              >
                <span>Change Grassroot 📍</span>
              </button>

              {/* Map View Toggle */}
              <button
                type="button"
                onClick={() => setGisViewMode(gisViewMode === 'MAP' ? 'LIST' : 'MAP')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer shadow-2xs ${
                  gisViewMode === 'MAP'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-[#0e1116] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                }`}
                title="Toggle between List Feed and Geospatial Radar Map"
              >
                <span>{gisViewMode === 'MAP' ? '📄 Stream List' : '🗺️ Radar Map'}</span>
              </button>
            </div>
          </div>

          {/* Granularity Filter Level Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mr-1 shrink-0">
              Filter By:
            </span>

            {/* Level: All Near Me */}
            <button
              type="button"
              onClick={() => setNearMeLevel('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                nearMeLevel === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'bg-white dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              All Grassroots ({nearMePosts.length})
            </button>

            {/* Level: Parish */}
            <button
              type="button"
              onClick={() => setNearMeLevel('parish')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 flex items-center gap-1 ${
                nearMeLevel === 'parish'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-white dark:bg-[#0e1116] text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-50'
              }`}
            >
              <span>Parish: {activeParish}</span>
            </button>

            {/* Level: Ward */}
            <button
              type="button"
              onClick={() => setNearMeLevel('ward')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 flex items-center gap-1 ${
                nearMeLevel === 'ward'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-white dark:bg-[#0e1116] text-sky-800 dark:text-sky-400 border border-sky-200 dark:border-sky-900/60 hover:bg-sky-50'
              }`}
            >
              <span>Ward: {activeWard}</span>
            </button>

            {/* Level: Grassroot Cell */}
            <button
              type="button"
              onClick={() => setNearMeLevel('grassroot')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 flex items-center gap-1 ${
                nearMeLevel === 'grassroot'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-white dark:bg-[#0e1116] text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-50'
              }`}
            >
              <span>Cell: {activeGrassroot}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2c. TRENDING TOPICS & GRASSROOTS CORROBORATIONS */}
      {feedTab === 'trending' && (
        <div className="bg-slate-50 dark:bg-[#161a22] border-b border-slate-200 dark:border-[#262b36] px-3.5 sm:px-4 py-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-bold shrink-0 flex items-center gap-1">
              <span>🔥 Trending Grassroots:</span>
            </span>
            {[
              { tag: '#NakaseroWater', count: '142 dispatches' },
              { tag: '#CentralWardRoads', count: '89 dispatches' },
              { tag: '#KawempeDrainage', count: '64 dispatches' },
              { tag: '#PotholeWatch', count: '51 dispatches' },
              { tag: '#GrassrootsAction', count: '47 dispatches' },
              { tag: '#MulagoEmergency', count: '39 dispatches' },
            ].map((t) => (
              <button
                key={t.tag}
                type="button"
                onClick={() => {
                  setActiveHashtagFilter(activeHashtagFilter === t.tag ? null : t.tag);
                  toast(`Filtering by ${t.tag}`, 'emerald');
                }}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 transition cursor-pointer ${
                  activeHashtagFilter === t.tag
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500'
                }`}
              >
                <span>{t.tag}</span>
                <span className="text-[10px] opacity-70 ml-1">({t.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2d. FOLLOWING DESKS & LEADERSHIP STRIP */}
      {feedTab === 'following' && (
        <div className="bg-slate-50 dark:bg-[#161a22] border-b border-slate-200 dark:border-[#262b36] px-3.5 sm:px-4 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Grassroots Desks & Authorities You Follow ({followed.length})
            </span>
            <span className="text-[11px] text-slate-500">1-Tap Follow</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: 'kcca', name: 'City Authority', label: 'KCCA' },
              { id: 'nwsc', name: 'Water & Sewerage', label: 'NWSC' },
              { id: 'umeme', name: 'Power Grid', label: 'Umeme' },
              { id: 'moh_ug', name: 'Health Ministry', label: 'MoH' },
              { id: 'kla_cbd', name: 'Central Ward Desk', label: 'Central Ward' },
              { id: 'nakasero_chief', name: 'Nakasero Chief', label: 'Nakasero Parish' },
            ].map((d) => {
              const isF = followed.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleFollowDept(d.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 transition cursor-pointer flex items-center gap-1 ${
                    isF
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <span>{d.label}</span>
                  <span className={`text-[10px] ${isF ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-400'}`}>
                    {isF ? '✓' : '+'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TWITTER SPACES-STYLE LIVE BARAZA STRIP */}
      {townHalls && townHalls.length > 0 && (
        <div className="bg-slate-50 dark:bg-[#161a22] border-b border-slate-200 dark:border-[#262b36] px-3.5 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>

              {activeTopBaraza ? (
                <div
                  onClick={() => setActiveTownHall(activeTopBaraza)}
                  className="flex items-center gap-2 text-xs truncate cursor-pointer hover:underline"
                >
                  <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px] tracking-wider">
                    Live Baraza:
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {activeTopBaraza.title}
                  </span>
                  <span className="text-slate-500 text-[11px] shrink-0">
                    · {activeTopBaraza.listeners_count || 1} tuned in
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {upcomingBarazaRooms.length} Civic Assemblies scheduled
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {activeTopBaraza && (
                <button
                  type="button"
                  onClick={() => setActiveTownHall(activeTopBaraza)}
                  className="px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Radio size={12} />
                  <span>Tune In</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setHostBarazaModalOpen(true)}
                className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 text-[11px] font-medium transition cursor-pointer"
              >
                + Host
              </button>

              <button
                type="button"
                onClick={() => setShowBarazaDeck(!showBarazaDeck)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                title="Expand schedule and rooms"
              >
                {showBarazaDeck ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* Expandable Baraza Schedule & Carousel */}
          {showBarazaDeck && (
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-in">
              {townHalls.slice(0, 4).map((th) => (
                <div
                  key={th.id}
                  onClick={() => setActiveTownHall(th)}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-rose-600 font-bold uppercase">
                      {th.has_video ? 'Video HD' : 'Audio Baraza'}
                    </span>
                    <span className="text-slate-500">{th.listeners_count} tuned in</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {th.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Host: {th.host_name} · {th.dept_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. CIVIC PERFORMANCE & ACCOUNTABILITY DOCKET (Department Section Aesthetic) */}
      <div className="p-3.5 sm:p-4.5 bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f16] dark:to-[#0e1116] border-b border-slate-200 dark:border-[#222736]">
        <AccountabilityDocket
          leftLabel={`${total} Civic Reports`}
          leftSubLabel={`${COUNTRIES[activeUser.country]?.name || 'National'} Statutory SLA`}
          centerVal={amberCount + redCount}
          centerLabel="ACTIVE DISPATCHES"
          rightLabel={`${greenCount > 0 ? Math.round((greenCount / Math.max(1, total)) * 100) : 88}% Resolved`}
          rightSubLabel={`${greenCount} Confirmed Fixes`}
          high={true}
        />

        <div className="mt-3.5">
          <CivicFeedDispatcher />
        </div>
      </div>

      {/* 5. Minimal Search & Active Hashtag Strip */}
      <div className="px-3.5 sm:px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-[#161a22] rounded-full px-3 py-1.5">
          <Search size={14} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dispatches, parishes, keywords..."
            className="w-full text-xs text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {activeHashtagFilter && (
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-1 rounded-full text-xs font-medium">
            <span>{activeHashtagFilter}</span>
            <button
              type="button"
              onClick={() => setActiveHashtagFilter(null)}
              className="hover:text-emerald-950"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* 6. GIS MAP MODE (When explicitly toggled) */}
      {gisViewMode === 'MAP' && (
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <MapPin size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Geospatial Radar: {activeParish} & {activeWard}</span>
            </span>
            <button
              type="button"
              onClick={() => setGisViewMode('LIST')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
            >
              Switch to Feed Stream ✕
            </button>
          </div>
          <GeospatialSignalMap customPosts={display} />
        </div>
      )}

      {/* 7. CIVIC DEPARTMENT-STYLE STANDALONE POSTS FEED */}
      <div id="feed-list" className="p-3 sm:p-5 space-y-4 bg-slate-100/70 dark:bg-[#090b10] min-h-[60vh]">
        {display.length === 0 ? (
          <div className="py-20 text-center px-4 space-y-3 bg-white dark:bg-[#111520] rounded-2xl border border-slate-200 dark:border-[#222736] shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Shield size={24} />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No civic dispatches found matching current filter.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All submissions are monitored under statutory 24h–48h SLA response guarantees.
            </p>
          </div>
        ) : (
          display.map((p, i) => {
            const activeId = focusedCardId || display[0]?.id;
            return (
              <React.Fragment key={p.id}>
                <PostCardComponent
                  post={p}
                  rankIndex={feedTab === 'trending' ? i : null}
                  isFocused={activeId === p.id}
                  onActivateFocus={(id) => {
                    setFocusedCardId(id);
                    setCurrentPostIndex(i);
                  }}
                  onNextPost={i < display.length - 1 ? goToNextPost : undefined}
                  onPrevPost={i > 0 ? goToPrevPost : undefined}
                  postIndex={i}
                  totalPosts={display.length}
                />

                {/* Promotional Campaign Cards smoothly integrated */}
                {i === 2 && activePromotionalAds[0] && (
                  <div data-post-card-id="ad-transit-painting" className="mb-4">
                    <PromotionalAdFeedCard
                      ad={activePromotionalAds[0]}
                      defaultIndex={0}
                      campaignMode="transit_painting"
                      isFocused={activeId === 'ad-transit-painting'}
                      onActivateFocus={() => setFocusedCardId('ad-transit-painting')}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* 8. FLOATING SWIPE NAVIGATOR HUD ("SWIPE TO NEXT POST EASILY") */}
      {display.length > 1 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 dark:bg-[#161a24]/95 text-white backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-700/70 shadow-2xl flex items-center gap-3 text-xs font-mono select-none animate-fade-in ring-1 ring-white/10">
          <button
            type="button"
            onClick={goToPrevPost}
            disabled={currentPostIndex === 0}
            className={`p-1 rounded-full transition flex items-center gap-1 ${
              currentPostIndex === 0 ? 'opacity-30 cursor-not-allowed text-slate-500' : 'cursor-pointer text-emerald-400 hover:text-emerald-300 hover:bg-white/10'
            }`}
            title="Previous Dispatch (Keyboard: ↑ or K)"
          >
            <ChevronUp size={16} />
            <span className="hidden sm:inline text-[11px] font-bold">Prev</span>
          </button>

          <span className="text-[11.5px] font-bold text-slate-300 px-1 border-x border-slate-700">
            Dispatch <strong className="text-white text-xs">{currentPostIndex + 1}</strong> of {display.length}
          </span>

          <button
            type="button"
            onClick={goToNextPost}
            disabled={currentPostIndex >= display.length - 1}
            className={`p-1 rounded-full transition flex items-center gap-1 ${
              currentPostIndex >= display.length - 1 ? 'opacity-30 cursor-not-allowed text-slate-500' : 'cursor-pointer text-emerald-400 hover:text-emerald-300 hover:bg-white/10'
            }`}
            title="Next Dispatch (Keyboard: ↓ or J)"
          >
            <span className="hidden sm:inline text-[11px] font-bold">Next</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}

      {/* Grassroots Selection Modal */}
      {showGrassrootsModal && (
        <div
          onClick={() => setShowGrassrootsModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Change Grassroots Location
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGrassrootsModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Pinpoint any Parish, Ward, or Grassroot Cell across Uganda to explore local civic dispatches and response times.
            </p>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Popular Grassroots Hubs:
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {[
                  { p: 'Nakasero Parish', w: 'Central Ward', g: 'Lumumba Cell' },
                  { p: 'Bukoto Parish', w: 'Nakawa Ward', g: 'Kalinabiri Zone' },
                  { p: 'Naguru Parish', w: 'Nakawa Ward', g: 'Upper Naguru' },
                  { p: 'Mulago Parish', w: 'Kawempe Ward', g: 'Mulago III Cell' },
                  { p: 'Kisenyi Parish', w: 'Central Ward', g: 'Kisenyi I Cell' },
                  { p: 'Kamwokya Parish', w: 'Central Ward', g: 'Church Zone' },
                  { p: 'Ntinda Parish', w: 'Nakawa Ward', g: 'Semawata Zone' },
                  { p: 'Kibuye Parish', w: 'Makindye Ward', g: 'Kibuye Market' },
                  { p: 'Ggaba Parish', w: 'Makindye Ward', g: 'Landing Site' },
                  { p: 'Mengo Parish', w: 'Rubaga Ward', g: 'Bakuli Cell' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveParish(item.p);
                      setActiveWard(item.w);
                      setActiveGrassroot(item.g);
                      setShowGrassrootsModal(false);
                      toast(`Near Me updated to ${item.p}`, 'emerald');
                    }}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer text-xs ${
                      activeParish === item.p
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1116] hover:border-slate-400'
                    }`}
                  >
                    <div className="font-bold truncate text-slate-900 dark:text-white">{item.p}</div>
                    <div className="text-[10px] text-slate-500 truncate">{item.w} · {item.g}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Inputs */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Or Custom Location:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={activeParish}
                  onChange={(e) => setActiveParish(e.target.value)}
                  placeholder="Parish (e.g. Nakasero)"
                  className="bg-white dark:bg-[#0e1116] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={activeWard}
                  onChange={(e) => setActiveWard(e.target.value)}
                  placeholder="Ward (e.g. Central Ward)"
                  className="bg-white dark:bg-[#0e1116] border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowGrassrootsModal(false);
                toast(`Grassroots location set to ${activeParish}`, 'emerald');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Apply Grassroots Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
