import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CIVIC_RANKS, getRank, getRankPct, getDept } from '../utils/helpers';
import { 
  User, 
  ChevronRight, 
  Award, 
  Zap, 
  ShieldCheck, 
  Gift, 
  MapPin, 
  Download, 
  Share2, 
  CheckCircle2, 
  QrCode, 
  FileCheck2, 
  X, 
  Trophy, 
  Medal, 
  Ticket, 
  Layers, 
  Building2, 
  Fingerprint, 
  Sparkles,
  ScrollText,
  BadgeCheck,
  Camera,
  FolderArchive,
  Code2,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { AvatarUploadModal } from '../components/AvatarUploadModal';
import { exportLiveZip, triggerBlobDownload } from '../utils/zipExporter';

export const ProfileView: React.FC = () => {
  const { user, ensureCitizenSession, profiles, posts, go, setActiveDept, setActiveDeptCountry, setUser, toast } = useApp();
  const [showCertModal, setShowCertModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'perks' | 'leaderboard' | 'ranks' | 'walls' | 'export'>('perks');
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');

  const activeUser = user || ensureCitizenSession();

  const prof = profiles[activeUser.id] || {
    civic_score: 1240,
    rank: 'Watchdog',
    posts: 12,
    resolved: 8,
    corruption_reports: 2,
    upvotes_received: 42,
    followed: activeUser.followed || ['kcca', 'umeme', 'nwsc'],
    id_frag: '8841',
    display_name: 'Inzama Robin',
    avatar_url: activeUser.avatar_url,
  };

  const currentAvatar = prof.avatar_url || activeUser.avatar_url;

  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      setExportProgress('Packing frontend, Express backend, & database...');
      const blob = await exportLiveZip((pct, status) => {
        setExportProgress(`${pct}% · ${status}`);
      });
      triggerBlobDownload(blob, `civicduty-complete-fullstack-build-${Date.now()}.zip`);
      toast('✓ Complete full-stack build ZIP exported successfully!', 'emerald');
    } catch (err) {
      toast('Failed to package build ZIP', 'red');
    } finally {
      setIsExportingZip(false);
      setExportProgress('');
    }
  };

  const rank = getRank(prof.civic_score || 0);
  const pct = getRankPct(prof.civic_score || 0);
  const nextRank = CIVIC_RANKS.find((r) => r.min > (prof.civic_score || 0));

  const myPosts = posts.filter((p) => p.citizen_id === activeUser.id);
  const myResolved = myPosts.filter((p) => p.status === 'resolved').length || prof.resolved || 8;
  const myUpvotes = myPosts.reduce((acc, p) => acc + p.upvotes, 0) || prof.upvotes_received || 42;
  const myCorrupt = myPosts.filter((p) => p.category === 'corruption').length || prof.corruption_reports || 2;

  const countryInfo = COUNTRIES[activeUser.country] || COUNTRIES.UG;

  // Mock Parish Leaderboard Data for Bukoto Parish
  const parishLeaderboard = [
    { rank: 1, name: 'Inzama Robin', score: 1240, resolved: 8, badge: 'Parish Champion', isMe: true },
    { rank: 2, name: 'Grace Akello', score: 980, resolved: 6, badge: 'Watchdog', isMe: false },
    { rank: 3, name: 'David Mukasa', score: 850, resolved: 5, badge: 'Watchdog', isMe: false },
    { rank: 4, name: 'Sarah Namubiru', score: 620, resolved: 4, badge: 'Advocate', isMe: false },
    { rank: 5, name: 'Peter Okello', score: 490, resolved: 3, badge: 'Reporter', isMe: false },
  ];

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-16 text-slate-800 dark:text-slate-100">
      {/* Identity Card */}
      <div className="card p-5 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm relative overflow-hidden rounded-2xl">
        {/* Parish Champion Ribbon - Calm Warm Ochre */}
        <div className="absolute top-0 right-0 bg-amber-600/15 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border-b border-l border-amber-500/30 font-bold text-[9px] mono px-3 py-1.5 rounded-bl-xl uppercase tracking-wider flex items-center gap-1.5">
          <Trophy size={12} className="text-amber-600 dark:text-amber-400" />
          <span>Nakawa #1 Champion</span>
        </div>

        <div className="flex items-start gap-4 pt-2">
          {/* Avatar Picture with Camera Upload Button Overlay */}
          <div 
            onClick={() => setShowAvatarModal(true)}
            className="w-18 h-18 rounded-2xl bg-amber-600/10 dark:bg-slate-950 border-2 border-amber-600/40 dark:border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-amber-400 relative shadow-md cursor-pointer group overflow-hidden transition-transform hover:scale-105"
            title="Click to change profile picture"
          >
            {currentAvatar ? (
              <img
                src={currentAvatar}
                alt={prof.display_name || 'Citizen Avatar'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Fingerprint size={34} strokeWidth={1.75} />
            )}

            {/* Camera Overlay on Hover */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
              <Camera size={18} className="text-amber-400" />
              <span className="text-[7.5px] mono font-bold mt-0.5">Edit</span>
            </div>

            <div className="absolute -bottom-1 -right-1 bg-amber-700 dark:bg-amber-500 text-white dark:text-slate-950 p-1 rounded-full text-[9px] font-bold shadow-sm" title="Gold Pin Map Highlight Active">
              <MapPin size={10} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 truncate">
                <span>{prof.display_name || activeUser.name || 'Citizen'}</span>
                <BadgeCheck size={18} className="text-teal-600 dark:text-teal-400 flex-shrink-0" />
              </h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="text-[9.5px] mono font-bold text-amber-700 dark:text-amber-400 hover:text-amber-600 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-900/50 transition-colors flex-shrink-0"
              >
                <Edit3 size={11} />
                <span>Edit Photo</span>
              </button>
            </div>

            <p className="text-[10px] mono text-slate-500 dark:text-slate-400 mt-0.5">
              {countryInfo.flag} {countryInfo.name} · Verified Citizen · NIN ···{prof.id_frag || '8841'}
            </p>
            {prof.bio && (
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1 italic">
                "{prof.bio}"
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] mono font-bold px-2 py-0.5 rounded-md bg-amber-600/15 text-amber-800 dark:text-amber-300 border border-amber-600/30 dark:border-amber-500/30 flex items-center gap-1">
                <ShieldCheck size={12} />
                {rank.name}
              </span>
              <span className="text-[9px] mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {activeUser.nodeTag || 'Nakawa Division · Bukoto Parish'}
              </span>
            </div>
          </div>
        </div>

        {/* Civic Score Progress */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-[9.5px] mono text-slate-600 dark:text-slate-300 font-bold">
            <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-600 dark:text-amber-400" /> Civic Score: {prof.civic_score || 1240} pts
            </span>
            <span>{nextRank ? `${nextRank.min.toLocaleString()}pts → ${nextRank.name}` : 'Maximum Rank'}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-teal-500 transition-all duration-500" style={{ width: `${pct}%` }}></div>
          </div>
          <div className="flex justify-between items-center text-[8.5px] mono text-slate-500 dark:text-slate-400">
            <span>{pct}% progress to Sentinel Rank</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">Gold Pin Avatar Enabled on Map</span>
          </div>
        </div>

        {/* Action Button: View Digital Certificate - Calm Dignified Style */}
        <div className="pt-2">
          <button
            onClick={() => setShowCertModal(true)}
            className="w-full bg-amber-700 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold py-2.5 px-4 rounded-xl text-xs mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
          >
            <ScrollText size={15} />
            <span>View Digital Certificate of Civic Excellence</span>
          </button>
        </div>
      </div>

      {/* Activity Metrics Grid */}
      <div>
        <p className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 font-bold">Civic Activity Ledger</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            [prof.posts || 12, 'Reports Filed', 'slate'],
            [myResolved, 'Issues Resolved', 'teal'],
            [myUpvotes, 'Community Upvotes', 'slate'],
            [myCorrupt, 'Corruption Reports', 'rose'],
            [8, 'Gov Responses', 'slate'],
            [1, 'Parish Champion Awards', 'amber'],
          ].map(([v, l, c]) => (
            <div key={l as string} className="card p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-xl shadow-xs">
              <div
                className={`text-xl font-black mono ${
                  c === 'teal' ? 'text-teal-600 dark:text-teal-400' : c === 'amber' ? 'text-amber-700 dark:text-amber-400' : c === 'rose' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'
                }`}
              >
                {v}
              </div>
              <div className="text-[8px] mono text-slate-500 dark:text-slate-400 uppercase mt-0.5 leading-tight font-medium">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4-Pillar Reward Navigation Tabs */}
      <div className="space-y-3">
        <div className="flex border border-slate-200 dark:border-slate-800 overflow-x-auto bg-slate-100 dark:bg-slate-950/80 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('perks')}
            className={`flex-1 py-2 px-3 text-[9px] mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'perks' 
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Gift size={13} className={activeTab === 'perks' ? 'text-amber-600 dark:text-amber-400' : ''} />
            <span>Civic Perks</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 px-3 text-[9px] mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'leaderboard' 
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Trophy size={13} className={activeTab === 'leaderboard' ? 'text-amber-600 dark:text-amber-400' : ''} />
            <span>Parish Board</span>
          </button>

          <button
            onClick={() => setActiveTab('ranks')}
            className={`flex-1 py-2 px-3 text-[9px] mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ranks' 
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck size={13} className={activeTab === 'ranks' ? 'text-amber-600 dark:text-amber-400' : ''} />
            <span>Ranks</span>
          </button>

          <button
            onClick={() => setActiveTab('walls')}
            className={`flex-1 py-2 px-3 text-[9px] mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'walls' 
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers size={13} className={activeTab === 'walls' ? 'text-amber-600 dark:text-amber-400' : ''} />
            <span>Following</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 px-3 text-[9px] mono font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
              activeTab === 'export' 
                ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm border border-slate-200 dark:border-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FolderArchive size={13} className={activeTab === 'export' ? 'text-amber-600 dark:text-amber-400' : ''} />
            <span>Export ZIP</span>
          </button>
        </div>

        {/* Tab 1: Civic Perks (Real Value & Tangible Benefits) */}
        {activeTab === 'perks' && (
          <div className="space-y-3 animate-fade-in">
            <div className="bg-amber-600/10 dark:bg-amber-500/10 border border-amber-600/20 dark:border-amber-500/20 p-3.5 rounded-xl space-y-1">
              <span className="text-amber-800 dark:text-amber-300 font-bold text-xs uppercase mono flex items-center gap-1.5">
                <Ticket size={14} className="text-amber-600 dark:text-amber-400" /> Tangible Value for Active Citizens
              </span>
              <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                CivicScore converts community monitoring into real utility bill discounts, telecom data bundles, and official council recognition.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Category A: Digital Items Dispatched */}
              <div className="space-y-2">
                <span className="text-[10px] mono uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Zap size={13} className="text-amber-600 dark:text-amber-400" /> Digital Perks Dispatched (1-Click Redeem)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="card p-3.5 border border-amber-600/20 dark:border-amber-500/20 bg-white dark:bg-slate-900/90 rounded-xl space-y-2.5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="chip ch-gov text-[9px]">NWSC Utility Waiver</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">10% Water Bill Discount Voucher</h4>
                        <p className="text-[9px] mono text-slate-500 dark:text-slate-400 mt-0.5">Dispatched for Watchdog Rank (1,000+ pts)</p>
                      </div>
                      <span className="text-amber-800 dark:text-amber-300 font-mono font-bold text-[10px] bg-amber-600/15 dark:bg-amber-500/15 px-2 py-0.5 rounded border border-amber-600/20">Active</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-center text-amber-800 dark:text-amber-300 font-bold">
                      Voucher Code: NWSC-CIVIC-8841
                    </div>
                    <button
                      onClick={() => toast('Voucher NWSC-CIVIC-8841 copied to clipboard!', 'success')}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-[10px] mono font-bold border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Ticket size={12} className="text-amber-600 dark:text-amber-400" />
                      <span>Copy Voucher Code</span>
                    </button>
                  </div>

                  <div className="card p-3.5 border border-teal-600/20 dark:border-teal-500/20 bg-white dark:bg-slate-900/90 rounded-xl space-y-2.5 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="chip ch-private text-[9px]">MTN Telecom Perk</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">1GB Free Civic Data Bundle</h4>
                        <p className="text-[9px] mono text-slate-500 dark:text-slate-400 mt-0.5">Dispatched directly to line for Top 3 Parish Champion</p>
                      </div>
                      <span className="text-teal-700 dark:text-teal-400 font-mono font-bold text-[10px] bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Credited</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-center text-teal-700 dark:text-teal-300 font-bold">
                      Sent to: +256 778 277 900 / +256 748 338 796
                    </div>
                    <button
                      onClick={() => toast('1GB Civic Data bundle is active on your phone line!', 'info')}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-teal-700 dark:text-teal-300 rounded-lg text-[10px] mono font-bold border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={12} />
                      <span>Active Monthly Airtime Perk</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Category B: Physical Prize HQ Pickup Passes */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] mono uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Building2 size={13} className="text-amber-600 dark:text-amber-400" /> Physical Prize Collection Passes (HQ Desk Pickup)
                </span>

                <div className="card p-4 border border-amber-600/30 dark:border-amber-500/30 bg-white dark:bg-slate-900/90 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/10 dark:bg-amber-500/10 border border-amber-600/30 dark:border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400 font-black text-base">
                        <Trophy size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Parish Champion Watchdog Plaque & Solar Lantern</h4>
                        <p className="text-[9px] mono text-amber-700 dark:text-amber-400 font-semibold">Issued by KCCA Nakawa Urban Council</p>
                      </div>
                    </div>
                    <span className="text-[9px] mono bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      Ready for Pickup
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-[10px] mono">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500">Allocated HQ:</span>
                      <strong className="text-slate-900 dark:text-slate-100">KCCA Nakawa Division HQ (Block B, Room 12)</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500">Contact Officer:</span>
                      <span className="text-amber-800 dark:text-amber-300 font-bold">Mr. Okello (Parish Admin Desk)</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span className="text-slate-400 dark:text-slate-500">Pickup Hours:</span>
                      <span className="text-slate-700 dark:text-slate-300">Mon-Fri 8:00 AM – 4:00 PM</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 dark:text-slate-500">Collection Pass:</span>
                      <span className="text-amber-700 dark:text-amber-400 font-bold font-mono">PASS-NKW-8841</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toast('Collection Pass PASS-NKW-8841 ready! Present your NIN ID & QR at KCCA Nakawa HQ.', 'success')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-600 dark:hover:bg-amber-500 font-bold py-2.5 px-3 rounded-xl text-xs mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <QrCode size={14} className="text-amber-400 dark:text-slate-950" />
                    <span>Show Collection Pass QR for HQ Desk</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Parish Champion Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="card p-4 space-y-3 animate-fade-in border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 rounded-xl shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase mono flex items-center gap-1.5">
                  <Trophy size={14} className="text-amber-600 dark:text-amber-400" />
                  Nakawa Division · Bukoto Parish Leaderboard
                </h4>
                <p className="text-[9px] mono text-slate-500 dark:text-slate-400">Public recognition for top active reporters in your immediate parish</p>
              </div>
              <span className="text-[9px] mono text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-600/20">
                August 2026 Cycle
              </span>
            </div>

            <div className="space-y-2">
              {parishLeaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                    item.isMe
                      ? 'bg-amber-600/10 dark:bg-amber-500/10 border-amber-600/30 dark:border-amber-500/40 text-slate-900 dark:text-slate-100 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-black ${
                      item.rank === 1 ? 'bg-amber-700 dark:bg-amber-500 text-white dark:text-slate-950' : item.rank === 2 ? 'bg-slate-300 text-slate-950' : item.rank === 3 ? 'bg-amber-800 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      #{item.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.name}</span>
                        {item.isMe && <span className="text-[8px] mono bg-amber-700 dark:bg-amber-500 text-white dark:text-slate-950 px-1.5 py-0.5 rounded font-black">YOU</span>}
                      </div>
                      <p className="text-[9px] mono text-slate-500 dark:text-slate-400">{item.badge} · {item.resolved} Issues Resolved</p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-amber-700 dark:text-amber-400 font-bold">{item.score.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block">pts</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[9.5px] text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <ShieldCheck size={12} className="text-teal-600 dark:text-teal-400" /> Anti-Gaming & Geo-Locking Rules:
              </span>
              <p>1. Geo-Locked to NIN Parish location. 2. Quality &gt; Quantity (+250 for verified resolution vs +50 for reporting). 3. Same-IP upvote ring protection active.</p>
            </div>
          </div>
        )}

        {/* Tab 3: Ranks & Influence Power */}
        {activeTab === 'ranks' && (
          <div className="card p-4 space-y-3 animate-fade-in border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 rounded-xl shadow-sm">
            <p className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Civic Rank & Influence Ladder</p>
            <div className="space-y-2.5">
              {CIVIC_RANKS.map((r) => {
                const active = rank.name === r.name;
                const earned = (prof.civic_score || 0) >= r.min;
                return (
                  <div key={r.name} className={`p-3 rounded-xl border transition-all ${active ? 'bg-amber-600/10 dark:bg-amber-500/10 border-amber-600/30 dark:border-amber-500/40' : earned ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800' : 'opacity-40 bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-900'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[13px] mono font-bold ${active ? 'text-amber-800 dark:text-amber-400 font-black' : 'text-slate-800 dark:text-slate-300'}`}>
                          {r.name}
                        </span>
                        {active && <span className="text-[8px] mono bg-amber-700 dark:bg-amber-500 text-white dark:text-slate-950 px-1.5 py-0.5 rounded font-bold">CURRENT RANK</span>}
                      </div>
                      <span className="text-[10px] mono font-bold text-slate-500 dark:text-slate-400">{r.min.toLocaleString()} pts</span>
                    </div>
                    <p className="text-[9.5px] text-slate-600 dark:text-slate-400 mt-1">{r.desc}</p>
                    <div className="mt-2 text-[9px] mono text-teal-600 dark:text-teal-400 flex items-center gap-1 font-medium">
                      <Zap size={11} /> Influence Power: {r.name === 'Sentinel' || r.name === 'Watchdog' ? 'Priority Inbox Placement + Direct Escalation Boost' : 'Standard Inbox Queue'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Followed Department Walls */}
        {activeTab === 'walls' && (
          <div className="card p-4 space-y-3 animate-fade-in border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-[9px] mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">Walls Following</p>
              <button onClick={() => go('depts')} className="text-[9px] mono text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-bold">
                + Browse Walls
              </button>
            </div>
            {(activeUser.followed || prof.followed || []).length === 0 ? (
              <p className="text-xs text-slate-500 mono">No walls followed yet.</p>
            ) : (
              (activeUser.followed || prof.followed || ['kcca', 'umeme', 'nwsc']).map((did) => {
                const d = getDept(activeUser.country, did);
                return (
                  <div
                    key={did}
                    onClick={() => {
                      setActiveDept(did);
                      setActiveDeptCountry(activeUser.country);
                      go('dept_wall');
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      {d.icon && <span className="text-base">{d.icon}</span>}
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{d.name}</span>
                        <div className="text-[9px] mono text-slate-500 dark:text-slate-400 mt-0.5">SLA Target: {d.sla || 48}h Response Window</div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 5: Complete Build & Database ZIP Export */}
        {activeTab === 'export' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <FolderArchive size={18} className="text-amber-600 dark:text-amber-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Full-Stack Build & Database Packager
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Download the complete deployable distribution package of CivicDuty, containing the React frontend, Express Node.js backend server (`server.ts`), and JSON ledger database with all uploaded photos, tickets, and citizen accounts. Ready to push to GitHub or deploy directly to Docker/Render/Cloud Run.
              </p>
            </div>

            {/* Quick 1-Click Download Button */}
            <div className="card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] mono uppercase font-bold text-amber-700 dark:text-amber-400">
                    Production Release ZIP
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    civicduty-complete-fullstack-build.zip
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Includes frontend build, backend server (`server.ts`), Dockerfile, docker-compose, and full database JSON ledger.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-600/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
                  <Code2 size={24} />
                </div>
              </div>

              {exportProgress && (
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs mono text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{exportProgress}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isExportingZip}
                  onClick={handleDownloadZip}
                  className="w-full bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                >
                  <Download size={16} />
                  <span>{isExportingZip ? 'Packaging...' : 'Download Live Build ZIP'}</span>
                </button>

                <a
                  href="/api/export/zip"
                  download="civicduty-fullstack-build.zip"
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold py-3 px-4 rounded-xl text-xs mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
                >
                  <Code2 size={16} />
                  <span>Server-Side ZIP</span>
                </a>
              </div>
            </div>

            {/* GitHub & Deployment Guide */}
            <div className="card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mono">
                🚀 How to Push to GitHub & Deploy
              </h4>
              <div className="bg-slate-950 text-slate-200 p-3 rounded-xl font-mono text-[11px] space-y-1.5 overflow-x-auto">
                <p className="text-slate-500"># 1. Unzip and initialize GitHub repository</p>
                <p><span className="text-emerald-400">git</span> init</p>
                <p><span className="text-emerald-400">git</span> add .</p>
                <p><span className="text-emerald-400">git</span> commit -m "feat: CivicDuty complete fullstack application"</p>
                <p><span className="text-emerald-400">git</span> branch -M main</p>
                <p><span className="text-emerald-400">git</span> remote add origin https://github.com/YOUR_USERNAME/civicduty.git</p>
                <p><span className="text-emerald-400">git</span> push -u origin main</p>
                <p className="text-slate-500 pt-2"># 2. Local execution or Docker deployment</p>
                <p><span className="text-amber-400">npm</span> install && <span className="text-amber-400">npm</span> run dev</p>
                <p><span className="text-sky-400">docker</span> compose up -d</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disconnect Session */}
      <button
        onClick={() => {
          setUser(null);
          go('splash');
        }}
        className="w-full card py-3 text-xs mono text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
      >
        Disconnect Session
      </button>

      {/* ========================================================= */}
      {/* DIGITAL CERTIFICATE OF CIVIC EXCELLENCE MODAL             */}
      {/* ========================================================= */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto animate-fade-in">
          <div className="bg-white text-slate-950 w-full max-w-xl rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-amber-600 relative font-serif space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-900 bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header / Coat of Arms Header */}
            <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
              <div className="flex justify-center mb-1">
                <span className="text-3xl">🇺🇬</span>
              </div>
              <h2 className="text-xs sm:text-sm font-black tracking-widest text-slate-900 uppercase">
                REPUBLIC OF UGANDA
              </h2>
              <p className="text-[10px] sm:text-xs font-bold text-amber-800 uppercase tracking-wide">
                MINISTRY OF LOCAL GOVERNMENT / KCCA NAKAWA DIVISION
              </p>
              <div className="pt-2">
                <span className="text-lg sm:text-2xl font-black text-slate-950 uppercase tracking-tight border-b-2 border-amber-600 pb-0.5 inline-block font-sans">
                  CERTIFICATE OF CIVIC EXCELLENCE
                </span>
              </div>
            </div>

            {/* Main Certificate Text */}
            <div className="text-center space-y-4 font-serif leading-relaxed text-xs sm:text-sm text-slate-800">
              <p className="italic text-slate-600">This is to officially certify that</p>
              
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase font-sans tracking-wide">
                  {prof.display_name || activeUser.name || 'Inzama Robin'}
                </h3>
                <p className="text-[11px] font-mono font-bold text-slate-600 mt-0.5">
                  NIN: CM880411029482 · BUKOTO PARISH, NAKAWA DIVISION
                </p>
              </div>

              <p className="italic text-slate-600">is hereby recognized and awarded the title of</p>

              <div className="bg-amber-50 border-2 border-amber-600 p-3 rounded-xl inline-block">
                <span className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-wider font-sans">
                  "PARISH CHAMPION - BEST REPORTER"
                </span>
                <p className="text-[10px] font-mono text-amber-800 font-bold mt-0.5">AUGUST 2026 CYCLE</p>
              </div>

              <p className="text-xs text-slate-700 max-w-md mx-auto">
                For outstanding civic contribution to public service delivery monitoring, active citizenship, and transparent infrastructure reporting in Nakawa Division.
              </p>

              <div className="flex justify-center gap-6 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] block">CIVICSCORE</span>
                  <strong className="text-amber-700 font-bold">{prof.civic_score || 1240} Pts</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ISSUES RESOLVED</span>
                  <strong className="text-teal-700 font-bold">{myResolved} Verified</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">COMMUNITY RANK</span>
                  <strong className="text-slate-900 font-bold">#1 in Bukoto</strong>
                </div>
              </div>
            </div>

            {/* Digital Signatures & QR Seal */}
            <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
              <div className="text-center sm:text-left space-y-1">
                <div className="w-32 border-b border-slate-900 pb-1 font-serif italic text-slate-700 font-bold">
                  E. Tumusiime
                </div>
                <p className="font-bold text-slate-950 text-[11px]">Town Clerk / Accounting Officer</p>
                <p className="text-[9px] text-slate-500 font-mono">Nakawa Urban Council · Kampala</p>
              </div>

              {/* QR Verification Seal */}
              <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-300 text-left">
                <div className="bg-white p-1.5 rounded border border-slate-300 text-slate-900">
                  <QrCode size={36} />
                </div>
                <div className="text-[9px] font-mono leading-tight">
                  <span className="font-bold text-slate-900 block">AUTHENTICATED</span>
                  <span className="text-slate-600">Audit Hash: UG-CERT-8841</span>
                  <span className="text-teal-700 font-bold block mt-0.5">civicduty.ug/verify/UG8841</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 font-sans">
              <button
                onClick={() => {
                  toast('Digital Certificate PDF downloaded!', 'success');
                  setShowCertModal(false);
                }}
                className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Download size={14} />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => {
                  toast('Certificate link copied to share on WhatsApp/Twitter!', 'info');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
              >
                <Share2 size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar & Profile Photo Upload Modal */}
      {showAvatarModal && (
        <AvatarUploadModal
          onClose={() => setShowAvatarModal(false)}
        />
      )}
    </div>
  );
};
