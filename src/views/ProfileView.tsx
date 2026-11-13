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
  Inbox,
  Users,
  Briefcase,
  Home,
  History,
  ArrowRight,
  Ticket,
  Gift,
  Zap,
  Sparkles,
  Clock,
  Fuel,
  ShoppingBag,
  Wifi,
  Droplets,
  HeartPulse,
  Scissors,
  Store,
  Tag,
} from 'lucide-react';
import { getCountryPerks } from '../data/countryPerks';
import { getCountryGovernanceSchema } from '../data/countryGovernance';
import { COUNTRIES } from '../data/countries';
import { INITIAL_MERCHANT_PRODUCTS } from '../data/merchantLoyaltyData';
import { AvatarUploadModal } from '../components/AvatarUploadModal';
import { ParishRelocationModal } from '../components/ParishRelocationModal';

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
  const activeCountry = (activeUser.country || 'UG').toUpperCase();
  const countryPerks = getCountryPerks(activeCountry);
  const gov = getCountryGovernanceSchema(activeCountry);
  const countryMeta = COUNTRIES[activeCountry];
  const isUg = activeCountry === 'UG';
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

  const [activeTab, setActiveTab] = useState<'reports' | 'resolved' | 'praise' | 'saved' | 'vouchers'>('reports');
  const [showCivicCardModal, setShowCivicCardModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showReputationRules, setShowReputationRules] = useState(false);
  const [showParishModal, setShowParishModal] = useState(false);
  const [selectedVoucherPass, setSelectedVoucherPass] = useState<any | null>(null);

  // Perk Categories and Merchant Directory State
  const [selectedPerkCategory, setSelectedPerkCategory] = useState<string | null>(null);
  const [showShopDirectoryModal, setShowShopDirectoryModal] = useState(false);
  const [shopParishFilter, setShopParishFilter] = useState<'all' | 'my_parish'>('all');
  const [claimedPasses, setClaimedPasses] = useState<any[]>([]);

  const PERK_CATEGORIES = [
    {
      id: 'fuel_transport',
      title: 'Fuel & Transport',
      icon: Fuel,
      matchCats: ['automotive_motorbikes', 'transport'],
      baseXp: 25,
      desc: isUg
        ? 'Shell, TotalEnergies, bodaboda maintenance & transit vouchers'
        : `Fuel pump rebates, local transit & commercial rider maintenance vouchers`,
    },
    {
      id: 'groceries_food',
      title: 'Groceries & Food',
      icon: ShoppingBag,
      matchCats: ['groceries_consumables', 'retail_shops'],
      baseXp: 15,
      desc: isUg
        ? 'Quality Supermarket discounts, artisan bakeries & fresh market staples'
        : 'Supermarket discounts, artisan bakeries & fresh market staples',
    },
    {
      id: 'telecom_data',
      title: 'Telecom & 5G Data',
      icon: Wifi,
      matchCats: ['services_digital_products', 'electronics'],
      baseXp: 20,
      desc: `${countryPerks.digitalPerks[0]?.brand || 'National Carrier'} data bundles & airtime recharges`,
    },
    {
      id: 'water_solar',
      title: 'Clean Water & Solar',
      icon: Droplets,
      matchCats: ['home_living', 'agriculture_industrial'],
      baseXp: 30,
      desc: 'Clean water vending tokens, solar lamps & home power units',
    },
    {
      id: 'health_pharmacy',
      title: 'Health & Pharmacy',
      icon: HeartPulse,
      matchCats: ['health_wellness'],
      baseXp: 35,
      desc: 'Prescription pharmacy credits, first aid & clinic subsidies',
    },
    {
      id: 'personal_care',
      title: 'Personal Care & Craft',
      icon: Scissors,
      matchCats: ['beauty_personal_care', 'fashion_apparel'],
      baseXp: 10,
      desc: 'Executive barbers, salons, tailoring & repair craft workshops',
    },
  ];

  // User Civic Vouchers & Courtesy Goodwill Passes
  const postCourtesyVouchers = (posts || []).flatMap((p) =>
    (p.comments || [])
      .filter((c) => c.courtesy_voucher)
      .map((c) => ({
        id: `post-cv-${c.id}`,
        code: c.courtesy_voucher!.voucherCode,
        title: c.courtesy_voucher!.title,
        brand: c.courtesy_voucher!.brand,
        faceValue: Number(c.courtesy_voucher!.faceValue || 5000),
        currency: c.courtesy_voucher!.currency || gov.currency,
        note: c.courtesy_voucher!.note || 'Issued in appreciation for verified civic feedback.',
        source: `Official Desk · Dispatch #${p.id.slice(-6).toUpperCase()}`,
        expires: 'Valid 60 Days',
        status: 'active',
        type: 'courtesy',
      }))
  );

  const defaultCivicPasses = [
    {
      id: 'civic-pass-01',
      code: `FUEL-${activeCountry}-7721`,
      title: `${countryPerks.digitalPerks[0]?.brand || 'National Energy'} Frontline Fuel Pass`,
      brand: countryPerks.digitalPerks[0]?.brand || 'National Fuel Partner',
      faceValue: 40000,
      currency: gov.currency,
      note: 'Civic Watchdog Frontline Bounty · Redeemable at any certified pump station.',
      source: 'Civic Watchdog Merit Escrow',
      expires: 'Valid 45 Days',
      status: 'active',
      type: 'merit',
    },
    {
      id: 'civic-pass-02',
      code: `DATA-${activeCountry}-9012`,
      title: `${countryPerks.digitalPerks[0]?.brand || 'National Telecom'} Watchdog Data Bundle`,
      brand: `${countryMeta?.name || gov.countryName} Telecom Cooperative`,
      faceValue: 25000,
      currency: gov.currency,
      note: 'Sponsored connectivity for verified on-ground GPS report transmission.',
      source: 'Statutory Telecom CSR Allocation',
      expires: 'Valid 30 Days',
      status: 'active',
      type: 'merit',
    },
    {
      id: 'civic-pass-03',
      code: `GROC-${activeCountry}-5510`,
      title: 'Fresh Produce & Grocery Community Relief Pack',
      brand: `${countryPerks.countryName} Community Grocery Alliance`,
      faceValue: 30000,
      currency: gov.currency,
      note: 'Redeemable for fresh farm produce, staples, and household essentials.',
      source: 'Neighborhood Trader Alliance',
      expires: 'Valid 90 Days',
      status: 'active',
      type: 'merit',
    },
  ];

  const allVouchers = [...claimedPasses, ...postCourtesyVouchers, ...defaultCivicPasses];

  const handleUpdateParish = (newParish: string, reason: string) => {
    const now = new Date().toISOString().split('T')[0];
    const prevParish = activeUser.parish || activeUser.parish_ward || `${gov.sampleJurisdictions[0] || countryMeta.name} ${gov.tier1UnitLabel}`;
    const newRecord = {
      id: 'move-' + Date.now(),
      fromParish: prevParish,
      toParish: newParish,
      movedAt: now,
      reason,
    };
    const existingHistory = activeUser.parish_relocation_history || [];
    const updatedUser = {
      ...activeUser,
      parish: newParish,
      last_parish_change_iso: new Date().toISOString(),
      parish_relocation_history: [newRecord, ...existingHistory],
    };
    setUser(updatedUser);
    setEditLocation(`${newParish} · Registered Neighborhood`);
    try {
      localStorage.setItem('cd_user', JSON.stringify(updatedUser));
    } catch {}
  };

  const prevParishFallback = `${gov.sampleJurisdictions[0] || countryMeta?.name || gov.countryName} ${gov.tier1UnitLabel}`;
  void prevParishFallback;

  const isGov = ['node_admin', 'spokesperson', 'read_only', 'platform_admin'].includes(activeUser.role);
  const isPrivateProvider = Boolean(
    activeUser.entity_type === 'non_government_entity' ||
      activeUser.dept?.startsWith('ent-') ||
      activeUser.entity_category ||
      ['sch_gayaza', 'cafe_javas', 'hospital_mulago_private', 'bank_stanbic', 'ent-sch-gayaza', 'ent-cafe-javas'].includes(activeUser.dept || '')
  );

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
      {/* 0. Institutional & Verified Desk Quick-Access Card (When logged in as Official or Provider) */}
      {(isGov || isPrivateProvider) && (
        <div className="bg-white dark:bg-[#161a22] border-2 border-emerald-500/40 dark:border-emerald-500/30 rounded-xl overflow-hidden shadow-xs">
          <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-600/15 to-emerald-500/5 border-b border-emerald-500/20 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 truncate">
                {isPrivateProvider ? 'Institutional Provider Authority' : 'Statutory Government Authority'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              Active Executive Session
            </span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Building2 size={24} />
              </div>
              <div className="min-w-0">
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {activeUser.organization_name || activeUser.name}
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                  {activeUser.real_title_short || activeUser.role_label || 'Official Executive Desk'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => go('gov_inbox')}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Inbox size={14} />
                <span>Open Desk Inbox</span>
              </button>
              <button
                type="button"
                onClick={() => go(isPrivateProvider ? 'entity_team' : 'gov_team')}
                className="px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Users size={14} />
                <span>Team</span>
              </button>
              <button
                type="button"
                onClick={() => go('gov_projects')}
                className="px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Briefcase size={14} />
                <span>Works</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Citizen Onboarding & Statutory Identity Verification Card */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Citizen Onboarding &amp; Identity Attestation</h4>
                <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold">
                  Zero-Knowledge Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                {countryMeta?.id_label || 'National ID'}, Foreign Expatriate Permit, and {gov.tier1UnitLabel} Jurisdiction Setup. Cryptographic salt protects raw PII while securing 1-citizen-1-voice integrity.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => go('ob1')}
            className="px-3 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            <span>Review Onboarding Setup</span>
            <ArrowRight size={13} />
          </button>
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

        {/* Civic Perks & Merchant Rewards Category Form with Notification Badges */}
        <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Civic XP Perks &amp; Participating Merchant Shops
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              {score} XP Balance
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Tap any category below to view certified shops in your parish and claim merchant voucher passes with your CivicScore balance.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PERK_CATEGORIES.map((cat) => {
              const matchedProducts = INITIAL_MERCHANT_PRODUCTS.filter((p) =>
                cat.matchCats.includes(p.category) && (!p.country || p.country === activeCountry)
              );
              const totalCount = matchedProducts.length > 0 ? matchedProducts.length : 6;
              const isEligible = score >= cat.baseXp;
              const claimableCount = isEligible ? Math.min(totalCount, Math.max(1, Math.floor(score / cat.baseXp))) : 0;
              const CatIcon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedPerkCategory(cat.id);
                    setShowShopDirectoryModal(true);
                  }}
                  className="p-2.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-left flex flex-col justify-between gap-2 cursor-pointer group shadow-2xs relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-1 w-full">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <CatIcon size={15} />
                    </div>

                    {/* Pop-up Notification Badge */}
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border border-[#e3e6ea] dark:border-[#262b36] shadow-2xs">
                        {totalCount} Available
                      </span>
                      {claimableCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-mono font-bold bg-emerald-600 text-white shadow-xs animate-pulse">
                          <span className="w-1 h-1 rounded-full bg-white" />
                          <span>{claimableCount} Claimable</span>
                        </span>
                      ) : (
                        <span className="text-[8.5px] font-mono text-slate-400">
                          {cat.baseXp} XP min
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight truncate">
                      {cat.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {cat.desc}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 border-t border-[#e3e6ea]/60 dark:border-[#262b36]/60">
                    <span>View Shops</span>
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => go('perk_vault')}
            className="w-full p-2.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Award size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                Open Sovereign Perk Escrow Vault &amp; Statutory Honours
              </span>
            </div>
            <ArrowUpRight size={14} className="text-slate-400 shrink-0" />
          </button>
        </div>
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
            { id: 'vouchers', label: `Passes & Vouchers (${allVouchers.length})` },
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

        {activeTab === 'vouchers' ? (
          /* =========================================================================
             CITIZEN VOUCHER & CIVIC PASS WALLET
             ========================================================================= */
          <div className="p-4 space-y-4 animate-fade-in">
            {/* Wallet Balance & Escrow Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600/15 via-emerald-500/10 to-amber-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Sovereign Citizen Perk &amp; Pass Wallet</span>
                </div>
                <div className="text-base sm:text-lg font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                  {allVouchers.reduce((acc, v) => acc + Number(v.faceValue || 0), 0).toLocaleString()} {gov.currency} Available
                </div>
                <p className="text-[10.5px] text-slate-600 dark:text-slate-400 mt-0.5">
                  Secured by CivicDuty Sovereign Escrow. Present QR passes directly at cashier counters.
                </p>
              </div>

              <button
                type="button"
                onClick={() => go('perk_vault')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer transition shadow-xs"
              >
                <Plus size={12} />
                <span>Browse Perk Vault</span>
              </button>
            </div>

            {/* Vouchers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allVouchers.map((v) => (
                <div
                  key={v.id}
                  className="rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] p-3.5 flex flex-col justify-between gap-3 hover:border-emerald-500/50 transition shadow-2xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                        {v.brand}
                      </span>
                      <span className="text-[9.5px] font-mono text-slate-400 dark:text-slate-500">
                        {v.expires}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {v.title}
                    </h4>

                    <div className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {v.currency} {Number(v.faceValue).toLocaleString()} VALUE
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {v.note}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] px-2 py-1 rounded select-all truncate">
                        {v.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(v.code);
                          toast(`Voucher code ${v.code} copied to clipboard!`, 'emerald');
                        }}
                        className="p-1 rounded text-slate-400 hover:text-emerald-600 transition"
                        title="Copy Code"
                      >
                        <Copy size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedVoucherPass(v)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10.5px] font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition"
                    >
                      <QrCode size={12} />
                      <span>Show QR Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* 5. Parish Neighborhood & Relocation Docket */}
      <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl p-4 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <Home size={15} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Registered Parish &amp; Neighborhood
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Current: <strong className="text-slate-900 dark:text-white">{activeUser.parish || 'Bukoto Central Parish'}</strong>
              <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] ml-2">
                (Local perks &amp; grassroots near-me feed bound to this jurisdiction)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowParishModal(true)}
              className="px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Home size={12} />
              <span>Change Parish</span>
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

        {/* Relocation History Log */}
        {activeUser.parish_relocation_history && activeUser.parish_relocation_history.length > 0 && (
          <div className="pt-3 border-t border-[#e3e6ea] dark:border-[#262b36] space-y-2">
            <div className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              <History size={12} className="text-indigo-500" />
              <span>Parish Relocation History &amp; Move Log</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {activeUser.parish_relocation_history.map((record) => (
                <div
                  key={record.id}
                  className="p-2 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] truncate">
                      {record.fromParish}
                    </span>
                    <ArrowRight size={11} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {record.toParish}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10.5px] font-mono text-slate-500 shrink-0">
                    <span>{record.movedAt}</span>
                    <span className="italic text-slate-400 truncate max-w-[150px]">
                      "{record.reason}"
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parish Relocation Modal */}
      <ParishRelocationModal
        isOpen={showParishModal}
        onClose={() => setShowParishModal(false)}
        user={activeUser}
        onUpdateParish={handleUpdateParish}
        toast={toast}
      />

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

      {/* CASHIER COUNTERTOP QR PASS MODAL */}
      {selectedVoucherPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-4 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Ticket size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Cashier Redemption Pass
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    CivicDuty Escrow Backed
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVoucherPass(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  {selectedVoucherPass.brand}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedVoucherPass.title}
                </h3>
                <div className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedVoucherPass.currency} {Number(selectedVoucherPass.faceValue).toLocaleString()} VALUE
                </div>
              </div>

              {/* High-Resolution Interactive Visual QR Pass */}
              <div className="p-4 bg-white rounded-xl border-2 border-dashed border-emerald-500/40 inline-block shadow-inner mx-auto">
                <div className="w-44 h-44 bg-slate-950 p-2 rounded-lg flex flex-col items-center justify-center text-white relative">
                  {/* Outer Frame Corners */}
                  <div className="absolute top-1 left-1 w-7 h-7 border-t-4 border-l-4 border-emerald-400" />
                  <div className="absolute top-1 right-1 w-7 h-7 border-t-4 border-r-4 border-emerald-400" />
                  <div className="absolute bottom-1 left-1 w-7 h-7 border-b-4 border-l-4 border-emerald-400" />
                  <div className="absolute bottom-1 right-1 w-7 h-7 border-b-4 border-r-4 border-emerald-400" />
                  <QrCode size={110} className="text-white" />
                  <span className="text-[8.5px] font-mono tracking-widest text-emerald-400 mt-1 font-bold">
                    SCAN AT TILL
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Alphanumeric Cashier PIN
                </span>
                <div className="text-base font-mono font-bold text-slate-900 dark:text-white bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] py-2 px-3 rounded-lg select-all flex items-center justify-between">
                  <span>{selectedVoucherPass.code}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedVoucherPass.code);
                      toast('Code copied to clipboard!', 'emerald');
                    }}
                    className="text-xs font-mono text-emerald-600 hover:underline cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Present this pass at any participating merchant or utility counter. The cashier scans the QR code or inputs the PIN into their CivicDuty terminal for instant credit redemption.
              </p>

              <button
                type="button"
                onClick={() => setSelectedVoucherPass(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold cursor-pointer transition shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participating Community Shops & Merchants Directory Modal */}
      {showShopDirectoryModal && selectedPerkCategory && (() => {
        const currentCat = PERK_CATEGORIES.find((c) => c.id === selectedPerkCategory) || PERK_CATEGORIES[0];
        const CatIcon = currentCat.icon;
        const allCatProducts = INITIAL_MERCHANT_PRODUCTS.filter((p) =>
          currentCat.matchCats.includes(p.category) && (!p.country || p.country === activeCountry)
        );
        const myParishName = activeUser.parish || 'Kitintale Parish';
        const filteredProducts =
          shopParishFilter === 'my_parish'
            ? allCatProducts.filter((p) => p.parish?.toLowerCase().includes(myParishName.toLowerCase().split(' ')[0]))
            : allCatProducts;

        const handleClaimMerchantVoucher = (product: any) => {
          const voucherCode = `CD-${currentCat.id.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
          const newVoucher = {
            id: 'vch-' + Date.now(),
            code: voucherCode,
            title: product.rewardHeadline || product.title,
            brand: product.merchantName,
            faceValue: product.voucherCost || 20000,
            currency: product.currency || gov.currency,
            note: product.rewardDescription || 'Verified community merchant perk voucher.',
            source: `Certified Merchant · ${product.parish || 'Parish'}`,
            expires: 'Valid 60 Days',
            status: 'active',
            type: 'merit',
          };
          setClaimedPasses((prev) => [newVoucher, ...prev]);
          setShowShopDirectoryModal(false);
          setSelectedVoucherPass(newVoucher);
          toast(`Claimed perk pass for ${product.merchantName}! Code: ${voucherCode}`, 'emerald');
        };

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="px-4 py-3.5 border-b border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CatIcon size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentCat.title} · Certified Merchant Directory
                    </div>
                    <div className="text-[10.5px] font-mono text-emerald-600 dark:text-emerald-400">
                      {filteredProducts.length} Verified Participating Outlets
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowShopDirectoryModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Parish Filter Tabs */}
              <div className="px-4 py-2 border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center gap-2 bg-slate-50 dark:bg-[#12151b]">
                <button
                  type="button"
                  onClick={() => setShopParishFilter('all')}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                    shopParishFilter === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-400 border border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  All Outlets ({allCatProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShopParishFilter('my_parish')}
                  className={`px-3 py-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                    shopParishFilter === 'my_parish'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-[#161a22] text-slate-600 dark:text-slate-400 border border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  Near My Parish ({myParishName.split(' ')[0]})
                </button>
              </div>

              {/* Shop List Body */}
              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 space-y-2">
                    <Store size={28} className="mx-auto text-slate-400 opacity-60" />
                    <div className="text-xs font-semibold">No merchants found in this parish view</div>
                    <p className="text-[11px]">
                      Switch to "All Outlets" above to explore verified merchants across {countryPerks.countryName}.
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-xl border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2.5 transition-colors hover:border-emerald-500/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {p.merchantName}
                            </span>
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          </div>
                          <div className="text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate">{p.address || `${p.parish}, ${p.district}`}</span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shrink-0">
                          {p.rewardType?.toUpperCase() || 'OFFER'}
                        </span>
                      </div>

                      {/* Offer Description */}
                      <div className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {p.rewardHeadline || p.title}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {p.rewardDescription}
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#e3e6ea]/60 dark:border-[#262b36]/60">
                          <span>USSD: {p.ussdCode || '*303*2040#'}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            Value: {p.currency} {Number(p.voucherCost || p.basePrice).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Claim Action */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <span>Required: </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {currentCat.baseXp} XP
                          </span>
                          <span className="text-slate-400"> (You have {score} XP)</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleClaimMerchantVoucher(p)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Ticket size={12} />
                          <span>Claim 1-Tap Voucher Pass</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-4 py-2.5 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Certified Sovereign Merchant Alliance</span>
                <button
                  type="button"
                  onClick={() => setShowShopDirectoryModal(false)}
                  className="text-slate-700 dark:text-slate-300 font-bold hover:underline cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
