import React, { useState } from 'react';
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
  Bike,
  Layers,
  Users,
  ArrowRight,
  BarChart3,
  Send,
  FileText,
} from 'lucide-react';

export const ComposeView: React.FC = () => {
  const {
    user,
    go,
    addPost,
    toast,
    isOnline,
    offlineQueue,
    syncOfflineQueue,
    queueOfflinePost,
    openGuide,
    activeDept,
    posts,
    compileWitnessIntoPost,
    setActivePost,
    selectedCountry,
  } = useApp();

  const country = user?.country || selectedCountry || 'UG';
  const depts = allDepts(country);
  const territory = TERRITORY[country] || [];

  const [dept, setDept] = useState(activeDept || '');
  const [profession, setProfession] = useState('Bodaboda Rider / Cyclist');
  const [othersText, setOthersText] = useState('');
  const [district, setDistrict] = useState('');
  const [subcounty, setSubcounty] = useState('');
  const [parish, setParish] = useState('');
  const [category, setCategory] = useState<TicketCategory>('other');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [gps, setGps] = useState<{ lat: string; lng: string } | null>(null);
  const [gpsStatus, setGpsStatus] = useState('GPS optional — tap to acquire');

  // Evidence Staging
  const [stagedMedia, setStagedMedia] = useState<
    { type: 'image' | 'video' | 'doc'; url: string; name: string; size: string; file: File }[]
  >([]);

  // Voice Note Recording
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSaved, setVoiceSaved] = useState(false);
  const [voiceDuration] = useState('0:42');
  const [voiceLanguage] = useState('Local Vernacular / English');
  const [voiceTranscript] = useState('');

  // Optional Interactive Civic Poll Builder
  const [includePoll, setIncludePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('Urgent Repair Within 24h');
  const [pollOpt2, setPollOpt2] = useState('Include in Q3 Parish Budget');
  const [pollOpt3, setPollOpt3] = useState('Dispatch Inspector General Audit');

  const subcounties = district ? territory.find((d) => d.id === district)?.children || [] : [];
  const parishes = subcounty ? subcounties.find((s) => s.id === subcounty)?.children || [] : [];

  // Live Pre-Submission Issue Clustering & Master Dossier Detection Radar
  const similarOpenPosts = React.useMemo(() => {
    const queryWords = `${title} ${body}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(
        (w) =>
          w.length >= 4 &&
          !['this', 'that', 'with', 'from', 'have', 'been', 'near', 'road', 'street'].includes(w)
      );

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
      .sort(
        (a, b) =>
          b.score - a.score || (b.post.compiled_count || 1) - (a.post.compiled_count || 1)
      )
      .slice(0, 3)
      .map((item) => item.post);
  }, [posts, country, dept, district, parish, category, title, body]);

  const handleCompileIntoExisting = (targetPost: Post) => {
    const testimonyText =
      body.trim() ||
      title.trim() ||
      `Corroborating field report from ${parish || targetPost.location || 'local resident'}: issue remains active and requires urgent intervention.`;

    const finalMedia: MediaItem[] = stagedMedia.map((m) => {
      if (m.type === 'image') return { type: 'image', url: m.url, caption: '' };
      if (m.type === 'video') return { type: 'video', url: m.url, thumb: m.url, duration: '0:30' };
      return { type: 'doc', name: m.name, size: m.size };
    });

    compileWitnessIntoPost(targetPost.id, {
      citizen_id: user?.id || 'usr-guest',
      citizen_name: anonymous ? 'Verified Citizen' : user?.name || 'Citizen',
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
      compiled_count:
        (targetPost.compiled_count || (targetPost.compiled_reports?.length || 0) + 1) + 1,
      upvotes: (targetPost.upvotes || 0) + 5,
      compiled_reports: [
        ...(targetPost.compiled_reports || []),
        {
          id: `wr-${Date.now()}`,
          citizen_id: user?.id || 'usr-guest',
          citizen_name: anonymous ? 'Verified Citizen' : user?.name || 'Citizen',
          author_profession: profession,
          anonymous,
          body: title.trim() && body.trim() ? `${title.trim()} — ${body.trim()}` : testimonyText,
          gps,
          media: finalMedia.length > 0 ? finalMedia : undefined,
          created_at: new Date().toISOString(),
          source: 'web',
        },
      ],
    });
    go('post_detail');
  };

  const handleAcquireGps = () => {
    if (!navigator.geolocation) {
      toast('GPS not available on this browser', 'amber');
      return;
    }
    setGpsStatus('Acquiring...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude.toFixed(4),
          lng: pos.coords.longitude.toFixed(4),
        };
        setGps(coords);
        setGpsStatus(`GPS Locked · ${coords.lat}, ${coords.lng}`);
      },
      () => {
        setGpsStatus('GPS denied — submitting without coordinates');
      }
    );
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
    e.target.value = '';
  };

  const removeStagedMedia = (idx: number) => {
    setStagedMedia((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceSaved(true);
      toast('Voice note saved', 'emerald');
    } else {
      if (!navigator.mediaDevices?.getUserMedia) {
        toast('Mic not available', 'amber');
        return;
      }
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast('Recording voice note...', 'emerald');
        })
        .catch(() => {
          toast('Mic access denied — using audio simulation', 'amber');
          setIsRecording(true);
          setTimeout(() => {
            setIsRecording(false);
            setVoiceSaved(true);
          }, 3000);
        });
    }
  };

  const handleSubmit = (forceOfflineQueue = false) => {
    if (!dept) {
      toast('Select a department wall', 'red');
      return;
    }
    if (dept === 'others' && !othersText.trim()) {
      toast('Describe the unlisted entity', 'red');
      return;
    }
    if (!parish) {
      toast(`Select ${primaryUnit(country, district)}`, 'red');
      return;
    }
    if (!title.trim()) {
      toast('Add a headline', 'red');
      return;
    }
    if (!body.trim()) {
      toast('Describe the issue in detail', 'red');
      return;
    }

    const dRef = depts.find((item) => item.id === dept);
    const isCorrupt = category === 'corruption';

    const finalMedia: MediaItem[] = stagedMedia.map((m) => {
      if (m.type === 'image') return { type: 'image', url: m.url, caption: '' };
      if (m.type === 'video') return { type: 'video', url: m.url, thumb: m.url, duration: '0:30' };
      return { type: 'doc', name: m.name, size: m.size };
    });

    if (voiceSaved) {
      finalMedia.push({
        type: 'voice',
        duration: voiceDuration,
        waveform: [3, 7, 4, 9, 5, 8, 3, 6, 9, 4, 7, 5, 8, 3, 6, 9, 4, 2, 6, 8, 5, 3, 7, 4],
      });
    }

    const extractedTags = body.match(/#[a-zA-Z0-9_]+/g) || [];
    const pollOptionsClean = [pollOpt1, pollOpt2, pollOpt3]
      .map((o) => o.trim())
      .filter(Boolean);

    const post: Post = {
      id: 'p-' + Date.now(),
      country,
      dept: dept === 'others' ? 'others' : dept,
      lane: dept === 'others' ? 'civic' : dRef?.lane || 'civic',
      territory: { district, subcounty, parish },
      citizen_id: user?.id || 'usr-guest',
      citizen_name: anonymous ? 'Verified Citizen' : user?.name || 'Citizen',
      citizen_rank: 'Observer',
      anonymous,
      category,
      title: title.trim(),
      body: body.trim(),
      location: parish,
      gps,
      source: 'web',
      media: finalMedia,
      status: 'pending',
      gov_status: 'pending',
      is_corruption: isCorrupt,
      created_at: new Date().toISOString(),
      comments: [],
      upvotes: 0,
      downvotes: 0,
      reposts: 0,
      hashtags: extractedTags.length > 0 ? extractedTags : undefined,
      voice_note: voiceSaved
        ? {
            duration: voiceDuration,
            language: voiceLanguage,
            transcript:
              voiceTranscript.trim() ||
              `“Verified citizen audio report from ${parish}: ${title.trim()}. Immediate field inspection requested.”`,
          }
        : undefined,
      poll:
        includePoll && pollQuestion.trim() && pollOptionsClean.length >= 2
          ? {
              question: pollQuestion.trim(),
              total_votes: 1,
              ends_at: '48h remaining',
              options: pollOptionsClean.map((lbl, idx) => ({
                id: `opt-${idx + 1}`,
                label: lbl,
                votes: idx === 0 ? 1 : 0,
              })),
            }
          : undefined,
      author_profession: profession,
      citizen_satisfied: null,
      escalated: false,
    };

    if (!isOnline || forceOfflineQueue) {
      queueOfflinePost(post);
    } else {
      addPost(post);
      if (isCorrupt) {
        toast('Corruption report filed — IGG notified', 'amber');
      }
    }
    go('feed');
  };

  return (
    <div className="px-3.5 sm:px-5 pt-4 pb-16 max-w-2xl mx-auto space-y-4 animate-fade-in text-slate-900 dark:text-slate-100">
      {/* Main Studio Card */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
        {/* Top Studio Header Bar — Uncongested Layout */}
        <div className="px-4 py-3.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5">
          {/* Row 1: Signal Eyebrow & Guide Button */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#e3e6ea] dark:border-[#262b36]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 truncate">
                RED SIGNAL · CITIZEN SPEAKS
              </span>
            </div>

            <button
              type="button"
              onClick={() => openGuide('quickstart')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] hover:border-emerald-500 border border-[#e3e6ea] dark:border-[#262b36] text-emerald-600 dark:text-emerald-400 text-[10.5px] font-mono font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
            >
              <HelpCircle size={11} />
              <span>Field Guide</span>
            </button>
          </div>

          {/* Row 2: Full-Width Unobstructed Studio Title */}
          <div className="flex items-start gap-2.5 pt-0.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <FileText size={16} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                Citizen Speak &amp; Statutory Dispatch Studio
              </h1>
              <p className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Permanent SHA-256 public record · Service delivery is your right
              </p>
            </div>
          </div>

          {/* 4-Step Citizen Reporting Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 text-center pt-1">
            {[
              { step: '1. Entity', ok: Boolean(dept) },
              { step: '2. Parish', ok: Boolean(parish) },
              { step: '3. Evidence', ok: Boolean(body) },
              { step: '4. Dispatch', ok: Boolean(dept && parish && body) },
            ].map((s, idx) => (
              <div
                key={idx}
                className={`py-1 px-1.5 rounded-md border text-[10px] font-mono font-semibold transition-colors ${
                  s.ok
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-500'
                }`}
              >
                {s.ok ? `✓ ${s.step}` : s.step}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {!isOnline && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
              <span>
                <strong>Offline Mode Active:</strong> Your report will be queued locally and auto-published once online.
              </span>
            </div>
          )}

          {/* Section 1: Target Wall & Reporter Profession */}
          <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                1. Target Statutory Desk or Service Wall
              </label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select institution, provider or desk...</option>
                <optgroup label="── Government & Statutory Desks">
                  {depts
                    .filter((d) => d.lane === 'civic' || d.category === 'government')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.ministry || d.full}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── Schools & Education">
                  {depts
                    .filter((d) => d.category === 'education')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.full})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── Hospitals & Healthcare">
                  {depts
                    .filter((d) => d.category === 'health')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.full}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── Hospitality & Dining">
                  {depts
                    .filter((d) => d.category === 'hospitality')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.full}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── Finance, Banks & SACCOs">
                  {depts
                    .filter((d) => d.category === 'finance')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.full}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── Transport & Transit SACCOs">
                  {depts
                    .filter((d) => d.category === 'transport')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.full}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── Housing, Plazas & Markets">
                  {depts
                    .filter((d) => d.category === 'housing')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.full}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── Utilities & Telecom">
                  {depts
                    .filter((d) => d.category === 'utility' || d.category === 'telecom')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.full}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── CSOs, NGOs & Contractors">
                  {depts
                    .filter((d) => d.category === 'cso' || d.category === 'contractor')
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.full}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="── Unlisted Entity">
                  <option value="others">Others / Register &amp; Report Unlisted Provider</option>
                </optgroup>
              </select>

              {dept === 'others' && (
                <div className="space-y-1 mt-2">
                  <input
                    type="text"
                    value={othersText}
                    onChange={(e) => setOthersText(e.target.value)}
                    placeholder="e.g. Yaka token vendor, Private contractor"
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono"
                  />
                  <p className="text-[10px] font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle size={11} /> Tagged [Unverified] · auto-CC&apos;d to relevant ministry
                  </p>
                </div>
              )}
            </div>

            {/* Reporter Profession / Frontline Field Scout Category */}
            <div className="pt-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  <Bike size={12} className="text-amber-600 dark:text-amber-400" />
                  <span>Reporter Profession · Field Scout Tag</span>
                </label>
                <span className="text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Perk Vault Eligible
                </span>
              </div>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Bodaboda Rider / Cyclist">
                  Bodaboda Rider / Cyclist (Frontline Road Scout · Fuel &amp; Airtime Eligible)
                </option>
                <option value="Taxi / Matatu / Commercial Driver">
                  Taxi / Matatu / Commercial Driver (Public Transit &amp; Highway Scout)
                </option>
                <option value="Market Vendor / Local Trader">
                  Market Vendor / Local Trader (Public Space &amp; Sanitation Scout)
                </option>
                <option value="Healthcare Worker / Nurse / Clinical Staff">
                  Healthcare Worker / Nurse / Clinical Staff (Health Service Monitor)
                </option>
                <option value="Teacher / Student / Youth Leader">
                  Teacher / Student / Youth Leader (Education &amp; Community Watch)
                </option>
                <option value="Artisan / Builder / Field Technician">
                  Artisan / Builder / Field Technician (Infrastructure Quality Inspector)
                </option>
                <option value="Civil Servant / Public Officer">
                  Civil Servant / Public Officer (Internal Oversight &amp; Whistleblower)
                </option>
                <option value="General Resident / Commuter">
                  General Resident / Commuter (Community Citizen)
                </option>
              </select>
            </div>
          </div>

          {/* Section 2: Territory Cascading Selector */}
          <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
              2. Territory Routing — District › Sub-County › Parish
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setSubcounty('');
                  setParish('');
                }}
                className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select {tiersFor(country)[1]?.unit || 'District'}...</option>
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
                className={`w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 ${
                  district ? '' : 'opacity-40'
                }`}
              >
                <option value="">Select {tiersFor(country)[2]?.unit || 'Sub-county'}...</option>
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
                className={`w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 ${
                  subcounty ? '' : 'opacity-40'
                }`}
              >
                <option value="">Select {primaryUnit(country, district)}...</option>
                {parishes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Info size={11} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Selecting your {primaryUnit(country, district)} routes directly to your grassroots Parish Chief &amp; Town Clerk desk.
              </span>
            </p>
          </div>

          {/* Section 3: Category & Issue Report */}
          <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1.5">
                3. Issue Category
              </label>
              <button
                type="button"
                onClick={() => setCategory('corruption')}
                className={`w-full mb-2 py-2 px-3 rounded-lg border text-xs font-mono font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
                  category === 'corruption'
                    ? 'border-rose-500 text-rose-700 dark:text-rose-300 bg-rose-500/10'
                    : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-rose-500/50'
                }`}
              >
                <Lock size={13} />
                <span>Report Corruption / Misuse of Public Funds (+100 pts · Encrypted IGG Route)</span>
              </button>

              <div className="grid grid-cols-4 gap-1.5">
                {CATEGORIES.filter((c) => c.id !== 'corruption').map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`py-2 px-1 rounded-lg border text-[10px] font-mono transition-colors leading-tight text-center cursor-pointer ${
                      category === c.id
                        ? 'bg-emerald-600 border-emerald-600 text-white font-semibold'
                        : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-300 hover:border-emerald-500 font-medium'
                    }`}
                  >
                    {c.label.split(' ')[0].replace('/', '')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                Headline Summary
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue..."
                className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">
                  Incident Details (#Hashtags &amp; @Mentions)
                </label>
                <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400">
                  Tap tag to insert
                </span>
              </div>
              <textarea
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Who is affected? How long? Specific dates, locations, or asset references..."
                className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs leading-relaxed text-slate-900 dark:text-white resize-none focus:outline-none focus:border-emerald-500"
              />

              {/* Quick Hashtag Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1.5">
                {[
                  '#FixOurRoads',
                  '#WaterRestored',
                  '#ServiceExcellence',
                  '#BudgetTransparency',
                  '#ZeroBribery',
                  '#UrgentSLA',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!body.includes(tag)) {
                        setBody((prev) => (prev ? `${prev.trim()} ${tag} ` : `${tag} `));
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-semibold cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Pre-Submission Issue Clustering & Master Dossier Co-Signing Radar */}
          {similarOpenPosts.length > 0 && (
            <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-emerald-500/40 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Layers size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400">
                      Master Dossier Clustering Radar · +20 Pts Bonus
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Similar Active Issue Detected on This Desk
                    </h4>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {similarOpenPosts.map((sim) => {
                  const count =
                    sim.compiled_count || (sim.compiled_reports ? sim.compiled_reports.length + 1 : 1);
                  return (
                    <div
                      key={sim.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <Users size={10} /> {count} Witnesses
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">#{sim.id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {sim.title}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCompileIntoExisting(sim)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-mono font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Layers size={11} />
                        <span>Compile Into Dossier</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: GPS Pin, Media Evidence, Voice Note & Civic Poll */}
          <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-3">
            {/* GPS Pin Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin
                  size={14}
                  className={gps ? 'text-emerald-600 dark:text-emerald-400 shrink-0' : 'text-slate-400 shrink-0'}
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    Location Pin (Optional)
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                    {gpsStatus}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAcquireGps}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-emerald-700 dark:text-emerald-400 text-[10.5px] font-mono font-semibold shrink-0 cursor-pointer"
              >
                {gps ? 'Re-acquire GPS' : 'Attach GPS Pin'}
              </button>
            </div>

            {/* Evidence & Voice Note Controls */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
              <label className="py-2 px-3 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*,.pdf"
                  className="hidden"
                  multiple
                  onChange={handleFileSelect}
                />
                <Upload size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>Photo / Proof ({stagedMedia.length})</span>
              </label>

              <button
                type="button"
                onClick={toggleRecording}
                className={`py-2 px-3 rounded-lg border text-xs font-mono font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                  isRecording
                    ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : voiceSaved
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-slate-400'
                }`}
              >
                <Mic size={13} />
                <span>
                  {isRecording ? 'Stop Recording' : voiceSaved ? 'Voice Attached' : 'Record Voice'}
                </span>
              </button>
            </div>

            {/* Staged Media Preview */}
            {stagedMedia.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {stagedMedia.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-semibold text-slate-900 dark:text-white truncate">
                        {m.name}
                      </p>
                      <p className="text-[9.5px] font-mono text-slate-500">
                        {m.type} · {m.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStagedMedia(idx)}
                      className="text-[10px] font-mono text-rose-600 hover:underline shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Optional Interactive Civic Poll Toggle */}
            <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <BarChart3 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Attach Community Referendum Poll</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIncludePoll(!includePoll);
                    if (!pollQuestion && title) {
                      setPollQuestion(
                        `How should ${dept ? dept.toUpperCase() : 'the authority'} prioritize "${title}"?`
                      );
                    }
                  }}
                  className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  {includePoll ? 'Remove Poll' : '+ Add Poll'}
                </button>
              </div>

              {includePoll && (
                <div className="space-y-2 pt-2 animate-fade-in">
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Poll Question..."
                    className="w-full bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      value={pollOpt1}
                      onChange={(e) => setPollOpt1(e.target.value)}
                      placeholder="Option 1"
                      className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={pollOpt2}
                      onChange={(e) => setPollOpt2(e.target.value)}
                      placeholder="Option 2"
                      className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={pollOpt3}
                      onChange={(e) => setPollOpt3(e.target.value)}
                      placeholder="Option 3"
                      className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Anonymous Toggle */}
          <div className="p-3.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>Post Anonymously (Zero-Knowledge Shield)</span>
              </p>
              <p className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                Displays publicly as &ldquo;Verified Citizen&rdquo; · NIN salted &amp; protected
              </p>
            </div>
            <label className="tog-wrap shrink-0">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <div className="tog-track"></div>
              <div className="tog-thumb"></div>
            </label>
          </div>

          {/* Offline 3G Queue Sync Indicator Strip (when items are queued or offline) */}
          {(!isOnline || offlineQueue.length > 0) && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs">
              <div className="text-amber-800 dark:text-amber-300 font-mono text-[11px]">
                <strong>Offline 3G Field Queue:</strong> {offlineQueue.length} pending report(s) staged locally with SHA-256 integrity.
              </div>
              {offlineQueue.length > 0 && (
                <button
                  type="button"
                  onClick={syncOfflineQueue}
                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-mono font-semibold shrink-0 cursor-pointer"
                >
                  Sync {offlineQueue.length} Now
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-amber-500 border border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 font-mono font-semibold rounded-lg py-3 px-3 text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Save photo/GPS evidence locally for intermittent rural 3G networks and sync later"
            >
              <span>Stage in Offline 3G Queue ({offlineQueue.length})</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="sm:col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-semibold rounded-lg py-3 text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send size={14} />
              <span>Dispatch Report to Public Wall →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
