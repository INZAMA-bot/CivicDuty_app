import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  MessageSquare,
  Send,
  Share2,
  Repeat2,
  Bookmark,
  ShieldCheck,
  UserPlus,
  UserCheck,
  Radio,
  Mic,
  MicOff,
  Hand,
  Users,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  VolumeX,
  Ban,
  Flag,
  FileCheck2,
  Clock,
  Award,
  Image as ImageIcon,
  Video,
  VideoOff,
  FileText,
  MapPin,
  Camera,
  Monitor,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COUNTRIES, getDept } from '../data/countries';
import { Post, TownHallSession } from '../types';

export const GlobalSocialModals: React.FC = () => {
  const {
    user,
    ensureCitizenSession,
    posts,
    setActivePost,
    go,
    toast,
    // Notification Center
    notifications,
    notifModalOpen,
    setNotifModalOpen,
    markNotificationRead,
    markAllNotificationsRead,
    // Direct Messages
    dmModalOpen,
    setDmModalOpen,
    dmThreads,
    activeDmThreadId,
    setActiveDmThreadId,
    sendDirectMessage,
    // Public Citizen Profile
    publicProfileCitizen,
    setPublicProfileCitizen,
    followingCitizens,
    toggleFollowCitizen,
    openDmWithCitizen,
    // Social Action Modal (Quote / Share / Community Note / Safety)
    socialModalPost,
    setSocialModalPost,
    socialModalTab,
    setSocialModalTab,
    createQuoteDispatch,
    addCommunityNote,
    bookmarks,
    toggleBookmark,
    mutedAuthors,
    toggleMuteAuthor,
    blockedAuthors,
    toggleBlockAuthor,
    // Live Town Hall Room
    activeTownHall,
    setActiveTownHall,
    townHalls,
    hostBarazaModalOpen,
    setHostBarazaModalOpen,
    createTownHall,
  } = useApp();

  const activeUser = user || ensureCitizenSession();
  const [notifFilter, setNotifFilter] = useState<'all' | 'sla_update' | 'reply' | 'upvote'>('all');
  const [dmInput, setDmInput] = useState('');
  const [dmMedia, setDmMedia] = useState<Array<{ name: string; type: string; size: string; dataUrl?: string }>>([]);
  const [dmVoiceNote, setDmVoiceNote] = useState(false);
  const [dmRecordingVoice, setDmRecordingVoice] = useState(false);
  const [dmGps, setDmGps] = useState<{ lat: number; lng: number; label?: string } | null>(null);

  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteBody, setQuoteBody] = useState('');
  const [quoteMedia, setQuoteMedia] = useState<Array<{ name: string; type: string; size: string; dataUrl?: string }>>([]);
  const [quoteVoiceNote, setQuoteVoiceNote] = useState(false);
  const [quoteGps, setQuoteGps] = useState<{ lat: number; lng: number } | null>(null);

  const [noteBody, setNoteBody] = useState('');
  const [noteSource, setNoteSource] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Town Hall state
  const [handRaised, setHandRaised] = useState(false);
  const [micMuted, setMicMuted] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [barazaViewMode, setBarazaViewMode] = useState<'video' | 'audio'>('video');
  const [barazaQuestion, setBarazaQuestion] = useState('');
  const [barazaMediaTag, setBarazaMediaTag] = useState<string | null>(null);
  const [newBarazaTitle, setNewBarazaTitle] = useState('');
  const [newBarazaTag, setNewBarazaTag] = useState('#ServiceAccountability');
  const [newBarazaDept, setNewBarazaDept] = useState('Municipal Works & Water Desk');
  const [newBarazaCoHost, setNewBarazaCoHost] = useState('Chief Municipal Engineer');
  const [newBarazaMode, setNewBarazaMode] = useState<'video_stage' | 'field_cam' | 'audio_low_data'>('video_stage');
  const [barazaChat, setBarazaChat] = useState<Array<{ id: string; sender: string; text: string; time: string; mediaBadge?: string }>>([
    { id: 'bc-1', sender: 'Grace Akello (@grace_watchdog)', text: 'Thank you Permanent Secretary for joining this live video baraza on drainage SLAs.', time: '2m ago' },
    { id: 'bc-2', sender: 'David Mukasa (Boda Scout)', text: 'Can the municipal engineer confirm when culvert works begin on Ward 2?', time: '1m ago', mediaBadge: 'Photo Evidence + GPS Attached' },
  ]);

  const handleDmFileSelect = (e: React.ChangeEvent<HTMLInputElement>, mediaCategory: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((f: File) => {
      const sizeStr = (f.size / (1024 * 1024)).toFixed(1) + ' MB';
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setDmMedia((prev) => [
            ...prev,
            { name: f.name, type: 'image', size: sizeStr, dataUrl: ev.target?.result as string },
          ]);
        };
        reader.readAsDataURL(f);
      } else {
        setDmMedia((prev) => [...prev, { name: f.name, type: mediaCategory, size: sizeStr }]);
      }
    });
    toast(`Attached ${files.length} ${mediaCategory} file(s) to direct message`, 'emerald');
  };

  const handleQuoteFileSelect = (e: React.ChangeEvent<HTMLInputElement>, mediaCategory: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((f: File) => {
      const sizeStr = (f.size / (1024 * 1024)).toFixed(1) + ' MB';
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setQuoteMedia((prev) => [
            ...prev,
            { name: f.name, type: 'image', size: sizeStr, dataUrl: ev.target?.result as string },
          ]);
        };
        reader.readAsDataURL(f);
      } else {
        setQuoteMedia((prev) => [...prev, { name: f.name, type: mediaCategory, size: sizeStr }]);
      }
    });
    toast(`Attached ${files.length} ${mediaCategory} file(s) to Quote-Dispatch`, 'emerald');
  };

  // 1. NOTIFICATION CENTER MODAL
  const renderNotificationModal = () => {
    if (!notifModalOpen) return null;
    const filtered = notifications.filter((n) => (notifFilter === 'all' ? true : n.type === notifFilter));
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[86vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black flex items-center gap-2">
                  <span>Sovereign Notification Center</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-600 text-white">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Real-time SLA updates, co-signs, mentions, replies &amp; perk alerts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck size={12} />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setNotifModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Activity' },
              { id: 'sla_update', label: 'Official SLA' },
              { id: 'reply', label: 'Replies & Mentions' },
              { id: 'upvote', label: 'Co-Signs & Quotes' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setNotifFilter(tab.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                  notifFilter === tab.id
                    ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-3 overflow-y-auto flex-1 space-y-2">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                No notifications in this category yet.
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.post_id) {
                      const found = posts.find((p) => p.id === n.post_id);
                      if (found) {
                        setActivePost(found);
                        setNotifModalOpen(false);
                        go('post_detail');
                      }
                    }
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    !n.read
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/25 border-emerald-300 dark:border-emerald-800/80'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                      <span className="font-bold text-slate-800 dark:text-slate-200">{n.actor_name}</span>
                      <span>·</span>
                      <span>{n.created_at}</span>
                    </div>
                    <div className="text-xs font-black text-slate-900 dark:text-white">{n.title}</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{n.body}</p>
                  </div>
                  {n.post_id && (
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                      View →
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // 2. DIRECT MESSAGING & NEIGHBORHOOD WATCH INBOX MODAL
  const renderDmModal = () => {
    if (!dmModalOpen) return null;
    const currentThread = dmThreads.find((t) => t.thread_id === activeDmThreadId) || dmThreads[0];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full h-[82vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black">
                  Citizen Direct Messages &amp; Neighborhood Watch Inbox
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Private 1-on-1 coordination with fellow watchdogs &amp; verified customer care desks
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDmModalOpen(false)}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row min-h-0">
            {/* Thread List */}
            <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-2.5 space-y-1.5 shrink-0 max-h-40 sm:max-h-none">
              {dmThreads.map((th) => {
                const isSelected = currentThread?.thread_id === th.thread_id;
                const lastMsg = th.messages[th.messages.length - 1];
                return (
                  <button
                    key={th.thread_id}
                    type="button"
                    onClick={() => setActiveDmThreadId(th.thread_id)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black truncate flex items-center gap-1">
                        <span>{th.participant_name}</span>
                        {th.participant_verified && <ShieldCheck size={12} className="text-emerald-500 shrink-0" />}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">{th.participant_handle}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lastMsg ? lastMsg.body : th.participant_role}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Conversation */}
            {currentThread && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div>
                    <div className="text-xs font-black flex items-center gap-1.5">
                      <span>{currentThread.participant_name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{currentThread.participant_handle}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                      {currentThread.participant_role} · End-to-End Protected Civic Channel
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
                  {currentThread.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[84%] ${
                        m.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div
                        className={`px-3.5 py-2.5 rounded-xl text-xs leading-relaxed space-y-2 ${
                          m.sender === 'me'
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 rounded-bl-xs border border-[#e3e6ea] dark:border-[#262b36]'
                        }`}
                      >
                        <div>{m.body}</div>

                        {/* Render Multimedia Attachments in DM Bubble */}
                        {m.media && m.media.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            {m.media.map((att, idx) => (
                              <div
                                key={idx}
                                className="p-2 rounded-lg bg-black/15 border border-white/15 flex items-center gap-2 text-[10.5px] font-mono"
                              >
                                {att.dataUrl ? (
                                  <img
                                    src={att.dataUrl}
                                    alt={att.name}
                                    className="w-10 h-10 rounded object-cover shrink-0"
                                  />
                                ) : att.type === 'video' ? (
                                  <Video size={13} className="shrink-0" />
                                ) : (
                                  <FileText size={13} className="shrink-0" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="font-semibold truncate">{att.name}</div>
                                  <div className="text-[9px] opacity-80 uppercase">{att.type} · {att.size}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {m.voice_note && (
                          <div className="px-2.5 py-1.5 rounded-lg bg-black/15 border border-white/15 flex items-center gap-2 text-[10px] font-mono">
                            <Mic size={12} />
                            <span>Voice Note Recording (0:18) · Audio Verified</span>
                          </div>
                        )}

                        {m.gps && (
                          <div className="px-2.5 py-1.5 rounded-lg bg-black/15 border border-white/15 flex items-center gap-1.5 text-[10px] font-mono">
                            <MapPin size={12} />
                            <span>GPS Pin: {m.gps.lat.toFixed(4)}, {m.gps.lng.toFixed(4)}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                        {m.sender_name} · {m.created_at}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Staged DM Multimedia Strip */}
                {(dmMedia.length > 0 || dmVoiceNote || dmGps) && (
                  <div className="px-3 py-2 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] flex flex-wrap items-center gap-1.5">
                    {dmMedia.map((att, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono flex items-center gap-1.5"
                      >
                        <span>{att.name}</span>
                        <button
                          type="button"
                          onClick={() => setDmMedia((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                    {dmVoiceNote && (
                      <span className="px-2 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[10px] font-mono flex items-center gap-1.5">
                        <Mic size={11} />
                        <span>Voice Note (0:18)</span>
                        <button type="button" onClick={() => setDmVoiceNote(false)} className="cursor-pointer">
                          <X size={11} />
                        </button>
                      </span>
                    )}
                    {dmGps && (
                      <span className="px-2 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono flex items-center gap-1.5">
                        <MapPin size={11} />
                        <span>GPS ({dmGps.lat.toFixed(3)}, {dmGps.lng.toFixed(3)})</span>
                        <button type="button" onClick={() => setDmGps(null)} className="cursor-pointer">
                          <X size={11} />
                        </button>
                      </span>
                    )}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!dmInput.trim() && dmMedia.length === 0 && !dmVoiceNote && !dmGps) return;
                    sendDirectMessage(currentThread.thread_id, dmInput.trim(), {
                      media: dmMedia.length > 0 ? dmMedia : undefined,
                      voice_note: dmVoiceNote || undefined,
                      gps: dmGps || undefined,
                    });
                    setDmInput('');
                    setDmMedia([]);
                    setDmVoiceNote(false);
                    setDmGps(null);
                  }}
                  className="p-3 border-t border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] space-y-2"
                >
                  {/* 5-Channel Multimedia Bar in Direct Messages */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <label className="cursor-pointer px-2 py-1 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleDmFileSelect(e, 'image')}
                      />
                      <ImageIcon size={11} className="text-emerald-600 dark:text-emerald-400" />
                      <span>Photo</span>
                    </label>

                    <label className="cursor-pointer px-2 py-1 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleDmFileSelect(e, 'video')}
                      />
                      <Video size={11} className="text-rose-600 dark:text-rose-400" />
                      <span>Video</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setDmRecordingVoice(true);
                        setTimeout(() => {
                          setDmRecordingVoice(false);
                          setDmVoiceNote(true);
                          toast('Voice note recorded for Direct Message', 'emerald');
                        }, 1000);
                      }}
                      className={`px-2 py-1 rounded-md border text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                        dmRecordingVoice || dmVoiceNote
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                          : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                      }`}
                    >
                      <Mic size={11} className="text-amber-600 dark:text-amber-400" />
                      <span>{dmRecordingVoice ? 'Rec...' : 'Voice'}</span>
                    </button>

                    <label className="cursor-pointer px-2 py-1 rounded-md bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => handleDmFileSelect(e, 'doc')}
                      />
                      <FileText size={11} className="text-indigo-600 dark:text-indigo-400" />
                      <span>Doc/PDF</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setDmGps({ lat: 0.3476, lng: 32.5825, label: 'Verified Parish GPS' });
                        toast('Attached live GPS pin to Direct Message', 'emerald');
                      }}
                      className={`px-2 py-1 rounded-md border text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                        dmGps
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-[#161a22] border-[#e3e6ea] dark:border-[#262b36] text-slate-700 dark:text-slate-200 hover:border-emerald-500'
                      }`}
                    >
                      <MapPin size={11} className="text-emerald-600 dark:text-emerald-400" />
                      <span>GPS Pin</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={dmInput}
                      onChange={(e) => setDmInput(e.target.value)}
                      placeholder={`Message ${currentThread.participant_name} or send multimedia evidence...`}
                      className="flex-1 bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} />
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 3. PUBLIC CITIZEN WATCHDOG PROFILE MODAL
  const renderPublicProfileModal = () => {
    if (!publicProfileCitizen) return null;
    const cName = publicProfileCitizen.name;
    const handle = `@${cName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const cCountry = publicProfileCitizen.country || activeUser.country || 'UG';
    const cInfo = COUNTRIES[cCountry] || COUNTRIES.UG;
    const isFollowing = followingCitizens.includes(cName);
    const isMuted = mutedAuthors.includes(cName);
    const isBlocked = blockedAuthors.includes(cName);
    const citizenPosts = posts.filter(
      (p) => !p.anonymous && p.citizen_name.toLowerCase() === cName.toLowerCase()
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
          <div className="p-5 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] text-slate-900 dark:text-white relative">
            <button
              type="button"
              onClick={() => setPublicProfileCitizen(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#f1f3f4] dark:bg-[#1e232d] hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <X size={16} strokeWidth={1.75} />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-xl font-bold text-emerald-700 dark:text-emerald-300">
                {cName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold">{cName}</h3>
                  <ShieldCheck size={16} strokeWidth={1.75} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400">{handle} · {cCountry} · {cInfo.name}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  {publicProfileCitizen.profession || 'Verified Community Watchdog & Civic Reporter'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 mt-4 pt-3 border-t border-white/10 text-xs font-mono">
              <div>
                <strong className="text-white">{publicProfileCitizen.score || 840}</strong>{' '}
                <span className="text-slate-400">CivicScore XP</span>
              </div>
              <div>
                <strong className="text-white">{142 + (isFollowing ? 1 : 0)}</strong>{' '}
                <span className="text-slate-400">Followers</span>
              </div>
              <div>
                <strong className="text-white">{citizenPosts.length || 1}</strong>{' '}
                <span className="text-slate-400">Dispatches</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              <button
                type="button"
                onClick={() => toggleFollowCitizen(cName)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isFollowing
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-white text-slate-950 hover:bg-emerald-400'
                }`}
              >
                {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                <span>{isFollowing ? 'Following Watchdog' : 'Follow Watchdog'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPublicProfileCitizen(null);
                  openDmWithCitizen(cName, publicProfileCitizen.profession || 'Community Watchdog', cCountry);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={13} />
                <span>Direct Message</span>
              </button>

              <button
                type="button"
                onClick={() => toggleMuteAuthor(cName)}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                title="Mute this user's dispatches"
              >
                <VolumeX size={12} />
                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleBlockAuthor(cName)}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                title="Block this user"
              >
                <Ban size={12} />
                <span>{isBlocked ? 'Unblock' : 'Block'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
            <div className="text-[10px] font-mono font-bold uppercase text-slate-500">
              Public Dispatches by {cName} ({citizenPosts.length})
            </div>
            {citizenPosts.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 text-center">
                No public non-anonymous dispatches found in current feed cache.
              </div>
            ) : (
              citizenPosts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setPublicProfileCitizen(null);
                    setActivePost(p);
                    go('post_detail');
                  }}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer space-y-1"
                >
                  <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    #{p.id.slice(-6).toUpperCase()} · {getDept(p.country, p.dept).name}
                  </div>
                  <div className="text-xs font-black">{p.title}</div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{p.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // 4. QUOTE-DISPATCH, SOCIAL SHARE, COMMUNITY NOTE & SAFETY MODAL
  const renderSocialActionModal = () => {
    if (!socialModalPost) return null;
    const p = socialModalPost;
    const dept = getDept(p.country, p.dept);
    const shareUrl = `${window.location.origin}/?ticket=${encodeURIComponent(p.id)}`;
    const shareText = `[CivicDuty ${p.country}] ${p.title} — Monitored Desk: ${dept.name} (#${p.id.slice(-6).toUpperCase()})`;
    const isBookmarked = bookmarks.includes(p.id);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
            <h3 className="text-sm font-black flex items-center gap-2">
              <Share2 size={16} className="text-emerald-600" />
              <span>Amplify, Quote, Fact-Check &amp; Share Dispatch</span>
            </h3>
            <button
              type="button"
              onClick={() => setSocialModalPost(null)}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'share', label: 'Share & Bookmark', icon: Share2 },
              { id: 'quote', label: 'Quote-Dispatch', icon: Repeat2 },
              { id: 'community_note', label: 'Community Note', icon: FileCheck2 },
              { id: 'safety', label: 'Mute / Report', icon: Flag },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSocialModalTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    socialModalTab === t.id
                      ? 'bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon size={12} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 overflow-y-auto space-y-4">
            {/* Referenced Post Snippet */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                {dept.name} · #{p.id.slice(-6).toUpperCase()} · {p.citizen_name}
              </div>
              <div className="text-xs font-black">{p.title}</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">{p.body}</p>
            </div>

            {socialModalTab === 'share' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(p.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isBookmarked
                        ? 'bg-amber-500/15 border-amber-500 text-amber-800 dark:text-amber-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Bookmark size={15} />
                    <span>{isBookmarked ? 'Saved in Bookmarks' : 'Bookmark Dossier'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(`${shareText}\n${shareUrl}`);
                      setCopiedLink(true);
                      toast('Dispatch link & citation copied to clipboard!', 'emerald');
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedLink ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Permalink'}</span>
                  </button>
                </div>

                <div className="text-[10px] font-mono uppercase font-bold text-slate-500 pt-1">
                  Cross-Platform Global Syndication
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    {
                      label: 'WhatsApp',
                      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
                    },
                    {
                      label: 'X / Twitter',
                      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
                    },
                    {
                      label: 'Telegram',
                      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
                    },
                  ].map((net) => (
                    <a
                      key={net.label}
                      href={net.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>{net.label}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {socialModalTab === 'quote' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!quoteBody.trim() && quoteMedia.length === 0) {
                    toast('Please add your commentary or multimedia for the Quote-Dispatch', 'amber');
                    return;
                  }
                  createQuoteDispatch(
                    p,
                    quoteTitle.trim() || `Re: ${p.title}`,
                    quoteBody.trim() || 'Attached multimedia field evidence.',
                    {
                      media: quoteMedia.length > 0 ? quoteMedia : undefined,
                      voice_note: quoteVoiceNote || undefined,
                      gps: quoteGps || undefined,
                    }
                  );
                  setQuoteTitle('');
                  setQuoteBody('');
                  setQuoteMedia([]);
                  setQuoteVoiceNote(false);
                  setQuoteGps(null);
                  setSocialModalPost(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Quote Headline (Optional)
                  </label>
                  <input
                    type="text"
                    value={quoteTitle}
                    onChange={(e) => setQuoteTitle(e.target.value)}
                    placeholder={`Re: ${p.title}`}
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Your Watchdog Commentary &amp; Multimedia Evidence *
                  </label>
                  <textarea
                    rows={3}
                    value={quoteBody}
                    onChange={(e) => setQuoteBody(e.target.value)}
                    placeholder="Add local context, corroborate with field photos/video/audio, or tag @Ministry #CivicAccountability..."
                    className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg p-3 text-xs"
                  />
                </div>

                {/* 5-Channel Multimedia Toolbar for Quote-Dispatch */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[10px] font-mono font-semibold flex items-center gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleQuoteFileSelect(e, 'image')}
                    />
                    <ImageIcon size={11} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Photo</span>
                  </label>

                  <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[10px] font-mono font-semibold flex items-center gap-1">
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleQuoteFileSelect(e, 'video')}
                    />
                    <Video size={11} className="text-rose-600 dark:text-rose-400" />
                    <span>Video</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setQuoteVoiceNote(!quoteVoiceNote);
                      toast(!quoteVoiceNote ? 'Voice note attached to Quote-Dispatch' : 'Voice note removed', 'emerald');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                      quoteVoiceNote
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
                        : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36]'
                    }`}
                  >
                    <Mic size={11} className="text-amber-600 dark:text-amber-400" />
                    <span>Voice Note</span>
                  </button>

                  <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-[10px] font-mono font-semibold flex items-center gap-1">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf"
                      multiple
                      className="hidden"
                      onChange={(e) => handleQuoteFileSelect(e, 'doc')}
                    />
                    <FileText size={11} className="text-indigo-600 dark:text-indigo-400" />
                    <span>Doc/PDF</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setQuoteGps(quoteGps ? null : { lat: 0.3476, lng: 32.5825 });
                      toast(!quoteGps ? 'GPS coordinates pinned to Quote-Dispatch' : 'GPS pin removed', 'emerald');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                      quoteGps
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36]'
                    }`}
                  >
                    <MapPin size={11} className="text-emerald-600 dark:text-emerald-400" />
                    <span>GPS Pin</span>
                  </button>
                </div>

                {quoteMedia.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {quoteMedia.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[10px] font-mono flex items-center gap-1"
                      >
                        <span>{m.name}</span>
                        <button
                          type="button"
                          onClick={() => setQuoteMedia((prev) => prev.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer"
                >
                  Publish Multimedia Quote-Dispatch to Live Feed
                </button>
              </form>
            )}

            {socialModalTab === 'community_note' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!noteBody.trim()) return;
                  addCommunityNote(p.id, noteBody.trim(), noteSource.trim());
                  setNoteBody('');
                  setNoteSource('');
                  setSocialModalPost(null);
                }}
                className="space-y-3"
              >
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
                  <strong>Citizen Community Notes:</strong> Add neutral, fact-checked context, budget references, or official procurement links to help readers understand this dispatch.
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Fact-Check / Context Note *
                  </label>
                  <textarea
                    rows={3}
                    value={noteBody}
                    onChange={(e) => setNoteBody(e.target.value)}
                    placeholder="e.g. This road contract was awarded under FY2025/26 Quarter 2 Municipal Road Fund..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
                    Verification Source / Reference (Optional)
                  </label>
                  <input
                    type="text"
                    value={noteSource}
                    onChange={(e) => setNoteSource(e.target.value)}
                    placeholder="e.g. Auditor General Report / Municipal Tender Portal"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider font-mono cursor-pointer"
                >
                  Attach Verified Community Note (+15 XP)
                </button>
              </form>
            )}

            {socialModalTab === 'safety' && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    toggleMuteAuthor(p.citizen_name);
                    setSocialModalPost(null);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-xs font-bold flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <VolumeX size={15} className="text-slate-500" />
                    <span>Mute dispatches from {p.citizen_name}</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Hide from feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleBlockAuthor(p.citizen_name);
                    setSocialModalPost(null);
                  }}
                  className="w-full p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Ban size={15} />
                    <span>Block {p.citizen_name}</span>
                  </span>
                  <span className="text-[10px] font-mono">Block author</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toast('Report logged with CivicDuty Trust & Safety Moderation Desk.', 'emerald');
                    setSocialModalPost(null);
                  }}
                  className="w-full p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-left text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={15} />
                    <span>Flag Dispatch for Misinformation / Abuse</span>
                  </span>
                  <span className="text-[10px] font-mono">Moderation Queue</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 5. LIVE DIGITAL BARAZA / TOWN HALL VIDEO + AUDIO BROADCAST MODAL — Google AI Studio Aesthetic
  const renderTownHallModal = () => {
    if (!activeTownHall) return null;
    const th: TownHallSession = activeTownHall;
    const cInfo = COUNTRIES[th.country] || COUNTRIES.UG;
    const isVideoStage = (th.has_video ?? true) && barazaViewMode === 'video';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
          {/* Studio Top Header Bar */}
          <div className="px-4 py-3 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9.5px] font-mono font-bold uppercase flex items-center gap-1 shrink-0">
                {th.has_video ? <Video size={10} strokeWidth={2} /> : <Radio size={10} strokeWidth={2} />}
                <span>{th.has_video ? 'LIVE VIDEO BARAZA' : 'LIVE AUDIO BARAZA'}</span>
              </span>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                {th.country} · {cInfo.name} · <strong className="text-emerald-700 dark:text-emerald-400">{th.topic_tag}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Switch between HD Video Stage and Low-Data Audio Mode */}
              <button
                type="button"
                onClick={() => setBarazaViewMode(barazaViewMode === 'video' ? 'audio' : 'video')}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-semibold flex items-center gap-1 cursor-pointer"
                title="Switch between Live Video Feed and Low-Data Audio Mode"
              >
                {barazaViewMode === 'video' ? <Radio size={11} /> : <Video size={11} />}
                <span>{barazaViewMode === 'video' ? 'Low-Data Audio' : 'HD Video Stage'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTownHall(null);
                  setHostBarazaModalOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] hover:border-emerald-500 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
              >
                + Host New
              </button>
              <button
                type="button"
                onClick={() => setActiveTownHall(null)}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white border border-rose-500/20 text-[10px] font-mono font-semibold transition-colors cursor-pointer"
              >
                Leave
              </button>
            </div>
          </div>

          {/* Room Switcher (Switch seamlessly between multiple live Barazas) */}
          {townHalls && townHalls.length > 1 && (
            <div className="px-4 py-2 border-b border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[9.5px] font-mono uppercase text-slate-400 shrink-0">
                Live Rooms ({townHalls.length}):
              </span>
              {townHalls.map((room, rIdx) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setActiveTownHall(room)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold shrink-0 border cursor-pointer transition-colors flex items-center gap-1 ${
                    room.id === th.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  {room.has_video ? <Video size={10} /> : <Radio size={10} />}
                  <span>#{rIdx + 1} {room.topic_tag} ({room.listeners_count})</span>
                </button>
              ))}
            </div>
          )}

          {/* Stage Metadata & Live Video / Audio Speakers Grid */}
          <div className="p-4 border-b border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] space-y-3 shrink-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {th.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>
                    Host: <strong className="text-slate-800 dark:text-slate-200">{th.host_name}</strong> ({th.dept_name})
                  </span>
                  <span>·</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                    {th.listeners_count + (handRaised ? 1 : 0)} tuned in
                  </span>
                  {th.video_stream_label && (
                    <>
                      <span>·</span>
                      <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-semibold">
                        {th.video_stream_label}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Live Video Feeds & Speaker Stage Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {th.speakers.map((sp, i) => {
                const isSpeaking = sp.speaking || (i === 2 && !micMuted);
                const showCam = isVideoStage && (sp.video_on || (i === 2 && cameraOn));
                return (
                  <div
                    key={i}
                    className={`rounded-xl border overflow-hidden transition-colors flex flex-col justify-between ${
                      isSpeaking
                        ? 'bg-[#0e1116] border-emerald-500'
                        : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36]'
                    }`}
                  >
                    {showCam ? (
                      <div className="h-28 bg-[#090d14] relative flex flex-col justify-between p-2 text-white">
                        {/* Simulated Live Camera Feed Viewport */}
                        <div className="flex items-center justify-between gap-1 z-10">
                          <span className="px-1.5 py-0.5 rounded bg-rose-600/90 text-[8px] font-mono font-bold uppercase flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            <span>{sp.camera_label || 'LIVE CAM'}</span>
                          </span>
                          <span className="text-[8.5px] font-mono text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
                            1080p HD
                          </span>
                        </div>

                        {/* Center Avatar & Live Audio Waveform Bars */}
                        <div className="flex flex-col items-center justify-center my-auto z-10">
                          <div className="w-10 h-10 rounded-full bg-emerald-600/25 border border-emerald-400 flex items-center justify-center font-mono font-bold text-xs text-emerald-300">
                            {sp.name.slice(0, 2).toUpperCase()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-300 z-10 bg-black/60 px-2 py-1 rounded">
                          <span className="truncate font-semibold">{sp.name}</span>
                          <span className="text-emerald-400 flex items-center gap-0.5 shrink-0">
                            <Video size={9} /> Live
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 text-center space-y-1">
                        <div
                          className={`w-9 h-9 rounded-lg mx-auto flex items-center justify-center font-mono font-bold text-xs border ${
                            isSpeaking
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-white dark:bg-[#161a22] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
                          }`}
                        >
                          {sp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {sp.name}
                        </div>
                      </div>
                    )}

                    <div className="px-2.5 py-1.5 bg-white dark:bg-[#161a22] border-t border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between text-[9px] font-mono">
                      <span className="text-slate-500 dark:text-slate-400 truncate">{sp.role}</span>
                      <span
                        className={`font-semibold flex items-center gap-0.5 shrink-0 ${
                          isSpeaking ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                        }`}
                      >
                        <Mic size={9} />
                        <span>{isSpeaking ? 'Speaking' : 'Stage'}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Town Hall Floor Q&A Ledger */}
          <div className="p-3.5 sm:p-4 flex-1 overflow-y-auto space-y-2 bg-[#f8f9fa] dark:bg-[#0e1116]">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              <span>Live Citizen Floor Q&amp;A &amp; Multimedia Evidence</span>
              <span>SHA-256 Transcript</span>
            </div>
            {barazaChat.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{c.sender}</span>
                  <span className="text-slate-400 dark:text-slate-500">{c.time}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{c.text}</p>
                {c.mediaBadge && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400">
                    <Camera size={10} />
                    <span>{c.mediaBadge}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Studio Bottom Video, Audio & Multimedia Controls */}
          <div className="p-3.5 border-t border-[#e3e6ea] dark:border-[#262b36] bg-white dark:bg-[#161a22] space-y-2.5 shrink-0">
            {/* Quick Multimedia Evidence Attachment for Live Baraza Floor */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[9.5px] font-mono text-slate-400 uppercase mr-1">Attach to Floor:</span>
              {[
                { label: 'Photo', badge: 'Live Photo Evidence Attached', icon: ImageIcon },
                { label: 'Video Clip', badge: 'Field Video Clip Attached', icon: Video },
                { label: 'Voice Note', badge: 'Audio Testimony Attached', icon: Mic },
                { label: 'Doc/PDF', badge: 'Procurement PDF Attached', icon: FileText },
                { label: 'GPS Pin', badge: 'Verified GPS Coordinates Attached', icon: MapPin },
              ].map((item) => {
                const Icon = item.icon;
                const isSel = barazaMediaTag === item.badge;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setBarazaMediaTag(isSel ? null : item.badge);
                      if (!isSel) toast(`${item.label} staged for your Baraza floor contribution`, 'emerald');
                    }}
                    className={`px-2 py-1 rounded-md border text-[9.5px] font-mono font-semibold flex items-center gap-1 cursor-pointer ${
                      isSel
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                        : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon size={10} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!barazaQuestion.trim() && !barazaMediaTag) return;
                setBarazaChat((prev) => [
                  ...prev,
                  {
                    id: 'bc-' + Date.now(),
                    sender: `${activeUser.name || 'Verified Citizen'} (Floor Intervention)`,
                    text: barazaQuestion.trim() || 'Submitted multimedia field evidence to the live Baraza stage.',
                    time: 'Just now',
                    mediaBadge: barazaMediaTag || undefined,
                  },
                ]);
                setBarazaQuestion('');
                setBarazaMediaTag(null);
                toast('Contribution logged to Live Digital Baraza stage!', 'emerald');
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={barazaQuestion}
                onChange={(e) => setBarazaQuestion(e.target.value)}
                placeholder="Submit floor question, SLA inquiry, or multimedia evidence to stage..."
                className="flex-1 bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold cursor-pointer"
              >
                Send
              </button>
            </form>

            <div className="flex items-center justify-between gap-2 pt-0.5 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setMicMuted(!micMuted);
                    toast(micMuted ? 'Microphone unmuted for floor intervention' : 'Microphone muted', 'emerald');
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold flex items-center gap-1.5 border cursor-pointer transition-colors ${
                    !micMuted
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  {micMuted ? <MicOff size={12} strokeWidth={1.75} /> : <Mic size={12} strokeWidth={1.75} />}
                  <span>{micMuted ? 'Mic Muted' : 'Mic Live'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCameraOn(!cameraOn);
                    if (!cameraOn) setBarazaViewMode('video');
                    toast(
                      !cameraOn
                        ? 'Live Citizen Video Camera enabled on Baraza Stage!'
                        : 'Video Camera turned off',
                      'emerald'
                    );
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold flex items-center gap-1.5 border cursor-pointer transition-colors ${
                    cameraOn
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  {cameraOn ? <Video size={12} strokeWidth={1.75} /> : <VideoOff size={12} strokeWidth={1.75} />}
                  <span>{cameraOn ? 'Camera ON' : 'Join Video'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setHandRaised(!handRaised);
                    toast(
                      !handRaised
                        ? 'Hand raised! Moderator notified to grant floor mic/camera.'
                        : 'Hand lowered',
                      'emerald'
                    );
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-mono font-semibold flex items-center gap-1.5 border cursor-pointer transition-colors ${
                    handRaised
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40'
                      : 'bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-700 dark:text-slate-300 border-[#e3e6ea] dark:border-[#262b36]'
                  }`}
                >
                  <Hand size={12} strokeWidth={1.75} />
                  <span>{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
                Statutory Video &amp; Audio Ledger
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 6. HOST / START NEW DIGITAL BARAZA STUDIO MODAL (WITH LIVE VIDEO & FIELD CAM OPTIONS)
  const renderHostBarazaModal = () => {
    if (!hostBarazaModalOpen) return null;
    const cCode = activeUser.country || 'UG';
    const cInfo = COUNTRIES[cCode] || COUNTRIES.UG;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] rounded-xl max-w-md w-full shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
          <div className="px-4 py-3.5 bg-[#f8f9fa] dark:bg-[#0e1116] border-b border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Video size={14} strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold">Start Live Video or Audio Digital Baraza</h3>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {cCode} · {cInfo.name} Public Broadcast Studio
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHostBarazaModalOpen(false)}
              className="w-7 h-7 rounded-lg bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <X size={14} strokeWidth={1.75} />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newBarazaTitle.trim()) {
                toast('Please enter a title for the Digital Baraza', 'amber');
                return;
              }
              createTownHall({
                title: newBarazaTitle,
                topic_tag: newBarazaTag,
                dept_name: newBarazaDept,
                co_host_name: newBarazaCoHost,
                has_video: newBarazaMode !== 'audio_low_data',
                broadcast_mode: newBarazaMode,
              });
              setNewBarazaTitle('');
            }}
            className="p-4 space-y-3"
          >
            {/* Broadcast Mode Selector: HD Video Stage vs Field Inspection Camera vs Low-Data Audio */}
            <div>
              <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                1. Select Broadcast Mode (Video or Audio)
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'video_stage', label: 'HD Video Stage', sub: 'Multi-Speaker Cam', icon: Video },
                  { id: 'field_cam', label: 'Field Site Cam', sub: 'On-Site Inspection', icon: Camera },
                  { id: 'audio_low_data', label: '2G/3G Audio', sub: 'Zero-Video Saver', icon: Radio },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSel = newBarazaMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setNewBarazaMode(m.id as any)}
                      className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                        isSel
                          ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white'
                          : 'bg-[#f8f9fa] dark:bg-[#0e1116] border-[#e3e6ea] dark:border-[#262b36] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon size={13} className={isSel ? 'text-emerald-600 dark:text-emerald-400 mb-1' : 'mb-1'} />
                      <div className="text-[10px] font-mono font-bold leading-tight">{m.label}</div>
                      <div className="text-[8.5px] font-mono text-slate-400 truncate mt-0.5">{m.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                2. Baraza Agenda / Session Title *
              </label>
              <input
                type="text"
                value={newBarazaTitle}
                onChange={(e) => setNewBarazaTitle(e.target.value)}
                placeholder="e.g. Ward Road & Water SLA Accountability Assembly"
                className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Topic Hashtag
                </label>
                <input
                  type="text"
                  value={newBarazaTag}
                  onChange={(e) => setNewBarazaTag(e.target.value)}
                  placeholder="#FixOurRoads"
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  Target Desk / Ministry
                </label>
                <input
                  type="text"
                  value={newBarazaDept}
                  onChange={(e) => setNewBarazaDept(e.target.value)}
                  placeholder="Municipal Works"
                  className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Invited Panelist / Officer on Stage
              </label>
              <input
                type="text"
                value={newBarazaCoHost}
                onChange={(e) => setNewBarazaCoHost(e.target.value)}
                placeholder="e.g. District CAO / Chief Engineer"
                className="w-full bg-[#f8f9fa] dark:bg-[#0e1116] border border-[#e3e6ea] dark:border-[#262b36] rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setHostBarazaModalOpen(false)}
                className="px-3 py-2 rounded-lg border border-[#e3e6ea] dark:border-[#262b36] text-xs font-mono text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {newBarazaMode === 'audio_low_data' ? <Radio size={13} /> : <Video size={13} />}
                <span>
                  {newBarazaMode === 'audio_low_data'
                    ? 'Launch Audio Room'
                    : newBarazaMode === 'field_cam'
                    ? 'Launch Live Field Cam'
                    : 'Launch Live Video Stage'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderNotificationModal()}
      {renderDmModal()}
      {renderPublicProfileModal()}
      {renderSocialActionModal()}
      {renderTownHallModal()}
      {renderHostBarazaModal()}
    </>
  );
};
