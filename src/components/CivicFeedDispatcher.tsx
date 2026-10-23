import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Post, TicketCategory } from '../types';
import { allDepts } from '../data/countries';
import {
  Image,
  MapPin,
  Lock,
  Send,
  X,
  Plus,
  Building2,
  Mic,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Volume2,
  Radio,
} from 'lucide-react';
import { SignalGlyphRed, SignalGlyphAmber, SignalGlyphGreen } from './TrafficSignalHUD';
import { DeptIcon } from './DeptIcon';

interface CivicFeedDispatcherProps {
  onPostSuccess?: (post: Post) => void;
  className?: string;
  defaultExpanded?: boolean;
}

const QUICK_CATEGORIES: { id: TicketCategory; label: string; icon: string }[] = [
  { id: 'pothole', label: 'Roads & Infrastructure', icon: '🚧' },
  { id: 'power', label: 'Power & Grid Outage', icon: '⚡' },
  { id: 'water', label: 'Water Supply & Leaks', icon: '💧' },
  { id: 'waste', label: 'Waste & Sanitation', icon: '🗑️' },
  { id: 'health', label: 'Health & Clinic Care', icon: '🏥' },
  { id: 'corruption', label: 'Anti-Graft & Integrity', icon: '⚖️' },
  { id: 'praise', label: 'Praise & Commendation', icon: '🌟' },
];

export const CivicFeedDispatcher: React.FC<CivicFeedDispatcherProps> = ({
  onPostSuccess,
  className = '',
  defaultExpanded = false,
}) => {
  const { user, ensureCitizenSession, addPost, toast, activeDept } = useApp();
  const activeUser = user || ensureCitizenSession();
  const country = activeUser.country || 'UG';
  const depts = allDepts(country);

  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);
  const [body, setBody] = useState('');
  const [signalBulb, setSignalBulb] = useState<'red' | 'amber' | 'green'>('red');
  const [category, setCategory] = useState<TicketCategory>('pothole');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(activeDept || (country === 'KE' ? 'kplc' : 'kcca'));
  const [wardName, setWardName] = useState<string>(activeUser.ward || 'Central Ward');
  const [parishName, setParishName] = useState<string>(activeUser.parish || activeUser.parish_ward || 'Nakasero Parish');
  const [grassrootName, setGrassrootName] = useState<string>(activeUser.grassroot || activeUser.village || 'Lumumba Cell');
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [hasVoiceNote, setHasVoiceNote] = useState<boolean>(false);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedDept = depts.find((d) => d.id === selectedDeptId) || depts[0] || { id: 'kcca', name: 'City Authority' };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'amber');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
      toast('Ground photo proof attached', 'emerald');
    };
    reader.readAsDataURL(file);
  };

  const handleSignalSelect = (sig: 'red' | 'amber' | 'green') => {
    setSignalBulb(sig);
    if (sig === 'green') {
      setCategory('praise');
    } else if (sig === 'red' && category === 'praise') {
      setCategory('pothole');
    }
  };

  const toggleVoiceNote = () => {
    if (hasVoiceNote) {
      setHasVoiceNote(false);
      toast('Voice testimony removed', 'amber');
    } else {
      setHasVoiceNote(true);
      toast('Studio audio recorded: 32s Luganda/English field testimony attached', 'emerald');
    }
  };

  const handleQuickSubmit = () => {
    const trimmed = body.trim();
    if (!trimmed) {
      toast('Please describe the on-ground civic incident first', 'amber');
      textareaRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const isPraise = signalBulb === 'green';
      const postCategory: TicketCategory = isPraise ? 'praise' : category;
      const initialStatus = isPraise ? 'resolved' : signalBulb === 'amber' ? 'investigating' : 'pending';

      const randomId = Math.floor(1000 + Math.random() * 9000);
      const postId = `cd-${Date.now()}-${randomId}`;

      const firstLine = trimmed.split('\n')[0];
      const derivedTitle = firstLine.length > 70 ? `${firstLine.slice(0, 67)}...` : firstLine;

      const mediaItems = attachedImage
        ? [
            {
              type: 'image' as const,
              url: attachedImage,
              caption: 'Citizen On-Ground Evidence Photo',
            },
          ]
        : [];

      const voicePayload = hasVoiceNote
        ? {
            duration: '0:32',
            language: 'LG · Luganda / EN',
            transcript:
              'Twagala gavumenti etuyambe ku lw’omukutu guno ogwonoonese. We need immediate intervention on this drainage line before the rains flood the market.',
            waveform: [3, 6, 8, 4, 7, 9, 5, 8, 3, 7, 8, 6, 4, 8, 9, 7, 5, 3, 6, 8, 4, 6],
          }
        : undefined;

      const newPost: Post = {
        id: postId,
        country: activeUser.country || 'UG',
        dept: selectedDeptId,
        lane: 'civic',
        territory: {
          district: activeUser.district || 'Kampala',
          subcounty: wardName || 'Central',
          parish: parishName || 'Central Parish',
          ward: wardName || 'Central Ward',
          village: grassrootName || 'Lumumba Cell',
          cell: grassrootName || 'Lumumba Cell',
          grassroot: grassrootName || 'Lumumba Cell',
        },
        ward: wardName || 'Central Ward',
        parish: parishName || 'Central Parish',
        village: grassrootName || 'Lumumba Cell',
        cell: grassrootName || 'Lumumba Cell',
        grassroot: grassrootName || 'Lumumba Cell',
        citizen_id: activeUser.id || `usr-${Date.now()}`,
        citizen_name: anonymous ? 'Protected Citizen' : activeUser.name || 'Citizen Watchdog',
        citizen_rank: activeUser.rank || 'Verified Scout',
        citizen_avatar: activeUser.avatar_url,
        anonymous,
        category: postCategory,
        title: derivedTitle,
        body: trimmed,
        location: `${grassrootName ? `${grassrootName}, ` : ''}${parishName}, ${wardName}`,
        gps: { lat: '0.3136', lng: '32.5811' },
        source: 'web',
        media: mediaItems,
        voice_note: voicePayload,
        status: initialStatus,
        gov_status: initialStatus,
        is_corruption: postCategory === 'corruption',
        created_at: new Date().toISOString(),
        comments: [],
        upvotes: 1,
        downvotes: 0,
        reposts: 0,
        is_demo: false,
        author_profession: activeUser.profession || 'Community Member',
      };

      addPost(newPost);
      toast('Sovereign Civic Dispatch filed! Indexed into National Ledger.', 'emerald');
      setBody('');
      setAttachedImage(null);
      setHasVoiceNote(false);
      setExpanded(false);
      onPostSuccess?.(newPost);
    } catch (err) {
      console.error('Error submitting dispatch:', err);
      toast('Failed to submit report. Please try again.', 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`mb-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200/90 dark:border-[#222736] shadow-xs overflow-hidden transition-all ${className}`}>
      {!expanded ? (
        /* Collapsed Department-Wall Quick Launcher Bar */
        <div className="p-3.5 sm:p-4.5 bg-gradient-to-r from-slate-50 via-white to-emerald-50/20 dark:from-[#111520] dark:via-[#131722] dark:to-emerald-950/15">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setExpanded(true);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              className="flex-1 flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xs transition group-hover:scale-105 shrink-0">
                <Plus size={20} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  Submit an on-ground civic report or commendation...
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                  To {selectedDept.name} · {parishName} / {wardName} · Guaranteed 24–48h SLA
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setExpanded(true);
                setTimeout(() => textareaRef.current?.focus(), 50);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
            >
              <span>DISPATCH</span>
              <span className="hidden sm:inline">REPORT</span>
            </button>
          </div>
        </div>
      ) : (
        /* Expanded Department-Style Dispatch Studio */
        <div className="p-4 sm:p-5 space-y-4 animate-fade-in">
          {/* Header Strip: Department Desk & Signal Bulbs */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building2 size={16} />
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Designated Public Authority / Desk:
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="bg-transparent font-bold text-xs text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
                >
                  {depts.map((d) => (
                    <option key={d.id} value={d.id} className="bg-white dark:bg-[#161a22] text-slate-800 dark:text-slate-200">
                      {d.name} ({d.full || d.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sovereign 3-Signal Bulb Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#0c0f16] p-1 rounded-xl border border-slate-200/80 dark:border-[#222736]">
              <button
                type="button"
                onClick={() => handleSignalSelect('red')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  signalBulb === 'red'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/50 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <SignalGlyphRed active={signalBulb === 'red'} className="w-3.5 h-3.5" />
                <span>Urgent</span>
              </button>

              <button
                type="button"
                onClick={() => handleSignalSelect('amber')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  signalBulb === 'amber'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/50 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <SignalGlyphAmber active={signalBulb === 'amber'} className="w-3.5 h-3.5" />
                <span>Alert</span>
              </button>

              <button
                type="button"
                onClick={() => handleSignalSelect('green')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  signalBulb === 'green'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/50 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <SignalGlyphGreen active={signalBulb === 'green'} className="w-3.5 h-3.5" />
                <span>Praise</span>
              </button>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Incident Category
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {QUICK_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    if (cat.id === 'praise') setSignalBulb('green');
                    else if (signalBulb === 'green') setSignalBulb('red');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 border ${
                    category === cat.id
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-[#161a24] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Prompt Canvas */}
          <div className="relative rounded-xl border border-slate-200 dark:border-[#262f40] bg-slate-50/70 dark:bg-[#0c0f16] p-3 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-[#0d1017]">
            <textarea
              ref={textareaRef}
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                signalBulb === 'green'
                  ? 'Commend good public service, completed works, or an outstanding officer...'
                  : signalBulb === 'red'
                  ? 'What urgent breakdown, leak, or issue needs immediate intervention on-ground?'
                  : 'Share an official notice, ongoing development update, or parish inquiry...'
              }
              className="w-full text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none leading-relaxed"
            />
          </div>

          {/* Attached Photo Preview */}
          {attachedImage && (
            <div className="relative inline-block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48">
              <img src={attachedImage} alt="Proof" className="max-h-48 w-auto object-cover rounded-xl" />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Voice Testimony Badge */}
          {hasVoiceNote && (
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Volume2 size={15} className="text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold text-indigo-950 dark:text-indigo-200">
                  Audio Testimony Recorded (0:32 · Vernacular Luganda + English)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasVoiceNote(false)}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                Remove
              </button>
            </div>
          )}

          {/* Grassroots Hierarchy Quick Edit Box */}
          {showLocationPicker && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c0f16] border border-slate-200 dark:border-[#222736] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                  <MapPin size={12} className="text-emerald-600" />
                  <span>Grassroots Parish, Ward &amp; Cell Hierarchy</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(false)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Done
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Parish</label>
                  <input
                    type="text"
                    value={parishName}
                    onChange={(e) => setParishName(e.target.value)}
                    className="w-full bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Ward</label>
                  <input
                    type="text"
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    className="w-full bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">Cell / Village</label>
                  <input
                    type="text"
                    value={grassrootName}
                    onChange={(e) => setGrassrootName(e.target.value)}
                    className="w-full bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Row & Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition cursor-pointer ${
                  attachedImage
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                    : 'bg-slate-50 dark:bg-[#161a24] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                }`}
                title="Attach photo proof"
              >
                <Camera size={14} />
                <span className="hidden sm:inline font-mono text-[11px]">Photo</span>
              </button>

              <button
                type="button"
                onClick={toggleVoiceNote}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition cursor-pointer ${
                  hasVoiceNote
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600'
                    : 'bg-slate-50 dark:bg-[#161a24] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                }`}
                title="Record voice testimony"
              >
                <Mic size={14} />
                <span className="hidden sm:inline font-mono text-[11px]">Voice Note</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition cursor-pointer ${
                  showLocationPicker
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                    : 'bg-slate-50 dark:bg-[#161a24] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                }`}
                title="Change grassroots location"
              >
                <MapPin size={14} />
                <span className="hidden sm:inline font-mono text-[11px] truncate max-w-[120px]">{parishName}</span>
              </button>

              <button
                type="button"
                onClick={() => setAnonymous(!anonymous)}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition cursor-pointer ${
                  anonymous
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-[#161a24] border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                }`}
                title={anonymous ? 'Protected Citizen' : 'Public Citizen'}
              >
                <Lock size={13} />
                <span className="hidden sm:inline font-mono text-[11px]">{anonymous ? 'Anonymous' : 'Public'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleQuickSubmit}
                disabled={!body.trim() || isSubmitting}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  body.trim() && !isSubmitting
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send size={13} />
                <span>{isSubmitting ? 'DISPATCHING...' : 'DISPATCH REPORT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
