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
  Activity,
  Droplets,
  Zap,
  Landmark,
  HelpCircle,
  CreditCard,
  Building2,
  SlidersHorizontal,
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
    openGuide,
    isCitizenSpeaking,
    setIsCitizenSpeaking,
  } = useApp();

  const [gisViewMode, setGisViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'all'>('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string | null>(null);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(true);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [showBarazaDeck, setShowBarazaDeck] = useState<boolean>(false);
  const [barazaDeckTab, setBarazaDeckTab] = useState<'live' | 'upcoming'>('live');
  const [barazaCategoryFilter, setBarazaCategoryFilter] = useState<'all' | 'following' | 'trending' | 'near_me'>('all');

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
    .filter((p) => (selectedDeptFilter ? p.dept === selectedDeptFilter || p.dept.toLowerCase().includes(selectedDeptFilter.toLowerCase()) : true))
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

  const praiseCount = allC.filter((p) => p.category === 'praise').length;
  const healthCount = allC.filter((p) => p.category === 'health' || p.category === 'emergency').length;
  const waterCount = allC.filter((p) => p.category === 'water').length;
  const roadsCount = allC.filter((p) => p.category === 'roads' || p.category === 'transit').length;
  const powerCount = allC.filter((p) => p.category === 'electricity').length;

  const mofpedCount = allC.filter((p) => p.dept === 'mofped' || p.dept?.toLowerCase().includes('finance')).length;
  const molgCount = allC.filter((p) => p.dept === 'molg' || p.dept?.toLowerCase().includes('local')).length;
  const kccaCount = allC.filter((p) => p.dept === 'kcca').length;
  const nwscCount = allC.filter((p) => p.dept === 'nwsc').length;
  const umemeCount = allC.filter((p) => p.dept === 'umeme').length;

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

  const getBarazaCategoryMeta = (cat?: 'following' | 'trending' | 'near_me' | string) => {
    if (cat === 'following') {
      return {
        label: 'Following Desk Baraza',
        shortLabel: 'Following',
        badgeBg: 'bg-indigo-600 text-white',
        chipClass: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        pingBg: 'bg-indigo-400',
        dotBg: 'bg-indigo-500',
        cardBorder: 'border-indigo-400/60 dark:border-indigo-500/50 hover:border-indigo-500',
        accentText: 'text-indigo-600 dark:text-indigo-400',
        btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      };
    }
    if (cat === 'trending') {
      return {
        label: 'Trending National Baraza',
        shortLabel: 'Trending',
        badgeBg: 'bg-amber-600 text-white',
        chipClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        pingBg: 'bg-amber-400',
        dotBg: 'bg-amber-500',
        cardBorder: 'border-amber-400/60 dark:border-amber-500/50 hover:border-amber-500',
        accentText: 'text-amber-600 dark:text-amber-400',
        btnBg: 'bg-amber-600 hover:bg-amber-500 text-white',
      };
    }
    // near_me
    return {
      label: 'Near Me · Parish Baraza',
      shortLabel: 'Near Me',
      badgeBg: 'bg-emerald-600 text-white',
      chipClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      pingBg: 'bg-emerald-400',
      dotBg: 'bg-emerald-500',
      cardBorder: 'border-emerald-400/60 dark:border-emerald-500/50 hover:border-emerald-500',
      accentText: 'text-emerald-600 dark:text-emerald-400',
      btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    };
  };

  const filteredLiveBarazaRooms = liveBarazaRooms.filter((th) => {
    if (barazaCategoryFilter === 'all') return true;
    return th.category === barazaCategoryFilter;
  });

  const activeTopBaraza = filteredLiveBarazaRooms[0] || liveBarazaRooms[0] || null;
  const activeMeta = getBarazaCategoryMeta(activeTopBaraza?.category);

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
    <div className="min-h-screen text-slate-900 dark:text-slate-100 bg-[#f8f9fa] dark:bg-[#0e1116] pb-24">
      {/* 1. SOVEREIGN TOP TAB HEADER (FOLLOWING · TRENDING · NEAR ME) - SLIM & DOCKED */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#161a22]/95 backdrop-blur-md border-b border-[#e3e6ea] dark:border-[#262b36] transition-colors shadow-2xs">
        <div className="flex items-center justify-around">
          {/* Tab 1: FOLLOWING */}
          <button
            type="button"
            onClick={() => setFeedTab('following')}
            className={`flex-1 py-3 sm:py-3.5 text-center relative font-sans font-bold text-xs sm:text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              feedTab === 'following'
                ? 'text-emerald-500 font-black'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Users size={16} className={feedTab === 'following' ? 'text-emerald-500' : 'text-slate-400'} />
            <span>FOLLOWING</span>
            {feedTab === 'following' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-500 rounded-t-full" />
            )}
          </button>

          {/* Tab 2: TRENDING */}
          <button
            type="button"
            onClick={() => setFeedTab('trending')}
            className={`flex-1 py-3 sm:py-3.5 text-center relative font-sans font-bold text-xs sm:text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              feedTab === 'trending'
                ? 'text-emerald-500 font-black'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp size={16} className={feedTab === 'trending' ? 'text-emerald-500' : 'text-slate-400'} />
            <span>TRENDING</span>
            {feedTab === 'trending' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-500 rounded-t-full" />
            )}
          </button>

          {/* Tab 3: NEAR ME */}
          <button
            type="button"
            onClick={() => setFeedTab('near_me')}
            className={`flex-1 py-3 sm:py-3.5 text-center relative font-sans font-bold text-xs sm:text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              feedTab === 'near_me'
                ? 'text-emerald-500 font-black'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Radio size={16} className={feedTab === 'near_me' ? 'text-emerald-500' : 'text-slate-400'} />
            <span>NEAR ME</span>
            {feedTab === 'near_me' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-emerald-500 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      {/* 2. DISPATCH CONTROLS & SOVEREIGN SIGNAL FILTER (SCROLLS NATURALLY WITH FEED - NEVER BLOCKS POST VIEWING) */}
      <div className="bg-white dark:bg-[#161a22] border-b border-[#e3e6ea] dark:border-[#262b36] relative z-10 transition-colors">
        {/* Search, Filter Drawer Toggle & GIS Map Row */}
        <div className="p-3 sm:px-4 sm:py-2.5 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2.5 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl px-3.5 py-2">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports, departments, categories..."
              className="w-full text-xs text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Toggle Sovereign Filter Card to give maximum viewport to posts */}
          <button
            type="button"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className={`px-3 py-2 rounded-xl border font-sans text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs ${
              !filtersExpanded
                ? 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
            }`}
            title={filtersExpanded ? 'Collapse filters to maximize post viewing area' : 'Expand Sovereign Signal Filters'}
          >
            <SlidersHorizontal size={13} className={filtersExpanded ? 'text-emerald-500' : 'text-slate-400'} />
            <span className="hidden sm:inline">Filters</span>
            {(trafficSignalFilter !== 'all' || selectedDeptFilter) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          {/* GIS Map Button */}
          <button
            type="button"
            onClick={() => setGisViewMode(gisViewMode === 'MAP' ? 'LIST' : 'MAP')}
            className={`px-3.5 py-2 rounded-xl border font-sans text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs ${
              gisViewMode === 'MAP'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-800 dark:text-slate-200 hover:border-emerald-500'
            }`}
            title="Toggle Geospatial Signal Radar Map"
          >
            <Layers size={14} className="text-emerald-500" />
            <span>GIS Map</span>
          </button>
        </div>

        {/* Category Pills Row (All · Praise · Health · Water · Roads · Power · Saved) */}
        <div className="px-3 sm:px-4 pb-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {/* All */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setShowBookmarksOnly(false);
            }}
            className={`px-3.5 py-1 rounded-full text-xs font-sans shrink-0 transition cursor-pointer ${
              selectedCategory === 'all' && !showBookmarksOnly
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold shadow-2xs'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] font-medium hover:border-slate-400'
            }`}
          >
            All ({total})
          </button>

          {/* Praise */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'praise' ? 'all' : 'praise');
              setShowBookmarksOnly(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium shrink-0 transition cursor-pointer ${
              selectedCategory === 'praise'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <Bookmark size={12} className="text-emerald-500" />
            <span>Praise ({praiseCount})</span>
          </button>

          {/* Health */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'health' ? 'all' : 'health');
              setShowBookmarksOnly(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium shrink-0 transition cursor-pointer ${
              selectedCategory === 'health'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] hover:border-sky-500'
            }`}
          >
            <Activity size={12} className="text-sky-500" />
            <span>Health ({healthCount})</span>
          </button>

          {/* Water */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'water' ? 'all' : 'water');
              setShowBookmarksOnly(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium shrink-0 transition cursor-pointer ${
              selectedCategory === 'water'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] hover:border-blue-500'
            }`}
          >
            <Droplets size={12} className="text-blue-500" />
            <span>Water ({waterCount})</span>
          </button>

          {/* Roads */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'roads' ? 'all' : 'roads');
              setShowBookmarksOnly(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium shrink-0 transition cursor-pointer ${
              selectedCategory === 'roads'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-500'
            }`}
          >
            <MapPin size={12} className="text-amber-500" />
            <span>Roads ({roadsCount})</span>
          </button>

          {/* Power */}
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(selectedCategory === 'electricity' ? 'all' : 'electricity');
              setShowBookmarksOnly(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium shrink-0 transition cursor-pointer ${
              selectedCategory === 'electricity'
                ? 'bg-yellow-600 text-white shadow-xs font-bold'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] hover:border-yellow-500'
            }`}
          >
            <Zap size={12} className="text-yellow-500" />
            <span>Power ({powerCount})</span>
          </button>

          {/* Saved Bookmarks */}
          <button
            type="button"
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium shrink-0 transition cursor-pointer ${
              showBookmarksOnly
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 border border-[#e3e6ea] dark:border-[#262b36] hover:border-indigo-400'
            }`}
          >
            <Bookmark size={11} className={showBookmarksOnly ? 'text-white' : 'text-slate-400'} />
            <span>Saved ({(bookmarks || []).length})</span>
          </button>

          {/* Demos Toggle */}
          <button
            type="button"
            onClick={() => setShowDemos(!showDemos)}
            className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md shrink-0 transition cursor-pointer ml-auto ${
              showDemos ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/50' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Toggle showcase demonstration tickets"
          >
            {showDemos ? 'Demos: On' : 'Live Only'}
          </button>
        </div>

        {/* Expandable Sovereign Signal Filter & Department Quick Pills */}
        {filtersExpanded && (
          <div className="border-t border-[#e3e6ea] dark:border-[#262b36] pt-2.5 animate-fade-in">
            {/* Sovereign Signal Filter Card (1. Speak · 2. Serve · 3. Be Heard) */}
            <div className="px-3 sm:px-4 pb-3">
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] shadow-2xs">
                {/* Card Header: Title, Subtitle, and Guide Button */}
                <div className="flex items-center justify-between gap-2 border-b border-[#e3e6ea] dark:border-[#262b36] pb-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        Sovereign Signal Filter
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-sans truncate">
                        Tap a signal stage to filter live dispatches...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {trafficSignalFilter !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setTrafficSignalFilter('all')}
                        className="text-[10px] font-sans font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 transition cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openGuide('signals')}
                      className="px-2.5 py-1 rounded-lg text-xs font-sans font-medium bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 transition flex items-center gap-1 cursor-pointer"
                      title="Field Manual: 3-Signal Protocol (Speak, Serve, Be Heard)"
                    >
                      <HelpCircle size={12} className="text-slate-400" />
                      <span>Guide</span>
                    </button>
                  </div>
                </div>

                {/* 3 Interactive Signal Boxes (1. Speak · 2. Serve · 3. Be Heard) */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Card 1: 1. Speak (Red Beacon / Open / Graft) */}
                  <button
                    type="button"
                    onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'red' ? 'all' : 'red')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      trafficSignalFilter === 'red'
                        ? 'bg-rose-500/10 border-rose-500/60 ring-2 ring-rose-500/20'
                        : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] hover:border-rose-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <SignalGlyphRed active={trafficSignalFilter === 'red' || trafficSignalFilter === 'all'} className="w-4 h-4" />
                      <span className="text-xs sm:text-sm font-bold font-mono text-rose-600 dark:text-rose-400">{redCount}</span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        1. Speak
                      </div>
                      <div className="text-[9.5px] font-sans text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        Open / Graft
                      </div>
                    </div>
                  </button>

                  {/* Card 2: 2. Serve (Amber Beacon / In Progress) */}
                  <button
                    type="button"
                    onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'amber' ? 'all' : 'amber')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      trafficSignalFilter === 'amber'
                        ? 'bg-amber-500/10 border-amber-500/60 ring-2 ring-amber-500/20'
                        : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <SignalGlyphAmber active={trafficSignalFilter === 'amber' || trafficSignalFilter === 'all'} className="w-4 h-4" />
                      <span className="text-xs sm:text-sm font-bold font-mono text-amber-600 dark:text-amber-400">{amberCount}</span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        2. Serve
                      </div>
                      <div className="text-[9.5px] font-sans text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        In Progress
                      </div>
                    </div>
                  </button>

                  {/* Card 3: 3. Be Heard (Green Beacon / Proof Sealed) */}
                  <button
                    type="button"
                    onClick={() => setTrafficSignalFilter(trafficSignalFilter === 'green' ? 'all' : 'green')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      trafficSignalFilter === 'green'
                        ? 'bg-emerald-500/10 border-emerald-500/60 ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <SignalGlyphGreen active={trafficSignalFilter === 'green' || trafficSignalFilter === 'all'} className="w-4 h-4" />
                      <span className="text-xs sm:text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{greenCount}</span>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        3. Be Heard
                      </div>
                      <div className="text-[9.5px] font-sans text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        Proof Sealed
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Department Quick Pills Row (Finance · Local Gov · KCCA · NWSC · Umeme) */}
            <div className="px-3 sm:px-4 pb-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none border-t border-[#e3e6ea] dark:border-[#262b36] pt-2">
              {/* Finance (MoFPED) */}
              <button
                type="button"
                onClick={() => setSelectedDeptFilter(selectedDeptFilter === 'mofped' ? null : 'mofped')}
                className={`px-3 py-1 rounded-xl text-xs font-sans font-medium flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                  selectedDeptFilter === 'mofped'
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <CreditCard size={12} className="text-slate-400" />
                <span>Finance (MoFPED)</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-[#161a22] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono">
                  {mofpedCount}
                </span>
              </button>

              {/* Local Gov (LG) */}
              <button
                type="button"
                onClick={() => setSelectedDeptFilter(selectedDeptFilter === 'molg' ? null : 'molg')}
                className={`px-3 py-1 rounded-xl text-xs font-sans font-medium flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                  selectedDeptFilter === 'molg'
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <Landmark size={12} className="text-slate-400" />
                <span>Local Gov (LG)</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-[#161a22] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono">
                  {molgCount}
                </span>
              </button>

              {/* KCCA */}
              <button
                type="button"
                onClick={() => setSelectedDeptFilter(selectedDeptFilter === 'kcca' ? null : 'kcca')}
                className={`px-3 py-1 rounded-xl text-xs font-sans font-medium flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                  selectedDeptFilter === 'kcca'
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <Building2 size={12} className="text-slate-400" />
                <span>KCCA</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-[#161a22] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono">
                  {kccaCount}
                </span>
              </button>

              {/* NWSC */}
              <button
                type="button"
                onClick={() => setSelectedDeptFilter(selectedDeptFilter === 'nwsc' ? null : 'nwsc')}
                className={`px-3 py-1 rounded-xl text-xs font-sans font-medium flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                  selectedDeptFilter === 'nwsc'
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <Droplets size={12} className="text-slate-400" />
                <span>NWSC</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-[#161a22] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono">
                  {nwscCount}
                </span>
              </button>

              {/* Umeme */}
              <button
                type="button"
                onClick={() => setSelectedDeptFilter(selectedDeptFilter === 'umeme' ? null : 'umeme')}
                className={`px-3 py-1 rounded-xl text-xs font-sans font-medium flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                  selectedDeptFilter === 'umeme'
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <Zap size={12} className="text-slate-400" />
                <span>Umeme</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-[#161a22] text-slate-600 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono">
                  {umemeCount}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2b. CRITICAL: NEAR ME GRASSROOTS HIERARCHY CONTROLS (PARISH · WARD · GRASSROOT) */}
      {feedTab === 'near_me' && (
        <div className="bg-[#f8f9fa] dark:bg-[#0d101a] border-b border-slate-200/90 dark:border-[#1e2536] p-3 sm:p-3.5 space-y-2.5">
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
        <div className="bg-[#f8f9fa] dark:bg-[#0d101a] border-b border-slate-200/90 dark:border-[#1e2536] px-3.5 sm:px-4 py-2">
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
                    : 'bg-white dark:bg-[#111520] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1e2536] hover:border-emerald-500'
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
        <div className="bg-[#f8f9fa] dark:bg-[#0d101a] border-b border-slate-200/90 dark:border-[#1e2536] px-3.5 sm:px-4 py-2.5">
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
                      : 'bg-white dark:bg-[#111520] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1e2536] hover:border-slate-400'
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

      {/* 3. SOVEREIGN 3-WAY LIVE BARAZA STRIP (Following: Indigo · Trending: Amber · Near Me: Emerald) */}
      {townHalls && townHalls.length > 0 && (
        <div className="bg-[#f8f9fa] dark:bg-[#0d101a] border-b border-slate-200/90 dark:border-[#1e2536] px-3.5 sm:px-4 py-2.5">
          {/* Channel Filters & Active Room Row */}
          <div className="flex items-center justify-between gap-2.5 flex-wrap">
            {/* Left: 3-Way Category Channel Pills & Active Status */}
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 dark:bg-[#161c2a] border border-slate-300/80 dark:border-[#22293d]">
                <button
                  type="button"
                  onClick={() => setBarazaCategoryFilter('all')}
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold transition cursor-pointer ${
                    barazaCategoryFilter === 'all'
                      ? 'bg-white dark:bg-[#0a0d14] text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({liveBarazaRooms.length})
                </button>

                {/* Following Channel: Indigo */}
                <button
                  type="button"
                  onClick={() => setBarazaCategoryFilter('following')}
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                    barazaCategoryFilter === 'following'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/40'
                  }`}
                  title="Following Barazas: Monitored desks and subscribed departments"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span>Following</span>
                </button>

                {/* Trending Channel: Amber */}
                <button
                  type="button"
                  onClick={() => setBarazaCategoryFilter('trending')}
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                    barazaCategoryFilter === 'trending'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-amber-700 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-950/40'
                  }`}
                  title="Trending Barazas: High citizen attendance and national audit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Trending</span>
                </button>

                {/* Near Me Channel: Emerald */}
                <button
                  type="button"
                  onClick={() => setBarazaCategoryFilter('near_me')}
                  className={`px-2 py-0.5 rounded-md text-[10.5px] font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                    barazaCategoryFilter === 'near_me'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40'
                  }`}
                  title="Near Me Barazas: Grassroots parish and ward community assemblies"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Near Me</span>
                </button>
              </div>

              {/* Active Room Title & Live Pulse with Category Visual Colors */}
              {activeTopBaraza ? (
                <div
                  onClick={() => setActiveTownHall(activeTopBaraza)}
                  className="flex items-center gap-2 text-xs truncate cursor-pointer group"
                >
                  {/* Distinct Pulsing Radar Dot */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeMeta.pingBg}`} />
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeMeta.dotBg}`} />
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase shadow-2xs ${activeMeta.badgeBg}`}>
                    {activeMeta.shortLabel}
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:underline max-w-[220px] sm:max-w-md">
                    {activeTopBaraza.title}
                  </span>
                  <span className="text-slate-500 font-mono text-[10.5px] shrink-0">
                    · {activeTopBaraza.listeners_count || 1} tuned in
                  </span>
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-mono">
                  {upcomingBarazaRooms.length} Scheduled Assemblies
                </div>
              )}
            </div>

            {/* Right: Tune In, + Host & Expand buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {activeTopBaraza && (
                <button
                  type="button"
                  onClick={() => setActiveTownHall(activeTopBaraza)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs ${activeMeta.btnBg}`}
                >
                  <Radio size={12} />
                  <span>Tune In</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setHostBarazaModalOpen(true)}
                className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-[#161c2a] text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-[#20273a] text-xs font-semibold transition cursor-pointer border border-slate-300/80 dark:border-[#22293d]"
              >
                + Host
              </button>

              <button
                type="button"
                onClick={() => setShowBarazaDeck(!showBarazaDeck)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title="Expand 3-channel schedule and rooms"
              >
                {showBarazaDeck ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>

          {/* Expandable 3-Way Categorized Baraza Grid */}
          {showBarazaDeck && (
            <div className="mt-3 pt-3 border-t border-slate-200/90 dark:border-[#1e2536] space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Radio size={13} className="text-emerald-500" />
                  <span>Live &amp; Scheduled Baraza Assemblies by Channel</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-normal">
                  Showing {filteredLiveBarazaRooms.length} of {townHalls.length} rooms
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {filteredLiveBarazaRooms.map((th) => {
                  const m = getBarazaCategoryMeta(th.category);
                  return (
                    <div
                      key={th.id}
                      onClick={() => setActiveTownHall(th)}
                      className={`p-3 rounded-xl bg-white dark:bg-[#111520] border transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs hover:shadow-md ${m.cardBorder}`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono gap-1">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] flex items-center gap-1 ${m.badgeBg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${m.dotBg}`} />
                          <span>{m.shortLabel}</span>
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">{th.listeners_count} tuned in</span>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {th.title}
                        </div>
                        <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                          {th.dept_name}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-[#1e2536] flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400 truncate max-w-[140px]">{th.host_name}</span>
                        <span className={`font-bold ${m.accentText}`}>Tune In →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. CIVIC PERFORMANCE & ACCOUNTABILITY DOCKET (Department Section Aesthetic) */}
      <div className="p-3.5 sm:p-4.5 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36]">
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

      {/* 5. Active Filter Indicator Strip (when hashtag or dept filter active) */}
      {(activeHashtagFilter || selectedDeptFilter) && (
        <div className="px-3.5 sm:px-4 py-2 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 bg-white dark:bg-[#161a22]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-sans text-slate-500 font-medium">Active Filter:</span>
            {activeHashtagFilter && (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium border border-emerald-200 dark:border-emerald-800/60">
                <span>{activeHashtagFilter}</span>
                <button
                  type="button"
                  onClick={() => setActiveHashtagFilter(null)}
                  className="hover:text-emerald-950 dark:hover:text-white cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            {selectedDeptFilter && (
              <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium border border-blue-200 dark:border-blue-800/60">
                <span>Dept: @{selectedDeptFilter}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDeptFilter(null)}
                  className="hover:text-blue-950 dark:hover:text-white cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveHashtagFilter(null);
              setSelectedDeptFilter(null);
            }}
            className="text-[11px] font-sans font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 6. GIS MAP MODE (When explicitly toggled) */}
      {gisViewMode === 'MAP' && (
        <div className="p-3.5 sm:p-4 border-b border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22]">
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
      <div id="feed-list" className="p-3 sm:p-5 space-y-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] min-h-[60vh]">
        {display.length === 0 ? (
          <div className="py-20 text-center px-4 space-y-3 bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36] shadow-xs">
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

      {/* 8. FLOATING SWIPE NAVIGATOR HUD OR RED TRAFFIC LIGHT SIGNAL WHEN CITIZEN IS SPEAKING */}
      {isCitizenSpeaking ? (
        <div
          role="status"
          aria-live="assertive"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1f070b]/95 dark:bg-[#1f070b]/95 text-white backdrop-blur-md px-5 py-2.5 rounded-full border-2 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.6)] flex items-center gap-3 select-none animate-pulse ring-2 ring-rose-500/40"
        >
          {/* Red Traffic Light Signal Bulb with radar wave */}
          <div className="relative flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-rose-500 animate-ping absolute opacity-75" />
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-white flex items-center justify-center shadow-[0_0_10px_#f43f5e]" />
          </div>
          <span className="text-sm font-black tracking-widest text-white uppercase drop-shadow font-mono">
            SPEAK
          </span>
          <span className="text-[11px] text-rose-200 font-sans font-semibold pl-2 border-l border-rose-500/50 hidden xs:inline">
            Recording Field Testimony
          </span>
        </div>
      ) : display.length > 1 ? (
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
      ) : null}

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
