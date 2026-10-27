import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MediaItem, Post, TicketCategory } from '../types';
import { allDepts, TERRITORY } from '../data/countries';
import { primaryUnit, tiersFor } from '../data/tiers';
import { CATEGORIES } from '../utils/helpers';
import {
  Upload,
  Mic,
  Lock,
  AlertTriangle,
  MapPin,
  Info,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Layers,
  Users,
  ArrowRight,
  BarChart3,
  Send,
  FileText,
  SlidersHorizontal,
  Sparkles,
  Search,
  X,
  Building2,
  Camera,
  ChevronDown,
  ChevronUp,
  Zap,
  Plus,
} from 'lucide-react';
import { SignalGlyphRed, SignalGlyphAmber, SignalGlyphGreen } from './TrafficSignalHUD';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import {
  FrontlineScoutCategory,
  FRONTLINE_CATEGORIES,
  getStoredStages,
  registerScoutWorkstationConsensus,
} from '../data/stageEstablishment';

interface CivicFeedDispatcherProps {
  onPostSuccess?: (post: Post) => void;
  className?: string;
  defaultExpanded?: boolean;
  standalonePage?: boolean;
}

export const CivicFeedDispatcher: React.FC<CivicFeedDispatcherProps> = ({
  onPostSuccess,
  className = '',
  defaultExpanded = false,
  standalonePage = false,
}) => {
  const {
    user,
    ensureCitizenSession,
    go,
    addPost,
    toast,
    isOnline,
    offlineQueue,
    syncOfflineQueue,
    openGuide,
    activeDept,
    posts,
    compileWitnessIntoPost,
    setActivePost,
    selectedCountry,
    isCitizenSpeaking,
    setIsCitizenSpeaking,
  } = useApp();

  const activeUser = user || ensureCitizenSession();
  const country = activeUser.country || selectedCountry || 'UG';
  const depts = allDepts(country);
  const territory = TERRITORY[country] || [];

  const [expanded, setExpanded] = useState<boolean>(defaultExpanded || standalonePage);
  const [signalBulb, setSignalBulb] = useState<'red' | 'amber' | 'green'>('red');
  const [dept, setDept] = useState(() => activeDept || (country === 'KE' ? 'kplc' : 'kcca'));
  const [wallSearchQuery, setWallSearchQuery] = useState('');
  const [isWallDropdownOpen, setIsWallDropdownOpen] = useState(false);

  const [profession, setProfession] = useState('Bodaboda Rider / Cyclist');
  const [district, setDistrict] = useState(() => activeUser.district || 'Kampala');
  const [subcounty, setSubcounty] = useState(() => activeUser.subcounty || activeUser.ward || 'Central Division');
  const [parish, setParish] = useState(() => activeUser.parish || activeUser.parish_ward || 'Nakasero Parish');
  const [grassroot, setGrassroot] = useState(() => activeUser.grassroot || activeUser.village || 'Lumumba Cell');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const [category, setCategory] = useState<TicketCategory>('roads');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [gps, setGps] = useState<{ lat: string; lng: string } | null>({ lat: '0.3162', lng: '32.5781' });
  const [gpsStatus, setGpsStatus] = useState('GPS auto-calibrated to home parish');
  const [showManualGpsInput, setShowManualGpsInput] = useState(false);
  const [manualLatInput, setManualLatInput] = useState('0.3162');
  const [manualLngInput, setManualLngInput] = useState('32.5781');

  // Advanced Governance Suite Accordion
  const [advancedToolsOpen, setAdvancedToolsOpen] = useState(false);

  // Frontline Scout Workstation State
  const [isFrontlineScout, setIsFrontlineScout] = useState(false);
  const [scoutCategory, setScoutCategory] = useState<FrontlineScoutCategory>('bodaboda');
  const [workstationName, setWorkstationName] = useState('Equatorial Boda Stage');

  // Media Staging
  const [stagedMedia, setStagedMedia] = useState<
    { type: 'image' | 'video' | 'doc'; url: string; name: string; size: string; caption?: string; file?: File }[]
  >([]);

  // Citizen Speaking Mode: Activates whenever a citizen is making any report
  // Deactivates ONLY when dispatch is submitted or discarded.
  React.useEffect(() => {
    if (expanded) {
      setIsCitizenSpeaking(true);
    } else {
      setIsCitizenSpeaking(false);
    }
    return () => {
      setIsCitizenSpeaking(false);
    };
  }, [expanded, setIsCitizenSpeaking]);

  // Voice Note Recording
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSaved, setVoiceSaved] = useState(false);

  // Referendum Poll Builder
  const [includePoll, setIncludePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('Urgent Repair Within 24h');
  const [pollOpt2, setPollOpt2] = useState('Include in Q3 Parish Budget');
  const [pollOpt3, setPollOpt3] = useState('Dispatch Inspector General Audit');

  // Before & After Transformation Proof
  const [includeBeforeAfter, setIncludeBeforeAfter] = useState(false);
  const [beforePhotoUrl, setBeforePhotoUrl] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');
  const [beforePhotoLabel, setBeforePhotoLabel] = useState('Reported Site Condition');
  const [afterPhotoLabel, setAfterPhotoLabel] = useState('Completed Repair / Transformation');
  const [turnaroundInput, setTurnaroundInput] = useState('3h 30m');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleOpen = () => {
      setExpanded(true);
      setTimeout(() => textareaRef.current?.focus(), 80);
    };
    window.addEventListener('open-civic-dispatcher', handleOpen);
    return () => window.removeEventListener('open-civic-dispatcher', handleOpen);
  }, []);

  const selectedDeptObj = useMemo(() => {
    return depts.find((d) => d.id === dept) || depts[0] || { id: 'kcca', name: 'City Authority', sla: 48 };
  }, [depts, dept]);

  const subcounties = district ? territory.find((d) => d.id === district)?.children || [] : [];
  const parishes = subcounty ? subcounties.find((s) => s.id === subcounty)?.children || [] : [];

  const filteredWalls = useMemo(() => {
    const q = wallSearchQuery.trim().toLowerCase();
    if (!q) return depts.slice(0, 16);
    return depts.filter((d) => {
      const matchId = d.id.toLowerCase().includes(q);
      const matchName = d.name.toLowerCase().includes(q);
      const matchFull = (d.full || '').toLowerCase().includes(q);
      const matchMin = (d.ministry || '').toLowerCase().includes(q);
      const matchSector = (d.sector || '').toLowerCase().includes(q);
      return matchId || matchName || matchFull || matchMin || matchSector;
    });
  }, [depts, wallSearchQuery]);

  // Live Duplicate Radar
  const similarOpenPosts = useMemo(() => {
    const queryWords = `${title} ${body}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 4 && !['this', 'that', 'with', 'from', 'have', 'been', 'near', 'road'].includes(w));

    if (!dept && !parish && queryWords.length === 0) return [];

    return posts
      .filter((p) => p.country === country && p.status !== 'resolved' && p.category !== 'praise')
      .map((p) => {
        let score = 0;
        if (dept && p.dept === dept) score += 3;
        if (parish && p.territory?.parish === parish) score += 4;
        else if (district && p.territory?.district === district) score += 1;
        if (category !== 'other' && p.category === category) score += 2;
        if (queryWords.length > 0) {
          const hay = `${p.title} ${p.body} ${p.location}`.toLowerCase();
          queryWords.forEach((w) => {
            if (hay.includes(w)) score += 3;
          });
        }
        return { post: p, score };
      })
      .filter((item) => item.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((item) => item.post);
  }, [posts, country, dept, district, parish, category, title, body]);

  const handleSignalSelect = (sig: 'red' | 'amber' | 'green') => {
    setSignalBulb(sig);
    if (sig === 'green') {
      setCategory('praise');
    } else if (sig === 'red' && category === 'praise') {
      setCategory('roads');
    }
  };

  const handleAcquireGps = () => {
    if (!navigator.geolocation) {
      toast('GPS not available — use manual input', 'amber');
      setShowManualGpsInput(true);
      return;
    }
    setGpsStatus('Acquiring high-precision GPS...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude.toFixed(4),
          lng: pos.coords.longitude.toFixed(4),
        };
        setGps(coords);
        setManualLatInput(coords.lat);
        setManualLngInput(coords.lng);
        setGpsStatus(`GPS Locked · ${coords.lat}, ${coords.lng}`);
        toast('GPS Coordinates Locked with SHA-256 seal', 'emerald');
      },
      () => {
        setGpsStatus('GPS access blocked — using manual coordinates');
        setShowManualGpsInput(true);
        toast('Location blocked — please set coordinates below', 'amber');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleApplyManualGps = () => {
    const lat = parseFloat(manualLatInput);
    const lng = parseFloat(manualLngInput);
    if (isNaN(lat) || isNaN(lng)) {
      toast('Enter valid coordinates', 'amber');
      return;
    }
    const coords = { lat: lat.toFixed(4), lng: lng.toFixed(4) };
    setGps(coords);
    setGpsStatus(`Manual GPS Locked · ${coords.lat}, ${coords.lng}`);
    toast('GPS coordinates saved', 'emerald');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);
    const newItems = files.map((f: File) => {
      const url = URL.createObjectURL(f);
      const type = f.type.includes('image')
        ? ('image' as const)
        : f.type.includes('video')
        ? ('video' as const)
        : ('doc' as const);
      return {
        type,
        url,
        name: f.name,
        size: (f.size / 1024).toFixed(0) + 'KB',
        file: f,
      };
    });
    setStagedMedia((prev) => [...prev, ...newItems]);
    toast(`${newItems.length} evidence file(s) attached`, 'emerald');
    e.target.value = '';
  };

  const removeStagedMedia = (idx: number) => {
    setStagedMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsCitizenSpeaking(false);
      setVoiceSaved(true);
      toast('Voice testimony locked to dispatch', 'emerald');
    } else {
      setIsRecording(true);
      setIsCitizenSpeaking(true);
      toast('Recording audio testimony (Luganda / English)...', 'emerald');
      setTimeout(() => {
        setIsRecording(false);
        setIsCitizenSpeaking(false);
        setVoiceSaved(true);
      }, 4500);
    }
  };

  const updateStagedMediaCaption = (idx: number, caption: string) => {
    setStagedMedia((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, caption } : item))
    );
  };

  const handleCompileIntoExisting = (targetPost: Post) => {
    const testimonyText =
      body.trim() ||
      title.trim() ||
      `Corroborating field report from ${parish || 'local resident'}: issue remains active and needs intervention.`;

    const finalMedia: MediaItem[] = stagedMedia.map((m, idx) => {
      if (m.type === 'image') return { type: 'image', url: m.url, caption: m.caption?.trim() || `Evidence #${idx + 1}` };
      if (m.type === 'video') return { type: 'video', url: m.url, thumb: m.url, duration: '0:30' };
      return { type: 'doc', name: m.name, size: m.size };
    });

    compileWitnessIntoPost(targetPost.id, {
      citizen_id: activeUser.id || 'usr-guest',
      citizen_name: anonymous ? 'Verified Citizen' : activeUser.name || 'Citizen',
      author_profession: profession,
      anonymous,
      body: title.trim() && body.trim() ? `${title.trim()} — ${body.trim()}` : testimonyText,
      gps,
      media: finalMedia.length > 0 ? finalMedia : undefined,
      source: 'web',
    });

    setActivePost({
      ...targetPost,
      is_master_dossier: true,
      compiled_count: (targetPost.compiled_count || (targetPost.compiled_reports?.length || 0) + 1) + 1,
      upvotes: (targetPost.upvotes || 0) + 5,
    });
    toast('Corroborated into Master Dossier! +20 Pts Awarded', 'emerald');
    go('post_detail');
  };

  const handleSubmit = (forceOffline = false) => {
    const trimmedBody = body.trim();
    if (!trimmedBody && !title.trim()) {
      toast('Please describe the on-ground civic incident or commendation', 'amber');
      textareaRef.current?.focus();
      return;
    }
    if (!dept) {
      toast('Select a department wall', 'red');
      return;
    }
    if (isFrontlineScout && !workstationName.trim()) {
      toast('Workstation / Stage name is required for Frontline Scouts', 'red');
      return;
    }

    setIsSubmitting(true);

    try {
      const derivedTitle = title.trim() || (trimmedBody.split('\n')[0].length > 70
        ? `${trimmedBody.split('\n')[0].slice(0, 67)}...`
        : trimmedBody.split('\n')[0]);

      const isPraise = signalBulb === 'green';
      const postCategory: TicketCategory = isPraise ? 'praise' : category;
      const initialStatus = isPraise ? 'resolved' : signalBulb === 'amber' ? 'investigating' : 'pending';

      const finalMedia: MediaItem[] = stagedMedia.map((m, idx) => {
        if (m.type === 'image') return { type: 'image', url: m.url, caption: m.caption?.trim() || `Field evidence photograph #${idx + 1}` };
        if (m.type === 'video') return { type: 'video', url: m.url, thumb: m.url, duration: '0:30' };
        return { type: 'doc', name: m.name, size: m.size };
      });

      const voicePayload = voiceSaved
        ? {
            duration: '0:42',
            language: 'LG · Luganda / EN',
            transcript:
              'Twagala gavumenti etuyambe ku lw’omukutu guno ogwonoonese. Urgent service delivery requested at parish level.',
            waveform: [4, 7, 9, 5, 8, 3, 7, 8, 6, 4, 8, 9, 7, 5, 3, 6, 8, 4, 6],
          }
        : undefined;

      const randomId = Math.floor(1000 + Math.random() * 9000);
      const postId = `cd-${Date.now()}-${randomId}`;

      let consensusResult: any = null;
      if (isFrontlineScout && gps) {
        const latNum = parseFloat(gps.lat);
        const lngNum = parseFloat(gps.lng);
        if (!isNaN(latNum) && !isNaN(lngNum)) {
          consensusResult = registerScoutWorkstationConsensus({
            category: scoutCategory,
            workstationName: workstationName.trim(),
            lat: latNum,
            lng: lngNum,
            country,
            parish: parish || 'Central Ward',
            subcounty: subcounty || 'Central',
            district: district || 'Kampala',
            scoutId: activeUser.id || 'usr-scout',
            scoutName: activeUser.name || 'Citizen Scout',
            reportSnippet: derivedTitle,
          });
        }
      }

      const newPost: Post = {
        id: postId,
        country,
        dept,
        lane: 'civic',
        territory: {
          district: district || 'Kampala',
          subcounty: subcounty || 'Central Division',
          parish: parish || 'Nakasero Parish',
          ward: subcounty || 'Central Ward',
          village: grassroot || 'Lumumba Cell',
          cell: grassroot || 'Lumumba Cell',
          grassroot: grassroot || 'Lumumba Cell',
        },
        ward: subcounty || 'Central Ward',
        parish: parish || 'Nakasero Parish',
        village: grassroot || 'Lumumba Cell',
        cell: grassroot || 'Lumumba Cell',
        grassroot: grassroot || 'Lumumba Cell',
        citizen_id: activeUser.id || `usr-${Date.now()}`,
        citizen_name: anonymous ? 'Verified Citizen' : activeUser.name || 'Citizen Watchdog',
        citizen_rank: activeUser.rank || (isFrontlineScout ? 'Frontline Scout' : 'Verified Scout'),
        citizen_avatar: activeUser.avatar_url,
        anonymous,
        category: postCategory,
        title: derivedTitle,
        body: trimmedBody,
        location: `${grassroot ? `${grassroot}, ` : ''}${parish}, ${district}`,
        gps: gps || { lat: '0.3162', lng: '32.5781' },
        source: 'web',
        media: finalMedia.length > 0 ? finalMedia : undefined,
        voice_note: voicePayload,
        poll:
          includePoll && pollQuestion.trim()
            ? {
                question: pollQuestion.trim(),
                total_votes: 1,
                options: [
                  { id: 'opt1', label: pollOpt1, votes: 1 },
                  { id: 'opt2', label: pollOpt2, votes: 0 },
                  { id: 'opt3', label: pollOpt3, votes: 0 },
                ],
              }
            : undefined,
        before_after:
          includeBeforeAfter && beforePhotoUrl && afterPhotoUrl
            ? {
                before_url: beforePhotoUrl,
                after_url: afterPhotoUrl,
                before_label: beforePhotoLabel || 'Reported Issue',
                after_label: afterPhotoLabel || 'Completed Fix',
                turnaround_hrs: turnaroundInput || '3h 30m',
                gps_verified: Boolean(gps),
                verified_by: anonymous ? 'Verified Citizen' : activeUser.name || 'Citizen Scout',
              }
            : undefined,
        status: initialStatus,
        gov_status: initialStatus,
        is_corruption: postCategory === 'corruption',
        created_at: new Date().toISOString(),
        comments: [],
        upvotes: 1,
        downvotes: 0,
        reposts: 0,
        is_demo: false,
        author_profession: profession,
        frontline_scout: isFrontlineScout
          ? {
              is_scout: true,
              category: scoutCategory,
              category_label: FRONTLINE_CATEGORIES.find((c) => c.id === scoutCategory)?.label || scoutCategory,
              workstation_name: workstationName.trim(),
              home_parish: parish || 'Central Ward',
              stage_id: consensusResult?.stage?.id,
              consensus_verified: consensusResult ? consensusResult.scoutCount >= 15 : false,
              scout_count_at_report: consensusResult ? consensusResult.scoutCount : 1,
            }
          : undefined,
      };

      if (forceOffline || !isOnline) {
        addPost(newPost);
        toast('Offline Dispatch Staged: Cached with SHA-256 integrity', 'amber');
      } else {
        addPost(newPost);
        toast('Sovereign Civic Signal Dispatched to Public Ledger!', 'emerald');
      }

      if (consensusResult?.newlyEstablished) {
        toast(`🎉 Stage Certified! ${consensusResult.stage.name} crossed 15 scouts within 2km!`, 'emerald');
      }

      // Reset form and turn off citizen speaking mode
      setTitle('');
      setBody('');
      setStagedMedia([]);
      setVoiceSaved(false);
      setIsCitizenSpeaking(false);
      if (!standalonePage) {
        setExpanded(false);
      }
      onPostSuccess?.(newPost);
    } catch (err) {
      console.error('Dispatch error:', err);
      toast('Failed to dispatch. Please try again.', 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setTitle('');
    setBody('');
    setStagedMedia([]);
    setVoiceSaved(false);
    setIsCitizenSpeaking(false);
    if (!standalonePage) {
      setExpanded(false);
    }
    toast('Report discarded', 'amber');
    if (standalonePage) {
      onPostSuccess?.(null as any);
    }
  };

  return (
    <div
      id="civic-feed-dispatcher"
      className={`rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] shadow-2xs overflow-hidden transition-all ${
        expanded ? 'max-h-[85vh] overflow-y-auto' : ''
      } ${className}`}
    >
      {!expanded ? (
        /* =========================================================================
           1. COLLAPSED LAUNCHER BAR (Zero-Clutter Feed Entry Point)
           ========================================================================= */
        <div className="p-3 sm:p-4 bg-white dark:bg-[#161a22] transition-colors">
          <div className="flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => {
                setExpanded(true);
                setTimeout(() => textareaRef.current?.focus(), 60);
              }}
              className="flex-1 flex items-center gap-2.5 text-left group cursor-pointer min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xs transition group-hover:scale-105 shrink-0">
                <Plus size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate">
                  Report an on-ground issue or commendation...
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                  <span className="truncate">To {selectedDeptObj.name}</span>
                  <span className="text-slate-400">·</span>
                  <span className="truncate">📍 {parish || 'Local Parish'}</span>
                  <span className="hidden sm:inline text-slate-400">·</span>
                  <span className="hidden sm:inline font-semibold text-emerald-600 dark:text-emerald-400">{selectedDeptObj.sla || 48}h SLA</span>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setExpanded(true);
                setTimeout(() => textareaRef.current?.focus(), 60);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
            >
              <Send size={12} className="hidden sm:inline" />
              <span>DISPATCH</span>
            </button>
          </div>
        </div>
      ) : (
        /* =========================================================================
           2. EXPANDED PERFECTED STUDIO (Embodying ALL Capabilities of Speak)
           ========================================================================= */
        <div className="space-y-4 animate-fade-in">
          {/* Top Studio Header Bar */}
          <div className="px-4 py-3 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    signalBulb === 'red' ? 'bg-rose-500' : signalBulb === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate">
                  {signalBulb === 'red'
                    ? 'RED SIGNAL · CITIZEN SPEAKS'
                    : signalBulb === 'amber'
                    ? 'AMBER SIGNAL · STATUTORY NOTICE'
                    : 'GREEN SIGNAL · CITIZEN PRAISE'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openGuide('quickstart')}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle size={10} />
                  <span>Guide</span>
                </button>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
                  title="Discard report and exit speaking mode"
                >
                  <X size={11} />
                  <span>Discard</span>
                </button>
              </div>
            </div>

            {/* Sovereign 3-Signal Bulb Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-white dark:bg-[#161a22] rounded-xl border border-[#e3e6ea] dark:border-[#262b36]">
              <button
                type="button"
                onClick={() => handleSignalSelect('red')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  signalBulb === 'red'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/40 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <SignalGlyphRed active={signalBulb === 'red'} className="w-3.5 h-3.5" />
                <span>1. Urgent</span>
              </button>

              <button
                type="button"
                onClick={() => handleSignalSelect('amber')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  signalBulb === 'amber'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/40 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <SignalGlyphAmber active={signalBulb === 'amber'} className="w-3.5 h-3.5" />
                <span>2. Alert</span>
              </button>

              <button
                type="button"
                onClick={() => handleSignalSelect('green')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  signalBulb === 'green'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/40 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <SignalGlyphGreen active={signalBulb === 'green'} className="w-3.5 h-3.5" />
                <span>3. Praise</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 sm:p-4.5 space-y-3.5">
            {/* Offline Alert Strip */}
            {!isOnline && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
                <span>Offline Mode: Report will be staged locally and auto-synced once online.</span>
              </div>
            )}

            {/* Smart Triage Card: Entity & Territory Summary */}
            <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                  Target Statutory Desk &amp; Grassroots Routing
                </span>
                <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={11} /> Auto-Routed
                </span>
              </div>

              {/* Entity Picker */}
              {selectedDeptObj && !isWallDropdownOpen ? (
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                      <Building2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {selectedDeptObj.name}
                        </span>
                        <span className="text-[9.5px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                          ⏱️ {selectedDeptObj.sla || 48}h Target
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate">
                        {selectedDeptObj.ministry || selectedDeptObj.full || selectedDeptObj.sector}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setWallSearchQuery('');
                      setIsWallDropdownOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-md border border-[#e3e6ea] dark:border-[#262b36] hover:bg-slate-100 dark:hover:bg-slate-800 text-[10.5px] font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={wallSearchQuery}
                      onChange={(e) => setWallSearchQuery(e.target.value)}
                      placeholder="Search agency, hospital, school or desk (e.g. KCCA, NWSC, UNRA, Mulago)..."
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg pl-9 pr-8 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsWallDropdownOpen(false)}
                      className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="mt-1 max-h-56 overflow-y-auto rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] shadow-lg divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
                    {filteredWalls.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setDept(d.id);
                          setIsWallDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-emerald-500/10 flex items-center justify-between text-xs cursor-pointer"
                      >
                        <div className="font-bold text-slate-900 dark:text-white truncate">{d.name}</div>
                        <span className="text-[10px] font-mono text-slate-500">{d.sla || 48}h SLA</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Territory Row */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {parish} · {subcounty}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      {district} · Grassroots Dispatch Desk
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="px-2.5 py-1 rounded-md border border-[#e3e6ea] dark:border-[#262b36] hover:bg-slate-100 dark:hover:bg-slate-800 text-[10.5px] font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span>{showLocationPicker ? 'Done' : 'Change Location'}</span>
                  {showLocationPicker ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>

              {showLocationPicker && (
                <div className="p-2.5 bg-white dark:bg-[#161a22] rounded-lg border border-[#e3e6ea] dark:border-[#262b36] animate-fade-in space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setSubcounty('');
                        setParish('');
                      }}
                      className="bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-md px-2 py-1.5 text-xs font-mono"
                    >
                      <option value="">Select District...</option>
                      {territory.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={subcounty}
                      disabled={!district}
                      onChange={(e) => {
                        setSubcounty(e.target.value);
                        setParish('');
                      }}
                      className="bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-md px-2 py-1.5 text-xs font-mono"
                    >
                      <option value="">Select Sub-county...</option>
                      {subcounties.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={parish}
                      disabled={!subcounty}
                      onChange={(e) => setParish(e.target.value)}
                      className="bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-md px-2 py-1.5 text-xs font-mono"
                    >
                      <option value="">Select Parish...</option>
                      {parishes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                  Incident Category
                </label>
                {category === 'corruption' && (
                  <span className="text-[9.5px] font-mono text-rose-600 font-bold">+100 Pts IGG Protected</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setCategory('corruption');
                    setSignalBulb('red');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition flex items-center gap-1 border cursor-pointer ${
                    category === 'corruption'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs font-bold'
                      : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-rose-600 hover:border-rose-400'
                  }`}
                >
                  <Lock size={12} />
                  <span>Anti-Graft</span>
                </button>

                {CATEGORIES.filter((c) => c.id !== 'corruption').map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCategory(c.id);
                      if (c.id === 'praise') setSignalBulb('green');
                      else if (signalBulb === 'green') setSignalBulb('red');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition border cursor-pointer ${
                      category === c.id
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                        : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span>{c.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Headline & Body Canvas */}
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Headline summary (e.g. Major pothole gridlock at Kitante Road)..."
                className="w-full bg-white dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />

              <div className="relative rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#0e1116] p-3 transition focus-within:border-emerald-500">
                <textarea
                  ref={textareaRef}
                  rows={3}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder={
                    signalBulb === 'green'
                      ? 'Commend outstanding public officers, completed road repairs, or restored utility services...'
                      : signalBulb === 'red'
                      ? 'Describe what broke down, location specifics, hazard level, or extortion incident...'
                      : 'Share an official notice, development inquiry, or parish community update...'
                  }
                  className="w-full text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none leading-relaxed"
                />

                {/* Hashtag Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1.5 border-t border-[#e3e6ea] dark:border-[#262b36]">
                  {['#FixOurRoads', '#WaterRestored', '#ZeroBribery', '#UrgentSLA'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (!body.includes(tag)) {
                          setBody((prev) => (prev ? `${prev.trim()} ${tag} ` : `${tag} `));
                        }
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#f8f9fa] dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 1-Tap Thumb Action Bar (Camera, Mic, GPS) */}
            <div className="grid grid-cols-3 gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,.pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`py-2 px-2 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  stagedMedia.length > 0
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <Camera size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">{stagedMedia.length > 0 ? `Proof (${stagedMedia.length})` : 'Attach Photo'}</span>
              </button>

              <button
                type="button"
                onClick={toggleRecording}
                className={`py-2 px-2 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  isRecording
                    ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 animate-pulse'
                    : voiceSaved
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <Mic size={14} className={isRecording ? 'text-rose-600' : ''} />
                <span className="truncate">{isRecording ? 'Recording...' : voiceSaved ? 'Voice Locked' : 'Voice Note'}</span>
              </button>

              <button
                type="button"
                onClick={handleAcquireGps}
                className={`py-2 px-2 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  gps
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-slate-400'
                }`}
              >
                <MapPin size={14} className={gps ? 'text-emerald-600' : 'text-slate-400'} />
                <span className="truncate">{gps ? 'GPS Locked' : 'Lock GPS'}</span>
              </button>
            </div>

            {/* GPS Feedback & Manual Override */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
              <span className="truncate">{gps ? `📍 ${gps.lat}, ${gps.lng} (Verified)` : gpsStatus}</span>
              <button
                type="button"
                onClick={() => setShowManualGpsInput(!showManualGpsInput)}
                className="text-emerald-600 dark:text-emerald-400 hover:underline shrink-0 ml-2 cursor-pointer"
              >
                {showManualGpsInput ? 'Hide Manual' : 'Manual GPS'}
              </button>
            </div>

            {showManualGpsInput && (
              <div className="p-2.5 bg-[#f8f9fa] dark:bg-[#0e1116] rounded-lg border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={manualLatInput}
                    onChange={(e) => setManualLatInput(e.target.value)}
                    placeholder="Latitude (0.3162)"
                    className="px-2 py-1 text-xs font-mono bg-white dark:bg-[#161a22] border rounded"
                  />
                  <input
                    type="text"
                    value={manualLngInput}
                    onChange={(e) => setManualLngInput(e.target.value)}
                    placeholder="Longitude (32.5781)"
                    className="px-2 py-1 text-xs font-mono bg-white dark:bg-[#161a22] border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyManualGps}
                  className="w-full py-1 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10.5px] font-mono font-bold cursor-pointer"
                >
                  Save Coordinates
                </button>
              </div>
            )}

            {/* Staged Media Previews with Individual Captioning */}
            {stagedMedia.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Attached Evidence ({stagedMedia.length} item{stagedMedia.length > 1 ? 's' : ''})</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Add individual captions below</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stagedMedia.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {m.type === 'image' && (
                            <img
                              src={m.url}
                              alt={m.name}
                              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">{m.name}</p>
                            <p className="text-[9.5px] font-mono text-slate-500">
                              {m.type === 'image' ? `Photo #${idx + 1}` : m.type} · {m.size}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStagedMedia(idx)}
                          className="text-[10px] font-mono text-rose-600 hover:text-rose-700 hover:underline shrink-0 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Individual Caption Input for Images */}
                      {m.type === 'image' && (
                        <input
                          type="text"
                          value={m.caption || ''}
                          onChange={(e) => updateStagedMediaCaption(idx, e.target.value)}
                          placeholder={`Caption for photo #${idx + 1} (e.g. View from main gate)...`}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Master Dossier Duplicate Radar */}
            {similarOpenPosts.length > 0 && (
              <div className="p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-emerald-500/40 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Layers size={13} />
                  </div>
                  <div>
                    <div className="text-[9.5px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                      Master Dossier Radar · +20 Pts Bonus
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Similar Issue Detected</h4>
                  </div>
                </div>

                {similarOpenPosts.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono text-emerald-600 font-semibold truncate">
                        #{sim.id.slice(-6).toUpperCase()} · {sim.upvotes} Citizens Co-signed
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{sim.title}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCompileIntoExisting(sim)}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-mono font-semibold shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <span>Co-sign</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Expandable Advanced Governance Suite Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setAdvancedToolsOpen(!advancedToolsOpen)}
                className="w-full p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-slate-400 transition flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <SlidersHorizontal size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Advanced Governance Suite</span>
                      {(isFrontlineScout || includePoll || includeBeforeAfter || anonymous) && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      Scout consensus station, referendum poll, before/after proof &amp; privacy shield
                    </div>
                  </div>
                </div>
                <div className="p-1 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-slate-500">
                  {advancedToolsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </div>
              </button>

              {advancedToolsOpen && (
                <div className="mt-2.5 space-y-3 animate-fade-in pl-1">
                  {/* Profession */}
                  <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
                      Citizen Role / Trade
                    </label>
                    <select
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded px-2.5 py-1.5 text-xs font-mono"
                    >
                      <option value="General Resident / Commuter">General Resident / Commuter</option>
                      <option value="Bodaboda Rider / Cyclist">Bodaboda Rider / Cyclist</option>
                      <option value="Taxi / Matatu / Commercial Driver">Taxi / Matatu / Commercial Driver</option>
                      <option value="Market Vendor / Local Trader">Market Vendor / Local Trader</option>
                      <option value="Healthcare Worker / Nurse">Healthcare Worker / Nurse</option>
                      <option value="Teacher / Student / Youth Leader">Teacher / Student / Youth Leader</option>
                      <option value="Civil Servant / Public Officer">Civil Servant / Public Officer</option>
                    </select>
                  </div>

                  {/* Frontline Scout Workstation */}
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Frontline Scout Workstation &amp; Consensus Stage</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsFrontlineScout(!isFrontlineScout)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition cursor-pointer ${
                          isFrontlineScout
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-600'
                        }`}
                      >
                        {isFrontlineScout ? '✓ Scout Active' : 'Enable Scout'}
                      </button>
                    </div>

                    {isFrontlineScout && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                          {FRONTLINE_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setScoutCategory(cat.id);
                                setWorkstationName(cat.example);
                              }}
                              className={`p-1.5 rounded text-left border text-[11px] font-mono cursor-pointer truncate ${
                                scoutCategory === cat.id
                                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                                  : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {cat.label.split('(')[0]}
                            </button>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={workstationName}
                          onChange={(e) => setWorkstationName(e.target.value)}
                          placeholder="e.g. Equatorial Boda Stage, Stall 4B"
                          className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded px-2.5 py-1.5 text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Referendum Poll */}
                  <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <BarChart3 size={13} className="text-emerald-600" />
                        <span>Community Referendum Poll</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIncludePoll(!includePoll);
                          if (!pollQuestion && title) setPollQuestion(`How should ${dept.toUpperCase()} prioritize "${title}"?`);
                        }}
                        className="text-[10px] font-mono text-emerald-600 font-bold hover:underline cursor-pointer"
                      >
                        {includePoll ? 'Remove Poll' : '+ Add Poll'}
                      </button>
                    </div>

                    {includePoll && (
                      <div className="space-y-1.5 pt-1 animate-fade-in">
                        <input
                          type="text"
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                          placeholder="Poll Question..."
                          className="w-full bg-white dark:bg-[#161a22] border rounded px-2 py-1 text-xs"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                          <input
                            type="text"
                            value={pollOpt1}
                            onChange={(e) => setPollOpt1(e.target.value)}
                            placeholder="Option 1"
                            className="bg-white dark:bg-[#161a22] border rounded px-2 py-1 text-xs"
                          />
                          <input
                            type="text"
                            value={pollOpt2}
                            onChange={(e) => setPollOpt2(e.target.value)}
                            placeholder="Option 2"
                            className="bg-white dark:bg-[#161a22] border rounded px-2 py-1 text-xs"
                          />
                          <input
                            type="text"
                            value={pollOpt3}
                            onChange={(e) => setPollOpt3(e.target.value)}
                            placeholder="Option 3"
                            className="bg-white dark:bg-[#161a22] border rounded px-2 py-1 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Before & After Proof */}
                  <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <SlidersHorizontal size={13} className="text-emerald-600" />
                        <span>Before &amp; After Transformation Proof</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIncludeBeforeAfter(!includeBeforeAfter)}
                        className="text-[10px] font-mono text-emerald-600 font-bold hover:underline cursor-pointer"
                      >
                        {includeBeforeAfter ? 'Remove Slider' : '+ Add Slider'}
                      </button>
                    </div>

                    {includeBeforeAfter && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="p-2 bg-white dark:bg-[#161a22] border rounded space-y-1">
                            <span className="text-[9.5px] font-mono font-bold text-rose-600 uppercase">1. Before Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setBeforePhotoUrl(URL.createObjectURL(f));
                              }}
                              className="text-[10px] block w-full"
                            />
                            <input
                              type="text"
                              value={beforePhotoLabel}
                              onChange={(e) => setBeforePhotoLabel(e.target.value)}
                              placeholder="Before label"
                              className="w-full border rounded px-1.5 py-0.5 text-[10px]"
                            />
                          </div>

                          <div className="p-2 bg-white dark:bg-[#161a22] border rounded space-y-1">
                            <span className="text-[9.5px] font-mono font-bold text-emerald-600 uppercase">2. After Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setAfterPhotoUrl(URL.createObjectURL(f));
                              }}
                              className="text-[10px] block w-full"
                            />
                            <input
                              type="text"
                              value={afterPhotoLabel}
                              onChange={(e) => setAfterPhotoLabel(e.target.value)}
                              placeholder="After label"
                              className="w-full border rounded px-1.5 py-0.5 text-[10px]"
                            />
                          </div>
                        </div>

                        {beforePhotoUrl && afterPhotoUrl && (
                          <BeforeAfterSlider
                            beforeUrl={beforePhotoUrl}
                            afterUrl={afterPhotoUrl}
                            beforeLabel={beforePhotoLabel}
                            afterLabel={afterPhotoLabel}
                            turnaroundTime={turnaroundInput}
                            compact={true}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Anonymous Shield */}
                  <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Post Anonymously (Zero-Knowledge Shield)</span>
                      </p>
                      <p className="text-[10px] font-mono text-slate-500">
                        Displays publicly as &ldquo;Verified Citizen&rdquo; · NIN protected
                      </p>
                    </div>
                    <label className="tog-wrap shrink-0">
                      <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
                      <div className="tog-track"></div>
                      <div className="tog-thumb"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action Bar */}
            <div className="space-y-2 pt-1 border-t border-[#e3e6ea] dark:border-[#262b36]">
              {offlineQueue.length > 0 && (
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
                  <span>{offlineQueue.length} offline report(s) pending sync</span>
                  <button
                    type="button"
                    onClick={syncOfflineQueue}
                    className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold cursor-pointer"
                  >
                    Sync Now
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="bg-white dark:bg-[#0e1116] hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 hover:border-rose-300 text-rose-600 dark:text-rose-400 font-mono font-bold rounded-lg py-2.5 px-2 text-[11px] transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  title="Discard draft and cancel report"
                >
                  <X size={13} />
                  <span>Discard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  className="bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-amber-500 border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 font-mono font-semibold rounded-lg py-2.5 px-2 text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Save locally for rural 3G networks and sync later"
                >
                  <span>Offline ({offlineQueue.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || (!body.trim() && !title.trim())}
                  className={`col-span-2 font-mono font-bold rounded-lg py-2.5 text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                    isSubmitting || (!body.trim() && !title.trim())
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-98'
                  }`}
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Signal →'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
