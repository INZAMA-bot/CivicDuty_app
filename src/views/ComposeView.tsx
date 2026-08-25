import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, MediaItem, Post, TicketCategory } from '../types';
import { allDepts, TERRITORY } from '../data/countries';
import { primaryUnit, tiersFor } from '../data/tiers';
import { CATEGORIES } from '../utils/helpers';
import { Upload, Mic, Lock, AlertTriangle, MapPin, Info, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ComposeView: React.FC = () => {
  const { user, go, addPost, toast, isOnline, queueOfflinePost } = useApp();

  const country = user?.country || 'UG';
  const depts = allDepts(country);
  const territory = TERRITORY[country] || [];

  const [dept, setDept] = useState('');
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
  const [voiceDuration, setVoiceDuration] = useState('0:42');

  const subcounties = district ? territory.find((d) => d.id === district)?.children || [] : [];
  const parishes = subcounty ? subcounties.find((s) => s.id === subcounty)?.children || [] : [];

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
      const type = f.type.includes('image') ? ('image' as const) : f.type.includes('video') ? ('video' as const) : ('doc' as const);
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

  const handleSubmit = () => {
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
      citizen_satisfied: null,
      escalated: false,
    };

    if (!isOnline) {
      queueOfflinePost(post);
    } else {
      addPost(post);
      if (isCorrupt) {
        toast('⚖ Corruption report filed — IGG notified', 'amber');
      }
    }
    go('feed');
  };

  return (
    <div className="p-4 space-y-4 pb-12 animate-fade-in">
      <div>
        <div className="tagline text-teal-400 mb-1.5">File Ticket</div>
        <h2 className="text-[21px] font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Report to Wall</h2>
        <p className="text-[11px] mono text-slate-500 dark:text-slate-400 mt-1">Permanent public record. Service delivery is your right.</p>
      </div>

      {!isOnline && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
          <span><strong>Offline Mode Active:</strong> Your report will be safely queued locally and automatically published once connection is restored.</span>
        </div>
      )}

      {/* Department Selector */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-400 uppercase tracking-widest block">Post to Wall</label>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="mono text-sm"
        >
          <option value="">Select department...</option>
          <optgroup label="── Lane 1: Government">
            {depts
              .filter((d) => d.lane === 'civic')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🏛'} {d.name} — {d.ministry || d.full}
                </option>
              ))}
          </optgroup>
          <optgroup label="── Lane 2: Private / Utility">
            {depts
              .filter((d) => d.lane === 'consumer')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🏢'} {d.full}
                </option>
              ))}
          </optgroup>
          <optgroup label="── Not Listed">
            <option value="others">Others / Not listed above</option>
          </optgroup>
        </select>

        {dept === 'others' && (
          <div className="space-y-1 mt-2">
            <input
              type="text"
              value={othersText}
              onChange={(e) => setOthersText(e.target.value)}
              placeholder="e.g. Yaka token vendor, Private contractor"
              className="mono text-sm"
            />
            <p className="text-[8px] mono text-slate-400 flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber-400" /> Tagged [Unverified] · auto-CC'd to relevant ministry
            </p>
          </div>
        )}
      </div>

      {/* Territory Cascading Selector */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-400 uppercase tracking-widest block">
          Territory — District › SubCounty › Parish
        </label>
        <select
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setSubcounty('');
            setParish('');
          }}
          className="mono text-sm mb-1.5"
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
          className="mono text-sm mb-1.5"
          style={{ opacity: district ? 1 : 0.4 }}
        >
          <option value="">Select {tiersFor(country)[2]?.unit || 'Division'}...</option>
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
          className="mono text-sm"
          style={{ opacity: subcounty ? 1 : 0.4 }}
        >
          <option value="">Select {primaryUnit(country, district)}...</option>
          {parishes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Category Picker */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-400 uppercase tracking-widest block">Category</label>
        <button
          onClick={() => setCategory('corruption')}
          className={`w-full mb-2 py-3 px-3.5 rounded-xl border text-xs mono font-bold transition-all flex items-center gap-2 ${
            category === 'corruption'
              ? 'border-rose-500/50 text-rose-300 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-rose-500/40 hover:text-rose-300'
          }`}
        >
          <Lock size={14} /> Report Corruption / Misuse of Public Funds (+100pts)
        </button>

        <div className="grid grid-cols-4 gap-1.5">
          {CATEGORIES.filter((c) => c.id !== 'corruption').map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`py-2.5 px-1 rounded-xl border text-[8px] mono transition-all leading-tight text-center ${
                category === c.id
                  ? 'bg-teal-500/10 border-teal-500/50 text-teal-300 font-bold shadow-[0_0_8px_rgba(20,184,166,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {c.label.split(' ')[0].replace('/', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Title & Details */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-400 uppercase tracking-widest block">Headline</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of the issue..."
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-400 uppercase tracking-widest block">Details</label>
        <textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Who is affected? How long? Specific dates, locations, names of officers where relevant."
          className="text-sm leading-relaxed resize-none"
        ></textarea>
      </div>

      {/* GPS & Location Policy Selection */}
      <div className="card p-4 space-y-3 border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-[9px] mono text-slate-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <MapPin size={13} className="text-teal-400" /> Location Accuracy & Policy
          </label>
          <span className="text-[8px] mono text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded">
            GPS is Optional
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          How would you like to identify the issue location?
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-teal-400" />
              <span className="text-[11px] font-bold text-slate-200">1. Parish Territory</span>
            </div>
            <p className="text-[9px] mono text-slate-400 leading-normal">
              e.g. Mbuya 1 Parish. Routes to Local Officers without revealing exact pin. Recommended for area-wide issues & privacy.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-400" />
              <span className="text-[11px] font-bold text-slate-200">2. Device GPS Pin</span>
            </div>
            <p className="text-[9px] mono text-slate-400 leading-normal">
              Attaches exact lat/lng coordinates. Recommended for point repairs (e.g. broken pipe or specific pothole).
            </p>
          </div>
        </div>

        {/* GPS Acquire Button / Status */}
        <div
          className={`flex items-center gap-2.5 p-3 rounded-xl border transition-colors ${
            gps ? 'bg-teal-500/10 border-teal-500/30' : 'bg-slate-900/60 border-slate-800'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${gps ? 'bg-teal-400 a-dot shadow-[0_0_8px_#2dd4bf]' : 'bg-slate-700'} flex-shrink-0`}></div>
          <span className={`text-[10px] mono flex-1 ${gps ? 'text-teal-300 font-bold' : 'text-slate-400'}`}>
            {gpsStatus}
          </span>
          <button
            onClick={handleAcquireGps}
            className="text-[9px] mono bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-lg transition-colors font-bold"
          >
            {gps ? 'Re-acquire Pin' : 'Attach GPS Pin'}
          </button>
        </div>

        <div className="flex items-start gap-1.5 text-[8.5px] mono text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80">
          <Info size={13} className="text-teal-400 flex-shrink-0 mt-0.5" />
          <p className="leading-normal">
            <strong className="text-slate-300">Why GPS is intentionally optional:</strong> Whistleblowers reporting corruption need location privacy; feature-phone USSD users (*3030#) don't have GPS; and parish-wide service outages affect the whole territory.
          </p>
        </div>
      </div>

      {/* Evidence Upload */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-400 uppercase tracking-widest block">
          Evidence <span className="text-slate-500">(Optional · Photo, Video, Document)</span>
        </label>

        <label className="drop-zone block cursor-pointer">
          <input
            type="file"
            accept="image/*,video/*,.pdf"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <div className="flex items-center justify-center gap-2 text-slate-400 hover:text-teal-300">
            <Upload size={18} /> <span className="text-[13px] mono">Photo · Video · Document</span>
          </div>
        </label>

        {/* Live Staged Media Card Preview */}
        {stagedMedia.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-[9px] mono text-slate-400 uppercase tracking-widest">Staged Evidence ({stagedMedia.length})</p>
            <div className="grid grid-cols-2 gap-2">
              {stagedMedia.map((m, idx) => (
                <div key={idx} className="card p-2 relative flex items-center gap-2 overflow-hidden border-slate-800">
                  {m.type === 'image' && (
                    <img src={m.url} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-200 truncate">{m.name}</p>
                    <p className="text-[8px] mono text-slate-500">{m.type} · {m.size}</p>
                  </div>
                  <button
                    onClick={() => removeStagedMedia(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1 text-xs mono"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Voice Note Simulation */}
      <div className="space-y-2">
        <label className="text-[9px] mono text-slate-400 uppercase tracking-widest block">
          Voice Note <span className="text-slate-500">(Optional · Supports feature phone citizens)</span>
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs mono font-bold transition-all ${
              isRecording
                ? 'border-rose-500/60 text-rose-300 bg-rose-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Mic size={16} /> <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
          </button>
          <span className={`text-[9px] mono ${voiceSaved ? 'text-teal-400 font-bold' : 'text-slate-500'}`}>
            {isRecording ? 'Recording...' : voiceSaved ? 'Voice note attached ✓' : 'Tap to record'}
          </span>
        </div>
      </div>

      {/* Anonymous Toggle */}
      <div className="card p-4 flex items-center justify-between gap-3 border-slate-800">
        <div>
          <p className="text-[13px] font-bold text-slate-200">Post anonymously</p>
          <p className="text-[9px] mono text-slate-400 mt-0.5">
            Displays as "Verified Citizen". NIN stored securely — revealed only by court order.
          </p>
        </div>
        <label className="tog-wrap flex-shrink-0">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          <div className="tog-track"></div>
          <div className="tog-thumb"></div>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] shadow-[0_0_20px_rgba(20,184,166,0.35)]"
      >
        Report to Wall →
      </button>

      <p className="text-center text-[8px] mono text-zinc-700">
        Service delivery is not a favour. It is a right and a responsibility.
      </p>
    </div>
  );
};
