import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Upload, 
  Camera, 
  Check, 
  User, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  ShieldCheck, 
  Sliders, 
  Palette,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

interface AvatarUploadModalProps {
  isOpen?: boolean;
  onClose: () => void;
  targetUserId?: string;
  initialAvatar?: string;
  initialName?: string;
}

// Preset Civic Badges and Avatar Icons with styled svg data uris or icons
const PRESET_AVATARS = [
  {
    id: 'sovereign_citizen',
    label: 'Sovereign Citizen',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    color: 'from-amber-500 to-amber-700',
    badge: '🏛️',
  },
  {
    id: 'parish_watchdog',
    label: 'Parish Watchdog',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    color: 'from-teal-500 to-emerald-700',
    badge: '🔍',
  },
  {
    id: 'corruption_sentinel',
    label: 'Anti-Corruption Sentinel',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
    color: 'from-rose-500 to-red-700',
    badge: '⚖️',
  },
  {
    id: 'field_reporter',
    label: 'Field Reporter',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    color: 'from-blue-500 to-indigo-700',
    badge: '📋',
  },
  {
    id: 'civic_champion',
    label: 'Civic Champion',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&auto=format&fit=crop&q=80',
    color: 'from-amber-400 to-yellow-600',
    badge: '🌟',
  },
  {
    id: 'public_officer',
    label: 'Public Officer',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&auto=format&fit=crop&q=80',
    color: 'from-slate-600 to-slate-900',
    badge: '🏢',
  },
  {
    id: 'infrastructure_monitor',
    label: 'Infrastructure Monitor',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=256&auto=format&fit=crop&q=80',
    color: 'from-orange-500 to-amber-700',
    badge: '⚡',
  },
  {
    id: 'water_marshal',
    label: 'Water & Environment',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&auto=format&fit=crop&q=80',
    color: 'from-cyan-500 to-teal-700',
    badge: '💧',
  },
];

// Color gradients for initials avatar
const GRADIENT_PALETTES = [
  { id: 'amber', name: 'Warm Amber', bg: 'bg-gradient-to-tr from-amber-600 to-amber-400', text: 'text-white' },
  { id: 'teal', name: 'Civic Teal', bg: 'bg-gradient-to-tr from-teal-700 to-emerald-500', text: 'text-white' },
  { id: 'indigo', name: 'Deep Indigo', bg: 'bg-gradient-to-tr from-indigo-700 to-sky-500', text: 'text-white' },
  { id: 'slate', name: 'Slate Steel', bg: 'bg-gradient-to-tr from-slate-800 to-slate-500', text: 'text-white' },
  { id: 'rose', name: 'Crimson Watch', bg: 'bg-gradient-to-tr from-rose-700 to-pink-500', text: 'text-white' },
  { id: 'violet', name: 'Sovereign Violet', bg: 'bg-gradient-to-tr from-purple-800 to-violet-500', text: 'text-white' },
];

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen = true,
  onClose,
  targetUserId,
  initialAvatar,
  initialName,
}) => {
  const { user, profiles, setProfiles, setUser, toast, logAudit } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeUid = targetUserId || user?.id || 'usr-9028-UG';
  const currentProfile = profiles[activeUid];
  
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    initialAvatar || currentProfile?.avatar_url || user?.avatar_url || ''
  );
  const [displayName, setDisplayName] = useState<string>(
    initialName || currentProfile?.display_name || user?.name || 'Citizen'
  );
  const [bio, setBio] = useState<string>(currentProfile?.bio || 'Verified Sovereign Citizen');
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'initials'>('upload');
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  // Compress & crop image to lightweight 256x256 data URL using canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please select a valid image file (JPEG, PNG, WebP)', 'amber');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast('Image file too large (max 10MB)', 'amber');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Center-crop square calculation
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

        // Convert to WebP or JPEG base64 (compressed to ~30-50kb)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedAvatar(dataUrl);
        setIsProcessing(false);
        toast('Photo uploaded and optimized successfully!', 'emerald');
      };
      img.onerror = () => {
        setIsProcessing(false);
        toast('Failed to parse image', 'red');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const generateInitialsAvatar = () => {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = GRADIENT_PALETTES[selectedPalette];
    
    // Draw gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    if (palette.id === 'amber') {
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(1, '#b45309');
    } else if (palette.id === 'teal') {
      grad.addColorStop(0, '#0f766e');
      grad.addColorStop(1, '#047857');
    } else if (palette.id === 'indigo') {
      grad.addColorStop(0, '#4338ca');
      grad.addColorStop(1, '#0284c7');
    } else if (palette.id === 'rose') {
      grad.addColorStop(0, '#be123c');
      grad.addColorStop(1, '#9f1239');
    } else {
      grad.addColorStop(0, '#334155');
      grad.addColorStop(1, '#0f172a');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Draw initials
    const initials = displayName
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join('') || 'C';

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 100px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, size / 2, size / 2);

    const dataUrl = canvas.toDataURL('image/png');
    setSelectedAvatar(dataUrl);
    toast('Custom initials avatar created', 'emerald');
  };

  const handleSave = () => {
    const cleanName = displayName.trim() || 'Citizen';

    // Update in profiles dictionary
    setProfiles((prev) => {
      const existing = prev[activeUid] || {};
      const updated = {
        ...existing,
        id: activeUid,
        display_name: cleanName,
        avatar_url: selectedAvatar,
        bio: bio.trim(),
      };
      try {
        localStorage.setItem('cd_profiles', JSON.stringify({ ...prev, [activeUid]: updated }));
      } catch {}
      return { ...prev, [activeUid]: updated };
    });

    // Update user session if target is current user
    if (user && user.id === activeUid) {
      const updatedUser = {
        ...user,
        name: cleanName,
        avatar_url: selectedAvatar,
      };
      setUser(updatedUser);
      try {
        localStorage.setItem('cd_user', JSON.stringify(updatedUser));
      } catch {}
    }

    logAudit('profile_update', activeUid, `Updated profile picture & display name to ${cleanName}`);
    toast('Profile updated and saved to sovereign ledger!', 'emerald');
    onClose();
  };

  const handleRemovePhoto = () => {
    setSelectedAvatar('');
    toast('Photo removed. Default identity badge restored.', 'amber');
  };

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88dvh] sm:max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Camera size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black mono uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Profile Photo & Identity
              </h3>
              <p className="text-[10px] mono text-slate-500 dark:text-slate-400">
                Customize your sovereign civic avatar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto overscroll-contain flex-1 text-slate-800 dark:text-slate-100">
          {/* Avatar Preview HUD */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-600/40 dark:border-amber-500/40 bg-slate-200 dark:bg-slate-800 shadow-md flex items-center justify-center relative">
                {selectedAvatar ? (
                  <img
                    src={selectedAvatar}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-2 text-center">
                    <User size={32} strokeWidth={1.5} />
                    <span className="text-[8px] mono mt-1 font-bold">No Photo</span>
                  </div>
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center text-white">
                    <RefreshCw size={20} className="animate-spin text-amber-400" />
                  </div>
                )}
              </div>

              {selectedAvatar && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-md border border-white dark:border-slate-900 transition-all hover:scale-110 cursor-pointer"
                  title="Remove Photo"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <span className="text-[9px] mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck size={12} /> Live Preview
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {displayName || 'Citizen'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {bio || 'Verified Sovereign Citizen'}
              </p>
              <div className="pt-0.5 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[8.5px] mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                  Active in Reports &amp; Leaderboards
                </span>
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 gap-1 text-[10px] mono font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Upload size={13} />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles size={13} />
              <span>Civic Presets</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('initials')}
              className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'initials'
                  ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Palette size={13} />
              <span>Initials</span>
            </button>
          </div>

          {/* Tab 1: Upload Custom File */}
          {activeTab === 'upload' && (
            <div className="space-y-3 animate-fade-in">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 sm:p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-1.5 active:scale-[.99] ${
                  dragOver
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500/50 bg-slate-50/50 dark:bg-slate-950/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <Camera size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click to choose photo or take camera picture
                  </p>
                  <p className="text-[9.5px] mono text-slate-500 dark:text-slate-400 mt-0.5">
                    Supports JPEG, PNG, WebP up to 10MB (Auto-cropped to 256x256)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-1 px-4 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 text-[10px] mono font-bold tracking-wider uppercase transition-colors shadow-xs active:scale-95 cursor-pointer"
                >
                  Browse Device / Camera
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Curated Civic Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-[10px] mono text-slate-500 dark:text-slate-400">
                Choose a verified sovereign role avatar:
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = selectedAvatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(preset.url);
                        toast(`Selected ${preset.label} avatar`, 'emerald');
                      }}
                      className={`group flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 dark:bg-amber-500/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-white dark:bg-slate-950/60'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 text-[10px] p-0.5 bg-slate-950/80 rounded-tl">
                          {preset.badge}
                        </div>
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center text-white">
                            <CheckCircle2 size={16} className="text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                      <span className="text-[8.5px] mono font-medium text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Initials Monogram Badge */}
          {activeTab === 'initials' && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-[10px] mono text-slate-500 dark:text-slate-400">
                Select a color style to generate a monogram badge:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {GRADIENT_PALETTES.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPalette(idx);
                    }}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                      selectedPalette === idx
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg ${p.bg} flex-shrink-0`} />
                    <span className="text-[9.5px] mono font-bold text-slate-700 dark:text-slate-300">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={generateInitialsAvatar}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600 text-xs mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles size={14} />
                <span>Generate Monogram Badge</span>
              </button>
            </div>
          )}

          {/* Profile Details Edit */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div>
              <label className="text-[9.5px] mono uppercase font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Inzama Robin"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[9.5px] mono uppercase font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Civic Bio / Motto
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Active Parish Champion · Nakawa"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer - Always Fixed at the bottom of the card */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-950/95 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs mono font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs mono font-bold uppercase tracking-wider bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 rounded-xl flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Check size={15} />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
