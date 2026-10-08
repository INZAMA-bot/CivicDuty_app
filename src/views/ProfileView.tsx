import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getDept, pathStr } from '../utils/helpers';
import { PostCardComponent } from '../components/PostCardComponent';
import { DeptIcon } from '../components/DeptIcon';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Camera,
  Edit3,
  MapPin,
  Calendar,
  Share2,
  Bookmark,
  Check,
  X,
  Building2,
  QrCode,
  Copy,
  Download,
  Lock,
  Plus,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  LogOut,
  Globe,
} from 'lucide-react';
import { getCountryPerks } from '../data/countryPerks';
import { AvatarUploadModal } from '../components/AvatarUploadModal';

export const ProfileView: React.FC = () => {
  const {
    user,
    ensureCitizenSession,
    setUser,
    profiles,
    posts,
    go,
    setActiveDept,
    setActiveDeptCountry,
    setActivePost,
    toast,
    updateUserProfile,
    updateUserAvatar,
    bookmarks,
  } = useApp();

  const activeUser = user || ensureCitizenSession();
  const profile: any = (profiles && profiles[activeUser.id]) || {
    civic_score: 50,
    display_name: activeUser.name || 'Citizen Watchdog',
    followed: activeUser.followed || ['nwsc', 'umeme', 'kcca'],
  };

  const displayName = profile.display_name || activeUser.name || 'Citizen Watchdog';

  const myPosts = (posts || []).filter(
    (p) => p.citizen_id === activeUser.id || p.citizen_name === displayName || p.citizen_name === activeUser.name
  );
  const myPraisePosts = myPosts.filter((p) => p.category === 'praise');
  const myResolvedPosts = myPosts.filter((p) => p.status === 'resolved');
  const savedPosts = (posts || []).filter((p) => (bookmarks || []).includes(p.id));
  const followed: string[] = activeUser.followed || profile.followed || [];
  const score = profile.civic_score || 50;

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(displayName);
  const [editBio, setEditBio] = useState(
    profile.bio ||
      'Verified Civic Watchdog monitoring public service delivery, infrastructure SLAs, and statutory accountability.'
  );
  const [editLocation, setEditLocation] = useState(
    profile.location || pathStr(activeUser.country, (activeUser as any).territory || {}) || 'National Jurisdiction'
  );
  const [isAnonMode, setIsAnonMode] = useState((activeUser as any).anon !== false);

  const [activeTab, setActiveTab] = useState<'reports' | 'resolved' | 'praise' | 'saved'>('reports');
  const [showCivicCardModal, setShowCivicCardModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showReputationRules, setShowReputationRules] = useState(false);

  const activeCountry = activeUser.country || 'UG';
  const countryPerks = getCountryPerks(activeCountry);

  const tier =
    score >= 300
      ? { name: 'National Civic Guardian', short: 'Guardian', next: 500 }
      : score >= 150
      ? { name: 'Verified Civic Champion', short: 'Champion', next: 300 }
      : score >= 50
      ? { name: 'Trusted Parish Watchdog', short: 'Watchdog', next: 150 }
      : { name: 'Citizen Observer', short: 'Observer', next: 50 };

  const progressPct = Math.min(100, Math.round((score / tier.next) * 100));

  const initials =
    displayName
      .replace(/^@/, '')
      .split(/[\s_.-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0]?.toUpperCase() || '')
      .join('') || 'CD';

  const currentAvatar = profile.avatar_url || activeUser.avatar_url;

  const handleSaveProfile = () => {
    const trimmed = editName.trim() || displayName;
    if (updateUserProfile) {
      updateUserProfile(activeUser.id, {
        display_name: trimmed,
        bio: editBio.trim(),
      });
    }
    setUser({
      ...activeUser,
      name: trimmed,
    });
    setIsEditing(false);
    toast('Identity dossier updated', 'emerald');
  };

  const handleSaveAvatar = (newAvatarUrl: string) => {
    if (updateUserAvatar) {
      updateUserAvatar(activeUser.id, newAvatarUrl);
    }
    setUser({
      ...activeUser,
      avatar_url: newAvatarUrl,
    });
    toast(newAvatarUrl ? 'Identity photo updated' : 'Reverted to default monogram', 'emerald');
  };

  const handleCopyPass = () => {
    const shareText = `CivicDuty Watchdog Dossier: ${displayName} · ${tier.name} (${score} pts) · ${myPosts.length} Dispatches Filed in ${countryPerks.countryName}.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      toast('Watchdog dossier summary copied to clipboard', 'emerald');
    }
  };

  const handleDownloadCertificate = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0e1116';
    ctx.fillRect(0, 0, 1200, 675);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 1128, 603);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`CIVICDUTY · SOVEREIGN WATCHDOG DOSSIER · ${countryPerks.countryName.toUpperCase()}`, 76, 96);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(displayName, 76, 175);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`${tier.name.toUpperCase()} · ${score} CIVIC POINTS`, 76, 225);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Jurisdiction: ${editLocation}`, 76, 285);
    ctx.fillText(
      `Dispatches: ${myPosts.length}   |   Verified Resolved: ${myResolvedPosts.length}   |   Praise: ${myPraisePosts.length}`,
      76,
      330
    );

    const certHash = `SHA256-${activeCountry}-${activeUser.id.slice(-6).toUpperCase()}-${score}`;
    ctx.fillStyle = '#64748b';
    ctx.font = '18px monospace';
    ctx.fillText(`Cryptographic Ledger Seal: ${certHash}`, 76, 575);

    const link = document.createElement('a');
    link.download = `CivicDuty-Dossier-${displayName.replace(/[^a-zA-Z0-9]/g, '')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    toast('Watchdog Dossier PNG downloaded', 'emerald');
  };

  const displayedPosts =
    activeTab === 'reports'
      ? myPosts
      : activeTab === 'resolved'
      ? myResolvedPosts
      : activeTab === 'praise'
      ? myPraisePosts
      : savedPosts;

  return (
    <div className="animate-fade-in pb-16 px-3.5 sm:px-5 pt-4 space-y-4 text-slate-900 dark:text-slate-100">
      {/* 1. Primary Studio Identity Card */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
        {/* Top Metadata Strip */}
        <div className="px-4 py-2.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Watchdog Identity Dossier · {countryPerks.countryName}
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            {isAnonMode ? 'Shielded Handle' : 'Public Handle'}
          </span>
        </div>

        {/* Main Identity Body */}
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Avatar Box (Tap to upload photo) */}
              <div
                onClick={() => setShowAvatarModal(true)}
                title="Tap to update identity photo"
                className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center overflow-hidden cursor-pointer group shrink-0"
              >
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-base sm:text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {initials}
                  </span>
                )}
                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={15} />
                </div>
              </div>

              {/* Name, Tier & Jurisdiction */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate">
                    {displayName}
                  </h1>
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                </div>
                <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {tier.name}
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} className="text-slate-400" />
                    <span>{editLocation}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} className="text-slate-400" />
                    <span>ID #{activeUser.id.slice(-5).toUpperCase()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 dark:hover:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 size={12} />
                <span>{isEditing ? 'Close' : 'Edit Identity'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCivicCardModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode size={13} />
                <span>Civic Pass</span>
              </button>
            </div>
          </div>

          {/* Bio */}
          {!isEditing && (
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {editBio}
            </p>
          )}

          {/* Inline Edit Identity Drawer */}
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    Watchdog Handle
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    placeholder="@CitizenWatchdog"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    Jurisdiction / Parish
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Amsterdam · Noord-Holland"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
                  Civic Mandate Bio
                </label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonMode}
                    onChange={(e) => setIsAnonMode(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <Lock size={12} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Keep real identity shielded (Zero-PII cryptographic pseudonym)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    className="px-3 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Camera size={12} />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Check size={13} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4-Column Telemetry Strip */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-[#e3e6ea] dark:border-[#262b36]">
            <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {myPosts.length}
              </div>
              <div className="text-[9.5px] font-mono uppercase text-slate-500 dark:text-slate-400">
                Dispatches
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-sm sm:text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {myResolvedPosts.length}
              </div>
              <div className="text-[9.5px] font-mono uppercase text-slate-500 dark:text-slate-400">
                Resolved
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-sm sm:text-base font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {myPraisePosts.length}
              </div>
              <div className="text-[9.5px] font-mono uppercase text-slate-500 dark:text-slate-400">
                Praise
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36]">
              <div className="text-sm sm:text-base font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {score}
              </div>
              <div className="text-[9.5px] font-mono uppercase text-slate-500 dark:text-slate-400">
                Civic Score
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reputation Standing & Perk Escrow Shortcut */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              Reputation Standing: {tier.short} ({score} / {tier.next} pts)
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowReputationRules(!showReputationRules)}
            className="text-[10.5px] font-mono font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Rules</span>
            {showReputationRules ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {/* Clean Progress Bar */}
        <div className="w-full h-1.5 bg-[#f1f3f4] dark:bg-[#0e1116] rounded-full overflow-hidden border border-[#e3e6ea] dark:border-[#262b36]">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* 4 Tier Milestones */}
        <div className="grid grid-cols-4 gap-1.5 text-[9.5px] font-mono">
          {[
            { label: 'Observer', min: 0 },
            { label: 'Watchdog', min: 50 },
            { label: 'Champion', min: 150 },
            { label: 'Guardian', min: 300 },
          ].map((m) => {
            const reached = score >= m.min;
            return (
              <div
                key={m.label}
                className={`px-2 py-1 rounded border text-center truncate ${
                  reached
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-400'
                }`}
              >
                {m.label} ({m.min}+)
              </div>
            );
          })}
        </div>

        {showReputationRules && (
          <div className="p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono animate-fade-in">
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+5 pts</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Verified GPS/Photo Dispatch</p>
            </div>
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+10 pts</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Confirmed Resolution</p>
            </div>
            <div>
              <span className="text-amber-600 dark:text-amber-400 font-bold">+5 pts</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Public Servant Commendation</p>
            </div>
            <div>
              <span className="text-rose-600 dark:text-rose-400 font-bold">-15 pts</span>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">Fabricated / Spam Report</p>
            </div>
          </div>
        )}

        {/* Single Concise Link to Honours & Perk Escrow Vault */}
        <button
          type="button"
          onClick={() => go('perk_vault')}
          className="w-full p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Award size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              Redeem Utility Vouchers &amp; Honours in Perk Escrow Vault
            </span>
          </div>
          <ArrowUpRight size={14} className="text-slate-400 shrink-0" />
        </button>
      </div>

      {/* 3. Monitored Desks Strip */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Building2 size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Monitored Service Desks ({followed.length})</span>
          </span>
          <button
            type="button"
            onClick={() => go('depts')}
            className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            + Directory
          </button>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {followed.map((did) => {
            const d = getDept(activeUser.country, did);
            return (
              <button
                key={did}
                type="button"
                onClick={() => {
                  setActiveDept(did);
                  setActiveDeptCountry(activeUser.country);
                  go('dept_wall');
                }}
                className="px-2.5 py-1 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[11px] font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <DeptIcon dept={d} size={11} className="text-slate-500 dark:text-slate-400" />
                <span>{d.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Citizen Dispatch Timeline */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl overflow-hidden">
        <div className="flex border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] overflow-x-auto scrollbar-none">
          {[
            { id: 'reports', label: `Dispatches (${myPosts.length})` },
            { id: 'resolved', label: `Resolved (${myResolvedPosts.length})` },
            { id: 'praise', label: `Praise (${myPraisePosts.length})` },
            { id: 'saved', label: `Saved (${savedPosts.length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 px-3 text-[11px] font-mono font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 bg-white dark:bg-[#161a22]'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="divide-y divide-[#e3e6ea] dark:divide-[#262b36]">
          {displayedPosts.length === 0 ? (
            <div className="p-8 text-center space-y-2.5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                No dispatches in this view yet.
              </p>
              <button
                type="button"
                onClick={() => go('compose')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>File New Dispatch</span>
              </button>
            </div>
          ) : (
            displayedPosts.map((post) => (
              <PostCardComponent key={post.id} post={post} />
            ))
          )}
        </div>
      </div>

      {/* 5. Jurisdiction & Session Controls */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          Zero-PII Session · SHA-256 Ledger Linked
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go('ob1')}
            className="px-3 py-1.5 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-slate-400 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Globe size={12} />
            <span>Change Jurisdiction</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setUser(null);
              go('splash');
            }}
            className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={12} />
            <span>Exit Session</span>
          </button>
        </div>
      </div>

      {/* Avatar Photo Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={currentAvatar}
        userName={displayName}
        onSave={handleSaveAvatar}
      />

      {/* Civic Pass Modal (Google AI Studio Styled) */}
      {showCivicCardModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowCivicCardModal(false)}
        >
          <div
            className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-sm w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Sovereign Watchdog Credential
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCivicCardModal(false)}
                className="w-7 h-7 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                    {countryPerks.countryName} · Watchdog Pass
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    #{activeUser.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {displayName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {tier.name} · {score} Civic Points
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] text-center font-mono">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{myPosts.length}</div>
                    <div className="text-[9px] text-slate-500">Dispatches</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {myResolvedPosts.length}
                    </div>
                    <div className="text-[9px] text-slate-500">Resolved</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {myPraisePosts.length}
                    </div>
                    <div className="text-[9px] text-slate-500">Praise</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPass}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy size={12} />
                  <span>Copy Summary</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCertificate}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
