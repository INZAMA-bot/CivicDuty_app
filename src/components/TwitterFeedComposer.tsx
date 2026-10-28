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
  Award, 
  Building2, 
  ShieldAlert,
  Camera
} from 'lucide-react';
import { SignalGlyphRed, SignalGlyphAmber, SignalGlyphGreen } from './TrafficSignalHUD';

interface TwitterFeedComposerProps {
  onPostSuccess?: (post: Post) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export const TwitterFeedComposer: React.FC<TwitterFeedComposerProps> = ({
  onPostSuccess,
  className = '',
  defaultExpanded = false,
}) => {
  const { user, ensureCitizenSession, addPost, toast, activeDept } = useApp();
  const activeUser = user || ensureCitizenSession();
  const country = activeUser.country || 'UG';
  const depts = allDepts(country);

  const [body, setBody] = useState('');
  const [signalBulb, setSignalBulb] = useState<'red' | 'amber' | 'green'>('red');
  const [category, setCategory] = useState<TicketCategory>('pothole');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(activeDept || (country === 'KE' ? 'kplc' : 'kcca'));
  const [wardName, setWardName] = useState<string>(activeUser.ward || 'Central Ward');
  const [parishName, setParishName] = useState<string>(activeUser.parish || activeUser.parish_ward || 'Nakasero Parish');
  const [grassrootName, setGrassrootName] = useState<string>(activeUser.grassroot || activeUser.village || 'Lumumba Cell');
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState<boolean>(false);
  const [showDeptPicker, setShowDeptPicker] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(defaultExpanded);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 260)}px`;
    }
  };

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
      toast('Photo attached', 'emerald');
    };
    reader.readAsDataURL(file);
  };

  const selectedDept = depts.find((d) => d.id === selectedDeptId) || depts[0] || { id: 'kcca', name: 'City Authority' };

  const handleSignalSelect = (sig: 'red' | 'amber' | 'green') => {
    setSignalBulb(sig);
    if (sig === 'green') {
      setCategory('praise');
    } else if (sig === 'red' && category === 'praise') {
      setCategory('pothole');
    }
  };

  const handleQuickSubmit = () => {
    const trimmed = body.trim();
    if (!trimmed) {
      toast('Please write what is happening first', 'amber');
      textareaRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const isPraise = signalBulb === 'green';
      const isRed = signalBulb === 'red';
      const postCategory: TicketCategory = isPraise ? 'praise' : category;
      const initialStatus = isPraise ? 'resolved' : signalBulb === 'amber' ? 'investigating' : 'pending';

      const randomId = Math.floor(1000 + Math.random() * 9000);
      const postId = `cd-${Date.now()}-${randomId}`;

      // Derive title from first line or snippet
      const firstLine = trimmed.split('\n')[0];
      const derivedTitle = firstLine.length > 70 ? `${firstLine.slice(0, 67)}...` : firstLine;

      const mediaItems = attachedImage
        ? [
            {
              type: 'image' as const,
              url: attachedImage,
              caption: 'Citizen Evidence Photo',
            },
          ]
        : [];

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
      onPostSuccess?.(newPost);

      // Reset state
      setBody('');
      setAttachedImage(null);
      setShowLocationPicker(false);
      setShowDeptPicker(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      toast(
        isPraise
          ? 'Commendation dispatched with 🟢 Green Signal!'
          : isRed
          ? 'Urgent report dispatched with 🔴 Red Signal!'
          : 'Dispatch filed with 🟡 Amber Signal!',
        'emerald'
      );
    } catch (err) {
      console.error(err);
      toast('Failed to publish post. Please retry.', 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleQuickSubmit();
    }
  };

  return (
    <div className={`bg-white dark:bg-[#0f1219] border-b border-slate-200 dark:border-[#202636] p-3.5 sm:p-4.5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] ${className}`}>
      <div className="flex gap-3">
        {/* Left Column: Author Avatar */}
        <div className="shrink-0 pt-0.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-mono font-bold text-xs sm:text-sm shadow-xs border border-emerald-500/30 select-none">
            {anonymous ? (
              <Lock size={15} />
            ) : (
              (activeUser.name || 'Citizen').slice(0, 2).toUpperCase()
            )}
          </div>
        </div>

        {/* Right Column: AI Studio Prompt Canvas & Controls */}
        <div className="flex-1 min-w-0">
          <div className="relative rounded-xl border border-slate-200 dark:border-[#232b3d] bg-slate-50/60 dark:bg-[#141824] p-2.5 transition-all focus-within:border-emerald-500/70 focus-within:ring-2 focus-within:ring-emerald-500/15 focus-within:bg-white dark:focus-within:bg-[#111520]">
            <textarea
              ref={textareaRef}
              rows={isFocused || body ? 3 : 2}
              value={body}
              onFocus={() => setIsFocused(true)}
              onChange={handleBodyChange}
              onKeyDown={handleKeyDown}
              placeholder={
                signalBulb === 'green'
                  ? "Commend good public service, completed works, or an outstanding officer..."
                  : signalBulb === 'red'
                  ? "What urgent civic breakdown or issue needs immediate intervention?"
                  : "Share a community alert, development update, or parish inquiry..."
              }
              className="w-full text-[13.5px] sm:text-[14.5px] placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 bg-transparent resize-none focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Attached Image Preview */}
          {attachedImage && (
            <div className="relative mt-2 mb-2 inline-block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-56">
              <img
                src={attachedImage}
                alt="Upload preview"
                className="max-h-56 w-auto object-cover rounded-2xl"
              />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition cursor-pointer"
                title="Remove photo"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Location: Parish, Ward, and Grassroot Quick Edit Box */}
          {showLocationPicker && (
            <div className="mt-2 mb-2 p-3 rounded-2xl bg-slate-50 dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                  <MapPin size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Grassroots Location Hierarchy</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(false)}
                  className="px-2 py-0.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                  Done
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                    Parish
                  </label>
                  <input
                    type="text"
                    value={parishName}
                    onChange={(e) => setParishName(e.target.value)}
                    placeholder="e.g. Nakasero Parish"
                    className="w-full bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                    Ward
                  </label>
                  <input
                    type="text"
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    placeholder="e.g. Central Ward"
                    className="w-full bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                    Grassroot Cell / Village
                  </label>
                  <input
                    type="text"
                    value={grassrootName}
                    onChange={(e) => setGrassrootName(e.target.value)}
                    placeholder="e.g. Lumumba Cell"
                    className="w-full bg-white dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Grassroot Presets */}
              <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-semibold mb-1">
                  Quick Select Common Grassroots:
                </div>
                <div className="flex flex-wrap gap-1">
                  {[
                    { p: 'Nakasero Parish', w: 'Central Ward', g: 'Lumumba Cell' },
                    { p: 'Bukoto Parish', w: 'Nakawa Ward', g: 'Kalinabiri Zone' },
                    { p: 'Naguru Parish', w: 'Nakawa Ward', g: 'Upper Naguru' },
                    { p: 'Mulago Parish', w: 'Kawempe Ward', g: 'Mulago III Cell' },
                    { p: 'Kisenyi Parish', w: 'Central Ward', g: 'Kisenyi I Cell' },
                    { p: 'Kamwokya Parish', w: 'Central Ward', g: 'Church Zone' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setParishName(preset.p);
                        setWardName(preset.w);
                        setGrassrootName(preset.g);
                      }}
                      className="px-2 py-0.5 rounded-full text-[10.5px] bg-slate-200/70 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 transition text-slate-600 dark:text-slate-300"
                    >
                      {preset.p} · {preset.g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Department / Authority Quick Selector */}
          {showDeptPicker && (
            <div className="mt-2 mb-2 p-2 rounded-xl bg-slate-50 dark:bg-[#0e1116] border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                Select Destination Desk / Ministry
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {depts.slice(0, 10).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedDeptId(d.id);
                      setShowDeptPicker(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      selectedDeptId === d.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                        : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Row: Signal Bulbs + Tools + Submit Button */}
          <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
            {/* Left: Signal Bulbs selector (Iconic Traffic Light) */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 font-bold uppercase mr-1 hidden sm:inline">
                Signal:
              </span>

              {/* Red Signal Bulb Button */}
              <button
                type="button"
                onClick={() => handleSignalSelect('red')}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  signalBulb === 'red'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/50'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60 hover:opacity-100'
                }`}
                title="Signal 1: Urgent Issue / Whistleblower / Open"
              >
                <SignalGlyphRed active={signalBulb === 'red'} className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Urgent</span>
              </button>

              {/* Amber Signal Bulb Button */}
              <button
                type="button"
                onClick={() => handleSignalSelect('amber')}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  signalBulb === 'amber'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/50'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60 hover:opacity-100'
                }`}
                title="Signal 2: Notice / In Progress / Investigation"
              >
                <SignalGlyphAmber active={signalBulb === 'amber'} className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Alert</span>
              </button>

              {/* Green Signal Bulb Button */}
              <button
                type="button"
                onClick={() => handleSignalSelect('green')}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                  signalBulb === 'green'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/50'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60 hover:opacity-100'
                }`}
                title="Signal 3: Praise & Commendation / Resolved"
              >
                <SignalGlyphGreen active={signalBulb === 'green'} className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Praise</span>
              </button>
            </div>

            {/* Right: Quick Action Icons & Post Button */}
            <div className="flex items-center gap-2">
              {/* Photo Upload Icon */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition cursor-pointer ${
                  attachedImage ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : ''
                }`}
                title="Attach photo"
              >
                <Image size={17} />
              </button>

              {/* Location Tag */}
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className={`p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition cursor-pointer ${
                  showLocationPicker ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : ''
                }`}
                title={`Parish: ${parishName}`}
              >
                <MapPin size={17} />
              </button>

              {/* Desk Picker */}
              <button
                type="button"
                onClick={() => setShowDeptPicker(!showDeptPicker)}
                className={`p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition cursor-pointer ${
                  showDeptPicker ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : ''
                }`}
                title={`Desk: ${selectedDept.name}`}
              >
                <Building2 size={17} />
              </button>

              {/* Anonymous Toggle */}
              <button
                type="button"
                onClick={() => setAnonymous(!anonymous)}
                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                  anonymous
                    ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title={anonymous ? 'Protected Anonymous Citizen' : 'Public Citizen'}
              >
                <Lock size={16} />
              </button>

              {/* Post Button (AI Studio / Twitter/X style) */}
              <button
                type="button"
                onClick={handleQuickSubmit}
                disabled={!body.trim() || isSubmitting}
                className={`px-3.5 py-1.5 rounded-lg font-mono font-semibold text-xs sm:text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                  body.trim() && !isSubmitting
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95 border border-emerald-500'
                    : 'bg-slate-100 dark:bg-[#1a202c] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 cursor-not-allowed'
                }`}
              >
                <span>{isSubmitting ? 'Posting...' : 'Dispatch'}</span>
                <span className="hidden sm:inline-block text-[10px] font-mono opacity-70 px-1 py-0.2 rounded bg-black/20 dark:bg-white/10">⌘↵</span>
              </button>
            </div>
          </div>

          {/* Quick Info Chip (Active Desk & Parish/Ward/Grassroot display in Google AI Studio monospace metadata style) */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#141926] border border-slate-200/80 dark:border-[#222838] text-slate-700 dark:text-slate-300">
              <span className="text-[10px] uppercase text-slate-400">Desk:</span>
              <strong className="font-semibold text-slate-800 dark:text-slate-200">{selectedDept.name}</strong>
            </span>
            <span className="text-slate-400">·</span>
            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#141926] border border-slate-200/80 dark:border-[#222838] hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
              title="Click to configure grassroots parish / ward / cell hierarchy"
            >
              <MapPin size={10} className="text-emerald-600 dark:text-emerald-400" />
              <span>{parishName}</span>
              <span className="text-slate-400">/</span>
              <span>{wardName}</span>
              <span className="text-slate-400">/</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{grassrootName}</span>
            </button>
            {anonymous && (
              <>
                <span className="text-slate-400">·</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-[10.5px]">
                  <Lock size={10} />
                  <span>Protected Citizen</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
