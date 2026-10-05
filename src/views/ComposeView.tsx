import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CountryCode, MediaItem, Post, TicketCategory } from '../types';
import { allDepts, TERRITORY } from '../data/countries';
import { primaryUnit, tiersFor } from '../data/tiers';
import { CATEGORIES } from '../utils/helpers';
import { Upload, Mic, Lock, AlertTriangle, MapPin, Info, CheckCircle2, ShieldCheck, HelpCircle, Bike, Sparkles } from 'lucide-react';

export const ComposeView: React.FC = () => {
  const { user, go, addPost, toast, isOnline, queueOfflinePost, openGuide, activeDept } = useApp();

  const country = user?.country || 'UG';
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
      downvotes: 0,
      author_profession: profession,
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

      {/* 4-Step Citizen Reporting Guidance Stepper */}
      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
          <span className="uppercase tracking-wider">Citizen Reporting Pathway</span>
          <button
            type="button"
            onClick={() => openGuide('quickstart')}
            className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <HelpCircle size={11} /> Need Guidance?
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className={`p-1.5 rounded-xl border transition-all ${
            dept ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
          }`}>
            <div className="text-[10px] font-black">{dept ? '✓' : '1'}</div>
            <div className="text-[8.5px] font-bold truncate">1. Entity</div>
          </div>
          <div className={`p-1.5 rounded-xl border transition-all ${
            parish ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
          }`}>
            <div className="text-[10px] font-black">{parish ? '✓' : '2'}</div>
            <div className="text-[8.5px] font-bold truncate">2. Parish</div>
          </div>
          <div className={`p-1.5 rounded-xl border transition-all ${
            body ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
          }`}>
            <div className="text-[10px] font-black">{body ? '✓' : '3'}</div>
            <div className="text-[8.5px] font-bold truncate">3. Evidence</div>
          </div>
          <div className={`p-1.5 rounded-xl border transition-all ${
            dept && parish && body ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-400 text-teal-700 dark:text-teal-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
          }`}>
            <div className="text-[10px] font-black">4</div>
            <div className="text-[8.5px] font-bold truncate">4. Dispatch</div>
          </div>
        </div>
      </div>

      {!isOnline && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs mono flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
          <span><strong>Offline Mode Active:</strong> Your report will be safely queued locally and automatically published once connection is restored.</span>
        </div>
      )}

      {/* Department Selector */}
      <div className="space-y-2">
        <label className="text-[9.5px] mono text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block">Post to Wall</label>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="mono text-sm"
        >
          <option value="">Select institution, provider or desk...</option>
          
          <optgroup label="── 🏛️ Government & Statutory Desks">
            {depts
              .filter((d) => d.lane === 'civic' || d.category === 'government')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🏛'} {d.name} — {d.ministry || d.full}
                </option>
              ))}
          </optgroup>

          <optgroup label="── 🏫 Schools & Education">
            {depts
              .filter((d) => d.category === 'education')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🏫'} {d.name} ({d.full})
                </option>
              ))}
          </optgroup>

          <optgroup label="── 🏥 Hospitals & Healthcare">
            {depts
              .filter((d) => d.category === 'health')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🏥'} {d.name} — {d.full}
                </option>
              ))}
          </optgroup>

          <optgroup label="── 🍽️ Hospitality & Dining">
            {depts
              .filter((d) => d.category === 'hospitality')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🍽️'} {d.name} — {d.full}
                </option>
              ))}
          </optgroup>

          <optgroup label="── 💳 Finance, Banks & SACCOs">
            {depts
              .filter((d) => d.category === 'finance')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🏦'} {d.name} — {d.full}
                </option>
              ))}
          </optgroup>

          <optgroup label="── 🚌 Transport & Transit SACCOs">
            {depts
              .filter((d) => d.category === 'transport')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🚌'} {d.name} — {d.full}
                </option>
              ))}
          </optgroup>

          <optgroup label="── 🏢 Housing, Plazas & Markets">
            {depts
              .filter((d) => d.category === 'housing')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🏢'} {d.name} — {d.full}
                </option>
              ))}
          </optgroup>

          <optgroup label="── ⚡ Utilities & Telecom">
            {depts
              .filter((d) => d.category === 'utility' || d.category === 'telecom')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '⚡'} {d.name} — {d.full}
                </option>
              ))}
          </optgroup>

          <optgroup label="── 🛡️ CSOs, NGOs & Contractors">
            {depts
              .filter((d) => d.category === 'cso' || d.category === 'contractor')
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon || '🛡️'} {d.name} — {d.full}
                </option>
              ))}
          </optgroup>

          <optgroup label="── ➕ Unlisted Entity">
            <option value="others">Others / Register & Report Unlisted Provider</option>
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
            <p className="text-[8.5px] mono text-slate-700 dark:text-slate-300 flex items-center gap-1 font-bold">
              <AlertTriangle size={12} className="text-amber-500" /> Tagged [Unverified] · auto-CC'd to relevant ministry
            </p>
          </div>
        )}
      </div>

      {/* Reporter Profession / Frontline Field Scout Category */}
      <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/70 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="text-[10px] mono text-amber-950 dark:text-amber-300 font-black uppercase tracking-wider flex items-center gap-1.5">
            <Bike size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Reporter Profession · Community Field Scout Tag</span>
          </label>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200">
            Perk Vault Bounties
          </span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400">
          Self-identify your role. Bodaboda riders, drivers, and frontline citizens qualify for targeted micro-rewards &amp; fuel vouchers when reporting infrastructure hazards.
        </p>

        <select
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="w-full mt-1 font-bold text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/80 rounded-xl p-2.5 text-slate-900 dark:text-slate-100"
        >
          <option value="Bodaboda Rider / Cyclist">
            🛵 Bodaboda Rider / Cyclist (Frontline Road Scout · MoMo Fuel &amp; Airtime Eligible)
          </option>
          <option value="Taxi / Matatu / Commercial Driver">
            🚐 Taxi / Matatu / Commercial Driver (Public Transit &amp; Highway Corridor Scout)
          </option>
          <option value="Market Vendor / Local Trader">
            🥬 Market Vendor / Local Trader (Public Space &amp; Sanitation Scout)
          </option>
          <option value="Healthcare Worker / Nurse / Clinical Staff">
            🏥 Healthcare Worker / Nurse / Clinical Staff (Health Service Monitor)
          </option>
          <option value="Teacher / Student / Youth Leader">
            🎓 Teacher / Student / Youth Leader (Education &amp; Community Watch)
          </option>
          <option value="Artisan / Builder / Field Technician">
            🛠️ Artisan / Builder / Field Technician (Infrastructure Quality Inspector)
          </option>
          <option value="Civil Servant / Public Officer">
            🏛️ Civil Servant / Public Officer (Internal Oversight &amp; Whistleblower)
          </option>
          <option value="General Resident / Commuter">
            🚶 General Resident / Commuter (Community Citizen)
          </option>
        </select>

        {profession.toLowerCase().includes('boda') && (
          <div className="mt-2 text-[10px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 bg-amber-100/80 dark:bg-amber-900/40 p-2 rounded-lg border border-amber-300 dark:border-amber-700">
            <Sparkles size={12} className="text-amber-600 shrink-0" />
            <span>
              Road Scout Status: Verified reports on potholes, open culverts, and blackspots earn Perk Vault bounty points redeemable for fuel and airtime!
            </span>
          </div>
        )}
      </div>

      {/* Territory Cascading Selector */}
      <div className="space-y-2">
        <label className="text-[9.5px] mono text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block">
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

        <p className="text-[8.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
          <Info size={11} className="text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Under decentralization laws, selecting your {primaryUnit(country, district)} routes directly to your grassroots parish chief & local engineering desk.</span>
        </p>
      </div>

      {/* Category Picker */}
      <div className="space-y-2">
        <label className="text-[9.5px] mono text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block">Category</label>
        <button
          onClick={() => setCategory('corruption')}
          className={`w-full mb-2 py-3 px-3.5 rounded-xl border text-xs mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
            category === 'corruption'
              ? 'border-rose-500 text-rose-900 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10 shadow-xs'
              : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-rose-500 hover:text-rose-700 dark:hover:text-rose-300'
          }`}
        >
          <Lock size={14} /> Report Corruption / Misuse of Public Funds (+100pts)
        </button>

        <div className="grid grid-cols-4 gap-1.5">
          {CATEGORIES.filter((c) => c.id !== 'corruption').map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`py-2.5 px-1 rounded-xl border text-[9px] mono transition-all leading-tight text-center cursor-pointer ${
                category === c.id
                  ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-500 text-teal-900 dark:text-teal-300 font-black shadow-xs'
                  : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-emerald-500 font-bold'
              }`}
            >
              {c.label.split(' ')[0].replace('/', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Title & Details */}
      <div className="space-y-2">
        <label className="text-[9.5px] mono text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block">Headline</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of the issue..."
          className="text-sm font-bold"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9.5px] mono text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block">Details</label>
        <textarea
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Who is affected? How long? Specific dates, locations, names of officers where relevant."
          className="text-sm leading-relaxed resize-none"
        ></textarea>
      </div>

      {/* GPS & Location Policy Selection */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[9.5px] mono text-slate-900 dark:text-slate-100 font-black uppercase tracking-widest flex items-center gap-1.5">
            <MapPin size={13} className="text-emerald-700 dark:text-teal-400" /> Location Accuracy & Policy
          </label>
          <span className="text-[8.5px] mono text-emerald-800 dark:text-teal-400 bg-emerald-50 dark:bg-teal-500/10 border border-emerald-300 dark:border-teal-500/30 px-2 py-0.5 rounded font-bold">
            GPS is Optional
          </span>
        </div>

        <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          How would you like to identify the issue location?
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-700 dark:text-teal-400" />
              <span className="text-[11px] font-black text-slate-900 dark:text-slate-200">1. Parish Territory</span>
            </div>
            <p className="text-[9px] mono text-slate-600 dark:text-slate-400 leading-normal font-medium">
              e.g. Mbuya 1 Parish. Routes to Local Officers without revealing exact pin. Recommended for area-wide issues & privacy.
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-amber-600 dark:text-amber-400" />
              <span className="text-[11px] font-black text-slate-900 dark:text-slate-200">2. Device GPS Pin</span>
            </div>
            <p className="text-[9px] mono text-slate-600 dark:text-slate-400 leading-normal font-medium">
              Attaches exact lat/lng coordinates. Recommended for point repairs (e.g. broken pipe or specific pothole).
            </p>
          </div>
        </div>

        {/* GPS Acquire Button / Status */}
        <div
          className={`flex items-center gap-2.5 p-3 rounded-xl border transition-colors ${
            gps ? 'bg-emerald-50 dark:bg-teal-500/10 border-emerald-300 dark:border-teal-500/30' : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${gps ? 'bg-emerald-500 a-dot' : 'bg-slate-400 dark:bg-slate-700'} flex-shrink-0`}></div>
          <span className={`text-[10px] mono flex-1 ${gps ? 'text-emerald-800 dark:text-teal-300 font-black' : 'text-slate-700 dark:text-slate-400 font-bold'}`}>
            {gpsStatus}
          </span>
          <button
            onClick={handleAcquireGps}
            className="text-[9px] mono bg-emerald-50 dark:bg-teal-500/10 hover:bg-emerald-100 text-emerald-800 dark:text-teal-300 border border-emerald-300 dark:border-teal-500/30 px-3 py-1 rounded-lg transition-colors font-black cursor-pointer"
          >
            {gps ? 'Re-acquire Pin' : 'Attach GPS Pin'}
          </button>
        </div>

        <div className="flex items-start gap-1.5 text-[8.5px] mono text-slate-700 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
          <Info size={13} className="text-emerald-700 dark:text-teal-400 flex-shrink-0 mt-0.5" />
          <p className="leading-normal">
            <strong className="text-slate-900 dark:text-slate-200">Why GPS is intentionally optional:</strong> Whistleblowers reporting corruption need location privacy; feature-phone USSD users (*3030#) don't have GPS; and parish-wide service outages affect the whole territory.
          </p>
        </div>
      </div>

      {/* Evidence Upload */}
      <div className="space-y-2">
        <label className="text-[9.5px] mono text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block">
          Evidence <span className="text-slate-500 font-normal">(Optional · Photo, Video, Document)</span>
        </label>

        <label className="drop-zone block cursor-pointer">
          <input
            type="file"
            accept="image/*,video/*,.pdf"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <div className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-700 font-bold">
            <Upload size={18} /> <span className="text-[13px] mono">Photo · Video · Document</span>
          </div>
        </label>

        {/* Live Staged Media Card Preview */}
        {stagedMedia.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-[9.5px] mono text-slate-700 dark:text-slate-300 uppercase tracking-widest font-black">Staged Evidence ({stagedMedia.length})</p>
            <div className="grid grid-cols-2 gap-2">
              {stagedMedia.map((m, idx) => (
                <div key={idx} className="card p-2 relative flex items-center gap-2 overflow-hidden border-slate-300 dark:border-slate-800">
                  {m.type === 'image' && (
                    <img src={m.url} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-900 dark:text-slate-200 truncate">{m.name}</p>
                    <p className="text-[8px] mono text-slate-600 dark:text-slate-400 font-bold">{m.type} · {m.size}</p>
                  </div>
                  <button
                    onClick={() => removeStagedMedia(idx)}
                    className="text-slate-500 hover:text-rose-600 p-1 text-xs mono font-black"
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
        <label className="text-[9.5px] mono text-slate-700 dark:text-slate-300 font-black uppercase tracking-widest block">
          Voice Note <span className="text-slate-500 font-normal">(Optional · Supports feature phone citizens)</span>
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs mono font-bold transition-all cursor-pointer ${
              isRecording
                ? 'border-rose-500 text-rose-900 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10'
                : 'bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            <Mic size={16} /> <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
          </button>
          <span className={`text-[9.5px] mono font-bold ${voiceSaved ? 'text-emerald-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}>
            {isRecording ? 'Recording...' : voiceSaved ? 'Voice note attached ✓' : 'Tap to record'}
          </span>
        </div>
      </div>

      {/* Anonymous Toggle */}
      <div className="card p-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-black text-slate-950 dark:text-slate-100">Post anonymously</p>
          <p className="text-[9.5px] mono text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
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
        className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-black rounded-2xl py-4 text-sm uppercase tracking-widest mono transition-all active:scale-[.98] shadow-md cursor-pointer"
      >
        Report to Wall →
      </button>

      <p className="text-center text-[8px] mono text-zinc-700">
        Service delivery is not a favour. It is a right and a responsibility.
      </p>
    </div>
  );
};
