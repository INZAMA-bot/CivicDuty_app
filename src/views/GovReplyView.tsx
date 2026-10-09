import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getDept, pathStr, timeAgo } from '../utils/helpers';
import { ChevronLeft, Lock, Upload, FileText } from 'lucide-react';
import { MediaCard } from '../components/MediaCard';
import { NoteBox } from '../components/NoteBox';
import { TicketStatus } from '../types';

export const GovReplyView: React.FC = () => {
  const { user, activePost, go, addCommentToPost, updatePostStatus, logAudit, addPoints, toast } = useApp();

  const [status, setStatus] = useState<TicketStatus>('received');
  const [replyText, setReplyText] = useState('');
  const [stagedProof, setStagedProof] = useState<
    { type: 'image' | 'video' | 'doc'; url: string; name: string; size: string }[]
  >([]);

  useEffect(() => {
    if (!activePost || !user || user.role === 'read_only') {
      go('gov_inbox');
    }
  }, [activePost, user, go]);

  if (!activePost || !user || user.role === 'read_only') {
    return null;
  }

  const p = activePost;
  const d = getDept(user.country, user.dept || 'kcca');
  const isCorrupt = p.category === 'corruption';
  const canResolve = stagedProof.length > 0;

  const handleProofSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = Array.from(e.target.files);
    const items = files.map((f: File) => {
      const url = URL.createObjectURL(f);
      const type = f.type.includes('image') ? ('image' as const) : f.type.includes('video') ? ('video' as const) : ('doc' as const);
      return {
        type,
        url,
        name: f.name,
        size: (f.size / 1024).toFixed(0) + 'KB',
      };
    });
    setStagedProof((prev) => [...prev, ...items]);
    e.target.value = '';
  };

  const removeProof = (idx: number) => {
    setStagedProof((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (resolve: boolean) => {
    if (!replyText.trim()) {
      toast('Response text required', 'red');
      return;
    }
    if (resolve && !canResolve) {
      toast('Upload proof to resolve', 'red');
      return;
    }

    const proofMedia = stagedProof.map((m) => {
      if (m.type === 'image') return { type: 'image' as const, url: m.url, caption: '' };
      if (m.type === 'video') return { type: 'video' as const, url: m.url, thumb: m.url, duration: '0:30' };
      return { type: 'doc' as const, name: m.name, size: m.size };
    });

    const comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: `${user.real_title_short || d.name} · ${user.scope_label || ''}`,
      role: 'gov' as const,
      body: replyText.trim(),
      status_tag: resolve ? ('resolved' as TicketStatus) : status,
      media: proofMedia,
      created_at: new Date().toISOString(),
      helpful: 0,
      not_helpful: 0,
    };

    addCommentToPost(p.id, comment);

    if (resolve) {
      updatePostStatus(p.id, 'resolved');
      logAudit('resolve', p.id, `Resolved with ${proofMedia.length} proof file(s)`);
      if (p.citizen_id) {
        addPoints(p.citizen_id, 250, '+250pts · Issue resolved by GOV');
      }
      toast('Resolved — citizen notified to confirm', 'emerald');
    } else {
      updatePostStatus(p.id, status);
      logAudit('reply', p.id, `Status → ${status}${proofMedia.length ? `, ${proofMedia.length} proof file(s)` : ''}`);
      toast('Response posted', 'amber');
    }

    go('gov_inbox');
  };

  const govStatuses: { id: TicketStatus; label: string }[] = [
    { id: 'received', label: 'Received' },
    { id: 'investigating', label: 'Investigating' },
    { id: 'budget', label: 'Budget Allocated' },
    { id: 'cannot', label: 'Cannot Fix' },
  ];

  return (
    <div className="p-4 sm:p-5 space-y-4 animate-fade-in pb-16 max-w-2xl mx-auto text-slate-900 dark:text-slate-100">
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2.5">
        <button
          onClick={() => go('gov_inbox')}
          className="flex items-center gap-1 text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} /> Official Inbox
        </button>
        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
          Official Response Desk
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
          {user.real_title_short || d.name}
        </h2>
        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
          {user.role_label || ''} · {user.scope_label || ''}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-1.5" style={{ borderLeft: `3px solid ${isCorrupt ? '#f43f5e' : '#10b981'}` }}>
        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Responding to</p>
        <h4 className={`text-sm font-bold ${isCorrupt ? 'text-rose-700 dark:text-rose-200' : 'text-slate-900 dark:text-slate-100'}`}>{p.title}</h4>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">{p.body}</p>
        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1">
          {p.citizen_name} · {timeAgo(p.created_at)}
        </p>
        <div className="path-crumb">{pathStr(p.country, p.territory)}</div>
      </div>

      {p.media && p.media.length > 0 && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-2">
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Citizen Evidence</p>
          <MediaCard media={p.media} postId={p.id + '-ref'} onToast={(msg) => toast(msg)} />
        </div>
      )}

      {isCorrupt && (
        <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/30 space-y-1">
          <p className="text-[10.5px] font-mono text-rose-700 dark:text-rose-300 font-semibold uppercase">Anti-Corruption Response Protocol</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            This response is elevated. Upload all supporting documentation. Do not dismiss without written reason.
          </p>
        </div>
      )}

      {/* Response & Evidence Studio Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#161a22] border border-[#e3e6ea] dark:border-[#262b36] space-y-4">
        {/* Status Picker */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">Update Status</label>
          <div className="grid grid-cols-2 gap-2">
            {govStatuses.map((s) => (
              <button
                key={s.id}
                onClick={() => setStatus(s.id)}
                className={`py-2 px-3 rounded-lg text-[10.5px] font-mono font-semibold border transition-colors cursor-pointer ${
                  status === s.id
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
            Resolved is not a status you pick — it is the second button below, and it requires proof.
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">Official Response</label>
          <textarea
            rows={5}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="State the action taken, current status, and expected resolution timeline."
            className="w-full px-3 py-2 text-xs leading-relaxed resize-none rounded-lg border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          ></textarea>
        </div>

        {/* Proof Evidence Upload */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
            Evidence / Proof <span className={isCorrupt ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-500'}>({isCorrupt ? 'Required' : 'Required to Resolve'})</span>
          </label>

          <label className="drop-zone block cursor-pointer">
            <input
              type="file"
              accept="image/*,video/*,.pdf"
              className="hidden"
              multiple
              onChange={handleProofSelect}
            />
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
              <Upload size={16} /> <span className="text-xs font-mono font-medium">Upload proof, work orders, photos, documents</span>
            </div>
          </label>

          {stagedProof.length > 0 && (
            <div className="space-y-2 mt-2">
              {stagedProof.map((m, idx) => (
                <div key={idx} className="doc-card">
                  <div className="doc-icon text-emerald-600 dark:text-emerald-400">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{m.name}</div>
                    <div className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">{m.type} · {m.size}</div>
                  </div>
                  <button onClick={() => removeProof(idx)} className="text-[10px] font-mono text-rose-600 dark:text-rose-400 hover:underline px-2 font-semibold cursor-pointer">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {!canResolve && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 font-semibold">
              <Lock size={12} /> Upload proof to enable Resolve
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => handleSubmit(false)}
            className="w-full border border-[#e3e6ea] dark:border-[#262b36] bg-[#f8f9fa] dark:bg-[#0e1116] hover:bg-[#f1f3f4] dark:hover:bg-[#1e232d] text-slate-800 dark:text-slate-200 font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono transition-colors cursor-pointer"
          >
            Post Response (Status Update)
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={!canResolve}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg py-2.5 text-xs uppercase tracking-wider font-mono transition-colors ${
              canResolve ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'
            }`}
          >
            Post + Mark Resolved
          </button>
        </div>
      </div>

      <NoteBox
        tone="red"
        title="Why Proof Gates Resolution"
        text="Proof files reference the comment, so they must exist alongside it. Resolving without proof would leave a ticket marked resolved with no evidence behind it whenever an upload failed — the exact fake closure this rule exists to prevent."
      />
    </div>
  );
};
